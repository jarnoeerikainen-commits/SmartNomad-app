// Weekly trend refresher — pulls fresh sports slang, youth slang (multi-lang),
// global trends, and lifestyle habits using the Lovable AI gateway with web-grounded reasoning.
// Stores result in ai_cache under key `trend_pack:v1:weekly` for 7 days.
//
// Triggered by pg_cron weekly, but also callable manually (admin only).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TREND_CACHE_KEY = "trend_pack:v1:weekly";

const TREND_TOOL = {
  type: "function",
  function: {
    name: "emit_trend_pack",
    description: "Return the consolidated weekly trend pack.",
    parameters: {
      type: "object",
      properties: {
        sportsVocab: {
          type: "array",
          description: "One entry per sport with 5–8 currently-used technical/slang terms.",
          items: {
            type: "object",
            properties: {
              sport: { type: "string", description: "Lowercase sport name in English." },
              terms: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 10 },
            },
            required: ["sport", "terms"],
          },
        },
        youthSlang: {
          type: "array",
          description: "One entry per language code with 8–15 currently-trending youth slang terms.",
          items: {
            type: "object",
            properties: {
              language: { type: "string", description: "ISO 639-1 code (en, es, fr, de, it, pt, ja, ko, zh, ar, hi, ru, tr)." },
              terms: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 20 },
            },
            required: ["language", "terms"],
          },
        },
        globalTrends: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 10 },
        lifestyleHabits: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 8 },
        cautions: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6 },
        sources: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 8 },
      },
      required: ["sportsVocab", "youthSlang", "globalTrends", "lifestyleHabits", "cautions", "sources"],
    },
  },
};

const SPORTS = [
  "football", "basketball", "tennis", "golf", "f1", "cycling", "running", "surfing",
  "skiing", "snowboarding", "padel", "pickleball", "crossfit", "yoga", "pilates",
  "esports", "boxing", "mma", "bjj", "chess", "sailing", "triathlon", "swimming",
  "climbing", "rugby", "cricket", "baseball", "ice hockey", "field hockey", "volleyball",
  "table tennis", "badminton", "squash", "rowing", "kayaking", "skateboarding", "bmx",
  "motogp", "rally", "equestrian", "polo", "fencing", "archery", "shooting", "darts",
  "snooker", "bowling", "ultramarathon", "trail running", "open water swimming",
  "kitesurfing", "windsurfing", "wakeboarding", "scuba diving", "freediving", "spearfishing",
  "paragliding", "skydiving", "base jumping", "mountaineering", "ice climbing",
  "ski touring", "freestyle ski", "freestyle snowboard", "nordic skiing", "biathlon",
  "speed skating", "figure skating", "curling", "lacrosse", "handball", "water polo",
  "synchronized swimming", "diving", "weightlifting", "powerlifting", "strongman",
  "olympic gymnastics", "rhythmic gymnastics", "calisthenics", "dance sport", "cheerleading",
  "muay thai", "karate", "taekwondo", "judo", "wrestling", "kickboxing", "kendo",
  "rugby sevens", "afl", "gaelic football", "hurling", "futsal", "beach volleyball",
  "beach soccer", "ultimate frisbee", "disc golf", "fishing tournaments", "horse racing",
  "greyhound racing", "drone racing", "sim racing",
];

const LANGUAGES = ["en", "es", "pt", "fr", "de", "it", "ja", "ko", "zh", "ar", "hi", "ru", "tr"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SERVICE_ROLE) {
      return new Response(JSON.stringify({ error: "Service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Skip if a fresh pack already exists (idempotent) unless ?force=1
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "1";
    if (!force) {
      const { data: existing } = await supabase
        .from("ai_cache")
        .select("expires_at")
        .eq("cache_key", TREND_CACHE_KEY)
        .gt("expires_at", new Date(Date.now() + 24 * 3600 * 1000).toISOString())
        .maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ ok: true, skipped: "fresh-cache" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const userPrompt = `You are SuperNomad's cultural intelligence analyst. Produce the weekly trend pack.

Cover the TOP 100 sports globally. Here are 100 to anchor on (use the lowercase keys exactly):
${SPORTS.join(", ")}

For each sport, return 5–8 CURRENT (last ~12 months) technical or community-used slang/jargon terms that elite athletes, coaches, fans or commentators actually use in 2026. Prefer terms verifiable in mainstream sports media (ESPN, BBC Sport, L'Équipe, Marca, Gazzetta, AS, official league sites, Strava community, Reddit pro-sport subs, MotoGP/F1 broadcasts).

For YOUTH SLANG, cover these languages: ${LANGUAGES.join(", ")}. 8–15 currently-trending words per language. Source: TikTok, mainstream youth media, dictionary "word of the year" lists.

For GLOBAL TRENDS: 4–10 broad cultural/lifestyle shifts (premium-traveler relevant: longevity, quiet luxury, AI productivity, sober-curious, etc.).

For LIFESTYLE HABITS: 4–8 habits trending among health-conscious adults.

For CAUTIONS: list 2–6 categories of slang to RECOGNIZE but never deploy first (ethnic-coded, religious, drug/gambling/tobacco, generational mockery).

For SOURCES: list 4–8 source names/domains you'd verify against (BBC Sport, ESPN, Vogue Business, Monocle, GQ, Strava, etc.).

Rules:
- Only include terms you are confident are real and current.
- If a sport is unfamiliar, return a small high-confidence list rather than invent.
- Output ONLY via the emit_trend_pack tool.`;

    const startedAt = Date.now();
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: "You are a meticulous cultural & sports intelligence analyst. Verified facts only. Premium tone." },
          { role: "user", content: userPrompt },
        ],
        tools: [TREND_TOOL],
        tool_choice: { type: "function", function: { name: "emit_trend_pack" } },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("trend-refresh AI error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error", status: aiResp.status }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResp.json();
    const toolCall = aiData?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "AI did not return tool call" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(toolCall.function.arguments);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid tool args" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convert array-of-pairs into the object shapes consumed by trendPack.ts
    const sportsVocab: Record<string, string[]> = {};
    for (const item of (payload.sportsVocab as Array<{ sport: string; terms: string[] }>) ?? []) {
      if (item?.sport && Array.isArray(item.terms)) sportsVocab[item.sport.toLowerCase()] = item.terms.slice(0, 10);
    }
    const youthSlang: Record<string, string[]> = {};
    for (const item of (payload.youthSlang as Array<{ language: string; terms: string[] }>) ?? []) {
      if (item?.language && Array.isArray(item.terms)) youthSlang[item.language.toLowerCase()] = item.terms.slice(0, 20);
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
    const pack = {
      generatedAt: now.toISOString().slice(0, 10),
      expiresAt: expiresAt.toISOString(),
      sourceModel: "google/gemini-2.5-pro",
      sources: payload.sources ?? [],
      sportsVocab,
      youthSlang,
      globalTrends: payload.globalTrends ?? [],
      lifestyleHabits: payload.lifestyleHabits ?? [],
      cautions: payload.cautions ?? [],
    };

    // Upsert into ai_cache
    await supabase
      .from("ai_cache")
      .delete()
      .eq("cache_key", TREND_CACHE_KEY);

    const { error: insertErr } = await supabase.from("ai_cache").insert({
      cache_key: TREND_CACHE_KEY,
      query_text: "weekly_trend_refresh",
      response_text: JSON.stringify(pack),
      model: "google/gemini-2.5-pro",
      expires_at: expiresAt.toISOString(),
      metadata: { kind: "trend_pack", sports_count: Object.keys(sportsVocab).length, languages: Object.keys(youthSlang).length },
    });

    if (insertErr) {
      console.error("trend-refresh insert error", insertErr);
      return new Response(JSON.stringify({ error: "Failed to persist pack" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        sports: Object.keys(pack.sportsVocab).length,
        languages: Object.keys(pack.youthSlang).length,
        latencyMs: Date.now() - startedAt,
        expiresAt: pack.expiresAt,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("trend-refresh error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
