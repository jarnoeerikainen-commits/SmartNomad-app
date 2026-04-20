// ═══════════════════════════════════════════════════════════
// Model Router — Smartest Concierge Auto-Routing
// ───────────────────────────────────────────────────────────
// Single source of truth for which AI model to use for each
// task. When new/smarter models ship on the Lovable AI gateway,
// update ONE constant here and every edge function upgrades.
//
// Selection axes:
//   • intelligence → use the strongest reasoning model
//   • speed        → use the fastest cheap model (chat, tags)
//   • balanced     → daily concierge default (smart + fast + cheap)
//   • vision       → image-aware tasks (scans, OCR)
// ═══════════════════════════════════════════════════════════

export type ModelTier = 'intelligence' | 'balanced' | 'speed' | 'vision';

/**
 * Current best-of-class models on the Lovable AI gateway.
 * Update this single block when smarter models are released —
 * every edge function automatically benefits.
 *
 * Last reviewed: 2026-04-20
 */
export const MODEL_REGISTRY: Record<ModelTier, string> = {
  // Hardest reasoning: tax/legal/medical, multi-step planning, citations
  intelligence: 'google/gemini-2.5-pro',
  // Daily concierge default: smart, fast, low-cost
  balanced: 'google/gemini-2.5-flash',
  // Pure speed: tag extraction, classifiers, short transforms
  speed: 'google/gemini-2.5-flash-lite',
  // Image input: card scans, document OCR
  vision: 'google/gemini-2.5-flash',
};

/**
 * Heuristic complexity scorer for the latest user message.
 * Returns a tier. Cheaper than calling a router LLM.
 */
export function pickModelForMessages(
  messages: Array<{ role: string; content: string }>,
  defaultTier: ModelTier = 'balanced',
): { model: string; tier: ModelTier; reasoningEffort: 'none' | 'low' | 'medium' | 'high' } {
  const last = [...messages].reverse().find(m => m.role === 'user')?.content?.toLowerCase() ?? '';

  // High-stakes domains → intelligence tier + medium reasoning
  const highStakes = /(tax|residency|visa|immigration|legal|lawsuit|deport|prescription|diagnos|symptom|treaty|capital gains|inheritance|will|trust\b|llc|gmbh|liability)/i;
  if (highStakes.test(last)) {
    return { model: MODEL_REGISTRY.intelligence, tier: 'intelligence', reasoningEffort: 'medium' };
  }

  // Multi-step planning → balanced + low reasoning
  const planning = /(plan|itinerary|compare|optimi[sz]e|strategy|forecast|scenario|budget for|step.by.step)/i;
  if (planning.test(last)) {
    return { model: MODEL_REGISTRY.balanced, tier: 'balanced', reasoningEffort: 'low' };
  }

  // Quick chat → balanced, no reasoning overhead
  return { model: MODEL_REGISTRY[defaultTier], tier: defaultTier, reasoningEffort: 'none' };
}

/** Convenience: get a specific tier without heuristics. */
export function getModel(tier: ModelTier): string {
  return MODEL_REGISTRY[tier];
}
