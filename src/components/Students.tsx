import React, { useState, useMemo } from 'react';
import { GraduationCap, MapPin, Filter, ExternalLink, MessageCircle, Send, Facebook, Search, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { LocationData } from '@/types/country';

interface StudentsProps {
  currentLocation?: LocationData | null;
}

interface StudentGroup {
  id: string;
  name: string;
  platform: 'discord' | 'telegram' | 'facebook';
  location: string;
  country: string;
  university: string;
  members: number;
  topic: string;
  description: string;
  link: string;
  verified: boolean;
}

const studentGroups: StudentGroup[] = [
  // Discord Groups - Boston/Cambridge
  { id: 'd1', name: 'MIT Students Hub', platform: 'discord', location: 'Boston', country: 'USA', university: 'MIT', members: 12500, topic: 'General', description: 'Official MIT student community', link: 'https://discord.gg/example', verified: true },
  { id: 'd2', name: 'Harvard Study Groups', platform: 'discord', location: 'Boston', country: 'USA', university: 'Harvard', members: 15200, topic: 'Study Groups', description: 'Collaborative learning community', link: 'https://discord.gg/example', verified: true },
  { id: 'd3', name: 'Boston International Students', platform: 'discord', location: 'Boston', country: 'USA', university: 'Multiple', members: 8700, topic: 'International Students', description: 'Connect with students worldwide', link: 'https://discord.gg/example', verified: true },
  
  // Discord Groups - London
  { id: 'd4', name: 'UCL Student Network', platform: 'discord', location: 'London', country: 'UK', university: 'UCL', members: 18900, topic: 'General', description: 'University College London community', link: 'https://discord.gg/example', verified: true },
  { id: 'd5', name: 'Imperial College Tech', platform: 'discord', location: 'London', country: 'UK', university: 'Imperial', members: 14300, topic: 'Study Groups', description: 'Tech and engineering students', link: 'https://discord.gg/example', verified: true },
  { id: 'd6', name: 'London Student Housing', platform: 'discord', location: 'London', country: 'UK', university: 'Multiple', members: 11200, topic: 'Housing', description: 'Find accommodation and roommates', link: 'https://discord.gg/example', verified: true },
  
  // Discord Groups - Berlin
  { id: 'd7', name: 'TU Berlin Students', platform: 'discord', location: 'Berlin', country: 'Germany', university: 'TU Berlin', members: 9800, topic: 'General', description: 'Technical University community', link: 'https://discord.gg/example', verified: true },
  { id: 'd8', name: 'Berlin Language Exchange', platform: 'discord', location: 'Berlin', country: 'Germany', university: 'Multiple', members: 7600, topic: 'Language Exchange', description: 'Practice German and other languages', link: 'https://discord.gg/example', verified: true },
  
  // Discord Groups - Singapore
  { id: 'd9', name: 'NUS Student Community', platform: 'discord', location: 'Singapore', country: 'Singapore', university: 'NUS', members: 16700, topic: 'General', description: 'National University of Singapore', link: 'https://discord.gg/example', verified: true },
  { id: 'd10', name: 'NTU Career Hub', platform: 'discord', location: 'Singapore', country: 'Singapore', university: 'NTU', members: 13400, topic: 'Career', description: 'Career advice and opportunities', link: 'https://discord.gg/example', verified: true },
  
  // Telegram Groups - Boston
  { id: 't1', name: 'MIT International Chat', platform: 'telegram', location: 'Boston', country: 'USA', university: 'MIT', members: 6800, topic: 'International Students', description: 'Daily discussions for international students', link: 'https://t.me/example', verified: true },
  { id: 't2', name: 'Harvard Housing Help', platform: 'telegram', location: 'Boston', country: 'USA', university: 'Harvard', members: 5200, topic: 'Housing', description: 'Find apartments and roommates', link: 'https://t.me/example', verified: true },
  { id: 't3', name: 'Boston Student Jobs', platform: 'telegram', location: 'Boston', country: 'USA', university: 'Multiple', members: 9100, topic: 'Part-time Jobs', description: 'Part-time job opportunities', link: 'https://t.me/example', verified: true },
  
  // Telegram Groups - London
  { id: 't4', name: 'UCL Study Buddies', platform: 'telegram', location: 'London', country: 'UK', university: 'UCL', members: 7300, topic: 'Study Groups', description: 'Find study partners for exams', link: 'https://t.me/example', verified: true },
  { id: 't5', name: 'Imperial Events', platform: 'telegram', location: 'London', country: 'UK', university: 'Imperial', members: 6500, topic: 'Social Events', description: 'Weekly student events and parties', link: 'https://t.me/example', verified: true },
  { id: 't6', name: 'London Student Deals', platform: 'telegram', location: 'London', country: 'UK', university: 'Multiple', members: 12400, topic: 'General', description: 'Discounts and student offers', link: 'https://t.me/example', verified: true },
  
  // Telegram Groups - Paris
  { id: 't7', name: 'Sorbonne Students', platform: 'telegram', location: 'Paris', country: 'France', university: 'Sorbonne', members: 8900, topic: 'General', description: 'Sorbonne University community', link: 'https://t.me/example', verified: true },
  { id: 't8', name: 'Paris Language Practice', platform: 'telegram', location: 'Paris', country: 'France', university: 'Multiple', members: 5700, topic: 'Language Exchange', description: 'Practice French with natives', link: 'https://t.me/example', verified: true },
  
  // Telegram Groups - Tokyo
  { id: 't9', name: 'Tokyo Uni International', platform: 'telegram', location: 'Tokyo', country: 'Japan', university: 'University of Tokyo', members: 7800, topic: 'International Students', description: 'International student support', link: 'https://t.me/example', verified: true },
  { id: 't10', name: 'Tokyo Student Housing', platform: 'telegram', location: 'Tokyo', country: 'Japan', university: 'Multiple', members: 6200, topic: 'Housing', description: 'Affordable student housing', link: 'https://t.me/example', verified: true },
  
  // Facebook Groups - Boston
  { id: 'f1', name: 'MIT Students Official', platform: 'facebook', location: 'Boston', country: 'USA', university: 'MIT', members: 28500, topic: 'General', description: 'Official MIT student Facebook group', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f2', name: 'Harvard Class of 2025', platform: 'facebook', location: 'Boston', country: 'USA', university: 'Harvard', members: 21300, topic: 'General', description: 'Class networking and events', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f3', name: 'Boston Student Marketplace', platform: 'facebook', location: 'Boston', country: 'USA', university: 'Multiple', members: 34200, topic: 'General', description: 'Buy, sell, and trade student items', link: 'https://facebook.com/groups/example', verified: true },
  
  // Facebook Groups - London
  { id: 'f4', name: 'UCL Students 2024/25', platform: 'facebook', location: 'London', country: 'UK', university: 'UCL', members: 32800, topic: 'General', description: 'Official UCL student community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f5', name: 'Imperial College Students', platform: 'facebook', location: 'London', country: 'UK', university: 'Imperial', members: 27600, topic: 'General', description: 'Imperial College community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f6', name: 'London International Students', platform: 'facebook', location: 'London', country: 'UK', university: 'Multiple', members: 45900, topic: 'International Students', description: 'Largest London student community', link: 'https://facebook.com/groups/example', verified: true },
  
  // Facebook Groups - Paris
  { id: 'f7', name: 'Sorbonne Étudiants', platform: 'facebook', location: 'Paris', country: 'France', university: 'Sorbonne', members: 19200, topic: 'General', description: 'Communauté étudiante Sorbonne', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f8', name: 'Paris Student Life', platform: 'facebook', location: 'Paris', country: 'France', university: 'Multiple', members: 38400, topic: 'Social Events', description: 'Events and activities in Paris', link: 'https://facebook.com/groups/example', verified: true },
  
  // Facebook Groups - Singapore
  { id: 'f9', name: 'NUS Students Official', platform: 'facebook', location: 'Singapore', country: 'Singapore', university: 'NUS', members: 41200, topic: 'General', description: 'National University of Singapore', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f10', name: 'Singapore Student Housing', platform: 'facebook', location: 'Singapore', country: 'Singapore', university: 'Multiple', members: 29700, topic: 'Housing', description: 'Find student accommodation', link: 'https://facebook.com/groups/example', verified: true },
  
  // Facebook Groups - Toronto
  { id: 'f11', name: 'University of Toronto', platform: 'facebook', location: 'Toronto', country: 'Canada', university: 'UofT', members: 52300, topic: 'General', description: 'Largest UofT student community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'f12', name: 'Toronto Student Jobs', platform: 'facebook', location: 'Toronto', country: 'Canada', university: 'Multiple', members: 31800, topic: 'Part-time Jobs', description: 'Job postings for students', link: 'https://facebook.com/groups/example', verified: true },
];

const topics = ['All Topics', 'General', 'Study Groups', 'International Students', 'Housing', 'Part-time Jobs', 'Career', 'Social Events', 'Language Exchange'];
const universities = ['All Universities', 'MIT', 'Harvard', 'UCL', 'Imperial', 'TU Berlin', 'NUS', 'NTU', 'Sorbonne', 'University of Tokyo', 'UofT', 'Multiple'];

const Students: React.FC<StudentsProps> = ({ currentLocation }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('All Universities');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Detect user's location
  const userCity = currentLocation?.city || 'Boston';
  const userCountry = currentLocation?.country || 'USA';

  // Filter and sort groups
  const filteredGroups = useMemo(() => {
    let filtered = studentGroups;

    // Filter by platform
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(group => group.platform === selectedPlatform);
    }

    // Filter by topic
    if (selectedTopic !== 'All Topics') {
      filtered = filtered.filter(group => group.topic === selectedTopic);
    }

    // Filter by university
    if (selectedUniversity !== 'All Universities') {
      filtered = filtered.filter(group => group.university === selectedUniversity);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(query) ||
        group.university.toLowerCase().includes(query) ||
        group.location.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedPlatform, selectedTopic, selectedUniversity, searchQuery]);

  // Get top 3 groups for user's location
  const topLocalGroups = useMemo(() => {
    return studentGroups
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
        return <GraduationCap className="h-5 w-5" />;
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
        <h1 className="text-4xl font-bold gradient-text mb-2">University Student Groups</h1>
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
              <GraduationCap className="h-5 w-5 text-primary" />
              Top Student Groups in Your Area
            </CardTitle>
            <CardDescription>Most popular university communities near you</CardDescription>
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
                      <p className="text-xs text-muted-foreground mb-1">{group.university}</p>
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, university, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Dropdowns */}
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
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">University</label>
                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {universities.map((uni) => (
                      <SelectItem key={uni} value={uni}>
                        {uni}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                    <p className="text-sm font-medium text-primary mb-1">{group.university}</p>
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
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No groups found with the selected filters</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPlatform('all');
                    setSelectedTopic('All Topics');
                    setSelectedUniversity('All Universities');
                    setSearchQuery('');
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Students;
