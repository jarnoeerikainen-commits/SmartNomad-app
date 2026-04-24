-- ═══════════════════════════════════════════════════════════
-- SuperNomad Call — unified calling system
-- AI ↔ User, User ↔ User, User ↔ PSTN (any real phone number)
-- ═══════════════════════════════════════════════════════════

-- ─── call_permissions (permit graph) ──────────────────────
CREATE TABLE IF NOT EXISTS public.call_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Who is being granted permission
  grantee_kind text NOT NULL CHECK (grantee_kind IN ('user','ai_concierge','demo_persona','phone','any')),
  grantee_id text NOT NULL,                       -- user uuid, persona id, E.164 phone, or '*'
  -- Who owns the permit (the person whose privacy is being controlled)
  owner_user_id uuid,
  owner_device_id text,
  owner_persona_id text,                          -- 'meghan' | 'john' for demo
  -- What is allowed
  can_call boolean NOT NULL DEFAULT true,
  can_message boolean NOT NULL DEFAULT true,
  can_video boolean NOT NULL DEFAULT false,
  -- Lifecycle
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','revoked','expired')),
  expires_at timestamptz,
  reason text,                                    -- why granted (e.g. "trip to Singapore Mar 2026")
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_permits_owner_user ON public.call_permissions(owner_user_id) WHERE owner_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_call_permits_owner_persona ON public.call_permissions(owner_persona_id) WHERE owner_persona_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_call_permits_grantee ON public.call_permissions(grantee_kind, grantee_id);
CREATE INDEX IF NOT EXISTS idx_call_permits_demo ON public.call_permissions(is_demo) WHERE is_demo = true;

-- ─── call_sessions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.call_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Lane & direction
  lane text NOT NULL CHECK (lane IN ('ai_concierge','p2p','pstn_outbound','pstn_inbound','group_sfu')),
  direction text NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound','outbound','internal')),
  call_kind text NOT NULL DEFAULT 'voice' CHECK (call_kind IN ('voice','video','message_only')),
  -- Caller
  caller_kind text NOT NULL CHECK (caller_kind IN ('user','ai_concierge','demo_persona','external_phone','system')),
  caller_id text NOT NULL,                        -- user uuid, persona id, E.164 phone, or 'concierge'
  caller_user_id uuid,                            -- redundant index for fast user lookup
  caller_device_id text,
  caller_persona_id text,
  -- Callee
  callee_kind text NOT NULL CHECK (callee_kind IN ('user','ai_concierge','demo_persona','external_phone','group')),
  callee_id text NOT NULL,
  callee_user_id uuid,
  callee_persona_id text,
  callee_phone text,
  -- Lifecycle
  status text NOT NULL DEFAULT 'ringing' CHECK (status IN (
    'queued','ringing','answered','in_progress','ended','missed','failed','rejected','no_answer','voicemail'
  )),
  end_reason text,
  initiated_at timestamptz NOT NULL DEFAULT now(),
  answered_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer NOT NULL DEFAULT 0,
  -- AI / transcript
  transcript jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{role, text, t}]
  ai_summary text,
  ai_actions jsonb NOT NULL DEFAULT '[]'::jsonb,  -- structured actions taken during call
  -- Telephony (Twilio)
  provider text,                                  -- 'twilio'|'demo'|'webrtc'
  provider_call_sid text,
  recording_url text,
  recording_consent boolean NOT NULL DEFAULT false,
  -- Cost (for the x402 / Stripe billing layer)
  cost_cents integer NOT NULL DEFAULT 0,
  cost_currency text NOT NULL DEFAULT 'USD',
  billed_to text,                                 -- 'user'|'wallet'|'concierge_credits'|'org'
  -- Demo flag — visible to anonymous visitors
  is_demo boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_sessions_caller_user ON public.call_sessions(caller_user_id) WHERE caller_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_call_sessions_callee_user ON public.call_sessions(callee_user_id) WHERE callee_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_call_sessions_personas ON public.call_sessions(caller_persona_id, callee_persona_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_status ON public.call_sessions(status, initiated_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_sessions_demo ON public.call_sessions(is_demo) WHERE is_demo = true;

-- ─── call_participants ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.call_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid NOT NULL REFERENCES public.call_sessions(id) ON DELETE CASCADE,
  participant_kind text NOT NULL CHECK (participant_kind IN ('user','ai_concierge','demo_persona','external_phone')),
  participant_id text NOT NULL,
  user_id uuid,
  persona_id text,
  display_name text,
  joined_at timestamptz,
  left_at timestamptz,
  state text NOT NULL DEFAULT 'invited' CHECK (state IN ('invited','ringing','joined','left','declined','timed_out')),
  is_muted boolean NOT NULL DEFAULT false,
  is_video_on boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_participants_call ON public.call_participants(call_id);
CREATE INDEX IF NOT EXISTS idx_call_participants_user ON public.call_participants(user_id) WHERE user_id IS NOT NULL;

-- ─── call_messages (in-call chat / transcript ciphertext) ─
CREATE TABLE IF NOT EXISTS public.call_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid REFERENCES public.call_sessions(id) ON DELETE CASCADE,
  -- Used for messages outside an active call (DMs)
  conversation_key text,                          -- deterministic key for sender↔receiver pair
  sender_kind text NOT NULL CHECK (sender_kind IN ('user','ai_concierge','demo_persona','external_phone','system')),
  sender_id text NOT NULL,
  sender_user_id uuid,
  sender_persona_id text,
  recipient_kind text NOT NULL,
  recipient_id text NOT NULL,
  recipient_user_id uuid,
  recipient_persona_id text,
  -- Payload — server stores ciphertext for real users; plaintext only for demo
  ciphertext text,
  plaintext text,                                 -- demo-only fallback
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text','transcript_chunk','system_event','ai_action')),
  is_demo boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_messages_call ON public.call_messages(call_id) WHERE call_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_call_messages_conversation ON public.call_messages(conversation_key, created_at DESC) WHERE conversation_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_call_messages_demo ON public.call_messages(is_demo) WHERE is_demo = true;

-- ─── e2e_identity_keys (per-device public identity) ───────
CREATE TABLE IF NOT EXISTS public.e2e_identity_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  device_id text NOT NULL,
  identity_key_public text NOT NULL,              -- base64 Curve25519 public key
  signed_prekey_public text NOT NULL,
  signed_prekey_signature text NOT NULL,
  one_time_prekeys jsonb NOT NULL DEFAULT '[]'::jsonb,  -- array of {id, key} — server hands out one per session
  algorithm text NOT NULL DEFAULT 'olm-curve25519-aes256',
  created_at timestamptz NOT NULL DEFAULT now(),
  rotated_at timestamptz,
  UNIQUE (device_id)
);

CREATE INDEX IF NOT EXISTS idx_e2e_keys_user ON public.e2e_identity_keys(user_id) WHERE user_id IS NOT NULL;

-- ═══════════════════════════════════════════════════════════
-- Triggers — updated_at
-- ═══════════════════════════════════════════════════════════
CREATE TRIGGER tg_call_permissions_updated_at
  BEFORE UPDATE ON public.call_permissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER tg_call_sessions_updated_at
  BEFORE UPDATE ON public.call_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ═══════════════════════════════════════════════════════════
-- RLS
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.call_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.e2e_identity_keys ENABLE ROW LEVEL SECURITY;

-- ─── call_permissions ─────────────────────────────────────
CREATE POLICY "anyone reads demo permits"
  ON public.call_permissions FOR SELECT TO anon, authenticated
  USING (is_demo = true);

CREATE POLICY "users read their permits"
  ON public.call_permissions FOR SELECT TO authenticated
  USING (
    owner_user_id = auth.uid()
    OR (grantee_kind = 'user' AND grantee_id = auth.uid()::text)
  );

CREATE POLICY "users write their permits"
  ON public.call_permissions FOR INSERT TO authenticated
  WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "users update their permits"
  ON public.call_permissions FOR UPDATE TO authenticated
  USING (owner_user_id = auth.uid());

CREATE POLICY "anon writes demo permits"
  ON public.call_permissions FOR INSERT TO anon, authenticated
  WITH CHECK (is_demo = true);

-- ─── call_sessions ────────────────────────────────────────
CREATE POLICY "anyone reads demo calls"
  ON public.call_sessions FOR SELECT TO anon, authenticated
  USING (is_demo = true);

CREATE POLICY "users read their calls"
  ON public.call_sessions FOR SELECT TO authenticated
  USING (caller_user_id = auth.uid() OR callee_user_id = auth.uid());

CREATE POLICY "anyone creates demo calls"
  ON public.call_sessions FOR INSERT TO anon, authenticated
  WITH CHECK (is_demo = true);

CREATE POLICY "users create their calls"
  ON public.call_sessions FOR INSERT TO authenticated
  WITH CHECK (caller_user_id = auth.uid());

CREATE POLICY "anyone updates demo calls"
  ON public.call_sessions FOR UPDATE TO anon, authenticated
  USING (is_demo = true);

CREATE POLICY "users update their calls"
  ON public.call_sessions FOR UPDATE TO authenticated
  USING (caller_user_id = auth.uid() OR callee_user_id = auth.uid());

-- ─── call_participants ────────────────────────────────────
CREATE POLICY "anyone reads demo participants"
  ON public.call_participants FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.call_sessions s WHERE s.id = call_id AND s.is_demo = true));

CREATE POLICY "users read participants of their calls"
  ON public.call_participants FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.call_sessions s WHERE s.id = call_id
               AND (s.caller_user_id = auth.uid() OR s.callee_user_id = auth.uid()))
  );

CREATE POLICY "anyone writes demo participants"
  ON public.call_participants FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.call_sessions s WHERE s.id = call_id AND s.is_demo = true));

CREATE POLICY "users write participants for their calls"
  ON public.call_participants FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.call_sessions s WHERE s.id = call_id
            AND (s.caller_user_id = auth.uid() OR s.callee_user_id = auth.uid()))
  );

CREATE POLICY "anyone updates demo participants"
  ON public.call_participants FOR UPDATE TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.call_sessions s WHERE s.id = call_id AND s.is_demo = true));

-- ─── call_messages ────────────────────────────────────────
CREATE POLICY "anyone reads demo messages"
  ON public.call_messages FOR SELECT TO anon, authenticated
  USING (is_demo = true);

CREATE POLICY "users read their messages"
  ON public.call_messages FOR SELECT TO authenticated
  USING (sender_user_id = auth.uid() OR recipient_user_id = auth.uid());

CREATE POLICY "anyone writes demo messages"
  ON public.call_messages FOR INSERT TO anon, authenticated
  WITH CHECK (is_demo = true);

CREATE POLICY "users write their messages"
  ON public.call_messages FOR INSERT TO authenticated
  WITH CHECK (sender_user_id = auth.uid());

-- ─── e2e_identity_keys ────────────────────────────────────
-- Public keys are intentionally readable by everyone (needed for handshake)
CREATE POLICY "anyone reads identity keys"
  ON public.e2e_identity_keys FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "users write their own identity keys"
  ON public.e2e_identity_keys FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "users update their own identity keys"
  ON public.e2e_identity_keys FOR UPDATE TO authenticated
  USING (user_id = auth.uid());