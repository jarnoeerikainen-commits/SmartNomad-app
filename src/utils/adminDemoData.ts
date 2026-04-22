// ═══════════════════════════════════════════════════════════════════════════
// ADMIN DEMO DATA — Deterministic, large-scale fixtures for the Back Office.
// Generates hundreds of rows so investors / staff see a believable platform
// without depending on real production data.
// ═══════════════════════════════════════════════════════════════════════════

// ── deterministic PRNG (mulberry32) so every reload looks the same ──
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
const pick = <T,>(r: () => number, arr: readonly T[]): T => arr[Math.floor(r() * arr.length)];
const int = (r: () => number, min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;
const money = (r: () => number, min: number, max: number) => Math.round((r() * (max - min) + min) * 100) / 100;

// ── source pools ────────────────────────────────────────────────────
const FIRST = ['Meghan','Sofia','Marcus','Elena','Yuki','Karim','Priya','Lukas','Anika','Diego','Ines','Hiro','Noor','Olivia','Mateo','Anya','Felix','Camila','Ravi','Linnea','Sebastian','Mei','Tariq','Isabel','Henrik','Zara','Cyrus','Ada','Ronan','Aurora','Theo','Nadia','Ezra','Kira','Imani','Otis','Bea','Ronan','Vihaan','Selene','Idris','Maya','Caspian','Esme','Jasper','Lila','Nikolai','Saoirse','Tomás','Wren','Yara','Aleksei','Bibi','Cosima','Ines','Aslan','Benedikt','Cleo','Dario','Fenna','Gianna','Iker','Jovan','Kiara','Lior','Manon','Niall','Oksana','Pavel','Rania','Soren','Talia','Uriel','Vera','Wesley','Xenia','Yael','Zane','Amelie','Boris','Chiara','Dimitri','Eira','Fynn','Gala','Hadi','Ilse','Joren','Kasimir','Lior','Maelle','Nora','Oren','Paloma','Quentin','Rumi','Saskia','Theron','Una','Vivienne','Wassim'];
const LAST  = ['Sussex','Lennon','Maximov','Renaud','Tanaka','Haddad','Kapoor','Bauer','Lindqvist','Vega','Costa','Sato','Rahman','Holm','Garcia','Petrov','Adler','Mendoza','Iyer','Andersson','Voss','Chen','Khalid','Reyes','Nielsen','Said','Cyrus','Lovelace','Doyle','Kowalski','Sinclair','Khan','Cohen','Romanova','Okafor','Brunelli','Nakamura','O\'Connor','Bhatt','Dimitriou','Petersen','Volkov','Aaltonen','Alvarez','Belmonte','Cabrera','Donovan','Eriksen','Faro','Gallego','Halvorsen','Ibarra','Janssens','Karlsson','Lefebvre','Marchetti','Novak','Oduya','Pereira','Quiroga','Ruiz','Salonen','Tahir','Ueda','Vasquez','Werner','Xander','Yoshida','Zhao','Bianchi','Dragomir','Fournier','Goncalves','Hartmann','Ilic','Jimenez','Kowal','Lindholm','Mwangi','Nakagawa','Ostrowski','Park','Quintero','Rasmussen','Schwarz','Toledano','Ueno','Vermeulen','Wójcik','Yamamoto','Zambrano'];
const COUNTRIES: [code: string, flag: string, name: string][] = [
  ['PT','🇵🇹','Portugal'],['ES','🇪🇸','Spain'],['MX','🇲🇽','Mexico'],['AE','🇦🇪','UAE'],['TH','🇹🇭','Thailand'],
  ['ID','🇮🇩','Indonesia'],['JP','🇯🇵','Japan'],['SG','🇸🇬','Singapore'],['DE','🇩🇪','Germany'],['FR','🇫🇷','France'],
  ['IT','🇮🇹','Italy'],['CH','🇨🇭','Switzerland'],['UK','🇬🇧','UK'],['US','🇺🇸','USA'],['CA','🇨🇦','Canada'],
  ['BR','🇧🇷','Brazil'],['AR','🇦🇷','Argentina'],['CL','🇨🇱','Chile'],['NL','🇳🇱','Netherlands'],['SE','🇸🇪','Sweden'],
  ['NO','🇳🇴','Norway'],['AU','🇦🇺','Australia'],['NZ','🇳🇿','New Zealand'],['ZA','🇿🇦','South Africa'],['KE','🇰🇪','Kenya'],
  ['IN','🇮🇳','India'],['VN','🇻🇳','Vietnam'],['MY','🇲🇾','Malaysia'],['HK','🇭🇰','Hong Kong'],['IL','🇮🇱','Israel'],
];

const TIER_DEF = [
  // weight, key, label, monthlyMin, monthlyMax
  { w: 4,  k: 'whale',     label: 'Whale (Diamond)',  min: 8000, max: 35000 },
  { w: 8,  k: 'platinum',  label: 'Platinum',         min: 3000, max: 8000  },
  { w: 14, k: 'gold',      label: 'Gold',             min: 1200, max: 3000  },
  { w: 28, k: 'core',      label: 'Core Premium',     min: 350,  max: 1200  },
  { w: 30, k: 'lite',      label: 'Lite',             min: 50,   max: 350   },
  { w: 16, k: 'free',      label: 'Free',             min: 0,    max: 0     },
] as const;
const PERSONAS = ['HNW Family','Crypto Founder','Solo Nomad','Retiree Expat','Remote Engineer','Yacht Owner','Startup CEO','Diplomat','Pro Athlete','Influencer','Consultant','Investor','Artist','Doctor Abroad','Pilot','Producer','Lawyer','Researcher','Trader','Designer'] as const;

function pickTier(r: () => number) {
  const total = TIER_DEF.reduce((a, t) => a + t.w, 0);
  let n = r() * total;
  for (const t of TIER_DEF) { if ((n -= t.w) <= 0) return t; }
  return TIER_DEF[TIER_DEF.length - 1];
}

// ─── USERS ─────────────────────────────────────────────────────────
export interface DemoUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  snomad_id: string;
  created_at: string;
  country_code: string;
  country_flag: string;
  country_name: string;
  tier: string;
  tier_label: string;
  persona: string;
  monthly_spend_usd: number;
  ytd_spend_usd: number;
  ai_concierge_calls_30d: number;
  bookings_lifetime: number;
  satisfaction: number;          // 0-100
  status: 'active' | 'idle' | 'churn-risk' | 'vip-watch';
  active_since_days: number;
}

export function generateDemoUsers(count = 480): DemoUser[] {
  const r = rng(20260422);
  return Array.from({ length: count }, (_, i) => {
    const fn = pick(r, FIRST);
    const ln = pick(r, LAST);
    const [code, flag, name] = pick(r, COUNTRIES);
    const tier = pickTier(r);
    const monthly = tier.k === 'free' ? 0 : money(r, tier.min, tier.max);
    const ytd    = Math.round(monthly * (4 + r() * 8));
    const callsBase = ({ whale: 320, platinum: 180, gold: 110, core: 60, lite: 25, free: 6 } as Record<string,number>)[tier.k] ?? 8;
    const calls = Math.max(0, Math.round(callsBase + (r() - 0.5) * callsBase * 0.6));
    const sat   = Math.round(60 + r() * 39);
    const days  = int(r, 12, 720);
    const status: DemoUser['status'] =
      tier.k === 'whale' || tier.k === 'platinum' ? (r() < 0.15 ? 'vip-watch' : 'active') :
      r() < 0.06 ? 'churn-risk' :
      r() < 0.12 ? 'idle' : 'active';
    const sid = `SN-${(i * 9973 % 0xFFFF).toString(16).toUpperCase().padStart(4,'0')}-${(i * 31337 % 0xFFFF).toString(16).toUpperCase().padStart(4,'0')}-${(i * 1009 % 0xFFFF).toString(16).toUpperCase().padStart(4,'0')}`;
    return {
      id: `u_${i + 1}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g,'')}${i}@example.com`,
      first_name: fn,
      last_name: ln,
      snomad_id: sid,
      created_at: new Date(Date.now() - days * 86400_000).toISOString(),
      country_code: code,
      country_flag: flag,
      country_name: name,
      tier: tier.k,
      tier_label: tier.label,
      persona: pick(r, PERSONAS),
      monthly_spend_usd: monthly,
      ytd_spend_usd: ytd,
      ai_concierge_calls_30d: calls,
      bookings_lifetime: int(r, 0, 240),
      satisfaction: sat,
      status,
      active_since_days: days,
    };
  });
}

// ─── TICKETS ───────────────────────────────────────────────────────
export interface DemoTicket {
  id: string;
  ticket_number: number;
  subject: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  requester_email: string;
  created_at: string;
  ai_handled: boolean;
}
const SUBJECTS = [
  ['billing','Cannot link payment card','high'],
  ['compliance','ETIAS deadline question','normal'],
  ['security','Snomad ID lock recovery','urgent'],
  ['concierge','Concierge missed flight rebooking window','high'],
  ['booking','Hotel cancellation refund delay','normal'],
  ['concierge','AI suggested closed restaurant','low'],
  ['billing','Premium upgrade not reflecting','high'],
  ['affiliate','Payout stuck in pending 14d','high'],
  ['data','GDPR export request','normal'],
  ['security','Suspicious login from new country','urgent'],
  ['family','Add minor passport to family vault','normal'],
  ['concierge','Need yacht charter Côte d\'Azur next week','high'],
  ['compliance','Tax residency proof for Portugal NHR','normal'],
  ['booking','Private jet reroute Dubai → Tokyo','urgent'],
  ['health','Vaccination certificate not syncing','normal'],
  ['legal','Contract review attorney recommendation','normal'],
  ['concierge','Sofia voice keeps dropping mid-call','high'],
  ['booking','Award redemption failure 80k Avios','high'],
  ['data','Affiliate analytics export missing rows','low'],
  ['security','Two-factor recovery code lost','urgent'],
  ['concierge','Marcus translated menu wrong (Mandarin)','low'],
  ['family','School concierge Geneva availability','normal'],
  ['billing','Crypto payout USDC fee dispute','normal'],
  ['affiliate','Affiliate dashboard shows wrong tier','high'],
  ['data','Partner integration webhook 500s','urgent'],
] as const;

export function generateDemoTickets(users: DemoUser[], count = 220): DemoTicket[] {
  const r = rng(31415927);
  const start = 1500;
  return Array.from({ length: count }, (_, i) => {
    const [cat, sub, basePri] = pick(r, SUBJECTS);
    const u = pick(r, users);
    const pri: DemoTicket['priority'] = (r() < 0.1 ? 'urgent' : basePri) as DemoTicket['priority'];
    const st: DemoTicket['status'] =
      r() < 0.18 ? 'open' :
      r() < 0.4  ? 'pending' :
      r() < 0.85 ? 'resolved' : 'closed';
    return {
      id: `t_${i + 1}`,
      ticket_number: start + (count - i),
      subject: sub,
      category: cat,
      priority: pri,
      status: st,
      requester_email: u.email,
      created_at: new Date(Date.now() - i * 1800_000 - int(r, 0, 86400_000)).toISOString(),
      ai_handled: r() < 0.62,
    };
  });
}

// ─── AFFILIATES ────────────────────────────────────────────────────
export interface DemoAffiliate {
  id: string;
  user_email: string;
  user_name: string;
  referral_code: string;
  status: 'active' | 'paused' | 'pending_kyc';
  tier: 'icon' | 'gold' | 'silver' | 'standard' | 'starter';
  channel: 'creator' | 'agency' | 'community' | 'partner-app' | 'b2b-rep';
  total_clicks: number;
  total_signups: number;
  total_paying_referrals: number;
  pending_balance: number;
  cleared_balance: number;
  paid_lifetime: number;
  last_payout_at: string;
  conversion_rate: number;
}
const AFFILIATE_HANDLES = ['NomadIcon','GoldenWander','FlyKlass','TheJetSet','MeridianClub','LuxLifeMag','SkyTribe','PassportFolk','WanderWealth','RoamRoyale','TravelByElise','GlobalSuite','CashmereNomad','SoloPro','BlueCarryOn','HouseOfNoma','SovereignDaily','GlobeTrust','BorderlessHQ','VillaIndex'];

export function generateDemoAffiliates(users: DemoUser[], count = 140): DemoAffiliate[] {
  const r = rng(8675309);
  const tiers: DemoAffiliate['tier'][] = ['starter','standard','silver','gold','icon'];
  const channels: DemoAffiliate['channel'][] = ['creator','agency','community','partner-app','b2b-rep'];
  return Array.from({ length: count }, (_, i) => {
    // higher index = lower tier so list sorts naturally
    const tierIdx = Math.min(tiers.length - 1, Math.floor(Math.pow(r(), 1.6) * tiers.length));
    const tier = tiers[tierIdx];
    const mult = ({ icon: 6, gold: 3, silver: 1.6, standard: 0.8, starter: 0.3 } as Record<string,number>)[tier];
    const clicks = Math.round((900 + r() * 8000) * mult);
    const signups = Math.round(clicks * (0.04 + r() * 0.06));
    const paying  = Math.round(signups * (0.18 + r() * 0.22));
    const lifetime = money(r, 200, 18000) * mult;
    const pending = money(r, 50, 2400) * mult;
    const cleared = money(r, 100, 4200) * mult;
    const u = pick(r, users);
    const handle = pick(r, AFFILIATE_HANDLES);
    return {
      id: `aff_${i + 1}`,
      user_email: u.email,
      user_name: `${u.first_name} ${u.last_name}`,
      referral_code: `${handle.toUpperCase()}-${(i * 37 % 9999).toString().padStart(4,'0')}`,
      status: (r() < 0.86 ? 'active' : (r() < 0.5 ? 'paused' : 'pending_kyc')) as DemoAffiliate['status'],
      tier,
      channel: pick(r, channels),
      total_clicks: clicks,
      total_signups: signups,
      total_paying_referrals: paying,
      pending_balance: pending,
      cleared_balance: cleared,
      paid_lifetime: Math.round(lifetime),
      last_payout_at: new Date(Date.now() - int(r, 1, 90) * 86400_000).toISOString(),
      conversion_rate: Math.round((paying / Math.max(1, clicks)) * 10000) / 100,
    };
  }).sort((a, b) => b.paid_lifetime - a.paid_lifetime);
}

// ─── B2B PACKAGES & PARTNERS ───────────────────────────────────────
export interface DemoPackage {
  id: string; name: string; slug: string; category: string;
  status: 'active' | 'draft' | 'beta';
  cpm_usd: number; estimated_universe_size: number; recency_days: number;
  buyers: number; revenue_30d_usd: number;
}
export interface DemoPartner {
  id: string; partner_name: string; tier: 'enterprise' | 'pro' | 'growth' | 'scale';
  status: 'active' | 'paused' | 'trial';
  contact_email: string;
  contract_value_usd: number;
  api_calls_30d: number;
  last_active: string;
  sector: string;
}

const PACKAGES: { name: string; slug: string; cat: string; cpm: [number, number]; size: [number, number]; recency: number }[] = [
  { name: 'Nomad Travel Intent',          slug: 'nomad-travel-intent',     cat: 'travel',      cpm: [10,  18], size: [120_000, 280_000], recency: 30 },
  { name: 'High-Net-Worth Mobility',      slug: 'hnw-mobility',            cat: 'finance',     cpm: [28,  45], size: [18_000,  46_000],  recency: 14 },
  { name: 'Tax Residency Signals',        slug: 'tax-residency-signals',   cat: 'compliance',  cpm: [18,  30], size: [70_000, 160_000],  recency: 7  },
  { name: 'ETIAS Readiness Cohort',       slug: 'etias-cohort',            cat: 'compliance',  cpm: [16,  25], size: [220_000,420_000],  recency: 7  },
  { name: 'Crypto-Active Spenders',       slug: 'crypto-spenders',         cat: 'finance',     cpm: [22,  38], size: [40_000, 110_000],  recency: 14 },
  { name: 'Family Mobility (kids 4-17)',  slug: 'family-mobility',         cat: 'family',      cpm: [20,  32], size: [55_000, 120_000],  recency: 30 },
  { name: 'Pet Relocation Demand',        slug: 'pet-relocation',          cat: 'lifestyle',   cpm: [12,  20], size: [22_000,  60_000],  recency: 45 },
  { name: 'Private Aviation Affinity',    slug: 'private-aviation',        cat: 'travel',      cpm: [40,  65], size: [6_000,   18_000],  recency: 14 },
  { name: 'Health Insurance Switchers',   slug: 'health-switchers',        cat: 'insurance',   cpm: [18,  28], size: [88_000, 180_000],  recency: 30 },
  { name: 'Luxury Stay Planners',         slug: 'luxury-stay-planners',    cat: 'travel',      cpm: [22,  34], size: [70_000, 140_000],  recency: 21 },
  { name: 'Yacht & Charter Interest',     slug: 'yacht-charter',           cat: 'lifestyle',   cpm: [55,  85], size: [3_500,    9_000],  recency: 30 },
  { name: 'Visa-Free Long-Stay Seekers',  slug: 'visa-free-stay',          cat: 'compliance',  cpm: [14,  22], size: [200_000,360_000],  recency: 14 },
  { name: 'Education Mobility (Boarding)',slug: 'edu-boarding',            cat: 'family',      cpm: [25,  38], size: [12_000,  34_000],  recency: 60 },
  { name: 'Co-Living Demand',             slug: 'coliving-demand',         cat: 'real-estate', cpm: [16,  26], size: [60_000, 150_000],  recency: 21 },
  { name: 'eSIM & Connectivity Buyers',   slug: 'esim-connectivity',       cat: 'telecom',     cpm: [8,   14], size: [340_000,640_000],  recency: 14 },
];

export function generateDemoPackages(): DemoPackage[] {
  const r = rng(99887766);
  return PACKAGES.map((p, i) => {
    const status: DemoPackage['status'] = i < 11 ? 'active' : (i < 13 ? 'beta' : 'draft');
    const cpm = money(r, p.cpm[0], p.cpm[1]);
    const size = int(r, p.size[0], p.size[1]);
    const buyers = status === 'active' ? int(r, 4, 18) : status === 'beta' ? int(r, 1, 4) : 0;
    const revenue = status === 'active' ? Math.round(cpm * (size / 1000) * (0.06 + r() * 0.18) * buyers) : 0;
    return {
      id: `pkg_${i + 1}`,
      name: p.name,
      slug: p.slug,
      category: p.cat,
      status,
      cpm_usd: cpm,
      estimated_universe_size: size,
      recency_days: p.recency,
      buyers,
      revenue_30d_usd: revenue,
    };
  });
}

const PARTNERS: { name: string; sector: string }[] = [
  { name: 'Skyscanner Insights',     sector: 'travel-tech' },
  { name: 'Visa Travel Risk Lab',    sector: 'fintech' },
  { name: 'Mastercard Mobility',     sector: 'fintech' },
  { name: 'Allianz Global Health',   sector: 'insurance' },
  { name: 'Cigna Expat Care',        sector: 'insurance' },
  { name: 'Marriott Bonvoy Labs',    sector: 'hospitality' },
  { name: 'Accor Privilege Network', sector: 'hospitality' },
  { name: 'NetJets Demand Lab',      sector: 'aviation' },
  { name: 'VistaJet Insights',       sector: 'aviation' },
  { name: 'Sotheby\'s Realty Intel', sector: 'real-estate' },
  { name: 'Knight Frank Wealth',     sector: 'real-estate' },
  { name: 'Henley & Partners',       sector: 'compliance' },
  { name: 'PwC Mobility Services',   sector: 'compliance' },
  { name: 'Deloitte Tax Atlas',      sector: 'compliance' },
  { name: 'EY Global Mobility',      sector: 'compliance' },
  { name: 'Coinbase Pay Insights',   sector: 'crypto' },
  { name: 'Stripe Issuing Lab',      sector: 'fintech' },
  { name: 'Revolut Premier Insights',sector: 'fintech' },
  { name: 'Wise Cross-Border',       sector: 'fintech' },
  { name: 'Booking.com Strategy',    sector: 'travel-tech' },
  { name: 'Airbnb Luxe Research',    sector: 'travel-tech' },
  { name: 'Klook Asia Mobility',     sector: 'travel-tech' },
  { name: 'GetYourGuide Demand',     sector: 'travel-tech' },
  { name: 'Holafly Connectivity',    sector: 'telecom' },
  { name: 'Airalo eSIM Insights',    sector: 'telecom' },
];
export function generateDemoPartners(): DemoPartner[] {
  const r = rng(55443322);
  return PARTNERS.map((p, i) => {
    const tier: DemoPartner['tier'] = i < 6 ? 'enterprise' : i < 12 ? 'pro' : i < 18 ? 'scale' : 'growth';
    const status: DemoPartner['status'] = (r() < 0.85 ? 'active' : (r() < 0.5 ? 'trial' : 'paused')) as DemoPartner['status'];
    const value = ({ enterprise: 240_000, pro: 96_000, scale: 36_000, growth: 12_000 } as Record<string,number>)[tier];
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0, 14);
    return {
      id: `prt_${i + 1}`,
      partner_name: p.name,
      tier,
      status,
      contact_email: `data@${slug}.example`,
      contract_value_usd: Math.round(value * (0.7 + r() * 0.6)),
      api_calls_30d: int(r, 8_000, 1_400_000),
      last_active: new Date(Date.now() - int(r, 0, 7) * 86400_000).toISOString(),
      sector: p.sector,
    };
  });
}

// ─── AUDIT LOG ─────────────────────────────────────────────────────
export interface DemoAudit {
  id: string;
  actor_role: 'admin' | 'support' | 'affiliate_manager' | 'system' | 'ai-worker';
  action: string;
  target_type: string;
  target_id: string;
  created_at: string;
  ai_worker?: string;
}
const AUDIT_ACTIONS: { role: DemoAudit['actor_role']; action: string; target: string; ai?: string }[] = [
  { role: 'admin', action: 'user.suspend', target: 'user' },
  { role: 'admin', action: 'user.verify', target: 'user' },
  { role: 'support', action: 'ticket.assign', target: 'ticket' },
  { role: 'support', action: 'ticket.escalate', target: 'ticket' },
  { role: 'support', action: 'ticket.resolve', target: 'ticket' },
  { role: 'affiliate_manager', action: 'payout.approve', target: 'payout' },
  { role: 'affiliate_manager', action: 'affiliate.tier_upgrade', target: 'affiliate' },
  { role: 'admin', action: 'package.activate', target: 'package' },
  { role: 'admin', action: 'package.price_update', target: 'package' },
  { role: 'admin', action: 'partner.contract_renew', target: 'partner' },
  { role: 'system', action: 'job.k_anonymity_check', target: 'job' },
  { role: 'system', action: 'cron.weekly_payouts', target: 'cron' },
  { role: 'ai-worker', action: 'brain.full_scan', target: 'brain_run', ai: 'AI Brain' },
  { role: 'ai-worker', action: 'concierge.churn_save', target: 'user', ai: 'Echo (Wellbeing)' },
  { role: 'ai-worker', action: 'concierge.upsell_proposed', target: 'user', ai: 'Midas (Revenue)' },
  { role: 'ai-worker', action: 'concierge.crisis_dispatch', target: 'user', ai: 'Sentinel (Crisis)' },
  { role: 'ai-worker', action: 'security.anomaly_block', target: 'session', ai: 'Sentinel (Security)' },
  { role: 'ai-worker', action: 'growth.referral_nudge', target: 'user', ai: 'Atlas (Growth)' },
  { role: 'ai-worker', action: 'data.partner_audit', target: 'partner', ai: 'Praxis (Data Ops)' },
  { role: 'ai-worker', action: 'legal.consent_refresh', target: 'user', ai: 'Concord (Legal)' },
  { role: 'ai-worker', action: 'product.cohort_insight', target: 'cohort', ai: 'Forge (Product)' },
];
export function generateDemoAudit(users: DemoUser[], affiliates: DemoAffiliate[], partners: DemoPartner[], count = 280): DemoAudit[] {
  const r = rng(424242);
  return Array.from({ length: count }, (_, i) => {
    const a = pick(r, AUDIT_ACTIONS);
    let target_id = '—';
    if (a.target === 'user')      target_id = pick(r, users).id;
    else if (a.target === 'ticket')   target_id = `#${1500 - i}`;
    else if (a.target === 'payout')   target_id = `payout_${int(r, 1000, 9999)}`;
    else if (a.target === 'affiliate')target_id = pick(r, affiliates).referral_code;
    else if (a.target === 'package')  target_id = pick(r, ['hnw-mobility','etias-cohort','crypto-spenders','luxury-stay-planners']);
    else if (a.target === 'partner')  target_id = pick(r, partners).partner_name;
    else if (a.target === 'session')  target_id = `sess_${(i * 7919 % 0xFFFFFF).toString(16)}`;
    else if (a.target === 'brain_run')target_id = `run_${int(r, 100, 999)}`;
    else if (a.target === 'cohort')   target_id = pick(r, ['lite_to_premium','vip_at_risk','etias_uncovered','europe_tax_movers']);
    else                              target_id = `${a.target}_${int(r, 100, 999)}`;
    return {
      id: `aud_${i + 1}`,
      actor_role: a.role,
      action: a.action,
      target_type: a.target,
      target_id,
      created_at: new Date(Date.now() - i * 360_000 - int(r, 0, 360_000)).toISOString(),
      ai_worker: a.ai,
    };
  });
}

// ─── AI USAGE (rolled-up) ──────────────────────────────────────────
export interface DemoAIUsage {
  function_name: string;
  calls: number;
  tokens: number;
  cache_hits: number;
  worker: string;
  uptime: string;
}
export function generateDemoAIUsage(): DemoAIUsage[] {
  const r = rng(7654321);
  const fns: { fn: string; worker: string; baseCalls: number }[] = [
    { fn: 'social-chat-ai',         worker: 'Concierge (Sofia/Marcus)',  baseCalls: 18_240 },
    { fn: 'travel-assistant',       worker: 'Concierge (Travel Mode)',   baseCalls: 12_180 },
    { fn: 'community-orchestrator', worker: 'Concord (Community)',       baseCalls: 6_960  },
    { fn: 'snomad-orchestrator',    worker: 'Praxis (Data Ops)',         baseCalls: 5_120  },
    { fn: 'admin-ai-brain',         worker: 'AI Brain (Governor)',       baseCalls: 1_440  },
    { fn: 'admin-concierge',        worker: 'Admin Concierge',           baseCalls: 980    },
    { fn: 'concierge-evaluator',    worker: 'Forge (Self-Eval)',         baseCalls: 9_840  },
    { fn: 'memory-distill',         worker: 'Atlas LTV (Memory)',        baseCalls: 4_220  },
    { fn: 'agentic-payments',       worker: 'Midas (Revenue)',           baseCalls: 3_420  },
    { fn: 'crisis-dispatch',        worker: 'Sentinel (Crisis)',         baseCalls: 312    },
    { fn: 'legal-advisor',          worker: 'Concord (Legal)',           baseCalls: 1_680  },
    { fn: 'medical-advisor',        worker: 'Echo (Health)',             baseCalls: 1_220  },
    { fn: 'tax-advisor',            worker: 'Verdant (Tax)',             baseCalls: 1_060  },
    { fn: 'agent-orchestrator',     worker: 'Governor',                  baseCalls: 540    },
  ];
  return fns.map(({ fn, worker, baseCalls }) => {
    const calls = Math.round(baseCalls * (0.85 + r() * 0.4));
    return {
      function_name: fn,
      calls,
      tokens: Math.round(calls * int(r, 240, 720)),
      cache_hits: Math.round(calls * (0.18 + r() * 0.32)),
      worker,
      uptime: `${(99.5 + r() * 0.49).toFixed(2)}%`,
    };
  }).sort((a, b) => b.calls - a.calls);
}

// ─── SHARED MEMOIZED EXPORT ────────────────────────────────────────
let _cache: {
  users: DemoUser[];
  tickets: DemoTicket[];
  affiliates: DemoAffiliate[];
  packages: DemoPackage[];
  partners: DemoPartner[];
  audit: DemoAudit[];
  aiUsage: DemoAIUsage[];
} | null = null;

export function getAdminDemoDataset() {
  if (_cache) return _cache;
  const users      = generateDemoUsers();
  const tickets    = generateDemoTickets(users);
  const affiliates = generateDemoAffiliates(users);
  const packages   = generateDemoPackages();
  const partners   = generateDemoPartners();
  const audit      = generateDemoAudit(users, affiliates, partners);
  const aiUsage    = generateDemoAIUsage();
  _cache = { users, tickets, affiliates, packages, partners, audit, aiUsage };
  return _cache;
}

// ─── DERIVED ROLLUPS ───────────────────────────────────────────────
export function tierRollup(users: DemoUser[]) {
  const map = new Map<string, { tier: string; label: string; count: number; mrr: number; ai_calls: number }>();
  for (const t of TIER_DEF) map.set(t.k, { tier: t.k, label: t.label, count: 0, mrr: 0, ai_calls: 0 });
  for (const u of users) {
    const m = map.get(u.tier)!;
    m.count += 1;
    m.mrr += u.monthly_spend_usd;
    m.ai_calls += u.ai_concierge_calls_30d;
  }
  return Array.from(map.values());
}

export function platformRollup() {
  const ds = getAdminDemoDataset();
  const mrr = ds.users.reduce((s, u) => s + u.monthly_spend_usd, 0);
  const arr = mrr * 12;
  const aiCalls = ds.aiUsage.reduce((s, r) => s + r.calls, 0);
  const tokens  = ds.aiUsage.reduce((s, r) => s + r.tokens, 0);
  const openTickets = ds.tickets.filter(t => t.status === 'open' || t.status === 'pending').length;
  const urgentTickets = ds.tickets.filter(t => t.priority === 'urgent' && (t.status === 'open' || t.status === 'pending')).length;
  const b2bRevenue = ds.packages.reduce((s, p) => s + p.revenue_30d_usd, 0)
                   + ds.partners.reduce((s, p) => s + p.contract_value_usd, 0) / 12;
  const pendingPayouts = ds.affiliates.reduce((s, a) => s + a.pending_balance, 0);
  return {
    total_users: ds.users.length,
    dau_24h: Math.round(ds.users.length * 0.34),
    mau_30d: Math.round(ds.users.length * 0.78),
    ai_calls_24h: Math.round(aiCalls / 7), // weekly → daily
    ai_tokens_30d: tokens,
    open_tickets: openTickets,
    urgent_tickets: urgentTickets,
    b2b_revenue_30d: Math.round(b2bRevenue),
    active_affiliates: ds.affiliates.filter(a => a.status === 'active').length,
    active_partners: ds.partners.filter(p => p.status === 'active').length,
    pending_affiliate_payouts: Math.round(pendingPayouts),
    mrr_usd: Math.round(mrr),
    arr_usd: Math.round(arr),
  };
}
