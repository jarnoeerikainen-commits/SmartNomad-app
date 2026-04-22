import { useEffect, useState, useCallback } from 'react';
import { CalendarService, CALENDAR_DISPATCH_EVENT } from '@/services/CalendarService';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { CalendarEvent, CalendarEventCategory, CalendarEventProposal } from '@/types/calendarEvent';

export function useCalendar() {
  const { activePersonaId } = useDemoPersona();
  const personaId = activePersonaId ?? null;
  const [events, setEvents] = useState<CalendarEvent[]>(() => CalendarService.getEvents(personaId));

  useEffect(() => {
    setEvents(CalendarService.getEvents(personaId));
    const reload = () => setEvents(CalendarService.getEvents(personaId));
    const off = CalendarService.subscribe(reload);
    window.addEventListener(CALENDAR_DISPATCH_EVENT, reload);
    return () => {
      off();
      window.removeEventListener(CALENDAR_DISPATCH_EVENT, reload);
    };
  }, [personaId]);

  const addEvent = useCallback(
    (input: Parameters<typeof CalendarService.addEvent>[1]) =>
      CalendarService.addEvent(personaId, input),
    [personaId]
  );

  const removeEvent = useCallback(
    (id: string) => CalendarService.removeEvent(personaId, id),
    [personaId]
  );

  const confirmProposal = useCallback(
    (proposal: CalendarEventProposal) => CalendarService.confirmProposal(personaId, proposal),
    [personaId]
  );

  const upcoming = useCallback(
    (limit = 10) => CalendarService.upcoming(personaId, limit),
    [personaId, events]
  );

  const range = useCallback(
    (fromIso: string, toIso: string) => CalendarService.range(personaId, fromIso, toIso),
    [personaId, events]
  );

  return { events, addEvent, removeEvent, confirmProposal, upcoming, range, personaId };
}

export type { CalendarEvent, CalendarEventCategory, CalendarEventProposal };
