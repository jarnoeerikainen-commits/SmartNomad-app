# Maps & Places (maps-places)

## Secrets (pick one)
- Mapbox: `MAPBOX_TOKEN`
- Google Places (New): `GOOGLE_PLACES_API_KEY`
- Foursquare: `FSQ_API_KEY`

## Endpoints
- Mapbox geocoding: `GET https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?access_token=...`
- Google Places New: `POST https://places.googleapis.com/v1/places:searchText` with header `X-Goog-Api-Key`
- Foursquare: `GET https://api.foursquare.com/v3/places/search?ll=&query=` with `Authorization: ${FSQ_API_KEY}`

## Activation prompt
> Activate Mapbox first (cheapest, generous free tier). Use in `BusinessCentersService.ts`, `venue-discovery`, pet/embassy directories. Wrap with `callProvider({ integrationKey: "maps-places" })`.
