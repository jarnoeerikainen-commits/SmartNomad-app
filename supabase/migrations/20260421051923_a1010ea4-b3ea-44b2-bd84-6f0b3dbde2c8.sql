
-- ============================================================
-- B2B / GDPR Foundation Migration
-- Snomad ID (pseudonymous), Consent Ledger, Partner Data Requests
-- ============================================================

-- 1. SNOMAD ID -----------------------------------------------
-- Public-facing pseudonymous identifier. Format: SN-XXXX-XXXX-XXXX
-- ~60 bits entropy, base32 (Crockford-style, no I/L/O/U).

CREATE OR REPLACE FUNCTION public.generate_snomad_id()
RETURNS text
LANGUAGE plpgsql
VOLATILE
SET search_path = public
AS $$
DECLARE
  alphabet text := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  result text := 'SN';
  i int;
  group_idx int;
BEGIN
  FOR group_idx IN 1..3 LOOP
    result := result || '-';
    FOR i IN 1..4 LOOP
      result := result || substr(alphabet, 1 + floor(random() * 32)::int, 1);
    END LOOP;
  END LOOP;
  RETURN result;
END;
$$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS snomad_id text UNIQUE;

CREATE INDEX IF NOT EXISTS idx_profiles_snomad_id ON public.profiles(snomad_id);

-- Backfill any existing rows
DO $$
DECLARE
  r record;
  new_id text;
  attempts int;
BEGIN
  FOR r IN SELECT id FROM public.profiles WHERE snomad_id IS NULL LOOP
    attempts := 0;
    LOOP
      new_id := public.generate_snomad_id();
      BEGIN
        UPDATE public.profiles SET snomad_id = new_id WHERE id = r.id;
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        attempts := attempts + 1;
        IF attempts > 5 THEN RAISE; END IF;
      END;
    END LOOP;
  END LOOP;
END $$;

-- Trigger to assign snomad_id on insert
CREATE OR REPLACE FUNCTION public.assign_snomad_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id text;
  attempts int := 0;
BEGIN
  IF NEW.snomad_id IS NULL THEN
    LOOP
      new_id := public.generate_snomad_id();
      BEGIN
        NEW.snomad_id := new_id;
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        attempts := attempts + 1;
        IF attempts > 5 THEN RAISE EXCEPTION 'Could not generate unique snomad_id'; END IF;
      END;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_snomad_id ON public.profiles;
CREATE TRIGGER trg_assign_snomad_id
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_snomad_id();

-- Helper to look up auth.uid() -> snomad_id
CREATE OR REPLACE FUNCTION public.get_my_snomad_id()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT snomad_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Reverse lookup is admin-only (audit-logged via app)
CREATE OR REPLACE FUNCTION public.resolve_snomad_id(p_snomad_id text)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles
  WHERE snomad_id = p_snomad_id
    AND public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

-- 2. CONSENT LEDGER ------------------------------------------
-- Append-only, GDPR Art. 7. Each row = one consent decision.

CREATE TABLE IF NOT EXISTS public.consent_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  snomad_id text NOT NULL,
  purpose text NOT NULL,                  -- e.g. 'partner_offers.insurance', 'analytics.aggregate'
  partner_id uuid,                        -- optional, ref api_partners
  granted boolean NOT NULL,
  consent_text_version text NOT NULL,     -- e.g. 'v1.2-2026-04-21'
  consent_text_hash text NOT NULL,        -- sha256 of full consent text shown
  ip_address text,
  user_agent text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz                  -- optional auto-expiry
);

CREATE INDEX IF NOT EXISTS idx_consent_user ON public.consent_ledger(user_id, purpose, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consent_snomad ON public.consent_ledger(snomad_id, purpose);
CREATE INDEX IF NOT EXISTS idx_consent_partner ON public.consent_ledger(partner_id) WHERE partner_id IS NOT NULL;

ALTER TABLE public.consent_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own consent history"
  ON public.consent_ledger FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own consent decisions"
  ON public.consent_ledger FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND snomad_id = public.get_my_snomad_id());

CREATE POLICY "Service role reads all consent"
  ON public.consent_ledger FOR SELECT TO service_role
  USING (true);

CREATE POLICY "Service role inserts consent"
  ON public.consent_ledger FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Admins read all consent"
  ON public.consent_ledger FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Helper: most recent consent decision per (user, purpose, partner)
CREATE OR REPLACE FUNCTION public.has_active_consent(
  p_user_id uuid,
  p_purpose text,
  p_partner_id uuid DEFAULT NULL
) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT granted FROM public.consent_ledger
     WHERE user_id = p_user_id
       AND purpose = p_purpose
       AND (p_partner_id IS NULL OR partner_id = p_partner_id OR partner_id IS NULL)
       AND (expires_at IS NULL OR expires_at > now())
     ORDER BY created_at DESC LIMIT 1),
    false
  );
$$;

-- 3. DATA ACCESS REQUESTS (B2B partner queries) --------------
-- Every partner API hit that touches user data is logged here.

CREATE TABLE IF NOT EXISTS public.data_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  snomad_id text,                         -- pseudonymous subject (NULL for aggregate)
  resource_type text NOT NULL,            -- 'profile', 'preferences', 'travel_history', 'aggregate'
  fields_requested text[] NOT NULL DEFAULT '{}',
  fields_returned text[] NOT NULL DEFAULT '{}',
  consent_verified boolean NOT NULL DEFAULT false,
  consent_id uuid REFERENCES public.consent_ledger(id),
  records_count int NOT NULL DEFAULT 0,
  purpose text NOT NULL,
  legal_basis text NOT NULL,              -- 'consent','contract','legitimate_interest','anonymized'
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dar_partner ON public.data_access_requests(partner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dar_snomad ON public.data_access_requests(snomad_id) WHERE snomad_id IS NOT NULL;

ALTER TABLE public.data_access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read all data access requests"
  ON public.data_access_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users read requests touching their data"
  ON public.data_access_requests FOR SELECT TO authenticated
  USING (snomad_id = public.get_my_snomad_id());

CREATE POLICY "Service role inserts data access requests"
  ON public.data_access_requests FOR INSERT TO service_role
  WITH CHECK (true);

-- 4. PARTNER-SAFE PSEUDONYMIZED VIEW -------------------------
-- Returns ONLY snomad_id + non-PII preference signals.
-- Edge function further filters by partner consent + access policy.

CREATE OR REPLACE VIEW public.v_partner_profile_signals AS
SELECT
  p.snomad_id,
  sp.preferences->'travel'->>'style' AS travel_style,
  sp.preferences->'professional'->>'industry' AS industry,
  sp.preferences->'professional'->>'income_bracket' AS income_bracket,
  sp.preferences->'travel'->>'budget_tier' AS budget_tier,
  sp.preferences->'lifestyle'->>'age_bracket' AS age_bracket,
  sp.completeness_score,
  sp.preference_count,
  sp.updated_at
FROM public.profiles p
LEFT JOIN public.snomad_profiles sp ON sp.user_id = p.id
WHERE p.snomad_id IS NOT NULL;

REVOKE ALL ON public.v_partner_profile_signals FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.v_partner_profile_signals TO service_role;

-- 5. BACKFILL profiles for existing auth users that lack one --
INSERT INTO public.profiles (id, email)
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 6. UPDATE handle_new_user to also seed snomad_id (trigger does it, but be explicit)
-- existing handle_new_user already inserts profile; trigger assign_snomad_id fires.

-- 7. EXTEND migrate_device_to_user to ensure snomad_id exists
CREATE OR REPLACE FUNCTION public.migrate_device_to_user(p_device_id text, p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result JSONB := '{}'::jsonb;
  cnt INTEGER;
BEGIN
  UPDATE public.profiles SET device_id = p_device_id WHERE id = p_user_id AND device_id IS NULL;

  -- Ensure snomad_id exists (defensive — trigger should have set it)
  UPDATE public.profiles
  SET snomad_id = public.generate_snomad_id()
  WHERE id = p_user_id AND snomad_id IS NULL;

  UPDATE public.ai_usage_logs SET user_id = p_user_id WHERE device_id = p_device_id AND user_id IS NULL;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  result := result || jsonb_build_object('ai_usage_logs', cnt);

  UPDATE public.travel_history SET user_id = p_user_id WHERE device_id = p_device_id AND user_id IS NULL;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  result := result || jsonb_build_object('travel_history', cnt);

  UPDATE public.snomad_profiles SET user_id = p_user_id WHERE device_id = p_device_id AND user_id IS NULL;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  result := result || jsonb_build_object('snomad_profiles', cnt);

  UPDATE public.device_sessions SET user_id = p_user_id WHERE device_id = p_device_id AND user_id IS NULL;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  result := result || jsonb_build_object('device_sessions', cnt);

  UPDATE public.knowledge_graph_edges SET user_id = p_user_id WHERE device_id = p_device_id AND user_id IS NULL;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  result := result || jsonb_build_object('knowledge_graph_edges', cnt);

  UPDATE public.ai_memories SET user_id = p_user_id WHERE device_id = p_device_id AND user_id IS NULL;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  result := result || jsonb_build_object('ai_memories', cnt);

  UPDATE public.conversations SET user_id = p_user_id WHERE device_id = p_device_id AND user_id IS NULL;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  result := result || jsonb_build_object('conversations', cnt);

  UPDATE public.trust_pass_credentials SET user_id = p_user_id WHERE device_id = p_device_id AND user_id IS NULL;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  result := result || jsonb_build_object('trust_pass_credentials', cnt);

  UPDATE public.audit_log SET user_id = p_user_id WHERE device_id = p_device_id AND user_id IS NULL;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  result := result || jsonb_build_object('audit_log', cnt);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN result;
END;
$function$;
