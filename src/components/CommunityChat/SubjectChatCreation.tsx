import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ChatCategory, ChatDuration, SkillLevel, ChatRoomSettings, AIModerator } from '@/types/subjectChat';
import { CHAT_CATEGORIES, CHAT_DURATIONS, SKILL_LEVELS } from '@/data/subjectChatData';
import { Sparkles, Users, Clock, MapPin, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubjectChatCreationProps {
  onCreateChat: (chatData: any) => void;
  onCancel: () => void;
}

export const SubjectChatCreation = ({ onCreateChat, onCancel }: SubjectChatCreationProps) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<ChatCategory>(ChatCategory.SPORTS_ACTIVITIES);
  const [description, setDescription] = useState('');
  
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

  const toggleSkillLevel = (skill: SkillLevel) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleCreate = () => {
    if (!subject.trim()) {
      toast({
        title: 'Subject Required',
        description: 'Please enter a subject for your chat room',
        variant: 'destructive'
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: 'Description Required',
        description: 'Please provide a description for your chat room',
        variant: 'destructive'
      });
      return;
    }

    if (selectedSkills.length === 0) {
      toast({
        title: 'Skill Level Required',
        description: 'Please select at least one skill level',
        variant: 'destructive'
      });
      return;
    }

    const chatData = {
      creator: 'You',
      creatorAvatar: '👤',
      subject: subject.trim(),
      category,
      description: description.trim(),
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
      description: 'Your subject chat is now live and accepting participants'
    });
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            🎯 Create Subject Chat
          </h2>
          <p className="text-muted-foreground">
            Create a focused chat room around a specific topic or activity
          </p>
        </div>

        {/* Subject & Category */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="e.g., Padel Tennis Beginners"
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
              placeholder="Describe what this chat is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-[80px]"
            />
          </div>
        </div>

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

            {/* Location Radius */}
            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location Radius: {settings.locationRadius} km
              </Label>
              <Slider
                value={[settings.locationRadius]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, locationRadius: value }))}
                min={1}
                max={50}
                step={1}
                className="mt-2"
              />
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

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleCreate} className="flex-1">
            <Shield className="w-4 h-4 mr-2" />
            Create Chat Room
          </Button>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};
