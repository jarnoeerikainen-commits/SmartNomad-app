import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Shield, ExternalLink } from 'lucide-react';
import {
  PermissionId,
  getPermission,
  GDPR_BASIS_LABEL,
  TIER_LABEL,
} from '@/data/permissionsRegistry';
import {
  requestPermission,
  getStatus,
  PermissionStatus,
} from '@/services/PermissionService';
import { useToast } from '@/hooks/use-toast';

interface PermissionPrePromptProps {
  permissionId: PermissionId;
  open: boolean;
  onClose: (status: PermissionStatus) => void;
  /** Optional context — e.g. "to count your Schengen days" */
  reason?: string;
}

/**
 * Custom pre-prompt shown BEFORE the OS permission dialog.
 *
 * Apple guideline 5.1.1 strongly encourages this pattern — it dramatically
 * improves opt-in rates AND lets users say "Not now" without burning the
 * one-shot OS prompt (which on iOS cannot be re-triggered after a deny).
 */
const PermissionPrePrompt: React.FC<PermissionPrePromptProps> = ({
  permissionId,
  open,
  onClose,
  reason,
}) => {
  const spec = getPermission(permissionId);
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<PermissionStatus>('prompt');

  useEffect(() => {
    if (open && spec) getStatus(permissionId).then(setCurrentStatus);
  }, [open, spec, permissionId]);

  if (!spec) return null;
  const Icon = spec.icon;

  const handleAllow = async () => {
    setBusy(true);
    const status = await requestPermission(permissionId);
    setBusy(false);
    if (status === 'granted') {
      toast({
        title: `${spec.label} enabled`,
        description: 'Logged to your consent ledger. You can revoke anytime.',
      });
    } else if (status === 'denied') {
      toast({
        title: `${spec.label} declined`,
        description: 'No problem — re-enable anytime in Sovereign Access.',
        variant: 'destructive',
      });
    } else if (status === 'unsupported') {
      toast({
        title: 'Not available on this platform',
        description: 'This permission requires the SuperNomad mobile app.',
      });
    }
    onClose(status);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(currentStatus)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <DialogTitle className="flex items-center gap-2">
                {spec.label}
                <Badge variant="outline" className="text-xs">
                  {TIER_LABEL[spec.tier]}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-1">
                {reason || spec.pitch}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <p className="text-foreground/90 leading-relaxed">{spec.purpose}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-green-600" />
                We use
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {spec.collects.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <X className="h-3.5 w-3.5 text-red-600" />
                We never
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {spec.doesNotCollect.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-3">
            <p className="text-xs flex items-start gap-2">
              <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
              <span>
                <strong>Legal basis:</strong> {GDPR_BASIS_LABEL[spec.gdprBasis]}.
                Logged to your consent ledger.
              </span>
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={() => onClose('prompt')} disabled={busy}>
            Not now
          </Button>
          <Button onClick={handleAllow} disabled={busy}>
            {busy ? 'Requesting…' : 'Allow'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionPrePrompt;
