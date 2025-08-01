
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Plus, X, Plane, AlertTriangle, Globe, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CountryTracker from '@/components/CountryTracker';
import NewsDashboard from '@/components/NewsDashboard';
import UserProfile from '@/components/UserProfile';
import VPNDetectionModal from '@/components/VPNDetectionModal';
import VisaTrackingManager from '@/components/VisaTrackingManager';

import TravelServices from '@/components/TravelServices';
import PricingCard from '@/components/PricingCard';
import { Country, LocationData } from '@/types/country';
import { Subscription } from '@/types/subscription';

const Index = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showVPNModal, setShowVPNModal] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<LocationData | null>(null);
  const [vpnDuration, setVPNDuration] = useState(0);
  const [subscription, setSubscription] = useState<Subscription>({
    tier: 'free',
    isActive: true,
    expiryDate: null,
    features: ['✈️ Single visa tracking', '📊 Basic day counting', '📍 Manual location tracking', '⚠️ Simple alerts']
  });
  const { toast } = useToast();

  // Load saved data on component mount
  useEffect(() => {
    const savedCountries = localStorage.getItem('trackedCountries');
    const savedProfile = localStorage.getItem('userProfile');
    
    if (savedCountries) {
      setCountries(JSON.parse(savedCountries));
    }
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Mock VPN detection - in a real app this would use actual VPN detection
    const mockDetectVPN = () => {
      const isVPNDetected = Math.random() > 0.8; // 20% chance for demo
      if (isVPNDetected) {
        setDetectedLocation({
          latitude: 40.7128,
          longitude: -74.0060,
          city: 'New York',
          country: 'United States',
          country_code: 'US',
          timestamp: Date.now()
        });
        setVPNDuration(Date.now() - (Math.random() * 3600000)); // Random duration up to 1 hour
        setShowVPNModal(true);
      }
    };

    // Check for VPN after 2 seconds (demo purposes)
    const timer = setTimeout(mockDetectVPN, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Save countries to localStorage whenever countries change
  useEffect(() => {
    localStorage.setItem('trackedCountries', JSON.stringify(countries));
  }, [countries]);

  const addCountry = (country: Country) => {
    if (!countries.find(c => c.code === country.code)) {
      setCountries(prev => [...prev, country]);
      toast({
        title: "Country Added",
        description: `Now tracking ${country.name}`,
      });
    }
  };

  const removeCountry = (countryCode: string) => {
    setCountries(prev => prev.filter(c => c.code !== countryCode));
    toast({
      title: "Country Removed",
      description: "Country removed from tracking",
    });
  };

  const handleVPNModalClose = () => {
    setShowVPNModal(false);
  };

  const handleConfirmLocation = (isCorrect: boolean) => {
    if (isCorrect) {
      toast({
        title: "Location Confirmed",
        description: "Using detected location for travel tracking",
      });
    } else {
      toast({
        title: "Location Correction Needed",
        description: "Please manually update your location",
        variant: "destructive"
      });
    }
    setShowVPNModal(false);
  };

  const handleDisableVPN = () => {
    toast({
      title: "VPN Instructions",
      description: "Please disable your VPN temporarily for accurate location tracking",
    });
    setShowVPNModal(false);
  };

  const handleUpgrade = (tier: string) => {
    // In a real app, this would integrate with payment system
    setSubscription(prev => ({
      ...prev,
      tier: tier as any,
      isActive: true
    }));
    toast({
      title: "Plan Updated",
      description: `Successfully upgraded to ${tier} plan!`,
    });
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* VPN Detection Modal */}
      <VPNDetectionModal 
        isOpen={showVPNModal}
        onClose={handleVPNModalClose}
        detectedLocation={detectedLocation}
        vpnDuration={vpnDuration}
        onConfirmLocation={handleConfirmLocation}
        onDisableVPN={handleDisableVPN}
      />
      

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Digital Nomad Tracker
            </h1>
            <p className="text-gray-600 mt-1">
              Stay updated on visa, tax, and travel requirements for your destinations
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Choose Your Plan
          </h2>
          <p className="text-gray-600">
            Select the perfect plan for your travel tracking needs
          </p>
        </div>
        
        <div className="flex justify-center">
          <PricingCard 
            subscription={subscription}
            onUpgrade={handleUpgrade}
          />
        </div>
        
        {/* Plan Benefits Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-8">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600 mb-2">Basic</div>
            <p className="text-sm text-gray-600">✈️ Single visa tracking</p>
            <div className="text-lg font-semibold text-green-600 mt-2">Free</div>
          </Card>
          
          <Card className="text-center p-4 border-purple-200 bg-purple-50">
            <div className="text-2xl font-bold text-purple-600 mb-2">Student</div>
            <p className="text-sm text-gray-600">🎓 Multiple visa options</p>
            <div className="text-lg font-semibold text-green-600 mt-2">$0.99/year</div>
          </Card>
          
          <Card className="text-center p-4 border-orange-200 bg-orange-50">
            <div className="text-2xl font-bold text-orange-600 mb-2">Business Individual</div>
            <p className="text-sm text-gray-600">💼 Business visa tracking</p>
            <div className="text-lg font-semibold text-green-600 mt-2">$9.99/month</div>
          </Card>
          
          <Card className="text-center p-4 border-green-200 bg-green-50 border-2">
            <div className="text-2xl font-bold text-green-600 mb-2">Personal</div>
            <p className="text-sm text-gray-600">🌐 All visa types</p>
            <div className="text-lg font-semibold text-green-600 mt-2">$2.99/month</div>
            <Badge className="mt-1 bg-green-100 text-green-700">Most Popular</Badge>
          </Card>
          
          <Card className="text-center p-4 border-blue-200 bg-blue-50">
            <div className="text-2xl font-bold text-blue-600 mb-2">Family</div>
            <p className="text-sm text-gray-600">👨‍👩‍👧‍👦 Family visa management</p>
            <div className="text-lg font-semibold text-green-600 mt-2">$6.99/month</div>
          </Card>
          
          <Card className="text-center p-4 border-indigo-200 bg-indigo-50">
            <div className="text-2xl font-bold text-indigo-600 mb-2">Business</div>
            <p className="text-sm text-gray-600">🏢 Enterprise visa solutions</p>
            <div className="text-lg font-semibold text-green-600 mt-2">$49.99/month</div>
          </Card>
        </div>
      </div>

      {/* User Profile Section */}
      <UserProfile />

      {/* Tracking Summary */}
      {countries.length > 0 && (
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Your Tracking Summary
            </CardTitle>
            <CardDescription>
              Overview of your current visa and tax tracking status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries.map((country) => {
                const daysUsed = country.daysSpent || 0;
                const daysLimit = country.dayLimit || 0;
                const daysLeft = Math.max(0, daysLimit - daysUsed);
                const usagePercentage = daysLimit > 0 ? (daysUsed / daysLimit) * 100 : 0;
                
                return (
                  <div key={country.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <div className="font-semibold">{country.name}</div>
                          <div className="text-sm text-muted-foreground">{country.reason}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Days Used</span>
                        <span className="font-medium">{daysUsed} / {daysLimit}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            usagePercentage >= 90 ? 'bg-red-500' :
                            usagePercentage >= 70 ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className={`font-medium ${
                          daysLeft <= 10 ? 'text-red-600' :
                          daysLeft <= 30 ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {daysLeft} days left
                        </span>
                        <span className="text-muted-foreground">
                          {usagePercentage.toFixed(1)}% used
                        </span>
                      </div>
                    </div>
                    
                    {country.lastEntry && (
                      <div className="text-xs text-muted-foreground">
                        Last entry: {new Date(country.lastEntry).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visa Tracking Manager */}
      <VisaTrackingManager subscription={subscription} countries={countries} />

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Country Tracker */}
        <div className="lg:col-span-1">
          <CountryTracker
            countries={countries}
            onAddCountry={addCountry}
            onRemoveCountry={removeCountry}
          />
        </div>

        {/* News Dashboard */}
        <div className="lg:col-span-2">
          <NewsDashboard 
            countries={countries} 
            userProfile={userProfile}
          />
        </div>
      </div>

      {/* Travel Services */}
      <TravelServices currentLocation={detectedLocation} />

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>Stay informed about visa requirements, tax obligations, and travel updates</p>
      </div>
    </div>
  );
};

export default Index;
