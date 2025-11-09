// City data for SuperNomad Search AI - Comprehensive Global Database
export interface CityData {
  name: string;
  country_code: string;
  active_services: number;
  population?: number;
  timezone?: string;
}

export const CITIES_BY_COUNTRY: Record<string, CityData[]> = {
  // United States - Top 15 cities
  US: [
    { name: "Austin", country_code: "US", active_services: 145, timezone: "CST" },
    { name: "Boston", country_code: "US", active_services: 132, timezone: "EST" },
    { name: "Chicago", country_code: "US", active_services: 178, timezone: "CST" },
    { name: "Denver", country_code: "US", active_services: 121, timezone: "MST" },
    { name: "Las Vegas", country_code: "US", active_services: 112, timezone: "PST" },
    { name: "Los Angeles", country_code: "US", active_services: 198, timezone: "PST" },
    { name: "Miami", country_code: "US", active_services: 167, timezone: "EST" },
    { name: "Nashville", country_code: "US", active_services: 95, timezone: "CST" },
    { name: "New Orleans", country_code: "US", active_services: 89, timezone: "CST" },
    { name: "New York", country_code: "US", active_services: 245, timezone: "EST" },
    { name: "Philadelphia", country_code: "US", active_services: 108, timezone: "EST" },
    { name: "Portland", country_code: "US", active_services: 98, timezone: "PST" },
    { name: "San Diego", country_code: "US", active_services: 124, timezone: "PST" },
    { name: "San Francisco", country_code: "US", active_services: 201, timezone: "PST" },
    { name: "Seattle", country_code: "US", active_services: 156, timezone: "PST" },
  ],
  
  // United Kingdom
  GB: [
    { name: "Birmingham", country_code: "GB", active_services: 87, timezone: "GMT" },
    { name: "Bristol", country_code: "GB", active_services: 76, timezone: "GMT" },
    { name: "Edinburgh", country_code: "GB", active_services: 92, timezone: "GMT" },
    { name: "Glasgow", country_code: "GB", active_services: 68, timezone: "GMT" },
    { name: "Leeds", country_code: "GB", active_services: 58, timezone: "GMT" },
    { name: "Liverpool", country_code: "GB", active_services: 54, timezone: "GMT" },
    { name: "London", country_code: "GB", active_services: 234, timezone: "GMT" },
    { name: "Manchester", country_code: "GB", active_services: 98, timezone: "GMT" },
  ],
  
  // Spain
  ES: [
    { name: "Barcelona", country_code: "ES", active_services: 178, timezone: "CET" },
    { name: "Granada", country_code: "ES", active_services: 52, timezone: "CET" },
    { name: "Madrid", country_code: "ES", active_services: 187, timezone: "CET" },
    { name: "Malaga", country_code: "ES", active_services: 76, timezone: "CET" },
    { name: "Seville", country_code: "ES", active_services: 65, timezone: "CET" },
    { name: "Valencia", country_code: "ES", active_services: 92, timezone: "CET" },
  ],
  
  // Portugal
  PT: [
    { name: "Albufeira", country_code: "PT", active_services: 48, timezone: "WET" },
    { name: "Lisbon", country_code: "PT", active_services: 156, timezone: "WET" },
    { name: "Madeira", country_code: "PT", active_services: 62, timezone: "WET" },
    { name: "Porto", country_code: "PT", active_services: 98, timezone: "WET" },
  ],
  
  // France
  FR: [
    { name: "Bordeaux", country_code: "FR", active_services: 72, timezone: "CET" },
    { name: "Lyon", country_code: "FR", active_services: 87, timezone: "CET" },
    { name: "Marseille", country_code: "FR", active_services: 78, timezone: "CET" },
    { name: "Nice", country_code: "FR", active_services: 81, timezone: "CET" },
    { name: "Paris", country_code: "FR", active_services: 213, timezone: "CET" },
    { name: "Toulouse", country_code: "FR", active_services: 64, timezone: "CET" },
  ],
  
  // Germany
  DE: [
    { name: "Berlin", country_code: "DE", active_services: 198, timezone: "CET" },
    { name: "Cologne", country_code: "DE", active_services: 76, timezone: "CET" },
    { name: "Frankfurt", country_code: "DE", active_services: 87, timezone: "CET" },
    { name: "Hamburg", country_code: "DE", active_services: 92, timezone: "CET" },
    { name: "Munich", country_code: "DE", active_services: 134, timezone: "CET" },
  ],
  
  // Thailand
  TH: [
    { name: "Bangkok", country_code: "TH", active_services: 167, timezone: "ICT" },
    { name: "Chiang Mai", country_code: "TH", active_services: 134, timezone: "ICT" },
    { name: "Phuket", country_code: "TH", active_services: 87, timezone: "ICT" },
  ],
  
  // Mexico
  MX: [
    { name: "Cancun", country_code: "MX", active_services: 86, timezone: "EST" },
    { name: "Guadalajara", country_code: "MX", active_services: 74, timezone: "CST" },
    { name: "Mexico City", country_code: "MX", active_services: 145, timezone: "CST" },
    { name: "Playa del Carmen", country_code: "MX", active_services: 72, timezone: "EST" },
    { name: "Tulum", country_code: "MX", active_services: 68, timezone: "EST" },
  ],
  
  // Indonesia
  ID: [
    { name: "Bali", country_code: "ID", active_services: 178, timezone: "WITA" },
    { name: "Jakarta", country_code: "ID", active_services: 98, timezone: "WIB" },
  ],
  
  // Australia
  AU: [
    { name: "Brisbane", country_code: "AU", active_services: 86, timezone: "AEST" },
    { name: "Melbourne", country_code: "AU", active_services: 145, timezone: "AEDT" },
    { name: "Perth", country_code: "AU", active_services: 64, timezone: "AWST" },
    { name: "Sydney", country_code: "AU", active_services: 167, timezone: "AEDT" },
  ],
  
  // Canada
  CA: [
    { name: "Calgary", country_code: "CA", active_services: 76, timezone: "MST" },
    { name: "Montreal", country_code: "CA", active_services: 97, timezone: "EST" },
    { name: "Toronto", country_code: "CA", active_services: 134, timezone: "EST" },
    { name: "Vancouver", country_code: "CA", active_services: 121, timezone: "PST" },
  ],
  
  // Japan
  JP: [
    { name: "Kyoto", country_code: "JP", active_services: 86, timezone: "JST" },
    { name: "Osaka", country_code: "JP", active_services: 102, timezone: "JST" },
    { name: "Tokyo", country_code: "JP", active_services: 198, timezone: "JST" },
  ],
  
  // Italy
  IT: [
    { name: "Florence", country_code: "IT", active_services: 78, timezone: "CET" },
    { name: "Milan", country_code: "IT", active_services: 121, timezone: "CET" },
    { name: "Naples", country_code: "IT", active_services: 62, timezone: "CET" },
    { name: "Rome", country_code: "IT", active_services: 156, timezone: "CET" },
    { name: "Venice", country_code: "IT", active_services: 64, timezone: "CET" },
  ],
  
  // Netherlands
  NL: [
    { name: "Amsterdam", country_code: "NL", active_services: 167, timezone: "CET" },
    { name: "Rotterdam", country_code: "NL", active_services: 76, timezone: "CET" },
    { name: "The Hague", country_code: "NL", active_services: 58, timezone: "CET" },
  ],
  
  // Greece
  GR: [
    { name: "Athens", country_code: "GR", active_services: 97, timezone: "EET" },
    { name: "Santorini", country_code: "GR", active_services: 54, timezone: "EET" },
    { name: "Thessaloniki", country_code: "GR", active_services: 55, timezone: "EET" },
  ],
  
  // Brazil
  BR: [
    { name: "Rio de Janeiro", country_code: "BR", active_services: 121, timezone: "BRT" },
    { name: "Sao Paulo", country_code: "BR", active_services: 145, timezone: "BRT" },
  ],
  
  // Colombia
  CO: [
    { name: "Bogota", country_code: "CO", active_services: 97, timezone: "COT" },
    { name: "Cartagena", country_code: "CO", active_services: 64, timezone: "COT" },
    { name: "Medellin", country_code: "CO", active_services: 108, timezone: "COT" },
  ],
  
  // Argentina
  AR: [
    { name: "Buenos Aires", country_code: "AR", active_services: 134, timezone: "ART" },
  ],
  
  // UAE
  AE: [
    { name: "Abu Dhabi", country_code: "AE", active_services: 86, timezone: "GST" },
    { name: "Dubai", country_code: "AE", active_services: 187, timezone: "GST" },
  ],
  
  // Singapore
  SG: [
    { name: "Singapore", country_code: "SG", active_services: 198, timezone: "SGT" },
  ],
  
  // Vietnam
  VN: [
    { name: "Da Nang", country_code: "VN", active_services: 72, timezone: "ICT" },
    { name: "Hanoi", country_code: "VN", active_services: 88, timezone: "ICT" },
    { name: "Ho Chi Minh", country_code: "VN", active_services: 104, timezone: "ICT" },
  ],
  
  // Malaysia
  MY: [
    { name: "Kuala Lumpur", country_code: "MY", active_services: 112, timezone: "MYT" },
    { name: "Penang", country_code: "MY", active_services: 68, timezone: "MYT" },
  ],
  
  // Philippines
  PH: [
    { name: "Manila", country_code: "PH", active_services: 94, timezone: "PHT" },
  ],
  
  // South Korea
  KR: [
    { name: "Seoul", country_code: "KR", active_services: 156, timezone: "KST" },
  ],
  
  // Turkey
  TR: [
    { name: "Ankara", country_code: "TR", active_services: 68, timezone: "TRT" },
    { name: "Istanbul", country_code: "TR", active_services: 134, timezone: "TRT" },
  ],
  
  // Austria
  AT: [
    { name: "Salzburg", country_code: "AT", active_services: 52, timezone: "CET" },
    { name: "Vienna", country_code: "AT", active_services: 108, timezone: "CET" },
  ],
  
  // Czech Republic
  CZ: [
    { name: "Prague", country_code: "CZ", active_services: 112, timezone: "CET" },
  ],
  
  // Poland
  PL: [
    { name: "Krakow", country_code: "PL", active_services: 76, timezone: "CET" },
    { name: "Warsaw", country_code: "PL", active_services: 94, timezone: "CET" },
  ],
  
  // Hungary
  HU: [
    { name: "Budapest", country_code: "HU", active_services: 102, timezone: "CET" },
  ],
  
  // Denmark
  DK: [
    { name: "Copenhagen", country_code: "DK", active_services: 98, timezone: "CET" },
  ],
  
  // Sweden
  SE: [
    { name: "Stockholm", country_code: "SE", active_services: 108, timezone: "CET" },
  ],
  
  // Norway
  NO: [
    { name: "Oslo", country_code: "NO", active_services: 88, timezone: "CET" },
  ],
  
  // Finland
  FI: [
    { name: "Helsinki", country_code: "FI", active_services: 82, timezone: "EET" },
  ],
  
  // Ireland
  IE: [
    { name: "Dublin", country_code: "IE", active_services: 112, timezone: "GMT" },
  ],
  
  // Belgium
  BE: [
    { name: "Brussels", country_code: "BE", active_services: 92, timezone: "CET" },
  ],
  
  // Switzerland
  CH: [
    { name: "Geneva", country_code: "CH", active_services: 86, timezone: "CET" },
    { name: "Zurich", country_code: "CH", active_services: 104, timezone: "CET" },
  ],
  
  // Croatia
  HR: [
    { name: "Dubrovnik", country_code: "HR", active_services: 58, timezone: "CET" },
    { name: "Split", country_code: "HR", active_services: 64, timezone: "CET" },
    { name: "Zagreb", country_code: "HR", active_services: 72, timezone: "CET" },
  ],
  
  // New Zealand
  NZ: [
    { name: "Auckland", country_code: "NZ", active_services: 102, timezone: "NZDT" },
    { name: "Wellington", country_code: "NZ", active_services: 78, timezone: "NZDT" },
  ],
  
  // South Africa
  ZA: [
    { name: "Cape Town", country_code: "ZA", active_services: 108, timezone: "SAST" },
    { name: "Johannesburg", country_code: "ZA", active_services: 94, timezone: "SAST" },
  ],
  
  // Chile
  CL: [
    { name: "Santiago", country_code: "CL", active_services: 88, timezone: "CLT" },
  ],
  
  // Peru
  PE: [
    { name: "Lima", country_code: "PE", active_services: 82, timezone: "PET" },
  ],
  
  // Costa Rica
  CR: [
    { name: "San Jose", country_code: "CR", active_services: 76, timezone: "CST" },
  ],
  
  // Panama
  PA: [
    { name: "Panama City", country_code: "PA", active_services: 84, timezone: "EST" },
  ],
  
  // Estonia
  EE: [
    { name: "Tallinn", country_code: "EE", active_services: 72, timezone: "EET" },
  ],
  
  // Latvia
  LV: [
    { name: "Riga", country_code: "LV", active_services: 64, timezone: "EET" },
  ],
  
  // Lithuania
  LT: [
    { name: "Vilnius", country_code: "LT", active_services: 68, timezone: "EET" },
  ],
  
  // Georgia
  GE: [
    { name: "Tbilisi", country_code: "GE", active_services: 78, timezone: "GET" },
  ],
  
  // Morocco
  MA: [
    { name: "Marrakech", country_code: "MA", active_services: 72, timezone: "WET" },
  ],
  
  // Egypt
  EG: [
    { name: "Cairo", country_code: "EG", active_services: 86, timezone: "EET" },
  ],
  
  // Israel
  IL: [
    { name: "Tel Aviv", country_code: "IL", active_services: 124, timezone: "IST" },
  ],
  
  // India
  IN: [
    { name: "Bangalore", country_code: "IN", active_services: 112, timezone: "IST" },
    { name: "Delhi", country_code: "IN", active_services: 98, timezone: "IST" },
    { name: "Mumbai", country_code: "IN", active_services: 124, timezone: "IST" },
  ],
  
  // Hong Kong
  HK: [
    { name: "Hong Kong", country_code: "HK", active_services: 156, timezone: "HKT" },
  ],
  
  // Taiwan
  TW: [
    { name: "Taipei", country_code: "TW", active_services: 118, timezone: "CST" },
  ],
};

// Get cities for a specific country (only return cities with active services)
export const getCitiesForCountry = (countryCode: string): CityData[] => {
  const cities = CITIES_BY_COUNTRY[countryCode] || [];
  return cities.filter(city => city.active_services > 0);
};

// Get all unique country codes with active cities
export const getCountriesWithCities = (): string[] => {
  return Object.keys(CITIES_BY_COUNTRY)
    .filter(code => CITIES_BY_COUNTRY[code].some(city => city.active_services > 0))
    .sort();
};

// Get all cities across all countries (for global search)
export const getAllCities = (): CityData[] => {
  return Object.values(CITIES_BY_COUNTRY)
    .flat()
    .filter(city => city.active_services > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Get cities by minimum service count
export const getCitiesByMinServices = (minServices: number): CityData[] => {
  return getAllCities().filter(city => city.active_services >= minServices);
};

// Get top cities globally by service count
export const getTopCities = (limit: number = 20): CityData[] => {
  return getAllCities()
    .sort((a, b) => b.active_services - a.active_services)
    .slice(0, limit);
};
