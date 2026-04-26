import { describe, expect, it } from 'vitest';
import { getCommunityAgentAlerts, getCommunityAgentMetrics, getCommunityAgentReports } from '../communityAIOptimization';

describe('community AI optimization model', () => {
  it('keeps Pulse and Vibe agent metrics token-aware and back-office-ready', () => {
    const pulse = getCommunityAgentMetrics('pulse');
    const vibe = getCommunityAgentMetrics('vibe');

    expect(pulse.some((m) => /token/i.test(`${m.label} ${m.detail}`))).toBe(true);
    expect(vibe.some((m) => /Back office/i.test(`${m.label} ${m.value}`))).toBe(true);
  });

  it('provides weekly chart reports and picture safety alarms for both surfaces', () => {
    for (const surface of ['pulse', 'vibe'] as const) {
      expect(getCommunityAgentReports(surface)).toHaveLength(7);
      expect(getCommunityAgentAlerts(surface).some((a) => /Picture moderation/i.test(a.title))).toBe(true);
    }
  });
});