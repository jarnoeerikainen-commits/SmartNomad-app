-- ═══════════════════════════════════════════════════════════════════
-- AI DIRECTORS: Events, Sports, VIP — 24/7 opportunity sourcing
-- ═══════════════════════════════════════════════════════════════════

-- Director enum
DO $$ BEGIN
  CREATE TYPE public.director_role AS ENUM ('events', 'sports', 'vip');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Opportunity table — every event / game / gala / vip happening
CREATE TABLE IF NOT EXISTS public.admin_ai_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  director public.director_role NOT NULL,
  category TEXT NOT NULL,                 -- 'concert','f1','motogp','nba','rugby_7s','gala','vip_party','art_fair','tennis','golf','soccer'...
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  city TEXT,
  country TEXT,
  venue TEXT,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  url TEXT,
  source TEXT,                            -- 'ai_synth','manual','api:ticketmaster','api:f1','api:atp'…
  popularity_score NUMERIC NOT NULL DEFAULT 0,    -- 0-100
  exclusivity_score NUMERIC NOT NULL DEFAULT 0,   -- 0-100 (vip-ness)
  est_audience INT,
  est_ticket_price_min NUMERIC,
  est_ticket_price_max NUMERIC,
  currency TEXT NOT NULL DEFAULT 'USD',
  vip_packages JSONB NOT NULL DEFAULT '[]'::jsonb,    -- [{name,price,perks[]}]
  sponsor_packages JSONB NOT NULL DEFAULT '[]'::jsonb,-- [{tier,price,deliverables[],target_companies[]}]
  concierge_offer JSONB NOT NULL DEFAULT '{}'::jsonb, -- {pitch,bundle:[ticket,flight,hotel,jet,car],upsell[]}
  sales_target_segments JSONB NOT NULL DEFAULT '[]'::jsonb, -- ['hnw_americas','tech_execs','ceo_eu']
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',  -- active | archived | sold_out | expired
  pushed_to_concierge BOOLEAN NOT NULL DEFAULT FALSE,
  pushed_to_sales BOOLEAN NOT NULL DEFAULT FALSE,
  source_run_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_aiops_director ON public.admin_ai_opportunities(director, status, start_at);
CREATE INDEX IF NOT EXISTS idx_aiops_category ON public.admin_ai_opportunities(category, start_at);
CREATE INDEX IF NOT EXISTS idx_aiops_created ON public.admin_ai_opportunities(created_at DESC);

-- Director run log
CREATE TABLE IF NOT EXISTS public.admin_ai_director_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  director public.director_role NOT NULL,
  trigger TEXT NOT NULL DEFAULT 'manual',  -- manual | cron | demo
  status TEXT NOT NULL DEFAULT 'running',  -- running|completed|failed
  scope TEXT NOT NULL DEFAULT 'sweep',     -- sweep|focused|deep
  model TEXT,
  opportunities_created INT NOT NULL DEFAULT 0,
  sponsor_packages_created INT NOT NULL DEFAULT 0,
  pushed_recommendations INT NOT NULL DEFAULT 0,
  input_tokens INT NOT NULL DEFAULT 0,
  output_tokens INT NOT NULL DEFAULT 0,
  latency_ms INT NOT NULL DEFAULT 0,
  error TEXT,
  notes JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_aidirruns_director ON public.admin_ai_director_runs(director, started_at DESC);

-- RLS
ALTER TABLE public.admin_ai_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_ai_director_runs ENABLE ROW LEVEL SECURITY;

-- Staff can see/manage everything
CREATE POLICY "Staff read opportunities"
  ON public.admin_ai_opportunities FOR SELECT
  USING (public.has_staff_role(auth.uid()));

CREATE POLICY "Staff manage opportunities"
  ON public.admin_ai_opportunities FOR ALL
  USING (public.has_staff_role(auth.uid()))
  WITH CHECK (public.has_staff_role(auth.uid()));

-- Concierge layer needs read access for active opps to power user-facing recommendations.
-- Authenticated users can read active, non-expired opportunities (no PII).
CREATE POLICY "Authenticated users read active opportunities"
  ON public.admin_ai_opportunities FOR SELECT
  TO authenticated
  USING (
    status = 'active'
    AND (expires_at IS NULL OR expires_at > now())
  );

-- Anonymous (demo) read for active opportunities (read-only marketing surface)
CREATE POLICY "Anon read active opportunities"
  ON public.admin_ai_opportunities FOR SELECT
  TO anon
  USING (
    status = 'active'
    AND (expires_at IS NULL OR expires_at > now())
  );

CREATE POLICY "Staff read director runs"
  ON public.admin_ai_director_runs FOR SELECT
  USING (public.has_staff_role(auth.uid()));

CREATE POLICY "Staff manage director runs"
  ON public.admin_ai_director_runs FOR ALL
  USING (public.has_staff_role(auth.uid()))
  WITH CHECK (public.has_staff_role(auth.uid()));

-- Helper RPC: dashboard summary per director
CREATE OR REPLACE FUNCTION public.get_directors_summary()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'events', jsonb_build_object(
      'opportunities_total', (SELECT COUNT(*) FROM admin_ai_opportunities WHERE director='events' AND status='active'),
      'opportunities_7d',    (SELECT COUNT(*) FROM admin_ai_opportunities WHERE director='events' AND created_at >= now() - interval '7 days'),
      'last_run',            (SELECT started_at FROM admin_ai_director_runs WHERE director='events' ORDER BY started_at DESC LIMIT 1)
    ),
    'sports', jsonb_build_object(
      'opportunities_total', (SELECT COUNT(*) FROM admin_ai_opportunities WHERE director='sports' AND status='active'),
      'opportunities_7d',    (SELECT COUNT(*) FROM admin_ai_opportunities WHERE director='sports' AND created_at >= now() - interval '7 days'),
      'last_run',            (SELECT started_at FROM admin_ai_director_runs WHERE director='sports' ORDER BY started_at DESC LIMIT 1)
    ),
    'vip', jsonb_build_object(
      'opportunities_total', (SELECT COUNT(*) FROM admin_ai_opportunities WHERE director='vip' AND status='active'),
      'opportunities_7d',    (SELECT COUNT(*) FROM admin_ai_opportunities WHERE director='vip' AND created_at >= now() - interval '7 days'),
      'last_run',            (SELECT started_at FROM admin_ai_director_runs WHERE director='vip' ORDER BY started_at DESC LIMIT 1)
    ),
    'totals', jsonb_build_object(
      'opportunities', (SELECT COUNT(*) FROM admin_ai_opportunities WHERE status='active'),
      'with_sponsor_packages', (SELECT COUNT(*) FROM admin_ai_opportunities WHERE status='active' AND jsonb_array_length(sponsor_packages) > 0),
      'pushed_to_concierge', (SELECT COUNT(*) FROM admin_ai_opportunities WHERE pushed_to_concierge),
      'pushed_to_sales', (SELECT COUNT(*) FROM admin_ai_opportunities WHERE pushed_to_sales)
    )
  ) INTO result;
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_directors_summary() TO authenticated, anon;