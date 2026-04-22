// ═══════════════════════════════════════════════════════════
// rewards-optimizer — World-class travel rewards designer.
// Takes the user's full loyalty portfolio + an upcoming
// booking intent (flight/hotel/etc.) and returns 2-3 ranked
// strategy options powered by Gemini 3 Pro reasoning.
//
// Strategies it considers:
//   • Pay cash vs. burn points (cents-per-point math)
//   • Status-aware airline/hotel choice (upgrades, lounges)
//   • Credit-card transfer partners (Chase→Hyatt, Amex→ANA…)
//   • Buy-points top-ups when ROI ≥ 1.5x
//   • Expiring points first (redeem-or-lose)
//   • Earning maximizers (which card to swipe for which spend)
//
// Always returns multiple options so the human picks the
// final action — never auto-executes.
// ═══════════════════════════════════════════════════════════

import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

interface UserCard {
  programId: string;
  programName: string;
  category: string;
  currentTier?: string;
  pointsBalance: number;
  pointsCurrency: string;
  expiryDate?: string;
  valuePerPoint?: number;
  transferPartners?: string[];
  notes?: string;
}

interface OptimizeRequest {
  intent: {
    type: "flight" | "hotel" | "car" | "lounge" | "restaurant" | "earn" | "general";
    description: string;
    origin?: string;
    destination?: string;
    dates?: string;
    cabin?: string;
    estimatedCashCost?: number; // USD
    nights?: number;
    pax?: number;
  };
  cards: UserCard[];
  preferences?: {
    style?: "luxury" | "balanced" | "value";
    riskTolerance?: "low" | "medium" | "high"; // willingness to buy points
  };
}

const SYSTEM_PROMPT = `You are the world's #1 travel rewards strategist — equal parts The Points Guy, OMAAT, and a private-banking concierge. You design point-and-status strategies for high-net-worth nomads.

CORE RULES:
1. ALWAYS return 2-3 ranked options so the user picks the final action. NEVER one option only.
2. Score every option with a sharp "value capture" rating (cents-per-point or % saved vs. cash).
3. Consider: status upgrades, lounge access, transfer-partner sweet spots, expiring balances first, and BUY-POINTS top-ups when ROI ≥ 1.5x cash cost.
4. Be concrete: name the exact partner, route, hotel, transfer ratio, and points needed.
5. If a credit-card portfolio (Chase UR / Amex MR / Citi TYP / Capital One / Bilt) can transfer to an airline/hotel program with better redemption value, surface it.
6. Flag any "redeem-or-lose" expiring points the user should burn first.
7. Suggest which credit card to USE FOR PAYMENT to maximize earning if cash is the answer.
8. Output STRICT JSON only — no prose, no markdown.

OUTPUT JSON SCHEMA:
{
  "summary": "1-sentence executive read",
  "options": [
    {
      "rank": 1,
      "title": "Short headline (e.g. 'Burn 110K Virgin → ANA First SIN-LHR')",
      "strategy": "pay_cash" | "redeem_points" | "transfer_then_redeem" | "buy_points" | "status_upgrade",
      "program": "Singapore KrisFlyer",
      "pointsNeeded": 244000,
      "pointsSource": "Existing balance" | "Transfer from Amex MR (1:1)" | "Buy 50K @ $0.018",
      "cashOutlay": 320,
      "cashEquivalent": 12500,
      "valueCapture": "5.1¢/pt — exceptional",
      "tierBenefits": ["The Private Room access", "Suites check-in", "Guaranteed 2A double bed"],
      "actionSteps": ["Step 1...", "Step 2..."],
      "risks": ["Award space scarce 14d out", "Surcharges $320"],
      "confidence": 0.92
    }
  ],
  "expiringAlerts": [
    { "program": "Lufthansa M&M", "balance": 145000, "expires": "2027-06-30", "suggestion": "Burn on LH First MUC-SFO before 6 months" }
  ],
  "earningTip": "Charge the $320 surcharge to Amex Platinum for 5x MR (1,600 pts ≈ $32 back)"
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return json({ success: false, error: "LOVABLE_API_KEY missing" }, 500);
    }

    const body = await req.json().catch(() => null) as OptimizeRequest | null;
    if (!body?.intent || !Array.isArray(body.cards)) {
      return json({ success: false, error: "intent and cards required" }, 400);
    }

    // Compact card portfolio for the prompt — only what matters.
    const portfolio = body.cards
      .filter((c) => c.pointsBalance > 0 || c.currentTier)
      .map((c) => ({
        program: c.programName,
        category: c.category,
        tier: c.currentTier ?? "Member",
        balance: c.pointsBalance,
        currency: c.pointsCurrency,
        valuePerPoint: c.valuePerPoint ?? null,
        expires: c.expiryDate ?? null,
        transferTo: c.transferPartners ?? [],
        notes: c.notes?.slice(0, 220) ?? "",
      }));

    const userPrompt = `USER PORTFOLIO:
${JSON.stringify(portfolio, null, 2)}

INTENT:
${JSON.stringify(body.intent, null, 2)}

PREFERENCES:
${JSON.stringify(body.preferences ?? { style: "balanced", riskTolerance: "medium" })}

Design the 2-3 best options. JSON only.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiRes.status === 429) {
      return json({ success: false, error: "Rate limit — try again in a moment." }, 429);
    }
    if (aiRes.status === 402) {
      return json({ success: false, error: "AI credits exhausted. Add credits in workspace settings." }, 402);
    }
    if (!aiRes.ok) {
      const txt = await aiRes.text();
      return json({ success: false, error: `Gateway error: ${txt.slice(0, 200)}` }, 502);
    }

    const aiJson = await aiRes.json();
    const raw = aiJson.choices?.[0]?.message?.content ?? "{}";
    let plan: unknown;
    try {
      plan = JSON.parse(raw);
    } catch {
      // Strip code fences if the model added them.
      const cleaned = raw.replace(/```json|```/g, "").trim();
      plan = JSON.parse(cleaned);
    }

    return json({ success: true, plan, generatedAt: new Date().toISOString() }, 200);
  } catch (err) {
    return json({ success: false, error: (err as Error).message }, 500);
  }
});

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
