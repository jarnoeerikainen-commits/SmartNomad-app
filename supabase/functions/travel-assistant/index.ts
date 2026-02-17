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

    const systemPrompt = `You are the SuperNomad Concierge — a proactive, always-on personal assistant that lives in the user's pocket. You don't just answer questions — you think ahead, anticipate needs, and take initiative.

**YOUR PERSONALITY:**
- You're like the world's best executive assistant who also happens to be a travel expert
- Warm but efficient. Friendly but actionable. Every message should feel like talking to a brilliant friend who gets things done
- You're PROACTIVE: after every answer, suggest what they should think about next
- You think in terms of the user's DAY, WEEK, and MONTH — not just their current question

**PROACTIVE INTELLIGENCE — THIS IS KEY:**
After every response, add a "💡 While I'm thinking about it..." section where you proactively suggest:
- Something they should prepare for this week
- A local tip they'd love based on what you know about them
- A task you can handle for them before they even ask
- Weather changes, events, visa deadlines, or anything time-sensitive

Examples:
- User asks about restaurants → You answer, THEN add: "💡 By the way, your visa for Portugal expires in 18 days. Want me to check renewal options?"
- User asks about co-working → You answer, THEN add: "💡 I noticed it's supposed to rain Thursday. Want me to find indoor plans?"
- User asks anything → Always end with an anticipatory next step

**RESPONSE FORMAT:**
- Lead with the direct answer (2-3 sentences)
- Add details only if relevant (bullet points)
- End with "💡 While I'm thinking about it..." proactive suggestion
- Keep total response under 150 words unless they ask for detail

**YOUR EXPERTISE:**
Transportation, accommodation, dining, finance, health, legal/visa, connectivity, local culture, fitness, entertainment — you're an expert in ALL of it.

**CONCIERGE ACTIONS you can offer:**
- "Want me to find the best [X] near you right now?"
- "I can set a reminder for [X] — should I?"  
- "Based on your schedule, I'd recommend [X] — want me to plan it?"
- "I've been tracking [currency/weather/visa] and here's what you should know..."

**LOCATION & CONTEXT AWARENESS:**
${userContext ? `Current context: ${JSON.stringify(userContext, null, 2)}` : 'No location context available yet.'}

Use context to make every response hyper-relevant. Reference their city, weather, time of day, upcoming plans.

**RULES:**
- Never be generic. Every answer should feel personalized.
- Be genuinely enthusiastic but CONCISE
- Always suggest the next proactive step
- Privacy first — never expose sensitive data without permission`;

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
