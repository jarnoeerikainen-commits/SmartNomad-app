# Compliance Mapping

> Regulatory alignment for SuperNomad — designed for a Sovereign Trust posture.

---

## 1. GDPR (EU 2016/679)

| Article | How we comply |
|---|---|
| Art. 5 (principles) | Data minimization in `data_packages.field_restrictions`; purpose limitation in `consent_ledger.purpose` |
| Art. 6 (lawful basis) | `data_access_requests.legal_basis` enum: consent / contract / legitimate-interest |
| Art. 7 (consent) | Append-only `consent_ledger` with `consent_text_hash` + version |
| Art. 15 (access) | "Download my data" — `/account/data-export` (planned, ticket #DPA-1) |
| Art. 17 (erasure) | `/account/delete` cascades via `migrate_device_to_user` reverse + 30-day soft-delete |
| Art. 25 (privacy by design) | RLS-first schema; PII anonymization in B2B gateway by default |
| Art. 30 (records of processing) | `data_access_requests` table is RoPA-grade |
| Art. 32 (security) | See `SECURITY.md` |
| Art. 33 (breach notification) | 72 h via incident playbook in `RUNBOOK.md` |
| Art. 35 (DPIA) | Required before live launch — template in `docs/dpia-template.md` |

## 2. EU AI Act (2024/1689)

| Risk class | App component | Mitigation |
|---|---|---|
| **Limited risk** (transparency) | All AI chat | "AI" badge, disclosed in `Concierge` settings |
| **High risk** (Annex III §5 — access to essential services) | Trust Pass tier checks | Human-in-the-loop revocation; `verify_trust_tier` returns reasons, not opaque deny |
| **Prohibited** (Annex II) | Social scoring, biometric categorisation | **Not implemented and never will be** |

Logs: every AI inference recorded in `ai_usage_logs` with model + token counts (Art. 12 record-keeping).

## 3. CCPA / CPRA (California)

- "Do Not Sell or Share" toggle in `/account/privacy` → flips `consent_ledger.granted = false` for `purpose IN ('marketing', 'data_sharing')`.
- Verifiable consumer requests honored within 45 days.
- B2B data packages annotated with `cookie_free=true` to qualify under "service provider" exception.

## 4. PCI DSS

- **Out of scope** for app: we never touch PAN. Stripe / Paddle / virtual card provider holds raw card data.
- We store only tokens + `last4` in `agentic_virtual_cards`.
- SAQ-A applies.

## 5. SOC 2 readiness

| Trust Service Criterion | Status |
|---|---|
| Security | RLS + audit logs + secret rotation playbook |
| Availability | Pending: status page, 99.9 % SLA target |
| Confidentiality | Vault encryption, role-based access |
| Processing integrity | `concierge-evaluator` regression tests, `change_proposals` review gate |
| Privacy | Consent ledger, DSR endpoints (planned) |

Type I scoped Q3, Type II target Q1 next year.

## 6. Country-specific notes

- **UK**: GDPR (UK) + ICO registration required pre-launch.
- **Switzerland**: revFADP (Sept 2023) — equivalent to GDPR, same controls suffice.
- **Brazil**: LGPD — adds `data_access_requests.legal_basis = 'lgpd_legitimate_interest'` enum value.
- **Saudi Arabia**: PDPL — requires data residency for sensitive categories; not yet supported, gate signups by geo.

---

## 7. Open compliance debt

1. DPIA document not yet filed.
2. DSR (data subject request) automated endpoint — code complete, awaiting legal review.
3. Cookie banner — implemented for marketing site; app uses functional storage only (no banner needed under ePrivacy).
4. AI model card published per EU AI Act Art. 53 — template in `/public/model-cards/`.
