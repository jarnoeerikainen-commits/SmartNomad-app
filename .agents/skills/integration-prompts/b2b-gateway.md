# SuperNomad B2B Gateway (b2b-gateway)

## Self-hosted
No external secret. Auth via `x-api-key` against `api_partners` table.

## Already live
`supabase/functions/supernomad-gateway/`, `partner-data-query/`, `data-package-query/`, `gateway-admin/`.

## Endpoints (current)
- `GET /v1/info`
- `GET /v1/feature_catalog`
- `GET /v1/platform_stats`
- `POST /v1/data_query`
- `POST /v1/package_query`

## Guards
- SHA-256 API-key hash on lookup
- k-anonymity ≥ k_min per package
- PII anonymization mandatory
- Consent ledger checked via `has_active_consent()`

## Activation prompt
> Already live. To onboard a partner: INSERT into `api_partners`, set `key_hash`, scopes, rate limit, create `data_package_subscriptions` rows. Test via `docs/postman/supernomad-b2b.postman_collection.json`.
