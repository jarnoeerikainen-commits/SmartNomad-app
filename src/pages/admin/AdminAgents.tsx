// ═══════════════════════════════════════════════════════════════════════════
// ADMIN AGENTS — Multi-Agent Orchestration Command Center
// Implements the SuperNomad Sovereign Back-Office Protocol.
// 5 Department Lead AIs + Governor (Admin) approval flow with HITL permits.
// Currently runs in DEMO mode (client-side simulator). Backend hooks are
// wired via AgentOrchestratorService — flip MODE = 'live' to call edge fns.
// ═══════════════════════════════════════════════════════════════════════════
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Shield, Scale, Rocket, Palette, BarChart3, Crown, KeyRound, Activity,
  CheckCircle2, XCircle, AlertTriangle, Clock, Lock, FileCheck2, Sparkles,
  RefreshCw, Eye, ShieldAlert, Compass, Coins, Heart, Tornado, FileText,
  Network, FlaskConical, Users2, Leaf, Gem,
} from 'lucide-react';
import { toast } from 'sonner';
import { useStaffRole } from '@/hooks/useStaffRole';
import {
  AgentOrchestratorService, AGENTS, AGENTS_BY_TIER, TIER_LABELS,
  type AgentId, type AgentProposal, type AgentActivityEvent, type DailyBriefing, type AgentTier,
} from '@/services/AgentOrchestratorService';

const AGENT_ICONS: Record<AgentId, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  legal: Scale,
  security: Shield,
  growth: Rocket,
  product: Palette,
  oracle: BarChart3,
  atlas: Compass,
  midas: Coins,
  echo: Heart,
  sentinel: Tornado,
  muse: FileText,
  praxis: Network,
  forge: FlaskConical,
  concord: Users2,
  verdant: Leaf,
  atlas_ltv: Gem,
};

const PRIORITY_STYLES: Record<string, string> = {
  urgent: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  high: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  medium: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

const STATUS_STYLES: Record<string, string> = {
  drafted: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  in_review: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  needs_permit: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  rejected: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  expired: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

type LiveControl = {
  agent_key: string;
  display_name: string;
  director: string | null;
  agent_type: string;
  description: string;
  status: string;
  automation_level: string;
  schedule_label: string;
  model_tier: string;
  daily_token_budget: number;
  daily_run_limit: number;
  requires_approval: boolean;
  can_write_to_user_surfaces: boolean;
  last_run_at: string | null;
  last_run_status: string | null;
};

type LiveReport = {
  id: string;
  report_date: string;
  agent_key: string;
  title: string;
  summary: string;
  performance_score: number;
  suggestions: string[];
  token_usage: number;
  estimated_cost_usd: number;
};

type LiveSuggestion = {
  id: string;
  agent_key: string;
  priority: string;
  title: string;
  expected_impact: string | null;
  suggested_action: string;
  status: string;
};

const DEMO_CONTROLS: LiveControl[] = [
  { agent_key: 'brain.governor', display_name: 'AI Brain Governor', director: null, agent_type: 'governor', description: 'Coordinates directors and executive reports.', status: 'paused', automation_level: 'recommend_only', schedule_label: 'Daily executive scan', model_tier: 'balanced', daily_token_budget: 120000, daily_run_limit: 6, requires_approval: true, can_write_to_user_surfaces: false, last_run_at: null, last_run_status: 'demo' },
  { agent_key: 'finops.token-sentinel', display_name: 'Token Sentinel', director: 'pricing', agent_type: 'specialist', description: 'Watches token burn, cache hit rates and avoidable spend.', status: 'paused', automation_level: 'recommend_only', schedule_label: 'Hourly after approval', model_tier: 'speed', daily_token_budget: 18000, daily_run_limit: 12, requires_approval: true, can_write_to_user_surfaces: false, last_run_at: null, last_run_status: 'demo' },
  { agent_key: 'quality.concierge-auditor', display_name: 'Concierge Quality Auditor', director: 'happiness', agent_type: 'specialist', description: 'Audits answer quality, personalization and escalation risk.', status: 'paused', automation_level: 'recommend_only', schedule_label: 'Every 4 hours after approval', model_tier: 'balanced', daily_token_budget: 30000, daily_run_limit: 6, requires_approval: true, can_write_to_user_surfaces: false, last_run_at: null, last_run_status: 'demo' },
  { agent_key: 'revenue.b2b-scout', display_name: 'B2B Revenue Scout', director: 'b2b_sales', agent_type: 'specialist', description: 'Finds partner, data-package and white-label opportunities.', status: 'paused', automation_level: 'recommend_only', schedule_label: 'Daily after approval', model_tier: 'balanced', daily_token_budget: 40000, daily_run_limit: 3, requires_approval: true, can_write_to_user_surfaces: false, last_run_at: null, last_run_status: 'demo' },
];

const DEMO_REPORTS: LiveReport[] = [
  { id: 'demo-report-1', report_date: new Date().toISOString().slice(0, 10), agent_key: 'finops.token-sentinel', title: 'Token Sentinel Daily Report', summary: 'Control baseline ready. Start with sampled scans and cheap model tiers before enabling automation.', performance_score: 88, suggestions: ['Keep classification on speed-tier models', 'Cap each agent before enabling schedules'], token_usage: 0, estimated_cost_usd: 0 },
  { id: 'demo-report-2', report_date: new Date().toISOString().slice(0, 10), agent_key: 'quality.concierge-auditor', title: 'Concierge Quality Auditor Daily Report', summary: 'Quality-control specialist is ready to audit conversations without touching user-facing surfaces.', performance_score: 86, suggestions: ['Start with 5% sampled audits', 'Escalate high-stakes answers to support'], token_usage: 0, estimated_cost_usd: 0 },
];

const DEMO_SUGGESTIONS: LiveSuggestion[] = [
  { id: 'demo-suggestion-1', agent_key: 'finops.token-sentinel', priority: 'high', title: 'Add per-agent daily token caps before enabling automation', expected_impact: 'Lower token burn and predictable margin.', suggested_action: 'Approve budgets per agent, then enable supervised automation first.', status: 'pending' },
  { id: 'demo-suggestion-2', agent_key: 'quality.concierge-auditor', priority: 'high', title: 'Start with sampled concierge audits', expected_impact: 'Faster quality learning with lower AI cost.', suggested_action: 'Approve a 5% audit sample and raise high-risk findings only.', status: 'pending' },
];

function formatAgo(ts: number) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

const AdminAgents: React.FC = () => {
  const { isDemoMode, isAdmin } = useStaffRole();
  const [, force] = useState(0);
  const [filter, setFilter] = useState<AgentId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'open' | 'all' | 'approved' | 'rejected'>('open');
  const [selected, setSelected] = useState<AgentProposal | null>(null);
  const [permitKey, setPermitKey] = useState('');
  const [governorNote, setGovernorNote] = useState('');
  const [controls, setControls] = useState<LiveControl[]>(DEMO_CONTROLS);
  const [reports, setReports] = useState<LiveReport[]>(DEMO_REPORTS);
  const [suggestions, setSuggestions] = useState<LiveSuggestion[]>(DEMO_SUGGESTIONS);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    const unsub = AgentOrchestratorService.subscribe(() => force((x) => x + 1));
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    document.title = 'Back Office — Agent Council · SuperNomad';
    async function loadLiveControlPlane() {
      if (isDemoMode) {
        setLoadingLive(false);
        return;
      }
      try {
        const [controlsRes, reportsRes, suggestionsRes] = await Promise.all([
          supabase.from('admin_ai_agent_controls' as any).select('*').order('agent_type').order('display_name'),
          supabase.rpc('get_latest_agent_daily_reports' as any, { p_limit: 12 }),
          supabase.from('admin_ai_agent_suggestions' as any).select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(20),
        ]);
        if (controlsRes.data?.length) setControls(controlsRes.data as unknown as LiveControl[]);
        if (reportsRes.data?.length) setReports(reportsRes.data as unknown as LiveReport[]);
        if (suggestionsRes.data?.length) setSuggestions(suggestionsRes.data as unknown as LiveSuggestion[]);
      } catch (e) {
        console.warn('Agent control plane fallback:', e);
      } finally {
        setLoadingLive(false);
      }
    }
    loadLiveControlPlane();
  }, [isDemoMode]);

  async function updateControl(agentKey: string, patch: Partial<LiveControl>) {
    if (isDemoMode) {
      setControls((current) => current.map((c) => (c.agent_key === agentKey ? { ...c, ...patch } : c)));
      toast.info('Demo mode — control changed only in this preview.');
      return;
    }
    if (!isAdmin) {
      toast.error('Admin role required to change agent controls.');
      return;
    }
    const { data, error } = await supabase.rpc('update_admin_ai_agent_control' as any, {
      p_agent_key: agentKey,
      p_status: patch.status ?? null,
      p_automation_level: patch.automation_level ?? null,
      p_daily_token_budget: patch.daily_token_budget ?? null,
      p_daily_run_limit: patch.daily_run_limit ?? null,
      p_requires_approval: patch.requires_approval ?? null,
      p_can_write_to_user_surfaces: patch.can_write_to_user_surfaces ?? null,
      p_disabled_reason: null,
    });
    if (error) {
      toast.error(`Could not update agent: ${error.message}`);
      return;
    }
    setControls((current) => current.map((c) => (c.agent_key === agentKey ? data as unknown as LiveControl : c)));
    toast.success('Agent control updated.');
  }

  const proposals = AgentOrchestratorService.getProposals();
  const activity = AgentOrchestratorService.getActivity();
  const briefing = AgentOrchestratorService.getLatestBriefing();
  const kpis = AgentOrchestratorService.kpis();
  const liveKpis = useMemo(() => ({
    total: controls.length,
    active: controls.filter((c) => c.status === 'active').length,
    paused: controls.filter((c) => c.status === 'paused').length,
    budget: controls.reduce((s, c) => s + c.daily_token_budget, 0),
  }), [controls]);

  const visible = useMemo(() => {
    return proposals.filter((p) => {
      if (filter !== 'all' && p.agent_id !== filter) return false;
      if (statusFilter === 'open')
        return p.status === 'drafted' || p.status === 'in_review' || p.status === 'needs_permit';
      if (statusFilter === 'approved') return p.status === 'approved';
      if (statusFilter === 'rejected') return p.status === 'rejected';
      return true;
    });
  }, [proposals, filter, statusFilter]);

  function openProposal(p: AgentProposal) {
    setSelected(p);
    setPermitKey('');
    setGovernorNote('');
  }

  function handleApprove() {
    if (!selected) return;
    const res = AgentOrchestratorService.approve(selected.id, {
      permit_key: selected.requires_permit ? permitKey : undefined,
      note: governorNote || undefined,
    });
    if (!res.ok) {
      toast.error(
        res.error === 'permit_required'
          ? 'HITL security key required.'
          : res.error === 'invalid_permit'
          ? 'Permit key must be at least 6 characters.'
          : 'Could not approve.',
      );
      return;
    }
    toast.success('Approved & pushed to staging.');
    setSelected(null);
  }

  function handleReject() {
    if (!selected) return;
    AgentOrchestratorService.reject(selected.id, governorNote || undefined);
    toast.success('Proposal rejected.');
    setSelected(null);
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-5 w-5 text-[hsl(var(--gold))]" />
            <h1 className="text-2xl font-semibold">Multi-Agent Orchestration</h1>
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]">
              Sovereign Back-Office Protocol
            </Badge>
          </div>
          <p className="text-sm text-[hsl(30_12%_70%)] max-w-3xl">
            5 specialised AI Department Leads operate <span className="text-[hsl(var(--gold))]">read-only / propose-only</span>.
            Every change requires Governor approval. High-impact items require a Human-in-the-Loop security permit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
            <Activity className="h-3 w-3 mr-1.5 animate-pulse" /> 24/7 Live
          </Badge>
          <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">
            <Eye className="h-3 w-3 mr-1.5" /> Mode: {kpis.mode.toUpperCase()}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              AgentOrchestratorService.triggerBriefing();
              toast.success('Daily briefing regenerated.');
            }}
            className="border-[hsl(43_96%_56%/0.3)]"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Re-brief
          </Button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Open proposals', value: kpis.open_count, icon: FileCheck2, tone: 'text-sky-300' },
          { label: 'Urgent', value: kpis.urgent_count, icon: AlertTriangle, tone: 'text-rose-300' },
          { label: 'Approved (lifetime)', value: kpis.approved_count, icon: CheckCircle2, tone: 'text-emerald-300' },
          { label: 'Avg confidence', value: `${kpis.avg_confidence}%`, icon: Sparkles, tone: 'text-violet-300' },
          {
            label: 'Pipeline value',
            value: `$${(kpis.projected_revenue_usd / 1000).toFixed(0)}k`,
            icon: BarChart3,
            tone: 'text-amber-300',
          },
        ].map((k) => (
          <Card key={k.label} className="bg-[hsl(220_22%_6%)] border-[hsl(43_96%_56%/0.15)] p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)]">{k.label}</span>
              <k.icon className={`h-4 w-4 ${k.tone}`} />
            </div>
            <div className="text-2xl font-semibold">{k.value}</div>
          </Card>
        ))}
      </div>

      {/* PRODUCTION CONTROL PLANE */}
      <Card className="bg-[hsl(220_22%_6%)] border-[hsl(43_96%_56%/0.2)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-[hsl(var(--gold))]" />
              <h2 className="font-semibold">Production Agent Control Plane</h2>
              <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">
                {isDemoMode ? 'Demo read-only' : 'Staff gated'}
              </Badge>
            </div>
            <p className="text-xs text-[hsl(30_12%_65%)] mt-1">
              {liveKpis.total} controlled agents · {liveKpis.active} active · {liveKpis.paused} paused · {liveKpis.budget.toLocaleString()} daily token budget
            </p>
          </div>
          {loadingLive && <LoaderText />}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            {controls.map((c) => (
              <Card key={c.agent_key} className="bg-[hsl(220_22%_4%)] border-[hsl(43_96%_56%/0.12)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{c.display_name}</span>
                      <Badge className="bg-[hsl(220_22%_10%)] text-[hsl(30_12%_75%)] border-[hsl(43_96%_56%/0.15)] text-[10px]">
                        {c.agent_type}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-[hsl(30_12%_62%)] mt-1 line-clamp-2">{c.description}</div>
                  </div>
                  <Switch
                    checked={c.status === 'active'}
                    onCheckedChange={(checked) => updateControl(c.agent_key, { status: checked ? 'active' : 'paused' })}
                    aria-label={`Toggle ${c.display_name}`}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <Stat label="Mode" value={c.automation_level.replace('_', ' ')} />
                  <Stat label="Model" value={c.model_tier} />
                  <Stat label="Budget" value={`${Math.round(c.daily_token_budget / 1000)}k`} />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge className={c.requires_approval ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'}>
                    {c.requires_approval ? 'approval required' : 'no approval'}
                  </Badge>
                  <Badge className={c.can_write_to_user_surfaces ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-sky-500/15 text-sky-300 border-sky-500/30'}>
                    {c.can_write_to_user_surfaces ? 'can write live' : 'back-office only'}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => updateControl(c.agent_key, { automation_level: 'recommend_only', requires_approval: true, can_write_to_user_surfaces: false })}>
                    Safe mode
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => updateControl(c.agent_key, { automation_level: 'supervised_auto', requires_approval: true })}>
                    Supervised
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-3">
            <Card className="bg-[hsl(220_22%_4%)] border-[hsl(43_96%_56%/0.12)] p-4">
              <div className="flex items-center gap-2 mb-3"><FileText className="h-4 w-4 text-[hsl(var(--gold))]" /><h3 className="font-semibold text-sm">Daily Agent Reports</h3></div>
              <div className="space-y-3">
                {reports.slice(0, 4).map((r) => (
                  <div key={r.id} className="border-l-2 border-[hsl(43_96%_56%/0.35)] pl-3">
                    <div className="text-sm font-medium">{r.title}</div>
                    <div className="text-xs text-[hsl(30_12%_68%)] line-clamp-2 mt-1">{r.summary}</div>
                    <div className="text-[10px] text-[hsl(30_12%_55%)] mt-1">Score {Number(r.performance_score).toFixed(0)} · {r.token_usage.toLocaleString()} tokens</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="bg-[hsl(220_22%_4%)] border-[hsl(43_96%_56%/0.12)] p-4">
              <div className="flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-amber-300" /><h3 className="font-semibold text-sm">Performance Suggestions</h3></div>
              <div className="space-y-2">
                {suggestions.slice(0, 5).map((s) => (
                  <div key={s.id} className="p-2 rounded bg-[hsl(220_22%_6%)] border border-[hsl(43_96%_56%/0.1)]">
                    <Badge className={`${PRIORITY_STYLES[s.priority] ?? PRIORITY_STYLES.medium} text-[10px] mb-1`}>{s.priority}</Badge>
                    <div className="text-xs font-medium">{s.title}</div>
                    <div className="text-[11px] text-[hsl(30_12%_65%)] mt-1 line-clamp-2">{s.expected_impact ?? s.suggested_action}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {/* DAILY BRIEFING + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-gradient-to-br from-[hsl(220_22%_6%)] to-[hsl(220_22%_8%)] border-[hsl(43_96%_56%/0.25)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-[hsl(var(--gold))]" />
              <h2 className="font-semibold">Daily 09:00 Governor Briefing</h2>
            </div>
            {briefing && (
              <span className="text-xs text-[hsl(30_12%_60%)]">
                {new Date(briefing.generated_at).toLocaleString()}
              </span>
            )}
          </div>
          {briefing ? (
            <>
              <div className="text-base font-medium text-[hsl(var(--gold))] mb-3">{briefing.headline}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                {(Object.keys(AGENTS) as AgentId[]).map((id) => {
                  const Icon = AGENT_ICONS[id];
                  const b = briefing.by_agent[id];
                  return (
                    <div
                      key={id}
                      className="flex items-start gap-2 p-2 rounded bg-[hsl(220_22%_4%)] border border-[hsl(43_96%_56%/0.1)]"
                    >
                      <Icon className="h-4 w-4 mt-0.5" style={{ color: AGENTS[id].color_token }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[hsl(30_12%_60%)]">
                          {AGENTS[id].name} · {AGENTS[id].team_label}
                        </div>
                        <div className="text-sm truncate">{b.headline}</div>
                        <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_55%)] mt-0.5">
                          {b.metric}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-[hsl(30_12%_70%)] italic border-l-2 border-[hsl(var(--gold))] pl-3">
                {briefing.governor_note}
              </div>
            </>
          ) : (
            <div className="text-sm text-[hsl(30_12%_60%)]">Generating first briefing…</div>
          )}
        </Card>

        <Card className="bg-[hsl(220_22%_6%)] border-[hsl(43_96%_56%/0.15)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            <h2 className="font-semibold">Live Activity</h2>
          </div>
          <ScrollArea className="h-[260px] pr-2">
            <div className="space-y-2">
              {activity.slice(0, 40).map((ev) => (
                <ActivityRow key={ev.id} ev={ev} />
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* DEPARTMENT LEADS — grouped by Tier */}
      <div className="space-y-5">
        {(Object.keys(TIER_LABELS) as AgentTier[]).map((tier) => {
          const tierMeta = TIER_LABELS[tier];
          const tierAgents = AGENTS_BY_TIER[tier];
          return (
            <div key={tier}>
              <div className="flex items-baseline justify-between mb-2 px-0.5">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-semibold text-[hsl(var(--gold))] uppercase tracking-wider">
                    {tierMeta.label}
                  </h3>
                  <span className="text-[11px] text-[hsl(30_12%_60%)]">{tierMeta.tagline}</span>
                </div>
                <span className="text-[10px] text-[hsl(30_12%_55%)] uppercase tracking-wider">
                  {tierAgents.length} agent{tierAgents.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {tierAgents.map((id) => {
                  const a = AGENTS[id];
                  const Icon = AGENT_ICONS[id];
                  const open = proposals.filter(
                    (p) => p.agent_id === id && (p.status === 'drafted' || p.status === 'in_review' || p.status === 'needs_permit'),
                  ).length;
                  const urgent = proposals.filter(
                    (p) => p.agent_id === id && p.priority === 'urgent' && p.status !== 'approved' && p.status !== 'rejected',
                  ).length;
                  return (
                    <Card
                      key={id}
                      className="bg-[hsl(220_22%_6%)] border-[hsl(43_96%_56%/0.15)] p-4 hover:border-[hsl(43_96%_56%/0.4)] transition-colors cursor-pointer"
                      onClick={() => {
                        setFilter(id);
                        setStatusFilter('open');
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="h-9 w-9 rounded-md flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${a.color_token.replace(')', ' / 0.15)')}`, color: a.color_token }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm truncate">{a.name}</div>
                            <div className="text-[10px] text-[hsl(30_12%_60%)] truncate">{a.role}</div>
                          </div>
                        </div>
                        <span className="text-lg shrink-0">{a.emoji}</span>
                      </div>
                      <div className="text-[11px] text-[hsl(30_12%_65%)] mb-2 line-clamp-2">{a.team_label}</div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Badge className="bg-sky-500/15 text-sky-300 border-sky-500/30 text-[10px] px-1.5">
                          {open} open
                        </Badge>
                        {urgent > 0 && (
                          <Badge className="bg-rose-500/15 text-rose-300 border-rose-500/30 text-[10px] px-1.5">
                            {urgent} urgent
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          AgentOrchestratorService.triggerScan(id);
                          toast.success(`${a.name} triggered a fresh scan.`);
                        }}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" /> Trigger scan
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* PROPOSAL QUEUE */}
      <Card className="bg-[hsl(220_22%_6%)] border-[hsl(43_96%_56%/0.15)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-[hsl(var(--gold))]" />
            <h2 className="font-semibold">Proposal Queue</h2>
            <Badge className="bg-[hsl(220_22%_10%)] text-[hsl(30_12%_70%)] border-[hsl(43_96%_56%/0.2)]">
              {visible.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={filter} onValueChange={(v) => setFilter(v as AgentId | 'all')}>
              <SelectTrigger className="h-9 w-[220px] bg-[hsl(220_22%_4%)] border-[hsl(43_96%_56%/0.2)] text-xs">
                <SelectValue placeholder="Filter by agent" />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(220_22%_8%)] border-[hsl(43_96%_56%/0.25)] text-[hsl(30_12%_92%)]">
                <SelectItem value="all" className="text-xs">All agents (15)</SelectItem>
                {(Object.keys(TIER_LABELS) as AgentTier[]).map((tier) => (
                  <SelectGroup key={tier}>
                    <SelectLabel className="text-[10px] uppercase tracking-wider text-[hsl(var(--gold))]">
                      {TIER_LABELS[tier].label}
                    </SelectLabel>
                    {AGENTS_BY_TIER[tier].map((id) => (
                      <SelectItem key={id} value={id} className="text-xs">
                        {AGENTS[id].emoji} {AGENTS[id].name} · {AGENTS[id].team_label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <TabsList className="bg-[hsl(220_22%_4%)]">
                <TabsTrigger value="open" className="text-xs">Open</TabsTrigger>
                <TabsTrigger value="approved" className="text-xs">Approved</TabsTrigger>
                <TabsTrigger value="rejected" className="text-xs">Rejected</TabsTrigger>
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <ScrollArea className="h-[460px] pr-2">
          <div className="space-y-2">
            {visible.length === 0 && (
              <div className="text-sm text-[hsl(30_12%_60%)] text-center py-12">
                No proposals matching filters. Trigger a scan from a department card above.
              </div>
            )}
            {visible.map((p) => {
              const a = AGENTS[p.agent_id];
              const Icon = AGENT_ICONS[p.agent_id];
              return (
                <div
                  key={p.id}
                  className="p-3 rounded-md bg-[hsl(220_22%_4%)] border border-[hsl(43_96%_56%/0.1)] hover:border-[hsl(43_96%_56%/0.3)] cursor-pointer transition-colors"
                  onClick={() => openProposal(p)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-8 w-8 rounded flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${a.color_token.replace(')', ' / 0.15)')}`, color: a.color_token }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-medium text-sm">{p.title}</div>
                        <div className="flex gap-1 shrink-0">
                          <Badge className={`${PRIORITY_STYLES[p.priority]} text-[10px] px-1.5`}>
                            {p.priority.toUpperCase()}
                          </Badge>
                          <Badge className={`${STATUS_STYLES[p.status]} text-[10px] px-1.5`}>
                            {p.status === 'needs_permit' ? (
                              <><Lock className="h-2.5 w-2.5 mr-0.5 inline" />PERMIT</>
                            ) : (
                              p.status.toUpperCase()
                            )}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-[hsl(30_12%_70%)] mt-1 line-clamp-2">{p.summary}</div>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-[hsl(30_12%_55%)] uppercase tracking-wider">
                        <span>{a.name}</span>
                        <span>·</span>
                        <span>{Math.round(p.confidence * 100)}% conf</span>
                        {p.est_users_impacted && (
                          <>
                            <span>·</span>
                            <span>{p.est_users_impacted.toLocaleString()} users</span>
                          </>
                        )}
                        {p.est_revenue_usd && (
                          <>
                            <span>·</span>
                            <span className="text-amber-300">
                              ${(p.est_revenue_usd / 1000).toFixed(0)}k impact
                            </span>
                          </>
                        )}
                        <span>·</span>
                        <span><Clock className="h-2.5 w-2.5 inline mr-0.5" />{formatAgo(p.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </Card>

      {/* PROPOSAL DETAIL DIALOG */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl bg-[hsl(220_22%_8%)] border-[hsl(43_96%_56%/0.3)] text-[hsl(30_12%_95%)]">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`${PRIORITY_STYLES[selected.priority]} text-[10px]`}>
                    {selected.priority.toUpperCase()}
                  </Badge>
                  <Badge className={`${STATUS_STYLES[selected.status]} text-[10px]`}>
                    {selected.status.toUpperCase().replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-[hsl(30_12%_60%)]">
                    {AGENTS[selected.agent_id].name} · {AGENTS[selected.agent_id].team_label}
                  </span>
                </div>
                <DialogTitle className="text-lg">{selected.title}</DialogTitle>
                <DialogDescription className="text-[hsl(30_12%_70%)]">
                  {selected.summary}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2">
                <Section label="Rationale">{selected.rationale}</Section>
                <Section label="Proposed action" tone="gold">{selected.proposed_action}</Section>
                <Section label="Expected impact">{selected.expected_impact}</Section>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)] mb-1.5">
                    Evidence
                  </div>
                  <ul className="space-y-1">
                    {selected.evidence.map((e, i) => (
                      <li key={i} className="text-xs text-[hsl(30_12%_80%)] pl-3 border-l-2 border-[hsl(43_96%_56%/0.3)]">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Stat label="Confidence" value={`${Math.round(selected.confidence * 100)}%`} />
                  <Stat label="Users impacted" value={selected.est_users_impacted?.toLocaleString() ?? '—'} />
                  <Stat label="Revenue impact" value={selected.est_revenue_usd ? `$${(selected.est_revenue_usd / 1000).toFixed(0)}k` : '—'} />
                </div>

                {selected.requires_permit && selected.status !== 'approved' && selected.status !== 'rejected' && (
                  <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldAlert className="h-4 w-4 text-amber-300" />
                      <span className="text-sm font-medium text-amber-300">HITL Permit Required</span>
                    </div>
                    <p className="text-xs text-[hsl(30_12%_75%)] mb-2">
                      This proposal touches live systems (legal logic, security, money or production code).
                      Enter your Governor security key to push to staging.
                    </p>
                    <Input
                      type="password"
                      placeholder="Governor security key (min 6 chars)"
                      value={permitKey}
                      onChange={(e) => setPermitKey(e.target.value)}
                      className="bg-[hsl(220_22%_4%)] border-[hsl(43_96%_56%/0.3)]"
                    />
                  </div>
                )}

                {selected.status !== 'approved' && selected.status !== 'rejected' && (
                  <Textarea
                    placeholder="Governor note (optional, recorded in audit log)"
                    value={governorNote}
                    onChange={(e) => setGovernorNote(e.target.value)}
                    className="bg-[hsl(220_22%_4%)] border-[hsl(43_96%_56%/0.2)] text-sm"
                    rows={2}
                  />
                )}

                {selected.governor_note && (selected.status === 'approved' || selected.status === 'rejected') && (
                  <div className="text-xs text-[hsl(30_12%_70%)] italic border-l-2 border-[hsl(43_96%_56%/0.3)] pl-3">
                    Governor note: {selected.governor_note}
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                {selected.status === 'approved' || selected.status === 'rejected' ? (
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Close
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleReject}
                      className="border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
                    >
                      <XCircle className="h-4 w-4 mr-1.5" /> Reject
                    </Button>
                    <Button
                      onClick={handleApprove}
                      className="bg-[hsl(var(--gold))] text-black hover:bg-[hsl(43_96%_50%)]"
                    >
                      {selected.requires_permit ? (
                        <><KeyRound className="h-4 w-4 mr-1.5" /> Approve with Permit</>
                      ) : (
                        <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Approve & Push</>
                      )}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Section: React.FC<{ label: string; tone?: 'gold'; children: React.ReactNode }> = ({ label, tone, children }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)] mb-1">{label}</div>
    <div className={`text-sm ${tone === 'gold' ? 'text-[hsl(var(--gold))] font-medium' : 'text-[hsl(30_12%_85%)]'}`}>
      {children}
    </div>
  </div>
);

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-2 rounded bg-[hsl(220_22%_4%)] border border-[hsl(43_96%_56%/0.1)]">
    <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)]">{label}</div>
    <div className="text-sm font-semibold mt-0.5">{value}</div>
  </div>
);

const ActivityRow: React.FC<{ ev: AgentActivityEvent }> = ({ ev }) => {
  const isGov = ev.agent_id === 'governor';
  const a = isGov ? null : AGENTS[ev.agent_id as AgentId];
  const Icon =
    ev.kind === 'approval' ? CheckCircle2 :
    ev.kind === 'rejection' ? XCircle :
    ev.kind === 'permit_request' ? KeyRound :
    ev.kind === 'briefing' ? Crown :
    ev.kind === 'lockdown' ? Lock :
    ev.kind === 'draft' ? FileCheck2 : Activity;
  const tone =
    ev.kind === 'approval' ? 'text-emerald-300' :
    ev.kind === 'rejection' ? 'text-rose-300' :
    ev.kind === 'briefing' ? 'text-[hsl(var(--gold))]' :
    ev.kind === 'draft' ? 'text-sky-300' : 'text-[hsl(30_12%_70%)]';
  return (
    <div className="flex items-start gap-2 text-xs">
      <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${tone}`} />
      <div className="flex-1 min-w-0">
        <div className="text-[hsl(30_12%_85%)] truncate">{ev.text}</div>
        <div className="text-[10px] text-[hsl(30_12%_55%)]">
          {isGov ? 'Governor' : a?.name} · {formatAgo(ev.ts)}
        </div>
      </div>
    </div>
  );
};

export default AdminAgents;
