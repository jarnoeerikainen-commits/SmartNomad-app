-- Allow public read access to demo organization data so logged-in users
-- (who are not members) can browse the seeded Acme Global Inc. demo.
-- Demo data is fictional, so this is safe.

-- organization_members: allow read for demo orgs
CREATE POLICY "anyone reads demo org members"
  ON public.organization_members
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = organization_members.organization_id
        AND o.demo = true
    )
  );

-- business_trips: allow read for demo orgs
CREATE POLICY "anyone reads demo org trips"
  ON public.business_trips
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = business_trips.organization_id
        AND o.demo = true
    )
  );

-- business_trip_expenses: allow read for demo orgs
CREATE POLICY "anyone reads demo org expenses"
  ON public.business_trip_expenses
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = business_trip_expenses.organization_id
        AND o.demo = true
    )
  );