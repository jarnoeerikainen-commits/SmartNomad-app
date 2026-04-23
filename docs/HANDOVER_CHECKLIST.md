# Production Handover Checklist

> Pass this as a single artifact to the engineering team taking the project live.
> Each item: ✅ done, 🚧 in progress, ⛔ blocked, ⬜ not started.

---

## Code & repo
- ✅  Monorepo structure documented (`docs/ARCHITECTURE.md`)
- ✅  Edge function inventory mapped to categories
- ✅  Database schema documented by domain
- ⬜  CODEOWNERS file for routing PRs
- ⬜  Branch protection: 1 review + green CI on `main`

## Documentation
- ✅  `ARCHITECTURE.md` — system shape
- ✅  `API.md` — partner contract
- ✅  `THREAT_MODEL.md` — STRIDE per asset
- ✅  `OPERATIONS.md` — daily/weekly checks
- ✅  `SECURITY.md` — concrete controls
- ✅  `COMPLIANCE.md` — GDPR / EU AI Act / CCPA / SOC 2
- ✅  `RUNBOOK.md` — incident playbooks
- ✅  `ENV.md` — every secret enumerated

## Tooling
- ✅  Demo seed script: `pnpm seed:demo`
- ✅  OpenAPI 3.1 spec: `docs/openapi/supernomad.yaml`
- ✅  Postman collection: `docs/postman/supernomad-b2b.postman_collection.json`
- ✅  Pricing experiment harness: `src/utils/pricingExperiments.ts`
- ✅  AI memory governance panel: `/admin/ai` → "Memory Governance" tab
- ⬜  k6 load test scripts (target 1k RPS on gateway)
- ⬜  Lighthouse CI budget for marketing pages

## Security
- ✅  RLS pattern documented
- ⬜  Pen test (OWASP ASVS L2)
- ⬜  Bug bounty program live
- ⬜  Secret rotation calendar in PagerDuty
- ⬜  CSP headers shipped

## Compliance
- ⬜  DPIA filed
- ⬜  DSR endpoint (`/account/data-export` + `/account/delete`)
- ⬜  AI model cards published at `/public/model-cards/`
- ⬜  Cookie banner (marketing site only)

## Payments
- ⛔  Stripe / Paddle live keys (waiting on entity registration)
- ⛔  Apple Pay / Google Pay merchant verification
- ⬜  3DS / SCA flows tested with EU test cards

## Mobile
- ✅  Capacitor config valid
- ⬜  TestFlight build with real signing cert
- ⬜  Play Internal track build
- ⬜  Push notification certs (APNs + FCM)

## Observability
- ⬜  Status page (statuspage.io / Better Stack)
- ⬜  Error tracking (Sentry) wired to edge functions
- ⬜  Synthetic uptime checks (concierge round-trip)
- ⬜  Log retention policy enforced (90d / 2y / 7y per `SECURITY.md`)

## Launch gate (must be ✅ before public launch)
1. ⬜  Pen test passed
2. ⬜  DPIA filed
3. ⬜  Status page live
4. ⬜  Stripe live mode + 3DS verified
5. ⬜  RLS audit signed by 2nd engineer
6. ⬜  Backup restore drill completed
7. ⬜  Incident response dry run with full team
