/**
 * Pricing Experiment Harness
 * --------------------------
 * Lightweight A/B price assignment with stable bucketing per device/user.
 * No external service required — uses deterministic hashing so the same
 * user always sees the same price across sessions.
 *
 * Add new experiments here, then read with `getPriceVariant(experimentId)`.
 *
 * Example:
 *   const v = getPriceVariant('premium_monthly_2026q2');
 *   if (v.variant === 'B') { // show $7.99 instead of $4.99 }
 */
import { getDeviceId } from './deviceId';

export type PriceVariant = {
  experimentId: string;
  variant: string;          // e.g. 'A' | 'B' | 'C'
  priceMinor: number;        // price in cents/öre/etc
  currency: string;          // ISO 4217
  displayPrice: string;      // pre-formatted
  metadata?: Record<string, unknown>;
};

export type Experiment = {
  id: string;
  description: string;
  variants: Array<Omit<PriceVariant, 'experimentId'>>;
  weights?: number[];        // must sum to 1; defaults to uniform
  startsAt?: string;         // ISO date
  endsAt?: string;           // ISO date
};

// ─── REGISTRY ───────────────────────────────────────────────────────────────
export const PRICING_EXPERIMENTS: Experiment[] = [
  {
    id: 'premium_monthly_2026q2',
    description: 'Test $7.99 vs $4.99 for Premium monthly',
    variants: [
      { variant: 'A', priceMinor: 499, currency: 'USD', displayPrice: '$4.99' },
      { variant: 'B', priceMinor: 799, currency: 'USD', displayPrice: '$7.99' },
    ],
    weights: [0.5, 0.5],
  },
  {
    id: 'trust_pass_verification_2026q2',
    description: 'Per-verification price for Trust Pass',
    variants: [
      { variant: 'A', priceMinor: 5000,  currency: 'USD', displayPrice: '$50' },
      { variant: 'B', priceMinor: 7500,  currency: 'USD', displayPrice: '$75' },
      { variant: 'C', priceMinor: 10000, currency: 'USD', displayPrice: '$100' },
    ],
    weights: [0.34, 0.33, 0.33],
  },
  {
    id: 'concierge_credit_topup_2026q2',
    description: 'Smallest top-up bundle price',
    variants: [
      { variant: 'A', priceMinor: 999,  currency: 'USD', displayPrice: '$9.99'  },
      { variant: 'B', priceMinor: 1499, currency: 'USD', displayPrice: '$14.99' },
    ],
    weights: [0.5, 0.5],
  },
];

// ─── PUBLIC API ─────────────────────────────────────────────────────────────
export function getPriceVariant(experimentId: string, subjectId?: string): PriceVariant | null {
  const exp = PRICING_EXPERIMENTS.find(e => e.id === experimentId);
  if (!exp) return null;
  if (!isActive(exp)) return null;

  const subject = subjectId || getDeviceId();
  const idx = bucket(subject + ':' + experimentId, exp.weights ?? exp.variants.map(() => 1 / exp.variants.length));
  const v = exp.variants[idx];
  return { experimentId, ...v };
}

export function listActiveExperiments(): Experiment[] {
  return PRICING_EXPERIMENTS.filter(isActive);
}

// ─── INTERNALS ──────────────────────────────────────────────────────────────
function isActive(exp: Experiment): boolean {
  const now = Date.now();
  if (exp.startsAt && new Date(exp.startsAt).getTime() > now) return false;
  if (exp.endsAt   && new Date(exp.endsAt).getTime()   < now) return false;
  return true;
}

/** Stable [0,1) hash via FNV-1a 32-bit. Deterministic across browsers. */
function hash01(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return ((h >>> 0) % 1_000_000) / 1_000_000;
}

function bucket(subject: string, weights: number[]): number {
  const r = hash01(subject);
  let cum = 0;
  for (let i = 0; i < weights.length; i++) {
    cum += weights[i];
    if (r < cum) return i;
  }
  return weights.length - 1;
}
