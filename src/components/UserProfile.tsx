
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Languages, Phone, Globe, Building, CreditCard, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmbassyService, { Embassy } from '@/services/EmbassyService';
import { Subscription } from '@/types/subscription';

interface UserProfileData {
  languages: string[];
  phoneNumber: string;
  followedEmbassies: string[];
  nationality: string;
}

interface UserProfileProps {
  subscription?: Subscription;
  onUpgradeClick?: () => void;
}

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' }
];

const UserProfile: React.FC<UserProfileProps> = ({ subscription, onUpgradeClick }) => {
  const [profile, setProfile] = useState<UserProfileData>({
    languages: ['en'],
    phoneNumber: '',
    followedEmbassies: [],
    nationality: ''
  });
  const [embassies, setEmbassies] = useState<Embassy[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Load available embassies
    const embassyService = EmbassyService.getInstance();
    setEmbassies(embassyService.getAvailableEmbassies());
  }, []);

  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    toast({
      title: "Profile Updated",
      description: "Your preferences have been saved successfully.",
    });
  };

  const handleLanguageToggle = (languageCode: string) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.includes(languageCode)
        ? prev.languages.filter(lang => lang !== languageCode)
        : [...prev.languages, languageCode]
    }));
  };

  const handleEmbassyToggle = (embassyId: string) => {
    setProfile(prev => ({
      ...prev,
      followedEmbassies: prev.followedEmbassies.includes(embassyId)
        ? prev.followedEmbassies.filter(id => id !== embassyId)
        : [...prev.followedEmbassies, embassyId]
    }));
  };

  const handleRegisterWithEmbassy = async (embassyId: string) => {
    if (!profile.phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please add your phone number before registering with embassy.",
        variant: "destructive"
      });
      return;
    }

    const embassyService = EmbassyService.getInstance();
    const success = await embassyService.registerWithEmbassy(embassyId, profile.phoneNumber, {
      nationality: profile.nationality
    });

    if (success) {
      toast({
        title: "Embassy Registration",
        description: "Successfully registered with embassy. You'll receive travel updates.",
      });
    } else {
      toast({
        title: "Registration Failed",
        description: "Failed to register with embassy. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isExpanded) {
    return (
      <Card className="border-secondary/30 bg-secondary/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <User className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-secondary font-medium">Profile Settings</p>
                <p className="text-xs text-secondary/80">
                  {profile.languages.length} languages, {profile.followedEmbassies.length} embassies
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="border-secondary text-secondary hover:bg-secondary/20"
            >
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-secondary/30 bg-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Profile & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subscription Plan Card */}
          {subscription && (
            <Card className="gradient-trust border-primary/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      {subscription.tier === 'free' ? (
                        <CreditCard className="w-5 h-5 text-primary" />
                      ) : (
                        <Crown className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold capitalize">
                        {subscription.tier} Plan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {subscription.tier === 'free' 
                          ? 'Upgrade to unlock more features' 
                          : 'Premium plan active'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onUpgradeClick}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    {subscription.tier === 'free' ? 'Upgrade' : 'Change Plan'}
                  </Button>
                </div>
                {subscription.features && subscription.features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {subscription.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {subscription.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{subscription.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nationality" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Nationality
            </Label>
            <Input
              id="nationality"
              value={profile.nationality}
              onChange={(e) => setProfile(prev => ({ ...prev, nationality: e.target.value }))}
              placeholder="e.g., United States"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number (for embassy registration)
            </Label>
            <Input
              id="phone"
              value={profile.phoneNumber}
              onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="+1-234-567-8900"
              type="tel"
            />
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Preferred Languages for News
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AVAILABLE_LANGUAGES.map(lang => (
              <div key={lang.code} className="flex items-center space-x-2">
                <Checkbox
                  id={lang.code}
                  checked={profile.languages.includes(lang.code)}
                  onCheckedChange={() => handleLanguageToggle(lang.code)}
                />
                <Label htmlFor={lang.code} className="text-sm">
                  {lang.name}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {profile.languages.map(langCode => {
              const lang = AVAILABLE_LANGUAGES.find(l => l.code === langCode);
              return lang ? (
                <Badge key={langCode} variant="secondary" className="text-xs">
                  {lang.name}
                </Badge>
              ) : null;
            })}
          </div>
        </div>

        {/* Embassy Preferences */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Follow Embassy Travel Advisories
          </Label>
          <div className="space-y-3">
            {embassies.map(embassy => (
              <div key={embassy.id} className="p-3 bg-card rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={embassy.id}
                      checked={profile.followedEmbassies.includes(embassy.id)}
                      onCheckedChange={() => handleEmbassyToggle(embassy.id)}
                    />
                    <div>
                      <Label htmlFor={embassy.id} className="font-medium">
                        {embassy.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">{embassy.country}</p>
                    </div>
                  </div>
                  {profile.followedEmbassies.includes(embassy.id) && embassy.registrationUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRegisterWithEmbassy(embassy.id)}
                      className="text-xs"
                    >
                      Register
                    </Button>
                  )}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Emergency: {embassy.emergencyContact}</p>
                  <p>Languages: {embassy.languages.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={saveProfile} className="flex-1">
            Save Profile
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsExpanded(false)}
            className="flex-1"
          >
            Collapse
          </Button>
        </div>
      </CardContent>
    </Card>
  </>
  );
};

export default UserProfile;
