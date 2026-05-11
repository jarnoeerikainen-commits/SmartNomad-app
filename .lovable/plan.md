# Plan: Ship Priorities 3, 4, 5, 6

Implementing the four next priority moves from the UX audit, then code-test + app-test each.

## 3. Modes — Preset Packs (Business / Nomad / Family / Sport / Sabbatical)

**What it is:** A single switcher at the top of Home that reconfigures the dashboard surface (which cards/features are visible + pinned + ordered) for the user's current life mode. Persists per-user via existing `useFeaturePreferences` + new `useUserMode` hook.

**Build:**
- `src/hooks/useUserMode.ts` — reads/writes `supernomad_user_mode` (localStorage) with 5 modes + default `nomad`. Exposes `mode`, `setMode(mode)`, `preset` (which feature ids to show/pin per mode).
- `src/data/modePresets.ts` — declarative map: `{ business: { pinned: [...], visible: [...], hero: 'cockpit' }, ... }` using existing feature registry ids (verified via `src/data/featureRegistry.ts`).
- `src/components/dashboard/ModeSwitcher.tsx` — pill-row switcher (5 modes, icons, gold active state, Playfair label). Mobile-friendly (horizontal scroll).
- Wire into `HomeSection.tsx` at top, above ThreatDashboard. Switching mode calls `setBulkVisibility` on `useFeaturePreferences` + sets pinned features.

## 4. Active Trip Cockpit

**What it is:** A cinematic hero card that appears ONLY when an active trip is detected (today's date inside any country in `countries[]` with future end-date or current location). Replaces the welcome hero while active. Shows: destination + country flag, day X of Y, next event/flight, weather, threat level, FX rate, days-until-tax-trigger, single primary CTA "Open Trip".

**Build:**
- `src/hooks/useActiveTrip.ts` — derives active trip from `countries[]` (entry without exit, or current city). Returns `{ trip, isActive }`.
- `src/components/dashboard/ActiveTripCockpit.tsx` — full-bleed gold/black gradient card, Playfair display numbers, 4-stat strip (Day, Weather, Threat, FX), uses existing `ThreatIntelligenceService` + `useLanguage`.
- Render in `HomeSection` between SuperNomadCallCard and Welcome; hides Welcome block when active.

## 5. Threat Ticker Promotion

**What it is:** Promote threat intelligence from a card to a slim, persistent Bloomberg-style ticker bar that scrolls top-of-page (above ThreatDashboard fold). Calm by default (single dot + city + status); expands to full ThreatDashboard on click.

**Build:**
- `src/components/ThreatIntelligence/ThreatTicker.tsx` — slim 36px bar, marquee of top 3 active incidents (severity dot + title + city + time-ago). Uses existing `ThreatIntelligenceService.getStats()` and incidents. CSS keyframe scroll, pause on hover. If zero incidents → green "All clear · {city}".
- Insert at top of `HomeSection` (above all). ThreatDashboard card becomes collapsible/secondary.

## 6. Pricing Restructure — Add Sovereign €29 tier

**What it is:** Insert third tier between Premium and B2B. Sovereign (€29/mo) = unlimited AI, dedicated concierge persona, family vault (4 seats), priority Trust Pass, white-glove visa/tax review, empty-leg alerts.

**Build:**
- `src/components/PricingCard.tsx` — add `sovereign` PricingTier; render selected tier; switch icon (Gem).
- `src/types/subscription.ts` — extend `tier: 'free' | 'premium' | 'sovereign'`.
- Audit any tier-gate checks: `rg "tier === 'premium'"` and `rg "subscription.tier"` to ensure sovereign inherits premium privileges (treat as superset).
- Update `mem://product/subscription-model` after.

## Test Plan

**Code tests (vitest):**
- `useUserMode.test.ts` — default, set, persist, unknown mode fallback.
- `useActiveTrip.test.ts` — no countries → inactive; entered country no exit → active; past trip → inactive.
- `PricingCard.test.tsx` — renders 3 tiers, sovereign shows €29 + features.

**App test (browser tool):**
- Navigate to `/`. Verify ticker visible, mode switcher visible.
- Click each mode → Home reconfigures (different cards visible).
- Verify pricing shows 3 tiers in settings/upgrade flow.
- Trigger active trip via demo persona; cockpit appears; welcome hides.
- Console + network: no errors.

**Bug-fix loop:** If any failure, read errors, fix, re-test until clean.

## Out of scope
- No backend/migration changes (sovereign tier is UI-only for now; real Stripe sku later).
- No copy translation (English first; i18n keys added but English fallback).
- Voice control wiring to mode switcher: add basic voice intents only (`"switch to business mode"`).

Approve to proceed.
