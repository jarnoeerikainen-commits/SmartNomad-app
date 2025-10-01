import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AITravelAssistantProps {
  userProfile?: any;
  trackedCountries?: any[];
  subscription?: any;
}

const AITravelAssistant: React.FC<AITravelAssistantProps> = ({ 
  userProfile, 
  trackedCountries = [], 
  subscription 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI Travel Assistant. I can help you with travel advice, visa requirements, booking assistance, and alerts. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Travel-specific responses based on keywords
    if (lowerMessage.includes('visa') || lowerMessage.includes('passport')) {
      return `Based on your tracked countries (${trackedCountries.length} currently), I can help with visa requirements. For detailed visa processing and applications, you'll need to upgrade to a premium plan for booking assistance.`;
    }
    
    if (lowerMessage.includes('booking') || lowerMessage.includes('flight') || lowerMessage.includes('hotel')) {
      return `I can help you find the best travel deals! However, for actual booking assistance and integration with travel partners, you'll need a premium subscription. I can still provide general advice about destinations.`;
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('climate')) {
      return `I can provide weather insights for your tracked destinations. Currently tracking ${trackedCountries.length} countries. Would you like weather updates for any specific location?`;
    }
    
    if (lowerMessage.includes('tax') || lowerMessage.includes('residence')) {
      return `Tax residency is complex! Based on your travel pattern, I can provide general guidance. For detailed tax advice, consider consulting with a tax professional or upgrading to our business plan.`;
    }
    
    if (lowerMessage.includes('alert') || lowerMessage.includes('notification')) {
      return `I can set up smart alerts for visa expiries, passport renewals, and travel requirements. Your current ${subscription?.tier || 'free'} plan includes basic alerts.`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return `I can help with:
🌍 Travel advice & destination info
📋 Visa requirements & documentation
🏨 General booking guidance
⚠️ Travel alerts & notifications
💰 Tax residency insights
🌤️ Weather & climate info

For advanced features like actual bookings and personalized recommendations, consider upgrading your plan!`;
    }
    
    // Default responses
    const responses = [
      "That's a great travel question! Let me help you with that information.",
      "Based on your travel history, I'd recommend checking the latest requirements for your destinations.",
      "I'm here to assist with your travel planning needs. What specific aspect would you like help with?",
      "Travel planning can be complex, but I'm here to make it easier for you!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
          size="lg"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 bg-background border shadow-xl transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[500px]'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-medium">AI Travel Assistant</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-1">
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
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about travel, visas, bookings..."
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
                AI responses are simulated. For advanced features, connect to Supabase.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AITravelAssistant;