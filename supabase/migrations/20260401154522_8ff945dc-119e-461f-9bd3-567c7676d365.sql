
-- ═══════════════════════════════════════════════════════════
-- Phase 1: Profiles table + user_id columns + migration bridge
-- ═══════════════════════════════════════════════════════════

-- 1. Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT,
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- 2. Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Add user_id column to all device-based tables
ALTER TABLE public.ai_usage_logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.travel_history ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.snomad_profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.device_sessions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.knowledge_graph_edges ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.ai_memories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Create indexes for user_id lookups
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON public.ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_history_user_id ON public.travel_history(user_id);
CREATE INDEX IF NOT EXISTS idx_snomad_profiles_user_id ON public.snomad_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_graph_edges_user_id ON public.knowledge_graph_edges(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memories_user_id ON public.ai_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);

-- 5. Migration bridge function: links device_id data to user_id on first login
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
  -- Link profile
  UPDATE public.profiles SET device_id = p_device_id WHERE id = p_user_id AND device_id IS NULL;

  -- Migrate each table
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

  RETURN result;
END;
$$;

-- 6. Update RLS policies to support BOTH device_id (pre-auth) and user_id (post-auth)
-- We use a helper function for dual-mode access
CREATE OR REPLACE FUNCTION public.check_data_access(row_device_id TEXT, row_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE
      WHEN auth.uid() IS NOT NULL THEN row_user_id = auth.uid()
      ELSE row_device_id = get_request_device_id()
    END;
$$;

-- Update RLS for conversations
DROP POLICY IF EXISTS "Device can read own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Device can insert own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Device can update own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Device can delete own conversations" ON public.conversations;

CREATE POLICY "Access own conversations" ON public.conversations
  FOR SELECT USING (check_data_access(device_id, user_id));
CREATE POLICY "Insert own conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    CASE WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid() ELSE device_id = get_request_device_id() END
  );
CREATE POLICY "Update own conversations" ON public.conversations
  FOR UPDATE USING (check_data_access(device_id, user_id)) WITH CHECK (check_data_access(device_id, user_id));
CREATE POLICY "Delete own conversations" ON public.conversations
  FOR DELETE USING (check_data_access(device_id, user_id));

-- Update RLS for ai_memories
DROP POLICY IF EXISTS "Device can read own memories" ON public.ai_memories;
DROP POLICY IF EXISTS "Device can insert own memories" ON public.ai_memories;
DROP POLICY IF EXISTS "Device can update own memories" ON public.ai_memories;
DROP POLICY IF EXISTS "Device can delete own memories" ON public.ai_memories;

CREATE POLICY "Access own memories" ON public.ai_memories
  FOR SELECT USING (check_data_access(device_id, user_id));
CREATE POLICY "Insert own memories" ON public.ai_memories
  FOR INSERT WITH CHECK (
    CASE WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid() ELSE device_id = get_request_device_id() END
  );
CREATE POLICY "Update own memories" ON public.ai_memories
  FOR UPDATE USING (check_data_access(device_id, user_id)) WITH CHECK (check_data_access(device_id, user_id));
CREATE POLICY "Delete own memories" ON public.ai_memories
  FOR DELETE USING (check_data_access(device_id, user_id));

-- Update RLS for travel_history
DROP POLICY IF EXISTS "Device can read own travel" ON public.travel_history;
DROP POLICY IF EXISTS "Device can insert own travel" ON public.travel_history;
DROP POLICY IF EXISTS "Device can update own travel" ON public.travel_history;
DROP POLICY IF EXISTS "Device can delete own travel" ON public.travel_history;

CREATE POLICY "Access own travel" ON public.travel_history
  FOR SELECT USING (check_data_access(device_id, user_id));
CREATE POLICY "Insert own travel" ON public.travel_history
  FOR INSERT WITH CHECK (
    CASE WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid() ELSE device_id = get_request_device_id() END
  );
CREATE POLICY "Update own travel" ON public.travel_history
  FOR UPDATE USING (check_data_access(device_id, user_id)) WITH CHECK (check_data_access(device_id, user_id));
CREATE POLICY "Delete own travel" ON public.travel_history
  FOR DELETE USING (check_data_access(device_id, user_id));

-- Update RLS for snomad_profiles
DROP POLICY IF EXISTS "Device can read own profile" ON public.snomad_profiles;
DROP POLICY IF EXISTS "Device can insert own profile" ON public.snomad_profiles;
DROP POLICY IF EXISTS "Device can update own profile" ON public.snomad_profiles;

CREATE POLICY "Access own snomad profile" ON public.snomad_profiles
  FOR SELECT USING (check_data_access(device_id, user_id));
CREATE POLICY "Insert own snomad profile" ON public.snomad_profiles
  FOR INSERT WITH CHECK (
    CASE WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid() ELSE device_id = get_request_device_id() END
  );
CREATE POLICY "Update own snomad profile" ON public.snomad_profiles
  FOR UPDATE USING (check_data_access(device_id, user_id)) WITH CHECK (check_data_access(device_id, user_id));

-- Update RLS for knowledge_graph_edges
DROP POLICY IF EXISTS "Device can read own edges" ON public.knowledge_graph_edges;
DROP POLICY IF EXISTS "Device can insert own edges" ON public.knowledge_graph_edges;
DROP POLICY IF EXISTS "Device can update own edges" ON public.knowledge_graph_edges;
DROP POLICY IF EXISTS "Device can delete own edges" ON public.knowledge_graph_edges;

CREATE POLICY "Access own edges" ON public.knowledge_graph_edges
  FOR SELECT USING (check_data_access(device_id, user_id));
CREATE POLICY "Insert own edges" ON public.knowledge_graph_edges
  FOR INSERT WITH CHECK (
    CASE WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid() ELSE device_id = get_request_device_id() END
  );
CREATE POLICY "Update own edges" ON public.knowledge_graph_edges
  FOR UPDATE USING (check_data_access(device_id, user_id)) WITH CHECK (check_data_access(device_id, user_id));
CREATE POLICY "Delete own edges" ON public.knowledge_graph_edges
  FOR DELETE USING (check_data_access(device_id, user_id));

-- Update RLS for ai_usage_logs
DROP POLICY IF EXISTS "Device can read own logs" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Device can insert own logs" ON public.ai_usage_logs;

CREATE POLICY "Access own logs" ON public.ai_usage_logs
  FOR SELECT USING (check_data_access(device_id, user_id));
CREATE POLICY "Insert own logs" ON public.ai_usage_logs
  FOR INSERT WITH CHECK (
    CASE WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid() ELSE device_id = get_request_device_id() END
  );

-- Update RLS for device_sessions
DROP POLICY IF EXISTS "Device can read own session" ON public.device_sessions;
DROP POLICY IF EXISTS "Device can upsert own session" ON public.device_sessions;
DROP POLICY IF EXISTS "Device can update own session" ON public.device_sessions;

CREATE POLICY "Access own session" ON public.device_sessions
  FOR SELECT USING (check_data_access(device_id, user_id));
CREATE POLICY "Insert own session" ON public.device_sessions
  FOR INSERT WITH CHECK (
    CASE WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid() ELSE device_id = get_request_device_id() END
  );
CREATE POLICY "Update own session" ON public.device_sessions
  FOR UPDATE USING (check_data_access(device_id, user_id)) WITH CHECK (check_data_access(device_id, user_id));

-- Update chat_messages RLS (uses conversation FK)
DROP POLICY IF EXISTS "Device can read own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Device can insert own chat messages" ON public.chat_messages;

CREATE POLICY "Access own chat messages" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = chat_messages.conversation_id
      AND check_data_access(c.device_id, c.user_id)
    )
  );
CREATE POLICY "Insert own chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = chat_messages.conversation_id
      AND check_data_access(c.device_id, c.user_id)
    )
  );

-- Update conversation_summaries RLS
DROP POLICY IF EXISTS "Device can read own summaries" ON public.conversation_summaries;
DROP POLICY IF EXISTS "Device can insert own summaries" ON public.conversation_summaries;

CREATE POLICY "Access own summaries" ON public.conversation_summaries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_summaries.conversation_id
      AND check_data_access(c.device_id, c.user_id)
    )
  );
CREATE POLICY "Insert own summaries" ON public.conversation_summaries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_summaries.conversation_id
      AND check_data_access(c.device_id, c.user_id)
    )
  );

-- Profile update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_profile_timestamp()
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

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_timestamp();
