import React, { useMemo } from 'react';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { getDemoUpcomingTrips } from '@/data/upcomingTripsDemo';
import { Plane, Wifi, CloudSun, CheckSquare, Car, Clock } from 'lucide-react';
import { addDays, addHours, format, differenceInHours } from 'date-fns';

interface Props {
  onNavigate: (section: string) => void;
}

interface Item {
  key: string;
  icon: React.ElementType;
  label: string;
  when: string;
  hint: string;
  section: string;
  hoursOut: number;
}

/**
 * Next 72-hour timeline derived from the nearest upcoming trip.
 * Shows the realistic pre-departure sequence: check-in opens, eSIM activates,
 * weather at landing, flight time, transfer on arrival.
 */
const Next72Timeline: React.FC<Props> = ({ onNavigate }) => {
  const { activePersonaId } = useDemoPersona();

  const items = useMemo<Item[]>(() => {
    const trips = getDemoUpcomingTrips(activePersonaId as 'meghan' | 'john' | null);
    const next = [...trips].sort((a, b) => a.startInDays - b.startInDays)[0];
    if (!next) return [];

    const now = new Date();
    const departure = addDays(now, next.startInDays);
    const hoursToDep = differenceInHours(departure, now);
    if (hoursToDep > 72) return [];

    const list: Item[] = [];
    const checkIn = addHours(departure, -24);
    if (differenceInHours(checkIn, now) > 0) {
      list.push({
        key: 'checkin',
        icon: CheckSquare,
        label: 'Online check-in opens',
        when: format(checkIn, 'EEE HH:mm'),
        hint: `for ${next.destination}`,
        section: 'ai-planner',
        hoursOut: differenceInHours(checkIn, now),
      });
    }
    list.push({
      key: 'esim',
      icon: Wifi,
      label: 'eSIM ready to activate',
      when: 'on landing',
      hint: `${next.country} data plan`,
      section: 'esim',
      hoursOut: hoursToDep,
    });
    list.push({
      key: 'weather',
      icon: CloudSun,
      label: 'Weather at landing',
      when: format(departure, 'EEE'),
      hint: `${next.destination} forecast`,
      section: 'weather',
      hoursOut: hoursToDep,
    });
    list.push({
      key: 'flight',
      icon: Plane,
      label: `Flight to ${next.destination}`,
      when: format(departure, 'd MMM · HH:mm'),
      hint: next.purposeLabel,
      section: 'ai-planner',
      hoursOut: hoursToDep,
    });
    list.push({
      key: 'transfer',
      icon: Car,
      label: 'Transfer on arrival',
      when: 'on arrival',
      hint: 'pre-book ride or transit',
      section: 'taxis',
      hoursOut: hoursToDep,
    });
    return list;
  }, [activePersonaId]);

  if (items.length === 0) return null;

  return (
    <section aria-label="Next 72 hours" className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">Next 72 hours</div>
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" /> live
        </span>
      </div>
      <div className="relative rounded-2xl border border-border/60 bg-card/60 p-3">
        <ol className="relative space-y-2">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <li key={it.key}>
                <button
                  onClick={() => onNavigate(it.section)}
                  className="group w-full flex items-center gap-3 text-left rounded-lg p-2 hover:bg-muted/40 transition-colors"
                >
                  <div className="relative">
                    <div className="h-7 w-7 rounded-full border border-border/60 bg-background flex items-center justify-center">
                      <Icon className="h-3.5 w-3.5 text-foreground/80" />
                    </div>
                    {i < items.length - 1 && (
                      <span className="absolute left-1/2 top-7 h-3 w-px -translate-x-1/2 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium leading-tight truncate">{it.label}</div>
                    <div className="text-[10.5px] text-muted-foreground leading-tight truncate">{it.hint}</div>
                  </div>
                  <div className="text-[11px] font-medium text-muted-foreground">{it.when}</div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default Next72Timeline;
