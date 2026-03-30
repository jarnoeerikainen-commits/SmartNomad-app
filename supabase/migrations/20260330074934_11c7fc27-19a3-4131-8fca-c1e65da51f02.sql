
-- Add vector embedding column to ai_memories for pgvector hybrid search
ALTER TABLE public.ai_memories ADD COLUMN IF NOT EXISTS embedding vector(384);

-- Create index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_ai_memories_embedding ON public.ai_memories 
USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- Drop and recreate the weighted search function to use true hybrid search
CREATE OR REPLACE FUNCTION public.search_memories_hybrid(
  p_device_id text,
  p_embedding vector(384) DEFAULT NULL,
  p_query text DEFAULT ''::text,
  p_category text DEFAULT NULL::text,
  p_limit integer DEFAULT 20
)
RETURNS TABLE(
  id uuid, fact text, category text, confidence double precision,
  importance integer, semantic_tags text[], weighted_score double precision
)
LANGUAGE sql STABLE SET search_path TO 'public'
AS $$
  SELECT
    m.id, m.fact, m.category, m.confidence, m.importance, m.semantic_tags,
    (
      -- Vector similarity (0-1) — 40% weight when embedding available
      CASE
        WHEN p_embedding IS NOT NULL AND m.embedding IS NOT NULL
        THEN (1.0 - cosine_distance(m.embedding, p_embedding)) * 0.40
        ELSE 0.0
      END
      +
      -- Keyword relevance via tsvector (0-1) — 20% weight
      CASE
        WHEN p_query = '' OR p_query IS NULL THEN 0.1
        ELSE LEAST(ts_rank(m.search_vector, plainto_tsquery('english', p_query)), 1.0) * 0.20
      END
      +
      -- Confidence (0-1) — 15% weight
      m.confidence * 0.15
      +
      -- Importance (1-10 → 0-1) — 15% weight
      (m.importance::float / 10.0) * 0.15
      +
      -- Recency (decays over 90 days) — 10% weight
      GREATEST(0, 1.0 - EXTRACT(EPOCH FROM (now() - m.created_at)) / (90 * 86400)) * 0.10
    ) as weighted_score
  FROM public.ai_memories m
  WHERE m.device_id = p_device_id
    AND (p_category IS NULL OR m.category = p_category)
    AND (
      (p_query = '' OR p_query IS NULL OR m.search_vector @@ plainto_tsquery('english', p_query))
      OR (p_embedding IS NOT NULL AND m.embedding IS NOT NULL)
    )
  ORDER BY weighted_score DESC
  LIMIT p_limit;
$$;

-- Helper function to generate embeddings endpoint URL
-- Keep the old functions for backward compatibility
