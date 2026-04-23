
-- TAX & EXPENSE SYSTEM — Phase 1 + 2

CREATE TABLE public.expense_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  device_id TEXT NOT NULL,
  title TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'business' CHECK (purpose IN ('business','personal','mixed')),
  business_percentage INTEGER NOT NULL DEFAULT 100 CHECK (business_percentage BETWEEN 0 AND 100),
  primary_country_code TEXT,
  countries TEXT[] NOT NULL DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  per_diem_mode BOOLEAN NOT NULL DEFAULT false,
  per_diem_country_code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','closed','submitted','reimbursed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_expense_trips_device ON public.expense_trips(device_id);
CREATE INDEX idx_expense_trips_user ON public.expense_trips(user_id);
CREATE INDEX idx_expense_trips_dates ON public.expense_trips(start_date, end_date);

CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  device_id TEXT NOT NULL,
  trip_id UUID NULL REFERENCES public.expense_trips(id) ON DELETE SET NULL,
  expense_date DATE NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  amount_home NUMERIC(14,2),
  home_currency TEXT,
  fx_rate NUMERIC(18,8),
  fx_rate_date DATE,
  fx_source TEXT,
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN (
    'flight','hotel','meal','transport','mileage','daily_allowance',
    'fuel','parking','tolls','phone','internet','supplies','entertainment',
    'conference','training','gift','other'
  )),
  description TEXT NOT NULL DEFAULT '',
  vendor TEXT,
  vendor_country_code TEXT,
  payment_method TEXT,
  vat_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  vat_rate NUMERIC(5,2),
  supplier_vat_id TEXT,
  vat_reclaimable BOOLEAN NOT NULL DEFAULT false,
  vat_reclaim_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  is_business BOOLEAN NOT NULL DEFAULT true,
  business_percentage INTEGER NOT NULL DEFAULT 100 CHECK (business_percentage BETWEEN 0 AND 100),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN (
    'manual','ocr','wallet','email','bank_feed','agentic_payment','import'
  )),
  source_ref TEXT,
  receipt_id UUID NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft','confirmed','submitted','approved','rejected','reimbursed','reclaim_pending','reclaimed'
  )),
  reclaim_status TEXT NOT NULL DEFAULT 'none' CHECK (reclaim_status IN (
    'none','eligible','submitted','approved','rejected','paid'
  )),
  tags TEXT[] NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_expenses_device ON public.expenses(device_id);
CREATE INDEX idx_expenses_user ON public.expenses(user_id);
CREATE INDEX idx_expenses_trip ON public.expenses(trip_id);
CREATE INDEX idx_expenses_date ON public.expenses(expense_date DESC);
CREATE INDEX idx_expenses_category ON public.expenses(category);
CREATE INDEX idx_expenses_source ON public.expenses(source);

CREATE TABLE public.expense_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  device_id TEXT NOT NULL,
  expense_id UUID NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  file_size_bytes INTEGER,
  sha256 TEXT,
  ocr_status TEXT NOT NULL DEFAULT 'pending' CHECK (ocr_status IN ('pending','processing','done','failed','skipped')),
  ocr_raw JSONB,
  ocr_extracted JSONB,
  ocr_confidence NUMERIC(4,3),
  ocr_model TEXT,
  ocr_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_expense_receipts_device ON public.expense_receipts(device_id);
CREATE INDEX idx_expense_receipts_expense ON public.expense_receipts(expense_id);

ALTER TABLE public.expenses
  ADD CONSTRAINT fk_expenses_receipt
  FOREIGN KEY (receipt_id) REFERENCES public.expense_receipts(id) ON DELETE SET NULL;

CREATE TABLE public.per_diem_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  city TEXT,
  region TEXT,
  year INTEGER NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  lodging_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  meals_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  incidentals_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  daily_total NUMERIC(10,2) GENERATED ALWAYS AS (lodging_rate + meals_rate + incidentals_rate) STORED,
  currency TEXT NOT NULL DEFAULT 'USD',
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);
CREATE UNIQUE INDEX uq_per_diem_unique ON public.per_diem_rates (source, country_code, COALESCE(city,''), year);
CREATE INDEX idx_per_diem_country_year ON public.per_diem_rates(country_code, year);

CREATE TABLE public.mileage_rates_official (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  year INTEGER NOT NULL,
  rate_per_km NUMERIC(8,4),
  rate_per_mile NUMERIC(8,4),
  currency TEXT NOT NULL,
  vehicle_type TEXT NOT NULL DEFAULT 'car' CHECK (vehicle_type IN ('car','motorcycle','bicycle','ev')),
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (country_code, year, vehicle_type)
);

CREATE TABLE public.vat_reclaim_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  category TEXT NOT NULL,
  standard_vat_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  reclaim_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  business_only BOOLEAN NOT NULL DEFAULT true,
  conditions TEXT,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (country_code, category)
);
CREATE INDEX idx_vat_rules_country ON public.vat_reclaim_rules(country_code);

CREATE TABLE public.expense_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  device_id TEXT NOT NULL,
  expense_id UUID,
  action TEXT NOT NULL,
  before_state JSONB,
  after_state JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_expense_audit_device ON public.expense_audit_log(device_id);
CREATE INDEX idx_expense_audit_expense ON public.expense_audit_log(expense_id);

CREATE TABLE public.expense_terms_acceptance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  device_id TEXT NOT NULL,
  terms_version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE (device_id, terms_version)
);

-- updated_at triggers — create the helper if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_expense_trips_updated BEFORE UPDATE ON public.expense_trips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_expenses_updated BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.expense_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.per_diem_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mileage_rates_official ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vat_reclaim_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_terms_acceptance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trips_owner_all" ON public.expense_trips
  FOR ALL USING (public.check_data_access(device_id, user_id))
  WITH CHECK (public.check_data_access(device_id, user_id));

CREATE POLICY "expenses_owner_all" ON public.expenses
  FOR ALL USING (public.check_data_access(device_id, user_id))
  WITH CHECK (public.check_data_access(device_id, user_id));

CREATE POLICY "receipts_owner_all" ON public.expense_receipts
  FOR ALL USING (public.check_data_access(device_id, user_id))
  WITH CHECK (public.check_data_access(device_id, user_id));

CREATE POLICY "per_diem_public_read" ON public.per_diem_rates
  FOR SELECT USING (true);
CREATE POLICY "per_diem_admin_write" ON public.per_diem_rates
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "mileage_public_read" ON public.mileage_rates_official
  FOR SELECT USING (true);
CREATE POLICY "mileage_admin_write" ON public.mileage_rates_official
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "vat_rules_public_read" ON public.vat_reclaim_rules
  FOR SELECT USING (true);
CREATE POLICY "vat_rules_admin_write" ON public.vat_reclaim_rules
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "audit_owner_read" ON public.expense_audit_log
  FOR SELECT USING (public.check_data_access(device_id, user_id));
CREATE POLICY "audit_owner_insert" ON public.expense_audit_log
  FOR INSERT WITH CHECK (public.check_data_access(device_id, user_id));

CREATE POLICY "terms_owner_read" ON public.expense_terms_acceptance
  FOR SELECT USING (public.check_data_access(device_id, user_id));
CREATE POLICY "terms_owner_insert" ON public.expense_terms_acceptance
  FOR INSERT WITH CHECK (public.check_data_access(device_id, user_id));

-- Storage bucket for receipts (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "receipts_owner_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'receipts'
    AND (
      (auth.uid() IS NOT NULL AND auth.uid()::text = (storage.foldername(name))[1])
      OR (storage.foldername(name))[1] = public.get_request_device_id()
    )
  );

CREATE POLICY "receipts_owner_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'receipts'
    AND (
      (auth.uid() IS NOT NULL AND auth.uid()::text = (storage.foldername(name))[1])
      OR (storage.foldername(name))[1] = public.get_request_device_id()
    )
  );

CREATE POLICY "receipts_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'receipts'
    AND (
      (auth.uid() IS NOT NULL AND auth.uid()::text = (storage.foldername(name))[1])
      OR (storage.foldername(name))[1] = public.get_request_device_id()
    )
  );

CREATE POLICY "receipts_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'receipts'
    AND (
      (auth.uid() IS NOT NULL AND auth.uid()::text = (storage.foldername(name))[1])
      OR (storage.foldername(name))[1] = public.get_request_device_id()
    )
  );
