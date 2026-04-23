INSERT INTO public.organizations
  (name, slug, billing_email, billing_method, billing_currency, country_code,
   size_band, industry, demo, created_by, travel_policy, join_code)
VALUES (
  'Acme Global Inc.',
  'acme-global-demo',
  'finance@acme-demo.com',
  'invoice',
  'USD',
  'US',
  '201-1000',
  'Technology',
  true,
  '00000000-0000-0000-0000-000000000000',
  '{"auto_approve_under": 1500, "max_hotel_per_night": 350, "class_economy_only": false}'::jsonb,
  'ACMEDEMO'
)
ON CONFLICT (slug) DO NOTHING;

-- Seed a few demo trips so the dashboard isn't empty
WITH org AS (SELECT id FROM public.organizations WHERE slug = 'acme-global-demo'),
demo_member AS (
  INSERT INTO public.organization_members (organization_id, user_id, role, department, job_title, employee_id)
  SELECT id, '00000000-0000-0000-0000-000000000001', 'employee', 'Sales', 'Account Executive', 'EMP-001' FROM org
  ON CONFLICT (organization_id, user_id) DO UPDATE SET department = EXCLUDED.department
  RETURNING id, organization_id, user_id
)
INSERT INTO public.business_trips
  (organization_id, member_id, user_id, purpose, destination_city, destination_country, origin_city,
   start_date, end_date, estimated_cost, actual_cost, currency, status)
SELECT
  m.organization_id, m.id, m.user_id, p.purpose, p.city, p.country, 'New York',
  p.start_date::date, p.end_date::date, p.cost, p.actual, 'USD', p.status
FROM demo_member m
CROSS JOIN (VALUES
  ('Q4 client kickoff in Berlin', 'Berlin', 'DE', '2025-11-10', '2025-11-13', 2400, 2380, 'completed'),
  ('SaaStock conference Dublin', 'Dublin', 'IE', '2025-10-14', '2025-10-17', 3100, 3050, 'completed'),
  ('Tokyo partner workshop', 'Tokyo', 'JP', '2026-05-04', '2026-05-09', 4800, 0, 'approved'),
  ('London roadshow', 'London', 'GB', '2026-04-28', '2026-05-01', 1900, 0, 'submitted'),
  ('Singapore expansion scoping', 'Singapore', 'SG', '2026-06-15', '2026-06-20', 5400, 0, 'submitted')
) AS p(purpose, city, country, start_date, end_date, cost, actual, status)
ON CONFLICT DO NOTHING;