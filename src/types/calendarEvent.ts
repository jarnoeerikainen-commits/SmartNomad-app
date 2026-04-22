/**
 * Unified Calendar Event types — the spine of the SuperNomad ecosystem.
 *
 * Every booking, appointment, sport, meeting, family activity, flight, hotel
 * check-in, restaurant reservation, etc. funnels into this shape. The
 * Concierge, reminder engine, voice, email, and dashboards all read from
 * the same source of truth.
 */

export type CalendarEventCategory =
  | 'travel'        // flights, train, ferry, transit
  | 'accommodation' // hotel check-in / check-out
  | 'meeting'       // business / video / in-person
  | 'meal'          // restaurant reservations, dining
  | 'sport'         // workout, run, ride, match
  | 'wellness'      // spa, doctor, therapy, yoga
  | 'family'        // school, kids, parents, partner
  | 'personal'      // errands, admin, hobby
  | 'social'        // friends, parties, gala
  | 'birthday'      // anniversaries / birthdays
  | 'legal'         // visa, tax filing, embassy
  | 'reservation'   // generic external booking
  | 'reminder';     // ad-hoc

export type CalendarEventSource =
  | 'manual'
  | 'demo-persona'
  | 'concierge'
  | 'flight-booking'
  | 'hotel-booking'
  | 'restaurant-booking'
  | 'appointment'
  | 'sport-booking'
  | 'family'
  | 'integration';

export type ReminderChannel = 'chat' | 'voice' | 'email' | 'toast';

export interface ReminderRule {
  /** Minutes before event start when this reminder should fire. */
  minutesBefore: number;
  channels: ReminderChannel[];
  /** Has this specific reminder already been delivered? */
  fired?: boolean;
  firedAt?: string; // ISO
}

export interface CalendarEvent {
  id: string;
  /** Local-tz ISO datetime string (YYYY-MM-DDTHH:mm). */
  start: string;
  /** Local-tz ISO datetime string. Optional — defaults to start + 60min. */
  end?: string;
  title: string;
  category: CalendarEventCategory;
  location?: string;
  notes?: string;
  source: CalendarEventSource;
  /** Free-form ID linking back to the originating record (booking ref, etc.). */
  externalRef?: string;
  /** Provider name (airline, hotel chain, restaurant…) for display. */
  provider?: string;
  /** Person/people involved — partner, child name, business contact. */
  participants?: string[];
  /** Per-event reminder schedule. Empty = no reminders. */
  reminders: ReminderRule[];
  /** Was this event proposed by the AI and confirmed by the user? */
  aiProposed?: boolean;
  /** ISO string when the event record was created locally. */
  createdAt: string;
  /** Free-form metadata for source-specific extras. */
  metadata?: Record<string, unknown>;
}

/** Lightweight event proposal — what the AI emits in a chat block. */
export interface CalendarEventProposal {
  start: string;
  end?: string;
  title: string;
  category: CalendarEventCategory;
  location?: string;
  notes?: string;
  provider?: string;
  participants?: string[];
  reminders?: { minutesBefore: number; channels?: ReminderChannel[] }[];
}

/** Default reminder ladders by category. */
export const DEFAULT_REMINDERS: Record<CalendarEventCategory, ReminderRule[]> = {
  travel: [
    { minutesBefore: 24 * 60, channels: ['chat', 'email'] },
    { minutesBefore: 180, channels: ['chat', 'voice'] },
    { minutesBefore: 60, channels: ['chat', 'voice', 'toast'] },
  ],
  accommodation: [
    { minutesBefore: 24 * 60, channels: ['chat'] },
    { minutesBefore: 120, channels: ['chat'] },
  ],
  meeting: [
    { minutesBefore: 60, channels: ['chat'] },
    { minutesBefore: 10, channels: ['chat', 'toast'] },
  ],
  meal: [
    { minutesBefore: 90, channels: ['chat'] },
    { minutesBefore: 20, channels: ['chat', 'toast'] },
  ],
  sport: [
    { minutesBefore: 60, channels: ['chat'] },
    { minutesBefore: 15, channels: ['chat', 'toast'] },
  ],
  wellness: [
    { minutesBefore: 60, channels: ['chat'] },
    { minutesBefore: 15, channels: ['chat', 'toast'] },
  ],
  family: [
    { minutesBefore: 30, channels: ['chat', 'toast'] },
  ],
  personal: [
    { minutesBefore: 15, channels: ['toast'] },
  ],
  social: [
    { minutesBefore: 60, channels: ['chat'] },
    { minutesBefore: 15, channels: ['chat', 'toast'] },
  ],
  birthday: [
    { minutesBefore: 24 * 60, channels: ['chat', 'email'] },
  ],
  legal: [
    { minutesBefore: 7 * 24 * 60, channels: ['chat', 'email'] },
    { minutesBefore: 24 * 60, channels: ['chat', 'email'] },
  ],
  reservation: [
    { minutesBefore: 90, channels: ['chat'] },
    { minutesBefore: 15, channels: ['chat', 'toast'] },
  ],
  reminder: [
    { minutesBefore: 0, channels: ['chat', 'toast'] },
  ],
};
