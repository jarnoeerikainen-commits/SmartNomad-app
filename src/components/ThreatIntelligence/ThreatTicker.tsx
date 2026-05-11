import React, { useEffect, useState } from 'react';
import { ThreatIntelligenceService } from '@/services/ThreatIntelligenceService';
import { ThreatIncident, ThreatSeverity } from '@/types/threat';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  onExpand?: () => void;
}

const sevColor: Record<ThreatSeverity, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-yellow-500',
  info: 'bg-blue-500',
};

const ThreatTicker: React.FC<Props> = ({ onExpand }) => {
  const [items, setItems] = useState<ThreatIncident[]>([]);

  useEffect(() => {
    setItems(ThreatIntelligenceService.getActiveThreats(500).slice(0, 6));
  }, []);

  const isClear = items.length === 0;

  return (
    <button
      onClick={onExpand}
      className={cn(
        'group w-full overflow-hidden rounded-xl border text-left transition-colors',
        'flex items-center gap-3 px-3 h-9',
        isClear
          ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
          : 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'
      )}
      aria-label="Threat intelligence ticker"
    >
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold flex-shrink-0">
        {isClear ? (
          <><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /><span className="text-emerald-700">All clear</span></>
        ) : (
          <><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60" /><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" /></span><span className="text-amber-700">Live</span></>
        )}
      </span>
      <div className="flex-1 min-w-0 overflow-hidden relative h-full">
        {isClear ? (
          <div className="flex items-center h-full text-xs text-muted-foreground">No active alerts in your monitored regions</div>
        ) : (
          <div
            className="flex items-center gap-6 h-full whitespace-nowrap"
            style={{ animation: 'sn-marquee 38s linear infinite' }}
          >
            {[...items, ...items].map((t, i) => (
              <span key={i} className="flex items-center gap-2 text-xs">
                <span className={cn('h-1.5 w-1.5 rounded-full', sevColor[t.severity])} />
                <span className="font-medium text-foreground/90">{t.title}</span>
                <span className="text-muted-foreground">· {t.location.city}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
      <style>{`@keyframes sn-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </button>
  );
};

export default ThreatTicker;
