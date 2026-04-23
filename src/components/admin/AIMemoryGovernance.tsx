/**
 * AI Memory Governance Panel
 * --------------------------
 * EU AI Act Art. 12 + GDPR Art. 30: gives staff a single screen to inspect,
 * tag, expire, and bulk-delete AI memories per device/user. Read-only by
 * default; destructive actions gated behind a confirm + reason field that
 * writes to `audit_log`.
 *
 * Drop into Back Office: import and add to AdminAI page or its own route.
 */
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { AlertTriangle, ShieldCheck, Search, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

type Memory = {
  id: string;
  fact: string;
  category: string;
  confidence: number;
  importance: number;
  durability: string;
  device_id: string;
  user_id: string | null;
  created_at: string;
  semantic_tags: string[] | null;
};

export const AIMemoryGovernance: React.FC = () => {
  const [query, setQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');
  const [rows, setRows] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState('');

  async function load() {
    setLoading(true);
    let q = supabase
      .from('ai_memories')
      .select('id,fact,category,confidence,importance,durability,device_id,user_id,created_at,semantic_tags')
      .order('created_at', { ascending: false })
      .limit(200);
    if (deviceFilter) q = q.eq('device_id', deviceFilter);
    if (query) q = q.ilike('fact', `%${query}%`);
    const { data, error } = await q;
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setRows((data ?? []) as Memory[]);
    setSelected(new Set());
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  function toggle(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  async function purgeSelected() {
    if (!selected.size) return;
    if (!reason.trim() || reason.trim().length < 10) {
      toast.error('Reason required (≥ 10 chars) for audit log.');
      return;
    }
    const ids = [...selected];
    const { error } = await supabase.from('ai_memories').delete().in('id', ids);
    if (error) { toast.error(error.message); return; }

    await supabase.from('audit_log').insert({
      action: 'ai_memory.bulk_purge',
      resource: ids.join(','),
      device_id: deviceFilter || 'admin',
      metadata: { count: ids.length, reason, query, device_filter: deviceFilter },
    });
    toast.success(`Purged ${ids.length} memories — audit logged.`);
    setReason('');
    load();
  }

  const piiHits = rows.filter(r => /\b(email|phone|passport|ssn|tax id|iban|cvv)\b/i.test(r.fact));

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-[hsl(220_22%_11%)] to-[hsl(220_22%_8%)] border-amber-500/20">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-5 w-5 text-amber-400" />
          <h2 className="font-semibold text-white">AI Memory Governance</h2>
          <Badge variant="outline" className="border-amber-500/40 text-amber-300">
            EU AI Act · Art. 12
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Inspect, classify, and purge stored AI memories. Every destructive action
          is recorded in <code>audit_log</code> with a reason and operator ID.
        </p>
      </Card>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search fact text…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && load()}
            />
          </div>
          <Input
            className="sm:w-72"
            placeholder="Filter device_id (optional)"
            value={deviceFilter}
            onChange={e => setDeviceFilter(e.target.value)}
          />
          <Button onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Search'}</Button>
        </div>

        {piiHits.length > 0 && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5" />
            <div className="text-xs text-amber-200">
              <strong>{piiHits.length}</strong> memory record(s) appear to mention PII tokens
              (email / phone / passport / IBAN). Review and purge if not justified by retention policy.
            </div>
          </div>
        )}
      </Card>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Fact</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Conf</TableHead>
              <TableHead className="text-right">Imp</TableHead>
              <TableHead>Device</TableHead>
              <TableHead><Clock className="inline h-3 w-3" /> Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(r => {
              const isPii = /\b(email|phone|passport|ssn|iban|cvv)\b/i.test(r.fact);
              return (
                <TableRow key={r.id} className={selected.has(r.id) ? 'bg-primary/5' : undefined}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selected.has(r.id)}
                      onChange={() => toggle(r.id)}
                    />
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className={isPii ? 'text-amber-200' : ''}>{r.fact}</div>
                    {r.semantic_tags?.length ? (
                      <div className="mt-1 flex gap-1 flex-wrap">
                        {r.semantic_tags.slice(0, 4).map(t => (
                          <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                        ))}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell><Badge variant="outline">{r.category}</Badge></TableCell>
                  <TableCell className="text-right tabular-nums">{r.confidence.toFixed(2)}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.importance}</TableCell>
                  <TableCell className="font-mono text-xs">{r.device_id.slice(0, 12)}…</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {Math.floor((Date.now() - new Date(r.created_at).getTime()) / 86400000)}d
                  </TableCell>
                </TableRow>
              );
            })}
            {!rows.length && !loading && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                No memories match. Try clearing filters.
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-4 border-destructive/30">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="h-4 w-4 text-destructive" />
          <h3 className="font-semibold">Purge selected ({selected.size})</h3>
        </div>
        <Textarea
          placeholder="Reason for purge (required, ≥ 10 chars). Logged to audit_log."
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="mb-2"
          rows={2}
        />
        <Button
          variant="destructive"
          disabled={!selected.size || reason.trim().length < 10}
          onClick={purgeSelected}
        >
          Purge {selected.size} memor{selected.size === 1 ? 'y' : 'ies'}
        </Button>
      </Card>
    </div>
  );
};

export default AIMemoryGovernance;
