/**
 * TrustPassService — SuperNomad Verification Engine
 *
 * In DEMO MODE: Stores simulated W3C Verifiable Credentials in localStorage.
 *   • Instant "issuance" with realistic delays (no real KYC).
 *   • All flows visible to the user with clear "Demo" labelling.
 *
 * In PRODUCTION MODE (when VITE_VERIFICATION_MODE=live):
 *   • Calls the `walt-id-verifier` edge function (OID4VC / OID4VP).
 *   • Issues real W3C SD-JWT-VC credentials via self-hosted walt.id.
 *   • Liveness checks via Onfido / iProov as a layered partner.
 *
 * Standards: W3C Verifiable Credentials 2.0, SD-JWT-VC, OID4VC, eIDAS 2.0.
 */

import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from '@/utils/deviceId';

export type TrustTier = 'unverified' | 'human' | 'nomad' | 'sovereign';

export type CredentialType =
  | 'BiometricLivenessCredential'    // Tier 1: Human (passive face liveness)
  | 'LocationCredential'              // Tier 2: GPS + Cell Tower triangulation
  | 'TravelHistoryCredential'         // Tier 2: Verified travel patterns
  | 'ProofOfFundsCredential'          // Tier 3: Bank statement / Plaid attestation
  | 'ProfessionalCredential'          // Tier 3: LinkedIn / Passport / Tax ID
  | 'ResidencyCredential';            // Tier 3: Government-issued residency

export interface VerifiableCredential {
  id: string;
  type: CredentialType;
  issuer: string;             // walt.id self-hosted DID (did:web:supernomad.app)
  issuedAt: string;           // ISO 8601
  expiresAt: string;          // ISO 8601
  subject: {
    id: string;               // did:key:... (user's wallet DID)
    [key: string]: unknown;   // Selectively-disclosed claims
  };
  proof: {
    type: 'SD-JWT-VC';
    jwt: string;              // In demo, a base64 placeholder
  };
  // Selective disclosure — claims the user has revealed
  disclosed: string[];
}

export interface TrustPass {
  tier: TrustTier;
  did: string;                          // User's wallet DID
  credentials: VerifiableCredential[];
  vibeMatchScore?: number;              // 0-100 (computed against current room)
  trustPassPaidAt?: string;             // When the $20 one-time fee was paid
  livenessLastCheckedAt?: string;       // Passive liveness re-checks every 30 days
}

const STORAGE_KEY = 'supernomad_trust_pass';
const DEMO_MODE = (import.meta.env.VITE_VERIFICATION_MODE ?? 'demo') === 'demo';

// ── Tier requirements ────────────────────────────────────────────────────────
const TIER_REQUIREMENTS: Record<TrustTier, CredentialType[]> = {
  unverified: [],
  human: ['BiometricLivenessCredential'],
  nomad: ['BiometricLivenessCredential', 'LocationCredential', 'TravelHistoryCredential'],
  sovereign: [
    'BiometricLivenessCredential',
    'LocationCredential',
    'TravelHistoryCredential',
    'ProofOfFundsCredential',
    'ProfessionalCredential',
  ],
};

export const TIER_LABELS: Record<TrustTier, { label: string; emoji: string; color: string; description: string }> = {
  unverified: {
    label: 'Unverified',
    emoji: '○',
    color: 'hsl(var(--muted-foreground))',
    description: 'No verification yet — visible only in public spaces',
  },
  human: {
    label: 'Verified Human',
    emoji: '🥉',
    color: 'hsl(var(--accent))',
    description: 'Passive liveness confirmed — you are not a bot',
  },
  nomad: {
    label: 'Verified Nomad',
    emoji: '🥈',
    color: 'hsl(var(--primary))',
    description: 'Location + travel history verified — unlocks elite city chats',
  },
  sovereign: {
    label: 'Sovereign Verified',
    emoji: '🥇',
    color: 'hsl(38 92% 50%)', // Gold
    description: 'Full identity, professional & wealth verified — Marketplace seller status',
  },
};

const SIM_DELAY = (min = 1200, max = 2400) =>
  new Promise(r => setTimeout(r, min + Math.random() * (max - min)));

class TrustPassServiceImpl {
  private cached: TrustPass | null = null;

  // ── Public API ─────────────────────────────────────────────────────────────

  isDemoMode(): boolean {
    return DEMO_MODE;
  }

  async getTrustPass(): Promise<TrustPass> {
    if (this.cached) return this.cached;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const pass = JSON.parse(raw) as TrustPass;
        this.cached = pass;
        return pass;
      }
    } catch {
      // fall through
    }
    const fresh: TrustPass = {
      tier: 'unverified',
      did: this.generateDid(),
      credentials: [],
    };
    this.persist(fresh);
    return fresh;
  }

  async getTier(): Promise<TrustTier> {
    return (await this.getTrustPass()).tier;
  }

  /**
   * Issue a credential. In demo mode this is instant + simulated.
   * In live mode this calls the walt-id-verifier edge function.
   */
  async issueCredential(type: CredentialType, claims: Record<string, unknown> = {}): Promise<VerifiableCredential> {
    if (DEMO_MODE) {
      await SIM_DELAY();
      const cred = this.buildDemoCredential(type, claims);
      const pass = await this.getTrustPass();
      const filtered = pass.credentials.filter(c => c.type !== type);
      pass.credentials = [...filtered, cred];
      pass.tier = this.computeTier(pass.credentials);
      if (type === 'BiometricLivenessCredential') {
        pass.livenessLastCheckedAt = new Date().toISOString();
      }
      this.persist(pass);

      // Best-effort DB persistence (works for guests via device_id and auth users via user_id).
      // Failures are non-fatal — localStorage stays the source of truth in demo mode.
      void this.persistCredentialToDb(cred, pass.tier).catch(() => undefined);
      void this.logAudit('trust_pass.credential_issued', cred.id, { type, tier: pass.tier });
      return cred;
    }

    const { data, error } = await supabase.functions.invoke('walt-id-verifier', {
      body: { action: 'issue', type, claims, did: (await this.getTrustPass()).did },
    });
    if (error) throw new Error(`Issuance failed: ${error.message}`);
    return data.credential as VerifiableCredential;
  }

  /** Persist a credential row. Dual-mode: device_id for guests, user_id for auth users. */
  private async persistCredentialToDb(cred: VerifiableCredential, tier: TrustTier): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    const deviceId = getDeviceId();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('trust_pass_credentials').upsert({
      device_id: deviceId,
      user_id: user?.id ?? null,
      did: this.cached?.did ?? this.generateDid(),
      credential_id: cred.id,
      credential_type: cred.type,
      tier,
      issuer: cred.issuer,
      jwt: cred.proof.jwt,
      subject: cred.subject,
      disclosed: cred.disclosed,
      status: 'active',
      issued_at: cred.issuedAt,
      expires_at: cred.expiresAt,
    }, { onConflict: 'device_id,credential_type' });
  }

  /** Append-only audit entry. Best-effort. */
  private async logAudit(action: string, resource: string | null, metadata: Record<string, unknown> = {}): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const deviceId = getDeviceId();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('audit_log').insert({
        device_id: deviceId,
        user_id: user?.id ?? null,
        action,
        resource,
        metadata,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 500) : null,
      });
    } catch {
      /* ignore */
    }
  }

  /** Pay the $20 one-time Trust Pass onboarding fee (demo: instant). */
  async payTrustPassFee(): Promise<void> {
    if (DEMO_MODE) {
      await SIM_DELAY(800, 1500);
      const pass = await this.getTrustPass();
      pass.trustPassPaidAt = new Date().toISOString();
      this.persist(pass);
      return;
    }
    // Production: trigger Stripe / x402 payment via concierge-actions
    const { error } = await supabase.functions.invoke('concierge-actions', {
      body: { type: 'trust-pass-fee', amount: 2000, currency: 'USD' },
    });
    if (error) throw new Error(`Trust Pass payment failed: ${error.message}`);
  }

  /**
   * Check whether a given user (or "room") meets a verification gate.
   * Used by Pulse (city chats) and Marketplace (seller listings).
   */
  meetsGate(pass: TrustPass, requiredTier: TrustTier): boolean {
    const order: TrustTier[] = ['unverified', 'human', 'nomad', 'sovereign'];
    return order.indexOf(pass.tier) >= order.indexOf(requiredTier);
  }

  /**
   * Vibe Match: anonymized overlap score (0-100) between two pseudo-profiles.
   * Privacy-first: no raw data revealed, only an aggregate %.
   */
  computeVibeMatch(myCredentials: VerifiableCredential[], theirCities: string[]): number {
    const myTravel = myCredentials.find(c => c.type === 'TravelHistoryCredential');
    const myCities = (myTravel?.subject?.cities as string[] | undefined) ?? [];
    if (myCities.length === 0 || theirCities.length === 0) return 50; // neutral
    const overlap = myCities.filter(c => theirCities.includes(c)).length;
    const union = new Set([...myCities, ...theirCities]).size;
    return Math.round((overlap / union) * 100);
  }

  async resetDemo(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    this.cached = null;
    // Best-effort DB cleanup of credentials issued in this device's session
    try {
      const deviceId = getDeviceId();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('trust_pass_credentials').delete().eq('device_id', deviceId);
    } catch {
      /* ignore */
    }
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private persist(pass: TrustPass): void {
    this.cached = pass;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pass));
    } catch {
      // ignore quota errors
    }
  }

  private generateDid(): string {
    // did:key format placeholder — in production generated by walt.id wallet SDK
    const id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)).replace(/-/g, '');
    return `did:key:z6Mk${id.slice(0, 40)}`;
  }

  private computeTier(creds: VerifiableCredential[]): TrustTier {
    const types = new Set(creds.filter(c => new Date(c.expiresAt) > new Date()).map(c => c.type));
    const has = (req: CredentialType[]) => req.every(t => types.has(t));
    if (has(TIER_REQUIREMENTS.sovereign)) return 'sovereign';
    if (has(TIER_REQUIREMENTS.nomad)) return 'nomad';
    if (has(TIER_REQUIREMENTS.human)) return 'human';
    return 'unverified';
  }

  private buildDemoCredential(type: CredentialType, claims: Record<string, unknown>): VerifiableCredential {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year

    const defaultClaims: Record<CredentialType, Record<string, unknown>> = {
      BiometricLivenessCredential: { liveness: true, method: 'passive-face', confidence: 0.98 },
      LocationCredential: { city: 'Lisbon', country: 'PT', method: 'gps+celltower', accuracy_m: 50 },
      TravelHistoryCredential: { cities: ['Lisbon', 'Dubai', 'Bali', 'Mumbai'], totalDays: 287 },
      ProofOfFundsCredential: { tier: 'HNW', verifiedAt: now.toISOString(), method: 'plaid-attestation' },
      ProfessionalCredential: { industry: 'Technology', verifiedVia: 'linkedin-oauth' },
      ResidencyCredential: { country: 'PT', residencyType: 'NHR', validUntil: expiresAt.toISOString() },
    };

    return {
      id: `urn:uuid:${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
      type,
      issuer: 'did:web:supernomad.app',
      issuedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      subject: { id: this.cached?.did ?? this.generateDid(), ...defaultClaims[type], ...claims },
      proof: { type: 'SD-JWT-VC', jwt: `eyDEMO.${btoa(JSON.stringify({ type, iat: Date.now() })).slice(0, 80)}.SIM` },
      disclosed: Object.keys({ ...defaultClaims[type], ...claims }),
    };
  }
}

export const trustPassService = new TrustPassServiceImpl();
