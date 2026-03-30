
-- Drop all overly permissive "Allow all" policies
DROP POLICY IF EXISTS "Allow all for ai_memories" ON public.ai_memories;
DROP POLICY IF EXISTS "Allow all for conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow all for chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow all for device_sessions" ON public.device_sessions;
DROP POLICY IF EXISTS "Allow all for travel_history" ON public.travel_history;
DROP POLICY IF EXISTS "Allow all for snomad_profiles" ON public.snomad_profiles;
DROP POLICY IF EXISTS "Allow all for knowledge_graph_edges" ON public.knowledge_graph_edges;
DROP POLICY IF EXISTS "Allow all for ai_usage_logs" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Allow all for ai_cache" ON public.ai_cache;
DROP POLICY IF EXISTS "Allow all for conversation_summaries" ON public.conversation_summaries;

-- Create a helper function to get device_id from request header
CREATE OR REPLACE FUNCTION public.get_request_device_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    current_setting('request.headers', true)::json->>'x-device-id',
    ''
  );
$$;

-- ai_memories: device_id scoped (sensitive personal data)
CREATE POLICY "Device can read own memories" ON public.ai_memories
  FOR SELECT TO public USING (device_id = public.get_request_device_id());
CREATE POLICY "Device can insert own memories" ON public.ai_memories
  FOR INSERT TO public WITH CHECK (device_id = public.get_request_device_id());
CREATE POLICY "Device can update own memories" ON public.ai_memories
  FOR UPDATE TO public USING (device_id = public.get_request_device_id()) WITH CHECK (device_id = public.get_request_device_id());
CREATE POLICY "Device can delete own memories" ON public.ai_memories
  FOR DELETE TO public USING (device_id = public.get_request_device_id());

-- conversations: device_id scoped
CREATE POLICY "Device can read own conversations" ON public.conversations
  FOR SELECT TO public USING (device_id = public.get_request_device_id());
CREATE POLICY "Device can insert own conversations" ON public.conversations
  FOR INSERT TO public WITH CHECK (device_id = public.get_request_device_id());
CREATE POLICY "Device can update own conversations" ON public.conversations
  FOR UPDATE TO public USING (device_id = public.get_request_device_id()) WITH CHECK (device_id = public.get_request_device_id());
CREATE POLICY "Device can delete own conversations" ON public.conversations
  FOR DELETE TO public USING (device_id = public.get_request_device_id());

-- chat_messages: scoped via conversation ownership
CREATE POLICY "Device can read own chat messages" ON public.chat_messages
  FOR SELECT TO public USING (
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.device_id = public.get_request_device_id())
  );
CREATE POLICY "Device can insert own chat messages" ON public.chat_messages
  FOR INSERT TO public WITH CHECK (
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.device_id = public.get_request_device_id())
  );

-- device_sessions: device_id scoped
CREATE POLICY "Device can read own session" ON public.device_sessions
  FOR SELECT TO public USING (device_id = public.get_request_device_id());
CREATE POLICY "Device can upsert own session" ON public.device_sessions
  FOR INSERT TO public WITH CHECK (device_id = public.get_request_device_id());
CREATE POLICY "Device can update own session" ON public.device_sessions
  FOR UPDATE TO public USING (device_id = public.get_request_device_id());

-- travel_history: device_id scoped
CREATE POLICY "Device can read own travel" ON public.travel_history
  FOR SELECT TO public USING (device_id = public.get_request_device_id());
CREATE POLICY "Device can insert own travel" ON public.travel_history
  FOR INSERT TO public WITH CHECK (device_id = public.get_request_device_id());
CREATE POLICY "Device can update own travel" ON public.travel_history
  FOR UPDATE TO public USING (device_id = public.get_request_device_id()) WITH CHECK (device_id = public.get_request_device_id());
CREATE POLICY "Device can delete own travel" ON public.travel_history
  FOR DELETE TO public USING (device_id = public.get_request_device_id());

-- snomad_profiles: device_id scoped (encrypted identity data)
CREATE POLICY "Device can read own profile" ON public.snomad_profiles
  FOR SELECT TO public USING (device_id = public.get_request_device_id());
CREATE POLICY "Device can insert own profile" ON public.snomad_profiles
  FOR INSERT TO public WITH CHECK (device_id = public.get_request_device_id());
CREATE POLICY "Device can update own profile" ON public.snomad_profiles
  FOR UPDATE TO public USING (device_id = public.get_request_device_id()) WITH CHECK (device_id = public.get_request_device_id());

-- knowledge_graph_edges: device_id scoped
CREATE POLICY "Device can read own edges" ON public.knowledge_graph_edges
  FOR SELECT TO public USING (device_id = public.get_request_device_id());
CREATE POLICY "Device can insert own edges" ON public.knowledge_graph_edges
  FOR INSERT TO public WITH CHECK (device_id = public.get_request_device_id());
CREATE POLICY "Device can update own edges" ON public.knowledge_graph_edges
  FOR UPDATE TO public USING (device_id = public.get_request_device_id()) WITH CHECK (device_id = public.get_request_device_id());
CREATE POLICY "Device can delete own edges" ON public.knowledge_graph_edges
  FOR DELETE TO public USING (device_id = public.get_request_device_id());

-- ai_usage_logs: insert only for public (no read needed from client)
CREATE POLICY "Device can insert own logs" ON public.ai_usage_logs
  FOR INSERT TO public WITH CHECK (device_id = public.get_request_device_id());
CREATE POLICY "Device can read own logs" ON public.ai_usage_logs
  FOR SELECT TO public USING (device_id = public.get_request_device_id());

-- ai_cache: public read/write (non-sensitive, shared cache)
CREATE POLICY "Public can read cache" ON public.ai_cache
  FOR SELECT TO public USING (true);
CREATE POLICY "Public can insert cache" ON public.ai_cache
  FOR INSERT TO public WITH CHECK (true);

-- conversation_summaries: scoped via conversation ownership
CREATE POLICY "Device can read own summaries" ON public.conversation_summaries
  FOR SELECT TO public USING (
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.device_id = public.get_request_device_id())
  );
CREATE POLICY "Device can insert own summaries" ON public.conversation_summaries
  FOR INSERT TO public WITH CHECK (
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.device_id = public.get_request_device_id())
  );
