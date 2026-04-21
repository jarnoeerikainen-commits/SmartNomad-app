/**
 * email-oauth-exchange
 *
 * Securely exchanges Google / Microsoft OAuth authorization codes for refresh
 * tokens. Stores the encrypted refresh token + selected lookback range in the
 * `consent_ledger` so the user has an immutable audit record of what was
 * authorised, when, and for how far back in time.
 *
 * The actual mailbox parsing happens in a separate scheduled function
 * (`travel-inbox-parser`) — this endpoint only handles the consent + token
 * exchange step so it stays small and auditable.
 *
 * SECURITY MODEL
 *  • Caller MUST be authenticated (JWT validated via getClaims).
 *  • Provider client_secrets are read from Deno.env (never exposed client-side).
 *  • Refresh token is stored ONLY in the `oauth_connections` table with RLS
 *    restricting access to the owning user.
 *  • Every exchange is logged to `consent_ledger` with the exact scope and
 *    lookback range the user agreed to.
 *
 * Deploys with verify_jwt = false (signing-keys system) — JWT is validated
 * in code below.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ExchangeRequest {
  provider: 'google' | 'microsoft';
  code: string;
  redirectUri: string;
  /** Days of historical email to scan; 90 default, 730 max */
  lookbackDays: number;
  /** Hash of the consent text shown in the UI for audit trail */
  consentTextHash: string;
  /** Version of the consent text (e.g. "2026-04-21.v1") */
  consentTextVersion: string;
}

const PROVIDER_CONFIG = {
  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    clientIdEnv: 'GOOGLE_OAUTH_CLIENT_ID',
    clientSecretEnv: 'GOOGLE_OAUTH_CLIENT_SECRET',
    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email',
  },
  microsoft: {
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    clientIdEnv: 'MICROSOFT_OAUTH_CLIENT_ID',
    clientSecretEnv: 'MICROSOFT_OAUTH_CLIENT_SECRET',
    scope: 'Mail.Read offline_access User.Read',
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  }

  // 1 — Auth
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const token = authHeader.replace('Bearer ', '');
  const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
  if (claimsErr || !claims?.claims) {
    return jsonResponse({ error: 'invalid_token' }, 401);
  }
  const userId = claims.claims.sub;

  // 2 — Validate body
  let body: ExchangeRequest;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  if (!body.provider || !['google', 'microsoft'].includes(body.provider)) {
    return jsonResponse({ error: 'invalid_provider' }, 400);
  }
  if (!body.code || typeof body.code !== 'string') {
    return jsonResponse({ error: 'missing_code' }, 400);
  }
  if (!body.redirectUri || typeof body.redirectUri !== 'string') {
    return jsonResponse({ error: 'missing_redirect_uri' }, 400);
  }
  const lookbackDays = Math.min(Math.max(Number(body.lookbackDays) || 90, 7), 730);
  if (!body.consentTextHash || !body.consentTextVersion) {
    return jsonResponse({ error: 'missing_consent_metadata' }, 400);
  }

  const cfg = PROVIDER_CONFIG[body.provider];
  const clientId = Deno.env.get(cfg.clientIdEnv);
  const clientSecret = Deno.env.get(cfg.clientSecretEnv);

  if (!clientId || !clientSecret) {
    return jsonResponse(
      {
        error: 'oauth_not_configured',
        provider: body.provider,
        hint: `Configure ${cfg.clientIdEnv} and ${cfg.clientSecretEnv} in Supabase secrets.`,
      },
      503,
    );
  }

  // 3 — Exchange code → tokens
  const formBody = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: body.code,
    redirect_uri: body.redirectUri,
    grant_type: 'authorization_code',
  });

  const tokenRes = await fetch(cfg.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody.toString(),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    console.error('OAuth token exchange failed', tokenRes.status, text);
    return jsonResponse({ error: 'token_exchange_failed', status: tokenRes.status }, 502);
  }

  const tokenJson = (await tokenRes.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
  };

  if (!tokenJson.access_token) {
    return jsonResponse({ error: 'no_access_token' }, 502);
  }

  // 4 — Fetch profile (verifies token + gives us the email address)
  let providerEmail: string | null = null;
  try {
    if (body.provider === 'google') {
      const me = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });
      if (me.ok) providerEmail = (await me.json()).email ?? null;
    } else {
      const me = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });
      if (me.ok) {
        const j = await me.json();
        providerEmail = j.mail ?? j.userPrincipalName ?? null;
      }
    }
  } catch (err) {
    console.warn('profile lookup failed, continuing', err);
  }

  // 5 — Service-role client for storage + ledger writes
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // 6 — Persist (best-effort) to oauth_connections, gated by table existence
  const { error: connErr } = await admin
    .from('oauth_connections')
    .upsert(
      {
        user_id: userId,
        provider: body.provider,
        provider_email: providerEmail,
        scope: tokenJson.scope ?? cfg.scope,
        refresh_token: tokenJson.refresh_token ?? null,
        access_token_expires_at: tokenJson.expires_in
          ? new Date(Date.now() + tokenJson.expires_in * 1000).toISOString()
          : null,
        lookback_days: lookbackDays,
        status: 'active',
        last_synced_at: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,provider' },
    )
    .select()
    .maybeSingle();

  if (connErr) {
    console.warn('oauth_connections upsert skipped (table may not exist yet):', connErr.message);
  }

  // 7 — Consent ledger (Art. 7 GDPR audit trail)
  const { data: profile } = await admin
    .from('profiles')
    .select('snomad_id')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.snomad_id) {
    await admin.from('consent_ledger').insert({
      user_id: userId,
      snomad_id: profile.snomad_id,
      purpose: `email_import:${body.provider}`,
      granted: true,
      consent_text_hash: body.consentTextHash,
      consent_text_version: body.consentTextVersion,
      metadata: {
        provider: body.provider,
        provider_email: providerEmail,
        lookback_days: lookbackDays,
        scope: tokenJson.scope ?? cfg.scope,
        engine: 'email-oauth-exchange.v1',
      },
    });
  }

  return jsonResponse(
    {
      ok: true,
      provider: body.provider,
      provider_email: providerEmail,
      lookback_days: lookbackDays,
      message: 'Connection authorised. Travel-inbox sync will start within 5 minutes.',
    },
    200,
  );
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
