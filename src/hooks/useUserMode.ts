import { useState, useCallback, useEffect } from 'react';
import { UserMode, MODE_PRESETS, DEFAULT_MODE } from '@/data/modePresets';

const STORAGE_KEY = 'supernomad_user_mode';

function loadMode(): UserMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) as UserMode | null;
    if (raw && raw in MODE_PRESETS) return raw;
  } catch {}
  return DEFAULT_MODE;
}

export function useUserMode() {
  const [mode, setModeState] = useState<UserMode>(loadMode);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, mode); } catch {}
  }, [mode]);

  useEffect(() => {
    const handler = () => {
      const next = loadMode();
      setModeState(prev => (prev === next ? prev : next));
    };
    window.addEventListener('supernomad:user-mode-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('supernomad:user-mode-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const setMode = useCallback((next: UserMode) => {
    if (!(next in MODE_PRESETS)) return;
    setModeState(next);
  }, []);

  return {
    mode,
    setMode,
    preset: MODE_PRESETS[mode],
  };
}
