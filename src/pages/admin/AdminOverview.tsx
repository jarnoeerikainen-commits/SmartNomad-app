import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  Users, Activity, Zap, LifeBuoy, AlertTriangle, DollarSign,
  Building2, Wallet, TrendingUp, ShieldAlert, Sparkles, Brain,
  CheckCircle2, ChevronRight, Bell, Loader2, ArrowUpRight,
} from 'lucide-react';
import { platformRollup } from '@/utils/adminDemoData';
import AICouncilDigest from '@/components/admin/AICouncilDigest';
import { AdminLiveSignalsService, type LiveAggregate } from '@/services/AdminLiveSignalsService';
import { useNavigate } from 'react-router-dom';

interface Stats {
  total_users: number; dau_24h: number; mau_30d: number;
  ai_calls_24h: number; ai_tokens_30d: number;
  open_tickets: number; urgent_tickets: number;
  b2b_revenue_30d: number; active_affiliates: number;
  active_partners: number; pending_affiliate_payouts: number;
}

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
const fmtUsd = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// ── Sparkline (pure SVG, no deps) ─────────────────────────────────────────
const Sparkline: React.FC<{ values: number[]; tone?: 'ok' | 'warn' | 'alert' }> = ({ values, tone = 'ok' }) => {
  if (values.length < 2) return null;
  const w = 88, h = 24;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const stroke = tone === 'alert' ? 'hsl(0 80% 65%)' : tone === 'warn' ? 'hsl(38 92% 60%)' : 'hsl(152 69% 50%)';
  return (
    <svg width={w} height={h} className="block">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ── Tone helpers ──────────────────────────────────────────────────────────
const zscoreTone = (current: number, history: number[]): 'ok' | 'warn' | 'alert' => {
  if (history.length < 3) return 'ok';
  const mean = history.reduce((a, b) => a + b, 0) / history.length;
  const variance = history.reduce((a, b) => a + (b - mean) ** 2, 0) / history.length;
  const sd = Math.sqrt(variance) || 1;
  const z = Math.abs((current - mean) / sd);
  if (z > 2.5) return 'alert';
  if (z > 1.5) return 'warn';
  return 'ok';
};

// ── Next-actions queue (AI-prioritised from live signals + stats) ─────────
interface NextAction {
  id: string;
  severity: 'high' | 'med' | 'low';
  icon: React.ElementType;
  title: string;
  context: string;
  cta: string;
  href: string;
}

function buildNextActions(stats: Stats, agg: LiveAggregate): NextAction[] {
  const out: NextAction[] = [];
  if (stats.urgent_tickets > 0) {
    out.push({
      id: 'tix',
      severity: 'high',
      icon: AlertTriangle,
      title: `${stats.urgent_tickets} urgent support ticket${stats.urgent_tickets === 1 ? '' : 's'}`,
      context: 'Escalated by Concierge or flagged by users in the last 24h.',
      cta: 'Triage now',
      href: '/admin/tickets',
    });
  }
  if (stats.pending_affiliate_payouts > 0) {
    out.push({
      id: 'pay',
      severity: stats.pending_affiliate_payouts > 5000 ? 'high' : 'med',
      icon: Wallet,
      title: `${fmtUsd(stats.pending_affiliate_payouts)} pending affiliate payouts`,
      context: 'Approve, batch, or schedule payouts.',
      cta: 'Open affiliates',
      href: '/admin/affiliates',
    });
  }
  if (agg.open_problems >= 3) {
    out.push({
      id: 'prob',
      severity: agg.open_problems > 8 ? 'high' : 'med',
      icon: ShieldAlert,
      title: `${agg.open_problems} live user problems in last 15m`,
      context: agg.recent.find((s) => s.kind === 'problem')?.text ?? 'Check the live feed.',
      cta: 'Open live feed',
      href: '/admin/agent-live',
    });
  }
  if (agg.positive_pct > 0 && agg.positive_pct < 55 && agg.total_signals > 20) {
    out.push({
      id: 'sent',
      severity: 'med',
      icon: TrendingUp,
      title: `Sentiment dipped to ${agg.positive_pct}% positive`,
      context: 'Run an AI rule update or notify the duty PM.',
      cta: 'Open Concierge AI',
      href: '/admin/concierge',
    });
  }
  if (agg.top_wishes[0]) {
    out.push({
      id: 'wish',
      severity: 'low',
      icon: Sparkles,
      title: `Top wish: "${agg.top_wishes[0].text}"`,
      context: `${agg.top_wishes[0].n} users asked. Consider a roadmap card.`,
      cta: 'Brief AI Director',
      href: '/admin/directors',
    });
  }
  if (out.length === 0) {
    out.push({
      id: 'clear',
      severity: 'low',
      icon: CheckCircle2,
      title: 'Queue clear — nothing needs you right now',
      context: 'AI Brain will surface new items as they arrive.',
      cta: 'Open AI Brain',
      href: '/admin/brain',
    });
  }
  return out;
}

const sevTone = (s: NextAction['severity']) =>
  s === 'high' ? 'border-red-500/40 bg-red-500/10' :
  s === 'med'  ? 'border-amber-500/40 bg-amber-500/10' :
                 'border-emerald-500/30 bg-emerald-500/10';

const sevDot = (s: NextAction['severity']) =>
  s === 'high' ? 'bg-red-400' : s === 'med' ? 'bg-amber-400' : 'bg-emerald-400';

// ── Cockpit ───────────────────────────────────────────────────────────────
const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [agg, setAgg] = useState<LiveAggregate | null>(null);
  const [history, setHistory] = useState<Record<string, number[]>>({
    signals: [], revenue: [], problems: [], sentiment: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Operator Cockpit · SuperNomad';
    (async () => {
      const { data, error } = await supabase.rpc('get_platform_stats' as any);
      setStats(!error && data && data.length > 0 ? (data[0] as Stats) : (platformRollup() as Stats));
      setLoading(false);
    })();
  }, []);

  // Live signal pump + rolling history (last 12 ticks)
  useEffect(() => {
    AdminLiveSignalsService.start();
    const update = () => {
      const a = AdminLiveSignalsService.aggregate(15 * 60_000);
      setAgg(a);
      setHistory((h) => {
        const push = (arr: number[], v: number) => [...arr.slice(-11), v];
        return {
          signals: push(h.signals, a.total_signals),
          revenue: push(h.revenue, a.revenue_window_usd),
          problems: push(h.problems, a.open_problems),
          sentiment: push(h.sentiment, a.positive_pct),
        };
      });
    };
    update();
    const t = setInterval(update, 4000);
    return () => clearInterval(t);
  }, []);

  const nextActions = useMemo(
    () => (stats && agg ? buildNextActions(stats, agg) : []),
    [stats, agg]
  );

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--gold))]" />
      </div>
    );
  }

  const pulse = [
    { label: 'Signals / 15m', value: fmt(agg?.total_signals ?? 0), series: history.signals,
      tone: zscoreTone(agg?.total_signals ?? 0, history.signals), icon: Activity },
    { label: 'Revenue / 15m', value: fmtUsd(agg?.revenue_window_usd ?? 0), series: history.revenue,
      tone: zscoreTone(agg?.revenue_window_usd ?? 0, history.revenue), icon: DollarSign },
    { label: 'Open problems', value: fmt(agg?.open_problems ?? 0), series: history.problems,
      tone: (agg?.open_problems ?? 0) > 5 ? 'alert' : (agg?.open_problems ?? 0) > 2 ? 'warn' : 'ok', icon: ShieldAlert },
    { label: 'Sentiment %', value: `${agg?.positive_pct ?? 0}%`, series: history.sentiment,
      tone: (agg?.positive_pct ?? 100) < 55 ? 'warn' : 'ok', icon: TrendingUp },
  ] as const;

  const secondary = [
    { icon: Users, label: 'Total users', value: fmt(stats.total_users) },
    { icon: Activity, label: 'DAU (24h)', value: fmt(stats.dau_24h) },
    { icon: TrendingUp, label: 'MAU (30d)', value: fmt(stats.mau_30d) },
    { icon: Zap, label: 'AI calls (24h)', value: fmt(stats.ai_calls_24h) },
    { icon: Brain, label: 'AI tokens (30d)', value: fmt(stats.ai_tokens_30d) },
    { icon: LifeBuoy, label: 'Open tickets', value: fmt(stats.open_tickets) },
    { icon: DollarSign, label: 'B2B revenue (30d)', value: fmtUsd(stats.b2b_revenue_30d) },
    { icon: Building2, label: 'API partners', value: fmt(stats.active_partners) },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 num">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--gold))] font-semibold">
            Operator Cockpit
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
            What needs you, right now.
          </h1>
          <p className="text-sm text-[hsl(30_12%_75%)] mt-1">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] font-mono">⌘K</kbd> for operator commands.
          </p>
        </div>
        <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          Live signals streaming
        </Badge>
      </header>

      {/* 3-pane cockpit ─ Pulse · Actions · Brain */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── Pulse ── */}
        <Card className="lg:col-span-3 bg-gradient-to-br from-[hsl(220_22%_11%)] to-[hsl(220_22%_8%)] border-[hsl(43_96%_56%/0.2)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-[hsl(var(--gold))]" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Pulse</h2>
          </div>
          <div className="space-y-3">
            {pulse.map((p) => (
              <div key={p.label} className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_70%)]">{p.label}</div>
                  <div className={`text-lg font-bold leading-tight num ${
                    p.tone === 'alert' ? 'text-red-300' : p.tone === 'warn' ? 'text-amber-300' : 'text-white'
                  }`}>{p.value}</div>
                </div>
                <Sparkline values={p.series} tone={p.tone} />
              </div>
            ))}
          </div>
        </Card>

        {/* ── Actions queue ── */}
        <Card className="lg:col-span-6 bg-gradient-to-br from-[hsl(220_22%_11%)] to-[hsl(220_22%_8%)] border-[hsl(43_96%_56%/0.2)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[hsl(var(--gold))]" />
              <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Next actions</h2>
            </div>
            <span className="text-[10px] text-[hsl(30_12%_65%)]">AI-ranked · refreshes every 4s</span>
          </div>
          <div className="space-y-2">
            {nextActions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => navigate(a.href)}
                  className={`w-full text-left flex items-start gap-3 px-3 py-3 rounded-lg border ${sevTone(a.severity)} hover:bg-white/5 transition-colors group`}
                >
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <span className={`h-2 w-2 rounded-full ${sevDot(a.severity)}`} />
                    <Icon className="h-4 w-4 text-white/80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{a.title}</div>
                    <div className="text-xs text-[hsl(30_12%_75%)] mt-0.5 line-clamp-2">{a.context}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[hsl(var(--gold))] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {a.cta} <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* ── Brain ── */}
        <Card className="lg:col-span-3 bg-gradient-to-br from-[hsl(220_22%_11%)] to-[hsl(220_22%_8%)] border-[hsl(43_96%_56%/0.2)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-[hsl(var(--gold))]" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Brain</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_70%)] mb-1">Top wish</div>
              <div className="text-white text-sm leading-snug">
                {agg?.top_wishes[0]?.text ?? '—'}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_70%)] mb-1">Hottest city</div>
              <div className="text-white text-sm">{agg?.top_cities[0]?.city ?? '—'}</div>
            </div>
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-white hover:bg-white/5"
                onClick={() => navigate('/admin/brain')}
              >
                Open AI Brain <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-white hover:bg-white/5"
                onClick={() => navigate('/admin/ceo')}
              >
                AI CEO digest <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary KPI strip (calm, dense, Stripe-style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {secondary.map(({ icon: Icon, label, value }) => (
          <Card
            key={label}
            className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.12)] p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
              <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_70%)] truncate">{label}</div>
            </div>
            <div className="text-base font-bold text-white num leading-tight">{value}</div>
          </Card>
        ))}
      </div>

      {/* Council digest */}
      <AICouncilDigest />
    </div>
  );
};

export default AdminOverview;
