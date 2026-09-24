import { useState, useCallback, useEffect } from 'react';
import { FEATURE_REGISTRY, SYSTEM_FEATURES, FeatureItem } from '@/data/featureRegistry';
import { isPausedSocialIntroductionFeature } from '@/config/socialIntroductionPolicy';

export interface FeaturePref {
  visible: boolean;
  pinned: boolean;
  order: number;
}

export type FeaturePrefsMap = Record<string, FeaturePref>;

const STORAGE_KEY = 'supernomad_feature_prefs';
const STORAGE_VERSION_KEY = 'supernomad_feature_prefs_version';
const CURRENT_STORAGE_VERSION = '2';

// These were part of the former broad default navigation. Version 2 moves
// them behind Customize My App so the sidebar starts focused and uncluttered.
const VERSION_2_DEFAULT_HIDDEN_IDS = new Set([
  'payment-options',
  'award-cards',
  'digital-banks',
  'money-transfers',
  'crypto-cash',
  'currency-converter',
  'emergency-cards',
  'travel-insurance',
]);

// Deliberately small default navigation set. Home pins are independent: a
// feature may stay out of the sidebar while remaining one tap away on Home.
const DEFAULT_VISIBLE_FEATURE_IDS = new Set([
  'dash-threat',
  'threats',
  'tax-residency',
  'gps-monitor',
  'visas',
  'visa-immigration',
  'visa-assistance',
  'etias',
  'ees',
  'visa-matcher',
  'vaccination-hub',
  'vault',
]);

function buildDefaults(): FeaturePrefsMap {
  const map: FeaturePrefsMap = {};
  FEATURE_REGISTRY.forEach((f, i) => {
    map[f.id] = { visible: DEFAULT_VISIBLE_FEATURE_IDS.has(f.id), pinned: f.defaultPinned, order: i };
  });
  return map;
}

function loadPrefs(): FeaturePrefsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as FeaturePrefsMap;
      const savedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
      // Merge with defaults so new features appear without resetting choices.
      const defaults = buildDefaults();
      for (const key of Object.keys(defaults)) {
        if (!(key in saved)) {
          saved[key] = defaults[key];
        } else {
          saved[key] = {
            ...defaults[key],
            ...saved[key],
          };
        }
      }
      if (savedVersion !== CURRENT_STORAGE_VERSION) {
        for (const id of VERSION_2_DEFAULT_HIDDEN_IDS) {
          const preference = saved[id];
          if (preference) saved[id] = { ...preference, visible: false };
        }
      }
      return saved;
    }
  } catch {
    return buildDefaults();
  }
  return buildDefaults();
}

export function useFeaturePreferences() {
  const [prefs, setPrefs] = useState<FeaturePrefsMap>(loadPrefs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
  }, [prefs]);

  const isVisible = useCallback((id: string): boolean => {
    if (isPausedSocialIntroductionFeature(id)) return false;
    if (SYSTEM_FEATURES.includes(id)) return true;
    return prefs[id]?.visible ?? true;
  }, [prefs]);

  const isPinned = useCallback((id: string): boolean => {
    if (isPausedSocialIntroductionFeature(id)) return false;
    return prefs[id]?.pinned ?? false;
  }, [prefs]);

  const toggleVisible = useCallback((id: string) => {
    if (isPausedSocialIntroductionFeature(id)) return;
    if (SYSTEM_FEATURES.includes(id)) return;
    setPrefs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        visible: !prev[id]?.visible,
        pinned: prev[id]?.pinned ?? false,
      }
    }));
  }, []);

  const togglePinned = useCallback((id: string) => {
    if (isPausedSocialIntroductionFeature(id)) return;
    setPrefs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        visible: prev[id]?.visible ?? true,
        pinned: !prev[id]?.pinned,
      }
    }));
  }, []);

  const setVisibility = useCallback((id: string, visible: boolean) => {
    if (isPausedSocialIntroductionFeature(id)) return;
    if (SYSTEM_FEATURES.includes(id)) return;
    setPrefs(prev => ({
      ...prev,
      [id]: { ...prev[id], visible, pinned: prev[id]?.pinned ?? false }
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults = buildDefaults();
    setPrefs(defaults);
  }, []);

  /** Get visible features for a category, sorted by order */
  const getVisibleFeatures = useCallback((category?: string): FeatureItem[] => {
    return FEATURE_REGISTRY
      .filter(f => {
        if (category && f.category !== category) return false;
        return isVisible(f.id);
      })
      .sort((a, b) => (prefs[a.id]?.order ?? 0) - (prefs[b.id]?.order ?? 0));
  }, [prefs, isVisible]);

  /** Get pinned features sorted by order */
  const getPinnedFeatures = useCallback((): FeatureItem[] => {
    return FEATURE_REGISTRY
      .filter(f => isPinned(f.id))
      .sort((a, b) => (prefs[a.id]?.order ?? 0) - (prefs[b.id]?.order ?? 0));
  }, [prefs, isPinned]);

  /** Get all hidden features */
  const getHiddenFeatures = useCallback((): FeatureItem[] => {
    return FEATURE_REGISTRY.filter(f => !isVisible(f.id));
  }, [isVisible]);

  return {
    prefs,
    isVisible,
    isPinned,
    toggleVisible,
    togglePinned,
    setVisibility,
    resetToDefaults,
    getVisibleFeatures,
    getPinnedFeatures,
    getHiddenFeatures,
  };
}
