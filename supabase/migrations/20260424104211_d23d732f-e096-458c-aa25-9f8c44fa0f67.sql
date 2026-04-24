-- Schedule daily AI Director ecosystem sweep + executive briefing.
-- Removes any prior versions of these jobs so this migration is idempotent.

DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT jobid FROM cron.job
           WHERE jobname IN ('admin-directors-daily-sweep','admin-daily-briefing')
  LOOP
    PERFORM cron.unschedule(r.jobid);
  END LOOP;
END $$;

-- 06:00 UTC every day — sweep all 10 AI Directors
SELECT cron.schedule(
  'admin-directors-daily-sweep',
  '0 6 * * *',
  $cron$
  SELECT net.http_post(
    url := 'https://xeunjlpzvitnrepyzatg.supabase.co/functions/v1/admin-ai-directors',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldW5qbHB6dml0bnJlcHl6YXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjUxMDUsImV4cCI6MjA3Njg0MTEwNX0.eiTYJpSpLpY7o860HSFDB7wQPPt5y9bIYRfzmPGEgU0"}'::jsonb,
    body := '{"all":true,"trigger":"cron"}'::jsonb
  );
  $cron$
);

-- 06:30 UTC every day — generate the executive daily briefing
SELECT cron.schedule(
  'admin-daily-briefing',
  '30 6 * * *',
  $cron$
  SELECT net.http_post(
    url := 'https://xeunjlpzvitnrepyzatg.supabase.co/functions/v1/admin-daily-briefing',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldW5qbHB6dml0bnJlcHl6YXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjUxMDUsImV4cCI6MjA3Njg0MTEwNX0.eiTYJpSpLpY7o860HSFDB7wQPPt5y9bIYRfzmPGEgU0"}'::jsonb,
    body := '{"trigger":"cron"}'::jsonb
  );
  $cron$
);