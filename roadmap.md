# Booking readiness roadmap

## Global social introduction pause

- [x] Pause new-friend and SportBuddy introductions for every user.
- [x] Disable timed recommendation windows and spoken match announcements.
- [x] Hide people discovery, AI matching, and nearby-nomad discovery while paused.
- [x] Block social matching and proactive meetup nudges in both app and edge functions.
- [x] Verify focused tests and protected edge-function type checks.
- [ ] Verify the latest preview build and browser behavior after deployment.
- [ ] Deploy protected edge functions when the deployment environment provides Supabase access.

- [x] Add authorized flight and hotel offer/order gateway with explicit demo/live provenance.
- [x] Add secure traveller profiles and invitation-only booking mandates.
- [x] Add quote expiry, repricing, approval, idempotency, order reconciliation, and audit records.
- [x] Add card-token and Lightspark/stablecoin payment references without storing card numbers or private keys.
- [x] Add concierge booking proposal and confirmation controls for chat and voice.
- [x] Add John Smith as a masked Finnish demo traveller without retaining supplied passport, address, or phone values in source/browser storage.
- [x] Correct misleading wallet claims and prevent simulated receipts from being presented as real bookings.
- [x] Add tests for parsers, guardrails, expiration, redaction, mandate safety, and supplier reconciliation.
- [x] Run focused tests, edge-function tests, lint, build health checks, and desktop browser verification.
- [x] Document commercial/API credentials still required for live ticketing and hotel fulfilment.

## External blockers

- [ ] Connect an approved Duffel Flights account and request Duffel Stays access; blocked on commercial credentials.
- [ ] Connect an approved tokenized-card issuer/acquirer and Lightspark/UMA settlement account; blocked on commercial credentials.
- [ ] Add server-managed encryption before retaining exact passport, address, or phone data; blocked on an approved key-management design.
- [ ] Enable invitation-only autonomous purchases only after supplier/payment webhooks, concurrent-execution controls, refund servicing, and operator reconciliation pass production certification.

## Premium booking record and anonymous demo

- [x] Add deterministic flight/hotel detail, mandatory-fee breakdowns, and opt-in ancillary prices.
- [x] Add a full simulated completion record with masked traveller, approval, funding, and reconciliation status.
- [x] Ask about both airport-transfer directions and connect “Find a ride” to separate demo ride review.
- [x] Remove named demo selectors from the header and morning view; ignore legacy named demo URLs.
- [x] Keep John only as the masked Finnish demo traveller in You and simulated booking records.
- [ ] Complete automated and browser verification.