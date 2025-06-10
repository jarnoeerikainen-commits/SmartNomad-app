
import { CountryDetails, TrackingRecommendation, OfficialWebsites, StudentInfo, ExpatInfo } from '@/types/countryInfo';

// Default website template for countries
const createDefaultWebsites = (countryCode: string, countryName: string): OfficialWebsites => ({
  government: `https://www.gov.${countryCode.toLowerCase()}`,
  visa: `https://visa.${countryCode.toLowerCase()}`,
  visaApplication: `https://visa.${countryCode.toLowerCase()}/apply`,
  passport: `https://passport.gov.${countryCode.toLowerCase()}`,
  passportApplication: `https://passport.gov.${countryCode.toLowerCase()}/apply`,
  tourism: `https://www.visit${countryName.toLowerCase().replace(/\s+/g, '')}.com`
});

// Default student info template
const createDefaultStudentInfo = (): StudentInfo => ({
  studentVisaRequired: true,
  maxStudyDuration: 365,
  maxStudyDays: 365,
  workPermitWhileStudying: false,
  languageRequirements: ['English'],
  tuitionRange: { min: 10000, max: 50000 }
});

// Default expat info template
const createDefaultExpatInfo = (): ExpatInfo => ({
  residencyPermitRequired: true,
  minimumInvestment: 50000,
  languageRequirements: ['English'],
  averageCostOfLiving: 2000,
  popularExpatAreas: ['Capital City'],
  residencyRequirementDays: 183,
  permanentResidencyDays: 1095,
  citizenshipRequirementDays: 1825
});

export class CountryInfoService {
  private static countryDatabase: Map<string, CountryDetails> = new Map([
    ['US', {
      code: 'US',
      name: 'United States',
      flag: '🇺🇸',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: {
        police: '911',
        medical: '911',
        fire: '911'
      },
      costOfLiving: {
        low: 2000,
        medium: 4000,
        high: 8000
      },
      currency: 'USD',
      languages: ['English'],
      timeZones: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'],
      commonVisaTypes: ['B-1/B-2 Tourist', 'H-1B Work', 'F-1 Student'],
      businessRegistrationRequired: true,
      taxRate: {
        personal: { min: 10, max: 37 },
        corporate: 21
      },
      officialWebsites: createDefaultWebsites('us', 'United States'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['GB', {
      code: 'GB',
      name: 'United Kingdom',
      flag: '🇬🇧',
      visaFreeStays: {
        tourist: 180,
        business: 180,
        transit: 48
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: {
        police: '999',
        medical: '999',
        fire: '999'
      },
      costOfLiving: {
        low: 2500,
        medium: 4500,
        high: 8000
      },
      currency: 'GBP',
      languages: ['English'],
      timeZones: ['Europe/London'],
      commonVisaTypes: ['Standard Visitor', 'Tier 2 Work', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: {
        personal: { min: 20, max: 45 },
        corporate: 25
      },
      officialWebsites: createDefaultWebsites('uk', 'United Kingdom'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['DE', {
      code: 'DE',
      name: 'Germany',
      flag: '🇩🇪',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: {
        police: '110',
        medical: '112',
        fire: '112'
      },
      costOfLiving: {
        low: 1800,
        medium: 3500,
        high: 6000
      },
      currency: 'EUR',
      languages: ['German'],
      timeZones: ['Europe/Berlin'],
      commonVisaTypes: ['Schengen Tourist', 'EU Blue Card', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: {
        personal: { min: 14, max: 45 },
        corporate: 30
      },
      officialWebsites: createDefaultWebsites('de', 'Germany'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }]
  ]);

  static getCountryInfo(countryCode: string): CountryDetails | null {
    return this.countryDatabase.get(countryCode.toUpperCase()) || null;
  }

  static getAllCountries(): CountryDetails[] {
    return Array.from(this.countryDatabase.values());
  }

  static getCountryDetails(countryCode: string): CountryDetails | null {
    return this.getCountryInfo(countryCode);
  }

  static getVisaFreeStays(countryCode: string, reason: string): number {
    const country = this.getCountryInfo(countryCode);
    if (!country) return 90;
    
    switch (reason) {
      case 'Tourist visa limit':
        return country.visaFreeStays.tourist;
      case 'Business travel limit':
        return country.visaFreeStays.business;
      case 'Tax residence tracking':
        return country.taxResidencyDays;
      default:
        return country.visaFreeStays.tourist;
    }
  }

  static getRecommendedInfo(countryCode: string, reason: string) {
    const country = this.getCountryInfo(countryCode);
    if (!country) return null;

    return {
      dayLimit: this.getVisaFreeStays(countryCode, reason),
      currency: {
        code: country.currency,
        symbol: country.currency === 'USD' ? '$' : country.currency === 'EUR' ? '€' : country.currency === 'GBP' ? '£' : country.currency
      },
      emergencyNumbers: country.emergencyNumbers,
      healthInsuranceRequired: country.healthInsuranceRequired,
      commonVisaTypes: country.commonVisaTypes
    };
  }

  static getTrackingRecommendations(userType: 'tourist' | 'student' | 'expat' | 'business' | 'tax_compliance'): TrackingRecommendation[] {
    const recommendations: TrackingRecommendation[] = [];

    switch (userType) {
      case 'tourist':
        recommendations.push(
          {
            type: 'visa_free_limit',
            title: 'Schengen Area Tracking',
            description: 'Track your 90 days in 180 period across EU Schengen countries',
            countries: ['DE'],
            dayLimit: 90,
            priority: 'high'
          }
        );
        break;

      case 'tax_compliance':
        recommendations.push(
          {
            type: 'tax_residency',
            title: 'Tax Residency Monitoring',
            description: 'Track 183-day rule to avoid unintentional tax residency',
            countries: ['US', 'GB', 'DE'],
            dayLimit: 183,
            priority: 'critical'
          }
        );
        break;
    }

    return recommendations;
  }
}

export default CountryInfoService;
