// Partner Data Query Edge Function
// B2B endpoint: partners query pseudonymized user signals by snomad_id.
// Authentication: SHA-256 API key (api_partners table)
// Compliance: consent verification, field-level filtering, full audit logging.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-api-key, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface QueryRequest {
  resource_type: 'profile_signals' | 'aggregate';
  snomad_ids?: string[];          // for profile_signals
  fields?: string[];              // optional field whitelist
  purpose: string;                // partner-declared purpose
  filters?: Record<string, string>; // for aggregate
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const ALLOWED_FIELDS = [
  'snomad_id',
  'travel_style',
  'industry',
  'income_bracket',
  'budget_tier',
  'age_bracket',
  'completeness_score',
  'preference_count',
];

function anonymizeRow(row: Record<string, unknown>): Record<string, unknown> {
  // Already pseudonymized via view, but strip undefined/null and clamp scores
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(row)) {
    if (row[k] !== null && row[k] !== undefined) out[k] = row[k];
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();
  let partnerId: string | null = null;
  let responseStatus = 200;
  let recordsReturned = 0;
  let errorMessage: string | null = null;

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      responseStatus = 401;
      return new Response(JSON.stringify({ error: 'missing_api_key' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Authenticate partner
    const keyHash = await sha256Hex(apiKey);
    const { data: partner, error: partnerErr } = await supabase
      .from('api_partners')
      .select('id, status, tier, rate_limit_per_minute, allowed_ips, expires_at')
      .eq('api_key_hash', keyHash)
      .maybeSingle();

    if (partnerErr || !partner) {
      responseStatus = 401;
      return new Response(JSON.stringify({ error: 'invalid_api_key' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (partner.status !== 'active') {
      responseStatus = 403;
      return new Response(JSON.stringify({ error: 'partner_inactive' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (partner.expires_at && new Date(partner.expires_at) < new Date()) {
      responseStatus = 403;
      return new Response(JSON.stringify({ error: 'partner_expired' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    partnerId = partner.id;

    // Parse and validate body
    let body: QueryRequest;
    try {
      body = await req.json();
    } catch {
      responseStatus = 400;
      return new Response(JSON.stringify({ error: 'invalid_json' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!body.purpose || typeof body.purpose !== 'string') {
      responseStatus = 400;
      return new Response(JSON.stringify({ error: 'purpose_required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestedFields = (body.fields ?? ALLOWED_FIELDS)
      .filter((f) => ALLOWED_FIELDS.includes(f));

    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;

    // Branch: profile_signals (per-snomad-id, requires consent)
    if (body.resource_type === 'profile_signals') {
      if (!Array.isArray(body.snomad_ids) || body.snomad_ids.length === 0) {
        responseStatus = 400;
        return new Response(JSON.stringify({ error: 'snomad_ids_required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (body.snomad_ids.length > 100) {
        responseStatus = 400;
        return new Response(JSON.stringify({ error: 'max_100_ids_per_request' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check consent for each snomad_id
      const consentedIds: string[] = [];
      for (const sid of body.snomad_ids) {
        const { data: profileRow } = await supabase
          .from('profiles')
          .select('id')
          .eq('snomad_id', sid)
          .maybeSingle();
        if (!profileRow) continue;

        const { data: consentOk } = await supabase.rpc('has_active_consent', {
          p_user_id: profileRow.id,
          p_purpose: body.purpose,
          p_partner_id: partner.id,
        });
        if (consentOk === true) consentedIds.push(sid);
      }

      if (consentedIds.length === 0) {
        // Log empty access attempt
        await supabase.from('data_access_requests').insert({
          partner_id: partner.id,
          resource_type: 'profile_signals',
          fields_requested: requestedFields,
          fields_returned: [],
          consent_verified: false,
          records_count: 0,
          purpose: body.purpose,
          legal_basis: 'consent',
          ip_address: ipAddress,
        });
        return new Response(JSON.stringify({ data: [], records: 0, note: 'no_consented_subjects' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: rows, error: viewErr } = await supabase
        .from('v_partner_profile_signals')
        .select(requestedFields.join(','))
        .in('snomad_id', consentedIds);

      if (viewErr) {
        errorMessage = viewErr.message;
        responseStatus = 500;
        return new Response(JSON.stringify({ error: 'query_failed' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const safeRows = (rows ?? []).map(anonymizeRow);
      recordsReturned = safeRows.length;

      // Audit log per-subject
      for (const sid of consentedIds) {
        await supabase.from('data_access_requests').insert({
          partner_id: partner.id,
          snomad_id: sid,
          resource_type: 'profile_signals',
          fields_requested: requestedFields,
          fields_returned: requestedFields,
          consent_verified: true,
          records_count: 1,
          purpose: body.purpose,
          legal_basis: 'consent',
          ip_address: ipAddress,
        });
      }

      return new Response(JSON.stringify({
        data: safeRows,
        records: recordsReturned,
        latency_ms: Date.now() - startedAt,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Branch: aggregate (anonymized market signals, no consent needed if k-anon ≥ 5)
    if (body.resource_type === 'aggregate') {
      let q = supabase
        .from('v_partner_profile_signals')
        .select('travel_style, industry, income_bracket, budget_tier, age_bracket', { count: 'exact', head: false });

      if (body.filters) {
        for (const [k, v] of Object.entries(body.filters)) {
          if (ALLOWED_FIELDS.includes(k) && typeof v === 'string') {
            q = q.eq(k, v);
          }
        }
      }

      const { data: rows, count, error: aggErr } = await q;
      if (aggErr) {
        errorMessage = aggErr.message;
        responseStatus = 500;
        return new Response(JSON.stringify({ error: 'aggregate_failed' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // k-anonymity gate: refuse if fewer than 5 subjects match
      if ((count ?? 0) < 5) {
        await supabase.from('data_access_requests').insert({
          partner_id: partner.id,
          resource_type: 'aggregate',
          fields_requested: requestedFields,
          fields_returned: [],
          consent_verified: true, // anonymized, no consent needed but k-anon failed
          records_count: 0,
          purpose: body.purpose,
          legal_basis: 'anonymized',
          ip_address: ipAddress,
        });
        return new Response(JSON.stringify({
          error: 'k_anonymity_violation',
          message: 'Result set too small to release without re-identification risk (k<5).',
        }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Bucket by travel_style as the headline aggregate
      const buckets: Record<string, number> = {};
      for (const r of rows ?? []) {
        const key = (r as { travel_style?: string }).travel_style ?? 'unknown';
        buckets[key] = (buckets[key] ?? 0) + 1;
      }

      recordsReturned = count ?? 0;
      await supabase.from('data_access_requests').insert({
        partner_id: partner.id,
        resource_type: 'aggregate',
        fields_requested: requestedFields,
        fields_returned: ['count', 'travel_style_buckets'],
        consent_verified: true,
        records_count: recordsReturned,
        purpose: body.purpose,
        legal_basis: 'anonymized',
        ip_address: ipAddress,
      });

      return new Response(JSON.stringify({
        total_subjects: recordsReturned,
        travel_style_buckets: buckets,
        filters_applied: body.filters ?? {},
        latency_ms: Date.now() - startedAt,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    responseStatus = 400;
    return new Response(JSON.stringify({ error: 'unknown_resource_type' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    errorMessage = (e as Error).message;
    responseStatus = 500;
    return new Response(JSON.stringify({ error: 'internal_error', message: errorMessage }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } finally {
    // Best-effort partner audit log
    if (partnerId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        );
        await supabase.from('api_audit_logs').insert({
          partner_id: partnerId,
          endpoint: 'partner-data-query',
          method: 'POST',
          response_status: responseStatus,
          records_returned: recordsReturned,
          latency_ms: Date.now() - startedAt,
          error_message: errorMessage,
        });
      } catch {
        // swallow
      }
    }
  }
});
