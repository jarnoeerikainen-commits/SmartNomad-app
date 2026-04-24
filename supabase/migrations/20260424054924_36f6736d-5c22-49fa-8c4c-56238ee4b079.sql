-- ============================================================================
-- SECURITY HARDENING — Pen-test pass 4 (24 Apr 2026)
-- ============================================================================

-- FIX A — Receipts storage bucket: drop spoofable device-id branch
DROP POLICY IF EXISTS receipts_owner_select ON storage.objects;
DROP POLICY IF EXISTS receipts_owner_insert ON storage.objects;
DROP POLICY IF EXISTS receipts_owner_update ON storage.objects;
DROP POLICY IF EXISTS receipts_owner_delete ON storage.objects;

CREATE POLICY receipts_owner_select ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'receipts'
         AND auth.uid() IS NOT NULL
         AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY receipts_owner_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'receipts'
              AND auth.uid() IS NOT NULL
              AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY receipts_owner_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'receipts'
         AND auth.uid() IS NOT NULL
         AND (auth.uid())::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'receipts'
              AND auth.uid() IS NOT NULL
              AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY receipts_owner_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'receipts'
         AND auth.uid() IS NOT NULL
         AND (auth.uid())::text = (storage.foldername(name))[1]);

-- FIX B — Organizations: hide billing fields from non-members.
-- Demo orgs remain discoverable via a safe view that exposes only public columns.
DROP POLICY IF EXISTS "members can view their org" ON public.organizations;

CREATE POLICY "members can view their org"
  ON public.organizations FOR SELECT TO authenticated
  USING (is_org_member(id));

-- Public-safe view for demo discovery (no billing fields)
CREATE OR REPLACE VIEW public.organizations_public
WITH (security_invoker = true)
AS
SELECT
  id, name, slug, logo_url, demo, created_at, updated_at
FROM public.organizations
WHERE demo = true;

GRANT SELECT ON public.organizations_public TO authenticated;

-- FIX C — AI cache: explicit deny for non-service-role reads
-- (No SELECT policy already blocks; add a NULL-returning one to be explicit
--  and audit-friendly. Service role still has its ALL policy.)
CREATE POLICY ai_cache_no_client_read
  ON public.ai_cache FOR SELECT TO authenticated
  USING (false);