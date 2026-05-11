import { describe, it, expect } from 'vitest';
import { PRICING_TIERS } from '@/components/PricingCard';

describe('PRICING_TIERS', () => {
  it('contains free, premium, sovereign', () => {
    const ids = PRICING_TIERS.map(t => t.id);
    expect(ids).toEqual(['free', 'premium', 'sovereign']);
  });

  it('sovereign is €29 with 4 seats', () => {
    const sov = PRICING_TIERS.find(t => t.id === 'sovereign')!;
    expect(sov.price).toBe(29);
    expect(sov.userLimit).toBe('4 seats');
    expect(sov.features.some(f => /family vault/i.test(f))).toBe(true);
    expect(sov.features.some(f => /empty[- ]leg/i.test(f))).toBe(true);
  });
});
