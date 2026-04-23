-- ============================================================================
-- B2B CORPORATE TRAVEL LAYER
-- ============================================================================

-- Organizations (companies)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  legal_name TEXT,
  tax_id TEXT,
  billing_email TEXT NOT NULL,
  billing_method TEXT NOT NULL DEFAULT 'invoice' CHECK (billing_method IN ('invoice','credit_card','wire','direct_debit')),
  billing_currency TEXT NOT NULL DEFAULT 'USD',
  country_code TEXT,
  join_code TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  size_band TEXT CHECK (size_band IN ('1-10','11-50','51-200','201-1000','1000+')),
  industry TEXT,
  demo BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  travel_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_organizations_join_code ON public.organizations(join_code);
CREATE INDEX idx_organizations_created_by ON public.organizations(created_by);

-- Organization members
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('owner','admin','manager','employee')),
  department TEXT,
  employee_id TEXT,
  job_title TEXT,
  cost_center TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  invited_by UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (organization_id, user_id)
);

CREATE INDEX idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX idx_org_members_org ON public.organization_members(organization_id);

-- Organization invites
CREATE TABLE public.organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin','manager','employee')),
  department TEXT,
  invited_by UUID NOT NULL,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','revoked','expired')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '14 days'),
  accepted_at TIMESTAMPTZ,
  accepted_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_org_invites_email ON public.organization_invites(email) WHERE status = 'pending';
CREATE INDEX idx_org_invites_org ON public.organization_invites(organization_id);

-- Business trips
CREATE TABLE public.business_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  trip_code TEXT NOT NULL DEFAULT ('TR-' || upper(substring(encode(gen_random_bytes(4),'hex') for 8))),
  purpose TEXT NOT NULL,
  destination_city TEXT,
  destination_country TEXT,
  origin_city TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  estimated_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  actual_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','rejected','booked','completed','cancelled')),
  approver_id UUID,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  policy_violations JSONB NOT NULL DEFAULT '[]'::jsonb,
  booking_refs JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_trips_org ON public.business_trips(organization_id);
CREATE INDEX idx_business_trips_user ON public.business_trips(user_id);
CREATE INDEX idx_business_trips_status ON public.business_trips(status);
CREATE INDEX idx_business_trips_dates ON public.business_trips(start_date, end_date);

-- Business trip expense lines
CREATE TABLE public.business_trip_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.business_trips(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('flight','hotel','rail','car_rental','taxi','meals','entertainment','communication','visa','insurance','other')),
  description TEXT NOT NULL,
  vendor TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  amount_base NUMERIC(12,2),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  is_billable BOOLEAN NOT NULL DEFAULT true,
  is_reimbursable BOOLEAN NOT NULL DEFAULT false,
  payment_method TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trip_expenses_trip ON public.business_trip_expenses(trip_id);
CREATE INDEX idx_trip_expenses_org ON public.business_trip_expenses(organization_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Returns true if the current user is an active member of the org
CREATE OR REPLACE FUNCTION public.is_org_member(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = p_org_id
      AND user_id = auth.uid()
      AND is_active = true
  );
$$;

-- Returns true if the current user is owner or admin of the org
CREATE OR REPLACE FUNCTION public.is_org_admin(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = p_org_id
      AND user_id = auth.uid()
      AND is_active = true
      AND role IN ('owner','admin')
  );
$$;

-- Returns true if user can approve trips (manager/admin/owner)
CREATE OR REPLACE FUNCTION public.is_org_approver(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = p_org_id
      AND user_id = auth.uid()
      AND is_active = true
      AND role IN ('owner','admin','manager')
  );
$$;

-- Generate unique 8-char alphanumeric join code
CREATE OR REPLACE FUNCTION public.generate_org_join_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  alphabet TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INT;
  attempts INT := 0;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    IF NOT EXISTS (SELECT 1 FROM public.organizations WHERE join_code = result) THEN
      RETURN result;
    END IF;
    attempts := attempts + 1;
    IF attempts > 10 THEN RAISE EXCEPTION 'Could not generate unique join code'; END IF;
  END LOOP;
END;
$$;

-- Auto-set join code if missing
CREATE OR REPLACE FUNCTION public.tg_org_set_join_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.join_code IS NULL OR NEW.join_code = '' THEN
    NEW.join_code := public.generate_org_join_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_org_set_join_code
  BEFORE INSERT ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.tg_org_set_join_code();

CREATE TRIGGER trg_org_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_business_trip_updated_at
  BEFORE UPDATE ON public.business_trips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_trip_expenses ENABLE ROW LEVEL SECURITY;

-- organizations
CREATE POLICY "members can view their org"
  ON public.organizations FOR SELECT
  USING (public.is_org_member(id) OR demo = true);

CREATE POLICY "authenticated users can create orgs"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "admins can update their org"
  ON public.organizations FOR UPDATE
  USING (public.is_org_admin(id));

CREATE POLICY "owners can delete their org"
  ON public.organizations FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = organizations.id AND user_id = auth.uid() AND role = 'owner'
  ));

-- organization_members
CREATE POLICY "members see members of their orgs"
  ON public.organization_members FOR SELECT
  USING (public.is_org_member(organization_id) OR user_id = auth.uid());

CREATE POLICY "admins can add members"
  ON public.organization_members FOR INSERT
  WITH CHECK (public.is_org_admin(organization_id) OR user_id = auth.uid());

CREATE POLICY "admins can update members"
  ON public.organization_members FOR UPDATE
  USING (public.is_org_admin(organization_id) OR user_id = auth.uid());

CREATE POLICY "admins can remove members"
  ON public.organization_members FOR DELETE
  USING (public.is_org_admin(organization_id) OR user_id = auth.uid());

-- organization_invites
CREATE POLICY "admins can view invites"
  ON public.organization_invites FOR SELECT
  USING (public.is_org_admin(organization_id));

CREATE POLICY "admins can create invites"
  ON public.organization_invites FOR INSERT
  WITH CHECK (public.is_org_admin(organization_id) AND invited_by = auth.uid());

CREATE POLICY "admins can revoke invites"
  ON public.organization_invites FOR UPDATE
  USING (public.is_org_admin(organization_id));

-- business_trips
CREATE POLICY "users see own trips, approvers see org trips"
  ON public.business_trips FOR SELECT
  USING (user_id = auth.uid() OR public.is_org_approver(organization_id));

CREATE POLICY "members create own trips"
  ON public.business_trips FOR INSERT
  WITH CHECK (user_id = auth.uid() AND public.is_org_member(organization_id));

CREATE POLICY "owners update own trips, approvers update any"
  ON public.business_trips FOR UPDATE
  USING (user_id = auth.uid() OR public.is_org_approver(organization_id));

CREATE POLICY "owners delete draft trips"
  ON public.business_trips FOR DELETE
  USING (user_id = auth.uid() AND status = 'draft');

-- business_trip_expenses
CREATE POLICY "users see own expenses, admins see org expenses"
  ON public.business_trip_expenses FOR SELECT
  USING (user_id = auth.uid() OR public.is_org_admin(organization_id));

CREATE POLICY "users create expenses on own trips"
  ON public.business_trip_expenses FOR INSERT
  WITH CHECK (user_id = auth.uid() AND public.is_org_member(organization_id));

CREATE POLICY "users update own expenses"
  ON public.business_trip_expenses FOR UPDATE
  USING (user_id = auth.uid() OR public.is_org_admin(organization_id));

CREATE POLICY "users delete own expenses"
  ON public.business_trip_expenses FOR DELETE
  USING (user_id = auth.uid() OR public.is_org_admin(organization_id));

-- ============================================================================
-- AGGREGATE / REPORT FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_org_dashboard_stats(p_org_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  IF NOT (public.is_org_member(p_org_id) OR EXISTS (
    SELECT 1 FROM public.organizations WHERE id = p_org_id AND demo = true
  )) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  SELECT jsonb_build_object(
    'members_total', (SELECT count(*) FROM public.organization_members WHERE organization_id = p_org_id AND is_active = true),
    'trips_total', (SELECT count(*) FROM public.business_trips WHERE organization_id = p_org_id),
    'trips_pending', (SELECT count(*) FROM public.business_trips WHERE organization_id = p_org_id AND status = 'submitted'),
    'trips_active', (SELECT count(*) FROM public.business_trips WHERE organization_id = p_org_id AND status IN ('approved','booked')),
    'spend_30d', (SELECT COALESCE(sum(actual_cost),0) FROM public.business_trips WHERE organization_id = p_org_id AND end_date > now() - interval '30 days'),
    'spend_ytd', (SELECT COALESCE(sum(actual_cost),0) FROM public.business_trips WHERE organization_id = p_org_id AND date_trunc('year', start_date) = date_trunc('year', CURRENT_DATE)),
    'top_destinations', (
      SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
        SELECT destination_country AS country, count(*) AS trips, COALESCE(sum(actual_cost),0) AS spend
        FROM public.business_trips
        WHERE organization_id = p_org_id AND destination_country IS NOT NULL
        GROUP BY destination_country
        ORDER BY count(*) DESC
        LIMIT 5
      ) t
    ),
    'spend_by_category', (
      SELECT COALESCE(jsonb_object_agg(category, total), '{}'::jsonb) FROM (
        SELECT category, COALESCE(sum(amount),0) AS total
        FROM public.business_trip_expenses
        WHERE organization_id = p_org_id
          AND expense_date > now() - interval '90 days'
        GROUP BY category
      ) t
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;