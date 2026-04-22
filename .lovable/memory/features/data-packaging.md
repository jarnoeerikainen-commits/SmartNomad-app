---
name: B2B Data Packaging Backend
description: 5-table data product schema (packages, fields, segments, subscriptions, delivery_jobs) modeled on IAB Taxonomy 1.1 + IAB Data Transparency 1.2 + LiveRamp clean rooms. Edge function data-package-query with 5 modes and k-anonymity gates.
type: feature
---

## B2B Data Packaging (Apr 2026)

### Tables
- `data_packages` — sellable bundles. Pricing model (cpm/flat/subscription/revenue_share), IAB taxonomy id, source_type, refresh_cadence, min_k_anonymity, status.
- `data_package_fields` — per-field config: transform (raw/bucketed/hashed/anonymized/aggregated/suppressed), is_identifier, is_partition_key, recency_days. LiveRamp-style field mapping.
- `data_package_segments` — IAB-aligned segments inside a package: segment_id ("7-1-1"), parent, tier, estimated_size, match_rule jsonb (e.g. `{"travel_style":"luxury"}`).
- `data_package_subscriptions` — partner contracts: tier, cpm_rate_usd override, contracted_records cap, records_delivered, max_records_per_query, status, expires_at, total_billed_usd.
- `package_delivery_jobs` — every delivery audited: job_type, fields/segments requested, k_anonymity_passed/value, consent_verified_count, cost_usd, cpm_used, status, rejection_reason.

### Helper functions (SECURITY DEFINER)
- `check_package_access(partner_id, package_slug)` → returns `{granted, package_id, subscription_id, tier, max_records_per_query, min_k_anonymity, cpm_rate, remaining_records}` or `{granted:false, reason}`.
- `record_package_delivery(...)` → inserts delivery_job row + bumps subscription counters atomically.

### Edge function: `data-package-query`
SHA-256 API-key auth (api_partners). Five modes:
1. `catalog` — list active packages + the partner's subscription state per package (no sub required).
2. `field_catalog` — list whitelisted fields for a package (sub required).
3. `segment_counts` — bucket counts per IAB segment, suppressed if count < min_k_anonymity.
4. `query` — per-row delivery from `v_partner_profile_signals`, with per-field transforms + k-anon gate (returns 422 if total < threshold).
5. `export` — same as query, intended for batch.

Cost model: `(records / 1000) * cpm`, billed to subscription on success.

### Compliance alignment
- IAB Audience Taxonomy 1.1 — segment_id/parent/tier columns.
- IAB Data Transparency 1.2 — provider_name/domain, source_type, recency_days, cookie_free, legal_basis on every package.
- LiveRamp Clean Room — per-field transform + is_identifier/is_partition_key.
- k-anonymity ≥ 25 default per package, 50–100 recommended for HNWI/finance.

### To onboard a partner
1. Insert into `api_partners` with sha256 of their key.
2. Insert into `data_package_subscriptions` (partner_id, package_id, tier, cpm_rate_usd, contracted_records, expires_at).
3. Partner POSTs `{"mode":"catalog"}` to discover; then `{"mode":"query","package_slug":"...","fields":[...]}`.
