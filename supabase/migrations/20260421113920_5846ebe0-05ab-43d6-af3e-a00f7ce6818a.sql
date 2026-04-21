-- Helper trigger function (idempotent — only created if missing)
CREATE OR REPLACE FUNCTION public.tg_oauth_connections_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'microsoft')),
  provider_email TEXT,
  scope TEXT,
  refresh_token TEXT,
  access_token_expires_at TIMESTAMPTZ,
  lookback_days INTEGER NOT NULL DEFAULT 90 CHECK (lookback_days BETWEEN 7 AND 730),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'error')),
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_oauth_connections_user
  ON public.oauth_connections(user_id);

ALTER TABLE public.oauth_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "oauth_connections_select_own" ON public.oauth_connections;
CREATE POLICY "oauth_connections_select_own"
  ON public.oauth_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "oauth_connections_update_own" ON public.oauth_connections;
CREATE POLICY "oauth_connections_update_own"
  ON public.oauth_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "oauth_connections_delete_own" ON public.oauth_connections;
CREATE POLICY "oauth_connections_delete_own"
  ON public.oauth_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "oauth_connections_service_all" ON public.oauth_connections;
CREATE POLICY "oauth_connections_service_all"
  ON public.oauth_connections FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP TRIGGER IF EXISTS oauth_connections_updated_at ON public.oauth_connections;
CREATE TRIGGER oauth_connections_updated_at
BEFORE UPDATE ON public.oauth_connections
FOR EACH ROW
EXECUTE FUNCTION public.tg_oauth_connections_updated_at();