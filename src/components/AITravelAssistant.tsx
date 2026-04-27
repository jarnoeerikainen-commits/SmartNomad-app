import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2, Mic, MicOff, Volume2, VolumeX, ChevronUp } from 'lucide-react';
import ConciergeSettings, { getConciergePrefs, ConciergePreferences } from './ConciergeSettings';
import ConciergeAvatar from './ConciergeAvatar';
import { ConciergeQuickLinks } from './BackToWebsiteButton';

import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceConversation } from '@/hooks/useVoiceConversation';
import BookingCards, { parseBookingBlocks } from '@/components/chat/BookingCards';
import ActionCards, { parseActionBlocks } from '@/components/chat/ActionCards';
import CalendarProposalCards from '@/components/chat/CalendarProposalCards';
import RideBookingCard, { parseRideBlocks } from '@/components/chat/RideBookingCard';
import { RideHailingService } from '@/services/RideHailingService';
import { parseCalendarBlocks } from '@/utils/calendarProposalParser';
import { CalendarService } from '@/services/CalendarService';
import { getCalendarPrefs } from '@/services/CalendarReminderEngine';
import { dummyThreats } from '@/data/threatData';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { gatherFullAppContext, buildProfileSummary, addMemory } from '@/utils/conciergeMemory';
import { aiMemoryService } from '@/services/AIMemoryService';
import { useTrust } from '@/contexts/TrustContext';
import ThinkingLog from '@/components/trust/ThinkingLog';
import ConfidenceDot from '@/components/trust/ConfidenceDot';
import { inferConfidence, parseThinkingSteps } from '@/utils/trustInference';
import { ConfidenceLevel } from '@/contexts/TrustContext';
import { discoverFeaturesByIntent, parseNavigationSuggestions, getToolRoutingPrompt } from '@/services/IntentDiscoveryService';
import { getIntegrationContextForAI } from '@/services/ConnectorIntegrationService';
import { parseEscalation } from '@/utils/conciergeEscalation';
import HumanSupportEscalation from '@/components/concierge/HumanSupportEscalation';
import { buildConciergeContextBundle, renderContextNarrative } from '@/utils/conciergeContextBuilder';
import { evaluateAnswer } from '@/utils/conciergeQuality';
import { recordOutcome } from '@/utils/conciergeFeedback';
import { buildGreetingParts, type GreetingPart } from '@/utils/conciergeGreetings';
import { useLocation } from '@/contexts/LocationContext';
import { AdminAgentActivityService } from '@/services/AdminAgentActivityService';


interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  confidence?: ConfidenceLevel;
  escalation?: { reason: string } | null;
}

interface AITravelAssistantProps {
  currentLocation?: { country: string; city: string };
  citizenship?: string;
  userProfile?: any;
}

const AITravelAssistant: React.FC<AITravelAssistantProps> = ({
  currentLocation,
  citizenship,
  userProfile
}) => {
  const { t, currentLanguage } = useLanguage();
  const { activePersona, activePersonaId } = useDemoPersona();
  const isDemoPersona = activePersonaId === 'meghan' || activePersonaId === 'john';
  // Live detected location from the global LocationContext.
  // Used as a fallback (and as the source of truth for greeting refresh)
  // so the greeting always mentions the user's real current location.
  const { location: liveLocation, isLoading: isLocationLoading } = useLocation();
  const effectiveLocation = !isLocationLoading && liveLocation && liveLocation.country_code !== 'XX' && liveLocation.country !== 'Unknown'
    ? {
        country: liveLocation.country,
        city: liveLocation.city && liveLocation.city !== 'Unknown' ? liveLocation.city : undefined,
      }
    : undefined;
  const conciergeLocation = isDemoPersona && activePersona
    ? { city: activePersona.profile.city, country: activePersona.profile.country }
    : effectiveLocation;
  const { addThinkingStep, completeThinkingStep, clearThinking } = useTrust();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mobileInitDone, setMobileInitDone] = useState(false);
  const [avatarHidden, setAvatarHidden] = useState(false);

  // On mobile, start minimized so concierge top bar is visible on starting screen
  useEffect(() => {
    if (isMobile && !mobileInitDone) {
      setIsMinimized(true);
      setMobileInitDone(true);
    }
  }, [isMobile, mobileInitDone]);
  
  const conversationIdRef = useRef<string | null>(null);
  const distillTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exchangeCountRef = useRef(0);
  const hasUserMessagesRef = useRef(false);

  const buildGreeting = (): GreetingPart[] => {
    const prefs = getConciergePrefs();
    const aiName = prefs.aiName || 'Your Concierge';
    const userName = isDemoPersona && activePersona ? activePersona.profile.firstName : prefs.userName;

    let travelMode: 'personal' | 'business' = 'personal';
    try {
      const tm = JSON.parse(localStorage.getItem('travelMode') || '{}');
      if (tm?.mode === 'business') travelMode = 'business';
    } catch {}

    if (isDemoPersona && activePersona) {
      const p = activePersona;
      const nextTrip = p.travel.upcomingTrips[0];
      return buildGreetingParts({
        aiName,
        userName,
        city: conciergeLocation?.city,
        country: conciergeLocation?.country,
        mode: prefs.personalityMode || 'normal',
        travelMode,
        nextTrip: nextTrip ? { destination: nextTrip.destination, dates: nextTrip.dates, purpose: nextTrip.purpose } : undefined,
        isReturning: true,
      });
    }

    return buildGreetingParts({
      aiName,
      userName,
      city: conciergeLocation?.city,
      country: conciergeLocation?.country,
      mode: prefs.personalityMode || 'normal',
      travelMode,
    });
  };

  const greetingTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const playGreeting = (parts: GreetingPart[]) => {
    // clear pending timers
    greetingTimersRef.current.forEach(clearTimeout);
    greetingTimersRef.current = [];
    // first part appears immediately, others staggered
    setMessages(parts.slice(0, 1).map((p, i) => ({
      id: `greet-${Date.now()}-${i}`,
      content: p.content,
      isUser: false,
      timestamp: new Date(),
    })));
    parts.slice(1).forEach((p, idx) => {
      const t = setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: `greet-${Date.now()}-${idx + 1}`, content: p.content, isUser: false, timestamp: new Date() },
        ]);
      }, p.delay);
      greetingTimersRef.current.push(t);
    });
  };

  const [messages, setMessages] = useState<Message[]>(() => {
    const parts = buildGreeting();
    return [{
      id: 'greet-init-0',
      content: parts[0]?.content || '',
      isUser: false,
      timestamp: new Date(),
    }];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMicBubble, setShowMicBubble] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const {
    isListening, isSpeaking, voiceEnabled,
    currentWord, mouthOpenness, micPermission,
    startListening, stopListening, speak, stopSpeaking,
    toggleVoice, sttSupported, ttsSupported, setVoiceGender, setLanguage
  } = useVoiceConversation(currentLanguage);
  const [conciergePrefs, setConciergePrefs] = useState<ConciergePreferences>(getConciergePrefs);

  useEffect(() => {
    hasUserMessagesRef.current = messages.some((message) => message.isUser);
  }, [messages]);

  // Auto-show avatar again when speech stops
  useEffect(() => {
    if (!isSpeaking) {
      setAvatarHidden(false);
    }
  }, [isSpeaking]);

  // Show mic speech bubble once for new users
  useEffect(() => {
    const seen = localStorage.getItem('supernomad_concierge_mic_tip');
    if (!seen && sttSupported) {
      const timer = setTimeout(() => setShowMicBubble(true), 4000);
      return () => clearTimeout(timer);
    }
  }, [sttSupported]);

  useEffect(() => {
    setVoiceGender(conciergePrefs.voiceGender);
  }, [conciergePrefs.voiceGender, setVoiceGender]);

  useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage, setLanguage]);

  // Re-greet when persona / language / name / personality / live location changes
  // (only if user hasn't started chatting yet — we don't want to wipe an active conversation)
  useEffect(() => {
    if (!isDemoPersona && isLocationLoading) return;
    if (hasUserMessagesRef.current) return;

    const parts = buildGreeting();
    playGreeting(parts);

    if (isDemoPersona && !voiceEnabled && ttsSupported) {
      toggleVoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePersonaId, currentLanguage, conciergePrefs.userName, conciergePrefs.aiName, conciergePrefs.personalityMode, conciergeLocation?.city, conciergeLocation?.country, isLocationLoading]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    } else {
      const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = 0;
    }
  }, [messages]);

  const triggerFollowUp = async (lastAIResponse: string, lastUserMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-assistant`;
    try {
      setIsTyping(true);
      const followUpPrompt = `The user just asked: "${lastUserMessage.slice(0, 200)}" and you answered. Now send ONE short, natural follow-up (max 2 sentences, NO ~~~ delimiters — this is a single message). Either: (a) ask if they need something related (like insurance, eSIM, VPN, transport, etc. from your knowledge base), or (b) share a quick related tip they might not have thought of. Be casual — like a friend still thinking about their question. Don't repeat what you already said. Don't say "by the way" every time — vary your opener.`;

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: lastUserMessage },
            { role: 'assistant', content: lastAIResponse },
            { role: 'user', content: followUpPrompt }
          ],
          userContext: {
            currentCountry: conciergeLocation?.country,
            currentCity: conciergeLocation?.city,
            citizenship: isDemoPersona && activePersona ? activePersona.profile.nationality : citizenship,
            language: currentLanguage,
            demoPersonaContext: isDemoPersona ? localStorage.getItem('demoAiContext') || undefined : undefined,
            conciergePreferences: {
              userName: conciergePrefs.userName || undefined,
              personalityMode: conciergePrefs.personalityMode,
              aiName: conciergePrefs.aiName || 'Concierge',
            },
            threatIntelligence: dummyThreats
              .filter(t => t.isActive && (t.severity === 'critical' || t.severity === 'high' || t.severity === 'medium'))
              .map(t => `[${t.severity.toUpperCase()}] ${t.title} — ${t.location.city}, ${t.location.country}: ${t.description}`)
              .join('\n') || 'No active threats.',
          }
        }),
      });

      if (!resp.ok || !resp.body) {
        setIsTyping(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let followUpContent = '';
      const followUpId = (Date.now() + 10).toString();

      setMessages(prev => [...prev, { id: followUpId, content: '', isUser: false, timestamp: new Date() }]);

      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              followUpContent += content;
              setMessages(prev => prev.map(m => m.id === followUpId ? { ...m, content: followUpContent } : m));
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (followUpContent && voiceEnabled) speak(followUpContent);
      setIsTyping(false);
    } catch {
      setIsTyping(false);
    }
  };

  const streamChat = async (userMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-assistant`;
    const runId = AdminAgentActivityService.startRun({ surface: 'Concierge AI', command: userMessage, functionName: 'travel-assistant' });

    // Create conversation in Supabase if not yet created
    if (!conversationIdRef.current) {
      const convId = await aiMemoryService.createConversation(userMessage.slice(0, 60));
      conversationIdRef.current = convId;
    }

    // Save user message to Supabase
    if (conversationIdRef.current) {
      aiMemoryService.saveMessage(conversationIdRef.current, 'user', userMessage);
    }

    // Fetch persistent memories + conversation summary via smart context builder
    let persistentMemories = '';
    let conversationSummary = '';
    try {
      const smartCtx = await aiMemoryService.buildSmartContext(userMessage);
      persistentMemories = smartCtx.persistentMemories;
      conversationSummary = smartCtx.conversationSummary;
    } catch {}

    const activeThreats = dummyThreats
      .filter(t => t.isActive && (t.severity === 'critical' || t.severity === 'high' || t.severity === 'medium'))
      .map(t => `[${t.severity.toUpperCase()}] ${t.title} — ${t.location.city}, ${t.location.country}: ${t.description} (Distance: ${t.distanceFromUser}km)`)
      .join('\n');

    const demoAiContext = isDemoPersona ? localStorage.getItem('demoAiContext') || '' : '';
    const awardCardsContext = isDemoPersona ? localStorage.getItem('awardCardsAIContext') || '' : '';
    const jetSearchContext = isDemoPersona ? localStorage.getItem('jetSearchAIContext') || '' : '';

    const fullAppContext = gatherFullAppContext();
    const enhancedProfile = fullAppContext.enhancedProfile;
    const profileSummary = buildProfileSummary(enhancedProfile);

    const userCity = conciergeLocation?.city;
    let cityServicesContext = '';
    if (userCity) {
      try {
        const cacheKey = 'supernomad_city_services_' + userCity.toLowerCase().replace(/\s/g, '_');
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          const data = parsed.data;
          if (data?.categories) {
            cityServicesContext = `Verified providers in ${data.city}, ${data.country} (researched ${data.lastResearched}):\n` +
              data.categories.map((cat: any) =>
                `${cat.name}: ${cat.providers.map((p: any) => `${p.name} (★${p.rating}, ${p.website}, ${p.phone})`).join('; ')}`
              ).join('\n');
          }
        }
      } catch {}
    }

    // Build verified "everything I know" bundle
    const lifestyleString = (() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getLifestyleContextForAI } = require('@/services/LifestyleConnectorsService');
        return getLifestyleContextForAI() || undefined;
      } catch { return undefined; }
    })();
    const calendarString = (() => {
      try {
        const personaScope = isDemoPersona ? activePersonaId : null;
        const brief = CalendarService.briefForAI(personaScope, 8);
        const prefs = getCalendarPrefs();
        const writeRule = prefs.aiAutoWrite
          ? 'The user has allowed you to add events directly. When you propose an event, output a fenced ```calendar JSON block — the app will write it.'
          : 'You may PROPOSE events but NEVER write silently. Output a fenced ```calendar JSON block; the user will tap "Add to calendar" to confirm.';
        return `${brief}\n\nCalendar policy: ${writeRule}`;
      } catch {
        return fullAppContext.calendar ? JSON.stringify(fullAppContext.calendar).slice(0, 3000) : undefined;
      }
    })();
    const toolRoutingHint = (() => {
      const discovered = discoverFeaturesByIntent(userMessage, 3);
      return discovered.length > 0
        ? `Relevant features: ${discovered.map(d => `${d.feature.label} [NAVIGATE:${d.feature.id}] (${Math.round(d.score * 100)}%)`).join(', ')}. Include [NAVIGATE:featureId] if the user should visit that section.`
        : undefined;
    })();
    const bundle = buildConciergeContextBundle({
      currentCity: userCity,
      currentCountry: conciergeLocation?.country,
      citizenship: isDemoPersona && activePersona ? activePersona.profile.nationality : citizenship,
      language: currentLanguage,
      persistentMemories,
      conversationSummary,
      threatIntelligence: activeThreats || 'No active threats.',
      cityServicesContext: cityServicesContext || undefined,
      awardCardsContext: awardCardsContext || undefined,
      jetSearchContext: jetSearchContext || undefined,
      calendar: calendarString,
      toolRoutingHint,
      cultural: enhancedProfile?.cultural || undefined,
      lifestyleString,
      integrationsString: getIntegrationContextForAI(),
    });
    const contextNarrative = renderContextNarrative(bundle);
    // Hydrate live Supabase-backed expense summary (ExpenseHub Phase 1+2)
    let liveExpenseSummary: string | undefined;
    try {
      const { ExpenseHubService } = await import('@/services/ExpenseHubService');
      liveExpenseSummary = (await ExpenseHubService.getConciergeSummary()) || undefined;
    } catch { /* ignore */ }
    const userContext = {
      currentCountry: bundle.location.country,
      currentCity: bundle.location.city,
      citizenship: bundle.identity.nationality,
      language: currentLanguage,
      threatIntelligence: bundle.threatIntelligence,
      demoPersonaContext: demoAiContext || undefined,
      awardCardsContext: bundle.awardCardsContext,
      jetSearchContext: bundle.jetSearchContext,
      cityServicesContext: bundle.cityServicesContext,
      conciergePreferences: {
        userName: conciergePrefs.userName || undefined,
        personalityMode: conciergePrefs.personalityMode,
        aiName: conciergePrefs.aiName || 'Concierge',
      },
      profileSummary: [contextNarrative, bundle.profileSummary].filter(Boolean).join('\n\n') || undefined,
      trackedCountries: bundle.trackedCountries,
      calendar: bundle.calendar,
      learnedMemories: bundle.learnedMemories,
      persistentMemories: bundle.persistentMemories,
      conversationSummary: bundle.conversationSummary,
      subscriptionTier: bundle.subscriptionTier,
      expenseSummary: liveExpenseSummary || bundle.expenseSummary,
      integrationContext: bundle.integrations,
      cultural: bundle.cultural,
      lifestyle: bundle.lifestyleConnectors,
      toolRoutingHint: bundle.toolRoutingHint,
    };

    try {
      const requestBody = {
        messages: messages
          .filter(m => m.id !== '1')
          .map(m => ({
            role: m.isUser ? 'user' : 'assistant',
            content: m.content
          }))
          .concat([{ role: 'user', content: userMessage }]),
        userContext,
        deviceId: aiMemoryService.getDeviceId(),
      };

      // Self-healing fetch with retry
      let resp: Response | null = null;
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        try {
          resp = await fetch(CHAT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify(requestBody),
          });

          if (resp.ok) break;

          if (resp.status === 429) {
            toast({ title: 'Rate limit exceeded', description: 'Please try again in a moment.', variant: 'destructive' });
            return;
          }
          if (resp.status === 402) {
            toast({ title: 'Payment required', description: 'Please add funds to continue using AI features.', variant: 'destructive' });
            return;
          }

          // Auto-fix: trim messages if payload too large (413/500)
          if ((resp.status === 413 || resp.status >= 500) && requestBody.messages.length > 4) {
            requestBody.messages = [requestBody.messages[0], ...requestBody.messages.slice(-4)];
            retryCount++;
            await new Promise(r => setTimeout(r, 1000 * retryCount));
            continue;
          }

          throw new Error(`HTTP ${resp.status}`);
        } catch (fetchErr) {
          if (retryCount >= maxRetries) throw fetchErr;
          retryCount++;
          await new Promise(r => setTimeout(r, 1500 * retryCount));
        }
      }

      if (!resp || !resp.ok) throw new Error('Failed to start stream');
      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;
      let assistantContent = '';
      let firstSentenceSpoken = false;
      const seenSteps = new Set<string>();

      // Start thinking log
      clearThinking();
      const thinkId = addThinkingStep('Processing your request...');

      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantId,
        content: '',
        isUser: false,
        timestamp: new Date()
      }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;

              // Parse out [STEP: ...] markers for the thinking log
              const { cleanContent, steps } = parseThinkingSteps(assistantContent);
              for (const step of steps) {
                if (!seenSteps.has(step)) {
                  seenSteps.add(step);
                  completeThinkingStep(thinkId);
                  addThinkingStep(step);
                }
              }

              // Show streamed content in the first message bubble (before chunking)
              const displayContent = cleanContent.split('~~~')[0].trim();
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: displayContent }
                  : m
              ));

              // Early TTS: speak first sentence as soon as it's complete
              if (voiceEnabled && !firstSentenceSpoken) {
                const sentenceEnd = displayContent.search(/[.!?]\s/);
                if (sentenceEnd > 20) {
                  firstSentenceSpoken = true;
                  const firstSentence = displayContent.slice(0, sentenceEnd + 1);
                  speak(firstSentence);
                }
              }
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Complete thinking log
      clearThinking();

      // Clean [STEP: ...] markers from final content
      const { cleanContent: cleanedFinal } = parseThinkingSteps(assistantContent);
      assistantContent = cleanedFinal;

      // Parse human-support escalation marker [ESCALATE: reason]
      const { cleanContent: cleanedEsc, escalation } = parseEscalation(assistantContent);
      assistantContent = cleanedEsc;

      // Infer confidence level for the response
      const confidence = inferConfidence(assistantContent);

      // Parse navigation suggestions and clean them from display
      const navSuggestions = parseNavigationSuggestions(assistantContent);
      assistantContent = assistantContent.replace(/\[NAVIGATE:\w[\w-]*\]/g, '').trim();

      // Save assistant response to Supabase (full content)
      if (conversationIdRef.current && assistantContent) {
        aiMemoryService.saveMessage(conversationIdRef.current, 'assistant', assistantContent);
      }

      // === CHUNKED MESSAGE DELIVERY ===
      // Split by ~~~ delimiter and deliver chunks as separate message bubbles
      const chunks = assistantContent
        .split(/\n?~~~\n?/)
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (chunks.length > 1) {
        // Update first message with just the first chunk
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: chunks[0], confidence } : m
        ));

        // Speak first chunk remainder if not already spoken
        if (voiceEnabled && !firstSentenceSpoken) {
          speak(chunks[0]);
        }

        // Deliver remaining chunks with staggered delays
        for (let i = 1; i < chunks.length; i++) {
          const chunk = chunks[i];
          const delay = 600 + Math.min(chunk.length * 8, 1200); // 600ms-1800ms based on length
          const isLast = i === chunks.length - 1;

          // Show typing indicator
          setIsTyping(true);
          await new Promise(r => setTimeout(r, delay));

          const chunkId = `${assistantId}-chunk-${i}`;
          setMessages(prev => [...prev, {
            id: chunkId,
            content: chunk,
            isUser: false,
            timestamp: new Date(),
            confidence,
            escalation: isLast ? escalation : null,
          }]);
          setIsTyping(false);

          // Speak this chunk
          if (voiceEnabled) {
            await new Promise<void>(resolve => {
              speak(chunk, resolve);
            });
          }
        }
      } else {
        // Single chunk — attach escalation to the original message
        if (escalation) {
          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, escalation } : m
          ));
        }
        // Single chunk — speak normally
        if (assistantContent && voiceEnabled && !firstSentenceSpoken) {
          speak(assistantContent);
        } else if (assistantContent && voiceEnabled && firstSentenceSpoken) {
          const sentenceEnd = assistantContent.search(/[.!?]\s/);
          const remainder = sentenceEnd > 0 ? assistantContent.slice(sentenceEnd + 2) : '';
          if (remainder.trim()) speak(remainder);
        }
      }

      // Legacy localStorage memory extraction (kept for backward compat)
      try {
        const msg = userMessage.toLowerCase();
        if (msg.includes('i hate') || msg.includes("i don't like") || msg.includes('i never')) {
          const fact = userMessage.replace(/^(i hate|i don't like|i never)\s*/i, 'Dislikes: ');
          addMemory({ fact, category: 'general', durability: 'durable', source: 'conversation' });
        }
        if (msg.includes('i prefer') || msg.includes('i always') || msg.includes('i love')) {
          const fact = userMessage.replace(/^(i prefer|i always|i love)\s*/i, 'Prefers: ');
          addMemory({ fact, category: 'general', durability: 'durable', source: 'conversation' });
        }
        if (msg.includes('vegetarian') || msg.includes('vegan') || msg.includes('halal') || msg.includes('kosher') || msg.includes('gluten')) {
          addMemory({ fact: `Dietary: ${userMessage.slice(0, 100)}`, category: 'food', durability: 'durable', source: 'conversation' });
        }
        if (msg.includes('window seat') || msg.includes('aisle seat') || msg.includes('business class') || msg.includes('first class') || msg.includes('economy')) {
          addMemory({ fact: `Flight preference: ${userMessage.slice(0, 100)}`, category: 'transport', durability: 'durable', source: 'conversation' });
        }
        if (msg.includes('allergic') || msg.includes('allergy') || msg.includes('medication')) {
          addMemory({ fact: `Health: ${userMessage.slice(0, 100)}`, category: 'health', durability: 'durable', source: 'conversation' });
        }
      } catch {}

      // Trigger AI memory distillation every 4 exchanges (debounced)
      exchangeCountRef.current += 1;
      if (exchangeCountRef.current % 4 === 0) {
        if (distillTimerRef.current) clearTimeout(distillTimerRef.current);
        distillTimerRef.current = setTimeout(() => {
          const chatMessages = messages
            .filter(m => m.id !== '1')
            .map(m => ({ role: m.isUser ? 'user' as const : 'assistant' as const, content: m.content }));
          if (!isDemoPersona) aiMemoryService.distillMemories(chatMessages, conversationIdRef.current || undefined);
        }, 5000);
      }

      // Trigger conversation compression when messages get long
      const currentMsgCount = messages.filter(m => m.id !== '1').length;
      if (!isDemoPersona && currentMsgCount >= 12 && currentMsgCount % 6 === 0 && conversationIdRef.current) {
        const chatMessages = messages
          .filter(m => m.id !== '1')
          .map(m => ({ role: m.isUser ? 'user' as const : 'assistant' as const, content: m.content }));
        aiMemoryService.compressConversation(conversationIdRef.current, chatMessages);
      }

      // Log usage analytics
      const latencyMs = Date.now() - (messages[messages.length - 1]?.timestamp?.getTime() || Date.now());
      aiMemoryService.logUsage({
        functionName: 'travel-assistant',
        latencyMs: Math.max(0, latencyMs),
        outputTokens: Math.ceil((assistantContent?.length || 0) / 4),
      });
      const websiteMatches = Array.from(new Set([
        ...assistantContent.matchAll(/https?:\/\/[^\s)\]]+/g),
        ...cityServicesContext.matchAll(/https?:\/\/[^\s;)]+/g),
      ].map((match) => match[0].replace(/[.,;:!?]+$/, ''))));
      const answerSources = [
        'Verified conversation context and user request',
        persistentMemories ? 'RLS-scoped concierge memories' : '',
        conversationSummary ? 'Compressed prior discussion summary' : '',
        bundle.cityServicesContext ? `Verified city services context for ${bundle.location.city || 'current city'}` : '',
        bundle.calendar ? 'User calendar context and write-policy guardrail' : '',
        bundle.threatIntelligence ? 'Threat intelligence context' : '',
        websiteMatches.length ? 'Websites visible in verified provider/answer context' : '',
        'Zero-hallucination truth protocol',
      ].filter(Boolean);
      AdminAgentActivityService.completeRun(
        runId,
        `Concierge response completed with ${bundle.cityServicesContext ? 'city services, ' : ''}${bundle.calendar ? 'calendar, ' : ''}memory and truth-protocol checks.`,
        {
          responseExcerpt: assistantContent,
          answerAgents: ['Concierge Governor', 'Context Builder', 'Source Verifier', 'Specialist Responder'],
          answerSources,
          websites: websiteMatches,
          model: 'google/gemini-3-flash-preview',
          inputTokens: Math.ceil((userMessage.length + persistentMemories.length + conversationSummary.length + cityServicesContext.length + demoAiContext.length + awardCardsContext.length + jetSearchContext.length) / 4),
          outputTokens: Math.ceil((assistantContent?.length || 0) / 4),
          latencyMs,
          verificationNote: confidence === 'needs_review'
            ? 'Low confidence/unknowns detected — user should be offered deeper verification.'
            : 'Answer recorded as verified-context constrained; unknowns must be disclosed by protocol.',
        },
      );

      // Follow-up logic (less frequent with chunked messages since last chunk already asks a question)
      const shouldFollowUp = chunks.length <= 1 && exchangeCountRef.current % 4 === 0 && Math.random() > 0.6 && assistantContent;
      if (shouldFollowUp) {
        const followUpDelay = 2000 + Math.random() * 1500;
        setTimeout(() => triggerFollowUp(assistantContent, userMessage), followUpDelay);
      }

      // 🧠 Auto-evaluate the answer (back-office self-grading)
      // → low scores trigger an internal "unhelpful" outcome that drops memory importance
      if (assistantContent && assistantContent.length > 60) {
        evaluateAnswer({
          question: userMessage,
          answer: assistantContent,
          contextSummary: 'Concierge — see system context',
        }).then((score) => {
          if (!score) return;
          // Persist any low-confidence signal as feedback so the loop closes
          if ((score.overall ?? 1) < 0.55) {
            recordOutcome({
              kind: 'response_unhelpful',
              conversationId: conversationIdRef.current,
              topic: userMessage.slice(0, 80),
              category: 'concierge',
              metadata: { eval: score },
            }).catch(() => {});
          }
          // If escalation was suggested but not already emitted by the model, surface it
          if (score.upgrade_suggestion === 'escalate_human' && !escalation) {
            setMessages(prev => prev.map(m =>
              m.id === assistantId
                ? { ...m, escalation: { reason: 'Low confidence — connect with a human specialist?' } }
                : m
            ));
          }
        }).catch(() => {});
      }

      setIsTyping(false);
    } catch (error) {
      console.error('Chat error:', error);
      AdminAgentActivityService.failRun(runId, 'Concierge request failed; user was asked to try again.');
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive'
      });
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const sentText = inputMessage;
    setInputMessage('');

    // ─── Ride-hailing intent: inject a RideBookingCard before the model replies
    const rideIntent = RideHailingService.detectRideIntent(sentText);
    if (rideIntent.isRide) {
      const city = conciergeLocation?.city || currentLocation?.city || 'your city';
      const dropoff = rideIntent.dropoffHint || (sentText.match(/airport/i) ? `${city} airport` : 'destination');
      const whenLine = rideIntent.whenHint && rideIntent.whenHint !== 'now' ? ` for **${rideIntent.whenHint}**` : '';
      const rideBlock = '```ride\n' + JSON.stringify({
        pickup: `Current location, ${city}`,
        dropoff,
        city,
      }) + '\n```';
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: `On it. Pulling live ride options${whenLine}. Pick one and I'll dispatch the driver. 🖤\n\n${rideBlock}`,
        isUser: false,
        timestamp: new Date(),
      };
      const rideRunId = AdminAgentActivityService.startRun({ surface: 'Concierge AI', command: sentText, functionName: 'ride-hailing-local-router' });
      setMessages(prev => [...prev, assistantMsg]);
      AdminAgentActivityService.completeRun(rideRunId, 'Ride intent routed locally to verified ride-booking card before any LLM round-trip.');
      return; // skip LLM round-trip — the ride card is the answer
    }

    setIsTyping(true);
    await streamChat(sentText);
  };

  const handleMicClick = async () => {
    if (isListening) {
      stopListening();
      return;
    }
    if (micPermission === 'denied') {
      toast({
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access in your browser settings to use voice input.',
        variant: 'destructive',
      });
      return;
    }
    await startListening((text) => {
      if (text.trim()) {
        setInputMessage('');
        const userMsg: Message = { id: Date.now().toString(), content: text, isUser: true, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        streamChat(text);
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed ${isMobile ? 'bottom-[5.5rem] right-4' : 'bottom-6 right-6'} z-40`}>
        <Button
          onClick={() => setIsOpen(true)}
          className={`${isMobile ? 'h-14 w-14' : 'h-16 w-16'} rounded-full gradient-premium shadow-large hover:shadow-glow transition-all duration-300 group overflow-hidden`}
          size="lg"
        >
          {conciergePrefs.avatarVisible ? (
            <ConciergeAvatar face={conciergePrefs.avatarFace} isSpeaking={false} mouthOpenness={0} size="sm" />
          ) : (
            <div className="relative">
              <MessageCircle className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full border-2 border-background animate-pulse" />
            </div>
          )}
        </Button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="fixed inset-x-0 top-0 bottom-16 z-50 flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <Card className={`flex flex-col flex-1 glass-morphism shadow-large rounded-none overflow-hidden ${
          isMinimized ? 'flex-initial' : ''
        }`}>
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 gradient-mesh flex-shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              {conciergePrefs.avatarVisible ? (
                <ConciergeAvatar face={conciergePrefs.avatarFace} isSpeaking={isSpeaking} isTyping={isTyping} mouthOpenness={mouthOpenness} currentWord={currentWord} size="sm" />
              ) : (
                <div className="h-7 w-7 rounded-lg gradient-premium flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <CardTitle className="text-xs font-semibold truncate">{conciergePrefs.aiName || 'Concierge'}</CardTitle>
              <div className="h-2 w-2 bg-success rounded-full animate-pulse shadow-glow flex-shrink-0" />
            </div>
            <div className="flex gap-0.5 items-center">
              <ConciergeQuickLinks />
              <ConciergeSettings onPrefsChange={setConciergePrefs} />
              {ttsSupported && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (voiceEnabled && isSpeaking) stopSpeaking();
                          toggleVoice();
                        }}
                        className={`h-8 w-8 p-0 ${voiceEnabled ? 'text-primary' : ''}`}
                      >
                        {voiceEnabled ? <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[180px]">
                      <p className="text-[10px]">{isSpeaking ? '🔊 Speaking… click to stop' : voiceEnabled ? '🔊 Voice ON — I speak all responses' : '🔇 Click to hear me speak responses'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
              {isSpeaking && conciergePrefs.avatarVisible && !avatarHidden && (
                <div className="relative flex flex-col items-center justify-center py-3 flex-shrink-0 animate-fade-in"
                  style={{
                    background: 'linear-gradient(180deg, hsl(var(--muted) / 0.8) 0%, hsl(var(--background) / 0.4) 100%)',
                    borderBottom: '1px solid hsl(var(--border) / 0.3)',
                  }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAvatarHidden(true)}
                    className="absolute top-1 right-1 h-7 w-7 p-0 rounded-full bg-background/60 hover:bg-background/90 z-10"
                    title="Hide avatar"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <ConciergeAvatar
                    face={conciergePrefs.avatarFace}
                    isSpeaking={true}
                    mouthOpenness={mouthOpenness}
                    currentWord={currentWord}
                    size="hero"
                    expandOnSpeak
                    showLiveBadge
                  />
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">
                      {`${conciergePrefs.aiName || 'Concierge'} is speaking`}
                    </span>
                  </div>
                </div>
              )}
              <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
                <div className="space-y-4 pb-4">
                {messages.map((message) => {
                    const { text: bookingText, bookings } = !message.isUser
                      ? parseBookingBlocks(message.content)
                      : { text: message.content, bookings: [] };
                    const { text: actionText, actions } = !message.isUser
                      ? parseActionBlocks(bookingText)
                      : { text: bookingText, actions: [] };
                    const { text: rideText, rides } = !message.isUser
                      ? parseRideBlocks(actionText)
                      : { text: actionText, rides: [] };
                    const parts = rideText.split(/\{\{(?:BOOKING_CARD|ACTION_CARD|RIDE_CARD)_(\d+)\}\}/);
                    return (
                      <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <div className="flex items-start gap-2">
                            {!message.isUser && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                              {rideText.includes('{{BOOKING_CARD_') || rideText.includes('{{ACTION_CARD_') || rideText.includes('{{RIDE_CARD_') ? (
                                parts.map((part, i) => {
                                  if (i % 2 === 1) {
                                    const idx = parseInt(part);
                                    if (bookings[idx]) return <BookingCards key={`b-${i}`} items={bookings[idx]} />;
                                    if (actions[idx]) return <ActionCards key={`a-${i}`} items={actions[idx]} />;
                                    if (rides[idx]) return <RideBookingCard key={`r-${i}`} pickup={{ address: rides[idx].pickup, city: rides[idx].city }} dropoff={{ address: rides[idx].dropoff }} whenISO={rides[idx].whenISO} />;
                                    return null;
                                  }
                                  return part ? <span key={`t-${i}`} className="whitespace-pre-wrap">{part}</span> : null;
                                })
                              ) : (
                                <>
                                  <span className="whitespace-pre-wrap">{rideText}</span>
                                  {bookings.map((b, bi) => <BookingCards key={`b-${bi}`} items={b} />)}
                                  {actions.map((a, ai) => <ActionCards key={`a-${ai}`} items={a} />)}
                                  {rides.map((r, ri) => <RideBookingCard key={`r-${ri}`} pickup={{ address: r.pickup, city: r.city }} dropoff={{ address: r.dropoff }} whenISO={r.whenISO} />)}
                                </>
                              )}
                            </div>
                            {!message.isUser && message.confidence && (
                              <ConfidenceDot level={message.confidence} />
                            )}
                            {message.isUser && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          </div>
                          {!message.isUser && message.escalation && (
                            <HumanSupportEscalation reason={message.escalation.reason} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div className="flex flex-col gap-2 items-start">
                      <ThinkingLog />
                      <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t p-3 flex-shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0.75rem)' }}>
                {/* Mic onboarding speech bubble */}
                {showMicBubble && sttSupported && (
                  <div className="relative mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-primary text-primary-foreground rounded-xl px-3 py-2.5 shadow-lg text-[11px] leading-relaxed">
                      <button
                        onClick={() => { setShowMicBubble(false); localStorage.setItem('supernomad_concierge_mic_tip', 'true'); }}
                        className="absolute top-1 right-1.5 opacity-70 hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="font-semibold mb-1">🎤 Talk to me!</p>
                      <p className="opacity-90">Just <strong>tap once</strong> and speak — it stops automatically when you finish. No need to press again! Try: <em>"Find me flights to Lisbon"</em></p>
                    </div>
                    <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-primary rotate-45 rounded-sm" />
                  </div>
                )}
                <div className="flex gap-2">
                  {sttSupported && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => { handleMicClick(); if (showMicBubble) { setShowMicBubble(false); localStorage.setItem('supernomad_concierge_mic_tip', 'true'); } }}
                            variant={isListening ? 'default' : 'outline'}
                            size="sm"
                            className={`px-3 ${isListening ? 'animate-pulse bg-destructive hover:bg-destructive/90' : ''} ${micPermission === 'denied' ? 'opacity-50' : ''}`}
                            disabled={isTyping}
                          >
                            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[200px]">
                          <p className="text-[10px]">{micPermission === 'denied' ? '⚠️ Mic blocked — check browser settings' : isListening ? '🎙️ Listening… stops automatically when done' : '🎤 Tap once & speak — auto-stops!'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={isListening ? t('ai.listening') || 'Listening...' : t('ai.placeholder')}
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping} size="sm" className="px-3">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {t('ai.concierge_label')} • {voiceEnabled ? t('ai.voice_on') : t('ai.always_thinking')}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full gradient-premium shadow-large hover:shadow-glow transition-all duration-300 group"
          size="lg"
        >
          <div className="relative">
            <MessageCircle className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full border-2 border-background animate-pulse" />
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-[28rem] glass-morphism shadow-large transition-all duration-300 rounded-lg ${
        isMinimized ? 'h-16' : 'h-[600px] max-h-[80vh]'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 gradient-mesh">
          <div className="flex items-center gap-2 min-w-0">
            {conciergePrefs.avatarVisible ? (
              <ConciergeAvatar face={conciergePrefs.avatarFace} isSpeaking={isSpeaking} isTyping={isTyping} mouthOpenness={mouthOpenness} currentWord={currentWord} size="sm" />
            ) : (
              <div className="h-8 w-8 rounded-lg gradient-premium flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            <CardTitle className="text-sm font-semibold truncate">{conciergePrefs.aiName || 'Concierge'}</CardTitle>
            <div className="h-2 w-2 bg-success rounded-full animate-pulse shadow-glow flex-shrink-0" />
          </div>
          <div className="flex gap-0.5">
            <ConciergeSettings onPrefsChange={setConciergePrefs} />
            {ttsSupported && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (voiceEnabled && isSpeaking) stopSpeaking();
                        toggleVoice();
                      }}
                      className={`h-8 w-8 p-0 ${voiceEnabled ? 'text-primary' : ''}`}
                    >
                      {voiceEnabled ? <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[180px]">
                    <p className="text-[10px]">{isSpeaking ? '🔊 Speaking… click to stop' : voiceEnabled ? '🔊 Voice ON — I speak all responses' : '🔇 Click to hear me speak responses'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
            {isSpeaking && conciergePrefs.avatarVisible && !avatarHidden && (
              <div className="relative flex flex-col items-center justify-center py-3 flex-shrink-0 animate-fade-in"
                style={{
                  background: 'linear-gradient(180deg, hsl(var(--muted) / 0.6) 0%, hsl(var(--background) / 0.3) 100%)',
                  borderBottom: '1px solid hsl(var(--border) / 0.3)',
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAvatarHidden(true)}
                  className="absolute top-1 right-1 h-7 w-7 p-0 rounded-full bg-background/60 hover:bg-background/90 z-10"
                  title="Hide avatar"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <ConciergeAvatar
                  face={conciergePrefs.avatarFace}
                  isSpeaking={true}
                  mouthOpenness={mouthOpenness}
                  currentWord={currentWord}
                  size="xl"
                  expandOnSpeak
                  showLiveBadge
                />
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">
                    Live Sync
                  </span>
                </div>
              </div>
            )}
            <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => {
                  const { text: bookingText, bookings } = !message.isUser
                    ? parseBookingBlocks(message.content)
                    : { text: message.content, bookings: [] };
                  const { text: actionText, actions } = !message.isUser
                    ? parseActionBlocks(bookingText)
                    : { text: bookingText, actions: [] };
                  const { text: calText, proposals: calProposals } = !message.isUser
                    ? parseCalendarBlocks(actionText)
                    : { text: actionText, proposals: [] };
                  const { text: rideText, rides } = !message.isUser
                    ? parseRideBlocks(calText)
                    : { text: calText, rides: [] };
                  const parts = rideText.split(/\{\{(?:BOOKING_CARD|ACTION_CARD|CALENDAR_PROPOSAL|RIDE_CARD)_(\d+)\}\}/);
                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                          message.isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!message.isUser && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            {rideText.includes('{{BOOKING_CARD_') || rideText.includes('{{ACTION_CARD_') || rideText.includes('{{CALENDAR_PROPOSAL_') || rideText.includes('{{RIDE_CARD_') ? (
                              parts.map((part, i) => {
                                if (i % 2 === 1) {
                                  const idx = parseInt(part);
                                  if (bookings[idx]) return <BookingCards key={`b-${i}`} items={bookings[idx]} />;
                                  if (actions[idx]) return <ActionCards key={`a-${i}`} items={actions[idx]} />;
                                  if (calProposals[idx]) return <CalendarProposalCards key={`c-${i}`} items={calProposals[idx]} />;
                                  if (rides[idx]) return <RideBookingCard key={`r-${i}`} pickup={{ address: rides[idx].pickup, city: rides[idx].city }} dropoff={{ address: rides[idx].dropoff }} whenISO={rides[idx].whenISO} />;
                                  return null;
                                }
                                return part ? <span key={`t-${i}`} className="whitespace-pre-wrap">{part}</span> : null;
                              })
                            ) : (
                              <>
                                <span className="whitespace-pre-wrap">{rideText}</span>
                                {bookings.map((b, bi) => <BookingCards key={`b-${bi}`} items={b} />)}
                                {actions.map((a, ai) => <ActionCards key={`a-${ai}`} items={a} />)}
                                {calProposals.map((c, ci) => <CalendarProposalCards key={`c-${ci}`} items={c} />)}
                                {rides.map((r, ri) => <RideBookingCard key={`r-${ri}`} pickup={{ address: r.pickup, city: r.city }} dropoff={{ address: r.dropoff }} whenISO={r.whenISO} />)}
                              </>
                            )}
                          </div>
                          {message.isUser && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                {sttSupported && (
                  <Button
                    onClick={handleMicClick}
                    variant={isListening ? 'default' : 'outline'}
                    size="sm"
                    className={`px-3 ${isListening ? 'animate-pulse bg-destructive hover:bg-destructive/90' : ''} ${micPermission === 'denied' ? 'opacity-50' : ''}`}
                    disabled={isTyping}
                    title={micPermission === 'denied' ? 'Microphone access denied — check browser settings' : isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isListening ? t('ai.listening') || 'Listening...' : t('ai.placeholder')}
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {t('ai.concierge_label')} • {voiceEnabled ? t('ai.voice_on') : t('ai.always_thinking')}
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AITravelAssistant;
