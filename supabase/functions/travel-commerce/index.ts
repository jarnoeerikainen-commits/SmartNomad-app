import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { buildBookingLineItems, buildDemoOffers, hasReconciledSupplierOrder, maskSensitiveText, totalLineItems, validateSearch, type CommerceOffer, type PaymentRail } from '../_shared/travelCommerce.ts';

type Action = 'search' | 'prepare' | 'approve' | 'execute' | 'status' | 'cancel';

// The app's shared Supabase client sends x-device-id on every request so guest
// activity can be scoped safely. The SDK defaults do not include that header,
// which causes browsers to stop at preflight before this function is reached.
export const travelCommerceCorsHeaders = {
  ...corsHeaders,
  'Access-Control-Allow-Headers': `${corsHeaders['Access-Control-Allow-Headers']}, x-device-id`,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: travelCommerceCorsHeaders });
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
      const selectedServiceIds = validateSelectedServices(body.selectedServiceIds, offer);
      const order = buildDemoOrder(offer, 'simulated_complete', selectedServiceIds);
      order.supplierOrderId = `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      order.reconciliationStatus = 'matched';
      return respond({
        success: true,
        mode: 'demo',
        simulated: true,
        charged: false,
        ticketIssued: false,
        roomReserved: false,
        order,
        payment: { rail, status: 'simulated', providerTransactionReference: null, fundingLabel: 'Demo credits · no monetary value' },
        auditTimeline: [
          { step: 'quote_verified', status: 'completed', at: new Date().toISOString() },
          { step: 'user_approved', status: 'completed', at: new Date().toISOString() },
          { step: 'payment_simulated', status: 'completed', at: new Date().toISOString() },
          { step: 'supplier_simulated', status: 'completed', at: new Date().toISOString() },
          { step: 'reconciled', status: 'completed', at: new Date().toISOString() },
        ],
        message: 'Simulation complete. No ticket, room, ride or payment was created.',
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
  if (!offer.pricing || offer.pricing.total !== offer.amount || !Array.isArray(offer.optionalServices)) throw new Error('invalid offer breakdown');
  return offer;
}

function validateSelectedServices(value: unknown, offer: CommerceOffer): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 10 || value.some((id) => typeof id !== 'string' || id.length > 80)) throw new Error('invalid selected services');
  const allowed = new Set(offer.optionalServices.map((service) => service.id));
  if (value.some((id) => !allowed.has(id))) throw new Error('unknown selected service');
  return [...new Set(value)];
}

function validateRail(value: unknown): PaymentRail {
  if (value === 'lightspark-uma' || value === 'stablecoin-settlement') return value;
  return 'tokenized-card';
}

function buildDemoOrder(offer: CommerceOffer, status: string, selectedServiceIds: string[] = []) {
  const lineItems = buildBookingLineItems(offer, selectedServiceIds);
  const selectedServices = offer.optionalServices.filter((service) => selectedServiceIds.includes(service.id));
  return {
    publicOrderId: `SN-DEMO-${offer.offerId.slice(-6)}`,
    supplier: offer.supplier,
    supplierOfferId: offer.offerId,
    supplierOrderId: null as string | null,
    status,
    approvalStatus: status === 'approval_required' ? 'required' : 'approved',
    paymentStatus: status === 'payment_authorized' || status === 'confirmed' ? 'authorized' : 'not_started',
    amount: totalLineItems(lineItems),
    currency: offer.currency,
    offerExpiresAt: offer.expiresAt,
    cancellationTerms: offer.cancellationTerms,
    reconciliationStatus: 'not_started',
    idempotencyKey: `demo:${offer.offerId}`,
    itinerary: offer.itinerary,
    included: offer.included,
    lineItems,
    selectedServices,
    traveller: { displayName: 'John', citizenship: 'FI', city: 'Tampere', passport: '••••8550', documentStatus: 'masked-demo-only' },
  };
}

function respond(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { ...travelCommerceCorsHeaders, 'Content-Type': 'application/json' } });
}