# Security Posture

> Companion to `THREAT_MODEL.md` — concrete controls, not theory.

---

## 1. Authentication

- Supabase Auth (email/password, Google OAuth, magic link).
- MFA optional, **required** for `payments`, `vault`, and admin routes (`require_mfa_for_payments`, `require_mfa_for_sensitive` in `app_settings`).
- Sessions: 1 h JWT, 30-day refresh, rotation on use.
- Pre-auth: `device_id` (UUID, localStorage) lets users browse without account; on signup, `migrate_device_to_user()` reassigns rows.

## 2. Authorization

- **Row-level security** on every user-data table. Pattern:

```sql
CREATE POLICY "owner_or_device" ON public.<table>
FOR SELECT USING (public.check_data_access(device_id, user_id));
```

- **Roles** in `user_roles` (enum `app_role`: `admin`, `support`, `affiliate_manager`, `user`). Always checked via `public.has_role(auth.uid(), 'admin')` SECURITY DEFINER — never via column on a row.

## 3. Encryption

| Layer | Cipher |
|---|---|
| Snomad ID Vault (PII) | AES-256-GCM via Web Crypto API, key never leaves browser |
| Database at rest | Supabase default (AES-256) |
| In transit | TLS 1.3 only |
| Trust Pass JWT | HS256 (demo) → ES256 (live, walt.id) |

## 4. Secrets

All secrets in Supabase env. Never in client bundle. List of expected secrets in `ENV.md`. Rotation: 90 days for API keys, 365 days for signing keys.

## 5. RLS audit cadence

- Every PR touching `supabase/migrations/` triggers manual review checklist.
- Quarterly: full RLS dump diffed against last quarter, two-engineer signoff.
- Tooling: `supabase--linter` in CI (fails build on `error` level).

## 6. CSP & headers

```
Content-Security-Policy: default-src 'self';
  connect-src 'self' https://*.supabase.co https://api.elevenlabs.io;
  img-src 'self' data: https:;
  script-src 'self' 'wasm-unsafe-eval';
  frame-ancestors 'none';
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), camera=(self), microphone=(self)
```

## 7. Logging & retention

| Log | Where | Retention |
|---|---|---|
| Auth events | Supabase Auth | 90 d |
| Edge function logs | Supabase | 90 d |
| `audit_log` | Postgres | 7 y (compliance) |
| `api_audit_logs` | Postgres | 2 y |
| `staff_audit_log` | Postgres | 7 y |

## 8. Vulnerability disclosure

- `security@supernomad.com` — PGP key published at `/.well-known/security.txt`.
- Bug bounty (planned): HackerOne, scope = `*.supernomad.com` + supabase functions.
- Fix SLA: critical 24 h, high 7 d, medium 30 d.
