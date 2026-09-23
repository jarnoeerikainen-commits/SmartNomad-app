# Authorized concierge booking and delegated payments

## Outcome
Build a production-shaped, demo-safe booking flow in which Concierge can search, prepare, approve, and simulate fulfilment for flights and hotels by chat or voice. The same interfaces will switch to live authorized suppliers only when commercial access and credentials exist.

No screen will claim a ticket, room, card charge, or stablecoin transfer completed unless the supplier/payment provider returns a verifiable order or transaction reference and reconciliation succeeds.

## Phase 1 — Truthful booking foundation
- Add one server-side travel-commerce gateway for flight and hotel search, offer refresh, order preparation, approval, execution, status, and cancellation readiness.
- Use an authorized aggregator-first adapter: Duffel for flights and Duffel Stays where account access supports it; keep Amadeus/Hotelbeds as documented alternatives rather than scraping airline or hotel websites.
- Return explicit `live`, `sandbox`, or `demo` provenance, supplier, verification time, expiry, cancellation terms, baggage/room/tax breakdown, and deep links.
- Keep Emirates results supplier-sourced; never imply Emirates Direct access until SuperNomad has Emirates Gateway or an approved distributor contract.
- Replace fabricated “completed” receipts with a strict state machine: draft → priced → approval required/mandate eligible → payment authorized → supplier order pending → ticketed/confirmed or failed.

## Phase 2 — Traveller identity and delegated authority
- Add RLS-protected traveller, booking-mandate, booking-order, approval-event, and payment-reference records with explicit grants.
- Scope every record to the signed-in owner. Delegated booking is invitation-only, revocable, time-bounded, traveller-specific, category-specific, currency/amount-limited, and supplier/payment-rail limited.
- Require fresh user approval for initial use, fare/room changes, missing documents, 3DS/SCA, high-risk travel, or any mandate mismatch.
- Store only masked passport metadata and contact summaries in normal records. Full passport/contact payloads remain encrypted vault data and are excluded from chat history, model prompts, analytics, logs, and receipts.
- Add John Smith as a clearly labelled demo traveller. The supplied passport number will not be committed to source or ordinary database columns; a secure demo-vault bootstrap will encrypt it before persistence and the interface will show only `••••8550`.

## Phase 3 — Card and stablecoin readiness
- Refactor payment execution so supplier order creation and payment authorization are idempotent and recoverable; never mark success from a locally generated receipt.
- Support tokenized card references only. Never store PAN or CVV. Card execution remains unavailable until an approved PCI payment/issuing setup is connected.
- Add a Lightspark-compatible UMA/stablecoin payment-reference adapter boundary for supported suppliers or settlement partners. Keep wallet private keys and credentials outside the client and mark the rail unavailable until a provider connection is configured.
- Add amount, merchant, traveller, route, date, currency, daily/weekly limits, mandate expiry, biometric/MFA/3DS challenge state, and emergency pause controls.
- Preserve the existing Danger Gate: no autonomous booking in Level 4 zones and explicit confirmation for elevated risk.

## Phase 4 — Concierge chat and voice experience
- Add compact booking-offer cards for flights and hotels with transparent totals, expiry countdown, fare/room rules, source status, traveller readiness, and payment readiness.
- Add clear actions: refresh price, review traveller, hold when genuinely supported, approve and book, open supplier checkout, add to calendar, and cancel.
- Use the same handlers for typed and spoken commands. Spoken approval must repeat the final supplier, itinerary/stay, traveller, total, currency, change/cancellation terms, and require an unambiguous confirmation before execution.
- Keep responses short. Sensitive values are never read aloud; passport display is masked.
- Retain existing concierge modes, source-of-truth handling, staggered speech, and safety gates.

## Phase 5 — Demo and operator readiness
- Provide deterministic, visibly labelled sandbox/demo offers and orders for John Smith so the complete flow can be demonstrated without charging money or issuing a real ticket.
- Show supplier, payment rail, mandate decision, approval evidence, idempotency key, and reconciliation status in the back office without exposing protected identity or payment data.
- Update integration status and documentation so “ready”, “sandbox/demo”, and “live” cannot be confused.
- Remove or rewrite claims such as “zero fraud declines”, “fully autonomous”, “PCI DSS”, or “online” unless supported by the actual connected account and evidence.

## Verification
- Unit tests: input validation, sensitive-data redaction, offer parsing, expiry/repricing, mandate decisions, risk gates, duplicate execution, supplier/payment failure, and reconciliation.
- Integration tests: search → select → prepare → approve → execute → confirm for one flight and one hotel in demo mode; verify no success state without a supplier reference.
- Voice tests: search, select, approve, reject, and interrupted/ambiguous confirmation.
- Browser checks at desktop and mobile widths for concierge cards, approval dialog, wallet/mandate controls, and masked traveller data.
- Run the full repository test and lint commands, then confirm current preview build/runtime logs are clean.

## External requirements for real purchases
- Live flight/hotel inventory and fulfilment require approved Duffel/airline/hotel-supplier commercial access and credentials.
- Live card charging/issuing requires an approved PCI-compliant provider account, tokenization, webhooks, 3DS/SCA, and settlement setup.
- Live Lightspark/stablecoin settlement requires a Lightspark/UMA account, supported supplier acceptance or an approved conversion/settlement partner, compliance approval, and secure server credentials.
- These external approvals cannot be created by code. Until present, the app will be complete in sandbox/demo mode and will explicitly prevent real-money execution.