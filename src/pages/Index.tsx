
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Globe } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import OnboardingFlow from '@/components/OnboardingFlow';
import EnhancedProfileForm from '@/components/EnhancedProfileForm';
import VPNDetectionModal from '@/components/VPNDetectionModal';
import PricingCard from '@/components/PricingCard';
import { Country, LocationData } from '@/types/country';
import { Subscription } from '@/types/subscription';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showVPNModal, setShowVPNModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<LocationData | null>(null);
  const [vpnDuration, setVPNDuration] = useState(0);
  const [subscription, setSubscription] = useState<Subscription>({
    tier: 'free',
    isActive: true,
    expiryDate: null,
    features: ['✈️ Basic travel tracking', '📊 Simple day counting', '📍 Manual location entry', '⚠️ Basic alerts'],
    aiRequestsRemaining: 0,
    aiRequestsLimit: 0
  });
  const { toast } = useToast();

  // Ensure home click closes overlays, scrolls to top
  useEffect(() => {
    const handler = () => {
      setShowOnboarding(false);
      setShowProfileForm(false);
      setShowVPNModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('smartnomad:home', handler);
    return () => window.removeEventListener('smartnomad:home', handler);
  }, []);

  // Load saved data on component mount
  useEffect(() => {
    const savedCountries = localStorage.getItem('trackedCountries');
    const savedProfile = localStorage.getItem('userProfile');
    const enhancedProfile = localStorage.getItem('enhancedProfile');
    const savedSubscription = localStorage.getItem('subscription');
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    
    if (savedCountries) {
      setCountries(JSON.parse(savedCountries));
    }
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    
    if (savedSubscription) {
      setSubscription(JSON.parse(savedSubscription));
    }

    // Show onboarding for first-time users
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    
    // Show profile form after onboarding if not completed and not on premium
    if (hasSeenOnboarding && !enhancedProfile && savedSubscription) {
      const sub = JSON.parse(savedSubscription) as Subscription;
      if (sub.tier === 'free') {
        // Delay showing the form slightly after app loads
        setTimeout(() => setShowProfileForm(true), 1000);
      }
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

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('trackedCountries', JSON.stringify(countries));
  }, [countries]);

  useEffect(() => {
    localStorage.setItem('subscription', JSON.stringify(subscription));
  }, [subscription]);

  const addCountry = (country: Country) => {
    if (!countries.find(c => c.code === country.code)) {
      setCountries(prev => [...prev, country]);
      toast({
        title: t('toast.countryAdded'),
        description: `${t('toast.countryAddedDesc').replace('{country}', country.name)}`,
      });
    }
  };

  const removeCountry = (countryCode: string) => {
    setCountries(prev => prev.filter(c => c.code !== countryCode));
    toast({
      title: t('toast.countryRemoved'),
      description: t('toast.countryRemovedDesc'),
    });
  };

  const updateCountrySettings = (countryId: string, settings: {
    countingMode: 'days' | 'nights';
    partialDayRule: 'full' | 'half' | 'exclude';
    countArrivalDay: boolean;
    countDepartureDay: boolean;
  }) => {
    setCountries(prev => prev.map(country => 
      country.id === countryId 
        ? { ...country, ...settings }
        : country
    ));
    toast({
      title: "Settings Updated",
      description: "Day counting rules have been saved",
    });
  };

  const updateCountryLimit = (countryId: string, newLimit: number) => {
    setCountries(prev => prev.map(country => 
      country.id === countryId 
        ? { ...country, dayLimit: newLimit }
        : country
    ));
    toast({
      title: "Limit Updated",
      description: `Day limit has been updated to ${newLimit} days`,
    });
  };

  const resetCountry = (countryId: string) => {
    setCountries(prev => prev.map(country => 
      country.id === countryId 
        ? { ...country, daysSpent: 0, yearlyDaysSpent: 0, lastEntry: null, totalEntries: 0, lastUpdate: null }
        : country
    ));
    toast({
      title: "Country Reset",
      description: "All tracking data has been reset",
    });
  };

  const toggleCountDays = (countryId: string) => {
    setCountries(prev => prev.map(country => 
      country.id === countryId 
        ? { ...country, countTravelDays: !country.countTravelDays }
        : country
    ));
  };

  const handleVPNModalClose = () => {
    setShowVPNModal(false);
  };

  const handleConfirmLocation = (isCorrect: boolean) => {
    if (isCorrect) {
      toast({
        title: t('toast.locationConfirmed'),
        description: t('toast.locationConfirmedDesc'),
      });
    } else {
      toast({
        title: t('toast.locationCorrection'),
        description: t('toast.locationCorrectionDesc'),
        variant: "destructive"
      });
    }
    setShowVPNModal(false);
  };

  const handleDisableVPN = () => {
    toast({
      title: t('toast.vpnInstructions'),
      description: t('toast.vpnInstructionsDesc'),
    });
    setShowVPNModal(false);
  };

  const handleUpgrade = (tier: string) => {
    // Update subscription with enhanced features based on tier
    const tierFeatures = {
      free: ['✈️ Basic travel tracking', '📊 Simple day counting', '📍 Manual location entry', '⚠️ Basic alerts'],
      'premium-lite': [
        '✈️ Multiple country tracking',
        '🤖 AI travel assistant (100 requests/month)',
        '📊 Enhanced analytics',
        '🗺️ Smart recommendations',
        '📱 Mobile app access',
        '💰 Tax residency basics',
        '📋 Document reminders'
      ],
      premium: [
        '✈️ Unlimited country tracking',
        '🤖 Advanced AI assistant (500 requests/month)',
        '🚨 Smart alerts & notifications',
        '💰 Advanced tax residency tracking',
        '📄 Document vault',
        '🌍 Visa requirement checker',
        '📊 Comprehensive analytics',
        '🔐 Priority support',
        '📱 Premium mobile features'
      ],
      diamond: [
        '✈️ VIP unlimited tracking',
        '🤖 Premium AI assistant (2000 requests/month)',
        '💎 Concierge service',
        '💰 Expert tax consultations',
        '🏛️ Embassy connections',
        '📄 Advanced document management',
        '🌐 Multi-passport support',
        '✈️ Travel planning assistance',
        '📊 Executive reporting',
        '🔐 Dedicated support',
        '🎯 Custom integrations'
      ]
    };

    const aiLimits = {
      free: 0,
      'premium-lite': 100,
      premium: 500,
      diamond: 2000
    };

    const newSubscription: Subscription = {
      tier: tier as any,
      isActive: true,
      expiryDate: null,
      features: tierFeatures[tier as keyof typeof tierFeatures] || tierFeatures.free,
      aiRequestsRemaining: aiLimits[tier as keyof typeof aiLimits] || 0,
      aiRequestsLimit: aiLimits[tier as keyof typeof aiLimits] || 0
    };

    setSubscription(newSubscription);
    localStorage.setItem('subscription', JSON.stringify(newSubscription));
    
    toast({
      title: t('toast.planUpgraded'),
      description: t('toast.planUpgradedDesc').replace('{tier}', tier),
    });
  };

  const handleProfileComplete = (profileData: any) => {
    // Grant 3 months of Premium
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 3);

    const premiumSubscription: Subscription = {
      tier: 'premium',
      isActive: true,
      expiryDate: expiryDate.toISOString(),
      features: [
        '✈️ Unlimited country tracking',
        '🤖 Advanced AI assistant (500 requests/month)',
        '🚨 Smart alerts & notifications',
        '💰 Advanced tax residency tracking',
        '📄 Document vault',
        '🌍 Visa requirement checker',
        '📊 Comprehensive analytics',
        '🔐 Priority support',
        '📱 Premium mobile features'
      ],
      aiRequestsRemaining: 500,
      aiRequestsLimit: 500
    };

    setSubscription(premiumSubscription);
    setUserProfile(profileData);
    localStorage.setItem('subscription', JSON.stringify(premiumSubscription));
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    setShowProfileForm(false);
  };


  return (
    <>
      {showOnboarding && (
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      )}

      {showProfileForm && !showOnboarding && (
        <EnhancedProfileForm 
          onComplete={handleProfileComplete}
          onSkip={() => setShowProfileForm(false)}
        />
      )}
      
      <AppLayout
        countries={countries}
        onAddCountry={addCountry}
        onRemoveCountry={removeCountry}
        onUpdateCountrySettings={updateCountrySettings}
        onUpdateCountryLimit={updateCountryLimit}
        onResetCountry={resetCountry}
        onToggleCountDays={toggleCountDays}
        subscription={subscription}
        detectedLocation={detectedLocation}
        userProfile={userProfile}
        onUpgrade={handleUpgrade}
        onProfileComplete={handleProfileComplete}
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
