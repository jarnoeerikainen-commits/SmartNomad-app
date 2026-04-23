// ═══════════════════════════════════════════════════════════════════════════
// AI COUNCIL DAILY DIGEST — Demo data
// Deterministic multi-day digest of decisions made by SuperNomad's
// 6 department-lead AIs (Legal, Security, Growth, Concierge, Finance, Brand)
// during their daily 09:00 council meeting. Used by AdminOverview.
// ═══════════════════════════════════════════════════════════════════════════

export type CouncilTeam =
  | 'Legal & Compliance'
  | 'Security & Trust'
  | 'Growth & Marketing'
  | 'Concierge Quality'
  | 'Finance & Revenue'
  | 'Brand & Product';

export type CouncilDecision = {
  team: CouncilTeam;
  emoji: string;
  title: string;
  summary: string;
  status: 'approved' | 'flagged' | 'monitoring' | 'rejected';
  impact: 'low' | 'medium' | 'high';
  metric?: string;
};

export type CouncilDay = {
  date: string;            // ISO yyyy-mm-dd
  label: string;           // "Today", "Yesterday", weekday
  headline: string;        // executive one-liner
  attendance: number;      // 1-6 leads present
  decisions: CouncilDecision[];
  highlights: string[];
  concerns: string[];
};

const TEMPLATES: Record<CouncilTeam, { emoji: string; items: Omit<CouncilDecision, 'team' | 'emoji'>[] }> = {
  'Legal & Compliance': {
    emoji: '⚖️',
    items: [
      { title: 'ETIAS rollout playbook approved', summary: 'Locked the 2026 ETIAS user flow with verified embassy fallback. Translations queued for 13 languages.', status: 'approved', impact: 'high', metric: '13 languages' },
      { title: 'GDPR consent banner copy refresh', summary: 'Tightened wording for cookie + analytics consent; passed legal review on first pass.', status: 'approved', impact: 'medium' },
      { title: 'Spain digital nomad visa wording', summary: 'Flagged outdated tax rate paragraph; requested copy update before next sync.', status: 'flagged', impact: 'medium', metric: '1 page affected' },
      { title: 'Affiliate Terms v1.2 ratified', summary: 'New 30-day clawback clause + crypto payout disclosures cleared by all 6 leads.', status: 'approved', impact: 'high' },
      { title: 'Portugal NHR sunset advisory', summary: 'Council monitoring final NHR phase-out; Concierge pre-briefed for HNW responses.', status: 'monitoring', impact: 'high' },
    ],
  },
  'Security & Trust': {
    emoji: '🛡️',
    items: [
      { title: 'Black Box Guardian stream test', summary: 'End-to-end encryption verified across 4 device types. Zero packet loss in 60-min stress run.', status: 'approved', impact: 'high', metric: '0 packet loss' },
      { title: 'Suspicious login burst, AE region', summary: '14 retries from rotating IPs flagged; auto-throttle deployed, 2 accounts paused.', status: 'flagged', impact: 'medium', metric: '14 retries' },
      { title: 'Snomad ID vault key rotation', summary: 'Quarterly rotation completed without user disruption.', status: 'approved', impact: 'high' },
      { title: 'Cyber Guardian SLA review', summary: 'Median first-response now 38s (target <60s). Maintained.', status: 'monitoring', impact: 'low', metric: '38s median' },
      { title: 'Phishing pattern signature update', summary: 'Added 7 new merchant-impersonation patterns to Concierge guardrails.', status: 'approved', impact: 'medium' },
    ],
  },
  'Growth & Marketing': {
    emoji: '🚀',
    items: [
      { title: 'Affiliate L1 rate experiment', summary: 'A/B raising L1 from 25% → 28% for 2 weeks on new sign-ups. Projection: +7.4% activation.', status: 'approved', impact: 'high', metric: '+7.4% projected' },
      { title: 'Onboarding tour conversion', summary: 'New 3-step tour lifts persona completion from 61% → 78%. Roll out to 100%.', status: 'approved', impact: 'high', metric: '+17pp' },
      { title: 'Lisbon launch event budget', summary: 'Approved €18,400 for partner mixer; CFO co-signed.', status: 'approved', impact: 'medium', metric: '€18,400' },
      { title: 'Investor microsite copy', summary: 'Brand requested softer tone on valuation page; revisit tomorrow.', status: 'flagged', impact: 'low' },
      { title: 'Referral push notif copy', summary: 'New variant pulled +12% CTR vs control over 48h.', status: 'approved', impact: 'medium', metric: '+12% CTR' },
    ],
  },
  'Concierge Quality': {
    emoji: '🎙️',
    items: [
      { title: 'ElevenLabs voice latency win', summary: 'Median first-audio dropped to 180ms after streaming refactor; barge-in stable.', status: 'approved', impact: 'high', metric: '180ms p50' },
      { title: 'Persona memory drift fix', summary: 'Resolved "Meghan → John" persona leakage in long sessions; regression tests added.', status: 'approved', impact: 'high' },
      { title: 'Booking card mis-render', summary: '3 reports of malformed flight cards on iOS 17.4. Patch ready, shipping with next deploy.', status: 'flagged', impact: 'medium', metric: '3 reports' },
      { title: 'Holiday intelligence refresh', summary: 'Synced 2026 calendar for 100+ countries; observed +9% engagement on travel queries.', status: 'approved', impact: 'medium', metric: '+9% engagement' },
      { title: 'Multilingual fallback policy', summary: 'When ElevenLabs unavailable, browser TTS now matches user locale before defaulting to EN.', status: 'approved', impact: 'medium' },
    ],
  },
  'Finance & Revenue': {
    emoji: '💎',
    items: [
      { title: 'B2B data deal — Tier 2 partner', summary: 'Closed 12-month subscription at $9.4k MRR; first invoice scheduled.', status: 'approved', impact: 'high', metric: '$9.4k MRR' },
      { title: 'Pending affiliate payouts cleared', summary: 'Released $42,180 across 38 payouts; 2 held for KYC review.', status: 'approved', impact: 'high', metric: '$42,180' },
      { title: 'AI gateway cost spike', summary: 'Token spend +18% week-over-week — cache hit rate dropped to 41%. Investigating.', status: 'flagged', impact: 'medium', metric: '+18% WoW' },
      { title: 'Premium price test approved', summary: 'Test $5.49/mo vs $4.99 in low-elasticity markets (UK, CH, SG).', status: 'approved', impact: 'high' },
      { title: 'Stripe Issuing reconciliation', summary: 'All virtual-card settlements matched ledger; zero variance.', status: 'approved', impact: 'low' },
    ],
  },
  'Brand & Product': {
    emoji: '✨',
    items: [
      { title: 'Dashboard contrast pass', summary: 'Number readability hardened on dark surfaces across Back Office.', status: 'approved', impact: 'medium' },
      { title: 'Concierge avatar lip-sync polish', summary: 'Mouth openness curve smoothed; testers rated +1.4 on naturalness (1-5).', status: 'approved', impact: 'medium', metric: '+1.4 NPS' },
      { title: 'Logo usage on dark backgrounds', summary: 'Approved updated gold-on-charcoal lockup; deprecated 3 legacy variants.', status: 'approved', impact: 'low' },
      { title: 'Investor deck v3 narrative', summary: 'Council aligned on "Sovereign Lifestyle OS" positioning. Ship Friday.', status: 'approved', impact: 'high' },
      { title: 'Mobile FAB overlap on iPhone SE', summary: 'Safe-area inset patch deployed; verified on 4 device sizes.', status: 'approved', impact: 'medium' },
    ],
  },
};

const HEADLINES = [
  'Stable platform, three premium experiments greenlit.',
  'Concierge quality at all-time high; one cost concern under watch.',
  'Compliance posture strong, growth experiments outperforming targets.',
  'Quiet ops day — focus shifted to brand consistency and copy polish.',
  'Major affiliate decisions ratified; revenue streams up week-over-week.',
  'Safety drills passed; multilingual coverage expanded across 13 locales.',
  'Crisp council, fast decisions — investor-ready week ahead.',
];

function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6D2B79F5) >>> 0;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(r: () => number, arr: readonly T[]): T {
  return arr[Math.floor(r() * arr.length)];
}

function dayLabel(offset: number, date: Date): string {
  if (offset === 0) return 'Today';
  if (offset === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function generateCouncilDigest(daysBack = 7): CouncilDay[] {
  const teams = Object.keys(TEMPLATES) as CouncilTeam[];
  const out: CouncilDay[] = [];

  for (let i = 0; i < daysBack; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const iso = date.toISOString().slice(0, 10);
    // seed by date so each day is stable across reloads
    const seed = parseInt(iso.replace(/-/g, ''), 10);
    const r = rng(seed);

    // pick 4-6 decisions across teams (one per team, skip 0-2 randomly)
    const decisions: CouncilDecision[] = [];
    for (const team of teams) {
      if (r() < 0.18 && decisions.length >= 4) continue; // sometimes a team has nothing
      const tpl = TEMPLATES[team];
      const item = pick(r, tpl.items);
      decisions.push({ team, emoji: tpl.emoji, ...item });
    }

    const approved = decisions.filter((d) => d.status === 'approved').length;
    const flagged = decisions.filter((d) => d.status === 'flagged').length;
    const highlights = decisions
      .filter((d) => d.status === 'approved' && d.impact === 'high')
      .slice(0, 3)
      .map((d) => `${d.emoji} ${d.title}`);
    const concerns = decisions
      .filter((d) => d.status === 'flagged' || d.status === 'monitoring')
      .slice(0, 2)
      .map((d) => `${d.emoji} ${d.title}`);

    out.push({
      date: iso,
      label: dayLabel(i, date),
      headline: pick(r, HEADLINES),
      attendance: 4 + Math.floor(r() * 3), // 4-6 leads present
      decisions,
      highlights: highlights.length ? highlights : [`${approved} decisions ratified`],
      concerns: concerns.length ? concerns : flagged ? [`${flagged} item flagged`] : [],
    });
  }

  return out;
}
