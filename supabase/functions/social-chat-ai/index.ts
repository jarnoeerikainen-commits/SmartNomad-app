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
    const { type, userProfile, availableProfiles, message, chatHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    if (type === 'match') {
      // AI-powered matching logic
      const systemPrompt = `You are an intelligent social matching assistant for travelers and expats. 
Analyze the user's profile and available profiles to suggest the best 5 matches based on:
- Location overlap (current or upcoming)
- Professional interests and industry
- Travel preferences and frequency
- Social connection types they're seeking
- Common languages and interests

Return a JSON array of match suggestions with scores and reasons.`;

      const userPrompt = `User Profile: ${JSON.stringify(userProfile, null, 2)}

Available Profiles: ${JSON.stringify(availableProfiles.slice(0, 10), null, 2)}

Provide 5 best matches with scores (70-99), reasons for the match, common interests, shared locations, and 2-3 conversation starters for each.`;

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
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error('Failed to get AI matches');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Parse AI response and return matches
      try {
        const matches = JSON.parse(aiResponse);
        return new Response(JSON.stringify({ matches }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.error('Failed to parse AI response:', e);
        // Return fallback matches
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
      // AI conversation assistance
      const systemPrompt = `You are a helpful conversation assistant for a social travel platform. 
Help travelers connect meaningfully by:
- Suggesting relevant topics based on their profiles
- Encouraging cultural exchange and local insights
- Facilitating meetup planning when appropriate
- Keeping conversations friendly and constructive

When suggesting conversation topics, keep them relevant to travel, location, and shared interests.`;

      const conversationContext = chatHistory?.map((msg: any) => 
        `${msg.senderName}: ${msg.content}`
      ).join('\n') || '';

      const userPrompt = `Recent conversation:
${conversationContext}

Latest message: "${message}"

Suggest a helpful, contextual response or conversation topic (1-2 sentences max).`;

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
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
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
