# Flights (flights)

## Secrets
- Duffel (preferred): `DUFFEL_API_KEY`
- Amadeus: `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET`
- Kiwi Tequila: `KIWI_API_KEY`

## Auth
- Duffel: `Authorization: Bearer <key>`, `Duffel-Version: v2`
- Amadeus: OAuth client_credentials → `https://api.amadeus.com/v1/security/oauth2/token`
- Kiwi: `apikey: <KIWI_API_KEY>` header

## Endpoints

### Duffel (recommended for booking)
- `POST /air/offer_requests` — `{ slices, passengers, cabin_class }` → offer_request id
- `GET /air/offers?offer_request_id=...&sort=total_amount` → priced offers
- `POST /air/orders` — `{ selected_offers: [id], passengers, payments }` → ticket

### Amadeus (broad search)
- `GET /v2/shopping/flight-offers?originLocationCode&destinationLocationCode&departureDate&adults&travelClass=BUSINESS`

### Kiwi (cheap fares, fallback)
- `GET /v2/search?fly_from&fly_to&date_from&date_to&selected_cabins=C`

## Premium defaults
Per Booking Logic memory: default `cabin_class=business` for flights ≥4h,
`first` for ≥10h.

## Demo→Live diff (travel-planner/index.ts)
```ts
const offers = await callProvider({
  integrationKey: "flights",
  providerId: "duffel",
  demo: () => DEMO_OFFERS,
  live: async ({ secrets, fetch }) => {
    const req = await fetch("https://api.duffel.com/air/offer_requests", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secrets.DUFFEL_API_KEY}`,
        "Duffel-Version": "v2",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: requestBody }),
    });
    return (await req.json()).data;
  },
});
```

## Tests
- Sandbox Duffel key returns deterministic offers.
- Snapshot test the schema mapper (Duffel offer → SuperNomad TripPlan slice).

## Activation prompt (paste to AI)
> Activate flight search. Wire `supabase/functions/travel-planner/index.ts` with `callProvider({ integrationKey: "flights", providerId: "duffel" })`. Default `cabin_class` per Booking Logic memory. Surface Concierge destination insights (5-6 lines) under each result. Keep demo seed.
