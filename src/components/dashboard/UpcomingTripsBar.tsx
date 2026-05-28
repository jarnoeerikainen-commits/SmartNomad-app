import React, { useMemo } from 'react';
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
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

const ClearancePill: React.FC<{ icon: React.ElementType; label: string; status: ClearanceStatus; note: string }> = ({ icon: Icon, label, status, note }) => {
  const m = clearanceMeta[status];
  const StatusIcon = m.icon;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-border/60 bg-background/70 text-[10.5px] font-medium ${m.tone} hover:bg-background transition-colors`}
          aria-label={`${label}: ${m.label}`}
        >
          <Icon className="h-3 w-3" />
          <span className="text-foreground/80">{label}</span>
          <StatusIcon className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="w-64 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-semibold">{label}</span>
          <span className={`ml-auto inline-flex items-center gap-1 ${m.tone}`}>
            <StatusIcon className="h-3 w-3" /> {m.label}
          </span>
        </div>
        <p className="text-muted-foreground leading-relaxed">{note}</p>
      </PopoverContent>
    </Popover>
  );
};

const TripCard: React.FC<{ trip: UpcomingTrip; onOpen: () => void }> = ({ trip, onOpen }) => {
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
      {/* Header */}
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

      {/* Destination */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xl leading-none">{trip.flag}</span>
        <h3 className="font-display text-lg leading-tight truncate text-foreground">{trip.destination}</h3>
      </div>
      <div className="text-[11px] text-muted-foreground">{trip.country}</div>

      {/* Dates */}
      <div className="mt-2.5 flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <CalendarClock className="h-3 w-3" />
          {format(start, 'd MMM')} – {format(end, 'd MMM yyyy')}
        </span>
        <span className="font-semibold text-foreground/90">{startLabel}</span>
      </div>

      {/* Clearance pills */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <ClearancePill icon={FileCheck2} label="Visa"   status={trip.clearance.visa}          note={trip.clearance.visaNote} />
        <ClearancePill icon={Syringe}    label="Health" status={trip.clearance.vaccinations}  note={trip.clearance.vaccinationsNote} />
        <ClearancePill icon={ShieldAlert} label="Risk"  status={trip.clearance.threats}       note={trip.clearance.threatsNote} />
      </div>
    </button>
  );
};

const UpcomingTripsBar: React.FC<Props> = ({ onNavigate }) => {
  const { activePersonaId } = useDemoPersona();
  const trips = useMemo(() => {
    const list = getDemoUpcomingTrips(activePersonaId as 'meghan' | 'john' | null);
    return [...list].sort((a, b) => a.startInDays - b.startInDays);
  }, [activePersonaId]);

  if (trips.length === 0) return null;

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
          <TripCard key={t.id} trip={t} onOpen={() => onNavigate('tracking')} />
        ))}
      </div>
    </section>
  );
};

export default UpcomingTripsBar;
