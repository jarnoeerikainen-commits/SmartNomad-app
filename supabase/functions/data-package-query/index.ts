// Data Package Query Edge Function
// B2B endpoint: partners query packaged anonymous data products.
// Compliance: IAB Audience Taxonomy 1.1, IAB Data Transparency 1.2, LiveRamp clean-room patterns.
// Auth: SHA-256 API key (api_partners) + active subscription (data_package_subscriptions).
// Modes: catalog | field_catalog | segment_counts | query | export.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-api-key, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface QueryRequest {
  mode: 'catalog' | 'field_catalog' | 'segment_counts' | 'query' | 'export';
  package_slug?: string;
  fields?: string[];
  segments?: string[];          // segment_id list
  filters?: Record<string, string>;
  purpose?: string;
  limit?: number;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function applyTransform(value: unknown, transform: string, bucketStrategy: Record<string, unknown> | null): unknown {
  if (value === null || value === undefined) return null;
  switch (transform) {
    case 'suppressed':
      return null;
    case 'hashed': {
      // simple deterministic prefix hash for demo; a partner only needs a stable opaque id
      const s = String(value);
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
      return `h_${(h >>> 0).toString(16)}`;
    }
    case 'bucketed': {
      const buckets = (bucketStrategy?.buckets as string[] | undefined) ?? [];
      if (buckets.length === 0) return value;
      // value already a bucket label in our view? pass through
      return buckets.includes(String(value)) ? value : 'other';
    }
    case 'anonymized':
      return typeof value === 'string' ? value.replace(/[a-zA-Z0-9]/g, 'x') : value;
    case 'aggregated':
    case 'raw':
    default:
      return value;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const startedAt = Date.now();
  let partnerId: string | null = null;
  let responseStatus = 200;

  try {
    if (req.method !== 'POST') return jsonResponse({ error: 'method_not_allowed' }, 405);

    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) return jsonResponse({ error: 'missing_api_key' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // 1. Authenticate partner
    const keyHash = await sha256Hex(apiKey);
    const { data: partner } = await supabase
      .from('api_partners')
      .select('id, status, tier, expires_at, partner_name')
      .eq('api_key_hash', keyHash)
      .maybeSingle();

    if (!partner) return jsonResponse({ error: 'invalid_api_key' }, 401);
    if (partner.status !== 'active') return jsonResponse({ error: 'partner_inactive' }, 403);
    if (partner.expires_at && new Date(partner.expires_at) < new Date()) {
      return jsonResponse({ error: 'partner_expired' }, 403);
    }
    partnerId = partner.id;

    // 2. Parse body
    let body: QueryRequest;
    try { body = await req.json(); } catch { return jsonResponse({ error: 'invalid_json' }, 400); }
    if (!body.mode) return jsonResponse({ error: 'mode_required' }, 400);

    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;

    // 3. CATALOG: list active packages this partner can browse (no subscription needed)
    if (body.mode === 'catalog') {
      const { data: packages } = await supabase
        .from('data_packages')
        .select('slug,name,description,category,iab_taxonomy_id,iab_taxonomy_version,pricing_model,cpm_usd,flat_price_usd,monthly_subscription_usd,refresh_cadence,recency_days,source_type,min_k_anonymity,estimated_universe_size,cookie_free,legal_basis,provider_name,provider_domain')
        .eq('status', 'active');

      const { data: subs } = await supabase
        .from('data_package_subscriptions')
        .select('package_id,status,tier,expires_at,records_delivered,contracted_records,max_records_per_query')
        .eq('partner_id', partner.id);

      const subMap = new Map((subs ?? []).map((s) => [s.package_id, s]));
      const enriched = (packages ?? []).map((p) => ({
        ...p,
        subscription: subMap.get((p as { id?: string }).id ?? '') ?? null,
      }));

      return jsonResponse({
        partner: partner.partner_name,
        packages: enriched,
        count: enriched.length,
        latency_ms: Date.now() - startedAt,
      });
    }

    // All other modes need a package_slug + active subscription
    if (!body.package_slug) return jsonResponse({ error: 'package_slug_required' }, 400);

    const { data: access } = await supabase.rpc('check_package_access', {
      p_partner_id: partner.id,
      p_package_slug: body.package_slug,
    });

    if (!access || access.granted !== true) {
      // Audit the rejection
      const { data: pkg } = await supabase
        .from('data_packages').select('id').eq('slug', body.package_slug).maybeSingle();
      if (pkg) {
        await supabase.rpc('record_package_delivery', {
          p_partner_id: partner.id,
          p_package_id: pkg.id,
          p_subscription_id: null,
          p_job_type: body.mode,
          p_request_params: body as unknown as Record<string, unknown>,
          p_fields: body.fields ?? [],
          p_segments: body.segments ?? [],
          p_records: 0,
          p_k_passed: false,
          p_k_value: null,
          p_consent_verified: 0,
          p_cost: 0,
          p_cpm: null,
          p_status: 'rejected',
          p_rejection: access?.reason ?? 'access_denied',
          p_latency_ms: Date.now() - startedAt,
          p_ip: ipAddress,
        });
      }
      return jsonResponse({ error: 'access_denied', reason: access?.reason ?? 'unknown' }, 403);
    }

    const packageId = access.package_id as string;
    const subscriptionId = access.subscription_id as string;
    const minK = access.min_k_anonymity as number;
    const cpm = Number(access.cpm_rate ?? 0);
    const maxPerQuery = access.max_records_per_query as number;
    const remaining = access.remaining_records as number | null;

    // Load package field whitelist
    const { data: fieldRows } = await supabase
      .from('data_package_fields')
      .select('field_name,display_name,data_type,transform,bucket_strategy,is_identifier,is_partition_key,recency_days,description,position')
      .eq('package_id', packageId)
      .order('position', { ascending: true });

    const allowedFields = (fieldRows ?? []).map((f) => f.field_name);
    const fieldConfig = new Map((fieldRows ?? []).map((f) => [f.field_name, f]));

    // 4. FIELD_CATALOG: list fields exposed by this package
    if (body.mode === 'field_catalog') {
      await supabase.rpc('record_package_delivery', {
        p_partner_id: partner.id,
        p_package_id: packageId,
        p_subscription_id: subscriptionId,
        p_job_type: 'field_catalog',
        p_request_params: body as unknown as Record<string, unknown>,
        p_fields: allowedFields,
        p_segments: [],
        p_records: fieldRows?.length ?? 0,
        p_k_passed: true,
        p_k_value: null,
        p_consent_verified: 0,
        p_cost: 0,
        p_cpm: null,
        p_status: 'completed',
        p_rejection: null,
        p_latency_ms: Date.now() - startedAt,
        p_ip: ipAddress,
      });
      return jsonResponse({
        package_slug: body.package_slug,
        fields: fieldRows ?? [],
        count: fieldRows?.length ?? 0,
        latency_ms: Date.now() - startedAt,
      });
    }

    // 5. SEGMENT_COUNTS: bucket counts per segment from v_partner_profile_signals
    if (body.mode === 'segment_counts') {
      const { data: segments } = await supabase
        .from('data_package_segments')
        .select('segment_id,segment_name,parent_segment_id,tier,estimated_size,source_type,recency_days,match_rule')
        .eq('package_id', packageId)
        .eq('is_active', true);

      const wantedIds = new Set(body.segments ?? (segments ?? []).map((s) => s.segment_id));
      const out: Array<Record<string, unknown>> = [];
      let totalReturned = 0;

      for (const seg of segments ?? []) {
        if (!wantedIds.has(seg.segment_id)) continue;

        // Build a query against the partner-safe view using match_rule
        let q = supabase.from('v_partner_profile_signals').select('*', { count: 'exact', head: true });
        const rule = (seg.match_rule ?? {}) as Record<string, string>;
        for (const [k, v] of Object.entries(rule)) {
          if (typeof v === 'string') q = q.eq(k, v);
        }
        const { count } = await q;
        const c = count ?? 0;
        const passed = c >= minK;
        out.push({
          segment_id: seg.segment_id,
          segment_name: seg.segment_name,
          tier: seg.tier,
          source_type: seg.source_type,
          recency_days: seg.recency_days,
          count: passed ? c : null,
          k_anonymity_passed: passed,
          suppressed_reason: passed ? null : `count_below_k${minK}`,
        });
        if (passed) totalReturned += c;
      }

      const cost = (totalReturned / 1000) * cpm;
      await supabase.rpc('record_package_delivery', {
        p_partner_id: partner.id,
        p_package_id: packageId,
        p_subscription_id: subscriptionId,
        p_job_type: 'segment_counts',
        p_request_params: body as unknown as Record<string, unknown>,
        p_fields: [],
        p_segments: out.map((o) => o.segment_id as string),
        p_records: totalReturned,
        p_k_passed: true,
        p_k_value: minK,
        p_consent_verified: 0,
        p_cost: cost,
        p_cpm: cpm,
        p_status: 'completed',
        p_rejection: null,
        p_latency_ms: Date.now() - startedAt,
        p_ip: ipAddress,
      });

      return jsonResponse({
        package_slug: body.package_slug,
        segments: out,
        total_subjects_addressable: totalReturned,
        k_anonymity_threshold: minK,
        cost_usd: cost,
        cpm_used: cpm,
        latency_ms: Date.now() - startedAt,
      });
    }

    // 6. QUERY / EXPORT: per-row delivery of bucketed signals
    if (body.mode === 'query' || body.mode === 'export') {
      // Resolve effective field list (intersection of requested ∩ whitelist)
      const requested = body.fields && body.fields.length > 0 ? body.fields : allowedFields;
      const effective = requested.filter((f) => allowedFields.includes(f));
      if (effective.length === 0) return jsonResponse({ error: 'no_valid_fields' }, 400);

      const limit = Math.min(body.limit ?? 1000, maxPerQuery, remaining ?? Number.MAX_SAFE_INTEGER);
      if (limit <= 0) return jsonResponse({ error: 'volume_cap_reached' }, 403);

      // Always pull snomad_id for k-anon counting & dedupe
      const selectFields = Array.from(new Set(['snomad_id', ...effective])).join(',');
      let q = supabase.from('v_partner_profile_signals').select(selectFields, { count: 'exact' });

      if (body.filters) {
        for (const [k, v] of Object.entries(body.filters)) {
          if (allowedFields.includes(k) && typeof v === 'string') q = q.eq(k, v);
        }
      }
      q = q.limit(limit);

      const { data: rows, count } = await q;
      const total = count ?? 0;

      // k-anonymity gate at result-set level
      if (total < minK) {
        await supabase.rpc('record_package_delivery', {
          p_partner_id: partner.id,
          p_package_id: packageId,
          p_subscription_id: subscriptionId,
          p_job_type: body.mode,
          p_request_params: body as unknown as Record<string, unknown>,
          p_fields: effective,
          p_segments: [],
          p_records: 0,
          p_k_passed: false,
          p_k_value: total,
          p_consent_verified: 0,
          p_cost: 0,
          p_cpm: cpm,
          p_status: 'rejected',
          p_rejection: `k_anonymity_violation:${total}<${minK}`,
          p_latency_ms: Date.now() - startedAt,
          p_ip: ipAddress,
        });
        return jsonResponse({
          error: 'k_anonymity_violation',
          message: `Result set too small (k=${total}, required≥${minK}).`,
          k_anonymity_threshold: minK,
        }, 422);
      }

      // Apply per-field transforms
      const transformed = ((rows ?? []) as unknown as Record<string, unknown>[]).map((row) => {
        const out: Record<string, unknown> = {};
        for (const f of effective) {
          const cfg = fieldConfig.get(f);
          if (!cfg) continue;
          const raw = row[f];
          out[f] = applyTransform(raw, cfg.transform, cfg.bucket_strategy as Record<string, unknown> | null);
        }
        // include snomad_id only if explicitly whitelisted
        if (effective.includes('snomad_id')) {
          out.snomad_id = row.snomad_id;
        }
        return out;
      });

      const records = transformed.length;
      const cost = (records / 1000) * cpm;

      await supabase.rpc('record_package_delivery', {
        p_partner_id: partner.id,
        p_package_id: packageId,
        p_subscription_id: subscriptionId,
        p_job_type: body.mode,
        p_request_params: body as unknown as Record<string, unknown>,
        p_fields: effective,
        p_segments: [],
        p_records: records,
        p_k_passed: true,
        p_k_value: total,
        p_consent_verified: records,
        p_cost: cost,
        p_cpm: cpm,
        p_status: 'completed',
        p_rejection: null,
        p_latency_ms: Date.now() - startedAt,
        p_ip: ipAddress,
      });

      // Best-effort partner audit log
      await supabase.from('api_audit_logs').insert({
        partner_id: partner.id,
        endpoint: 'data-package-query',
        method: 'POST',
        response_status: 200,
        records_returned: records,
        latency_ms: Date.now() - startedAt,
        request_params: body as unknown as Record<string, unknown>,
        ip_address: ipAddress,
      });

      return jsonResponse({
        package_slug: body.package_slug,
        fields: effective,
        records,
        data: transformed,
        cost_usd: cost,
        cpm_used: cpm,
        k_anonymity_threshold: minK,
        latency_ms: Date.now() - startedAt,
      });
    }

    return jsonResponse({ error: 'unknown_mode' }, 400);
  } catch (e) {
    responseStatus = 500;
    const msg = (e as Error).message;
    if (partnerId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        );
        await supabase.from('api_audit_logs').insert({
          partner_id: partnerId,
          endpoint: 'data-package-query',
          method: 'POST',
          response_status: responseStatus,
          latency_ms: Date.now() - startedAt,
          error_message: msg,
        });
      } catch { /* swallow */ }
    }
    return jsonResponse({ error: 'internal_error', message: msg }, 500);
  }
});
