import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  XCircle, 
  Star, 
  Users,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { getCityById, getServicesForCity } from '@/data/globalCities';
import { ServiceStatus } from '@/types/cityServices';

interface CityServiceDashboardProps {
  cityId: string;
}

const CityServiceDashboard = ({ cityId }: CityServiceDashboardProps) => {
  const city = getCityById(cityId);
  const services = getServicesForCity(cityId);

  if (!city) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">City not found</p>
      </Card>
    );
  }

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'planned':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'not_available':
        return <XCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: ServiceStatus) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'partial':
        return 'Partial';
      case 'planned':
        return 'Coming Soon';
      case 'not_available':
        return 'Not Available';
    }
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'planned':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'not_available':
        return 'bg-muted text-muted-foreground';
    }
  };

  const availableServices = services.filter(s => s.availabilityStatus === 'available').length;
  const totalServices = 10; // Standard service categories

  return (
    <div className="space-y-6">
      {/* City Header */}
      <Card className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{city.cityName}</h2>
              <p className="text-xl text-muted-foreground">{city.countryName}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{city.timezone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{(city.metroPopulation / 1000000).toFixed(1)}M people</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {city.coverageScore}
                </div>
                <div className="text-sm text-muted-foreground">Coverage Score</div>
              </div>
            </Card>

            <div className="flex items-center gap-2">
              <Progress value={(availableServices / totalServices) * 100} className="flex-1" />
              <span className="text-sm font-medium whitespace-nowrap">
                {availableServices}/{totalServices} services
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Services Grid */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Service Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <Card key={service.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(service.availabilityStatus)}
                      <h4 className="font-semibold">{service.serviceType}</h4>
                    </div>
                    <Badge className={getStatusColor(service.availabilityStatus)}>
                      {getStatusLabel(service.availabilityStatus)}
                    </Badge>
                  </div>
                </div>

                {service.availabilityStatus !== 'not_available' && (
                  <div className="space-y-2 text-sm">
                    {service.providerCount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Providers:</span>
                        <span className="font-medium">{service.providerCount}</span>
                      </div>
                    )}
                    
                    {service.userRating && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium">{service.userRating.toFixed(1)}</span>
                        </div>
                      </div>
                    )}

                    {service.responseTimeMinutes !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Response:</span>
                        <span className="font-medium">~{service.responseTimeMinutes}min</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm text-muted-foreground pt-2 border-t">
                  {service.coverageNotes}
                </p>

                {service.availabilityStatus === 'available' && (
                  <Button className="w-full" variant="outline" size="sm">
                    View Providers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <Card className="p-6 bg-muted/50">
        <h4 className="text-lg font-semibold mb-3">📍 Location Details</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">Currency</div>
            <div className="font-medium">{city.currencyCode}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Language</div>
            <div className="font-medium">{city.primaryLanguage}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Timezone</div>
            <div className="font-medium">{city.timezone.split('/')[1]}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Last Updated</div>
            <div className="font-medium">{new Date(city.lastUpdated).toLocaleDateString()}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CityServiceDashboard;
