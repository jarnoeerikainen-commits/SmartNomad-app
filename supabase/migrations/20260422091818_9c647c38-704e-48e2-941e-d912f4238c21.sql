
-- Helper that resolves staff role membership via text (safe even when enum values
-- were added in a prior committed migration but not yet usable as literals here).
CREATE OR REPLACE FUNCTION public.has_staff_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text IN ('admin','support','affiliate_manager')
  );
$$;

CREATE OR REPLACE FUNCTION public.has_admin_or_support(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text IN ('admin','support')
  );
$$;

-- ---------------------------------------------------------------------------
-- 1. SUPPORT TICKETS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number   bigint GENERATED ALWAYS AS IDENTITY,
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  device_id       text,
  requester_email text,
  requester_name  text,
  subject         text NOT NULL,
  description     text NOT NULL,
  category        text NOT NULL DEFAULT 'general',
  priority        text NOT NULL DEFAULT 'normal',
  status          text NOT NULL DEFAULT 'open',
  source          text NOT NULL DEFAULT 'app',
  assigned_to     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tags            text[] NOT NULL DEFAULT '{}',
  satisfaction_rating int CHECK (satisfaction_rating BETWEEN 1 AND 5),
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  resolved_at     timestamptz,
  closed_at       timestamptz,
  CONSTRAINT support_ticket_owner_chk
    CHECK (user_id IS NOT NULL OR device_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user      ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_device    ON public.support_tickets(device_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status    ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned  ON public.support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority  ON public.support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created   ON public.support_tickets(created_at DESC);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.tg_support_tickets_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status = 'resolved' AND OLD.status IS DISTINCT FROM 'resolved' THEN
    NEW.resolved_at = now();
  END IF;
  IF NEW.status = 'closed' AND OLD.status IS DISTINCT FROM 'closed' THEN
    NEW.closed_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION public.tg_support_tickets_updated_at();

CREATE POLICY "Users read own tickets"
  ON public.support_tickets FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Guests read tickets by device"
  ON public.support_tickets FOR SELECT TO anon
  USING (device_id IS NOT NULL AND device_id = public.get_request_device_id());

CREATE POLICY "Users create own tickets"
  ON public.support_tickets FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Guests create tickets by device"
  ON public.support_tickets FOR INSERT TO anon
  WITH CHECK (device_id IS NOT NULL AND device_id = public.get_request_device_id());

CREATE POLICY "Users update own open tickets"
  ON public.support_tickets FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status IN ('open','pending'))
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff read all tickets"
  ON public.support_tickets FOR SELECT TO authenticated
  USING (public.has_staff_role(auth.uid()));

CREATE POLICY "Staff update all tickets"
  ON public.support_tickets FOR UPDATE TO authenticated
  USING (public.has_admin_or_support(auth.uid()))
  WITH CHECK (public.has_admin_or_support(auth.uid()));

CREATE POLICY "Service role manages tickets"
  ON public.support_tickets FOR ALL TO service_role
  USING (true) WITH CHECK (true);


-- ---------------------------------------------------------------------------
-- 2. SUPPORT TICKET MESSAGES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id    uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  author_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_role  text NOT NULL DEFAULT 'customer',
  body         text NOT NULL,
  is_internal  boolean NOT NULL DEFAULT false,
  attachments  jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ticket_msgs_ticket
  ON public.support_ticket_messages(ticket_id, created_at);

ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers read own non-internal messages"
  ON public.support_ticket_messages FOR SELECT TO authenticated
  USING (
    is_internal = false
    AND EXISTS (
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = ticket_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers reply to own tickets"
  ON public.support_ticket_messages FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND author_role = 'customer'
    AND is_internal = false
    AND EXISTS (
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = ticket_id AND t.user_id = auth.uid()
        AND t.status IN ('open','pending')
    )
  );

CREATE POLICY "Staff read all ticket messages"
  ON public.support_ticket_messages FOR SELECT TO authenticated
  USING (public.has_staff_role(auth.uid()));

CREATE POLICY "Staff post ticket messages"
  ON public.support_ticket_messages FOR INSERT TO authenticated
  WITH CHECK (
    public.has_admin_or_support(auth.uid())
    AND author_id = auth.uid()
  );

CREATE POLICY "Service role manages ticket messages"
  ON public.support_ticket_messages FOR ALL TO service_role
  USING (true) WITH CHECK (true);


-- ---------------------------------------------------------------------------
-- 3. STAFF AUDIT LOG (append-only)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_audit_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role   text,
  action       text NOT NULL,
  target_type  text,
  target_id    text,
  before_state jsonb,
  after_state  jsonb,
  ip_address   text,
  user_agent   text,
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_audit_actor   ON public.staff_audit_log(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_audit_action  ON public.staff_audit_log(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_audit_target  ON public.staff_audit_log(target_type, target_id);

ALTER TABLE public.staff_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read staff audit log"
  ON public.staff_audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Service role inserts audit"
  ON public.staff_audit_log FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Authenticated staff insert own audit rows"
  ON public.staff_audit_log FOR INSERT TO authenticated
  WITH CHECK (
    actor_id = auth.uid()
    AND public.has_staff_role(auth.uid())
  );

CREATE OR REPLACE FUNCTION public.log_staff_action(
  p_action text,
  p_target_type text DEFAULT NULL,
  p_target_id text DEFAULT NULL,
  p_before jsonb DEFAULT NULL,
  p_after jsonb DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_id uuid;
  v_role text;
BEGIN
  SELECT role::text INTO v_role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY CASE role::text
    WHEN 'admin' THEN 1
    WHEN 'support' THEN 2
    WHEN 'affiliate_manager' THEN 3
    ELSE 9 END
  LIMIT 1;

  INSERT INTO public.staff_audit_log
    (actor_id, actor_role, action, target_type, target_id, before_state, after_state, metadata)
  VALUES
    (auth.uid(), v_role, p_action, p_target_type, p_target_id, p_before, p_after, COALESCE(p_metadata, '{}'::jsonb))
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;


-- ---------------------------------------------------------------------------
-- 4. STAFF INVITES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_invites (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text NOT NULL,
  role         public.app_role NOT NULL,
  invited_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  token        text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status       text NOT NULL DEFAULT 'pending',
  expires_at   timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at  timestamptz,
  accepted_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_staff_invites_email_pending
  ON public.staff_invites(lower(email)) WHERE status = 'pending';

ALTER TABLE public.staff_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage staff invites"
  ON public.staff_invites FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Service role manages staff invites"
  ON public.staff_invites FOR ALL TO service_role
  USING (true) WITH CHECK (true);


-- ---------------------------------------------------------------------------
-- 5. PLATFORM KPI FUNCTION (admin/support/affiliate_manager)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS TABLE (
  total_users bigint,
  dau_24h bigint,
  mau_30d bigint,
  ai_calls_24h bigint,
  ai_tokens_30d bigint,
  open_tickets bigint,
  urgent_tickets bigint,
  b2b_revenue_30d numeric,
  active_affiliates bigint,
  active_partners bigint,
  pending_affiliate_payouts numeric,
  computed_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    (SELECT count(*)::bigint FROM public.profiles),
    (SELECT count(DISTINCT user_id)::bigint FROM public.ai_usage_logs
       WHERE created_at > now() - interval '24 hours' AND user_id IS NOT NULL),
    (SELECT count(DISTINCT user_id)::bigint FROM public.ai_usage_logs
       WHERE created_at > now() - interval '30 days' AND user_id IS NOT NULL),
    (SELECT count(*)::bigint FROM public.ai_usage_logs
       WHERE created_at > now() - interval '24 hours'),
    (SELECT COALESCE(sum(input_tokens + output_tokens), 0)::bigint
       FROM public.ai_usage_logs WHERE created_at > now() - interval '30 days'),
    (SELECT count(*)::bigint FROM public.support_tickets
       WHERE status IN ('open','pending')),
    (SELECT count(*)::bigint FROM public.support_tickets
       WHERE priority = 'urgent' AND status IN ('open','pending')),
    (SELECT COALESCE(sum(cost_usd), 0)::numeric FROM public.package_delivery_jobs
       WHERE created_at > now() - interval '30 days' AND status = 'completed'),
    (SELECT count(*)::bigint FROM public.affiliate_accounts WHERE status = 'active'),
    (SELECT count(*)::bigint FROM public.api_partners WHERE status = 'active'),
    (SELECT COALESCE(sum(pending_balance), 0)::numeric FROM public.affiliate_accounts),
    now()
  WHERE public.has_staff_role(auth.uid());
$$;

GRANT EXECUTE ON FUNCTION public.get_platform_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_staff_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_admin_or_support(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_staff_action(text, text, text, jsonb, jsonb, jsonb) TO authenticated;
