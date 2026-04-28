import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const VALID_ACTION_TYPES = ['phone-call', 'reservation', 'document-fill', 'payment', 'form-submit', 'appointment'] as const;

type ActionType = typeof VALID_ACTION_TYPES[number];

interface ActionRequest {
  deviceId: string;
  actionType: ActionType;
  payload: {
    provider?: string;
    phone?: string;
    message?: string;
    restaurantName?: string;
    date?: string;
    time?: string;
    guests?: number;
    documentType?: string;
    formData?: Record<string, string>;
    amount?: number;
    currency?: string;
  };
  demoMode?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const parsed = validateActionRequest(await req.json());
    if ('error' in parsed) return json({ error: parsed.error }, 400);

    const { deviceId, actionType, payload, demoMode = true } = parsed;
    const actionFingerprint = await buildActionFingerprint(actionType, payload);
    let userId: string | null = null;
    let permissionId: string | null = null;

    if (!demoMode) {
      const authHeader = req.headers.get('Authorization');
      const auth = await getAuthenticatedUserId(authHeader);
      if ('error' in auth) return json({ error: auth.error }, 401);
      userId = auth.userId;

      const permission = await verifyLiveActionPermission({
        userId,
        deviceId,
        actionType,
        actionFingerprint,
      });

      if (!permission.allowed) {
        return json({
          success: false,
          actionType,
          blocked: true,
          reason: permission.reason || 'permission_required',
          message: 'Live action blocked until the user or admin gives explicit approval.',
          actionFingerprint,
        }, 403);
      }
      permissionId = permission.permission_id ?? null;
    }

    let result: any;
    switch (actionType) {
      case 'phone-call':
        result = await handlePhoneCall(payload, demoMode);
        break;
      case 'reservation':
        result = await handleReservation(payload, demoMode);
        break;
      case 'document-fill':
        result = await handleDocumentFill(payload, demoMode);
        break;
      case 'appointment':
        result = await handleAppointment(payload, demoMode);
        break;
      case 'payment':
      case 'form-submit':
        result = { success: true, message: `Action ${actionType} queued`, demoMode };
        break;
    }

    if (!demoMode) {
      await recordActionCompletion({ permissionId, userId, deviceId, actionType, actionFingerprint, payload, result });
    }

    return json({ success: true, actionType, mode: demoMode ? 'demo' : 'live', actionFingerprint, result });
  } catch (error) {
    console.error('Action error:', error);
    return json({ error: 'Action execution failed' }, 500);
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function validateActionRequest(body: unknown): ActionRequest | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'JSON body required' };
  const candidate = body as Partial<ActionRequest>;
  if (!candidate.deviceId || typeof candidate.deviceId !== 'string' || candidate.deviceId.length > 200) {
    return { error: 'deviceId is required' };
  }
  if (!candidate.actionType || !VALID_ACTION_TYPES.includes(candidate.actionType as ActionType)) {
    return { error: 'Valid actionType is required' };
  }
  if (!candidate.payload || typeof candidate.payload !== 'object' || Array.isArray(candidate.payload)) {
    return { error: 'payload object is required' };
  }
  if (candidate.payload.amount !== undefined && (typeof candidate.payload.amount !== 'number' || candidate.payload.amount < 0)) {
    return { error: 'payload.amount must be a positive number' };
  }
  return {
    deviceId: candidate.deviceId.trim(),
    actionType: candidate.actionType as ActionType,
    payload: candidate.payload,
    demoMode: candidate.demoMode !== false,
  };
}

async function getAuthenticatedUserId(authHeader: string | null): Promise<{ userId: string } | { error: string }> {
  if (!authHeader?.startsWith('Bearer ')) return { error: 'Authentication required for live actions' };
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (error || !data?.user?.id) return { error: 'Authentication required for live actions' };
  return { userId: data.user.id };
}

async function verifyLiveActionPermission(params: {
  userId: string;
  deviceId: string;
  actionType: ActionType;
  actionFingerprint: string;
}): Promise<{ allowed: boolean; reason?: string; permission_id?: string }> {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data, error } = await supabase.rpc('verify_and_consume_ai_action_permission', {
    p_user_id: params.userId,
    p_device_id: params.deviceId,
    p_action_type: params.actionType,
    p_action_fingerprint: params.actionFingerprint,
    p_function_name: 'concierge-actions',
  });
  if (error) throw new Error(`permission verification failed: ${error.message}`);
  return data as { allowed: boolean; reason?: string; permission_id?: string };
}

async function recordActionCompletion(params: {
  permissionId: string | null;
  userId: string | null;
  deviceId: string;
  actionType: ActionType;
  actionFingerprint: string;
  payload: ActionRequest['payload'];
  result: Record<string, unknown>;
}) {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  await supabase.from('ai_action_execution_audit').insert({
    permission_id: params.permissionId,
    user_id: params.userId,
    device_id: params.deviceId,
    action_type: params.actionType,
    action_fingerprint: params.actionFingerprint,
    function_name: 'concierge-actions',
    mode: 'live',
    status: 'completed',
    provider: params.payload.provider || params.payload.restaurantName || null,
    payload_summary: summarizePayload(params.payload),
    result_summary: summarizeResult(params.result),
  });
}

export async function buildActionFingerprint(actionType: ActionType, payload: ActionRequest['payload']): Promise<string> {
  const canonical = JSON.stringify(sortObject({ actionType, payload: summarizePayload(payload) }));
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function summarizePayload(payload: ActionRequest['payload']): Record<string, unknown> {
  return sortObject({
    provider: payload.provider,
    phone_last4: payload.phone ? payload.phone.slice(-4) : undefined,
    message: payload.message?.slice(0, 240),
    restaurantName: payload.restaurantName,
    date: payload.date,
    time: payload.time,
    guests: payload.guests,
    documentType: payload.documentType,
    formFieldCount: payload.formData ? Object.keys(payload.formData).length : undefined,
    amount: payload.amount,
    currency: payload.currency,
  });
}

function summarizeResult(result: Record<string, unknown>): Record<string, unknown> {
  return sortObject({
    status: result.status,
    confirmationId: result.confirmationId,
    appointmentId: result.appointmentId,
    callSid: result.callSid,
    message: typeof result.message === 'string' ? result.message.slice(0, 240) : undefined,
  });
}

function sortObject(value: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(value)
    .filter((key) => value[key] !== undefined)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      const item = value[key];
      acc[key] = item && typeof item === 'object' && !Array.isArray(item) ? sortObject(item as Record<string, unknown>) : item;
      return acc;
    }, {});
}

async function handlePhoneCall(payload: ActionRequest['payload'], demoMode: boolean): Promise<any> {
  if (!demoMode) {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const TWILIO_API_KEY = Deno.env.get('TWILIO_API_KEY');

    if (LOVABLE_API_KEY && TWILIO_API_KEY) {
      const response = await fetch('https://connector-gateway.lovable.dev/twilio/Calls.json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': TWILIO_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: payload.phone || '',
          From: Deno.env.get('TWILIO_PHONE_NUMBER') || '',
          Url: 'http://demo.twilio.com/docs/voice.xml',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(`Twilio call failed [${response.status}]: ${JSON.stringify(data)}`);
      return { callSid: data.sid, status: data.status, provider: payload.provider, message: `Call initiated to ${payload.provider}` };
    }
  }

  return {
    callSid: `demo-${Date.now()}`,
    status: 'completed',
    duration: '2m 15s',
    provider: payload.provider || 'Restaurant',
    transcript: generateDemoTranscript(payload),
    message: `Successfully spoke with ${payload.provider || 'the establishment'}`,
    result: payload.restaurantName
      ? `Reservation confirmed at ${payload.restaurantName} for ${payload.guests || 2} guests, ${payload.date} at ${payload.time}`
      : `Call completed with ${payload.provider}`,
  };
}

async function handleReservation(payload: ActionRequest['payload'], demoMode: boolean): Promise<any> {
  return {
    confirmationId: `${demoMode ? 'DEMO' : 'SN'}-${Date.now().toString(36).toUpperCase()}`,
    restaurant: payload.restaurantName || 'Restaurant',
    date: payload.date || 'Tonight',
    time: payload.time || '20:00',
    guests: payload.guests || 2,
    status: demoMode ? 'confirmed' : 'prepared-for-provider',
    message: `Table ${demoMode ? 'confirmed' : 'prepared'} at ${payload.restaurantName} for ${payload.guests || 2} on ${payload.date} at ${payload.time}`,
    notes: 'Window seat requested. Dietary preferences noted.',
  };
}

async function handleDocumentFill(payload: ActionRequest['payload'], _demoMode: boolean): Promise<any> {
  const fieldCount = Object.keys(payload.formData || {}).length;
  return {
    documentType: payload.documentType,
    fieldsCompleted: fieldCount,
    status: 'draft-ready',
    message: `${payload.documentType} form completed with ${fieldCount} fields`,
    downloadUrl: '#',
    warnings: fieldCount < 5 ? ['Some required fields may be missing'] : [],
  };
}

async function handleAppointment(payload: ActionRequest['payload'], demoMode: boolean): Promise<any> {
  return {
    appointmentId: `${demoMode ? 'DEMO' : 'APT'}-${Date.now().toString(36).toUpperCase()}`,
    provider: payload.provider || 'Service Provider',
    date: payload.date,
    time: payload.time,
    status: demoMode ? 'confirmed' : 'prepared-for-provider',
    message: `Appointment ${demoMode ? 'booked' : 'prepared'} with ${payload.provider} on ${payload.date} at ${payload.time}`,
  };
}

function generateDemoTranscript(payload: ActionRequest['payload']): string[] {
  if (payload.restaurantName) {
    return [
      `AI: Hello, I'm calling on behalf of a SuperNomad guest to make a reservation at ${payload.restaurantName}.`,
      `Host: Of course! For how many guests?`,
      `AI: ${payload.guests || 2} guests, for ${payload.date || 'this evening'} at ${payload.time || '8 PM'}.`,
      `Host: Let me check... Yes, we have availability. Would you prefer indoor or terrace seating?`,
      `AI: The guest prefers a window or terrace seat if available.`,
      `Host: Perfect, I've reserved a terrace table. The confirmation number is ${Date.now().toString(36).toUpperCase()}.`,
      `AI: Thank you. Could you also note that the guest has no dietary restrictions?`,
      `Host: Noted. We look forward to welcoming your guest!`,
    ];
  }
  return [
    `AI: Hello, I'm calling on behalf of a SuperNomad member regarding ${payload.message || 'a service request'}.`,
    `Provider: How can I help?`,
    `AI: The request has been processed. Thank you for your assistance.`,
  ];
}