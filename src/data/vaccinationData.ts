// Comprehensive global vaccination & medicine data

export interface VaccinationInfo {
  id: string;
  name: string;
  category: 'required' | 'recommended' | 'routine' | 'prophylaxis';
  description: string;
  durationYears: number; // 0 = ongoing/prophylaxis
  sideEffects: string;
  costRange: string;
  whoRecommended: boolean;
  requiredCountries: string[];
  recommendedRegions: string[];
}

export interface VaccinationClinic {
  name: string;
  type: 'international' | 'government' | 'private' | 'pharmacy';
  countries: string[];
  website: string;
  description: string;
  services: string[];
  appointmentRequired: boolean;
  yellowFeverCertified: boolean;
}

export interface CountryVaccinationRequirement {
  country: string;
  code: string;
  required: string[];
  recommended: string[];
  malariaRisk: boolean;
  yellowFeverCertificate: boolean;
  covidEntry: string;
  governmentHealthPortal: string;
  notes: string;
}

export const VACCINATIONS: VaccinationInfo[] = [
  {
    id: 'yellow-fever',
    name: 'Yellow Fever',
    category: 'required',
    description: 'Required for entry to many African and South American countries. Single dose provides lifelong protection per WHO 2016 amendment.',
    durationYears: 99,
    sideEffects: 'Mild headache, muscle pain, low fever for 5-10 days',
    costRange: '$150-$350',
    whoRecommended: true,
    requiredCountries: ['Angola', 'Benin', 'Burkina Faso', 'Burundi', 'Cameroon', 'Central African Republic', 'Chad', 'Congo', 'Côte d\'Ivoire', 'DR Congo', 'Equatorial Guinea', 'Ethiopia', 'French Guiana', 'Gabon', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Liberia', 'Mali', 'Mauritania', 'Niger', 'Nigeria', 'Rwanda', 'Senegal', 'Sierra Leone', 'South Sudan', 'Sudan', 'Togo', 'Uganda', 'Bolivia', 'Brazil', 'Colombia', 'Ecuador', 'Peru', 'Venezuela', 'Guyana', 'Suriname', 'Trinidad and Tobago', 'Paraguay'],
    recommendedRegions: ['Sub-Saharan Africa', 'Tropical South America', 'Central America']
  },
  {
    id: 'hepatitis-a',
    name: 'Hepatitis A',
    category: 'recommended',
    description: 'Recommended for all travelers to developing countries. Spread through contaminated food and water.',
    durationYears: 25,
    sideEffects: 'Soreness at injection site, headache, fatigue',
    costRange: '$50-$150',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Africa', 'Asia', 'Central America', 'South America', 'Eastern Europe', 'Middle East']
  },
  {
    id: 'hepatitis-b',
    name: 'Hepatitis B',
    category: 'recommended',
    description: 'Recommended for travelers who may have sexual contact, get tattoos, or need medical treatment abroad.',
    durationYears: 20,
    sideEffects: 'Pain at injection site, mild fever',
    costRange: '$50-$200',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Sub-Saharan Africa', 'East Asia', 'Southeast Asia', 'Pacific Islands']
  },
  {
    id: 'typhoid',
    name: 'Typhoid',
    category: 'recommended',
    description: 'Recommended for travelers to South Asia, Africa, and other areas with poor sanitation.',
    durationYears: 3,
    sideEffects: 'Fever, headache, stomach discomfort',
    costRange: '$50-$120',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['South Asia', 'Southeast Asia', 'Africa', 'Central America', 'South America']
  },
  {
    id: 'japanese-encephalitis',
    name: 'Japanese Encephalitis',
    category: 'recommended',
    description: 'Recommended for travelers spending extended time in rural areas of Asia and the Western Pacific.',
    durationYears: 2,
    sideEffects: 'Headache, muscle pain, fever',
    costRange: '$200-$400',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['East Asia', 'Southeast Asia', 'South Asia', 'Western Pacific']
  },
  {
    id: 'meningococcal',
    name: 'Meningococcal Meningitis',
    category: 'required',
    description: 'Required for Hajj/Umrah pilgrims to Saudi Arabia. Recommended for the African meningitis belt.',
    durationYears: 5,
    sideEffects: 'Redness/pain at injection site, mild fever',
    costRange: '$100-$250',
    whoRecommended: true,
    requiredCountries: ['Saudi Arabia'],
    recommendedRegions: ['Sub-Saharan Africa (Meningitis Belt)', 'Parts of Asia']
  },
  {
    id: 'cholera',
    name: 'Cholera',
    category: 'recommended',
    description: 'Oral vaccine recommended for aid workers and travelers to active outbreak areas.',
    durationYears: 2,
    sideEffects: 'Abdominal pain, nausea, diarrhea',
    costRange: '$40-$100',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Sub-Saharan Africa', 'South Asia', 'Southeast Asia', 'Haiti', 'Yemen']
  },
  {
    id: 'rabies',
    name: 'Rabies (Pre-exposure)',
    category: 'recommended',
    description: 'Recommended for travelers in remote areas with limited medical access, especially around animals.',
    durationYears: 3,
    sideEffects: 'Redness, swelling, itching at injection site',
    costRange: '$300-$800',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Africa', 'Asia', 'Central America', 'South America']
  },
  {
    id: 'polio',
    name: 'Polio (IPV Booster)',
    category: 'required',
    description: 'Some countries require proof of polio vaccination for travelers from endemic areas.',
    durationYears: 10,
    sideEffects: 'Soreness at injection site',
    costRange: '$30-$80',
    whoRecommended: true,
    requiredCountries: ['Afghanistan', 'Pakistan', 'Nigeria', 'Papua New Guinea'],
    recommendedRegions: ['Afghanistan', 'Pakistan', 'Parts of Africa']
  },
  {
    id: 'covid-19',
    name: 'COVID-19',
    category: 'recommended',
    description: 'Updated boosters recommended. Some countries still require proof of vaccination for entry.',
    durationYears: 1,
    sideEffects: 'Fatigue, headache, muscle pain, fever',
    costRange: 'Free-$50',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Global']
  },
  {
    id: 'malaria',
    name: 'Malaria Prophylaxis',
    category: 'prophylaxis',
    description: 'Antimalarial medication (Malarone, Doxycycline, or Mefloquine) for travel to endemic areas.',
    durationYears: 0,
    sideEffects: 'Varies by medication: nausea, vivid dreams, sun sensitivity',
    costRange: '$50-$300/trip',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Sub-Saharan Africa', 'South Asia', 'Southeast Asia', 'Central America', 'Oceania']
  },
  {
    id: 'tick-borne-encephalitis',
    name: 'Tick-borne Encephalitis',
    category: 'recommended',
    description: 'Recommended for outdoor activities in forested areas of Central/Eastern Europe and Russia.',
    durationYears: 3,
    sideEffects: 'Pain at injection site, headache, nausea',
    costRange: '$100-$250',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Central Europe', 'Eastern Europe', 'Russia', 'Scandinavia', 'Baltic States', 'China']
  },
  {
    id: 'influenza',
    name: 'Influenza (Seasonal)',
    category: 'routine',
    description: 'Annual flu vaccine recommended for all travelers, especially during flu season at destination.',
    durationYears: 1,
    sideEffects: 'Soreness, mild fever, body aches',
    costRange: 'Free-$50',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Global']
  },
  {
    id: 'mmr',
    name: 'MMR (Measles, Mumps, Rubella)',
    category: 'routine',
    description: 'Ensure up-to-date before international travel. Measles outbreaks occur worldwide.',
    durationYears: 99,
    sideEffects: 'Mild rash, fever, joint stiffness',
    costRange: '$50-$120',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Global — especially developing countries']
  },
  {
    id: 'tdap',
    name: 'Tetanus-Diphtheria-Pertussis',
    category: 'routine',
    description: 'Booster every 10 years. Essential for all travelers.',
    durationYears: 10,
    sideEffects: 'Pain/swelling at injection site, mild fever',
    costRange: '$30-$80',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Global']
  },
  {
    id: 'dengue',
    name: 'Dengue Fever (Qdenga)',
    category: 'recommended',
    description: 'New vaccine available for travelers to endemic areas. Consult travel medicine specialist.',
    durationYears: 5,
    sideEffects: 'Headache, muscle pain, fatigue',
    costRange: '$200-$400',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Southeast Asia', 'Latin America', 'Caribbean', 'Pacific Islands', 'Sub-Saharan Africa']
  },
  {
    id: 'pneumococcal',
    name: 'Pneumococcal',
    category: 'routine',
    description: 'Recommended for older adults and immunocompromised travelers.',
    durationYears: 5,
    sideEffects: 'Pain at injection site, mild fever',
    costRange: '$100-$250',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Global — high-risk travelers']
  },
  {
    id: 'varicella',
    name: 'Varicella (Chickenpox)',
    category: 'routine',
    description: 'Two doses for non-immune adults before international travel.',
    durationYears: 99,
    sideEffects: 'Soreness, mild rash, low fever',
    costRange: '$100-$200',
    whoRecommended: true,
    requiredCountries: [],
    recommendedRegions: ['Global — for non-immune travelers']
  },
];

export const VACCINATION_CLINICS: VaccinationClinic[] = [
  {
    name: 'International SOS',
    type: 'international',
    countries: ['Global — 90+ countries'],
    website: 'https://www.internationalsos.com',
    description: 'World\'s largest medical and security services company. Travel health clinics worldwide.',
    services: ['Travel vaccinations', 'Pre-travel consultations', 'Yellow Fever certificates', 'Malaria prophylaxis', 'Occupational health'],
    appointmentRequired: true,
    yellowFeverCertified: true,
  },
  {
    name: 'IATA Travel Centre',
    type: 'international',
    countries: ['Global'],
    website: 'https://www.iatatravelcentre.com',
    description: 'Official IATA portal for travel health requirements by country and airline regulations.',
    services: ['Health requirements lookup', 'Vaccination requirements by route', 'Entry regulations'],
    appointmentRequired: false,
    yellowFeverCertified: false,
  },
  {
    name: 'CDC Travelers\' Health',
    type: 'government',
    countries: ['United States'],
    website: 'https://wwwnc.cdc.gov/travel',
    description: 'US Centers for Disease Control — official travel health notices, destination recommendations.',
    services: ['Destination health advisories', 'Outbreak alerts', 'Vaccination recommendations', 'Clinic locator'],
    appointmentRequired: false,
    yellowFeverCertified: false,
  },
  {
    name: 'NHS Fit for Travel',
    type: 'government',
    countries: ['United Kingdom'],
    website: 'https://www.fitfortravel.nhs.uk',
    description: 'UK National Health Service travel health resource with country-by-country advice.',
    services: ['Country health profiles', 'Vaccination advice', 'Malaria maps', 'Health risk assessment'],
    appointmentRequired: false,
    yellowFeverCertified: false,
  },
  {
    name: 'Travel Health Pro (NaTHNaC)',
    type: 'government',
    countries: ['United Kingdom'],
    website: 'https://travelhealthpro.org.uk',
    description: 'National Travel Health Network and Centre — professional-grade travel health guidance.',
    services: ['Clinical guidelines', 'Country information', 'Outbreak surveillance', 'Yellow Fever centres'],
    appointmentRequired: false,
    yellowFeverCertified: true,
  },
  {
    name: 'Passport Health',
    type: 'private',
    countries: ['United States', 'Canada'],
    website: 'https://www.passporthealthusa.com',
    description: 'North America\'s largest travel medicine provider with 300+ clinics.',
    services: ['Travel vaccinations', 'Yellow Fever certificates', 'Malaria prevention', 'Travel health kits', 'Corporate travel health'],
    appointmentRequired: true,
    yellowFeverCertified: true,
  },
  {
    name: 'TMVC (Travel Medicine & Vaccination Centre)',
    type: 'private',
    countries: ['Australia', 'New Zealand'],
    website: 'https://www.travelvax.com.au',
    description: 'Australia\'s leading travel medicine network with clinics nationwide.',
    services: ['Travel vaccinations', 'Yellow Fever certificates', 'Altitude medicine', 'Diving medicals'],
    appointmentRequired: true,
    yellowFeverCertified: true,
  },
  {
    name: 'CRM Travellers\' Health',
    type: 'private',
    countries: ['Germany', 'Austria', 'Switzerland'],
    website: 'https://www.crm.de',
    description: 'German-speaking travel medicine association with certified clinics.',
    services: ['Travel vaccinations', 'Tropical medicine', 'Yellow Fever certification', 'Expedition medicine'],
    appointmentRequired: true,
    yellowFeverCertified: true,
  },
  {
    name: 'Institut Pasteur',
    type: 'government',
    countries: ['France'],
    website: 'https://www.pasteur.fr/en/medical-center/vaccination',
    description: 'World-renowned French research institute offering travel vaccinations in Paris.',
    services: ['Travel vaccinations', 'Yellow Fever certification', 'Tropical disease consultation', 'Laboratory diagnostics'],
    appointmentRequired: true,
    yellowFeverCertified: true,
  },
  {
    name: 'Tropical Medical Bureau',
    type: 'private',
    countries: ['Ireland'],
    website: 'https://www.tmb.ie',
    description: 'Ireland\'s specialist travel health service with clinics across the country.',
    services: ['Travel vaccinations', 'Yellow Fever certification', 'Malaria prevention', 'Pre-travel advice'],
    appointmentRequired: true,
    yellowFeverCertified: true,
  },
  {
    name: 'GGD (Municipal Health Services)',
    type: 'government',
    countries: ['Netherlands'],
    website: 'https://www.ggd.nl',
    description: 'Dutch public health service providing travel vaccinations nationwide.',
    services: ['Travel vaccinations', 'Yellow Fever certification', 'Health advice', 'Malaria consultation'],
    appointmentRequired: true,
    yellowFeverCertified: true,
  },
  {
    name: 'Tropeninstitut',
    type: 'government',
    countries: ['Germany'],
    website: 'https://tropeninstitut.de',
    description: 'German Institute for Tropical Medicine with comprehensive travel vaccination services.',
    services: ['Travel vaccinations', 'Tropical medicine', 'Yellow Fever', 'Post-travel checkups'],
    appointmentRequired: true,
    yellowFeverCertified: true,
  },
  {
    name: 'Travel Clinics of America',
    type: 'private',
    countries: ['United States'],
    website: 'https://www.travelclinicsofamerica.com',
    description: 'Specialized travel vaccination clinics across the USA.',
    services: ['Travel vaccinations', 'Yellow Fever certificates', 'Anti-malaria medication', 'Travel health kits'],
    appointmentRequired: true,
    yellowFeverCertified: true,
  },
  {
    name: 'WHO International Travel and Health',
    type: 'international',
    countries: ['Global'],
    website: 'https://www.who.int/travel-advice',
    description: 'World Health Organization official portal for international travel health guidance.',
    services: ['Country health requirements', 'Disease outbreak alerts', 'Vaccination recommendations', 'International Health Regulations'],
    appointmentRequired: false,
    yellowFeverCertified: false,
  },
  {
    name: 'Nomad Travel Clinics',
    type: 'private',
    countries: ['United Kingdom'],
    website: 'https://www.nomadtravel.co.uk',
    description: 'UK travel health specialists with clinics in London, Bristol, and Manchester.',
    services: ['Travel vaccinations', 'Yellow Fever', 'Malaria tablets', 'Pharmacy & travel gear'],
    appointmentRequired: true,
    yellowFeverCertified: true,
  },
];

export const COUNTRY_REQUIREMENTS: CountryVaccinationRequirement[] = [
  { country: 'Angola', code: 'AO', required: ['Yellow Fever'], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies', 'Malaria Prophylaxis'], malariaRisk: true, yellowFeverCertificate: true, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.minsa.gov.ao', notes: 'Yellow Fever certificate MANDATORY for all travelers over 9 months.' },
  { country: 'Australia', code: 'AU', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Influenza'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.health.gov.au', notes: 'Yellow Fever certificate needed if arriving from endemic country.' },
  { country: 'Brazil', code: 'BR', required: ['Yellow Fever'], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies', 'Dengue'], malariaRisk: true, yellowFeverCertificate: true, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.gov.br/saude', notes: 'Yellow Fever recommended for Amazon region. Dengue & Zika risk in urban areas.' },
  { country: 'Cambodia', code: 'KH', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Japanese Encephalitis', 'Rabies', 'Malaria Prophylaxis'], malariaRisk: true, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.moh.gov.kh', notes: 'Malaria risk in rural/forest areas. Japanese Encephalitis risk in rural zones.' },
  { country: 'Canada', code: 'CA', required: [], recommended: ['Influenza', 'COVID-19'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.canada.ca/en/public-health.html', notes: 'Routine vaccinations should be up to date.' },
  { country: 'China', code: 'CN', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Japanese Encephalitis', 'Rabies', 'Polio'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'Check current requirements', governmentHealthPortal: 'http://en.nhc.gov.cn', notes: 'Japanese Encephalitis risk in rural areas. Some regions have unique health requirements.' },
  { country: 'Colombia', code: 'CO', required: ['Yellow Fever'], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies', 'Malaria Prophylaxis', 'Dengue'], malariaRisk: true, yellowFeverCertificate: true, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.minsalud.gov.co', notes: 'Yellow Fever required for certain jungle/rural regions. Dengue risk countrywide.' },
  { country: 'Egypt', code: 'EG', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.mohp.gov.eg', notes: 'Yellow Fever certificate needed if arriving from endemic country.' },
  { country: 'France', code: 'FR', required: [], recommended: ['Hepatitis A', 'Tick-borne Encephalitis', 'Influenza'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.sante.gouv.fr', notes: 'Tick-borne Encephalitis in Alsace region. Routine vaccinations sufficient.' },
  { country: 'Germany', code: 'DE', required: [], recommended: ['Tick-borne Encephalitis', 'Influenza'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.bundesgesundheitsministerium.de', notes: 'TBE risk in southern states (Bavaria, Baden-Württemberg).' },
  { country: 'Ghana', code: 'GH', required: ['Yellow Fever'], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Meningococcal Meningitis', 'Rabies', 'Cholera', 'Malaria Prophylaxis'], malariaRisk: true, yellowFeverCertificate: true, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.moh.gov.gh', notes: 'Yellow Fever certificate MANDATORY. High malaria risk throughout.' },
  { country: 'India', code: 'IN', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Japanese Encephalitis', 'Rabies', 'Cholera', 'Malaria Prophylaxis', 'Polio'], malariaRisk: true, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.mohfw.gov.in', notes: 'Oral Polio vaccine required if arriving from polio-endemic country. Rabies very common.' },
  { country: 'Indonesia', code: 'ID', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Japanese Encephalitis', 'Rabies', 'Dengue', 'Malaria Prophylaxis'], malariaRisk: true, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.kemkes.go.id', notes: 'Rabies risk in Bali. Malaria in Papua & East Indonesia. Dengue risk in urban areas.' },
  { country: 'Japan', code: 'JP', required: [], recommended: ['Japanese Encephalitis', 'Influenza'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.mhlw.go.jp/english', notes: 'Very high healthcare standards. JE risk is minimal for most tourists.' },
  { country: 'Kenya', code: 'KE', required: ['Yellow Fever'], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Meningococcal Meningitis', 'Rabies', 'Cholera', 'Malaria Prophylaxis'], malariaRisk: true, yellowFeverCertificate: true, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.health.go.ke', notes: 'Yellow Fever certificate required for travelers from endemic areas. High malaria risk.' },
  { country: 'Mexico', code: 'MX', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies', 'Dengue'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.gob.mx/salud', notes: 'Dengue risk in coastal areas. Typhoid for adventurous eaters.' },
  { country: 'Nigeria', code: 'NG', required: ['Yellow Fever'], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Meningococcal Meningitis', 'Rabies', 'Cholera', 'Malaria Prophylaxis', 'Polio'], malariaRisk: true, yellowFeverCertificate: true, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.health.gov.ng', notes: 'Yellow Fever certificate MANDATORY. Polio-endemic country. Highest malaria burden globally.' },
  { country: 'Pakistan', code: 'PK', required: ['Polio'], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies', 'Malaria Prophylaxis'], malariaRisk: true, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.nhsrc.gov.pk', notes: 'Polio-endemic country — OPV required for all travelers. Malaria risk in rural areas.' },
  { country: 'Peru', code: 'PE', required: ['Yellow Fever'], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies', 'Malaria Prophylaxis', 'Dengue'], malariaRisk: true, yellowFeverCertificate: true, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.gob.pe/minsa', notes: 'Yellow Fever for Amazon/jungle areas. Altitude sickness risk at high elevations.' },
  { country: 'Philippines', code: 'PH', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Japanese Encephalitis', 'Rabies', 'Dengue', 'Malaria Prophylaxis'], malariaRisk: true, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.doh.gov.ph', notes: 'Dengue risk in urban areas. Rabies common. Malaria in Palawan and Mindanao.' },
  { country: 'Saudi Arabia', code: 'SA', required: ['Meningococcal Meningitis'], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies', 'Polio'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.moh.gov.sa', notes: 'Meningococcal vaccine MANDATORY for Hajj/Umrah. MERS-CoV awareness required.' },
  { country: 'South Africa', code: 'ZA', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies', 'Malaria Prophylaxis'], malariaRisk: true, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.health.gov.za', notes: 'Malaria in Limpopo, Mpumalanga, KwaZulu-Natal. Yellow Fever certificate if from endemic country.' },
  { country: 'Thailand', code: 'TH', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Japanese Encephalitis', 'Rabies', 'Dengue', 'Malaria Prophylaxis'], malariaRisk: true, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.moph.go.th', notes: 'Dengue very common. Rabies risk from stray dogs. Malaria in border areas only.' },
  { country: 'Turkey', code: 'TR', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.saglik.gov.tr', notes: 'Generally safe. Hepatitis A recommended for rural travel.' },
  { country: 'United Arab Emirates', code: 'AE', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.mohap.gov.ae', notes: 'Excellent healthcare infrastructure. Standard routine vaccinations sufficient.' },
  { country: 'United Kingdom', code: 'GB', required: [], recommended: ['Influenza', 'COVID-19'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.nhs.uk', notes: 'Routine vaccinations should be up to date. Free NHS care for emergencies.' },
  { country: 'United States', code: 'US', required: [], recommended: ['Influenza', 'COVID-19'], malariaRisk: false, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.cdc.gov', notes: 'Routine vaccinations. Travel medicine clinics widely available.' },
  { country: 'Vietnam', code: 'VN', required: [], recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Japanese Encephalitis', 'Rabies', 'Malaria Prophylaxis', 'Dengue'], malariaRisk: true, yellowFeverCertificate: false, covidEntry: 'No restrictions', governmentHealthPortal: 'https://www.moh.gov.vn', notes: 'Dengue risk in cities. JE risk in rural north. Malaria in highlands and forests.' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  required: 'Required / Mandatory',
  recommended: 'Recommended',
  routine: 'Routine',
  prophylaxis: 'Prophylaxis / Medication',
};

export const CATEGORY_COLORS: Record<string, string> = {
  required: 'bg-destructive text-destructive-foreground',
  recommended: 'bg-primary text-primary-foreground',
  routine: 'bg-secondary text-secondary-foreground',
  prophylaxis: 'bg-accent text-accent-foreground',
};
