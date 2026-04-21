import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Shield, Clock, ExternalLink } from 'lucide-react';
import { ConsentService, ConsentPurpose } from '@/services/ConsentService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PurposeDef {
  key: ConsentPurpose;
  category: 'partner' | 'analytics' | 'marketing' | 'ai';
  title: string;
  description: string;
  legalText: string;
}

const CONSENT_TEXT_VERSION = 'v1.0-2026-04-21';

const PURPOSES: PurposeDef[] = [
  { key: 'partner_offers.insurance', category: 'partner', title: 'Insurance offers',
    description: 'Receive personalised quotes from vetted travel & expat insurers.',
    legalText: 'You allow SuperNomad to share your pseudonymous travel-frequency and destination signals with insurance partners so they can prepare relevant quotes. Your name, email and exact location are never shared.' },
  { key: 'partner_offers.relocation', category: 'partner', title: 'Relocation & immigration',
    description: 'Get matched with relocation firms and immigration lawyers.',
    legalText: 'Your country signals (current residency, planned destinations) are shared with relocation partners under your SuperNomad ID. Personal contact details are revealed only when you click "Get a quote".' },
  { key: 'partner_offers.banking', category: 'partner', title: 'Banking & fintech',
    description: 'Personalised offers from digital banks and fintechs.',
    legalText: 'Your country and income-bracket signals are shared pseudonymously with banking partners.' },
  { key: 'partner_offers.real_estate', category: 'partner', title: 'Real estate & Golden Visa',
    description: 'Property and residency-by-investment opportunities.',
    legalText: 'Your destination interests and budget tier are shared pseudonymously with real estate partners.' },
  { key: 'partner_offers.luxury', category: 'partner', title: 'Luxury services',
    description: 'Private aviation, clubs, security, concierge specialists.',
    legalText: 'Your luxury preference signals are shared pseudonymously with vetted luxury partners.' },
  { key: 'analytics.aggregate', category: 'analytics', title: 'Anonymous market insights',
    description: 'Help us publish anonymised reports about nomad trends.',
    legalText: 'Your data is aggregated with at least 5 other users (k-anonymity) before any external release. Cannot be re-identified.' },
  { key: 'analytics.research', category: 'analytics', title: 'Academic research',
    description: 'Pseudonymised data may be used by partner universities.',
    legalText: 'Your SuperNomad ID and behavioural signals may be shared with research institutions under data-processing agreements.' },
  { key: 'marketing.email', category: 'marketing', title: 'SuperNomad newsletter',
    description: 'Product updates, feature launches, monthly digest.',
    legalText: 'You agree to receive marketing emails from SuperNomad. Unsubscribe any time.' },
  { key: 'marketing.personalization', category: 'marketing', title: 'Personalised content',
    description: 'Tailor in-app suggestions to your interests.',
    legalText: 'SuperNomad uses your in-app behaviour to personalise feed, alerts and recommendations.' },
  { key: 'ai.profile_learning', category: 'ai', title: 'AI memory & learning',
    description: 'Let the Concierge remember durable facts about your preferences.',
    legalText: 'The Concierge AI distils durable facts (e.g. "prefers business class", "vegetarian") and stores them encrypted in your vault. You can erase any memory at any time.' },
];

const CATEGORY_LABEL: Record<PurposeDef['category'], string> = {
  partner: 'Partner offers',
  analytics: 'Analytics',
  marketing: 'Marketing',
  ai: 'AI personalisation',
};

const ConsentCenter: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [consents, setConsents] = useState<Record<string, { granted: boolean; createdAt: string }>>({});
  const [history, setHistory] = useState<Array<{ id: string; purpose: string; granted: boolean; created_at: string; consent_text_version: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setAuthed(!!user);
    if (user) {
      const [c, h] = await Promise.all([
        ConsentService.getMyConsents(),
        ConsentService.getMyHistory(50),
      ]);
      setConsents(c);
      setHistory(h as typeof history);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleToggle = async (purpose: PurposeDef, granted: boolean) => {
    setSaving(purpose.key);
    const hash = await ConsentService.hashText(purpose.legalText);
    const result = await ConsentService.record({
      purpose: purpose.key,
      granted,
      consentTextVersion: CONSENT_TEXT_VERSION,
      consentTextHash: hash,
      metadata: { ui_origin: 'consent_center' },
    });
    setSaving(null);
    if (result.ok) {
      toast({
        title: granted ? 'Consent granted' : 'Consent withdrawn',
        description: `${purpose.title} — recorded ${new Date().toLocaleString()}`,
      });
      await refresh();
    } else {
      toast({
        title: 'Could not save',
        description: result.error ?? 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  if (!authed && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Consent Center</CardTitle>
          <CardDescription>Sign in to manage your data-sharing preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The Consent Center records every data-sharing decision under GDPR Art. 7.
            Your choices are append-only, version-stamped, and revocable at any time.
          </p>
        </CardContent>
      </Card>
    );
  }

  const grouped = PURPOSES.reduce((acc, p) => {
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {} as Record<PurposeDef['category'], PurposeDef[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Consent Center</CardTitle>
          <CardDescription>
            Granular GDPR-compliant control over how your pseudonymous data is used. Toggle anything off at any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(Object.keys(grouped) as Array<PurposeDef['category']>).map((cat) => (
            <div key={cat} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {CATEGORY_LABEL[cat]}
              </h3>
              <div className="space-y-2">
                {grouped[cat].map((p) => {
                  const key = `${p.key}::global`;
                  const current = consents[key]?.granted ?? false;
                  return (
                    <div key={p.key} className="flex items-start justify-between p-3 rounded-lg border bg-card">
                      <div className="flex-1 mr-4">
                        <div className="font-medium text-sm">{p.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{p.description}</div>
                        {consents[key] && (
                          <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last updated {new Date(consents[key].createdAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <Switch
                        checked={current}
                        disabled={saving === p.key || loading}
                        onCheckedChange={(v) => handleToggle(p, v)}
                      />
                    </div>
                  );
                })}
              </div>
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Consent History</CardTitle>
          <CardDescription>Append-only audit trail. GDPR Art. 7 evidence of consent.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No decisions recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-xs p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <Badge variant={h.granted ? 'default' : 'secondary'} className="text-[10px]">
                        {h.granted ? 'Granted' : 'Withdrawn'}
                      </Badge>
                      <span className="font-mono">{h.purpose}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {new Date(h.created_at).toLocaleString()} · {h.consent_text_version}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentCenter;
