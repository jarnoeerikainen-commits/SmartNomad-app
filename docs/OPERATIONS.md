# Operations Runbook

> Day-2 ops for SuperNomad. Use alongside `RUNBOOK.md` (incident playbooks).

---

## 1. Environments

| Env | URL | Purpose |
|---|---|---|
| Preview | `id-preview--476ad2f6-...lovable.app` | Per-branch sandbox |
| Production | `supernomad1.lovable.app` | Live users |
| Mobile | Capacitor build → TestFlight / Play Internal | Native shell |

Backend is shared (single Supabase project `xeunjlpzvitnrepyzatg`). Promote schema changes via the migration tool — never edit `src/integrations/supabase/types.ts`.

---

## 2. Daily checks (5 min)

1. Open `/admin` → check `AdminOverview` KPIs (DAU, error rate, AI spend).
2. `AdminBrain` → triage unread insights (severity = critical first).
3. Review `api_audit_logs` last 24 h for partner anomalies (5xx spike, new IPs).
4. `AdminTickets` urgent queue should be empty.

## 3. Weekly checks (30 min)

- Run Supabase linter: should be green.
- `affiliate_payouts` queue — process pending if > $1k.
- `data_package_subscriptions` near volume cap → warn partner at 80 %.
- Rotate any secret older than 90 days.

---

## 4. Deploys

Frontend deploys are atomic via Lovable. Edge functions auto-deploy when files in `supabase/functions/<name>/` change. To force redeploy from CLI:

```
supabase functions deploy <name> --project-ref xeunjlpzvitnrepyzatg
```

Migrations: use the migration tool. Never run raw SQL against prod outside `supabase--migration`.

---

## 5. Backups

- Postgres: Supabase PITR (7-day window on Pro plan).
- Storage bucket `receipts`: enable cross-region replication before go-live.
- Edge function source: lives in repo (single source of truth).

---

## 6. Cost control

| Lever | Where |
|---|---|
| AI cache hit-rate | `ai_cache.hit_count` — target > 35 % |
| Cheap model routing | `_shared/modelRouter.ts` — Flash for default, Pro only on intent |
| Dead memories | Run `cleanup_expired_cache()` nightly via `pg_cron` |
| B2B over-delivery | Subscription `max_records_per_query` + nightly billing recon |

---

## 7. Scaling thresholds

| Metric | Action at threshold |
|---|---|
| Edge invocations > 50 k/min | Move heavy functions to dedicated Deno deploy region |
| Postgres CPU > 70 % sustained | Add read replica for `ai_usage_logs`, `api_audit_logs` |
| pgvector queries > 200 ms p95 | Move embeddings to dedicated index, consider HNSW |
| Active users > 100 k | Split `chat_messages` by month (declarative partitioning) |

---

## 8. Useful SQL snippets

```sql
-- Top error functions last hour
SELECT function_name, count(*), avg(latency_ms)
FROM ai_usage_logs
WHERE created_at > now() - interval '1 hour' AND error IS NOT NULL
GROUP BY 1 ORDER BY 2 DESC LIMIT 10;

-- Partner activity last 24 h
SELECT p.partner_name, count(*), sum(records_returned)
FROM api_audit_logs a JOIN api_partners p ON p.id = a.partner_id
WHERE a.created_at > now() - interval '24 hours'
GROUP BY 1 ORDER BY 2 DESC;

-- Memory growth per user
SELECT user_id, count(*), max(created_at)
FROM ai_memories WHERE user_id IS NOT NULL
GROUP BY 1 ORDER BY 2 DESC LIMIT 20;
```
