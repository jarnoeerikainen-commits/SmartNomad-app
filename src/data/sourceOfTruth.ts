// ═══════════════════════════════════════════════════════════
// Source of Truth Registry
// ───────────────────────────────────────────────────────────
// Single source of all government / authority data feeds we
// trust. Drives the persistent "Source of truth" chip on
// every legal / tax / visa screen.
// ═══════════════════════════════════════════════════════════

export type TruthDomain = 'tax' | 'visa' | 'legal' | 'travel-auth' | 'medical' | 'travel-advisory';

export interface TruthSource {
  authority: string;            // e.g. "IRS"
  jurisdiction: string;         // e.g. "United States"
  url: string;                  // direct .gov / official portal
  flag?: string;
}

export interface TruthRecord {
  domain: TruthDomain;
  label: string;                // chip headline, e.g. "Tax residency rules"
  sources: TruthSource[];
  lastVerifiedISO: string;      // ISO date of last automated verify
  nextRefreshISO: string;       // ISO date of next scheduled refresh
  refreshCadence: 'daily' | 'weekly' | 'on-change';
  protocol?: string;            // short note: how we keep this fresh
}

// Last refresh is set once per build; the back-end tax-law-refresh
// edge function updates a Supabase row daily — UI falls back to the
// build-time stamp until that row is fetched (handled by chip).
const TODAY = '2026-05-24';
const NEXT = '2026-05-31';

export const SOURCE_OF_TRUTH: Record<TruthDomain, TruthRecord> = {
  tax: {
    domain: 'tax',
    label: 'Tax residency rules',
    refreshCadence: 'daily',
    lastVerifiedISO: TODAY,
    nextRefreshISO: NEXT,
    protocol: 'Daily diff against each authority portal; flagged on change.',
    sources: [
      { authority: 'IRS',            jurisdiction: 'United States',  url: 'https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test', flag: '🇺🇸' },
      { authority: 'HMRC',           jurisdiction: 'United Kingdom', url: 'https://www.gov.uk/government/publications/rdr3-statutory-residence-test-srt',     flag: '🇬🇧' },
      { authority: 'BMF',            jurisdiction: 'Germany',        url: 'https://www.bundesfinanzministerium.de/Web/EN/Home/home.html',                   flag: '🇩🇪' },
      { authority: 'AT',             jurisdiction: 'Portugal',       url: 'https://info.portaldasfinancas.gov.pt/',                                          flag: '🇵🇹' },
      { authority: 'AEAT',           jurisdiction: 'Spain',          url: 'https://sede.agenciatributaria.gob.es/',                                          flag: '🇪🇸' },
      { authority: 'IRAS',           jurisdiction: 'Singapore',      url: 'https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates', flag: '🇸🇬' },
      { authority: 'ATO',            jurisdiction: 'Australia',      url: 'https://www.ato.gov.au/individuals-and-families/coming-to-australia-or-going-overseas/your-tax-residency', flag: '🇦🇺' },
      { authority: 'CRA',            jurisdiction: 'Canada',         url: 'https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents.html', flag: '🇨🇦' },
      { authority: 'FTA',            jurisdiction: 'UAE',            url: 'https://tax.gov.ae/',                                                             flag: '🇦🇪' },
      { authority: 'Revenue Dept.',  jurisdiction: 'Thailand',       url: 'https://www.rd.go.th/english/',                                                   flag: '🇹🇭' },
      { authority: 'Agenzia Entrate',jurisdiction: 'Italy',          url: 'https://www.agenziaentrate.gov.it/portale/web/english',                          flag: '🇮🇹' },
      { authority: 'NTA',            jurisdiction: 'Japan',          url: 'https://www.nta.go.jp/english/',                                                  flag: '🇯🇵' },
      { authority: 'NTS',            jurisdiction: 'South Korea',    url: 'https://www.nts.go.kr/english/main.do',                                           flag: '🇰🇷' },
      { authority: 'ESTV',           jurisdiction: 'Switzerland',    url: 'https://www.estv.admin.ch/estv/en/home.html',                                     flag: '🇨🇭' },
      { authority: 'Income Tax Dept',jurisdiction: 'India',          url: 'https://incometaxindia.gov.in/',                                                  flag: '🇮🇳' },
      { authority: 'SARS',           jurisdiction: 'South Africa',   url: 'https://www.sars.gov.za/individuals/tax-during-all-life-stages-702/residency/',   flag: '🇿🇦' },
      { authority: 'SAT',            jurisdiction: 'Mexico',         url: 'https://www.sat.gob.mx/',                                                          flag: '🇲🇽' },
      { authority: 'RFB',            jurisdiction: 'Brazil',         url: 'https://www.gov.br/receitafederal/en',                                            flag: '🇧🇷' },
      { authority: 'DGFiP',          jurisdiction: 'France',         url: 'https://www.impots.gouv.fr/international',                                        flag: '🇫🇷' },
      { authority: 'Belastingdienst',jurisdiction: 'Netherlands',    url: 'https://www.belastingdienst.nl/',                                                 flag: '🇳🇱' },
      { authority: 'OECD',           jurisdiction: 'Tax treaties',   url: 'https://www.oecd.org/tax/treaties/' },
    ],
  },
  visa: {
    domain: 'visa',
    label: 'Visa & immigration rules',
    refreshCadence: 'daily',
    lastVerifiedISO: TODAY,
    nextRefreshISO: NEXT,
    protocol: 'Pulled directly from each ministry / consular portal; cross-checked against IATA Travel Centre.',
    sources: [
      { authority: 'IATA Travel Centre', jurisdiction: 'Global',      url: 'https://www.iatatravelcentre.com/' },
      { authority: 'US CBP',             jurisdiction: 'United States',url: 'https://esta.cbp.dhs.gov/',                  flag: '🇺🇸' },
      { authority: 'UK Home Office',     jurisdiction: 'United Kingdom',url: 'https://www.gov.uk/browse/visas-immigration',flag: '🇬🇧' },
      { authority: 'IRCC',               jurisdiction: 'Canada',      url: 'https://www.canada.ca/en/immigration-refugees-citizenship.html', flag: '🇨🇦' },
      { authority: 'Home Affairs',       jurisdiction: 'Australia',   url: 'https://immi.homeaffairs.gov.au/',          flag: '🇦🇺' },
      { authority: 'INZ',                jurisdiction: 'New Zealand', url: 'https://www.immigration.govt.nz/',          flag: '🇳🇿' },
      { authority: 'EU Schengen',        jurisdiction: 'Schengen',    url: 'https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa_en' },
      { authority: 'HiKorea',            jurisdiction: 'South Korea', url: 'https://www.hikorea.go.kr/',                flag: '🇰🇷' },
      { authority: 'MOFA',               jurisdiction: 'Japan',       url: 'https://www.mofa.go.jp/j_info/visit/visa/index.html', flag: '🇯🇵' },
      { authority: 'ICA',                jurisdiction: 'Singapore',   url: 'https://www.ica.gov.sg/',                   flag: '🇸🇬' },
      { authority: 'ICP',                jurisdiction: 'UAE',         url: 'https://icp.gov.ae/en/',                    flag: '🇦🇪' },
    ],
  },
  'travel-auth': {
    domain: 'travel-auth',
    label: 'Electronic travel authorisations',
    refreshCadence: 'on-change',
    lastVerifiedISO: TODAY,
    nextRefreshISO: NEXT,
    protocol: 'Each official portal monitored; UI links route directly to issuing authority.',
    sources: [
      { authority: 'ESTA',     jurisdiction: 'United States', url: 'https://esta.cbp.dhs.gov/',                                                                 flag: '🇺🇸' },
      { authority: 'UK ETA',   jurisdiction: 'United Kingdom',url: 'https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta',              flag: '🇬🇧' },
      { authority: 'ETIAS',    jurisdiction: 'Schengen',      url: 'https://travel-europe.europa.eu/etias_en' },
      { authority: 'Canada eTA',jurisdiction: 'Canada',       url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html', flag: '🇨🇦' },
      { authority: 'Australia ETA',jurisdiction: 'Australia', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601', flag: '🇦🇺' },
      { authority: 'NZeTA',    jurisdiction: 'New Zealand',   url: 'https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/nzeta',       flag: '🇳🇿' },
      { authority: 'K-ETA',    jurisdiction: 'South Korea',   url: 'https://www.k-eta.go.kr/',                                                                  flag: '🇰🇷' },
    ],
  },
  legal: {
    domain: 'legal',
    label: 'Legal & statutory references',
    refreshCadence: 'weekly',
    lastVerifiedISO: TODAY,
    nextRefreshISO: NEXT,
    protocol: 'Citations restricted to EUR-Lex, national gazettes, court publications, embassy & treaty sources.',
    sources: [
      { authority: 'EUR-Lex',         jurisdiction: 'European Union', url: 'https://eur-lex.europa.eu/' },
      { authority: 'CourtListener',   jurisdiction: 'United States',  url: 'https://www.courtlistener.com/',         flag: '🇺🇸' },
      { authority: 'UN Treaties',     jurisdiction: 'Global',         url: 'https://treaties.un.org/' },
      { authority: 'OECD Legal',      jurisdiction: 'Global',         url: 'https://legalinstruments.oecd.org/' },
      { authority: 'US State Dept.',  jurisdiction: 'US embassies',   url: 'https://www.state.gov/',                 flag: '🇺🇸' },
      { authority: 'UK FCDO',         jurisdiction: 'UK consular',    url: 'https://www.gov.uk/foreign-travel-advice',flag: '🇬🇧' },
    ],
  },
  medical: {
    domain: 'medical',
    label: 'Medical & health advisories',
    refreshCadence: 'daily',
    lastVerifiedISO: TODAY,
    nextRefreshISO: NEXT,
    protocol: 'WHO / CDC / national MoH feeds polled daily; outbreak alerts pushed on change.',
    sources: [
      { authority: 'WHO',  jurisdiction: 'Global',         url: 'https://www.who.int/' },
      { authority: 'CDC',  jurisdiction: 'United States',  url: 'https://wwwnc.cdc.gov/travel', flag: '🇺🇸' },
      { authority: 'NHS',  jurisdiction: 'United Kingdom', url: 'https://www.nhs.uk/',          flag: '🇬🇧' },
      { authority: 'EMA',  jurisdiction: 'European Union', url: 'https://www.ema.europa.eu/' },
      { authority: 'IAMAT',jurisdiction: 'Global',         url: 'https://www.iamat.org/' },
    ],
  },
  'travel-advisory': {
    domain: 'travel-advisory',
    label: 'Travel safety advisories',
    refreshCadence: 'daily',
    lastVerifiedISO: TODAY,
    nextRefreshISO: NEXT,
    protocol: 'Foreign-affairs ministries polled hourly; threat level cached 30 min.',
    sources: [
      { authority: 'US State Dept.', jurisdiction: 'United States',  url: 'https://travel.state.gov/',                             flag: '🇺🇸' },
      { authority: 'UK FCDO',        jurisdiction: 'United Kingdom', url: 'https://www.gov.uk/foreign-travel-advice',              flag: '🇬🇧' },
      { authority: 'Auswärtiges Amt',jurisdiction: 'Germany',        url: 'https://www.auswaertiges-amt.de/de/ReiseUndSicherheit', flag: '🇩🇪' },
      { authority: 'France Diplomatie',jurisdiction: 'France',       url: 'https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/', flag: '🇫🇷' },
      { authority: 'DFAT Smartraveller',jurisdiction: 'Australia',   url: 'https://www.smartraveller.gov.au/',                     flag: '🇦🇺' },
    ],
  },
};

export function getTruth(domain: TruthDomain): TruthRecord {
  return SOURCE_OF_TRUTH[domain];
}
