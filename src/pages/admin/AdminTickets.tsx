import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface Ticket {
  id: string;
  ticket_number: number;
  subject: string;
  category: string;
  priority: string;
  status: string;
  requester_email: string | null;
  created_at: string;
}

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
  const [rows, setRows] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — Support · SuperNomad';
    (async () => {
      const { data } = await supabase
        .from('support_tickets')
        .select('id,ticket_number,subject,category,priority,status,requester_email,created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      setRows((data as any) ?? demoTickets);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold">Support Tickets</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">100 most recent tickets across all channels.</p>
      </header>

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
                <TableHead>Requester</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id} className="border-[hsl(43_96%_56%/0.1)]">
                  <TableCell className="font-mono text-xs text-[hsl(var(--gold))]">#{t.ticket_number}</TableCell>
                  <TableCell className="max-w-xs truncate">{t.subject}</TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_70%)]">{t.category}</TableCell>
                  <TableCell><Badge className={priorityClass(t.priority)}>{t.priority}</Badge></TableCell>
                  <TableCell><Badge className={statusClass(t.status)}>{t.status}</Badge></TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_75%)]">{t.requester_email ?? '—'}</TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_70%)]">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-[hsl(30_12%_60%)]">
                    No tickets yet. New tickets will appear here in real time.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

const demoTickets: Ticket[] = [
  { id: '1', ticket_number: 1042, subject: 'Cannot link payment card', category: 'billing', priority: 'high', status: 'open', requester_email: 'meghan@example.com', created_at: new Date().toISOString() },
  { id: '2', ticket_number: 1041, subject: 'ETIAS deadline question', category: 'compliance', priority: 'normal', status: 'pending', requester_email: 'john@example.com', created_at: new Date(Date.now() - 3600_000).toISOString() },
  { id: '3', ticket_number: 1040, subject: 'Snomad ID lock recovery', category: 'security', priority: 'urgent', status: 'open', requester_email: 'sov@example.com', created_at: new Date(Date.now() - 7200_000).toISOString() },
];

export default AdminTickets;
