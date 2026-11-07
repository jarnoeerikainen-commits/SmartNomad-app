import { useEffect, useState } from 'react';
import { getMobileConciergeViewport } from '@/utils/mobileEntry';

export function useConciergeViewport(enabled: boolean) {
  const [viewport, setViewport] = useState<ReturnType<typeof getMobileConciergeViewport> | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const visual = window.visualViewport;
    const update = () => setViewport(getMobileConciergeViewport(
      visual?.height ?? window.innerHeight, visual?.offsetTop ?? 0, window.innerHeight,
    ));
    update();
    visual?.addEventListener('resize', update);
    visual?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      visual?.removeEventListener('resize', update);
      visual?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [enabled]);
  return viewport;
}