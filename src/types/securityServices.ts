export type SecurityType = 
  | 'executive_protection'
  | 'residential_security'
  | 'asset_protection'
  | 'armored_transport'
  | 'cyber_security'
  | 'travel_security'
  | 'event_security'
  | 'kidnap_response'
  | 'risk_assessment'
  | 'crisis_management'
  | 'investigation'
  | 'corporate_security';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type Coverage = 'local' | 'regional' | 'global';
export type SecurityLevel = 'standard' | 'enhanced' | 'maximum';

export interface SecurityCapabilities {
  executiveProtection: boolean;
  residentialSecurity: boolean;
  assetProtection: boolean;
  cyberSecurity: boolean;
  emergencyResponse: boolean;
  travelSecurity: boolean;
}

export interface SecurityTeam {
  size: number;
  background: string[];
  languages: string[];
}

export interface SecurityVerification {
  licensed: boolean;
  insured: boolean;
  backgroundChecked: boolean;
  referenceVerified: boolean;
  expatSpecialist: boolean;
}

export interface SecurityPricing {
  hourly: number;
  daily: number;
  monthly: number;
  currency: 'USD' | 'EUR' | 'GBP';
}

export interface SecurityRating {
  overall: number;
  professionalism: number;
  response: number;
  discretion: number;
  expatRating: number;
}

export interface SecurityContact {
  emergency: string;
  business: string;
  email: string;
}

export interface SecurityService {
  id: string;
  name: string;
  type: SecurityType[];
  cities: string[];
  countries: string[];
  established: number;
  certifications: string[];
  pricing: SecurityPricing;
  services: string[];
  capabilities: SecurityCapabilities;
  team: SecurityTeam;
  verification: SecurityVerification;
  responseTime: string;
  coverage: Coverage;
  website: string;
  contact: SecurityContact;
  rating: SecurityRating;
  clients: string[];
  description: string;
  specialOperations: string[];
}

export interface SecurityFilters {
  query?: string;
  city?: string;
  country?: string;
  region?: string;
  serviceType?: SecurityType;
  coverage?: Coverage;
  maxDailyRate?: number;
  minRating?: number;
  requiresExpatSpecialist?: boolean;
  requires24Response?: boolean;
}
