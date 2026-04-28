CREATE TABLE IF NOT EXISTS public.production_resilience_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_key text NOT NULL,
  check_type text NOT NULL,
  environment text NOT NULL DEFAULT 'production',
  provider text NOT NULL DEFAULT 'supabase',
  primary_region text,
  backup_region text,
  status text NOT NULL DEFAULT 'planned',
  severity text NOT NULL DEFAULT 'high',
  last_checked_at timestamptz,
  next_due_at timestamptz,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  runbook_url text,
  owner_role text NOT NULL DEFAULT 'admin',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT production_resilience_checks_check_key_unique UNIQUE (check_key),
  CONSTRAINT production_resilience_checks_type_check CHECK (check_type IN ('postgres_pitr','database_export','restore_drill','storage_replication','edge_redeploy','secrets_rotation','dns_failover','read_replica','incident_drill')),
  CONSTRAINT production_resilience_checks_environment_check CHECK (environment IN ('demo','staging','production')),
  CONSTRAINT production_resilience_checks_status_check CHECK (status IN ('planned','ready','warning','failed','passed','not_applicable')),
  CONSTRAINT production_resilience_checks_severity_check CHECK (severity IN ('low','medium','high','critical'))
);

CREATE INDEX IF NOT EXISTS idx_production_resilience_checks_status_due
ON public.production_resilience_checks (environment, status, next_due_at);

ALTER TABLE public.production_resilience_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view production resilience checks" ON public.production_resilience_checks;
CREATE POLICY "Staff can view production resilience checks"
ON public.production_resilience_checks
FOR SELECT
TO authenticated
USING (public.has_staff_role(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage production resilience checks" ON public.production_resilience_checks;
CREATE POLICY "Admins can manage production resilience checks"
ON public.production_resilience_checks
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Service role can manage production resilience checks" ON public.production_resilience_checks;
CREATE POLICY "Service role can manage production resilience checks"
ON public.production_resilience_checks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP TRIGGER IF EXISTS update_production_resilience_checks_updated_at ON public.production_resilience_checks;
CREATE TRIGGER update_production_resilience_checks_updated_at
BEFORE UPDATE ON public.production_resilience_checks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.production_resilience_checks (
  check_key, check_type, environment, provider, primary_region, backup_region, status, severity, evidence, notes
) VALUES
  ('prod-postgres-pitr', 'postgres_pitr', 'production', 'supabase', NULL, NULL, 'planned', 'critical', '{"required_before_go_live":true,"target":"7-day PITR or stronger"}'::jsonb, 'Enable and verify point-in-time recovery before real production launch.'),
  ('prod-restore-drill', 'restore_drill', 'production', 'supabase', NULL, NULL, 'planned', 'critical', '{"required_before_go_live":true,"minimum_frequency":"quarterly"}'::jsonb, 'Run a restore drill and record evidence before real launch.'),
  ('prod-storage-replication', 'storage_replication', 'production', 'supabase', NULL, NULL, 'planned', 'high', '{"required_before_go_live":true,"buckets":["receipts","documents"]}'::jsonb, 'Enable cross-region replication or equivalent backup for production storage buckets.'),
  ('prod-edge-redeploy-proof', 'edge_redeploy', 'production', 'supabase', NULL, NULL, 'planned', 'high', '{"required_before_go_live":true}'::jsonb, 'Verify all edge functions can redeploy from repository source during recovery.'),
  ('prod-secrets-rotation-drill', 'secrets_rotation', 'production', 'supabase', NULL, NULL, 'planned', 'high', '{"required_before_go_live":true}'::jsonb, 'Verify production secrets can be rotated safely during incident recovery.'),
  ('prod-dns-failover', 'dns_failover', 'production', 'external', NULL, NULL, 'planned', 'medium', '{"required_before_go_live":false}'::jsonb, 'Plan DNS failover if a custom production domain is added.')
ON CONFLICT (check_key) DO UPDATE SET
  check_type = EXCLUDED.check_type,
  environment = EXCLUDED.environment,
  provider = EXCLUDED.provider,
  severity = EXCLUDED.severity,
  evidence = EXCLUDED.evidence,
  notes = EXCLUDED.notes,
  updated_at = now();