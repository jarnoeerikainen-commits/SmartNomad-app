import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Loader2, Bot, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { getAdminDemoDataset, type DemoTicket } from '@/utils/adminDemoData';

const priorityClass = (p: string) =>
  ({
    urgent: 'bg-red-500/15 text-red-400 border-red-500/30',
    high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    normal: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    low: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  }[p] ?? 'bg-slate-500/15 text-slate-400');

const statusClass = (s: string) =>
  ({
    open: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    resolved: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    closed: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  }[s] ?? 'bg-slate-500/15 text-slate-400');

const AdminTickets: React.FC = () => {
  const [rows, setRows] = useState<DemoTicket[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'urgent' | 'ai'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — Support · SuperNomad';
    (async () => {
      const { data } = await supabase
        .from('support_tickets')
        .select('id,ticket_number,subject,category,priority,status,requester_email,created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      const demo = getAdminDemoDataset().tickets;
      if (data && data.length > 0) {
        const merged = [
          ...data.map((t: any) => ({ ...t, ai_handled: false } as DemoTicket)),
          ...demo,
        ];
        setRows(merged);
      } else {
        setRows(demo);
      }
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const open = rows.filter(t => t.status === 'open' || t.status === 'pending').length;
    const urgent = rows.filter(t => t.priority === 'urgent' && (t.status === 'open' || t.status === 'pending')).length;
    const ai = rows.filter(t => t.ai_handled).length;
    const resolved = rows.filter(t => t.status === 'resolved' || t.status === 'closed').length;
    return { open, urgent, ai, resolved, aiPct: rows.length ? Math.round((ai / rows.length) * 100) : 0 };
  }, [rows]);

  const filtered = useMemo(() => {
    if (filter === 'open') return rows.filter(t => t.status === 'open' || t.status === 'pending');
    if (filter === 'urgent') return rows.filter(t => t.priority === 'urgent');
    if (filter === 'ai') return rows.filter(t => t.ai_handled);
    return rows;
  }, [rows, filter]);

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold">Support Tickets</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">
          {rows.length} tickets · {stats.aiPct}% auto-handled by AI workers · 24/7 triage
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`text-left rounded-lg border p-4 transition ${filter === 'all' ? 'border-[hsl(var(--gold))] bg-[hsl(43_96%_56%/0.08)]' : 'border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_10%)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
        >
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Clock className="h-3.5 w-3.5" /> ALL</div>
          <div className="text-2xl font-bold mt-1">{rows.length}</div>
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`text-left rounded-lg border p-4 transition ${filter === 'open' ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_10%)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
        >
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Clock className="h-3.5 w-3.5 text-emerald-300" /> OPEN</div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">{stats.open}</div>
        </button>
        <button
          onClick={() => setFilter('urgent')}
          className={`text-left rounded-lg border p-4 transition ${filter === 'urgent' ? 'border-rose-500/40 bg-rose-500/5' : 'border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_10%)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
        >
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><AlertTriangle className="h-3.5 w-3.5 text-rose-300" /> URGENT</div>
          <div className="text-2xl font-bold text-rose-300 mt-1">{stats.urgent}</div>
        </button>
        <button
          onClick={() => setFilter('ai')}
          className={`text-left rounded-lg border p-4 transition ${filter === 'ai' ? 'border-fuchsia-500/40 bg-fuchsia-500/5' : 'border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_10%)] hover:border-[hsl(43_96%_56%/0.3)]'}`}
        >
          <div className="flex items-center gap-2 text-xs text-[hsl(30_12%_70%)]"><Bot className="h-3.5 w-3.5 text-fuchsia-300" /> AI-HANDLED</div>
          <div className="text-2xl font-bold text-fuchsia-300 mt-1">{stats.ai} <span className="text-xs font-normal text-[hsl(30_12%_60%)]">({stats.aiPct}%)</span></div>
        </button>
      </div>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
                <TableHead>#</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 150).map((t) => (
                <TableRow key={t.id} className="border-[hsl(43_96%_56%/0.1)]">
                  <TableCell className="font-mono text-xs text-[hsl(var(--gold))]">#{t.ticket_number}</TableCell>
                  <TableCell className="max-w-xs truncate">{t.subject}</TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_70%)]">{t.category}</TableCell>
                  <TableCell><Badge className={priorityClass(t.priority)}>{t.priority}</Badge></TableCell>
                  <TableCell><Badge className={statusClass(t.status)}>{t.status}</Badge></TableCell>
                  <TableCell className="text-xs">
                    {t.ai_handled ? (
                      <span className="inline-flex items-center gap-1 text-fuchsia-300"><Bot className="h-3 w-3" /> AI</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-300"><CheckCircle2 className="h-3 w-3" /> Human</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_75%)]">{t.requester_email}</TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_70%)]">{new Date(t.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-[hsl(30_12%_60%)]">
                    No tickets match the filter.
                  </TableCell>
                </TableRow>
              )}
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

export default AdminTickets;
