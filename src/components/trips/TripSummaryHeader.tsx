import React from 'react';
import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';

export type TripStatusTone = 'green' | 'amber' | 'red';

interface Props {
  destination: string;
  /** 2-line summary, evidence-grounded. */
  summary: string;
  tone?: TripStatusTone;
  source?: string;
}

const TONE: Record<TripStatusTone, { icon: React.ElementType; ring: string; text: string; bg: string }> = {
  green: { icon: ShieldCheck,    ring: 'ring-emerald-500/30', text: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-500/5' },
  amber: { icon: Info,           ring: 'ring-amber-500/30',   text: 'text-amber-700 dark:text-amber-300',     bg: 'bg-amber-500/5' },
  red:   { icon: AlertTriangle,  ring: 'ring-red-500/30',     text: 'text-red-700 dark:text-red-300',         bg: 'bg-red-500/5' },
};

/**
 * 2-line evidence-grounded summary header for a trip tab.
 * E.g. "Greece is green. ETIAS in effect. Your insurance covers it."
 * Always cite a source so we stay Evidence-First.
 */
const TripSummaryHeader: React.FC<Props> = ({ destination, summary, tone = 'green', source }) => {
  const t = TONE[tone];
  const Icon = t.icon;
  return (
    <div className={`rounded-xl ${t.bg} ${t.ring} ring-1 p-3 sm:p-4 flex items-start gap-3`}>
      <Icon className={`h-5 w-5 shrink-0 ${t.text}`} aria-hidden="true" />
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          {destination}
        </div>
        <p className={`text-sm leading-snug mt-0.5 ${t.text}`}>{summary}</p>
        {source && (
          <div className="text-[10px] text-muted-foreground mt-1">
            Source: <span className="font-medium">{source}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripSummaryHeader;
