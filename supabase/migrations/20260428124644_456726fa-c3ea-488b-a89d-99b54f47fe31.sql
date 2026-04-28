CREATE TABLE IF NOT EXISTS public.ai_action_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_id text NOT NULL,
  action_type text NOT NULL,
  action_fingerprint text NOT NULL,
  scope text NOT NULL DEFAULT 'single_action',
  risk_level text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  approval_source text NOT NULL DEFAULT 'user',
  approved_by uuid,
  approval_note text,
  requested_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '15 minutes'),
  consumed_at timestamptz,
  execution_count integer NOT NULL DEFAULT 0,
  max_executions integer NOT NULL DEFAULT 1,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_action_permissions_action_type_check CHECK (action_type IN ('phone-call','reservation','document-fill','payment','form-submit','appointment')),
  CONSTRAINT ai_action_permissions_scope_check CHECK (scope IN ('single_action','session','recurring_guardrail')),
  CONSTRAINT ai_action_permissions_risk_level_check CHECK (risk_level IN ('low','medium','high','critical')),
  CONSTRAINT ai_action_permissions_status_check CHECK (status IN ('pending','approved','rejected','expired','consumed','revoked')),
  CONSTRAINT ai_action_permissions_approval_source_check CHECK (approval_source IN ('user','admin','guardian','system_demo')),
  CONSTRAINT ai_action_permissions_execution_bounds_check CHECK (max_executions > 0 AND execution_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_ai_action_permissions_lookup
ON public.ai_action_permissions (user_id, device_id, action_type, action_fingerprint, status, expires_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_action_permissions_status_created
ON public.ai_action_permissions (status, created_at DESC);

ALTER TABLE public.ai_action_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own action permissions" ON public.ai_action_permissions;
CREATE POLICY "Users can view own action permissions"
ON public.ai_action_permissions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own action permissions" ON public.ai_action_permissions;
CREATE POLICY "Users can create own action permissions"
ON public.ai_action_permissions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status IN ('pending','approved') AND approval_source = 'user');

DROP POLICY IF EXISTS "Staff can view action permissions" ON public.ai_action_permissions;
CREATE POLICY "Staff can view action permissions"
ON public.ai_action_permissions
FOR SELECT
TO authenticated
USING (public.has_staff_role(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage action permissions" ON public.ai_action_permissions;
CREATE POLICY "Admins can manage action permissions"
ON public.ai_action_permissions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Service role can manage action permissions" ON public.ai_action_permissions;
CREATE POLICY "Service role can manage action permissions"
ON public.ai_action_permissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP TRIGGER IF EXISTS update_ai_action_permissions_updated_at ON public.ai_action_permissions;
CREATE TRIGGER update_ai_action_permissions_updated_at
BEFORE UPDATE ON public.ai_action_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.ai_action_execution_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_id uuid REFERENCES public.ai_action_permissions(id) ON DELETE SET NULL,
  user_id uuid,
  device_id text NOT NULL,
  action_type text NOT NULL,
  action_fingerprint text NOT NULL,
  function_name text NOT NULL DEFAULT 'concierge-actions',
  mode text NOT NULL DEFAULT 'live',
  status text NOT NULL DEFAULT 'blocked',
  denial_reason text,
  provider text,
  payload_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_action_execution_audit_action_type_check CHECK (action_type IN ('phone-call','reservation','document-fill','payment','form-submit','appointment')),
  CONSTRAINT ai_action_execution_audit_mode_check CHECK (mode IN ('demo','live')),
  CONSTRAINT ai_action_execution_audit_status_check CHECK (status IN ('allowed','blocked','failed','completed'))
);

CREATE INDEX IF NOT EXISTS idx_ai_action_execution_audit_user_created
ON public.ai_action_execution_audit (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_action_execution_audit_device_created
ON public.ai_action_execution_audit (device_id, created_at DESC);

ALTER TABLE public.ai_action_execution_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own action audit" ON public.ai_action_execution_audit;
CREATE POLICY "Users can view own action audit"
ON public.ai_action_execution_audit
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can view action audit" ON public.ai_action_execution_audit;
CREATE POLICY "Staff can view action audit"
ON public.ai_action_execution_audit
FOR SELECT
TO authenticated
USING (public.has_staff_role(auth.uid()));

DROP POLICY IF EXISTS "Service role can manage action audit" ON public.ai_action_execution_audit;
CREATE POLICY "Service role can manage action audit"
ON public.ai_action_execution_audit
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.verify_and_consume_ai_action_permission(
  p_user_id uuid,
  p_device_id text,
  p_action_type text,
  p_action_fingerprint text,
  p_function_name text DEFAULT 'concierge-actions'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_permission public.ai_action_permissions%ROWTYPE;
BEGIN
  IF p_user_id IS NULL THEN
    INSERT INTO public.ai_action_execution_audit (
      user_id, device_id, action_type, action_fingerprint, function_name, mode, status, denial_reason
    ) VALUES (
      NULL, p_device_id, p_action_type, p_action_fingerprint, p_function_name, 'live', 'blocked', 'auth_required'
    );
    RETURN jsonb_build_object('allowed', false, 'reason', 'auth_required');
  END IF;

  SELECT * INTO v_permission
  FROM public.ai_action_permissions
  WHERE user_id = p_user_id
    AND device_id = p_device_id
    AND action_type = p_action_type
    AND action_fingerprint = p_action_fingerprint
    AND status = 'approved'
    AND expires_at > now()
    AND execution_count < max_executions
  ORDER BY created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF v_permission.id IS NULL THEN
    INSERT INTO public.ai_action_execution_audit (
      user_id, device_id, action_type, action_fingerprint, function_name, mode, status, denial_reason
    ) VALUES (
      p_user_id, p_device_id, p_action_type, p_action_fingerprint, p_function_name, 'live', 'blocked', 'missing_valid_permission'
    );
    RETURN jsonb_build_object('allowed', false, 'reason', 'missing_valid_permission');
  END IF;

  UPDATE public.ai_action_permissions
  SET execution_count = execution_count + 1,
      consumed_at = CASE WHEN execution_count + 1 >= max_executions THEN now() ELSE consumed_at END,
      status = CASE WHEN execution_count + 1 >= max_executions THEN 'consumed' ELSE status END,
      updated_at = now()
  WHERE id = v_permission.id;

  INSERT INTO public.ai_action_execution_audit (
    permission_id, user_id, device_id, action_type, action_fingerprint, function_name, mode, status, provider
  ) VALUES (
    v_permission.id, p_user_id, p_device_id, p_action_type, p_action_fingerprint, p_function_name, 'live', 'allowed', v_permission.requested_payload->>'provider'
  );

  RETURN jsonb_build_object(
    'allowed', true,
    'permission_id', v_permission.id,
    'approval_source', v_permission.approval_source,
    'risk_level', v_permission.risk_level
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.expire_stale_ai_action_permissions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  UPDATE public.ai_action_permissions
  SET status = 'expired', updated_at = now()
  WHERE status IN ('pending','approved')
    AND expires_at <= now();
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;