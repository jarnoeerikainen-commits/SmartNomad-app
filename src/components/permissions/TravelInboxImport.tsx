import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mail, Inbox, Copy, Check, ExternalLink, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PermissionPrePrompt from './PermissionPrePrompt';
import { PermissionId } from '@/data/permissionsRegistry';

const TravelInboxImport: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [days, setDays] = useState<number>(90);
  const [activePrompt, setActivePrompt] = useState<PermissionId | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate the user's unique forward-to address (deterministic, no backend round-trip)
  const forwardAddress = React.useMemo(() => {
    if (!user) return null;
    // Deterministic short slug from user id — server-side parser maps it back.
    const slug = user.id.replace(/-/g, '').slice(0, 12);
    return `${slug}@inbox.supernomad.com`;
  }, [user]);

  const copyAddress = async () => {
    if (!forwardAddress) return;
    await navigator.clipboard.writeText(forwardAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    toast({ title: 'Address copied', description: 'Paste into your email forwarding rules.' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Mail className="h-7 w-7 text-primary" />
          Travel Inbox
        </h2>
        <p className="text-muted-foreground">
          Pull flight, hotel, and rental confirmations into your travel timeline — your way.
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Privacy first</AlertTitle>
        <AlertDescription className="text-sm">
          We only read messages from known travel senders (airlines, hotels, OTAs). Personal email is never touched.
          You can disconnect at any time, here or directly in your Google / Microsoft account.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="oauth">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="oauth">OAuth import</TabsTrigger>
          <TabsTrigger value="forward">Forward-to address</TabsTrigger>
        </TabsList>

        {/* OAuth flow */}
        <TabsContent value="oauth" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Connect Gmail or Outlook
              </CardTitle>
              <CardDescription>
                One-tap secure import using OAuth. Choose how far back you want to look.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Look back range</label>
                  <Badge variant="outline">
                    {days < 31 ? `${days} days` : days < 365 ? `${Math.round(days / 30)} months` : `${Math.round(days / 365 * 10) / 10} years`}
                  </Badge>
                </div>
                <Slider
                  value={[days]}
                  onValueChange={(v) => setDays(v[0])}
                  min={7}
                  max={730}
                  step={7}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>1 week</span>
                  <span>3 months</span>
                  <span>6 months</span>
                  <span>1 year</span>
                  <span>2 years</span>
                </div>
                {days > 365 && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Looking back more than 12 months requires extra confirmation. We'll re-prompt you on the next step.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setActivePrompt('email-import-google')}
                >
                  <Mail className="h-5 w-5" />
                  <div className="text-left w-full">
                    <p className="font-semibold text-sm">Connect Gmail</p>
                    <p className="text-xs text-muted-foreground">
                      Google OAuth · narrow scope
                    </p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setActivePrompt('email-import-microsoft')}
                >
                  <Mail className="h-5 w-5" />
                  <div className="text-left w-full">
                    <p className="font-semibold text-sm">Connect Outlook</p>
                    <p className="text-xs text-muted-foreground">
                      Microsoft Graph · Mail.Read
                    </p>
                  </div>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                You'll be redirected to Google or Microsoft to grant access. We never see your password.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forwarding address */}
        <TabsContent value="forward" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Your private SuperNomad address
              </CardTitle>
              <CardDescription>
                Forward bookings to this address from any email account. Zero permissions needed, works on every platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {forwardAddress ? (
                <>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 font-mono text-sm">
                    <code className="flex-1 truncate">{forwardAddress}</code>
                    <Button size="sm" variant="ghost" onClick={copyAddress}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">How to use it:</p>
                    <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                      <li>Forward any flight, hotel, or car-rental confirmation to this address.</li>
                      <li>
                        Or set up an auto-forward filter:
                        Gmail → Settings → Filters → "from:airline OR from:booking" → Forward to.
                      </li>
                      <li>Within 60 seconds, the trip appears in your timeline.</li>
                    </ol>
                  </div>

                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href="https://support.google.com/mail/answer/10957"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Gmail forwarding guide
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </>
              ) : (
                <Alert>
                  <AlertTitle>Sign in required</AlertTitle>
                  <AlertDescription>
                    Create a SuperNomad account to claim your private inbox address.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {activePrompt && (
        <PermissionPrePrompt
          permissionId={activePrompt}
          open={!!activePrompt}
          onClose={() => setActivePrompt(null)}
          reason={`Import the last ${days} days of travel confirmations into your timeline`}
        />
      )}
    </div>
  );
};

export default TravelInboxImport;
