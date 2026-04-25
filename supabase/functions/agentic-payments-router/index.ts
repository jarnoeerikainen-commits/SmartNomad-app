// ═══════════════════════════════════════════════════════════
// Agentic Payments Router — unified endpoint for AI-driven payments
// Routes between x402, MPP, Visa TAP, Stripe Issuing, Mastercard Cloud.
//
// Actions:
//   quote      → recommend protocol + fee for a given payment request
//   authorize  → create payment intent + (if needed) issue virtual card
//   execute    → settle the intent (calls demo or live provider)
//   refund     → mark transaction refunded
//   status     → fetch current intent state
//
// Demo mode (default): deterministic, no external calls, fully testable.
// Live mode: set AGENTIC_PAYMENT_MODE=live + provider keys.
// ═══════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import {
  selectProtocol, generateIntentId, issueVirtualCard,
  buildX402Required, encodeX402Required, encodeX402Settlement,
  buildMppChallenge, buildMppReceipt,
  buildTapSignature, getDemoSigningKey,
  type PaymentRequest, type Protocol, type Category,
} from "../_shared/agenticPayments.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MODE = (Deno.env.get('AGENTIC_PAYMENT_MODE') || 'demo') as 'demo' | 'live';

interface RouterRequest {
  action: 'quote' | 'authorize' | 'execute' | 'refund' | 'status';
  deviceId: string;
  payment?: PaymentRequest;
  intentId?: string;
  userApproved?: boolean;
}

type AppSupabaseClient = SupabaseClient<any, "public", any>;
type GuardrailResult = {
  approved: boolean;
  auto_execute?: boolean;
  requires_user_approval: boolean;
  guardrail_id?: string | null;
  reason?: string;
};
type DbRow = Record<string, any>;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });

    let userId: string | null = null;
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id ?? null;
    }

    const body: RouterRequest = await req.json();
    if (!body.action || !body.deviceId) {
      return json({ error: 'action and deviceId required' }, 400);
    }

    switch (body.action) {
      case 'quote':
        return json(await handleQuote(body));
      case 'authorize':
        return json(await handleAuthorize(supabase, body, userId));
      case 'execute':
        return json(await handleExecute(supabase, body, userId));
      case 'refund':
        return json(await handleRefund(supabase, body, userId));
      case 'status':
        return json(await handleStatus(supabase, body, userId));
      default:
        return json({ error: `unknown action: ${body.action}` }, 400);
    }
  } catch (err) {
    console.error('[agentic-payments-router] error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: msg }, 500);
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ─── Action: quote ────────────────────────────────────────
async function handleQuote(body: RouterRequest) {
  if (!body.payment) throw new Error('payment field required for quote');
  const quote = selectProtocol(body.payment);
  return {
    success: true,
    mode: MODE,
    quote: {
      ...quote,
      amount: body.payment.amount,
      currency: body.payment.currency,
      category: body.payment.category,
      description: body.payment.description,
      merchant: body.payment.merchant,
    },
  };
}

// ─── Action: authorize ────────────────────────────────────
async function handleAuthorize(supabase: AppSupabaseClient, body: RouterRequest, userId: string | null) {
  if (!body.payment) throw new Error('payment field required for authorize');
  if (!userId) {
    // Demo / device-only mode → return a non-persisted preview
    const quote = selectProtocol(body.payment);
    return {
      success: true,
      mode: MODE,
      previewOnly: true,
      intent: {
        intentId: generateIntentId(),
        protocol: quote.protocol,
        status: 'created',
        ...body.payment,
        guardrail: { approved: true, requires_user_approval: body.payment.amount >= 50, reason: 'demo_preview' },
      },
    };
  }

  const quote = selectProtocol(body.payment);

  // Evaluate guardrail
  const { data: rawGuardrailResult, error: gErr } = await supabase.rpc('evaluate_agentic_guardrail', {
    p_user_id: userId,
    p_amount: body.payment.amount,
    p_currency: body.payment.currency,
    p_category: body.payment.category,
    p_protocol: quote.protocol,
  });
  if (gErr) throw new Error(`guardrail evaluation failed: ${gErr.message}`);
  const guardrailResult = rawGuardrailResult as GuardrailResult;

  const intentId = generateIntentId();

  // Issue virtual card if protocol requires one
  let virtualCardId: string | null = null;
  let virtualCardLast4: string | null = null;
  if (quote.protocol === 'stripe-issuing' || quote.protocol === 'visa-tap' || quote.protocol === 'mastercard-cloud') {
    const issued = await issueVirtualCard({
      amount: body.payment.amount,
      currency: body.payment.currency,
      cardType: 'single-use',
      network: quote.protocol === 'mastercard-cloud' ? 'mastercard' : 'visa',
      merchantLock: body.payment.merchant,
      categoryLock: body.payment.category,
    }, MODE);

    const { data: cardRow, error: cardErr } = await supabase
      .from('agentic_virtual_cards')
      .insert({
        user_id: userId,
        device_id: body.deviceId,
        card_token: issued.cardToken,
        last4: issued.last4,
        network: issued.network,
        card_type: 'single-use',
        amount_authorized: body.payment.amount,
        currency: body.payment.currency,
        merchant_lock: body.payment.merchant,
        category_lock: body.payment.category,
        provider: quote.protocol === 'mastercard-cloud' ? 'mastercard-cloud' : 'stripe-issuing',
        provider_card_id: issued.providerCardId,
        expires_at: issued.expiresAt,
      })
      .select('id, last4')
      .single();
    if (cardErr) throw new Error(`virtual card insert failed: ${cardErr.message}`);
    const typedCardRow = cardRow as { id: string; last4: string };
    virtualCardId = typedCardRow.id;
    virtualCardLast4 = typedCardRow.last4;
  }

  const { data: intent, error: iErr } = await supabase
    .from('agentic_payment_intents')
    .insert({
      intent_id: intentId,
      user_id: userId,
      device_id: body.deviceId,
      protocol: quote.protocol,
      status: guardrailResult.approved && guardrailResult.auto_execute ? 'authorized' : 'created',
      description: body.payment.description,
      amount: body.payment.amount,
      currency: body.payment.currency,
      category: body.payment.category,
      merchant: body.payment.merchant,
      merchant_url: body.payment.merchantUrl,
      ai_initiated: true,
      user_approved: !guardrailResult.requires_user_approval,
      guardrail_id: guardrailResult.guardrail_id ?? null,
      virtual_card_id: virtualCardId,
      protocol_payload: { quote },
      trust_score: quote.trustScore,
      authorized_at: guardrailResult.approved && guardrailResult.auto_execute ? new Date().toISOString() : null,
    })
    .select()
    .single();
  if (iErr) throw new Error(`intent insert failed: ${iErr.message}`);

  return {
    success: true,
    mode: MODE,
    intent,
    virtualCardLast4,
    guardrail: guardrailResult,
    nextStep: guardrailResult.requires_user_approval ? 'await_user_approval' : 'execute',
  };
}

// ─── Action: execute ──────────────────────────────────────
async function handleExecute(supabase: ReturnType<typeof createClient>, body: RouterRequest, userId: string | null) {
  if (!body.intentId) throw new Error('intentId required for execute');
  if (!userId) throw new Error('authentication required to execute payments');

  const { data: rawIntent, error: fErr } = await supabase
    .from('agentic_payment_intents')
    .select('*')
    .eq('intent_id', body.intentId)
    .eq('user_id', userId)
    .single();
  if (fErr || !rawIntent) throw new Error(`intent not found: ${body.intentId}`);
  const intent = rawIntent as DbRow;

  let virtualCardLast4: string | null = null;
  if (intent.virtual_card_id) {
    const { data: card } = await supabase
      .from('agentic_virtual_cards')
      .select('last4')
      .eq('id', intent.virtual_card_id)
      .maybeSingle();
    virtualCardLast4 = (card as { last4?: string } | null)?.last4 ?? null;
  }

  if (intent.status === 'completed') {
    return { success: true, alreadyCompleted: true, intent };
  }

  if (intent.status !== 'authorized' && !body.userApproved) {
    return { success: false, reason: 'requires_user_approval', intent };
  }

  // Build protocol-specific receipt
  const receipt = await buildProtocolReceipt(intent.protocol as Protocol, intent);

  // Mark virtual card used (if any)
  if (intent.virtual_card_id) {
    await supabase.from('agentic_virtual_cards')
      .update({ status: 'used', amount_spent: intent.amount, used_at: new Date().toISOString() })
      .eq('id', intent.virtual_card_id);
  }

  // Update intent → completed
  const { data: updated, error: uErr } = await supabase
    .from('agentic_payment_intents')
    .update({
      status: 'completed',
      receipt,
      completed_at: new Date().toISOString(),
      user_approved: true,
    })
    .eq('id', intent.id)
    .select()
    .single();
  if (uErr) throw new Error(`intent update failed: ${uErr.message}`);

  // Insert immutable transaction
  const { data: txn, error: tErr } = await supabase
    .from('agentic_transactions')
    .insert({
      intent_id: intent.id,
      user_id: userId,
      device_id: body.deviceId,
      protocol: intent.protocol,
      description: intent.description,
      amount: intent.amount,
      currency: intent.currency,
      category: intent.category,
      merchant: intent.merchant,
      status: 'completed',
      ai_initiated: intent.ai_initiated,
      user_approved: true,
      virtual_card_last4: virtualCardLast4,
      crypto_network: intent.protocol === 'x402' ? 'base' : null,
      crypto_tx_hash: intent.protocol === 'x402' ? receipt?.transaction ?? null : null,
      trust_score: intent.trust_score,
      receipt,
    })
    .select()
    .single();
  if (tErr) throw new Error(`transaction insert failed: ${tErr.message}`);

  return { success: true, mode: MODE, intent: updated, transaction: txn, receipt };
}

// ─── Action: refund ───────────────────────────────────────
async function handleRefund(supabase: ReturnType<typeof createClient>, body: RouterRequest, userId: string | null) {
  if (!body.intentId) throw new Error('intentId required');
  if (!userId) throw new Error('authentication required');

  const { data: txn, error } = await supabase
    .from('agentic_transactions')
    .update({ status: 'refunded' })
    .eq('intent_id', (await supabase
      .from('agentic_payment_intents').select('id').eq('intent_id', body.intentId).eq('user_id', userId).single()).data?.id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(`refund failed: ${error.message}`);

  await supabase.from('agentic_payment_intents')
    .update({ status: 'refunded' })
    .eq('intent_id', body.intentId)
    .eq('user_id', userId);

  return { success: true, transaction: txn };
}

// ─── Action: status ───────────────────────────────────────
async function handleStatus(supabase: ReturnType<typeof createClient>, body: RouterRequest, userId: string | null) {
  if (!body.intentId) throw new Error('intentId required');
  if (!userId) throw new Error('authentication required');

  const { data, error } = await supabase
    .from('agentic_payment_intents')
    .select('*')
    .eq('intent_id', body.intentId)
    .eq('user_id', userId)
    .single();
  if (error) throw new Error(`intent not found: ${body.intentId}`);
  return { success: true, intent: data };
}

// ─── Protocol-specific receipt builders ───────────────────
async function buildProtocolReceipt(protocol: Protocol, intent: Record<string, unknown>): Promise<Record<string, unknown>> {
  const amount = Number(intent.amount);
  const currency = String(intent.currency);
  const description = String(intent.description);

  switch (protocol) {
    case 'x402': {
      const required = buildX402Required(
        `https://api.supernomad.app/intents/${intent.intent_id}`,
        amount,
        '0xSUPERNOMADTREASURYDEMO0000000000000000',
        'base',
      );
      const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      return {
        protocol: 'x402',
        version: 2,
        paymentRequiredHeader: encodeX402Required(required),
        settlementResponse: encodeX402Settlement({
          success: true,
          transaction: txHash,
          network: 'base',
          payer: '0xSUPERNOMADAGENTDEMO0000000000000000000',
        }),
        transaction: txHash,
        network: 'base',
      };
    }
    case 'mpp': {
      const challengeId = `mpp_${crypto.randomUUID().slice(0, 12)}`;
      return {
        protocol: 'mpp',
        challenge: buildMppChallenge({
          id: challengeId,
          realm: 'supernomad.app',
          method: 'card',
          intent: 'charge',
          amount: { value: amount.toFixed(2), currency },
          request: btoa(JSON.stringify({ description })),
        }),
        receipt: buildMppReceipt('success', `mpp_tx_${crypto.randomUUID().slice(0, 16)}`, {
          value: amount.toFixed(2),
          currency,
        }),
      };
    }
    case 'visa-tap': {
      const key = await getDemoSigningKey();
      const sig = await buildTapSignature({
        method: 'POST',
        authority: 'pay.supernomad.app',
        path: `/intents/${intent.intent_id}/charge`,
        keyId: 'sn-agent-demo-2026',
        alg: 'hmac-sha256',
        agentIntent: 'commerce',
        consumerRecognition: 'returning',
      }, key);
      return {
        protocol: 'visa-tap',
        rfc9421: {
          'Signature-Input': sig.signatureInput,
          'Signature': sig.signature,
          'Agent-Intent': sig.agentIntent,
        },
        authCode: `tap_${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        amount: amount.toFixed(2),
        currency,
      };
    }
    case 'stripe-issuing':
    case 'mastercard-cloud': {
      return {
        protocol,
        authCode: `${protocol === 'mastercard-cloud' ? 'mc' : 'st'}_${crypto.randomUUID().slice(0, 10).toUpperCase()}`,
        amount: amount.toFixed(2),
        currency,
        network: protocol === 'mastercard-cloud' ? 'mastercard' : 'visa',
      };
    }
  }
}
