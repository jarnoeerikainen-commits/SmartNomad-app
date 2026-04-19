-- Allow users to delete their own device sessions
CREATE POLICY "Auth users delete own session"
  ON public.device_sessions FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Belt-and-braces RESTRICTIVE policies: no non-admin may ever update or
-- delete user_roles rows, even if a permissive policy is added later.
CREATE POLICY "Block non-admin role updates"
  ON public.user_roles AS RESTRICTIVE
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Block non-admin role deletes"
  ON public.user_roles AS RESTRICTIVE
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));