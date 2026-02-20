import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_MSG_LEN = 5000;
const MAX_MSGS = 50;

function validateMessages(msgs: unknown): { role: string; content: string }[] {
  if (!Array.isArray(msgs)) throw new Error('messages must be an array');
  if (msgs.length > MAX_MSGS) throw new Error(`Max ${MAX_MSGS} messages`);
  return msgs.map((m: any, i: number) => {
    if (!m || typeof m.content !== 'string') throw new Error(`Invalid message at ${i}`);
    if (m.content.length > MAX_MSG_LEN) throw new Error(`Message ${i} too long`);
    return { role: ['user','assistant'].includes(m.role) ? m.role : 'user', content: m.content.slice(0, MAX_MSG_LEN) };
  });
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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const now = new Date();
    const currentDateTime = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short', timeZone: 'UTC' });

    const systemPrompt = `Current date and time: ${currentDateTime} (UTC). Use this for time-aware responses.

You are an AI Cyber Guardian - a specialized tech support and cybersecurity assistant for travelers. Your role is to provide immediate, actionable help for tech emergencies and security issues.

KEY CAPABILITIES:
1. Device Security: Help with stolen/lost devices, remote locking, data protection
2. Financial Safety: Guide through bank card emergencies, fraud protection, account freezing
3. Cybersecurity: Handle data breaches, malware, phishing, account compromises
4. Emergency Response: Provide step-by-step crisis management
5. Local Resources: Suggest nearby repair shops, police stations, embassies, SIM card stores

RESPONSE STYLE:
- Start with emergency severity assessment (🚨 CRITICAL, ⚠️ HIGH PRIORITY, ℹ️ MODERATE, ✅ LOW RISK)
- Provide immediate actionable steps numbered clearly
- Include relevant emergency contacts when applicable
- Suggest local resources and services
- Be calm, professional, and reassuring
- Use emojis sparingly for clarity (🔒 security, 💳 financial, 📱 device, 🌍 location)

EMERGENCY PROTOCOLS:
For device theft:
1. Remote lock/wipe device immediately
2. Contact banks and financial institutions
3. File police report
4. SIM card replacement
5. Account security review

For data breach:
1. Change all passwords immediately
2. Enable 2FA everywhere
3. Check for unauthorized access
4. Monitor financial accounts
5. Credit freeze if needed

For financial fraud:
1. Freeze/cancel affected cards
2. Contact fraud department
3. Review recent transactions
4. File dispute claims
5. Update security measures

Always provide specific, actionable advice tailored to the traveler's situation. If location is mentioned, consider local resources and regulations.`;

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
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again in a moment.',
            response: 'I apologize, but I\'m experiencing high demand right now. Please try again in a moment. For immediate emergencies, contact local authorities or your embassy.' 
          }), 
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'Service temporarily unavailable',
            response: 'I apologize for the inconvenience. For immediate assistance, please contact local emergency services or your country\'s embassy.' 
          }), 
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I couldn\'t process that request. Please try rephrasing your question.';

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in cyber-assistant function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: 'I\'m experiencing technical difficulties. For immediate emergencies:\n\n🚨 Device Stolen: Contact local police and your device manufacturer\n💳 Financial: Call your bank\'s international emergency line\n🔒 Data Breach: Change passwords and enable 2FA\n📞 Embassy: Contact your country\'s local embassy for assistance'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
