export type CityTier = 'tier1' | 'tier2' | 'tier3';
export type ServiceStatus = 'available' | 'partial' | 'planned' | 'not_available';
export type ServiceCategory = 'accommodation' | 'internet' | 'healthcare' | 'transportation' | 'professional' | 'logistics' | 'delivery' | 'legal' | 'financial' | 'community';

export interface GlobalCity {
  id: string;
  cityName: string;
  countryCode: string;
  countryName: string;
  metroPopulation: number;
  latitude: number;
  longitude: number;
  timezone: string;
  currencyCode: string;
  primaryLanguage: string;
  tier: CityTier;
  coverageScore: number;
  lastUpdated: string;
}

export interface CityService {
  id: string;
  cityId: string;
  serviceCategory: ServiceCategory;
  serviceType: string;
  availabilityStatus: ServiceStatus;
  providerCount: number;
  userRating?: number;
  responseTimeMinutes?: number;
  coverageNotes: string;
  lastVerified: string;
}

export interface ServiceCoverageMetrics {
  serviceCategory: ServiceCategory;
  totalCitiesAvailable: number;
  tier1CitiesAvailable: number;
  globalCoveragePercentage: number;
  userSatisfactionScore: number;
  expansionPriority: number;
}

export interface CitySearchFilters {
  requiredServices: string[];
  preferredRegions: string[];
  minCoverageScore: number;
  tier?: CityTier;
  languages?: string[];
}

export interface CityMatch {
  city: GlobalCity;
  matchPercentage: number;
  availableServices: CityService[];
  missingServices: string[];
}
