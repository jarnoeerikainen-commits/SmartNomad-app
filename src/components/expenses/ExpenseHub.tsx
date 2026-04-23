import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, Plus, Download, RefreshCw, Receipt, AlertTriangle, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  ExpenseHubService,
  type ExpenseRow,
  type ExpenseCategory,
  type PerDiemRate,
  type VatRule,
  TERMS_TEXT,
} from '@/services/ExpenseHubService';

const CATEGORIES: ExpenseCategory[] = [
  'flight','hotel','meal','transport','mileage','daily_allowance',
  'fuel','parking','tolls','phone','internet','supplies','entertainment',
  'conference','training','gift','other',
];

export const ExpenseHub: React.FC = () => {
  const [tab, setTab] = useState('expenses');
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [stats, setStats] = useState<{ total: number; business: number; personal: number; reclaimableVAT: number; count: number } | null>(null);
  const [perDiem, setPerDiem] = useState<PerDiemRate[]>([]);
  const [vatRules, setVatRules] = useState<VatRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Partial<ExpenseRow> | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [list, agg, pd, vr, accepted] = await Promise.all([
        ExpenseHubService.listExpenses({ limit: 200 }),
        ExpenseHubService.getStats(),
        ExpenseHubService.listPerDiem(),
        ExpenseHubService.listVatRules(),
        ExpenseHubService.hasAcceptedTerms(),
      ]);
      setExpenses(list);
      setStats(agg);
      setPerDiem(pd);
      setVatRules(vr);
      setTermsAccepted(accepted);
      if (!accepted) setShowTerms(true);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const onAcceptTerms = async () => {
    await ExpenseHubService.acceptTerms();
    setTermsAccepted(true);
    setShowTerms(false);
    toast.success('Terms accepted. You can now use the Expense Hub.');
  };

  const onScanReceipt = async (file: File) => {
    if (!termsAccepted) { setShowTerms(true); return; }
    setScanning(true);
    try {
      const { extracted, confidence, receiptId } = await ExpenseHubService.uploadReceiptAndOCR(file);
      const e = extracted as Record<string, unknown>;
      setEditing({
        receipt_id: receiptId,
        expense_date: (e.expense_date as string) ?? new Date().toISOString().slice(0, 10),
        amount: Number(e.amount ?? 0),
        currency: (e.currency as string) ?? 'USD',
        category: ((e.category as ExpenseCategory) ?? 'other'),
        description: (e.description as string) ?? '',
        vendor: (e.vendor as string) ?? null,
        vendor_country_code: (e.vendor_country_code as string) ?? null,
        vat_amount: Number(e.vat_amount ?? 0),
        vat_rate: e.vat_rate ? Number(e.vat_rate) : null,
        supplier_vat_id: (e.supplier_vat_id as string) ?? null,
        payment_method: (e.payment_method as string) ?? null,
        is_business: true,
        business_percentage: 100,
        source: 'ocr',
      });
      setShowAdd(true);
      toast.success(`Receipt scanned (confidence ${(confidence * 100).toFixed(0)}%)`);
    } catch (e) {
      console.error(e);
      toast.error('Receipt scan failed');
    } finally {
      setScanning(false);
    }
  };

  const onSave = async () => {
    if (!editing) return;
    try {
      // auto-apply VAT reclaim rule
      let vatReclaimPct = 0;
      let vatReclaimable = false;
      if (editing.vendor_country_code && editing.category) {
        const rule = await ExpenseHubService.getVatRule(editing.vendor_country_code, editing.category);
        if (rule) {
          vatReclaimPct = Number(rule.reclaim_pct);
          vatReclaimable = vatReclaimPct > 0 && (editing.is_business ?? true);
        }
      }
      await ExpenseHubService.createExpense({
        amount: Number(editing.amount ?? 0),
        currency: editing.currency ?? 'USD',
        expense_date: editing.expense_date ?? new Date().toISOString().slice(0, 10),
        category: (editing.category ?? 'other') as ExpenseCategory,
        description: editing.description ?? '',
        vendor: editing.vendor ?? null,
        vendor_country_code: editing.vendor_country_code ?? null,
        vat_amount: editing.vat_amount ?? 0,
        vat_rate: editing.vat_rate ?? null,
        supplier_vat_id: editing.supplier_vat_id ?? null,
        vat_reclaimable: vatReclaimable,
        vat_reclaim_pct: vatReclaimPct,
        is_business: editing.is_business ?? true,
        business_percentage: editing.business_percentage ?? 100,
        payment_method: editing.payment_method ?? null,
        receipt_id: editing.receipt_id ?? null,
        source: editing.source ?? 'manual',
        status: 'confirmed',
      });
      toast.success('Expense saved');
      setShowAdd(false);
      setEditing(null);
      refresh();
    } catch (e) {
      console.error(e);
      toast.error('Failed to save');
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await ExpenseHubService.deleteExpense(id);
    refresh();
  };

  const onSyncWallet = async () => {
    const r = await ExpenseHubService.syncFromWallet();
    toast.success(`Wallet sync: ${r.created} new, ${r.skipped} skipped`);
    refresh();
  };

  const onExport = () => {
    if (!expenses.length) { toast.error('No expenses to export'); return; }
    ExpenseHubService.downloadCSV(expenses, `expenses-${new Date().toISOString().slice(0,10)}.csv`);
  };

  return (
    <div className="space-y-4">
      {/* Compliance banner */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <strong>Not tax advice.</strong> Per-diem, mileage & VAT rates shown are sourced from official government publications (IRS, GSA, HMRC, BMF, URSSAF, Vero, etc.) — verify against the source URL before filing. SuperNomad is not liable for filing decisions.
          {' '}
          <button className="underline" onClick={() => setShowTerms(true)}>View full terms</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total" value={`$${stats?.total.toFixed(2) ?? '0.00'}`} sub={`${stats?.count ?? 0} entries`} />
        <StatCard label="Business" value={`$${stats?.business.toFixed(2) ?? '0.00'}`} variant="success" />
        <StatCard label="Personal" value={`$${stats?.personal.toFixed(2) ?? '0.00'}`} variant="muted" />
        <StatCard label="Reclaimable VAT" value={`$${stats?.reclaimableVAT.toFixed(2) ?? '0.00'}`} variant="primary" />
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="default" disabled={scanning}>
          <label className="cursor-pointer">
            {scanning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />}
            Scan receipt
            <input type="file" accept="image/*" capture="environment" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onScanReceipt(f); e.currentTarget.value=''; }} />
          </label>
        </Button>
        <Button asChild variant="outline" disabled={scanning}>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" /> Upload
            <input type="file" accept="image/*,application/pdf" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onScanReceipt(f); e.currentTarget.value=''; }} />
          </label>
        </Button>
        <Button variant="outline" onClick={() => { setEditing({ amount: 0, currency: 'USD', category: 'other', expense_date: new Date().toISOString().slice(0,10), is_business: true, business_percentage: 100 }); setShowAdd(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add manual
        </Button>
        <Button variant="outline" onClick={onSyncWallet}>
          <RefreshCw className="h-4 w-4 mr-2" /> Sync wallet
        </Button>
        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="per_diem">Per Diem</TabsTrigger>
          <TabsTrigger value="vat">VAT Reclaim</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-2">
          {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
          {!loading && expenses.length === 0 && (
            <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">
              <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No expenses yet. Scan a receipt to get started.
            </CardContent></Card>
          )}
          {expenses.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{e.vendor || e.description || 'Expense'}</span>
                    <Badge variant="outline" className="text-[10px]">{e.category}</Badge>
                    {e.source !== 'manual' && <Badge variant="secondary" className="text-[10px]">{e.source}</Badge>}
                    {!e.is_business && <Badge variant="outline" className="text-[10px]">personal</Badge>}
                    {e.vat_reclaim_pct > 0 && <Badge className="text-[10px] bg-primary/20 text-primary">VAT {e.vat_reclaim_pct}%</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {e.expense_date} · {e.vendor_country_code ?? '—'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold tabular-nums">{e.currency} {Number(e.amount).toFixed(2)}</div>
                  {e.vat_amount > 0 && <div className="text-xs text-muted-foreground">VAT {Number(e.vat_amount).toFixed(2)}</div>}
                </div>
                <Button size="sm" variant="ghost" onClick={() => onDelete(e.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="per_diem" className="space-y-2">
          <p className="text-xs text-muted-foreground">Government-published daily allowance rates. Click source to verify.</p>
          {perDiem.map((r) => (
            <Card key={r.id}><CardContent className="p-3 text-sm flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{r.country_name}{r.city ? ` · ${r.city}` : ''} <span className="text-xs text-muted-foreground">({r.year})</span></div>
                <div className="text-xs text-muted-foreground">Lodging {r.lodging_rate} · Meals {r.meals_rate} · Incidentals {r.incidentals_rate} {r.currency}</div>
                <a href={r.source_url} target="_blank" rel="noreferrer" className="text-[11px] text-primary inline-flex items-center gap-1 mt-1">
                  {r.source} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{r.daily_total}</div>
                <div className="text-[10px] text-muted-foreground">{r.currency}/day</div>
              </div>
            </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="vat" className="space-y-2">
          <p className="text-xs text-muted-foreground">VAT reclaim eligibility per country & category. Sourced from each country's tax authority.</p>
          {vatRules.map((v) => (
            <Card key={v.id}><CardContent className="p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{v.country_name} · <span className="capitalize">{v.category}</span></div>
                  <div className="text-xs text-muted-foreground">{v.conditions}</div>
                  <a href={v.source_url} target="_blank" rel="noreferrer" className="text-[11px] text-primary inline-flex items-center gap-1 mt-1">
                    {v.source} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Rate {v.standard_vat_rate}%</div>
                  <Badge variant={v.reclaim_pct > 0 ? 'default' : 'secondary'}>Reclaim {v.reclaim_pct}%</Badge>
                </div>
              </div>
            </CardContent></Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Add / edit dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.source === 'ocr' ? 'Confirm scanned receipt' : 'Add expense'}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" value={editing.expense_date as string} onChange={(e) => setEditing({ ...editing, expense_date: e.target.value })} /></div>
                <div><Label>Amount</Label><Input type="number" step="0.01" value={editing.amount ?? ''} onChange={(e) => setEditing({ ...editing, amount: parseFloat(e.target.value) || 0 })} /></div>
                <div><Label>Currency</Label><Input value={editing.currency ?? ''} onChange={(e) => setEditing({ ...editing, currency: e.target.value.toUpperCase() })} /></div>
                <div><Label>Country (ISO 2)</Label><Input value={editing.vendor_country_code ?? ''} placeholder="GB, DE, FI…" onChange={(e) => setEditing({ ...editing, vendor_country_code: e.target.value.toUpperCase() })} /></div>
              </div>
              <div><Label>Vendor</Label><Input value={editing.vendor ?? ''} onChange={(e) => setEditing({ ...editing, vendor: e.target.value })} /></div>
              <div><Label>Category</Label>
                <Select value={editing.category as string} onValueChange={(v) => setEditing({ ...editing, category: v as ExpenseCategory })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Description</Label><Textarea rows={2} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>VAT amount</Label><Input type="number" step="0.01" value={editing.vat_amount ?? 0} onChange={(e) => setEditing({ ...editing, vat_amount: parseFloat(e.target.value) || 0 })} /></div>
                <div><Label>VAT rate %</Label><Input type="number" step="0.1" value={editing.vat_rate ?? ''} onChange={(e) => setEditing({ ...editing, vat_rate: parseFloat(e.target.value) || null })} /></div>
              </div>
              <div className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <div className="text-sm font-medium">Business expense</div>
                  <div className="text-xs text-muted-foreground">Deductible / reclaimable</div>
                </div>
                <Switch checked={editing.is_business ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_business: v, business_percentage: v ? 100 : 0 })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={onSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terms dialog */}
      <Dialog open={showTerms} onOpenChange={(v) => { if (termsAccepted) setShowTerms(v); }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Terms of Use</DialogTitle></DialogHeader>
          <div className="text-sm whitespace-pre-line">{TERMS_TEXT}</div>
          <DialogFooter>
            {!termsAccepted && <Button onClick={onAcceptTerms}>I agree</Button>}
            {termsAccepted && <Button variant="outline" onClick={() => setShowTerms(false)}>Close</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; sub?: string; variant?: 'default'|'primary'|'success'|'muted' }> = ({ label, value, sub, variant='default' }) => {
  const cls = {
    default: 'bg-card border',
    primary: 'bg-primary/10 border-primary/30',
    success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
    muted: 'bg-muted border',
  }[variant];
  return (
    <div className={`rounded-xl p-3 ${cls}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-bold tabular-nums mt-1">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
};

export default ExpenseHub;
