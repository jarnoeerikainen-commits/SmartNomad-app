# IP Geolocation (ip-geo)

## Secrets
- ipinfo (optional): `IPINFO_TOKEN`
- ipapi: no key (rate-limited)

## Endpoints
- `GET https://ipapi.co/{ip}/json/`
- `GET https://ipinfo.io/{ip}?token=${IPINFO_TOKEN}`

## Already wired
`supabase/functions/location-ip/index.ts` + `src/services/locationProviders.ts`.

## VPN detection
ipinfo returns `privacy: { vpn, proxy, tor, hosting }` (paid tier).

## Activation prompt
> Already live with ipapi. Upgrade by adding `IPINFO_TOKEN` for higher quota + VPN detection.
