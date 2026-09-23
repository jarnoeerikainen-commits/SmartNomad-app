import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useFeaturePreferences } from '@/hooks/useFeaturePreferences';

const STORAGE_KEY = 'supernomad_feature_prefs';

describe('useFeaturePreferences', () => {
  beforeEach(() => localStorage.clear());

  it('pins a feature to Home independently of navigation visibility', () => {
    const { result } = renderHook(() => useFeaturePreferences());

    act(() => result.current.togglePinned('guardian'));

    expect(result.current.isPinned('guardian')).toBe(true);
    expect(result.current.isVisible('guardian')).toBe(false);
    expect(result.current.getPinnedFeatures().some(feature => feature.id === 'guardian')).toBe(true);
  });

  it('keeps a Home pin when its navigation item is hidden', () => {
    const { result } = renderHook(() => useFeaturePreferences());

    act(() => result.current.setVisibility('expenses', true));
    act(() => result.current.toggleVisible('expenses'));

    expect(result.current.isVisible('expenses')).toBe(false);
    expect(result.current.isPinned('expenses')).toBe(true);
  });

  it('preserves an older hidden Home pin and merges new defaults', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      expenses: { visible: false, pinned: true, order: 0 },
    }));

    const { result } = renderHook(() => useFeaturePreferences());

    expect(result.current.isVisible('expenses')).toBe(false);
    expect(result.current.isPinned('expenses')).toBe(true);
    expect(result.current.isVisible('tax-residency')).toBe(true);
    expect(result.current.isVisible('tax')).toBe(false);
  });

  it('restores the default six Home pins', () => {
    const { result } = renderHook(() => useFeaturePreferences());

    act(() => result.current.togglePinned('tax'));
    act(() => result.current.resetToDefaults());

    expect(result.current.getPinnedFeatures().map(feature => feature.id)).toEqual([
      'expenses',
      'gps-monitor',
      'ees',
      'weather-service',
      'trust-pass',
      'supernomad-call',
    ]);
  });

  it('starts with 20 visible features and 66 hidden features', () => {
    const { result } = renderHook(() => useFeaturePreferences());

    expect(result.current.getVisibleFeatures()).toHaveLength(20);
    expect(result.current.getHiddenFeatures()).toHaveLength(66);
  });
});