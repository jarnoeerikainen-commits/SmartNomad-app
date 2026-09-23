import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { isPausedSocialIntroductionRequest } from '../_shared/socialIntroductionPolicy.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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
    const type = sanitize(body.type, 50);
    if (!['match', 'conversation'].includes(type)) {
      return new Response(JSON.stringify({ error: 'Invalid type' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (isPausedSocialIntroductionRequest(type)) {
      return new Response(JSON.stringify({ matches: [], paused: true }), {
        status: 423,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userProfile = body.userProfile || {};
    const availableProfiles = Array.isArray(body.availableProfiles) ? body.availableProfiles.slice(0, MAX_ARRAY) : [];
    const message = sanitize(body.message, MAX_MSG);
    const chatHistory = Array.isArray(body.chatHistory) ? body.chatHistory.slice(0, MAX_ARRAY).map((m: any) => ({ senderName: sanitize(m.senderName, 100), content: sanitize(m.content, MAX_MSG) })) : [];
    const userCity = sanitize(body.userCity);
    const userInterests = Array.isArray(body.userInterests) ? body.userInterests.slice(0, 10).map((i: any) => sanitize(i, 100)) : [];
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('Service configuration error');
    }

    const now = new Date();
    const currentDateTime = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short', timeZone: 'UTC' });

    if (type === 'match') {
      const systemPrompt = `Current date and time: ${currentDateTime} (UTC).

You are an intelligent social matching assistant for travelers and expats.
Analyze the user's profile and available profiles to suggest the best 5 matches based on:
- Location overlap (current or upcoming)
- Professional interests and industry
- Travel preferences and frequency
- Social connection types they're seeking
- Common languages and interests
- Shared upcoming travel plans and activity interests

Also look for contextual scenarios like:
- Both planning to be in the same city at the same time
- Similar weekend activity interests (biking, hiking, dining)
- Attending the same events or conferences

Use only provided profiles. Do not invent people, private facts, events, or unverifiable claims. Return structured output through the tool only.`;

      const userPrompt = `User Profile: ${JSON.stringify(userProfile, null, 2)}

Available Profiles: ${JSON.stringify(availableProfiles.slice(0, 10), null, 2)}

Provide 5 best matches with scores (70-99), reasons for the match, common interests, shared locations, and 2-3 conversation starters for each. Focus on actionable connections — same city overlap, shared activities, events they could attend together.`;

      const matchTool = {
        type: 'function',
        function: {
          name: 'return_matches',
          description: 'Return the best social matches from the provided profiles only',
          parameters: {
            type: 'object',
            properties: {
              matches: {
                type: 'array',
                maxItems: 5,
                items: {
                  type: 'object',
                  properties: {
                    profile: { type: 'object' },
                    matchScore: { type: 'number' },
                    reasons: { type: 'array', items: { type: 'string' }, maxItems: 4 },
                    commonInterests: { type: 'array', items: { type: 'string' }, maxItems: 5 },
                    sharedLocations: { type: 'array', items: { type: 'string' }, maxItems: 3 },
                    conversationStarters: { type: 'array', items: { type: 'string' }, maxItems: 3 },
                  },
                  required: ['profile', 'matchScore', 'reasons', 'commonInterests', 'sharedLocations', 'conversationStarters'],
                  additionalProperties: false,
                },
              },
            },
            required: ['matches'],
            additionalProperties: false,
          },
        },
      };

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          tools: [matchTool],
          tool_choice: { type: 'function', function: { name: 'return_matches' } },
          temperature: 0.35,
          max_tokens: 900,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }), {
            status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: 'Payment required, please add funds.' }), {
            status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        throw new Error('Failed to get AI matches');
      }

      const data = await response.json();
      const toolArgs = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;

      try {
        const matches = JSON.parse(toolArgs || '{}').matches || [];
        return new Response(JSON.stringify({ matches }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.error('Failed to parse AI response:', e);
        return new Response(JSON.stringify({ 
          matches: availableProfiles.slice(0, 5).map((profile: any) => ({
            profile,
            matchScore: Math.floor(Math.random() * 30) + 70,
            reasons: ['Location compatibility', 'Shared professional interests'],
            commonInterests: profile.professional?.interests?.slice(0, 2) || [],
            sharedLocations: [profile.mobility?.currentLocation?.city || 'Unknown'],
            conversationStarters: [
              `I see you're also interested in ${profile.professional?.interests?.[0] || 'traveling'}!`,
              `How's life in ${profile.mobility?.currentLocation?.city || 'your city'}?`
            ]
          }))
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (type === 'conversation') {
      const cityContext = userCity ? `The user is currently in or planning to visit: ${userCity}.` : '';
      const interestsContext = userInterests?.length ? `User interests: ${userInterests.join(', ')}.` : '';

      const systemPrompt = `Current date and time: ${currentDateTime} (UTC).

You are SuperNomad AI — a concise assistant for an existing, user-opened social chat. ${cityContext} ${interestsContext}

Your job is to:
1. Only answer the user's explicit request about the existing conversation.
2. Never suggest, match, introduce, or surface new people, friends, SportBuddies, groups, meetups, or social events.
3. Never add a proactive recommendation or invitation.
4. Keep answers neutral, contextual, and under three sentences.`;

      const conversationContext = chatHistory?.map((msg: any) => 
        `${msg.senderName}: ${msg.content}`
      ).join('\n') || '';

      const userPrompt = `Recent conversation:
${conversationContext}

Latest message: "${message}"

Answer only the explicit request in 2-3 sentences. Do not recommend people, groups, meetups, events, restaurants, or activities.`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: 'Rate limited, try again.' }), {
            status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        throw new Error('Failed to get conversation assistance');
      }

      const data = await response.json();
      const suggestion = data.choices[0].message.content;

      return new Response(JSON.stringify({ suggestion }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request type' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in social-chat-ai function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
