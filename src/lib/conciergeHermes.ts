// ═══════════════════════════════════════════════════════════════════════════
// conciergeHermes — helper the Concierge calls BEFORE replying to a user.
// Returns a compact assist envelope:
//   { suggestion, next_action, escalate, confidence, tone_hint, source }
// Safe-by-default: returns a low-confidence calm fallback on any error so
// the Concierge stream never blocks.
// ═══════════════════════════════════════════════════════════════════════════
import { supabase } from "@/integrations/supabase/client";

export interface HermesAssist {
  suggestion: string;
  next_action: string;
  escalate: boolean;
  confidence: "low" | "medium" | "high";
  tone_hint: "calm" | "urgent" | "celebratory" | "cautious";
  source: "hermes" | "fallback";
}

export interface AssistContext {
  userMessage: string;
  persona?: string | null;
  isDemo?: boolean;
  route?: string;
  city?: string | null;
  signals?: {
    open_tickets?: number;
    safety_alerts?: number;
    tax_warning?: string;
    loyalty_tier?: string;
    last_booking_failed?: boolean;
  };
}

const SAFE_FALLBACK: HermesAssist = {
  suggestion: "Stay concise and confirm the user's next step.",
  next_action: "Confirm next step",
  escalate: false,
  confidence: "low",
  tone_hint: "calm",
  source: "fallback",
};

// Topic gate — only invoke Hermes for high-stakes or signal-flagged messages.
// Casual chitchat returns the safe fallback immediately, halving invocations.
const HIGH_STAKES_RE = /(tax|residency|visa|immigration|legal|deport|prescription|diagnos|symptom|treaty|capital gains|inheritance|lawsuit|booking|payment|refund|cancel|safety|emergency|danger|threat|stolen|lost passport|fraud)/i;

function isHighStakes(ctx: AssistContext): boolean {
  if (HIGH_STAKES_RE.test(ctx.userMessage)) return true;
  const s = ctx.signals ?? {};
  if (s.safety_alerts && s.safety_alerts > 0) return true;
  if (s.last_booking_failed) return true;
  if (s.tax_warning) return true;
  if ((s.open_tickets ?? 0) > 2) return true;
  return false;
}

export async function getHermesAssist(ctx: AssistContext): Promise<HermesAssist> {
  // Skip the round-trip entirely for casual messages — saves ~50% of calls.
  if (!isHighStakes(ctx)) return SAFE_FALLBACK;
  try {
    const { data, error } = await supabase.functions.invoke("concierge-hermes-assist", {
      body: {
        user_message: ctx.userMessage,
        persona: ctx.persona ?? "guest",
        is_demo: !!ctx.isDemo,
        route: ctx.route,
        city: ctx.city ?? null,
        recent_signals: ctx.signals ?? {},
      },
    });
    if (error || !data) return SAFE_FALLBACK;
    return data as HermesAssist;
  } catch {
    return SAFE_FALLBACK;
  }
}

/**
 * Splice the Hermes assist line into a concierge reply when confidence ≥ medium.
 * The concierge text stays the lead; the assist becomes a short trailing tip.
 */
export function spliceAssist(reply: string, assist: HermesAssist): string {
  if (assist.confidence === "low") return reply;
  if (!assist.suggestion) return reply;
  const tip = `\n\n_${assist.suggestion}_${assist.next_action ? `  → **${assist.next_action}**` : ""}`;
  return reply + tip;
}
