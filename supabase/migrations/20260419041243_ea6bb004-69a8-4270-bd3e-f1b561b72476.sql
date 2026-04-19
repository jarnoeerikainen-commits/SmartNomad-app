-- 1) GDPR Article 17: allow owners to delete their snomad profile
CREATE POLICY "Auth users delete own snomad profile"
  ON public.snomad_profiles FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- 2) Clean up orphan rows that have no user owner (legacy device-only data
--    that is now unreachable under the new auth-required RLS)
DELETE FROM public.chat_messages
  WHERE conversation_id IN (SELECT id FROM public.conversations WHERE user_id IS NULL);
DELETE FROM public.conversation_summaries
  WHERE conversation_id IN (SELECT id FROM public.conversations WHERE user_id IS NULL);
DELETE FROM public.conversations WHERE user_id IS NULL;
DELETE FROM public.trust_pass_credentials WHERE user_id IS NULL;

-- 3) Enforce NOT NULL on user_id for these tables
ALTER TABLE public.conversations ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.trust_pass_credentials ALTER COLUMN user_id SET NOT NULL;

-- 4) Belt-and-braces: explicit RESTRICTIVE policy ensuring non-admins can NEVER
--    insert into user_roles, even if a permissive policy is added later.
CREATE POLICY "Block non-admin role inserts"
  ON public.user_roles AS RESTRICTIVE
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));