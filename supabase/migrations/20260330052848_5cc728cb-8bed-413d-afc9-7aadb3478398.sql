
-- SNOMAD ID: Vectorized Knowledge Graph Schema

-- Enable pgvector for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Snomad Identity Vault
CREATE TABLE public.snomad_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  encrypted_identity jsonb DEFAULT '{}'::jsonb,
  encrypted_documents jsonb DEFAULT '[]'::jsonb,
  preferences jsonb DEFAULT '{}'::jsonb,
  spending_patterns jsonb DEFAULT '{}'::jsonb,
  profile_embedding vector(384),
  preference_count integer DEFAULT 0,
  completeness_score float DEFAULT 0.0,
  last_synced_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(device_id)
);

-- 2. Travel History (10-year log)
CREATE TABLE public.travel_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  country_code text NOT NULL,
  country_name text NOT NULL,
  city text,
  entry_date date NOT NULL,
  exit_date date,
  purpose text DEFAULT 'leisure',
  visa_type text,
  source text DEFAULT 'manual',
  entry_coordinates jsonb,
  exit_coordinates jsonb,
  ai_tags text[] DEFAULT '{}',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_travel_history_device ON public.travel_history(device_id);
CREATE INDEX idx_travel_history_dates ON public.travel_history(device_id, entry_date DESC);
CREATE INDEX idx_travel_history_country ON public.travel_history(device_id, country_code);

-- 3. Knowledge Graph Edges
CREATE TABLE public.knowledge_graph_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  source_type text NOT NULL,
  source_id text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  relationship text NOT NULL,
  weight float DEFAULT 1.0,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX idx_kg_edges_device ON public.knowledge_graph_edges(device_id);
CREATE INDEX idx_kg_edges_source ON public.knowledge_graph_edges(source_type, source_id);
CREATE INDEX idx_kg_edges_target ON public.knowledge_graph_edges(target_type, target_id);
CREATE INDEX idx_kg_edges_relationship ON public.knowledge_graph_edges(device_id, relationship);

-- 4. RLS Policies
ALTER TABLE public.snomad_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_graph_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for snomad_profiles" ON public.snomad_profiles FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for travel_history" ON public.travel_history FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for knowledge_graph_edges" ON public.knowledge_graph_edges FOR ALL TO public USING (true) WITH CHECK (true);

-- 5. Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_snomad_profile_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_snomad_profile_updated
  BEFORE UPDATE ON public.snomad_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_snomad_profile_timestamp();

-- 6. Knowledge Graph traversal function
CREATE OR REPLACE FUNCTION public.traverse_knowledge_graph(
  p_device_id text,
  p_source_type text,
  p_source_id text,
  p_max_depth integer DEFAULT 2
)
RETURNS TABLE(
  edge_id uuid,
  depth integer,
  source_type text,
  source_id text,
  target_type text,
  target_id text,
  relationship text,
  weight float,
  metadata jsonb
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  WITH RECURSIVE graph AS (
    SELECT 
      e.id as edge_id, 1 as depth,
      e.source_type, e.source_id, e.target_type, e.target_id,
      e.relationship, e.weight, e.metadata
    FROM public.knowledge_graph_edges e
    WHERE e.device_id = p_device_id
      AND e.source_type = p_source_type
      AND e.source_id = p_source_id
      AND e.is_active = true
      AND (e.expires_at IS NULL OR e.expires_at > now())
    UNION ALL
    SELECT
      e.id, g.depth + 1,
      e.source_type, e.source_id, e.target_type, e.target_id,
      e.relationship, e.weight * 0.7, e.metadata
    FROM public.knowledge_graph_edges e
    INNER JOIN graph g ON e.source_type = g.target_type AND e.source_id = g.target_id
    WHERE e.device_id = p_device_id
      AND e.is_active = true
      AND (e.expires_at IS NULL OR e.expires_at > now())
      AND g.depth < p_max_depth
  )
  SELECT * FROM graph ORDER BY depth, weight DESC;
$$;
