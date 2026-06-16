import { useEffect, useRef, useState } from 'react';
import { haptics } from '@/utils/haptics';

/**
 * usePullToRefresh — touch-only pull-to-refresh for any scrollable container.
 * Pass a container ref + an async onRefresh handler. Triggers at THRESHOLD px.
 *
 * Returns: { pulling, distance, refreshing } to drive an optional visual.
 */
const THRESHOLD = 70;
const MAX = 110;

export function usePullToRefresh(
  containerRef: React.RefObject<HTMLElement>,
  onRefresh: () => Promise<void> | void,
  enabled: boolean = true,
) {
  const [pulling, setPulling] = useState(false);
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const triggeredHaptic = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      if (el.scrollTop > 0 || refreshing) return;
      startY.current = e.touches[0].clientY;
      triggeredHaptic.current = false;
    };
    const onMove = (e: TouchEvent) => {
      if (startY.current == null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0) { setDistance(0); setPulling(false); return; }
      const damped = Math.min(MAX, dy * 0.55);
      setDistance(damped);
      setPulling(true);
      if (damped >= THRESHOLD && !triggeredHaptic.current) {
        triggeredHaptic.current = true;
        haptics.selection();
      }
    };
    const onEnd = async () => {
      const shouldFire = distance >= THRESHOLD;
      startY.current = null;
      setPulling(false);
      if (shouldFire && !refreshing) {
        setRefreshing(true);
        haptics.tap();
        try { await onRefresh(); } finally {
          setRefreshing(false);
          setDistance(0);
        }
      } else {
        setDistance(0);
      }
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('touchend', onEnd);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [containerRef, onRefresh, enabled, distance, refreshing]);

  return { pulling, distance, refreshing };
}
