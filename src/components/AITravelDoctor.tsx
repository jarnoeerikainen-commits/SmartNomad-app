import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope, Send, Loader2, AlertTriangle, MapPin, Activity } from 'lucide-react';
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AITravelDoctorProps {
  currentLocation?: { country: string; city: string };
  citizenship?: string;
}

export const AITravelDoctor: React.FC<AITravelDoctorProps> = ({
  currentLocation,
  citizenship
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "🏥 Medical Emergency Support\n\nI'm your AI medical advisor. If you have a medical emergency (severe pain, difficulty breathing, chest pain, severe bleeding), tell me immediately and I'll guide you to get help fast.\n\nI'll ask the right questions to understand your symptoms and provide verified medical guidance."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const userContext = {
      currentCountry: currentLocation?.country,
      currentCity: currentLocation?.city,
      citizenship
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medical-chat`,
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

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let buffer = '';

      // Add assistant message placeholder
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (let line of lines) {
          line = line.trim();
          if (!line || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;

          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: assistantMessage
                };
                return newMessages;
              });
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
      
      // Remove the empty assistant message if error occurs
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      await streamChat(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "I have a high fever and chills",
    "I have severe stomach pain and diarrhea",
    "I got bitten by an insect, what should I watch for?",
    "I need to find a hospital urgently"
  ];

  return (
    <div className="space-y-4">
      {/* Medical Disclaimer */}
      <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
        <AlertTriangle className="w-4 h-4 text-red-600" />
        <AlertDescription className="text-xs">
          <strong>MEDICAL DISCLAIMER:</strong> This AI provides health information, not medical diagnosis or treatment. 
          For medical emergencies, call emergency services immediately. Always consult a licensed doctor.
        </AlertDescription>
      </Alert>

      {/* Context Badge */}
      {currentLocation && (
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="gap-1">
            <MapPin className="w-3 h-3" />
            {currentLocation.city}, {currentLocation.country}
          </Badge>
          {citizenship && (
            <Badge variant="outline">
              From: {citizenship}
            </Badge>
          )}
        </div>
      )}

      {/* Chat Area */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="w-5 h-5 text-primary" />
            AI Travel Doctor
            <Badge variant="secondary" className="ml-auto text-xs">
              <Activity className="w-3 h-3 mr-1" />
              Ready to assist
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <ScrollArea 
            ref={scrollRef}
            className="h-[400px] pr-4"
          >
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Common situations:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1.5"
                    onClick={() => {
                      setInput(q);
                    }}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
