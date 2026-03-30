
-- Fix search_path on earlier functions
CREATE OR REPLACE FUNCTION public.search_memories(
  p_device_id text,
  p_query text DEFAULT '',
  p_category text DEFAULT NULL,
  p_limit int DEFAULT 20
)
RETURNS TABLE(id uuid, fact text, category text, confidence float, rank float)
LANGUAGE sql STABLE
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations 
  SET updated_at = now(), 
      message_count = (SELECT count(*) FROM public.chat_messages WHERE conversation_id = NEW.conversation_id)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;
