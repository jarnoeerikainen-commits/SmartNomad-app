import React, { useState, useMemo } from 'react';
import { Users, MapPin, Filter, ExternalLink, MessageCircle, Send, Facebook } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationData } from '@/types/country';

interface LocalNomadsProps {
  currentLocation: LocationData | null;
}

interface NomadGroup {
  id: string;
  name: string;
  platform: 'discord' | 'telegram' | 'facebook';
  location: string;
  country: string;
  members: number;
  topic: string;
  description: string;
  link: string;
  verified: boolean;
}

const nomadGroups: NomadGroup[] = [
  // Discord Groups
  { id: 'd1', name: 'Digital Nomads Bangkok', platform: 'discord', location: 'Bangkok', country: 'Thailand', members: 8500, topic: 'General', description: 'Main hub for nomads in Bangkok', link: 'https://discord.gg/example', verified: true },
  { id: 'd2', name: 'Bangkok Tech Nomads', platform: 'discord', location: 'Bangkok', country: 'Thailand', members: 3200, topic: 'Tech', description: 'For developers and tech professionals', link: 'https://discord.gg/example', verified: true },
  { id: 'd3', name: 'Chiang Mai Digital Hub', platform: 'discord', location: 'Chiang Mai', country: 'Thailand', members: 6700, topic: 'General', description: 'Community for Chiang Mai nomads', link: 'https://discord.gg/example', verified: true },
  { id: 'd4', name: 'Lisbon Remote Workers', platform: 'discord', location: 'Lisbon', country: 'Portugal', members: 12000, topic: 'General', description: 'Largest nomad community in Lisbon', link: 'https://discord.gg/example', verified: true },
  { id: 'd5', name: 'Lisbon Startup Nomads', platform: 'discord', location: 'Lisbon', country: 'Portugal', members: 4500, topic: 'Entrepreneurship', description: 'For startup founders and entrepreneurs', link: 'https://discord.gg/example', verified: true },
  { id: 'd6', name: 'Bali Digital Nomads', platform: 'discord', location: 'Bali', country: 'Indonesia', members: 15000, topic: 'General', description: 'Main community for Bali nomads', link: 'https://discord.gg/example', verified: true },
  { id: 'd7', name: 'Medellín Nomad Network', platform: 'discord', location: 'Medellín', country: 'Colombia', members: 7800, topic: 'General', description: 'Connect with nomads in Medellín', link: 'https://discord.gg/example', verified: true },
  { id: 'd8', name: 'Barcelona Remote Community', platform: 'discord', location: 'Barcelona', country: 'Spain', members: 9500, topic: 'General', description: 'Barcelona\'s vibrant nomad scene', link: 'https://discord.gg/example', verified: true },
  
  // Telegram Groups
  { id: 't1', name: 'Bangkok Nomads Chat', platform: 'telegram', location: 'Bangkok', country: 'Thailand', members: 5200, topic: 'General', description: 'Daily discussions and meetups', link: 'https://t.me/example', verified: true },
  { id: 't2', name: 'Thailand Visa Help', platform: 'telegram', location: 'Bangkok', country: 'Thailand', members: 4100, topic: 'Visa & Legal', description: 'Visa information and legal advice', link: 'https://t.me/example', verified: true },
  { id: 't3', name: 'Chiang Mai Housing', platform: 'telegram', location: 'Chiang Mai', country: 'Thailand', members: 3800, topic: 'Housing', description: 'Find apartments and roommates', link: 'https://t.me/example', verified: true },
  { id: 't4', name: 'Lisbon Nomad Life', platform: 'telegram', location: 'Lisbon', country: 'Portugal', members: 8900, topic: 'General', description: 'Everything about nomad life in Lisbon', link: 'https://t.me/example', verified: true },
  { id: 't5', name: 'Portugal NHR Tax Group', platform: 'telegram', location: 'Lisbon', country: 'Portugal', members: 2700, topic: 'Tax & Finance', description: 'Non-habitual resident tax regime', link: 'https://t.me/example', verified: true },
  { id: 't6', name: 'Bali Nomad Events', platform: 'telegram', location: 'Bali', country: 'Indonesia', members: 6200, topic: 'Events & Social', description: 'Weekly events and meetups', link: 'https://t.me/example', verified: true },
  { id: 't7', name: 'Medellín Spanish Practice', platform: 'telegram', location: 'Medellín', country: 'Colombia', members: 2100, topic: 'Language', description: 'Practice Spanish with locals', link: 'https://t.me/example', verified: true },
  { id: 't8', name: 'Barcelona Coworking', platform: 'telegram', location: 'Barcelona', country: 'Spain', members: 3500, topic: 'Coworking', description: 'Best coworking spaces and deals', link: 'https://t.me/example', verified: true },
  
  // Facebook Groups
  { id: 'f1', name: 'Digital Nomads Bangkok Official', platform: 'facebook', location: 'Bangkok', country: 'Thailand', members: 42000, topic: 'General', description: 'Official Facebook community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f2', name: 'Bangkok Apartments & Housing', platform: 'facebook', location: 'Bangkok', country: 'Thailand', members: 18500, topic: 'Housing', description: 'Find your next home in Bangkok', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f3', name: 'Chiang Mai Digital Nomads', platform: 'facebook', location: 'Chiang Mai', country: 'Thailand', members: 35000, topic: 'General', description: 'Largest Chiang Mai nomad group', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f4', name: 'Lisbon Digital Nomads', platform: 'facebook', location: 'Lisbon', country: 'Portugal', members: 28000, topic: 'General', description: 'Connect with Lisbon nomads', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f5', name: 'Portugal Remote Workers', platform: 'facebook', location: 'Lisbon', country: 'Portugal', members: 15200, topic: 'General', description: 'Remote work community in Portugal', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f6', name: 'Bali Digital Nomads', platform: 'facebook', location: 'Bali', country: 'Indonesia', members: 67000, topic: 'General', description: 'Largest Bali nomad community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f7', name: 'Medellín Digital Nomads', platform: 'facebook', location: 'Medellín', country: 'Colombia', members: 23000, topic: 'General', description: 'Medellín nomad community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f8', name: 'Barcelona Digital Nomads', platform: 'facebook', location: 'Barcelona', country: 'Spain', members: 31000, topic: 'General', description: 'Barcelona\'s nomad network', link: 'https://facebook.com/groups/example', verified: true },
];

const topics = ['All Topics', 'General', 'Tech', 'Entrepreneurship', 'Visa & Legal', 'Housing', 'Events & Social', 'Tax & Finance', 'Language', 'Coworking'];

const LocalNomads: React.FC<LocalNomadsProps> = ({ currentLocation }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');

  // Detect user's location city
  const userCity = currentLocation?.city || 'Bangkok';
  const userCountry = currentLocation?.country || 'Thailand';

  // Filter and sort groups
  const filteredGroups = useMemo(() => {
    let filtered = nomadGroups;

    // Filter by platform
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(group => group.platform === selectedPlatform);
    }

    // Filter by topic
    if (selectedTopic !== 'All Topics') {
      filtered = filtered.filter(group => group.topic === selectedTopic);
    }

    return filtered;
  }, [selectedPlatform, selectedTopic]);

  // Get top 3 groups for user's location
  const topLocalGroups = useMemo(() => {
    return nomadGroups
      .filter(group => group.location === userCity || group.country === userCountry)
      .sort((a, b) => b.members - a.members)
      .slice(0, 3);
  }, [userCity, userCountry]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'discord':
        return <MessageCircle className="h-5 w-5" />;
      case 'telegram':
        return <Send className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'discord':
        return 'bg-[#5865F2] hover:bg-[#4752C4]';
      case 'telegram':
        return 'bg-[#0088cc] hover:bg-[#006699]';
      case 'facebook':
        return 'bg-[#1877F2] hover:bg-[#166FE5]';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  const formatMembers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Local Nomad Groups</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Currently showing groups for: <span className="font-semibold text-foreground">{userCity}, {userCountry}</span>
        </p>
      </div>

      {/* Top 3 Local Groups */}
      {topLocalGroups.length > 0 && (
        <Card className="border-primary/20 shadow-large">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Top Groups in Your Area
            </CardTitle>
            <CardDescription>Most popular nomad communities near you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topLocalGroups.map((group) => (
                <Card key={group.id} className="gradient-card hover-lift">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${getPlatformColor(group.platform)} text-white`}>
                        {getPlatformIcon(group.platform)}
                      </div>
                      {group.verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{group.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{group.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {formatMembers(group.members)}
                      </Badge>
                      <Button
                        size="sm"
                        className={`${getPlatformColor(group.platform)} text-white`}
                        onClick={() => window.open(group.link, '_blank')}
                      >
                        Join <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Topic</label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Tabs */}
      <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Platforms</TabsTrigger>
          <TabsTrigger value="discord" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Discord
          </TabsTrigger>
          <TabsTrigger value="telegram" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Telegram
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPlatform} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover-lift">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${getPlatformColor(group.platform)} text-white`}>
                      {getPlatformIcon(group.platform)}
                    </div>
                    {group.verified && (
                      <Badge variant="secondary" className="text-xs">✓ Verified</Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1">{group.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="h-3 w-3" />
                      {group.location}, {group.country}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {group.topic}
                    </Badge>
                    <Badge className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {formatMembers(group.members)} members
                    </Badge>
                  </div>

                  <Button
                    className={`w-full ${getPlatformColor(group.platform)} text-white`}
                    onClick={() => window.open(group.link, '_blank')}
                  >
                    Join Group <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No groups found with the selected filters</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedPlatform('all');
                    setSelectedTopic('All Topics');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalNomads;