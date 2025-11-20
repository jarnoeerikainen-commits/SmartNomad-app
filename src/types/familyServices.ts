export type ServiceType = 
  | 'Full-Time Nanny'
  | 'Part-Time Nanny'
  | 'Babysitting'
  | 'Live-In Nanny'
  | 'Newborn Care Specialist'
  | 'Night Nurse'
  | 'Temporary Care'
  | 'Event Childcare'
  | 'Travel Nanny'
  | 'Tutor Nanny'
  | 'Nanny Agency'
  | 'Platform/Marketplace';

export interface ServiceVerification {
  backgroundChecks: boolean;
  firstAidCertified: boolean;
  referenceChecked: boolean;
  expatExperience: boolean;
  multilingual: boolean;
  drivingLicensed?: boolean;
  emergencyTrained?: boolean;
}

export interface ServicePricing {
  hourly: number;
  daily: number;
  monthly: number;
  currency: 'USD' | 'EUR' | 'GBP';
}

export interface ServiceRating {
  overall: number;
  reliability: number;
  communication: number;
  safety: number;
  expatRating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  expatFamily: boolean;
}

export interface FamilyService {
  id: string;
  name: string;
  type: ServiceType[];
  cities: string[];
  countries: string[];
  established: number;
  pricing: ServicePricing;
  services: string[];
  verification: ServiceVerification;
  languages: string[];
  minimumCommitment: string;
  bookingProcess: string;
  website: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  rating: ServiceRating;
  description: string;
  specialFeatures: string[];
}

export interface FamilyServiceFilters {
  city?: string;
  country?: string;
  region?: string;
  serviceType?: ServiceType;
  maxMonthlyPrice?: number;
  languages?: string[];
  verificationRequired?: boolean;
  expatExperience?: boolean;
  emergencyTrained?: boolean;
  minRating?: number;
}
