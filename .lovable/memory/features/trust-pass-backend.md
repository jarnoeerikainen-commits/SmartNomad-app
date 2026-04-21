---
name: Trust Pass backend (production-ready)
description: walt-id-verifier issues real signed JWT-VCs (HS256 demo / OID4VC live), trust-pass-verify is partner-facing tier-check endpoint with consent gate
type: feature
---

Trust Pass backend is production-ready, demo-mode safe, live-mode flippable via env vars.

## Edge functions
- **walt-id-verifier** — actions: `issue` | `verify` | `revoke` | `status`. Demo: HS256-signed JWT-VCs via `_shared/trustPassCrypto.ts`. Live: proxies to `WALT_ID_ISSUER_URL` / `WALT_ID_VERIFIER_URL` (OID4VC/OID4VP).
- **trust-pass-verify** — partner endpoint, SHA-256 `x-api-key` auth, consent-gated via `verify_trust_tier()` RPC, returns only `{verified, actual_tier, credential_count}`. Audited in `api_audit_logs` + `data_access_requests`. Pricing: $50–100 per verification.

## Database
- `trust_pass_credentials` + `revoked_at` / `revocation_reason`, unique on `credential_id`, indexes on (user_id, status) and (device_id, status).
- `revoke_trust_credential(credential_id, reason)` — owner-only, audit-logged.
- `verify_trust_tier(snomad_id, required_tier, partner_id)` — consent-gated, returns JSONB.
- `v_active_trust_credentials` view — service_role only, no PII.

## Crypto
- `supabase/functions/_shared/trustPassCrypto.ts` — `signCredentialJWT`, `verifyCredentialJWT`, `computeTierFromTypes`, `deriveCredentialId`. Uses `TRUST_PASS_SIGNING_KEY` env (falls back to service_role for dev).
- 11 unit tests cover sign/verify round-trip, tampering, expiry, malformed JWT, tier computation.

## Live-mode flip
Set `WALT_ID_ISSUER_URL` + `WALT_ID_VERIFIER_URL` secrets → status endpoint reports `mode: "live"`, issuance proxies to walt.id.