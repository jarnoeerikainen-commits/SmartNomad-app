import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Loader2, Bot, Activity, Zap, Database } from 'lucide-react';
import { getAdminDemoDataset, type DemoAIUsage } from '@/utils/adminDemoData';

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

const AdminAI: React.FC = () => {
  const [rows, setRows] = useState<DemoAIUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — AI Analytics · SuperNomad';
    (async () => {
      const { data } = await supabase
        .from('ai_usage_logs')
        .select('function_name,input_tokens,output_tokens,cache_hit,created_at')
        .gte('created_at', new Date(Date.now() - 7 * 86400_000).toISOString())
        .limit(5000);

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
    };
  }, [rows]);

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold">AI Analytics</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">
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

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
        ) : (
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
        )}
      </Card>
    </div>
  );
};

export default AdminAI;
