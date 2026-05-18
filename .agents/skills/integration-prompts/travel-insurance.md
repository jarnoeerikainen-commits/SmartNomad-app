# Travel Insurance (travel-insurance)

## Secrets
- SafetyWing: `SAFETYWING_PARTNER_ID` (affiliate deeplink)
- Genki: `GENKI_PARTNER_ID`

## Pattern
Both currently affiliate-link based. SafetyWing has a Partner API for
direct quoting (request access) — falls back to deeplink with partner id.

## Activation prompt
> Activate SafetyWing first. Deeplink format: `https://safetywing.com/nomad-insurance?referenceID=${SAFETYWING_PARTNER_ID}&adults=&children=&start=&end=`. Track conversions via `affiliate-router`.
