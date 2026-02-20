import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_MSG = 5000;
const MAX_STR = 200;
const MAX_ARRAY = 20;

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
    const message = sanitize(body.message, MAX_MSG);
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const context = body.context || {};
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const chatSubject = sanitize(context.chatSubject);
    const category = sanitize(context.category);
    const recentMessages = Array.isArray(context.recentMessages) ? context.recentMessages.slice(0, MAX_ARRAY).map((m: any) => ({ senderName: sanitize(m.senderName, 100), content: sanitize(m.content, MAX_MSG) })) : [];
    const strictness = sanitize(context.strictness, 50);
    const topicEnforcement = !!context.topicEnforcement;

    const now = new Date();
    const currentDateTime = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short', timeZone: 'UTC' });

    let systemPrompt = `Current date and time: ${currentDateTime} (UTC).

You are an AI moderator for a subject-based chat room about "${chatSubject}" in the ${category} category.

Your role:
- Keep discussions focused on the subject: ${chatSubject}
- Welcome new participants warmly
- Encourage engagement and meaningful contributions
- Provide helpful suggestions and resources when relevant
- Maintain a friendly but ${strictness} moderation style

${topicEnforcement ? `IMPORTANT: Gently guide conversations back on topic if they drift too far from ${chatSubject}.` : 'Allow natural conversation flow while keeping the subject in mind.'}

Recent conversation context:
${recentMessages.map((m: any) => `${m.senderName}: ${m.content}`).join('\n')}

Respond in a helpful, engaging way that adds value to the discussion. Keep responses concise (2-3 sentences). Be encouraging and constructive.`;

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
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in subject-chat-moderator:', error);
    const isValidation = error instanceof Error && (error.message.includes('must be') || error.message.includes('required') || error.message.includes('too long'));
    return new Response(
      JSON.stringify({ error: isValidation ? error.message : 'An error occurred' }),
      { 
        status: isValidation ? 400 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
