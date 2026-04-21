-- 1. Add revocation columns
ALTER TABLE public.trust_pass_credentials
  ADD COLUMN IF NOT EXISTS revoked_at timestamptz,
  ADD COLUMN IF NOT EXISTS revocation_reason text;

-- 2. Unique constraint on credential_id (prevent dupes)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'trust_pass_credentials_credential_id_key'
  ) THEN
    ALTER TABLE public.trust_pass_credentials
      ADD CONSTRAINT trust_pass_credentials_credential_id_key UNIQUE (credential_id);
  END IF;
END $$;

-- 3. Performance indexes
CREATE INDEX IF NOT EXISTS idx_trust_pass_user_status
  ON public.trust_pass_credentials (user_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_trust_pass_device_status
  ON public.trust_pass_credentials (device_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_trust_pass_did
  ON public.trust_pass_credentials (did);

-- 4. Revoke helper (owner-only)
CREATE OR REPLACE FUNCTION public.revoke_trust_credential(
  p_credential_id text,
  p_reason text DEFAULT 'user_requested'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_device_id text;
BEGIN
  SELECT user_id, device_id INTO v_user_id, v_device_id
  FROM public.trust_pass_credentials
  WHERE credential_id = p_credential_id
  LIMIT 1;

  IF v_user_id IS NULL THEN RETURN false; END IF;

  -- Owner check (auth user OR matching device)
  IF NOT (
    (auth.uid() IS NOT NULL AND v_user_id = auth.uid())
    OR (auth.uid() IS NULL AND v_device_id = public.get_request_device_id())
  ) THEN
    RAISE EXCEPTION 'not authorized to revoke this credential';
  END IF;

  UPDATE public.trust_pass_credentials
  SET status = 'revoked',
      revoked_at = now(),
      revocation_reason = p_reason
  WHERE credential_id = p_credential_id;

  INSERT INTO public.audit_log (action, resource, device_id, user_id, metadata)
  VALUES (
    'trust_pass.credential_revoked',
    p_credential_id,
    COALESCE(v_device_id, ''),
    v_user_id,
    jsonb_build_object('reason', p_reason)
  );

  RETURN true;
END;
$$;

-- 5. Partner-safe view (no PII; aggregated tier signals by snomad_id)
CREATE OR REPLACE VIEW public.v_active_trust_credentials
WITH (security_invoker = true) AS
SELECT
  p.snomad_id,
  c.tier,
  c.credential_type,
  c.issuer,
  c.issued_at,
  c.expires_at,
  c.status
FROM public.trust_pass_credentials c
JOIN public.profiles p ON p.id = c.user_id
WHERE c.status = 'active'
  AND c.expires_at > now()
  AND p.snomad_id IS NOT NULL;

-- Restrict view to service_role only (partner endpoint uses service role)
REVOKE ALL ON public.v_active_trust_credentials FROM anon, authenticated;
GRANT SELECT ON public.v_active_trust_credentials TO service_role;

-- 6. Tier verification helper for partners (consent-gated)
CREATE OR REPLACE FUNCTION public.verify_trust_tier(
  p_snomad_id text,
  p_required_tier text,
  p_partner_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_actual_tier text;
  v_credential_count int;
  v_consent boolean;
  v_tier_order int;
  v_required_order int;
BEGIN
  SELECT id INTO v_user_id FROM public.profiles WHERE snomad_id = p_snomad_id;
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('verified', false, 'reason', 'unknown_subject');
  END IF;

  SELECT public.has_active_consent(v_user_id, 'trust_pass_verification', p_partner_id)
    INTO v_consent;
  IF NOT v_consent THEN
    RETURN jsonb_build_object('verified', false, 'reason', 'no_consent');
  END IF;

  SELECT COUNT(*) INTO v_credential_count
  FROM public.trust_pass_credentials
  WHERE user_id = v_user_id AND status = 'active' AND expires_at > now();

  -- Determine highest tier
  v_actual_tier := CASE
    WHEN v_credential_count >= 5 THEN 'sovereign'
    WHEN v_credential_count >= 3 THEN 'nomad'
    WHEN v_credential_count >= 1 THEN 'human'
    ELSE 'unverified'
  END;

  v_tier_order := CASE p_required_tier
    WHEN 'sovereign' THEN 3 WHEN 'nomad' THEN 2 WHEN 'human' THEN 1 ELSE 0
  END;
  v_required_order := CASE v_actual_tier
    WHEN 'sovereign' THEN 3 WHEN 'nomad' THEN 2 WHEN 'human' THEN 1 ELSE 0
  END;

  RETURN jsonb_build_object(
    'verified', v_required_order >= v_tier_order,
    'actual_tier', v_actual_tier,
    'required_tier', p_required_tier,
    'credential_count', v_credential_count,
    'verified_at', now()
  );
END;
$$;