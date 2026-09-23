import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { buildDemoOffers, hasReconciledSupplierOrder, maskSensitiveText, validateSearch, type CommerceOffer, type PaymentRail } from '../_shared/travelCommerce.ts';

type Action = 'search' | 'prepare' | 'approve' | 'execute' | 'status' | 'cancel';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return respond({ error: 'method_not_allowed' }, 405);
  try {
    const body = await req.json() as Record<string, unknown>;
    const action = body.action as Action;
    if (!['search', 'prepare', 'approve', 'execute', 'status', 'cancel'].includes(action)) return respond({ error: 'invalid_action' }, 400);

    const requestedMode = body.mode === 'live' || body.mode === 'sandbox' ? body.mode : 'demo';
    if (requestedMode !== 'demo') {
      return respond({
        error: 'provider_not_configured',
        safeMessage: 'Live booking is unavailable until an authorized supplier account, tokenized payment provider, and fulfilment webhooks are connected.',
        mode: requestedMode,
      }, 503);
    }

    if (action === 'search') {
      const search = validateSearch(body.search);
      return respond({ success: true, mode: 'demo', source: 'Duffel test-mode shaped demo', offers: buildDemoOffers(search) });
    }

    const offer = validateOffer(body.offer);
    if (action === 'prepare') {
      return respond({ success: true, mode: 'demo', order: buildDemoOrder(offer, 'approval_required') });
    }
    if (action === 'approve') {
      if (new Date(offer.expiresAt) <= new Date()) return respond({ error: 'offer_expired', safeMessage: 'This price expired. Refresh it before approving.' }, 409);
      return respond({ success: true, mode: 'demo', order: buildDemoOrder(offer, 'payment_authorized'), approval: { authenticationStrength: 'voice_plus_visual', decision: 'approved', sensitiveDataStored: false } });
    }
    if (action === 'execute') {
      if (body.explicitApproval !== true) return respond({ error: 'explicit_approval_required', safeMessage: 'Review the final price and choose Approve & simulate before continuing.' }, 403);
      const rail = validateRail(body.paymentRail);
      const order = buildDemoOrder(offer, 'confirmed');
      order.supplierOrderId = `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      order.reconciliationStatus = 'matched';
      return respond({
        success: true,
        mode: 'demo',
        simulated: true,
        charged: false,
        ticketIssued: false,
        order,
        payment: { rail, status: 'simulated', providerTransactionReference: null },
        message: 'Demo complete — no booking was made and no money moved.',
        reconciled: hasReconciledSupplierOrder({ supplierOrderId: order.supplierOrderId, reconciliationStatus: order.reconciliationStatus }),
      });
    }
    if (action === 'cancel') return respond({ success: true, mode: 'demo', status: 'cancelled', message: 'Demo proposal cancelled. No supplier booking existed.' });
    return respond({ success: true, mode: 'demo', status: 'approval_required', offer });
  } catch (error) {
    const message = maskSensitiveText(error instanceof Error ? error.message : 'request_failed');
    return respond({ error: 'invalid_request', safeMessage: message }, 400);
  }
});

function validateOffer(value: unknown): CommerceOffer {
  if (!value || typeof value !== 'object') throw new Error('offer required');
  const offer = value as CommerceOffer;
  if (!/^demo_(flight|hotel)_\d{6}$/.test(offer.offerId)) throw new Error('invalid demo offer');
  if (offer.mode !== 'demo' || !['flight', 'hotel'].includes(offer.bookingType)) throw new Error('invalid offer mode');
  if (!Number.isFinite(offer.amount) || offer.amount <= 0 || !/^[A-Z]{3}$/.test(offer.currency)) throw new Error('invalid offer price');
  return offer;
}

function validateRail(value: unknown): PaymentRail {
  if (value === 'lightspark-uma' || value === 'stablecoin-settlement') return value;
  return 'tokenized-card';
}

function buildDemoOrder(offer: CommerceOffer, status: string) {
  return {
    publicOrderId: `SN-DEMO-${offer.offerId.slice(-6)}`,
    supplier: offer.supplier,
    supplierOfferId: offer.offerId,
    supplierOrderId: null as string | null,
    status,
    approvalStatus: status === 'approval_required' ? 'required' : 'approved',
    paymentStatus: status === 'payment_authorized' || status === 'confirmed' ? 'authorized' : 'not_started',
    amount: offer.amount,
    currency: offer.currency,
    offerExpiresAt: offer.expiresAt,
    cancellationTerms: offer.cancellationTerms,
    reconciliationStatus: 'not_started',
    idempotencyKey: `demo:${offer.offerId}`,
    traveller: { displayName: 'John Smith', citizenship: 'FI', passport: '••••8550', documentStatus: 'demo-encrypted' },
  };
}

function respond(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}