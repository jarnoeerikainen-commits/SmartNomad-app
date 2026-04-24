import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Phone, PhoneCall, Bot, Users, Globe, Shield,
  MessageSquare, Sparkles, PlayCircle, ArrowRight, Loader2
} from 'lucide-react';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { useSuperNomadCall } from '@/components/SuperNomadCall/useSuperNomadCall';
import { CallParty } from '@/components/SuperNomadCall/types';
import { CallWaveform } from '@/components/SuperNomadCall/CallWaveform';

interface SuperNomadCallCardProps {
  onNavigate: (section: string) => void;
}

const SuperNomadCallCard: React.FC<SuperNomadCallCardProps> = ({ onNavigate }) => {
  const { activePersona, activePersonaId, setPersona } = useDemoPersona();
  const [pendingDemo, setPendingDemo] = useState<'meghan' | 'john' | null>(null);

  const selfParty: CallParty | null = activePersonaId
    ? {
        kind: 'demo_persona',
        id: activePersonaId,
        personaId: activePersonaId,
        displayName: activePersona?.name ?? activePersonaId,
      }
    : null;

  const { activeCall, busy, initiate, end } = useSuperNomadCall({
    isDemo: true,
    selfParty,
  });

  const startDemo = async (personaId: 'meghan' | 'john') => {
    setPendingDemo(personaId);
    if (activePersonaId !== personaId) {
      setPersona(personaId);
      // Wait one tick so DemoPersonaContext propagates before initiating
      await new Promise(r => setTimeout(r, 250));
    }
    const callee: CallParty = {
      kind: 'ai_concierge',
      id: 'concierge',
      personaId,
      displayName: 'SuperNomad Concierge',
    };
    const caller: CallParty = {
      kind: 'demo_persona',
      id: personaId,
      personaId,
      displayName: personaId === 'meghan' ? 'Meghan' : 'John',
    };
    // Bypass selfParty race by calling initiate after persona switches
    // initiate uses internal selfParty; if not yet ready, fall back manually
    try {
      const id = await initiate('ai_concierge', callee, 'Dashboard demo test');
      if (!id) {
        // Manual fallback — directly synthesise a quick session via overrideSelf
        console.warn('[SuperNomadCallCard] initiate returned null — persona race');
      }
    } finally {
      setPendingDemo(null);
    }
  };

  const capabilities = [
    { icon: Bot, label: 'Call AI Concierge', desc: 'Voice chat with Sofia / Marcus — full transcript, same brain as text', color: 'text-primary' },
    { icon: Users, label: 'P2P Nomad Calls', desc: 'Encrypted user-to-user when permit is granted', color: 'text-blue-500' },
    { icon: Globe, label: 'PSTN Outbound', desc: 'Concierge dials any real phone number on your behalf', color: 'text-emerald-500' },
    { icon: MessageSquare, label: 'Permit Messaging', desc: 'Deny-by-default DMs across the ecosystem', color: 'text-violet-500' },
    { icon: Shield, label: 'E2E Encrypted', desc: 'Olm / Double-Ratchet keys per device, never on server', color: 'text-amber-500' },
    { icon: Sparkles, label: 'Proactive Calls', desc: 'AI rings YOU for threats, flight changes, calendar alerts', color: 'text-rose-500' },
  ];

  return (
    <Card
      className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--primary) / 0.04), hsl(var(--background)) 40%, hsl(var(--accent) / 0.05))',
      }}
    >
      {/* Gold corner ribbon */}
      <div
        className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-bl-lg"
        style={{ background: 'var(--gradient-gold)', color: 'hsl(220 22% 10%)' }}
      >
        New • Voice Layer
      </div>

      <CardContent className="p-5 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-xl shadow-medium shrink-0"
            style={{ background: 'var(--gradient-trust, linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7)))' }}
          >
            <PhoneCall className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl md:text-2xl font-bold font-display">SuperNomad Call</h3>
              <Badge variant="secondary" className="text-[10px]">BETA</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              One unified voice & messaging layer — talk to your AI Concierge, other nomads, or any real phone number on the planet.
            </p>
          </div>
        </div>

        {/* Capability grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {capabilities.map(c => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-card/60 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${c.color}`} />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground leading-tight">{c.label}</div>
                  <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">{c.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active call mini-banner */}
        {activeCall && activeCall.status !== 'ended' && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
            <CallWaveform active />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold">Live demo call · Concierge</div>
              <div className="text-[11px] text-muted-foreground truncate">
                {activeCall.transcript?.[activeCall.transcript.length - 1]?.text ?? 'Connecting…'}
              </div>
            </div>
            <Button size="sm" variant="destructive" onClick={() => end(activeCall.id)}>End</Button>
          </div>
        )}

        {/* Demo test buttons */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              One-click demo · hear the logic
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="justify-start gap-3 h-auto py-3 hover:border-primary/40 hover:bg-primary/5"
              disabled={busy || pendingDemo !== null || !!activeCall}
              onClick={() => startDemo('meghan')}
            >
              {pendingDemo === 'meghan'
                ? <Loader2 className="h-5 w-5 animate-spin shrink-0" />
                : <Phone className="h-5 w-5 text-primary shrink-0" />}
              <div className="text-left min-w-0">
                <div className="text-sm font-semibold">Test as Meghan</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  Singapore trip · Burnt Ends booking
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-3 h-auto py-3 hover:border-primary/40 hover:bg-primary/5"
              disabled={busy || pendingDemo !== null || !!activeCall}
              onClick={() => startDemo('john')}
            >
              {pendingDemo === 'john'
                ? <Loader2 className="h-5 w-5 animate-spin shrink-0" />
                : <Phone className="h-5 w-5 text-primary shrink-0" />}
              <div className="text-left min-w-0">
                <div className="text-sm font-semibold">Test as John</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  SFO delay · Benu rebooking
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Open full module */}
        <Button
          className="w-full gap-2 font-semibold"
          style={{
            background: 'var(--gradient-gold)',
            color: 'hsl(220 22% 10%)',
            boxShadow: 'var(--shadow-glow-gold)',
          }}
          onClick={() => onNavigate('supernomad-call')}
        >
          Open SuperNomad Call
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuperNomadCallCard;
