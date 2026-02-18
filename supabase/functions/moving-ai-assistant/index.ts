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
    const { action, rooms, moveRequest } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const now = new Date();
    const currentDateTime = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short', timeZone: 'UTC' });

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'assess-inventory') {
      systemPrompt = `Current date: ${currentDateTime} (UTC). You are an expert moving consultant. Analyze room inventories and provide accurate estimates for boxes, weight, and container sizes for international moves.`;
      
      userPrompt = `Analyze these rooms and provide estimates:
${JSON.stringify(rooms, null, 2)}

Provide:
1. Total estimated boxes needed
2. Total estimated weight in kg
3. Recommended container size (20ft, 40ft, LCL, or air)
4. Suggested additional services
5. Estimated timeline

Respond in JSON format with: estimatedBoxes, estimatedWeight, recommendedContainer, suggestedServices (array), timeline (string), warnings (array)`;
    } else if (action === 'estimate-pricing') {
      systemPrompt = `Current date: ${currentDateTime} (UTC). You are a moving cost estimation expert. Provide realistic cost estimates for international and local moves based on route, inventory, and services.`;
      
      userPrompt = `Estimate moving costs for:
Route: ${moveRequest.route?.from?.city}, ${moveRequest.route?.from?.country} → ${moveRequest.route?.to?.city}, ${moveRequest.route?.to?.country}
Type: ${moveRequest.type}
Inventory: ${moveRequest.inventory?.totalBoxes || 0} boxes, ${moveRequest.inventory?.estimatedWeight || 0}kg
Services requested: ${JSON.stringify(moveRequest.services)}

Provide realistic cost estimate with min/max range and breakdown by: shipping, packing, insurance, customs, storage.
Respond in JSON format.`;
    }

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Try to parse JSON response
    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch {
      // If not JSON, return structured fallback
      if (action === 'assess-inventory') {
        const totalBoxes = rooms.reduce((sum: number, room: any) => sum + (room.estimatedBoxes || 10), 0);
        result = {
          estimatedBoxes: totalBoxes,
          estimatedWeight: totalBoxes * 15, // Rough estimate: 15kg per box
          recommendedContainer: totalBoxes > 60 ? '40ft' : totalBoxes > 30 ? '20ft' : 'LCL',
          suggestedServices: ['Professional packing', 'Insurance', 'Customs clearance'],
          timeline: '4-8 weeks for international shipping',
          warnings: ['Consider insurance for valuable items', 'Start packing 4-6 weeks before move date']
        };
      } else {
        result = {
          costEstimate: {
            min: 4000,
            max: 8000,
            confidence: 0.75
          },
          breakdown: {
            shipping: 3000,
            packing: 800,
            insurance: 500,
            customs: 700
          }
        };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Moving AI assistant error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
