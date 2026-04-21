-- Fix L2 commission to be 5% of company earnings (base_amount), not 5% of L1 commission.
-- base_amount = net revenue/earnings the company keeps (subscription fee, commission earned, fixed margin).
-- L1 affiliate: 25% of company earnings. L2 affiliate: 5% of company earnings (independent override).

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

  -- L1 commission: 25% of company earnings (base_amount)
  SELECT * INTO v_l1_ref FROM public.referrals
  WHERE level = 1 AND referred_user_id = p_referred_user_id
    AND status = 'active' AND expires_at > now()
  LIMIT 1;

  IF v_l1_ref.id IS NOT NULL THEN
    v_l1_commission := ROUND(p_base_amount * v_settings.l1_commission_rate, 2);
    v_wallet_credit := ROUND(v_l1_commission * v_settings.wallet_credit_split, 2);
    v_withdrawable := v_l1_commission - v_wallet_credit;

    INSERT INTO public.affiliate_earnings (
      affiliate_id, affiliate_user_id, referral_id, level,
      source_type, source_id, referred_user_id,
      base_amount, commission_rate, commission_amount,
      wallet_credit_amount, withdrawable_amount, currency,
      hold_until, description
    ) VALUES (
      v_l1_ref.affiliate_id, v_l1_ref.affiliate_user_id, v_l1_ref.id, 1,
      p_source_type, p_source_id, p_referred_user_id,
      p_base_amount, v_settings.l1_commission_rate, v_l1_commission,
      v_wallet_credit, v_withdrawable, p_currency,
      now() + v_hold_interval, p_description
    ) RETURNING id INTO v_l1_earning_id;

    UPDATE public.affiliate_accounts
    SET pending_balance = pending_balance + v_l1_commission,
        total_paying_referrals = total_paying_referrals + (CASE WHEN v_l1_ref.first_payment_at IS NULL THEN 1 ELSE 0 END),
        updated_at = now()
    WHERE id = v_l1_ref.affiliate_id;

    UPDATE public.referrals
    SET first_payment_at = COALESCE(first_payment_at, now())
    WHERE id = v_l1_ref.id;

    -- L2 override: 5% of company earnings (base_amount), NOT 5% of L1 commission.
    SELECT * INTO v_l2_ref FROM public.referrals
    WHERE level = 2 AND referred_user_id = p_referred_user_id
      AND status = 'active' AND expires_at > now()
    LIMIT 1;

    IF v_l2_ref.id IS NOT NULL THEN
      v_l2_commission := ROUND(p_base_amount * v_settings.l2_commission_rate, 2);
      v_wallet_credit := ROUND(v_l2_commission * v_settings.wallet_credit_split, 2);
      v_withdrawable := v_l2_commission - v_wallet_credit;

      INSERT INTO public.affiliate_earnings (
        affiliate_id, affiliate_user_id, referral_id, level,
        source_type, source_id, referred_user_id,
        base_amount, commission_rate, commission_amount,
        wallet_credit_amount, withdrawable_amount, currency,
        hold_until, description
      ) VALUES (
        v_l2_ref.affiliate_id, v_l2_ref.affiliate_user_id, v_l2_ref.id, 2,
        p_source_type, p_source_id, p_referred_user_id,
        p_base_amount, v_settings.l2_commission_rate, v_l2_commission,
        v_wallet_credit, v_withdrawable, p_currency,
        now() + v_hold_interval, p_description
      ) RETURNING id INTO v_l2_earning_id;

      UPDATE public.affiliate_accounts
      SET pending_balance = pending_balance + v_l2_commission, updated_at = now()
      WHERE id = v_l2_ref.affiliate_id;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'credited', v_l1_earning_id IS NOT NULL,
    'l1_earning_id', v_l1_earning_id,
    'l2_earning_id', v_l2_earning_id,
    'l1_commission', v_l1_commission,
    'l2_commission', v_l2_commission
  );
END;
$function$;