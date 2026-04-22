// ═══════════════════════════════════════════════════════════════════════════
// Concierge Quality Loop — call the back-office evaluator after each answer.
// On low scores we surface a "I'm not 100% sure" hint and flag for upgrade.
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from './deviceId';

export interface QualityScore {
  factuality?: number;
  personalization?: number;
  calibration?: number;
  overall?: number;
  issues?: string[];
  upgrade_suggestion?: 'none' | 'rerun_intelligence' | 'escalate_human' | 'add_search';
}

const LOCAL_KEY = 'sn_concierge_quality_history';
const MAX_HISTORY = 50;

export async function evaluateAnswer(input: {
  question: string;
  answer: string;
  contextSummary?: string;
}): Promise<QualityScore | null> {
  if (!input.question || !input.answer) return null;
  // Cheap pre-filter: skip eval for very short, low-stakes exchanges
  if (input.answer.length < 60) return null;

  try {
    const { data, error } = await supabase.functions.invoke('concierge-evaluator', {
      body: {
        question: input.question.slice(0, 2000),
        answer: input.answer.slice(0, 4000),
        contextSummary: (input.contextSummary || '').slice(0, 3000),
        deviceId: getDeviceId(),
      },
    });
    if (error || !data) return null;
    pushHistory(data as QualityScore);
    return data as QualityScore;
  } catch {
    return null;
  }
}

function pushHistory(score: QualityScore) {
  try {
    const arr: QualityScore[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    arr.push({ ...score, ...{ ts: Date.now() } as any });
    localStorage.setItem(LOCAL_KEY, JSON.stringify(arr.slice(-MAX_HISTORY)));
  } catch {}
}

/** Rolling average overall score — feeds the "concierge IQ rising" widget. */
export function getRollingQuality(): { avg: number; count: number; trend: 'up' | 'down' | 'flat' } {
  try {
    const arr: any[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    if (!arr.length) return { avg: 0, count: 0, trend: 'flat' };
    const recent = arr.slice(-10);
    const older = arr.slice(-20, -10);
    const recentAvg = recent.reduce((s, x) => s + (x.overall || 0), 0) / recent.length;
    const olderAvg = older.length ? older.reduce((s, x) => s + (x.overall || 0), 0) / older.length : recentAvg;
    const trend: 'up' | 'down' | 'flat' = recentAvg > olderAvg + 0.05 ? 'up' : recentAvg < olderAvg - 0.05 ? 'down' : 'flat';
    return { avg: Math.round(recentAvg * 100) / 100, count: arr.length, trend };
  } catch {
    return { avg: 0, count: 0, trend: 'flat' };
  }
}
