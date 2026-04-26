// ═══════════════════════════════════════════════════════════════
// Silent venue context for the AI Concierge
// ───────────────────────────────────────────────────────────────
// Reads the curated_venues table and returns a hidden system-prompt
// section. The user never sees this list — the concierge only mentions
// venues organically when they fit the conversation.
// ═══════════════════════════════════════════════════════════════
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

let _client: ReturnType<typeof createClient> | null = null;
function client() {
  if (!_client) _client = createClient(SUPABASE_URL, SERVICE_KEY);
  return _client;
}

interface VenueRow {
  category: string;
  name: string;
  neighborhood: string | null;
  price_band: string | null;
  review_score: number;
  review_count: number;
  source_urls: string[] | null;
  why_recommended: string | null;
  signature_offering: string | null;
}

// In-memory cache: city → { venues, expires }
const cache = new Map<string, { rows: VenueRow[]; expires: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 min

export async function getCuratedVenuesForCity(city: string | undefined): Promise<VenueRow[]> {
  if (!city) return [];
  const key = city.toLowerCase().trim();
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.rows;

  const { data, error } = await client()
    .from("curated_venues")
    .select("category,name,neighborhood,price_band,review_score,review_count,source_urls,why_recommended,signature_offering")
    .ilike("city", city)
    .eq("status", "active")
    .order("quality_score", { ascending: false })
    .limit(40);

  if (error) {
    console.warn("curated_venues lookup failed:", error.message);
    return [];
  }
  const rows = (data || []) as VenueRow[];
  cache.set(key, { rows, expires: Date.now() + CACHE_TTL });
  return rows;
}

export function renderVenuesForPrompt(rows: VenueRow[], city?: string): string {
  if (!rows.length) return "";
  // Group by category, max 4 per category
  const byCat: Record<string, VenueRow[]> = {};
  for (const r of rows) {
    (byCat[r.category] ||= []).push(r);
  }
  const lines: string[] = [
    `## CURATED LOCAL KNOWLEDGE — ${city || "current city"} (silent reference)`,
    `These venues passed strict review/quality filters with source URLs. Only mention them when genuinely relevant to the user's request. When recommending one, include its review evidence and at least one source/website hostname. Never recite unsupported venues.`,
    "",
  ];
  for (const [cat, items] of Object.entries(byCat)) {
    lines.push(`**${cat.replace(/_/g, " ")}**:`);
    for (const v of items.slice(0, 4)) {
      const bits = [
        v.name,
        v.neighborhood ? `(${v.neighborhood})` : null,
        v.price_band || null,
        `${v.review_score}★ / ${v.review_count} reviews`,
        v.source_urls?.[0] ? `source: ${v.source_urls[0]}` : null,
        v.why_recommended ? `— ${v.why_recommended}` : null,
      ].filter(Boolean);
      lines.push(`- ${bits.join(" ")}`);
    }
  }
  return lines.join("\n");
}
