import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const sanitizeText = (value: unknown) => {
  if (typeof value !== 'string') return '';

  const normalized = value
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let result = '';
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i);

    if (code >= 0xd800 && code <= 0xdbff) {
      const next = normalized.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        result += normalized[i] + normalized[i + 1];
        i++;
      }
      continue;
    }

    if (code >= 0xdc00 && code <= 0xdfff) {
      continue;
    }

    result += normalized[i];
  }

  return Array.from(result).slice(0, 5000).join('');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    const { text, voiceId, gender } = await req.json();
    const cleanText = sanitizeText(text);

    if (!cleanText) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Voice selection: deep charming male vs warm female
    // George = deep authoritative male, Laura = warm natural female
    const selectedVoice = voiceId || (gender === 'man' ? 'JBFqnCBsd6RMkjVDRZzb' : 'FGY2WhTYpPnrIDTdsKH5');

    // Voice settings tuned per gender
    const voiceSettings = gender === 'man'
      ? { stability: 0.6, similarity_boost: 0.82, style: 0.38, use_speaker_boost: true, speed: 0.88 }
      : { stability: 0.52, similarity_boost: 0.78, style: 0.5, use_speaker_boost: true, speed: 0.98 };

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}/stream?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_turbo_v2_5",
          voice_settings: voiceSettings,
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`ElevenLabs API error [${response.status}]: ${errBody}`);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
