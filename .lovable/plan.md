# Clean Home and approved demo bookings

## Outcome
- Home shows only three panels: **Next Trip**, **Tax Days**, and **Threats Near You**.
- Remove the greeting, date, attention banner, command buttons, old trip carousel, access prompt, pinned widgets, upgrade promotion, and other Home extras.
- **Next Trip** starts empty and is populated only after the user explicitly approves a simulated flight or hotel booking.

## Implementation
1. Simplify the Home composition to one compact three-panel view.
2. Add a versioned, demo-only booking store containing the completed structured booking record, never raw identity or payment data.
3. Save approved simulated flight and hotel records after completion and notify Home immediately.
4. Make **Next Trip** show the nearest saved demo flight or hotel; clicking it opens every stored booking detail in a clear dossier.
5. Remove all fallback seeded trips from Home so historical Lisbon, Barcelona, Dubai, Chamonix, and Bali cards never appear.
6. Keep Tax Days and Threats Near You behavior unchanged.

## Technical details
- Browser persistence stores only the already-masked simulated order, payment status, selected extras, and explicit demo provenance.
- A custom event updates Home without reload; storage events support other tabs.
- The empty state links to Concierge travel planning, while completed records remain clearly labeled **SIMULATED / NO REAL BOOKING**.

## Verification
- Add focused tests for storage validation, ordering, malformed records, and clearing.
- Test approved demo flight and hotel records, Home opening, full dossier display, reload persistence, and empty state.
- Check desktop and mobile layouts, console/runtime errors, lint, and final build health.
