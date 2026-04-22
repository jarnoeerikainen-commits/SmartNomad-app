// LiveAvatar session bootstrapper
// Pipeline:
//   1. List public avatars → pick the first warm-female default
//   2. Create a session token (FULL mode, WebRTC)
//   3. Start the session → returns livekit_url + livekit_client_token
//   4. Return everything the browser needs to join the LiveKit room
//
// Docs: https://docs.liveavatar.com/api-reference/sessions/create-session-token
//       https://docs.liveavatar.com/api-reference/sessions/start-session

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const API_BASE = 'https://api.liveavatar.com/v1';

// Hard-coded preferred avatar names (in priority order). We'll match against
// the public avatar list and fall back to the first available one.
const PREFERRED_NAMES = ['anna', 'sara', 'sofia', 'emma', 'maya'];

async function pickAvatar(apiKey: string): Promise<{ avatarId: string; voiceId?: string; name: string }> {
  const res = await fetch(`${API_BASE}/avatars/public?page=1&page_size=50`, {
    headers: { 'X-API-KEY': apiKey },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`list public avatars failed [${res.status}]: ${body}`);
  }

  const json = await res.json();

  // LiveAvatar returns { code, data: { count, results: [...] } }
  let avatars: Array<any> = [];
  if (Array.isArray(json?.data?.results)) avatars = json.data.results;
  else if (Array.isArray(json?.data?.avatars)) avatars = json.data.avatars;
  else if (Array.isArray(json?.data)) avatars = json.data;
  else if (Array.isArray(json?.results)) avatars = json.results;

  // Filter to ACTIVE, non-expired, has-id
  avatars = avatars.filter((a) => a?.id && a?.status === 'ACTIVE' && !a?.is_expired);

  if (avatars.length === 0) {
    throw new Error('no active public avatars returned');
  }

  // Prefer a warm female-sounding name
  let chosen: any = null;
  for (const wanted of PREFERRED_NAMES) {
    const match = avatars.find((a) => (a.name || '').toLowerCase().includes(wanted));
    if (match) {
      chosen = match;
      break;
    }
  }
  if (!chosen) chosen = avatars[0];

  return {
    avatarId: chosen.id,
    voiceId: chosen.default_voice?.id,
    name: chosen.name || 'Aurora',
  };
}

async function createSessionToken(
  apiKey: string,
  avatarId: string,
  voiceId?: string,
): Promise<string> {
  const persona: Record<string, unknown> = {
    language: 'en',
    voice_settings: {
      provider: 'elevenLabs',
      speed: 1.0,
      stability: 0.6,
      similarity_boost: 0.8,
      style: 0.3,
      use_speaker_boost: true,
      model: 'eleven_flash_v2_5',
    },
  };
  if (voiceId) persona.voice_id = voiceId;

  const res = await fetch(`${API_BASE}/sessions/token`, {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      avatar_id: avatarId,
      mode: 'FULL',
      is_sandbox: false,
      video_settings: { quality: 'high', encoding: 'H264' },
      max_session_duration: 180,
      interactivity_type: 'CONVERSATIONAL',
      avatar_persona: persona,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`create session token failed [${res.status}]: ${body}`);
  }

  const json = await res.json();
  const token = json?.data?.session_token;
  if (!token) throw new Error('no session_token in response');
  return token;
}

async function startSession(sessionToken: string) {
  const res = await fetch(`${API_BASE}/sessions/start`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${sessionToken}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`start session failed [${res.status}]: ${body}`);
  }

  const json = await res.json();
  const data = json?.data;
  if (!data?.livekit_url || !data?.livekit_client_token) {
    throw new Error('start session missing livekit credentials');
  }

  return {
    sessionId: data.session_id as string,
    livekitUrl: data.livekit_url as string,
    livekitToken: data.livekit_client_token as string,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('LIVEAVATAR_API_KEY');
    if (!apiKey) {
      console.error('[liveavatar-session] LIVEAVATAR_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[liveavatar-session] Picking avatar…');
    const { avatarId, voiceId, name } = await pickAvatar(apiKey);
    console.log(`[liveavatar-session] Avatar: ${name} (${avatarId}) voice=${voiceId ?? 'default'}`);

    console.log('[liveavatar-session] Creating session token…');
    const sessionToken = await createSessionToken(apiKey, avatarId, voiceId);

    console.log('[liveavatar-session] Starting session…');
    const session = await startSession(sessionToken);
    console.log(`[liveavatar-session] Session started: ${session.sessionId}`);

    return new Response(
      JSON.stringify({
        sessionId: session.sessionId,
        livekitUrl: session.livekitUrl,
        livekitToken: session.livekitToken,
        avatarId,
        avatarName: name,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('[liveavatar-session] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
