// Visa Auto-Matcher — recommends digital nomad visas based on nationality & travel patterns

import { Country } from '@/types/country';

export interface VisaMatch {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  visaName: string;
  duration: string;
  eligibilityScore: number; // 0-100
  incomeRequirement?: string;
  taxBenefit: string;
  highlights: string[];
  applyUrl: string;
  processingTime: string;
  matchReasons: string[];
}

// Database of digital nomad / remote worker visas (2024-2026 data)
const NOMAD_VISAS: Omit<VisaMatch, 'eligibilityScore' | 'matchReasons'>[] = [
  {
    id: 'pt-d8', country: 'Portugal', countryCode: 'PT', flag: '🇵🇹',
    visaName: 'D8 Digital Nomad Visa', duration: '1 year (renewable)',
    incomeRequirement: '€3,510/month', taxBenefit: 'NHR regime: 20% flat rate for 10 years',
    highlights: ['EU residency path', 'Schengen access', 'NHR tax benefits', 'Strong expat community'],
    applyUrl: 'https://www.sef.pt', processingTime: '2-3 months'
  },
  {
    id: 'es-nomad', country: 'Spain', countryCode: 'ES', flag: '🇪🇸',
    visaName: 'Digital Nomad Visa', duration: '1 year (renewable to 3)',
    incomeRequirement: '€2,520/month', taxBenefit: 'Beckham Law: 24% flat rate for 6 years',
    highlights: ['EU residency', 'Beckham Law tax', 'Mediterranean lifestyle', 'Fast processing'],
    applyUrl: 'https://www.inclusion.gob.es', processingTime: '20 business days'
  },
  {
    id: 'hr-nomad', country: 'Croatia', countryCode: 'HR', flag: '🇭🇷',
    visaName: 'Digital Nomad Permit', duration: '1 year',
    incomeRequirement: '€2,540/month', taxBenefit: 'No Croatian income tax on foreign income',
    highlights: ['No local income tax', 'EU member', 'Low cost of living', 'Adriatic coast'],
    applyUrl: 'https://mup.gov.hr', processingTime: '1-2 months'
  },
  {
    id: 'gr-nomad', country: 'Greece', countryCode: 'GR', flag: '🇬🇷',
    visaName: 'Digital Nomad Visa', duration: '1 year (renewable)',
    incomeRequirement: '€3,500/month', taxBenefit: '50% income tax reduction for 7 years',
    highlights: ['50% tax reduction', 'EU access', 'Island lifestyle', 'Growing tech scene'],
    applyUrl: 'https://www.migration.gov.gr', processingTime: '2-3 months'
  },
  {
    id: 'ae-freelance', country: 'UAE', countryCode: 'AE', flag: '🇦🇪',
    visaName: 'Freelancer / Remote Work Visa', duration: '1 year',
    incomeRequirement: '$3,500/month', taxBenefit: '0% personal income tax',
    highlights: ['Zero income tax', 'World-class infrastructure', 'Global hub', 'Safe & modern'],
    applyUrl: 'https://www.mohre.gov.ae', processingTime: '5-10 business days'
  },
  {
    id: 'th-ltr', country: 'Thailand', countryCode: 'TH', flag: '🇹🇭',
    visaName: 'Long-Term Resident (LTR) Visa', duration: '5 years (renewable)',
    incomeRequirement: '$80,000/year', taxBenefit: '17% flat tax (vs progressive to 35%)',
    highlights: ['5-year visa', 'Flat 17% tax', 'Fast-track immigration', 'Tropical lifestyle'],
    applyUrl: 'https://ltr.boi.go.th', processingTime: '20 business days'
  },
  {
    id: 'my-de-rantau', country: 'Malaysia', countryCode: 'MY', flag: '🇲🇾',
    visaName: 'DE Rantau Nomad Pass', duration: '3-12 months',
    incomeRequirement: '$24,000/year', taxBenefit: 'Foreign income not taxed if not remitted',
    highlights: ['Low cost of living', 'Diverse culture', 'Fast internet', 'No tax on foreign income'],
    applyUrl: 'https://mdec.my/derantau', processingTime: '2-4 weeks'
  },
  {
    id: 'co-nomad', country: 'Colombia', countryCode: 'CO', flag: '🇨🇴',
    visaName: 'Digital Nomad Visa', duration: '2 years',
    incomeRequirement: '$684/month (3x min wage)', taxBenefit: 'No Colombian tax if non-resident',
    highlights: ['Very low income requirement', '2-year duration', 'Vibrant cities', 'No local tax'],
    applyUrl: 'https://www.cancilleria.gov.co', processingTime: '1-2 months'
  },
  {
    id: 'br-nomad', country: 'Brazil', countryCode: 'BR', flag: '🇧🇷',
    visaName: 'Digital Nomad Visa', duration: '1 year (renewable)',
    incomeRequirement: '$1,500/month', taxBenefit: 'Foreign income not taxed for non-residents',
    highlights: ['Affordable requirement', 'Large country', 'Cultural richness', 'Growing tech ecosystem'],
    applyUrl: 'https://www.gov.br/mre', processingTime: '1-2 months'
  },
  {
    id: 'ee-nomad', country: 'Estonia', countryCode: 'EE', flag: '🇪🇪',
    visaName: 'Digital Nomad Visa', duration: '1 year',
    incomeRequirement: '€4,500/month (last 6 months)', taxBenefit: 'Only tax on Estonian-source income',
    highlights: ['E-Residency ecosystem', 'Advanced digital services', 'EU access', 'Tech-forward'],
    applyUrl: 'https://www.e-resident.gov.ee', processingTime: '15-30 days'
  },
  {
    id: 'mt-nomad', country: 'Malta', countryCode: 'MT', flag: '🇲🇹',
    visaName: 'Nomad Residence Permit', duration: '1 year (renewable to 3)',
    incomeRequirement: '€2,700/month', taxBenefit: '15% flat tax on remitted income',
    highlights: ['English-speaking', 'EU member', 'Mediterranean', '15% flat tax option'],
    applyUrl: 'https://residencymalta.gov.mt', processingTime: '1-3 months'
  },
  {
    id: 'cr-nomad', country: 'Costa Rica', countryCode: 'CR', flag: '🇨🇷',
    visaName: 'Digital Nomad Visa', duration: '1 year (renewable)',
    incomeRequirement: '$3,000/month', taxBenefit: 'Territorial tax: no tax on foreign income',
    highlights: ['No tax on foreign income', 'Pura Vida lifestyle', 'Nature & biodiversity', 'Stable democracy'],
    applyUrl: 'https://www.migracion.go.cr', processingTime: '15-30 business days'
  },
  {
    id: 'is-nomad', country: 'Iceland', countryCode: 'IS', flag: '🇮🇸',
    visaName: 'Remote Work Long-Term Visa', duration: '6 months',
    incomeRequirement: 'ISK 1,000,000/month (~$7,200)', taxBenefit: 'Standard Icelandic tax applies',
    highlights: ['Stunning nature', 'Safe country', 'Schengen access', 'High quality of life'],
    applyUrl: 'https://www.utl.is', processingTime: '2-4 weeks'
  },
  {
    id: 'it-nomad', country: 'Italy', countryCode: 'IT', flag: '🇮🇹',
    visaName: 'Digital Nomad Visa', duration: '1 year (renewable)',
    incomeRequirement: '€28,000/year', taxBenefit: '70% tax exemption for new residents (Impatriate regime)',
    highlights: ['70% tax exemption', 'EU residency', 'World-class food & culture', 'New 2024 program'],
    applyUrl: 'https://www.esteri.it', processingTime: '1-3 months'
  },
];

export class VisaAutoMatcherService {
  
  static matchVisas(
    nationality: string,
    countries: Country[],
    income?: string
  ): VisaMatch[] {
    const travelledCodes = new Set(countries.map(c => c.code));
    const totalDaysAbroad = countries.reduce((sum, c) => sum + c.daysSpent, 0);

    return NOMAD_VISAS.map(visa => {
      let score = 50; // base score
      const reasons: string[] = [];

      // Boost if user already travels to this region
      if (travelledCodes.has(visa.countryCode)) {
        score += 15;
        reasons.push(`You already track ${visa.country}`);
      }

      // Boost for heavy travelers
      if (totalDaysAbroad > 120) {
        score += 10;
        reasons.push('High travel frequency matches nomad lifestyle');
      }

      // Boost for tax-free/low-tax destinations
      if (visa.taxBenefit.toLowerCase().includes('0%') || visa.taxBenefit.toLowerCase().includes('no tax')) {
        score += 10;
        reasons.push('Tax-efficient destination');
      }

      // Boost for EU access if user tracks EU countries
      const euCountries = countries.filter(c => 
        ['DE','FR','ES','PT','IT','NL','BE','AT','GR','HR','PL','CZ','SE','DK','FI','IE','RO','BG','HU','SK','SI','LT','LV','EE','MT','LU','CY'].includes(c.code)
      );
      if (euCountries.length >= 2 && visa.highlights.some(h => h.toLowerCase().includes('eu'))) {
        score += 8;
        reasons.push('EU access aligns with your travel pattern');
      }

      // Boost for low income requirements (accessible)
      if (visa.incomeRequirement) {
        const amount = parseFloat(visa.incomeRequirement.replace(/[^0-9.]/g, ''));
        if (amount < 3000) {
          score += 5;
          reasons.push('Low income requirement');
        }
      }

      // Boost for long-duration visas
      if (visa.duration.includes('2 year') || visa.duration.includes('5 year')) {
        score += 7;
        reasons.push('Extended visa duration');
      }

      // Nationality-based adjustments (simplified)
      if (nationality && ['US', 'GB', 'CA', 'AU'].includes(nationality.toUpperCase())) {
        score += 3; // Generally more visa options for these nationalities
        reasons.push('Strong passport compatibility');
      }

      if (reasons.length === 0) {
        reasons.push('General digital nomad eligibility');
      }

      return {
        ...visa,
        eligibilityScore: Math.min(score, 98),
        matchReasons: reasons
      };
    })
    .sort((a, b) => b.eligibilityScore - a.eligibilityScore);
  }
}
