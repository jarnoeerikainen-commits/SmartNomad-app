import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMFA } from '@/hooks/useMFA';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';

interface Props {
  onSuccess?: () => void;
}

/**
 * Shown after a user signs in if their account has MFA enabled and AAL is still aal1.
 * They must enter a TOTP code to elevate to aal2 before continuing.
 */
const MFAChallenge: React.FC<Props> = ({ onSuccess }) => {
  const { factors, verifyChallenge } = useMFA();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const verifiedFactor = factors.find(f => f.status === 'verified');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedFactor || code.length !== 6) return;
    setVerifying(true);
    try {
      await verifyChallenge(verifiedFactor.id, code);
      toast({ title: '✓ Verified', description: 'Welcome back.' });
      onSuccess?.();
    } catch (err) {
      toast({
        title: 'Invalid code',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
      setCode('');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mfa-challenge-code">Verification code</Label>
              <Input
                id="mfa-challenge-code"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-[0.5em] font-mono"
                autoFocus
                autoComplete="one-time-code"
              />
            </div>
            <Button type="submit" className="w-full" disabled={verifying || code.length !== 6}>
              {verifying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {verifying ? 'Verifying…' : 'Continue'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => signOut()}
            >
              Sign out instead
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MFAChallenge;
