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
    const { action, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const now = new Date();
    const currentDateTime = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short', timeZone: 'UTC' });

    // Handle AI Pricing
    if (action === 'pricing') {
      const { category, condition, title, description, originalPrice, location } = data;

      const pricingPrompt = `You are an AI pricing expert for secondhand marketplace items. Analyze this item and suggest an optimal price.

Item Details:
- Category: ${category}
- Condition: ${condition}
- Title: ${title}
- Description: ${description || 'Not provided'}
- Original Price: ${originalPrice ? '€' + originalPrice : 'Unknown'}
- Location: ${location}

Provide a JSON response with:
{
  "suggestedPrice": <number>,
  "confidence": <0-100>,
  "reasoning": "<brief explanation>",
  "marketDemand": "<low|medium|high>"
}

Consider: condition depreciation, local market demand, category popularity, and urgency factors.`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: `Current date: ${currentDateTime} (UTC). You are an expert marketplace pricing AI. Always respond with valid JSON only.` },
            { role: 'user', content: pricingPrompt }
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: 'Payment required' }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        throw new Error('AI service error');
      }

      const aiData = await response.json();
      const content = aiData.choices[0].message.content;
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const pricingResult = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        suggestedPrice: originalPrice ? Math.round(originalPrice * 0.6) : 100,
        confidence: 70,
        reasoning: 'Estimated based on typical depreciation',
        marketDemand: 'medium'
      };

      return new Response(JSON.stringify(pricingResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle AI Description
    if (action === 'description') {
      const { category, condition, title, features } = data;

      const descriptionPrompt = `Create a professional, compelling product description for a secondhand marketplace listing.

Item Details:
- Category: ${category}
- Condition: ${condition}
- Title: ${title}
- Features: ${features?.join(', ') || 'None specified'}

Write a description that:
1. Highlights key features and benefits
2. Is honest about condition
3. Creates urgency for buyers
4. Is 2-3 sentences, professional but friendly
5. Includes practical details

Provide JSON:
{
  "description": "<your description>",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "highlights": ["highlight1", "highlight2"]
}`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: `Current date: ${currentDateTime} (UTC). You are an expert copywriter for marketplace listings. Always respond with valid JSON only.` },
            { role: 'user', content: descriptionPrompt }
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: 'Payment required' }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        throw new Error('AI service error');
      }

      const aiData = await response.json();
      const content = aiData.choices[0].message.content;
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const descriptionResult = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        description: `${title} in ${condition} condition. Perfect for ${category} needs.`,
        suggestedTags: [category, condition],
        highlights: ['Good condition', 'Ready to use']
      };

      return new Response(JSON.stringify(descriptionResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Marketplace AI error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
