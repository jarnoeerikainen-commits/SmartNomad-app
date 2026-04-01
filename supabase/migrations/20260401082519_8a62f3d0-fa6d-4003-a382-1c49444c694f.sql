
-- B2B API Gateway: Partners, Access Policies, Audit Logs

-- API Partners table
CREATE TABLE public.api_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name text NOT NULL,
  partner_slug text NOT NULL UNIQUE,
  api_key_hash text NOT NULL,
  api_key_prefix text NOT NULL,
  contact_email text NOT NULL,
  contact_name text,
  company_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked', 'pending')),
  tier text NOT NULL DEFAULT 'basic' CHECK (tier IN ('basic', 'standard', 'premium', 'enterprise')),
  rate_limit_per_minute integer NOT NULL DEFAULT 60,
  rate_limit_per_day integer NOT NULL DEFAULT 10000,
  allowed_ips text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  last_request_at timestamptz
);

-- Access Policies: what data each partner can access
CREATE TABLE public.api_access_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.api_partners(id) ON DELETE CASCADE,
  resource_type text NOT NULL,
  resource_category text,
  permission text NOT NULL DEFAULT 'read' CHECK (permission IN ('read', 'write', 'read_write')),
  field_restrictions text[] DEFAULT '{}',
  filter_conditions jsonb DEFAULT '{}',
  anonymize_pii boolean NOT NULL DEFAULT true,
  max_records_per_request integer DEFAULT 100,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(partner_id, resource_type, resource_category)
);

-- Audit Logs: track every API call
CREATE TABLE public.api_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.api_partners(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  method text NOT NULL,
  request_path text,
  request_params jsonb DEFAULT '{}',
  response_status integer NOT NULL,
  response_size_bytes integer DEFAULT 0,
  records_returned integer DEFAULT 0,
  latency_ms integer DEFAULT 0,
  ip_address text,
  user_agent text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_api_partners_slug ON public.api_partners(partner_slug);
CREATE INDEX idx_api_partners_status ON public.api_partners(status);
CREATE INDEX idx_api_access_policies_partner ON public.api_access_policies(partner_id);
CREATE INDEX idx_api_access_policies_resource ON public.api_access_policies(resource_type);
CREATE INDEX idx_api_audit_logs_partner ON public.api_audit_logs(partner_id);
CREATE INDEX idx_api_audit_logs_created ON public.api_audit_logs(created_at DESC);
CREATE INDEX idx_api_audit_logs_endpoint ON public.api_audit_logs(endpoint);

-- RLS: Only service role (SuperNomad admin) can access these tables
ALTER TABLE public.api_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_access_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_audit_logs ENABLE ROW LEVEL SECURITY;

-- No public policies = only service_role can access (B2B invisible to users)
-- Service role bypasses RLS automatically

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_api_partner_timestamp()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_api_partners_updated
  BEFORE UPDATE ON public.api_partners
  FOR EACH ROW EXECUTE FUNCTION public.update_api_partner_timestamp();

CREATE TRIGGER trg_api_access_policies_updated
  BEFORE UPDATE ON public.api_access_policies
  FOR EACH ROW EXECUTE FUNCTION public.update_api_partner_timestamp();
