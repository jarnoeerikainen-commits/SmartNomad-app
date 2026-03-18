export type WellnessCategory = 
  | 'gym' 
  | 'spa' 
  | 'yoga' 
  | 'private-gym' 
  | 'sauna' 
  | 'sports-testing' 
  | 'massage' 
  | 'performance';

export interface WellnessProvider {
  id: string;
  name: string;
  category: WellnessCategory;
  city: string;
  country: string;
  countryCode: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone?: string;
  website?: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  description: string;
  highlights: string[];
  languages: string[];
  openNow?: boolean;
  imageUrl?: string;
  isHintsa?: boolean;
}

export interface WellnessCity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  providerCount: number;
}

export const WELLNESS_CATEGORY_INFO: Record<WellnessCategory, { label: string; icon: string; emoji: string }> = {
  'gym': { label: 'Gyms', icon: 'Dumbbell', emoji: '🏋️' },
  'spa': { label: 'Spas', icon: 'Sparkles', emoji: '💆' },
  'yoga': { label: 'Yoga Studios', icon: 'Heart', emoji: '🧘' },
  'private-gym': { label: 'Private High-Level Gyms', icon: 'Crown', emoji: '👑' },
  'sauna': { label: 'Public Saunas', icon: 'Flame', emoji: '🔥' },
  'sports-testing': { label: 'Sports Testing Centers', icon: 'Activity', emoji: '📊' },
  'massage': { label: 'Massage Centers', icon: 'Hand', emoji: '💆‍♂️' },
  'performance': { label: 'Performance Coaching', icon: 'Zap', emoji: '⚡' },
};
