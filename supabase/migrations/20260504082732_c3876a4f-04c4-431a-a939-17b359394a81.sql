-- ─────────────────────────────────────────────────────────────────────────────
-- HARDENING: REVOKE EXECUTE on internal / staff-only SECURITY DEFINER functions
-- Safe for demo: all callers still work because:
--   • Admin dashboards call these while signed in as staff (we keep `authenticated`
--     EXECUTE on staff dashboard summary RPCs so the admin UI works; the function
--     bodies enforce `has_staff_role(auth.uid())` and return nothing otherwise).
--   • Internal triggers (handle_new_user, tg_*, assign_snomad_id) don't go through
--     PostgREST so REVOKE from anon/authenticated does NOT affect them.
--   • Pure helpers used inside other functions still execute via the owner.
-- User-facing RPCs (migrate_device_to_user, revoke_trust_credential,
-- request_affiliate_payout, get_my_snomad_id, has_active_consent,
-- verify_trust_tier) are intentionally NOT revoked.
-- ─────────────────────────────────────────────────────────────────────────────

-- Trigger functions — never called via API, safe to lock down completely
REVOKE EXECUTE ON FUNCTION public.handle_new_user()                   FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_snomad_id()                  FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_api_partner_timestamp()      FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_oauth_connections_updated_at()   FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_profile_timestamp()          FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_conversation_timestamp()     FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_snomad_profile_timestamp()   FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_affiliate_account_timestamp() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column()          FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_support_tickets_updated_at()     FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_org_set_join_code()              FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.lock_completed_ai_execution_proofs() FROM anon, authenticated;

-- Internal helpers / cron only — service role still has access
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_cache()                                       FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.clear_matured_earnings()                                      FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.expire_stale_ai_action_permissions()                          FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_sources_due_for_refresh(integer)                          FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_org_join_code()                                      FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_snomad_id()                                          FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_ai_usage(text,text,text,integer,integer,integer,boolean,text,text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_referral_click(text,text,text,text,text,text,text,text,text,text,text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.attribute_referral(uuid,text)                                 FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.credit_commission(uuid,numeric,text,text,text,text)           FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reverse_affiliate_earnings_for_source(text,text,text)         FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.evaluate_agentic_guardrail(uuid,numeric,text,text,text)       FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_package_access(uuid,text)                               FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_package_delivery(uuid,uuid,uuid,text,jsonb,text[],text[],integer,boolean,integer,integer,numeric,numeric,text,text,integer,text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.resolve_snomad_id(text)                                       FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_staff_action(text,text,text,jsonb,jsonb,jsonb)            FROM anon, authenticated;

-- Staff-only summary / dashboard RPCs — keep accessible to AUTHENTICATED users so
-- the admin pages continue to work (function body already enforces has_staff_role).
-- We only revoke from anon.
REVOKE EXECUTE ON FUNCTION public.get_platform_stats()                                FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_admin_brain_summary()                           FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_source_monitor_summary()                        FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_admin_agent_control_summary()                   FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_ai_ceo_summary()                                FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_ai_execution_daily(timestamp with time zone)    FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_ai_execution_summary(timestamp with time zone)  FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_ai_transparency_summary(timestamp with time zone) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_concierge_control_summary()                     FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_directors_ecosystem_summary()                   FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_directors_summary()                             FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_latest_admin_report(text)                       FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_latest_agent_daily_reports(integer)             FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_latest_daily_briefing()                         FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_org_dashboard_stats(uuid)                       FROM anon;
REVOKE EXECUTE ON FUNCTION public.decide_admin_ai_ceo_suggestion(uuid,text,text)      FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.decide_opportunity(uuid,boolean,text,boolean,boolean) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.decide_recommendation(uuid,boolean,text)            FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_admin_ai_agent_run(text,text,text,text,jsonb,jsonb,jsonb,integer,integer,integer,text) FROM anon, authenticated;

-- Re-grant the staff dashboard decide_* RPCs to authenticated (admin UI calls them
-- and the body re-checks has_staff_role; this restores explicit grant after blanket revoke).
GRANT EXECUTE ON FUNCTION public.decide_admin_ai_ceo_suggestion(uuid,text,text)                     TO authenticated;
GRANT EXECUTE ON FUNCTION public.decide_opportunity(uuid,boolean,text,boolean,boolean)              TO authenticated;
GRANT EXECUTE ON FUNCTION public.decide_recommendation(uuid,boolean,text)                           TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_admin_ai_agent_run(text,text,text,text,jsonb,jsonb,jsonb,integer,integer,integer,text) TO authenticated;