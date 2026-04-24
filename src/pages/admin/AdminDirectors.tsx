import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  CalendarDays, Trophy, Crown, RefreshCw, Loader2, Sparkles, MapPin,
  TicketCheck, Building2, Plane, Megaphone, ExternalLink, Users, Zap,
  Coins, Heart, Award, Briefcase, DollarSign, Smile, Check, X,
  FileText, Send, ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useStaffRole } from '@/hooks/useStaffRole';

// ─── Types ──────────────────────────────────────────────────────────
type Director =
  | 'events' | 'sports' | 'vip'
  | 'affiliate' | 'loyalty' | 'sponsorship'
  | 'b2b_sales' | 'pricing' | 'aviation' | 'happiness';

const ALL: Director[] = [
  'events', 'sports', 'vip',
  'affiliate', 'loyalty', 'sponsorship',
  'b2b_sales', 'pricing', 'aviation', 'happiness',
];

interface Opportunity {
  id: string;
  director: Director;
  category: string;
  title: string;
  summary: string;
  city: string | null;
  country: string | null;
  start_at: string | null;
  url: string | null;
  popularity_score: number;
  exclusivity_score: number;
  est_ticket_price_min: number | null;
  est_ticket_price_max: number | null;
  currency: string;
  vip_packages: Array<{ name: string; price: number; perks: string[] }>;
  sponsor_packages: Array<{ tier: string; price: number; deliverables: string[]; target_companies?: string[] }>;
  concierge_offer: { pitch?: string; bundle?: string[]; upsell?: string[] };
  sales_target_segments: string[];
  tags: string[];
  pushed_to_concierge: boolean;
  pushed_to_sales: boolean;
  requires_approval?: boolean;
  approved_at?: string | null;
  rejected_at?: string | null;
  decision_note?: string | null;
  created_at: string;
}

interface DailyBriefing {
  id: string;
  briefing_date: string;
  title: string;
  executive_summary: string;
  narrative: string | null;
  highlights: string[];
  concerns: string[];
  director_rollup: Record<string, any>;
  pending_approvals: any[];
  kpi_snapshot: Record<string, any>;
  created_at: string;
}

// ─── Director config ────────────────────────────────────────────────
const DIRECTORS: Record<Director, { label: string; icon: any; tagline: string; color: string; group: 'sourcing' | 'revenue' | 'retention' | 'ops' }> = {
  events:      { label: 'Global Event Director',         icon: CalendarDays, tagline: 'Concerts, festivals, conferences, art fairs', color: 'hsl(220 80% 60%)', group: 'sourcing' },
  sports:      { label: 'Global Sports Director',        icon: Trophy,       tagline: 'F1, MotoGP, NBA, NFL, rugby, tennis, golf',  color: 'hsl(160 70% 45%)', group: 'sourcing' },
  vip:         { label: 'Global VIP Director',           icon: Crown,        tagline: 'Galas, fashion week, paddock club, yachts',   color: 'hsl(43 96% 56%)',  group: 'sourcing' },
  affiliate:   { label: 'Affiliate & Partnership',       icon: Coins,        tagline: 'Partner deals, commissions, recurring payouts', color: 'hsl(280 75% 60%)', group: 'revenue' },
  loyalty:     { label: 'Loyalty & Rewards',             icon: Heart,        tagline: 'Partner-funded perks, milestone gifts, save offers', color: 'hsl(340 75% 60%)', group: 'retention' },
  sponsorship: { label: 'Sponsorship Director',          icon: Award,        tagline: 'HNW brand sponsors, gala underwriting, takeovers', color: 'hsl(195 75% 55%)', group: 'revenue' },
  b2b_sales:   { label: 'B2B / Corporate Sales',         icon: Briefcase,    tagline: 'Family offices, consulting, white-label SaaS', color: 'hsl(15 80% 60%)',  group: 'revenue' },
  pricing:     { label: 'Pricing & Yield',               icon: DollarSign,   tagline: 'Subscription pricing, FX spread, surge pricing', color: 'hsl(60 80% 55%)',  group: 'ops' },
  aviation:    { label: 'Aviation & Mobility',           icon: Plane,        tagline: 'Empty legs, jet broker margin, yacht charter', color: 'hsl(200 85% 60%)', group: 'sourcing' },
  happiness:   { label: 'Happiness & NPS',               icon: Smile,        tagline: 'Churn save, surprise & delight, recovery offers', color: 'hsl(120 60% 55%)', group: 'retention' },
};

const GROUPS = {
  sourcing:  { label: 'Sourcing & Inventory', color: 'hsl(43 96% 56%)' },
  revenue:   { label: 'Revenue & Growth',     color: 'hsl(280 75% 60%)' },
  retention: { label: 'Retention & Love',     color: 'hsl(340 75% 60%)' },
  ops:       { label: 'Yield & Margins',      color: 'hsl(60 80% 55%)' },
} as const;

// ─── Helpers ────────────────────────────────────────────────────────
const fmtMoney = (n?: number | null, c = 'USD') =>
  n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(n);

const dateFmt = (iso: string | null | undefined) => {
  if (!iso) return 'TBD';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const timeAgo = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─── Demo seed for first 3 directors (kept terse — full demo lives in Brain) ─
const now = Date.now();
const inDays = (d: number) => new Date(now + d * 86400_000).toISOString();
const DEMO_OPPS: Opportunity[] = [
  {
    id: 'd-evt-1', director: 'events', category: 'art_fair',
    title: 'Art Basel Miami Beach — VIP Preview',
    summary: 'Western Hemisphere\'s premier art fair. First-Choice VIP card holders get 24h early access; private collector dinners across South Beach.',
    city: 'Miami Beach', country: 'USA', start_at: inDays(34), url: 'https://www.artbasel.com/miami-beach',
    popularity_score: 92, exclusivity_score: 88, est_ticket_price_min: 145, est_ticket_price_max: 18500, currency: 'USD',
    vip_packages: [{ name: 'First Choice', price: 5500, perks: ['24h early access','Private lounge','Curator tour'] }],
    sponsor_packages: [{ tier: 'Gold', price: 250000, deliverables: ['On-fair lounge branding','Logo on VIP cards'], target_companies: ['Private bank','Luxury auto'] }],
    concierge_offer: { pitch: 'Land morning of preview, skip the line at 11am, dinner at Joe\'s, after-party at Faena.', bundle: ['Art Basel ticket','Business class flight','Faena suite (3n)','Private SUV','Joe\'s reservation'] },
    sales_target_segments: ['hnw_americas','tech_execs','crypto_founders'], tags: ['art','collectors','miami'],
    pushed_to_concierge: false, pushed_to_sales: false, requires_approval: true,
    created_at: new Date(now - 2 * 3600_000).toISOString(),
  },
  {
    id: 'd-spt-1', director: 'sports', category: 'f1',
    title: 'F1 Monaco Grand Prix — Paddock Club',
    summary: 'The crown-jewel race. Paddock Club is the only way to see the harbour and have direct paddock access.',
    city: 'Monte Carlo', country: 'Monaco', start_at: inDays(44), url: 'https://www.formula1.com/en/racing/2026/monaco',
    popularity_score: 99, exclusivity_score: 96, est_ticket_price_min: 6800, est_ticket_price_max: 28000, currency: 'EUR',
    vip_packages: [{ name: 'Paddock Club 3-day', price: 12500, perks: ['Trackside terrace','Pit lane walks','Open bar & gourmet'] }],
    sponsor_packages: [{ tier: 'Platinum', price: 1500000, deliverables: ['Co-branded yacht reception','Driver meet & greet ×20'], target_companies: ['Private bank','Watch','Aviation'] }],
    concierge_offer: { pitch: 'Helicopter from Nice, yacht in the harbour, paddock walk Saturday — the textbook Monaco weekend.', bundle: ['Paddock Club','Helicopter NCE↔Monaco','Hotel de Paris suite','Yacht Sunday','La Vague d\'Or dinner'] },
    sales_target_segments: ['hnw_eu','family_office_global','luxury_brands'], tags: ['f1','monaco','paddock','yacht'],
    pushed_to_concierge: false, pushed_to_sales: false, requires_approval: true,
    created_at: new Date(now - 1 * 3600_000).toISOString(),
  },
  {
    id: 'd-aff-1', director: 'affiliate', category: 'aviation_partner',
    title: 'NetJets Fractional Referral — Premier Tier',
    summary: 'NetJets pays $25k–$50k per fractional share referral. SuperNomad concierge is a perfect surface to introduce qualified HNW clients without friction.',
    city: 'Global', country: 'USA', start_at: inDays(7), url: 'https://www.netjets.com',
    popularity_score: 78, exclusivity_score: 82, est_ticket_price_min: 25000, est_ticket_price_max: 50000, currency: 'USD',
    vip_packages: [{ name: 'Standard tier', price: 25000, perks: ['Referral fee per fractional share signed'] }],
    sponsor_packages: [{ tier: 'Annual', price: 250000, deliverables: ['Co-branded concierge module','Quarterly client breakfast'], target_companies: ['NetJets'] }],
    concierge_offer: { pitch: 'Mention NetJets when a member asks about routine private travel — refer for fractional share assessment.', bundle: ['Concierge intro flow','Quarterly NetJets event invites','Co-branded landing page'] },
    sales_target_segments: ['hnw_americas','family_office_global','c_suite'], tags: ['affiliate','aviation','high_value'],
    pushed_to_concierge: false, pushed_to_sales: false, requires_approval: true,
    created_at: new Date(now - 4 * 3600_000).toISOString(),
  },
  {
    id: 'd-loy-1', director: 'loyalty', category: 'partner_credit',
    title: 'Aman Club — One-Night-Free for Premium Members',
    summary: 'Aman is willing to comp one night for SuperNomad Premium members on a 4-night stay, in exchange for distribution. ~$1,800 retail value, $0 cost to us.',
    city: 'Global', country: 'Multi', start_at: inDays(3), url: 'https://www.aman.com',
    popularity_score: 85, exclusivity_score: 92, est_ticket_price_min: 0, est_ticket_price_max: 1800, currency: 'USD',
    vip_packages: [{ name: 'Premium-tier perk', price: 0, perks: ['1 night free on 4-night stay','Welcome amenity','Late checkout'] }],
    sponsor_packages: [{ tier: 'Co-marketing', price: 0, deliverables: ['Aman branded perk module','3 newsletter features/year'], target_companies: ['Aman Resorts'] }],
    concierge_offer: { pitch: 'Tell Premium members: book 4 nights at any Aman, the 4th is on us — courtesy of Aman.', bundle: ['Aman booking','Welcome amenity','Late checkout','Curated dining list'] },
    sales_target_segments: ['premium_tier','hnw_global','retention_save'], tags: ['loyalty','perk','partner_funded'],
    pushed_to_concierge: false, pushed_to_sales: false, requires_approval: true,
    created_at: new Date(now - 6 * 3600_000).toISOString(),
  },
  {
    id: 'd-spo-1', director: 'sponsorship', category: 'concierge_placement',
    title: 'IWC Schaffhausen — F1 Timing Module Sponsor',
    summary: 'IWC is the official engineering watch partner of Mercedes-AMG F1. They have annual budget for HNW digital placements. A timing-themed concierge module during F1 weekends could be sold for $400k/season.',
    city: 'Schaffhausen', country: 'Switzerland', start_at: inDays(15), url: 'https://www.iwc.com',
    popularity_score: 80, exclusivity_score: 88, est_ticket_price_min: 400000, est_ticket_price_max: 600000, currency: 'USD',
    vip_packages: [{ name: 'Season placement', price: 400000, perks: ['Co-branded F1 weekend module','Push notifications','Editorial features'] }],
    sponsor_packages: [{ tier: 'Underwriter', price: 600000, deliverables: ['Concierge module takeover','Boutique events for Premium members ×4','Co-branded racing calendar'], target_companies: ['IWC Schaffhausen'] }],
    concierge_offer: { pitch: 'Sell IWC the F1 timing concierge module — 24 race weekends, HNW eyeballs, one $400k placement.', bundle: ['Sales deck','Brand mock','Term sheet draft'] },
    sales_target_segments: ['luxury_brands','watch_industry'], tags: ['sponsorship','f1','watches'],
    pushed_to_concierge: false, pushed_to_sales: false, requires_approval: true,
    created_at: new Date(now - 8 * 3600_000).toISOString(),
  },
  {
    id: 'd-b2b-1', director: 'b2b_sales', category: 'family_office',
    title: 'KKR Family Office — Concierge SaaS White-Label',
    summary: 'KKR\'s family-office division services 300+ UHNW principals with no scaled concierge solution. Estimated ARR $1.2M for white-label SuperNomad concierge.',
    city: 'New York', country: 'USA', start_at: inDays(21), url: null,
    popularity_score: 70, exclusivity_score: 90, est_ticket_price_min: 800000, est_ticket_price_max: 1500000, currency: 'USD',
    vip_packages: [{ name: 'White-label seat (300 principals)', price: 1200000, perks: ['Branded as KKR FO concierge','Dedicated CSM','SLA 1h'] }],
    sponsor_packages: [{ tier: 'Annual contract', price: 1200000, deliverables: ['Full concierge SaaS','Custom branding','Quarterly business review'], target_companies: ['KKR Family Office'] }],
    concierge_offer: { pitch: 'Approach KKR\'s Head of FO Services with a white-label SuperNomad concierge demo — $1.2M ARR opportunity.', bundle: ['Targeted outreach plan','Bespoke pitch deck','Demo environment for 5 principals'] },
    sales_target_segments: ['family_office_global','enterprise'], tags: ['b2b','saas','high_acv'],
    pushed_to_concierge: false, pushed_to_sales: false, requires_approval: true,
    created_at: new Date(now - 10 * 3600_000).toISOString(),
  },
  {
    id: 'd-pri-1', director: 'pricing', category: 'subscription_pricing',
    title: 'Premium tier: $4.99 → $7.99 (90-day grandfather)',
    summary: 'Premium has been priced below market for 18 months. Move to $7.99 with 90-day grandfather for existing subs. Modelled +52% MRR uplift, ~3% incremental churn.',
    city: 'Global', country: 'Multi', start_at: inDays(14), url: null,
    popularity_score: 60, exclusivity_score: 30, est_ticket_price_min: 7.99, est_ticket_price_max: 7.99, currency: 'USD',
    vip_packages: [{ name: 'New tier price', price: 7.99, perks: ['All current Premium benefits','Grandfathered for 90 days for existing'] }],
    sponsor_packages: [{ tier: 'A/B variant', price: 7.99, deliverables: ['50/50 split-test for 30d','Controlled rollout'], target_companies: [] }],
    concierge_offer: { pitch: 'Approve $7.99 Premium pricing change with 90-day grandfather. Modelled +52% MRR.', bundle: ['Pricing change spec','A/B test design','Customer-comms templates'] },
    sales_target_segments: ['new_signups','existing_premium'], tags: ['pricing','subscription'],
    pushed_to_concierge: false, pushed_to_sales: false, requires_approval: true,
    created_at: new Date(now - 12 * 3600_000).toISOString(),
  },
  {
    id: 'd-avi-1', director: 'aviation', category: 'empty_leg',
    title: 'Empty Leg LON→NCE — Friday 2am — VistaJet Global 7500',
    summary: 'VistaJet has an empty leg from London Stansted to Nice this Friday at 02:00. Retail $48k, broker price $22k. Premium members would pay $35k+ within the hour for an F1 weekend.',
    city: 'London → Nice', country: 'UK→France', start_at: inDays(4), url: 'https://www.vistajet.com',
    popularity_score: 88, exclusivity_score: 75, est_ticket_price_min: 35000, est_ticket_price_max: 38000, currency: 'USD',
    vip_packages: [{ name: 'Whole-aircraft', price: 35000, perks: ['Up to 14 pax','Catering included','Crew tip included'] }],
    sponsor_packages: [{ tier: 'Featured listing', price: 0, deliverables: ['VistaJet branded inventory feed','Empty-leg push notification'], target_companies: ['VistaJet'] }],
    concierge_offer: { pitch: 'Push to top-100 Premium members in London this morning — F1 Monaco kicks off Friday.', bundle: ['VistaJet empty leg','Hotel de Paris suite','Black SUV ground','F1 ticket upsell'] },
    sales_target_segments: ['premium_eu','f1_fans'], tags: ['aviation','empty_leg','f1'],
    pushed_to_concierge: false, pushed_to_sales: false, requires_approval: true,
    created_at: new Date(now - 1 * 3600_000).toISOString(),
  },
  {
    id: 'd-hap-1', director: 'happiness', category: 'churn_risk',
    title: 'Churn-risk cohort: 47 Premium members, NPS<6 last 30d',
    summary: '47 Premium members rated NPS below 6 in the last 30 days. Estimated 60-day churn risk: 31%. Recommended save: 1 month free + concierge call.',
    city: 'Global', country: 'Multi', start_at: inDays(1), url: null,
    popularity_score: 95, exclusivity_score: 50, est_ticket_price_min: 240, est_ticket_price_max: 240, currency: 'USD',
    vip_packages: [{ name: 'Save offer per member', price: 4.99, perks: ['1 month Premium free','Personal concierge call','Bespoke perk'] }],
    sponsor_packages: [{ tier: 'Cost cap', price: 235, deliverables: ['Cap total intervention cost at $235','Track NPS recovery 30d post'], target_companies: [] }],
    concierge_offer: { pitch: 'Approve outreach to 47 NPS-detractors with 1-month-free + concierge call. Modelled retention save 14 of 47.', bundle: ['Targeted member list','Concierge call brief','Comp credit application'] },
    sales_target_segments: ['premium_at_risk'], tags: ['retention','nps','save_offer'],
    pushed_to_concierge: false, pushed_to_sales: false, requires_approval: true,
    created_at: new Date(now - 3 * 3600_000).toISOString(),
  },
];

const DEMO_BRIEFING: DailyBriefing = {
  id: 'demo-brief',
  briefing_date: new Date().toISOString().slice(0, 10),
  title: `Daily Briefing — ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} — F1 Monaco week ramps up`,
  executive_summary:
    '10 AI Directors completed 14 sweeps in the last 24h, surfacing 38 new opportunities and 9 high-priority recommendations now awaiting your sign-off. F1 Monaco demand is converging across Sports, VIP, Sponsorship and Aviation — a coordinated week is on the table.',
  narrative:
    'Sports and VIP directors both surfaced Monaco GP packages within minutes of each other; Aviation flagged a same-week empty leg LON→NCE that perfectly matches the VIP audience. Sponsorship pre-qualified IWC Schaffhausen as a $400k+ candidate for the F1 timing module. On the revenue side, Affiliate sourced a NetJets fractional referral worth $25-50k per close, and B2B Sales identified KKR Family Office as a $1.2M ARR white-label opportunity. Pricing recommends moving Premium to $7.99 with a 90-day grandfather (modelled +52% MRR). Happiness flagged 47 Premium NPS-detractors who need an immediate save-offer.\n\nNothing has been pushed to live channels yet — every item below requires explicit human approval.\n\nRecommended action order today: (1) approve the F1 Monaco bundle (Sports + VIP + Aviation), (2) decide on the Aman one-night-free perk for retention, (3) sign off on the IWC sponsorship outreach, (4) approve the NPS save-offer outreach.',
  highlights: [
    'F1 Monaco coordinated bundle ready (Sports + VIP + Aviation directors aligned) — awaiting human approval',
    'IWC Schaffhausen pre-qualified for $400k+ F1 timing module sponsorship — awaiting human approval',
    'Aman one-night-free perk negotiated, $0 cost to platform — awaiting human approval',
    'KKR Family Office $1.2M ARR white-label opportunity surfaced by B2B Sales — awaiting human approval',
    'VistaJet empty leg LON→NCE this Friday, $13k margin if filled — awaiting human approval',
    'Premium pricing change to $7.99 modelled +52% MRR — awaiting human approval',
  ],
  concerns: [
    '47 Premium members at churn risk (NPS<6, last 30d) — save campaign awaiting approval',
    'Aviation Director has only 1 active partner (VistaJet) — concentration risk on empty-leg supply',
    'No new B2B leads in EMEA pipeline this week — request a B2B Sales focused EMEA sweep',
  ],
  director_rollup: {
    events: { runs: 2, opportunities_24h: 6, sponsor_packages_24h: 9, pending_approval: 6 },
    sports: { runs: 2, opportunities_24h: 5, sponsor_packages_24h: 8, pending_approval: 5 },
    vip: { runs: 2, opportunities_24h: 4, sponsor_packages_24h: 6, pending_approval: 4 },
    affiliate: { runs: 1, opportunities_24h: 4, sponsor_packages_24h: 4, pending_approval: 4 },
    loyalty: { runs: 1, opportunities_24h: 3, sponsor_packages_24h: 3, pending_approval: 3 },
    sponsorship: { runs: 2, opportunities_24h: 5, sponsor_packages_24h: 5, pending_approval: 5 },
    b2b_sales: { runs: 1, opportunities_24h: 3, sponsor_packages_24h: 3, pending_approval: 3 },
    pricing: { runs: 1, opportunities_24h: 2, sponsor_packages_24h: 2, pending_approval: 2 },
    aviation: { runs: 1, opportunities_24h: 4, sponsor_packages_24h: 4, pending_approval: 4 },
    happiness: { runs: 1, opportunities_24h: 2, sponsor_packages_24h: 2, pending_approval: 2 },
  },
  pending_approvals: [],
  kpi_snapshot: {},
  created_at: new Date().toISOString(),
};

// ─── Component ──────────────────────────────────────────────────────
const AdminDirectors: React.FC = () => {
  const { isDemoMode } = useStaffRole();
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<Record<string, boolean>>({});
  const [genBriefing, setGenBriefing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | Director>('pending');
  const [decideNote, setDecideNote] = useState<Record<string, string>>({});

  useEffect(() => { document.title = 'Back Office — AI Directors · SuperNomad'; }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [oppsRes, briefRes] = await Promise.all([
        supabase.from('admin_ai_opportunities' as any)
          .select('*')
          .neq('status', 'rejected')
          .order('created_at', { ascending: false })
          .limit(120),
        supabase.rpc('get_latest_daily_briefing' as any),
      ]);
      const live = (oppsRes.data ?? []) as unknown as Opportunity[];
      setOpps(live.length ? live : DEMO_OPPS);
      const b = (briefRes.data as any) as DailyBriefing | null;
      setBriefing(b ?? DEMO_BRIEFING);
    } catch (e) {
      console.warn('Directors load fallback:', e);
      setOpps(DEMO_OPPS);
      setBriefing(DEMO_BRIEFING);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const runDirector = async (director: Director | 'all') => {
    const key = director;
    setRunning((s) => ({ ...s, [key]: true }));
    const t = toast.loading(director === 'all' ? 'Running all 10 directors…' : `${DIRECTORS[director].label} sourcing…`);
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-directors', {
        body: director === 'all' ? { all: true, trigger: 'manual', scope: 'sweep' } : { director, trigger: 'manual', scope: 'sweep' },
      });
      if (error) throw error;
      const ok = (data as any)?.ok;
      if (ok) {
        toast.success(director === 'all' ? 'All 10 directors completed sweeps — review pending approvals' : `${DIRECTORS[director as Director].label}: ${(data as any).opportunities_created ?? 0} new opportunities (awaiting approval)`, { id: t });
        await loadAll();
      } else {
        toast.error(`Director error: ${(data as any)?.error ?? 'unknown'}`, { id: t });
      }
    } catch (e: any) {
      toast.error(`Could not run director: ${e?.message ?? e}`, { id: t });
    } finally {
      setRunning((s) => ({ ...s, [key]: false }));
    }
  };

  const generateDailyBriefing = async () => {
    setGenBriefing(true);
    const t = toast.loading('Generating daily briefing…');
    try {
      const { data, error } = await supabase.functions.invoke('admin-daily-briefing', {
        body: { trigger: 'manual' },
      });
      if (error) throw error;
      if ((data as any)?.ok) {
        toast.success('Daily briefing generated', { id: t });
        await loadAll();
      } else {
        toast.error(`Briefing failed: ${(data as any)?.error ?? 'unknown'}`, { id: t });
      }
    } catch (e: any) {
      toast.error(`Could not generate briefing: ${e?.message ?? e}`, { id: t });
    } finally {
      setGenBriefing(false);
    }
  };

  const decide = async (id: string, approve: boolean, pushConcierge = false, pushSales = false) => {
    if (id.startsWith('d-')) {
      // Demo row — local update only
      setOpps((s) => s.map((o) => o.id === id ? {
        ...o,
        approved_at: approve ? new Date().toISOString() : null,
        rejected_at: approve ? null : new Date().toISOString(),
        pushed_to_concierge: o.pushed_to_concierge || (approve && pushConcierge),
        pushed_to_sales: o.pushed_to_sales || (approve && pushSales),
        decision_note: decideNote[id] ?? null,
      } : o));
      toast.success(approve ? 'Approved (demo)' : 'Rejected (demo)');
      return;
    }
    try {
      const { error } = await supabase.rpc('decide_opportunity' as any, {
        p_id: id, p_approve: approve,
        p_note: decideNote[id] || null,
        p_push_concierge: pushConcierge, p_push_sales: pushSales,
      });
      if (error) throw error;
      toast.success(approve ? 'Approved & synced to ecosystem' : 'Rejected');
      await loadAll();
    } catch (e: any) {
      toast.error(`Decision failed: ${e?.message ?? e}`);
    }
  };

  // ── Per-director stats ───────────────────────────────────────────
  const stats = useMemo(() => {
    const out: Record<Director, { count: number; pending: number; approved: number; revenue: number }> = {} as any;
    for (const d of ALL) {
      const rows = opps.filter((o) => o.director === d);
      const revenue = rows.reduce((s, o) => {
        const vip = (o.vip_packages ?? []).reduce((a, p) => a + (p.price ?? 0), 0);
        const sp = (o.sponsor_packages ?? []).reduce((a, p) => a + (p.price ?? 0), 0);
        return s + vip + sp;
      }, 0);
      out[d] = {
        count: rows.length,
        pending: rows.filter((o) => o.requires_approval && !o.approved_at && !o.rejected_at).length,
        approved: rows.filter((o) => !!o.approved_at).length,
        revenue,
      };
    }
    return out;
  }, [opps]);

  const pendingCount = useMemo(() => opps.filter((o) => o.requires_approval && !o.approved_at && !o.rejected_at).length, [opps]);

  const visibleOpps = useMemo(() => {
    if (activeTab === 'all') return opps;
    if (activeTab === 'pending') return opps.filter((o) => o.requires_approval && !o.approved_at && !o.rejected_at);
    return opps.filter((o) => o.director === activeTab);
  }, [activeTab, opps]);

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[hsl(43_96%_56%/0.15)] border border-[hsl(43_96%_56%/0.3)] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[hsl(var(--gold))]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">AI Director Ecosystem</h1>
              <p className="text-sm text-[hsl(30_12%_70%)]">
                10 specialised 24/7 workers · synced to Concierge, Sales & Marketing · every action requires your approval
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" /> 10 LIVE 24/7
          </Badge>
          <Badge className="bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold))] border-[hsl(var(--gold))]/30">
            <ShieldCheck className="h-3 w-3 mr-1" /> Human-approval gated
          </Badge>
          {isDemoMode && (
            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30">Demo</Badge>
          )}
          <Button variant="outline" size="sm" onClick={loadAll} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Daily briefing panel */}
      {briefing && (
        <Card className="bg-gradient-to-br from-[hsl(220_22%_10%)] to-[hsl(220_22%_8%)] border-[hsl(43_96%_56%/0.3)] p-5 mb-6">
          <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="h-9 w-9 rounded-md bg-[hsl(43_96%_56%/0.15)] border border-[hsl(43_96%_56%/0.3)] flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-[hsl(var(--gold))]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-[10px] uppercase border-[hsl(var(--gold))]/30 text-[hsl(var(--gold))]">
                    Daily Briefing
                  </Badge>
                  <span className="text-xs text-[hsl(30_12%_60%)]">{dateFmt(briefing.briefing_date)}</span>
                </div>
                <h2 className="text-lg font-semibold text-white mt-1 leading-tight">{briefing.title}</h2>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={generateDailyBriefing} disabled={genBriefing}>
              {genBriefing ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1.5" />}
              Regenerate
            </Button>
          </div>

          <p className="text-sm text-white/90 leading-relaxed mb-4">{briefing.executive_summary}</p>

          {briefing.narrative && (
            <div className="text-xs text-[hsl(30_12%_80%)] leading-relaxed whitespace-pre-line mb-4 bg-[hsl(220_22%_6%)] rounded-md p-3 border border-[hsl(43_96%_56%/0.1)]">
              {briefing.narrative}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-3">
            {briefing.highlights?.length > 0 && (
              <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 p-3">
                <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-2 font-semibold">Highlights</div>
                <ul className="space-y-1.5">
                  {briefing.highlights.slice(0, 6).map((h, i) => (
                    <li key={i} className="text-xs text-white/85 flex items-start gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {briefing.concerns?.length > 0 && (
              <div className="rounded-md bg-amber-500/5 border border-amber-500/20 p-3">
                <div className="text-[10px] uppercase tracking-wider text-amber-400 mb-2 font-semibold">Concerns</div>
                <ul className="space-y-1.5">
                  {briefing.concerns.slice(0, 5).map((c, i) => (
                    <li key={i} className="text-xs text-white/85 flex items-start gap-1.5">
                      <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Director worker grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="font-semibold text-white">All 10 Directors</div>
          <Button size="sm" onClick={() => runDirector('all')} disabled={!!running.all}
            className="bg-[hsl(var(--gold))] text-[hsl(220_22%_8%)] hover:bg-[hsl(var(--gold))]/90">
            {running.all ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Zap className="h-4 w-4 mr-1.5" />}
            {running.all ? 'Running all 10…' : 'Run ALL directors now'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {ALL.map((d) => {
            const cfg = DIRECTORS[d];
            const Icon = cfg.icon;
            const s = stats[d];
            return (
              <Card key={d} className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-3 hover:border-[hsl(43_96%_56%/0.3)] transition-colors">
                <div className="flex items-start gap-2 mb-2">
                  <div className="h-9 w-9 rounded-md flex items-center justify-center shrink-0"
                       style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}55` }}>
                    <Icon className="h-4 w-4" style={{ color: cfg.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white leading-tight truncate">{cfg.label}</div>
                    <div className="text-[10px] text-[hsl(30_12%_60%)] line-clamp-2 mt-0.5">{cfg.tagline}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center my-2">
                  <div className="rounded bg-[hsl(220_22%_6%)] p-1.5">
                    <div className="text-[9px] text-[hsl(30_12%_60%)] uppercase">Active</div>
                    <div className="text-sm font-semibold text-white">{s.count}</div>
                  </div>
                  <div className="rounded bg-amber-500/10 p-1.5">
                    <div className="text-[9px] text-amber-400 uppercase">Pending</div>
                    <div className="text-sm font-semibold text-amber-400">{s.pending}</div>
                  </div>
                  <div className="rounded bg-emerald-500/10 p-1.5">
                    <div className="text-[9px] text-emerald-400 uppercase">Approved</div>
                    <div className="text-sm font-semibold text-emerald-400">{s.approved}</div>
                  </div>
                </div>
                <Button size="sm" onClick={() => runDirector(d)} disabled={!!running[d]}
                  className="w-full h-7 text-xs"
                  style={{ background: cfg.color, color: '#0b0b0b' }}>
                  {running[d] ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Zap className="h-3 w-3 mr-1" />}
                  {running[d] ? 'Sourcing…' : 'Run sweep'}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Approval queue / opportunity feed */}
      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="font-semibold text-white">Approval queue & opportunity feed</div>
            <div className="text-xs text-[hsl(30_12%_70%)]">
              Every item requires your decision before it syncs to Concierge, Sales or any user-facing channel.
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="bg-[hsl(220_22%_8%)] flex-wrap h-auto">
              <TabsTrigger value="pending" className="data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="all">All ({opps.length})</TabsTrigger>
              {ALL.map((d) => (
                <TabsTrigger key={d} value={d} className="text-xs">
                  {d.replace('_', ' ')} ({stats[d].count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="max-h-[800px]">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {visibleOpps.map((o) => {
              const cfg = DIRECTORS[o.director];
              const Icon = cfg.icon;
              const isPending = !!o.requires_approval && !o.approved_at && !o.rejected_at;
              const isApproved = !!o.approved_at;
              return (
                <div key={o.id} className="rounded-lg bg-[hsl(220_22%_8%)] border border-[hsl(43_96%_56%/0.12)] p-4 hover:border-[hsl(43_96%_56%/0.3)] transition-colors">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-8 w-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                         style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}55` }}>
                      <Icon className="h-4 w-4" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px] uppercase border-[hsl(43_96%_56%/0.3)] text-[hsl(var(--gold))]">
                          {o.category.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]" style={{ color: cfg.color, borderColor: `${cfg.color}55` }}>
                          {cfg.label.split(' ')[0]}
                        </Badge>
                        {isPending && <Badge className="text-[10px] bg-amber-500/15 text-amber-400 border-amber-500/30">⏳ Awaiting approval</Badge>}
                        {isApproved && <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30">✓ Approved</Badge>}
                        {o.pushed_to_concierge && <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30">In Concierge</Badge>}
                        {o.pushed_to_sales && <Badge className="text-[10px] bg-blue-500/15 text-blue-400 border-blue-500/30">In Sales</Badge>}
                      </div>
                      <div className="font-semibold text-white mt-1">{o.title}</div>
                      <div className="text-xs text-[hsl(30_12%_70%)] flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{[o.city, o.country].filter(Boolean).join(', ') || 'Global'}</span>
                        <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{dateFmt(o.start_at)}</span>
                        <span>· {timeAgo(o.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[hsl(30_12%_75%)] leading-relaxed mb-3">{o.summary}</p>

                  {o.concierge_offer?.pitch && (
                    <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 p-2.5 mb-2.5">
                      <div className="text-[10px] uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                        <Plane className="h-3 w-3" /> Concierge / Action pitch
                      </div>
                      <div className="text-xs text-white italic mb-1.5">"{o.concierge_offer.pitch}"</div>
                      {o.concierge_offer.bundle && (
                        <div className="flex flex-wrap gap-1">
                          {o.concierge_offer.bundle.slice(0, 6).map((b, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{b}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {(o.sponsor_packages?.length > 0 || o.vip_packages?.length > 0) && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {o.vip_packages?.length > 0 && (
                        <div className="rounded-md bg-[hsl(43_96%_56%/0.05)] border border-[hsl(43_96%_56%/0.2)] p-2">
                          <div className="text-[10px] uppercase tracking-wider text-[hsl(var(--gold))] flex items-center gap-1 mb-1">
                            <TicketCheck className="h-3 w-3" /> VIP / Member ({o.vip_packages.length})
                          </div>
                          {o.vip_packages.slice(0, 2).map((vp, i) => (
                            <div key={i} className="text-[11px] text-white/90 flex items-center justify-between gap-1">
                              <span className="truncate">{vp.name}</span>
                              <span className="font-semibold text-[hsl(var(--gold))] shrink-0">{fmtMoney(vp.price, o.currency)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {o.sponsor_packages?.length > 0 && (
                        <div className="rounded-md bg-blue-500/5 border border-blue-500/20 p-2">
                          <div className="text-[10px] uppercase tracking-wider text-blue-400 flex items-center gap-1 mb-1">
                            <Megaphone className="h-3 w-3" /> Sponsor / Partner ({o.sponsor_packages.length})
                          </div>
                          {o.sponsor_packages.slice(0, 2).map((sp, i) => (
                            <div key={i} className="text-[11px] text-white/90 flex items-center justify-between gap-1">
                              <span className="truncate">{sp.tier}</span>
                              <span className="font-semibold text-blue-300 shrink-0">{fmtMoney(sp.price, o.currency)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Decision row */}
                  {isPending ? (
                    <div className="border-t border-[hsl(43_96%_56%/0.1)] pt-3 space-y-2">
                      <Textarea
                        placeholder="Decision note (optional) — why approving / rejecting?"
                        value={decideNote[o.id] || ''}
                        onChange={(e) => setDecideNote((s) => ({ ...s, [o.id]: e.target.value }))}
                        className="min-h-[44px] text-xs bg-[hsl(220_22%_6%)] border-[hsl(43_96%_56%/0.2)]"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <Button size="sm" variant="default" onClick={() => decide(o.id, true, true, true)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-xs">
                          <Check className="h-3 w-3 mr-1" /> Approve & sync everywhere
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => decide(o.id, true, true, false)} className="h-8 text-xs">
                          <Plane className="h-3 w-3 mr-1" /> Approve → Concierge only
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => decide(o.id, true, false, true)} className="h-8 text-xs">
                          <Building2 className="h-3 w-3 mr-1" /> Approve → Sales only
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => decide(o.id, false)}
                          className="h-8 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">
                          <X className="h-3 w-3 mr-1" /> Reject
                        </Button>
                        {o.url && (
                          <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs ml-auto">
                            <a href={o.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" /> Source
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-[hsl(43_96%_56%/0.1)] pt-3 flex items-center justify-between gap-2 text-[10px] text-[hsl(30_12%_60%)]">
                      <div className="flex items-center gap-1 min-w-0 flex-1">
                        <Users className="h-3 w-3 shrink-0" />
                        <span className="truncate">{(o.sales_target_segments ?? []).slice(0, 3).join(' · ') || '—'}</span>
                      </div>
                      {o.url && (
                        <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <a href={o.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" /> Source
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {!loading && visibleOpps.length === 0 && (
              <div className="col-span-full text-center text-[hsl(30_12%_60%)] py-12">
                {activeTab === 'pending' ? 'No items awaiting approval — your directors are all caught up.' : 'No opportunities yet. Run a director sweep above.'}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default AdminDirectors;
