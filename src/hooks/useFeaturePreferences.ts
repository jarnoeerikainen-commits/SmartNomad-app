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

function buildDefaults(): FeaturePrefsMap {
  const map: FeaturePrefsMap = {};
  FEATURE_REGISTRY.forEach((f, i) => {
    map[f.id] = { visible: f.defaultVisible, pinned: f.defaultPinned, order: i };
  });
  return map;
}

function loadPrefs(): FeaturePrefsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as FeaturePrefsMap;
      // Merge with defaults so new features appear without resetting choices.
      const defaults = buildDefaults();
      for (const key of Object.keys(defaults)) {
        if (!(key in saved)) {
          saved[key] = defaults[key];
        } else {
          saved[key] = {
            ...defaults[key],
            ...saved[key],
            // A Home pin is always visible; repair older contradictory prefs.
            visible: Boolean(saved[key].visible || saved[key].pinned),
          };
        }
      }
      return saved;
    }
  } catch {}
  return buildDefaults();
}

export function useFeaturePreferences() {
  const [prefs, setPrefs] = useState<FeaturePrefsMap>(loadPrefs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
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
        // Hidden items cannot remain on Home.
        pinned: prev[id]?.visible ? false : prev[id]?.pinned ?? false,
      }
    }));
  }, []);

  const togglePinned = useCallback((id: string) => {
    if (isPausedSocialIntroductionFeature(id)) return;
    setPrefs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        // Pinning places the item on Home and therefore makes it visible.
        visible: prev[id]?.pinned ? prev[id]?.visible ?? true : true,
        pinned: !prev[id]?.pinned,
      }
    }));
  }, []);

  const setVisibility = useCallback((id: string, visible: boolean) => {
    if (isPausedSocialIntroductionFeature(id)) return;
    if (SYSTEM_FEATURES.includes(id)) return;
    setPrefs(prev => ({
      ...prev,
      [id]: { ...prev[id], visible, pinned: visible ? prev[id]?.pinned ?? false : false }
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
