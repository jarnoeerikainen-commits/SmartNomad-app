---
name: B2B Foundation & Pseudonymous Snomad ID
description: snomad_id (SN-XXXX-XXXX-XXXX) on every profile, consent_ledger, data_access_requests, partner-data-query edge function with k-anonymity gate
type: feature
---

## B2B / GDPR Backend (Apr 2026)

### Pseudonymous identifier
- `profiles.snomad_id` column, format `SN-XXXX-XXXX-XXXX` (Crockford base32, ~60 bits entropy).
- Auto-assigned via `BEFORE INSERT` trigger `trg_assign_snomad_id` calling `generate_snomad_id()`.
- `migrate_device_to_user` defensively backfills it on guest→auth promotion.
- Helpers: `get_my_snomad_id()` (any auth user), `resolve_snomad_id()` (admin-only reverse lookup).
- Surfaced in: Settings (top of page via `SnomadIdCard`), Support Ticketing (replaces old localStorage user id).

### Consent ledger (GDPR Art. 7)
- `consent_ledger` append-only table: purpose, partner_id, granted, consent_text_version, consent_text_hash, ip, ua, expires_at.
- `has_active_consent(user_id, purpose, partner_id)` returns most recent decision.
- `ConsentService` (client) + `ConsentCenter` UI in Settings → Consent tab. 11 purposes across 4 categories (partner / analytics / marketing / ai).
- Consent text version `v1.0-2026-04-21`, sha256-hashed at write time.

### B2B partner data product
- `data_access_requests` table logs every partner query (snomad_id, fields_requested, fields_returned, consent_verified, legal_basis).
- `v_partner_profile_signals` view exposes only non-PII signals keyed by snomad_id; service_role only.
- `partner-data-query` edge function: SHA-256 API-key auth, two modes:
  - `profile_signals`: per-snomad-id, requires `has_active_consent` for each subject, max 100 ids/request.
  - `aggregate`: bucket counts; refuses if k<5 (k-anonymity gate, returns 422).
- Every call audited to `api_audit_logs` + per-subject row in `data_access_requests`.

### Switch to production
- Already auth-required RLS on all PII tables (security audit Apr 2026).
- To onboard a partner: insert into `api_partners` with sha256 of their key, then create `api_access_policies` rows.
- Users see partner queries touching their own snomad_id via `data_access_requests` RLS.
