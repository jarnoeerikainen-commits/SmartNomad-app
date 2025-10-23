export type BookingType = 'hour' | 'day' | 'week' | 'month';

export interface PriceRange {
  hour?: number;
  day?: number;
  week?: number;
  month?: number;
  currency: string;
}

export interface OfficeLocation {
  id: string;
  providerId: string;
  cityId: string;
  address: string;
  coordinates: { lat: number; lng: number };
  neighborhood: string;
  amenities: string[];
  openingHours: string;
  contact: {
    phone: string;
    email: string;
  };
}

export interface OfficeProvider {
  id: string;
  name: string;
  cities: string[];
  website: string;
  rating: number;
  amenities: string[];
  bookingTypes: BookingType[];
  priceRange: PriceRange;
  reviews: number;
  locations: OfficeLocation[];
  logo?: string;
  description: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  coordinates: { lat: number; lng: number };
  timezone: string;
  currency: string;
}

export interface OfficeFilters {
  cityId?: string;
  minRating?: number;
  maxPrice?: number;
  bookingType?: BookingType;
  amenities?: string[];
  distance?: number;
}
