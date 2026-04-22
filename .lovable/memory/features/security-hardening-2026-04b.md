---
name: Security Hardening (Apr 2026 — pass 2)
description: Real AES-256-GCM client encryption, MFAGate component, CSP + permission headers, referral PII masking via safe view
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

### Production rollout checklist
1. Supabase Auth → enable **Leaked password protection** (HIBP) and **TOTP**.
2. `UPDATE app_settings SET require_mfa_for_payments = true, require_mfa_for_sensitive = true WHERE id = 1;`
3. Insert at least one admin row in `user_roles` so admin policies are reachable.
4. Verify CSP doesn't block any production domains you've added (extend `connect-src`).
