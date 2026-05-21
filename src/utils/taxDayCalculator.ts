// ═══════════════════════════════════════════════════════════════
// Tax-Day Calculator Engine — strict, by-the-book.
// ───────────────────────────────────────────────────────────────
// For every supported country we apply the *jurisdiction's own*
// partial-day rule. We never invent a number; we either:
//   (a) compute it from rules in taxResidencyRules.ts, or
//   (b) return { error, source } so the UI can show the user the
//       authoritative URL and stop.
// ═══════════════════════════════════════════════════════════════

import {
  TaxResidencyRule,
  getTaxRule,
  isSourceStale,
} from '@/data/taxResidencyRules';

export interface Trip {
  countryCode: string;  // ISO-2; use 'SCHENGEN' for Schengen aggregate
  arrival: string;      // ISO date YYYY-MM-DD (or full ISO timestamp)
  departure: string;    // ISO date YYYY-MM-DD (or full ISO timestamp)
  exceptional?: boolean; // unable to leave (medical / force majeure)
}

export interface DayCountResult {
  countryCode: string;
  daysCounted: number;
  thresholdDays: number;
  windowDescription: string;
  isResident: boolean;
  isOverThreshold: boolean;
  daysRemaining: number;
  sptWeighted?: number; // US Substantial Presence Test
  rule: TaxResidencyRule;
  warnings: string[];
  computedAt: string;
  sourceUrl: string;
  sourceLanguage: string;
  sourceStale: boolean;
}

const MS_PER_DAY = 86_400_000;

function toDateOnly(iso: string): Date {
  // Always anchor to UTC midnight so timezone shifts don't move days.
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    throw new RangeError(`Invalid date: ${iso}`);
  }
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

/**
 * Count days for a single trip according to a country's partial-day rule.
 * Returns 0 for invalid (departure before arrival) so the caller decides.
 */
export function daysForTrip(trip: Trip, rule: TaxResidencyRule): number {
  const arr = toDateOnly(trip.arrival);
  const dep = toDateOnly(trip.departure);
  if (dep < arr) return 0;
  if (trip.exceptional) return 0; // exceptional circumstances excluded per most SRT-style rules

  const total = daysBetween(arr, dep) + 1; // inclusive
  if (total <= 0) return 0;

  switch (rule.partialDayRule) {
    case 'twenty-four-hour':
      // Only full 24h periods count → subtract both ends
      return Math.max(0, total - 2);
    case 'midnight-rule':
      // Present at midnight = a day. The day of departure you are NOT
      // present at midnight in the country, so exclude departure.
      return Math.max(0, total - (rule.countDeparture ? 0 : 1) - (rule.countArrival ? 0 : 1));
    case 'arrival-excluded':
      return Math.max(0, total - 1);
    case 'departure-excluded':
      return Math.max(0, total - 1);
    case 'any-presence-counts':
    default:
      return total;
  }
}

/**
 * Sum days for an array of trips, respecting per-country rules and
 * rolling windows (Schengen 90/180, Portugal 12-month, etc.).
 *
 * @param trips      The user's trip history (any country mix).
 * @param countryCode The country to evaluate.
 * @param asOf       Evaluation date (defaults to today). Used for rolling windows.
 */
export function calculateTaxDays(
  trips: Trip[],
  countryCode: string,
  asOf: Date = new Date(),
): DayCountResult {
  const rule = getTaxRule(countryCode);
  if (!rule) {
    throw new Error(
      `No verified rule for ${countryCode}. Refusing to invent a calculation. ` +
      `Add the country to taxResidencyRules.ts with an official source.`,
    );
  }

  const warnings: string[] = [];
  if (isSourceStale(rule)) {
    warnings.push(
      `Source last verified ${rule.lastVerified}; rules may have changed — re-check ${rule.source} before relying on this.`,
    );
  }

  // Filter trips to the country and to the relevant window.
  const countryTrips = trips.filter(
    (t) => t.countryCode.toUpperCase() === rule.countryCode.toUpperCase(),
  );

  const asOfUtc = toDateOnly(asOf.toISOString());
  let windowStart: Date;
  let windowDescription: string;

  if (rule.rollingWindowDays) {
    windowStart = new Date(asOfUtc.getTime() - (rule.rollingWindowDays - 1) * MS_PER_DAY);
    windowDescription = `Rolling ${rule.rollingWindowDays}-day window ending ${asOfUtc.toISOString().slice(0, 10)}`;
  } else if (rule.taxYear === 'calendar') {
    windowStart = new Date(Date.UTC(asOfUtc.getUTCFullYear(), 0, 1));
    windowDescription = `Calendar year ${asOfUtc.getUTCFullYear()}`;
  } else if (rule.taxYear === 'apr-apr') {
    const y = asOfUtc.getUTCMonth() < 3 || (asOfUtc.getUTCMonth() === 3 && asOfUtc.getUTCDate() < 6)
      ? asOfUtc.getUTCFullYear() - 1
      : asOfUtc.getUTCFullYear();
    windowStart = new Date(Date.UTC(y, 3, 6));
    windowDescription = `UK tax year 6 Apr ${y} – 5 Apr ${y + 1}`;
  } else {
    // jul-jun (AU)
    const y = asOfUtc.getUTCMonth() < 6
      ? asOfUtc.getUTCFullYear() - 1
      : asOfUtc.getUTCFullYear();
    windowStart = new Date(Date.UTC(y, 6, 1));
    windowDescription = `Income year 1 Jul ${y} – 30 Jun ${y + 1}`;
  }

  let daysCounted = 0;
  for (const trip of countryTrips) {
    // Clip trip to window
    const arr = toDateOnly(trip.arrival);
    const dep = toDateOnly(trip.departure);
    if (dep < windowStart || arr > asOfUtc) continue;
    const clippedArr = arr < windowStart ? windowStart : arr;
    const clippedDep = dep > asOfUtc ? asOfUtc : dep;
    daysCounted += daysForTrip(
      { ...trip, arrival: clippedArr.toISOString(), departure: clippedDep.toISOString() },
      rule,
    );
  }

  // Substantial Presence Test (US)
  let sptWeighted: number | undefined;
  if (rule.hasSubstantialPresence && rule.spt) {
    const yr = asOfUtc.getUTCFullYear();
    const dayInYear = (y: number) =>
      countryTrips
        .filter((t) => {
          const a = toDateOnly(t.arrival);
          const d = toDateOnly(t.departure);
          return a.getUTCFullYear() <= y && d.getUTCFullYear() >= y;
        })
        .reduce((sum, t) => {
          const yStart = new Date(Date.UTC(y, 0, 1));
          const yEnd = new Date(Date.UTC(y, 11, 31));
          const a = toDateOnly(t.arrival);
          const d = toDateOnly(t.departure);
          return sum + daysForTrip(
            {
              ...t,
              arrival: (a < yStart ? yStart : a).toISOString(),
              departure: (d > yEnd ? yEnd : d).toISOString(),
            },
            rule,
          );
        }, 0);

    const cur = dayInYear(yr);
    const prior = dayInYear(yr - 1);
    const pp = dayInYear(yr - 2);
    sptWeighted = cur * rule.spt.current + prior * rule.spt.prior + pp * rule.spt.priorPrior;
    if (cur < 31) {
      warnings.push('SPT: <31 days in current year → cannot meet SPT regardless of weighted total (IRS §7701(b)(3)(A)(i)).');
    }
  }

  const effective = sptWeighted ?? daysCounted;
  const isOver = effective >= rule.threshold;

  return {
    countryCode: rule.countryCode,
    daysCounted,
    thresholdDays: rule.threshold,
    windowDescription,
    isResident: isOver,
    isOverThreshold: isOver,
    daysRemaining: Math.max(0, rule.threshold - Math.floor(effective)),
    sptWeighted,
    rule,
    warnings,
    computedAt: new Date().toISOString(),
    sourceUrl: rule.source,
    sourceLanguage: rule.sourceLanguage,
    sourceStale: isSourceStale(rule),
  };
}
