import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Loader2, Receipt, ScanLine, Globe2, ShieldCheck, AlertTriangle,
  TrendingUp, Search, FileText, ExternalLink,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface KPIs {
  totalExpenses: number;
  totalAmount: number;
  business: number;
  personal: number;
  vatReclaimable: number;
  ocrLast24h: number;
  termsAccepted: number;
  countries: number;
}

interface Row {
  id: string;
  expense_date: string;
  category: string;
  amount: number;
  currency: string;
  vendor: string | null;
  source: string;
  is_business: boolean;
  vat_amount: number;
  vat_reclaimable: boolean;
  status: string;
  vendor_country_code: string | null;
}

interface OCRRun {
  id: string;
  function_name: string;
  model: string;
  latency_ms: number;
  input_tokens: number;
  output_tokens: number;
  cache_hit: boolean;
  error: string | null;
  created_at: string;
}

interface AuditEntry {
  id: string;
  action: string;
  expense_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface PerDiemSourceCount { source: string; n: number; }

const fmtUsd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

const Stat: React.FC<{
  icon: React.ReactNode; label: string; value: string | number; sub?: string; tone?: 'gold' | 'emerald' | 'sky' | 'amber';
}> = ({ icon, label, value, sub, tone = 'gold' }) => {
  const toneCls: Record<string, string> = {
    gold: 'text-[hsl(var(--gold))] bg-[hsl(43_96%_56%/0.12)] border-[hsl(43_96%_56%/0.25)]',
    emerald: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
    sky: 'text-sky-300 bg-sky-500/10 border-sky-500/25',
    amber: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
  };
  return (
    <Card className={`p-4 border bg-[hsl(220_22%_7%)] ${toneCls[tone]}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
        {icon}{label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-[hsl(30_12%_95%)]">{value}</div>
      {sub && <div className="mt-1 text-xs text-[hsl(30_12%_65%)]">{sub}</div>}
    </Card>
  );
};

const SOURCE_BADGE: Record<string, string> = {
  manual: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  ocr: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
  wallet: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  agentic_payment: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  email: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  bank_feed: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  import: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

const AdminExpenses: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [ocr, setOcr] = useState<OCRRun[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [sources, setSources] = useState<PerDiemSourceCount[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    document.title = 'Back Office — Tax & Expense · SuperNomad';
    (async () => {
      try {
        const [
          { data: rowsData },
          { data: ocrData },
          { data: auditData },
          { data: pdData },
          { count: termsCount },
        ] = await Promise.all([
          supabase
            .from('expenses')
            .select('id,expense_date,category,amount,currency,vendor,source,is_business,vat_amount,vat_reclaimable,status,vendor_country_code')
            .order('expense_date', { ascending: false })
            .limit(200) as any,
          supabase
            .from('ai_usage_logs')
            .select('id,function_name,model,latency_ms,input_tokens,output_tokens,cache_hit,error,created_at')
            .eq('function_name', 'receipt-ocr')
            .order('created_at', { ascending: false })
            .limit(50) as any,
          supabase
            .from('expense_audit_log')
            .select('id,action,expense_id,metadata,created_at')
            .order('created_at', { ascending: false })
            .limit(40) as any,
          supabase
            .from('per_diem_rates' as any)
            .select('source')
            .limit(2000) as any,
          supabase
            .from('expense_terms_acceptance' as any)
            .select('*', { count: 'exact', head: true }) as any,
        ]);

        const list = (rowsData ?? []) as Row[];
        const since24h = Date.now() - 24 * 60 * 60 * 1000;
        const ocrLast24h = (ocrData ?? []).filter((r: OCRRun) => new Date(r.created_at).getTime() > since24h).length;

        const totalAmount = list.reduce((s, r) => s + Number(r.amount || 0), 0);
        const business = list.filter(r => r.is_business).reduce((s, r) => s + Number(r.amount || 0), 0);
        const personal = totalAmount - business;
        const vatReclaimable = list.filter(r => r.vat_reclaimable).reduce((s, r) => s + Number(r.vat_amount || 0), 0);
        const countries = new Set(list.map(r => r.vendor_country_code).filter(Boolean)).size;

        setKpis({
          totalExpenses: list.length,
          totalAmount,
          business,
          personal,
          vatReclaimable,
          ocrLast24h,
          termsAccepted: termsCount ?? 0,
          countries,
        });
        setRows(list);
        setOcr((ocrData ?? []) as OCRRun[]);
        setAudit((auditData ?? []) as AuditEntry[]);

        // Source distribution for per-diem reference data
        const counts = new Map<string, number>();
        for (const r of (pdData ?? []) as { source: string }[]) {
          counts.set(r.source, (counts.get(r.source) ?? 0) + 1);
        }
        setSources(
          Array.from(counts.entries())
            .map(([source, n]) => ({ source, n }))
            .sort((a, b) => b.n - a.n),
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const ql = q.toLowerCase();
    return rows.filter(r =>
      `${r.vendor ?? ''} ${r.category} ${r.source} ${r.status} ${r.vendor_country_code ?? ''}`.toLowerCase().includes(ql),
    );
  }, [rows, q]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--gold))]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[hsl(30_12%_95%)] flex items-center gap-2">
            <Receipt className="h-6 w-6 text-[hsl(var(--gold))]" />
            Tax &amp; Expense — Operations
          </h1>
          <p className="text-sm text-[hsl(30_12%_65%)] mt-1">
            Live KPIs for receipts, OCR, VAT reclaim eligibility and global compliance reference data.
          </p>
        </div>
        <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
          <ShieldCheck className="h-3 w-3 mr-1.5" /> Audit-trail ON
        </Badge>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={<Receipt className="h-3.5 w-3.5" />} label="Expenses logged" value={fmt(kpis?.totalExpenses ?? 0)} sub={`${kpis?.countries ?? 0} countries`} />
        <Stat icon={<TrendingUp className="h-3.5 w-3.5" />} label="Total spend" value={fmtUsd(kpis?.totalAmount ?? 0)} sub={`${fmtUsd(kpis?.business ?? 0)} business`} tone="emerald" />
        <Stat icon={<ScanLine className="h-3.5 w-3.5" />} label="OCR runs / 24h" value={fmt(kpis?.ocrLast24h ?? 0)} sub={`${ocr.length} total · ${ocr.filter(o => o.error).length} errors`} tone="sky" />
        <Stat icon={<ShieldCheck className="h-3.5 w-3.5" />} label="VAT reclaimable" value={fmtUsd(kpis?.vatReclaimable ?? 0)} sub={`${kpis?.termsAccepted ?? 0} ToS accepted`} tone="amber" />
      </div>

      {/* Compliance sources */}
      <Card className="p-4 bg-[hsl(220_22%_7%)] border-[hsl(43_96%_56%/0.15)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-medium text-[hsl(30_12%_85%)]">
            <Globe2 className="h-4 w-4 text-[hsl(var(--gold))]" />
            Government reference data — per-diem source distribution
          </div>
          <Badge variant="outline" className="text-xs border-[hsl(43_96%_56%/0.3)] text-[hsl(var(--gold))]">
            Auto-refreshed
          </Badge>
        </div>
        {sources.length === 0 ? (
          <p className="text-xs text-[hsl(30_12%_60%)]">No reference rates loaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sources.slice(0, 8).map(s => (
              <div key={s.source} className="px-3 py-2 rounded-md bg-[hsl(220_22%_10%)] border border-[hsl(43_96%_56%/0.12)] flex items-center justify-between">
                <span className="text-xs text-[hsl(30_12%_75%)] truncate">{s.source}</span>
                <span className="text-sm font-semibold text-[hsl(var(--gold))]">{s.n}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Live expenses table */}
      <Card className="p-4 bg-[hsl(220_22%_7%)] border-[hsl(43_96%_56%/0.15)]">
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <h2 className="text-sm font-medium text-[hsl(30_12%_85%)] flex items-center gap-2">
            <FileText className="h-4 w-4" /> Latest expense entries
          </h2>
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2 top-2.5 text-[hsl(30_12%_55%)]" />
            <Input
              placeholder="Search vendor, category, status…"
              className="pl-7 h-8 w-64 bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.2)] text-sm"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Vendor</TableHead>
                <TableHead className="text-xs">Cat.</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">VAT</TableHead>
                <TableHead className="text-xs">Source</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-xs text-[hsl(30_12%_60%)]">No expenses logged yet.</TableCell></TableRow>
              ) : filtered.slice(0, 50).map(r => (
                <TableRow key={r.id} className="border-[hsl(43_96%_56%/0.1)] hover:bg-[hsl(220_22%_10%)]">
                  <TableCell className="text-xs text-[hsl(30_12%_75%)]">{r.expense_date}</TableCell>
                  <TableCell className="text-xs">{r.vendor || '—'}</TableCell>
                  <TableCell className="text-xs"><Badge variant="outline" className="text-[10px] border-[hsl(43_96%_56%/0.2)] text-[hsl(30_12%_75%)]">{r.category}</Badge></TableCell>
                  <TableCell className="text-xs font-medium text-[hsl(30_12%_90%)]">{r.currency} {Number(r.amount).toFixed(2)}</TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_70%)]">
                    {Number(r.vat_amount || 0) > 0 ? `${Number(r.vat_amount).toFixed(2)}${r.vat_reclaimable ? ' ✓' : ''}` : '—'}
                  </TableCell>
                  <TableCell><Badge className={`text-[10px] ${SOURCE_BADGE[r.source] ?? SOURCE_BADGE.manual}`}>{r.source}</Badge></TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_75%)]">{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* OCR + Audit grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 bg-[hsl(220_22%_7%)] border-[hsl(43_96%_56%/0.15)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-[hsl(30_12%_85%)] flex items-center gap-2">
              <ScanLine className="h-4 w-4 text-fuchsia-300" /> Recent OCR runs
            </h2>
            <Badge variant="outline" className="text-[10px] border-fuchsia-500/30 text-fuchsia-300">Gemini 3 vision</Badge>
          </div>
          {ocr.length === 0 ? (
            <p className="text-xs text-[hsl(30_12%_60%)]">No OCR runs yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {ocr.slice(0, 30).map(o => (
                <div key={o.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-[hsl(220_22%_10%)] text-xs">
                  <span className="text-[hsl(30_12%_70%)] truncate">{new Date(o.created_at).toLocaleString()}</span>
                  <span className="text-[hsl(30_12%_85%)]">{o.model}</span>
                  <span className="text-[hsl(30_12%_70%)]">{o.latency_ms}ms</span>
                  {o.error
                    ? <Badge className="text-[10px] bg-red-500/15 text-red-300 border-red-500/30"><AlertTriangle className="h-2.5 w-2.5 mr-1" />error</Badge>
                    : <Badge className="text-[10px] bg-emerald-500/15 text-emerald-300 border-emerald-500/30">ok</Badge>}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4 bg-[hsl(220_22%_7%)] border-[hsl(43_96%_56%/0.15)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-[hsl(30_12%_85%)] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" /> Compliance audit trail
            </h2>
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-300">Immutable</Badge>
          </div>
          {audit.length === 0 ? (
            <p className="text-xs text-[hsl(30_12%_60%)]">No audit events yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {audit.map(a => (
                <div key={a.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-[hsl(220_22%_10%)] text-xs">
                  <span className="text-[hsl(30_12%_70%)] truncate">{new Date(a.created_at).toLocaleString()}</span>
                  <Badge variant="outline" className="text-[10px] border-[hsl(43_96%_56%/0.25)] text-[hsl(var(--gold))]">{a.action}</Badge>
                  <span className="text-[hsl(30_12%_60%)] truncate font-mono text-[10px]">{a.expense_id?.slice(0, 8) ?? '—'}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <p className="text-[10px] text-[hsl(30_12%_55%)] flex items-center gap-1">
        <ExternalLink className="h-3 w-3" />
        Reference rates are fetched from official government publications (US GSA, UK HMRC, German BMF, French URSSAF, IRS, ATO, CRA, etc.).
        SuperNomad provides software & data only — not tax advice.
      </p>
    </div>
  );
};

export default AdminExpenses;
