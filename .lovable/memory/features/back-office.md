---
name: Back Office (admin dashboard)
description: /admin shell with role gate, 8 dashboards including the AI Brain (24/7 autonomous intelligence with insights, recommendations, reports). Demo grants synthetic admin for investor preview.
type: feature
---

# Back Office

## Access
- Route: `/admin` (lazy-loaded). Guard: `AdminGuard` → `useStaffRole` hook.
- Roles: `admin`, `support`, `affiliate_manager` (staff) plus `affiliate_partner` / `user` / `premium`.
- **Demo mode** (no auth): synthetic admin granted, sidebar shows amber "Demo / Read-Only" badge. All dashboards fall back to seeded sample data.
- Landing page top-right has a **Back Office** outline button for investors.

## Dashboards (v2)
1. **Overview** — KPIs from `get_platform_stats()` RPC.
2. **Users** — top 100 profiles, in-page text search.
3. **Support** — tickets with priority/status badges.
4. **AI Analytics** — last-7-day usage rolled up by `function_name`.
5. **AI Brain** ⭐ NEW — 24/7 autonomous intelligence. Generates Insights (anomaly/pattern/opportunity/risk/churn), Recommendations (new orders, concierge tweaks, churn saves, pricing) and Reports (executive rollups). Charts: 14d AI activity, revenue mix, concierge quality. Quick scan / Full analysis buttons. Demo seeds 6 insights, 5 recs, 1 report.
6. **B2B Data** — `data_packages` catalog + `api_partners`.
7. **Affiliates** — top earners.
8. **Audit** — last 200 `staff_audit_log` entries.

## AI Brain architecture
- Tables: `admin_ai_insights`, `admin_ai_recommendations`, `admin_ai_reports`, `admin_ai_brain_runs` — staff-only RLS via `has_staff_role()`.
- Edge function: `admin-ai-brain` — gathers signals from `ai_usage_logs`, `support_tickets`, `agentic_transactions`, `package_delivery_jobs`, `affiliate_earnings`, `conversations`, `api_partners`. Sends to Lovable AI Gateway (`google/gemini-3-flash-preview`) with structured tool-calling schema. Persists outputs and tracks token spend per run.
- Helper RPCs: `get_admin_brain_summary()`, `get_latest_admin_report(timeframe)`.
- UI uses recharts (Area, Pie, Line) with gold/emerald/amber palette matching back-office aesthetic.

## DB foundation
- Enum extended: `app_role` += `support`, `affiliate_manager`.
- Tables: `support_tickets`, `support_ticket_messages`, `staff_audit_log`, `staff_invites`, plus AI Brain tables above.
- Helpers: `has_staff_role(uuid)`, `has_admin_or_support(uuid)`, `log_staff_action(...)`, `get_platform_stats()`, `get_admin_brain_summary()`.

## Theme
- `hsl(220 22% 8%)` bg, `hsl(var(--gold))` accents. Sidebar fixed left at 240px. AI Brain page adds emerald LIVE badge + pulsing dot.
