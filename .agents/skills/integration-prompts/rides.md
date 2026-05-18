# Karhoo Rides (rides)

## Secrets
- `KARHOO_API_KEY`
- `KARHOO_SECRET`

## Auth
OAuth2 client_credentials at `POST https://rest.karhoo.com/v2/auth/token`
returning `access_token` (TTL 60min). Cache it in memory per cold-start.

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints
- `POST /v2/quotes` — body `{ origin: {latitude, longitude}, destination: {...}, date_scheduled }`
  → `{ quote_id, vehicle_class, price: { high, low, currency } }`
- `POST /v2/bookings` — body `{ quote_id, passenger: { first_name, last_name, email, phone }, meta }`
  → `{ id, status, vehicle, driver, tracking_url }`
- `GET /v2/bookings/{id}` — poll status.

Reference: https://developer.karhoo.com

## Demo→Live diff (karhoo-rides/index.ts)
```ts
import { callProvider } from "../_shared/providerAdapter.ts";

const result = await callProvider({
  integrationKey: "rides",
  providerId: "karhoo",
  demo: () => ({ quotes: DEMO_QUOTES, source: "demo" }),
  live: async ({ secrets, fetch }) => {
    const tokenRes = await fetch("https://rest.karhoo.com/v2/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: secrets.KARHOO_API_KEY,
        client_secret: secrets.KARHOO_SECRET,
      }),
    });
    const { access_token } = await tokenRes.json();
    const r = await fetch("https://rest.karhoo.com/v2/quotes", {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify(quoteRequest),
    });
    return await r.json();
  },
});
```

## Tests
```bash
deno test supabase/functions/karhoo-rides/*test.ts --allow-net --allow-env
```

## Activation prompt (paste to AI)
> Activate the Karhoo rides integration. Read `knowledge://skill/integration-prompts/rides.md`. Wire `supabase/functions/karhoo-rides/index.ts` with `callProvider({ integrationKey: "rides", providerId: "karhoo" })`. Keep demo branch. Flip `INTEGRATIONS.find(i=>i.key==="rides").mode` to `"live"`. Add a CI test that hits `/v2/quotes` with a sandbox key.
