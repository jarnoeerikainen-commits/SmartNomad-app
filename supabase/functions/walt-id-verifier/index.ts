// walt-id-verifier — Production scaffold for SuperNomad Trust Pass
//
// In DEMO MODE the frontend never calls this function (everything is simulated client-side).
// This function exists as a production-ready scaffold so flipping VITE_VERIFICATION_MODE=live
// in the frontend works end-to-end.
//
// To enable real walt.id integration:
//   1. Deploy walt.id Community Stack to your infra (or use their hosted enterprise tier)
//   2. Add WALT_ID_ISSUER_URL and WALT_ID_VERIFIER_URL secrets
//   3. (Optional) Add ONFIDO_API_TOKEN secret for biometric liveness
//   4. Uncomment the real OID4VC calls below
//
// Standards: W3C Verifiable Credentials 2.0, SD-JWT-VC, OID4VC, OID4VP, eIDAS 2.0
// Reference: https://docs.walt.id/community-stack/issuer

import { corsHeaders } from '@supabase/supabase-js/cors';

interface IssueRequest {
  action: 'issue' | 'verify';
  type?: string;
  claims?: Record<string, unknown>;
  did?: string;
  presentation?: string;
}

const WALT_ID_ISSUER_URL = Deno.env.get('WALT_ID_ISSUER_URL'); // e.g. https://issuer.walt.id
const WALT_ID_VERIFIER_URL = Deno.env.get('WALT_ID_VERIFIER_URL'); // e.g. https://verifier.walt.id
const ONFIDO_API_TOKEN = Deno.env.get('ONFIDO_API_TOKEN'); // optional, for biometric liveness

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: IssueRequest = await req.json();

    if (!body.action || !['issue', 'verify'].includes(body.action)) {
      return new Response(
        JSON.stringify({ error: 'action must be "issue" or "verify"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── If real walt.id is not configured, return a clear stub response ──
    // The frontend handles all simulation in demo mode; this branch only fires
    // if VITE_VERIFICATION_MODE=live was set without configuring walt.id secrets.
    if (!WALT_ID_ISSUER_URL || !WALT_ID_VERIFIER_URL) {
      return new Response(
        JSON.stringify({
          error: 'walt.id not configured',
          message: 'Set WALT_ID_ISSUER_URL and WALT_ID_VERIFIER_URL secrets to enable live verification.',
          docs: 'https://docs.walt.id/community-stack',
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (body.action === 'issue') {
      // ── REAL OID4VC ISSUANCE FLOW (uncomment when walt.id is deployed) ──
      //
      // const issuanceReq = await fetch(`${WALT_ID_ISSUER_URL}/openid4vc/jwt/issue`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     issuanceKey: { type: 'jwk', jwk: ISSUER_JWK },
      //     issuerDid: 'did:web:supernomad.app',
      //     credentialConfigurationId: body.type,
      //     credentialData: {
      //       '@context': ['https://www.w3.org/2018/credentials/v1'],
      //       type: ['VerifiableCredential', body.type],
      //       credentialSubject: { id: body.did, ...body.claims },
      //     },
      //     mapping: { id: '<uuid>', issuer: { id: '<issuerDid>' }, issuanceDate: '<timestamp>' },
      //   }),
      // });
      // const offer = await issuanceReq.text(); // openid-credential-offer://...
      // return new Response(JSON.stringify({ offer }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }});

      return new Response(
        JSON.stringify({
          status: 'scaffold',
          message: 'Issuance endpoint scaffolded. Uncomment OID4VC flow + deploy walt.id to enable.',
          requestedType: body.type,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (body.action === 'verify') {
      // ── REAL OID4VP VERIFICATION FLOW (uncomment when walt.id is deployed) ──
      //
      // const verifyReq = await fetch(`${WALT_ID_VERIFIER_URL}/openid4vc/verify`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'authorizeBaseUrl': 'openid4vp://' },
      //   body: JSON.stringify({
      //     request_credentials: [{ format: 'jwt_vc_json', type: body.type }],
      //   }),
      // });
      // const { url, sessionId } = await verifyReq.json();
      // return new Response(JSON.stringify({ verifyUrl: url, sessionId }), { headers: ... });

      return new Response(
        JSON.stringify({
          status: 'scaffold',
          message: 'Verification endpoint scaffolded.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('walt-id-verifier error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
