export type CommerceMode = 'demo' | 'sandbox' | 'live';
export type BookingType = 'flight' | 'hotel';
export type PaymentRail = 'tokenized-card' | 'lightspark-uma' | 'stablecoin-settlement';

export interface SearchRequest {
  bookingType: BookingType;
  origin?: string;
  destination: string;
  startDate: string;
  endDate?: string;
  adults?: number;
  cabin?: 'economy' | 'premium_economy' | 'business' | 'first';
}

export interface CommerceOffer {
  offerId: string;
  bookingType: BookingType;
  supplier: 'Duffel' | 'Duffel Stays';
  mode: CommerceMode;
  title: string;
  summary: string;
  amount: number;
  currency: string;
  verifiedAt: string;
  expiresAt: string;
  cancellationTerms: string;
  baggageOrRoom: string;
  sourceUrl: string;
  holdSupported: boolean;
  requiresReprice: boolean;
}

const IATA_PATTERN = /^[A-Z]{3}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function validateSearch(input: unknown): SearchRequest {
  if (!input || typeof input !== 'object') throw new Error('search input required');
  const value = input as Record<string, unknown>;
  if (value.bookingType !== 'flight' && value.bookingType !== 'hotel') throw new Error('bookingType must be flight or hotel');
  const destination = String(value.destination || '').trim();
  const startDate = String(value.startDate || '').trim();
  if (!destination || destination.length > 120) throw new Error('valid destination required');
  if (!DATE_PATTERN.test(startDate) || Number.isNaN(Date.parse(`${startDate}T00:00:00Z`))) throw new Error('valid startDate required');
  if (value.bookingType === 'flight') {
    const origin = String(value.origin || '').toUpperCase();
    const arrival = destination.toUpperCase();
    if (!IATA_PATTERN.test(origin) || !IATA_PATTERN.test(arrival)) throw new Error('flight origin and destination must be 3-letter airport codes');
  }
  const endDate = value.endDate ? String(value.endDate) : undefined;
  if (endDate && (!DATE_PATTERN.test(endDate) || Number.isNaN(Date.parse(`${endDate}T00:00:00Z`)))) throw new Error('valid endDate required');
  if (endDate && endDate <= startDate) throw new Error('endDate must be after startDate');
  const adults = Number(value.adults || 1);
  if (!Number.isInteger(adults) || adults < 1 || adults > 9) throw new Error('adults must be between 1 and 9');
  const cabins = ['economy', 'premium_economy', 'business', 'first'];
  const cabin = cabins.includes(String(value.cabin)) ? value.cabin as SearchRequest['cabin'] : 'business';
  return { bookingType: value.bookingType, origin: value.origin ? String(value.origin).toUpperCase() : undefined, destination, startDate, endDate, adults, cabin };
}

function stableNumber(seed: string, min: number, range: number): number {
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return min + (Math.abs(hash) % range);
}

export function buildDemoOffers(search: SearchRequest, now = new Date()): CommerceOffer[] {
  const verifiedAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + 15 * 60_000).toISOString();
  const route = search.bookingType === 'flight'
    ? `${search.origin}–${search.destination}`
    : `${search.destination} · ${search.startDate} to ${search.endDate || 'select checkout'}`;
  const base = search.bookingType === 'flight'
    ? stableNumber(`${route}:${search.startDate}:${search.cabin}`, 420, 780)
    : stableNumber(`${route}:${search.adults}`, 180, 360);
  return [0, 1].map((index) => ({
    offerId: `demo_${search.bookingType}_${stableNumber(`${route}:${index}`, 100000, 899999)}`,
    bookingType: search.bookingType,
    supplier: search.bookingType === 'flight' ? 'Duffel' : 'Duffel Stays',
    mode: 'demo',
    title: search.bookingType === 'flight'
      ? `${index === 0 ? 'Direct' : 'Flexible'} ${search.cabin?.replace('_', ' ')} fare`
      : `${index === 0 ? 'Premium room' : 'Flexible room'} in ${search.destination}`,
    summary: `${route} · ${search.adults || 1} traveller${(search.adults || 1) > 1 ? 's' : ''}`,
    amount: base + index * (search.bookingType === 'flight' ? 145 : 70),
    currency: 'EUR',
    verifiedAt,
    expiresAt,
    cancellationTerms: index === 0 ? 'Changes may carry a supplier fee; refundability must be rechecked before approval.' : 'Flexible demo rate; live terms come from the supplier at repricing.',
    baggageOrRoom: search.bookingType === 'flight' ? '1 checked bag · seat subject to supplier confirmation' : '1 room · taxes shown in final supplier quote',
    sourceUrl: 'https://duffel.com/docs/api/overview/test-mode',
    holdSupported: search.bookingType === 'flight' && index === 1,
    requiresReprice: true,
  }));
}

export function maskSensitiveText(value: string): string {
  return value
    .replace(/\b[A-Z]{2}\s?\d{6}\b/gi, '••••••••')
    .replace(/\+?\d[\d\s()-]{7,}\d/g, '••••')
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, '••••');
}

export function canUseMandate(params: {
  status: string;
  validFrom: string;
  validUntil: string;
  amount: number;
  maxPerBooking: number;
  bookingType: BookingType;
  allowedBookingTypes: string[];
  supplier: string;
  allowedSuppliers: string[];
  paymentRail: PaymentRail;
  allowedPaymentRails: string[];
  currency: string;
  allowedCurrencies: string[];
  riskLevel?: number;
  priceChanged?: boolean;
  requireFreshApprovalOnPriceChange?: boolean;
}, now = new Date()): { allowed: boolean; reason: string } {
  if (params.status !== 'active') return { allowed: false, reason: 'mandate_not_active' };
  if (now < new Date(params.validFrom) || now >= new Date(params.validUntil)) return { allowed: false, reason: 'mandate_outside_validity' };
  if (params.riskLevel === 4) return { allowed: false, reason: 'danger_gate_level_4' };
  if (params.amount > params.maxPerBooking) return { allowed: false, reason: 'exceeds_booking_limit' };
  if (!params.allowedBookingTypes.includes(params.bookingType)) return { allowed: false, reason: 'booking_type_not_allowed' };
  if (params.allowedSuppliers.length && !params.allowedSuppliers.includes(params.supplier)) return { allowed: false, reason: 'supplier_not_allowed' };
  if (!params.allowedPaymentRails.includes(params.paymentRail)) return { allowed: false, reason: 'payment_rail_not_allowed' };
  if (!params.allowedCurrencies.includes(params.currency)) return { allowed: false, reason: 'currency_not_allowed' };
  if (params.priceChanged && params.requireFreshApprovalOnPriceChange !== false) return { allowed: false, reason: 'fresh_approval_required_after_price_change' };
  return { allowed: true, reason: 'mandate_eligible' };
}

export function hasReconciledSupplierOrder(order: { supplierOrderId?: string | null; reconciliationStatus?: string }): boolean {
  return Boolean(order.supplierOrderId && order.reconciliationStatus === 'matched');
}