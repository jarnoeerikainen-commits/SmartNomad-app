// Demo upcoming trips for John & Meghan personas.
// Dates are stored as offsets from "today" so the demo always shows
// future-dated trips no matter when the app is opened.

export type TripPurpose = 'business' | 'sports' | 'pleasure' | 'family' | 'combo';

export type ClearanceStatus = 'clear' | 'action' | 'warn' | 'na';

export interface UpcomingTripClearance {
  visa: ClearanceStatus;
  visaNote: string;
  vaccinations: ClearanceStatus;
  vaccinationsNote: string;
  threats: ClearanceStatus;
  threatsNote: string;
}

export interface UpcomingTrip {
  id: string;
  destination: string;       // City
  country: string;           // Country name
  countryCode: string;       // ISO-2
  flag: string;
  purpose: TripPurpose;
  purposeLabel: string;      // Free-form (e.g. "Board meeting", "Ski week")
  startInDays: number;       // Offset from today
  durationDays: number;
  clearance: UpcomingTripClearance;
}

// --- Persona seeds (offsets only; resolved at render time) ---
const MEGHAN_SEED: UpcomingTrip[] = [
  {
    id: 'meghan-zrh',
    destination: 'Zürich', country: 'Switzerland', countryCode: 'CH', flag: '🇨🇭',
    purpose: 'business', purposeLabel: 'Client pitch',
    startInDays: 6, durationDays: 3,
    clearance: {
      visa: 'clear', visaNote: 'Schengen 90/180 — UK passport visa-free',
      vaccinations: 'clear', vaccinationsNote: 'No requirements',
      threats: 'clear', threatsNote: 'Low risk — no active advisories',
    },
  },
  {
    id: 'meghan-cha',
    destination: 'Chamonix', country: 'France', countryCode: 'FR', flag: '🇫🇷',
    purpose: 'sports', purposeLabel: 'Ski long weekend',
    startInDays: 19, durationDays: 4,
    clearance: {
      visa: 'clear', visaNote: 'Schengen 90/180 — UK passport visa-free',
      vaccinations: 'clear', vaccinationsNote: 'No requirements',
      threats: 'warn', threatsNote: 'Avalanche advisories in alpine zones',
    },
  },
  {
    id: 'meghan-dxb',
    destination: 'Dubai', country: 'UAE', countryCode: 'AE', flag: '🇦🇪',
    purpose: 'combo', purposeLabel: 'Summit + family time',
    startInDays: 34, durationDays: 6,
    clearance: {
      visa: 'clear', visaNote: 'UAE visa-on-arrival 90d (UK)',
      vaccinations: 'clear', vaccinationsNote: 'Routine immunisations current',
      threats: 'clear', threatsNote: 'Low risk — standard urban precautions',
    },
  },
  {
    id: 'meghan-cor',
    destination: 'Corfu', country: 'Greece', countryCode: 'GR', flag: '🇬🇷',
    purpose: 'family', purposeLabel: 'Family villa week',
    startInDays: 58, durationDays: 7,
    clearance: {
      visa: 'clear', visaNote: 'Schengen 90/180 — UK passport visa-free',
      vaccinations: 'clear', vaccinationsNote: 'No requirements',
      threats: 'clear', threatsNote: 'Low risk',
    },
  },
  {
    id: 'meghan-nyc',
    destination: 'New York', country: 'United States', countryCode: 'US', flag: '🇺🇸',
    purpose: 'pleasure', purposeLabel: 'Broadway + galleries',
    startInDays: 81, durationDays: 5,
    clearance: {
      visa: 'action', visaNote: 'ESTA renewal due — apply 72h before travel',
      vaccinations: 'clear', vaccinationsNote: 'No requirements',
      threats: 'clear', threatsNote: 'Low risk',
    },
  },
];

const JOHN_SEED: UpcomingTrip[] = [
  {
    id: 'john-sfo',
    destination: 'San Francisco', country: 'United States', countryCode: 'US', flag: '🇺🇸',
    purpose: 'business', purposeLabel: 'Board offsite',
    startInDays: 4, durationDays: 5,
    clearance: {
      visa: 'na', visaNote: 'US citizen — domestic re-entry',
      vaccinations: 'clear', vaccinationsNote: 'Routine immunisations current',
      threats: 'clear', threatsNote: 'Low risk',
    },
  },
  {
    id: 'john-tok',
    destination: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '🇯🇵',
    purpose: 'combo', purposeLabel: 'Investor week + family',
    startInDays: 14, durationDays: 7,
    clearance: {
      visa: 'clear', visaNote: 'Visa-free 90d (US passport)',
      vaccinations: 'clear', vaccinationsNote: 'No special requirements',
      threats: 'clear', threatsNote: 'Low risk — standard urban precautions',
    },
  },
  {
    id: 'john-nis',
    destination: 'Niseko', country: 'Japan', countryCode: 'JP', flag: '🇯🇵',
    purpose: 'sports', purposeLabel: 'Family ski trip',
    startInDays: 22, durationDays: 6,
    clearance: {
      visa: 'clear', visaNote: 'Visa-free 90d (US passport)',
      vaccinations: 'clear', vaccinationsNote: 'Routine immunisations current',
      threats: 'warn', threatsNote: 'Backcountry avalanche advisories',
    },
  },
  {
    id: 'john-bal',
    destination: 'Bali', country: 'Indonesia', countryCode: 'ID', flag: '🇮🇩',
    purpose: 'family', purposeLabel: 'Family holiday',
    startInDays: 45, durationDays: 9,
    clearance: {
      visa: 'action', visaNote: 'Visa-on-arrival USD 35 — bring cash/QR',
      vaccinations: 'warn', vaccinationsNote: 'Hep A + Typhoid recommended (CDC)',
      threats: 'clear', threatsNote: 'Low risk in tourist zones',
    },
  },
  {
    id: 'john-cpt',
    destination: 'Cape Town', country: 'South Africa', countryCode: 'ZA', flag: '🇿🇦',
    purpose: 'pleasure', purposeLabel: 'Wine + safari',
    startInDays: 72, durationDays: 8,
    clearance: {
      visa: 'clear', visaNote: 'Visa-free 90d (US passport)',
      vaccinations: 'action', vaccinationsNote: 'Yellow Fever cert if transiting via endemic country',
      threats: 'warn', threatsNote: 'Elevated petty crime — concierge security advised',
    },
  },
];

/**
 * Returns the persona's upcoming trips with `startInDays` recomputed against today
 * (already absolute offsets — kept stable as the day rolls over so demo never shows past trips).
 */
export function getDemoUpcomingTrips(personaId: 'meghan' | 'john' | null): UpcomingTrip[] {
  if (personaId === 'meghan') return MEGHAN_SEED;
  if (personaId === 'john') return JOHN_SEED;
  return [];
}
