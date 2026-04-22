import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ═══════════════════════════════════════════════════════════
// send-calendar-reminder — emails reminders for upcoming
// SuperNomad calendar events via the Resend connector.
// Demo-safe: when RESEND not configured, returns a simulated
// success response so demo personas can exercise the UI.
// ═══════════════════════════════════════════════════════════

interface ReminderRequest {
  to: string;
  eventTitle: string;
  startIso: string;
  location?: string;
  notes?: string;
  minutesBefore: number;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] as string));
}

function formatLeadTime(min: number): string {
  if (min < 60) return `${min} minutes`;
  if (min < 24 * 60) return `${Math.round(min / 60)} hours`;
  return `${Math.round(min / (24 * 60))} days`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as ReminderRequest;
    const { to, eventTitle, startIso, location, notes, minutesBefore } = body;

    if (!to || !eventTitle || !startIso) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const start = new Date(startIso);
    const dateLabel = start.toLocaleDateString('en-GB', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
    const timeLabel = start.toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit',
    });

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0f172a;color:#f1f5f9;border-radius:12px">
        <div style="font-size:12px;letter-spacing:2px;color:#fbbf24;text-transform:uppercase;margin-bottom:8px">SuperNomad Concierge</div>
        <h1 style="font-size:22px;margin:0 0 16px 0;color:#fff">${escapeHtml(eventTitle)}</h1>
        <div style="background:rgba(251,191,36,0.08);border-left:3px solid #fbbf24;padding:14px 16px;border-radius:6px;margin-bottom:18px">
          <div style="font-size:14px;color:#cbd5e1">Reminder — in ${formatLeadTime(minutesBefore)}</div>
          <div style="font-size:18px;font-weight:600;color:#fff;margin-top:4px">${escapeHtml(dateLabel)} · ${escapeHtml(timeLabel)}</div>
          ${location ? `<div style="font-size:14px;color:#cbd5e1;margin-top:6px">📍 ${escapeHtml(location)}</div>` : ''}
        </div>
        ${notes ? `<p style="font-size:14px;color:#cbd5e1;line-height:1.6">${escapeHtml(notes)}</p>` : ''}
        <p style="font-size:12px;color:#64748b;margin-top:24px">You're receiving this because calendar reminders are enabled in your SuperNomad concierge settings.</p>
      </div>
    `.trim();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    // Demo / no-config path — return simulated success so the UI flow is testable
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      console.log('[send-calendar-reminder] simulated send (Resend not configured)', {
        to, eventTitle, startIso, minutesBefore,
      });
      return new Response(
        JSON.stringify({
          success: true,
          simulated: true,
          message: 'Email reminder simulated — connect Resend in production to send real emails.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Production path — Resend via the connector gateway
    const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';
    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'SuperNomad Concierge <onboarding@resend.dev>',
        to: [to],
        subject: `⏰ ${eventTitle} — in ${formatLeadTime(minutesBefore)}`,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[send-calendar-reminder] Resend error', data);
      return new Response(
        JSON.stringify({ error: 'Email send failed', details: data }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[send-calendar-reminder] error', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
