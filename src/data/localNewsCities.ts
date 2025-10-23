import { NewsCity } from "@/types/localNews";

export const newsCities: NewsCity[] = [
  // TIER 1: GLOBAL HUBS (30 cities)
  {
    id: "nyc",
    cityName: "New York",
    countryCode: "USA",
    countryName: "United States",
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: "America/New_York",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["NY Times", "NY Post", "Daily News"],
      international: ["Reuters NYC", "AP New York", "Bloomberg"],
      english: ["Gothamist", "Time Out NY", "The Verge"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "lax",
    cityName: "Los Angeles",
    countryCode: "USA",
    countryName: "United States",
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: "America/Los_Angeles",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["LA Times", "LAist", "LA Daily News"],
      international: ["Reuters LA", "AP Los Angeles"],
      english: ["LA Magazine", "Eater LA"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "mia",
    cityName: "Miami",
    countryCode: "USA",
    countryName: "United States",
    latitude: 25.7617,
    longitude: -80.1918,
    timezone: "America/New_York",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Miami Herald", "Miami New Times", "Sun Sentinel"],
      international: ["Reuters Miami", "AP Miami"],
      english: ["Miami Today", "Biscayne Times"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "tor",
    cityName: "Toronto",
    countryCode: "CAN",
    countryName: "Canada",
    latitude: 43.6532,
    longitude: -79.3832,
    timezone: "America/Toronto",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Toronto Star", "Globe and Mail", "Toronto Sun"],
      international: ["Reuters Toronto", "CP Toronto"],
      english: ["BlogTO", "NOW Toronto"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "mex",
    cityName: "Mexico City",
    countryCode: "MEX",
    countryName: "Mexico",
    latitude: 19.4326,
    longitude: -99.1332,
    timezone: "America/Mexico_City",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["El Universal", "Reforma", "La Jornada"],
      international: ["Reuters Mexico", "AFP Mexico City"],
      english: ["Mexico News Daily", "The Yucatan Times"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "sao",
    cityName: "São Paulo",
    countryCode: "BRA",
    countryName: "Brazil",
    latitude: -23.5505,
    longitude: -46.6333,
    timezone: "America/Sao_Paulo",
    primaryLanguage: "pt",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Folha de S.Paulo", "O Estado de S. Paulo", "G1 São Paulo"],
      international: ["Reuters São Paulo", "AFP Brazil"],
      english: ["Brazil Reports", "Rio Times"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "bue",
    cityName: "Buenos Aires",
    countryCode: "ARG",
    countryName: "Argentina",
    latitude: -34.6037,
    longitude: -58.3816,
    timezone: "America/Argentina/Buenos_Aires",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["La Nación", "Clarín", "Página/12"],
      international: ["Reuters Buenos Aires", "AFP Argentina"],
      english: ["Buenos Aires Times", "Argentina Reports"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "lon",
    cityName: "London",
    countryCode: "GBR",
    countryName: "United Kingdom",
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: "Europe/London",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Evening Standard", "Time Out London", "Londonist"],
      international: ["Reuters London", "BBC London", "The Guardian"],
      english: ["Financial Times", "The Telegraph", "The Independent"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "ber",
    cityName: "Berlin",
    countryCode: "DEU",
    countryName: "Germany",
    latitude: 52.5200,
    longitude: 13.4050,
    timezone: "Europe/Berlin",
    primaryLanguage: "de",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Berliner Zeitung", "Tagesspiegel", "BZ Berlin"],
      international: ["Reuters Berlin", "DPA Berlin"],
      english: ["The Local Germany", "Exberliner", "Berlin Spectator"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "par",
    cityName: "Paris",
    countryCode: "FRA",
    countryName: "France",
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: "Europe/Paris",
    primaryLanguage: "fr",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Le Parisien", "Le Figaro", "Le Monde"],
      international: ["Reuters Paris", "AFP Paris"],
      english: ["The Local France", "Connexion France", "France 24"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "bcn",
    cityName: "Barcelona",
    countryCode: "ESP",
    countryName: "Spain",
    latitude: 41.3851,
    longitude: 2.1734,
    timezone: "Europe/Madrid",
    primaryLanguage: "es",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["La Vanguardia", "El Periódico", "El País Catalunya"],
      international: ["Reuters Barcelona", "EFE Barcelona"],
      english: ["Barcelona Metropolitan", "The Local Spain", "Catalonia Today"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "lis",
    cityName: "Lisbon",
    countryCode: "PRT",
    countryName: "Portugal",
    latitude: 38.7223,
    longitude: -9.1393,
    timezone: "Europe/Lisbon",
    primaryLanguage: "pt",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Público", "Expresso", "Jornal de Notícias"],
      international: ["Reuters Lisbon", "Lusa"],
      english: ["Portugal News", "The Portugalist", "Portugal Resident"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "ams",
    cityName: "Amsterdam",
    countryCode: "NLD",
    countryName: "Netherlands",
    latitude: 52.3676,
    longitude: 4.9041,
    timezone: "Europe/Amsterdam",
    primaryLanguage: "nl",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Het Parool", "Telegraaf", "NRC"],
      international: ["Reuters Amsterdam", "ANP"],
      english: ["DutchNews.nl", "I Amsterdam", "Amsterdam.nl"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "prg",
    cityName: "Prague",
    countryCode: "CZE",
    countryName: "Czech Republic",
    latitude: 50.0755,
    longitude: 14.4378,
    timezone: "Europe/Prague",
    primaryLanguage: "cs",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Blesk", "MF Dnes", "Lidové noviny"],
      international: ["Reuters Prague", "CTK"],
      english: ["Prague Morning", "Prague.tv", "Expats.cz"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "ist",
    cityName: "Istanbul",
    countryCode: "TUR",
    countryName: "Turkey",
    latitude: 41.0082,
    longitude: 28.9784,
    timezone: "Europe/Istanbul",
    primaryLanguage: "tr",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Hürriyet", "Milliyet", "Sabah"],
      international: ["Reuters Istanbul", "Anadolu Agency"],
      english: ["Daily Sabah", "Hürriyet Daily News", "Turkey Purge"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "tyo",
    cityName: "Tokyo",
    countryCode: "JPN",
    countryName: "Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
    primaryLanguage: "ja",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Asahi Shimbun", "Yomiuri Shimbun", "Mainichi Shimbun"],
      international: ["Reuters Tokyo", "Kyodo News", "Jiji Press"],
      english: ["Japan Times", "Japan Today", "NHK World"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "sin",
    cityName: "Singapore",
    countryCode: "SGP",
    countryName: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: "Asia/Singapore",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Straits Times", "Today", "Business Times"],
      international: ["Reuters Singapore", "Channel NewsAsia"],
      english: ["Mothership.sg", "Asia One", "The Independent SG"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "bkk",
    cityName: "Bangkok",
    countryCode: "THA",
    countryName: "Thailand",
    latitude: 13.7563,
    longitude: 100.5018,
    timezone: "Asia/Bangkok",
    primaryLanguage: "th",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Bangkok Post", "The Nation", "Thai PBS"],
      international: ["Reuters Bangkok", "AFP Bangkok"],
      english: ["Thaiger", "Coconuts Bangkok", "BK Magazine"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "sel",
    cityName: "Seoul",
    countryCode: "KOR",
    countryName: "South Korea",
    latitude: 37.5665,
    longitude: 126.9780,
    timezone: "Asia/Seoul",
    primaryLanguage: "ko",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Chosun Ilbo", "JoongAng Ilbo", "Hankyoreh"],
      international: ["Reuters Seoul", "Yonhap News"],
      english: ["Korea Herald", "Korea Times", "Korea JoongAng Daily"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "tpe",
    cityName: "Taipei",
    countryCode: "TWN",
    countryName: "Taiwan",
    latitude: 25.0330,
    longitude: 121.5654,
    timezone: "Asia/Taipei",
    primaryLanguage: "zh",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Liberty Times", "United Daily News", "China Times"],
      international: ["Reuters Taipei", "CNA"],
      english: ["Taiwan News", "Taipei Times", "Focus Taiwan"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "hkg",
    cityName: "Hong Kong",
    countryCode: "HKG",
    countryName: "Hong Kong",
    latitude: 22.3193,
    longitude: 114.1694,
    timezone: "Asia/Hong_Kong",
    primaryLanguage: "zh",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["South China Morning Post", "Hong Kong Free Press", "Apple Daily"],
      international: ["Reuters Hong Kong", "AFP Hong Kong"],
      english: ["HK01", "Coconuts Hong Kong", "Time Out HK"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "sha",
    cityName: "Shanghai",
    countryCode: "CHN",
    countryName: "China",
    latitude: 31.2304,
    longitude: 121.4737,
    timezone: "Asia/Shanghai",
    primaryLanguage: "zh",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Shanghai Daily", "Xinmin Evening News", "Liberation Daily"],
      international: ["Reuters Shanghai", "Xinhua Shanghai"],
      english: ["Shine", "That's Shanghai", "SmartShanghai"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "bjs",
    cityName: "Beijing",
    countryCode: "CHN",
    countryName: "China",
    latitude: 39.9042,
    longitude: 116.4074,
    timezone: "Asia/Shanghai",
    primaryLanguage: "zh",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Beijing Daily", "Beijing News", "People's Daily"],
      international: ["Reuters Beijing", "Xinhua"],
      english: ["China Daily", "Global Times", "Sixth Tone"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "dxb",
    cityName: "Dubai",
    countryCode: "ARE",
    countryName: "United Arab Emirates",
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: "Asia/Dubai",
    primaryLanguage: "ar",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Gulf News", "Khaleej Times", "The National"],
      international: ["Reuters Dubai", "Emirates News Agency"],
      english: ["Dubai Eye", "What's On Dubai", "Time Out Dubai"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "auh",
    cityName: "Abu Dhabi",
    countryCode: "ARE",
    countryName: "United Arab Emirates",
    latitude: 24.4539,
    longitude: 54.3773,
    timezone: "Asia/Dubai",
    primaryLanguage: "ar",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["The National", "Abu Dhabi Media", "Al Ittihad"],
      international: ["Reuters Abu Dhabi", "WAM"],
      english: ["Time Out Abu Dhabi", "Visit Abu Dhabi"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "tlv",
    cityName: "Tel Aviv",
    countryCode: "ISR",
    countryName: "Israel",
    latitude: 32.0853,
    longitude: 34.7818,
    timezone: "Asia/Jerusalem",
    primaryLanguage: "he",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Haaretz", "Yedioth Ahronoth", "Maariv"],
      international: ["Reuters Tel Aviv", "AFP Israel"],
      english: ["Times of Israel", "Jerusalem Post", "i24NEWS"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "ruh",
    cityName: "Riyadh",
    countryCode: "SAU",
    countryName: "Saudi Arabia",
    latitude: 24.7136,
    longitude: 46.6753,
    timezone: "Asia/Riyadh",
    primaryLanguage: "ar",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Okaz", "Al-Riyadh", "Al Jazirah"],
      international: ["Reuters Riyadh", "Saudi Press Agency"],
      english: ["Arab News", "Saudi Gazette", "Al Arabiya English"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "syd",
    cityName: "Sydney",
    countryCode: "AUS",
    countryName: "Australia",
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: "Australia/Sydney",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Sydney Morning Herald", "Daily Telegraph", "7News Sydney"],
      international: ["Reuters Sydney", "AAP Sydney"],
      english: ["Time Out Sydney", "Broadsheet", "Concrete Playground"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "mel",
    cityName: "Melbourne",
    countryCode: "AUS",
    countryName: "Australia",
    latitude: -37.8136,
    longitude: 144.9631,
    timezone: "Australia/Melbourne",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["The Age", "Herald Sun", "3AW Melbourne"],
      international: ["Reuters Melbourne", "AAP Melbourne"],
      english: ["Time Out Melbourne", "Broadsheet Melbourne"]
    },
    safetyAlerts: true,
    tier: 1
  },
  {
    id: "akl",
    cityName: "Auckland",
    countryCode: "NZL",
    countryName: "New Zealand",
    latitude: -36.8485,
    longitude: 174.7633,
    timezone: "Pacific/Auckland",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["NZ Herald", "Stuff", "Newshub"],
      international: ["Reuters Auckland", "NZPA"],
      english: ["Metro Magazine", "The Spinoff", "RNZ"]
    },
    safetyAlerts: true,
    tier: 1
  },

  // TIER 2: DIGITAL NOMAD HOTSPOTS (40 cities) - Adding key ones
  {
    id: "dps",
    cityName: "Bali",
    countryCode: "IDN",
    countryName: "Indonesia",
    latitude: -8.3405,
    longitude: 115.0920,
    timezone: "Asia/Makassar",
    primaryLanguage: "id",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Bali Post", "Tribun Bali", "Radar Bali"],
      international: ["Reuters Jakarta", "Antara Bali"],
      english: ["Bali Sun", "Now Bali", "Coconuts Bali"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "cnx",
    cityName: "Chiang Mai",
    countryCode: "THA",
    countryName: "Thailand",
    latitude: 18.7883,
    longitude: 98.9853,
    timezone: "Asia/Bangkok",
    primaryLanguage: "th",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Chiang Mai News", "CM108", "Daily News Chiang Mai"],
      international: ["Reuters Bangkok", "Thai PBS"],
      english: ["Citylife Chiang Mai", "Chiang Mai Mail", "CM Locator"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "sgn",
    cityName: "Ho Chi Minh City",
    countryCode: "VNM",
    countryName: "Vietnam",
    latitude: 10.8231,
    longitude: 106.6297,
    timezone: "Asia/Ho_Chi_Minh",
    primaryLanguage: "vi",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Tuoi Tre", "Thanh Nien", "VnExpress"],
      international: ["Reuters Hanoi", "VNA"],
      english: ["Saigoneer", "VN Express International", "The Saigon Times"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "han",
    cityName: "Hanoi",
    countryCode: "VNM",
    countryName: "Vietnam",
    latitude: 21.0285,
    longitude: 105.8542,
    timezone: "Asia/Ho_Chi_Minh",
    primaryLanguage: "vi",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Hanoi Moi", "Lao Dong", "Nhan Dan"],
      international: ["Reuters Hanoi", "Vietnam News Agency"],
      english: ["The Hanoi Times", "VN Express", "Vietnam Plus"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "kul",
    cityName: "Kuala Lumpur",
    countryCode: "MYS",
    countryName: "Malaysia",
    latitude: 3.1390,
    longitude: 101.6869,
    timezone: "Asia/Kuala_Lumpur",
    primaryLanguage: "ms",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["The Star", "New Straits Times", "Malaysiakini"],
      international: ["Reuters KL", "Bernama"],
      english: ["Malay Mail", "Free Malaysia Today", "Edge Markets"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "mnl",
    cityName: "Manila",
    countryCode: "PHL",
    countryName: "Philippines",
    latitude: 14.5995,
    longitude: 120.9842,
    timezone: "Asia/Manila",
    primaryLanguage: "tl",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Philippine Daily Inquirer", "Manila Bulletin", "Philippine Star"],
      international: ["Reuters Manila", "PNA"],
      english: ["ABS-CBN News", "GMA News", "Rappler"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "bud",
    cityName: "Budapest",
    countryCode: "HUN",
    countryName: "Hungary",
    latitude: 47.4979,
    longitude: 19.0402,
    timezone: "Europe/Budapest",
    primaryLanguage: "hu",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Nepszava", "Magyar Nemzet", "Index.hu"],
      international: ["Reuters Budapest", "MTI"],
      english: ["Budapest Times", "We Love Budapest", "Daily News Hungary"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "war",
    cityName: "Warsaw",
    countryCode: "POL",
    countryName: "Poland",
    latitude: 52.2297,
    longitude: 21.0122,
    timezone: "Europe/Warsaw",
    primaryLanguage: "pl",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Gazeta Wyborcza", "Rzeczpospolita", "Fakt"],
      international: ["Reuters Warsaw", "PAP"],
      english: ["The First News", "Notes from Poland", "Warsaw Insider"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "kra",
    cityName: "Krakow",
    countryCode: "POL",
    countryName: "Poland",
    latitude: 50.0647,
    longitude: 19.9450,
    timezone: "Europe/Warsaw",
    primaryLanguage: "pl",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Gazeta Krakowska", "Dziennik Polski", "Krakow Post"],
      international: ["Reuters Warsaw", "PAP Krakow"],
      english: ["Krakow Post", "Love Krakow", "The Krakow Times"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "vie",
    cityName: "Vienna",
    countryCode: "AUT",
    countryName: "Austria",
    latitude: 48.2082,
    longitude: 16.3738,
    timezone: "Europe/Vienna",
    primaryLanguage: "de",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Der Standard", "Kurier", "Kronen Zeitung"],
      international: ["Reuters Vienna", "APA"],
      english: ["The Local Austria", "Vienna Online", "Vienna.info"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "bru",
    cityName: "Brussels",
    countryCode: "BEL",
    countryName: "Belgium",
    latitude: 50.8503,
    longitude: 4.3517,
    timezone: "Europe/Brussels",
    primaryLanguage: "fr",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Le Soir", "De Standaard", "La Libre"],
      international: ["Reuters Brussels", "Belga"],
      english: ["Brussels Times", "The Bulletin", "Flanders Today"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "cph",
    cityName: "Copenhagen",
    countryCode: "DNK",
    countryName: "Denmark",
    latitude: 55.6761,
    longitude: 12.5683,
    timezone: "Europe/Copenhagen",
    primaryLanguage: "da",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Politiken", "Berlingske", "Ekstrabladet"],
      international: ["Reuters Copenhagen", "Ritzau"],
      english: ["The Local Denmark", "Copenhagen Post", "Scandinavian Traveler"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "sto",
    cityName: "Stockholm",
    countryCode: "SWE",
    countryName: "Sweden",
    latitude: 59.3293,
    longitude: 18.0686,
    timezone: "Europe/Stockholm",
    primaryLanguage: "sv",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Dagens Nyheter", "Svenska Dagbladet", "Aftonbladet"],
      international: ["Reuters Stockholm", "TT"],
      english: ["The Local Sweden", "Radio Sweden", "Stockholm News"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "med",
    cityName: "Medellin",
    countryCode: "COL",
    countryName: "Colombia",
    latitude: 6.2476,
    longitude: -75.5658,
    timezone: "America/Bogota",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["El Colombiano", "El Tiempo Medellin", "Q'Hubo"],
      international: ["Reuters Bogota", "EFE Colombia"],
      english: ["Medellin Herald", "Colombia Reports", "The City Paper"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "bog",
    cityName: "Bogota",
    countryCode: "COL",
    countryName: "Colombia",
    latitude: 4.7110,
    longitude: -74.0721,
    timezone: "America/Bogota",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["El Tiempo", "El Espectador", "Semana"],
      international: ["Reuters Bogota", "AFP Colombia"],
      english: ["Colombia Reports", "Bogota Post", "The City Paper"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "lim",
    cityName: "Lima",
    countryCode: "PER",
    countryName: "Peru",
    latitude: -12.0464,
    longitude: -77.0428,
    timezone: "America/Lima",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["El Comercio", "La República", "Peru21"],
      international: ["Reuters Lima", "AFP Peru"],
      english: ["Peru Reports", "Living in Peru", "Peru This Week"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "scl",
    cityName: "Santiago",
    countryCode: "CHL",
    countryName: "Chile",
    latitude: -33.4489,
    longitude: -70.6693,
    timezone: "America/Santiago",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["El Mercurio", "La Tercera", "Emol"],
      international: ["Reuters Santiago", "AFP Chile"],
      english: ["Santiago Times", "Chile Today", "The Clinic"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "sjo",
    cityName: "San Jose",
    countryCode: "CRI",
    countryName: "Costa Rica",
    latitude: 9.9281,
    longitude: -84.0907,
    timezone: "America/Costa_Rica",
    primaryLanguage: "es",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["La Nación", "Diario Extra", "CR Hoy"],
      international: ["Reuters San Jose", "EFE Costa Rica"],
      english: ["Tico Times", "The Costa Rica News", "Inside Costa Rica"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "yul",
    cityName: "Montreal",
    countryCode: "CAN",
    countryName: "Canada",
    latitude: 45.5017,
    longitude: -73.5673,
    timezone: "America/Montreal",
    primaryLanguage: "fr",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["La Presse", "Le Devoir", "Montreal Gazette"],
      international: ["Reuters Montreal", "Canadian Press"],
      english: ["Montreal Gazette", "MTL Blog", "CTV Montreal"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "yvr",
    cityName: "Vancouver",
    countryCode: "CAN",
    countryName: "Canada",
    latitude: 49.2827,
    longitude: -123.1207,
    timezone: "America/Vancouver",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Vancouver Sun", "Province", "Georgia Straight"],
      international: ["Reuters Vancouver", "Canadian Press"],
      english: ["Daily Hive", "Vancouver Is Awesome", "CBC Vancouver"]
    },
    safetyAlerts: true,
    tier: 2
  },

  // TIER 3: EMERGING DESTINATIONS (30 cities) - Adding key ones
  {
    id: "cpt",
    cityName: "Cape Town",
    countryCode: "ZAF",
    countryName: "South Africa",
    latitude: -33.9249,
    longitude: 18.4241,
    timezone: "Africa/Johannesburg",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Cape Times", "Cape Argus", "Daily Voice"],
      international: ["Reuters Johannesburg", "SAPA"],
      english: ["IOL Cape Town", "News24 Cape Town", "CapeTown ETC"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "nbo",
    cityName: "Nairobi",
    countryCode: "KEN",
    countryName: "Kenya",
    latitude: -1.2921,
    longitude: 36.8219,
    timezone: "Africa/Nairobi",
    primaryLanguage: "sw",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Daily Nation", "The Standard", "Star"],
      international: ["Reuters Nairobi", "AFP Nairobi"],
      english: ["Business Daily", "Capital FM", "Citizen Digital"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "rak",
    cityName: "Marrakech",
    countryCode: "MAR",
    countryName: "Morocco",
    latitude: 31.6295,
    longitude: -7.9811,
    timezone: "Africa/Casablanca",
    primaryLanguage: "ar",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Le Matin", "Al Massae", "Hespress"],
      international: ["Reuters Rabat", "MAP"],
      english: ["Morocco World News", "Yabiladi", "Morocco Times"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "cai",
    cityName: "Cairo",
    countryCode: "EGY",
    countryName: "Egypt",
    latitude: 30.0444,
    longitude: 31.2357,
    timezone: "Africa/Cairo",
    primaryLanguage: "ar",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Al-Ahram", "Al-Masry Al-Youm", "Youm7"],
      international: ["Reuters Cairo", "AFP Egypt"],
      english: ["Egypt Today", "Egypt Independent", "Cairo Scene"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "acc",
    cityName: "Accra",
    countryCode: "GHA",
    countryName: "Ghana",
    latitude: 5.6037,
    longitude: -0.1870,
    timezone: "Africa/Accra",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Daily Graphic", "Ghanaian Times", "Joy News"],
      international: ["Reuters Accra", "GNA"],
      english: ["Citi Newsroom", "Myjoyonline", "GhanaWeb"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "dad",
    cityName: "Da Nang",
    countryCode: "VNM",
    countryName: "Vietnam",
    latitude: 16.0544,
    longitude: 108.2022,
    timezone: "Asia/Ho_Chi_Minh",
    primaryLanguage: "vi",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Bao Da Nang", "Da Nang Today", "Tuoi Tre Da Nang"],
      international: ["Reuters Hanoi", "VNA"],
      english: ["Da Nang Today", "VN Express Danang", "Vietnam Insider"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "pen",
    cityName: "Penang",
    countryCode: "MYS",
    countryName: "Malaysia",
    latitude: 5.4164,
    longitude: 100.3327,
    timezone: "Asia/Kuala_Lumpur",
    primaryLanguage: "ms",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Kwong Wah Daily", "Penang Chinese Daily", "Oriental Daily"],
      international: ["Reuters KL", "Bernama"],
      english: ["The Star Penang", "Penang Monthly", "Penang Foodie"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "hyd",
    cityName: "Hyderabad",
    countryCode: "IND",
    countryName: "India",
    latitude: 17.3850,
    longitude: 78.4867,
    timezone: "Asia/Kolkata",
    primaryLanguage: "te",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Deccan Chronicle", "Telangana Today", "Hans India"],
      international: ["Reuters Mumbai", "PTI"],
      english: ["Times of India Hyderabad", "Hindu Hyderabad", "News Minute"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "blr",
    cityName: "Bangalore",
    countryCode: "IND",
    countryName: "India",
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: "Asia/Kolkata",
    primaryLanguage: "kn",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Deccan Herald", "Bangalore Mirror", "Vijaya Karnataka"],
      international: ["Reuters Bangalore", "PTI"],
      english: ["Times of India Bangalore", "Hindu Bangalore", "Citizen Matters"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "maa",
    cityName: "Chennai",
    countryCode: "IND",
    countryName: "India",
    latitude: 13.0827,
    longitude: 80.2707,
    timezone: "Asia/Kolkata",
    primaryLanguage: "ta",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["The Hindu", "Deccan Chronicle Chennai", "Dinamalar"],
      international: ["Reuters Chennai", "PTI"],
      english: ["Times of India Chennai", "New Indian Express", "Hindu Metro Plus"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "opo",
    cityName: "Porto",
    countryCode: "PRT",
    countryName: "Portugal",
    latitude: 41.1579,
    longitude: -8.6291,
    timezone: "Europe/Lisbon",
    primaryLanguage: "pt",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Jornal de Notícias Porto", "Correio da Manhã Porto", "Porto Canal"],
      international: ["Reuters Lisbon", "Lusa"],
      english: ["Porto North", "The Portugal News", "Time Out Porto"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "vlc",
    cityName: "Valencia",
    countryCode: "ESP",
    countryName: "Spain",
    latitude: 39.4699,
    longitude: -0.3763,
    timezone: "Europe/Madrid",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Las Provincias", "Levante-EMV", "Valencia Plaza"],
      international: ["Reuters Madrid", "EFE Valencia"],
      english: ["Valencia Today", "Love Valencia", "Valencia Expat"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "svq",
    cityName: "Seville",
    countryCode: "ESP",
    countryName: "Spain",
    latitude: 37.3891,
    longitude: -5.9845,
    timezone: "Europe/Madrid",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Diario de Sevilla", "ABC Sevilla", "El Correo de Andalucía"],
      international: ["Reuters Madrid", "EFE Seville"],
      english: ["Sevilla Today", "Love Seville", "Andalucia.com"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "ath",
    cityName: "Athens",
    countryCode: "GRC",
    countryName: "Greece",
    latitude: 37.9838,
    longitude: 23.7275,
    timezone: "Europe/Athens",
    primaryLanguage: "el",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Kathimerini", "To Vima", "Ethnos"],
      international: ["Reuters Athens", "ANA-MPA"],
      english: ["Athens News", "Greek Reporter", "Keep Talking Greece"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "skg",
    cityName: "Thessaloniki",
    countryCode: "GRC",
    countryName: "Greece",
    latitude: 40.6401,
    longitude: 22.9444,
    timezone: "Europe/Athens",
    primaryLanguage: "el",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Makedonia", "Thesstoday", "The TOC"],
      international: ["Reuters Athens", "ANA Thessaloniki"],
      english: ["Greek News Agenda", "GTP Headlines", "Thessaloniki Arts"]
    },
    safetyAlerts: true,
    tier: 3
  },
  
  // Additional Tier 2 & 3 cities to reach 100
  {
    id: "phu",
    cityName: "Phuket",
    countryCode: "THA",
    countryName: "Thailand",
    latitude: 7.8804,
    longitude: 98.3923,
    timezone: "Asia/Bangkok",
    primaryLanguage: "th",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Phuket News", "Phuket Gazette", "The Thaiger"],
      international: ["Reuters Bangkok", "Thai PBS"],
      english: ["Phuket News", "Coconuts Phuket"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "dub",
    cityName: "Dublin",
    countryCode: "IRL",
    countryName: "Ireland",
    latitude: 53.3498,
    longitude: -6.2603,
    timezone: "Europe/Dublin",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Irish Times", "Irish Independent", "The Journal"],
      international: ["Reuters Dublin", "PA Ireland"],
      english: ["Dublin Live", "Lovin Dublin"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "edi",
    cityName: "Edinburgh",
    countryCode: "GBR",
    countryName: "United Kingdom",
    latitude: 55.9533,
    longitude: -3.1883,
    timezone: "Europe/London",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["The Scotsman", "Edinburgh News", "Edinburgh Live"],
      international: ["Reuters Edinburgh", "PA Scotland"],
      english: ["Edinburgh Reporter", "The Skinny"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "man",
    cityName: "Manchester",
    countryCode: "GBR",
    countryName: "United Kingdom",
    latitude: 53.4808,
    longitude: -2.2426,
    timezone: "Europe/London",
    primaryLanguage: "en",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Manchester Evening News", "The Guardian Manchester", "Manchester Wire"],
      international: ["Reuters Manchester", "PA North"],
      english: ["Confidentials Manchester", "Manchester Mill"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "rom",
    cityName: "Rome",
    countryCode: "ITA",
    countryName: "Italy",
    latitude: 41.9028,
    longitude: 12.4964,
    timezone: "Europe/Rome",
    primaryLanguage: "it",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Il Messaggero", "La Repubblica Roma", "Corriere della Sera"],
      international: ["Reuters Rome", "ANSA"],
      english: ["The Local Italy", "Wanted in Rome", "Rome Reports"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "mil",
    cityName: "Milan",
    countryCode: "ITA",
    countryName: "Italy",
    latitude: 45.4642,
    longitude: 9.1900,
    timezone: "Europe/Rome",
    primaryLanguage: "it",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Corriere della Sera Milano", "Il Giorno", "Milano Today"],
      international: ["Reuters Milan", "ANSA Milano"],
      english: ["Milano.Today", "MilanoToday English"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "muc",
    cityName: "Munich",
    countryCode: "DEU",
    countryName: "Germany",
    latitude: 48.1351,
    longitude: 11.5820,
    timezone: "Europe/Berlin",
    primaryLanguage: "de",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Süddeutsche Zeitung", "Münchner Merkur", "TZ"],
      international: ["Reuters Munich", "DPA Munich"],
      english: ["The Local Munich", "Munich Voice", "Toytown Munich"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "zur",
    cityName: "Zurich",
    countryCode: "CHE",
    countryName: "Switzerland",
    latitude: 47.3769,
    longitude: 8.5417,
    timezone: "Europe/Zurich",
    primaryLanguage: "de",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Neue Zürcher Zeitung", "Tages-Anzeiger", "Blick"],
      international: ["Reuters Zurich", "SDA"],
      english: ["The Local Switzerland", "Zurich English News"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "gen",
    cityName: "Geneva",
    countryCode: "CHE",
    countryName: "Switzerland",
    latitude: 46.2044,
    longitude: 6.1432,
    timezone: "Europe/Zurich",
    primaryLanguage: "fr",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Tribune de Genève", "Le Temps", "20 Minutes"],
      international: ["Reuters Geneva", "SDA Geneva"],
      english: ["Geneva Lunch", "Living in Geneva"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "hel",
    cityName: "Helsinki",
    countryCode: "FIN",
    countryName: "Finland",
    latitude: 60.1699,
    longitude: 24.9384,
    timezone: "Europe/Helsinki",
    primaryLanguage: "fi",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Helsingin Sanomat", "Ilta-Sanomat", "Yle"],
      international: ["Reuters Helsinki", "STT"],
      english: ["Helsinki Times", "Yle News English"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "osl",
    cityName: "Oslo",
    countryCode: "NOR",
    countryName: "Norway",
    latitude: 59.9139,
    longitude: 10.7522,
    timezone: "Europe/Oslo",
    primaryLanguage: "no",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Aftenposten", "VG", "Dagbladet"],
      international: ["Reuters Oslo", "NTB"],
      english: ["The Local Norway", "Norway Today"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "tal",
    cityName: "Tallinn",
    countryCode: "EST",
    countryName: "Estonia",
    latitude: 59.4370,
    longitude: 24.7536,
    timezone: "Europe/Tallinn",
    primaryLanguage: "et",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Postimees", "Eesti Päevaleht", "Delfi"],
      international: ["Reuters Tallinn", "BNS"],
      english: ["ERR News", "Tallinn Times"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "rig",
    cityName: "Riga",
    countryCode: "LVA",
    countryName: "Latvia",
    latitude: 56.9496,
    longitude: 24.1052,
    timezone: "Europe/Riga",
    primaryLanguage: "lv",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Latvijas Avīze", "Diena", "Delfi Latvia"],
      international: ["Reuters Riga", "BNS Latvia"],
      english: ["The Baltic Times", "Riga Today"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "vil",
    cityName: "Vilnius",
    countryCode: "LTU",
    countryName: "Lithuania",
    latitude: 54.6872,
    longitude: 25.2797,
    timezone: "Europe/Vilnius",
    primaryLanguage: "lt",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Lietuvos rytas", "Delfi Lithuania", "15min"],
      international: ["Reuters Vilnius", "BNS Lithuania"],
      english: ["Lithuania Tribune", "Vilnius Now"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "zag",
    cityName: "Zagreb",
    countryCode: "HRV",
    countryName: "Croatia",
    latitude: 45.8150,
    longitude: 15.9819,
    timezone: "Europe/Zagreb",
    primaryLanguage: "hr",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Večernji list", "Jutarnji list", "24sata"],
      international: ["Reuters Zagreb", "HINA"],
      english: ["Total Croatia News", "Croatia Week"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "bel",
    cityName: "Belgrade",
    countryCode: "SRB",
    countryName: "Serbia",
    latitude: 44.7866,
    longitude: 20.4489,
    timezone: "Europe/Belgrade",
    primaryLanguage: "sr",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Blic", "Politika", "Kurir"],
      international: ["Reuters Belgrade", "Tanjug"],
      english: ["Belgrade Insight", "B92 English"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "sof",
    cityName: "Sofia",
    countryCode: "BGR",
    countryName: "Bulgaria",
    latitude: 42.6977,
    longitude: 23.3219,
    timezone: "Europe/Sofia",
    primaryLanguage: "bg",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["24 Chasa", "Dnevnik", "Capital"],
      international: ["Reuters Sofia", "BTA"],
      english: ["The Sofia Globe", "Novinite"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "buc",
    cityName: "Bucharest",
    countryCode: "ROU",
    countryName: "Romania",
    latitude: 44.4268,
    longitude: 26.1025,
    timezone: "Europe/Bucharest",
    primaryLanguage: "ro",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Adevărul", "Libertatea", "Gandul"],
      international: ["Reuters Bucharest", "Agerpres"],
      english: ["Romania Insider", "Bucharest Herald"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "qui",
    cityName: "Quito",
    countryCode: "ECU",
    countryName: "Ecuador",
    latitude: -0.1807,
    longitude: -78.4678,
    timezone: "America/Guayaquil",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["El Comercio", "El Universo", "La Hora"],
      international: ["Reuters Quito", "EFE Ecuador"],
      english: ["Ecuador Times", "Cuenca High Life"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "pan",
    cityName: "Panama City",
    countryCode: "PAN",
    countryName: "Panama",
    latitude: 8.9824,
    longitude: -79.5199,
    timezone: "America/Panama",
    primaryLanguage: "es",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["La Prensa", "El Siglo", "TVN Noticias"],
      international: ["Reuters Panama", "EFE Panama"],
      english: ["Panama Today", "The Panama News"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "gua",
    cityName: "Guadalajara",
    countryCode: "MEX",
    countryName: "Mexico",
    latitude: 20.6597,
    longitude: -103.3496,
    timezone: "America/Mexico_City",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["El Informador", "Milenio Jalisco", "Notisistema"],
      international: ["Reuters Guadalajara", "EFE Mexico"],
      english: ["Guadalajara Reporter", "GDL Life"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "pla",
    cityName: "Playa del Carmen",
    countryCode: "MEX",
    countryName: "Mexico",
    latitude: 20.6296,
    longitude: -87.0739,
    timezone: "America/Cancun",
    primaryLanguage: "es",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Por Esto!", "Novedades Quintana Roo", "Luces del Siglo"],
      international: ["Reuters Mexico", "Notimex"],
      english: ["Playa Times", "Riviera Maya News"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "cnc",
    cityName: "Cancun",
    countryCode: "MEX",
    countryName: "Mexico",
    latitude: 21.1619,
    longitude: -86.8515,
    timezone: "America/Cancun",
    primaryLanguage: "es",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["Novedades Cancún", "Sipse", "Diario de Yucatán"],
      international: ["Reuters Cancun", "EFE Mexico"],
      english: ["Cancun Sun", "Riviera Maya Times"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "car",
    cityName: "Cartagena",
    countryCode: "COL",
    countryName: "Colombia",
    latitude: 10.3910,
    longitude: -75.4794,
    timezone: "America/Bogota",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["El Universal Cartagena", "El Heraldo", "Caracol Cartagena"],
      international: ["Reuters Bogota", "EFE Colombia"],
      english: ["Colombia Travel", "Cartagena Life"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "mon",
    cityName: "Montevideo",
    countryCode: "URY",
    countryName: "Uruguay",
    latitude: -34.9011,
    longitude: -56.1645,
    timezone: "America/Montevideo",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["El País Uruguay", "El Observador", "La Diaria"],
      international: ["Reuters Montevideo", "EFE Uruguay"],
      english: ["Uruguay Times", "MercoPress"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "pun",
    cityName: "Punta del Este",
    countryCode: "URY",
    countryName: "Uruguay",
    latitude: -34.9631,
    longitude: -54.9471,
    timezone: "America/Montevideo",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["El País Punta", "Maldonado Noticias", "La Prensa"],
      international: ["Reuters Montevideo", "EFE Uruguay"],
      english: ["Punta del Este News", "Uruguay Times"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "cuz",
    cityName: "Cusco",
    countryCode: "PER",
    countryName: "Peru",
    latitude: -13.5319,
    longitude: -71.9675,
    timezone: "America/Lima",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Diario del Cusco", "Cusco al Día", "La República Cusco"],
      international: ["Reuters Lima", "Andina"],
      english: ["Peru Reports Cusco", "Cusco Eats"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "asu",
    cityName: "Asunción",
    countryCode: "PRY",
    countryName: "Paraguay",
    latitude: -25.2637,
    longitude: -57.5759,
    timezone: "America/Asuncion",
    primaryLanguage: "es",
    englishCoverageLevel: "basic",
    newsSources: {
      local: ["ABC Color", "La Nación Paraguay", "Última Hora"],
      international: ["Reuters Asuncion", "EFE Paraguay"],
      english: ["Paraguay News", "Latin America Herald"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "lpa",
    cityName: "La Paz",
    countryCode: "BOL",
    countryName: "Bolivia",
    latitude: -16.5000,
    longitude: -68.1500,
    timezone: "America/La_Paz",
    primaryLanguage: "es",
    englishCoverageLevel: "basic",
    newsSources: {
      local: ["La Razón", "El Deber", "Página Siete"],
      international: ["Reuters La Paz", "EFE Bolivia"],
      english: ["Bolivia Express", "Bolivia Weekly"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "jkt",
    cityName: "Jakarta",
    countryCode: "IDN",
    countryName: "Indonesia",
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: "Asia/Jakarta",
    primaryLanguage: "id",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["Kompas", "Tempo", "Detik"],
      international: ["Reuters Jakarta", "Antara"],
      english: ["Jakarta Post", "Jakarta Globe", "Coconuts Jakarta"]
    },
    safetyAlerts: true,
    tier: 2
  },
  {
    id: "cgk",
    cityName: "Surabaya",
    countryCode: "IDN",
    countryName: "Indonesia",
    latitude: -7.2575,
    longitude: 112.7521,
    timezone: "Asia/Jakarta",
    primaryLanguage: "id",
    englishCoverageLevel: "basic",
    newsSources: {
      local: ["Jawa Pos", "Surabaya Post", "Surya"],
      international: ["Reuters Jakarta", "Antara Surabaya"],
      english: ["East Java News", "Surabaya Expat"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "ceb",
    cityName: "Cebu",
    countryCode: "PHL",
    countryName: "Philippines",
    latitude: 10.3157,
    longitude: 123.8854,
    timezone: "Asia/Manila",
    primaryLanguage: "tl",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["SunStar Cebu", "Cebu Daily News", "Freeman"],
      international: ["Reuters Manila", "PNA Cebu"],
      english: ["Cebu Pacific News", "Sugbo News"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "dav",
    cityName: "Davao",
    countryCode: "PHL",
    countryName: "Philippines",
    latitude: 7.1907,
    longitude: 125.4553,
    timezone: "Asia/Manila",
    primaryLanguage: "tl",
    englishCoverageLevel: "excellent",
    newsSources: {
      local: ["SunStar Davao", "Mindanao Times", "Davao Today"],
      international: ["Reuters Manila", "PNA Davao"],
      english: ["Davao Life", "Edge Davao"]
    },
    safetyAlerts: true,
    tier: 3
  },
  {
    id: "ctg",
    cityName: "Cartagena de Indias",
    countryCode: "COL",
    countryName: "Colombia",
    latitude: 10.3910,
    longitude: -75.4794,
    timezone: "America/Bogota",
    primaryLanguage: "es",
    englishCoverageLevel: "good",
    newsSources: {
      local: ["El Universal", "El Heraldo Cartagena", "Caracol"],
      international: ["Reuters Bogota", "EFE"],
      english: ["Cartagena Connect", "Colombia Travel"]
    },
    safetyAlerts: true,
    tier: 3
  }
];

// Helper functions
export const getCityById = (id: string): NewsCity | undefined => {
  return newsCities.find(city => city.id === id);
};

export const getCitiesByCountry = (countryCode: string): NewsCity[] => {
  return newsCities.filter(city => city.countryCode === countryCode);
};

export const getCitiesByTier = (tier: 1 | 2 | 3): NewsCity[] => {
  return newsCities.filter(city => city.tier === tier);
};

export const searchCities = (query: string): NewsCity[] => {
  const lowerQuery = query.toLowerCase();
  return newsCities.filter(city => 
    city.cityName.toLowerCase().includes(lowerQuery) ||
    city.countryName.toLowerCase().includes(lowerQuery)
  );
};
