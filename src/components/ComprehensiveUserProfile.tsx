import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  User, Globe, Briefcase, Heart, Plane, Utensils, Home, 
  Shield, Sparkles, CheckCircle2, AlertCircle, Crown, Lock,
  TrendingUp, Target, Zap, Gift, Mic, MicOff, Car,
  Dumbbell, Coffee, Music, BookOpen, Stethoscope, GraduationCap,
  ShoppingBag, Baby, PawPrint, Languages
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ComprehensiveUserProfile, ProfileProgress } from '@/types/userProfile';
import { Subscription } from '@/types/subscription';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface ComprehensiveUserProfileProps {
  subscription?: Subscription;
  onUpgradeClick?: () => void;
}

// Voice Input Button Component
const VoiceButton: React.FC<{ 
  onResult: (text: string) => void; 
  label?: string;
}> = ({ onResult, label }) => {
  const { isListening, startListening, stopListening, isSupported } = useVoiceInput();
  
  if (!isSupported) return null;
  
  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      size="sm"
      className="h-8 px-2 gap-1"
      onClick={() => isListening ? stopListening() : startListening(onResult)}
      title={label || "Voice input"}
    >
      {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
      <span className="text-xs hidden sm:inline">{isListening ? 'Stop' : 'Voice'}</span>
    </Button>
  );
};

// Chip selector for multi-select options
const ChipSelector: React.FC<{
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  columns?: number;
}> = ({ options, selected, onChange, columns = 3 }) => (
  <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-2`}>
    {options.map(opt => (
      <button
        key={opt}
        type="button"
        onClick={() => {
          onChange(
            selected.includes(opt)
              ? selected.filter(s => s !== opt)
              : [...selected, opt]
          );
        }}
        className={`px-3 py-2 text-xs rounded-lg border transition-all capitalize ${
          selected.includes(opt) 
            ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
            : 'bg-background border-border hover:border-primary/50 hover:bg-primary/5'
        }`}
      >
        {opt.replace(/-/g, ' ')}
      </button>
    ))}
  </div>
);

const ComprehensiveUserProfileComponent: React.FC<ComprehensiveUserProfileProps> = ({ 
  subscription, 
  onUpgradeClick 
}) => {
  const [profile, setProfile] = useState<Partial<ComprehensiveUserProfile>>({
    completionLevel: 'basic'
  });
  const [activeTab, setActiveTab] = useState('core');
  const [progress, setProgress] = useState<ProfileProgress>({
    core: 0, lifestyle: 0, travel: 0, personal: 0, overall: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('comprehensiveUserProfile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const coreFields = [
      profile.core?.personal?.firstName,
      profile.core?.personal?.lastName,
      profile.core?.personal?.email,
      profile.core?.personal?.birthDate,
      profile.core?.legal?.taxResidencyCountry,
      profile.core?.legal?.currentResidencyCountry,
    ].filter(Boolean).length;
    const coreProgress = (coreFields / 6) * 100;

    const lifestyleFields = [
      profile.lifestyle?.family?.maritalStatus,
      profile.lifestyle?.professional?.employmentStatus,
      profile.lifestyle?.professional?.jobTitle,
      profile.lifestyle?.professional?.industry,
      profile.lifestyle?.professional?.incomeBracket,
      profile.lifestyle?.family?.pets?.hasPets !== undefined,
    ].filter(Boolean).length;
    const lifestyleProgress = (lifestyleFields / 6) * 100;

    const travelFields = [
      (profile.travel?.preferences?.favoriteDestinations?.types?.length || 0) > 0,
      (profile.travel?.preferences?.timing?.preferredSeasons?.length || 0) > 0,
      profile.travel?.preferences?.budget?.accommodation,
      (profile.travel?.preferences?.travelStyle?.purpose?.length || 0) > 0,
    ].filter(Boolean).length;
    const travelProgress = (travelFields / 4) * 100;

    const personalFields = [
      (profile.personal?.sports?.active?.length || 0) > 0,
      (profile.personal?.dietary?.favoriteCuisines?.length || 0) > 0,
      (profile.personal?.hobbies?.activities?.length || 0) > 0,
      (profile.personal?.accommodation?.amenities?.length || 0) > 0,
      profile.personal?.health?.sleepPattern,
    ].filter(Boolean).length;
    const personalProgress = (personalFields / 5) * 100;

    const overall = (coreProgress + lifestyleProgress + travelProgress + personalProgress) / 4;
    setProgress({
      core: Math.min(coreProgress, 100),
      lifestyle: Math.min(lifestyleProgress, 100),
      travel: Math.min(travelProgress, 100),
      personal: Math.min(personalProgress, 100),
      overall: Math.min(overall, 100)
    });
  }, [profile]);

  const saveProfile = () => {
    localStorage.setItem('comprehensiveUserProfile', JSON.stringify({ ...profile, updatedAt: new Date() }));
    toast({ title: "Profile Saved ✓", description: "Your profile has been updated successfully." });
  };

  const updateNested = (path: string, value: any) => {
    setProfile(prev => {
      const keys = path.split('.');
      const result = JSON.parse(JSON.stringify(prev || {}));
      let current = result;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return result;
    });
  };

  const getNested = (path: string, fallback: any = ''): any => {
    const keys = path.split('.');
    let current: any = profile;
    for (const key of keys) {
      if (current === undefined || current === null) return fallback;
      current = current[key];
    }
    return current ?? fallback;
  };

  return (
    <div className="space-y-6">
      {/* Profile Completion Overview */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-xl">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Your AI Profile</CardTitle>
                <CardDescription>
                  {progress.overall < 25 && "🚀 Just getting started — fill in more for smarter AI recommendations"}
                  {progress.overall >= 25 && progress.overall < 50 && "📊 Good progress — more details = better personalization"}
                  {progress.overall >= 50 && progress.overall < 75 && "⭐ Looking great — AI is learning your preferences"}
                  {progress.overall >= 75 && "🏆 Excellent! Your AI knows you perfectly"}
                </CardDescription>
              </div>
            </div>
            {subscription?.tier !== 'free' && (
              <Badge variant="default" className="gap-1">
                <Crown className="w-3 h-3" />
                {subscription?.tier?.toUpperCase()}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overall Completion</span>
              <span className="font-bold text-primary">{Math.round(progress.overall)}%</span>
            </div>
            <Progress value={progress.overall} className="h-3" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Core', value: progress.core, icon: '👤' },
              { label: 'Lifestyle', value: progress.lifestyle, icon: '💼' },
              { label: 'Travel', value: progress.travel, icon: '✈️' },
              { label: 'Personal', value: progress.personal, icon: '🎯' },
            ].map(item => (
              <div key={item.label} className="p-2 bg-background/60 rounded-lg border text-center">
                <div className="text-lg">{item.icon}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-sm font-bold">{Math.round(item.value)}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Why share data */}
      <Alert className="bg-primary/5 border-primary/20">
        <Sparkles className="h-4 w-4" />
        <AlertTitle>The more you share, the smarter your AI concierge becomes</AlertTitle>
        <AlertDescription className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2"><Target className="w-3 h-3 text-primary shrink-0" /><span>Personalized destination matching</span></div>
          <div className="flex items-center gap-2"><Utensils className="w-3 h-3 text-primary shrink-0" /><span>Restaurant & food recommendations</span></div>
          <div className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-primary shrink-0" /><span>Tax savings & financial optimization</span></div>
          <div className="flex items-center gap-2"><Dumbbell className="w-3 h-3 text-primary shrink-0" /><span>Sports & fitness activity finder</span></div>
        </AlertDescription>
      </Alert>

      {/* Voice Input Banner */}
      <Alert className="bg-accent/50 border-accent">
        <Mic className="h-4 w-4" />
        <AlertTitle>🎙️ Voice Input Available</AlertTitle>
        <AlertDescription>
          Click the <Mic className="h-3 w-3 inline" /> button next to any text field to fill it with your voice. Speak naturally!
        </AlertDescription>
      </Alert>

      {/* Profile Sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="core" className="flex items-center gap-1 text-xs">
            <User className="w-3 h-3" />
            <span className="hidden sm:inline">Core</span>
          </TabsTrigger>
          <TabsTrigger value="lifestyle" className="flex items-center gap-1 text-xs">
            <Briefcase className="w-3 h-3" />
            <span className="hidden sm:inline">Work</span>
          </TabsTrigger>
          <TabsTrigger value="travel" className="flex items-center gap-1 text-xs">
            <Plane className="w-3 h-3" />
            <span className="hidden sm:inline">Travel</span>
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-1 text-xs">
            <Heart className="w-3 h-3" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-1 text-xs">
            <Stethoscope className="w-3 h-3" />
            <span className="hidden sm:inline">Health</span>
          </TabsTrigger>
          <TabsTrigger value="ai-consent" className="flex items-center gap-1 text-xs">
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>

        {/* CORE TAB */}
        <TabsContent value="core" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Personal Identity</CardTitle>
              <CardDescription>Basic information about you — nothing is mandatory except name & email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <div className="flex gap-2">
                    <Input placeholder="John" value={getNested('core.personal.firstName')} onChange={e => updateNested('core.personal.firstName', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('core.personal.firstName', t)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Doe" value={getNested('core.personal.lastName')} onChange={e => updateNested('core.personal.lastName', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('core.personal.lastName', t)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" placeholder="john@example.com" value={getNested('core.personal.email')} onChange={e => updateNested('core.personal.email', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="flex gap-2">
                    <Input type="tel" placeholder="+1 234 567 8900" value={getNested('core.personal.phone')} onChange={e => updateNested('core.personal.phone', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('core.personal.phone', t)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input type="date" value={getNested('core.personal.birthDate')} onChange={e => updateNested('core.personal.birthDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={getNested('core.personal.gender', 'prefer-not-to-say')} onValueChange={v => updateNested('core.personal.gender', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-Binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Nickname / Display Name</Label>
                  <div className="flex gap-2">
                    <Input placeholder="How should AI call you?" value={getNested('core.personal.nickname')} onChange={e => updateNested('core.personal.nickname', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('core.personal.nickname', t)} />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Short Bio</Label>
                  <Textarea placeholder="Tell us about yourself in a few sentences..." value={getNested('core.personal.bio')} onChange={e => updateNested('core.personal.bio', e.target.value)} rows={3} />
                </div>
              </div>

              <Separator />

              {/* Legal */}
              <h3 className="text-sm font-semibold flex items-center gap-2"><Shield className="w-4 h-4" /> Legal & Residency</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax Residency Country</Label>
                  <div className="flex gap-2">
                    <Input placeholder="United States" value={getNested('core.legal.taxResidencyCountry')} onChange={e => updateNested('core.legal.taxResidencyCountry', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('core.legal.taxResidencyCountry', t)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Current Country</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Spain" value={getNested('core.legal.currentResidencyCountry')} onChange={e => updateNested('core.legal.currentResidencyCountry', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('core.legal.currentResidencyCountry', t)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Visa Status</Label>
                  <Select value={getNested('core.legal.visaStatus', 'tourist')} onValueChange={v => updateNested('core.legal.visaStatus', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citizen">Citizen</SelectItem>
                      <SelectItem value="resident">Permanent Resident</SelectItem>
                      <SelectItem value="visa">Work/Study Visa</SelectItem>
                      <SelectItem value="tourist">Tourist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Driving License */}
              <h3 className="text-sm font-semibold flex items-center gap-2"><Car className="w-4 h-4" /> Driving License</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Label className="font-medium">Do you have a driving license?</Label>
                    <p className="text-xs text-muted-foreground">For car rental & road trip recommendations</p>
                  </div>
                  <Switch checked={getNested('core.legal.drivingLicense.hasLicense', false)} onCheckedChange={v => updateNested('core.legal.drivingLicense.hasLicense', v)} />
                </div>
                {getNested('core.legal.drivingLicense.hasLicense', false) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>License Countries</Label>
                      <div className="flex gap-2">
                        <Input placeholder="e.g., USA, Germany" value={getNested('core.legal.drivingLicense.countries', []).join(', ')} onChange={e => updateNested('core.legal.drivingLicense.countries', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))} />
                        <VoiceButton onResult={t => updateNested('core.legal.drivingLicense.countries', t.split(',').map(s => s.trim()))} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <Label className="font-medium">International Driving Permit</Label>
                      <Switch checked={getNested('core.legal.drivingLicense.internationalPermit', false)} onCheckedChange={v => updateNested('core.legal.drivingLicense.internationalPermit', v)} />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LIFESTYLE / WORK TAB */}
        <TabsContent value="lifestyle" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5" /> Family & Relationships</CardTitle>
              <CardDescription>Helps recommend family-friendly destinations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Relationship Status</Label>
                  <Select value={getNested('lifestyle.family.maritalStatus', 'prefer-not-to-say')} onValueChange={v => updateNested('lifestyle.family.maritalStatus', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['single', 'married', 'partnered', 'divorced', 'widowed', 'prefer-not-to-say'].map(s => (
                        <SelectItem key={s} value={s} className="capitalize">{s.replace(/-/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Number of Children</Label>
                  <Input type="number" min="0" placeholder="0" value={getNested('lifestyle.family.dependents.children', 0)} onChange={e => updateNested('lifestyle.family.dependents.children', parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Children's Ages</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g., 3, 7, 12" value={(getNested('lifestyle.family.dependents.ages', []) as number[]).join(', ')} onChange={e => updateNested('lifestyle.family.dependents.ages', e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)))} />
                    <VoiceButton onResult={t => updateNested('lifestyle.family.dependents.ages', t.split(/[,\s]+/).map(Number).filter(n => !isNaN(n)))} />
                  </div>
                </div>
              </div>

              <Separator />
              <h3 className="text-sm font-semibold flex items-center gap-2"><PawPrint className="w-4 h-4" /> Pets</h3>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label className="font-medium">Do you have pets?</Label>
                  <p className="text-xs text-muted-foreground">Find pet-friendly accommodation & travel</p>
                </div>
                <Switch checked={getNested('lifestyle.family.pets.hasPets', false)} onCheckedChange={v => updateNested('lifestyle.family.pets.hasPets', v)} />
              </div>
              {getNested('lifestyle.family.pets.hasPets', false) && (
                <div className="space-y-3">
                  <Label>Pet Types</Label>
                  <ChipSelector
                    options={['dog', 'cat', 'bird', 'fish', 'reptile', 'rabbit', 'other']}
                    selected={getNested('lifestyle.family.pets.types', [])}
                    onChange={v => updateNested('lifestyle.family.pets.types', v)}
                    columns={4}
                  />
                  <div className="space-y-2">
                    <Label>Pet Names</Label>
                    <div className="flex gap-2">
                      <Input placeholder="e.g., Max, Luna" value={(getNested('lifestyle.family.pets.names', []) as string[]).join(', ')} onChange={e => updateNested('lifestyle.family.pets.names', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                      <VoiceButton onResult={t => updateNested('lifestyle.family.pets.names', t.split(/[,\s]+/).filter(Boolean))} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <Label className="font-medium">Do you travel with your pets?</Label>
                    <Switch checked={getNested('lifestyle.family.pets.travelFriendly', false)} onCheckedChange={v => updateNested('lifestyle.family.pets.travelFriendly', v)} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> Professional Life</CardTitle>
              <CardDescription>For co-working, tax optimization & networking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employment Status</Label>
                  <Select value={getNested('lifestyle.professional.employmentStatus', 'employed')} onValueChange={v => updateNested('lifestyle.professional.employmentStatus', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['employed', 'self-employed', 'freelancer', 'entrepreneur', 'student', 'retired', 'seeking'].map(s => (
                        <SelectItem key={s} value={s} className="capitalize">{s.replace(/-/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g., Software Engineer" value={getNested('lifestyle.professional.jobTitle')} onChange={e => updateNested('lifestyle.professional.jobTitle', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('lifestyle.professional.jobTitle', t)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g., Google" value={getNested('lifestyle.professional.company')} onChange={e => updateNested('lifestyle.professional.company', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('lifestyle.professional.company', t)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g., Technology" value={getNested('lifestyle.professional.industry')} onChange={e => updateNested('lifestyle.professional.industry', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('lifestyle.professional.industry', t)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Annual Income Bracket</Label>
                  <Select value={getNested('lifestyle.professional.incomeBracket', '')} onValueChange={v => updateNested('lifestyle.professional.incomeBracket', v)}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {['<30k', '30-60k', '60-100k', '100-150k', '150-250k', '250k+'].map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn Profile</Label>
                  <Input placeholder="https://linkedin.com/in/..." value={getNested('lifestyle.professional.linkedIn')} onChange={e => updateNested('lifestyle.professional.linkedIn', e.target.value)} />
                </div>
              </div>

              <Separator />
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label className="font-medium">Remote Worker</Label>
                  <p className="text-xs text-muted-foreground">Get co-working space & internet recommendations</p>
                </div>
                <Switch checked={getNested('lifestyle.professional.remoteWork.isRemoteWorker', false)} onCheckedChange={v => updateNested('lifestyle.professional.remoteWork.isRemoteWorker', v)} />
              </div>
              {getNested('lifestyle.professional.remoteWork.isRemoteWorker', false) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Work Type</Label>
                    <Select value={getNested('lifestyle.professional.remoteWork.workType', 'full-time')} onValueChange={v => updateNested('lifestyle.professional.remoteWork.workType', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['full-time', 'part-time', 'project-based', 'hybrid'].map(w => (
                          <SelectItem key={w} value={w} className="capitalize">{w.replace(/-/g, ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Internet Needs</Label>
                    <Select value={getNested('lifestyle.professional.remoteWork.internetRequirements', 'high-speed')} onValueChange={v => updateNested('lifestyle.professional.remoteWork.internetRequirements', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['basic', 'high-speed', 'video-calls', 'streaming'].map(i => (
                          <SelectItem key={i} value={i} className="capitalize">{i.replace(/-/g, ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Separator />
              <h3 className="text-sm font-semibold flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Education</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Education Level</Label>
                  <Select value={getNested('lifestyle.education.level', '')} onValueChange={v => updateNested('lifestyle.education.level', v)}>
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      {['high-school', 'bachelors', 'masters', 'phd', 'self-taught', 'other'].map(l => (
                        <SelectItem key={l} value={l} className="capitalize">{l.replace(/-/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g., Computer Science" value={getNested('lifestyle.education.field')} onChange={e => updateNested('lifestyle.education.field', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('lifestyle.education.field', t)} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRAVEL TAB */}
        <TabsContent value="travel" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Plane className="w-5 h-5" /> Travel Style & Preferences</CardTitle>
              <CardDescription>Your AI will find perfect destinations matching your style</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="font-semibold">Travel Purpose (why do you travel?)</Label>
                <ChipSelector
                  options={['business', 'pleasure', 'digital-nomad', 'family', 'adventure', 'wellness', 'education', 'retirement']}
                  selected={getNested('travel.preferences.travelStyle.purpose', [])}
                  onChange={v => updateNested('travel.preferences.travelStyle.purpose', v)}
                  columns={4}
                />
              </div>

              <Separator />
              <div className="space-y-3">
                <Label className="font-semibold">Favorite Destination Types</Label>
                <ChipSelector
                  options={['beach', 'mountain', 'city', 'rural', 'adventure', 'cultural', 'island', 'desert', 'arctic']}
                  selected={getNested('travel.preferences.favoriteDestinations.types', [])}
                  onChange={v => updateNested('travel.preferences.favoriteDestinations.types', v)}
                />
              </div>

              <Separator />
              <div className="space-y-3">
                <Label className="font-semibold">Preferred Seasons</Label>
                <ChipSelector
                  options={['winter', 'spring', 'summer', 'autumn']}
                  selected={getNested('travel.preferences.timing.preferredSeasons', [])}
                  onChange={v => updateNested('travel.preferences.timing.preferredSeasons', v)}
                  columns={4}
                />
              </div>

              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Travel Pace</Label>
                  <Select value={getNested('travel.preferences.travelStyle.pacePreference', 'moderate')} onValueChange={v => updateNested('travel.preferences.travelStyle.pacePreference', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow-travel">Slow Travel</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="fast-paced">Fast-Paced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Travel With</Label>
                  <Select value={getNested('travel.preferences.travelStyle.groupPreference', 'solo')} onValueChange={v => updateNested('travel.preferences.travelStyle.groupPreference', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['solo', 'couple', 'family', 'friends', 'group-tour'].map(g => (
                        <SelectItem key={g} value={g} className="capitalize">{g.replace(/-/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Luggage Style</Label>
                  <Select value={getNested('travel.preferences.travelStyle.luggageStyle', 'normal')} onValueChange={v => updateNested('travel.preferences.travelStyle.luggageStyle', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['carry-on-only', 'light-packer', 'normal', 'heavy-packer'].map(l => (
                        <SelectItem key={l} value={l} className="capitalize">{l.replace(/-/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              <h3 className="text-sm font-semibold">Budget Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Accommodation', path: 'travel.preferences.budget.accommodation', options: ['budget', 'mid-range', 'luxury', 'ultra-luxury'] },
                  { label: 'Transportation', path: 'travel.preferences.budget.transportation', options: ['economy', 'premium', 'business', 'first-class'] },
                  { label: 'Activities', path: 'travel.preferences.budget.activities', options: ['minimal', 'moderate', 'extensive', 'unlimited'] },
                ].map(item => (
                  <div key={item.label} className="space-y-2">
                    <Label>{item.label}</Label>
                    <Select value={getNested(item.path, item.options[1])} onValueChange={v => updateNested(item.path, v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {item.options.map(o => (
                          <SelectItem key={o} value={o} className="capitalize">{o.replace(/-/g, ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Favorite Countries (comma-separated)</Label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., Japan, Italy, Thailand" value={(getNested('travel.preferences.favoriteDestinations.countries', []) as string[]).join(', ')} onChange={e => updateNested('travel.preferences.favoriteDestinations.countries', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                  <VoiceButton onResult={t => updateNested('travel.preferences.favoriteDestinations.countries', t.split(/[,\s]+/).filter(Boolean))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Favorite Cities (comma-separated)</Label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., Tokyo, Barcelona, Bangkok" value={(getNested('travel.preferences.favoriteDestinations.cities', []) as string[]).join(', ')} onChange={e => updateNested('travel.preferences.favoriteDestinations.cities', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                  <VoiceButton onResult={t => updateNested('travel.preferences.favoriteDestinations.cities', t.split(/[,\s]+/).filter(Boolean))} />
                </div>
              </div>

              <Separator />
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <Label className="font-medium">Accessibility Needs</Label>
                  <p className="text-xs text-muted-foreground">Filter destinations by accessibility</p>
                </div>
                <Switch checked={getNested('travel.mobility.impairments.hasMobilityIssues', false)} onCheckedChange={v => updateNested('travel.mobility.impairments.hasMobilityIssues', v)} />
              </div>

              <div className="space-y-2">
                <Label>Fitness Level</Label>
                <Select value={getNested('travel.mobility.fitnessLevel', 'moderate')} onValueChange={v => updateNested('travel.mobility.fitnessLevel', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['sedentary', 'moderate', 'active', 'athletic'].map(f => (
                      <SelectItem key={f} value={f} className="capitalize">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PERSONAL TAB */}
        <TabsContent value="personal" className="space-y-4 mt-6">
          {/* Sports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Dumbbell className="w-5 h-5" /> Sports & Fitness</CardTitle>
              <CardDescription>Find courts, gyms, and sports partners worldwide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="font-semibold">Sports You Play</Label>
                <ChipSelector
                  options={['tennis', 'padel', 'golf', 'swimming', 'running', 'cycling', 'yoga', 'pilates', 'boxing', 'surfing', 'skiing', 'snowboarding', 'hiking', 'climbing', 'martial-arts', 'basketball', 'football', 'volleyball', 'sailing', 'diving', 'gym', 'crossfit', 'dance']}
                  selected={getNested('personal.sports.active', [])}
                  onChange={v => updateNested('personal.sports.active', v)}
                  columns={4}
                />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold">Sports You Watch</Label>
                <ChipSelector
                  options={['formula1', 'football', 'tennis', 'basketball', 'cricket', 'rugby', 'boxing', 'mma', 'golf', 'horse-racing']}
                  selected={getNested('personal.sports.spectator', [])}
                  onChange={v => updateNested('personal.sports.spectator', v)}
                  columns={5}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fitness Goals</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g., Run a marathon, lose weight" value={getNested('personal.sports.fitnessGoals')} onChange={e => updateNested('personal.sports.fitnessGoals', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('personal.sports.fitnessGoals', t)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Weekly Exercise (times per week)</Label>
                  <Input type="number" min="0" max="14" placeholder="3" value={getNested('personal.sports.weeklyFrequency', '')} onChange={e => updateNested('personal.sports.weeklyFrequency', parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Food */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Utensils className="w-5 h-5" /> Food & Dining</CardTitle>
              <CardDescription>Get restaurant recommendations that match your taste</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="font-semibold">Dietary Preferences</Label>
                <ChipSelector
                  options={['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'pescatarian', 'keto', 'paleo', 'lactose-free', 'none']}
                  selected={getNested('personal.dietary.preferences', [])}
                  onChange={v => updateNested('personal.dietary.preferences', v)}
                  columns={5}
                />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold">Favorite Cuisines</Label>
                <ChipSelector
                  options={['italian', 'japanese', 'thai', 'mexican', 'indian', 'chinese', 'french', 'mediterranean', 'korean', 'vietnamese', 'middle-eastern', 'greek', 'spanish', 'american', 'brazilian', 'turkish', 'ethiopian', 'peruvian']}
                  selected={getNested('personal.dietary.favoriteCuisines', [])}
                  onChange={v => updateNested('personal.dietary.favoriteCuisines', v)}
                  columns={6}
                />
              </div>
              <div className="space-y-2">
                <Label>Allergies</Label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., peanuts, shellfish" value={(getNested('personal.dietary.allergies', []) as string[]).join(', ')} onChange={e => updateNested('personal.dietary.allergies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                  <VoiceButton onResult={t => updateNested('personal.dietary.allergies', t.split(/[,\s]+/).filter(Boolean))} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Cooking Habits</Label>
                  <Select value={getNested('personal.dietary.cookingHabits', 'mixed')} onValueChange={v => updateNested('personal.dietary.cookingHabits', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['eats-out', 'cooks-at-home', 'meal-delivery', 'mixed'].map(c => (
                        <SelectItem key={c} value={c} className="capitalize">{c.replace(/-/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label><Coffee className="w-3 h-3 inline mr-1" />Coffee or Tea?</Label>
                  <Select value={getNested('personal.dietary.coffeeTea', '')} onValueChange={v => updateNested('personal.dietary.coffeeTea', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {['coffee-addict', 'tea-lover', 'both', 'neither'].map(c => (
                        <SelectItem key={c} value={c} className="capitalize">{c.replace(/-/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Alcohol</Label>
                  <Select value={getNested('personal.dietary.alcoholPreference', '')} onValueChange={v => updateNested('personal.dietary.alcoholPreference', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {['wine', 'beer', 'cocktails', 'spirits', 'non-drinker', 'social-drinker'].map(a => (
                        <SelectItem key={a} value={a} className="capitalize">{a.replace(/-/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hobbies & Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Hobbies & Interests</CardTitle>
              <CardDescription>Find activities & experiences you'll love</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="font-semibold">Activities</Label>
                <ChipSelector
                  options={['photography', 'cooking', 'reading', 'gaming', 'music', 'painting', 'writing', 'gardening', 'meditation', 'wine-tasting', 'scuba-diving', 'skydiving', 'pottery', 'board-games', 'podcasts', 'blogging', 'volunteering']}
                  selected={getNested('personal.hobbies.activities', [])}
                  onChange={v => updateNested('personal.hobbies.activities', v)}
                  columns={4}
                />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold">Interests</Label>
                <ChipSelector
                  options={['art', 'music', 'technology', 'nature', 'history', 'food', 'wellness', 'culture', 'fashion', 'architecture', 'cinema', 'theater', 'literature', 'science', 'politics', 'cryptocurrency', 'investing', 'sustainability']}
                  selected={getNested('personal.hobbies.interests', [])}
                  onChange={v => updateNested('personal.hobbies.interests', v)}
                  columns={6}
                />
              </div>
              <div className="space-y-2">
                <Label>Social Preference</Label>
                <Select value={getNested('personal.hobbies.socialPreferences', 'mixed')} onValueChange={v => updateNested('personal.hobbies.socialPreferences', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['solo', 'small-groups', 'large-communities', 'mixed'].map(s => (
                      <SelectItem key={s} value={s} className="capitalize">{s.replace(/-/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Accommodation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Home className="w-5 h-5" /> Accommodation Preferences</CardTitle>
              <CardDescription>Find the perfect place to stay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="font-semibold">Preferred Types</Label>
                <ChipSelector
                  options={['hotel', 'apartment', 'hostel', 'villa', 'house-sit', 'resort', 'boutique-hotel', 'airbnb', 'coliving']}
                  selected={getNested('personal.accommodation.types', [])}
                  onChange={v => updateNested('personal.accommodation.types', v)}
                />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold">Must-Have Amenities</Label>
                <ChipSelector
                  options={['wifi', 'kitchen', 'pool', 'gym', 'workspace', 'parking', 'pet-friendly', 'laundry', 'balcony', 'air-conditioning', 'heating', 'sauna', 'rooftop']}
                  selected={getNested('personal.accommodation.amenities', [])}
                  onChange={v => updateNested('personal.accommodation.amenities', v)}
                  columns={4}
                />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold">Preferred Location</Label>
                <ChipSelector
                  options={['city-center', 'suburbs', 'beachfront', 'countryside', 'mountains', 'near-airport', 'near-coworking']}
                  selected={getNested('personal.accommodation.locations', [])}
                  onChange={v => updateNested('personal.accommodation.locations', v)}
                  columns={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Entertainment & Shopping */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Music className="w-5 h-5" /> Entertainment & Shopping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Favorite Music Genres</Label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., Jazz, Electronic, Rock" value={(getNested('personal.entertainment.musicGenres', []) as string[]).join(', ')} onChange={e => updateNested('personal.entertainment.musicGenres', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                  <VoiceButton onResult={t => updateNested('personal.entertainment.musicGenres', t.split(/[,\s]+/).filter(Boolean))} />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="font-semibold">Streaming Services</Label>
                <ChipSelector
                  options={['netflix', 'spotify', 'youtube-premium', 'disney-plus', 'hbo', 'apple-tv', 'amazon-prime']}
                  selected={getNested('personal.entertainment.streamingServices', [])}
                  onChange={v => updateNested('personal.entertainment.streamingServices', v)}
                  columns={4}
                />
              </div>
              <div className="space-y-2">
                <Label><ShoppingBag className="w-3 h-3 inline mr-1" />Shopping Style</Label>
                <Select value={getNested('personal.shopping.style', 'moderate')} onValueChange={v => updateNested('personal.shopping.style', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['minimalist', 'moderate', 'shopaholic'].map(s => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Shopping Preferences</Label>
                <ChipSelector
                  options={['online', 'local-markets', 'luxury-brands', 'vintage', 'sustainable', 'duty-free']}
                  selected={getNested('personal.shopping.preferences', [])}
                  onChange={v => updateNested('personal.shopping.preferences', v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Languages className="w-5 h-5" /> Languages You Speak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Languages (comma-separated with level)</Label>
                <div className="flex gap-2">
                  <Textarea placeholder="e.g., English (native), Spanish (fluent), Japanese (basic)" value={(getNested('personal.languages.spoken', []) as any[]).map((l: any) => typeof l === 'string' ? l : `${l.language} (${l.level})`).join(', ')} onChange={e => {
                    const langs = e.target.value.split(',').map(s => {
                      const match = s.trim().match(/^(.+?)\s*\((.+?)\)$/);
                      if (match) return { language: match[1].trim(), level: match[2].trim() };
                      return { language: s.trim(), level: 'conversational' };
                    }).filter(l => l.language);
                    updateNested('personal.languages.spoken', langs);
                  }} rows={2} />
                  <VoiceButton onResult={t => {
                    const langs = t.split(/[,]/).map(s => ({ language: s.trim(), level: 'conversational' })).filter(l => l.language);
                    updateNested('personal.languages.spoken', langs);
                  }} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Currently Learning</Label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., Mandarin, Portuguese" value={(getNested('personal.languages.learning', []) as string[]).join(', ')} onChange={e => updateNested('personal.languages.learning', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                  <VoiceButton onResult={t => updateNested('personal.languages.learning', t.split(/[,\s]+/).filter(Boolean))} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HEALTH TAB */}
        <TabsContent value="health" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Stethoscope className="w-5 h-5" /> Health & Wellness</CardTitle>
              <CardDescription>For emergency situations & wellness recommendations — completely optional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Blood Type</Label>
                  <Select value={getNested('personal.health.bloodType', '')} onValueChange={v => updateNested('personal.health.bloodType', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sleep Pattern</Label>
                  <Select value={getNested('personal.health.sleepPattern', '')} onValueChange={v => updateNested('personal.health.sleepPattern', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early-bird">Early Bird 🌅</SelectItem>
                      <SelectItem value="night-owl">Night Owl 🦉</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Chronic Conditions (private, for emergency use)</Label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., diabetes, asthma" value={(getNested('personal.health.chronicConditions', []) as string[]).join(', ')} onChange={e => updateNested('personal.health.chronicConditions', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                  <VoiceButton onResult={t => updateNested('personal.health.chronicConditions', t.split(/[,]+/).map(s => s.trim()).filter(Boolean))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Medications</Label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., insulin, inhaler" value={(getNested('personal.health.medications', []) as string[]).join(', ')} onChange={e => updateNested('personal.health.medications', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                  <VoiceButton onResult={t => updateNested('personal.health.medications', t.split(/[,]+/).map(s => s.trim()).filter(Boolean))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Insurance Provider</Label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., SafetyWing, World Nomads" value={getNested('personal.health.insuranceProvider')} onChange={e => updateNested('personal.health.insuranceProvider', e.target.value)} />
                  <VoiceButton onResult={t => updateNested('personal.health.insuranceProvider', t)} />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold">Mental Wellness Practices</Label>
                <ChipSelector
                  options={['meditation', 'therapy', 'journaling', 'mindfulness', 'none']}
                  selected={getNested('personal.health.mentalWellness', [])}
                  onChange={v => updateNested('personal.health.mentalWellness', v)}
                  columns={5}
                />
              </div>

              <Separator />
              <h3 className="text-sm font-semibold">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Jane Doe" value={getNested('personal.health.emergencyContact.name')} onChange={e => updateNested('personal.health.emergencyContact.name', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('personal.health.emergencyContact.name', t)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" placeholder="+1 234 567 8900" value={getNested('personal.health.emergencyContact.phone')} onChange={e => updateNested('personal.health.emergencyContact.phone', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Relation</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g., spouse, parent" value={getNested('personal.health.emergencyContact.relation')} onChange={e => updateNested('personal.health.emergencyContact.relation', e.target.value)} />
                    <VoiceButton onResult={t => updateNested('personal.health.emergencyContact.relation', t)} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI CONSENT TAB */}
        <TabsContent value="ai-consent" className="space-y-4 mt-6">
          <Alert className="bg-primary/5 border-primary/20">
            <Lock className="h-4 w-4" />
            <AlertTitle>Your Privacy Matters</AlertTitle>
            <AlertDescription>GDPR compliant. Full control over your data. All AI features require explicit consent.</AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> AI-Powered Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: 'taxOptimization', label: 'Tax Optimization', desc: 'AI-powered tax savings' },
                { id: 'travelPlanning', label: 'Travel Planning', desc: 'Personalized destinations' },
                { id: 'accommodationMatching', label: 'Accommodation Matching', desc: 'Smart place suggestions' },
                { id: 'insuranceRecommendations', label: 'Insurance', desc: 'Personalized coverage' },
                { id: 'socialConnections', label: 'Social Connections', desc: 'Meet like-minded nomads' },
                { id: 'promotionalOffers', label: 'Offers & Deals', desc: 'Personalized discounts' },
                { id: 'healthRecommendations', label: 'Health & Wellness', desc: 'Fitness & health tips' },
                { id: 'fitnessRecommendations', label: 'Fitness & Sports', desc: 'Find courts & gyms' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={getNested(`aiConsent.permissions.${item.id}`, false)}
                    onCheckedChange={v => updateNested(`aiConsent.permissions.${item.id}`, v)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Data Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: 'anonymizedAnalytics', label: 'Anonymized Analytics', desc: 'Help improve the app' },
                { id: 'partnerRecommendations', label: 'Partner Recommendations', desc: 'Trusted partner deals' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={getNested(`aiConsent.dataSharing.${item.id}`, false)}
                    onCheckedChange={v => updateNested(`aiConsent.dataSharing.${item.id}`, v)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive"><AlertCircle className="w-5 h-5" /> Your Data Rights (GDPR)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                {['Access all your data', 'Request corrections', 'Delete your account', 'Export in portable format', 'Withdraw consent anytime'].map(r => (
                  <li key={r} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" />{r}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex gap-3 sticky bottom-4 z-10">
        <Button onClick={saveProfile} size="lg" className="flex-1 shadow-lg">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Save Profile
        </Button>
        {subscription?.tier === 'free' && onUpgradeClick && (
          <Button onClick={onUpgradeClick} variant="outline" size="lg">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade
          </Button>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveUserProfileComponent;
