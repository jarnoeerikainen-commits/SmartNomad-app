# Stripe Issuing + Connect (stripe-issuing)

## Secrets
- `STRIPE_SECRET_KEY` (sk_live_… or sk_test_…)
- `STRIPE_WEBHOOK_SECRET` (whsec_…)

## Auth
`Authorization: Bearer ${STRIPE_SECRET_KEY}` on every call.

## Endpoints (Issuing)
- `POST /v1/issuing/cardholders` — create cardholder per user.
- `POST /v1/issuing/cards` — body `{ cardholder, currency, type: "virtual", spending_controls: { spending_limits: [{ amount, interval }] } }`
- `GET /v1/issuing/authorizations/{id}` — webhook for AI approval flow.

## Endpoints (Connect — affiliate payouts)
- `POST /v1/accounts` type=`express`
- `POST /v1/transfers` to connected account.

## Demo→Live diff (agentic-payments-router)
```ts
await callProvider({
  integrationKey: "stripe-issuing",
  providerId: "stripe",
  demo: () => ({ id: `ic_demo_${Date.now()}`, status: "active", source: "demo" }),
  live: async ({ secrets, fetch }) => {
    const r = await fetch("https://api.stripe.com/v1/issuing/cards", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secrets.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        cardholder: cardholderId,
        currency,
        type: "virtual",
        "spending_controls[spending_limits][0][amount]": String(maxAmount),
        "spending_controls[spending_limits][0][interval]": "per_authorization",
      }),
    });
    return await r.json();
  },
});
```

## Webhooks
Verify with `Stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)`.

## Activation prompt
> Activate Stripe Issuing for virtual cards. Wire `supabase/functions/agentic-payments-router/index.ts` with `callProvider({ integrationKey: "stripe-issuing", providerId: "stripe" })`. Respect Agentic Guardrails (DB rpc `evaluate_agentic_guardrail`). Add webhook endpoint at `/stripe-webhook` with signature verification.
