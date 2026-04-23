// ═══════════════════════════════════════════════════════════════════════════
// ElevenLabs streaming TTS — premium voice for SuperNomad Concierge
// ───────────────────────────────────────────────────────────────────────────
// • Streams MP3 chunks back to the browser for ultra-low first-audio latency
// • Auto-picks `eleven_flash_v2_5` for English (≈75–150 ms first chunk)
//   and `eleven_turbo_v2_5` for non-English (multilingual + fast)
// • Sanitizes input, surfaces 401/402/429 with actionable messages
// • Public function (verify_jwt = false) — abuse-bounded by ELEVENLABS quota
// ═══════════════════════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Curated voice IDs — premium, real-people, royalty-free
const VOICE_FEMALE_DEFAULT = "FGY2WhTYpPnrIDTdsKH5"; // Laura — warm
const VOICE_MALE_DEFAULT = "JBFqnCBsd6RMkjVDRZzb"; // George — authoritative

// Per-language voice overrides (warm female + deep male) — picked from the
// ElevenLabs library. All work with eleven_turbo_v2_5 + eleven_flash_v2_5.
const VOICE_BY_LANG: Record<string, { woman: string; man: string }> = {
  en: { woman: "FGY2WhTYpPnrIDTdsKH5", man: "JBFqnCBsd6RMkjVDRZzb" },
  es: { woman: "EXAVITQu4vr4xnSDxMaL", man: "onwK4e9ZLuTAKqWW03F9" },
  pt: { woman: "EXAVITQu4vr4xnSDxMaL", man: "onwK4e9ZLuTAKqWW03F9" },
  fr: { woman: "XrExE9yKIg1WjnnlVkGX", man: "JBFqnCBsd6RMkjVDRZzb" },
  de: { woman: "XrExE9yKIg1WjnnlVkGX", man: "JBFqnCBsd6RMkjVDRZzb" },
  it: { woman: "EXAVITQu4vr4xnSDxMaL", man: "onwK4e9ZLuTAKqWW03F9" },
  ja: { woman: "Xb7hH8MSUJpSbSDYk0k2", man: "TX3LPaxmHKxFdv7VOQHJ" },
  ko: { woman: "Xb7hH8MSUJpSbSDYk0k2", man: "TX3LPaxmHKxFdv7VOQHJ" },
  zh: { woman: "Xb7hH8MSUJpSbSDYk0k2", man: "TX3LPaxmHKxFdv7VOQHJ" },
  ar: { woman: "EXAVITQu4vr4xnSDxMaL", man: "onwK4e9ZLuTAKqWW03F9" },
  hi: { woman: "Xb7hH8MSUJpSbSDYk0k2", man: "TX3LPaxmHKxFdv7VOQHJ" },
  ru: { woman: "XrExE9yKIg1WjnnlVkGX", man: "JBFqnCBsd6RMkjVDRZzb" },
  tr: { woman: "EXAVITQu4vr4xnSDxMaL", man: "onwK4e9ZLuTAKqWW03F9" },
};

const sanitizeText = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const normalized = value
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Strip lone surrogates that crash the MP3 encoder
  let result = "";
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
    if (code >= 0xdc00 && code <= 0xdfff) continue;
    result += normalized[i];
  }
  return Array.from(result).slice(0, 5000).join("");
};

const pickVoice = (
  voiceId: string | undefined,
  gender: "woman" | "man" | undefined,
  lang: string | undefined,
): string => {
  if (voiceId) return voiceId;
  const langCode = (lang || "en").toLowerCase().split("-")[0];
  const map = VOICE_BY_LANG[langCode];
  const g = gender === "man" ? "man" : "woman";
  return map?.[g] || (g === "man" ? VOICE_MALE_DEFAULT : VOICE_FEMALE_DEFAULT);
};

const pickModel = (lang: string | undefined): string => {
  // Flash v2.5 is fastest (≈75–150ms first chunk) and supports multilingual.
  // Turbo v2.5 is the safer multilingual fallback.
  const langCode = (lang || "en").toLowerCase().split("-")[0];
  if (langCode === "en") return "eleven_flash_v2_5";
  return "eleven_turbo_v2_5";
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Voice service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const text = sanitizeText((body as any).text);
    const gender = (body as any).gender as "woman" | "man" | undefined;
    const lang = (body as any).lang as string | undefined;
    const voiceId = (body as any).voiceId as string | undefined;

    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const selectedVoice = pickVoice(voiceId, gender, lang);
    const selectedModel = pickModel(lang);

    const voiceSettings =
      gender === "man"
        ? { stability: 0.55, similarity_boost: 0.82, style: 0.35, use_speaker_boost: true, speed: 0.92 }
        : { stability: 0.5, similarity_boost: 0.78, style: 0.45, use_speaker_boost: true, speed: 1.0 };

    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}/stream?output_format=mp3_44100_128&optimize_streaming_latency=3`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: selectedModel,
          voice_settings: voiceSettings,
        }),
      },
    );

    if (!upstream.ok) {
      const errBody = await upstream.text();
      console.error(`[elevenlabs-tts] ${upstream.status}: ${errBody.slice(0, 300)}`);

      if (upstream.status === 401) {
        return new Response(
          JSON.stringify({ error: "ElevenLabs key invalid — please update ELEVENLABS_API_KEY." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (upstream.status === 402) {
        return new Response(
          JSON.stringify({ error: "ElevenLabs credits exhausted — top up the workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (upstream.status === 429) {
        return new Response(
          JSON.stringify({ error: "Voice rate-limited, retry shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "Voice service unavailable" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-store",
        "X-Voice-Model": selectedModel,
        "X-Voice-Id": selectedVoice,
      },
    });
  } catch (error) {
    console.error("[elevenlabs-tts] fatal", error);
    return new Response(JSON.stringify({ error: "Voice service unavailable" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
