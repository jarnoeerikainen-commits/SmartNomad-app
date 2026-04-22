import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Loader2, Trophy, DollarSign, Users, Coins } from 'lucide-react';
import { getAdminDemoDataset, type DemoAffiliate } from '@/utils/adminDemoData';

const fmt$ = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const TIER_BADGE: Record<string, string> = {
  icon: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
  gold: 'bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]',
  silver: 'bg-slate-300/15 text-slate-200 border-slate-300/30',
  standard: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  starter: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
};

const CHANNEL_LABEL: Record<string, string> = {
  creator: '🎬 Creator',
  agency: '🏢 Agency',
  community: '🌐 Community',
  'partner-app': '🔌 Partner App',
  'b2b-rep': '💼 B2B Rep',
};

const AdminAffiliates: React.FC = () => {
  const [rows, setRows] = useState<DemoAffiliate[]>([]);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — Affiliates · SuperNomad';
    (async () => {
      const { data } = await supabase
        .from('affiliate_accounts')
        .select('id,referral_code,status,tier')
        .order('paid_lifetime', { ascending: false })
        .limit(5);

      const demo = getAdminDemoDataset().affiliates;
      if (data && data.length > 0) {
        // overlay first few real codes if any, keep demo metrics
        const merged = demo.map((d, i) => i < data.length ? { ...d, referral_code: data[i].referral_code, status: (data[i].status as any) ?? d.status } : d);
        setRows(merged);
      } else {
        setRows(demo);
      }
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const active = rows.filter(a => a.status === 'active').length;
    const lifetime = rows.reduce((s, a) => s + a.paid_lifetime, 0);
    const pending = rows.reduce((s, a) => s + a.pending_balance, 0);
    return { total, active, lifetime, pending };
  }, [rows]);

  const channelGroups = useMemo(() => {
    const map = new Map<string, { channel: string; count: number; revenue: number }>();
    for (const a of rows) {
      const m = map.get(a.channel) ?? { channel: a.channel, count: 0, revenue: 0 };
      m.count += 1; m.revenue += a.paid_lifetime;
      map.set(a.channel, m);
    }
    return Array.from(map.values()).sort((x, y) => y.revenue - x.revenue);
  }, [rows]);

  const filtered = useMemo(() => channelFilter === 'all' ? rows : rows.filter(a => a.channel === channelFilter), [rows, channelFilter]);

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold">Affiliate Console</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">
          {rows.length} affiliates across 5 channels · {fmt$(stats.lifetime)} lifetime paid
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Users className="h-3.5 w-3.5" /> AFFILIATES</div>
          <div className="text-2xl font-bold mt-1">{stats.total}</div>
          <div className="text-xs text-emerald-300 mt-0.5">{stats.active} active</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Trophy className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> LIFETIME PAID</div>
          <div className="text-2xl font-bold text-[hsl(var(--gold))] mt-1">{fmt$(stats.lifetime)}</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><DollarSign className="h-3.5 w-3.5 text-amber-300" /> PENDING</div>
          <div className="text-2xl font-bold text-amber-300 mt-1">{fmt$(stats.pending)}</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Coins className="h-3.5 w-3.5 text-fuchsia-300" /> ICONS (TOP TIER)</div>
          <div className="text-2xl font-bold text-fuchsia-300 mt-1">{rows.filter(r => r.tier === 'icon').length}</div>
        </Card>
      </div>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-5">
        <h2 className="text-base font-semibold mb-3">Channels</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <button
            onClick={() => setChannelFilter('all')}
            className={`text-left p-3 rounded-lg border transition ${channelFilter === 'all' ? 'border-[hsl(var(--gold))] bg-[hsl(43_96%_56%/0.08)]' : 'border-[hsl(43_96%_56%/0.1)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
          >
            <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)]">All</div>
            <div className="text-lg font-bold">{rows.length}</div>
            <div className="text-xs text-emerald-300">{fmt$(stats.lifetime)}</div>
          </button>
          {channelGroups.map((c) => (
            <button
              key={c.channel}
              onClick={() => setChannelFilter(c.channel)}
              className={`text-left p-3 rounded-lg border transition ${channelFilter === c.channel ? 'border-[hsl(var(--gold))] bg-[hsl(43_96%_56%/0.08)]' : 'border-[hsl(43_96%_56%/0.1)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
            >
              <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)]">{CHANNEL_LABEL[c.channel] ?? c.channel}</div>
              <div className="text-lg font-bold">{c.count}</div>
              <div className="text-xs text-emerald-300">{fmt$(c.revenue)}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
                <TableHead>Code</TableHead>
                <TableHead>Affiliate</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Signups</TableHead>
                <TableHead className="text-right">CVR%</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead className="text-right">Cleared</TableHead>
                <TableHead className="text-right">Lifetime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 150).map((a) => (
                <TableRow key={a.id} className="border-[hsl(43_96%_56%/0.1)]">
                  <TableCell className="font-mono text-xs text-[hsl(var(--gold))]">{a.referral_code}</TableCell>
                  <TableCell className="text-xs">{a.user_name}</TableCell>
                  <TableCell><Badge className={TIER_BADGE[a.tier]}>{a.tier}</Badge></TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_75%)]">{CHANNEL_LABEL[a.channel] ?? a.channel}</TableCell>
                  <TableCell>
                    <Badge className={a.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : a.status === 'paused' ? 'bg-slate-500/15 text-slate-400 border-slate-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}>
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{a.total_clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{a.total_signups.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-xs">{a.conversion_rate.toFixed(2)}%</TableCell>
                  <TableCell className="text-right text-amber-300">{fmt$(a.pending_balance)}</TableCell>
                  <TableCell className="text-right text-emerald-300">{fmt$(a.cleared_balance)}</TableCell>
                  <TableCell className="text-right text-[hsl(var(--gold))] font-semibold">{fmt$(a.paid_lifetime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <p className="text-xs text-[hsl(30_12%_55%)] mt-3">
          Showing {Math.min(150, filtered.length)} of {filtered.length}.
        </p>
      </Card>
    </div>
  );
};

export default AdminAffiliates;
