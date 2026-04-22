import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Search, Loader2 } from 'lucide-react';

interface ProfileRow {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  snomad_id: string | null;
  created_at: string;
}

const AdminUsers: React.FC = () => {
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Back Office — Users · SuperNomad';
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id,email,first_name,last_name,snomad_id,created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      setRows((data as any) ?? demoUsers);
      setLoading(false);
    })();
  }, []);

  const filtered = rows.filter((r) => {
    if (!q) return true;
    const hay = `${r.email ?? ''} ${r.first_name ?? ''} ${r.last_name ?? ''} ${r.snomad_id ?? ''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold">Users</h1>
        <p className="text-sm text-[hsl(30_12%_70%)] mt-1">Search by email, name, or Snomad ID.</p>
      </header>

      <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(30_12%_60%)]" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users…"
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
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id} className="border-[hsl(43_96%_56%/0.1)]">
                  <TableCell className="font-mono text-xs text-[hsl(var(--gold))]">{u.snomad_id ?? '—'}</TableCell>
                  <TableCell>{[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}</TableCell>
                  <TableCell className="text-[hsl(30_12%_80%)]">{u.email ?? '—'}</TableCell>
                  <TableCell className="text-xs text-[hsl(30_12%_70%)]">
                    {new Date(u.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-[hsl(30_12%_60%)]">
                    No users match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <p className="text-xs text-[hsl(30_12%_55%)] mt-4">
        Showing up to 100 most recent users. Full search/suspend/verify actions ship in v1.1.
      </p>
    </div>
  );
};

const demoUsers: ProfileRow[] = [
  { id: '1', email: 'meghan@example.com', first_name: 'Meghan', last_name: 'Sussex', snomad_id: 'SN-A1B2-C3D4-E5F6', created_at: new Date().toISOString() },
  { id: '2', email: 'john@example.com', first_name: 'John', last_name: 'Lennon', snomad_id: 'SN-9X8Y-7Z6W-5V4U', created_at: new Date(Date.now() - 86400000).toISOString() },
];

export default AdminUsers;
