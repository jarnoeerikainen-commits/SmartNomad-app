export interface NewsCity {
  id: string;
  cityName: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  primaryLanguage: string;
  englishCoverageLevel: 'excellent' | 'good' | 'basic';
  newsSources: {
    local: string[];
    international: string[];
    english: string[];
  };
  safetyAlerts: boolean;
  tier: 1 | 2 | 3;
}

export interface UserNewsPreferences {
  currentCityId: string | null;
  followedCities: string[];
  interests: {
    technology: number;
    politics: number;
    culture: number;
    safety: number;
    business: number;
    events: number;
    transportation: number;
    food: number;
    health: number;
    education: number;
  };
  contentTypes: {
    breakingNews: boolean;
    safetyAlerts: boolean;
    culturalEvents: boolean;
    businessNews: boolean;
    localEvents: boolean;
  };
  deliveryFrequency: number; // 1-10 articles per day
  deliveryTimes: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  languagePreference: 'local' | 'english' | 'mixed';
  sentimentFilter: 'positive' | 'balanced' | 'all';
  minConfidenceScore: number;
}

export interface LocalNewsArticle {
  id: string;
  cityId: string;
  title: string;
  summary: string;
  contentUrl: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: Date;
  categories: string[];
  sentimentScore: number; // -1.0 to 1.0
  relevanceScore: number;
  language: string;
  locationSpecificity: 'city' | 'region' | 'national';
  safetyRelated: boolean;
  eventRelated: boolean;
  imageUrl?: string;
}

export const DEFAULT_INTERESTS = {
  technology: 0.5,
  politics: 0.3,
  culture: 0.7,
  safety: 1.0,
  business: 0.5,
  events: 0.6,
  transportation: 0.5,
  food: 0.4,
  health: 0.6,
  education: 0.3,
};

export const DEFAULT_PREFERENCES: UserNewsPreferences = {
  currentCityId: null,
  followedCities: [],
  interests: DEFAULT_INTERESTS,
  contentTypes: {
    breakingNews: true,
    safetyAlerts: true,
    culturalEvents: true,
    businessNews: true,
    localEvents: true,
  },
  deliveryFrequency: 5,
  deliveryTimes: {
    morning: true,
    afternoon: false,
    evening: true,
  },
  languagePreference: 'mixed',
  sentimentFilter: 'balanced',
  minConfidenceScore: 0.7,
};
