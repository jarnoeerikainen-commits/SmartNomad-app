# Incident Runbook

> When something is broken, start here. Pair with `OPERATIONS.md` for steady-state.

---

## 1. Severity matrix

| Sev | Definition | Response | Notify |
|---|---|---|---|
| **SEV-1** | Total outage, data breach, payments down | < 15 min | All-hands page, security@, customers within 4 h |
| **SEV-2** | Major feature broken (concierge, auth, B2B gateway) | < 1 h | On-call eng + product, status page |
| **SEV-3** | Degraded perf, single-feature bug | < 4 h business hours | Slack #ops |
| **SEV-4** | Cosmetic, non-blocking | Next sprint | GitHub issue |

---

## 2. Common playbooks

### a. Edge function returns 500

1. `AdminAI` → tail logs for that function.
2. `supabase functions logs <name>` if local CLI access.
3. Check secrets: `fetch_secrets` — was a key just rotated?
4. Roll back: previous version via Supabase dashboard → "Deployments".

### b. RLS denying legitimate reads

1. Check JWT claims: `select auth.uid()` in SQL editor with the affected user's session.
2. Verify `device_id` header is being sent: network tab.
3. Re-run `check_data_access()` directly with row values.
4. If policy bug, write migration with fixed `USING` clause — never disable RLS.

### c. AI returning garbage / hallucinations

1. Check `ai_cache` for poisoned entry: `delete from ai_cache where cache_key = '...'`.
2. Inspect `concierge-evaluator` last 100 scores — if < 0.5 cluster, model regression.
3. Roll back `_shared/modelRouter.ts` to last-known-good model pin.
4. File model card update in `/public/model-cards/`.

### d. Partner reports stale data

1. Check `api_partners.last_request_at` — are they actually hitting prod?
2. `api_audit_logs` for that partner: `response_status`, `latency_ms`.
3. Confirm `api_access_policies.enabled = true` for the resource.
4. If filter_conditions changed, communicate via partner email + changelog.

### e. Suspected secret leak

1. **Immediately rotate** the affected secret via `update_secret` tool.
2. Search code + commit history for the leaked value.
3. Audit `api_audit_logs` / external provider dashboard for misuse.
4. File post-mortem within 48 h.

### f. Database migration failed mid-flight

1. Postgres is transactional — if the migration was wrapped in BEGIN/COMMIT, no half-state.
2. If it created a function but failed RLS step, rerun migration tool with corrected SQL.
3. Never `DROP TABLE` to "fix" — write a forward migration.

---

## 3. Status communication template

```
[INVESTIGATING] We're seeing elevated error rates on the Concierge.
Affected: ~5 % of requests. Other features unaffected.
Next update: 15 min.

[IDENTIFIED] Root cause: ElevenLabs API timeout. Fallback voice in place.
Customer-facing impact: voice replies delayed 3-5 s. Text replies normal.

[RESOLVED] ElevenLabs recovered at 14:32 UTC. All systems normal.
Post-mortem: link to gist within 5 business days.
```

---

## 4. Contact tree

| Role | Primary | Backup |
|---|---|---|
| On-call eng | rotation in PagerDuty | Backend lead |
| Security | security@ | CTO |
| Legal / GDPR | privacy@ | DPO |
| Press | press@ | CEO only |

---

## 5. Post-mortem template

```
## What happened
## Impact (users / revenue / SLA)
## Timeline (UTC)
## Root cause (5 whys)
## What went well
## What didn't
## Action items (owner, due date)
```
