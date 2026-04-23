
-- Enable extensions for cron + http
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ────────────────────────────────────────────────────────
-- 1. VERIFIED SOURCES (allowlist)
-- ────────────────────────────────────────────────────────
CREATE TABLE public.verified_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('government', 'partner', 'official_api')),
  category TEXT NOT NULL, -- 'visa', 'tax', 'health', 'embassy', 'esim', 'insurance', etc.
  country_code TEXT, -- ISO 3166-1 alpha-2, NULL for global
  target_feature_id TEXT, -- maps to featureRegistry id for auto-update routing
  display_name TEXT NOT NULL,
  description TEXT,
  refresh_cadence_hours INTEGER NOT NULL DEFAULT 24,
  risk_policy TEXT NOT NULL DEFAULT 'standard' CHECK (risk_policy IN ('strict', 'standard', 'permissive')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  tls_required BOOLEAN NOT NULL DEFAULT true,
  last_scraped_at TIMESTAMPTZ,
  last_status TEXT, -- 'ok', 'unchanged', 'changed', 'error', 'blocked'
  last_error TEXT,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID
);

CREATE INDEX idx_verified_sources_active_due ON public.verified_sources (is_active, last_scraped_at) WHERE is_active = true;
CREATE INDEX idx_verified_sources_domain ON public.verified_sources (domain);
CREATE INDEX idx_verified_sources_country ON public.verified_sources (country_code);

ALTER TABLE public.verified_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view verified sources"
  ON public.verified_sources FOR SELECT
  USING (public.has_staff_role(auth.uid()));

CREATE POLICY "Admins can manage verified sources"
  ON public.verified_sources FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER trg_verified_sources_updated_at
  BEFORE UPDATE ON public.verified_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ────────────────────────────────────────────────────────
-- 2. SOURCE SNAPSHOTS (content hashes + raw)
-- ────────────────────────────────────────────────────────
CREATE TABLE public.source_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL REFERENCES public.verified_sources(id) ON DELETE CASCADE,
  content_hash TEXT NOT NULL, -- sha256 of normalized markdown
  content_markdown TEXT, -- raw scraped markdown (NULL for "unchanged" snapshots to save space)
  content_length INTEGER NOT NULL DEFAULT 0,
  http_status INTEGER,
  tls_valid BOOLEAN,
  scrape_latency_ms INTEGER,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX idx_source_snapshots_source_time ON public.source_snapshots (source_id, scraped_at DESC);
CREATE INDEX idx_source_snapshots_hash ON public.source_snapshots (content_hash);

ALTER TABLE public.source_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view snapshots"
  ON public.source_snapshots FOR SELECT
  USING (public.has_staff_role(auth.uid()));

-- ────────────────────────────────────────────────────────
-- 3. CHANGE PROPOSALS (queue for human/auto decision)
-- ────────────────────────────────────────────────────────
CREATE TABLE public.change_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL REFERENCES public.verified_sources(id) ON DELETE CASCADE,
  previous_snapshot_id UUID REFERENCES public.source_snapshots(id),
  current_snapshot_id UUID NOT NULL REFERENCES public.source_snapshots(id),
  
  -- AI analysis
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  risk_score INTEGER NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
  change_category TEXT NOT NULL, -- 'cosmetic', 'contact_info', 'fee_change', 'rule_change', 'eligibility', 'new_requirement', 'unknown'
  ai_summary TEXT NOT NULL,
  ai_diff JSONB NOT NULL DEFAULT '{}'::jsonb, -- structured diff: {added: [], removed: [], modified: []}
  proposed_patch JSONB, -- the actual change to apply (e.g. {field: 'fee_usd', old: 80, new: 90})
  
  -- Security
  injection_scan_passed BOOLEAN NOT NULL DEFAULT true,
  injection_scan_findings JSONB,
  tls_verified BOOLEAN NOT NULL DEFAULT false,
  
  -- Decision
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'auto_applied', 'approved', 'rejected', 'superseded', 'expired')),
  decision TEXT, -- 'auto_apply', 'approve', 'reject'
  decided_by UUID,
  decided_at TIMESTAMPTZ,
  decision_note TEXT,
  applied_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '14 days')
);

CREATE INDEX idx_change_proposals_pending ON public.change_proposals (status, created_at DESC) WHERE status = 'pending';
CREATE INDEX idx_change_proposals_source ON public.change_proposals (source_id, created_at DESC);
CREATE INDEX idx_change_proposals_risk ON public.change_proposals (risk_level, status);

ALTER TABLE public.change_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view change proposals"
  ON public.change_proposals FOR SELECT
  USING (public.has_staff_role(auth.uid()));

CREATE POLICY "Admin/support can decide change proposals"
  ON public.change_proposals FOR UPDATE
  USING (public.has_admin_or_support(auth.uid()))
  WITH CHECK (public.has_admin_or_support(auth.uid()));

-- ────────────────────────────────────────────────────────
-- 4. SOURCE AUDIT LOG (immutable trail)
-- ────────────────────────────────────────────────────────
CREATE TABLE public.source_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID REFERENCES public.verified_sources(id) ON DELETE SET NULL,
  proposal_id UUID REFERENCES public.change_proposals(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'scrape_ok', 'scrape_error', 'tls_fail', 'hash_match', 'change_detected', 'auto_applied', 'approved', 'rejected', 'injection_blocked'
  actor_id UUID, -- NULL for system, staff user_id for human decisions
  actor_role TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_source_audit_source_time ON public.source_audit_log (source_id, created_at DESC);
CREATE INDEX idx_source_audit_event ON public.source_audit_log (event_type, created_at DESC);

ALTER TABLE public.source_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view source audit log"
  ON public.source_audit_log FOR SELECT
  USING (public.has_staff_role(auth.uid()));

-- ────────────────────────────────────────────────────────
-- 5. HELPER: get sources due for refresh
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_sources_due_for_refresh(p_limit INTEGER DEFAULT 50)
RETURNS SETOF public.verified_sources
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.verified_sources
  WHERE is_active = true
    AND consecutive_failures < 5
    AND (
      last_scraped_at IS NULL
      OR last_scraped_at < now() - (refresh_cadence_hours || ' hours')::interval
    )
  ORDER BY last_scraped_at ASC NULLS FIRST
  LIMIT p_limit;
$$;

-- ────────────────────────────────────────────────────────
-- 6. HELPER: dashboard summary for admins
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_source_monitor_summary()
RETURNS TABLE(
  total_sources BIGINT,
  active_sources BIGINT,
  pending_proposals BIGINT,
  high_risk_pending BIGINT,
  auto_applied_24h BIGINT,
  approved_24h BIGINT,
  rejected_24h BIGINT,
  scrape_errors_24h BIGINT,
  injection_blocks_24h BIGINT,
  last_run_at TIMESTAMPTZ
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*)::bigint FROM public.verified_sources),
    (SELECT count(*)::bigint FROM public.verified_sources WHERE is_active = true),
    (SELECT count(*)::bigint FROM public.change_proposals WHERE status = 'pending'),
    (SELECT count(*)::bigint FROM public.change_proposals WHERE status = 'pending' AND risk_level IN ('high','critical')),
    (SELECT count(*)::bigint FROM public.change_proposals WHERE status = 'auto_applied' AND created_at > now() - interval '24 hours'),
    (SELECT count(*)::bigint FROM public.change_proposals WHERE status = 'approved' AND decided_at > now() - interval '24 hours'),
    (SELECT count(*)::bigint FROM public.change_proposals WHERE status = 'rejected' AND decided_at > now() - interval '24 hours'),
    (SELECT count(*)::bigint FROM public.source_audit_log WHERE event_type = 'scrape_error' AND created_at > now() - interval '24 hours'),
    (SELECT count(*)::bigint FROM public.source_audit_log WHERE event_type = 'injection_blocked' AND created_at > now() - interval '24 hours'),
    (SELECT max(created_at) FROM public.source_audit_log)
  WHERE public.has_staff_role(auth.uid());
$$;
