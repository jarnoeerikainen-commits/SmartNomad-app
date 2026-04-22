-- ═══════════════════════════════════════════════════════════
-- ADMIN AI BRAIN — 24/7 Intelligence Layer for Back Office
-- ═══════════════════════════════════════════════════════════

-- ─── 1. Insights (continuous findings) ────────────────────
CREATE TABLE IF NOT EXISTS public.admin_ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN (
    'anomaly','pattern','opportunity','risk','behavior','revenue','engagement','concierge_quality','churn_signal','growth'
  )),
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info','low','medium','high','critical')),
  confidence numeric(3,2) NOT NULL DEFAULT 0.75 CHECK (confidence >= 0 AND confidence <= 1),
  title text NOT NULL,
  summary text NOT NULL,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  metric_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  affected_count integer DEFAULT 0,
  source_run_id uuid,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','acknowledged','resolved','dismissed')),
  acknowledged_by uuid,
  acknowledged_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_ai_insights_status_created ON public.admin_ai_insights(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_ai_insights_severity ON public.admin_ai_insights(severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_ai_insights_category ON public.admin_ai_insights(category, created_at DESC);

-- ─── 2. Reports (timeframe rollups) ───────────────────────
CREATE TABLE IF NOT EXISTS public.admin_ai_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timeframe text NOT NULL CHECK (timeframe IN ('hourly','daily','weekly','monthly','on_demand')),
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  title text NOT NULL,
  executive_summary text NOT NULL,
  narrative text,
  kpi_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  concerns jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  generated_by_run_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_ai_reports_timeframe ON public.admin_ai_reports(timeframe, period_end DESC);

-- ─── 3. Recommendations (actionable for admins) ───────────
CREATE TABLE IF NOT EXISTS public.admin_ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN (
    'new_order','concierge_tweak','user_nurture','churn_save','pricing_change','feature_promote','content_publish','staff_action','cost_optimization'
  )),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  confidence numeric(3,2) NOT NULL DEFAULT 0.7 CHECK (confidence >= 0 AND confidence <= 1),
  title text NOT NULL,
  rationale text NOT NULL,
  suggested_action text NOT NULL,
  expected_impact text,
  target_segment jsonb DEFAULT '{}'::jsonb,
  evidence jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','dismissed','snoozed','executed')),
  decided_by uuid,
  decided_at timestamptz,
  decision_note text,
  source_insight_id uuid REFERENCES public.admin_ai_insights(id) ON DELETE SET NULL,
  source_run_id uuid,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_ai_recs_status_priority ON public.admin_ai_recommendations(status, priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_ai_recs_kind ON public.admin_ai_recommendations(kind, created_at DESC);

-- ─── 4. Brain runs (transparency / cost) ──────────────────
CREATE TABLE IF NOT EXISTS public.admin_ai_brain_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger text NOT NULL DEFAULT 'manual' CHECK (trigger IN ('manual','cron','event','startup')),
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running','completed','failed','partial')),
  scope text NOT NULL DEFAULT 'full' CHECK (scope IN ('full','quick','focused')),
  signals_scanned jsonb NOT NULL DEFAULT '{}'::jsonb,
  insights_created integer DEFAULT 0,
  recommendations_created integer DEFAULT 0,
  reports_created integer DEFAULT 0,
  model text,
  input_tokens integer DEFAULT 0,
  output_tokens integer DEFAULT 0,
  latency_ms integer DEFAULT 0,
  error text,
  triggered_by uuid,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_admin_ai_brain_runs_started ON public.admin_ai_brain_runs(started_at DESC);

-- ─── RLS: staff-only ──────────────────────────────────────
ALTER TABLE public.admin_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_ai_brain_runs ENABLE ROW LEVEL SECURITY;

-- Staff can read everything
CREATE POLICY "Staff read insights" ON public.admin_ai_insights
  FOR SELECT TO authenticated USING (public.has_staff_role(auth.uid()));
CREATE POLICY "Staff read reports" ON public.admin_ai_reports
  FOR SELECT TO authenticated USING (public.has_staff_role(auth.uid()));
CREATE POLICY "Staff read recommendations" ON public.admin_ai_recommendations
  FOR SELECT TO authenticated USING (public.has_staff_role(auth.uid()));
CREATE POLICY "Staff read brain runs" ON public.admin_ai_brain_runs
  FOR SELECT TO authenticated USING (public.has_staff_role(auth.uid()));

-- Admin + support can update insight/recommendation status
CREATE POLICY "Admin/support update insights" ON public.admin_ai_insights
  FOR UPDATE TO authenticated USING (public.has_admin_or_support(auth.uid()));
CREATE POLICY "Admin/support update recommendations" ON public.admin_ai_recommendations
  FOR UPDATE TO authenticated USING (public.has_admin_or_support(auth.uid()));

-- Inserts come from the edge function (service role) — no client INSERT policy needed.

-- ─── Helper: latest report for timeframe ──────────────────
CREATE OR REPLACE FUNCTION public.get_latest_admin_report(p_timeframe text DEFAULT 'daily')
RETURNS public.admin_ai_reports
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM public.admin_ai_reports
  WHERE timeframe = p_timeframe
  ORDER BY period_end DESC
  LIMIT 1;
$$;

-- ─── Helper: brain dashboard summary ──────────────────────
CREATE OR REPLACE FUNCTION public.get_admin_brain_summary()
RETURNS TABLE(
  open_insights bigint,
  critical_insights bigint,
  pending_recommendations bigint,
  urgent_recommendations bigint,
  last_run_at timestamptz,
  last_run_status text,
  reports_last_30d bigint
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    (SELECT count(*)::bigint FROM public.admin_ai_insights WHERE status = 'open'),
    (SELECT count(*)::bigint FROM public.admin_ai_insights WHERE status = 'open' AND severity = 'critical'),
    (SELECT count(*)::bigint FROM public.admin_ai_recommendations WHERE status = 'pending'),
    (SELECT count(*)::bigint FROM public.admin_ai_recommendations WHERE status = 'pending' AND priority = 'urgent'),
    (SELECT max(started_at) FROM public.admin_ai_brain_runs),
    (SELECT status FROM public.admin_ai_brain_runs ORDER BY started_at DESC LIMIT 1),
    (SELECT count(*)::bigint FROM public.admin_ai_reports WHERE created_at > now() - interval '30 days')
  WHERE public.has_staff_role(auth.uid());
$$;