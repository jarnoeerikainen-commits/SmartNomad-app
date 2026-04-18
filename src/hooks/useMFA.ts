import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MFAFactor {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: 'verified' | 'unverified';
  created_at: string;
}

interface EnrollResult {
  factorId: string;
  qr: string;        // SVG data URL
  secret: string;    // TOTP secret (base32)
  uri: string;       // otpauth:// URI
}

/**
 * useMFA — wraps Supabase TOTP MFA APIs.
 * For authenticated users only. Guests get a no-op stub.
 */
export const useMFA = () => {
  const { isAuthenticated, user } = useAuth();
  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [aal, setAal] = useState<'aal1' | 'aal2' | null>(null);
  const [nextAal, setNextAal] = useState<'aal1' | 'aal2' | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setFactors([]);
      setAal(null);
      setNextAal(null);
      return;
    }
    setLoading(true);
    try {
      const [{ data: list }, { data: level }] = await Promise.all([
        supabase.auth.mfa.listFactors(),
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
      ]);
      const totp = (list?.totp ?? []) as MFAFactor[];
      setFactors(totp);
      setAal((level?.currentLevel as 'aal1' | 'aal2' | null) ?? null);
      setNextAal((level?.nextLevel as 'aal1' | 'aal2' | null) ?? null);
    } catch (e) {
      console.warn('MFA refresh failed:', e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh, user?.id]);

  /** Begin TOTP enrollment — returns QR + secret to display. */
  const enroll = useCallback(async (friendlyName?: string): Promise<EnrollResult> => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: friendlyName || `SuperNomad ${new Date().toLocaleDateString()}`,
    });
    if (error) throw error;
    return {
      factorId: data.id,
      qr: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri,
    };
  }, []);

  /** Verify the 6-digit code to complete enrollment. */
  const verifyEnrollment = useCallback(async (factorId: string, code: string): Promise<void> => {
    const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({ factorId });
    if (cErr) throw cErr;
    const { error: vErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });
    if (vErr) throw vErr;
    await refresh();
  }, [refresh]);

  /** Complete an MFA challenge during sign-in (aal1 → aal2). */
  const verifyChallenge = useCallback(async (factorId: string, code: string): Promise<void> => {
    const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({ factorId });
    if (cErr) throw cErr;
    const { error: vErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });
    if (vErr) throw vErr;
    await refresh();
  }, [refresh]);

  /** Remove a factor. */
  const unenroll = useCallback(async (factorId: string): Promise<void> => {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) throw error;
    await refresh();
  }, [refresh]);

  const hasVerifiedFactor = factors.some(f => f.status === 'verified');
  const mfaChallengeRequired = aal === 'aal1' && nextAal === 'aal2';

  return {
    factors,
    aal,
    nextAal,
    hasVerifiedFactor,
    mfaChallengeRequired,
    loading,
    enroll,
    verifyEnrollment,
    verifyChallenge,
    unenroll,
    refresh,
  };
};
