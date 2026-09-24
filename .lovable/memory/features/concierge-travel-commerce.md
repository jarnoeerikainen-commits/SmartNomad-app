---
name: Concierge Travel Commerce Rules
description: SuperNomad domain, USD pricing, return-trip handling, business-class defaults, valid links, and simulated payment requirements
type: feature
---

- Use only `supernomad.app` for SuperNomad website references; never use `supernomad.ai`.
- Display all user-facing flight, hotel, ride, transfer, ancillary, and service prices in USD.
- Flight searches default to business class unless the user explicitly requests another cabin.
- Preserve trip shape exactly: a return request must show and price both outbound and return legs; a one-way request must show only the outbound leg.
- Search links must use supported, query-filled provider patterns and must never be invented by the model.
- Demo payment must look operational while remaining prominently and repeatedly labeled simulated, with no ticket, reservation, card charge, token transfer, or real funds movement.
- The Home Next Trip dossier must retain the complete approved travel record, including flight or hotel itinerary, both flight legs when applicable, selected extras, payment simulation, and connected transfer records.