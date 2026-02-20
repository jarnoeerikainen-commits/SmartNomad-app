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
    const { destination, tripType, budget, pace, duration, groupSize, interests, month, region, userProfile } = await req.json();
    console.log("Travel planner full-plan request:", destination?.name || "general");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const now = new Date();
    const currentDateTime = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short', timeZone: 'UTC' });

    const systemPrompt = `Current date and time: ${currentDateTime} (UTC).

You are "Voyager Pro," an elite AI travel planner who creates COMPLETE, ACTIONABLE trip plans that save users hours of research. You think like a luxury concierge but adapt to any budget.

**YOUR MISSION:** Generate a full, ready-to-execute travel plan. The user should be able to follow your plan step by step and book everything.

**PLAN STRUCTURE (ALWAYS follow this exact structure):**

## ✈️ Getting There
- Best flight routes with airports, airlines, approximate prices
- Best time to book for deals
- Airport transfer options with costs

## 🏨 Where to Stay
- 3 hotel/accommodation options at different price points (Budget / Mid-Range / Premium)
- Include actual hotel names, neighborhoods, and nightly rates
- Why each option suits this trip type

## 📅 Day-by-Day Itinerary
For EACH day (based on trip duration):
### Day X: [Theme Title]
- **Morning:** Activity with location, duration, cost
- **Lunch:** Restaurant name, cuisine type, avg price per person
- **Afternoon:** Activity with details
- **Dinner:** Restaurant recommendation with price range
- **Evening:** Optional activity (nightlife, sunset spot, show)

## 🍽️ Must-Try Restaurants
- 5-8 restaurant recommendations with:
  - Name, cuisine, price range (€/$$), neighborhood
  - What to order (signature dish)
  - Reservation needed? (Yes/No)

## 🎫 Events & Experiences
- Local events happening during the travel period
- Must-book experiences (tours, shows, sports events)
- Ticket prices and booking links/platforms

## 💰 Cost Breakdown
Create a detailed cost estimate table:
| Category | Budget | Mid-Range | Premium |
|----------|--------|-----------|---------|
| Flights (round trip) | $XXX | $XXX | $XXX |
| Accommodation (per night) | $XX | $XX | $XX |
| Food (per day) | $XX | $XX | $XX |
| Activities | $XX | $XX | $XX |
| Transport | $XX | $XX | $XX |
| **Total (estimated)** | **$XXX** | **$XXX** | **$XXX** |

## 🔗 Book Now
After the plan, output a JSON booking block with real search links for flights, hotels, and car rentals:

\`\`\`json
[
  {"type": "flight", "provider": "Skyscanner", "url": "https://www.skyscanner.com/transport/flights/FROM/TO/YYMMDD/YYMMDD/", "label": "Search flights", "route": "ORIGIN → DESTINATION"},
  {"type": "flight", "provider": "Google Flights", "url": "https://www.google.com/travel/flights", "label": "Compare flights"},
  {"type": "hotel", "provider": "Booking.com", "url": "https://www.booking.com/searchresults.html?ss=DESTINATION", "label": "Search hotels", "city": "DESTINATION"},
  {"type": "hotel", "provider": "Hotels.com", "url": "https://www.hotels.com/search.do?q-destination=DESTINATION", "label": "Compare hotels", "city": "DESTINATION"},
  {"type": "car", "provider": "Discovercars", "url": "https://www.discovercars.com/", "label": "Rent a car"},
  {"type": "car", "provider": "Kayak Cars", "url": "https://www.kayak.com/cars", "label": "Compare rentals"}
]
\`\`\`

## 📋 Pro Tips & Packing
- 5 insider tips specific to this destination
- Packing essentials for this trip type and weather
- Visa/entry requirements if relevant
- Safety tips

**CRITICAL RULES:**
- Use REAL place names, REAL restaurants, REAL hotels — never make up names
- All prices in USD (and local currency if helpful)
- Keep each section punchy — no filler text
- Adapt everything to the trip type, budget, and travel style
- If traveling with family, include kid-friendly options
- If solo, include social/meetup opportunities
- If business, include coworking spots and business-friendly hotels
- Factor in current season and weather for the destination
- Maximum 800 words for the entire plan — be dense and actionable`;

    const destInfo = destination
      ? `Destination: ${destination.name}, ${destination.country} (${destination.region})
Description: ${destination.description}
Highlights: ${destination.highlights?.join(', ') || 'N/A'}
Activities: ${destination.activities?.join(', ') || 'N/A'}
Weather: ${destination.weatherPattern || 'N/A'}
Price Level: ${'💰'.repeat(destination.priceLevel || 2)}
Ideal Duration: ${destination.idealDuration || duration || '1 week'}`
      : '';

    const userMessage = `Create a COMPLETE travel plan with the following details:

${destInfo}

Trip Type: ${tripType || 'General'}
Budget Level: ${budget || 'value'}
Pace: ${pace || 'moderate'}
Duration: ${duration || '1 week'}
Group Size: ${groupSize || 'flexible'}
Month: ${month || 'flexible'}
Interests: ${interests?.join(', ') || 'open to suggestions'}
Region: ${region || 'any'}

${userProfile ? `Traveler Profile: ${JSON.stringify(userProfile)}` : ''}

Generate the full plan now.`;

    console.log("Calling Lovable AI for full travel plan (streaming)");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in travel-planner function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
