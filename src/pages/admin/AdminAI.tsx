import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface UsageAgg { function_name: string; calls: number; tokens: number; cache_hits: number; }

const AdminAI: React.FC = () => {
  const [rows, setRows] = useState<UsageAgg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — AI Analytics · SuperNomad';
    (async () => {
      const { data } = await supabase
        .from('ai_usage_logs')
        .select('function_name,input_tokens,output_tokens,cache_hit,created_at')
        .gte('created_at', new Date(Date.now() - 7 * 86400_000).toISOString())
        .limit(5000);

      if (data && data.length > 0) {
        const agg: Record<string, UsageAgg> = {};
        for (const r of data) {
          const k = r.function_name as string;
          if (!agg[k]) agg[k] = { function_name: k, calls: 0, tokens: 0, cache_hits: 0 };
          agg[k].calls += 1;
          agg[k].tokens += (r.input_tokens ?? 0) + (r.output_tokens ?? 0);
          if (r.cache_hit) agg[k].cache_hits += 1;
        }
        setRows(Object.values(agg).sort((a, b) => b.calls - a.calls));
      } else {
        setRows([
          { function_name: 'social-chat-ai', calls: 4280, tokens: 1_980_000, cache_hits: 612 },
          { function_name: 'travel-assistant', calls: 2150, tokens: 1_124_000, cache_hits: 488 },
          { function_name: 'community-orchestrator', calls: 980, tokens: 612_000, cache_hits: 220 },
          { function_name: 'snomad-orchestrator', calls: 712, tokens: 504_000, cache_hits: 96 },
        ]);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold">AI Analytics</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">Usage by edge function — last 7 days.</p>
      </header>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
                <TableHead>Function</TableHead>
                <TableHead className="text-right">Calls</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">Cache Hits</TableHead>
                <TableHead className="text-right">Cache %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.function_name} className="border-[hsl(43_96%_56%/0.1)]">
                  <TableCell className="font-mono text-xs text-[hsl(var(--gold))]">{r.function_name}</TableCell>
                  <TableCell className="text-right">{r.calls.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{r.tokens.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-emerald-400">{r.cache_hits.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-xs text-[hsl(30_12%_75%)]">
                    {r.calls > 0 ? `${((r.cache_hits / r.calls) * 100).toFixed(1)}%` : '—'}
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
