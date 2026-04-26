import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Bot, CheckCircle2, Clock, Database, Radio, Search, ShieldCheck, TriangleAlert, UserRound, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdminAgentActivityService, type AgentActivityRun } from '@/services/AdminAgentActivityService';

function fmtAgo(ts: number) {
  const sec = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (sec < 60) return `${sec}s ago`;
  return `${Math.round(sec / 60)}m ago`;
}

const statusClass: Record<string, string> = {
  running: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  completed: 'bg-[hsl(var(--gold)/0.14)] text-[hsl(var(--gold))] border-[hsl(var(--gold)/0.3)]',
  failed: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

const stepIcon: Record<string, React.ElementType> = {
  queued: Clock,
  running: Zap,
  done: CheckCircle2,
  blocked: ShieldCheck,
  failed: TriangleAlert,
};

function hostFromUrl(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

const AdminAgentLive: React.FC = () => {
  const [runs, setRuns] = useState<AgentActivityRun[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    document.title = 'Back Office — Live Agent Work · SuperNomad';
    const off = AdminAgentActivityService.subscribe(setRuns);
    const timer = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => { off(); clearInterval(timer); };
  }, []);

  const stats = useMemo(() => ({
    live: runs.filter((r) => r.status === 'running').length,
    completed: runs.filter((r) => r.status === 'completed').length,
    john: runs.filter((r) => /john/i.test(r.persona)).length,
    agents: new Set(runs.flatMap((r) => [r.primary_agent, ...r.steps.map((s) => s.agent)])).size,
  }), [runs]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[hsl(var(--gold))] text-xs uppercase tracking-[0.24em]">
            <Radio className="h-4 w-4" /> Live operations feed
          </div>
          <h1 className="mt-2 text-3xl font-semibold text-[hsl(30_12%_95%)]">AI Agent Workstream</h1>
          <p className="mt-1 max-w-3xl text-sm text-[hsl(30_12%_70%)]">
            Real-time trace of John/demo and live-user commands: which agents route the work, what they verify, where they search, and how the closed-loop back office responds.
          </p>
        </div>
        <Badge className="w-fit border-emerald-500/30 bg-emerald-500/15 text-emerald-300">
          <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Online
        </Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          ['Running now', stats.live, Activity],
          ['Completed runs', stats.completed, CheckCircle2],
          ['John profile traces', stats.john, UserRound],
          ['Agents visible', stats.agents, Bot],
        ].map(([label, value, Icon]: any) => (
          <Card key={label} className="border-[hsl(var(--gold)/0.16)] bg-[hsl(220_22%_6%)] p-4">
            <div className="flex items-center justify-between text-[hsl(30_12%_70%)]">
              <span className="text-xs uppercase tracking-wider">{label}</span>
              <Icon className="h-4 w-4 text-[hsl(var(--gold))]" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-[hsl(30_12%_95%)]">{value}</div>
          </Card>
        ))}
      </div>

      <Card className="border-[hsl(var(--gold)/0.16)] bg-[hsl(220_22%_6%)]">
        <div className="border-b border-[hsl(var(--gold)/0.14)] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-[hsl(30_12%_90%)]">
            <Search className="h-4 w-4 text-[hsl(var(--gold))]" /> Command-to-agent trace
          </div>
          <span className="text-xs text-[hsl(30_12%_60%)]">Newest first · verified-only policy</span>
        </div>
        <ScrollArea className="h-[calc(100vh-310px)] min-h-[420px]">
          <div className="divide-y divide-[hsl(var(--gold)/0.1)]">
            {runs.map((run) => (
              <div key={run.id} className="p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={statusClass[run.status]}>{run.status.toUpperCase()}</Badge>
                      <span className="text-sm font-semibold text-[hsl(30_12%_95%)]">{run.surface}</span>
                      <span className="text-xs text-[hsl(30_12%_55%)]">{fmtAgo(run.ts)}</span>
                    </div>
                    <div className="mt-2 text-sm text-[hsl(30_12%_82%)]">“{run.command}”</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-[hsl(30_12%_62%)]">
                      <span>{run.user_alias}</span>
                      <span>•</span>
                      <span>{run.route}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                    {run.directors.map((d) => <Badge key={d} variant="outline" className="border-[hsl(var(--gold)/0.2)] text-[hsl(30_12%_78%)]">{d}</Badge>)}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
                  <div className="space-y-2">
                    {run.steps.map((step, idx) => {
                      const Icon = stepIcon[step.status] || Clock;
                      return (
                        <div key={step.id} className="grid grid-cols-[24px_1fr] gap-3 rounded-md border border-[hsl(var(--gold)/0.1)] bg-[hsl(220_22%_8%)] p-3">
                          <Icon className={`mt-0.5 h-4 w-4 ${step.status === 'running' ? 'text-emerald-300 animate-pulse' : step.status === 'done' ? 'text-[hsl(var(--gold))]' : step.status === 'failed' ? 'text-rose-300' : 'text-[hsl(30_12%_50%)]'}`} />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs text-[hsl(30_12%_50%)]">0{idx + 1}</span>
                              <span className="text-sm font-medium text-[hsl(30_12%_90%)]">{step.agent}</span>
                              <span className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_55%)]">{step.status}</span>
                            </div>
                            <div className="mt-1 text-sm text-[hsl(30_12%_72%)]">{step.action}</div>
                            <div className="mt-1 flex items-start gap-1.5 text-xs text-[hsl(30_12%_55%)]"><Database className="mt-0.5 h-3 w-3" /> {step.source}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-md border border-[hsl(var(--gold)/0.1)] bg-[hsl(220_22%_8%)] p-3">
                    <div className="text-xs uppercase tracking-wider text-[hsl(var(--gold))]">Search / source map</div>
                    <div className="mt-3 space-y-2">
                      {run.sources.map((source) => (
                        <div key={source} className="flex gap-2 text-sm text-[hsl(30_12%_75%)]">
                          <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
                          <span>{source}</span>
                        </div>
                      ))}
                    </div>
                    {(run.result_summary || run.error) && (
                      <div className="mt-4 rounded border border-[hsl(var(--gold)/0.1)] bg-[hsl(220_22%_10%)] p-3 text-sm text-[hsl(30_12%_72%)]">
                        {run.error || run.result_summary}
                      </div>
                    )}
                    {(run.response_excerpt || run.answer_agents?.length || run.answer_sources?.length || run.websites?.length) && (
                      <div className="mt-4 space-y-3 rounded border border-[hsl(var(--gold)/0.1)] bg-[hsl(220_22%_10%)] p-3">
                        {run.response_excerpt && (
                          <div>
                            <div className="text-xs uppercase tracking-wider text-[hsl(var(--gold))]">Concierge response</div>
                            <p className="mt-1 line-clamp-6 text-sm text-[hsl(30_12%_78%)]">{run.response_excerpt}</p>
                          </div>
                        )}
                        {!!run.answer_agents?.length && (
                          <div className="flex flex-wrap gap-2">
                            {run.answer_agents.map((agent) => <Badge key={agent} variant="outline" className="border-emerald-500/25 text-emerald-300">{agent}</Badge>)}
                          </div>
                        )}
                        {!!run.answer_sources?.length && (
                          <div className="space-y-1 text-xs text-[hsl(30_12%_62%)]">
                            {run.answer_sources.map((source) => <div key={source}>• {source}</div>)}
                          </div>
                        )}
                        {!!run.websites?.length && (
                          <div className="flex flex-wrap gap-2 text-xs">
                            {run.websites.map((site) => <span key={site} className="rounded border border-[hsl(var(--gold)/0.14)] px-2 py-1 text-[hsl(30_12%_70%)]">{hostFromUrl(site)}</span>)}
                          </div>
                        )}
                        {run.verification_note && <div className="text-xs text-emerald-300">{run.verification_note}</div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default AdminAgentLive;
