import React, { useEffect, useMemo, useState } from 'react';
import {
  PERMISSION_REGISTRY,
  PermissionId,
  PermissionSpec,
  getPermissionsByCategory,
  TIER_LABEL,
  GDPR_BASIS_LABEL,
} from '@/data/permissionsRegistry';
import {
  getAllStatuses,
  PermissionStatus,
  revokePermission,
  getRecord,
} from '@/services/PermissionService';
import PermissionPrePrompt from './PermissionPrePrompt';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Shield, ShieldCheck, ShieldAlert, FileLock2, Eye, ExternalLink,
  RefreshCw, BookLock, MapPin, Mic, Camera, Calendar as CalendarIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const STATUS_LABEL: Record<PermissionStatus, { label: string; tone: 'success' | 'muted' | 'warn' | 'destructive' }> = {
  granted: { label: 'Active', tone: 'success' },
  denied: { label: 'Declined', tone: 'destructive' },
  prompt: { label: 'Not requested', tone: 'muted' },
  unsupported: { label: 'Mobile app only', tone: 'muted' },
  revoked: { label: 'Revoked', tone: 'warn' },
};

const CATEGORY_TITLE: Record<string, string> = {
  location: 'Location',
  communications: 'Calendar, Contacts & Email',
  media: 'Camera, Microphone & Photos',
  health: 'Health & Activity',
  identity: 'Identity & Biometrics',
  system: 'System & Background',
};

interface RowProps {
  spec: PermissionSpec;
  status: PermissionStatus;
  onRequest: (id: PermissionId) => void;
  onRevoke: (id: PermissionId) => void;
}

const PermissionRow: React.FC<RowProps> = ({ spec, status, onRequest, onRevoke }) => {
  const Icon = spec.icon;
  const meta = STATUS_LABEL[status];
  const record = getRecord(spec.id);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-sm">{spec.label}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{spec.pitch}</p>
            </div>
            <Badge
              variant={
                meta.tone === 'success'
                  ? 'default'
                  : meta.tone === 'destructive'
                  ? 'destructive'
                  : 'outline'
              }
              className="text-[10px] shrink-0"
            >
              {meta.label}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
            <Badge variant="outline" className="text-[10px]">{TIER_LABEL[spec.tier]}</Badge>
            <span>·</span>
            <span>{GDPR_BASIS_LABEL[spec.gdprBasis]}</span>
            {record?.lastUsedAt && (
              <>
                <span>·</span>
                <span>last used {new Date(record.lastUsedAt).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
        {status === 'granted' || status === 'denied' ? (
          <Button size="sm" variant="outline" onClick={() => onRevoke(spec.id)}>
            Revoke
          </Button>
        ) : status === 'unsupported' ? (
          <span className="text-xs text-muted-foreground">Available in mobile app</span>
        ) : (
          <Button size="sm" onClick={() => onRequest(spec.id)}>
            Enable
          </Button>
        )}
      </div>
    </div>
  );
};

const SovereignAccessCenter: React.FC = () => {
  const [statuses, setStatuses] = useState<Record<PermissionId, PermissionStatus>>({} as any);
  const [loading, setLoading] = useState(true);
  const [activePrompt, setActivePrompt] = useState<PermissionId | null>(null);
  const { toast } = useToast();

  const refresh = async () => {
    setLoading(true);
    const all = await getAllStatuses();
    setStatuses(all);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const grouped = useMemo(() => getPermissionsByCategory(), []);

  const totals = useMemo(() => {
    const list = Object.values(statuses);
    return {
      granted: list.filter((s) => s === 'granted').length,
      revoked: list.filter((s) => s === 'revoked' || s === 'denied').length,
      pending: list.filter((s) => s === 'prompt').length,
      total: PERMISSION_REGISTRY.length,
    };
  }, [statuses]);

  const handleRevoke = async (id: PermissionId) => {
    await revokePermission(id);
    toast({
      title: 'Permission revoked',
      description: 'Logged to your consent ledger.',
    });
    refresh();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" />
          Sovereign Access
        </h2>
        <p className="text-muted-foreground">
          Every permission, every data source — under your control. Granted just-in-time, revocable forever.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-green-600">{totals.granted}</p>
            <p className="text-xs text-muted-foreground">Active permissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-muted-foreground">{totals.pending}</p>
            <p className="text-xs text-muted-foreground">Available to enable</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-orange-600">{totals.revoked}</p>
            <p className="text-xs text-muted-foreground">Revoked / declined</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{totals.total}</p>
            <p className="text-xs text-muted-foreground">Total possible</p>
          </CardContent>
        </Card>
      </div>

      {/* Trust principles */}
      <Alert>
        <BookLock className="h-4 w-4" />
        <AlertTitle>Our Sovereign Trust principles</AlertTitle>
        <AlertDescription>
          <ul className="text-sm space-y-1 mt-2">
            <li>• Nothing is requested at install. You stay in control of every prompt.</li>
            <li>• Each grant and revoke is written to your immutable consent ledger.</li>
            <li>• We disclose the legal basis (GDPR Art. 6) for every data type we touch.</li>
            <li>• We never sell, rent, or share data without your explicit per-purpose consent.</li>
            <li>
              Read the full{' '}
              <Link to="/privacy-policy" className="underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link to="/terms" className="underline">
                Terms
              </Link>
              .
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Categories */}
      <Tabs defaultValue="location" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          <TabsTrigger value="location" className="text-xs">Location</TabsTrigger>
          <TabsTrigger value="communications" className="text-xs">Comms</TabsTrigger>
          <TabsTrigger value="media" className="text-xs">Media</TabsTrigger>
          <TabsTrigger value="health" className="text-xs">Health</TabsTrigger>
          <TabsTrigger value="identity" className="text-xs">Identity</TabsTrigger>
          <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
        </TabsList>

        {(Object.keys(grouped) as Array<keyof typeof grouped>).map((cat) => (
          <TabsContent key={cat} value={cat} className="space-y-3 mt-4">
            <h3 className="font-semibold text-sm text-muted-foreground">{CATEGORY_TITLE[cat]}</h3>
            {(grouped[cat] || []).map((spec) => (
              <PermissionRow
                key={spec.id}
                spec={spec}
                status={statuses[spec.id] || 'prompt'}
                onRequest={(id) => setActivePrompt(id)}
                onRevoke={handleRevoke}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Refresh */}
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Re-check status
        </Button>
      </div>

      {/* Pre-prompt */}
      {activePrompt && (
        <PermissionPrePrompt
          permissionId={activePrompt}
          open={!!activePrompt}
          onClose={() => {
            setActivePrompt(null);
            refresh();
          }}
        />
      )}
    </div>
  );
};

export default SovereignAccessCenter;
