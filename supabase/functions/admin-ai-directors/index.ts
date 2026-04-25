// ═══════════════════════════════════════════════════════════════════
// ADMIN AI DIRECTORS — 24/7 sourcing workers (10 specialised roles)
//
// Original 3:
//   • events       — Global Event Director (concerts, festivals, art fairs)
//   • sports       — Global Sports Director (F1, MotoGP, NBA, rugby, …)
//   • vip          — Global VIP Director (galas, fashion week, paddock club)
//
// New 7 (added in this build):
//   • affiliate    — Affiliate & Partnership Director  (commission deals)
//   • loyalty      — Loyalty & Rewards Director         (partner-funded perks)
//   • sponsorship  — Sponsorship Director               (HNW brand placements)
//   • b2b_sales    — B2B / Corporate Sales Director     (SaaS / white-label)
//   • pricing      — Pricing & Yield Director           (subs / FX margins)
//   • aviation     — Aviation & Mobility Director       (jets / empty legs / yachts)
//   • happiness    — Happiness & NPS Director           (churn save, intervention)
//
// Every run:
//   1. Picks a director.
//   2. Asks Lovable AI Gateway for 6–10 high-signal opportunities (role-specific).
//   3. Persists into admin_ai_opportunities (requires_approval = true by default).
//   4. Mirrors top picks into admin_ai_recommendations (also requires_approval).
//   5. NOTHING gets pushed to Concierge / Sales until a human approves.
// ═══════════════════════════════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const MODEL = "google/gemini-3-flash-preview";

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

type Director =
  | "events" | "sports" | "vip"
  | "affiliate" | "loyalty" | "sponsorship"
  | "b2b_sales" | "pricing" | "aviation" | "happiness";

const ALL_DIRECTORS: Director[] = [
  "events", "sports", "vip",
  "affiliate", "loyalty", "sponsorship",
  "b2b_sales", "pricing", "aviation", "happiness",
];

// ─── Director briefs ──────────────────────────────────────────────────
const briefs: Record<
  Director,
  { title: string; mandate: string; categories: string[]; example_targets: string; output_focus: string }
> = {
  events: {
    title: "Global Event Director",
    mandate:
      "Source upcoming high-impact concerts, music festivals, art fairs (Art Basel, Frieze), tech conferences (CES, Web Summit, Slush), film premieres, food & wine events, opera, and major cultural happenings worldwide that high-net-worth nomads would care about over the next 60 days.",
    categories: ["concert", "festival", "art_fair", "conference", "premiere", "food_wine", "opera", "exhibition"],
    example_targets:
      "Art Basel Miami / Hong Kong, Coachella, Glastonbury, Tomorrowland, Cannes Film Festival, Web Summit Lisbon, Slush Helsinki, Frieze London, Salone del Mobile",
    output_focus: "premium event opportunities with VIP packages, sponsor packages, concierge sales bundles",
  },
  sports: {
    title: "Global Sports Director",
    mandate:
      "Source upcoming top-tier sports events and big-league games over the next 60 days: F1, MotoGP, NASCAR, IndyCar, NBA marquee games and playoffs, NFL, MLB, NHL, Premier League / La Liga / Serie A / Champions League finals, Six Nations rugby, World Rugby 7s, ATP/WTA Masters & Slams, PGA majors, UFC numbered cards, World Athletics, and Olympics qualifiers.",
    categories: ["f1", "motogp", "nascar", "indycar", "nba", "nfl", "soccer", "rugby_7s", "rugby_15s", "tennis", "golf", "ufc", "athletics"],
    example_targets:
      "Monaco GP, Silverstone GP, Mugello MotoGP, Daytona 500, NBA Finals, Super Bowl, Champions League final, Wimbledon, US Open, The Masters, UFC 300, Diamond League meets",
    output_focus: "premium sports opportunities with hospitality packages, sponsor packages, jet+hotel bundles",
  },
  vip: {
    title: "Global VIP Director",
    mandate:
      "Source ultra-exclusive black-tier opportunities the next 60 days: black-tie galas, charity dinners (amfAR, Met Gala adjacent), royal & embassy events, fashion week front-row + after-parties (Paris/Milan/NY/London), yacht-show after-parties (Monaco, Cannes Lions), F1 Paddock Club access, private museum openings, Davos side-events, Sun Valley, Allen & Co., and members-only retreats (Soho House, Aman Club).",
    categories: ["gala", "vip_party", "fashion_week", "paddock_club", "private_dinner", "members_retreat", "yacht_party", "embassy"],
    example_targets:
      "Met Gala adjacent dinners, amfAR Cannes Gala, Paris Fashion Week front-row, Monaco Yacht Show after-parties, F1 Paddock Club Monaco/Singapore, Davos side dinners, Allen & Co Sun Valley, Aman Club opening",
    output_focus: "ultra-exclusive black-tier access with single-seat & table prices, sponsor underwriting tiers",
  },
  affiliate: {
    title: "Affiliate & Partnership Director",
    mandate:
      "Identify high-value affiliate / partnership deal opportunities for SuperNomad. Real merchant brands HNW nomads use — premium credit cards (Amex, Chase Sapphire), private banks, eSIM providers (Airalo, Saily), travel insurance (World Nomads, SafetyWing), private aviation brokers (NetJets, VistaJet, JSX), luxury hotel groups (Aman, Four Seasons, Six Senses), DocSend / virtual mailbox, premium VPNs, crypto exchanges (Kraken, Coinbase, Bitstamp), wealth platforms (Schwab, IBKR), and luxury concierge services. Focus on deals with strong commission %, recurring payouts, and white-label potential.",
    categories: ["card_partner", "bank_partner", "esim_partner", "insurance_partner", "aviation_partner", "hotel_partner", "crypto_partner", "wealth_partner", "concierge_partner", "saas_partner"],
    example_targets:
      "Amex Platinum referral, NetJets fractional referral, Aman Club partnership, Airalo eSIM affiliate, SafetyWing insurance, Wise multi-currency, IBKR Pro signup, Kraken Pro signup, World Nomads, Six Senses booking",
    output_focus: "affiliate / partnership deals with commission rate, expected monthly volume, payout terms, and partnership type",
  },
  loyalty: {
    title: "Loyalty & Rewards Director",
    mandate:
      "Design high-impact, partner-funded loyalty & rewards moments for SuperNomad members. Examples: free Aman one-night perk for premium members, Amex Platinum-style hotel benefits, status-match offers, surprise upgrade pools, milestone gifts (10th country, 100th booking), NPS save-offers, anniversary perks, partner-funded experiences (a champagne tasting, a spa credit). Focus on perks where the partner pays the cost in exchange for distribution / brand exposure.",
    categories: ["status_perk", "milestone_gift", "surprise_upgrade", "partner_credit", "save_offer", "anniversary_perk", "tier_unlock"],
    example_targets:
      "Aman 1-night-free comp, Soho House paid-membership upgrade, Six Senses spa credit, Bowmore tasting, Veuve Clicquot champagne case, Goyard luggage tag gifting, IWC repair voucher, Bvlgari hotel turn-down gift",
    output_focus: "partner-funded perk programs with member tier targeting, partner-paid budget, churn impact",
  },
  sponsorship: {
    title: "Sponsorship Director",
    mandate:
      "Pitch HNW-aligned brand sponsorships across the SuperNomad ecosystem (concierge, news center, events, members areas, branded experiences). Real luxury & lifestyle brands that pay 6–7-figures for HNW reach: LVMH portfolio, Richemont (Cartier, IWC), Rolex, Patek Philippe, Bvlgari, Aston Martin, Bentley, Rolls-Royce, Porsche, NetJets, Sotheby's, Christie's, Ritz-Carlton, Citi Private Bank, JPM Private Bank. Focus on which placements (concierge co-branded module, gala underwriting, F1 paddock takeover) and what each tier should cost.",
    categories: ["concierge_placement", "experience_underwriting", "content_takeover", "branded_module", "gala_underwriting", "members_room"],
    example_targets:
      "Cartier branded jewellery concierge thread, IWC F1 timing module, Aston Martin DBX test drive program, Rolls-Royce Ghost city-driver moment, Citi Private Bank wealth pulse module, NetJets sky-status module",
    output_focus: "sponsor placements with target brand list, tier pricing (silver/gold/platinum/underwriter), exact deliverables, expected reach",
  },
  b2b_sales: {
    title: "B2B / Corporate Sales Director",
    mandate:
      "Hunt corporate B2B leads for the SuperNomad SaaS / white-label / Duty-of-Care offering. Companies with distributed workforces, executive travel, expat programs, or HNW client bases that would buy: family offices, top consulting firms (McKinsey, BCG), tech giants with global teams, private banks, top law firms, premium asset managers, sports teams (player travel), film production studios, professional service firms.",
    categories: ["family_office", "consulting", "tech_global", "private_bank", "law_firm", "asset_mgr", "sports_team", "studio", "saas_buyer"],
    example_targets:
      "Bain & Co duty-of-care, KKR family office add-on, NBA team travel platform, Netflix production-travel SaaS, McKinsey nomad-policy white-label, Bridgewater partner travel, BCG global mobility, Kirkland & Ellis lawyer travel",
    output_focus: "B2B leads with company name, deal size, ARR potential, decision-maker title, recommended pitch angle",
  },
  pricing: {
    title: "Pricing & Yield Director",
    mandate:
      "Surface pricing and yield optimisation opportunities across SuperNomad: subscription tier pricing, FX spread on the Wallet, concierge service-fee scaling, premium tier A/B opportunities, surge / dynamic pricing windows around events, currency-pair margins, win-back discount sizing, annual-vs-monthly conversion levers.",
    categories: ["subscription_pricing", "fx_spread", "service_fee", "tier_test", "surge_pricing", "winback_discount", "annual_conversion"],
    example_targets:
      "Move Premium from $4.99 → $7.99 with 90-day grandfathering, Add USDC FX spread of 35bps, Charge 12% concierge service fee on jets, A/B test annual vs monthly upsell, Surge concierge fees during F1 Monaco week",
    output_focus: "pricing changes with current → proposed price, expected revenue lift, churn risk, A/B test design",
  },
  aviation: {
    title: "Aviation & Mobility Director",
    mandate:
      "Source private aviation, premium ground, and yacht charter opportunities. Real operators: NetJets, VistaJet, JSX, Wheels Up, BLADE, Flexjet, GlobeAir, Victor (empty-leg marketplace), Burgess Yachts, Camper & Nicholsons, Edmiston, Blacklane, Wheely. Focus on bookable inventory (empty legs, last-minute availability), broker margin %, premium ground transfers, yacht week charters, helicopter day rates, and private train cars.",
    categories: ["empty_leg", "private_jet_charter", "premium_ground", "helicopter", "yacht_charter", "private_train", "broker_margin"],
    example_targets:
      "NetJets empty leg LON→NCE Friday, VistaJet last-minute MIA→TEB, BLADE NYC heli, Burgess Yacht week Monaco, Edmiston Med charter, Blacklane Tokyo executive package, Belmond Royal Scotsman cabin",
    output_focus: "aviation/mobility inventory with route, dates, broker price, retail price, margin %, urgency",
  },
  happiness: {
    title: "Happiness & NPS Director",
    mandate:
      "Identify happiness, retention, and proactive intervention opportunities. Spot churn-risk signals (drop in concierge usage, cancelled bookings, unresolved tickets, low NPS), surprise-and-delight moments (post-trip thank-you, birthday gestures), service-recovery offers after a bad experience, and proactive interventions when signals turn negative. Output should be member-segment focused, never PII-exposing.",
    categories: ["churn_risk", "save_offer", "surprise_delight", "service_recovery", "nps_intervention", "anniversary_touch", "birthday_touch"],
    example_targets:
      "Members with NPS <6 last 30d → 1-month premium credit, members who hit ticket P1 → handwritten note + voucher, top-decile users → Aman 1-night gift, dormant 60d users → curated re-engagement email + concierge call",
    output_focus: "intervention programs with target segment, gesture cost, expected NPS delta, expected retention delta",
  },
};

// ─── AI synthesis (structured output via tool calling) ────────────────
async function sourceWithAI(director: Director, scope: string) {
  const brief = briefs[director];

  const systemPrompt = `You are the SuperNomad ${brief.title}. You work 24/7 sourcing premium opportunities for a high-net-worth global nomad platform. You partner tightly with Sales, Marketing, the Concierge AI, and the other AI Directors. Every opportunity must be SELLABLE, BUNDLEABLE, or DIRECTLY ACTIONABLE.

Your mandate: ${brief.mandate}

Allowed categories: ${brief.categories.join(", ")}
Inspiration targets (real, well-known — pick from these or other genuinely well-known examples; never invent fictional brands): ${brief.example_targets}

Your output focus: ${brief.output_focus}

GROUND RULES (Evidence-First / Source of Truth):
- Use only real-world brands, events, and companies. No fabrications.
- Prices, audience sizes, ARR estimates must be plausible market estimates — never fake "official" figures.
- Output 6 to 10 opportunities per run.
- For each opportunity propose:
   - 2 to 3 VIP / member packages or "asks" (name, price USD, perks/deliverables)
   - 2 to 3 sponsor / partner packages (tier name, price USD, deliverables, target companies)
   - 1 Concierge / sales bundle (one-line pitch + bundle parts)
   - sales target segments
   - popularity_score (0-100) and exclusivity_score (0-100)
- ALL outputs require human approval before being pushed to Concierge or Sales — phrase rationale as a recommendation, not as a done deal.`;

  const userPrompt = `Scope: ${scope}. Return your next batch of opportunities NOW. Today is ${new Date().toISOString().slice(0, 10)}.`;

  const tools = [
    {
      type: "function",
      function: {
        name: "deliver_opportunities",
        description: "Return a batch of sourced opportunities for the director.",
        parameters: {
          type: "object",
          properties: {
            opportunities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  title: { type: "string" },
                  summary: { type: "string" },
                  city: { type: "string" },
                  country: { type: "string" },
                  venue: { type: "string" },
                  start_at: { type: "string", description: "ISO datetime, approx ok" },
                  end_at: { type: "string" },
                  url: { type: "string" },
                  popularity_score: { type: "number" },
                  exclusivity_score: { type: "number" },
                  est_audience: { type: "number" },
                  est_ticket_price_min: { type: "number" },
                  est_ticket_price_max: { type: "number" },
                  currency: { type: "string" },
                  vip_packages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        price: { type: "number" },
                        perks: { type: "array", items: { type: "string" } },
                      },
                      required: ["name", "price", "perks"],
                    },
                  },
                  sponsor_packages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        tier: { type: "string" },
                        price: { type: "number" },
                        deliverables: { type: "array", items: { type: "string" } },
                        target_companies: { type: "array", items: { type: "string" } },
                      },
                      required: ["tier", "price", "deliverables"],
                    },
                  },
                  concierge_offer: {
                    type: "object",
                    properties: {
                      pitch: { type: "string" },
                      bundle: { type: "array", items: { type: "string" } },
                      upsell: { type: "array", items: { type: "string" } },
                    },
                    required: ["pitch", "bundle"],
                  },
                  sales_target_segments: { type: "array", items: { type: "string" } },
                  tags: { type: "array", items: { type: "string" } },
                  notes: { type: "string" },
                },
                required: ["category", "title", "summary", "vip_packages", "sponsor_packages", "concierge_offer"],
              },
            },
          },
          required: ["opportunities"],
        },
      },
    },
  ];

  const t0 = Date.now();
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools,
      tool_choice: { type: "function", function: { name: "deliver_opportunities" } },
      max_tokens: 8192,
    }),
  });
  const latency = Date.now() - t0;

  if (!resp.ok) {
    const txt = await resp.text();
    if (resp.status === 429) throw new Error("Rate limit, try again shortly");
    if (resp.status === 402) throw new Error("AI credits exhausted");
    throw new Error(`AI gateway ${resp.status}: ${txt.slice(0, 300)}`);
  }
  const data = await resp.json();
  const finishReason = data?.choices?.[0]?.finish_reason;
  if (finishReason === "length") {
    throw new Error("AI response was truncated before the director returned a complete opportunity batch");
  }
  const call = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) throw new Error("No tool call returned by model");
  const parsed = JSON.parse(call.function.arguments);
  const usage = data?.usage ?? {};

  return {
    opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
    latency,
    input_tokens: usage.prompt_tokens ?? 0,
    output_tokens: usage.completion_tokens ?? 0,
  };
}

const cleanText = (value: unknown, max = 500) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

const cleanIso = (value: unknown) => {
  const text = cleanText(value, 80);
  if (!text) return null;
  const time = Date.parse(text);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
};

const cleanPackages = (value: unknown) => Array.isArray(value) ? value.slice(0, 4) : [];

const cleanStringArray = (value: unknown, limit = 12) =>
  Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean).slice(0, limit) : [];

// ─── Persist opportunities + queue recommendations ────────────────────
async function persist(director: Director, runId: string, ops: any[]) {
  if (!ops.length) return { opportunities_created: 0, sponsor_packages_created: 0, pushed_recommendations: 0 };

  const rows = ops.map((o) => ({
    director,
    category: String(o.category ?? "other").toLowerCase(),
    title: String(o.title).slice(0, 200),
    summary: String(o.summary ?? "").slice(0, 1500),
    city: cleanText(o.city, 120),
    country: cleanText(o.country, 120),
    venue: cleanText(o.venue, 180),
    start_at: cleanIso(o.start_at),
    end_at: cleanIso(o.end_at),
    url: cleanText(o.url, 500),
    source: "ai_synth",
    popularity_score: Math.min(100, Math.max(0, Number(o.popularity_score ?? 50))),
    exclusivity_score: Math.min(100, Math.max(0, Number(o.exclusivity_score ?? 50))),
    est_audience: o.est_audience ? Math.max(0, Math.round(Number(o.est_audience))) : null,
    est_ticket_price_min: o.est_ticket_price_min ?? null,
    est_ticket_price_max: o.est_ticket_price_max ?? null,
    currency: (o.currency ?? "USD").toUpperCase().slice(0, 3),
    vip_packages: cleanPackages(o.vip_packages),
    sponsor_packages: cleanPackages(o.sponsor_packages),
    concierge_offer: typeof o.concierge_offer === "object" && o.concierge_offer ? o.concierge_offer : {},
    sales_target_segments: cleanStringArray(o.sales_target_segments),
    tags: cleanStringArray(o.tags),
    source_run_id: runId,
    metadata: { notes: o.notes ?? null },
    expires_at: new Date(Date.now() + 60 * 86400_000).toISOString(),
    requires_approval: true, // ← mandatory human approval
  }));

  const { data: inserted } = await admin
    .from("admin_ai_opportunities")
    .insert(rows)
    .select("id,title,popularity_score,exclusivity_score,sponsor_packages,concierge_offer,city,country,start_at,category");

  const opps = inserted ?? [];
  const sponsorCount = opps.reduce((s, o: any) => s + (Array.isArray(o.sponsor_packages) ? o.sponsor_packages.length : 0), 0);

  // Queue top 3 (by popularity+exclusivity) into admin_ai_recommendations,
  // also pending approval. Nothing flows to Concierge/Sales until human signs off.
  const top = [...opps]
    .sort((a: any, b: any) => (b.popularity_score + b.exclusivity_score) - (a.popularity_score + a.exclusivity_score))
    .slice(0, 3);

  let queuedRecs = 0;
  if (top.length) {
    const recRows = top.map((o: any) => ({
      kind: pickRecKind(director),
      priority: o.exclusivity_score >= 80 || o.popularity_score >= 85 ? "high" : "medium",
      confidence: 0.78,
      title: `[${director.toUpperCase()}] ${o.title}`,
      rationale: `Sourced by the ${briefs[director].title}. ${o.city ?? ""}${o.country ? ", " + o.country : ""}${o.start_at ? " · starts " + new Date(o.start_at).toISOString().slice(0, 10) : ""}.`,
      suggested_action:
        (o.concierge_offer?.pitch ? "Concierge pitch: " + o.concierge_offer.pitch + "\n" : "") +
        "AWAITING APPROVAL — once approved, push to Concierge as bundleable offer and to Sales for outreach.",
      expected_impact: pickExpectedImpact(director),
      target_segment: { director, opportunity_id: o.id, category: o.category },
      evidence: { source: "admin-ai-directors", run_id: runId },
      source_run_id: runId,
      expires_at: new Date(Date.now() + 30 * 86400_000).toISOString(),
      requires_approval: true,
      status: "pending",
    }));
    const { data: insertedRecs } = await admin
      .from("admin_ai_recommendations")
      .insert(recRows)
      .select("id");
    queuedRecs = insertedRecs?.length ?? 0;
  }

  return {
    opportunities_created: opps.length,
    sponsor_packages_created: sponsorCount,
    pushed_recommendations: queuedRecs, // they are queued, not pushed
  };
}

function pickRecKind(d: Director): string {
  switch (d) {
    case "vip": return "feature_promote";
    case "affiliate": return "new_order";
    case "loyalty": return "user_nurture";
    case "sponsorship": return "feature_promote";
    case "b2b_sales": return "new_order";
    case "pricing": return "pricing_change";
    case "aviation": return "new_order";
    case "happiness": return "churn_save";
    default: return "new_order";
  }
}

function pickExpectedImpact(d: Director): string {
  switch (d) {
    case "events": case "sports": case "vip":
      return "Premium GMV uplift via VIP & sponsor packages; concierge conversion boost.";
    case "affiliate":
      return "Recurring affiliate revenue; commission stack diversification.";
    case "loyalty":
      return "Retention lift; partner-funded perk reduces our cost of love.";
    case "sponsorship":
      return "Direct 6-7 figure sponsor revenue; brand halo for premium tier.";
    case "b2b_sales":
      return "ARR uplift via corporate SaaS / white-label deals.";
    case "pricing":
      return "Margin lift / ARPU uplift with quantified churn risk.";
    case "aviation":
      return "Broker margin on high-ticket inventory; cross-sell into concierge.";
    case "happiness":
      return "NPS lift, churn reduction, lifetime value protection.";
    default:
      return "Revenue / retention impact.";
  }
}

// ─── Main handler ─────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  let runId: string | null = null;
  const t0 = Date.now();

  try {
    const body = await req.json().catch(() => ({}));
    const director = (body.director as Director) ?? "events";
    const runAll = body.all === true;
    const trigger = body.trigger ?? "manual";
    const scope = body.scope ?? "sweep";

    // Run ALL directors sequentially (used by daily cron)
    if (runAll) {
      const results: Record<string, unknown> = {};
      for (const d of ALL_DIRECTORS) {
        try {
          const r = await runOne(d, trigger, scope);
          results[d] = r;
        } catch (e) {
          results[d] = { ok: false, error: String(e).slice(0, 300) };
        }
      }
      return new Response(JSON.stringify({ ok: true, mode: "all", results }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!ALL_DIRECTORS.includes(director)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid director" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await runOne(director, trigger, scope);
    return new Response(JSON.stringify(result), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-ai-directors fatal:", err);
    if (runId) {
      await admin.from("admin_ai_director_runs").update({
        status: "failed",
        error: String(err).slice(0, 500),
        completed_at: new Date().toISOString(),
        latency_ms: Date.now() - t0,
      }).eq("id", runId);
    }
    return new Response(JSON.stringify({ ok: false, error: String(err).slice(0, 500) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function runOne(director: Director, trigger: string, scope: string) {
  const t0 = Date.now();
  const { data: runRow, error: runErr } = await admin
    .from("admin_ai_director_runs")
    .insert({ director, trigger, status: "running", scope, model: MODEL })
    .select("id")
    .single();

  if (runErr || !runRow) {
    return { ok: false, error: "Could not start run", details: runErr?.message };
  }
  const runId = runRow.id;

  let aiOut;
  try {
    aiOut = await sourceWithAI(director, scope);
  } catch (aiErr) {
    await admin.from("admin_ai_director_runs").update({
      status: "failed",
      error: String(aiErr).slice(0, 500),
      completed_at: new Date().toISOString(),
      latency_ms: Date.now() - t0,
    }).eq("id", runId);
    return { ok: false, run_id: runId, director, error: String(aiErr).slice(0, 300) };
  }

  const counts = await persist(director, runId, aiOut.opportunities);

  await admin.from("admin_ai_director_runs").update({
    status: "completed",
    completed_at: new Date().toISOString(),
    latency_ms: aiOut.latency,
    input_tokens: aiOut.input_tokens,
    output_tokens: aiOut.output_tokens,
    opportunities_created: counts.opportunities_created,
    sponsor_packages_created: counts.sponsor_packages_created,
    pushed_recommendations: counts.pushed_recommendations,
  }).eq("id", runId);

  return { ok: true, run_id: runId, director, ...counts };
}
