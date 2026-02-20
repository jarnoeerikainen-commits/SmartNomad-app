import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
const MAX_MSG_LEN = 5000;
const MAX_MSGS = 50;
const MAX_STR = 200;

function validateMessages(msgs: unknown): { role: string; content: string }[] {
  if (!Array.isArray(msgs)) throw new Error('messages must be an array');
  if (msgs.length > MAX_MSGS) throw new Error(`Max ${MAX_MSGS} messages`);
  return msgs.map((m: any, i: number) => {
    if (!m || typeof m.content !== 'string') throw new Error(`Invalid message at ${i}`);
    if (m.content.length > MAX_MSG_LEN) throw new Error(`Message ${i} too long`);
    return { role: ['user','assistant','system'].includes(m.role) ? m.role : 'user', content: m.content.slice(0, MAX_MSG_LEN) };
  });
}

function sanitize(v: unknown, max = MAX_STR): string {
  return typeof v === 'string' ? v.replace(/<[^>]*>/g, '').slice(0, max) : '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let body: any;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const messages = validateMessages(body.messages);
    const userContext = body.userContext && typeof body.userContext === 'object' ? {
      currentCountry: sanitize(body.userContext.currentCountry),
      currentCity: sanitize(body.userContext.currentCity),
      citizenship: sanitize(body.userContext.citizenship),
    } : undefined;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const currentDateTime = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short', timeZone: 'UTC' });

    const country = userContext?.currentCountry || '';
    const city = userContext?.currentCity || '';

    // Emergency numbers by country
    const emergencyLegal: Record<string, { police: string; embassy_tip: string }> = {
      'United States': { police: '911', embassy_tip: 'Contact nearest consulate via travel.state.gov' },
      'United Kingdom': { police: '999', embassy_tip: 'Contact FCO on +44 20 7008 5000' },
      'Germany': { police: '110', embassy_tip: 'Your embassy — find at auswaertiges-amt.de' },
      'France': { police: '17', embassy_tip: 'Consulate list at diplomatie.gouv.fr' },
      'Spain': { police: '091', embassy_tip: 'Nearest consulate — exteriores.gob.es' },
      'Italy': { police: '113', embassy_tip: 'Carabinieri: 112' },
      'Thailand': { police: '191', embassy_tip: 'Tourist police: 1155 (English-speaking)' },
      'Japan': { police: '110', embassy_tip: 'JNTO helpline: 050-3816-2787' },
      'UAE': { police: '999', embassy_tip: 'Tourist police available in Dubai/Abu Dhabi' },
      'Mexico': { police: '911', embassy_tip: 'Tourist hotline: 078' },
      'Brazil': { police: '190', embassy_tip: 'Tourist police (DEATUR) in major cities' },
      'Singapore': { police: '999', embassy_tip: 'Embassy district: Tanglin area' },
      'India': { police: '112', embassy_tip: 'Tourist helpline: 1800-111-363' },
      'Australia': { police: '000', embassy_tip: 'Smartraveller: 1300 555 135' },
      'South Africa': { police: '10111', embassy_tip: 'Tourism safety: 0860-142-142' },
      'Portugal': { police: '112', embassy_tip: 'SEF immigration: +351 808 202 653' },
      'Netherlands': { police: '112', embassy_tip: 'Juridisch Loket (free legal): 0900-8020' },
      'South Korea': { police: '112', embassy_tip: 'Foreigner helpline: 1345' },
      'Turkey': { police: '155', embassy_tip: 'Tourist police in major cities' },
      'Colombia': { police: '123', embassy_tip: 'Tourist police: #767 from mobile' },
      'Philippines': { police: '911', embassy_tip: 'DOT hotline: (02) 8459-5200' },
      'Indonesia': { police: '112', embassy_tip: 'Tourist police in Bali: (0361) 224-111' },
      'Vietnam': { police: '113', embassy_tip: 'Foreigner support: 1900-599-547' },
      'Greece': { police: '100', embassy_tip: 'Tourist police: 171' },
      'Croatia': { police: '192', embassy_tip: 'Tourist info: 062-999-999' },
      'Egypt': { police: '122', embassy_tip: 'Tourist police: 126' },
      'Morocco': { police: '19', embassy_tip: 'Tourist brigade in major cities' },
    };

    const em = emergencyLegal[country] || { police: '112', embassy_tip: 'Contact your embassy immediately' };

    const systemPrompt = `Current date/time: ${currentDateTime} UTC.

You are an **elite international legal crisis team** — top-tier lawyers specialized in travel emergencies, immigration, business law, criminal defense, and consumer protection across all jurisdictions.

═══ RESPONSE STYLE (CRITICAL) ═══
• CONCISE & ACTIONABLE — max 150 words for simple questions, max 300 for complex
• Lead with the ACTION, not background
• Number emergency steps: 1, 2, 3…
• Use bold for critical actions
• End with "⚖️ Want me to dig deeper on any point?"
• NO walls of text — users may be panicking

═══ EMERGENCY PROTOCOL ═══
If arrest/danger/crime → IMMEDIATELY:
🚨 **CALL ${em.police} NOW** (${country || 'local police'})
📞 ${em.embassy_tip}
Then give 3 critical steps.

═══ LOCATION CONTEXT ═══
${city && country ? `User is in **${city}, ${country}**.` : ''}
${userContext?.citizenship ? `Citizenship: ${userContext.citizenship}` : ''}

═══ WHAT MAKES YOU SUPER-SMART ═══

**1. IMMEDIATE CRISIS RESPONSE**
For every emergency, give:
- Exact emergency numbers for THEIR location
- Step-by-step actions in order of priority
- What NOT to do (don't sign, don't admit fault, don't hand over passport)
- Exact phrases to say ("I invoke my right to consular access")

**2. LOCAL LEGAL SERVICES KNOWLEDGE**
Always recommend:
- **24/7 legal hotlines** that exist in their country (many countries have free legal aid lines)
- **Embassy/consulate services** — what they actually help with (and what they don't)
- **Tourist police** — which countries have them and how to reach them
- **Free legal aid** — NGOs, bar associations, legal aid societies
- **English-speaking lawyers** — how to find them (local bar associations, embassy lists, international law firms with local offices)
- **Cost expectations** — "Expect €200-500 for initial consultation in Spain" or "Legal aid available if income below threshold"

**3. JURISDICTION-SPECIFIC INTELLIGENCE**
Know the legal systems:
- Common law vs civil law vs mixed — how it affects the user
- Local customs that have legal weight (UAE, Saudi, Singapore — strict laws)
- Statute of limitations by country and issue type
- Which countries have tourist-friendly legal protections
- Consumer protection strength by country

**4. PROACTIVE LEGAL AWARENESS**
- If user mentions a country, warn about unusual laws (chewing gum Singapore, drone laws, photo restrictions, drug penalties)
- If user mentions business, flag tax implications, work permit needs
- If user mentions rental, flag local tenant rights
- Track conversation context — if they said they're a US citizen in Thailand, remember for all future advice

**5. DOCUMENT & EVIDENCE GUIDANCE**
For any incident:
- What to photograph/record
- Which documents to request (police report number, medical records, witness forms)
- How to get certified translations
- How to apostille/legalize documents
- Digital evidence preservation tips

**6. SPECIFIC SCENARIO MASTERY**

ACCIDENT: Don't admit fault → Photos → Police report → Insurance → Medical records → Lawyer if serious
ROBBERY: Safety first → Police report with item list → Cancel cards → Embassy if passport → Insurance claim
ARREST: "I want my embassy" → Don't sign unknown documents → Request translator → Lawyer immediately
VISA OVERSTAY: Calculate penalties → Voluntary departure vs deportation risk → Immigration lawyer
SCAM/FRAUD: Document everything → Police report → Bank chargeback → Consumer protection agency
LANDLORD DISPUTE: Local tenant rights → Written complaint → Housing authority → Small claims
WORK DISPUTE: Employment contract review → Labor board → Document communications
MEDICAL MALPRACTICE: Preserve records → Second opinion → Medical board complaint → Lawyer

**7. INTERNATIONAL SOLUTIONS**
- When local options fail, suggest international alternatives
- International arbitration for business disputes
- Cross-border legal cooperation treaties
- Hague Convention applications (child custody, document service)
- INTERPOL involvement criteria

═══ CRITICAL RULES ═══
- If life/safety at risk → Emergency number FIRST
- If uncertain → Recommend lawyer IMMEDIATELY with how to find one locally
- NEVER speculate on case outcomes
- Remember everything user said for consistent advice
- Distinguish between legal INFORMATION (allowed) and legal ADVICE (only from licensed attorneys)

Brief disclaimer only on first response: "I provide legal information and emergency guidance — for formal legal advice, consult a licensed attorney in the relevant jurisdiction."`;

    console.log('Calling Lovable AI for legal chat');

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
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }),
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
    console.error('Legal chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
