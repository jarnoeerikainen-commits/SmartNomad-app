import React, { useEffect, useState } from 'react';
import { Country } from '@/types/country';
import { useActiveTrip } from '@/hooks/useActiveTrip';
import { ThreatIntelligenceService } from '@/services/ThreatIntelligenceService';
import { Button } from '@/components/ui/button';
import { Plane, Scale, ShieldCheck, ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface MorningBriefingProps {
  countries: Country[];
  userName?: string;
  onNavigate: (section: string) => void;
}

type Tone = 'ok' | 'warn' | 'alert';

const toneStyles: Record<Tone, { ring: string; bg: string; dot: string; text: string; label: string }> = {
  ok: {
    ring: 'border-emerald-500/40',
    bg: 'bg-emerald-500/5',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'All clear',
  },
  warn: {
    ring: 'border-amber-500/50',
    bg: 'bg-amber-500/5',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'Review',
  },
  alert: {
    ring: 'border-red-500/50',
    bg: 'bg-red-500/5',
    dot: 'bg-red-500',
    text: 'text-red-700 dark:text-red-400',
    label: 'Action',
  },
};

interface BriefingCardProps {
  icon: React.ElementType;
  title: string;
  headline: string;
  detail: string;
  tone: Tone;
  cta: string;
  onClick: () => void;
}

const BriefingCard: React.FC<BriefingCardProps> = ({ icon: Icon, title, headline, detail, tone, cta, onClick }) => {
  const s = toneStyles[tone];
  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl border ${s.ring} ${s.bg} p-5 transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/40`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`h-9 w-9 rounded-xl bg-background/80 border ${s.ring} flex items-center justify-center`}>
            <Icon className={`h-4.5 w-4.5 ${s.text}`} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">{title}</div>
            <div className={`flex items-center gap-1.5 text-[11px] font-medium ${s.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="space-y-1">
        <div className="font-display text-2xl leading-tight text-foreground">{headline}</div>
        <div className="text-xs text-muted-foreground leading-relaxed">{detail}</div>
      </div>
      <div className="mt-3 text-[11px] font-medium text-foreground/70 group-hover:text-foreground transition-colors">
        {cta} →
      </div>
    </button>
  );
};

const MorningBriefing: React.FC<MorningBriefingProps> = ({ countries, userName, onNavigate }) => {
  const { trip, isActive } = useActiveTrip(countries);
  const [stats, setStats] = useState(() => ThreatIntelligenceService.getStatistics());
  const [inDanger, setInDanger] = useState(() => ThreatIntelligenceService.isUserInDangerZone());

  useEffect(() => {
    const refresh = () => {
      setStats(ThreatIntelligenceService.getStatistics());
      setInDanger(ThreatIntelligenceService.isUserInDangerZone());
    };
    refresh();
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, []);

  // --- Active Trip card ---
  let tripTone: Tone = 'ok';
  let tripHeadline = 'No active trip';
  let tripDetail = 'Add a country in Tracking to activate your trip cockpit.';
  let tripCta = 'Open Tracking';
  let tripTarget = 'tracking';
  if (isActive && trip) {
    tripTarget = 'tax-residency';
    tripCta = 'Open Trip';
    tripHeadline = `${trip.country.flag} ${trip.country.name} · Day ${trip.daysIn}`;
    const pct = trip.limit > 0 ? (trip.daysIn / trip.limit) * 100 : 0;
    if (trip.remainingDays <= 3) tripTone = 'alert';
    else if (pct >= 70) tripTone = 'warn';
    tripDetail = `${trip.remainingDays} days left of ${trip.limit}-day allowance`;
  }

  // --- Tax Days card ---
  const currentYear = new Date().getFullYear();
  const daysThisYear = countries.reduce((sum, c) => sum + (c.yearlyDaysSpent || 0), 0);
  const taxThreshold = 183;
  const remainingTax = Math.max(0, taxThreshold - daysThisYear);
  let taxTone: Tone = 'ok';
  if (daysThisYear >= taxThreshold) taxTone = 'alert';
  else if (daysThisYear >= taxThreshold * 0.8) taxTone = 'warn';
  const taxHeadline = `${daysThisYear} / 183 days`;
  const taxDetail =
    taxTone === 'alert'
      ? `Tax residency threshold reached in ${currentYear}. Review obligations.`
      : taxTone === 'warn'
        ? `${remainingTax} days left before 183-day threshold.`
        : `Well under threshold · ${remainingTax} days of headroom this year.`;

  // --- Threat card ---
  const nearby = stats.activeNearby || 0;
  const critical = stats.critical || 0;
  let threatTone: Tone = 'ok';
  let threatHeadline = 'No threats near you';
  let threatDetail = 'All monitored sources clear within 100 km.';
  if (inDanger || critical > 0) {
    threatTone = 'alert';
    threatHeadline = `${critical} critical · ${nearby} nearby`;
    threatDetail = 'Critical incidents detected. Tap to view actions.';
  } else if (nearby > 0) {
    threatTone = 'warn';
    threatHeadline = `${nearby} alert${nearby > 1 ? 's' : ''} nearby`;
    threatDetail = 'Non-critical incidents within 100 km of your location.';
  }

  const allOk = tripTone === 'ok' && taxTone === 'ok' && threatTone === 'ok';
  const today = format(new Date(), 'EEEE, d MMM yyyy');

  return (
    <section aria-label="Morning Briefing" className="space-y-4">
      {/* Header strip */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">Morning Briefing</div>
          <h1 className="font-display text-2xl md:text-3xl leading-tight text-foreground">
            {userName ? `Good morning, ${userName}` : 'Good morning'}
          </h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            {today}
          </div>
        </div>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
            allOk
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : threatTone === 'alert' || tripTone === 'alert' || taxTone === 'alert'
                ? 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'
          }`}
        >
          {allOk ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
          {allOk ? 'All systems clear' : 'Items need attention'}
        </div>
      </div>

      {/* Three focus cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BriefingCard
          icon={Plane}
          title="Active Trip"
          headline={tripHeadline}
          detail={tripDetail}
          tone={tripTone}
          cta={tripCta}
          onClick={() => onNavigate(tripTarget)}
        />
        <BriefingCard
          icon={Scale}
          title="Tax Days"
          headline={taxHeadline}
          detail={taxDetail}
          tone={taxTone}
          cta="Open Tax Hub"
          onClick={() => onNavigate('tax-residency')}
        />
        <BriefingCard
          icon={threatTone === 'ok' ? ShieldCheck : ShieldAlert}
          title="Threats Near You"
          headline={threatHeadline}
          detail={threatDetail}
          tone={threatTone}
          cta="Open Threat Intelligence"
          onClick={() => onNavigate('threats')}
        />
      </div>

      {/* Quick actions row */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <Button variant="outline" size="sm" onClick={() => onNavigate('ai-planner')}>
          Plan a trip
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate('tracking')}>
          Log day
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate('documents')}>
          Open vault
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onNavigate('customize')} className="ml-auto text-xs text-muted-foreground">
          Customize home
        </Button>
      </div>
    </section>
  );
};

export default MorningBriefing;
