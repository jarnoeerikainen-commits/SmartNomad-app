// ═══════════════════════════════════════════════════════════════════
// Concierge Greetings — thousands of WOW openers
// ───────────────────────────────────────────────────────────────────
// Generates a multi-part staggered greeting (ping-pong style) that
// varies by: time of day, personality mode, travel mode, location,
// persona context, weather hints — and a randomized garnish so two
// visits are almost never the same.
// ═══════════════════════════════════════════════════════════════════

import type { PersonalityMode } from '@/components/ConciergeSettings';

export interface GreetingContext {
  aiName: string;
  userName?: string;
  city?: string;
  country?: string;
  mode: PersonalityMode;
  travelMode?: 'personal' | 'business';
  nextTrip?: { destination: string; dates: string; purpose?: string };
  isReturning?: boolean;
}

export type GreetingPart = { content: string; delay: number };

// ─── Time of day ─────────────────────────────────────────────────
type TimeBand = 'late_night' | 'early_morning' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';

function getTimeBand(d = new Date()): TimeBand {
  const h = d.getHours();
  if (h < 5) return 'late_night';
  if (h < 8) return 'early_morning';
  if (h < 12) return 'morning';
  if (h < 14) return 'midday';
  if (h < 18) return 'afternoon';
  if (h < 22) return 'evening';
  return 'night';
}

const TIME_OPENERS: Record<TimeBand, string[]> = {
  late_night: ['Burning the midnight oil', 'Up at this hour', 'Night owl mode', 'The world is asleep — but we are not', 'Hello, midnight wanderer'],
  early_morning: ['Early start', 'Catching the sunrise', 'Up before the city', 'First light', 'The day is yours'],
  morning: ['Good morning', 'Morning', 'Fresh start', 'Hope your coffee is strong', 'Bright morning'],
  midday: ['Midday check-in', 'Lunchtime', 'Hope you are eating well', 'Quick pit stop?', 'Halfway through the day'],
  afternoon: ['Good afternoon', 'Afternoon', 'Hope the day is treating you right', 'Midweek momentum', 'Sunlit hours'],
  evening: ['Good evening', 'Evening', 'Winding down or just getting started?', 'Golden hour', 'Hope today went your way'],
  night: ['Good night vibes', 'The day is done', 'Nightfall', 'Cosy hours', 'Lights down, plans up'],
};

const TIME_OPENERS_HUMOR: Record<TimeBand, string[]> = {
  late_night: ['🦇 Vampire hours, I respect it', '🌙 The stars and I are your only witnesses', '😴 Sleep is overrated, plans are forever'],
  early_morning: ['☀️ Look who beat the alarm clock', '🌅 The sunrise has competition today', '💪 Early birds get the upgrades'],
  morning: ['☕ Caffeine secured, world incoming', '🌞 Morning, sunshine', '🐦 Up and at ‘em'],
  midday: ['🥗 Lunch break or sneaky planning session?', '☀️ Peak daylight — peak ambition', '🍴 Hope you are not skipping meals on me'],
  afternoon: ['🥤 Afternoon slump? Not on my watch', '😎 Cruising into the back half of the day', '☕ Round two of caffeine?'],
  evening: ['🍷 Glass half full kind of evening', '🌆 City lights coming on', '🎶 Evening playlist queued'],
  night: ['🌙 Stars out, plans on', '🛋️ Cosy mode engaged', '✨ Night-time ideas are the best ideas'],
};

const TIME_OPENERS_STRICT: Record<TimeBand, string[]> = {
  late_night: ['Late session', 'Off-hours active'],
  early_morning: ['Early operations', 'Pre-business hours'],
  morning: ['Morning briefing', 'Day shift active'],
  midday: ['Midday status', 'Operational'],
  afternoon: ['Afternoon ops', 'Active'],
  evening: ['Evening shift', 'Active'],
  night: ['Night ops', 'Active'],
};

const TIME_OPENERS_DARK: Record<TimeBand, string[]> = {
  late_night: ['Insomnia, or just dread? Either way I am here', 'Awake at this hour — bold of you'],
  early_morning: ['Up this early on purpose? Brave', 'The sun and I are equally surprised to see you'],
  morning: ['Mornings are a social construct, but here we are', 'You survived the night. Congratulations'],
  midday: ['Halfway through another day. Riveting', 'Lunch, the only honest meal'],
  afternoon: ['The slow march toward evening continues', 'Afternoon — society’s least interesting hour'],
  evening: ['The day is dying. Fitting', 'Evening — when the regrets check in'],
  night: ['The void is comfortable, isn’t it?', 'Another night, another opportunity to overthink'],
};

// ─── Mood "wow" lines (line 2 of the greeting) ────────────────────
const WOW_LINES_NORMAL = [
  'I’ve already pulled your context — calendar, location, tracked countries, the lot.',
  'Everything you’ve told the app is loaded. I’m ready when you are.',
  'I have your trips, profile and preferences in mind. Nothing for you to repeat.',
  'I’m running quiet in the background — your data stays on your device.',
  'Local knowledge is warm, your loyalty programs are mapped, and I’m on standby.',
  'I’ve scanned your tracked countries and upcoming dates. All clear so far.',
  'I’ve pre-loaded the boring bits so you can ask the interesting questions.',
];

const WOW_LINES_HUMOR = [
  'I read your calendar so you don’t have to. You’re welcome. 😎',
  'I know your loyalty status, your favourite cuisines, and probably your sleep schedule. Don’t worry — secret’s safe. 🤐',
  'Powered by caffeine I cannot drink and ambition I cannot spend. Let’s go. 🚀',
  'I have looked at your trips like a nosy friend, but with consent and good intentions. 🕵️',
  'I’ve done the homework. You bring the questions. Deal? 🤝',
];

const WOW_LINES_STRICT = [
  'Context loaded. Calendar, location, profile, tracked countries.',
  'Profile + trips + memory: synced.',
  'No need to repeat yourself. Begin.',
  'Operational. Awaiting input.',
];

const WOW_LINES_DARK = [
  'I know more about your itinerary than your family does. Let’s use it. 🖤',
  'Your data is loaded. Resistance is, frankly, pointless. 😌',
  'I have your context. The illusion of free will remains intact.',
  'Pre-loaded, pre-analysed, pre-judged — efficiently.',
];

// ─── Travel-mode flavour ──────────────────────────────────────────
const BUSINESS_TAILS = [
  'Lounges, fast tracks, expense-friendly bookings — pick your battle.',
  'Need a quiet hotel near a meeting, an Uber Black, or a power outlet that actually works?',
  'I can pre-stage flights, ground transport and a working lunch in three messages.',
  'If you’re billing a client, I’ll keep receipts tidy.',
];

const PERSONAL_TAILS = [
  'Want flights, a sunset spot, or a place that locals actually like?',
  'I can plan a weekend, find a quiet café, or just nudge you out the door.',
  'Tell me a vibe and I’ll match it — quiet, loud, salty, snowy, you name it.',
  'Hidden gems, food that doesn’t suck, and a hotel with a real shower? Easy.',
];

// ─── Location-aware "I see you in X" lines ────────────────────────
function locationLine(city?: string, country?: string, mode: PersonalityMode = 'normal'): string {
  if (!city && !country) return '';
  const place = city || country!;
  const variants: Record<PersonalityMode, string[]> = {
    normal: [
      `I see you’re in **${place}** right now.`,
      `Picked you up in **${place}** — local time looks good.`,
      `**${place}** on the map. I’ve got the local intel ready.`,
      `Currently somewhere around **${place}**, yes?`,
    ],
    strict: [
      `Location: **${place}**.`,
      `GPS: **${place}**.`,
      `Anchor: **${place}**.`,
    ],
    humor: [
      `Spotted you in **${place}** 👀 great taste, by the way.`,
      `**${place}** — bold choice. I approve. 🎯`,
      `Welcome (back?) to **${place}**. The locals do not know what is about to happen. 😏`,
    ],
    dark_humor: [
      `**${place}**. Of all places. Fine, we can work with that. 🖤`,
      `You are in **${place}**. I will not ask why.`,
      `**${place}** — at least it isn’t an airport. Yet.`,
    ],
  };
  return pick(variants[mode]);
}

// ─── CTA closers (3rd part) ───────────────────────────────────────
const CTA_NORMAL = [
  'So — **what’s on your mind?** Flights, a hotel, a quiet evening plan?',
  'Where shall we start? **Trip, food, transport, or something boring like insurance?**',
  'Tell me one thing on your plate and I’ll handle it.',
  '**What would make today easier?**',
];

const CTA_HUMOR = [
  'Hit me. Flights? Hotels? A pep talk? ✈️🏨💪',
  'What chaos can I organise for you today? 🌀',
  'Pick a category: travel, food, life admin, or vibes only. ✨',
];

const CTA_STRICT = [
  'State your request.',
  'Awaiting query.',
  'Specify task.',
];

const CTA_DARK = [
  'So, what impossible thing shall I make slightly less impossible? 😏',
  'Hit me with whatever it is. I’ve seen worse.',
  'Brief me. I’ll pretend to be surprised.',
];

// ─── Helpers ─────────────────────────────────────────────────────
function pick<T>(arr: T[], seed?: number): T {
  if (!arr.length) return undefined as unknown as T;
  const idx = seed != null ? Math.abs(seed) % arr.length : Math.floor(Math.random() * arr.length);
  return arr[idx];
}

// ─── Public API ──────────────────────────────────────────────────

/**
 * Build a multi-part greeting. Returns 2-3 short messages that should
 * be appended sequentially with small delays (ping-pong style).
 */
export function buildGreetingParts(ctx: GreetingContext): GreetingPart[] {
  const band = getTimeBand();
  const { aiName, userName, city, country, mode, travelMode, nextTrip } = ctx;
  const greetName = userName ? `, ${userName}` : '';

  // Part 1 — opener (time + name + AI name)
  const openerPool = mode === 'humor' ? TIME_OPENERS_HUMOR
    : mode === 'strict' ? TIME_OPENERS_STRICT
    : mode === 'dark_humor' ? TIME_OPENERS_DARK
    : TIME_OPENERS;
  const opener = pick(openerPool[band]);

  let part1: string;
  if (mode === 'strict') {
    part1 = `${opener}${greetName}. **${aiName}** online.`;
  } else if (mode === 'humor') {
    part1 = `${opener}${greetName}! It’s **${aiName}** here.`;
  } else if (mode === 'dark_humor') {
    part1 = `${opener}${greetName}. **${aiName}** reporting in. 🖤`;
  } else {
    part1 = `${opener}${greetName} 👋 I’m **${aiName}**, your concierge.`;
  }

  // Part 2 — wow + location + (optional next trip)
  const wowPool = mode === 'humor' ? WOW_LINES_HUMOR
    : mode === 'strict' ? WOW_LINES_STRICT
    : mode === 'dark_humor' ? WOW_LINES_DARK
    : WOW_LINES_NORMAL;
  const wow = pick(wowPool);
  const loc = locationLine(city, country, mode);

  let part2 = [loc, wow].filter(Boolean).join(' ');
  if (nextTrip?.destination) {
    const tripLine = mode === 'strict'
      ? ` Next trip: ${nextTrip.destination} (${nextTrip.dates}).`
      : mode === 'humor'
        ? ` Oh — and ${nextTrip.destination} (${nextTrip.dates}) is coming up. I’m already packing for you mentally. 🧳`
        : mode === 'dark_humor'
          ? ` And yes, ${nextTrip.destination} (${nextTrip.dates}) is on the horizon. Brace yourself.`
          : ` Also — your trip to **${nextTrip.destination}** (${nextTrip.dates}) is up next.`;
    part2 += tripLine;
  }

  // Part 3 — travel-mode tail + CTA
  const tailPool = travelMode === 'business' ? BUSINESS_TAILS : PERSONAL_TAILS;
  const ctaPool = mode === 'humor' ? CTA_HUMOR
    : mode === 'strict' ? CTA_STRICT
    : mode === 'dark_humor' ? CTA_DARK
    : CTA_NORMAL;
  const tail = mode === 'strict' ? '' : pick(tailPool) + ' ';
  const cta = pick(ctaPool);
  const part3 = `${tail}${cta}`.trim();

  // Stagger: opener instant, wow ~700ms, CTA ~1300ms
  return [
    { content: part1, delay: 0 },
    { content: part2, delay: 750 },
    { content: part3, delay: 1500 },
  ];
}

/**
 * Single-string fallback (joins all parts with double newlines).
 * Used by anything that still expects a single greeting string.
 */
export function buildGreetingString(ctx: GreetingContext): string {
  return buildGreetingParts(ctx).map(p => p.content).join('\n\n');
}
