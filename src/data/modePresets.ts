import { Briefcase, Globe2, Users, Activity, Palmtree, LucideIcon } from 'lucide-react';

export type UserMode = 'business' | 'nomad' | 'family' | 'sport' | 'sabbatical';

export interface ModePreset {
  id: UserMode;
  label: string;
  tagline: string;
  icon: LucideIcon;
  /** Feature ids to pin (overrides defaults) */
  pinned: string[];
  /** Feature ids to ensure visible. Other dashboard ids may be hidden. */
  visibleDashboard: string[];
}

/**
 * Mode presets reshape the Home dashboard for a given life-mode.
 * Feature ids reference src/data/featureRegistry.ts
 */
export const MODE_PRESETS: Record<UserMode, ModePreset> = {
  business: {
    id: 'business',
    label: 'Business',
    tagline: 'Trips, receipts, lounges, fast.',
    icon: Briefcase,
    pinned: ['expenses', 'air-charter', 'award-cards', 'visa-immigration', 'taxis'],
    visibleDashboard: ['dash-threat', 'dash-welcome', 'dash-stats', 'dash-actions', 'dash-discovery'],
  },
  nomad: {
    id: 'nomad',
    label: 'Nomad',
    tagline: 'Days, visas, taxes, calm.',
    icon: Globe2,
    pinned: ['expenses', 'tax-residency', 'gps-monitor', 'visa-matcher', 'ees'],
    visibleDashboard: ['dash-threat', 'dash-welcome', 'dash-stats', 'dash-weather', 'dash-gamification', 'dash-activity', 'dash-actions', 'dash-discovery'],
  },
  family: {
    id: 'family',
    label: 'Family',
    tagline: 'Kids, schools, safety, vault.',
    icon: Users,
    pinned: ['vault', 'vaccination-hub', 'travel-insurance', 'ees', 'global-city-services'],
    visibleDashboard: ['dash-threat', 'dash-welcome', 'dash-stats', 'dash-weather', 'dash-activity', 'dash-discovery'],
  },
  sport: {
    id: 'sport',
    label: 'Sport',
    tagline: 'Weather, recovery, conditions.',
    icon: Activity,
    pinned: ['dash-weather', 'travel-insurance', 'esim', 'public-transport'],
    visibleDashboard: ['dash-threat', 'dash-welcome', 'dash-stats', 'dash-weather', 'dash-actions'],
  },
  sabbatical: {
    id: 'sabbatical',
    label: 'Sabbatical',
    tagline: 'Slow travel, low signal.',
    icon: Palmtree,
    pinned: ['tax-residency', 'global-city-services', 'travel-insurance', 'vault'],
    visibleDashboard: ['dash-welcome', 'dash-weather', 'dash-activity'],
  },
};

export const MODE_LIST: ModePreset[] = Object.values(MODE_PRESETS);
export const DEFAULT_MODE: UserMode = 'nomad';
