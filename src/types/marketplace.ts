// Expat Marketplace Type Definitions

export type ItemCategory = 
  | 'furniture'
  | 'electronics'
  | 'kitchen'
  | 'bedding'
  | 'transportation'
  | 'work-equipment'
  | 'sports'
  | 'clothing';

export type ItemCondition = 'new' | 'like-new' | 'good' | 'fair' | 'needs-repair';

export type LocationPrivacy = 'hidden' | 'approximate' | 'exact';

export type Urgency = 'flexible' | 'moderate' | 'urgent';

export interface ItemPrice {
  amount: number;
  currency: string;
  originalPrice?: number;
  priceConfidence?: number; // AI-generated 0-100
}

export interface ItemLocation {
  city: string;
  neighborhood: string;
  exactLocation: LocationPrivacy;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ItemAvailability {
  availableFrom: Date;
  availableUntil: Date;
  urgency: Urgency;
}

export interface AIFeatures {
  pricingSuggestion?: number;
  similarItems?: string[];
  demandScore?: number; // 0-100
  recommendedBuyers?: string[];
  descriptionQuality?: number; // 0-100
  aiGenerated?: boolean;
}

export interface SellerProfile {
  id: string;
  name: string;
  photo?: string;
  rating: number;
  totalSales: number;
  responseTime: string;
  verified: boolean;
  joinDate: Date;
  badges: string[];
}

export interface MarketplaceItem {
  id: string;
  seller: SellerProfile;
  category: ItemCategory;
  title: string;
  description: string;
  condition: ItemCondition;
  price: ItemPrice;
  location: ItemLocation;
  availability: ItemAvailability;
  images: string[];
  dimensions?: string;
  weight?: number;
  tags: string[];
  views: number;
  favorites: number;
  aiFeatures: AIFeatures;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'sold' | 'reserved' | 'expired';
}

export interface MarketplaceFilters {
  category?: ItemCategory;
  minPrice?: number;
  maxPrice?: number;
  condition?: ItemCondition[];
  location?: string;
  urgency?: Urgency[];
  radius?: number; // km
  sortBy?: 'recent' | 'price-low' | 'price-high' | 'popular' | 'ai-match';
  searchQuery?: string;
}

export interface ListingDraft {
  images: File[];
  category?: ItemCategory;
  title?: string;
  description?: string;
  condition?: ItemCondition;
  price?: number;
  currency?: string;
  dimensions?: string;
  weight?: number;
  urgency?: Urgency;
}

export interface AIPricingRequest {
  category: ItemCategory;
  condition: ItemCondition;
  title: string;
  description: string;
  originalPrice?: number;
  location: string;
  images?: string[];
}

export interface AIPricingResponse {
  suggestedPrice: number;
  confidence: number;
  reasoning: string;
  comparables: Array<{
    title: string;
    price: number;
    condition: ItemCondition;
  }>;
  marketDemand: 'low' | 'medium' | 'high';
}

export interface AIDescriptionRequest {
  category: ItemCategory;
  condition: ItemCondition;
  title: string;
  features?: string[];
}

export interface AIDescriptionResponse {
  description: string;
  suggestedTags: string[];
  highlights: string[];
}

export interface TransactionRequest {
  itemId: string;
  buyerId: string;
  message: string;
}

export interface Transaction {
  id: string;
  item: MarketplaceItem;
  buyer: SellerProfile;
  seller: SellerProfile;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'disputed';
  message: string;
  createdAt: Date;
  meetupLocation?: string;
  meetupTime?: Date;
}

export const CATEGORY_INFO: Record<ItemCategory, { label: string; emoji: string; typical: string[] }> = {
  furniture: {
    label: 'Furniture',
    emoji: '🛋️',
    typical: ['Sofa', 'Bed', 'Table', 'Chair', 'Wardrobe', 'Desk']
  },
  electronics: {
    label: 'Electronics',
    emoji: '📱',
    typical: ['Laptop', 'Phone', 'TV', 'Speaker', 'Camera', 'Tablet']
  },
  kitchen: {
    label: 'Kitchen & Appliances',
    emoji: '🍳',
    typical: ['Microwave', 'Coffee maker', 'Pots', 'Dishes', 'Utensils', 'Blender']
  },
  bedding: {
    label: 'Bedding & Bath',
    emoji: '🛏️',
    typical: ['Sheets', 'Pillows', 'Towels', 'Duvet', 'Blankets', 'Curtains']
  },
  transportation: {
    label: 'Bikes & Scooters',
    emoji: '🚲',
    typical: ['Bicycle', 'E-bike', 'Scooter', 'Skateboard', 'Helmet', 'Lock']
  },
  'work-equipment': {
    label: 'Office & Work',
    emoji: '💼',
    typical: ['Monitor', 'Keyboard', 'Mouse', 'Chair', 'Lamp', 'Webcam']
  },
  sports: {
    label: 'Sports & Recreation',
    emoji: '⚽',
    typical: ['Gym equipment', 'Yoga mat', 'Sports gear', 'Outdoor gear']
  },
  clothing: {
    label: 'Clothing & Accessories',
    emoji: '👕',
    typical: ['Jackets', 'Shoes', 'Bags', 'Accessories']
  }
};

export const CONDITION_INFO: Record<ItemCondition, { label: string; description: string; priceMultiplier: number }> = {
  'new': {
    label: 'New',
    description: 'Brand new, unused with original packaging',
    priceMultiplier: 0.85
  },
  'like-new': {
    label: 'Like New',
    description: 'Barely used, excellent condition',
    priceMultiplier: 0.75
  },
  'good': {
    label: 'Good',
    description: 'Used but well maintained, minor wear',
    priceMultiplier: 0.55
  },
  'fair': {
    label: 'Fair',
    description: 'Used with visible wear, fully functional',
    priceMultiplier: 0.35
  },
  'needs-repair': {
    label: 'Needs Repair',
    description: 'Not fully functional, needs fixing',
    priceMultiplier: 0.15
  }
};
