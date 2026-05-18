/**
 * SuperNomad Fine Dining — Top 100 cities for Michelin / World's 50 Best / La Liste / Gault & Millau.
 * Curated by global star density + reservation difficulty. Used by FineDiningHub.
 * leadTimeWeeks = typical advance notice required for top tables in this city.
 */

export interface FineDiningCity {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  region: 'Europe' | 'Asia' | 'Americas' | 'MEA' | 'Oceania';
  michelinStarsTotal: number; // approx total stars in the city across all restaurants
  threeStarCount: number;
  worlds50Best?: number; // entries on World's 50 Best Restaurants list
  leadTimeWeeks: number; // typical advance reservation window for top tables
  tier: 'legendary' | 'capital' | 'emerging';
  michelinGuideSlug?: string; // path slug on guide.michelin.com (lowercased)
}

export const FINE_DINING_CITIES: FineDiningCity[] = [
  // Europe
  { id: 'paris', city: 'Paris', country: 'France', countryCode: 'FR', region: 'Europe', michelinStarsTotal: 134, threeStarCount: 10, worlds50Best: 4, leadTimeWeeks: 12, tier: 'legendary', michelinGuideSlug: 'fr/ile-de-france/paris/restaurants' },
  { id: 'lyon', city: 'Lyon', country: 'France', countryCode: 'FR', region: 'Europe', michelinStarsTotal: 25, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital', michelinGuideSlug: 'fr/auvergne-rhone-alpes/lyon/restaurants' },
  { id: 'monaco', city: 'Monaco', country: 'Monaco', countryCode: 'MC', region: 'Europe', michelinStarsTotal: 12, threeStarCount: 1, leadTimeWeeks: 8, tier: 'capital' },
  { id: 'london', city: 'London', country: 'United Kingdom', countryCode: 'GB', region: 'Europe', michelinStarsTotal: 84, threeStarCount: 4, worlds50Best: 3, leadTimeWeeks: 10, tier: 'legendary', michelinGuideSlug: 'gb/greater-london/london/restaurants' },
  { id: 'edinburgh', city: 'Edinburgh', country: 'United Kingdom', countryCode: 'GB', region: 'Europe', michelinStarsTotal: 6, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'copenhagen', city: 'Copenhagen', country: 'Denmark', countryCode: 'DK', region: 'Europe', michelinStarsTotal: 19, threeStarCount: 2, worlds50Best: 3, leadTimeWeeks: 16, tier: 'legendary' },
  { id: 'stockholm', city: 'Stockholm', country: 'Sweden', countryCode: 'SE', region: 'Europe', michelinStarsTotal: 12, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'oslo', city: 'Oslo', country: 'Norway', countryCode: 'NO', region: 'Europe', michelinStarsTotal: 9, threeStarCount: 1, leadTimeWeeks: 8, tier: 'capital' },
  { id: 'helsinki', city: 'Helsinki', country: 'Finland', countryCode: 'FI', region: 'Europe', michelinStarsTotal: 7, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'reykjavik', city: 'Reykjavík', country: 'Iceland', countryCode: 'IS', region: 'Europe', michelinStarsTotal: 2, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'amsterdam', city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', region: 'Europe', michelinStarsTotal: 21, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'rotterdam', city: 'Rotterdam', country: 'Netherlands', countryCode: 'NL', region: 'Europe', michelinStarsTotal: 7, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'brussels', city: 'Brussels', country: 'Belgium', countryCode: 'BE', region: 'Europe', michelinStarsTotal: 15, threeStarCount: 0, leadTimeWeeks: 4, tier: 'capital' },
  { id: 'antwerp', city: 'Antwerp', country: 'Belgium', countryCode: 'BE', region: 'Europe', michelinStarsTotal: 9, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'luxembourg', city: 'Luxembourg', country: 'Luxembourg', countryCode: 'LU', region: 'Europe', michelinStarsTotal: 11, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'berlin', city: 'Berlin', country: 'Germany', countryCode: 'DE', region: 'Europe', michelinStarsTotal: 31, threeStarCount: 2, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'munich', city: 'Munich', country: 'Germany', countryCode: 'DE', region: 'Europe', michelinStarsTotal: 16, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'hamburg', city: 'Hamburg', country: 'Germany', countryCode: 'DE', region: 'Europe', michelinStarsTotal: 13, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'frankfurt', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', region: 'Europe', michelinStarsTotal: 11, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'cologne', city: 'Cologne', country: 'Germany', countryCode: 'DE', region: 'Europe', michelinStarsTotal: 8, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'vienna', city: 'Vienna', country: 'Austria', countryCode: 'AT', region: 'Europe', michelinStarsTotal: 14, threeStarCount: 0, leadTimeWeeks: 4, tier: 'capital' },
  { id: 'salzburg', city: 'Salzburg', country: 'Austria', countryCode: 'AT', region: 'Europe', michelinStarsTotal: 5, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'zurich', city: 'Zürich', country: 'Switzerland', countryCode: 'CH', region: 'Europe', michelinStarsTotal: 17, threeStarCount: 0, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'geneva', city: 'Geneva', country: 'Switzerland', countryCode: 'CH', region: 'Europe', michelinStarsTotal: 10, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'basel', city: 'Basel', country: 'Switzerland', countryCode: 'CH', region: 'Europe', michelinStarsTotal: 6, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'milan', city: 'Milan', country: 'Italy', countryCode: 'IT', region: 'Europe', michelinStarsTotal: 25, threeStarCount: 2, worlds50Best: 1, leadTimeWeeks: 8, tier: 'legendary' },
  { id: 'rome', city: 'Rome', country: 'Italy', countryCode: 'IT', region: 'Europe', michelinStarsTotal: 21, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'florence', city: 'Florence', country: 'Italy', countryCode: 'IT', region: 'Europe', michelinStarsTotal: 12, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'venice', city: 'Venice', country: 'Italy', countryCode: 'IT', region: 'Europe', michelinStarsTotal: 9, threeStarCount: 0, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'naples', city: 'Naples', country: 'Italy', countryCode: 'IT', region: 'Europe', michelinStarsTotal: 5, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'turin', city: 'Turin', country: 'Italy', countryCode: 'IT', region: 'Europe', michelinStarsTotal: 7, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'madrid', city: 'Madrid', country: 'Spain', countryCode: 'ES', region: 'Europe', michelinStarsTotal: 30, threeStarCount: 3, worlds50Best: 2, leadTimeWeeks: 8, tier: 'legendary' },
  { id: 'barcelona', city: 'Barcelona', country: 'Spain', countryCode: 'ES', region: 'Europe', michelinStarsTotal: 31, threeStarCount: 3, worlds50Best: 2, leadTimeWeeks: 10, tier: 'legendary' },
  { id: 'san-sebastian', city: 'San Sebastián', country: 'Spain', countryCode: 'ES', region: 'Europe', michelinStarsTotal: 19, threeStarCount: 3, worlds50Best: 2, leadTimeWeeks: 16, tier: 'legendary' },
  { id: 'bilbao', city: 'Bilbao', country: 'Spain', countryCode: 'ES', region: 'Europe', michelinStarsTotal: 10, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'valencia', city: 'Valencia', country: 'Spain', countryCode: 'ES', region: 'Europe', michelinStarsTotal: 11, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'lisbon', city: 'Lisbon', country: 'Portugal', countryCode: 'PT', region: 'Europe', michelinStarsTotal: 13, threeStarCount: 0, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'porto', city: 'Porto', country: 'Portugal', countryCode: 'PT', region: 'Europe', michelinStarsTotal: 7, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'athens', city: 'Athens', country: 'Greece', countryCode: 'GR', region: 'Europe', michelinStarsTotal: 7, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'istanbul', city: 'Istanbul', country: 'Türkiye', countryCode: 'TR', region: 'Europe', michelinStarsTotal: 10, threeStarCount: 0, worlds50Best: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'dublin', city: 'Dublin', country: 'Ireland', countryCode: 'IE', region: 'Europe', michelinStarsTotal: 9, threeStarCount: 0, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'prague', city: 'Prague', country: 'Czechia', countryCode: 'CZ', region: 'Europe', michelinStarsTotal: 4, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'warsaw', city: 'Warsaw', country: 'Poland', countryCode: 'PL', region: 'Europe', michelinStarsTotal: 5, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'krakow', city: 'Kraków', country: 'Poland', countryCode: 'PL', region: 'Europe', michelinStarsTotal: 3, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'budapest', city: 'Budapest', country: 'Hungary', countryCode: 'HU', region: 'Europe', michelinStarsTotal: 7, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },

  // Asia
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', countryCode: 'JP', region: 'Asia', michelinStarsTotal: 263, threeStarCount: 12, worlds50Best: 2, leadTimeWeeks: 12, tier: 'legendary', michelinGuideSlug: 'jp/en/kanto/tokyo/restaurants' },
  { id: 'kyoto', city: 'Kyoto', country: 'Japan', countryCode: 'JP', region: 'Asia', michelinStarsTotal: 105, threeStarCount: 7, leadTimeWeeks: 16, tier: 'legendary' },
  { id: 'osaka', city: 'Osaka', country: 'Japan', countryCode: 'JP', region: 'Asia', michelinStarsTotal: 96, threeStarCount: 3, leadTimeWeeks: 10, tier: 'legendary' },
  { id: 'nagoya', city: 'Nagoya', country: 'Japan', countryCode: 'JP', region: 'Asia', michelinStarsTotal: 25, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'fukuoka', city: 'Fukuoka', country: 'Japan', countryCode: 'JP', region: 'Asia', michelinStarsTotal: 18, threeStarCount: 0, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'sapporo', city: 'Sapporo', country: 'Japan', countryCode: 'JP', region: 'Asia', michelinStarsTotal: 12, threeStarCount: 0, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'hong-kong', city: 'Hong Kong', country: 'Hong Kong SAR', countryCode: 'HK', region: 'Asia', michelinStarsTotal: 90, threeStarCount: 7, worlds50Best: 2, leadTimeWeeks: 10, tier: 'legendary' },
  { id: 'macau', city: 'Macau', country: 'Macau SAR', countryCode: 'MO', region: 'Asia', michelinStarsTotal: 21, threeStarCount: 2, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', countryCode: 'SG', region: 'Asia', michelinStarsTotal: 51, threeStarCount: 3, worlds50Best: 3, leadTimeWeeks: 8, tier: 'legendary' },
  { id: 'shanghai', city: 'Shanghai', country: 'China', countryCode: 'CN', region: 'Asia', michelinStarsTotal: 51, threeStarCount: 2, worlds50Best: 2, leadTimeWeeks: 8, tier: 'legendary' },
  { id: 'beijing', city: 'Beijing', country: 'China', countryCode: 'CN', region: 'Asia', michelinStarsTotal: 30, threeStarCount: 2, worlds50Best: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'guangzhou', city: 'Guangzhou', country: 'China', countryCode: 'CN', region: 'Asia', michelinStarsTotal: 19, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'chengdu', city: 'Chengdu', country: 'China', countryCode: 'CN', region: 'Asia', michelinStarsTotal: 11, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'shenzhen', city: 'Shenzhen', country: 'China', countryCode: 'CN', region: 'Asia', michelinStarsTotal: 8, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'taipei', city: 'Taipei', country: 'Taiwan', countryCode: 'TW', region: 'Asia', michelinStarsTotal: 39, threeStarCount: 1, worlds50Best: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', countryCode: 'KR', region: 'Asia', michelinStarsTotal: 46, threeStarCount: 2, worlds50Best: 1, leadTimeWeeks: 8, tier: 'legendary' },
  { id: 'busan', city: 'Busan', country: 'South Korea', countryCode: 'KR', region: 'Asia', michelinStarsTotal: 10, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'bangkok', city: 'Bangkok', country: 'Thailand', countryCode: 'TH', region: 'Asia', michelinStarsTotal: 35, threeStarCount: 1, worlds50Best: 2, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'chiang-mai', city: 'Chiang Mai', country: 'Thailand', countryCode: 'TH', region: 'Asia', michelinStarsTotal: 5, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'phuket', city: 'Phuket', country: 'Thailand', countryCode: 'TH', region: 'Asia', michelinStarsTotal: 4, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'kuala-lumpur', city: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', region: 'Asia', michelinStarsTotal: 7, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'penang', city: 'Penang', country: 'Malaysia', countryCode: 'MY', region: 'Asia', michelinStarsTotal: 5, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'jakarta', city: 'Jakarta', country: 'Indonesia', countryCode: 'ID', region: 'Asia', michelinStarsTotal: 0, threeStarCount: 0, worlds50Best: 1, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'bali', city: 'Bali', country: 'Indonesia', countryCode: 'ID', region: 'Asia', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 6, tier: 'emerging' },
  { id: 'manila', city: 'Manila', country: 'Philippines', countryCode: 'PH', region: 'Asia', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'ho-chi-minh', city: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN', region: 'Asia', michelinStarsTotal: 7, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'hanoi', city: 'Hanoi', country: 'Vietnam', countryCode: 'VN', region: 'Asia', michelinStarsTotal: 5, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'mumbai', city: 'Mumbai', country: 'India', countryCode: 'IN', region: 'Asia', michelinStarsTotal: 0, threeStarCount: 0, worlds50Best: 1, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'delhi', city: 'Delhi', country: 'India', countryCode: 'IN', region: 'Asia', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'bengaluru', city: 'Bengaluru', country: 'India', countryCode: 'IN', region: 'Asia', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 3, tier: 'emerging' },

  // Americas
  { id: 'new-york', city: 'New York', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 75, threeStarCount: 5, worlds50Best: 4, leadTimeWeeks: 10, tier: 'legendary', michelinGuideSlug: 'us/en/new-york-state/new-york/restaurants' },
  { id: 'los-angeles', city: 'Los Angeles', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 27, threeStarCount: 1, leadTimeWeeks: 8, tier: 'capital' },
  { id: 'san-francisco', city: 'San Francisco', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 41, threeStarCount: 3, worlds50Best: 1, leadTimeWeeks: 12, tier: 'legendary' },
  { id: 'chicago', city: 'Chicago', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 24, threeStarCount: 2, worlds50Best: 1, leadTimeWeeks: 8, tier: 'capital' },
  { id: 'washington-dc', city: 'Washington DC', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 16, threeStarCount: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'miami', city: 'Miami', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 14, threeStarCount: 0, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'orlando', city: 'Orlando', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 6, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'atlanta', city: 'Atlanta', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 7, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'boston', city: 'Boston', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'seattle', city: 'Seattle', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 6, tier: 'emerging' },
  { id: 'las-vegas', city: 'Las Vegas', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'napa', city: 'Napa Valley', country: 'United States', countryCode: 'US', region: 'Americas', michelinStarsTotal: 14, threeStarCount: 2, leadTimeWeeks: 16, tier: 'legendary' },
  { id: 'toronto', city: 'Toronto', country: 'Canada', countryCode: 'CA', region: 'Americas', michelinStarsTotal: 14, threeStarCount: 0, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'vancouver', city: 'Vancouver', country: 'Canada', countryCode: 'CA', region: 'Americas', michelinStarsTotal: 8, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'montreal', city: 'Montreal', country: 'Canada', countryCode: 'CA', region: 'Americas', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'mexico-city', city: 'Mexico City', country: 'Mexico', countryCode: 'MX', region: 'Americas', michelinStarsTotal: 18, threeStarCount: 0, worlds50Best: 2, leadTimeWeeks: 10, tier: 'legendary' },
  { id: 'oaxaca', city: 'Oaxaca', country: 'Mexico', countryCode: 'MX', region: 'Americas', michelinStarsTotal: 3, threeStarCount: 0, worlds50Best: 1, leadTimeWeeks: 8, tier: 'capital' },
  { id: 'monterrey', city: 'Monterrey', country: 'Mexico', countryCode: 'MX', region: 'Americas', michelinStarsTotal: 4, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'lima', city: 'Lima', country: 'Peru', countryCode: 'PE', region: 'Americas', michelinStarsTotal: 0, threeStarCount: 0, worlds50Best: 4, leadTimeWeeks: 12, tier: 'legendary' },
  { id: 'bogota', city: 'Bogotá', country: 'Colombia', countryCode: 'CO', region: 'Americas', michelinStarsTotal: 0, threeStarCount: 0, worlds50Best: 1, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'sao-paulo', city: 'São Paulo', country: 'Brazil', countryCode: 'BR', region: 'Americas', michelinStarsTotal: 0, threeStarCount: 0, worlds50Best: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'rio-de-janeiro', city: 'Rio de Janeiro', country: 'Brazil', countryCode: 'BR', region: 'Americas', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'buenos-aires', city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', region: 'Americas', michelinStarsTotal: 8, threeStarCount: 0, worlds50Best: 2, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'santiago', city: 'Santiago', country: 'Chile', countryCode: 'CL', region: 'Americas', michelinStarsTotal: 0, threeStarCount: 0, worlds50Best: 1, leadTimeWeeks: 4, tier: 'emerging' },

  // Middle East & Africa
  { id: 'dubai', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', region: 'MEA', michelinStarsTotal: 19, threeStarCount: 0, worlds50Best: 2, leadTimeWeeks: 8, tier: 'capital' },
  { id: 'abu-dhabi', city: 'Abu Dhabi', country: 'United Arab Emirates', countryCode: 'AE', region: 'MEA', michelinStarsTotal: 5, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'doha', city: 'Doha', country: 'Qatar', countryCode: 'QA', region: 'MEA', michelinStarsTotal: 3, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'riyadh', city: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', region: 'MEA', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'tel-aviv', city: 'Tel Aviv', country: 'Israel', countryCode: 'IL', region: 'MEA', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'marrakech', city: 'Marrakech', country: 'Morocco', countryCode: 'MA', region: 'MEA', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'cape-town', city: 'Cape Town', country: 'South Africa', countryCode: 'ZA', region: 'MEA', michelinStarsTotal: 0, threeStarCount: 0, worlds50Best: 1, leadTimeWeeks: 6, tier: 'capital' },
  { id: 'johannesburg', city: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', region: 'MEA', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },

  // Oceania
  { id: 'sydney', city: 'Sydney', country: 'Australia', countryCode: 'AU', region: 'Oceania', michelinStarsTotal: 0, threeStarCount: 0, worlds50Best: 1, leadTimeWeeks: 8, tier: 'capital' },
  { id: 'melbourne', city: 'Melbourne', country: 'Australia', countryCode: 'AU', region: 'Oceania', michelinStarsTotal: 0, threeStarCount: 0, worlds50Best: 1, leadTimeWeeks: 8, tier: 'capital' },
  { id: 'brisbane', city: 'Brisbane', country: 'Australia', countryCode: 'AU', region: 'Oceania', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'perth', city: 'Perth', country: 'Australia', countryCode: 'AU', region: 'Oceania', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
  { id: 'auckland', city: 'Auckland', country: 'New Zealand', countryCode: 'NZ', region: 'Oceania', michelinStarsTotal: 0, threeStarCount: 0, leadTimeWeeks: 4, tier: 'emerging' },
];

export const TOP_100_COUNT = FINE_DINING_CITIES.length;
