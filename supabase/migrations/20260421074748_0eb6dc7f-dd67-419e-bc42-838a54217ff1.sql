
-- Agentic Payments backend tables
-- Supports x402, MPP, Visa TAP, Stripe Issuing in one unified schema

-- 1. Spending guardrails (per user)
CREATE TABLE public.agentic_guardrails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_id text NOT NULL,
  name text NOT NULL,
  description text,
  max_per_transaction numeric(12,2) NOT NULL DEFAULT 100,
  max_daily numeric(12,2) NOT NULL DEFAULT 500,
  max_weekly numeric(12,2) NOT NULL DEFAULT 2000,
  currency text NOT NULL DEFAULT 'USD',
  allowed_categories text[] NOT NULL DEFAULT '{}',
  blocked_categories text[] NOT NULL DEFAULT '{}',
  allowed_protocols text[] NOT NULL DEFAULT ARRAY['x402','mpp','visa-tap','stripe-issuing'],
  approval_threshold numeric(12,2) NOT NULL DEFAULT 50,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agentic_guardrails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own guardrails" ON public.agentic_guardrails
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "users insert own guardrails" ON public.agentic_guardrails
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "users update own guardrails" ON public.agentic_guardrails
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "users delete own guardrails" ON public.agentic_guardrails
  FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "service role manages guardrails" ON public.agentic_guardrails
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_agentic_guardrails_user ON public.agentic_guardrails(user_id) WHERE is_active = true;

-- 2. Virtual cards (Stripe Issuing-style)
CREATE TABLE public.agentic_virtual_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_id text NOT NULL,
  card_token text UNIQUE NOT NULL,
  last4 text NOT NULL,
  network text NOT NULL CHECK (network IN ('visa','mastercard')),
  card_type text NOT NULL CHECK (card_type IN ('single-use','recurring','merchant-locked')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','used','expired','cancelled')),
  amount_authorized numeric(12,2) NOT NULL,
  amount_spent numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  merchant_lock text,
  category_lock text,
  provider text NOT NULL DEFAULT 'stripe-issuing',
  provider_card_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used_at timestamptz
);

ALTER TABLE public.agentic_virtual_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own vcards" ON public.agentic_virtual_cards
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "users insert own vcards" ON public.agentic_virtual_cards
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "users update own vcards" ON public.agentic_virtual_cards
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "service role manages vcards" ON public.agentic_virtual_cards
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_vcards_user_status ON public.agentic_virtual_cards(user_id, status);

-- 3. Payment intents (router state machine)
CREATE TABLE public.agentic_payment_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id text UNIQUE NOT NULL,
  user_id uuid NOT NULL,
  device_id text NOT NULL,
  protocol text NOT NULL CHECK (protocol IN ('x402','mpp','visa-tap','stripe-issuing','mastercard-cloud')),
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created','quoted','authorized','executing','completed','failed','cancelled','refunded')),
  description text NOT NULL,
  amount numeric(14,4) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  category text NOT NULL,
  merchant text,
  merchant_url text,
  ai_initiated boolean NOT NULL DEFAULT true,
  user_approved boolean NOT NULL DEFAULT false,
  guardrail_id uuid REFERENCES public.agentic_guardrails(id) ON DELETE SET NULL,
  virtual_card_id uuid REFERENCES public.agentic_virtual_cards(id) ON DELETE SET NULL,
  protocol_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  receipt jsonb,
  trust_score integer,
  failure_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  authorized_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '15 minutes')
);

ALTER TABLE public.agentic_payment_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own intents" ON public.agentic_payment_intents
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "users insert own intents" ON public.agentic_payment_intents
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "users update own intents" ON public.agentic_payment_intents
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "service role manages intents" ON public.agentic_payment_intents
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_intents_user_status ON public.agentic_payment_intents(user_id, status);
CREATE INDEX idx_intents_protocol ON public.agentic_payment_intents(protocol, created_at DESC);

-- 4. Settled transactions (immutable ledger)
CREATE TABLE public.agentic_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id uuid REFERENCES public.agentic_payment_intents(id) ON DELETE SET NULL,
  user_id uuid NOT NULL,
  device_id text NOT NULL,
  protocol text NOT NULL,
  description text NOT NULL,
  amount numeric(14,4) NOT NULL,
  currency text NOT NULL,
  category text NOT NULL,
  merchant text,
  status text NOT NULL CHECK (status IN ('completed','refunded','disputed')),
  ai_initiated boolean NOT NULL DEFAULT true,
  user_approved boolean NOT NULL DEFAULT false,
  virtual_card_last4 text,
  crypto_network text,
  crypto_tx_hash text,
  trust_score integer,
  receipt jsonb NOT NULL DEFAULT '{}'::jsonb,
  settled_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agentic_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own transactions" ON public.agentic_transactions
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "service role inserts transactions" ON public.agentic_transactions
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "service role updates transactions" ON public.agentic_transactions
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_txns_user_settled ON public.agentic_transactions(user_id, settled_at DESC);

-- 5. Guardrail evaluation RPC (returns approval verdict)
CREATE OR REPLACE FUNCTION public.evaluate_agentic_guardrail(
  p_user_id uuid,
  p_amount numeric,
  p_currency text,
  p_category text,
  p_protocol text
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_guardrail public.agentic_guardrails%ROWTYPE;
  v_daily_spent numeric := 0;
  v_weekly_spent numeric := 0;
BEGIN
  -- Find the most specific active guardrail (matches category)
  SELECT * INTO v_guardrail
  FROM public.agentic_guardrails
  WHERE user_id = p_user_id
    AND is_active = true
    AND (allowed_categories = '{}' OR p_category = ANY(allowed_categories))
    AND NOT (p_category = ANY(blocked_categories))
    AND p_protocol = ANY(allowed_protocols)
    AND currency = p_currency
  ORDER BY array_length(allowed_categories, 1) NULLS LAST
  LIMIT 1;

  IF v_guardrail.id IS NULL THEN
    RETURN jsonb_build_object(
      'approved', false,
      'reason', 'no_matching_guardrail',
      'requires_user_approval', true
    );
  END IF;

  IF p_amount > v_guardrail.max_per_transaction THEN
    RETURN jsonb_build_object(
      'approved', false,
      'guardrail_id', v_guardrail.id,
      'reason', 'exceeds_per_transaction_limit',
      'limit', v_guardrail.max_per_transaction,
      'requires_user_approval', true
    );
  END IF;

  -- Daily / weekly spend totals
  SELECT COALESCE(SUM(amount), 0) INTO v_daily_spent
  FROM public.agentic_transactions
  WHERE user_id = p_user_id
    AND currency = p_currency
    AND settled_at > now() - interval '24 hours'
    AND status = 'completed';

  SELECT COALESCE(SUM(amount), 0) INTO v_weekly_spent
  FROM public.agentic_transactions
  WHERE user_id = p_user_id
    AND currency = p_currency
    AND settled_at > now() - interval '7 days'
    AND status = 'completed';

  IF v_daily_spent + p_amount > v_guardrail.max_daily THEN
    RETURN jsonb_build_object(
      'approved', false,
      'guardrail_id', v_guardrail.id,
      'reason', 'exceeds_daily_limit',
      'requires_user_approval', true
    );
  END IF;

  IF v_weekly_spent + p_amount > v_guardrail.max_weekly THEN
    RETURN jsonb_build_object(
      'approved', false,
      'guardrail_id', v_guardrail.id,
      'reason', 'exceeds_weekly_limit',
      'requires_user_approval', true
    );
  END IF;

  RETURN jsonb_build_object(
    'approved', true,
    'guardrail_id', v_guardrail.id,
    'requires_user_approval', p_amount >= v_guardrail.approval_threshold,
    'auto_execute', p_amount < v_guardrail.approval_threshold,
    'daily_spent', v_daily_spent,
    'weekly_spent', v_weekly_spent
  );
END;
$$;

-- 6. Updated-at trigger for guardrails
CREATE TRIGGER update_agentic_guardrails_updated_at
  BEFORE UPDATE ON public.agentic_guardrails
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_timestamp();
