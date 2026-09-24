# Smarter Concierge Travel Commerce

## Goal
Make Concierge reliably understand and present complete trips, while keeping every demo action truthful, safe, and useful.

## Changes
1. **Deterministic trip understanding**
   - Add a tested travel-request parser for dates, origin, destination, passengers, cabin, and one-way versus return intent.
   - Default flights to business class only when the user has not named another cabin.
   - Preserve both legs and their separate schedules in return-trip offers, checkout, saved records, and Home.

2. **USD and evidence controls**
   - Standardize flight, hotel, taxi, transfer, ancillary, and service demo prices to USD.
   - Remove unsupported live-looking airline fares and air-quality claims from model-generated answers unless supplied by a verified source.
   - Require SuperNomad references to use `supernomad.app` and never `supernomad.ai`.

3. **Working travel links**
   - Build provider links in trusted application code instead of accepting arbitrary model-generated URLs.
   - Fill origin, destination, dates, trip type, passenger count, and cabin where the provider supports it.
   - Reject unsupported domains, malformed dates, unsafe protocols, and incomplete booking cards.

4. **Realistic simulated checkout**
   - Expand the visible demo process through quote, review, approval, payment authorization, supplier response, reconciliation, and completion.
   - Keep permanent `SIMULATED`, `NO REAL BOOKING`, and no-funds-moved disclosures.
   - Retain seat position, baggage, fees, payment rail, both flight legs, hotel, and transfer details in the saved trip record.

5. **Complete Next Trip dossier**
   - Group approved demo flight, hotel, and transfer records into the relevant trip.
   - Show outbound and return details, all-in USD totals, selected extras, accommodation, ground transport, masked traveller details, and fulfilment status.

6. **Verification**
   - Add unit tests for return and one-way parsing, business-class defaults, USD-only output, link allowlisting, total calculations, and storage migration.
   - Test the Edge Function, run the focused app suite, inspect current build health, and verify Concierge checkout plus Home details on desktop and mobile.

## Technical details
- Extend the shared travel-commerce contract rather than letting the language model invent offers.
- Version stored demo records so older EUR records fail safely or migrate without being represented as current USD quotes.
- Continue blocking live fulfilment until authorized supplier, tokenized-payment, webhook, reconciliation, and refund-service credentials are certified.