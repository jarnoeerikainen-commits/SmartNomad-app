# SuperNomad Home & Demo Upgrade — Plan

Status: **Phases A, B, C, D shipped.** Phase E QA gates running each pass.
Remaining platform-side: Subagents wiring in Concierge edge fn, Sensitive Data Scan + Wiz, Publish-from-chat.



## 1) What works today
- `MorningBriefing` (Active Trip · Tax Days · Threats) — clear "one-screen" pattern.
- `UpcomingTripsBar` — purpose-coloured cards + Visa/Health/Risk pills + Trip Dossier sheet.
- `ModeSwitcher`, `SovereignAccessNudge`, `SuperNomadCallCard`, Pinned, collapsible extras.
- Source-of-truth chips on legal/tax/visa, Concierge action chips, brand-safe colours.

## 2) Gaps a pro would flag

**Mobile (designer)**
- Header stack on Home is tall: section label + H1 + date + status pill all stack on narrow screens — pushes the 3 briefing cards below the fold.
- Briefing cards `font-display text-2xl` headline often wraps to 2 lines on 360–390px → uneven card heights.
- Quick-action row wraps awkwardly; "Customize home" loses `ml-auto` when wrapped.
- Upcoming trips horizontal scroll has no visual edge-fade or pager dots → users miss that more cards exist.
- Pinned grid jumps from 2→3→4→5 cols; on 360px the 2-col tiles feel cramped (icon + label + badge).

**Travel professional**
- No "Next 72 hours" timeline (flight in 18h → check-in opens → eSIM activates → weather at landing). The morning view is *state*, not *sequence*.
- No "What changed since you last opened the app" delta (visa rule moved, fare dropped, threat upgraded).
- Active-trip card hides when no trip — should show *"Next trip in 6d"* counter instead.
- Tax card shows global 183/year only; nomads need *per-country* worst-offender + Schengen 90/180 inline.
- No weather/airport-status chip for the *active trip city* in the briefing itself.

**Web designer**
- Status pill uses 3 different palettes — good — but the cards repeat the same border-tone, creating a "stripey" look when 2/3 cards are warn/alert. Needs a unified hero status bar instead of 3 tones competing.
- Typography: 10px uppercase + 11px body + 12px CTA — too many micro-sizes; tighten to 2 scales.
- No empty-state illustration for first-run / signed-out demo.

**AI architect**
- Concierge isn't surfaced on Home as a *primary input* — it's a call card. Wealthy users expect a single command line ("Move me to Lisbon for 10 days, business class, hold 24h").
- Briefing doesn't pull from `AIMemoryService` (no "Last time you were in Dubai you booked X — repeat?").
- No proactive nudge engine using the **3-Signal Rule** on Home (we have the framework but it isn't visible).

**Business director**
- Demo user lands on the *same* home as a real user — no guided "what you're seeing" overlay → demo conversion suffers.
- No KPI strip for business mode (YTD travel spend, reclaimable VAT, lounge visits, loyalty points expiring).
- No "Forward to accountant / assistant" one-tap from Home.
- Corporate mode (org `ACMEDEMO`) has no Home indicator — user can't tell which profile is active.

---

## 3) New Lovable platform features to adopt
From the **May/June 2026 changelog**:

| Feature | Use in SuperNomad |
|---|---|
| **Subagents** | Parallelise concierge research (visa + flights + weather + threat) in one turn. |
| **Workspace Skills** | Codify "Plan-Code-Test-Fix-Test", "Source-of-truth chip audit", "Demo-data refresh" as reusable skills. |
| **HeyGen Chat connector** | Already stubbed — wire a real avatar for Concierge Call card. |
| **SEO & AI Search tab + Semrush** | Tune `supernomad1.lovable.app` marketing pages, not the app. |
| **Google Maps Platform connector** | Replace ad-hoc map fallbacks in Threats / Local Life / Transport. |
| **App Connectors** (Notion, Airtable, Brevo, GSC, Mailgun) | "Forward to accountant" via Brevo/Mailgun; trip notes → Notion; corporate exports → Airtable. |
| **Sensitive Data Scanning** | Run across Identity Vault + Family Vault. |
| **Database Health Check + Backup Restore** | Add to admin Ops page. |
| **Static Egress IPs** | Pin for B2B partner allowlists (gateway). |
| **Wiz Security Scanning** | Enable for the brand-safe main repo. |
| **Publish-from-chat** | Use after each green test run. |
| **New AI models** (GPT-Image-2, Gemini 3.5 Flash Lite, new embeddings) | Image-2 for trip cards, Flash-Lite for cheap classifications, new embeddings for hybrid search re-index. |

---

## 4) Proposed changes (Home-first, phased)

### Phase A — Home clarity (mobile + visual)
1. **Unified hero status bar** at top: one large pill ("All clear" / "1 item to review" / "Action required") + date + name. Removes 3-tone fight.
2. **Briefing cards v2**:
   - Fixed min-height, single-line headline with truncation + tooltip.
   - Active-Trip card becomes **"Now / Next"** — if no active trip, shows countdown to next upcoming trip with the same component.
   - Tax card adds inline Schengen 90/180 mini-bar + worst country pill.
   - Threats card adds active-trip-city weather + airport-delay chip.
3. **Concierge command bar** directly under hero: single input "Ask or command…" with mic + 4 chips (Plan, Hold, Forward, Add to calendar). Routes to Concierge with action intent.
4. **Upcoming trips**: add left/right edge fade + dot indicator on mobile; snap to card.
5. Typography: collapse to 2 sizes (eyebrow 10px / body 12px), one display family.

### Phase B — Travel & business value
6. **"Next 72h" timeline** card (collapsed by default): flight, check-in window, eSIM auto-activate, weather at landing, lounge access, ride hold.
7. **"Since you last opened" delta** strip (auto-hides if nothing): rule change · price drop · threat upgrade.
8. **Business mode KPI strip** (only in `business` mode): YTD spend, reclaimable VAT, points expiring <90d, last receipt OCR.
9. **Corporate badge** (when `ACMEDEMO` org active): small chip next to name + "Switch to personal" action.

### Phase C — Demo & onboarding
10. **Demo coach-mark overlay** (one-time per persona): 4 spotlights on hero status, briefing, upcoming trips, concierge bar. Skippable, persisted in local storage.
11. **Demo data parity for default user** (already done for Upcoming Trips) — extend to Active Trip + Tax days so the default demo shows a *currently active* trip, not empty state.
12. **"Try as Meghan / John / Demo" persona switcher** pinned on Home for unauth visitors.

### Phase D — AI & platform
13. Wrap Concierge multi-tool turns in **Subagents** (visa, flights, weather, threat) for ≤1.5s perceived latency.
14. Replace heuristic memory recall on Home with **AIMemoryService.recallForHome()** (new) → produces 1-line "Last time…" hint.
15. Add **Workspace Skill: `home-mobile-audit`** (Lighthouse + viewport screenshots at 360/390/430/768/1280).
16. Wire **HeyGen** to `SuperNomadCallCard` as opt-in avatar mode.
17. Run **Sensitive Data Scan** + **Wiz** before next publish.

### Phase E — QA gates (every phase)
- Visual: preview at 360 / 390 / 430 / 768 / 1280 / 1920.
- Functional: Vitest for `MorningBriefing` thresholds (ok/warn/alert), `UpcomingTripsBar` sort, Concierge command-bar intent routing.
- Voice: ensure new command bar + chips are voice-controllable (VOICE_CONTROL_DEFAULTS update).
- Demo: Meghan, John, Default — each opens to a *populated*, *clear-cut* Home.
- A11y: focus rings, aria-labels on all new chips, contrast on warn/alert tones.
- Then **Publish-from-chat**.

---

## 5) Suggested execution order
1. Phase A (1 pass, ~1 working session)
2. Phase C (low risk, high demo impact)
3. Phase B (medium)
4. Phase D (platform — schedule alongside backend session)
5. Phase E gates after every phase.

## 6) What I'd like you to confirm before coding
- OK to **replace** today's 3-card briefing layout with the unified hero + redesigned cards (Phase A)?
- Add the **Concierge command bar** at the top of Home (Phase A.3)?
- Add a **one-time demo coach-mark** for first-run / persona switches (Phase C.10)?
- Greenlight to wire **HeyGen** + **Subagents** now, or hold for a dedicated AI sprint?

Reply with which phases to ship and any "no" items; I'll then code, test, fix, test.
