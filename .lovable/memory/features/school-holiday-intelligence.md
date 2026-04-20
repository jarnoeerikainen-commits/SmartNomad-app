---
name: School Holiday Intelligence — Global Weekly Refresh
description: Per-country school holiday cache (~190 countries × 4 seasons × current+next year) auto-refreshed weekly; Concierge silently consults and only surfaces when user's dates are affected
type: feature
---

## Components
- `supabase/functions/school-holidays-refresh/index.ts` — Weekly refresher. Batches ~190 countries into 8 regional groups, calls Gemini 2.5 Pro with strict tool-calling output, validates dates + impact enums, merges into single pack, writes to `ai_cache` under `school_holidays:v1:weekly` (7-day TTL).
- `supabase/functions/_shared/schoolHolidays.ts` — Shared helper: `getSchoolHolidayPack()`, `findRelevantHolidays()` (filters by date overlap + destination + 8 high-impact outbound markets DE/GB/FR/US/CN/JP/AE/AU), `renderRelevantHolidaysForPrompt()` (silent if no overlap), `renderGlobalAwarenessForPrompt()` (currently-active peak windows). Curated baseline fallback for 8 top markets.

## Wired into
- `travel-planner` — When destination + month are present, computes month range, finds overlaps for destination + 8 high-impact markets, injects into system prompt.
- `travel-assistant` — If `userContext.travelStart/End + destinationCountryCode` present → uses relevant overlap. Otherwise falls back to global peak-awareness so AI knows context but stays silent.

## Concierge Protocol (enforced in prompt)
- **SILENT BY DEFAULT.** Only mention holidays when impact ≥ medium AND it materially affects this user (price, crowds, closures, business meeting risk).
- One short heads-up + one concrete action (shift dates ±1 week, midweek flight, lounge access).
- Never list every overlap, never lecture.
- Business travelers → meeting availability, lounge crowding, hotel pricing.
- Families → frame positively (school-friendly window).

## Schedule
- pg_cron: `weekly-school-holidays-refresh` runs Mondays 04:30 UTC (30 min after trend pack).
- Manual trigger: `POST /functions/v1/school-holidays-refresh?force=1` (or `?region=Asia%20Pacific` for single batch).

## Data quality rules
- AI generates from verified sources (kmk.org, gov.uk, education.gouv.fr, ministry sites, school-holidays-europe.eu).
- Validation: `startDate`/`endDate` must match `YYYY-MM-DD`, `season` must be `winter|spring|summer|autumn`, `priceImpact` must be `low|medium|high|extreme`.
- Empty windows → country skipped (rather than guess).

## priceImpact rubric
- **extreme** = drives global flight/hotel surge (DE Sommerferien, US Thanksgiving, CN Chunyun, FR August)
- **high** = strong domestic + regional surge
- **medium** = moderate domestic surge
- **low** = minor / regional only
