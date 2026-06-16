# World-Class Redesign & Smarter Back Office

Scope: elevate SuperNomad's consumer surfaces and back office to "best-in-the-world" standard, benchmarked against the apps you compete with — **Revolut, Amex Centurion app, Linear, Vercel dashboard, Stripe Dashboard, Superhuman, Arc, Raycast, Notion, Nomad List, Wise Business**.

---

## Part 0 — Hermes clarification (1 min, before we code)

"Hermes" can mean three different things — they're not interchangeable:

1. **Hermes (Meta's JS engine)** — only runs inside React Native. SuperNomad is **React 18 + Vite + Capacitor**, so Hermes does **not** apply. Capacitor uses the device WebView (JavaScriptCore on iOS, V8 on Android), not Hermes.
2. **Hermès (luxury maison)** — brand/affiliate partnership. Possible via the existing Affiliate router, not a tech integration.
3. **Hermes API (parcel courier)** — shipping rates for the relocation/moving module. Possible as a connector.

**Default assumption: #1 (engine).** Answer: no, and we don't need it — Capacitor + a tuned WebView gives us native shell + 60fps already. If you meant #2 or #3, say which and I'll wire it.

---

## Part 1 — Consumer app: what "world-class" actually changes

Benchmarks and the specific move we'll steal from each:

| Source | Move we adopt |
|---|---|
| Linear | Cmd-K everywhere, instant route switch, keyboard-first |
| Superhuman | Single-key shortcuts, "done" feel, zero loading spinners (skeletons only) |
| Stripe Dashboard | Calm density, monospaced numerics, status pills with verbs not nouns |
| Revolut | Hero balance/identity card, swipeable stories of "what's new for you" |
| Amex Centurion | Concierge as the **primary** action, not a tab. Editorial typography. |
| Arc / Raycast | Command bar that *does* things, not just searches |
| Vercel | Empty states that teach, not apologize |
| Nomad List | Dense data grid done elegantly (city scores) |

### 1A. Global polish (applies app-wide)
- **Motion contract**: 180ms ease-out for enter, 120ms ease-in for exit, spring only on hero. Kill any animation >300ms unless it's the Guardian heartbeat.
- **Numerics**: all money / counts / dates use `font-feature-settings: "tnum"`. Eliminates jitter.
- **Skeletons over spinners**: replace every `<Loader2 className="animate-spin">` with content-shaped skeletons.
- **Empty states**: every empty list gets a 1-line headline + 1 CTA + 1 illustration token. No "No data" strings.
- **Focus ring**: unified `--ring` token, visible on keyboard, invisible on mouse (`:focus-visible`).
- **Touch targets**: min 44×44 everywhere (audit BottomNav, chip rows, FAB cluster).
- **Safe-area**: `env(safe-area-inset-*)` everywhere, not just BottomNav.
- **Reduced motion**: honor `prefers-reduced-motion` globally (one hook, not per-component).

### 1B. Home / Morning Briefing — final layer
- Hero "Today" card uses **editorial type**: Playfair display number for the date, gold hairline rule, single primary status verb.
- "Now / Next" gets a **timeline rail** (Linear-style) instead of stacked cards on desktop ≥1024px.
- **Command bar (Cmd-K)**: open from anywhere, routes + concierge prefill + recent trips + jump-to-document.
- **"Since last opened" delta** — already built — moves above fold with a single dismiss affordance.
- Persona quick-switch becomes a **segmented control** in the hero, not a separate row.

### 1C. Concierge surface
- Single avatar, **chat takes 100% of viewport** when invoked from Cmd-K, dims to side-panel on result.
- Voice button is a **single physical state** (idle / listening / thinking / speaking) with a colored ring, not 4 different icons.
- Streaming chunks land with a 60ms fade — no typewriter sound, no jitter.

### 1D. Trip detail (the page you just unblocked)
- Tabs become **segmented control with badge counts** (Threat 2, Visa 0, Health 1, Flights, Stays).
- Each tab opens with a **2-line summary at the top** ("Greece is green. ETIAS in effect. Your insurance covers it.") — generated, not stubbed.
- Sticky action bar at bottom: "Ask Concierge about this trip" + "Share with co-traveller".

### 1E. Mobile-specific
- **Bottom nav**: 5 items max, labels always on (Apple HIG), active item gets a 2px gold underline not a fill.
- **Pull-to-refresh** on Home → re-runs Morning Briefing.
- **Long-press a trip** → quick actions sheet (Edit dates, Add doc, Share, Delete).
- **Haptics** via Capacitor on primary actions (book, confirm, danger-gate accept).

---

## Part 2 — Back Office: smarter, not just prettier

Today the admin pages exist (`AdminOverview`, `AdminUsers`, `AdminAI`, `AdminAffiliates`, `AdminAudit`, `AdminData`, `AdminExpenses`, `AdminTickets`, `AdminAgentLive`). They look like a CRUD grid. Best-in-class admin = **Stripe + Linear + Vercel**: every screen answers "what should I do next?".

### 2A. New top-level: **Operator Cockpit** (`/admin`)
Replaces the current overview with a 3-column war-room:
- **Left — Pulse**: live signals (concierge sessions/min, error rate, voice success %, payment success %), each as a sparkline with a tone color.
- **Center — Actions queue**: AI-prioritised list of things a human should look at *right now* (failed payments, flagged tickets, low-confidence concierge replies, source-of-truth drift). Each row has a one-click resolve / escalate / snooze.
- **Right — Brain**: today's AI CEO digest (already wired via `admin-ai-ceo`) + "ask the back office" prompt.

### 2B. Smarter signals (uses existing edge functions)
- `AdminLiveSignalsService` → add anomaly band: anything outside ±2σ of 7-day baseline turns amber.
- `admin-daily-briefing` → render output in the cockpit's Brain pane (it currently isn't surfaced visually).
- New tiny edge function `admin-next-actions` aggregates: failed `agentic-payments-router` rows, low-rated `concierge-evaluator` rows, stale `source-monitor` rows → returns a ranked queue.

### 2C. Users page upgrade
- Cohort filters as **saved views** (Linear-style).
- Each user row → hover card with last session, persona, trust score, last concierge query.
- Bulk actions: grant trial, force re-onboard, send concierge nudge.

### 2D. AI Ops page upgrade
- Replace the long list with a **funnel**: Intents → Resolutions → Satisfaction → Escalations, with click-through to traces.
- Live tail of concierge replies (already partly built in `AdminAgentLive`) gets a "low-confidence only" toggle and a "label good / bad" inline for RLHF.

### 2E. Design system for admin
- Admin gets its own tighter type scale (`text-[13px]` base), monospaced numerics, denser table rows (40px), Stripe-style status pills, slate-on-near-black dark mode default.
- Sidebar collapses to icon strip (already shadcn-supported).
- Cmd-K shared with consumer app but with admin verbs ("ban user", "refund", "rerun concierge eval").

---

## Part 3 — Build order (so we can ship & verify in passes)

**Pass 1 — Foundations (no visual regressions, enables the rest)**
1. Global motion + numerics + focus ring tokens in `src/index.css`.
2. `useReducedMotion` + `useHotkeys` shared hooks.
3. Skeleton primitives + standard EmptyState component.
4. Audit & fix touch targets / safe-area in `BottomNav`, FAB cluster, chip rows.

**Pass 2 — Consumer polish**
5. Cmd-K palette wired to routes + concierge prefill (reuses `HomeCommandBar` event bus).
6. Morning Briefing hero editorial pass.
7. Trip detail tabs → segmented + 2-line AI summary header.
8. Voice button single-state ring.

**Pass 3 — Back office cockpit**
9. New `/admin` overview layout (Pulse / Actions / Brain).
10. `admin-next-actions` edge function + `AdminNextActionsService`.
11. Surface `admin-daily-briefing` output in Brain pane.
12. Users page hover card + saved views.
13. AI Ops funnel view.
14. Admin Cmd-K.

**Pass 4 — Mobile native niceties**
15. Pull-to-refresh on Home.
16. Long-press quick actions on trip cards.
17. Capacitor haptics on primary actions.

**Pass 5 — Test & fix loop (every pass ends here)**
- `bunx vitest run` on touched suites.
- `browser--view_preview` at 390×844 (iPhone), 834×1194 (iPad), 1440×900 (desktop) — visual diff key screens.
- Voice flow smoke: Cmd-K → "plan a trip to Lisbon next month" → confirm prefill lands in Concierge with TTS.
- Admin smoke: load `/admin`, confirm Pulse + Actions + Brain populate, click-through one Action.

---

## Part 4 — Out of scope for this run (call out so it's not silently dropped)
- New backend tables (we reuse existing schema).
- Hermès brand affiliate or Hermes courier API (need your confirmation).
- Renaming routes or changing nav information architecture beyond the cockpit.
- Marketing site / `/landing` changes.

---

## Technical notes (for the record)
- All new colors via existing semantic tokens in `index.css`; no hardcoded hex.
- Cmd-K built on `cmdk` (already shadcn-compatible) — no new heavy dep.
- Anomaly bands done client-side from existing signals; no new DB columns.
- Admin Cmd-K gated by `useStaffRole` (already present).
- Numerics use Tailwind arbitrary `font-variant-numeric: tabular-nums` utility — one class, app-wide.

---

**Confirm and I'll start with Pass 1 immediately, then ship Passes 2→4 with a test gate between each. Also tell me which "Hermes" you meant if it wasn't the JS engine.**