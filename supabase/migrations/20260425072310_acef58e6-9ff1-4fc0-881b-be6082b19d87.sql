ALTER TABLE public.app_settings
ADD COLUMN IF NOT EXISTS real_calling_enabled boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.call_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid NOT NULL REFERENCES public.call_sessions(id) ON DELETE CASCADE,
  sender_user_id uuid NOT NULL,
  recipient_user_id uuid,
  signal_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  consumed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_signals_call_created
ON public.call_signals(call_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_call_signals_recipient_pending
ON public.call_signals(recipient_user_id, created_at DESC)
WHERE consumed_at IS NULL;

CREATE TABLE IF NOT EXISTS public.call_presence (
  user_id uuid PRIMARY KEY,
  status text NOT NULL DEFAULT 'online',
  device_id text,
  active_call_id uuid REFERENCES public.call_sessions(id) ON DELETE SET NULL,
  last_seen_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_presence_status_seen
ON public.call_presence(status, last_seen_at DESC);

DROP TRIGGER IF EXISTS tg_call_presence_updated_at ON public.call_presence;
CREATE TRIGGER tg_call_presence_updated_at
  BEFORE UPDATE ON public.call_presence
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.call_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_presence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Call participants can view signals" ON public.call_signals;
CREATE POLICY "Call participants can view signals"
ON public.call_signals
FOR SELECT
TO authenticated
USING (
  sender_user_id = auth.uid()
  OR recipient_user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.call_sessions s
    WHERE s.id = call_id
      AND (s.caller_user_id = auth.uid() OR s.callee_user_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Call participants can create signals" ON public.call_signals;
CREATE POLICY "Call participants can create signals"
ON public.call_signals
FOR INSERT
TO authenticated
WITH CHECK (
  sender_user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.call_sessions s
    WHERE s.id = call_id
      AND (s.caller_user_id = auth.uid() OR s.callee_user_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Recipients can mark their signals consumed" ON public.call_signals;
CREATE POLICY "Recipients can mark their signals consumed"
ON public.call_signals
FOR UPDATE
TO authenticated
USING (recipient_user_id = auth.uid())
WITH CHECK (recipient_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their own presence" ON public.call_presence;
CREATE POLICY "Users can view their own presence"
ON public.call_presence
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own presence" ON public.call_presence;
CREATE POLICY "Users can create their own presence"
ON public.call_presence
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own presence" ON public.call_presence;
CREATE POLICY "Users can update their own presence"
ON public.call_presence
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_real_calling_enabled()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT real_calling_enabled FROM public.app_settings WHERE id = 1), false)
$$;