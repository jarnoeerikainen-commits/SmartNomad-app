import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Search, Loader2, Crown, Sparkles, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { getAdminDemoDataset, tierRollup, type DemoUser } from '@/utils/adminDemoData';

const fmt$ = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const TIER_BADGE: Record<string, string> = {
  whale: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
  platinum: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  gold: 'bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]',
  core: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  lite: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  free: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
};

const STATUS_BADGE: Record<string, string> = {
  'active': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'idle': 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  'churn-risk': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  'vip-watch': 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
};

const AdminUsers: React.FC = () => {
  const [rows, setRows] = useState<DemoUser[]>([]);
  const [q, setQ] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — Users · SuperNomad';
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id,email,first_name,last_name,snomad_id,created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      const demo = getAdminDemoDataset().users;
      // If real profiles exist, prepend them as 'core' tier; otherwise full demo.
      if (data && data.length > 0) {
        const merged: DemoUser[] = [
          ...data.map((p: any, i: number) => ({
            ...demo[i],
            id: p.id,
            email: p.email ?? demo[i].email,
            first_name: p.first_name ?? demo[i].first_name,
            last_name: p.last_name ?? demo[i].last_name,
            snomad_id: p.snomad_id ?? demo[i].snomad_id,
            created_at: p.created_at,
          })),
          ...demo.slice(data.length),
        ];
        setRows(merged);
      } else {
        setRows(demo);
      }
      setLoading(false);
    })();
  }, []);

  const tiers = useMemo(() => tierRollup(rows), [rows]);
  const totalMRR = useMemo(() => rows.reduce((s, u) => s + u.monthly_spend_usd, 0), [rows]);
  const vipCount = useMemo(() => rows.filter(u => u.tier === 'whale' || u.tier === 'platinum').length, [rows]);
  const churnRisk = useMemo(() => rows.filter(u => u.status === 'churn-risk').length, [rows]);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return rows.filter((r) => {
      if (tierFilter !== 'all' && r.tier !== tierFilter) return false;
      if (!q) return true;
      const hay = `${r.email} ${r.first_name} ${r.last_name} ${r.snomad_id} ${r.country_name} ${r.persona}`.toLowerCase();
      return hay.includes(ql);
    });
  }, [rows, q, tierFilter]);

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold">Users</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">
          {rows.length.toLocaleString()} active citizens across {new Set(rows.map(r => r.country_code)).size} countries · MRR {fmt$(totalMRR)}
        </p>
      </header>

      {/* KPI chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Users className="h-3.5 w-3.5" /> TOTAL</div>
          <div className="text-2xl font-bold mt-1">{rows.length.toLocaleString()}</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Crown className="h-3.5 w-3.5 text-fuchsia-300" /> VIP (Whale + Platinum)</div>
          <div className="text-2xl font-bold mt-1 text-fuchsia-300">{vipCount}</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><TrendingUp className="h-3.5 w-3.5 text-emerald-300" /> MRR</div>
          <div className="text-2xl font-bold mt-1 text-emerald-300">{fmt$(totalMRR)}</div>
        </Card>
        <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><AlertTriangle className="h-3.5 w-3.5 text-rose-300" /> CHURN RISK</div>
          <div className="text-2xl font-bold mt-1 text-rose-300">{churnRisk}</div>
        </Card>
      </div>

      {/* Tier breakdown */}
      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-[hsl(var(--gold))]" /> Spend Tiers</h2>
          <div className="text-xs text-[hsl(30_12%_60%)]">click a tier to filter</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <button
            onClick={() => setTierFilter('all')}
            className={`text-left p-3 rounded-lg border transition ${tierFilter === 'all' ? 'border-[hsl(var(--gold))] bg-[hsl(43_96%_56%/0.08)]' : 'border-[hsl(43_96%_56%/0.1)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
          >
            <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)]">All</div>
            <div className="text-lg font-bold">{rows.length}</div>
            <div className="text-xs text-[hsl(30_12%_70%)]">{fmt$(totalMRR)} MRR</div>
          </button>
          {tiers.map((t) => (
            <button
              key={t.tier}
              onClick={() => setTierFilter(t.tier)}
              className={`text-left p-3 rounded-lg border transition ${tierFilter === t.tier ? 'border-[hsl(var(--gold))] bg-[hsl(43_96%_56%/0.08)]' : 'border-[hsl(43_96%_56%/0.1)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
            >
              <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)]">{t.label}</div>
              <div className="text-lg font-bold">{t.count}</div>
              <div className="text-xs text-emerald-300">{fmt$(t.mrr)}</div>
              <div className="text-[10px] text-[hsl(30_12%_60%)]">{t.ai_calls.toLocaleString()} AI calls/30d</div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(30_12%_60%)]" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, Snomad ID, country, persona…"
            className="pl-9 bg-[hsl(220_22%_8%)] border-[hsl(43_96%_56%/0.15)] text-white"
          />
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
                <TableHead>Snomad ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Monthly</TableHead>
                <TableHead className="text-right">YTD</TableHead>
                <TableHead className="text-right">AI calls/30d</TableHead>
                <TableHead className="text-right">CSAT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 200).map((u) => (
                <TableRow key={u.id} className="border-[hsl(43_96%_56%/0.1)]">
                  <TableCell className="font-mono text-xs text-[hsl(var(--gold))]">{u.snomad_id}</TableCell>
                  <TableCell>{u.first_name} {u.last_name}</TableCell>
                  <TableCell className="text-xs"><span className="mr-1">{u.country_flag}</span>{u.country_code}</TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_75%)]">{u.persona}</TableCell>
                  <TableCell><Badge className={TIER_BADGE[u.tier] ?? ''}>{u.tier_label}</Badge></TableCell>
                  <TableCell><Badge className={STATUS_BADGE[u.status]}>{u.status}</Badge></TableCell>
                  <TableCell className="text-right text-emerald-300">{u.monthly_spend_usd ? fmt$(u.monthly_spend_usd) : '—'}</TableCell>
                  <TableCell className="text-right text-[hsl(30_12%_80%)]">{u.ytd_spend_usd ? fmt$(u.ytd_spend_usd) : '—'}</TableCell>
                  <TableCell className="text-right">{u.ai_concierge_calls_30d.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-xs">
                    <span className={u.satisfaction >= 85 ? 'text-emerald-300' : u.satisfaction >= 70 ? 'text-amber-300' : 'text-rose-300'}>
                      {u.satisfaction}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-[hsl(30_12%_60%)]">
                    No users match your filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <p className="text-xs text-[hsl(30_12%_55%)] mt-4">
          Showing {Math.min(200, filtered.length).toLocaleString()} of {filtered.length.toLocaleString()} users.
        </p>
      </Card>
    </div>
  );
};

export default AdminUsers;
