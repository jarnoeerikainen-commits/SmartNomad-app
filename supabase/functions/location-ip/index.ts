const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function getClientIP(req: Request): string | null {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    null
  );
}

function getCountryCode(req: Request): string | null {
  return req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country') || null;
}

function getCityHint(req: Request): string | null {
  const city = req.headers.get('x-vercel-ip-city');
  if (!city) return null;
  try {
    return decodeURIComponent(city);
  } catch {
    return city;
  }
}

function normalizeCountryName(country?: string, countryCode?: string): string {
  const code = countryCode?.toUpperCase();
  if (code && code !== 'XX') {
    try {
      const names = new Intl.DisplayNames(['en'], { type: 'region' });
      const english = names.of(code);
      if (english) return english;
    } catch {
      // Intl.DisplayNames can be unavailable in edge cold starts; fall back safely.
    }
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

async function fetchWithTimeout(url: string, timeoutMs = 2500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchIpApi(ip: string) {
  const response = await fetchWithTimeout(`https://ipapi.co/${ip}/json/`);
  if (!response.ok) throw new Error(`ipapi failed: ${response.status}`);
  const data = await response.json();
  if (data?.error) throw new Error('ipapi lookup error');

  return {
    latitude: Number(data.latitude) || 0,
    longitude: Number(data.longitude) || 0,
    country: normalizeCountryName(data.country_name, data.country_code),
    country_code: data.country_code || 'XX',
    city: normalizeCityName(data.city),
    timestamp: Date.now(),
  };
}

async function fetchIpWho(ip: string) {
  const response = await fetchWithTimeout(
    `https://ipwho.is/${ip}?fields=success,latitude,longitude,city,country,country_code`
  );
  if (!response.ok) throw new Error(`ipwho failed: ${response.status}`);
  const data = await response.json();
  if (!data?.success) throw new Error('ipwho lookup error');

  return {
    latitude: Number(data.latitude) || 0,
    longitude: Number(data.longitude) || 0,
    country: normalizeCountryName(data.country, data.country_code),
    country_code: data.country_code || 'XX',
    city: normalizeCityName(data.city),
    timestamp: Date.now(),
  };
}

async function resolveIpLocation(ip: string) {
  if (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  ) {
    return null;
  }

  const providers = [fetchIpWho, fetchIpApi];

  for (const provider of providers) {
    try {
      const result = await provider(ip);
      if (result.country_code && result.country_code !== 'XX') {
        return result;
      }
    } catch (error) {
      console.error('location-ip provider failed', error);
    }
  }

  return null;
}

function buildHeaderFallback(req: Request) {
  const countryCode = getCountryCode(req);
  if (!countryCode) return null;

  return {
    latitude: 0,
    longitude: 0,
    country: normalizeCountryName(undefined, countryCode),
    country_code: countryCode.toUpperCase(),
    city: normalizeCityName(getCityHint(req) || undefined),
    timestamp: Date.now(),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const ip = getClientIP(req);
    const location = ip ? await resolveIpLocation(ip) : null;

    if (!location) {
      const fallback = buildHeaderFallback(req);
      if (fallback) return json(fallback);
      return json({ error: 'client_ip_unavailable' }, 400);
    }

    return json(location);
  } catch (error) {
    console.error('location-ip failed', error);
    return json({ error: 'location_lookup_failed' }, 502);
  }
});