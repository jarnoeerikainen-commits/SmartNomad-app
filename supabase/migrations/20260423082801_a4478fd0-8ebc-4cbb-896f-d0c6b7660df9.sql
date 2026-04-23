-- Enable cron + http extensions for scheduled scraping
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ──────────────────────────────────────────────────────────
-- Seed verified government + partner sources (idempotent)
-- ──────────────────────────────────────────────────────────
INSERT INTO public.verified_sources
  (url, domain, source_type, category, country_code, display_name, refresh_cadence_hours, risk_policy, tls_required, is_active, metadata)
VALUES
  -- EU / Schengen
  ('https://travel-europe.europa.eu/etias_en', 'travel-europe.europa.eu', 'government', 'visa_immigration', 'EU', 'ETIAS Official Portal', 24, 'strict', true, true, '{"region":"schengen"}'::jsonb),
  ('https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en', 'home-affairs.ec.europa.eu', 'government', 'visa_immigration', 'EU', 'EU Schengen Visa Policy', 48, 'strict', true, true, '{}'::jsonb),
  -- USA
  ('https://travel.state.gov/content/travel/en/international-travel.html', 'travel.state.gov', 'government', 'travel_advisory', 'US', 'US State Department Travel', 24, 'strict', true, true, '{}'::jsonb),
  ('https://www.irs.gov/individuals/international-taxpayers', 'irs.gov', 'government', 'tax', 'US', 'IRS International Taxpayers', 72, 'strict', true, true, '{}'::jsonb),
  ('https://esta.cbp.dhs.gov/', 'esta.cbp.dhs.gov', 'government', 'visa_immigration', 'US', 'US ESTA Portal', 24, 'strict', true, true, '{}'::jsonb),
  -- UK
  ('https://www.gov.uk/foreign-travel-advice', 'gov.uk', 'government', 'travel_advisory', 'GB', 'UK FCDO Travel Advice', 24, 'strict', true, true, '{}'::jsonb),
  ('https://www.gov.uk/government/organisations/hm-revenue-customs', 'gov.uk', 'government', 'tax', 'GB', 'HMRC UK Tax Authority', 72, 'strict', true, true, '{}'::jsonb),
  -- Canada / Australia
  ('https://travel.gc.ca/travelling/advisories', 'travel.gc.ca', 'government', 'travel_advisory', 'CA', 'Canada Travel Advisories', 24, 'strict', true, true, '{}'::jsonb),
  ('https://www.smartraveller.gov.au/destinations', 'smartraveller.gov.au', 'government', 'travel_advisory', 'AU', 'Australia Smartraveller', 24, 'strict', true, true, '{}'::jsonb),
  -- Health
  ('https://www.who.int/travel-advice', 'who.int', 'government', 'health', null, 'WHO Travel Advice', 48, 'strict', true, true, '{}'::jsonb),
  ('https://wwwnc.cdc.gov/travel/destinations/list', 'cdc.gov', 'government', 'health', 'US', 'CDC Travel Health', 48, 'strict', true, true, '{}'::jsonb),
  -- Digital nomad visa portals
  ('https://www.consilium.europa.eu/en/policies/eu-migration-policy/', 'consilium.europa.eu', 'government', 'visa_immigration', 'EU', 'EU Migration Policy', 72, 'standard', true, true, '{}'::jsonb),
  ('https://imin-portugal.vfsglobal.com/prt/en/prt/digital-nomad-visa', 'vfsglobal.com', 'partner', 'visa_immigration', 'PT', 'Portugal Digital Nomad Visa (VFS)', 72, 'standard', true, true, '{}'::jsonb),
  ('https://www.estonia.ee/en/digital-nomad-visa/', 'estonia.ee', 'government', 'visa_immigration', 'EE', 'Estonia Digital Nomad Visa', 72, 'strict', true, true, '{}'::jsonb),
  -- Schengen Calculator (reference info)
  ('https://ec.europa.eu/assets/home/visa-calculator/calculator.htm', 'ec.europa.eu', 'government', 'visa_immigration', 'EU', 'Schengen 90/180 Calculator', 168, 'strict', true, true, '{}'::jsonb)
ON CONFLICT (url) DO NOTHING;

-- ──────────────────────────────────────────────────────────
-- Schedule daily source-monitor run at 03:00 UTC
-- ──────────────────────────────────────────────────────────
DO $$
BEGIN
  -- Unschedule existing job if present (avoids duplicates on re-run)
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'source-monitor-daily') THEN
    PERFORM cron.unschedule('source-monitor-daily');
  END IF;
END $$;

SELECT cron.schedule(
  'source-monitor-daily',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://xeunjlpzvitnrepyzatg.supabase.co/functions/v1/source-monitor',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldW5qbHB6dml0bnJlcHl6YXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjUxMDUsImV4cCI6MjA3Njg0MTEwNX0.eiTYJpSpLpY7o860HSFDB7wQPPt5y9bIYRfzmPGEgU0"}'::jsonb,
    body := jsonb_build_object('trigger','cron_daily','limit',100)
  );
  $$
);