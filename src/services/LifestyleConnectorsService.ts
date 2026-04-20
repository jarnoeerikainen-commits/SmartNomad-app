/**
 * Lifestyle Connectors Service
 * Demo-mode integrations for music, fitness & health platforms.
 * Production-ready architecture: swap simulated data for real OAuth API calls
 * by replacing the `getSimulated*` functions with real `fetch()` to provider APIs.
 *
 * Providers covered: Spotify, Oura, Garmin, Strava, Whoop.
 *
 * All data is stored locally (localStorage) — zero-knowledge by design.
 * AI context is built on-demand and injected into the Respect Protocol so the
 * Concierge can recommend partners, gear, tournaments, music venues, etc.
 */

export type LifestyleProviderId = 'spotify' | 'oura' | 'garmin' | 'strava' | 'whoop';

export type LifestyleStatus = 'connected' | 'disconnected' | 'expired';

export interface LifestyleProvider {
  id: LifestyleProviderId;
  name: string;
  icon: string;          // emoji for now; swap for SVG in real version
  category: 'music' | 'sleep' | 'fitness' | 'sports' | 'recovery';
  description: string;
  status: LifestyleStatus;
  lastSyncedAt?: string; // ISO date
  capabilities: string[];
  // Real-version OAuth metadata (kept for future swap)
  oauth: {
    authUrl: string;
    scopes: string[];
    docs: string;
  };
}

// Snapshot a connected provider returns when synced
export interface MusicSnapshot {
  topGenres: string[];
  topArtists: { name: string; plays: number }[];
  topTracks: string[];
  tasteVector: 'eclectic' | 'mainstream' | 'underground' | 'classical' | 'mixed';
  averageBPM: number;
  moodProfile: ('energetic' | 'mellow' | 'focused' | 'romantic' | 'workout')[];
}

export interface SleepSnapshot {
  avgSleepHours: number;
  avgSleepScore: number;     // 0-100
  avgRestingHR: number;
  avgHRV: number;            // ms
  bedtimePattern: 'early-bird' | 'night-owl' | 'flexible';
  trend: 'improving' | 'stable' | 'declining';
}

export interface FitnessSnapshot {
  weeklyActivities: number;
  weeklyDistanceKm: number;
  weeklyCalories: number;
  vo2max: number;
  primarySports: { sport: string; sessions30d: number; level: 'beginner' | 'intermediate' | 'advanced' | 'elite' }[];
  paceMinKm5k?: number;
  ftpWatts?: number;          // cycling FTP
}

export interface SportsSkillSnapshot {
  golf?: { handicap: number; rounds90d: number; favoriteCourses: string[] };
  tennis?: { utr: number; matches90d: number; surface: 'hard' | 'clay' | 'grass' | 'all' };
  padel?: { level: number; matches90d: number };
  swimming?: { swolf: number; pace100m: number };
  cycling?: { ftpWatts: number; longestRideKm: number };
  running?: { fivekPb: string; halfMarathonPb?: string };
  skiing?: { level: 'green' | 'blue' | 'red' | 'black' | 'expert'; daysLastSeason: number };
}

export interface RecoverySnapshot {
  recoveryScore: number;     // 0-100
  strainScore: number;        // 0-21 (Whoop scale)
  trainingLoad: 'low' | 'optimal' | 'high' | 'overreaching';
  readinessForToday: 'rest' | 'light' | 'moderate' | 'go-hard';
}

export interface LifestyleSnapshot {
  music?: MusicSnapshot;
  sleep?: SleepSnapshot;
  fitness?: FitnessSnapshot;
  sports?: SportsSkillSnapshot;
  recovery?: RecoverySnapshot;
}

// ====================================================================
// PROVIDER REGISTRY
// ====================================================================

const PROVIDERS: LifestyleProvider[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    icon: '🎵',
    category: 'music',
    description: 'Music taste, top artists, mood profile — for venue, event & playlist intelligence.',
    status: 'disconnected',
    capabilities: ['top_artists', 'top_genres', 'mood_profile', 'concert_match', 'playlist_for_destination'],
    oauth: {
      authUrl: 'https://accounts.spotify.com/authorize',
      scopes: ['user-top-read', 'user-read-recently-played', 'user-library-read'],
      docs: 'https://developer.spotify.com/documentation/web-api',
    },
  },
  {
    id: 'oura',
    name: 'Oura Ring',
    icon: '💍',
    category: 'sleep',
    description: 'Sleep, HRV, readiness — for jet-lag protocols and travel-day timing.',
    status: 'disconnected',
    capabilities: ['sleep_score', 'hrv', 'readiness', 'jet_lag_protocol', 'circadian_alignment'],
    oauth: {
      authUrl: 'https://cloud.ouraring.com/oauth/authorize',
      scopes: ['daily', 'heartrate', 'session'],
      docs: 'https://cloud.ouraring.com/v2/docs',
    },
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    icon: '⌚',
    category: 'fitness',
    description: 'VO2max, training load, golf scores, multisport — for skill-matched partners & gear.',
    status: 'disconnected',
    capabilities: ['vo2max', 'training_load', 'golf_handicap', 'cycling_ftp', 'multisport'],
    oauth: {
      authUrl: 'https://connect.garmin.com/oauthConfirm',
      scopes: ['user_metrics:read', 'activities:read'],
      docs: 'https://developer.garmin.com',
    },
  },
  {
    id: 'strava',
    name: 'Strava',
    icon: '🏃',
    category: 'fitness',
    description: 'Running, cycling, swimming — segments, PRs, route discovery on the road.',
    status: 'disconnected',
    capabilities: ['activities', 'segments', 'prs', 'route_discovery', 'club_match'],
    oauth: {
      authUrl: 'https://www.strava.com/oauth/authorize',
      scopes: ['read', 'activity:read_all', 'profile:read_all'],
      docs: 'https://developers.strava.com',
    },
  },
  {
    id: 'whoop',
    name: 'WHOOP',
    icon: '💪',
    category: 'recovery',
    description: 'Recovery, strain, sleep coaching — for travel-day readiness & training plans.',
    status: 'disconnected',
    capabilities: ['recovery', 'strain', 'sleep_coach', 'readiness', 'training_plan'],
    oauth: {
      authUrl: 'https://api.prod.whoop.com/oauth/oauth2/auth',
      scopes: ['read:recovery', 'read:cycles', 'read:sleep', 'read:workout'],
      docs: 'https://developer.whoop.com',
    },
  },
];

// ====================================================================
// LOCAL STORAGE PERSISTENCE
// ====================================================================

const STATUS_KEY = 'lifestyleConnectorsStatus';
const SNAPSHOT_KEY = 'lifestyleSnapshot';

function loadStatus(): Record<LifestyleProviderId, { status: LifestyleStatus; lastSyncedAt?: string }> {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return {} as any;
}

function saveStatus(state: Record<string, any>) {
  try { localStorage.setItem(STATUS_KEY, JSON.stringify(state)); } catch { /* noop */ }
}

function loadSnapshot(): LifestyleSnapshot {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return {};
}

function saveSnapshot(snap: LifestyleSnapshot) {
  try { localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snap)); } catch { /* noop */ }
}

// ====================================================================
// SIMULATED DATA (replace with real API calls in production)
// ====================================================================

function getSimulatedMusic(): MusicSnapshot {
  return {
    topGenres: ['Indie Rock', 'Electronic', 'Jazz', 'Classical', 'Lo-Fi Hip-Hop'],
    topArtists: [
      { name: 'Tame Impala', plays: 412 },
      { name: 'ODESZA', plays: 298 },
      { name: 'Bonobo', plays: 264 },
      { name: 'Nils Frahm', plays: 187 },
      { name: 'Floating Points', plays: 156 },
    ],
    topTracks: ['The Less I Know The Better', 'Late Night Tales', 'Cylinders', 'Says'],
    tasteVector: 'eclectic',
    averageBPM: 112,
    moodProfile: ['mellow', 'focused', 'energetic'],
  };
}

function getSimulatedSleep(): SleepSnapshot {
  return {
    avgSleepHours: 7.4,
    avgSleepScore: 84,
    avgRestingHR: 56,
    avgHRV: 62,
    bedtimePattern: 'flexible',
    trend: 'stable',
  };
}

function getSimulatedFitness(): FitnessSnapshot {
  return {
    weeklyActivities: 6,
    weeklyDistanceKm: 48.3,
    weeklyCalories: 4200,
    vo2max: 52,
    paceMinKm5k: 4.42,
    ftpWatts: 285,
    primarySports: [
      { sport: 'Running', sessions30d: 14, level: 'advanced' },
      { sport: 'Cycling', sessions30d: 8, level: 'intermediate' },
      { sport: 'Tennis', sessions30d: 6, level: 'intermediate' },
      { sport: 'Yoga', sessions30d: 4, level: 'intermediate' },
    ],
  };
}

function getSimulatedSportsSkill(): SportsSkillSnapshot {
  return {
    golf: { handicap: 12.4, rounds90d: 9, favoriteCourses: ['Pedreña', 'Valderrama', 'Real Club de Golf'] },
    tennis: { utr: 7.2, matches90d: 14, surface: 'clay' },
    padel: { level: 4.5, matches90d: 22 },
    cycling: { ftpWatts: 285, longestRideKm: 142 },
    running: { fivekPb: '21:58', halfMarathonPb: '1:42:31' },
    skiing: { level: 'red', daysLastSeason: 14 },
  };
}

function getSimulatedRecovery(): RecoverySnapshot {
  return {
    recoveryScore: 72,
    strainScore: 12.4,
    trainingLoad: 'optimal',
    readinessForToday: 'moderate',
  };
}

// ====================================================================
// PUBLIC API
// ====================================================================

export function getProviders(): LifestyleProvider[] {
  const status = loadStatus();
  return PROVIDERS.map(p => ({
    ...p,
    status: status[p.id]?.status || 'disconnected',
    lastSyncedAt: status[p.id]?.lastSyncedAt,
  }));
}

export function getProvider(id: LifestyleProviderId): LifestyleProvider | undefined {
  return getProviders().find(p => p.id === id);
}

export function getSnapshot(): LifestyleSnapshot {
  return loadSnapshot();
}

/**
 * Simulate connecting a provider — populates snapshot with realistic demo data.
 * In production: replace with OAuth flow + real API fetch.
 */
export function connectProvider(id: LifestyleProviderId): LifestyleProvider | null {
  const provider = PROVIDERS.find(p => p.id === id);
  if (!provider) return null;

  const status = loadStatus();
  status[id] = { status: 'connected', lastSyncedAt: new Date().toISOString() };
  saveStatus(status);

  // Populate snapshot for this provider
  const snap = loadSnapshot();
  if (id === 'spotify') snap.music = getSimulatedMusic();
  if (id === 'oura') snap.sleep = getSimulatedSleep();
  if (id === 'garmin') {
    snap.fitness = getSimulatedFitness();
    snap.sports = getSimulatedSportsSkill();
  }
  if (id === 'strava') {
    snap.fitness = snap.fitness || getSimulatedFitness();
  }
  if (id === 'whoop') snap.recovery = getSimulatedRecovery();
  saveSnapshot(snap);

  return { ...provider, status: 'connected', lastSyncedAt: status[id].lastSyncedAt };
}

export function disconnectProvider(id: LifestyleProviderId): LifestyleProvider | null {
  const provider = PROVIDERS.find(p => p.id === id);
  if (!provider) return null;

  const status = loadStatus();
  status[id] = { status: 'disconnected' };
  saveStatus(status);

  // Clear that provider's slice of snapshot
  const snap = loadSnapshot();
  if (id === 'spotify') delete snap.music;
  if (id === 'oura') delete snap.sleep;
  if (id === 'garmin') { delete snap.sports; if (!loadStatus().strava || loadStatus().strava.status !== 'connected') delete snap.fitness; }
  if (id === 'strava') { if (!loadStatus().garmin || loadStatus().garmin.status !== 'connected') delete snap.fitness; }
  if (id === 'whoop') delete snap.recovery;
  saveSnapshot(snap);

  return { ...provider, status: 'disconnected' };
}

/**
 * Re-fetch fresh data (in production this hits the API; here it just bumps timestamp).
 */
export function syncProvider(id: LifestyleProviderId): LifestyleProvider | null {
  const status = loadStatus();
  if (status[id]?.status !== 'connected') return null;
  status[id] = { status: 'connected', lastSyncedAt: new Date().toISOString() };
  saveStatus(status);
  return getProvider(id) || null;
}

/**
 * Build a compact context string for the Concierge AI system prompt.
 * Returns empty string when nothing is connected — Concierge sees nothing.
 */
export function getLifestyleContextForAI(): string {
  const snap = loadSnapshot();
  const lines: string[] = [];

  if (snap.music) {
    const top = snap.music.topArtists.slice(0, 3).map(a => a.name).join(', ');
    lines.push(`🎵 Music: top artists ${top}; genres ${snap.music.topGenres.slice(0, 3).join(', ')}; taste ${snap.music.tasteVector}, mood ${snap.music.moodProfile.join('/')}. Use for concert match, venue vibe, in-flight playlists, restaurant ambience picks.`);
  }
  if (snap.sleep) {
    lines.push(`💍 Sleep: ${snap.sleep.avgSleepHours}h avg, score ${snap.sleep.avgSleepScore}/100, HRV ${snap.sleep.avgHRV}ms, ${snap.sleep.bedtimePattern}. Use for jet-lag protocol, flight-time recommendations.`);
  }
  if (snap.fitness) {
    const sports = snap.fitness.primarySports.map(s => `${s.sport}(${s.level})`).join(', ');
    lines.push(`🏃 Fitness: VO2max ${snap.fitness.vo2max}, ${snap.fitness.weeklyActivities} sessions/wk, ${snap.fitness.weeklyDistanceKm}km. Sports: ${sports}. Match training partners, gyms, tournaments at the user's level.`);
  }
  if (snap.sports) {
    const skills: string[] = [];
    if (snap.sports.golf) skills.push(`Golf hcp ${snap.sports.golf.handicap}`);
    if (snap.sports.tennis) skills.push(`Tennis UTR ${snap.sports.tennis.utr} (${snap.sports.tennis.surface})`);
    if (snap.sports.padel) skills.push(`Padel ${snap.sports.padel.level}`);
    if (snap.sports.cycling) skills.push(`FTP ${snap.sports.cycling.ftpWatts}W`);
    if (snap.sports.running) skills.push(`5k PB ${snap.sports.running.fivekPb}`);
    if (snap.sports.skiing) skills.push(`Ski ${snap.sports.skiing.level}`);
    if (skills.length) lines.push(`🎾 Skills: ${skills.join(' · ')}. Recommend equal-level partners, clubs, leagues, tournaments, gear & deals appropriate to skill.`);
  }
  if (snap.recovery) {
    lines.push(`💪 Today's readiness: ${snap.recovery.readinessForToday} (recovery ${snap.recovery.recoveryScore}/100, strain ${snap.recovery.strainScore}). Adjust training & social-energy suggestions accordingly.`);
  }

  if (!lines.length) return '';
  return [
    '**🎯 LIFESTYLE INTELLIGENCE (silent context — never volunteer raw numbers; use to personalise):**',
    ...lines,
    '- Stay one step ahead: surface gear/equipment deals, new product launches, concerts, tournaments, partner matches, training routes, and recovery-aware schedules without being asked.',
    '- Respect Protocol still applies (no tobacco, alcohol only if user opts in, polite tone, cultural awareness).',
  ].join('\n');
}

/**
 * Aggregate connection summary for UI badges & dashboards.
 */
export function getConnectionSummary() {
  const providers = getProviders();
  const connected = providers.filter(p => p.status === 'connected');
  return {
    total: providers.length,
    connected: connected.length,
    categories: [...new Set(connected.map(p => p.category))],
  };
}
