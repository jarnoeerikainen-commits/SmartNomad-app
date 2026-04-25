import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// ═══════════════════════════════════════════════════════════
// SuperNomad Call — unified call orchestration
// Lanes: ai_concierge | p2p | pstn_outbound | pstn_inbound | group_sfu
// ═══════════════════════════════════════════════════════════

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-id',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const TWILIO_API_KEY = Deno.env.get('TWILIO_API_KEY');
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const TWILIO_FROM = Deno.env.get('TWILIO_PHONE_NUMBER');

const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

type Party = { kind: string; id: string; personaId?: string; userId?: string; deviceId?: string; phone?: string };
type SignalType = 'offer' | 'answer' | 'ice' | 'hangup' | 'renegotiate';
type PresenceStatus = 'online' | 'busy' | 'offline';

interface CallRequest {
  action:
    | 'initiate' | 'answer' | 'reject' | 'end' | 'append_transcript' | 'send_message' | 'list_history'
    | 'heartbeat_presence' | 'send_signal' | 'list_signals' | 'mark_signal_consumed' | 'readiness';
  // initiate
  lane?: 'ai_concierge' | 'p2p' | 'pstn_outbound' | 'group_sfu';
  callKind?: 'voice' | 'video' | 'message_only';
  caller?: Party;
  callee?: Party;
  isDemo?: boolean;
  reason?: string;
  // shared
  callId?: string;
  // append_transcript
  transcriptChunk?: { role: string; text: string; t?: number };
  // send_message
  message?: { text: string; senderKind: string; senderId: string; recipientKind: string; recipientId: string };
  // list_history
  personaId?: string;
  userId?: string;
  limit?: number;
  // production readiness
  signalType?: SignalType;
  signalPayload?: Record<string, unknown>;
  recipientUserId?: string;
  signalId?: string;
  presence?: PresenceStatus;
  deviceId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body: CallRequest = await req.json();
    const auth = await getAuthContext(req);

    switch (body.action) {
      case 'initiate':       return json(await initiateCall(body, auth.userId));
      case 'answer':         return json(await answerCall(body.callId!, auth.userId));
      case 'reject':         return json(await rejectCall(body.callId!, auth.userId));
      case 'end':            return json(await endCall(body.callId!, auth.userId));
      case 'append_transcript': return json(await appendTranscript(body.callId!, body.transcriptChunk!));
      case 'send_message':   return json(await sendMessage(body));
      case 'list_history':   return json(await listHistory(body, auth.userId));
      case 'heartbeat_presence': return json(await heartbeatPresence(body, auth.userId));
      case 'send_signal':    return json(await sendSignal(body, auth.userId));
      case 'list_signals':   return json(await listSignals(body, auth.userId));
      case 'mark_signal_consumed': return json(await markSignalConsumed(body, auth.userId));
      case 'readiness':      return json(await readiness());
      default:
        return json({ error: 'unknown_action' }, 400);
    }
  } catch (e) {
    console.error('supernomad-call error:', e);
    return json({ error: e instanceof Error ? e.message : 'unknown' }, 500);
  }
});

// ─── Initiate ─────────────────────────────────────────────
async function initiateCall(req: CallRequest, authUserId: string | null) {
  if (!req.caller || !req.callee || !req.lane) {
    throw new Error('Missing caller, callee, or lane');
  }

  const realCalling = await isRealCallingEnabled();
  if (!req.isDemo && !realCalling) {
    return { success: false, error: 'real_calling_disabled', message: 'Real calling is not enabled yet. Demo calls are still available.' };
  }

  if (!req.isDemo) {
    requireAuth(authUserId);
    if (req.caller.kind !== 'user' || req.caller.userId !== authUserId || req.caller.id !== authUserId) {
      return { success: false, error: 'caller_mismatch', message: 'Authenticated user must be the caller.' };
    }
    if (req.lane === 'p2p' && (!req.callee.userId || req.callee.kind !== 'user')) {
      return { success: false, error: 'callee_user_required', message: 'Real person-to-person calls require a logged-in user recipient.' };
    }
  }

  // Permission check (skip for demo)
  if (!req.isDemo) {
    const allowed = await checkPermission(req.caller, req.callee);
    if (!allowed) {
      return { success: false, error: 'no_permission', message: 'Recipient has not granted you permission to call.' };
    }
  }

  const session = {
    lane: req.lane,
    direction: 'outbound',
    call_kind: req.callKind ?? 'voice',
    caller_kind: req.caller.kind,
    caller_id: req.caller.id,
    caller_user_id: req.caller.userId ?? null,
    caller_device_id: req.caller.deviceId ?? null,
    caller_persona_id: req.caller.personaId ?? null,
    callee_kind: req.callee.kind,
    callee_id: req.callee.id,
    callee_user_id: req.callee.userId ?? null,
    callee_persona_id: req.callee.personaId ?? null,
    callee_phone: req.callee.phone ?? null,
    status: 'ringing',
    is_demo: !!req.isDemo,
    provider: req.lane === 'pstn_outbound' ? 'twilio' : (req.isDemo ? 'demo' : 'webrtc'),
    metadata: { reason: req.reason ?? null },
  };

  const { data, error } = await admin.from('call_sessions').insert(session).select().single();
  if (error) throw error;

  // Add participants
  await admin.from('call_participants').insert([
    {
      call_id: data.id, participant_kind: req.caller.kind, participant_id: req.caller.id,
      user_id: req.caller.userId ?? null, persona_id: req.caller.personaId ?? null,
      display_name: personaName(req.caller), state: 'joined', joined_at: new Date().toISOString(),
    },
    {
      call_id: data.id, participant_kind: req.callee.kind, participant_id: req.callee.id,
      user_id: req.callee.userId ?? null, persona_id: req.callee.personaId ?? null,
      display_name: personaName(req.callee), state: 'ringing',
    },
  ]);

  // Lane-specific bootstrap
  if (req.lane === 'pstn_outbound') {
    const tw = await placeTwilioCall(req.callee.phone!, req.isDemo);
    await admin.from('call_sessions').update({
      provider_call_sid: tw.callSid,
      status: tw.status,
      cost_cents: tw.costCents,
    }).eq('id', data.id);
    return { success: true, callId: data.id, lane: req.lane, provider: tw.provider, callSid: tw.callSid, status: tw.status };
  }

  if (req.lane === 'ai_concierge') {
    // Demo: pre-seed a polite opening line so the UI has something to show instantly
    const opening = openingLineFor(req.callee.personaId ?? 'guest');
    await admin.from('call_sessions').update({
      status: 'in_progress',
      answered_at: new Date().toISOString(),
      transcript: [{ role: 'ai', text: opening, t: 0 }],
    }).eq('id', data.id);
    return { success: true, callId: data.id, lane: req.lane, opening };
  }

  if (!req.isDemo && req.lane === 'p2p') {
    await setPresence(authUserId!, 'busy', req.caller.deviceId ?? null, data.id);
    return { success: true, callId: data.id, lane: req.lane, signaling: 'call_signals', stun: defaultIceServers() };
  }

  // p2p demo — preserve current behavior: session row only, no media stack.
  return { success: true, callId: data.id, lane: req.lane };
}

// ─── Answer / End ─────────────────────────────────────────
async function answerCall(callId: string, authUserId: string | null) {
  const call = await requireParticipant(callId, authUserId, { allowDemo: true });
  const { data, error } = await admin.from('call_sessions').update({
    status: call.is_demo ? 'answered' : 'in_progress', answered_at: new Date().toISOString(),
  }).eq('id', callId).select().single();
  if (error) throw error;
  await admin.from('call_participants').update({ state: 'joined', joined_at: new Date().toISOString() })
    .eq('call_id', callId).eq('state', 'ringing');
  if (authUserId) await setPresence(authUserId, 'busy', null, callId);
  return { success: true, call: data };
}

async function rejectCall(callId: string, authUserId: string | null) {
  await requireParticipant(callId, authUserId, { requireCallee: true, allowDemo: true });
  const { data, error } = await admin.from('call_sessions').update({
    status: 'rejected', ended_at: new Date().toISOString(), end_reason: 'rejected',
  }).eq('id', callId).select().single();
  if (error) throw error;
  if (authUserId) await setPresence(authUserId, 'online', null, null);
  return { success: true, call: data };
}

async function endCall(callId: string, authUserId: string | null) {
  await requireParticipant(callId, authUserId, { allowDemo: true });
  const { data: existing } = await admin.from('call_sessions').select('answered_at, initiated_at').eq('id', callId).single();
  const start = existing?.answered_at ?? existing?.initiated_at ?? new Date().toISOString();
  const duration = Math.max(0, Math.floor((Date.now() - new Date(start).getTime()) / 1000));
  const { data, error } = await admin.from('call_sessions').update({
    status: 'ended',
    ended_at: new Date().toISOString(),
    duration_seconds: duration,
  }).eq('id', callId).select().single();
  if (error) throw error;
  await admin.from('call_participants').update({ state: 'left', left_at: new Date().toISOString() })
    .eq('call_id', callId).is('left_at', null);
  if (authUserId) await setPresence(authUserId, 'online', null, null);
  return { success: true, call: data };
}

// ─── Transcript & Messages ────────────────────────────────
async function appendTranscript(callId: string, chunk: { role: string; text: string; t?: number }) {
  const { data: cur } = await admin.from('call_sessions').select('transcript').eq('id', callId).single();
  const transcript = Array.isArray(cur?.transcript) ? cur!.transcript : [];
  transcript.push({ ...chunk, t: chunk.t ?? Math.floor(Date.now() / 1000) });
  const { error } = await admin.from('call_sessions').update({ transcript }).eq('id', callId);
  if (error) throw error;
  return { success: true, length: transcript.length };
}

async function sendMessage(req: CallRequest) {
  if (!req.message) throw new Error('Missing message');
  const m = req.message;
  const conversationKey = [m.senderId, m.recipientId].sort().join(':');
  const { data, error } = await admin.from('call_messages').insert({
    call_id: req.callId ?? null,
    conversation_key: conversationKey,
    sender_kind: m.senderKind, sender_id: m.senderId,
    recipient_kind: m.recipientKind, recipient_id: m.recipientId,
    plaintext: m.text,           // demo only — production would store ciphertext
    message_type: 'text',
    is_demo: !!req.isDemo,
  }).select().single();
  if (error) throw error;
  return { success: true, message: data };
}

// ─── History ──────────────────────────────────────────────
async function listHistory(req: CallRequest) {
  let q = admin.from('call_sessions').select('*').order('initiated_at', { ascending: false }).limit(req.limit ?? 50);
  if (req.personaId) q = q.or(`caller_persona_id.eq.${req.personaId},callee_persona_id.eq.${req.personaId}`);
  else if (req.userId) q = q.or(`caller_user_id.eq.${req.userId},callee_user_id.eq.${req.userId}`);
  else if (req.isDemo) q = q.eq('is_demo', true);
  const { data, error } = await q;
  if (error) throw error;
  return { success: true, calls: data ?? [] };
}

// ─── Permission Check ─────────────────────────────────────
async function checkPermission(caller: any, callee: any): Promise<boolean> {
  if (callee.kind === 'ai_concierge') return true;       // AI is always reachable from owner
  if (callee.kind === 'external_phone') return true;     // PSTN — billed to caller
  const { data } = await admin.from('call_permissions').select('id')
    .eq('grantee_kind', caller.kind).eq('grantee_id', caller.id)
    .eq('status', 'active')
    .or(callee.userId ? `owner_user_id.eq.${callee.userId}` : `owner_persona_id.eq.${callee.personaId}`)
    .limit(1);
  return !!(data && data.length);
}

// ─── Twilio bridge ────────────────────────────────────────
async function placeTwilioCall(toPhone: string, isDemo?: boolean) {
  if (isDemo || !TWILIO_API_KEY || !LOVABLE_API_KEY || !TWILIO_FROM) {
    return { provider: 'demo', callSid: `demo-${Date.now()}`, status: 'in_progress', costCents: 0 };
  }
  const GATEWAY = 'https://connector-gateway.lovable.dev/twilio';
  const res = await fetch(`${GATEWAY}/Calls.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': TWILIO_API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: toPhone, From: TWILIO_FROM, Url: 'http://demo.twilio.com/docs/voice.xml' }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Twilio call failed [${res.status}]: ${JSON.stringify(j)}`);
  return { provider: 'twilio', callSid: j.sid, status: j.status ?? 'queued', costCents: 2 };
}

// ─── Helpers ──────────────────────────────────────────────
function personaName(p: any): string {
  if (p.kind === 'ai_concierge') return 'SuperNomad Concierge';
  if (p.personaId === 'meghan') return 'Meghan Clarke';
  if (p.personaId === 'john') return 'John Sterling';
  if (p.kind === 'external_phone') return p.phone ?? 'External';
  return p.id;
}

function openingLineFor(personaId: string): string {
  const lines: Record<string, string> = {
    meghan: "Good morning Meghan — what can I do for you?",
    john:   "Hi John — I'm here. What's on your mind?",
    guest:  "Hello — SuperNomad Concierge here. How can I help?",
  };
  return lines[personaId] ?? lines.guest;
}

function json(payload: any, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
