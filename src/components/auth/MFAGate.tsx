import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMFA } from '@/hooks/useMFA';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface MFAGateProps {
  /** Setting key in `app_settings` to read. Defaults to `require_mfa_for_payments`. */
  flag?: 'require_mfa_for_payments' | 'require_mfa_for_sensitive';
  /** Friendly label shown in the gate card. */
  area?: string;
  children: React.ReactNode;
}

/**
 * MFAGate — Conditionally blocks sensitive UI behind a verified MFA factor.
 *
 * Behaviour:
 * - Demo / guest users (no auth session) → renders children immediately. Demo
 *   personas (Meghan/John) must remain frictionless.
 * - Authenticated users when the corresponding `app_settings` flag is FALSE
 *   (the default) → renders children. The gate is purely opt-in by the admin.
 * - Authenticated users when the flag is TRUE and they have not enrolled or
 *   not elevated to AAL2 → renders a friendly "Enable two-factor" card with
 *   a CTA to Settings → Security.
 *
 * This component never logs the user out, never shows partial data, and never
 * depends on client-only state to enforce security — RLS on the underlying
 * tables remains the source of truth.
 */
const MFAGate: React.FC<MFAGateProps> = ({
  flag = 'require_mfa_for_payments',
  area = 'this section',
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const { aal, hasVerifiedFactor, loading } = useMFA();
  const [requireMfa, setRequireMfa] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase
          .from('app_settings')
          .select(flag)
          .eq('id', 1)
          .maybeSingle();
        if (mounted) setRequireMfa(Boolean(data && (data as Record<string, unknown>)[flag]));
      } catch {
        if (mounted) setRequireMfa(false);
      }
    })();
    return () => { mounted = false; };
  }, [flag]);

  // Demo / guest flow — no auth, no gate.
  if (!isAuthenticated) return <>{children}</>;
  // Flag not loaded yet — fail open to children to avoid flash, RLS still protects.
  if (requireMfa === null || loading) return <>{children}</>;
  // Flag off — gate disabled.
  if (!requireMfa) return <>{children}</>;
  // Flag on AND user is at AAL2 with a verified factor — pass through.
  if (aal === 'aal2' && hasVerifiedFactor) return <>{children}</>;

  // Otherwise → block with a friendly card.
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-warning/40 bg-warning/5">
        <CardHeader className="space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full bg-warning/15 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-warning" />
          </div>
          <CardTitle className="text-center">Two-factor authentication required</CardTitle>
          <CardDescription className="text-center">
            For your protection, {area} is locked behind two-factor authentication
            (TOTP). Add an authenticator app and verify a 6-digit code to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border bg-card p-4 text-sm space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <Lock className="h-4 w-4" /> Why this matters
            </div>
            <p className="text-muted-foreground leading-relaxed">
              This area touches payment instruments, identity documents, or
              autonomous spend. A second factor stops attackers even if your
              password is leaked elsewhere.
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => navigate('/settings?tab=security')}
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Enable two-factor authentication
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MFAGate;
