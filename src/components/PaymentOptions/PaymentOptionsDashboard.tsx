import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, Plus, Shield, Lock, Wallet, Settings2, 
  ArrowRightLeft, AlertTriangle, CheckCircle2, Bot 
} from 'lucide-react';
import { PaymentMethod, PaymentPreference, PAYMENT_METHOD_CONFIG } from './types';
import { PaymentMethodCard } from './PaymentMethodCard';
import { AddPaymentMethodModal } from './AddPaymentMethodModal';
import { PaymentPreferences } from './PaymentPreferences';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { encryptJson, decryptJson } from '@/utils/secureStorage';
import MFAGate from '@/components/auth/MFAGate';

const AgenticWalletDashboard = lazy(() => import('./AgenticWalletDashboard'));

const STORAGE_KEY = 'sn_payment_methods_enc';
const PREFS_KEY = 'sn_payment_prefs_enc';

// Demo payment methods
const DEMO_METHODS: PaymentMethod[] = [
  {
    id: 'demo-visa-1',
    type: 'visa',
    label: 'Personal Visa',
    lastFour: '4242',
    expiryDate: '09/27',
    holderName: 'John Nomad',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-15',
    isEncrypted: true,
  },
  {
    id: 'demo-mc-1',
    type: 'mastercard',
    label: 'Business Mastercard',
    lastFour: '8888',
    expiryDate: '12/26',
    holderName: 'John Nomad',
    isDefault: false,
    isActive: true,
    createdAt: '2024-02-01',
    isEncrypted: true,
  },
  {
    id: 'demo-paypal-1',
    type: 'paypal',
    label: 'PayPal Business',
    email: 'john@nomadlife.com',
    isDefault: false,
    isActive: true,
    createdAt: '2024-01-20',
    isEncrypted: true,
  },
  {
    id: 'demo-crypto-1',
    type: 'crypto',
    label: 'BTC Cold Storage',
    cryptoType: 'bitcoin',
    walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    isDefault: false,
    isActive: true,
    createdAt: '2024-03-10',
    isEncrypted: true,
  },
  {
    id: 'demo-apple-1',
    type: 'apple-pay',
    label: 'Apple Pay',
    email: 'john@icloud.com',
    isDefault: false,
    isActive: true,
    createdAt: '2024-04-01',
    isEncrypted: true,
  },
  {
    id: 'demo-wise-1',
    type: 'wise',
    label: 'Wise EUR Account',
    email: 'john@nomadlife.com',
    holderName: 'John Nomad',
    isDefault: false,
    isActive: true,
    createdAt: '2024-02-15',
    isEncrypted: true,
  },
  {
    id: 'demo-eth-1',
    type: 'crypto',
    label: 'ETH DeFi Wallet',
    cryptoType: 'ethereum',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD2e',
    isDefault: false,
    isActive: false,
    createdAt: '2024-05-01',
    isEncrypted: true,
  },
  {
    id: 'demo-bank-1',
    type: 'bank-transfer',
    label: 'EU Business Account',
    bankName: 'Revolut Business',
    iban: 'LT603250028161279800',
    holderName: 'John Nomad LLC',
    isDefault: false,
    isActive: true,
    createdAt: '2024-01-05',
    isEncrypted: true,
  },
];

const DEMO_PREFS: PaymentPreference[] = [
  {
    id: 'pref-1',
    name: 'SaaS Subscriptions',
    description: 'Monthly software & tools subscriptions',
    primaryMethodId: 'demo-visa-1',
    fallbackMethodId: 'demo-paypal-1',
    maxAmount: 500,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 'pref-2',
    name: 'Freelance Payments',
    description: 'Receive freelance income via crypto or Wise',
    primaryMethodId: 'demo-wise-1',
    fallbackMethodId: 'demo-crypto-1',
    currency: 'EUR',
    isActive: true,
  },
  {
    id: 'pref-3',
    name: 'Travel Expenses',
    description: 'Hotels, flights, and transport',
    primaryMethodId: 'demo-mc-1',
    fallbackMethodId: 'demo-apple-1',
    maxAmount: 5000,
    currency: 'USD',
    isActive: true,
  },
];

const PaymentOptionsDashboard: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [preferences, setPreferences] = useState<PaymentPreference[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMethod, setEditMethod] = useState<PaymentMethod | null>(null);
  const [activeTab, setActiveTab] = useState('methods');

  // Load from encrypted localStorage (AES-256-GCM)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedPrefs = localStorage.getItem(PREFS_KEY);
      if (stored) {
        const data = await decryptJson<PaymentMethod[]>(stored);
        if (!cancelled && data && Array.isArray(data)) {
          setMethods(data);
        } else if (!cancelled) {
          setMethods(DEMO_METHODS);
        }
      } else if (!cancelled) {
        setMethods(DEMO_METHODS);
      }
      if (storedPrefs) {
        const data = await decryptJson<PaymentPreference[]>(storedPrefs);
        if (!cancelled && data && Array.isArray(data)) {
          setPreferences(data);
        } else if (!cancelled) {
          setPreferences(DEMO_PREFS);
        }
      } else if (!cancelled) {
        setPreferences(DEMO_PREFS);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Persist encrypted (AES-256-GCM, async)
  useEffect(() => {
    if (methods.length > 0) {
      encryptJson(methods).then(blob => localStorage.setItem(STORAGE_KEY, blob)).catch(() => {});
    }
  }, [methods]);

  useEffect(() => {
    if (preferences.length > 0) {
      encryptJson(preferences).then(blob => localStorage.setItem(PREFS_KEY, blob)).catch(() => {});
    }
  }, [preferences]);

  const handleAddMethod = (method: PaymentMethod) => {
    const existing = methods.findIndex(m => m.id === method.id);
    if (existing >= 0) {
      setMethods(prev => prev.map(m => m.id === method.id ? method : m));
      toast({ title: '✅ Method Updated', description: `${method.label} has been updated securely.` });
    } else {
      setMethods(prev => [...prev, method]);
      toast({ title: '✅ Method Added', description: `${method.label} added with AES-256 encryption.` });
    }
    setEditMethod(null);
  };

  const handleToggle = (id: string) => {
    setMethods(prev => prev.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
  };

  const handleSetDefault = (id: string) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
    toast({ title: '⭐ Default Updated', description: 'Default payment method changed.' });
  };

  const handleDelete = (id: string) => {
    setMethods(prev => prev.filter(m => m.id !== id));
    toast({ title: 'Removed', description: 'Payment method deleted securely.' });
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditMethod(method);
    setShowAddModal(true);
  };

  // Stats
  const stats = useMemo(() => {
    const active = methods.filter(m => m.isActive);
    const cards = active.filter(m => ['visa', 'mastercard', 'amex'].includes(m.type));
    const digital = active.filter(m => ['paypal', 'google-pay', 'apple-pay', 'stripe', 'wise'].includes(m.type));
    const crypto = active.filter(m => m.type === 'crypto');
    const defaultMethod = methods.find(m => m.isDefault);
    return { total: active.length, cards: cards.length, digital: digital.length, crypto: crypto.length, defaultMethod };
  }, [methods]);

  const methodsByCategory = useMemo(() => ({
    cards: methods.filter(m => ['visa', 'mastercard', 'amex'].includes(m.type)),
    digital: methods.filter(m => ['paypal', 'google-pay', 'apple-pay', 'stripe', 'wise'].includes(m.type)),
    crypto: methods.filter(m => m.type === 'crypto'),
    bank: methods.filter(m => m.type === 'bank-transfer'),
  }), [methods]);

  return (
    <MFAGate flag="require_mfa_for_payments" area="your payment options">
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Wallet className="h-8 w-8 text-primary" />
            {t('payment.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('payment.subtitle')}
          </p>
        </div>
        <Button onClick={() => { setEditMethod(null); setShowAddModal(true); }} className="gap-2 shadow-md">
          <Plus className="h-5 w-5" /> {t('payment.add_method')}
        </Button>
      </div>

      {/* Security Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500/10 via-primary/10 to-emerald-500/10 border-2 border-emerald-200/50 dark:border-emerald-800/50 p-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">{t('payment.encrypted')}</p>
            <p className="text-xs text-muted-foreground">
              {t('payment.encrypted_desc')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 gap-1">
              <Shield className="h-3 w-3" /> PCI DSS
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 gap-1">
              <CheckCircle2 className="h-3 w-3" /> SOC 2
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">{t('payment.active_methods')}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <div>
              <p className="text-xl font-bold">{stats.cards}</p>
              <p className="text-xs text-muted-foreground">{t('payment.credit_cards')}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔵</span>
            <div>
              <p className="text-xl font-bold">{stats.digital}</p>
              <p className="text-xs text-muted-foreground">{t('payment.digital_wallets')}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <div>
              <p className="text-xl font-bold">{stats.crypto}</p>
              <p className="text-xs text-muted-foreground">{t('payment.crypto_wallets')}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <div>
              <p className="text-xl font-bold truncate text-sm">{stats.defaultMethod ? PAYMENT_METHOD_CONFIG[stats.defaultMethod.type].label : '—'}</p>
              <p className="text-xs text-muted-foreground">{t('payment.default')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="methods" className="gap-1 text-xs sm:text-sm sm:gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">{t('payment.methods_tab')}</span>
          </TabsTrigger>
          <TabsTrigger value="agentic" className="gap-1 text-xs sm:text-sm sm:gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI Wallet</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-1 text-xs sm:text-sm sm:gap-2">
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t('payment.rules_tab')}</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1 text-xs sm:text-sm sm:gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t('payment.activity_tab')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="mt-4 space-y-6">
          {/* Credit Cards */}
          {methodsByCategory.cards.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                💳 {t('payment.credit_debit')}
                <Badge variant="outline" className="text-xs">{methodsByCategory.cards.length}</Badge>
              </h3>
              <div className="space-y-2">
                {methodsByCategory.cards.map(m => (
                  <PaymentMethodCard key={m.id} method={m} onToggleActive={handleToggle} onSetDefault={handleSetDefault} onDelete={handleDelete} onEdit={handleEdit} />
                ))}
              </div>
            </div>
          )}

          {/* Digital Wallets */}
          {methodsByCategory.digital.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                🔵 {t('payment.digital_services')}
                <Badge variant="outline" className="text-xs">{methodsByCategory.digital.length}</Badge>
              </h3>
              <div className="space-y-2">
                {methodsByCategory.digital.map(m => (
                  <PaymentMethodCard key={m.id} method={m} onToggleActive={handleToggle} onSetDefault={handleSetDefault} onDelete={handleDelete} onEdit={handleEdit} />
                ))}
              </div>
            </div>
          )}

          {/* Crypto */}
          {methodsByCategory.crypto.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                🪙 {t('payment.cryptocurrency')}
                <Badge variant="outline" className="text-xs">{methodsByCategory.crypto.length}</Badge>
              </h3>
              <div className="space-y-2">
                {methodsByCategory.crypto.map(m => (
                  <PaymentMethodCard key={m.id} method={m} onToggleActive={handleToggle} onSetDefault={handleSetDefault} onDelete={handleDelete} onEdit={handleEdit} />
                ))}
              </div>
            </div>
          )}

          {/* Bank */}
          {methodsByCategory.bank.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                🏦 {t('payment.bank_accounts')}
                <Badge variant="outline" className="text-xs">{methodsByCategory.bank.length}</Badge>
              </h3>
              <div className="space-y-2">
                {methodsByCategory.bank.map(m => (
                  <PaymentMethodCard key={m.id} method={m} onToggleActive={handleToggle} onSetDefault={handleSetDefault} onDelete={handleDelete} onEdit={handleEdit} />
                ))}
              </div>
            </div>
          )}

          {methods.length === 0 && (
            <Card className="p-8 text-center">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{t('payment.no_methods')}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t('payment.add_first')}</p>
              <Button onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus className="h-4 w-4" /> {t('payment.add_payment_method')}
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="agentic" className="mt-4">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <AgenticWalletDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <PaymentPreferences methods={methods} preferences={preferences} onSave={setPreferences} />
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                {t('payment.recent_activity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { date: 'Mar 7, 2026', desc: 'Spotify Premium', amount: '$14.99', method: 'Visa •4242', status: 'completed' },
                { date: 'Mar 6, 2026', desc: 'Coworking Space — Bali', amount: '$85.00', method: 'Mastercard •8888', status: 'completed' },
                { date: 'Mar 5, 2026', desc: 'Wise Transfer → EUR', amount: '$2,500.00', method: 'Wise EUR', status: 'completed' },
                { date: 'Mar 4, 2026', desc: 'SafetyWing Insurance', amount: '$83.00', method: 'PayPal', status: 'completed' },
                { date: 'Mar 3, 2026', desc: 'ETH Gas Fees', amount: '$4.23', method: 'ETH DeFi', status: 'completed' },
                { date: 'Mar 2, 2026', desc: 'AirBnB Bangkok', amount: '$420.00', method: 'Apple Pay', status: 'completed' },
                { date: 'Mar 1, 2026', desc: 'Freelance Payment Received', amount: '+$3,200.00', method: 'BTC Cold Storage', status: 'received' },
                { date: 'Feb 28, 2026', desc: 'Notion Team Plan', amount: '$24.00', method: 'Visa •4242', status: 'completed' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{tx.desc}</p>
                    <p className="text-xs text-muted-foreground">{tx.date} • {tx.method}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold ${tx.status === 'received' ? 'text-emerald-600' : ''}`}>
                      {tx.amount}
                    </p>
                    <Badge variant={tx.status === 'received' ? 'default' : 'outline'} className="text-xs">
                      {tx.status === 'received' ? '↓ Received' : '✓ Paid'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      <AddPaymentMethodModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditMethod(null); }}
        onAdd={handleAddMethod}
        editMethod={editMethod}
      />
    </div>
    </MFAGate>
  );
};

export default PaymentOptionsDashboard;
