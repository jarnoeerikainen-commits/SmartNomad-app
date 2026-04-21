---
name: Agentic Payments Backend
description: Unified router for AI-driven payments across x402 v2, MPP, Visa TAP (RFC 9421), Stripe Issuing, and Mastercard Cloud — production-ready with demo + live modes
type: feature
---

## Agentic Payments Backend

Production-ready payment infrastructure for AI agents. One edge function (`agentic-payments-router`) abstracts five protocols behind a unified API.

### Protocols

| Protocol | When selected | Specs |
|---|---|---|
| **x402 v2** | < $1 OR `micro-payment`/`data-query`/`api-call` | Coinbase, base64 PAYMENT-REQUIRED/PAYMENT-SIGNATURE/PAYMENT-RESPONSE headers; USDC on Base |
| **MPP** | $1–$50 SaaS / API charges | Stripe + Tempo IETF draft; HTTP 402 + `WWW-Authenticate: Payment` / `Authorization: Payment` / `Payment-Receipt` |
| **Visa TAP** | High-value bookings ≥$200 | RFC 9421 HTTP Message Signatures; `Signature-Input` + `Signature` + `Agent-Intent` headers; Ed25519 (HMAC in demo) |
| **Stripe Issuing** | Default fallback (single-use virtual Visa) | Stripe Issuing API; live mode requires `STRIPE_SECRET_KEY` |
| **Mastercard Cloud** | Dining / wellness (category-aware) | Predictive controls; live mode requires Mastercard Merchant Cloud API |

### Database (RLS-enforced)
- `agentic_guardrails` — per-user spending rules (max per-tx / daily / weekly, allowed categories + protocols, approval threshold)
- `agentic_virtual_cards` — Stripe Issuing-style cards (single-use, recurring, merchant-locked)
- `agentic_payment_intents` — short-lived state machine (`created → quoted → authorized → completed`)
- `agentic_transactions` — immutable settled ledger (service-role insert only)
- RPC `evaluate_agentic_guardrail()` — verdict: approved / requires_user_approval / blocked, includes daily+weekly spend totals

### Edge function actions
`POST /agentic-payments-router` with `{ action, deviceId, ... }`
- `quote` — recommend protocol + fee for a `PaymentRequest` (no DB writes; works without auth)
- `authorize` — evaluate guardrail, issue virtual card if needed, create intent (auth required for persistence; preview-only without)
- `execute` — settle intent, write immutable transaction, build protocol-specific receipt
- `refund` — mark intent + transaction refunded
- `status` — fetch intent state

### Mode toggle
- `AGENTIC_PAYMENT_MODE=demo` (default) — deterministic, HMAC-signed, no external calls; perfect for demos + tests
- `AGENTIC_PAYMENT_MODE=live` — proxies to real providers; requires `STRIPE_SECRET_KEY`, `COINBASE_X402_KEY`, `MASTERCARD_MCC_KEY`, etc.
- `AGENTIC_PAYMENT_DEMO_SECRET` — override HMAC secret for TAP signatures in demo mode

### Frontend
- `src/services/AgenticPaymentService.ts` — typed client (`quote`, `authorize`, `execute`, `refund`, `status`, `payNow`)
- Wire concierge `ActionCards` payment items through `payNow()` to settle in real time
- Existing `AgenticWalletDashboard` (DEMO_GUARDRAILS / DEMO_VIRTUAL_CARDS / DEMO_AGENTIC_TRANSACTIONS) remains the UI; backend is now ready to back it once auth is enabled

### Wire-format references (verified)
- x402 v2: https://github.com/coinbase/x402/blob/main/specs/transports-v2/http.md
- MPP: https://mpp.dev/protocol/transports/http
- Visa TAP: https://github.com/visa/trusted-agent-protocol + RFC 9421
- Visa Intelligent Commerce: https://developer.visa.com/capabilities/visa-intelligent-commerce
- Stripe MPP: https://docs.stripe.com/payments/machine/mpp

### Tests
- `supabase/functions/agentic-payments-router/index.test.ts` — 12 unit tests covering selector, intent IDs, x402 roundtrip, MPP challenge/credential/receipt, TAP sign+verify (incl. tamper detection), virtual card issuance
