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

async function pickAvatarId(apiKey: string): Promise<string> {
  const res = await fetch(`${API_BASE}/avatars/public?limit=50`, {
    headers: { 'X-API-KEY': apiKey },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`list public avatars failed [${res.status}]: ${body}`);
  }

  const json = await res.json();
  console.log('[liveavatar-session] public avatars raw:', JSON.stringify(json).slice(0, 800));

  // Try multiple shapes
  let avatars: Array<any> = [];
  if (Array.isArray(json?.data)) avatars = json.data;
  else if (Array.isArray(json?.data?.avatars)) avatars = json.data.avatars;
  else if (Array.isArray(json?.data?.items)) avatars = json.data.items;
  else if (Array.isArray(json?.avatars)) avatars = json.avatars;
  else if (Array.isArray(json?.items)) avatars = json.items;
  else if (Array.isArray(json)) avatars = json;

  if (!Array.isArray(avatars) || avatars.length === 0) {
    throw new Error('no public avatars returned');
  }

  // Prefer a warm female-sounding name
  for (const wanted of PREFERRED_NAMES) {
    const match = avatars.find((a) => (a.name || '').toLowerCase().includes(wanted));
    if (match) {
      const id = match.id || match.avatar_id;
      if (id) return id;
    }
  }

  // Fallback: first one with an id
  const first = avatars.find((a) => a.id || a.avatar_id);
  const id = first?.id || first?.avatar_id;
  if (!id) throw new Error('no usable avatar id in list');
  return id;
}

async function createSessionToken(apiKey: string, avatarId: string): Promise<string> {
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
      max_session_duration: 180, // 3 minutes is plenty for a 35s monologue
      interactivity_type: 'CONVERSATIONAL',
      avatar_persona: {
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
      },
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
    const avatarId = await pickAvatarId(apiKey);
    console.log(`[liveavatar-session] Avatar: ${avatarId}`);

    console.log('[liveavatar-session] Creating session token…');
    const sessionToken = await createSessionToken(apiKey, avatarId);

    console.log('[liveavatar-session] Starting session…');
    const session = await startSession(sessionToken);
    console.log(`[liveavatar-session] Session started: ${session.sessionId}`);

    return new Response(
      JSON.stringify({
        sessionId: session.sessionId,
        livekitUrl: session.livekitUrl,
        livekitToken: session.livekitToken,
        avatarId,
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
