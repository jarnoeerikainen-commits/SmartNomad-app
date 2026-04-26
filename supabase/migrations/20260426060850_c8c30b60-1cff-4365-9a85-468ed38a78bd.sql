CREATE TABLE IF NOT EXISTS public.admin_ai_ceo_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date date NOT NULL DEFAULT CURRENT_DATE,
  title text NOT NULL,
  executive_summary text NOT NULL,
  narrative text,
  business_health jsonb NOT NULL DEFAULT '{}'::jsonb,
  customer_experience jsonb NOT NULL DEFAULT '{}'::jsonb,
  revenue_opportunities jsonb NOT NULL DEFAULT '[]'::jsonb,
  product_opportunities jsonb NOT NULL DEFAULT '[]'::jsonb,
  risk_register jsonb NOT NULL DEFAULT '[]'::jsonb,
  learning_updates jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_rollups jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  generated_by_run_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (report_date)
);

ALTER TABLE public.admin_ai_ceo_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view AI CEO reports" ON public.admin_ai_ceo_reports;
CREATE POLICY "Staff can view AI CEO reports"
ON public.admin_ai_ceo_reports
FOR SELECT
USING (public.has_staff_role(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage AI CEO reports" ON public.admin_ai_ceo_reports;
CREATE POLICY "Admins can manage AI CEO reports"
ON public.admin_ai_ceo_reports
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE IF NOT EXISTS public.admin_ai_ceo_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'strategy',
  priority text NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  rationale text NOT NULL,
  suggested_action text NOT NULL,
  expected_impact text,
  confidence numeric NOT NULL DEFAULT 0.75,
  status text NOT NULL DEFAULT 'pending',
  requires_master_approval boolean NOT NULL DEFAULT true,
  decided_at timestamptz,
  decided_by uuid,
  decision_note text,
  source_report_id uuid REFERENCES public.admin_ai_ceo_reports(id) ON DELETE SET NULL,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_ai_ceo_suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view AI CEO suggestions" ON public.admin_ai_ceo_suggestions;
CREATE POLICY "Staff can view AI CEO suggestions"
ON public.admin_ai_ceo_suggestions
FOR SELECT
USING (public.has_staff_role(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage AI CEO suggestions" ON public.admin_ai_ceo_suggestions;
CREATE POLICY "Admins can manage AI CEO suggestions"
ON public.admin_ai_ceo_suggestions
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX IF NOT EXISTS idx_admin_ai_ceo_suggestions_status_priority
ON public.admin_ai_ceo_suggestions(status, priority, created_at DESC);

CREATE TABLE IF NOT EXISTS public.admin_ai_ceo_permissions (
  permission_key text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  decision_area text NOT NULL DEFAULT 'strategy',
  status text NOT NULL DEFAULT 'locked',
  risk_level text NOT NULL DEFAULT 'high',
  requires_master_password boolean NOT NULL DEFAULT true,
  max_daily_actions integer NOT NULL DEFAULT 0,
  can_affect_user_surfaces boolean NOT NULL DEFAULT false,
  can_affect_pricing boolean NOT NULL DEFAULT false,
  can_affect_costs boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.admin_ai_ceo_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view AI CEO permissions" ON public.admin_ai_ceo_permissions;
CREATE POLICY "Staff can view AI CEO permissions"
ON public.admin_ai_ceo_permissions
FOR SELECT
USING (public.has_staff_role(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage AI CEO permissions" ON public.admin_ai_ceo_permissions;
CREATE POLICY "Admins can manage AI CEO permissions"
ON public.admin_ai_ceo_permissions
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS update_admin_ai_ceo_permissions_updated_at ON public.admin_ai_ceo_permissions;
CREATE TRIGGER update_admin_ai_ceo_permissions_updated_at
BEFORE UPDATE ON public.admin_ai_ceo_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.admin_ai_ceo_permissions
  (permission_key, title, description, decision_area, status, risk_level, max_daily_actions, can_affect_user_surfaces, can_affect_pricing, can_affect_costs, metadata)
VALUES
  ('ceo.product_strategy', 'Product Strategy Decisions', 'Suggests product changes and new product lines from concierge, director and revenue signals.', 'product', 'locked', 'high', 0, false, false, false, '{"demo_visible": true}'::jsonb),
  ('ceo.pricing_margin', 'Pricing & Margin Decisions', 'Suggests pricing tests, token budgets, package pricing and margin improvements.', 'pricing', 'locked', 'critical', 0, false, true, true, '{"demo_visible": true}'::jsonb),
  ('ceo.concierge_behavior', 'Concierge Behavior Decisions', 'Suggests changes to concierge rules, routing, tone and upsell behavior.', 'concierge', 'locked', 'high', 0, true, false, true, '{"demo_visible": true}'::jsonb),
  ('ceo.growth_campaigns', 'Growth Campaign Decisions', 'Suggests retention, affiliate, lifecycle and engagement campaigns.', 'growth', 'locked', 'high', 0, true, false, true, '{"demo_visible": true}'::jsonb),
  ('ceo.partner_b2b', 'Partner & B2B Decisions', 'Suggests partner packages, data products and enterprise opportunities.', 'b2b', 'locked', 'high', 0, false, true, false, '{"demo_visible": true}'::jsonb),
  ('ceo.risk_policy', 'Risk & Policy Decisions', 'Flags unsafe automation, compliance risks and trust-damaging monetization.', 'risk', 'locked', 'critical', 0, true, true, true, '{"demo_visible": true}'::jsonb)
ON CONFLICT (permission_key) DO NOTHING;

INSERT INTO public.admin_ai_agent_controls
  (agent_key, display_name, agent_type, description, status, automation_level, model_tier, daily_token_budget, daily_run_limit, schedule_label, requires_approval, can_write_to_user_surfaces, owner_role, input_sources, output_targets, escalation_rules, feature_flags, metadata)
VALUES
  ('ceo.governor', 'AI CEO Governor', 'executive', 'Top-level CEO brain that reads daily reports from concierge, directors, AI Brain, agent council and platform KPIs, then proposes company strategy.', 'paused', 'recommend_only', 'balanced', 90000, 2, 'Daily after all director reports', true, false, 'admin', '["admin_ai_daily_briefings","admin_ai_agent_daily_reports","admin_concierge_performance_daily","admin_ai_reports","get_platform_stats"]'::jsonb, '["admin_ai_ceo_reports","admin_ai_ceo_suggestions"]'::jsonb, '{"master_password_required_for_execution": true, "human_approval_required": true}'::jsonb, '{"demo_safe": true, "auto_learning": "distilled_reports_only"}'::jsonb, '{"division":"ceo","role":"governor"}'::jsonb),
  ('ceo.strategy-chief', 'Strategy Chief', 'executive_specialist', 'Finds ecosystem strategy, retention loops, new product lines and market positioning moves.', 'paused', 'recommend_only', 'balanced', 42000, 2, 'Daily strategic synthesis', true, false, 'admin', '["admin_ai_ceo_reports","admin_ai_recommendations","api_partners","data_packages"]'::jsonb, '["admin_ai_ceo_suggestions"]'::jsonb, '{"master_password_required_for_execution": true}'::jsonb, '{"demo_safe": true}'::jsonb, '{"division":"ceo","role":"strategy"}'::jsonb),
  ('ceo.customer-experience', 'Customer Experience Officer', 'executive_specialist', 'Improves user time-in-ecosystem, concierge quality, journey flow, friction and retention.', 'paused', 'recommend_only', 'balanced', 48000, 3, 'Daily CX scan', true, false, 'admin', '["admin_concierge_performance_daily","support_tickets","conversations","ai_usage_logs"]'::jsonb, '["admin_ai_ceo_suggestions"]'::jsonb, '{"master_password_required_for_execution": true}'::jsonb, '{"demo_safe": true}'::jsonb, '{"division":"ceo","role":"cx"}'::jsonb),
  ('ceo.profit-architect', 'Profit Architect', 'executive_specialist', 'Finds profitable monetization, token savings, margin leaks, pricing opportunities and B2B yield.', 'paused', 'recommend_only', 'speed', 32000, 4, 'Twice daily margin scan', true, false, 'admin', '["ai_usage_logs","affiliate_earnings","package_delivery_jobs","admin_ai_agent_daily_reports"]'::jsonb, '["admin_ai_ceo_suggestions"]'::jsonb, '{"master_password_required_for_execution": true}'::jsonb, '{"demo_safe": true}'::jsonb, '{"division":"ceo","role":"profit"}'::jsonb),
  ('ceo.product-inventor', 'Product Inventor', 'executive_specialist', 'Turns repeated demand from business travellers, expats, nomads and HNW users into new products or bundles.', 'paused', 'recommend_only', 'balanced', 36000, 2, 'Daily product opportunity scan', true, false, 'admin', '["conversations","admin_ai_insights","admin_ai_opportunities","support_tickets"]'::jsonb, '["admin_ai_ceo_suggestions"]'::jsonb, '{"master_password_required_for_execution": true}'::jsonb, '{"demo_safe": true}'::jsonb, '{"division":"ceo","role":"product"}'::jsonb),
  ('ceo.risk-counsel', 'Risk Counsel', 'executive_specialist', 'Blocks CEO recommendations that could harm user trust, privacy, compliance, safety or brand.', 'paused', 'recommend_only', 'balanced', 30000, 4, 'Before any CEO recommendation is promoted', true, false, 'admin', '["admin_ai_ceo_suggestions","staff_audit_log","support_tickets"]'::jsonb, '["admin_ai_ceo_suggestions"]'::jsonb, '{"veto_power":"recommendation_only", "master_password_required_for_execution": true}'::jsonb, '{"demo_safe": true}'::jsonb, '{"division":"ceo","role":"risk"}'::jsonb),
  ('ceo.learning-officer', 'Learning Officer', 'executive_specialist', 'Distills what worked into reusable operating principles without training on private user data directly.', 'paused', 'recommend_only', 'speed', 24000, 2, 'Daily learning distillation', true, false, 'admin', '["admin_ai_ceo_reports","admin_ai_agent_daily_reports","admin_concierge_performance_daily"]'::jsonb, '["admin_ai_ceo_reports"]'::jsonb, '{"privacy":"aggregate_only"}'::jsonb, '{"demo_safe": true}'::jsonb, '{"division":"ceo","role":"learning"}'::jsonb)
ON CONFLICT (agent_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  agent_type = EXCLUDED.agent_type,
  description = EXCLUDED.description,
  input_sources = EXCLUDED.input_sources,
  output_targets = EXCLUDED.output_targets,
  escalation_rules = EXCLUDED.escalation_rules,
  feature_flags = EXCLUDED.feature_flags,
  metadata = EXCLUDED.metadata,
  updated_at = now();

CREATE OR REPLACE FUNCTION public.get_ai_ceo_summary()
RETURNS TABLE(
  pending_suggestions bigint,
  critical_suggestions bigint,
  locked_permissions bigint,
  active_ceo_agents bigint,
  daily_token_budget bigint,
  latest_report_at timestamptz,
  latest_report_title text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*)::bigint FROM public.admin_ai_ceo_suggestions WHERE status = 'pending'),
    (SELECT count(*)::bigint FROM public.admin_ai_ceo_suggestions WHERE status = 'pending' AND priority IN ('urgent','critical')),
    (SELECT count(*)::bigint FROM public.admin_ai_ceo_permissions WHERE status = 'locked'),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_controls WHERE agent_key LIKE 'ceo.%' AND status = 'active'),
    (SELECT COALESCE(sum(daily_token_budget), 0)::bigint FROM public.admin_ai_agent_controls WHERE agent_key LIKE 'ceo.%'),
    (SELECT created_at FROM public.admin_ai_ceo_reports ORDER BY report_date DESC, created_at DESC LIMIT 1),
    (SELECT title FROM public.admin_ai_ceo_reports ORDER BY report_date DESC, created_at DESC LIMIT 1)
  WHERE public.has_staff_role(auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.update_admin_ai_ceo_permission(
  p_permission_key text,
  p_status text DEFAULT NULL,
  p_max_daily_actions integer DEFAULT NULL,
  p_requires_master_password boolean DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS public.admin_ai_ceo_permissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.admin_ai_ceo_permissions;
  v_before jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'admin_required';
  END IF;

  SELECT to_jsonb(p.*) INTO v_before
  FROM public.admin_ai_ceo_permissions p
  WHERE p.permission_key = p_permission_key;

  UPDATE public.admin_ai_ceo_permissions
  SET
    status = COALESCE(p_status, status),
    max_daily_actions = COALESCE(p_max_daily_actions, max_daily_actions),
    requires_master_password = COALESCE(p_requires_master_password, requires_master_password),
    metadata = COALESCE(p_metadata, metadata),
    updated_by = auth.uid(),
    updated_at = now()
  WHERE permission_key = p_permission_key
  RETURNING * INTO v_row;

  IF v_row.permission_key IS NULL THEN
    RAISE EXCEPTION 'permission_not_found';
  END IF;

  PERFORM public.log_staff_action(
    'ai_ceo.permission_updated',
    'admin_ai_ceo_permissions',
    p_permission_key,
    v_before,
    to_jsonb(v_row),
    '{}'::jsonb
  );

  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.decide_admin_ai_ceo_suggestion(
  p_suggestion_id uuid,
  p_status text,
  p_decision_note text DEFAULT NULL
)
RETURNS public.admin_ai_ceo_suggestions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.admin_ai_ceo_suggestions;
  v_before jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'admin_required';
  END IF;

  IF p_status NOT IN ('approved','rejected','pending') THEN
    RAISE EXCEPTION 'invalid_status';
  END IF;

  SELECT to_jsonb(s.*) INTO v_before
  FROM public.admin_ai_ceo_suggestions s
  WHERE s.id = p_suggestion_id;

  UPDATE public.admin_ai_ceo_suggestions
  SET status = p_status,
      decided_at = CASE WHEN p_status = 'pending' THEN NULL ELSE now() END,
      decided_by = CASE WHEN p_status = 'pending' THEN NULL ELSE auth.uid() END,
      decision_note = p_decision_note
  WHERE id = p_suggestion_id
  RETURNING * INTO v_row;

  IF v_row.id IS NULL THEN
    RAISE EXCEPTION 'suggestion_not_found';
  END IF;

  PERFORM public.log_staff_action(
    'ai_ceo.suggestion_decided',
    'admin_ai_ceo_suggestions',
    p_suggestion_id::text,
    v_before,
    to_jsonb(v_row),
    jsonb_build_object('status', p_status)
  );

  RETURN v_row;
END;
$$;