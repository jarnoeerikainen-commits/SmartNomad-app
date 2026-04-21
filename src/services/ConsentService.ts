// ConsentService — GDPR Art. 7 compliant consent ledger client
// Records every consent decision with version + hash of consent text shown.

import { supabase } from '@/integrations/supabase/client';
import { SnomadIdService } from './SnomadIdService';

export type ConsentPurpose =
  | 'partner_offers.insurance'
  | 'partner_offers.relocation'
  | 'partner_offers.banking'
  | 'partner_offers.real_estate'
  | 'partner_offers.luxury'
  | 'analytics.aggregate'
  | 'analytics.research'
  | 'marketing.email'
  | 'marketing.personalization'
  | 'data_sharing.anonymized_market'
  | 'ai.profile_learning';

export interface ConsentDecision {
  purpose: ConsentPurpose;
  granted: boolean;
  partnerId?: string;
  consentTextVersion: string;
  consentTextHash: string;
  metadata?: Record<string, unknown>;
  expiresAt?: string;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const ConsentService = {
  async hashText(text: string): Promise<string> {
    return sha256Hex(text);
  },

  /** Record a consent decision. Auth required. */
  async record(decision: ConsentDecision): Promise<{ ok: boolean; id?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { ok: false, error: 'auth_required' };

      const snomadId = await SnomadIdService.fetchMine();
      if (!snomadId) return { ok: false, error: 'snomad_id_missing' };

      const ua = typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 500) : null;

      const { data, error } = await supabase
        .from('consent_ledger')
        .insert({
          user_id: user.id,
          snomad_id: snomadId,
          purpose: decision.purpose,
          partner_id: decision.partnerId ?? null,
          granted: decision.granted,
          consent_text_version: decision.consentTextVersion,
          consent_text_hash: decision.consentTextHash,
          user_agent: ua,
          metadata: decision.metadata ?? {},
          expires_at: decision.expiresAt ?? null,
        })
        .select('id')
        .single();

      if (error) return { ok: false, error: error.message };
      return { ok: true, id: data.id };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  },

  /** Get the most recent decision per purpose for the current user. */
  async getMyConsents(): Promise<Record<string, { granted: boolean; createdAt: string; partnerId?: string | null }>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};

    const { data, error } = await supabase
      .from('consent_ledger')
      .select('purpose, granted, created_at, partner_id, expires_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error || !data) return {};

    const latest: Record<string, { granted: boolean; createdAt: string; partnerId?: string | null }> = {};
    for (const row of data) {
      const key = `${row.purpose}::${row.partner_id ?? 'global'}`;
      if (!latest[key]) {
        if (row.expires_at && new Date(row.expires_at) < new Date()) continue;
        latest[key] = {
          granted: row.granted,
          createdAt: row.created_at,
          partnerId: row.partner_id,
        };
      }
    }
    return latest;
  },

  /** Get full audit history for current user. */
  async getMyHistory(limit = 100) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('consent_ledger')
      .select('id, purpose, granted, partner_id, consent_text_version, created_at, expires_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    return error ? [] : (data ?? []);
  },

  /** Get partner queries that touched the current user's pseudonymous data. */
  async getMyDataAccessLog(limit = 50) {
    const { data, error } = await supabase
      .from('data_access_requests')
      .select('id, partner_id, resource_type, fields_returned, purpose, legal_basis, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    return error ? [] : (data ?? []);
  },
};
