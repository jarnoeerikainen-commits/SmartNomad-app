ALTER TABLE public.ai_execution_proofs
  ADD COLUMN IF NOT EXISTS request_category text NOT NULL DEFAULT 'general_ai',
  ADD COLUMN IF NOT EXISTS tools_actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS data_sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS confidence_status text NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS human_approval_state text NOT NULL DEFAULT 'not_required',
  ADD COLUMN IF NOT EXISTS human_approval_actor text,
  ADD COLUMN IF NOT EXISTS human_approval_at timestamptz,
  ADD COLUMN IF NOT EXISTS escalation_type text,
  ADD COLUMN IF NOT EXISTS escalation_reason text,
  ADD COLUMN IF NOT EXISTS retention_until timestamptz NOT NULL DEFAULT (now() + interval '6 years'),
  ADD COLUMN IF NOT EXISTS immutable_locked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS audit_schema_version integer NOT NULL DEFAULT 2;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ai_execution_proofs_confidence_status_check'
  ) THEN
    ALTER TABLE public.ai_execution_proofs
      ADD CONSTRAINT ai_execution_proofs_confidence_status_check
      CHECK (confidence_status IN ('verified','partially_verified','unverified','failed','escalated'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ai_execution_proofs_human_approval_state_check'
  ) THEN
    ALTER TABLE public.ai_execution_proofs
      ADD CONSTRAINT ai_execution_proofs_human_approval_state_check
      CHECK (human_approval_state IN ('not_required','pending','approved','denied','expired'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ai_execution_proofs_request_category_created
  ON public.ai_execution_proofs(request_category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_execution_proofs_confidence_created
  ON public.ai_execution_proofs(confidence_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_execution_proofs_approval_created
  ON public.ai_execution_proofs(human_approval_state, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_execution_proofs_retention_until
  ON public.ai_execution_proofs(retention_until);

CREATE OR REPLACE FUNCTION public.lock_completed_ai_execution_proofs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND OLD.immutable_locked = true
     AND current_user <> 'service_role'
  THEN
    RAISE EXCEPTION 'ai_execution_proof_immutable';
  END IF;

  IF NEW.status IN ('completed','failed') THEN
    NEW.immutable_locked = true;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lock_ai_execution_proofs_on_complete ON public.ai_execution_proofs;
CREATE TRIGGER lock_ai_execution_proofs_on_complete
BEFORE UPDATE ON public.ai_execution_proofs
FOR EACH ROW
EXECUTE FUNCTION public.lock_completed_ai_execution_proofs();

CREATE OR REPLACE FUNCTION public.get_ai_transparency_summary(p_since timestamptz DEFAULT now() - interval '30 days')
RETURNS TABLE(
  total_runs bigint,
  logged_completed bigint,
  failed_runs bigint,
  escalated_runs bigint,
  pending_human_approval bigint,
  approved_by_human bigint,
  denied_by_human bigint,
  verified_runs bigint,
  partially_verified_runs bigint,
  unverified_runs bigint,
  tools_recorded bigint,
  sources_recorded bigint,
  retention_covered bigint
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
    count(*) FILTER (WHERE confidence_status = 'escalated' OR escalation_type IS NOT NULL)::bigint,
    count(*) FILTER (WHERE human_approval_state = 'pending')::bigint,
    count(*) FILTER (WHERE human_approval_state = 'approved')::bigint,
    count(*) FILTER (WHERE human_approval_state = 'denied')::bigint,
    count(*) FILTER (WHERE confidence_status = 'verified')::bigint,
    count(*) FILTER (WHERE confidence_status = 'partially_verified')::bigint,
    count(*) FILTER (WHERE confidence_status = 'unverified')::bigint,
    count(*) FILTER (WHERE jsonb_array_length(tools_actions) > 0)::bigint,
    count(*) FILTER (WHERE jsonb_array_length(data_sources) > 0 OR jsonb_array_length(sources) > 0 OR jsonb_array_length(answer_sources) > 0)::bigint,
    count(*) FILTER (WHERE retention_until > now())::bigint
  FROM public.ai_execution_proofs
  WHERE created_at >= p_since
    AND public.has_staff_role(auth.uid());
$$;

CREATE OR REPLACE VIEW public.ai_transparency_audit_view AS
SELECT
  id,
  run_ref,
  created_at,
  completed_at,
  surface,
  route,
  function_name,
  primary_agent,
  request_category,
  status,
  model,
  tools_actions,
  data_sources,
  confidence_status,
  verification_note,
  response_excerpt,
  human_approval_state,
  human_approval_actor,
  human_approval_at,
  escalation_type,
  escalation_reason,
  error,
  proof_hash,
  retention_until,
  immutable_locked,
  audit_schema_version,
  input_tokens,
  output_tokens,
  latency_ms,
  estimated_cost_usd
FROM public.ai_execution_proofs;

ALTER VIEW public.ai_transparency_audit_view SET (security_invoker = true);

GRANT SELECT ON public.ai_transparency_audit_view TO authenticated;