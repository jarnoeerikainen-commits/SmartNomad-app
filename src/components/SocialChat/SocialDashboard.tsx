import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, MessageCircle, Calendar, Sparkles, Search, Filter } from 'lucide-react';
import { useSocialChat } from '@/hooks/useSocialChat';
import { ProfileCard } from './ProfileCard';
import { ChatInterface } from './ChatInterface';
import { AIMatchingSuggestions } from './AIMatchingSuggestions';
import { TravelCalendar } from './TravelCalendar';

export const SocialDashboard = () => {
  const {
    profiles,
    chatRooms,
    activeChatRoom,
    setActiveChatRoom,
    filterProfiles
  } = useSocialChat();

  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const onlineCount = profiles.filter(p => p.status === 'online').length;
  const unreadMessages = chatRooms.reduce((sum, room) => sum + room.unreadCount, 0);

  const filteredProfiles = filterProfiles({
    location: locationFilter,
    status: statusFilter
  }).filter(profile =>
    searchQuery === '' ||
    profile.basicInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.professional.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.mobility.currentLocation.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = (profileId: string) => {
    setActiveTab('messages');
  };

  if (activeChatRoom) {
    return (
      <ChatInterface
        chatRoom={activeChatRoom}
        onBack={() => setActiveChatRoom(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineCount}</div>
            <p className="text-xs text-muted-foreground">
              Travelers available to connect
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatRooms.length}</div>
            <p className="text-xs text-muted-foreground">
              {unreadMessages} unread messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles.filter(p => p.mobility.nextDestinations.length > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              People with travel plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Suggestions</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Smart connection matches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover">
            <Users className="mr-2 h-4 w-4" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageCircle className="mr-2 h-4 w-4" />
            Messages
            {unreadMessages > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadMessages}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ai-matches">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Matches
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Travel Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discover Travelers</CardTitle>
              <CardDescription>
                Connect with {onlineCount} people online now
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, industry, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Filters */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={statusFilter === 'online' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(statusFilter === 'online' ? '' : 'online')}
                >
                  Online Only
                </Button>
                <Button
                  variant={locationFilter === 'Bangkok' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocationFilter(locationFilter === 'Bangkok' ? '' : 'Bangkok')}
                >
                  Bangkok
                </Button>
                <Button
                  variant={locationFilter === 'Singapore' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocationFilter(locationFilter === 'Singapore' ? '' : 'Singapore')}
                >
                  Singapore
                </Button>
                <Button
                  variant={locationFilter === 'Lisbon' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocationFilter(locationFilter === 'Lisbon' ? '' : 'Lisbon')}
                >
                  Lisbon
                </Button>
                {(searchQuery || locationFilter || statusFilter) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setLocationFilter('');
                      setStatusFilter('');
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Profile Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onStartChat={handleStartChat}
                  />
                ))}
              </div>

              {filteredProfiles.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No travelers found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search filters
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Your Conversations</CardTitle>
              <CardDescription>
                {chatRooms.length} active conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chatRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setActiveChatRoom(room)}
                  >
                    <div className="flex -space-x-2">
                      {room.participantDetails.slice(0, 3).map((participant) => (
                        <img
                          key={participant.id}
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-10 h-10 rounded-full border-2 border-background object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=random&size=150`;
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold truncate">{room.name}</h4>
                        {room.unreadCount > 0 && (
                          <Badge variant="destructive">{room.unreadCount}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {room.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                ))}

                {chatRooms.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start connecting with travelers to begin chatting
                    </p>
                    <Button onClick={() => setActiveTab('discover')}>
                      Discover Travelers
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-matches">
          <AIMatchingSuggestions />
        </TabsContent>

        <TabsContent value="calendar">
          <TravelCalendar profiles={profiles} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
