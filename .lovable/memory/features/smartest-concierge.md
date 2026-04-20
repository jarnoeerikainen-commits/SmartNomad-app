---
name: Smartest Concierge — Auto Model Routing + Truth Protocol + Human Escalation
description: Self-upgrading model selection, anti-hallucination prompt, and one-tap human-support handoff when AI confidence < 90%
type: feature
---

## Components
- `supabase/functions/_shared/modelRouter.ts` — `MODEL_REGISTRY` (intelligence/balanced/speed/vision). Update one constant when smarter models ship; every edge function upgrades. `pickModelForMessages()` heuristically routes by query (tax/legal/medical → intelligence + medium reasoning; planning → balanced + low; chat → balanced).
- `supabase/functions/_shared/antiHallucination.ts` — `withTruthProtocol(systemPrompt)` injects: verified-sources-only, no inventing prices/laws/contacts, cite sources for high-stakes claims, hedge when unsure, end with `[ESCALATE: reason]` when <90% confident.
- `src/utils/conciergeEscalation.ts` — `parseEscalation(content)` extracts the `[ESCALATE: ...]` marker.
- `src/components/concierge/HumanSupportEscalation.tsx` — warning-toned card that opens Help & Support via `supernomad:open-support` window event.
- `src/components/AppLayout.tsx` — listens for `supernomad:open-support` and routes to `'help'` section.

## Wired into
- `travel-assistant` (concierge chat + voice) — uses `pickModelForMessages` for dynamic routing.
- `legal-chat`, `medical-chat`, `travel-planner` — use `getModel('intelligence')` + `withTruthProtocol`.
- `AITravelAssistant.tsx` — parses escalation marker, attaches to last message bubble, renders `<HumanSupportEscalation>`.

## Upgrade path
When new models ship on the Lovable AI gateway: edit `MODEL_REGISTRY` in `modelRouter.ts`. No other code changes needed.
