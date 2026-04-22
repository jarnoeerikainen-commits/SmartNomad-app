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
  tier: AgentTier;         // grouping for the council UI
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
  // ─── ORIGINAL 5 — Sovereign Back-Office Protocol ───
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
    tier: 'core',
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
    tier: 'core',
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
    tier: 'core',
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
    tier: 'core',
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
    tier: 'core',
  },

  // ─── TIER 1 — Highest leverage ───
  atlas: {
    id: 'atlas',
    name: 'Atlas',
    role: 'Destination & Supply Intelligence Lead',
    team_label: 'Cartography & Curation',
    emoji: '🧭',
    color_token: 'hsl(173 80% 40%)', // teal
    mission: 'Continuously score 5,000+ cities on safety, cost, weather, visa, internet, vibe. Detect rising hubs 6 months early.',
    daily_task: 'Refresh Explore Local Life directories, flag stale venues, propose new city launches.',
    output_label: 'Destination Intelligence Report',
    goal: 'Own travel curation. Never let a listing rot.',
    constraints: ['read-only on directories', 'propose new listings only', 'permit required to launch new city'],
    live_endpoint: 'agent-atlas',
    cadence_minutes: 22,
    tier: 'tier1',
  },
  midas: {
    id: 'midas',
    name: 'Midas',
    role: 'Pricing & Yield Optimizer',
    team_label: 'Marketplace Margin Engine',
    emoji: '💰',
    color_token: 'hsl(45 100% 51%)', // saffron gold
    mission: 'Real-time price elasticity per route/hotel/city/persona. Watch Booking/Expedia/Hopper price gaps live.',
    daily_task: 'A/B test commission, surge concierge premium, propose bundles. Detect when SuperNomad loses on price.',
    output_label: 'Yield Optimisation Brief',
    goal: 'Maximise marketplace margin while staying user-competitive.',
    constraints: ['read-only on pricing engine', 'cannot trigger live price change', 'permit required for repricing'],
    live_endpoint: 'agent-midas',
    cadence_minutes: 18,
    tier: 'tier1',
  },
  echo: {
    id: 'echo',
    name: 'Echo',
    role: 'Sentiment & Retention Lead',
    team_label: 'Customer Success AI',
    emoji: '❤️',
    color_token: 'hsl(330 75% 60%)', // rose
    mission: 'Read every concierge convo, support ticket, app review, social mention. Predict churn 14d early.',
    daily_task: 'Detect moments of delight + friction per user. Queue earned re-engagement nudges.',
    output_label: 'Retention Save Queue',
    goal: 'Insurance against silent churn. Lift NPS quarterly.',
    constraints: ['read-only on conversations', 'no auto-messages', 'permit required for save-action campaigns'],
    live_endpoint: 'agent-echo',
    cadence_minutes: 28,
    tier: 'tier1',
  },

  // ─── TIER 2 — Operating depth ───
  sentinel: {
    id: 'sentinel',
    name: 'Sentinel',
    role: 'Crisis & Disruption Response',
    team_label: 'Global Disruption Watch',
    emoji: '🌪️',
    color_token: 'hsl(15 90% 55%)', // alert orange
    mission: 'Monitor flight strikes, volcanoes, hurricanes, coups, FX shocks, airport closures 24/7.',
    daily_task: 'Auto-draft re-routing options + concierge scripts before users notice the problem.',
    output_label: 'Disruption Response Pack',
    goal: 'The "we saved you in Bangkok during the floods" lifetime-loyalty story.',
    constraints: ['read-only on travel inventory', 'no auto-rebooking', 'permit required to push user alerts'],
    live_endpoint: 'agent-sentinel',
    cadence_minutes: 15,
    tier: 'tier2',
  },
  muse: {
    id: 'muse',
    name: 'Muse',
    role: 'Content & SEO Engine',
    team_label: 'Programmatic Acquisition',
    emoji: '🎨',
    color_token: 'hsl(260 75% 65%)', // lavender
    mission: 'Generate city guides, neighborhood deep-dives, persona itineraries at scale. Own programmatic SEO.',
    daily_task: 'Draft "best coworking in Lisbon for crypto founders"-style pages. Repurpose user wins as social proof.',
    output_label: 'Content & SEO Briefs',
    goal: 'Drive organic CAC to zero. Compound traffic monthly.',
    constraints: ['drafts only', 'no auto-publish', 'permit required to publish to public site'],
    live_endpoint: 'agent-muse',
    cadence_minutes: 32,
    tier: 'tier2',
  },
  praxis: {
    id: 'praxis',
    name: 'Praxis',
    role: 'Partner & Inventory Operations',
    team_label: 'Supplier Health Watch',
    emoji: '🔗',
    color_token: 'hsl(190 85% 50%)', // cyan
    mission: 'Watch Amadeus/Sabre/Booking/Skyscanner/Duffel API health, latency, fill rates, commission shorts.',
    daily_task: 'Negotiate + renegotiate rate contracts. Draft the email — Governor approves.',
    output_label: 'Supplier Operations Report',
    goal: 'Marketplace supply ops decides margin. Defend it daily.',
    constraints: ['read-only on supplier APIs', 'drafts contract emails only', 'permit required for contract send'],
    live_endpoint: 'agent-praxis',
    cadence_minutes: 26,
    tier: 'tier2',
  },

  // ─── TIER 3 — Optimization & long-term ───
  forge: {
    id: 'forge',
    name: 'Forge',
    role: 'Experimentation & Personalization Lead',
    team_label: 'A/B/n Test Lab',
    emoji: '⚗️',
    color_token: 'hsl(140 70% 50%)', // lime
    mission: 'Owns A/B/n testing engine across UI, copy, pricing, concierge prompts. 50+ persona segments auto-tuned.',
    daily_task: 'Report weekly lift to Governor. Auto-stop losing variants, scale winners.',
    output_label: 'Experimentation Lift Report',
    goal: 'Compound conversion lift forever.',
    constraints: ['read-only on production traffic', 'sandbox tests only', 'permit required to scale variant >25%'],
    live_endpoint: 'agent-forge',
    cadence_minutes: 36,
    tier: 'tier3',
  },
  concord: {
    id: 'concord',
    name: 'Concord',
    role: 'Community & Trust AI',
    team_label: 'Pulse / Vibe Moderation',
    emoji: '🤝',
    color_token: 'hsl(220 80% 60%)', // royal blue
    mission: 'Real-time moderation of Pulse / Vibe in 13 languages. Detect scams, fake listings, bad actors before users report.',
    daily_task: 'Surface super-connectors who deserve VIP perks. Maintain reputation graph.',
    output_label: 'Community Health Brief',
    goal: 'Trust is the moat. Defend it 24/7.',
    constraints: ['can flag, cannot ban without permit', 'read-only on reputation graph', 'permit required for user action'],
    live_endpoint: 'agent-concord',
    cadence_minutes: 21,
    tier: 'tier3',
  },
  verdant: {
    id: 'verdant',
    name: 'Verdant',
    role: 'Sustainability & ESG Lead',
    team_label: 'Carbon & Compliance',
    emoji: '🌱',
    color_token: 'hsl(150 65% 45%)', // forest green
    mission: 'Track carbon per booking, suggest offsets + lower-impact alternatives. Critical for EU CSRD + Gen-Z/HNW segment.',
    daily_task: 'Report ESG metrics for investor decks. Surface carbon-aware booking options.',
    output_label: 'ESG & Carbon Report',
    goal: 'EU compliance + values-aligned acquisition.',
    constraints: ['read-only on bookings', 'recommends only', 'permit required for offset auto-purchase'],
    live_endpoint: 'agent-verdant',
    cadence_minutes: 50,
    tier: 'tier3',
  },
  atlas_ltv: {
    id: 'atlas_ltv',
    name: 'Atlas-LTV',
    role: 'Lifetime Value & Wealth Lead',
    team_label: 'HNW Whale Operations',
    emoji: '💎',
    color_token: 'hsl(310 70% 55%)', // magenta
    mission: 'For HNW segment only — track each whale\'s lifetime spend, life events, family graph.',
    daily_task: 'Suggest when to introduce new vertical (yacht, jet, real estate, school). Pair with Hermes for white-glove growth.',
    output_label: 'Whale Pipeline Report',
    goal: 'Compound HNW LTV. Anticipate the next vertical they\'ll want.',
    constraints: ['read-only on personal graph', 'no auto-outreach', 'permit required for white-glove offer'],
    live_endpoint: 'agent-atlas-ltv',
    cadence_minutes: 45,
    tier: 'tier3',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TIER GROUPING (for UI organisation)
// ─────────────────────────────────────────────────────────────────────────────
export const TIER_LABELS: Record<AgentTier, { label: string; tagline: string }> = {
  core:  { label: 'Core Council',           tagline: 'Sovereign Back-Office Protocol' },
  tier1: { label: 'Tier 1 — Strategic',     tagline: 'Curation · Pricing · Retention' },
  tier2: { label: 'Tier 2 — Operations',    tagline: 'Crisis · Content · Supply' },
  tier3: { label: 'Tier 3 — Compounding',   tagline: 'Experiments · Trust · ESG · Whales' },
};

export const AGENTS_BY_TIER: Record<AgentTier, AgentId[]> = {
  core:  ['legal', 'security', 'growth', 'product', 'oracle'],
  tier1: ['atlas', 'midas', 'echo'],
  tier2: ['sentinel', 'muse', 'praxis'],
  tier3: ['forge', 'concord', 'verdant', 'atlas_ltv'],
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

// ═══════════════════════════════════════════════════════════════════════════
// TIER 1 — Atlas, Midas, Echo
// ═══════════════════════════════════════════════════════════════════════════

const ATLAS_TEMPLATES: Template[] = [
  {
    title: 'Rising hub detected: Tirana climbed 38% in nomad-density signal',
    summary: 'Albania\'s capital jumped from rank #87 → #54 in 21 days. Cost-of-living + 1yr visa-free + new fiber rollout driving inflows.',
    rationale: 'Cross-source signal: 14% rise in coworking listings, 22% rise in mid-term rentals, +9 mentions in Nomadlist top-100 in last 14d.',
    proposed_action: 'Promote Tirana to "Featured Hub" tier in Explore Local Life. Greenlight Atlas to draft 6 venue scouts.',
    expected_impact: '~3,200 new sessions/mo on Tirana surfaces; first-mover SEO advantage vs Booking generic page.',
    evidence: ['Nomadlist trend delta', 'Internal coworking scrape +14%', 'Long-term rental listings +22%'],
    affected_segment: 'Explore Local Life — EU/Balkan-curious nomads',
    est_users_impacted: 3200,
    confidence: 0.84, priority: 'high', requires_permit: true,
  },
  {
    title: '47 stale venues in Lisbon directory — auto-deactivation queue',
    summary: 'Last verification > 90 days ago; 23 returned 404, 14 closed permanently, 10 changed name/owner.',
    rationale: 'Curation rot is the #1 reason directory apps die. Atlas verified via 3-source crosscheck.',
    proposed_action: 'Soft-archive 47 entries; surface 14 already-scouted replacements awaiting review.',
    expected_impact: 'Restores Lisbon directory trust score from 78% → 96%. Zero user impact during transition.',
    evidence: ['3-source verification log', '47 venues flagged stale', '14 verified replacements ready'],
    confidence: 0.97, priority: 'medium', requires_permit: false,
  },
  {
    title: 'New city launch proposal: Da Nang, Vietnam',
    summary: 'Atlas scoring matrix puts Da Nang #11 globally for nomad fit. We have 0 directory coverage today.',
    rationale: 'Internet 380Mbps median, $1,400/mo all-in, 90d visa-free for 25 nationalities, low crime, growing community.',
    proposed_action: 'Launch full Da Nang module: 60 venues, 3 coworking, 8 wellness, weather + visa pages.',
    expected_impact: 'Adds ~2.1k addressable MAU within 6mo. Differentiates vs Nomadlist (their Da Nang page = thin).',
    evidence: ['Atlas score 8.7/10', 'Numbeo cost data', 'Vietnam Imigrasi visa list 2026'],
    confidence: 0.81, priority: 'high', requires_permit: true,
  },
  {
    title: 'Visa friction alert — Indonesia tightened 30d visa-on-arrival',
    summary: 'Indonesia removed VOA for 14 nationalities effective May 1. Affects 1,840 Premium users with Bali plans.',
    rationale: 'Imigrasi notice 2026-04-18; concierge has not updated routing yet.',
    proposed_action: 'Push proactive concierge alert; recalculate Bali itinerary recommendations for affected nationalities.',
    expected_impact: 'Prevents ~140 stranded-at-airport incidents this quarter.',
    evidence: ['Imigrasi notice 2026-04-18', '1,840 affected Premium users'],
    confidence: 0.93, priority: 'urgent', requires_permit: true,
  },
];

const MIDAS_TEMPLATES: Template[] = [
  {
    title: 'Booking undercut on LIS-MAD by 4.2% — automated repricer recommendation',
    summary: 'Booking running flash promo. We lost 23 carts on this route in 18h. Margin headroom available.',
    rationale: 'Our take rate 2.5%; reducing to 1.8% for 48h fully reclaims competitiveness with negligible margin loss.',
    proposed_action: 'Apply 0.7pt commission compression on LIS-MAD until Booking promo ends or 72h cap.',
    expected_impact: 'Recover ~$8.4k in bookings; <$280 net margin loss.',
    evidence: ['Shopper-journey scrape last 24h', '23 abandoned carts on this route', 'Booking promo banner observed'],
    affected_segment: 'Iberia corridor users',
    est_revenue_usd: 8400,
    confidence: 0.88, priority: 'high', requires_permit: true,
  },
  {
    title: 'Concierge premium surge opportunity — Friday 5-7pm UTC',
    summary: 'Demand for concierge sessions spikes 3.4x Friday evening UTC. Capacity bottleneck = revenue left on table.',
    rationale: 'Weekly elasticity test: users tolerate +18% surge in this window with 91% conversion retained.',
    proposed_action: 'Enable +18% surge tier Fri 17:00-19:00 UTC; clear messaging "Peak Hour Concierge".',
    expected_impact: 'Adds est. $3.1k/wk Premium revenue with no capacity addition.',
    evidence: ['12-week elasticity test', 'Conversion retained at +18%: 91%', 'Capacity utilization 98% in window'],
    est_revenue_usd: 12400,
    confidence: 0.86, priority: 'medium', requires_permit: true,
  },
  {
    title: 'Bundle test: Flight + eSIM + Lounge — 14% attach uplift',
    summary: 'Users who buy a flight currently attach eSIM 11% of the time. Bundling at -8% list adds 14pp.',
    rationale: 'Cross-elasticity model from 4-week test. Net margin per booking +$3.20.',
    proposed_action: 'Promote bundle as default on checkout for flights >$300.',
    expected_impact: 'Modeled +$48k GMV/mo; +$11k net margin.',
    evidence: ['4-week bundle A/B', 'Attach rate uplift +14pp', 'Net margin/booking +$3.20'],
    confidence: 0.82, priority: 'high', requires_permit: true,
  },
  {
    title: 'Hopper price-prediction parity gap — closing window',
    summary: 'Hopper now beats us on prediction accuracy by 2.1 days for transatlantic routes.',
    rationale: 'Their 2026 model release. We can close gap by ingesting 90 more days of carrier inventory data.',
    proposed_action: 'Authorize Pythia + Midas joint task: ingest extra inventory window, retrain price model.',
    expected_impact: 'Restore parity in 14 days. Defends premium positioning on flight predictor.',
    evidence: ['Hopper Q1 model notes', 'Internal prediction MAE comparison'],
    confidence: 0.74, priority: 'medium', requires_permit: true,
  },
];

const ECHO_TEMPLATES: Template[] = [
  {
    title: '47 Premium users in 14-day churn window — earned re-engagement queue',
    summary: 'Echo predicts churn for 47 Premium accounts based on session decay + concierge sentiment drop.',
    rationale: 'Hybrid signal: 73% drop in WAU + sentiment score -0.4 in last concierge convo. Historical save rate at this window: 38%.',
    proposed_action: 'Approve earned re-engagement: personal note from Concierge + 1mo wallet credit + curated city pick.',
    expected_impact: 'Estimated saves: 18 of 47 = $1,074 ARR retained + reputation halo.',
    evidence: ['47 accounts in red zone', 'Sentiment timeseries', 'Historical 38% save rate this window'],
    affected_segment: 'Premium — at-risk cohort',
    est_users_impacted: 47, est_revenue_usd: 1074,
    confidence: 0.83, priority: 'urgent', requires_permit: true,
  },
  {
    title: 'Delight moment detected — 220 users mentioned "saved my trip" in concierge',
    summary: 'Mining last 30d concierge logs surfaced 220 unprompted gratitude mentions. 18 are quote-worthy with consent.',
    rationale: 'Social proof gold. Echo extracted with PII-safe redaction.',
    proposed_action: 'Pass 18 quotes to Muse for testimonial wall + investor deck. Auto-thank these users via concierge.',
    expected_impact: 'Free testimonial corpus; ~$8k saved on social-proof harvesting.',
    evidence: ['220 mentions matched', 'Sentiment confirmed positive', 'PII-redaction passed'],
    confidence: 0.91, priority: 'medium', requires_permit: false,
  },
  {
    title: 'Friction hotspot — visa step in Onboarding losing 31% to drop-off',
    summary: 'Mid-funnel sentiment turns negative when users hit visa-residency comparison wall.',
    rationale: 'Heatmap + sentiment cross-ref. Same friction repeatedly mentioned in support tickets.',
    proposed_action: 'Pass to Iris: simplify visa step to 3 questions max; defer advanced flow to post-signup.',
    expected_impact: 'Modeled +12pp signup completion. Linked to product proposal.',
    evidence: ['Heatmap weeks 14-17', '38 tickets quote same step', 'Sentiment delta -0.3'],
    confidence: 0.87, priority: 'high', requires_permit: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TIER 2 — Sentinel, Muse, Praxis
// ═══════════════════════════════════════════════════════════════════════════

const SENTINEL_TEMPLATES: Template[] = [
  {
    title: 'CDG ground-staff strike confirmed — 320 users affected in next 72h',
    summary: 'Strike notice filed; 30% flight cancellation rate expected May 2-4. We have 320 users with CDG itineraries.',
    rationale: 'Verified via airline ops feed + French CGT public notice + 3 corroborating sources.',
    proposed_action: 'Push proactive concierge alerts with rebooking options pre-loaded. Coordinate with Praxis on backup inventory.',
    expected_impact: 'Saves est. $44k in user disruption costs; "saved by SuperNomad" stories x320.',
    evidence: ['CGT strike notice', 'Airline ops feed', '320 user itineraries identified'],
    affected_segment: 'CDG corridor next 72h',
    est_users_impacted: 320,
    confidence: 0.95, priority: 'urgent', requires_permit: true,
  },
  {
    title: 'Mt. Agung volcanic activity — Bali ash advisory active',
    summary: 'Indonesian PVMBG raised alert level. Ngurah Rai possible closure within 48h.',
    rationale: 'Live seismic feed + ash plume satellite data. 84 users currently in Bali, 110 inbound.',
    proposed_action: 'Auto-draft 2 contingency itineraries (Lombok pivot + delay-and-stay). Hold until Governor approves push.',
    expected_impact: 'Pre-positions support before mass disruption hits.',
    evidence: ['PVMBG bulletin', 'Satellite ash imagery', '84 users in-region + 110 inbound'],
    confidence: 0.79, priority: 'urgent', requires_permit: true,
  },
  {
    title: 'TRY flash devaluation -7% in 4h — affects user balances',
    summary: '11 users hold TRY-denominated agentic balances. Real-time hedge or convert recommendation queued.',
    rationale: 'CB intervention failed; spread widening. Window to act: ~6h.',
    proposed_action: 'Notify affected users; offer auto-convert to USDC at locked rate (subject to approval).',
    expected_impact: 'Caps user FX exposure at ~2% loss vs ~9% projected.',
    evidence: ['TRY/USD timeseries', '11 user balances flagged', 'CB intervention timeline'],
    confidence: 0.84, priority: 'high', requires_permit: true,
  },
];

const MUSE_TEMPLATES: Template[] = [
  {
    title: 'Programmatic SEO: "Best coworking in [city] for [persona]" — 240 page pack ready',
    summary: 'Generated 240 SEO pages: 60 cities × 4 personas (crypto founders, designers, parents, nurses).',
    rationale: 'Internal traffic model: 40-80 organic sessions/page/mo at 6mo. CAC equivalent $0.',
    proposed_action: 'Stage 240 pages behind /guides/. Submit to Search Console after Governor sign-off.',
    expected_impact: 'Modeled 12k-25k organic sessions/mo by month 6. CAC saved: ~$80k/mo.',
    evidence: ['Keyword opportunity report', 'Competitor coverage gap analysis', 'Programmatic SEO playbook v2'],
    affected_segment: 'Organic acquisition',
    est_users_impacted: 18000,
    confidence: 0.81, priority: 'high', requires_permit: true,
  },
  {
    title: 'City guide refresh: Lisbon — 2.3x search volume since Q1',
    summary: 'Lisbon "digital nomad" search +130% YoY. Our existing page is 11 months stale.',
    rationale: 'Google Trends + Search Console. Refresh timing optimal pre-summer.',
    proposed_action: 'Regenerate with current visa rules, refreshed venues from Atlas, 2026 cost data.',
    expected_impact: 'Regain top-3 SERP position; +4k organic sessions/mo.',
    evidence: ['Google Trends data', 'GSC impressions/clicks delta', 'Current page age 11mo'],
    confidence: 0.88, priority: 'medium', requires_permit: false,
  },
  {
    title: 'User-win social repurpose — 12 anonymized stories ready',
    summary: 'Echo flagged 12 strong user wins. Muse drafted 12 short-form posts (LinkedIn + IG carousel format).',
    rationale: 'All anonymized + consented. Publishing cadence 2/wk for 6 weeks.',
    proposed_action: 'Approve content pack for marketing pipeline.',
    expected_impact: 'Estimated 80-200k impressions; 600 site visits/post.',
    evidence: ['12 source stories', 'Drafts for LinkedIn + IG', 'Consent log attached'],
    confidence: 0.86, priority: 'medium', requires_permit: true,
  },
];

const PRAXIS_TEMPLATES: Template[] = [
  {
    title: 'Amadeus latency p95 degraded to 1,840ms (target 600ms)',
    summary: 'Amadeus search latency 3x baseline for 6h. Affects flight search abandonment.',
    rationale: 'Pattern matches their Q1 outage signature. Our fallback to Sabre not auto-routing.',
    proposed_action: 'Enable Sabre primary for 24h on affected routes; file ticket with Amadeus support.',
    expected_impact: 'Restore search responsiveness; recover ~$6k in lost flight conversions.',
    evidence: ['Latency timeseries', 'Abandonment rate +18%', 'Sabre headroom verified'],
    confidence: 0.92, priority: 'urgent', requires_permit: true,
  },
  {
    title: 'Booking commission short-paid Q1 — invoice $14,200',
    summary: 'Reconciliation against Praxis ledger shows Booking under-paid commission on 240 stays.',
    rationale: 'Affiliate cookie attribution gap on their side. We have full receipts.',
    proposed_action: 'Send drafted reconciliation invoice + evidence pack. Governor approves send.',
    expected_impact: 'Recovers $14.2k owed. Sets precedent for monthly automated reconciliation.',
    evidence: ['240 stays reconciled', 'Booking commission report Q1', 'Cookie attribution log'],
    est_revenue_usd: 14200,
    confidence: 0.96, priority: 'high', requires_permit: true,
  },
  {
    title: 'Duffel rate parity opportunity — direct vs aggregator',
    summary: 'Duffel offers direct NDC for 8 carriers we currently route via Sabre. Margin uplift 1.4pp.',
    rationale: 'Cuts intermediary; preserves user price. We retain extra margin.',
    proposed_action: 'Negotiate Duffel direct integration; draft contract terms attached.',
    expected_impact: '+1.4pp margin on ~$4M flight GMV/yr = $56k.',
    evidence: ['Duffel NDC carrier list', 'Internal margin model', 'Sabre fee schedule'],
    est_revenue_usd: 56000,
    confidence: 0.78, priority: 'medium', requires_permit: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TIER 3 — Forge, Concord, Verdant, Atlas-LTV
// ═══════════════════════════════════════════════════════════════════════════

const FORGE_TEMPLATES: Template[] = [
  {
    title: 'Concierge greeting variant B winning by +11.4% conversion',
    summary: 'A/B test: "Welcome back, [name]" vs "Where are we going next?" — variant B leads at 99% confidence.',
    rationale: '14-day test, 12,400 sessions per arm. Statistical significance reached.',
    proposed_action: 'Promote variant B to 100%. Auto-archive variant A.',
    expected_impact: '+11.4% session-to-booking conversion = est. +$28k/mo GMV.',
    evidence: ['12.4k sessions/arm', 'p-value < 0.001', 'No segment regressions'],
    est_revenue_usd: 28000,
    confidence: 0.94, priority: 'high', requires_permit: false,
  },
  {
    title: 'Persona-tuned pricing copy lifts Premium signup +6pp',
    summary: '50-segment test of Premium upsell copy. "Crypto founder" segment responds best to "Hedge your sovereignty" framing.',
    rationale: 'Multi-armed bandit converged after 21 days. Lift sustained across 4 cohorts.',
    proposed_action: 'Lock 50 segment-specific Premium copies. Echo + Forge to monitor decay.',
    expected_impact: '+6pp signup = est. 240 additional Premium/mo.',
    evidence: ['Bandit convergence log', '50 segments × 4 variants', 'Cohort hold-out'],
    confidence: 0.83, priority: 'high', requires_permit: true,
  },
  {
    title: 'Onboarding step ordering test — 3 variants, all winning',
    summary: 'Three new orderings all beat control by 4-9pp completion. Recommend variant 2 for stability.',
    rationale: 'Multivariate test concluded. Variant 2 strongest on retention day-7.',
    proposed_action: 'Promote variant 2 to 100% rollout.',
    expected_impact: '+7pp signup completion = est. 320 more activated users/mo.',
    evidence: ['MVT results', 'Day-7 retention curve', 'Drop-off heatmap'],
    confidence: 0.89, priority: 'medium', requires_permit: false,
  },
];

const CONCORD_TEMPLATES: Template[] = [
  {
    title: '12 fake host listings detected in Vibe — auto-flag for review',
    summary: 'Pattern: stock photos, generic "luxury villa" copy, payment off-platform. 12 listings flagged with 0.94 confidence.',
    rationale: 'Vision + LLM detection cross-checked. None reported by users yet — Concord caught first.',
    proposed_action: 'Soft-hide listings; notify hosts for verification within 48h or permanent removal.',
    expected_impact: 'Prevents est. 30 user scam exposures. Trust score protected.',
    evidence: ['Image-similarity match (stock libraries)', 'Off-platform payment offer', '12 listings flagged'],
    confidence: 0.94, priority: 'urgent', requires_permit: true,
  },
  {
    title: 'Super-connector cohort — 18 users with >40 verified Pulse intros',
    summary: 'Top 1% community connectors identified. They drive 31% of cross-user verified introductions.',
    rationale: 'Reputation-graph analysis. These users deserve recognition + retention investment.',
    proposed_action: 'Approve Super-Connector tier: badge + free Premium + private channel access.',
    expected_impact: 'Reinforces network effect. Modeled +12% Pulse activity uplift.',
    evidence: ['Reputation graph snapshot', '18 candidates verified', 'Intro-attribution data'],
    confidence: 0.86, priority: 'medium', requires_permit: true,
  },
  {
    title: 'Multilingual moderation — Arabic Vibe channel needs human review',
    summary: 'Concord low-confidence (<0.7) on 6 messages in Arabic technical discussion. Risk of misclassification.',
    rationale: 'Edge case: technical jargon + dialect mix. Better to escalate than auto-act.',
    proposed_action: 'Queue 6 messages for human moderator. Add to Concord training corpus post-decision.',
    expected_impact: 'Maintains moderation accuracy. Improves model on next retrain.',
    evidence: ['6 messages flagged', 'Confidence scores 0.61-0.69', 'Dialect identified: MSA + Levantine mix'],
    confidence: 0.71, priority: 'low', requires_permit: false,
  },
];

const VERDANT_TEMPLATES: Template[] = [
  {
    title: 'Q1 carbon report ready — 1,840 tCO2e across all bookings',
    summary: 'Per-booking carbon transparency met. 11% YoY reduction driven by rail-over-flight nudges.',
    rationale: 'Methodology: ICAO + DEFRA factors. Audit-ready for CSRD reporting.',
    proposed_action: 'Approve report for investor deck + EU compliance file.',
    expected_impact: 'CSRD compliance maintained. Differentiator for ESG-aware HNW segment.',
    evidence: ['ICAO/DEFRA methodology', '11% YoY reduction validated', 'Audit trail attached'],
    confidence: 0.95, priority: 'medium', requires_permit: false,
  },
  {
    title: 'Rail-over-flight nudge — Paris/London corridor save 84% CO2',
    summary: 'Eurostar bookings up 28% since nudge launch. Margin neutral. ESG narrative strong.',
    rationale: 'A/B with control group confirms causality. Users appreciate option, don\'t feel pushed.',
    proposed_action: 'Extend nudge to 6 more EU short-haul corridors (BCN-MAD, HAM-BER, etc.).',
    expected_impact: '+~120 tCO2e/mo saved. PR + ESG narrative bonus.',
    evidence: ['28% Eurostar uplift', 'A/B with control', '6-corridor candidate list'],
    confidence: 0.87, priority: 'medium', requires_permit: true,
  },
  {
    title: 'Carbon offset partner audit — 1 of 4 partners flagged for greenwashing risk',
    summary: 'Partner X\'s reforestation claims unverified by independent registry. Risk of regulator scrutiny.',
    rationale: 'CSRD audit trail requires verified-registry-only partners. Cross-checked Verra + Gold Standard.',
    proposed_action: 'Pause Partner X integration; recommend 2 verified alternatives.',
    expected_impact: 'Avoids regulator/PR risk. ~$12k/yr partner fees redirected.',
    evidence: ['Verra registry cross-check', 'Gold Standard listing absence', 'Partner X claims doc'],
    confidence: 0.89, priority: 'high', requires_permit: true,
  },
];

const ATLAS_LTV_TEMPLATES: Template[] = [
  {
    title: 'HNW signal: User #SN-7K2H-4R8M crossed $480k LTV — yacht vertical opportunity',
    summary: 'Whale account: 14 long-stays, 3 jet charters, recent yacht-related concierge query.',
    rationale: 'LTV trajectory + life-event signal (mentioned "summer in Croatia with family"). Window: 14 days.',
    proposed_action: 'Hand to Hermes for white-glove yacht charter offer. Personalized concierge call.',
    expected_impact: 'Yacht GMV potential $80-220k. LTV uplift extends 2 years.',
    evidence: ['LTV trajectory chart', 'Concierge query log', 'Family graph: 4 members + 2 minors'],
    affected_segment: 'HNW Premium — yacht-curious',
    est_revenue_usd: 150000,
    confidence: 0.78, priority: 'urgent', requires_permit: true,
  },
  {
    title: '6 HNW accounts trending toward churn — VIP save protocol',
    summary: 'Top-10% LTV cohort showing -34% concierge engagement in 30d.',
    rationale: 'Pattern matches "competitor onboarding" — usually they\'re evaluating Amex Centurion travel desk.',
    proposed_action: 'Trigger VIP save: dedicated human concierge, custom city pick, locked Premium pricing for 24mo.',
    expected_impact: 'Each save = $40-120k LTV protected. Conservative ROI 30x.',
    evidence: ['Engagement timeseries', '6 accounts flagged', 'Competitive intel on Amex Centurion outreach'],
    affected_segment: 'HNW — top-10% LTV',
    est_users_impacted: 6, est_revenue_usd: 480000,
    confidence: 0.82, priority: 'urgent', requires_permit: true,
  },
  {
    title: 'Family-graph expansion — 22 HNW users have school-age children',
    summary: 'Cross-reference of profile + concierge mentions identifies 22 candidates for Education vertical.',
    rationale: 'Boarding-school + international-school search interest detected. New vertical fits portfolio.',
    proposed_action: 'Pass to Iris + Hermes: scope education-advisory beta with Premium HNW cohort.',
    expected_impact: 'New vertical revenue potential $4-12k per family/yr in advisory fees.',
    evidence: ['22 family profiles matched', 'Concierge query mining', 'Vertical TAM analysis'],
    confidence: 0.74, priority: 'medium', requires_permit: true,
  },
];

const TEMPLATES: Record<AgentId, Template[]> = {
  legal: LEGAL_TEMPLATES,
  security: SECURITY_TEMPLATES,
  growth: GROWTH_TEMPLATES,
  product: PRODUCT_TEMPLATES,
  oracle: ORACLE_TEMPLATES,
  atlas: ATLAS_TEMPLATES,
  midas: MIDAS_TEMPLATES,
  echo: ECHO_TEMPLATES,
  sentinel: SENTINEL_TEMPLATES,
  muse: MUSE_TEMPLATES,
  praxis: PRAXIS_TEMPLATES,
  forge: FORGE_TEMPLATES,
  concord: CONCORD_TEMPLATES,
  verdant: VERDANT_TEMPLATES,
  atlas_ltv: ATLAS_LTV_TEMPLATES,
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
