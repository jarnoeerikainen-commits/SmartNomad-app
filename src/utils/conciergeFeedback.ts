// ═══════════════════════════════════════════════════════════════════════════
// Concierge Outcome Feedback — closes the learning loop
// ───────────────────────────────────────────────────────────────────────────
// When the user accepts, books, dismisses, or rejects a concierge suggestion,
// we record the outcome. This drives:
//   • Memory importance bumps (good suggestions → +importance, ignored → -)
//   • Self-grading evals
//   • "Smarter every day" UX claims with real data
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from './deviceId';

export type OutcomeKind =
  | 'booking_clicked'    // user opened a booking link
  | 'booking_completed'  // confirmed booking
  | 'navigation_followed' // user tapped [NAVIGATE:x]
  | 'suggestion_accepted'
  | 'suggestion_dismissed'
  | 'suggestion_rejected'
  | 'response_helpful'
  | 'response_unhelpful'
  | 'escalated_to_human';

interface FeedbackPayload {
  kind: OutcomeKind;
  conversationId?: string | null;
  messageId?: string;
  topic?: string;
  category?: string;     // food | travel | accommodation | ...
  weight?: number;       // -1..+1 — how strong this signal is
  metadata?: Record<string, any>;
}

const LOCAL_QUEUE_KEY = 'sn_feedback_queue_v1';
const MAX_QUEUE = 100;

function readQueue(): FeedbackPayload[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]'); } catch { return []; }
}
function writeQueue(items: FeedbackPayload[]) {
  localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(items.slice(-MAX_QUEUE)));
}

/**
 * Record a single outcome. Best-effort: writes to local queue immediately
 * and tries to ship to the audit_log table (if available).
 */
export async function recordOutcome(payload: FeedbackPayload): Promise<void> {
  // Local queue (always succeeds — used by the dashboard "what made me smarter today" widget)
  const q = readQueue();
  q.push({ ...payload, metadata: { ...payload.metadata, ts: new Date().toISOString() } });
  writeQueue(q);

  // Best-effort cloud log
  try {
    await supabase.from('audit_log' as any).insert({
      device_id: getDeviceId(),
      action: `concierge.outcome.${payload.kind}`,
      resource: payload.conversationId || null,
      metadata: {
        topic: payload.topic,
        category: payload.category,
        weight: payload.weight ?? defaultWeight(payload.kind),
        messageId: payload.messageId,
        ...payload.metadata,
      },
    } as any);
  } catch { /* offline OK */ }

  // If the outcome is significant, bump matching memory importance
  const w = payload.weight ?? defaultWeight(payload.kind);
  if (Math.abs(w) >= 0.5 && payload.topic) {
    bumpMemoryImportance(payload.topic, payload.category, w).catch(() => {});
  }
}

function defaultWeight(kind: OutcomeKind): number {
  switch (kind) {
    case 'booking_completed':    return 1.0;
    case 'booking_clicked':       return 0.6;
    case 'suggestion_accepted':   return 0.5;
    case 'navigation_followed':   return 0.5;
    case 'response_helpful':      return 0.4;
    case 'response_unhelpful':    return -0.5;
    case 'suggestion_rejected':   return -0.6;
    case 'suggestion_dismissed':  return -0.2;
    case 'escalated_to_human':    return -0.3;
    default: return 0;
  }
}

async function bumpMemoryImportance(topic: string, category: string | undefined, delta: number): Promise<void> {
  const deviceId = getDeviceId();
  // Use the search RPC to find matching memories, then update importance.
  try {
    const { data } = await supabase.rpc('search_memories' as any, {
      p_device_id: deviceId,
      p_query: topic.slice(0, 100),
      p_category: category || null,
      p_limit: 3,
    } as any);
    const rows = (data as any[]) || [];
    for (const row of rows) {
      const newImportance = Math.max(1, Math.min(10, Math.round((row.importance ?? 5) + delta * 2)));
      await supabase.from('ai_memories' as any).update({ importance: newImportance } as any).eq('id', row.id);
    }
  } catch { /* OK */ }
}

export function getRecentOutcomes(limit = 20): FeedbackPayload[] {
  return readQueue().slice(-limit).reverse();
}

export function clearOutcomeQueue(): void {
  localStorage.removeItem(LOCAL_QUEUE_KEY);
}
