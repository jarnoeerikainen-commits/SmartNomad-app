export interface CountryGovernmentApp {
  id: string;
  countryCode: string;
  countryName: string;
  flag: string;
  officialAppName: string | null;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  webPortalUrl: string;
  primaryLanguage: string;
  englishSupport: boolean;
  verificationLevel: 'verified' | 'unverified' | 'deprecated';
  region: 'North America' | 'South America' | 'Europe' | 'Asia' | 'Africa' | 'Oceania';
  lastUpdated: string;
}

export interface GovernmentService {
  id: string;
  countryCode: string;
  serviceCategory: ServiceCategory;
  serviceName: string;
  description: string;
  digitalAvailability: boolean;
  appIntegration: boolean;
  averageProcessingTime: string;
  costEstimate: {
    currency: string;
    amount: number;
    usdEquivalent: number;
  };
  requiredDocuments: string[];
  onlinePortalUrl?: string;
  emergencyContact?: string;
  serviceRating?: number;
  lastVerified: string;
}

export type ServiceCategory = 
  | 'immigration'
  | 'taxation'
  | 'healthcare'
  | 'housing'
  | 'documentation'
  | 'transportation'
  | 'employment'
  | 'safety';

export interface UserGovernmentTask {
  id: string;
  userId: string;
  countryCode: string;
  serviceType: string;
  taskDescription: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  deadline: string | null;
  importantNotes: string;
  documentChecklist: string[];
  completedAt: string | null;
  createdAt: string;
}

export interface ServiceCategoryInfo {
  category: ServiceCategory;
  icon: string;
  label: string;
  description: string;
  color: string;
}
