import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity, AlertTriangle, ShieldCheck, KeyRound, CreditCard, Eye, RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';

interface AuditEntry {
  id: string;
  action: string;
  resource: string | null;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
}

/** Actions we treat as elevated-risk and surface as alerts. */
const SUSPICIOUS_ACTIONS = new Set([
  'auth.failed_login',
  'auth.password_reset_requested',
  'mfa.unenrolled',
  'agentic.payment_blocked',
  'agentic.guardrail_breach',
  'snomad_id.vault_decrypt_failed',
  'trust_pass.credential_revoked',
]);

const ACTION_ICONS: Record<string, React.ReactNode> = {
  'auth.login': <ShieldCheck className="h-4 w-4 text-success" />,
  'auth.failed_login': <AlertTriangle className="h-4 w-4 text-destructive" />,
  'auth.password_reset_requested': <KeyRound className="h-4 w-4 text-warning" />,
  'mfa.enrolled': <ShieldCheck className="h-4 w-4 text-success" />,
  'mfa.unenrolled': <AlertTriangle className="h-4 w-4 text-warning" />,
  'agentic.payment': <CreditCard className="h-4 w-4 text-primary" />,
  'agentic.payment_blocked': <AlertTriangle className="h-4 w-4 text-destructive" />,
  'snomad_id.vault_read': <Eye className="h-4 w-4 text-muted-foreground" />,
  'trust_pass.credential_revoked': <AlertTriangle className="h-4 w-4 text-warning" />,
};

/**
 * SecurityActivityFeed — read-only window into the user's own audit_log rows.
 *
 * Shown only for authenticated users (RLS already restricts to auth.uid()).
 * Demo / guest sessions render nothing because there is no `user_id` to query.
 */
const SecurityActivityFeed: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('id, action, resource, created_at, ip_address, user_agent, metadata')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(25);
      if (error) throw error;
      setEntries((data ?? []) as AuditEntry[]);
    } catch (e) {
      console.warn('audit feed load failed:', e);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!isAuthenticated) return null;

  const suspicious = (entries ?? []).filter(e => SUSPICIOUS_ACTIONS.has(e.action));
  const recent = entries ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent security activity
            </CardTitle>
            <CardDescription>
              An append-only log of sensitive actions on your account. Only you can read this.
            </CardDescription>
          </div>
          <Button size="icon" variant="ghost" onClick={load} disabled={loading} aria-label="Refresh">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {suspicious.length > 0 && (
          <Alert className="border-destructive/40 bg-destructive/5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-destructive">
              {suspicious.length} elevated-risk event{suspicious.length === 1 ? '' : 's'} in the last 25 events
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Review the highlighted rows below. If anything looks unfamiliar, change your password
              and add a two-factor method immediately.
            </AlertDescription>
          </Alert>
        )}

        {entries === null || loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activity yet. Sensitive actions will appear here as they happen.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border bg-card/50">
            {recent.map(e => {
              const isSuspicious = SUSPICIOUS_ACTIONS.has(e.action);
              return (
                <li
                  key={e.id}
                  className={`p-3 flex items-start gap-3 ${
                    isSuspicious ? 'bg-destructive/5' : ''
                  }`}
                >
                  <div className="mt-0.5">
                    {ACTION_ICONS[e.action] ?? <Activity className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{prettify(e.action)}</span>
                      {isSuspicious && (
                        <Badge variant="outline" className="border-destructive text-destructive text-xs">
                          Elevated risk
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
                      {' · '}
                      {format(new Date(e.created_at), 'd MMM yyyy, HH:mm')}
                      {e.ip_address && (
                        <>
                          {' · '}IP {e.ip_address}
                        </>
                      )}
                    </div>
                    {e.resource && (
                      <div className="text-xs text-muted-foreground/80 mt-0.5 truncate">
                        Resource: <span className="font-mono">{e.resource}</span>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-xs text-muted-foreground">
          Showing the most recent 25 events. Older entries are retained for 12 months.
        </p>
      </CardContent>
    </Card>
  );
};

function prettify(action: string): string {
  return action
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export default SecurityActivityFeed;
