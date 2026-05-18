# School Holidays (school-holidays)

## Secret
- `LOVABLE_API_KEY` (uses AI Gateway research)

## Already live
`supabase/functions/school-holidays-refresh/index.ts` — weekly cron.

## Cache
Per memory: ~190 countries × 4 seasons, silent unless user dates affected.

## Activation prompt
> Already live. To extend: add a per-region override in `school_holidays_cache` table for states/provinces with separate calendars.
