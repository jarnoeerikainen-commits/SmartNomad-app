import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Phone, PhoneOff, PhoneIncoming, PhoneOutgoing, Sparkles, User, Globe2,
  Mic, MicOff, Volume2, ShieldCheck, Clock, Trash2, MessageSquare,
} from 'lucide-react';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { useSuperNomadCall } from './useSuperNomadCall';
import { CallWaveform } from './CallWaveform';
import { cancelSpeech } from './speech';
import { CallParty, CallLane, ContactEntry } from './types';
import { formatDistanceToNow } from 'date-fns';

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
};

const SuperNomadCall: React.FC = () => {
  const { activePersona, activePersonaId, isDemo } = useDemoPersona();
  const [tab, setTab] = useState<'concierge' | 'people' | 'phone' | 'history' | 'permits'>('concierge');
  const [dialNumber, setDialNumber] = useState('');
  const [dialReason, setDialReason] = useState('');

  // Caller identity — demo persona, or guest fallback
  const selfParty: CallParty | null = useMemo(() => {
    if (activePersonaId && activePersona) {
      return {
        kind: 'demo_persona',
        id: activePersonaId,
        personaId: activePersonaId,
        displayName: `${activePersona.profile.firstName} ${activePersona.profile.lastName}`,
      };
    }
    return { kind: 'user', id: 'guest', displayName: 'Guest' };
  }, [activePersona, activePersonaId]);

  const useDemoLane = !activePersonaId ? true : isDemo;

  const { history, activeCall, busy, lastError, initiate, end } = useSuperNomadCall({
    isDemo: useDemoLane,
    selfParty,
  });

  // ─── Contacts / quick targets ──────────────────────────────
  const contacts: ContactEntry[] = useMemo(() => {
    const list: ContactEntry[] = [
      {
        id: 'concierge',
        name: 'SuperNomad Concierge',
        subtitle: 'Always available · AI · transcribed',
        party: { kind: 'ai_concierge', id: 'concierge', displayName: 'SuperNomad Concierge' },
        lane: 'ai_concierge',
        defaultPermit: true,
      },
    ];
    // Demo persona ↔ persona contacts
    if (activePersonaId === 'meghan') {
      list.push({
        id: 'john',
        name: 'John Mitchell',
        subtitle: 'Trusted contact · VP Engineering · Singapore',
        party: { kind: 'demo_persona', id: 'john', personaId: 'john', displayName: 'John Mitchell' },
        lane: 'p2p',
        defaultPermit: true,
      });
    }
    if (activePersonaId === 'john') {
      list.push({
        id: 'meghan',
        name: 'Meghan Clarke',
        subtitle: 'Trusted contact · Marketing Director · London',
        party: { kind: 'demo_persona', id: 'meghan', personaId: 'meghan', displayName: 'Meghan Clarke' },
        lane: 'p2p',
        defaultPermit: true,
      });
    }
    return list;
  }, [activePersonaId]);

  // ─── Action handlers ───────────────────────────────────────
  const handleCallContact = (c: ContactEntry) => initiate(c.lane, c.party, 'Quick call from contacts');

  const handleDialPhone = () => {
    if (!dialNumber.trim()) return;
    const phone = dialNumber.trim().startsWith('+') ? dialNumber.trim() : `+${dialNumber.trim()}`;
    initiate('pstn_outbound', {
      kind: 'external_phone',
      id: phone,
      phone,
      displayName: phone,
    }, dialReason || 'Outbound call from SuperNomad');
    setDialNumber(''); setDialReason('');
  };

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-4 p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Phone className="h-6 w-6 text-primary" />
            SuperNomad Call
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            One unified line for your AI Concierge, trusted contacts, and any phone in the world. End-to-end private. Permission-gated.
          </p>
        </div>
        <Badge variant={useDemoLane ? 'secondary' : 'default'} className="flex-shrink-0">
          {useDemoLane ? 'Demo mode' : 'Live'}
        </Badge>
      </div>

      {/* ─── Active call panel ───────────────────────────── */}
      {activeCall && <ActiveCallPanel call={activeCall} onEnd={() => end(activeCall.id)} />}

      {lastError && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-3 text-sm text-destructive">{lastError}</CardContent>
        </Card>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="concierge"><Sparkles className="h-4 w-4 mr-1 hidden md:inline" />Concierge</TabsTrigger>
          <TabsTrigger value="people"><User className="h-4 w-4 mr-1 hidden md:inline" />People</TabsTrigger>
          <TabsTrigger value="phone"><Globe2 className="h-4 w-4 mr-1 hidden md:inline" />Any Number</TabsTrigger>
          <TabsTrigger value="history"><Clock className="h-4 w-4 mr-1 hidden md:inline" />History</TabsTrigger>
          <TabsTrigger value="permits"><ShieldCheck className="h-4 w-4 mr-1 hidden md:inline" />Permits</TabsTrigger>
        </TabsList>

        {/* CONCIERGE */}
        <TabsContent value="concierge">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Talk to the Concierge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                The Concierge can call you, you can call it, or it can call any service on your behalf — same memory, same transcript, same brain as the chat.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button size="lg" disabled={busy} onClick={() => initiate('ai_concierge', contacts[0].party)}>
                  <PhoneOutgoing className="h-4 w-4 mr-2" /> Call Concierge now
                </Button>
                <Button size="lg" variant="outline" disabled={busy}
                  onClick={() => initiate('ai_concierge', contacts[0].party, 'Concierge calling user — proactive check-in')}>
                  <PhoneIncoming className="h-4 w-4 mr-2" /> Have Concierge call me
                </Button>
              </div>
              <div className="text-xs text-muted-foreground border-t pt-3">
                Examples it can handle on a call: <em>"book Burnt Ends for 8 PM"</em>, <em>"reschedule my JFK pickup"</em>, <em>"call the Four Seasons and request a high-floor room"</em>.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PEOPLE */}
        <TabsContent value="people">
          <Card>
            <CardHeader><CardTitle className="text-base">Trusted contacts</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {contacts.length === 1 && (
                <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/30">
                  Switch to Meghan or John (header → demo persona) to see person-to-person calling between two SuperNomad members.
                </p>
              )}
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 p-3 border rounded-lg hover:bg-accent/30 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      {c.lane === 'ai_concierge' ? <Sparkles className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{c.subtitle}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="outline" disabled={busy}
                      onClick={() => initiate('ai_concierge', { ...c.party, kind: 'ai_concierge', id: 'concierge' }, `Send message via concierge to ${c.name}`)}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" disabled={busy} onClick={() => handleCallContact(c)}>
                      <Phone className="h-4 w-4 mr-1" /> Call
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PHONE */}
        <TabsContent value="phone">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-primary" /> Call any number worldwide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Routed through Twilio. Costs a few cents per minute — billed to your wallet (x402 / Stripe). The Concierge can also place this call <em>for you</em>: dictate the request and it'll handle the conversation.
              </p>
              <div className="grid gap-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone number</label>
                <Input placeholder="+1 415 555 0123" value={dialNumber} onChange={(e) => setDialNumber(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Reason (optional — concierge brief)</label>
                <Input placeholder="e.g. Reserve table for 4 at 8 PM, window seat" value={dialReason} onChange={(e) => setDialReason(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button disabled={!dialNumber.trim() || busy} onClick={handleDialPhone} className="flex-1">
                  <PhoneOutgoing className="h-4 w-4 mr-2" /> Dial directly
                </Button>
                <Button variant="outline" disabled={!dialNumber.trim() || busy} className="flex-1"
                  onClick={() => {
                    const phone = dialNumber.trim().startsWith('+') ? dialNumber.trim() : `+${dialNumber.trim()}`;
                    initiate('ai_concierge', contacts[0].party, `Call ${phone}: ${dialReason || 'on my behalf'}`);
                  }}>
                  <Sparkles className="h-4 w-4 mr-2" /> Have Concierge call
                </Button>
              </div>
              <div className="text-xs text-muted-foreground border-t pt-3">
                💡 Future: x402 micropayments for per-call billing. Today: pre-paid wallet credits or Stripe card-on-file.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle className="text-base">Recent calls</CardTitle></CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[420px]">
                <div className="divide-y">
                  {history.length === 0 && (
                    <p className="p-6 text-sm text-muted-foreground text-center">No calls yet — try calling the Concierge above.</p>
                  )}
                  {history.map((h) => (
                    <CallRow key={h.id} call={h} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PERMITS */}
        <TabsContent value="permits">
          <Card>
            <CardHeader><CardTitle className="text-base">Who can call you</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Default: nobody can reach you cold. The Concierge always can (you control it). You grant other people permits — temporary or permanent — and revoke any time.
              </p>
              <div className="space-y-2">
                <PermitRow name="SuperNomad Concierge" reason="Default — your AI concierge" status="active" />
                {activePersonaId === 'meghan' && (
                  <PermitRow name="John Mitchell" reason="Trusted contact — fellow SuperNomad" status="active" />
                )}
                {activePersonaId === 'john' && (
                  <PermitRow name="Meghan Clarke" reason="Trusted contact — fellow SuperNomad" status="active" />
                )}
                <PermitRow name="Everyone else" reason="Blocked by default" status="blocked" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────
const ActiveCallPanel: React.FC<{ call: any; onEnd: () => void }> = ({ call, onEnd }) => {
  const [muted, setMuted] = useState(false);
  const inProgress = call.status === 'in_progress' || call.status === 'answered' || call.status === 'ringing';
  const counterparty =
    call.callee_persona_id === 'meghan' ? 'Meghan Clarke' :
    call.callee_persona_id === 'john'   ? 'John Mitchell' :
    call.callee_kind === 'ai_concierge' ? 'SuperNomad Concierge' :
    call.callee_kind === 'external_phone' ? (call.callee_phone || 'External number') :
    'Recipient';
  const transcript = Array.isArray(call.transcript) ? call.transcript : [];

  return (
    <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              {call.callee_kind === 'ai_concierge' ? <Sparkles className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">{counterparty}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {call.lane.replace('_', ' ')} · {call.status} · {fmtTime(call.duration_seconds)}
              </div>
            </div>
          </div>
          <Badge variant={inProgress ? 'default' : 'secondary'} className="animate-pulse">
            {inProgress ? 'LIVE' : call.status}
          </Badge>
        </div>

        <CallWaveform active={inProgress} />

        <ScrollArea className="h-32 rounded-md border bg-background/60 p-2">
          <div className="space-y-1.5">
            {transcript.length === 0 && <p className="text-xs text-muted-foreground italic">Connecting…</p>}
            {transcript.map((t: any, i: number) => (
              <div key={i} className="text-xs">
                <span className="font-semibold text-primary">{t.role === 'ai' ? 'Concierge' : t.role === 'user' ? 'You' : t.role}: </span>
                <span className="text-foreground/80">{t.text}</span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 justify-center pt-1">
          <Button
            size="sm"
            variant={muted ? 'default' : 'outline'}
            onClick={() => {
              setMuted(m => {
                const next = !m;
                if (next) cancelSpeech();
                return next;
              });
            }}
            title={muted ? 'Unmute concierge audio' : 'Mute concierge audio'}
          >
            {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="outline"><Volume2 className="h-4 w-4" /></Button>
          <Button size="sm" variant="destructive" onClick={onEnd}>
            <PhoneOff className="h-4 w-4 mr-1" /> End call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CallRow: React.FC<{ call: any }> = ({ call }) => {
  const counterparty =
    call.callee_persona_id === 'meghan' ? 'Meghan Clarke' :
    call.callee_persona_id === 'john'   ? 'John Mitchell' :
    call.callee_kind === 'ai_concierge' ? 'SuperNomad Concierge' :
    call.callee_kind === 'external_phone' ? (call.callee_phone || 'External') :
    call.caller_persona_id === 'meghan' ? 'Meghan Clarke (incoming)' :
    call.caller_persona_id === 'john'   ? 'John Mitchell (incoming)' :
    'Call';
  const Icon = call.caller_kind === 'ai_concierge' ? Sparkles : (call.lane === 'pstn_outbound' ? Globe2 : Phone);
  return (
    <div className="p-3 hover:bg-accent/30 transition">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Icon className="h-4 w-4 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{counterparty}</div>
            <div className="text-xs text-muted-foreground">
              {call.lane.replace('_', ' ')} · {fmtTime(call.duration_seconds)} ·{' '}
              {formatDistanceToNow(new Date(call.initiated_at), { addSuffix: true })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {call.cost_cents > 0 && <Badge variant="outline" className="text-xs">${(call.cost_cents / 100).toFixed(2)}</Badge>}
          <Badge variant={call.status === 'ended' ? 'secondary' : 'default'} className="text-xs">{call.status}</Badge>
        </div>
      </div>
      {call.ai_summary && (
        <p className="text-xs text-muted-foreground mt-2 pl-7 italic">"{call.ai_summary}"</p>
      )}
    </div>
  );
};

const PermitRow: React.FC<{ name: string; reason: string; status: 'active' | 'blocked' }> = ({ name, reason, status }) => (
  <div className="flex items-center justify-between gap-3 p-3 border rounded-lg">
    <div className="min-w-0">
      <div className="text-sm font-medium truncate">{name}</div>
      <div className="text-xs text-muted-foreground truncate">{reason}</div>
    </div>
    <div className="flex items-center gap-2">
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status === 'active' ? 'Can call' : 'Blocked'}
      </Badge>
      {status === 'active' && name !== 'SuperNomad Concierge' && (
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  </div>
);

export default SuperNomadCall;
