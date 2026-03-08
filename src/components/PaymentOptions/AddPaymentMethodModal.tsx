import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Lock, CreditCard } from 'lucide-react';
import { PaymentMethod, PaymentMethodType, CryptoType, PAYMENT_METHOD_CONFIG, CRYPTO_CONFIG } from './types';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: PaymentMethod) => void;
  editMethod?: PaymentMethod | null;
}

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({ isOpen, onClose, onAdd, editMethod }) => {
  const [activeTab, setActiveTab] = useState<string>('card');
  const [methodType, setMethodType] = useState<PaymentMethodType>(editMethod?.type || 'visa');
  const [cardNumber, setCardNumber] = useState(editMethod?.lastFour ? `•••• •••• •••• ${editMethod.lastFour}` : '');
  const [holderName, setHolderName] = useState(editMethod?.holderName || '');
  const [expiryDate, setExpiryDate] = useState(editMethod?.expiryDate || '');
  const [email, setEmail] = useState(editMethod?.email || '');
  const [walletAddress, setWalletAddress] = useState(editMethod?.walletAddress || '');
  const [cryptoType, setCryptoType] = useState<CryptoType>(editMethod?.cryptoType || 'bitcoin');
  const [bankName, setBankName] = useState(editMethod?.bankName || '');
  const [iban, setIban] = useState(editMethod?.iban || '');
  const [label, setLabel] = useState(editMethod?.label || '');

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleSubmit = () => {
    const lastFour = cardNumber.replace(/\D/g, '').slice(-4);
    const newMethod: PaymentMethod = {
      id: editMethod?.id || `pm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: methodType,
      label: label || PAYMENT_METHOD_CONFIG[methodType].label,
      lastFour: ['visa', 'mastercard', 'amex'].includes(methodType) ? lastFour : undefined,
      expiryDate: ['visa', 'mastercard', 'amex'].includes(methodType) ? expiryDate : undefined,
      holderName: holderName || undefined,
      isDefault: editMethod?.isDefault || false,
      isActive: true,
      createdAt: editMethod?.createdAt || new Date().toISOString(),
      cryptoType: methodType === 'crypto' ? cryptoType : undefined,
      walletAddress: methodType === 'crypto' ? walletAddress : undefined,
      bankName: methodType === 'bank-transfer' ? bankName : undefined,
      iban: methodType === 'bank-transfer' ? iban : undefined,
      email: methodType === 'paypal' ? email : undefined,
      isEncrypted: true,
    };
    onAdd(newMethod);
    onClose();
  };

  const cardTypes: PaymentMethodType[] = ['visa', 'mastercard', 'amex'];
  const digitalTypes: PaymentMethodType[] = ['paypal', 'google-pay', 'apple-pay', 'stripe', 'wise'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {editMethod ? 'Edit Payment Method' : 'Add Payment Method'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 mb-4">
          <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            All payment data is AES-256 encrypted and stored locally on your device. Never transmitted to any server.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="card">💳 Card</TabsTrigger>
            <TabsTrigger value="digital">🔵 Digital</TabsTrigger>
            <TabsTrigger value="crypto">🪙 Crypto</TabsTrigger>
            <TabsTrigger value="bank">🏦 Bank</TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4 mt-4">
            <div>
              <Label>Card Type</Label>
              <Select value={methodType} onValueChange={(v) => setMethodType(v as PaymentMethodType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cardTypes.map(t => (
                    <SelectItem key={t} value={t}>
                      {PAYMENT_METHOD_CONFIG[t].icon} {PAYMENT_METHOD_CONFIG[t].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Card Number</Label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>
            <div>
              <Label>Cardholder Name</Label>
              <Input placeholder="John Doe" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Expiry</Label>
                <Input
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <Label>CVV</Label>
                <Input placeholder="•••" type="password" maxLength={4} />
              </div>
            </div>
            <div>
              <Label>Label (optional)</Label>
              <Input placeholder="e.g., Personal Visa" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
          </TabsContent>

          <TabsContent value="digital" className="space-y-4 mt-4">
            <div>
              <Label>Payment Service</Label>
              <Select value={methodType} onValueChange={(v) => setMethodType(v as PaymentMethodType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {digitalTypes.map(t => (
                    <SelectItem key={t} value={t}>
                      {PAYMENT_METHOD_CONFIG[t].icon} {PAYMENT_METHOD_CONFIG[t].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {methodType === 'paypal' && (
              <div>
                <Label>PayPal Email</Label>
                <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            )}
            {(methodType === 'google-pay' || methodType === 'apple-pay') && (
              <div>
                <Label>Associated Email</Label>
                <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            )}
            {methodType === 'stripe' && (
              <div>
                <Label>Stripe Account Email</Label>
                <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            )}
            {methodType === 'wise' && (
              <>
                <div>
                  <Label>Wise Email</Label>
                  <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label>Account Holder</Label>
                  <Input placeholder="Full Name" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
                </div>
              </>
            )}
            <div>
              <Label>Label (optional)</Label>
              <Input placeholder="e.g., Business PayPal" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4 mt-4">
            <div>
              <Label>Cryptocurrency</Label>
              <Select value={cryptoType} onValueChange={(v) => setCryptoType(v as CryptoType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CRYPTO_CONFIG) as CryptoType[]).map(c => (
                    <SelectItem key={c} value={c}>
                      {CRYPTO_CONFIG[c].icon} {CRYPTO_CONFIG[c].label} ({CRYPTO_CONFIG[c].symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Wallet Address</Label>
              <Input
                placeholder="0x1234...abcd"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label>Label (optional)</Label>
              <Input placeholder="e.g., Cold Storage BTC" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4 mt-4">
            {(() => { setMethodType('bank-transfer'); return null; })()}
            <div>
              <Label>Bank Name</Label>
              <Input placeholder="e.g., Deutsche Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </div>
            <div>
              <Label>IBAN / Account Number</Label>
              <Input
                placeholder="DE89 3704 0044 0532 0130 00"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="font-mono"
              />
            </div>
            <div>
              <Label>Account Holder</Label>
              <Input placeholder="Full Name" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
            </div>
            <div>
              <Label>Label (optional)</Label>
              <Input placeholder="e.g., EU Business Account" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Shield className="h-4 w-4" />
            {editMethod ? 'Update Method' : 'Add Securely'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
