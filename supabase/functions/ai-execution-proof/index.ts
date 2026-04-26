import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MODEL_COST_PER_1K: Record<string, { input: number; output: number }> = {
  "google/gemini-3-flash-preview": { input: 0.00035, output: 0.00105 },
  "google/gemini-2.5-flash": { input: 0.00030, output: 0.00100 },
  "google/gemini-2.5-flash-lite": { input: 0.00010, output: 0.00040 },
  "google/gemini-2.5-pro": { input: 0.00125, output: 0.00500 },
};

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value.slice(0, 40) : [];
}

function cleanText(value: unknown, max = 2000): string {
  return String(value || '').trim().slice(0, max);
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("missing_service_config");

    const body = await req.json();
    const runRef = cleanText(body.run_ref || body.id, 160);
    const command = cleanText(body.command, 2000);
    const surface = cleanText(body.surface, 120);
    const primaryAgent = cleanText(body.primary_agent, 120);
    const route = cleanText(body.route, 500);
    const status = cleanText(body.status || "running", 20);

    if (!runRef || !command || !surface || !primaryAgent || !route || !["running", "completed", "failed"].includes(status)) {
      return new Response(JSON.stringify({ error: "invalid_proof_payload" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const model = cleanText(body.model || "google/gemini-3-flash-preview", 80);
    const inputTokens = Math.max(0, Number(body.input_tokens || 0));
    const outputTokens = Math.max(0, Number(body.output_tokens || 0));
    const pricing = MODEL_COST_PER_1K[model] || MODEL_COST_PER_1K["google/gemini-3-flash-preview"];
    const estimatedCost = Number(((inputTokens / 1000) * pricing.input + (outputTokens / 1000) * pricing.output).toFixed(6));

    const proofCore = {
      run_ref: runRef,
      surface,
      persona: cleanText(body.persona || "Guest / Live user", 120),
      user_alias: cleanText(body.user_alias || "live_user_session", 120),
      command,
      primary_agent: primaryAgent,
      function_name: cleanText(body.function_name, 120) || null,
      status,
      route,
      directors: asArray(body.directors),
      steps: asArray(body.steps),
      sources: asArray(body.sources),
      response_excerpt: cleanText(body.response_excerpt, 1600) || null,
      answer_agents: asArray(body.answer_agents),
      answer_sources: asArray(body.answer_sources),
      websites: asArray(body.websites),
      verification_note: cleanText(body.verification_note, 800) || null,
      confidence_policy: "verified_only",
      model,
      input_tokens: Math.round(inputTokens),
      output_tokens: Math.round(outputTokens),
      latency_ms: Math.max(0, Math.round(Number(body.latency_ms || 0))),
      cache_hit: Boolean(body.cache_hit),
      estimated_cost_usd: estimatedCost,
      error: cleanText(body.error, 1000) || null,
      completed_at: status === "running" ? null : new Date().toISOString(),
    };

    const proof_hash = await sha256(JSON.stringify(proofCore));
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/ai_execution_proofs?on_conflict=run_ref`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({ ...proofCore, proof_hash }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("ai_execution_proof_upsert_failed", resp.status, text);
      return new Response(JSON.stringify({ error: "proof_persist_failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await resp.json();
    return new Response(JSON.stringify({ ok: true, proof_hash, record: data?.[0] || null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("ai-execution-proof error", error);
    return new Response(JSON.stringify({ error: "service_unavailable" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
