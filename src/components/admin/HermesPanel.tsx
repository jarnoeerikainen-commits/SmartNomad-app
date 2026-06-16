import React, { useState, useEffect, useCallback } from 'react';
import { Send, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { LiveAggregate } from '@/services/AdminLiveSignalsService';

interface Stats {
  total_users?: number; urgent_tickets?: number; pending_affiliate_payouts?: number;
}

interface Props {
  agg: LiveAggregate | null;
  stats: Stats | null;
}

/**
 * Hermes — operator's messenger AI. Calls the admin-hermes edge function,
 * gracefully falls back to a deterministic local dispatch when offline.
 */
const HermesPanel: React.FC<Props> = ({ agg, stats }) => {
  const [dispatch, setDispatch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');

  const snapshot = () => ({
    total_signals: agg?.total_signals,
    revenue_window_usd: agg?.revenue_window_usd,
    open_problems: agg?.open_problems,
    positive_pct: agg?.positive_pct,
    top_wish: agg?.top_wishes?.[0]?.text,
    hottest_city: agg?.top_cities?.[0]?.city,
    urgent_tickets: stats?.urgent_tickets,
    pending_payouts_usd: stats?.pending_affiliate_payouts,
    total_users: stats?.total_users,
  });

  const run = useCallback(async (mode: 'briefing' | 'ask', q?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-hermes', {
        body: { mode, question: q, snapshot: snapshot() },
      });
      if (error) throw error;
      setDispatch((data as any)?.dispatch ?? 'No response.');
    } catch {
      setDispatch('Hermes is offline — try again shortly.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agg, stats]);

  // First briefing once we have data
  useEffect(() => {
    if (agg && stats && !dispatch && !loading) run('briefing');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agg, stats]);

  const onAsk = () => {
    const q = question.trim();
    if (!q) return;
    run('ask', q);
    setQuestion('');
  };

  // Render markdown-ish bullets without pulling react-markdown
  const lines = dispatch.split('\n');

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
          <span className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_70%)] font-semibold">
            Hermes · messenger AI
          </span>
        </div>
        <button
          onClick={() => run('briefing')}
          disabled={loading}
          className="text-[10px] text-[hsl(30_12%_70%)] hover:text-white transition-colors flex items-center gap-1"
          aria-label="Refresh briefing"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Thinking…' : 'Refresh'}
        </button>
      </div>

      <div className="min-h-[120px] text-[13px] text-white/95 leading-relaxed space-y-1.5">
        {loading && !dispatch && (
          <div className="flex items-center gap-2 text-[hsl(30_12%_70%)]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Hermes is reading the signals…
          </div>
        )}
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            return (
              <div key={i} className="flex gap-2 pl-1">
                <span className="text-[hsl(var(--gold))] shrink-0">•</span>
                <span>{trimmed.replace(/^[-•]\s*/, '')}</span>
              </div>
            );
          }
          // Bold the recommended action line whether the model wrapped just the label or the whole sentence
          if (/recommended next action/i.test(trimmed)) {
            const clean = trimmed.replace(/\*\*/g, '').replace(/^[*-]\s*/, '');
            return (
              <div key={i} className="mt-2 pt-2 border-t border-white/10 text-[hsl(var(--gold))] font-semibold">
                {clean}
              </div>
            );
          }
          // Strip stray markdown bold inline
          const cleanLine = trimmed.replace(/\*\*(.+?)\*\*/g, '$1');
          return <div key={i}>{cleanLine}</div>;
        })}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onAsk(); }}
          placeholder="Ask Hermes…"
          className="flex-1 bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-[12px] text-white placeholder:text-[hsl(30_12%_60%)] outline-none focus:border-[hsl(var(--gold))]/50"
          aria-label="Ask Hermes"
        />
        <Button size="sm" onClick={onAsk} disabled={loading || !question.trim()} className="h-7 px-2">
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default HermesPanel;
