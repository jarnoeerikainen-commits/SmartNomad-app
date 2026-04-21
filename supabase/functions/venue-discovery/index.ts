// ═══════════════════════════════════════════════════════════════
// Weekly Curated Venue Discovery — silent background crawler
// ───────────────────────────────────────────────────────────────
// Runs once per week via pg_cron. Uses Lovable AI (Gemini) with
// web grounding to discover premium venues globally. Strict review
// thresholds. Inserts ONLY into `curated_venues` — no UI surface.
// The AI Concierge reads this table silently when recommending.
// ═══════════════════════════════════════════════════════════════
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ── Quality thresholds (strict — luxury Sovereign brand) ──
const THRESHOLDS: Record<string, { minRating: number; minReviews: number }> = {
  hotel: { minRating: 4.0, minReviews: 200 },
  boutique_hotel: { minRating: 4.5, minReviews: 100 },
  villa: { minRating: 4.6, minReviews: 50 },
  restaurant: { minRating: 4.5, minReviews: 150 },
  spa: { minRating: 4.5, minReviews: 80 },
  public_sauna: { minRating: 4.4, minReviews: 50 },
  swimming_pool: { minRating: 4.3, minReviews: 50 },
  cafeteria: { minRating: 4.4, minReviews: 100 },
  bakery: { minRating: 4.5, minReviews: 80 },
  pastry_shop: { minRating: 4.5, minReviews: 80 },
};

// ── Curated nomad/luxury hubs (rotating subset each week) ──
const HUB_CITIES = [
  { city: "Lisbon", country: "Portugal", cc: "PT" },
  { city: "Barcelona", country: "Spain", cc: "ES" },
  { city: "Madrid", country: "Spain", cc: "ES" },
  { city: "Paris", country: "France", cc: "FR" },
  { city: "Nice", country: "France", cc: "FR" },
  { city: "Monaco", country: "Monaco", cc: "MC" },
  { city: "Milan", country: "Italy", cc: "IT" },
  { city: "Rome", country: "Italy", cc: "IT" },
  { city: "Florence", country: "Italy", cc: "IT" },
  { city: "Zurich", country: "Switzerland", cc: "CH" },
  { city: "Geneva", country: "Switzerland", cc: "CH" },
  { city: "Vienna", country: "Austria", cc: "AT" },
  { city: "Berlin", country: "Germany", cc: "DE" },
  { city: "Munich", country: "Germany", cc: "DE" },
  { city: "Amsterdam", country: "Netherlands", cc: "NL" },
  { city: "Copenhagen", country: "Denmark", cc: "DK" },
  { city: "Stockholm", country: "Sweden", cc: "SE" },
  { city: "Helsinki", country: "Finland", cc: "FI" },
  { city: "Reykjavik", country: "Iceland", cc: "IS" },
  { city: "London", country: "United Kingdom", cc: "GB" },
  { city: "Edinburgh", country: "United Kingdom", cc: "GB" },
  { city: "Dublin", country: "Ireland", cc: "IE" },
  { city: "Athens", country: "Greece", cc: "GR" },
  { city: "Istanbul", country: "Turkey", cc: "TR" },
  { city: "Dubai", country: "UAE", cc: "AE" },
  { city: "Abu Dhabi", country: "UAE", cc: "AE" },
  { city: "Doha", country: "Qatar", cc: "QA" },
  { city: "Tel Aviv", country: "Israel", cc: "IL" },
  { city: "Marrakech", country: "Morocco", cc: "MA" },
  { city: "Cape Town", country: "South Africa", cc: "ZA" },
  { city: "New York", country: "USA", cc: "US" },
  { city: "Miami", country: "USA", cc: "US" },
  { city: "Los Angeles", country: "USA", cc: "US" },
  { city: "San Francisco", country: "USA", cc: "US" },
  { city: "Aspen", country: "USA", cc: "US" },
  { city: "Toronto", country: "Canada", cc: "CA" },
  { city: "Vancouver", country: "Canada", cc: "CA" },
  { city: "Mexico City", country: "Mexico", cc: "MX" },
  { city: "Tulum", country: "Mexico", cc: "MX" },
  { city: "Buenos Aires", country: "Argentina", cc: "AR" },
  { city: "Rio de Janeiro", country: "Brazil", cc: "BR" },
  { city: "São Paulo", country: "Brazil", cc: "BR" },
  { city: "Tokyo", country: "Japan", cc: "JP" },
  { city: "Kyoto", country: "Japan", cc: "JP" },
  { city: "Seoul", country: "South Korea", cc: "KR" },
  { city: "Singapore", country: "Singapore", cc: "SG" },
  { city: "Hong Kong", country: "Hong Kong", cc: "HK" },
  { city: "Bangkok", country: "Thailand", cc: "TH" },
  { city: "Bali", country: "Indonesia", cc: "ID" },
  { city: "Sydney", country: "Australia", cc: "AU" },
];

// Categories searched each week (one prompt per city × category)
const CATEGORIES = [
  "hotel",
  "boutique_hotel",
  "villa",
  "restaurant",
  "spa",
  "public_sauna",
  "swimming_pool",
  "cafeteria",
  "bakery",
  "pastry_shop",
];

interface VenueCandidate {
  name: string;
  category: string;
  neighborhood?: string;
  address?: string;
  price_band?: "$" | "$$" | "$$$" | "$$$$" | "$$$$$";
  star_rating?: number;
  review_score: number;
  review_count: number;
  why_recommended: string;
  signature_offering?: string;
  source_urls: string[];
  tags?: string[];
}

const VENUE_TOOL = {
  type: "function",
  function: {
    name: "submit_venues",
    description: "Submit verified premium venues with strict review evidence",
    parameters: {
      type: "object",
      properties: {
        venues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              category: { type: "string", enum: CATEGORIES },
              neighborhood: { type: "string" },
              address: { type: "string" },
              price_band: { type: "string", enum: ["$", "$$", "$$$", "$$$$", "$$$$$"] },
              star_rating: { type: "number", minimum: 1, maximum: 5 },
              review_score: { type: "number", minimum: 1, maximum: 5 },
              review_count: { type: "integer", minimum: 0 },
              why_recommended: { type: "string" },
              signature_offering: { type: "string" },
              source_urls: { type: "array", items: { type: "string" } },
              tags: { type: "array", items: { type: "string" } },
            },
            required: ["name", "category", "review_score", "review_count", "why_recommended", "source_urls"],
          },
        },
      },
      required: ["venues"],
    },
  },
};

function buildPrompt(city: string, country: string, category: string): string {
  const labelMap: Record<string, string> = {
    hotel: "luxury hotels (4★+ category)",
    boutique_hotel: "boutique design hotels with exceptional reviews",
    villa: "premium villa rentals with ≥4.6★",
    restaurant: "fine dining restaurants with ≥4.5★ on Google/TripAdvisor or Michelin recognition",
    spa: "luxury day spas with ≥4.5★",
    public_sauna: "well-reviewed public saunas / banyas / hammams",
    swimming_pool: "premium public swimming pools / lidos / thermal baths",
    cafeteria: "specialty coffee shops / cafés with ≥4.4★ and ≥100 reviews",
    bakery: "artisan bakeries with ≥4.5★",
    pastry_shop: "patisseries / pastry shops with ≥4.5★",
  };

  const t = THRESHOLDS[category];
  return `You are a meticulous luxury concierge researcher. Find currently-operating ${labelMap[category]} in **${city}, ${country}** that have:
- A verified rating of at least ${t.minRating}★ on Google Maps, TripAdvisor, Booking.com, or Michelin
- At least ${t.minReviews} reviews
- Consistent positive recent reviews (last 12 months)

Return between 3 and 8 venues that genuinely meet these standards. Do NOT invent venues, ratings, or review counts. Only include places you can verify from public sources. Provide source URLs (official site, Google Maps, TripAdvisor, Michelin guide, etc.).

For each venue include: name, neighborhood, price band ($-$$$$$), star/review score, review count, a 1-2 sentence reason why it's worth recommending, signature offering, and 1-3 source URLs.

If you cannot find enough qualifying venues that meet the strict bar, return fewer entries — never lower the bar.`;
}

async function discoverVenuesFor(
  city: string,
  country: string,
  cc: string,
  category: string
): Promise<VenueCandidate[]> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a verification-first research agent. Never fabricate ratings, review counts, or venue names. If unsure, omit the entry.",
        },
        { role: "user", content: buildPrompt(city, country, category) },
      ],
      tools: [VENUE_TOOL],
      tool_choice: { type: "function", function: { name: "submit_venues" } },
    }),
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Gemini ${response.status}: ${txt.slice(0, 200)}`);
  }

  const data = await response.json();
  const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall?.function?.arguments) return [];

  try {
    const parsed = JSON.parse(toolCall.function.arguments);
    return Array.isArray(parsed.venues) ? parsed.venues : [];
  } catch {
    return [];
  }
}

function passesQualityBar(v: VenueCandidate): boolean {
  const t = THRESHOLDS[v.category];
  if (!t) return false;
  if (typeof v.review_score !== "number" || typeof v.review_count !== "number") return false;
  if (v.review_score < t.minRating) return false;
  if (v.review_count < t.minReviews) return false;
  if (!v.name || v.name.length < 2) return false;
  if (!v.why_recommended || v.why_recommended.length < 10) return false;
  if (!Array.isArray(v.source_urls) || v.source_urls.length === 0) return false;
  return true;
}

function calcQualityScore(v: VenueCandidate): number {
  // 0-100. Rewards rating + review volume + source diversity.
  const ratingScore = ((v.review_score - 3.5) / 1.5) * 50; // up to 50
  const volumeScore = Math.min(30, Math.log10(v.review_count + 1) * 10); // up to 30
  const sourceScore = Math.min(20, (v.source_urls?.length || 0) * 7); // up to 20
  return Math.max(0, Math.min(100, Math.round(ratingScore + volumeScore + sourceScore)));
}

// Pick weekly slice — rotate through all hubs over ~5 weeks
function pickWeekSlice<T>(items: T[], slicesPerWeek: number): T[] {
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const totalSlices = Math.ceil(items.length / slicesPerWeek);
  const idx = week % totalSlices;
  return items.slice(idx * slicesPerWeek, idx * slicesPerWeek + slicesPerWeek);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const startedAt = Date.now();
  const errors: Array<{ city: string; category: string; error: string }> = [];
  let added = 0;
  let updated = 0;
  let evaluated = 0;

  // Create run record
  const { data: run } = await supabase
    .from("venue_discovery_runs")
    .insert({ trigger_source: req.headers.get("x-trigger") || "manual", status: "running" })
    .select()
    .single();

  // Allow `?cities=X&categories=Y` overrides for testing
  const url = new URL(req.url);
  const limitParam = parseInt(url.searchParams.get("limit") || "10");
  const dryRun = url.searchParams.get("dry") === "1";

  const weekCities = pickWeekSlice(HUB_CITIES, Math.max(1, Math.min(limitParam, HUB_CITIES.length)));

  for (const hub of weekCities) {
    for (const category of CATEGORIES) {
      try {
        const candidates = await discoverVenuesFor(hub.city, hub.country, hub.cc, category);
        evaluated += candidates.length;

        for (const c of candidates) {
          if (!passesQualityBar(c)) continue;
          if (dryRun) continue;

          const quality_score = calcQualityScore(c);
          const { error } = await supabase
            .from("curated_venues")
            .upsert(
              {
                category: c.category,
                name: c.name,
                city: hub.city,
                country: hub.country,
                country_code: hub.cc,
                neighborhood: c.neighborhood,
                address: c.address,
                price_band: c.price_band,
                star_rating: c.star_rating,
                review_score: c.review_score,
                review_count: c.review_count,
                quality_score,
                why_recommended: c.why_recommended,
                signature_offering: c.signature_offering,
                source_urls: c.source_urls,
                tags: c.tags || [],
                last_verified_at: new Date().toISOString(),
                status: "active",
              },
              { onConflict: "name,city,category", ignoreDuplicates: false }
            );

          if (error) {
            errors.push({ city: hub.city, category, error: error.message });
          } else {
            added += 1;
          }
        }
        // Gentle pacing to avoid AI gateway rate limits
        await new Promise((r) => setTimeout(r, 600));
      } catch (e) {
        errors.push({
          city: hub.city,
          category,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }
  }

  const duration = Date.now() - startedAt;
  if (run?.id) {
    await supabase
      .from("venue_discovery_runs")
      .update({
        status: errors.length === 0 ? "completed" : "partial",
        finished_at: new Date().toISOString(),
        cities_processed: weekCities.length,
        candidates_evaluated: evaluated,
        venues_added: added,
        venues_updated: updated,
        errors: errors.slice(0, 50),
        duration_ms: duration,
      })
      .eq("id", run.id);
  }

  return new Response(
    JSON.stringify({
      ok: true,
      cities: weekCities.length,
      candidates_evaluated: evaluated,
      added,
      errors: errors.length,
      duration_ms: duration,
      dry_run: dryRun,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
