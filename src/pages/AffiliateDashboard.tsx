import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  AffiliateService, type AffiliateStats, type ProgramSettings, type PayoutMethod,
} from '@/services/AffiliateService';
import {
  Users, Wallet, ArrowDownToLine, Link2, Copy, Share2, TrendingUp, Clock,
  CheckCircle2, Sparkles, ShieldCheck, Globe, Layers, BadgeDollarSign, History,
} from 'lucide-react';

const PAYOUT_LABELS: Record<PayoutMethod, string> = {
  wallet_credit: 'Wallet Credit (instant, +5% bonus)',
  usdc_base: 'USDC on Base (crypto, $0.50 fee)',
  stripe_connect: 'Stripe Connect (bank transfer, 0.25%)',
  bank_wire: 'Bank Wire (SEPA / SWIFT, $15 flat)',
};

export default function AffiliateDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [settings, setSettings] = useState<ProgramSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('usdc_base');
  const [payoutAddress, setPayoutAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  async function load() {
    setLoading(true);
    try {
      // Bootstrap account if missing
      const { settings: s } = await AffiliateService.getAccount();
      setSettings(s);
      const data = await AffiliateService.getStats();
      setStats(data);
      setPayoutMethod(data.account.payout_method);
      setPayoutAddress(data.account.payout_address || '');
    } catch (e) {
      toast({ title: 'Could not load affiliate data', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  const shareUrl = useMemo(
    () => stats ? AffiliateService.shareLink(stats.account.referral_code) : '',
    [stats]
  );

  const conversionRate = useMemo(() => {
    if (!stats || stats.account.total_clicks === 0) return 0;
    return (stats.account.total_signups / stats.account.total_clicks) * 100;
  }, [stats]);

  const acceptedTerms = !!stats?.account.terms_accepted_at;

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    toast({ title: `${label} copied`, description: text });
  }

  async function share() {
    if (!stats) return;
    const text = `I'm using SuperNomad — the AI-powered global lifestyle OS for nomads. Join with my link and we both win:`;
    if (navigator.share) {
      try { await navigator.share({ title: 'SuperNomad', text, url: shareUrl }); } catch { /* cancelled */ }
    } else {
      copy(shareUrl, 'Link');
    }
  }

  async function acceptTerms() {
    try {
      await AffiliateService.acceptTerms();
      toast({ title: 'Terms accepted', description: 'You\'re now eligible to earn commissions.' });
      load();
    } catch (e) {
      toast({ title: 'Failed', description: (e as Error).message, variant: 'destructive' });
    }
  }

  async function savePayoutMethod() {
    try {
      await AffiliateService.updatePayoutMethod(payoutMethod, payoutAddress);
      toast({ title: 'Payout method saved' });
      load();
    } catch (e) {
      toast({ title: 'Failed', description: (e as Error).message, variant: 'destructive' });
    }
  }

  async function submitPayout() {
    if (!stats || !settings) return;
    const amt = Number(payoutAmount);
    if (!amt || amt <= 0) {
      toast({ title: 'Enter a valid amount', variant: 'destructive' }); return;
    }
    if (amt < settings.min_payout_usd) {
      toast({ title: `Minimum payout is $${settings.min_payout_usd}`, variant: 'destructive' }); return;
    }
    if (amt > stats.account.cleared_balance) {
      toast({ title: 'Insufficient cleared balance', variant: 'destructive' }); return;
    }
    setSubmitting(true);
    try {
      const r = await AffiliateService.requestPayout(amt, payoutMethod, payoutAddress);
      if (r.success) {
        toast({
          title: 'Payout requested',
          description: `${AffiliateService.formatUSD(r.net || 0)} on its way (fee: ${AffiliateService.formatUSD(r.fee || 0)}).`,
        });
        setPayoutOpen(false);
        setPayoutAmount('');
        load();
      } else {
        toast({ title: 'Payout failed', description: r.error || 'unknown', variant: 'destructive' });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !stats || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const a = stats.account;
  const totalLifetime = a.pending_balance + a.cleared_balance + a.wallet_credit_balance + a.paid_lifetime;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              SuperNomad Affiliate
            </h1>
            <p className="text-muted-foreground mt-1">
              Earn <strong>{Math.round(settings.l1_commission_rate * 100)}%</strong> recurring on direct referrals,
              {' '}<strong>{Math.round(settings.l2_commission_rate * 100)}%</strong> override on your sub-affiliates.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Tier: {a.tier} · {a.status}
          </Badge>
        </div>

        {!acceptedTerms && (
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between gap-3">
              <span>
                Accept the program terms (v{settings.terms_version}) to start earning. 25% of every commission auto-credits to your wallet, 75% is fully withdrawable.
              </span>
              <Button size="sm" onClick={acceptTerms}>Accept terms</Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Hero balance cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <BalanceCard
            icon={<Wallet className="h-4 w-4" />}
            label="Withdrawable (75%)"
            value={a.cleared_balance}
            accent="from-emerald-500/20 to-emerald-500/5"
            cta={a.cleared_balance >= settings.min_payout_usd ? (
              <Button size="sm" className="w-full mt-2" onClick={() => setPayoutOpen(true)}>
                <ArrowDownToLine className="h-3 w-3 mr-1" /> Withdraw
              </Button>
            ) : (
              <p className="text-[10px] text-muted-foreground mt-2">
                Min payout: ${settings.min_payout_usd}
              </p>
            )}
          />
          <BalanceCard
            icon={<Sparkles className="h-4 w-4" />}
            label="Wallet Credit (25%)"
            value={a.wallet_credit_balance}
            accent="from-amber-500/20 to-amber-500/5"
            cta={<p className="text-[10px] text-muted-foreground mt-2">Spend on platform · +5% bonus</p>}
          />
          <BalanceCard
            icon={<Clock className="h-4 w-4" />}
            label={`Pending (${settings.hold_days}d)`}
            value={a.pending_balance}
            accent="from-blue-500/20 to-blue-500/5"
          />
          <BalanceCard
            icon={<BadgeDollarSign className="h-4 w-4" />}
            label="Lifetime earned"
            value={totalLifetime}
            accent="from-primary/20 to-primary/5"
          />
        </div>

        {/* Share link */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Your private referral link
            </CardTitle>
            <CardDescription>
              Cookie window: {settings.cookie_window_days} days · pays for {settings.recurring_months} months
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <code className="flex-1 min-w-[200px] px-3 py-2 bg-muted rounded-md text-sm font-mono break-all">
                {shareUrl}
              </code>
              <Button size="sm" variant="outline" onClick={() => copy(shareUrl, 'Link')}>
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
              <Button size="sm" onClick={share}>
                <Share2 className="h-3 w-3 mr-1" /> Share
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Or share your code:</span>
              <code className="px-2 py-1 bg-muted rounded font-mono">{a.referral_code}</code>
              <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => copy(a.referral_code, 'Code')}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile icon={<Globe className="h-4 w-4" />} label="Clicks" value={a.total_clicks} />
          <StatTile icon={<Users className="h-4 w-4" />} label="Signups" value={a.total_signups} />
          <StatTile icon={<TrendingUp className="h-4 w-4" />} label="Paying" value={a.total_paying_referrals} />
          <StatTile icon={<Layers className="h-4 w-4" />} label="Conv. rate" value={`${conversionRate.toFixed(1)}%`} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="referrals" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="referrals" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" /> Direct (L1) — {stats.l1_referrals.length}
                </CardTitle>
                <CardDescription>{Math.round(settings.l1_commission_rate * 100)}% commission</CardDescription>
              </CardHeader>
              <CardContent>
                <ReferralList items={stats.l1_referrals} empty="No direct referrals yet — share your link to get started!" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Sub-affiliates (L2) — {stats.l2_referrals.length}
                </CardTitle>
                <CardDescription>{Math.round(settings.l2_commission_rate * 100)}% override on your L1's earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <ReferralList items={stats.l2_referrals} empty="No sub-affiliates yet. When your referrals invite others, you earn an override." />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" /> Recent earnings ({stats.recent_earnings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-3">
                  {stats.recent_earnings.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No earnings yet. Commissions appear here within minutes of a referral payment.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {stats.recent_earnings.map(e => (
                        <div key={e.id} className="p-3 rounded-lg border bg-card flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={e.level === 1 ? 'default' : 'secondary'} className="text-[10px]">L{e.level}</Badge>
                              <Badge variant="outline" className="text-[10px]">{e.source_type}</Badge>
                              <StatusBadge status={e.status} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {e.description || `Commission on ${AffiliateService.formatUSD(e.base_amount)} @ ${(e.commission_rate * 100).toFixed(0)}%`}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {new Date(e.created_at).toLocaleString()} · clears {new Date(e.hold_until).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-sm">{AffiliateService.formatUSD(e.commission_amount)}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {AffiliateService.formatUSD(e.withdrawable_amount)} cash<br />
                              {AffiliateService.formatUSD(e.wallet_credit_amount)} credit
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Payout history</CardTitle>
                  <CardDescription>{stats.payouts.length} payouts</CardDescription>
                </div>
                {a.cleared_balance >= settings.min_payout_usd && (
                  <Button size="sm" onClick={() => setPayoutOpen(true)}>
                    <ArrowDownToLine className="h-3 w-3 mr-1" /> Request payout
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {stats.payouts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No payouts yet. Request one once your withdrawable balance hits ${settings.min_payout_usd}.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {stats.payouts.map(p => (
                      <div key={p.id} className="p-3 rounded-lg border bg-card flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{AffiliateService.formatUSD(p.amount)}</p>
                            <PayoutStatusBadge status={p.status} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {p.payout_method.replace('_', ' ')} · fee {AffiliateService.formatUSD(p.fee_amount)} · net {AffiliateService.formatUSD(p.net_amount)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(p.requested_at).toLocaleString()}
                          </p>
                        </div>
                        {p.external_tx_hash && (
                          <code className="text-[10px] text-muted-foreground">{p.external_tx_hash.slice(0, 10)}…</code>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payout preferences</CardTitle>
                <CardDescription>Where your 75% withdrawable share goes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Payout method</Label>
                  <Select value={payoutMethod} onValueChange={v => setPayoutMethod(v as PayoutMethod)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PAYOUT_LABELS) as PayoutMethod[]).map(m => (
                        <SelectItem key={m} value={m}>{PAYOUT_LABELS[m]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {payoutMethod !== 'wallet_credit' && (
                  <div>
                    <Label>
                      {payoutMethod === 'usdc_base' && 'Base wallet address (0x…)'}
                      {payoutMethod === 'stripe_connect' && 'Stripe Connect account ID (acct_…)'}
                      {payoutMethod === 'bank_wire' && 'IBAN / Account number'}
                    </Label>
                    <Input value={payoutAddress} onChange={e => setPayoutAddress(e.target.value)} placeholder="…" />
                  </div>
                )}
                <Button onClick={savePayoutMethod} size="sm">Save</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Program terms (v{settings.terms_version})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>L1 commission:</strong> {Math.round(settings.l1_commission_rate * 100)}% of every payment your direct referrals make for {settings.recurring_months} months.</li>
                  <li><strong>L2 commission:</strong> {Math.round(settings.l2_commission_rate * 100)}% override on what your L1 affiliates earn.</li>
                  <li><strong>Split:</strong> 25% auto-credits to your platform wallet, 75% is fully withdrawable.</li>
                  <li><strong>Hold period:</strong> {settings.hold_days} days (matches refund window).</li>
                  <li><strong>Cookie window:</strong> {settings.cookie_window_days} days, last-click attribution.</li>
                  <li><strong>Min payout:</strong> ${settings.min_payout_usd}.</li>
                  <li><strong>Self-referrals:</strong> blocked. Fraudulent activity reverses all earnings.</li>
                  <li><strong>Tax:</strong> you are responsible for tax in your jurisdiction. We may require W-9 (US) or W-8BEN (non-US) above $600/year.</li>
                  <li><strong>Geography:</strong> available globally except OFAC-sanctioned regions.</li>
                </ul>
                {acceptedTerms && (
                  <p className="text-xs flex items-center gap-1 text-emerald-600 dark:text-emerald-400 pt-2">
                    <CheckCircle2 className="h-3 w-3" /> Accepted v{a.terms_accepted_version} on {new Date(a.terms_accepted_at!).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payout modal */}
      <Dialog open={payoutOpen} onOpenChange={setPayoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request payout</DialogTitle>
            <DialogDescription>
              Available: <strong>{AffiliateService.formatUSD(a.cleared_balance)}</strong> · Min: ${settings.min_payout_usd}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                value={payoutAmount}
                onChange={e => setPayoutAmount(e.target.value)}
                placeholder={`${settings.min_payout_usd}`}
                min={settings.min_payout_usd}
                max={a.cleared_balance}
              />
              <div className="flex gap-1 mt-1">
                {[settings.min_payout_usd, 100, 500, a.cleared_balance].filter((v, i, arr) => arr.indexOf(v) === i && v <= a.cleared_balance).map(v => (
                  <Button key={v} size="sm" variant="outline" className="text-xs h-6"
                    onClick={() => setPayoutAmount(String(v))}>
                    {v === a.cleared_balance ? 'Max' : `$${v}`}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Method</Label>
              <Select value={payoutMethod} onValueChange={v => setPayoutMethod(v as PayoutMethod)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(PAYOUT_LABELS) as PayoutMethod[]).map(m => (
                    <SelectItem key={m} value={m}>{PAYOUT_LABELS[m]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {payoutMethod !== 'wallet_credit' && (
              <div>
                <Label>Destination</Label>
                <Input value={payoutAddress} onChange={e => setPayoutAddress(e.target.value)} placeholder="address / account" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutOpen(false)}>Cancel</Button>
            <Button onClick={submitPayout} disabled={submitting}>
              {submitting ? 'Processing…' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BalanceCard({ icon, label, value, accent, cta }: {
  icon: React.ReactNode; label: string; value: number; accent: string; cta?: React.ReactNode;
}) {
  return (
    <Card className={`bg-gradient-to-br ${accent} border-border/40`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          {icon} {label}
        </div>
        <p className="text-xl md:text-2xl font-bold">{AffiliateService.formatUSD(value)}</p>
        {cta}
      </CardContent>
    </Card>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {icon} {label}
        </div>
        <p className="text-lg font-semibold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

function ReferralList({ items, empty }: { items: AffiliateStats['l1_referrals']; empty: string }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground text-center py-6">{empty}</p>;
  return (
    <ScrollArea className="max-h-[300px] pr-3">
      <div className="space-y-2">
        {items.map(r => (
          <div key={r.id} className="p-2.5 rounded-md border bg-card/50 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Signed up {new Date(r.signup_at).toLocaleDateString()}</p>
              {r.first_payment_at && (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  Paying since {new Date(r.first_payment_at).toLocaleDateString()}
                </p>
              )}
            </div>
            <Badge variant={r.first_payment_at ? 'default' : 'outline'} className="text-[10px]">
              {r.first_payment_at ? 'paying' : 'signup'}
            </Badge>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    cleared: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    paid: 'bg-primary/10 text-primary',
    reversed: 'bg-destructive/10 text-destructive',
  };
  return <span className={`text-[10px] px-1.5 py-0.5 rounded ${variants[status] || ''}`}>{status}</span>;
}

function PayoutStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    requested: 'bg-blue-500/10 text-blue-600',
    processing: 'bg-amber-500/10 text-amber-600',
    completed: 'bg-emerald-500/10 text-emerald-600',
    failed: 'bg-destructive/10 text-destructive',
    cancelled: 'bg-muted text-muted-foreground',
  };
  return <span className={`text-[10px] px-1.5 py-0.5 rounded ${variants[status] || ''}`}>{status}</span>;
}
