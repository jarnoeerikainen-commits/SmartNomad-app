import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Scale, Send, Loader2, AlertTriangle, Shield, MessageSquare, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from "sonner";
import { useVoiceConversation } from '@/hooks/useVoiceConversation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LegalAIChatProps {
  currentLocation?: { country: string; city: string };
  citizenship?: string;
}

export const LegalAIChat: React.FC<LegalAIChatProps> = ({
  currentLocation,
  citizenship
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "⚖️ I'm your AI Legal Crisis Team — available 24/7.\n\n🚨 In danger? Tell me NOW — I'll give you exact steps + emergency numbers.\n🎙️ Tap the mic to speak — I'll listen and respond.\n\nWhat's your situation?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isListening, isSpeaking, voiceEnabled, startListening, stopListening, speak, stopSpeaking, toggleVoice, sttSupported, ttsSupported } = useVoiceConversation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const userContext = { currentCountry: currentLocation?.country, currentCity: currentLocation?.city, citizenship };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/legal-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: userMessage }],
            userContext
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let buffer = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (let line of lines) {
          line = line.trim();
          if (!line || line.startsWith(':') || !line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const n = [...prev];
                n[n.length - 1] = { role: 'assistant', content: assistantMessage };
                return n;
              });
            }
          } catch { /* parse error */ }
        }
      }

      // Auto-speak response if voice enabled
      if (voiceEnabled && assistantMessage) {
        speak(assistantMessage);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const handleSend = useCallback(async (overrideInput?: string) => {
    const text = overrideInput || input.trim();
    if (!text || isLoading) return;
    if (!overrideInput) setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    try { await streamChat(text); } finally { setIsLoading(false); }
  }, [input, isLoading, messages, currentLocation, citizenship, voiceEnabled]);

  const handleVoiceInput = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening((text) => {
      setInput('');
      handleSend(text);
    });
  }, [isListening, startListening, stopListening, handleSend]);

  const quickQuestions = [
    "Passport stolen, what do I do?",
    "Car accident, what are my steps?",
    "I was robbed, help!",
    "Being arrested, what are my rights?",
    "Visa overstay, what now?",
    "Landlord scam, need help"
  ];

  return (
    <div className="space-y-4">
      <Alert className="border-orange-500/50 bg-orange-500/5">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        <AlertDescription className="text-xs">
          <strong>DISCLAIMER:</strong> AI legal information — not formal legal advice. Consult a licensed attorney for specific cases.
        </AlertDescription>
      </Alert>

      {currentLocation && (
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="gap-1"><Shield className="w-3 h-3" />{currentLocation.city}, {currentLocation.country}</Badge>
          {citizenship && <Badge variant="outline">Citizenship: {citizenship}</Badge>}
        </div>
      )}

      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="w-5 h-5 text-primary" />
            AI Legal Crisis Team
            <div className="ml-auto flex items-center gap-1">
              {ttsSupported && (
                <Button variant="ghost" size="icon" className={`h-7 w-7 ${voiceEnabled ? 'text-primary' : 'text-muted-foreground'}`} onClick={toggleVoice} title={voiceEnabled ? 'Disable spoken responses' : 'Enable spoken responses'}>
                  {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </Button>
              )}
              {isSpeaking && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-primary animate-pulse" onClick={stopSpeaking} title="Stop speaking">
                  <Volume2 className="w-3.5 h-3.5" />
                </Button>
              )}
              <Badge variant="secondary" className="text-xs"><MessageSquare className="w-3 h-3 mr-1" />24/7</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea ref={scrollRef} className="h-[400px] pr-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start"><div className="bg-muted rounded-lg px-4 py-2"><Loader2 className="w-4 h-4 animate-spin" /></div></div>
              )}
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Common situations:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <Button key={idx} variant="outline" size="sm" className="text-xs h-auto py-1.5" onClick={() => setInput(q)}>{q}</Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {sttSupported && (
              <Button variant={isListening ? 'destructive' : 'outline'} size="icon" onClick={handleVoiceInput} disabled={isLoading} className={isListening ? 'animate-pulse' : ''} title={isListening ? 'Stop listening' : 'Speak your question'}>
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            )}
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder={isListening ? "Listening..." : "Describe your legal situation..."} disabled={isLoading} className="flex-1" />
            <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} size="icon">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
