CREATE TABLE IF NOT EXISTS public.ai_execution_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_ref text NOT NULL,
  surface text NOT NULL,
  persona text NOT NULL DEFAULT 'Guest / Live user',
  user_alias text NOT NULL DEFAULT 'live_user_session',
  command text NOT NULL,
  primary_agent text NOT NULL,
  function_name text,
  status text NOT NULL DEFAULT 'running',
  route text NOT NULL,
  directors jsonb NOT NULL DEFAULT '[]'::jsonb,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  response_excerpt text,
  answer_agents jsonb NOT NULL DEFAULT '[]'::jsonb,
  answer_sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  websites jsonb NOT NULL DEFAULT '[]'::jsonb,
  verification_note text,
  confidence_policy text NOT NULL DEFAULT 'verified_only',
  model text,
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  latency_ms integer NOT NULL DEFAULT 0,
  cache_hit boolean NOT NULL DEFAULT false,
  estimated_cost_usd numeric(12,6) NOT NULL DEFAULT 0,
  proof_hash text NOT NULL,
  error text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_execution_proofs_status_check CHECK (status IN ('running','completed','failed')),
  CONSTRAINT ai_execution_proofs_confidence_policy_check CHECK (confidence_policy IN ('verified_only'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_execution_proofs_run_ref ON public.ai_execution_proofs(run_ref);
CREATE INDEX IF NOT EXISTS idx_ai_execution_proofs_created_at ON public.ai_execution_proofs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_execution_proofs_function_created ON public.ai_execution_proofs(function_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_execution_proofs_status_created ON public.ai_execution_proofs(status, created_at DESC);

ALTER TABLE public.ai_execution_proofs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view AI execution proofs" ON public.ai_execution_proofs;
CREATE POLICY "Staff can view AI execution proofs"
ON public.ai_execution_proofs
FOR SELECT
TO authenticated
USING (public.has_staff_role(auth.uid()));

DROP POLICY IF EXISTS "Service role can manage AI execution proofs" ON public.ai_execution_proofs;
CREATE POLICY "Service role can manage AI execution proofs"
ON public.ai_execution_proofs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP TRIGGER IF EXISTS update_ai_execution_proofs_updated_at ON public.ai_execution_proofs;
CREATE TRIGGER update_ai_execution_proofs_updated_at
BEFORE UPDATE ON public.ai_execution_proofs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.get_ai_execution_summary(p_since timestamptz DEFAULT now() - interval '7 days')
RETURNS TABLE(
  total_runs bigint,
  completed_runs bigint,
  failed_runs bigint,
  verified_runs bigint,
  total_tokens bigint,
  avg_latency_ms numeric,
  estimated_cost_usd numeric,
  cache_hit_rate numeric,
  models_used bigint,
  functions_used bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    count(*)::bigint,
    count(*) FILTER (WHERE status = 'completed')::bigint,
    count(*) FILTER (WHERE status = 'failed')::bigint,
    count(*) FILTER (WHERE confidence_policy = 'verified_only' AND error IS NULL)::bigint,
    COALESCE(sum(input_tokens + output_tokens), 0)::bigint,
    COALESCE(round(avg(NULLIF(latency_ms, 0))::numeric, 0), 0),
    COALESCE(round(sum(estimated_cost_usd), 6), 0),
    COALESCE(round((count(*) FILTER (WHERE cache_hit)::numeric / NULLIF(count(*), 0)) * 100, 1), 0),
    count(DISTINCT model)::bigint,
    count(DISTINCT function_name)::bigint
  FROM public.ai_execution_proofs
  WHERE created_at >= p_since
    AND public.has_staff_role(auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.get_ai_execution_daily(p_since timestamptz DEFAULT now() - interval '14 days')
RETURNS TABLE(
  day date,
  runs bigint,
  tokens bigint,
  estimated_cost_usd numeric,
  avg_latency_ms numeric,
  failures bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    date_trunc('day', created_at)::date,
    count(*)::bigint,
    COALESCE(sum(input_tokens + output_tokens), 0)::bigint,
    COALESCE(round(sum(estimated_cost_usd), 6), 0),
    COALESCE(round(avg(NULLIF(latency_ms, 0))::numeric, 0), 0),
    count(*) FILTER (WHERE status = 'failed')::bigint
  FROM public.ai_execution_proofs
  WHERE created_at >= p_since
    AND public.has_staff_role(auth.uid())
  GROUP BY 1
  ORDER BY 1;
$$;