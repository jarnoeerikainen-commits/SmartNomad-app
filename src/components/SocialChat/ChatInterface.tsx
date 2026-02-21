import { useState, useRef, useEffect } from 'react';
import { ChatRoom, ChatMessage } from '@/types/socialChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Sparkles, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { format } from 'date-fns';
import { useSocialChat } from '@/hooks/useSocialChat';
import { useVoiceConversation } from '@/hooks/useVoiceConversation';

interface ChatInterfaceProps {
  chatRoom: ChatRoom;
  onBack: () => void;
}

export const ChatInterface = ({ chatRoom, onBack }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useSocialChat();
  const currentUserId = '1'; // Demo user ID
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

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] min-h-[400px] max-h-[800px]">
      <CardHeader className="border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="flex -space-x-2">
              {chatRoom.participantDetails.slice(0, 3).map((participant) => (
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
            <div>
              <CardTitle className="text-base">{chatRoom.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {chatRoom.participants.length} participants
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {ttsSupported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                className={`h-8 w-8 p-0 ${voiceEnabled ? 'text-primary' : ''}`}
                title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
              >
                {voiceEnabled ? <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} /> : <VolumeX className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" style={{ minHeight: 0 }}>
          <div className="space-y-4">
            {chatRoom.messages.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start the conversation!</h3>
                <p className="text-muted-foreground">
                  Say hello and introduce yourself
                </p>
              </div>
            ) : (
              chatRoom.messages.map((msg) => {
                const isCurrentUser = msg.senderId === currentUserId;
                const isAI = msg.isAI;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''} ${isAI ? 'opacity-80' : ''}`}
                  >
                    {!isCurrentUser && (
                      <img
                        src={isAI ? `https://ui-avatars.com/api/?name=AI&background=6366f1&color=fff&size=150` : (msg.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=random&size=150`)}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=random&size=150`;
                        }}
                      />
                    )}
                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
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
                        }`}
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

        <div className="border-t p-4">
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
                className={`px-3 ${isListening ? 'animate-pulse bg-destructive hover:bg-destructive/90' : ''}`}
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
            />
            <Button onClick={() => handleSend()} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
