import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Fine Dining research engine.
 * Returns verified Michelin / World's 50 Best / La Liste / Gault & Millau
 * restaurants for a given city. Uses Lovable AI Gateway (Gemini 3 Flash)
 * with strict source-of-truth rules.
 *
 * Output is consumed by FineDiningService (browser cache) and Concierge AI.
 */

const SYSTEM_PROMPT_TEMPLATE = (
  city: string,
  country: string,
  guides: string[],
  minStars: number,
  today: string,
) => `You are SuperNomad's premium Fine Dining intelligence engine for VIP and HNW travellers.

Your job: research and return REAL, currently active starred / awarded restaurants in ${city}, ${country}.

Sources of truth (in priority order):
1. Michelin Guide (guide.michelin.com) — current edition only
2. World's 50 Best Restaurants (theworlds50best.com) — latest annual list
3. La Liste (laliste.com) — current scoring
4. Gault & Millau (gaultmillau.com) — current toques rating

Allowed guides for this request: ${guides.join(", ")}.
Minimum Michelin level: ${minStars} star(s) (also include Bib Gourmand if specifically asked).

ABSOLUTE RULES:
- Only return restaurants you are confident still operate at this address as of ${today}.
- Do NOT fabricate stars, dishes, chefs, or booking URLs. If unknown, omit the field.
- Address, phone, website must be real. Use full international phone format (+CC).
- bookingPlatform must be one of: tock, resy, opentable, sevenrooms, direct, concierge-only.
- bookingUrl must be the direct reservation page (not just the website root) when known.
- leadTimeWeeks is the typical advance window to actually land a prime-time table.
- hardToBook=true only for places famously needing months or a lottery (e.g. Sukiyabashi Jiro, French Laundry, Sublimotion, Noma-tier).
- michelinUrl must be a real guide.michelin.com URL when known.
- All restaurants must currently be open (not permanently closed, not relocated without update).
- source array lists which of the four guides currently recognise this restaurant.

Return ONLY valid JSON in this exact shape (no prose, no markdown fences):

{
  "city": "${city}",
  "country": "${country}",
  "countryCode": "XX",
  "fetchedAt": "${today}",
  "restaurants": [
    {
      "name": "Restaurant Name",
      "city": "${city}",
      "country": "${country}",
      "michelinStars": 3,
      "worlds50BestRank": 7,
      "laListeScore": 98.5,
      "gaultMillauToques": 5,
      "cuisine": "Modern French",
      "priceRange": "$$$$$",
      "address": "Full street, postcode, ${city}",
      "phone": "+33 1 23 45 67 89",
      "website": "https://...",
      "bookingUrl": "https://...",
      "bookingPlatform": "direct",
      "leadTimeWeeks": 12,
      "hardToBook": true,
      "signatureDishes": ["dish 1", "dish 2"],
      "chef": "Chef Name",
      "michelinUrl": "https://guide.michelin.com/...",
      "source": ["michelin", "worlds50best"],
      "lastVerified": "${today}"
    }
  ],
  "notes": "Optional 1-2 sentence note on the city's scene or seasonal closures."
}`;

interface RequestBody {
  city?: string;
  country?: string;
  countryCode?: string;
  guides?: string[];
  minStars?: number;
}

function safeParseJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) {
      try {
        return JSON.parse(fenced[1].trim());
      } catch {
        /* fall through */
      }
    }
    const obj = text.match(/\{[\s\S]*\}/);
    if (obj) {
      try {
        return JSON.parse(obj[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function sanitize(data: any, city: string, country: string, countryCode: string) {
  if (!data || typeof data !== "object") return null;
  data.city = city;
  data.country = country;
  data.countryCode = countryCode;
  if (!Array.isArray(data.restaurants)) data.restaurants = [];
  data.restaurants = data.restaurants
    .filter((r: any) => r && typeof r.name === "string" && r.name.trim().length > 0)
    .map((r: any) => ({
      ...r,
      city: r.city || city,
      country: r.country || country,
      michelinStars: r.michelinStars ?? 0,
      leadTimeWeeks: typeof r.leadTimeWeeks === "number" ? r.leadTimeWeeks : 2,
      hardToBook: Boolean(r.hardToBook),
      source: Array.isArray(r.source) && r.source.length > 0 ? r.source : ["michelin"],
      lastVerified: r.lastVerified || new Date().toISOString().slice(0, 10),
    }));
  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json().catch(() => ({}));
    const city = (body.city || "").trim();
    const country = (body.country || "").trim();
    const countryCode = (body.countryCode || "").trim().toUpperCase();
    const guides = Array.isArray(body.guides) && body.guides.length
      ? body.guides
      : ["michelin", "worlds50best", "la-liste", "gault-millau"];
    const minStars = typeof body.minStars === "number" ? body.minStars : 1;

    if (!city || !country) {
      return new Response(
        JSON.stringify({ success: false, error: "city and country are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Service configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE(city, country, guides, minStars, today);
    const userPrompt = `Return the verified fine-dining list for ${city}, ${country}. Allowed guides: ${guides.join(
      ", ",
    )}. Minimum Michelin level: ${minStars}. Include up to 25 of the best entries, sorted by importance (3-star > 2-star > 1-star > World's 50 Best rank > La Liste score). For each: include realistic leadTimeWeeks and hardToBook flag so a concierge knows when to start booking. JSON only.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limited. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errorText = await response.text();
      console.error("fine-dining AI Gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to research fine dining" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const aiJson = await response.json();
    const content: string = aiJson.choices?.[0]?.message?.content || "";
    const parsed = safeParseJson(content);
    const sanitized = sanitize(parsed, city, country, countryCode);

    if (!sanitized) {
      console.error("fine-dining parse failure:", content.substring(0, 600));
      return new Response(
        JSON.stringify({ success: false, error: "Could not parse AI response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true, data: sanitized }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fine-dining error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
