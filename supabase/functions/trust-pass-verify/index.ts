// trust-pass-verify — Partner-facing verification reuse endpoint.
//
// Tier-1 buyers (insurers, private banks, real-estate funds) call this to
// verify whether a SuperNomad user (identified only by snomad_id) meets a
// required Trust Pass tier — without seeing PII.
//
// Pricing model: $50–100 per successful verification (counted in api_audit_logs).
// Auth: SHA-256 hashed API key in `x-api-key` header (api_partners table).
// Consent: requires `trust_pass_verification` consent for this partner.
// Audit: every call logged to api_audit_logs + data_access_requests.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-api-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface VerifyRequest {
  snomad_id: string;
  required_tier: "human" | "nomad" | "sovereign";
  purpose: string; // e.g. "insurance_underwriting", "kyc_onboarding"
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function validate(body: unknown): { ok: true; data: VerifyRequest } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "body must be object" };
  const b = body as Record<string, unknown>;
  if (typeof b.snomad_id !== "string" || !/^SN-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(b.snomad_id)) {
    return { ok: false, error: "snomad_id must match SN-XXXX-XXXX-XXXX" };
  }
  if (!["human", "nomad", "sovereign"].includes(b.required_tier as string)) {
    return { ok: false, error: "required_tier must be human|nomad|sovereign" };
  }
  if (typeof b.purpose !== "string" || b.purpose.length < 3 || b.purpose.length > 200) {
    return { ok: false, error: "purpose required (3-200 chars)" };
  }
  return { ok: true, data: b as unknown as VerifyRequest };
}

Deno.serve(async (req: Request) => {
  const start = Date.now();
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method not allowed" }, 405);

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return jsonResponse({ error: "x-api-key header required" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // 1. Authenticate partner
  const keyHash = await sha256Hex(apiKey);
  const { data: partner } = await supabase
    .from("api_partners")
    .select("id, partner_name, status, expires_at, allowed_ips, rate_limit_per_minute")
    .eq("api_key_hash", keyHash)
    .maybeSingle();

  if (!partner) return jsonResponse({ error: "invalid api key" }, 401);
  const p = partner as { id: string; partner_name: string; status: string; expires_at: string | null; allowed_ips: string[] | null };
  if (p.status !== "active") return jsonResponse({ error: "partner inactive" }, 403);
  if (p.expires_at && new Date(p.expires_at) < new Date()) return jsonResponse({ error: "api key expired" }, 403);

  // 2. Parse + validate request
  let raw: unknown;
  try { raw = await req.json(); } catch { return jsonResponse({ error: "invalid json" }, 400); }
  const v = validate(raw);
  if (!v.ok) return jsonResponse({ error: v.error }, 400);
  const { snomad_id, required_tier, purpose } = v.data;

  // 3. Verify tier via consent-gated DB function
  const { data: result, error } = await supabase.rpc("verify_trust_tier", {
    p_snomad_id: snomad_id,
    p_required_tier: required_tier,
    p_partner_id: p.id,
  });

  const latencyMs = Date.now() - start;
  const responseBody = error
    ? { verified: false, reason: "internal_error", error: error.message }
    : result;

  // 4. Audit (always)
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  await supabase.from("api_audit_logs").insert({
    partner_id: p.id,
    endpoint: "trust-pass-verify",
    method: "POST",
    request_path: "/trust-pass-verify",
    request_params: { snomad_id, required_tier, purpose },
    response_status: error ? 500 : 200,
    error_message: error?.message ?? null,
    latency_ms: latencyMs,
    records_returned: 1,
    ip_address: ipAddress,
    user_agent: req.headers.get("user-agent"),
  });

  await supabase.from("data_access_requests").insert({
    partner_id: p.id,
    snomad_id,
    resource_type: "trust_pass_tier_verification",
    fields_requested: ["tier"],
    fields_returned: error ? [] : ["verified", "actual_tier", "credential_count"],
    consent_verified: !error && (responseBody as Record<string, unknown>)?.reason !== "no_consent",
    purpose,
    legal_basis: "consent (Art. 6.1.a GDPR)",
    records_count: 1,
    ip_address: ipAddress,
  });

  // 5. Update partner last-seen
  await supabase.from("api_partners")
    .update({ last_request_at: new Date().toISOString() })
    .eq("id", p.id);

  return jsonResponse({
    ...(responseBody as Record<string, unknown>),
    partner: p.partner_name,
    purpose,
    latency_ms: latencyMs,
  }, error ? 500 : 200);
});
