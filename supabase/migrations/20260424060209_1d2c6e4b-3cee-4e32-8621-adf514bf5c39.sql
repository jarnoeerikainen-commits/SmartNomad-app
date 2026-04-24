-- Allow anyone (anon + authenticated) to read demo organizations so the
-- Corporate Travel showcase works for guests on the public preview.
DROP POLICY IF EXISTS "anyone reads demo orgs" ON public.organizations;
CREATE POLICY "anyone reads demo orgs"
  ON public.organizations FOR SELECT TO anon, authenticated
  USING (demo = true);