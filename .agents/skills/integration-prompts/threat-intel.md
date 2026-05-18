# Threat Intelligence (threat-intel)

## Free feeds (no key)
- GDACS: `GET https://www.gdacs.org/xml/rss.xml`
- US State Dept: `GET https://travel.state.gov/_res/rss/TAsTWs.xml`
- UK FCDO: per-country `https://www.gov.uk/api/content/foreign-travel-advice/<country>`

## Premium
- Crisis24 — `CRISIS24_API_KEY`, real-time geofenced alerts.

## Source-monitor edge function
`supabase/functions/source-monitor/index.ts` already polls verified sources
on a schedule and writes `source_snapshots` + `change_proposals`.

## Activation prompt
> Wire GDACS + FCDO + State Dept into `source-monitor`. For each new alert, INSERT into `threat_intelligence_alerts` with `source`, `severity`, `country`, `coordinates`, `expires_at`. Trigger Guardian heartbeat refresh.
