import type { BookingType, DemoBookingResult } from '@/services/TravelCommerceService';

const STORAGE_KEY = 'supernomad_demo_bookings_v1';
export const DEMO_BOOKINGS_CHANGED_EVENT = 'supernomad:demo-bookings-changed';

export interface StoredDemoBooking {
  id: string;
  bookingType: BookingType;
  completedAt: string;
  result: DemoBookingResult;
}

const isStoredDemoBooking = (value: unknown): value is StoredDemoBooking => {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<StoredDemoBooking>;
  return Boolean(
    typeof record.id === 'string' &&
    (record.bookingType === 'flight' || record.bookingType === 'hotel') &&
    typeof record.completedAt === 'string' &&
    record.result?.simulated === true &&
    record.result?.charged === false &&
    record.result?.ticketIssued === false &&
    record.result?.roomReserved === false &&
    record.result?.order?.publicOrderId
  );
};

export const DemoBookingStore = {
  read(): StoredDemoBooking[] {
    if (typeof window === 'undefined') return [];
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isStoredDemoBooking).sort((a, b) =>
        new Date(a.result.order.itinerary.departureLocal).getTime() - new Date(b.result.order.itinerary.departureLocal).getTime()
      );
    } catch {
      return [];
    }
  },

  save(bookingType: BookingType, result: DemoBookingResult): StoredDemoBooking {
    const record: StoredDemoBooking = {
      id: result.order.publicOrderId,
      bookingType,
      completedAt: new Date().toISOString(),
      result,
    };
    const records = this.read().filter((booking) => booking.id !== record.id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...records, record]));
    window.dispatchEvent(new CustomEvent(DEMO_BOOKINGS_CHANGED_EVENT));
    return record;
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(DEMO_BOOKINGS_CHANGED_EVENT));
  },
};
