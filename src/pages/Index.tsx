
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';
import OnboardingFlow from '@/components/OnboardingFlow';
import SovereignAccessTour from '@/components/permissions/SovereignAccessTour';
import AuroraIntro from '@/components/avatar/AuroraIntro';
import { Country } from '@/types/country';
import { Subscription } from '@/types/subscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';

const Index = () => {
  const { t } = useLanguage();
  const [countries, setCountries] = useState<Country[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuroraIntro, setShowAuroraIntro] = useState(false);
  const [showSovereignTour, setShowSovereignTour] = useState(false);
  const { location: detectedLocation } = useLocation();
  const [subscription, setSubscription] = useState<Subscription>({
    tier: 'free',
    isActive: true,
    expiryDate: null,
    features: ['1,000,000 AI requests / month', 'AI Concierge — chat mode', 'All 195+ countries', 'Snomad ID vault'],
    aiRequestsRemaining: 1000000,
    aiRequestsLimit: 1000000
  });
  const { toast } = useToast();

  // Ensure home click closes overlays, scrolls to top
  useEffect(() => {
    const handler = () => {
      setShowOnboarding(false);
      window.dispatchEvent(new CustomEvent('supernomad:scroll-main-top'));
    };
    window.addEventListener('supernomad:home', handler);
    return () => window.removeEventListener('supernomad:home', handler);
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
    } else if (!localStorage.getItem('supernomad_avatar_intro_seen')) {
      // First post-onboarding launch → meet Aurora
      setShowAuroraIntro(true);
    } else if (!localStorage.getItem('supernomad_sovereign_tour_seen')) {
      // After Aurora → Sovereign Access tour
      setShowSovereignTour(true);
    }
  }, []);

  const handleCloseAuroraIntro = () => {
    localStorage.setItem('supernomad_avatar_intro_seen', '1');
    setShowAuroraIntro(false);
    if (!localStorage.getItem('supernomad_sovereign_tour_seen')) {
      setShowSovereignTour(true);
    }
  };

  const handleCloseSovereignTour = () => {
    localStorage.setItem('supernomad_sovereign_tour_seen', '1');
    setShowSovereignTour(false);
  };

  const handleOpenAccessCenter = () => {
    handleCloseSovereignTour();
    window.dispatchEvent(new CustomEvent('supernomad:navigate', { detail: { section: 'sovereign-access' } }));
  };

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

  const incrementCountryDay = (countryId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setCountries(prev => prev.map(country =>
      country.id === countryId
        ? {
            ...country,
            daysSpent: country.daysSpent + 1,
            yearlyDaysSpent: country.yearlyDaysSpent + 1,
            lastEntry: today,
            lastUpdate: today,
            totalEntries: (country.lastEntry === today ? country.totalEntries : country.totalEntries + 1),
          }
        : country
    ));
  };

  const toggleCountDays = (countryId: string) => {
    setCountries(prev => prev.map(country => 
      country.id === countryId 
        ? { ...country, countTravelDays: !country.countTravelDays }
        : country
    ));
  };

  const handleUpgrade = (tier: string) => {
    const tierFeatures: Record<string, string[]> = {
      free: ['1,000,000 AI requests / month', 'AI Concierge — chat mode', 'All 195+ countries', 'Snomad ID vault'],
      premium: [
        '10,000,000 AI requests / month',
        'AI Concierge — voice + chat with memory',
        'Tax Day Calculator',
        'Travel Reports (PDF + Excel)',
        'Priority 24/7 support'
      ]
    };

    const aiLimits: Record<string, number> = {
      free: 1000000,
      premium: 10000000
    };

    const newSubscription: Subscription = {
      tier: tier as any,
      isActive: true,
      expiryDate: null,
      features: tierFeatures[tier] || tierFeatures.free,
      aiRequestsRemaining: aiLimits[tier] || 1000000,
      aiRequestsLimit: aiLimits[tier] || 1000000
    };

    setSubscription(newSubscription);
    localStorage.setItem('subscription', JSON.stringify(newSubscription));
    
    toast({
      title: t('toast.planUpgraded'),
      description: t('toast.planUpgradedDesc').replace('{tier}', tier),
    });
  };

  const handleProfileComplete = (profileData: any) => {
    setUserProfile(profileData);
    localStorage.setItem('userProfile', JSON.stringify(profileData));
  };


  return (
    <>
      {showOnboarding && (
        <OnboardingFlow onComplete={() => {
          setShowOnboarding(false);
          if (!localStorage.getItem('supernomad_avatar_intro_seen')) {
            setShowAuroraIntro(true);
          } else if (!localStorage.getItem('supernomad_sovereign_tour_seen')) {
            setShowSovereignTour(true);
          }
        }} />
      )}

      {showAuroraIntro && (
        <AuroraIntro
          userName={userProfile?.firstName || userProfile?.name || 'Nomad'}
          onComplete={handleCloseAuroraIntro}
        />
      )}

      <SovereignAccessTour
        open={showSovereignTour}
        onClose={handleCloseSovereignTour}
        onOpenAccessCenter={handleOpenAccessCenter}
      />

      <AppLayout
        countries={countries}
        onAddCountry={addCountry}
        onRemoveCountry={removeCountry}
        onUpdateCountrySettings={updateCountrySettings}
        onUpdateCountryLimit={updateCountryLimit}
        onResetCountry={resetCountry}
        onToggleCountDays={toggleCountDays}
        onIncrementCountryDay={incrementCountryDay}
        subscription={subscription}
        detectedLocation={detectedLocation}
        userProfile={userProfile}
        onUpgrade={handleUpgrade}
        onProfileComplete={handleProfileComplete}
      />
    </>
  );
};

export default Index;
