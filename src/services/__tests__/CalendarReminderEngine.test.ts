import { describe, it, expect } from 'vitest';
import { isReminderDue, formatReminderMessage } from '@/services/CalendarReminderEngine';
import { CalendarEvent } from '@/types/calendarEvent';

function eventAt(minutesFromNow: number): CalendarEvent {
  const start = new Date(Date.now() + minutesFromNow * 60_000).toISOString();
  return {
    id: 'evt_test',
    start,
    title: 'Test event',
    category: 'meeting',
    source: 'manual',
    reminders: [],
    createdAt: new Date().toISOString(),
  };
}

describe('isReminderDue', () => {
  it('fires when current time has passed the trigger but event has not started', () => {
    const evt = eventAt(10); // event in 10 min
    const rule = { minutesBefore: 15, channels: ['chat'] as const };
    expect(isReminderDue(evt, rule)).toBe(true);
  });

  it('does not fire if rule already fired', () => {
    const evt = eventAt(10);
    const rule = { minutesBefore: 15, channels: ['chat'] as const, fired: true };
    expect(isReminderDue(evt, rule)).toBe(false);
  });

  it('does not fire if reminder time is in the future', () => {
    const evt = eventAt(120); // event in 2h
    const rule = { minutesBefore: 30, channels: ['chat'] as const };
    expect(isReminderDue(evt, rule)).toBe(false);
  });

  it('does not fire if event ended >1h ago', () => {
    const evt = eventAt(-90); // event was 90 min ago
    const rule = { minutesBefore: 15, channels: ['chat'] as const };
    expect(isReminderDue(evt, rule)).toBe(false);
  });
});

describe('formatReminderMessage', () => {
  it('says "now" when event is imminent', () => {
    const evt = eventAt(0);
    const msg = formatReminderMessage(evt, { minutesBefore: 0, channels: ['toast'] });
    expect(msg.toLowerCase()).toContain('now');
  });

  it('formats minutes-away events in minutes', () => {
    const evt = eventAt(20);
    const msg = formatReminderMessage(evt, { minutesBefore: 30, channels: ['chat'] });
    expect(msg).toMatch(/in \d+ min/);
  });

  it('includes the event title and location', () => {
    const evt = { ...eventAt(15), title: 'Doctor', location: 'Mayo Clinic' };
    const msg = formatReminderMessage(evt, { minutesBefore: 30, channels: ['chat'] });
    expect(msg).toContain('Doctor');
    expect(msg).toContain('Mayo Clinic');
  });
});
