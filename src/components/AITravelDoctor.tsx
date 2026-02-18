import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope, Send, Loader2, AlertTriangle, MapPin, Activity, Thermometer, Pill, Baby, Plane, Syringe, HeartPulse, Search, ShieldCheck } from 'lucide-react';
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AITravelDoctorProps {
  currentLocation?: { country: string; city: string };
  citizenship?: string;
}

const SITUATION_PRESETS = [
  { id: 'pre-travel', label: 'Pre-Travel Check', icon: Plane, color: 'text-blue-500', questions: [
    "What vaccinations do I need for Southeast Asia?",
    "Health kit essentials for a 3-month trip to Africa",
    "Malaria prevention for sub-Saharan Africa travel",
    "Is it safe to travel pregnant to high-altitude destinations?"
  ]},
  { id: 'symptoms', label: 'Current Symptoms', icon: Thermometer, color: 'text-red-500', questions: [
    "I have fever and chills after returning from India",
    "I have severe stomach pain and diarrhea since yesterday",
    "Insect bite that's swelling and getting red",
    "Skin rash appeared after swimming in a lake"
  ]},
  { id: 'medication', label: 'Medication Help', icon: Pill, color: 'text-green-500', questions: [
    "Can I get my prescription refilled abroad?",
    "What OTC painkillers are available in Japan?",
    "I forgot my blood pressure medication, what should I do?",
    "Are my medications legal to bring into Singapore?"
  ]},
  { id: 'family', label: 'Family Health', icon: Baby, color: 'text-purple-500', questions: [
    "My child has a high fever and we're in rural Thailand",
    "Baby-safe mosquito prevention while traveling",
    "Best pediatric hospitals in Barcelona for tourists",
    "Travel insurance that covers pregnancy complications"
  ]},
  { id: 'emergency', label: 'Emergency', icon: HeartPulse, color: 'text-destructive', questions: [
    "Someone is having an allergic reaction, help!",
    "Signs of heat stroke - what do I do immediately?",
    "I think I have food poisoning, when to go to hospital?",
    "Nearest English-speaking hospital near me"
  ]},
  { id: 'prevention', label: 'Prevention', icon: ShieldCheck, color: 'text-amber-500', questions: [
    "How to avoid altitude sickness in Peru",
    "Water safety tips for traveling in developing countries",
    "Sun protection at high altitude destinations",
    "Jet lag management for a 12-hour time difference"
  ]},
];

const HEALTH_ALERTS = [
  { region: 'Southeast Asia', alert: 'Dengue fever season active', severity: 'medium' as const },
  { region: 'Sub-Saharan Africa', alert: 'Malaria prophylaxis recommended', severity: 'high' as const },
  { region: 'South America', alert: 'Zika virus advisory for pregnant travelers', severity: 'high' as const },
  { region: 'Global', alert: 'Ensure routine vaccinations are up to date', severity: 'low' as const },
];

export const AITravelDoctor: React.FC<AITravelDoctorProps> = ({
  currentLocation,
  citizenship
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👨‍⚕️ Welcome! I'm Dr. Atlas, your Travel Medicine specialist.\n\nI can help with:\n• Pre-travel health planning & vaccinations\n• Current symptoms & emergencies\n• Country-specific health risks\n• Medication advice abroad\n• Family & child health while traveling\n\nSelect a situation below or describe what you need."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    try { await streamChat(userMessage); } finally { setIsLoading(false); }
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
  };

  const selectedPreset = SITUATION_PRESETS.find(p => p.id === activePreset);

  return (
    <div className="space-y-4">
      {/* Medical Disclaimer */}
      <Alert className="border-destructive/50 bg-destructive/5">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <AlertDescription className="text-xs">
          <strong>MEDICAL DISCLAIMER:</strong> This AI provides health information, not medical diagnosis. For emergencies, call local emergency services immediately.
        </AlertDescription>
      </Alert>

      {/* Context & Health Alerts */}
      <div className="flex flex-wrap items-center gap-2">
        {currentLocation && (
          <Badge variant="outline" className="gap-1"><MapPin className="w-3 h-3" />{currentLocation.city}, {currentLocation.country}</Badge>
        )}
        {citizenship && <Badge variant="outline">From: {citizenship}</Badge>}
      </div>

      {/* Health Alerts Ticker */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {HEALTH_ALERTS.map((alert, i) => (
          <Badge key={i} variant={alert.severity === 'high' ? 'destructive' : alert.severity === 'medium' ? 'default' : 'secondary'} className="shrink-0 text-xs cursor-pointer" onClick={() => handleQuickQuestion(`Tell me about ${alert.alert} in ${alert.region}`)}>
            {alert.region}: {alert.alert}
          </Badge>
        ))}
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

      {/* Quick Questions for selected preset */}
      {selectedPreset && (
        <div className="space-y-1.5 p-3 rounded-lg bg-muted/50">
          <p className="text-xs font-medium text-muted-foreground">{selectedPreset.label} — tap to ask:</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedPreset.questions.map((q, i) => (
              <Button key={i} variant="outline" size="sm" className="text-xs h-auto py-1.5 whitespace-normal text-left" onClick={() => handleQuickQuestion(q)}>
                {q}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="w-5 h-5 text-primary" />
            Dr. Atlas — AI Travel Doctor
            <Badge variant="secondary" className="ml-auto text-xs"><Activity className="w-3 h-3 mr-1" />Ready</Badge>
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

          {/* Default quick questions when no preset selected */}
          {messages.length === 1 && !activePreset && (
            <div className="flex flex-wrap gap-1.5">
              {["Planning a trip to Thailand", "Fever after Africa trip", "Vaccinations for Brazil?", "Traveler's diarrhea help"].map((q, i) => (
                <Button key={i} variant="outline" size="sm" className="text-xs h-auto py-1.5" onClick={() => handleQuickQuestion(q)}>{q}</Button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Describe your symptoms or health question..." disabled={isLoading} className="flex-1" />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
