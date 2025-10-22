import React from 'react';
import { Country } from '@/types/country';
import { DashboardHeroSection } from './dashboard/DashboardHeroSection';
import { DashboardGamification } from './dashboard/DashboardGamification';
import { DashboardSmartActions } from './dashboard/DashboardSmartActions';
import { DashboardRecentActivity } from './dashboard/DashboardRecentActivity';
import { DashboardFeatureDiscovery } from './dashboard/DashboardFeatureDiscovery';
import DashboardQuickStats from './DashboardQuickStats';
import { useToast } from '@/hooks/use-toast';

interface EnhancedDashboardProps {
  countries: Country[];
  userProfile?: any;
  onSectionChange?: (section: string) => void;
}

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ 
  countries,
  userProfile,
  onSectionChange 
}) => {
  const { toast } = useToast();
  const userName = userProfile?.name || userProfile?.firstName || 'Nomad';

  const handleActionClick = (action: string) => {
    const actionMap: Record<string, string> = {
      view_tax_tracker: 'tax-residency',
      update_country: 'tracking',
      open_vault: 'documents',
      open_tax_hub: 'tax-residency',
      add_country: 'tracking'
    };

    const section = actionMap[action];
    if (section && onSectionChange) {
      onSectionChange(section);
      toast({
        title: 'Navigating...',
        description: `Opening ${section.replace('-', ' ')} section`,
      });
    }
  };

  const handleFeatureClick = (feature: string) => {
    const featureMap: Record<string, string> = {
      ai_doctor: 'ai-doctor',
      tax_hub: 'tax-residency',
      laundry: 'laundry-services',
      visa: 'visas',
      news: 'news',
      documents: 'documents',
      community: 'local-nomads',
      ai_planner: 'ai-planner'
    };

    const section = featureMap[feature];
    if (section && onSectionChange) {
      onSectionChange(section);
      toast({
        title: 'Feature opened',
        description: `Exploring ${feature.replace('_', ' ')}`,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <DashboardHeroSection 
        userName={userName}
        countries={countries}
      />

      {/* Quick Stats Bar */}
      <DashboardQuickStats countries={countries} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <DashboardGamification countries={countries} />
          <DashboardRecentActivity countries={countries} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <DashboardSmartActions 
            countries={countries}
            onActionClick={handleActionClick}
          />
          <DashboardFeatureDiscovery 
            onFeatureClick={handleFeatureClick}
          />
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="relative overflow-hidden rounded-2xl shadow-large">
        <div className="absolute inset-0 gradient-premium opacity-90" />
        <div className="relative z-10 p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to Level Up?</h3>
          <p className="text-white/90 mb-4">
            Unlock premium features and take your nomad journey to the next level
          </p>
          <button 
            onClick={() => onSectionChange?.('settings')}
            className="px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105 shadow-large"
          >
            Explore Premium Plans
          </button>
        </div>
      </div>
    </div>
  );
};
