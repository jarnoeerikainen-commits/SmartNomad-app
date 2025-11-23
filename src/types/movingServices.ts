export type MoveType = 'international' | 'local';
export type ContainerSize = '20ft' | '40ft' | 'LCL' | 'air' | 'custom';
export type Urgency = 'flexible' | 'standard' | 'urgent';
export type MoveStatus = 'draft' | 'quotes-pending' | 'quotes-received' | 'booked' | 'in-progress' | 'completed';
export type RoomType = 'living' | 'bedroom' | 'kitchen' | 'dining' | 'office' | 'garage' | 'storage' | 'other';

export interface LocationDetails {
  city: string;
  country: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
}

export interface DateRange {
  startDate: string;
  endDate: string;
  flexible: boolean;
}

export interface RoomInventory {
  room: RoomType;
  items: string[];
  estimatedBoxes: number;
  specialHandling: boolean;
  notes?: string;
}

export interface SpecialItem {
  name: string;
  category: string;
  requiresSpecialHandling: boolean;
  estimatedValue?: number;
}

export interface MovingRequest {
  id: string;
  userId: string;
  type: MoveType;
  route: {
    from: LocationDetails;
    to: LocationDetails;
    preferredDates: DateRange;
    urgency: Urgency;
  };
  inventory: {
    containerSize?: ContainerSize;
    roomBreakdown: RoomInventory[];
    specialItems: SpecialItem[];
    totalVolume: number;
    estimatedWeight: number;
    totalBoxes: number;
  };
  services: {
    packing: boolean;
    unpacking: boolean;
    insurance: boolean;
    storage: boolean;
    vehicleTransport: boolean;
    petRelocation: boolean;
    furnitureAssembly: boolean;
  };
  budget: {
    range: string;
    currency: string;
    maxBudget?: number;
  };
  status: MoveStatus;
  createdAt: string;
  quotes?: MovingQuote[];
}

export interface MovingQuote {
  id: string;
  providerId: string;
  providerName: string;
  moveRequestId: string;
  totalCost: number;
  currency: string;
  breakdown: {
    shipping?: number;
    packing?: number;
    insurance?: number;
    storage?: number;
    customs?: number;
    other?: number;
  };
  includedServices: string[];
  excludedServices: string[];
  estimatedDuration: string;
  validUntil: string;
  rating: number;
  aiRecommendation?: 'best-value' | 'premium' | 'budget' | 'fastest';
  notes?: string;
  createdAt: string;
}

export interface MovingServiceProvider {
  id: string;
  name: string;
  type: 'international' | 'local' | 'both';
  logo?: string;
  rating: number;
  reviews: number;
  coverage: string[];
  specialties: string[];
  services: string[];
  apiIntegration: boolean;
  autoQuote: boolean;
  website: string;
  description: string;
  priceRange: {
    min: number;
    max: number;
    currency: string;
    unit: 'per-move' | 'per-hour' | 'per-cubic-meter';
  };
  certifications: string[];
  insuranceCoverage: boolean;
  featured: boolean;
}

export interface MovingFilters {
  type?: MoveType;
  origin?: string;
  destination?: string;
  minRating?: number;
  maxBudget?: number;
  services?: string[];
  urgency?: Urgency;
}

export interface AIMovingAssessment {
  estimatedBoxes: number;
  estimatedWeight: number;
  recommendedContainer?: ContainerSize;
  suggestedServices: string[];
  costEstimate: {
    min: number;
    max: number;
    confidence: number;
  };
  timeline: string;
  warnings: string[];
}
