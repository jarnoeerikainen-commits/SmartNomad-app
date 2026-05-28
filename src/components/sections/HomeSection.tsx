import React, { useState } from 'react';
import { Country } from '@/types/country';
import { Subscription } from '@/types/subscription';
import DashboardHeroCards from '@/components/dashboard/DashboardHeroCards';
import { DashboardFeatureDiscovery } from '@/components/dashboard/DashboardFeatureDiscovery';
import { DashboardGamification } from '@/components/dashboard/DashboardGamification';
import { DashboardSmartActions } from '@/components/dashboard/DashboardSmartActions';
import { DashboardRecentActivity } from '@/components/dashboard/DashboardRecentActivity';
import DashboardQuickStats from '@/components/DashboardQuickStats';
import DashboardWeatherWidget from '@/components/weather/DashboardWeatherWidget';
import SovereignAccessNudge from '@/components/dashboard/SovereignAccessNudge';
import SuperNomadCallCard from '@/components/dashboard/SuperNomadCallCard';
import ModeSwitcher from '@/components/dashboard/ModeSwitcher';
import ActiveTripCockpit from '@/components/dashboard/ActiveTripCockpit';
import MorningBriefing from '@/components/dashboard/MorningBriefing';
import UpcomingTripsBar from '@/components/dashboard/UpcomingTripsBar';
import SchengenEESAlert from '@/components/dashboard/SchengenEESAlert';
import { useActiveTrip } from '@/hooks/useActiveTrip';
import { useFeaturePreferences } from '@/hooks/useFeaturePreferences';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pin, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HomeSectionProps {
  countries: Country[];
  subscription: Subscription;
  onNavigate: (section: string) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ countries, subscription, onNavigate }) => {
  const { getPinnedFeatures, isVisible } = useFeaturePreferences();
  const pinnedFeatures = getPinnedFeatures();
  const { isActive: tripActive } = useActiveTrip(countries);
  const [showMore, setShowMore] = useState(false);

  const { user } = useAuth() as any;
  const userName: string | undefined =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.name ||
    (user?.email ? String(user.email).split('@')[0] : undefined);

  const showStats = isVisible('dash-stats');
  const showWeather = isVisible('dash-weather');
  const showGamification = isVisible('dash-gamification');
  const showActivity = isVisible('dash-activity');
  const showActions = isVisible('dash-actions');
  const showDiscovery = isVisible('dash-discovery');
  const showWelcome = isVisible('dash-welcome');

  const anyExtras =
    showStats || showWeather || showGamification || showActivity || showActions || showDiscovery || showWelcome;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-6 px-0">
      <ModeSwitcher />

      {/* The one-screen morning briefing */}
      <MorningBriefing countries={countries} userName={userName} onNavigate={onNavigate} />

      {/* Optional active trip cockpit (compact, only when on a trip) */}
      {tripActive && <ActiveTripCockpit countries={countries} onNavigate={onNavigate} />}

      {/* Upcoming trips — categorized by purpose with visa/health/risk clearance */}
      <UpcomingTripsBar onNavigate={onNavigate} />

      {/* Critical compliance nudge (auto-hides if irrelevant) */}
      <SchengenEESAlert countries={countries} onNavigate={onNavigate} />

      {/* Concierge call + sovereign access — small, contextual */}
      <SuperNomadCallCard onNavigate={onNavigate} />
      <SovereignAccessNudge onOpen={() => onNavigate('sovereign-access')} />

      {/* Pinned features */}
      {pinnedFeatures.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Pin className="h-4 w-4 text-primary fill-primary" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pinned</h3>
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

      {/* Everything else — hidden by default, collapsible */}
      {anyExtras && (
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMore(v => !v)}
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            {showMore ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {showMore ? 'Hide extras' : 'Show more dashboard widgets'}
          </Button>

          {showMore && (
            <div className="space-y-6 mt-4 animate-fade-in">
              {showWelcome && !tripActive && <DashboardHeroCards onNavigate={onNavigate} />}

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
          )}
        </div>
      )}
    </div>
  );
};

export default HomeSection;
