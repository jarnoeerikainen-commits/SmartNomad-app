import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Globe, Plane } from 'lucide-react';
import { Country } from '@/types/country';

interface DashboardHeroSectionProps {
  userName?: string;
  countries: Country[];
}

export const DashboardHeroSection: React.FC<DashboardHeroSectionProps> = ({ 
  userName = 'Nomad',
  countries 
}) => {
  const totalCountries = countries.length;
  const totalDays = countries.reduce((sum, c) => sum + (c.daysSpent || 0), 0);
  const currentCountry = countries.find(c => c.daysSpent && c.daysSpent > 0)?.name || 'Unknown';

  return (
    <Card className="relative overflow-hidden border-none shadow-large">
      {/* Gradient Background with Mesh Pattern */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      <div className="absolute inset-0 gradient-hero opacity-90" />
      
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Welcome Text */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Globe className="h-10 w-10 text-white animate-pulse" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Welcome back, {userName}! 🌍
                </h1>
                <p className="text-white/90 text-lg mt-1">
                  Your nomadic journey continues
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap gap-3">
            <div className="glass-effect px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-white" />
                <div>
                  <p className="text-xs text-white/80">Countries</p>
                  <p className="text-2xl font-bold text-white">{totalCountries}</p>
                </div>
              </div>
            </div>
            <div className="glass-effect px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-white" />
                <div>
                  <p className="text-xs text-white/80">Days Tracked</p>
                  <p className="text-2xl font-bold text-white">{totalDays}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive World Map Placeholder */}
        <div className="mt-8 relative">
          <div className="glass-morphism rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 text-white">
              <Globe className="h-6 w-6 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-lg font-medium">
                Currently tracking: {currentCountry}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {countries.slice(0, 4).map((country) => (
                <div key={country.code} className="bg-white/10 rounded-lg p-3">
                  <p className="text-white font-semibold text-sm">{country.name}</p>
                  <p className="text-white/70 text-xs">{country.daysSpent || 0} days</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
