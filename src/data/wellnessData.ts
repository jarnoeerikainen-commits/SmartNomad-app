import { WellnessCity, WellnessProvider } from '@/types/wellness';

export const WELLNESS_CITIES: WellnessCity[] = [
  // Europe
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

  // North America
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

  // Asia Pacific
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

  // Middle East
  { id: 'dubai', name: 'Dubai', country: 'UAE', countryCode: 'AE', region: 'Middle East', latitude: 25.2048, longitude: 55.2708, providerCount: 45 },
  { id: 'abu-dhabi', name: 'Abu Dhabi', country: 'UAE', countryCode: 'AE', region: 'Middle East', latitude: 24.4539, longitude: 54.3773, providerCount: 30 },
  { id: 'doha', name: 'Doha', country: 'Qatar', countryCode: 'QA', region: 'Middle East', latitude: 25.2854, longitude: 51.531, providerCount: 25 },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', region: 'Middle East', latitude: 24.7136, longitude: 46.6753, providerCount: 22 },
  { id: 'tel-aviv', name: 'Tel Aviv', country: 'Israel', countryCode: 'IL', region: 'Middle East', latitude: 32.0853, longitude: 34.7818, providerCount: 28 },

  // Oceania
  { id: 'sydney', name: 'Sydney', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -33.8688, longitude: 151.2093, providerCount: 40 },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -37.8136, longitude: 144.9631, providerCount: 38 },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', countryCode: 'NZ', region: 'Oceania', latitude: -36.8485, longitude: 174.7633, providerCount: 22 },
  { id: 'brisbane', name: 'Brisbane', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -27.4698, longitude: 153.0251, providerCount: 25 },
  { id: 'gold-coast', name: 'Gold Coast', country: 'Australia', countryCode: 'AU', region: 'Oceania', latitude: -28.0167, longitude: 153.4, providerCount: 20 },

  // Africa
  { id: 'cape-town', name: 'Cape Town', country: 'South Africa', countryCode: 'ZA', region: 'Africa', latitude: -33.9249, longitude: 18.4241, providerCount: 22 },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', countryCode: 'KE', region: 'Africa', latitude: -1.2921, longitude: 36.8219, providerCount: 15 },
  { id: 'marrakech', name: 'Marrakech', country: 'Morocco', countryCode: 'MA', region: 'Africa', latitude: 31.6295, longitude: -7.9811, providerCount: 25 },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', countryCode: 'EG', region: 'Africa', latitude: 30.0444, longitude: 31.2357, providerCount: 18 },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', countryCode: 'NG', region: 'Africa', latitude: 6.5244, longitude: 3.3792, providerCount: 14 },

  // South America
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', countryCode: 'BR', region: 'South America', latitude: -23.5505, longitude: -46.6333, providerCount: 35 },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', region: 'South America', latitude: -34.6037, longitude: -58.3816, providerCount: 28 },
  { id: 'bogota', name: 'Bogotá', country: 'Colombia', countryCode: 'CO', region: 'South America', latitude: 4.711, longitude: -74.0721, providerCount: 22 },
  { id: 'lima', name: 'Lima', country: 'Peru', countryCode: 'PE', region: 'South America', latitude: -12.0464, longitude: -77.0428, providerCount: 18 },
  { id: 'medellin', name: 'Medellín', country: 'Colombia', countryCode: 'CO', region: 'South America', latitude: 6.2476, longitude: -75.5658, providerCount: 20 },
  { id: 'santiago', name: 'Santiago', country: 'Chile', countryCode: 'CL', region: 'South America', latitude: -33.4489, longitude: -70.6693, providerCount: 22 },
  { id: 'rio', name: 'Rio de Janeiro', country: 'Brazil', countryCode: 'BR', region: 'South America', latitude: -22.9068, longitude: -43.1729, providerCount: 30 },
  { id: 'playa-del-carmen', name: 'Playa del Carmen', country: 'Mexico', countryCode: 'MX', region: 'North America', latitude: 20.6296, longitude: -87.0739, providerCount: 20 },

  // More Europe
  { id: 'porto', name: 'Porto', country: 'Portugal', countryCode: 'PT', region: 'Europe', latitude: 41.1579, longitude: -8.6291, providerCount: 18 },
  { id: 'tallinn', name: 'Tallinn', country: 'Estonia', countryCode: 'EE', region: 'Europe', latitude: 59.437, longitude: 24.7536, providerCount: 16 },
  { id: 'budapest', name: 'Budapest', country: 'Hungary', countryCode: 'HU', region: 'Europe', latitude: 47.4979, longitude: 19.0402, providerCount: 28 },
  { id: 'athens', name: 'Athens', country: 'Greece', countryCode: 'GR', region: 'Europe', latitude: 37.9838, longitude: 23.7275, providerCount: 20 },
  { id: 'split', name: 'Split', country: 'Croatia', countryCode: 'HR', region: 'Europe', latitude: 43.5081, longitude: 16.4402, providerCount: 15 },
  { id: 'tbilisi', name: 'Tbilisi', country: 'Georgia', countryCode: 'GE', region: 'Europe', latitude: 41.7151, longitude: 44.8271, providerCount: 14 },

  // More Asia
  { id: 'chiang-mai', name: 'Chiang Mai', country: 'Thailand', countryCode: 'TH', region: 'Asia Pacific', latitude: 18.7883, longitude: 98.9853, providerCount: 35 },
  { id: 'ho-chi-minh', name: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN', region: 'Asia Pacific', latitude: 10.8231, longitude: 106.6297, providerCount: 28 },
  { id: 'hanoi', name: 'Hanoi', country: 'Vietnam', countryCode: 'VN', region: 'Asia Pacific', latitude: 21.0278, longitude: 105.8342, providerCount: 22 },
  { id: 'manila', name: 'Manila', country: 'Philippines', countryCode: 'PH', region: 'Asia Pacific', latitude: 14.5995, longitude: 120.9842, providerCount: 20 },
  { id: 'osaka', name: 'Osaka', country: 'Japan', countryCode: 'JP', region: 'Asia Pacific', latitude: 34.6937, longitude: 135.5023, providerCount: 30 },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', countryCode: 'JP', region: 'Asia Pacific', latitude: 35.0116, longitude: 135.7681, providerCount: 25 },
  { id: 'phuket', name: 'Phuket', country: 'Thailand', countryCode: 'TH', region: 'Asia Pacific', latitude: 7.8804, longitude: 98.3923, providerCount: 32 },

  // More cities to reach 100
  { id: 'florence', name: 'Florence', country: 'Italy', countryCode: 'IT', region: 'Europe', latitude: 43.7696, longitude: 11.2558, providerCount: 20 },
  { id: 'nice', name: 'Nice', country: 'France', countryCode: 'FR', region: 'Europe', latitude: 43.7102, longitude: 7.262, providerCount: 22 },
  { id: 'monaco', name: 'Monaco', country: 'Monaco', countryCode: 'MC', region: 'Europe', latitude: 43.7384, longitude: 7.4246, providerCount: 18 },
  { id: 'geneva', name: 'Geneva', country: 'Switzerland', countryCode: 'CH', region: 'Europe', latitude: 46.2044, longitude: 6.1432, providerCount: 20 },
  { id: 'austin', name: 'Scottsdale', country: 'United States', countryCode: 'US', region: 'North America', latitude: 33.4942, longitude: -111.9261, providerCount: 22 },
  { id: 'honolulu', name: 'Honolulu', country: 'United States', countryCode: 'US', region: 'North America', latitude: 21.3069, longitude: -157.8583, providerCount: 28 },
  { id: 'boston', name: 'Boston', country: 'United States', countryCode: 'US', region: 'North America', latitude: 42.3601, longitude: -71.0589, providerCount: 30 },
  { id: 'seattle', name: 'Seattle', country: 'United States', countryCode: 'US', region: 'North America', latitude: 47.6062, longitude: -122.3321, providerCount: 28 },
  { id: 'washington-dc', name: 'Washington D.C.', country: 'United States', countryCode: 'US', region: 'North America', latitude: 38.9072, longitude: -77.0369, providerCount: 30 },
  { id: 'montreal', name: 'Montreal', country: 'Canada', countryCode: 'CA', region: 'North America', latitude: 45.5017, longitude: -73.5673, providerCount: 25 },
];

export const WELLNESS_REGIONS = [...new Set(WELLNESS_CITIES.map(c => c.region))];

export const SAMPLE_PROVIDERS: WellnessProvider[] = [
  // Hintsa Performance (featured)
  { id: 'hintsa-london', name: 'Hintsa Performance', category: 'performance', city: 'London', country: 'United Kingdom', countryCode: 'GB', rating: 4.9, reviewCount: 245, address: 'Mayfair, London', phone: '+44 20 7123 4567', website: 'https://www.hintsa.com', priceRange: '$$$$', description: 'World-class human performance coaching combining science-based methods for physical, mental, and emotional wellbeing. Used by F1 drivers and C-suite executives.', highlights: ['F1 Performance Coaching', 'Executive Wellbeing', 'Sleep Optimization', 'Stress Management', 'Nutrition Science'], languages: ['English', 'Finnish', 'French'], isHintsa: true },
  { id: 'hintsa-zurich', name: 'Hintsa Performance', category: 'performance', city: 'Zurich', country: 'Switzerland', countryCode: 'CH', rating: 4.9, reviewCount: 189, address: 'Bahnhofstrasse, Zurich', website: 'https://www.hintsa.com', priceRange: '$$$$', description: 'Elite performance coaching. Science-based approach to optimize your physical, mental and emotional performance.', highlights: ['CEO Coaching', 'Biometric Testing', 'Recovery Protocols', 'Mental Performance'], languages: ['English', 'German', 'French'], isHintsa: true },
  { id: 'hintsa-dubai', name: 'Hintsa Performance', category: 'performance', city: 'Dubai', country: 'UAE', countryCode: 'AE', rating: 4.9, reviewCount: 156, address: 'DIFC, Dubai', website: 'https://www.hintsa.com', priceRange: '$$$$', description: 'Peak performance and wellbeing coaching for high-performers and athletes.', highlights: ['Athletic Performance', 'Corporate Wellness', 'Biohacking', 'Longevity'], languages: ['English', 'Arabic'], isHintsa: true },
  { id: 'hintsa-helsinki', name: 'Hintsa Performance HQ', category: 'performance', city: 'Helsinki', country: 'Finland', countryCode: 'FI', rating: 4.9, reviewCount: 320, address: 'Eteläesplanadi, Helsinki', website: 'https://www.hintsa.com', priceRange: '$$$$', description: 'Global headquarters. The original science-backed performance coaching methodology.', highlights: ['Headquarters', 'Full Assessment', 'Research-Backed', 'Elite Athletes'], languages: ['English', 'Finnish', 'Swedish'], isHintsa: true },

  // Sample gyms
  { id: 'equinox-ny', name: 'Equinox Hudson Yards', category: 'private-gym', city: 'New York', country: 'United States', countryCode: 'US', rating: 4.7, reviewCount: 1200, address: '35 Hudson Yards, New York, NY', website: 'https://www.equinox.com', priceRange: '$$$$', description: 'Ultra-premium fitness club with world-class equipment, personal training, and spa.', highlights: ['Rooftop Pool', 'Personal Training', 'Spa & Recovery', 'Luxury Amenities'], languages: ['English', 'Spanish'] },
  { id: 'third-space-london', name: 'Third Space', category: 'private-gym', city: 'London', country: 'United Kingdom', countryCode: 'GB', rating: 4.6, reviewCount: 890, address: 'Soho, London', website: 'https://www.thirdspace.london', priceRange: '$$$$', description: 'London\'s luxury health club. Medical-grade fitness with hypoxic chambers and cryotherapy.', highlights: ['Hypoxic Training', 'Cryotherapy', 'Swimming Pool', 'Boxing Ring'], languages: ['English'] },
  { id: 'barry-bootcamp-la', name: 'Barry\'s Los Angeles', category: 'gym', city: 'Los Angeles', country: 'United States', countryCode: 'US', rating: 4.5, reviewCount: 2100, address: 'West Hollywood, LA', website: 'https://www.barrys.com', priceRange: '$$$', description: 'High-intensity interval training in the Red Room. The best workout in the world.', highlights: ['HIIT Classes', 'Red Room Experience', 'Fuel Bar'], languages: ['English', 'Spanish'] },

  // Sample spas
  { id: 'aman-spa-tokyo', name: 'Aman Spa Tokyo', category: 'spa', city: 'Tokyo', country: 'Japan', countryCode: 'JP', rating: 4.9, reviewCount: 560, address: 'Otemachi, Tokyo', website: 'https://www.aman.com', priceRange: '$$$$', description: 'Aman\'s signature spa experience in the heart of Tokyo. Japanese wellness traditions meet modern luxury.', highlights: ['Onsen', 'Japanese Treatments', 'Meditation Room', 'City Views'], languages: ['English', 'Japanese'] },
  { id: 'so-spa-bangkok', name: 'SO SPA by Sofitel', category: 'spa', city: 'Bangkok', country: 'Thailand', countryCode: 'TH', rating: 4.7, reviewCount: 780, address: 'Sathorn, Bangkok', priceRange: '$$$', description: 'Thai-French luxury spa blending ancient Thai healing with French expertise.', highlights: ['Thai Massage', 'Herbal Treatments', 'Couples Suite', 'Pool Access'], languages: ['English', 'Thai'] },

  // Sample yoga
  { id: 'yoga-barn-bali', name: 'The Yoga Barn', category: 'yoga', city: 'Bali', country: 'Indonesia', countryCode: 'ID', rating: 4.8, reviewCount: 3400, address: 'Ubud, Bali', website: 'https://www.theyogabarn.com', priceRange: '$$', description: 'Iconic yoga retreat in the heart of Ubud. Daily classes, workshops, and healing sessions.', highlights: ['Open-Air Studio', 'Meditation', 'Sound Healing', 'Teacher Training'], languages: ['English', 'Indonesian'] },
  { id: 'yoga-studio-berlin', name: 'Spirit Yoga Berlin', category: 'yoga', city: 'Berlin', country: 'Germany', countryCode: 'DE', rating: 4.6, reviewCount: 620, address: 'Charlottenburg, Berlin', website: 'https://www.spirityoga.de', priceRange: '$$', description: 'Modern yoga studio offering Vinyasa, Yin, and Ashtanga in a minimalist space.', highlights: ['Heated Studio', 'Workshops', 'Online Classes', 'Community Events'], languages: ['English', 'German'] },

  // Sample saunas
  { id: 'loyly-helsinki', name: 'Löyly Helsinki', category: 'sauna', city: 'Helsinki', country: 'Finland', countryCode: 'FI', rating: 4.7, reviewCount: 4500, address: 'Hernesaarenranta, Helsinki', website: 'https://www.loylyhelsinki.fi', priceRange: '$$', description: 'Award-winning public sauna on the Helsinki waterfront. Authentic Finnish sauna culture at its finest.', highlights: ['Sea Swimming', 'Wood-Fired Sauna', 'Restaurant', 'Architecture'], languages: ['English', 'Finnish', 'Swedish'] },
  { id: 'rudas-budapest', name: 'Rudas Thermal Baths', category: 'sauna', city: 'Budapest', country: 'Hungary', countryCode: 'HU', rating: 4.6, reviewCount: 3200, address: 'Döbrentei tér, Budapest', priceRange: '$', description: 'Historic Turkish bath from the 16th century with rooftop pool and stunning views.', highlights: ['Thermal Waters', 'Rooftop Pool', 'Night Bathing', 'Historic Setting'], languages: ['English', 'Hungarian', 'German'] },

  // Sample sports testing
  { id: 'insep-paris', name: 'INSEP Performance Lab', category: 'sports-testing', city: 'Paris', country: 'France', countryCode: 'FR', rating: 4.8, reviewCount: 340, address: 'Bois de Vincennes, Paris', priceRange: '$$$$', description: 'France\'s national sports institute offering elite-level performance testing and analysis.', highlights: ['VO2 Max Testing', 'Body Composition', 'Biomechanics', 'Recovery Assessment'], languages: ['English', 'French'] },
  { id: 'gssi-chicago', name: 'Gatorade Sports Science Institute', category: 'sports-testing', city: 'Chicago', country: 'United States', countryCode: 'US', rating: 4.7, reviewCount: 280, address: 'Barrington, IL', priceRange: '$$$', description: 'World-renowned sports science facility for performance testing and nutrition optimization.', highlights: ['Sweat Testing', 'Performance Analytics', 'Nutrition Lab', 'Heat Acclimation'], languages: ['English'] },

  // Sample massage
  { id: 'wat-po-bangkok', name: 'Wat Pho Thai Massage School', category: 'massage', city: 'Bangkok', country: 'Thailand', countryCode: 'TH', rating: 4.8, reviewCount: 5600, address: 'Phra Nakhon, Bangkok', priceRange: '$', description: 'The birthplace of traditional Thai massage. Authentic treatments by certified practitioners.', highlights: ['Traditional Thai Massage', 'Herbal Compress', 'Foot Reflexology', 'Historic Temple'], languages: ['English', 'Thai', 'Chinese'] },
  { id: 'hammam-marrakech', name: 'Les Bains de Marrakech', category: 'massage', city: 'Marrakech', country: 'Morocco', countryCode: 'MA', rating: 4.7, reviewCount: 1800, address: 'Kasbah, Marrakech', priceRange: '$$', description: 'Luxury Moroccan hammam with traditional scrubs, massages, and beauty treatments.', highlights: ['Hammam Ritual', 'Argan Oil Massage', 'Couples Treatments', 'Private Rooms'], languages: ['English', 'French', 'Arabic'] },
];

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
