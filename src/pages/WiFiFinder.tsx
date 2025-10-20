import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import WiFiHotspotFinder from '@/components/WiFiHotspotFinder';
import { Subscription } from '@/types/subscription';
import { LocationData } from '@/types/country';
import AppHeader from '@/components/AppHeader';

const WiFiFinder = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription>({
    tier: 'free',
    isActive: true,
    expiryDate: null,
    features: ['✈️ Basic travel tracking', '📊 Simple day counting', '📍 Manual location entry', '⚠️ Basic alerts'],
    aiRequestsRemaining: 0,
    aiRequestsLimit: 0
  });
  const [detectedLocation, setDetectedLocation] = useState<LocationData | null>(null);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Load subscription from localStorage
    const savedSubscription = localStorage.getItem('subscription');
    if (savedSubscription) {
      setSubscription(JSON.parse(savedSubscription));
    }

    // Load countries from localStorage
    const savedCountries = localStorage.getItem('trackedCountries');
    if (savedCountries) {
      setCountries(JSON.parse(savedCountries));
    }

    // Mock location detection
    setDetectedLocation({
      latitude: 13.7563,
      longitude: 100.5018,
      city: 'Bangkok',
      country: 'Thailand',
      country_code: 'TH',
      timestamp: Date.now()
    });
  }, []);

  const handleUpgradeClick = () => {
    navigate('/', { state: { showUpgradeModal: true } });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        onMenuClick={() => {}}
        showMenuButton={false}
        subscription={subscription}
        onUpgradeClick={handleUpgradeClick}
        countries={countries}
      />
      
      <main className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <WiFiHotspotFinder
          subscription={subscription}
          currentLocation={detectedLocation}
          onUpgradeClick={handleUpgradeClick}
        />
      </main>
    </div>
  );
};

export default WiFiFinder;
