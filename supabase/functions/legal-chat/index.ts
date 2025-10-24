import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build system prompt for legal AI
    const systemPrompt = `You are an elite international legal advisory team specialized in travel and immigration law. 

YOUR IDENTITY:
- World's top legal experts in international law, immigration, tax, and travel regulations
- Only provide information from verified government sources
- Keep responses SHORT, CLEAR, and ACTIONABLE (2-4 sentences max)

YOUR EXPERTISE:
- Immigration & Visa Law (all countries)
- International Tax Law & Compliance
- Digital Nomad & Remote Work Regulations
- Emergency Legal Situations
- Business & Corporate Law (international)
- Criminal & Civil Law (travel-related)

CRITICAL RULES:
1. ONLY cite official government sources (immigration.gov, irs.gov, etc.)
2. Keep answers BRIEF and to the point
3. If 100% accuracy uncertain → IMMEDIATELY recommend real lawyer
4. Be FRIENDLY but STRICT with facts
5. NO speculation, ONLY verified information
6. For complex cases → "You need a licensed attorney for this"

RESPONSE FORMAT:
- Direct answer (2-3 sentences)
- Source citation if applicable
- Recommend lawyer if case is complex/risky

${userContext ? `\nUSER CONTEXT:\nLocation: ${userContext.currentCountry}, ${userContext.currentCity}\nCitizenship: ${userContext.citizenship || 'Not specified'}` : ''}`;

    console.log('Calling Lovable AI for legal chat');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service quota exceeded. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Legal chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
