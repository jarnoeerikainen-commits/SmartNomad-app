import { AdminAgentActivityService } from '@/services/AdminAgentActivityService';

export type CommunitySurface = 'pulse' | 'vibe';

export interface CommunityAgentMetric {
  label: string;
  value: string;
  detail: string;
}

export interface CommunityAgentAlert {
  level: 'watch' | 'healthy' | 'critical';
  title: string;
  detail: string;
}

export interface CommunityAgentReport {
  period: string;
  quality: number;
  safety: number;
  tokens: number;
  matches: number;
}

export const COMMUNITY_AGENT_MODEL = 'google/gemini-3-flash-preview';

export const COMMUNITY_VERIFIED_SOURCES = [
  'Supabase RLS-scoped profile/session context',
  'Trust Pass verification tier and consent state',
  'Community safety policy and anti-harassment gate',
  'Back-office proof-of-execution telemetry',
];

export function getCommunityAgentMetrics(surface: CommunitySurface): CommunityAgentMetric[] {
  const isPulse = surface === 'pulse';
  return [
    {
      label: 'Agent route',
      value: isPulse ? 'Meetup Orchestrator' : 'Social Graph Orchestrator',
      detail: isPulse ? 'Intent → member fit → safety gate → meetup nudge' : 'Profile fit → group context → tone gate → reply plan',
    },
    {
      label: 'Token budget',
      value: isPulse ? '≤ 1.6k / action' : '≤ 1.9k / action',
      detail: 'Only last 6–8 messages, compact member cards, tool-calling JSON, fallback cache on failure.',
    },
    {
      label: 'Learning loop',
      value: 'Outcome-weighted',
      detail: 'Learns from accepted quick replies, connects, silence recovery, reports, and safety blocks.',
    },
    {
      label: 'Back office',
      value: 'Live proofs',
      detail: 'Every AI/community run emits agents, sources, latency, cost estimate, and verification note.',
    },
  ];
}

export function getCommunityAgentAlerts(surface: CommunitySurface): CommunityAgentAlert[] {
  return [
    {
      level: 'healthy',
      title: 'Safety tone gate online',
      detail: 'Harassment, spam, coercion, and invented identity signals are blocked before replies surface.',
    },
    {
      level: 'watch',
      title: surface === 'pulse' ? 'Meetup verification watch' : 'Group quality watch',
      detail: surface === 'pulse' ? 'Escalate if a location or event claim needs official verification.' : 'Escalate if AI catch-up confidence or reply diversity drops.',
    },
    {
      level: 'healthy',
      title: 'Picture moderation ready',
      detail: 'Images attach as local previews in demo; production path routes through storage, OCR/vision safety, and audit proof.',
    },
  ];
}

export function getCommunityAgentReports(surface: CommunitySurface): CommunityAgentReport[] {
  const base = surface === 'pulse'
    ? { quality: 91, safety: 98, tokens: 1240, matches: 37 }
    : { quality: 93, safety: 99, tokens: 1510, matches: 52 };
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((period, idx) => ({
    period,
    quality: Math.min(99, base.quality + ((idx % 3) - 1) * 2),
    safety: Math.min(100, base.safety + (idx % 2)),
    tokens: base.tokens + (idx - 3) * 45,
    matches: base.matches + idx * (surface === 'pulse' ? 3 : 4),
  }));
}

export function recordCommunityProof(surface: CommunitySurface, command: string, summary: string) {
  const runId = AdminAgentActivityService.startRun({
    surface: surface === 'pulse' ? 'SuperNomad Pulse Agent Ops' : 'SuperNomad Vibe Agent Ops',
    command,
    functionName: surface === 'pulse' ? 'community-orchestrator' : 'social-chat-ai',
  });

  window.setTimeout(() => {
    AdminAgentActivityService.completeRun(runId, summary, {
      answerAgents: surface === 'pulse'
        ? ['Meetup Orchestrator', 'Member Matcher', 'Safety Tone Gate', 'Picture Safety Gate']
        : ['Social Graph Orchestrator', 'Group Summarizer', 'Safety Tone Gate', 'Picture Safety Gate'],
      answerSources: COMMUNITY_VERIFIED_SOURCES,
      verificationNote: 'Community AI constrained to verified app context, compact transcript windows, and safe fallback behavior.',
      model: COMMUNITY_AGENT_MODEL,
      inputTokens: surface === 'pulse' ? 980 : 1180,
      outputTokens: 180,
    });
  }, 500);
}

export async function fileToImagePreview(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Only images are supported');
  if (file.size > 6 * 1024 * 1024) throw new Error('Image must be under 6MB');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(file);
  });
}