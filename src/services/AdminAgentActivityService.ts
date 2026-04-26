import { supabase } from '@/integrations/supabase/client';

export type AgentActivityStatus = 'running' | 'completed' | 'failed';
export type AgentStepStatus = 'queued' | 'running' | 'done' | 'blocked' | 'failed';

export interface AgentActivityStep {
  id: string;
  agent: string;
  action: string;
  source: string;
  status: AgentStepStatus;
  started_at: number;
  completed_at?: number;
}

export interface AgentActivityRun {
  id: string;
  ts: number;
  updated_at: number;
  status: AgentActivityStatus;
  user_alias: string;
  persona: string;
  surface: string;
  command: string;
  primary_agent: string;
  function_name?: string;
  route: string;
  confidence_policy: 'verified_only';
  sources: string[];
  directors: string[];
  steps: AgentActivityStep[];
  result_summary?: string;
  response_excerpt?: string;
  answer_agents?: string[];
  answer_sources?: string[];
  websites?: string[];
  verification_note?: string;
  model?: string;
  input_tokens?: number;
  output_tokens?: number;
  latency_ms?: number;
  estimated_cost_usd?: number;
  proof_hash?: string;
  error?: string;
}

const STORAGE_KEY = 'supernomad_admin_agent_activity_v1';
const MAX_RUNS = 120;
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('supernomad-agent-activity')
  : null;

let runs: AgentActivityRun[] = [];
const subscribers = new Set<(items: AgentActivityRun[]) => void>();
const timers = new Map<string, number[]>();

function now() { return Date.now(); }
function uid(prefix = 'act') { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }

function readPersona() {
  try {
    const raw = localStorage.getItem('demoPersona');
    if (raw) {
      const parsed = JSON.parse(raw);
      const name = parsed?.name || parsed?.profile?.firstName || parsed?.id;
      if (name) return String(name);
    }
  } catch {}
  try {
    const ctx = localStorage.getItem('demoAiContext') || '';
    if (/john/i.test(ctx)) return 'John Demo';
    if (/meghan/i.test(ctx)) return 'Meghan Demo';
  } catch {}
  return 'Guest / Live user';
}

function userAlias(persona: string) {
  if (/john/i.test(persona)) return 'john_demo_profile';
  if (/meghan/i.test(persona)) return 'meghan_demo_profile';
  return 'live_user_session';
}

function load() {
  if (runs.length) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) runs = JSON.parse(raw).slice(0, MAX_RUNS);
  } catch { runs = []; }
  if (!runs.length) seedDemoRuns();
}

function persist(broadcast = true) {
  runs = runs.slice(0, MAX_RUNS);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(runs)); } catch {}
  subscribers.forEach((cb) => cb([...runs]));
  if (broadcast) channel?.postMessage({ type: 'agent-activity-sync' });
}

function sourcePlan(surface: string, command: string): string[] {
  const text = `${surface} ${command}`.toLowerCase();
  const sources = ['Verified user/session context', 'Zero-hallucination truth protocol'];
  if (/visa|tax|passport|embassy|legal|health|doctor|safety|threat/.test(text)) sources.push('Official-source verification queue');
  if (/hotel|flight|restaurant|gym|club|cowork|school|moving|ride|car|book/.test(text)) sources.push('Curated provider directories + availability checks');
  if (/memory|prefer|i like|i need|remember|profile|john/.test(text)) sources.push('RLS-scoped user memory/profile context');
  if (/support|bug|broken|help/.test(text)) sources.push('Feature registry + support knowledge base');
  return Array.from(new Set(sources));
}

function routePlan(surface: string, functionName?: string, command = '') {
  const text = `${surface} ${functionName || ''} ${command}`.toLowerCase();
  if (/cyber|stolen|hack|breach|bank/.test(text)) {
    return { primary: 'Cyber Guardian', directors: ['Security Director', 'Support Director'], agents: ['Risk triage', 'Account protection', 'Human escalation gate'] };
  }
  if (/support|help|bug/.test(text)) {
    return { primary: 'Support AI', directors: ['Support Director', 'Product Director'], agents: ['Feature resolver', 'Troubleshooting agent', 'Escalation router'] };
  }
  if (/moving|relocat|inventory/.test(text)) {
    return { primary: 'Moving AI Assistant', directors: ['Relocation Director', 'Finance Director'], agents: ['Inventory estimator', 'Provider matcher', 'Quote validator'] };
  }
  if (/community|social|chat|match|reply/.test(text)) {
    return { primary: 'Community Orchestrator', directors: ['Community Director', 'Happiness Director'], agents: ['Intent router', 'Member matcher', 'Safety tone gate'] };
  }
  return { primary: 'Concierge Governor', directors: ['Concierge Director', 'Safety Director', 'Revenue Director'], agents: ['Intent router', 'Context builder', 'Source verifier', 'Specialist responder'] };
}

function buildSteps(surface: string, command: string, functionName?: string): AgentActivityStep[] {
  const route = routePlan(surface, functionName, command);
  const sources = sourcePlan(surface, command);
  return [
    { id: uid('step'), agent: route.agents[0], action: 'Classify user intent, risk and urgency', source: 'Live command text', status: 'queued', started_at: now() },
    { id: uid('step'), agent: route.agents[1] || 'Context builder', action: 'Load only verified profile, app state and session context', source: sources[0], status: 'queued', started_at: now() },
    { id: uid('step'), agent: route.agents[2] || 'Source verifier', action: 'Check whether answer needs official source verification', source: sources.slice(1).join(' · '), status: 'queued', started_at: now() },
    { id: uid('step'), agent: route.agents[3] || route.primary, action: functionName ? `Call ${functionName} and stream safe response` : 'Prepare safe response or action plan', source: 'Supabase Edge Function + truth protocol', status: 'queued', started_at: now() },
  ];
}

function seedDemoRuns() {
  const seed: AgentActivityRun = {
    id: uid('seed'),
    ts: now() - 45_000,
    updated_at: now() - 18_000,
    status: 'completed',
    user_alias: 'john_demo_profile',
    persona: 'John Demo',
    surface: 'Concierge AI',
    command: 'Find verified settling-in steps for Singapore and tell me what you know for sure.',
    primary_agent: 'Concierge Governor',
    function_name: 'travel-assistant',
    route: 'John → Concierge Governor → Safety/Source Verifier → Specialist response',
    confidence_policy: 'verified_only',
    sources: ['Verified user/session context', 'Official-source verification queue', 'Zero-hallucination truth protocol'],
    directors: ['Concierge Director', 'Safety Director'],
    steps: buildSteps('Concierge AI', 'Find verified settling-in steps for Singapore', 'travel-assistant').map((s) => ({ ...s, status: 'done', completed_at: now() - 18_000 })),
    result_summary: 'Answered with verified context only; unknown items were marked for deeper search.',
  };
  runs = [seed];
}

function setStep(runId: string, stepIndex: number, status: AgentStepStatus) {
  const run = runs.find((r) => r.id === runId);
  if (!run?.steps[stepIndex]) return;
  run.steps[stepIndex] = {
    ...run.steps[stepIndex],
    status,
    started_at: run.steps[stepIndex].started_at || now(),
    completed_at: status === 'done' || status === 'failed' || status === 'blocked' ? now() : run.steps[stepIndex].completed_at,
  };
  run.updated_at = now();
  persist();
}

function estimateCost(model = 'google/gemini-3-flash-preview', inputTokens = 0, outputTokens = 0) {
  const rates: Record<string, { input: number; output: number }> = {
    'google/gemini-3-flash-preview': { input: 0.00035, output: 0.00105 },
    'google/gemini-2.5-flash': { input: 0.0003, output: 0.001 },
    'google/gemini-2.5-flash-lite': { input: 0.0001, output: 0.0004 },
    'google/gemini-2.5-pro': { input: 0.00125, output: 0.005 },
  };
  const rate = rates[model] || rates['google/gemini-3-flash-preview'];
  return Number(((inputTokens / 1000) * rate.input + (outputTokens / 1000) * rate.output).toFixed(6));
}

async function persistProof(run: AgentActivityRun) {
  try {
    await supabase.functions.invoke('ai-execution-proof', {
      body: {
        run_ref: run.id,
        surface: run.surface,
        persona: run.persona,
        user_alias: run.user_alias,
        command: run.command,
        primary_agent: run.primary_agent,
        function_name: run.function_name,
        status: run.status,
        route: run.route,
        directors: run.directors,
        steps: run.steps,
        sources: run.sources,
        response_excerpt: run.response_excerpt,
        answer_agents: run.answer_agents,
        answer_sources: run.answer_sources,
        websites: run.websites,
        verification_note: run.verification_note,
        model: run.model || 'google/gemini-3-flash-preview',
        input_tokens: run.input_tokens || Math.ceil(run.command.length / 4),
        output_tokens: run.output_tokens || Math.ceil((run.response_excerpt || '').length / 4),
        latency_ms: run.latency_ms || Math.max(0, run.updated_at - run.ts),
        cache_hit: false,
        estimated_cost_usd: run.estimated_cost_usd,
        error: run.error,
      },
    });
  } catch {}
}

export const AdminAgentActivityService = {
  subscribe(cb: (items: AgentActivityRun[]) => void) {
    load();
    subscribers.add(cb);
    cb([...runs]);
    return () => subscribers.delete(cb);
  },
  getRuns() {
    load();
    return [...runs];
  },
  startRun(input: { surface: string; command: string; functionName?: string }) {
    load();
    const persona = readPersona();
    const route = routePlan(input.surface, input.functionName, input.command);
    const run: AgentActivityRun = {
      id: uid('run'),
      ts: now(),
      updated_at: now(),
      status: 'running',
      user_alias: userAlias(persona),
      persona,
      surface: input.surface,
      command: input.command.slice(0, 500),
      primary_agent: route.primary,
      function_name: input.functionName,
      route: `${persona} → ${route.primary} → ${route.directors.join(' / ')} → working agents`,
      confidence_policy: 'verified_only',
      sources: sourcePlan(input.surface, input.command),
      directors: route.directors,
      steps: buildSteps(input.surface, input.command, input.functionName),
      model: 'google/gemini-3-flash-preview',
      input_tokens: Math.ceil(input.command.length / 4),
    };
    runs = [run, ...runs];
    persist();
    persistProof(run);
    const ids = [0, 1, 2, 3].map((idx) => window.setTimeout(() => setStep(run.id, idx, 'running'), 350 + idx * 650));
    timers.set(run.id, ids);
    return run.id;
  },
  completeRun(runId: string, summary = 'Completed; response constrained to verified context and known sources.', details?: {
    responseExcerpt?: string;
    answerAgents?: string[];
    answerSources?: string[];
    websites?: string[];
    verificationNote?: string;
    model?: string;
    inputTokens?: number;
    outputTokens?: number;
    latencyMs?: number;
  }) {
    load();
    timers.get(runId)?.forEach((t) => clearTimeout(t));
    timers.delete(runId);
    const run = runs.find((r) => r.id === runId);
    if (!run) return;
    run.steps = run.steps.map((s) => ({ ...s, status: s.status === 'failed' || s.status === 'blocked' ? s.status : 'done', completed_at: s.completed_at || now() }));
    run.status = 'completed';
    run.result_summary = summary;
    run.response_excerpt = details?.responseExcerpt?.slice(0, 1400);
    run.answer_agents = details?.answerAgents?.slice(0, 8);
    run.answer_sources = details?.answerSources?.slice(0, 12);
    run.websites = details?.websites?.slice(0, 12);
    run.verification_note = details?.verificationNote;
    run.model = details?.model || run.model || 'google/gemini-3-flash-preview';
    run.input_tokens = details?.inputTokens || run.input_tokens || Math.ceil(run.command.length / 4);
    run.output_tokens = details?.outputTokens || Math.ceil((run.response_excerpt || '').length / 4);
    run.latency_ms = details?.latencyMs || Math.max(0, now() - run.ts);
    run.estimated_cost_usd = estimateCost(run.model, run.input_tokens, run.output_tokens);
    run.updated_at = now();
    persist();
    persistProof(run);
  },
  failRun(runId: string, error: string) {
    load();
    timers.get(runId)?.forEach((t) => clearTimeout(t));
    timers.delete(runId);
    const run = runs.find((r) => r.id === runId);
    if (!run) return;
    const active = run.steps.findIndex((s) => s.status === 'running' || s.status === 'queued');
    if (active >= 0) run.steps[active] = { ...run.steps[active], status: 'failed', completed_at: now() };
    run.status = 'failed';
    run.error = error;
    run.latency_ms = Math.max(0, now() - run.ts);
    run.estimated_cost_usd = estimateCost(run.model, run.input_tokens, run.output_tokens);
    run.updated_at = now();
    persist();
    persistProof(run);
  },
};

channel?.addEventListener('message', () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    runs = raw ? JSON.parse(raw).slice(0, MAX_RUNS) : runs;
    subscribers.forEach((cb) => cb([...runs]));
  } catch {}
});
