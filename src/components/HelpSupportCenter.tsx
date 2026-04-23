import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Bot, Send, Mic, MicOff, Volume2, VolumeX, User,
  Search, BookOpen, MessageCircle, Headphones, Phone,
  Mail, ChevronRight, Sparkles, HelpCircle, Shield,
  Globe, Zap, FileText, AlertCircle, CheckCircle2,
  ArrowRight, Clock, Heart, LifeBuoy, Video, X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceConversation } from '@/hooks/useVoiceConversation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FEATURE_REGISTRY, CATEGORY_LABELS } from '@/data/featureRegistry';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ═══════════════════════════════════════
// QUICK HELP TOPICS
// ═══════════════════════════════════════
const QUICK_TOPICS = [
  { icon: Sparkles, label: 'Maximize My App', question: 'What features should I be using based on my profile? Help me get the full potential from this app.' },
  { icon: Globe, label: 'Country Tracking', question: 'How do I track my time in different countries?' },
  { icon: Shield, label: 'Tax Residency', question: 'How does the tax residency tracker work?' },
  { icon: Bot, label: 'AI Concierge', question: 'How do I use the AI travel concierge?' },
  { icon: Mic, label: 'Voice Control', question: 'How do I use voice commands in the app?' },
  { icon: FileText, label: 'Documents', question: 'How do I store my documents securely?' },
  { icon: Zap, label: 'eSIM Setup', question: 'How do I set up an eSIM for travel?' },
  { icon: Heart, label: 'All Features', question: 'Give me a complete overview of every feature in this app and how to access them.' },
];

const FAQ_CATEGORIES = [
  {
    title: 'Getting Started',
    icon: Sparkles,
    faqs: [
      { q: 'What is SuperNomad?', a: 'SuperNomad is the world\'s most comprehensive digital nomad platform — covering 100+ cities with AI-powered travel assistance, tax tracking, local services, and community features.' },
      { q: 'How do I navigate the app?', a: 'Use the sidebar menu on the left to browse sections. The AI Concierge (bottom-right) can guide you anywhere. You can also use voice commands — click the mic icon in the header.' },
      { q: 'Is the app free?', a: 'SuperNomad offers Free (basic features), Pro (all AI features + unlimited tracking), and Premium (everything + priority support) tiers.' },
      { q: 'How do I change the language?', a: 'Click the flag icon in the top-right header to choose from 13 available languages. All content updates instantly.' },
    ]
  },
  {
    title: 'Tax & Tracking',
    icon: Shield,
    faqs: [
      { q: 'How does country tracking work?', a: 'Go to Tracking → Country Tracker. Add countries manually or enable GPS auto-tracking. The app tracks your days in each country for tax residency purposes.' },
      { q: 'What is the Schengen calculator?', a: 'It tracks your 90/180-day limit in the Schengen zone. Add entry/exit dates and it shows remaining allowed days.' },
      { q: 'How do I export tax reports?', a: 'Go to Tracking → Tax Residency Reports → Export PDF. You\'ll get a comprehensive breakdown of your travel days per country.' },
    ]
  },
  {
    title: 'AI Features',
    icon: Bot,
    faqs: [
      { q: 'What AI features are available?', a: 'Travel Concierge (booking + advice), Health Advisor, Legal Advisor, Tax Advisor, Travel Planner, Cyber Guardian, and AI-powered City Services research.' },
      { q: 'Can the AI book flights?', a: 'The AI Concierge generates deep links to Skyscanner, Booking.com, and Kayak with your search pre-filled. Click the booking cards to complete on the provider\'s site.' },
      { q: 'Does voice work with AI?', a: 'Yes! All AI advisors support voice input (mic button) and voice output (speaker toggle). Works in all 13 languages.' },
    ]
  },
  {
    title: 'Privacy & Security',
    icon: Shield,
    faqs: [
      { q: 'Is my data secure?', a: 'Yes. All personal data is stored locally on your device. No PII is sent to servers. AI chats are sanitized and not stored server-side.' },
      { q: 'How do I delete my data?', a: 'Go to Profile → Settings → Data Management → Delete All Data. This is GDPR compliant and removes everything.' },
      { q: 'Does the app track my location?', a: 'Only when you enable it. Location Auto-Tracker uses GPS for country tracking. You can disable it anytime in Settings.' },
    ]
  },
];

// ═══════════════════════════════════════
// AI SUPPORT CHAT COMPONENT
// ═══════════════════════════════════════
const AISupportChat = () => {
  const { currentLanguage, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-ai`;

  // Gather user context for personalized AI support
  const getUserContext = useCallback(() => {
    const context: Record<string, any> = {};
    try {
      const profile = localStorage.getItem('enhancedProfile');
      if (profile) {
        const p = JSON.parse(profile);
        context.userName = p?.core?.personal?.firstName || '';
        context.travelStyle = p?.travel?.preferences?.travelStyle?.purpose || [];
      }
    } catch {}
    try {
      const countries = localStorage.getItem('trackedCountries');
      if (countries) {
        const c = JSON.parse(countries);
        context.trackedCountries = c.length;
        context.countryNames = c.slice(0, 10).map((x: any) => x.name);
      }
    } catch {}
    try {
      const prefs = localStorage.getItem('featurePreferences');
      if (prefs) {
        const p = JSON.parse(prefs);
        context.hiddenFeatures = p.hidden || [];
        context.pinnedFeatures = p.pinned || [];
      }
    } catch {}
    try {
      const sub = localStorage.getItem('subscription');
      if (sub) context.subscription = JSON.parse(sub).tier;
    } catch {}
    try {
      const persona = localStorage.getItem('demoPersona');
      if (persona) context.activePersona = JSON.parse(persona).name;
    } catch {}

    // Auto-generate feature catalog from registry + multilingual aliases.
    // Adding a feature anywhere instantly makes Support AI aware of it,
    // including aliases so users can ask in natural language / any language.
    const { buildFeatureCatalogForAI } = await import('@/data/featureAutoSync');
    context.featureCatalog = buildFeatureCatalogForAI();
    context.totalFeatures = FEATURE_REGISTRY.length;

    return context;
  }, []);

  const {
    isListening, isSpeaking, voiceEnabled,
    startListening, stopListening, speak, stopSpeaking,
    toggleVoice, sttSupported, ttsSupported, setLanguage,
  } = useVoiceConversation(currentLanguage);

  useEffect(() => { setLanguage(currentLanguage); }, [currentLanguage, setLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: currentLanguage === 'en'
          ? "Hi! 👋 I'm your SuperNomad Support AI. I know everything about the app — how to use every feature, troubleshooting, tips & tricks. Ask me anything!\n\nYou can also use your voice — click the mic button to speak. 🎤"
          : t('supportAiWelcome') || "Hi! 👋 I'm your SuperNomad Support AI. Ask me anything about the app!",
        timestamp: new Date(),
      }]);
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const allMessages = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    let assistantSoFar = '';

    try {
      const resp = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages, language: currentLanguage, userContext: getUserContext() }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error(`Error ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && last.id !== 'welcome') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { id: 'ai-' + Date.now(), role: 'assistant', content: assistantSoFar, timestamp: new Date() }];
              });
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // 🧠 Closed-loop learning: distill memories + self-grade
      if (assistantSoFar) {
        const { learnFromExchange } = await import('@/utils/conciergeLearning');
        learnFromExchange({
          surface: 'support',
          question: text,
          answer: assistantSoFar,
          contextSummary: JSON.stringify(getUserContext()).slice(0, 2000),
          category: 'support',
          topic: text.slice(0, 80),
        });
      }

      // Speak the response if voice enabled
      if (voiceEnabled && assistantSoFar) {
        const cleanText = assistantSoFar
          .replace(/```[\s\S]*?```/g, '')
          .replace(/\[.*?\]\((.*?)\)/g, '')
          .replace(/[*_#`>]/g, '')
          .replace(/https?:\/\/S+/g, '')
          .replace(/\n{2,}/g, '. ')
          .trim();
        if (cleanText) speak(cleanText);
      }

      // Check if escalation needed
      if (assistantSoFar.toLowerCase().includes('human agent') || assistantSoFar.toLowerCase().includes('support ticket')) {
        setShowEscalation(true);
      }

    } catch (err: any) {
      toast.error('Support AI temporarily unavailable. Please try again.');
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: '⚠️ I\'m having trouble connecting right now. Please try again, or click "Contact Human Agent" below for immediate help.',
        timestamp: new Date(),
      }]);
      setShowEscalation(true);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, currentLanguage, voiceEnabled, speak, chatUrl, getUserContext]);

  const handleQuickTopic = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-16rem)] sm:h-[600px] border rounded-xl overflow-hidden bg-background">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">SuperNomad AI Support</h3>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Online • Knows everything about the app</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {ttsSupported && (
            <Button
              variant="ghost" size="sm"
              onClick={toggleVoice}
              className={`h-8 w-8 p-0 ${voiceEnabled ? 'text-primary' : ''}`}
              title={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
            >
              {voiceEnabled ? <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} /> : <VolumeX className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted rounded-bl-sm'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  <span className="text-[10px] opacity-70">{msg.role === 'user' ? 'You' : 'AI Support'}</span>
                </div>
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Topics (show at start) */}
          {messages.length <= 1 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-muted-foreground font-medium">Popular questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_TOPICS.map((topic, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-3 text-left justify-start gap-2 text-xs"
                    onClick={() => handleQuickTopic(topic.question)}
                  >
                    <topic.icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {topic.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Escalation CTA */}
          {showEscalation && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Headphones className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Need a human agent?</p>
                    <p className="text-xs text-muted-foreground">Our support team is available 24/7</p>
                  </div>
                  <Button size="sm" variant="default" onClick={() => {
                    // Scroll to contact section
                    document.getElementById('contact-human')?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t bg-background">
        <div className="flex items-center gap-2">
          {sttSupported && (
            <Button
              variant={isListening ? 'default' : 'outline'}
              size="sm"
              className={`h-10 w-10 p-0 flex-shrink-0 ${isListening ? 'animate-pulse bg-destructive hover:bg-destructive/90' : ''}`}
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  startListening((text) => {
                    if (text.trim()) sendMessage(text);
                  });
                }
              }}
              title={isListening ? 'Stop listening' : 'Speak your question'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          <Input
            placeholder={isListening ? '🎤 Listening...' : 'Ask anything about SuperNomad...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            disabled={isLoading || isListening}
            className="flex-1"
          />
          <Button
            size="sm"
            className="h-10 w-10 p-0 flex-shrink-0"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {isListening && (
          <p className="text-xs text-center text-destructive mt-2 animate-pulse">
            🎤 Listening... Speak your question, then pause to send
          </p>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════
// MAIN HELP & SUPPORT CENTER
// ═══════════════════════════════════════
const HelpSupportCenter: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = FAQ_CATEGORIES.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(faq =>
      !searchQuery ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.faqs.length > 0);

  return (
    <div className="space-y-8 p-6">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <LifeBuoy className="h-7 w-7 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Help & Support</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get instant help from our AI or connect with a real person. We're here 24/7.
        </p>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-primary" />
            <span>Instant AI answers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span>24/7 available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mic className="h-4 w-4 text-primary" />
            <span>Voice enabled</span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="ai-chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto">
          <TabsTrigger value="ai-chat" className="gap-2">
            <Bot className="h-4 w-4" />
            AI Support
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Headphones className="h-4 w-4" />
            Contact Us
          </TabsTrigger>
        </TabsList>

        {/* AI CHAT TAB */}
        <TabsContent value="ai-chat" className="mt-6">
          <div className="max-w-3xl mx-auto">
            <AISupportChat />
          </div>
        </TabsContent>

        {/* KNOWLEDGE BASE TAB */}
        <TabsContent value="knowledge" className="mt-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
              {searchQuery && (
                <Button variant="ghost" size="sm" className="absolute right-2 top-2" onClick={() => setSearchQuery('')}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* FAQ Categories */}
            {filteredFaqs.map((category, catIdx) => (
              <Card key={catIdx}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 pt-0">
                  {category.faqs.map((faq, faqIdx) => {
                    const faqId = `${catIdx}-${faqIdx}`;
                    const isExpanded = expandedFaq === faqId;
                    return (
                      <div key={faqIdx}>
                        <button
                          className="w-full text-left py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-between gap-3"
                          onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                        >
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium">{faq.q}</span>
                          </div>
                          <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="ml-9 mr-3 pb-3 text-sm text-muted-foreground animate-fade-in">
                            {faq.a}
                          </div>
                        )}
                        {faqIdx < category.faqs.length - 1 && <Separator className="mx-3" />}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}

            {filteredFaqs.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No results for "{searchQuery}"</p>
                  <p className="text-sm text-muted-foreground mt-1">Try the AI Support chat for more specific help</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* CONTACT TAB */}
        <TabsContent value="contact" className="mt-6" id="contact-human">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Live Agent Card */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Headphones className="h-10 w-10 text-primary" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Talk to a Real Person</h3>
                    <p className="text-muted-foreground mb-4">
                      Our support team is standing by. In the demo, this connects to our ticket system.
                      In production, you'll get instant connection to a live agent.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <Badge variant="secondary" className="gap-1.5 py-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        24/7 Available
                      </Badge>
                      <Badge variant="secondary" className="gap-1.5 py-1.5">
                        <Globe className="h-3.5 w-3.5" />
                        13 Languages
                      </Badge>
                      <Badge variant="secondary" className="gap-1.5 py-1.5">
                        <Zap className="h-3.5 w-3.5" />
                        Avg. 2 min response
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => {
                toast.info('Demo Mode: In production, this opens a live chat with our support team.', { duration: 5000 });
              }}>
                <CardContent className="p-6 text-center space-y-3">
                  <div className="h-14 w-14 mx-auto rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-7 w-7 text-blue-500" />
                  </div>
                  <h4 className="font-semibold">Live Chat</h4>
                  <p className="text-xs text-muted-foreground">Instant messaging with our support team</p>
                  <Badge variant="outline" className="text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
                    Online now
                  </Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => {
                toast.info('Demo Mode: In production, this starts a video call with our support team.', { duration: 5000 });
              }}>
                <CardContent className="p-6 text-center space-y-3">
                  <div className="h-14 w-14 mx-auto rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="h-7 w-7 text-purple-500" />
                  </div>
                  <h4 className="font-semibold">Video Call</h4>
                  <p className="text-xs text-muted-foreground">Face-to-face support for complex issues</p>
                  <Badge variant="outline" className="text-xs">Premium</Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => {
                window.location.href = 'mailto:support@supernomad.com?subject=SuperNomad Support Request';
              }}>
                <CardContent className="p-6 text-center space-y-3">
                  <div className="h-14 w-14 mx-auto rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="h-7 w-7 text-green-500" />
                  </div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-xs text-muted-foreground">support@supernomad.com</p>
                  <Badge variant="outline" className="text-xs">Response in &lt;2 hrs</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Support */}
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Emergency Support</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      For urgent safety issues, lost documents abroad, or emergency travel situations,
                      use the <strong>SOS & Emergency</strong> section in the app for immediate local emergency numbers,
                      embassy contacts, and crisis assistance.
                    </p>
                    <Button variant="destructive" size="sm" onClick={() => {
                      toast.info('Navigate to the Emergency section in the sidebar for SOS services.');
                    }}>
                      Go to Emergency SOS
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Ticket System */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Support Tickets</CardTitle>
                </div>
                <CardDescription>
                  Create and track support tickets for issues that need investigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  For issues that need human investigation — billing disputes, bug reports,
                  or account security — create a support ticket. Your unique ID helps us track your case.
                </p>
                <Button variant="outline" onClick={() => {
                  // Navigate to existing support tickets in profile
                  toast.info('Go to Profile → Support tab to create and manage tickets.');
                }}>
                  <FileText className="mr-2 h-4 w-4" />
                  Open Ticket System
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpSupportCenter;
