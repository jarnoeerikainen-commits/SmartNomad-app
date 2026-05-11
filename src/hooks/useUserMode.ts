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
