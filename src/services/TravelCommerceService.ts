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
  executeDemo(offer: CommerceOffer, paymentRail: PaymentRail) {
    return invoke({ action: 'execute', offer, paymentRail, explicitApproval: true });
  },
  cancel(offer: CommerceOffer) {
    return invoke({ action: 'cancel', offer });
  },
};