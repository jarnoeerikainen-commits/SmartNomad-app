import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const MODEL = "google/gemini-3-flash-preview";

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const DIRECTOR_ROUTES: Record<string, { director: string; preferredAgents: string[]; risk: string }> = {
  product: { director: "happiness", preferredAgents: ["ceo.product-inventor", "quality.concierge-auditor", "happiness.director"], risk: "medium" },
  cx: { director: "happiness", preferredAgents: ["quality.concierge-auditor", "happiness.director", "ceo.strategy-chief"], risk: "medium" },
  concierge: { director: "happiness", preferredAgents: ["quality.concierge-auditor", "happiness.director"], risk: "medium" },
  revenue: { director: "b2b_sales", preferredAgents: ["revenue.b2b-scout", "ceo.profit-architect", "affiliate.director"], risk: "high" },
  partner: { director: "b2b_sales", preferredAgents: ["revenue.b2b-scout", "ceo.strategy-chief"], risk: "high" },
  b2b: { director: "b2b_sales", preferredAgents: ["revenue.b2b-scout", "ceo.strategy-chief"], risk: "high" },
  pricing: { director: "pricing", preferredAgents: ["pricing.director", "finops.token-sentinel", "ceo.profit-architect"], risk: "critical" },
  margin: { director: "pricing", preferredAgents: ["finops.token-sentinel", "pricing.director", "ceo.profit-architect"], risk: "high" },
  cost: { director: "pricing", preferredAgents: ["finops.token-sentinel", "pricing.director"], risk: "high" },
  affiliate: { director: "affiliate", preferredAgents: ["affiliate.director", "revenue.b2b-scout"], risk: "high" },
  events: { director: "events", preferredAgents: ["events.director", "ceo.strategy-chief"], risk: "medium" },
  sports: { director: "sports", preferredAgents: ["sports.director", "events.director"], risk: "medium" },
  vip: { director: "vip", preferredAgents: ["vip.director", "ceo.strategy-chief"], risk: "high" },
  strategy: { director: "b2b_sales", preferredAgents: ["ceo.strategy-chief", "revenue.b2b-scout", "happiness.director"], risk: "high" },
  safety: { director: "happiness", preferredAgents: ["quality.concierge-auditor", "happiness.director"], risk: "high" },
};

function routeCeoOrder(rawCategory: unknown, title: unknown, action: unknown) {
  const haystack = `${rawCategory ?? ""} ${title ?? ""} ${action ?? ""}`.toLowerCase();
  const key = Object.keys(DIRECTOR_ROUTES).find((k) => haystack.includes(k)) ?? "strategy";
  return DIRECTOR_ROUTES[key];
}

async function dispatchCeoOrders(reportId: string, suggestions: any[], reportDate: string, userId: string) {
  if (!suggestions.length) return { director_orders_created: 0, agent_runs_queued: 0 };

  const { data: controls } = await admin
    .from("admin_ai_agent_controls")
    .select("agent_key,director,status")
    .in("agent_key", Array.from(new Set(Object.values(DIRECTOR_ROUTES).flatMap((r) => r.preferredAgents))));
  const available = new Set((controls ?? []).map((c: any) => c.agent_key));

  const directorRows = suggestions.map((s: any) => {
    const route = routeCeoOrder(s.category, s.title, s.suggested_action);
    const agentKey = route.preferredAgents.find((key) => available.has(key)) ?? "brain.governor";
    return {
      agent_key: agentKey,
      director: route.director,
      suggestion_type: "ceo_order",
      priority: String(s.priority ?? "medium").slice(0, 20),
      title: String(s.title ?? "CEO order").slice(0, 220),
      rationale: String(s.rationale ?? "Routed from AI CEO synthesis."),
      suggested_action: String(s.suggested_action ?? "Investigate and return a recommendation for admin approval."),
      expected_impact: s.expected_impact ? String(s.expected_impact) : null,
      risk_level: route.risk,
      requires_approval: true,
      status: "pending",
      source_report_id: reportId,
      evidence: {
        source: "admin-ai-ceo",
        report_id: reportId,
        report_date: reportDate,
        ceo_category: s.category ?? "strategy",
        confidence: Number.isFinite(Number(s.confidence)) ? Number(s.confidence) : 0.75,
        routed_to_director: route.director,
        routed_to_agent: agentKey,
        closed_loop: "ceo_to_director_to_agent_to_daily_report_to_ceo",
      },
    };
  });

  const { data: createdOrders } = await admin.from("admin_ai_agent_suggestions").insert(directorRows).select("id,agent_key,director,title,priority");
  const runRows = (createdOrders ?? []).map((o: any) => ({
    agent_key: o.agent_key,
    director: o.director,
    trigger: "ceo_order",
    status: "queued",
    scope: "ceo_directive",
    created_by: userId,
    signals_scanned: { source: "admin-ai-ceo", report_id: reportId, suggestion_id: o.id },
    outputs: {},
    suggested_improvements: [],
    metadata: { ceo_report_id: reportId, ceo_order_id: o.id, title: o.title, priority: o.priority, closed_loop: true },
  }));
  if (runRows.length) await admin.from("admin_ai_agent_runs").insert(runRows);

  return { director_orders_created: createdOrders?.length ?? 0, agent_runs_queued: runRows.length };
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return { ok: false, error: "auth_required" } as const;

  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user) return { ok: false, error: "invalid_auth" } as const;

  const { data: hasRole, error: roleError } = await admin.rpc("has_role", {
    _user_id: authData.user.id,
    _role: "admin",
  });
  if (roleError || !hasRole) return { ok: false, error: "admin_required" } as const;

  return { ok: true, userId: authData.user.id } as const;
}

async function gatherSignals() {
  const since = new Date(Date.now() - 24 * 3600_000).toISOString();
  const [platform, dailyBriefing, agentReports, conciergeDaily, brainReports, ceoControls, ceoPermissions, pendingSuggestions] = await Promise.all([
    admin.rpc("get_platform_stats" as never).then((r: any) => r?.data?.[0] ?? null).catch(() => null),
    admin.from("admin_ai_daily_briefings").select("title,executive_summary,highlights,concerns,director_rollup,pending_approvals,kpi_snapshot,created_at").order("briefing_date", { ascending: false }).limit(3),
    admin.from("admin_ai_agent_daily_reports").select("agent_key,title,summary,performance_score,suggestions,token_usage,estimated_cost_usd,report_date").gte("created_at", since).order("created_at", { ascending: false }).limit(30),
    admin.from("admin_concierge_performance_daily").select("segment,total_sessions,conversion_events,avg_quality_score,escalation_rate,token_usage,estimated_cost_usd,revenue_signal_usd,report_date").order("report_date", { ascending: false }).limit(10),
    admin.from("admin_ai_reports").select("title,executive_summary,highlights,concerns,kpi_snapshot,created_at").order("created_at", { ascending: false }).limit(3),
    admin.from("admin_ai_agent_controls").select("agent_key,display_name,status,automation_level,model_tier,daily_token_budget,daily_run_limit,last_run_status").like("agent_key", "ceo.%").order("agent_key"),
    admin.from("admin_ai_ceo_permissions").select("permission_key,title,decision_area,status,risk_level,requires_master_password,max_daily_actions,can_affect_user_surfaces,can_affect_pricing,can_affect_costs").order("decision_area"),
    admin.from("admin_ai_ceo_suggestions").select("category,priority,title,status,expected_impact,created_at").eq("status", "pending").order("created_at", { ascending: false }).limit(20),
  ]);

  return {
    since,
    platform,
    daily_briefings: dailyBriefing.data ?? [],
    agent_reports: agentReports.data ?? [],
    concierge_daily: conciergeDaily.data ?? [],
    brain_reports: brainReports.data ?? [],
    ceo_controls: ceoControls.data ?? [],
    ceo_permissions: ceoPermissions.data ?? [],
    pending_ceo_suggestions: pendingSuggestions.data ?? [],
  };
}

function fallbackReport(signals: Record<string, unknown>) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: `AI CEO Daily Report — ${today}`,
    executive_summary: "AI CEO control plane is ready in recommendation-only mode. The safest next step is to use daily director and concierge reports to propose product, CX and margin actions that require explicit human approval.",
    narrative: "The AI CEO should operate as a board-level synthesis layer, not an autonomous ruler. It reads aggregated daily reports, finds cross-team patterns, and turns them into permission-gated suggestions. In production, any action affecting users, pricing, costs, data, partners or concierge behavior remains locked behind admin approval and the real master-password flow.",
    business_health: { mode: "recommend_only", platform: (signals as any).platform ?? {}, posture: "safe_to_review" },
    customer_experience: { focus: "increase useful time in ecosystem", priorities: ["concierge quality", "journey friction", "retention triggers"] },
    revenue_opportunities: ["Package repeated concierge demand into premium trip and relocation products", "Use Token Sentinel reports to reduce AI cost before scaling automation", "Promote B2B data packages only where consent and k-anonymity checks pass"],
    product_opportunities: ["CEO Product Inventor should convert repeated expat, nomad and business traveller requests into scoped product experiments", "Add weekly bundles for high-value cities and business events"],
    risk_register: ["Never auto-change pricing or user-facing concierge behavior without human approval", "Do not train on raw private user data; distill aggregate lessons only"],
    learning_updates: ["Learn from daily outcomes through aggregate reports, approval decisions and performance scores"],
  };
}

async function synthesize(signals: Record<string, unknown>) {
  if (!LOVABLE_API_KEY) return fallbackReport(signals);

  const systemPrompt = `You are SuperNomad's AI CEO: a sober, evidence-first executive operator for a global ecosystem serving business travellers, expats, nomads, HNW users and everyday travellers. Your job is to synthesize daily reports from Concierge AI, back-office directors, AI Brain, agent council and platform KPIs. You must improve user time-in-ecosystem, customer experience, profit, product strategy and risk posture. Never pretend actions are executed. Every material decision requires human approval and master-password permission in production.`;
  const userPrompt = `Create today's AI CEO report from these signals. Be specific, concise and commercially sharp. Suggest what to do, what not to do, and what to learn next. Raw signals:\n${JSON.stringify(signals, null, 2)}`;

  const tools = [{
    type: "function",
    function: {
      name: "deliver_ceo_report",
      description: "Return the structured AI CEO report.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          executive_summary: { type: "string" },
          narrative: { type: "string" },
          business_health: { type: "object" },
          customer_experience: { type: "object" },
          revenue_opportunities: { type: "array", items: { type: "string" } },
          product_opportunities: { type: "array", items: { type: "string" } },
          risk_register: { type: "array", items: { type: "string" } },
          learning_updates: { type: "array", items: { type: "string" } },
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: { type: "string" },
                priority: { type: "string", enum: ["urgent", "high", "medium", "low"] },
                title: { type: "string" },
                rationale: { type: "string" },
                suggested_action: { type: "string" },
                expected_impact: { type: "string" },
                confidence: { type: "number" }
              },
              required: ["category", "priority", "title", "rationale", "suggested_action", "expected_impact", "confidence"]
            }
          }
        },
        required: ["title", "executive_summary", "narrative", "business_health", "customer_experience", "revenue_opportunities", "product_opportunities", "risk_register", "learning_updates", "suggestions"]
      }
    }
  }];

  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      tools,
      tool_choice: { type: "function", function: { name: "deliver_ceo_report" } },
      max_tokens: 4096,
    }),
  });

  if (!resp.ok) return fallbackReport(signals);
  const data = await resp.json();
  const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) return fallbackReport(signals);
  return JSON.parse(args);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) return json({ ok: false, error: auth.error }, auth.error === "auth_required" ? 401 : 403);

    const body = await req.json().catch(() => ({}));
    const trigger = typeof body.trigger === "string" ? body.trigger : "manual";
    const signals = await gatherSignals();
    const report = await synthesize(signals);
    const today = new Date().toISOString().slice(0, 10);

    const { data: saved, error: reportError } = await admin.from("admin_ai_ceo_reports").upsert({
      report_date: today,
      title: report.title,
      executive_summary: report.executive_summary,
      narrative: report.narrative,
      business_health: report.business_health ?? {},
      customer_experience: report.customer_experience ?? {},
      revenue_opportunities: report.revenue_opportunities ?? [],
      product_opportunities: report.product_opportunities ?? [],
      risk_register: report.risk_register ?? [],
      learning_updates: report.learning_updates ?? [],
      source_rollups: signals,
      metadata: { trigger, model: MODEL, generated_by: auth.userId },
    }, { onConflict: "report_date" }).select("id").single();

    if (reportError) throw reportError;

    const suggestions = Array.isArray(report.suggestions) ? report.suggestions.slice(0, 12) : [];
    if (suggestions.length) {
      await admin.from("admin_ai_ceo_suggestions").insert(suggestions.map((s: any) => ({
        source_report_id: saved.id,
        category: String(s.category ?? "strategy").slice(0, 80),
        priority: String(s.priority ?? "medium").slice(0, 20),
        title: String(s.title ?? "CEO suggestion").slice(0, 220),
        rationale: String(s.rationale ?? "Derived from daily AI CEO report."),
        suggested_action: String(s.suggested_action ?? "Review with human admin."),
        expected_impact: s.expected_impact ? String(s.expected_impact) : null,
        confidence: Number.isFinite(Number(s.confidence)) ? Number(s.confidence) : 0.75,
        evidence: { source: "admin-ai-ceo", report_date: today },
      })));
    }

    return json({ ok: true, report_id: saved.id, suggestions_created: suggestions.length, report_date: today });
  } catch (err) {
    console.error("admin-ai-ceo fatal:", err);
    return json({ ok: false, error: String(err).slice(0, 500) }, 500);
  }
});
