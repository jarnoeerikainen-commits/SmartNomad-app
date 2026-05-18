# Fine Dining (michelin-50best)

## Already live
`supabase/functions/fine-dining/index.ts` queries the AI Gateway with a strict
source-of-truth hierarchy: Michelin → World's 50 Best → La Liste → Gault & Millau.

## Output schema
Defined in `FineDiningRestaurant` (src/services/FineDiningService.ts).
Includes `booking[]` with provider IDs (tock/resy/opentable/sevenrooms) —
reverse-engineered for the reservation integration.

## Activation prompt
> Already live. To add a city, edit `src/data/fineDiningCities.ts` (set `michelinStarsTotal`, `worlds50BestCount`, `leadTimeWeeks`). The edge function automatically uses it.
