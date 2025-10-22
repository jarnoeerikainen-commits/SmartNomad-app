// User Profile Type Definitions with GDPR Compliance

export interface GDPRConsent {
  marketing: boolean;
  profiling: boolean;
  thirdPartySharing: boolean;
  timestamp: Date;
  ipAddress?: string;
}

export interface CoreProfile {
  // Basic Identification
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    birthDate?: Date;
    profilePhoto?: string;
  };
  
  // Legal & Compliance (Required)
  legal: {
    passportCountries: string[];
    taxResidencyCountry: string;
    currentResidencyCountry: string;
    visaStatus: 'citizen' | 'resident' | 'visa' | 'tourist';
    gdprConsent: GDPRConsent;
  };
}

export interface LifestyleProfile {
  // Family & Relationships (Opt-in)
  family: {
    maritalStatus: 'single' | 'married' | 'partnered' | 'divorced' | 'widowed' | 'prefer-not-to-say';
    dependents: {
      children: number;
      adults: number;
      ages?: number[];
    };
    pets: {
      hasPets: boolean;
      types?: ('dog' | 'cat' | 'bird' | 'other')[];
      count?: number;
      travelFriendly?: boolean;
    };
  };

  // Work & Business (Opt-in)
  professional: {
    employmentStatus: 'employed' | 'self-employed' | 'freelancer' | 'student' | 'retired' | 'seeking';
    remoteWork: {
      isRemoteWorker: boolean;
      workType?: 'full-time' | 'part-time' | 'project-based';
      timezoneCompatibility?: string[];
      internetRequirements?: 'basic' | 'high-speed' | 'video-calls';
    };
    industry?: string;
    incomeBracket?: '<30k' | '30-60k' | '60-100k' | '100-150k' | '150k+';
  };
}

export interface TravelProfile {
  // Travel Patterns (Opt-in)
  preferences: {
    favoriteDestinations: {
      regions: string[];
      countries: string[];
      cities: string[];
      types: ('beach' | 'mountain' | 'city' | 'rural' | 'adventure')[];
    };
    
    timing: {
      preferredSeasons: ('winter' | 'spring' | 'summer' | 'autumn')[];
      holidayMonths: number[];
      advancePlanning: 'spontaneous' | '1-3-months' | '3-6-months' | '6-plus-months';
    };
    
    budget: {
      accommodation: 'budget' | 'mid-range' | 'luxury';
      transportation: 'economy' | 'premium' | 'business';
      activities: 'minimal' | 'moderate' | 'extensive';
    };
  };

  // Mobility & Accessibility (Opt-in)
  mobility: {
    impairments: {
      hasMobilityIssues: boolean;
      types?: ('wheelchair' | 'walking-aid' | 'visual' | 'hearing' | 'other')[];
      requirements?: ('elevator' | 'ramp' | 'ground-floor' | 'accessible-bathroom')[];
    };
    fitnessLevel: 'sedentary' | 'moderate' | 'active' | 'athletic';
  };
}

export interface PersonalPreferences {
  // Lifestyle & Hobbies (Opt-in)
  hobbies: {
    activities: ('hiking' | 'swimming' | 'reading' | 'photography' | 'cooking' | 'sports' | 'gaming' | 'yoga' | 'cycling' | 'tennis')[];
    interests: ('art' | 'music' | 'technology' | 'nature' | 'history' | 'food' | 'wellness' | 'culture')[];
    socialPreferences: 'solo' | 'small-groups' | 'large-communities';
  };

  // Food & Dining (Opt-in)
  dietary: {
    preferences: ('vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'kosher' | 'pescatarian' | 'none')[];
    allergies: string[];
    favoriteCuisines: string[];
    cookingHabits: 'eats-out' | 'cooks-at-home' | 'meal-delivery' | 'mixed';
  };

  // Accommodation Preferences (Opt-in)
  accommodation: {
    types: ('hotel' | 'apartment' | 'hostel' | 'villa' | 'house-sit' | 'resort')[];
    amenities: ('wifi' | 'kitchen' | 'pool' | 'gym' | 'workspace' | 'parking' | 'pet-friendly')[];
    locations: ('city-center' | 'suburbs' | 'beachfront' | 'countryside' | 'mountains')[];
  };
}

export interface AIConsentSettings {
  // Service-Specific Permissions
  permissions: {
    taxOptimization: boolean;
    travelPlanning: boolean;
    accommodationMatching: boolean;
    insuranceRecommendations: boolean;
    socialConnections: boolean;
    promotionalOffers: boolean;
  };
  
  // Data Sharing Levels
  dataSharing: {
    anonymizedAnalytics: boolean;
    partnerRecommendations: boolean;
    personalizedAds: boolean;
    researchParticipation: boolean;
  };
  
  // Automation Preferences
  automation: {
    autoBookFlights: boolean;
    autoExtendVisas: boolean;
    smartBudgeting: boolean;
    proactiveAlerts: boolean;
  };
}

export interface ComprehensiveUserProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  completionLevel: 'basic' | 'core' | 'enhanced' | 'complete';
  
  // Tier 1: Core (Required)
  core: CoreProfile;
  
  // Tier 2: Lifestyle (Opt-in)
  lifestyle?: LifestyleProfile;
  
  // Tier 3: Travel (Opt-in)
  travel?: TravelProfile;
  
  // Tier 4: Personal (Opt-in)
  personal?: PersonalPreferences;
  
  // AI & Consent
  aiConsent?: AIConsentSettings;
  
  // Legacy compatibility
  languages?: string[];
  followedEmbassies?: string[];
}

export type ProfileTier = 'core' | 'lifestyle' | 'travel' | 'personal' | 'ai-consent';

export interface ProfileProgress {
  core: number;
  lifestyle: number;
  travel: number;
  personal: number;
  overall: number;
}
