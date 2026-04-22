import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface PackageRow {
  id: string; name: string; slug: string; category: string; status: string;
  cpm_usd: number | null; estimated_universe_size: number | null; recency_days: number;
}
interface PartnerRow {
  id: string; partner_name: string; tier: string; status: string; contact_email: string;
}

const AdminData: React.FC = () => {
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — B2B Data · SuperNomad';
    (async () => {
      const [pkgRes, partnerRes] = await Promise.all([
        supabase.from('data_packages').select('id,name,slug,category,status,cpm_usd,estimated_universe_size,recency_days').limit(50),
        supabase.from('api_partners').select('id,partner_name,tier,status,contact_email').limit(50),
      ]);
      setPackages((pkgRes.data as any) ?? demoPackages);
      setPartners((partnerRes.data as any) ?? demoPartners);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>;
  }

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold">B2B Data Catalog</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">
          Packages built for IAB taxonomy, k-anonymity ≥ 25, consent-gated delivery.
        </p>
      </header>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        <h2 className="text-lg font-semibold mb-3">Data Packages ({packages.length})</h2>
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Universe</TableHead>
              <TableHead className="text-right">CPM (USD)</TableHead>
              <TableHead className="text-right">Recency</TableHead>
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
                  <Badge className={p.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{(p.estimated_universe_size ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right text-[hsl(var(--gold))]">${(p.cpm_usd ?? 0).toFixed(2)}</TableCell>
                <TableCell className="text-right text-xs">{p.recency_days}d</TableCell>
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
              <TableHead>Contact</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((p) => (
              <TableRow key={p.id} className="border-[hsl(43_96%_56%/0.1)]">
                <TableCell className="font-medium">{p.partner_name}</TableCell>
                <TableCell className="text-xs text-[hsl(30_12%_75%)]">{p.contact_email}</TableCell>
                <TableCell><Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]">{p.tier}</Badge></TableCell>
                <TableCell>
                  <Badge className={p.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}>
                    {p.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const demoPackages: PackageRow[] = [
  { id: '1', name: 'Nomad Travel Intent', slug: 'nomad-travel-intent', category: 'travel', status: 'active', cpm_usd: 12.5, estimated_universe_size: 184000, recency_days: 30 },
  { id: '2', name: 'High-Net-Worth Mobility', slug: 'hnw-mobility', category: 'finance', status: 'active', cpm_usd: 35.0, estimated_universe_size: 28400, recency_days: 14 },
  { id: '3', name: 'Tax Residency Signals', slug: 'tax-residency-signals', category: 'compliance', status: 'draft', cpm_usd: 22.0, estimated_universe_size: 96200, recency_days: 7 },
];

const demoPartners: PartnerRow[] = [
  { id: '1', partner_name: 'Skyscanner Insights', tier: 'enterprise', status: 'active', contact_email: 'data@skyscanner.example' },
  { id: '2', partner_name: 'Visa Travel Risk Lab', tier: 'pro', status: 'active', contact_email: 'risk@visa.example' },
];

export default AdminData;
