import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useActiveTrip } from '@/hooks/useActiveTrip';
import { Country } from '@/types/country';

const base: Partial<Country> = {
  id: '1', code: 'PT', name: 'Portugal', flag: '🇵🇹',
  dayLimit: 183, daysSpent: 0, reason: '', countTravelDays: true,
  yearlyDaysSpent: 0, totalEntries: 1, followEmbassyNews: false,
};

describe('useActiveTrip', () => {
  it('returns inactive for empty list', () => {
    const { result } = renderHook(() => useActiveTrip([]));
    expect(result.current.isActive).toBe(false);
  });

  it('returns inactive when last entry > 60 days', () => {
    const c = { ...base, lastEntry: new Date(Date.now() - 100 * 86400000).toISOString(), lastUpdate: null } as Country;
    const { result } = renderHook(() => useActiveTrip([c]));
    expect(result.current.isActive).toBe(false);
  });

  it('returns active when last entry within 60 days', () => {
    const c = { ...base, lastEntry: new Date(Date.now() - 5 * 86400000).toISOString(), lastUpdate: null, yearlyDaysSpent: 5 } as Country;
    const { result } = renderHook(() => useActiveTrip([c]));
    expect(result.current.isActive).toBe(true);
    expect(result.current.trip?.country.code).toBe('PT');
    expect(result.current.trip?.daysIn).toBeGreaterThanOrEqual(4);
  });
});
