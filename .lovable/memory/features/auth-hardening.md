---
name: Auth Hardening (MFA + Roles + Trust Pass DB)
description: TOTP MFA, app_role enum, app_settings flags, trust_pass_credentials and audit_log tables. Demo users see read-only preview cards; real auth users get full TOTP enrollment + DB-persisted credentials.
type: feature
---

# Auth Hardening

## Database (production-ready, demo-compatible)
- **`user_roles`** + `app_role` enum (`admin | premium | user`) + `has_role()` security-definer function. Default `user` role is auto-granted on first sign-in via `migrate_device_to_user`.
- **`app_settings`** single-row config: `demo_mode_enabled`, `require_auth`, `require_mfa_for_payments`, `require_mfa_for_sensitive`. Public read, admin-only update. Flip these to switch the app from demo to production-strict — no code change required.
- **`trust_pass_credentials`** dual-mode table (device_id for guests, user_id for auth users). Stores W3C VCs issued via TrustPassService. Unique on `(device_id, credential_type)` so re-verification upserts.
- **`audit_log`** append-only sensitive-action log (no UPDATE/DELETE policies). Every Trust Pass issuance writes an entry.
- **Helper fns**: `is_demo_mode()`, `has_verified_mfa()` (reads `auth.mfa_factors`).

## MFA (TOTP)
- `useMFA` hook: `enroll`, `verifyEnrollment`, `verifyChallenge`, `unenroll`, `factors`, `aal`, `mfaChallengeRequired`.
- `MFAEnrollment.tsx`: 3-step flow (intro → QR scan → 6-digit verify).
- `MFAChallenge.tsx`: shown post-signin when `aal1 → aal2`. Auth.tsx redirects to it.
- `SecuritySettings.tsx` (Settings → Security tab): list/add/remove factors for auth users.

## Demo experience (CRITICAL)
- Demo / guest users (no auth) on the Security tab see **3 read-only preview cards** (2FA, ID Verification, Audit Log) with "Available with a real account" notes — **zero actions, no enrollment buttons**. A "Create an account" CTA is shown.
- Trust Pass dashboard already shows the "Demo Mode" amber banner — unchanged.
- Demo personas (Meghan/John) are local-only and never trigger MFA.

## Production switch
1. `UPDATE app_settings SET demo_mode_enabled = false, require_mfa_for_payments = true WHERE id = 1;`
2. Insert at least one admin: `INSERT INTO user_roles (user_id, role) VALUES ('<your-uuid>', 'admin');`
3. Optionally tighten RLS on chosen tables to drop the device_id fallback.
