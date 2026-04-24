// ═══════════════════════════════════════════════════════════════════
// ADMIN DAILY BRIEFING — once-per-day executive rollup
//
// Aggregates the last 24 hours of work from ALL 10 AI Directors and the
// AI Brain into a single human-readable report. Synthesises:
//   • What each director did (runs, opportunities, sponsor packages)
//   • Cross-director themes (e.g. "F1 + Sponsorship + Aviation align this week")
//   • Top-15 items pending human approval
//   • Highlights, concerns, KPI snapshot
//
// Persisted in admin_ai_daily_briefings (one row per date — upsert semantics).
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

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const ALL_DIRECTORS = [
  "events", "sports", "vip",
  "affiliate", "loyalty", "sponsorship",
  "b2b_sales", "pricing", "aviation", "happiness",
];

async function gather24h() {
  const since = new Date(Date.now() - 24 * 3600_000).toISOString();

  const [runs, opps, recs, brainRuns, kpi] = await Promise.all([
    admin.from("admin_ai_director_runs")
      .select("director,status,opportunities_created,sponsor_packages_created,pushed_recommendations,input_tokens,output_tokens,latency_ms,started_at")
      .gte("started_at", since).limit(500),
    admin.from("admin_ai_opportunities")
      .select("id,director,category,title,city,country,start_at,popularity_score,exclusivity_score,sponsor_packages,vip_packages,requires_approval,approved_at,rejected_at,created_at")
      .gte("created_at", since).limit(500),
    admin.from("admin_ai_recommendations")
      .select("id,kind,priority,title,status,requires_approval,created_at")
      .gte("created_at", since).limit(300),
    admin.from("admin_ai_brain_runs")
      .select("id,status,scope,insights_created,recommendations_created,started_at")
      .gte("started_at", since).limit(50),
    admin.rpc("get_platform_stats" as any).then((r: any) => r?.data?.[0] ?? null).catch(() => null),
  ]);

  const runsRows = runs.data ?? [];
  const oppsRows = opps.data ?? [];
  const recsRows = recs.data ?? [];

  // Per-director rollup
  const perDirector: Record<string, any> = {};
  for (const d of ALL_DIRECTORS) {
    const dRuns = runsRows.filter((r) => r.director === d);
    const dOpps = oppsRows.filter((o) => o.director === d);
    perDirector[d] = {
      runs: dRuns.length,
      successful_runs: dRuns.filter((r) => r.status === "completed").length,
      opportunities_24h: dOpps.length,
      sponsor_packages_24h: dOpps.reduce(
        (s, o: any) => s + (Array.isArray(o.sponsor_packages) ? o.sponsor_packages.length : 0), 0,
      ),
      pending_approval: dOpps.filter((o: any) => o.requires_approval && !o.approved_at && !o.rejected_at).length,
      tokens_used: dRuns.reduce((s, r: any) => s + (r.input_tokens ?? 0) + (r.output_tokens ?? 0), 0),
      avg_latency_ms: dRuns.length
        ? Math.round(dRuns.reduce((s, r: any) => s + (r.latency_ms ?? 0), 0) / dRuns.length) : 0,
    };
  }

  // Top items pending approval (highest combined score)
  const pending = oppsRows
    .filter((o: any) => o.requires_approval && !o.approved_at && !o.rejected_at)
    .sort((a: any, b: any) =>
      ((b.popularity_score ?? 0) + (b.exclusivity_score ?? 0)) -
      ((a.popularity_score ?? 0) + (a.exclusivity_score ?? 0)))
    .slice(0, 15)
    .map((o: any) => ({
      id: o.id, director: o.director, category: o.category, title: o.title,
      city: o.city, country: o.country, start_at: o.start_at,
      popularity: o.popularity_score, exclusivity: o.exclusivity_score,
    }));

  return {
    since,
    per_director: perDirector,
    totals: {
      runs: runsRows.length,
      opportunities: oppsRows.length,
      recommendations: recsRows.length,
      pending_approval: pending.length,
      brain_runs: (brainRuns.data ?? []).length,
    },
    pending,
    kpi: kpi ?? {},
  };
}

async function synthesize(signals: Record<string, unknown>) {
  const systemPrompt = `You are the SuperNomad Back Office Chief of Staff. Once per day you write a short, executive briefing for human admins, summarising what the 10 AI Directors and the AI Brain did in the last 24 hours.

Tone: confident, concise, board-room. Reference the numbers — never hand-wave. Always end every recommendation with the words "(awaiting human approval)" because the platform requires explicit human sign-off before any director output is pushed live.`;

  const userPrompt = `Compose today's daily briefing. Here is the raw 24h telemetry:

${JSON.stringify(signals, null, 2)}

Return a structured briefing with:
  • title (one sharp line, e.g. "Daily Briefing — 24 Apr 2026 — F1 Monaco week ramps up")
  • executive_summary (2 sentences)
  • narrative (3 paragraphs — what happened, why it matters, what to act on)
  • highlights (5-7 bullet wins)
  • concerns (3-5 bullet risks / blockers)`;

  const tools = [{
    type: "function",
    function: {
      name: "deliver_briefing",
      description: "Return the structured daily briefing.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          executive_summary: { type: "string" },
          narrative: { type: "string" },
          highlights: { type: "array", items: { type: "string" } },
          concerns: { type: "array", items: { type: "string" } },
        },
        required: ["title", "executive_summary", "narrative", "highlights", "concerns"],
      },
    },
  }];

  const t0 = Date.now();
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools,
      tool_choice: { type: "function", function: { name: "deliver_briefing" } },
    }),
  });
  const latency = Date.now() - t0;

  if (!resp.ok) {
    const txt = await resp.text();
    if (resp.status === 429) throw new Error("Rate limit");
    if (resp.status === 402) throw new Error("AI credits exhausted");
    throw new Error(`AI gateway ${resp.status}: ${txt.slice(0, 300)}`);
  }
  const data = await resp.json();
  const call = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) throw new Error("No tool call returned by model");

  return {
    parsed: JSON.parse(call.function.arguments),
    latency,
    input_tokens: data?.usage?.prompt_tokens ?? 0,
    output_tokens: data?.usage?.completion_tokens ?? 0,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const trigger = body.trigger ?? "manual";

    const signals = await gather24h();

    let aiOut;
    try {
      aiOut = await synthesize(signals);
    } catch (aiErr) {
      // Persist a minimal briefing even if AI fails so admins still see numbers
      const today = new Date().toISOString().slice(0, 10);
      await admin.from("admin_ai_daily_briefings")
        .upsert({
          briefing_date: today,
          title: `Daily Briefing — ${today} (numbers only — AI synthesis failed)`,
          executive_summary: `Telemetry collected. AI synthesis error: ${String(aiErr).slice(0, 200)}`,
          narrative: null,
          highlights: [],
          concerns: [`AI synthesis failed: ${String(aiErr).slice(0, 150)}`],
          director_rollup: signals.per_director,
          pending_approvals: signals.pending,
          kpi_snapshot: signals.kpi,
          metadata: { trigger, fallback: true },
        }, { onConflict: "briefing_date" });
      return new Response(
        JSON.stringify({ ok: false, fallback: true, error: String(aiErr).slice(0, 300) }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const { data: row, error } = await admin
      .from("admin_ai_daily_briefings")
      .upsert({
        briefing_date: today,
        title: aiOut.parsed.title,
        executive_summary: aiOut.parsed.executive_summary,
        narrative: aiOut.parsed.narrative,
        highlights: aiOut.parsed.highlights,
        concerns: aiOut.parsed.concerns,
        director_rollup: signals.per_director,
        pending_approvals: signals.pending,
        kpi_snapshot: signals.kpi,
        metadata: {
          trigger, model: MODEL,
          latency_ms: aiOut.latency,
          input_tokens: aiOut.input_tokens,
          output_tokens: aiOut.output_tokens,
          totals: signals.totals,
        },
      }, { onConflict: "briefing_date" })
      .select("id")
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        ok: true, briefing_id: row.id, briefing_date: today,
        totals: signals.totals,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("admin-daily-briefing fatal:", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err).slice(0, 500) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
