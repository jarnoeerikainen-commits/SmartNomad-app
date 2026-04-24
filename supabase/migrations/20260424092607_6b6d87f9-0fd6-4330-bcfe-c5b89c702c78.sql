-- ════════════════════════════════════════════════════════════════════
-- AI DIRECTOR ECOSYSTEM EXPANSION
-- Adds 7 new director roles, daily briefings, and approval workflow.
-- ════════════════════════════════════════════════════════════════════

-- 1. Extend director_role enum with 7 new roles
ALTER TYPE public.director_role ADD VALUE IF NOT EXISTS 'affiliate';
ALTER TYPE public.director_role ADD VALUE IF NOT EXISTS 'loyalty';
ALTER TYPE public.director_role ADD VALUE IF NOT EXISTS 'sponsorship';
ALTER TYPE public.director_role ADD VALUE IF NOT EXISTS 'b2b_sales';
ALTER TYPE public.director_role ADD VALUE IF NOT EXISTS 'pricing';
ALTER TYPE public.director_role ADD VALUE IF NOT EXISTS 'aviation';
ALTER TYPE public.director_role ADD VALUE IF NOT EXISTS 'happiness';

-- 2. Approval gating columns on opportunities
ALTER TABLE public.admin_ai_opportunities
  ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_by UUID,
  ADD COLUMN IF NOT EXISTS decision_note TEXT;

-- 3. Approval gating columns on recommendations (status/decided_at already exist)
ALTER TABLE public.admin_ai_recommendations
  ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN NOT NULL DEFAULT true;

-- 4. Daily briefings table
CREATE TABLE IF NOT EXISTS public.admin_ai_daily_briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  executive_summary TEXT NOT NULL,
  narrative TEXT,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  concerns JSONB NOT NULL DEFAULT '[]'::jsonb,
  director_rollup JSONB NOT NULL DEFAULT '{}'::jsonb,
  pending_approvals JSONB NOT NULL DEFAULT '[]'::jsonb,
  kpi_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_by_run_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT admin_ai_daily_briefings_date_unique UNIQUE (briefing_date)
);

ALTER TABLE public.admin_ai_daily_briefings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view daily briefings"
  ON public.admin_ai_daily_briefings FOR SELECT
  USING (public.has_staff_role(auth.uid()));

CREATE POLICY "Staff can insert daily briefings"
  ON public.admin_ai_daily_briefings FOR INSERT
  WITH CHECK (public.has_staff_role(auth.uid()));

CREATE POLICY "Staff can update daily briefings"
  ON public.admin_ai_daily_briefings FOR UPDATE
  USING (public.has_staff_role(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_admin_ai_daily_briefings_date
  ON public.admin_ai_daily_briefings (briefing_date DESC);

-- 5. Ecosystem summary RPC — used by the back-office dashboard
CREATE OR REPLACE FUNCTION public.get_directors_ecosystem_summary()
RETURNS TABLE (
  director TEXT,
  active_opportunities BIGINT,
  pending_approval BIGINT,
  approved_24h BIGINT,
  rejected_24h BIGINT,
  pushed_to_concierge BIGINT,
  pushed_to_sales BIGINT,
  last_run_at TIMESTAMPTZ,
  last_run_status TEXT,
  total_runs_7d BIGINT
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH director_list AS (
    SELECT unnest(ARRAY[
      'events','sports','vip',
      'affiliate','loyalty','sponsorship',
      'b2b_sales','pricing','aviation','happiness'
    ]::text[]) AS d
  )
  SELECT
    dl.d AS director,
    COALESCE(COUNT(o.id) FILTER (WHERE o.status = 'active'), 0)::bigint,
    COALESCE(COUNT(o.id) FILTER (WHERE o.status = 'active' AND o.requires_approval = true AND o.approved_at IS NULL AND o.rejected_at IS NULL), 0)::bigint,
    COALESCE(COUNT(o.id) FILTER (WHERE o.approved_at > now() - interval '24 hours'), 0)::bigint,
    COALESCE(COUNT(o.id) FILTER (WHERE o.rejected_at > now() - interval '24 hours'), 0)::bigint,
    COALESCE(COUNT(o.id) FILTER (WHERE o.pushed_to_concierge = true), 0)::bigint,
    COALESCE(COUNT(o.id) FILTER (WHERE o.pushed_to_sales = true), 0)::bigint,
    (SELECT MAX(r.started_at) FROM public.admin_ai_director_runs r WHERE r.director::text = dl.d),
    (SELECT r.status FROM public.admin_ai_director_runs r WHERE r.director::text = dl.d ORDER BY r.started_at DESC LIMIT 1),
    (SELECT COUNT(*)::bigint FROM public.admin_ai_director_runs r WHERE r.director::text = dl.d AND r.started_at > now() - interval '7 days')
  FROM director_list dl
  LEFT JOIN public.admin_ai_opportunities o ON o.director::text = dl.d
  WHERE public.has_staff_role(auth.uid())
  GROUP BY dl.d
  ORDER BY dl.d;
$$;

-- 6. Latest daily briefing helper
CREATE OR REPLACE FUNCTION public.get_latest_daily_briefing()
RETURNS public.admin_ai_daily_briefings
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM public.admin_ai_daily_briefings
  ORDER BY briefing_date DESC
  LIMIT 1;
$$;

-- 7. Approval helper (single call from UI)
CREATE OR REPLACE FUNCTION public.decide_opportunity(
  p_id UUID,
  p_approve BOOLEAN,
  p_note TEXT DEFAULT NULL,
  p_push_concierge BOOLEAN DEFAULT false,
  p_push_sales BOOLEAN DEFAULT false
)
RETURNS public.admin_ai_opportunities
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_row public.admin_ai_opportunities;
BEGIN
  IF NOT public.has_staff_role(auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  IF p_approve THEN
    UPDATE public.admin_ai_opportunities
       SET approved_at = now(),
           approved_by = auth.uid(),
           rejected_at = NULL,
           rejected_by = NULL,
           decision_note = p_note,
           pushed_to_concierge = COALESCE(pushed_to_concierge, false) OR p_push_concierge,
           pushed_to_sales = COALESCE(pushed_to_sales, false) OR p_push_sales
     WHERE id = p_id
     RETURNING * INTO v_row;
  ELSE
    UPDATE public.admin_ai_opportunities
       SET rejected_at = now(),
           rejected_by = auth.uid(),
           approved_at = NULL,
           approved_by = NULL,
           decision_note = p_note,
           status = 'rejected'
     WHERE id = p_id
     RETURNING * INTO v_row;
  END IF;

  PERFORM public.log_staff_action(
    CASE WHEN p_approve THEN 'director.opportunity_approved' ELSE 'director.opportunity_rejected' END,
    'opportunity',
    p_id::text,
    NULL,
    to_jsonb(v_row),
    jsonb_build_object('note', p_note, 'push_concierge', p_push_concierge, 'push_sales', p_push_sales)
  );

  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.decide_recommendation(
  p_id UUID,
  p_approve BOOLEAN,
  p_note TEXT DEFAULT NULL
)
RETURNS public.admin_ai_recommendations
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_row public.admin_ai_recommendations;
BEGIN
  IF NOT public.has_staff_role(auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  UPDATE public.admin_ai_recommendations
     SET status = CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END,
         decided_at = now(),
         decided_by = auth.uid(),
         decision_note = p_note
   WHERE id = p_id
   RETURNING * INTO v_row;

  PERFORM public.log_staff_action(
    CASE WHEN p_approve THEN 'director.recommendation_approved' ELSE 'director.recommendation_rejected' END,
    'recommendation',
    p_id::text,
    NULL,
    to_jsonb(v_row),
    jsonb_build_object('note', p_note)
  );

  RETURN v_row;
END;
$$;