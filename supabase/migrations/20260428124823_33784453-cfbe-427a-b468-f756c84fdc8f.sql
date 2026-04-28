REVOKE ALL ON FUNCTION public.verify_and_consume_ai_action_permission(uuid, text, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.verify_and_consume_ai_action_permission(uuid, text, text, text, text) FROM anon;
REVOKE ALL ON FUNCTION public.verify_and_consume_ai_action_permission(uuid, text, text, text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.verify_and_consume_ai_action_permission(uuid, text, text, text, text) TO service_role;

REVOKE ALL ON FUNCTION public.expire_stale_ai_action_permissions() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.expire_stale_ai_action_permissions() FROM anon;
REVOKE ALL ON FUNCTION public.expire_stale_ai_action_permissions() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.expire_stale_ai_action_permissions() TO service_role;