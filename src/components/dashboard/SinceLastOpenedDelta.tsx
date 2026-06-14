import React, { useEffect, useMemo, useState } from 'react';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { getDemoUpcomingTrips } from '@/data/upcomingTripsDemo';
import { Bell, ChevronRight, X } from 'lucide-react';

interface Props {
  onNavigate: (section: string) => void;
}

const STORAGE_KEY = 'supernomad_home_last_opened_at';

interface Delta {
  key: string;
  label: string;
  section: string;
  tone: 'info' | 'warn' | 'alert';
}

const toneCls: Record<Delta['tone'], string> = {
  info:  'text-foreground/80',
  warn:  'text-amber-600 dark:text-amber-400',
  alert: 'text-red-600 dark:text-red-400',
};

/**
 * "Since you last opened" strip. Auto-hides if there's nothing to report.
 * Sources: upcoming trips that crossed inside the 7-day window since last visit,
 * plus any clearance items still flagged action.
 */
const SinceLastOpenedDelta: React.FC<Props> = ({ onNavigate }) => {
  const { activePersonaId } = useDemoPersona();
  const [dismissed, setDismissed] = useState(false);
  const [hoursAway, setHoursAway] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const last = raw ? Number(raw) : NaN;
      if (Number.isFinite(last)) setHoursAway((Date.now() - last) / 36e5);
      else setHoursAway(null);
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {}
  }, []);

  const deltas = useMemo<Delta[]>(() => {
    if (hoursAway === null || hoursAway < 6) return []; // only after meaningful gap
    const trips = getDemoUpcomingTrips(activePersonaId as 'meghan' | 'john' | null);
    const list: Delta[] = [];
    trips.forEach(t => {
      if (t.startInDays <= 7 && t.startInDays >= 0) {
        list.push({
          key: `near-${t.id}`,
          label: `${t.destination} is now ${t.startInDays === 0 ? 'today' : `in ${t.startInDays}d`}`,
          section: 'ai-planner',
          tone: t.startInDays <= 2 ? 'warn' : 'info',
        });
      }
      if (t.clearance.visa === 'action') {
        list.push({ key: `v-${t.id}`, label: `Visa action — ${t.destination}: ${t.clearance.visaNote}`, section: 'visa-immigration', tone: 'alert' });
      }
      if (t.clearance.vaccinations === 'action') {
        list.push({ key: `h-${t.id}`, label: `Health action — ${t.destination}: ${t.clearance.vaccinationsNote}`, section: 'vaccination-hub', tone: 'alert' });
      }
    });
    return list.slice(0, 3);
  }, [hoursAway, activePersonaId]);

  if (dismissed || deltas.length === 0) return null;

  return (
    <section aria-label="Updates since your last visit" className="rounded-xl border border-border/60 bg-card/60 px-3 py-2">
      <div className="flex items-center gap-2 mb-1.5">
        <Bell className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">Since you last opened</span>
        <button
          onClick={() => setDismissed(true)}
          className="ml-auto text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <ul className="space-y-1">
        {deltas.map(d => (
          <li key={d.key}>
            <button
              onClick={() => onNavigate(d.section)}
              className={`w-full flex items-center gap-2 text-left text-[12px] leading-snug hover:underline underline-offset-2 ${toneCls[d.tone]}`}
            >
              <span className="flex-1 truncate">{d.label}</span>
              <ChevronRight className="h-3 w-3 opacity-60 shrink-0" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SinceLastOpenedDelta;
