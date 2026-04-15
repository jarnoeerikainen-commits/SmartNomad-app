// Accidental Expat Detector — analyzes travel patterns to flag unintended tax residency risks

import { Country } from '@/types/country';

export interface ExpatAlert {
  id: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  daysSpent: number;
  dayLimit: number;
  percentage: number;
  recommendation: string;
  ruleSource: string;
}

// Known tax residency thresholds per country
const TAX_RESIDENCY_RULES: Record<string, { days: number; period: string; rule: string }> = {
  US: { days: 183, period: 'calendar year', rule: 'Substantial Presence Test (also considers prior 2 years)' },
  GB: { days: 183, period: 'tax year (6 Apr–5 Apr)', rule: 'Statutory Residence Test' },
  DE: { days: 183, period: 'calendar year', rule: '§ 9 AO habitual abode' },
  FR: { days: 183, period: 'calendar year', rule: 'Article 4 B CGI' },
  ES: { days: 183, period: 'calendar year', rule: 'Article 9 LIRPF' },
  PT: { days: 183, period: 'calendar year', rule: 'Article 16 CIRS' },
  IT: { days: 183, period: 'calendar year', rule: 'Article 2 TUIR' },
  NL: { days: 183, period: 'calendar year', rule: 'Facts & circumstances test' },
  TH: { days: 180, period: 'calendar year', rule: 'Revenue Code Section 41' },
  AE: { days: 183, period: 'calendar year', rule: 'Cabinet Decision No. 85/2022' },
  SG: { days: 183, period: 'calendar year', rule: 'Income Tax Act Section 2' },
  JP: { days: 183, period: 'calendar year', rule: 'Income Tax Act' },
  AU: { days: 183, period: 'income year (1 Jul–30 Jun)', rule: 'Resides test / 183-day rule' },
  CA: { days: 183, period: 'calendar year', rule: 'Income Tax Act Section 250' },
  CH: { days: 90, period: 'calendar year (gainful employment)', rule: 'DBG Art. 3' },
  ID: { days: 183, period: '12-month period', rule: 'Income Tax Law Article 2' },
  MX: { days: 183, period: 'calendar year', rule: 'ISR Article 9' },
  BR: { days: 183, period: '12-month period', rule: 'IN SRF 208/2002' },
  IN: { days: 120, period: 'financial year (1 Apr–31 Mar)', rule: 'Income Tax Bill 2025 — NRIs with ₹15L+ Indian income: 120-day threshold' },
  PL: { days: 183, period: 'calendar year', rule: 'PIT Act Article 3' },
  CZ: { days: 183, period: 'calendar year', rule: 'Income Tax Act Section 2' },
  HR: { days: 183, period: 'calendar year', rule: 'Income Tax Act' },
  GR: { days: 183, period: 'calendar year', rule: 'Income Tax Code Article 4' },
  CO: { days: 183, period: 'calendar year or 365-day period', rule: 'Estatuto Tributario Article 10' },
  CR: { days: 183, period: 'calendar year', rule: 'Income Tax Law' },
  MY: { days: 182, period: 'calendar year', rule: 'Income Tax Act Section 7' },
  PH: { days: 180, period: 'calendar year', rule: 'NIRC Section 22' },
  VN: { days: 183, period: 'calendar year or 12-month period', rule: 'Law on Personal Income Tax' },
  KR: { days: 183, period: 'calendar year', rule: 'Income Tax Act Article 1-2' },
  ZA: { days: 91, period: 'current year + 915 over 5 years', rule: 'Physical Presence Test' },
};

// Schengen zone countries share a 90/180-day rule
const SCHENGEN_COUNTRIES = [
  'AT', 'BE', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'SK', 'SI', 'ES', 'SE', 'CH',
  'HR', 'BG', 'RO'
];

export class ExpatDetectorService {
  
  static analyzeCountries(countries: Country[]): ExpatAlert[] {
    const alerts: ExpatAlert[] = [];

    for (const country of countries) {
      // Tax residency threshold check
      const rule = TAX_RESIDENCY_RULES[country.code];
      const threshold = rule?.days || country.dayLimit;
      const pct = threshold > 0 ? (country.daysSpent / threshold) * 100 : 0;

      if (pct >= 90) {
        alerts.push({
          id: `critical-${country.code}`,
          countryCode: country.code,
          countryName: country.name,
          countryFlag: country.flag,
          severity: 'critical',
          title: `⚠️ Tax residency likely triggered in ${country.name}`,
          description: `You've spent ${country.daysSpent} of ${threshold} days — you are at or near the tax residency threshold.`,
          daysSpent: country.daysSpent,
          dayLimit: threshold,
          percentage: pct,
          recommendation: `Consult a tax advisor immediately. ${rule ? `Rule: ${rule.rule} (${rule.period})` : 'Check local tax authority.'}`,
          ruleSource: rule?.rule || 'General threshold'
        });
      } else if (pct >= 70) {
        alerts.push({
          id: `warning-${country.code}`,
          countryCode: country.code,
          countryName: country.name,
          countryFlag: country.flag,
          severity: 'warning',
          title: `${country.name}: Approaching tax residency`,
          description: `${country.daysSpent} of ${threshold} days used (${Math.round(pct)}%). Only ${threshold - country.daysSpent} days remaining.`,
          daysSpent: country.daysSpent,
          dayLimit: threshold,
          percentage: pct,
          recommendation: `Plan your remaining travel carefully. ${rule ? `Period: ${rule.period}` : ''}`,
          ruleSource: rule?.rule || 'General threshold'
        });
      } else if (pct >= 50) {
        alerts.push({
          id: `info-${country.code}`,
          countryCode: country.code,
          countryName: country.name,
          countryFlag: country.flag,
          severity: 'info',
          title: `${country.name}: Monitor your stay`,
          description: `${country.daysSpent} of ${threshold} days used (${Math.round(pct)}%). ${threshold - country.daysSpent} days remaining.`,
          daysSpent: country.daysSpent,
          dayLimit: threshold,
          percentage: pct,
          recommendation: `Keep tracking. You still have buffer but be mindful of extended stays.`,
          ruleSource: rule?.rule || 'General threshold'
        });
      }
    }

    // Schengen aggregate check
    const schengenCountries = countries.filter(c => SCHENGEN_COUNTRIES.includes(c.code));
    if (schengenCountries.length > 0) {
      const totalSchengenDays = schengenCountries.reduce((sum, c) => sum + c.daysSpent, 0);
      const schengenLimit = 90;
      const schengenPct = (totalSchengenDays / schengenLimit) * 100;
      
      if (schengenPct >= 70) {
        alerts.push({
          id: 'schengen-aggregate',
          countryCode: 'EU',
          countryName: 'Schengen Area',
          countryFlag: '🇪🇺',
          severity: schengenPct >= 90 ? 'critical' : 'warning',
          title: schengenPct >= 90 
            ? '⚠️ Schengen 90-day limit nearly exhausted'
            : 'Schengen Area: Monitor combined days',
          description: `Combined ${totalSchengenDays} days across ${schengenCountries.length} Schengen countries (limit: ${schengenLimit} in 180-day window).`,
          daysSpent: totalSchengenDays,
          dayLimit: schengenLimit,
          percentage: schengenPct,
          recommendation: 'The 90/180-day rule applies to ALL Schengen countries combined. Consider time outside the zone.',
          ruleSource: 'Schengen Border Code Article 6'
        });
      }
    }

    // Sort: critical first, then warning, then info
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return alerts;
  }

  static isSchengenCountry(code: string): boolean {
    return SCHENGEN_COUNTRIES.includes(code);
  }

  static getTaxRule(code: string) {
    return TAX_RESIDENCY_RULES[code] || null;
  }
}
