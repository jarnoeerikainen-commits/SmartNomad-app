-- Schedule weekly school-holiday refresh (Mondays 04:30 UTC, 30min after trend pack)
DO $$
BEGIN
  PERFORM cron.unschedule('weekly-school-holidays-refresh');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'weekly-school-holidays-refresh',
  '30 4 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://xeunjlpzvitnrepyzatg.supabase.co/functions/v1/school-holidays-refresh',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldW5qbHB6dml0bnJlcHl6YXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjUxMDUsImV4cCI6MjA3Njg0MTEwNX0.eiTYJpSpLpY7o860HSFDB7wQPPt5y9bIYRfzmPGEgU0"}'::jsonb,
    body := '{"trigger":"cron"}'::jsonb
  );
  $$
);