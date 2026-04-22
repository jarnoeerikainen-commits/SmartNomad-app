/**
 * CalendarService — single source of truth for the SuperNomad calendar
 * ecosystem. Stores events on-device (localStorage) keyed per persona/user
 * so demo personas (Meghan, John) and signed-in users each have their own
 * timeline. All bookings, appointments, sports, meetings, and
 * concierge-confirmed events flow through here.
 *
 * Design choices:
 *  - Read-only by default. Writes happen only via explicit `addEvent` /
 *    `confirmProposal` calls — never silently from AI streams.
 *  - Cross-tab sync via the `storage` event + a custom `supernomad:calendar`
 *    event for in-tab listeners.
 *  - Demo personas seed a busy calendar on first load, but new events the
 *    user adds (during a demo session) persist alongside.
 */

import {
  CalendarEvent,
  CalendarEventCategory,
  CalendarEventProposal,
  CalendarEventSource,
  DEFAULT_REMINDERS,
  ReminderRule,
} from '@/types/calendarEvent';
import { DemoCalendarEvent } from '@/data/demoPersonas';

const STORAGE_PREFIX = 'supernomad_calendar_v1';
const DISPATCH_EVENT = 'supernomad:calendar';

type ScopeKey = string;

function scopeKey(personaId: string | null | undefined): ScopeKey {
  if (personaId === 'meghan' || personaId === 'john') return `${STORAGE_PREFIX}:demo:${personaId}`;
  return `${STORAGE_PREFIX}:user`;
}

function safeUUID(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readEvents(personaId: string | null | undefined): CalendarEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(scopeKey(personaId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CalendarEvent[]) : [];
  } catch {
    return [];
  }
}

function writeEvents(personaId: string | null | undefined, events: CalendarEvent[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(scopeKey(personaId), JSON.stringify(events));
    window.dispatchEvent(
      new CustomEvent(DISPATCH_EVENT, { detail: { personaId: personaId ?? null } })
    );
  } catch (err) {
    console.warn('CalendarService: failed to persist events', err);
  }
}

/** Combine an ISO date (YYYY-MM-DD) and HH:mm time into a local ISO string. */
function combineDateTime(date: string, time: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = (time || '09:00').split(':').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
  return dt.toISOString();
}

function defaultEnd(startIso: string, minutes = 60): string {
  const d = new Date(startIso);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

// ─── Demo persona category mapping ───────────────────────────
const DEMO_CATEGORY: Record<DemoCalendarEvent['type'], CalendarEventCategory> = {
  meeting: 'meeting',
  sport: 'sport',
  travel: 'travel',
  personal: 'personal',
  family: 'family',
  legal: 'legal',
  wellness: 'wellness',
  social: 'social',
  holiday: 'personal',
  birthday: 'birthday',
  gala: 'social',
  dining: 'meal',
};

function fromDemoEvent(d: DemoCalendarEvent, idx: number): CalendarEvent {
  const start = combineDateTime(d.date, d.time);
  const category = DEMO_CATEGORY[d.type] ?? 'personal';
  return {
    id: `demo_${d.date}_${idx}_${d.time.replace(':', '')}`,
    start,
    end: defaultEnd(start, category === 'travel' ? 180 : 60),
    title: d.title,
    category,
    location: d.location,
    source: 'demo-persona',
    reminders: DEFAULT_REMINDERS[category].map((r) => ({ ...r, fired: false })),
    createdAt: new Date().toISOString(),
  };
}

// ─── Public API ──────────────────────────────────────────────

export class CalendarService {
  /**
   * Get all events for a persona (or signed-in user when personaId null).
   * Auto-seeds demo persona events on first read.
   */
  static getEvents(personaId: string | null | undefined): CalendarEvent[] {
    const existing = readEvents(personaId);
    if (existing.length > 0) return existing;

    // Seed demo personas on first read
    if (personaId === 'meghan' || personaId === 'john') {
      try {
        // Lazy require to avoid circular import at module init
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { DEMO_PERSONAS } = require('@/data/demoPersonas') as typeof import('@/data/demoPersonas');
        const persona = DEMO_PERSONAS[personaId];
        if (persona?.calendar) {
          const seeded = persona.calendar.map((d, i) => fromDemoEvent(d, i));
          writeEvents(personaId, seeded);
          return seeded;
        }
      } catch (err) {
        console.warn('CalendarService: demo seed failed', err);
      }
    }
    return [];
  }

  /**
   * Re-seed demo events from the persona definition (useful when the
   * day rolls over and we want fresh dates relative to TODAY).
   */
  static reseedDemoPersona(personaId: 'meghan' | 'john'): CalendarEvent[] {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { DEMO_PERSONAS } = require('@/data/demoPersonas') as typeof import('@/data/demoPersonas');
      const persona = DEMO_PERSONAS[personaId];
      if (!persona?.calendar) return [];
      // Preserve any user-added events (non demo-persona source) created during the demo session
      const existing = readEvents(personaId).filter((e) => e.source !== 'demo-persona');
      const seeded = persona.calendar.map((d, i) => fromDemoEvent(d, i));
      const merged = [...seeded, ...existing];
      writeEvents(personaId, merged);
      return merged;
    } catch {
      return readEvents(personaId);
    }
  }

  static addEvent(
    personaId: string | null | undefined,
    input: Partial<CalendarEvent> & {
      start: string;
      title: string;
      category: CalendarEventCategory;
      source?: CalendarEventSource;
    }
  ): CalendarEvent {
    const events = readEvents(personaId);
    const event: CalendarEvent = {
      id: input.id ?? safeUUID(),
      start: input.start,
      end: input.end ?? defaultEnd(input.start),
      title: input.title,
      category: input.category,
      location: input.location,
      notes: input.notes,
      source: input.source ?? 'manual',
      externalRef: input.externalRef,
      provider: input.provider,
      participants: input.participants,
      reminders:
        input.reminders ??
        DEFAULT_REMINDERS[input.category].map((r) => ({ ...r, fired: false })),
      aiProposed: input.aiProposed,
      createdAt: input.createdAt ?? new Date().toISOString(),
      metadata: input.metadata,
    };
    // Dedupe by externalRef when present
    const filtered = event.externalRef
      ? events.filter((e) => e.externalRef !== event.externalRef)
      : events;
    const next = [...filtered, event].sort((a, b) => a.start.localeCompare(b.start));
    writeEvents(personaId, next);
    return event;
  }

  static updateEvent(
    personaId: string | null | undefined,
    id: string,
    patch: Partial<CalendarEvent>
  ): CalendarEvent | null {
    const events = readEvents(personaId);
    const idx = events.findIndex((e) => e.id === id);
    if (idx < 0) return null;
    const updated = { ...events[idx], ...patch };
    events[idx] = updated;
    writeEvents(personaId, events);
    return updated;
  }

  static removeEvent(personaId: string | null | undefined, id: string): boolean {
    const events = readEvents(personaId);
    const next = events.filter((e) => e.id !== id);
    if (next.length === events.length) return false;
    writeEvents(personaId, next);
    return true;
  }

  /** Mark a specific reminder as fired (idempotent). */
  static markReminderFired(
    personaId: string | null | undefined,
    eventId: string,
    minutesBefore: number
  ): void {
    const events = readEvents(personaId);
    const event = events.find((e) => e.id === eventId);
    if (!event) return;
    let changed = false;
    event.reminders = event.reminders.map((r) => {
      if (r.minutesBefore === minutesBefore && !r.fired) {
        changed = true;
        return { ...r, fired: true, firedAt: new Date().toISOString() };
      }
      return r;
    });
    if (changed) writeEvents(personaId, events);
  }

  /**
   * Convert an AI proposal into a stored event (after user confirmation).
   */
  static confirmProposal(
    personaId: string | null | undefined,
    proposal: CalendarEventProposal
  ): CalendarEvent {
    const reminders: ReminderRule[] = (proposal.reminders ?? DEFAULT_REMINDERS[proposal.category])
      .map((r) => ({
        minutesBefore: r.minutesBefore,
        channels: ('channels' in r && r.channels?.length
          ? r.channels
          : DEFAULT_REMINDERS[proposal.category][0]?.channels) ?? ['chat'],
        fired: false,
      }));
    return CalendarService.addEvent(personaId, {
      start: proposal.start,
      end: proposal.end,
      title: proposal.title,
      category: proposal.category,
      location: proposal.location,
      notes: proposal.notes,
      provider: proposal.provider,
      participants: proposal.participants,
      reminders,
      aiProposed: true,
      source: 'concierge',
    });
  }

  /** Returns events occurring between two ISO datetimes, inclusive. */
  static range(
    personaId: string | null | undefined,
    fromIso: string,
    toIso: string
  ): CalendarEvent[] {
    return CalendarService.getEvents(personaId)
      .filter((e) => e.start >= fromIso && e.start <= toIso)
      .sort((a, b) => a.start.localeCompare(b.start));
  }

  /** Next N upcoming events from now. */
  static upcoming(personaId: string | null | undefined, limit = 10): CalendarEvent[] {
    const now = new Date().toISOString();
    return CalendarService.getEvents(personaId)
      .filter((e) => e.start >= now)
      .sort((a, b) => a.start.localeCompare(b.start))
      .slice(0, limit);
  }

  /** Build a compact textual brief for the concierge AI to ground its replies. */
  static briefForAI(personaId: string | null | undefined, limit = 8): string {
    const next = CalendarService.upcoming(personaId, limit);
    if (next.length === 0) return 'Calendar: no upcoming events on file.';
    const lines = next.map((e) => {
      const d = new Date(e.start);
      const when = `${d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
      const loc = e.location ? ` @ ${e.location}` : '';
      return `• ${when} — ${e.title}${loc} [${e.category}]`;
    });
    return `Calendar — next ${next.length} events:\n${lines.join('\n')}`;
  }

  static subscribe(handler: () => void): () => void {
    if (typeof window === 'undefined') return () => undefined;
    const wrapped = () => handler();
    window.addEventListener(DISPATCH_EVENT, wrapped);
    window.addEventListener('storage', wrapped);
    return () => {
      window.removeEventListener(DISPATCH_EVENT, wrapped);
      window.removeEventListener('storage', wrapped);
    };
  }
}

export const CALENDAR_DISPATCH_EVENT = DISPATCH_EVENT;
