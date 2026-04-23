# Environment Variables

> Source of truth for every secret + config the app expects.
> Browser-side vars use the `VITE_` prefix; everything else is server-only.

---

## 1. Browser (`.env` → bundled by Vite)

| Var | Required | Source | Notes |
|---|---|---|---|
| `VITE_SUPABASE_URL` | yes | auto | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | yes | auto | Anon key — safe to ship |
| `VITE_SUPABASE_PROJECT_ID` | yes | auto | Project ref string |

**Never** put secret keys here. Anything in `VITE_*` is in the JS bundle.

---

## 2. Edge functions (Supabase secrets)

| Secret | Required | Where used | Rotation |
|---|---|---|---|
| `SUPABASE_URL` | yes | every fn | n/a |
| `SUPABASE_ANON_KEY` | yes | JWT validation | n/a |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | RLS bypass | 365 d |
| `SUPABASE_PUBLISHABLE_KEY` | yes | client-mode calls | n/a |
| `LOVABLE_API_KEY` | yes | Gemini routing | managed |
| `ELEVENLABS_API_KEY` | optional | `elevenlabs-tts` | 90 d |
| `LIVEAVATAR_API_KEY` | optional | `liveavatar-session` | 90 d |
| `HEYGEN_API_KEY` | reserved | future avatar | 90 d |
| `TRUST_PASS_SIGNING_KEY` | recommended | `walt-id-verifier` | 365 d |
| `WALT_ID_ISSUER_URL` | live-mode | Trust Pass live mode | n/a |
| `WALT_ID_VERIFIER_URL` | live-mode | Trust Pass live mode | n/a |
| `RESEND_API_KEY` | when email enabled | transactional email | 90 d |
| `KARHOO_API_KEY` | when rides enabled | `karhoo-rides` | 90 d |
| `STRIPE_SECRET_KEY` | when payments live | payments | 90 d |
| `STRIPE_WEBHOOK_SECRET` | when payments live | payments | 90 d |

---

## 3. How to add / rotate

```
# in Lovable chat
Add a secret called RESEND_API_KEY
```

Or via Supabase dashboard → Project Settings → Edge Functions → Secrets.

Rotation: bump the value, deploy, then revoke the old one upstream after 24 h grace.

---

## 4. Build secrets (workspace-level)

Used during `bun install`. Set in Workspace Settings → Build Secrets, **not** here.

| Var | Purpose |
|---|---|
| `NPM_TOKEN` | private npm packages (none currently) |

---

## 5. Capacitor / mobile

Configured in `capacitor.config.ts` — no secrets, just IDs:

```
appId: app.lovable.476ad2f60f334d8a8bd739eb233f8ca2
appName: SuperNomad
```

---

## 6. Local dev quick-start

`.env` is auto-populated. To add overrides for local edge function testing:

```
echo 'TRUST_PASS_SIGNING_KEY=dev-secret-do-not-use-in-prod' >> .env.local
```

Edge functions in production read from Supabase secrets, not `.env`.
