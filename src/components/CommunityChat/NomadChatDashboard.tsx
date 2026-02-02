import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCommunityChat } from '@/hooks/useCommunityChat';
import { DEMO_USERS, DEMO_GROUPS, AI_SUGGESTIONS, AVATAR_URLS } from '@/data/communityChatData';
import { Send, Users, Sparkles, MapPin, TrendingUp, Plus } from 'lucide-react';
import { SubjectChatView } from './SubjectChatView';

export const NomadChatDashboard = () => {
  const { messages, sendMessage, isLoading } = useCommunityChat();
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [triggerCreateGroup, setTriggerCreateGroup] = useState(false);

  const handleSend = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleCreateGroup = () => {
    setActiveTab('subjects');
    setTriggerCreateGroup(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold gradient-text mb-2">🤝 SuperNomad Pulse</h1>
            <p className="text-muted-foreground mb-1">
              Supernomad Pulse uses advanced AI to instantly connect you with your perfect adventure partners, wherever you are.
            </p>
            <p className="text-sm text-muted-foreground/80">
              Create your own group in an instant to do anything, anywhere, for as long as you want.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              size="lg"
              className="shadow-large hover:shadow-glow transition-all duration-300 gap-2"
              onClick={handleCreateGroup}
            >
              <Plus className="w-5 h-5" />
              Create Group
            </Button>
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              6 258 490 Online
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="chat">💬 Chat</TabsTrigger>
          <TabsTrigger value="subjects">🎯 Subject Chats</TabsTrigger>
          <TabsTrigger value="matches">👥 Matches</TabsTrigger>
          <TabsTrigger value="nearby">📍 Nearby</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          {/* AI Suggestions */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">AI Suggestions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AI_SUGGESTIONS.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div>
                      <p className="font-medium">{suggestion.description}</p>
                      <p className="text-sm text-muted-foreground">Tap to join group</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Groups */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Active Conversations</h2>
            </div>
            <div className="space-y-3">
              {DEMO_GROUPS.map((group) => (
                <div
                  key={group.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{group.icon}</span>
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {group.members.length} members
                        </p>
                      </div>
                    </div>
                    {group.unreadCount > 0 && (
                      <Badge variant="default">{group.unreadCount}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    {group.lastMessage}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat Interface */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💼</span>
              <h2 className="text-xl font-semibold">Co-working Group</h2>
              <Badge variant="secondary">8 members</Badge>
            </div>

            <ScrollArea className="h-[400px] border rounded-lg p-4 mb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.senderId === 'current-user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar className="w-10 h-10">
                      {message.isAI ? (
                        <AvatarFallback className="bg-primary/10 text-primary">🤖</AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                          <AvatarFallback>{message.senderName.substring(0, 2)}</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`flex-1 max-w-[70%] ${
                        message.senderId === 'current-user' ? 'items-end' : 'items-start'
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
                          message.senderId === 'current-user'
                            ? 'bg-primary text-primary-foreground'
                            : message.isAI
                            ? 'bg-accent border border-primary/20'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary">🤖</AvatarFallback>
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

            <div className="flex gap-2">
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
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <SubjectChatView 
            initialView={triggerCreateGroup ? 'create' : 'list'}
            onViewChange={() => setTriggerCreateGroup(false)}
          />
        </TabsContent>

        <TabsContent value="matches" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Smart Matches</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              AI-powered connections based on your interests, location, and professional background
            </p>
            <div className="grid gap-4">
              {DEMO_USERS.map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        {user.isOnline && (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{user.profession}</p>
                      <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm">Connect</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="nearby" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Nearby Nomads</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              6 258 490 people online in your area
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DEMO_USERS.map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-center cursor-pointer"
                >
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-sm mb-1">{user.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{user.profession}</p>
                  {user.isOnline && (
                    <Badge variant="secondary" className="text-xs">
                      Online
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
