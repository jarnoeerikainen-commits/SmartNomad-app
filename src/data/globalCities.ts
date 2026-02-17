import { GlobalCity, CityService, ServiceCoverageMetrics, CityTier } from '@/types/cityServices';

export const GLOBAL_CITIES: GlobalCity[] = [
  // ═══════════ TIER 1 — Full Coverage (50 cities) ═══════════
  { id: 'c1', cityName: 'Tokyo', countryCode: 'JPN', countryName: 'Japan', metroPopulation: 37400000, latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo', currencyCode: 'JPY', primaryLanguage: 'Japanese', tier: 'tier1', coverageScore: 95, lastUpdated: '2025-12-01' },
  { id: 'c2', cityName: 'Delhi', countryCode: 'IND', countryName: 'India', metroPopulation: 32000000, latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata', currencyCode: 'INR', primaryLanguage: 'Hindi', tier: 'tier1', coverageScore: 92, lastUpdated: '2025-12-01' },
  { id: 'c3', cityName: 'Shanghai', countryCode: 'CHN', countryName: 'China', metroPopulation: 27000000, latitude: 31.2304, longitude: 121.4737, timezone: 'Asia/Shanghai', currencyCode: 'CNY', primaryLanguage: 'Mandarin', tier: 'tier1', coverageScore: 90, lastUpdated: '2025-12-01' },
  { id: 'c4', cityName: 'New York', countryCode: 'USA', countryName: 'United States', metroPopulation: 18800000, latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', currencyCode: 'USD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 98, lastUpdated: '2025-12-01' },
  { id: 'c5', cityName: 'London', countryCode: 'GBR', countryName: 'United Kingdom', metroPopulation: 14800000, latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', currencyCode: 'GBP', primaryLanguage: 'English', tier: 'tier1', coverageScore: 97, lastUpdated: '2025-12-01' },
  { id: 'c6', cityName: 'Paris', countryCode: 'FRA', countryName: 'France', metroPopulation: 11000000, latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', currencyCode: 'EUR', primaryLanguage: 'French', tier: 'tier1', coverageScore: 96, lastUpdated: '2025-12-01' },
  { id: 'c7', cityName: 'Dubai', countryCode: 'ARE', countryName: 'United Arab Emirates', metroPopulation: 5800000, latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', currencyCode: 'AED', primaryLanguage: 'Arabic', tier: 'tier1', coverageScore: 94, lastUpdated: '2025-12-01' },
  { id: 'c8', cityName: 'Singapore', countryCode: 'SGP', countryName: 'Singapore', metroPopulation: 5700000, latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore', currencyCode: 'SGD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 99, lastUpdated: '2025-12-01' },
  { id: 'c9', cityName: 'Berlin', countryCode: 'DEU', countryName: 'Germany', metroPopulation: 6100000, latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin', currencyCode: 'EUR', primaryLanguage: 'German', tier: 'tier1', coverageScore: 92, lastUpdated: '2025-12-01' },
  { id: 'c10', cityName: 'Amsterdam', countryCode: 'NLD', countryName: 'Netherlands', metroPopulation: 2400000, latitude: 52.3676, longitude: 4.9041, timezone: 'Europe/Amsterdam', currencyCode: 'EUR', primaryLanguage: 'Dutch', tier: 'tier1', coverageScore: 93, lastUpdated: '2025-12-01' },
  { id: 'c11', cityName: 'Los Angeles', countryCode: 'USA', countryName: 'United States', metroPopulation: 13200000, latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles', currencyCode: 'USD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 95, lastUpdated: '2025-12-01' },
  { id: 'c12', cityName: 'Sydney', countryCode: 'AUS', countryName: 'Australia', metroPopulation: 5300000, latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', currencyCode: 'AUD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 94, lastUpdated: '2025-12-01' },
  { id: 'c13', cityName: 'Toronto', countryCode: 'CAN', countryName: 'Canada', metroPopulation: 6200000, latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto', currencyCode: 'CAD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 93, lastUpdated: '2025-12-01' },
  { id: 'c14', cityName: 'Barcelona', countryCode: 'ESP', countryName: 'Spain', metroPopulation: 5600000, latitude: 41.3851, longitude: 2.1734, timezone: 'Europe/Madrid', currencyCode: 'EUR', primaryLanguage: 'Spanish', tier: 'tier1', coverageScore: 91, lastUpdated: '2025-12-01' },
  { id: 'c15', cityName: 'Seoul', countryCode: 'KOR', countryName: 'South Korea', metroPopulation: 9900000, latitude: 37.5665, longitude: 126.9780, timezone: 'Asia/Seoul', currencyCode: 'KRW', primaryLanguage: 'Korean', tier: 'tier1', coverageScore: 96, lastUpdated: '2025-12-01' },
  { id: 'c16', cityName: 'Hong Kong', countryCode: 'HKG', countryName: 'Hong Kong', metroPopulation: 7500000, latitude: 22.3193, longitude: 114.1694, timezone: 'Asia/Hong_Kong', currencyCode: 'HKD', primaryLanguage: 'Cantonese', tier: 'tier1', coverageScore: 95, lastUpdated: '2025-12-01' },
  { id: 'c17', cityName: 'San Francisco', countryCode: 'USA', countryName: 'United States', metroPopulation: 4700000, latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles', currencyCode: 'USD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 97, lastUpdated: '2025-12-01' },
  { id: 'c18', cityName: 'Miami', countryCode: 'USA', countryName: 'United States', metroPopulation: 6100000, latitude: 25.7617, longitude: -80.1918, timezone: 'America/New_York', currencyCode: 'USD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 93, lastUpdated: '2025-12-01' },
  { id: 'c19', cityName: 'Melbourne', countryCode: 'AUS', countryName: 'Australia', metroPopulation: 5000000, latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne', currencyCode: 'AUD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 92, lastUpdated: '2025-12-01' },
  { id: 'c20', cityName: 'Madrid', countryCode: 'ESP', countryName: 'Spain', metroPopulation: 6600000, latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid', currencyCode: 'EUR', primaryLanguage: 'Spanish', tier: 'tier1', coverageScore: 90, lastUpdated: '2025-12-01' },
  { id: 'c21', cityName: 'Munich', countryCode: 'DEU', countryName: 'Germany', metroPopulation: 2900000, latitude: 48.1351, longitude: 11.5820, timezone: 'Europe/Berlin', currencyCode: 'EUR', primaryLanguage: 'German', tier: 'tier1', coverageScore: 91, lastUpdated: '2025-12-01' },
  { id: 'c22', cityName: 'Zurich', countryCode: 'CHE', countryName: 'Switzerland', metroPopulation: 1800000, latitude: 47.3769, longitude: 8.5417, timezone: 'Europe/Zurich', currencyCode: 'CHF', primaryLanguage: 'German', tier: 'tier1', coverageScore: 96, lastUpdated: '2025-12-01' },
  { id: 'c23', cityName: 'Stockholm', countryCode: 'SWE', countryName: 'Sweden', metroPopulation: 2400000, latitude: 59.3293, longitude: 18.0686, timezone: 'Europe/Stockholm', currencyCode: 'SEK', primaryLanguage: 'Swedish', tier: 'tier1', coverageScore: 93, lastUpdated: '2025-12-01' },
  { id: 'c24', cityName: 'Copenhagen', countryCode: 'DNK', countryName: 'Denmark', metroPopulation: 2100000, latitude: 55.6761, longitude: 12.5683, timezone: 'Europe/Copenhagen', currencyCode: 'DKK', primaryLanguage: 'Danish', tier: 'tier1', coverageScore: 92, lastUpdated: '2025-12-01' },
  { id: 'c25', cityName: 'Vienna', countryCode: 'AUT', countryName: 'Austria', metroPopulation: 2900000, latitude: 48.2082, longitude: 16.3738, timezone: 'Europe/Vienna', currencyCode: 'EUR', primaryLanguage: 'German', tier: 'tier1', coverageScore: 91, lastUpdated: '2025-12-01' },
  { id: 'c26', cityName: 'Dublin', countryCode: 'IRL', countryName: 'Ireland', metroPopulation: 1900000, latitude: 53.3498, longitude: -6.2603, timezone: 'Europe/Dublin', currencyCode: 'EUR', primaryLanguage: 'English', tier: 'tier1', coverageScore: 93, lastUpdated: '2025-12-01' },
  { id: 'c27', cityName: 'Milan', countryCode: 'ITA', countryName: 'Italy', metroPopulation: 5300000, latitude: 45.4642, longitude: 9.1900, timezone: 'Europe/Rome', currencyCode: 'EUR', primaryLanguage: 'Italian', tier: 'tier1', coverageScore: 90, lastUpdated: '2025-12-01' },
  { id: 'c28', cityName: 'Vancouver', countryCode: 'CAN', countryName: 'Canada', metroPopulation: 2600000, latitude: 49.2827, longitude: -123.1207, timezone: 'America/Vancouver', currencyCode: 'CAD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 92, lastUpdated: '2025-12-01' },
  { id: 'c29', cityName: 'Tel Aviv', countryCode: 'ISR', countryName: 'Israel', metroPopulation: 4100000, latitude: 32.0853, longitude: 34.7818, timezone: 'Asia/Jerusalem', currencyCode: 'ILS', primaryLanguage: 'Hebrew', tier: 'tier1', coverageScore: 94, lastUpdated: '2025-12-01' },
  { id: 'c30', cityName: 'Osaka', countryCode: 'JPN', countryName: 'Japan', metroPopulation: 19300000, latitude: 34.6937, longitude: 135.5023, timezone: 'Asia/Tokyo', currencyCode: 'JPY', primaryLanguage: 'Japanese', tier: 'tier1', coverageScore: 93, lastUpdated: '2025-12-01' },
  { id: 'c31', cityName: 'Chicago', countryCode: 'USA', countryName: 'United States', metroPopulation: 9500000, latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago', currencyCode: 'USD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 94, lastUpdated: '2025-12-01' },
  { id: 'c32', cityName: 'Beijing', countryCode: 'CHN', countryName: 'China', metroPopulation: 21500000, latitude: 39.9042, longitude: 116.4074, timezone: 'Asia/Shanghai', currencyCode: 'CNY', primaryLanguage: 'Mandarin', tier: 'tier1', coverageScore: 89, lastUpdated: '2025-12-01' },
  { id: 'c33', cityName: 'Brussels', countryCode: 'BEL', countryName: 'Belgium', metroPopulation: 2100000, latitude: 50.8503, longitude: 4.3517, timezone: 'Europe/Brussels', currencyCode: 'EUR', primaryLanguage: 'French', tier: 'tier1', coverageScore: 90, lastUpdated: '2025-12-01' },
  { id: 'c34', cityName: 'Helsinki', countryCode: 'FIN', countryName: 'Finland', metroPopulation: 1500000, latitude: 60.1699, longitude: 24.9384, timezone: 'Europe/Helsinki', currencyCode: 'EUR', primaryLanguage: 'Finnish', tier: 'tier1', coverageScore: 91, lastUpdated: '2025-12-01' },
  { id: 'c35', cityName: 'Oslo', countryCode: 'NOR', countryName: 'Norway', metroPopulation: 1400000, latitude: 59.9139, longitude: 10.7522, timezone: 'Europe/Oslo', currencyCode: 'NOK', primaryLanguage: 'Norwegian', tier: 'tier1', coverageScore: 92, lastUpdated: '2025-12-01' },
  { id: 'c36', cityName: 'Taipei', countryCode: 'TWN', countryName: 'Taiwan', metroPopulation: 7000000, latitude: 25.0330, longitude: 121.5654, timezone: 'Asia/Taipei', currencyCode: 'TWD', primaryLanguage: 'Mandarin', tier: 'tier1', coverageScore: 91, lastUpdated: '2025-12-01' },
  { id: 'c37', cityName: 'Mumbai', countryCode: 'IND', countryName: 'India', metroPopulation: 21000000, latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', currencyCode: 'INR', primaryLanguage: 'Hindi', tier: 'tier1', coverageScore: 90, lastUpdated: '2025-12-01' },
  { id: 'c38', cityName: 'Kuala Lumpur', countryCode: 'MYS', countryName: 'Malaysia', metroPopulation: 7800000, latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur', currencyCode: 'MYR', primaryLanguage: 'Malay', tier: 'tier1', coverageScore: 90, lastUpdated: '2025-12-01' },
  { id: 'c39', cityName: 'Rome', countryCode: 'ITA', countryName: 'Italy', metroPopulation: 4300000, latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome', currencyCode: 'EUR', primaryLanguage: 'Italian', tier: 'tier1', coverageScore: 89, lastUpdated: '2025-12-01' },
  { id: 'c40', cityName: 'Warsaw', countryCode: 'POL', countryName: 'Poland', metroPopulation: 3100000, latitude: 52.2297, longitude: 21.0122, timezone: 'Europe/Warsaw', currencyCode: 'PLN', primaryLanguage: 'Polish', tier: 'tier1', coverageScore: 89, lastUpdated: '2025-12-01' },
  { id: 'c41', cityName: 'Abu Dhabi', countryCode: 'ARE', countryName: 'United Arab Emirates', metroPopulation: 2400000, latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai', currencyCode: 'AED', primaryLanguage: 'Arabic', tier: 'tier1', coverageScore: 93, lastUpdated: '2025-12-01' },
  { id: 'c42', cityName: 'Doha', countryCode: 'QAT', countryName: 'Qatar', metroPopulation: 2400000, latitude: 25.2854, longitude: 51.5310, timezone: 'Asia/Qatar', currencyCode: 'QAR', primaryLanguage: 'Arabic', tier: 'tier1', coverageScore: 91, lastUpdated: '2025-12-01' },
  { id: 'c43', cityName: 'Riyadh', countryCode: 'SAU', countryName: 'Saudi Arabia', metroPopulation: 7600000, latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh', currencyCode: 'SAR', primaryLanguage: 'Arabic', tier: 'tier1', coverageScore: 88, lastUpdated: '2025-12-01' },
  { id: 'c44', cityName: 'Shenzhen', countryCode: 'CHN', countryName: 'China', metroPopulation: 17600000, latitude: 22.5431, longitude: 114.0579, timezone: 'Asia/Shanghai', currencyCode: 'CNY', primaryLanguage: 'Mandarin', tier: 'tier1', coverageScore: 90, lastUpdated: '2025-12-01' },
  { id: 'c45', cityName: 'Bangalore', countryCode: 'IND', countryName: 'India', metroPopulation: 12800000, latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', currencyCode: 'INR', primaryLanguage: 'Kannada', tier: 'tier1', coverageScore: 91, lastUpdated: '2025-12-01' },
  { id: 'c46', cityName: 'Washington DC', countryCode: 'USA', countryName: 'United States', metroPopulation: 6300000, latitude: 38.9072, longitude: -77.0369, timezone: 'America/New_York', currencyCode: 'USD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 94, lastUpdated: '2025-12-01' },
  { id: 'c47', cityName: 'Boston', countryCode: 'USA', countryName: 'United States', metroPopulation: 4900000, latitude: 42.3601, longitude: -71.0589, timezone: 'America/New_York', currencyCode: 'USD', primaryLanguage: 'English', tier: 'tier1', coverageScore: 93, lastUpdated: '2025-12-01' },
  { id: 'c48', cityName: 'Montreal', countryCode: 'CAN', countryName: 'Canada', metroPopulation: 4200000, latitude: 45.5017, longitude: -73.5673, timezone: 'America/Toronto', currencyCode: 'CAD', primaryLanguage: 'French', tier: 'tier1', coverageScore: 91, lastUpdated: '2025-12-01' },
  { id: 'c49', cityName: 'Athens', countryCode: 'GRC', countryName: 'Greece', metroPopulation: 3200000, latitude: 37.9838, longitude: 23.7275, timezone: 'Europe/Athens', currencyCode: 'EUR', primaryLanguage: 'Greek', tier: 'tier1', coverageScore: 88, lastUpdated: '2025-12-01' },
  { id: 'c50', cityName: 'Lisbon', countryCode: 'PRT', countryName: 'Portugal', metroPopulation: 2900000, latitude: 38.7223, longitude: -9.1393, timezone: 'Europe/Lisbon', currencyCode: 'EUR', primaryLanguage: 'Portuguese', tier: 'tier1', coverageScore: 92, lastUpdated: '2025-12-01' },

  // ═══════════ TIER 2 — Growing Networks (30 cities) ═══════════
  { id: 'c51', cityName: 'Bangkok', countryCode: 'THA', countryName: 'Thailand', metroPopulation: 10500000, latitude: 13.7563, longitude: 100.5018, timezone: 'Asia/Bangkok', currencyCode: 'THB', primaryLanguage: 'Thai', tier: 'tier2', coverageScore: 85, lastUpdated: '2025-12-01' },
  { id: 'c52', cityName: 'Mexico City', countryCode: 'MEX', countryName: 'Mexico', metroPopulation: 22000000, latitude: 19.4326, longitude: -99.1332, timezone: 'America/Mexico_City', currencyCode: 'MXN', primaryLanguage: 'Spanish', tier: 'tier2', coverageScore: 80, lastUpdated: '2025-12-01' },
  { id: 'c53', cityName: 'Prague', countryCode: 'CZE', countryName: 'Czech Republic', metroPopulation: 1300000, latitude: 50.0755, longitude: 14.4378, timezone: 'Europe/Prague', currencyCode: 'CZK', primaryLanguage: 'Czech', tier: 'tier2', coverageScore: 82, lastUpdated: '2025-12-01' },
  { id: 'c54', cityName: 'Buenos Aires', countryCode: 'ARG', countryName: 'Argentina', metroPopulation: 15000000, latitude: -34.6037, longitude: -58.3816, timezone: 'America/Argentina/Buenos_Aires', currencyCode: 'ARS', primaryLanguage: 'Spanish', tier: 'tier2', coverageScore: 78, lastUpdated: '2025-12-01' },
  { id: 'c55', cityName: 'Bali', countryCode: 'IDN', countryName: 'Indonesia', metroPopulation: 4200000, latitude: -8.4095, longitude: 115.1889, timezone: 'Asia/Makassar', currencyCode: 'IDR', primaryLanguage: 'Indonesian', tier: 'tier2', coverageScore: 83, lastUpdated: '2025-12-01' },
  { id: 'c56', cityName: 'Chiang Mai', countryCode: 'THA', countryName: 'Thailand', metroPopulation: 1200000, latitude: 18.7883, longitude: 98.9853, timezone: 'Asia/Bangkok', currencyCode: 'THB', primaryLanguage: 'Thai', tier: 'tier2', coverageScore: 81, lastUpdated: '2025-12-01' },
  { id: 'c57', cityName: 'Medellín', countryCode: 'COL', countryName: 'Colombia', metroPopulation: 4000000, latitude: 6.2442, longitude: -75.5812, timezone: 'America/Bogota', currencyCode: 'COP', primaryLanguage: 'Spanish', tier: 'tier2', coverageScore: 79, lastUpdated: '2025-12-01' },
  { id: 'c58', cityName: 'Cape Town', countryCode: 'ZAF', countryName: 'South Africa', metroPopulation: 4600000, latitude: -33.9249, longitude: 18.4241, timezone: 'Africa/Johannesburg', currencyCode: 'ZAR', primaryLanguage: 'English', tier: 'tier2', coverageScore: 77, lastUpdated: '2025-12-01' },
  { id: 'c59', cityName: 'Tallinn', countryCode: 'EST', countryName: 'Estonia', metroPopulation: 450000, latitude: 59.4370, longitude: 24.7536, timezone: 'Europe/Tallinn', currencyCode: 'EUR', primaryLanguage: 'Estonian', tier: 'tier2', coverageScore: 80, lastUpdated: '2025-12-01' },
  { id: 'c60', cityName: 'Istanbul', countryCode: 'TUR', countryName: 'Turkey', metroPopulation: 15600000, latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul', currencyCode: 'TRY', primaryLanguage: 'Turkish', tier: 'tier2', coverageScore: 82, lastUpdated: '2025-12-01' },
  { id: 'c61', cityName: 'São Paulo', countryCode: 'BRA', countryName: 'Brazil', metroPopulation: 22400000, latitude: -23.5505, longitude: -46.6333, timezone: 'America/Sao_Paulo', currencyCode: 'BRL', primaryLanguage: 'Portuguese', tier: 'tier2', coverageScore: 81, lastUpdated: '2025-12-01' },
  { id: 'c62', cityName: 'Bogotá', countryCode: 'COL', countryName: 'Colombia', metroPopulation: 11000000, latitude: 4.7110, longitude: -74.0721, timezone: 'America/Bogota', currencyCode: 'COP', primaryLanguage: 'Spanish', tier: 'tier2', coverageScore: 76, lastUpdated: '2025-12-01' },
  { id: 'c63', cityName: 'Jakarta', countryCode: 'IDN', countryName: 'Indonesia', metroPopulation: 34500000, latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta', currencyCode: 'IDR', primaryLanguage: 'Indonesian', tier: 'tier2', coverageScore: 78, lastUpdated: '2025-12-01' },
  { id: 'c64', cityName: 'Manila', countryCode: 'PHL', countryName: 'Philippines', metroPopulation: 13900000, latitude: 14.5995, longitude: 120.9842, timezone: 'Asia/Manila', currencyCode: 'PHP', primaryLanguage: 'Filipino', tier: 'tier2', coverageScore: 75, lastUpdated: '2025-12-01' },
  { id: 'c65', cityName: 'Ho Chi Minh City', countryCode: 'VNM', countryName: 'Vietnam', metroPopulation: 9000000, latitude: 10.8231, longitude: 106.6297, timezone: 'Asia/Ho_Chi_Minh', currencyCode: 'VND', primaryLanguage: 'Vietnamese', tier: 'tier2', coverageScore: 77, lastUpdated: '2025-12-01' },
  { id: 'c66', cityName: 'Santiago', countryCode: 'CHL', countryName: 'Chile', metroPopulation: 7100000, latitude: -33.4489, longitude: -70.6693, timezone: 'America/Santiago', currencyCode: 'CLP', primaryLanguage: 'Spanish', tier: 'tier2', coverageScore: 79, lastUpdated: '2025-12-01' },
  { id: 'c67', cityName: 'Nairobi', countryCode: 'KEN', countryName: 'Kenya', metroPopulation: 5100000, latitude: -1.2921, longitude: 36.8219, timezone: 'Africa/Nairobi', currencyCode: 'KES', primaryLanguage: 'Swahili', tier: 'tier2', coverageScore: 74, lastUpdated: '2025-12-01' },
  { id: 'c68', cityName: 'Lagos', countryCode: 'NGA', countryName: 'Nigeria', metroPopulation: 16000000, latitude: 6.5244, longitude: 3.3792, timezone: 'Africa/Lagos', currencyCode: 'NGN', primaryLanguage: 'English', tier: 'tier2', coverageScore: 72, lastUpdated: '2025-12-01' },
  { id: 'c69', cityName: 'Johannesburg', countryCode: 'ZAF', countryName: 'South Africa', metroPopulation: 5700000, latitude: -26.2041, longitude: 28.0473, timezone: 'Africa/Johannesburg', currencyCode: 'ZAR', primaryLanguage: 'English', tier: 'tier2', coverageScore: 76, lastUpdated: '2025-12-01' },
  { id: 'c70', cityName: 'Auckland', countryCode: 'NZL', countryName: 'New Zealand', metroPopulation: 1700000, latitude: -36.8485, longitude: 174.7633, timezone: 'Pacific/Auckland', currencyCode: 'NZD', primaryLanguage: 'English', tier: 'tier2', coverageScore: 84, lastUpdated: '2025-12-01' },
  { id: 'c71', cityName: 'Budapest', countryCode: 'HUN', countryName: 'Hungary', metroPopulation: 3000000, latitude: 47.4979, longitude: 19.0402, timezone: 'Europe/Budapest', currencyCode: 'HUF', primaryLanguage: 'Hungarian', tier: 'tier2', coverageScore: 79, lastUpdated: '2025-12-01' },
  { id: 'c72', cityName: 'Bucharest', countryCode: 'ROU', countryName: 'Romania', metroPopulation: 2200000, latitude: 44.4268, longitude: 26.1025, timezone: 'Europe/Bucharest', currencyCode: 'RON', primaryLanguage: 'Romanian', tier: 'tier2', coverageScore: 76, lastUpdated: '2025-12-01' },
  { id: 'c73', cityName: 'Riga', countryCode: 'LVA', countryName: 'Latvia', metroPopulation: 640000, latitude: 56.9496, longitude: 24.1052, timezone: 'Europe/Riga', currencyCode: 'EUR', primaryLanguage: 'Latvian', tier: 'tier2', coverageScore: 75, lastUpdated: '2025-12-01' },
  { id: 'c74', cityName: 'Playa del Carmen', countryCode: 'MEX', countryName: 'Mexico', metroPopulation: 300000, latitude: 20.6296, longitude: -87.0739, timezone: 'America/Cancun', currencyCode: 'MXN', primaryLanguage: 'Spanish', tier: 'tier2', coverageScore: 78, lastUpdated: '2025-12-01' },
  { id: 'c75', cityName: 'Porto', countryCode: 'PRT', countryName: 'Portugal', metroPopulation: 1700000, latitude: 41.1579, longitude: -8.6291, timezone: 'Europe/Lisbon', currencyCode: 'EUR', primaryLanguage: 'Portuguese', tier: 'tier2', coverageScore: 80, lastUpdated: '2025-12-01' },
  { id: 'c76', cityName: 'Marrakech', countryCode: 'MAR', countryName: 'Morocco', metroPopulation: 1300000, latitude: 31.6295, longitude: -7.9811, timezone: 'Africa/Casablanca', currencyCode: 'MAD', primaryLanguage: 'Arabic', tier: 'tier2', coverageScore: 72, lastUpdated: '2025-12-01' },
  { id: 'c77', cityName: 'Casablanca', countryCode: 'MAR', countryName: 'Morocco', metroPopulation: 3700000, latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca', currencyCode: 'MAD', primaryLanguage: 'Arabic', tier: 'tier2', coverageScore: 74, lastUpdated: '2025-12-01' },
  { id: 'c78', cityName: 'Lima', countryCode: 'PER', countryName: 'Peru', metroPopulation: 10700000, latitude: -12.0464, longitude: -77.0428, timezone: 'America/Lima', currencyCode: 'PEN', primaryLanguage: 'Spanish', tier: 'tier2', coverageScore: 73, lastUpdated: '2025-12-01' },
  { id: 'c79', cityName: 'Kyiv', countryCode: 'UKR', countryName: 'Ukraine', metroPopulation: 2900000, latitude: 50.4501, longitude: 30.5234, timezone: 'Europe/Kyiv', currencyCode: 'UAH', primaryLanguage: 'Ukrainian', tier: 'tier2', coverageScore: 71, lastUpdated: '2025-12-01' },
  { id: 'c80', cityName: 'Sofia', countryCode: 'BGR', countryName: 'Bulgaria', metroPopulation: 1500000, latitude: 42.6977, longitude: 23.3219, timezone: 'Europe/Sofia', currencyCode: 'BGN', primaryLanguage: 'Bulgarian', tier: 'tier2', coverageScore: 74, lastUpdated: '2025-12-01' },

  // ═══════════ TIER 3 — Basic Coverage (20 cities) ═══════════
  { id: 'c81', cityName: 'Accra', countryCode: 'GHA', countryName: 'Ghana', metroPopulation: 2500000, latitude: 5.6037, longitude: -0.1870, timezone: 'Africa/Accra', currencyCode: 'GHS', primaryLanguage: 'English', tier: 'tier3', coverageScore: 58, lastUpdated: '2025-12-01' },
  { id: 'c82', cityName: 'Guadalajara', countryCode: 'MEX', countryName: 'Mexico', metroPopulation: 5300000, latitude: 20.6597, longitude: -103.3496, timezone: 'America/Mexico_City', currencyCode: 'MXN', primaryLanguage: 'Spanish', tier: 'tier3', coverageScore: 55, lastUpdated: '2025-12-01' },
  { id: 'c83', cityName: 'Hanoi', countryCode: 'VNM', countryName: 'Vietnam', metroPopulation: 8200000, latitude: 21.0285, longitude: 105.8542, timezone: 'Asia/Ho_Chi_Minh', currencyCode: 'VND', primaryLanguage: 'Vietnamese', tier: 'tier3', coverageScore: 60, lastUpdated: '2025-12-01' },
  { id: 'c84', cityName: 'Tbilisi', countryCode: 'GEO', countryName: 'Georgia', metroPopulation: 1200000, latitude: 41.7151, longitude: 44.8271, timezone: 'Asia/Tbilisi', currencyCode: 'GEL', primaryLanguage: 'Georgian', tier: 'tier3', coverageScore: 62, lastUpdated: '2025-12-01' },
  { id: 'c85', cityName: 'Phnom Penh', countryCode: 'KHM', countryName: 'Cambodia', metroPopulation: 2100000, latitude: 11.5564, longitude: 104.9282, timezone: 'Asia/Phnom_Penh', currencyCode: 'KHR', primaryLanguage: 'Khmer', tier: 'tier3', coverageScore: 52, lastUpdated: '2025-12-01' },
  { id: 'c86', cityName: 'Da Nang', countryCode: 'VNM', countryName: 'Vietnam', metroPopulation: 1200000, latitude: 16.0544, longitude: 108.2022, timezone: 'Asia/Ho_Chi_Minh', currencyCode: 'VND', primaryLanguage: 'Vietnamese', tier: 'tier3', coverageScore: 56, lastUpdated: '2025-12-01' },
  { id: 'c87', cityName: 'Canggu', countryCode: 'IDN', countryName: 'Indonesia', metroPopulation: 100000, latitude: -8.6478, longitude: 115.1385, timezone: 'Asia/Makassar', currencyCode: 'IDR', primaryLanguage: 'Indonesian', tier: 'tier3', coverageScore: 65, lastUpdated: '2025-12-01' },
  { id: 'c88', cityName: 'Tulum', countryCode: 'MEX', countryName: 'Mexico', metroPopulation: 50000, latitude: 20.2114, longitude: -87.4654, timezone: 'America/Cancun', currencyCode: 'MXN', primaryLanguage: 'Spanish', tier: 'tier3', coverageScore: 58, lastUpdated: '2025-12-01' },
  { id: 'c89', cityName: 'Colombo', countryCode: 'LKA', countryName: 'Sri Lanka', metroPopulation: 5600000, latitude: 6.9271, longitude: 79.8612, timezone: 'Asia/Colombo', currencyCode: 'LKR', primaryLanguage: 'Sinhala', tier: 'tier3', coverageScore: 50, lastUpdated: '2025-12-01' },
  { id: 'c90', cityName: 'Montevideo', countryCode: 'URY', countryName: 'Uruguay', metroPopulation: 2000000, latitude: -34.9011, longitude: -56.1645, timezone: 'America/Montevideo', currencyCode: 'UYU', primaryLanguage: 'Spanish', tier: 'tier3', coverageScore: 57, lastUpdated: '2025-12-01' },
  { id: 'c91', cityName: 'Dar es Salaam', countryCode: 'TZA', countryName: 'Tanzania', metroPopulation: 6700000, latitude: -6.7924, longitude: 39.2083, timezone: 'Africa/Dar_es_Salaam', currencyCode: 'TZS', primaryLanguage: 'Swahili', tier: 'tier3', coverageScore: 45, lastUpdated: '2025-12-01' },
  { id: 'c92', cityName: 'Tashkent', countryCode: 'UZB', countryName: 'Uzbekistan', metroPopulation: 2900000, latitude: 41.2995, longitude: 69.2401, timezone: 'Asia/Tashkent', currencyCode: 'UZS', primaryLanguage: 'Uzbek', tier: 'tier3', coverageScore: 48, lastUpdated: '2025-12-01' },
  { id: 'c93', cityName: 'Split', countryCode: 'HRV', countryName: 'Croatia', metroPopulation: 350000, latitude: 43.5081, longitude: 16.4402, timezone: 'Europe/Zagreb', currencyCode: 'EUR', primaryLanguage: 'Croatian', tier: 'tier3', coverageScore: 60, lastUpdated: '2025-12-01' },
  { id: 'c94', cityName: 'Dubrovnik', countryCode: 'HRV', countryName: 'Croatia', metroPopulation: 43000, latitude: 42.6507, longitude: 18.0944, timezone: 'Europe/Zagreb', currencyCode: 'EUR', primaryLanguage: 'Croatian', tier: 'tier3', coverageScore: 55, lastUpdated: '2025-12-01' },
  { id: 'c95', cityName: 'Florianópolis', countryCode: 'BRA', countryName: 'Brazil', metroPopulation: 1100000, latitude: -27.5954, longitude: -48.5480, timezone: 'America/Sao_Paulo', currencyCode: 'BRL', primaryLanguage: 'Portuguese', tier: 'tier3', coverageScore: 58, lastUpdated: '2025-12-01' },
  { id: 'c96', cityName: 'Muscat', countryCode: 'OMN', countryName: 'Oman', metroPopulation: 1500000, latitude: 23.5880, longitude: 58.3829, timezone: 'Asia/Muscat', currencyCode: 'OMR', primaryLanguage: 'Arabic', tier: 'tier3', coverageScore: 52, lastUpdated: '2025-12-01' },
  { id: 'c97', cityName: 'Valletta', countryCode: 'MLT', countryName: 'Malta', metroPopulation: 500000, latitude: 35.8989, longitude: 14.5146, timezone: 'Europe/Malta', currencyCode: 'EUR', primaryLanguage: 'Maltese', tier: 'tier3', coverageScore: 63, lastUpdated: '2025-12-01' },
  { id: 'c98', cityName: 'Zanzibar', countryCode: 'TZA', countryName: 'Tanzania', metroPopulation: 200000, latitude: -6.1659, longitude: 39.2026, timezone: 'Africa/Dar_es_Salaam', currencyCode: 'TZS', primaryLanguage: 'Swahili', tier: 'tier3', coverageScore: 42, lastUpdated: '2025-12-01' },
  { id: 'c99', cityName: 'Batumi', countryCode: 'GEO', countryName: 'Georgia', metroPopulation: 200000, latitude: 41.6168, longitude: 41.6367, timezone: 'Asia/Tbilisi', currencyCode: 'GEL', primaryLanguage: 'Georgian', tier: 'tier3', coverageScore: 50, lastUpdated: '2025-12-01' },
  { id: 'c100', cityName: 'Luang Prabang', countryCode: 'LAO', countryName: 'Laos', metroPopulation: 60000, latitude: 19.8863, longitude: 102.1350, timezone: 'Asia/Vientiane', currencyCode: 'LAK', primaryLanguage: 'Lao', tier: 'tier3', coverageScore: 40, lastUpdated: '2025-12-01' },
];

// ═══════════ SERVICE DEFINITIONS (10 categories, all 4+ stars) ═══════════
interface ServiceTemplate {
  category: string;
  serviceType: string;
}

const SERVICE_TEMPLATES: ServiceTemplate[] = [
  { category: 'accommodation', serviceType: 'Co-Living Spaces' },
  { category: 'internet', serviceType: 'Premium WiFi Verification' },
  { category: 'healthcare', serviceType: 'International Health Insurance' },
  { category: 'transportation', serviceType: 'Airport Lounge Access' },
  { category: 'professional', serviceType: 'Co-Working Verification' },
  { category: 'logistics', serviceType: 'Premium Laundry Services' },
  { category: 'delivery', serviceType: 'Food & Grocery Delivery' },
  { category: 'legal', serviceType: 'Immigration Assistance' },
  { category: 'financial', serviceType: 'Multi-Currency Banking' },
  { category: 'community', serviceType: 'SuperNomad Pulse' },
];

// Coverage notes per tier & category for realistic data
const TIER_NOTES: Record<CityTier, Record<string, string>> = {
  tier1: {
    accommodation: 'Premium verified co-living with 50+ options',
    internet: 'Gigabit speeds verified across the city',
    healthcare: 'Multi-language 24/7 medical support',
    transportation: 'All major airports & stations covered',
    professional: '200+ verified premium workspaces',
    logistics: 'Same-day eco-friendly laundry & dry cleaning',
    delivery: '24/7 on-demand food, grocery & pharmacy delivery',
    legal: 'Visa specialists & immigration lawyers on-call',
    financial: 'Multi-currency digital banking with instant transfers',
    community: 'Active SuperNomad community with weekly events',
  },
  tier2: {
    accommodation: 'Growing co-living market with verified listings',
    internet: 'Good broadband coverage in central areas',
    healthcare: 'English-speaking clinics & telemedicine available',
    transportation: 'Airport lounge & private transfer options',
    professional: 'Strong co-working scene with flexible passes',
    logistics: 'Next-day laundry & cleaning services',
    delivery: 'Popular delivery apps covering most areas',
    legal: 'Vetted immigration consultants available',
    financial: 'Digital bank and forex integrations',
    community: 'Growing nomad network with monthly meetups',
  },
  tier3: {
    accommodation: 'Limited but verified accommodation options',
    internet: 'Improving infrastructure, hotspot-verified spots',
    healthcare: 'Basic clinic access, telemedicine recommended',
    transportation: 'Limited lounge options, transfer service available',
    professional: 'Emerging workspace scene with key locations',
    logistics: 'Basic laundry services available in center',
    delivery: 'Delivery available in central districts only',
    legal: 'Remote immigration consulting via platform',
    financial: 'International card acceptance, limited local fintech',
    community: 'Small but passionate local nomad group',
  },
};

// Deterministic seed-based pseudo-random for consistent data
function seededValue(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const norm = (Math.abs(hash) % 1000) / 1000;
  return Math.round(min + norm * (max - min));
}

function seededRating(seed: string, tier: CityTier): number {
  const base = tier === 'tier1' ? 4.5 : tier === 'tier2' ? 4.2 : 4.0;
  const variation = (seededValue(seed, 0, 6)) / 10;
  return Math.min(5.0, parseFloat((base + variation).toFixed(1)));
}

// Generate services dynamically for ALL cities
function generateCityServices(): CityService[] {
  const services: CityService[] = [];

  for (const city of GLOBAL_CITIES) {
    SERVICE_TEMPLATES.forEach((tmpl, idx) => {
      const seed = `${city.id}-${tmpl.category}`;
      const tier = city.tier;

      // Determine availability based on tier
      let status: 'available' | 'partial' | 'planned' | 'not_available';
      if (tier === 'tier1') {
        status = 'available';
      } else if (tier === 'tier2') {
        // Tier 2: 7 available, 2 partial, 1 planned
        status = idx < 7 ? 'available' : idx < 9 ? 'partial' : 'planned';
      } else {
        // Tier 3: 5 available, 3 partial, 2 planned
        status = idx < 5 ? 'available' : idx < 8 ? 'partial' : 'planned';
      }

      const providerCounts = { tier1: [25, 90], tier2: [8, 35], tier3: [2, 12] };
      const responseTimes = { tier1: [5, 30], tier2: [15, 60], tier3: [30, 120] };

      const [pMin, pMax] = providerCounts[tier];
      const [rMin, rMax] = responseTimes[tier];

      services.push({
        id: `s-${city.id}-${idx}`,
        cityId: city.id,
        serviceCategory: tmpl.category as any,
        serviceType: tmpl.serviceType,
        availabilityStatus: status,
        providerCount: status === 'planned' ? 0 : seededValue(seed, pMin, pMax),
        userRating: status === 'planned' ? undefined : seededRating(seed, tier),
        responseTimeMinutes: status === 'planned' ? undefined : seededValue(seed + 'rt', rMin, rMax),
        coverageNotes: TIER_NOTES[tier][tmpl.category] || 'Service coverage expanding',
        lastVerified: '2025-12-01',
      });
    });
  }

  return services;
}

export const CITY_SERVICES: CityService[] = generateCityServices();

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
