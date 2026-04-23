# SuperNomad — Architecture

> Audience: senior engineers and CTOs onboarding to the codebase.
> Scope: 305 React components, 87 Postgres tables, 45 Supabase Edge Functions, 13-language i18n.

---

## 1. High-level shape

```
                ┌────────────────────────────────────────┐
                │              React 18 + Vite           │
                │   305 components · TanStack Query · i18n│
                └──────────────┬─────────────────────────┘
                               │  fetch / supabase-js
                               ▼
        ┌──────────────────────────────────────────────────┐
        │           Supabase Edge Functions (Deno)         │
        │  45 functions · _shared/ utilities · JWT verify  │
        └──┬──────────────┬──────────────┬─────────────────┘
           │              │              │
           ▼              ▼              ▼
  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐
  │  Postgres    │  │  Lovable   │  │  External APIs   │
  │  87 tables   │  │  AI Gateway│  │  ElevenLabs,     │
  │  RLS + RPC   │  │  (Gemini)  │  │  Karhoo, walt.id │
  │  pgvector    │  │            │  │  Resend, etc.    │
  └──────────────┘  └────────────┘  └──────────────────┘
```

---

## 2. Frontend layers

| Layer | Folder | Responsibility |
|---|---|---|
| Pages | `src/pages/` | Route entrypoints — lazy-loaded |
| Features | `src/components/<feature>/` | Domain widgets (concierge, threats, wallet) |
| Primitives | `src/components/ui/` | shadcn/ui — never edit semantics, only restyle |
| Hooks | `src/hooks/` | Reusable state (`useDeviceId`, `useAuth`, `useFeatureFlag`) |
| Services | `src/services/` | Class wrappers around Supabase + edge calls |
| Utils | `src/utils/` | Pure helpers (date, currency, snomadId) |
| Integrations | `src/integrations/supabase/` | Generated client + types — **read-only** |

**Routing**: React Router v6, lazy-loaded routes, single mobile-aware `AppShell`.
**State**: TanStack Query for server state; Zustand only for ephemeral UI (sidebar, voice).
**Theme**: `index.css` semantic HSL tokens → Tailwind via `tailwind.config.ts`. Never hardcode colors.

---

## 3. Edge Function categories (45 total)

| Category | Functions | Purpose |
|---|---|---|
| **Concierge** | `travel-assistant`, `concierge-actions`, `concierge-evaluator`, `subject-chat-moderator` | Conversational AI, tool calls, evaluator-loop |
| **Specialist AI** | `legal-chat`, `medical-chat`, `cyber-assistant`, `marketplace-ai`, `moving-ai-assistant`, `social-chat-ai`, `support-ai`, `city-services` | Domain-specific Gemini wrappers |
| **Memory & RAG** | `memory-distill`, `generate-embedding`, `conversation-compress` | Hybrid RAG 2.0 — see `_shared/hybridSearch.ts` |
| **Orchestration** | `snomad-orchestrator`, `community-orchestrator`, `agent-department`, `admin-ai-brain`, `admin-concierge` | Cross-feature automation |
| **B2B** | `supernomad-gateway`, `partner-data-query`, `data-package-query`, `gateway-admin`, `trust-pass-verify` | Partner API, data packages, Trust Pass |
| **Auth & Identity** | `walt-id-verifier`, `email-oauth-exchange`, `liveavatar-session` | Identity issuance, OAuth, avatar tokens |
| **Commerce** | `agentic-payments-router`, `karhoo-rides`, `award-card-scan`, `rewards-optimizer`, `affiliate-router` | Payments, bookings, loyalty |
| **Content** | `venue-discovery`, `trend-refresh`, `school-holidays-refresh`, `translate-ui`, `source-monitor` | Background data refresh |
| **Voice & Media** | `elevenlabs-tts`, `receipt-ocr`, `liveavatar-session` | Speech, OCR, avatars |
| **Notifications** | `send-calendar-reminder`, `community-chat` | Outbound messaging |

Shared utilities live in `supabase/functions/_shared/`:
- `modelRouter.ts` — picks Gemini model tier per task
- `antiHallucination.ts` — citation enforcement
- `hybridSearch.ts` — pgvector + tsvector blend
- `trustPassCrypto.ts` — JWT-VC sign/verify
- `cors.ts`, `auth.ts`, `rateLimit.ts`

---

## 4. Database (87 tables, grouped)

| Domain | Key tables |
|---|---|
| **Identity** | `profiles`, `user_roles`, `device_sessions`, `consent_ledger`, `trust_pass_credentials` |
| **AI** | `ai_memories`, `ai_cache`, `ai_usage_logs`, `conversations`, `chat_messages`, `conversation_summaries` |
| **Knowledge graph** | `knowledge_graph_edges`, `snomad_profiles`, `travel_history` |
| **B2B** | `api_partners`, `api_access_policies`, `api_audit_logs`, `data_packages`, `data_package_subscriptions`, `data_access_requests` |
| **Affiliate** | `affiliate_accounts`, `affiliate_earnings`, `affiliate_payouts`, `referrals`, `referral_clicks` |
| **Commerce** | `agentic_guardrails`, `agentic_payment_intents`, `agentic_transactions`, `agentic_virtual_cards`, `expense_receipts`, `expenses` |
| **Admin brain** | `admin_ai_runs`, `admin_ai_insights`, `admin_ai_recommendations`, `admin_ai_reports` |
| **Source monitor** | `verified_sources`, `source_snapshots`, `change_proposals`, `source_audit_log` |

**RLS policy pattern**: every user-data table uses `check_data_access(device_id, user_id)` SECURITY DEFINER helper. Roles via `has_role()` / `has_staff_role()` — never check role on the row.

---

## 5. AI architecture (3-tier)

1. **Conversational** — `travel-assistant` calls `concierge-actions` for tool execution, then `concierge-evaluator` rates the reply (re-runs if score < 0.6).
2. **Distillation** — `memory-distill` extracts durable facts, generates embeddings, persists to `ai_memories`.
3. **Orchestration** — `snomad-orchestrator` walks the knowledge graph (`traverse_knowledge_graph`) to trigger cross-feature actions.

Model routing: Gemini 3 Flash for chat, Gemini 3 Pro for legal/medical, embedding-001 for vectors. All routed via `LOVABLE_API_KEY` (Lovable AI Gateway) — no provider keys in the app.

---

## 6. Trust & Sovereign Access

- `consent_ledger` — append-only consent records, hashed text + version
- `data_access_requests` — every B2B record served logged with consent ID
- `trust_pass_credentials` — JWT-VC issuance via `walt-id-verifier`, tier-checked via `verify_trust_tier()` RPC
- `audit_log` — universal action log (RLS: own rows only, admins see all)

---

## 7. Build & deploy

| Stage | Tool |
|---|---|
| Frontend | Vite → static dist, deploys to Lovable CDN / Vercel |
| Edge functions | Supabase CLI auto-deploys on save in Lovable |
| Migrations | `supabase/migrations/` — apply via Lovable migration tool |
| Mobile | Capacitor wraps `dist/`; `appId: app.lovable.476ad...` |

See `OPERATIONS.md` for runbook, `SECURITY.md` for threat model, `API.md` for partner contract.
