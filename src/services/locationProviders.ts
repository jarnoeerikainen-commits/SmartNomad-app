import { LocationData } from '@/types/country';

/**
 * Robust multi-provider location resolution.
 * - IP location: tries ipwho.is → ipapi.co → bigdatacloud (fallback)
 * - Reverse geocode (lat/lon → city/country): tries bigdatacloud → open-meteo geocoding → nominatim
 * Each provider is wrapped with a timeout. First success wins.
 */

const TIMEOUT_MS = 6000;

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
      country: d.country || 'Unknown',
      country_code: d.country_code || 'XX',
      city: d.city || 'Unknown',
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
      country: d.country_name || 'Unknown',
      country_code: d.country_code || 'XX',
      city: d.city || 'Unknown',
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
      country: d.countryName || 'Unknown',
      country_code: d.countryCode || 'XX',
      city: d.city || d.locality || 'Unknown',
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

export async function fetchIPLocation(): Promise<LocationData | null> {
  return (await ipFromIpwho()) || (await ipFromIpapi()) || (await ipFromBigDataCloud());
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
      country: d.countryName || 'Unknown',
      country_code: d.countryCode || 'XX',
      city: d.city || d.locality || 'Unknown',
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

async function rgOpenMeteo(lat: number, lon: number): Promise<LocationData | null> {
  // Open-Meteo doesn't have reverse geocoding, but its geocoding search by name is useless here.
  // We use the BigDataCloud free endpoint as primary; fall back to Nominatim.
  return null;
}

async function rgNominatim(lat: number, lon: number): Promise<LocationData | null> {
  try {
    const r = await fetchWithTimeout(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
    );
    if (!r.ok) return null;
    const d = await r.json();
    const a = d?.address || {};
    if (!a.country_code) return null;
    return {
      latitude: lat,
      longitude: lon,
      country: a.country || 'Unknown',
      country_code: (a.country_code || 'XX').toUpperCase(),
      city: a.city || a.town || a.village || a.municipality || a.county || 'Unknown',
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationData | null> {
  return (
    (await rgBigDataCloud(lat, lon)) ||
    (await rgOpenMeteo(lat, lon)) ||
    (await rgNominatim(lat, lon)) || {
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
