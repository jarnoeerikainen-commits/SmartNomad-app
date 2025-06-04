
export interface Country {
  id: string;
  code: string;
  name: string;
  flag: string;
  dayLimit: number;
  daysSpent: number;
  reason: string;
  lastUpdate: string | null;
  countTravelDays: boolean;
  yearlyDaysSpent: number; // Days spent in current tax year
  lastEntry: string | null; // Date of last entry to country
  totalEntries: number; // Total number of entries to this country
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
