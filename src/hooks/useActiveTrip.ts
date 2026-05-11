import { useMemo } from 'react';
import { Country } from '@/types/country';

export interface ActiveTrip {
  country: Country;
  daysIn: number;
  remainingDays: number;
  limit: number;
}

/**
 * Heuristic: a country is "active" when lastEntry is within last 60 days
 * AND yearlyDaysSpent < dayLimit. Picks the country with most recent lastEntry.
 */
export function useActiveTrip(countries: Country[]): { trip: ActiveTrip | null; isActive: boolean } {
  return useMemo(() => {
    if (!countries || countries.length === 0) return { trip: null, isActive: false };

    const now = Date.now();
    const SIXTY_DAYS = 60 * 24 * 60 * 60 * 1000;

    const candidates = countries
      .filter(c => c.lastEntry)
      .map(c => ({ c, ts: new Date(c.lastEntry as string).getTime() }))
      .filter(x => !isNaN(x.ts) && now - x.ts <= SIXTY_DAYS)
      .sort((a, b) => b.ts - a.ts);

    if (candidates.length === 0) return { trip: null, isActive: false };

    const top = candidates[0].c;
    const daysIn = Math.max(1, Math.floor((now - candidates[0].ts) / (24 * 60 * 60 * 1000)));
    const limit = top.dayLimit || 90;
    const remainingDays = Math.max(0, limit - (top.yearlyDaysSpent || daysIn));

    return {
      trip: { country: top, daysIn, remainingDays, limit },
      isActive: true,
    };
  }, [countries]);
}
