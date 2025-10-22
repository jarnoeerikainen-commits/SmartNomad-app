import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Home, 
  Wifi, 
  Heart, 
  Plane, 
  Briefcase, 
  Package, 
  Truck,
  Scale,
  Wallet,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { GLOBAL_CITIES, CITY_SERVICES } from '@/data/globalCities';
import { ServiceCategory } from '@/types/cityServices';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ServiceCoverageAnalyzerProps {
  onCitySelect: (cityId: string) => void;
}

const ServiceCoverageAnalyzer = ({ onCitySelect }: ServiceCoverageAnalyzerProps) => {
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>([]);

  const serviceOptions: { category: ServiceCategory; label: string; icon: any }[] = [
    { category: 'accommodation', label: 'Co-Living Spaces', icon: Home },
    { category: 'internet', label: 'Premium WiFi', icon: Wifi },
    { category: 'healthcare', label: 'Health Insurance', icon: Heart },
    { category: 'transportation', label: 'Airport Lounges', icon: Plane },
    { category: 'professional', label: 'Co-Working', icon: Briefcase },
    { category: 'logistics', label: 'Laundry Services', icon: Package },
    { category: 'delivery', label: 'Food Delivery', icon: Truck },
    { category: 'legal', label: 'Immigration Help', icon: Scale },
    { category: 'financial', label: 'Multi-Currency Banking', icon: Wallet },
    { category: 'community', label: 'Nomad Network', icon: Users },
  ];

  const toggleService = (category: ServiceCategory) => {
    setSelectedServices(prev =>
      prev.includes(category)
        ? prev.filter(s => s !== category)
        : [...prev, category]
    );
  };

  // Calculate matches
  const cityMatches = GLOBAL_CITIES.map(city => {
    const cityServices = CITY_SERVICES.filter(s => s.cityId === city.id);
    const availableCount = selectedServices.filter(reqService =>
      cityServices.some(s => 
        s.serviceCategory === reqService && 
        (s.availabilityStatus === 'available' || s.availabilityStatus === 'partial')
      )
    ).length;
    
    const matchPercentage = selectedServices.length > 0 
      ? (availableCount / selectedServices.length) * 100 
      : 100;

    return {
      city,
      matchPercentage,
      availableCount,
      totalRequired: selectedServices.length,
      cityServices: cityServices.filter(s => selectedServices.includes(s.serviceCategory))
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);

  const perfectMatches = cityMatches.filter(m => m.matchPercentage === 100).slice(0, 10);
  const goodMatches = cityMatches.filter(m => m.matchPercentage >= 70 && m.matchPercentage < 100).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Service Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Select Services You Need</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceOptions.map(({ category, label, icon: Icon }) => (
              <div
                key={category}
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => toggleService(category)}
              >
                <Checkbox
                  id={category}
                  checked={selectedServices.includes(category)}
                  onCheckedChange={() => toggleService(category)}
                />
                <Label
                  htmlFor={category}
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{label}</span>
                </Label>
              </div>
            ))}
          </div>

          {selectedServices.length > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedServices([])}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Results */}
      {selectedServices.length === 0 ? (
        <Card className="p-12 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Select Services to Find Matches</h3>
          <p className="text-muted-foreground">
            Choose the services you need to discover cities with the best coverage
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Perfect Matches */}
          {perfectMatches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h3 className="text-xl font-bold">Perfect Matches</h3>
                <Badge variant="secondary">{perfectMatches.length} cities</Badge>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                  {perfectMatches.map(({ city, cityServices }) => (
                    <Card
                      key={city.id}
                      className="p-6 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => onCitySelect(city.id)}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-bold">{city.cityName}</h4>
                            <p className="text-sm text-muted-foreground">{city.countryName}</p>
                          </div>
                          <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                            100% Match
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Coverage Score:</span>
                          <span className="font-bold text-primary">{city.coverageScore}/100</span>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="text-sm font-medium mb-2">Available Services:</div>
                          <div className="flex flex-wrap gap-1">
                            {cityServices.map(service => (
                              <Badge key={service.id} variant="outline" className="text-xs">
                                {service.serviceType.split(' ')[0]}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full" size="sm">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Good Alternatives */}
          {goodMatches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <h3 className="text-xl font-bold">Good Alternatives</h3>
                <Badge variant="secondary">{goodMatches.length} cities</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goodMatches.map(({ city, matchPercentage, availableCount, totalRequired }) => (
                  <Card
                    key={city.id}
                    className="p-6 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => onCitySelect(city.id)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-bold">{city.cityName}</h4>
                          <p className="text-sm text-muted-foreground">{city.countryName}</p>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300">
                          {Math.round(matchPercentage)}% Match
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {availableCount} of {totalRequired} services available
                      </div>

                      <Button className="w-full" variant="outline" size="sm">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {perfectMatches.length === 0 && goodMatches.length === 0 && (
            <Card className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
              <p className="text-muted-foreground">
                Try selecting fewer services or different combinations
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceCoverageAnalyzer;
