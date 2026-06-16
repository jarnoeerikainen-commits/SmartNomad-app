// ═════════════════════════════════════════════════════════════════════════
// Haptics — unified primary/secondary/success/warning/danger taps.
// Works on Capacitor (native vibration), then falls back to Web Vibration API,
// then no-ops on unsupported browsers. Use on confirm/book/danger-gate-accept.
// ═════════════════════════════════════════════════════════════════════════

type Intensity = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

const WEB_FALLBACK: Record<Intensity, number | number[]> = {
  light: 8,
  medium: 16,
  heavy: 28,
  success: [12, 30, 12],
  warning: [16, 40, 16],
  error: [24, 40, 24, 40, 24],
  selection: 6,
};

let capPromise: Promise<any> | null = null;
async function loadCapacitor() {
  if (capPromise) return capPromise;
  capPromise = (async () => {
    try {
      // Capacitor Haptics is optional — only loads if installed
      const mod: any = await (new Function('s', 'return import(s)')('@capacitor/haptics')).catch(() => null);
      return mod?.Haptics ?? null;
    } catch { return null; }
  })();
  return capPromise;
}

export async function hapticTap(intensity: Intensity = 'light'): Promise<void> {
  try {
    const H = await loadCapacitor();
    if (H) {
      if (intensity === 'success') return H.notification?.({ type: 'SUCCESS' });
      if (intensity === 'warning') return H.notification?.({ type: 'WARNING' });
      if (intensity === 'error')   return H.notification?.({ type: 'ERROR' });
      if (intensity === 'selection') return H.selectionStart?.();
      return H.impact?.({ style: intensity.toUpperCase() });
    }
  } catch { /* swallow & fall through */ }

  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(WEB_FALLBACK[intensity]);
    }
  } catch { /* ignore */ }
}

export const haptics = {
  tap:       () => hapticTap('light'),
  press:     () => hapticTap('medium'),
  confirm:   () => hapticTap('heavy'),
  success:   () => hapticTap('success'),
  warning:   () => hapticTap('warning'),
  danger:    () => hapticTap('error'),
  selection: () => hapticTap('selection'),
};
