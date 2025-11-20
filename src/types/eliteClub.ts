export enum ClubType {
  BUSINESS_CLUB = 'Business & Networking',
  GENTLEMENS_CLUB = "Gentlemen's Club",
  WOMENS_CLUB = "Women's Club",
  YACHT_CLUB = 'Yacht & Sailing',
  ATHLETIC_CLUB = 'Athletic & Wellness',
  ARTS_CLUB = 'Arts & Culture',
  SOCIAL_CLUB = 'Social Club',
  UNIVERSITY_CLUB = 'University Club',
  COUNTRY_CLUB = 'Country Club',
  PRIVATE_MEMBERS = 'Private Members Club'
}

export type DressCode = 'Business Formal' | 'Smart Casual' | 'Formal' | 'Resort' | 'Casual Elegant';
export type MembershipType = 'Invitation Only' | 'Application' | 'Corporate' | 'Legacy' | 'Open';

export interface EliteClub {
  id: string;
  name: string;
  type: ClubType[];
  city: string;
  country: string;
  region: string;
  established: number;
  membership: {
    type: MembershipType;
    price: {
      initiation: number;
      annual: number;
      currency: 'USD';
    };
    waitlist: number; // months
  };
  amenities: string[];
  dressCode: DressCode;
  website: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  description: string;
  membershipProcess: string;
  nominationRequired: boolean;
  imageUrl?: string;
  rating: number;
  featured?: boolean;
}

export interface ClubFilters {
  city?: string;
  country?: string;
  region?: string;
  type?: ClubType[];
  priceRange?: { min: number; max: number };
  waitlist?: number;
  dressCode?: DressCode[];
  amenities?: string[];
  searchQuery?: string;
}
