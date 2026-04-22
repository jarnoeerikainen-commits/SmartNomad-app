import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", pt: "Portuguese", zh: "Chinese (Simplified)",
  fr: "French", de: "German", ar: "Arabic", ja: "Japanese",
  it: "Italian", ko: "Korean", hi: "Hindi", ru: "Russian", tr: "Turkish",
};

const VALID = new Set(Object.keys(LANG_NAMES));

async function hashKey(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { texts, target } = await req.json();
    if (!Array.isArray(texts) || !VALID.has(target)) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (target === "en") {
      const out: Record<string, string> = {};
      for (const t of texts) out[t] = t;
      return new Response(JSON.stringify({ translations: out, cached: texts.length, ai: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const out: Record<string, string> = {};
    const need: string[] = [];
    let cachedCount = 0;

    for (const text of texts) {
      const cacheKey = `tr:${target}:${await hashKey(text)}`;
      const { data } = await supabase
        .from("ai_cache")
        .select("response_text")
        .eq("cache_key", cacheKey)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();
      if (data?.response_text) {
        out[text] = data.response_text;
        cachedCount++;
      } else {
        need.push(text);
      }
    }

    let aiCount = 0;
    if (need.length > 0) {
      const apiKey = Deno.env.get("LOVABLE_API_KEY");
      if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

      const langName = LANG_NAMES[target];
      const numbered = need.map((t, i) => `${i + 1}. ${t}`).join("\n");

      const systemPrompt = `You are a professional UI translator for SuperNomad, a premium global living app for nomads.
Translate the numbered English UI strings to ${langName}.
Rules:
- Preserve placeholders like {name}, {count}, %s, {0} EXACTLY.
- Brand names ("SuperNomad", "Snomad") and proper nouns: keep untranslated.
- Match tone: premium, clear, concise, modern.
- Use natural everyday phrasing a native speaker would use.
- Return via the tool call only.`;

      const tool = {
        type: "function",
        function: {
          name: "submit_translations",
          description: `Submit ${langName} translations`,
          parameters: {
            type: "object",
            properties: {
              translations: {
                type: "array",
                description: "Translations in same order as input (1-indexed)",
                items: { type: "string" },
              },
            },
            required: ["translations"],
            additionalProperties: false,
          },
        },
      };

      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Translate to ${langName}:\n\n${numbered}` },
          ],
          tools: [tool],
          tool_choice: { type: "function", function: { name: "submit_translations" } },
        }),
      });

      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "rate_limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "credits_exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!resp.ok) {
        const txt = await resp.text();
        console.error("Gateway error:", resp.status, txt);
        for (const t of need) out[t] = t;
      } else {
        const data = await resp.json();
        const call = data.choices?.[0]?.message?.tool_calls?.[0];
        if (call) {
          const parsed = JSON.parse(call.function.arguments);
          const arr: string[] = parsed.translations || [];
          for (let i = 0; i < need.length; i++) {
            const translated = arr[i] || need[i];
            out[need[i]] = translated;
            aiCount++;
            const cacheKey = `tr:${target}:${await hashKey(need[i])}`;
            await supabase.from("ai_cache").upsert({
              cache_key: cacheKey,
              query_text: need[i].slice(0, 1000),
              response_text: translated,
              model: "google/gemini-2.5-flash",
              expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
              metadata: { kind: "ui_translation", target },
            }, { onConflict: "cache_key" });
          }
        } else {
          for (const t of need) out[t] = t;
        }
      }
    }

    return new Response(JSON.stringify({ translations: out, cached: cachedCount, ai: aiCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate-ui error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
