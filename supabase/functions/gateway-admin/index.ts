import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
};

// Admin operations - only accessible with SUPABASE_SERVICE_ROLE_KEY as x-admin-key
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Authenticate admin
  const adminKey = req.headers.get('x-admin-key');
  if (!adminKey || adminKey !== serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Admin authentication required' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const body = await req.json();
    const { action, ...params } = body;

    switch (action) {
      // ===== PARTNER MANAGEMENT =====
      case 'create_partner': {
        // Generate API key
        const rawKey = `snk_${crypto.randomUUID().replace(/-/g, '')}`;
        const prefix = rawKey.slice(0, 8);
        
        // Hash for storage
        const encoder = new TextEncoder();
        const data = encoder.encode(rawKey);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const { data: partner, error } = await supabase.from('api_partners').insert({
          partner_name: params.partner_name,
          partner_slug: params.partner_slug || params.partner_name.toLowerCase().replace(/\s+/g, '-'),
          api_key_hash: hashHex,
          api_key_prefix: prefix,
          contact_email: params.contact_email,
          contact_name: params.contact_name,
          company_url: params.company_url,
          tier: params.tier || 'basic',
          rate_limit_per_minute: params.rate_limit_per_minute || 60,
          rate_limit_per_day: params.rate_limit_per_day || 10000,
          allowed_ips: params.allowed_ips || [],
          metadata: params.metadata || {},
          expires_at: params.expires_at,
        }).select().single();

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          partner,
          api_key: rawKey, // Only shown once!
          warning: 'Save this API key securely. It cannot be retrieved again.',
        }), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'list_partners': {
        const { data, error } = await supabase.from('api_partners')
          .select('id, partner_name, partner_slug, api_key_prefix, status, tier, rate_limit_per_minute, rate_limit_per_day, last_request_at, created_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return new Response(JSON.stringify({ partners: data }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update_partner': {
        const { partner_id, ...updates } = params;
        const allowed = ['status', 'tier', 'rate_limit_per_minute', 'rate_limit_per_day', 'allowed_ips', 'metadata', 'expires_at', 'contact_email'];
        const filtered: Record<string, any> = {};
        for (const key of allowed) {
          if (key in updates) filtered[key] = updates[key];
        }
        const { data, error } = await supabase.from('api_partners').update(filtered).eq('id', partner_id).select().single();
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, partner: data }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'revoke_partner': {
        const { data, error } = await supabase.from('api_partners')
          .update({ status: 'revoked' })
          .eq('id', params.partner_id)
          .select().single();
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, message: 'Partner revoked', partner: data }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'rotate_key': {
        const rawKey = `snk_${crypto.randomUUID().replace(/-/g, '')}`;
        const prefix = rawKey.slice(0, 8);
        const encoder = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(rawKey));
        const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        const { data, error } = await supabase.from('api_partners')
          .update({ api_key_hash: hashHex, api_key_prefix: prefix })
          .eq('id', params.partner_id)
          .select().single();
        if (error) throw error;
        return new Response(JSON.stringify({
          success: true, partner: data, new_api_key: rawKey,
          warning: 'Save this API key securely. Old key is now invalid.',
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // ===== ACCESS POLICY MANAGEMENT =====
      case 'create_policy': {
        const { data, error } = await supabase.from('api_access_policies').insert({
          partner_id: params.partner_id,
          resource_type: params.resource_type,
          resource_category: params.resource_category,
          permission: params.permission || 'read',
          field_restrictions: params.field_restrictions || [],
          filter_conditions: params.filter_conditions || {},
          anonymize_pii: params.anonymize_pii !== false,
          max_records_per_request: params.max_records_per_request || 100,
          enabled: params.enabled !== false,
        }).select().single();
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, policy: data }), {
          status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'list_policies': {
        let query = supabase.from('api_access_policies').select('*, api_partners(partner_name, partner_slug)');
        if (params.partner_id) query = query.eq('partner_id', params.partner_id);
        const { data, error } = await query;
        if (error) throw error;
        return new Response(JSON.stringify({ policies: data }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update_policy': {
        const { policy_id, ...updates } = params;
        const allowed = ['permission', 'field_restrictions', 'filter_conditions', 'anonymize_pii', 'max_records_per_request', 'enabled'];
        const filtered: Record<string, any> = {};
        for (const key of allowed) {
          if (key in updates) filtered[key] = updates[key];
        }
        const { data, error } = await supabase.from('api_access_policies').update(filtered).eq('id', policy_id).select().single();
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, policy: data }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete_policy': {
        const { error } = await supabase.from('api_access_policies').delete().eq('id', params.policy_id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, message: 'Policy deleted' }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // ===== BULK POLICY SETUP =====
      case 'setup_full_access': {
        const resources = [
          'travel_history', 'ai_memories', 'conversations', 'device_sessions',
          'snomad_profiles', 'feature_catalog', 'platform_stats', 'ai_usage', 'knowledge_graph',
        ];
        const policies = resources.map(r => ({
          partner_id: params.partner_id,
          resource_type: r,
          permission: params.permission || 'read',
          anonymize_pii: params.anonymize_pii !== false,
          max_records_per_request: params.max_records || 100,
        }));
        const { data, error } = await supabase.from('api_access_policies').insert(policies).select();
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, policiesCreated: data?.length, policies: data }), {
          status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // ===== AUDIT & ANALYTICS =====
      case 'get_audit_logs': {
        let query = supabase.from('api_audit_logs').select('*, api_partners(partner_name)');
        if (params.partner_id) query = query.eq('partner_id', params.partner_id);
        if (params.from_date) query = query.gte('created_at', params.from_date);
        if (params.status) query = query.eq('response_status', params.status);
        query = query.order('created_at', { ascending: false }).limit(params.limit || 100);
        const { data, error } = await query;
        if (error) throw error;
        return new Response(JSON.stringify({ logs: data }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_usage_summary': {
        const { data, error } = await supabase.from('api_audit_logs')
          .select('partner_id, endpoint, response_status, latency_ms, records_returned, created_at')
          .eq('partner_id', params.partner_id)
          .gte('created_at', params.from_date || new Date(Date.now() - 30 * 86400000).toISOString())
          .order('created_at', { ascending: false })
          .limit(1000);
        if (error) throw error;

        const summary = {
          totalRequests: data?.length || 0,
          successRate: data ? (data.filter((d: any) => d.response_status === 200).length / data.length * 100).toFixed(1) : 0,
          avgLatency: data ? Math.round(data.reduce((sum: number, d: any) => sum + d.latency_ms, 0) / data.length) : 0,
          totalRecords: data ? data.reduce((sum: number, d: any) => sum + (d.records_returned || 0), 0) : 0,
          topEndpoints: Object.entries(
            (data || []).reduce((acc: Record<string, number>, d: any) => {
              acc[d.endpoint] = (acc[d.endpoint] || 0) + 1;
              return acc;
            }, {})
          ).sort((a: any, b: any) => b[1] - a[1]).slice(0, 10),
        };

        return new Response(JSON.stringify({ summary }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // ===== AVAILABLE RESOURCES =====
      case 'list_resources': {
        return new Response(JSON.stringify({
          resources: [
            { type: 'travel_history', description: 'User travel records with dates, countries, visa types', dataSource: 'supabase' },
            { type: 'ai_memories', description: 'AI-learned user preferences and facts', dataSource: 'supabase' },
            { type: 'conversations', description: 'AI conversation history', dataSource: 'supabase' },
            { type: 'device_sessions', description: 'Active device sessions', dataSource: 'supabase' },
            { type: 'snomad_profiles', description: 'Encrypted user identity profiles', dataSource: 'supabase' },
            { type: 'feature_catalog', description: 'Complete platform feature & AI catalog (always live)', dataSource: 'code' },
            { type: 'platform_stats', description: 'Aggregate platform statistics', dataSource: 'supabase' },
            { type: 'ai_usage', description: 'AI model usage logs and analytics', dataSource: 'supabase' },
            { type: 'knowledge_graph', description: 'Cross-feature knowledge graph relationships', dataSource: 'supabase' },
          ],
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      default:
        return new Response(JSON.stringify({
          error: 'Unknown action',
          availableActions: [
            'create_partner', 'list_partners', 'update_partner', 'revoke_partner', 'rotate_key',
            'create_policy', 'list_policies', 'update_policy', 'delete_policy', 'setup_full_access',
            'get_audit_logs', 'get_usage_summary', 'list_resources',
          ],
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Internal error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
