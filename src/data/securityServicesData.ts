import { SecurityService } from '@/types/securityServices';

export const securityServices: SecurityService[] = [
  {
    id: 'GEP-001',
    name: 'Gavin de Becker & Associates',
    type: ['executive_protection', 'risk_assessment', 'crisis_management'],
    cities: ['Los Angeles', 'New York', 'London', 'Washington DC'],
    countries: ['United States', 'United Kingdom'],
    established: 1980,
    certifications: ['PSD', 'CPP', 'Certified Threat Manager'],
    pricing: { hourly: 150, daily: 1200, monthly: 25000, currency: 'USD' },
    services: [
      'Executive Protection',
      'Threat Assessment',
      'Workplace Violence Prevention',
      'Security Consulting',
      'Crisis Management'
    ],
    capabilities: {
      executiveProtection: true,
      residentialSecurity: true,
      assetProtection: true,
      cyberSecurity: true,
      emergencyResponse: true,
      travelSecurity: true
    },
    team: {
      size: 200,
      background: ['Ex-Secret Service', 'Ex-FBI', 'Ex-CIA', 'Law Enforcement'],
      languages: ['English', 'Spanish', 'French', 'Arabic']
    },
    verification: {
      licensed: true,
      insured: true,
      backgroundChecked: true,
      referenceVerified: true,
      expatSpecialist: true
    },
    responseTime: 'Immediate 24/7',
    coverage: 'global',
    website: 'https://www.gavindebecker.com',
    contact: {
      emergency: '+1-310-820-5500',
      business: '+1-310-820-5500',
      email: 'contact@gavindebecker.com'
    },
    rating: { overall: 4.9, professionalism: 5.0, response: 4.8, discretion: 5.0, expatRating: 4.9 },
    clients: ['Fortune 500 CEOs', 'Celebrities', 'Political Figures', 'HNWIs'],
    description: 'Premier executive protection firm with unmatched threat assessment capabilities and global reach.',
    specialOperations: ['High-Profile Event Security', 'Celebrity Protection', 'Corporate Executive Security']
  },
  {
    id: 'GEP-002',
    name: 'Control Risks',
    type: ['executive_protection', 'crisis_management', 'risk_assessment', 'travel_security'],
    cities: ['London', 'New York', 'Dubai', 'Singapore', 'Hong Kong', 'São Paulo'],
    countries: ['Global Coverage'],
    established: 1975,
    certifications: ['ISO 9001', 'ASIS International', 'Security Industry Authority'],
    pricing: { hourly: 200, daily: 1600, monthly: 30000, currency: 'USD' },
    services: [
      'Executive Protection',
      'Crisis Management',
      'Kidnap & Ransom Response',
      'Travel Risk Management',
      'Security Intelligence'
    ],
    capabilities: {
      executiveProtection: true,
      residentialSecurity: true,
      assetProtection: true,
      cyberSecurity: true,
      emergencyResponse: true,
      travelSecurity: true
    },
    team: {
      size: 800,
      background: ['Ex-Military', 'Ex-Intelligence', 'Law Enforcement', 'Crisis Response'],
      languages: ['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Portuguese']
    },
    verification: {
      licensed: true,
      insured: true,
      backgroundChecked: true,
      referenceVerified: true,
      expatSpecialist: true
    },
    responseTime: 'Immediate 24/7',
    coverage: 'global',
    website: 'https://www.controlrisks.com',
    contact: {
      emergency: '+44-20-7970-5100',
      business: '+44-20-7222-1552',
      email: 'enquiries@controlrisks.com'
    },
    rating: { overall: 4.8, professionalism: 4.9, response: 4.7, discretion: 4.9, expatRating: 4.8 },
    clients: ['Multinational Corporations', 'Government Agencies', 'NGOs', 'HNWI Families'],
    description: 'Global risk consultancy specializing in complex and high-risk environments worldwide.',
    specialOperations: ['High-Risk Country Operations', 'Kidnap Response', 'Emergency Evacuation']
  },
  {
    id: 'ME-001',
    name: 'Sentry Middle East',
    type: ['executive_protection', 'residential_security', 'event_security'],
    cities: ['Dubai', 'Abu Dhabi', 'Doha', 'Riyadh', 'Kuwait City'],
    countries: ['UAE', 'Qatar', 'Saudi Arabia', 'Kuwait', 'Bahrain'],
    established: 2008,
    certifications: ['SIRA Licensed', 'ISO 9001', 'CPP'],
    pricing: { hourly: 120, daily: 900, monthly: 18000, currency: 'USD' },
    services: [
      'Executive Protection',
      'Residential Security',
      'Event Security',
      'Security Consulting',
      'Risk Assessment'
    ],
    capabilities: {
      executiveProtection: true,
      residentialSecurity: true,
      assetProtection: true,
      cyberSecurity: false,
      emergencyResponse: true,
      travelSecurity: true
    },
    team: {
      size: 150,
      background: ['Ex-Military', 'Law Enforcement', 'Private Security'],
      languages: ['English', 'Arabic', 'Urdu', 'Hindi']
    },
    verification: {
      licensed: true,
      insured: true,
      backgroundChecked: true,
      referenceVerified: true,
      expatSpecialist: true
    },
    responseTime: '24/7 within 30 minutes',
    coverage: 'regional',
    website: 'https://www.sentry-me.com',
    contact: {
      emergency: '+971-4-368-7777',
      business: '+971-4-368-7777',
      email: 'info@sentry-me.com'
    },
    rating: { overall: 4.7, professionalism: 4.8, response: 4.6, discretion: 4.8, expatRating: 4.9 },
    clients: ['Corporate Executives', 'Diplomatic Families', 'HNWIs', 'Royal Families'],
    description: 'Specialized executive protection in GCC region with deep local knowledge and connections.',
    specialOperations: ['VIP Transport Security', 'Luxury Event Security', 'Diplomatic Protection']
  },
  {
    id: 'APAC-001',
    name: 'Blackpanda Asia',
    type: ['cyber_security', 'crisis_management', 'investigation'],
    cities: ['Singapore', 'Hong Kong', 'Tokyo', 'Sydney', 'Seoul'],
    countries: ['Singapore', 'Hong Kong', 'Japan', 'Australia', 'South Korea'],
    established: 2012,
    certifications: ['CISSP', 'CISA', 'CEH', 'ISO 27001'],
    pricing: { hourly: 100, daily: 800, monthly: 15000, currency: 'USD' },
    services: [
      'Cyber Incident Response',
      'Digital Forensics',
      'Cyber Security Assessment',
      'Crisis Management',
      'Security Training'
    ],
    capabilities: {
      executiveProtection: false,
      residentialSecurity: false,
      assetProtection: true,
      cyberSecurity: true,
      emergencyResponse: true,
      travelSecurity: false
    },
    team: {
      size: 80,
      background: ['Cyber Security Experts', 'Ex-Intelligence', 'Forensic Specialists'],
      languages: ['English', 'Mandarin', 'Japanese', 'Korean']
    },
    verification: {
      licensed: true,
      insured: true,
      backgroundChecked: true,
      referenceVerified: true,
      expatSpecialist: true
    },
    responseTime: 'Immediate 24/7',
    coverage: 'regional',
    website: 'https://www.blackpanda.com',
    contact: {
      emergency: '+65-6950-2180',
      business: '+65-6950-2180',
      email: 'emergency@blackpanda.com'
    },
    rating: { overall: 4.8, professionalism: 4.9, response: 4.8, discretion: 4.9, expatRating: 4.7 },
    clients: ['Financial Institutions', 'Tech Companies', 'Multinational Corporations'],
    description: 'Digital forensics and cyber emergency response specializing in Asia-Pacific region.',
    specialOperations: ['Ransomware Response', 'Data Breach Investigation', 'Digital Asset Recovery']
  },
  {
    id: 'AT-001',
    name: "Brink's Global Services",
    type: ['armored_transport', 'asset_protection'],
    cities: ['Global Coverage'],
    countries: ['Global Coverage'],
    established: 1859,
    certifications: ['ISO 9001', 'ISO 28000', 'TAPA FSR'],
    pricing: { hourly: 0, daily: 5000, monthly: 15000, currency: 'USD' },
    services: [
      'Armored Transport',
      'Cash Management',
      'ATM Services',
      'Bullion Transport',
      'High-Value Logistics'
    ],
    capabilities: {
      executiveProtection: false,
      residentialSecurity: false,
      assetProtection: true,
      cyberSecurity: false,
      emergencyResponse: true,
      travelSecurity: false
    },
    team: {
      size: 65000,
      background: ['Security Professionals', 'Armed Guards', 'Logistics Specialists'],
      languages: ['English', 'Spanish', 'French', 'Portuguese', 'Mandarin']
    },
    verification: {
      licensed: true,
      insured: true,
      backgroundChecked: true,
      referenceVerified: true,
      expatSpecialist: false
    },
    responseTime: '24/7 Global Network',
    coverage: 'global',
    website: 'https://www.brinks.com',
    contact: {
      emergency: '+1-804-289-9600',
      business: '+1-804-289-9600',
      email: 'customer.service@brinks.com'
    },
    rating: { overall: 4.6, professionalism: 4.7, response: 4.5, discretion: 4.6, expatRating: 4.4 },
    clients: ['Banks', 'Retailers', 'Jewelers', 'Private Collectors'],
    description: 'World leader in secure logistics and cash management services with global reach.',
    specialOperations: ['International Bullion Transport', 'High-Value Art Transport', 'Cryptocurrency Security']
  },
  {
    id: 'AT-002',
    name: 'Malca-Amit',
    type: ['asset_protection', 'armored_transport'],
    cities: ['Geneva', 'Hong Kong', 'New York', 'London', 'Dubai', 'Singapore'],
    countries: ['Switzerland', 'Hong Kong', 'United States', 'United Kingdom', 'UAE', 'Singapore'],
    established: 1980,
    certifications: ['ISO 9001', 'TAPA', 'Customs Certified'],
    pricing: { hourly: 0, daily: 10000, monthly: 25000, currency: 'USD' },
    services: [
      'Fine Art Transport',
      'Jewelry Logistics',
      'Luxury Asset Transport',
      'Secure Storage',
      'Customs Clearance'
    ],
    capabilities: {
      executiveProtection: false,
      residentialSecurity: false,
      assetProtection: true,
      cyberSecurity: false,
      emergencyResponse: true,
      travelSecurity: false
    },
    team: {
      size: 1500,
      background: ['Logistics Specialists', 'Fine Art Handlers', 'Security Professionals'],
      languages: ['English', 'French', 'German', 'Mandarin', 'Arabic']
    },
    verification: {
      licensed: true,
      insured: true,
      backgroundChecked: true,
      referenceVerified: true,
      expatSpecialist: true
    },
    responseTime: '24/7 Worldwide',
    coverage: 'global',
    website: 'https://www.malca-amit.com',
    contact: {
      emergency: '+41-22-710-1000',
      business: '+41-22-710-1000',
      email: 'info@malca-amit.com'
    },
    rating: { overall: 4.8, professionalism: 4.9, response: 4.7, discretion: 4.9, expatRating: 4.8 },
    clients: ['Art Galleries', 'Private Collectors', 'Auction Houses', 'Luxury Brands'],
    description: 'Specialists in fine art, jewelry, and luxury asset transportation with museum-grade handling.',
    specialOperations: ['Museum Exhibition Transport', 'Private Art Collection Relocation', 'Luxury Watches Transport']
  },
  {
    id: 'LATAM-001',
    name: 'AS Solution',
    type: ['executive_protection', 'crisis_management', 'kidnap_response'],
    cities: ['Mexico City', 'São Paulo', 'Bogotá', 'Buenos Aires', 'Lima'],
    countries: ['Mexico', 'Brazil', 'Colombia', 'Argentina', 'Peru'],
    established: 2003,
    certifications: ['CPP', 'Crisis Response Certified'],
    pricing: { hourly: 80, daily: 600, monthly: 12000, currency: 'USD' },
    services: [
      'Executive Protection',
      'Kidnap & Ransom Response',
      'Secure Transport',
      'Risk Assessment',
      'Crisis Negotiation'
    ],
    capabilities: {
      executiveProtection: true,
      residentialSecurity: true,
      assetProtection: true,
      cyberSecurity: false,
      emergencyResponse: true,
      travelSecurity: true
    },
    team: {
      size: 200,
      background: ['Ex-Military', 'Law Enforcement', 'Crisis Response'],
      languages: ['Spanish', 'Portuguese', 'English']
    },
    verification: {
      licensed: true,
      insured: true,
      backgroundChecked: true,
      referenceVerified: true,
      expatSpecialist: true
    },
    responseTime: 'Immediate 24/7',
    coverage: 'regional',
    website: 'https://www.as-solution.com',
    contact: {
      emergency: '+55-11-3018-5200',
      business: '+55-11-3018-5200',
      email: 'contact@as-solution.com'
    },
    rating: { overall: 4.7, professionalism: 4.8, response: 4.6, discretion: 4.8, expatRating: 4.9 },
    clients: ['Multinational Executives', 'Mining Companies', 'Oil & Gas Executives'],
    description: 'Specialists in high-risk Latin American environments with extensive kidnap response expertise.',
    specialOperations: ['Kidnap Negotiation', 'Secure Extraction', 'High-Risk Area Operations']
  },
  {
    id: 'EU-001',
    name: 'G4S Secure Solutions',
    type: ['executive_protection', 'residential_security', 'corporate_security', 'event_security'],
    cities: ['London', 'Paris', 'Berlin', 'Madrid', 'Rome', 'Brussels'],
    countries: ['United Kingdom', 'France', 'Germany', 'Spain', 'Italy', 'Belgium'],
    established: 2004,
    certifications: ['ISO 9001', 'SIA Licensed', 'ASIS International'],
    pricing: { hourly: 100, daily: 750, monthly: 16000, currency: 'EUR' },
    services: [
      'Executive Protection',
      'Residential Security',
      'Corporate Security',
      'Event Security',
      'Security Consulting'
    ],
    capabilities: {
      executiveProtection: true,
      residentialSecurity: true,
      assetProtection: true,
      cyberSecurity: false,
      emergencyResponse: true,
      travelSecurity: true
    },
    team: {
      size: 5000,
      background: ['Ex-Military', 'Law Enforcement', 'Security Professionals'],
      languages: ['English', 'French', 'German', 'Spanish', 'Italian']
    },
    verification: {
      licensed: true,
      insured: true,
      backgroundChecked: true,
      referenceVerified: true,
      expatSpecialist: true
    },
    responseTime: '24/7 within 1 hour',
    coverage: 'regional',
    website: 'https://www.g4s.com',
    contact: {
      emergency: '+44-20-7963-3000',
      business: '+44-20-7963-3000',
      email: 'info@g4s.com'
    },
    rating: { overall: 4.5, professionalism: 4.6, response: 4.4, discretion: 4.5, expatRating: 4.6 },
    clients: ['Corporate Headquarters', 'Diplomatic Missions', 'High-Net-Worth Individuals'],
    description: 'Leading European security services provider with comprehensive protection solutions.',
    specialOperations: ['Diplomatic Protection', 'Corporate Campus Security', 'High-Profile Event Security']
  }
];

// Extract unique values for filters
export const CITIES = Array.from(new Set(securityServices.flatMap(s => s.cities))).sort();
export const COUNTRIES = Array.from(new Set(securityServices.flatMap(s => s.countries))).sort();
export const SERVICE_TYPES = [
  'executive_protection',
  'residential_security',
  'asset_protection',
  'armored_transport',
  'cyber_security',
  'travel_security',
  'event_security',
  'kidnap_response',
  'risk_assessment',
  'crisis_management',
  'investigation',
  'corporate_security'
] as const;

export const REGIONS = {
  'North America': ['United States', 'Canada', 'Mexico'],
  'Europe': ['United Kingdom', 'France', 'Germany', 'Spain', 'Italy', 'Belgium', 'Switzerland'],
  'Middle East': ['UAE', 'Qatar', 'Saudi Arabia', 'Kuwait', 'Bahrain'],
  'Asia Pacific': ['Singapore', 'Hong Kong', 'Japan', 'Australia', 'South Korea'],
  'Latin America': ['Brazil', 'Colombia', 'Argentina', 'Peru', 'Chile']
};

export const VERIFICATION_BADGES = {
  licensed: { label: 'Fully Licensed', icon: '📜', color: 'text-blue-600' },
  insured: { label: 'Fully Insured', icon: '🛡️', color: 'text-green-600' },
  backgroundChecked: { label: 'Team Vetted', icon: '🔍', color: 'text-purple-600' },
  expatSpecialist: { label: 'Expat Specialist', icon: '🌍', color: 'text-orange-600' },
  emergencyResponse: { label: '24/7 Response', icon: '🚨', color: 'text-red-600' }
};
