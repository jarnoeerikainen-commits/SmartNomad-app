-- ═══════════════════════════════════════════════════════════════════════════
-- Production hardening: roles, app settings, Trust Pass persistence, audit log
-- All dual-mode RLS (device_id for guests, user_id for authenticated users).
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Roles enum + table + has_role() ────────────────────────────────────
CREATE TYPE public.app_role AS ENUM ('admin', 'premium', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ─── 2. App settings (single-row config) ───────────────────────────────────
CREATE TABLE public.app_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  demo_mode_enabled BOOLEAN NOT NULL DEFAULT true,
  require_auth BOOLEAN NOT NULL DEFAULT false,
  require_mfa_for_payments BOOLEAN NOT NULL DEFAULT false,
  require_mfa_for_sensitive BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.app_settings (id) VALUES (1);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read app settings"
  ON public.app_settings FOR SELECT TO public
  USING (true);

CREATE POLICY "Only admins can update app settings"
  ON public.app_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.is_demo_mode()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT demo_mode_enabled FROM public.app_settings WHERE id = 1), true)
$$;

CREATE OR REPLACE FUNCTION public.has_verified_mfa()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.mfa_factors
    WHERE user_id = auth.uid() AND status = 'verified'
  )
$$;

-- ─── 3. Trust Pass credentials (dual-mode) ─────────────────────────────────
CREATE TABLE public.trust_pass_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  did TEXT NOT NULL,
  credential_id TEXT NOT NULL,
  credential_type TEXT NOT NULL,
  tier TEXT NOT NULL,
  issuer TEXT NOT NULL,
  jwt TEXT NOT NULL,
  subject JSONB NOT NULL DEFAULT '{}'::jsonb,
  disclosed TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (device_id, credential_type)
);

CREATE INDEX idx_trust_pass_user ON public.trust_pass_credentials(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_trust_pass_device ON public.trust_pass_credentials(device_id);

ALTER TABLE public.trust_pass_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access own credentials"
  ON public.trust_pass_credentials FOR SELECT TO public
  USING (public.check_data_access(device_id, user_id));

CREATE POLICY "Insert own credentials"
  ON public.trust_pass_credentials FOR INSERT TO public
  WITH CHECK (
    CASE
      WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()
      ELSE device_id = public.get_request_device_id()
    END
  );

CREATE POLICY "Update own credentials"
  ON public.trust_pass_credentials FOR UPDATE TO public
  USING (public.check_data_access(device_id, user_id))
  WITH CHECK (public.check_data_access(device_id, user_id));

CREATE POLICY "Delete own credentials"
  ON public.trust_pass_credentials FOR DELETE TO public
  USING (public.check_data_access(device_id, user_id));

-- ─── 4. Audit log (append-only) ────────────────────────────────────────────
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user ON public.audit_log(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX idx_audit_device ON public.audit_log(device_id, created_at DESC);
CREATE INDEX idx_audit_action ON public.audit_log(action, created_at DESC);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read own audit log"
  ON public.audit_log FOR SELECT TO public
  USING (public.check_data_access(device_id, user_id));

CREATE POLICY "Insert own audit entries"
  ON public.audit_log FOR INSERT TO public
  WITH CHECK (
    CASE
      WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()
      ELSE device_id = public.get_request_device_id()
    END
  );

-- ─── 5. Migration bridge: also migrate trust_pass + audit_log ──────────────
CREATE OR REPLACE FUNCTION public.migrate_device_to_user(p_device_id TEXT, p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB := '{}'::jsonb;
  cnt INTEGER;
BEGIN
  UPDATE public.profiles SET device_id = p_device_id WHERE id = p_user_id AND device_id IS NULL;

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

  -- Auto-grant default 'user' role on first sign-in (no-op if exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN result;
END;
$$;