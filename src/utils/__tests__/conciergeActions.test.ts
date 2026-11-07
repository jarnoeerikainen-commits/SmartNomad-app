import { describe, expect, it } from 'vitest';
import { buildConciergeActionRequest, matchConciergeChoice, safeActionUrl } from '../conciergeActions';
import type { ActionChip } from '@/components/chat/ActionChips';
import { sanitizeSpeechText } from '@/hooks/voice/speechText';

const choices: ActionChip[] = [
  { label: 'Find return flights', kind: 'flight', payload: 'HEL-DXB' },
  { label: 'Compare hotels', kind: 'hotel' },
  { label: 'Review payment', kind: 'pay', payload: 'offer-123' },
];

describe('Concierge choice actions', () => {
  it.each(['Find return flights', 'Please select Find return flights.', 'first option', 'option one', '1'])('matches spoken or typed selection %s', value => {
    expect(matchConciergeChoice(value, choices)).toEqual(choices[0]);
  });
  it('rejects ambiguity, missing options and unrelated requests', () => {
    expect(matchConciergeChoice('yes', choices)).toBeUndefined();
    expect(matchConciergeChoice('fourth option', choices)).toBeUndefined();
    expect(matchConciergeChoice('option three', choices.slice(0, 1))).toBeUndefined();
    expect(matchConciergeChoice('Compare hotels', [choices[1], choices[1]])).toBeUndefined();
  });
  it.each(['javascript:alert(1)', 'data:text/html,x', 'http://example.com', 'https://user:pass@example.com', '//example.com', 'offer-123'])('rejects unsafe or non-link payload %s', payload => {
    expect(safeActionUrl(payload)).toBeUndefined();
  });
  it('accepts HTTPS links with query details intact', () => {
    expect(safeActionUrl('https://www.kayak.com/flights/HEL-DXB?cabin=b')).toBe('https://www.kayak.com/flights/HEL-DXB?cabin=b');
  });
  it('preserves source context and reference for a payment review, never automatic completion', () => {
    const request = buildConciergeActionRequest(choices[2], 'Return business flight, 10–12 Nov, USD.');
    expect(request).toContain('offer-123');
    expect(request).toContain('Return business flight, 10–12 Nov, USD.');
    expect(request).toContain('show the real review/confirmation control');
    expect(request).toContain('never claim it completed without a verified result');
  });
  it('speaks choice labels but not internal references or wire syntax', () => {
    const speech = sanitizeSpeechText('Ready. [[CHIPS: Find return flights|flight|secret-ref;; Compare hotels|hotel|hotel-ref]]');
    expect(speech).toContain('Find return flights; Compare hotels');
    expect(speech).not.toMatch(/CHIPS|secret-ref|hotel-ref/);
  });
});