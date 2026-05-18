# walt.id Trust Pass (walt-id)

## Secrets
- `WALT_ID_API_KEY`
- `WALT_ID_TENANT` (tenant slug)

## Auth
`Authorization: Bearer ${WALT_ID_API_KEY}` against issuer base.

## Endpoints
- `POST /openid4vc/jwt/issue` — body `{ issuerKey, issuerDid, credentialConfigurationId, credentialData: { credentialSubject, ... } }` → offer URI
- `POST /openid4vc/verify` — body `{ credential }` → `{ valid, claims }`

## Already wired
`supabase/functions/walt-id-verifier/index.ts` + `trust-pass-verify/index.ts`.
DB: `trust_pass_credentials` + RPC `verify_trust_tier`.

## Activation prompt
> Confirm walt.id is live. Test the round-trip: issue → store in `trust_pass_credentials` → call `verify_trust_tier(snomad_id, 'nomad', partner_id)`. Validate JWT-VC signature with kid lookup.
