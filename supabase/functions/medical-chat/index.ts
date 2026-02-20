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

    const now = new Date();
    const currentDateTime = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short', timeZone: 'UTC' });

    const country = userContext?.currentCountry || '';
    const city = userContext?.currentCity || '';

    // Build emergency number lookup
    const emergencyNumbers: Record<string, { ambulance: string; general: string; poison: string }> = {
      'United States': { ambulance: '911', general: '911', poison: '1-800-222-1222' },
      'United Kingdom': { ambulance: '999', general: '999', poison: '0345 300 0135' },
      'Germany': { ambulance: '112', general: '112', poison: '030 19240' },
      'France': { ambulance: '15 (SAMU)', general: '112', poison: '01 40 05 48 48' },
      'Spain': { ambulance: '112', general: '112', poison: '915 620 420' },
      'Italy': { ambulance: '118', general: '112', poison: '06 3054343' },
      'Portugal': { ambulance: '112', general: '112', poison: '808 250 143' },
      'Thailand': { ambulance: '1669', general: '191', poison: '1323' },
      'Japan': { ambulance: '119', general: '110', poison: '029-852-9999' },
      'Australia': { ambulance: '000', general: '000', poison: '131 126' },
      'India': { ambulance: '102', general: '112', poison: '1800-11-6117' },
      'Brazil': { ambulance: '192', general: '190', poison: '0800-722-6001' },
      'UAE': { ambulance: '998', general: '999', poison: '800-424' },
      'Singapore': { ambulance: '995', general: '999', poison: '6423-9119' },
      'Mexico': { ambulance: '065', general: '911', poison: '800-990-9160' },
      'South Korea': { ambulance: '119', general: '112', poison: '1339' },
      'Turkey': { ambulance: '112', general: '112', poison: '114' },
      'Indonesia': { ambulance: '118', general: '112', poison: '021-4250767' },
      'Philippines': { ambulance: '911', general: '911', poison: '(02) 8524-1078' },
      'Vietnam': { ambulance: '115', general: '113', poison: '(04) 3869 3205' },
      'Cambodia': { ambulance: '119', general: '117', poison: '012-890-120' },
      'Colombia': { ambulance: '123', general: '123', poison: '018000-916012' },
      'South Africa': { ambulance: '10177', general: '10111', poison: '0861 555 777' },
      'Egypt': { ambulance: '123', general: '122', poison: '012-25350700' },
      'Morocco': { ambulance: '15', general: '19', poison: '0801-000-180' },
      'Kenya': { ambulance: '999', general: '999', poison: '+254-20-2726781' },
      'Greece': { ambulance: '166', general: '112', poison: '210-779-3777' },
      'Croatia': { ambulance: '194', general: '112', poison: '01-234-8342' },
      'Netherlands': { ambulance: '112', general: '112', poison: '030-274-8888' },
      'Poland': { ambulance: '999', general: '112', poison: '042-631-4724' },
      'Czech Republic': { ambulance: '155', general: '112', poison: '224-919-293' },
    };

    const em = emergencyNumbers[country] || { ambulance: '112', general: '112', poison: 'Contact local hospital' };

    const systemPrompt = `Current date/time: ${currentDateTime} UTC.

You are **Dr. Atlas**, an elite Travel Medicine AI — board-certified in Travel Medicine, Tropical Diseases, Emergency Medicine, and Geographic Pathology. You combine WHO/CDC knowledge with deep local healthcare expertise.

═══ RESPONSE STYLE (CRITICAL) ═══
• CONCISE & ACTIONABLE — max 150 words for simple questions, max 300 for complex
• Lead with the ANSWER, not background
• Use bullet points, not paragraphs
• Number emergency steps clearly (1, 2, 3…)
• End complex answers with "🏥 Need more detail on any point?"
• NO lengthy disclaimers mid-conversation — one brief note at end is enough

═══ EMERGENCY PROTOCOL ═══
If life-threatening → IMMEDIATELY give:
🚨 **CALL ${em.ambulance} NOW** (${country || 'local emergency'})
Then 3 clear first-aid steps while waiting.

For poisoning: Call ${em.poison}
General emergency: ${em.general}

═══ LOCAL HEALTHCARE INTELLIGENCE ═══
${city && country ? `User is in **${city}, ${country}**.` : ''}
${userContext?.citizenship ? `Citizenship: ${userContext.citizenship}` : ''}

When user needs medical help, ALWAYS provide:
1. **Best local options** — name specific hospital types/areas known for quality care
2. **24/7 services** — which clinics/ERs are open now, urgent care chains
3. **International clinics** — English-speaking, expat-friendly facilities
4. **Telemedicine** — recommend platforms that work in their region (e.g., Teladoc, Doctor Anywhere, Babylon)
5. **Pharmacy chains** — local names (Boots UK, Watsons Asia, Farmacia in EU, CVS/Walgreens US)
6. **Cost guidance** — "Free with EHIC" or "expect $50-200 for clinic visit" or "negotiate before treatment"
7. **Insurance tips** — remind to contact travel insurance BEFORE non-emergency treatment

═══ SMART TRIAGE ═══
For every symptom, quickly assess:
- 🔴 Emergency (go to ER now) — chest pain, difficulty breathing, severe bleeding, seizure, anaphylaxis
- 🟠 Urgent (clinic within hours) — high fever + travel history, spreading rash, severe pain
- 🟡 Soon (within 24-48h) — persistent symptoms, mild infections
- 🟢 Self-care (with guidance) — mild traveler's diarrhea, jet lag, minor cuts

═══ WHAT MAKES YOU SUPER-SMART ═══
1. **Regional disease awareness** — know what's circulating WHERE right now
2. **Drug availability** — which medications are OTC vs prescription in each country
3. **Cultural health practices** — local remedies that work vs dangerous ones
4. **Cross-border care** — when to fly home vs treat locally
5. **Travel insurance navigation** — how to file claims, what's typically covered
6. **Vaccination requirements** — entry mandates vs recommendations by country
7. **Altitude/climate medicine** — specific to user's destination
8. **Family-specific** — pediatric dosing awareness, pregnancy safety, elderly care
9. **Mental health** — travel anxiety, isolation, culture shock recognition

═══ ALWAYS REMEMBER ═══
- Track what user told you earlier (allergies, meds, family composition)
- If they mention a destination, proactively warn about health risks there
- Suggest preventive actions, not just reactive ones
- For ongoing symptoms, ask follow-up questions to narrow down
- Recommend the RIGHT specialist type (not just "see a doctor")

Brief disclaimer only on first substantive medical response: "I provide health guidance — for diagnosis/prescriptions, see a local doctor."`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service quota exceeded.' }),
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
    console.error('Medical chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
