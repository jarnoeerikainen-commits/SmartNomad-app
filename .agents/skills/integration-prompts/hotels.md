# Hotels (hotels)

## Secrets
- Amadeus Hotel: `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET`
- Booking.com Affiliate: `BOOKING_AFFILIATE_ID` (deeplinks only)
- Hotelbeds: `HOTELBEDS_API_KEY`, `HOTELBEDS_SECRET`

## Auth
- Amadeus: same OAuth as flights, shared token.
- Hotelbeds: `Api-key` + `X-Signature` (SHA-256 of key+secret+unix-timestamp).

## Endpoints
- Amadeus: `GET /v3/shopping/hotel-offers?cityCode&checkInDate&checkOutDate&adults&ratings=5`
- Hotelbeds: `POST https://api.test.hotelbeds.com/hotel-api/1.0/hotels` body `{ stay, occupancies, destination, filter: { minCategory: 5 } }`

## Premium defaults
Per memory: prefer 5★, suites, balcony or sea-view, late check-out 4pm.

## Demo→Live diff
```ts
await callProvider({
  integrationKey: "hotels",
  providerId: "amadeus-hotel",
  demo: () => DEMO_HOTELS,
  live: async ({ secrets, fetch }) => { /* OAuth then GET offers */ },
});
```

## Activation prompt
> Activate hotel search via Amadeus. Default ratings=5, view filters from memory. Use `callProvider({ integrationKey: "hotels" })`.
