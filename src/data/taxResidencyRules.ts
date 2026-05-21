// ═══════════════════════════════════════════════════════════════
// Tax Residency Rules Registry — Verified Government Sources Only
// ───────────────────────────────────────────────────────────────
// Every rule below is sourced from the official tax authority of
// the jurisdiction. No blogs, no aggregators, no "general knowledge".
// `source` is always the authoritative gov / treaty URL.
// `lastVerified` is the human review date; an automated job
// (supabase/functions/tax-law-refresh) pings each URL daily and
// flags drift. If `lastVerified` is older than 180 days the
// calculator returns a `staleSource` warning.
// ═══════════════════════════════════════════════════════════════

export type PartialDayRule =
  | 'any-presence-counts'   // any portion of a calendar day = 1 day  (US, UK, Canada, Australia, Germany, France, Spain, Portugal, Schengen)
  | 'midnight-rule'         // only days where you are present at midnight count (Netherlands for some tests, Singapore physical presence)
  | 'twenty-four-hour'      // only full 24h periods count (rare)
  | 'arrival-excluded'      // arrival day does NOT count, departure does (Switzerland for some)
  | 'departure-excluded';   // departure day does NOT count, arrival does

export interface TaxResidencyRule {
  countryCode: string;        // ISO-3166-1 alpha-2
  countryName: string;
  authority: string;          // e.g. "IRS", "HMRC", "Bundeszentralamt für Steuern"
  threshold: number;          // primary day threshold for tax residency
  rollingWindowDays?: number; // for Schengen 90/180, UK SRT 91-day average, etc.
  taxYear: 'calendar' | 'apr-apr' | 'jul-jun';
  partialDayRule: PartialDayRule;
  countArrival: boolean;
  countDeparture: boolean;
  hasSubstantialPresence?: boolean; // US-style weighted 183 formula
  spt?: { current: number; prior: number; priorPrior: number }; // weights for SPT
  notes: string;
  source: string;             // OFFICIAL gov URL
  sourceLanguage: string;
  lastVerified: string;       // ISO date — manual legal review
}

// NOTE: Always read together with the linked source. This registry
// is a *machine-readable summary* of the rule, not legal advice.
export const TAX_RESIDENCY_RULES: Record<string, TaxResidencyRule> = {
  US: {
    countryCode: 'US',
    countryName: 'United States',
    authority: 'Internal Revenue Service (IRS)',
    threshold: 183,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    hasSubstantialPresence: true,
    spt: { current: 1, prior: 1 / 3, priorPrior: 1 / 6 },
    notes:
      'Substantial Presence Test: ≥31 days in current year AND weighted sum (current + 1/3 prior + 1/6 prior-prior) ≥183. Any part of a US day counts (IRC §7701(b)(7)). Exceptions: commuters from Canada/Mexico, transit <24h, days in US as crew, exempt individuals (F/J/M/Q visa, diplomats), days unable to leave due to medical condition.',
    source: 'https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test',
    sourceLanguage: 'en',
    lastVerified: '2026-05-15',
  },
  UK: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    authority: 'HM Revenue & Customs (HMRC)',
    threshold: 183,
    taxYear: 'apr-apr',
    partialDayRule: 'midnight-rule',
    countArrival: false,
    countDeparture: true,
    notes:
      'Statutory Residence Test (SRT, FA 2013 Sch 45). A "day" = present in UK at the end of the day (midnight). Automatic UK resident if ≥183 days in tax year (6 Apr – 5 Apr) OR only home in UK ≥91 days. Sufficient ties test for 16–182 days. Transit days and "exceptional circumstances" (max 60) can be excluded.',
    source: 'https://www.gov.uk/hmrc-internal-manuals/residence-domicile-and-remittance-basis/rdrm11000',
    sourceLanguage: 'en',
    lastVerified: '2026-05-15',
  },
  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    authority: 'Bundeszentralamt für Steuern',
    threshold: 183,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      '§9 AO (Abgabenordnung): gewöhnlicher Aufenthalt ab >6 zusammenhängenden Monaten. Für Doppelbesteuerungsabkommen: 183-Tage-Regel zählt jeden Tag mit physischer Anwesenheit (auch Teiltage). Kurze Unterbrechungen (Urlaub, Krankheit) brechen den Aufenthalt nicht.',
    source: 'https://www.gesetze-im-internet.de/ao_1977/__9.html',
    sourceLanguage: 'de',
    lastVerified: '2026-05-15',
  },
  FR: {
    countryCode: 'FR',
    countryName: 'France',
    authority: 'Direction Générale des Finances Publiques (DGFiP)',
    threshold: 183,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'Art. 4 B CGI: résidence si foyer OU séjour principal en France (>183 jours, présence partielle = 1 jour) OU activité professionnelle principale OU centre des intérêts économiques. Un seul critère suffit.',
    source: 'https://bofip.impots.gouv.fr/bofip/2008-PGP.html/identifiant=BOI-IR-CHAMP-10',
    sourceLanguage: 'fr',
    lastVerified: '2026-05-15',
  },
  ES: {
    countryCode: 'ES',
    countryName: 'Spain',
    authority: 'Agencia Tributaria (AEAT)',
    threshold: 183,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'Art. 9 Ley 35/2006 IRPF: residente si permanencia >183 días en año natural (ausencias esporádicas se computan salvo prueba de residencia fiscal en otro país) O núcleo de intereses económicos en España. Días parciales cuentan como día completo.',
    source: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764',
    sourceLanguage: 'es',
    lastVerified: '2026-05-15',
  },
  PT: {
    countryCode: 'PT',
    countryName: 'Portugal',
    authority: 'Autoridade Tributária e Aduaneira (AT)',
    threshold: 183,
    rollingWindowDays: 365,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'Art. 16 CIRS: residente se >183 dias (seguidos ou interpolados) em qualquer período de 12 meses iniciado ou terminado no ano, OU habitação que faça supor intenção de residir. Qualquer dia ou fração conta.',
    source: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs16.aspx',
    sourceLanguage: 'pt',
    lastVerified: '2026-05-15',
  },
  CA: {
    countryCode: 'CA',
    countryName: 'Canada',
    authority: 'Canada Revenue Agency (CRA)',
    threshold: 183,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'ITA s.250(1)(a): "deemed resident" if sojourns in Canada for 183 days or more in a calendar year. Any part of a day = a day (CRA Income Tax Folio S5-F1-C1). Residential ties test applies separately for "factual residency".',
    source: 'https://www.canada.ca/en/revenue-agency/services/tax/technical-information/income-tax/income-tax-folios-index/series-5-international-residency/folio-1-residency/income-tax-folio-s5-f1-c1-determining-individual-s-residence-status.html',
    sourceLanguage: 'en',
    lastVerified: '2026-05-15',
  },
  AU: {
    countryCode: 'AU',
    countryName: 'Australia',
    authority: 'Australian Taxation Office (ATO)',
    threshold: 183,
    taxYear: 'jul-jun',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'ITAA 1936 s.6(1): "183-day test" — resident if present >183 days in income year (1 Jul – 30 Jun) UNLESS usual place of abode is outside Australia AND no intention to take up residence. Any part of day = day (ATO TR 98/17).',
    source: 'https://www.ato.gov.au/individuals-and-families/coming-to-australia-or-going-overseas/work-out-your-tax-residency',
    sourceLanguage: 'en',
    lastVerified: '2026-05-15',
  },
  SG: {
    countryCode: 'SG',
    countryName: 'Singapore',
    authority: 'Inland Revenue Authority of Singapore (IRAS)',
    threshold: 183,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'ITA s.2(1): tax resident if physically present OR exercises employment in Singapore for ≥183 days in the year preceding YA. Days of arrival and departure both counted as days of physical presence (IRAS e-Tax Guide).',
    source: 'https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/working-out-your-tax-residency',
    sourceLanguage: 'en',
    lastVerified: '2026-05-15',
  },
  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    authority: 'Federal Tax Authority (FTA)',
    threshold: 183,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'Cabinet Decision No. 85 of 2022, art. 4: natural person is UAE tax resident if physically present in UAE ≥183 days in a consecutive 12-month period; OR 90 days + UAE nationality/residency permit + permanent place of residence or job. Any part of a day counts.',
    source: 'https://mof.gov.ae/wp-content/uploads/2022/09/Cabinet-Decision-No.-85-of-2022.pdf',
    sourceLanguage: 'en',
    lastVerified: '2026-05-15',
  },
  CH: {
    countryCode: 'CH',
    countryName: 'Switzerland',
    authority: 'Eidgenössische Steuerverwaltung (ESTV)',
    threshold: 90,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'DBG Art. 3 Abs. 3: unbeschränkt steuerpflichtig bei Aufenthalt ohne Erwerbstätigkeit ≥90 Tage oder mit Erwerbstätigkeit ≥30 Tage. An- und Abreisetage zählen mit.',
    source: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/de#art_3',
    sourceLanguage: 'de',
    lastVerified: '2026-05-15',
  },
  NL: {
    countryCode: 'NL',
    countryName: 'Netherlands',
    authority: 'Belastingdienst',
    threshold: 183,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'AWR art. 4: woonplaats naar de omstandigheden beoordeeld (facts & circumstances). 183-dagen-regel uit DBV: elk dag (ook deel daarvan) waarop persoon fysiek in NL aanwezig is, telt mee.',
    source: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/internationaal/woonplaats/',
    sourceLanguage: 'nl',
    lastVerified: '2026-05-15',
  },
  IE: {
    countryCode: 'IE',
    countryName: 'Ireland',
    authority: 'Revenue Commissioners',
    threshold: 183,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'TCA 1997 s.819: resident if (a) ≥183 days in tax year, OR (b) ≥280 days over two consecutive years (with ≥30 in each). From 1 Jan 2009 a "day" = any part of a day present in the State.',
    source: 'https://www.revenue.ie/en/jobs-and-pensions/tax-residence/index.aspx',
    sourceLanguage: 'en',
    lastVerified: '2026-05-15',
  },
  IT: {
    countryCode: 'IT',
    countryName: 'Italy',
    authority: 'Agenzia delle Entrate',
    threshold: 183,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'Art. 2 TUIR (DPR 917/1986) come modificato dal D.Lgs. 209/2023: residente se per la maggior parte del periodo d\'imposta (≥183 gg, 184 in anno bisestile) è iscritto all\'anagrafe OPPURE ha domicilio/residenza/presenza fisica in Italia. Le frazioni di giorno si computano come giorno intero.',
    source: 'https://www.agenziaentrate.gov.it/portale/web/guest/schede/agevolazioni/residenza-fiscale',
    sourceLanguage: 'it',
    lastVerified: '2026-05-15',
  },
  SCHENGEN: {
    countryCode: 'SCHENGEN',
    countryName: 'Schengen Area (visa-free / short-stay)',
    authority: 'European Commission (Schengen Borders Code)',
    threshold: 90,
    rollingWindowDays: 180,
    taxYear: 'calendar',
    partialDayRule: 'any-presence-counts',
    countArrival: true,
    countDeparture: true,
    notes:
      'Regulation (EU) 2016/399 (Schengen Borders Code) art. 6(1): max 90 days in any 180-day rolling period. Day of entry AND day of exit both count as days of presence (EU Practical Handbook for Border Guards, part II §1.2).',
    source: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0399',
    sourceLanguage: 'en',
    lastVerified: '2026-05-15',
  },
};

export function getTaxRule(countryCode: string): TaxResidencyRule | null {
  return TAX_RESIDENCY_RULES[countryCode.toUpperCase()] ?? null;
}

export function isSourceStale(rule: TaxResidencyRule, maxAgeDays = 180): boolean {
  const verified = new Date(rule.lastVerified).getTime();
  const ageDays = (Date.now() - verified) / 86_400_000;
  return ageDays > maxAgeDays;
}
