import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key, x-partner-slug',
};

interface PartnerInfo {
  id: string;
  partner_name: string;
  partner_slug: string;
  status: string;
  tier: string;
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  allowed_ips: string[];
  metadata: Record<string, any>;
}

interface AccessPolicy {
  resource_type: string;
  resource_category: string | null;
  permission: string;
  field_restrictions: string[];
  filter_conditions: Record<string, any>;
  anonymize_pii: boolean;
  max_records_per_request: number;
  enabled: boolean;
}

// All available resource types mapped to their data sources
const RESOURCE_HANDLERS: Record<string, (supabase: any, policy: AccessPolicy, params: Record<string, any>) => Promise<any>> = {
  'travel_history': fetchTravelHistory,
  'ai_memories': fetchAIMemories,
  'conversations': fetchConversations,
  'device_sessions': fetchDeviceSessions,
  'snomad_profiles': fetchSnomadProfiles,
  'feature_catalog': fetchFeatureCatalog,
  'platform_stats': fetchPlatformStats,
  'ai_usage': fetchAIUsage,
  'knowledge_graph': fetchKnowledgeGraph,
};

// PII fields that can be anonymized
const PII_FIELDS = ['email', 'phone', 'first_name', 'last_name', 'contact_name', 'ip_address', 'device_id'];

function anonymizeRecord(record: Record<string, any>, fields: string[]): Record<string, any> {
  const result = { ...record };
  for (const field of fields) {
    if (field in result && result[field]) {
      if (typeof result[field] === 'string') {
        if (field.includes('email')) {
          const [local, domain] = result[field].split('@');
          result[field] = `${local[0]}***@${domain}`;
        } else if (field.includes('phone')) {
          result[field] = result[field].replace(/\d(?=\d{4})/g, '*');
        } else if (field.includes('device_id')) {
          result[field] = `dev_${result[field].slice(-6)}`;
        } else {
          result[field] = `${result[field][0]}***`;
        }
      }
    }
    // Handle nested JSONB
    if (field.includes('.')) {
      const parts = field.split('.');
      let obj = result;
      for (let i = 0; i < parts.length - 1; i++) {
        if (obj[parts[i]] && typeof obj[parts[i]] === 'object') {
          obj = obj[parts[i]];
        }
      }
      const lastKey = parts[parts.length - 1];
      if (obj[lastKey]) obj[lastKey] = '***';
    }
  }
  return result;
}

function filterFields(record: Record<string, any>, restrictions: string[]): Record<string, any> {
  if (!restrictions || restrictions.length === 0) return record;
  const result: Record<string, any> = {};
  for (const field of restrictions) {
    if (field in record) {
      result[field] = record[field];
    }
  }
  return result;
}

async function fetchTravelHistory(supabase: any, policy: AccessPolicy, params: Record<string, any>) {
  let query = supabase.from('travel_history').select('*');
  if (params.device_id) query = query.eq('device_id', params.device_id);
  if (params.country_code) query = query.eq('country_code', params.country_code);
  if (params.from_date) query = query.gte('entry_date', params.from_date);
  if (params.to_date) query = query.lte('entry_date', params.to_date);
  query = query.limit(policy.max_records_per_request || 100);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function fetchAIMemories(supabase: any, policy: AccessPolicy, params: Record<string, any>) {
  let query = supabase.from('ai_memories').select('id, fact, category, confidence, importance, semantic_tags, created_at');
  if (params.device_id) query = query.eq('device_id', params.device_id);
  if (params.category) query = query.eq('category', params.category);
  query = query.limit(policy.max_records_per_request || 100);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function fetchConversations(supabase: any, policy: AccessPolicy, params: Record<string, any>) {
  let query = supabase.from('conversations').select('id, title, message_count, created_at, updated_at');
  if (params.device_id) query = query.eq('device_id', params.device_id);
  query = query.order('updated_at', { ascending: false }).limit(policy.max_records_per_request || 100);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function fetchDeviceSessions(supabase: any, policy: AccessPolicy, params: Record<string, any>) {
  let query = supabase.from('device_sessions').select('device_id, last_seen_at, metadata, created_at');
  query = query.limit(policy.max_records_per_request || 100);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function fetchSnomadProfiles(supabase: any, policy: AccessPolicy, params: Record<string, any>) {
  let query = supabase.from('snomad_profiles').select('id, preferences, completeness_score, preference_count, created_at, updated_at');
  if (params.device_id) query = query.eq('device_id', params.device_id);
  query = query.limit(policy.max_records_per_request || 100);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function fetchFeatureCatalog(_supabase: any, _policy: AccessPolicy, _params: Record<string, any>) {
  // Returns the complete feature catalog - always up to date from code
  return {
    totalFeatures: 60,
    categories: {
      tax: 'Tax & Compliance (Country Tracker, Visa Manager, ETIAS, Document Vault, Government Apps, Tax & Wealth Help)',
      travel: 'Travel & Transport (Weather, Travel Insurance, Taxi, Public Transport, Car Services, Air Charter, Roadside Assistance, Airport Lounges, Moving Services)',
      local: 'Local & Lifestyle (Local Services, Embassy Directory, Medical, Digital Banking, E-SIM, Delivery, Pet Services, Language Learning, WiFi, Remote Work, Student Services)',
      premium: 'Premium Services (AI Concierge, AI Travel Planner, AI Legal, AI Medical, Cyber Guardian, Elite Clubs, Award Cards, Marketplace, Community Chat, Social Network, Wellness)',
      safety: 'Safety & Emergency (SOS, Emergency Contacts, Travel Insurance, Threat Intelligence, Black Box Guardian, Severe Weather Alerts, Air Quality)',
      finance: 'Finance & Payments (Currency Converter, Expense Tracker, Digital Money, Crypto, Money Transfers, Payment Options)',
      dashboard: 'Dashboard Widgets (Threat Widget, Hero Cards, Stats, Weather, Gamification, Activity Feed, Smart Actions, Feature Discovery)',
    },
    aiSystems: [
      'AI Travel Assistant (Gemini 3 Flash)',
      'AI Travel Planner',
      'AI Travel Lawyer (Legal Chat)',
      'AI Travel Doctor (Medical Chat)',
      'Cyber Guardian AI',
      'Help & Support AI',
      'Social Chat AI',
      'Marketplace AI',
      'Moving Services AI',
      'City Services AI',
      'Subject Chat Moderator',
      'Snomad Orchestrator (Cross-feature automation)',
      'Memory Distillation Engine',
      'Conversation Compression',
      'Embedding Generation',
      'ElevenLabs TTS Integration',
    ],
    dataLayers: [
      'Snomad ID Vault (AES-256-GCM encrypted identity)',
      'Knowledge Graph (recursive relationship discovery)',
      'AI Memory System (weighted hybrid search)',
      'Travel History Tracker',
      'Award Cards & Loyalty Programs',
      'Feature Preferences Engine',
    ],
    securityFeatures: [
      'Zero-knowledge encryption (Web Crypto API)',
      'Device-based RLS isolation',
      'EU AI Act 2024 compliance',
      'GDPR & CCPA data management',
      'Black Box Guardian (evidence preservation)',
    ],
    version: '2.0.0',
    lastUpdated: new Date().toISOString(),
  };
}

async function fetchPlatformStats(supabase: any, _policy: AccessPolicy, _params: Record<string, any>) {
  const [sessions, travel, memories, conversations] = await Promise.all([
    supabase.from('device_sessions').select('id', { count: 'exact', head: true }),
    supabase.from('travel_history').select('id', { count: 'exact', head: true }),
    supabase.from('ai_memories').select('id', { count: 'exact', head: true }),
    supabase.from('conversations').select('id', { count: 'exact', head: true }),
  ]);
  return {
    totalDevices: sessions.count || 0,
    totalTravelRecords: travel.count || 0,
    totalAIMemories: memories.count || 0,
    totalConversations: conversations.count || 0,
    timestamp: new Date().toISOString(),
  };
}

async function fetchAIUsage(supabase: any, policy: AccessPolicy, params: Record<string, any>) {
  let query = supabase.from('ai_usage_logs').select('function_name, model, input_tokens, output_tokens, latency_ms, cache_hit, created_at');
  if (params.function_name) query = query.eq('function_name', params.function_name);
  if (params.from_date) query = query.gte('created_at', params.from_date);
  query = query.order('created_at', { ascending: false }).limit(policy.max_records_per_request || 100);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function fetchKnowledgeGraph(supabase: any, policy: AccessPolicy, params: Record<string, any>) {
  let query = supabase.from('knowledge_graph_edges').select('source_type, source_id, target_type, target_id, relationship, weight, metadata, created_at');
  if (params.device_id) query = query.eq('device_id', params.device_id);
  if (params.source_type) query = query.eq('source_type', params.source_type);
  query = query.eq('is_active', true).limit(policy.max_records_per_request || 100);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function validateApiKey(supabase: any, apiKey: string): Promise<PartnerInfo | null> {
  // Hash the API key for comparison (using simple approach for edge function)
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const { data: partner, error } = await supabase
    .from('api_partners')
    .select('*')
    .eq('api_key_hash', hashHex)
    .eq('status', 'active')
    .single();

  if (error || !partner) return null;

  // Check expiry
  if (partner.expires_at && new Date(partner.expires_at) < new Date()) return null;

  return partner;
}

async function getAccessPolicies(supabase: any, partnerId: string): Promise<AccessPolicy[]> {
  const { data, error } = await supabase
    .from('api_access_policies')
    .select('*')
    .eq('partner_id', partnerId)
    .eq('enabled', true);
  if (error) return [];
  return data || [];
}

async function logAudit(supabase: any, partnerId: string, endpoint: string, method: string, path: string, params: any, status: number, size: number, records: number, latency: number, ip: string, ua: string, error?: string) {
  await supabase.from('api_audit_logs').insert({
    partner_id: partnerId,
    endpoint,
    method,
    request_path: path,
    request_params: params,
    response_status: status,
    response_size_bytes: size,
    records_returned: records,
    latency_ms: latency,
    ip_address: ip,
    user_agent: ua,
    error_message: error,
  });
}

async function checkRateLimit(supabase: any, partner: PartnerInfo): Promise<boolean> {
  const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
  const { count } = await supabase
    .from('api_audit_logs')
    .select('id', { count: 'exact', head: true })
    .eq('partner_id', partner.id)
    .gte('created_at', oneMinuteAgo);
  return (count || 0) < partner.rate_limit_per_minute;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();
  const url = new URL(req.url);
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';

  // Service role client for all operations (bypasses RLS)
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Extract API key
  const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!apiKey) {
    return new Response(JSON.stringify({
      error: 'Authentication required',
      message: 'Provide API key via x-api-key header or Bearer token',
    }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // Validate partner
  const partner = await validateApiKey(supabase, apiKey);
  if (!partner) {
    return new Response(JSON.stringify({ error: 'Invalid or expired API key' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // IP whitelist check
  if (partner.allowed_ips && partner.allowed_ips.length > 0 && !partner.allowed_ips.includes(ip)) {
    await logAudit(supabase, partner.id, 'ip_check', req.method, url.pathname, {}, 403, 0, 0, Date.now() - startTime, ip, ua, 'IP not whitelisted');
    return new Response(JSON.stringify({ error: 'IP not authorized' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Rate limit check
  const withinLimit = await checkRateLimit(supabase, partner);
  if (!withinLimit) {
    await logAudit(supabase, partner.id, 'rate_limit', req.method, url.pathname, {}, 429, 0, 0, Date.now() - startTime, ip, ua, 'Rate limit exceeded');
    return new Response(JSON.stringify({ error: 'Rate limit exceeded', retryAfter: 60 }), {
      status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
    });
  }

  try {
    const pathParts = url.pathname.split('/').filter(Boolean);
    // Expected: /supernomad-gateway/v1/{resource}
    const version = pathParts[1] || 'v1';
    const resource = pathParts[2] || '';
    const params = Object.fromEntries(url.searchParams.entries());

    // POST body params
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        Object.assign(params, body);
      } catch {}
    }

    // Special endpoints
    if (resource === '' || resource === 'info') {
      const response = {
        gateway: 'SuperNomad B2B API Gateway',
        version: 'v1',
        partner: partner.partner_name,
        tier: partner.tier,
        status: 'operational',
        availableResources: [],
        documentation: 'https://docs.supernomad.com/api',
        timestamp: new Date().toISOString(),
      };

      const policies = await getAccessPolicies(supabase, partner.id);
      response.availableResources = policies.map((p: AccessPolicy) => ({
        resource: p.resource_type,
        category: p.resource_category,
        permission: p.permission,
        maxRecords: p.max_records_per_request,
        piiAnonymized: p.anonymize_pii,
      }));

      const responseStr = JSON.stringify(response);
      await logAudit(supabase, partner.id, 'info', req.method, url.pathname, params, 200, responseStr.length, 0, Date.now() - startTime, ip, ua);

      return new Response(responseStr, {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check access policy for requested resource
    const policies = await getAccessPolicies(supabase, partner.id);
    const policy = policies.find((p: AccessPolicy) => p.resource_type === resource);

    if (!policy) {
      await logAudit(supabase, partner.id, resource, req.method, url.pathname, params, 403, 0, 0, Date.now() - startTime, ip, ua, 'No access policy for resource');
      return new Response(JSON.stringify({
        error: 'Access denied',
        message: `No access policy for resource: ${resource}`,
        availableResources: policies.map((p: AccessPolicy) => p.resource_type),
      }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Permission check
    if (req.method !== 'GET' && policy.permission === 'read') {
      await logAudit(supabase, partner.id, resource, req.method, url.pathname, params, 405, 0, 0, Date.now() - startTime, ip, ua, 'Write not permitted');
      return new Response(JSON.stringify({ error: 'Read-only access for this resource' }), {
        status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Execute handler
    const handler = RESOURCE_HANDLERS[resource];
    if (!handler) {
      return new Response(JSON.stringify({ error: 'Unknown resource', available: Object.keys(RESOURCE_HANDLERS) }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let data = await handler(supabase, policy, params);

    // Post-process: anonymize PII
    if (policy.anonymize_pii && Array.isArray(data)) {
      data = data.map((record: Record<string, any>) => anonymizeRecord(record, PII_FIELDS));
    }

    // Post-process: field restrictions
    if (policy.field_restrictions && policy.field_restrictions.length > 0 && Array.isArray(data)) {
      data = data.map((record: Record<string, any>) => filterFields(record, policy.field_restrictions));
    }

    const recordCount = Array.isArray(data) ? data.length : 1;
    const response = {
      success: true,
      partner: partner.partner_name,
      resource,
      data,
      meta: {
        recordCount,
        maxRecords: policy.max_records_per_request,
        piiAnonymized: policy.anonymize_pii,
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
      },
    };

    const responseStr = JSON.stringify(response);
    await logAudit(supabase, partner.id, resource, req.method, url.pathname, params, 200, responseStr.length, recordCount, Date.now() - startTime, ip, ua);

    // Update last_request_at
    await supabase.from('api_partners').update({ last_request_at: new Date().toISOString() }).eq('id', partner.id);

    return new Response(responseStr, {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error';
    await logAudit(supabase, partner.id, 'error', req.method, url.pathname, {}, 500, 0, 0, Date.now() - startTime, ip, ua, errorMsg);

    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
