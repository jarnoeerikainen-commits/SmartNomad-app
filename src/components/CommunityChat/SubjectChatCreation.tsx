import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatCategory, ChatDuration, SkillLevel, ChatRoomSettings, AIModerator } from '@/types/subjectChat';
import { CHAT_CATEGORIES, CHAT_DURATIONS, SKILL_LEVELS } from '@/data/subjectChatData';
import { Sparkles, Users, Clock, MapPin, Shield, Search, Globe, X, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GLOBAL_CITIES } from '@/data/globalCities';

interface SubjectChatCreationProps {
  onCreateChat: (chatData: any) => void;
  onCancel: () => void;
}

// Popular nomad cities shown as quick-pick chips
const POPULAR_CITIES = [
  'London', 'Dubai', 'Singapore', 'New York', 'Bangkok', 'Lisbon',
  'Barcelona', 'Bali', 'Berlin', 'Tokyo', 'Miami', 'Paris'
];

export const SubjectChatCreation = ({ onCreateChat, onCancel }: SubjectChatCreationProps) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<ChatCategory>(ChatCategory.SPORTS_ACTIVITIES);
  const [description, setDescription] = useState('');

  // Location state
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [customCity, setCustomCity] = useState(false);
  
  const [settings, setSettings] = useState<ChatRoomSettings>({
    privacy: 'public',
    ageRange: 'all-ages',
    skillLevel: [SkillLevel.BEGINNER],
    capacity: 8,
    duration: ChatDuration.THREE_DAYS,
    locationRadius: 5
  });

  const [aiModerator, setAiModerator] = useState<AIModerator>({
    enabled: true,
    strictness: 'moderate',
    topicEnforcement: true,
    summaryFrequency: 'daily',
    welcomeNewUsers: true
  });

  const [selectedSkills, setSelectedSkills] = useState<SkillLevel[]>([SkillLevel.BEGINNER]);
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(65);
  const [useAgeRange, setUseAgeRange] = useState(false);

  // City search filtering
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return [];
    const q = citySearch.toLowerCase();
    return GLOBAL_CITIES
      .filter(c => 
        c.cityName.toLowerCase().includes(q) || 
        c.countryName.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [citySearch]);

  const handleSelectCity = (cityName: string, countryName: string) => {
    setSelectedCity(cityName);
    setSelectedCountry(countryName);
    setCitySearch('');
    setShowCityDropdown(false);
    setCustomCity(false);
  };

  const handlePopularCityClick = (cityName: string) => {
    const city = GLOBAL_CITIES.find(c => c.cityName === cityName);
    if (city) {
      handleSelectCity(city.cityName, city.countryName);
    }
  };

  const handleUseCustomCity = () => {
    if (citySearch.trim()) {
      setSelectedCity(citySearch.trim());
      setSelectedCountry('');
      setCustomCity(true);
      setShowCityDropdown(false);
    }
  };

  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Find nearest city from GLOBAL_CITIES
          const { latitude, longitude } = pos.coords;
          let nearest = GLOBAL_CITIES[0];
          let minDist = Infinity;
          GLOBAL_CITIES.forEach(city => {
            const dist = Math.sqrt(
              Math.pow(city.latitude - latitude, 2) + Math.pow(city.longitude - longitude, 2)
            );
            if (dist < minDist) { minDist = dist; nearest = city; }
          });
          handleSelectCity(nearest.cityName, nearest.countryName);
          toast({ title: '📍 Location Detected', description: `Set to ${nearest.cityName}, ${nearest.countryName}` });
        },
        () => {
          toast({ title: 'Location unavailable', description: 'Please search for your city manually', variant: 'destructive' });
        }
      );
    }
  };

  const clearCity = () => {
    setSelectedCity('');
    setSelectedCountry('');
    setNeighborhood('');
    setCitySearch('');
    setCustomCity(false);
  };

  const toggleSkillLevel = (skill: SkillLevel) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleCreate = () => {
    if (!subject.trim()) {
      toast({ title: 'Subject Required', description: 'Please enter a subject for your chat room', variant: 'destructive' });
      return;
    }
    if (!description.trim()) {
      toast({ title: 'Description Required', description: 'Please provide a description for your chat room', variant: 'destructive' });
      return;
    }
    if (selectedSkills.length === 0) {
      toast({ title: 'Skill Level Required', description: 'Please select at least one skill level', variant: 'destructive' });
      return;
    }
    if (!selectedCity) {
      toast({ title: 'Location Required', description: 'Please choose a city for your group', variant: 'destructive' });
      return;
    }

    const chatData = {
      creator: 'You',
      creatorAvatar: '👤',
      subject: subject.trim(),
      category,
      description: description.trim(),
      location: {
        city: selectedCity,
        country: selectedCountry,
        neighborhood: neighborhood.trim() || undefined,
      },
      settings: {
        ...settings,
        ageRange: useAgeRange ? { min: ageMin, max: ageMax } : 'all-ages',
        skillLevel: selectedSkills
      },
      aiModerator
    };

    onCreateChat(chatData);
    
    toast({
      title: 'Chat Room Created!',
      description: `Your group in ${selectedCity}${neighborhood ? ` (${neighborhood})` : ''} is now live`
    });
  };

  const locationDisplay = selectedCity 
    ? `${selectedCity}${selectedCountry ? `, ${selectedCountry}` : ''}${neighborhood ? ` — ${neighborhood}` : ''}`
    : '';

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            🎯 Create Group
          </h2>
          <p className="text-muted-foreground">
            Create a group for any activity, anywhere in the world
          </p>
        </div>

        {/* Subject & Category */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="e.g., Padel Tennis Beginners, Morning Run Club"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ChatCategory)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHAT_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this group is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-[80px]"
            />
          </div>
        </div>

        {/* ══════ LOCATION PICKER ══════ */}
        <Card className="p-4 border-2 border-primary/20 bg-primary/5">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            Location *
          </h3>

          {/* Selected city display */}
          {selectedCity ? (
            <div className="mb-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{selectedCity}</p>
                  {selectedCountry && <p className="text-sm text-muted-foreground">{selectedCountry}</p>}
                </div>
                <Button size="icon" variant="ghost" onClick={clearCity} className="shrink-0 h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Neighborhood / Area (optional) */}
              <div className="mt-3">
                <Label className="text-sm text-muted-foreground">Neighborhood or area (optional)</Label>
                <Input
                  placeholder="e.g., Soho, Marina Bay, Shibuya, Downtown..."
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Be specific to attract locals — e.g., "Canggu" instead of just "Bali"
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Detect location button */}
              <Button 
                variant="outline" 
                onClick={handleDetectLocation}
                className="w-full gap-2 border-dashed"
              >
                <Navigation className="w-4 h-4" />
                Use My Current Location
              </Button>

              {/* Search input */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search any city in the world..."
                    value={citySearch}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      setShowCityDropdown(true);
                    }}
                    onFocus={() => setShowCityDropdown(true)}
                    className="pl-10"
                  />
                </div>

                {/* Dropdown results */}
                {showCityDropdown && citySearch.trim() && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg overflow-hidden">
                    <ScrollArea className="max-h-[240px]">
                      {filteredCities.length > 0 ? (
                        filteredCities.map(city => (
                          <button
                            key={city.id}
                            onClick={() => handleSelectCity(city.cityName, city.countryName)}
                            className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3 transition-colors"
                          >
                            <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                              <span className="font-medium">{city.cityName}</span>
                              <span className="text-muted-foreground text-sm ml-1">— {city.countryName}</span>
                            </div>
                            <Badge variant="outline" className="ml-auto text-xs shrink-0">{city.tier === 'tier1' ? '⭐' : city.tier === 'tier2' ? '🌍' : '📍'}</Badge>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          <p>No matching city found</p>
                          <Button 
                            variant="link" 
                            size="sm" 
                            onClick={handleUseCustomCity}
                            className="mt-1"
                          >
                            Use "{citySearch}" as custom location
                          </Button>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>

              {/* Popular cities chips */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Popular Cities</Label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CITIES.map(city => (
                    <Badge
                      key={city}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-colors py-1.5 px-3"
                      onClick={() => handlePopularCityClick(city)}
                    >
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Location Radius */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <Label className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              Search Radius: {settings.locationRadius} km
            </Label>
            <Slider
              value={[settings.locationRadius]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, locationRadius: value }))}
              min={1}
              max={50}
              step={1}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Members within this radius will be notified
            </p>
          </div>
        </Card>

        {/* Chat Settings */}
        <Card className="p-4 bg-accent/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Chat Settings
          </h3>

          <div className="space-y-4">
            {/* Capacity */}
            <div>
              <Label>Max Participants: {settings.capacity}</Label>
              <Slider
                value={[settings.capacity]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, capacity: value }))}
                min={2}
                max={50}
                step={1}
                className="mt-2"
              />
            </div>

            {/* Age Range */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Age Range</Label>
                <Switch
                  checked={useAgeRange}
                  onCheckedChange={setUseAgeRange}
                />
              </div>
              {useAgeRange && (
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <Label className="text-sm">Min: {ageMin}</Label>
                    <Slider
                      value={[ageMin]}
                      onValueChange={([value]) => setAgeMin(value)}
                      min={18}
                      max={ageMax - 1}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm">Max: {ageMax}</Label>
                    <Slider
                      value={[ageMax]}
                      onValueChange={([value]) => setAgeMax(value)}
                      min={ageMin + 1}
                      max={80}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Privacy */}
            <div>
              <Label>Privacy</Label>
              <Select value={settings.privacy} onValueChange={(value: any) => setSettings(prev => ({ ...prev, privacy: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="invite-only">Invite Only</SelectItem>
                  <SelectItem value="approval-required">Approval Required</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skill Levels */}
            <div>
              <Label>Skill Levels</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {SKILL_LEVELS.map(skill => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleSkillLevel(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration
              </Label>
              <Select value={settings.duration} onValueChange={(value: ChatDuration) => setSettings(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHAT_DURATIONS.map(duration => (
                    <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* AI Moderator */}
        <Card className="p-4 bg-accent/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Moderator
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable AI Moderation</Label>
              <Switch
                checked={aiModerator.enabled}
                onCheckedChange={(enabled) => setAiModerator(prev => ({ ...prev, enabled }))}
              />
            </div>

            {aiModerator.enabled && (
              <>
                <div>
                  <Label>Strictness</Label>
                  <Select value={aiModerator.strictness} onValueChange={(value: any) => setAiModerator(prev => ({ ...prev, strictness: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relaxed">Relaxed</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Keep discussions on topic</Label>
                  <Switch
                    checked={aiModerator.topicEnforcement}
                    onCheckedChange={(topicEnforcement) => setAiModerator(prev => ({ ...prev, topicEnforcement }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Welcome new participants</Label>
                  <Switch
                    checked={aiModerator.welcomeNewUsers}
                    onCheckedChange={(welcomeNewUsers) => setAiModerator(prev => ({ ...prev, welcomeNewUsers }))}
                  />
                </div>

                <div>
                  <Label>Summary Frequency</Label>
                  <Select value={aiModerator.summaryFrequency} onValueChange={(value: any) => setAiModerator(prev => ({ ...prev, summaryFrequency: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Every 24 Hours</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Summary & Actions */}
        {selectedCity && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>
              Group will be created in <strong className="text-foreground">{locationDisplay}</strong> with a {settings.locationRadius}km radius
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleCreate} className="flex-1" size="lg">
            <Shield className="w-4 h-4 mr-2" />
            Create Group
          </Button>
          <Button onClick={onCancel} variant="outline" size="lg">
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};
