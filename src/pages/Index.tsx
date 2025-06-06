import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Settings, Bell, Timer, Globe } from 'lucide-react';
import CountryCard from '@/components/CountryCard';
import EnhancedAddCountryModal from '@/components/EnhancedAddCountryModal';
import PricingCard from '@/components/PricingCard';
import PassportManager from '@/components/PassportManager';
import ExpenseTracker from '@/components/ExpenseTracker';
import LocationService from '@/services/LocationService';
import EnhancedLocationService from '@/services/EnhancedLocationService';
import { Country, LocationData } from '@/types/country';
import { Subscription } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';
import CircularDashboard from '@/components/CircularDashboard';
import ExcelExport from '@/components/ExcelExport';
import VPNDetectionModal from '@/components/VPNDetectionModal';

const Index = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [previousLocation, setPreviousLocation] = useState<LocationData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [subscription, setSubscription] = useState<Subscription>({
    tier: 'free',
    isActive: true,
    expiryDate: null,
    features: []
  });
  const { toast } = useToast();
  const [isVPNModalOpen, setIsVPNModalOpen] = useState(false);
  const [vpnDetectionData, setVPNDetectionData] = useState<{
    location: LocationData | null;
    duration: number;
  }>({ location: null, duration: 0 });
  const [isBackgroundTrackingEnabled, setIsBackgroundTrackingEnabled] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);

  // Load saved data on component mount
  useEffect(() => {
    const savedCountries = localStorage.getItem('travelCountries');
    const savedPreviousLocation = localStorage.getItem('previousLocation');
    const savedSubscription = localStorage.getItem('subscription');
    
    if (savedCountries) {
      setCountries(JSON.parse(savedCountries));
    }
    
    if (savedPreviousLocation) {
      setPreviousLocation(JSON.parse(savedPreviousLocation));
    }

    if (savedSubscription) {
      setSubscription(JSON.parse(savedSubscription));
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

  // Auto-track current country and detect entries/exits
  useEffect(() => {
    if (currentLocation && isLocationEnabled) {
      const currentCountryCode = currentLocation.country_code;
      const previousCountryCode = previousLocation?.country_code;
      
      // Detect country change (entry/exit)
      if (previousCountryCode && previousCountryCode !== currentCountryCode) {
        handleCountryChange(previousCountryCode, currentCountryCode);
      }
      
      const existingCountry = countries.find(c => c.code === currentCountryCode);
      if (existingCountry) {
        updateCountryDays(currentCountryCode);
      }
      
      // Save current location as previous for next comparison
      setPreviousLocation(currentLocation);
      localStorage.setItem('previousLocation', JSON.stringify(currentLocation));
    }
  }, [currentLocation, countries, isLocationEnabled, previousLocation]);

  // Save countries to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('travelCountries', JSON.stringify(countries));
  }, [countries]);

  // Enhanced location tracking setup
  useEffect(() => {
    const initializeEnhancedTracking = async () => {
      try {
        const hasPermissions = await EnhancedLocationService.requestBackgroundPermissions();
        if (hasPermissions) {
          setIsLocationEnabled(true);
          
          // Start background tracking
          await EnhancedLocationService.startBackgroundTracking((location, vpnInfo) => {
            setCurrentLocation(location);
            
            // Handle VPN detection
            if (vpnInfo?.isVPNActive && vpnInfo.vpnDuration > 3600000) { // 1 hour
              setVPNDetectionData({
                location: vpnInfo.realLocation || location,
                duration: vpnInfo.vpnDuration
              });
              setIsVPNModalOpen(true);
            }
          });
          
          setIsBackgroundTrackingEnabled(true);
          
          toast({
            title: "Enhanced Tracking Active",
            description: "Background location tracking with VPN detection is now running.",
          });
        } else {
          // Fallback to basic location service
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
        }
      } catch (error) {
        console.error('Enhanced tracking initialization failed:', error);
        toast({
          title: "Enhanced Tracking Failed",
          description: "Falling back to basic location tracking.",
          variant: "destructive"
        });
      }
    };

    initializeEnhancedTracking();

    // Cleanup on unmount
    return () => {
      if (isBackgroundTrackingEnabled) {
        EnhancedLocationService.stopBackgroundTracking();
      }
    };
  }, [toast]);

  const handleCountryChange = (exitedCountry: string, enteredCountry: string) => {
    const exitedCountryData = countries.find(c => c.code === exitedCountry);
    const enteredCountryData = countries.find(c => c.code === enteredCountry);
    
    // Notify about exit
    if (exitedCountryData) {
      toast({
        title: `✈️ Exited ${exitedCountryData.name}`,
        description: `You spent ${exitedCountryData.daysSpent} days there.`,
      });
    }
    
    // Notify about entry and update entry count
    if (enteredCountryData) {
      setCountries(prev => prev.map(country => {
        if (country.code === enteredCountry) {
          const newEntries = country.totalEntries + 1;
          const currentYear = new Date().getFullYear();
          const taxYearStart = new Date(currentYear, 0, 1); // January 1st
          const daysSinceYearStart = Math.floor((Date.now() - taxYearStart.getTime()) / (1000 * 60 * 60 * 24));
          const remainingDaysInYear = 365 - daysSinceYearStart;
          const taxResidenceDaysLeft = Math.max(0, 183 - country.yearlyDaysSpent); // 183 days = tax residence threshold
          
          toast({
            title: `🎯 Entered ${country.name}`,
            description: `Entry #${newEntries}. Tax residence: ${taxResidenceDaysLeft} days left this year.`,
          });
          
          return {
            ...country,
            totalEntries: newEntries,
            lastEntry: new Date().toISOString()
          };
        }
        return country;
      }));
    } else {
      // If entering a non-tracked country, notify
      toast({
        title: `📍 Entered ${currentLocation?.country}`,
        description: "This country is not being tracked. Add it to monitor your days.",
      });
    }
  };

  const updateCountryDays = (countryCode: string) => {
    const today = new Date().toDateString();
    const currentYear = new Date().getFullYear();
    const taxYearStart = new Date(currentYear, 0, 1);
    
    setCountries(prev => prev.map(country => {
      if (country.code === countryCode && country.countTravelDays) {
        const lastUpdate = country.lastUpdate;
        if (lastUpdate !== today) {
          const newDaysSpent = country.daysSpent + 1;
          const newYearlyDays = country.yearlyDaysSpent + 1;
          const progress = (newDaysSpent / country.dayLimit) * 100;
          const taxResidenceDaysLeft = Math.max(0, 183 - newYearlyDays);
          
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
          
          // Tax residence warning
          if (newYearlyDays === 150) {
            toast({
              title: "🏛️ Tax Residence Alert",
              description: `Only ${taxResidenceDaysLeft} days left before tax residence in ${country.name}!`,
              variant: "destructive"
            });
          } else if (newYearlyDays >= 183) {
            toast({
              title: "🏛️ Tax Resident",
              description: `You are now a tax resident of ${country.name} for this year!`,
              variant: "destructive"
            });
          }
          
          return {
            ...country,
            daysSpent: newDaysSpent,
            yearlyDaysSpent: newYearlyDays,
            lastUpdate: today
          };
        }
      }
      return country;
    }));
  };

  const handleUpgrade = (tier: string) => {
    const newSubscription: Subscription = {
      tier: tier as any,
      isActive: true,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      features: []
    };
    
    setSubscription(newSubscription);
    localStorage.setItem('subscription', JSON.stringify(newSubscription));
    
    toast({
      title: "Subscription Updated",
      description: `Successfully upgraded to ${tier} plan!`,
    });
  };

  const addCountry = (newCountry: Omit<Country, 'id' | 'daysSpent' | 'lastUpdate' | 'countTravelDays' | 'yearlyDaysSpent' | 'lastEntry' | 'totalEntries'>) => {
    // Check subscription limits
    if (subscription.tier === 'free' && countries.length >= 3) {
      toast({
        title: "Upgrade Required",
        description: "Free tier limited to 3 countries. Upgrade for unlimited tracking.",
        variant: "destructive"
      });
      return;
    }

    const country: Country = {
      ...newCountry,
      id: Date.now().toString(),
      daysSpent: 0,
      yearlyDaysSpent: 0,
      lastUpdate: null,
      lastEntry: null,
      totalEntries: 0,
      countTravelDays: true
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
      c.id === id ? { ...c, daysSpent: 0, yearlyDaysSpent: 0, lastUpdate: null, totalEntries: 0, lastEntry: null } : c
    ));
    toast({
      title: "Days Reset",
      description: "Country days have been reset to zero.",
    });
  };

  const toggleCountTravelDays = (id: string) => {
    setCountries(prev => prev.map(c => 
      c.id === id ? { ...c, countTravelDays: !c.countTravelDays } : c
    ));
    toast({
      title: "Travel Day Counting Updated",
      description: "Travel day counting preference has been updated.",
    });
  };

  const handleVPNLocationConfirmation = (isCorrect: boolean) => {
    if (isCorrect && vpnDetectionData.location) {
      // Use the detected location
      setCurrentLocation(vpnDetectionData.location);
      toast({
        title: "Location Confirmed",
        description: "Using detected location for travel tracking.",
      });
    } else {
      toast({
        title: "Location Rejected",
        description: "Please disable VPN for accurate tracking.",
        variant: "destructive"
      });
    }
    setIsVPNModalOpen(false);
  };

  const handleDisableVPN = () => {
    toast({
      title: "VPN Guidance",
      description: "Please disable your VPN temporarily and restart the app for accurate location tracking.",
      variant: "destructive"
    });
    setIsVPNModalOpen(false);
  };

  const getLocationStatus = () => {
    if (!isLocationEnabled) return "Location disabled";
    if (!currentLocation) return "Getting location...";
    const trackingType = isBackgroundTrackingEnabled ? " (Enhanced)" : " (Basic)";
    return `${currentLocation.city}, ${currentLocation.country}${trackingType}`;
  };

  const getTotalActiveCountries = () => countries.length;
  const getCountriesNearLimit = () => countries.filter(c => (c.daysSpent / c.dayLimit) >= 0.8).length;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Pricing Card */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Travel Day Tracker
            </h1>
            <p className="text-muted-foreground">
              Monitor your stay duration in different countries for visa and tax compliance
            </p>
          </div>
          
          <div className="lg:ml-auto">
            <PricingCard subscription={subscription} onUpgrade={handleUpgrade} />
          </div>
        </div>

        {/* Passport Manager */}
        <PassportManager />

        {/* Business Expense Tracker */}
        <ExpenseTracker />

        {/* Circular Dashboard */}
        <CircularDashboard countries={countries} currentLocation={currentLocation} />

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
                  <p className="text-sm text-blue-700">
                    {getTotalActiveCountries()} active
                    {subscription.tier === 'free' && ` (3 max)`}
                  </p>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="gradient-success text-white hover:opacity-90 transition-all duration-200 shadow-lg"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Country to Track
          </Button>
          
          <ExcelExport countries={countries} expenses={expenses} />
        </div>

        {/* Countries Grid */}
        {countries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {countries.map(country => (
              <CountryCard
                key={country.id}
                country={country}
                isCurrentLocation={currentLocation?.country_code === country.code}
                onRemove={(id) => {
                  setCountries(prev => prev.filter(c => c.id !== id));
                  toast({
                    title: "Country Removed",
                    description: "Country has been removed from tracking.",
                  });
                }}
                onUpdateLimit={(id, newLimit) => {
                  setCountries(prev => prev.map(c => 
                    c.id === id ? { ...c, dayLimit: newLimit } : c
                  ));
                }}
                onReset={(id) => {
                  setCountries(prev => prev.map(c => 
                    c.id === id ? { ...c, daysSpent: 0, yearlyDaysSpent: 0, lastUpdate: null, totalEntries: 0, lastEntry: null } : c
                  ));
                  toast({
                    title: "Days Reset",
                    description: "Country days have been reset to zero.",
                  });
                }}
                onToggleCountDays={(id) => {
                  setCountries(prev => prev.map(c => 
                    c.id === id ? { ...c, countTravelDays: !c.countTravelDays } : c
                  ));
                  toast({
                    title: "Travel Day Counting Updated",
                    description: "Travel day counting preference has been updated.",
                  });
                }}
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

        {/* Enhanced Add Country Modal */}
        <EnhancedAddCountryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addCountry}
          existingCountries={countries}
        />

        {/* VPN Detection Modal */}
        <VPNDetectionModal
          isOpen={isVPNModalOpen}
          onClose={() => setIsVPNModalOpen(false)}
          detectedLocation={vpnDetectionData.location}
          vpnDuration={vpnDetectionData.duration}
          onConfirmLocation={(isCorrect) => {
            if (isCorrect && vpnDetectionData.location) {
              setCurrentLocation(vpnDetectionData.location);
              toast({
                title: "Location Confirmed",
                description: "Using detected location for travel tracking.",
              });
            } else {
              toast({
                title: "Location Rejected",
                description: "Please disable VPN for accurate tracking.",
                variant: "destructive"
              });
            }
            setIsVPNModalOpen(false);
          }}
          onDisableVPN={() => {
            toast({
              title: "VPN Guidance",
              description: "Please disable your VPN temporarily and restart the app for accurate location tracking.",
              variant: "destructive"
            });
            setIsVPNModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default Index;
