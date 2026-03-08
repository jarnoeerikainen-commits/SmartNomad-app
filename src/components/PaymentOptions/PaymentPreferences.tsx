import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Settings2, Trash2, ArrowRightLeft } from 'lucide-react';
import { PaymentMethod, PaymentPreference, PAYMENT_METHOD_CONFIG } from './types';

interface PaymentPreferencesProps {
  methods: PaymentMethod[];
  preferences: PaymentPreference[];
  onSave: (preferences: PaymentPreference[]) => void;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'SGD', 'AED', 'THB', 'BRL', 'INR'];

export const PaymentPreferences: React.FC<PaymentPreferencesProps> = ({ methods, preferences, onSave }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [primaryId, setPrimaryId] = useState('');
  const [fallbackId, setFallbackId] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [currency, setCurrency] = useState('USD');

  const activeMethods = methods.filter(m => m.isActive);

  const handleAdd = () => {
    const pref: PaymentPreference = {
      id: `pref-${Date.now()}`,
      name,
      description,
      primaryMethodId: primaryId,
      fallbackMethodId: fallbackId || undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      currency,
      isActive: true,
    };
    onSave([...preferences, pref]);
    setShowAdd(false);
    setName(''); setDescription(''); setPrimaryId(''); setFallbackId(''); setMaxAmount('');
  };

  const togglePref = (id: string) => {
    onSave(preferences.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const deletePref = (id: string) => {
    onSave(preferences.filter(p => p.id !== id));
  };

  const getMethodLabel = (id: string) => {
    const m = methods.find(m => m.id === id);
    if (!m) return 'Unknown';
    return `${PAYMENT_METHOD_CONFIG[m.type].icon} ${m.label}${m.lastFour ? ` •${m.lastFour}` : ''}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="h-5 w-5 text-primary" />
            Payment Rules & Preferences
          </CardTitle>
          <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1">
            <Plus className="h-4 w-4" /> Add Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {preferences.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No payment rules yet. Create rules like "Use PayPal for subscriptions under $50" or "Crypto for freelance payments".
          </p>
        )}
        {preferences.map(pref => (
          <div key={pref.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{pref.name}</span>
                <Badge variant={pref.isActive ? 'default' : 'outline'} className="text-xs">
                  {pref.isActive ? 'Active' : 'Paused'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{pref.description}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{getMethodLabel(pref.primaryMethodId)}</span>
                {pref.fallbackMethodId && (
                  <>
                    <ArrowRightLeft className="h-3 w-3" />
                    <span>{getMethodLabel(pref.fallbackMethodId)}</span>
                  </>
                )}
                {pref.maxAmount && <span>• Max {pref.currency} {pref.maxAmount.toLocaleString()}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={pref.isActive} onCheckedChange={() => togglePref(pref.id)} />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deletePref(pref.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Payment Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rule Name</Label>
              <Input placeholder="e.g., Subscriptions" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Input placeholder="e.g., Use for monthly subscriptions" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div>
              <Label>Primary Payment Method</Label>
              <Select value={primaryId} onValueChange={setPrimaryId}>
                <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                <SelectContent>
                  {activeMethods.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {PAYMENT_METHOD_CONFIG[m.type].icon} {m.label}{m.lastFour ? ` •${m.lastFour}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fallback Method (optional)</Label>
              <Select value={fallbackId} onValueChange={setFallbackId}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  {activeMethods.filter(m => m.id !== primaryId).map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {PAYMENT_METHOD_CONFIG[m.type].icon} {m.label}{m.lastFour ? ` •${m.lastFour}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Max Amount (optional)</Label>
                <Input type="number" placeholder="500" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAdd} disabled={!name || !primaryId} className="w-full">
              Create Rule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
