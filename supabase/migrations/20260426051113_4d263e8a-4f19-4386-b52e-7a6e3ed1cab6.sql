CREATE TABLE IF NOT EXISTS public.admin_ai_agent_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key text NOT NULL UNIQUE,
  display_name text NOT NULL,
  director public.director_role,
  agent_type text NOT NULL DEFAULT 'specialist',
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'paused',
  automation_level text NOT NULL DEFAULT 'recommend_only',
  schedule_cron text,
  schedule_label text NOT NULL DEFAULT 'manual only',
  model_tier text NOT NULL DEFAULT 'balanced',
  daily_token_budget integer NOT NULL DEFAULT 50000,
  daily_run_limit integer NOT NULL DEFAULT 24,
  requires_approval boolean NOT NULL DEFAULT true,
  can_write_to_user_surfaces boolean NOT NULL DEFAULT false,
  feature_flags jsonb NOT NULL DEFAULT '{}'::jsonb,
  input_sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  output_targets jsonb NOT NULL DEFAULT '[]'::jsonb,
  escalation_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  owner_role text NOT NULL DEFAULT 'admin',
  last_run_at timestamptz,
  last_run_status text,
  next_run_at timestamptz,
  disabled_reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_ai_agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key text NOT NULL REFERENCES public.admin_ai_agent_controls(agent_key) ON DELETE CASCADE,
  director public.director_role,
  trigger text NOT NULL DEFAULT 'manual',
  status text NOT NULL DEFAULT 'queued',
  scope text NOT NULL DEFAULT 'standard',
  signals_scanned jsonb NOT NULL DEFAULT '{}'::jsonb,
  outputs jsonb NOT NULL DEFAULT '{}'::jsonb,
  suggested_improvements jsonb NOT NULL DEFAULT '[]'::jsonb,
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  latency_ms integer NOT NULL DEFAULT 0,
  error text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_by uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.admin_ai_agent_daily_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date date NOT NULL DEFAULT CURRENT_DATE,
  agent_key text NOT NULL REFERENCES public.admin_ai_agent_controls(agent_key) ON DELETE CASCADE,
  director public.director_role,
  title text NOT NULL,
  summary text NOT NULL,
  performance_score numeric(5,2) NOT NULL DEFAULT 0,
  wins jsonb NOT NULL DEFAULT '[]'::jsonb,
  issues jsonb NOT NULL DEFAULT '[]'::jsonb,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  suggestions jsonb NOT NULL DEFAULT '[]'::jsonb,
  token_usage integer NOT NULL DEFAULT 0,
  estimated_cost_usd numeric(12,4) NOT NULL DEFAULT 0,
  next_actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  generated_by_run_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (report_date, agent_key)
);

CREATE TABLE IF NOT EXISTS public.admin_ai_agent_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key text NOT NULL REFERENCES public.admin_ai_agent_controls(agent_key) ON DELETE CASCADE,
  director public.director_role,
  suggestion_type text NOT NULL DEFAULT 'optimization',
  priority text NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  rationale text NOT NULL,
  expected_impact text,
  risk_level text NOT NULL DEFAULT 'low',
  requires_approval boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'pending',
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  suggested_action text NOT NULL,
  decided_at timestamptz,
  decided_by uuid,
  decision_note text,
  source_report_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE public.admin_ai_agent_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_ai_agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_ai_agent_daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_ai_agent_suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view agent controls" ON public.admin_ai_agent_controls;
CREATE POLICY "Staff can view agent controls" ON public.admin_ai_agent_controls
FOR SELECT USING (public.has_staff_role(auth.uid()));
DROP POLICY IF EXISTS "Admins manage agent controls" ON public.admin_ai_agent_controls;
CREATE POLICY "Admins manage agent controls" ON public.admin_ai_agent_controls
FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Staff can view agent runs" ON public.admin_ai_agent_runs;
CREATE POLICY "Staff can view agent runs" ON public.admin_ai_agent_runs
FOR SELECT USING (public.has_staff_role(auth.uid()));
DROP POLICY IF EXISTS "Admins manage agent runs" ON public.admin_ai_agent_runs;
CREATE POLICY "Admins manage agent runs" ON public.admin_ai_agent_runs
FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Staff can view agent daily reports" ON public.admin_ai_agent_daily_reports;
CREATE POLICY "Staff can view agent daily reports" ON public.admin_ai_agent_daily_reports
FOR SELECT USING (public.has_staff_role(auth.uid()));
DROP POLICY IF EXISTS "Admins manage agent daily reports" ON public.admin_ai_agent_daily_reports;
CREATE POLICY "Admins manage agent daily reports" ON public.admin_ai_agent_daily_reports
FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Staff can view agent suggestions" ON public.admin_ai_agent_suggestions;
CREATE POLICY "Staff can view agent suggestions" ON public.admin_ai_agent_suggestions
FOR SELECT USING (public.has_staff_role(auth.uid()));
DROP POLICY IF EXISTS "Admins manage agent suggestions" ON public.admin_ai_agent_suggestions;
CREATE POLICY "Admins manage agent suggestions" ON public.admin_ai_agent_suggestions
FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX IF NOT EXISTS idx_agent_controls_director ON public.admin_ai_agent_controls(director, status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent_started ON public.admin_ai_agent_runs(agent_key, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_reports_date_agent ON public.admin_ai_agent_daily_reports(report_date DESC, agent_key);
CREATE INDEX IF NOT EXISTS idx_agent_suggestions_status_priority ON public.admin_ai_agent_suggestions(status, priority, created_at DESC);

DROP TRIGGER IF EXISTS update_admin_ai_agent_controls_updated_at ON public.admin_ai_agent_controls;
CREATE TRIGGER update_admin_ai_agent_controls_updated_at
BEFORE UPDATE ON public.admin_ai_agent_controls
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.get_admin_agent_control_summary()
RETURNS TABLE(
  total_agents bigint,
  active_agents bigint,
  paused_agents bigint,
  disabled_agents bigint,
  recommend_only_agents bigint,
  autonomous_agents bigint,
  runs_24h bigint,
  failed_runs_24h bigint,
  tokens_24h bigint,
  pending_suggestions bigint,
  high_priority_suggestions bigint,
  reports_today bigint,
  computed_at timestamptz
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    (SELECT count(*)::bigint FROM public.admin_ai_agent_controls),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_controls WHERE status = 'active'),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_controls WHERE status = 'paused'),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_controls WHERE status = 'disabled'),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_controls WHERE automation_level = 'recommend_only'),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_controls WHERE automation_level IN ('supervised_auto','autonomous')),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_runs WHERE started_at > now() - interval '24 hours'),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_runs WHERE started_at > now() - interval '24 hours' AND status = 'failed'),
    (SELECT COALESCE(sum(input_tokens + output_tokens), 0)::bigint FROM public.admin_ai_agent_runs WHERE started_at > now() - interval '24 hours'),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_suggestions WHERE status = 'pending'),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_suggestions WHERE status = 'pending' AND priority IN ('high','urgent')),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_daily_reports WHERE report_date = CURRENT_DATE),
    now()
  WHERE public.has_staff_role(auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.get_latest_agent_daily_reports(p_limit integer DEFAULT 50)
RETURNS SETOF public.admin_ai_agent_daily_reports
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT r.*
  FROM public.admin_ai_agent_daily_reports r
  WHERE public.has_staff_role(auth.uid())
  ORDER BY r.report_date DESC, r.created_at DESC
  LIMIT LEAST(GREATEST(p_limit, 1), 200);
$$;

CREATE OR REPLACE FUNCTION public.update_admin_ai_agent_control(
  p_agent_key text,
  p_status text DEFAULT NULL,
  p_automation_level text DEFAULT NULL,
  p_daily_token_budget integer DEFAULT NULL,
  p_daily_run_limit integer DEFAULT NULL,
  p_requires_approval boolean DEFAULT NULL,
  p_can_write_to_user_surfaces boolean DEFAULT NULL,
  p_disabled_reason text DEFAULT NULL
)
RETURNS public.admin_ai_agent_controls
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_row public.admin_ai_agent_controls;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  UPDATE public.admin_ai_agent_controls
  SET status = COALESCE(p_status, status),
      automation_level = COALESCE(p_automation_level, automation_level),
      daily_token_budget = COALESCE(p_daily_token_budget, daily_token_budget),
      daily_run_limit = COALESCE(p_daily_run_limit, daily_run_limit),
      requires_approval = COALESCE(p_requires_approval, requires_approval),
      can_write_to_user_surfaces = COALESCE(p_can_write_to_user_surfaces, can_write_to_user_surfaces),
      disabled_reason = p_disabled_reason,
      updated_at = now()
  WHERE agent_key = p_agent_key
  RETURNING * INTO v_row;

  IF v_row.id IS NULL THEN
    RAISE EXCEPTION 'agent_not_found';
  END IF;

  PERFORM public.log_staff_action(
    'admin_ai.agent_control_updated',
    'admin_ai_agent_controls',
    p_agent_key,
    NULL,
    to_jsonb(v_row),
    jsonb_build_object('status', v_row.status, 'automation_level', v_row.automation_level)
  );

  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_admin_ai_agent_run(
  p_agent_key text,
  p_trigger text,
  p_status text,
  p_scope text DEFAULT 'standard',
  p_signals_scanned jsonb DEFAULT '{}'::jsonb,
  p_outputs jsonb DEFAULT '{}'::jsonb,
  p_suggested_improvements jsonb DEFAULT '[]'::jsonb,
  p_input_tokens integer DEFAULT 0,
  p_output_tokens integer DEFAULT 0,
  p_latency_ms integer DEFAULT 0,
  p_error text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_id uuid;
  v_director public.director_role;
BEGIN
  SELECT director INTO v_director FROM public.admin_ai_agent_controls WHERE agent_key = p_agent_key;
  IF v_director IS NULL AND NOT EXISTS (SELECT 1 FROM public.admin_ai_agent_controls WHERE agent_key = p_agent_key) THEN
    RAISE EXCEPTION 'agent_not_found';
  END IF;

  INSERT INTO public.admin_ai_agent_runs (
    agent_key, director, trigger, status, scope, signals_scanned, outputs,
    suggested_improvements, input_tokens, output_tokens, latency_ms, error,
    completed_at, created_by
  ) VALUES (
    p_agent_key, v_director, p_trigger, p_status, p_scope, COALESCE(p_signals_scanned, '{}'::jsonb), COALESCE(p_outputs, '{}'::jsonb),
    COALESCE(p_suggested_improvements, '[]'::jsonb), COALESCE(p_input_tokens, 0), COALESCE(p_output_tokens, 0), COALESCE(p_latency_ms, 0), p_error,
    CASE WHEN p_status IN ('completed','failed','cancelled') THEN now() ELSE NULL END,
    auth.uid()
  ) RETURNING id INTO v_id;

  UPDATE public.admin_ai_agent_controls
  SET last_run_at = now(),
      last_run_status = p_status,
      updated_at = now()
  WHERE agent_key = p_agent_key;

  RETURN v_id;
END;
$$;

INSERT INTO public.admin_ai_agent_controls (
  agent_key, display_name, director, agent_type, description, status, automation_level,
  schedule_label, model_tier, daily_token_budget, daily_run_limit, requires_approval,
  can_write_to_user_surfaces, input_sources, output_targets, escalation_rules, metadata
) VALUES
('brain.governor', 'AI Brain Governor', NULL, 'governor', 'Coordinates directors, detects cross-system risks, and prepares executive reports.', 'paused', 'recommend_only', 'Daily executive scan', 'balanced', 120000, 6, true, false, '["ai_usage_logs","support_tickets","agentic_transactions","conversations"]', '["admin_ai_insights","admin_ai_recommendations","admin_ai_reports"]', '{"critical_severity":"human_admin"}', '{"seeded":"production_control_v1"}'),
('events.director', 'Global Event Director', 'events', 'director', 'Finds premium cultural, music, business, and art opportunities for members and sponsors.', 'paused', 'recommend_only', 'Every 6 hours after approval', 'speed', 45000, 4, true, false, '["verified_sources","source_snapshots","events"]', '["admin_ai_opportunities","admin_ai_recommendations"]', '{"push_to_user_surfaces":"requires_approval"}', '{"seeded":"production_control_v1"}'),
('sports.director', 'Global Sports Director', 'sports', 'director', 'Finds premium sports, hospitality, and travel bundle opportunities.', 'paused', 'recommend_only', 'Every 6 hours after approval', 'speed', 45000, 4, true, false, '["verified_sources","sports_calendar"]', '["admin_ai_opportunities","admin_ai_recommendations"]', '{"push_to_user_surfaces":"requires_approval"}', '{"seeded":"production_control_v1"}'),
('vip.director', 'Global VIP Director', 'vip', 'director', 'Sources exclusive VIP access, private dinners, fashion, yacht, and gala moments.', 'paused', 'recommend_only', 'Every 8 hours after approval', 'balanced', 60000, 3, true, false, '["verified_sources","partner_inventory"]', '["admin_ai_opportunities","admin_ai_recommendations"]', '{"black_tier":"admin_approval"}', '{"seeded":"production_control_v1"}'),
('affiliate.director', 'Affiliate & Partnership Director', 'affiliate', 'director', 'Optimizes commission partnerships, payout economics, and merchant fit.', 'paused', 'recommend_only', 'Daily after approval', 'speed', 35000, 2, true, false, '["affiliate_accounts","affiliate_earnings","data_packages"]', '["admin_ai_recommendations","admin_ai_agent_suggestions"]', '{"payout_changes":"admin_approval"}', '{"seeded":"production_control_v1"}'),
('pricing.director', 'Pricing & Yield Director', 'pricing', 'director', 'Recommends pricing, token budgets, yield, and margin improvements.', 'paused', 'recommend_only', 'Daily after approval', 'balanced', 50000, 2, true, false, '["ai_usage_logs","subscription_metrics","package_delivery_jobs"]', '["admin_ai_recommendations","admin_ai_agent_suggestions"]', '{"price_change":"admin_approval"}', '{"seeded":"production_control_v1"}'),
('happiness.director', 'Happiness & NPS Director', 'happiness', 'director', 'Detects churn, friction, support pain, and recovery opportunities.', 'paused', 'recommend_only', 'Daily after approval', 'balanced', 55000, 2, true, false, '["support_tickets","conversations","profiles"]', '["admin_ai_recommendations","admin_ai_agent_suggestions"]', '{"customer_contact":"support_approval"}', '{"seeded":"production_control_v1"}'),
('finops.token-sentinel', 'Token Sentinel', 'pricing', 'specialist', 'Small task agent that watches token burn, cache hit rates, model routing, and avoidable spend.', 'paused', 'recommend_only', 'Hourly after approval', 'speed', 18000, 12, true, false, '["ai_usage_logs","admin_ai_agent_runs"]', '["admin_ai_agent_daily_reports","admin_ai_agent_suggestions"]', '{"budget_breach":"admin_alert"}', '{"seeded":"production_control_v1"}'),
('quality.concierge-auditor', 'Concierge Quality Auditor', 'happiness', 'specialist', 'Small task agent that audits answer quality, escalations, personalization, and hallucination risk.', 'paused', 'recommend_only', 'Every 4 hours after approval', 'balanced', 30000, 6, true, false, '["conversations","chat_messages","support_tickets"]', '["admin_ai_agent_daily_reports","admin_ai_agent_suggestions"]', '{"high_stakes_issue":"human_review"}', '{"seeded":"production_control_v1"}'),
('revenue.b2b-scout', 'B2B Revenue Scout', 'b2b_sales', 'specialist', 'Small task agent that finds data package, corporate travel, and white-label opportunities.', 'paused', 'recommend_only', 'Daily after approval', 'balanced', 40000, 3, true, false, '["api_partners","data_packages","package_delivery_jobs"]', '["admin_ai_opportunities","admin_ai_agent_suggestions"]', '{"external_outreach":"admin_approval"}', '{"seeded":"production_control_v1"}')
ON CONFLICT (agent_key) DO NOTHING;

INSERT INTO public.admin_ai_agent_daily_reports (
  report_date, agent_key, director, title, summary, performance_score, wins, issues, metrics, suggestions, token_usage, estimated_cost_usd, next_actions, metadata
) VALUES
(CURRENT_DATE, 'finops.token-sentinel', 'pricing', 'Token Sentinel Daily Report', 'Initial production-control baseline is ready. Agent is paused in recommend-only mode until an admin enables scheduled automation.', 88, '["Control record seeded", "Budget and run limits configured"]', '["No live autonomous runs until admin activation"]', '{"mode":"paused","budget_guardrails":"ready"}', '["Enable hourly scans only after live token pricing is confirmed", "Keep simple classification on speed-tier models"]', 0, 0, '["Review budget", "Enable supervised automation when ready"]', '{"demo_safe":true}'),
(CURRENT_DATE, 'quality.concierge-auditor', 'happiness', 'Concierge Quality Auditor Daily Report', 'Quality-control specialist is ready to audit conversations and suggest improvements without touching user-facing surfaces.', 86, '["Human approval enforced", "Escalation rules configured"]', '["Needs live sampling policy before production automation"]', '{"mode":"paused","approval_required":true}', '["Start with 5% sampled audits", "Route high-stakes findings to support before any customer contact"]', 0, 0, '["Approve sampling policy", "Connect evaluator score thresholds"]', '{"demo_safe":true}'),
(CURRENT_DATE, 'revenue.b2b-scout', 'b2b_sales', 'B2B Revenue Scout Daily Report', 'Revenue scout is ready to identify partner and data-package opportunities, but external outreach remains blocked until admin approval.', 84, '["Output targets configured", "External outreach blocked by default"]', '["Needs CRM/export destination before scale-up"]', '{"mode":"paused","write_access":false}', '["Prioritize high-ACV white-label leads", "Require evidence links before sales approval"]', 0, 0, '["Choose CRM destination", "Enable supervised daily scan"]', '{"demo_safe":true}')
ON CONFLICT (report_date, agent_key) DO NOTHING;

INSERT INTO public.admin_ai_agent_suggestions (
  agent_key, director, suggestion_type, priority, title, rationale, expected_impact, risk_level, requires_approval, status, evidence, suggested_action, expires_at
) VALUES
('finops.token-sentinel', 'pricing', 'cost_control', 'high', 'Add per-agent daily token caps before enabling automation', 'Separate token caps prevent one director or specialist from consuming the full AI budget during spikes.', 'Lower token burn and more predictable gross margin.', 'low', true, 'pending', '{"source":"production_control_seed"}', 'Approve token budgets per agent, then enable only supervised automation first.', now() + interval '30 days'),
('quality.concierge-auditor', 'happiness', 'quality_control', 'high', 'Start with sampled concierge audits, not full-traffic audits', 'Sampling gives quality signal while reducing AI cost and avoiding unnecessary processing of every conversation.', 'Faster quality learning with lower token usage.', 'low', true, 'pending', '{"source":"production_control_seed"}', 'Approve a 5% audit sample and raise only high-risk findings to support.', now() + interval '30 days'),
('revenue.b2b-scout', 'b2b_sales', 'revenue_growth', 'medium', 'Require evidence-first B2B leads before sales push', 'B2B recommendations should include source evidence, target segment, estimated value, and recommended human owner before outreach.', 'Higher sales quality and less wasted founder/sales time.', 'medium', true, 'pending', '{"source":"production_control_seed"}', 'Approve evidence requirements and keep external outreach disabled until a human signs off.', now() + interval '30 days')
ON CONFLICT DO NOTHING;