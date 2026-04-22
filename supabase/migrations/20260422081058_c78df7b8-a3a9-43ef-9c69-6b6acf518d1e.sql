
-- ============================================================
-- B2B Data Packaging Backend
-- IAB Taxonomy 1.1 + Data Transparency 1.2 + LiveRamp Clean Room
-- ============================================================

-- 1. data_packages: sellable data products
CREATE TABLE public.data_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  -- IAB Audience Taxonomy reference (e.g. "7-1" Travel)
  iab_taxonomy_id text,
  iab_taxonomy_version text DEFAULT '1.1',
  -- pricing
  pricing_model text NOT NULL DEFAULT 'cpm' CHECK (pricing_model IN ('cpm','flat','subscription','revenue_share')),
  cpm_usd numeric(10,4) DEFAULT 0,
  flat_price_usd numeric(12,2) DEFAULT 0,
  monthly_subscription_usd numeric(12,2) DEFAULT 0,
  -- IAB Data Transparency 1.2 disclosures
  provider_name text NOT NULL DEFAULT 'SuperNomad',
  provider_domain text NOT NULL DEFAULT 'supernomad.com',
  source_type text NOT NULL DEFAULT 'declared' CHECK (source_type IN ('declared','inferred','modeled','observed','panel')),
  refresh_cadence text NOT NULL DEFAULT 'daily' CHECK (refresh_cadence IN ('realtime','hourly','daily','weekly','monthly')),
  recency_days int NOT NULL DEFAULT 30,
  -- privacy & compliance
  min_k_anonymity int NOT NULL DEFAULT 25,
  requires_consent boolean NOT NULL DEFAULT true,
  legal_basis text NOT NULL DEFAULT 'consent' CHECK (legal_basis IN ('consent','legitimate_interest','anonymized','contract')),
  cookie_free boolean NOT NULL DEFAULT true,
  -- ops
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','paused','retired')),
  estimated_universe_size int DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_data_packages_status ON public.data_packages(status);
CREATE INDEX idx_data_packages_category ON public.data_packages(category);

-- 2. data_package_fields: per-field config (LiveRamp-style field mapping)
CREATE TABLE public.data_package_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.data_packages(id) ON DELETE CASCADE,
  field_name text NOT NULL,
  display_name text,
  data_type text NOT NULL CHECK (data_type IN ('string','int','float','bool','date','enum','geo','hash')),
  -- transform applied before partner sees it
  transform text NOT NULL DEFAULT 'raw' CHECK (transform IN ('raw','bucketed','hashed','anonymized','aggregated','suppressed')),
  bucket_strategy jsonb,  -- e.g. {"buckets":["18-24","25-34"]}
  is_identifier boolean NOT NULL DEFAULT false,
  is_partition_key boolean NOT NULL DEFAULT false,
  is_required boolean NOT NULL DEFAULT false,
  recency_days int,
  description text,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (package_id, field_name)
);

CREATE INDEX idx_pkg_fields_package ON public.data_package_fields(package_id);

-- 3. data_package_segments: IAB-aligned segments inside a package
CREATE TABLE public.data_package_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.data_packages(id) ON DELETE CASCADE,
  segment_id text NOT NULL,  -- e.g. "7-1-1"
  segment_name text NOT NULL,
  parent_segment_id text,
  tier int NOT NULL DEFAULT 1,
  estimated_size int NOT NULL DEFAULT 0,
  source_type text NOT NULL DEFAULT 'declared',
  recency_days int NOT NULL DEFAULT 30,
  match_rule jsonb NOT NULL DEFAULT '{}'::jsonb,  -- e.g. {"travel_style":"luxury","income_bracket":"high"}
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (package_id, segment_id)
);

CREATE INDEX idx_pkg_segments_package ON public.data_package_segments(package_id);
CREATE INDEX idx_pkg_segments_active ON public.data_package_segments(is_active) WHERE is_active = true;

-- 4. data_package_subscriptions: partner contracts
CREATE TABLE public.data_package_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.api_partners(id) ON DELETE CASCADE,
  package_id uuid NOT NULL REFERENCES public.data_packages(id) ON DELETE CASCADE,
  tier text NOT NULL DEFAULT 'standard' CHECK (tier IN ('trial','standard','premium','enterprise')),
  -- contract terms
  cpm_rate_usd numeric(10,4),  -- override of package default if set
  flat_price_usd numeric(12,2),
  monthly_fee_usd numeric(12,2),
  contracted_records int,  -- volume cap
  records_delivered int NOT NULL DEFAULT 0,
  max_records_per_query int NOT NULL DEFAULT 10000,
  -- status
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('trial','active','paused','revoked','expired')),
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  -- billing
  total_billed_usd numeric(12,2) NOT NULL DEFAULT 0,
  last_invoice_at timestamptz,
  -- contract metadata
  contract_url text,
  contract_signed_at timestamptz,
  notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, package_id)
);

CREATE INDEX idx_pkg_subs_partner ON public.data_package_subscriptions(partner_id);
CREATE INDEX idx_pkg_subs_package ON public.data_package_subscriptions(package_id);
CREATE INDEX idx_pkg_subs_status ON public.data_package_subscriptions(status);

-- 5. package_delivery_jobs: every delivery audited
CREATE TABLE public.package_delivery_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.api_partners(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.data_package_subscriptions(id) ON DELETE SET NULL,
  package_id uuid NOT NULL REFERENCES public.data_packages(id) ON DELETE CASCADE,
  job_type text NOT NULL CHECK (job_type IN ('query','segment_counts','export','stream','field_catalog')),
  -- request
  request_params jsonb NOT NULL DEFAULT '{}'::jsonb,
  fields_requested text[] NOT NULL DEFAULT '{}',
  segments_requested text[] NOT NULL DEFAULT '{}',
  -- result
  records_delivered int NOT NULL DEFAULT 0,
  k_anonymity_passed boolean NOT NULL DEFAULT true,
  k_anonymity_value int,
  consent_verified_count int NOT NULL DEFAULT 0,
  -- billing
  cost_usd numeric(12,4) NOT NULL DEFAULT 0,
  cpm_used numeric(10,4),
  -- ops
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('queued','running','completed','failed','rejected')),
  rejection_reason text,
  latency_ms int,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_delivery_jobs_partner ON public.package_delivery_jobs(partner_id, created_at DESC);
CREATE INDEX idx_delivery_jobs_package ON public.package_delivery_jobs(package_id, created_at DESC);
CREATE INDEX idx_delivery_jobs_subscription ON public.package_delivery_jobs(subscription_id);

-- ============================================================
-- Updated-at triggers (reuse existing helper)
-- ============================================================
CREATE TRIGGER trg_data_packages_updated
  BEFORE UPDATE ON public.data_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_timestamp();

CREATE TRIGGER trg_pkg_segments_updated
  BEFORE UPDATE ON public.data_package_segments
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_timestamp();

CREATE TRIGGER trg_pkg_subs_updated
  BEFORE UPDATE ON public.data_package_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_timestamp();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.data_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_package_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_package_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_package_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_delivery_jobs ENABLE ROW LEVEL SECURITY;

-- data_packages: admins read, service manages, public can see active package catalog (non-sensitive metadata)
CREATE POLICY "Admins read all packages"
  ON public.data_packages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Authenticated read active package catalog"
  ON public.data_packages FOR SELECT TO authenticated
  USING (status = 'active');

CREATE POLICY "Service manages packages"
  ON public.data_packages FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- data_package_fields: admin + service only
CREATE POLICY "Admins read package fields"
  ON public.data_package_fields FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Service manages package fields"
  ON public.data_package_fields FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- data_package_segments: admin + service + active-public read
CREATE POLICY "Admins read package segments"
  ON public.data_package_segments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Authenticated read active segments"
  ON public.data_package_segments FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Service manages package segments"
  ON public.data_package_segments FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- data_package_subscriptions: admin reads all; service manages; (no partner-side auth — partners use API key, queried from backend)
CREATE POLICY "Admins read all subscriptions"
  ON public.data_package_subscriptions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Service manages subscriptions"
  ON public.data_package_subscriptions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- package_delivery_jobs: admin reads all; service inserts; users read jobs touching their snomad_id (via data_access_requests bridge)
CREATE POLICY "Admins read all delivery jobs"
  ON public.package_delivery_jobs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Service manages delivery jobs"
  ON public.package_delivery_jobs FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ============================================================
-- Helper functions
-- ============================================================

-- Check whether a partner has active access to a package
CREATE OR REPLACE FUNCTION public.check_package_access(
  p_partner_id uuid,
  p_package_slug text
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_package public.data_packages;
  v_sub public.data_package_subscriptions;
BEGIN
  SELECT * INTO v_package FROM public.data_packages WHERE slug = p_package_slug;
  IF v_package.id IS NULL THEN
    RETURN jsonb_build_object('granted', false, 'reason', 'package_not_found');
  END IF;
  IF v_package.status != 'active' THEN
    RETURN jsonb_build_object('granted', false, 'reason', 'package_' || v_package.status);
  END IF;

  SELECT * INTO v_sub FROM public.data_package_subscriptions
  WHERE partner_id = p_partner_id AND package_id = v_package.id;

  IF v_sub.id IS NULL THEN
    RETURN jsonb_build_object('granted', false, 'reason', 'no_subscription', 'package_id', v_package.id);
  END IF;
  IF v_sub.status NOT IN ('trial','active') THEN
    RETURN jsonb_build_object('granted', false, 'reason', 'subscription_' || v_sub.status);
  END IF;
  IF v_sub.expires_at IS NOT NULL AND v_sub.expires_at < now() THEN
    RETURN jsonb_build_object('granted', false, 'reason', 'subscription_expired');
  END IF;
  IF v_sub.contracted_records IS NOT NULL AND v_sub.records_delivered >= v_sub.contracted_records THEN
    RETURN jsonb_build_object('granted', false, 'reason', 'volume_cap_reached');
  END IF;

  RETURN jsonb_build_object(
    'granted', true,
    'package_id', v_package.id,
    'subscription_id', v_sub.id,
    'tier', v_sub.tier,
    'max_records_per_query', v_sub.max_records_per_query,
    'min_k_anonymity', v_package.min_k_anonymity,
    'cpm_rate', COALESCE(v_sub.cpm_rate_usd, v_package.cpm_usd),
    'remaining_records',
      CASE WHEN v_sub.contracted_records IS NULL THEN NULL
           ELSE v_sub.contracted_records - v_sub.records_delivered END
  );
END;
$$;

-- Record a delivery + update subscription counters in one shot
CREATE OR REPLACE FUNCTION public.record_package_delivery(
  p_partner_id uuid,
  p_package_id uuid,
  p_subscription_id uuid,
  p_job_type text,
  p_request_params jsonb,
  p_fields text[],
  p_segments text[],
  p_records int,
  p_k_passed boolean,
  p_k_value int,
  p_consent_verified int,
  p_cost numeric,
  p_cpm numeric,
  p_status text,
  p_rejection text,
  p_latency_ms int,
  p_ip text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job_id uuid;
BEGIN
  INSERT INTO public.package_delivery_jobs (
    partner_id, package_id, subscription_id, job_type,
    request_params, fields_requested, segments_requested,
    records_delivered, k_anonymity_passed, k_anonymity_value,
    consent_verified_count, cost_usd, cpm_used, status,
    rejection_reason, latency_ms, ip_address
  ) VALUES (
    p_partner_id, p_package_id, p_subscription_id, p_job_type,
    COALESCE(p_request_params, '{}'::jsonb), COALESCE(p_fields, '{}'), COALESCE(p_segments, '{}'),
    p_records, p_k_passed, p_k_value,
    p_consent_verified, p_cost, p_cpm, p_status,
    p_rejection, p_latency_ms, p_ip
  )
  RETURNING id INTO v_job_id;

  -- Update subscription counters only on successful delivery
  IF p_subscription_id IS NOT NULL AND p_status = 'completed' AND p_records > 0 THEN
    UPDATE public.data_package_subscriptions
    SET records_delivered = records_delivered + p_records,
        total_billed_usd = total_billed_usd + p_cost,
        updated_at = now()
    WHERE id = p_subscription_id;
  END IF;

  RETURN v_job_id;
END;
$$;
