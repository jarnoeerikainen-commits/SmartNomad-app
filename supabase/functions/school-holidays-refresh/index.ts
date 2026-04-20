// Weekly School Holiday Refresher.
// Generates a global, per-country pack of school holiday windows (winter/spring/
// summer/autumn) for the current + next year, with price-impact ratings and
// outbound demand notes. Stored in ai_cache under `school_holidays:v1:weekly` (7-day TTL).
//
// Triggered by pg_cron weekly (Mondays 04:30 UTC). Manually callable with ?force=1.
// Strategy: chunk countries into batches of ~25 to stay within token limits and
// keep the AI focused. We use Gemini 2.5 Pro with strict tool-calling output and
// merge the results.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HOLIDAY_CACHE_KEY = "school_holidays:v1:weekly";

// ~190 countries grouped by region — top outbound / inbound markets first so a
// partial run still covers the routes that matter most.
const COUNTRY_BATCHES: Array<{ region: string; codes: string[] }> = [
  { region: "Top Outbound Markets", codes: ["DE", "GB", "FR", "US", "CN", "JP", "AE", "AU", "CA", "IT", "ES", "NL", "SE", "NO", "DK", "FI", "CH", "AT", "BE", "IE", "PL", "PT", "GR", "TR", "RU"] },
  { region: "Asia Pacific", codes: ["IN", "ID", "TH", "VN", "PH", "MY", "SG", "KR", "TW", "HK", "NZ", "BD", "PK", "LK", "NP", "MM", "KH", "LA", "MN", "MO", "BN", "MV"] },
  { region: "Middle East & North Africa", codes: ["SA", "QA", "KW", "BH", "OM", "IL", "JO", "LB", "EG", "MA", "TN", "DZ", "LY", "IQ", "IR", "SY", "YE", "PS"] },
  { region: "Sub-Saharan Africa", codes: ["ZA", "KE", "NG", "GH", "ET", "TZ", "UG", "RW", "SN", "CI", "CM", "ZW", "ZM", "BW", "NA", "MZ", "MG", "MU", "SC", "SD", "AO", "ML", "BF", "BJ", "TG", "GA", "GN", "SL", "LR", "NE", "TD", "DJ", "ER", "SO", "SS", "BI", "CD", "CG", "CF", "MW", "LS", "SZ", "GM", "GW", "CV", "ST", "KM"] },
  { region: "Latin America & Caribbean", codes: ["MX", "BR", "AR", "CL", "PE", "CO", "UY", "PY", "BO", "EC", "VE", "CR", "PA", "GT", "HN", "SV", "NI", "DO", "CU", "JM", "TT", "BS", "BB", "BZ", "GY", "SR", "HT", "AG", "DM", "GD", "KN", "LC", "VC"] },
  { region: "Eastern Europe & Central Asia", codes: ["UA", "RO", "BG", "HU", "CZ", "SK", "HR", "SI", "RS", "BA", "MK", "AL", "ME", "MD", "BY", "EE", "LV", "LT", "GE", "AM", "AZ", "KZ", "UZ", "TM", "KG", "TJ", "XK"] },
  { region: "Pacific Islands & Other", codes: ["FJ", "WS", "TO", "VU", "SB", "PG", "PW", "FM", "MH", "KI", "TV", "NR", "BT", "TL"] },
  { region: "Microstates & Territories", codes: ["IS", "LU", "MT", "CY", "MC", "AD", "SM", "VA", "LI", "IM", "JE", "GG"] },
];

const HOLIDAY_TOOL = {
  type: "function",
  function: {
    name: "emit_country_holidays",
    description: "Return school holiday windows for a batch of countries (current + next year).",
    parameters: {
      type: "object",
      properties: {
        countries: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            properties: {
              countryCode: { type: "string", description: "ISO 3166-1 alpha-2 (uppercase)." },
              countryName: { type: "string" },
              windows: {
                type: "array",
                description: "School holiday windows. Use national average if subnational rolling.",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Local name + English in parens, e.g. 'Sommerferien (Summer Holidays)'" },
                    season: { type: "string", enum: ["winter", "spring", "summer", "autumn"] },
                    startDate: { type: "string", description: "ISO YYYY-MM-DD." },
                    endDate: { type: "string", description: "ISO YYYY-MM-DD." },
                    region: { type: "string", description: "Optional state/province if subnational." },
                    priceImpact: { type: "string", enum: ["low", "medium", "high", "extreme"] },
                    notes: { type: "string", description: "Short note on outbound demand impact (where prices surge to)." },
                  },
                  required: ["name", "season", "startDate", "endDate", "priceImpact"],
                },
              },
            },
            required: ["countryCode", "countryName", "windows"],
          },
        },
        sources: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 8 },
      },
      required: ["countries", "sources"],
    },
  },
};

interface BatchResultCountry {
  countryCode: string;
  countryName: string;
  windows: Array<Record<string, unknown>>;
}

async function callBatch(
  apiKey: string,
  region: string,
  codes: string[],
  yearA: number,
  yearB: number,
): Promise<{ countries: BatchResultCountry[]; sources: string[] } | null> {
  const userPrompt = `Region: ${region}
Generate accurate school holiday windows for the following countries for academic years ${yearA} and ${yearB}.

Country codes (ISO 3166-1 alpha-2): ${codes.join(", ")}

For EACH country provide all four seasons that exist in that system (winter break, spring break, summer break, autumn/half-term break). Some countries split summer by region — give the national average window if so.

Date sources to verify against (use only confirmed data — if unsure, omit that window):
- Ministry of Education sites for each country
- school-holidays-europe.eu for European countries
- timeanddate.com / officeholidays.com for cross-reference
- For US: Department of Education + major state district calendars (CA, TX, FL, NY)
- For DE: kmk.org rolling Sommerferien schedule per Bundesland (give national window)
- For UK: gov.uk school term dates
- For FR: education.gouv.fr (3-zone winter; combined window)
- For CN/JP/KR: ministry calendars + Lunar New Year / Golden Week / Obon

priceImpact rubric:
- extreme = drives global flight/hotel surge (e.g. DE Sommerferien, US Thanksgiving, CN Chunyun, FR August)
- high = strong domestic + regional surge
- medium = moderate domestic surge
- low = minor / regional only

In notes: where do prices surge TO (e.g. "Spain, Greece, Italy fares +30–50%"). Keep notes under 80 chars.

Rules:
- Only include verifiable windows. If you do not know a country's calendar with confidence, return an empty windows array for that country.
- Use the local name + English in parens for the 'name' field.
- Output ONLY via the emit_country_holidays tool.`;

  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: "You are a meticulous global education-calendar analyst. Verified sources only. If unsure about a country's exact dates, omit it rather than guess." },
        { role: "user", content: userPrompt },
      ],
      tools: [HOLIDAY_TOOL],
      tool_choice: { type: "function", function: { name: "emit_country_holidays" } },
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    console.error(`school-holidays-refresh batch[${region}] AI error`, resp.status, t.slice(0, 400));
    return null;
  }
  const data = await resp.json();
  const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) {
    console.error(`school-holidays-refresh batch[${region}] missing tool args`);
    return null;
  }
  try {
    return JSON.parse(args);
  } catch (e) {
    console.error(`school-holidays-refresh batch[${region}] JSON parse error`, e);
    return null;
  }
}

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

    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "1";
    const onlyRegion = url.searchParams.get("region"); // optional: refresh single batch

    if (!force) {
      const { data: existing } = await supabase
        .from("ai_cache")
        .select("expires_at")
        .eq("cache_key", HOLIDAY_CACHE_KEY)
        .gt("expires_at", new Date(Date.now() + 24 * 3600 * 1000).toISOString())
        .maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ ok: true, skipped: "fresh-cache" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const startedAt = Date.now();
    const yearA = new Date().getUTCFullYear();
    const yearB = yearA + 1;

    const batches = onlyRegion
      ? COUNTRY_BATCHES.filter(b => b.region === onlyRegion)
      : COUNTRY_BATCHES;

    // Fan-out batches with limited concurrency (3 at a time) to keep AI gateway happy.
    const merged: Record<string, { countryCode: string; countryName: string; windows: any[] }> = {};
    const allSources = new Set<string>();
    const concurrency = 3;
    let cursor = 0;
    let ok = 0, fail = 0;

    while (cursor < batches.length) {
      const slice = batches.slice(cursor, cursor + concurrency);
      const results = await Promise.all(
        slice.map(b => callBatch(LOVABLE_API_KEY, b.region, b.codes, yearA, yearB)),
      );
      for (const r of results) {
        if (!r) { fail++; continue; }
        ok++;
        for (const c of r.countries ?? []) {
          if (!c?.countryCode) continue;
          const code = c.countryCode.toUpperCase();
          if (!Array.isArray(c.windows) || c.windows.length === 0) continue;
          // Validate dates
          const cleanWindows = c.windows.filter((w: any) =>
            typeof w?.startDate === "string" && typeof w?.endDate === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(w.startDate) && /^\d{4}-\d{2}-\d{2}$/.test(w.endDate) &&
            ["winter","spring","summer","autumn"].includes(w.season) &&
            ["low","medium","high","extreme"].includes(w.priceImpact),
          );
          if (cleanWindows.length === 0) continue;
          merged[code] = {
            countryCode: code,
            countryName: c.countryName || code,
            windows: cleanWindows,
          };
        }
        for (const s of r.sources ?? []) allSources.add(s);
      }
      cursor += concurrency;
    }

    if (Object.keys(merged).length === 0) {
      return new Response(JSON.stringify({ error: "All batches failed", ok, fail }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
    const pack = {
      generatedAt: now.toISOString().slice(0, 10),
      expiresAt: expiresAt.toISOString(),
      sourceModel: "google/gemini-2.5-pro",
      sources: Array.from(allSources).slice(0, 12),
      yearCoverage: [yearA, yearB],
      countries: merged,
    };

    await supabase.from("ai_cache").delete().eq("cache_key", HOLIDAY_CACHE_KEY);
    const { error: insertErr } = await supabase.from("ai_cache").insert({
      cache_key: HOLIDAY_CACHE_KEY,
      query_text: "weekly_school_holidays_refresh",
      response_text: JSON.stringify(pack),
      model: "google/gemini-2.5-pro",
      expires_at: expiresAt.toISOString(),
      metadata: {
        kind: "school_holidays",
        countries_count: Object.keys(merged).length,
        years: [yearA, yearB],
        batches_ok: ok,
        batches_failed: fail,
      },
    });

    if (insertErr) {
      console.error("school-holidays-refresh insert error", insertErr);
      return new Response(JSON.stringify({ error: "Failed to persist pack" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      ok: true,
      countries: Object.keys(merged).length,
      batches_ok: ok,
      batches_failed: fail,
      latencyMs: Date.now() - startedAt,
      expiresAt: pack.expiresAt,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("school-holidays-refresh error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
