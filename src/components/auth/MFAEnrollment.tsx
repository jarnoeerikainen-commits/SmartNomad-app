import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMFA } from '@/hooks/useMFA';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Copy, Check, Smartphone } from 'lucide-react';

interface Props {
  onComplete?: () => void;
  onCancel?: () => void;
}

const MFAEnrollment: React.FC<Props> = ({ onComplete, onCancel }) => {
  const { enroll, verifyEnrollment } = useMFA();
  const { toast } = useToast();
  const [step, setStep] = useState<'intro' | 'scan' | 'verify'>('intro');
  const [enrolling, setEnrolling] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const start = async () => {
    setEnrolling(true);
    try {
      const result = await enroll();
      setFactorId(result.factorId);
      setQr(result.qr);
      setSecret(result.secret);
      setStep('scan');
    } catch (e) {
      toast({
        title: 'Enrollment failed',
        description: e instanceof Error ? e.message : 'Could not start MFA setup.',
        variant: 'destructive',
      });
    } finally {
      setEnrolling(false);
    }
  };

  const verify = async () => {
    if (!factorId || code.length !== 6) return;
    setVerifying(true);
    try {
      await verifyEnrollment(factorId, code);
      toast({
        title: '✓ Two-factor authentication enabled',
        description: 'Your account is now protected with TOTP.',
      });
      onComplete?.();
    } catch (e) {
      toast({
        title: 'Invalid code',
        description: e instanceof Error ? e.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setVerifying(false);
    }
  };

  const copySecret = async () => {
    if (!secret) return;
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <CardTitle>Enable Two-Factor Authentication</CardTitle>
        </div>
        <CardDescription>
          Add a TOTP authenticator app for an extra layer of security.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'intro' && (
          <>
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                You'll need an authenticator app like <strong>Google Authenticator</strong>,{' '}
                <strong>1Password</strong>, <strong>Authy</strong>, or <strong>Microsoft Authenticator</strong>.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={start} disabled={enrolling} className="flex-1">
                {enrolling ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {enrolling ? 'Generating…' : 'Start setup'}
              </Button>
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
              )}
            </div>
          </>
        )}

        {step === 'scan' && qr && secret && (
          <>
            <div className="space-y-2">
              <p className="text-sm font-medium">1. Scan the QR code</p>
              <div className="flex items-center justify-center bg-white rounded-lg p-4 border">
                <img src={qr} alt="MFA QR code" className="w-48 h-48" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Or enter this secret manually:</p>
              <div className="flex gap-2">
                <code className="flex-1 text-xs bg-muted px-3 py-2 rounded font-mono break-all">
                  {secret}
                </code>
                <Button variant="outline" size="icon" onClick={copySecret}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={() => setStep('verify')} className="w-full">
              Next: Enter verification code
            </Button>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="mfa-code">2. Enter the 6-digit code from your app</Label>
              <Input
                id="mfa-code"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-[0.5em] font-mono"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={verify}
                disabled={verifying || code.length !== 6}
                className="flex-1"
              >
                {verifying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {verifying ? 'Verifying…' : 'Verify & enable'}
              </Button>
              <Button variant="outline" onClick={() => setStep('scan')}>
                Back
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MFAEnrollment;
