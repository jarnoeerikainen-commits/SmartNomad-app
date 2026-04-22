// ═══════════════════════════════════════════════════════════════════════════
// AGENT DEPARTMENT — shared edge function for all 5 Sovereign Back-Office
// Department Leads (legal, security, growth, product, oracle).
//
// CURRENTLY: returns the same shape the demo simulator produces, so the
// front-end can switch from MODE='demo' to MODE='live' transparently.
//
// PRODUCTION TODO: replace the placeholder generator with a real Gemini
// call grounded in live signals (ai_usage_logs, support_tickets, agentic_*,
// data_packages, etc.) using the same proposal schema.
// ═══════════════════════════════════════════════════════════════════════════
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AGENT_NAMES: Record<string, string> = {
  legal: "Themis",
  security: "Aegis",
  growth: "Hermes",
  product: "Iris",
  oracle: "Pythia",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const agent = url.pathname.split("/").pop() ?? "legal";
    const name = AGENT_NAMES[agent] ?? "Agent";

    return new Response(
      JSON.stringify({
        ok: true,
        agent,
        name,
        mode: "stub",
        message:
          `${name} stub ready. When live mode is enabled, this endpoint will return one or more proposals in the AgentProposal shape used by the front-end.`,
        proposals: [],
        ts: Date.now(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "err" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
