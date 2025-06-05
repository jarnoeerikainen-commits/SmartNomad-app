
import { CountryDetails } from '@/types/countryInfo';

const COUNTRY_DATABASE: Record<string, CountryDetails> = {
  'US': {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    visaFreeStays: { tourist: 90, business: 90, transit: 30 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '911', medical: '911', fire: '911' },
    currency: { code: 'USD', symbol: '$' },
    timeZones: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'],
    commonVisaTypes: ['B-1/B-2 Tourist', 'H-1B Work', 'L-1 Intracompany'],
    businessRegistrationRequired: true,
    taxRate: { personal: 22, corporate: 21 }
  },
  'GB': {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    visaFreeStays: { tourist: 180, business: 180, transit: 48 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '999', medical: '999', fire: '999' },
    currency: { code: 'GBP', symbol: '£' },
    timeZones: ['Europe/London'],
    commonVisaTypes: ['Standard Visitor', 'Skilled Worker', 'Youth Mobility'],
    businessRegistrationRequired: true,
    taxRate: { personal: 20, corporate: 19 }
  },
  'DE': {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '110', medical: '112', fire: '112' },
    currency: { code: 'EUR', symbol: '€' },
    timeZones: ['Europe/Berlin'],
    commonVisaTypes: ['Schengen Tourist', 'EU Blue Card', 'Job Seeker'],
    businessRegistrationRequired: true,
    taxRate: { personal: 42, corporate: 30 }
  },
  'FR': {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '17', medical: '15', fire: '18' },
    currency: { code: 'EUR', symbol: '€' },
    timeZones: ['Europe/Paris'],
    commonVisaTypes: ['Schengen Tourist', 'Talent Passport', 'Working Holiday'],
    businessRegistrationRequired: true,
    taxRate: { personal: 45, corporate: 25 }
  },
  'ES': {
    code: 'ES',
    name: 'Spain',
    flag: '🇪🇸',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '091', medical: '061', fire: '080' },
    currency: { code: 'EUR', symbol: '€' },
    timeZones: ['Europe/Madrid'],
    commonVisaTypes: ['Schengen Tourist', 'Non-lucrative Visa', 'Digital Nomad'],
    businessRegistrationRequired: true,
    taxRate: { personal: 47, corporate: 25 }
  },
  'SG': {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    visaFreeStays: { tourist: 90, business: 90, transit: 96 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '999', medical: '995', fire: '995' },
    currency: { code: 'SGD', symbol: 'S$' },
    timeZones: ['Asia/Singapore'],
    commonVisaTypes: ['Tourist', 'Employment Pass', 'Tech.Pass'],
    businessRegistrationRequired: true,
    taxRate: { personal: 22, corporate: 17 }
  },
  'TH': {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    visaFreeStays: { tourist: 60, business: 90, transit: 30 },
    taxResidencyDays: 180,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '191', medical: '1669', fire: '199' },
    currency: { code: 'THB', symbol: '฿' },
    timeZones: ['Asia/Bangkok'],
    commonVisaTypes: ['Tourist', 'Non-Immigrant B', 'LTR Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 35, corporate: 20 }
  },
  'AU': {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    visaFreeStays: { tourist: 90, business: 90, transit: 8 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '000', medical: '000', fire: '000' },
    currency: { code: 'AUD', symbol: 'A$' },
    timeZones: ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth'],
    commonVisaTypes: ['eVisitor', 'Working Holiday', 'Skilled Independent'],
    businessRegistrationRequired: true,
    taxRate: { personal: 45, corporate: 25 }
  }
};

class CountryInfoService {
  static getCountryDetails(countryCode: string): CountryDetails | null {
    return COUNTRY_DATABASE[countryCode] || null;
  }

  static getVisaFreeStays(countryCode: string, reason: string): number {
    const country = this.getCountryDetails(countryCode);
    if (!country) return 90; // Default

    switch (reason) {
      case 'Tourist visa limit':
        return country.visaFreeStays.tourist;
      case 'Business travel limit':
        return country.visaFreeStays.business;
      case 'Tax residence tracking':
        return country.taxResidencyDays;
      case 'Schengen area limit':
        return 90; // Schengen rule
      case 'Work permit limit':
        return 365; // Assume yearly permit
      default:
        return country.visaFreeStays.tourist;
    }
  }

  static getRecommendedInfo(countryCode: string, reason: string) {
    const country = this.getCountryDetails(countryCode);
    if (!country) return null;

    const dayLimit = this.getVisaFreeStays(countryCode, reason);
    
    return {
      dayLimit,
      emergencyNumbers: country.emergencyNumbers,
      currency: country.currency,
      taxRate: reason === 'Tax residence tracking' ? country.taxRate : null,
      workPermitRequired: reason === 'Business travel limit' || reason === 'Work permit limit' ? country.workPermitRequired : null,
      healthInsuranceRequired: country.healthInsuranceRequired,
      commonVisaTypes: country.commonVisaTypes,
      timeZones: country.timeZones
    };
  }

  static getAllCountries(): CountryDetails[] {
    return Object.values(COUNTRY_DATABASE);
  }
}

export default CountryInfoService;
