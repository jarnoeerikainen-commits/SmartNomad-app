CREATE TABLE public.booking_travellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 120),
  citizenship_code text NOT NULL CHECK (citizenship_code ~ '^[A-Z]{2}$'),
  passport_last4 text CHECK (passport_last4 IS NULL OR passport_last4 ~ '^[A-Z0-9]{4}$'),
  document_status text NOT NULL DEFAULT 'missing' CHECK (document_status IN ('missing','encrypted','verified','expired')),
  encrypted_vault_ref text,
  contact_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, display_name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_travellers TO authenticated;
GRANT ALL ON public.booking_travellers TO service_role;
ALTER TABLE public.booking_travellers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own booking travellers" ON public.booking_travellers FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "users insert own booking travellers" ON public.booking_travellers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "users update own booking travellers" ON public.booking_travellers FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "users delete own booking travellers" ON public.booking_travellers FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "service role manages booking travellers" ON public.booking_travellers FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.booking_mandates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  traveller_id uuid NOT NULL REFERENCES public.booking_travellers(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','active','paused','revoked','expired')),
  allowed_booking_types text[] NOT NULL DEFAULT ARRAY['flight','hotel'],
  allowed_suppliers text[] NOT NULL DEFAULT ARRAY[]::text[],
  allowed_payment_rails text[] NOT NULL DEFAULT ARRAY['tokenized-card'],
  allowed_destination_codes text[] NOT NULL DEFAULT ARRAY[]::text[],
  allowed_currencies text[] NOT NULL DEFAULT ARRAY['EUR'],
  max_per_booking numeric(12,2) NOT NULL CHECK (max_per_booking > 0),
  max_daily numeric(12,2) NOT NULL CHECK (max_daily > 0),
  max_weekly numeric(12,2) NOT NULL CHECK (max_weekly > 0),
  require_user_present boolean NOT NULL DEFAULT true,
  require_fresh_approval_on_price_change boolean NOT NULL DEFAULT true,
  valid_from timestamptz NOT NULL DEFAULT now(),
  valid_until timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (valid_until > valid_from),
  CHECK (max_daily >= max_per_booking),
  CHECK (max_weekly >= max_daily)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_mandates TO authenticated;
GRANT ALL ON public.booking_mandates TO service_role;
ALTER TABLE public.booking_mandates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own booking mandates" ON public.booking_mandates FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "users insert own booking mandates" ON public.booking_mandates FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.booking_travellers t WHERE t.id = traveller_id AND t.user_id = auth.uid()));
CREATE POLICY "users update own booking mandates" ON public.booking_mandates FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "users delete own booking mandates" ON public.booking_mandates FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "service role manages booking mandates" ON public.booking_mandates FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.travel_booking_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_order_id text UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  traveller_id uuid NOT NULL REFERENCES public.booking_travellers(id) ON DELETE RESTRICT,
  mandate_id uuid REFERENCES public.booking_mandates(id) ON DELETE SET NULL,
  booking_type text NOT NULL CHECK (booking_type IN ('flight','hotel')),
  mode text NOT NULL CHECK (mode IN ('demo','sandbox','live')),
  supplier text NOT NULL,
  supplier_offer_id text NOT NULL,
  supplier_order_id text,
  itinerary_summary jsonb NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','priced','approval_required','mandate_eligible','payment_authorized','supplier_order_pending','ticketed','confirmed','failed','expired','cancelled')),
  payment_status text NOT NULL DEFAULT 'not_started' CHECK (payment_status IN ('not_started','requires_action','authorized','captured','failed','refunded')),
  approval_status text NOT NULL DEFAULT 'required' CHECK (approval_status IN ('required','approved','declined','mandate_approved','expired')),
  source_url text,
  verified_at timestamptz NOT NULL DEFAULT now(),
  offer_expires_at timestamptz NOT NULL,
  cancellation_terms text NOT NULL,
  idempotency_key text NOT NULL,
  reconciliation_status text NOT NULL DEFAULT 'not_started' CHECK (reconciliation_status IN ('not_started','pending','matched','mismatch','failed')),
  failure_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, idempotency_key)
);
GRANT SELECT ON public.travel_booking_orders TO authenticated;
GRANT ALL ON public.travel_booking_orders TO service_role;
ALTER TABLE public.travel_booking_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own travel booking orders" ON public.travel_booking_orders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "service role manages travel booking orders" ON public.travel_booking_orders FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.booking_approval_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_order_id uuid NOT NULL REFERENCES public.travel_booking_orders(id) ON DELETE CASCADE,
  decision text NOT NULL CHECK (decision IN ('approved','declined','expired','revoked')),
  approved_amount numeric(12,2) NOT NULL CHECK (approved_amount > 0),
  approved_currency text NOT NULL CHECK (approved_currency ~ '^[A-Z]{3}$'),
  authentication_strength text NOT NULL CHECK (authentication_strength IN ('session','mfa','passkey','voice_plus_visual')),
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.booking_approval_events TO authenticated;
GRANT ALL ON public.booking_approval_events TO service_role;
ALTER TABLE public.booking_approval_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own booking approvals" ON public.booking_approval_events FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "service role manages booking approvals" ON public.booking_approval_events FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.booking_payment_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_order_id uuid NOT NULL REFERENCES public.travel_booking_orders(id) ON DELETE CASCADE,
  rail text NOT NULL CHECK (rail IN ('tokenized-card','lightspark-uma','stablecoin-settlement')),
  provider text NOT NULL,
  provider_token_ref text NOT NULL,
  masked_reference text NOT NULL,
  authorization_status text NOT NULL DEFAULT 'pending' CHECK (authorization_status IN ('pending','requires_action','authorized','captured','failed','revoked')),
  provider_transaction_ref text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_token_ref)
);
GRANT SELECT ON public.booking_payment_references TO authenticated;
GRANT ALL ON public.booking_payment_references TO service_role;
ALTER TABLE public.booking_payment_references ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own booking payment references" ON public.booking_payment_references FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "service role manages booking payment references" ON public.booking_payment_references FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_booking_travellers_user ON public.booking_travellers(user_id);
CREATE INDEX idx_booking_mandates_active ON public.booking_mandates(user_id, status, valid_until);
CREATE INDEX idx_booking_orders_user_status ON public.travel_booking_orders(user_id, status, created_at DESC);
CREATE INDEX idx_booking_orders_offer ON public.travel_booking_orders(supplier, supplier_offer_id);
CREATE INDEX idx_booking_approvals_order ON public.booking_approval_events(booking_order_id, created_at DESC);
CREATE INDEX idx_booking_payment_order ON public.booking_payment_references(booking_order_id);

CREATE TRIGGER update_booking_travellers_updated_at BEFORE UPDATE ON public.booking_travellers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_booking_mandates_updated_at BEFORE UPDATE ON public.booking_mandates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_travel_booking_orders_updated_at BEFORE UPDATE ON public.travel_booking_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_booking_payment_references_updated_at BEFORE UPDATE ON public.booking_payment_references FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();