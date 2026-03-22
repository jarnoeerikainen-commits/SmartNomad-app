// ETIAS Data — sourced from official EU websites:
// https://travel-europe.europa.eu/etias_en
// https://home-affairs.ec.europa.eu/policies/schengen/smart-borders/european-travel-information-authorisation-system_en
// Last verified: March 2026

export interface ETIASCountryRequirement {
  code: string;
  name: string;
  flag: string;
  requiresETIAS: boolean; // true = visa-free national who needs ETIAS
  isETIASCountry: boolean; // true = one of the 30 EU countries requiring ETIAS
}

export const ETIAS_FEE_EUR = 20;
export const ETIAS_FEE_EXEMPT_MIN_AGE = 0;
export const ETIAS_FEE_EXEMPT_MAX_AGE = 17;
export const ETIAS_FEE_EXEMPT_SENIOR_AGE = 70;
export const ETIAS_VALIDITY_YEARS = 3;
export const ETIAS_MAX_STAY_DAYS = 90;
export const ETIAS_STAY_PERIOD_DAYS = 180;
export const ETIAS_LAUNCH_QUARTER = 'Q4 2026';
export const ETIAS_OFFICIAL_URL = 'https://travel-europe.europa.eu/etias_en';
export const ETIAS_WHO_SHOULD_APPLY_URL = 'https://travel-europe.europa.eu/etias/about-etias/who-should-apply_en';
export const ETIAS_FAQ_URL = 'https://travel-europe.europa.eu/etias/faqs-etias_en';

// 30 European countries that require ETIAS
export const ETIAS_REQUIRING_COUNTRIES: ETIASCountryRequirement[] = [
  { code: 'AT', name: 'Austria', flag: '🇦🇹', requiresETIAS: false, isETIASCountry: true },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', requiresETIAS: false, isETIASCountry: true },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', requiresETIAS: false, isETIASCountry: true },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', requiresETIAS: false, isETIASCountry: true },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', requiresETIAS: false, isETIASCountry: true },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', requiresETIAS: false, isETIASCountry: true },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', requiresETIAS: false, isETIASCountry: true },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', requiresETIAS: false, isETIASCountry: true },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', requiresETIAS: false, isETIASCountry: true },
  { code: 'FR', name: 'France', flag: '🇫🇷', requiresETIAS: false, isETIASCountry: true },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', requiresETIAS: false, isETIASCountry: true },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', requiresETIAS: false, isETIASCountry: true },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', requiresETIAS: false, isETIASCountry: true },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', requiresETIAS: false, isETIASCountry: true },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', requiresETIAS: false, isETIASCountry: true },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', requiresETIAS: false, isETIASCountry: true },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', requiresETIAS: false, isETIASCountry: true },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', requiresETIAS: false, isETIASCountry: true },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', requiresETIAS: false, isETIASCountry: true },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', requiresETIAS: false, isETIASCountry: true },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', requiresETIAS: false, isETIASCountry: true },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', requiresETIAS: false, isETIASCountry: true },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', requiresETIAS: false, isETIASCountry: true },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', requiresETIAS: false, isETIASCountry: true },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', requiresETIAS: false, isETIASCountry: true },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', requiresETIAS: false, isETIASCountry: true },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', requiresETIAS: false, isETIASCountry: true },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', requiresETIAS: false, isETIASCountry: true },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', requiresETIAS: false, isETIASCountry: true },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', requiresETIAS: false, isETIASCountry: true },
];

// 62 visa-free nationalities that NEED ETIAS to enter the 30 EU countries
export const ETIAS_REQUIRED_NATIONALITIES = [
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'MO', name: 'Macao', flag: '🇲🇴' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
];

// Application form data fields required by ETIAS
export const ETIAS_APPLICATION_FIELDS = [
  'Full name (as on passport)',
  'Date and place of birth',
  'Nationality/citizenships',
  'Passport details (number, country, expiry)',
  'Home address and email',
  'Phone number',
  'First EU country of entry',
  'Education and work experience',
  'Criminal record declaration',
  'Travel to conflict zones declaration',
  'Health questions (infectious diseases)',
  'Previous immigration refusals',
];

// Exemptions — who does NOT need ETIAS
export const ETIAS_EXEMPTIONS = [
  'EU/EEA/Swiss citizens',
  'Non-EU nationals with a valid residence permit or visa for an ETIAS country',
  'Holders of a local border traffic permit',
  'Diplomats with diplomatic passports traveling on duty',
  'Crew members of aircraft/ships',
  'Family members of EU citizens with residence cards',
];

export const ETIAS_REQUIRED_COUNTRY_CODES = new Set(
  ETIAS_REQUIRED_NATIONALITIES.map(n => n.code)
);

export const ETIAS_DESTINATION_COUNTRY_CODES = new Set(
  ETIAS_REQUIRING_COUNTRIES.map(c => c.code)
);

export function needsETIAS(nationalityCode: string): boolean {
  return ETIAS_REQUIRED_COUNTRY_CODES.has(nationalityCode.toUpperCase());
}

export function isETIASDestination(countryCode: string): boolean {
  return ETIAS_DESTINATION_COUNTRY_CODES.has(countryCode.toUpperCase());
}
