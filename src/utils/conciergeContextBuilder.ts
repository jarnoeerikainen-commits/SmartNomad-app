// ═══════════════════════════════════════════════════════════════════════════
// Concierge Context Builder — "Know-Everything" verified context bundle
// ───────────────────────────────────────────────────────────────────────────
// Gathers ALL signals available about the user from every feature in the app
// and packages them as a single context object the AI can reason over.
// Sources are tagged so the AI knows what is verified vs. inferred.
// ═══════════════════════════════════════════════════════════════════════════

import { gatherFullAppContext, buildProfileSummary, getMemoryContext } from './conciergeMemory';

type Source = 'verified' | 'self_reported' | 'inferred' | 'connected';

export interface ConciergeContextBundle {
  // High-confidence (the AI should treat these as facts)
  identity: { name?: string; nationality?: string; languages?: string[]; source: Source };
  location: { city?: string; country?: string; tz?: string; source: Source };

  // Profile & lifestyle
  profileSummary?: string;
  family?: { members: number; kidsAges?: number[]; petCount?: number; source: Source };
  work?: { role?: string; company?: string; industry?: string; mode?: 'personal' | 'business'; source: Source };

  // Travel state
  trackedCountries?: any[];
  upcomingTrips?: Array<{ destination: string; dates: string; purpose?: string }>;
  visasExpiring?: Array<{ country: string; expiresIn: string }>;

  // Lifestyle & interests (ALL the small stuff that makes a real concierge feel real)
  hobbies?: string[];
  sports?: string[];
  favoriteTeams?: string[];
  music?: { topArtists?: string[]; topGenres?: string[] };
  food?: { cuisines?: string[]; dietary?: string; alcohol?: string };
  drinks?: string[];

  // Connected services
  lifestyleConnectors?: string;
  integrations?: string;

  // Loyalty + commerce
  rewards?: { airlines?: string[]; hotels?: string[] };
  subscriptionTier?: string;
  expenseSummary?: string;

  // Calendar + reminders
  calendar?: string;

  // Memory layers
  learnedMemories?: string;          // localStorage facts
  persistentMemories?: string;        // pgvector facts (passed through from caller)
  conversationSummary?: string;       // pgvector compressed history (passed through)

  // Live signals
  threatIntelligence?: string;
  newsPreferences?: string[];
  cityServicesContext?: string;
  awardCardsContext?: string;
  jetSearchContext?: string;

  // Cultural respect
  cultural?: any;

  // Agentic/automation hints
  toolRoutingHint?: string;

  // Quality contract
  factualOnly: true;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function readJSON<T = any>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function getNewsPrefs(): string[] {
  const prefs = readJSON<{ topics?: string[] }>('newsPreferences');
  return prefs?.topics || [];
}

function getFamilySnapshot(): ConciergeContextBundle['family'] | undefined {
  // FamilyVaultService stores encrypted blob; we rely on a non-secret count cache it writes.
  const summary = readJSON<{ count?: number; kidsAges?: number[]; petCount?: number }>('sn_family_vault_summary');
  if (!summary?.count) return undefined;
  return {
    members: summary.count,
    kidsAges: summary.kidsAges,
    petCount: summary.petCount,
    source: 'self_reported',
  };
}

function getMusicAndSports(): { music?: any; sports?: string[]; favoriteTeams?: string[] } {
  // Spotify / Strava snapshots stored by LifestyleConnectorsService
  const snap = readJSON<any>('sn_lifestyle_snapshot');
  const music = snap?.music
    ? { topArtists: snap.music.topArtists?.slice(0, 5), topGenres: snap.music.topGenres?.slice(0, 5) }
    : undefined;
  const sports = snap?.fitness?.recentActivities?.map((a: any) => a.type).filter(Boolean).slice(0, 5);
  const favoriteTeams = readJSON<string[]>('sn_favorite_teams') || undefined;
  return { music, sports, favoriteTeams };
}

function getHobbies(): string[] | undefined {
  const ep = readJSON<any>('enhancedProfile');
  const list: string[] = [];
  if (ep?.personal?.hobbies) list.push(...(Array.isArray(ep.personal.hobbies) ? ep.personal.hobbies : []));
  if (ep?.personal?.sports?.active) list.push(...ep.personal.sports.active);
  if (ep?.personal?.interests) list.push(...(Array.isArray(ep.personal.interests) ? ep.personal.interests : []));
  return list.length ? Array.from(new Set(list)).slice(0, 12) : undefined;
}

function getFoodAndDrink(): { food?: any; drinks?: string[] } {
  const ep = readJSON<any>('enhancedProfile');
  const diet = ep?.personal?.dietary;
  const food = diet
    ? {
        cuisines: diet.favoriteCuisines?.slice(0, 6),
        dietary: diet.restrictions?.join(', '),
        alcohol: diet.alcoholPreference,
      }
    : undefined;
  const drinks = diet?.favoriteDrinks || undefined;
  return { food, drinks };
}

function getRewards(): ConciergeContextBundle['rewards'] {
  const r = readJSON<any>('award_cards_v2');
  if (!r?.cards) return undefined;
  const airlines = r.cards.filter((c: any) => c.category === 'airline').map((c: any) => `${c.programName} (${c.tier || 'member'})`).slice(0, 6);
  const hotels = r.cards.filter((c: any) => c.category === 'hotel').map((c: any) => `${c.programName} (${c.tier || 'member'})`).slice(0, 6);
  return { airlines: airlines?.length ? airlines : undefined, hotels: hotels?.length ? hotels : undefined };
}

function getWork(): ConciergeContextBundle['work'] | undefined {
  const ep = readJSON<any>('enhancedProfile');
  const pro = ep?.lifestyle?.professional;
  const mode = (readJSON<any>('travelMode')?.mode === 'business' ? 'business' : 'personal') as 'personal' | 'business';
  if (!pro) return undefined;
  return {
    role: pro.jobTitle,
    company: pro.company,
    industry: pro.industry,
    mode,
    source: 'self_reported',
  };
}

// ─── Public API ───────────────────────────────────────────────────────────

export function buildConciergeContextBundle(input: {
  currentCity?: string;
  currentCountry?: string;
  citizenship?: string;
  language?: string;
  persistentMemories?: string;
  conversationSummary?: string;
  threatIntelligence?: string;
  cityServicesContext?: string;
  awardCardsContext?: string;
  jetSearchContext?: string;
  calendar?: string;
  toolRoutingHint?: string;
  cultural?: any;
  lifestyleString?: string;
  integrationsString?: string;
}): ConciergeContextBundle {
  const full = gatherFullAppContext();
  const ep = full.enhancedProfile;
  const profileSummary = buildProfileSummary(ep);
  const { music, sports, favoriteTeams } = getMusicAndSports();
  const { food, drinks } = getFoodAndDrink();

  const sub = readJSON<any>('subscription');

  return {
    identity: {
      name: ep?.core?.personal?.firstName,
      nationality: input.citizenship,
      languages: ep?.core?.personal?.languages,
      source: 'self_reported',
    },
    location: {
      city: input.currentCity,
      country: input.currentCountry,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      source: 'verified',
    },
    profileSummary: profileSummary || undefined,
    family: getFamilySnapshot(),
    work: getWork(),
    trackedCountries: full.trackedCountries,
    hobbies: getHobbies(),
    sports,
    favoriteTeams,
    music,
    food,
    drinks,
    lifestyleConnectors: input.lifestyleString || undefined,
    integrations: input.integrationsString || undefined,
    rewards: getRewards(),
    subscriptionTier: sub?.tier,
    expenseSummary: full.expenseSummary ? JSON.stringify(full.expenseSummary) : undefined,
    calendar: input.calendar,
    learnedMemories: getMemoryContext() || undefined,
    persistentMemories: input.persistentMemories,
    conversationSummary: input.conversationSummary,
    threatIntelligence: input.threatIntelligence,
    newsPreferences: getNewsPrefs(),
    cityServicesContext: input.cityServicesContext,
    awardCardsContext: input.awardCardsContext,
    jetSearchContext: input.jetSearchContext,
    cultural: input.cultural,
    toolRoutingHint: input.toolRoutingHint,
    factualOnly: true,
  };
}

/**
 * Compact, prompt-ready summary of everything the AI knows about the user.
 * The edge function already receives a structured object; this is a backup
 * narrative for the system prompt so the model can't miss anything.
 */
export function renderContextNarrative(b: ConciergeContextBundle): string {
  const parts: string[] = [];

  const idBits: string[] = [];
  if (b.identity.name) idBits.push(`Name: ${b.identity.name}`);
  if (b.identity.nationality) idBits.push(`Nationality: ${b.identity.nationality}`);
  if (b.identity.languages?.length) idBits.push(`Languages: ${b.identity.languages.join(', ')}`);
  if (idBits.length) parts.push(`**Who:** ${idBits.join(' · ')}`);

  if (b.location.city || b.location.country) {
    parts.push(`**Where now:** ${[b.location.city, b.location.country].filter(Boolean).join(', ')}${b.location.tz ? ` (${b.location.tz})` : ''}`);
  }

  if (b.work?.role || b.work?.company) {
    parts.push(`**Work:** ${[b.work.role, b.work.company, b.work.industry].filter(Boolean).join(' · ')} — mode: ${b.work.mode}`);
  }

  if (b.family?.members) {
    parts.push(`**Family on file:** ${b.family.members} members${b.family.kidsAges?.length ? ` · kids ages ${b.family.kidsAges.join(', ')}` : ''}${b.family.petCount ? ` · ${b.family.petCount} pet(s)` : ''}`);
  }

  if (b.hobbies?.length) parts.push(`**Hobbies:** ${b.hobbies.join(', ')}`);
  if (b.sports?.length) parts.push(`**Active sports:** ${b.sports.join(', ')}`);
  if (b.favoriteTeams?.length) parts.push(`**Favorite teams:** ${b.favoriteTeams.join(', ')}`);
  if (b.music?.topArtists?.length) parts.push(`**Music:** ${b.music.topArtists.slice(0, 3).join(', ')}${b.music.topGenres?.length ? ` (${b.music.topGenres.slice(0, 3).join('/')})` : ''}`);
  if (b.food?.cuisines?.length || b.food?.dietary || b.food?.alcohol) {
    parts.push(`**Food & drink:** ${[b.food.cuisines?.join('/'), b.food.dietary, b.food.alcohol].filter(Boolean).join(' · ')}`);
  }
  if (b.drinks?.length) parts.push(`**Favorite drinks:** ${b.drinks.join(', ')}`);
  if (b.newsPreferences?.length) parts.push(`**Tracks news on:** ${b.newsPreferences.join(', ')}`);
  if (b.rewards?.airlines?.length || b.rewards?.hotels?.length) {
    parts.push(`**Loyalty:** ${[b.rewards.airlines?.join(', '), b.rewards.hotels?.join(', ')].filter(Boolean).join(' | ')}`);
  }
  if (b.trackedCountries?.length) {
    parts.push(`**Tax-tracked countries:** ${b.trackedCountries.map((c: any) => `${c.name} ${c.daysSpent}/${c.dayLimit}d${c.status === 'WARNING' ? ' ⚠️' : c.status === 'LIMIT_REACHED' ? ' 🚨' : ''}`).join(' · ')}`);
  }

  if (b.profileSummary) parts.push(b.profileSummary);
  if (b.learnedMemories) parts.push(b.learnedMemories);
  if (b.persistentMemories) parts.push(b.persistentMemories);
  if (b.conversationSummary) parts.push(b.conversationSummary);

  if (parts.length === 0) return '';
  return `**👤 EVERYTHING I KNOW ABOUT THIS USER (verified app data — treat as ground truth, never invent more):**\n${parts.join('\n')}\n`;
}
