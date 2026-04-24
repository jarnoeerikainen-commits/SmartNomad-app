// ═══════════════════════════════════════════════════════════════════
// ADMIN AI DIRECTORS — 24/7 sourcing workers
//   • Global Event Director (concerts, art fairs, galas, festivals)
//   • Global Sports Director (F1, MotoGP, NBA, Rugby 7s, NFL, ATP, ...)
//   • Global VIP Director (private galas, VIP rooms, fashion week, yacht parties)
//
// Each run:
//   1. Picks a director (events|sports|vip).
//   2. Asks Lovable AI Gateway for 6–10 high-signal upcoming opportunities
//      with sponsor packages, VIP packages, and Concierge sale bundles.
//   3. Persists into admin_ai_opportunities.
//   4. Mirrors top opportunities into admin_ai_recommendations so the
//      Sales/Marketing/Concierge AI sees them in the unified Brain feed.
// ═══════════════════════════════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const MODEL = "google/gemini-3-flash-preview";

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

type Director = "events" | "sports" | "vip";

// ─── Director briefs ──────────────────────────────────────────────────
const briefs: Record<Director, { title: string; mandate: string; categories: string[]; example_targets: string }> = {
  events: {
    title: "Global Event Director",
    mandate:
      "Source upcoming high-impact concerts, music festivals, art fairs (Art Basel, Frieze), tech conferences (CES, Web Summit, Slush), film premieres, food & wine events, opera, and major cultural happenings worldwide that high-net-worth nomads would care about over the next 60 days.",
    categories: ["concert", "festival", "art_fair", "conference", "premiere", "food_wine", "opera", "exhibition"],
    example_targets:
      "Art Basel Miami / Hong Kong, Coachella, Glastonbury, Tomorrowland, Cannes Film Festival, Web Summit Lisbon, Slush Helsinki, Frieze London, Salone del Mobile",
  },
  sports: {
    title: "Global Sports Director",
    mandate:
      "Source upcoming top-tier sports events and big-league games over the next 60 days: F1, MotoGP, NASCAR, IndyCar, NBA marquee games and playoffs, NFL, MLB, NHL, Premier League / La Liga / Serie A / Champions League finals, Six Nations rugby, World Rugby 7s, ATP/WTA Masters & Slams, PGA majors, UFC numbered cards, World Athletics, and Olympics qualifiers.",
    categories: ["f1", "motogp", "nascar", "indycar", "nba", "nfl", "soccer", "rugby_7s", "rugby_15s", "tennis", "golf", "ufc", "athletics"],
    example_targets:
      "Monaco GP, Silverstone GP, Mugello MotoGP, Daytona 500, NBA Finals, Super Bowl, Champions League final, Wimbledon, US Open, The Masters, UFC 300, Diamond League meets",
  },
  vip: {
    title: "Global VIP Director",
    mandate:
      "Source ultra-exclusive black-tier opportunities the next 60 days: black-tie galas, charity dinners (amfAR, Met Gala adjacent), royal & embassy events, fashion week front-row + after-parties (Paris/Milan/NY/London), yacht-show after-parties (Monaco, Cannes Lions), F1 Paddock Club access, private museum openings, Davos side-events, Sun Valley, Allen & Co., and members-only retreats (Soho House, Aman Club).",
    categories: ["gala", "vip_party", "fashion_week", "paddock_club", "private_dinner", "members_retreat", "yacht_party", "embassy"],
    example_targets:
      "Met Gala adjacent dinners, amfAR Cannes Gala, Paris Fashion Week front-row, Monaco Yacht Show after-parties, F1 Paddock Club Monaco/Singapore, Davos side dinners, Allen & Co Sun Valley, Aman Club opening",
  },
};

// ─── AI synthesis (structured output via tool calling) ────────────────
async function sourceWithAI(director: Director, scope: string) {
  const brief = briefs[director];

  const systemPrompt = `You are the SuperNomad ${brief.title}. You work 24/7 sourcing premium opportunities for a high-net-worth global nomad platform. You partner tightly with Sales, Marketing, and the Concierge AI: every opportunity must be SELLABLE and BUNDLEABLE (tickets + flight + hotel + private transfer or jet).

Your mandate: ${brief.mandate}

Allowed categories: ${brief.categories.join(", ")}
Inspiration targets (real annual events that exist in the world — pick from these or other genuinely well-known events; never invent fictional brands): ${brief.example_targets}

GROUND RULES (Evidence-First / Source of Truth):
- Use only events that exist in the real world. If you do not know exact future dates, mark them as "approx" in metadata.notes and choose realistic windows (next 60 days from today).
- Prices and audience sizes must be plausible market estimates — never quote a fabricated official figure.
- Prefer events high-net-worth nomads would care about.
- Output 6 to 10 opportunities per run.
- For each opportunity propose:
   - 2 to 3 VIP packages (name, price USD, 3-5 perks)
   - 2 to 3 Sponsor packages (tier name like Bronze/Silver/Gold/Platinum, price USD, deliverables, 2-4 plausible target company types)
   - 1 Concierge sales bundle (one-line pitch + bundle parts: ticket, flight, hotel, transfer/jet, optional dinner/spa)
   - Sales target segments (e.g. "hnw_americas","tech_execs","family_office_eu","crypto_founders")
   - popularity_score (0-100) and exclusivity_score (0-100)`;

  const userPrompt = `Scope: ${scope}. Return your next batch of opportunities NOW. Today is ${new Date().toISOString().slice(0, 10)}.`;

  const tools = [
    {
      type: "function",
      function: {
        name: "deliver_opportunities",
        description: "Return a batch of sourced opportunities for the director.",
        parameters: {
          type: "object",
          properties: {
            opportunities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  title: { type: "string" },
                  summary: { type: "string" },
                  city: { type: "string" },
                  country: { type: "string" },
                  venue: { type: "string" },
                  start_at: { type: "string", description: "ISO datetime, approx ok" },
                  end_at: { type: "string" },
                  url: { type: "string" },
                  popularity_score: { type: "number" },
                  exclusivity_score: { type: "number" },
                  est_audience: { type: "number" },
                  est_ticket_price_min: { type: "number" },
                  est_ticket_price_max: { type: "number" },
                  currency: { type: "string" },
                  vip_packages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        price: { type: "number" },
                        perks: { type: "array", items: { type: "string" } },
                      },
                      required: ["name", "price", "perks"],
                    },
                  },
                  sponsor_packages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        tier: { type: "string" },
                        price: { type: "number" },
                        deliverables: { type: "array", items: { type: "string" } },
                        target_companies: { type: "array", items: { type: "string" } },
                      },
                      required: ["tier", "price", "deliverables"],
                    },
                  },
                  concierge_offer: {
                    type: "object",
                    properties: {
                      pitch: { type: "string" },
                      bundle: { type: "array", items: { type: "string" } },
                      upsell: { type: "array", items: { type: "string" } },
                    },
                    required: ["pitch", "bundle"],
                  },
                  sales_target_segments: { type: "array", items: { type: "string" } },
                  tags: { type: "array", items: { type: "string" } },
                  notes: { type: "string" },
                },
                required: ["category", "title", "summary", "vip_packages", "sponsor_packages", "concierge_offer"],
              },
            },
          },
          required: ["opportunities"],
        },
      },
    },
  ];

  const t0 = Date.now();
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools,
      tool_choice: { type: "function", function: { name: "deliver_opportunities" } },
    }),
  });
  const latency = Date.now() - t0;

  if (!resp.ok) {
    const txt = await resp.text();
    if (resp.status === 429) throw new Error("Rate limit, try again shortly");
    if (resp.status === 402) throw new Error("AI credits exhausted");
    throw new Error(`AI gateway ${resp.status}: ${txt.slice(0, 300)}`);
  }
  const data = await resp.json();
  const call = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) throw new Error("No tool call returned by model");
  const parsed = JSON.parse(call.function.arguments);
  const usage = data?.usage ?? {};

  return {
    opportunities: parsed.opportunities ?? [],
    latency,
    input_tokens: usage.prompt_tokens ?? 0,
    output_tokens: usage.completion_tokens ?? 0,
  };
}

// ─── Persist opportunities + mirror to recommendations ────────────────
async function persist(director: Director, runId: string, ops: any[]) {
  if (!ops.length) return { opportunities_created: 0, sponsor_packages_created: 0, pushed_recommendations: 0 };

  const rows = ops.map((o) => ({
    director,
    category: String(o.category ?? "other").toLowerCase(),
    title: String(o.title).slice(0, 200),
    summary: String(o.summary ?? "").slice(0, 1000),
    city: o.city ?? null,
    country: o.country ?? null,
    venue: o.venue ?? null,
    start_at: o.start_at ?? null,
    end_at: o.end_at ?? null,
    url: o.url ?? null,
    source: "ai_synth",
    popularity_score: Math.min(100, Math.max(0, Number(o.popularity_score ?? 50))),
    exclusivity_score: Math.min(100, Math.max(0, Number(o.exclusivity_score ?? 50))),
    est_audience: o.est_audience ? Math.max(0, Math.round(Number(o.est_audience))) : null,
    est_ticket_price_min: o.est_ticket_price_min ?? null,
    est_ticket_price_max: o.est_ticket_price_max ?? null,
    currency: (o.currency ?? "USD").toUpperCase().slice(0, 3),
    vip_packages: o.vip_packages ?? [],
    sponsor_packages: o.sponsor_packages ?? [],
    concierge_offer: o.concierge_offer ?? {},
    sales_target_segments: o.sales_target_segments ?? [],
    tags: Array.isArray(o.tags) ? o.tags.slice(0, 12) : [],
    source_run_id: runId,
    metadata: { notes: o.notes ?? null },
    expires_at: new Date(Date.now() + 60 * 86400_000).toISOString(),
  }));

  const { data: inserted } = await admin
    .from("admin_ai_opportunities")
    .insert(rows)
    .select("id,title,popularity_score,exclusivity_score,sponsor_packages,concierge_offer,city,country,start_at,category");

  const opps = inserted ?? [];
  const sponsorCount = opps.reduce((s, o: any) => s + (Array.isArray(o.sponsor_packages) ? o.sponsor_packages.length : 0), 0);

  // Mirror top 3 (by popularity+exclusivity) into admin_ai_recommendations so
  // Sales / Marketing / Concierge see them in the unified Brain feed.
  const top = [...opps]
    .sort((a: any, b: any) => (b.popularity_score + b.exclusivity_score) - (a.popularity_score + a.exclusivity_score))
    .slice(0, 3);

  let pushedRecs = 0;
  if (top.length) {
    const recRows = top.map((o: any) => ({
      kind: director === "vip" ? "feature_promote" : "new_order",
      priority: o.exclusivity_score >= 80 || o.popularity_score >= 85 ? "high" : "medium",
      confidence: 0.78,
      title: `[${director.toUpperCase()}] ${o.title}`,
      rationale: `Sourced by the ${briefs[director].title}. ${o.city ?? ""}${o.country ? ", " + o.country : ""}${o.start_at ? " · starts " + new Date(o.start_at).toISOString().slice(0, 10) : ""}.`,
      suggested_action:
        (o.concierge_offer?.pitch ? "Concierge pitch: " + o.concierge_offer.pitch + "\n" : "") +
        "Push to Concierge as bundleable offer (ticket + flight + hotel + transfer/jet) and to Sales for sponsor outreach.",
      expected_impact: "Premium GMV uplift via VIP & sponsor packages; concierge conversion boost.",
      target_segment: { director, opportunity_id: o.id, category: o.category },
      evidence: { source: "admin-ai-directors", run_id: runId },
      source_run_id: runId,
      expires_at: new Date(Date.now() + 30 * 86400_000).toISOString(),
    }));
    const { data: insertedRecs } = await admin
      .from("admin_ai_recommendations")
      .insert(recRows)
      .select("id");
    pushedRecs = insertedRecs?.length ?? 0;

    // Mark mirrored opps as pushed
    await admin
      .from("admin_ai_opportunities")
      .update({ pushed_to_concierge: true, pushed_to_sales: true })
      .in("id", top.map((o: any) => o.id));
  }

  return {
    opportunities_created: opps.length,
    sponsor_packages_created: sponsorCount,
    pushed_recommendations: pushedRecs,
  };
}

// ─── Main handler ─────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  let runId: string | null = null;
  const t0 = Date.now();

  try {
    const body = await req.json().catch(() => ({}));
    const director = (body.director as Director) ?? "events";
    if (!["events", "sports", "vip"].includes(director)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid director" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const trigger = body.trigger ?? "manual";
    const scope = body.scope ?? "sweep";

    const { data: runRow, error: runErr } = await admin
      .from("admin_ai_director_runs")
      .insert({ director, trigger, status: "running", scope, model: MODEL })
      .select("id")
      .single();

    if (runErr || !runRow) {
      console.error("director run insert failed:", runErr);
      return new Response(JSON.stringify({ ok: false, error: "Could not start run" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    runId = runRow.id;

    let aiOut;
    try {
      aiOut = await sourceWithAI(director, scope);
    } catch (aiErr) {
      await admin
        .from("admin_ai_director_runs")
        .update({
          status: "failed",
          error: String(aiErr).slice(0, 500),
          completed_at: new Date().toISOString(),
          latency_ms: Date.now() - t0,
        })
        .eq("id", runId);
      return new Response(
        JSON.stringify({ ok: false, run_id: runId, error: String(aiErr).slice(0, 500) }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const counts = await persist(director, runId!, aiOut.opportunities);

    await admin
      .from("admin_ai_director_runs")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        latency_ms: aiOut.latency,
        input_tokens: aiOut.input_tokens,
        output_tokens: aiOut.output_tokens,
        opportunities_created: counts.opportunities_created,
        sponsor_packages_created: counts.sponsor_packages_created,
        pushed_recommendations: counts.pushed_recommendations,
      })
      .eq("id", runId);

    return new Response(
      JSON.stringify({ ok: true, run_id: runId, director, ...counts }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("admin-ai-directors fatal:", err);
    if (runId) {
      await admin
        .from("admin_ai_director_runs")
        .update({
          status: "failed",
          error: String(err).slice(0, 500),
          completed_at: new Date().toISOString(),
          latency_ms: Date.now() - t0,
        })
        .eq("id", runId);
    }
    return new Response(
      JSON.stringify({ ok: false, error: String(err).slice(0, 500) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
