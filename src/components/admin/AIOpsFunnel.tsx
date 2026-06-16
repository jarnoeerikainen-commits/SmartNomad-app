import React from 'react';
import { ArrowDown } from 'lucide-react';

export interface FunnelStep {
  label: string;
  count: number;
  tone?: 'ok' | 'warn' | 'alert';
}

interface Props {
  steps: FunnelStep[]; // ordered top→bottom
  title?: string;
}

const TONE: Record<NonNullable<FunnelStep['tone']>, string> = {
  ok:    'from-emerald-500/25 to-emerald-500/5  border-emerald-500/30 text-emerald-200',
  warn:  'from-amber-500/25   to-amber-500/5    border-amber-500/30   text-amber-200',
  alert: 'from-red-500/25     to-red-500/5      border-red-500/30     text-red-200',
};

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

/**
 * AIOpsFunnel — Intents → Resolutions → Satisfaction → Escalations.
 * Compact, calm; widths scale to the first step.
 */
const AIOpsFunnel: React.FC<Props> = ({ steps, title = 'AI Ops funnel' }) => {
  const max = Math.max(...steps.map((s) => s.count), 1);
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_70%)] font-semibold">{title}</div>
      <div className="space-y-1.5">
        {steps.map((s, i) => {
          const pct = Math.max(8, Math.round((s.count / max) * 100));
          const tone = TONE[s.tone ?? 'ok'];
          const prev = i > 0 ? steps[i - 1].count : null;
          const dropPct = prev && prev > 0 ? Math.round(((prev - s.count) / prev) * 100) : 0;
          return (
            <div key={s.label}>
              <div
                className={`mx-auto rounded-md border bg-gradient-to-r ${tone} px-3 py-2 flex items-center justify-between transition-all`}
                style={{ width: `${pct}%`, minWidth: '40%' }}
              >
                <span className="text-[12px] font-medium truncate">{s.label}</span>
                <span className="text-[13px] font-bold num">{fmt(s.count)}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center justify-center text-[10px] text-[hsl(30_12%_60%)] py-0.5 gap-1">
                  <ArrowDown className="h-3 w-3" />
                  {dropPct > 0 && <span>−{dropPct}%</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIOpsFunnel;
