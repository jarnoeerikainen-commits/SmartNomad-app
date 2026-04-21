import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { getAllStatuses, type PermissionStatus } from '@/services/PermissionService';
import { PERMISSION_REGISTRY, type PermissionId } from '@/data/permissionsRegistry';

interface Props {
  onOpen: () => void;
}

/**
 * Dashboard nudge — surfaces ONLY when the user has either
 *  (a) granted zero permissions, or
 *  (b) has 3+ permissions still pending.
 *
 * Dismissable for the session via localStorage flag.
 */
const SovereignAccessNudge: React.FC<Props> = ({ onOpen }) => {
  const [stats, setStats] = useState({ granted: 0, pending: 0, total: 0 });
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('sovereign_nudge_dismissed') === '1',
  );

  useEffect(() => {
    let cancelled = false;
    getAllStatuses().then((all) => {
      if (cancelled) return;
      const list = Object.values(all) as PermissionStatus[];
      setStats({
        granted: list.filter((s) => s === 'granted').length,
        pending: list.filter((s) => s === 'prompt').length,
        total: PERMISSION_REGISTRY.length,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (dismissed) return null;
  if (stats.granted >= 3 && stats.pending < 3) return null;

  const dismiss = () => {
    sessionStorage.setItem('sovereign_nudge_dismissed', '1');
    setDismissed(true);
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="rounded-xl bg-primary/15 p-2.5 text-primary shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm">Unlock your Sovereign OS</p>
            <Badge variant="outline" className="text-[10px]">
              {stats.granted}/{stats.total} active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enable just-in-time permissions so the Concierge can prep your trips, alerts and tax days automatically.
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button size="sm" onClick={onOpen} className="gap-1">
            Open
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={dismiss}>
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SovereignAccessNudge;
