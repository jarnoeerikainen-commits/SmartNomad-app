# Air Charter (air-charter)

## Secrets (any one)
- Paramount: `PARAMOUNT_API_KEY`
- Jettly: `JETTLY_API_KEY`
- Avinode: `AVINODE_CLIENT_ID`, `AVINODE_CLIENT_SECRET` (OAuth2)

## Endpoints
- Avinode is the industry marketplace; query `/marketplace/v1/empty-legs?from&to&date` and `/quotes` for on-demand.
- Paramount/Jettly each expose `/quotes` with similar `{ from, to, pax, date }` payloads.

## Pricing tiers (memory)
Light, Mid, Heavy, Ultra-long. Empty-leg discount up to 75%.

## Activation prompt
> Activate Avinode marketplace. Use `callProvider({ integrationKey: "air-charter" })`. Sort empty legs first; show pricing tier badges per memory.
