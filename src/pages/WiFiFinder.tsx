import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import WiFiHotspotFinder from '@/components/WiFiHotspotFinder';
import { Subscription } from '@/types/subscription';
import AppHeader from '@/components/AppHeader';
import { useLocation } from '@/contexts/LocationContext';

const WiFiFinder = () => {
  const navigate = useNavigate();
  const { location: detectedLocation } = useLocation();
  const [subscription, setSubscription] = useState<Subscription>({
    tier: 'free',
    isActive: true,
    expiryDate: null,
    features: ['✈️ Basic travel tracking', '📊 Simple day counting', '📍 Manual location entry', '⚠️ Basic alerts'],
    aiRequestsRemaining: 0,
    aiRequestsLimit: 0
  });
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const savedSubscription = localStorage.getItem('subscription');
    if (savedSubscription) {
      setSubscription(JSON.parse(savedSubscription));
    }

    const savedCountries = localStorage.getItem('trackedCountries');
    if (savedCountries) {
      setCountries(JSON.parse(savedCountries));
    }
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
