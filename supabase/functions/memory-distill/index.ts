import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function generateEmbedding(text: string, apiKey: string): Promise<number[] | null> {
  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text.slice(0, 500),
        dimensions: 384,
      }),
    });

    if (!response.ok) {
      console.error("Embedding API error:", response.status);
      return null;
    }

    const data = await response.json();
    return data?.data?.[0]?.embedding || null;
  } catch (e) {
    console.error("Embedding generation failed:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, deviceId, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length < 2) {
      return new Response(
        JSON.stringify({ facts: [], stored: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("Service configuration error");

    const userMessages = messages
      .filter((m: any) => m.role === 'user')
      .map((m: any) => m.content)
      .join('\n');

    if (userMessages.length < 20) {
      return new Response(
        JSON.stringify({ facts: [], stored: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a Memory Distillation Engine. Analyze the user's messages and extract DURABLE personal preferences and facts that would help a travel concierge serve them better in future conversations.

RULES:
- Extract ONLY facts that are likely to remain true over time (preferences, allergies, family info, travel style, etc.)
- Do NOT extract transient information (specific trip dates, temporary plans)
- Each fact should be a concise, standalone statement
- Categorize each fact into: travel, food, accommodation, transport, health, work, family, finance, lifestyle, general
- Rate confidence from 0.5 to 1.0 based on how clearly stated the preference was
- Return EMPTY array if no durable facts are found — don't force extraction
- Maximum 5 facts per analysis

Respond using the extract_memories tool.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze these user messages for durable preferences:\n\n${userMessages.slice(0, 3000)}` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "extract_memories",
            description: "Extract durable user preferences from conversation",
            parameters: {
              type: "object",
              properties: {
                facts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      fact: { type: "string", description: "A concise statement of the preference or fact" },
                      category: { type: "string", enum: ["travel", "food", "accommodation", "transport", "health", "work", "family", "finance", "lifestyle", "general"] },
                      confidence: { type: "number", description: "Confidence 0.5-1.0" }
                    },
                    required: ["fact", "category", "confidence"],
                    additionalProperties: false
                  }
                }
              },
              required: ["facts"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "extract_memories" } }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ facts: [], stored: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    let facts: any[] = [];

    try {
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        facts = parsed.facts || [];
      }
    } catch (e) {
      console.error("Failed to parse tool call:", e);
    }

    // Store facts with vector embeddings in Supabase
    if (facts.length > 0 && deviceId) {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const headers = {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
        };

        // Ensure device session exists
        await fetch(`${SUPABASE_URL}/rest/v1/device_sessions`, {
          method: 'POST',
          headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify({ device_id: deviceId, last_seen_at: new Date().toISOString() }),
        });

        // Generate embeddings for each fact in parallel
        const embeddingPromises = facts.map((f: any) =>
          generateEmbedding(`${f.category}: ${f.fact}`, LOVABLE_API_KEY)
        );
        const embeddings = await Promise.all(embeddingPromises);

        const insertPayload = facts.map((f: any, i: number) => ({
          device_id: deviceId,
          fact: f.fact,
          category: f.category,
          confidence: Math.min(1, Math.max(0.5, f.confidence || 0.8)),
          durability: 'durable',
          source_conversation_id: conversationId || null,
          embedding: embeddings[i] ? `[${embeddings[i]!.join(',')}]` : null,
        }));

        const insertResp = await fetch(`${SUPABASE_URL}/rest/v1/ai_memories`, {
          method: 'POST',
          headers: {
            ...headers,
            'Prefer': 'resolution=ignore-duplicates',
          },
          body: JSON.stringify(insertPayload),
        });

        if (!insertResp.ok) {
          console.error("Failed to store memories:", await insertResp.text());
        } else {
          console.log(`Stored ${facts.length} memories with embeddings for device ${deviceId}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ facts, stored: facts.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Memory distill error:", error);
    return new Response(
      JSON.stringify({ error: "Service unavailable", facts: [], stored: 0 }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
