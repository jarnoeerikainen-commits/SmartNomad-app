import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarDays, Trophy, Crown, RefreshCw, Loader2, Sparkles, MapPin,
  TicketCheck, Building2, Plane, Megaphone, ExternalLink, Users, Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { useStaffRole } from '@/hooks/useStaffRole';

// ─── Types ──────────────────────────────────────────────────────────
type Director = 'events' | 'sports' | 'vip';

interface Opportunity {
  id: string;
  director: Director;
  category: string;
  title: string;
  summary: string;
  city: string | null;
  country: string | null;
  venue: string | null;
  start_at: string | null;
  url: string | null;
  popularity_score: number;
  exclusivity_score: number;
  est_audience: number | null;
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
  created_at: string;
}

// ─── Demo seed (rich, realistic — surfaces immediately) ─────────────
const now = Date.now();
const inDays = (d: number) => new Date(now + d * 86400_000).toISOString();

const DEMO_OPPS: Opportunity[] = [
  {
    id: 'd-evt-1', director: 'events', category: 'art_fair',
    title: 'Art Basel Miami Beach — VIP Preview',
    summary: 'The Western Hemisphere\'s premier art fair. First-Choice VIP card holders get 24h early access; private collector dinners across South Beach.',
    city: 'Miami Beach', country: 'USA', venue: 'Miami Beach Convention Center',
    start_at: inDays(34), url: 'https://www.artbasel.com/miami-beach',
    popularity_score: 92, exclusivity_score: 88, est_audience: 80000,
    est_ticket_price_min: 145, est_ticket_price_max: 18500, currency: 'USD',
    vip_packages: [
      { name: 'First Choice', price: 5500, perks: ['24h early access','Private collector lounge','Curator-led tour','Champagne reception'] },
      { name: 'Patron Suite', price: 18500, perks: ['Private viewing room','Personal art advisor','Jet transfer Miami↔NYC','Yacht after-party'] },
    ],
    sponsor_packages: [
      { tier: 'Gold', price: 250000, deliverables: ['On-fair lounge branding','Logo on VIP cards','3 collector-dinner activations'], target_companies: ['Private bank','Luxury auto','Crypto fund'] },
      { tier: 'Platinum', price: 750000, deliverables: ['Naming rights "Sponsor Lounge"','Top-tier passes ×40','Co-branded after-party'], target_companies: ['LVMH','Rolex','Citi Private Bank'] },
    ],
    concierge_offer: {
      pitch: 'Land in Miami the morning of preview, skip the line at 11am, dinner at Joe\'s, after-party at Faena.',
      bundle: ['Art Basel First-Choice ticket','LHR/JFK→MIA business class','Faena Hotel suite (3 nights)','Private SUV transfers','Joe\'s Stone Crab reservation'],
      upsell: ['Fly in by private jet','Yacht after-party access','Personal art advisor on-call'],
    },
    sales_target_segments: ['hnw_americas','tech_execs','crypto_founders','family_office_eu'],
    tags: ['art','collectors','vip-preview','miami'],
    pushed_to_concierge: true, pushed_to_sales: true,
    created_at: new Date(now - 2 * 3600_000).toISOString(),
  },
  {
    id: 'd-evt-2', director: 'events', category: 'conference',
    title: 'Web Summit Lisbon — Founder Track',
    summary: 'Europe\'s largest tech conference. 70k+ attendees, 2.5k startups. Founder Track gives front-row keynote seating + curated investor mixer.',
    city: 'Lisbon', country: 'Portugal', venue: 'Altice Arena',
    start_at: inDays(18), url: 'https://websummit.com',
    popularity_score: 88, exclusivity_score: 62, est_audience: 70000,
    est_ticket_price_min: 950, est_ticket_price_max: 9500, currency: 'EUR',
    vip_packages: [
      { name: 'Founder Pass', price: 2200, perks: ['Reserved keynote seating','Investor mixer','Curated 1:1s'] },
      { name: 'Executive Lounge', price: 9500, perks: ['Private meeting rooms','Daily breakfast w/ speakers','Airport fast-track'] },
    ],
    sponsor_packages: [
      { tier: 'Silver', price: 75000, deliverables: ['Booth 6m²','Logo on founder microsite','Investor mixer slot'], target_companies: ['Cloud SaaS','Dev tools','Fintech'] },
    ],
    concierge_offer: {
      pitch: 'Three days of founder track + investor dinners — we\'ll handle the LX↔airport transfers and book the right rooftop.',
      bundle: ['Founder Pass','Lisbon biz-class flight','Memmo Alfama hotel','Daily transfers','Belcanto dinner'],
      upsell: ['Add cofounder pass','Pre-conf strategy sprint','Photographer for keynote'],
    },
    sales_target_segments: ['tech_execs','vc_eu','solo_founders'],
    tags: ['tech','startup','networking','lisbon'],
    pushed_to_concierge: true, pushed_to_sales: false,
    created_at: new Date(now - 4 * 3600_000).toISOString(),
  },
  {
    id: 'd-evt-3', director: 'events', category: 'festival',
    title: 'Tomorrowland — Mainstage Weekend 2',
    summary: 'Belgian electronic festival, 400k attendees across two weekends. Mainstage Comfort and Cabana suites are the only credible HNW way to attend.',
    city: 'Boom', country: 'Belgium', venue: 'De Schorre',
    start_at: inDays(52), url: 'https://www.tomorrowland.com',
    popularity_score: 95, exclusivity_score: 70, est_audience: 200000,
    est_ticket_price_min: 380, est_ticket_price_max: 12000, currency: 'EUR',
    vip_packages: [
      { name: 'Mainstage Comfort', price: 1800, perks: ['Premium viewing deck','Open bar','Restroom access'] },
      { name: 'Cabana Suite', price: 12000, perks: ['Private cabana for 8','Bottle service','Helicopter transfer Brussels↔site'] },
    ],
    sponsor_packages: [
      { tier: 'Bronze', price: 45000, deliverables: ['Bar branding','Cabana giveaway'], target_companies: ['Premium spirits','Energy drinks'] },
    ],
    concierge_offer: {
      pitch: 'Helicopter in from Brussels, Cabana for your group, full ground crew on standby.',
      bundle: ['Cabana Suite ×8','BRU airport meet & greet','Helicopter transfer','Hotel Amigo Brussels'],
      upsell: ['Private chef on cabana','Pre-festival yacht day Antwerp'],
    },
    sales_target_segments: ['crypto_founders','tech_execs','hnw_eu'],
    tags: ['music','edm','festival','helicopter'],
    pushed_to_concierge: false, pushed_to_sales: true,
    created_at: new Date(now - 6 * 3600_000).toISOString(),
  },

  // ── SPORTS ───────────────────────────────────────────────────────
  {
    id: 'd-spt-1', director: 'sports', category: 'f1',
    title: 'F1 Monaco Grand Prix — Paddock Club',
    summary: 'The crown-jewel race. Paddock Club is the only way to see the harbour and have direct paddock access.',
    city: 'Monte Carlo', country: 'Monaco', venue: 'Circuit de Monaco',
    start_at: inDays(44), url: 'https://www.formula1.com/en/racing/2026/monaco',
    popularity_score: 99, exclusivity_score: 96, est_audience: 200000,
    est_ticket_price_min: 6800, est_ticket_price_max: 28000, currency: 'EUR',
    vip_packages: [
      { name: 'Paddock Club 3-day', price: 12500, perks: ['Trackside terrace','Pit lane walks','Open bar & gourmet','Driver appearances'] },
      { name: 'Yacht Hospitality', price: 28000, perks: ['Private yacht in harbour','Helicopter Nice↔Monaco','Champagne brunch','Race-night party'] },
    ],
    sponsor_packages: [
      { tier: 'Platinum', price: 1500000, deliverables: ['Co-branded yacht reception','Driver meet & greet for clients ×20','Logo on Paddock Club menus'], target_companies: ['Private bank','Luxury watch','Aviation'] },
    ],
    concierge_offer: {
      pitch: 'Helicopter from Nice, yacht in the harbour, paddock walk Saturday — the textbook Monaco weekend.',
      bundle: ['Paddock Club 3-day','Helicopter NCE↔Monaco','Hotel de Paris suite','Yacht hospitality Sunday','La Vague d\'Or dinner'],
      upsell: ['Private jet to Nice','After-race Cap-Ferrat day','Driver pit-walk add-on'],
    },
    sales_target_segments: ['hnw_eu','family_office_global','luxury_brands'],
    tags: ['f1','monaco','paddock','yacht'],
    pushed_to_concierge: true, pushed_to_sales: true,
    created_at: new Date(now - 1 * 3600_000).toISOString(),
  },
  {
    id: 'd-spt-2', director: 'sports', category: 'motogp',
    title: 'MotoGP Mugello — Italian GP VIP Village',
    summary: 'Tuscan-hills round, the loudest weekend in MotoGP. VIP Village wraps trackside grandstand + paddock access.',
    city: 'Scarperia', country: 'Italy', venue: 'Mugello Circuit',
    start_at: inDays(60), url: 'https://www.motogp.com',
    popularity_score: 84, exclusivity_score: 78, est_audience: 90000,
    est_ticket_price_min: 1900, est_ticket_price_max: 5800, currency: 'EUR',
    vip_packages: [
      { name: 'VIP Village 3-day', price: 2400, perks: ['Trackside grandstand','Paddock tour','Italian buffet & wine'] },
      { name: 'Paddock Pass', price: 5800, perks: ['Pit lane access','Rider hospitality','Helicopter Florence↔circuit'] },
    ],
    sponsor_packages: [
      { tier: 'Gold', price: 180000, deliverables: ['Branding inside VIP Village','Rider photo session for guests'], target_companies: ['Auto','Energy drinks','Streaming platform'] },
    ],
    concierge_offer: {
      pitch: 'Stay in Florence, helicopter to Mugello, full paddock access, dinner at Cibreo.',
      bundle: ['Paddock Pass 3-day','Florence biz flight','Four Seasons Florence suite','Helicopter transfer','Cibreo dinner'],
      upsell: ['Tuscan vineyard day','Private Ferrari Tailor Made visit Maranello'],
    },
    sales_target_segments: ['hnw_eu','italian_industrialists','collectors'],
    tags: ['motogp','italy','helicopter','tuscany'],
    pushed_to_concierge: true, pushed_to_sales: false,
    created_at: new Date(now - 5 * 3600_000).toISOString(),
  },
  {
    id: 'd-spt-3', director: 'sports', category: 'nba',
    title: 'NBA Finals — Courtside (TBD venue)',
    summary: 'Best two teams in basketball, June. Courtside seats run $35k–$120k+ depending on game and team. We hold inventory each year.',
    city: 'TBD', country: 'USA', venue: 'TBD',
    start_at: inDays(50), url: 'https://www.nba.com/playoffs',
    popularity_score: 96, exclusivity_score: 94, est_audience: 20000,
    est_ticket_price_min: 35000, est_ticket_price_max: 120000, currency: 'USD',
    vip_packages: [
      { name: 'Courtside Single Game', price: 65000, perks: ['Front-row seats','Tunnel club','Player-handshake line access'] },
      { name: 'Series VIP', price: 220000, perks: ['Courtside ×3 home games','Hotel + jet','Private suite if traveling'] },
    ],
    sponsor_packages: [
      { tier: 'Platinum', price: 950000, deliverables: ['Half-court signage','Tunnel club takeover one game','MVP hospitality experience'], target_companies: ['Crypto exchange','Luxury auto','Premium spirits'] },
    ],
    concierge_offer: {
      pitch: 'We secure courtside, jet you in same-day, dinner at the city\'s best chophouse, post-game lounge access.',
      bundle: ['Courtside seats','Private jet to host city','Four Seasons / Aman suite','Black SUV','Steakhouse reservation'],
      upsell: ['Add Game 7 hold','Player photo opportunity if available'],
    },
    sales_target_segments: ['hnw_americas','crypto_founders','tech_execs'],
    tags: ['nba','finals','courtside','jet'],
    pushed_to_concierge: false, pushed_to_sales: true,
    created_at: new Date(now - 8 * 3600_000).toISOString(),
  },
  {
    id: 'd-spt-4', director: 'sports', category: 'rugby_7s',
    title: 'HSBC Sevens — Singapore Stop',
    summary: 'Two-day rugby festival, 50k attendees, fancy-dress crowd. Premium suites are the corporate move.',
    city: 'Singapore', country: 'Singapore', venue: 'Singapore National Stadium',
    start_at: inDays(40), url: 'https://www.world.rugby/sevens-series',
    popularity_score: 78, exclusivity_score: 65, est_audience: 50000,
    est_ticket_price_min: 220, est_ticket_price_max: 4200, currency: 'SGD',
    vip_packages: [
      { name: 'Premium Suite (10pax)', price: 4200, perks: ['Climate-controlled suite','Open bar','Asian + Western buffet'] },
    ],
    sponsor_packages: [
      { tier: 'Silver', price: 95000, deliverables: ['Suite branding','Logo on player tunnel','Stadium screen mentions'], target_companies: ['Bank','Airline','Telco'] },
    ],
    concierge_offer: {
      pitch: 'Premium suite for the team, Marina Bay hotel, Burnt Ends tasting menu Saturday.',
      bundle: ['Premium Suite ×10','SQ business class','Marina Bay Sands suite','Burnt Ends omakase','Helicopter Sentosa transfer'],
      upsell: ['Add corporate-team building day','F1 Pit Building tour'],
    },
    sales_target_segments: ['apac_corporates','expat_execs','singapore_hnw'],
    tags: ['rugby','sevens','singapore','corporate'],
    pushed_to_concierge: true, pushed_to_sales: true,
    created_at: new Date(now - 10 * 3600_000).toISOString(),
  },

  // ── VIP ──────────────────────────────────────────────────────────
  {
    id: 'd-vip-1', director: 'vip', category: 'gala',
    title: 'amfAR Cinema Against AIDS — Cannes Gala',
    summary: 'The Cannes Film Festival\'s most coveted black-tie. A-list dinner + auction at Hôtel du Cap-Eden-Roc.',
    city: 'Antibes', country: 'France', venue: 'Hôtel du Cap-Eden-Roc',
    start_at: inDays(38), url: 'https://www.amfar.org',
    popularity_score: 90, exclusivity_score: 99, est_audience: 1200,
    est_ticket_price_min: 12000, est_ticket_price_max: 150000, currency: 'USD',
    vip_packages: [
      { name: 'Single Seat', price: 12000, perks: ['Cocktail hour','3-course dinner','Auction paddle access'] },
      { name: 'Premier Table (10pax)', price: 150000, perks: ['Front-section table','VIP red-carpet arrival','Hotel block at du Cap'] },
    ],
    sponsor_packages: [
      { tier: 'Underwriter', price: 500000, deliverables: ['Stage moment','Co-branded auction lot','PR halo across festival'], target_companies: ['Luxury watch','LVMH brand','Private jet'] },
    ],
    concierge_offer: {
      pitch: 'Black-tie weekend on the Côte d\'Azur — we secure the seat, the suite, the chopper from Nice.',
      bundle: ['amfAR seat','NCE→Cannes helicopter','Hôtel du Cap suite (4 nights)','Tailoring concierge for tux','Yacht day Tuesday'],
      upsell: ['Add photographer at red carpet','Pre-gala styling at Mainbocher'],
    },
    sales_target_segments: ['hnw_global','crypto_founders','luxury_brands'],
    tags: ['gala','cannes','black-tie','yacht'],
    pushed_to_concierge: true, pushed_to_sales: true,
    created_at: new Date(now - 3 * 3600_000).toISOString(),
  },
  {
    id: 'd-vip-2', director: 'vip', category: 'fashion_week',
    title: 'Paris Fashion Week — Front-Row & After-Parties',
    summary: 'Front-row seats at 3 marquee shows + invite-only after-parties at Costes / Castel.',
    city: 'Paris', country: 'France', venue: 'Multiple ateliers',
    start_at: inDays(72), url: 'https://www.modeaparis.com',
    popularity_score: 87, exclusivity_score: 96, est_audience: 5000,
    est_ticket_price_min: 8500, est_ticket_price_max: 45000, currency: 'EUR',
    vip_packages: [
      { name: 'Front-Row Trio', price: 18500, perks: ['Front-row at 3 shows','Backstage pass at one','Driver for 4 days'] },
      { name: 'Atelier Insider', price: 45000, perks: ['Front-row at 5 shows','Private atelier visit','After-party access ×3','Personal stylist'] },
    ],
    sponsor_packages: [
      { tier: 'Gold', price: 220000, deliverables: ['Co-branded after-party','Editorial seeding 3 outlets'], target_companies: ['Luxury beauty','Private bank','Champagne'] },
    ],
    concierge_offer: {
      pitch: 'A week in Paris, front-row at the right shows, a stylist on-call, and the after-party invites in your inbox.',
      bundle: ['Front-Row Trio','CDG Concorde lounge access','Le Bristol suite (5 nights)','Stylist on-call','Costes after-party invites'],
      upsell: ['Add private atelier appointment','Helicopter to Versailles dinner'],
    },
    sales_target_segments: ['hnw_global','luxury_brands','content_creators_premium'],
    tags: ['fashion','paris','frontrow','after-party'],
    pushed_to_concierge: true, pushed_to_sales: true,
    created_at: new Date(now - 7 * 3600_000).toISOString(),
  },
  {
    id: 'd-vip-3', director: 'vip', category: 'yacht_party',
    title: 'Monaco Yacht Show — After-Party Circuit',
    summary: 'Three nights of invite-only superyacht parties post-show. Access is the only currency that matters.',
    city: 'Monte Carlo', country: 'Monaco', venue: 'Port Hercules',
    start_at: inDays(28), url: 'https://www.monacoyachtshow.com',
    popularity_score: 82, exclusivity_score: 92, est_audience: 8000,
    est_ticket_price_min: 4500, est_ticket_price_max: 22000, currency: 'EUR',
    vip_packages: [
      { name: 'Show + 2 Parties', price: 6500, perks: ['Day-pass to show','Two superyacht parties','Driver in-Monaco'] },
      { name: 'Full Circuit (3 nights)', price: 22000, perks: ['Captain\'s tour of 5 yachts','All 3 marquee parties','Concierge on-call','Hotel de Paris suite'] },
    ],
    sponsor_packages: [
      { tier: 'Platinum', price: 380000, deliverables: ['Branded yacht for the week','Captain\'s reception co-host','Photographer on-board'], target_companies: ['Private bank','Watchmaker','Yacht broker'] },
    ],
    concierge_offer: {
      pitch: 'Three nights, three yachts, the right hostess on each — we hold the doors.',
      bundle: ['Full Circuit pass','NCE→Monaco helicopter','Hotel de Paris suite','Captain\'s reception co-host','La Vague d\'Or dinner'],
      upsell: ['Add yacht charter day off Cap-Ferrat','Private security detail'],
    },
    sales_target_segments: ['hnw_eu','crypto_founders','family_office_global'],
    tags: ['yacht','monaco','after-party','helicopter'],
    pushed_to_concierge: false, pushed_to_sales: true,
    created_at: new Date(now - 12 * 3600_000).toISOString(),
  },
];

// ─── Director config ────────────────────────────────────────────────
const DIRECTORS: Record<Director, { label: string; icon: any; tagline: string; color: string; }> = {
  events: { label: 'Global Event Director', icon: CalendarDays, tagline: 'Concerts, festivals, conferences, art fairs, premieres', color: 'hsl(220 80% 60%)' },
  sports: { label: 'Global Sports Director', icon: Trophy, tagline: 'F1, MotoGP, NBA, NFL, rugby, tennis, golf, UFC', color: 'hsl(160 70% 45%)' },
  vip:    { label: 'Global VIP Director',    icon: Crown,   tagline: 'Galas, fashion week, paddock club, yacht parties, retreats', color: 'hsl(43 96% 56%)' },
};

// ─── Helpers ────────────────────────────────────────────────────────
const fmtMoney = (n?: number | null, c = 'USD') =>
  n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(n);

const dateFmt = (iso: string | null) => {
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

// ─── Component ──────────────────────────────────────────────────────
const AdminDirectors: React.FC = () => {
  const { isDemoMode } = useStaffRole();
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<Record<Director, boolean>>({ events: false, sports: false, vip: false });
  const [activeTab, setActiveTab] = useState<Director | 'all'>('all');

  useEffect(() => { document.title = 'Back Office — AI Directors · SuperNomad'; }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_ai_opportunities' as any)
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(60);
      if (error) throw error;
      const live = (data ?? []) as unknown as Opportunity[];
      // If nothing live yet, fall back to rich demo
      setOpps(live.length ? live : DEMO_OPPS);
    } catch (e) {
      console.warn('Directors load fallback:', e);
      setOpps(DEMO_OPPS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const runDirector = async (director: Director) => {
    setRunning((s) => ({ ...s, [director]: true }));
    const t = toast.loading(`${DIRECTORS[director].label} sourcing…`);
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-directors', {
        body: { director, trigger: 'manual', scope: 'sweep' },
      });
      if (error) throw error;
      if ((data as any)?.ok) {
        toast.success(
          `${DIRECTORS[director].label}: ${(data as any).opportunities_created ?? 0} opportunities, ${(data as any).pushed_recommendations ?? 0} pushed to Sales/Concierge`,
          { id: t },
        );
        await loadAll();
      } else {
        toast.error(`Director error: ${(data as any)?.error ?? 'unknown'}`, { id: t });
      }
    } catch (e: any) {
      toast.error(`Could not run director: ${e?.message ?? e}`, { id: t });
    } finally {
      setRunning((s) => ({ ...s, [director]: false }));
    }
  };

  const pushToConciergeAndSales = async (id: string) => {
    if (id.startsWith('d-')) {
      // Demo row — update locally only
      setOpps((s) => s.map((o) => (o.id === id ? { ...o, pushed_to_concierge: true, pushed_to_sales: true } : o)));
      toast.success('Pushed to Concierge & Sales (demo)');
      return;
    }
    const { error } = await supabase
      .from('admin_ai_opportunities' as any)
      .update({ pushed_to_concierge: true, pushed_to_sales: true } as any)
      .eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Pushed to Concierge & Sales'); await loadAll(); }
  };

  // ── Per-director stats (computed from current rows) ──────────────
  const stats = useMemo(() => {
    const base = (d: Director) => {
      const rows = opps.filter((o) => o.director === d);
      const totalRevenuePotential = rows.reduce((s, o) => {
        const vip = (o.vip_packages ?? []).reduce((a, p) => a + (p.price ?? 0), 0);
        const sp = (o.sponsor_packages ?? []).reduce((a, p) => a + (p.price ?? 0), 0);
        return s + vip + sp;
      }, 0);
      return {
        count: rows.length,
        pushedConcierge: rows.filter((o) => o.pushed_to_concierge).length,
        pushedSales: rows.filter((o) => o.pushed_to_sales).length,
        sponsorTotal: rows.reduce((s, o) => s + (o.sponsor_packages?.length ?? 0), 0),
        revenuePotential: totalRevenuePotential,
      };
    };
    return { events: base('events'), sports: base('sports'), vip: base('vip') };
  }, [opps]);

  const visibleOpps = useMemo(() => (activeTab === 'all' ? opps : opps.filter((o) => o.director === activeTab)), [activeTab, opps]);

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
              <h1 className="text-2xl font-semibold tracking-tight">AI Directors</h1>
              <p className="text-sm text-[hsl(30_12%_70%)]">
                24/7 sourcing of premium events, sports & VIP opportunities. Auto-syncs with Sales, Marketing & Concierge AI.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" /> LIVE 24/7
          </Badge>
          {isDemoMode && (
            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30">Demo</Badge>
          )}
          <Button variant="outline" size="sm" onClick={loadAll} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Director worker cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {(['events', 'sports', 'vip'] as Director[]).map((d) => {
          const cfg = DIRECTORS[d];
          const Icon = cfg.icon;
          const s = stats[d];
          return (
            <Card key={d} className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.2)] p-5">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="h-11 w-11 rounded-lg flex items-center justify-center"
                  style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}55` }}
                >
                  <Icon className="h-5 w-5" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">{cfg.label}</div>
                  <div className="text-xs text-[hsl(30_12%_70%)]">{cfg.tagline}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="rounded-md bg-[hsl(220_22%_8%)] p-2.5 border border-[hsl(43_96%_56%/0.1)]">
                  <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)]">Active opps</div>
                  <div className="text-lg font-semibold text-white">{s.count}</div>
                </div>
                <div className="rounded-md bg-[hsl(220_22%_8%)] p-2.5 border border-[hsl(43_96%_56%/0.1)]">
                  <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)]">Sponsor packages</div>
                  <div className="text-lg font-semibold text-white">{s.sponsorTotal}</div>
                </div>
                <div className="rounded-md bg-[hsl(220_22%_8%)] p-2.5 border border-[hsl(43_96%_56%/0.1)]">
                  <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)]">Pushed → Concierge</div>
                  <div className="text-lg font-semibold text-emerald-400">{s.pushedConcierge}</div>
                </div>
                <div className="rounded-md bg-[hsl(220_22%_8%)] p-2.5 border border-[hsl(43_96%_56%/0.1)]">
                  <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)]">Pushed → Sales</div>
                  <div className="text-lg font-semibold" style={{ color: cfg.color }}>{s.pushedSales}</div>
                </div>
              </div>

              <div className="text-xs text-[hsl(30_12%_70%)] mb-3">
                Revenue potential (sum of all VIP + sponsor list prices):{' '}
                <span className="text-white font-semibold">{fmtMoney(s.revenuePotential)}</span>
              </div>

              <Button
                size="sm"
                onClick={() => runDirector(d)}
                disabled={running[d]}
                className="w-full"
                style={{ background: cfg.color, color: '#0b0b0b' }}
              >
                {running[d] ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Zap className="h-4 w-4 mr-1.5" />}
                {running[d] ? 'Sourcing…' : 'Run a fresh sweep'}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Opportunities feed */}
      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="font-semibold text-white">Opportunity feed</div>
            <div className="text-xs text-[hsl(30_12%_70%)]">
              Every row is bundleable by Concierge AI (ticket + flight + hotel + transport) and sellable to sponsors by Sales AI.
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="bg-[hsl(220_22%_8%)]">
              <TabsTrigger value="all">All ({opps.length})</TabsTrigger>
              <TabsTrigger value="events">Events ({stats.events.count})</TabsTrigger>
              <TabsTrigger value="sports">Sports ({stats.sports.count})</TabsTrigger>
              <TabsTrigger value="vip">VIP ({stats.vip.count})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {visibleOpps.map((o) => {
            const cfg = DIRECTORS[o.director];
            const Icon = cfg.icon;
            return (
              <div
                key={o.id}
                className="rounded-lg bg-[hsl(220_22%_8%)] border border-[hsl(43_96%_56%/0.12)] p-4 hover:border-[hsl(43_96%_56%/0.3)] transition-colors"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="h-8 w-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}55` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-[10px] uppercase border-[hsl(43_96%_56%/0.3)] text-[hsl(var(--gold))]">
                        {o.category.replace(/_/g, ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]" style={{ color: cfg.color, borderColor: `${cfg.color}55` }}>
                        {o.director}
                      </Badge>
                      {o.pushed_to_concierge && (
                        <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30">In Concierge</Badge>
                      )}
                      {o.pushed_to_sales && (
                        <Badge className="text-[10px] bg-blue-500/15 text-blue-400 border-blue-500/30">In Sales</Badge>
                      )}
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

                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="rounded bg-[hsl(220_22%_6%)] p-2 border border-[hsl(43_96%_56%/0.1)]">
                    <div className="text-[10px] text-[hsl(30_12%_60%)]">Popularity</div>
                    <div className="font-semibold text-white">{Math.round(o.popularity_score)}</div>
                  </div>
                  <div className="rounded bg-[hsl(220_22%_6%)] p-2 border border-[hsl(43_96%_56%/0.1)]">
                    <div className="text-[10px] text-[hsl(30_12%_60%)]">Exclusivity</div>
                    <div className="font-semibold text-[hsl(var(--gold))]">{Math.round(o.exclusivity_score)}</div>
                  </div>
                  <div className="rounded bg-[hsl(220_22%_6%)] p-2 border border-[hsl(43_96%_56%/0.1)]">
                    <div className="text-[10px] text-[hsl(30_12%_60%)]">Ticket range</div>
                    <div className="font-semibold text-white">
                      {o.est_ticket_price_min ? fmtMoney(o.est_ticket_price_min, o.currency) : '—'}–{o.est_ticket_price_max ? fmtMoney(o.est_ticket_price_max, o.currency) : '—'}
                    </div>
                  </div>
                </div>

                {/* Concierge bundle */}
                {o.concierge_offer?.pitch && (
                  <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 p-2.5 mb-2.5">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                      <Plane className="h-3 w-3" /> Concierge sales bundle
                    </div>
                    <div className="text-xs text-white italic mb-1.5">"{o.concierge_offer.pitch}"</div>
                    {o.concierge_offer.bundle && (
                      <div className="flex flex-wrap gap-1">
                        {o.concierge_offer.bundle.slice(0, 6).map((b, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Sponsor packages */}
                {o.sponsor_packages?.length > 0 && (
                  <div className="rounded-md bg-blue-500/5 border border-blue-500/20 p-2.5 mb-2.5">
                    <div className="text-[10px] uppercase tracking-wider text-blue-400 flex items-center gap-1 mb-1">
                      <Megaphone className="h-3 w-3" /> Sponsor packages ({o.sponsor_packages.length})
                    </div>
                    <div className="space-y-1">
                      {o.sponsor_packages.slice(0, 2).map((sp, i) => (
                        <div key={i} className="text-xs text-white/90 flex items-center justify-between gap-2">
                          <span className="truncate">
                            <span className="font-semibold">{sp.tier}</span>
                            <span className="text-[hsl(30_12%_60%)]"> · {(sp.target_companies ?? []).slice(0, 2).join(', ') || 'open to all'}</span>
                          </span>
                          <span className="font-semibold text-blue-300 shrink-0">{fmtMoney(sp.price, o.currency)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* VIP packages */}
                {o.vip_packages?.length > 0 && (
                  <div className="rounded-md bg-[hsl(43_96%_56%/0.05)] border border-[hsl(43_96%_56%/0.2)] p-2.5 mb-3">
                    <div className="text-[10px] uppercase tracking-wider text-[hsl(var(--gold))] flex items-center gap-1 mb-1">
                      <TicketCheck className="h-3 w-3" /> VIP packages ({o.vip_packages.length})
                    </div>
                    <div className="space-y-1">
                      {o.vip_packages.slice(0, 2).map((vp, i) => (
                        <div key={i} className="text-xs text-white/90 flex items-center justify-between gap-2">
                          <span className="truncate">{vp.name}</span>
                          <span className="font-semibold text-[hsl(var(--gold))] shrink-0">{fmtMoney(vp.price, o.currency)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Targets + actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[hsl(43_96%_56%/0.1)]">
                  <div className="text-[10px] text-[hsl(30_12%_60%)] flex items-center gap-1 min-w-0 flex-1">
                    <Users className="h-3 w-3 shrink-0" />
                    <span className="truncate">{(o.sales_target_segments ?? []).slice(0, 3).join(' · ') || '—'}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {o.url && (
                      <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <a href={o.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" /> Source
                        </a>
                      </Button>
                    )}
                    {!(o.pushed_to_concierge && o.pushed_to_sales) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => pushToConciergeAndSales(o.id)}
                      >
                        <Building2 className="h-3 w-3 mr-1" /> Push to Concierge & Sales
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && visibleOpps.length === 0 && (
            <div className="col-span-full text-center text-[hsl(30_12%_60%)] py-12">
              No opportunities yet. Run a director sweep above.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDirectors;
