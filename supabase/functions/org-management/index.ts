// B2B Corporate — Organization Management Edge Function
// Endpoints (action in JSON body):
//  - create_org      { name, billing_email, billing_method?, country_code?, size_band?, industry? }
//  - join_by_code    { join_code, department?, employee_id?, job_title? }
//  - invite          { organization_id, email, role?, department? }
//  - submit_trip     { trip_id }
//  - approve_trip    { trip_id, approve: boolean, rejection_reason? }
//  - get_stats       { organization_id }
//  - leave_org       { organization_id }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const authHeader = req.headers.get('Authorization') || '';
  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

  // Authenticate
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) return json({ error: 'unauthenticated' }, 401);
  const user = userData.user;

  let payload: Record<string, unknown> = {};
  try { payload = await req.json(); } catch { return json({ error: 'invalid_json' }, 400); }
  const action = (payload.action as string) || '';

  try {
    switch (action) {
      // ────────────────────────────────────────────────────────────
      case 'create_org': {
        const name = String(payload.name || '').trim();
        const billing_email = String(payload.billing_email || '').trim();
        if (!name || name.length < 2) return json({ error: 'invalid_name' }, 400);
        if (!billing_email.includes('@')) return json({ error: 'invalid_billing_email' }, 400);

        const baseSlug = slugify(name) || `org-${Date.now()}`;
        let slug = baseSlug;
        let suffix = 0;
        // Ensure unique slug
        while (true) {
          const { data: existing } = await adminClient
            .from('organizations').select('id').eq('slug', slug).maybeSingle();
          if (!existing) break;
          suffix += 1;
          slug = `${baseSlug}-${suffix}`;
          if (suffix > 50) return json({ error: 'slug_collision' }, 500);
        }

        const { data: org, error: orgErr } = await adminClient
          .from('organizations')
          .insert({
            name,
            slug,
            billing_email,
            billing_method: (payload.billing_method as string) || 'invoice',
            billing_currency: (payload.billing_currency as string) || 'USD',
            country_code: (payload.country_code as string) || null,
            size_band: (payload.size_band as string) || null,
            industry: (payload.industry as string) || null,
            legal_name: (payload.legal_name as string) || null,
            tax_id: (payload.tax_id as string) || null,
            created_by: user.id,
          })
          .select()
          .single();
        if (orgErr) return json({ error: 'org_create_failed', detail: orgErr.message }, 500);

        // Add creator as owner
        const { error: memErr } = await adminClient
          .from('organization_members')
          .insert({ organization_id: org.id, user_id: user.id, role: 'owner' });
        if (memErr) return json({ error: 'member_create_failed', detail: memErr.message }, 500);

        return json({ success: true, organization: org });
      }

      // ────────────────────────────────────────────────────────────
      case 'join_by_code': {
        const code = String(payload.join_code || '').trim().toUpperCase();
        if (code.length < 4) return json({ error: 'invalid_join_code' }, 400);

        const { data: org } = await adminClient
          .from('organizations').select('*').eq('join_code', code).maybeSingle();
        if (!org) return json({ error: 'org_not_found' }, 404);
        if (!org.is_active) return json({ error: 'org_inactive' }, 403);

        // Already a member?
        const { data: existingMember } = await adminClient
          .from('organization_members')
          .select('id, is_active, role')
          .eq('organization_id', org.id).eq('user_id', user.id).maybeSingle();

        if (existingMember) {
          if (!existingMember.is_active) {
            await adminClient.from('organization_members')
              .update({ is_active: true }).eq('id', existingMember.id);
          }
          return json({ success: true, organization: org, member: existingMember, already_member: true });
        }

        const { data: member, error: memErr } = await adminClient
          .from('organization_members')
          .insert({
            organization_id: org.id,
            user_id: user.id,
            role: 'employee',
            department: (payload.department as string) || null,
            employee_id: (payload.employee_id as string) || null,
            job_title: (payload.job_title as string) || null,
          })
          .select()
          .single();
        if (memErr) return json({ error: 'join_failed', detail: memErr.message }, 500);

        return json({ success: true, organization: org, member });
      }

      // ────────────────────────────────────────────────────────────
      case 'invite': {
        const organization_id = String(payload.organization_id || '');
        const email = String(payload.email || '').trim().toLowerCase();
        if (!organization_id) return json({ error: 'missing_org_id' }, 400);
        if (!email.includes('@')) return json({ error: 'invalid_email' }, 400);

        // Verify caller is admin
        const { data: caller } = await adminClient
          .from('organization_members')
          .select('role')
          .eq('organization_id', organization_id).eq('user_id', user.id).maybeSingle();
        if (!caller || !['owner', 'admin'].includes(caller.role)) {
          return json({ error: 'not_authorized' }, 403);
        }

        const role = (payload.role as string) || 'employee';
        const { data: invite, error: invErr } = await adminClient
          .from('organization_invites')
          .insert({
            organization_id,
            email,
            role,
            department: (payload.department as string) || null,
            invited_by: user.id,
          })
          .select()
          .single();
        if (invErr) return json({ error: 'invite_failed', detail: invErr.message }, 500);

        // TODO: Send invite email via Resend connector when available
        return json({ success: true, invite });
      }

      // ────────────────────────────────────────────────────────────
      case 'submit_trip': {
        const trip_id = String(payload.trip_id || '');
        const { data: trip } = await adminClient
          .from('business_trips').select('*').eq('id', trip_id).maybeSingle();
        if (!trip) return json({ error: 'trip_not_found' }, 404);
        if (trip.user_id !== user.id) return json({ error: 'not_owner' }, 403);
        if (trip.status !== 'draft') return json({ error: 'invalid_state' }, 400);

        // Auto-approve if cost under policy threshold (placeholder: 1000)
        const { data: org } = await adminClient
          .from('organizations').select('travel_policy').eq('id', trip.organization_id).single();
        const autoThreshold = (org?.travel_policy as Record<string, number>)?.auto_approve_under ?? 0;

        const newStatus = trip.estimated_cost <= autoThreshold && autoThreshold > 0 ? 'approved' : 'submitted';
        const update: Record<string, unknown> = { status: newStatus };
        if (newStatus === 'approved') update.approved_at = new Date().toISOString();

        const { data: updated, error: upErr } = await adminClient
          .from('business_trips').update(update).eq('id', trip_id).select().single();
        if (upErr) return json({ error: 'submit_failed', detail: upErr.message }, 500);
        return json({ success: true, trip: updated });
      }

      // ────────────────────────────────────────────────────────────
      case 'approve_trip': {
        const trip_id = String(payload.trip_id || '');
        const approve = Boolean(payload.approve);
        const { data: trip } = await adminClient
          .from('business_trips').select('*').eq('id', trip_id).maybeSingle();
        if (!trip) return json({ error: 'trip_not_found' }, 404);

        const { data: caller } = await adminClient
          .from('organization_members')
          .select('role')
          .eq('organization_id', trip.organization_id).eq('user_id', user.id).maybeSingle();
        if (!caller || !['owner', 'admin', 'manager'].includes(caller.role)) {
          return json({ error: 'not_authorized' }, 403);
        }

        const update: Record<string, unknown> = {
          status: approve ? 'approved' : 'rejected',
          approver_id: user.id,
          approved_at: approve ? new Date().toISOString() : null,
          rejection_reason: approve ? null : (payload.rejection_reason as string) || 'no_reason',
        };
        const { data: updated, error: upErr } = await adminClient
          .from('business_trips').update(update).eq('id', trip_id).select().single();
        if (upErr) return json({ error: 'approve_failed', detail: upErr.message }, 500);
        return json({ success: true, trip: updated });
      }

      // ────────────────────────────────────────────────────────────
      case 'get_stats': {
        const organization_id = String(payload.organization_id || '');
        const { data, error } = await adminClient.rpc('get_org_dashboard_stats', { p_org_id: organization_id });
        if (error) return json({ error: 'stats_failed', detail: error.message }, 500);
        return json({ success: true, stats: data });
      }

      // ────────────────────────────────────────────────────────────
      case 'leave_org': {
        const organization_id = String(payload.organization_id || '');
        const { data: member } = await adminClient
          .from('organization_members')
          .select('id, role')
          .eq('organization_id', organization_id).eq('user_id', user.id).maybeSingle();
        if (!member) return json({ error: 'not_a_member' }, 404);
        if (member.role === 'owner') {
          // Check if other owners exist
          const { count } = await adminClient
            .from('organization_members')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', organization_id).eq('role', 'owner').neq('user_id', user.id);
          if (!count || count === 0) return json({ error: 'transfer_ownership_first' }, 400);
        }
        await adminClient.from('organization_members')
          .update({ is_active: false }).eq('id', member.id);
        return json({ success: true });
      }

      default:
        return json({ error: 'unknown_action' }, 400);
    }
  } catch (err) {
    console.error('org-management error:', err);
    return json({ error: 'internal_error', detail: err instanceof Error ? err.message : String(err) }, 500);
  }
});
