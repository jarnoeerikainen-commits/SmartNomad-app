// ═══════════════════════════════════════════════════════════════════════════
// AI COUNCIL DIGEST — Daily compilation of decisions from the 6 lead AIs
// Renders on the Back Office Overview page. Demo mode: 7 days deep.
// ═══════════════════════════════════════════════════════════════════════════
import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2, AlertTriangle, Eye, XCircle, Calendar, Users2, Sparkles, ChevronRight,
} from 'lucide-react';
import {
  generateCouncilDigest,
  type CouncilDay,
  type CouncilDecision,
} from '@/utils/aiCouncilDigestDemo';

const statusBadge: Record<CouncilDecision['status'], { label: string; cls: string; icon: React.ComponentType<any> }> = {
  approved:   { label: 'Approved',   cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 },
  flagged:    { label: 'Flagged',    cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',     icon: AlertTriangle },
  monitoring: { label: 'Monitoring', cls: 'bg-sky-500/15 text-sky-300 border-sky-500/30',           icon: Eye },
  rejected:   { label: 'Rejected',   cls: 'bg-red-500/15 text-red-300 border-red-500/30',           icon: XCircle },
};

const impactDot: Record<CouncilDecision['impact'], string> = {
  low: 'bg-zinc-500',
  medium: 'bg-amber-400',
  high: 'bg-[hsl(var(--gold))]',
};

const AICouncilDigest: React.FC = () => {
  const days = useMemo(() => generateCouncilDigest(7), []);
  const [activeISO, setActiveISO] = useState(days[0].date);
  const active: CouncilDay = days.find((d) => d.date === activeISO) ?? days[0];

  const counts = useMemo(() => {
    const byStatus = active.decisions.reduce<Record<string, number>>((a, d) => {
      a[d.status] = (a[d.status] ?? 0) + 1; return a;
    }, {});
    return {
      approved: byStatus.approved ?? 0,
      flagged: byStatus.flagged ?? 0,
      monitoring: byStatus.monitoring ?? 0,
      rejected: byStatus.rejected ?? 0,
    };
  }, [active]);

  return (
    <section className="mt-10">
      <header className="mb-4 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-display font-bold flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5 text-[hsl(var(--gold))]" />
            AI Council — Daily Digest
          </h2>
          <p className="text-sm text-[hsl(30_12%_75%)] mt-1">
            Decisions ratified by the 6 department-lead AIs at the 09:00 council meeting. Demo data, last 7 days.
          </p>
        </div>
        <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">DEMO</Badge>
      </header>

      {/* Day picker */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {days.map((d) => {
          const isActive = d.date === activeISO;
          return (
            <button
              key={d.date}
              onClick={() => setActiveISO(d.date)}
              className={`shrink-0 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                isActive
                  ? 'bg-[hsl(43_96%_56%/0.18)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.5)]'
                  : 'bg-[hsl(220_22%_10%)] text-[hsl(30_12%_85%)] border-[hsl(43_96%_56%/0.15)] hover:border-[hsl(43_96%_56%/0.4)] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {d.label}
              </div>
              <div className="text-[10px] opacity-75 mt-0.5">{d.date}</div>
            </button>
          );
        })}
      </div>

      {/* Day summary card */}
      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.2)] p-5 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <div className="text-[11px] uppercase tracking-wider text-[hsl(var(--gold))] mb-1">Council headline</div>
            <p className="text-lg font-semibold text-white leading-snug">{active.headline}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-[hsl(30_12%_80%)]">
              <span className="flex items-center gap-1.5">
                <Users2 className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
                {active.attendance}/6 leads present
              </span>
              <span>{active.decisions.length} decisions on the table</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 min-w-[260px]">
            <Stat label="Approved" value={counts.approved} accent="text-emerald-300" />
            <Stat label="Flagged" value={counts.flagged} accent="text-amber-300" />
            <Stat label="Watch" value={counts.monitoring} accent="text-sky-300" />
            <Stat label="Rejected" value={counts.rejected} accent="text-red-300" />
          </div>
        </div>

        {(active.highlights.length > 0 || active.concerns.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {active.highlights.length > 0 && (
              <div className="rounded-md bg-emerald-500/5 border border-emerald-500/20 p-3">
                <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold mb-1.5">Highlights</div>
                <ul className="space-y-1 text-sm text-white">
                  {active.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}
            {active.concerns.length > 0 && (
              <div className="rounded-md bg-amber-500/5 border border-amber-500/20 p-3">
                <div className="text-[10px] uppercase tracking-wider text-amber-300 font-bold mb-1.5">Watch list</div>
                <ul className="space-y-1 text-sm text-white">
                  {active.concerns.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Decisions list */}
      <div className="space-y-2">
        {active.decisions.map((d, i) => {
          const sb = statusBadge[d.status];
          const SIcon = sb.icon;
          return (
            <Card
              key={`${d.team}-${i}`}
              className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4 hover:border-[hsl(43_96%_56%/0.35)] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl leading-none mt-0.5" aria-hidden>{d.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[hsl(var(--gold))]">{d.team}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border font-semibold ${sb.cls}`}>
                      <SIcon className="h-3 w-3" /> {sb.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[hsl(30_12%_80%)]">
                      <span className={`h-1.5 w-1.5 rounded-full ${impactDot[d.impact]}`} />
                      {d.impact} impact
                    </span>
                    {d.metric && (
                      <span className="text-[10px] font-mono text-[hsl(var(--gold))] bg-[hsl(43_96%_56%/0.08)] border border-[hsl(43_96%_56%/0.25)] px-1.5 py-0.5 rounded">
                        {d.metric}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-white leading-snug">{d.title}</div>
                  <p className="text-sm text-[hsl(30_12%_82%)] mt-1 leading-relaxed">{d.summary}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[hsl(30_12%_55%)] mt-1 hidden sm:block" />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

const Stat: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <div className="rounded-md bg-[hsl(220_22%_8%)] border border-[hsl(43_96%_56%/0.15)] px-3 py-2 text-center">
    <div className={`text-xl font-bold leading-none ${accent}`}>{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_75%)] mt-1">{label}</div>
  </div>
);

export default AICouncilDigest;
