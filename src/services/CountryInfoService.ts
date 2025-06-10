
import { CountryDetails, TrackingRecommendation, OfficialWebsites, StudentInfo, ExpatInfo } from '@/types/countryInfo';

// Default website template for countries
const createDefaultWebsites = (countryCode: string, countryName: string): OfficialWebsites => ({
  government: `https://www.gov.${countryCode.toLowerCase()}`,
  visa: `https://visa.${countryCode.toLowerCase()}`,
  passport: `https://passport.gov.${countryCode.toLowerCase()}`,
  tourism: `https://www.visit${countryName.toLowerCase().replace(/\s+/g, '')}.com`
});

// Default student info template
const createDefaultStudentInfo = (): StudentInfo => ({
  studentVisaRequired: true,
  maxStudyDuration: 365,
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
  popularExpatAreas: ['Capital City']
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
      costOfLiving: {
        low: 2000,
        medium: 4000,
        high: 8000
      },
      currency: 'USD',
      languages: ['English'],
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
      costOfLiving: {
        low: 2500,
        medium: 4500,
        high: 8000
      },
      currency: 'GBP',
      languages: ['English'],
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
      costOfLiving: {
        low: 1800,
        medium: 3500,
        high: 6000
      },
      currency: 'EUR',
      languages: ['German'],
      taxRate: {
        personal: { min: 14, max: 45 },
        corporate: 30
      },
      officialWebsites: createDefaultWebsites('de', 'Germany'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['FR', {
      code: 'FR',
      name: 'France',
      flag: '🇫🇷',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      costOfLiving: {
        low: 2000,
        medium: 3800,
        high: 7000
      },
      currency: 'EUR',
      languages: ['French'],
      taxRate: {
        personal: { min: 11, max: 45 },
        corporate: 25
      },
      officialWebsites: createDefaultWebsites('fr', 'France'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['IT', {
      code: 'IT',
      name: 'Italy',
      flag: '🇮🇹',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      costOfLiving: {
        low: 1500,
        medium: 2800,
        high: 5000
      },
      currency: 'EUR',
      languages: ['Italian'],
      taxRate: {
        personal: { min: 23, max: 43 },
        corporate: 24
      },
      officialWebsites: createDefaultWebsites('it', 'Italy'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['ES', {
      code: 'ES',
      name: 'Spain',
      flag: '🇪🇸',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      costOfLiving: {
        low: 1400,
        medium: 2500,
        high: 4500
      },
      currency: 'EUR',
      languages: ['Spanish'],
      taxRate: {
        personal: { min: 19, max: 47 },
        corporate: 25
      },
      officialWebsites: createDefaultWebsites('es', 'Spain'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['NL', {
      code: 'NL',
      name: 'Netherlands',
      flag: '🇳🇱',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      costOfLiving: {
        low: 2200,
        medium: 4000,
        high: 6500
      },
      currency: 'EUR',
      languages: ['Dutch'],
      taxRate: {
        personal: { min: 37, max: 49 },
        corporate: 25
      },
      officialWebsites: createDefaultWebsites('nl', 'Netherlands'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['CH', {
      code: 'CH',
      name: 'Switzerland',
      flag: '🇨🇭',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      costOfLiving: {
        low: 3500,
        medium: 6000,
        high: 10000
      },
      currency: 'CHF',
      languages: ['German', 'French', 'Italian'],
      taxRate: {
        personal: { min: 0, max: 40 },
        corporate: 21
      },
      officialWebsites: createDefaultWebsites('ch', 'Switzerland'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['AT', {
      code: 'AT',
      name: 'Austria',
      flag: '🇦🇹',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      costOfLiving: {
        low: 1800,
        medium: 3200,
        high: 5500
      },
      currency: 'EUR',
      languages: ['German'],
      taxRate: {
        personal: { min: 20, max: 55 },
        corporate: 25
      },
      officialWebsites: createDefaultWebsites('at', 'Austria'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['BE', {
      code: 'BE',
      name: 'Belgium',
      flag: '🇧🇪',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      costOfLiving: {
        low: 1900,
        medium: 3400,
        high: 5800
      },
      currency: 'EUR',
      languages: ['Dutch', 'French', 'German'],
      taxRate: {
        personal: { min: 25, max: 50 },
        corporate: 25
      },
      officialWebsites: createDefaultWebsites('be', 'Belgium'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['SE', {
      code: 'SE',
      name: 'Sweden',
      flag: '🇸🇪',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      costOfLiving: {
        low: 2200,
        medium: 3800,
        high: 6200
      },
      currency: 'SEK',
      languages: ['Swedish'],
      taxRate: {
        personal: { min: 0, max: 57 },
        corporate: 20
      },
      officialWebsites: createDefaultWebsites('se', 'Sweden'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['NO', {
      code: 'NO',
      name: 'Norway',
      flag: '🇳🇴',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      costOfLiving: {
        low: 2800,
        medium: 4800,
        high: 8000
      },
      currency: 'NOK',
      languages: ['Norwegian'],
      taxRate: {
        personal: { min: 22, max: 47 },
        corporate: 22
      },
      officialWebsites: createDefaultWebsites('no', 'Norway'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['DK', {
      code: 'DK',
      name: 'Denmark',
      flag: '🇩🇰',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      costOfLiving: {
        low: 2400,
        medium: 4200,
        high: 7000
      },
      currency: 'DKK',
      languages: ['Danish'],
      taxRate: {
        personal: { min: 37, max: 56 },
        corporate: 22
      },
      officialWebsites: createDefaultWebsites('dk', 'Denmark'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['FI', {
      code: 'FI',
      name: 'Finland',
      flag: '🇫🇮',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      costOfLiving: {
        low: 2000,
        medium: 3600,
        high: 6000
      },
      currency: 'EUR',
      languages: ['Finnish', 'Swedish'],
      taxRate: {
        personal: { min: 6, max: 44 },
        corporate: 20
      },
      officialWebsites: createDefaultWebsites('fi', 'Finland'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['PT', {
      code: 'PT',
      name: 'Portugal',
      flag: '🇵🇹',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      costOfLiving: {
        low: 1200,
        medium: 2200,
        high: 4000
      },
      currency: 'EUR',
      languages: ['Portuguese'],
      taxRate: {
        personal: { min: 14, max: 48 },
        corporate: 21
      },
      officialWebsites: createDefaultWebsites('pt', 'Portugal'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['IE', {
      code: 'IE',
      name: 'Ireland',
      flag: '🇮🇪',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      costOfLiving: {
        low: 2000,
        medium: 3800,
        high: 6500
      },
      currency: 'EUR',
      languages: ['English', 'Irish'],
      taxRate: {
        personal: { min: 20, max: 40 },
        corporate: 12
      },
      officialWebsites: createDefaultWebsites('ie', 'Ireland'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['PL', {
      code: 'PL',
      name: 'Poland',
      flag: '🇵🇱',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      costOfLiving: {
        low: 800,
        medium: 1500,
        high: 2800
      },
      currency: 'PLN',
      languages: ['Polish'],
      taxRate: {
        personal: { min: 17, max: 32 },
        corporate: 19
      },
      officialWebsites: createDefaultWebsites('pl', 'Poland'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['CZ', {
      code: 'CZ',
      name: 'Czech Republic',
      flag: '🇨🇿',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      costOfLiving: {
        low: 900,
        medium: 1600,
        high: 2800
      },
      currency: 'CZK',
      languages: ['Czech'],
      taxRate: {
        personal: { min: 15, max: 23 },
        corporate: 19
      },
      officialWebsites: createDefaultWebsites('cz', 'Czech Republic'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['HU', {
      code: 'HU',
      name: 'Hungary',
      flag: '🇭🇺',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      costOfLiving: {
        low: 700,
        medium: 1300,
        high: 2400
      },
      currency: 'HUF',
      languages: ['Hungarian'],
      taxRate: {
        personal: { min: 15, max: 15 },
        corporate: 9
      },
      officialWebsites: createDefaultWebsites('hu', 'Hungary'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['RO', {
      code: 'RO',
      name: 'Romania',
      flag: '🇷🇴',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      costOfLiving: {
        low: 600,
        medium: 1100,
        high: 2000
      },
      currency: 'RON',
      languages: ['Romanian'],
      taxRate: {
        personal: { min: 10, max: 10 },
        corporate: 16
      },
      officialWebsites: createDefaultWebsites('ro', 'Romania'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['BG', {
      code: 'BG',
      name: 'Bulgaria',
      flag: '🇧🇬',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 90
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      costOfLiving: {
        low: 500,
        medium: 900,
        high: 1600
      },
      currency: 'BGN',
      languages: ['Bulgarian'],
      taxRate: {
        personal: { min: 10, max: 10 },
        corporate: 10
      },
      officialWebsites: createDefaultWebsites('bg', 'Bulgaria'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['CA', {
      code: 'CA',
      name: 'Canada',
      flag: '🇨🇦',
      visaFreeStays: {
        tourist: 180,
        business: 180,
        transit: 48
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      costOfLiving: {
        low: 2500,
        medium: 4000,
        high: 7000
      },
      currency: 'CAD',
      languages: ['English', 'French'],
      taxRate: {
        personal: { min: 15, max: 33 },
        corporate: 27
      },
      officialWebsites: createDefaultWebsites('ca', 'Canada'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['AU', {
      code: 'AU',
      name: 'Australia',
      flag: '🇦🇺',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 8
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      costOfLiving: {
        low: 2800,
        medium: 4500,
        high: 7500
      },
      currency: 'AUD',
      languages: ['English'],
      taxRate: {
        personal: { min: 19, max: 45 },
        corporate: 30
      },
      officialWebsites: createDefaultWebsites('au', 'Australia'),
      studentInfo: createDefaultStudentInfo(),
      expatInfo: createDefaultExpatInfo()
    }],
    ['NZ', {
      code: 'NZ',
      name: 'New Zealand',
      flag: '🇳🇿',
      visaFreeStays: {
        tourist: 90,
        business: 90,
        transit: 24
      },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      costOfLiving: {
        low: 2200,
        medium: 3800,
        high: 6500
      },
      currency: 'NZD',
      languages: ['English'],
      taxRate: {
        personal: { min: 10, max: 39 },
        corporate: 28
      },
      officialWebsites: createDefaultWebsites('nz', 'New Zealand'),
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

  static getTrackingRecommendations(userType: 'tourist' | 'student' | 'expat' | 'business' | 'tax_compliance'): TrackingRecommendation[] {
    const recommendations: TrackingRecommendation[] = [];

    switch (userType) {
      case 'tourist':
        recommendations.push(
          {
            type: 'visa_free_limit',
            title: 'Schengen Area Tracking',
            description: 'Track your 90 days in 180 period across EU Schengen countries',
            countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'AT', 'BE', 'PT'],
            dayLimit: 90,
            priority: 'high'
          },
          {
            type: 'visa_free_limit',
            title: 'UK Tourist Limit',
            description: 'Track your 180-day tourist allowance in the UK',
            countries: ['GB'],
            dayLimit: 180,
            priority: 'medium'
          }
        );
        break;

      case 'student':
        recommendations.push(
          {
            type: 'study_visa',
            title: 'Student Visa Compliance',
            description: 'Monitor study visa duration and work permit restrictions',
            countries: ['US', 'GB', 'CA', 'AU'],
            dayLimit: 365,
            priority: 'high'
          }
        );
        break;

      case 'expat':
        recommendations.push(
          {
            type: 'residency_permit',
            title: 'Residency Permit Tracking',
            description: 'Track residency requirements and renewal dates',
            countries: ['DE', 'NL', 'CH', 'SE'],
            dayLimit: 365,
            priority: 'high'
          }
        );
        break;

      case 'business':
        recommendations.push(
          {
            type: 'business_travel',
            title: 'Business Travel Limits',
            description: 'Track business travel allowances and work permit requirements',
            countries: ['US', 'GB', 'DE', 'FR', 'CA'],
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
            countries: ['US', 'GB', 'DE', 'FR', 'CH', 'NL'],
            dayLimit: 183,
            priority: 'critical'
          },
          {
            type: 'substantial_presence',
            title: 'US Substantial Presence Test',
            description: 'Monitor US presence for tax purposes (3-year weighted average)',
            countries: ['US'],
            dayLimit: 122,
            priority: 'high'
          }
        );
        break;
    }

    return recommendations;
  }
}
