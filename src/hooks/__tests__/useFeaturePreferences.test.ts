import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useFeaturePreferences } from '@/hooks/useFeaturePreferences';

const STORAGE_KEY = 'supernomad_feature_prefs';
const STORAGE_VERSION_KEY = 'supernomad_feature_prefs_version';

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

  it('starts with the focused sidebar defaults and keeps optional groups hidden', () => {
    const { result } = renderHook(() => useFeaturePreferences());

    expect(result.current.getVisibleFeatures()).toHaveLength(12);
    expect(result.current.getHiddenFeatures()).toHaveLength(76);
    expect(result.current.isVisible('snomad-id')).toBe(false);
    expect(result.current.isVisible('sovereign-access')).toBe(false);
    expect(result.current.isVisible('travel-inbox')).toBe(false);
    expect(result.current.isVisible('payment-options')).toBe(false);
    expect(result.current.isVisible('travel-insurance')).toBe(false);
  });

  it('lets a hidden sidebar feature be enabled and persists the choice', () => {
    const first = renderHook(() => useFeaturePreferences());

    act(() => first.result.current.setVisibility('snomad-id', true));
    expect(first.result.current.isVisible('snomad-id')).toBe(true);

    first.unmount();
    const reopened = renderHook(() => useFeaturePreferences());
    expect(reopened.result.current.isVisible('snomad-id')).toBe(true);
  });

  it('migrates the former finance and travel defaults to hidden once', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      'payment-options': { visible: true, pinned: false, order: 1 },
      'travel-insurance': { visible: true, pinned: false, order: 2 },
      guardian: { visible: true, pinned: false, order: 3 },
    }));

    const { result } = renderHook(() => useFeaturePreferences());

    expect(result.current.isVisible('payment-options')).toBe(false);
    expect(result.current.isVisible('travel-insurance')).toBe(false);
    expect(result.current.isVisible('guardian')).toBe(true);
    expect(localStorage.getItem(STORAGE_VERSION_KEY)).toBe('2');
  });
});