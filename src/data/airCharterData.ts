// ═══════════════════════════════════════════════════════════
// AIR CHARTER SERVICE — 600+ Airport Directory & Realistic Pricing
// Real-world hourly rates, 4 API providers, empty legs/seats
// ═══════════════════════════════════════════════════════════

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  type: 'major' | 'business' | 'regional';
  fbo?: string;
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
  pricePerSeat: number;
  fullCharterPrice: number;
  originalRetailPrice: number;
  savingsPercent: number;
  amenities: string[];
  wifiOnboard: boolean;
  cateringIncluded: boolean;
  petFriendly: boolean;
  waitTimeMinutes: number;
  commercialAlternativeWait: number;
  image?: string;
  fixedRate?: boolean;
  verified: boolean;
  expiresIn?: string;
}

// ═══ GLOBAL AIRPORT DIRECTORY (600+ airports) ═══
export const AIRPORTS: Airport[] = [
  // ══════════════════ EUROPE ══════════════════
  // UK & Ireland
  { code: 'LHR', name: 'Heathrow', city: 'London', country: 'UK', lat: 51.47, lng: -0.46, type: 'major' },
  { code: 'LGW', name: 'Gatwick', city: 'London', country: 'UK', lat: 51.15, lng: -0.19, type: 'major' },
  { code: 'STN', name: 'Stansted', city: 'London', country: 'UK', lat: 51.89, lng: 0.26, type: 'major' },
  { code: 'LTN', name: 'Luton', city: 'London', country: 'UK', lat: 51.87, lng: -0.37, type: 'business', fbo: 'Signature Flight Support' },
  { code: 'BQH', name: 'Biggin Hill', city: 'London', country: 'UK', lat: 51.33, lng: 0.03, type: 'business', fbo: 'Biggin Hill Executive' },
  { code: 'FAB', name: 'Farnborough', city: 'London', country: 'UK', lat: 51.28, lng: -0.78, type: 'business', fbo: 'TAG Farnborough' },
  { code: 'LCY', name: 'London City', city: 'London', country: 'UK', lat: 51.51, lng: 0.06, type: 'business' },
  { code: 'MAN', name: 'Manchester', city: 'Manchester', country: 'UK', lat: 53.36, lng: -2.27, type: 'major' },
  { code: 'BHX', name: 'Birmingham', city: 'Birmingham', country: 'UK', lat: 52.45, lng: -1.75, type: 'major' },
  { code: 'EDI', name: 'Edinburgh', city: 'Edinburgh', country: 'UK', lat: 55.95, lng: -3.37, type: 'major' },
  { code: 'GLA', name: 'Glasgow', city: 'Glasgow', country: 'UK', lat: 55.87, lng: -4.43, type: 'major' },
  { code: 'BRS', name: 'Bristol', city: 'Bristol', country: 'UK', lat: 51.38, lng: -2.72, type: 'regional' },
  { code: 'LPL', name: 'John Lennon', city: 'Liverpool', country: 'UK', lat: 53.33, lng: -2.85, type: 'regional' },
  { code: 'NCL', name: 'Newcastle', city: 'Newcastle', country: 'UK', lat: 55.04, lng: -1.69, type: 'regional' },
  { code: 'ABZ', name: 'Aberdeen', city: 'Aberdeen', country: 'UK', lat: 57.20, lng: -2.20, type: 'regional' },
  { code: 'JER', name: 'Jersey', city: 'Jersey', country: 'UK', lat: 49.21, lng: -2.20, type: 'regional' },
  { code: 'DUB', name: 'Dublin', city: 'Dublin', country: 'Ireland', lat: 53.42, lng: -6.27, type: 'major' },
  { code: 'SNN', name: 'Shannon', city: 'Shannon', country: 'Ireland', lat: 52.70, lng: -8.92, type: 'regional' },
  { code: 'ORK', name: 'Cork', city: 'Cork', country: 'Ireland', lat: 51.84, lng: -8.49, type: 'regional' },
  // France
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.01, lng: 2.55, type: 'major' },
  { code: 'ORY', name: 'Orly', city: 'Paris', country: 'France', lat: 48.72, lng: 2.37, type: 'major' },
  { code: 'LBG', name: 'Le Bourget', city: 'Paris', country: 'France', lat: 48.97, lng: 2.44, type: 'business', fbo: 'Dassault Falcon Service' },
  { code: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', country: 'France', lat: 43.66, lng: 7.22, type: 'major' },
  { code: 'LYS', name: 'Lyon-Saint Exupéry', city: 'Lyon', country: 'France', lat: 45.73, lng: 5.08, type: 'major' },
  { code: 'MRS', name: 'Marseille Provence', city: 'Marseille', country: 'France', lat: 43.44, lng: 5.22, type: 'major' },
  { code: 'TLS', name: 'Blagnac', city: 'Toulouse', country: 'France', lat: 43.63, lng: 1.37, type: 'major' },
  { code: 'BOD', name: 'Mérignac', city: 'Bordeaux', country: 'France', lat: 44.83, lng: -0.72, type: 'regional' },
  { code: 'NTE', name: 'Nantes Atlantique', city: 'Nantes', country: 'France', lat: 47.16, lng: -1.61, type: 'regional' },
  { code: 'SXB', name: 'Strasbourg', city: 'Strasbourg', country: 'France', lat: 48.54, lng: 7.63, type: 'regional' },
  { code: 'CEQ', name: 'Cannes-Mandelieu', city: 'Cannes', country: 'France', lat: 43.55, lng: 6.95, type: 'business', fbo: 'Aviapartner' },
  // Germany
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany', lat: 50.03, lng: 8.57, type: 'major' },
  { code: 'MUC', name: 'Munich', city: 'Munich', country: 'Germany', lat: 48.35, lng: 11.79, type: 'major' },
  { code: 'OBF', name: 'Oberpfaffenhofen', city: 'Munich', country: 'Germany', lat: 48.08, lng: 11.28, type: 'business', fbo: 'Jet Aviation' },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Germany', lat: 52.36, lng: 13.51, type: 'major' },
  { code: 'DUS', name: 'Düsseldorf', city: 'Düsseldorf', country: 'Germany', lat: 51.29, lng: 6.77, type: 'major' },
  { code: 'HAM', name: 'Hamburg', city: 'Hamburg', country: 'Germany', lat: 53.63, lng: 10.01, type: 'major' },
  { code: 'CGN', name: 'Cologne/Bonn', city: 'Cologne', country: 'Germany', lat: 50.87, lng: 7.14, type: 'major' },
  { code: 'STR', name: 'Stuttgart', city: 'Stuttgart', country: 'Germany', lat: 48.69, lng: 9.22, type: 'major' },
  { code: 'HAJ', name: 'Hannover', city: 'Hannover', country: 'Germany', lat: 52.46, lng: 9.69, type: 'regional' },
  { code: 'NUE', name: 'Nuremberg', city: 'Nuremberg', country: 'Germany', lat: 49.50, lng: 11.08, type: 'regional' },
  { code: 'LEJ', name: 'Leipzig/Halle', city: 'Leipzig', country: 'Germany', lat: 51.42, lng: 12.24, type: 'regional' },
  // Switzerland
  { code: 'ZRH', name: 'Zürich', city: 'Zürich', country: 'Switzerland', lat: 47.46, lng: 8.55, type: 'major' },
  { code: 'GVA', name: 'Geneva', city: 'Geneva', country: 'Switzerland', lat: 46.24, lng: 6.11, type: 'major' },
  { code: 'BSL', name: 'Basel-Mulhouse', city: 'Basel', country: 'Switzerland', lat: 47.59, lng: 7.53, type: 'regional' },
  { code: 'BRN', name: 'Bern', city: 'Bern', country: 'Switzerland', lat: 46.91, lng: 7.50, type: 'regional' },
  { code: 'LUG', name: 'Lugano-Agno', city: 'Lugano', country: 'Switzerland', lat: 46.00, lng: 8.91, type: 'business' },
  { code: 'SMV', name: 'Samedan/St. Moritz', city: 'St. Moritz', country: 'Switzerland', lat: 46.53, lng: 9.88, type: 'business', fbo: 'Engadin Airport' },
  // Italy
  { code: 'FCO', name: 'Fiumicino', city: 'Rome', country: 'Italy', lat: 41.80, lng: 12.25, type: 'major' },
  { code: 'CIA', name: 'Ciampino', city: 'Rome', country: 'Italy', lat: 41.80, lng: 12.59, type: 'business' },
  { code: 'MXP', name: 'Malpensa', city: 'Milan', country: 'Italy', lat: 45.63, lng: 8.72, type: 'major' },
  { code: 'LIN', name: 'Linate', city: 'Milan', country: 'Italy', lat: 45.45, lng: 9.28, type: 'business' },
  { code: 'VCE', name: 'Marco Polo', city: 'Venice', country: 'Italy', lat: 45.51, lng: 12.35, type: 'major' },
  { code: 'FLR', name: 'Peretola', city: 'Florence', country: 'Italy', lat: 43.81, lng: 11.20, type: 'regional' },
  { code: 'NAP', name: 'Capodichino', city: 'Naples', country: 'Italy', lat: 40.88, lng: 14.29, type: 'major' },
  { code: 'BLQ', name: 'Guglielmo Marconi', city: 'Bologna', country: 'Italy', lat: 44.54, lng: 11.29, type: 'regional' },
  { code: 'TRN', name: 'Caselle', city: 'Turin', country: 'Italy', lat: 45.20, lng: 7.65, type: 'regional' },
  { code: 'PSA', name: 'Galileo Galilei', city: 'Pisa', country: 'Italy', lat: 43.68, lng: 10.39, type: 'regional' },
  { code: 'CTA', name: 'Fontanarossa', city: 'Catania', country: 'Italy', lat: 37.47, lng: 15.07, type: 'regional' },
  { code: 'PMO', name: 'Falcone-Borsellino', city: 'Palermo', country: 'Italy', lat: 38.18, lng: 13.10, type: 'regional' },
  { code: 'OLB', name: 'Costa Smeralda', city: 'Olbia', country: 'Italy', lat: 40.90, lng: 9.52, type: 'business', fbo: 'Eccelsa Aviation' },
  // Spain
  { code: 'MAD', name: 'Barajas', city: 'Madrid', country: 'Spain', lat: 40.47, lng: -3.56, type: 'major' },
  { code: 'BCN', name: 'El Prat', city: 'Barcelona', country: 'Spain', lat: 41.30, lng: 2.08, type: 'major' },
  { code: 'PMI', name: 'Palma de Mallorca', city: 'Palma', country: 'Spain', lat: 39.55, lng: 2.74, type: 'major' },
  { code: 'AGP', name: 'Málaga-Costa del Sol', city: 'Málaga', country: 'Spain', lat: 36.67, lng: -4.49, type: 'major' },
  { code: 'IBZ', name: 'Ibiza', city: 'Ibiza', country: 'Spain', lat: 38.87, lng: 1.37, type: 'major' },
  { code: 'ALC', name: 'Alicante-Elche', city: 'Alicante', country: 'Spain', lat: 38.28, lng: -0.56, type: 'major' },
  { code: 'VLC', name: 'Valencia', city: 'Valencia', country: 'Spain', lat: 39.49, lng: -0.47, type: 'major' },
  { code: 'SVQ', name: 'San Pablo', city: 'Seville', country: 'Spain', lat: 37.42, lng: -5.89, type: 'regional' },
  { code: 'BIO', name: 'Bilbao', city: 'Bilbao', country: 'Spain', lat: 43.30, lng: -2.91, type: 'regional' },
  { code: 'TFS', name: 'Tenerife South', city: 'Tenerife', country: 'Spain', lat: 28.04, lng: -16.57, type: 'major' },
  { code: 'LPA', name: 'Gran Canaria', city: 'Las Palmas', country: 'Spain', lat: 27.93, lng: -15.39, type: 'major' },
  // Netherlands, Belgium, Luxembourg
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Netherlands', lat: 52.31, lng: 4.77, type: 'major' },
  { code: 'RTM', name: 'Rotterdam/The Hague', city: 'Rotterdam', country: 'Netherlands', lat: 51.96, lng: 4.44, type: 'business' },
  { code: 'EIN', name: 'Eindhoven', city: 'Eindhoven', country: 'Netherlands', lat: 51.45, lng: 5.37, type: 'regional' },
  { code: 'BRU', name: 'Brussels', city: 'Brussels', country: 'Belgium', lat: 50.90, lng: 4.48, type: 'major' },
  { code: 'ANR', name: 'Antwerp', city: 'Antwerp', country: 'Belgium', lat: 51.19, lng: 4.46, type: 'business' },
  { code: 'LUX', name: 'Luxembourg', city: 'Luxembourg', country: 'Luxembourg', lat: 49.63, lng: 6.21, type: 'major' },
  // Austria
  { code: 'VIE', name: 'Vienna', city: 'Vienna', country: 'Austria', lat: 48.11, lng: 16.57, type: 'major' },
  { code: 'SZG', name: 'Salzburg', city: 'Salzburg', country: 'Austria', lat: 47.79, lng: 13.00, type: 'regional' },
  { code: 'INN', name: 'Innsbruck', city: 'Innsbruck', country: 'Austria', lat: 47.26, lng: 11.34, type: 'regional' },
  // Nordics
  { code: 'CPH', name: 'Copenhagen', city: 'Copenhagen', country: 'Denmark', lat: 55.62, lng: 12.66, type: 'major' },
  { code: 'BLL', name: 'Billund', city: 'Billund', country: 'Denmark', lat: 55.74, lng: 9.15, type: 'regional' },
  { code: 'OSL', name: 'Gardermoen', city: 'Oslo', country: 'Norway', lat: 60.20, lng: 11.08, type: 'major' },
  { code: 'BGO', name: 'Bergen Flesland', city: 'Bergen', country: 'Norway', lat: 60.29, lng: 5.23, type: 'regional' },
  { code: 'TRD', name: 'Trondheim Værnes', city: 'Trondheim', country: 'Norway', lat: 63.46, lng: 10.92, type: 'regional' },
  { code: 'ARN', name: 'Arlanda', city: 'Stockholm', country: 'Sweden', lat: 59.65, lng: 17.94, type: 'major' },
  { code: 'BMA', name: 'Bromma', city: 'Stockholm', country: 'Sweden', lat: 59.35, lng: 17.94, type: 'business' },
  { code: 'GOT', name: 'Landvetter', city: 'Gothenburg', country: 'Sweden', lat: 57.66, lng: 12.29, type: 'regional' },
  { code: 'MMX', name: 'Malmö Sturup', city: 'Malmö', country: 'Sweden', lat: 55.53, lng: 13.37, type: 'regional' },
  { code: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki', country: 'Finland', lat: 60.32, lng: 24.96, type: 'major' },
  { code: 'TMP', name: 'Tampere-Pirkkala', city: 'Tampere', country: 'Finland', lat: 61.41, lng: 23.60, type: 'regional' },
  { code: 'KEF', name: 'Keflavík', city: 'Reykjavík', country: 'Iceland', lat: 63.98, lng: -22.61, type: 'major' },
  // Portugal
  { code: 'LIS', name: 'Lisbon', city: 'Lisbon', country: 'Portugal', lat: 38.77, lng: -9.13, type: 'major' },
  { code: 'OPO', name: 'Francisco Sá Carneiro', city: 'Porto', country: 'Portugal', lat: 41.24, lng: -8.68, type: 'major' },
  { code: 'FAO', name: 'Faro', city: 'Faro', country: 'Portugal', lat: 37.01, lng: -7.97, type: 'major' },
  { code: 'FNC', name: 'Madeira', city: 'Funchal', country: 'Portugal', lat: 32.69, lng: -16.77, type: 'regional' },
  // Greece & Cyprus
  { code: 'ATH', name: 'Athens', city: 'Athens', country: 'Greece', lat: 37.94, lng: 23.94, type: 'major' },
  { code: 'SKG', name: 'Thessaloniki', city: 'Thessaloniki', country: 'Greece', lat: 40.52, lng: 22.97, type: 'major' },
  { code: 'JMK', name: 'Mykonos', city: 'Mykonos', country: 'Greece', lat: 37.44, lng: 25.35, type: 'business' },
  { code: 'JTR', name: 'Santorini', city: 'Santorini', country: 'Greece', lat: 36.40, lng: 25.48, type: 'business' },
  { code: 'CFU', name: 'Corfu', city: 'Corfu', country: 'Greece', lat: 39.60, lng: 19.91, type: 'regional' },
  { code: 'HER', name: 'Heraklion', city: 'Heraklion', country: 'Greece', lat: 35.34, lng: 25.18, type: 'major' },
  { code: 'RHO', name: 'Rhodes', city: 'Rhodes', country: 'Greece', lat: 36.41, lng: 28.09, type: 'regional' },
  { code: 'LCA', name: 'Larnaca', city: 'Larnaca', country: 'Cyprus', lat: 34.88, lng: 33.62, type: 'major' },
  { code: 'PFO', name: 'Paphos', city: 'Paphos', country: 'Cyprus', lat: 34.72, lng: 32.49, type: 'regional' },
  // Turkey
  { code: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'Turkey', lat: 41.26, lng: 28.74, type: 'major' },
  { code: 'SAW', name: 'Sabiha Gökçen', city: 'Istanbul', country: 'Turkey', lat: 40.90, lng: 29.31, type: 'major' },
  { code: 'ESB', name: 'Esenboğa', city: 'Ankara', country: 'Turkey', lat: 40.13, lng: 32.99, type: 'major' },
  { code: 'AYT', name: 'Antalya', city: 'Antalya', country: 'Turkey', lat: 36.90, lng: 30.80, type: 'major' },
  { code: 'ADB', name: 'Adnan Menderes', city: 'Izmir', country: 'Turkey', lat: 38.29, lng: 27.16, type: 'major' },
  { code: 'DLM', name: 'Dalaman', city: 'Dalaman', country: 'Turkey', lat: 36.71, lng: 28.79, type: 'regional' },
  { code: 'BJV', name: 'Milas-Bodrum', city: 'Bodrum', country: 'Turkey', lat: 37.25, lng: 27.66, type: 'regional' },
  // Eastern Europe
  { code: 'WAW', name: 'Chopin', city: 'Warsaw', country: 'Poland', lat: 52.17, lng: 20.97, type: 'major' },
  { code: 'KRK', name: 'John Paul II', city: 'Kraków', country: 'Poland', lat: 50.08, lng: 19.78, type: 'major' },
  { code: 'GDN', name: 'Gdańsk Lech Wałęsa', city: 'Gdańsk', country: 'Poland', lat: 54.38, lng: 18.47, type: 'regional' },
  { code: 'WRO', name: 'Copernicus', city: 'Wrocław', country: 'Poland', lat: 51.10, lng: 16.89, type: 'regional' },
  { code: 'PRG', name: 'Václav Havel', city: 'Prague', country: 'Czech Republic', lat: 50.10, lng: 14.26, type: 'major' },
  { code: 'BTS', name: 'M. R. Štefánik', city: 'Bratislava', country: 'Slovakia', lat: 48.17, lng: 17.21, type: 'regional' },
  { code: 'BUD', name: 'Liszt Ferenc', city: 'Budapest', country: 'Hungary', lat: 47.44, lng: 19.26, type: 'major' },
  { code: 'OTP', name: 'Henri Coandă', city: 'Bucharest', country: 'Romania', lat: 44.57, lng: 26.08, type: 'major' },
  { code: 'CLJ', name: 'Cluj-Napoca', city: 'Cluj-Napoca', country: 'Romania', lat: 46.78, lng: 23.69, type: 'regional' },
  { code: 'SOF', name: 'Sofia', city: 'Sofia', country: 'Bulgaria', lat: 42.70, lng: 23.32, type: 'major' },
  { code: 'ZAG', name: 'Franjo Tuđman', city: 'Zagreb', country: 'Croatia', lat: 45.74, lng: 16.07, type: 'major' },
  { code: 'SPU', name: 'Split', city: 'Split', country: 'Croatia', lat: 43.54, lng: 16.30, type: 'major' },
  { code: 'DBV', name: 'Dubrovnik', city: 'Dubrovnik', country: 'Croatia', lat: 42.56, lng: 18.27, type: 'major' },
  { code: 'LJU', name: 'Ljubljana Jože Pučnik', city: 'Ljubljana', country: 'Slovenia', lat: 46.22, lng: 14.46, type: 'regional' },
  { code: 'BEG', name: 'Nikola Tesla', city: 'Belgrade', country: 'Serbia', lat: 44.82, lng: 20.31, type: 'major' },
  { code: 'TIA', name: 'Mother Teresa', city: 'Tirana', country: 'Albania', lat: 41.41, lng: 19.72, type: 'regional' },
  // Baltics
  { code: 'TLL', name: 'Tallinn', city: 'Tallinn', country: 'Estonia', lat: 59.41, lng: 24.83, type: 'regional' },
  { code: 'RIX', name: 'Riga', city: 'Riga', country: 'Latvia', lat: 56.92, lng: 23.97, type: 'major' },
  { code: 'VNO', name: 'Vilnius', city: 'Vilnius', country: 'Lithuania', lat: 54.63, lng: 25.29, type: 'regional' },
  // Monaco / Malta
  { code: 'MCM', name: 'Monaco Heliport', city: 'Monaco', country: 'Monaco', lat: 43.73, lng: 7.42, type: 'business' },
  { code: 'MLA', name: 'Malta', city: 'Valletta', country: 'Malta', lat: 35.86, lng: 14.48, type: 'major' },

  // ══════════════════ MIDDLE EAST ══════════════════
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', lat: 25.25, lng: 55.36, type: 'major' },
  { code: 'DWC', name: 'Al Maktoum', city: 'Dubai', country: 'UAE', lat: 24.90, lng: 55.16, type: 'business', fbo: 'DC Aviation Al-Futtaim' },
  { code: 'AUH', name: 'Abu Dhabi', city: 'Abu Dhabi', country: 'UAE', lat: 24.44, lng: 54.65, type: 'major' },
  { code: 'SHJ', name: 'Sharjah', city: 'Sharjah', country: 'UAE', lat: 25.33, lng: 55.52, type: 'business' },
  { code: 'DOH', name: 'Hamad', city: 'Doha', country: 'Qatar', lat: 25.27, lng: 51.61, type: 'major' },
  { code: 'RUH', name: 'King Khalid', city: 'Riyadh', country: 'Saudi Arabia', lat: 24.96, lng: 46.70, type: 'major' },
  { code: 'JED', name: 'King Abdulaziz', city: 'Jeddah', country: 'Saudi Arabia', lat: 21.67, lng: 39.16, type: 'major' },
  { code: 'DMM', name: 'King Fahd', city: 'Dammam', country: 'Saudi Arabia', lat: 26.47, lng: 49.80, type: 'major' },
  { code: 'MED', name: 'Prince Mohammed', city: 'Medina', country: 'Saudi Arabia', lat: 24.55, lng: 39.70, type: 'regional' },
  { code: 'BAH', name: 'Bahrain', city: 'Manama', country: 'Bahrain', lat: 26.27, lng: 50.63, type: 'major' },
  { code: 'MCT', name: 'Muscat', city: 'Muscat', country: 'Oman', lat: 23.59, lng: 58.28, type: 'major' },
  { code: 'KWI', name: 'Kuwait', city: 'Kuwait City', country: 'Kuwait', lat: 29.23, lng: 47.97, type: 'major' },
  { code: 'AMM', name: 'Queen Alia', city: 'Amman', country: 'Jordan', lat: 31.72, lng: 35.99, type: 'major' },
  { code: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'Israel', lat: 32.01, lng: 34.89, type: 'major' },
  { code: 'BEY', name: 'Rafic Hariri', city: 'Beirut', country: 'Lebanon', lat: 33.82, lng: 35.49, type: 'major' },

  // ══════════════════ ASIA PACIFIC ══════════════════
  // East Asia
  { code: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japan', lat: 35.76, lng: 140.39, type: 'major' },
  { code: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japan', lat: 35.55, lng: 139.78, type: 'major' },
  { code: 'KIX', name: 'Kansai', city: 'Osaka', country: 'Japan', lat: 34.43, lng: 135.23, type: 'major' },
  { code: 'ITM', name: 'Itami', city: 'Osaka', country: 'Japan', lat: 34.79, lng: 135.44, type: 'regional' },
  { code: 'NGO', name: 'Chubu Centrair', city: 'Nagoya', country: 'Japan', lat: 34.86, lng: 136.81, type: 'major' },
  { code: 'FUK', name: 'Fukuoka', city: 'Fukuoka', country: 'Japan', lat: 33.59, lng: 130.45, type: 'major' },
  { code: 'CTS', name: 'New Chitose', city: 'Sapporo', country: 'Japan', lat: 42.78, lng: 141.69, type: 'major' },
  { code: 'OKA', name: 'Naha', city: 'Okinawa', country: 'Japan', lat: 26.20, lng: 127.65, type: 'major' },
  { code: 'ICN', name: 'Incheon', city: 'Seoul', country: 'South Korea', lat: 37.46, lng: 126.44, type: 'major' },
  { code: 'GMP', name: 'Gimpo', city: 'Seoul', country: 'South Korea', lat: 37.56, lng: 126.79, type: 'business' },
  { code: 'PUS', name: 'Gimhae', city: 'Busan', country: 'South Korea', lat: 35.18, lng: 128.94, type: 'major' },
  { code: 'CJU', name: 'Jeju', city: 'Jeju', country: 'South Korea', lat: 33.51, lng: 126.49, type: 'major' },
  { code: 'PEK', name: 'Capital', city: 'Beijing', country: 'China', lat: 40.08, lng: 116.58, type: 'major' },
  { code: 'PKX', name: 'Daxing', city: 'Beijing', country: 'China', lat: 39.51, lng: 116.41, type: 'major' },
  { code: 'PVG', name: 'Pudong', city: 'Shanghai', country: 'China', lat: 31.14, lng: 121.81, type: 'major' },
  { code: 'SHA', name: 'Hongqiao', city: 'Shanghai', country: 'China', lat: 31.20, lng: 121.34, type: 'major' },
  { code: 'CAN', name: 'Baiyun', city: 'Guangzhou', country: 'China', lat: 23.39, lng: 113.30, type: 'major' },
  { code: 'SZX', name: 'Bao\'an', city: 'Shenzhen', country: 'China', lat: 22.64, lng: 113.81, type: 'major' },
  { code: 'CTU', name: 'Tianfu', city: 'Chengdu', country: 'China', lat: 30.32, lng: 104.44, type: 'major' },
  { code: 'CKG', name: 'Jiangbei', city: 'Chongqing', country: 'China', lat: 29.72, lng: 106.64, type: 'major' },
  { code: 'WUH', name: 'Tianhe', city: 'Wuhan', country: 'China', lat: 30.78, lng: 114.21, type: 'major' },
  { code: 'XIY', name: 'Xianyang', city: 'Xi\'an', country: 'China', lat: 34.45, lng: 108.75, type: 'major' },
  { code: 'HGH', name: 'Xiaoshan', city: 'Hangzhou', country: 'China', lat: 30.23, lng: 120.43, type: 'major' },
  { code: 'TSN', name: 'Binhai', city: 'Tianjin', country: 'China', lat: 39.12, lng: 117.35, type: 'major' },
  { code: 'NKG', name: 'Lukou', city: 'Nanjing', country: 'China', lat: 31.74, lng: 118.86, type: 'major' },
  { code: 'DLC', name: 'Zhoushuizi', city: 'Dalian', country: 'China', lat: 38.97, lng: 121.54, type: 'major' },
  { code: 'KMG', name: 'Changshui', city: 'Kunming', country: 'China', lat: 25.10, lng: 102.93, type: 'major' },
  { code: 'XMN', name: 'Gaoqi', city: 'Xiamen', country: 'China', lat: 24.54, lng: 118.13, type: 'major' },
  { code: 'HKG', name: 'Hong Kong', city: 'Hong Kong', country: 'China', lat: 22.31, lng: 113.91, type: 'major' },
  { code: 'MFM', name: 'Macau', city: 'Macau', country: 'China', lat: 22.15, lng: 113.59, type: 'regional' },
  { code: 'TPE', name: 'Taoyuan', city: 'Taipei', country: 'Taiwan', lat: 25.08, lng: 121.23, type: 'major' },
  { code: 'TSA', name: 'Songshan', city: 'Taipei', country: 'Taiwan', lat: 25.07, lng: 121.55, type: 'business' },
  { code: 'KHH', name: 'Kaohsiung', city: 'Kaohsiung', country: 'Taiwan', lat: 22.58, lng: 120.35, type: 'regional' },
  { code: 'ULN', name: 'Chinggis Khaan', city: 'Ulaanbaatar', country: 'Mongolia', lat: 47.85, lng: 106.77, type: 'major' },
  // Southeast Asia
  { code: 'SIN', name: 'Changi', city: 'Singapore', country: 'Singapore', lat: 1.36, lng: 103.99, type: 'major' },
  { code: 'XSP', name: 'Seletar', city: 'Singapore', country: 'Singapore', lat: 1.42, lng: 103.87, type: 'business', fbo: 'Jet Aviation Seletar' },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', lat: 13.69, lng: 100.75, type: 'major' },
  { code: 'DMK', name: 'Don Mueang', city: 'Bangkok', country: 'Thailand', lat: 13.91, lng: 100.61, type: 'business' },
  { code: 'CNX', name: 'Chiang Mai', city: 'Chiang Mai', country: 'Thailand', lat: 18.77, lng: 98.96, type: 'major' },
  { code: 'HKT', name: 'Phuket', city: 'Phuket', country: 'Thailand', lat: 8.11, lng: 98.31, type: 'major' },
  { code: 'USM', name: 'Koh Samui', city: 'Koh Samui', country: 'Thailand', lat: 9.55, lng: 100.06, type: 'regional' },
  { code: 'KUL', name: 'KLIA', city: 'Kuala Lumpur', country: 'Malaysia', lat: 2.75, lng: 101.71, type: 'major' },
  { code: 'SZB', name: 'Sultan Abdul Aziz Shah', city: 'Kuala Lumpur', country: 'Malaysia', lat: 3.13, lng: 101.55, type: 'business' },
  { code: 'PEN', name: 'Penang', city: 'Penang', country: 'Malaysia', lat: 5.30, lng: 100.28, type: 'regional' },
  { code: 'BKI', name: 'Kota Kinabalu', city: 'Kota Kinabalu', country: 'Malaysia', lat: 5.94, lng: 116.05, type: 'regional' },
  { code: 'LGK', name: 'Langkawi', city: 'Langkawi', country: 'Malaysia', lat: 6.33, lng: 99.73, type: 'regional' },
  { code: 'CGK', name: 'Soekarno-Hatta', city: 'Jakarta', country: 'Indonesia', lat: -6.13, lng: 106.66, type: 'major' },
  { code: 'HLP', name: 'Halim Perdanakusuma', city: 'Jakarta', country: 'Indonesia', lat: -6.27, lng: 106.89, type: 'business' },
  { code: 'DPS', name: 'Ngurah Rai', city: 'Bali', country: 'Indonesia', lat: -8.75, lng: 115.17, type: 'major' },
  { code: 'SUB', name: 'Juanda', city: 'Surabaya', country: 'Indonesia', lat: -7.38, lng: 112.79, type: 'major' },
  { code: 'UPG', name: 'Sultan Hasanuddin', city: 'Makassar', country: 'Indonesia', lat: -5.06, lng: 119.55, type: 'regional' },
  { code: 'MNL', name: 'Ninoy Aquino', city: 'Manila', country: 'Philippines', lat: 14.51, lng: 121.02, type: 'major' },
  { code: 'CEB', name: 'Mactan-Cebu', city: 'Cebu', country: 'Philippines', lat: 10.31, lng: 123.98, type: 'major' },
  { code: 'CRK', name: 'Clark', city: 'Clark', country: 'Philippines', lat: 15.19, lng: 120.56, type: 'business' },
  { code: 'SGN', name: 'Tan Son Nhat', city: 'Ho Chi Minh', country: 'Vietnam', lat: 10.82, lng: 106.65, type: 'major' },
  { code: 'HAN', name: 'Noi Bai', city: 'Hanoi', country: 'Vietnam', lat: 21.22, lng: 105.81, type: 'major' },
  { code: 'DAD', name: 'Da Nang', city: 'Da Nang', country: 'Vietnam', lat: 16.04, lng: 108.20, type: 'major' },
  { code: 'PQC', name: 'Phu Quoc', city: 'Phu Quoc', country: 'Vietnam', lat: 10.17, lng: 103.99, type: 'regional' },
  { code: 'PNH', name: 'Phnom Penh', city: 'Phnom Penh', country: 'Cambodia', lat: 11.55, lng: 104.84, type: 'major' },
  { code: 'REP', name: 'Siem Reap Angkor', city: 'Siem Reap', country: 'Cambodia', lat: 13.41, lng: 103.81, type: 'regional' },
  { code: 'VTE', name: 'Wattay', city: 'Vientiane', country: 'Laos', lat: 17.99, lng: 102.56, type: 'regional' },
  { code: 'RGN', name: 'Yangon', city: 'Yangon', country: 'Myanmar', lat: 16.91, lng: 96.13, type: 'major' },
  { code: 'BWN', name: 'Brunei', city: 'Bandar Seri Begawan', country: 'Brunei', lat: 4.94, lng: 114.93, type: 'regional' },
  // South Asia
  { code: 'DEL', name: 'Indira Gandhi', city: 'Delhi', country: 'India', lat: 28.56, lng: 77.10, type: 'major' },
  { code: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', country: 'India', lat: 19.09, lng: 72.87, type: 'major' },
  { code: 'BLR', name: 'Kempegowda', city: 'Bangalore', country: 'India', lat: 13.20, lng: 77.71, type: 'major' },
  { code: 'MAA', name: 'Chennai', city: 'Chennai', country: 'India', lat: 12.99, lng: 80.17, type: 'major' },
  { code: 'HYD', name: 'Rajiv Gandhi', city: 'Hyderabad', country: 'India', lat: 17.23, lng: 78.43, type: 'major' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata', country: 'India', lat: 22.65, lng: 88.45, type: 'major' },
  { code: 'GOI', name: 'Dabolim/Manohar', city: 'Goa', country: 'India', lat: 15.38, lng: 73.83, type: 'major' },
  { code: 'COK', name: 'Cochin', city: 'Kochi', country: 'India', lat: 10.15, lng: 76.40, type: 'regional' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel', city: 'Ahmedabad', country: 'India', lat: 23.07, lng: 72.63, type: 'regional' },
  { code: 'PNQ', name: 'Pune', city: 'Pune', country: 'India', lat: 18.58, lng: 73.92, type: 'regional' },
  { code: 'JAI', name: 'Jaipur', city: 'Jaipur', country: 'India', lat: 26.82, lng: 75.81, type: 'regional' },
  { code: 'CMB', name: 'Bandaranaike', city: 'Colombo', country: 'Sri Lanka', lat: 7.18, lng: 79.88, type: 'major' },
  { code: 'DAC', name: 'Hazrat Shahjalal', city: 'Dhaka', country: 'Bangladesh', lat: 23.84, lng: 90.40, type: 'major' },
  { code: 'KTM', name: 'Tribhuvan', city: 'Kathmandu', country: 'Nepal', lat: 27.70, lng: 85.36, type: 'major' },
  { code: 'ISB', name: 'Islamabad', city: 'Islamabad', country: 'Pakistan', lat: 33.62, lng: 73.10, type: 'major' },
  { code: 'KHI', name: 'Jinnah', city: 'Karachi', country: 'Pakistan', lat: 24.91, lng: 67.16, type: 'major' },
  { code: 'LHE', name: 'Allama Iqbal', city: 'Lahore', country: 'Pakistan', lat: 31.52, lng: 74.40, type: 'major' },
  { code: 'MLE', name: 'Velana', city: 'Malé', country: 'Maldives', lat: 4.19, lng: 73.53, type: 'major' },

  // ══════════════════ NORTH AMERICA ══════════════════
  // USA — Major hubs
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'USA', lat: 40.64, lng: -73.78, type: 'major' },
  { code: 'EWR', name: 'Newark Liberty', city: 'New York', country: 'USA', lat: 40.69, lng: -74.17, type: 'major' },
  { code: 'LGA', name: 'LaGuardia', city: 'New York', country: 'USA', lat: 40.78, lng: -73.87, type: 'major' },
  { code: 'TEB', name: 'Teterboro', city: 'New York', country: 'USA', lat: 40.85, lng: -74.06, type: 'business', fbo: 'Signature / Atlantic' },
  { code: 'HPN', name: 'Westchester County', city: 'New York', country: 'USA', lat: 41.07, lng: -73.71, type: 'business', fbo: 'Million Air' },
  { code: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'USA', lat: 33.94, lng: -118.41, type: 'major' },
  { code: 'VNY', name: 'Van Nuys', city: 'Los Angeles', country: 'USA', lat: 34.21, lng: -118.49, type: 'business', fbo: 'Signature / Clay Lacy' },
  { code: 'BUR', name: 'Hollywood Burbank', city: 'Los Angeles', country: 'USA', lat: 34.20, lng: -118.36, type: 'business' },
  { code: 'SNA', name: 'John Wayne', city: 'Orange County', country: 'USA', lat: 33.68, lng: -117.87, type: 'business' },
  { code: 'SFO', name: 'San Francisco', city: 'San Francisco', country: 'USA', lat: 37.62, lng: -122.38, type: 'major' },
  { code: 'OAK', name: 'Oakland', city: 'Oakland', country: 'USA', lat: 37.72, lng: -122.22, type: 'business' },
  { code: 'SJC', name: 'San Jose', city: 'San Jose', country: 'USA', lat: 37.36, lng: -121.93, type: 'business', fbo: 'Atlantic Aviation' },
  { code: 'PAO', name: 'Palo Alto', city: 'Palo Alto', country: 'USA', lat: 37.46, lng: -122.12, type: 'business' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', lat: 25.79, lng: -80.29, type: 'major' },
  { code: 'FLL', name: 'Fort Lauderdale', city: 'Fort Lauderdale', country: 'USA', lat: 26.07, lng: -80.15, type: 'major' },
  { code: 'OPF', name: 'Opa-Locka Executive', city: 'Miami', country: 'USA', lat: 25.91, lng: -80.28, type: 'business', fbo: 'Fontainebleau Aviation' },
  { code: 'PBI', name: 'Palm Beach', city: 'West Palm Beach', country: 'USA', lat: 26.68, lng: -80.10, type: 'business', fbo: 'Atlantic Aviation' },
  { code: 'BCT', name: 'Boca Raton', city: 'Boca Raton', country: 'USA', lat: 26.38, lng: -80.11, type: 'business' },
  { code: 'ORD', name: 'O\'Hare', city: 'Chicago', country: 'USA', lat: 41.98, lng: -87.90, type: 'major' },
  { code: 'MDW', name: 'Midway', city: 'Chicago', country: 'USA', lat: 41.79, lng: -87.75, type: 'major' },
  { code: 'PWK', name: 'Chicago Executive', city: 'Chicago', country: 'USA', lat: 42.11, lng: -87.90, type: 'business', fbo: 'Atlantic Aviation' },
  { code: 'DFW', name: 'Dallas/Fort Worth', city: 'Dallas', country: 'USA', lat: 32.90, lng: -97.04, type: 'major' },
  { code: 'DAL', name: 'Love Field', city: 'Dallas', country: 'USA', lat: 32.85, lng: -96.85, type: 'business' },
  { code: 'ADS', name: 'Addison', city: 'Dallas', country: 'USA', lat: 32.97, lng: -96.84, type: 'business', fbo: 'Million Air' },
  { code: 'IAH', name: 'George Bush', city: 'Houston', country: 'USA', lat: 29.98, lng: -95.34, type: 'major' },
  { code: 'HOU', name: 'William P. Hobby', city: 'Houston', country: 'USA', lat: 29.65, lng: -95.28, type: 'business' },
  { code: 'SGR', name: 'Sugar Land', city: 'Houston', country: 'USA', lat: 29.62, lng: -95.66, type: 'business' },
  { code: 'ATL', name: 'Hartsfield-Jackson', city: 'Atlanta', country: 'USA', lat: 33.64, lng: -84.43, type: 'major' },
  { code: 'PDK', name: 'DeKalb-Peachtree', city: 'Atlanta', country: 'USA', lat: 33.88, lng: -84.30, type: 'business', fbo: 'Signature Flight Support' },
  { code: 'SEA', name: 'Sea-Tac', city: 'Seattle', country: 'USA', lat: 47.45, lng: -122.31, type: 'major' },
  { code: 'BFI', name: 'Boeing Field', city: 'Seattle', country: 'USA', lat: 47.53, lng: -122.30, type: 'business' },
  { code: 'BOS', name: 'Logan', city: 'Boston', country: 'USA', lat: 42.37, lng: -71.02, type: 'major' },
  { code: 'BED', name: 'Hanscom Field', city: 'Boston', country: 'USA', lat: 42.47, lng: -71.29, type: 'business', fbo: 'Jet Aviation' },
  { code: 'IAD', name: 'Dulles', city: 'Washington DC', country: 'USA', lat: 38.94, lng: -77.46, type: 'major' },
  { code: 'DCA', name: 'Reagan National', city: 'Washington DC', country: 'USA', lat: 38.85, lng: -77.04, type: 'major' },
  { code: 'GAI', name: 'Montgomery County', city: 'Washington DC', country: 'USA', lat: 39.17, lng: -77.17, type: 'business' },
  { code: 'LAS', name: 'Harry Reid', city: 'Las Vegas', country: 'USA', lat: 36.08, lng: -115.15, type: 'major' },
  { code: 'HND', name: 'Henderson Executive', city: 'Las Vegas', country: 'USA', lat: 35.97, lng: -115.13, type: 'business' },
  { code: 'DEN', name: 'Denver', city: 'Denver', country: 'USA', lat: 39.86, lng: -104.67, type: 'major' },
  { code: 'APA', name: 'Centennial', city: 'Denver', country: 'USA', lat: 39.57, lng: -104.85, type: 'business', fbo: 'Signature / TAC Air' },
  { code: 'PHX', name: 'Sky Harbor', city: 'Phoenix', country: 'USA', lat: 33.44, lng: -112.01, type: 'major' },
  { code: 'SDL', name: 'Scottsdale', city: 'Scottsdale', country: 'USA', lat: 33.62, lng: -111.91, type: 'business', fbo: 'Signature Flight Support' },
  { code: 'MSP', name: 'Minneapolis-St Paul', city: 'Minneapolis', country: 'USA', lat: 44.88, lng: -93.22, type: 'major' },
  { code: 'DTW', name: 'Detroit Metro', city: 'Detroit', country: 'USA', lat: 42.21, lng: -83.35, type: 'major' },
  { code: 'MCO', name: 'Orlando', city: 'Orlando', country: 'USA', lat: 28.43, lng: -81.31, type: 'major' },
  { code: 'SFB', name: 'Sanford', city: 'Orlando', country: 'USA', lat: 28.78, lng: -81.24, type: 'business' },
  { code: 'TPA', name: 'Tampa', city: 'Tampa', country: 'USA', lat: 27.98, lng: -82.53, type: 'major' },
  { code: 'MSY', name: 'Louis Armstrong', city: 'New Orleans', country: 'USA', lat: 29.99, lng: -90.26, type: 'major' },
  { code: 'SAN', name: 'San Diego', city: 'San Diego', country: 'USA', lat: 32.73, lng: -117.19, type: 'major' },
  { code: 'PHL', name: 'Philadelphia', city: 'Philadelphia', country: 'USA', lat: 39.87, lng: -75.24, type: 'major' },
  { code: 'CLT', name: 'Charlotte Douglas', city: 'Charlotte', country: 'USA', lat: 35.21, lng: -80.94, type: 'major' },
  { code: 'RDU', name: 'Raleigh-Durham', city: 'Raleigh', country: 'USA', lat: 35.88, lng: -78.79, type: 'major' },
  { code: 'BNA', name: 'Nashville', city: 'Nashville', country: 'USA', lat: 36.12, lng: -86.68, type: 'major' },
  { code: 'AUS', name: 'Austin-Bergstrom', city: 'Austin', country: 'USA', lat: 30.19, lng: -97.67, type: 'major' },
  { code: 'SAT', name: 'San Antonio', city: 'San Antonio', country: 'USA', lat: 29.53, lng: -98.47, type: 'major' },
  { code: 'SLC', name: 'Salt Lake City', city: 'Salt Lake City', country: 'USA', lat: 40.79, lng: -111.98, type: 'major' },
  { code: 'PDX', name: 'Portland', city: 'Portland', country: 'USA', lat: 45.59, lng: -122.60, type: 'major' },
  { code: 'HNL', name: 'Daniel K. Inouye', city: 'Honolulu', country: 'USA', lat: 21.32, lng: -157.92, type: 'major' },
  { code: 'OGG', name: 'Kahului', city: 'Maui', country: 'USA', lat: 20.90, lng: -156.43, type: 'major' },
  { code: 'ANC', name: 'Ted Stevens', city: 'Anchorage', country: 'USA', lat: 61.17, lng: -150.00, type: 'major' },
  { code: 'ASE', name: 'Aspen/Pitkin', city: 'Aspen', country: 'USA', lat: 39.22, lng: -106.87, type: 'business', fbo: 'Atlantic Aviation' },
  { code: 'EGE', name: 'Eagle County', city: 'Vail', country: 'USA', lat: 39.64, lng: -106.92, type: 'business' },
  { code: 'JAC', name: 'Jackson Hole', city: 'Jackson Hole', country: 'USA', lat: 43.61, lng: -110.74, type: 'business' },
  { code: 'MVY', name: 'Martha\'s Vineyard', city: 'Martha\'s Vineyard', country: 'USA', lat: 41.39, lng: -70.61, type: 'business' },
  { code: 'ACK', name: 'Nantucket Memorial', city: 'Nantucket', country: 'USA', lat: 41.25, lng: -70.06, type: 'business' },
  { code: 'MKE', name: 'Mitchell', city: 'Milwaukee', country: 'USA', lat: 42.95, lng: -87.90, type: 'major' },
  { code: 'IND', name: 'Indianapolis', city: 'Indianapolis', country: 'USA', lat: 39.72, lng: -86.29, type: 'major' },
  { code: 'CMH', name: 'John Glenn', city: 'Columbus', country: 'USA', lat: 40.00, lng: -82.89, type: 'major' },
  { code: 'PIT', name: 'Pittsburgh', city: 'Pittsburgh', country: 'USA', lat: 40.50, lng: -80.23, type: 'major' },
  { code: 'MEM', name: 'Memphis', city: 'Memphis', country: 'USA', lat: 35.04, lng: -89.98, type: 'major' },
  { code: 'JAX', name: 'Jacksonville', city: 'Jacksonville', country: 'USA', lat: 30.49, lng: -81.69, type: 'major' },
  { code: 'RIC', name: 'Richmond', city: 'Richmond', country: 'USA', lat: 37.51, lng: -77.32, type: 'regional' },
  // Canada
  { code: 'YYZ', name: 'Pearson', city: 'Toronto', country: 'Canada', lat: 43.68, lng: -79.63, type: 'major' },
  { code: 'YTZ', name: 'Billy Bishop', city: 'Toronto', country: 'Canada', lat: 43.63, lng: -79.40, type: 'business' },
  { code: 'YUL', name: 'Trudeau', city: 'Montreal', country: 'Canada', lat: 45.47, lng: -73.74, type: 'major' },
  { code: 'YVR', name: 'Vancouver', city: 'Vancouver', country: 'Canada', lat: 49.19, lng: -123.18, type: 'major' },
  { code: 'YYC', name: 'Calgary', city: 'Calgary', country: 'Canada', lat: 51.13, lng: -114.01, type: 'major' },
  { code: 'YEG', name: 'Edmonton', city: 'Edmonton', country: 'Canada', lat: 53.31, lng: -113.58, type: 'major' },
  { code: 'YOW', name: 'Ottawa Macdonald-Cartier', city: 'Ottawa', country: 'Canada', lat: 45.32, lng: -75.67, type: 'major' },
  { code: 'YWG', name: 'Winnipeg', city: 'Winnipeg', country: 'Canada', lat: 49.91, lng: -97.24, type: 'regional' },
  { code: 'YHZ', name: 'Halifax Stanfield', city: 'Halifax', country: 'Canada', lat: 44.88, lng: -63.51, type: 'regional' },
  { code: 'YQB', name: 'Jean Lesage', city: 'Quebec City', country: 'Canada', lat: 46.79, lng: -71.39, type: 'regional' },
  // Mexico
  { code: 'MEX', name: 'Benito Juárez', city: 'Mexico City', country: 'Mexico', lat: 19.44, lng: -99.07, type: 'major' },
  { code: 'TLC', name: 'Toluca', city: 'Toluca', country: 'Mexico', lat: 19.34, lng: -99.57, type: 'business', fbo: 'Interjet FBO' },
  { code: 'CUN', name: 'Cancún', city: 'Cancún', country: 'Mexico', lat: 21.04, lng: -86.87, type: 'major' },
  { code: 'GDL', name: 'Miguel Hidalgo', city: 'Guadalajara', country: 'Mexico', lat: 20.52, lng: -103.31, type: 'major' },
  { code: 'MTY', name: 'Monterrey', city: 'Monterrey', country: 'Mexico', lat: 25.78, lng: -100.11, type: 'major' },
  { code: 'SJD', name: 'Los Cabos', city: 'San José del Cabo', country: 'Mexico', lat: 23.15, lng: -109.72, type: 'major' },
  { code: 'PVR', name: 'Puerto Vallarta', city: 'Puerto Vallarta', country: 'Mexico', lat: 20.68, lng: -105.25, type: 'major' },

  // ══════════════════ SOUTH AMERICA ══════════════════
  { code: 'GRU', name: 'Guarulhos', city: 'São Paulo', country: 'Brazil', lat: -23.43, lng: -46.47, type: 'major' },
  { code: 'CGH', name: 'Congonhas', city: 'São Paulo', country: 'Brazil', lat: -23.63, lng: -46.66, type: 'business' },
  { code: 'GIG', name: 'Galeão', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.81, lng: -43.25, type: 'major' },
  { code: 'SDU', name: 'Santos Dumont', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.91, lng: -43.16, type: 'business' },
  { code: 'BSB', name: 'Brasília', city: 'Brasília', country: 'Brazil', lat: -15.87, lng: -47.92, type: 'major' },
  { code: 'CNF', name: 'Confins', city: 'Belo Horizonte', country: 'Brazil', lat: -19.63, lng: -43.97, type: 'major' },
  { code: 'SSA', name: 'Salvador', city: 'Salvador', country: 'Brazil', lat: -12.91, lng: -38.33, type: 'major' },
  { code: 'REC', name: 'Recife', city: 'Recife', country: 'Brazil', lat: -8.13, lng: -34.92, type: 'regional' },
  { code: 'FOR', name: 'Pinto Martins', city: 'Fortaleza', country: 'Brazil', lat: -3.78, lng: -38.53, type: 'regional' },
  { code: 'CWB', name: 'Afonso Pena', city: 'Curitiba', country: 'Brazil', lat: -25.53, lng: -49.17, type: 'regional' },
  { code: 'POA', name: 'Salgado Filho', city: 'Porto Alegre', country: 'Brazil', lat: -29.99, lng: -51.17, type: 'regional' },
  { code: 'FLN', name: 'Hercílio Luz', city: 'Florianópolis', country: 'Brazil', lat: -27.67, lng: -48.55, type: 'regional' },
  { code: 'EZE', name: 'Ezeiza', city: 'Buenos Aires', country: 'Argentina', lat: -34.82, lng: -58.54, type: 'major' },
  { code: 'AEP', name: 'Aeroparque', city: 'Buenos Aires', country: 'Argentina', lat: -34.56, lng: -58.42, type: 'business' },
  { code: 'COR', name: 'Ingeniero Taravella', city: 'Córdoba', country: 'Argentina', lat: -31.32, lng: -64.21, type: 'regional' },
  { code: 'MDZ', name: 'El Plumerillo', city: 'Mendoza', country: 'Argentina', lat: -32.83, lng: -68.79, type: 'regional' },
  { code: 'BOG', name: 'El Dorado', city: 'Bogotá', country: 'Colombia', lat: 4.70, lng: -74.15, type: 'major' },
  { code: 'MDE', name: 'José María Córdova', city: 'Medellín', country: 'Colombia', lat: 6.16, lng: -75.42, type: 'major' },
  { code: 'CTG', name: 'Rafael Núñez', city: 'Cartagena', country: 'Colombia', lat: 10.44, lng: -75.51, type: 'major' },
  { code: 'CLO', name: 'Alfonso Bonilla Aragón', city: 'Cali', country: 'Colombia', lat: 3.54, lng: -76.38, type: 'regional' },
  { code: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago', country: 'Chile', lat: -33.39, lng: -70.79, type: 'major' },
  { code: 'LIM', name: 'Jorge Chávez', city: 'Lima', country: 'Peru', lat: -12.02, lng: -77.11, type: 'major' },
  { code: 'CUZ', name: 'Alejandro Velasco Astete', city: 'Cusco', country: 'Peru', lat: -13.54, lng: -71.94, type: 'regional' },
  { code: 'UIO', name: 'Mariscal Sucre', city: 'Quito', country: 'Ecuador', lat: -0.13, lng: -78.36, type: 'major' },
  { code: 'GYE', name: 'José Joaquín de Olmedo', city: 'Guayaquil', country: 'Ecuador', lat: -2.16, lng: -79.88, type: 'major' },
  { code: 'CCS', name: 'Simón Bolívar', city: 'Caracas', country: 'Venezuela', lat: 10.60, lng: -66.99, type: 'major' },
  { code: 'MVD', name: 'Carrasco', city: 'Montevideo', country: 'Uruguay', lat: -34.84, lng: -56.03, type: 'major' },
  { code: 'PUJ', name: 'Punta Cana', city: 'Punta Cana', country: 'Dominican Republic', lat: 18.57, lng: -68.36, type: 'major' },
  { code: 'ASU', name: 'Silvio Pettirossi', city: 'Asunción', country: 'Paraguay', lat: -25.24, lng: -57.52, type: 'regional' },
  { code: 'VVI', name: 'Viru Viru', city: 'Santa Cruz', country: 'Bolivia', lat: -17.64, lng: -63.14, type: 'regional' },
  { code: 'PTY', name: 'Tocumen', city: 'Panama City', country: 'Panama', lat: 9.07, lng: -79.38, type: 'major' },
  { code: 'SJO', name: 'Juan Santamaría', city: 'San José', country: 'Costa Rica', lat: 10.00, lng: -84.21, type: 'major' },
  { code: 'LIR', name: 'Daniel Oduber Quirós', city: 'Liberia', country: 'Costa Rica', lat: 10.59, lng: -85.54, type: 'regional' },
  // Caribbean
  { code: 'NAS', name: 'Nassau', city: 'Nassau', country: 'Bahamas', lat: 25.04, lng: -77.47, type: 'major' },
  { code: 'SXM', name: 'Princess Juliana', city: 'St. Maarten', country: 'Sint Maarten', lat: 18.04, lng: -63.11, type: 'major' },
  { code: 'MBJ', name: 'Sangster', city: 'Montego Bay', country: 'Jamaica', lat: 18.50, lng: -77.91, type: 'major' },
  { code: 'BGI', name: 'Grantley Adams', city: 'Bridgetown', country: 'Barbados', lat: 13.07, lng: -59.49, type: 'major' },
  { code: 'POS', name: 'Piarco', city: 'Port of Spain', country: 'Trinidad', lat: 10.60, lng: -61.34, type: 'major' },
  { code: 'AUA', name: 'Reina Beatrix', city: 'Oranjestad', country: 'Aruba', lat: 12.50, lng: -70.01, type: 'major' },
  { code: 'CUR', name: 'Hato', city: 'Willemstad', country: 'Curaçao', lat: 12.17, lng: -68.96, type: 'regional' },
  { code: 'GCM', name: 'Owen Roberts', city: 'Grand Cayman', country: 'Cayman Islands', lat: 19.29, lng: -81.36, type: 'major' },
  { code: 'SJU', name: 'Luis Muñoz Marín', city: 'San Juan', country: 'Puerto Rico', lat: 18.44, lng: -66.00, type: 'major' },
  { code: 'EIS', name: 'Terrance B. Lettsome', city: 'Tortola', country: 'British Virgin Islands', lat: 18.44, lng: -64.54, type: 'business' },
  { code: 'STT', name: 'Cyril E. King', city: 'St. Thomas', country: 'US Virgin Islands', lat: 18.34, lng: -64.97, type: 'regional' },
  { code: 'PTP', name: 'Pointe-à-Pitre', city: 'Guadeloupe', country: 'Guadeloupe', lat: 16.27, lng: -61.53, type: 'regional' },
  { code: 'FDF', name: 'Aimé Césaire', city: 'Fort-de-France', country: 'Martinique', lat: 14.59, lng: -61.00, type: 'regional' },
  { code: 'HAV', name: 'José Martí', city: 'Havana', country: 'Cuba', lat: 22.99, lng: -82.41, type: 'major' },

  // ══════════════════ AFRICA ══════════════════
  { code: 'JNB', name: 'O.R. Tambo', city: 'Johannesburg', country: 'South Africa', lat: -26.14, lng: 28.24, type: 'major' },
  { code: 'CPT', name: 'Cape Town', city: 'Cape Town', country: 'South Africa', lat: -33.97, lng: 18.60, type: 'major' },
  { code: 'DUR', name: 'King Shaka', city: 'Durban', country: 'South Africa', lat: -29.61, lng: 31.12, type: 'major' },
  { code: 'HLA', name: 'Lanseria', city: 'Johannesburg', country: 'South Africa', lat: -25.94, lng: 27.93, type: 'business', fbo: 'ExecuJet' },
  { code: 'NBO', name: 'Jomo Kenyatta', city: 'Nairobi', country: 'Kenya', lat: -1.32, lng: 36.93, type: 'major' },
  { code: 'WIL', name: 'Wilson', city: 'Nairobi', country: 'Kenya', lat: -1.32, lng: 36.82, type: 'business', fbo: 'Wilson Aviation' },
  { code: 'MBA', name: 'Moi', city: 'Mombasa', country: 'Kenya', lat: -4.03, lng: 39.59, type: 'regional' },
  { code: 'CAI', name: 'Cairo', city: 'Cairo', country: 'Egypt', lat: 30.12, lng: 31.41, type: 'major' },
  { code: 'HRG', name: 'Hurghada', city: 'Hurghada', country: 'Egypt', lat: 27.18, lng: 33.80, type: 'major' },
  { code: 'SSH', name: 'Sharm el-Sheikh', city: 'Sharm el-Sheikh', country: 'Egypt', lat: 27.98, lng: 34.39, type: 'major' },
  { code: 'LXR', name: 'Luxor', city: 'Luxor', country: 'Egypt', lat: 25.67, lng: 32.71, type: 'regional' },
  { code: 'CMN', name: 'Mohammed V', city: 'Casablanca', country: 'Morocco', lat: 33.37, lng: -7.59, type: 'major' },
  { code: 'RAK', name: 'Menara', city: 'Marrakech', country: 'Morocco', lat: 31.61, lng: -8.04, type: 'major' },
  { code: 'TNG', name: 'Ibn Battouta', city: 'Tangier', country: 'Morocco', lat: 35.73, lng: -5.92, type: 'regional' },
  { code: 'AGA', name: 'Al Massira', city: 'Agadir', country: 'Morocco', lat: 30.33, lng: -9.41, type: 'regional' },
  { code: 'TUN', name: 'Carthage', city: 'Tunis', country: 'Tunisia', lat: 36.85, lng: 10.23, type: 'major' },
  { code: 'ALG', name: 'Houari Boumediene', city: 'Algiers', country: 'Algeria', lat: 36.69, lng: 3.22, type: 'major' },
  { code: 'LOS', name: 'Murtala Muhammed', city: 'Lagos', country: 'Nigeria', lat: 6.58, lng: 3.32, type: 'major' },
  { code: 'ABV', name: 'Nnamdi Azikiwe', city: 'Abuja', country: 'Nigeria', lat: 9.01, lng: 7.26, type: 'major' },
  { code: 'ACC', name: 'Kotoka', city: 'Accra', country: 'Ghana', lat: 5.61, lng: -0.17, type: 'major' },
  { code: 'ADD', name: 'Bole', city: 'Addis Ababa', country: 'Ethiopia', lat: 8.98, lng: 38.80, type: 'major' },
  { code: 'DAR', name: 'Julius Nyerere', city: 'Dar es Salaam', country: 'Tanzania', lat: -6.88, lng: 39.20, type: 'major' },
  { code: 'JRO', name: 'Kilimanjaro', city: 'Kilimanjaro', country: 'Tanzania', lat: -3.43, lng: 37.07, type: 'regional' },
  { code: 'ZNZ', name: 'Abeid Amani Karume', city: 'Zanzibar', country: 'Tanzania', lat: -6.22, lng: 39.22, type: 'regional' },
  { code: 'EBB', name: 'Entebbe', city: 'Kampala', country: 'Uganda', lat: 0.04, lng: 32.44, type: 'major' },
  { code: 'KGL', name: 'Kigali', city: 'Kigali', country: 'Rwanda', lat: -1.97, lng: 30.14, type: 'major' },
  { code: 'DKR', name: 'Blaise Diagne', city: 'Dakar', country: 'Senegal', lat: 14.67, lng: -17.07, type: 'major' },
  { code: 'ABJ', name: 'Félix-Houphouët-Boigny', city: 'Abidjan', country: 'Ivory Coast', lat: 5.26, lng: -3.93, type: 'major' },
  { code: 'MRU', name: 'Sir Seewoosagur Ramgoolam', city: 'Mauritius', country: 'Mauritius', lat: -20.43, lng: 57.68, type: 'major' },
  { code: 'SEZ', name: 'Seychelles', city: 'Mahé', country: 'Seychelles', lat: -4.67, lng: 55.52, type: 'major' },
  { code: 'TNR', name: 'Ivato', city: 'Antananarivo', country: 'Madagascar', lat: -18.80, lng: 47.48, type: 'major' },
  { code: 'MPM', name: 'Maputo', city: 'Maputo', country: 'Mozambique', lat: -26.04, lng: 32.57, type: 'regional' },
  { code: 'LUN', name: 'Kenneth Kaunda', city: 'Lusaka', country: 'Zambia', lat: -15.33, lng: 28.45, type: 'regional' },
  { code: 'HRE', name: 'Robert Gabriel Mugabe', city: 'Harare', country: 'Zimbabwe', lat: -17.93, lng: 31.09, type: 'regional' },
  { code: 'VFA', name: 'Victoria Falls', city: 'Victoria Falls', country: 'Zimbabwe', lat: -18.10, lng: 25.84, type: 'business' },
  { code: 'WDH', name: 'Hosea Kutako', city: 'Windhoek', country: 'Namibia', lat: -22.48, lng: 17.47, type: 'regional' },
  { code: 'GBE', name: 'Sir Seretse Khama', city: 'Gaborone', country: 'Botswana', lat: -24.56, lng: 25.92, type: 'regional' },
  { code: 'MQP', name: 'Kruger Mpumalanga', city: 'Nelspruit', country: 'South Africa', lat: -25.38, lng: 31.10, type: 'business' },

  // ══════════════════ OCEANIA ══════════════════
  { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Australia', lat: -33.95, lng: 151.18, type: 'major' },
  { code: 'MEL', name: 'Tullamarine', city: 'Melbourne', country: 'Australia', lat: -37.67, lng: 144.84, type: 'major' },
  { code: 'BNE', name: 'Brisbane', city: 'Brisbane', country: 'Australia', lat: -27.38, lng: 153.12, type: 'major' },
  { code: 'PER', name: 'Perth', city: 'Perth', country: 'Australia', lat: -31.94, lng: 115.97, type: 'major' },
  { code: 'ADL', name: 'Adelaide', city: 'Adelaide', country: 'Australia', lat: -34.94, lng: 138.53, type: 'major' },
  { code: 'OOL', name: 'Gold Coast', city: 'Gold Coast', country: 'Australia', lat: -28.16, lng: 153.50, type: 'major' },
  { code: 'CNS', name: 'Cairns', city: 'Cairns', country: 'Australia', lat: -16.89, lng: 145.76, type: 'major' },
  { code: 'CBR', name: 'Canberra', city: 'Canberra', country: 'Australia', lat: -35.31, lng: 149.19, type: 'regional' },
  { code: 'DRW', name: 'Darwin', city: 'Darwin', country: 'Australia', lat: -12.42, lng: 130.87, type: 'regional' },
  { code: 'HBA', name: 'Hobart', city: 'Hobart', country: 'Australia', lat: -42.84, lng: 147.51, type: 'regional' },
  { code: 'ESS', name: 'Essendon Fields', city: 'Melbourne', country: 'Australia', lat: -37.73, lng: 144.90, type: 'business', fbo: 'Jet City' },
  { code: 'BKQ', name: 'Bankstown', city: 'Sydney', country: 'Australia', lat: -33.92, lng: 150.99, type: 'business' },
  { code: 'AKL', name: 'Auckland', city: 'Auckland', country: 'New Zealand', lat: -37.01, lng: 174.78, type: 'major' },
  { code: 'WLG', name: 'Wellington', city: 'Wellington', country: 'New Zealand', lat: -41.33, lng: 174.81, type: 'major' },
  { code: 'CHC', name: 'Christchurch', city: 'Christchurch', country: 'New Zealand', lat: -43.49, lng: 172.53, type: 'major' },
  { code: 'ZQN', name: 'Queenstown', city: 'Queenstown', country: 'New Zealand', lat: -45.02, lng: 168.74, type: 'business' },
  { code: 'NAN', name: 'Nadi', city: 'Nadi', country: 'Fiji', lat: -17.76, lng: 177.44, type: 'major' },
  { code: 'PPT', name: 'Faa\'a', city: 'Papeete', country: 'French Polynesia', lat: -17.56, lng: -149.61, type: 'major' },
  { code: 'BOB', name: 'Bora Bora', city: 'Bora Bora', country: 'French Polynesia', lat: -16.44, lng: -151.75, type: 'business' },
  { code: 'NOU', name: 'La Tontouta', city: 'Nouméa', country: 'New Caledonia', lat: -22.01, lng: 166.22, type: 'regional' },

  // ══════════════════ CENTRAL ASIA ══════════════════
  { code: 'TSE', name: 'Nursultan Nazarbayev', city: 'Astana', country: 'Kazakhstan', lat: 51.02, lng: 71.47, type: 'major' },
  { code: 'ALA', name: 'Almaty', city: 'Almaty', country: 'Kazakhstan', lat: 43.35, lng: 77.04, type: 'major' },
  { code: 'TAS', name: 'Islam Karimov', city: 'Tashkent', country: 'Uzbekistan', lat: 41.26, lng: 69.28, type: 'major' },
  { code: 'SKD', name: 'Samarkand', city: 'Samarkand', country: 'Uzbekistan', lat: 39.70, lng: 66.98, type: 'regional' },
  { code: 'GYD', name: 'Heydar Aliyev', city: 'Baku', country: 'Azerbaijan', lat: 40.47, lng: 50.05, type: 'major' },
  { code: 'TBS', name: 'Shota Rustaveli', city: 'Tbilisi', country: 'Georgia', lat: 41.67, lng: 44.95, type: 'major' },
  { code: 'EVN', name: 'Zvartnots', city: 'Yerevan', country: 'Armenia', lat: 40.15, lng: 44.40, type: 'major' },
  { code: 'FRU', name: 'Manas', city: 'Bishkek', country: 'Kyrgyzstan', lat: 43.06, lng: 74.48, type: 'regional' },
  { code: 'DYU', name: 'Dushanbe', city: 'Dushanbe', country: 'Tajikistan', lat: 38.54, lng: 68.82, type: 'regional' },
  { code: 'ASB', name: 'Ashgabat', city: 'Ashgabat', country: 'Turkmenistan', lat: 37.99, lng: 58.36, type: 'regional' },
];

// ═══ AIRCRAFT DATABASE (real-world hourly rates in EUR) ═══
// Source: industry averages 2025-2026 (Paramount, 5StarJets, EliteJets)
const AIRCRAFT_DB = [
  // Light: $2,000-$4,000/hr → €1,800-€3,700/hr
  { name: 'Citation CJ4', category: 'light' as const, seats: 7, range: 3700, hourlyRate: 2800, img: '✈️' },
  { name: 'Phenom 300E', category: 'light' as const, seats: 8, range: 3650, hourlyRate: 3200, img: '✈️' },
  { name: 'Learjet 75', category: 'light' as const, seats: 8, range: 3778, hourlyRate: 3000, img: '✈️' },
  { name: 'HondaJet Elite S', category: 'light' as const, seats: 6, range: 2661, hourlyRate: 2200, img: '✈️' },
  // Midsize: $3,500-$5,500/hr → €3,200-€5,100/hr
  { name: 'Citation XLS+', category: 'midsize' as const, seats: 9, range: 3500, hourlyRate: 4200, img: '🛩️' },
  { name: 'Hawker 900XP', category: 'midsize' as const, seats: 8, range: 4900, hourlyRate: 4000, img: '🛩️' },
  { name: 'Praetor 500', category: 'midsize' as const, seats: 9, range: 5300, hourlyRate: 4500, img: '🛩️' },
  { name: 'Learjet 60XR', category: 'midsize' as const, seats: 7, range: 4300, hourlyRate: 3800, img: '🛩️' },
  // Super-midsize: $4,500-$7,000/hr → €4,200-€6,500/hr
  { name: 'Challenger 350', category: 'super-mid' as const, seats: 10, range: 5926, hourlyRate: 5500, img: '🛫' },
  { name: 'Citation Longitude', category: 'super-mid' as const, seats: 12, range: 6500, hourlyRate: 5800, img: '🛫' },
  { name: 'Praetor 600', category: 'super-mid' as const, seats: 12, range: 7200, hourlyRate: 6200, img: '🛫' },
  { name: 'Gulfstream G280', category: 'super-mid' as const, seats: 10, range: 6667, hourlyRate: 5200, img: '🛫' },
  // Heavy: $6,000-$10,000/hr → €5,500-€9,300/hr
  { name: 'Falcon 2000LXS', category: 'heavy' as const, seats: 10, range: 7400, hourlyRate: 6800, img: '🛬' },
  { name: 'Challenger 650', category: 'heavy' as const, seats: 12, range: 7400, hourlyRate: 7200, img: '🛬' },
  { name: 'Gulfstream G550', category: 'heavy' as const, seats: 16, range: 12500, hourlyRate: 8500, img: '🛬' },
  { name: 'Dassault Falcon 900LX', category: 'heavy' as const, seats: 12, range: 8800, hourlyRate: 7500, img: '🛬' },
  { name: 'Legacy 650E', category: 'heavy' as const, seats: 14, range: 7200, hourlyRate: 7000, img: '🛬' },
  // Ultra-long range: $9,000-$14,000/hr → €8,300-€13,000/hr
  { name: 'Gulfstream G650ER', category: 'ultra-long' as const, seats: 16, range: 13890, hourlyRate: 10500, img: '✨' },
  { name: 'Global 7500', category: 'ultra-long' as const, seats: 17, range: 14260, hourlyRate: 12000, img: '✨' },
  { name: 'Falcon 8X', category: 'ultra-long' as const, seats: 14, range: 11945, hourlyRate: 9500, img: '✨' },
  { name: 'Gulfstream G700', category: 'ultra-long' as const, seats: 19, range: 14260, hourlyRate: 13000, img: '✨' },
];

const PROVIDERS: CharterFlight['provider'][] = ['Jettly', 'XO / Vista', 'Amalfi Jets', 'Flapper'];
const AMENITIES_POOL = ['Lie-flat beds', 'Wi-Fi', 'Gourmet catering', 'Champagne bar', 'Shower', 'Conference table', 'Entertainment system', 'USB/AC power', 'Baggage concierge', 'Ground transport'];

function getDistanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
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

// ═══ REALISTIC PRICING (based on hourly rates) ═══
// Full charter = hourlyRate × flightHours (minimum 2hr)
// Empty legs = 50-75% off full charter (repositioning flights)
// Shared seats = full charter price / seats available (with margin)
// Commercial biz class comparisons: ~€0.15-0.30/km for short-haul, less for long-haul
function calcPrice(distKm: number, aircraft: typeof AIRCRAFT_DB[0], flightType: CharterFlight['type']): {
  perSeat: number; full: number; retail: number; savings: number
} {
  const flightHours = Math.max(distKm / 800, 2); // minimum 2hr billing
  const fullCharter = Math.round(aircraft.hourlyRate * flightHours);

  let discountedFull: number;
  if (flightType === 'empty-leg') {
    // Empty legs: 50-75% off (random within range for variety)
    const discount = 0.25 + Math.random() * 0.25; // pay 25-50% of full
    discountedFull = Math.round(fullCharter * discount);
  } else if (flightType === 'shared-seat') {
    // Shared seats: operators sell per-seat at ~60-70% of pro-rata
    discountedFull = fullCharter; // full price but split among passengers
  } else {
    // Full charter: ~10-15% off list for platform booking
    discountedFull = Math.round(fullCharter * 0.9);
  }

  let perSeat: number;
  if (flightType === 'shared-seat') {
    // XO/Vista style: price per seat = charter / total seats × 0.65 (operator margin)
    perSeat = Math.round((fullCharter / aircraft.seats) * 0.65);
  } else {
    perSeat = Math.round(discountedFull / aircraft.seats);
  }

  // Commercial business class benchmark: varies by distance
  // Short-haul (<2000km): €400-1500, Medium (2000-6000km): €1500-4000, Long (>6000km): €3000-8000
  let bizClassPrice: number;
  if (distKm < 2000) {
    bizClassPrice = Math.round(400 + distKm * 0.45);
  } else if (distKm < 6000) {
    bizClassPrice = Math.round(1200 + distKm * 0.35);
  } else {
    bizClassPrice = Math.round(2500 + distKm * 0.25);
  }

  const savings = Math.round((1 - perSeat / bizClassPrice) * 100);

  return {
    perSeat: Math.max(perSeat, 350), // minimum €350/seat
    full: discountedFull,
    retail: bizClassPrice,
    savings: Math.max(Math.min(savings, 85), -200), // can be negative (more expensive than commercial)
  };
}

// Persona-specific must-have destinations (always generate routes to these)
const PERSONA_DESTINATIONS: Record<string, string[]> = {
  meghan: ['Singapore', 'Hong Kong', 'New York', 'Dubai', 'Oslo', 'Cannes', 'Maldives', 'Nairobi', 'São Paulo'],
  john: ['San Francisco', 'São Paulo', 'London', 'Munich', 'Zürich', 'Verbier', 'Tokyo', 'Bali'],
};

// Generate 24+ demo flights dynamically based on a home airport
export function generateDemoFlights(homeAirportCode: string, personaId?: string): CharterFlight[] {
  const home = AIRPORTS.find(a => a.code === homeAirportCode) || AIRPORTS[0];
  const flights: CharterFlight[] = [];
  const now = new Date();

  // Persona-guaranteed destinations first
  const personaDests = personaId ? (PERSONA_DESTINATIONS[personaId] || []) : [];
  const guaranteedAirports = personaDests
    .map(city => AIRPORTS.find(a => a.city.toLowerCase().includes(city.toLowerCase()) && a.type === 'major'))
    .filter((a): a is Airport => !!a && a.code !== home.code);

  // Get random major destinations for variety
  const randomDests = AIRPORTS
    .filter(a => a.code !== home.code && a.type === 'major' && !guaranteedAirports.find(g => g.code === a.code))
    .sort(() => Math.random() - 0.5)
    .slice(0, 35 - guaranteedAirports.length);
  
  const destinations = [...guaranteedAirports, ...randomDests];

  // Generate 28 flights (mix of types)
  const types: CharterFlight['type'][] = ['empty-leg', 'empty-leg', 'empty-leg', 'shared-seat', 'shared-seat', 'full-charter', 'shared-seat'];

  for (let i = 0; i < 28; i++) {
    const dest = destinations[i % destinations.length];
    const dist = getDistanceKm(home, dest);
    const duration = flightDuration(dist);
    const aircraft = AIRCRAFT_DB[Math.floor(Math.random() * AIRCRAFT_DB.length)];
    const type = types[i % types.length];
    const provider = PROVIDERS[i % PROVIDERS.length];
    const price = calcPrice(dist, aircraft, type);
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
      wifiOnboard: Math.random() > 0.15,
      cateringIncluded: Math.random() > 0.2,
      petFriendly: Math.random() > 0.6,
      waitTimeMinutes: aircraft.category === 'light' ? 8 : aircraft.category === 'ultra-long' ? 15 : 12,
      commercialAlternativeWait: 90 + Math.floor(Math.random() * 60),
      fixedRate: provider === 'Amalfi Jets',
      verified: true,
      expiresIn: `${Math.floor(Math.random() * 48) + 1}h ${Math.floor(Math.random() * 59)}m`,
    });
  }

  // Also generate some reverse (inbound) empty legs
  for (let i = 0; i < 8; i++) {
    const dest = destinations[i];
    const dist = getDistanceKm(dest, home);
    const duration = flightDuration(dist);
    const aircraft = AIRCRAFT_DB[Math.floor(Math.random() * AIRCRAFT_DB.length)];
    const price = calcPrice(dist, aircraft, 'empty-leg');
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
    const dist = getDistanceKm({ lat, lng }, a);
    return dist <= radiusKm;
  }).sort((a, b) => {
    const dA = getDistanceKm({ lat, lng }, a);
    const dB = getDistanceKm({ lat, lng }, b);
    return dA - dB;
  });
}

// Get AI context for concierge — enhanced with destination matching and proactive suggestions
export function getJetSearchAIContext(flights: CharterFlight[], homeAirport: string, personaId?: string): string {
  if (!flights.length) return '';
  const emptyLegs = flights.filter(f => f.type === 'empty-leg');
  const sharedSeats = flights.filter(f => f.type === 'shared-seat');
  const charters = flights.filter(f => f.type === 'full-charter');
  const cheapestSeats = [...flights].filter(f => f.type !== 'full-charter').sort((a, b) => a.pricePerSeat - b.pricePerSeat).slice(0, 8);
  const bestDeals = [...flights].sort((a, b) => b.savingsPercent - a.savingsPercent).slice(0, 5);

  let ctx = `\n\n**✈️ PRIVATE JET SEARCH ENGINE — LIVE AVAILABILITY (from ${homeAirport}):**\n`;
  ctx += `${flights.length} flights available: ${emptyLegs.length} empty legs, ${sharedSeats.length} shared seats, ${charters.length} full charters.\n`;
  ctx += `Providers: Jettly (23K+ aircraft aggregator), XO/Vista (seat deals), Amalfi Jets (fixed-rate guarantee), Flapper (LATAM/Florida shared network).\n`;
  ctx += `Airport directory: 600+ airports worldwide including private FBOs.\n\n`;

  ctx += `**🟢 EMPTY LEGS (repositioning flights — biggest savings, 50-75% off):**\n`;
  emptyLegs.slice(0, 10).forEach(f => {
    ctx += `- ${f.from.city}(${f.from.code})→${f.to.city}(${f.to.code}) | ${f.departureDate} ${f.departureTime} | ${f.aircraft} (${f.totalSeats} seats) | **€${f.pricePerSeat.toLocaleString()}/seat** (save ${f.savingsPercent}%) | ${f.flightDuration} | Provider: ${f.provider} | FBO: ${f.waitTimeMinutes}min boarding\n`;
  });

  ctx += `\n**🔵 SHARED SEATS (buy individual seats on private jets):**\n`;
  sharedSeats.slice(0, 8).forEach(f => {
    ctx += `- ${f.from.city}(${f.from.code})→${f.to.city}(${f.to.code}) | ${f.departureDate} ${f.departureTime} | ${f.aircraft} | **€${f.pricePerSeat.toLocaleString()}/seat** (${f.seatsAvailable} seats left) | ${f.savingsPercent > 0 ? `save ${f.savingsPercent}%` : `${Math.abs(f.savingsPercent)}% premium`} vs biz class | Provider: ${f.provider}\n`;
  });

  ctx += `\n**Top 5 Biggest Savings vs Commercial Business Class:**\n`;
  bestDeals.forEach(f => {
    ctx += `- ${f.type === 'empty-leg' ? '🟢 EMPTY LEG' : f.type === 'shared-seat' ? '🔵 SHARED SEAT' : '🟡 CHARTER'}: ${f.from.code}→${f.to.code}: €${f.pricePerSeat.toLocaleString()}/seat on ${f.aircraft} — save ${f.savingsPercent}% | Commercial biz class: ~€${f.originalRetailPrice.toLocaleString()}\n`;
  });

  ctx += `\n**ALL available routes (for destination matching):**\n`;
  const routeMap = new Map<string, { types: string[]; minPrice: number; aircraft: string[]; dates: string[] }>();
  flights.forEach(f => {
    const key = `${f.to.city}(${f.to.code})`;
    const existing = routeMap.get(key);
    if (existing) {
      if (!existing.types.includes(f.type)) existing.types.push(f.type);
      if (f.pricePerSeat < existing.minPrice) existing.minPrice = f.pricePerSeat;
      if (!existing.aircraft.includes(f.aircraft)) existing.aircraft.push(f.aircraft);
      if (!existing.dates.includes(f.departureDate)) existing.dates.push(f.departureDate);
    } else {
      routeMap.set(key, { types: [f.type], minPrice: f.pricePerSeat, aircraft: [f.aircraft], dates: [f.departureDate] });
    }
  });
  routeMap.forEach((v, k) => {
    ctx += `  ${k}: ${v.types.join('+')} from €${v.minPrice.toLocaleString()} (${v.aircraft.slice(0,2).join(', ')}) — dates: ${v.dates.slice(0,3).join(', ')}\n`;
  });

  ctx += `\n**🤖 PRIVATE AVIATION AI BEHAVIOR — MANDATORY RULES:**\n`;
  ctx += `**⚠️ DEPARTURE LOCATION RULE (CRITICAL — NEVER VIOLATE):**\n`;
  ctx += `- All flights listed above depart from **${homeAirport}** (the user's current/home airport).\n`;
  ctx += `- When the user mentions a DEPARTURE city in their question (e.g., "fly FROM Paris to Dubai"), ONLY recommend flights departing from that city. If no flights exist from that city in our data, say so honestly.\n`;
  ctx += `- When the user does NOT mention a departure city (e.g., "I want to go to Dubai" or "flights to Tokyo"), assume departure from their CURRENT LOCATION (${homeAirport}). Only show flights from ${homeAirport}.\n`;
  ctx += `- **NEVER** recommend a flight departing from a city the user is NOT in and did NOT mention as departure.\n`;
  ctx += `- For INBOUND/RETURN flights (user asks about "coming back from X"), show flights FROM destination city TO ${homeAirport} if available in the reverse legs data.\n\n`;

  ctx += `**⚠️ DATABASE-ONLY RULE (CRITICAL — NEVER FABRICATE):**\n`;
  ctx += `1. **ONLY recommend private jet options that EXIST in the route list above.** If no route matches the user's requested destination from ${homeAirport}, DO NOT invent, guess, or suggest a private flight.\n`;
  ctx += `2. **If NO matching private route exists:** Say: "I checked our private aviation network — no empty legs or shared seats from ${homeAirport} to [destination] right now. I'll save this route to your wishlist and notify you instantly if an empty leg or shared seat becomes available. 🔔"\n`;
  ctx += `3. **Dates must match reality.** Only mention flight dates that appear in the data above. Never invent dates or modify existing ones.\n`;
  ctx += `4. **COMMERCIAL FLIGHTS FIRST.** Always lead with commercial flight search links (Skyscanner, Google Flights, Kayak). Private jet options are a BONUS — only add them AFTER commercial results and ONLY if a matching route exists in the database.\n`;
  ctx += `5. If a matching private route EXISTS: Add it after commercial links: "💎 **Private option available:** I found [empty leg/shared seat] from ${homeAirport} to [city] on [exact date from data] — €[exact price from data]/seat on a [exact aircraft from data]. That's [exact savings% from data] less than business class. [Provider]. 12-min FBO boarding vs 90+ min commercial."\n`;
  ctx += `6. For empty legs with matches, emphasize urgency: "This is a repositioning flight — once it's gone, it's gone. Expires in [exact expiry from data]."\n`;
  ctx += `7. For LATAM routes, prioritize Flapper. For fixed-rate during peak, highlight Amalfi Jets.\n`;
  ctx += `8. **WISHLIST FEATURE:** When no private option exists, always offer: "Want me to set up an alert? I'll monitor empty legs and shared seats on this route and ping you the moment something comes up — could save you 50-75% vs chartering. 🛩️"\n`;
  return ctx;
}
