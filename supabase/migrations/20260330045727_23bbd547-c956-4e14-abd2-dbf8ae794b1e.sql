
-- ═══════════════════════════════════════════════════════════
-- PRODUCTION SCALE INFRASTRUCTURE
-- ═══════════════════════════════════════════════════════════

-- AI Response Cache (reduces API costs by 40-60% at scale)
CREATE TABLE public.ai_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text UNIQUE NOT NULL,
  query_text text NOT NULL,
  response_text text NOT NULL,
  model text NOT NULL DEFAULT 'gemini-3-flash',
  hit_count int NOT NULL DEFAULT 0,
  token_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_ai_cache_key ON public.ai_cache(cache_key);
CREATE INDEX idx_ai_cache_expires ON public.ai_cache(expires_at);

-- Conversation Summaries (compression for long conversations)
CREATE TABLE public.conversation_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  summary text NOT NULL,
  messages_summarized int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_conv_summaries_conv ON public.conversation_summaries(conversation_id);

-- AI Usage Analytics (track everything for production monitoring)
CREATE TABLE public.ai_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  function_name text NOT NULL,
  model text NOT NULL DEFAULT 'gemini-3-flash',
  input_tokens int NOT NULL DEFAULT 0,
  output_tokens int NOT NULL DEFAULT 0,
  latency_ms int NOT NULL DEFAULT 0,
  cache_hit boolean NOT NULL DEFAULT false,
  reasoning_used text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_usage_logs_device ON public.ai_usage_logs(device_id, created_at DESC);
CREATE INDEX idx_usage_logs_function ON public.ai_usage_logs(function_name, created_at DESC);
CREATE INDEX idx_usage_logs_created ON public.ai_usage_logs(created_at DESC);

-- Add semantic_tags to ai_memories for richer categorization
ALTER TABLE public.ai_memories ADD COLUMN IF NOT EXISTS semantic_tags text[] DEFAULT '{}';
ALTER TABLE public.ai_memories ADD COLUMN IF NOT EXISTS importance int NOT NULL DEFAULT 5;

-- Enhanced weighted hybrid search (recency + relevance + confidence + importance)
CREATE OR REPLACE FUNCTION public.search_memories_weighted(
  p_device_id text,
  p_query text DEFAULT '',
  p_category text DEFAULT NULL,
  p_limit int DEFAULT 20
)
RETURNS TABLE(id uuid, fact text, category text, confidence float, importance int, semantic_tags text[], weighted_score float)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT
    m.id,
    m.fact,
    m.category,
    m.confidence,
    m.importance,
    m.semantic_tags,
    (
      -- Text relevance (0-1)
      CASE 
        WHEN p_query = '' OR p_query IS NULL THEN 0.5
        ELSE LEAST(ts_rank(m.search_vector, plainto_tsquery('english', p_query)), 1.0)
      END * 0.35
      +
      -- Confidence score (0-1)
      m.confidence * 0.25
      +
      -- Importance (1-10 normalized to 0-1)
      (m.importance::float / 10.0) * 0.20
      +
      -- Recency bonus (newer = higher, decays over 90 days)
      GREATEST(0, 1.0 - EXTRACT(EPOCH FROM (now() - m.created_at)) / (90 * 86400)) * 0.20
    ) as weighted_score
  FROM public.ai_memories m
  WHERE m.device_id = p_device_id
    AND (p_query = '' OR p_query IS NULL OR m.search_vector @@ plainto_tsquery('english', p_query))
    AND (p_category IS NULL OR m.category = p_category)
  ORDER BY weighted_score DESC
  LIMIT p_limit;
$$;

-- Cache cleanup function (call via cron or trigger)
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count int;
BEGIN
  DELETE FROM public.ai_cache WHERE expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Log AI usage helper
CREATE OR REPLACE FUNCTION public.log_ai_usage(
  p_device_id text,
  p_function_name text,
  p_model text DEFAULT 'gemini-3-flash',
  p_input_tokens int DEFAULT 0,
  p_output_tokens int DEFAULT 0,
  p_latency_ms int DEFAULT 0,
  p_cache_hit boolean DEFAULT false,
  p_reasoning text DEFAULT NULL,
  p_error text DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.ai_usage_logs (device_id, function_name, model, input_tokens, output_tokens, latency_ms, cache_hit, reasoning_used, error)
  VALUES (p_device_id, p_function_name, p_model, p_input_tokens, p_output_tokens, p_latency_ms, p_cache_hit, p_reasoning, p_error);
$$;

-- RLS (permissive pre-auth)
ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for ai_cache" ON public.ai_cache FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for conversation_summaries" ON public.conversation_summaries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for ai_usage_logs" ON public.ai_usage_logs FOR ALL USING (true) WITH CHECK (true);
