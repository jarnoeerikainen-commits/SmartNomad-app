import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserMode } from '@/hooks/useUserMode';

describe('useUserMode', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to nomad', () => {
    const { result } = renderHook(() => useUserMode());
    expect(result.current.mode).toBe('nomad');
    expect(result.current.preset.label).toBe('Nomad');
  });

  it('sets and persists mode', () => {
    const { result } = renderHook(() => useUserMode());
    act(() => result.current.setMode('business'));
    expect(result.current.mode).toBe('business');
    expect(localStorage.getItem('supernomad_user_mode')).toBe('business');
  });

  it('ignores unknown mode', () => {
    const { result } = renderHook(() => useUserMode());
    act(() => result.current.setMode('alien' as any));
    expect(result.current.mode).toBe('nomad');
  });
});
