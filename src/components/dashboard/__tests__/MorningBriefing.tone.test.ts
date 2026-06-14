import { describe, it, expect } from 'vitest';

// Mirror the worst() helper used in MorningBriefing to lock its behaviour.
type Tone = 'ok' | 'warn' | 'alert';
const worst = (...t: Tone[]): Tone => t.includes('alert') ? 'alert' : t.includes('warn') ? 'warn' : 'ok';

describe('MorningBriefing tone aggregation', () => {
  it('returns ok when all clear', () => {
    expect(worst('ok', 'ok', 'ok')).toBe('ok');
  });
  it('returns warn when at least one warn and no alert', () => {
    expect(worst('ok', 'warn', 'ok')).toBe('warn');
    expect(worst('warn', 'warn', 'warn')).toBe('warn');
  });
  it('returns alert whenever any alert present', () => {
    expect(worst('ok', 'warn', 'alert')).toBe('alert');
    expect(worst('alert', 'ok', 'ok')).toBe('alert');
  });
});
