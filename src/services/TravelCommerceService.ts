import { supabase } from '@/integrations/supabase/client';

export type BookingType = 'flight' | 'hotel';
export type PaymentRail = 'tokenized-card' | 'lightspark-uma' | 'stablecoin-settlement';

export interface TravelSearch {
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
  supplier: string;
  mode: 'demo' | 'sandbox' | 'live';
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
  pricing: { base: number; taxesAndMandatoryFees: number; total: number };
  itinerary: {
    originLabel: string; destinationLabel: string; departureLocal: string; arrivalLocal: string;
    returnDepartureLocal?: string; returnArrivalLocal?: string; duration: string;
    carrierOrProperty: string; serviceOrRoom: string; fareOrRate: string; checkIn?: string; checkOut?: string;
    tripType: 'one_way' | 'return' | 'stay';
    legs: Array<{ direction: 'outbound' | 'return'; originLabel: string; destinationLabel: string; departureLocal: string; arrivalLocal: string; duration: string; service: string }>;
  };
  included: string[];
  optionalServices: Array<{ id: string; category: 'seat' | 'baggage' | 'hotel-extra'; label: string; description: string; amount: number; currency: string }>;
}

export interface DemoBookingResult {
  success: boolean;
  mode: 'demo';
  simulated: true;
  charged: false;
  ticketIssued: false;
  roomReserved: false;
  reconciled: boolean;
  message: string;
  order: {
    publicOrderId: string; supplier: string; supplierOrderId: string; status: string; amount: number; currency: string;
    itinerary: CommerceOffer['itinerary']; included: string[];
    lineItems: Array<{ id: string; label: string; amount: number; currency: string; mandatory: boolean }>;
    selectedServices: CommerceOffer['optionalServices']; cancellationTerms: string; reconciliationStatus: string;
    traveller: { displayName: string; citizenship: string; city: string; passport: string; documentStatus: string };
  };
  payment: { rail: PaymentRail; status: 'simulated'; providerTransactionReference: null; fundingLabel: string };
  auditTimeline: Array<{ step: 'quote_verified' | 'user_approved' | 'payment_simulated' | 'supplier_simulated' | 'reconciled'; status: 'completed'; at: string }>;
}

async function invoke(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('travel-commerce', { body: { mode: 'demo', ...body } });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.safeMessage || data.error);
  return data;
}

export const TravelCommerceService = {
  async search(search: TravelSearch): Promise<CommerceOffer[]> {
    const data = await invoke({ action: 'search', search });
    return data.offers || [];
  },
  prepare(offer: CommerceOffer) {
    return invoke({ action: 'prepare', offer });
  },
  approve(offer: CommerceOffer) {
    return invoke({ action: 'approve', offer });
  },
  executeDemo(offer: CommerceOffer, paymentRail: PaymentRail, selectedServiceIds: string[]): Promise<DemoBookingResult> {
    return invoke({ action: 'execute', offer, paymentRail, selectedServiceIds, explicitApproval: true });
  },
  cancel(offer: CommerceOffer) {
    return invoke({ action: 'cancel', offer });
  },
};