import { describe, it, expect } from 'vitest';
import { isReminderDue, formatReminderMessage } from '@/services/CalendarReminderEngine';
import { CalendarEvent, ReminderChannel } from '@/types/calendarEvent';

const chatOnly: ReminderChannel[] = ['chat'];
const toastOnly: ReminderChannel[] = ['toast'];

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
    const evt = eventAt(10);
    expect(isReminderDue(evt, { minutesBefore: 15, channels: chatOnly })).toBe(true);
  });

  it('does not fire if rule already fired', () => {
    const evt = eventAt(10);
    expect(isReminderDue(evt, { minutesBefore: 15, channels: chatOnly, fired: true })).toBe(false);
  });

  it('does not fire if reminder time is in the future', () => {
    const evt = eventAt(120);
    expect(isReminderDue(evt, { minutesBefore: 30, channels: chatOnly })).toBe(false);
  });

  it('does not fire if event ended >1h ago', () => {
    const evt = eventAt(-90);
    expect(isReminderDue(evt, { minutesBefore: 15, channels: chatOnly })).toBe(false);
  });
});

describe('formatReminderMessage', () => {
  it('says "now" when event is imminent', () => {
    const evt = eventAt(0);
    const msg = formatReminderMessage(evt, { minutesBefore: 0, channels: toastOnly });
    expect(msg.toLowerCase()).toContain('now');
  });

  it('formats minutes-away events in minutes', () => {
    const evt = eventAt(20);
    const msg = formatReminderMessage(evt, { minutesBefore: 30, channels: chatOnly });
    expect(msg).toMatch(/in \d+ min/);
  });

  it('includes the event title and location', () => {
    const evt = { ...eventAt(15), title: 'Doctor', location: 'Mayo Clinic' };
    const msg = formatReminderMessage(evt, { minutesBefore: 30, channels: chatOnly });
    expect(msg).toContain('Doctor');
    expect(msg).toContain('Mayo Clinic');
  });
});
