---
name: Pen-test & GDPR Audit Hardening (Apr 2026)
description: Auth-required RLS on all PII tables, ai_cache locked, vector ext moved, XSS removed, GDPR Art. 17 delete added
type: feature
---

## Pen-test + GDPR audit fixes applied 19 Apr 2026

### Critical (CVSS High) — fixed
1. **Spoofable device-id RLS** — `check_data_access()` trusted `x-device-id` HTTP header. Any anon could read another user's `snomad_profiles` (encrypted_identity), `trust_pass_credentials` (raw JWTs), `audit_log`, `chat_messages`, `travel_history`, `ai_memories`, `knowledge_graph_edges`, `conversations`, `conversation_summaries`, `device_sessions`, `ai_usage_logs`. **Fix**: dropped device-id policies on these tables; replaced with `auth.uid() = user_id` (TO authenticated). Edge functions use service_role and continue to work.
2. **ai_cache fully public** — anon could read/write all cached AI prompts & responses. **Fix**: SELECT/INSERT restricted to `service_role` only.

### High — fixed
3. **vector extension in public schema** → moved to `extensions` schema.
4. **XSS via `document.write` + template literals** in `SecureDocumentVault.generateQRCode` and `PDFReportGenerator.printPDF`. **Fix**: replaced with safe `createElement`/`textContent` and Blob URL with `<iframe>`.

### GDPR (Art. 17 / Right to Erasure) — fixed
5. Added DELETE policy on `snomad_profiles` so users can erase their encrypted identity vault.
6. Added DELETE policy on `device_sessions`.
7. Made `user_id` NOT NULL on `conversations` and `trust_pass_credentials`; deleted orphan rows.

### Privilege escalation defense-in-depth
8. RESTRICTIVE policies on `user_roles` blocking INSERT/UPDATE/DELETE for non-admins (belt-and-braces — has_role still gates the permissive ALL policy).

### Pre-auth (demo / guest) data flow
- Guest data stays in `localStorage` only; nothing reaches Postgres before sign-in.
- On first sign-in, `migrate_device_to_user()` already promotes any prior device-scoped rows to the user (still works for backward compat with rows created during the auth-bridge moment).
- `getDeviceId()` is still used for client-side analytics keys but no longer grants any DB access.

### NOT a code issue (Supabase dashboard only)
- **Leaked password protection** (HIBP) is OFF by default. To enable: Supabase Dashboard → Auth → Policies → "Leaked password protection". Recommended ON for production.
- **MFA enforcement** for sensitive accounts: enable additional factors in Auth settings.
