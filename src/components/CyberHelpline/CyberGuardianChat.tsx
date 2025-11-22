import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  AlertTriangle, 
  Shield, 
  Phone, 
  CreditCard,
  Smartphone,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  action: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Device Stolen', icon: <Smartphone className="h-4 w-4" />, action: 'My device was stolen. What should I do immediately?' },
  { label: 'Bank Emergency', icon: <CreditCard className="h-4 w-4" />, action: 'I need to freeze my bank cards immediately.' },
  { label: 'Data Breach', icon: <AlertTriangle className="h-4 w-4" />, action: 'I think my accounts have been hacked.' },
  { label: 'Emergency Contacts', icon: <Phone className="h-4 w-4" />, action: 'I need local emergency cyber security contacts.' }
];

export const CyberGuardianChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "🛡️ Hello! I'm your AI Cyber Guardian. I'm here 24/7 to help with tech emergencies, cybersecurity issues, and provide immediate support while you're traveling. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('cyber-assistant', {
        body: { 
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      });

      if (error) throw error;

      if (data?.response) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to reach AI assistant. Please try again.",
        variant: "destructive"
      });
      
      // Fallback response
      const fallbackMessage: Message = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. For immediate emergencies:\n\n🚨 Device Stolen: Remote lock your device immediately\n💳 Financial Emergency: Contact your bank's international emergency line\n🔒 Data Breach: Change all passwords immediately\n📞 Local Help: Contact local police and your embassy\n\nPlease try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  if (!isOpen) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Cyber Guardian</CardTitle>
                <CardDescription>24/7 Tech Support & Emergency Response</CardDescription>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
                Online
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Get immediate AI-powered assistance for:
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>Device Security</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Financial Safety</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <span>Emergency Response</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span>Local Support</span>
            </div>
          </div>
          <Button 
            onClick={() => setIsOpen(true)} 
            className="w-full"
            size="lg"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Start AI Chat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary shadow-lg">
      <CardHeader className="border-b bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Cyber Guardian</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-500 text-white">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
                    Online
                  </span>
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0">
          {/* Quick Actions */}
          <div className="p-4 border-b bg-muted/30">
            <p className="text-xs font-medium mb-2">Quick Actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.action)}
                  disabled={isLoading}
                  className="justify-start h-auto py-2"
                >
                  {action.icon}
                  <span className="ml-2 text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-muted-foreground">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe your issue or ask for help..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              🔒 Secure & confidential • 24/7 available • Multi-language support
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
