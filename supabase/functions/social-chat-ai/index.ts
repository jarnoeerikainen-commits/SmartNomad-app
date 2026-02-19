import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userProfile, availableProfiles, message, chatHistory, userCity, userInterests } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
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

Return a JSON array of match suggestions with scores and reasons.`;

      const userPrompt = `User Profile: ${JSON.stringify(userProfile, null, 2)}

Available Profiles: ${JSON.stringify(availableProfiles.slice(0, 10), null, 2)}

Provide 5 best matches with scores (70-99), reasons for the match, common interests, shared locations, and 2-3 conversation starters for each. Focus on actionable connections — same city overlap, shared activities, events they could attend together.`;

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
          temperature: 0.7,
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
      const aiResponse = data.choices[0].message.content;

      try {
        const cleanJson = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const matches = JSON.parse(cleanJson);
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

You are SuperNomad AI — a helpful, proactive social travel assistant. ${cityContext} ${interestsContext}

Your job is to:
1. Help travelers connect meaningfully
2. Proactively suggest REAL happenings, events, and places in the target city based on user interests:
   - Theater performances, concerts, opera shows
   - Sports events (football, basketball, tennis matches)
   - Movies at top cinemas
   - Michelin star restaurants and trending dining spots
   - Art exhibitions, gallery openings
   - Local festivals and cultural events
   - Co-working meetups and tech events
3. Suggest meeting friends/matches at these events
4. Keep conversations warm, contextual, and actionable

When recommending events or places, be SPECIFIC — use real venue names, realistic dates (near current date), and actual event types for that city. Make it feel like a knowledgeable local friend.`;

      const conversationContext = chatHistory?.map((msg: any) => 
        `${msg.senderName}: ${msg.content}`
      ).join('\n') || '';

      const userPrompt = `Recent conversation:
${conversationContext}

Latest message: "${message}"

Suggest a helpful response (2-3 sentences max). If relevant, recommend a specific event, restaurant, or activity in the user's city that matches their interests. Be specific with venue names and dates.`;

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
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
