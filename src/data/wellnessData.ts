import { WellnessCity, WellnessProvider, WellnessCategory } from '@/types/wellness';

// ═══════════════════════════════════════════════════════════════
// 500 CITIES - Global Wellness Coverage
// ═══════════════════════════════════════════════════════════════

export const WELLNESS_CITIES: WellnessCity[] = [
  // ─── EUROPE (150 cities) ───
  { id: 'london', name: 'London', country: 'United Kingdom', countryCode: 'GB', region: 'Europe', latitude: 51.5074, longitude: -0.1278, providerCount: 42 },
  { id: 'paris', name: 'Paris', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 48.8566, longitude: 2.3522, providerCount: 38 },
  { id: 'berlin', name: 'Berlin', country: 'Germany', countryCode: 'DE', region: 'Europe', latitude: 52.52, longitude: 13.405, providerCount: 35 },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', countryCode: 'ES', region: 'Europe', latitude: 41.3851, longitude: 2.1734, providerCount: 30 },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', region: 'Europe', latitude: 52.3676, longitude: 4.9041, providerCount: 28 },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', countryCode: 'PT', region: 'Europe', latitude: 38.7223, longitude: -9.1393, providerCount: 25 },
  { id: 'rome', name: 'Rome', country: 'Italy', countryCode: 'IT', region: 'Europe', latitude: 41.9028, longitude: 12.4964, providerCount: 27 },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', countryCode: 'CH', region: 'Europe', latitude: 47.3769, longitude: 8.5417, providerCount: 22 },
  { id: 'stockholm', name: 'Stockholm', country: 'Sweden', countryCode: 'SE', region: 'Europe', latitude: 59.3293, longitude: 18.0686, providerCount: 26 },
  { id: 'helsinki', name: 'Helsinki', country: 'Finland', countryCode: 'FI', region: 'Europe', latitude: 60.1699, longitude: 24.9384, providerCount: 30 },
  { id: 'copenhagen', name: 'Copenhagen', country: 'Denmark', countryCode: 'DK', region: 'Europe', latitude: 55.6761, longitude: 12.5683, providerCount: 24 },
  { id: 'vienna', name: 'Vienna', country: 'Austria', countryCode: 'AT', region: 'Europe', latitude: 48.2082, longitude: 16.3738, providerCount: 23 },
  { id: 'prague', name: 'Prague', country: 'Czech Republic', countryCode: 'CZ', region: 'Europe', latitude: 50.0755, longitude: 14.4378, providerCount: 20 },
  { id: 'munich', name: 'Munich', country: 'Germany', countryCode: 'DE', region: 'Europe', latitude: 48.1351, longitude: 11.582, providerCount: 28 },
  { id: 'madrid', name: 'Madrid', country: 'Spain', countryCode: 'ES', region: 'Europe', latitude: 40.4168, longitude: -3.7038, providerCount: 29 },
  { id: 'oslo', name: 'Oslo', country: 'Norway', countryCode: 'NO', region: 'Europe', latitude: 59.9139, longitude: 10.7522, providerCount: 21 },
  { id: 'dublin', name: 'Dublin', country: 'Ireland', countryCode: 'IE', region: 'Europe', latitude: 53.3498, longitude: -6.2603, providerCount: 19 },
  { id: 'milan', name: 'Milan', country: 'Italy', countryCode: 'IT', region: 'Europe', latitude: 45.4642, longitude: 9.19, providerCount: 26 },
  { id: 'warsaw', name: 'Warsaw', country: 'Poland', countryCode: 'PL', region: 'Europe', latitude: 52.2297, longitude: 21.0122, providerCount: 18 },
  { id: 'brussels', name: 'Brussels', country: 'Belgium', countryCode: 'BE', region: 'Europe', latitude: 50.8503, longitude: 4.3517, providerCount: 20 },
  { id: 'porto', name: 'Porto', country: 'Portugal', countryCode: 'PT', region: 'Europe', latitude: 41.1579, longitude: -8.6291, providerCount: 18 },
  { id: 'tallinn', name: 'Tallinn', country: 'Estonia', countryCode: 'EE', region: 'Europe', latitude: 59.437, longitude: 24.7536, providerCount: 16 },
  { id: 'budapest', name: 'Budapest', country: 'Hungary', countryCode: 'HU', region: 'Europe', latitude: 47.4979, longitude: 19.0402, providerCount: 28 },
  { id: 'athens', name: 'Athens', country: 'Greece', countryCode: 'GR', region: 'Europe', latitude: 37.9838, longitude: 23.7275, providerCount: 20 },
  { id: 'split', name: 'Split', country: 'Croatia', countryCode: 'HR', region: 'Europe', latitude: 43.5081, longitude: 16.4402, providerCount: 15 },
  { id: 'tbilisi', name: 'Tbilisi', country: 'Georgia', countryCode: 'GE', region: 'Europe', latitude: 41.7151, longitude: 44.8271, providerCount: 14 },
  { id: 'florence', name: 'Florence', country: 'Italy', countryCode: 'IT', region: 'Europe', latitude: 43.7696, longitude: 11.2558, providerCount: 20 },
  { id: 'nice', name: 'Nice', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 43.7102, longitude: 7.262, providerCount: 22 },
  { id: 'monaco', name: 'Monaco', country: 'Monaco', countryCode: 'MC', region: 'Europe', latitude: 43.7384, longitude: 7.4246, providerCount: 18 },
  { id: 'geneva', name: 'Geneva', country: 'Switzerland', countryCode: 'CH', region: 'Europe', latitude: 46.2044, longitude: 6.1432, providerCount: 20 },
  { id: 'lyon', name: 'Lyon', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 45.764, longitude: 4.8357, providerCount: 18 },
  { id: 'marseille', name: 'Marseille', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 43.2965, longitude: 5.3698, providerCount: 16 },
  { id: 'hamburg', name: 'Hamburg', country: 'Germany', countryCode: 'DE', region: 'Europe', latitude: 53.5511, longitude: 9.9937, providerCount: 22 },
  { id: 'frankfurt', name: 'Frankfurt', country: 'Germany', countryCode: 'DE', region: 'Europe', latitude: 50.1109, longitude: 8.6821, providerCount: 20 },
  { id: 'dusseldorf', name: 'Düsseldorf', country: 'Germany', countryCode: 'DE', region: 'Europe', latitude: 51.2277, longitude: 6.7735, providerCount: 18 },
  { id: 'cologne', name: 'Cologne', country: 'Germany', countryCode: 'DE', region: 'Europe', latitude: 50.9375, longitude: 6.9603, providerCount: 17 },
  { id: 'stuttgart', name: 'Stuttgart', country: 'Germany', countryCode: 'DE', region: 'Europe', latitude: 48.7758, longitude: 9.1829, providerCount: 16 },
  { id: 'naples', name: 'Naples', country: 'Italy', countryCode: 'IT', region: 'Europe', latitude: 40.8518, longitude: 14.2681, providerCount: 14 },
  { id: 'turin', name: 'Turin', country: 'Italy', countryCode: 'IT', region: 'Europe', latitude: 45.0703, longitude: 7.6869, providerCount: 15 },
  { id: 'venice', name: 'Venice', country: 'Italy', countryCode: 'IT', region: 'Europe', latitude: 45.4408, longitude: 12.3155, providerCount: 12 },
  { id: 'bologna', name: 'Bologna', country: 'Italy', countryCode: 'IT', region: 'Europe', latitude: 44.4949, longitude: 11.3426, providerCount: 13 },
  { id: 'seville', name: 'Seville', country: 'Spain', countryCode: 'ES', region: 'Europe', latitude: 37.3891, longitude: -5.9845, providerCount: 16 },
  { id: 'valencia', name: 'Valencia', country: 'Spain', countryCode: 'ES', region: 'Europe', latitude: 39.4699, longitude: -0.3763, providerCount: 18 },
  { id: 'malaga', name: 'Málaga', country: 'Spain', countryCode: 'ES', region: 'Europe', latitude: 36.7213, longitude: -4.4214, providerCount: 20 },
  { id: 'bilbao', name: 'Bilbao', country: 'Spain', countryCode: 'ES', region: 'Europe', latitude: 43.263, longitude: -2.935, providerCount: 14 },
  { id: 'palma', name: 'Palma de Mallorca', country: 'Spain', countryCode: 'ES', region: 'Europe', latitude: 39.5696, longitude: 2.6502, providerCount: 22 },
  { id: 'ibiza', name: 'Ibiza', country: 'Spain', countryCode: 'ES', region: 'Europe', latitude: 38.9067, longitude: 1.4206, providerCount: 18 },
  { id: 'edinburgh', name: 'Edinburgh', country: 'United Kingdom', countryCode: 'GB', region: 'Europe', latitude: 55.9533, longitude: -3.1883, providerCount: 16 },
  { id: 'manchester', name: 'Manchester', country: 'United Kingdom', countryCode: 'GB', region: 'Europe', latitude: 53.4808, longitude: -2.2426, providerCount: 20 },
  { id: 'birmingham-uk', name: 'Birmingham', country: 'United Kingdom', countryCode: 'GB', region: 'Europe', latitude: 52.4862, longitude: -1.8904, providerCount: 16 },
  { id: 'glasgow', name: 'Glasgow', country: 'United Kingdom', countryCode: 'GB', region: 'Europe', latitude: 55.8642, longitude: -4.2518, providerCount: 14 },
  { id: 'bristol', name: 'Bristol', country: 'United Kingdom', countryCode: 'GB', region: 'Europe', latitude: 51.4545, longitude: -2.5879, providerCount: 14 },
  { id: 'krakow', name: 'Kraków', country: 'Poland', countryCode: 'PL', region: 'Europe', latitude: 50.0647, longitude: 19.945, providerCount: 16 },
  { id: 'gdansk', name: 'Gdańsk', country: 'Poland', countryCode: 'PL', region: 'Europe', latitude: 54.352, longitude: 18.6466, providerCount: 12 },
  { id: 'wroclaw', name: 'Wrocław', country: 'Poland', countryCode: 'PL', region: 'Europe', latitude: 51.1079, longitude: 17.0385, providerCount: 12 },
  { id: 'bucharest', name: 'Bucharest', country: 'Romania', countryCode: 'RO', region: 'Europe', latitude: 44.4268, longitude: 26.1025, providerCount: 14 },
  { id: 'sofia', name: 'Sofia', country: 'Bulgaria', countryCode: 'BG', region: 'Europe', latitude: 42.6977, longitude: 23.3219, providerCount: 12 },
  { id: 'riga', name: 'Riga', country: 'Latvia', countryCode: 'LV', region: 'Europe', latitude: 56.9496, longitude: 24.1052, providerCount: 12 },
  { id: 'vilnius', name: 'Vilnius', country: 'Lithuania', countryCode: 'LT', region: 'Europe', latitude: 54.6872, longitude: 25.2797, providerCount: 11 },
  { id: 'zagreb', name: 'Zagreb', country: 'Croatia', countryCode: 'HR', region: 'Europe', latitude: 45.815, longitude: 15.9819, providerCount: 13 },
  { id: 'dubrovnik', name: 'Dubrovnik', country: 'Croatia', countryCode: 'HR', region: 'Europe', latitude: 42.6507, longitude: 18.0944, providerCount: 14 },
  { id: 'belgrade', name: 'Belgrade', country: 'Serbia', countryCode: 'RS', region: 'Europe', latitude: 44.7866, longitude: 20.4489, providerCount: 12 },
  { id: 'ljubljana', name: 'Ljubljana', country: 'Slovenia', countryCode: 'SI', region: 'Europe', latitude: 46.0569, longitude: 14.5058, providerCount: 11 },
  { id: 'bratislava', name: 'Bratislava', country: 'Slovakia', countryCode: 'SK', region: 'Europe', latitude: 48.1486, longitude: 17.1077, providerCount: 10 },
  { id: 'thessaloniki', name: 'Thessaloniki', country: 'Greece', countryCode: 'GR', region: 'Europe', latitude: 40.6401, longitude: 22.9444, providerCount: 14 },
  { id: 'santorini', name: 'Santorini', country: 'Greece', countryCode: 'GR', region: 'Europe', latitude: 36.3932, longitude: 25.4615, providerCount: 16 },
  { id: 'mykonos', name: 'Mykonos', country: 'Greece', countryCode: 'GR', region: 'Europe', latitude: 37.4467, longitude: 25.3289, providerCount: 14 },
  { id: 'reykjavik', name: 'Reykjavik', country: 'Iceland', countryCode: 'IS', region: 'Europe', latitude: 64.1466, longitude: -21.9426, providerCount: 18 },
  { id: 'gothenburg', name: 'Gothenburg', country: 'Sweden', countryCode: 'SE', region: 'Europe', latitude: 57.7089, longitude: 11.9746, providerCount: 14 },
  { id: 'malmo', name: 'Malmö', country: 'Sweden', countryCode: 'SE', region: 'Europe', latitude: 55.605, longitude: 13.0038, providerCount: 12 },
  { id: 'bergen', name: 'Bergen', country: 'Norway', countryCode: 'NO', region: 'Europe', latitude: 60.3913, longitude: 5.3221, providerCount: 12 },
  { id: 'tampere', name: 'Tampere', country: 'Finland', countryCode: 'FI', region: 'Europe', latitude: 61.4978, longitude: 23.761, providerCount: 16 },
  { id: 'turku', name: 'Turku', country: 'Finland', countryCode: 'FI', region: 'Europe', latitude: 60.4518, longitude: 22.2666, providerCount: 12 },
  { id: 'aarhus', name: 'Aarhus', country: 'Denmark', countryCode: 'DK', region: 'Europe', latitude: 56.1629, longitude: 10.2039, providerCount: 12 },
  { id: 'antwerp', name: 'Antwerp', country: 'Belgium', countryCode: 'BE', region: 'Europe', latitude: 51.2194, longitude: 4.4025, providerCount: 14 },
  { id: 'ghent', name: 'Ghent', country: 'Belgium', countryCode: 'BE', region: 'Europe', latitude: 51.0543, longitude: 3.7174, providerCount: 10 },
  { id: 'rotterdam', name: 'Rotterdam', country: 'Netherlands', countryCode: 'NL', region: 'Europe', latitude: 51.9225, longitude: 4.4792, providerCount: 16 },
  { id: 'utrecht', name: 'Utrecht', country: 'Netherlands', countryCode: 'NL', region: 'Europe', latitude: 52.0907, longitude: 5.1214, providerCount: 12 },
  { id: 'the-hague', name: 'The Hague', country: 'Netherlands', countryCode: 'NL', region: 'Europe', latitude: 52.0705, longitude: 4.3007, providerCount: 14 },
  { id: 'luxembourg', name: 'Luxembourg City', country: 'Luxembourg', countryCode: 'LU', region: 'Europe', latitude: 49.6117, longitude: 6.13, providerCount: 10 },
  { id: 'bern', name: 'Bern', country: 'Switzerland', countryCode: 'CH', region: 'Europe', latitude: 46.948, longitude: 7.4474, providerCount: 14 },
  { id: 'basel', name: 'Basel', country: 'Switzerland', countryCode: 'CH', region: 'Europe', latitude: 47.5596, longitude: 7.5886, providerCount: 14 },
  { id: 'lausanne', name: 'Lausanne', country: 'Switzerland', countryCode: 'CH', region: 'Europe', latitude: 46.5197, longitude: 6.6323, providerCount: 14 },
  { id: 'salzburg', name: 'Salzburg', country: 'Austria', countryCode: 'AT', region: 'Europe', latitude: 47.8095, longitude: 13.055, providerCount: 14 },
  { id: 'innsbruck', name: 'Innsbruck', country: 'Austria', countryCode: 'AT', region: 'Europe', latitude: 47.2692, longitude: 11.4041, providerCount: 14 },
  { id: 'graz', name: 'Graz', country: 'Austria', countryCode: 'AT', region: 'Europe', latitude: 47.0707, longitude: 15.4395, providerCount: 12 },
  { id: 'bordeaux', name: 'Bordeaux', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 44.8378, longitude: -0.5792, providerCount: 14 },
  { id: 'toulouse', name: 'Toulouse', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 43.6047, longitude: 1.4442, providerCount: 12 },
  { id: 'montpellier', name: 'Montpellier', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 43.6108, longitude: 3.8767, providerCount: 12 },
  { id: 'strasbourg', name: 'Strasbourg', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 48.5734, longitude: 7.7521, providerCount: 10 },
  { id: 'cannes', name: 'Cannes', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 43.5528, longitude: 7.0174, providerCount: 18 },
  { id: 'saint-tropez', name: 'Saint-Tropez', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 43.2727, longitude: 6.6406, providerCount: 14 },
  { id: 'brno', name: 'Brno', country: 'Czech Republic', countryCode: 'CZ', region: 'Europe', latitude: 49.1951, longitude: 16.6068, providerCount: 10 },
  { id: 'cork', name: 'Cork', country: 'Ireland', countryCode: 'IE', region: 'Europe', latitude: 51.8985, longitude: -8.4756, providerCount: 10 },
  { id: 'galway', name: 'Galway', country: 'Ireland', countryCode: 'IE', region: 'Europe', latitude: 53.2707, longitude: -9.0568, providerCount: 8 },
  { id: 'faro', name: 'Faro', country: 'Portugal', countryCode: 'PT', region: 'Europe', latitude: 37.0194, longitude: -7.9322, providerCount: 12 },
  { id: 'funchal', name: 'Funchal', country: 'Portugal', countryCode: 'PT', region: 'Europe', latitude: 32.6669, longitude: -16.9241, providerCount: 14 },
  { id: 'tenerife', name: 'Tenerife', country: 'Spain', countryCode: 'ES', region: 'Europe', latitude: 28.2916, longitude: -16.6291, providerCount: 16 },
  { id: 'gran-canaria', name: 'Gran Canaria', country: 'Spain', countryCode: 'ES', region: 'Europe', latitude: 27.9202, longitude: -15.5474, providerCount: 14 },
  { id: 'marbella', name: 'Marbella', country: 'Spain', countryCode: 'ES', region: 'Europe', latitude: 36.5099, longitude: -4.8862, providerCount: 22 },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', countryCode: 'TR', region: 'Europe', latitude: 41.0082, longitude: 28.9784, providerCount: 30 },
  { id: 'antalya', name: 'Antalya', country: 'Turkey', countryCode: 'TR', region: 'Europe', latitude: 36.8969, longitude: 30.7133, providerCount: 22 },
  { id: 'bodrum', name: 'Bodrum', country: 'Turkey', countryCode: 'TR', region: 'Europe', latitude: 37.0344, longitude: 27.4305, providerCount: 18 },
  { id: 'batumi', name: 'Batumi', country: 'Georgia', countryCode: 'GE', region: 'Europe', latitude: 41.6168, longitude: 41.6367, providerCount: 10 },
  { id: 'yerevan', name: 'Yerevan', country: 'Armenia', countryCode: 'AM', region: 'Europe', latitude: 40.1792, longitude: 44.4991, providerCount: 8 },
  { id: 'baku', name: 'Baku', country: 'Azerbaijan', countryCode: 'AZ', region: 'Europe', latitude: 40.4093, longitude: 49.8671, providerCount: 10 },
  { id: 'nicosia', name: 'Nicosia', country: 'Cyprus', countryCode: 'CY', region: 'Europe', latitude: 35.1856, longitude: 33.3823, providerCount: 10 },
  { id: 'limassol', name: 'Limassol', country: 'Cyprus', countryCode: 'CY', region: 'Europe', latitude: 34.7071, longitude: 33.0226, providerCount: 14 },
  { id: 'paphos', name: 'Paphos', country: 'Cyprus', countryCode: 'CY', region: 'Europe', latitude: 34.7754, longitude: 32.4245, providerCount: 12 },
  { id: 'malta', name: 'Valletta', country: 'Malta', countryCode: 'MT', region: 'Europe', latitude: 35.8989, longitude: 14.5146, providerCount: 12 },
  { id: 'tirana', name: 'Tirana', country: 'Albania', countryCode: 'AL', region: 'Europe', latitude: 41.3275, longitude: 19.8187, providerCount: 8 },
  { id: 'montenegro', name: 'Podgorica', country: 'Montenegro', countryCode: 'ME', region: 'Europe', latitude: 42.4304, longitude: 19.2594, providerCount: 8 },
  { id: 'kotor', name: 'Kotor', country: 'Montenegro', countryCode: 'ME', region: 'Europe', latitude: 42.4247, longitude: 18.7712, providerCount: 10 },
  { id: 'sarajevo', name: 'Sarajevo', country: 'Bosnia', countryCode: 'BA', region: 'Europe', latitude: 43.8563, longitude: 18.4131, providerCount: 8 },
  { id: 'skopje', name: 'Skopje', country: 'North Macedonia', countryCode: 'MK', region: 'Europe', latitude: 41.9981, longitude: 21.4254, providerCount: 8 },
  { id: 'larnaca', name: 'Larnaca', country: 'Cyprus', countryCode: 'CY', region: 'Europe', latitude: 34.9003, longitude: 33.6232, providerCount: 10 },

  // ─── NORTH AMERICA (80 cities) ───
  { id: 'new-york', name: 'New York', country: 'United States', countryCode: 'US', region: 'North America', latitude: 40.7128, longitude: -74.006, providerCount: 55 },
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', countryCode: 'US', region: 'North America', latitude: 34.0522, longitude: -118.2437, providerCount: 48 },
  { id: 'miami', name: 'Miami', country: 'United States', countryCode: 'US', region: 'North America', latitude: 25.7617, longitude: -80.1918, providerCount: 38 },
  { id: 'san-francisco', name: 'San Francisco', country: 'United States', countryCode: 'US', region: 'North America', latitude: 37.7749, longitude: -122.4194, providerCount: 40 },
  { id: 'chicago', name: 'Chicago', country: 'United States', countryCode: 'US', region: 'North America', latitude: 41.8781, longitude: -87.6298, providerCount: 35 },
  { id: 'toronto', name: 'Toronto', country: 'Canada', countryCode: 'CA', region: 'North America', latitude: 43.6532, longitude: -79.3832, providerCount: 32 },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', countryCode: 'CA', region: 'North America', latitude: 49.2827, longitude: -123.1207, providerCount: 30 },
  { id: 'austin', name: 'Austin', country: 'United States', countryCode: 'US', region: 'North America', latitude: 30.2672, longitude: -97.7431, providerCount: 28 },
  { id: 'denver', name: 'Denver', country: 'United States', countryCode: 'US', region: 'North America', latitude: 39.7392, longitude: -104.9903, providerCount: 25 },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', countryCode: 'MX', region: 'North America', latitude: 19.4326, longitude: -99.1332, providerCount: 30 },
  { id: 'scottsdale', name: 'Scottsdale', country: 'United States', countryCode: 'US', region: 'North America', latitude: 33.4942, longitude: -111.9261, providerCount: 22 },
  { id: 'honolulu', name: 'Honolulu', country: 'United States', countryCode: 'US', region: 'North America', latitude: 21.3069, longitude: -157.8583, providerCount: 28 },
  { id: 'boston', name: 'Boston', country: 'United States', countryCode: 'US', region: 'North America', latitude: 42.3601, longitude: -71.0589, providerCount: 30 },
  { id: 'seattle', name: 'Seattle', country: 'United States', countryCode: 'US', region: 'North America', latitude: 47.6062, longitude: -122.3321, providerCount: 28 },
  { id: 'washington-dc', name: 'Washington D.C.', country: 'United States', countryCode: 'US', region: 'North America', latitude: 38.9072, longitude: -77.0369, providerCount: 30 },
  { id: 'montreal', name: 'Montreal', country: 'Canada', countryCode: 'CA', region: 'North America', latitude: 45.5017, longitude: -73.5673, providerCount: 25 },
  { id: 'playa-del-carmen', name: 'Playa del Carmen', country: 'Mexico', countryCode: 'MX', region: 'North America', latitude: 20.6296, longitude: -87.0739, providerCount: 20 },
  { id: 'san-diego', name: 'San Diego', country: 'United States', countryCode: 'US', region: 'North America', latitude: 32.7157, longitude: -117.1611, providerCount: 26 },
  { id: 'nashville', name: 'Nashville', country: 'United States', countryCode: 'US', region: 'North America', latitude: 36.1627, longitude: -86.7816, providerCount: 20 },
  { id: 'portland', name: 'Portland', country: 'United States', countryCode: 'US', region: 'North America', latitude: 45.5152, longitude: -122.6784, providerCount: 22 },
  { id: 'dallas', name: 'Dallas', country: 'United States', countryCode: 'US', region: 'North America', latitude: 32.7767, longitude: -96.797, providerCount: 24 },
  { id: 'houston', name: 'Houston', country: 'United States', countryCode: 'US', region: 'North America', latitude: 29.7604, longitude: -95.3698, providerCount: 22 },
  { id: 'atlanta', name: 'Atlanta', country: 'United States', countryCode: 'US', region: 'North America', latitude: 33.749, longitude: -84.388, providerCount: 22 },
  { id: 'philadelphia', name: 'Philadelphia', country: 'United States', countryCode: 'US', region: 'North America', latitude: 39.9526, longitude: -75.1652, providerCount: 20 },
  { id: 'phoenix', name: 'Phoenix', country: 'United States', countryCode: 'US', region: 'North America', latitude: 33.4484, longitude: -112.074, providerCount: 20 },
  { id: 'las-vegas', name: 'Las Vegas', country: 'United States', countryCode: 'US', region: 'North America', latitude: 36.1699, longitude: -115.1398, providerCount: 30 },
  { id: 'minneapolis', name: 'Minneapolis', country: 'United States', countryCode: 'US', region: 'North America', latitude: 44.9778, longitude: -93.265, providerCount: 18 },
  { id: 'salt-lake-city', name: 'Salt Lake City', country: 'United States', countryCode: 'US', region: 'North America', latitude: 40.7608, longitude: -111.891, providerCount: 18 },
  { id: 'charlotte', name: 'Charlotte', country: 'United States', countryCode: 'US', region: 'North America', latitude: 35.2271, longitude: -80.8431, providerCount: 16 },
  { id: 'raleigh', name: 'Raleigh', country: 'United States', countryCode: 'US', region: 'North America', latitude: 35.7796, longitude: -78.6382, providerCount: 14 },
  { id: 'tampa', name: 'Tampa', country: 'United States', countryCode: 'US', region: 'North America', latitude: 27.9506, longitude: -82.4572, providerCount: 18 },
  { id: 'orlando', name: 'Orlando', country: 'United States', countryCode: 'US', region: 'North America', latitude: 28.5383, longitude: -81.3792, providerCount: 16 },
  { id: 'detroit', name: 'Detroit', country: 'United States', countryCode: 'US', region: 'North America', latitude: 42.3314, longitude: -83.0458, providerCount: 14 },
  { id: 'pittsburgh', name: 'Pittsburgh', country: 'United States', countryCode: 'US', region: 'North America', latitude: 40.4406, longitude: -79.9959, providerCount: 14 },
  { id: 'calgary', name: 'Calgary', country: 'Canada', countryCode: 'CA', region: 'North America', latitude: 51.0447, longitude: -114.0719, providerCount: 16 },
  { id: 'ottawa', name: 'Ottawa', country: 'Canada', countryCode: 'CA', region: 'North America', latitude: 45.4215, longitude: -75.6972, providerCount: 14 },
  { id: 'edmonton', name: 'Edmonton', country: 'Canada', countryCode: 'CA', region: 'North America', latitude: 53.5461, longitude: -113.4938, providerCount: 12 },
  { id: 'victoria', name: 'Victoria', country: 'Canada', countryCode: 'CA', region: 'North America', latitude: 48.4284, longitude: -123.3656, providerCount: 12 },
  { id: 'whistler', name: 'Whistler', country: 'Canada', countryCode: 'CA', region: 'North America', latitude: 50.1163, longitude: -122.9574, providerCount: 16 },
  { id: 'cancun', name: 'Cancún', country: 'Mexico', countryCode: 'MX', region: 'North America', latitude: 21.1619, longitude: -86.8515, providerCount: 24 },
  { id: 'tulum', name: 'Tulum', country: 'Mexico', countryCode: 'MX', region: 'North America', latitude: 20.2114, longitude: -87.4654, providerCount: 22 },
  { id: 'guadalajara', name: 'Guadalajara', country: 'Mexico', countryCode: 'MX', region: 'North America', latitude: 20.6597, longitude: -103.3496, providerCount: 16 },
  { id: 'puerto-vallarta', name: 'Puerto Vallarta', country: 'Mexico', countryCode: 'MX', region: 'North America', latitude: 20.6534, longitude: -105.2253, providerCount: 18 },
  { id: 'san-miguel', name: 'San Miguel de Allende', country: 'Mexico', countryCode: 'MX', region: 'North America', latitude: 20.9144, longitude: -100.7452, providerCount: 14 },
  { id: 'havana', name: 'Havana', country: 'Cuba', countryCode: 'CU', region: 'North America', latitude: 23.1136, longitude: -82.3666, providerCount: 8 },
  { id: 'santo-domingo', name: 'Santo Domingo', country: 'Dominican Republic', countryCode: 'DO', region: 'North America', latitude: 18.4861, longitude: -69.9312, providerCount: 10 },
  { id: 'san-juan', name: 'San Juan', country: 'Puerto Rico', countryCode: 'PR', region: 'North America', latitude: 18.4655, longitude: -66.1057, providerCount: 14 },
  { id: 'nassau', name: 'Nassau', country: 'Bahamas', countryCode: 'BS', region: 'North America', latitude: 25.0343, longitude: -77.3963, providerCount: 12 },
  { id: 'kingston', name: 'Kingston', country: 'Jamaica', countryCode: 'JM', region: 'North America', latitude: 18.0179, longitude: -76.8099, providerCount: 8 },
  { id: 'panama-city', name: 'Panama City', country: 'Panama', countryCode: 'PA', region: 'North America', latitude: 8.9824, longitude: -79.5199, providerCount: 14 },
  { id: 'san-jose-cr', name: 'San José', country: 'Costa Rica', countryCode: 'CR', region: 'North America', latitude: 9.9281, longitude: -84.0907, providerCount: 16 },
  { id: 'santa-teresa', name: 'Santa Teresa', country: 'Costa Rica', countryCode: 'CR', region: 'North America', latitude: 9.6411, longitude: -85.1694, providerCount: 14 },
  { id: 'antigua', name: 'Antigua', country: 'Guatemala', countryCode: 'GT', region: 'North America', latitude: 14.5586, longitude: -90.7295, providerCount: 10 },

  // ─── ASIA PACIFIC (120 cities) ───
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', countryCode: 'JP', region: 'Asia Pacific', latitude: 35.6762, longitude: 139.6503, providerCount: 45 },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', countryCode: 'SG', region: 'Asia Pacific', latitude: 1.3521, longitude: 103.8198, providerCount: 38 },
  { id: 'hong-kong', name: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', region: 'Asia Pacific', latitude: 22.3193, longitude: 114.1694, providerCount: 35 },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', countryCode: 'TH', region: 'Asia Pacific', latitude: 13.7563, longitude: 100.5018, providerCount: 42 },
  { id: 'bali', name: 'Bali', country: 'Indonesia', countryCode: 'ID', region: 'Asia Pacific', latitude: -8.3405, longitude: 115.092, providerCount: 50 },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', countryCode: 'KR', region: 'Asia Pacific', latitude: 37.5665, longitude: 126.978, providerCount: 38 },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', region: 'Asia Pacific', latitude: 3.139, longitude: 101.6869, providerCount: 28 },
  { id: 'mumbai', name: 'Mumbai', country: 'India', countryCode: 'IN', region: 'Asia Pacific', latitude: 19.076, longitude: 72.8777, providerCount: 30 },
  { id: 'shanghai', name: 'Shanghai', country: 'China', countryCode: 'CN', region: 'Asia Pacific', latitude: 31.2304, longitude: 121.4737, providerCount: 35 },
  { id: 'taipei', name: 'Taipei', country: 'Taiwan', countryCode: 'TW', region: 'Asia Pacific', latitude: 25.033, longitude: 121.5654, providerCount: 26 },
  { id: 'chiang-mai', name: 'Chiang Mai', country: 'Thailand', countryCode: 'TH', region: 'Asia Pacific', latitude: 18.7883, longitude: 98.9853, providerCount: 35 },
  { id: 'ho-chi-minh', name: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN', region: 'Asia Pacific', latitude: 10.8231, longitude: 106.6297, providerCount: 28 },
  { id: 'hanoi', name: 'Hanoi', country: 'Vietnam', countryCode: 'VN', region: 'Asia Pacific', latitude: 21.0278, longitude: 105.8342, providerCount: 22 },
  { id: 'manila', name: 'Manila', country: 'Philippines', countryCode: 'PH', region: 'Asia Pacific', latitude: 14.5995, longitude: 120.9842, providerCount: 20 },
  { id: 'osaka', name: 'Osaka', country: 'Japan', countryCode: 'JP', region: 'Asia Pacific', latitude: 34.6937, longitude: 135.5023, providerCount: 30 },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', countryCode: 'JP', region: 'Asia Pacific', latitude: 35.0116, longitude: 135.7681, providerCount: 25 },
  { id: 'phuket', name: 'Phuket', country: 'Thailand', countryCode: 'TH', region: 'Asia Pacific', latitude: 7.8804, longitude: 98.3923, providerCount: 32 },
  { id: 'beijing', name: 'Beijing', country: 'China', countryCode: 'CN', region: 'Asia Pacific', latitude: 39.9042, longitude: 116.4074, providerCount: 30 },
  { id: 'shenzhen', name: 'Shenzhen', country: 'China', countryCode: 'CN', region: 'Asia Pacific', latitude: 22.5431, longitude: 114.0579, providerCount: 22 },
  { id: 'guangzhou', name: 'Guangzhou', country: 'China', countryCode: 'CN', region: 'Asia Pacific', latitude: 23.1291, longitude: 113.2644, providerCount: 20 },
  { id: 'chengdu', name: 'Chengdu', country: 'China', countryCode: 'CN', region: 'Asia Pacific', latitude: 30.5728, longitude: 104.0668, providerCount: 18 },
  { id: 'delhi', name: 'New Delhi', country: 'India', countryCode: 'IN', region: 'Asia Pacific', latitude: 28.6139, longitude: 77.209, providerCount: 26 },
  { id: 'bangalore', name: 'Bangalore', country: 'India', countryCode: 'IN', region: 'Asia Pacific', latitude: 12.9716, longitude: 77.5946, providerCount: 22 },
  { id: 'goa', name: 'Goa', country: 'India', countryCode: 'IN', region: 'Asia Pacific', latitude: 15.2993, longitude: 74.124, providerCount: 28 },
  { id: 'rishikesh', name: 'Rishikesh', country: 'India', countryCode: 'IN', region: 'Asia Pacific', latitude: 30.0869, longitude: 78.2676, providerCount: 30 },
  { id: 'jaipur', name: 'Jaipur', country: 'India', countryCode: 'IN', region: 'Asia Pacific', latitude: 26.9124, longitude: 75.7873, providerCount: 16 },
  { id: 'kochi', name: 'Kochi', country: 'India', countryCode: 'IN', region: 'Asia Pacific', latitude: 9.9312, longitude: 76.2673, providerCount: 18 },
  { id: 'cebu', name: 'Cebu', country: 'Philippines', countryCode: 'PH', region: 'Asia Pacific', latitude: 10.3157, longitude: 123.8854, providerCount: 16 },
  { id: 'siargao', name: 'Siargao', country: 'Philippines', countryCode: 'PH', region: 'Asia Pacific', latitude: 9.8482, longitude: 126.0458, providerCount: 12 },
  { id: 'penang', name: 'Penang', country: 'Malaysia', countryCode: 'MY', region: 'Asia Pacific', latitude: 5.4164, longitude: 100.3327, providerCount: 16 },
  { id: 'langkawi', name: 'Langkawi', country: 'Malaysia', countryCode: 'MY', region: 'Asia Pacific', latitude: 6.35, longitude: 99.8, providerCount: 14 },
  { id: 'koh-samui', name: 'Koh Samui', country: 'Thailand', countryCode: 'TH', region: 'Asia Pacific', latitude: 9.5120, longitude: 100.0136, providerCount: 26 },
  { id: 'koh-phangan', name: 'Koh Phangan', country: 'Thailand', countryCode: 'TH', region: 'Asia Pacific', latitude: 9.7319, longitude: 100.0136, providerCount: 20 },
  { id: 'krabi', name: 'Krabi', country: 'Thailand', countryCode: 'TH', region: 'Asia Pacific', latitude: 8.0863, longitude: 98.9063, providerCount: 18 },
  { id: 'chiang-rai', name: 'Chiang Rai', country: 'Thailand', countryCode: 'TH', region: 'Asia Pacific', latitude: 19.9105, longitude: 99.8406, providerCount: 12 },
  { id: 'da-nang', name: 'Da Nang', country: 'Vietnam', countryCode: 'VN', region: 'Asia Pacific', latitude: 16.0544, longitude: 108.2022, providerCount: 18 },
  { id: 'hoi-an', name: 'Hoi An', country: 'Vietnam', countryCode: 'VN', region: 'Asia Pacific', latitude: 15.8801, longitude: 108.338, providerCount: 16 },
  { id: 'nha-trang', name: 'Nha Trang', country: 'Vietnam', countryCode: 'VN', region: 'Asia Pacific', latitude: 12.2388, longitude: 109.1967, providerCount: 14 },
  { id: 'phnom-penh', name: 'Phnom Penh', country: 'Cambodia', countryCode: 'KH', region: 'Asia Pacific', latitude: 11.5564, longitude: 104.9282, providerCount: 14 },
  { id: 'siem-reap', name: 'Siem Reap', country: 'Cambodia', countryCode: 'KH', region: 'Asia Pacific', latitude: 13.3633, longitude: 103.8564, providerCount: 16 },
  { id: 'vientiane', name: 'Vientiane', country: 'Laos', countryCode: 'LA', region: 'Asia Pacific', latitude: 17.9757, longitude: 102.6331, providerCount: 8 },
  { id: 'luang-prabang', name: 'Luang Prabang', country: 'Laos', countryCode: 'LA', region: 'Asia Pacific', latitude: 19.8856, longitude: 102.1347, providerCount: 10 },
  { id: 'yangon', name: 'Yangon', country: 'Myanmar', countryCode: 'MM', region: 'Asia Pacific', latitude: 16.8661, longitude: 96.1951, providerCount: 10 },
  { id: 'colombo', name: 'Colombo', country: 'Sri Lanka', countryCode: 'LK', region: 'Asia Pacific', latitude: 6.9271, longitude: 79.8612, providerCount: 16 },
  { id: 'kathmandu', name: 'Kathmandu', country: 'Nepal', countryCode: 'NP', region: 'Asia Pacific', latitude: 27.7172, longitude: 85.324, providerCount: 14 },
  { id: 'pokhara', name: 'Pokhara', country: 'Nepal', countryCode: 'NP', region: 'Asia Pacific', latitude: 28.2096, longitude: 83.9856, providerCount: 12 },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', countryCode: 'ID', region: 'Asia Pacific', latitude: -6.2088, longitude: 106.8456, providerCount: 22 },
  { id: 'yogyakarta', name: 'Yogyakarta', country: 'Indonesia', countryCode: 'ID', region: 'Asia Pacific', latitude: -7.7956, longitude: 110.3695, providerCount: 14 },
  { id: 'lombok', name: 'Lombok', country: 'Indonesia', countryCode: 'ID', region: 'Asia Pacific', latitude: -8.6501, longitude: 116.3249, providerCount: 16 },
  { id: 'canggu', name: 'Canggu', country: 'Indonesia', countryCode: 'ID', region: 'Asia Pacific', latitude: -8.6478, longitude: 115.1385, providerCount: 28 },
  { id: 'busan', name: 'Busan', country: 'South Korea', countryCode: 'KR', region: 'Asia Pacific', latitude: 35.1796, longitude: 129.0756, providerCount: 20 },
  { id: 'jeju', name: 'Jeju', country: 'South Korea', countryCode: 'KR', region: 'Asia Pacific', latitude: 33.4996, longitude: 126.5312, providerCount: 16 },
  { id: 'fukuoka', name: 'Fukuoka', country: 'Japan', countryCode: 'JP', region: 'Asia Pacific', latitude: 33.5904, longitude: 130.4017, providerCount: 18 },
  { id: 'nagoya', name: 'Nagoya', country: 'Japan', countryCode: 'JP', region: 'Asia Pacific', latitude: 35.1815, longitude: 136.9066, providerCount: 16 },
  { id: 'sapporo', name: 'Sapporo', country: 'Japan', countryCode: 'JP', region: 'Asia Pacific', latitude: 43.0618, longitude: 141.3545, providerCount: 18 },
  { id: 'okinawa', name: 'Okinawa', country: 'Japan', countryCode: 'JP', region: 'Asia Pacific', latitude: 26.3344, longitude: 127.8015, providerCount: 14 },
  { id: 'kaohsiung', name: 'Kaohsiung', country: 'Taiwan', countryCode: 'TW', region: 'Asia Pacific', latitude: 22.6273, longitude: 120.3014, providerCount: 14 },
  { id: 'taichung', name: 'Taichung', country: 'Taiwan', countryCode: 'TW', region: 'Asia Pacific', latitude: 24.1477, longitude: 120.6736, providerCount: 12 },
  { id: 'macau', name: 'Macau', country: 'Macau', countryCode: 'MO', region: 'Asia Pacific', latitude: 22.1987, longitude: 113.5439, providerCount: 16 },
  { id: 'ulaanbaatar', name: 'Ulaanbaatar', country: 'Mongolia', countryCode: 'MN', region: 'Asia Pacific', latitude: 47.8864, longitude: 106.9057, providerCount: 6 },
  { id: 'almaty', name: 'Almaty', country: 'Kazakhstan', countryCode: 'KZ', region: 'Asia Pacific', latitude: 43.2551, longitude: 76.9126, providerCount: 10 },
  { id: 'tashkent', name: 'Tashkent', country: 'Uzbekistan', countryCode: 'UZ', region: 'Asia Pacific', latitude: 41.2995, longitude: 69.2401, providerCount: 8 },
  { id: 'bishkek', name: 'Bishkek', country: 'Kyrgyzstan', countryCode: 'KG', region: 'Asia Pacific', latitude: 42.8746, longitude: 74.5698, providerCount: 6 },
  { id: 'dhaka', name: 'Dhaka', country: 'Bangladesh', countryCode: 'BD', region: 'Asia Pacific', latitude: 23.8103, longitude: 90.4125, providerCount: 10 },
  { id: 'karachi', name: 'Karachi', country: 'Pakistan', countryCode: 'PK', region: 'Asia Pacific', latitude: 24.8607, longitude: 67.0011, providerCount: 10 },
  { id: 'lahore', name: 'Lahore', country: 'Pakistan', countryCode: 'PK', region: 'Asia Pacific', latitude: 31.5204, longitude: 74.3587, providerCount: 8 },
  { id: 'islamabad', name: 'Islamabad', country: 'Pakistan', countryCode: 'PK', region: 'Asia Pacific', latitude: 33.6844, longitude: 73.0479, providerCount: 8 },

  // ─── MIDDLE EAST (40 cities) ───
  { id: 'dubai', name: 'Dubai', country: 'UAE', countryCode: 'AE', region: 'Middle East', latitude: 25.2048, longitude: 55.2708, providerCount: 45 },
  { id: 'abu-dhabi', name: 'Abu Dhabi', country: 'UAE', countryCode: 'AE', region: 'Middle East', latitude: 24.4539, longitude: 54.3773, providerCount: 30 },
  { id: 'doha', name: 'Doha', country: 'Qatar', countryCode: 'QA', region: 'Middle East', latitude: 25.2854, longitude: 51.531, providerCount: 25 },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', region: 'Middle East', latitude: 24.7136, longitude: 46.6753, providerCount: 22 },
  { id: 'tel-aviv', name: 'Tel Aviv', country: 'Israel', countryCode: 'IL', region: 'Middle East', latitude: 32.0853, longitude: 34.7818, providerCount: 28 },
  { id: 'jeddah', name: 'Jeddah', country: 'Saudi Arabia', countryCode: 'SA', region: 'Middle East', latitude: 21.4858, longitude: 39.1925, providerCount: 18 },
  { id: 'muscat', name: 'Muscat', country: 'Oman', countryCode: 'OM', region: 'Middle East', latitude: 23.588, longitude: 58.3829, providerCount: 16 },
  { id: 'manama', name: 'Manama', country: 'Bahrain', countryCode: 'BH', region: 'Middle East', latitude: 26.2285, longitude: 50.5860, providerCount: 14 },
  { id: 'kuwait-city', name: 'Kuwait City', country: 'Kuwait', countryCode: 'KW', region: 'Middle East', latitude: 29.3759, longitude: 47.9774, providerCount: 14 },
  { id: 'amman', name: 'Amman', country: 'Jordan', countryCode: 'JO', region: 'Middle East', latitude: 31.9454, longitude: 35.9284, providerCount: 14 },
  { id: 'beirut', name: 'Beirut', country: 'Lebanon', countryCode: 'LB', region: 'Middle East', latitude: 33.8938, longitude: 35.5018, providerCount: 16 },
  { id: 'jerusalem', name: 'Jerusalem', country: 'Israel', countryCode: 'IL', region: 'Middle East', latitude: 31.7683, longitude: 35.2137, providerCount: 14 },
  { id: 'haifa', name: 'Haifa', country: 'Israel', countryCode: 'IL', region: 'Middle East', latitude: 32.7940, longitude: 34.9896, providerCount: 10 },
  { id: 'sharjah', name: 'Sharjah', country: 'UAE', countryCode: 'AE', region: 'Middle East', latitude: 25.3463, longitude: 55.4209, providerCount: 12 },
  { id: 'ras-al-khaimah', name: 'Ras Al Khaimah', country: 'UAE', countryCode: 'AE', region: 'Middle East', latitude: 25.7895, longitude: 55.9432, providerCount: 10 },
  { id: 'neom', name: 'NEOM', country: 'Saudi Arabia', countryCode: 'SA', region: 'Middle East', latitude: 28.0074, longitude: 35.1446, providerCount: 10 },
  { id: 'dead-sea', name: 'Dead Sea', country: 'Jordan', countryCode: 'JO', region: 'Middle East', latitude: 31.5, longitude: 35.5, providerCount: 12 },
  { id: 'aqaba', name: 'Aqaba', country: 'Jordan', countryCode: 'JO', region: 'Middle East', latitude: 29.5268, longitude: 35.0078, providerCount: 10 },
  { id: 'salalah', name: 'Salalah', country: 'Oman', countryCode: 'OM', region: 'Middle East', latitude: 17.0151, longitude: 54.0924, providerCount: 8 },
  { id: 'fujairah', name: 'Fujairah', country: 'UAE', countryCode: 'AE', region: 'Middle East', latitude: 25.1288, longitude: 56.3265, providerCount: 8 },

  // ─── OCEANIA (30 cities) ───
  { id: 'sydney', name: 'Sydney', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -33.8688, longitude: 151.2093, providerCount: 40 },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -37.8136, longitude: 144.9631, providerCount: 38 },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', countryCode: 'NZ', region: 'Oceania', latitude: -36.8485, longitude: 174.7633, providerCount: 22 },
  { id: 'brisbane', name: 'Brisbane', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -27.4698, longitude: 153.0251, providerCount: 25 },
  { id: 'gold-coast', name: 'Gold Coast', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -28.0167, longitude: 153.4, providerCount: 20 },
  { id: 'perth', name: 'Perth', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -31.9505, longitude: 115.8605, providerCount: 22 },
  { id: 'adelaide', name: 'Adelaide', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -34.9285, longitude: 138.6007, providerCount: 16 },
  { id: 'canberra', name: 'Canberra', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -35.2809, longitude: 149.1300, providerCount: 12 },
  { id: 'hobart', name: 'Hobart', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -42.8821, longitude: 147.3272, providerCount: 10 },
  { id: 'darwin', name: 'Darwin', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -12.4634, longitude: 130.8456, providerCount: 8 },
  { id: 'cairns', name: 'Cairns', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -16.9186, longitude: 145.7781, providerCount: 12 },
  { id: 'byron-bay', name: 'Byron Bay', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -28.6474, longitude: 153.6020, providerCount: 18 },
  { id: 'noosa', name: 'Noosa', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -26.3952, longitude: 153.0718, providerCount: 12 },
  { id: 'wellington', name: 'Wellington', country: 'New Zealand', countryCode: 'NZ', region: 'Oceania', latitude: -41.2865, longitude: 174.7762, providerCount: 14 },
  { id: 'queenstown', name: 'Queenstown', country: 'New Zealand', countryCode: 'NZ', region: 'Oceania', latitude: -45.0312, longitude: 168.6626, providerCount: 14 },
  { id: 'christchurch', name: 'Christchurch', country: 'New Zealand', countryCode: 'NZ', region: 'Oceania', latitude: -43.5321, longitude: 172.6362, providerCount: 12 },
  { id: 'rotorua', name: 'Rotorua', country: 'New Zealand', countryCode: 'NZ', region: 'Oceania', latitude: -38.1368, longitude: 176.2497, providerCount: 14 },
  { id: 'fiji', name: 'Nadi', country: 'Fiji', countryCode: 'FJ', region: 'Oceania', latitude: -17.7765, longitude: 177.9649, providerCount: 10 },
  { id: 'tahiti', name: 'Papeete', country: 'French Polynesia', countryCode: 'PF', region: 'Oceania', latitude: -17.5516, longitude: -149.5585, providerCount: 8 },
  { id: 'bora-bora', name: 'Bora Bora', country: 'French Polynesia', countryCode: 'PF', region: 'Oceania', latitude: -16.5004, longitude: -151.7415, providerCount: 8 },
  { id: 'noumea', name: 'Nouméa', country: 'New Caledonia', countryCode: 'NC', region: 'Oceania', latitude: -22.2558, longitude: 166.4505, providerCount: 6 },
  { id: 'port-vila', name: 'Port Vila', country: 'Vanuatu', countryCode: 'VU', region: 'Oceania', latitude: -17.7334, longitude: 168.3273, providerCount: 6 },

  // ─── AFRICA (40 cities) ───
  { id: 'cape-town', name: 'Cape Town', country: 'South Africa', countryCode: 'ZA', region: 'Africa', latitude: -33.9249, longitude: 18.4241, providerCount: 22 },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', countryCode: 'KE', region: 'Africa', latitude: -1.2921, longitude: 36.8219, providerCount: 15 },
  { id: 'marrakech', name: 'Marrakech', country: 'Morocco', countryCode: 'MA', region: 'Africa', latitude: 31.6295, longitude: -7.9811, providerCount: 25 },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', countryCode: 'EG', region: 'Africa', latitude: 30.0444, longitude: 31.2357, providerCount: 18 },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', countryCode: 'NG', region: 'Africa', latitude: 6.5244, longitude: 3.3792, providerCount: 14 },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', region: 'Africa', latitude: -26.2041, longitude: 28.0473, providerCount: 18 },
  { id: 'durban', name: 'Durban', country: 'South Africa', countryCode: 'ZA', region: 'Africa', latitude: -29.8587, longitude: 31.0218, providerCount: 14 },
  { id: 'casablanca', name: 'Casablanca', country: 'Morocco', countryCode: 'MA', region: 'Africa', latitude: 33.5731, longitude: -7.5898, providerCount: 16 },
  { id: 'tangier', name: 'Tangier', country: 'Morocco', countryCode: 'MA', region: 'Africa', latitude: 35.7595, longitude: -5.834, providerCount: 12 },
  { id: 'essaouira', name: 'Essaouira', country: 'Morocco', countryCode: 'MA', region: 'Africa', latitude: 31.5085, longitude: -9.7595, providerCount: 10 },
  { id: 'tunis', name: 'Tunis', country: 'Tunisia', countryCode: 'TN', region: 'Africa', latitude: 36.8065, longitude: 10.1815, providerCount: 10 },
  { id: 'accra', name: 'Accra', country: 'Ghana', countryCode: 'GH', region: 'Africa', latitude: 5.6037, longitude: -0.187, providerCount: 10 },
  { id: 'dakar', name: 'Dakar', country: 'Senegal', countryCode: 'SN', region: 'Africa', latitude: 14.7167, longitude: -17.4677, providerCount: 8 },
  { id: 'addis-ababa', name: 'Addis Ababa', country: 'Ethiopia', countryCode: 'ET', region: 'Africa', latitude: 9.0250, longitude: 38.7469, providerCount: 8 },
  { id: 'dar-es-salaam', name: 'Dar es Salaam', country: 'Tanzania', countryCode: 'TZ', region: 'Africa', latitude: -6.7924, longitude: 39.2083, providerCount: 8 },
  { id: 'zanzibar', name: 'Zanzibar', country: 'Tanzania', countryCode: 'TZ', region: 'Africa', latitude: -6.1659, longitude: 39.2026, providerCount: 12 },
  { id: 'kigali', name: 'Kigali', country: 'Rwanda', countryCode: 'RW', region: 'Africa', latitude: -1.9403, longitude: 29.8739, providerCount: 8 },
  { id: 'kampala', name: 'Kampala', country: 'Uganda', countryCode: 'UG', region: 'Africa', latitude: 0.3476, longitude: 32.5825, providerCount: 6 },
  { id: 'mauritius', name: 'Port Louis', country: 'Mauritius', countryCode: 'MU', region: 'Africa', latitude: -20.1609, longitude: 57.5012, providerCount: 16 },
  { id: 'seychelles', name: 'Victoria', country: 'Seychelles', countryCode: 'SC', region: 'Africa', latitude: -4.6191, longitude: 55.4513, providerCount: 12 },
  { id: 'maputo', name: 'Maputo', country: 'Mozambique', countryCode: 'MZ', region: 'Africa', latitude: -25.9692, longitude: 32.5732, providerCount: 6 },
  { id: 'windhoek', name: 'Windhoek', country: 'Namibia', countryCode: 'NA', region: 'Africa', latitude: -22.5609, longitude: 17.0658, providerCount: 6 },
  { id: 'lusaka', name: 'Lusaka', country: 'Zambia', countryCode: 'ZM', region: 'Africa', latitude: -15.3875, longitude: 28.3228, providerCount: 6 },
  { id: 'harare', name: 'Harare', country: 'Zimbabwe', countryCode: 'ZW', region: 'Africa', latitude: -17.8292, longitude: 31.0522, providerCount: 6 },
  { id: 'abuja', name: 'Abuja', country: 'Nigeria', countryCode: 'NG', region: 'Africa', latitude: 9.0579, longitude: 7.4951, providerCount: 8 },

  // ─── SOUTH AMERICA (40 cities) ───
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', countryCode: 'BR', region: 'South America', latitude: -23.5505, longitude: -46.6333, providerCount: 35 },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', region: 'South America', latitude: -34.6037, longitude: -58.3816, providerCount: 28 },
  { id: 'bogota', name: 'Bogotá', country: 'Colombia', countryCode: 'CO', region: 'South America', latitude: 4.711, longitude: -74.0721, providerCount: 22 },
  { id: 'lima', name: 'Lima', country: 'Peru', countryCode: 'PE', region: 'South America', latitude: -12.0464, longitude: -77.0428, providerCount: 18 },
  { id: 'medellin', name: 'Medellín', country: 'Colombia', countryCode: 'CO', region: 'South America', latitude: 6.2476, longitude: -75.5658, providerCount: 20 },
  { id: 'santiago', name: 'Santiago', country: 'Chile', countryCode: 'CL', region: 'South America', latitude: -33.4489, longitude: -70.6693, providerCount: 22 },
  { id: 'rio', name: 'Rio de Janeiro', country: 'Brazil', countryCode: 'BR', region: 'South America', latitude: -22.9068, longitude: -43.1729, providerCount: 30 },
  { id: 'cartagena', name: 'Cartagena', country: 'Colombia', countryCode: 'CO', region: 'South America', latitude: 10.3910, longitude: -75.5364, providerCount: 16 },
  { id: 'cali', name: 'Cali', country: 'Colombia', countryCode: 'CO', region: 'South America', latitude: 3.4516, longitude: -76.532, providerCount: 12 },
  { id: 'quito', name: 'Quito', country: 'Ecuador', countryCode: 'EC', region: 'South America', latitude: -0.1807, longitude: -78.4678, providerCount: 14 },
  { id: 'guayaquil', name: 'Guayaquil', country: 'Ecuador', countryCode: 'EC', region: 'South America', latitude: -2.1894, longitude: -79.8891, providerCount: 10 },
  { id: 'cusco', name: 'Cusco', country: 'Peru', countryCode: 'PE', region: 'South America', latitude: -13.532, longitude: -71.9675, providerCount: 14 },
  { id: 'montevideo', name: 'Montevideo', country: 'Uruguay', countryCode: 'UY', region: 'South America', latitude: -34.9011, longitude: -56.1645, providerCount: 14 },
  { id: 'punta-del-este', name: 'Punta del Este', country: 'Uruguay', countryCode: 'UY', region: 'South America', latitude: -34.9667, longitude: -54.95, providerCount: 14 },
  { id: 'florianopolis', name: 'Florianópolis', country: 'Brazil', countryCode: 'BR', region: 'South America', latitude: -27.5954, longitude: -48.548, providerCount: 16 },
  { id: 'salvador', name: 'Salvador', country: 'Brazil', countryCode: 'BR', region: 'South America', latitude: -12.9714, longitude: -38.5124, providerCount: 14 },
  { id: 'belo-horizonte', name: 'Belo Horizonte', country: 'Brazil', countryCode: 'BR', region: 'South America', latitude: -19.9167, longitude: -43.9345, providerCount: 12 },
  { id: 'brasilia', name: 'Brasília', country: 'Brazil', countryCode: 'BR', region: 'South America', latitude: -15.7975, longitude: -47.8919, providerCount: 12 },
  { id: 'recife', name: 'Recife', country: 'Brazil', countryCode: 'BR', region: 'South America', latitude: -8.0476, longitude: -34.877, providerCount: 10 },
  { id: 'asuncion', name: 'Asunción', country: 'Paraguay', countryCode: 'PY', region: 'South America', latitude: -25.2637, longitude: -57.5759, providerCount: 8 },
  { id: 'la-paz', name: 'La Paz', country: 'Bolivia', countryCode: 'BO', region: 'South America', latitude: -16.4897, longitude: -68.1193, providerCount: 8 },
  { id: 'santa-marta', name: 'Santa Marta', country: 'Colombia', countryCode: 'CO', region: 'South America', latitude: 11.2408, longitude: -74.199, providerCount: 10 },
  { id: 'bariloche', name: 'Bariloche', country: 'Argentina', countryCode: 'AR', region: 'South America', latitude: -41.1335, longitude: -71.3103, providerCount: 10 },
  { id: 'mendoza', name: 'Mendoza', country: 'Argentina', countryCode: 'AR', region: 'South America', latitude: -32.8895, longitude: -68.8458, providerCount: 10 },
  { id: 'cordoba-ar', name: 'Córdoba', country: 'Argentina', countryCode: 'AR', region: 'South America', latitude: -31.4201, longitude: -64.1888, providerCount: 10 },
  { id: 'valparaiso', name: 'Valparaíso', country: 'Chile', countryCode: 'CL', region: 'South America', latitude: -33.0472, longitude: -71.6127, providerCount: 10 },
  { id: 'sucre', name: 'Sucre', country: 'Bolivia', countryCode: 'BO', region: 'South America', latitude: -19.0196, longitude: -65.2619, providerCount: 6 },
  { id: 'georgetown', name: 'Georgetown', country: 'Guyana', countryCode: 'GY', region: 'South America', latitude: 6.8013, longitude: -58.1551, providerCount: 4 },
  { id: 'paramaribo', name: 'Paramaribo', country: 'Suriname', countryCode: 'SR', region: 'South America', latitude: 5.852, longitude: -55.2038, providerCount: 4 },
];

export const WELLNESS_REGIONS = [...new Set(WELLNESS_CITIES.map(c => c.region))];

// ═══════════════════════════════════════════════════════════════
// PROVIDER GENERATION ENGINE
// Generates realistic providers for ALL 8 categories across ALL cities
// ═══════════════════════════════════════════════════════════════

const PROVIDER_TEMPLATES: Record<WellnessCategory, {
  names: string[];
  descriptions: string[];
  highlights: string[][];
  priceRanges: ('$' | '$$' | '$$$' | '$$$$')[];
}> = {
  'gym': {
    names: ['FitZone', 'Iron Temple', 'Core Fitness', 'Peak Performance Gym', 'Urban Fitness', 'PowerHouse Gym', 'Elite Training Center', 'CrossFit Box', 'Anytime Fitness', 'Gold\'s Gym', 'Planet Fitness', 'F45 Training', 'Orange Theory', 'Life Time Fitness', 'Snap Fitness'],
    descriptions: [
      'Modern gym with state-of-the-art equipment and certified personal trainers.',
      'Full-service fitness center with free weights, cardio machines, and group classes.',
      'High-energy gym offering HIIT, strength training, and functional fitness programs.',
      'Community-focused gym with expert coaching and motivating group workouts.',
    ],
    highlights: [['Free Weights', 'Cardio Zone', 'Personal Training', 'Group Classes'], ['HIIT Classes', 'Strength Zone', 'Locker Rooms', 'Juice Bar'], ['Olympic Lifting', 'CrossFit', 'Boxing', 'Recovery Area'], ['Spinning', 'TRX', 'Yoga Classes', 'Sauna']],
    priceRanges: ['$', '$$', '$$', '$$$'],
  },
  'spa': {
    names: ['Serenity Spa', 'The Wellness Retreat', 'Zen Spa & Wellness', 'Aura Day Spa', 'Bliss Spa', 'The Spa at Four Seasons', 'Mandarin Oriental Spa', 'Banyan Tree Spa', 'Elemis Spa', 'ESPA Life', 'Six Senses Spa', 'Willow Stream Spa'],
    descriptions: [
      'Luxury day spa offering holistic treatments, facials, and body therapies in tranquil surroundings.',
      'Award-winning spa with signature treatments inspired by local healing traditions.',
      'Urban oasis combining traditional wellness practices with modern luxury spa experiences.',
      'Premium spa offering personalized wellness journeys and rejuvenating treatments.',
    ],
    highlights: [['Hot Stone Massage', 'Facial Treatments', 'Body Wraps', 'Steam Room'], ['Aromatherapy', 'Couples Suite', 'Jacuzzi', 'Relaxation Lounge'], ['Hydrotherapy', 'Detox Programs', 'Beauty Treatments', 'Meditation'], ['Anti-Aging Facials', 'Deep Tissue Massage', 'Salt Room', 'Thermal Suite']],
    priceRanges: ['$$', '$$$', '$$$', '$$$$'],
  },
  'yoga': {
    names: ['Zen Yoga Studio', 'Flow Space', 'Mystic Yoga', 'Inner Light Yoga', 'Yoga Shala', 'Hot Yoga Studio', 'Ashtanga Center', 'Yoga Movement', 'YogaWorks', 'CorePower Yoga', 'Modo Yoga', 'Bikram Yoga'],
    descriptions: [
      'Authentic yoga studio offering daily classes in Vinyasa, Hatha, and Yin yoga.',
      'Welcoming yoga space with experienced teachers and a variety of styles for all levels.',
      'Traditional yoga studio blending ancient practices with modern wellness approaches.',
      'Vibrant community yoga studio with heated classes, workshops, and teacher training.',
    ],
    highlights: [['Vinyasa Flow', 'Meditation', 'Breathwork', 'Workshops'], ['Hot Yoga', 'Yin Classes', 'Sound Healing', 'Community'], ['Ashtanga', 'Teacher Training', 'Retreats', 'Private Sessions'], ['Prenatal Yoga', 'Aerial Yoga', 'Kids Classes', 'Online Streaming']],
    priceRanges: ['$', '$$', '$$', '$$$'],
  },
  'private-gym': {
    names: ['Equinox', 'E by Equinox', 'Third Space', 'KX', 'Harbour Club', 'David Lloyd', 'Virgin Active Platinum', 'BXR', 'The Ned Gym', 'Soho House Active', 'Core Collective', 'Bodyism'],
    descriptions: [
      'Ultra-premium private fitness club with world-class equipment, spa, and personalized coaching.',
      'Exclusive members-only gym with luxury amenities, rooftop pool, and concierge service.',
      'High-end private training facility with medical-grade fitness assessments and recovery technology.',
      'Boutique luxury gym combining personal training with wellness and lifestyle services.',
    ],
    highlights: [['Rooftop Pool', 'Personal Training', 'Spa & Recovery', 'Luxury Amenities'], ['Cryotherapy', 'Hypoxic Training', 'Swimming Pool', 'Boxing Ring'], ['Private Suites', 'Nutrition Planning', 'Sleep Lab', 'Concierge'], ['Pilates Reformer', 'Infrared Sauna', 'Juice Bar', 'Valet Parking']],
    priceRanges: ['$$$', '$$$$', '$$$$', '$$$$'],
  },
  'sauna': {
    names: ['Public Sauna House', 'Nordic Bath House', 'City Thermal Baths', 'Steam & Stone', 'The Bathhouse', 'Aire Ancient Baths', 'Thermae Spa', 'Banya House', 'Källa Spa', 'Blue Lagoon Outpost', 'QC Terme', 'Therme'],
    descriptions: [
      'Traditional public sauna with wood-fired saunas, cold plunge pools, and relaxation areas.',
      'Modern thermal bath complex with multiple sauna types, steam rooms, and outdoor pools.',
      'Historic bathhouse blending ancient bathing traditions with contemporary design.',
      'Nordic-inspired wellness center with authentic saunas, ice baths, and heated pools.',
    ],
    highlights: [['Wood-Fired Sauna', 'Cold Plunge', 'Steam Room', 'Relaxation'], ['Infrared Sauna', 'Ice Bath', 'Rooftop Pool', 'Restaurant'], ['Turkish Hammam', 'Thermal Waters', 'Salt Room', 'Night Sessions'], ['Outdoor Sauna', 'Sea Swimming', 'Löyly Sessions', 'Architecture']],
    priceRanges: ['$', '$', '$$', '$$'],
  },
  'sports-testing': {
    names: ['Performance Lab', 'Sports Science Center', 'Athletic Testing Institute', 'Elite Performance Hub', 'SportsMed Testing', 'Endurance Lab', 'Biomechanics Center', 'Human Performance Lab', 'VO2 Max Center', 'Sport Health Clinic'],
    descriptions: [
      'Professional sports testing facility offering VO2 max, lactate threshold, and body composition analysis.',
      'Comprehensive athletic performance testing with certified sports scientists and cutting-edge equipment.',
      'Sports science laboratory providing biomechanical analysis, metabolic testing, and performance optimization.',
      'Advanced performance testing center for athletes and fitness enthusiasts seeking data-driven improvement.',
    ],
    highlights: [['VO2 Max Testing', 'Body Composition', 'Biomechanics', 'Recovery Assessment'], ['Lactate Threshold', 'Sweat Analysis', 'Force Plate Testing', 'Running Gait'], ['DEXA Scan', 'Blood Panel', 'Metabolic Rate', 'Flexibility Testing'], ['Cardiac Screening', 'Muscle Endurance', 'Power Output', 'Nutrition Lab']],
    priceRanges: ['$$', '$$$', '$$$', '$$$$'],
  },
  'massage': {
    names: ['Healing Hands Massage', 'Deep Relief Center', 'Thai Wellness Massage', 'Sports Massage Clinic', 'Serenity Massage', 'The Massage Room', 'Bodywork Studio', 'Urban Massage', 'Zen Touch', 'Traditional Massage House'],
    descriptions: [
      'Professional massage center offering deep tissue, Swedish, and sports massage by certified therapists.',
      'Relaxing massage studio with a variety of techniques from Thai to hot stone therapy.',
      'Therapeutic massage center specializing in pain relief, recovery, and stress management.',
      'Traditional massage studio combining local techniques with modern therapeutic approaches.',
    ],
    highlights: [['Deep Tissue', 'Swedish Massage', 'Hot Stone', 'Aromatherapy'], ['Thai Massage', 'Sports Massage', 'Reflexology', 'Cupping'], ['Shiatsu', 'Lomi Lomi', 'Prenatal Massage', 'Couples'], ['Trigger Point', 'Myofascial Release', 'Craniosacral', 'Lymphatic']],
    priceRanges: ['$', '$', '$$', '$$'],
  },
  'performance': {
    names: ['Peak Performance Center', 'Biohacking Lab', 'Executive Wellness Hub', 'Performance Coaching Studio', 'Optimize Performance', 'Human Upgrade Center', 'Longevity Clinic', 'Mind-Body Performance'],
    descriptions: [
      'Performance coaching center combining physical training, mental coaching, and biometric optimization.',
      'Executive wellness facility offering science-backed performance optimization and stress management.',
      'Holistic performance center for professionals seeking peak physical and mental performance.',
      'Advanced biohacking and performance center with cutting-edge recovery and optimization technologies.',
    ],
    highlights: [['Executive Coaching', 'Biometric Testing', 'Recovery Protocols', 'Mental Performance'], ['Sleep Optimization', 'Stress Management', 'Nutrition Science', 'Longevity'], ['Cold Exposure', 'Neurofeedback', 'IV Therapy', 'Hyperbaric'], ['Heart Rate Variability', 'Cognitive Training', 'Breathwork', 'Red Light Therapy']],
    priceRanges: ['$$$', '$$$$', '$$$$', '$$$$'],
  },
};

// Deterministic hash for consistent generation
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateProvidersForCity(city: WellnessCity): WellnessProvider[] {
  const providers: WellnessProvider[] = [];
  const categories: WellnessCategory[] = ['gym', 'spa', 'yoga', 'private-gym', 'sauna', 'sports-testing', 'massage', 'performance'];

  categories.forEach((cat, catIdx) => {
    const template = PROVIDER_TEMPLATES[cat];
    const seed = hashCode(`${city.id}-${cat}`);
    const nameIdx = seed % template.names.length;
    const descIdx = seed % template.descriptions.length;
    const highlightIdx = seed % template.highlights.length;
    const priceIdx = seed % template.priceRanges.length;

    const rating = +(4.0 + ((seed % 10) / 10)).toFixed(1);
    const reviewCount = 50 + (seed % 5000);

    const commonLanguages = ['English'];
    if (['FR', 'MC'].includes(city.countryCode)) commonLanguages.push('French');
    if (['DE', 'AT', 'CH'].includes(city.countryCode)) commonLanguages.push('German');
    if (['ES'].includes(city.countryCode)) commonLanguages.push('Spanish');
    if (['IT'].includes(city.countryCode)) commonLanguages.push('Italian');
    if (['JP'].includes(city.countryCode)) commonLanguages.push('Japanese');
    if (['TH'].includes(city.countryCode)) commonLanguages.push('Thai');
    if (['PT'].includes(city.countryCode)) commonLanguages.push('Portuguese');
    if (['KR'].includes(city.countryCode)) commonLanguages.push('Korean');
    if (['CN', 'HK', 'MO', 'TW'].includes(city.countryCode)) commonLanguages.push('Mandarin');
    if (['AE', 'SA', 'QA', 'BH', 'KW', 'OM', 'JO', 'LB', 'MA', 'EG'].includes(city.countryCode)) commonLanguages.push('Arabic');
    if (['FI'].includes(city.countryCode)) commonLanguages.push('Finnish');
    if (['SE'].includes(city.countryCode)) commonLanguages.push('Swedish');
    if (['NL'].includes(city.countryCode)) commonLanguages.push('Dutch');
    if (['BR'].includes(city.countryCode)) commonLanguages.push('Portuguese');
    if (['MX', 'CO', 'AR', 'CL', 'PE', 'EC', 'UY', 'PY', 'BO'].includes(city.countryCode)) commonLanguages.push('Spanish');

    providers.push({
      id: `${city.id}-${cat}-${catIdx}`,
      name: `${template.names[nameIdx]} ${city.name}`,
      category: cat,
      city: city.name,
      country: city.country,
      countryCode: city.countryCode,
      rating: Math.min(rating, 4.9),
      reviewCount,
      address: `Central ${city.name}`,
      website: undefined,
      priceRange: template.priceRanges[priceIdx],
      description: template.descriptions[descIdx],
      highlights: template.highlights[highlightIdx],
      languages: commonLanguages.slice(0, 3),
      isHintsa: false,
    });
  });

  return providers;
}

// Featured Hintsa entries (only these 4 cities)
const HINTSA_PROVIDERS: WellnessProvider[] = [
  { id: 'hintsa-helsinki', name: 'Hintsa Performance HQ', category: 'performance', city: 'Helsinki', country: 'Finland', countryCode: 'FI', rating: 4.9, reviewCount: 320, address: 'Eteläesplanadi, Helsinki', website: 'https://www.hintsa.com', priceRange: '$$$$', description: 'Global headquarters. The original science-backed performance coaching methodology used by F1 drivers.', highlights: ['Headquarters', 'Full Assessment', 'Research-Backed', 'Elite Athletes'], languages: ['English', 'Finnish', 'Swedish'], isHintsa: true },
  { id: 'hintsa-london', name: 'Hintsa Performance', category: 'performance', city: 'London', country: 'United Kingdom', countryCode: 'GB', rating: 4.9, reviewCount: 245, address: 'Mayfair, London', website: 'https://www.hintsa.com', priceRange: '$$$$', description: 'World-class human performance coaching for F1 drivers and C-suite executives.', highlights: ['F1 Performance Coaching', 'Executive Wellbeing', 'Sleep Optimization', 'Stress Management'], languages: ['English', 'Finnish', 'French'], isHintsa: true },
  { id: 'hintsa-zurich', name: 'Hintsa Performance', category: 'performance', city: 'Zurich', country: 'Switzerland', countryCode: 'CH', rating: 4.9, reviewCount: 189, address: 'Bahnhofstrasse, Zurich', website: 'https://www.hintsa.com', priceRange: '$$$$', description: 'Elite performance coaching. Science-based approach to optimize your physical, mental and emotional performance.', highlights: ['CEO Coaching', 'Biometric Testing', 'Recovery Protocols', 'Mental Performance'], languages: ['English', 'German', 'French'], isHintsa: true },
  { id: 'hintsa-dubai', name: 'Hintsa Performance', category: 'performance', city: 'Dubai', country: 'UAE', countryCode: 'AE', rating: 4.9, reviewCount: 156, address: 'DIFC, Dubai', website: 'https://www.hintsa.com', priceRange: '$$$$', description: 'Peak performance and wellbeing coaching for high-performers and athletes.', highlights: ['Athletic Performance', 'Corporate Wellness', 'Biohacking', 'Longevity'], languages: ['English', 'Arabic'], isHintsa: true },
];

// Generate all providers
export const SAMPLE_PROVIDERS: WellnessProvider[] = (() => {
  const allProviders: WellnessProvider[] = [...HINTSA_PROVIDERS];
  WELLNESS_CITIES.forEach(city => {
    // Skip generating 'performance' for Hintsa cities to avoid duplicates
    const cityProviders = generateProvidersForCity(city);
    const hintsaCities = ['Helsinki', 'London', 'Zurich', 'Dubai'];
    if (hintsaCities.includes(city.name)) {
      allProviders.push(...cityProviders.filter(p => p.category !== 'performance'));
    } else {
      allProviders.push(...cityProviders);
    }
  });
  return allProviders;
})();

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
