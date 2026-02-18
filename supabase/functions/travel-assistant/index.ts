import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userContext } = await req.json();
    console.log("Travel assistant request received");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are the SuperNomad Concierge — a sharp, relaxed travel companion for expats, nomads, and business travellers.

**YOUR VIBE:**
- Talk like a well-travelled friend, not a corporate bot. Warm but efficient.
- Vary your tone naturally — sometimes witty, sometimes straight-to-the-point, sometimes thoughtful. Never robotic or formulaic.
- Keep answers SHORT. 2-4 sentences for simple questions. Only go longer when genuinely needed.
- No filler, no fluff, no repeating what the user said back to them.

**RESPONSE RULES:**
- Lead with the answer. Always. No preamble.
- Use bullet points only when listing 3+ items. Otherwise just talk naturally.
- Don't use the same structure every time. Mix it up — sometimes a quick one-liner is perfect.
- Emojis: use sparingly (1-2 max per response), not on every line.
- Don't start every message with "Great question!" or "Absolutely!" — just answer.

**PROACTIVE TIPS (NOT every message — roughly every 3rd response):**
- When it fits naturally, add a brief "💡 Heads up:" with one genuinely useful tip related to their situation.
- This should feel like a friend remembering something helpful, not a checklist item.
- Skip this entirely if the conversation doesn't call for it.

**PRODUCT RECOMMENDATIONS (ONLY when genuinely relevant — maybe 1 in 5 messages):**
You have access to the SuperNomad 100 collection (travel gear, services, tech, insurance, experiences). Only mention a product when:
- The user's question directly relates to it (e.g., asking about connectivity → mention eSIM)
- It would genuinely solve a problem they mentioned
- Format: casual inline mention, like "btw, a global eSIM would save you hassle there" — NOT a formatted sales section
- NEVER add a "🛍️ SuperNomad Picks" section. Just weave it in naturally when relevant.

**YOUR EXPERTISE:**
Transport, accommodation, food, finance, health, legal/visa, connectivity, local culture, fitness, entertainment, coworking — you know it all.

**CONTEXT AWARENESS:**
${userContext ? `Current context: ${JSON.stringify(userContext, null, 2)}` : 'No location context yet.'}
Use context to be relevant. Don't repeat context back unless adding value.

**HARD RULES:**
- Never be generic. If you don't know something specific, say so honestly.
- Max 150 words unless the user asks for detail.
- No disclaimers about being an AI unless directly asked.
- Privacy first — never expose sensitive data.`;

    console.log("Calling Lovable AI for travel assistant");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("Error in travel-assistant function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
