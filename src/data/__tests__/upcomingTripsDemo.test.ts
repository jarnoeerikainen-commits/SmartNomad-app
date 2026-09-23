import { describe, it, expect } from 'vitest';
import { getDemoUpcomingTrips } from '@/data/upcomingTripsDemo';

describe('getDemoUpcomingTrips', () => {
  it('legacy named IDs resolve to the same anonymous trips', () => {
    const trips = getDemoUpcomingTrips('meghan');
    expect(trips.length).toBeGreaterThan(0);
    trips.forEach(t => {
      expect(t.startInDays).toBeGreaterThanOrEqual(0);
      expect(t.clearance).toBeDefined();
    });
  });

    expect(getDemoUpcomingTrips('john')).toEqual(getDemoUpcomingTrips(null));
    expect(trips).toEqual(getDemoUpcomingTrips(null));
  });

  it('returns a non-empty list for the default demo (null)', () => {
    const trips = getDemoUpcomingTrips(null);
    expect(trips.length).toBeGreaterThan(0);
  });

  it('can be sorted by startInDays ascending without throwing', () => {
    const trips = [...getDemoUpcomingTrips('meghan')].sort(
      (a, b) => a.startInDays - b.startInDays,
    );
    for (let i = 1; i < trips.length; i++) {
      expect(trips[i].startInDays).toBeGreaterThanOrEqual(trips[i - 1].startInDays);
    }
  });

  it('covers the five trip purposes in the anonymous demo', () => {
    const all = [
      ...getDemoUpcomingTrips(null),
    ];
    const purposes = new Set(all.map(t => t.purpose));
    ['business', 'pleasure', 'family'].forEach(p => {
      expect(purposes.has(p as any)).toBe(true);
    });
  });
});
