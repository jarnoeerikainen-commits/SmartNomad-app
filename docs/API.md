# SuperNomad B2B API — Partner Contract

> Base URL: `https://xeunjlpzvitnrepyzatg.supabase.co/functions/v1/supernomad-gateway`
> Auth: `x-api-key: <key>` **or** `Authorization: Bearer <key>`
> Versioning: URL-path (`/v1/...`)
> Rate limits: per-partner, see `api_partners.rate_limit_per_minute`

---

## 1. Authentication

```http
GET /v1/info HTTP/1.1
Host: xeunjlpzvitnrepyzatg.supabase.co
x-api-key: snk_live_••••••••
```

The API key is SHA-256 hashed and looked up against `api_partners`. Inactive, expired, or IP-mismatched keys return `403`.

| Status | Meaning |
|---|---|
| `401` | Missing key |
| `403` | Invalid / expired / IP not whitelisted / no policy for resource |
| `405` | Method not permitted by policy |
| `429` | Rate limit exceeded — `Retry-After: 60` |
| `5xx` | Internal error (logged with request ID) |

---

## 2. Endpoints

### `GET /v1/info`
Lists resources the partner is allowed to query.

```json
{
  "gateway": "SuperNomad B2B API Gateway",
  "version": "v1",
  "partner": "Acme Travel Insights",
  "tier": "growth",
  "availableResources": [
    { "resource": "travel_history", "permission": "read", "maxRecords": 1000, "piiAnonymized": true },
    { "resource": "platform_stats", "permission": "read", "maxRecords": 1, "piiAnonymized": false }
  ]
}
```

### Resource endpoints

| Resource | Method | Query params | Notes |
|---|---|---|---|
| `travel_history` | GET | `device_id`, `country_code`, `from_date`, `to_date` | PII can be anonymized per policy |
| `ai_memories` | GET | `device_id`, `category` | Embedding column never returned |
| `conversations` | GET | `device_id` | Title + counts only |
| `device_sessions` | GET | — | Aggregated metadata |
| `snomad_profiles` | GET | `device_id` | Preference vectors |
| `feature_catalog` | GET | — | Static feature inventory |
| `platform_stats` | GET | — | Aggregate counts |
| `ai_usage` | GET | `function_name`, `from_date` | Tokens, latency |
| `knowledge_graph` | GET | `device_id`, `source_type` | Edge traversal |

All responses share this envelope:

```json
{
  "success": true,
  "partner": "Acme Travel Insights",
  "resource": "travel_history",
  "data": [ /* records */ ],
  "meta": {
    "recordCount": 42,
    "maxRecords": 1000,
    "piiAnonymized": true,
    "timestamp": "2026-04-23T10:00:00Z",
    "latencyMs": 137
  }
}
```

---

## 3. Trust Pass — `trust-pass-verify`

Partner-facing endpoint that confirms a user's verified tier without leaking PII.

```http
POST /functions/v1/trust-pass-verify
Content-Type: application/json
x-api-key: snk_live_••••••••

{
  "snomad_id": "SN-K3PR-9X4M-WT2N",
  "required_tier": "nomad"
}
```

```json
{
  "verified": true,
  "actual_tier": "sovereign",
  "credential_count": 5,
  "verified_at": "2026-04-23T10:00:00Z"
}
```

Pricing: $50–$100 per verification (tier-based). Every call logged in `data_access_requests` with consent ID.

---

## 4. Data Packages — `data-package-query`

Tiered, k-anonymous data products for media/ad-tech buyers.

```http
POST /functions/v1/data-package-query
{
  "package_slug": "high-intent-business-travelers-eu",
  "fields": ["country_code", "industry_segment"],
  "segments": ["frequent_flyer", "premium_cabin"]
}
```

Server enforces `min_k_anonymity` (default 50). Below threshold → `422` with `{ "error": "k_anonymity_violation", "actual_k": 12 }`.

Every successful delivery debits `data_package_subscriptions.records_delivered` and bills via `total_billed_usd` on the subscription. See `OPERATIONS.md → Billing`.

---

## 5. Webhooks (planned, not yet shipped)

Reserved event names — implement in `supernomad-gateway` POST `/v1/webhooks/test`:
- `consent.granted`, `consent.revoked`
- `trust_pass.issued`, `trust_pass.revoked`
- `package.delivered`, `package.threshold_reached`

---

## 6. Errors — canonical shape

```json
{ "error": "Access denied", "message": "No access policy for resource: travel_history",
  "availableResources": ["platform_stats"] }
```

Always include `error` (machine code) and `message` (human). Never leak SQL, stack traces, or service-role tokens.

---

## 7. Postman / OpenAPI

- `docs/postman/supernomad-b2b.postman_collection.json` — ready-to-import
- `docs/openapi/supernomad.yaml` — OpenAPI 3.1 spec for codegen

Generate clients with:

```bash
npx openapi-typescript docs/openapi/supernomad.yaml -o src/types/api.d.ts
```
