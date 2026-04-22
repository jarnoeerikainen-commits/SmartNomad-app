// ═══════════════════════════════════════════════════════════════════════════
// Concierge Learning Hook — one-call wiring for any AI chat surface
// ───────────────────────────────────────────────────────────────────────────
// Every chat in the app (legal, medical, planner, support, voice transcripts)
// can call learnFromExchange() after each user/assistant turn. It will:
//   • Distill durable memories into ai_memories (vector embeddings)
//   • Evaluate the answer for factuality / personalization / calibration
//   • Auto-record an "unhelpful" outcome if the eval is low (closes the loop)
// ═══════════════════════════════════════════════════════════════════════════

import { aiMemoryService } from '@/services/AIMemoryService';
import { evaluateAnswer } from './conciergeQuality';
import { recordOutcome } from './conciergeFeedback';

export interface LearningExchange {
  surface: 'legal' | 'medical' | 'planner' | 'support' | 'voice' | 'concierge';
  question: string;
  answer: string;
  contextSummary?: string;
  conversationId?: string | null;
  category?: string; // e.g. 'legal', 'medical', 'travel'
  topic?: string;    // short topic key for outcome tracking
}

// Track exchanges-per-surface to debounce distillation
const exchangeCounters: Record<string, number> = {};

export async function learnFromExchange(ex: LearningExchange): Promise<void> {
  if (!ex.question || !ex.answer) return;

  // ─── 1) Distill memories every 3 exchanges per surface ──────────────────
  const key = `${ex.surface}:${ex.conversationId || 'default'}`;
  exchangeCounters[key] = (exchangeCounters[key] || 0) + 1;

  if (exchangeCounters[key] % 3 === 0) {
    // Fire-and-forget — no need to await
    aiMemoryService
      .distillMemories(
        [
          { role: 'user', content: ex.question.slice(0, 4000) },
          { role: 'assistant', content: ex.answer.slice(0, 6000) },
        ],
        ex.conversationId || undefined,
      )
      .catch(() => {});
  }

  // ─── 2) Self-grade the answer (background) ──────────────────────────────
  evaluateAnswer({
    question: ex.question,
    answer: ex.answer,
    contextSummary: ex.contextSummary,
  })
    .then((score) => {
      if (!score) return;

      // Low-confidence answers → record as unhelpful so importance drops
      if ((score.overall ?? 1) < 0.55) {
        recordOutcome({
          kind: 'response_unhelpful',
          conversationId: ex.conversationId || null,
          topic: ex.topic || ex.surface,
          category: ex.category || ex.surface,
          metadata: {
            eval: score,
            reason: 'low_overall_score',
          },
        }).catch(() => {});
      }
    })
    .catch(() => {});
}

/** Convenience: record a positive outcome when user takes action on an answer. */
export function recordPositiveOutcome(opts: {
  surface: LearningExchange['surface'];
  kind: 'booking_clicked' | 'booking_completed' | 'navigation_followed' | 'suggestion_accepted' | 'response_helpful';
  conversationId?: string | null;
  topic?: string;
  category?: string;
  metadata?: Record<string, any>;
}) {
  return recordOutcome({
    kind: opts.kind,
    conversationId: opts.conversationId || null,
    topic: opts.topic || opts.surface,
    category: opts.category || opts.surface,
    metadata: opts.metadata,
  });
}
