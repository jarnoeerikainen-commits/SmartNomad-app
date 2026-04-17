import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  trustPassService, TrustPass, TrustTier, CredentialType, TIER_LABELS, VerifiableCredential,
} from '@/services/TrustPassService';
import TrustBadge from '@/components/trust/TrustBadge';
import {
  Shield, Camera, MapPin, Plane, Wallet, Briefcase, Loader2, Check, AlertCircle,
  ExternalLink, Lock, Sparkles, Info, RefreshCw,
} from 'lucide-react';

interface CredentialMeta {
  type: CredentialType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocksTier: TrustTier;
  realProvider: string;
  demoNote: string;
}

const CREDENTIAL_CATALOG: CredentialMeta[] = [
  {
    type: 'BiometricLivenessCredential',
    label: 'Biometric Liveness',
    description: 'Passive face liveness — proves you are a real human, not a deepfake or bot.',
    icon: Camera,
    unlocksTier: 'human',
    realProvider: 'Onfido / iProov',
    demoNote: 'Demo: instant pass. Real version triggers a 3-second passive face scan.',
  },
  {
    type: 'LocationCredential',
    label: 'Proof of Presence',
    description: 'GPS + cell-tower triangulation. Required to join elite city chats (Mumbai Elite, Lisbon Tech, etc.).',
    icon: MapPin,
    unlocksTier: 'nomad',
    realProvider: 'Native GPS + walt.id LocationVC',
    demoNote: 'Demo: simulates Lisbon. Real version uses your live device location.',
  },
  {
    type: 'TravelHistoryCredential',
    label: 'Travel History',
    description: 'Verified travel pattern from your Snomad ID vault. Powers Vibe-Match overlap scores.',
    icon: Plane,
    unlocksTier: 'nomad',
    realProvider: 'walt.id VC + your Snomad ID vault',
    demoNote: 'Demo: uses 4 sample cities. Real version reads your encrypted travel history.',
  },
  {
    type: 'ProofOfFundsCredential',
    label: 'Proof of Funds',
    description: 'Bank-attested wealth tier (HNW / UHNW). Unlocks Sovereign Marketplace seller status.',
    icon: Wallet,
    unlocksTier: 'sovereign',
    realProvider: 'Plaid attestation / Open Banking',
    demoNote: 'Demo: simulates HNW tier. Real version requires Plaid OAuth (no balance shared, only tier).',
  },
  {
    type: 'ProfessionalCredential',
    label: 'Professional Identity',
    description: 'Verified industry & employment via LinkedIn or Passport. Required for high-value escrow.',
    icon: Briefcase,
    unlocksTier: 'sovereign',
    realProvider: 'LinkedIn OAuth / walt.id ProfessionalVC',
    demoNote: 'Demo: instant pass. Real version uses LinkedIn OAuth or government KYC.',
  },
];

const TrustPassDashboard: React.FC = () => {
  const { toast } = useToast();
  const [pass, setPass] = useState<TrustPass | null>(null);
  const [loading, setLoading] = useState(true);
  const [issuingType, setIssuingType] = useState<CredentialType | null>(null);
  const [payingFee, setPayingFee] = useState(false);
  const isDemo = trustPassService.isDemoMode();

  const load = async () => {
    setLoading(true);
    const p = await trustPassService.getTrustPass();
    setPass(p);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleIssue = async (type: CredentialType) => {
    setIssuingType(type);
    try {
      await trustPassService.issueCredential(type);
      await load();
      const meta = CREDENTIAL_CATALOG.find(c => c.type === type);
      toast({
        title: `✓ ${meta?.label} issued`,
        description: isDemo
          ? 'Demo credential added to your Trust Pass. In live mode this would be a real W3C VC.'
          : 'Credential signed by walt.id and added to your wallet.',
      });
    } catch (e) {
      toast({
        title: 'Issuance failed',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
    }
    setIssuingType(null);
  };

  const handlePayFee = async () => {
    setPayingFee(true);
    try {
      await trustPassService.payTrustPassFee();
      await load();
      toast({
        title: '🎉 Trust Pass activated',
        description: isDemo
          ? 'Demo mode — no real charge. In live mode, this is a one-time $20 fee covering all KYC costs.'
          : 'You can now request all credential tiers.',
      });
    } catch (e) {
      toast({
        title: 'Payment failed',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
    }
    setPayingFee(false);
  };

  const handleReset = async () => {
    await trustPassService.resetDemo();
    await load();
    toast({ title: 'Trust Pass reset', description: 'All demo credentials cleared.' });
  };

  if (loading || !pass) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasCredential = (type: CredentialType) =>
    pass.credentials.some(c => c.type === type && new Date(c.expiresAt) > new Date());

  const tierProgress = {
    unverified: 0,
    human: 33,
    nomad: 66,
    sovereign: 100,
  }[pass.tier];

  const credentialCount = pass.credentials.length;
  const totalCredentials = CREDENTIAL_CATALOG.length;

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Trust Pass</h1>
            {isDemo && (
              <Badge variant="outline" className="text-xs border-amber-500 text-amber-700 dark:text-amber-400">
                <Sparkles className="w-3 h-3 mr-1" />
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Verifiable credentials that unlock elite chats, Vibe-Matching, and Sovereign Marketplace.
            Powered by <a href="https://walt.id" target="_blank" rel="noopener" className="text-primary underline inline-flex items-center gap-1">walt.id <ExternalLink className="w-3 h-3" /></a> open-source self-sovereign identity (W3C SD-JWT-VC, eIDAS 2.0 compliant).
          </p>
        </div>
        {isDemo && credentialCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-1.5" /> Reset Demo
          </Button>
        )}
      </div>

      {/* Demo Mode Notice */}
      {isDemo && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">You are seeing the Demo experience</p>
                <p className="text-muted-foreground">
                  All verifications are <strong>simulated</strong> — no real KYC, no real biometric scan, no real charge.
                  This shows exactly how the production version will feel. In live mode, each credential is a real
                  cryptographically-signed W3C Verifiable Credential issued by your self-hosted walt.id node.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Tier Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-sm text-muted-foreground font-normal mb-2">Your current tier</CardTitle>
              <div className="flex items-center gap-3">
                <TrustBadge tier={pass.tier} size="lg" showLabel />
                <span className="text-2xl font-bold">{TIER_LABELS[pass.tier].emoji}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">{TIER_LABELS[pass.tier].description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{credentialCount}/{totalCredentials}</div>
              <div className="text-xs text-muted-foreground">credentials</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={tierProgress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Unverified</span>
            <span>Human</span>
            <span>Nomad</span>
            <span className="text-amber-600 font-medium">Sovereign</span>
          </div>
        </CardContent>
      </Card>

      {/* Trust Pass Fee Gate */}
      {!pass.trustPassPaidAt && (
        <Card className="border-primary/30">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Activate Trust Pass — one-time {isDemo ? '(free in demo)' : '$20'}</h3>
                  <p className="text-sm text-muted-foreground">
                    Covers all biometric & KYC costs. Acts as a low-friction barrier against bots and low-signal users.
                  </p>
                </div>
              </div>
              <Button onClick={handlePayFee} disabled={payingFee} className="shrink-0">
                {payingFee ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Activating…</>
                ) : (
                  <>{isDemo ? 'Activate (Demo)' : 'Pay $20'}</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Credentials & Benefits */}
      <Tabs defaultValue="credentials" className="w-full">
        <TabsList>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="benefits">What it unlocks</TabsTrigger>
          <TabsTrigger value="wallet">My Wallet ({credentialCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-3 mt-4">
          {CREDENTIAL_CATALOG.map(meta => {
            const owned = hasCredential(meta.type);
            const Icon = meta.icon;
            const issuing = issuingType === meta.type;
            return (
              <Card key={meta.type} className={owned ? 'border-primary/40 bg-primary/5' : ''}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg shrink-0 ${owned ? 'bg-primary/15' : 'bg-muted'}`}>
                      <Icon className={`w-5 h-5 ${owned ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold">{meta.label}</h3>
                        <TrustBadge tier={meta.unlocksTier} size="xs" />
                        {owned && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{meta.description}</p>
                      <p className="text-xs text-muted-foreground/80">
                        <span className="font-medium">Real provider:</span> {meta.realProvider}
                      </p>
                      {isDemo && (
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                          <span className="font-medium">Demo:</span> {meta.demoNote.replace(/^Demo:\s*/, '')}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={owned ? 'outline' : 'default'}
                      onClick={() => handleIssue(meta.type)}
                      disabled={issuing || (!pass.trustPassPaidAt && !isDemo)}
                      className="shrink-0"
                    >
                      {issuing ? (
                        <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Verifying…</>
                      ) : owned ? (
                        'Re-verify'
                      ) : (
                        'Get credential'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="benefits" className="space-y-3 mt-4">
          {(['human', 'nomad', 'sovereign'] as TrustTier[]).map(tier => {
            const meta = TIER_LABELS[tier];
            const unlocked = trustPassService.meetsGate(pass, tier);
            return (
              <Card key={tier} className={unlocked ? 'border-primary/40' : 'opacity-70'}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrustBadge tier={tier} size="md" showLabel />
                      <span className="text-xl">{meta.emoji}</span>
                    </div>
                    {unlocked ? (
                      <Badge variant="default" className="text-xs"><Check className="w-3 h-3 mr-1" /> Unlocked</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs"><Lock className="w-3 h-3 mr-1" /> Locked</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm">
                    {tier === 'human' && (
                      <>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Post in SuperNomad Pulse community feeds</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Show "Verified Human" badge on your Vibe profile</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Anti-deepfake protection on photo & video uploads</li>
                      </>
                    )}
                    {tier === 'nomad' && (
                      <>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Join location-gated elite chats (Mumbai Elite, Lisbon Tech, Dubai HNW)</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> See Vibe-Match overlap % with other verified nomads (privacy-preserving)</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Filter Pulse feed to "Verified Nomads only"</li>
                      </>
                    )}
                    {tier === 'sovereign' && (
                      <>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Sell on the Sovereign Marketplace (no Trust Tax — buyers pay 10% premium)</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Concierge AI can auto-execute payments to verified counterparties</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Access Investor Channels in Pulse (Venture Travelist room)</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Sovereign Escrow for high-value transactions (legal recourse via VC)</li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="wallet" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Your DID (Decentralized Identifier)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-xs bg-muted px-2 py-1 rounded break-all block">{pass.did}</code>
              <p className="text-xs text-muted-foreground mt-2">
                Your wallet's cryptographic identity. {isDemo ? 'Demo placeholder — ' : ''}generated using did:key method.
              </p>
            </CardContent>
          </Card>
          {pass.credentials.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No credentials yet. Get your first one from the Credentials tab.</p>
              </CardContent>
            </Card>
          ) : (
            pass.credentials.map(c => <CredentialCard key={c.id} credential={c} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CredentialCard: React.FC<{ credential: VerifiableCredential }> = ({ credential }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = CREDENTIAL_CATALOG.find(c => c.type === credential.type);
  const Icon = meta?.icon ?? Shield;
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-sm">{meta?.label ?? credential.type}</h4>
              <Badge variant="secondary" className="text-[10px]">SD-JWT-VC</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Issued {new Date(credential.issuedAt).toLocaleDateString()} • Expires {new Date(credential.expiresAt).toLocaleDateString()}
            </p>
            <button
              className="text-xs text-primary mt-2 hover:underline"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Hide claims' : 'Show disclosed claims'}
            </button>
            {expanded && (
              <pre className="mt-2 text-[11px] bg-muted p-2 rounded overflow-x-auto">
                {JSON.stringify(credential.subject, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustPassDashboard;
