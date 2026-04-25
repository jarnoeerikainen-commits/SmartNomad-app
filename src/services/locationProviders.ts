import { LocationData } from '@/types/country';

/**
 * Robust multi-provider location resolution.
 * - IP location: tries ipwho.is → ipapi.co → bigdatacloud (fallback)
 * - Reverse geocode (lat/lon → city/country): tries bigdatacloud → open-meteo geocoding → nominatim
 * Each provider is wrapped with a timeout. First success wins.
 */

const TIMEOUT_MS = 3500;
const LOCATION_IP_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/location-ip`
  : '';

const englishRegionNames =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

function normalizeCountryName(country?: string, countryCode?: string): string {
  const normalizedCode = countryCode?.toUpperCase();
  if (normalizedCode && englishRegionNames) {
    const englishName = englishRegionNames.of(normalizedCode);
    if (englishName) return englishName;
  }
  return country || 'Unknown';
}

function normalizeCityName(city?: string): string {
  const normalized = city?.trim();
  if (!normalized) return 'Unknown';

  return normalized
    .replace(/\s+Municipality$/i, '')
    .replace(/\s+Urban Okrug$/i, '')
    .replace(/\s+Metropolitan Borough$/i, '')
    .trim() || 'Unknown';
}

async function firstSuccessfulLocation(
  providers: Array<() => Promise<LocationData | null>>
): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!providers.length) {
      resolve(null);
      return;
    }

    let pending = providers.length;
    let settled = false;

    const finishIfDone = () => {
      pending -= 1;
      if (!settled && pending <= 0) {
        resolve(null);
      }
    };

    providers.forEach((provider) => {
      provider()
        .then((result) => {
          if (!settled && result && result.country_code !== 'XX') {
            settled = true;
            resolve(result);
            return;
          }
          finishIfDone();
        })
        .catch(() => {
          finishIfDone();
        });
    });
  });
}

async function fetchWithTimeout(url: string, ms = TIMEOUT_MS): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
  } finally {
    clearTimeout(t);
  }
}

// ---------- IP-based location (reveals real ISP/VPN exit) ----------

async function ipFromIpwho(): Promise<LocationData | null> {
  try {
    const r = await fetchWithTimeout('https://ipwho.is/?fields=success,latitude,longitude,city,country,country_code');
    if (!r.ok) return null;
    const d = await r.json();
    if (!d?.success) return null;
    return {
      latitude: Number(d.latitude) || 0,
      longitude: Number(d.longitude) || 0,
      country: normalizeCountryName(d.country, d.country_code),
      country_code: d.country_code || 'XX',
      city: normalizeCityName(d.city),
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

async function ipFromIpapi(): Promise<LocationData | null> {
  try {
    const r = await fetchWithTimeout('https://ipapi.co/json/');
    if (!r.ok) return null;
    const d = await r.json();
    if (d?.error) return null;
    return {
      latitude: Number(d.latitude) || 0,
      longitude: Number(d.longitude) || 0,
      country: normalizeCountryName(d.country_name, d.country_code),
      country_code: d.country_code || 'XX',
      city: normalizeCityName(d.city),
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

async function ipFromBigDataCloud(): Promise<LocationData | null> {
  try {
    const r = await fetchWithTimeout('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en');
    if (!r.ok) return null;
    const d = await r.json();
    return {
      latitude: Number(d.latitude) || 0,
      longitude: Number(d.longitude) || 0,
      country: normalizeCountryName(d.countryName, d.countryCode),
      country_code: d.countryCode || 'XX',
      city: normalizeCityName(d.city || d.locality),
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

async function ipFromSupabaseFunction(): Promise<LocationData | null> {
  if (!LOCATION_IP_FUNCTION_URL) return null;

  try {
    const r = await fetchWithTimeout(LOCATION_IP_FUNCTION_URL);
    if (!r.ok) return null;
    const d = await r.json();
    if (!d?.country_code) return null;
    return {
      latitude: Number(d.latitude) || 0,
      longitude: Number(d.longitude) || 0,
      country: normalizeCountryName(d.country, d.country_code),
      country_code: d.country_code || 'XX',
      city: normalizeCityName(d.city),
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

export async function fetchIPLocation(): Promise<LocationData | null> {
  return firstSuccessfulLocation([ipFromIpwho, ipFromIpapi, ipFromBigDataCloud]);
}

// ---------- Reverse geocode (lat/lon → place) ----------

async function rgBigDataCloud(lat: number, lon: number): Promise<LocationData | null> {
  try {
    const r = await fetchWithTimeout(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (!r.ok) return null;
    const d = await r.json();
    if (!d?.countryCode) return null;
    return {
      latitude: lat,
      longitude: lon,
      country: normalizeCountryName(d.countryName, d.countryCode),
      country_code: d.countryCode || 'XX',
      city: normalizeCityName(d.city || d.locality),
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

async function rgNominatim(lat: number, lon: number): Promise<LocationData | null> {
  try {
    const r = await fetchWithTimeout(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1&accept-language=en`
    );
    if (!r.ok) return null;
    const d = await r.json();
    const a = d?.address || {};
    if (!a.country_code) return null;
    return {
      latitude: lat,
      longitude: lon,
      country: normalizeCountryName(a.country, a.country_code),
      country_code: (a.country_code || 'XX').toUpperCase(),
      city: normalizeCityName(
        a.city || a.town || a.village || a.hamlet || d?.name || a.city_district || a.suburb || a.municipality || a.county
      ),
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationData | null> {
  return (
    (await firstSuccessfulLocation([
      () => rgBigDataCloud(lat, lon),
      () => rgNominatim(lat, lon),
    ])) || {
      latitude: lat,
      longitude: lon,
      country: 'Unknown',
      country_code: 'XX',
      city: 'Unknown',
      timestamp: Date.now(),
    }
  );
}

// ---------- GPS (always fresh — no stale browser cache) ----------

export function getGPSPosition(opts?: { freshOnly?: boolean }): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: opts?.freshOnly ? 0 : 60000, // CRITICAL: 0 = no cache, defeats VPN-era stale fixes
      }
    );
  });
}

export async function getGPSLocation(opts?: { freshOnly?: boolean }): Promise<LocationData | null> {
  const pos = await getGPSPosition(opts);
  if (!pos) return null;
  return reverseGeocode(pos.coords.latitude, pos.coords.longitude);
}
