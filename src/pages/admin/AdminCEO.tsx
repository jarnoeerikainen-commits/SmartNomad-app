import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BriefcaseBusiness, Crown, TrendingUp, Users, Coins, Lightbulb, ShieldCheck,
  BrainCircuit, LockKeyhole, RefreshCw, Loader2, CheckCircle2, PauseCircle,
  Sparkles, FileText, KeyRound, Target, Gauge,
} from 'lucide-react';
import { toast } from 'sonner';
import { useStaffRole } from '@/hooks/useStaffRole';

type CEOControl = {
  agent_key: string;
  display_name: string;
  agent_type: string;
  description: string;
  status: string;
  automation_level: string;
  model_tier: string;
  daily_token_budget: number;
  daily_run_limit: number;
  requires_approval: boolean;
  can_write_to_user_surfaces: boolean;
  schedule_label: string;
  last_run_status?: string | null;
};

type CEOPermission = {
  permission_key: string;
  title: string;
  description: string;
  decision_area: string;
  status: string;
  risk_level: string;
  requires_master_password: boolean;
  max_daily_actions: number;
  can_affect_user_surfaces: boolean;
  can_affect_pricing: boolean;
  can_affect_costs: boolean;
};

type CEOReport = {
  id: string;
  report_date: string;
  title: string;
  executive_summary: string;
  narrative: string | null;
  business_health: Record<string, unknown>;
  customer_experience: Record<string, unknown>;
  revenue_opportunities: string[];
  product_opportunities: string[];
  risk_register: string[];
  learning_updates: string[];
  created_at: string;
};

type CEOSuggestion = {
  id: string;
  category: string;
  priority: string;
  title: string;
  rationale: string;
  suggested_action: string;
  expected_impact: string | null;
  confidence: number;
  status: string;
  requires_master_approval: boolean;
  created_at: string;
};

const DEMO_CONTROLS: CEOControl[] = [
  { agent_key: 'ceo.governor', display_name: 'AI CEO Governor', agent_type: 'executive', description: 'Reads every daily report and produces permission-gated company strategy.', status: 'paused', automation_level: 'recommend_only', model_tier: 'balanced', daily_token_budget: 90000, daily_run_limit: 2, requires_approval: true, can_write_to_user_surfaces: false, schedule_label: 'Daily after all reports', last_run_status: 'demo' },
  { agent_key: 'ceo.customer-experience', display_name: 'Customer Experience Officer', agent_type: 'executive_specialist', description: 'Improves retention, user time-in-ecosystem, concierge quality and journey friction.', status: 'paused', automation_level: 'recommend_only', model_tier: 'balanced', daily_token_budget: 48000, daily_run_limit: 3, requires_approval: true, can_write_to_user_surfaces: false, schedule_label: 'Daily CX scan', last_run_status: 'demo' },
  { agent_key: 'ceo.profit-architect', display_name: 'Profit Architect', agent_type: 'executive_specialist', description: 'Finds margin leaks, token savings, better pricing and B2B yield opportunities.', status: 'paused', automation_level: 'recommend_only', model_tier: 'speed', daily_token_budget: 32000, daily_run_limit: 4, requires_approval: true, can_write_to_user_surfaces: false, schedule_label: 'Twice daily margin scan', last_run_status: 'demo' },
  { agent_key: 'ceo.product-inventor', display_name: 'Product Inventor', agent_type: 'executive_specialist', description: 'Turns repeated business traveller, expat and nomad demand into product experiments.', status: 'paused', automation_level: 'recommend_only', model_tier: 'balanced', daily_token_budget: 36000, daily_run_limit: 2, requires_approval: true, can_write_to_user_surfaces: false, schedule_label: 'Daily product scan', last_run_status: 'demo' },
  { agent_key: 'ceo.risk-counsel', display_name: 'Risk Counsel', agent_type: 'executive_specialist', description: 'Challenges any recommendation that can hurt trust, privacy, compliance or brand.', status: 'paused', automation_level: 'recommend_only', model_tier: 'balanced', daily_token_budget: 30000, daily_run_limit: 4, requires_approval: true, can_write_to_user_surfaces: false, schedule_label: 'Before promotion', last_run_status: 'demo' },
];

const DEMO_PERMISSIONS: CEOPermission[] = [
  { permission_key: 'ceo.product_strategy', title: 'Product Strategy Decisions', description: 'Suggest product changes and new products from ecosystem signals.', decision_area: 'product', status: 'locked', risk_level: 'high', requires_master_password: true, max_daily_actions: 0, can_affect_user_surfaces: false, can_affect_pricing: false, can_affect_costs: false },
  { permission_key: 'ceo.pricing_margin', title: 'Pricing & Margin Decisions', description: 'Suggest pricing, token budgets and margin improvements.', decision_area: 'pricing', status: 'locked', risk_level: 'critical', requires_master_password: true, max_daily_actions: 0, can_affect_user_surfaces: false, can_affect_pricing: true, can_affect_costs: true },
  { permission_key: 'ceo.concierge_behavior', title: 'Concierge Behavior Decisions', description: 'Suggest concierge rule, tone, routing and upsell changes.', decision_area: 'concierge', status: 'locked', risk_level: 'high', requires_master_password: true, max_daily_actions: 0, can_affect_user_surfaces: true, can_affect_pricing: false, can_affect_costs: true },
  { permission_key: 'ceo.risk_policy', title: 'Risk & Policy Decisions', description: 'Veto unsafe automation and trust-damaging monetization.', decision_area: 'risk', status: 'locked', risk_level: 'critical', requires_master_password: true, max_daily_actions: 0, can_affect_user_surfaces: true, can_affect_pricing: true, can_affect_costs: true },
];

const DEMO_REPORTS: CEOReport[] = [{
  id: 'demo-ceo-report', report_date: new Date().toISOString().slice(0, 10), title: 'AI CEO Daily Report — Control Plane Ready',
  executive_summary: 'The CEO layer is ready in recommendation-only mode. It should increase profit by turning repeated user demand into products, reducing token waste, and protecting trust before monetization.',
  narrative: 'SuperNomad should use the AI CEO as a board-level synthesis engine: it reads Concierge AI, directors, AI Brain, agent reports and platform KPIs, then proposes product, customer experience and profit moves. It does not execute real-world decisions in demo. In production, master-password permissions and admin approval remain mandatory for anything that changes users, pricing, cost, partners or concierge behavior.',
  business_health: { posture: 'safe', mode: 'recommend_only', focus: 'profit with trust' },
  customer_experience: { north_star: 'more useful time in ecosystem', targets: ['faster concierge', 'better personalization', 'less friction'] },
  revenue_opportunities: ['Bundle repeated high-intent concierge requests into premium city products', 'Use B2B signals to price data packages closer to market value', 'Cut token burn with route-first specialist calls'],
  product_opportunities: ['Business Traveller Command Week', 'Expat Relocation Concierge Pack', 'Nomad City Profit Map'],
  risk_register: ['No automatic pricing changes', 'No user-facing behavior changes without approval', 'Aggregate learning only'],
  learning_updates: ['Learn from daily reports, admin decisions and performance scores — not raw private data'],
  created_at: new Date().toISOString(),
}];

const DEMO_SUGGESTIONS: CEOSuggestion[] = [
  { id: 's1', category: 'product', priority: 'high', title: 'Launch premium city bundles from repeated concierge demand', rationale: 'Business travellers and expats repeatedly ask for the same high-value city workflows.', suggested_action: 'Package visa, local life, airport, hotel, workspace and safety intelligence into city bundles.', expected_impact: 'More paid conversions and longer sessions inside the ecosystem.', confidence: 0.88, status: 'pending', requires_master_approval: true, created_at: new Date().toISOString() },
  { id: 's2', category: 'profit', priority: 'high', title: 'Keep CEO and directors route-first to cut tokens', rationale: 'Cheap classification and specialist gating should reduce expensive model calls.', suggested_action: 'Keep Profit Architect and Token Sentinel active before enabling heavier CEO synthesis.', expected_impact: 'Lower AI cost while preserving response quality.', confidence: 0.91, status: 'pending', requires_master_approval: true, created_at: new Date().toISOString() },
  { id: 's3', category: 'experience', priority: 'medium', title: 'Turn concierge friction into daily product tasks', rationale: 'Support and concierge issues are the fastest signal for what users actually need.', suggested_action: 'CEO Customer Experience Officer should convert top friction into scoped product tasks daily.', expected_impact: 'Better customer experience and higher retention.', confidence: 0.84, status: 'pending', requires_master_approval: true, created_at: new Date().toISOString() },
];

const priorityClass: Record<string, string> = {
  urgent: 'bg-destructive/15 text-destructive border-destructive/30',
  critical: 'bg-destructive/15 text-destructive border-destructive/30',
  high: 'bg-warning/15 text-warning border-warning/30',
  medium: 'bg-primary/15 text-primary border-primary/30',
  low: 'bg-success/15 text-success border-success/30',
};

function safeList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

const AdminCEO: React.FC = () => {
  const { isDemoMode, isAdmin } = useStaffRole();
  const [controls, setControls] = useState<CEOControl[]>(DEMO_CONTROLS);
  const [permissions, setPermissions] = useState<CEOPermission[]>(DEMO_PERMISSIONS);
  const [reports, setReports] = useState<CEOReport[]>(DEMO_REPORTS);
  const [suggestions, setSuggestions] = useState<CEOSuggestion[]>(DEMO_SUGGESTIONS);
  const [masterKey, setMasterKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => { document.title = 'Back Office — AI CEO · SuperNomad'; }, []);

  async function loadCEO() {
    setLoading(true);
    if (isDemoMode) {
      setLoading(false);
      return;
    }
    try {
      const [controlsRes, permissionsRes, reportsRes, suggestionsRes] = await Promise.all([
        supabase.from('admin_ai_agent_controls' as any).select('*').like('agent_key', 'ceo.%').order('agent_key'),
        supabase.from('admin_ai_ceo_permissions' as any).select('*').order('decision_area'),
        supabase.from('admin_ai_ceo_reports' as any).select('*').order('report_date', { ascending: false }).limit(8),
        supabase.from('admin_ai_ceo_suggestions' as any).select('*').order('created_at', { ascending: false }).limit(30),
      ]);
      if (controlsRes.data?.length) setControls(controlsRes.data as unknown as CEOControl[]);
      if (permissionsRes.data?.length) setPermissions(permissionsRes.data as unknown as CEOPermission[]);
      if (reportsRes.data?.length) setReports((reportsRes.data as any[]).map((r) => ({ ...r, revenue_opportunities: safeList(r.revenue_opportunities), product_opportunities: safeList(r.product_opportunities), risk_register: safeList(r.risk_register), learning_updates: safeList(r.learning_updates) })) as CEOReport[]);
      if (suggestionsRes.data?.length) setSuggestions(suggestionsRes.data as unknown as CEOSuggestion[]);
    } catch (e) {
      console.warn('AI CEO fallback:', e);
      toast.info('AI CEO demo fallback loaded.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCEO(); }, [isDemoMode]);

  const kpis = useMemo(() => ({
    agents: controls.length,
    active: controls.filter((c) => c.status === 'active').length,
    budget: controls.reduce((sum, c) => sum + Number(c.daily_token_budget || 0), 0),
    locked: permissions.filter((p) => p.status === 'locked').length,
    pending: suggestions.filter((s) => s.status === 'pending').length,
  }), [controls, permissions, suggestions]);

  const latestReport = reports[0] ?? DEMO_REPORTS[0];

  async function updateControl(agentKey: string, patch: Partial<CEOControl>) {
    if (isDemoMode) {
      setControls((current) => current.map((c) => (c.agent_key === agentKey ? { ...c, ...patch } : c)));
      toast.info('Demo mode — CEO agent changed only in preview.');
      return;
    }
    if (!isAdmin) return toast.error('Admin role required.');
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
    if (error) return toast.error(error.message);
    setControls((current) => current.map((c) => (c.agent_key === agentKey ? data as unknown as CEOControl : c)));
    toast.success('AI CEO agent updated.');
  }

  async function updatePermission(permission: CEOPermission, patch: Partial<CEOPermission>) {
    if (!masterKey.trim()) return toast.error('Master password field required for CEO permission changes.');
    if (isDemoMode) {
      setPermissions((current) => current.map((p) => (p.permission_key === permission.permission_key ? { ...p, ...patch } : p)));
      toast.info('Demo mode — permission changed only in preview.');
      return;
    }
    if (!isAdmin) return toast.error('Admin role required.');
    const { data, error } = await supabase.rpc('update_admin_ai_ceo_permission' as any, {
      p_permission_key: permission.permission_key,
      p_status: patch.status ?? null,
      p_max_daily_actions: patch.max_daily_actions ?? null,
      p_requires_master_password: patch.requires_master_password ?? null,
      p_metadata: null,
    });
    if (error) return toast.error(error.message);
    setPermissions((current) => current.map((p) => (p.permission_key === permission.permission_key ? data as unknown as CEOPermission : p)));
    toast.success('AI CEO permission updated.');
  }

  async function decideSuggestion(suggestion: CEOSuggestion, status: 'approved' | 'rejected') {
    if (!masterKey.trim()) return toast.error('Master password field required for CEO decisions.');
    if (isDemoMode) {
      setSuggestions((current) => current.map((s) => (s.id === suggestion.id ? { ...s, status } : s)));
      toast.info(`Demo mode — suggestion marked ${status}.`);
      return;
    }
    if (!isAdmin) return toast.error('Admin role required.');
    const { data, error } = await supabase.rpc('decide_admin_ai_ceo_suggestion' as any, {
      p_suggestion_id: suggestion.id,
      p_status: status,
      p_decision_note: 'Back Office CEO decision gate',
    });
    if (error) return toast.error(error.message);
    setSuggestions((current) => current.map((s) => (s.id === suggestion.id ? data as unknown as CEOSuggestion : s)));
    toast.success(`CEO suggestion ${status}.`);
  }

  async function runCEO() {
    if (isDemoMode) {
      toast.success('Demo AI CEO report refreshed.');
      setReports([{ ...DEMO_REPORTS[0], created_at: new Date().toISOString() }]);
      return;
    }
    if (!isAdmin) return toast.error('Admin role required.');
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-ceo', { body: { trigger: 'manual' } });
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error ?? 'AI CEO run failed');
      toast.success(`AI CEO report complete: ${data.suggestions_created ?? 0} suggestions created.`);
      await loadCEO();
    } catch (e: any) {
      toast.error(e.message ?? 'AI CEO run failed.');
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 px-8 py-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-normal">AI CEO</h1>
                <p className="text-sm text-muted-foreground">Executive synthesis, profit strategy, customer experience and permission-gated decisions.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={masterKey} onChange={(e) => setMasterKey(e.target.value)} type="password" placeholder="Master password gate" className="w-full pl-9 sm:w-64" />
            </div>
            <Button variant="outline" onClick={loadCEO}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
            <Button onClick={runCEO} disabled={running}>{running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}Run CEO</Button>
          </div>
        </div>
      </header>

      <main className="space-y-6 p-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Kpi icon={BriefcaseBusiness} label="CEO agents" value={kpis.agents} />
          <Kpi icon={CheckCircle2} label="Active" value={kpis.active} />
          <Kpi icon={Gauge} label="Daily token cap" value={kpis.budget.toLocaleString()} />
          <Kpi icon={LockKeyhole} label="Locked permissions" value={kpis.locked} />
          <Kpi icon={Lightbulb} label="Pending suggestions" value={kpis.pending} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <Badge className="mb-2 border-primary/30 bg-primary/10 text-primary">Daily CEO report</Badge>
                <h2 className="text-xl font-semibold tracking-normal">{latestReport.title}</h2>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{latestReport.executive_summary}</p>
            {latestReport.narrative && <p className="mt-4 text-sm leading-6 text-foreground/90">{latestReport.narrative}</p>}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <OpportunityBlock icon={Coins} title="Revenue opportunities" items={latestReport.revenue_opportunities} />
              <OpportunityBlock icon={Sparkles} title="Product opportunities" items={latestReport.product_opportunities} />
              <OpportunityBlock icon={ShieldCheck} title="Risk register" items={latestReport.risk_register} />
              <OpportunityBlock icon={TrendingUp} title="Learning updates" items={latestReport.learning_updates} />
            </div>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-normal">CEO operating rules</h2>
              <Badge variant="outline">Recommendation-only</Badge>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <RuleLine icon={LockKeyhole} text="Master approval required for every material decision in real version." />
              <RuleLine icon={ShieldCheck} text="No automatic user-facing, pricing, cost or partner changes without admin approval." />
              <RuleLine icon={Users} text="Learning is aggregate and report-based, not raw private-user training." />
              <RuleLine icon={Target} text="Primary goal: more useful time in ecosystem, better experience, higher trusted profit." />
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card className="border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold tracking-normal">CEO agents</h2>
            <ScrollArea className="h-[520px] pr-3">
              <div className="space-y-3">
                {controls.map((agent) => (
                  <div key={agent.agent_key} className="rounded-md border border-border bg-background p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium tracking-normal">{agent.display_name}</h3>
                          <Badge variant="outline">{agent.model_tier}</Badge>
                          <Badge className={agent.status === 'active' ? 'bg-success/15 text-success border-success/30' : 'bg-muted text-muted-foreground border-border'}>{agent.status}</Badge>
                        </div>
                        <p className="mt-2 text-sm leading-5 text-muted-foreground">{agent.description}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{agent.schedule_label} · {Number(agent.daily_token_budget).toLocaleString()} tokens/day · {agent.daily_run_limit} runs/day</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <Select value={agent.automation_level} onValueChange={(value) => updateControl(agent.agent_key, { automation_level: value })}>
                          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recommend_only">Safe</SelectItem>
                            <SelectItem value="supervised">Supervised</SelectItem>
                            <SelectItem value="autonomous">Autonomous</SelectItem>
                          </SelectContent>
                        </Select>
                        <Switch checked={agent.status === 'active'} onCheckedChange={(checked) => updateControl(agent.agent_key, { status: checked ? 'active' : 'paused' })} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          <Card className="border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold tracking-normal">CEO permissions</h2>
            <ScrollArea className="h-[520px] pr-3">
              <div className="space-y-3">
                {permissions.map((permission) => (
                  <div key={permission.permission_key} className="rounded-md border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium tracking-normal">{permission.title}</h3>
                          <Badge className={priorityClass[permission.risk_level] ?? 'bg-muted text-muted-foreground border-border'}>{permission.risk_level}</Badge>
                          <Badge variant="outline">{permission.status}</Badge>
                        </div>
                        <p className="mt-2 text-sm leading-5 text-muted-foreground">{permission.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {permission.can_affect_user_surfaces && <Badge variant="secondary">user surfaces</Badge>}
                          {permission.can_affect_pricing && <Badge variant="secondary">pricing</Badge>}
                          {permission.can_affect_costs && <Badge variant="secondary">costs</Badge>}
                          {permission.requires_master_password && <Badge variant="secondary">master gate</Badge>}
                        </div>
                      </div>
                      <Switch checked={permission.status === 'enabled'} onCheckedChange={(checked) => updatePermission(permission, { status: checked ? 'enabled' : 'locked' })} />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </section>

        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-normal">CEO suggestions</h2>
            <Badge variant="outline">Human approval required</Badge>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="rounded-md border border-border bg-background p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className={priorityClass[suggestion.priority] ?? 'bg-muted text-muted-foreground border-border'}>{suggestion.priority}</Badge>
                  <Badge variant="outline">{suggestion.category}</Badge>
                  {suggestion.requires_master_approval && <LockKeyhole className="h-4 w-4 text-muted-foreground" />}
                </div>
                <h3 className="font-medium leading-6 tracking-normal">{suggestion.title}</h3>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">{suggestion.rationale}</p>
                <div className="mt-3 rounded-md border border-border bg-card p-3 text-sm leading-5">{suggestion.suggested_action}</div>
                {suggestion.expected_impact && <p className="mt-3 text-sm text-success">{suggestion.expected_impact}</p>}
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Confidence {Math.round(Number(suggestion.confidence) * 100)}% · {suggestion.status}</span>
                  {suggestion.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => decideSuggestion(suggestion, 'rejected')}><PauseCircle className="mr-1.5 h-3.5 w-3.5" />Reject</Button>
                      <Button size="sm" onClick={() => decideSuggestion(suggestion, 'approved')}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Approve</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

const Kpi = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) => (
  <Card className="border-border bg-card p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-normal">{value}</p>
      </div>
      <Icon className="h-5 w-5 text-primary" />
    </div>
  </Card>
);

const OpportunityBlock = ({ icon: Icon, title, items }: { icon: React.ComponentType<{ className?: string }>; title: string; items: string[] }) => (
  <div className="rounded-md border border-border bg-background p-4">
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-medium tracking-normal">{title}</h3>
    </div>
    <ul className="space-y-2 text-sm leading-5 text-muted-foreground">
      {items.slice(0, 4).map((item) => <li key={item}>• {item}</li>)}
    </ul>
  </div>
);

const RuleLine = ({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) => (
  <div className="flex items-start gap-3 rounded-md border border-border bg-background p-3">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
    <span>{text}</span>
  </div>
);

export default AdminCEO;
