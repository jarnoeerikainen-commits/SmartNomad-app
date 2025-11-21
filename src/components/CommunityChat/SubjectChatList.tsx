import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChatRoom, ChatCategory, SkillLevel, ChatDuration } from '@/types/subjectChat';
import { Users, Clock, TrendingUp, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SubjectChatListProps {
  chatRooms: ChatRoom[];
  onSelectChat: (chat: ChatRoom) => void;
  onCreateNew: () => void;
}

export const SubjectChatList = ({ chatRooms, onSelectChat, onCreateNew }: SubjectChatListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [showOnlyWithSpace, setShowOnlyWithSpace] = useState(false);

  const filteredChats = chatRooms.filter(chat => {
    if (searchQuery && !chat.subject.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !chat.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (categoryFilter !== 'all' && chat.category !== categoryFilter) {
      return false;
    }
    
    if (skillFilter !== 'all' && !chat.settings.skillLevel.includes(skillFilter as SkillLevel)) {
      return false;
    }
    
    if (showOnlyWithSpace && chat.participants.length >= chat.settings.capacity) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subject Chats</h2>
          <p className="text-muted-foreground">Join focused discussions around specific topics</p>
        </div>
        <Button onClick={onCreateNew}>
          Create New Chat
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(ChatCategory).map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Skill Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skill Levels</SelectItem>
              {Object.values(SkillLevel).map(skill => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant={showOnlyWithSpace ? 'default' : 'outline'}
            onClick={() => setShowOnlyWithSpace(!showOnlyWithSpace)}
          >
            <Users className="w-4 h-4 mr-2" />
            Has Space
          </Button>
        </div>
      </Card>

      {/* Chat List */}
      <div className="grid gap-4">
        {filteredChats.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No chats found matching your filters</p>
            <Button onClick={onCreateNew} className="mt-4">
              Create the First Chat
            </Button>
          </Card>
        ) : (
          filteredChats.map((chat) => {
            const hasSpace = chat.participants.length < chat.settings.capacity;
            const timeRemaining = chat.activity.expires 
              ? formatDistanceToNow(chat.activity.expires, { addSuffix: true })
              : 'Continuous';

            return (
              <Card
                key={chat.id}
                className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onSelectChat(chat)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{chat.subject}</h3>
                      {chat.aiModerator.enabled && (
                        <Badge variant="secondary" className="text-xs">
                          🤖 AI
                        </Badge>
                      )}
                      {!hasSpace && (
                        <Badge variant="destructive" className="text-xs">
                          Full
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {chat.description}
                    </p>
                  </div>
                  
                  <Badge variant="outline">
                    {chat.category}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {chat.participants.length}/{chat.settings.capacity}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeRemaining}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {chat.topicAdherence}% focused
                  </Badge>
                  {chat.settings.skillLevel.length > 0 && (
                    <Badge variant="secondary">
                      {chat.settings.skillLevel.join(', ')}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Created by {chat.creator}</span>
                    <span>•</span>
                    <span>{chat.activity.messages} messages</span>
                  </div>
                  
                  <Button size="sm" variant={hasSpace ? 'default' : 'secondary'}>
                    {hasSpace ? 'Join Chat' : 'View Chat'}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
