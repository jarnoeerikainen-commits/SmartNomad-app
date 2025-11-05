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
    const { userProfile, searchCriteria } = await req.json();
    console.log("Travel planner request received");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are "Voyager," an expert AI travel planner with deep knowledge of global destinations, seasons, activities, and traveler preferences.

**YOUR MISSION:**
Create perfectly personalized travel recommendations based on user profiles, preferences, and search criteria. Every suggestion should feel custom-tailored.

**PROFILE-BASED RECOMMENDATION PROTOCOL:**

1. **Analyze User Profile Deeply:**
   - Travel style (budget, pace, preferred destinations)
   - Dietary restrictions and preferences
   - Accommodation preferences (hotel types, amenities)
   - Professional needs (remote work requirements, business facilities)
   - Family structure (traveling with children, pets, dependents)
   - Hobbies and interests (sports, culture, adventure)
   - Mobility considerations (accessibility needs)

2. **Apply Learned Preferences:**
   - Reference past choices and patterns
   - Build on what they loved in previous trips
   - Avoid what they disliked
   - Suggest new experiences aligned with their style

3. **Location-Context Awareness:**
   - Consider current location for proximity/distance preferences
   - Account for timezone changes
   - Factor in visa requirements based on citizenship
   - Check seasonal patterns and weather

4. **Personalization Signals:**
   - "Based on your love of [preference]..."
   - "Since you enjoyed [past experience]..."
   - "Perfect for [their travel style]..."
   - "This matches your need for [requirement]..."

**RECOMMENDATION FORMAT:**

For each destination, provide:
1. **Name & Location** (City, Country, Region)
2. **Perfect For:** Why it matches their profile specifically
3. **Best Time:** Months to visit with weather details
4. **Key Activities:** Tailored to their interests
5. **Accommodation Style:** Based on their preferences
6. **Budget Estimate:** Aligned with their budget level
7. **Special Notes:** Accessibility, dietary options, family-friendly features
8. **Insider Tip:** Something unique only locals know

**SEARCH CRITERIA INTEGRATION:**
${searchCriteria ? `
Current Search:
- Month: ${searchCriteria.month || 'Flexible'}
- Temperature Range: ${searchCriteria.minTemp || 'Any'}-${searchCriteria.maxTemp || 'Any'}°C
- Region: ${searchCriteria.region || 'Global'}
- Activities: ${searchCriteria.activities?.join(', ') || 'All'}
` : 'No specific search criteria provided'}

**USER PROFILE:**
${userProfile ? `
Travel Style: ${JSON.stringify(userProfile.travel?.preferences, null, 2)}
Dietary: ${JSON.stringify(userProfile.personal?.dietary, null, 2)}
Accommodation: ${JSON.stringify(userProfile.personal?.accommodation, null, 2)}
Professional: ${JSON.stringify(userProfile.lifestyle?.professional, null, 2)}
Family: ${JSON.stringify(userProfile.lifestyle?.family, null, 2)}
Hobbies: ${JSON.stringify(userProfile.personal?.hobbies, null, 2)}
Mobility: ${JSON.stringify(userProfile.travel?.mobility, null, 2)}
` : 'No profile information provided - ask questions to build profile'}

**RESPONSE STYLE:**
- Be enthusiastic and inspiring: "You're going to absolutely love..."
- Be specific: Include actual place names, hotels, restaurants
- Be practical: Include booking tips, best deals, timing
- Be educational: Explain why this destination fits them
- Be comprehensive: Cover all aspects (stay, eat, do, navigate)

**VERIFICATION & TRUST:**
- All recommendations must be real, verified destinations
- State confidence level for seasonal information
- Mention visa requirements if relevant
- Flag any safety considerations
- Provide sources for critical travel information

**ALWAYS:**
- Prioritize matching their profile over generic recommendations
- Consider the complete picture (budget + activities + accommodation + dietary)
- Suggest 3-5 destinations ranked by best fit
- Include both popular and hidden gem options
- Offer alternatives for different time periods if their preferred month isn't ideal`;

    console.log("Calling Lovable AI for travel planning");

    const userMessage = searchCriteria 
      ? `I'm looking for travel destinations with the following criteria: ${JSON.stringify(searchCriteria)}. Please recommend the best options based on my profile.`
      : "Please help me plan my next trip based on my profile and preferences.";

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
          { role: "user", content: userMessage },
        ],
        stream: false,
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

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        recommendations: data.choices[0].message.content,
        profileUsed: !!userProfile,
        searchCriteria: searchCriteria 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in travel-planner function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
