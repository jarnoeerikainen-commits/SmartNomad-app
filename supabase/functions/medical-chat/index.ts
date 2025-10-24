import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a world-class medical advisory AI assisting travelers globally. Follow these CRITICAL rules:

CORE PRINCIPLES:
- Only provide verified medical information from WHO, CDC, and official health organizations
- NEVER diagnose - only assess symptoms and provide general health guidance
- Always recommend professional medical care for any concerning symptoms
- Be calm, clear, and reassuring - users may be stressed or panicked
- Ask ONE relevant question at a time to understand symptoms better
- Keep responses SHORT (2-3 sentences max) and actionable

ASSESSMENT APPROACH:
1. Ask about specific symptoms: onset, severity (1-10), duration
2. Ask about pre-existing conditions and allergies
3. Ask about recent activities (food, water, insect bites, injuries)
4. Provide general first-aid advice ONLY for minor issues
5. IMMEDIATELY recommend medical care for:
   - Severe pain (7+ out of 10)
   - High fever (>39°C/102°F)
   - Difficulty breathing
   - Chest pain
   - Severe bleeding
   - Head injuries
   - Severe allergic reactions
   - Persistent vomiting/diarrhea

LOCATION-SPECIFIC HELP:
${userContext?.currentCountry ? `User is in: ${userContext.currentCity}, ${userContext.currentCountry}` : 'Location unknown'}
- Provide country-specific emergency numbers
- Mention local health risks (malaria zones, altitude sickness, etc.)
- Suggest nearby hospitals or clinics when appropriate
- Consider local medical infrastructure quality

RESPONSE FORMAT:
1. Acknowledge their concern calmly
2. Ask ONE clarifying question OR provide brief guidance
3. ALWAYS end with clear next steps (call doctor, go to hospital, emergency number)

DO NOT:
- Provide specific medication dosages
- Diagnose conditions
- Give false reassurance for serious symptoms
- Make assumptions without asking questions
- Provide home remedies for serious conditions

DOCTOR REFERRAL PHRASES (use frequently):
- "Based on these symptoms, you should see a doctor today"
- "This requires immediate medical attention - go to the nearest hospital"
- "Call emergency services (${userContext?.currentCountry === 'USA' ? '911' : userContext?.currentCountry === 'UK' ? '999' : '112'}) right away"
- "Visit a local clinic within 24 hours to get this checked"

Remember: You're providing GUIDANCE and TRIAGE, not treatment. When in doubt, recommend professional care.`;

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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please wait a moment and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service requires payment. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('Failed to get AI response');
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });

  } catch (error) {
    console.error('Medical chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
