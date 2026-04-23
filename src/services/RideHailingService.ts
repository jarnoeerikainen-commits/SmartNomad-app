/**
 * RideHailingService
 * ──────────────────
 * Backend-ready ride-hailing layer for the SuperNomad Concierge.
 *
 * Aggregator choice: **KARHOO** (https://developer.karhoo.com)
 *  - True global B2B aggregator: single API → Uber, Gett, FREE NOW,
 *    Curb, Addison Lee, 1,000+ local taxi fleets across 100+ countries.
 *  - Supports immediate AND scheduled rides, fixed-price quotes,
 *    in-trip tracking, white-label and corporate billing.
 *  - Picked over Splyt because Splyt is largely closed (Grab / Trip.com
 *    enterprise channels) with no public sandbox.
 *
 * Demo mode (default): returns realistic mock quotes instantly.
 * Production mode: set `KARHOO_API_KEY` in Supabase secrets and the
 * `karhoo-rides` edge function automatically takes over.
 */

import { supabase } from '@/integrations/supabase/client';

// ─── Karhoo-shaped types (match real API field names) ─────────────
export type RideClass = 'standard' | 'comfort' | 'xl' | 'premium' | 'eco' | 'taxi';

export interface RideQuote {
  quoteId: string;
  supplier: string;          // "Uber", "Bolt", "Gett", "Local Taxi Co."
  vehicleClass: RideClass;
  vehicleName: string;       // "UberX", "Bolt Comfort", "Black Cab"
  etaMinutes: number;        // pickup ETA
  durationMinutes: number;   // ride duration
  priceLow: number;
  priceHigh: number;
  currency: string;
  capacityPax: number;
  capacityBags: number;
  cancellationFreeMinutes: number;
  fixedPrice: boolean;
  ecoFriendly: boolean;
  rating: number;            // 0-5
  // Deep-link fallback if user prefers to open the app directly
  deepLink?: string;
  webLink?: string;
}

export interface RideQuoteRequest {
  pickup: { lat?: number; lng?: number; address: string; city?: string };
  dropoff: { lat?: number; lng?: number; address: string };
  whenISO?: string;          // omit = ASAP
  pax?: number;
}

export interface RideBookingRequest {
  quoteId: string;
  pickup: { address: string; lat?: number; lng?: number };
  dropoff: { address: string; lat?: number; lng?: number };
  whenISO?: string;
  passenger: { name: string; phone?: string };
  paymentMethodId?: string;  // wired to SuperNomad Wallet later
}

export interface RideBooking {
  bookingId: string;
  status: 'confirmed' | 'driver-assigned' | 'arriving' | 'in-trip' | 'completed' | 'cancelled';
  supplier: string;
  vehicleName: string;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  vehiclePlate?: string;
  vehicleColor?: string;
  etaMinutes: number;
  trackingUrl?: string;
  pricePaid?: number;
  currency: string;
}

// ─── Demo data: realistic city-aware mock quotes ──────────────────
const CITY_PRICE_INDEX: Record<string, { mult: number; cur: string; localTaxi: string }> = {
  'London': { mult: 1.4, cur: 'GBP', localTaxi: 'Black Cab' },
  'Paris': { mult: 1.2, cur: 'EUR', localTaxi: 'G7 Taxi' },
  'Berlin': { mult: 1.0, cur: 'EUR', localTaxi: 'FREE NOW Taxi' },
  'Madrid': { mult: 0.85, cur: 'EUR', localTaxi: 'Cabify' },
  'Lisbon': { mult: 0.75, cur: 'EUR', localTaxi: 'Bolt' },
  'Helsinki': { mult: 1.3, cur: 'EUR', localTaxi: 'Taksi Helsinki' },
  'Tallinn': { mult: 0.6, cur: 'EUR', localTaxi: 'Bolt' },
  'New York': { mult: 1.5, cur: 'USD', localTaxi: 'Yellow Cab (Curb)' },
  'San Francisco': { mult: 1.6, cur: 'USD', localTaxi: 'Flywheel Taxi' },
  'Dubai': { mult: 1.1, cur: 'AED', localTaxi: 'Dubai Taxi (Careem)' },
  'Singapore': { mult: 1.0, cur: 'SGD', localTaxi: 'ComfortDelGro' },
  'Bangkok': { mult: 0.4, cur: 'THB', localTaxi: 'Grab Taxi' },
  'Tokyo': { mult: 1.4, cur: 'JPY', localTaxi: 'GO / Nihon Kotsu' },
  'Mexico City': { mult: 0.5, cur: 'MXN', localTaxi: 'Didi Taxi' },
  'São Paulo': { mult: 0.5, cur: 'BRL', localTaxi: '99 Taxi' },
};

const DEEP_LINKS = {
  uber: (pickup: string, dropoff: string) =>
    `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(pickup)}&dropoff[formatted_address]=${encodeURIComponent(dropoff)}`,
  bolt: () => `https://bolt.eu/`,
  lyft: () => `https://www.lyft.com/ride`,
  grab: () => `https://www.grab.com/`,
};

function generateDemoQuotes(req: RideQuoteRequest): RideQuote[] {
  const city = req.pickup.city || 'Paris';
  const cfg = CITY_PRICE_INDEX[city] || { mult: 1.0, cur: 'EUR', localTaxi: 'Local Taxi' };
  const base = 12 * cfg.mult; // base ride
  const pickup = req.pickup.address;
  const dropoff = req.dropoff.address;

  const round = (n: number) => Math.round(n * 100) / 100;
  const stamp = Date.now();

  return [
    {
      quoteId: `q_${stamp}_1`,
      supplier: 'Uber',
      vehicleClass: 'standard',
      vehicleName: 'UberX',
      etaMinutes: 4,
      durationMinutes: 18,
      priceLow: round(base * 0.9),
      priceHigh: round(base * 1.2),
      currency: cfg.cur,
      capacityPax: 4, capacityBags: 2,
      cancellationFreeMinutes: 5,
      fixedPrice: false, ecoFriendly: false,
      rating: 4.6,
      deepLink: DEEP_LINKS.uber(pickup, dropoff),
      webLink: 'https://m.uber.com',
    },
    {
      quoteId: `q_${stamp}_2`,
      supplier: 'Bolt',
      vehicleClass: 'standard',
      vehicleName: 'Bolt',
      etaMinutes: 3,
      durationMinutes: 19,
      priceLow: round(base * 0.75),
      priceHigh: round(base * 1.0),
      currency: cfg.cur,
      capacityPax: 4, capacityBags: 2,
      cancellationFreeMinutes: 3,
      fixedPrice: false, ecoFriendly: false,
      rating: 4.5,
      deepLink: DEEP_LINKS.bolt(),
      webLink: 'https://bolt.eu/',
    },
    {
      quoteId: `q_${stamp}_3`,
      supplier: cfg.localTaxi,
      vehicleClass: 'taxi',
      vehicleName: cfg.localTaxi,
      etaMinutes: 6,
      durationMinutes: 20,
      priceLow: round(base * 1.0),
      priceHigh: round(base * 1.3),
      currency: cfg.cur,
      capacityPax: 4, capacityBags: 3,
      cancellationFreeMinutes: 10,
      fixedPrice: true, ecoFriendly: false,
      rating: 4.7,
    },
    {
      quoteId: `q_${stamp}_4`,
      supplier: 'Uber',
      vehicleClass: 'eco',
      vehicleName: 'UberGreen (EV)',
      etaMinutes: 6,
      durationMinutes: 18,
      priceLow: round(base * 1.0),
      priceHigh: round(base * 1.3),
      currency: cfg.cur,
      capacityPax: 4, capacityBags: 2,
      cancellationFreeMinutes: 5,
      fixedPrice: false, ecoFriendly: true,
      rating: 4.8,
      deepLink: DEEP_LINKS.uber(pickup, dropoff),
    },
    {
      quoteId: `q_${stamp}_5`,
      supplier: 'Blacklane',
      vehicleClass: 'premium',
      vehicleName: 'Business Class (Mercedes E)',
      etaMinutes: 12,
      durationMinutes: 18,
      priceLow: round(base * 3.0),
      priceHigh: round(base * 3.8),
      currency: cfg.cur,
      capacityPax: 3, capacityBags: 3,
      cancellationFreeMinutes: 60,
      fixedPrice: true, ecoFriendly: false,
      rating: 4.9,
      webLink: 'https://www.blacklane.com',
    },
  ];
}

// ─── Public API ───────────────────────────────────────────────────
export class RideHailingService {
  /** Try the karhoo-rides edge function; fall back to local demo data. */
  static async getQuotes(req: RideQuoteRequest): Promise<RideQuote[]> {
    try {
      const { data, error } = await supabase.functions.invoke('karhoo-rides', {
        body: { action: 'quotes', request: req },
      });
      if (error) throw error;
      if (data?.demo) {
        // Edge function explicitly told us it has no key — use local demo
        return generateDemoQuotes(req);
      }
      if (data?.quotes && Array.isArray(data.quotes) && data.quotes.length) {
        return data.quotes as RideQuote[];
      }
    } catch (e) {
      console.warn('[RideHailing] Edge function unavailable, using local demo:', e);
    }
    return generateDemoQuotes(req);
  }

  /** Confirm a booking. In demo mode this returns a simulated confirmation. */
  static async book(req: RideBookingRequest): Promise<RideBooking> {
    try {
      const { data, error } = await supabase.functions.invoke('karhoo-rides', {
        body: { action: 'book', request: req },
      });
      if (error) throw error;
      if (data?.booking && !data.demo) {
        return data.booking as RideBooking;
      }
    } catch (e) {
      console.warn('[RideHailing] Edge function unavailable, simulating booking:', e);
    }

    // Demo confirmation
    const driverNames = ['Marco', 'Sergei', 'Lina', 'Aiko', 'David', 'Priya'];
    const colors = ['Black', 'Silver', 'White', 'Dark Blue'];
    return {
      bookingId: `bk_${Date.now()}`,
      status: 'driver-assigned',
      supplier: 'Demo Supplier',
      vehicleName: 'Demo Vehicle',
      driverName: driverNames[Math.floor(Math.random() * driverNames.length)],
      driverPhone: '+33 6 12 34 56 78',
      driverRating: 4.8,
      vehiclePlate: 'AB-' + Math.floor(100 + Math.random() * 900) + '-CD',
      vehicleColor: colors[Math.floor(Math.random() * colors.length)],
      etaMinutes: 4,
      trackingUrl: undefined,
      currency: 'EUR',
    };
  }

  /** Heuristic intent detector for "book me a taxi" style messages. */
  static detectRideIntent(text: string): { isRide: boolean; whenHint?: string; dropoffHint?: string } {
    const lc = text.toLowerCase();
    const rideWords = /\b(taxi|cab|uber|bolt|lyft|grab|ride|car service|rideshare|pickup|pick me up)\b/;
    const verbWords = /\b(book|get|order|call|need|want|find|schedule|reserve)\b/;
    if (!rideWords.test(lc)) return { isRide: false };
    if (!verbWords.test(lc) && !/\b(to|airport|hotel|home)\b/.test(lc)) return { isRide: false };

    let whenHint: string | undefined;
    if (/\b(now|asap|immediately|right now)\b/.test(lc)) whenHint = 'now';
    else if (/\b(in (\d+) min)/.test(lc)) whenHint = lc.match(/in \d+ min/)?.[0];
    else if (/\b(at \d{1,2}(:\d{2})?\s?(am|pm)?)\b/.test(lc)) whenHint = lc.match(/at \d{1,2}(:\d{2})?\s?(am|pm)?/)?.[0];
    else if (/\b(tomorrow|tonight|this evening|this afternoon)\b/.test(lc)) {
      whenHint = lc.match(/tomorrow|tonight|this evening|this afternoon/)?.[0];
    }

    const toMatch = text.match(/\bto\s+([A-Z][\w\s,'-]{2,60}?)(?:\.|,|$|\s+(?:at|in|now|tomorrow))/i);
    const dropoffHint = toMatch?.[1]?.trim();

    return { isRide: true, whenHint, dropoffHint };
  }
}
