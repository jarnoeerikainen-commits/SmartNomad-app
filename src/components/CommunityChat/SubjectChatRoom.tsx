import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatRoom } from '@/types/subjectChat';
import { Send, Users, Clock, TrendingUp, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SubjectChatRoomProps {
  chatRoom: ChatRoom;
  onSendMessage: (content: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const SubjectChatRoom = ({ chatRoom, onSendMessage, onBack, isLoading }: SubjectChatRoomProps) => {
  const [messageInput, setMessageInput] = useState('');

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  const timeRemaining = chatRoom.activity.expires 
    ? formatDistanceToNow(chatRoom.activity.expires, { addSuffix: true })
    : 'Continuous';

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{chatRoom.subject}</h2>
              <Badge variant="secondary">
                {chatRoom.participants.length}/{chatRoom.settings.capacity}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              {chatRoom.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeRemaining}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {chatRoom.topicAdherence}% on topic
              </Badge>
              <Badge variant="outline">
                {chatRoom.category}
              </Badge>
              {chatRoom.aiModerator.enabled && (
                <Badge className="flex items-center gap-1">
                  🤖 AI Moderated
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* AI Moderator Summary */}
      {chatRoom.aiModerator.enabled && (
        <Card className="p-4 bg-accent/50">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>🤖</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm mb-1">AI Moderator</p>
              <p className="text-sm text-muted-foreground">
                Welcome! This chat is focused on {chatRoom.subject}. Currently {chatRoom.participants.length} members are discussing this topic. Feel free to jump in!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Participants */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4" />
          <h3 className="font-semibold">Participants ({chatRoom.participants.length})</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {chatRoom.participantDetails.map((participant) => (
            <div key={participant.id} className="flex items-center gap-2 p-2 rounded-lg bg-accent/50">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{participant.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{participant.name}</p>
                {participant.skillLevel && (
                  <p className="text-xs text-muted-foreground">{participant.skillLevel}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chat Messages */}
      <Card className="p-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {chatRoom.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.senderId === 'you' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{message.senderAvatar}</AvatarFallback>
                </Avatar>
                <div
                  className={`flex-1 max-w-[70%] ${
                    message.senderId === 'you' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{message.senderName}</p>
                    {message.isAI && (
                      <Badge variant="secondary" className="text-xs">
                        AI
                      </Badge>
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.senderId === 'you'
                        ? 'bg-primary text-primary-foreground'
                        : message.isAI
                        ? 'bg-accent border border-primary/20'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>🤖</AvatarFallback>
                </Avatar>
                <div className="bg-accent p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !messageInput.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Suggested Topics */}
      {chatRoom.aiModerator.enabled && (
        <Card className="p-4 bg-accent/50">
          <h3 className="font-semibold mb-2 text-sm">🎯 Suggested Topics</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Share experiences
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Ask questions
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Plan meetups
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Resource sharing
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
};
