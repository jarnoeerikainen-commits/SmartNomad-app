
-- Device sessions (pre-auth user tracking)
CREATE TABLE public.device_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- Conversations
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL REFERENCES public.device_sessions(device_id) ON DELETE CASCADE,
  title text,
  message_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Chat messages
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- AI memories (durable learned facts with full-text search)
CREATE TABLE public.ai_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL REFERENCES public.device_sessions(device_id) ON DELETE CASCADE,
  fact text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  durability text NOT NULL DEFAULT 'durable',
  confidence float NOT NULL DEFAULT 0.8,
  source_conversation_id uuid REFERENCES public.conversations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', fact)) STORED
);

-- Indexes for performance
CREATE INDEX idx_conversations_device ON public.conversations(device_id);
CREATE INDEX idx_conversations_updated ON public.conversations(updated_at DESC);
CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created ON public.chat_messages(created_at);
CREATE INDEX idx_ai_memories_device ON public.ai_memories(device_id);
CREATE INDEX idx_ai_memories_search ON public.ai_memories USING gin(search_vector);
CREATE INDEX idx_ai_memories_category ON public.ai_memories(device_id, category);

-- Hybrid search function (full-text + category filtering)
CREATE OR REPLACE FUNCTION public.search_memories(
  p_device_id text,
  p_query text DEFAULT '',
  p_category text DEFAULT NULL,
  p_limit int DEFAULT 20
)
RETURNS TABLE(id uuid, fact text, category text, confidence float, rank float)
LANGUAGE sql STABLE
AS $$
  SELECT
    m.id,
    m.fact,
    m.category,
    m.confidence,
    CASE 
      WHEN p_query = '' OR p_query IS NULL THEN m.confidence
      ELSE ts_rank(m.search_vector, plainto_tsquery('english', p_query))
    END as rank
  FROM public.ai_memories m
  WHERE m.device_id = p_device_id
    AND (p_query = '' OR p_query IS NULL OR m.search_vector @@ plainto_tsquery('english', p_query))
    AND (p_category IS NULL OR m.category = p_category)
  ORDER BY rank DESC
  LIMIT p_limit;
$$;

-- Function to auto-update conversation timestamp
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.conversations 
  SET updated_at = now(), 
      message_count = (SELECT count(*) FROM public.chat_messages WHERE conversation_id = NEW.conversation_id)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_conversation_on_message
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_timestamp();

-- RLS (permissive for now - no auth required)
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for device_sessions" ON public.device_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for chat_messages" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for ai_memories" ON public.ai_memories FOR ALL USING (true) WITH CHECK (true);
