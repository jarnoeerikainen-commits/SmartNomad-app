import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceConversation } from '@/hooks/useVoiceConversation';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
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
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hey there! 👋 I'm your SuperNomad Concierge — your proactive personal assistant AND lifestyle curator, right in your pocket.${currentLocation ? ` I see you're in **${currentLocation.city}** right now.` : ''}

I don't just answer questions — **I think ahead AND find the perfect gear for your lifestyle:**

🗓️ Already checking your **week ahead** — weather, events, visa deadlines
💼 Need a co-working spot, restaurant, padel court? Just ask — I'll find it
🛡️ Monitoring your **visa days, tax residency & travel alerts** in the background
🛍️ I curate **SuperNomad 100 picks** — the best tech, gear & services matched to YOUR situation right now
✈️ Got a trip coming? I'll prep everything — packing, transfers, eSIM, insurance

**Try me:** Ask about your day, a destination, or just say "What should I do today?" 🚀`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const {
    isListening, isSpeaking, voiceEnabled,
    startListening, stopListening, speak, stopSpeaking,
    toggleVoice, sttSupported, ttsSupported
  } = useVoiceConversation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-assistant`;
    
    const userContext = {
      currentCountry: currentLocation?.country,
      currentCity: currentLocation?.city,
      citizenship,
      userProfile: userProfile ? {
        travelStyle: userProfile.travel?.preferences,
        dietaryPreferences: userProfile.personal?.dietary,
        accommodationPreferences: userProfile.personal?.accommodation,
        professionalInfo: userProfile.lifestyle?.professional,
        familyInfo: userProfile.lifestyle?.family,
        hobbies: userProfile.personal?.hobbies,
        mobility: userProfile.travel?.mobility
      } : null
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: messages
            .filter(m => m.id !== '1')
            .map(m => ({
              role: m.isUser ? 'user' : 'assistant',
              content: m.content
            }))
            .concat([{ role: 'user', content: userMessage }]),
          userContext
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "Please try again in a moment.",
            variant: "destructive"
          });
          return;
        }
        if (resp.status === 402) {
          toast({
            title: "Payment required",
            description: "Please add funds to continue using AI features.",
            variant: "destructive"
          });
          return;
        }
        throw new Error("Failed to start stream");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantContent = "";

      // Add initial assistant message
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantId,
        content: "",
        isUser: false,
        timestamp: new Date()
      }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => prev.map(m => 
                m.id === assistantId 
                  ? { ...m, content: assistantContent }
                  : m
              ));
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Auto-speak the final response if voice is enabled
      if (assistantContent && voiceEnabled) {
        speak(assistantContent);
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
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
    setInputMessage('');
    setIsTyping(true);

    await streamChat(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
    <div className="fixed bottom-6 right-6 z-40">
      <Card className={`w-96 glass-morphism shadow-large transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[500px]'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 gradient-mesh">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-premium flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-sm font-semibold">SuperNomad Concierge</CardTitle>
            <div className="h-2 w-2 bg-success rounded-full animate-pulse shadow-glow" />
          </div>
          <div className="flex gap-1">
            {ttsSupported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={voiceEnabled ? stopSpeaking : undefined}
                onClickCapture={toggleVoice}
                className={`h-8 w-8 p-0 ${voiceEnabled ? 'text-primary' : ''}`}
                title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
              >
                {voiceEnabled ? <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} /> : <VolumeX className="h-4 w-4" />}
              </Button>
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
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!message.isUser && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        <span className="whitespace-pre-wrap">{message.content}</span>
                        {message.isUser && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      </div>
                    </div>
                  </div>
                ))}
                
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
                    onClick={() => {
                      if (isListening) {
                        stopListening();
                      } else {
                    startListening((text) => {
                          setInputMessage(text);
                          // Auto-send after a short delay to show the text
                          setTimeout(() => {
                            if (text.trim()) {
                              const userMsg: Message = {
                                id: Date.now().toString(),
                                content: text,
                                isUser: true,
                                timestamp: new Date()
                              };
                              setMessages(prev => [...prev, userMsg]);
                              setInputMessage('');
                              setIsTyping(true);
                              streamChat(text);
                            }
                          }, 500);
                        });
                      }
                    }}
                    variant={isListening ? 'default' : 'outline'}
                    size="sm"
                    className={`px-3 ${isListening ? 'animate-pulse bg-destructive hover:bg-destructive/90' : ''}`}
                    disabled={isTyping}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? 'Listening...' : 'Ask me anything about travel...'}
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
                Your proactive concierge • {voiceEnabled ? '🔊 Voice on' : 'Always thinking ahead'}
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AITravelAssistant;