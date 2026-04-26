import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Loader2, Bot, Activity, Zap, Database, ShieldCheck, DollarSign, Timer } from 'lucide-react';
import { getAdminDemoDataset, type DemoAIUsage } from '@/utils/adminDemoData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

type AIProof = {
  run_ref: string;
  surface: string;
  function_name: string | null;
  primary_agent: string;
  status: string;
  model: string | null;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  estimated_cost_usd: number;
  verification_note: string | null;
  created_at: string;
};

const AdminAI: React.FC = () => {
  const [rows, setRows] = useState<DemoAIUsage[]>([]);
  const [proofs, setProofs] = useState<AIProof[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — AI Analytics · SuperNomad';
    (async () => {
      const [{ data }, proofResult] = await Promise.all([
        supabase
          .from('ai_usage_logs')
          .select('function_name,input_tokens,output_tokens,cache_hit,created_at')
          .gte('created_at', new Date(Date.now() - 7 * 86400_000).toISOString())
          .limit(5000),
        (supabase as any)
          .from('ai_execution_proofs')
          .select('run_ref,surface,function_name,primary_agent,status,model,input_tokens,output_tokens,latency_ms,estimated_cost_usd,verification_note,created_at')
          .gte('created_at', new Date(Date.now() - 14 * 86400_000).toISOString())
          .order('created_at', { ascending: false })
          .limit(200),
      ]);

      if (!proofResult.error) setProofs((proofResult.data || []) as AIProof[]);

      const demo = getAdminDemoDataset().aiUsage;
      if (data && data.length > 0) {
        // Merge real counts onto demo workers
        const realAgg: Record<string, { calls: number; tokens: number; cache: number }> = {};
        for (const r of data) {
          const k = r.function_name as string;
          if (!realAgg[k]) realAgg[k] = { calls: 0, tokens: 0, cache: 0 };
          realAgg[k].calls += 1;
          realAgg[k].tokens += (r.input_tokens ?? 0) + (r.output_tokens ?? 0);
          if (r.cache_hit) realAgg[k].cache += 1;
        }
        const merged = demo.map(d => {
          const r = realAgg[d.function_name];
          return r ? { ...d, calls: d.calls + r.calls, tokens: d.tokens + r.tokens, cache_hits: d.cache_hits + r.cache } : d;
        });
        setRows(merged);
      } else {
        setRows(demo);
      }
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const calls = rows.reduce((s, r) => s + r.calls, 0);
    const tokens = rows.reduce((s, r) => s + r.tokens, 0);
    const hits = rows.reduce((s, r) => s + r.cache_hits, 0);
    return {
      calls,
      tokens,
      hits,
      cachePct: calls ? Math.round((hits / calls) * 100) : 0,
      workers: rows.length,
      proofRuns: proofs.length,
      proofCost: proofs.reduce((sum, r) => sum + Number(r.estimated_cost_usd || 0), 0),
      avgLatency: proofs.length ? Math.round(proofs.reduce((sum, r) => sum + (r.latency_ms || 0), 0) / proofs.length) : 0,
      models: new Set(proofs.map((r) => r.model).filter(Boolean)).size,
    };
  }, [rows, proofs]);

  const proofTrend = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 86400_000);
      return { key: d.toISOString().slice(0, 10), day: d.toLocaleDateString('en-US', { weekday: 'short' }), runs: 0, cost: 0, tokens: 0 };
    });
    for (const proof of proofs) {
      const row = days.find((d) => d.key === proof.created_at.slice(0, 10));
      if (row) {
        row.runs += 1;
        row.cost += Number(proof.estimated_cost_usd || 0);
        row.tokens += (proof.input_tokens || 0) + (proof.output_tokens || 0);
      }
    }
    return days.map((d) => ({ ...d, cost: Number(d.cost.toFixed(4)) }));
  }, [proofs]);

  const modelMix = useMemo(() => {
    const agg: Record<string, { model: string; runs: number; tokens: number }> = {};
    for (const proof of proofs) {
      const model = proof.model || 'unknown';
      if (!agg[model]) agg[model] = { model: model.replace('google/', ''), runs: 0, tokens: 0 };
      agg[model].runs += 1;
      agg[model].tokens += (proof.input_tokens || 0) + (proof.output_tokens || 0);
    }
    return Object.values(agg).slice(0, 6);
  }, [proofs]);

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold">AI Analytics</h1>
        <p className="text-sm text-[hsl(30_12%_92%)] mt-1">
          {stats.workers} autonomous AI workers · {fmt(stats.calls)} calls/7d · {(stats.tokens / 1_000_000).toFixed(1)}M tokens
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Bot className="h-3.5 w-3.5 text-fuchsia-300" /> AI WORKERS LIVE</div>
          <div className="text-2xl font-bold text-fuchsia-300 mt-1">{stats.workers}</div>
          <div className="text-xs text-emerald-300 mt-0.5">all systems nominal</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Activity className="h-3.5 w-3.5" /> CALLS (7d)</div>
          <div className="text-2xl font-bold mt-1">{fmt(stats.calls)}</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Database className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> TOKENS (7d)</div>
          <div className="text-2xl font-bold text-[hsl(var(--gold))] mt-1">{(stats.tokens / 1_000_000).toFixed(1)}M</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Zap className="h-3.5 w-3.5 text-emerald-300" /> CACHE HIT</div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">{stats.cachePct}%</div>
        </Card>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> PROOF RUNS</div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">{fmt(stats.proofRuns)}</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><DollarSign className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> EST. COST</div>
          <div className="text-2xl font-bold text-[hsl(var(--gold))] mt-1">${stats.proofCost.toFixed(4)}</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Timer className="h-3.5 w-3.5" /> AVG LATENCY</div>
          <div className="text-2xl font-bold mt-1">{stats.avgLatency ? `${stats.avgLatency}ms` : '—'}</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Bot className="h-3.5 w-3.5 text-fuchsia-300" /> MODELS USED</div>
          <div className="text-2xl font-bold text-fuchsia-300 mt-1">{stats.models || '—'}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Proof of execution · live + history</h2>
            <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">verified-only</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={proofTrend}>
                <defs><linearGradient id="proofGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(43 96% 56%)" stopOpacity={0.55} /><stop offset="100%" stopColor="hsl(43 96% 56%)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="hsl(43 96% 56% / 0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="hsl(30 12% 60%)" fontSize={11} />
                <YAxis stroke="hsl(30 12% 60%)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(220 22% 6%)', border: '1px solid hsl(43 96% 56% / 0.3)', borderRadius: 8, color: 'hsl(30 12% 95%)' }} />
                <Area type="monotone" dataKey="runs" stroke="hsl(43 96% 56%)" strokeWidth={2} fill="url(#proofGold)" name="Proof runs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <h2 className="font-semibold mb-3">Model mix</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelMix} layout="vertical">
                <CartesianGrid stroke="hsl(43 96% 56% / 0.08)" strokeDasharray="3 3" />
                <XAxis type="number" stroke="hsl(30 12% 60%)" fontSize={11} />
                <YAxis dataKey="model" type="category" width={96} stroke="hsl(30 12% 60%)" fontSize={10} />
                <Tooltip contentStyle={{ background: 'hsl(220 22% 6%)', border: '1px solid hsl(43 96% 56% / 0.3)', borderRadius: 8, color: 'hsl(30 12% 95%)' }} />
                <Bar dataKey="runs" fill="hsl(43 96% 56%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {!!proofs.length && (
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <h2 className="font-semibold mb-3">Latest AI execution proofs</h2>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
                <TableHead>Surface</TableHead><TableHead>Agent</TableHead><TableHead>Model</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Tokens</TableHead><TableHead className="text-right">Cost</TableHead><TableHead>Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proofs.slice(0, 12).map((p) => (
                <TableRow key={p.run_ref} className="border-[hsl(43_96%_56%/0.1)]">
                  <TableCell>{p.surface}</TableCell><TableCell>{p.primary_agent}</TableCell><TableCell className="font-mono text-xs text-[hsl(var(--gold))]">{p.model || '—'}</TableCell><TableCell><Badge className={p.status === 'completed' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : p.status === 'failed' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-[hsl(var(--gold)/0.14)] text-[hsl(var(--gold))] border-[hsl(var(--gold)/0.3)]'}>{p.status}</Badge></TableCell><TableCell className="text-right">{fmt((p.input_tokens || 0) + (p.output_tokens || 0))}</TableCell><TableCell className="text-right">${Number(p.estimated_cost_usd || 0).toFixed(4)}</TableCell><TableCell className="max-w-[320px] truncate text-xs text-[hsl(30_12%_70%)]">{p.verification_note || 'Verified-only proof stored'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </Card>
      )}


      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
        ) : (
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
                <TableHead>AI Worker</TableHead>
                <TableHead>Edge Function</TableHead>
                <TableHead className="text-right">Calls (7d)</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">Cache Hits</TableHead>
                <TableHead className="text-right">Cache %</TableHead>
                <TableHead className="text-right">Uptime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.function_name} className="border-[hsl(43_96%_56%/0.1)]">
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-fuchsia-300">
                      <Bot className="h-3.5 w-3.5" /> {r.worker}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-[hsl(var(--gold))]">{r.function_name}</TableCell>
                  <TableCell className="text-right">{fmt(r.calls)}</TableCell>
                  <TableCell className="text-right">{fmt(r.tokens)}</TableCell>
                  <TableCell className="text-right text-emerald-400">{fmt(r.cache_hits)}</TableCell>
                  <TableCell className="text-right text-xs text-[hsl(30_12%_75%)]">
                    {r.calls > 0 ? `${((r.cache_hits / r.calls) * 100).toFixed(1)}%` : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">{r.uptime}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminAI;
