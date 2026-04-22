/**
 * CalendarReminderEngine — background scheduler that watches all stored
 * calendar events and fires reminders at the right moments through the
 * channels the user has approved (chat, voice, email, toast).
 *
 * Designed to be tab-resilient: ticks once per minute, scans for due
 * reminders, marks each fired exactly once. No duplicate fires across
 * tabs because the underlying CalendarService persists `fired` state and
 * dispatches storage events.
 */

import { CalendarEvent, ReminderChannel, ReminderRule } from '@/types/calendarEvent';
import { CalendarService } from './CalendarService';
import { supabase } from '@/integrations/supabase/client';

const PREFS_KEY = 'supernomad_calendar_prefs_v1';
const TICK_INTERVAL_MS = 60_000;

export interface CalendarPreferences {
  enabledChannels: ReminderChannel[];
  /** Email used for email reminders. */
  email?: string;
  /** Mute reminders entirely. */
  muted?: boolean;
  /** Allow concierge AI to write events directly (false = always ask). */
  aiAutoWrite?: boolean;
}

const DEFAULT_PREFS: CalendarPreferences = {
  enabledChannels: ['chat', 'voice', 'email', 'toast'],
  aiAutoWrite: false,
};

export function getCalendarPrefs(): CalendarPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function setCalendarPrefs(patch: Partial<CalendarPreferences>): CalendarPreferences {
  const next = { ...getCalendarPrefs(), ...patch };
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('supernomad:calendar-prefs'));
  }
  return next;
}

/** Determine if a reminder should fire right now (within the tick window). */
export function isReminderDue(
  event: CalendarEvent,
  rule: ReminderRule,
  now: Date = new Date()
): boolean {
  if (rule.fired) return false;
  const start = new Date(event.start).getTime();
  const fireAt = start - rule.minutesBefore * 60_000;
  const nowMs = now.getTime();
  // Fire when we've passed the reminder time but the event itself hasn't ended yet
  // and we're within a 24h window (so we don't blast historical reminders on first load).
  if (nowMs < fireAt) return false;
  if (nowMs - fireAt > 24 * 60 * 60_000) return false;
  if (nowMs > start + 60 * 60_000) return false; // event already started > 1h ago
  return true;
}

export function formatReminderMessage(event: CalendarEvent, rule: ReminderRule): string {
  const start = new Date(event.start);
  const minutes = Math.max(0, Math.round((start.getTime() - Date.now()) / 60_000));
  const when =
    minutes <= 1
      ? 'now'
      : minutes < 60
        ? `in ${minutes} min`
        : minutes < 60 * 24
          ? `in ${Math.round(minutes / 60)} h`
          : `on ${start.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}`;
  const loc = event.location ? ` at ${event.location}` : '';
  const time = start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `Reminder: **${event.title}** ${when} (${time})${loc}.`;
}

interface FireContext {
  personaId: string | null;
  prefs: CalendarPreferences;
}

async function fireReminder(
  event: CalendarEvent,
  rule: ReminderRule,
  ctx: FireContext
): Promise<void> {
  const allowed = rule.channels.filter((c) => ctx.prefs.enabledChannels.includes(c));
  if (allowed.length === 0 || ctx.prefs.muted) return;

  const message = formatReminderMessage(event, rule);

  // 1) Concierge chat — dispatch a window event the chat listens for
  if (allowed.includes('chat') && typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('supernomad:concierge-push', {
        detail: { message, eventId: event.id, kind: 'reminder' },
      })
    );
  }

  // 2) Voice — let the concierge speak it (only if voice is currently enabled)
  if (allowed.includes('voice') && typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('supernomad:concierge-speak', {
        detail: { text: message.replace(/\*\*/g, '') },
      })
    );
  }

  // 3) Toast / browser notification
  if (allowed.includes('toast') && typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('supernomad:toast', {
        detail: {
          title: event.title,
          description: message.replace(/\*\*/g, ''),
        },
      })
    );
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(event.title, { body: message.replace(/\*\*/g, '') });
      } catch {
        /* ignore */
      }
    }
  }

  // 4) Email — only for events >= 1h away to avoid spam
  if (allowed.includes('email') && ctx.prefs.email && rule.minutesBefore >= 60) {
    try {
      await supabase.functions.invoke('send-calendar-reminder', {
        body: {
          to: ctx.prefs.email,
          eventTitle: event.title,
          startIso: event.start,
          location: event.location,
          notes: event.notes,
          minutesBefore: rule.minutesBefore,
        },
      });
    } catch (err) {
      console.warn('CalendarReminderEngine: email send failed', err);
    }
  }

  CalendarService.markReminderFired(ctx.personaId, event.id, rule.minutesBefore);
}

let tickHandle: ReturnType<typeof setInterval> | null = null;
let currentPersonaId: string | null = null;

export function startReminderEngine(personaId: string | null): void {
  currentPersonaId = personaId;
  if (tickHandle) return;
  if (typeof window === 'undefined') return;

  const tick = async () => {
    try {
      const prefs = getCalendarPrefs();
      if (prefs.muted) return;
      const events = CalendarService.getEvents(currentPersonaId);
      const now = new Date();
      for (const event of events) {
        for (const rule of event.reminders) {
          if (isReminderDue(event, rule, now)) {
            await fireReminder(event, rule, { personaId: currentPersonaId, prefs });
          }
        }
      }
    } catch (err) {
      console.warn('CalendarReminderEngine tick failed', err);
    }
  };

  // First scan after 5s, then every minute
  setTimeout(tick, 5_000);
  tickHandle = setInterval(tick, TICK_INTERVAL_MS);
}

export function stopReminderEngine(): void {
  if (tickHandle) {
    clearInterval(tickHandle);
    tickHandle = null;
  }
}

export function setReminderEnginePersona(personaId: string | null): void {
  currentPersonaId = personaId;
}
