import React, { useState, useEffect } from 'react';
import { Settings2, User, Bot, Volume2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { useToast } from '@/hooks/use-toast';
import { AvatarFace } from './ConciergeAvatar';
import avatarFemale from '@/assets/avatar-female.png';
import avatarMale from '@/assets/avatar-male.png';

export type PersonalityMode = 'normal' | 'strict' | 'humor' | 'dark_humor';
export type VoiceGender = 'woman' | 'man';

export interface ConciergePreferences {
  userName: string;
  personalityMode: PersonalityMode;
  voiceGender: VoiceGender;
  aiName: string;
  avatarFace: AvatarFace;
  avatarVisible: boolean;
}

const DEFAULT_PREFS: ConciergePreferences = {
  userName: '',
  personalityMode: 'normal',
  voiceGender: 'woman',
  aiName: 'Concierge',
  avatarFace: 'female',
  avatarVisible: true,
};

const PERSONALITY_OPTIONS: { value: PersonalityMode; label: string; desc: string }[] = [
  { value: 'normal', label: '😊 Normal', desc: 'Friendly, warm & positive' },
  { value: 'strict', label: '📋 Strict & Short', desc: 'Direct, no fluff, bullet points' },
  { value: 'humor', label: '😄 Humorous', desc: 'Witty jokes & playful banter' },
  { value: 'dark_humor', label: '🖤 Dark Humor', desc: 'Dry, sarcastic wit (respectful)' },
];

const STORAGE_KEY = 'concierge_preferences';

export const getConciergePrefs = (): ConciergePreferences => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
  } catch {}
  return { ...DEFAULT_PREFS };
};

const ConciergeSettings: React.FC<{ onPrefsChange?: (prefs: ConciergePreferences) => void }> = ({ onPrefsChange }) => {
  const { activePersona } = useDemoPersona();
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<ConciergePreferences>(getConciergePrefs);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (activePersona?.id) {
      const personaDrivenPrefs: Partial<ConciergePreferences> = activePersona.id === 'john'
        ? {
            userName: activePersona.profile.firstName,
            voiceGender: 'man',
            avatarFace: 'male',
          }
        : {
            userName: activePersona.profile.firstName,
            voiceGender: 'woman',
            avatarFace: 'female',
          };

      setPrefs(prev => {
        const next = { ...prev, ...personaDrivenPrefs };
        return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
      });
    } else {
      // Reset to neutral defaults when no persona is active
      setPrefs(prev => {
        const neutral: ConciergePreferences = {
          ...DEFAULT_PREFS,
          personalityMode: prev.personalityMode, // keep user's chosen personality
          avatarVisible: prev.avatarVisible, // keep visibility preference
        };
        return JSON.stringify(prev) === JSON.stringify(neutral) ? prev : neutral;
      });
    }
  }, [activePersona?.id, activePersona?.profile?.firstName]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    onPrefsChange?.(prefs);
  }, [prefs, onPrefsChange]);

  const updatePref = <K extends keyof ConciergePreferences>(key: K, value: ConciergePreferences[K]) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setOpen(false);
    toast({ title: 'Settings saved', description: `Your concierge preferences are set for this session.` });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Concierge Settings">
          <Settings2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[340px] sm:w-[380px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            AI Concierge Profile
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Eye className="h-4 w-4 text-muted-foreground" />
              Concierge Avatar
            </Label>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                {prefs.avatarVisible ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm">{prefs.avatarVisible ? 'Avatar visible' : 'Avatar hidden'}</span>
              </div>
              <Switch
                checked={prefs.avatarVisible}
                onCheckedChange={(v) => updatePref('avatarVisible', v)}
              />
            </div>

            {/* Face Selection */}
            {prefs.avatarVisible && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updatePref('avatarFace', 'female')}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    prefs.avatarFace === 'female'
                      ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                      : 'border-border hover:border-muted-foreground/40'
                  }`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img src={avatarFemale} alt="Female avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <span className="text-xs font-semibold text-white">👩 Sofia</span>
                  </div>
                  {prefs.avatarFace === 'female' && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-[10px] text-primary-foreground font-bold">✓</span>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => updatePref('avatarFace', 'male')}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    prefs.avatarFace === 'male'
                      ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                      : 'border-border hover:border-muted-foreground/40'
                  }`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img src={avatarMale} alt="Male avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <span className="text-xs font-semibold text-white">👨 Marcus</span>
                  </div>
                  {prefs.avatarFace === 'male' && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-[10px] text-primary-foreground font-bold">✓</span>
                    </div>
                  )}
                </button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Choose your concierge's face. The avatar animates when speaking.
            </p>
          </div>

          <Separator />

          {/* User Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              What should I call you?
            </Label>
            <Input
              value={prefs.userName}
              onChange={e => updatePref('userName', e.target.value)}
              placeholder="Enter your preferred name"
              className="text-sm"
            />
          </div>

          <Separator />

          {/* AI Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              Name your Concierge
            </Label>
            <Input
              value={prefs.aiName}
              onChange={e => updatePref('aiName', e.target.value)}
              placeholder="e.g. Atlas, Nova, Jarvis..."
              className="text-sm"
            />
          </div>

          <Separator />

          {/* Personality Mode */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Bot className="h-4 w-4 text-muted-foreground" />
              Personality Mode
            </Label>
            <RadioGroup
              value={prefs.personalityMode}
              onValueChange={(v) => updatePref('personalityMode', v as PersonalityMode)}
              className="space-y-2"
            >
              {PERSONALITY_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    prefs.personalityMode === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                  onClick={() => updatePref('personalityMode', opt.value)}
                >
                  <RadioGroupItem value={opt.value} id={`mode-${opt.value}`} />
                  <div className="flex-1">
                    <Label htmlFor={`mode-${opt.value}`} className="text-sm font-medium cursor-pointer">
                      {opt.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Voice Gender */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              Voice Type
            </Label>
            <RadioGroup
              value={prefs.voiceGender}
              onValueChange={(v) => updatePref('voiceGender', v as VoiceGender)}
              className="grid grid-cols-2 gap-3"
            >
              <div
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  prefs.voiceGender === 'woman'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
                onClick={() => updatePref('voiceGender', 'woman')}
              >
                <RadioGroupItem value="woman" id="voice-woman" />
                <Label htmlFor="voice-woman" className="text-sm cursor-pointer">👩 Woman</Label>
              </div>
              <div
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  prefs.voiceGender === 'man'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
                onClick={() => updatePref('voiceGender', 'man')}
              >
                <RadioGroupItem value="man" id="voice-man" />
                <Label htmlFor="voice-man" className="text-sm cursor-pointer">👨 Man</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <Button onClick={handleSave} className="w-full">
            Save Preferences
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Settings are saved for this browser session.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ConciergeSettings;
