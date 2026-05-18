# eSIM (esim)

## Secrets
- Airalo: `AIRALO_CLIENT_ID`, `AIRALO_CLIENT_SECRET` (OAuth2)
- GigSky: `GIGSKY_API_KEY`

## Airalo
- Token: `POST https://partners-api.airalo.com/v2/token` → bearer.
- `GET /v2/packages?filter[country]=US&filter[type]=local`
- `POST /v2/orders` → returns `iccid`, `qr_code_url`.

## Activation prompt
> Activate Airalo. Use `callProvider({ integrationKey: "esim", providerId: "airalo" })`. Cache packages per country 24h. Surface QR in user's wallet.
