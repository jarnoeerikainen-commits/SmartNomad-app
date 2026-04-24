-- ============================================================================
-- RESTORE DEMO VISIBILITY for Corporate Travel (Acme Global Inc.)
-- Real orgs stay private; only rows where demo = true are exposed.
-- ============================================================================

-- 1) organizations_public view — allow anon role too (view already filters demo=true)
GRANT SELECT ON public.organizations_public TO anon;

-- 2) organization_members — public read for demo-org rows
DROP POLICY IF EXISTS "anyone reads demo org members" ON public.organization_members;
CREATE POLICY "anyone reads demo org members"
  ON public.organization_members FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_members.organization_id AND o.demo = true
  ));

-- 3) business_trips — public read for demo-org trips
DROP POLICY IF EXISTS "auth users read demo org trips" ON public.business_trips;
DROP POLICY IF EXISTS "anyone reads demo org trips" ON public.business_trips;
CREATE POLICY "anyone reads demo org trips"
  ON public.business_trips FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = business_trips.organization_id AND o.demo = true
  ));

-- 4) business_trip_expenses — public read for demo-org expenses
DROP POLICY IF EXISTS "auth users read demo org expenses" ON public.business_trip_expenses;
DROP POLICY IF EXISTS "anyone reads demo org expenses" ON public.business_trip_expenses;
CREATE POLICY "anyone reads demo org expenses"
  ON public.business_trip_expenses FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = business_trip_expenses.organization_id AND o.demo = true
  ));