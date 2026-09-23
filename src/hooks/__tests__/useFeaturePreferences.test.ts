import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useFeaturePreferences } from '@/hooks/useFeaturePreferences';

const STORAGE_KEY = 'supernomad_feature_prefs';

describe('useFeaturePreferences', () => {
  beforeEach(() => localStorage.clear());

  it('pins a feature to Home and makes it visible', () => {
    const { result } = renderHook(() => useFeaturePreferences());

    act(() => result.current.togglePinned('tax'));

    expect(result.current.isPinned('tax')).toBe(true);
    expect(result.current.isVisible('tax')).toBe(true);
    expect(result.current.getPinnedFeatures().some(feature => feature.id === 'tax')).toBe(true);
  });

  it('unpins a feature when it is hidden', () => {
    const { result } = renderHook(() => useFeaturePreferences());

    act(() => result.current.toggleVisible('expenses'));

    expect(result.current.isVisible('expenses')).toBe(false);
    expect(result.current.isPinned('expenses')).toBe(false);
  });

  it('repairs an older hidden and pinned preference on load', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      expenses: { visible: false, pinned: true, order: 0 },
    }));

    const { result } = renderHook(() => useFeaturePreferences());

    expect(result.current.isVisible('expenses')).toBe(true);
    expect(result.current.isPinned('expenses')).toBe(true);
    expect(result.current.isVisible('tax')).toBe(true);
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
});