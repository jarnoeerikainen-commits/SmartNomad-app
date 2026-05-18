# KYC & Liveness (kyc-liveness)

## Secrets
- Persona: `PERSONA_API_KEY`
- Onfido: `ONFIDO_API_KEY`
- Sumsub: `SUMSUB_APP_TOKEN`, `SUMSUB_SECRET`

## Persona (recommended for embedded flow)
- `POST https://withpersona.com/api/v1/inquiries` → `{ id }` → embed via SDK.
- Webhook on `inquiry.completed` → store verification status against user.

## Activation prompt
> Add Persona. Create `kyc-start` (creates inquiry) + `kyc-webhook` (HMAC-verified) edge functions. On `completed`, issue a walt.id `KYC` credential and upgrade Trust Pass tier.
