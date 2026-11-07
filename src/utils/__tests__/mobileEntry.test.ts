import { describe, expect, it } from 'vitest';
import { classifyBirthYear, DEMO_APP_ENTRY, getInitialAppTab, getMobileConciergeViewport, needsAdultAccess } from '../mobileEntry';

describe('mobile entry safeguards', () => {
  it('routes Demo APP directly to Concierge on phones and desktop', () => {
    const entry = new URL(DEMO_APP_ENTRY, 'https://supernomad.app');
    expect(entry.pathname).toBe('/app');
    expect(entry.searchParams.get('demo')).toBe('1');
    expect(getInitialAppTab(true, entry.search)).toBe('concierge');
    expect(getInitialAppTab(false, entry.search)).toBe('concierge');
  });
  it('preserves direct app entry defaults without an explicit Concierge request', () => {
    expect(getInitialAppTab(true, '')).toBe('concierge');
    expect(getInitialAppTab(false, '')).toBe('home');
    expect(getInitialAppTab(false, '?entry=unknown')).toBe('home');
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