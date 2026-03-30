import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, messages, deviceId } = await req.json();

    if (!messages || messages.length < 6) {
      return new Response(
        JSON.stringify({ summary: null, reason: 'Not enough messages to compress' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("Service configuration error");

    const startTime = Date.now();

    // Take older messages (keep last 4 as-is for immediate context)
    const messagesToCompress = messages.slice(0, -4);
    const conversationText = messagesToCompress
      .map((m: any) => `${m.role}: ${m.content}`)
      .join('\n')
      .slice(0, 8000);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a conversation compression engine. Summarize the conversation into a CONCISE briefing that captures:
1. Key topics discussed
2. Decisions made
3. User preferences revealed
4. Action items or recommendations given
5. Any unresolved questions

Rules:
- Maximum 300 words
- Use bullet points
- Preserve specific details (names, dates, prices, locations)
- Mark unresolved items with [PENDING]
- This summary replaces the original messages, so nothing important can be lost`
          },
          { role: "user", content: `Compress this conversation:\n\n${conversationText}` }
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI error:", response.status, errText);
      return new Response(
        JSON.stringify({ summary: null, error: 'AI compression failed' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || '';
    const latencyMs = Date.now() - startTime;

    // Store summary in Supabase
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && summary) {
      const headers = {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      };

      // Store summary
      await fetch(`${SUPABASE_URL}/rest/v1/conversation_summaries`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          conversation_id: conversationId,
          summary,
          messages_summarized: messagesToCompress.length,
        }),
      });

      // Log usage
      if (deviceId) {
        await fetch(`${SUPABASE_URL}/rest/v1/rpc/log_ai_usage`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            p_device_id: deviceId,
            p_function_name: 'conversation-compress',
            p_model: 'gemini-3-flash',
            p_latency_ms: latencyMs,
          }),
        });
      }
    }

    return new Response(
      JSON.stringify({
        summary,
        messagesCompressed: messagesToCompress.length,
        messagesKept: messages.length - messagesToCompress.length,
        latencyMs,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Compression error:", error);
    return new Response(
      JSON.stringify({ error: "Service unavailable", summary: null }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
