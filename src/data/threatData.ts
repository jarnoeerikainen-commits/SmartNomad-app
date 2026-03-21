import { ThreatIncident, WatchlistLocation, ThreatStatistics, ThreatCategory, ThreatSeverity } from '@/types/threat';

// ═══════════════════════════════════════════════════════════════
// SUPERNOMAD THREAT INTELLIGENCE DATABASE
// Sources: CNN, BBC, Reuters, AP, Al Jazeera, OSINT, US State Dept,
// UK FCDO, EU Advisory, NATO, UN OCHA, WorldMonitor.app,
// SOS International, Intelligence Fusion, ACLED, Global Terrorism DB,
// Stratfor, Jane's, Control Risks, Crisis24, Riskline, Max Security,
// Flashpoint, Recorded Future
// WHO, CDC, GDACS, NOAA, Interpol, Europol
// ═══════════════════════════════════════════════════════════════

interface CityDef {
  city: string;
  country: string;
  lat: number;
  lng: number;
  region: string;
}

// 200+ cities across all continents
const THREAT_CITIES: CityDef[] = [
  // ── EUROPE (40 cities) ──
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, region: 'Europe' },
  { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, region: 'Europe' },
  { city: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405, region: 'Europe' },
  { city: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, region: 'Europe' },
  { city: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, region: 'Europe' },
  { city: 'Barcelona', country: 'Spain', lat: 41.3874, lng: 2.1686, region: 'Europe' },
  { city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, region: 'Europe' },
  { city: 'Brussels', country: 'Belgium', lat: 50.8503, lng: 4.3517, region: 'Europe' },
  { city: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738, region: 'Europe' },
  { city: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417, region: 'Europe' },
  { city: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, region: 'Europe' },
  { city: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683, region: 'Europe' },
  { city: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, region: 'Europe' },
  { city: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384, region: 'Europe' },
  { city: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, region: 'Europe' },
  { city: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, region: 'Europe' },
  { city: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275, region: 'Europe' },
  { city: 'Warsaw', country: 'Poland', lat: 52.2297, lng: 21.0122, region: 'Europe' },
  { city: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378, region: 'Europe' },
  { city: 'Budapest', country: 'Hungary', lat: 47.4979, lng: 19.0402, region: 'Europe' },
  { city: 'Bucharest', country: 'Romania', lat: 44.4268, lng: 26.1025, region: 'Europe' },
  { city: 'Sofia', country: 'Bulgaria', lat: 42.6977, lng: 23.3219, region: 'Europe' },
  { city: 'Belgrade', country: 'Serbia', lat: 44.7866, lng: 20.4489, region: 'Europe' },
  { city: 'Zagreb', country: 'Croatia', lat: 45.815, lng: 15.9819, region: 'Europe' },
  { city: 'Tallinn', country: 'Estonia', lat: 59.437, lng: 24.7536, region: 'Europe' },
  { city: 'Riga', country: 'Latvia', lat: 56.9496, lng: 24.1052, region: 'Europe' },
  { city: 'Vilnius', country: 'Lithuania', lat: 54.6872, lng: 25.2797, region: 'Europe' },
  { city: 'Bratislava', country: 'Slovakia', lat: 48.1486, lng: 17.1077, region: 'Europe' },
  { city: 'Ljubljana', country: 'Slovenia', lat: 46.0569, lng: 14.5058, region: 'Europe' },
  { city: 'Reykjavik', country: 'Iceland', lat: 64.1466, lng: -21.9426, region: 'Europe' },
  { city: 'Milan', country: 'Italy', lat: 45.4642, lng: 9.19, region: 'Europe' },
  { city: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.582, region: 'Europe' },
  { city: 'Edinburgh', country: 'United Kingdom', lat: 55.9533, lng: -3.1883, region: 'Europe' },
  { city: 'Manchester', country: 'United Kingdom', lat: 53.4808, lng: -2.2426, region: 'Europe' },
  { city: 'Marseille', country: 'France', lat: 43.2965, lng: 5.3698, region: 'Europe' },
  { city: 'Nice', country: 'France', lat: 43.7102, lng: 7.262, region: 'Europe' },
  { city: 'Geneva', country: 'Switzerland', lat: 46.2044, lng: 6.1432, region: 'Europe' },
  { city: 'Monaco', country: 'Monaco', lat: 43.7384, lng: 7.4246, region: 'Europe' },
  { city: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, region: 'Europe' },
  { city: 'Ankara', country: 'Turkey', lat: 39.9334, lng: 32.8597, region: 'Europe' },

  // ── ASIA PACIFIC (45 cities) ──
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, region: 'Asia' },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, region: 'Asia' },
  { city: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694, region: 'Asia' },
  { city: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737, region: 'Asia' },
  { city: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, region: 'Asia' },
  { city: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.978, region: 'Asia' },
  { city: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, region: 'Asia' },
  { city: 'Kuala Lumpur', country: 'Malaysia', lat: 3.139, lng: 101.6869, region: 'Asia' },
  { city: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, region: 'Asia' },
  { city: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842, region: 'Asia' },
  { city: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297, region: 'Asia' },
  { city: 'Hanoi', country: 'Vietnam', lat: 21.0278, lng: 105.8342, region: 'Asia' },
  { city: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, region: 'Asia' },
  { city: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.209, region: 'Asia' },
  { city: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, region: 'Asia' },
  { city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, region: 'Asia' },
  { city: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lng: 79.8612, region: 'Asia' },
  { city: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, region: 'Asia' },
  { city: 'Kathmandu', country: 'Nepal', lat: 27.7172, lng: 85.324, region: 'Asia' },
  { city: 'Taipei', country: 'Taiwan', lat: 25.033, lng: 121.5654, region: 'Asia' },
  { city: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023, region: 'Asia' },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, region: 'Oceania' },
  { city: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, region: 'Oceania' },
  { city: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, region: 'Oceania' },
  { city: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605, region: 'Oceania' },
  { city: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251, region: 'Oceania' },
  { city: 'Phnom Penh', country: 'Cambodia', lat: 11.5564, lng: 104.9282, region: 'Asia' },
  { city: 'Vientiane', country: 'Laos', lat: 17.9757, lng: 102.6331, region: 'Asia' },
  { city: 'Ulaanbaatar', country: 'Mongolia', lat: 47.8864, lng: 106.9057, region: 'Asia' },
  { city: 'Islamabad', country: 'Pakistan', lat: 33.6844, lng: 73.0479, region: 'Asia' },
  { city: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011, region: 'Asia' },
  { city: 'Lahore', country: 'Pakistan', lat: 31.5204, lng: 74.3587, region: 'Asia' },
  { city: 'Chiang Mai', country: 'Thailand', lat: 18.7883, lng: 98.9853, region: 'Asia' },
  { city: 'Bali', country: 'Indonesia', lat: -8.3405, lng: 115.092, region: 'Asia' },
  { city: 'Phuket', country: 'Thailand', lat: 7.8804, lng: 98.3923, region: 'Asia' },
  { city: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639, region: 'Asia' },
  { city: 'Suva', country: 'Fiji', lat: -18.1416, lng: 178.4419, region: 'Oceania' },
  { city: 'Port Moresby', country: 'Papua New Guinea', lat: -6.3149, lng: 143.9556, region: 'Oceania' },
  { city: 'Almaty', country: 'Kazakhstan', lat: 43.2551, lng: 76.9126, region: 'Asia' },
  { city: 'Tashkent', country: 'Uzbekistan', lat: 41.2995, lng: 69.2401, region: 'Asia' },
  { city: 'Tbilisi', country: 'Georgia', lat: 41.7151, lng: 44.8271, region: 'Asia' },
  { city: 'Baku', country: 'Azerbaijan', lat: 40.4093, lng: 49.8671, region: 'Asia' },
  { city: 'Yerevan', country: 'Armenia', lat: 40.1792, lng: 44.4991, region: 'Asia' },
  { city: 'Bishkek', country: 'Kyrgyzstan', lat: 42.8746, lng: 74.5698, region: 'Asia' },
  { city: 'Dushanbe', country: 'Tajikistan', lat: 38.5598, lng: 68.7738, region: 'Asia' },

  // ── AMERICAS (40 cities) ──
  { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.006, region: 'Americas' },
  { city: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437, region: 'Americas' },
  { city: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194, region: 'Americas' },
  { city: 'Chicago', country: 'United States', lat: 41.8781, lng: -87.6298, region: 'Americas' },
  { city: 'Miami', country: 'United States', lat: 25.7617, lng: -80.1918, region: 'Americas' },
  { city: 'Washington DC', country: 'United States', lat: 38.9072, lng: -77.0369, region: 'Americas' },
  { city: 'Houston', country: 'United States', lat: 29.7604, lng: -95.3698, region: 'Americas' },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, region: 'Americas' },
  { city: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, region: 'Americas' },
  { city: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673, region: 'Americas' },
  { city: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, region: 'Americas' },
  { city: 'Cancún', country: 'Mexico', lat: 21.1619, lng: -86.8515, region: 'Americas' },
  { city: 'Guadalajara', country: 'Mexico', lat: 20.6597, lng: -103.3496, region: 'Americas' },
  { city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, region: 'Americas' },
  { city: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729, region: 'Americas' },
  { city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, region: 'Americas' },
  { city: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428, region: 'Americas' },
  { city: 'Bogotá', country: 'Colombia', lat: 4.711, lng: -74.0721, region: 'Americas' },
  { city: 'Medellín', country: 'Colombia', lat: 6.2476, lng: -75.5658, region: 'Americas' },
  { city: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693, region: 'Americas' },
  { city: 'Montevideo', country: 'Uruguay', lat: -34.9011, lng: -56.1645, region: 'Americas' },
  { city: 'Quito', country: 'Ecuador', lat: -0.1807, lng: -78.4678, region: 'Americas' },
  { city: 'La Paz', country: 'Bolivia', lat: -16.5, lng: -68.15, region: 'Americas' },
  { city: 'Havana', country: 'Cuba', lat: 23.1136, lng: -82.3666, region: 'Americas' },
  { city: 'Panama City', country: 'Panama', lat: 8.9824, lng: -79.5199, region: 'Americas' },
  { city: 'San José', country: 'Costa Rica', lat: 9.9281, lng: -84.0907, region: 'Americas' },
  { city: 'Guatemala City', country: 'Guatemala', lat: 14.6349, lng: -90.5069, region: 'Americas' },
  { city: 'Tegucigalpa', country: 'Honduras', lat: 14.0723, lng: -87.1921, region: 'Americas' },
  { city: 'San Salvador', country: 'El Salvador', lat: 13.6929, lng: -89.2182, region: 'Americas' },
  { city: 'Managua', country: 'Nicaragua', lat: 12.1149, lng: -86.2362, region: 'Americas' },
  { city: 'Kingston', country: 'Jamaica', lat: 18.0179, lng: -76.8099, region: 'Americas' },
  { city: 'Santo Domingo', country: 'Dominican Republic', lat: 18.4861, lng: -69.9312, region: 'Americas' },
  { city: 'Asunción', country: 'Paraguay', lat: -25.2637, lng: -57.5759, region: 'Americas' },
  { city: 'Caracas', country: 'Venezuela', lat: 10.4806, lng: -66.9036, region: 'Americas' },
  { city: 'Port of Spain', country: 'Trinidad and Tobago', lat: 10.6596, lng: -61.5086, region: 'Americas' },
  { city: 'Nassau', country: 'Bahamas', lat: 25.0343, lng: -77.3963, region: 'Americas' },
  { city: 'Bridgetown', country: 'Barbados', lat: 13.1132, lng: -59.5988, region: 'Americas' },
  { city: 'Denver', country: 'United States', lat: 39.7392, lng: -104.9903, region: 'Americas' },
  { city: 'Atlanta', country: 'United States', lat: 33.749, lng: -84.388, region: 'Americas' },
  { city: 'Seattle', country: 'United States', lat: 47.6062, lng: -122.3321, region: 'Americas' },

  // ── MIDDLE EAST (25 cities) ──
  { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, region: 'Middle East' },
  { city: 'Abu Dhabi', country: 'UAE', lat: 24.4539, lng: 54.3773, region: 'Middle East' },
  { city: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.531, region: 'Middle East' },
  { city: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, region: 'Middle East' },
  { city: 'Jeddah', country: 'Saudi Arabia', lat: 21.4858, lng: 39.1925, region: 'Middle East' },
  { city: 'Muscat', country: 'Oman', lat: 23.5859, lng: 58.4059, region: 'Middle East' },
  { city: 'Kuwait City', country: 'Kuwait', lat: 29.3759, lng: 47.9774, region: 'Middle East' },
  { city: 'Manama', country: 'Bahrain', lat: 26.2285, lng: 50.586, region: 'Middle East' },
  { city: 'Amman', country: 'Jordan', lat: 31.9454, lng: 35.9284, region: 'Middle East' },
  { city: 'Beirut', country: 'Lebanon', lat: 33.8938, lng: 35.5018, region: 'Middle East' },
  { city: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818, region: 'Middle East' },
  { city: 'Jerusalem', country: 'Israel', lat: 31.7683, lng: 35.2137, region: 'Middle East' },
  { city: 'Baghdad', country: 'Iraq', lat: 33.3128, lng: 44.3615, region: 'Middle East' },
  { city: 'Erbil', country: 'Iraq', lat: 36.191, lng: 44.0088, region: 'Middle East' },
  { city: 'Tehran', country: 'Iran', lat: 35.6892, lng: 51.389, region: 'Middle East' },
  { city: 'Damascus', country: 'Syria', lat: 33.5138, lng: 36.2765, region: 'Middle East' },
  { city: 'Sanaa', country: 'Yemen', lat: 15.3694, lng: 44.191, region: 'Middle East' },
  { city: 'Kabul', country: 'Afghanistan', lat: 34.5553, lng: 69.2075, region: 'Middle East' },
  { city: 'Nicosia', country: 'Cyprus', lat: 35.1856, lng: 33.3823, region: 'Middle East' },
  { city: 'Ramallah', country: 'Palestine', lat: 31.9038, lng: 35.2034, region: 'Middle East' },
  { city: 'Gaza City', country: 'Palestine', lat: 31.5, lng: 34.47, region: 'Middle East' },
  { city: 'Basra', country: 'Iraq', lat: 30.5085, lng: 47.7804, region: 'Middle East' },
  { city: 'Mosul', country: 'Iraq', lat: 36.34, lng: 43.13, region: 'Middle East' },
  { city: 'Aleppo', country: 'Syria', lat: 36.2021, lng: 37.1343, region: 'Middle East' },
  { city: 'Homs', country: 'Syria', lat: 34.7324, lng: 36.7137, region: 'Middle East' },

  // ── AFRICA (35 cities) ──
  { city: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, region: 'Africa' },
  { city: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, region: 'Africa' },
  { city: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, region: 'Africa' },
  { city: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, region: 'Africa' },
  { city: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, region: 'Africa' },
  { city: 'Abuja', country: 'Nigeria', lat: 9.0765, lng: 7.3986, region: 'Africa' },
  { city: 'Accra', country: 'Ghana', lat: 5.6037, lng: -0.187, region: 'Africa' },
  { city: 'Addis Ababa', country: 'Ethiopia', lat: 9.0054, lng: 38.7636, region: 'Africa' },
  { city: 'Dar es Salaam', country: 'Tanzania', lat: -6.7924, lng: 39.2083, region: 'Africa' },
  { city: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898, region: 'Africa' },
  { city: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811, region: 'Africa' },
  { city: 'Tunis', country: 'Tunisia', lat: 36.8065, lng: 10.1815, region: 'Africa' },
  { city: 'Algiers', country: 'Algeria', lat: 36.7538, lng: 3.0588, region: 'Africa' },
  { city: 'Dakar', country: 'Senegal', lat: 14.7167, lng: -17.4677, region: 'Africa' },
  { city: 'Kigali', country: 'Rwanda', lat: -1.9403, lng: 29.8739, region: 'Africa' },
  { city: 'Kampala', country: 'Uganda', lat: 0.3476, lng: 32.5825, region: 'Africa' },
  { city: 'Lusaka', country: 'Zambia', lat: -15.3875, lng: 28.3228, region: 'Africa' },
  { city: 'Harare', country: 'Zimbabwe', lat: -17.8252, lng: 31.0335, region: 'Africa' },
  { city: 'Maputo', country: 'Mozambique', lat: -25.9692, lng: 32.5732, region: 'Africa' },
  { city: 'Windhoek', country: 'Namibia', lat: -22.5609, lng: 17.0658, region: 'Africa' },
  { city: 'Gaborone', country: 'Botswana', lat: -24.6282, lng: 25.9231, region: 'Africa' },
  { city: 'Mogadishu', country: 'Somalia', lat: 2.0469, lng: 45.3182, region: 'Africa' },
  { city: 'Khartoum', country: 'Sudan', lat: 15.5007, lng: 32.5599, region: 'Africa' },
  { city: 'Tripoli', country: 'Libya', lat: 32.8872, lng: 13.1913, region: 'Africa' },
  { city: 'Bamako', country: 'Mali', lat: 12.6392, lng: -8.0029, region: 'Africa' },
  { city: 'Ouagadougou', country: 'Burkina Faso', lat: 12.3714, lng: -1.5197, region: 'Africa' },
  { city: 'Niamey', country: 'Niger', lat: 13.5137, lng: 2.1098, region: 'Africa' },
  { city: 'Kinshasa', country: 'Democratic Republic of Congo', lat: -4.4419, lng: 15.2663, region: 'Africa' },
  { city: 'Luanda', country: 'Angola', lat: -8.839, lng: 13.2894, region: 'Africa' },
  { city: 'Abidjan', country: 'Ivory Coast', lat: 5.36, lng: -4.0083, region: 'Africa' },
  { city: 'Douala', country: 'Cameroon', lat: 4.0511, lng: 9.7679, region: 'Africa' },
  { city: 'Libreville', country: 'Gabon', lat: 0.4162, lng: 9.4673, region: 'Africa' },
  { city: 'Antananarivo', country: 'Madagascar', lat: -18.8792, lng: 47.5079, region: 'Africa' },
  { city: 'Port Louis', country: 'Mauritius', lat: -20.1609, lng: 57.5012, region: 'Africa' },
  { city: 'Zanzibar', country: 'Tanzania', lat: -6.1659, lng: 39.2026, region: 'Africa' },

  // ── CONFLICT ZONES (15 entries) ──
  { city: 'Kyiv', country: 'Ukraine', lat: 50.4501, lng: 30.5234, region: 'Conflict' },
  { city: 'Kharkiv', country: 'Ukraine', lat: 49.9935, lng: 36.2304, region: 'Conflict' },
  { city: 'Odesa', country: 'Ukraine', lat: 46.4825, lng: 30.7233, region: 'Conflict' },
  { city: 'Zaporizhzhia', country: 'Ukraine', lat: 47.8388, lng: 35.1396, region: 'Conflict' },
  { city: 'Dnipro', country: 'Ukraine', lat: 48.4647, lng: 35.0462, region: 'Conflict' },
  { city: 'Mykolaiv', country: 'Ukraine', lat: 46.975, lng: 31.9946, region: 'Conflict' },
  { city: 'Port-au-Prince', country: 'Haiti', lat: 18.5944, lng: -72.3074, region: 'Conflict' },
  { city: 'Yangon', country: 'Myanmar', lat: 16.8661, lng: 96.1951, region: 'Conflict' },
  { city: 'Mandalay', country: 'Myanmar', lat: 21.9588, lng: 96.0891, region: 'Conflict' },
  { city: 'Aden', country: 'Yemen', lat: 12.7855, lng: 45.0187, region: 'Conflict' },
  { city: 'Hodeidah', country: 'Yemen', lat: 14.7979, lng: 42.9539, region: 'Conflict' },
  { city: 'N\'Djamena', country: 'Chad', lat: 12.1348, lng: 15.0557, region: 'Conflict' },
  { city: 'Bangui', country: 'Central African Republic', lat: 4.3947, lng: 18.5582, region: 'Conflict' },
  { city: 'Juba', country: 'South Sudan', lat: 4.8594, lng: 31.5713, region: 'Conflict' },
  { city: 'Bujumbura', country: 'Burundi', lat: -3.3614, lng: 29.3599, region: 'Conflict' },
];

// ═══════════════════════════════════════════════════════════════
// REAL-WORLD THREAT TEMPLATES BY CATEGORY
// Based on actual incidents from ACLED, GDACS, WHO, Interpol, 
// WorldMonitor.app, SOS International, Intelligence Fusion
// ═══════════════════════════════════════════════════════════════

interface ThreatTemplate {
  type: ThreatCategory;
  severity: ThreatSeverity;
  titleTemplate: string;
  descTemplate: string;
  actions: string[];
  sources: string[];
  confidence: number;
  radiusKm: number;
  hoursAgo: number;
}

const CONFLICT_ZONE_THREATS: ThreatTemplate[] = [
  { type: 'terrorism', severity: 'critical', titleTemplate: 'ACTIVE WAR ZONE — {city}', descTemplate: 'Active military operations ongoing in {city}, {country}. Missile strikes, drone attacks, and ground combat reported in the last 24 hours. All embassies advise DO NOT TRAVEL. Airspace restrictions in effect. Multiple civilian casualties reported by OCHA.', actions: ['DO NOT TRAVEL under any circumstances', 'If present, evacuate immediately', 'Contact your embassy for evacuation assistance', 'Register with your government travel advisory system', 'No commercial flights — seek overland routes'], sources: ['CNN', 'BBC', 'Reuters', 'US State Department', 'UK FCDO', 'UN OCHA', 'WorldMonitor.app'], confidence: 100, radiusKm: 200, hoursAgo: 1 },
  { type: 'civil_unrest', severity: 'critical', titleTemplate: 'Artillery Strikes — {city} Region', descTemplate: 'Heavy artillery and rocket attacks targeting civilian infrastructure in {city}. Multiple residential areas hit. Emergency services overwhelmed. ACLED conflict tracker confirms escalation pattern.', actions: ['Seek immediate shelter in underground structures', 'Stay away from windows and exterior walls', 'Keep emergency supplies ready', 'Follow official evacuation orders immediately'], sources: ['ACLED', 'Reuters', 'AP', 'OSCE', 'WorldMonitor.app'], confidence: 98, radiusKm: 150, hoursAgo: 2 },
  { type: 'terrorism', severity: 'critical', titleTemplate: 'IED/Mine Threat — {city} Corridors', descTemplate: 'Improvised explosive devices and anti-personnel mines confirmed along civilian corridors near {city}. UN demining teams report new placements. HALO Trust advisory in effect.', actions: ['Do not deviate from marked safe routes', 'Report suspicious objects to authorities', 'Never touch unidentified objects', 'Follow HALO Trust advisories'], sources: ['HALO Trust', 'UN Mine Action', 'Reuters', 'WorldMonitor.app'], confidence: 95, radiusKm: 100, hoursAgo: 3 },
];

const TERRORISM_THREATS: ThreatTemplate[] = [
  { type: 'terrorism', severity: 'critical', titleTemplate: 'Elevated Terror Alert — {city}', descTemplate: 'National security services have elevated the terrorism threat level in {city}, {country} to SEVERE following credible intelligence. Increased security at transport hubs, government buildings, and public venues. Intelligence Fusion reports multiple indicators.', actions: ['Be vigilant in crowded places', 'Report suspicious activities to local police', 'Follow official government guidance', 'Avoid large public gatherings', 'Keep emergency contacts updated'], sources: ['Intelligence Fusion', 'National Security Service', 'US Embassy', 'UK FCDO', 'SOS International'], confidence: 92, radiusKm: 50, hoursAgo: 3 },
  { type: 'terrorism', severity: 'high', titleTemplate: 'Security Operation — {city} District', descTemplate: 'Counter-terrorism operation underway in {city} following intelligence on potential attack plot. Road closures and enhanced screening at major venues. Interpol coordination confirmed.', actions: ['Expect security delays at public venues', 'Carry ID at all times', 'Follow police instructions', 'Avoid cordoned areas'], sources: ['Interpol', 'Local Police', 'Intelligence Fusion', 'WorldMonitor.app'], confidence: 85, radiusKm: 15, hoursAgo: 5 },
  { type: 'terrorism', severity: 'high', titleTemplate: 'Kidnapping Risk Elevated — {city}', descTemplate: 'Intelligence agencies report elevated kidnapping risk targeting foreign nationals in {city}, {country}. Multiple incidents in past 30 days. SOS International advisory issued.', actions: ['Vary daily routines and routes', 'Avoid isolated areas especially after dark', 'Register with your embassy', 'Consider professional security escort', 'Share itinerary with trusted contacts'], sources: ['SOS International', 'US Embassy', 'Intelligence Fusion', 'OSINT'], confidence: 80, radiusKm: 30, hoursAgo: 8 },
];

const CIVIL_UNREST_THREATS: ThreatTemplate[] = [
  { type: 'civil_unrest', severity: 'high', titleTemplate: 'Mass Protests — {city} Center', descTemplate: 'Large-scale anti-government protests in central {city}, {country}. Tens of thousands gathered near government buildings. Road closures, tear gas deployed. ACLED records escalating violence pattern.', actions: ['Avoid protest areas and government buildings', 'Use alternative routes', 'Monitor local news continuously', 'Keep emergency contacts ready', 'Stock essentials in case of curfew'], sources: ['ACLED', 'Reuters', 'Al Jazeera', 'Local Media', 'WorldMonitor.app'], confidence: 94, radiusKm: 10, hoursAgo: 2 },
  { type: 'civil_unrest', severity: 'medium', titleTemplate: 'Labor Strike — {city} Transport', descTemplate: 'National transport workers strike affecting all public transit in {city}. Buses, metro, and rail services suspended. Significant traffic disruption expected for 48+ hours.', actions: ['Plan alternative transportation', 'Allow extra travel time', 'Consider remote work if possible', 'Check airline status if flying'], sources: ['Local Media', 'Transport Authority', 'Reuters'], confidence: 96, radiusKm: 25, hoursAgo: 4 },
  { type: 'civil_unrest', severity: 'high', titleTemplate: 'Political Crisis — {city} Curfew', descTemplate: 'Government has imposed overnight curfew in {city} following political unrest. Security forces deployed. Multiple arrests reported. International observers express concern.', actions: ['Observe curfew hours strictly', 'Stock food and water', 'Avoid photographing security forces', 'Keep passport and documents accessible', 'Contact embassy if harassed'], sources: ['Reuters', 'AP', 'BBC', 'Human Rights Watch', 'WorldMonitor.app'], confidence: 90, radiusKm: 30, hoursAgo: 6 },
  { type: 'civil_unrest', severity: 'medium', titleTemplate: 'Election Tensions — {city}', descTemplate: 'Pre-election tensions rising in {city}, {country}. Sporadic clashes between political factions. International election monitors report intimidation. Businesses boarding up.', actions: ['Avoid political rallies', 'Keep away from polling stations', 'Have departure plan ready', 'Monitor embassy advisories'], sources: ['OSCE', 'Carter Center', 'Local Media', 'Reuters'], confidence: 82, radiusKm: 20, hoursAgo: 12 },
];

const CRIME_THREATS: ThreatTemplate[] = [
  { type: 'crime', severity: 'high', titleTemplate: 'Armed Robbery Surge — {city}', descTemplate: 'Significant increase in armed robberies targeting tourists and expats in {city}, {country}. Organized criminal groups operating near hotels, restaurants, and ATMs. Interpol intelligence sharing active.', actions: ['Avoid displaying valuables', 'Use hotel safes for passports and cash', 'Take registered taxis only', 'Avoid walking alone after dark', 'Keep copies of documents separate from originals'], sources: ['Interpol', 'Local Police', 'US Embassy', 'SOS International'], confidence: 88, radiusKm: 12, hoursAgo: 6 },
  { type: 'crime', severity: 'medium', titleTemplate: 'Scam Ring Active — {city} Tourist Areas', descTemplate: 'Organized scam operations targeting tourists in {city}. Fake police, taxi overcharging, card skimming at ATMs, and rental scams reported. Europol investigating cross-border network.', actions: ['Verify police credentials before complying', 'Use ATMs inside banks only', 'Agree on taxi fares before departure', 'Book accommodation through verified platforms'], sources: ['Europol', 'Tourism Police', 'TripAdvisor Safety', 'Local Media'], confidence: 85, radiusKm: 8, hoursAgo: 10 },
  { type: 'crime', severity: 'high', titleTemplate: 'Carjacking Alert — {city} Highways', descTemplate: 'Multiple carjacking incidents on major highways near {city}. Armed perpetrators targeting rental vehicles. Local authorities increasing patrols but recommend avoiding night driving.', actions: ['Avoid driving at night', 'Keep doors locked and windows up', 'Do not stop for suspicious roadblocks', 'Use GPS tracking apps', 'Report incidents immediately to police'], sources: ['Local Police', 'Rental Car Association', 'SOS International', 'Intelligence Fusion'], confidence: 83, radiusKm: 40, hoursAgo: 8 },
  { type: 'crime', severity: 'medium', titleTemplate: 'Pickpocket Ring — {city} Transit', descTemplate: 'Professional pickpocket gangs operating on {city} metro, buses, and around major attractions. Coordinated distraction techniques targeting smartphones and wallets.', actions: ['Keep valuables in front pockets or money belt', 'Be alert in crowded transit', 'Use anti-theft bags', 'Avoid using phone near train doors'], sources: ['Transit Police', 'Tourism Board', 'Local Media'], confidence: 90, radiusKm: 10, hoursAgo: 4 },
  { type: 'crime', severity: 'low', titleTemplate: 'Petty Theft Increase — {city} Beaches', descTemplate: 'Seasonal increase in petty theft at beaches and outdoor areas in {city}. Unattended belongings targeted. Police advise using lockers.', actions: ['Use beach lockers', 'Never leave bags unattended', 'Carry only essentials', 'Use waterproof phone pouches'], sources: ['Local Police', 'Tourism Board'], confidence: 92, radiusKm: 5, hoursAgo: 12 },
];

const WEATHER_THREATS: ThreatTemplate[] = [
  { type: 'severe_weather', severity: 'critical', titleTemplate: 'Typhoon Warning — {city}', descTemplate: 'Category 4 typhoon approaching {city}, {country}. Sustained winds exceeding 200 km/h. Mandatory evacuation in coastal areas. GDACS Red Alert issued. Airport closures expected.', actions: ['Evacuate coastal areas immediately', 'Stock emergency supplies for 72+ hours', 'Secure all outdoor items', 'Know your evacuation route', 'Monitor GDACS and local meteorological service'], sources: ['GDACS', 'NOAA', 'National Met Service', 'WorldMonitor.app'], confidence: 97, radiusKm: 100, hoursAgo: 1 },
  { type: 'severe_weather', severity: 'high', titleTemplate: 'Severe Flooding — {city} Region', descTemplate: 'Flash flooding affecting multiple districts in {city}. Roads submerged, public transport suspended. GDACS Orange Alert. Rescue operations underway. Water contamination risk.', actions: ['Move to higher ground', 'Avoid floodwater — may be contaminated', 'Do not drive through standing water', 'Boil or purify drinking water', 'Follow evacuation orders'], sources: ['GDACS', 'National Weather Service', 'Red Cross', 'WorldMonitor.app'], confidence: 95, radiusKm: 40, hoursAgo: 3 },
  { type: 'severe_weather', severity: 'medium', titleTemplate: 'Heat Wave Alert — {city}', descTemplate: 'Extreme heat wave affecting {city} with temperatures exceeding 45°C. Heat stroke risk elevated. Hospitals reporting surge in heat-related emergencies. Vulnerable populations at high risk.', actions: ['Stay indoors during peak hours (11am-4pm)', 'Stay hydrated — drink water regularly', 'Check on elderly neighbors', 'Never leave children/pets in vehicles', 'Seek air-conditioned spaces'], sources: ['National Weather Service', 'WHO', 'Red Cross'], confidence: 98, radiusKm: 50, hoursAgo: 2 },
  { type: 'severe_weather', severity: 'high', titleTemplate: 'Cyclone Track — {city} Coast', descTemplate: 'Tropical cyclone tracking towards {city} coastline. Landfall expected within 24-48 hours. Storm surge warnings for low-lying areas. Airlines cancelling flights proactively.', actions: ['Secure outdoor furniture and loose items', 'Fill bathtubs with water as reserve', 'Charge all electronic devices', 'Prepare go-bag with essentials', 'Know your nearest shelter location'], sources: ['GDACS', 'NOAA', 'Bureau of Meteorology', 'WorldMonitor.app'], confidence: 90, radiusKm: 80, hoursAgo: 4 },
  { type: 'severe_weather', severity: 'medium', titleTemplate: 'Wildfire Smoke — {city} Area', descTemplate: 'Wildfires generating hazardous air quality in {city} metropolitan area. AQI exceeding 200 (Very Unhealthy). Outdoor activities should be limited. N95 masks recommended.', actions: ['Stay indoors with windows closed', 'Use air purifiers if available', 'Wear N95 mask if going outside', 'Check AQI before outdoor activities', 'Those with respiratory conditions should seek medical advice'], sources: ['AQI Monitor', 'Fire Service', 'WHO', 'Local Media'], confidence: 95, radiusKm: 60, hoursAgo: 5 },
];

const NATURAL_DISASTER_THREATS: ThreatTemplate[] = [
  { type: 'natural_disaster', severity: 'critical', titleTemplate: 'Earthquake M6.5+ — {city}', descTemplate: 'Magnitude 6.5+ earthquake struck near {city}, {country}. Building collapses and infrastructure damage reported. GDACS Red Alert. Aftershock sequence expected. Tsunami advisory may follow for coastal areas.', actions: ['Move to open areas away from buildings', 'Expect aftershocks for days', 'Check for gas leaks', 'Do not enter damaged buildings', 'Follow official emergency channels'], sources: ['USGS', 'GDACS', 'National Seismological Center', 'Red Cross', 'WorldMonitor.app'], confidence: 100, radiusKm: 150, hoursAgo: 1 },
  { type: 'natural_disaster', severity: 'high', titleTemplate: 'Volcanic Activity — Near {city}', descTemplate: 'Increased volcanic activity detected near {city}. Elevated ash emissions, tremors, and gas output. Aviation color code raised to Orange. Exclusion zone expanded. GDACS monitoring.', actions: ['Follow exclusion zone boundaries', 'Prepare for possible evacuation', 'Wear masks due to ash and gas', 'Stock water and non-perishable food', 'Monitor official updates hourly'], sources: ['GDACS', 'Smithsonian GVP', 'Local Volcanological Survey', 'WorldMonitor.app'], confidence: 90, radiusKm: 80, hoursAgo: 6 },
  { type: 'natural_disaster', severity: 'medium', titleTemplate: 'Landslide Risk — {city} Hills', descTemplate: 'Heavy rains have saturated hillside areas near {city}, creating high landslide risk. Several minor slides already reported. Geotechnical teams assessing stability. Some roads closed.', actions: ['Avoid hillside roads and trails', 'Watch for signs of ground movement', 'Have evacuation bag ready', 'Do not camp near slopes'], sources: ['Geological Survey', 'Local Emergency Services', 'GDACS'], confidence: 85, radiusKm: 25, hoursAgo: 8 },
  { type: 'natural_disaster', severity: 'high', titleTemplate: 'Tsunami Advisory — {city} Coast', descTemplate: 'Tsunami advisory issued for coastal areas near {city} following undersea earthquake. Waves of 1-3 meters possible. Coastal evacuation zones activated. PTWC monitoring.', actions: ['Move to high ground immediately if near coast', 'Do not return to coast until all-clear', 'Follow evacuation route signs', 'Monitor Pacific Tsunami Warning Center'], sources: ['PTWC', 'GDACS', 'National Oceanographic Service', 'WorldMonitor.app'], confidence: 88, radiusKm: 100, hoursAgo: 2 },
];

const HEALTH_THREATS: ThreatTemplate[] = [
  { type: 'health_emergency', severity: 'high', titleTemplate: 'Disease Outbreak — {city}', descTemplate: 'WHO confirms outbreak of infectious disease in {city}, {country}. Case counts rising rapidly. Hospitals under strain. CDC has issued Level 3 travel health notice. Quarantine measures may be imposed.', actions: ['Practice enhanced hygiene protocols', 'Wear masks in crowded indoor spaces', 'Avoid contact with symptomatic individuals', 'Check vaccination requirements', 'Monitor WHO situation reports'], sources: ['WHO', 'CDC', 'National Health Ministry', 'ProMED'], confidence: 92, radiusKm: 40, hoursAgo: 6 },
  { type: 'health_emergency', severity: 'medium', titleTemplate: 'Dengue Fever Spike — {city}', descTemplate: 'Dengue fever cases surge 300% above seasonal baseline in {city}. Multiple districts affected. WHO technical assistance deployed. Hospital bed capacity reaching limits.', actions: ['Use DEET-based mosquito repellent', 'Wear long sleeves at dawn and dusk', 'Sleep under mosquito nets', 'Eliminate standing water near accommodation', 'Seek medical attention for high fever'], sources: ['WHO', 'National Health Ministry', 'CDC'], confidence: 90, radiusKm: 30, hoursAgo: 12 },
  { type: 'health_emergency', severity: 'critical', titleTemplate: 'Cholera Emergency — {city}', descTemplate: 'Cholera outbreak declared in {city} following contaminated water supply. Hundreds of cases confirmed. WHO emergency response team deployed. Avoid all tap water and uncooked food.', actions: ['Drink only bottled or boiled water', 'Avoid all raw foods and ice', 'Wash hands with soap frequently', 'Seek immediate medical attention for diarrhea', 'Consider oral cholera vaccination'], sources: ['WHO', 'MSF', 'National Health Ministry', 'UNICEF'], confidence: 95, radiusKm: 35, hoursAgo: 4 },
  { type: 'health_emergency', severity: 'info', titleTemplate: 'Health Advisory — {city} Air Quality', descTemplate: 'Air quality index in {city} has exceeded unhealthy levels (AQI >150). Respiratory issues may be aggravated. WHO guidelines suggest limiting outdoor exposure during peak pollution.', actions: ['Limit outdoor activities', 'Use air purifiers indoors', 'Wear N95 mask if going outside', 'Check AQI before exercise'], sources: ['WHO', 'AQI Monitor', 'Local Health Authority'], confidence: 95, radiusKm: 40, hoursAgo: 8 },
];

const CYBER_THREATS: ThreatTemplate[] = [
  { type: 'cyber_attack', severity: 'high', titleTemplate: 'Banking Trojan — {city} ATMs', descTemplate: 'Sophisticated ATM skimming operation detected across {city}. Card data and PINs being captured at compromised machines. Interpol cybercrime unit investigating. Multiple banks affected.', actions: ['Use ATMs inside bank branches only', 'Cover PIN pad when entering PIN', 'Monitor bank statements daily', 'Enable transaction alerts', 'Consider contactless payments instead'], sources: ['Interpol Cybercrime', 'Local Banking Association', 'Intelligence Fusion'], confidence: 85, radiusKm: 20, hoursAgo: 8 },
  { type: 'cyber_attack', severity: 'medium', titleTemplate: 'Fake WiFi Hotspots — {city} Airport', descTemplate: 'Multiple rogue WiFi access points detected at {city} international airport. Man-in-the-middle attacks capturing login credentials and financial data. Airport security investigating.', actions: ['Use VPN on all public WiFi', 'Verify network name with airport staff', 'Avoid banking on public networks', 'Use mobile data when possible', 'Enable 2FA on all accounts'], sources: ['Airport Authority', 'CERT', 'Intelligence Fusion'], confidence: 82, radiusKm: 5, hoursAgo: 10 },
  { type: 'cyber_attack', severity: 'high', titleTemplate: 'SIM Swap Fraud Ring — {city}', descTemplate: 'Organized SIM swap fraud ring targeting foreign nationals in {city}. Criminals using stolen identity data to take over phone numbers and access banking apps. Multiple victims reported.', actions: ['Use eSIM when possible', 'Set SIM PIN lock', 'Enable biometric authentication for banking', 'Do not share personal info with strangers', 'Contact carrier if service drops unexpectedly'], sources: ['Interpol', 'Local Police Cybercrime Unit', 'Telecom Regulator'], confidence: 78, radiusKm: 30, hoursAgo: 12 },
  { type: 'cyber_attack', severity: 'medium', titleTemplate: 'Ransomware Wave — {city} Businesses', descTemplate: 'Ransomware attacks hitting businesses and hotels in {city}. Guest data and payment systems compromised. CERT advisory issued. Backup systems recommended.', actions: ['Backup important data offline', 'Do not open suspicious email attachments', 'Ensure antivirus is updated', 'Use unique passwords for hotel WiFi', 'Monitor financial accounts'], sources: ['CERT', 'Europol EC3', 'Intelligence Fusion'], confidence: 80, radiusKm: 25, hoursAgo: 14 },
];

const TRANSPORT_THREATS: ThreatTemplate[] = [
  { type: 'transport_disruption', severity: 'medium', titleTemplate: 'Airport Strike — {city}', descTemplate: 'Air traffic controllers and ground staff at {city} airport on 48-hour strike. Hundreds of flights cancelled. Airlines offering rebooking. Eurocontrol rerouting traffic.', actions: ['Check flight status before heading to airport', 'Contact airline for rebooking options', 'Consider alternative airports', 'Allow extra time for check-in'], sources: ['Eurocontrol', 'Airlines', 'Airport Authority', 'Local Media'], confidence: 97, radiusKm: 30, hoursAgo: 2 },
  { type: 'transport_disruption', severity: 'low', titleTemplate: 'Metro Signal Failure — {city}', descTemplate: 'Major signal failure affecting multiple metro lines in {city}. Delays of 30-60 minutes on all lines. Shuttle buses being deployed. Rush hour severely impacted.', actions: ['Use alternative transport methods', 'Allow extra travel time', 'Consider ride-sharing', 'Check live service updates'], sources: ['Transit Authority', 'Local Media'], confidence: 98, radiusKm: 15, hoursAgo: 1 },
  { type: 'transport_disruption', severity: 'high', titleTemplate: 'Port Blockade — {city} Harbor', descTemplate: 'Protest blockade at {city} port disrupting maritime operations. Ferry services suspended. Commercial shipping delayed. Coast guard monitoring. Supply chain impact expected.', actions: ['Rebook ferry tickets', 'Use air travel alternatives', 'Expect price increases on imported goods', 'Monitor port authority updates'], sources: ['Port Authority', 'Coast Guard', 'Reuters', 'WorldMonitor.app'], confidence: 88, radiusKm: 20, hoursAgo: 6 },
];

// ═══════════════════════════════════════════════════════════════
// DETERMINISTIC THREAT GENERATOR
// ═══════════════════════════════════════════════════════════════

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateThreatsForCity(city: CityDef, cityIndex: number): ThreatIncident[] {
  const threats: ThreatIncident[] = [];
  const seed = cityIndex * 137;

  // Conflict zones get critical threats
  if (city.region === 'Conflict') {
    const templates = CONFLICT_ZONE_THREATS;
    const numThreats = 2 + Math.floor(seededRandom(seed) * 2);
    for (let i = 0; i < numThreats && i < templates.length; i++) {
      const t = templates[i];
      threats.push({
        id: `T-${cityIndex.toString().padStart(3, '0')}-${i}`,
        type: t.type,
        severity: t.severity,
        title: t.titleTemplate.replace('{city}', city.city),
        description: t.descTemplate.replace(/{city}/g, city.city).replace(/{country}/g, city.country),
        location: { lat: city.lat, lng: city.lng, radius: t.radiusKm, address: city.city, city: city.city, country: city.country },
        timestamp: new Date(Date.now() - t.hoursAgo * 3600000).toISOString(),
        distanceFromUser: Math.round(50 + seededRandom(seed + i * 7) * 10000),
        recommendedActions: t.actions,
        sources: t.sources,
        confidence: t.confidence,
        isActive: true,
      });
    }
    return threats;
  }

  // Determine which threat types this city gets based on deterministic selection
  const allTemplates: ThreatTemplate[][] = [
    TERRORISM_THREATS,
    CIVIL_UNREST_THREATS,
    CRIME_THREATS,
    WEATHER_THREATS,
    NATURAL_DISASTER_THREATS,
    HEALTH_THREATS,
    CYBER_THREATS,
    TRANSPORT_THREATS,
  ];

  // Each city gets 2-4 threats from different categories
  const numThreats = 2 + Math.floor(seededRandom(seed + 1) * 3);
  const usedCategories = new Set<number>();

  for (let i = 0; i < numThreats; i++) {
    let catIdx = Math.floor(seededRandom(seed + i * 31) * allTemplates.length);
    // Avoid duplicate categories when possible
    let attempts = 0;
    while (usedCategories.has(catIdx) && attempts < 8) {
      catIdx = (catIdx + 1) % allTemplates.length;
      attempts++;
    }
    usedCategories.add(catIdx);

    const category = allTemplates[catIdx];
    const templateIdx = Math.floor(seededRandom(seed + i * 47) * category.length);
    const t = category[templateIdx];

    // Vary severity for non-conflict cities based on region risk
    let severity = t.severity;
    const riskRegions = ['Middle East', 'Africa'];
    if (!riskRegions.includes(city.region) && severity === 'critical') {
      severity = 'high';
    }

    // Vary hours ago
    const hoursAgo = Math.round(t.hoursAgo * (0.5 + seededRandom(seed + i * 53) * 2));

    threats.push({
      id: `T-${cityIndex.toString().padStart(3, '0')}-${i}`,
      type: t.type,
      severity,
      title: t.titleTemplate.replace('{city}', city.city),
      description: t.descTemplate.replace(/{city}/g, city.city).replace(/{country}/g, city.country),
      location: { lat: city.lat, lng: city.lng, radius: t.radiusKm, address: city.city, city: city.city, country: city.country },
      timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
      distanceFromUser: Math.round(10 + seededRandom(seed + i * 67) * 12000),
      recommendedActions: t.actions,
      sources: t.sources,
      confidence: Math.max(70, t.confidence - Math.floor(seededRandom(seed + i * 71) * 15)),
      isActive: true,
    });
  }

  return threats;
}

// Generate all threats
const allGeneratedThreats: ThreatIncident[] = [];
THREAT_CITIES.forEach((city, index) => {
  allGeneratedThreats.push(...generateThreatsForCity(city, index));
});

export const dummyThreats: ThreatIncident[] = allGeneratedThreats;

// ═══════════════════════════════════════════════════════════════
// WATCHLIST — Key monitored locations
// ═══════════════════════════════════════════════════════════════

function generateWatchlist(): WatchlistLocation[] {
  const watchCities = THREAT_CITIES.filter((_, i) => i % 5 === 0 || _.region === 'Conflict');
  return watchCities.map((city, i) => {
    const cityThreats = allGeneratedThreats.filter(t => t.location.city === city.city);
    const hasCritical = cityThreats.some(t => t.severity === 'critical');
    const hasHigh = cityThreats.some(t => t.severity === 'high');
    const status: 'safe' | 'caution' | 'danger' = hasCritical ? 'danger' : hasHigh ? 'caution' : 'safe';
    return {
      id: `W-${i.toString().padStart(3, '0')}`,
      name: `${city.city}, ${city.country}`,
      coordinates: { lat: city.lat, lng: city.lng },
      radius: city.region === 'Conflict' ? 500 : 25,
      alertLevel: hasCritical ? ['critical' as ThreatSeverity] : hasHigh ? ['critical' as ThreatSeverity, 'high' as ThreatSeverity] : ['critical' as ThreatSeverity, 'high' as ThreatSeverity, 'medium' as ThreatSeverity],
      activeThreats: cityThreats.length,
      currentStatus: status,
    };
  });
}

export const dummyWatchlist: WatchlistLocation[] = generateWatchlist();

// ═══════════════════════════════════════════════════════════════
// STATISTICS — Computed from generated data
// ═══════════════════════════════════════════════════════════════

function computeStatistics(): ThreatStatistics {
  const active = allGeneratedThreats.filter(t => t.isActive);
  return {
    total: active.length,
    critical: active.filter(t => t.severity === 'critical').length,
    high: active.filter(t => t.severity === 'high').length,
    medium: active.filter(t => t.severity === 'medium').length,
    low: active.filter(t => t.severity === 'low').length,
    info: active.filter(t => t.severity === 'info').length,
    activeNearby: active.filter(t => t.distanceFromUser < 100).length,
    trend: 'deteriorating',
  };
}

export const dummyStatistics: ThreatStatistics = computeStatistics();

// ═══════════════════════════════════════════════════════════════
// REAL-TIME DATA SOURCES REGISTRY
// ═══════════════════════════════════════════════════════════════

export interface ThreatDataSource {
  id: string;
  name: string;
  type: 'news' | 'intelligence' | 'government' | 'humanitarian' | 'weather' | 'health' | 'cyber' | 'conflict';
  url: string;
  reliability: 'verified' | 'high' | 'medium';
  categories: ThreatCategory[];
  description: string;
  updateFrequency: string;
}

export const THREAT_DATA_SOURCES: ThreatDataSource[] = [
  // News Channels
  { id: 'cnn', name: 'CNN Breaking News', type: 'news', url: 'https://edition.cnn.com', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'natural_disaster'], description: 'Global breaking news coverage with verified reporters on the ground', updateFrequency: 'Real-time' },
  { id: 'bbc', name: 'BBC World Service', type: 'news', url: 'https://www.bbc.com/news/world', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'natural_disaster', 'health_emergency'], description: 'Trusted global news service with correspondents in 100+ countries', updateFrequency: 'Real-time' },
  { id: 'reuters', name: 'Reuters', type: 'news', url: 'https://www.reuters.com', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'crime'], description: 'Wire service with factual breaking news worldwide', updateFrequency: 'Real-time' },
  { id: 'ap', name: 'Associated Press', type: 'news', url: 'https://apnews.com', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'natural_disaster'], description: 'Independent global news network', updateFrequency: 'Real-time' },
  { id: 'aljazeera', name: 'Al Jazeera', type: 'news', url: 'https://www.aljazeera.com', reliability: 'high', categories: ['terrorism', 'civil_unrest'], description: 'Middle East and global conflict coverage', updateFrequency: 'Real-time' },

  // Intelligence & OSINT
  { id: 'intelfusion', name: 'Intelligence Fusion', type: 'intelligence', url: 'https://www.intelfusion.io', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'crime', 'cyber_attack'], description: 'Professional threat intelligence platform with global analyst network', updateFrequency: '15 minutes' },
  { id: 'worldmonitor', name: 'WorldMonitor.app', type: 'intelligence', url: 'https://www.worldmonitor.app', reliability: 'high', categories: ['terrorism', 'civil_unrest', 'natural_disaster', 'severe_weather'], description: 'Real-time global threat monitoring — conflicts, protests, weather, military, nuclear', updateFrequency: '1 hour' },
  { id: 'acled', name: 'ACLED Conflict Data', type: 'conflict', url: 'https://acleddata.com', reliability: 'verified', categories: ['terrorism', 'civil_unrest'], description: 'Armed Conflict Location & Event Data — academic-grade conflict tracking', updateFrequency: 'Weekly' },
  { id: 'osint', name: 'OSINT Framework', type: 'intelligence', url: 'https://osintframework.com', reliability: 'medium', categories: ['cyber_attack', 'terrorism', 'crime'], description: 'Open source intelligence aggregation framework', updateFrequency: 'Continuous' },

  // Government Travel Advisories
  { id: 'usdos', name: 'US State Department', type: 'government', url: 'https://travel.state.gov/content/travel/en/traveladvisories.html', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'crime', 'health_emergency'], description: 'Official US government travel advisories for every country', updateFrequency: 'As needed' },
  { id: 'ukfcdo', name: 'UK FCDO Travel Advice', type: 'government', url: 'https://www.gov.uk/foreign-travel-advice', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'crime'], description: 'British government travel safety advice', updateFrequency: 'As needed' },
  { id: 'euadvisory', name: 'EU Advisory Network', type: 'government', url: 'https://reopen.europa.eu', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'health_emergency'], description: 'European Union coordinated travel advisory', updateFrequency: 'Daily' },

  // Humanitarian
  { id: 'unocha', name: 'UN OCHA ReliefWeb', type: 'humanitarian', url: 'https://reliefweb.int', reliability: 'verified', categories: ['natural_disaster', 'civil_unrest', 'health_emergency'], description: 'UN humanitarian situation reports and emergency updates', updateFrequency: 'Daily' },
  { id: 'icrc', name: 'International Red Cross', type: 'humanitarian', url: 'https://www.icrc.org', reliability: 'verified', categories: ['civil_unrest', 'natural_disaster', 'health_emergency'], description: 'Humanitarian crisis monitoring and response', updateFrequency: 'Daily' },
  { id: 'sosinternational', name: 'SOS International', type: 'intelligence', url: 'https://www.internationalsos.com', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'crime', 'health_emergency'], description: 'Professional security and medical risk intelligence for travelers', updateFrequency: 'Real-time' },

  // Weather & Natural Disasters
  { id: 'gdacs', name: 'GDACS', type: 'weather', url: 'https://www.gdacs.org', reliability: 'verified', categories: ['natural_disaster', 'severe_weather'], description: 'Global Disaster Alert and Coordination System — UN/EU joint platform', updateFrequency: 'Real-time' },
  { id: 'noaa', name: 'NOAA', type: 'weather', url: 'https://www.noaa.gov', reliability: 'verified', categories: ['severe_weather', 'natural_disaster'], description: 'US National Oceanic and Atmospheric Administration — global weather alerts', updateFrequency: 'Hourly' },
  { id: 'usgs', name: 'USGS Earthquake Hazards', type: 'weather', url: 'https://earthquake.usgs.gov', reliability: 'verified', categories: ['natural_disaster'], description: 'Real-time earthquake monitoring worldwide', updateFrequency: 'Real-time' },

  // Health
  { id: 'who', name: 'World Health Organization', type: 'health', url: 'https://www.who.int/emergencies', reliability: 'verified', categories: ['health_emergency'], description: 'Global health emergencies and disease outbreak news', updateFrequency: 'Daily' },
  { id: 'cdc', name: 'CDC Travel Health', type: 'health', url: 'https://wwwnc.cdc.gov/travel', reliability: 'verified', categories: ['health_emergency'], description: 'US Centers for Disease Control travel health notices', updateFrequency: 'As needed' },
  { id: 'promed', name: 'ProMED', type: 'health', url: 'https://promedmail.org', reliability: 'high', categories: ['health_emergency'], description: 'Early warning system for disease outbreaks worldwide', updateFrequency: 'Daily' },

  // Cyber Security
  { id: 'interpol-cyber', name: 'Interpol Cybercrime', type: 'cyber', url: 'https://www.interpol.int/Crimes/Cybercrime', reliability: 'verified', categories: ['cyber_attack'], description: 'International police cybercrime intelligence and alerts', updateFrequency: 'Weekly' },
  { id: 'europol-ec3', name: 'Europol EC3', type: 'cyber', url: 'https://www.europol.europa.eu/about-europol/european-cybercrime-centre-ec3', reliability: 'verified', categories: ['cyber_attack'], description: 'European Cybercrime Centre — cross-border cyber threat intelligence', updateFrequency: 'Weekly' },
  { id: 'cert', name: 'National CERT Network', type: 'cyber', url: 'https://www.first.org/members/teams', reliability: 'high', categories: ['cyber_attack'], description: 'Computer Emergency Response Team network — 100+ national CERTs', updateFrequency: 'As needed' },

  // Conflict Monitoring
  { id: 'nato', name: 'NATO SHAPE', type: 'conflict', url: 'https://shape.nato.int', reliability: 'verified', categories: ['terrorism', 'civil_unrest'], description: 'NATO military situation awareness', updateFrequency: 'Daily' },
  { id: 'gtd', name: 'Global Terrorism Database', type: 'conflict', url: 'https://www.start.umd.edu/gtd/', reliability: 'verified', categories: ['terrorism'], description: 'University of Maryland comprehensive terrorism incident database', updateFrequency: 'Monthly' },
  { id: 'sipri', name: 'SIPRI', type: 'conflict', url: 'https://www.sipri.org', reliability: 'verified', categories: ['terrorism', 'civil_unrest'], description: 'Stockholm International Peace Research Institute — arms and conflict data', updateFrequency: 'Monthly' },

  // Global Private Intelligence
  { id: 'stratfor', name: 'Stratfor (RANE)', type: 'intelligence', url: 'https://worldview.stratfor.com', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'crime', 'cyber_attack'], description: 'Geopolitical intelligence and global risk analysis for enterprises and travelers', updateFrequency: 'Daily' },
  { id: 'janes', name: "Jane's by S&P Global", type: 'intelligence', url: 'https://www.janes.com', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'crime'], description: 'Defence and security intelligence — military threat assessments and country risk profiles', updateFrequency: 'Daily' },
  { id: 'control-risks', name: 'Control Risks', type: 'intelligence', url: 'https://www.controlrisks.com', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'crime', 'cyber_attack'], description: 'Global risk consultancy — political, security, and integrity risk intelligence', updateFrequency: 'Real-time' },
  { id: 'crisis24', name: 'Crisis24 (GardaWorld)', type: 'intelligence', url: 'https://crisis24.garda.com', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'natural_disaster', 'crime'], description: 'Integrated risk intelligence and crisis management for global operations', updateFrequency: 'Real-time' },
  { id: 'riskmap', name: 'Riskline', type: 'intelligence', url: 'https://www.riskline.com', reliability: 'verified', categories: ['terrorism', 'civil_unrest', 'crime', 'health_emergency', 'natural_disaster'], description: 'Travel risk intelligence covering 220+ destinations with real-time alerts', updateFrequency: 'Real-time' },
  { id: 'max-security', name: 'Max Security Solutions', type: 'intelligence', url: 'https://www.max-security.com', reliability: 'high', categories: ['terrorism', 'civil_unrest', 'crime'], description: 'Private intelligence firm specializing in high-risk regions and executive protection', updateFrequency: 'Daily' },
  { id: 'flashpoint', name: 'Flashpoint', type: 'intelligence', url: 'https://flashpoint.io', reliability: 'verified', categories: ['cyber_attack', 'terrorism', 'crime'], description: 'Deep and dark web threat intelligence — cyber, fraud, and physical security', updateFrequency: 'Real-time' },
  { id: 'recorded-future', name: 'Recorded Future', type: 'intelligence', url: 'https://www.recordedfuture.com', reliability: 'verified', categories: ['cyber_attack', 'terrorism', 'crime'], description: 'AI-powered threat intelligence platform — predictive analytics across global threat landscape', updateFrequency: 'Real-time' },
];
