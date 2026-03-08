import { supabase } from '@/integrations/supabase/client';

export interface AIServiceProvider {
  name: string;
  description: string;
  rating: number;
  website: string;
  phone: string;
  address: string;
  hours?: string;
  priceRange?: string;
  languages?: string[];
  verified: boolean;
  highlights?: string[];
}

export interface AIServiceCategory {
  name: string;
  providers: AIServiceProvider[];
}

export interface AICityServicesData {
  city: string;
  country: string;
  lastResearched: string;
  categories: AIServiceCategory[];
}

const CACHE_KEY_PREFIX = 'supernomad_city_services_';
const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedData {
  data: AICityServicesData;
  timestamp: number;
}

class CityServicesAIService {
  // Check localStorage cache first
  getCached(cityName: string): AICityServicesData | null {
    try {
      const key = CACHE_KEY_PREFIX + cityName.toLowerCase().replace(/\s/g, '_');
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const parsed: CachedData = JSON.parse(cached);
      if (Date.now() - parsed.timestamp > CACHE_DURATION_MS) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  }

  // Save to cache
  private setCache(cityName: string, data: AICityServicesData) {
    try {
      const key = CACHE_KEY_PREFIX + cityName.toLowerCase().replace(/\s/g, '_');
      const cached: CachedData = { data, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(cached));
    } catch {
      // localStorage full or unavailable
    }
  }

  // Fetch from AI (edge function)
  async fetchCityServices(
    cityName: string,
    countryName: string,
    categories?: string[]
  ): Promise<AICityServicesData> {
    // Check cache first
    const cached = this.getCached(cityName);
    if (cached) return cached;

    const { data, error } = await supabase.functions.invoke('city-services', {
      body: { cityName, countryName, categories },
    });

    if (error) {
      throw new Error(error.message || 'Failed to fetch city services');
    }

    if (!data?.success || !data?.data) {
      throw new Error(data?.error || 'No data returned');
    }

    const result: AICityServicesData = data.data;
    this.setCache(cityName, result);
    return result;
  }

  // Clear cache for a city (force refresh)
  clearCache(cityName: string) {
    const key = CACHE_KEY_PREFIX + cityName.toLowerCase().replace(/\s/g, '_');
    localStorage.removeItem(key);
  }

  // Clear all city services cache
  clearAllCache() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY_PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  }

  // Get cached city names
  getCachedCities(): string[] {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_KEY_PREFIX))
      .map(k => k.replace(CACHE_KEY_PREFIX, '').replace(/_/g, ' '));
  }
}

export default new CityServicesAIService();
