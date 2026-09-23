import { assertEquals, assert } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { buildBookingLineItems, buildDemoOffers, canUseMandate, hasReconciledSupplierOrder, maskSensitiveText, totalLineItems, validateSearch } from '../_shared/travelCommerce.ts';

Deno.test('browser CORS permits the shared client device header', async () => {
  const source = await Deno.readTextFile(new URL('./index.ts', import.meta.url));
  assert(source.includes("'Access-Control-Allow-Headers': `${corsHeaders['Access-Control-Allow-Headers']}, x-device-id`"));
  assert(source.includes("new Response('ok', { headers: travelCommerceCorsHeaders })"));
});

Deno.test('validates flight search and builds transparent demo offers', () => {
  const search = validateSearch({ bookingType: 'flight', origin: 'HEL', destination: 'DXB', startDate: '2026-12-20', adults: 1, cabin: 'business' });
  const offers = buildDemoOffers(search, new Date('2026-09-23T11:00:00Z'));
  assertEquals(offers.length, 2);
  assertEquals(offers[0].mode, 'demo');
  assertEquals(offers[0].supplier, 'Duffel');
  assert(offers[0].expiresAt > offers[0].verifiedAt);
  assertEquals(offers[0].pricing.total, offers[0].amount);
  assertEquals(offers[0].included.includes('1 checked bag · 23 kg'), true);
  assertEquals(offers[0].optionalServices.length, 3);
  assertEquals(offers[0].optionalServices[0].category, 'seat');
  assertEquals(offers[0].optionalServices[1].category, 'baggage');
});

Deno.test('optional ancillaries are opt-in and update the all-in total deterministically', () => {
  const search = validateSearch({ bookingType: 'flight', origin: 'HEL', destination: 'DXB', startDate: '2026-12-20', adults: 1, cabin: 'business' });
  const first = buildDemoOffers(search, new Date('2026-09-23T11:00:00Z'))[0];
  const again = buildDemoOffers(search, new Date('2026-09-23T11:00:00Z'))[0];
  assertEquals(first, again);
  const mandatory = buildBookingLineItems(first, []);
  assertEquals(totalLineItems(mandatory), first.amount);
  const selected = buildBookingLineItems(first, [first.optionalServices[0].id, first.optionalServices[1].id]);
  assertEquals(totalLineItems(selected), first.amount + first.optionalServices[0].amount + first.optionalServices[1].amount);
});

Deno.test('hotel offer discloses mandatory fees and opt-in extras', () => {
  const offer = buildDemoOffers(validateSearch({ bookingType: 'hotel', destination: 'Dubai', startDate: '2026-12-20', endDate: '2026-12-24', adults: 1 }), new Date('2026-09-23T11:00:00Z'))[0];
  assert(offer.pricing.taxesAndMandatoryFees > 0);
  assertEquals(offer.itinerary.duration, '4 night(s)');
  assertEquals(offer.optionalServices.every((service) => service.category === 'hotel-extra'), true);
});

Deno.test('rejects invalid airport codes', () => {
  let failed = false;
  try { validateSearch({ bookingType: 'flight', origin: 'Helsinki', destination: 'DXB', startDate: '2026-12-20' }); } catch { failed = true; }
  assert(failed);
});

Deno.test('redacts passport, phone and card-like values', () => {
  const redacted = maskSensitiveText('passport ZZ 123456 phone +000 000 0000 card 4111 1111 1111 1111');
  assert(!redacted.includes('123456'));
  assert(!redacted.includes('000 0000'));
  assert(!redacted.includes('4111 1111'));
});

Deno.test('mandates fail closed for danger level 4 and changed price', () => {
  const base = { status: 'active', validFrom: '2026-01-01T00:00:00Z', validUntil: '2027-01-01T00:00:00Z', amount: 500, maxPerBooking: 1000, bookingType: 'flight' as const, allowedBookingTypes: ['flight'], supplier: 'Duffel', allowedSuppliers: ['Duffel'], paymentRail: 'tokenized-card' as const, allowedPaymentRails: ['tokenized-card'], currency: 'EUR', allowedCurrencies: ['EUR'] };
  assertEquals(canUseMandate({ ...base, riskLevel: 4 }, new Date('2026-09-23T11:00:00Z')).reason, 'danger_gate_level_4');
  assertEquals(canUseMandate({ ...base, priceChanged: true }, new Date('2026-09-23T11:00:00Z')).reason, 'fresh_approval_required_after_price_change');
});

Deno.test('confirmation requires supplier reference and reconciliation match', () => {
  assertEquals(hasReconciledSupplierOrder({ supplierOrderId: null, reconciliationStatus: 'matched' }), false);
  assertEquals(hasReconciledSupplierOrder({ supplierOrderId: 'ord_123', reconciliationStatus: 'pending' }), false);
  assertEquals(hasReconciledSupplierOrder({ supplierOrderId: 'ord_123', reconciliationStatus: 'matched' }), true);
});