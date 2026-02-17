// User Profile Type Definitions with GDPR Compliance

export interface GDPRConsent {
  marketing: boolean;
  profiling: boolean;
  thirdPartySharing: boolean;
  timestamp: Date;
  ipAddress?: string;
}

export interface CoreProfile {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    birthDate?: string;
    age?: number;
    gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
    profilePhoto?: string;
    bio?: string;
    nickname?: string;
  };
  
  legal: {
    passportCountries: string[];
    taxResidencyCountry: string;
    currentResidencyCountry: string;
    visaStatus: 'citizen' | 'resident' | 'visa' | 'tourist';
    drivingLicense: {
      hasLicense: boolean;
      countries?: string[];
      internationalPermit?: boolean;
      categories?: ('A' | 'B' | 'C' | 'D' | 'motorcycle')[];
    };
    gdprConsent: GDPRConsent;
  };
}

export interface LifestyleProfile {
  family: {
    maritalStatus: 'single' | 'married' | 'partnered' | 'divorced' | 'widowed' | 'prefer-not-to-say';
    dependents: {
      children: number;
      adults: number;
      ages?: number[];
    };
    pets: {
      hasPets: boolean;
      types?: ('dog' | 'cat' | 'bird' | 'fish' | 'reptile' | 'rabbit' | 'other')[];
      names?: string[];
      count?: number;
      travelFriendly?: boolean;
    };
  };

  professional: {
    employmentStatus: 'employed' | 'self-employed' | 'freelancer' | 'entrepreneur' | 'student' | 'retired' | 'seeking';
    jobTitle?: string;
    company?: string;
    industry?: string;
    yearsExperience?: number;
    incomeBracket?: '<30k' | '30-60k' | '60-100k' | '100-150k' | '150-250k' | '250k+';
    incomeCurrency?: string;
    remoteWork: {
      isRemoteWorker: boolean;
      workType?: 'full-time' | 'part-time' | 'project-based' | 'hybrid';
      timezoneCompatibility?: string[];
      internetRequirements?: 'basic' | 'high-speed' | 'video-calls' | 'streaming';
      preferredWorkHours?: string;
    };
    skills?: string[];
    linkedIn?: string;
  };

  education?: {
    level: 'high-school' | 'bachelors' | 'masters' | 'phd' | 'self-taught' | 'other';
    field?: string;
    certifications?: string[];
  };
}

export interface TravelProfile {
  preferences: {
    favoriteDestinations: {
      regions: string[];
      countries: string[];
      cities: string[];
      types: ('beach' | 'mountain' | 'city' | 'rural' | 'adventure' | 'cultural' | 'island' | 'desert' | 'arctic')[];
    };
    
    timing: {
      preferredSeasons: ('winter' | 'spring' | 'summer' | 'autumn')[];
      holidayMonths: number[];
      advancePlanning: 'spontaneous' | '1-3-months' | '3-6-months' | '6-plus-months';
      averageTripLength?: string;
    };
    
    budget: {
      accommodation: 'budget' | 'mid-range' | 'luxury' | 'ultra-luxury';
      transportation: 'economy' | 'premium' | 'business' | 'first-class';
      activities: 'minimal' | 'moderate' | 'extensive' | 'unlimited';
      dailyBudget?: string;
    };

    travelStyle: {
      purpose: ('business' | 'pleasure' | 'digital-nomad' | 'family' | 'adventure' | 'wellness' | 'education' | 'retirement')[];
      pacePreference: 'slow-travel' | 'moderate' | 'fast-paced';
      groupPreference: 'solo' | 'couple' | 'family' | 'friends' | 'group-tour';
      luggageStyle: 'carry-on-only' | 'light-packer' | 'normal' | 'heavy-packer';
    };
  };

  mobility: {
    impairments: {
      hasMobilityIssues: boolean;
      types?: ('wheelchair' | 'walking-aid' | 'visual' | 'hearing' | 'other')[];
      requirements?: ('elevator' | 'ramp' | 'ground-floor' | 'accessible-bathroom')[];
    };
    fitnessLevel: 'sedentary' | 'moderate' | 'active' | 'athletic';
  };

  learnedPreferences?: {
    frequentDestinationTypes: string[];
    preferredAirlines: string[];
    preferredHotelChains: string[];
    avgTripDuration: number;
    bookingLeadTime: number;
    restaurantPreferences: string[];
    activityPatterns: string[];
    lastUpdated: Date;
  };
}

export interface PersonalPreferences {
  sports: {
    active: ('tennis' | 'padel' | 'golf' | 'swimming' | 'running' | 'cycling' | 'yoga' | 'pilates' | 'boxing' | 'surfing' | 'skiing' | 'snowboarding' | 'hiking' | 'climbing' | 'martial-arts' | 'basketball' | 'football' | 'volleyball' | 'sailing' | 'diving' | 'gym' | 'crossfit' | 'dance')[];
    spectator: ('formula1' | 'football' | 'tennis' | 'basketball' | 'cricket' | 'rugby' | 'boxing' | 'mma' | 'golf' | 'horse-racing')[];
    fitnessGoals?: string;
    weeklyFrequency?: number;
  };

  hobbies: {
    activities: ('photography' | 'cooking' | 'reading' | 'gaming' | 'music' | 'painting' | 'writing' | 'gardening' | 'meditation' | 'wine-tasting' | 'scuba-diving' | 'skydiving' | 'pottery' | 'board-games' | 'podcasts' | 'blogging' | 'volunteering')[];
    interests: ('art' | 'music' | 'technology' | 'nature' | 'history' | 'food' | 'wellness' | 'culture' | 'fashion' | 'architecture' | 'cinema' | 'theater' | 'literature' | 'science' | 'politics' | 'cryptocurrency' | 'investing' | 'sustainability')[];
    socialPreferences: 'solo' | 'small-groups' | 'large-communities' | 'mixed';
  };

  dietary: {
    preferences: ('vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'kosher' | 'pescatarian' | 'keto' | 'paleo' | 'lactose-free' | 'none')[];
    allergies: string[];
    favoriteCuisines: ('italian' | 'japanese' | 'thai' | 'mexican' | 'indian' | 'chinese' | 'french' | 'mediterranean' | 'korean' | 'vietnamese' | 'middle-eastern' | 'greek' | 'spanish' | 'american' | 'brazilian' | 'turkish' | 'ethiopian' | 'peruvian')[];
    cookingHabits: 'eats-out' | 'cooks-at-home' | 'meal-delivery' | 'mixed';
    mealPreference?: 'breakfast-person' | 'brunch-lover' | 'dinner-person' | 'snacker';
    coffeeTea?: 'coffee-addict' | 'tea-lover' | 'both' | 'neither';
    alcoholPreference?: 'wine' | 'beer' | 'cocktails' | 'spirits' | 'non-drinker' | 'social-drinker';
  };

  accommodation: {
    types: ('hotel' | 'apartment' | 'hostel' | 'villa' | 'house-sit' | 'resort' | 'boutique-hotel' | 'airbnb' | 'coliving')[];
    amenities: ('wifi' | 'kitchen' | 'pool' | 'gym' | 'workspace' | 'parking' | 'pet-friendly' | 'laundry' | 'balcony' | 'air-conditioning' | 'heating' | 'sauna' | 'rooftop')[];
    locations: ('city-center' | 'suburbs' | 'beachfront' | 'countryside' | 'mountains' | 'near-airport' | 'near-coworking')[];
  };

  health: {
    bloodType?: string;
    chronicConditions?: string[];
    medications?: string[];
    insuranceProvider?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relation: string;
    };
    sleepPattern?: 'early-bird' | 'night-owl' | 'flexible';
    mentalWellness?: ('meditation' | 'therapy' | 'journaling' | 'mindfulness' | 'none')[];
  };

  languages?: {
    spoken: { language: string; level: 'basic' | 'conversational' | 'fluent' | 'native' }[];
    learning?: string[];
  };

  entertainment?: {
    musicGenres?: string[];
    movieGenres?: string[];
    bookGenres?: string[];
    streamingServices?: ('netflix' | 'spotify' | 'youtube-premium' | 'disney-plus' | 'hbo' | 'apple-tv' | 'amazon-prime')[];
  };

  shopping?: {
    style: 'minimalist' | 'moderate' | 'shopaholic';
    preferences: ('online' | 'local-markets' | 'luxury-brands' | 'vintage' | 'sustainable' | 'duty-free')[];
  };
}

export interface AIConsentSettings {
  permissions: {
    taxOptimization: boolean;
    travelPlanning: boolean;
    accommodationMatching: boolean;
    insuranceRecommendations: boolean;
    socialConnections: boolean;
    promotionalOffers: boolean;
    healthRecommendations: boolean;
    fitnessRecommendations: boolean;
  };
  
  dataSharing: {
    anonymizedAnalytics: boolean;
    partnerRecommendations: boolean;
    personalizedAds: boolean;
    researchParticipation: boolean;
  };
  
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
  
  core: CoreProfile;
  lifestyle?: LifestyleProfile;
  travel?: TravelProfile;
  personal?: PersonalPreferences;
  aiConsent?: AIConsentSettings;
  
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
