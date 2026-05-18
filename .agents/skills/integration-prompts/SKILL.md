---
name: integration-prompts
description: Ready-made activation prompts for every external API in the SuperNomad integration registry. Surfaces when a user wants to "connect", "activate", "integrate", or "go live" with a specific provider (Stripe, Karhoo, Duffel, Tock, Resend, Twilio, walt.id, HeyGen, etc.).
---

# Integration Activation Prompts

This skill provides paste-ready prompt files for activating any external
API documented in `src/integrations/registry.ts` and `docs/INTEGRATIONS.md`.

## How to use this skill

1. Identify the integration `key` from `docs/INTEGRATIONS.md`.
2. Read the matching prompt file under
   `knowledge://skill/integration-prompts/<key>.md` — each file contains:
   - Required secrets
   - Auth flow (headers, OAuth token exchange, signing)
   - Endpoint contract (URL, method, request schema, response schema)
   - Demo→Live diff (the exact `callProvider({ live: ... })` body)
   - Test command (Deno test or curl)
3. Wrap the live implementation with `callProvider()` from
   `supabase/functions/_shared/providerAdapter.ts`.
4. Flip the registry entry mode to `"live"`.

## Files bundled

Each `*.md` in this directory corresponds to one integration key. They are
templated with the same headings so the AI can act mechanically:

```
# <name>
## Secrets
## Auth
## Endpoints
## Demo→Live diff
## Tests
## Activation prompt (paste to AI)
```

## Naming convention

`<integration-key>.md` — must match the `promptFile` field in
`src/integrations/registry.ts`.
