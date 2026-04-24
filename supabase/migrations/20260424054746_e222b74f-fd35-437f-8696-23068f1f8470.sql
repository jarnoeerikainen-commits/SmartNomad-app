-- ============================================================================
-- SECURITY HARDENING — Pen-test pass 3 (24 Apr 2026)
-- ============================================================================

-- FIX #1 — Demo-org PII restricted to authenticated callers
DROP POLICY IF EXISTS "anyone reads demo org members" ON public.organization_members;
DROP POLICY IF EXISTS "anyone reads demo org trips"   ON public.business_trips;
DROP POLICY IF EXISTS "anyone reads demo org expenses" ON public.business_trip_expenses;

CREATE POLICY "auth users read demo org members"
  ON public.organization_members FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.organizations o
                 WHERE o.id = organization_members.organization_id AND o.demo = true));

CREATE POLICY "auth users read demo org trips"
  ON public.business_trips FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.organizations o
                 WHERE o.id = business_trips.organization_id AND o.demo = true));

CREATE POLICY "auth users read demo org expenses"
  ON public.business_trip_expenses FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.organizations o
                 WHERE o.id = business_trip_expenses.organization_id AND o.demo = true));

-- FIX #2 — Expense tables: require real auth, block x-device-id spoofing
DROP POLICY IF EXISTS expenses_owner_all      ON public.expenses;
DROP POLICY IF EXISTS trips_owner_all         ON public.expense_trips;
DROP POLICY IF EXISTS receipts_owner_all      ON public.expense_receipts;
DROP POLICY IF EXISTS audit_owner_read        ON public.expense_audit_log;
DROP POLICY IF EXISTS audit_owner_insert      ON public.expense_audit_log;
DROP POLICY IF EXISTS terms_owner_read        ON public.expense_terms_acceptance;
DROP POLICY IF EXISTS terms_owner_insert      ON public.expense_terms_acceptance;

CREATE POLICY expenses_owner_all ON public.expenses
  FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY trips_owner_all ON public.expense_trips
  FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY receipts_owner_all ON public.expense_receipts
  FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY audit_owner_read ON public.expense_audit_log
  FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY audit_owner_insert ON public.expense_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY terms_owner_read ON public.expense_terms_acceptance
  FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY terms_owner_insert ON public.expense_terms_acceptance
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Service role retains full access for edge functions
CREATE POLICY expenses_service_all ON public.expenses
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY trips_service_all ON public.expense_trips
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY receipts_service_all ON public.expense_receipts
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY audit_service_all ON public.expense_audit_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY terms_service_all ON public.expense_terms_acceptance
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- FIX #3 — Support tickets: drop anon device-id branch
DROP POLICY IF EXISTS "Guests read tickets by device"   ON public.support_tickets;
DROP POLICY IF EXISTS "Guests create tickets by device" ON public.support_tickets;

-- FIX #5 — Per-user scoping for AI cache
ALTER TABLE public.ai_cache
  ADD COLUMN IF NOT EXISTS user_scope text NOT NULL DEFAULT 'global';

CREATE INDEX IF NOT EXISTS idx_ai_cache_scope_key
  ON public.ai_cache (user_scope, cache_key);

COMMENT ON COLUMN public.ai_cache.user_scope IS
  'Either ''global'' (safe to share across users) or a per-user/device hash. Edge functions MUST scope cache lookups by this column.';

-- FIX #4 — OAuth refresh token encryption migration path
ALTER TABLE public.oauth_connections
  ADD COLUMN IF NOT EXISTS encrypted_refresh_token text,
  ADD COLUMN IF NOT EXISTS encryption_version smallint NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.oauth_connections.refresh_token IS
  'DEPRECATED — plaintext. Will be wiped once encrypted_refresh_token is populated by the oauth-refresh edge function. Do NOT read from client.';
COMMENT ON COLUMN public.oauth_connections.encrypted_refresh_token IS
  'AES-256-GCM ciphertext (base64). Decrypt only inside edge function with OAUTH_TOKEN_KEY secret.';

-- Safe view: hides token values entirely from client
CREATE OR REPLACE VIEW public.oauth_connections_safe
WITH (security_invoker = true)
AS
SELECT
  id, user_id, provider, provider_email, scope, status,
  access_token_expires_at, last_synced_at, lookback_days,
  created_at, updated_at,
  (refresh_token IS NOT NULL OR encrypted_refresh_token IS NOT NULL) AS has_refresh_token
FROM public.oauth_connections;

GRANT SELECT ON public.oauth_connections_safe TO authenticated;