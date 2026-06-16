// ═══════════════════════════════════════════════════════════════════════════
// admin-hermes — Hermes, the operator's messenger AI.
// Takes a compact cockpit snapshot (live signals + platform stats) and a
// natural-language question, returns a concise dispatch (≤ 120 words) with
// a recommended next action. Read-only; no DB writes.
// ═══════════════════════════════════════════════════════════════════════════
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

interface CockpitSnapshot {
  total_signals?: number;
  revenue_window_usd?: number;
  open_problems?: number;
  positive_pct?: number;
  top_wish?: string;
  hottest_city?: string;
  urgent_tickets?: number;
  pending_payouts_usd?: number;
  total_users?: number;
}

interface Body {
  question?: string;
  snapshot?: CockpitSnapshot;
  mode?: 'briefing' | 'ask';
}

const SYSTEM = `You are Hermes, the SuperNomad operator's messenger AI.
Style: terse, executive, decisive. Reply in ≤ 120 words.
Structure exactly:
1) One headline sentence — the situation in plain English.
2) Two to three bullet observations grounded in the numbers you were given.
3) ONE bolded **Recommended next action:** ending with a verb (e.g. "Approve the payout batch", "Open the live feed").
Never invent numbers. If the snapshot lacks data, say "Insufficient signal" and recommend a probe action.`;

function fallback(s: CockpitSnapshot): string {
  const lines: string[] = [];
  if ((s.urgent_tickets ?? 0) > 0) lines.push(`${s.urgent_tickets} urgent tickets in queue.`);
  if ((s.open_problems ?? 0) > 2) lines.push(`${s.open_problems} live user problems in last 15m.`);
  if ((s.positive_pct ?? 100) < 60) lines.push(`Sentiment at ${s.positive_pct}% positive.`);
  if ((s.pending_payouts_usd ?? 0) > 0) lines.push(`$${s.pending_payouts_usd} in pending payouts.`);
  if (lines.length === 0) lines.push('No critical anomalies. Queue is calm.');
  const action = (s.urgent_tickets ?? 0) > 0
    ? '**Recommended next action:** Open the support tickets queue.'
    : (s.open_problems ?? 0) > 2
    ? '**Recommended next action:** Open the live agent feed.'
    : '**Recommended next action:** Review the daily AI council digest.';
  return `Operating normally — local synthesis.\n- ${lines.join('\n- ')}\n\n${action}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  let body: Body;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }

  const snapshot = body.snapshot ?? {};
  const mode = body.mode ?? 'briefing';
  const question = (body.question ?? '').slice(0, 800);

  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ dispatch: fallback(snapshot), source: 'fallback' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const userMsg = mode === 'briefing'
    ? `Cockpit snapshot (last 15m unless noted):\n${JSON.stringify(snapshot, null, 2)}\n\nGive the operator a Hermes briefing.`
    : `Cockpit snapshot:\n${JSON.stringify(snapshot, null, 2)}\n\nOperator question: ${question || '(no question)'}`;

  try {
    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: userMsg }],
        temperature: 0.3,
        max_tokens: 350,
      }),
    });
    if (resp.status === 429 || resp.status === 402) {
      return new Response(JSON.stringify({ dispatch: fallback(snapshot), source: 'fallback', warn: resp.status }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!resp.ok) throw new Error(`gateway ${resp.status}`);
    const j = await resp.json();
    const dispatch = j?.choices?.[0]?.message?.content?.trim() || fallback(snapshot);
    return new Response(JSON.stringify({ dispatch, source: 'hermes' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ dispatch: fallback(snapshot), source: 'fallback', error: String(e) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
