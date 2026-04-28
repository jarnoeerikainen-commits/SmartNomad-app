CREATE OR REPLACE FUNCTION public.lock_completed_ai_execution_proofs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND OLD.immutable_locked = true
     AND COALESCE(auth.role(), '') <> 'service_role'
  THEN
    RAISE EXCEPTION 'ai_execution_proof_immutable';
  END IF;

  IF NEW.status IN ('completed','failed') THEN
    NEW.immutable_locked = true;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.lock_completed_ai_execution_proofs() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_ai_transparency_summary(timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_ai_execution_summary(timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_ai_execution_daily(timestamptz) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_ai_transparency_summary(timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_ai_execution_summary(timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_ai_execution_daily(timestamptz) TO authenticated;