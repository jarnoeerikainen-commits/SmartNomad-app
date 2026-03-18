import React, { useState, useEffect } from 'react';
import { Settings2, User, Bot, Volume2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { useToast } from '@/hooks/use-toast';

export type PersonalityMode = 'normal' | 'strict' | 'humor' | 'dark_humor';
export type VoiceGender = 'woman' | 'man';

export interface ConciergePreferences {
  userName: string;
  personalityMode: PersonalityMode;
  voiceGender: VoiceGender;
  aiName: string;
}

const DEFAULT_PREFS: ConciergePreferences = {
  userName: '',
  personalityMode: 'normal',
  voiceGender: 'woman',
  aiName: 'Concierge',
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

  // Auto-fill user name from demo persona
  useEffect(() => {
    if (activePersona) {
      setPrefs(prev => {
        const updated = { ...prev, userName: activePersona.profile.firstName };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        onPrefsChange?.(updated);
        return updated;
      });
    }
  }, [activePersona?.id]);

  const updatePref = <K extends keyof ConciergePreferences>(key: K, value: ConciergePreferences[K]) => {
    setPrefs(prev => {
      const updated = { ...prev, [key]: value };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      onPrefsChange?.(updated);
      return updated;
    });
  };

  const handleSave = () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    onPrefsChange?.(prefs);
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
            <p className="text-xs text-muted-foreground">
              The AI will address you by this name during conversation.
            </p>
          </div>

          <Separator />

          {/* AI Name / Wake Word */}
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
            <p className="text-xs text-muted-foreground">
              Say this name to wake up the concierge for voice commands.
            </p>
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

          {/* Save Button */}
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
