export type ServicePriority = 1 | 2 | 3 | 4 | 5;
export type VerificationStatus = 'verified' | 'pending' | 'rejected';
export type BookingStatus = 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface ServiceCategory {
  id: string;
  categoryName: string;
  categoryIcon: string;
  priority: ServicePriority;
  description: string;
  averageResponseTime: number; // in minutes
  providerCount?: number;
}

export interface ServiceProvider {
  id: string;
  businessName: string;
  serviceCategories: string[];
  description: string;
  countries: string[];
  cities: string[];
  address: string;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  verificationStatus: VerificationStatus;
  rating: number; // 4.0+ required
  reviewCount: number;
  responseTimeMinutes: number;
  pricingModel: {
    basePrice: number;
    currency: string;
    priceUnit: string;
  };
  languages: string[];
  insuranceVerified: boolean;
  backgroundChecked: boolean;
  availableNow?: boolean;
  emergencyService?: boolean;
}

export interface ServiceBooking {
  id: string;
  userId: string;
  providerId: string;
  serviceCategory: string;
  serviceDetails: {
    description: string;
    location: string;
    preferredDate: string;
    preferredTime: string;
    specialRequirements?: string;
  };
  status: BookingStatus;
  quotedPrice?: number;
  finalPrice?: number;
  userRating?: number;
  userReview?: string;
  createdAt: string;
}

export interface CityServiceData {
  cityName: string;
  countryCode: string;
  availableCategories: string[];
  providerCount: number;
  topRatedProviders: ServiceProvider[];
}
