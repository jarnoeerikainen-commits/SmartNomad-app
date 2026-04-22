// ═══════════════════════════════════════════════════════════
// RewardsOptimizerService — frontend client for the
// rewards-optimizer edge function. Keeps the UI simple:
// one call → ranked strategy options for the user to choose.
// ═══════════════════════════════════════════════════════════

import { supabase } from "@/integrations/supabase/client";
import { AWARD_PROGRAMS } from "@/data/awardProgramsData";
import type { UserAwardCard } from "@/types/awardCards";

export type IntentType =
  | "flight"
  | "hotel"
  | "car"
  | "lounge"
  | "restaurant"
  | "earn"
  | "general";

export interface OptimizeIntent {
  type: IntentType;
  description: string;
  origin?: string;
  destination?: string;
  dates?: string;
  cabin?: string;
  estimatedCashCost?: number;
  nights?: number;
  pax?: number;
}

export interface OptimizeOption {
  rank: number;
  title: string;
  strategy:
    | "pay_cash"
    | "redeem_points"
    | "transfer_then_redeem"
    | "buy_points"
    | "status_upgrade";
  program: string;
  pointsNeeded?: number;
  pointsSource?: string;
  cashOutlay?: number;
  cashEquivalent?: number;
  valueCapture?: string;
  tierBenefits?: string[];
  actionSteps?: string[];
  risks?: string[];
  confidence?: number;
}

export interface ExpiringAlert {
  program: string;
  balance: number;
  expires: string;
  suggestion: string;
}

export interface OptimizerPlan {
  summary: string;
  options: OptimizeOption[];
  expiringAlerts?: ExpiringAlert[];
  earningTip?: string;
}

export interface OptimizerResponse {
  success: boolean;
  plan?: OptimizerPlan;
  error?: string;
  generatedAt?: string;
}

/** Enrich the user cards with metadata from the program catalogue. */
function enrichCards(cards: UserAwardCard[]) {
  return cards.map((c) => {
    const prog = AWARD_PROGRAMS.find((p) => p.id === c.programId);
    return {
      ...c,
      valuePerPoint: prog?.valuePerPoint,
      transferPartners: prog?.transferPartners,
    };
  });
}

export const RewardsOptimizerService = {
  async optimize(
    intent: OptimizeIntent,
    cards: UserAwardCard[],
    preferences?: { style?: "luxury" | "balanced" | "value"; riskTolerance?: "low" | "medium" | "high" }
  ): Promise<OptimizerResponse> {
    const enriched = enrichCards(cards);
    const { data, error } = await supabase.functions.invoke("rewards-optimizer", {
      body: { intent, cards: enriched, preferences },
    });
    if (error) return { success: false, error: error.message };
    return data as OptimizerResponse;
  },

  /** Detect simple, deterministic opportunities client-side without an AI call. */
  detectOpportunities(cards: UserAwardCard[]) {
    const opportunities: Array<{
      kind: "expiring" | "transfer_buff" | "consolidation";
      severity: "info" | "warn" | "urgent";
      title: string;
      detail: string;
      cardId?: string;
    }> = [];

    const now = Date.now();
    cards.forEach((c) => {
      if (c.expiryDate) {
        const diff = new Date(c.expiryDate).getTime() - now;
        const days = Math.round(diff / 86_400_000);
        if (days > 0 && days <= 90 && c.pointsBalance > 1_000) {
          opportunities.push({
            kind: "expiring",
            severity: days <= 30 ? "urgent" : "warn",
            title: `${c.programName} — ${c.pointsBalance.toLocaleString()} ${c.pointsCurrency} expire in ${days}d`,
            detail: "Burn or extend with any earning/redeeming activity.",
            cardId: c.id,
          });
        }
      }
    });

    // Transfer-credit-card buff: Chase UR + Hyatt
    const hasUR = cards.find((c) => c.programId === "chase-ur");
    const hasHyatt = cards.find((c) => c.programId === "hyatt-wh");
    if (hasUR && hasHyatt && hasUR.pointsBalance >= 60_000) {
      opportunities.push({
        kind: "transfer_buff",
        severity: "info",
        title: "Chase UR → Hyatt sweet spot",
        detail: `Transfer 60K UR to Hyatt for ~4 nights at a Park Hyatt (≈$2,400 value).`,
      });
    }

    // Amex MR + ANA
    const hasMR = cards.find((c) => c.programId === "amex-mr");
    if (hasMR && hasMR.pointsBalance >= 88_000) {
      opportunities.push({
        kind: "transfer_buff",
        severity: "info",
        title: "Amex MR → ANA business class sweet spot",
        detail: `88K MR → ANA = round-trip business US↔Japan (≈$8,000 value).`,
      });
    }

    return opportunities;
  },
};
