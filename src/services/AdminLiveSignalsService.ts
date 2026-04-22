// ═══════════════════════════════════════════════════════════════════════════
// ADMIN LIVE SIGNALS — In-browser real-time demo simulator
// Generates a believable, never-ending stream of global user activity:
//   • Concierge questions / wishes / complaints
//   • Bookings, payments, venue discoveries
//   • Calendar happenings (meetings, flights landing, holidays starting)
//   • Support tickets, churn pings, growth events
//
// 100% client-side so demos work without backend writes. Subscribers receive
// new events at a controlled cadence (~1.5–4s) and can read aggregate KPIs.
// ═══════════════════════════════════════════════════════════════════════════

export type SignalKind =
  | 'wish'
  | 'problem'
  | 'booking'
  | 'payment'
  | 'concierge_q'
  | 'calendar'
  | 'churn_ping'
  | 'growth'
  | 'support'
  | 'discovery';

export interface LiveSignal {
  id: string;
  ts: number;
  kind: SignalKind;
  city: string;
  country: string;
  region: 'NA' | 'EU' | 'LATAM' | 'APAC' | 'MEA';
  user_alias: string; // anonymised handle, e.g. "nomad_4f12"
  persona: 'free' | 'premium' | 'business' | 'family';
  text: string;
  value_usd?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  tag?: string;
}

export interface LiveAggregate {
  total_signals: number;
  active_users_window: number;
  by_kind: Record<SignalKind, number>;
  by_region: Record<string, number>;
  revenue_window_usd: number;
  open_problems: number;
  positive_pct: number;
  top_cities: Array<{ city: string; n: number }>;
  top_wishes: Array<{ text: string; n: number }>;
  recent: LiveSignal[];
}

const CITIES: Array<{ city: string; country: string; region: LiveSignal['region'] }> = [
  { city: 'Lisbon', country: 'Portugal', region: 'EU' },
  { city: 'Berlin', country: 'Germany', region: 'EU' },
  { city: 'Barcelona', country: 'Spain', region: 'EU' },
  { city: 'London', country: 'UK', region: 'EU' },
  { city: 'Paris', country: 'France', region: 'EU' },
  { city: 'Amsterdam', country: 'Netherlands', region: 'EU' },
  { city: 'Tallinn', country: 'Estonia', region: 'EU' },
  { city: 'Zurich', country: 'Switzerland', region: 'EU' },
  { city: 'Dubai', country: 'UAE', region: 'MEA' },
  { city: 'Cape Town', country: 'South Africa', region: 'MEA' },
  { city: 'Marrakesh', country: 'Morocco', region: 'MEA' },
  { city: 'Tel Aviv', country: 'Israel', region: 'MEA' },
  { city: 'Bangkok', country: 'Thailand', region: 'APAC' },
  { city: 'Bali', country: 'Indonesia', region: 'APAC' },
  { city: 'Tokyo', country: 'Japan', region: 'APAC' },
  { city: 'Singapore', country: 'Singapore', region: 'APAC' },
  { city: 'Seoul', country: 'South Korea', region: 'APAC' },
  { city: 'Chiang Mai', country: 'Thailand', region: 'APAC' },
  { city: 'Hong Kong', country: 'China', region: 'APAC' },
  { city: 'New York', country: 'USA', region: 'NA' },
  { city: 'Miami', country: 'USA', region: 'NA' },
  { city: 'Austin', country: 'USA', region: 'NA' },
  { city: 'Toronto', country: 'Canada', region: 'NA' },
  { city: 'San Francisco', country: 'USA', region: 'NA' },
  { city: 'Mexico City', country: 'Mexico', region: 'LATAM' },
  { city: 'Buenos Aires', country: 'Argentina', region: 'LATAM' },
  { city: 'Medellin', country: 'Colombia', region: 'LATAM' },
  { city: 'São Paulo', country: 'Brazil', region: 'LATAM' },
  { city: 'Tulum', country: 'Mexico', region: 'LATAM' },
];

const WISH_TEMPLATES = [
  'I want a 2-week sailing trip in {city} next month',
  'Find me a quiet apartment near the beach in {city}',
  'Best private school for my 8-year-old in {city}?',
  'Plan a luxury anniversary weekend in {city}',
  'I need help getting a digital nomad visa for {city}',
  'Looking for a tax-friendly setup if I move to {city}',
  'Help me book a private jet from {city} to Dubai',
  'Recommend the best private chef in {city}',
  'I want to invest in real estate in {city} — where to start?',
  'Find me a Pilates studio + nutritionist near {city} centre',
  'Need a relocation package for me + 2 cats to {city}',
  'Best co-working with sea view in {city}?',
  'Help me find a SIM card and VPN for {city} this weekend',
];

const PROBLEM_TEMPLATES = [
  'My booking in {city} got cancelled last minute — what do I do?',
  'Card declined twice trying to pay a hotel in {city}',
  'Flight to {city} delayed 6h, need lounge access',
  'Lost my passport in {city} — nearest embassy?',
  'AirBnB host in {city} is asking for cash off-platform',
  'Concierge gave me wrong restaurant address in {city}',
  'Visa rejection for {city} — can the AI advisor help?',
  'Tax form deadline for {city} residency tomorrow!',
  'AQI in {city} is 180 — need a clean-air hotel ASAP',
];

const CONCIERGE_Q = [
  'Best vegan restaurants in {city}?',
  'Is it safe to walk at night in {city}?',
  'Cheapest direct flight from {city} to Lisbon?',
  'Co-working with private phone booths in {city}?',
  'Are dogs allowed in restaurants in {city}?',
  'What\'s the etiquette for tipping in {city}?',
  'Any expat events in {city} this week?',
  'Where can I get a covid booster in {city}?',
  'Public holidays affecting my trip to {city}?',
];

const CALENDAR_EVENTS = [
  'Flight landing in {city} in 2h',
  'Investor call from {city} office',
  'Visa appointment in {city} tomorrow 10:00',
  'Yoga class in {city} starting now',
  'Tax filing deadline for {city} in 3 days',
  'School pickup in {city} at 15:30',
  'Doctor appointment in {city} this afternoon',
  'Co-working day pass booked in {city}',
];

const PERSONAS: LiveSignal['persona'][] = ['free', 'free', 'premium', 'premium', 'business', 'family'];

// Cadence: faster while a user is watching, slower in background.
const CADENCE_MS = 2200;

let _signals: LiveSignal[] = [];
const MAX_BUFFER = 300;
const subscribers = new Set<(s: LiveSignal[]) => void>();
let timer: number | null = null;

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randAlias(): string {
  return `nomad_${Math.random().toString(16).slice(2, 6)}`;
}

function makeSignal(): LiveSignal {
  const c = rand(CITIES);
  const persona = rand(PERSONAS);
  const kindRoll = Math.random();
  let kind: SignalKind;
  let text = '';
  let value_usd: number | undefined;
  let sentiment: LiveSignal['sentiment'] = 'neutral';
  let tag: string | undefined;

  if (kindRoll < 0.22) {
    kind = 'wish';
    text = rand(WISH_TEMPLATES).replace('{city}', c.city);
    sentiment = 'positive';
  } else if (kindRoll < 0.35) {
    kind = 'problem';
    text = rand(PROBLEM_TEMPLATES).replace('{city}', c.city);
    sentiment = 'negative';
  } else if (kindRoll < 0.55) {
    kind = 'concierge_q';
    text = rand(CONCIERGE_Q).replace('{city}', c.city);
  } else if (kindRoll < 0.68) {
    kind = 'calendar';
    text = rand(CALENDAR_EVENTS).replace('{city}', c.city);
    tag = 'calendar';
  } else if (kindRoll < 0.82) {
    kind = 'booking';
    const items = ['Hotel', 'Flight', 'Car', 'Restaurant', 'Co-working', 'Spa'];
    const item = rand(items);
    value_usd = Math.round(50 + Math.random() * 1850);
    text = `${item} booked in ${c.city} — $${value_usd}`;
    sentiment = 'positive';
    tag = item.toLowerCase();
  } else if (kindRoll < 0.9) {
    kind = 'payment';
    value_usd = Math.round(10 + Math.random() * 900);
    text = `Agentic payment $${value_usd} settled in ${c.city}`;
    sentiment = 'positive';
  } else if (kindRoll < 0.94) {
    kind = 'churn_ping';
    text = `Premium user idle 17 days in ${c.city} — sentiment dropping`;
    sentiment = 'negative';
  } else if (kindRoll < 0.97) {
    kind = 'growth';
    text = `Affiliate referral converted to premium in ${c.city}`;
    sentiment = 'positive';
    value_usd = 4.99;
  } else if (kindRoll < 0.99) {
    kind = 'support';
    text = `New ticket: ${rand(PROBLEM_TEMPLATES)}`.replace('{city}', c.city);
    sentiment = 'negative';
  } else {
    kind = 'discovery';
    text = `New venue auto-curated: ${rand(['Rooftop bar', 'Hidden bistro', 'Private lounge', 'Ocean villa'])} in ${c.city}`;
    sentiment = 'positive';
  }

  return {
    id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    kind,
    city: c.city,
    country: c.country,
    region: c.region,
    user_alias: randAlias(),
    persona,
    text,
    value_usd,
    sentiment,
    tag,
  };
}

// Seed a few hundred historical signals so KPIs look populated immediately.
function seed() {
  const now = Date.now();
  for (let i = 0; i < 80; i++) {
    const s = makeSignal();
    s.ts = now - Math.floor(Math.random() * 30 * 60_000); // last 30 min
    _signals.push(s);
  }
  _signals.sort((a, b) => a.ts - b.ts);
}

function tick() {
  // 1–3 new signals per tick to feel alive
  const n = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) _signals.push(makeSignal());
  if (_signals.length > MAX_BUFFER) _signals = _signals.slice(-MAX_BUFFER);
  subscribers.forEach((cb) => cb(_signals));
}

function ensureRunning() {
  if (timer != null) return;
  if (_signals.length === 0) seed();
  timer = window.setInterval(tick, CADENCE_MS);
}

export const AdminLiveSignalsService = {
  start() {
    ensureRunning();
  },
  stop() {
    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }
  },
  getSignals(): LiveSignal[] {
    if (_signals.length === 0) seed();
    return _signals;
  },
  subscribe(cb: (s: LiveSignal[]) => void): () => void {
    ensureRunning();
    subscribers.add(cb);
    cb(_signals);
    return () => subscribers.delete(cb);
  },
  aggregate(windowMs: number = 15 * 60_000): LiveAggregate {
    const cutoff = Date.now() - windowMs;
    const recent = _signals.filter((s) => s.ts >= cutoff);
    const by_kind = {
      wish: 0, problem: 0, booking: 0, payment: 0, concierge_q: 0,
      calendar: 0, churn_ping: 0, growth: 0, support: 0, discovery: 0,
    } as Record<SignalKind, number>;
    const by_region: Record<string, number> = { NA: 0, EU: 0, LATAM: 0, APAC: 0, MEA: 0 };
    let revenue = 0;
    let problems = 0;
    let positive = 0;
    const cityCount: Record<string, number> = {};
    const wishCount: Record<string, number> = {};
    const userSet = new Set<string>();

    for (const s of recent) {
      by_kind[s.kind] += 1;
      by_region[s.region] = (by_region[s.region] ?? 0) + 1;
      if (s.value_usd && (s.kind === 'booking' || s.kind === 'payment' || s.kind === 'growth')) {
        revenue += s.value_usd;
      }
      if (s.kind === 'problem' || s.kind === 'support') problems += 1;
      if (s.sentiment === 'positive') positive += 1;
      cityCount[s.city] = (cityCount[s.city] ?? 0) + 1;
      if (s.kind === 'wish') wishCount[s.text] = (wishCount[s.text] ?? 0) + 1;
      userSet.add(s.user_alias);
    }

    return {
      total_signals: recent.length,
      active_users_window: userSet.size,
      by_kind,
      by_region,
      revenue_window_usd: Math.round(revenue),
      open_problems: problems,
      positive_pct: recent.length > 0 ? Math.round((positive / recent.length) * 100) : 0,
      top_cities: Object.entries(cityCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([city, n]) => ({ city, n })),
      top_wishes: Object.entries(wishCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([text, n]) => ({ text, n })),
      recent: recent.slice(-30).reverse(),
    };
  },
  // Compact text snapshot for sending to AI as context
  snapshotForAI(): string {
    const a = this.aggregate(15 * 60_000);
    const lines = [
      `LIVE WINDOW: last 15 min`,
      `Signals: ${a.total_signals} from ${a.active_users_window} unique users`,
      `Revenue: $${a.revenue_window_usd} | Open problems: ${a.open_problems} | Positive sentiment: ${a.positive_pct}%`,
      `By region: ${Object.entries(a.by_region).map(([k, v]) => `${k}=${v}`).join(' ')}`,
      `By kind: ${(Object.entries(a.by_kind) as [string, number][]).filter(([, v]) => v > 0).map(([k, v]) => `${k}=${v}`).join(' ')}`,
      `Top cities: ${a.top_cities.map((c) => `${c.city}(${c.n})`).join(', ')}`,
      `Top wishes: ${a.top_wishes.map((w) => `• ${w.text} ×${w.n}`).join(' | ') || 'n/a'}`,
      ``,
      `RECENT EVENTS (most recent first):`,
      ...a.recent.slice(0, 18).map((s) => {
        const ago = Math.max(1, Math.round((Date.now() - s.ts) / 1000));
        return `[${ago}s ago | ${s.region} ${s.city} | ${s.persona} | ${s.kind}] ${s.text}`;
      }),
    ];
    return lines.join('\n');
  },
};
