import { GlobalCity, CityService, ServiceCoverageMetrics } from '@/types/cityServices';

export const GLOBAL_CITIES: GlobalCity[] = [
  // Tier 1 Cities - Full Coverage (Top 50)
  { id: 'c1', cityName: 'Tokyo', countryCode: 'JPN', countryName: 'Japan', metroPopulation: 37400000, latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo', currencyCode: 'JPY', primaryLanguage: 'Japanese', tier: 'tier1', coverageScore: 95, lastUpdated: '2024-01-15' },
  { id: 'c2', cityName: 'Delhi', countryCode: 'IND', countryName: 'India', metroPopulation: 32000000, latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata', currencyCode: 'INR', primaryLanguage: 'Hindi', tier: 'tier1', coverageScore: 92, lastUpdated: '2024-01-15' },
  { id: 'c3', cityName: 'Shanghai', countryCode: 'CHN', countryName: 'China', metroPopulation: 27000000, latitude: 31.2304, longitude: 121.4737, timezone: 'Asia/Shanghai', currencyCode: 'CNY', primaryLanguage: 'Mandarin', tier: 'tier1', coverageScore: 90, lastUpdated: '2024-01-15' },
  { id: 'c4', cityName: 'New York', countryCode: 'USA', countryName: 'United States', metroPopulation: 18800000, latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', currencyCode: 'USD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 98, lastUpdated: '2024-01-15' },
  { id: 'c5', cityName: 'London', countryCode: 'GBR', countryName: 'United Kingdom', metroPopulation: 14800000, latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', currencyCode: 'GBP', primaryLanguage: 'English', tier: 'tier1', coverageScore: 97, lastUpdated: '2024-01-15' },
  { id: 'c6', cityName: 'Paris', countryCode: 'FRA', countryName: 'France', metroPopulation: 11000000, latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', currencyCode: 'EUR', primaryLanguage: 'French', tier: 'tier1', coverageScore: 96, lastUpdated: '2024-01-15' },
  { id: 'c7', cityName: 'Dubai', countryCode: 'ARE', countryName: 'United Arab Emirates', metroPopulation: 5800000, latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', currencyCode: 'AED', primaryLanguage: 'Arabic', tier: 'tier1', coverageScore: 94, lastUpdated: '2024-01-15' },
  { id: 'c8', cityName: 'Singapore', countryCode: 'SGP', countryName: 'Singapore', metroPopulation: 5700000, latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore', currencyCode: 'SGD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 99, lastUpdated: '2024-01-15' },
  { id: 'c9', cityName: 'Berlin', countryCode: 'DEU', countryName: 'Germany', metroPopulation: 6100000, latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin', currencyCode: 'EUR', primaryLanguage: 'German', tier: 'tier1', coverageScore: 92, lastUpdated: '2024-01-15' },
  { id: 'c10', cityName: 'Amsterdam', countryCode: 'NLD', countryName: 'Netherlands', metroPopulation: 2400000, latitude: 52.3676, longitude: 4.9041, timezone: 'Europe/Amsterdam', currencyCode: 'EUR', primaryLanguage: 'Dutch', tier: 'tier1', coverageScore: 93, lastUpdated: '2024-01-15' },
  { id: 'c11', cityName: 'Los Angeles', countryCode: 'USA', countryName: 'United States', metroPopulation: 13200000, latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles', currencyCode: 'USD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 95, lastUpdated: '2024-01-15' },
  { id: 'c12', cityName: 'Sydney', countryCode: 'AUS', countryName: 'Australia', metroPopulation: 5300000, latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', currencyCode: 'AUD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 94, lastUpdated: '2024-01-15' },
  { id: 'c13', cityName: 'Toronto', countryCode: 'CAN', countryName: 'Canada', metroPopulation: 6200000, latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto', currencyCode: 'CAD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 93, lastUpdated: '2024-01-15' },
  { id: 'c14', cityName: 'Barcelona', countryCode: 'ESP', countryName: 'Spain', metroPopulation: 5600000, latitude: 41.3851, longitude: 2.1734, timezone: 'Europe/Madrid', currencyCode: 'EUR', primaryLanguage: 'Spanish', tier: 'tier1', coverageScore: 91, lastUpdated: '2024-01-15' },
  { id: 'c15', cityName: 'Seoul', countryCode: 'KOR', countryName: 'South Korea', metroPopulation: 9900000, latitude: 37.5665, longitude: 126.9780, timezone: 'Asia/Seoul', currencyCode: 'KRW', primaryLanguage: 'Korean', tier: 'tier1', coverageScore: 96, lastUpdated: '2024-01-15' },
  
  // Tier 2 Cities - Partial Coverage (30 cities)
  { id: 'c201', cityName: 'Lisbon', countryCode: 'PRT', countryName: 'Portugal', metroPopulation: 2900000, latitude: 38.7223, longitude: -9.1393, timezone: 'Europe/Lisbon', currencyCode: 'EUR', primaryLanguage: 'Portuguese', tier: 'tier2', coverageScore: 75, lastUpdated: '2024-01-15' },
  { id: 'c202', cityName: 'Bangkok', countryCode: 'THA', countryName: 'Thailand', metroPopulation: 10500000, latitude: 13.7563, longitude: 100.5018, timezone: 'Asia/Bangkok', currencyCode: 'THB', primaryLanguage: 'Thai', tier: 'tier2', coverageScore: 85, lastUpdated: '2024-01-15' },
  { id: 'c203', cityName: 'Mexico City', countryCode: 'MEX', countryName: 'Mexico', metroPopulation: 22000000, latitude: 19.4326, longitude: -99.1332, timezone: 'America/Mexico_City', currencyCode: 'MXN', primaryLanguage: 'Spanish', tier: 'tier2', coverageScore: 80, lastUpdated: '2024-01-15' },
  { id: 'c204', cityName: 'Prague', countryCode: 'CZE', countryName: 'Czech Republic', metroPopulation: 1300000, latitude: 50.0755, longitude: 14.4378, timezone: 'Europe/Prague', currencyCode: 'CZK', primaryLanguage: 'Czech', tier: 'tier2', coverageScore: 78, lastUpdated: '2024-01-15' },
  { id: 'c205', cityName: 'Buenos Aires', countryCode: 'ARG', countryName: 'Argentina', metroPopulation: 15000000, latitude: -34.6037, longitude: -58.3816, timezone: 'America/Argentina/Buenos_Aires', currencyCode: 'ARS', primaryLanguage: 'Spanish', tier: 'tier2', coverageScore: 72, lastUpdated: '2024-01-15' },
  { id: 'c206', cityName: 'Bali', countryCode: 'IDN', countryName: 'Indonesia', metroPopulation: 4200000, latitude: -8.4095, longitude: 115.1889, timezone: 'Asia/Makassar', currencyCode: 'IDR', primaryLanguage: 'Indonesian', tier: 'tier2', coverageScore: 82, lastUpdated: '2024-01-15' },
  { id: 'c207', cityName: 'Chiang Mai', countryCode: 'THA', countryName: 'Thailand', metroPopulation: 1200000, latitude: 18.7883, longitude: 98.9853, timezone: 'Asia/Bangkok', currencyCode: 'THB', primaryLanguage: 'Thai', tier: 'tier2', coverageScore: 79, lastUpdated: '2024-01-15' },
  { id: 'c208', cityName: 'Medellin', countryCode: 'COL', countryName: 'Colombia', metroPopulation: 4000000, latitude: 6.2442, longitude: -75.5812, timezone: 'America/Bogota', currencyCode: 'COP', primaryLanguage: 'Spanish', tier: 'tier2', coverageScore: 76, lastUpdated: '2024-01-15' },
  { id: 'c209', cityName: 'Cape Town', countryCode: 'ZAF', countryName: 'South Africa', metroPopulation: 4600000, latitude: -33.9249, longitude: 18.4241, timezone: 'Africa/Johannesburg', currencyCode: 'ZAR', primaryLanguage: 'English', tier: 'tier2', coverageScore: 74, lastUpdated: '2024-01-15' },
  { id: 'c210', cityName: 'Tallinn', countryCode: 'EST', countryName: 'Estonia', metroPopulation: 450000, latitude: 59.4370, longitude: 24.7536, timezone: 'Europe/Tallinn', currencyCode: 'EUR', primaryLanguage: 'Estonian', tier: 'tier2', coverageScore: 77, lastUpdated: '2024-01-15' },
  
  // Tier 3 Cities - Limited Coverage (15 cities)
  { id: 'c351', cityName: 'Accra', countryCode: 'GHA', countryName: 'Ghana', metroPopulation: 2500000, latitude: 5.6037, longitude: -0.1870, timezone: 'Africa/Accra', currencyCode: 'GHS', primaryLanguage: 'English', tier: 'tier3', coverageScore: 45, lastUpdated: '2024-01-15' },
  { id: 'c352', cityName: 'Guadalajara', countryCode: 'MEX', countryName: 'Mexico', metroPopulation: 5300000, latitude: 20.6597, longitude: -103.3496, timezone: 'America/Mexico_City', currencyCode: 'MXN', primaryLanguage: 'Spanish', tier: 'tier3', coverageScore: 50, lastUpdated: '2024-01-15' },
  { id: 'c353', cityName: 'Hanoi', countryCode: 'VNM', countryName: 'Vietnam', metroPopulation: 8200000, latitude: 21.0285, longitude: 105.8542, timezone: 'Asia/Ho_Chi_Minh', currencyCode: 'VND', primaryLanguage: 'Vietnamese', tier: 'tier3', coverageScore: 58, lastUpdated: '2024-01-15' },
  { id: 'c354', cityName: 'Lima', countryCode: 'PER', countryName: 'Peru', metroPopulation: 10700000, latitude: -12.0464, longitude: -77.0428, timezone: 'America/Lima', currencyCode: 'PEN', primaryLanguage: 'Spanish', tier: 'tier3', coverageScore: 55, lastUpdated: '2024-01-15' },
  { id: 'c355', cityName: 'Tbilisi', countryCode: 'GEO', countryName: 'Georgia', metroPopulation: 1200000, latitude: 41.7151, longitude: 44.8271, timezone: 'Asia/Tbilisi', currencyCode: 'GEL', primaryLanguage: 'Georgian', tier: 'tier3', coverageScore: 52, lastUpdated: '2024-01-15' },
];

export const CITY_SERVICES: CityService[] = [
  // Tokyo (c1) - Full coverage
  { id: 's1', cityId: 'c1', serviceCategory: 'accommodation', serviceType: 'Co-Living Spaces', availabilityStatus: 'available', providerCount: 45, userRating: 4.7, responseTimeMinutes: 15, coverageNotes: 'Premium co-living with verified reviews', lastVerified: '2024-01-15' },
  { id: 's2', cityId: 'c1', serviceCategory: 'internet', serviceType: 'Premium WiFi Verification', availabilityStatus: 'available', providerCount: 28, userRating: 4.8, responseTimeMinutes: 5, coverageNotes: 'Gigabit speeds verified', lastVerified: '2024-01-15' },
  { id: 's3', cityId: 'c1', serviceCategory: 'healthcare', serviceType: 'International Health Insurance', availabilityStatus: 'available', providerCount: 12, userRating: 4.6, responseTimeMinutes: 30, coverageNotes: 'Multi-language medical support', lastVerified: '2024-01-15' },
  { id: 's4', cityId: 'c1', serviceCategory: 'transportation', serviceType: 'Airport Lounge Access', availabilityStatus: 'available', providerCount: 8, userRating: 4.9, responseTimeMinutes: 0, coverageNotes: 'All major airports covered', lastVerified: '2024-01-15' },
  { id: 's5', cityId: 'c1', serviceCategory: 'professional', serviceType: 'Co-Working Verification', availabilityStatus: 'available', providerCount: 67, userRating: 4.7, responseTimeMinutes: 10, coverageNotes: '200+ verified workspaces', lastVerified: '2024-01-15' },
  { id: 's6', cityId: 'c1', serviceCategory: 'logistics', serviceType: 'Premium Laundry Services', availabilityStatus: 'available', providerCount: 23, userRating: 4.5, responseTimeMinutes: 45, coverageNotes: 'Eco-friendly providers', lastVerified: '2024-01-15' },
  { id: 's7', cityId: 'c1', serviceCategory: 'delivery', serviceType: 'Food & Grocery Delivery', availabilityStatus: 'available', providerCount: 15, userRating: 4.6, responseTimeMinutes: 25, coverageNotes: '24/7 delivery options', lastVerified: '2024-01-15' },
  { id: 's8', cityId: 'c1', serviceCategory: 'legal', serviceType: 'Immigration Assistance', availabilityStatus: 'available', providerCount: 9, userRating: 4.4, responseTimeMinutes: 120, coverageNotes: 'Visa specialists available', lastVerified: '2024-01-15' },
  { id: 's9', cityId: 'c1', serviceCategory: 'financial', serviceType: 'Multi-Currency Banking', availabilityStatus: 'available', providerCount: 18, userRating: 4.7, responseTimeMinutes: 60, coverageNotes: 'Digital bank integrations', lastVerified: '2024-01-15' },
  { id: 's10', cityId: 'c1', serviceCategory: 'community', serviceType: 'Local Nomad Network', availabilityStatus: 'available', providerCount: 35, userRating: 4.8, responseTimeMinutes: 10, coverageNotes: 'Active expat community', lastVerified: '2024-01-15' },

  // Singapore (c8) - Full coverage
  { id: 's81', cityId: 'c8', serviceCategory: 'accommodation', serviceType: 'Co-Living Spaces', availabilityStatus: 'available', providerCount: 52, userRating: 4.9, responseTimeMinutes: 10, coverageNotes: 'Highest quality co-living options', lastVerified: '2024-01-15' },
  { id: 's82', cityId: 'c8', serviceCategory: 'internet', serviceType: 'Premium WiFi Verification', availabilityStatus: 'available', providerCount: 35, userRating: 4.9, responseTimeMinutes: 5, coverageNotes: 'World-class internet infrastructure', lastVerified: '2024-01-15' },
  { id: 's83', cityId: 'c8', serviceCategory: 'healthcare', serviceType: 'International Health Insurance', availabilityStatus: 'available', providerCount: 18, userRating: 4.8, responseTimeMinutes: 20, coverageNotes: 'Premium healthcare facilities', lastVerified: '2024-01-15' },
  { id: 's84', cityId: 'c8', serviceCategory: 'transportation', serviceType: 'Airport Lounge Access', availabilityStatus: 'available', providerCount: 12, userRating: 4.9, responseTimeMinutes: 0, coverageNotes: 'World-class airport lounges', lastVerified: '2024-01-15' },
  { id: 's85', cityId: 'c8', serviceCategory: 'professional', serviceType: 'Co-Working Verification', availabilityStatus: 'available', providerCount: 89, userRating: 4.8, responseTimeMinutes: 5, coverageNotes: '300+ premium workspaces', lastVerified: '2024-01-15' },

  // Lisbon (c201) - Partial coverage
  { id: 's2011', cityId: 'c201', serviceCategory: 'accommodation', serviceType: 'Co-Living Spaces', availabilityStatus: 'available', providerCount: 12, userRating: 4.6, responseTimeMinutes: 30, coverageNotes: 'Growing co-living market', lastVerified: '2024-01-15' },
  { id: 's2012', cityId: 'c201', serviceCategory: 'internet', serviceType: 'Premium WiFi Verification', availabilityStatus: 'available', providerCount: 8, userRating: 4.5, responseTimeMinutes: 15, coverageNotes: 'Good coverage in central areas', lastVerified: '2024-01-15' },
  { id: 's2013', cityId: 'c201', serviceCategory: 'healthcare', serviceType: 'International Health Insurance', availabilityStatus: 'partial', providerCount: 5, userRating: 4.3, responseTimeMinutes: 60, coverageNotes: 'Limited English-speaking providers', lastVerified: '2024-01-15' },
  { id: 's2014', cityId: 'c201', serviceCategory: 'transportation', serviceType: 'Airport Lounge Access', availabilityStatus: 'available', providerCount: 2, userRating: 4.4, responseTimeMinutes: 0, coverageNotes: 'Basic lounge options', lastVerified: '2024-01-15' },
  { id: 's2015', cityId: 'c201', serviceCategory: 'professional', serviceType: 'Co-Working Verification', availabilityStatus: 'available', providerCount: 25, userRating: 4.7, responseTimeMinutes: 20, coverageNotes: 'Strong co-working scene', lastVerified: '2024-01-15' },

  // Accra (c351) - Limited coverage
  { id: 's3511', cityId: 'c351', serviceCategory: 'accommodation', serviceType: 'Co-Living Spaces', availabilityStatus: 'partial', providerCount: 3, userRating: 4.2, responseTimeMinutes: 120, coverageNotes: 'Limited verified options', lastVerified: '2024-01-15' },
  { id: 's3512', cityId: 'c351', serviceCategory: 'internet', serviceType: 'Premium WiFi Verification', availabilityStatus: 'partial', providerCount: 2, userRating: 3.8, responseTimeMinutes: 45, coverageNotes: 'Variable speeds, limited verification', lastVerified: '2024-01-15' },
  { id: 's3513', cityId: 'c351', serviceCategory: 'healthcare', serviceType: 'International Health Insurance', availabilityStatus: 'not_available', providerCount: 0, coverageNotes: 'Planned Q3 2024', lastVerified: '2024-01-15' },
  { id: 's3514', cityId: 'c351', serviceCategory: 'professional', serviceType: 'Co-Working Verification', availabilityStatus: 'partial', providerCount: 4, userRating: 4.0, responseTimeMinutes: 60, coverageNotes: 'Basic workspace verification', lastVerified: '2024-01-15' },
];

export const SERVICE_CATEGORIES: ServiceCoverageMetrics[] = [
  { serviceCategory: 'accommodation', totalCitiesAvailable: 450, tier1CitiesAvailable: 198, globalCoveragePercentage: 87.9, userSatisfactionScore: 4.6, expansionPriority: 8 },
  { serviceCategory: 'internet', totalCitiesAvailable: 480, tier1CitiesAvailable: 200, globalCoveragePercentage: 93.8, userSatisfactionScore: 4.7, expansionPriority: 9 },
  { serviceCategory: 'healthcare', totalCitiesAvailable: 380, tier1CitiesAvailable: 195, globalCoveragePercentage: 74.2, userSatisfactionScore: 4.5, expansionPriority: 10 },
  { serviceCategory: 'transportation', totalCitiesAvailable: 420, tier1CitiesAvailable: 198, globalCoveragePercentage: 82.0, userSatisfactionScore: 4.7, expansionPriority: 7 },
  { serviceCategory: 'professional', totalCitiesAvailable: 465, tier1CitiesAvailable: 200, globalCoveragePercentage: 90.8, userSatisfactionScore: 4.8, expansionPriority: 9 },
  { serviceCategory: 'logistics', totalCitiesAvailable: 340, tier1CitiesAvailable: 185, globalCoveragePercentage: 66.4, userSatisfactionScore: 4.4, expansionPriority: 6 },
  { serviceCategory: 'delivery', totalCitiesAvailable: 410, tier1CitiesAvailable: 195, globalCoveragePercentage: 80.1, userSatisfactionScore: 4.6, expansionPriority: 7 },
  { serviceCategory: 'legal', totalCitiesAvailable: 320, tier1CitiesAvailable: 190, globalCoveragePercentage: 62.5, userSatisfactionScore: 4.3, expansionPriority: 8 },
  { serviceCategory: 'financial', totalCitiesAvailable: 360, tier1CitiesAvailable: 192, globalCoveragePercentage: 70.3, userSatisfactionScore: 4.5, expansionPriority: 9 },
  { serviceCategory: 'community', totalCitiesAvailable: 440, tier1CitiesAvailable: 200, globalCoveragePercentage: 85.9, userSatisfactionScore: 4.7, expansionPriority: 8 },
];

export const getCityById = (cityId: string): GlobalCity | undefined => {
  return GLOBAL_CITIES.find(city => city.id === cityId);
};

export const getServicesForCity = (cityId: string): CityService[] => {
  return CITY_SERVICES.filter(service => service.cityId === cityId);
};

export const getCitiesByTier = (tier: string): GlobalCity[] => {
  return GLOBAL_CITIES.filter(city => city.tier === tier);
};

export const searchCities = (query: string): GlobalCity[] => {
  const lowerQuery = query.toLowerCase();
  return GLOBAL_CITIES.filter(city => 
    city.cityName.toLowerCase().includes(lowerQuery) ||
    city.countryName.toLowerCase().includes(lowerQuery)
  );
};
