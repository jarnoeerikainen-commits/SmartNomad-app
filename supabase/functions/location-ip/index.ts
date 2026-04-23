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

function normalizeCountryName(country?: string, countryCode?: string): string {
  const code = countryCode?.toUpperCase();
  try {
    if (code) {
      const names = new Intl.DisplayNames(['en'], { type: 'region' });
      const english = names.of(code);
      if (english) return english;
    }
  } catch {
    // ignore
  }
  return country || 'Unknown';
}

async function fetchIpApi(ip: string) {
  const response = await fetch(`https://ipapi.co/${ip}/json/`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`ipapi failed: ${response.status}`);
  const data = await response.json();
  if (data?.error) throw new Error('ipapi lookup error');

  return {
    latitude: Number(data.latitude) || 0,
    longitude: Number(data.longitude) || 0,
    country: normalizeCountryName(data.country_name, data.country_code),
    country_code: data.country_code || 'XX',
    city: data.city || 'Unknown',
    timestamp: Date.now(),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const ip = getClientIP(req);
    if (!ip) return json({ error: 'client_ip_unavailable' }, 400);

    const location = await fetchIpApi(ip);
    return json(location);
  } catch (error) {
    console.error('location-ip failed', error);
    return json({ error: 'location_lookup_failed' }, 502);
  }
});