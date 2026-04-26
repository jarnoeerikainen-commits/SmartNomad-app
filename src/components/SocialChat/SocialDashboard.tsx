import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, MessageCircle, Calendar, Sparkles, Search, Filter, ShieldCheck, ScanFace, Bot, Lock, UsersRound, Trophy, Globe } from 'lucide-react';
import { useSocialChat } from '@/hooks/useSocialChat';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { ProfileCard } from './ProfileCard';
import { ChatInterface } from './ChatInterface';
import { AIMatchingSuggestions } from './AIMatchingSuggestions';
import { TravelCalendar } from './TravelCalendar';
import { getPersonaGroups, VibeGroup } from '@/data/vibeGroupsData';
import { MAJOR_CITIES } from '@/data/socialChatData';
import { CommunityAgentOpsPanel } from '@/features/community-ai/CommunityAgentOpsPanel';

export const SocialDashboard = () => {
  const {
    profiles,
    chatRooms,
    activeChatRoom,
    setActiveChatRoom,
    filterProfiles,
    createChatRoom,
    getCurrentUserId,
  } = useSocialChat();
  const { activePersona } = useDemoPersona();

  const [activeTab, setActiveTab] = useState('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAllCities, setShowAllCities] = useState(false);

  const onlineCount = profiles.filter(p => p.status === 'online').length;
  const unreadMessages = chatRooms.reduce((sum, room) => sum + room.unreadCount, 0);

  // Get persona-specific groups
  const personaGroups = useMemo(() =>
    getPersonaGroups(activePersona?.id || null),
    [activePersona?.id]
  );
  const groupUnread = personaGroups.reduce((sum, g) => sum + g.chatRoom.unreadCount, 0);

  // Default to 'groups' when persona is active
  useEffect(() => {
    if (activePersona && activeTab === 'discover') {
      setActiveTab('groups');
    }
  }, [activePersona?.id]);

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
    const room = createChatRoom('one_on_one', [profileId], undefined);
    setActiveChatRoom(room);
  };

  const currentUserId = getCurrentUserId();

  if (activeChatRoom) {
    return (
      <ChatInterface
        chatRoom={activeChatRoom}
        onBack={() => setActiveChatRoom(null)}
        currentUserId={currentUserId}
      />
    );
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    sports: <Trophy className="h-4 w-4" />,
    expat: <Globe className="h-4 w-4" />,
    interest: <Sparkles className="h-4 w-4" />,
    location: <Globe className="h-4 w-4" />,
  };

  // City filter buttons - show top 6 or all 20
  const displayCities = showAllCities ? MAJOR_CITIES : MAJOR_CITIES.slice(0, 6);

  return (
    <div className="space-y-4">
      {/* Trust & Safety Banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-3">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-xs">Verified & AI-Protected Community</h3>
              <p className="text-[10px] text-muted-foreground">Every member is verified. Every conversation is safe.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex items-center gap-2 text-[10px]">
              <ScanFace className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span><strong>Fast ID & Face Match</strong> — 1 min verification</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <Bot className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span><strong>AI Moderated</strong> — Zero tolerance for harassment</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <Lock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span><strong>End-to-End Encrypted</strong> — Privacy protected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CommunityAgentOpsPanel surface="vibe" />

      {/* Compact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold">{onlineCount}</p>
                <p className="text-[10px] text-muted-foreground">Online Now</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold">{chatRooms.length + personaGroups.length}</p>
                <p className="text-[10px] text-muted-foreground">Active Chats</p>
              </div>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold">{personaGroups.length}</p>
                <p className="text-[10px] text-muted-foreground">My Groups</p>
              </div>
              <UsersRound className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold">{profiles.length}</p>
                <p className="text-[10px] text-muted-foreground">Members</p>
              </div>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 text-xs">
          <TabsTrigger value="groups" className="text-xs px-1">
            <UsersRound className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Groups</span>
            {groupUnread > 0 && <Badge variant="destructive" className="ml-1 text-[9px] h-4 px-1">{groupUnread}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="discover" className="text-xs px-1">
            <Users className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">People</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-xs px-1">
            <MessageCircle className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Chats</span>
            {unreadMessages > 0 && <Badge variant="destructive" className="ml-1 text-[9px] h-4 px-1">{unreadMessages}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="ai-matches" className="text-xs px-1">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs px-1">
            <Calendar className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Trips</span>
          </TabsTrigger>
        </TabsList>

        {/* GROUPS TAB */}
        <TabsContent value="groups" className="space-y-3">
          {personaGroups.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UsersRound className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Select a demo persona (Meghan or John) to see your auto-joined sports & expat groups
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Your Groups</CardTitle>
                  <CardDescription className="text-xs">
                    {personaGroups.length} groups · Auto-joined based on your profile & interests
                  </CardDescription>
                </CardHeader>
              </Card>
              <div className="space-y-2">
                {personaGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setActiveChatRoom(group.chatRoom)}
                  >
                    <CardContent className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl flex-shrink-0">{group.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-semibold text-sm truncate">{group.name}</h4>
                            <Badge variant="outline" className="text-[9px] h-4 flex-shrink-0">
                              {categoryIcons[group.category]}
                              <span className="ml-1 capitalize">{group.category}</span>
                            </Badge>
                            {group.chatRoom.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-[9px] h-4 px-1 flex-shrink-0">
                                {group.chatRoom.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{group.description}</p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {group.chatRoom.lastMessage}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] text-muted-foreground">{group.memberCount.toLocaleString()} members</p>
                          <div className="flex -space-x-1 mt-1 justify-end">
                            {group.chatRoom.participantDetails.slice(0, 3).map((p) => (
                              <img
                                key={p.id}
                                src={p.avatar}
                                alt={p.name}
                                className="w-5 h-5 rounded-full border border-background object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random&size=40`;
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* DISCOVER TAB */}
        <TabsContent value="discover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Discover Travelers</CardTitle>
              <CardDescription className="text-xs">
                {onlineCount} people online across 20 major cities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="flex gap-2 flex-wrap">
                <Button variant={statusFilter === 'online' ? 'default' : 'outline'} size="sm"
                  onClick={() => setStatusFilter(statusFilter === 'online' ? '' : 'online')}>Online Only</Button>
                {displayCities.map(city => (
                  <Button key={city} variant={locationFilter === city ? 'default' : 'outline'} size="sm"
                    onClick={() => setLocationFilter(locationFilter === city ? '' : city)}>{city}</Button>
                ))}
                {!showAllCities && (
                  <Button variant="ghost" size="sm" onClick={() => setShowAllCities(true)} className="text-primary">
                    +{MAJOR_CITIES.length - 6} more cities
                  </Button>
                )}
                {showAllCities && (
                  <Button variant="ghost" size="sm" onClick={() => setShowAllCities(false)} className="text-primary">
                    Show less
                  </Button>
                )}
                {(searchQuery || locationFilter || statusFilter) && (
                  <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setLocationFilter(''); setStatusFilter(''); }}>
                    Clear All
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Showing {filteredProfiles.length} of {profiles.length} members
                {locationFilter && ` in ${locationFilter}`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.slice(0, 30).map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} onStartChat={handleStartChat} />
                ))}
              </div>

              {filteredProfiles.length > 30 && (
                <p className="text-center text-sm text-muted-foreground">
                  Showing first 30 of {filteredProfiles.length} results. Use city filters or search to narrow down.
                </p>
              )}

              {filteredProfiles.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No travelers found</h3>
                  <p className="text-muted-foreground">Try adjusting your search filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MESSAGES TAB */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Conversations</CardTitle>
              <CardDescription className="text-xs">{chatRooms.length} active conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {chatRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setActiveChatRoom(room)}
                  >
                    <div className="flex -space-x-2">
                      {room.participantDetails.filter(p => p.avatar).slice(0, 3).map((participant) => (
                        <img
                          key={participant.id}
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-9 h-9 rounded-full border-2 border-background object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=random&size=150`;
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-semibold text-sm truncate">{room.name}</h4>
                        {room.unreadCount > 0 && <Badge variant="destructive" className="text-[9px] h-4">{room.unreadCount}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{room.lastMessage || 'No messages yet'}</p>
                    </div>
                  </div>
                ))}

                {chatRooms.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Start connecting with travelers</p>
                    <Button onClick={() => setActiveTab('discover')}>Discover Travelers</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-matches">
          <AIMatchingSuggestions onStartChat={handleStartChat} />
        </TabsContent>

        <TabsContent value="calendar">
          <TravelCalendar profiles={profiles} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
