import React, { useMemo, useState } from 'react';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import {
  getDemoUpcomingTrips,
  UpcomingTrip,
  TripPurpose,
  ClearanceStatus,
} from '@/data/upcomingTripsDemo';
import {
  Briefcase, Trophy, Sparkles, Users, Layers,
  FileCheck2, Syringe, ShieldAlert, CalendarClock,
  CheckCircle2, AlertTriangle, AlertOctagon, MinusCircle,
  Plane, CloudSun, Umbrella, Building2, Phone, Wifi,
  MapPin, ArrowRight, BookOpen, Map as MapIcon,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface Props {
  onNavigate: (section: string) => void;
}

const purposeMeta: Record<TripPurpose, { label: string; icon: React.ElementType; ring: string; bg: string; chip: string; dot: string }> = {
  business:  { label: 'Business', icon: Briefcase, ring: 'border-sky-500/40',    bg: 'bg-sky-500/5',    chip: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30',    dot: 'bg-sky-500' },
  sports:    { label: 'Sports',   icon: Trophy,    ring: 'border-emerald-500/40',bg: 'bg-emerald-500/5',chip: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-500' },
  pleasure:  { label: 'Pleasure', icon: Sparkles,  ring: 'border-fuchsia-500/40',bg: 'bg-fuchsia-500/5',chip: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30', dot: 'bg-fuchsia-500' },
  family:    { label: 'Family',   icon: Users,     ring: 'border-amber-500/40',  bg: 'bg-amber-500/5',  chip: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',          dot: 'bg-amber-500' },
  combo:     { label: 'Combo',    icon: Layers,    ring: 'border-violet-500/40', bg: 'bg-violet-500/5', chip: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30',     dot: 'bg-violet-500' },
};

const clearanceMeta: Record<ClearanceStatus, { tone: string; icon: React.ElementType; label: string }> = {
  clear:  { tone: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2,  label: 'Clear' },
  warn:   { tone: 'text-amber-600 dark:text-amber-400',     icon: AlertTriangle, label: 'Review' },
  action: { tone: 'text-red-600 dark:text-red-400',         icon: AlertOctagon,  label: 'Action' },
  na:     { tone: 'text-muted-foreground',                  icon: MinusCircle,   label: 'N/A' },
};

const worstStatus = (statuses: ClearanceStatus[]): ClearanceStatus => {
  if (statuses.includes('action')) return 'action';
  if (statuses.includes('warn')) return 'warn';
  if (statuses.every(s => s === 'na')) return 'na';
  return 'clear';
};

type PillKind = 'visa' | 'health' | 'risk';

const pillSectionMap: Record<PillKind, string> = {
  visa:   'visa-immigration',
  health: 'vaccination-hub',
  risk:   'threats',
};

const ClearancePill: React.FC<{
  kind: PillKind;
  icon: React.ElementType;
  label: string;
  status: ClearanceStatus;
  note: string;
  onJump: (section: string) => void;
}> = ({ kind, icon: Icon, label, status, note, onJump }) => {
  const m = clearanceMeta[status];
  const StatusIcon = m.icon;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-border/60 bg-background/70 text-[10.5px] font-medium ${m.tone} hover:bg-background transition-colors`}
          aria-label={`${label}: ${m.label}`}
        >
          <Icon className="h-3 w-3" />
          <span className="text-foreground/80">{label}</span>
          <StatusIcon className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="w-72 text-xs" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-semibold">{label}</span>
          <span className={`ml-auto inline-flex items-center gap-1 ${m.tone}`}>
            <StatusIcon className="h-3 w-3" /> {m.label}
          </span>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-2.5">{note}</p>
        <Button
          size="sm"
          variant="secondary"
          className="w-full h-7 text-[11px]"
          onClick={() => onJump(pillSectionMap[kind])}
        >
          Open {label} hub
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const TripCard: React.FC<{ trip: UpcomingTrip; onOpen: () => void; onJump: (s: string) => void }> = ({ trip, onOpen, onJump }) => {
  const meta = purposeMeta[trip.purpose];
  const PurposeIcon = meta.icon;
  const start = addDays(new Date(), trip.startInDays);
  const end = addDays(start, trip.durationDays - 1);
  const overall = worstStatus([trip.clearance.visa, trip.clearance.vaccinations, trip.clearance.threats]);
  const overallMeta = clearanceMeta[overall];
  const OverallIcon = overallMeta.icon;

  const startLabel = trip.startInDays === 0
    ? 'Today'
    : trip.startInDays === 1
      ? 'Tomorrow'
      : `${trip.startInDays}d`;

  return (
    <button
      onClick={onOpen}
      className={`group snap-start shrink-0 w-[280px] md:w-[300px] text-left rounded-2xl border ${meta.ring} ${meta.bg} p-4 transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/40`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`h-8 w-8 rounded-lg bg-background/80 border ${meta.ring} flex items-center justify-center`}>
            <PurposeIcon className="h-4 w-4 text-foreground/80" />
          </div>
          <div className="min-w-0">
            <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9.5px] uppercase tracking-wider font-semibold ${meta.chip}`}>
              <span className={`h-1 w-1 rounded-full ${meta.dot}`} />
              {meta.label}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{trip.purposeLabel}</div>
          </div>
        </div>
        <div className={`inline-flex items-center gap-1 text-[10px] font-medium ${overallMeta.tone}`} title={`Overall clearance: ${overallMeta.label}`}>
          <OverallIcon className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xl leading-none">{trip.flag}</span>
        <h3 className="font-display text-lg leading-tight truncate text-foreground">{trip.destination}</h3>
      </div>
      <div className="text-[11px] text-muted-foreground">{trip.country}</div>

      <div className="mt-2.5 flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <CalendarClock className="h-3 w-3" />
          {format(start, 'd MMM')} – {format(end, 'd MMM yyyy')}
        </span>
        <span className="font-semibold text-foreground/90">{startLabel}</span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <ClearancePill kind="visa"   icon={FileCheck2}  label="Visa"   status={trip.clearance.visa}         note={trip.clearance.visaNote}         onJump={onJump} />
        <ClearancePill kind="health" icon={Syringe}     label="Health" status={trip.clearance.vaccinations} note={trip.clearance.vaccinationsNote} onJump={onJump} />
        <ClearancePill kind="risk"   icon={ShieldAlert} label="Risk"   status={trip.clearance.threats}      note={trip.clearance.threatsNote}      onJump={onJump} />
      </div>

      <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[10.5px] text-muted-foreground">
        <span>Tap for full trip dossier</span>
        <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  );
};

const TripDetailSheet: React.FC<{
  trip: UpcomingTrip | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onJump: (s: string) => void;
}> = ({ trip, open, onOpenChange, onJump }) => {
  if (!trip) return null;
  const meta = purposeMeta[trip.purpose];
  const start = addDays(new Date(), trip.startInDays);
  const end = addDays(start, trip.durationDays - 1);
  const overall = worstStatus([trip.clearance.visa, trip.clearance.vaccinations, trip.clearance.threats]);
  const overallMeta = clearanceMeta[overall];

  const jump = (section: string) => {
    onOpenChange(false);
    setTimeout(() => onJump(section), 60);
  };

  const sections: Array<{
    key: PillKind | 'overview';
    icon: React.ElementType;
    label: string;
    status?: ClearanceStatus;
    note: string;
    section: string;
  }> = [
    { key: 'visa',   icon: FileCheck2,  label: 'Visa & immigration', status: trip.clearance.visa,         note: trip.clearance.visaNote,         section: 'visa-immigration' },
    { key: 'health', icon: Syringe,     label: 'Health & vaccinations', status: trip.clearance.vaccinations, note: trip.clearance.vaccinationsNote, section: 'vaccination-hub' },
    { key: 'risk',   icon: ShieldAlert, label: 'Threat intelligence', status: trip.clearance.threats,      note: trip.clearance.threatsNote,      section: 'threats' },
  ];

  const links: Array<{ icon: React.ElementType; label: string; section: string; sub: string }> = [
    { icon: Plane,    label: 'Flights & itinerary',  section: 'ai-planner',       sub: 'Build, hold or rebook' },
    { icon: BookOpen, label: 'Full trip planner',    section: 'ai-planner',       sub: 'Day-by-day plan + TTS' },
    { icon: CalendarClock, label: 'Calendar & tax days', section: 'tracking',     sub: 'Add to calendar, count days' },
    { icon: CloudSun, label: 'Weather & conditions', section: 'weather',          sub: '15-day forecast + sport intel' },
    { icon: Umbrella, label: 'Travel insurance',     section: 'travel-insurance', sub: 'Coverage for this trip' },
    { icon: Building2,label: 'Embassy & consulate',  section: 'embassy',          sub: `Find ${trip.country} embassies` },
    { icon: Phone,    label: 'Emergency numbers',    section: 'emergency-cards',  sub: 'Local SOS, police, medical' },
    { icon: Wifi,     label: 'eSIM & connectivity',  section: 'esim',             sub: 'Activate before landing' },
    { icon: MapIcon,  label: 'Local life & dining',  section: 'explore-local-life', sub: 'Vetted local picks' },
    { icon: MapPin,   label: 'Transport on arrival', section: 'taxis',            sub: 'Taxis, transfers, transit' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
        <div className={`p-5 border-b ${meta.bg}`}>
          <SheetHeader className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider font-semibold ${meta.chip}`}>
                <span className={`h-1 w-1 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              <span className={`inline-flex items-center gap-1 text-[11px] ${overallMeta.tone}`}>
                <overallMeta.icon className="h-3 w-3" /> {overallMeta.label}
              </span>
            </div>
            <SheetTitle className="font-display text-2xl flex items-center gap-2">
              <span>{trip.flag}</span> {trip.destination}
              <span className="text-muted-foreground font-sans text-sm font-normal">· {trip.country}</span>
            </SheetTitle>
            <SheetDescription className="text-xs flex items-center gap-2">
              <CalendarClock className="h-3.5 w-3.5" />
              {format(start, 'd MMM yyyy')} – {format(end, 'd MMM yyyy')} · {trip.durationDays} days · in {trip.startInDays}d
            </SheetDescription>
            <div className="text-xs text-muted-foreground">{trip.purposeLabel}</div>
          </SheetHeader>
        </div>

        <div className="p-5 space-y-5">
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold mb-2">Clearance status</h3>
            <div className="space-y-2">
              {sections.map(s => {
                const sm = s.status ? clearanceMeta[s.status] : clearanceMeta.clear;
                const SIcon = sm.icon;
                return (
                  <button
                    key={s.key}
                    onClick={() => jump(s.section)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-background hover:bg-muted/40 transition-colors text-left"
                  >
                    <s.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{s.label}</span>
                        <span className={`ml-auto inline-flex items-center gap-1 text-[10.5px] ${sm.tone}`}>
                          <SIcon className="h-3 w-3" /> {sm.label}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-muted-foreground leading-relaxed mt-0.5">{s.note}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground self-center" />
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold mb-2">Trip resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {links.map(l => (
                <button
                  key={l.label}
                  onClick={() => jump(l.section)}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-border/60 bg-background hover:bg-muted/40 transition-colors text-left"
                >
                  <l.icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium leading-tight">{l.label}</div>
                    <div className="text-[10.5px] text-muted-foreground leading-tight mt-0.5">{l.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-wrap gap-2 pt-2">
            <Button size="sm" variant="default" onClick={() => jump('ai-planner')}>
              <Plane className="h-3.5 w-3.5 mr-1.5" /> Open full plan
            </Button>
            <Button size="sm" variant="secondary" onClick={() => jump('tracking')}>
              <CalendarClock className="h-3.5 w-3.5 mr-1.5" /> Calendar
            </Button>
            <Button size="sm" variant="outline" onClick={() => jump('ai')}>
              Ask Concierge
            </Button>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const UpcomingTripsBar: React.FC<Props> = ({ onNavigate }) => {
  const { activePersonaId } = useDemoPersona();
  const trips = useMemo(() => {
    const list = getDemoUpcomingTrips(activePersonaId as 'meghan' | 'john' | null);
    return [...list].sort((a, b) => a.startInDays - b.startInDays);
  }, [activePersonaId]);

  const [activeTrip, setActiveTrip] = useState<UpcomingTrip | null>(null);
  const [open, setOpen] = useState(false);

  if (trips.length === 0) return null;

  const openTrip = (t: UpcomingTrip) => {
    setActiveTrip(t);
    setOpen(true);
  };

  return (
    <section aria-label="Upcoming trips" className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">Upcoming Trips</div>
          <h2 className="font-display text-lg md:text-xl leading-tight text-foreground">Next {trips.length} on the calendar</h2>
        </div>
        <button
          onClick={() => onNavigate('ai-planner')}
          className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          Plan new →
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-thin">
        {trips.map(t => (
          <TripCard key={t.id} trip={t} onOpen={() => openTrip(t)} onJump={onNavigate} />
        ))}
      </div>

      <TripDetailSheet trip={activeTrip} open={open} onOpenChange={setOpen} onJump={onNavigate} />
    </section>
  );
};

export default UpcomingTripsBar;
