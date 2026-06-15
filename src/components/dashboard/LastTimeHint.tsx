import React, { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';
import { aiMemoryService } from '@/services/AIMemoryService';

interface Props {
  destination?: string;
  onClick?: () => void;
}

/**
 * Tiny one-line "Last time…" hint pulled from AIMemoryService.
 * Renders nothing for demo personas or when there's no memory.
 */
const LastTimeHint: React.FC<Props> = ({ destination, onClick }) => {
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    aiMemoryService.recallForHome(destination).then(h => {
      if (!cancelled) setHint(h);
    });
    return () => { cancelled = true; };
  }, [destination]);

  if (!hint) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl border border-border/50 bg-card/60 px-3 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors flex items-start gap-2"
      aria-label="Memory hint"
    >
      <Brain className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
      <span className="truncate">{hint}</span>
    </button>
  );
};

export default LastTimeHint;
