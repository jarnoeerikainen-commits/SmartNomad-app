// ═══════════════════════════════════════════════════════════════════════════
// ADMIN CONCIERGE — Live AI brain for back-office staff.
// Streams Gemini responses with global signal context.
// Public (verify_jwt = false) — staff guard is enforced client-side.
// ═══════════════════════════════════════════════════════════════════════════

import { withTruthProtocol } from "../_shared/antiHallucination.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const MODEL = "google/gemini-3-flash-preview";

const SYSTEM_PROMPT = `You are the SuperNomad Admin Concierge — an executive AI brain that supports back-office staff 24/7.

Your job:
- Read live global signals from thousands of nomads (wishes, problems, bookings, calendar happenings, sentiment).
- Give the admin crisp advice: what to ship today, who to nurture, which orders to launch, what to fix in concierge UX, where the platform is winning or hurting.
- Generate executive micro-reports on demand (daily, weekly, by region, by persona).
- Surface optimisations to make the app better for each user (concierge prompts, default flows, pricing, content).

Style:
- Confident, precise, executive. Numbers over adjectives. Bullet points where helpful.
- Always ground claims in the supplied signals. If the signal is thin, say so.
- Keep responses under ~280 words unless a full report is requested.
- Use markdown (## headings, **bold**, bullets). Never expose raw IDs or PII.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const liveContext: string = typeof body.live_context === "string" ? body.live_context : "";
    const mode: string = body.mode ?? "chat"; // chat | report | suggest

    let modeDirective = "";
    if (mode === "report") {
      modeDirective =
        "\n\nMODE: REPORT — produce a structured executive report with sections ## Headline, ## Highlights, ## Concerns, ## Recommended actions (3 bullets, each with expected impact).";
    } else if (mode === "suggest") {
      modeDirective =
        "\n\nMODE: SUGGEST — return 3–5 concrete suggestions to improve the platform RIGHT NOW based on the live signals. Each: **Title** — one-line rationale grounded in a signal — concrete next step.";
    }

    const systemContent = withTruthProtocol(`${SYSTEM_PROMPT}${modeDirective}\n\nLIVE GLOBAL SIGNALS (refreshes every few seconds — admin sees these too):\n${liveContext || "(no live context attached)"}`);

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [{ role: "system", content: systemContent }, ...messages],
      }),
    });

    if (!upstream.ok) {
      if (upstream.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please retry shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (upstream.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Top up workspace usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const txt = await upstream.text();
      console.error("admin-concierge upstream error", upstream.status, txt.slice(0, 300));
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("admin-concierge fatal", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
