-- Consent ledger seed for demo org members
INSERT INTO consent_ledger (user_id, snomad_id, purpose, granted, consent_text_version, consent_text_hash, metadata)
SELECT 
  om.user_id,
  COALESCE(p.snomad_id, 'SN-DEMO-' || substr(om.user_id::text, 1, 8)),
  purposes.purpose,
  true,
  'v1.0',
  encode(sha256('SuperNomad Consent v1.0 - demo seed'::bytea), 'hex'),
  jsonb_build_object('source', 'demo_seed', 'org', 'Acme Global Inc.')
FROM organization_members om
JOIN organizations o ON o.id = om.organization_id
LEFT JOIN profiles p ON p.id = om.user_id
CROSS JOIN (VALUES 
  ('trust_pass_verification'),
  ('b2b_data_sharing'),
  ('travel_analytics'),
  ('expense_audit')
) AS purposes(purpose)
WHERE o.demo = true
ON CONFLICT DO NOTHING;

-- Verified venues — schema requires status in (active|archived|flagged) and price_band in $..$$$$$
INSERT INTO curated_venues (name, category, city, country, country_code, neighborhood, review_score, review_count, quality_score, status, why_recommended, signature_offering, price_band, source_urls, tags, metadata)
VALUES
  ('Soho House Berlin', 'boutique_hotel', 'Berlin', 'Germany', 'DE', 'Mitte', 4.7, 1840, 92, 'active', 'Premier members club for creatives in Mitte', 'Rooftop pool & co-working', '$$$$', '["https://www.sohohouse.com/houses/soho-house-berlin"]'::jsonb, ARRAY['members-club','coworking','rooftop'], '{"verified_by":"demo_seed"}'::jsonb),
  ('Aman Tokyo', 'hotel', 'Tokyo', 'Japan', 'JP', 'Otemachi', 4.9, 2340, 98, 'active', 'Discreet luxury at the top of the Otemachi Tower', 'City-view onsen & 30m pool', '$$$$$', '["https://www.aman.com/hotels/aman-tokyo"]'::jsonb, ARRAY['luxury','spa','onsen'], '{"verified_by":"demo_seed"}'::jsonb),
  ('Casa Cipriani', 'boutique_hotel', 'New York', 'United States', 'US', 'Battery Park', 4.6, 1290, 90, 'active', 'Members-only club inside the Battery Maritime Building', 'Italian fine dining & jazz lounge', '$$$$', '["https://www.casacipriani.com"]'::jsonb, ARRAY['members-club','dining','live-music'], '{"verified_by":"demo_seed"}'::jsonb),
  ('Selina Medellin', 'boutique_hotel', 'Medellin', 'Colombia', 'CO', 'El Poblado', 4.4, 980, 84, 'active', 'Hybrid hostel + coworking favored by digital nomads', 'Coworking + rooftop pool + events', '$$', '["https://www.selina.com/colombia/medellin"]'::jsonb, ARRAY['nomad','coworking','community'], '{"verified_by":"demo_seed"}'::jsonb),
  ('The NoMad London', 'hotel', 'London', 'United Kingdom', 'GB', 'Covent Garden', 4.8, 1620, 94, 'active', 'Iconic Covent Garden hotel inside a former magistrates court', 'Side Hustle bar & atrium dining', '$$$$', '["https://www.thenomadhotel.com/london"]'::jsonb, ARRAY['boutique','dining','bar'], '{"verified_by":"demo_seed"}'::jsonb),
  ('Maido', 'restaurant', 'Lima', 'Peru', 'PE', 'Miraflores', 4.8, 4120, 96, 'active', 'Nikkei tasting menu, ranked top 10 World 50 Best 2024', '17-course Nikkei Experience', '$$$$', '["https://maido.pe","https://www.theworlds50best.com"]'::jsonb, ARRAY['michelin','tasting-menu','nikkei'], '{"verified_by":"demo_seed"}'::jsonb),
  ('Aire Ancient Baths NYC', 'spa', 'New York', 'United States', 'US', 'Tribeca', 4.7, 1530, 93, 'active', 'Thermal bath ritual in a restored 19th-century textile factory', 'Six thermal pools + signature massage', '$$$$', '["https://beaire.com/en/locations/new-york"]'::jsonb, ARRAY['spa','thermal','wellness'], '{"verified_by":"demo_seed"}'::jsonb),
  ('Tartine Manufactory', 'bakery', 'San Francisco', 'United States', 'US', 'Mission', 4.5, 3180, 88, 'active', 'Cult sourdough bakery from Chad Robertson', 'Country loaf & morning bun', '$$', '["https://tartinebakery.com"]'::jsonb, ARRAY['bakery','sourdough','breakfast'], '{"verified_by":"demo_seed"}'::jsonb)
ON CONFLICT DO NOTHING;