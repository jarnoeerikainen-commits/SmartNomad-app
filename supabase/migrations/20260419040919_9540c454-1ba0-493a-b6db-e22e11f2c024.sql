-- ============================================================
-- SECURITY HARDENING MIGRATION
-- Fixes: spoofable device-id RLS, public ai_cache, extension in public
-- ============================================================

-- 1) Lock down ai_cache: only service role (edge functions) can read/write
DROP POLICY IF EXISTS "Public can read cache" ON public.ai_cache;
DROP POLICY IF EXISTS "Public can insert cache" ON public.ai_cache;

CREATE POLICY "Service role manages cache"
  ON public.ai_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2) Replace spoofable device-id RLS with auth-required policies
-- The check_data_access() function trusts a client header (x-device-id),
-- which is attacker-controlled. We require auth.uid() for sensitive tables.
-- Pre-auth users keep using localStorage; on sign-in, migrate_device_to_user
-- promotes any prior device rows to the user.

-- Helper: a stricter access check that requires authentication
CREATE OR REPLACE FUNCTION public.user_owns_row(row_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND row_user_id = auth.uid();
$$;

-- ---- snomad_profiles (encrypted identity & documents) ----
DROP POLICY IF EXISTS "Access own snomad profile" ON public.snomad_profiles;
DROP POLICY IF EXISTS "Insert own snomad profile" ON public.snomad_profiles;
DROP POLICY IF EXISTS "Update own snomad profile" ON public.snomad_profiles;

CREATE POLICY "Auth users read own snomad profile"
  ON public.snomad_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Auth users insert own snomad profile"
  ON public.snomad_profiles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users update own snomad profile"
  ON public.snomad_profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---- trust_pass_credentials (raw JWTs, identity subject) ----
DROP POLICY IF EXISTS "Access own credentials" ON public.trust_pass_credentials;
DROP POLICY IF EXISTS "Insert own credentials" ON public.trust_pass_credentials;
DROP POLICY IF EXISTS "Update own credentials" ON public.trust_pass_credentials;
DROP POLICY IF EXISTS "Delete own credentials" ON public.trust_pass_credentials;

CREATE POLICY "Auth users read own credentials"
  ON public.trust_pass_credentials FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Auth users insert own credentials"
  ON public.trust_pass_credentials FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users update own credentials"
  ON public.trust_pass_credentials FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users delete own credentials"
  ON public.trust_pass_credentials FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ---- audit_log (security events) ----
DROP POLICY IF EXISTS "Read own audit log" ON public.audit_log;
DROP POLICY IF EXISTS "Insert own audit entries" ON public.audit_log;

CREATE POLICY "Auth users read own audit log"
  ON public.audit_log FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Auth users insert own audit entries"
  ON public.audit_log FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Service role inserts audit entries"
  ON public.audit_log FOR INSERT TO service_role
  WITH CHECK (true);

-- ---- ai_memories ----
DROP POLICY IF EXISTS "Access own memories" ON public.ai_memories;
DROP POLICY IF EXISTS "Insert own memories" ON public.ai_memories;
DROP POLICY IF EXISTS "Update own memories" ON public.ai_memories;
DROP POLICY IF EXISTS "Delete own memories" ON public.ai_memories;

CREATE POLICY "Auth users read own memories"
  ON public.ai_memories FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Auth users insert own memories"
  ON public.ai_memories FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users update own memories"
  ON public.ai_memories FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users delete own memories"
  ON public.ai_memories FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ---- conversations ----
DROP POLICY IF EXISTS "Access own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Insert own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Update own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Delete own conversations" ON public.conversations;

CREATE POLICY "Auth users read own conversations"
  ON public.conversations FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Auth users insert own conversations"
  ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users update own conversations"
  ON public.conversations FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users delete own conversations"
  ON public.conversations FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ---- chat_messages ----
DROP POLICY IF EXISTS "Access own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Insert own chat messages" ON public.chat_messages;

CREATE POLICY "Auth users read own chat messages"
  ON public.chat_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.conversations c
                 WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()));
CREATE POLICY "Auth users insert own chat messages"
  ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.conversations c
                      WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()));

-- ---- conversation_summaries ----
DROP POLICY IF EXISTS "Access own summaries" ON public.conversation_summaries;
DROP POLICY IF EXISTS "Insert own summaries" ON public.conversation_summaries;

CREATE POLICY "Auth users read own summaries"
  ON public.conversation_summaries FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.conversations c
                 WHERE c.id = conversation_summaries.conversation_id AND c.user_id = auth.uid()));
CREATE POLICY "Auth users insert own summaries"
  ON public.conversation_summaries FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.conversations c
                      WHERE c.id = conversation_summaries.conversation_id AND c.user_id = auth.uid()));

-- ---- travel_history ----
DROP POLICY IF EXISTS "Access own travel" ON public.travel_history;
DROP POLICY IF EXISTS "Insert own travel" ON public.travel_history;
DROP POLICY IF EXISTS "Update own travel" ON public.travel_history;
DROP POLICY IF EXISTS "Delete own travel" ON public.travel_history;

CREATE POLICY "Auth users read own travel"
  ON public.travel_history FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Auth users insert own travel"
  ON public.travel_history FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users update own travel"
  ON public.travel_history FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users delete own travel"
  ON public.travel_history FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ---- knowledge_graph_edges ----
DROP POLICY IF EXISTS "Access own edges" ON public.knowledge_graph_edges;
DROP POLICY IF EXISTS "Insert own edges" ON public.knowledge_graph_edges;
DROP POLICY IF EXISTS "Update own edges" ON public.knowledge_graph_edges;
DROP POLICY IF EXISTS "Delete own edges" ON public.knowledge_graph_edges;

CREATE POLICY "Auth users read own edges"
  ON public.knowledge_graph_edges FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Auth users insert own edges"
  ON public.knowledge_graph_edges FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users update own edges"
  ON public.knowledge_graph_edges FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users delete own edges"
  ON public.knowledge_graph_edges FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ---- ai_usage_logs ----
DROP POLICY IF EXISTS "Access own logs" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Insert own logs" ON public.ai_usage_logs;

CREATE POLICY "Auth users read own logs"
  ON public.ai_usage_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Service role inserts logs"
  ON public.ai_usage_logs FOR INSERT TO service_role
  WITH CHECK (true);

-- ---- device_sessions ----
DROP POLICY IF EXISTS "Access own session" ON public.device_sessions;
DROP POLICY IF EXISTS "Insert own session" ON public.device_sessions;
DROP POLICY IF EXISTS "Update own session" ON public.device_sessions;

CREATE POLICY "Auth users read own session"
  ON public.device_sessions FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Auth users insert own session"
  ON public.device_sessions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Auth users update own session"
  ON public.device_sessions FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 3) Move vector extension out of public schema
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION vector SET SCHEMA extensions;