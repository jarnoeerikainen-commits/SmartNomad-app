
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';
import GuidedTour from '@/components/tour/GuidedTour';
import { Country } from '@/types/country';
import { Subscription } from '@/types/subscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';

const Index = () => {
  const { t } = useLanguage();
  const [countries, setCountries] = useState<Country[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showGuidedTour, setShowGuidedTour] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('tour') === '1';
  });
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
      window.dispatchEvent(new CustomEvent('supernomad:scroll-main-top'));
    };
    window.addEventListener('supernomad:home', handler);
    return () => window.removeEventListener('supernomad:home', handler);
  }, []);

  // Load saved data on component mount
  useEffect(() => {
    const savedCountries = localStorage.getItem('trackedCountries');
    const savedProfile = localStorage.getItem('userProfile');
    const savedSubscription = localStorage.getItem('subscription');
    
    if (savedCountries) {
      setCountries(JSON.parse(savedCountries));
    }
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    
    if (savedSubscription) {
      setSubscription(JSON.parse(savedSubscription));
    }

    // Basic app entry has no mandatory welcome, avatar, or permission tour.

  }, []);

  // React to demo persona switching: reload countries + subscription from localStorage
  useEffect(() => {
    const reload = () => {
      const c = localStorage.getItem('trackedCountries');
      setCountries(c ? JSON.parse(c) : []);
      const s = localStorage.getItem('subscription');
      if (s) setSubscription(JSON.parse(s));
      const p = localStorage.getItem('userProfile');
      if (p) setUserProfile(JSON.parse(p));
    };
    window.addEventListener('supernomad:demo-persona-applied', reload);
    window.addEventListener('supernomad:demo-persona-cleared', reload);
    return () => {
      window.removeEventListener('supernomad:demo-persona-applied', reload);
      window.removeEventListener('supernomad:demo-persona-cleared', reload);
    };
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
      {showGuidedTour && (
        <GuidedTour
          onExit={() => {
            setShowGuidedTour(false);
            // Clear ?tour=1 from URL so reload doesn't restart
            try {
              const url = new URL(window.location.href);
              url.searchParams.delete('tour');
              window.history.replaceState({}, '', url.toString());
            } catch { /* noop */ }
          }}
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
