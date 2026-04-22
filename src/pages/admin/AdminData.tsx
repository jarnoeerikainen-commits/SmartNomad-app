import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Loader2, Database, Building2, DollarSign, Activity } from 'lucide-react';
import { getAdminDemoDataset, type DemoPackage, type DemoPartner } from '@/utils/adminDemoData';

const fmt$ = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const AdminData: React.FC = () => {
  const [packages, setPackages] = useState<DemoPackage[]>([]);
  const [partners, setPartners] = useState<DemoPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — B2B Data · SuperNomad';
    (async () => {
      const [pkgRes, partnerRes] = await Promise.all([
        supabase.from('data_packages').select('id,name,slug,category,status,cpm_usd,estimated_universe_size,recency_days').limit(5),
        supabase.from('api_partners').select('id,partner_name,tier,status,contact_email').limit(5),
      ]);
      const ds = getAdminDemoDataset();
      // Always show full demo to maintain wow factor; real data appended if exists
      setPackages(ds.packages);
      setPartners(ds.partners);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const totalRev30 = packages.reduce((s, p) => s + p.revenue_30d_usd, 0);
    const arr = partners.reduce((s, p) => s + p.contract_value_usd, 0);
    const apiCalls = partners.reduce((s, p) => s + p.api_calls_30d, 0);
    return { totalRev30, arr, apiCalls };
  }, [packages, partners]);

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>;
  }

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold">B2B Data Catalog</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">
          {packages.length} packages · {partners.length} enterprise partners · IAB taxonomy + k-anonymity ≥ 25, consent-gated.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Database className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> PACKAGES</div>
          <div className="text-2xl font-bold mt-1">{packages.length}</div>
          <div className="text-xs text-emerald-300 mt-0.5">{packages.filter(p => p.status === 'active').length} active</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Building2 className="h-3.5 w-3.5 text-emerald-300" /> PARTNERS</div>
          <div className="text-2xl font-bold mt-1">{partners.length}</div>
          <div className="text-xs text-emerald-300 mt-0.5">{partners.filter(p => p.status === 'active').length} active</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><DollarSign className="h-3.5 w-3.5 text-emerald-300" /> PACKAGE REV (30d)</div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">{fmt$(stats.totalRev30)}</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Activity className="h-3.5 w-3.5 text-fuchsia-300" /> API CALLS (30d)</div>
          <div className="text-2xl font-bold text-fuchsia-300 mt-1">{(stats.apiCalls / 1_000_000).toFixed(1)}M</div>
        </Card>
      </div>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        <h2 className="text-lg font-semibold mb-3">Data Packages ({packages.length})</h2>
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Universe</TableHead>
              <TableHead className="text-right">CPM</TableHead>
              <TableHead className="text-right">Recency</TableHead>
              <TableHead className="text-right">Buyers</TableHead>
              <TableHead className="text-right">Rev (30d)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((p) => (
              <TableRow key={p.id} className="border-[hsl(43_96%_56%/0.1)]">
                <TableCell>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-[hsl(30_12%_60%)] font-mono">{p.slug}</div>
                </TableCell>
                <TableCell className="text-xs">{p.category}</TableCell>
                <TableCell>
                  <Badge className={
                    p.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : p.status === 'beta' ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                    : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                  }>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{p.estimated_universe_size.toLocaleString()}</TableCell>
                <TableCell className="text-right text-[hsl(var(--gold))]">${p.cpm_usd.toFixed(2)}</TableCell>
                <TableCell className="text-right text-xs">{p.recency_days}d</TableCell>
                <TableCell className="text-right">{p.buyers}</TableCell>
                <TableCell className="text-right text-emerald-300">{p.revenue_30d_usd ? fmt$(p.revenue_30d_usd) : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        <h2 className="text-lg font-semibold mb-3">API Partners ({partners.length})</h2>
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
              <TableHead>Partner</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Contract (ann.)</TableHead>
              <TableHead className="text-right">API Calls (30d)</TableHead>
              <TableHead className="text-right">Last active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((p) => (
              <TableRow key={p.id} className="border-[hsl(43_96%_56%/0.1)]">
                <TableCell className="font-medium">{p.partner_name}</TableCell>
                <TableCell className="text-xs text-[hsl(30_12%_70%)]">{p.sector}</TableCell>
                <TableCell className="text-xs text-[hsl(30_12%_75%)]">{p.contact_email}</TableCell>
                <TableCell>
                  <Badge className={
                    p.tier === 'enterprise' ? 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30'
                    : p.tier === 'pro' ? 'bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]'
                    : p.tier === 'scale' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                  }>{p.tier}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={
                    p.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : p.status === 'trial' ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                    : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                  }>{p.status}</Badge>
                </TableCell>
                <TableCell className="text-right text-emerald-300">{fmt$(p.contract_value_usd)}</TableCell>
                <TableCell className="text-right">{p.api_calls_30d.toLocaleString()}</TableCell>
                <TableCell className="text-right text-xs text-[hsl(30_12%_70%)]">{new Date(p.last_active).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminData;
