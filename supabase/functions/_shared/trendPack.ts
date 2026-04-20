// Trend & Sports Vocabulary Pack — shared across all AI edge functions.
// Auto-refreshed weekly by the `trend-refresh` edge function (writes to ai_cache).
// Falls back to a curated baseline so the Concierge always has something useful.
//
// Design rules:
// - Premium manners ALWAYS lead. Slang is recognized & understood, never mimicked unless the user opens that door.
// - Verified sources only. If we're not sure, we say so.

import { createClient } from "npm:@supabase/supabase-js@2";

const TREND_CACHE_KEY = "trend_pack:v1:weekly";

export interface TrendPack {
  generatedAt: string;             // ISO date
  expiresAt: string;               // ISO date (≈ 7 days later)
  sourceModel: string;
  sources: string[];               // URLs / source names used
  sportsVocab: Record<string, string[]>;     // sport -> recent slang/jargon (EN)
  youthSlang: Record<string, string[]>;      // language code -> trending words
  globalTrends: string[];                    // short bullets
  lifestyleHabits: string[];                 // wellness / daily-life trends
  cautions: string[];                        // terms to avoid / sensitive topics
}

const FALLBACK_PACK: TrendPack = {
  generatedAt: "2026-04-01",
  expiresAt: "2099-01-01",
  sourceModel: "baseline",
  sources: ["curated-baseline"],
  sportsVocab: {
    football: ["xG", "gegenpress", "low block", "false 9", "rondo", "tiki-taka revival"],
    basketball: ["heat check", "iso ball", "switch everything", "drop coverage", "stretch 5"],
    tennis: ["bagel", "breadstick", "moonball", "shadow swing", "kick serve"],
    golf: ["stinger", "bomb-and-gouge", "stack and tilt", "draw bias", "scrambling%"],
    f1: ["dirty air", "undercut", "overcut", "DRS train", "porpoising", "tyre deg"],
    cycling: ["watts/kg", "FTP", "Z2 ride", "sprint train", "echelon"],
    running: ["zone 2", "tempo", "fartlek", "cadence drill", "carbon plate"],
    surfing: ["barrel", "snap", "air reverse", "glassy", "double-up"],
    skiing: ["pow day", "side-country", "chunder", "death cookies", "corduroy"],
    padel: ["bandeja", "víbora", "chiquita", "lob recovery", "x3"],
    crossfit: ["AMRAP", "EMOM", "RX", "scaled", "thruster"],
    yoga: ["vinyasa flow", "yin", "pranayama", "drishti", "savasana reset"],
    esports: ["GG", "clutch", "smurf", "meta pick", "cracked aim"],
    boxing: ["pivot out", "check hook", "Philly shell", "body shot setup"],
    mma: ["sprawl", "shot timing", "calf kick meta", "scramble exchange"],
    chess: ["prep", "novelty", "engine line", "blitz nerves", "time scramble"],
    sailing: ["VMG", "tack-tack-tack", "lay line", "header", "puff"],
    triathlon: ["brick session", "T1", "T2", "draft legal", "pacing power"],
    swimming: ["taper", "negative split", "open turn", "hypoxic set"],
    climbing: ["beta", "send", "crux", "flash", "redpoint", "highball"],
  },
  youthSlang: {
    en: ["lowkey", "rizz", "delulu", "ate that", "no cap", "it's giving", "main character energy"],
    es: ["chill", "crack", "petarlo", "vibras", "qué guay", "estar en su salsa"],
    pt: ["dar trato", "top demais", "manda nudes não, manda boas vibes", "cringe", "mood"],
    fr: ["c'est validé", "askip", "sah quoi", "wesh", "trop stylé", "ça tape"],
    de: ["safe", "läuft bei dir", "digga", "lost", "cringe", "krass"],
    it: ["bella zio", "scialla", "fra", "top", "che vibe"],
    ja: ["エモい (emoi)", "尊い (toutoi)", "推し", "ガチ", "それな"],
    ko: ["대박", "찐", "갓", "꿀잼", "인싸"],
    zh: ["绝绝子", "yyds", "破防了", "栓Q", "上头"],
    ar: ["يا سلام", "تمام التمام", "على راسي", "ولا يهمك"],
    hi: ["ekdum", "scenes", "bohot hard", "lit hai", "vibe check"],
    ru: ["краш", "вайб", "топчик", "залип", "жиза"],
    tr: ["efsane", "harbi", "vibe yakaladık", "atom karınca", "tam gaz"],
  },
  globalTrends: [
    "Quiet luxury is replacing logo-heavy fashion in HNW circles.",
    "AI-native productivity tools (agents, voice-first UX) entering mainstream.",
    "Longevity & VO2max tracking moved from biohackers to general wellness.",
    "Run clubs and padel are the dominant 'social sports' trends in 2026.",
    "'Sober curious' continues to grow — premium NA cocktails are standard at top venues.",
    "Workations & co-living are normalizing for senior professionals, not just nomads.",
  ],
  lifestyleHabits: [
    "Morning sunlight + zone-2 cardio for circadian and metabolic health.",
    "Cold exposure (2–3 min) and sauna stacking for recovery.",
    "Single-tasking blocks; phones in another room during deep work.",
    "Protein 1.6–2.2 g/kg for active adults; creatine 5g/day mainstream.",
    "Sleep tracking treated as a vital sign, not a gadget.",
  ],
  cautions: [
    "Never mimic AAVE, regional, or religious-coded slang unless the user uses it first.",
    "Avoid politically charged or generational mocking terms.",
    "Drug, gambling, and tobacco slang: recognize, never recommend.",
  ],
};

export async function getTrendPack(supabaseUrl?: string, serviceRoleKey?: string): Promise<TrendPack> {
  try {
    const url = supabaseUrl || Deno.env.get("SUPABASE_URL");
    const key = serviceRoleKey || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return FALLBACK_PACK;

    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("ai_cache")
      .select("response_text, expires_at")
      .eq("cache_key", TREND_CACHE_KEY)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error || !data?.response_text) return FALLBACK_PACK;
    const parsed = JSON.parse(data.response_text) as TrendPack;
    return parsed && parsed.sportsVocab ? parsed : FALLBACK_PACK;
  } catch {
    return FALLBACK_PACK;
  }
}

/** Build a compact prompt section the Concierge can read every turn. */
export function renderTrendPackForPrompt(pack: TrendPack, language = "en"): string {
  const langSlang = pack.youthSlang[language] || pack.youthSlang.en || [];
  const sportsLine = Object.entries(pack.sportsVocab)
    .slice(0, 18)
    .map(([sport, words]) => `${sport}: ${words.slice(0, 5).join(", ")}`)
    .join(" | ");

  return [
    "═══════════════════════════════════════",
    "🌐 LIVE CULTURAL & SPORTS PACK (auto-refreshed weekly)",
    "═══════════════════════════════════════",
    `Updated: ${pack.generatedAt} • Sources: ${pack.sources.slice(0, 4).join(", ")}`,
    "",
    "**Premium tone always leads.** You UNDERSTAND slang and trends — you do not perform them. ",
    "Mirror the user's register only after they set it. Never mimic ethnic, religious, or generational slang first.",
    "",
    `🗣️ Trending youth slang (${language}): ${langSlang.slice(0, 12).join(" • ")}`,
    "",
    `🏅 Sports jargon — recognize and use precisely when the user is in that domain:`,
    sportsLine,
    "",
    `🌍 Global cultural trends: ${pack.globalTrends.slice(0, 5).join(" • ")}`,
    `🧘 Lifestyle & wellness habits: ${pack.lifestyleHabits.slice(0, 4).join(" • ")}`,
    `⚠️ Cautions: ${pack.cautions.join(" • ")}`,
    "",
    "If a slang term, athlete, brand, or trend is unfamiliar or post-knowledge-cutoff,",
    "say so plainly and offer to verify with SuperNomad human support — never invent.",
    "═══════════════════════════════════════",
  ].join("\n");
}
