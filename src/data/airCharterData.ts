// ═══════════════════════════════════════════════════════════
// AIR CHARTER SERVICE — Airport Directory & Demo Flight Data
// 100 largest cities + demo empty legs/seats for Meghan & John
// ═══════════════════════════════════════════════════════════

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  type: 'major' | 'business' | 'regional';
  fbo?: string; // Fixed Base Operator
}

export interface CharterFlight {
  id: string;
  type: 'empty-leg' | 'shared-seat' | 'full-charter';
  provider: 'Jettly' | 'XO / Vista' | 'Amalfi Jets' | 'Flapper';
  aircraft: string;
  aircraftCategory: 'light' | 'midsize' | 'super-mid' | 'heavy' | 'ultra-long';
  from: Airport;
  to: Airport;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  flightDuration: string;
  seatsAvailable: number;
  totalSeats: number;
  pricePerSeat: number; // EUR
  fullCharterPrice: number; // EUR
  originalRetailPrice: number; // EUR (what commercial biz class would cost)
  savingsPercent: number;
  amenities: string[];
  wifiOnboard: boolean;
  cateringIncluded: boolean;
  petFriendly: boolean;
  waitTimeMinutes: number; // avg boarding time at FBO
  commercialAlternativeWait: number; // avg wait at commercial terminal
  image?: string;
  fixedRate?: boolean; // Amalfi Jets fixed-rate
  verified: boolean;
  expiresIn?: string; // "2h 15m" countdown
}

// ═══ GLOBAL AIRPORT DIRECTORY (100 cities) ═══
export const AIRPORTS: Airport[] = [
  // ── EUROPE ──
  { code: 'LHR', name: 'Heathrow', city: 'London', country: 'UK', lat: 51.47, lng: -0.46, type: 'major' },
  { code: 'LTN', name: 'Luton', city: 'London', country: 'UK', lat: 51.87, lng: -0.37, type: 'business', fbo: 'Signature Flight Support' },
  { code: 'BQH', name: 'Biggin Hill', city: 'London', country: 'UK', lat: 51.33, lng: 0.03, type: 'business', fbo: 'Biggin Hill Executive' },
  { code: 'FAB', name: 'Farnborough', city: 'London', country: 'UK', lat: 51.28, lng: -0.78, type: 'business', fbo: 'TAG Farnborough' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.01, lng: 2.55, type: 'major' },
  { code: 'LBG', name: 'Le Bourget', city: 'Paris', country: 'France', lat: 48.97, lng: 2.44, type: 'business', fbo: 'Dassault Falcon Service' },
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany', lat: 50.03, lng: 8.57, type: 'major' },
  { code: 'MUC', name: 'Munich', city: 'Munich', country: 'Germany', lat: 48.35, lng: 11.79, type: 'major' },
  { code: 'OBF', name: 'Oberpfaffenhofen', city: 'Munich', country: 'Germany', lat: 48.08, lng: 11.28, type: 'business', fbo: 'Jet Aviation' },
  { code: 'ZRH', name: 'Zürich', city: 'Zürich', country: 'Switzerland', lat: 47.46, lng: 8.55, type: 'major' },
  { code: 'GVA', name: 'Geneva', city: 'Geneva', country: 'Switzerland', lat: 46.24, lng: 6.11, type: 'major' },
  { code: 'FCO', name: 'Fiumicino', city: 'Rome', country: 'Italy', lat: 41.80, lng: 12.25, type: 'major' },
  { code: 'CIA', name: 'Ciampino', city: 'Rome', country: 'Italy', lat: 41.80, lng: 12.59, type: 'business' },
  { code: 'MXP', name: 'Malpensa', city: 'Milan', country: 'Italy', lat: 45.63, lng: 8.72, type: 'major' },
  { code: 'LIN', name: 'Linate', city: 'Milan', country: 'Italy', lat: 45.45, lng: 9.28, type: 'business' },
  { code: 'BCN', name: 'El Prat', city: 'Barcelona', country: 'Spain', lat: 41.30, lng: 2.08, type: 'major' },
  { code: 'MAD', name: 'Barajas', city: 'Madrid', country: 'Spain', lat: 40.47, lng: -3.56, type: 'major' },
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Netherlands', lat: 52.31, lng: 4.77, type: 'major' },
  { code: 'BRU', name: 'Brussels', city: 'Brussels', country: 'Belgium', lat: 50.90, lng: 4.48, type: 'major' },
  { code: 'VIE', name: 'Vienna', city: 'Vienna', country: 'Austria', lat: 48.11, lng: 16.57, type: 'major' },
  { code: 'CPH', name: 'Copenhagen', city: 'Copenhagen', country: 'Denmark', lat: 55.62, lng: 12.66, type: 'major' },
  { code: 'OSL', name: 'Gardermoen', city: 'Oslo', country: 'Norway', lat: 60.20, lng: 11.08, type: 'major' },
  { code: 'ARN', name: 'Arlanda', city: 'Stockholm', country: 'Sweden', lat: 59.65, lng: 17.94, type: 'major' },
  { code: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki', country: 'Finland', lat: 60.32, lng: 24.96, type: 'major' },
  { code: 'LIS', name: 'Lisbon', city: 'Lisbon', country: 'Portugal', lat: 38.77, lng: -9.13, type: 'major' },
  { code: 'ATH', name: 'Athens', city: 'Athens', country: 'Greece', lat: 37.94, lng: 23.94, type: 'major' },
  { code: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'Turkey', lat: 41.26, lng: 28.74, type: 'major' },
  { code: 'WAW', name: 'Chopin', city: 'Warsaw', country: 'Poland', lat: 52.17, lng: 20.97, type: 'major' },
  { code: 'PRG', name: 'Vaclav Havel', city: 'Prague', country: 'Czech Republic', lat: 50.10, lng: 14.26, type: 'major' },
  { code: 'DUB', name: 'Dublin', city: 'Dublin', country: 'Ireland', lat: 53.42, lng: -6.27, type: 'major' },
  { code: 'EDI', name: 'Edinburgh', city: 'Edinburgh', country: 'UK', lat: 55.95, lng: -3.37, type: 'major' },
  { code: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', country: 'France', lat: 43.66, lng: 7.22, type: 'major' },
  { code: 'PMI', name: 'Palma de Mallorca', city: 'Palma', country: 'Spain', lat: 39.55, lng: 2.74, type: 'major' },
  // ── MIDDLE EAST ──
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', lat: 25.25, lng: 55.36, type: 'major' },
  { code: 'DWC', name: 'Al Maktoum', city: 'Dubai', country: 'UAE', lat: 24.90, lng: 55.16, type: 'business', fbo: 'DC Aviation Al-Futtaim' },
  { code: 'AUH', name: 'Abu Dhabi', city: 'Abu Dhabi', country: 'UAE', lat: 24.44, lng: 54.65, type: 'major' },
  { code: 'DOH', name: 'Hamad', city: 'Doha', country: 'Qatar', lat: 25.27, lng: 51.61, type: 'major' },
  { code: 'RUH', name: 'King Khalid', city: 'Riyadh', country: 'Saudi Arabia', lat: 24.96, lng: 46.70, type: 'major' },
  { code: 'JED', name: 'King Abdulaziz', city: 'Jeddah', country: 'Saudi Arabia', lat: 21.67, lng: 39.16, type: 'major' },
  { code: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'Israel', lat: 32.01, lng: 34.89, type: 'major' },
  { code: 'BAH', name: 'Bahrain', city: 'Manama', country: 'Bahrain', lat: 26.27, lng: 50.63, type: 'major' },
  // ── ASIA PACIFIC ──
  { code: 'SIN', name: 'Changi', city: 'Singapore', country: 'Singapore', lat: 1.36, lng: 103.99, type: 'major' },
  { code: 'XSP', name: 'Seletar', city: 'Singapore', country: 'Singapore', lat: 1.42, lng: 103.87, type: 'business', fbo: 'Jet Aviation Seletar' },
  { code: 'HKG', name: 'Hong Kong', city: 'Hong Kong', country: 'China', lat: 22.31, lng: 113.91, type: 'major' },
  { code: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japan', lat: 35.76, lng: 140.39, type: 'major' },
  { code: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japan', lat: 35.55, lng: 139.78, type: 'major' },
  { code: 'ICN', name: 'Incheon', city: 'Seoul', country: 'South Korea', lat: 37.46, lng: 126.44, type: 'major' },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', lat: 13.69, lng: 100.75, type: 'major' },
  { code: 'DMK', name: 'Don Mueang', city: 'Bangkok', country: 'Thailand', lat: 13.91, lng: 100.61, type: 'business' },
  { code: 'KUL', name: 'KLIA', city: 'Kuala Lumpur', country: 'Malaysia', lat: 2.75, lng: 101.71, type: 'major' },
  { code: 'SZX', name: 'Bao\'an', city: 'Shenzhen', country: 'China', lat: 22.64, lng: 113.81, type: 'major' },
  { code: 'PVG', name: 'Pudong', city: 'Shanghai', country: 'China', lat: 31.14, lng: 121.81, type: 'major' },
  { code: 'PEK', name: 'Capital', city: 'Beijing', country: 'China', lat: 40.08, lng: 116.58, type: 'major' },
  { code: 'DEL', name: 'Indira Gandhi', city: 'Delhi', country: 'India', lat: 28.56, lng: 77.10, type: 'major' },
  { code: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', country: 'India', lat: 19.09, lng: 72.87, type: 'major' },
  { code: 'MNL', name: 'Ninoy Aquino', city: 'Manila', country: 'Philippines', lat: 14.51, lng: 121.02, type: 'major' },
  { code: 'CGK', name: 'Soekarno-Hatta', city: 'Jakarta', country: 'Indonesia', lat: -6.13, lng: 106.66, type: 'major' },
  { code: 'SGN', name: 'Tan Son Nhat', city: 'Ho Chi Minh', country: 'Vietnam', lat: 10.82, lng: 106.65, type: 'major' },
  // ── NORTH AMERICA ──
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'USA', lat: 40.64, lng: -73.78, type: 'major' },
  { code: 'TEB', name: 'Teterboro', city: 'New York', country: 'USA', lat: 40.85, lng: -74.06, type: 'business', fbo: 'Signature / Atlantic' },
  { code: 'HPN', name: 'Westchester County', city: 'New York', country: 'USA', lat: 41.07, lng: -73.71, type: 'business', fbo: 'Million Air' },
  { code: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'USA', lat: 33.94, lng: -118.41, type: 'major' },
  { code: 'VNY', name: 'Van Nuys', city: 'Los Angeles', country: 'USA', lat: 34.21, lng: -118.49, type: 'business', fbo: 'Signature / Clay Lacy' },
  { code: 'SFO', name: 'San Francisco', city: 'San Francisco', country: 'USA', lat: 37.62, lng: -122.38, type: 'major' },
  { code: 'SJC', name: 'San Jose / Silicon Valley', city: 'San Jose', country: 'USA', lat: 37.36, lng: -121.93, type: 'business', fbo: 'Atlantic Aviation' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', lat: 25.79, lng: -80.29, type: 'major' },
  { code: 'OPF', name: 'Opa-Locka Executive', city: 'Miami', country: 'USA', lat: 25.91, lng: -80.28, type: 'business', fbo: 'Fontainebleau Aviation' },
  { code: 'ORD', name: 'O\'Hare', city: 'Chicago', country: 'USA', lat: 41.98, lng: -87.90, type: 'major' },
  { code: 'DFW', name: 'Dallas/Fort Worth', city: 'Dallas', country: 'USA', lat: 32.90, lng: -97.04, type: 'major' },
  { code: 'ATL', name: 'Hartsfield-Jackson', city: 'Atlanta', country: 'USA', lat: 33.64, lng: -84.43, type: 'major' },
  { code: 'SEA', name: 'Sea-Tac', city: 'Seattle', country: 'USA', lat: 47.45, lng: -122.31, type: 'major' },
  { code: 'BOS', name: 'Logan', city: 'Boston', country: 'USA', lat: 42.37, lng: -71.02, type: 'major' },
  { code: 'IAD', name: 'Dulles', city: 'Washington DC', country: 'USA', lat: 38.94, lng: -77.46, type: 'major' },
  { code: 'LAS', name: 'Harry Reid', city: 'Las Vegas', country: 'USA', lat: 36.08, lng: -115.15, type: 'major' },
  { code: 'DEN', name: 'Denver', city: 'Denver', country: 'USA', lat: 39.86, lng: -104.67, type: 'major' },
  { code: 'PHX', name: 'Sky Harbor', city: 'Phoenix', country: 'USA', lat: 33.44, lng: -112.01, type: 'major' },
  { code: 'MSP', name: 'Minneapolis-St Paul', city: 'Minneapolis', country: 'USA', lat: 44.88, lng: -93.22, type: 'major' },
  { code: 'DTW', name: 'Detroit Metro', city: 'Detroit', country: 'USA', lat: 42.21, lng: -83.35, type: 'major' },
  { code: 'YYZ', name: 'Pearson', city: 'Toronto', country: 'Canada', lat: 43.68, lng: -79.63, type: 'major' },
  { code: 'YUL', name: 'Trudeau', city: 'Montreal', country: 'Canada', lat: 45.47, lng: -73.74, type: 'major' },
  { code: 'YVR', name: 'Vancouver', city: 'Vancouver', country: 'Canada', lat: 49.19, lng: -123.18, type: 'major' },
  { code: 'MEX', name: 'Benito Juárez', city: 'Mexico City', country: 'Mexico', lat: 19.44, lng: -99.07, type: 'major' },
  // ── SOUTH AMERICA ──
  { code: 'GRU', name: 'Guarulhos', city: 'São Paulo', country: 'Brazil', lat: -23.43, lng: -46.47, type: 'major' },
  { code: 'CGH', name: 'Congonhas', city: 'São Paulo', country: 'Brazil', lat: -23.63, lng: -46.66, type: 'business' },
  { code: 'GIG', name: 'Galeão', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.81, lng: -43.25, type: 'major' },
  { code: 'EZE', name: 'Ezeiza', city: 'Buenos Aires', country: 'Argentina', lat: -34.82, lng: -58.54, type: 'major' },
  { code: 'BOG', name: 'El Dorado', city: 'Bogotá', country: 'Colombia', lat: 4.70, lng: -74.15, type: 'major' },
  { code: 'SCL', name: 'Arturo Merino', city: 'Santiago', country: 'Chile', lat: -33.39, lng: -70.79, type: 'major' },
  { code: 'LIM', name: 'Jorge Chávez', city: 'Lima', country: 'Peru', lat: -12.02, lng: -77.11, type: 'major' },
  // ── AFRICA ──
  { code: 'JNB', name: 'O.R. Tambo', city: 'Johannesburg', country: 'South Africa', lat: -26.14, lng: 28.24, type: 'major' },
  { code: 'CPT', name: 'Cape Town', city: 'Cape Town', country: 'South Africa', lat: -33.97, lng: 18.60, type: 'major' },
  { code: 'NBO', name: 'Jomo Kenyatta', city: 'Nairobi', country: 'Kenya', lat: -1.32, lng: 36.93, type: 'major' },
  { code: 'CAI', name: 'Cairo', city: 'Cairo', country: 'Egypt', lat: 30.12, lng: 31.41, type: 'major' },
  { code: 'CMN', name: 'Mohammed V', city: 'Casablanca', country: 'Morocco', lat: 33.37, lng: -7.59, type: 'major' },
  { code: 'LOS', name: 'Murtala Muhammed', city: 'Lagos', country: 'Nigeria', lat: 6.58, lng: 3.32, type: 'major' },
  { code: 'ADD', name: 'Bole', city: 'Addis Ababa', country: 'Ethiopia', lat: 8.98, lng: 38.80, type: 'major' },
  // ── OCEANIA ──
  { code: 'SYD', name: 'Sydney', city: 'Sydney', country: 'Australia', lat: -33.95, lng: 151.18, type: 'major' },
  { code: 'MEL', name: 'Melbourne', city: 'Melbourne', country: 'Australia', lat: -37.67, lng: 144.84, type: 'major' },
  { code: 'AKL', name: 'Auckland', city: 'Auckland', country: 'New Zealand', lat: -37.01, lng: 174.78, type: 'major' },
  { code: 'BNE', name: 'Brisbane', city: 'Brisbane', country: 'Australia', lat: -27.38, lng: 153.12, type: 'major' },
  // ── CARIBBEAN ──
  { code: 'NAS', name: 'Nassau', city: 'Nassau', country: 'Bahamas', lat: 25.04, lng: -77.47, type: 'major' },
  { code: 'SXM', name: 'Princess Juliana', city: 'St. Maarten', country: 'Sint Maarten', lat: 18.04, lng: -63.11, type: 'major' },
  // ── MALDIVES ──
  { code: 'MLE', name: 'Velana', city: 'Malé', country: 'Maldives', lat: 4.19, lng: 73.53, type: 'major' },
];

// ═══ AIRCRAFT DATABASE ═══
const AIRCRAFT_DB = [
  { name: 'Citation CJ4', category: 'light' as const, seats: 7, range: 3700, img: '✈️' },
  { name: 'Phenom 300E', category: 'light' as const, seats: 8, range: 3650, img: '✈️' },
  { name: 'Learjet 75', category: 'light' as const, seats: 8, range: 3778, img: '✈️' },
  { name: 'Citation XLS+', category: 'midsize' as const, seats: 9, range: 3500, img: '🛩️' },
  { name: 'Hawker 900XP', category: 'midsize' as const, seats: 8, range: 4900, img: '🛩️' },
  { name: 'Praetor 500', category: 'midsize' as const, seats: 9, range: 5300, img: '🛩️' },
  { name: 'Challenger 350', category: 'super-mid' as const, seats: 10, range: 5926, img: '🛫' },
  { name: 'Citation Longitude', category: 'super-mid' as const, seats: 12, range: 6500, img: '🛫' },
  { name: 'Praetor 600', category: 'super-mid' as const, seats: 12, range: 7200, img: '🛫' },
  { name: 'Gulfstream G280', category: 'super-mid' as const, seats: 10, range: 6667, img: '🛫' },
  { name: 'Falcon 2000LXS', category: 'heavy' as const, seats: 10, range: 7400, img: '🛬' },
  { name: 'Challenger 650', category: 'heavy' as const, seats: 12, range: 7400, img: '🛬' },
  { name: 'Gulfstream G550', category: 'heavy' as const, seats: 16, range: 12500, img: '🛬' },
  { name: 'Gulfstream G650ER', category: 'ultra-long' as const, seats: 16, range: 13890, img: '✨' },
  { name: 'Global 7500', category: 'ultra-long' as const, seats: 17, range: 14260, img: '✨' },
  { name: 'Falcon 8X', category: 'ultra-long' as const, seats: 14, range: 11945, img: '✨' },
  { name: 'Dassault Falcon 900LX', category: 'heavy' as const, seats: 12, range: 8800, img: '🛬' },
];

const PROVIDERS: CharterFlight['provider'][] = ['Jettly', 'XO / Vista', 'Amalfi Jets', 'Flapper'];
const AMENITIES_POOL = ['Lie-flat beds', 'Wi-Fi', 'Gourmet catering', 'Champagne bar', 'Shower', 'Conference table', 'Entertainment system', 'USB/AC power', 'Baggage concierge', 'Ground transport'];

function getDistanceKm(a: Airport, b: Airport): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}

function flightDuration(distKm: number): { hours: number; mins: number; str: string } {
  const hours = distKm / 800; // avg 800 km/h
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return { hours: h, mins: m, str: `${h}h ${m}m` };
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// Price formula based on distance + aircraft category
function calcPrice(distKm: number, category: string, isEmptyLeg: boolean): { perSeat: number; full: number; retail: number; savings: number } {
  const basePerkm: Record<string, number> = { light: 5.5, midsize: 7.5, 'super-mid': 10, heavy: 14, 'ultra-long': 18 };
  const rate = basePerkm[category] || 10;
  const full = Math.round(distKm * rate);
  const discount = isEmptyLeg ? 0.35 : 0.55; // empty legs 65% off, shared seats 45% off
  const discounted = Math.round(full * discount);
  const seats = category === 'light' ? 7 : category === 'midsize' ? 9 : category === 'super-mid' ? 11 : 14;
  const perSeat = Math.round(discounted / seats);
  // Commercial biz class equivalent
  const retail = Math.round(distKm * 0.6 + 800); // rough biz class pricing
  const savings = Math.round((1 - perSeat / retail) * 100);
  return { perSeat, full: discounted, retail, savings: Math.max(savings, 15) };
}

// Generate 20+ demo flights dynamically based on a home airport
export function generateDemoFlights(homeAirportCode: string): CharterFlight[] {
  const home = AIRPORTS.find(a => a.code === homeAirportCode) || AIRPORTS[0];
  const flights: CharterFlight[] = [];
  const now = new Date();

  // Get destinations sorted by relevance (mix of distances)
  const destinations = AIRPORTS
    .filter(a => a.code !== home.code && a.type === 'major')
    .sort(() => Math.random() - 0.5)
    .slice(0, 30);

  // Generate 24 flights (mix of types)
  const types: CharterFlight['type'][] = ['empty-leg', 'empty-leg', 'empty-leg', 'shared-seat', 'shared-seat', 'full-charter'];

  for (let i = 0; i < 24; i++) {
    const dest = destinations[i % destinations.length];
    const dist = getDistanceKm(home, dest);
    const duration = flightDuration(dist);
    const aircraft = AIRCRAFT_DB[Math.floor(Math.random() * AIRCRAFT_DB.length)];
    const type = types[i % types.length];
    const provider = PROVIDERS[i % PROVIDERS.length];
    const price = calcPrice(dist, aircraft.category, type === 'empty-leg');
    const daysAhead = 1 + Math.floor(Math.random() * 14);
    const depDate = new Date(now);
    depDate.setDate(depDate.getDate() + daysAhead);
    const depHour = 6 + Math.floor(Math.random() * 14);
    const arrHour = depHour + duration.hours;
    const arrMin = duration.mins;

    const seatsAvail = type === 'full-charter' ? aircraft.seats : (1 + Math.floor(Math.random() * Math.min(4, aircraft.seats)));

    flights.push({
      id: `cf-${i}-${homeAirportCode}`,
      type,
      provider,
      aircraft: aircraft.name,
      aircraftCategory: aircraft.category,
      from: home,
      to: dest,
      departureDate: depDate.toISOString().split('T')[0],
      departureTime: `${String(depHour).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`,
      arrivalTime: `${String(arrHour % 24).padStart(2,'0')}:${String(arrMin).padStart(2,'0')}`,
      flightDuration: duration.str,
      seatsAvailable: seatsAvail,
      totalSeats: aircraft.seats,
      pricePerSeat: price.perSeat,
      fullCharterPrice: price.full,
      originalRetailPrice: price.retail,
      savingsPercent: price.savings,
      amenities: pickRandom(AMENITIES_POOL, 3 + Math.floor(Math.random() * 4)),
      wifiOnboard: Math.random() > 0.2,
      cateringIncluded: Math.random() > 0.3,
      petFriendly: Math.random() > 0.6,
      waitTimeMinutes: aircraft.category === 'light' ? 8 : 12,
      commercialAlternativeWait: 90 + Math.floor(Math.random() * 60),
      fixedRate: provider === 'Amalfi Jets',
      verified: true,
      expiresIn: `${Math.floor(Math.random() * 48) + 1}h ${Math.floor(Math.random() * 59)}m`,
    });
  }

  // Also generate some reverse (inbound) empty legs
  for (let i = 0; i < 6; i++) {
    const dest = destinations[i];
    const dist = getDistanceKm(dest, home);
    const duration = flightDuration(dist);
    const aircraft = AIRCRAFT_DB[Math.floor(Math.random() * AIRCRAFT_DB.length)];
    const price = calcPrice(dist, aircraft.category, true);
    const daysAhead = 1 + Math.floor(Math.random() * 10);
    const depDate = new Date(now);
    depDate.setDate(depDate.getDate() + daysAhead);
    const depHour = 6 + Math.floor(Math.random() * 14);

    flights.push({
      id: `cf-in-${i}-${homeAirportCode}`,
      type: 'empty-leg',
      provider: PROVIDERS[i % PROVIDERS.length],
      aircraft: aircraft.name,
      aircraftCategory: aircraft.category,
      from: dest,
      to: home,
      departureDate: depDate.toISOString().split('T')[0],
      departureTime: `${String(depHour).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`,
      arrivalTime: `${String((depHour + duration.hours) % 24).padStart(2,'0')}:${String(duration.mins).padStart(2,'0')}`,
      flightDuration: duration.str,
      seatsAvailable: aircraft.seats,
      totalSeats: aircraft.seats,
      pricePerSeat: price.perSeat,
      fullCharterPrice: price.full,
      originalRetailPrice: price.retail,
      savingsPercent: price.savings,
      amenities: pickRandom(AMENITIES_POOL, 3 + Math.floor(Math.random() * 3)),
      wifiOnboard: true,
      cateringIncluded: true,
      petFriendly: Math.random() > 0.5,
      waitTimeMinutes: 10,
      commercialAlternativeWait: 105,
      fixedRate: false,
      verified: true,
      expiresIn: `${Math.floor(Math.random() * 24) + 1}h ${Math.floor(Math.random() * 59)}m`,
    });
  }

  return flights.sort((a, b) => a.departureDate.localeCompare(b.departureDate));
}

// Get nearest airports to a given lat/lng within radius
export function getNearbyAirports(lat: number, lng: number, radiusKm = 50): Airport[] {
  return AIRPORTS.filter(a => {
    const dist = getDistanceKm({ lat, lng } as any, a);
    return dist <= radiusKm;
  }).sort((a, b) => {
    const dA = getDistanceKm({ lat, lng } as any, a);
    const dB = getDistanceKm({ lat, lng } as any, b);
    return dA - dB;
  });
}

// Get AI context for concierge
export function getJetSearchAIContext(flights: CharterFlight[], homeAirport: string): string {
  if (!flights.length) return '';
  const emptyLegs = flights.filter(f => f.type === 'empty-leg');
  const sharedSeats = flights.filter(f => f.type === 'shared-seat');
  const charters = flights.filter(f => f.type === 'full-charter');
  const cheapest = [...flights].sort((a, b) => a.pricePerSeat - b.pricePerSeat).slice(0, 5);

  let ctx = `\n\n**✈️ PRIVATE JET SEARCH ENGINE — LIVE AVAILABILITY (from ${homeAirport}):**\n`;
  ctx += `Found ${flights.length} available flights: ${emptyLegs.length} empty legs, ${sharedSeats.length} shared seats, ${charters.length} full charters.\n`;
  ctx += `Providers: Jettly (23K+ aircraft), XO/Vista (seat deals), Amalfi Jets (fixed-rate), Flapper (LATAM/Florida shared).\n\n`;
  ctx += `**Top 5 Best Deals:**\n`;
  cheapest.forEach(f => {
    ctx += `- ${f.type.toUpperCase()}: ${f.from.code}→${f.to.code} on ${f.departureDate} | ${f.aircraft} | €${f.pricePerSeat}/seat (save ${f.savingsPercent}% vs commercial biz) | ${f.flightDuration} | Wait: ${f.waitTimeMinutes}min vs ${f.commercialAlternativeWait}min commercial\n`;
  });
  ctx += `\n**AI INSTRUCTIONS for Private Jet recommendations:**\n`;
  ctx += `1. When user discusses travel, CHECK if an empty leg matches their route/dates — proactively suggest it\n`;
  ctx += `2. Compare private jet seat price vs commercial business class and show time savings (FBO wait vs terminal)\n`;
  ctx += `3. Factor in award points — can user use miles for positioning flights and take private jet for the main leg?\n`;
  ctx += `4. For groups of 4+, calculate if full charter is cheaper per-person than commercial business class\n`;
  ctx += `5. Highlight Amalfi Jets fixed-rate options during peak pricing periods\n`;
  ctx += `6. For LATAM routes, prioritize Flapper shared flights network\n`;
  return ctx;
}
