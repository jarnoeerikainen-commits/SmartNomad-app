// EES (Entry/Exit System) — Verified data from official EU sources
// Sources (last verified Apr 2026):
// • https://travel-europe.europa.eu/ees_en
// • https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/smart-borders/entry-exit-system_en
// • https://www.eulisa.europa.eu/Activities/Large-Scale-It-Systems/EES
// • https://ec.europa.eu/eurostat (Schengen 90/180 rule)
//
// EES went live Oct 12, 2025 with phased rollout completing Apr 10, 2026.

export const EES_LAUNCH_DATE = '12 October 2025';
export const EES_FULL_ROLLOUT = '10 April 2026';
export const EES_DATA_RETENTION_YEARS = 3;
export const EES_RETENTION_AFTER_OVERSTAY_YEARS = 5;
export const EES_SCHENGEN_DAYS = 90;
export const EES_SCHENGEN_WINDOW = 180;

// ─── OFFICIAL CHANNELS ONLY (no third-party paid services) ───
export const EES_OFFICIAL = {
  euTravel:       'https://travel-europe.europa.eu/ees_en',
  euHomeAffairs:  'https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/smart-borders/entry-exit-system_en',
  euLisa:         'https://www.eulisa.europa.eu/Activities/Large-Scale-It-Systems/EES',
  faqEuTravel:    'https://travel-europe.europa.eu/ees/faqs-ees_en',
  dataRights:     'https://www.edps.europa.eu/data-protection/our-work/subjects/entry-exit-system_en',
  schengenCalc:   'https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/schengen-area/short-stay-visa-calculator_en',
  eesVsEtias:     'https://home-affairs.ec.europa.eu/news/ees-vs-etias-main-differences-know-travellers-2026-01-29_en',
};

export interface EESDataPoint {
  category: 'biometric' | 'identity' | 'travel' | 'risk';
  label: string;
  detail: string;
  retention: string;
  yourRight: string;
}

export const EES_DATA_COLLECTED: EESDataPoint[] = [
  {
    category: 'biometric',
    label: 'Facial image',
    detail: 'High-resolution facial scan captured at first entry to a Schengen country.',
    retention: `${EES_DATA_RETENTION_YEARS} years from last exit (5 years if you overstayed).`,
    yourRight: 'You may request a copy and rectification via the national border authority.',
  },
  {
    category: 'biometric',
    label: 'Four fingerprints',
    detail: 'Digital fingerprints collected once, reused for re-entries within retention window.',
    retention: `${EES_DATA_RETENTION_YEARS} years from last exit.`,
    yourRight: 'EDPS oversight applies. You may file a complaint if data is misused.',
  },
  {
    category: 'identity',
    label: 'Passport data',
    detail: 'Full name, nationality, date of birth, passport number & expiry — linked to biometrics.',
    retention: `${EES_DATA_RETENTION_YEARS} years.`,
    yourRight: 'Right of access, rectification, erasure (Art. 52 EES Regulation).',
  },
  {
    category: 'travel',
    label: 'Entry / exit timestamps',
    detail: 'Every border crossing recorded with date, time, location, refusal reason if any.',
    retention: `${EES_DATA_RETENTION_YEARS} years.`,
    yourRight: 'You may request your travel record from any EU border authority.',
  },
  {
    category: 'risk',
    label: 'Refusal of entry record',
    detail: 'If refused, the reason is logged and visible to all Schengen border guards.',
    retention: `${EES_RETENTION_AFTER_OVERSTAY_YEARS} years.`,
    yourRight: 'You may appeal the refusal under national law.',
  },
];

export interface EESScenario {
  id: string;
  title: string;
  status: 'safe' | 'caution' | 'critical';
  trigger: string;
  whatTheSystemSees: string;
  whatYouShouldDo: string;
  officialSource: string;
}

export const EES_SCENARIOS: EESScenario[] = [
  {
    id: 'first-entry',
    title: 'First Schengen entry under EES',
    status: 'caution',
    trigger: 'Your first border crossing on or after 12 Oct 2025.',
    whatTheSystemSees: 'No prior record — biometrics enrolled on the spot. Allow 5–15 extra minutes.',
    whatYouShouldDo: 'Arrive early, prepare passport, no metal jewellery on hands. Confirm scan quality before leaving the booth.',
    officialSource: EES_OFFICIAL.euTravel,
  },
  {
    id: 'approaching-90',
    title: 'Approaching the 90-day cap',
    status: 'caution',
    trigger: 'You have used 70+ of 90 allowed days in any 180-day window.',
    whatTheSystemSees: 'A live counter. Border guards see it instantly on next scan.',
    whatYouShouldDo: 'Use the official EU short-stay calculator and plan exit before day 90. SuperNomad will alert you 14, 7 and 1 day before the cap.',
    officialSource: EES_OFFICIAL.schengenCalc,
  },
  {
    id: 'overstay',
    title: 'Overstay (even 1 hour)',
    status: 'critical',
    trigger: 'You exit Schengen after the 90/180 limit.',
    whatTheSystemSees: 'Automatic flag. Refusal of entry record can be created. Data retained 5 years.',
    whatYouShouldDo: 'Contact the consulate of the country you are in BEFORE exit. Document the reason (illness, force majeure). Request a written record.',
    officialSource: EES_OFFICIAL.euHomeAffairs,
  },
  {
    id: 'data-rights',
    title: 'Request your EES record',
    status: 'safe',
    trigger: 'You want to see what the EU holds about you.',
    whatTheSystemSees: 'A formal Subject Access Request from the data subject.',
    whatYouShouldDo: 'Apply via the national data protection authority of any EU country, or via EDPS. Free of charge, response within 30 days.',
    officialSource: EES_OFFICIAL.dataRights,
  },
  {
    id: 'rectification',
    title: 'Wrong data on your record',
    status: 'caution',
    trigger: 'You spot an error after a Subject Access Request.',
    whatTheSystemSees: 'A rectification request — must be processed under Art. 52 of the EES Regulation.',
    whatYouShouldDo: 'File a written rectification request with the recording border authority. Keep proof of submission. Escalate to EDPS if not resolved in 60 days.',
    officialSource: EES_OFFICIAL.dataRights,
  },
];

export const EES_USER_RIGHTS = [
  { title: 'Right of access', body: 'Request a copy of all EES data held about you, free of charge.' },
  { title: 'Right to rectification', body: 'Demand correction of inaccurate biometric or travel data.' },
  { title: 'Right to erasure', body: 'After retention period or if data was unlawfully recorded.' },
  { title: 'Right to compensation', body: 'EU Member States are liable for damage caused by unlawful processing.' },
  { title: 'Right to lodge a complaint', body: 'With your national DPA or directly with the European Data Protection Supervisor (EDPS).' },
  { title: 'Right to judicial remedy', body: 'Bring action before national courts against any EES decision affecting you.' },
];

export const EES_COUNTRIES = [
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IT',
  'LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','CH'
];

export function isSchengenEES(countryCode: string): boolean {
  return EES_COUNTRIES.includes(countryCode.toUpperCase());
}

// ─── Schengen 90/180 Calculator (rolling window) ───
// Returns days used in the 180 days ending today, given a list of Schengen stays.
export interface SchengenStay { entry: string; exit: string | null; countryCode: string; }

export function calcSchengenUsage(stays: SchengenStay[], referenceDate = new Date()): {
  daysUsed: number;
  daysRemaining: number;
  windowStart: Date;
  status: 'safe' | 'caution' | 'critical';
} {
  const windowStart = new Date(referenceDate);
  windowStart.setDate(windowStart.getDate() - EES_SCHENGEN_WINDOW);

  let daysUsed = 0;
  for (const s of stays) {
    if (!isSchengenEES(s.countryCode)) continue;
    const entry = new Date(s.entry);
    const exit = s.exit ? new Date(s.exit) : referenceDate;
    const start = entry > windowStart ? entry : windowStart;
    const end = exit < referenceDate ? exit : referenceDate;
    if (end >= start) {
      const ms = end.getTime() - start.getTime();
      daysUsed += Math.max(0, Math.ceil(ms / 86400000));
    }
  }
  const daysRemaining = Math.max(0, EES_SCHENGEN_DAYS - daysUsed);
  const pct = (daysUsed / EES_SCHENGEN_DAYS) * 100;
  const status: 'safe' | 'caution' | 'critical' =
    pct >= 90 ? 'critical' : pct >= 70 ? 'caution' : 'safe';
  return { daysUsed, daysRemaining, windowStart, status };
}
