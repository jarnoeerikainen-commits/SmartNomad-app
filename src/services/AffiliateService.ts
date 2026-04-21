// ═══════════════════════════════════════════════════════════
// AffiliateService — frontend client for the SuperNomad
// 2-tier referral program. Handles tracking, attribution,
// stats, payouts, and terms acceptance.
// ═══════════════════════════════════════════════════════════

import { supabase } from '@/integrations/supabase/client';

const COOKIE_KEY = 'sn_ref';
const FINGERPRINT_KEY = 'sn_fp';

export type PayoutMethod = 'wallet_credit' | 'usdc_base' | 'stripe_connect' | 'bank_wire';
export type EarningStatus = 'pending' | 'cleared' | 'paid' | 'reversed';
export type PayoutStatus = 'requested' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface AffiliateAccount {
  id: string;
  user_id: string;
  referral_code: string;
  status: 'active' | 'suspended' | 'banned';
  tier: 'standard' | 'super' | 'partner';
  parent_affiliate_id: string | null;
  parent_user_id: string | null;
  payout_method: PayoutMethod;
  payout_address: string | null;
  payout_currency: string;
  pending_balance: number;
  cleared_balance: number;
  wallet_credit_balance: number;
  paid_lifetime: number;
  reversed_lifetime: number;
  total_clicks: number;
  total_signups: number;
  total_paying_referrals: number;
  terms_accepted_version: string | null;
  terms_accepted_at: string | null;
  tax_form_submitted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramSettings {
  l1_commission_rate: number;
  l2_commission_rate: number;
  wallet_credit_split: number;
  withdrawable_split: number;
  hold_days: number;
  cookie_window_days: number;
  min_payout_usd: number;
  recurring_months: number;
  is_active: boolean;
  terms_version: string;
}

export interface AffiliateEarning {
  id: string;
  level: 1 | 2;
  source_type: string;
  base_amount: number;
  commission_rate: number;
  commission_amount: number;
  wallet_credit_amount: number;
  withdrawable_amount: number;
  currency: string;
  status: EarningStatus;
  hold_until: string;
  cleared_at: string | null;
  paid_at: string | null;
  description: string | null;
  created_at: string;
}

export interface AffiliatePayout {
  id: string;
  amount: number;
  currency: string;
  payout_method: PayoutMethod;
  payout_address: string | null;
  status: PayoutStatus;
  fee_amount: number;
  net_amount: number;
  external_tx_hash: string | null;
  failure_reason: string | null;
  requested_at: string;
  completed_at: string | null;
}

export interface AffiliateStats {
  account: AffiliateAccount;
  l1_referrals: Array<{ id: string; signup_at: string; first_payment_at: string | null; status: string }>;
  l2_referrals: Array<{ id: string; signup_at: string; first_payment_at: string | null; status: string }>;
  recent_earnings: AffiliateEarning[];
  payouts: AffiliatePayout[];
}

function fingerprint(): string {
  let fp = localStorage.getItem(FINGERPRINT_KEY);
  if (!fp) {
    const seed = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
    ].join('|');
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
    fp = 'fp_' + Math.abs(h).toString(36);
    localStorage.setItem(FINGERPRINT_KEY, fp);
  }
  return fp;
}

async function call<T = unknown>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke('affiliate-router', {
    body: { action, ...body },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export const AffiliateService = {
  /** Reads ?ref= from URL, stores in localStorage, fires server-side click. */
  async captureRefFromUrl(): Promise<void> {
    try {
      const url = new URL(window.location.href);
      const ref = (url.searchParams.get('ref') || '').toUpperCase();
      if (!ref) return;

      // Don't double-fire within window
      const existing = JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null');
      if (existing?.code === ref && Date.now() - existing.t < 1000 * 60 * 60 * 24) return;

      const click_id = await this.trackClick(ref);
      if (click_id) {
        localStorage.setItem(COOKIE_KEY, JSON.stringify({
          code: ref, click_id, t: Date.now(),
        }));
      }
    } catch (e) {
      console.warn('[affiliate] capture failed', e);
    }
  },

  async trackClick(referral_code: string): Promise<string | null> {
    const url = new URL(window.location.href);
    const result = await call<{ click_id: string; tracked: boolean }>('track-click', {
      referral_code,
      fingerprint: fingerprint(),
      landing: url.pathname,
      utm_source: url.searchParams.get('utm_source'),
      utm_medium: url.searchParams.get('utm_medium'),
      utm_campaign: url.searchParams.get('utm_campaign'),
      referer: document.referrer || null,
    });
    return result?.tracked ? result.click_id : null;
  },

  /** Call after a successful signup to bind the click to this user. */
  async attributeIfPending(): Promise<void> {
    try {
      const stored = JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null');
      if (!stored?.click_id) return;
      await call('attribute', { click_id: stored.click_id });
      localStorage.removeItem(COOKIE_KEY);
    } catch (e) {
      console.warn('[affiliate] attribute failed', e);
    }
  },

  async getAccount(): Promise<{ account: AffiliateAccount; settings: ProgramSettings }> {
    return call('account');
  },

  async getStats(): Promise<AffiliateStats> {
    return call('stats');
  },

  async getSettings(): Promise<{ settings: ProgramSettings }> {
    return call('get-settings');
  },

  async acceptTerms(): Promise<{ account: AffiliateAccount }> {
    return call('accept-terms');
  },

  async updatePayoutMethod(payout_method: PayoutMethod, payout_address?: string, payout_currency = 'USD') {
    return call<{ account: AffiliateAccount }>('update-payout-method', {
      payout_method, payout_address, payout_currency,
    });
  },

  async requestPayout(amount: number, payout_method: PayoutMethod, payout_address?: string) {
    return call<{ success: boolean; payout_id?: string; amount?: number; fee?: number; net?: number; error?: string }>(
      'request-payout',
      { amount, payout_method, payout_address }
    );
  },

  shareLink(code: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://supernomad1.lovable.app';
    return `${origin}/r/${code}`;
  },

  formatUSD(n: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
  },
};
