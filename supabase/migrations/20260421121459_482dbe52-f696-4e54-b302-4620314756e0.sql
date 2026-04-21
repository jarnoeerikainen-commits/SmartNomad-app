-- Curated venues table — silent recommendation pool used only by AI Concierge
CREATE TABLE IF NOT EXISTS public.curated_venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN (
    'hotel', 'boutique_hotel', 'villa',
    'restaurant', 'spa', 'public_sauna',
    'swimming_pool', 'cafeteria', 'bakery', 'pastry_shop'
  )),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT,
  neighborhood TEXT,
  address TEXT,
  price_band TEXT CHECK (price_band IN ('$', '$$', '$$$', '$$$$', '$$$$$')),
  star_rating NUMERIC(2,1),
  review_score NUMERIC(2,1) NOT NULL,
  review_count INTEGER NOT NULL DEFAULT 0,
  quality_score INTEGER NOT NULL DEFAULT 0,
  why_recommended TEXT,
  signature_offering TEXT,
  source_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'flagged')),
  UNIQUE (name, city, category)
);

CREATE INDEX IF NOT EXISTS idx_curated_venues_city_cat
  ON public.curated_venues(city, category) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_curated_venues_country_cat
  ON public.curated_venues(country_code, category) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_curated_venues_quality
  ON public.curated_venues(quality_score DESC) WHERE status = 'active';

ALTER TABLE public.curated_venues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "curated_venues_read_all_auth" ON public.curated_venues;
CREATE POLICY "curated_venues_read_all_auth"
  ON public.curated_venues FOR SELECT
  TO authenticated
  USING (status = 'active');

DROP POLICY IF EXISTS "curated_venues_service_all" ON public.curated_venues;
CREATE POLICY "curated_venues_service_all"
  ON public.curated_venues FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Discovery run log
CREATE TABLE IF NOT EXISTS public.venue_discovery_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'partial')),
  cities_processed INTEGER NOT NULL DEFAULT 0,
  candidates_evaluated INTEGER NOT NULL DEFAULT 0,
  venues_added INTEGER NOT NULL DEFAULT 0,
  venues_updated INTEGER NOT NULL DEFAULT 0,
  errors JSONB NOT NULL DEFAULT '[]'::jsonb,
  trigger_source TEXT NOT NULL DEFAULT 'cron',
  duration_ms INTEGER
);

ALTER TABLE public.venue_discovery_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "venue_discovery_runs_admin_read" ON public.venue_discovery_runs;
CREATE POLICY "venue_discovery_runs_admin_read"
  ON public.venue_discovery_runs FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "venue_discovery_runs_service_all" ON public.venue_discovery_runs;
CREATE POLICY "venue_discovery_runs_service_all"
  ON public.venue_discovery_runs FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);