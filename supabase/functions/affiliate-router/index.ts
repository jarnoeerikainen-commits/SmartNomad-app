// ═══════════════════════════════════════════════════════════════════
// affiliate-router — unified API for the SuperNomad affiliate program
// Actions: track-click, attribute, account, stats, request-payout,
//          credit-commission (service-only), clear-matured (cron),
//          get-settings, accept-terms, update-payout-method
// ═══════════════════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function shortHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = ((h << 5) - h + input.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36) + Date.now().toString(36).slice(-6);
}

function getClientIP(req: Request): string | null {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    null
  );
}

function getCountry(req: Request): string | null {
  return req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country') || null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action as string;
    if (!action) return json({ error: 'action required' }, 400);

    const auth = req.headers.get('Authorization');
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: auth ? { Authorization: auth } : {} },
    });
    const svc = createClient(SUPABASE_URL, SERVICE);

    const { data: { user } } = auth ? await userClient.auth.getUser() : { data: { user: null } };

    switch (action) {
      // ─── Public click tracking (no auth) ───────────────────────
      case 'track-click': {
        const code = String(body.referral_code || '').trim().toUpperCase();
        if (!code) return json({ error: 'referral_code required' }, 400);

        const click_id = body.click_id || shortHash(code + Math.random());
        const { data, error } = await svc.rpc('record_referral_click', {
          p_referral_code: code,
          p_click_id: click_id,
          p_ip: getClientIP(req),
          p_user_agent: req.headers.get('user-agent'),
          p_fingerprint: body.fingerprint || null,
          p_country: getCountry(req),
          p_landing: body.landing || null,
          p_utm_source: body.utm_source || null,
          p_utm_medium: body.utm_medium || null,
          p_utm_campaign: body.utm_campaign || null,
          p_referer: body.referer || null,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: !!data, click_id, tracked: !!data });
      }

      // ─── Attribute click → signup (called after auth) ──────────
      case 'attribute': {
        if (!user) return json({ error: 'auth required' }, 401);
        const click_id = String(body.click_id || '');
        if (!click_id) return json({ error: 'click_id required' }, 400);

        const { data, error } = await svc.rpc('attribute_referral', {
          p_referred_user_id: user.id,
          p_click_id: click_id,
        });
        if (error) return json({ error: error.message }, 500);
        return json(data);
      }

      // ─── Get / create my affiliate account ─────────────────────
      case 'account': {
        if (!user) return json({ error: 'auth required' }, 401);
        const { data, error } = await svc.rpc('get_or_create_affiliate_account', {
          p_user_id: user.id,
        });
        if (error) return json({ error: error.message }, 500);
        const { data: settings } = await svc
          .from('affiliate_program_settings').select('*').eq('id', 1).single();
        return json({ account: data, settings });
      }

      // ─── Aggregated stats for dashboard ────────────────────────
      case 'stats': {
        if (!user) return json({ error: 'auth required' }, 401);
        const { data: account } = await userClient
          .from('affiliate_accounts').select('*').eq('user_id', user.id).maybeSingle();
        if (!account) return json({ error: 'no_account' }, 404);

        const [{ data: l1Refs }, { data: l2Refs }, { data: earnings }, { data: payouts }] =
          await Promise.all([
            userClient.from('referrals').select('id, signup_at, first_payment_at, status')
              .eq('affiliate_user_id', user.id).eq('level', 1).order('signup_at', { ascending: false }),
            userClient.from('referrals').select('id, signup_at, first_payment_at, status')
              .eq('affiliate_user_id', user.id).eq('level', 2).order('signup_at', { ascending: false }),
            userClient.from('affiliate_earnings').select('*')
              .eq('affiliate_user_id', user.id).order('created_at', { ascending: false }).limit(50),
            userClient.from('affiliate_payouts').select('*')
              .eq('affiliate_user_id', user.id).order('requested_at', { ascending: false }).limit(20),
          ]);

        return json({
          account,
          l1_referrals: l1Refs || [],
          l2_referrals: l2Refs || [],
          recent_earnings: earnings || [],
          payouts: payouts || [],
        });
      }

      // ─── Update payout preferences ─────────────────────────────
      case 'update-payout-method': {
        if (!user) return json({ error: 'auth required' }, 401);
        const allowed = ['wallet_credit', 'usdc_base', 'stripe_connect', 'bank_wire'];
        const method = String(body.payout_method || '');
        if (!allowed.includes(method)) return json({ error: 'invalid_method' }, 400);

        const { data, error } = await userClient
          .from('affiliate_accounts')
          .update({
            payout_method: method,
            payout_address: body.payout_address || null,
            payout_currency: body.payout_currency || 'USD',
          })
          .eq('user_id', user.id).select().single();
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, account: data });
      }

      // ─── Accept program terms ──────────────────────────────────
      case 'accept-terms': {
        if (!user) return json({ error: 'auth required' }, 401);
        const { data: settings } = await svc
          .from('affiliate_program_settings').select('terms_version').eq('id', 1).single();
        const { data, error } = await userClient
          .from('affiliate_accounts')
          .update({
            terms_accepted_version: settings?.terms_version || '1.0',
            terms_accepted_at: new Date().toISOString(),
          })
          .eq('user_id', user.id).select().single();
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, account: data });
      }

      // ─── Request payout (RPC handles validation) ───────────────
      case 'request-payout': {
        if (!user) return json({ error: 'auth required' }, 401);
        const amount = Number(body.amount);
        if (!Number.isFinite(amount) || amount <= 0) return json({ error: 'invalid_amount' }, 400);
        const method = String(body.payout_method || 'usdc_base');

        const { data, error } = await userClient.rpc('request_affiliate_payout', {
          p_amount: amount,
          p_method: method,
          p_address: body.payout_address || null,
        });
        if (error) return json({ error: error.message }, 500);
        return json(data);
      }

      // ─── Credit commission (service-role, called by payments) ──
      // base_amount = the COMPANY's net earnings on this transaction
      // (subscription fee, fixed margin, or commission earned).
      // L1 affiliate gets 25% of base_amount, L2 gets 5% of base_amount.
      case 'credit-commission': {
        const provided = req.headers.get('x-service-secret');
        if (provided !== SERVICE) return json({ error: 'forbidden' }, 403);

        const baseAmount = Number(body.base_amount);
        if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
          return json({ error: 'invalid base_amount (must be company net earnings > 0)' }, 400);
        }
        if (!body.referred_user_id || !body.source_type) {
          return json({ error: 'referred_user_id and source_type required' }, 400);
        }

        const { data, error } = await svc.rpc('credit_commission', {
          p_referred_user_id: body.referred_user_id,
          p_base_amount: baseAmount,
          p_currency: body.currency || 'USD',
          p_source_type: body.source_type,
          p_source_id: body.source_id || null,
          p_description: body.description || null,
        });
        if (error) return json({ error: error.message }, 500);
        return json(data);
      }

      // ─── Clear matured earnings (cron / manual) ────────────────
      // Auto-runs daily at 02:15 UTC via pg_cron job 'affiliate-clear-matured-daily'
      case 'clear-matured': {
        const { data, error } = await svc.rpc('clear_matured_earnings');
        if (error) return json({ error: error.message }, 500);
        return json({ cleared: data });
      }

      // ─── Reverse commission on chargeback/refund (service-only) ─
      // Called by payment webhooks (Stripe charge.dispute.created, etc.)
      // Only reverses earnings still in 'pending' status (within 30-day hold).
      case 'reverse-commission': {
        const provided = req.headers.get('x-service-secret');
        if (provided !== SERVICE) return json({ error: 'forbidden' }, 403);
        if (!body.source_type || !body.source_id) {
          return json({ error: 'source_type and source_id required' }, 400);
        }
        const { data, error } = await svc.rpc('reverse_affiliate_earnings_for_source', {
          p_source_type: body.source_type,
          p_source_id: body.source_id,
          p_reason: body.reason || 'chargeback',
        });
        if (error) return json({ error: error.message }, 500);
        return json(data);
      }

      // ─── Public program settings ───────────────────────────────
      case 'get-settings': {
        const { data, error } = await svc
          .from('affiliate_program_settings').select('*').eq('id', 1).single();
        if (error) return json({ error: error.message }, 500);
        return json({ settings: data });
      }

      default:
        return json({ error: `unknown action: ${action}` }, 400);
    }
  } catch (e) {
    console.error('affiliate-router error', e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
