import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Loader2, Bot, ShieldCheck, UserCog, Search } from 'lucide-react';
import { getAdminDemoDataset, type DemoAudit } from '@/utils/adminDemoData';

const ROLE_BADGE: Record<string, string> = {
  admin: 'bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]',
  support: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  affiliate_manager: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  system: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  'ai-worker': 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
};

const AdminAudit: React.FC = () => {
  const [rows, setRows] = useState<DemoAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    document.title = 'Back Office — Audit Log · SuperNomad';
    (async () => {
      const { data } = await supabase
        .from('staff_audit_log')
        .select('id,actor_role,action,target_type,target_id,created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      const demo = getAdminDemoDataset().audit;
      if (data && data.length > 0) {
        setRows([
          ...data.map((r: any) => ({ ...r, ai_worker: undefined } as DemoAudit)),
          ...demo,
        ]);
      } else {
        setRows(demo);
      }
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const ai = rows.filter(r => r.actor_role === 'ai-worker').length;
    const human = rows.filter(r => r.actor_role === 'admin' || r.actor_role === 'support' || r.actor_role === 'affiliate_manager').length;
    const system = rows.filter(r => r.actor_role === 'system').length;
    return { ai, human, system, aiPct: rows.length ? Math.round((ai / rows.length) * 100) : 0 };
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (roleFilter !== 'all' && r.actor_role !== roleFilter) return false;
      if (!q) return true;
      const ql = q.toLowerCase();
      return `${r.action} ${r.target_id} ${r.target_type} ${r.ai_worker ?? ''}`.toLowerCase().includes(ql);
    });
  }, [rows, q, roleFilter]);

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold">Staff Audit Log</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">
          {rows.length} entries · {stats.aiPct}% logged by autonomous AI workers · append-only.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setRoleFilter('all')}
          className={`text-left rounded-lg border p-4 transition ${roleFilter === 'all' ? 'border-[hsl(var(--gold))] bg-[hsl(43_96%_56%/0.08)]' : 'border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_10%)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
        >
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]">ALL ENTRIES</div>
          <div className="text-2xl font-bold mt-1">{rows.length}</div>
        </button>
        <button
          onClick={() => setRoleFilter('ai-worker')}
          className={`text-left rounded-lg border p-4 transition ${roleFilter === 'ai-worker' ? 'border-fuchsia-500/40 bg-fuchsia-500/5' : 'border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_10%)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
        >
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Bot className="h-3.5 w-3.5 text-fuchsia-300" /> AI WORKERS</div>
          <div className="text-2xl font-bold text-fuchsia-300 mt-1">{stats.ai}</div>
        </button>
        <button
          onClick={() => setRoleFilter('admin')}
          className={`text-left rounded-lg border p-4 transition ${roleFilter === 'admin' || roleFilter === 'support' ? 'border-[hsl(var(--gold))] bg-[hsl(43_96%_56%/0.08)]' : 'border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_10%)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
        >
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><UserCog className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> HUMAN STAFF</div>
          <div className="text-2xl font-bold mt-1">{stats.human}</div>
        </button>
        <button
          onClick={() => setRoleFilter('system')}
          className={`text-left rounded-lg border p-4 transition ${roleFilter === 'system' ? 'border-slate-400/40 bg-slate-500/5' : 'border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_10%)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
        >
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><ShieldCheck className="h-3.5 w-3.5 text-slate-300" /> SYSTEM JOBS</div>
          <div className="text-2xl font-bold text-slate-200 mt-1">{stats.system}</div>
        </button>
      </div>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(30_12%_60%)]" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search action, target, or AI worker…"
            className="pl-9 bg-[hsl(220_22%_8%)] border-[hsl(43_96%_56%/0.15)] text-white"
          />
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
                <TableHead>When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>AI Worker</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 200).map((r) => (
                <TableRow key={r.id} className="border-[hsl(43_96%_56%/0.1)]">
                  <TableCell className="text-xs text-[hsl(30_12%_70%)]">{new Date(r.created_at).toLocaleString()}</TableCell>
                  <TableCell><Badge className={ROLE_BADGE[r.actor_role] ?? ''}>{r.actor_role}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{r.action}</TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_75%)]">
                    <span className="text-[hsl(30_12%_60%)]">{r.target_type}:</span> {r.target_id}
                  </TableCell>
                  <TableCell className="text-xs">
                    {r.ai_worker ? (
                      <span className="inline-flex items-center gap-1 text-fuchsia-300"><Bot className="h-3 w-3" /> {r.ai_worker}</span>
                    ) : <span className="text-[hsl(30_12%_60%)]">—</span>}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-[hsl(30_12%_60%)]">No entries match.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
        <p className="text-xs text-[hsl(30_12%_55%)] mt-3">
          Showing {Math.min(200, filtered.length)} of {filtered.length}.
        </p>
      </Card>
    </div>
  );
};

export default AdminAudit;
