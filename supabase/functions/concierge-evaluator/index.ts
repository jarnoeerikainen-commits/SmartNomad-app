// ═══════════════════════════════════════════════════════════════════════════
// CONCIERGE EVALUATOR — Back-office self-grading + auto-upgrade
// ───────────────────────────────────────────────────────────────────────────
// After every concierge answer, the frontend may POST the (question, answer,
// context) here. We use a small, fast model to grade the response on:
//   • factuality (0-1)
//   • personalization (0-1)
//   • hedging-when-uncertain (0-1)
//   • overall_confidence (0-1)
// If overall_confidence < 0.6 we recommend an "upgrade" — the client may
// re-ask using a stronger model OR show an escalation card.
// Result is written to ai_usage_logs so we can track concierge IQ over time.
// ═══════════════════════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EVAL_MODEL = "google/gemini-2.5-flash-lite";

const SYSTEM_PROMPT = `You are a strict QUALITY EVALUATOR for an AI concierge.
Given a user question, the concierge's answer, and the context that was
available to it, score the answer on four axes (0.0 to 1.0):

  • factuality        — Are claims grounded in the supplied context or
                        well-known verified sources? Penalize ANY invented
                        prices, dates, URLs, phone numbers, laws.
  • personalization   — Did it use the user's known profile/family/hobbies
                        when relevant? Did it ignore obvious context?
  • calibration       — Did it hedge appropriately when uncertain? Did it
                        emit [ESCALATE: ...] for high-stakes uncertainty?
  • overall           — Holistic concierge quality.

Be strict. Average answers should score around 0.6, not 0.9.
Use the report_score tool to return your verdict.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question, answer, contextSummary, deviceId } = await req.json();
    if (!question || !answer) {
      return new Response(JSON.stringify({ error: "question and answer required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("Service config error");

    const userPrompt = `## USER QUESTION
${String(question).slice(0, 2000)}

## CONCIERGE ANSWER
${String(answer).slice(0, 4000)}

## CONTEXT THAT WAS AVAILABLE
${String(contextSummary || '(none provided)').slice(0, 3000)}

Score this answer.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: EVAL_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "report_score",
            description: "Report quality scores",
            parameters: {
              type: "object",
              properties: {
                factuality:      { type: "number", description: "0.0-1.0" },
                personalization: { type: "number", description: "0.0-1.0" },
                calibration:     { type: "number", description: "0.0-1.0" },
                overall:         { type: "number", description: "0.0-1.0" },
                issues:          { type: "array", items: { type: "string" }, description: "Top 0-3 specific issues" },
                upgrade_suggestion: { type: "string", description: "If overall < 0.6: 'rerun_intelligence' | 'escalate_human' | 'add_search'; else 'none'" },
              },
              required: ["factuality", "personalization", "calibration", "overall", "upgrade_suggestion"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "report_score" } },
      }),
    });

    if (!resp.ok) {
      console.error("Eval gateway error", resp.status);
      return new Response(JSON.stringify({ overall: null, error: "eval_failed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    let score: any = { overall: null };
    try {
      const tc = data.choices?.[0]?.message?.tool_calls?.[0];
      if (tc?.function?.arguments) score = JSON.parse(tc.function.arguments);
    } catch (e) { console.error("Parse error", e); }

    // Persist to ai_usage_logs (best-effort)
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && deviceId) {
      fetch(`${SUPABASE_URL}/rest/v1/rpc/log_ai_usage`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_device_id: deviceId,
          p_function_name: "concierge-evaluator",
          p_model: EVAL_MODEL,
          p_input_tokens: 0,
          p_output_tokens: 0,
          p_latency_ms: 0,
          p_cache_hit: false,
          p_reasoning: `score:${score.overall}`,
          p_error: null,
        }),
      }).catch(() => {});
    }

    return new Response(JSON.stringify(score), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Evaluator error:", e);
    return new Response(JSON.stringify({ error: "Service unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
