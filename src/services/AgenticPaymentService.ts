// ═══════════════════════════════════════════════════════════
// AgenticPaymentService — frontend client for the
// agentic-payments-router edge function.
// Demo mode works without auth; live actions require auth.
// ═══════════════════════════════════════════════════════════

import { supabase } from "@/integrations/supabase/client";

export type Protocol = 'x402' | 'mpp' | 'visa-tap' | 'stripe-issuing' | 'mastercard-cloud';

export type PaymentCategory =
  | 'micro-payment' | 'data-query' | 'api-call'
  | 'booking' | 'dining' | 'transport' | 'subscription'
  | 'shopping' | 'wellness' | 'concierge';

export interface PaymentRequest {
  amount: number;
  currency: string;
  category: PaymentCategory;
  description: string;
  merchant?: string;
  merchantUrl?: string;
  preferredProtocol?: Protocol;
}

export interface QuoteResult {
  protocol: Protocol;
  estimatedFee: number;
  trustScore: number;
  reasoning: string;
  settlementTime: string;
  cryptoNetwork?: 'base' | 'solana' | 'ethereum';
  amount: number;
  currency: string;
  category: PaymentCategory;
  description: string;
  merchant?: string;
}

function getDeviceId(): string {
  const key = 'supernomad_device_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

async function call(action: string, body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('agentic-payments-router', {
    body: { action, deviceId: getDeviceId(), ...body },
  });
  if (error) throw new Error(error.message);
  return data;
}

export const AgenticPaymentService = {
  async quote(payment: PaymentRequest): Promise<{ success: boolean; mode: string; quote: QuoteResult }> {
    return call('quote', { payment });
  },

  async authorize(payment: PaymentRequest) {
    return call('authorize', { payment });
  },

  async execute(intentId: string, userApproved = true) {
    return call('execute', { intentId, userApproved });
  },

  async refund(intentId: string) {
    return call('refund', { intentId });
  },

  async status(intentId: string) {
    return call('status', { intentId });
  },

  // Convenience: full happy path (quote → authorize → execute) for AI-led actions
  async payNow(payment: PaymentRequest) {
    const auth = await this.authorize(payment);
    if (auth.intent && auth.nextStep === 'execute') {
      return await this.execute(auth.intent.intent_id);
    }
    return auth;
  },
};
