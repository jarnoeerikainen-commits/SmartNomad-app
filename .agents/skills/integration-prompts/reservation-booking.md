# Tock / Resy / OpenTable / SevenRooms (reservation-booking)

## Secrets (per provider)
- Tock: `TOCK_API_KEY`
- Resy: `RESY_API_KEY`
- OpenTable: `OPENTABLE_API_KEY`, `OPENTABLE_RID`
- SevenRooms: `SEVENROOMS_API_KEY`

## Auth
All four use bearer or API-key header. SevenRooms additionally requires
HMAC signing of the request body — see their partner portal.

## Endpoints (unified call shape)
Every restaurant record in `FineDiningRestaurant.booking[]` already has:
```ts
{ provider: "tock"|"resy"|"opentable"|"sevenrooms", url, restaurantId, deepLink? }
```

Concierge resolves the provider per restaurant, then calls:

| Provider | Quote endpoint | Confirm endpoint |
|----------|----------------|------------------|
| Tock | `GET /v3/businesses/{id}/availability` | `POST /v3/reservations` |
| Resy | `GET /4/find` | `POST /3/book` |
| OpenTable | `GET /partner/v2/restaurants/{rid}/availability` | `POST /partner/v2/reservations` |
| SevenRooms | `GET /api_yoa/availability/widget/range` | `POST /api_yoa/booking/reservation` |

## Demo→Live diff
Use `callProvider({ integrationKey: "reservation-booking", providerId })`
inside `concierge-actions/handleReservation()`. Demo branch already exists.

## Tests
- Curl each provider's sandbox availability endpoint.
- Unit-test the schema translator that maps generic request → provider body.

## Activation prompt (paste to AI)
> Activate restaurant reservations. Implement provider-specific `live` branches inside `supabase/functions/concierge-actions/index.ts handleReservation()` using `callProvider({ integrationKey: "reservation-booking", providerId: payload.provider })`. Map our generic `{ restaurantName, date, time, guests }` to each provider's schema. Add Danger Gate check (memory) before any booking confirmation.
