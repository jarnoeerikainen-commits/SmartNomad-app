// Country tracking + lifestyle wiring per demo persona.
// Used by DemoPersonaContext to seed `trackedCountries`, user mode and tier
// so every feature reflects the persona's real life when it is loaded.

import { Country } from '@/types/country';
import { UserMode } from '@/data/modePresets';

const today = () => new Date();
const ago = (days: number) => {
  const d = today();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};

const mk = (
  code: string,
  name: string,
  flag: string,
  opts: Partial<Country> & { lastEntry: string | null; daysSpent: number; yearlyDaysSpent: number; totalEntries: number },
): Country => ({
  id: `demo-${code.toLowerCase()}`,
  code,
  name,
  flag,
  dayLimit: opts.dayLimit ?? 90,
  daysSpent: opts.daysSpent,
  reason: opts.reason ?? 'Schengen / standard limit',
  lastUpdate: today().toISOString(),
  countTravelDays: true,
  yearlyDaysSpent: opts.yearlyDaysSpent,
  lastEntry: opts.lastEntry,
  totalEntries: opts.totalEntries,
  followEmbassyNews: true,
  countingMode: 'days',
  partialDayRule: 'full',
  countDepartureDay: true,
  countArrivalDay: true,
  dayPurpose: opts.dayPurpose ?? 'business',
  businessPercentage: opts.businessPercentage ?? 80,
});

// Meghan — London-based marketing director, currently on a Singapore client trip
const MEGHAN_COUNTRIES: Country[] = [
  mk('SG', 'Singapore', '🇸🇬', { lastEntry: ago(3), daysSpent: 3, yearlyDaysSpent: 18, totalEntries: 6, dayLimit: 90, dayPurpose: 'business', businessPercentage: 100, reason: 'Visa-free 90d (UK passport)' }),
  mk('GB', 'United Kingdom', '🇬🇧', { lastEntry: ago(20), daysSpent: 240, yearlyDaysSpent: 240, totalEntries: 1, dayLimit: 365, dayPurpose: 'personal', businessPercentage: 30, reason: 'Tax residency — home' }),
  mk('AE', 'United Arab Emirates', '🇦🇪', { lastEntry: ago(45), daysSpent: 8, yearlyDaysSpent: 14, totalEntries: 4, dayLimit: 90, reason: 'Visa-free 90d (UK)' }),
  mk('US', 'United States', '🇺🇸', { lastEntry: ago(72), daysSpent: 5, yearlyDaysSpent: 12, totalEntries: 3, dayLimit: 90, reason: 'ESTA — 90d max' }),
  mk('HK', 'Hong Kong', '🇭🇰', { lastEntry: ago(110), daysSpent: 4, yearlyDaysSpent: 8, totalEntries: 2, dayLimit: 180, reason: 'Visa-free 180d (UK)' }),
  mk('NO', 'Norway', '🇳🇴', { lastEntry: ago(140), daysSpent: 4, yearlyDaysSpent: 4, totalEntries: 1, dayLimit: 90, dayPurpose: 'business', businessPercentage: 100, reason: 'Schengen 90/180' }),
];

// John — Singapore-based VP Engineering with global trips and family ski plans
const JOHN_COUNTRIES: Country[] = [
  mk('SG', 'Singapore', '🇸🇬', { lastEntry: ago(7), daysSpent: 280, yearlyDaysSpent: 280, totalEntries: 1, dayLimit: 365, dayPurpose: 'mixed', businessPercentage: 60, reason: 'Tax residency (EP holder)' }),
  mk('US', 'United States', '🇺🇸', { lastEntry: ago(25), daysSpent: 18, yearlyDaysSpent: 22, totalEntries: 3, dayLimit: 120, dayPurpose: 'business', businessPercentage: 100, reason: 'US citizen — no limit, but tax-aware' }),
  mk('BR', 'Brazil', '🇧🇷', { lastEntry: ago(40), daysSpent: 4, yearlyDaysSpent: 4, totalEntries: 1, dayLimit: 90, reason: 'Visa-free 90d (US)' }),
  mk('GB', 'United Kingdom', '🇬🇧', { lastEntry: ago(55), daysSpent: 3, yearlyDaysSpent: 6, totalEntries: 2, dayLimit: 180, reason: 'Visa-free 180d (US)' }),
  mk('DE', 'Germany', '🇩🇪', { lastEntry: ago(58), daysSpent: 2, yearlyDaysSpent: 7, totalEntries: 2, dayLimit: 90, reason: 'Schengen 90/180' }),
  mk('CH', 'Switzerland', '🇨🇭', { lastEntry: ago(60), daysSpent: 3, yearlyDaysSpent: 10, totalEntries: 2, dayLimit: 90, reason: 'Schengen 90/180 (counts with DE)' }),
];

export interface PersonaTracking {
  countries: Country[];
  mode: UserMode;
  tier: 'free' | 'premium' | 'sovereign';
}

export const DEMO_PERSONA_TRACKING: Record<'meghan' | 'john', PersonaTracking> = {
  meghan: { countries: MEGHAN_COUNTRIES, mode: 'business', tier: 'sovereign' },
  john:   { countries: JOHN_COUNTRIES,   mode: 'family',   tier: 'sovereign' },
};
