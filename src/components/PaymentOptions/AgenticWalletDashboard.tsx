import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Bot, Shield, CreditCard, Zap, Eye, EyeOff, Settings2,
  ArrowRightLeft, CheckCircle2, Clock, AlertTriangle, Plus,
  Trash2, Edit, Lock, Wallet, Globe, Cpu, TrendingUp
} from 'lucide-react';
import {
  AgenticTransaction, SpendingGuardrail, VirtualCard, AgenticWalletConfig,
  DEMO_WALLET_CONFIG, DEMO_GUARDRAILS, DEMO_VIRTUAL_CARDS, DEMO_AGENTIC_TRANSACTIONS,
  PROTOCOL_INFO,
} from '@/data/agenticCommerceData';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEYS = {
  config: 'sn_agentic_config',
  guardrails: 'sn_agentic_guardrails',
  virtualCards: 'sn_agentic_vcards',
  transactions: 'sn_agentic_txns',
};

const AgenticWalletDashboard: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<AgenticWalletConfig>(DEMO_WALLET_CONFIG);
  const [guardrails, setGuardrails] = useState<SpendingGuardrail[]>(DEMO_GUARDRAILS);
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>(DEMO_VIRTUAL_CARDS);
  const [transactions, setTransactions] = useState<AgenticTransaction[]>(DEMO_AGENTIC_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddGuardrail, setShowAddGuardrail] = useState(false);
  const [showIssueCard, setShowIssueCard] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.config);
    if (stored) {
      try { setConfig(JSON.parse(stored)); } catch {}
    }
    const storedGr = localStorage.getItem(STORAGE_KEYS.guardrails);
    if (storedGr) {
      try { setGuardrails(JSON.parse(storedGr)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.guardrails, JSON.stringify(guardrails));
  }, [guardrails]);

  const totalSpentToday = transactions
    .filter(t => t.currency === 'USD' && new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((s, t) => s + t.amount, 0);

  const totalMicroPayments = transactions
    .filter(t => t.protocol === 'x402')
    .reduce((s, t) => s + t.amount, 0);

  const activeVCards = virtualCards.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary" />
            SuperNomad Wallet
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Agentic Commerce — AI-powered autonomous payments
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/30 gap-1 text-xs">
          <Cpu className="h-3 w-3" /> AI Agent Active
        </Badge>
      </div>

      {/* Protocol Status Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {(Object.entries(PROTOCOL_INFO) as [keyof typeof PROTOCOL_INFO, typeof PROTOCOL_INFO[keyof typeof PROTOCOL_INFO]][]).map(([key, info]) => {
          const enabled = key === 'x402' ? config.x402Enabled
            : key === 'stripe-issuing' ? config.stripeIssuingEnabled
            : key === 'visa-tap' ? config.visaTapEnabled
            : config.mastercardCloudEnabled;
          return (
            <Card key={key} className={`p-3 border-2 transition-all ${enabled ? info.borderClass : 'border-muted opacity-60'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{info.icon}</span>
                <span className={`text-xs font-semibold ${enabled ? info.color : 'text-muted-foreground'}`}>
                  {info.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={enabled ? 'default' : 'outline'} className="text-[10px]">
                  {enabled ? '● Online' : '○ Offline'}
                </Badge>
                <Switch
                  checked={enabled}
                  onCheckedChange={(v) => {
                    const configKey = key === 'x402' ? 'x402Enabled'
                      : key === 'stripe-issuing' ? 'stripeIssuingEnabled'
                      : key === 'visa-tap' ? 'visaTapEnabled'
                      : 'mastercardCloudEnabled';
                    setConfig(prev => ({ ...prev, [configKey]: v }));
                    toast({ title: v ? `✅ ${info.name} Enabled` : `⏸ ${info.name} Paused` });
                  }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-xl font-bold">${config.usdcBalance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">USDC Balance</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-violet-500" />
            <div>
              <p className="text-xl font-bold">${totalMicroPayments.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">x402 Micro-Pays</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xl font-bold">{activeVCards}</p>
              <p className="text-xs text-muted-foreground">Active V-Cards</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xl font-bold">{guardrails.filter(g => g.isActive).length}</p>
              <p className="text-xs text-muted-foreground">Active Rules</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xl font-bold">{transactions.length}</p>
              <p className="text-xs text-muted-foreground">AI Transactions</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-1 text-xs sm:text-sm">
            <Globe className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="guardrails" className="gap-1 text-xs sm:text-sm">
            <Shield className="h-4 w-4" /> Guardrails
          </TabsTrigger>
          <TabsTrigger value="vcards" className="gap-1 text-xs sm:text-sm">
            <CreditCard className="h-4 w-4" /> V-Cards
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-1 text-xs sm:text-sm">
            <ArrowRightLeft className="h-4 w-4" /> Activity
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* How It Works */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                How Agentic Commerce Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AgenticScenarioCard />

                {/* Protocol Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(Object.entries(PROTOCOL_INFO) as [string, typeof PROTOCOL_INFO[keyof typeof PROTOCOL_INFO]][]).map(([key, info]) => (
                    <Card key={key} className={`p-4 border-2 ${info.borderClass}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{info.icon}</span>
                        <div>
                          <p className={`font-semibold text-sm ${info.color}`}>{info.name}</p>
                          <p className="text-xs text-muted-foreground">{info.provider}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{info.description}</p>
                      <Badge variant="outline" className="text-[10px]">Best for: {info.bestFor}</Badge>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Global Settings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                AI Agent Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Auto-Pay Mode</p>
                  <p className="text-xs text-muted-foreground">AI can pay autonomously below threshold</p>
                </div>
                <Switch
                  checked={config.autoPayEnabled}
                  onCheckedChange={(v) => setConfig(prev => ({ ...prev, autoPayEnabled: v }))}
                />
              </div>
              <div className="p-3 rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Auto-Approve Threshold</p>
                  <Badge variant="outline">${config.maxAutoPayAmount}</Badge>
                </div>
                <Slider
                  value={[config.maxAutoPayAmount]}
                  onValueChange={([v]) => setConfig(prev => ({ ...prev, maxAutoPayAmount: v }))}
                  min={10}
                  max={1000}
                  step={10}
                />
                <p className="text-xs text-muted-foreground">
                  AI will auto-approve transactions up to ${config.maxAutoPayAmount}. Above this, you'll be asked.
                </p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Preferred Crypto Network</p>
                  <p className="text-xs text-muted-foreground">For x402 micro-payments</p>
                </div>
                <Select
                  value={config.preferredCryptoNetwork}
                  onValueChange={(v: 'base' | 'solana' | 'ethereum') => setConfig(prev => ({ ...prev, preferredCryptoNetwork: v }))}
                >
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base">Base (L2)</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guardrails Tab */}
        <TabsContent value="guardrails" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Spending Guardrails
                </CardTitle>
                <Button size="sm" onClick={() => setShowAddGuardrail(true)} className="gap-1">
                  <Plus className="h-4 w-4" /> Add Rule
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Define how your AI agent can spend. Set limits by category, amount, and approval rules.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {guardrails.map(gr => (
                <div key={gr.id} className="p-4 rounded-lg border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{gr.name}</span>
                      <Badge variant={gr.isActive ? 'default' : 'outline'} className="text-[10px]">
                        {gr.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={gr.isActive}
                        onCheckedChange={() => setGuardrails(prev => prev.map(g =>
                          g.id === gr.id ? { ...g, isActive: !g.isActive } : g
                        ))}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setGuardrails(prev => prev.filter(g => g.id !== gr.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{gr.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground">Per Transaction</p>
                      <p className="font-semibold">${gr.maxPerTransaction.toLocaleString()}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground">Daily Limit</p>
                      <p className="font-semibold">${gr.maxDaily.toLocaleString()}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground">Weekly Limit</p>
                      <p className="font-semibold">${gr.maxWeekly.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {gr.requireApproval ? (
                      <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300">
                        <AlertTriangle className="h-3 w-3" /> Approve above ${gr.approvalThreshold}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> Fully autonomous
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px]">
                      {gr.allowedCategories.join(', ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Virtual Cards Tab */}
        <TabsContent value="vcards" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Virtual Cards (Stripe Issuing)
                </CardTitle>
                <Button size="sm" onClick={() => setShowIssueCard(true)} className="gap-1">
                  <Plus className="h-4 w-4" /> Issue Card
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Single-use or merchant-locked virtual Visa/Mastercard numbers generated by AI for secure bookings.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {virtualCards.map(vc => {
                const statusColors = {
                  active: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
                  used: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
                  expired: 'text-muted-foreground bg-muted/50 border-muted',
                  cancelled: 'text-destructive bg-destructive/10 border-destructive/30',
                };
                return (
                  <div key={vc.id} className={`p-4 rounded-lg border-2 ${statusColors[vc.status]}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{vc.network === 'visa' ? '💳' : '🔶'}</span>
                        <div>
                          <p className="font-mono font-semibold text-sm">
                            •••• •••• •••• {vc.last4}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {vc.network} • {vc.type.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${vc.amount.toLocaleString()}</p>
                        <Badge variant="outline" className="text-[10px] capitalize">{vc.status}</Badge>
                      </div>
                    </div>
                    {vc.merchant && (
                      <p className="text-xs text-muted-foreground">
                        🏪 Locked to: <span className="font-medium">{vc.merchant}</span>
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>Created by: {vc.createdBy === 'ai-agent' ? '🤖 AI Agent' : '👤 You'}</span>
                      <span>Exp: {new Date(vc.expiresAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                AI Agent Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {transactions.map(tx => {
                const proto = PROTOCOL_INFO[tx.protocol];
                return (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg ${proto.bgClass} shrink-0`}>
                        {proto.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{tx.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className={proto.color}>{proto.name}</span>
                          {tx.merchant && <span>• {tx.merchant}</span>}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {tx.aiInitiated && (
                            <Badge variant="outline" className="text-[9px] gap-0.5 h-4">
                              <Bot className="h-2.5 w-2.5" /> AI
                            </Badge>
                          )}
                          {tx.userApproved && (
                            <Badge variant="outline" className="text-[9px] gap-0.5 h-4 text-emerald-600 border-emerald-300">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Approved
                            </Badge>
                          )}
                          {tx.trustScore && (
                            <Badge variant="outline" className="text-[9px] gap-0.5 h-4 text-blue-600 border-blue-300">
                              <Shield className="h-2.5 w-2.5" /> TAP {tx.trustScore}%
                            </Badge>
                          )}
                          {tx.virtualCardLast4 && (
                            <Badge variant="outline" className="text-[9px] h-4">
                              •{tx.virtualCardLast4}
                            </Badge>
                          )}
                          {tx.cryptoNetwork && (
                            <Badge variant="outline" className="text-[9px] h-4">
                              {tx.cryptoNetwork}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-sm font-semibold">
                        {tx.currency === 'USDC' ? `${tx.amount.toFixed(2)} USDC` : `$${tx.amount.toLocaleString()}`}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[9px] ${
                          tx.status === 'completed' ? 'text-emerald-600 border-emerald-300' :
                          tx.status === 'authorized' ? 'text-amber-600 border-amber-300' :
                          tx.status === 'declined' ? 'text-destructive border-destructive/50' :
                          'text-muted-foreground'
                        }`}
                      >
                        {tx.status === 'completed' ? '✓' : tx.status === 'authorized' ? '⏳' : '✗'} {tx.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Guardrail Modal */}
      <AddGuardrailModal
        open={showAddGuardrail}
        onClose={() => setShowAddGuardrail(false)}
        onAdd={(gr) => {
          setGuardrails(prev => [...prev, gr]);
          toast({ title: '✅ Guardrail Added', description: `"${gr.name}" is now active.` });
        }}
      />

      {/* Issue Virtual Card Modal */}
      <IssueVirtualCardModal
        open={showIssueCard}
        onClose={() => setShowIssueCard(false)}
        onIssue={(vc) => {
          setVirtualCards(prev => [vc, ...prev]);
          toast({ title: '💳 Virtual Card Issued', description: `${vc.network.toUpperCase()} •••${vc.last4} ready for ${vc.merchant || 'any merchant'}.` });
        }}
      />
    </div>
  );
};

// Sub-component: Add Guardrail Modal
const AddGuardrailModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onAdd: (gr: SpendingGuardrail) => void;
}> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxPer, setMaxPer] = useState('500');
  const [maxDaily, setMaxDaily] = useState('2000');
  const [maxWeekly, setMaxWeekly] = useState('10000');
  const [threshold, setThreshold] = useState('200');
  const [requireApproval, setRequireApproval] = useState(true);

  const handleSubmit = () => {
    onAdd({
      id: `gr-${Date.now()}`,
      name,
      description,
      maxPerTransaction: parseInt(maxPer) || 500,
      maxDaily: parseInt(maxDaily) || 2000,
      maxWeekly: parseInt(maxWeekly) || 10000,
      currency: 'USD',
      allowedCategories: ['booking', 'dining', 'transport', 'subscription'],
      blockedCategories: [],
      requireApproval,
      approvalThreshold: parseInt(threshold) || 200,
      isActive: true,
    });
    onClose();
    setName(''); setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Create Spending Guardrail
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Rule Name</Label>
            <Input placeholder="e.g., Entertainment Budget" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Input placeholder="What this rule controls..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Max Per Txn</Label>
              <Input type="number" value={maxPer} onChange={e => setMaxPer(e.target.value)} />
            </div>
            <div>
              <Label>Daily Limit</Label>
              <Input type="number" value={maxDaily} onChange={e => setMaxDaily(e.target.value)} />
            </div>
            <div>
              <Label>Weekly Limit</Label>
              <Input type="number" value={maxWeekly} onChange={e => setMaxWeekly(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Require User Approval</p>
              <p className="text-xs text-muted-foreground">Above the threshold amount</p>
            </div>
            <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
          </div>
          {requireApproval && (
            <div>
              <Label>Approval Threshold ($)</Label>
              <Input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} />
            </div>
          )}
          <Button onClick={handleSubmit} disabled={!name} className="w-full gap-2">
            <Shield className="h-4 w-4" /> Create Guardrail
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Sub-component: Issue Virtual Card Modal
const IssueVirtualCardModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onIssue: (vc: VirtualCard) => void;
}> = ({ open, onClose, onIssue }) => {
  const [network, setNetwork] = useState<'visa' | 'mastercard'>('visa');
  const [type, setType] = useState<'single-use' | 'recurring' | 'merchant-locked'>('single-use');
  const [amount, setAmount] = useState('100');
  const [merchant, setMerchant] = useState('');

  const handleSubmit = () => {
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    onIssue({
      id: `vc-${Date.now()}`,
      last4,
      network,
      type,
      status: 'active',
      amount: parseFloat(amount) || 100,
      currency: 'USD',
      merchant: type === 'merchant-locked' ? merchant : undefined,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'user',
    });
    onClose();
    setAmount('100'); setMerchant('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Issue Virtual Card
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Card Network</Label>
            <Select value={network} onValueChange={(v: 'visa' | 'mastercard') => setNetwork(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="visa">💳 Visa</SelectItem>
                <SelectItem value="mastercard">🔶 Mastercard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Card Type</Label>
            <Select value={type} onValueChange={(v: 'single-use' | 'recurring' | 'merchant-locked') => setType(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single-use">Single-Use (expires after 1 transaction)</SelectItem>
                <SelectItem value="recurring">Recurring (active until expiry)</SelectItem>
                <SelectItem value="merchant-locked">Merchant-Locked (only works at one merchant)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Pre-loaded Amount ($)</Label>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          {type === 'merchant-locked' && (
            <div>
              <Label>Merchant Name</Label>
              <Input placeholder="e.g., AirBnB, Booking.com" value={merchant} onChange={e => setMerchant(e.target.value)} />
            </div>
          )}
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Virtual card secured via Stripe Issuing with Visa TAP verification. One-time number, exact amount.
              </p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={!amount || (type === 'merchant-locked' && !merchant)} className="w-full gap-2">
            <CreditCard className="h-4 w-4" /> Issue Card Securely
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgenticWalletDashboard;
