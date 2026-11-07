import { describe, expect, it } from 'vitest';
import { classifyBirthYear, getMobileConciergeViewport, needsAdultAccess, shouldEnterMobileApp } from '../mobileEntry';

describe('mobile entry safeguards', () => {
  it('opens the app on phones but preserves explicit website access and desktop entry', () => {
    expect(shouldEnterMobileApp(true, '')).toBe(true);
    expect(shouldEnterMobileApp(true, '?view=website')).toBe(false);
    expect(shouldEnterMobileApp(false, '')).toBe(false);
  });
  it('detects a keyboard viewport without subtracting navigation space twice', () => {
    expect(getMobileConciergeViewport(430, 10, 844)).toEqual({ height: 430, top: 10, keyboardOpen: true });
    expect(getMobileConciergeViewport(844, 0, 844).keyboardOpen).toBe(false);
  });
  it('requires adult verification for payments, but not basic Concierge', () => {
    expect(needsAdultAccess('payment-options')).toBe(true);
    expect(needsAdultAccess('concierge')).toBe(false);
  });
  it('preserves the existing under-16 and 16–17 restrictions', () => {
    expect(classifyBirthYear(2011, 2026)).toBe('child');
    expect(classifyBirthYear(2010, 2026)).toBe('teen');
    expect(classifyBirthYear(2009, 2026)).toBe('teen');
    expect(classifyBirthYear(2008, 2026)).toBe('adult');
    expect(classifyBirthYear(2027, 2026)).toBeNull();
  });
});