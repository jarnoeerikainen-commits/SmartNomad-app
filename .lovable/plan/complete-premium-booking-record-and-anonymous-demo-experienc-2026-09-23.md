# Complete premium booking record and anonymous demo experience

## Outcome
Turn every demo flight or hotel completion into a full, auditable travel record with all selected services and costs. After completion, Concierge asks whether airport transport is arranged in both directions and offers the existing ride flow without claiming an Uber booking exists.

Remove Meghan and John as selectable test personas and from the named home experience. The home remains anonymous. John remains only as the masked Finnish demo traveller shown in **You** and used when a demo trip is planned or booked.

## Booking details and truthful pricing
- Expand demo offers into deterministic, supplier-shaped records rather than generic totals.
- Flights will show route legs, airports, local dates/times, cabin, fare brand, aircraft/operating carrier placeholders, duration, connection details, seat position, included cabin/checked baggage, selected extra bags, and fare/change/cancellation rules.
- Hotels will show property, stay dates, nights, room and bed type, occupancy, meal plan, taxes/mandatory fees, deposit/payment timing, check-in/out, cancellation deadline, and selected extras.
- Display an upfront itemized total: base fare/rate, mandatory taxes and fees, selected seats, extra luggage, and other opted-in extras. Optional items remain unselected by default and immediately update the total.
- Label every fixture, price, seat, payment, supplier reference, and ride suggestion as **Demo / simulated**. Demo funds will be “Demo credits” with no real monetary value; no real currency balance or completed charge will be implied.
- Live mode will accept only supplier-returned inventory, seat maps, ancillary prices, rules, and references. Unsupported details will say “Not supplied” rather than being invented.

## Completion record
- Replace the one-line success notice with a structured booking confirmation containing status, demo reference, supplier, traveller readiness, full itinerary/stay, selected seat and baggage/room extras, payment rail, itemized costs, rules, approval evidence, reconciliation status, and clear statements that no ticket, room, ride, or payment was created.
- Preserve the rule that a real booking may be called confirmed only after a supplier reference and successful reconciliation exist.
- Keep passport, phone, address, card data, and wallet secrets out of chat, speech, logs, source, and ordinary records. Only masked document status appears.

## Airport transport follow-up
- After each completed flight or hotel demo, show a two-direction transport check:
  - Home/hotel → departure airport.
  - Arrival airport → hotel/home.
- Each direction can be marked arranged, not needed, or “Find a ride.”
- “Find a ride” opens the existing Uber/Karhoo-compatible quote flow with the known airport, destination, date, passenger count, and baggage count prefilled; the user still reviews and approves any ride separately.
- Concierge voice and chat use the same state and ask one concise follow-up with action chips. Sensitive traveller data is never spoken.

## Demo identity cleanup
- Remove Meghan and John selector buttons, quick-switch controls, named test-person prompts, and any named-person home state.
- Make neutral home data generic and non-personal.
- Keep one internal demo-traveller profile for planning and booking: John, Finnish citizenship, Tampere, with passport/contact/address masked or marked securely unavailable.
- Show that traveller only inside **You**, trip planning, review, and booking records—not as a selectable persona or named home identity.
- Remove or safely adapt features that depended on two personas, including demo person-to-person calling, so no broken entry point remains.
- Preserve backup/restore behavior so demo data never overwrites a signed-in user’s real profile.

## Verification
- Add unit tests for deterministic offer details, all-in totals, optional ancillary selection, seat/luggage pricing, hotel fees, masking, expiry, and reconciliation.
- Add interaction tests for review, completion, both transport directions, and ride-prefill actions.
- Test Concierge typed and spoken completion flows; confirm the final reply has 1–3 action chips and does not read sensitive data aloud.
- Verify generic, mobile, and desktop home/profile/booking views; confirm no Meghan/John test selector or named home appears.
- Run the repository tests, focused edge-function tests, lint, and preview diagnostics; fix failures and repeat.

## Technical details
- Extend the shared travel-commerce contract once and reuse it in the edge function, frontend service, booking card, confirmation, and tests.
- Keep current demo-only fail-closed behavior. Authorized Duffel/Duffel Stays and live ride data can replace the same contract later without changing the customer flow.
- No database schema change is required for the demo presentation unless the existing booking record cannot retain the structured selection; any necessary schema change will preserve owner-scoped RLS and explicit grants.
