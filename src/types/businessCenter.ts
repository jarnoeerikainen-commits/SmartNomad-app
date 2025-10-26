export type ServiceType = 'printing' | 'fax' | 'computer' | 'scanning' | 'shipping';

export interface BusinessCenter {
  id: string;
  name: string;
  address: string;
  cityId: string;
  cityName: string;
  country: string;
  countryCode: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  services: ServiceType[];
  isOpenNow?: boolean;
  website?: string;
  phone?: string;
  priceLevel: number; // 1-4, where 1 is cheapest
  description: string;
  openingHours?: string;
}

export interface BusinessCenterCity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  coordinates: { lat: number; lng: number };
  timezone: string;
  currency: string;
}

export interface BusinessCenterFilters {
  cityId?: string;
  countryCode?: string;
  services?: ServiceType[];
  minRating?: number;
  sortBy?: 'proximity' | 'rating' | 'reviews';
  userLocation?: { lat: number; lng: number };
}
