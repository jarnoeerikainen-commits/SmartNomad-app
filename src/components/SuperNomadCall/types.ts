export type CallLane = 'ai_concierge' | 'p2p' | 'pstn_outbound' | 'pstn_inbound' | 'group_sfu';
export type CallStatus =
  | 'queued' | 'ringing' | 'answered' | 'in_progress'
  | 'ended' | 'missed' | 'failed' | 'rejected' | 'no_answer' | 'voicemail';

export interface CallParty {
  kind: 'user' | 'ai_concierge' | 'demo_persona' | 'external_phone' | 'system';
  id: string;
  personaId?: string;
  userId?: string;
  deviceId?: string;
  phone?: string;
  displayName?: string;
}

export interface CallSession {
  id: string;
  lane: CallLane;
  call_kind: 'voice' | 'video' | 'message_only';
  caller_kind: string;
  caller_id: string;
  caller_persona_id: string | null;
  callee_kind: string;
  callee_id: string;
  callee_persona_id: string | null;
  callee_phone: string | null;
  status: CallStatus;
  initiated_at: string;
  answered_at: string | null;
  ended_at: string | null;
  duration_seconds: number;
  transcript: { role: string; text: string; t?: number }[];
  ai_summary: string | null;
  provider: string | null;
  cost_cents: number;
  cost_currency: string;
  billed_to: string | null;
  is_demo: boolean;
}

export interface ContactEntry {
  id: string;
  name: string;
  subtitle: string;
  avatar?: string;
  party: CallParty;
  lane: CallLane;
  defaultPermit: boolean;
}
