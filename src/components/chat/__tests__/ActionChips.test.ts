import { describe, it, expect } from 'vitest';
import { parseActionChips } from '../ActionChips';

describe('parseActionChips', () => {
  it('returns empty chips when none present', () => {
    const r = parseActionChips('Just plain text.');
    expect(r.chips).toEqual([]);
    expect(r.text).toBe('Just plain text.');
  });

  it('parses multi-line block', () => {
    const input = `Done — booked for 7pm.

[[CHIPS]]
- Add to calendar | calendar | 2026-06-01T19:00
- Hold 24h | hold | offer-123|24h
- Forward to accountant | forward | accountant
[[/CHIPS]]`;
    const r = parseActionChips(input);
    expect(r.chips.length).toBe(3);
    expect(r.chips[0].label).toBe('Add to calendar');
    expect(r.chips[0].kind).toBe('calendar');
    expect(r.chips[1].kind).toBe('hold');
    expect(r.chips[2].kind).toBe('forward');
    expect(r.text).toBe('Done — booked for 7pm.');
  });

  it('parses inline form', () => {
    const r = parseActionChips('OK. [[CHIPS: Book flight|book|fl-1;; Open IRS|open|https://irs.gov]]');
    expect(r.chips.length).toBe(2);
    expect(r.chips[0].kind).toBe('book');
    expect(r.chips[1].payload).toBe('https://irs.gov');
    expect(r.text.trim()).toBe('OK.');
  });

  it('falls back to "open" for unknown kinds', () => {
    const r = parseActionChips('[[CHIPS: Do thing|invented_kind|x]]');
    expect(r.chips[0].kind).toBe('open');
  });

  it('ignores malformed bullet lines', () => {
    const input = `text\n[[CHIPS]]\nnot-a-bullet\n- Real | book | id\n[[/CHIPS]]`;
    const r = parseActionChips(input);
    expect(r.chips.length).toBe(1);
    expect(r.chips[0].label).toBe('Real');
  });
});
