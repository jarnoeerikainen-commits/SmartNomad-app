import type { RideBooking, RideQuote } from '@/services/RideHailingService';

const STORAGE_KEY = 'supernomad_demo_rides_v1';
export const DEMO_RIDES_CHANGED_EVENT = 'supernomad:demo-rides-changed';

export interface StoredDemoRide {
  id: string;
  tripBookingId?: string;
  completedAt: string;
  pickup: string;
  dropoff: string;
  whenISO?: string;
  quote: RideQuote;
  booking: RideBooking;
}

const isStoredDemoRide = (value: unknown): value is StoredDemoRide => {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<StoredDemoRide>;
  return Boolean(record.id && record.booking?.simulated === true && record.quote?.currency === 'USD');
};

export const DemoRideStore = {
  read(): StoredDemoRide[] {
    if (typeof window === 'undefined') return [];
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(isStoredDemoRide) : [];
    } catch {
      return [];
    }
  },

  save(record: Omit<StoredDemoRide, 'id' | 'completedAt'>): StoredDemoRide {
    const stored: StoredDemoRide = { ...record, id: record.booking.bookingId, completedAt: new Date().toISOString() };
    const records = this.read().filter((item) => item.id !== stored.id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...records, stored]));
    window.dispatchEvent(new CustomEvent(DEMO_RIDES_CHANGED_EVENT));
    return stored;
  },
};