import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatRoom, ChatMessage } from '@/types/socialChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Sparkles, Mic, MicOff, Volume2, VolumeX, FileText, Search, X } from 'lucide-react';
import { formatTime } from '@/utils/dateFormat';
import { useSocialChat } from '@/hooks/useSocialChat';
import { useVoiceConversation } from '@/hooks/useVoiceConversation';
import { supabase } from '@/integrations/supabase/client';

interface ChatInterfaceProps {
  chatRoom: ChatRoom;
  onBack: () => void;
  currentUserId?: string;
}

export const ChatInterface = ({ chatRoom, onBack, currentUserId = 'demo-user' }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [showCatchUp, setShowCatchUp] = useState(false);
  const [catchUpSummary, setCatchUpSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { sendMessage } = useSocialChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    isListening, isSpeaking, voiceEnabled,
    startListening, stopListening, speak,
    toggleVoice, sttSupported, ttsSupported
  } = useVoiceConversation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatRoom.messages]);

  const handleSend = async (text?: string) => {
    const content = text || message;
    if (!content.trim()) return;
    await sendMessage(chatRoom.id, content, currentUserId);
    if (!text) setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-speak new non-user messages
  useEffect(() => {
    if (!voiceEnabled || chatRoom.messages.length === 0) return;
    const last = chatRoom.messages[chatRoom.messages.length - 1];
    if (last.senderId !== currentUserId) {
      speak(last.content);
    }
  }, [chatRoom.messages.length, voiceEnabled]);

  // AI Catch-Up Summary
  const generateCatchUp = useCallback(async () => {
    setIsLoadingSummary(true);
    setShowCatchUp(true);
    try {
      const recentMessages = chatRoom.messages
        .filter(m => !m.isAI)
        .slice(-20)
        .map(m => `${m.senderName}: ${m.content}`)
        .join('\n');

      const { data, error } = await supabase.functions.invoke('social-chat-ai', {
        body: {
          type: 'conversation',
          message: `Summarize this group conversation for a newcomer. What are the key topics discussed, any decisions made, and what should they know? Keep it concise (3-5 bullet points):\n\n${recentMessages}`,
          chatHistory: [],
        }
      });

      if (error) throw error;
      setCatchUpSummary(data?.suggestion || 'No summary available');
      if (voiceEnabled && data?.suggestion) {
        speak(`Here's what you missed: ${data.suggestion}`);
      }
    } catch {
      const topics = chatRoom.messages
        .filter(m => !m.isAI)
        .slice(-5)
        .map(m => `• ${m.senderName}: "${m.content.slice(0, 80)}${m.content.length > 80 ? '...' : ''}"`)
        .join('\n');
      setCatchUpSummary(`Recent highlights:\n${topics}`);
    } finally {
      setIsLoadingSummary(false);
    }
  }, [chatRoom.messages, voiceEnabled, speak]);

  // Filter messages by search query
  const displayMessages = searchQuery
    ? chatRoom.messages.filter(m =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatRoom.messages;

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] min-h-[400px] max-h-[800px]">
      <CardHeader className="border-b py-3 px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex -space-x-2 flex-shrink-0">
              {chatRoom.participantDetails.filter(p => p.avatar).slice(0, 3).map((participant) => (
                <img
                  key={participant.id}
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=random&size=150`;
                  }}
                />
              ))}
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm truncate">{chatRoom.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {chatRoom.participants.length} members
              </p>
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setShowSearch(!showSearch)} className="h-8 w-8 p-0" title="Search messages">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={generateCatchUp} className="h-8 w-8 p-0" title="AI Catch-up Summary">
              <FileText className="h-4 w-4" />
            </Button>
            {ttsSupported && (
              <Button variant="ghost" size="sm" onClick={toggleVoice} className={`h-8 w-8 p-0 ${voiceEnabled ? 'text-primary' : ''}`} title={voiceEnabled ? 'Disable voice' : 'Enable voice'}>
                {voiceEnabled ? <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} /> : <VolumeX className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {showSearch && (
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search messages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 h-8 text-sm" autoFocus />
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
            {searchQuery && <Badge variant="secondary" className="text-xs self-center">{displayMessages.length} found</Badge>}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {showCatchUp && (
          <div className="border-b bg-accent/50 p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary">AI Catch-Up Summary</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowCatchUp(false)} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
            {isLoadingSummary ? (
              <p className="text-xs text-muted-foreground animate-pulse">Analyzing conversation...</p>
            ) : (
              <p className="text-xs text-muted-foreground whitespace-pre-line">{catchUpSummary}</p>
            )}
          </div>
        )}

        <ScrollArea className="flex-1 p-4" style={{ minHeight: 0 }}>
          <div className="space-y-4">
            {displayMessages.length === 0 && !searchQuery ? (
              <div className="text-center py-12">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start the conversation!</h3>
                <p className="text-muted-foreground">Say hello and introduce yourself</p>
              </div>
            ) : displayMessages.length === 0 && searchQuery ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No messages matching "{searchQuery}"</p>
              </div>
            ) : (
              displayMessages.map((msg) => {
                const isCurrentUser = msg.senderId === currentUserId;
                const isAI = msg.isAI;
                const isHighlighted = searchQuery && msg.content.toLowerCase().includes(searchQuery.toLowerCase());

                return (
                  <div key={msg.id} className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''} ${isAI ? 'opacity-80' : ''}`}>
                    {!isCurrentUser && (
                      <img
                        src={isAI ? `https://ui-avatars.com/api/?name=AI&background=6366f1&color=fff&size=150` : (msg.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=random&size=150`)}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=random&size=150`;
                        }}
                      />
                    )}
                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
                      {!isCurrentUser && (
                        <div className="flex items-center gap-1 mb-1">
                          {isAI && <Sparkles className="h-3 w-3 text-primary" />}
                          <span className="text-xs text-muted-foreground">
                            {isAI ? 'SuperNomad AI' : msg.senderName}
                          </span>
                        </div>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : isAI
                            ? 'bg-accent border border-primary/20'
                            : 'bg-muted'
                        } ${isHighlighted ? 'ring-2 ring-primary/50' : ''}`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {format(new Date(msg.timestamp), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-3">
          <div className="flex gap-2">
            {sttSupported && (
              <Button
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening((text) => {
                      if (text.trim()) handleSend(text);
                    });
                  }
                }}
                variant={isListening ? 'default' : 'outline'}
                size="sm"
                className={`px-3 flex-shrink-0 ${isListening ? 'animate-pulse bg-destructive hover:bg-destructive/90' : ''}`}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
            <Input
              placeholder={isListening ? 'Listening...' : 'Type your message...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="text-sm"
            />
            <Button onClick={() => handleSend()} disabled={!message.trim()} size="sm" className="flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
