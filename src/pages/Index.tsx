
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Settings, Bell, Timer, Globe } from 'lucide-react';
import CountryCard from '@/components/CountryCard';
import AddCountryModal from '@/components/AddCountryModal';
import LocationService from '@/services/LocationService';
import { Country, LocationData } from '@/types/country';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const { toast } = useToast();

  // Load saved data on component mount
  useEffect(() => {
    const savedCountries = localStorage.getItem('travelCountries');
    if (savedCountries) {
      setCountries(JSON.parse(savedCountries));
    }
    
    // Request location permission
    LocationService.requestPermission()
      .then((granted) => {
        if (granted) {
          setIsLocationEnabled(true);
          LocationService.getCurrentLocation()
            .then(setCurrentLocation)
            .catch((error) => {
              toast({
                title: "Location Error",
                description: "Could not get current location. Please check your GPS settings.",
                variant: "destructive"
              });
            });
        }
      });
  }, [toast]);

  // Auto-track current country
  useEffect(() => {
    if (currentLocation && isLocationEnabled) {
      const currentCountryCode = currentLocation.country_code;
      const existingCountry = countries.find(c => c.code === currentCountryCode);
      
      if (existingCountry) {
        updateCountryDays(currentCountryCode);
      }
    }
  }, [currentLocation, countries, isLocationEnabled]);

  // Save countries to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('travelCountries', JSON.stringify(countries));
  }, [countries]);

  const updateCountryDays = (countryCode: string) => {
    const today = new Date().toDateString();
    
    setCountries(prev => prev.map(country => {
      if (country.code === countryCode) {
        const lastUpdate = country.lastUpdate;
        if (lastUpdate !== today) {
          const newDaysSpent = country.daysSpent + 1;
          const progress = (newDaysSpent / country.dayLimit) * 100;
          
          // Check for warnings
          if (progress >= 90 && progress < 100) {
            toast({
              title: "⚠️ Warning",
              description: `You're approaching your limit in ${country.name}! ${country.dayLimit - newDaysSpent} days remaining.`,
              variant: "destructive"
            });
          } else if (progress >= 100) {
            toast({
              title: "🚨 Limit Exceeded",
              description: `You've exceeded your day limit in ${country.name}!`,
              variant: "destructive"
            });
          }
          
          return {
            ...country,
            daysSpent: newDaysSpent,
            lastUpdate: today
          };
        }
      }
      return country;
    }));
  };

  const addCountry = (newCountry: Omit<Country, 'id' | 'daysSpent' | 'lastUpdate'>) => {
    const country: Country = {
      ...newCountry,
      id: Date.now().toString(),
      daysSpent: 0,
      lastUpdate: null
    };
    
    setCountries(prev => [...prev, country]);
    setIsAddModalOpen(false);
    
    toast({
      title: "Country Added",
      description: `${newCountry.name} has been added to your tracking list.`,
    });
  };

  const removeCountry = (id: string) => {
    setCountries(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Country Removed",
      description: "Country has been removed from tracking.",
    });
  };

  const updateCountryLimit = (id: string, newLimit: number) => {
    setCountries(prev => prev.map(c => 
      c.id === id ? { ...c, dayLimit: newLimit } : c
    ));
  };

  const resetCountryDays = (id: string) => {
    setCountries(prev => prev.map(c => 
      c.id === id ? { ...c, daysSpent: 0, lastUpdate: null } : c
    ));
    toast({
      title: "Days Reset",
      description: "Country days have been reset to zero.",
    });
  };

  const getLocationStatus = () => {
    if (!isLocationEnabled) return "Location disabled";
    if (!currentLocation) return "Getting location...";
    return `${currentLocation.city}, ${currentLocation.country}`;
  };

  const getTotalActiveCountries = () => countries.length;
  const getCountriesNearLimit = () => countries.filter(c => (c.daysSpent / c.dayLimit) >= 0.8).length;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Travel Day Tracker
          </h1>
          <p className="text-muted-foreground">
            Monitor your stay duration in different countries for visa and tax compliance
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Current Location</p>
                  <p className="text-sm text-green-700">{getLocationStatus()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Tracked Countries</p>
                  <p className="text-sm text-blue-700">{getTotalActiveCountries()} active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium">Near Limits</p>
                  <p className="text-sm text-orange-700">{getCountriesNearLimit()} countries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="gradient-success text-white hover:opacity-90 transition-all duration-200 shadow-lg"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Country to Track
          </Button>
        </div>

        {/* Countries Grid */}
        {countries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {countries.map(country => (
              <CountryCard
                key={country.id}
                country={country}
                isCurrentLocation={currentLocation?.country_code === country.code}
                onRemove={removeCountry}
                onUpdateLimit={updateCountryLimit}
                onReset={resetCountryDays}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-12 text-center">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Countries Tracked</h3>
              <p className="text-gray-500 mb-6">
                Add countries you want to monitor for visa or tax day limits
              </p>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                variant="outline"
                className="border-green-300 text-green-600 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Country
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Country Modal */}
        <AddCountryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addCountry}
          existingCountries={countries}
        />
      </div>
    </div>
  );
};

export default Index;
