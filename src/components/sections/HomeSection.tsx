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
      <div className="text-center space-y-4 mb-10 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">AI-Powered Community</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display">
          <span className="text-foreground">Welcome to </span>
          <span className="text-foreground">Super</span>
          <span style={{ background: 'linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold-light)), hsl(var(--gold-dark)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="drop-shadow-sm">Nomad</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
