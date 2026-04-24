import React from 'react';
import { Country } from '@/types/country';
import { Subscription } from '@/types/subscription';
import DashboardHeroCards from '@/components/dashboard/DashboardHeroCards';
import { DashboardFeatureDiscovery } from '@/components/dashboard/DashboardFeatureDiscovery';
import { DashboardGamification } from '@/components/dashboard/DashboardGamification';
import { DashboardSmartActions } from '@/components/dashboard/DashboardSmartActions';
import { DashboardRecentActivity } from '@/components/dashboard/DashboardRecentActivity';
import DashboardQuickStats from '@/components/DashboardQuickStats';
import ThreatDashboard from '@/components/ThreatIntelligence/ThreatDashboard';
import DashboardWeatherWidget from '@/components/weather/DashboardWeatherWidget';
import SovereignAccessNudge from '@/components/dashboard/SovereignAccessNudge';
import SuperNomadCallCard from '@/components/dashboard/SuperNomadCallCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFeaturePreferences } from '@/hooks/useFeaturePreferences';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pin, LayoutGrid } from 'lucide-react';

interface HomeSectionProps {
  countries: Country[];
  subscription: Subscription;
  onNavigate: (section: string) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ countries, subscription, onNavigate }) => {
  const { t } = useLanguage();
  const { getPinnedFeatures, isVisible } = useFeaturePreferences();
  const pinnedFeatures = getPinnedFeatures();

  const showThreat = isVisible('dash-threat');
  const showWelcome = isVisible('dash-welcome');
  const showStats = isVisible('dash-stats');
  const showWeather = isVisible('dash-weather');
  const showGamification = isVisible('dash-gamification');
  const showActivity = isVisible('dash-activity');
  const showActions = isVisible('dash-actions');
  const showDiscovery = isVisible('dash-discovery');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-6 px-0">
      <SovereignAccessNudge onOpen={() => onNavigate('sovereign-access')} />
      <SuperNomadCallCard onNavigate={onNavigate} />
      {/* Top row: Threat + Welcome */}
      {(showThreat || showWelcome) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {showThreat && (
            <div className="order-1">
              <ThreatDashboard />
            </div>
          )}

          {showWelcome && (
            <div className={`${showThreat ? 'order-2' : 'order-1 md:col-span-2'} space-y-6`}>
              <div className="text-center space-y-4 mb-10 pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-semibold tracking-widest uppercase text-primary">AI-Powered Community</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight font-display">
                  <span className="text-foreground">Welcome to </span>
                  <span className="text-foreground">Super</span>
                  <span style={{ background: 'linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold-light)), hsl(var(--gold-dark)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="drop-shadow-sm">Nomad</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t('home.subtitle')}
                </p>
              </div>

              <DashboardHeroCards onNavigate={onNavigate} />
            </div>
          )}
        </div>
      )}

      {/* Pinned Features Quick Access */}
      {pinnedFeatures.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Pin className="h-4 w-4 text-primary fill-primary" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">My Pinned Features</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {pinnedFeatures.map(feature => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.id}
                  className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => onNavigate(feature.id)}
                >
                  <CardContent className="p-3 flex flex-col items-center text-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium leading-tight">{feature.label}</span>
                    {feature.badge && (
                      <Badge variant={feature.badgeVariant || 'secondary'} className="text-[9px] px-1 py-0">
                        {feature.badge}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            <Card
              className="cursor-pointer hover:shadow-md border-dashed hover:border-primary/30 transition-all duration-200"
              onClick={() => onNavigate('customize')}
            >
              <CardContent className="p-3 flex flex-col items-center text-center gap-2 justify-center h-full">
                <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Customize</span>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Weather Widget + Quick Stats */}
      {(showStats || showWeather) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showStats && (
            <div className={showWeather ? 'md:col-span-2' : 'md:col-span-3'}>
              <DashboardQuickStats countries={countries} />
            </div>
          )}
          {showWeather && (
            <div className={showStats ? '' : 'md:col-span-3'}>
              <DashboardWeatherWidget onNavigate={onNavigate} />
            </div>
          )}
        </div>
      )}

      {/* Two Column Layout for Dashboard Widgets */}
      {(showGamification || showActivity || showActions || showDiscovery) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(showGamification || showActivity) && (
            <div className="space-y-6">
              {showGamification && <DashboardGamification countries={countries} />}
              {showActivity && <DashboardRecentActivity countries={countries} />}
            </div>
          )}
          {(showActions || showDiscovery) && (
            <div className="space-y-6">
              {showActions && <DashboardSmartActions countries={countries} onActionClick={(action) => onNavigate(action)} />}
              {showDiscovery && <DashboardFeatureDiscovery onFeatureClick={(feature) => onNavigate(feature)} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeSection;
