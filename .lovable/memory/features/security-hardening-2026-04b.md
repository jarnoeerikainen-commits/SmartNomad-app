---
name: Security Hardening (Apr 2026 — pass 2 + pen-test pass 3/4)
description: Real AES-256-GCM client encryption, MFAGate, CSP/permission headers, referral PII masking, plus pen-test pass closing demo-org + device-id-spoof + storage + cache vulnerabilities
type: feature
---

## Pass-2 hardening (22 Apr 2026)

### Real client-side encryption (`src/utils/secureStorage.ts`)
- New `encryptJson` / `decryptJson` helpers using **AES-256-GCM** via Web Crypto. Key derived from device ID with PBKDF2 (100k iters, SHA-256). Versioned blob format `{v:1, iv, ct}`.
- Replaces the prior `btoa(JSON.stringify(...))` "encryption" (just base64) used in:
  - `PaymentOptions/PaymentOptionsDashboard.tsx`
  - `AwardCards/AwardCardsDashboard.tsx`
  - `PassportManager.tsx` (also migrates legacy plaintext `passports` / `visas` / `workingPermits` keys → encrypted keys, then wipes plaintext)
- Async APIs; persistence wrapped in fire-and-forget. Falls back to v0 plaintext envelope on crypto failure so we never lose user data.

### MFA gate (`src/components/auth/MFAGate.tsx`)
- Wraps sensitive screens. Reads `app_settings.require_mfa_for_payments` / `require_mfa_for_sensitive`. Demo + guest users always pass through (frictionless personas).
- Wired into `PaymentOptions` (payments flag) and `SnomadIdVault` route in `AppLayout.tsx` (sensitive flag).
- Posture is **balanced**: code is shipped, both flags remain `false` in `app_settings`. Flip in Supabase to enforce.

### CSP + security headers (`index.html`)
- `Content-Security-Policy` meta with allow-list for Supabase REST/Realtime/Functions, Lovable preview/HMR, Google Fonts, Open-Meteo, Nominatim, WAQI, ElevenLabs, Lovable AI Gateway. `object-src 'none'`, `frame-ancestors` limited.
- `Permissions-Policy` restricts geolocation/camera/microphone/payment to `self`, blocks accelerometer/gyro/magnetometer/FLoC.
- `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`.

### Referral PII masking (DB migration)
- Created `public.affiliate_referral_clicks_safe` view (security_invoker) exposing only country/UTM/conversion. IP, user agent, fingerprint, converted_user_id are no longer affiliate-readable.
- Dropped `Affiliates read own clicks` policy on `referral_clicks`; replaced with admin-only read for fraud investigation. Service role still has full access.

### Backend rate limiting — deferred
- Lovable's backend has no rate-limit primitives yet (per platform note). Skipped from this pass; revisit when infra ships.

### Pass-2b additions (22 Apr 2026, later)
- **`PasswordStrengthMeter`** (`src/components/auth/PasswordStrengthMeter.tsx`): zxcvbn-style 0-4 scoring with live rule checklist. Wired into the signup tab in `Auth.tsx`. Min length raised 6→8, min score 3 enforced before `signUp()` is called. Demo "Continue as Guest" path unchanged.
- **`SecurityActivityFeed`** (`src/components/auth/SecurityActivityFeed.tsx`): renders the user's last 25 `audit_log` rows under Settings → Security. Highlights elevated-risk actions (failed logins, MFA unenroll, payment blocks, vault decrypt failures, credential revocations). Returns `null` for guests/demo.
- **AgenticWallet MFA gate**: confirmed already covered — `AgenticWalletDashboard` is rendered as a tab inside `PaymentOptionsDashboard`, which is wrapped by `<MFAGate flag="require_mfa_for_payments">`.
- **Frontend tests**: added Vitest + Testing Library setup (`vitest.config.ts`, `src/test/setup.ts`). 12 tests passing covering `secureStorage` round-trip, legacy format compat, IV uniqueness, and `evaluatePassword` scoring.

## Pass-3/4 — Automated pen test (24 Apr 2026)

Ran `security--run_security_scan` + `supabase--linter` + `code--dependency_scan`. Baseline: 0 dep CVEs, 0 linter issues, 1 TODO, 7 console.logs, 1 safe `dangerouslySetInnerHTML` (shadcn chart). Scanner found 5 RLS issues — all closed by two migrations.

### Pass-3 fixes (migration `20260424_pen_test_pass_3`)
1. **Demo-org PII** — dropped `anyone reads demo org members/trips/expenses` policies (role `public`). Replaced with `authenticated`-only equivalents on `organization_members`, `business_trips`, `business_trip_expenses`. Demo personas remain visible because they sign in as Supabase guest sessions (still `authenticated` role).
2. **Expense-table device-id spoofing** — dropped policies that called `check_data_access(device_id, user_id)` (which falls back to caller-controlled `x-device-id` header when `auth.uid()` is null). Replaced with strict `auth.uid() IS NOT NULL AND user_id = auth.uid()` policies on `expenses`, `expense_trips`, `expense_receipts`, `expense_audit_log`, `expense_terms_acceptance`. Added matching `service_role` ALL policies so edge functions retain full access.
3. **Support-ticket device-id spoofing** — dropped `Guests read/create tickets by device` policies. Guests must now go through the support edge function (service-role insert).
4. **OAuth refresh token plaintext** — added `encrypted_refresh_token` + `encryption_version` columns. Created `oauth_connections_safe` view (security_invoker) exposing only `has_refresh_token` boolean. Plaintext column marked DEPRECATED via `COMMENT`.
5. **AI cache cross-tenant leak** — added `user_scope text DEFAULT 'global'` column + `(user_scope, cache_key)` index. Edge functions must scope lookups going forward.

### Pass-4 fixes (migration `20260424_pen_test_pass_4`)
6. **Receipts storage bucket device-id spoofing** — `receipts_owner_{select,insert,update,delete}` policies on `storage.objects` rebuilt to require `auth.uid() IS NOT NULL` and folder ownership matches `auth.uid()`. Device-id branch removed entirely.
7. **Organizations billing leak via demo flag** — dropped `members can view their org` (which OR'd `is_org_member(id) OR demo = true` exposing billing_email/join_code/billing_method to all auth users). New policy is members-only. Created `organizations_public` view exposing only `id, name, slug, logo_url, demo, timestamps` for demo discovery.
8. **AI cache explicit deny** — added `ai_cache_no_client_read` policy `FOR SELECT TO authenticated USING (false)` for defense-in-depth (service role still has full ALL access).

### Final scan (post pass-4)
- 0 critical, 0 high, 4 informational notes — all reviewed and confirmed non-issues by the scanner itself:
  - `user_roles` escalation: "this flow appears correct" (RESTRICTIVE policy blocks self-grant).
  - `referral_clicks` retention: admin-only is correct posture.
  - `oauth_connections` no client INSERT: intentional (created via edge-function callback).
  - `agentic_transactions` no DELETE: intentional (immutable audit trail).
- `supabase--linter`: 0 issues.
- `code--dependency_scan`: 0 high/critical CVEs.

### Code-quality sweep
- `tsc --noEmit`: clean.
- 1 TODO/FIXME across 136k LOC.
- 7 `console.log` (acceptable).
- Single `dangerouslySetInnerHTML` (shadcn `chart.tsx` — internal CSS, safe).

### Production rollout checklist (carries over from pass-2)
1. Supabase Auth → enable Leaked password protection + TOTP.
2. `UPDATE app_settings SET require_mfa_for_payments = true, require_mfa_for_sensitive = true WHERE id = 1;`
3. Insert at least one admin row in `user_roles`.
4. Verify CSP `connect-src` covers any new production domains.
5. **NEW**: Wire `oauth-refresh` edge function to write `encrypted_refresh_token` + null out plaintext `refresh_token` on next token rotation.
6. **NEW**: Update edge-function cache reads/writes to pass `user_scope` (use `'global'` only for non-PII generic content).
7. **NEW**: Switch any client code reading from `oauth_connections` to `oauth_connections_safe`; switch demo-org listings to `organizations_public`.
