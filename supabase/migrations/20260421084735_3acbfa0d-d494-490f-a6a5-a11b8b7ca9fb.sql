-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any prior version of this job
SELECT cron.unschedule('affiliate-clear-matured-daily')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'affiliate-clear-matured-daily');

-- Schedule daily auto-clear of matured affiliate earnings (30-day hold)
-- Runs at 02:15 UTC every day — quiet hours, after most card chargebacks would have settled.
SELECT cron.schedule(
  'affiliate-clear-matured-daily',
  '15 2 * * *',
  $$ SELECT public.clear_matured_earnings(); $$
);