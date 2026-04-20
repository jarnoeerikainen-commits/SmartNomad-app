---
name: Respect Protocol & Cultural Profile
description: Shared respect/cultural rules for all AI features — drives tone, dietary, alcohol, cigar, and destination-aware adaptation across chat + voice in all 13 languages
type: feature
---

## Cultural Profile (`src/types/userProfile.ts` → `CulturalProfile`)
Stored under `profile.cultural`: countryOfBirth, continentOfBirth, religion, religiousObservance, vice (alcohol + cigars + favorites), respectMode (autoAdaptToDestination, politeTone, avoidTopics).

## Shared module
- `src/utils/respectProtocol.ts` (frontend mirror)
- `supabase/functions/_shared/respectProtocol.ts` (edge functions)
- `buildRespectProtocol(cultural, destination)` returns a system-prompt block.

## Wired into edge functions
- `travel-assistant` — concierge (chat + voice)
- `travel-planner` — full plans
- `legal-chat`, `medical-chat` — advisors
- All read `userContext.cultural` (passed from `AITravelAssistant.tsx` via `enhancedProfile.cultural`).

## Rules
- **Tobacco / cigarettes: NEVER mentioned**, regardless of profile.
- **Cigars**: opt-in only. If user enjoys → AI suggests cigar lounges, tobacconists, cigar-friendly venues + brands.
- **Alcohol**: profile-driven both ways. `never`/`forbidden` → silent unless user asks. `love`/`enjoy` → engages openly with pairings, champagne, rooftops.
- **Cultural background**: silent context — never raised by AI unless user does.
- **Destination-aware**: auto-warns about conservative regions (KSA, UAE, Iran, etc.) and alcohol-restricted countries — only when user's request intersects.
- **Polite tone always on**: respect, manners, helping others — chat + voice in all 13 languages.

## UI
- New "Cultural" tab in `ComprehensiveUserProfile` (between Personal and Health).
- Includes background fields, lifestyle preferences (alcohol/cigars with conditional favorites), and Respect Mode toggles.
