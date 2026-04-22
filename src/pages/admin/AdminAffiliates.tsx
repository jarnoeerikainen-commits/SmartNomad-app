import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface AffRow {
  id: string; referral_code: string; status: string; tier: string;
  total_clicks: number; total_signups: number; total_paying_referrals: number;
  pending_balance: number; cleared_balance: number; paid_lifetime: number;
}

const fmt$ = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const AdminAffiliates: React.FC = () => {
  const [rows, setRows] = useState<AffRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — Affiliates · SuperNomad';
    (async () => {
      const { data } = await supabase
        .from('affiliate_accounts')
        .select('id,referral_code,status,tier,total_clicks,total_signups,total_paying_referrals,pending_balance,cleared_balance,paid_lifetime')
        .order('paid_lifetime', { ascending: false })
        .limit(100);
      setRows((data as any) ?? demoAffs);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold">Affiliate Console</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">Top earning affiliates and current pending balances.</p>
      </header>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
                <TableHead>Referral Code</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Signups</TableHead>
                <TableHead className="text-right">Paying</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead className="text-right">Cleared</TableHead>
                <TableHead className="text-right">Lifetime Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id} className="border-[hsl(43_96%_56%/0.1)]">
                  <TableCell className="font-mono text-xs text-[hsl(var(--gold))]">{a.referral_code}</TableCell>
                  <TableCell><Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]">{a.tier}</Badge></TableCell>
                  <TableCell>
                    <Badge className={a.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}>
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{a.total_clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{a.total_signups.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{a.total_paying_referrals.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-amber-400">{fmt$(a.pending_balance)}</TableCell>
                  <TableCell className="text-right text-emerald-400">{fmt$(a.cleared_balance)}</TableCell>
                  <TableCell className="text-right text-[hsl(var(--gold))]">{fmt$(a.paid_lifetime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

const demoAffs: AffRow[] = [
  { id: '1', referral_code: 'SN-A1B2-C3D4-E5F6', status: 'active', tier: 'gold', total_clicks: 4820, total_signups: 312, total_paying_referrals: 84, pending_balance: 1240, cleared_balance: 980, paid_lifetime: 6420 },
  { id: '2', referral_code: 'SN-9X8Y-7Z6W-5V4U', status: 'active', tier: 'standard', total_clicks: 2140, total_signups: 162, total_paying_referrals: 41, pending_balance: 612, cleared_balance: 320, paid_lifetime: 2240 },
];

export default AdminAffiliates;
