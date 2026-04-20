-- Remove any prior schedule with the same name (safe re-run)
DO $$
BEGIN
  PERFORM cron.unschedule('weekly-trend-refresh');
EXCEPTION WHEN OTHERS THEN
  -- ignore if it doesn't exist
  NULL;
END $$;

SELECT cron.schedule(
  'weekly-trend-refresh',
  '0 4 * * 1', -- every Monday 04:00 UTC
  $$
  SELECT net.http_post(
    url := 'https://xeunjlpzvitnrepyzatg.supabase.co/functions/v1/trend-refresh',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldW5qbHB6dml0bnJlcHl6YXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjUxMDUsImV4cCI6MjA3Njg0MTEwNX0.eiTYJpSpLpY7o860HSFDB7wQPPt5y9bIYRfzmPGEgU0"}'::jsonb,
    body := '{"trigger":"cron"}'::jsonb
  );
  $$
);