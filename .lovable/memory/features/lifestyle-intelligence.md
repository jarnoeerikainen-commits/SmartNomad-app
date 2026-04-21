---
name: lifestyle-intelligence
description: Spotify/Oura/Garmin/Strava/WHOOP demo connectors feeding music, sleep, fitness, skills & recovery into Concierge AI via Respect Protocol
type: feature
---

# Lifestyle Intelligence Hub

**Sidebar:** Quick Actions → "Lifestyle Intelligence" (id: `lifestyle-hub`)

**Service:** `src/services/LifestyleConnectorsService.ts`
- Demo-mode: simulated realistic data per provider, stored in `localStorage` (`lifestyleConnectorsStatus`, `lifestyleSnapshot`)
- Production swap: each provider ships OAuth metadata (auth URL, scopes, docs) — replace `getSimulated*` with real `fetch()`
- `getLifestyleContextForAI()` returns a compact system-prompt block (silent context — never expose raw numbers)

**Providers:**
| Provider | Category | Powers |
|---|---|---|
| Spotify | music | Top artists/genres, mood, BPM → concert match, venue vibe, in-flight playlists |
| Oura | sleep | Sleep score, HRV, RHR → jet-lag protocol, flight timing |
| Garmin | fitness + sports | VO2max, golf handicap, tennis UTR, cycling FTP, ski level |
| Strava | fitness | Activities, segments, PRs, route discovery |
| WHOOP | recovery | Recovery, strain, today's readiness |

**AI integration:** AITravelAssistant injects `lifestyle` field into `userContext`; edge functions (travel-assistant, legal-chat, medical-chat, travel-planner) pass it as 3rd arg to `buildRespectProtocol(cultural, destination, lifestyleContext)` which appends the lifestyle block to the system prompt.

**Respect Protocol still applies:** no tobacco; alcohol only if user opts in; cultural/destination awareness intact.

**Use cases unlocked:**
- Skill-matched partners (tennis UTR ±0.5, golf hcp ±3, chess elo ±100, HYROX age-group time ±5%)
- Tournament/league recommendations at user level (incl. triathlon 70.3/Ironman, HYROX Singles/Doubles/Pro/Relay, CrossFit Open, FIDE-rated chess)
- Gear & equipment deals appropriate to skill
- Concert match by Spotify top artists in destination city
- Recovery-aware scheduling (rest day → spa instead of hard workout)
- New product launches matched to sports profile

**Sports recognized end-to-end (vocab, weather profile, profile chips, AI knowledge, match suggestions):** running, cycling, swimming, tennis, padel, golf, surfing, skiing, hiking, climbing, sailing, diving, yoga, football, basketball, **triathlon**, **HYROX**, **CrossFit**, **chess**, plus 80+ more covered by the weekly trend-pack refresh. Indoor sports (HYROX, CrossFit, chess, gym, pilates, boxing, martial-arts, dance) are excluded from outdoor weather penalty logic.
