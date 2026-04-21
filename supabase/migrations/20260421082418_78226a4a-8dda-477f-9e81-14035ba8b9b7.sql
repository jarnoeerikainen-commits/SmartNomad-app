-- ═══════════════════════════════════════════════════════════════════
-- AFFILIATE PROGRAM — 2-tier, global, production-ready
-- ═══════════════════════════════════════════════════════════════════

-- 1. Global program settings (single row, admin-managed)
CREATE TABLE public.affiliate_program_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  l1_commission_rate NUMERIC(5,4) NOT NULL DEFAULT 0.25,        -- 25% direct
  l2_commission_rate NUMERIC(5,4) NOT NULL DEFAULT 0.05,        -- 5% override on L1's earnings
  wallet_credit_split NUMERIC(5,4) NOT NULL DEFAULT 0.25,       -- 25% goes to wallet
  withdrawable_split NUMERIC(5,4) NOT NULL DEFAULT 0.75,        -- 75% withdrawable
  hold_days INTEGER NOT NULL DEFAULT 30,                         -- pending → cleared
  cookie_window_days INTEGER NOT NULL DEFAULT 90,
  min_payout_usd NUMERIC(10,2) NOT NULL DEFAULT 50,
  max_levels INTEGER NOT NULL DEFAULT 2,
  recurring_months INTEGER NOT NULL DEFAULT 12,                  -- pay commissions for first 12 months
  is_active BOOLEAN NOT NULL DEFAULT true,
  terms_version TEXT NOT NULL DEFAULT '1.0',
  terms_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO public.affiliate_program_settings (id) VALUES (1);

ALTER TABLE public.affiliate_program_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads program settings"
  ON public.affiliate_program_settings FOR SELECT
  TO public USING (true);

CREATE POLICY "Admins update program settings"
  ON public.affiliate_program_settings FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. Affiliate accounts (one per user)
CREATE TABLE public.affiliate_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,            -- defaults to Snomad ID
  status TEXT NOT NULL DEFAULT 'active',          -- active | suspended | banned
  tier TEXT NOT NULL DEFAULT 'standard',          -- standard | super | partner
  parent_affiliate_id UUID REFERENCES public.affiliate_accounts(id) ON DELETE SET NULL,
  parent_user_id UUID,
  
  -- Payout preferences
  payout_method TEXT NOT NULL DEFAULT 'wallet_credit', -- wallet_credit | usdc_base | stripe_connect | bank_wire
  payout_address TEXT,                            -- crypto address / stripe acct / IBAN (encrypted-on-app)
  payout_currency TEXT NOT NULL DEFAULT 'USD',
  
  -- Aggregate balances (USD)
  pending_balance NUMERIC(12,2) NOT NULL DEFAULT 0,    -- in hold period
  cleared_balance NUMERIC(12,2) NOT NULL DEFAULT 0,    -- ready (75% portion)
  wallet_credit_balance NUMERIC(12,2) NOT NULL DEFAULT 0, -- platform-only credit (25% portion)
  paid_lifetime NUMERIC(12,2) NOT NULL DEFAULT 0,
  reversed_lifetime NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  -- Stats
  total_clicks INTEGER NOT NULL DEFAULT 0,
  total_signups INTEGER NOT NULL DEFAULT 0,
  total_paying_referrals INTEGER NOT NULL DEFAULT 0,
  
  -- Compliance
  terms_accepted_version TEXT,
  terms_accepted_at TIMESTAMPTZ,
  tax_form_submitted BOOLEAN NOT NULL DEFAULT false,
  tax_form_type TEXT,                             -- W-9 | W-8BEN | EU-VAT | NONE
  
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliate_accounts_user ON public.affiliate_accounts(user_id);
CREATE INDEX idx_affiliate_accounts_code ON public.affiliate_accounts(referral_code);
CREATE INDEX idx_affiliate_accounts_parent ON public.affiliate_accounts(parent_affiliate_id);

ALTER TABLE public.affiliate_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own affiliate account"
  ON public.affiliate_accounts FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own affiliate account"
  ON public.affiliate_accounts FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own affiliate account"
  ON public.affiliate_accounts FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role manages affiliate accounts"
  ON public.affiliate_accounts FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins read all affiliate accounts"
  ON public.affiliate_accounts FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Referral clicks (server-side, anti-fraud)
CREATE TABLE public.referral_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliate_accounts(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  click_id TEXT NOT NULL UNIQUE,                  -- short hash for cookie
  
  ip_address TEXT,
  user_agent TEXT,
  fingerprint TEXT,                               -- device fingerprint
  country_code TEXT,
  landing_path TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referer_url TEXT,
  
  converted BOOLEAN NOT NULL DEFAULT false,
  converted_user_id UUID,
  converted_at TIMESTAMPTZ,
  
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '90 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clicks_affiliate ON public.referral_clicks(affiliate_id);
CREATE INDEX idx_clicks_click_id ON public.referral_clicks(click_id);
CREATE INDEX idx_clicks_converted_user ON public.referral_clicks(converted_user_id) WHERE converted_user_id IS NOT NULL;
CREATE INDEX idx_clicks_expires ON public.referral_clicks(expires_at);

ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates read own clicks"
  ON public.referral_clicks FOR SELECT TO authenticated
  USING (affiliate_id IN (SELECT id FROM public.affiliate_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Service role manages clicks"
  ON public.referral_clicks FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 4. Referrals (signup attribution, L1 + L2)
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level INTEGER NOT NULL CHECK (level IN (1, 2)),
  affiliate_id UUID NOT NULL REFERENCES public.affiliate_accounts(id) ON DELETE CASCADE,
  affiliate_user_id UUID NOT NULL,
  referred_user_id UUID NOT NULL,
  click_id TEXT,
  
  status TEXT NOT NULL DEFAULT 'active',          -- active | reversed | banned
  source_referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE, -- L2 points at the L1 it overrides
  
  signup_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_payment_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '12 months'),
  
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE (level, affiliate_id, referred_user_id)
);

CREATE INDEX idx_referrals_affiliate ON public.referrals(affiliate_id);
CREATE INDEX idx_referrals_referred_user ON public.referrals(referred_user_id);
CREATE INDEX idx_referrals_level ON public.referrals(level);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates read own referrals"
  ON public.referrals FOR SELECT TO authenticated
  USING (affiliate_user_id = auth.uid());

CREATE POLICY "Service role manages referrals"
  ON public.referrals FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins read all referrals"
  ON public.referrals FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Earnings ledger (immutable line items)
CREATE TABLE public.affiliate_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliate_accounts(id) ON DELETE CASCADE,
  affiliate_user_id UUID NOT NULL,
  referral_id UUID REFERENCES public.referrals(id) ON DELETE SET NULL,
  level INTEGER NOT NULL CHECK (level IN (1, 2)),
  
  -- Source transaction (subscription / payment)
  source_type TEXT NOT NULL,                      -- subscription | one_time | upgrade
  source_id TEXT,                                 -- stripe sub id / agentic intent id
  referred_user_id UUID NOT NULL,
  
  -- Amounts (USD)
  base_amount NUMERIC(12,2) NOT NULL,             -- the underlying transaction
  commission_rate NUMERIC(5,4) NOT NULL,
  commission_amount NUMERIC(12,2) NOT NULL,       -- base * rate
  wallet_credit_amount NUMERIC(12,2) NOT NULL,    -- 25% of commission
  withdrawable_amount NUMERIC(12,2) NOT NULL,     -- 75% of commission
  currency TEXT NOT NULL DEFAULT 'USD',
  
  status TEXT NOT NULL DEFAULT 'pending',         -- pending | cleared | paid | reversed
  hold_until TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  cleared_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  reversed_at TIMESTAMPTZ,
  reversal_reason TEXT,
  payout_id UUID,
  
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_earnings_affiliate ON public.affiliate_earnings(affiliate_id);
CREATE INDEX idx_earnings_status ON public.affiliate_earnings(status);
CREATE INDEX idx_earnings_hold ON public.affiliate_earnings(hold_until) WHERE status = 'pending';
CREATE INDEX idx_earnings_payout ON public.affiliate_earnings(payout_id) WHERE payout_id IS NOT NULL;

ALTER TABLE public.affiliate_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates read own earnings"
  ON public.affiliate_earnings FOR SELECT TO authenticated
  USING (affiliate_user_id = auth.uid());

CREATE POLICY "Service role manages earnings"
  ON public.affiliate_earnings FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins read all earnings"
  ON public.affiliate_earnings FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Payouts (withdrawal requests)
CREATE TABLE public.affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliate_accounts(id) ON DELETE CASCADE,
  affiliate_user_id UUID NOT NULL,
  
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  payout_method TEXT NOT NULL,                    -- wallet_credit | usdc_base | stripe_connect | bank_wire
  payout_address TEXT,
  
  status TEXT NOT NULL DEFAULT 'requested',       -- requested | processing | completed | failed | cancelled
  external_tx_id TEXT,
  external_tx_hash TEXT,                          -- crypto tx hash
  failure_reason TEXT,
  fee_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(12,2) NOT NULL,
  
  earnings_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_payouts_affiliate ON public.affiliate_payouts(affiliate_id);
CREATE INDEX idx_payouts_status ON public.affiliate_payouts(status);

ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates read own payouts"
  ON public.affiliate_payouts FOR SELECT TO authenticated
  USING (affiliate_user_id = auth.uid());

CREATE POLICY "Affiliates request own payouts"
  ON public.affiliate_payouts FOR INSERT TO authenticated
  WITH CHECK (affiliate_user_id = auth.uid() AND status = 'requested');

CREATE POLICY "Service role manages payouts"
  ON public.affiliate_payouts FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins read all payouts"
  ON public.affiliate_payouts FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ═══════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════

-- Auto-provision affiliate account using Snomad ID as referral code
CREATE OR REPLACE FUNCTION public.get_or_create_affiliate_account(p_user_id UUID)
RETURNS public.affiliate_accounts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_account public.affiliate_accounts;
  v_snomad_id TEXT;
BEGIN
  SELECT * INTO v_account FROM public.affiliate_accounts WHERE user_id = p_user_id;
  IF v_account.id IS NOT NULL THEN
    RETURN v_account;
  END IF;
  
  SELECT snomad_id INTO v_snomad_id FROM public.profiles WHERE id = p_user_id;
  IF v_snomad_id IS NULL THEN
    v_snomad_id := public.generate_snomad_id();
    UPDATE public.profiles SET snomad_id = v_snomad_id WHERE id = p_user_id;
  END IF;
  
  INSERT INTO public.affiliate_accounts (user_id, referral_code)
  VALUES (p_user_id, v_snomad_id)
  RETURNING * INTO v_account;
  
  RETURN v_account;
END;
$$;

-- Record a referral click (called by edge function with server-side data)
CREATE OR REPLACE FUNCTION public.record_referral_click(
  p_referral_code TEXT,
  p_click_id TEXT,
  p_ip TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_fingerprint TEXT DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_landing TEXT DEFAULT NULL,
  p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_referer TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_affiliate_id UUID;
  v_click_uuid UUID;
BEGIN
  SELECT id INTO v_affiliate_id FROM public.affiliate_accounts
  WHERE referral_code = p_referral_code AND status = 'active';
  
  IF v_affiliate_id IS NULL THEN RETURN NULL; END IF;
  
  INSERT INTO public.referral_clicks (
    affiliate_id, referral_code, click_id, ip_address, user_agent, fingerprint,
    country_code, landing_path, utm_source, utm_medium, utm_campaign, referer_url
  ) VALUES (
    v_affiliate_id, p_referral_code, p_click_id, p_ip, p_user_agent, p_fingerprint,
    p_country, p_landing, p_utm_source, p_utm_medium, p_utm_campaign, p_referer
  )
  ON CONFLICT (click_id) DO NOTHING
  RETURNING id INTO v_click_uuid;
  
  UPDATE public.affiliate_accounts SET total_clicks = total_clicks + 1, updated_at = now()
  WHERE id = v_affiliate_id;
  
  RETURN v_click_uuid;
END;
$$;

-- Attribute a new signup to a referral (creates L1 and L2 records)
CREATE OR REPLACE FUNCTION public.attribute_referral(
  p_referred_user_id UUID,
  p_click_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_click public.referral_clicks;
  v_l1_affiliate public.affiliate_accounts;
  v_l1_referral_id UUID;
  v_l2_referral_id UUID;
  v_settings public.affiliate_program_settings;
  v_recurring INTERVAL;
BEGIN
  SELECT * INTO v_settings FROM public.affiliate_program_settings WHERE id = 1;
  IF NOT v_settings.is_active THEN
    RETURN jsonb_build_object('attributed', false, 'reason', 'program_inactive');
  END IF;
  
  v_recurring := (v_settings.recurring_months || ' months')::interval;
  
  SELECT * INTO v_click FROM public.referral_clicks
  WHERE click_id = p_click_id AND converted = false AND expires_at > now();
  
  IF v_click.id IS NULL THEN
    RETURN jsonb_build_object('attributed', false, 'reason', 'invalid_or_expired_click');
  END IF;
  
  SELECT * INTO v_l1_affiliate FROM public.affiliate_accounts WHERE id = v_click.affiliate_id;
  
  -- Self-referral guard
  IF v_l1_affiliate.user_id = p_referred_user_id THEN
    RETURN jsonb_build_object('attributed', false, 'reason', 'self_referral_blocked');
  END IF;
  
  -- L1 referral
  INSERT INTO public.referrals (
    level, affiliate_id, affiliate_user_id, referred_user_id, click_id, expires_at
  ) VALUES (
    1, v_l1_affiliate.id, v_l1_affiliate.user_id, p_referred_user_id, p_click_id, now() + v_recurring
  )
  ON CONFLICT (level, affiliate_id, referred_user_id) DO NOTHING
  RETURNING id INTO v_l1_referral_id;
  
  -- L2 referral (if L1 affiliate has a parent)
  IF v_l1_affiliate.parent_affiliate_id IS NOT NULL AND v_l1_referral_id IS NOT NULL THEN
    INSERT INTO public.referrals (
      level, affiliate_id, affiliate_user_id, referred_user_id, click_id, source_referral_id, expires_at
    ) VALUES (
      2, v_l1_affiliate.parent_affiliate_id, v_l1_affiliate.parent_user_id,
      p_referred_user_id, p_click_id, v_l1_referral_id, now() + v_recurring
    )
    ON CONFLICT (level, affiliate_id, referred_user_id) DO NOTHING
    RETURNING id INTO v_l2_referral_id;
  END IF;
  
  -- Mark click converted
  UPDATE public.referral_clicks
  SET converted = true, converted_user_id = p_referred_user_id, converted_at = now()
  WHERE id = v_click.id;
  
  -- Update affiliate stats
  UPDATE public.affiliate_accounts SET total_signups = total_signups + 1, updated_at = now()
  WHERE id = v_l1_affiliate.id;
  
  -- Set parent_affiliate_id on the new user's affiliate account (so future L2 chains work)
  INSERT INTO public.affiliate_accounts (user_id, referral_code, parent_affiliate_id, parent_user_id)
  SELECT p_referred_user_id, COALESCE(p.snomad_id, public.generate_snomad_id()),
         v_l1_affiliate.id, v_l1_affiliate.user_id
  FROM public.profiles p WHERE p.id = p_referred_user_id
  ON CONFLICT (user_id) DO UPDATE SET
    parent_affiliate_id = COALESCE(public.affiliate_accounts.parent_affiliate_id, EXCLUDED.parent_affiliate_id),
    parent_user_id = COALESCE(public.affiliate_accounts.parent_user_id, EXCLUDED.parent_user_id),
    updated_at = now();
  
  RETURN jsonb_build_object(
    'attributed', true,
    'l1_referral_id', v_l1_referral_id,
    'l2_referral_id', v_l2_referral_id
  );
END;
$$;

-- Credit a commission (called by service role when a referred user pays)
CREATE OR REPLACE FUNCTION public.credit_commission(
  p_referred_user_id UUID,
  p_base_amount NUMERIC,
  p_currency TEXT,
  p_source_type TEXT,
  p_source_id TEXT,
  p_description TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings public.affiliate_program_settings;
  v_l1_ref public.referrals;
  v_l2_ref public.referrals;
  v_commission NUMERIC(12,2);
  v_wallet_credit NUMERIC(12,2);
  v_withdrawable NUMERIC(12,2);
  v_l1_earning_id UUID;
  v_l2_earning_id UUID;
  v_hold_interval INTERVAL;
BEGIN
  SELECT * INTO v_settings FROM public.affiliate_program_settings WHERE id = 1;
  IF NOT v_settings.is_active THEN
    RETURN jsonb_build_object('credited', false, 'reason', 'program_inactive');
  END IF;
  
  v_hold_interval := (v_settings.hold_days || ' days')::interval;
  
  -- L1 commission
  SELECT * INTO v_l1_ref FROM public.referrals
  WHERE level = 1 AND referred_user_id = p_referred_user_id
    AND status = 'active' AND expires_at > now()
  LIMIT 1;
  
  IF v_l1_ref.id IS NOT NULL THEN
    v_commission := ROUND(p_base_amount * v_settings.l1_commission_rate, 2);
    v_wallet_credit := ROUND(v_commission * v_settings.wallet_credit_split, 2);
    v_withdrawable := v_commission - v_wallet_credit;
    
    INSERT INTO public.affiliate_earnings (
      affiliate_id, affiliate_user_id, referral_id, level,
      source_type, source_id, referred_user_id,
      base_amount, commission_rate, commission_amount,
      wallet_credit_amount, withdrawable_amount, currency,
      hold_until, description
    ) VALUES (
      v_l1_ref.affiliate_id, v_l1_ref.affiliate_user_id, v_l1_ref.id, 1,
      p_source_type, p_source_id, p_referred_user_id,
      p_base_amount, v_settings.l1_commission_rate, v_commission,
      v_wallet_credit, v_withdrawable, p_currency,
      now() + v_hold_interval, p_description
    ) RETURNING id INTO v_l1_earning_id;
    
    UPDATE public.affiliate_accounts
    SET pending_balance = pending_balance + v_commission,
        total_paying_referrals = total_paying_referrals + (CASE WHEN v_l1_ref.first_payment_at IS NULL THEN 1 ELSE 0 END),
        updated_at = now()
    WHERE id = v_l1_ref.affiliate_id;
    
    UPDATE public.referrals
    SET first_payment_at = COALESCE(first_payment_at, now())
    WHERE id = v_l1_ref.id;
    
    -- L2 override
    SELECT * INTO v_l2_ref FROM public.referrals
    WHERE level = 2 AND referred_user_id = p_referred_user_id
      AND status = 'active' AND expires_at > now()
    LIMIT 1;
    
    IF v_l2_ref.id IS NOT NULL THEN
      v_commission := ROUND(v_commission * v_settings.l2_commission_rate, 2);
      v_wallet_credit := ROUND(v_commission * v_settings.wallet_credit_split, 2);
      v_withdrawable := v_commission - v_wallet_credit;
      
      INSERT INTO public.affiliate_earnings (
        affiliate_id, affiliate_user_id, referral_id, level,
        source_type, source_id, referred_user_id,
        base_amount, commission_rate, commission_amount,
        wallet_credit_amount, withdrawable_amount, currency,
        hold_until, description
      ) VALUES (
        v_l2_ref.affiliate_id, v_l2_ref.affiliate_user_id, v_l2_ref.id, 2,
        p_source_type, p_source_id, p_referred_user_id,
        p_base_amount, v_settings.l2_commission_rate, v_commission,
        v_wallet_credit, v_withdrawable, p_currency,
        now() + v_hold_interval, p_description
      ) RETURNING id INTO v_l2_earning_id;
      
      UPDATE public.affiliate_accounts
      SET pending_balance = pending_balance + v_commission, updated_at = now()
      WHERE id = v_l2_ref.affiliate_id;
    END IF;
  END IF;
  
  RETURN jsonb_build_object(
    'credited', v_l1_earning_id IS NOT NULL,
    'l1_earning_id', v_l1_earning_id,
    'l2_earning_id', v_l2_earning_id
  );
END;
$$;

-- Clear pending earnings whose hold period has expired
CREATE OR REPLACE FUNCTION public.clear_matured_earnings()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
  r RECORD;
BEGIN
  FOR r IN
    SELECT id, affiliate_id, wallet_credit_amount, withdrawable_amount
    FROM public.affiliate_earnings
    WHERE status = 'pending' AND hold_until <= now()
  LOOP
    UPDATE public.affiliate_earnings
    SET status = 'cleared', cleared_at = now()
    WHERE id = r.id;
    
    UPDATE public.affiliate_accounts
    SET pending_balance = pending_balance - (r.wallet_credit_amount + r.withdrawable_amount),
        cleared_balance = cleared_balance + r.withdrawable_amount,
        wallet_credit_balance = wallet_credit_balance + r.wallet_credit_amount,
        updated_at = now()
    WHERE id = r.affiliate_id;
    
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

-- Request a payout (validates min balance, locks earnings)
CREATE OR REPLACE FUNCTION public.request_affiliate_payout(
  p_amount NUMERIC,
  p_method TEXT,
  p_address TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_account public.affiliate_accounts;
  v_settings public.affiliate_program_settings;
  v_payout_id UUID;
  v_fee NUMERIC(12,2) := 0;
  v_net NUMERIC(12,2);
  v_count INTEGER := 0;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'auth_required');
  END IF;
  
  SELECT * INTO v_settings FROM public.affiliate_program_settings WHERE id = 1;
  SELECT * INTO v_account FROM public.affiliate_accounts WHERE user_id = auth.uid();
  
  IF v_account.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'no_affiliate_account');
  END IF;
  
  IF v_account.status != 'active' THEN
    RETURN jsonb_build_object('success', false, 'error', 'account_' || v_account.status);
  END IF;
  
  IF p_amount < v_settings.min_payout_usd THEN
    RETURN jsonb_build_object('success', false, 'error', 'below_minimum',
      'min_payout', v_settings.min_payout_usd);
  END IF;
  
  IF p_amount > v_account.cleared_balance THEN
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_cleared_balance',
      'available', v_account.cleared_balance);
  END IF;
  
  IF p_method = 'usdc_base' THEN v_fee := 0.50;
  ELSIF p_method = 'stripe_connect' THEN v_fee := GREATEST(0.25, p_amount * 0.0025);
  ELSIF p_method = 'bank_wire' THEN v_fee := 15.00;
  END IF;
  v_net := p_amount - v_fee;
  
  INSERT INTO public.affiliate_payouts (
    affiliate_id, affiliate_user_id, amount, payout_method, payout_address,
    fee_amount, net_amount
  ) VALUES (
    v_account.id, auth.uid(), p_amount, p_method, p_address,
    v_fee, v_net
  ) RETURNING id INTO v_payout_id;
  
  -- Lock the cleared earnings against this payout (oldest first)
  WITH locked AS (
    SELECT id, withdrawable_amount FROM public.affiliate_earnings
    WHERE affiliate_id = v_account.id AND status = 'cleared' AND payout_id IS NULL
    ORDER BY cleared_at ASC
  ),
  running AS (
    SELECT id, withdrawable_amount,
           SUM(withdrawable_amount) OVER (ORDER BY id) AS cumulative
    FROM locked
  )
  UPDATE public.affiliate_earnings e
  SET payout_id = v_payout_id
  FROM running r
  WHERE e.id = r.id AND r.cumulative <= p_amount;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  UPDATE public.affiliate_accounts
  SET cleared_balance = cleared_balance - p_amount, updated_at = now()
  WHERE id = v_account.id;
  
  UPDATE public.affiliate_payouts SET earnings_count = v_count WHERE id = v_payout_id;
  
  RETURN jsonb_build_object(
    'success', true, 'payout_id', v_payout_id,
    'amount', p_amount, 'fee', v_fee, 'net', v_net
  );
END;
$$;

-- Updated-at trigger for affiliate_accounts
CREATE OR REPLACE FUNCTION public.update_affiliate_account_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_affiliate_accounts_updated
BEFORE UPDATE ON public.affiliate_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_affiliate_account_timestamp();