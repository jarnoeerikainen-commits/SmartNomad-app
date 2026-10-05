import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('public surface governance', () => {
  it('keeps unsupported and roadmap-only claims off the landing page', () => {
    const landing = read('../Landing.tsx');
    const banned = [
      /6\.2M/i,
      /nomads online/i,
      /ETIAS\s*[·-]?\s*live/i,
      /500\+\s*(live\s*)?incidents/i,
      /Agentic Wallet/i,
      /autonomous booking/i,
      /Black Box Guardian/i,
      /SOS\s*\+/i,
      /Sofia is online/i,
      /100\+ cities/i,
      /to="\/admin"/i,
      />Back Office</i,
    ];

    banned.forEach((pattern) => expect(landing).not.toMatch(pattern));
  });

  it('keeps ordinary app navigation free of staff shortcuts', () => {
    const sidebar = read('../../components/AppSidebar.tsx');
    const shortcuts = read('../../components/BackToWebsiteButton.tsx');

    expect(sidebar).not.toMatch(/id:\s*['"]admin['"]/);
    expect(shortcuts).not.toContain('/admin');
    expect(shortcuts).not.toMatch(/Back Office/i);
  });

  it('does not grant anonymous users a synthetic staff role', () => {
    const staffHook = read('../../hooks/useStaffRole.ts');
    expect(staffHook).not.toMatch(/role:\s*['"]admin['"][\s\S]{0,120}isStaff:\s*true/);
    expect(staffHook).toMatch(/if \(!user\)[\s\S]*isStaff:\s*false/);
  });
});