
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Globe } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import VPNDetectionModal from '@/components/VPNDetectionModal';
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

  // Show pricing modal for free users
  const shouldShowPricing = subscription.tier === 'free' && countries.length === 0;

  if (shouldShowPricing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-4 gradient-primary rounded-2xl shadow-large">
                <Globe className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  TravelTracker
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Your trusted global travel compliance companion
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Choose Your Plan
              </h2>
              <p className="text-muted-foreground text-lg">
                Select the perfect plan for your travel tracking needs
              </p>
            </div>
            
            <PricingCard 
              subscription={subscription}
              onUpgrade={handleUpgrade}
            />
          </div>
        </div>

        <VPNDetectionModal 
          isOpen={showVPNModal}
          onClose={handleVPNModalClose}
          detectedLocation={detectedLocation}
          vpnDuration={vpnDuration}
          onConfirmLocation={handleConfirmLocation}
          onDisableVPN={handleDisableVPN}
        />
      </div>
    );
  }

  return (
    <>
      <AppLayout
        countries={countries}
        onAddCountry={addCountry}
        onRemoveCountry={removeCountry}
        subscription={subscription}
        detectedLocation={detectedLocation}
        userProfile={userProfile}
      />

      <VPNDetectionModal 
        isOpen={showVPNModal}
        onClose={handleVPNModalClose}
        detectedLocation={detectedLocation}
        vpnDuration={vpnDuration}
        onConfirmLocation={handleConfirmLocation}
        onDisableVPN={handleDisableVPN}
      />
    </>
  );
};

export default Index;
