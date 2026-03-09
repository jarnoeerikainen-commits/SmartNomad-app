import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Shield } from 'lucide-react';
import { Country } from '@/types/country';

interface DashboardBottomStatsProps {
  countries: Country[];
  onOpenTracking: () => void;
}

interface VisaTracking {
  id: string;
  isActive: boolean;
  daysUsed: number;
  dayLimit: number;
  endDate?: string;
}

const DashboardBottomStats: React.FC<DashboardBottomStatsProps> = ({ countries, onOpenTracking }) => {
  const [activeVisasCount, setActiveVisasCount] = useState(0);

  useEffect(() => {
    const loadVisaCount = () => {
      const saved = localStorage.getItem('visaTrackings');
      if (saved) {
        try {
          const visaTrackings: VisaTracking[] = JSON.parse(saved);
          const today = new Date();
          
          const active = visaTrackings.filter(visa => {
            if (!visa.isActive) return false;
            if (visa.endDate) {
              const endDate = new Date(visa.endDate);
              if (today > endDate) return false;
            }
            if (visa.daysUsed >= visa.dayLimit) return false;
            return true;
          }).length;
          
          setActiveVisasCount(active);
        } catch (error) {
          console.error('Error loading visa trackings:', error);
          setActiveVisasCount(0);
        }
      }
    };

    loadVisaCount();
    const handleVisaUpdate = () => loadVisaCount();
    window.addEventListener('visaTrackingsUpdated', handleVisaUpdate);
    return () => window.removeEventListener('visaTrackingsUpdated', handleVisaUpdate);
  }, []);

  const currentYear = new Date().getFullYear();
  const daysThisYear = countries.reduce((sum, country) => sum + country.yearlyDaysSpent, 0);

  return (
    <div 
      className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border/50 shadow-large cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onOpenTracking}
    >
      <div className="container max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              {countries.length} {countries.length === 1 ? 'Country' : 'Countries'}
            </span>
          </div>
          
          <div className="h-4 w-px bg-border/50" />
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">
              {daysThisYear} Days
            </span>
          </div>
          
          <div className="h-4 w-px bg-border/50" />
          
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-secondary" />
            <span className="text-muted-foreground">
              {activeVisasCount} {activeVisasCount === 1 ? 'Visa' : 'Visas'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBottomStats;
