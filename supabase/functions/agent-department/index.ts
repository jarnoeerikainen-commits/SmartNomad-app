// ═══════════════════════════════════════════════════════════════════════════
// AGENT DEPARTMENT — shared edge function for ALL 15 Sovereign Back-Office
// Department Leads.
//
// Routing: invoke as `agent-department/<slug>` where slug is one of the
// canonical agent ids below. Returns the same shape the demo simulator
// produces, so the front-end can switch from MODE='demo' to MODE='live'
// transparently.
//
// PRODUCTION TODO: replace the placeholder generator with a real Lovable AI
// Gateway call grounded in live signals (ai_usage_logs, support_tickets,
// agentic_*, data_packages, conversations, etc.) using the AgentProposal
// schema. Each agent should ground its prompt in domain-specific signals.
// ═══════════════════════════════════════════════════════════════════════════
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Canonical 15-agent registry. Keep in sync with src/services/AgentOrchestratorService.ts
const AGENTS: Record<string, { name: string; team: string; tier: string }> = {
  // Core Council
  legal:     { name: "Themis",    team: "Sovereign Legal & Compliance Guard", tier: "core" },
  security:  { name: "Aegis",     team: "Fortress Security Team",             tier: "core" },
  growth:    { name: "Hermes",    team: "Growth & Yield Engine",              tier: "core" },
  product:   { name: "Iris",      team: "Product Labs",                       tier: "core" },
  oracle:    { name: "Pythia",    team: "The Oracle",                         tier: "core" },
  // Tier 1 — Strategic
  atlas:     { name: "Atlas",     team: "Cartography & Curation",             tier: "tier1" },
  midas:     { name: "Midas",     team: "Marketplace Margin Engine",          tier: "tier1" },
  echo:      { name: "Echo",      team: "Customer Success AI",                tier: "tier1" },
  // Tier 2 — Operations
  sentinel:  { name: "Sentinel",  team: "Global Disruption Watch",            tier: "tier2" },
  muse:      { name: "Muse",      team: "Programmatic Acquisition",           tier: "tier2" },
  praxis:    { name: "Praxis",    team: "Supplier Health Watch",              tier: "tier2" },
  // Tier 3 — Compounding
  forge:     { name: "Forge",     team: "A/B/n Test Lab",                     tier: "tier3" },
  concord:   { name: "Concord",   team: "Pulse / Vibe Moderation",            tier: "tier3" },
  verdant:   { name: "Verdant",   team: "Carbon & Compliance",                tier: "tier3" },
  atlas_ltv: { name: "Atlas-LTV", team: "HNW Whale Operations",               tier: "tier3" },
};

// Both `agent-atlas-ltv` and `agent-atlas_ltv` style slugs route to the same agent.
function normalizeSlug(raw: string): string {
  return raw.replace(/^agent[-_]/, "").replace(/-/g, "_").toLowerCase();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    // Path: /agent-department/<slug>  OR  /agent-department?agent=<slug>
    const last = url.pathname.split("/").filter(Boolean).pop() ?? "";
    const queryAgent = url.searchParams.get("agent") ?? "";
    const rawSlug = (last && last !== "agent-department") ? last : queryAgent;
    const slug = normalizeSlug(rawSlug || "legal");
    const agent = AGENTS[slug];

    if (!agent) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "unknown_agent",
          requested: rawSlug,
          known: Object.keys(AGENTS),
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        agent: slug,
        name: agent.name,
        team: agent.team,
        tier: agent.tier,
        mode: "stub",
        message:
          `${agent.name} stub ready. When live mode is enabled, this endpoint will return one or more proposals in the AgentProposal shape used by the front-end.`,
        proposals: [],
        ts: Date.now(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "err" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
