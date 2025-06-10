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
    taxRate: { personal: 22, corporate: 21 },
    officialWebsites: {
      government: 'https://www.usa.gov',
      visaApplication: 'https://travel.state.gov',
      passportApplication: 'https://travel.state.gov/content/travel/en/passports.html',
      tourism: 'https://www.visittheusa.com'
    },
    studentInfo: {
      maxStudyDays: 365,
      workRightsWhileStudying: true,
      postGraduationWorkDays: 365
    },
    expatInfo: {
      residencyRequirementDays: 183,
      permanentResidencyDays: 1825,
      citizenshipRequirementDays: 1825
    }
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
    taxRate: { personal: 20, corporate: 19 },
    officialWebsites: {
      government: 'https://www.gov.uk',
      visaApplication: 'https://www.gov.uk/apply-uk-visa',
      passportApplication: 'https://www.gov.uk/passport-fees',
      tourism: 'https://www.visitbritain.com'
    },
    studentInfo: {
      maxStudyDays: 365,
      workRightsWhileStudying: true,
      postGraduationWorkDays: 730
    },
    expatInfo: {
      residencyRequirementDays: 183,
      permanentResidencyDays: 1825,
      citizenshipRequirementDays: 1825
    }
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
    taxRate: { personal: 42, corporate: 30 },
    officialWebsites: {
      government: 'https://www.deutschland.de',
      visaApplication: 'https://www.germany.travel/en/ms/visa-customs/visa.html',
      passportApplication: 'https://www.germany.travel/en/ms/visa-customs/passport.html',
      tourism: 'https://www.germany.travel'
    },
    studentInfo: {
      maxStudyDays: 365,
      workRightsWhileStudying: true,
      postGraduationWorkDays: 540
    },
    expatInfo: {
      residencyRequirementDays: 183,
      permanentResidencyDays: 1825,
      citizenshipRequirementDays: 2920
    }
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
  'IT': {
    code: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '113', medical: '118', fire: '115' },
    currency: { code: 'EUR', symbol: '€' },
    timeZones: ['Europe/Rome'],
    commonVisaTypes: ['Schengen Tourist', 'Work Visa', 'Self-Employment'],
    businessRegistrationRequired: true,
    taxRate: { personal: 43, corporate: 24 }
  },
  'NL': {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '112', medical: '112', fire: '112' },
    currency: { code: 'EUR', symbol: '€' },
    timeZones: ['Europe/Amsterdam'],
    commonVisaTypes: ['Schengen Tourist', 'Highly Skilled Migrant', 'Startup Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 49, corporate: 25 }
  },
  'CH': {
    code: 'CH',
    name: 'Switzerland',
    flag: '🇨🇭',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '117', medical: '144', fire: '118' },
    currency: { code: 'CHF', symbol: 'CHF' },
    timeZones: ['Europe/Zurich'],
    commonVisaTypes: ['Schengen Tourist', 'Work Permit B', 'Investor Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 40, corporate: 21 }
  },
  'AT': {
    code: 'AT',
    name: 'Austria',
    flag: '🇦🇹',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '133', medical: '144', fire: '122' },
    currency: { code: 'EUR', symbol: '€' },
    timeZones: ['Europe/Vienna'],
    commonVisaTypes: ['Schengen Tourist', 'Red-White-Red Card', 'EU Blue Card'],
    businessRegistrationRequired: true,
    taxRate: { personal: 50, corporate: 25 }
  },
  'BE': {
    code: 'BE',
    name: 'Belgium',
    flag: '🇧🇪',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '101', medical: '112', fire: '112' },
    currency: { code: 'EUR', symbol: '€' },
    timeZones: ['Europe/Brussels'],
    commonVisaTypes: ['Schengen Tourist', 'EU Blue Card', 'Work Permit'],
    businessRegistrationRequired: true,
    taxRate: { personal: 50, corporate: 25 }
  },
  'SE': {
    code: 'SE',
    name: 'Sweden',
    flag: '🇸🇪',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '112', medical: '112', fire: '112' },
    currency: { code: 'SEK', symbol: 'kr' },
    timeZones: ['Europe/Stockholm'],
    commonVisaTypes: ['Schengen Tourist', 'Work Permit', 'Startup Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 52, corporate: 20 }
  },
  'NO': {
    code: 'NO',
    name: 'Norway',
    flag: '🇳🇴',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '112', medical: '113', fire: '110' },
    currency: { code: 'NOK', symbol: 'kr' },
    timeZones: ['Europe/Oslo'],
    commonVisaTypes: ['Schengen Tourist', 'Skilled Worker', 'Family Immigration'],
    businessRegistrationRequired: true,
    taxRate: { personal: 47, corporate: 22 }
  },
  'DK': {
    code: 'DK',
    name: 'Denmark',
    flag: '🇩🇰',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '114', medical: '112', fire: '112' },
    currency: { code: 'DKK', symbol: 'kr' },
    timeZones: ['Europe/Copenhagen'],
    commonVisaTypes: ['Schengen Tourist', 'Positive List', 'Startup Denmark'],
    businessRegistrationRequired: true,
    taxRate: { personal: 56, corporate: 22 }
  },
  'FI': {
    code: 'FI',
    name: 'Finland',
    flag: '🇫🇮',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '112', medical: '112', fire: '112' },
    currency: { code: 'EUR', symbol: '€' },
    timeZones: ['Europe/Helsinki'],
    commonVisaTypes: ['Schengen Tourist', 'Specialist', 'Startup Permit'],
    businessRegistrationRequired: true,
    taxRate: { personal: 51, corporate: 20 }
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
  'HK': {
    code: 'HK',
    name: 'Hong Kong',
    flag: '🇭🇰',
    visaFreeStays: { tourist: 90, business: 90, transit: 7 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '999', medical: '999', fire: '999' },
    currency: { code: 'HKD', symbol: 'HK$' },
    timeZones: ['Asia/Hong_Kong'],
    commonVisaTypes: ['Visit Visa', 'Investment Visa', 'Quality Migrant'],
    businessRegistrationRequired: true,
    taxRate: { personal: 17, corporate: 16 }
  },
  'JP': {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    visaFreeStays: { tourist: 90, business: 90, transit: 15 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '110', medical: '119', fire: '119' },
    currency: { code: 'JPY', symbol: '¥' },
    timeZones: ['Asia/Tokyo'],
    commonVisaTypes: ['Tourist', 'Working Holiday', 'Highly Skilled Professional'],
    businessRegistrationRequired: true,
    taxRate: { personal: 55, corporate: 30 }
  },
  'KR': {
    code: 'KR',
    name: 'South Korea',
    flag: '🇰🇷',
    visaFreeStays: { tourist: 90, business: 90, transit: 30 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '112', medical: '119', fire: '119' },
    currency: { code: 'KRW', symbol: '₩' },
    timeZones: ['Asia/Seoul'],
    commonVisaTypes: ['Tourist', 'Working Holiday', 'E-7 Skilled Worker'],
    businessRegistrationRequired: true,
    taxRate: { personal: 45, corporate: 25 }
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
  'MY': {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    visaFreeStays: { tourist: 90, business: 90, transit: 120 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '999', medical: '999', fire: '994' },
    currency: { code: 'MYR', symbol: 'RM' },
    timeZones: ['Asia/Kuala_Lumpur'],
    commonVisaTypes: ['Tourist', 'Malaysia My Second Home', 'Professional Visit Pass'],
    businessRegistrationRequired: true,
    taxRate: { personal: 30, corporate: 24 }
  },
  'PH': {
    code: 'PH',
    name: 'Philippines',
    flag: '🇵🇭',
    visaFreeStays: { tourist: 30, business: 59, transit: 72 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '117', medical: '911', fire: '116' },
    currency: { code: 'PHP', symbol: '₱' },
    timeZones: ['Asia/Manila'],
    commonVisaTypes: ['Tourist', 'Special Resident Retiree', 'Work Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 35, corporate: 30 }
  },
  'ID': {
    code: 'ID',
    name: 'Indonesia',
    flag: '🇮🇩',
    visaFreeStays: { tourist: 30, business: 30, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '110', medical: '119', fire: '113' },
    currency: { code: 'IDR', symbol: 'Rp' },
    timeZones: ['Asia/Jakarta'],
    commonVisaTypes: ['Visa on Arrival', 'B211A Visit', 'B213 Work'],
    businessRegistrationRequired: true,
    taxRate: { personal: 35, corporate: 22 }
  },
  'VN': {
    code: 'VN',
    name: 'Vietnam',
    flag: '🇻🇳',
    visaFreeStays: { tourist: 45, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '113', medical: '115', fire: '114' },
    currency: { code: 'VND', symbol: '₫' },
    timeZones: ['Asia/Ho_Chi_Minh'],
    commonVisaTypes: ['E-visa', 'Business Visa', 'Work Permit'],
    businessRegistrationRequired: true,
    taxRate: { personal: 35, corporate: 20 }
  },
  'IN': {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    visaFreeStays: { tourist: 60, business: 180, transit: 24 },
    taxResidencyDays: 182,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '100', medical: '102', fire: '101' },
    currency: { code: 'INR', symbol: '₹' },
    timeZones: ['Asia/Kolkata'],
    commonVisaTypes: ['e-Tourist', 'Business Visa', 'Employment Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 30, corporate: 30 }
  },
  'CN': {
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    visaFreeStays: { tourist: 15, business: 30, transit: 144 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '110', medical: '120', fire: '119' },
    currency: { code: 'CNY', symbol: '¥' },
    timeZones: ['Asia/Shanghai'],
    commonVisaTypes: ['L Tourist', 'M Business', 'Z Work'],
    businessRegistrationRequired: true,
    taxRate: { personal: 45, corporate: 25 }
  },
  'AE': {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    visaFreeStays: { tourist: 90, business: 90, transit: 96 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '999', medical: '998', fire: '997' },
    currency: { code: 'AED', symbol: 'د.إ' },
    timeZones: ['Asia/Dubai'],
    commonVisaTypes: ['Tourist', 'Golden Visa', 'Employment Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 0, corporate: 9 }
  },
  'SA': {
    code: 'SA',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    visaFreeStays: { tourist: 90, business: 90, transit: 18 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '999', medical: '997', fire: '998' },
    currency: { code: 'SAR', symbol: 'ر.س' },
    timeZones: ['Asia/Riyadh'],
    commonVisaTypes: ['Tourist', 'Business Visit', 'Work Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 0, corporate: 20 }
  },
  'IL': {
    code: 'IL',
    name: 'Israel',
    flag: '🇮🇱',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '100', medical: '101', fire: '102' },
    currency: { code: 'ILS', symbol: '₪' },
    timeZones: ['Asia/Jerusalem'],
    commonVisaTypes: ['Tourist', 'B-1 Work', 'Student Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 50, corporate: 23 }
  },
  'TR': {
    code: 'TR',
    name: 'Turkey',
    flag: '🇹🇷',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '155', medical: '112', fire: '110' },
    currency: { code: 'TRY', symbol: '₺' },
    timeZones: ['Europe/Istanbul'],
    commonVisaTypes: ['e-Visa', 'Work Permit', 'Short-term Residence'],
    businessRegistrationRequired: true,
    taxRate: { personal: 40, corporate: 25 }
  },
  'RU': {
    code: 'RU',
    name: 'Russia',
    flag: '🇷🇺',
    visaFreeStays: { tourist: 30, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '102', medical: '103', fire: '101' },
    currency: { code: 'RUB', symbol: '₽' },
    timeZones: ['Europe/Moscow'],
    commonVisaTypes: ['Tourist', 'Business', 'Work Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 13, corporate: 20 }
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
  },
  'NZ': {
    code: 'NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '111', medical: '111', fire: '111' },
    currency: { code: 'NZD', symbol: 'NZ$' },
    timeZones: ['Pacific/Auckland'],
    commonVisaTypes: ['NZeTA', 'Working Holiday', 'Skilled Migrant'],
    businessRegistrationRequired: true,
    taxRate: { personal: 39, corporate: 28 }
  },
  'CA': {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    visaFreeStays: { tourist: 180, business: 180, transit: 48 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '911', medical: '911', fire: '911' },
    currency: { code: 'CAD', symbol: 'C$' },
    timeZones: ['America/Toronto', 'America/Vancouver', 'America/Montreal'],
    commonVisaTypes: ['eTA', 'Express Entry', 'Provincial Nominee'],
    businessRegistrationRequired: true,
    taxRate: { personal: 53, corporate: 27 }
  },
  'MX': {
    code: 'MX',
    name: 'Mexico',
    flag: '🇲🇽',
    visaFreeStays: { tourist: 180, business: 180, transit: 30 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '911', medical: '911', fire: '911' },
    currency: { code: 'MXN', symbol: '$' },
    timeZones: ['America/Mexico_City'],
    commonVisaTypes: ['Tourist Card', 'Work Visa', 'Temporary Resident'],
    businessRegistrationRequired: true,
    taxRate: { personal: 35, corporate: 30 }
  },
  'BR': {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '190', medical: '192', fire: '193' },
    currency: { code: 'BRL', symbol: 'R$' },
    timeZones: ['America/Sao_Paulo'],
    commonVisaTypes: ['Tourist', 'Business', 'Work Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 27, corporate: 34 }
  },
  'AR': {
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '911', medical: '107', fire: '100' },
    currency: { code: 'ARS', symbol: '$' },
    timeZones: ['America/Argentina/Buenos_Aires'],
    commonVisaTypes: ['Tourist', 'Business', 'Work Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 35, corporate: 35 }
  },
  'CL': {
    code: 'CL',
    name: 'Chile',
    flag: '🇨🇱',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '133', medical: '131', fire: '132' },
    currency: { code: 'CLP', symbol: '$' },
    timeZones: ['America/Santiago'],
    commonVisaTypes: ['Tourist', 'Work Visa', 'Professional Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 40, corporate: 27 }
  },
  'CO': {
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '123', medical: '125', fire: '119' },
    currency: { code: 'COP', symbol: '$' },
    timeZones: ['America/Bogota'],
    commonVisaTypes: ['Tourist', 'Business', 'Migrant Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 39, corporate: 35 }
  },
  'PE': {
    code: 'PE',
    name: 'Peru',
    flag: '🇵🇪',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '105', medical: '116', fire: '116' },
    currency: { code: 'PEN', symbol: 'S/' },
    timeZones: ['America/Lima'],
    commonVisaTypes: ['Tourist', 'Business', 'Work Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 30, corporate: 29 }
  },
  'ZA': {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '10111', medical: '10177', fire: '10177' },
    currency: { code: 'ZAR', symbol: 'R' },
    timeZones: ['Africa/Johannesburg'],
    commonVisaTypes: ['Visitor Visa', 'Business Visa', 'Work Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 45, corporate: 28 }
  },
  'EG': {
    code: 'EG',
    name: 'Egypt',
    flag: '🇪🇬',
    visaFreeStays: { tourist: 30, business: 30, transit: 48 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '122', medical: '123', fire: '180' },
    currency: { code: 'EGP', symbol: '£' },
    timeZones: ['Africa/Cairo'],
    commonVisaTypes: ['Tourist', 'Business', 'Work Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 25, corporate: 22 }
  },
  'MA': {
    code: 'MA',
    name: 'Morocco',
    flag: '🇲🇦',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '19', medical: '15', fire: '15' },
    currency: { code: 'MAD', symbol: 'د.م.' },
    timeZones: ['Africa/Casablanca'],
    commonVisaTypes: ['Tourist', 'Business', 'Work Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 38, corporate: 31 }
  },
  'KE': {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    visaFreeStays: { tourist: 90, business: 90, transit: 72 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '999', medical: '999', fire: '999' },
    currency: { code: 'KES', symbol: 'KSh' },
    timeZones: ['Africa/Nairobi'],
    commonVisaTypes: ['e-Visa', 'Business Permit', 'Work Permit'],
    businessRegistrationRequired: true,
    taxRate: { personal: 30, corporate: 30 }
  },
  'NG': {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: false,
    emergencyNumbers: { police: '199', medical: '199', fire: '199' },
    currency: { code: 'NGN', symbol: '₦' },
    timeZones: ['Africa/Lagos'],
    commonVisaTypes: ['Visa on Arrival', 'Business Visa', 'STR Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 24, corporate: 30 }
  },
  'PT': {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '112', medical: '112', fire: '112' },
    currency: { code: 'EUR', symbol: '€' },
    timeZones: ['Europe/Lisbon'],
    commonVisaTypes: ['Schengen Tourist', 'D7 Visa', 'Golden Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 48, corporate: 21 }
  },
  'GR': {
    code: 'GR',
    name: 'Greece',
    flag: '🇬🇷',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '100', medical: '166', fire: '199' },
    currency: { code: 'EUR', symbol: '€' },
    timeZones: ['Europe/Athens'],
    commonVisaTypes: ['Schengen Tourist', 'Digital Nomad', 'Golden Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 44, corporate: 24 }
  },
  'PL': {
    code: 'PL',
    name: 'Poland',
    flag: '🇵🇱',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '997', medical: '999', fire: '998' },
    currency: { code: 'PLN', symbol: 'zł' },
    timeZones: ['Europe/Warsaw'],
    commonVisaTypes: ['Schengen Tourist', 'Work Permit', 'EU Blue Card'],
    businessRegistrationRequired: true,
    taxRate: { personal: 32, corporate: 19 }
  },
  'CZ': {
    code: 'CZ',
    name: 'Czech Republic',
    flag: '🇨🇿',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '158', medical: '155', fire: '150' },
    currency: { code: 'CZK', symbol: 'Kč' },
    timeZones: ['Europe/Prague'],
    commonVisaTypes: ['Schengen Tourist', 'Employee Card', 'Business Visa'],
    businessRegistrationRequired: true,
    taxRate: { personal: 23, corporate: 19 }
  },
  'HU': {
    code: 'HU',
    name: 'Hungary',
    flag: '🇭🇺',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '107', medical: '104', fire: '105' },
    currency: { code: 'HUF', symbol: 'Ft' },
    timeZones: ['Europe/Budapest'],
    commonVisaTypes: ['Schengen Tourist', 'National Work Permit', 'Guest Investor'],
    businessRegistrationRequired: true,
    taxRate: { personal: 15, corporate: 9 }
  },
  'IE': {
    code: 'IE',
    name: 'Ireland',
    flag: '🇮🇪',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '999', medical: '999', fire: '999' },
    currency: { code: 'EUR', symbol: '€' },
    timeZones: ['Europe/Dublin'],
    commonVisaTypes: ['Short Stay C', 'Critical Skills', 'Startup Entrepreneur'],
    businessRegistrationRequired: true,
    taxRate: { personal: 40, corporate: 12 }
  },
  'IS': {
    code: 'IS',
    name: 'Iceland',
    flag: '🇮🇸',
    visaFreeStays: { tourist: 90, business: 90, transit: 24 },
    taxResidencyDays: 183,
    workPermitRequired: true,
    healthInsuranceRequired: true,
    emergencyNumbers: { police: '112', medical: '112', fire: '112' },
    currency: { code: 'ISK', symbol: 'kr' },
    timeZones: ['Atlantic/Reykjavik'],
    commonVisaTypes: ['Schengen Tourist', 'Work Permit', 'Residence Permit'],
    businessRegistrationRequired: true,
    taxRate: { personal: 46, corporate: 20 }
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
      case 'Study permit validity':
        return country.studentInfo?.maxStudyDays || 365;
      case 'Residency requirement':
        return country.expatInfo?.residencyRequirementDays || 183;
      case 'Permanent residency path':
        return country.expatInfo?.permanentResidencyDays || 1095;
      case 'Citizenship eligibility':
        return country.expatInfo?.citizenshipRequirementDays || 1825;
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
      timeZones: country.timeZones,
      officialWebsites: country.officialWebsites,
      studentInfo: reason.includes('Study') || reason.includes('student') ? country.studentInfo : null,
      expatInfo: reason.includes('Residency') || reason.includes('Citizenship') ? country.expatInfo : null
    };
  }

  static getAllCountries(): CountryDetails[] {
    return Object.values(COUNTRY_DATABASE);
  }

  static getCountriesByUserType(userType: 'tourist' | 'student' | 'expat' | 'business' | 'tax'): CountryDetails[] {
    const allCountries = this.getAllCountries();
    
    // Return countries sorted by relevance for each user type
    switch (userType) {
      case 'student':
        return allCountries.filter(c => c.studentInfo?.maxStudyDays && c.studentInfo.maxStudyDays > 0);
      case 'expat':
        return allCountries.filter(c => c.expatInfo?.residencyRequirementDays);
      case 'business':
        return allCountries.filter(c => c.visaFreeStays.business > 30);
      case 'tax':
        return allCountries.filter(c => c.taxResidencyDays > 0);
      default:
        return allCountries;
    }
  }
}

export default CountryInfoService;
