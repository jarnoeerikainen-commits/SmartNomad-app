import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AITravelAssistant from '../AITravelAssistant';
import AdminAgentLive from '@/pages/admin/AdminAgentLive';

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    currentLanguage: 'en',
    t: (key: string) => ({
      'ai.placeholder': 'Ask concierge...',
      'ai.concierge_label': 'Concierge AI',
      'ai.always_thinking': 'Always thinking',
      'ai.voice_on': 'Voice on',
      'ai.listening': 'Listening...',
    }[key] || key),
  }),
}));

vi.mock('@/contexts/DemoPersonaContext', () => ({
  useDemoPersona: () => ({ activePersona: null, activePersonaId: null, setPersona: vi.fn(), isDemo: false }),
}));

vi.mock('@/contexts/LocationContext', () => ({
  useLocation: () => ({ location: null, isLoading: false }),
}));

vi.mock('@/contexts/TrustContext', () => ({
  useTrust: () => ({ addThinkingStep: vi.fn(() => 'think-1'), completeThinkingStep: vi.fn(), clearThinking: vi.fn() }),
}));

vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: () => false }));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('@/hooks/useVoiceConversation', () => ({
  useVoiceConversation: () => ({
    isListening: false,
    isSpeaking: false,
    voiceEnabled: false,
    currentWord: '',
    mouthOpenness: 0,
    micPermission: 'prompt',
    startListening: vi.fn(),
    stopListening: vi.fn(),
    speak: vi.fn(),
    stopSpeaking: vi.fn(),
    toggleVoice: vi.fn(),
    sttSupported: false,
    ttsSupported: false,
    setVoiceGender: vi.fn(),
    setLanguage: vi.fn(),
  }),
}));

vi.mock('@/components/ConciergeAvatar', () => ({ default: () => <div data-testid="concierge-avatar" /> }));
vi.mock('@/components/ConciergeSettings', async () => {
  const prefs = {
    aiName: 'Concierge',
    userName: 'John',
    personalityMode: 'normal',
    voiceGender: 'female',
    avatarVisible: false,
    avatarFace: 'female',
  };
  return { default: () => <button type="button">Settings</button>, getConciergePrefs: () => prefs };
});
vi.mock('@/components/BackToWebsiteButton', () => ({ ConciergeQuickLinks: () => <button type="button">Quick links</button> }));
vi.mock('@/components/trust/ThinkingLog', () => ({ default: () => null }));
vi.mock('@/components/trust/ConfidenceDot', () => ({ default: () => null }));
vi.mock('@/services/ConnectorIntegrationService', () => ({ getIntegrationContextForAI: () => '' }));
vi.mock('@/services/IntentDiscoveryService', () => ({
  discoverFeaturesByIntent: () => [],
  parseNavigationSuggestions: () => [],
  getToolRoutingPrompt: () => '',
}));
vi.mock('@/services/CalendarService', () => ({ CalendarService: { briefForAI: () => '' } }));
vi.mock('@/services/CalendarReminderEngine', () => ({ getCalendarPrefs: () => ({ aiAutoWrite: false }) }));
vi.mock('@/services/RideHailingService', () => ({ RideHailingService: { detectRideIntent: () => ({ isRide: false }) } }));
vi.mock('@/services/AIMemoryService', () => ({
  aiMemoryService: {
    createConversation: vi.fn(async () => 'conversation-1'),
    saveMessage: vi.fn(),
    buildSmartContext: vi.fn(async () => ({ persistentMemories: '', conversationSummary: '' })),
    getDeviceId: () => 'device-test',
    logUsage: vi.fn(),
    compressConversation: vi.fn(),
    distillMemories: vi.fn(),
  },
}));
vi.mock('@/utils/conciergeMemory', () => ({
  gatherFullAppContext: () => ({}),
  buildProfileSummary: () => '',
  addMemory: vi.fn(),
}));
vi.mock('@/utils/conciergeContextBuilder', () => ({
  buildConciergeContextBundle: () => ({
    location: {},
    identity: {},
    profileSummary: '',
    trackedCountries: [],
    learnedMemories: '',
    persistentMemories: '',
    conversationSummary: '',
    subscriptionTier: 'Free',
    integrations: '',
    threatIntelligence: '',
  }),
  renderContextNarrative: () => '',
}));
vi.mock('@/utils/conciergeGreetings', () => ({ buildGreetingParts: () => [{ content: 'Hello John. How can I help?', delay: 0 }] }));
vi.mock('@/utils/trustInference', () => ({ inferConfidence: () => 'high', parseThinkingSteps: (content: string) => ({ cleanContent: content, steps: [] }) }));
vi.mock('@/utils/conciergeEscalation', () => ({ parseEscalation: (content: string) => ({ cleanContent: content, escalation: null }) }));
vi.mock('@/utils/conciergeQuality', () => ({ evaluateAnswer: vi.fn(async () => ({ overall: 0.9 })) }));
vi.mock('@/utils/conciergeFeedback', () => ({ recordOutcome: vi.fn(async () => undefined) }));
vi.mock('@/data/threatData', () => ({ dummyThreats: [] }));
vi.mock('@/components/chat/BookingCards', () => ({ default: () => null, parseBookingBlocks: (content: string) => ({ text: content, bookings: [] }) }));
vi.mock('@/components/chat/ActionCards', () => ({ default: () => null, parseActionBlocks: (content: string) => ({ text: content, actions: [] }) }));
vi.mock('@/components/chat/CalendarProposalCards', () => ({ default: () => null }));
vi.mock('@/components/chat/RideBookingCard', () => ({ default: () => null, parseRideBlocks: (content: string) => ({ text: content, rides: [] }) }));
vi.mock('@/utils/calendarProposalParser', () => ({ parseCalendarBlocks: (content: string) => ({ text: content, proposals: [] }) }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: { invoke: vi.fn(async () => ({ data: { ok: true }, error: null })) },
  },
}));

function slowStreamResponse() {
  const encoder = new TextEncoder();
  const chunks = [
    'data: {"choices":[{"delta":{"content":"Verified answer pending source checks. "}}]}\n\n',
    'data: {"choices":[{"delta":{"content":"Use verified websites only: https://example.com. "}}]}\n\n',
    'data: {"choices":[{"delta":{"content":"If unknown, I will say I do not know and search more."}}]}\n\n',
    'data: [DONE]\n\n',
  ];
  let index = 0;
  return new ReadableStream({
    async pull(controller) {
      if (index >= chunks.length) {
        controller.close();
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, index === 0 ? 80 : 30));
      controller.enqueue(encoder.encode(chunks[index++]));
    },
  });
}

describe('AITravelAssistant slow-response resilience', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(slowStreamResponse(), { status: 200, headers: { 'Content-Type': 'text/event-stream' } })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('shows typing during a slow concierge stream, completes, and mirrors proof details into Live Agent Feed', async () => {
    const errors: unknown[] = [];
    const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => errors.push(args));
    render(
      <>
        <AITravelAssistant />
        <AdminAgentLive />
      </>,
    );

    const input = await screen.findByPlaceholderText('Ask concierge...');
    fireEvent.change(input, { target: { value: 'Find verified hotel recommendations with websites' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('RUNNING')).toBeInTheDocument();
    expect(screen.getAllByText(/Find verified hotel recommendations/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/AI Agent Workstream/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/Verified answer pending source checks/i)).toBeInTheDocument());
    expect(screen.getByText('RUNNING')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/If unknown, I will say I do not know/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getAllByText('COMPLETED').length).toBeGreaterThan(0));
    expect(screen.getAllByText(/example.com/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Failed to get response/i)).not.toBeInTheDocument();
    expect(errors).toHaveLength(0);

    errorSpy.mockRestore();
  });
});
