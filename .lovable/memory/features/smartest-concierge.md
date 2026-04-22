---
name: Smartest Concierge — Closed-Loop Learning System
description: Universal distillation, hybrid context, self-grading evaluator, outcome feedback, auto-escalation
type: feature
---

## Architecture (closed-loop, knows-everything concierge)

### 1. Context aggregation
- `src/utils/conciergeContextBuilder.ts` — bundles profile, family, hobbies, music, sports, news, work, rewards into a verified narrative used as system prompt context.
- `src/services/AIMemoryService.ts` — Hybrid RAG (pgvector + tsvector + confidence + importance + recency) via `search_memories_hybrid`.

### 2. Universal distillation (every surface teaches the brain)
- `src/utils/conciergeLearning.ts` exports `learnFromExchange()` — debounced (every 3 turns) call to `memory-distill` + auto-eval.
- Wired into:
  - `AITravelAssistant.tsx` (concierge — every 4 exchanges via existing distill timer)
  - `AITravelDoctor.tsx` (medical)
  - `LegalAIChat.tsx` (legal)
  - `HelpSupportCenter.tsx` (support, lazy-loaded)
  - `AITravelPlanner.tsx` (travel plans, lazy-loaded)

### 3. Back-office self-grading
- `supabase/functions/concierge-evaluator/index.ts` — uses `gemini-2.5-flash-lite` + tool calling to score factuality / personalization / calibration / overall (0–1).
- `src/utils/conciergeQuality.ts` — `evaluateAnswer()` + rolling history widget.
- Smoke-tested ✅: high-quality answer → overall 1.0, none upgrade. Hallucinated tax answer → overall 0.3, `escalate_human`.

### 4. Outcome feedback loop
- `src/utils/conciergeFeedback.ts` — `recordOutcome()` writes to `audit_log` + bumps matching `ai_memories.importance`.
- Wired triggers:
  - Booking-card click → `kind:'booking_clicked'` (in `BookingCards.tsx`)
  - Low evaluator score → `kind:'response_unhelpful'` (auto, in concierge + universal helper)
  - Escalation marker `[ESCALATE: ...]` → user can tap `HumanSupportEscalation` card
- Auto-escalation: if evaluator returns `upgrade_suggestion === 'escalate_human'` and the model didn't already emit `[ESCALATE:]`, the concierge attaches an escalation card to the message.

### 5. Anti-hallucination
- `supabase/functions/_shared/antiHallucination.ts` — `withTruthProtocol()` enforces verified-sources-only, citations for high-stakes claims, hedging when uncertain, `[ESCALATE: reason]` when <90% confident.

### 6. Model routing
- `supabase/functions/_shared/modelRouter.ts` — `MODEL_REGISTRY` (intelligence/balanced/speed/vision). Update one constant to upgrade every edge function.

## Upgrade paths
- New models ship → edit `MODEL_REGISTRY`.
- Need a new learning surface → add `learnFromExchange({ surface, ... })` after the chat completes.
- Want to track a new positive signal → call `recordPositiveOutcome({ kind, ... })`.
