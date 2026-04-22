import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface AuditRow {
  id: string; actor_role: string | null; action: string;
  target_type: string | null; target_id: string | null; created_at: string;
}

const AdminAudit: React.FC = () => {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — Audit Log · SuperNomad';
    (async () => {
      const { data } = await supabase
        .from('staff_audit_log')
        .select('id,actor_role,action,target_type,target_id,created_at')
        .order('created_at', { ascending: false })
        .limit(200);
      setRows((data as any) ?? demoAudit);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold">Staff Audit Log</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">Append-only record of every privileged Back Office action.</p>
      </header>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(43_96%_56%/0.15)] hover:bg-transparent">
                <TableHead>When</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="border-[hsl(43_96%_56%/0.1)]">
                  <TableCell className="text-xs text-[hsl(30_12%_70%)]">{new Date(r.created_at).toLocaleString()}</TableCell>
                  <TableCell><Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]">{r.actor_role ?? 'system'}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{r.action}</TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_70%)]">
                    {r.target_type ? `${r.target_type}:${r.target_id ?? '—'}` : '—'}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-[hsl(30_12%_60%)]">No audit entries yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

const demoAudit: AuditRow[] = [
  { id: '1', actor_role: 'admin', action: 'user.suspend', target_type: 'user', target_id: 'u_42', created_at: new Date().toISOString() },
  { id: '2', actor_role: 'support', action: 'ticket.assign', target_type: 'ticket', target_id: '#1042', created_at: new Date(Date.now() - 1800_000).toISOString() },
  { id: '3', actor_role: 'admin', action: 'package.activate', target_type: 'package', target_id: 'hnw-mobility', created_at: new Date(Date.now() - 3600_000).toISOString() },
];

export default AdminAudit;
