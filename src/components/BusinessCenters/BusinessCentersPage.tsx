import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BusinessCenterCard } from './BusinessCenterCard';
import { ServiceFilterChips } from './ServiceFilterChips';
import { LocationFilter } from './LocationFilter';
import { ServiceType } from '@/types/businessCenter';
import BusinessCentersService from '@/services/BusinessCentersService';
import LocationService from '@/services/LocationService';
import { useToast } from '@/hooks/use-toast';
import { SORT_OPTIONS } from '@/data/businessCentersData';
import { Briefcase, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BusinessCentersPage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [sortBy, setSortBy] = useState<'proximity' | 'rating' | 'reviews'>('proximity');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const { toast } = useToast();

  // Detect user location on mount
  useEffect(() => {
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    try {
      setLoading(true);
      const location = await LocationService.getCurrentLocation();
      setUserLocation({ lat: location.latitude, lng: location.longitude });

      // Find nearest city
      const nearestCity = BusinessCentersService.findNearestCity(
        location.latitude,
        location.longitude
      );
      
      setSelectedCountryCode(nearestCity.countryCode);
      setSelectedCityId(nearestCity.id);

      toast({
        title: '📍 Location Detected',
        description: `Showing business centers near ${nearestCity.name}, ${nearestCity.country}`,
      });
    } catch (error) {
      console.error('Error detecting location:', error);
      toast({
        title: 'Location Access',
        description: 'Could not detect your location. Please select manually.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (service: ServiceType) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleMyLocation = () => {
    detectUserLocation();
  };

  // Search and filter business centers
  const businessCenters = useMemo(() => {
    return BusinessCentersService.searchBusinessCenters({
      cityId: selectedCityId,
      countryCode: selectedCountryCode,
      services: selectedServices.length > 0 ? selectedServices : undefined,
      minRating: 4.0,
      sortBy,
      userLocation: userLocation || undefined,
    });
  }, [selectedCityId, selectedCountryCode, selectedServices, sortBy, userLocation]);

  const selectedCity = selectedCityId
    ? BusinessCentersService.getCities().find(c => c.id === selectedCityId)
    : null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-32 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Briefcase className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Business Centers</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Find reliable printing, fax, computer use, and shipping services worldwide
        </p>
      </div>

      {/* Filters Card */}
      <Card className="mb-6 shadow-medium">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Filter className="w-5 h-5" />
              Search & Filter
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className={`space-y-6 ${showFilters ? '' : 'hidden md:block'}`}>
          {/* Location Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              📍 Location
            </label>
            <LocationFilter
              selectedCountryCode={selectedCountryCode}
              selectedCityId={selectedCityId}
              onCountryChange={setSelectedCountryCode}
              onCityChange={setSelectedCityId}
              onMyLocation={handleMyLocation}
            />
          </div>

          {/* Services Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              🛠️ Services Needed
            </label>
            <ServiceFilterChips
              selectedServices={selectedServices}
              onToggle={handleServiceToggle}
            />
          </div>

          {/* Sort Options */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              🔄 Sort By
            </label>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Business Centers
          {selectedCity && ` in ${selectedCity.name}, ${selectedCity.country}`}
        </h2>
        <p className="text-muted-foreground mt-1">
          Found {businessCenters.length} location{businessCenters.length !== 1 ? 's' : ''}
          {selectedServices.length > 0 && ` with selected services`}
        </p>
      </div>

      {/* Results Grid */}
      {businessCenters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businessCenters.map(center => (
            <BusinessCenterCard key={center.id} center={center} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Business Centers Found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or selecting a different location.
            </p>
            <Button variant="outline" onClick={() => {
              setSelectedServices([]);
              setSelectedCityId('');
              setSelectedCountryCode('');
            }}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quality Guarantee Banner */}
      <Card className="mt-8 border-primary/20 bg-primary/5">
        <CardContent className="py-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            ✅ Quality Guarantee
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• All centers rated 4.0+ stars with verified reviews</li>
            <li>• Real-time availability and operating hours</li>
            <li>• Direct contact and navigation to locations</li>
            <li>• Professional services with reliable equipment</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
