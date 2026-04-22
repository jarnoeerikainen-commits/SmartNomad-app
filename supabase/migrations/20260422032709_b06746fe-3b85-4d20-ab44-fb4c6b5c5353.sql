
-- Create a sanitized view for affiliate dashboards: strips IP, UA, fingerprint, converted_user_id
CREATE OR REPLACE VIEW public.affiliate_referral_clicks_safe
WITH (security_invoker = true) AS
SELECT
  id,
  affiliate_id,
  referral_code,
  click_id,
  country_code,
  landing_path,
  utm_source,
  utm_medium,
  utm_campaign,
  converted,
  converted_at,
  expires_at,
  created_at
FROM public.referral_clicks;

COMMENT ON VIEW public.affiliate_referral_clicks_safe IS
  'PII-stripped projection of referral_clicks for affiliate dashboards. Filtered by underlying RLS via security_invoker.';

-- Tighten the affiliate-readable policy: drop the "read raw row" policy and replace with admin-only
DROP POLICY IF EXISTS "Affiliates read own clicks" ON public.referral_clicks;

-- Admins keep full read for fraud investigation
CREATE POLICY "Admins read all referral clicks"
  ON public.referral_clicks
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Service role retains full access (existing policy keeps working)

-- Grant SELECT on the safe view to authenticated affiliates
GRANT SELECT ON public.affiliate_referral_clicks_safe TO authenticated;
