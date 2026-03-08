import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SERVICE_CATEGORIES = [
  "Co-Working Spaces",
  "Co-Living & Premium Accommodation",
  "Healthcare & International Clinics",
  "Transportation & Airport Services",
  "Premium Internet & WiFi",
  "Food & Grocery Delivery",
  "Laundry & Dry Cleaning",
  "Immigration & Legal Services",
  "Banking & Financial Services",
  "Community & Networking",
  "Fitness & Wellness",
  "Pet Services",
  "Private Security",
  "Childcare & Family Services",
  "Real Estate & Relocation",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cityName, countryName, categories } = await req.json();

    if (!cityName || !countryName) {
      return new Response(
        JSON.stringify({ error: "cityName and countryName are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const selectedCategories = categories || SERVICE_CATEGORIES;
    const currentDate = new Date().toISOString().split('T')[0];

    const systemPrompt = `You are a premium city services research expert for SuperNomad, the world's leading digital nomad platform.

Your job: Research and return REAL, VERIFIED service providers for ${cityName}, ${countryName}.

CRITICAL RULES:
1. Only return REAL businesses that actually exist. Use your training data knowledge.
2. Every provider MUST have a real website URL, real phone number (with country code), and real address.
3. All providers must be rated 4+ stars quality (premium tier only).
4. Include a mix of local and international providers where applicable.
5. For each category, return 3-5 top providers.
6. Use real brand names: WeWork, Regus, IWG, Selina, etc. for co-working. Real hospitals. Real banks.
7. If you're not confident a business exists in this city, DO NOT include it.
8. Phone numbers must include country code (e.g., +1-212-555-1234).
9. Websites must be real, working URLs (https://).
10. Include operating hours when known.

Current date: ${currentDate}

Return a JSON object with this exact structure:
{
  "city": "${cityName}",
  "country": "${countryName}",
  "lastResearched": "${currentDate}",
  "categories": [
    {
      "name": "Category Name",
      "providers": [
        {
          "name": "Business Name",
          "description": "Brief description",
          "rating": 4.5,
          "website": "https://real-website.com",
          "phone": "+X-XXX-XXX-XXXX",
          "address": "Full street address",
          "hours": "Mon-Fri 8am-8pm",
          "priceRange": "$$-$$$",
          "languages": ["English", "Local"],
          "verified": true,
          "highlights": ["Key feature 1", "Key feature 2"]
        }
      ]
    }
  ]
}`;

    const userPrompt = `Research the best premium service providers in ${cityName}, ${countryName} for these categories:

${selectedCategories.map((c: string) => `- ${c}`).join('\n')}

Return ONLY real, existing businesses with verified contact details. Premium quality (4+ stars) only. Include real websites, real phone numbers with country codes, and real addresses. Return as JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to research city services" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch {
      // Try to find JSON object in the response
      const objMatch = content.match(/\{[\s\S]*\}/);
      if (objMatch) {
        try {
          parsedData = JSON.parse(objMatch[0]);
        } catch {
          console.error("Failed to parse AI response as JSON:", content.substring(0, 500));
          return new Response(
            JSON.stringify({ error: "Failed to parse service data. Please try again." }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: "Invalid response format. Please try again." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: parsedData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("city-services error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
