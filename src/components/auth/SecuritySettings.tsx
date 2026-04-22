import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useMFA } from '@/hooks/useMFA';
import { useToast } from '@/hooks/use-toast';
import MFAEnrollment from './MFAEnrollment';
import SecurityActivityFeed from './SecurityActivityFeed';
import { ShieldCheck, ShieldAlert, Sparkles, Trash2, Info, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const SecuritySettings: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { factors, hasVerifiedFactor, aal, unenroll, refresh } = useMFA();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showEnroll, setShowEnroll] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  // ─── Demo / guest experience: read-only preview ────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Account Security
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Identity verification & two-factor authentication
          </p>
        </div>

        <Alert className="border-amber-500/40 bg-amber-500/5">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-700 dark:text-amber-400">Demo mode preview</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            You're exploring SuperNomad as a guest. Account security features are{' '}
            <strong>shown for preview only</strong> — sign up to enable real protection.
          </AlertDescription>
        </Alert>

        <PreviewCard
          icon={<ShieldCheck className="h-5 w-5 text-primary" />}
          title="Two-Factor Authentication (TOTP)"
          description="Protect your account with Google Authenticator, 1Password, Authy, or Microsoft Authenticator. Required for sensitive operations like high-value Concierge payments and Sovereign vault writes."
          comingNote="Available with a real account"
        />
        <PreviewCard
          icon={<Lock className="h-5 w-5 text-primary" />}
          title="ID Verification (Trust Pass)"
          description="W3C Verifiable Credentials issued by walt.id — proves you're a real human, a verified nomad, or a sovereign-tier individual. Unlocks elite chats, Vibe-Match, and Marketplace seller status."
          comingNote="Available with a real account"
        />
        <PreviewCard
          icon={<ShieldAlert className="h-5 w-5 text-primary" />}
          title="Audit Log"
          description="Every sensitive action — vault access, payment, credential issuance — is recorded in an append-only log only you can read."
          comingNote="Available with a real account"
        />

        <div className="flex justify-center pt-2">
          <Button onClick={() => navigate('/auth')} size="lg">
            Create an account to enable security
          </Button>
        </div>
      </div>
    );
  }

  // ─── Real authenticated user: full controls ────────────────────────────
  const handleRemove = async (factorId: string) => {
    if (!confirm('Remove this two-factor method? You will only need your password to sign in.')) return;
    setRemoving(factorId);
    try {
      await unenroll(factorId);
      toast({ title: 'Two-factor removed', description: 'Consider re-enabling it for better security.' });
    } catch (e) {
      toast({
        title: 'Could not remove',
        description: e instanceof Error ? e.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRemoving(null);
    }
  };

  if (showEnroll) {
    return (
      <MFAEnrollment
        onComplete={() => {
          setShowEnroll(false);
          refresh();
        }}
        onCancel={() => setShowEnroll(false)}
      />
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Account Security
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Signed in as <strong>{user?.email}</strong>
        </p>
      </div>

      {/* MFA section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                Two-Factor Authentication
                {hasVerifiedFactor ? (
                  <Badge className="bg-green-600 hover:bg-green-600">Enabled</Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-500 text-amber-700">
                    Recommended
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Use an authenticator app to generate one-time codes when signing in.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {factors.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You have no two-factor methods enabled. Add one to protect your account against
                password leaks and phishing.
              </AlertDescription>
            </Alert>
          ) : (
            factors.map(f => (
              <div
                key={f.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ShieldCheck
                    className={`h-5 w-5 shrink-0 ${
                      f.status === 'verified' ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {f.friendly_name || 'Authenticator app'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {f.factor_type.toUpperCase()} • Added {format(new Date(f.created_at), 'd MMM yyyy')} •{' '}
                      {f.status === 'verified' ? 'Verified' : 'Pending verification'}
                    </div>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemove(f.id)}
                  disabled={removing === f.id}
                  aria-label="Remove factor"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}

          <Button onClick={() => setShowEnroll(true)} variant={hasVerifiedFactor ? 'outline' : 'default'}>
            {hasVerifiedFactor ? 'Add another method' : 'Enable two-factor authentication'}
          </Button>

          {aal && (
            <p className="text-xs text-muted-foreground">
              Current session assurance level: <strong>{aal.toUpperCase()}</strong>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Trust Pass cross-link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            ID Verification (Trust Pass)
          </CardTitle>
          <CardDescription>
            W3C Verifiable Credentials that prove you're a verified human, nomad, or sovereign-tier individual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => navigate('/?section=trustpass')}>
            Open Trust Pass
          </Button>
        </CardContent>
      </Card>

      {/* Recent security activity / audit feed */}
      <SecurityActivityFeed />
    </div>
  );
};

const PreviewCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  comingNote: string;
}> = ({ icon, title, description, comingNote }) => (
  <Card className="opacity-90">
    <CardHeader className="pb-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1">
          <CardTitle className="text-base flex items-center gap-2">
            {title}
            <Badge variant="outline" className="text-xs font-normal">Preview</Badge>
          </CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-xs text-muted-foreground italic">{comingNote}</p>
    </CardContent>
  </Card>
);

export default SecuritySettings;
