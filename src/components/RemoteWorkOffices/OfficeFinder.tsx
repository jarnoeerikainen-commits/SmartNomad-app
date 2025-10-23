import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Search, 
  MapPin, 
  Star, 
  ExternalLink, 
  Wifi, 
  Coffee, 
  Users, 
  Clock, 
  Filter,
  X,
  Globe,
  Navigation,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import RemoteOfficesService from '@/services/RemoteOfficesService';
import LocationService from '@/services/LocationService';
import { City, OfficeProvider, BookingType } from '@/types/remoteOffices';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';

const OfficeFinder = () => {
  const { t } = useLanguage();
  
  // State
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [providers, setProviders] = useState<OfficeProvider[]>([]);
  const [popularCities, setPopularCities] = useState<City[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [minRating, setMinRating] = useState<number>(4);
  const [bookingType, setBookingType] = useState<BookingType | 'all'>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const commonAmenities = [
    'High-speed WiFi',
    'Meeting rooms',
    'Coffee & tea',
    '24/7 access',
    'Phone booths',
    'Printing'
  ];

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const popular = RemoteOfficesService.getPopularCities(12);
      setPopularCities(popular);
      
      // Load all providers initially
      const allProviders = RemoteOfficesService.getAllProviders({ minRating: 4 });
      setProviders(allProviders);
      
      setLoading(false);
    };

    initializeData();
  }, []);

  const detectCurrentLocation = async () => {
    setDetectingLocation(true);
    try {
      const hasPermission = await LocationService.requestPermission();
      if (hasPermission) {
        const location = await LocationService.getCurrentLocation();
        const nearestCity = RemoteOfficesService.findNearestCity(
          location.latitude,
          location.longitude
        );
        if (nearestCity) {
          setSelectedCity(nearestCity);
          loadProvidersForCity(nearestCity.id);
        }
      }
    } catch (error) {
      console.error('Location detection failed:', error);
    } finally {
      setDetectingLocation(false);
    }
  };

  const loadProvidersForCity = (cityId: string) => {
    const filters = {
      minRating,
      bookingType: bookingType !== 'all' ? bookingType : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    };
    const cityProviders = RemoteOfficesService.getProvidersByCity(cityId, filters);
    setProviders(cityProviders);
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return RemoteOfficesService.searchCities(searchQuery);
  }, [searchQuery]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSearchQuery('');
    loadProvidersForCity(city.id);
  };

  const clearSelection = () => {
    setSelectedCity(null);
    setProviders(RemoteOfficesService.getAllProviders({ minRating: 4 }));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  useEffect(() => {
    if (selectedCity) {
      loadProvidersForCity(selectedCity.id);
    }
  }, [minRating, bookingType, selectedAmenities]);

  const getBookingTypeLabel = (type: BookingType) => {
    const labels = {
      hour: 'Hourly',
      day: 'Daily',
      week: 'Weekly',
      month: 'Monthly'
    };
    return labels[type];
  };

  const formatPrice = (provider: OfficeProvider, type: BookingType) => {
    const price = provider.priceRange[type];
    if (!price) return null;
    return `${provider.priceRange.currency} ${price}/${type}`;
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-3xl">Remote Work Offices</CardTitle>
              <CardDescription className="text-base mt-1">
                Discover premium coworking spaces and office rentals worldwide
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Detection & Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by city or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && searchResults.length > 0 && (
                <Card className="absolute z-10 w-full mt-2 max-h-64 overflow-auto">
                  <CardContent className="p-2">
                    {searchResults.map(city => (
                      <Button
                        key={city.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleCitySelect(city)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {city.name}, {city.country}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
            <Button
              onClick={detectCurrentLocation}
              disabled={detectingLocation}
              variant="outline"
              className="gap-2"
            >
              <Navigation className="h-4 w-4" />
              {detectingLocation ? 'Detecting...' : 'Near Me'}
            </Button>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? "default" : "outline"}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Selected City */}
          {selectedCity && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {selectedCity.name}, {selectedCity.country}
              </span>
              <Badge variant="secondary" className="ml-2">
                {providers.length} {providers.length === 1 ? 'office' : 'offices'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <Card className="border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Rating Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Rating</label>
                    <Select
                      value={minRating.toString()}
                      onValueChange={(value) => setMinRating(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4.0+ ⭐</SelectItem>
                        <SelectItem value="4.3">4.3+ ⭐⭐</SelectItem>
                        <SelectItem value="4.5">4.5+ ⭐⭐⭐</SelectItem>
                        <SelectItem value="4.7">4.7+ ⭐⭐⭐⭐</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Booking Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Booking Type</label>
                    <Select
                      value={bookingType}
                      onValueChange={(value) => setBookingType(value as BookingType | 'all')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="hour">Hourly</SelectItem>
                        <SelectItem value="day">Daily</SelectItem>
                        <SelectItem value="week">Weekly</SelectItem>
                        <SelectItem value="month">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Amenities Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonAmenities.map(amenity => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <label
                          htmlFor={amenity}
                          className="text-sm cursor-pointer"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Popular Cities */}
      {!selectedCity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Popular Cities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularCities.map(city => (
                <Button
                  key={city.id}
                  variant="outline"
                  onClick={() => handleCitySelect(city)}
                  className="gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  {city.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Office Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map(provider => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{provider.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{provider.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({provider.reviews.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <CardDescription className="mt-2">
                {provider.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Booking Types & Prices */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </div>
                <div className="flex flex-wrap gap-2">
                  {provider.bookingTypes.map(type => {
                    const price = formatPrice(provider, type);
                    return price ? (
                      <Badge key={type} variant="secondary">
                        {price}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Coffee className="h-4 w-4" />
                  Amenities
                </div>
                <div className="flex flex-wrap gap-1">
                  {provider.amenities.slice(0, 5).map(amenity => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {provider.amenities.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{provider.amenities.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Cities Count */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Available in {provider.cities.length} {provider.cities.length === 1 ? 'city' : 'cities'}
              </div>

              {/* Action Button */}
              <Button
                className="w-full gap-2"
                onClick={() => window.open(provider.website, '_blank')}
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {providers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No offices found</p>
            <p className="text-muted-foreground">
              Try adjusting your filters or selecting a different city
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OfficeFinder;
