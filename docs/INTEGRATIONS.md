# SuperNomad — External Integrations Master Spec

> Single source of truth. Mirrors `src/integrations/registry.ts` and
> `supabase/functions/_shared/providerAdapter.ts`.
> Per-provider activation prompts live under
> `knowledge://skill/integration-prompts/` (see also `.workspace/skills/integration-prompts/`).

---

## How a coder activates a new provider (5 steps)

1. **Pick the integration** from the table below; note its `key`.
2. **Add the secrets** listed under the chosen provider to Supabase Edge
   Function secrets (use the `secrets--add_secret` tool).
3. **Open the matching prompt file** at
   `knowledge://skill/integration-prompts/<promptFile>` — it contains the
   full endpoint contract, headers, payload shape, and a paste-ready
   "implement this" prompt for the AI assistant.
4. **Wrap the live call with `callProvider`** from
   `supabase/functions/_shared/providerAdapter.ts`. Keep the `demo:` branch
   intact — the adapter falls back when secrets are missing.
5. **Flip the entry** in `src/integrations/registry.ts` from `"ready"` /
   `"demo"` to `"live"` and run the affected edge function tests.

After step 5, every UI surface that consumed the registry (Integrations
hub, Concierge context, Admin status board) reflects the change with no
additional code edits.

---

## Modes

| Mode | Meaning |
|------|---------|
| `live` | Secret present, production calls active. |
| `ready` | Adapter coded, awaiting secret/contract activation. |
| `demo` | Curated mock data — Source-of-Truth banner shown in UI. |
| `planned` | Designed but not yet scaffolded. |

`APP_FORCE_DEMO=1` forces every `live` integration into demo for safe staging.

---

## Domain map

### 🤖 AI

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `ai-gateway` | Lovable AI Gateway (Gemini) | live | Primary LLM/embed endpoint |
| `elevenlabs-tts` | ElevenLabs | live | Concierge male voice |
| `liveavatar` | HeyGen | ready | Talking avatar (mouth-sync ready) |

### 🍽️ Dining

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `michelin-50best` | Michelin + 50Best (AI research) | live | Verified, source-ranked |
| `reservation-booking` | Tock / Resy / OpenTable / SevenRooms | ready | Schema unified in `FineDiningRestaurant.booking[]` |

### ✈️ Travel

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `flights` | Duffel / Amadeus / Kiwi | demo | Premium-search default |
| `hotels` | Amadeus / Booking / Hotelbeds | demo | 5★ + suites by default |
| `rides` | Karhoo / Uber / Lyft | ready | Karhoo = 100+ cities single contract |
| `air-charter` | Paramount / Jettly / Avinode | demo | Empty-leg discounts |

### 🛂 Identity & Trust

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `walt-id` | walt.id | live | JWT-VC issuance |
| `kyc-liveness` | Persona / Onfido / Sumsub | planned | Doc + selfie liveness |

### 💳 Payments

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `stripe-issuing` | Stripe Issuing + Connect | ready | Virtual cards + payouts |
| `x402` | Coinbase x402 | planned | AI-to-AI USDC micropay |
| `usdc-base` | Coinbase CDP | planned | Affiliate payouts on Base |

### 📣 Communication

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `twilio-voice` | Twilio via connector gateway | ready | Toggle `app_settings.real_calling_enabled` |
| `resend-email` | Resend | ready | Reports, reminders, invites |
| `telegram-bot` | Telegram Bot API | planned | Push safety alerts |

### 🛡️ Safety & Intel

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `threat-intel` | GDACS / State Dept / FCDO / Crisis24 | demo | Guardian heartbeat |
| `air-quality` | WAQI | live | 10-min cache |

### 📜 Compliance

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `visa-rules` | Sherpa° / iVisa / gov scrape | demo | Schengen + ETIAS |
| `school-holidays` | AI-aggregated ministry sources | live | Weekly refresh, ~190 countries |

### 🩺 Health

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `who-vaccines` | WHO / CDC | demo | Per-country recs |

### 🗂️ Productivity

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `email-oauth` | Google + MS Graph | live | Travel Inbox parsing |
| `receipt-ocr` | AI Gateway Vision | live | Receipt → Expense |
| `cloud-storage` | AWS S3 / Cloudflare R2 | planned | Encrypted-first backup |

### 📍 Location

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `ip-geo` | ipapi / ipinfo | live | VPN detection |
| `maps-places` | Mapbox / Google Places / Foursquare | planned | Map + place search |
| `weather` | Open-Meteo | live | No key required |

### 🛍️ Commerce

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `esim` | Airalo / GigSky | planned | On-demand data plans |
| `travel-insurance` | SafetyWing / Genki | planned | Nomad affiliate |

### 📊 Data (B2B)

| Key | Provider | Mode | Notes |
|-----|----------|------|-------|
| `b2b-gateway` | SuperNomad-hosted | live | K-anonymity, consent-gated |

---

## Secret checklist (required for `live` + `ready`)

Run `getRequiredSecretNames()` from `src/integrations/registry.ts` for the
machine-readable list. Current set:

```
AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET, BOOKING_AFFILIATE_ID,
CDP_API_KEY, CDP_API_SECRET, CRISIS24_API_KEY, DUFFEL_API_KEY,
ELEVENLABS_API_KEY, FSQ_API_KEY, GENKI_PARTNER_ID, GIGSKY_API_KEY,
GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_PLACES_API_KEY,
HEYGEN_API_KEY, HOTELBEDS_API_KEY, HOTELBEDS_SECRET, IPINFO_TOKEN,
IVISA_API_KEY, KARHOO_API_KEY, KARHOO_SECRET, KIWI_API_KEY,
LOVABLE_API_KEY, LYFT_CLIENT_ID, LYFT_CLIENT_SECRET, MAPBOX_TOKEN,
MS_OAUTH_CLIENT_ID, MS_OAUTH_CLIENT_SECRET, ONFIDO_API_KEY,
OPENTABLE_API_KEY, OPENTABLE_RID, PARAMOUNT_API_KEY, PERSONA_API_KEY,
RESEND_API_KEY, RESY_API_KEY, SAFETYWING_PARTNER_ID, SEVENROOMS_API_KEY,
SHERPA_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUMSUB_APP_TOKEN,
SUMSUB_SECRET, TELEGRAM_BOT_TOKEN, TOCK_API_KEY, TWILIO_API_KEY,
TWILIO_PHONE_NUMBER, UBER_CLIENT_ID, UBER_CLIENT_SECRET, WAQI_TOKEN,
WALT_ID_API_KEY, WALT_ID_TENANT, X402_API_KEY, X402_FACILITATOR_URL
```

---

## Reverse-engineering principles applied

- **Unified schemas**: dining `booking[]` already typed for 4 reservation
  engines; switching providers per restaurant requires zero UI work.
- **Adapter > per-call branching**: `callProvider()` centralises retry,
  timeout, source tagging, fallback.
- **Evidence-First tagging**: every adapter result carries `_source`,
  `_provider`, `_integration`. UI components must surface `_source: "demo"`
  with a "Demo data" badge (Evidence-First memory).
- **Voice parity**: every feature appears in `featureRegistry.ts`, so
  voice control automatically routes once added.
- **Secret-less startup**: app boots fully in demo; activation is a secret
  + a one-line registry flip.
