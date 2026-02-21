import React from 'react';
import { Country } from '@/types/country';
import { Subscription } from '@/types/subscription';
import DashboardHeroCards from '@/components/dashboard/DashboardHeroCards';
import { DashboardFeatureDiscovery } from '@/components/dashboard/DashboardFeatureDiscovery';
import { DashboardGamification } from '@/components/dashboard/DashboardGamification';
import { DashboardSmartActions } from '@/components/dashboard/DashboardSmartActions';
import { DashboardRecentActivity } from '@/components/dashboard/DashboardRecentActivity';
import DashboardQuickStats from '@/components/DashboardQuickStats';
import { useLanguage } from '@/contexts/LanguageContext';

interface HomeSectionProps {
  countries: Country[];
  subscription: Subscription;
  onNavigate: (section: string) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ countries, subscription, onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          {t('home.welcome')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('home.subtitle')}
        </p>
      </div>
      
      <DashboardHeroCards onNavigate={onNavigate} />

      {/* Quick Stats */}
      <DashboardQuickStats countries={countries} />

      {/* Two Column Layout for Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DashboardGamification countries={countries} />
          <DashboardRecentActivity countries={countries} />
        </div>
        <div className="space-y-6">
          <DashboardSmartActions countries={countries} onActionClick={(action) => onNavigate(action)} />
          <DashboardFeatureDiscovery onFeatureClick={(feature) => onNavigate(feature)} />
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
