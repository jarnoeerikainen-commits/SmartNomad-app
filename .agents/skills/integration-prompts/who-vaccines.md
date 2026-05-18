# WHO Vaccines (who-vaccines)

## No secret
Sources are public:
- WHO ITH country pages
- CDC traveler health pages

## Pattern
Currently demo. Activation = scrape via `source-monitor` edge function, write
to `vaccination_requirements` table keyed by `(country_iso, citizenship_iso?)`.

## Activation prompt
> Wire WHO + CDC into `source-monitor`. Schema: `{ country, required: string[], recommended: string[], malaria_risk, yellow_fever_cert_required }`. Refresh monthly.
