CREATE TABLE IF NOT EXISTS public.admin_concierge_rules (
  rule_key text PRIMARY KEY,
  category text NOT NULL DEFAULT 'general',
  title text NOT NULL,
  rule_text text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  priority integer NOT NULL DEFAULT 100,
  applies_to text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_concierge_performance_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date date NOT NULL DEFAULT CURRENT_DATE,
  segment text NOT NULL DEFAULT 'all_users',
  total_sessions integer NOT NULL DEFAULT 0,
  conversion_events integer NOT NULL DEFAULT 0,
  escalation_rate numeric NOT NULL DEFAULT 0,
  avg_quality_score numeric NOT NULL DEFAULT 0,
  token_usage integer NOT NULL DEFAULT 0,
  estimated_cost_usd numeric NOT NULL DEFAULT 0,
  revenue_signal_usd numeric NOT NULL DEFAULT 0,
  notes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(report_date, segment)
);

ALTER TABLE public.admin_concierge_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_concierge_performance_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view concierge rules" ON public.admin_concierge_rules;
CREATE POLICY "Staff can view concierge rules"
ON public.admin_concierge_rules
FOR SELECT
USING (public.has_staff_role(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage concierge rules" ON public.admin_concierge_rules;
CREATE POLICY "Admins can manage concierge rules"
ON public.admin_concierge_rules
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Staff can view concierge performance" ON public.admin_concierge_performance_daily;
CREATE POLICY "Staff can view concierge performance"
ON public.admin_concierge_performance_daily
FOR SELECT
USING (public.has_staff_role(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage concierge performance" ON public.admin_concierge_performance_daily;
CREATE POLICY "Admins can manage concierge performance"
ON public.admin_concierge_performance_daily
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS update_admin_concierge_rules_updated_at ON public.admin_concierge_rules;
CREATE TRIGGER update_admin_concierge_rules_updated_at
BEFORE UPDATE ON public.admin_concierge_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.admin_ai_agent_controls (
  agent_key, display_name, director, agent_type, description, status, automation_level,
  schedule_label, model_tier, daily_token_budget, daily_run_limit, requires_approval,
  can_write_to_user_surfaces, input_sources, output_targets, feature_flags, escalation_rules,
  owner_role, metadata
) VALUES
('concierge.governor', 'Concierge Governor', NULL, 'governor', 'Main user-facing Concierge brain: routes intent, enforces rules, protects safety, margin and quality.', 'paused', 'recommend_only', 'Every conversation, policy-gated', 'balanced', 70000, 2000, true, false, '["conversation_context","user_profile","verified_sources","agent_reports"]', '["concierge_response_plan","staff_suggestions"]', '{"user_facing":true,"token_friendly":true}', '{"high_stakes":"human_review","low_confidence":"escalate"}', 'concierge', '{"objective":"world_best_concierge","token_strategy":"route first, answer second, specialist only when needed"}'),
('concierge.router', 'Intent Router', NULL, 'specialist', 'Classifies requests into travel, local life, expat, business, booking, safety, revenue or support paths using the cheapest safe model.', 'paused', 'recommend_only', 'Per message preflight', 'speed', 18000, 10000, true, false, '["latest_user_message","conversation_state"]', '["route","risk_level","model_tier"]', '{"cheap_first":true}', '{"ambiguous":"ask_one_question"}', 'concierge', '{"token_strategy":"short classification before any long answer"}'),
('concierge.personalization', 'Personalization Synthesizer', NULL, 'specialist', 'Builds compact user context from verified profile, memory and preferences without exposing sensitive data.', 'paused', 'recommend_only', 'Every 3-5 turns', 'speed', 22000, 4000, true, false, '["profile","ai_memories","preferences"]', '["compact_context"]', '{"privacy_first":true}', '{"sensitive_data":"local_only"}', 'concierge', '{"token_strategy":"summarize once, reuse context"}'),
('concierge.revenue', 'Revenue Opportunity Agent', NULL, 'specialist', 'Finds useful upsells, partner offers and paid concierge moments that fit the user need without damaging trust.', 'paused', 'recommend_only', 'After high-intent requests', 'speed', 20000, 2500, true, false, '["intent","catalog","affiliate_ecosystem","subscription_state"]', '["offer_candidates","staff_suggestions"]', '{"trust_preserving":true}', '{"hard_sell":"blocked"}', 'concierge', '{"profit_strategy":"helpful paid options only when they improve outcome"}'),
('concierge.travel', 'Travel Logistics Agent', NULL, 'specialist', 'Handles flights, hotels, transport, itinerary constraints, disruption logic and trip execution planning.', 'paused', 'recommend_only', 'On travel intent', 'balanced', 45000, 2500, true, false, '["location","travel_history","verified_travel_sources"]', '["travel_plan","booking_brief"]', '{"danger_gate":true}', '{"level4_destination":"explicit_confirmation"}', 'concierge', '{"scope":"business, nomad, expat, leisure, family travel"}'),
('concierge.local-life', 'Local Life Agent', NULL, 'specialist', 'Finds restaurants, gyms, salons, coworking, doctors, clubs, nightlife, errands and practical city life options.', 'paused', 'recommend_only', 'On local intent', 'speed', 32000, 3500, true, false, '["location","curated_venues","directories"]', '["verified_recommendations"]', '{"verified_4_star_minimum":true}', '{"unverified_place":"hedge_or_search"}', 'concierge', '{"quality_bar":"verified 4-star plus unless unavailable"}'),
('concierge.business', 'Business Traveller Agent', NULL, 'specialist', 'Optimizes executive travel, corporate policy, meetings, airport flow, VAT, receipts and business-mode recommendations.', 'paused', 'recommend_only', 'On business context', 'balanced', 30000, 1800, true, false, '["business_profile","calendar","expenses"]', '["business_brief","expense_hints"]', '{"company_context":true}', '{"policy_conflict":"flag_before_action"}', 'concierge', '{"target_users":"high-value business travellers"}'),
('concierge.expat', 'Expat Life Admin Agent', NULL, 'specialist', 'Supports visas, immigration prep, relocation, schools, housing, banking, tax-signpost and long-stay setup.', 'paused', 'recommend_only', 'On relocation/long-stay intent', 'balanced', 35000, 1600, true, false, '["visa_hub","tax_hub","official_sources"]', '["life_admin_brief"]', '{"official_sources_first":true}', '{"legal_or_tax_advice":"specialist_redirect"}', 'concierge', '{"risk":"never pretend to be lawyer or tax advisor"}'),
('concierge.family', 'Family & Normal Traveller Agent', NULL, 'specialist', 'Adapts concierge help for families, children, pets, accessibility, first-time travellers and everyday users.', 'paused', 'recommend_only', 'On family/general traveller intent', 'speed', 24000, 2200, true, false, '["family_profile","pet_profile","accessibility_needs"]', '["family_safe_options"]', '{"age_aware":true}', '{"minor_safety":"extra_care"}', 'concierge', '{"coverage":"normal people, families, pets and first-time travellers"}'),
('concierge.safety', 'Safety & Risk Gatekeeper', NULL, 'specialist', 'Runs danger gate, high-risk travel checks, scams, health/safety escalation and source-grounded warnings.', 'paused', 'recommend_only', 'Every destination or risk mention', 'balanced', 38000, 3500, true, false, '["threat_intelligence","government_advisories","guardian_signals"]', '["risk_gate","escalation_reason"]', '{"always_first_for_risk":true}', '{"do_not_travel":"stop_and_confirm"}', 'concierge', '{"priority":"user safety before conversion"}'),
('concierge.booking', 'Booking & Action Agent', NULL, 'specialist', 'Prepares reservations, calls, forms, rides and payment-ready action plans with explicit consent gates.', 'paused', 'recommend_only', 'On action intent', 'balanced', 42000, 1500, true, false, '["action_request","guardrails","payment_options"]', '["action_plan","consent_request"]', '{"requires_explicit_user_consent":true}', '{"money_or_call":"hold_for_confirmation"}', 'concierge', '{"real_world_actions":"prepared, never executed without consent"}'),
('concierge.loyalty', 'Loyalty & Perks Agent', NULL, 'specialist', 'Optimizes points, cards, upgrades, lounge access, status, perks and reward redemptions.', 'paused', 'recommend_only', 'On booking or rewards intent', 'speed', 26000, 1800, true, false, '["award_cards","loyalty_programs","booking_context"]', '["perk_stack","redemption_options"]', '{"partner_value":true}', '{"unknown_balance":"ask_or_hedge"}', 'concierge', '{"profit_strategy":"higher attachment through useful perks"}'),
('concierge.finops', 'Concierge Token Sentinel', NULL, 'specialist', 'Reduces Concierge cost with cache checks, routing, compression, sample audits and cheap-model classification.', 'paused', 'recommend_only', 'Hourly + per surge window', 'speed', 16000, 1200, true, false, '["ai_usage_logs","cache","agent_runs"]', '["cost_alerts","routing_suggestions"]', '{"cost_control":true}', '{"budget_exceeded":"pause_noncritical"}', 'concierge', '{"goal":"lower tokens without lowering answer quality"}'),
('concierge.quality', 'Concierge Quality Auditor', NULL, 'specialist', 'Grades factuality, personalization, usefulness, escalation discipline, conversion fit and tone quality.', 'paused', 'recommend_only', 'Sampled conversations daily', 'balanced', 28000, 1000, true, false, '["conversation_samples","outcome_feedback"]', '["quality_score","training_suggestions"]', '{"sampled_audits":true}', '{"low_score":"staff_review"}', 'concierge', '{"learning":"outcome-based, not blind self-training"}'),
('concierge.memory', 'Memory Distillation Agent', NULL, 'specialist', 'Extracts durable verified preferences and facts, avoids noisy memories, and updates compact user context.', 'paused', 'recommend_only', 'Every 3 useful turns', 'speed', 18000, 2500, true, false, '["conversation_turns","feedback"]', '["memory_candidates"]', '{"evidence_first":true}', '{"sensitive_memory":"local_encrypted_only"}', 'concierge', '{"token_strategy":"small durable memories only"}'),
('concierge.escalation', 'Human Escalation Agent', NULL, 'specialist', 'Detects when human support, medical, legal, tax, emergency or booking recovery help is needed.', 'paused', 'recommend_only', 'On low confidence or high stakes', 'speed', 14000, 3000, true, false, '["risk_gate","quality_score","user_sentiment"]', '["escalation_card","support_ticket_hint"]', '{"human_in_loop":true}', '{"emergency":"clear escalation"}', 'concierge', '{"trust":"better to escalate than hallucinate"}')
ON CONFLICT (agent_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  agent_type = EXCLUDED.agent_type,
  description = EXCLUDED.description,
  schedule_label = EXCLUDED.schedule_label,
  model_tier = EXCLUDED.model_tier,
  daily_token_budget = EXCLUDED.daily_token_budget,
  daily_run_limit = EXCLUDED.daily_run_limit,
  requires_approval = EXCLUDED.requires_approval,
  can_write_to_user_surfaces = EXCLUDED.can_write_to_user_surfaces,
  input_sources = EXCLUDED.input_sources,
  output_targets = EXCLUDED.output_targets,
  feature_flags = EXCLUDED.feature_flags,
  escalation_rules = EXCLUDED.escalation_rules,
  owner_role = EXCLUDED.owner_role,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.admin_concierge_rules (rule_key, category, title, rule_text, priority, applies_to, metadata) VALUES
('truth.verified_only', 'truth', 'Evidence-first recommendations', 'Never invent venues, prices, policies, dates, legal/tax facts, medical claims, reviews or booking availability. Use verified app state, user-provided data or named trusted sources; hedge or escalate when uncertain.', 1, '{"all"}', '{"blocks_hallucination":true}'),
('profit.trust_first', 'revenue', 'Trust-preserving monetization', 'Offer paid upgrades, partner options or premium services only when they improve the user outcome. No hard sell, no fake urgency, no hidden sponsorship framing.', 10, '{"concierge.revenue","concierge.booking","concierge.loyalty"}', '{"profit_goal":"higher LTV through usefulness"}'),
('tokens.route_before_answer', 'finops', 'Route before expensive reasoning', 'Classify intent, risk and required specialist before long generation. Use compact context, cached answers and speed-tier agents for simple classification.', 20, '{"concierge.router","concierge.finops"}', '{"token_saving":true}'),
('safety.danger_gate', 'safety', 'Danger Gate first', 'For any destination or risky action, run safety checks before booking, lifestyle recommendations or monetization. Level 4 / active-conflict destinations require explicit user confirmation.', 2, '{"concierge.safety","concierge.travel","concierge.booking"}', '{"mandatory":true}'),
('actions.consent_gate', 'actions', 'Explicit consent for real-world actions', 'Calls, reservations, payments, forms, account changes and booking actions must be prepared first and only executed after clear user confirmation.', 3, '{"concierge.booking"}', '{"human_control":true}'),
('quality.four_star_floor', 'quality', 'Verified 4-star floor', 'Default recommendations should be verified 4-star+ where review data exists. If unavailable, say so and present the best alternatives honestly.', 30, '{"concierge.local-life","concierge.travel"}', '{"recommendation_quality":true}'),
('privacy.minimize_sensitive_context', 'privacy', 'Minimum sensitive context', 'Use the smallest context needed. Do not send sensitive identity, payment, health, legal or private family data to agent prompts unless strictly necessary and permitted.', 4, '{"all"}', '{"privacy_first":true}')
ON CONFLICT (rule_key) DO UPDATE SET
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  rule_text = EXCLUDED.rule_text,
  priority = EXCLUDED.priority,
  applies_to = EXCLUDED.applies_to,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.admin_ai_agent_daily_reports (agent_key, title, summary, performance_score, suggestions, token_usage, estimated_cost_usd, metrics, wins, issues, next_actions)
VALUES
('concierge.governor', 'Concierge Governor Launch Baseline', 'Control plane seeded in safe mode. Next step is supervised sampled routing before any user-facing write automation.', 89, '["Keep all agents paused until staff review", "Enable router and safety gate first", "Use sampled quality audits before increasing autonomy"]', 0, 0, '{"readiness":"baseline"}', '["Production controls created"]', '["Automation intentionally disabled"]', '["Approve safe-mode rollout"]'),
('concierge.finops', 'Concierge Token Sentinel Baseline', 'Token strategy ready: route-first, compact context, cheap classifiers, cache reuse and sampled audits.', 91, '["Route intent before long answers", "Limit specialist calls to high-value or high-risk turns", "Compress conversation history every 12 messages"]', 0, 0, '{"token_strategy":"ready"}', '["Cost controls defined"]', '[]', '["Set first daily budget cap"]'),
('concierge.quality', 'Concierge Quality Auditor Baseline', 'Quality auditor ready to grade factuality, personalization, usefulness, escalation discipline and conversion fit without touching live user surfaces.', 88, '["Audit 5% of conversations first", "Escalate low-confidence high-stakes answers", "Compare revenue offers against user trust score"]', 0, 0, '{"audit_mode":"sampled"}', '["Quality rubric defined"]', '[]', '["Approve sampled audits"]')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.get_concierge_control_summary()
RETURNS TABLE(
  total_agents bigint,
  active_agents bigint,
  paused_agents bigint,
  total_daily_token_budget bigint,
  active_rules bigint,
  last_report_at timestamptz,
  pending_suggestions bigint
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT
    (SELECT count(*)::bigint FROM public.admin_ai_agent_controls WHERE agent_key LIKE 'concierge.%'),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_controls WHERE agent_key LIKE 'concierge.%' AND status = 'active'),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_controls WHERE agent_key LIKE 'concierge.%' AND status = 'paused'),
    (SELECT COALESCE(sum(daily_token_budget), 0)::bigint FROM public.admin_ai_agent_controls WHERE agent_key LIKE 'concierge.%'),
    (SELECT count(*)::bigint FROM public.admin_concierge_rules WHERE status = 'active'),
    (SELECT max(created_at) FROM public.admin_ai_agent_daily_reports WHERE agent_key LIKE 'concierge.%'),
    (SELECT count(*)::bigint FROM public.admin_ai_agent_suggestions WHERE agent_key LIKE 'concierge.%' AND status = 'pending')
  WHERE public.has_staff_role(auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.update_admin_concierge_rule(
  p_rule_key text,
  p_status text DEFAULT NULL,
  p_rule_text text DEFAULT NULL,
  p_priority integer DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS public.admin_concierge_rules
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_rule public.admin_concierge_rules;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'admin role required';
  END IF;

  UPDATE public.admin_concierge_rules
  SET
    status = COALESCE(p_status, status),
    rule_text = COALESCE(p_rule_text, rule_text),
    priority = COALESCE(p_priority, priority),
    metadata = COALESCE(p_metadata, metadata),
    updated_at = now()
  WHERE rule_key = p_rule_key
  RETURNING * INTO v_rule;

  IF v_rule.rule_key IS NULL THEN
    RAISE EXCEPTION 'rule not found';
  END IF;

  PERFORM public.log_staff_action(
    'concierge.rule_update',
    'admin_concierge_rules',
    p_rule_key,
    NULL,
    to_jsonb(v_rule),
    jsonb_build_object('control_plane', 'concierge')
  );

  RETURN v_rule;
END;
$$;