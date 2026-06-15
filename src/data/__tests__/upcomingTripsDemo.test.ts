import { describe, it, expect } from 'vitest';
import { getDemoUpcomingTrips } from '@/data/upcomingTripsDemo';

describe('getDemoUpcomingTrips', () => {
  it('returns trips for meghan', () => {
    const trips = getDemoUpcomingTrips('meghan');
    expect(trips.length).toBeGreaterThan(0);
    trips.forEach(t => {
      expect(t.startInDays).toBeGreaterThanOrEqual(0);
      expect(t.clearance).toBeDefined();
    });
  });

  it('returns trips for john', () => {
    const trips = getDemoUpcomingTrips('john');
    expect(trips.length).toBeGreaterThan(0);
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

  it('covers all five trip purposes across personas', () => {
    const all = [
      ...getDemoUpcomingTrips('meghan'),
      ...getDemoUpcomingTrips('john'),
      ...getDemoUpcomingTrips(null),
    ];
    const purposes = new Set(all.map(t => t.purpose));
    ['business', 'pleasure', 'family'].forEach(p => {
      expect(purposes.has(p as any)).toBe(true);
    });
  });
});
