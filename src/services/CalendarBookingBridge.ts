/**
 * CalendarBookingBridge — small helper that any internal booking flow
 * (flight, hotel, restaurant, sport, appointment) can call to add a
 * confirmed booking to the unified calendar.
 *
 * Per the user's "Read-only by default, ask before every write" decision,
 * this helper does NOT silently write. It expects the caller to have
 * already collected the user's explicit confirmation (e.g. a "Confirm
 * booking" tap). For AI-proposed events use CalendarService.confirmProposal
 * via the in-chat CalendarProposalCards instead.
 */

import { CalendarService } from './CalendarService';
import {
  CalendarEvent,
  CalendarEventCategory,
  CalendarEventSource,
  DEFAULT_REMINDERS,
} from '@/types/calendarEvent';

export interface BookingToCalendarInput {
  /** Persona scope; null/undefined = signed-in user. */
  personaId: string | null | undefined;
  category: CalendarEventCategory;
  source: CalendarEventSource;
  title: string;
  startIso: string;
  endIso?: string;
  location?: string;
  notes?: string;
  provider?: string;
  externalRef?: string;
  participants?: string[];
}

/** Deterministic helper — returns the resulting event. */
export function addBookingToCalendar(input: BookingToCalendarInput): CalendarEvent {
  return CalendarService.addEvent(input.personaId, {
    start: input.startIso,
    end: input.endIso,
    title: input.title,
    category: input.category,
    location: input.location,
    notes: input.notes,
    provider: input.provider,
    externalRef: input.externalRef,
    participants: input.participants,
    source: input.source,
    reminders: DEFAULT_REMINDERS[input.category].map((r) => ({ ...r, fired: false })),
  });
}

/** Convenience wrappers per booking type. */
export const FlightBooking = {
  addToCalendar(personaId: string | null | undefined, opts: {
    flightNumber?: string;
    airline?: string;
    fromCity: string;
    toCity: string;
    departureIso: string;
    arrivalIso?: string;
    bookingRef?: string;
    seat?: string;
  }): CalendarEvent {
    const title = `${opts.airline ? opts.airline + ' ' : ''}${opts.flightNumber ?? ''} • ${opts.fromCity} → ${opts.toCity}`.trim();
    return addBookingToCalendar({
      personaId,
      category: 'travel',
      source: 'flight-booking',
      title,
      startIso: opts.departureIso,
      endIso: opts.arrivalIso,
      location: `${opts.fromCity} departure`,
      notes: opts.seat ? `Seat ${opts.seat}` : undefined,
      provider: opts.airline,
      externalRef: opts.bookingRef,
    });
  },
};

export const HotelBooking = {
  addToCalendar(personaId: string | null | undefined, opts: {
    hotelName: string;
    city: string;
    checkInIso: string;
    checkOutIso?: string;
    bookingRef?: string;
  }): CalendarEvent {
    return addBookingToCalendar({
      personaId,
      category: 'accommodation',
      source: 'hotel-booking',
      title: `Check-in: ${opts.hotelName}`,
      startIso: opts.checkInIso,
      endIso: opts.checkOutIso,
      location: `${opts.hotelName}, ${opts.city}`,
      provider: opts.hotelName,
      externalRef: opts.bookingRef,
    });
  },
};

export const RestaurantBooking = {
  addToCalendar(personaId: string | null | undefined, opts: {
    restaurantName: string;
    city: string;
    timeIso: string;
    partySize?: number;
    bookingRef?: string;
  }): CalendarEvent {
    return addBookingToCalendar({
      personaId,
      category: 'meal',
      source: 'restaurant-booking',
      title: `${opts.restaurantName}${opts.partySize ? ` (${opts.partySize})` : ''}`,
      startIso: opts.timeIso,
      location: `${opts.restaurantName}, ${opts.city}`,
      provider: opts.restaurantName,
      externalRef: opts.bookingRef,
    });
  },
};

export const SportBooking = {
  addToCalendar(personaId: string | null | undefined, opts: {
    activity: string;
    venue?: string;
    timeIso: string;
    durationMin?: number;
    bookingRef?: string;
  }): CalendarEvent {
    const end = opts.durationMin
      ? new Date(new Date(opts.timeIso).getTime() + opts.durationMin * 60_000).toISOString()
      : undefined;
    return addBookingToCalendar({
      personaId,
      category: 'sport',
      source: 'sport-booking',
      title: opts.activity,
      startIso: opts.timeIso,
      endIso: end,
      location: opts.venue,
      provider: opts.venue,
      externalRef: opts.bookingRef,
    });
  },
};

export const AppointmentBooking = {
  addToCalendar(personaId: string | null | undefined, opts: {
    title: string;
    category?: CalendarEventCategory;
    timeIso: string;
    durationMin?: number;
    location?: string;
    notes?: string;
    bookingRef?: string;
  }): CalendarEvent {
    const end = opts.durationMin
      ? new Date(new Date(opts.timeIso).getTime() + opts.durationMin * 60_000).toISOString()
      : undefined;
    return addBookingToCalendar({
      personaId,
      category: opts.category ?? 'wellness',
      source: 'appointment',
      title: opts.title,
      startIso: opts.timeIso,
      endIso: end,
      location: opts.location,
      notes: opts.notes,
      externalRef: opts.bookingRef,
    });
  },
};
