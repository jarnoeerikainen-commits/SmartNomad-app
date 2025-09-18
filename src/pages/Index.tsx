
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
    // Update subscription with enhanced features based on tier
    const tierFeatures = {
      free: ['✈️ Single visa tracking', '📊 Basic day counting', '📍 Manual location tracking', '⚠️ Simple alerts'],
      student: ['🎓 Multiple visa types', '🏫 University compliance tracking', '📅 Academic calendar integration', '📖 Study visa monitoring', '🌍 Unlimited country tracking'],
      personal: ['🌐 All visa types', '🤖 Automatic location detection', '💰 Tax residence tracking', '📋 Passport expiry alerts', '✅ Visa compliance monitoring', '🗃️ Premium country database'],
      family: ['👨‍👩‍👧‍👦 All visa types for family', '🏠 Family dashboard', '🗺️ Shared trip planning', '👥 Group compliance tracking', '📘 Multiple passport management'],
      business: ['🏢 All visa types for employees', '👥 Unlimited team members', '📊 Advanced compliance dashboard', '💼 Work permit tracking', '💰 Corporate tax optimization'],
      'business-individual': ['💼 Multiple visa types', '🏢 Work permit tracking', '💰 Tax residence monitoring', '📊 Business travel analytics', '📄 Professional reporting'],
      enterprise: ['🌍 All global visa types', '🏢 Custom compliance frameworks', '🏷️ White-label solutions', '🌐 Multi-country operations', '🏛️ Government reporting']
    };

    setSubscription(prev => ({
      ...prev,
      tier: tier as any,
      isActive: true,
      features: tierFeatures[tier as keyof typeof tierFeatures] || tierFeatures.free
    }));
    
    toast({
      title: "Plan Upgraded Successfully!",
      description: `Welcome to ${tier} plan! All features are now active.`,
    });
  };


  return (
    <>
      <AppLayout
        countries={countries}
        onAddCountry={addCountry}
        onRemoveCountry={removeCountry}
        subscription={subscription}
        detectedLocation={detectedLocation}
        userProfile={userProfile}
        onUpgrade={handleUpgrade}
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
