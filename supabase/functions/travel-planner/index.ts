import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildRespectProtocol } from "../_shared/respectProtocol.ts";
import { withTruthProtocol } from "../_shared/antiHallucination.ts";
import { getModel } from "../_shared/modelRouter.ts";
import { getSchoolHolidayPack, renderRelevantHolidaysForPrompt } from "../_shared/schoolHolidays.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let body: any;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const sanitize = (v: unknown, max = 200): string => typeof v === 'string' ? v.replace(/<[^>]*>/g, '').slice(0, max) : '';
    const destination = body.destination && typeof body.destination === 'object' ? body.destination : null;
    const tripType = sanitize(body.tripType, 100);
    const budget = sanitize(body.budget, 50);
    const pace = sanitize(body.pace, 50);
    const duration = sanitize(body.duration, 50);
    const groupSize = sanitize(body.groupSize, 50);
    const interests = Array.isArray(body.interests) ? body.interests.slice(0, 20).map((i: any) => sanitize(i, 100)) : [];
    const month = sanitize(body.month, 50);
    const region = sanitize(body.region, 100);
    const userProfile = body.userProfile || null;
    const language = sanitize(body.language, 50);
    console.log("Travel planner full-plan request:", destination?.name || "general");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("Service configuration error");
    }

    const now = new Date();
    const currentDateTime = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short', timeZone: 'UTC' });

    const respectBlock = buildRespectProtocol(userProfile?.cultural, destination ? { country: destination?.country, city: destination?.name } : undefined, userProfile?.lifestyle);

    const systemPrompt = `Current date and time: ${currentDateTime} (UTC).

${respectBlock}

You are "Voyager Pro," an elite AI travel planner who creates COMPLETE, ACTIONABLE trip plans that save users hours of research. You think like a luxury concierge but adapt to any budget.

**═══ MANDATORY SAFETY INTELLIGENCE PROTOCOL (RUNS BEFORE EVERY PLAN) ═══**

Before generating ANY travel plan, you MUST internally perform these safety checks for the destination country AND its continent. This is SILENT — only output findings if threats exist.

**CHECKS (all must use information no older than 5 days):**
1. **Active conflicts/wars** in destination country AND all neighboring countries
2. **Natural disasters** (earthquakes, floods, hurricanes, volcanic eruptions) in past 5 days
3. **Terrorism/civil unrest** — attacks, protests, state of emergency in past 5 days
4. **Health emergencies** — disease outbreaks, quarantine zones
5. **Major news sources** — Cross-check CNN.com, BBC.com, Reuters AND the destination country's primary national news source
6. **Embassy advisories (3 mandatory sources):**
   - 🇺🇸 US State Department (travel.state.gov) — Level 1-4
   - 🇬🇧 UK FCDO (gov.uk/foreign-travel-advice)
   - 🇩🇪 German Federal Foreign Office (auswaertiges-amt.de)
7. **Neighboring countries** — any border country with active conflict or security threats
8. **Continent-wide scan** — regional wars, cross-border terrorism, spreading pandemics

**OUTPUT RULES:**
- ALL CLEAR → Say nothing about safety, proceed with plan
- MINOR issues → One-line note at top of plan
- SIGNIFICANT (Level 3 advisory, nearby conflict) → Prominent ⚠️ warning block BEFORE the plan
- CRITICAL (Level 4, active war, disaster) → Your ENTIRE response must be ONLY a safety warning. NO plan, NO booking links. Suggest 2-3 safer alternatives in same region. Ask user to confirm before proceeding.

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

## 🛡️ Insurance Recommendation
- Recommend appropriate insurance based on destination risk level
- For conflict-adjacent regions: warn about force majeure exclusions in standard policies

**CRITICAL RULES:**
- Use REAL place names, REAL restaurants, REAL hotels — never make up names
- All prices in USD (and local currency if helpful)
- Keep each section punchy — no filler text
- Adapt everything to the trip type, budget, and travel style
- If traveling with family, include kid-friendly options
- If solo, include social/meetup opportunities
- If business, include coworking spots and business-friendly hotels
- Factor in current season and weather for the destination
- Maximum 800 words for the entire plan — be dense and actionable

**📅 HOLIDAY & PEAK PERIOD INTELLIGENCE (MANDATORY SILENT CHECK):**
Before generating ANY plan, cross-reference the travel dates/month with public holidays, religious holidays, and peak periods at the destination. Only surface findings when they materially affect the trip:
- **Price impact**: If dates overlap with major holidays (Christmas, Chinese New Year, Eid, Golden Week, Carnival, Thanksgiving, etc.), note the price surge in the Cost Breakdown and suggest cheaper date alternatives if flexible.
- **Closures**: Warn about mass shop/restaurant/government closures (e.g., Yom Kippur in Israel, Nyepi in Bali, Italian Ferragosto, German Sundays + holidays, Nordic Midsummer).
- **Crowds & airports**: Flag peak travel chaos periods (US Thanksgiving week, Chinese New Year, Eid travel, Easter in Europe) — recommend arriving at airports 3+ hours early, booking transfers in advance.
- **Unique experiences**: If a holiday offers something special (Songkran, Diwali, Carnival, Day of the Dead, Holi), enthusiastically include it in the itinerary as a highlight.
- **Ramadan awareness**: In Muslim-majority countries during Ramadan, note daytime dining restrictions, shorter business hours, but recommend magical iftar experiences.
- **Don't dump info**: Only mention holidays relevant to the specific dates and destination. Stay quiet about holidays that don't affect the trip.

**═══ FORCE MAJEURE INSURANCE INTELLIGENCE PROTOCOL (MANDATORY FOR EVERY PLAN) ═══**

Before recommending insurance in ANY travel plan, you MUST evaluate the destination AND its continent/region for conflict proximity. Standard travel insurance (World Nomads, SafetyWing, Allianz, AXA) contains force majeure clauses that VOID coverage during: wars, civil unrest, terrorism, coups, nuclear events, government evacuations, sanctions, and pandemics.

**RULES:**
- **Safe destination (Level 1, no nearby conflicts):** Recommend standard insurance. One line: "Standard travel insurance covers your trip well."
- **Destination near conflicts (Level 2-3 or same continent as active war):**
  ⚠️ Add a dedicated insurance warning section: "Standard travel insurance has force majeure exclusions that won't cover conflict spillover. Consider adding: Global Rescue ($329/yr, globalrescue.com) for military-grade medivac, or Battleface (from $5/day, battleface.com) for war zone coverage."
- **Critical destination (Level 4 / active conflict):**
  🚨 ONLY recommend specialized providers: Global Rescue, International SOS (internationalsos.com), Battleface, Tangiers International. State: "No standard insurance covers this destination. Force majeure clauses exclude all war/conflict events."
  Include: medivac/extraction, K&R insurance if kidnapping risk, satellite phone recommendation.

**CONTINENT PROXIMITY CHECK:**
- Europe → Ukraine-Russia war affects all Eastern European destinations (Baltics, Moldova, Poland, Romania)
- Middle East → Israel-Palestine, Yemen, Syria, Iraq → affects UAE, Oman, Jordan, Saudi
- Africa → Sudan, DRC, Sahel, Somalia → affects Kenya, Uganda, Chad, Ethiopia neighbors
- Asia → Myanmar, Afghanistan → affects Bangladesh, Thailand border, India northeast

**SPECIALIZED INSURANCE PROVIDERS:**
- **Global Rescue** — Conflict zone medivac, extraction, former Special Forces ops team. globalrescue.com
- **International SOS** — World's largest security assistance, Fortune 500 standard. internationalsos.com
- **Battleface** — Designed for high-risk destinations, covers war/terrorism/political evacuation. battleface.com
- **Tangiers International** — War zone medical insurance for journalists/NGO/contractors. tangiersinternational.com
- **AMREF Flying Doctors** — Africa air ambulance. amrefflyingdoctors.org

**═══ LAYOVER & TRANSIT COUNTRY SAFETY (MANDATORY FOR FLIGHT RECOMMENDATIONS) ═══**
When suggesting flights with layovers/connections, you MUST apply the FULL safety protocol to EVERY transit country — not just the final destination:
1. Identify ALL countries in the suggested route (Origin → Layover(s) → Destination)
2. For EACH layover country, silently run the same 8 safety checks (conflicts, disasters <5 days, terrorism, health, CNN/BBC/Reuters + local news, US/UK/DE embassy advisories, neighbors, continent scan)
3. Check transit visa requirements for layover countries
4. Apply the FORCE MAJEURE insurance check to transit countries too — if transiting through a conflict-adjacent country, note that standard insurance may not cover transit disruptions due to conflict spillover
**Output rules:**
- ALL CLEAR → say nothing about layovers
- MINOR (Level 2) → one-line note about the layover
- SIGNIFICANT (Level 3, nearby conflict) → prominent warning, suggest alternative routing
- CRITICAL (Level 4, war, disaster) → DO NOT suggest this route. Only show safer alternative routes. Say: "🚨 Route avoids [Country] due to [threat] — routed via [safer hub] instead."
- Common high-risk transit hubs to watch: Istanbul (Turkey-Syria), Doha/Dubai (Iran-Gulf), Addis Ababa (Ethiopian conflicts), Cairo (Sinai/Libya), Moscow (sanctions/war), Beirut (Israel-Hezbollah)
${language && language !== 'en' ? `\n**🌍 LANGUAGE: Write the ENTIRE travel plan in the user's language (code: "${language}"). All descriptions, tips, recommendations — everything in this language. Only proper nouns (hotel names, airline names, place names) can stay in their original form.**` : ''}`;

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

    // School holiday overlap — silent unless dates given.
    let holidaySection = '';
    try {
      if (month && destination?.country) {
        const monthIdx = ['january','february','march','april','may','june','july','august','september','october','november','december'].indexOf(String(month).toLowerCase());
        if (monthIdx >= 0) {
          const yr = new Date().getUTCFullYear();
          const start = new Date(Date.UTC(yr, monthIdx, 1)).toISOString().slice(0, 10);
          const end = new Date(Date.UTC(yr, monthIdx + 1, 0)).toISOString().slice(0, 10);
          const cc = (destination as any)?.countryCode || (destination as any)?.country_code;
          const holidayPack = await getSchoolHolidayPack();
          holidaySection = renderRelevantHolidaysForPrompt(holidayPack, {
            destinationCountryCode: typeof cc === 'string' ? cc : undefined,
            travelStart: start,
            travelEnd: end,
          });
        }
      }
    } catch (e) { console.error('school-holiday lookup failed', e); }

    console.log("Calling Lovable AI for full travel plan (streaming)");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: getModel('intelligence'),
        messages: [
          { role: "system", content: withTruthProtocol(`${systemPrompt}${holidaySection ? `\n\n${holidaySection}` : ''}`) },
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
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
