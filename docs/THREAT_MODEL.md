# SuperNomad — Threat Model (STRIDE)

> Last review: 2026-04-23 · Owner: Security Lead
> Scope: production deployment of SuperNomad app, edge functions, and B2B gateway.

---

## 1. Trust boundaries

```
[ Browser/Mobile ] ──► [ Lovable CDN ] ──► [ Supabase Edge Functions (Deno) ] ──► [ Postgres / external APIs ]
       │                                              │
       └─► [ B2B partner client ] ──► [ supernomad-gateway / trust-pass-verify / data-package-query ]
```

| Boundary | Trust delta |
|---|---|
| Browser ↔ CDN | Public — assume hostile input, no secrets |
| Edge ↔ Postgres | Edge runs as service-role; **must** scope queries by user/device |
| Edge ↔ external APIs | Outbound secrets in `Deno.env`, never echoed to client |
| Partner ↔ gateway | API key + IP allowlist + per-partner RLS via `api_access_policies` |

---

## 2. STRIDE per asset

### a. End-user account & profile

| Threat | Mitigation |
|---|---|
| **S**poofing | Supabase JWT, optional MFA (`has_verified_mfa()`), device binding via `device_sessions` |
| **T**ampering | RLS on every user table; `check_data_access()` helper |
| **R**epudiation | `audit_log` (append-only, RLS) records auth, role, payment, consent events |
| **I**nfo disclosure | `profiles.snomad_id` is the only public identifier; emails never leak via API |
| **D**oS | Rate-limit on edge functions (`_shared/rateLimit.ts`); Cloudflare in front of Lovable CDN |
| **E**oP | Roles in `user_roles` only, checked via SECURITY DEFINER `has_role()` |

### b. AI memory & conversations

| Threat | Mitigation |
|---|---|
| Prompt injection from memory | `_shared/antiHallucination.ts` strips tool-calls from retrieved facts |
| Cross-tenant leak | `ai_memories.device_id` enforced in every search RPC |
| Embedding inversion | Embeddings never returned via B2B API (column-level filter) |
| Memory poisoning | `memory-distill` requires confidence ≥ 0.6 + source conversation ID |

### c. Trust Pass credentials

| Threat | Mitigation |
|---|---|
| Forged JWT-VC | HS256 signed with `TRUST_PASS_SIGNING_KEY` (demo); OID4VC walt.id (live) |
| Replay | Each credential has `credential_id` (unique), `expires_at`, revocation table |
| Partner over-querying | `verify_trust_tier()` requires consent; tier-only response — no field leakage |

### d. B2B gateway

| Threat | Mitigation |
|---|---|
| Stolen API key | SHA-256 hash storage, IP allowlist, expiry, `last_request_at` monitoring |
| Data exfiltration | Per-resource policy (`api_access_policies`) caps records, anonymizes PII, restricts fields |
| K-anonymity violation | `data-package-query` enforces `min_k_anonymity`, refuses below threshold |
| Audit gap | Every request → `api_audit_logs` + `data_access_requests` (consent-linked) |

### e. Payments & agentic commerce

| Threat | Mitigation |
|---|---|
| Unauthorized AI spend | `evaluate_agentic_guardrail()` checks per-tx, daily, weekly caps before authorization |
| Card credentials | Tokenized only; never store PAN/CVV; provider holds raw |
| Chargeback fraud | `reverse_affiliate_earnings_for_source()` reverses commissions on chargeback |

### f. Admin brain & source monitor

| Threat | Mitigation |
|---|---|
| Auto-applied bad change | `change_proposals.injection_scan_passed` + `risk_level` gate auto-apply (low only) |
| Compromised source feed | `tls_verified` + `source_snapshots` integrity diff |
| Admin AI hallucination | Insights/recommendations require human ack; decisions logged in `staff_audit_log` |

---

## 3. Top residual risks (track quarterly)

1. **Service-role-key leak via misbehaving edge function** — mitigation: code review checklist + secret scanner in CI.
2. **Consent ledger backdating** — append-only enforced at app layer; consider Postgres `INSERT-only` RLS + nightly hash chain.
3. **Cross-region latency on `data_access_requests` write** — accept; revisit if partner SLA < 200 ms.
4. **Mobile WebView phishing** — Capacitor restricts navigation; add CSP `frame-ancestors 'none'`.
5. **Embedding model upgrade breaks hybrid search ranking** — covered by `concierge-evaluator` regression tests.

---

## 4. Required controls before "live" launch

- [ ] Pen test (OWASP ASVS L2)
- [ ] Supabase linter green; all 87 RLS policies reviewed by 2nd engineer
- [ ] DPIA filed for EU users (GDPR Art. 35)
- [ ] EU AI Act Annex III mapping — done in `COMPLIANCE.md`
- [ ] Bug bounty program live (HackerOne / Intigriti)
- [ ] SOC 2 Type I scoped (target Type II 12 months post-launch)

---

## 5. Incident response

- Severity matrix in `RUNBOOK.md`
- On-call rotation: Security Lead + Backend Lead
- Customer notification SLA: 72 h (GDPR), immediate for payment data
- Forensics: `audit_log` + `staff_audit_log` + Supabase function logs (90-day retention)
