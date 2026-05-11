// ═══════════════════════════════════════════════════════════
// Verified Sources Whitelist — Per-Domain Authority Gate
// ───────────────────────────────────────────────────────────
// Purpose: cut hallucination by telling each specialist exactly
// which sources are authoritative, and forbidding citations to
// anything else. Pair with antiHallucination.ts truth protocol.
// ═══════════════════════════════════════════════════════════

export type SourceDomain = 'medical' | 'legal' | 'travel-planner' | 'tax';

const WHITELISTS: Record<SourceDomain, { name: string; sources: string[]; rule: string }> = {
  medical: {
    name: 'Medical / Health',
    sources: [
      'WHO (who.int)',
      'CDC (cdc.gov)',
      'NHS (nhs.uk)',
      'EMA (ema.europa.eu)',
      'PubMed / NIH (pubmed.ncbi.nlm.nih.gov)',
      'NICE (nice.org.uk)',
      'IAMAT (iamat.org)',
      'national Ministry of Health portals',
      'manufacturer drug labels (FDA / EMA approved)',
    ],
    rule:
      'For dosing, contraindications, vaccine schedules, outbreak status, and emergency steps you may cite ONLY the sources above. Drug brand names and country drug availability must come from official labels or national pharmacy authorities. Never cite a blog, forum, or "general medical site". If unsure → say so and recommend a clinician.',
  },
  legal: {
    name: 'Legal / Immigration',
    sources: [
      'EUR-Lex (eur-lex.europa.eu)',
      'official government & ministry portals (.gov / .gouv / .gob / .gv)',
      'embassy & consulate sites',
      'CourtListener (courtlistener.com)',
      'national supreme/constitutional court publications',
      'UN treaty collection (treaties.un.org)',
      'OECD legal instruments (legalinstruments.oecd.org)',
      'official tax authority portals (IRS, HMRC, BMF, IRAS, etc.)',
    ],
    rule:
      'Cite the specific statute, directive, or article number when known (e.g., "Schengen Borders Code Reg. (EU) 2016/399 art. 6"). Never invent a case name, docket number, statute number, or URL. If you cannot name a real source → state the rule in plain language and tell the user to confirm with the linked official portal. Always recommend a licensed local attorney for representation.',
  },
  'travel-planner': {
    name: 'Travel / Mobility',
    sources: [
      'IATA Travel Centre (iatatravelcentre.com)',
      'official airline & airport sites',
      'national tourism boards (.gov / official)',
      'foreign-affairs travel advisories (US State Dept, UK FCDO, DE AA, FR Conseils aux voyageurs)',
      'ETIAS / ESTA / eTA official portals',
      'central bank FX feeds',
      'WHO travel health advisories',
      'app-supplied verified data (curated venues, threat intelligence, holiday pack)',
    ],
    rule:
      'Prices, schedules, opening hours, and visa rules must come from app-supplied data or the sources above — never invented. If a fact is older than 30 days or unconfirmed, say so. For accommodation and dining recommendations, only suggest entries from app-supplied verified data; otherwise say no verified options were found and offer to search.',
  },
  tax: {
    name: 'Tax / Residency',
    sources: [
      'national tax authority portals (IRS, HMRC, BMF, AT, IRAS, ATO, CRA, etc.)',
      'OECD tax treaties database',
      'EUR-Lex tax directives',
      'official double-tax treaty texts',
      'app-supplied user-day-tracking data',
    ],
    rule:
      'Never invent thresholds, rates, deadlines, or treaty articles. Cite the authority and year. For numerical filings, recommend a CPA / Steuerberater / chartered accountant in the relevant jurisdiction.',
  },
};

export function buildVerifiedSourcesBlock(domain: SourceDomain): string {
  const w = WHITELISTS[domain];
  return `═══ VERIFIED SOURCES — ${w.name.toUpperCase()} ═══

You may treat as AUTHORITATIVE ONLY these source families:
${w.sources.map(s => `  • ${s}`).join('\n')}

Rules: ${w.rule}

Anything outside that whitelist is "unverified" — you may mention it only if
you label it explicitly as unverified and tell the user it needs confirmation.
Never fabricate a URL, citation, statute number, or document title.

═══ END VERIFIED SOURCES ═══

`;
}
