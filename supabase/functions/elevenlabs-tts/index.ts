import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Truncate to 5000 chars
    const cleanText = text.slice(0, 5000);

    // Voice selection: deep charming male vs warm female
    // George = deep authoritative male, Laura = warm natural female
    const selectedVoice = voiceId || (gender === 'man' ? 'JBFqnCBsd6RMkjVDRZzb' : 'FGY2WhTYpPnrIDTdsKH5');

    // Voice settings tuned per gender
    const voiceSettings = gender === 'man'
      ? { stability: 0.55, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true, speed: 0.9 }
      : { stability: 0.5, similarity_boost: 0.75, style: 0.5, use_speaker_boost: true, speed: 1.0 };

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

    // Stream the audio back
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
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
