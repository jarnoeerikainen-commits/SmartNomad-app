const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

type AuditStatus = "running" | "completed" | "failed";
type ConfidenceStatus = "verified" | "partially_verified" | "unverified" | "failed" | "escalated";
type ApprovalState = "not_required" | "pending" | "approved" | "denied" | "expired";

export type AIAuditContext = {
  functionName: string;
  surface: string;
  route: string;
  primaryAgent: string;
  requestCategory: string;
  command: string;
  userAlias?: string;
  persona?: string;
  toolsActions?: unknown[];
  dataSources?: unknown[];
  sources?: unknown[];
  confidenceStatus?: ConfidenceStatus;
  verificationNote?: string;
  humanApprovalState?: ApprovalState;
  humanApprovalActor?: string;
  humanApprovalAt?: string;
  escalationType?: string;
  escalationReason?: string;
};

export type AIGatewayRequest = {
  model: string;
  messages: Array<{ role: string; content: string }>;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  reasoning?: { effort: string };
};

function text(value: unknown, max = 1800): string {
  return String(value || "").trim().slice(0, max);
}

function estimateTokens(value: unknown): number {
  return Math.max(1, Math.ceil(JSON.stringify(value || "").length / 4));
}

function extractOutput(data: unknown): string {
  const anyData = data as any;
  return text(anyData?.choices?.[0]?.message?.content || anyData?.response || "", 1600);
}

function createRunRef(functionName: string): string {
  return `${functionName}_${crypto.randomUUID()}`;
}

async function writeProof(runRef: string, ctx: AIAuditContext, req: AIGatewayRequest, status: AuditStatus, extra: Record<string, unknown> = {}) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !SERVICE_KEY) return;

  await fetch(`${SUPABASE_URL}/functions/v1/ai-execution-proof`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      run_ref: runRef,
      surface: ctx.surface,
      persona: ctx.persona || "Guest / Live user",
      user_alias: ctx.userAlias || "live_user_session",
      command: ctx.command,
      primary_agent: ctx.primaryAgent,
      function_name: ctx.functionName,
      request_category: ctx.requestCategory,
      status,
      route: ctx.route,
      model: req.model,
      input_tokens: estimateTokens(req.messages),
      tools_actions: ctx.toolsActions || [],
      data_sources: ctx.dataSources || ctx.sources || [],
      sources: ctx.sources || ctx.dataSources || [],
      confidence_status: status === "failed" ? "failed" : (ctx.confidenceStatus || "partially_verified"),
      verification_note: ctx.verificationNote || "Central AI audit wrapper recorded this inference.",
      human_approval_state: ctx.humanApprovalState || "not_required",
      human_approval_actor: ctx.humanApprovalActor,
      human_approval_at: ctx.humanApprovalAt,
      escalation_type: ctx.escalationType,
      escalation_reason: ctx.escalationReason,
      ...extra,
    }),
  }).catch((error) => console.error("ai_audit_write_failed", error));
}

export async function auditedAIGatewayJSON(ctx: AIAuditContext, req: AIGatewayRequest): Promise<{ data: any; response: Response; runRef: string }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("Service configuration error");

  const runRef = createRunRef(ctx.functionName);
  const started = Date.now();
  await writeProof(runRef, ctx, req, "running");

  const response = await fetch(AI_GATEWAY_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const errorText = await response.text();
    await writeProof(runRef, ctx, req, "failed", {
      latency_ms: Date.now() - started,
      error: `AI gateway ${response.status}: ${errorText.slice(0, 700)}`,
      escalation_type: ctx.escalationType || "service_error",
      escalation_reason: ctx.escalationReason || "AI gateway call failed",
    });
    return { data: null, response: new Response(errorText, { status: response.status, headers: response.headers }), runRef };
  }

  const data = await response.json();
  const output = extractOutput(data);
  await writeProof(runRef, ctx, req, "completed", {
    latency_ms: Date.now() - started,
    output_tokens: estimateTokens(output),
    response_excerpt: output,
  });

  return { data, response, runRef };
}

export async function auditedAIGatewayStream(ctx: AIAuditContext, req: AIGatewayRequest): Promise<{ response: Response; runRef: string }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("Service configuration error");

  const runRef = createRunRef(ctx.functionName);
  const started = Date.now();
  await writeProof(runRef, ctx, req, "running");

  const response = await fetch(AI_GATEWAY_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ...req, stream: true }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    await writeProof(runRef, ctx, req, "failed", {
      latency_ms: Date.now() - started,
      error: `AI gateway ${response.status}: ${errorText.slice(0, 700)}`,
      escalation_type: ctx.escalationType || "service_error",
      escalation_reason: ctx.escalationReason || "Streaming AI gateway call failed",
    });
    return { response: new Response(errorText, { status: response.status, headers: response.headers }), runRef };
  }

  await writeProof(runRef, ctx, req, "completed", {
    latency_ms: Date.now() - started,
    response_excerpt: "Streaming response delivered to user; content captured by conversation history.",
  });

  return { response, runRef };
}