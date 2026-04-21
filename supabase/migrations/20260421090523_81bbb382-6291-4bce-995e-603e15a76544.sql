-- 1. Update program rates: L1 = 10%, L2 = 5%
UPDATE public.affiliate_program_settings
SET l1_commission_rate = 0.10,
    l2_commission_rate = 0.05,
    updated_at = now()
WHERE id = 1;

-- 2. Rewrite credit_commission to apply Sovereign Payout Engine deductions
CREATE OR REPLACE FUNCTION public.credit_commission(
  p_referred_user_id uuid,
  p_base_amount numeric,
  p_currency text,
  p_source_type text,
  p_source_id text,
  p_description text DEFAULT NULL::text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_settings public.affiliate_program_settings;
  v_l1_ref public.referrals;
  v_l2_ref public.referrals;
  v_payment_fee NUMERIC(12,2);
  v_ai_cost CONSTANT NUMERIC(12,2) := 0.50;
  v_net_profit NUMERIC(12,2);
  v_l1_commission NUMERIC(12,2);
  v_l2_commission NUMERIC(12,2);
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

  -- ─── Sovereign Payout Engine: deduct fees & AI cost from gross ───
  -- Payment processor (Stripe/Visa avg): 3% + $0.30
  v_payment_fee := ROUND(p_base_amount * 0.03 + 0.30, 2);
  v_net_profit  := ROUND(p_base_amount - v_payment_fee - v_ai_cost, 2);

  IF v_net_profit <= 0 THEN
    RETURN jsonb_build_object(
      'credited', false,
      'reason', 'net_profit_non_positive',
      'gross', p_base_amount,
      'payment_fee', v_payment_fee,
      'ai_cost', v_ai_cost,
      'net_profit', v_net_profit
    );
  END IF;

  -- L1 commission: 10% of NET company earnings
  SELECT * INTO v_l1_ref FROM public.referrals
  WHERE level = 1 AND referred_user_id = p_referred_user_id
    AND status = 'active' AND expires_at > now()
  LIMIT 1;

  IF v_l1_ref.id IS NOT NULL THEN
    v_l1_commission := ROUND(v_net_profit * v_settings.l1_commission_rate, 2);
    v_wallet_credit := ROUND(v_l1_commission * v_settings.wallet_credit_split, 2);
    v_withdrawable  := v_l1_commission - v_wallet_credit;

    INSERT INTO public.affiliate_earnings (
      affiliate_id, affiliate_user_id, referral_id, level,
      source_type, source_id, referred_user_id,
      base_amount, commission_rate, commission_amount,
      wallet_credit_amount, withdrawable_amount, currency,
      hold_until, description, metadata
    ) VALUES (
      v_l1_ref.affiliate_id, v_l1_ref.affiliate_user_id, v_l1_ref.id, 1,
      p_source_type, p_source_id, p_referred_user_id,
      v_net_profit, v_settings.l1_commission_rate, v_l1_commission,
      v_wallet_credit, v_withdrawable, p_currency,
      now() + v_hold_interval, p_description,
      jsonb_build_object(
        'gross', p_base_amount,
        'payment_fee', v_payment_fee,
        'ai_cost', v_ai_cost,
        'net_profit', v_net_profit,
        'engine', 'sovereign_payout_v1'
      )
    ) RETURNING id INTO v_l1_earning_id;

    UPDATE public.affiliate_accounts
    SET pending_balance = pending_balance + v_l1_commission,
        total_paying_referrals = total_paying_referrals + (CASE WHEN v_l1_ref.first_payment_at IS NULL THEN 1 ELSE 0 END),
        updated_at = now()
    WHERE id = v_l1_ref.affiliate_id;

    UPDATE public.referrals
    SET first_payment_at = COALESCE(first_payment_at, now())
    WHERE id = v_l1_ref.id;

    -- L2 override: 5% of NET company earnings
    SELECT * INTO v_l2_ref FROM public.referrals
    WHERE level = 2 AND referred_user_id = p_referred_user_id
      AND status = 'active' AND expires_at > now()
    LIMIT 1;

    IF v_l2_ref.id IS NOT NULL THEN
      v_l2_commission := ROUND(v_net_profit * v_settings.l2_commission_rate, 2);
      v_wallet_credit := ROUND(v_l2_commission * v_settings.wallet_credit_split, 2);
      v_withdrawable  := v_l2_commission - v_wallet_credit;

      INSERT INTO public.affiliate_earnings (
        affiliate_id, affiliate_user_id, referral_id, level,
        source_type, source_id, referred_user_id,
        base_amount, commission_rate, commission_amount,
        wallet_credit_amount, withdrawable_amount, currency,
        hold_until, description, metadata
      ) VALUES (
        v_l2_ref.affiliate_id, v_l2_ref.affiliate_user_id, v_l2_ref.id, 2,
        p_source_type, p_source_id, p_referred_user_id,
        v_net_profit, v_settings.l2_commission_rate, v_l2_commission,
        v_wallet_credit, v_withdrawable, p_currency,
        now() + v_hold_interval, p_description,
        jsonb_build_object(
          'gross', p_base_amount,
          'payment_fee', v_payment_fee,
          'ai_cost', v_ai_cost,
          'net_profit', v_net_profit,
          'engine', 'sovereign_payout_v1'
        )
      ) RETURNING id INTO v_l2_earning_id;

      UPDATE public.affiliate_accounts
      SET pending_balance = pending_balance + v_l2_commission, updated_at = now()
      WHERE id = v_l2_ref.affiliate_id;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'credited', v_l1_earning_id IS NOT NULL,
    'gross', p_base_amount,
    'payment_fee', v_payment_fee,
    'ai_cost', v_ai_cost,
    'net_profit', v_net_profit,
    'l1_earning_id', v_l1_earning_id,
    'l2_earning_id', v_l2_earning_id,
    'l1_commission', v_l1_commission,
    'l2_commission', v_l2_commission,
    'company_yield', v_net_profit - COALESCE(v_l1_commission, 0) - COALESCE(v_l2_commission, 0)
  );
END;
$function$;