import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Fingerprint, ShieldCheck } from 'lucide-react';
import { SnomadIdService } from '@/services/SnomadIdService';
import { useToast } from '@/hooks/use-toast';

const SnomadIdCard: React.FC = () => {
  const [snomadId, setSnomadId] = useState<string | null>(null);
  const [isAuthBacked, setIsAuthBacked] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const fromDb = await SnomadIdService.fetchMine();
      if (!mounted) return;
      if (fromDb) {
        setSnomadId(fromDb);
        setIsAuthBacked(true);
      } else {
        setSnomadId(SnomadIdService.getOrCreateGuest());
        setIsAuthBacked(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleCopy = async () => {
    if (!snomadId) return;
    await navigator.clipboard.writeText(snomadId);
    setCopied(true);
    toast({ title: 'Copied', description: 'Your SuperNomad ID is now in your clipboard.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Fingerprint className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Your SuperNomad ID</CardTitle>
              <CardDescription>
                Pseudonymous identifier — used in support, analytics & partner queries instead of your name.
              </CardDescription>
            </div>
          </div>
          {isAuthBacked ? (
            <Badge variant="default" className="gap-1">
              <ShieldCheck className="h-3 w-3" /> Verified
            </Badge>
          ) : (
            <Badge variant="secondary">Guest</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <code className="flex-1 px-4 py-3 rounded-md bg-muted font-mono text-base tracking-wider select-all">
            {snomadId ?? 'Loading…'}
          </code>
          <Button size="icon" variant="outline" onClick={handleCopy} disabled={!snomadId}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This ID is what support agents, researchers, and consented partner integrations see.
          Your name and email never leave your private vault. You can share this ID safely
          when contacting support — it lets us help you without exposing personal details.
        </p>
        {!isAuthBacked && (
          <p className="text-xs text-amber-600">
            Sign in to lock this ID to your account permanently and unlock the consent center.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SnomadIdCard;
