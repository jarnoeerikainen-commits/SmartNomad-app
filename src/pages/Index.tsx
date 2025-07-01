import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import NewsLocker from "@/components/NewsLocker";
import { Country } from '@/types/country';

const Index = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
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

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* VPN Detection Modal */}
      <VPNDetectionModal />
      
      {/* News Locker - Fixed position in top right */}
      <NewsLocker 
        countries={countries} 
        userProfile={{
          languages: userProfile?.languages || ['en']
        }}
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

      {/* User Profile Section */}
      <UserProfile />

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

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>Stay informed about visa requirements, tax obligations, and travel updates</p>
      </div>
    </div>
  );
};

export default Index;
