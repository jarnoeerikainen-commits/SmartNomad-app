import React from 'react';
import { Country } from '@/types/country';
import { useActiveTrip } from '@/hooks/useActiveTrip';
import { ThreatIntelligenceService } from '@/services/ThreatIntelligenceService';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Sun, Coins, CalendarDays } from 'lucide-react';

interface Props {
  countries: Country[];
  onNavigate: (section: string) => void;
}

const Stat: React.FC<{ icon: React.ElementType; label: string; value: string; tone?: 'gold' | 'default' }> = ({ icon: Icon, label, value, tone }) => (
  <div className="flex flex-col items-start gap-1 px-4 py-3 rounded-xl bg-background/40 backdrop-blur border border-border/40 min-w-0">
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
    <div className={`font-display text-xl md:text-2xl leading-none truncate ${tone === 'gold' ? 'text-amber-600' : 'text-foreground'}`}>{value}</div>
  </div>
);

const ActiveTripCockpit: React.FC<Props> = ({ countries, onNavigate }) => {
  const { trip, isActive } = useActiveTrip(countries);
  if (!isActive || !trip) return null;

  const stats = ThreatIntelligenceService.getStatistics();
  const threatLabel = stats.activeNearby > 0 ? `${stats.activeNearby} nearby` : 'All clear';

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-amber-500/20 shadow-lg"
      style={{ background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card)) 60%, hsl(var(--accent) / 0.08) 100%)' }}
      aria-label="Active trip cockpit"
    >
      <div className="absolute inset-0 opacity-[0.04]" style={{ background: 'var(--gradient-gold)' }} />
      <div className="relative p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.25em] text-amber-700 mb-2 font-semibold">Active Trip</div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{trip.country.flag}</span>
              <h2 className="font-display text-2xl md:text-3xl leading-tight truncate">{trip.country.name}</h2>
            </div>
          </div>
          <Button
            onClick={() => onNavigate('tax-residency')}
            size="sm"
            className="border-0 text-foreground font-semibold flex-shrink-0"
            style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-glow-gold)' }}
          >
            Open Trip <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <Stat icon={CalendarDays} label="Day" value={`${trip.daysIn}`} tone="gold" />
          <Stat icon={Shield} label="Threat" value={threatLabel} />
          <Stat icon={Sun} label="Cap left" value={`${trip.remainingDays}d`} />
          <Stat icon={Coins} label="Limit" value={`${trip.limit}d`} />
        </div>
      </div>
    </section>
  );
};

export default ActiveTripCockpit;
