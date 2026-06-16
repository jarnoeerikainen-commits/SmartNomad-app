// ═══════════════════════════════════════════════════════════════════════════
// concierge-hermes-assist — Hermes acts as silent co-pilot for the Concierge.
// Given the user's last message + lightweight context (route, persona, recent
// signals), returns a JSON envelope the Concierge can splice into its reply:
//   { suggestion, next_action, escalate, confidence, tone_hint }
// Read-only. Designed to be called BEFORE the Concierge streams its answer.
// ═══════════════════════════════════════════════════════════════════════════
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

interface Body {
  user_message?: string;
  persona?: string;       // "meghan" | "john" | "guest" | other
  is_demo?: boolean;
  route?: string;
  city?: string;
  recent_signals?: {
    open_tickets?: number;
    safety_alerts?: number;
    tax_warning?: string;
    loyalty_tier?: string;
    last_booking_failed?: boolean;
  };
}

interface Assist {
  suggestion: string;       // 1-2 sentence helpful add-on the Concierge can read aloud
  next_action: string;      // single short imperative ("Book tonight's hotel", "Open Visa Hub")
  escalate: boolean;        // true => quietly notify admin cockpit
  confidence: 'low' | 'medium' | 'high';
  tone_hint: 'calm' | 'urgent' | 'celebratory' | 'cautious';
  source: 'hermes' | 'fallback';
}

const SYSTEM = `You are Hermes acting as a silent co-pilot for SuperNomad's Concierge AI.
You do NOT talk to the end user. You give the Concierge ONE compact JSON envelope:
{
 "suggestion": string,   // <= 25 words, helpful add-on the Concierge can splice into its reply, evidence-grounded
 "next_action": string,  // <= 8 words, imperative ("Open Visa Hub", "Confirm payout")
 "escalate": boolean,    // true if a human operator should be silently pinged
 "confidence": "low"|"medium"|"high",
 "tone_hint": "calm"|"urgent"|"celebratory"|"cautious"
}
Rules:
- Evidence-first: never invent facts. If signals are thin, set confidence "low".
- Escalate=true only for safety alerts, failed bookings, or tax/visa risk.
- Demo personas (Meghan/John) get the same quality help — they showcase the product.
- Output ONLY the JSON object, no prose, no markdown fences.`;

function fallback(b: Body): Assist {
  const s = b.recent_signals ?? {};
  const escalate = !!(s.safety_alerts || s.last_booking_failed);
  return {
    suggestion: escalate
      ? 'A live signal needs the operator. Acknowledge gently and offer a fallback option.'
      : 'Stay concise and confirm the user\'s next step.',
    next_action: s.safety_alerts ? 'Open Safety Hub' : s.last_booking_failed ? 'Retry booking' : 'Confirm next step',
    escalate,
    confidence: 'low',
    tone_hint: escalate ? 'cautious' : 'calm',
    source: 'fallback',
  };
}

function safeParse(text: string): Assist | null {
  try {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const o = JSON.parse(cleaned);
    if (typeof o.suggestion !== 'string' || typeof o.next_action !== 'string') return null;
    return {
      suggestion: String(o.suggestion).slice(0, 240),
      next_action: String(o.next_action).slice(0, 80),
      escalate: !!o.escalate,
      confidence: ['low', 'medium', 'high'].includes(o.confidence) ? o.confidence : 'medium',
      tone_hint: ['calm', 'urgent', 'celebratory', 'cautious'].includes(o.tone_hint) ? o.tone_hint : 'calm',
      source: 'hermes',
    };
  } catch { return null; }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  let body: Body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify(fallback(body)), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const userMsg = `Context:\n${JSON.stringify({
    persona: body.persona ?? 'guest',
    is_demo: !!body.is_demo,
    route: body.route ?? '/',
    city: body.city ?? null,
    signals: body.recent_signals ?? {},
  }, null, 2)}\n\nUser said: ${(body.user_message ?? '').slice(0, 800)}\n\nReturn the JSON envelope.`;

  try {
    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: userMsg }],
        temperature: 0.2,
        max_tokens: 250,
      }),
    });
    if (!resp.ok) {
      return new Response(JSON.stringify({ ...fallback(body), warn: resp.status }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const j = await resp.json();
    const text = j?.choices?.[0]?.message?.content?.trim() ?? '';
    const parsed = safeParse(text);
    return new Response(JSON.stringify(parsed ?? fallback(body)), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ...fallback(body), error: String(e) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
