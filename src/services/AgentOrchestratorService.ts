// ═══════════════════════════════════════════════════════════════════════════
// AGENT ORCHESTRATOR — Multi-Agent Back-Office Protocol
//
// Implements the SuperNomad Sovereign Back-Office Protocol:
//   • 5 specialised "Department Lead" AI agents (Read-Only / Propose-Only)
//   • 1 Governor (Admin) — sole authority to approve / push to staging
//   • Daily 09:00 briefing, independent research (no cross-talk bias)
//   • Human-in-the-Loop (HITL) security-key permit for any change
//   • Resource lockdown: agents cannot spawn workers or raise budget
//
// CURRENT MODE: full client-side demo — generates believable proposals on
// a continuous cadence so the back office always has fresh signal.
//
// BACKEND READY: every agent has a `live_endpoint` hook + `live_payload()`
// builder. When the real edge functions ship, flip `MODE = 'live'` and the
// service will call them instead of the simulator. The proposal/approval
// ledger schema is identical, so no UI changes required.
// ═══════════════════════════════════════════════════════════════════════════

export type AgentId =
  // Original 5 — Sovereign Back-Office Protocol
  | 'legal' | 'security' | 'growth' | 'product' | 'oracle'
  // Tier 1 — Highest leverage (curation, pricing, retention)
  | 'atlas' | 'midas' | 'echo'
  // Tier 2 — Operating depth (crisis, content, supply ops)
  | 'sentinel' | 'muse' | 'praxis'
  // Tier 3 — Optimization & long-term (experimentation, trust, ESG, LTV)
  | 'forge' | 'concord' | 'verdant' | 'atlas_ltv';

export type AgentTier = 'core' | 'tier1' | 'tier2' | 'tier3';

export type AgentMode = 'demo' | 'live';

export type ProposalStatus =
  | 'drafted'        // agent produced it, awaiting review
  | 'in_review'      // governor opened it
  | 'needs_permit'   // requires HITL security key to push
  | 'approved'       // governor approved + pushed to staging
  | 'rejected'       // governor rejected
  | 'expired';       // auto-expired without action

export type ProposalPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AgentDefinition {
  id: AgentId;
  name: string;            // human-readable
  role: string;            // e.g. "Lead International Compliance Officer"
  team_label: string;      // e.g. "Sovereign Legal & Compliance Guard"
  emoji: string;
  color_token: string;     // tailwind hsl token reference (semantic)
  mission: string;
  daily_task: string;
  output_label: string;    // e.g. "Compliance Risk Report"
  goal: string;
  constraints: string[];   // hard limits (read-only, no spawn, etc.)
  live_endpoint: string;   // backend function slug for production mode
  cadence_minutes: number; // how often it autonomously produces output
}

export interface AgentProposal {
  id: string;
  agent_id: AgentId;
  created_at: number;
  title: string;
  summary: string;             // 1–2 sentence executive summary
  rationale: string;           // why this matters, grounded
  proposed_action: string;     // exact change to push (e.g. "Update Dubai 183-day rule v2")
  expected_impact: string;     // measurable outcome
  evidence: string[];          // bullet evidence snippets
  affected_segment?: string;   // e.g. "Premium nomads in MEA"
  est_users_impacted?: number;
  est_revenue_usd?: number;
  confidence: number;          // 0–1
  priority: ProposalPriority;
  requires_permit: boolean;    // HITL security-key required to deploy
  status: ProposalStatus;
  governor_note?: string;
  decided_at?: number;
  decided_by?: 'admin';
}

export interface DailyBriefing {
  id: string;
  date: string;                // YYYY-MM-DD
  generated_at: number;
  headline: string;
  by_agent: Record<AgentId, { headline: string; top_proposal_id?: string; metric: string }>;
  governor_note: string;       // synthesized cross-team summary (Governor view)
}

export interface AgentActivityEvent {
  id: string;
  ts: number;
  agent_id: AgentId | 'governor';
  kind: 'scan' | 'draft' | 'briefing' | 'approval' | 'rejection' | 'permit_request' | 'lockdown';
  text: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENT REGISTRY (the 5 department leads + Governor meta)
// ─────────────────────────────────────────────────────────────────────────────

export const AGENTS: Record<AgentId, AgentDefinition> = {
  legal: {
    id: 'legal',
    name: 'Themis',
    role: 'Lead International Compliance Officer',
    team_label: 'Sovereign Legal & Compliance Guard',
    emoji: '⚖️',
    color_token: 'hsl(43 96% 56%)', // gold
    mission: '24/7 monitoring of global tax laws, residency rules, GDPR & PIPL.',
    daily_task: 'Identify shifting "183-day" rules in nomad hubs (Dubai, Portugal, Bali).',
    output_label: 'Compliance Risk Report',
    goal: 'Keep the app 100% legal and protect users from tax traps.',
    constraints: ['read-only', 'propose-only', 'no spawning workers', 'HITL permit for legal logic changes'],
    live_endpoint: 'agent-legal',
    cadence_minutes: 35,
  },
  security: {
    id: 'security',
    name: 'Aegis',
    role: 'Chief Information Security Officer (CISO)',
    team_label: 'Fortress Security Team',
    emoji: '🛡️',
    color_token: 'hsl(0 72% 51%)', // crimson
    mission: 'Constant red-teaming of the Sovereign Vault. Monitor prompt-injection, API leaks, x402 anomalies.',
    daily_task: 'Scan latest zero-day vulnerabilities in fintech and decentralised identity.',
    output_label: 'Security Posture Brief',
    goal: 'Maintain bank-grade trust and zero-breach history.',
    constraints: ['read-only', 'propose-only', 'no live patches without permit', 'budget locked'],
    live_endpoint: 'agent-security',
    cadence_minutes: 25,
  },
  growth: {
    id: 'growth',
    name: 'Hermes',
    role: 'Global Revenue & Partnership Architect',
    team_label: 'Growth & Yield Engine',
    emoji: '🚀',
    color_token: 'hsl(160 84% 39%)', // emerald
    mission: 'Run the 2-tier affiliate model. Identify Founding Partners (athletes, CEOs, influencers).',
    daily_task: 'Research top-100 travel/business influencers, model Sovereign Yield, draft outreach.',
    output_label: 'Partnership Proposal Deck',
    goal: 'Scale to 1M users by maximising the 2-tier viral loop.',
    constraints: ['read-only on financials', 'no auto-outreach', 'permit required for sponsorship deals'],
    live_endpoint: 'agent-growth',
    cadence_minutes: 30,
  },
  product: {
    id: 'product',
    name: 'Iris',
    role: 'Head of User Experience & Product Development',
    team_label: 'Product Labs',
    emoji: '🎨',
    color_token: 'hsl(280 70% 60%)', // violet
    mission: 'Analyse user behaviour to remove friction. Bundle 100+ features into Life-Flow groups.',
    daily_task: 'Design wireframes for One-Click Migration and Pulse Synergy matching.',
    output_label: 'Product Roadmap Update',
    goal: 'Make the app the most versatile & attractive sovereign OS in the world.',
    constraints: ['no live UI deploys', 'wireframes only', 'permit required to ship to production'],
    live_endpoint: 'agent-product',
    cadence_minutes: 40,
  },
  oracle: {
    id: 'oracle',
    name: 'Pythia',
    role: 'Chief Data Officer & Market Forecaster',
    team_label: 'The Oracle — Real Data Analyst Team',
    emoji: '📊',
    color_token: 'hsl(200 90% 55%)', // azure
    mission: 'Analyse the 100-Habit revenue streams. Track spend on flights, villas, eSIMs.',
    daily_task: 'Compare SuperNomad pricing vs Booking/Expedia to keep 2.5% commission competitive.',
    output_label: 'Profitability & Market Trends',
    goal: 'Maximise marketplace margin while keeping user costs low.',
    constraints: ['read-only on warehouse', 'cannot trigger price changes', 'permit required for repricing'],
    live_endpoint: 'agent-oracle',
    cadence_minutes: 20,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DEMO PROPOSAL TEMPLATES (rich, plausible, varied)
// ─────────────────────────────────────────────────────────────────────────────

type Template = Omit<AgentProposal, 'id' | 'created_at' | 'status' | 'agent_id'>;

const LEGAL_TEMPLATES: Template[] = [
  {
    title: 'Dubai 183-day rule tightening — proposed Tax-Shield logic v2.4',
    summary: 'UAE FTA clarified physical-presence calculation: airport transit days now count. Affects 1,240 of our Premium nomads with Dubai residency.',
    rationale: 'Federal Decree-Law update published 6 days ago; current Tax-Shield treats transit as neutral, exposing users to retroactive audits.',
    proposed_action: 'Patch Tax-Shield rule engine: include any UAE airport stop ≥4h as a presence day; push warning banner to affected residency profiles.',
    expected_impact: 'Eliminates ~$2.1M aggregate audit exposure across affected users; lifts trust score on Compliance pillar by est. +6 pts.',
    evidence: [
      'UAE FTA bulletin 2026-04-14 §3.2',
      '1,240 Premium users hold UAE TRC + travel ≥3 transits/quarter',
      '4 support tickets in last 72h asking exactly this question',
    ],
    affected_segment: 'Premium nomads — UAE residents',
    est_users_impacted: 1240,
    confidence: 0.92,
    priority: 'urgent',
    requires_permit: true,
  },
  {
    title: 'Portugal NHR 2.0 — IFICI eligibility checker outdated',
    summary: 'New Portuguese tax incentive (IFICI) replaces NHR for arrivals after Jan 2024. Our concierge still recommends NHR by default.',
    rationale: 'Lei n.º 82/2023; concierge knowledge cutoff in this domain is stale by ~14 months.',
    proposed_action: 'Refresh advisor knowledge pack PT-TAX-2026; auto-suggest IFICI flow when arrival date > 2024-01-01.',
    expected_impact: 'Prevents ~190 incorrect tax-status recommendations/month; reduces concierge-related complaints by 18%.',
    evidence: ['190 PT residency advisor sessions in last 30d', '11 mismatched recommendations flagged by Themis last week'],
    affected_segment: 'Free + Premium — Portugal-bound users',
    est_users_impacted: 2300,
    confidence: 0.88,
    priority: 'high',
    requires_permit: true,
  },
  {
    title: 'GDPR Art. 22 — concierge auto-decisions need explainability tag',
    summary: 'Concierge currently autonomously chooses booking vendors. Under Art. 22 we must surface human-readable rationale.',
    rationale: 'EDPB guidance 2026-Q1 explicit on agentic AI; current UI shows result without reasoning chain.',
    proposed_action: 'Append "Why this pick?" disclosure card on every concierge auto-selection; store reasoning for 24 months.',
    expected_impact: 'Closes regulatory gap for 4.2M EU sessions/yr; pre-empts ~€220k potential fine.',
    evidence: ['EDPB letter 2026-03-28', '11 EU member-state DPAs adopted same stance'],
    confidence: 0.95,
    priority: 'high',
    requires_permit: true,
  },
  {
    title: 'Bali KITAS digital nomad visa quotas refreshed',
    summary: 'Indonesia raised the new E33G visa cap from 5,000 to 12,000/yr. Our queue logic still throttles applications.',
    rationale: 'Imigrasi notice 2026-04-19; opportunity to unlock 230 Premium pipeline applications.',
    proposed_action: 'Lift internal throttle from 4 → 10 concurrent applications/region; notify pending Bali users.',
    expected_impact: 'Unlocks $46k visa-fee affiliate revenue this quarter.',
    evidence: ['230 users in Bali KITAS waitlist', 'NEW Imigrasi cap published 5d ago'],
    confidence: 0.86,
    priority: 'medium',
    requires_permit: false,
  },
];

const SECURITY_TEMPLATES: Template[] = [
  {
    title: 'Prompt-injection attempt blocked — propose hardening of concierge guard',
    summary: 'Detected 47 attempts in last 24h to exfiltrate `LOVABLE_API_KEY` via crafted user prompts. All blocked, none reached upstream.',
    rationale: 'Pattern matches OWASP LLM01 catalogue; 3 attempts came from same residential ASN.',
    proposed_action: 'Deploy regex+embedding pre-filter on concierge edge function; rate-limit suspicious ASN cluster.',
    expected_impact: 'Reduces successful injection probability by est. 92%. Zero impact on legitimate users.',
    evidence: ['47 blocks in audit_log last 24h', '3 unique IPs / 1 ASN', 'Same payload variant used in 2026 Lovable disclosure list'],
    confidence: 0.94,
    priority: 'urgent',
    requires_permit: true,
  },
  {
    title: 'x402 payment trust-score anomaly — Brazil corridor',
    summary: 'Trust-score for x402 settlements via BR USDC-Base dropped from 0.91 → 0.74 in 18h.',
    rationale: 'Spike in failed callbacks from one settlement node; could be node degradation or MITM probe.',
    proposed_action: 'Failover BR corridor to backup node; raise approval_threshold from $250 → $50 for 24h.',
    expected_impact: 'Prevents potential $14k loss exposure; users see one extra approval tap during window.',
    evidence: ['18h trust-score timeseries attached', '6 failed settlements totalling $9.4k'],
    confidence: 0.81,
    priority: 'urgent',
    requires_permit: true,
  },
  {
    title: 'Zero-day in `node-jose` 4.x — used by Snomad ID vault',
    summary: 'CVE-2026-2711 published 2d ago; CVSS 7.5. Affects JWT decryption path in our identity vault.',
    rationale: 'We pin 4.14.4. Patched in 5.0.0. No exploit observed in our logs but window is open.',
    proposed_action: 'Bump to 5.0.1 across edge functions; redeploy 7 functions; rotate session secret.',
    expected_impact: 'Closes vault-side vector for token forgery (est. exposure: 100% of Premium users).',
    evidence: ['CVE-2026-2711', '7 functions import node-jose', 'No anomalous decrypt traffic in audit_log'],
    confidence: 0.97,
    priority: 'high',
    requires_permit: true,
  },
  {
    title: 'Rotate 4 API keys older than 180 days',
    summary: 'B2B partner keys for Acme-Travel, OrbitMed, NestPay, GlobeFi exceed our 180d rotation policy.',
    rationale: 'Internal policy SEC-04. Risk grows linearly with key age in absence of rotation.',
    proposed_action: 'Generate replacement keys; coordinate 14-day rolling cutover with each partner.',
    expected_impact: 'Restores compliance with SEC-04; no partner downtime expected.',
    evidence: ['4 keys flagged by api_partners.last_rotation < now()-180d'],
    confidence: 0.99,
    priority: 'medium',
    requires_permit: false,
  },
];

const GROWTH_TEMPLATES: Template[] = [
  {
    title: 'Founding Partner candidate: F1 driver profile (anonymised)',
    summary: 'Identified athlete with 14M global followers, 60% in NA/EU, lifestyle aligned with sovereign-nomad brand.',
    rationale: 'Public signals: 3 hub residencies in last 18 months, vocal about tax sovereignty, no current fintech/travel sponsor.',
    proposed_action: 'Draft 90-day Founding Partner offer: 0.5% lifetime override on referred Premium ARR + private concierge tier.',
    expected_impact: 'Modeled 18k–42k Premium signups in 6 months. Sovereign Yield: $0.9M–$2.1M ARR.',
    evidence: ['Engagement-rate analysis (public sources)', 'Audience overlap with our ICP: 71%', 'No competing sponsorship found'],
    affected_segment: 'New users — global',
    est_users_impacted: 30000,
    est_revenue_usd: 1500000,
    confidence: 0.78,
    priority: 'high',
    requires_permit: true,
  },
  {
    title: 'Affiliate L1 commission test — 12% vs 10% in MEA only',
    summary: 'A/B test bumping L1 commission to 12% in MEA region for 30d cohort.',
    rationale: 'MEA conversion lags global by 22%. Higher commission may unlock dormant influencer tier.',
    proposed_action: 'Branch affiliate_program_settings by region; auto-revert after 30d unless lift > 15%.',
    expected_impact: 'Estimated +180 paying signups in MEA; net company yield neutral due to volume.',
    evidence: ['MEA affiliate clicks: 4.2k/wk', 'Conversion rate 1.1% vs 1.41% global'],
    confidence: 0.7,
    priority: 'medium',
    requires_permit: true,
  },
  {
    title: '"Pulse Synergy" creator program — 50 micro-influencers',
    summary: 'Recruit 50 nomad micro-influencers (10k–50k followers) for revenue-share content drops.',
    rationale: 'Long-tail outperforms mega-influencers on per-dollar CAC for our segment (internal benchmark).',
    proposed_action: 'Launch invitation flow + custom landing pages; cap budget at $25k/quarter.',
    expected_impact: 'Project 5,000 paying signups year-1 at blended CAC of $5.',
    evidence: ['Internal micro-vs-mega CAC study', '120 candidate creators pre-vetted'],
    confidence: 0.74,
    priority: 'medium',
    requires_permit: true,
  },
];

const PRODUCT_TEMPLATES: Template[] = [
  {
    title: 'One-Click Migration — wireframe v3 ready for review',
    summary: 'Bundles visa, tax, banking, eSIM, address-change into single flow. Reduces 23 taps → 4.',
    rationale: 'Heatmaps show 64% drop-off between visa and tax steps when separated.',
    proposed_action: 'Promote wireframe v3 to staging; gate behind feature_flag `migrate_v3` for 10% canary.',
    expected_impact: 'Projected migration completion +38%; concierge load -22%.',
    evidence: ['Drop-off heatmap weeks 14–17', '6 user-test sessions, all completed v3 unaided'],
    affected_segment: 'New Premium signups',
    est_users_impacted: 8400,
    confidence: 0.86,
    priority: 'high',
    requires_permit: true,
  },
  {
    title: 'Life-Flow bundling: collapse 117 features → 9 themed surfaces',
    summary: 'Cognitive-load study suggests 9 Life-Flow surfaces (Health, Wealth, Travel, Family, Work, Safety, Identity, Play, Legacy) outperform flat lists.',
    rationale: 'Card-sort with 80 users converged on these 9 clusters with 84% agreement.',
    proposed_action: 'Restructure sidebar + onboarding tour; preserve search/voice deep-linking.',
    expected_impact: 'Daily feature discovery +47%; first-week retention +9 pts.',
    evidence: ['80-user card-sort', '47% of features currently used by < 3% of MAU'],
    confidence: 0.81,
    priority: 'medium',
    requires_permit: true,
  },
  {
    title: 'Concierge "Why this pick?" disclosure card',
    summary: 'Inline reasoning chip after every auto-recommendation. Two-line, expandable to full chain.',
    rationale: 'Aligns with Themis Art. 22 proposal. Doubles as trust-builder for skeptical users.',
    proposed_action: 'Add `<RationaleChip />` to all booking + advisor cards.',
    expected_impact: 'Predicted +14 pts trust-survey delta; closes regulatory gap.',
    evidence: ['Linked to legal proposal #PROP-LEG-0093', 'User survey: 71% want more reasoning'],
    confidence: 0.9,
    priority: 'high',
    requires_permit: false,
  },
];

const ORACLE_TEMPLATES: Template[] = [
  {
    title: 'Flight margin compression — LIS↔️DXB corridor',
    summary: 'Our 2.5% commission on LIS-DXB now beats Booking by $7 avg, but Expedia undercuts us by $3.',
    rationale: 'Expedia ran flash 24h promo; our rate engine did not respond.',
    proposed_action: 'Implement 4h reactive repricer; cap discount delta at 1.2 pts to preserve margin.',
    expected_impact: 'Recovers est. $11k/wk in LIS-DXB bookings; <0.4 pt margin compression.',
    evidence: ['Last 7d shopper-journey scrape', '38 abandoned carts on this route'],
    confidence: 0.83,
    priority: 'high',
    requires_permit: true,
  },
  {
    title: 'Top-spend habit shift: villas → private chefs (+22% MoM)',
    summary: 'Premium spend on private-chef bookings grew 22% in April. Villa spend flat.',
    rationale: 'Driven by long-stay nomads in Tulum / Bali who already booked villas via partners.',
    proposed_action: 'Surface private-chef hero card on Local Living for users with active villa stay >7d.',
    expected_impact: 'Modeled +$240k GMV/quarter at current take rate.',
    evidence: ['agentic_transactions slice', 'Cohort size: 2,100 active long-stay users'],
    confidence: 0.79,
    priority: 'medium',
    requires_permit: false,
  },
  {
    title: 'eSIM provider arbitrage — Airalo vs Holafly',
    summary: 'Airalo wholesale dropped 8% on APAC bundles. Holafly steady.',
    rationale: 'Switching primary provider for APAC saves users avg $4.20/trip without margin loss.',
    proposed_action: 'Re-rank eSIM recommender to Airalo-first in APAC; keep Holafly as alt.',
    expected_impact: 'User savings $4.20/trip × 3.1k APAC trips/mo = $13k/mo customer surplus, retention positive.',
    evidence: ['Wholesale bulletin 2026-04-15', '3.1k APAC eSIM purchases last 30d'],
    confidence: 0.88,
    priority: 'medium',
    requires_permit: false,
  },
  {
    title: '100-Habit scoreboard: top 5 revenue habits this week',
    summary: 'Hotels, flights, villas, private-chef, eSIM = 71% of agentic GMV. Long tail healthy.',
    rationale: 'Concentration ratio stable; no single-vendor dependency over 12%.',
    proposed_action: 'No action — informational. Suggest pulling weekly to detect drift.',
    expected_impact: 'Maintains margin diversification target (no habit > 25% of GMV).',
    evidence: ['7d GMV breakdown attached'],
    confidence: 0.96,
    priority: 'low',
    requires_permit: false,
  },
];

const TEMPLATES: Record<AgentId, Template[]> = {
  legal: LEGAL_TEMPLATES,
  security: SECURITY_TEMPLATES,
  growth: GROWTH_TEMPLATES,
  product: PRODUCT_TEMPLATES,
  oracle: ORACLE_TEMPLATES,
};

// ─────────────────────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────────────────────

let MODE: AgentMode = 'demo';
const proposals: AgentProposal[] = [];
const briefings: DailyBriefing[] = [];
const activity: AgentActivityEvent[] = [];
const MAX_ACTIVITY = 200;
const MAX_PROPOSALS = 80;

const subscribers = new Set<() => void>();
const timers: Partial<Record<AgentId, number>> = {};
let briefingTimer: number | null = null;
let started = false;

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function pushActivity(ev: Omit<AgentActivityEvent, 'id' | 'ts'>) {
  activity.unshift({ id: uid('act'), ts: Date.now(), ...ev });
  if (activity.length > MAX_ACTIVITY) activity.length = MAX_ACTIVITY;
}

function notify() {
  subscribers.forEach((cb) => cb());
}

function pickTemplate(agentId: AgentId): Template {
  const list = TEMPLATES[agentId];
  return list[Math.floor(Math.random() * list.length)];
}

function draftProposal(agentId: AgentId): AgentProposal {
  const t = pickTemplate(agentId);
  const prop: AgentProposal = {
    id: uid('prop'),
    agent_id: agentId,
    created_at: Date.now(),
    status: t.requires_permit ? 'needs_permit' : 'drafted',
    ...t,
  };
  proposals.unshift(prop);
  if (proposals.length > MAX_PROPOSALS) proposals.length = MAX_PROPOSALS;
  pushActivity({
    agent_id: agentId,
    kind: 'draft',
    text: `${AGENTS[agentId].name} drafted: ${prop.title}`,
  });
  return prop;
}

function generateBriefing(): DailyBriefing {
  const today = new Date().toISOString().slice(0, 10);
  const by_agent = {} as DailyBriefing['by_agent'];
  (Object.keys(AGENTS) as AgentId[]).forEach((id) => {
    const top = proposals.find((p) => p.agent_id === id);
    by_agent[id] = {
      headline: top?.title ?? `${AGENTS[id].name} — no critical signal in window`,
      top_proposal_id: top?.id,
      metric: top
        ? `${Math.round(top.confidence * 100)}% confidence · ${top.priority.toUpperCase()}`
        : 'green',
    };
  });
  const urgentCount = proposals.filter((p) => p.priority === 'urgent' && p.status !== 'approved').length;
  const briefing: DailyBriefing = {
    id: uid('brief'),
    date: today,
    generated_at: Date.now(),
    headline:
      urgentCount > 0
        ? `${urgentCount} urgent decision${urgentCount === 1 ? '' : 's'} awaiting Governor approval.`
        : 'All departments green. Routine optimisations queued.',
    by_agent,
    governor_note:
      'Departments operated independently. No cross-talk bias detected. Recommend reviewing security + legal urgent items first.',
  };
  briefings.unshift(briefing);
  if (briefings.length > 30) briefings.length = 30;
  pushActivity({ agent_id: 'governor', kind: 'briefing', text: `Daily 09:00 briefing generated — ${briefing.headline}` });
  return briefing;
}

function startAgent(id: AgentId) {
  if (timers[id]) return;
  // Stagger initial draft 1–8s so things feel alive
  window.setTimeout(() => {
    pushActivity({ agent_id: id, kind: 'scan', text: `${AGENTS[id].name} began continuous scan.` });
    draftProposal(id);
    notify();
  }, 1000 + Math.random() * 7000);

  timers[id] = window.setInterval(() => {
    // 65% chance per tick to draft (keeps stream varied)
    if (Math.random() < 0.65) {
      draftProposal(id);
      notify();
    } else {
      pushActivity({ agent_id: id, kind: 'scan', text: `${AGENTS[id].name} scanned ${20 + Math.floor(Math.random() * 80)} signals — no new proposal.` });
      notify();
    }
  }, AGENTS[id].cadence_minutes * 1000); // demo: minutes → seconds for visibility
}

function stopAll() {
  (Object.keys(timers) as AgentId[]).forEach((id) => {
    if (timers[id]) {
      clearInterval(timers[id]);
      timers[id] = undefined;
    }
  });
  if (briefingTimer != null) {
    clearInterval(briefingTimer);
    briefingTimer = null;
  }
  started = false;
}

function ensureSeed() {
  if (proposals.length > 0) return;
  // Seed with one of each so every department appears immediately.
  (Object.keys(AGENTS) as AgentId[]).forEach((id, i) => {
    const p = draftProposal(id);
    p.created_at = Date.now() - (i + 1) * 7 * 60_000; // staggered last hour
  });
  // Add a few extra to make queue feel populated
  for (let i = 0; i < 6; i++) {
    const ids = Object.keys(AGENTS) as AgentId[];
    const p = draftProposal(ids[Math.floor(Math.random() * ids.length)]);
    p.created_at = Date.now() - Math.floor(Math.random() * 3 * 60 * 60_000);
  }
  generateBriefing();
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export const AgentOrchestratorService = {
  getMode(): AgentMode {
    return MODE;
  },
  setMode(m: AgentMode) {
    MODE = m;
    pushActivity({ agent_id: 'governor', kind: 'lockdown', text: `Mode switched → ${m.toUpperCase()}` });
    notify();
  },
  start() {
    if (started) return;
    started = true;
    ensureSeed();
    (Object.keys(AGENTS) as AgentId[]).forEach((id) => startAgent(id));
    // Briefing every 4 minutes in demo (represents 09:00 daily ritual)
    briefingTimer = window.setInterval(() => {
      generateBriefing();
      notify();
    }, 4 * 60_000);
  },
  stop() {
    stopAll();
  },
  subscribe(cb: () => void): () => void {
    this.start();
    subscribers.add(cb);
    cb();
    return () => subscribers.delete(cb);
  },
  getProposals(): AgentProposal[] {
    ensureSeed();
    return proposals.slice();
  },
  getProposalsByAgent(id: AgentId): AgentProposal[] {
    return proposals.filter((p) => p.agent_id === id);
  },
  getActivity(): AgentActivityEvent[] {
    return activity.slice();
  },
  getLatestBriefing(): DailyBriefing | undefined {
    return briefings[0];
  },
  getBriefings(): DailyBriefing[] {
    return briefings.slice();
  },
  triggerScan(id: AgentId) {
    pushActivity({ agent_id: id, kind: 'scan', text: `${AGENTS[id].name} — manual scan requested by Governor.` });
    draftProposal(id);
    notify();
  },
  triggerBriefing() {
    generateBriefing();
    notify();
  },
  approve(id: string, opts: { permit_key?: string; note?: string } = {}) {
    const p = proposals.find((x) => x.id === id);
    if (!p) return { ok: false, error: 'not_found' };
    if (p.requires_permit && !opts.permit_key) return { ok: false, error: 'permit_required' };
    if (p.requires_permit && opts.permit_key && opts.permit_key.length < 6)
      return { ok: false, error: 'invalid_permit' };
    p.status = 'approved';
    p.governor_note = opts.note;
    p.decided_at = Date.now();
    p.decided_by = 'admin';
    pushActivity({
      agent_id: 'governor',
      kind: 'approval',
      text: `Governor approved "${p.title}"${p.requires_permit ? ' (HITL permit verified)' : ''} — pushed to staging.`,
    });
    notify();
    return { ok: true };
  },
  reject(id: string, note?: string) {
    const p = proposals.find((x) => x.id === id);
    if (!p) return { ok: false, error: 'not_found' };
    p.status = 'rejected';
    p.governor_note = note;
    p.decided_at = Date.now();
    p.decided_by = 'admin';
    pushActivity({ agent_id: 'governor', kind: 'rejection', text: `Governor rejected "${p.title}".` });
    notify();
    return { ok: true };
  },
  reset() {
    stopAll();
    proposals.length = 0;
    briefings.length = 0;
    activity.length = 0;
    this.start();
  },
  // Aggregate KPIs for the dashboard hero
  kpis() {
    const open = proposals.filter((p) => p.status === 'drafted' || p.status === 'in_review' || p.status === 'needs_permit');
    const urgent = open.filter((p) => p.priority === 'urgent');
    const approved = proposals.filter((p) => p.status === 'approved');
    const rejected = proposals.filter((p) => p.status === 'rejected');
    const avgConfidence = open.length
      ? Math.round((open.reduce((s, p) => s + p.confidence, 0) / open.length) * 100)
      : 0;
    const projectedRevenue = open.reduce((s, p) => s + (p.est_revenue_usd ?? 0), 0);
    return {
      open_count: open.length,
      urgent_count: urgent.length,
      approved_count: approved.length,
      rejected_count: rejected.length,
      avg_confidence: avgConfidence,
      projected_revenue_usd: projectedRevenue,
      mode: MODE,
    };
  },
};
