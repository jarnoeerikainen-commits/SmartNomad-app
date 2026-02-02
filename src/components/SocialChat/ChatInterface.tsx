import { useState } from 'react';
import { ChatRoom } from '@/types/socialChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { useSocialChat } from '@/hooks/useSocialChat';

interface ChatInterfaceProps {
  chatRoom: ChatRoom;
  onBack: () => void;
}

export const ChatInterface = ({ chatRoom, onBack }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useSocialChat();
  const currentUserId = '1'; // Demo user ID

  const handleSend = async () => {
    if (!message.trim()) return;
    
    await sendMessage(chatRoom.id, message, currentUserId);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
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
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
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
                    className={`flex gap-3 ${
                      isCurrentUser ? 'flex-row-reverse' : ''
                    } ${isAI ? 'opacity-70' : ''}`}
                  >
                    {!isCurrentUser && (
                      <img
                        src={msg.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=random&size=150`}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=random&size=150`;
                        }}
                      />
                    )}
                    <div
                      className={`flex flex-col ${
                        isCurrentUser ? 'items-end' : 'items-start'
                      } max-w-[70%]`}
                    >
                      {!isCurrentUser && !isAI && (
                        <span className="text-xs text-muted-foreground mb-1">
                          {msg.senderName}
                        </span>
                      )}
                      {isAI && (
                        <div className="flex items-center gap-1 mb-1">
                          <Sparkles className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            AI Suggestion
                          </span>
                        </div>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : isAI
                            ? 'bg-accent border border-border'
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
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSend} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
