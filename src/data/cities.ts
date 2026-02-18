// City data for SuperNomad Search AI - Comprehensive Global Database (190 countries)
export interface CityData {
  name: string;
  country_code: string;
  active_services: number;
  population?: number;
  timezone?: string;
}

export const CITIES_BY_COUNTRY: Record<string, CityData[]> = {
  // ─── AMERICAS ───
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
  CA: [
    { name: "Calgary", country_code: "CA", active_services: 76, timezone: "MST" },
    { name: "Montreal", country_code: "CA", active_services: 97, timezone: "EST" },
    { name: "Toronto", country_code: "CA", active_services: 134, timezone: "EST" },
    { name: "Vancouver", country_code: "CA", active_services: 121, timezone: "PST" },
  ],
  MX: [
    { name: "Cancun", country_code: "MX", active_services: 86 },
    { name: "Guadalajara", country_code: "MX", active_services: 74 },
    { name: "Mexico City", country_code: "MX", active_services: 145 },
    { name: "Playa del Carmen", country_code: "MX", active_services: 72 },
    { name: "Tulum", country_code: "MX", active_services: 68 },
  ],
  BR: [
    { name: "Florianopolis", country_code: "BR", active_services: 62 },
    { name: "Rio de Janeiro", country_code: "BR", active_services: 121 },
    { name: "Sao Paulo", country_code: "BR", active_services: 145 },
  ],
  AR: [{ name: "Buenos Aires", country_code: "AR", active_services: 134 }],
  CO: [
    { name: "Bogota", country_code: "CO", active_services: 97 },
    { name: "Cartagena", country_code: "CO", active_services: 64 },
    { name: "Medellin", country_code: "CO", active_services: 108 },
  ],
  CL: [{ name: "Santiago", country_code: "CL", active_services: 88 }],
  PE: [{ name: "Cusco", country_code: "PE", active_services: 54 }, { name: "Lima", country_code: "PE", active_services: 82 }],
  CR: [{ name: "San Jose", country_code: "CR", active_services: 76 }],
  PA: [{ name: "Panama City", country_code: "PA", active_services: 84 }],
  EC: [{ name: "Quito", country_code: "EC", active_services: 58 }],
  UY: [{ name: "Montevideo", country_code: "UY", active_services: 62 }],
  BO: [{ name: "La Paz", country_code: "BO", active_services: 38 }],
  PY: [{ name: "Asuncion", country_code: "PY", active_services: 34 }],
  VE: [{ name: "Caracas", country_code: "VE", active_services: 42 }],
  GY: [{ name: "Georgetown", country_code: "GY", active_services: 22 }],
  SR: [{ name: "Paramaribo", country_code: "SR", active_services: 18 }],
  GT: [{ name: "Guatemala City", country_code: "GT", active_services: 48 }],
  HN: [{ name: "Tegucigalpa", country_code: "HN", active_services: 28 }],
  SV: [{ name: "San Salvador", country_code: "SV", active_services: 32 }],
  NI: [{ name: "Managua", country_code: "NI", active_services: 26 }],
  BZ: [{ name: "Belize City", country_code: "BZ", active_services: 22 }],
  CU: [{ name: "Havana", country_code: "CU", active_services: 44 }],
  DO: [{ name: "Punta Cana", country_code: "DO", active_services: 56 }, { name: "Santo Domingo", country_code: "DO", active_services: 52 }],
  JM: [{ name: "Kingston", country_code: "JM", active_services: 38 }],
  TT: [{ name: "Port of Spain", country_code: "TT", active_services: 32 }],
  BB: [{ name: "Bridgetown", country_code: "BB", active_services: 34 }],
  BS: [{ name: "Nassau", country_code: "BS", active_services: 42 }],
  HT: [{ name: "Port-au-Prince", country_code: "HT", active_services: 18 }],
  AG: [{ name: "St. John's", country_code: "AG", active_services: 20 }],
  KN: [{ name: "Basseterre", country_code: "KN", active_services: 16 }],
  LC: [{ name: "Castries", country_code: "LC", active_services: 22 }],
  VC: [{ name: "Kingstown", country_code: "VC", active_services: 14 }],
  GD: [{ name: "St. George's", country_code: "GD", active_services: 16 }],
  DM: [{ name: "Roseau", country_code: "DM", active_services: 12 }],
  PR: [{ name: "San Juan", country_code: "PR", active_services: 64 }],
  AW: [{ name: "Oranjestad", country_code: "AW", active_services: 28 }],
  CW: [{ name: "Willemstad", country_code: "CW", active_services: 26 }],
  KY: [{ name: "George Town", country_code: "KY", active_services: 32 }],
  BM: [{ name: "Hamilton", country_code: "BM", active_services: 28 }],

  // ─── EUROPE ───
  GB: [
    { name: "Birmingham", country_code: "GB", active_services: 87 },
    { name: "Bristol", country_code: "GB", active_services: 76 },
    { name: "Edinburgh", country_code: "GB", active_services: 92 },
    { name: "Glasgow", country_code: "GB", active_services: 68 },
    { name: "Leeds", country_code: "GB", active_services: 58 },
    { name: "Liverpool", country_code: "GB", active_services: 54 },
    { name: "London", country_code: "GB", active_services: 234 },
    { name: "Manchester", country_code: "GB", active_services: 98 },
  ],
  ES: [
    { name: "Barcelona", country_code: "ES", active_services: 178 },
    { name: "Granada", country_code: "ES", active_services: 52 },
    { name: "Madrid", country_code: "ES", active_services: 187 },
    { name: "Malaga", country_code: "ES", active_services: 76 },
    { name: "Seville", country_code: "ES", active_services: 65 },
    { name: "Valencia", country_code: "ES", active_services: 92 },
  ],
  PT: [
    { name: "Albufeira", country_code: "PT", active_services: 48 },
    { name: "Lisbon", country_code: "PT", active_services: 156 },
    { name: "Madeira", country_code: "PT", active_services: 62 },
    { name: "Porto", country_code: "PT", active_services: 98 },
  ],
  FR: [
    { name: "Bordeaux", country_code: "FR", active_services: 72 },
    { name: "Lyon", country_code: "FR", active_services: 87 },
    { name: "Marseille", country_code: "FR", active_services: 78 },
    { name: "Nice", country_code: "FR", active_services: 81 },
    { name: "Paris", country_code: "FR", active_services: 213 },
    { name: "Toulouse", country_code: "FR", active_services: 64 },
  ],
  DE: [
    { name: "Berlin", country_code: "DE", active_services: 198 },
    { name: "Cologne", country_code: "DE", active_services: 76 },
    { name: "Frankfurt", country_code: "DE", active_services: 87 },
    { name: "Hamburg", country_code: "DE", active_services: 92 },
    { name: "Munich", country_code: "DE", active_services: 134 },
  ],
  IT: [
    { name: "Florence", country_code: "IT", active_services: 78 },
    { name: "Milan", country_code: "IT", active_services: 121 },
    { name: "Naples", country_code: "IT", active_services: 62 },
    { name: "Rome", country_code: "IT", active_services: 156 },
    { name: "Venice", country_code: "IT", active_services: 64 },
  ],
  NL: [
    { name: "Amsterdam", country_code: "NL", active_services: 167 },
    { name: "Rotterdam", country_code: "NL", active_services: 76 },
    { name: "The Hague", country_code: "NL", active_services: 58 },
  ],
  BE: [{ name: "Brussels", country_code: "BE", active_services: 92 }, { name: "Antwerp", country_code: "BE", active_services: 54 }],
  CH: [
    { name: "Geneva", country_code: "CH", active_services: 86 },
    { name: "Zurich", country_code: "CH", active_services: 104 },
  ],
  AT: [
    { name: "Salzburg", country_code: "AT", active_services: 52 },
    { name: "Vienna", country_code: "AT", active_services: 108 },
  ],
  SE: [{ name: "Stockholm", country_code: "SE", active_services: 108 }],
  NO: [{ name: "Oslo", country_code: "NO", active_services: 88 }],
  DK: [{ name: "Copenhagen", country_code: "DK", active_services: 98 }],
  FI: [{ name: "Helsinki", country_code: "FI", active_services: 82 }],
  IE: [{ name: "Dublin", country_code: "IE", active_services: 112 }],
  PL: [{ name: "Krakow", country_code: "PL", active_services: 76 }, { name: "Warsaw", country_code: "PL", active_services: 94 }],
  CZ: [{ name: "Prague", country_code: "CZ", active_services: 112 }],
  HU: [{ name: "Budapest", country_code: "HU", active_services: 102 }],
  GR: [
    { name: "Athens", country_code: "GR", active_services: 97 },
    { name: "Santorini", country_code: "GR", active_services: 54 },
    { name: "Thessaloniki", country_code: "GR", active_services: 55 },
  ],
  HR: [
    { name: "Dubrovnik", country_code: "HR", active_services: 58 },
    { name: "Split", country_code: "HR", active_services: 64 },
    { name: "Zagreb", country_code: "HR", active_services: 72 },
  ],
  RO: [{ name: "Bucharest", country_code: "RO", active_services: 72 }],
  BG: [{ name: "Sofia", country_code: "BG", active_services: 62 }],
  RS: [{ name: "Belgrade", country_code: "RS", active_services: 68 }],
  SK: [{ name: "Bratislava", country_code: "SK", active_services: 48 }],
  SI: [{ name: "Ljubljana", country_code: "SI", active_services: 52 }],
  EE: [{ name: "Tallinn", country_code: "EE", active_services: 72 }],
  LV: [{ name: "Riga", country_code: "LV", active_services: 64 }],
  LT: [{ name: "Vilnius", country_code: "LT", active_services: 68 }],
  UA: [{ name: "Kyiv", country_code: "UA", active_services: 58 }],
  BY: [{ name: "Minsk", country_code: "BY", active_services: 34 }],
  MD: [{ name: "Chisinau", country_code: "MD", active_services: 28 }],
  AL: [{ name: "Tirana", country_code: "AL", active_services: 42 }],
  ME: [{ name: "Podgorica", country_code: "ME", active_services: 36 }],
  MK: [{ name: "Skopje", country_code: "MK", active_services: 32 }],
  BA: [{ name: "Sarajevo", country_code: "BA", active_services: 38 }],
  XK: [{ name: "Pristina", country_code: "XK", active_services: 24 }],
  LU: [{ name: "Luxembourg City", country_code: "LU", active_services: 52 }],
  MC: [{ name: "Monaco", country_code: "MC", active_services: 48 }],
  AD: [{ name: "Andorra la Vella", country_code: "AD", active_services: 22 }],
  LI: [{ name: "Vaduz", country_code: "LI", active_services: 18 }],
  SM: [{ name: "San Marino", country_code: "SM", active_services: 14 }],
  MT: [{ name: "Valletta", country_code: "MT", active_services: 58 }],
  CY: [{ name: "Nicosia", country_code: "CY", active_services: 52 }, { name: "Limassol", country_code: "CY", active_services: 62 }],
  IS: [{ name: "Reykjavik", country_code: "IS", active_services: 56 }],
  RU: [{ name: "Moscow", country_code: "RU", active_services: 98 }, { name: "St. Petersburg", country_code: "RU", active_services: 82 }],

  // ─── MIDDLE EAST ───
  AE: [
    { name: "Abu Dhabi", country_code: "AE", active_services: 86 },
    { name: "Dubai", country_code: "AE", active_services: 187 },
  ],
  SA: [{ name: "Jeddah", country_code: "SA", active_services: 58 }, { name: "Riyadh", country_code: "SA", active_services: 72 }],
  QA: [{ name: "Doha", country_code: "QA", active_services: 78 }],
  BH: [{ name: "Manama", country_code: "BH", active_services: 52 }],
  KW: [{ name: "Kuwait City", country_code: "KW", active_services: 48 }],
  OM: [{ name: "Muscat", country_code: "OM", active_services: 44 }],
  JO: [{ name: "Amman", country_code: "JO", active_services: 56 }],
  LB: [{ name: "Beirut", country_code: "LB", active_services: 62 }],
  IL: [{ name: "Tel Aviv", country_code: "IL", active_services: 124 }],
  IQ: [{ name: "Baghdad", country_code: "IQ", active_services: 28 }, { name: "Erbil", country_code: "IQ", active_services: 32 }],
  IR: [{ name: "Tehran", country_code: "IR", active_services: 52 }],
  YE: [{ name: "Sana'a", country_code: "YE", active_services: 12 }],
  PS: [{ name: "Ramallah", country_code: "PS", active_services: 18 }],
  SY: [{ name: "Damascus", country_code: "SY", active_services: 14 }],

  // ─── ASIA ───
  TH: [
    { name: "Bangkok", country_code: "TH", active_services: 167 },
    { name: "Chiang Mai", country_code: "TH", active_services: 134 },
    { name: "Phuket", country_code: "TH", active_services: 87 },
  ],
  ID: [
    { name: "Bali", country_code: "ID", active_services: 178 },
    { name: "Jakarta", country_code: "ID", active_services: 98 },
  ],
  JP: [
    { name: "Kyoto", country_code: "JP", active_services: 86 },
    { name: "Osaka", country_code: "JP", active_services: 102 },
    { name: "Tokyo", country_code: "JP", active_services: 198 },
  ],
  KR: [{ name: "Busan", country_code: "KR", active_services: 68 }, { name: "Seoul", country_code: "KR", active_services: 156 }],
  CN: [
    { name: "Beijing", country_code: "CN", active_services: 112 },
    { name: "Shanghai", country_code: "CN", active_services: 134 },
    { name: "Shenzhen", country_code: "CN", active_services: 88 },
  ],
  IN: [
    { name: "Bangalore", country_code: "IN", active_services: 112 },
    { name: "Delhi", country_code: "IN", active_services: 98 },
    { name: "Goa", country_code: "IN", active_services: 64 },
    { name: "Mumbai", country_code: "IN", active_services: 124 },
  ],
  SG: [{ name: "Singapore", country_code: "SG", active_services: 198 }],
  MY: [
    { name: "Kuala Lumpur", country_code: "MY", active_services: 112 },
    { name: "Penang", country_code: "MY", active_services: 68 },
  ],
  VN: [
    { name: "Da Nang", country_code: "VN", active_services: 72 },
    { name: "Hanoi", country_code: "VN", active_services: 88 },
    { name: "Ho Chi Minh", country_code: "VN", active_services: 104 },
  ],
  PH: [{ name: "Cebu", country_code: "PH", active_services: 56 }, { name: "Manila", country_code: "PH", active_services: 94 }],
  TW: [{ name: "Taipei", country_code: "TW", active_services: 118 }],
  HK: [{ name: "Hong Kong", country_code: "HK", active_services: 156 }],
  MO: [{ name: "Macao", country_code: "MO", active_services: 48 }],
  KH: [{ name: "Phnom Penh", country_code: "KH", active_services: 56 }, { name: "Siem Reap", country_code: "KH", active_services: 48 }],
  LA: [{ name: "Vientiane", country_code: "LA", active_services: 32 }],
  MM: [{ name: "Yangon", country_code: "MM", active_services: 34 }],
  BD: [{ name: "Dhaka", country_code: "BD", active_services: 48 }],
  LK: [{ name: "Colombo", country_code: "LK", active_services: 58 }],
  NP: [{ name: "Kathmandu", country_code: "NP", active_services: 52 }],
  PK: [{ name: "Islamabad", country_code: "PK", active_services: 42 }, { name: "Lahore", country_code: "PK", active_services: 48 }],
  AF: [{ name: "Kabul", country_code: "AF", active_services: 14 }],
  MN: [{ name: "Ulaanbaatar", country_code: "MN", active_services: 28 }],
  KZ: [{ name: "Almaty", country_code: "KZ", active_services: 52 }, { name: "Astana", country_code: "KZ", active_services: 44 }],
  UZ: [{ name: "Tashkent", country_code: "UZ", active_services: 38 }],
  KG: [{ name: "Bishkek", country_code: "KG", active_services: 32 }],
  TJ: [{ name: "Dushanbe", country_code: "TJ", active_services: 18 }],
  TM: [{ name: "Ashgabat", country_code: "TM", active_services: 16 }],
  AZ: [{ name: "Baku", country_code: "AZ", active_services: 48 }],
  GE: [{ name: "Batumi", country_code: "GE", active_services: 42 }, { name: "Tbilisi", country_code: "GE", active_services: 78 }],
  AM: [{ name: "Yerevan", country_code: "AM", active_services: 44 }],
  BN: [{ name: "Bandar Seri Begawan", country_code: "BN", active_services: 22 }],
  MV: [{ name: "Male", country_code: "MV", active_services: 42 }],
  BT: [{ name: "Thimphu", country_code: "BT", active_services: 16 }],
  TL: [{ name: "Dili", country_code: "TL", active_services: 12 }],
  TR: [
    { name: "Ankara", country_code: "TR", active_services: 68 },
    { name: "Antalya", country_code: "TR", active_services: 72 },
    { name: "Istanbul", country_code: "TR", active_services: 134 },
  ],

  // ─── AFRICA ───
  ZA: [
    { name: "Cape Town", country_code: "ZA", active_services: 108 },
    { name: "Johannesburg", country_code: "ZA", active_services: 94 },
  ],
  MA: [{ name: "Casablanca", country_code: "MA", active_services: 56 }, { name: "Marrakech", country_code: "MA", active_services: 72 }],
  EG: [{ name: "Cairo", country_code: "EG", active_services: 86 }],
  KE: [{ name: "Nairobi", country_code: "KE", active_services: 72 }],
  NG: [{ name: "Lagos", country_code: "NG", active_services: 68 }],
  GH: [{ name: "Accra", country_code: "GH", active_services: 52 }],
  TZ: [{ name: "Dar es Salaam", country_code: "TZ", active_services: 44 }, { name: "Zanzibar", country_code: "TZ", active_services: 38 }],
  ET: [{ name: "Addis Ababa", country_code: "ET", active_services: 42 }],
  RW: [{ name: "Kigali", country_code: "RW", active_services: 48 }],
  UG: [{ name: "Kampala", country_code: "UG", active_services: 38 }],
  SN: [{ name: "Dakar", country_code: "SN", active_services: 44 }],
  CI: [{ name: "Abidjan", country_code: "CI", active_services: 38 }],
  TN: [{ name: "Tunis", country_code: "TN", active_services: 48 }],
  DZ: [{ name: "Algiers", country_code: "DZ", active_services: 34 }],
  MU: [{ name: "Port Louis", country_code: "MU", active_services: 52 }],
  MG: [{ name: "Antananarivo", country_code: "MG", active_services: 24 }],
  NA: [{ name: "Windhoek", country_code: "NA", active_services: 32 }],
  BW: [{ name: "Gaborone", country_code: "BW", active_services: 28 }],
  ZM: [{ name: "Lusaka", country_code: "ZM", active_services: 26 }],
  ZW: [{ name: "Harare", country_code: "ZW", active_services: 22 }],
  MW: [{ name: "Lilongwe", country_code: "MW", active_services: 18 }],
  MZ: [{ name: "Maputo", country_code: "MZ", active_services: 24 }],
  AO: [{ name: "Luanda", country_code: "AO", active_services: 28 }],
  CD: [{ name: "Kinshasa", country_code: "CD", active_services: 22 }],
  CG: [{ name: "Brazzaville", country_code: "CG", active_services: 16 }],
  CM: [{ name: "Douala", country_code: "CM", active_services: 24 }],
  GA: [{ name: "Libreville", country_code: "GA", active_services: 18 }],
  ML: [{ name: "Bamako", country_code: "ML", active_services: 16 }],
  BF: [{ name: "Ouagadougou", country_code: "BF", active_services: 14 }],
  NE: [{ name: "Niamey", country_code: "NE", active_services: 12 }],
  TD: [{ name: "N'Djamena", country_code: "TD", active_services: 12 }],
  GN: [{ name: "Conakry", country_code: "GN", active_services: 14 }],
  SL: [{ name: "Freetown", country_code: "SL", active_services: 14 }],
  LR: [{ name: "Monrovia", country_code: "LR", active_services: 12 }],
  TG: [{ name: "Lome", country_code: "TG", active_services: 14 }],
  BJ: [{ name: "Cotonou", country_code: "BJ", active_services: 16 }],
  GM: [{ name: "Banjul", country_code: "GM", active_services: 18 }],
  CV: [{ name: "Praia", country_code: "CV", active_services: 22 }],
  SC: [{ name: "Victoria", country_code: "SC", active_services: 32 }],
  ER: [{ name: "Asmara", country_code: "ER", active_services: 10 }],
  DJ: [{ name: "Djibouti City", country_code: "DJ", active_services: 14 }],
  SO: [{ name: "Mogadishu", country_code: "SO", active_services: 12 }],
  SD: [{ name: "Khartoum", country_code: "SD", active_services: 18 }],
  SS: [{ name: "Juba", country_code: "SS", active_services: 10 }],
  CF: [{ name: "Bangui", country_code: "CF", active_services: 8 }],
  GQ: [{ name: "Malabo", country_code: "GQ", active_services: 12 }],
  ST: [{ name: "Sao Tome", country_code: "ST", active_services: 10 }],
  KM: [{ name: "Moroni", country_code: "KM", active_services: 8 }],
  BI: [{ name: "Bujumbura", country_code: "BI", active_services: 10 }],
  LS: [{ name: "Maseru", country_code: "LS", active_services: 12 }],
  SZ: [{ name: "Mbabane", country_code: "SZ", active_services: 14 }],
  LY: [{ name: "Tripoli", country_code: "LY", active_services: 16 }],
  MR: [{ name: "Nouakchott", country_code: "MR", active_services: 12 }],
  GW: [{ name: "Bissau", country_code: "GW", active_services: 8 }],

  // ─── OCEANIA ───
  AU: [
    { name: "Brisbane", country_code: "AU", active_services: 86 },
    { name: "Melbourne", country_code: "AU", active_services: 145 },
    { name: "Perth", country_code: "AU", active_services: 64 },
    { name: "Sydney", country_code: "AU", active_services: 167 },
  ],
  NZ: [
    { name: "Auckland", country_code: "NZ", active_services: 102 },
    { name: "Wellington", country_code: "NZ", active_services: 78 },
  ],
  FJ: [{ name: "Suva", country_code: "FJ", active_services: 28 }],
  PG: [{ name: "Port Moresby", country_code: "PG", active_services: 18 }],
  WS: [{ name: "Apia", country_code: "WS", active_services: 14 }],
  TO: [{ name: "Nuku'alofa", country_code: "TO", active_services: 12 }],
  VU: [{ name: "Port Vila", country_code: "VU", active_services: 16 }],
  SB: [{ name: "Honiara", country_code: "SB", active_services: 10 }],
  PW: [{ name: "Ngerulmud", country_code: "PW", active_services: 12 }],
  FM: [{ name: "Palikir", country_code: "FM", active_services: 8 }],
  MH: [{ name: "Majuro", country_code: "MH", active_services: 8 }],
  KI: [{ name: "Tarawa", country_code: "KI", active_services: 6 }],
  NR: [{ name: "Yaren", country_code: "NR", active_services: 4 }],
  TV: [{ name: "Funafuti", country_code: "TV", active_services: 4 }],
  PF: [{ name: "Papeete", country_code: "PF", active_services: 28 }],
  NC: [{ name: "Noumea", country_code: "NC", active_services: 22 }],
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
