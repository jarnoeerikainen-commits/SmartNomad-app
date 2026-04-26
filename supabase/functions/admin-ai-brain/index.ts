// ═══════════════════════════════════════════════════════════════════════════
// ADMIN AI BRAIN — 24/7 Intelligence Engine for SuperNomad Back Office
// Scans usage, tickets, orders, concierge quality and produces:
//   • Insights (anomalies, patterns, opportunities, risk)
//   • Recommendations (new orders, concierge tweaks, churn saves, …)
//   • Reports (executive rollups for any timeframe)
// Uses Lovable AI Gateway (google/gemini-3-flash-preview) for synthesis.
// ═══════════════════════════════════════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { withTruthProtocol } from "../_shared/antiHallucination.ts";

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

// ─── Signal collection ────────────────────────────────────────────────────
async function gatherSignals(windowHours: number) {
  const since = new Date(Date.now() - windowHours * 3600_000).toISOString();
  const since30d = new Date(Date.now() - 30 * 86400_000).toISOString();

  const [usage, tickets, txns, deliveries, earnings, conversations, partners] =
    await Promise.all([
      admin
        .from("ai_usage_logs")
        .select("function_name,model,input_tokens,output_tokens,latency_ms,cache_hit,error,created_at,user_id")
        .gte("created_at", since)
        .limit(2000),
      admin
        .from("support_tickets")
        .select("id,priority,status,category,created_at,resolved_at,subject")
        .gte("created_at", since30d)
        .limit(500),
      admin
        .from("agentic_transactions")
        .select("amount,currency,category,status,ai_initiated,settled_at")
        .gte("settled_at", since30d)
        .limit(500),
      admin
        .from("package_delivery_jobs")
        .select("cost_usd,records_delivered,status,created_at,partner_id")
        .gte("created_at", since30d)
        .limit(500),
      admin
        .from("affiliate_earnings")
        .select("commission_amount,status,created_at,level")
        .gte("created_at", since30d)
        .limit(500),
      admin
        .from("conversations")
        .select("id,message_count,updated_at")
        .gte("updated_at", since)
        .limit(500),
      admin.from("api_partners").select("id,partner_name,status,tier,last_request_at").limit(50),
    ]);

  // Aggregate
  const usageRows = usage.data ?? [];
  const ticketsRows = tickets.data ?? [];
  const txnRows = txns.data ?? [];
  const deliveryRows = deliveries.data ?? [];
  const earningsRows = earnings.data ?? [];
  const convRows = conversations.data ?? [];
  const partnerRows = partners.data ?? [];

  const aiByFn: Record<string, { calls: number; tokens: number; errors: number; avgLatency: number }> = {};
  for (const r of usageRows) {
    const k = (r.function_name as string) ?? "unknown";
    if (!aiByFn[k]) aiByFn[k] = { calls: 0, tokens: 0, errors: 0, avgLatency: 0 };
    aiByFn[k].calls += 1;
    aiByFn[k].tokens += (r.input_tokens ?? 0) + (r.output_tokens ?? 0);
    if (r.error) aiByFn[k].errors += 1;
    aiByFn[k].avgLatency += r.latency_ms ?? 0;
  }
  for (const k of Object.keys(aiByFn)) {
    aiByFn[k].avgLatency = Math.round(aiByFn[k].avgLatency / Math.max(1, aiByFn[k].calls));
  }

  const ticketsByPriority = ticketsRows.reduce<Record<string, number>>((a, t) => {
    a[t.priority as string] = (a[t.priority as string] ?? 0) + 1;
    return a;
  }, {});
  const openUrgent = ticketsRows.filter((t) => t.priority === "urgent" && t.status !== "resolved").length;

  const txnTotal = txnRows.reduce((s, t) => s + Number(t.amount ?? 0), 0);
  const deliveryRev = deliveryRows
    .filter((d) => d.status === "completed")
    .reduce((s, d) => s + Number(d.cost_usd ?? 0), 0);
  const affiliateOut = earningsRows.reduce((s, e) => s + Number(e.commission_amount ?? 0), 0);

  const avgConvLen = convRows.length
    ? Math.round(convRows.reduce((s, c) => s + (c.message_count ?? 0), 0) / convRows.length)
    : 0;

  return {
    window_hours: windowHours,
    ai: {
      total_calls: usageRows.length,
      total_tokens: Object.values(aiByFn).reduce((s, x) => s + x.tokens, 0),
      error_rate:
        usageRows.length > 0
          ? Number((usageRows.filter((r) => r.error).length / usageRows.length).toFixed(3))
          : 0,
      by_function: aiByFn,
    },
    support: {
      total_24h_to_30d: ticketsRows.length,
      open_urgent: openUrgent,
      by_priority: ticketsByPriority,
    },
    revenue: {
      agentic_volume_30d: Number(txnTotal.toFixed(2)),
      b2b_data_30d: Number(deliveryRev.toFixed(2)),
      affiliate_payouts_30d: Number(affiliateOut.toFixed(2)),
    },
    concierge: {
      active_conversations_window: convRows.length,
      avg_messages_per_conv: avgConvLen,
    },
    partners: {
      total: partnerRows.length,
      active: partnerRows.filter((p) => p.status === "active").length,
    },
  };
}

// ─── AI synthesis (structured output via tool calling) ────────────────────
async function synthesizeWithAI(signals: Record<string, unknown>, scope: string) {
  const systemPrompt = withTruthProtocol(`You are the SuperNomad Back Office AI Brain. You analyse platform telemetry and produce
crisp, actionable intelligence for human admins of a premium nomad lifestyle platform.

Tone: confident, precise, executive. Avoid filler. Prefer numbers over adjectives.
Always ground claims in the supplied evidence.`);

  const userPrompt = `Analyse the following ${scope} telemetry snapshot and return:
1. 4–6 INSIGHTS (anomalies, patterns, opportunities, risk, behavior, churn signals, growth)
2. 3–5 RECOMMENDATIONS for admins (new orders to launch, concierge tweaks, user nurturing, churn saves, pricing or feature changes)
3. ONE executive REPORT with title, 2-sentence summary, longer narrative, 3 highlights, 2 concerns

Telemetry:
${JSON.stringify(signals, null, 2)}`;

  const tools = [
    {
      type: "function",
      function: {
        name: "deliver_brain_output",
        description: "Return structured insights, recommendations and a report.",
        parameters: {
          type: "object",
          properties: {
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: {
                    type: "string",
                    enum: [
                      "anomaly",
                      "pattern",
                      "opportunity",
                      "risk",
                      "behavior",
                      "revenue",
                      "engagement",
                      "concierge_quality",
                      "churn_signal",
                      "growth",
                    ],
                  },
                  severity: { type: "string", enum: ["info", "low", "medium", "high", "critical"] },
                  confidence: { type: "number" },
                  title: { type: "string" },
                  summary: { type: "string" },
                  affected_count: { type: "number" },
                  evidence_note: { type: "string" },
                },
                required: ["category", "severity", "confidence", "title", "summary"],
              },
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  kind: {
                    type: "string",
                    enum: [
                      "new_order",
                      "concierge_tweak",
                      "user_nurture",
                      "churn_save",
                      "pricing_change",
                      "feature_promote",
                      "content_publish",
                      "staff_action",
                      "cost_optimization",
                    ],
                  },
                  priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
                  confidence: { type: "number" },
                  title: { type: "string" },
                  rationale: { type: "string" },
                  suggested_action: { type: "string" },
                  expected_impact: { type: "string" },
                },
                required: ["kind", "priority", "confidence", "title", "rationale", "suggested_action"],
              },
            },
            report: {
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
          required: ["insights", "recommendations", "report"],
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
      tool_choice: { type: "function", function: { name: "deliver_brain_output" } },
    }),
  });
  const latency = Date.now() - t0;

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`AI gateway ${resp.status}: ${txt.slice(0, 300)}`);
  }
  const data = await resp.json();
  const call = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) throw new Error("No tool call returned by model");
  const parsed = JSON.parse(call.function.arguments);
  const usage = data?.usage ?? {};

  return {
    parsed,
    latency,
    input_tokens: usage.prompt_tokens ?? 0,
    output_tokens: usage.completion_tokens ?? 0,
  };
}

// ─── Persist results ──────────────────────────────────────────────────────
async function persistOutputs(
  runId: string,
  out: any,
  signals: Record<string, unknown>,
  scope: string,
  windowHours: number,
) {
  // Insights
  const insightRows = (out.insights ?? []).map((i: any) => ({
    category: i.category,
    severity: i.severity,
    confidence: Math.min(1, Math.max(0, Number(i.confidence ?? 0.7))),
    title: i.title,
    summary: i.summary,
    affected_count: i.affected_count ?? 0,
    evidence: { note: i.evidence_note ?? null, signals_excerpt: signals },
    metric_snapshot: signals,
    source_run_id: runId,
    expires_at: new Date(Date.now() + 14 * 86400_000).toISOString(),
  }));

  let insertedInsights: any[] = [];
  if (insightRows.length) {
    const { data } = await admin
      .from("admin_ai_insights")
      .insert(insightRows)
      .select("id,title");
    insertedInsights = data ?? [];
  }

  // Recommendations (link the first insight as a generic source)
  const sourceInsightId = insertedInsights[0]?.id ?? null;
  const recRows = (out.recommendations ?? []).map((r: any) => ({
    kind: r.kind,
    priority: r.priority,
    confidence: Math.min(1, Math.max(0, Number(r.confidence ?? 0.7))),
    title: r.title,
    rationale: r.rationale,
    suggested_action: r.suggested_action,
    expected_impact: r.expected_impact ?? null,
    target_segment: r.target_segment ?? {},
    evidence: { signals_excerpt: signals },
    source_insight_id: sourceInsightId,
    source_run_id: runId,
    expires_at: new Date(Date.now() + 14 * 86400_000).toISOString(),
  }));
  let insertedRecs: any[] = [];
  if (recRows.length) {
    const { data } = await admin
      .from("admin_ai_recommendations")
      .insert(recRows)
      .select("id");
    insertedRecs = data ?? [];
  }

  // Report
  const periodEnd = new Date();
  const periodStart = new Date(Date.now() - windowHours * 3600_000);
  const r = out.report ?? {};
  const { data: reportData } = await admin
    .from("admin_ai_reports")
    .insert({
      timeframe: scope === "quick" ? "hourly" : windowHours <= 24 ? "daily" : windowHours <= 168 ? "weekly" : "monthly",
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      title: r.title ?? "Back Office Intelligence Report",
      executive_summary: r.executive_summary ?? "",
      narrative: r.narrative ?? "",
      kpi_snapshot: signals,
      highlights: r.highlights ?? [],
      concerns: r.concerns ?? [],
      metadata: { scope, window_hours: windowHours },
      generated_by_run_id: runId,
    })
    .select("id")
    .single();

  return {
    insights_created: insertedInsights.length,
    recommendations_created: insertedRecs.length,
    reports_created: reportData ? 1 : 0,
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  let runId: string | null = null;
  const t0 = Date.now();

  try {
    const body = await req.json().catch(() => ({}));
    const trigger = body.trigger ?? "manual";
    const scope = body.scope ?? "full"; // full | quick | focused
    const windowHours = scope === "quick" ? 6 : scope === "focused" ? 24 : 168;

    // 1. Open a run row
    const { data: runRow } = await admin
      .from("admin_ai_brain_runs")
      .insert({ trigger, status: "running", scope, model: MODEL })
      .select("id")
      .single();
    runId = runRow!.id;

    // 2. Gather signals
    const signals = await gatherSignals(windowHours);

    // 3. Synthesise with AI
    let aiOut;
    try {
      aiOut = await synthesizeWithAI(signals, scope);
    } catch (aiErr) {
      // AI failed — close run, return 200 with structured failure
      await admin
        .from("admin_ai_brain_runs")
        .update({
          status: "failed",
          error: String(aiErr).slice(0, 500),
          completed_at: new Date().toISOString(),
          latency_ms: Date.now() - t0,
          signals_scanned: signals,
        })
        .eq("id", runId);
      return new Response(
        JSON.stringify({ ok: false, run_id: runId, error: String(aiErr).slice(0, 500) }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 4. Persist
    const counts = await persistOutputs(runId, aiOut.parsed, signals, scope, windowHours);

    // 5. Close run
    await admin
      .from("admin_ai_brain_runs")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        latency_ms: aiOut.latency,
        input_tokens: aiOut.input_tokens,
        output_tokens: aiOut.output_tokens,
        signals_scanned: signals,
        insights_created: counts.insights_created,
        recommendations_created: counts.recommendations_created,
        reports_created: counts.reports_created,
      })
      .eq("id", runId);

    return new Response(
      JSON.stringify({
        ok: true,
        run_id: runId,
        scope,
        window_hours: windowHours,
        ...counts,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("admin-ai-brain fatal:", err);
    if (runId) {
      await admin
        .from("admin_ai_brain_runs")
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
