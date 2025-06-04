
export interface Country {
  id: string;
  code: string;
  name: string;
  flag: string;
  dayLimit: number;
  daysSpent: number;
  reason: string;
  lastUpdate: string | null;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  city: string;
  timestamp: number;
}

export interface CountryLimit {
  countryCode: string;
  limit: number;
  reason: string;
}
