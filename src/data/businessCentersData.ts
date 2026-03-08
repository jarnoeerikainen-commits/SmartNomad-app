import { BusinessCenter, BusinessCenterCity } from '@/types/businessCenter';

// Global cities for business centers — 120+ cities across 70+ countries
export const BUSINESS_CENTER_CITIES: BusinessCenterCity[] = [
  // North America
  { id: 'new-york', name: 'New York', country: 'United States', countryCode: 'US', coordinates: { lat: 40.7128, lng: -74.0060 }, timezone: 'America/New_York', currency: 'USD' },
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', countryCode: 'US', coordinates: { lat: 34.0522, lng: -118.2437 }, timezone: 'America/Los_Angeles', currency: 'USD' },
  { id: 'chicago', name: 'Chicago', country: 'United States', countryCode: 'US', coordinates: { lat: 41.8781, lng: -87.6298 }, timezone: 'America/Chicago', currency: 'USD' },
  { id: 'san-francisco', name: 'San Francisco', country: 'United States', countryCode: 'US', coordinates: { lat: 37.7749, lng: -122.4194 }, timezone: 'America/Los_Angeles', currency: 'USD' },
  { id: 'boston', name: 'Boston', country: 'United States', countryCode: 'US', coordinates: { lat: 42.3601, lng: -71.0589 }, timezone: 'America/New_York', currency: 'USD' },
  { id: 'miami', name: 'Miami', country: 'United States', countryCode: 'US', coordinates: { lat: 25.7617, lng: -80.1918 }, timezone: 'America/New_York', currency: 'USD' },
  { id: 'seattle', name: 'Seattle', country: 'United States', countryCode: 'US', coordinates: { lat: 47.6062, lng: -122.3321 }, timezone: 'America/Los_Angeles', currency: 'USD' },
  { id: 'austin', name: 'Austin', country: 'United States', countryCode: 'US', coordinates: { lat: 30.2672, lng: -97.7431 }, timezone: 'America/Chicago', currency: 'USD' },
  { id: 'houston', name: 'Houston', country: 'United States', countryCode: 'US', coordinates: { lat: 29.7604, lng: -95.3698 }, timezone: 'America/Chicago', currency: 'USD' },
  { id: 'denver', name: 'Denver', country: 'United States', countryCode: 'US', coordinates: { lat: 39.7392, lng: -104.9903 }, timezone: 'America/Denver', currency: 'USD' },
  { id: 'washington-dc', name: 'Washington D.C.', country: 'United States', countryCode: 'US', coordinates: { lat: 38.9072, lng: -77.0369 }, timezone: 'America/New_York', currency: 'USD' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', countryCode: 'CA', coordinates: { lat: 43.6532, lng: -79.3832 }, timezone: 'America/Toronto', currency: 'CAD' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', countryCode: 'CA', coordinates: { lat: 49.2827, lng: -123.1207 }, timezone: 'America/Vancouver', currency: 'CAD' },
  { id: 'montreal', name: 'Montreal', country: 'Canada', countryCode: 'CA', coordinates: { lat: 45.5017, lng: -73.5673 }, timezone: 'America/Toronto', currency: 'CAD' },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', countryCode: 'MX', coordinates: { lat: 19.4326, lng: -99.1332 }, timezone: 'America/Mexico_City', currency: 'MXN' },
  { id: 'guadalajara', name: 'Guadalajara', country: 'Mexico', countryCode: 'MX', coordinates: { lat: 20.6597, lng: -103.3496 }, timezone: 'America/Mexico_City', currency: 'MXN' },

  // Europe — Western
  { id: 'london', name: 'London', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 51.5074, lng: -0.1278 }, timezone: 'Europe/London', currency: 'GBP' },
  { id: 'manchester', name: 'Manchester', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 53.4808, lng: -2.2426 }, timezone: 'Europe/London', currency: 'GBP' },
  { id: 'edinburgh', name: 'Edinburgh', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 55.9533, lng: -3.1883 }, timezone: 'Europe/London', currency: 'GBP' },
  { id: 'paris', name: 'Paris', country: 'France', countryCode: 'FR', coordinates: { lat: 48.8566, lng: 2.3522 }, timezone: 'Europe/Paris', currency: 'EUR' },
  { id: 'lyon', name: 'Lyon', country: 'France', countryCode: 'FR', coordinates: { lat: 45.7640, lng: 4.8357 }, timezone: 'Europe/Paris', currency: 'EUR' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', countryCode: 'DE', coordinates: { lat: 52.5200, lng: 13.4050 }, timezone: 'Europe/Berlin', currency: 'EUR' },
  { id: 'munich', name: 'Munich', country: 'Germany', countryCode: 'DE', coordinates: { lat: 48.1351, lng: 11.5820 }, timezone: 'Europe/Berlin', currency: 'EUR' },
  { id: 'frankfurt', name: 'Frankfurt', country: 'Germany', countryCode: 'DE', coordinates: { lat: 50.1109, lng: 8.6821 }, timezone: 'Europe/Berlin', currency: 'EUR' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', coordinates: { lat: 52.3676, lng: 4.9041 }, timezone: 'Europe/Amsterdam', currency: 'EUR' },
  { id: 'rotterdam', name: 'Rotterdam', country: 'Netherlands', countryCode: 'NL', coordinates: { lat: 51.9244, lng: 4.4777 }, timezone: 'Europe/Amsterdam', currency: 'EUR' },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', countryCode: 'ES', coordinates: { lat: 41.3851, lng: 2.1734 }, timezone: 'Europe/Madrid', currency: 'EUR' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', countryCode: 'ES', coordinates: { lat: 40.4168, lng: -3.7038 }, timezone: 'Europe/Madrid', currency: 'EUR' },
  { id: 'rome', name: 'Rome', country: 'Italy', countryCode: 'IT', coordinates: { lat: 41.9028, lng: 12.4964 }, timezone: 'Europe/Rome', currency: 'EUR' },
  { id: 'milan', name: 'Milan', country: 'Italy', countryCode: 'IT', coordinates: { lat: 45.4642, lng: 9.1900 }, timezone: 'Europe/Rome', currency: 'EUR' },
  { id: 'vienna', name: 'Vienna', country: 'Austria', countryCode: 'AT', coordinates: { lat: 48.2082, lng: 16.3738 }, timezone: 'Europe/Vienna', currency: 'EUR' },
  { id: 'dublin', name: 'Dublin', country: 'Ireland', countryCode: 'IE', coordinates: { lat: 53.3498, lng: -6.2603 }, timezone: 'Europe/Dublin', currency: 'EUR' },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', countryCode: 'PT', coordinates: { lat: 38.7223, lng: -9.1393 }, timezone: 'Europe/Lisbon', currency: 'EUR' },
  { id: 'porto', name: 'Porto', country: 'Portugal', countryCode: 'PT', coordinates: { lat: 41.1579, lng: -8.6291 }, timezone: 'Europe/Lisbon', currency: 'EUR' },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', countryCode: 'CH', coordinates: { lat: 47.3769, lng: 8.5417 }, timezone: 'Europe/Zurich', currency: 'CHF' },
  { id: 'geneva', name: 'Geneva', country: 'Switzerland', countryCode: 'CH', coordinates: { lat: 46.2044, lng: 6.1432 }, timezone: 'Europe/Zurich', currency: 'CHF' },
  { id: 'stockholm', name: 'Stockholm', country: 'Sweden', countryCode: 'SE', coordinates: { lat: 59.3293, lng: 18.0686 }, timezone: 'Europe/Stockholm', currency: 'SEK' },
  { id: 'copenhagen', name: 'Copenhagen', country: 'Denmark', countryCode: 'DK', coordinates: { lat: 55.6761, lng: 12.5683 }, timezone: 'Europe/Copenhagen', currency: 'DKK' },
  { id: 'oslo', name: 'Oslo', country: 'Norway', countryCode: 'NO', coordinates: { lat: 59.9139, lng: 10.7522 }, timezone: 'Europe/Oslo', currency: 'NOK' },
  { id: 'helsinki', name: 'Helsinki', country: 'Finland', countryCode: 'FI', coordinates: { lat: 60.1699, lng: 24.9384 }, timezone: 'Europe/Helsinki', currency: 'EUR' },
  { id: 'brussels', name: 'Brussels', country: 'Belgium', countryCode: 'BE', coordinates: { lat: 50.8503, lng: 4.3517 }, timezone: 'Europe/Brussels', currency: 'EUR' },
  { id: 'luxembourg', name: 'Luxembourg City', country: 'Luxembourg', countryCode: 'LU', coordinates: { lat: 49.6116, lng: 6.1319 }, timezone: 'Europe/Luxembourg', currency: 'EUR' },

  // Europe — Central & Eastern
  { id: 'prague', name: 'Prague', country: 'Czech Republic', countryCode: 'CZ', coordinates: { lat: 50.0755, lng: 14.4378 }, timezone: 'Europe/Prague', currency: 'CZK' },
  { id: 'warsaw', name: 'Warsaw', country: 'Poland', countryCode: 'PL', coordinates: { lat: 52.2297, lng: 21.0122 }, timezone: 'Europe/Warsaw', currency: 'PLN' },
  { id: 'krakow', name: 'Krakow', country: 'Poland', countryCode: 'PL', coordinates: { lat: 50.0647, lng: 19.9450 }, timezone: 'Europe/Warsaw', currency: 'PLN' },
  { id: 'budapest', name: 'Budapest', country: 'Hungary', countryCode: 'HU', coordinates: { lat: 47.4979, lng: 19.0402 }, timezone: 'Europe/Budapest', currency: 'HUF' },
  { id: 'bucharest', name: 'Bucharest', country: 'Romania', countryCode: 'RO', coordinates: { lat: 44.4268, lng: 26.1025 }, timezone: 'Europe/Bucharest', currency: 'RON' },
  { id: 'sofia', name: 'Sofia', country: 'Bulgaria', countryCode: 'BG', coordinates: { lat: 42.6977, lng: 23.3219 }, timezone: 'Europe/Sofia', currency: 'BGN' },
  { id: 'tallinn', name: 'Tallinn', country: 'Estonia', countryCode: 'EE', coordinates: { lat: 59.4370, lng: 24.7536 }, timezone: 'Europe/Tallinn', currency: 'EUR' },
  { id: 'riga', name: 'Riga', country: 'Latvia', countryCode: 'LV', coordinates: { lat: 56.9496, lng: 24.1052 }, timezone: 'Europe/Riga', currency: 'EUR' },
  { id: 'vilnius', name: 'Vilnius', country: 'Lithuania', countryCode: 'LT', coordinates: { lat: 54.6872, lng: 25.2797 }, timezone: 'Europe/Vilnius', currency: 'EUR' },
  { id: 'athens', name: 'Athens', country: 'Greece', countryCode: 'GR', coordinates: { lat: 37.9838, lng: 23.7275 }, timezone: 'Europe/Athens', currency: 'EUR' },
  { id: 'zagreb', name: 'Zagreb', country: 'Croatia', countryCode: 'HR', coordinates: { lat: 45.8150, lng: 15.9819 }, timezone: 'Europe/Zagreb', currency: 'EUR' },
  { id: 'belgrade', name: 'Belgrade', country: 'Serbia', countryCode: 'RS', coordinates: { lat: 44.7866, lng: 20.4489 }, timezone: 'Europe/Belgrade', currency: 'RSD' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', countryCode: 'TR', coordinates: { lat: 41.0082, lng: 28.9784 }, timezone: 'Europe/Istanbul', currency: 'TRY' },
  { id: 'ankara', name: 'Ankara', country: 'Turkey', countryCode: 'TR', coordinates: { lat: 39.9334, lng: 32.8597 }, timezone: 'Europe/Istanbul', currency: 'TRY' },

  // Asia — East
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', countryCode: 'JP', coordinates: { lat: 35.6762, lng: 139.6503 }, timezone: 'Asia/Tokyo', currency: 'JPY' },
  { id: 'osaka', name: 'Osaka', country: 'Japan', countryCode: 'JP', coordinates: { lat: 34.6937, lng: 135.5023 }, timezone: 'Asia/Tokyo', currency: 'JPY' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', countryCode: 'KR', coordinates: { lat: 37.5665, lng: 126.9780 }, timezone: 'Asia/Seoul', currency: 'KRW' },
  { id: 'shanghai', name: 'Shanghai', country: 'China', countryCode: 'CN', coordinates: { lat: 31.2304, lng: 121.4737 }, timezone: 'Asia/Shanghai', currency: 'CNY' },
  { id: 'beijing', name: 'Beijing', country: 'China', countryCode: 'CN', coordinates: { lat: 39.9042, lng: 116.4074 }, timezone: 'Asia/Shanghai', currency: 'CNY' },
  { id: 'shenzhen', name: 'Shenzhen', country: 'China', countryCode: 'CN', coordinates: { lat: 22.5431, lng: 114.0579 }, timezone: 'Asia/Shanghai', currency: 'CNY' },
  { id: 'hong-kong', name: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', coordinates: { lat: 22.3193, lng: 114.1694 }, timezone: 'Asia/Hong_Kong', currency: 'HKD' },
  { id: 'taipei', name: 'Taipei', country: 'Taiwan', countryCode: 'TW', coordinates: { lat: 25.0330, lng: 121.5654 }, timezone: 'Asia/Taipei', currency: 'TWD' },

  // Asia — Southeast
  { id: 'singapore', name: 'Singapore', country: 'Singapore', countryCode: 'SG', coordinates: { lat: 1.3521, lng: 103.8198 }, timezone: 'Asia/Singapore', currency: 'SGD' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', countryCode: 'TH', coordinates: { lat: 13.7563, lng: 100.5018 }, timezone: 'Asia/Bangkok', currency: 'THB' },
  { id: 'chiang-mai', name: 'Chiang Mai', country: 'Thailand', countryCode: 'TH', coordinates: { lat: 18.7883, lng: 98.9853 }, timezone: 'Asia/Bangkok', currency: 'THB' },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', coordinates: { lat: 3.1390, lng: 101.6869 }, timezone: 'Asia/Kuala_Lumpur', currency: 'MYR' },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', countryCode: 'ID', coordinates: { lat: -6.2088, lng: 106.8456 }, timezone: 'Asia/Jakarta', currency: 'IDR' },
  { id: 'bali', name: 'Bali (Denpasar)', country: 'Indonesia', countryCode: 'ID', coordinates: { lat: -8.6705, lng: 115.2126 }, timezone: 'Asia/Makassar', currency: 'IDR' },
  { id: 'manila', name: 'Manila', country: 'Philippines', countryCode: 'PH', coordinates: { lat: 14.5995, lng: 120.9842 }, timezone: 'Asia/Manila', currency: 'PHP' },
  { id: 'ho-chi-minh', name: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN', coordinates: { lat: 10.8231, lng: 106.6297 }, timezone: 'Asia/Ho_Chi_Minh', currency: 'VND' },
  { id: 'hanoi', name: 'Hanoi', country: 'Vietnam', countryCode: 'VN', coordinates: { lat: 21.0285, lng: 105.8542 }, timezone: 'Asia/Ho_Chi_Minh', currency: 'VND' },
  { id: 'phnom-penh', name: 'Phnom Penh', country: 'Cambodia', countryCode: 'KH', coordinates: { lat: 11.5564, lng: 104.9282 }, timezone: 'Asia/Phnom_Penh', currency: 'KHR' },

  // Asia — South
  { id: 'mumbai', name: 'Mumbai', country: 'India', countryCode: 'IN', coordinates: { lat: 19.0760, lng: 72.8777 }, timezone: 'Asia/Kolkata', currency: 'INR' },
  { id: 'bangalore', name: 'Bangalore', country: 'India', countryCode: 'IN', coordinates: { lat: 12.9716, lng: 77.5946 }, timezone: 'Asia/Kolkata', currency: 'INR' },
  { id: 'delhi', name: 'Delhi', country: 'India', countryCode: 'IN', coordinates: { lat: 28.7041, lng: 77.1025 }, timezone: 'Asia/Kolkata', currency: 'INR' },
  { id: 'hyderabad', name: 'Hyderabad', country: 'India', countryCode: 'IN', coordinates: { lat: 17.3850, lng: 78.4867 }, timezone: 'Asia/Kolkata', currency: 'INR' },
  { id: 'colombo', name: 'Colombo', country: 'Sri Lanka', countryCode: 'LK', coordinates: { lat: 6.9271, lng: 79.8612 }, timezone: 'Asia/Colombo', currency: 'LKR' },
  { id: 'dhaka', name: 'Dhaka', country: 'Bangladesh', countryCode: 'BD', coordinates: { lat: 23.8103, lng: 90.4125 }, timezone: 'Asia/Dhaka', currency: 'BDT' },
  { id: 'karachi', name: 'Karachi', country: 'Pakistan', countryCode: 'PK', coordinates: { lat: 24.8607, lng: 67.0011 }, timezone: 'Asia/Karachi', currency: 'PKR' },

  // Middle East
  { id: 'dubai', name: 'Dubai', country: 'UAE', countryCode: 'AE', coordinates: { lat: 25.2048, lng: 55.2708 }, timezone: 'Asia/Dubai', currency: 'AED' },
  { id: 'abu-dhabi', name: 'Abu Dhabi', country: 'UAE', countryCode: 'AE', coordinates: { lat: 24.4539, lng: 54.3773 }, timezone: 'Asia/Dubai', currency: 'AED' },
  { id: 'doha', name: 'Doha', country: 'Qatar', countryCode: 'QA', coordinates: { lat: 25.2854, lng: 51.5310 }, timezone: 'Asia/Qatar', currency: 'QAR' },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', coordinates: { lat: 24.7136, lng: 46.6753 }, timezone: 'Asia/Riyadh', currency: 'SAR' },
  { id: 'jeddah', name: 'Jeddah', country: 'Saudi Arabia', countryCode: 'SA', coordinates: { lat: 21.4858, lng: 39.1925 }, timezone: 'Asia/Riyadh', currency: 'SAR' },
  { id: 'muscat', name: 'Muscat', country: 'Oman', countryCode: 'OM', coordinates: { lat: 23.5880, lng: 58.3829 }, timezone: 'Asia/Muscat', currency: 'OMR' },
  { id: 'manama', name: 'Manama', country: 'Bahrain', countryCode: 'BH', coordinates: { lat: 26.2285, lng: 50.5860 }, timezone: 'Asia/Bahrain', currency: 'BHD' },
  { id: 'kuwait-city', name: 'Kuwait City', country: 'Kuwait', countryCode: 'KW', coordinates: { lat: 29.3759, lng: 47.9774 }, timezone: 'Asia/Kuwait', currency: 'KWD' },
  { id: 'tel-aviv', name: 'Tel Aviv', country: 'Israel', countryCode: 'IL', coordinates: { lat: 32.0853, lng: 34.7818 }, timezone: 'Asia/Jerusalem', currency: 'ILS' },
  { id: 'amman', name: 'Amman', country: 'Jordan', countryCode: 'JO', coordinates: { lat: 31.9454, lng: 35.9284 }, timezone: 'Asia/Amman', currency: 'JOD' },

  // Oceania
  { id: 'sydney', name: 'Sydney', country: 'Australia', countryCode: 'AU', coordinates: { lat: -33.8688, lng: 151.2093 }, timezone: 'Australia/Sydney', currency: 'AUD' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', countryCode: 'AU', coordinates: { lat: -37.8136, lng: 144.9631 }, timezone: 'Australia/Melbourne', currency: 'AUD' },
  { id: 'brisbane', name: 'Brisbane', country: 'Australia', countryCode: 'AU', coordinates: { lat: -27.4698, lng: 153.0251 }, timezone: 'Australia/Brisbane', currency: 'AUD' },
  { id: 'perth', name: 'Perth', country: 'Australia', countryCode: 'AU', coordinates: { lat: -31.9505, lng: 115.8605 }, timezone: 'Australia/Perth', currency: 'AUD' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', countryCode: 'NZ', coordinates: { lat: -36.8485, lng: 174.7633 }, timezone: 'Pacific/Auckland', currency: 'NZD' },
  { id: 'wellington', name: 'Wellington', country: 'New Zealand', countryCode: 'NZ', coordinates: { lat: -41.2865, lng: 174.7762 }, timezone: 'Pacific/Auckland', currency: 'NZD' },

  // South America
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', countryCode: 'BR', coordinates: { lat: -23.5505, lng: -46.6333 }, timezone: 'America/Sao_Paulo', currency: 'BRL' },
  { id: 'rio-de-janeiro', name: 'Rio de Janeiro', country: 'Brazil', countryCode: 'BR', coordinates: { lat: -22.9068, lng: -43.1729 }, timezone: 'America/Sao_Paulo', currency: 'BRL' },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', coordinates: { lat: -34.6037, lng: -58.3816 }, timezone: 'America/Argentina/Buenos_Aires', currency: 'ARS' },
  { id: 'bogota', name: 'Bogotá', country: 'Colombia', countryCode: 'CO', coordinates: { lat: 4.7110, lng: -74.0721 }, timezone: 'America/Bogota', currency: 'COP' },
  { id: 'medellin', name: 'Medellín', country: 'Colombia', countryCode: 'CO', coordinates: { lat: 6.2476, lng: -75.5658 }, timezone: 'America/Bogota', currency: 'COP' },
  { id: 'santiago', name: 'Santiago', country: 'Chile', countryCode: 'CL', coordinates: { lat: -33.4489, lng: -70.6693 }, timezone: 'America/Santiago', currency: 'CLP' },
  { id: 'lima', name: 'Lima', country: 'Peru', countryCode: 'PE', coordinates: { lat: -12.0464, lng: -77.0428 }, timezone: 'America/Lima', currency: 'PEN' },
  { id: 'montevideo', name: 'Montevideo', country: 'Uruguay', countryCode: 'UY', coordinates: { lat: -34.9011, lng: -56.1645 }, timezone: 'America/Montevideo', currency: 'UYU' },
  { id: 'quito', name: 'Quito', country: 'Ecuador', countryCode: 'EC', coordinates: { lat: -0.1807, lng: -78.4678 }, timezone: 'America/Guayaquil', currency: 'USD' },
  { id: 'panama-city', name: 'Panama City', country: 'Panama', countryCode: 'PA', coordinates: { lat: 8.9824, lng: -79.5199 }, timezone: 'America/Panama', currency: 'USD' },
  { id: 'san-jose-cr', name: 'San José', country: 'Costa Rica', countryCode: 'CR', coordinates: { lat: 9.9281, lng: -84.0907 }, timezone: 'America/Costa_Rica', currency: 'CRC' },

  // Africa
  { id: 'cape-town', name: 'Cape Town', country: 'South Africa', countryCode: 'ZA', coordinates: { lat: -33.9249, lng: 18.4241 }, timezone: 'Africa/Johannesburg', currency: 'ZAR' },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', coordinates: { lat: -26.2041, lng: 28.0473 }, timezone: 'Africa/Johannesburg', currency: 'ZAR' },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', countryCode: 'KE', coordinates: { lat: -1.2921, lng: 36.8219 }, timezone: 'Africa/Nairobi', currency: 'KES' },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', countryCode: 'NG', coordinates: { lat: 6.5244, lng: 3.3792 }, timezone: 'Africa/Lagos', currency: 'NGN' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', countryCode: 'EG', coordinates: { lat: 30.0444, lng: 31.2357 }, timezone: 'Africa/Cairo', currency: 'EGP' },
  { id: 'casablanca', name: 'Casablanca', country: 'Morocco', countryCode: 'MA', coordinates: { lat: 33.5731, lng: -7.5898 }, timezone: 'Africa/Casablanca', currency: 'MAD' },
  { id: 'accra', name: 'Accra', country: 'Ghana', countryCode: 'GH', coordinates: { lat: 5.6037, lng: -0.1870 }, timezone: 'Africa/Accra', currency: 'GHS' },
  { id: 'dar-es-salaam', name: 'Dar es Salaam', country: 'Tanzania', countryCode: 'TZ', coordinates: { lat: -6.7924, lng: 39.2083 }, timezone: 'Africa/Dar_es_Salaam', currency: 'TZS' },
  { id: 'kigali', name: 'Kigali', country: 'Rwanda', countryCode: 'RW', coordinates: { lat: -1.9403, lng: 29.8739 }, timezone: 'Africa/Kigali', currency: 'RWF' },
  { id: 'tunis', name: 'Tunis', country: 'Tunisia', countryCode: 'TN', coordinates: { lat: 36.8065, lng: 10.1815 }, timezone: 'Africa/Tunis', currency: 'TND' },
  { id: 'addis-ababa', name: 'Addis Ababa', country: 'Ethiopia', countryCode: 'ET', coordinates: { lat: 9.0250, lng: 38.7469 }, timezone: 'Africa/Addis_Ababa', currency: 'ETB' },
  { id: 'mauritius', name: 'Port Louis', country: 'Mauritius', countryCode: 'MU', coordinates: { lat: -20.1609, lng: 57.5012 }, timezone: 'Indian/Mauritius', currency: 'MUR' },

  // Caribbean
  { id: 'santo-domingo', name: 'Santo Domingo', country: 'Dominican Republic', countryCode: 'DO', coordinates: { lat: 18.4861, lng: -69.9312 }, timezone: 'America/Santo_Domingo', currency: 'DOP' },
  { id: 'kingston', name: 'Kingston', country: 'Jamaica', countryCode: 'JM', coordinates: { lat: 18.1096, lng: -77.2975 }, timezone: 'America/Jamaica', currency: 'JMD' },

  // Central Asia / Caucasus
  { id: 'tbilisi', name: 'Tbilisi', country: 'Georgia', countryCode: 'GE', coordinates: { lat: 41.7151, lng: 44.8271 }, timezone: 'Asia/Tbilisi', currency: 'GEL' },
  { id: 'yerevan', name: 'Yerevan', country: 'Armenia', countryCode: 'AM', coordinates: { lat: 40.1792, lng: 44.4991 }, timezone: 'Asia/Yerevan', currency: 'AMD' },
  { id: 'baku', name: 'Baku', country: 'Azerbaijan', countryCode: 'AZ', coordinates: { lat: 40.4093, lng: 49.8671 }, timezone: 'Asia/Baku', currency: 'AZN' },
  { id: 'tashkent', name: 'Tashkent', country: 'Uzbekistan', countryCode: 'UZ', coordinates: { lat: 41.2995, lng: 69.2401 }, timezone: 'Asia/Tashkent', currency: 'UZS' },
  { id: 'almaty', name: 'Almaty', country: 'Kazakhstan', countryCode: 'KZ', coordinates: { lat: 43.2220, lng: 76.8512 }, timezone: 'Asia/Almaty', currency: 'KZT' },
];

// Helper to generate business center entries for each city
function generateCentersForCity(city: BusinessCenterCity): BusinessCenter[] {
  const centers: BusinessCenter[] = [];
  const providers = GLOBAL_PROVIDERS.filter(p => p.countries.includes(city.countryCode) || p.countries.includes('GLOBAL'));

  providers.forEach((provider, idx) => {
    centers.push({
      id: `${provider.id}-${city.id}`,
      name: `${provider.name} ${city.name}`,
      address: `${provider.addressTemplate} ${city.name}`,
      cityId: city.id,
      cityName: city.name,
      country: city.country,
      countryCode: city.countryCode,
      coordinates: {
        lat: city.coordinates.lat + (idx * 0.003),
        lng: city.coordinates.lng + (idx * 0.002),
      },
      rating: provider.baseRating + (Math.sin(city.id.length + idx) * 0.3),
      reviewCount: Math.floor(provider.baseReviews * (0.5 + Math.abs(Math.sin(city.id.length * idx + 1)))),
      services: provider.services,
      isOpenNow: true,
      website: provider.website,
      phone: provider.phonePrefix,
      priceLevel: provider.priceLevel,
      description: provider.description,
      openingHours: provider.openingHours,
    });
  });

  return centers;
}

// Global provider templates
interface ProviderTemplate {
  id: string;
  name: string;
  countries: string[];
  services: ('printing' | 'fax' | 'computer' | 'scanning' | 'shipping')[];
  baseRating: number;
  baseReviews: number;
  website: string;
  phonePrefix: string;
  priceLevel: number;
  description: string;
  openingHours: string;
  addressTemplate: string;
}

const GLOBAL_PROVIDERS: ProviderTemplate[] = [
  // Major global chains
  {
    id: 'regus',
    name: 'Regus Business Centre',
    countries: ['GLOBAL'],
    services: ['printing', 'fax', 'computer', 'scanning', 'shipping'],
    baseRating: 4.3,
    baseReviews: 450,
    website: 'https://www.regus.com',
    phonePrefix: '+1-800-633-4237',
    priceLevel: 3,
    description: 'Premium serviced offices, meeting rooms, coworking, and virtual offices. Professional printing, scanning, fax, and mail handling services available. Day offices from $25/day.',
    openingHours: 'Mon-Fri: 8:30am-6pm',
    addressTemplate: 'Business District,',
  },
  {
    id: 'wework',
    name: 'WeWork Office & Print Services',
    countries: ['GLOBAL'],
    services: ['printing', 'computer', 'scanning'],
    baseRating: 4.4,
    baseReviews: 620,
    website: 'https://www.wework.com',
    phonePrefix: '+1-646-491-9060',
    priceLevel: 3,
    description: 'Modern coworking and private offices with high-speed printing, document scanning, and conference facilities. Hot desks and day passes available for visitors.',
    openingHours: 'Mon-Fri: 8am-8pm, Sat: 9am-5pm',
    addressTemplate: 'Central Business District,',
  },
  {
    id: 'iwg-spaces',
    name: 'Spaces Coworking & Business Centre',
    countries: ['GLOBAL'],
    services: ['printing', 'computer', 'scanning', 'shipping'],
    baseRating: 4.2,
    baseReviews: 320,
    website: 'https://www.spacesworks.com',
    phonePrefix: '+1-800-633-4237',
    priceLevel: 3,
    description: 'Creative coworking spaces with business services. Professional-grade printing, scanning, and courier dispatch. Meeting rooms bookable by the hour.',
    openingHours: 'Mon-Fri: 8am-7pm, Sat: 9am-4pm',
    addressTemplate: 'Innovation Quarter,',
  },
  // US-specific
  {
    id: 'fedex-office',
    name: 'FedEx Office Print & Ship Center',
    countries: ['US', 'CA', 'MX', 'GB', 'DE', 'FR', 'JP', 'AE', 'SG', 'AU', 'BR', 'IN'],
    services: ['printing', 'fax', 'computer', 'scanning', 'shipping'],
    baseRating: 4.2,
    baseReviews: 780,
    website: 'https://www.fedex.com/office',
    phonePrefix: '+1-800-463-3339',
    priceLevel: 2,
    description: 'Full-service print and ship center. High-speed copying, large format printing, binding, lamination, passport photos, computer rentals, and worldwide FedEx shipping.',
    openingHours: 'Mon-Fri: 7am-10pm, Sat-Sun: 9am-6pm',
    addressTemplate: 'Commercial Center,',
  },
  {
    id: 'ups-store',
    name: 'The UPS Store',
    countries: ['US', 'CA', 'MX'],
    services: ['printing', 'fax', 'scanning', 'shipping'],
    baseRating: 4.1,
    baseReviews: 520,
    website: 'https://www.theupsstore.com',
    phonePrefix: '+1-800-742-5877',
    priceLevel: 2,
    description: 'Convenient print, pack, and ship services. Document printing, faxing, notary services, mailbox rental, and worldwide UPS shipping from any location.',
    openingHours: 'Mon-Fri: 8am-7pm, Sat: 9am-5pm',
    addressTemplate: 'Shopping Center,',
  },
  {
    id: 'staples',
    name: 'Staples Print & Marketing',
    countries: ['US', 'CA'],
    services: ['printing', 'fax', 'computer', 'scanning'],
    baseRating: 4.0,
    baseReviews: 430,
    website: 'https://www.staples.com',
    phonePrefix: '+1-800-378-2753',
    priceLevel: 2,
    description: 'Office supply superstore with full printing services. Business cards, flyers, banners, binding, lamination, and tech support. Self-service computer stations available.',
    openingHours: 'Mon-Fri: 8am-9pm, Sat: 9am-9pm, Sun: 10am-6pm',
    addressTemplate: 'Retail District,',
  },
  // Europe-specific
  {
    id: 'officeworks-au',
    name: 'Officeworks Print & Copy',
    countries: ['AU'],
    services: ['printing', 'fax', 'computer', 'scanning', 'shipping'],
    baseRating: 4.3,
    baseReviews: 390,
    website: 'https://www.officeworks.com.au',
    phonePrefix: '+61-1300-633-633',
    priceLevel: 2,
    description: 'Australia\'s leading office supply and print center. Same-day printing, wide format, canvas prints, document binding, and tech accessories.',
    openingHours: 'Mon-Fri: 7am-9pm, Sat: 8am-6pm, Sun: 10am-6pm',
    addressTemplate: 'Commercial District,',
  },
  {
    id: 'mail-boxes-etc',
    name: 'Mail Boxes Etc. (MBE)',
    countries: ['IT', 'ES', 'DE', 'FR', 'GB', 'PT', 'AT', 'CH', 'NL', 'BE', 'PL', 'CZ', 'IN', 'BR', 'AR', 'AE', 'ZA'],
    services: ['printing', 'fax', 'scanning', 'shipping'],
    baseRating: 4.2,
    baseReviews: 280,
    website: 'https://www.mbe.com',
    phonePrefix: '+39-02-8051-0451',
    priceLevel: 2,
    description: 'International franchise offering printing, packing, shipping (UPS/DHL/FedEx), mailbox services, and document management. Over 3,000 locations worldwide.',
    openingHours: 'Mon-Fri: 9am-7pm, Sat: 9am-1pm',
    addressTemplate: 'City Center,',
  },
  {
    id: 'kinkos-jp',
    name: "Kinko's Print Center",
    countries: ['JP'],
    services: ['printing', 'fax', 'computer', 'scanning'],
    baseRating: 4.5,
    baseReviews: 680,
    website: 'https://www.kinkos.co.jp',
    phonePrefix: '+81-3-5485-4400',
    priceLevel: 2,
    description: '24-hour professional print center with multilingual staff. High-quality color/mono printing, large format, binding, lamination, and self-service PC stations.',
    openingHours: '24/7',
    addressTemplate: 'Station Area,',
  },
  // Africa / Emerging markets
  {
    id: 'postnet',
    name: 'PostNet Business Centre',
    countries: ['ZA'],
    services: ['printing', 'fax', 'computer', 'scanning', 'shipping'],
    baseRating: 4.1,
    baseReviews: 210,
    website: 'https://www.postnet.co.za',
    phonePrefix: '+27-86-100-7678',
    priceLevel: 1,
    description: 'South Africa\'s largest business service franchise. Printing, copying, courier services, private mailboxes, and graphic design assistance.',
    openingHours: 'Mon-Fri: 8am-5pm, Sat: 8:30am-12:30pm',
    addressTemplate: 'Business Park,',
  },
  // Middle East specific
  {
    id: 'servcorp',
    name: 'Servcorp Serviced Offices',
    countries: ['AE', 'SA', 'QA', 'BH', 'KW', 'OM', 'AU', 'NZ', 'JP', 'SG', 'HK', 'CN', 'GB', 'US'],
    services: ['printing', 'fax', 'computer', 'scanning', 'shipping'],
    baseRating: 4.5,
    baseReviews: 340,
    website: 'https://www.servcorp.com',
    phonePrefix: '+61-2-9231-7600',
    priceLevel: 4,
    description: 'Premium serviced offices with dedicated reception, IT support, printing and document services, boardrooms, and virtual office solutions. Day offices available.',
    openingHours: 'Mon-Fri: 8:30am-5:30pm',
    addressTemplate: 'Premium Tower,',
  },
  // Coworking global
  {
    id: 'mindspace',
    name: 'Mindspace Coworking & Offices',
    countries: ['DE', 'NL', 'GB', 'IL', 'US', 'PL', 'RO'],
    services: ['printing', 'computer', 'scanning'],
    baseRating: 4.6,
    baseReviews: 290,
    website: 'https://www.mindspace.me',
    phonePrefix: '+49-30-2757-5600',
    priceLevel: 3,
    description: 'Design-led coworking with boutique office spaces. Printing stations, high-speed WiFi, community events, and flexible day passes for visitors.',
    openingHours: 'Mon-Fri: 8am-8pm',
    addressTemplate: 'Creative Quarter,',
  },
  {
    id: 'kos',
    name: 'KOS Print & Copy Center',
    countries: ['TH', 'VN', 'KH', 'ID', 'MY', 'PH'],
    services: ['printing', 'fax', 'scanning', 'shipping'],
    baseRating: 4.0,
    baseReviews: 190,
    website: '#',
    phonePrefix: 'Local number',
    priceLevel: 1,
    description: 'Affordable local print shop with copying, scanning, faxing, and basic shipping services. Popular with digital nomads for quick document needs.',
    openingHours: 'Mon-Sat: 8am-8pm, Sun: 9am-5pm',
    addressTemplate: 'Downtown,',
  },
  {
    id: 'impact-hub',
    name: 'Impact Hub Coworking',
    countries: ['AT', 'CH', 'DE', 'ES', 'IT', 'GB', 'US', 'BR', 'CO', 'MX', 'KE', 'ZA', 'GH', 'GE', 'EE'],
    services: ['printing', 'computer', 'scanning'],
    baseRating: 4.4,
    baseReviews: 230,
    website: 'https://www.impacthub.net',
    phonePrefix: '+43-1-522-4040',
    priceLevel: 2,
    description: 'Purpose-driven coworking network with printing, event spaces, community programs. Day passes and meeting rooms available. Strong nomad community.',
    openingHours: 'Mon-Fri: 8:30am-7pm',
    addressTemplate: 'Innovation District,',
  },
  // Latin America
  {
    id: 'selina',
    name: 'Selina Cowork & Print',
    countries: ['MX', 'CO', 'CR', 'PA', 'PE', 'EC', 'AR', 'CL', 'BR', 'PT', 'ES', 'GB', 'GR', 'IL'],
    services: ['printing', 'computer', 'scanning'],
    baseRating: 4.1,
    baseReviews: 350,
    website: 'https://www.selina.com',
    phonePrefix: '+1-844-735-4621',
    priceLevel: 2,
    description: 'Nomad-friendly coworking inside hospitality hubs. Day passes with printing, scanning, fast WiFi, and community events. Popular with long-term travelers.',
    openingHours: 'Daily: 7am-10pm',
    addressTemplate: 'Trendy District,',
  },
];

// Generate all business centers from templates
const generatedCenters: BusinessCenter[] = [];
BUSINESS_CENTER_CITIES.forEach(city => {
  generatedCenters.push(...generateCentersForCity(city));
});

// Normalize ratings to valid range
generatedCenters.forEach(center => {
  center.rating = Math.min(5.0, Math.max(4.0, parseFloat(center.rating.toFixed(1))));
  center.reviewCount = Math.max(50, center.reviewCount);
});

export const BUSINESS_CENTERS: BusinessCenter[] = generatedCenters;

export const SERVICE_LABELS = {
  printing: 'Printing',
  fax: 'Fax',
  computer: 'Computer Use',
  scanning: 'Scanning',
  shipping: 'Shipping',
};

export const SORT_OPTIONS = [
  { value: 'proximity', label: 'Nearest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviews' },
];
