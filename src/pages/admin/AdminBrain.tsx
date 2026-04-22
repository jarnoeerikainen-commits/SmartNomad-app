import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain, Sparkles, AlertTriangle, TrendingUp, TrendingDown, Activity,
  Lightbulb, FileText, Loader2, RefreshCw, CheckCircle2, X, Clock,
  Zap, Users, DollarSign, MessageSquareHeart
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import { toast } from 'sonner';
import { useStaffRole } from '@/hooks/useStaffRole';

// ════════════════════════════════════════════════════════════════════
// Demo seed — rich, realistic synthetic data so the brain UI is alive
// even before the edge function has been triggered for the first time.
// ════════════════════════════════════════════════════════════════════
const DEMO_INSIGHTS = [
  { id: 'd1', category: 'opportunity', severity: 'high', confidence: 0.92,
    title: 'Tokyo concierge requests up 38% week-over-week',
    summary: '184 nomads asked Sofia/Marcus about Tokyo flights, hotels and visa runs in the last 7 days — a 38% jump. None converted to a paid trip plan yet.',
    affected_count: 184, status: 'open', created_at: new Date(Date.now() - 4*3600_000).toISOString() },
  { id: 'd2', category: 'churn_signal', severity: 'critical', confidence: 0.88,
    title: '12 premium users idle 21+ days after concierge frustration',
    summary: 'Sentiment scoring on their last conversations shows 3+ negative turns. ARPU at risk: $719/month. Suggest targeted re-engagement.',
    affected_count: 12, status: 'open', created_at: new Date(Date.now() - 7*3600_000).toISOString() },
  { id: 'd3', category: 'pattern', severity: 'medium', confidence: 0.81,
    title: 'Saturday 18:00 UTC = peak travel-planner usage',
    summary: 'Travel-planner edge function sees 4.2× baseline load every Saturday evening UTC, mostly EU + LATAM users. No degradation yet but cache hit drops to 11%.',
    affected_count: 1240, status: 'open', created_at: new Date(Date.now() - 11*3600_000).toISOString() },
  { id: 'd4', category: 'revenue', severity: 'high', confidence: 0.95,
    title: 'B2B "Wellness Buyers EU" package: 3 inbound in 48h',
    summary: 'Three new partner enquiries cite the same data package. Inventory currently priced at $42 CPM — comparable IAB segments command $58–72.',
    affected_count: 3, status: 'open', created_at: new Date(Date.now() - 18*3600_000).toISOString() },
  { id: 'd5', category: 'concierge_quality', severity: 'medium', confidence: 0.79,
    title: 'Sofia averages 1.8s reply latency on flight queries',
    summary: 'Above the 1.2s SLA. Driven by tool-calling chain for flight aggregator. Suggest pre-warming or model swap to flash-lite for the first turn.',
    affected_count: 0, status: 'open', created_at: new Date(Date.now() - 22*3600_000).toISOString() },
  { id: 'd6', category: 'growth', severity: 'info', confidence: 0.86,
    title: 'Affiliate "snomad-7K2X" drove 41 paid signups this week',
    summary: 'Single affiliate accounts for 23% of weekly conversions. Consider a Tier-1 upgrade (25% → 30% L1 commission) to lock loyalty.',
    affected_count: 41, status: 'open', created_at: new Date(Date.now() - 28*3600_000).toISOString() },
];

const DEMO_RECS = [
  { id: 'r1', kind: 'new_order', priority: 'high', confidence: 0.91,
    title: 'Launch a "Tokyo Premium Trip Plan" featured order',
    rationale: '184 high-intent concierge queries in 7 days, zero conversion. A pre-built premium itinerary at $149 with concierge add-on would capture this demand.',
    suggested_action: 'Publish a "Tokyo: 7-Night Concierge Trip" card on the home dashboard for 14 days, gated by Premium tier.',
    expected_impact: 'Estimated 9–14 conversions ($1.3K–$2.1K MRR uplift).',
    status: 'pending', created_at: new Date(Date.now() - 3*3600_000).toISOString() },
  { id: 'r2', kind: 'churn_save', priority: 'urgent', confidence: 0.87,
    title: 'Personal email + 1 free month to 12 idle premium users',
    rationale: 'Negative sentiment + 21+ days idle = 78% historical churn. ARPU lost: $719/month. Cost of save: $0 (free month is absorbed).',
    suggested_action: 'Send templated apology + offer; route reply to support queue with priority=high.',
    expected_impact: 'Save 6–8 of 12 users (~$430/mo retained).',
    status: 'pending', created_at: new Date(Date.now() - 5*3600_000).toISOString() },
  { id: 'r3', kind: 'concierge_tweak', priority: 'medium', confidence: 0.74,
    title: 'Use gemini-3-flash-lite for first turn of flight queries',
    rationale: 'First turn is intent classification — flash-lite is 3× cheaper and 40% faster. Quality regression risk is low for classification.',
    suggested_action: 'Update travel-assistant edge function: route turn-1 to flash-lite, escalate to flash on second turn.',
    expected_impact: 'Cut p50 latency 1.8s → 1.0s, save ~$120/mo on tokens.',
    status: 'pending', created_at: new Date(Date.now() - 9*3600_000).toISOString() },
  { id: 'r4', kind: 'pricing_change', priority: 'high', confidence: 0.89,
    title: 'Raise "Wellness Buyers EU" CPM to $58',
    rationale: 'Three partner enquiries in 48h + IAB benchmark $58–72. Current $42 leaves ~$3.2K/mo on the table per partner.',
    suggested_action: 'Update package CPM in B2B Data section. Grandfather existing subscriptions for 60 days.',
    expected_impact: 'Estimated +$9.6K/mo across the 3 inbound + 2 active partners.',
    status: 'pending', created_at: new Date(Date.now() - 14*3600_000).toISOString() },
  { id: 'r5', kind: 'feature_promote', priority: 'medium', confidence: 0.72,
    title: 'Promote Travel Inbox to the 1,200 Saturday-evening users',
    rationale: 'Saturday peak travel-planner users overlap 64% with users who never enabled email forwarding. Feature would increase stickiness.',
    suggested_action: 'Add a one-tap CTA banner inside Travel Planner results, only on Saturdays.',
    expected_impact: 'Estimated 180 new Inbox connections (+12% MAU stickiness).',
    status: 'pending', created_at: new Date(Date.now() - 19*3600_000).toISOString() },
];

const DEMO_REPORT = {
  id: 'rep_demo',
  title: 'Back Office Brief — Last 7 Days',
  executive_summary: 'Healthy week: AI usage +18%, B2B revenue +24%, support load flat. Two material risks: 12 premium users showing churn signal and travel-assistant latency creeping above SLA on flight queries.',
  narrative: 'The platform processed 28,420 AI calls across 8 edge functions, with cache hit rate at 31% (target: 40%). Revenue mix shifted toward B2B data ($14.2K, +24%) as four new packages went live. Affiliate channel produced $4.8K in new pending commissions, dominated by one super-affiliate (41 signups, 23% of weekly conversions). Concierge quality is mostly green — Sofia and Marcus achieved a 4.6/5 satisfaction proxy (sentiment-derived) — but the flight-query subroutine is dragging p50 latency to 1.8s. The most material risk is a tightly-clustered set of 12 high-ARPU users showing 21+ days of idle behavior after frustrated conversations.',
  highlights: [
    'B2B revenue +24% week-over-week ($14.2K)',
    'Tokyo concierge demand surged 38% (untapped)',
    'One affiliate drove 23% of weekly conversions',
  ],
  concerns: [
    '12 premium users at high churn risk ($719/mo ARPU exposed)',
    'Flight-query latency 1.8s — above 1.2s SLA',
  ],
  created_at: new Date(Date.now() - 6*3600_000).toISOString(),
};

// Demo charts data
const usageTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  calls: 1800 + Math.round(Math.random() * 1200) + i * 50,
  tokens: 420000 + Math.round(Math.random() * 180000) + i * 12000,
}));
const revenueMix = [
  { name: 'B2B Data', value: 14200, fill: 'hsl(43 96% 56%)' },
  { name: 'Subscriptions', value: 8900, fill: 'hsl(160 70% 45%)' },
  { name: 'Affiliate Net', value: 4800, fill: 'hsl(220 80% 60%)' },
  { name: 'Agentic Fees', value: 2100, fill: 'hsl(280 70% 60%)' },
];
const conciergeQuality = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
  satisfaction: 4.2 + Math.random() * 0.6,
  latency: 0.9 + Math.random() * 1.0,
}));

// ─── Helpers ─────────────────────────────────────────────────────────
const severityStyle = (s: string) => {
  switch (s) {
    case 'critical': return 'bg-red-500/15 text-red-400 border-red-500/30';
    case 'high': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    case 'medium': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'low': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
};
const priorityStyle = (p: string) => {
  switch (p) {
    case 'urgent': return 'bg-red-500/15 text-red-400 border-red-500/30';
    case 'high': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    case 'medium': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    default: return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  }
};
const categoryIcon = (c: string) => {
  switch (c) {
    case 'revenue': return <DollarSign className="h-4 w-4" />;
    case 'churn_signal': return <TrendingDown className="h-4 w-4" />;
    case 'opportunity': return <Sparkles className="h-4 w-4" />;
    case 'concierge_quality': return <MessageSquareHeart className="h-4 w-4" />;
    case 'engagement': return <Activity className="h-4 w-4" />;
    case 'growth': return <TrendingUp className="h-4 w-4" />;
    case 'risk':
    case 'anomaly': return <AlertTriangle className="h-4 w-4" />;
    default: return <Brain className="h-4 w-4" />;
  }
};
const timeAgo = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─── Component ───────────────────────────────────────────────────────
const AdminBrain: React.FC = () => {
  const { isDemoMode, isAdmin } = useStaffRole();
  const [insights, setInsights] = useState<any[]>([]);
  const [recs, setRecs] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => { document.title = 'Back Office — AI Brain · SuperNomad'; }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [insRes, recRes, repRes, runRes, sumRes] = await Promise.all([
        supabase.from('admin_ai_insights' as any).select('*').order('created_at', { ascending: false }).limit(40),
        supabase.from('admin_ai_recommendations' as any).select('*').order('created_at', { ascending: false }).limit(40),
        supabase.from('admin_ai_reports' as any).select('*').order('period_end', { ascending: false }).limit(10),
        supabase.from('admin_ai_brain_runs' as any).select('*').order('started_at', { ascending: false }).limit(10),
        supabase.rpc('get_admin_brain_summary' as any),
      ]);

      const ins = (insRes.data as any[]) ?? [];
      const rec = (recRes.data as any[]) ?? [];
      const rep = (repRes.data as any[]) ?? [];
      const run = (runRes.data as any[]) ?? [];

      setInsights(ins.length ? ins : DEMO_INSIGHTS);
      setRecs(rec.length ? rec : DEMO_RECS);
      setReports(rep.length ? rep : [DEMO_REPORT]);
      setRuns(run);
      setSummary((sumRes.data as any[])?.[0] ?? null);
    } catch (e) {
      console.warn('Brain load fallback:', e);
      setInsights(DEMO_INSIGHTS); setRecs(DEMO_RECS); setReports([DEMO_REPORT]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const triggerBrain = async (scope: 'quick' | 'full') => {
    if (isDemoMode) {
      toast.info('Demo mode — brain run simulated. Seeded data refreshed.');
      await loadAll();
      return;
    }
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-brain', {
        body: { trigger: 'manual', scope },
      });
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error ?? 'Run failed');
      toast.success(
        `Brain run complete: ${data.insights_created} insights, ${data.recommendations_created} recs, ${data.reports_created} report`,
      );
      await loadAll();
    } catch (e: any) {
      toast.error(`Brain run failed: ${e?.message ?? e}`);
    } finally {
      setRunning(false);
    }
  };

  const decideRec = async (id: string, status: 'accepted' | 'dismissed') => {
    if (isDemoMode || !isAdmin) {
      setRecs((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast.success(status === 'accepted' ? 'Recommendation accepted' : 'Recommendation dismissed');
      return;
    }
    const { error } = await supabase
      .from('admin_ai_recommendations' as any)
      .update({ status, decided_at: new Date().toISOString() } as any)
      .eq('id', id);
    if (error) toast.error(`Failed: ${error.message}`);
    else { toast.success(`Recommendation ${status}`); loadAll(); }
  };

  const ackInsight = async (id: string) => {
    if (isDemoMode || !isAdmin) {
      setInsights((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'acknowledged' } : i)));
      toast.success('Insight acknowledged');
      return;
    }
    const { error } = await supabase
      .from('admin_ai_insights' as any)
      .update({ status: 'acknowledged', acknowledged_at: new Date().toISOString() } as any)
      .eq('id', id);
    if (error) toast.error(`Failed: ${error.message}`);
    else { toast.success('Acknowledged'); loadAll(); }
  };

  const stats = useMemo(() => ({
    openInsights: insights.filter((i) => i.status === 'open').length,
    criticalInsights: insights.filter((i) => i.status === 'open' && i.severity === 'critical').length,
    pendingRecs: recs.filter((r) => r.status === 'pending').length,
    urgentRecs: recs.filter((r) => r.status === 'pending' && r.priority === 'urgent').length,
  }), [insights, recs]);

  const lastRun = runs[0];
  const latestReport = reports[0];

  return (
    <div className="p-6 lg:p-10 space-y-6">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-[hsl(var(--gold))] to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Brain className="h-6 w-6 text-[hsl(220_22%_8%)]" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold flex items-center gap-2">
                AI Brain
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </h1>
              <p className="text-sm text-[hsl(30_12%_70%)] mt-0.5">
                24/7 autonomous intelligence — watching habits, spotting patterns, suggesting moves.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAll}
            className="border-[hsl(43_96%_56%/0.3)] text-[hsl(var(--gold))] hover:bg-[hsl(43_96%_56%/0.1)]"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
          </Button>
          <Button
            onClick={() => triggerBrain('quick')}
            disabled={running}
            variant="outline"
            size="sm"
            className="border-[hsl(43_96%_56%/0.3)] text-[hsl(var(--gold))] hover:bg-[hsl(43_96%_56%/0.1)]"
          >
            {running ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Zap className="h-4 w-4 mr-1.5" />}
            Quick scan
          </Button>
          <Button
            onClick={() => triggerBrain('full')}
            disabled={running}
            size="sm"
            className="bg-[hsl(var(--gold))] text-[hsl(220_22%_8%)] hover:bg-[hsl(43_96%_50%)] font-semibold"
          >
            {running ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
            Run full analysis
          </Button>
        </div>
      </header>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Open insights', value: stats.openInsights, sub: `${stats.criticalInsights} critical`, icon: Brain, color: 'text-amber-400' },
          { label: 'Pending actions', value: stats.pendingRecs, sub: `${stats.urgentRecs} urgent`, icon: Lightbulb, color: 'text-emerald-400' },
          { label: 'Reports (30d)', value: summary?.reports_last_30d ?? reports.length, sub: 'Auto + manual', icon: FileText, color: 'text-blue-400' },
          { label: 'Last run', value: lastRun ? timeAgo(lastRun.started_at) : 'Demo seed', sub: lastRun?.status ?? 'ready', icon: Clock, color: 'text-purple-400' },
        ].map((k) => (
          <Card key={k.label} className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-[hsl(30_12%_60%)]">{k.label}</div>
                <div className="text-2xl font-bold mt-1">{k.value}</div>
                <div className="text-xs text-[hsl(30_12%_70%)] mt-0.5">{k.sub}</div>
              </div>
              <k.icon className={`h-5 w-5 ${k.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">AI activity — last 14 days</h3>
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]">live</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageTrend}>
                <defs>
                  <linearGradient id="gradGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(43 96% 56%)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="hsl(43 96% 56%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(43 96% 56% / 0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="hsl(30 12% 60%)" fontSize={11} />
                <YAxis stroke="hsl(30 12% 60%)" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: 'hsl(220 22% 6%)', border: '1px solid hsl(43 96% 56% / 0.3)', borderRadius: 8, color: 'hsl(30 12% 95%)' }}
                />
                <Area type="monotone" dataKey="calls" stroke="hsl(43 96% 56%)" strokeWidth={2} fill="url(#gradGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <h3 className="font-semibold mb-3">Revenue mix · 30d</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueMix} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {revenueMix.map((s) => <Cell key={s.name} fill={s.fill} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(220 22% 6%)', border: '1px solid hsl(43 96% 56% / 0.3)', borderRadius: 8, color: 'hsl(30 12% 95%)' }}
                  formatter={(v: number) => `$${v.toLocaleString()}`}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: 'hsl(30 12% 75%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        <h3 className="font-semibold mb-3">Concierge quality — last 7 days</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={conciergeQuality}>
              <CartesianGrid stroke="hsl(43 96% 56% / 0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="hsl(30 12% 60%)" fontSize={11} />
              <YAxis yAxisId="left" stroke="hsl(160 70% 45%)" fontSize={11} domain={[3.5, 5]} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(43 96% 56%)" fontSize={11} domain={[0, 2.5]} />
              <Tooltip
                contentStyle={{ background: 'hsl(220 22% 6%)', border: '1px solid hsl(43 96% 56% / 0.3)', borderRadius: 8, color: 'hsl(30 12% 95%)' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: 'hsl(30 12% 75%)' }} />
              <Line yAxisId="left" type="monotone" dataKey="satisfaction" stroke="hsl(160 70% 45%)" strokeWidth={2} dot={false} name="Satisfaction (1-5)" />
              <Line yAxisId="right" type="monotone" dataKey="latency" stroke="hsl(43 96% 56%)" strokeWidth={2} dot={false} name="Avg latency (s)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tabs: Insights | Recommendations | Reports */}
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="bg-[hsl(220_22%_10%)] border border-[hsl(43_96%_56%/0.15)]">
          <TabsTrigger value="insights" className="data-[state=active]:bg-[hsl(43_96%_56%/0.15)] data-[state=active]:text-[hsl(var(--gold))]">
            <Brain className="h-3.5 w-3.5 mr-1.5" /> Insights ({insights.length})
          </TabsTrigger>
          <TabsTrigger value="recs" className="data-[state=active]:bg-[hsl(43_96%_56%/0.15)] data-[state=active]:text-[hsl(var(--gold))]">
            <Lightbulb className="h-3.5 w-3.5 mr-1.5" /> Recommendations ({recs.length})
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-[hsl(43_96%_56%/0.15)] data-[state=active]:text-[hsl(var(--gold))]">
            <FileText className="h-3.5 w-3.5 mr-1.5" /> Reports ({reports.length})
          </TabsTrigger>
        </TabsList>

        {/* Insights */}
        <TabsContent value="insights" className="mt-4 space-y-3">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
          ) : insights.map((i) => (
            <Card key={i.id} className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4 hover:border-[hsl(43_96%_56%/0.4)] transition-colors">
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-md flex items-center justify-center border ${severityStyle(i.severity)}`}>
                  {categoryIcon(i.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-base">{i.title}</h4>
                    <Badge className={`${severityStyle(i.severity)} text-[10px] uppercase`}>{i.severity}</Badge>
                    <Badge className="bg-slate-700/40 text-slate-300 border-slate-600/30 text-[10px] uppercase">{String(i.category).replace('_', ' ')}</Badge>
                    <span className="text-[10px] text-[hsl(30_12%_55%)]">conf {Math.round(Number(i.confidence) * 100)}%</span>
                    <span className="text-[10px] text-[hsl(30_12%_55%)]">· {timeAgo(i.created_at)}</span>
                  </div>
                  <p className="text-sm text-[hsl(30_12%_75%)] mt-1.5 leading-relaxed">{i.summary}</p>
                  {(i.affected_count ?? 0) > 0 && (
                    <div className="text-xs text-[hsl(30_12%_60%)] mt-1.5 flex items-center gap-1">
                      <Users className="h-3 w-3" /> {i.affected_count.toLocaleString()} affected
                    </div>
                  )}
                </div>
                {i.status === 'open' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => ackInsight(i.id)}
                    className="text-[hsl(var(--gold))] hover:bg-[hsl(43_96%_56%/0.1)]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
                {i.status === 'acknowledged' && (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">acknowledged</Badge>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recs" className="mt-4 space-y-3">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
          ) : recs.map((r) => (
            <Card key={r.id} className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-md flex items-center justify-center border ${priorityStyle(r.priority)}`}>
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-base">{r.title}</h4>
                    <Badge className={`${priorityStyle(r.priority)} text-[10px] uppercase`}>{r.priority}</Badge>
                    <Badge className="bg-slate-700/40 text-slate-300 border-slate-600/30 text-[10px] uppercase">{String(r.kind).replace('_', ' ')}</Badge>
                    <span className="text-[10px] text-[hsl(30_12%_55%)]">conf {Math.round(Number(r.confidence) * 100)}%</span>
                    <span className="text-[10px] text-[hsl(30_12%_55%)]">· {timeAgo(r.created_at)}</span>
                  </div>
                  <p className="text-sm text-[hsl(30_12%_80%)] mt-1.5 leading-relaxed">{r.rationale}</p>
                  <div className="mt-2 p-2.5 rounded-md bg-[hsl(220_22%_6%)] border border-[hsl(43_96%_56%/0.1)]">
                    <div className="text-[10px] uppercase tracking-wider text-[hsl(var(--gold))] mb-1">Suggested action</div>
                    <p className="text-sm text-[hsl(30_12%_85%)]">{r.suggested_action}</p>
                    {r.expected_impact && (
                      <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> {r.expected_impact}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {r.status === 'pending' ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => decideRec(r.id, 'accepted')}
                        className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 h-8"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => decideRec(r.id, 'dismissed')}
                        className="text-[hsl(30_12%_60%)] hover:text-red-400 hover:bg-red-500/10 h-8"
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> Dismiss
                      </Button>
                    </>
                  ) : (
                    <Badge className={r.status === 'accepted'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]'
                      : 'bg-slate-500/15 text-slate-400 border-slate-500/30 text-[10px]'}>
                      {r.status}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="mt-4 space-y-3">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
          ) : reports.map((rep) => (
            <Card key={rep.id} className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-display font-bold text-lg">{rep.title}</h4>
                  <p className="text-xs text-[hsl(30_12%_60%)] mt-0.5">{timeAgo(rep.created_at)} · {rep.timeframe ?? 'on demand'}</p>
                </div>
                <FileText className="h-5 w-5 text-[hsl(var(--gold))]" />
              </div>
              <p className="text-sm text-[hsl(30_12%_85%)] leading-relaxed mt-2">{rep.executive_summary}</p>
              {rep.narrative && (
                <p className="text-sm text-[hsl(30_12%_75%)] leading-relaxed mt-3">{rep.narrative}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-md bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-1.5 font-semibold">Highlights</div>
                  <ul className="space-y-1">
                    {(rep.highlights ?? []).map((h: string, idx: number) => (
                      <li key={idx} className="text-xs text-[hsl(30_12%_85%)] flex items-start gap-1.5">
                        <TrendingUp className="h-3 w-3 mt-0.5 text-emerald-400 shrink-0" />{h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-md bg-amber-500/5 border border-amber-500/20">
                  <div className="text-[10px] uppercase tracking-wider text-amber-400 mb-1.5 font-semibold">Concerns</div>
                  <ul className="space-y-1">
                    {(rep.concerns ?? []).map((c: string, idx: number) => (
                      <li key={idx} className="text-xs text-[hsl(30_12%_85%)] flex items-start gap-1.5">
                        <AlertTriangle className="h-3 w-3 mt-0.5 text-amber-400 shrink-0" />{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBrain;
