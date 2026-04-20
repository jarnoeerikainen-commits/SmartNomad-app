// Global School Holiday Pack — shared across AI edge functions.
// Auto-refreshed weekly by the `school-holidays-refresh` edge function (writes to ai_cache).
// Falls back to a curated baseline so the Concierge always has *something* useful.
//
// Design rules (very important):
// - SILENT BY DEFAULT. Only surface when the user's actual travel dates / destination
//   overlap a holiday window AND the impact is material (price surge, crowds, closures).
// - Never lecture about holidays that don't affect this user's plan.
// - Always present as concierge insight (e.g. "Heads-up: your dates fall in German
//   Sommerferien — fares to Mallorca jump ~30%. Want me to scan ±1 week?").
// - Verified sources only; if uncertain, say so and offer human verification.

import { createClient } from "npm:@supabase/supabase-js@2";

const HOLIDAY_CACHE_KEY = "school_holidays:v1:weekly";

export interface SchoolHolidayWindow {
  name: string;          // e.g. "Sommerferien Bayern", "February Half-Term"
  season: "winter" | "spring" | "summer" | "autumn";
  startDate: string;     // ISO YYYY-MM-DD
  endDate: string;       // ISO YYYY-MM-DD
  region?: string;       // optional state/province if subnational
  priceImpact: "low" | "medium" | "high" | "extreme";
  notes?: string;        // e.g. "Peak outbound flight demand to MED & Alps"
}

export interface CountryHolidays {
  countryCode: string;   // ISO 3166-1 alpha-2 (e.g. "DE", "FR")
  countryName: string;
  windows: SchoolHolidayWindow[];
}

export interface SchoolHolidayPack {
  generatedAt: string;
  expiresAt: string;
  sourceModel: string;
  sources: string[];
  yearCoverage: number[];                       // e.g. [2026, 2027]
  countries: Record<string, CountryHolidays>;   // keyed by ISO alpha-2
}

// Compact baseline — major outbound markets where holidays drive global price moves.
// Replaced when the weekly refresher succeeds.
const FALLBACK_PACK: SchoolHolidayPack = {
  generatedAt: "2026-04-01",
  expiresAt: "2099-01-01",
  sourceModel: "baseline",
  sources: ["curated-baseline"],
  yearCoverage: [2026, 2027],
  countries: {
    DE: {
      countryCode: "DE", countryName: "Germany",
      windows: [
        { name: "Sommerferien (rolling by Land)", season: "summer", startDate: "2026-06-25", endDate: "2026-09-09", priceImpact: "extreme", notes: "Largest outbound European travel wave; flights to MED & Alps surge 30–60%." },
        { name: "Herbstferien", season: "autumn", startDate: "2026-10-12", endDate: "2026-10-31", priceImpact: "high" },
        { name: "Weihnachtsferien", season: "winter", startDate: "2026-12-21", endDate: "2027-01-06", priceImpact: "extreme" },
        { name: "Osterferien", season: "spring", startDate: "2026-03-30", endDate: "2026-04-11", priceImpact: "high" },
      ],
    },
    FR: {
      countryCode: "FR", countryName: "France",
      windows: [
        { name: "Vacances d'été", season: "summer", startDate: "2026-07-04", endDate: "2026-08-31", priceImpact: "extreme", notes: "August is peak; Côte d'Azur, Corsica, Greece, Italy fares peak." },
        { name: "Vacances de la Toussaint", season: "autumn", startDate: "2026-10-17", endDate: "2026-11-02", priceImpact: "medium" },
        { name: "Vacances de Noël", season: "winter", startDate: "2026-12-19", endDate: "2027-01-04", priceImpact: "extreme" },
        { name: "Vacances d'hiver (3 zones)", season: "winter", startDate: "2026-02-07", endDate: "2026-03-08", priceImpact: "high", notes: "Ski resort fares surge by zone." },
      ],
    },
    GB: {
      countryCode: "GB", countryName: "United Kingdom",
      windows: [
        { name: "Summer Holidays (E&W)", season: "summer", startDate: "2026-07-22", endDate: "2026-09-01", priceImpact: "extreme", notes: "Premier outbound surge; Spain/Greece/Portugal +40%." },
        { name: "October Half-Term", season: "autumn", startDate: "2026-10-26", endDate: "2026-10-30", priceImpact: "high" },
        { name: "Christmas Holidays", season: "winter", startDate: "2026-12-19", endDate: "2027-01-04", priceImpact: "extreme" },
        { name: "February Half-Term", season: "winter", startDate: "2026-02-16", endDate: "2026-02-20", priceImpact: "high", notes: "Ski week; Alps fares peak." },
        { name: "Easter Holidays", season: "spring", startDate: "2026-04-03", endDate: "2026-04-17", priceImpact: "high" },
      ],
    },
    US: {
      countryCode: "US", countryName: "United States",
      windows: [
        { name: "Summer Break", season: "summer", startDate: "2026-06-08", endDate: "2026-08-24", priceImpact: "extreme", notes: "Domestic + transatlantic peak; Europe & Caribbean surge." },
        { name: "Spring Break (rolling)", season: "spring", startDate: "2026-03-09", endDate: "2026-04-10", priceImpact: "high", notes: "Mexico, Caribbean, Florida fares peak." },
        { name: "Thanksgiving Week", season: "autumn", startDate: "2026-11-23", endDate: "2026-11-29", priceImpact: "extreme", notes: "Highest US domestic travel week of year." },
        { name: "Winter Break", season: "winter", startDate: "2026-12-19", endDate: "2027-01-04", priceImpact: "extreme" },
      ],
    },
    CN: {
      countryCode: "CN", countryName: "China",
      windows: [
        { name: "Chinese New Year (Chunyun)", season: "winter", startDate: "2026-02-10", endDate: "2026-02-26", priceImpact: "extreme", notes: "Largest annual human migration; intra-Asia & global Chinese-route fares surge." },
        { name: "Summer Vacation", season: "summer", startDate: "2026-07-01", endDate: "2026-08-31", priceImpact: "extreme" },
        { name: "Golden Week (October)", season: "autumn", startDate: "2026-10-01", endDate: "2026-10-07", priceImpact: "extreme", notes: "Outbound surge to JP/KR/SE Asia/Europe." },
      ],
    },
    JP: {
      countryCode: "JP", countryName: "Japan",
      windows: [
        { name: "Golden Week", season: "spring", startDate: "2026-04-29", endDate: "2026-05-06", priceImpact: "extreme" },
        { name: "Obon", season: "summer", startDate: "2026-08-13", endDate: "2026-08-16", priceImpact: "high" },
        { name: "New Year (Shōgatsu)", season: "winter", startDate: "2026-12-29", endDate: "2027-01-04", priceImpact: "extreme" },
        { name: "Summer Break", season: "summer", startDate: "2026-07-20", endDate: "2026-08-31", priceImpact: "high" },
      ],
    },
    AE: {
      countryCode: "AE", countryName: "United Arab Emirates",
      windows: [
        { name: "Spring Break", season: "spring", startDate: "2026-03-23", endDate: "2026-04-10", priceImpact: "high" },
        { name: "Summer Holidays", season: "summer", startDate: "2026-07-06", endDate: "2026-08-30", priceImpact: "high", notes: "Outbound to Europe / SE Asia peaks." },
        { name: "Winter Break", season: "winter", startDate: "2026-12-13", endDate: "2027-01-03", priceImpact: "extreme" },
      ],
    },
    AU: {
      countryCode: "AU", countryName: "Australia",
      windows: [
        { name: "Summer Holidays", season: "summer", startDate: "2026-12-19", endDate: "2027-01-26", priceImpact: "extreme", notes: "Bali, NZ, Pacific & Europe (DJF inverse) fares peak." },
        { name: "Winter Holidays (July)", season: "winter", startDate: "2026-07-04", endDate: "2026-07-19", priceImpact: "high" },
      ],
    },
  },
};

export async function getSchoolHolidayPack(
  supabaseUrl?: string,
  serviceRoleKey?: string,
): Promise<SchoolHolidayPack> {
  try {
    const url = supabaseUrl || Deno.env.get("SUPABASE_URL");
    const key = serviceRoleKey || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return FALLBACK_PACK;

    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("ai_cache")
      .select("response_text, expires_at")
      .eq("cache_key", HOLIDAY_CACHE_KEY)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error || !data?.response_text) return FALLBACK_PACK;
    const parsed = JSON.parse(data.response_text) as SchoolHolidayPack;
    return parsed && parsed.countries ? parsed : FALLBACK_PACK;
  } catch {
    return FALLBACK_PACK;
  }
}

/** Return only holiday windows that overlap the trip dates, for the destination
 *  country AND the major outbound markets that drive demand to that destination. */
export function findRelevantHolidays(
  pack: SchoolHolidayPack,
  opts: {
    destinationCountryCode?: string;
    travelStart?: string; // YYYY-MM-DD
    travelEnd?: string;   // YYYY-MM-DD
    originCountryCode?: string;
  },
): Array<{ country: CountryHolidays; window: SchoolHolidayWindow }> {
  if (!opts.travelStart || !opts.travelEnd) return [];
  const startTs = Date.parse(opts.travelStart);
  const endTs = Date.parse(opts.travelEnd);
  if (!Number.isFinite(startTs) || !Number.isFinite(endTs)) return [];

  // Markets that move global prices for most destinations
  const HIGH_IMPACT_MARKETS = ["DE", "GB", "FR", "US", "CN", "JP", "AE", "AU"];
  const candidateCodes = new Set(
    [
      opts.destinationCountryCode?.toUpperCase(),
      opts.originCountryCode?.toUpperCase(),
      ...HIGH_IMPACT_MARKETS,
    ].filter(Boolean) as string[],
  );

  const overlaps: Array<{ country: CountryHolidays; window: SchoolHolidayWindow }> = [];
  for (const code of candidateCodes) {
    const country = pack.countries[code];
    if (!country) continue;
    for (const w of country.windows) {
      const ws = Date.parse(w.startDate);
      const we = Date.parse(w.endDate);
      if (!Number.isFinite(ws) || !Number.isFinite(we)) continue;
      // Any overlap?
      if (ws <= endTs && we >= startTs) overlaps.push({ country, window: w });
    }
  }
  // Surface highest impact first
  const rank = { extreme: 4, high: 3, medium: 2, low: 1 } as const;
  overlaps.sort((a, b) => rank[b.window.priceImpact] - rank[a.window.priceImpact]);
  return overlaps;
}

/** Compact prompt block injected into Concierge / Planner system prompts.
 *  Lists ONLY relevant overlaps. If no overlaps, returns empty string so the
 *  AI never mentions holidays at all — keeping output clean. */
export function renderRelevantHolidaysForPrompt(
  pack: SchoolHolidayPack,
  opts: {
    destinationCountryCode?: string;
    travelStart?: string;
    travelEnd?: string;
    originCountryCode?: string;
  },
): string {
  const overlaps = findRelevantHolidays(pack, opts);
  if (overlaps.length === 0) return "";

  const lines = overlaps.slice(0, 6).map(({ country, window }) => {
    const note = window.notes ? ` — ${window.notes}` : "";
    return `• ${country.countryName} • ${window.name} (${window.startDate} → ${window.endDate}) • impact: ${window.priceImpact}${note}`;
  });

  return [
    "═══════════════════════════════════════",
    "🎒 SCHOOL HOLIDAY OVERLAP DETECTED (auto-refreshed weekly)",
    "═══════════════════════════════════════",
    `Updated: ${pack.generatedAt} • Sources: ${pack.sources.slice(0, 4).join(", ")}`,
    "",
    "The user's travel dates overlap these school holiday windows:",
    ...lines,
    "",
    "**How to use this (concierge protocol):**",
    "- Mention ONLY when impact is medium+ AND it materially affects this user (price, crowds, closures, business meeting risk).",
    "- One short heads-up line, then offer ONE concrete action (e.g. shift dates ±1 week, book lounges, fly midweek).",
    "- Never lecture. Never list every overlap. Premium tone, one calm sentence.",
    "- For business travelers: focus on meeting availability, lounge crowding, hotel pricing.",
    "- For families: lean into it positively (school-friendly window).",
    "- If no concrete impact for THIS user, stay silent.",
    "═══════════════════════════════════════",
  ].join("\n");
}

/** When dates aren't known yet (e.g. open chat), expose a tiny global summary
 *  so the AI is *aware* without being chatty. */
export function renderGlobalAwarenessForPrompt(pack: SchoolHolidayPack): string {
  const peakNow = currentlyActivePeakWindows(pack, new Date());
  if (peakNow.length === 0) return "";
  const lines = peakNow.slice(0, 5).map(({ country, window }) =>
    `• ${country.countryName}: ${window.name} (${window.startDate} → ${window.endDate})`,
  );
  return [
    "🎒 SCHOOL-HOLIDAY AWARENESS (silent unless user's plan is affected):",
    "Currently in effect (major markets):",
    ...lines,
    "Use only if it explains a price/crowd/closure issue for the user.",
  ].join("\n");
}

function currentlyActivePeakWindows(pack: SchoolHolidayPack, today: Date) {
  const t = today.getTime();
  const out: Array<{ country: CountryHolidays; window: SchoolHolidayWindow }> = [];
  for (const country of Object.values(pack.countries)) {
    for (const w of country.windows) {
      if (w.priceImpact !== "extreme" && w.priceImpact !== "high") continue;
      const ws = Date.parse(w.startDate);
      const we = Date.parse(w.endDate);
      if (Number.isFinite(ws) && Number.isFinite(we) && ws <= t && we >= t) {
        out.push({ country, window: w });
      }
    }
  }
  return out;
}
