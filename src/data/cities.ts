// City data for SmartNomad Search AI
export interface CityData {
  name: string;
  country_code: string;
  active_services?: number;
  population?: number;
}

export const CITIES_BY_COUNTRY: Record<string, CityData[]> = {
  // United States
  US: [
    { name: "Austin", country_code: "US", active_services: 145 },
    { name: "Boston", country_code: "US", active_services: 132 },
    { name: "Chicago", country_code: "US", active_services: 178 },
    { name: "Denver", country_code: "US", active_services: 121 },
    { name: "Los Angeles", country_code: "US", active_services: 198 },
    { name: "Miami", country_code: "US", active_services: 167 },
    { name: "New York", country_code: "US", active_services: 245 },
    { name: "Portland", country_code: "US", active_services: 98 },
    { name: "San Francisco", country_code: "US", active_services: 201 },
    { name: "Seattle", country_code: "US", active_services: 156 },
  ],
  // United Kingdom
  GB: [
    { name: "Birmingham", country_code: "GB", active_services: 87 },
    { name: "Bristol", country_code: "GB", active_services: 76 },
    { name: "Edinburgh", country_code: "GB", active_services: 92 },
    { name: "Glasgow", country_code: "GB", active_services: 68 },
    { name: "Liverpool", country_code: "GB", active_services: 54 },
    { name: "London", country_code: "GB", active_services: 234 },
    { name: "Manchester", country_code: "GB", active_services: 98 },
  ],
  // Spain
  ES: [
    { name: "Barcelona", country_code: "ES", active_services: 178 },
    { name: "Madrid", country_code: "ES", active_services: 187 },
    { name: "Malaga", country_code: "ES", active_services: 76 },
    { name: "Seville", country_code: "ES", active_services: 65 },
    { name: "Valencia", country_code: "ES", active_services: 92 },
  ],
  // Portugal
  PT: [
    { name: "Lisbon", country_code: "PT", active_services: 156 },
    { name: "Porto", country_code: "PT", active_services: 98 },
  ],
  // France
  FR: [
    { name: "Bordeaux", country_code: "FR", active_services: 52 },
    { name: "Lyon", country_code: "FR", active_services: 87 },
    { name: "Marseille", country_code: "FR", active_services: 68 },
    { name: "Nice", country_code: "FR", active_services: 71 },
    { name: "Paris", country_code: "FR", active_services: 213 },
  ],
  // Germany
  DE: [
    { name: "Berlin", country_code: "DE", active_services: 198 },
    { name: "Frankfurt", country_code: "DE", active_services: 87 },
    { name: "Hamburg", country_code: "DE", active_services: 92 },
    { name: "Munich", country_code: "DE", active_services: 134 },
  ],
  // Thailand
  TH: [
    { name: "Bangkok", country_code: "TH", active_services: 167 },
    { name: "Chiang Mai", country_code: "TH", active_services: 134 },
    { name: "Phuket", country_code: "TH", active_services: 87 },
  ],
  // Mexico
  MX: [
    { name: "Cancun", country_code: "MX", active_services: 76 },
    { name: "Guadalajara", country_code: "MX", active_services: 54 },
    { name: "Mexico City", country_code: "MX", active_services: 145 },
    { name: "Playa del Carmen", country_code: "MX", active_services: 62 },
  ],
  // Indonesia
  ID: [
    { name: "Bali", country_code: "ID", active_services: 178 },
    { name: "Jakarta", country_code: "ID", active_services: 98 },
  ],
  // Australia
  AU: [
    { name: "Brisbane", country_code: "AU", active_services: 76 },
    { name: "Melbourne", country_code: "AU", active_services: 145 },
    { name: "Perth", country_code: "AU", active_services: 54 },
    { name: "Sydney", country_code: "AU", active_services: 167 },
  ],
  // Canada
  CA: [
    { name: "Montreal", country_code: "CA", active_services: 87 },
    { name: "Toronto", country_code: "CA", active_services: 134 },
    { name: "Vancouver", country_code: "CA", active_services: 121 },
  ],
  // Japan
  JP: [
    { name: "Kyoto", country_code: "JP", active_services: 76 },
    { name: "Osaka", country_code: "JP", active_services: 92 },
    { name: "Tokyo", country_code: "JP", active_services: 198 },
  ],
  // Italy
  IT: [
    { name: "Florence", country_code: "IT", active_services: 68 },
    { name: "Milan", country_code: "IT", active_services: 121 },
    { name: "Rome", country_code: "IT", active_services: 156 },
    { name: "Venice", country_code: "IT", active_services: 54 },
  ],
  // Netherlands
  NL: [
    { name: "Amsterdam", country_code: "NL", active_services: 167 },
    { name: "Rotterdam", country_code: "NL", active_services: 76 },
  ],
  // Greece
  GR: [
    { name: "Athens", country_code: "GR", active_services: 87 },
    { name: "Thessaloniki", country_code: "GR", active_services: 45 },
  ],
  // Brazil
  BR: [
    { name: "Rio de Janeiro", country_code: "BR", active_services: 121 },
    { name: "Sao Paulo", country_code: "BR", active_services: 145 },
  ],
  // Colombia
  CO: [
    { name: "Bogota", country_code: "CO", active_services: 87 },
    { name: "Cartagena", country_code: "CO", active_services: 54 },
    { name: "Medellin", country_code: "CO", active_services: 98 },
  ],
  // Argentina
  AR: [
    { name: "Buenos Aires", country_code: "AR", active_services: 134 },
  ],
  // UAE
  AE: [
    { name: "Abu Dhabi", country_code: "AE", active_services: 76 },
    { name: "Dubai", country_code: "AE", active_services: 187 },
  ],
  // Singapore
  SG: [
    { name: "Singapore", country_code: "SG", active_services: 198 },
  ],
};

// Get cities for a specific country
export const getCitiesForCountry = (countryCode: string): CityData[] => {
  return CITIES_BY_COUNTRY[countryCode] || [];
};

// Get all unique country codes with cities
export const getCountriesWithCities = (): string[] => {
  return Object.keys(CITIES_BY_COUNTRY).sort();
};
