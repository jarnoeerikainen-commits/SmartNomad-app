---
name: Back Office (admin dashboard)
description: /admin shell with role gate, 7 dashboards (Overview, Users, Tickets, AI, B2B Data, Affiliates, Audit). Demo grants synthetic admin for investor preview.
type: feature
---

# Back Office

## Access
- Route: `/admin` (lazy-loaded). Guard: `AdminGuard` → `useStaffRole` hook.
- Roles supported: `admin`, `support`, `affiliate_manager` (staff) plus `affiliate_partner` / `user` / `premium`.
- **Demo mode** (no auth): synthetic admin granted, sidebar shows amber "Demo / Read-Only" badge. All dashboards fall back to seeded sample data when DB returns nothing.
- Landing page top-right has a **Back Office** outline button (gold border) for investors.

## Dashboards (v1)
1. **Overview** — KPIs from `get_platform_stats()` RPC: users, DAU/MAU, AI calls/tokens, open & urgent tickets, B2B revenue 30d, active affiliates, API partners, pending payouts.
2. **Users** — top 100 profiles, in-page text search.
3. **Support** — tickets with priority/status badges (urgent=red, open=emerald, etc).
4. **AI Analytics** — last-7-day usage rolled up by `function_name` (calls / tokens / cache hit %).
5. **B2B Data** — `data_packages` catalog + `api_partners` list.
6. **Affiliates** — top earners by `paid_lifetime` with pending/cleared/paid columns.
7. **Audit** — last 200 `staff_audit_log` entries.

## DB foundation (migration `back_office_foundation`)
- Enum extended: `app_role` += `support`, `affiliate_manager`.
- Tables: `support_tickets`, `support_ticket_messages`, `staff_audit_log`, `staff_invites`.
- Helpers: `has_staff_role(uuid)`, `has_admin_or_support(uuid)`, `log_staff_action(...)`, `get_platform_stats()`.
- RLS: customers see only own tickets; staff see all; only admins read audit log; internal notes hidden from customers.

## Theme
- Matches landing aesthetic: `hsl(220 22% 8%)` bg, `hsl(var(--gold))` accents. Sidebar fixed left at 240px.
