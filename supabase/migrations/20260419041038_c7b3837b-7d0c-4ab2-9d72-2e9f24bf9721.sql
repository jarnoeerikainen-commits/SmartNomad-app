-- Explicit admin-only read policies for B2B API gateway tables.
-- Edge functions still manage these via service_role (bypasses RLS).

CREATE POLICY "Admins read api partners"
  ON public.api_partners FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins read api access policies"
  ON public.api_access_policies FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins read api audit logs"
  ON public.api_audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));