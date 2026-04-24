import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CallParty, CallLane, CallSession } from './types';

interface UseSuperNomadCallOpts {
  isDemo: boolean;
  selfParty: CallParty | null;
}

export function useSuperNomadCall({ isDemo, selfParty }: UseSuperNomadCallOpts) {
  const [history, setHistory] = useState<CallSession[]>([]);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [busy, setBusy] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const tickRef = useRef<number | null>(null);
  const aiSimRef = useRef<number | null>(null);

  const refreshHistory = useCallback(async () => {
    try {
      const payload: Record<string, unknown> = { action: 'list_history', limit: 30, isDemo };
      if (isDemo) {
        payload.isDemo = true;
      } else if (selfParty?.userId) {
        payload.userId = selfParty.userId;
      } else if (selfParty?.personaId) {
        payload.personaId = selfParty.personaId;
      }
      const { data, error } = await supabase.functions.invoke('supernomad-call', { body: payload });
      if (error) throw error;
      setHistory((data?.calls as CallSession[]) ?? []);
    } catch (e) {
      console.warn('[supernomad-call] history failed', e);
    }
  }, [isDemo, selfParty?.userId, selfParty?.personaId]);

  useEffect(() => { refreshHistory(); }, [refreshHistory]);

  // Live timer for active call duration
  useEffect(() => {
    if (!activeCall || activeCall.status === 'ended') {
      if (tickRef.current) window.clearInterval(tickRef.current);
      return;
    }
    tickRef.current = window.setInterval(() => {
      setActiveCall(c => c ? { ...c, duration_seconds: c.duration_seconds + 1 } : c);
    }, 1000);
    return () => { if (tickRef.current) window.clearInterval(tickRef.current); };
  }, [activeCall?.id, activeCall?.status]);

  const initiate = useCallback(async (lane: CallLane, callee: CallParty, reason?: string) => {
    if (!selfParty) {
      setLastError('No active caller — pick a demo persona or sign in');
      return null;
    }
    setBusy(true); setLastError(null);
    try {
      const { data, error } = await supabase.functions.invoke('supernomad-call', {
        body: {
          action: 'initiate',
          lane,
          callKind: 'voice',
          caller: selfParty,
          callee,
          isDemo,
          reason,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.message || data?.error || 'Call failed');

      // Hydrate the session row
      const { data: row } = await supabase.from('call_sessions').select('*').eq('id', data.callId).single();
      if (row) {
        setActiveCall(row as CallSession);
        if (lane === 'ai_concierge') startAiSimulation(row.id, callee);
      }
      return data.callId as string;
    } catch (e) {
      setLastError(e instanceof Error ? e.message : 'Call failed');
      return null;
    } finally {
      setBusy(false);
    }
  }, [isDemo, selfParty]);

  const end = useCallback(async (callId: string) => {
    if (aiSimRef.current) { window.clearTimeout(aiSimRef.current); aiSimRef.current = null; }
    try {
      await supabase.functions.invoke('supernomad-call', { body: { action: 'end', callId } });
    } catch (e) { console.warn('end failed', e); }
    setActiveCall(c => c && c.id === callId ? { ...c, status: 'ended', ended_at: new Date().toISOString() } : c);
    setTimeout(() => { setActiveCall(null); refreshHistory(); }, 1200);
  }, [refreshHistory]);

  // ─── AI concierge demo simulator ──────────────────────────
  // Plays a short, persona-aware conversation so the demo feels alive.
  const startAiSimulation = useCallback((callId: string, callee: CallParty) => {
    const persona = callee.personaId ?? 'guest';
    const lines = SIM_SCRIPTS[persona] ?? SIM_SCRIPTS.guest;
    let idx = 0;
    const playNext = () => {
      if (idx >= lines.length) return;
      const chunk = lines[idx++];
      supabase.functions.invoke('supernomad-call', {
        body: { action: 'append_transcript', callId, transcriptChunk: chunk },
      }).catch(() => {});
      setActiveCall(c => c && c.id === callId
        ? { ...c, transcript: [...(c.transcript ?? []), chunk], status: 'in_progress' }
        : c);
      aiSimRef.current = window.setTimeout(playNext, 2400 + Math.random() * 1500);
    };
    aiSimRef.current = window.setTimeout(playNext, 900);
  }, []);

  return { history, activeCall, busy, lastError, initiate, end, refreshHistory, setActiveCall };
}

const SIM_SCRIPTS: Record<string, { role: string; text: string }[]> = {
  meghan: [
    { role: 'ai',   text: "Good morning Meghan — your Singapore trip is coming up. I noticed Burnt Ends has just released March tables. Want me to book your usual window seat?" },
    { role: 'user', text: "Yes please, March 3rd at 8 PM." },
    { role: 'ai',   text: "Booked. Confirmation BE-7K2X9. I also pre-checked you into SQ12, seat 11A upper deck, and reserved the No1 Lounge — shorter queue than BA Galleries today." },
    { role: 'user', text: "Perfect. What about the Brand Summit in New York?" },
    { role: 'ai',   text: "All confirmed. Four Seasons Downtown, suite upgrade applied via Preferred Partner status. Black car booked for JFK arrival." },
  ],
  john: [
    { role: 'ai',   text: "Hi John — quick heads up: SQ12 to SFO tomorrow has a 40-minute delay. I've already rebooked your United connection in SFO with a 90-min buffer." },
    { role: 'user', text: "Smart. What about the board dinner?" },
    { role: 'ai',   text: "Benu confirmed for 7:30 PM, table for 6. Polaris lounge access pre-loaded to your wallet, and your ride is set with Wingz — driver speaks Mandarin per your usual preference." },
    { role: 'user', text: "Triathlon kit on the Bintan trip?" },
    { role: 'ai',   text: "Already coordinated with the W Hotel concierge — bike service confirmed, race pack pickup arranged. I'll call you 24 hours before with a final brief." },
  ],
  guest: [
    { role: 'ai',   text: "Hello — SuperNomad Concierge here. How can I help you today?" },
    { role: 'user', text: "Just exploring the demo." },
    { role: 'ai',   text: "Of course. I can call restaurants, hotels, embassies, or any phone number on your behalf — and I keep a full transcript so nothing gets lost." },
  ],
};
