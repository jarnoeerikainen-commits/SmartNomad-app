import { describe, it, expect } from 'vitest';
import { calculateTaxDays, daysForTrip, Trip } from '../taxDayCalculator';
import { getTaxRule } from '@/data/taxResidencyRules';

const t = (country: string, arrival: string, departure: string, exceptional = false): Trip => ({
  countryCode: country, arrival, departure, exceptional,
});

describe('taxDayCalculator — per-country partial-day rules', () => {
  it('US: any-presence rule counts arrival + departure inclusive', () => {
    const r = getTaxRule('US')!;
    // 1 Jan – 5 Jan = 5 days
    expect(daysForTrip(t('US', '2026-01-01', '2026-01-05'), r)).toBe(5);
  });

  it('UK: midnight rule excludes departure day', () => {
    const r = getTaxRule('UK')!;
    // 1 Jan arrive, 5 Jan depart → present at midnight on 1,2,3,4 = 4 days
    expect(daysForTrip(t('UK', '2026-01-01', '2026-01-05'), r)).toBe(4);
  });

  it('Schengen: arrival + departure both count', () => {
    const r = getTaxRule('SCHENGEN')!;
    expect(daysForTrip(t('SCHENGEN', '2026-01-01', '2026-01-05'), r)).toBe(5);
  });

  it('rejects departure before arrival', () => {
    const r = getTaxRule('US')!;
    expect(daysForTrip(t('US', '2026-01-10', '2026-01-05'), r)).toBe(0);
  });

  it('handles single-day trip', () => {
    const r = getTaxRule('US')!;
    expect(daysForTrip(t('US', '2026-06-01', '2026-06-01'), r)).toBe(1);
  });

  it('UK single-day trip = 0 (not present at midnight on departure)', () => {
    const r = getTaxRule('UK')!;
    expect(daysForTrip(t('UK', '2026-06-01', '2026-06-01'), r)).toBe(0);
  });

  it('exceptional circumstances excluded', () => {
    const r = getTaxRule('UK')!;
    expect(daysForTrip(t('UK', '2026-06-01', '2026-06-10', true), r)).toBe(0);
  });

  it('leap-year Feb 29 counts', () => {
    const r = getTaxRule('FR')!;
    expect(daysForTrip(t('FR', '2024-02-28', '2024-03-01'), r)).toBe(3);
  });
});

describe('taxDayCalculator — windows + thresholds', () => {
  it('Schengen rolling 90/180 — over limit', () => {
    const trips: Trip[] = [
      t('SCHENGEN', '2026-01-01', '2026-03-31'), // 90 days
      t('SCHENGEN', '2026-04-15', '2026-04-20'), // 6 more inside 180
    ];
    const res = calculateTaxDays(trips, 'SCHENGEN', new Date('2026-04-20'));
    expect(res.daysCounted).toBeGreaterThanOrEqual(90);
    expect(res.isOverThreshold).toBe(true);
    expect(res.sourceUrl).toContain('eur-lex.europa.eu');
  });

  it('US SPT — weighted under 183 when split across years', () => {
    const trips: Trip[] = [
      t('US', '2024-01-01', '2024-04-10'), // ~100 days yr-2
      t('US', '2025-01-01', '2025-04-10'), // ~100 days yr-1
      t('US', '2026-01-01', '2026-02-10'), // 41 days current
    ];
    const res = calculateTaxDays(trips, 'US', new Date('2026-02-10'));
    // 41 + 100/3 + 100/6 ≈ 91 → not resident
    expect(res.sptWeighted).toBeLessThan(183);
    expect(res.isOverThreshold).toBe(false);
  });

  it('UK tax year boundary 6 Apr', () => {
    const trips: Trip[] = [t('UK', '2026-01-01', '2026-12-31')];
    const res = calculateTaxDays(trips, 'UK', new Date('2026-04-05'));
    expect(res.windowDescription).toContain('5 Apr 2026');
  });

  it('throws for unverified country', () => {
    expect(() => calculateTaxDays([], 'XX', new Date())).toThrow(/No verified rule/);
  });
});

describe('taxDayCalculator — stress', () => {
  it('1000 random trips compute in <50 ms and stay deterministic', () => {
    const rnd = (seed: number) => {
      let s = seed;
      return () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
    };
    const r = rnd(42);
    const trips: Trip[] = [];
    for (let i = 0; i < 1000; i++) {
      const day = Math.floor(r() * 360) + 1;
      const len = Math.floor(r() * 10) + 1;
      const a = new Date(Date.UTC(2026, 0, day));
      const d = new Date(a.getTime() + len * 86_400_000);
      trips.push(t('US', a.toISOString().slice(0, 10), d.toISOString().slice(0, 10)));
    }
    const start = performance.now();
    const res = calculateTaxDays(trips, 'US', new Date('2026-12-31'));
    const ms = performance.now() - start;
    expect(ms).toBeLessThan(50);
    expect(res.daysCounted).toBeGreaterThan(0);
    // run again — must be identical
    const res2 = calculateTaxDays(trips, 'US', new Date('2026-12-31'));
    expect(res2.daysCounted).toBe(res.daysCounted);
  });
});
