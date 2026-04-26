import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_STR = 500;
const MAX_MSG = 2000;
const MAX_ARR = 30;

const sanitize = (v: unknown, max = MAX_STR): string =>
  typeof v === 'string' ? v.replace(/<[^>]*>/g, '').slice(0, max) : '';

interface Member { id: string; name: string; profession?: string; interests?: string[] }
interface RecentMsg { senderName: string; content: string; isAI?: boolean }

/**
 * mode:
 *  - 'replies'      → 1-2 short member replies (different members)
 *  - 'ai_nudge'     → proactive AI host message during silence
 *  - 'quick_replies' → 3 short reply suggestions for current user
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    let body: any;
    try { body = await req.json(); } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const mode = sanitize(body.mode, 50) || 'replies';
    const location = sanitize(body.location);
    const lastMessage = sanitize(body.lastMessage, MAX_MSG);
    const lastSenderName = sanitize(body.lastSenderName, 100);
    const recentMessages: RecentMsg[] = Array.isArray(body.recentMessages)
      ? body.recentMessages.slice(0, MAX_ARR).map((m: any) => ({
          senderName: sanitize(m.senderName, 100),
          content: sanitize(m.content, MAX_MSG),
          isAI: !!m.isAI,
        }))
      : [];
    const members: Member[] = Array.isArray(body.members)
      ? body.members.slice(0, MAX_ARR).map((u: any) => ({
          id: sanitize(u.id, 100),
          name: sanitize(u.name, 100),
          profession: sanitize(u.profession, 100),
          interests: Array.isArray(u.interests) ? u.interests.slice(0, 8).map((i: any) => sanitize(i, 60)) : [],
        }))
      : [];

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) return json({ error: 'Service configuration error' }, 500);

    const transcript = recentMessages
      .map(m => `${m.isAI ? '[AI Host] ' : ''}${m.senderName}: ${m.content}`)
      .join('\n');
    const memberList = members
      .map(m => `${m.name}${m.profession ? ` (${m.profession})` : ''}${m.interests?.length ? ` — ${m.interests.slice(0, 3).join(', ')}` : ''}`)
      .join('\n');

    let systemPrompt = '';
    let userPrompt = '';
    let tools: any[] | undefined;
    let toolChoice: any | undefined;

    if (mode === 'ai_nudge') {
      systemPrompt = `You are the SuperNomad AI host of a digital nomad community chat${location ? ` in ${location}` : ''}. The chat went quiet. Post ONE short, warm, genuinely useful message (max 200 chars) that gently re-engages people. Options: a local tip, a meetup nudge, an ice-breaker question, or a relevant nomad fact. No emojis spam (max 1). Never repeat earlier AI messages.`;
      userPrompt = `Recent transcript:\n${transcript || '(no messages yet)'}\n\nActive members:\n${memberList || '(unknown)'}\n\nWrite the nudge now. Just the message text — no preamble.`;
    } else if (mode === 'quick_replies') {
      systemPrompt = `You generate 3 short reply suggestions (max 60 chars each) the current user can tap to reply in a nomad community chat. Mix tones: enthusiastic, practical question, friendly observation. No quotes, no numbering.`;
      userPrompt = `Last message from ${lastSenderName || 'someone'}: "${lastMessage}"\n\nLocation: ${location || 'unknown'}\n\nReturn exactly 3 suggestions.`;
      tools = [{
        type: 'function',
        function: {
          name: 'suggest_replies',
          description: 'Return exactly 3 short reply suggestions',
          parameters: {
            type: 'object',
            properties: {
              suggestions: {
                type: 'array',
                items: { type: 'string', maxLength: 60 },
                minItems: 3, maxItems: 3,
              },
            },
            required: ['suggestions'],
            additionalProperties: false,
          },
        },
      }];
      toolChoice = { type: 'function', function: { name: 'suggest_replies' } };
    } else {
      // 'replies' (default)
      systemPrompt = `You orchestrate a realistic group chat among real nomads${location ? ` in ${location}` : ''}. Reply AS one or two existing members (pick from the member list — never invent names). Each reply: 1-2 sentences, casual, on-topic, in character with their profession/interests. Vary tone and style between members. Never use AI/assistant language. No numbered prefixes. Output JSON via the tool.`;
      userPrompt = `Member list:\n${memberList}\n\nRecent transcript:\n${transcript}\n\nThe latest message was from ${lastSenderName || 'someone'}: "${lastMessage}"\n\nGenerate 1-2 plausible replies from DIFFERENT members. Each reply must be in-character and reference the conversation naturally.`;
      tools = [{
        type: 'function',
        function: {
          name: 'post_replies',
          description: 'Return 1-2 in-character member replies',
          parameters: {
            type: 'object',
            properties: {
              replies: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    memberId: { type: 'string' },
                    memberName: { type: 'string' },
                    content: { type: 'string', maxLength: 240 },
                  },
                  required: ['memberId', 'memberName', 'content'],
                  additionalProperties: false,
                },
                minItems: 1, maxItems: 2,
              },
            },
            required: ['replies'],
            additionalProperties: false,
          },
        },
      }];
      toolChoice = { type: 'function', function: { name: 'post_replies' } };
    }

    const reqBody: any = {
      model: mode === 'quick_replies' ? 'google/gemini-2.5-flash-lite' : 'google/gemini-3-flash-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: mode === 'quick_replies' ? 0.45 : 0.72,
      max_tokens: mode === 'ai_nudge' ? 110 : mode === 'quick_replies' ? 140 : 320,
    };
    if (tools) { reqBody.tools = tools; reqBody.tool_choice = toolChoice; }

    const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error('AI gateway error', aiResp.status, t);
      if (aiResp.status === 429) return json({ error: 'Rate limit, try later' }, 429);
      if (aiResp.status === 402) return json({ error: 'Credits exhausted' }, 402);
      return json({ error: 'AI gateway error' }, 500);
    }

    const data = await aiResp.json();
    const choice = data.choices?.[0]?.message;
    const toolCall = choice?.tool_calls?.[0];

    if (mode === 'ai_nudge') {
      const text = (choice?.content || '').toString().trim().slice(0, 280);
      return json({ mode, message: text });
    }

    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        return json({ mode, ...parsed });
      } catch (e) {
        console.error('Failed to parse tool args', e);
        return json({ mode, replies: [], suggestions: [] });
      }
    }

    return json({ mode, replies: [], suggestions: [], message: choice?.content ?? '' });
  } catch (e) {
    console.error('orchestrator error', e);
    return json({ error: 'An error occurred' }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
