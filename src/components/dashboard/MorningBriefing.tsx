import React, { useEffect, useMemo, useState } from 'react';
import { Country } from '@/types/country';
import { useActiveTrip } from '@/hooks/useActiveTrip';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { getDemoUpcomingTrips } from '@/data/upcomingTripsDemo';
import { ThreatIntelligenceService } from '@/services/ThreatIntelligenceService';
import { Button } from '@/components/ui/button';
import HomePersonaQuickSwitch from './HomePersonaQuickSwitch';
import CorporateBadge from './CorporateBadge';

import {
  Plane, Scale, ShieldCheck, ShieldAlert, ArrowRight,
  CheckCircle2, AlertTriangle, Clock,
} from 'lucide-react';
import { addDays, format } from 'date-fns';

interface MorningBriefingProps {
  countries: Country[];
  userName?: string;
  onNavigate: (section: string) => void;
}

type Tone = 'ok' | 'warn' | 'alert';

const toneStyles: Record<Tone, { ring: string; bg: string; dot: string; text: string; label: string }> = {
  ok:    { ring: 'border-emerald-500/40', bg: 'bg-emerald-500/5', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', label: 'Clear' },
  warn:  { ring: 'border-amber-500/50',   bg: 'bg-amber-500/5',   dot: 'bg-amber-500',   text: 'text-amber-700 dark:text-amber-400',     label: 'Review' },
  alert: { ring: 'border-red-500/50',     bg: 'bg-red-500/5',     dot: 'bg-red-500',     text: 'text-red-700 dark:text-red-400',         label: 'Action' },
};

const worst = (...t: Tone[]): Tone => t.includes('alert') ? 'alert' : t.includes('warn') ? 'warn' : 'ok';

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
      className={`group relative w-full text-left rounded-2xl border ${s.ring} ${s.bg} p-4 transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[148px] flex flex-col`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`h-9 w-9 shrink-0 rounded-xl bg-background/80 border ${s.ring} flex items-center justify-center`}>
            <Icon className={`h-4 w-4 ${s.text}`} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold truncate">{title}</div>
            <div className={`flex items-center gap-1.5 text-[11px] font-medium ${s.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
      <div className="space-y-1 flex-1">
        <div className="font-display text-xl md:text-2xl leading-tight text-foreground truncate" title={headline}>{headline}</div>
        <div className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">{detail}</div>
      </div>
      <div className="mt-2.5 text-[11px] font-medium text-foreground/70 group-hover:text-foreground transition-colors">
        {cta} →
      </div>
    </button>
  );
};

const MorningBriefing: React.FC<MorningBriefingProps> = ({ countries, userName, onNavigate }) => {
  const { trip, isActive } = useActiveTrip(countries);
  const { activePersonaId } = useDemoPersona();
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

  // --- Now / Next trip card ---
  let tripTone: Tone = 'ok';
  let tripTitle = 'Active Trip';
  let tripHeadline = 'No active trip';
  let tripDetail = 'Add a country in Tracking or plan your next move.';
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
  } else {
    // Fallback to nearest upcoming demo trip (Now/Next pattern).
    const trips = getDemoUpcomingTrips(activePersonaId as 'meghan' | 'john' | null);
    const next = [...trips].sort((a, b) => a.startInDays - b.startInDays)[0];
    if (next) {
      tripTitle = 'Next Trip';
      tripHeadline = `${next.flag} ${next.destination}`;
      const start = addDays(new Date(), next.startInDays);
      const inLabel = next.startInDays === 0 ? 'today' : next.startInDays === 1 ? 'tomorrow' : `in ${next.startInDays} days`;
      tripDetail = `${inLabel} · ${format(start, 'd MMM yyyy')} · ${next.purposeLabel}`;
      tripCta = 'Open dossier';
      tripTarget = 'ai-planner';
      if (next.startInDays <= 2) tripTone = 'warn';
    }
  }

  // --- Tax days card with inline Schengen mini-calc ---
  const currentYear = new Date().getFullYear();
  const daysThisYear = countries.reduce((sum, c) => sum + (c.yearlyDaysSpent || 0), 0);
  const taxThreshold = 183;
  const remainingTax = Math.max(0, taxThreshold - daysThisYear);
  let taxTone: Tone = 'ok';
  if (daysThisYear >= taxThreshold) taxTone = 'alert';
  else if (daysThisYear >= taxThreshold * 0.8) taxTone = 'warn';

  // Schengen mini calc: cap tracked EU/Schengen days at 90 over rolling 180 (simplified).
  const SCHENGEN = new Set(['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','CH']);
  const schengenDays = countries
    .filter(c => SCHENGEN.has((c as any).code) || SCHENGEN.has((c as any).countryCode))
    .reduce((sum, c) => sum + Math.min(90, c.yearlyDaysSpent || 0), 0);
  const schengenUsed = Math.min(90, schengenDays);
  if (schengenUsed >= 80) taxTone = worst(taxTone, 'alert');
  else if (schengenUsed >= 60) taxTone = worst(taxTone, 'warn');

  const taxHeadline = `${daysThisYear} / 183`;
  const taxDetail =
    schengenUsed > 0
      ? `Schengen ${schengenUsed}/90 · ${remainingTax} days to ${currentYear} 183 threshold`
      : taxTone === 'alert'
        ? `Tax residency threshold reached in ${currentYear}.`
        : taxTone === 'warn'
          ? `${remainingTax} days to 183 threshold.`
          : `${remainingTax} days of headroom this year.`;

  // --- Threats card ---
  const nearby = stats.activeNearby || 0;
  const critical = stats.critical || 0;
  let threatTone: Tone = 'ok';
  let threatHeadline = 'No threats nearby';
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

  const overall = worst(tripTone, taxTone, threatTone);
  const overallMeta = toneStyles[overall];
  const today = format(new Date(), 'EEEE, d MMM yyyy');

  const overallChip = useMemo(() => {
    if (overall === 'ok') return { cls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', icon: CheckCircle2, text: 'All systems clear' };
    const issues = [tripTone, taxTone, threatTone].filter(t => t !== 'ok').length;
    const txt = `${issues} item${issues > 1 ? 's' : ''} need${issues > 1 ? '' : 's'} attention`;
    return overall === 'alert'
      ? { cls: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400', icon: AlertTriangle, text: txt }
      : { cls: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400', icon: AlertTriangle, text: txt };
  }, [overall, tripTone, taxTone, threatTone]);

  const OverallIcon = overallChip.icon;

  return (
    <section aria-label="Morning Briefing" className="space-y-3">
      {/* Unified hero status bar */}
      <div className={`flex items-start sm:items-center justify-between gap-3 flex-wrap rounded-2xl border ${overallMeta.ring} ${overallMeta.bg} px-4 py-3`}>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">Morning Briefing</div>
          <h1 className="font-display text-xl md:text-2xl leading-tight text-foreground">
            {userName ? `Good morning, ${userName}` : 'Good morning'}
          </h1>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
            <Clock className="h-3 w-3" />
            {today}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <HomePersonaQuickSwitch />
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${overallChip.cls}`}>
            <OverallIcon className="h-3.5 w-3.5" />
            {overallChip.text}
          </div>
        </div>
      </div>

      {/* Three focus cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <BriefingCard
          icon={Plane}
          title={tripTitle}
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
        <Button variant="outline" size="sm" onClick={() => onNavigate('ai-planner')}>Plan a trip</Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate('tracking')}>Log day</Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate('documents')}>Open vault</Button>
        <Button variant="ghost" size="sm" onClick={() => onNavigate('customize')} className="sm:ml-auto text-xs text-muted-foreground">
          Customize home
        </Button>
      </div>
    </section>
  );
};

export default MorningBriefing;
