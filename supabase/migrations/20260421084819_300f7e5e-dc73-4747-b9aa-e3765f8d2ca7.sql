-- Reverse pending affiliate earnings tied to a chargebacked/refunded source.
-- Called by payment webhooks on charge.dispute.created or refund events.
-- Only earnings still in 'pending' status can be reversed (matured ones are already paid).
CREATE OR REPLACE FUNCTION public.reverse_affiliate_earnings_for_source(
  p_source_type text,
  p_source_id text,
  p_reason text DEFAULT 'chargeback'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_count INTEGER := 0;
  v_total NUMERIC(12,2) := 0;
  r RECORD;
BEGIN
  FOR r IN
    SELECT id, affiliate_id, commission_amount
    FROM public.affiliate_earnings
    WHERE source_type = p_source_type
      AND source_id = p_source_id
      AND status = 'pending'
  LOOP
    UPDATE public.affiliate_earnings
    SET status = 'reversed',
        reversed_at = now(),
        reversal_reason = p_reason
    WHERE id = r.id;

    UPDATE public.affiliate_accounts
    SET pending_balance = GREATEST(0, pending_balance - r.commission_amount),
        reversed_lifetime = reversed_lifetime + r.commission_amount,
        updated_at = now()
    WHERE id = r.affiliate_id;

    v_count := v_count + 1;
    v_total := v_total + r.commission_amount;
  END LOOP;

  RETURN jsonb_build_object(
    'reversed', v_count > 0,
    'count', v_count,
    'total_amount', v_total,
    'reason', p_reason
  );
END;
$function$;