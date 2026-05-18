import { supabase } from '@/integrations/supabase/client';

export type DiningGuide = 'michelin' | 'worlds50best' | 'la-liste' | 'gault-millau';

export interface FineDiningRestaurant {
  name: string;
  city: string;
  country: string;
  /** 1, 2, 3 = Michelin stars; 'bib' = Bib Gourmand; 0 = no star but listed elsewhere */
  michelinStars: 0 | 1 | 2 | 3 | 'bib';
  worlds50BestRank?: number;
  laListeScore?: number; // 0-100
  gaultMillauToques?: number; // 1-5
  cuisine: string;
  priceRange: '$$$' | '$$$$' | '$$$$$';
  address: string;
  phone?: string;
  website?: string;
  bookingUrl?: string; // direct reservation link (Tock, Resy, OpenTable, SevenRooms, restaurant site)
  bookingPlatform?: 'tock' | 'resy' | 'opentable' | 'sevenrooms' | 'direct' | 'concierge-only';
  /** Typical advance booking window (weeks) to land a desk-time slot. */
  leadTimeWeeks: number;
  /** True if reservation is famously difficult (e.g. lottery, months-long). */
  hardToBook: boolean;
  signatureDishes?: string[];
  chef?: string;
  michelinUrl?: string;
  source: DiningGuide[];
  lastVerified: string; // YYYY-MM-DD
}

export interface FineDiningCityData {
  city: string;
  country: string;
  countryCode: string;
  fetchedAt: string;
  restaurants: FineDiningRestaurant[];
  notes?: string;
}

const CACHE_PREFIX = 'supernomad_finedining_';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days (Michelin lists update slowly)

class FineDiningService {
  private cacheKey(cityId: string) {
    return CACHE_PREFIX + cityId;
  }

  getCached(cityId: string): FineDiningCityData | null {
    try {
      const raw = localStorage.getItem(this.cacheKey(cityId));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { data: FineDiningCityData; timestamp: number };
      if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
        localStorage.removeItem(this.cacheKey(cityId));
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  }

  private setCache(cityId: string, data: FineDiningCityData) {
    try {
      localStorage.setItem(this.cacheKey(cityId), JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
      /* quota */
    }
  }

  async fetchCity(opts: {
    cityId: string;
    city: string;
    country: string;
    countryCode: string;
    guides?: DiningGuide[];
    minStars?: 0 | 1 | 2 | 3;
    force?: boolean;
  }): Promise<FineDiningCityData> {
    if (!opts.force) {
      const cached = this.getCached(opts.cityId);
      if (cached) return cached;
    }

    // Use explicit fetch instead of supabase.functions.invoke — the Lovable
    // preview proxy can intermittently interfere with the invoke() POST flow,
    // producing "Failed to send a request to the Edge Function" errors.
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fine-dining`;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

    let session: { access_token?: string } | null = null;
    try {
      const { data: s } = await supabase.auth.getSession();
      session = s?.session ?? null;
    } catch { /* anonymous ok */ }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: anonKey,
          Authorization: `Bearer ${session?.access_token || anonKey}`,
        },
        body: JSON.stringify({
          city: opts.city,
          country: opts.country,
          countryCode: opts.countryCode,
          guides: opts.guides ?? ['michelin', 'worlds50best', 'la-liste', 'gault-millau'],
          minStars: opts.minStars ?? 1,
        }),
      });
    } catch (e) {
      throw new Error(`Network error reaching fine dining service: ${e instanceof Error ? e.message : 'unknown'}`);
    }

    let payload: any = null;
    try {
      payload = await response.json();
    } catch {
      throw new Error(`Fine dining service returned non-JSON (status ${response.status})`);
    }

    if (!response.ok) {
      throw new Error(payload?.error || `Fine dining service error (${response.status})`);
    }
    if (!payload?.success || !payload?.data) {
      throw new Error(payload?.error || 'No data returned');
    }

    const result = payload.data as FineDiningCityData;
    this.setCache(opts.cityId, result);
    return result;
  }

  clearCache(cityId?: string) {
    if (cityId) {
      localStorage.removeItem(this.cacheKey(cityId));
      return;
    }
    Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }
}

export default new FineDiningService();
