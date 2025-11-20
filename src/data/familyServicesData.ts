import { FamilyService } from '@/types/familyServices';

export const FAMILY_SERVICES: FamilyService[] = [
  // Global Providers
  {
    id: 'GLOBAL-001',
    name: 'International Nanny Institute',
    type: ['Nanny Agency', 'Full-Time Nanny', 'Travel Nanny'],
    cities: ['New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Singapore'],
    countries: ['United States', 'United Kingdom', 'France', 'Japan', 'Australia', 'Singapore'],
    established: 2008,
    pricing: { hourly: 30, daily: 220, monthly: 4200, currency: 'USD' },
    services: ['Background Checks', 'First Aid Training', 'Multilingual Care', 'Travel Support'],
    verification: {
      backgroundChecks: true,
      firstAidCertified: true,
      referenceChecked: true,
      expatExperience: true,
      multilingual: true,
      drivingLicensed: true,
      emergencyTrained: true
    },
    languages: ['English', 'French', 'Spanish', 'Japanese', 'German', 'Mandarin'],
    minimumCommitment: '3 months',
    bookingProcess: 'Initial consultation, profile matching, interviews, trial period, contract',
    website: 'https://internationalnanny.com',
    contact: {
      email: 'contact@internationalnanny.com',
      phone: '+1-555-0100',
      address: 'Global offices in 6 major cities'
    },
    rating: {
      overall: 4.9,
      reliability: 4.8,
      communication: 4.9,
      safety: 5.0,
      expatRating: 4.9,
      reviewCount: 342
    },
    description: 'Premium global nanny agency specializing in expat families with the highest safety standards and multilingual caregivers.',
    specialFeatures: ['24/7 Emergency Support', 'Travel Coordination', 'Global Network', 'Replacement Guarantee']
  },
  {
    id: 'GLOBAL-002',
    name: 'Care.com International',
    type: ['Platform/Marketplace', 'Full-Time Nanny', 'Babysitting'],
    cities: ['Global Coverage'],
    countries: ['Global'],
    established: 2006,
    pricing: { hourly: 15, daily: 120, monthly: 2500, currency: 'USD' },
    services: ['Online Platform', 'Background Checks', 'Reviews System', 'Booking Management'],
    verification: {
      backgroundChecks: true,
      firstAidCertified: false,
      referenceChecked: true,
      expatExperience: true,
      multilingual: true
    },
    languages: ['English', 'Spanish', 'French', 'German', 'Italian'],
    minimumCommitment: 'Flexible',
    bookingProcess: 'Browse profiles, request interviews, book directly',
    website: 'https://care.com',
    contact: {
      email: 'international@care.com',
      phone: '+1-877-227-3115',
      address: 'Online platform with global reach'
    },
    rating: {
      overall: 4.3,
      reliability: 4.2,
      communication: 4.4,
      safety: 4.5,
      expatRating: 4.1,
      reviewCount: 12847
    },
    description: 'World\'s largest platform connecting families with caregivers, offering extensive vetting and flexible booking options.',
    specialFeatures: ['Instant Booking', 'Mobile App', 'Payment Processing', 'Background Check Service']
  },

  // Singapore
  {
    id: 'SG-001',
    name: 'HelperChoice Singapore',
    type: ['Nanny Agency', 'Live-In Nanny', 'Full-Time Nanny'],
    cities: ['Singapore'],
    countries: ['Singapore'],
    established: 2015,
    pricing: { hourly: 18, daily: 140, monthly: 2800, currency: 'USD' },
    services: ['Domestic Helpers', 'Nanny Placement', 'Visa Support', 'Training Programs'],
    verification: {
      backgroundChecks: true,
      firstAidCertified: true,
      referenceChecked: true,
      expatExperience: true,
      multilingual: true
    },
    languages: ['English', 'Mandarin', 'Malay', 'Tamil'],
    minimumCommitment: '2 years (standard contract)',
    bookingProcess: 'Profile selection, interview, medical check, visa processing, placement',
    website: 'https://helperchoice.com',
    contact: {
      email: 'info@helperchoice.com',
      phone: '+65-6735-3456',
      address: '123 Orchard Road, Singapore 238858'
    },
    rating: {
      overall: 4.6,
      reliability: 4.7,
      communication: 4.5,
      safety: 4.8,
      expatRating: 4.6,
      reviewCount: 128
    },
    description: 'Leading agency in Singapore specializing in domestic helpers and nannies for expat families with comprehensive support.',
    specialFeatures: ['Work Permit Processing', 'Training Center', 'Replacement Policy', 'Medical Insurance']
  },

  // Hong Kong
  {
    id: 'HK-001',
    name: 'HelperChoice Hong Kong',
    type: ['Nanny Agency', 'Live-In Nanny', 'Full-Time Nanny'],
    cities: ['Hong Kong'],
    countries: ['Hong Kong'],
    established: 2012,
    pricing: { hourly: 20, daily: 150, monthly: 3000, currency: 'USD' },
    services: ['Domestic Helper Placement', 'Visa Assistance', 'Training', '24/7 Support'],
    verification: {
      backgroundChecks: true,
      firstAidCertified: true,
      referenceChecked: true,
      expatExperience: true,
      multilingual: true
    },
    languages: ['English', 'Cantonese', 'Mandarin', 'Tagalog'],
    minimumCommitment: '2 years',
    bookingProcess: 'Consultation, profile matching, interview, visa processing, onboarding',
    website: 'https://helperchoice.com.hk',
    contact: {
      email: 'hk@helperchoice.com',
      phone: '+852-2523-8811',
      address: 'Central, Hong Kong'
    },
    rating: {
      overall: 4.7,
      reliability: 4.8,
      communication: 4.6,
      safety: 4.9,
      expatRating: 4.7,
      reviewCount: 256
    },
    description: 'Premier domestic helper agency in Hong Kong with over a decade of experience serving international families.',
    specialFeatures: ['Contract Management', 'Legal Support', 'Training Programs', 'Emergency Replacement']
  },

  // Dubai & Middle East
  {
    id: 'ME-001',
    name: 'Muna Nannies Dubai',
    type: ['Nanny Agency', 'Full-Time Nanny', 'Live-In Nanny'],
    cities: ['Dubai', 'Abu Dhabi', 'Doha'],
    countries: ['United Arab Emirates', 'Qatar'],
    established: 2014,
    pricing: { hourly: 22, daily: 160, monthly: 3200, currency: 'USD' },
    services: ['Nanny Placement', 'Visa Sponsorship', 'Training', 'Cultural Orientation'],
    verification: {
      backgroundChecks: true,
      firstAidCertified: true,
      referenceChecked: true,
      expatExperience: true,
      multilingual: true,
      emergencyTrained: true
    },
    languages: ['English', 'Arabic', 'Tagalog', 'French', 'Urdu'],
    minimumCommitment: '1 year',
    bookingProcess: 'Initial meeting, nanny selection, sponsorship process, orientation, placement',
    website: 'https://muna-nannies.com',
    contact: {
      email: 'info@muna-nannies.com',
      phone: '+971-4-123-4567',
      address: 'Dubai Marina, Dubai, UAE'
    },
    rating: {
      overall: 4.8,
      reliability: 4.9,
      communication: 4.7,
      safety: 4.9,
      expatRating: 4.8,
      reviewCount: 94
    },
    description: 'Premium nanny services with extensive expat family experience across the GCC region.',
    specialFeatures: ['Visa Sponsorship', 'Cultural Training', 'Arabic Language Support', 'Premium Matching']
  },

  // London
  {
    id: 'UK-001',
    name: 'Tootsa London',
    type: ['Nanny Agency', 'Part-Time Nanny', 'Full-Time Nanny'],
    cities: ['London', 'Paris', 'Brussels'],
    countries: ['United Kingdom', 'France', 'Belgium'],
    established: 2010,
    pricing: { hourly: 20, daily: 150, monthly: 3000, currency: 'GBP' },
    services: ['Nanny Placement', 'Maternity Nurses', 'After-School Care', 'Emergency Babysitting'],
    verification: {
      backgroundChecks: true,
      firstAidCertified: true,
      referenceChecked: true,
      expatExperience: true,
      multilingual: true,
      drivingLicensed: true
    },
    languages: ['English', 'French', 'Spanish', 'German', 'Italian'],
    minimumCommitment: '6 months',
    bookingProcess: 'Registration, profile matching, interviews, trial day, placement',
    website: 'https://tootsa.com',
    contact: {
      email: 'contact@tootsa.com',
      phone: '+44-20-7123-4567',
      address: 'Kensington, London SW7'
    },
    rating: {
      overall: 4.7,
      reliability: 4.6,
      communication: 4.8,
      safety: 4.9,
      expatRating: 4.7,
      reviewCount: 187
    },
    description: 'British nanny agency with strong focus on international families and professional childcare standards.',
    specialFeatures: ['DBS Checked', 'Pediatric First Aid', 'Trial Periods', 'Flexible Contracts']
  },

  // New York
  {
    id: 'US-001',
    name: 'British American Nannies NYC',
    type: ['Nanny Agency', 'Full-Time Nanny', 'Newborn Care Specialist'],
    cities: ['New York', 'Los Angeles', 'San Francisco'],
    countries: ['United States'],
    established: 2005,
    pricing: { hourly: 28, daily: 200, monthly: 4000, currency: 'USD' },
    services: ['Nanny Placement', 'Newborn Care', 'Sleep Training', 'Household Management'],
    verification: {
      backgroundChecks: true,
      firstAidCertified: true,
      referenceChecked: true,
      expatExperience: true,
      multilingual: false,
      drivingLicensed: true,
      emergencyTrained: true
    },
    languages: ['English', 'Spanish'],
    minimumCommitment: '1 year',
    bookingProcess: 'Consultation, background check, interviews, trial week, contract signing',
    website: 'https://britishamericannannies.com',
    contact: {
      email: 'info@britishamericannannies.com',
      phone: '+1-212-555-0123',
      address: 'Upper East Side, New York, NY 10021'
    },
    rating: {
      overall: 4.8,
      reliability: 4.9,
      communication: 4.7,
      safety: 4.9,
      expatRating: 4.6,
      reviewCount: 156
    },
    description: 'Elite nanny agency serving Manhattan\'s Upper East Side and expat families with British-trained nannies.',
    specialFeatures: ['Norland Trained Nannies', 'Newborn Specialists', 'Live-In Options', 'Tax Assistance']
  },

  // Tokyo
  {
    id: 'JP-001',
    name: 'Tokyo Nanny Service',
    type: ['Nanny Agency', 'Babysitting', 'Part-Time Nanny'],
    cities: ['Tokyo', 'Osaka', 'Yokohama'],
    countries: ['Japan'],
    established: 2016,
    pricing: { hourly: 25, daily: 180, monthly: 3500, currency: 'USD' },
    services: ['Bilingual Care', 'Cultural Orientation', 'School Pickup', 'Activity Planning'],
    verification: {
      backgroundChecks: true,
      firstAidCertified: true,
      referenceChecked: true,
      expatExperience: true,
      multilingual: true
    },
    languages: ['English', 'Japanese', 'Mandarin'],
    minimumCommitment: '3 months',
    bookingProcess: 'Online registration, profile review, video interview, trial session, booking',
    website: 'https://tokyonannyservice.jp',
    contact: {
      email: 'info@tokyonannyservice.jp',
      phone: '+81-3-1234-5678',
      address: 'Minato-ku, Tokyo 106-0032'
    },
    rating: {
      overall: 4.5,
      reliability: 4.6,
      communication: 4.4,
      safety: 4.7,
      expatRating: 4.5,
      reviewCount: 73
    },
    description: 'Bilingual nanny service specializing in expat families in Tokyo with cultural sensitivity and flexibility.',
    specialFeatures: ['Bilingual Caregivers', 'Cultural Bridge', 'Flexible Hours', 'English Education']
  },

  // Paris
  {
    id: 'FR-001',
    name: 'Les Nounous Parisiennes',
    type: ['Nanny Agency', 'Full-Time Nanny', 'Part-Time Nanny'],
    cities: ['Paris', 'Lyon', 'Nice'],
    countries: ['France'],
    established: 2011,
    pricing: { hourly: 18, daily: 140, monthly: 2800, currency: 'EUR' },
    services: ['Childcare', 'French Tutoring', 'Cultural Activities', 'School Support'],
    verification: {
      backgroundChecks: true,
      firstAidCertified: true,
      referenceChecked: true,
      expatExperience: true,
      multilingual: true
    },
    languages: ['French', 'English', 'Spanish', 'German'],
    minimumCommitment: '6 months',
    bookingProcess: 'Entretien initial, sélection de profils, rencontre, période d\'essai, contrat',
    website: 'https://nounousparisiennes.fr',
    contact: {
      email: 'contact@nounousparisiennes.fr',
      phone: '+33-1-42-12-34-56',
      address: '16ème arrondissement, Paris 75016'
    },
    rating: {
      overall: 4.6,
      reliability: 4.7,
      communication: 4.5,
      safety: 4.8,
      expatRating: 4.6,
      reviewCount: 112
    },
    description: 'Parisian nanny agency offering bilingual childcare and cultural immersion for expat families.',
    specialFeatures: ['French Language Immersion', 'Cultural Activities', 'Flexible Schedules', 'Holiday Care']
  },

  // Sydney
  {
    id: 'AU-001',
    name: 'Sydney Nanny Connection',
    type: ['Nanny Agency', 'Full-Time Nanny', 'Babysitting'],
    cities: ['Sydney', 'Melbourne', 'Brisbane'],
    countries: ['Australia'],
    established: 2013,
    pricing: { hourly: 22, daily: 160, monthly: 3200, currency: 'USD' },
    services: ['Qualified Nannies', 'Before/After School Care', 'Holiday Programs', 'Emergency Care'],
    verification: {
      backgroundChecks: true,
      firstAidCertified: true,
      referenceChecked: true,
      expatExperience: true,
      multilingual: false,
      drivingLicensed: true
    },
    languages: ['English', 'Mandarin'],
    minimumCommitment: '6 months',
    bookingProcess: 'Initial call, profile matching, meet & greet, trial day, contract',
    website: 'https://sydneynannyconnection.com.au',
    contact: {
      email: 'hello@sydneynannyconnection.com.au',
      phone: '+61-2-9123-4567',
      address: 'Bondi Junction, Sydney NSW 2022'
    },
    rating: {
      overall: 4.7,
      reliability: 4.8,
      communication: 4.6,
      safety: 4.8,
      expatRating: 4.5,
      reviewCount: 98
    },
    description: 'Professional nanny agency serving expat and local families across major Australian cities.',
    specialFeatures: ['Working with Children Check', 'First Aid Certified', 'Outdoor Activities', 'Beach Safety']
  },

  // Toronto
  {
    id: 'CA-001',
    name: 'Canadian Nanny Network',
    type: ['Nanny Agency', 'Live-In Nanny', 'Full-Time Nanny'],
    cities: ['Toronto', 'Vancouver', 'Montreal'],
    countries: ['Canada'],
    established: 2009,
    pricing: { hourly: 20, daily: 150, monthly: 3000, currency: 'USD' },
    services: ['Live-In/Live-Out Nannies', 'Work Permit Support', 'Training', 'Placement Services'],
    verification: {
      backgroundChecks: true,
      firstAidCertified: true,
      referenceChecked: true,
      expatExperience: true,
      multilingual: true
    },
    languages: ['English', 'French', 'Spanish', 'Mandarin'],
    minimumCommitment: '1 year',
    bookingProcess: 'Application, interviews, LMIA support, work permit, placement',
    website: 'https://canadiannannynetwork.ca',
    contact: {
      email: 'info@canadiannannynetwork.ca',
      phone: '+1-416-555-0199',
      address: 'Downtown Toronto, ON M5H 2N2'
    },
    rating: {
      overall: 4.6,
      reliability: 4.7,
      communication: 4.5,
      safety: 4.7,
      expatRating: 4.6,
      reviewCount: 134
    },
    description: 'Leading Canadian nanny agency with expertise in work permits and live-in caregiver programs for international families.',
    specialFeatures: ['LMIA Support', 'Work Permit Processing', 'Bilingual French/English', 'Winter Activity Training']
  }
];

// Extract unique values for filters
export const CITIES = Array.from(new Set(FAMILY_SERVICES.flatMap(s => s.cities))).sort();
export const COUNTRIES = Array.from(new Set(FAMILY_SERVICES.flatMap(s => s.countries))).sort();
export const LANGUAGES = Array.from(new Set(FAMILY_SERVICES.flatMap(s => s.languages))).sort();

export const REGIONS = {
  'North America': ['United States', 'Canada'],
  'Europe': ['United Kingdom', 'France', 'Belgium', 'Germany', 'Spain', 'Italy'],
  'Asia Pacific': ['Singapore', 'Hong Kong', 'Japan', 'Australia'],
  'Middle East': ['United Arab Emirates', 'Qatar', 'Saudi Arabia'],
  'Global': ['Global']
};

export const SERVICE_TYPES = [
  'Full-Time Nanny',
  'Part-Time Nanny',
  'Babysitting',
  'Live-In Nanny',
  'Newborn Care Specialist',
  'Night Nurse',
  'Temporary Care',
  'Event Childcare',
  'Travel Nanny',
  'Tutor Nanny',
  'Nanny Agency',
  'Platform/Marketplace'
];
