import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope, Send, Loader2, AlertTriangle, MapPin, Activity, Thermometer, Pill, Baby, Plane, HeartPulse, ShieldCheck, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from "sonner";
import { useVoiceConversation } from '@/hooks/useVoiceConversation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AITravelDoctorProps {
  currentLocation?: { country: string; city: string };
  citizenship?: string;
}

const SITUATION_PRESETS = [
  { id: 'pre-travel', label: 'Pre-Travel', icon: Plane, color: 'text-blue-500', questions: [
    "What vaccinations do I need for Southeast Asia?",
    "Health kit essentials for Africa trip",
    "Malaria prevention advice",
  ]},
  { id: 'symptoms', label: 'Symptoms', icon: Thermometer, color: 'text-red-500', questions: [
    "Fever and chills after tropical travel",
    "Severe stomach pain and diarrhea",
    "Insect bite swelling and getting red",
  ]},
  { id: 'medication', label: 'Medication', icon: Pill, color: 'text-green-500', questions: [
    "Can I get my prescription refilled abroad?",
    "Forgot my blood pressure meds, what to do?",
    "Are my medications legal here?",
  ]},
  { id: 'family', label: 'Family', icon: Baby, color: 'text-purple-500', questions: [
    "Child has high fever, we're abroad",
    "Best pediatric hospital for tourists here",
    "Baby-safe mosquito prevention",
  ]},
  { id: 'emergency', label: 'Emergency', icon: HeartPulse, color: 'text-destructive', questions: [
    "Someone having allergic reaction!",
    "Signs of heat stroke, what to do?",
    "Nearest English-speaking hospital",
  ]},
  { id: 'prevention', label: 'Prevention', icon: ShieldCheck, color: 'text-amber-500', questions: [
    "Avoid altitude sickness in Peru",
    "Water safety in developing countries",
    "Jet lag management tips",
  ]},
];

export const AITravelDoctor: React.FC<AITravelDoctorProps> = ({
  currentLocation,
  citizenship
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👨‍⚕️ I'm Dr. Atlas — your Travel Medicine specialist.\n\n🚨 Emergency? Tell me immediately.\n🎙️ Tap the mic to talk — I'll listen and respond.\n\nHow can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
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
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medical-chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
          body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }], userContext }),
        }
      );

      if (!response.ok) { const error = await response.json(); throw new Error(error.error || 'Failed to get response'); }
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
              setMessages(prev => { const n = [...prev]; n[n.length - 1] = { role: 'assistant', content: assistantMessage }; return n; });
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

  const handleQuickQuestion = (q: string) => setInput(q);

  const selectedPreset = SITUATION_PRESETS.find(p => p.id === activePreset);

  return (
    <div className="space-y-4">
      <Alert className="border-destructive/50 bg-destructive/5">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <AlertDescription className="text-xs">
          <strong>MEDICAL DISCLAIMER:</strong> AI health guidance — not a diagnosis. For emergencies, call local emergency services.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap items-center gap-2">
        {currentLocation && (
          <Badge variant="outline" className="gap-1"><MapPin className="w-3 h-3" />{currentLocation.city}, {currentLocation.country}</Badge>
        )}
        {citizenship && <Badge variant="outline">From: {citizenship}</Badge>}
      </div>

      {/* Situation Presets */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {SITUATION_PRESETS.map(preset => {
          const Icon = preset.icon;
          const isActive = activePreset === preset.id;
          return (
            <Card key={preset.id} className={`cursor-pointer transition-all hover:shadow-md text-center p-3 ${isActive ? 'border-primary ring-1 ring-primary/20' : ''}`} onClick={() => setActivePreset(isActive ? null : preset.id)}>
              <Icon className={`h-5 w-5 mx-auto mb-1 ${preset.color}`} />
              <p className="text-[10px] font-medium leading-tight">{preset.label}</p>
            </Card>
          );
        })}
      </div>

      {selectedPreset && (
        <div className="space-y-1.5 p-3 rounded-lg bg-muted/50">
          <p className="text-xs font-medium text-muted-foreground">{selectedPreset.label} — tap to ask:</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedPreset.questions.map((q, i) => (
              <Button key={i} variant="outline" size="sm" className="text-xs h-auto py-1.5 whitespace-normal text-left" onClick={() => handleQuickQuestion(q)}>{q}</Button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="w-5 h-5 text-primary" />
            Dr. Atlas — AI Health Advisor
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
              <Badge variant="secondary" className="text-xs"><Activity className="w-3 h-3 mr-1" />Ready</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ScrollArea ref={scrollRef} className="h-[350px] pr-4">
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start"><div className="bg-muted rounded-lg px-3 py-2"><Loader2 className="w-4 h-4 animate-spin" /></div></div>
              )}
            </div>
          </ScrollArea>

          {messages.length === 1 && !activePreset && (
            <div className="flex flex-wrap gap-1.5">
              {["Fever after Africa trip", "Vaccinations for Brazil?", "Nearest hospital?", "Traveler's diarrhea help"].map((q, i) => (
                <Button key={i} variant="outline" size="sm" className="text-xs h-auto py-1.5" onClick={() => handleQuickQuestion(q)}>{q}</Button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            {sttSupported && (
              <Button variant={isListening ? 'destructive' : 'outline'} size="icon" onClick={handleVoiceInput} disabled={isLoading} className={isListening ? 'animate-pulse' : ''} title={isListening ? 'Stop listening' : 'Speak your question'}>
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            )}
            <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder={isListening ? "Listening..." : "Describe your symptoms or health question..."} disabled={isLoading} className="flex-1" />
            <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} size="icon">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
