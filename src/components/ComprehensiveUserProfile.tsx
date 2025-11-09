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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  User, Globe, Briefcase, Heart, Plane, Utensils, Home, 
  Shield, Sparkles, CheckCircle2, AlertCircle, Crown, Lock,
  TrendingUp, Target, Zap, Gift
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ComprehensiveUserProfile, ProfileProgress } from '@/types/userProfile';
import { Subscription } from '@/types/subscription';

interface ComprehensiveUserProfileProps {
  subscription?: Subscription;
  onUpgradeClick?: () => void;
}

const ComprehensiveUserProfileComponent: React.FC<ComprehensiveUserProfileProps> = ({ 
  subscription, 
  onUpgradeClick 
}) => {
  const [profile, setProfile] = useState<Partial<ComprehensiveUserProfile>>({
    completionLevel: 'basic'
  });
  const [activeTab, setActiveTab] = useState('core');
  const [progress, setProgress] = useState<ProfileProgress>({
    core: 0,
    lifestyle: 0,
    travel: 0,
    personal: 0,
    overall: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load saved profile
    const savedProfile = localStorage.getItem('comprehensiveUserProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    calculateProgress();
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [profile]);

  const calculateProgress = () => {
    // Calculate completion percentage for each tier
    const coreFields = profile.core ? Object.keys(profile.core).length : 0;
    const coreProgress = (coreFields / 2) * 100; // 2 main sections in core

    const lifestyleFields = profile.lifestyle ? Object.keys(profile.lifestyle).length : 0;
    const lifestyleProgress = (lifestyleFields / 2) * 100;

    const travelFields = profile.travel ? Object.keys(profile.travel).length : 0;
    const travelProgress = (travelFields / 2) * 100;

    const personalFields = profile.personal ? Object.keys(profile.personal).length : 0;
    const personalProgress = (personalFields / 3) * 100;

    const overall = (coreProgress + lifestyleProgress + travelProgress + personalProgress) / 4;

    setProgress({
      core: Math.min(coreProgress, 100),
      lifestyle: Math.min(lifestyleProgress, 100),
      travel: Math.min(travelProgress, 100),
      personal: Math.min(personalProgress, 100),
      overall: Math.min(overall, 100)
    });
  };

  const saveProfile = () => {
    const updatedProfile = {
      ...profile,
      updatedAt: new Date()
    };
    localStorage.setItem('comprehensiveUserProfile', JSON.stringify(updatedProfile));
    toast({
      title: "Profile Saved",
      description: "Your profile has been updated successfully.",
    });
  };

  const updateCoreProfile = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      core: {
        ...prev.core,
        [field]: value
      } as any
    }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Completion Overview */}
      <Card className="gradient-trust border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-lg">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Your Comprehensive Profile</CardTitle>
                <CardDescription>
                  {progress.overall < 25 && "Just getting started - complete your profile to unlock AI recommendations"}
                  {progress.overall >= 25 && progress.overall < 50 && "Good progress - add more details for better personalization"}
                  {progress.overall >= 50 && progress.overall < 75 && "Looking great - you're getting the most out of SuperNomad"}
                  {progress.overall >= 75 && "Excellent! Your profile is highly optimized"}
                </CardDescription>
              </div>
            </div>
            {subscription && subscription.tier !== 'free' && (
              <Badge variant="default" className="gap-1">
                <Crown className="w-3 h-3" />
                {subscription.tier.toUpperCase()}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overall Completion</span>
              <span className="text-muted-foreground">{Math.round(progress.overall)}%</span>
            </div>
            <Progress value={progress.overall} className="h-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-background/50 rounded-lg border">
              <div className="text-xs text-muted-foreground mb-1">Core</div>
              <div className="text-lg font-bold">{Math.round(progress.core)}%</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border">
              <div className="text-xs text-muted-foreground mb-1">Lifestyle</div>
              <div className="text-lg font-bold">{Math.round(progress.lifestyle)}%</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border">
              <div className="text-xs text-muted-foreground mb-1">Travel</div>
              <div className="text-lg font-bold">{Math.round(progress.travel)}%</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border">
              <div className="text-xs text-muted-foreground mb-1">Personal</div>
              <div className="text-lg font-bold">{Math.round(progress.personal)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Value Proposition */}
      <Alert className="bg-primary/5 border-primary/20">
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Why share this data?</AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 mt-0.5 text-primary" />
              <span><strong>Personalized Tax Savings:</strong> Family deductions, remote work optimization</span>
            </div>
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 mt-0.5 text-primary" />
              <span><strong>Smart Travel Planning:</strong> Destinations matching your interests and accessibility needs</span>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 mt-0.5 text-primary" />
              <span><strong>Time-Saving Automation:</strong> Visa reminders, tax prep, insurance optimization</span>
            </div>
            <div className="flex items-start gap-2">
              <Gift className="w-4 h-4 mt-0.5 text-primary" />
              <span><strong>Exclusive Deals:</strong> Partner discounts based on your preferences</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Profile Sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="core" className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="hidden sm:inline">Core</span>
          </TabsTrigger>
          <TabsTrigger value="lifestyle" className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span className="hidden sm:inline">Lifestyle</span>
          </TabsTrigger>
          <TabsTrigger value="travel" className="flex items-center gap-1">
            <Plane className="w-3 h-3" />
            <span className="hidden sm:inline">Travel</span>
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-1">
            <Home className="w-3 h-3" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="ai-consent" className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>

        {/* Core Profile Tab */}
        <TabsContent value="core" className="space-y-4 mt-6">
          <CoreProfileSection profile={profile} updateProfile={updateCoreProfile} />
        </TabsContent>

        {/* Lifestyle Tab */}
        <TabsContent value="lifestyle" className="space-y-4 mt-6">
          <LifestyleSection profile={profile} setProfile={setProfile} />
        </TabsContent>

        {/* Travel Tab */}
        <TabsContent value="travel" className="space-y-4 mt-6">
          <TravelSection profile={profile} setProfile={setProfile} />
        </TabsContent>

        {/* Personal Tab */}
        <TabsContent value="personal" className="space-y-4 mt-6">
          <PersonalSection profile={profile} setProfile={setProfile} />
        </TabsContent>

        {/* AI Consent Tab */}
        <TabsContent value="ai-consent" className="space-y-4 mt-6">
          <AIConsentSection profile={profile} setProfile={setProfile} />
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={saveProfile} size="lg" className="flex-1">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Save Profile
        </Button>
        {subscription?.tier === 'free' && onUpgradeClick && (
          <Button onClick={onUpgradeClick} variant="outline" size="lg">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade for AI Features
          </Button>
        )}
      </div>
    </div>
  );
};

// Core Profile Section Component
const CoreProfileSection: React.FC<any> = ({ profile, updateProfile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Core Identity & Legal Information
        </CardTitle>
        <CardDescription>
          Required for tax residency tracking and visa management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <User className="w-4 h-4" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={profile.core?.personal?.firstName || ''}
                onChange={(e) => updateProfile('personal', { 
                  ...profile.core?.personal, 
                  firstName: e.target.value 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={profile.core?.personal?.lastName || ''}
                onChange={(e) => updateProfile('personal', { 
                  ...profile.core?.personal, 
                  lastName: e.target.value 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={profile.core?.personal?.email || ''}
                onChange={(e) => updateProfile('personal', { 
                  ...profile.core?.personal, 
                  email: e.target.value 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={profile.core?.personal?.phone || ''}
                onChange={(e) => updateProfile('personal', { 
                  ...profile.core?.personal, 
                  phone: e.target.value 
                })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Legal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Legal & Compliance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxResidency">Tax Residency Country *</Label>
              <Input
                id="taxResidency"
                placeholder="United States"
                value={profile.core?.legal?.taxResidencyCountry || ''}
                onChange={(e) => updateProfile('legal', { 
                  ...profile.core?.legal, 
                  taxResidencyCountry: e.target.value 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentResidency">Current Residency *</Label>
              <Input
                id="currentResidency"
                placeholder="Spain"
                value={profile.core?.legal?.currentResidencyCountry || ''}
                onChange={(e) => updateProfile('legal', { 
                  ...profile.core?.legal, 
                  currentResidencyCountry: e.target.value 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visaStatus">Visa Status *</Label>
              <Select
                value={profile.core?.legal?.visaStatus || 'tourist'}
                onValueChange={(value) => updateProfile('legal', { 
                  ...profile.core?.legal, 
                  visaStatus: value 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="citizen">Citizen</SelectItem>
                  <SelectItem value="resident">Resident</SelectItem>
                  <SelectItem value="visa">Work/Study Visa</SelectItem>
                  <SelectItem value="tourist">Tourist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Lifestyle Section Component  
const LifestyleSection: React.FC<any> = ({ profile, setProfile }) => {
  return (
    <div className="space-y-4">
      {/* Family Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Family & Relationships
          </CardTitle>
          <CardDescription>
            Helps us recommend family-friendly destinations and accommodations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Marital Status</Label>
            <Select
              value={profile.lifestyle?.family?.maritalStatus || 'single'}
              onValueChange={(value) => setProfile((prev: any) => ({
                ...prev,
                lifestyle: {
                  ...prev.lifestyle,
                  family: {
                    ...prev.lifestyle?.family,
                    maritalStatus: value
                  }
                }
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="partnered">Partnered</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="children">Number of Children</Label>
              <Input
                id="children"
                type="number"
                min="0"
                placeholder="0"
                value={profile.lifestyle?.family?.dependents?.children || 0}
                onChange={(e) => setProfile((prev: any) => ({
                  ...prev,
                  lifestyle: {
                    ...prev.lifestyle,
                    family: {
                      ...prev.lifestyle?.family,
                      dependents: {
                        ...prev.lifestyle?.family?.dependents,
                        children: parseInt(e.target.value) || 0
                      }
                    }
                  }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pets">Have Pets?</Label>
              <Switch
                id="pets"
                checked={profile.lifestyle?.family?.pets?.hasPets || false}
                onCheckedChange={(checked) => setProfile((prev: any) => ({
                  ...prev,
                  lifestyle: {
                    ...prev.lifestyle,
                    family: {
                      ...prev.lifestyle?.family,
                      pets: {
                        ...prev.lifestyle?.family?.pets,
                        hasPets: checked
                      }
                    }
                  }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Work & Professional Life
          </CardTitle>
          <CardDescription>
            Optimize for remote work requirements and tax deductions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Employment Status</Label>
            <Select
              value={profile.lifestyle?.professional?.employmentStatus || 'employed'}
              onValueChange={(value) => setProfile((prev: any) => ({
                ...prev,
                lifestyle: {
                  ...prev.lifestyle,
                  professional: {
                    ...prev.lifestyle?.professional,
                    employmentStatus: value
                  }
                }
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="self-employed">Self-Employed</SelectItem>
                <SelectItem value="freelancer">Freelancer</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="seeking">Job Seeking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <Label htmlFor="remoteWork" className="font-medium">Remote Worker</Label>
              <p className="text-xs text-muted-foreground">Get co-working and internet recommendations</p>
            </div>
            <Switch
              id="remoteWork"
              checked={profile.lifestyle?.professional?.remoteWork?.isRemoteWorker || false}
              onCheckedChange={(checked) => setProfile((prev: any) => ({
                ...prev,
                lifestyle: {
                  ...prev.lifestyle,
                  professional: {
                    ...prev.lifestyle?.professional,
                    remoteWork: {
                      ...prev.lifestyle?.professional?.remoteWork,
                      isRemoteWorker: checked
                    }
                  }
                }
              }))}
            />
          </div>

          {profile.lifestyle?.professional?.remoteWork?.isRemoteWorker && (
            <div className="space-y-2">
              <Label>Internet Requirements</Label>
              <Select
                value={profile.lifestyle?.professional?.remoteWork?.internetRequirements || 'high-speed'}
                onValueChange={(value) => setProfile((prev: any) => ({
                  ...prev,
                  lifestyle: {
                    ...prev.lifestyle,
                    professional: {
                      ...prev.lifestyle?.professional,
                      remoteWork: {
                        ...prev.lifestyle?.professional?.remoteWork,
                        internetRequirements: value
                      }
                    }
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (Browsing)</SelectItem>
                  <SelectItem value="high-speed">High-Speed (Downloads)</SelectItem>
                  <SelectItem value="video-calls">Video Calls Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Travel Section Component
const TravelSection: React.FC<any> = ({ profile, setProfile }) => {
  const destinationTypes = ['beach', 'mountain', 'city', 'rural', 'adventure'];
  const seasons = ['winter', 'spring', 'summer', 'autumn'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="w-5 h-5" />
          Travel Preferences & Patterns
        </CardTitle>
        <CardDescription>
          Get personalized destination recommendations matching your style
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Destination Types */}
        <div className="space-y-3">
          <Label>Favorite Destination Types</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {destinationTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`dest-${type}`}
                  checked={profile.travel?.preferences?.favoriteDestinations?.types?.includes(type) || false}
                  onCheckedChange={(checked) => {
                    const current = profile.travel?.preferences?.favoriteDestinations?.types || [];
                    const updated = checked
                      ? [...current, type]
                      : current.filter((t: string) => t !== type);
                    setProfile((prev: any) => ({
                      ...prev,
                      travel: {
                        ...prev.travel,
                        preferences: {
                          ...prev.travel?.preferences,
                          favoriteDestinations: {
                            ...prev.travel?.preferences?.favoriteDestinations,
                            types: updated
                          }
                        }
                      }
                    }));
                  }}
                />
                <Label htmlFor={`dest-${type}`} className="capitalize cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Preferred Seasons */}
        <div className="space-y-3">
          <Label>Preferred Travel Seasons</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {seasons.map(season => (
              <div key={season} className="flex items-center space-x-2">
                <Checkbox
                  id={`season-${season}`}
                  checked={profile.travel?.preferences?.timing?.preferredSeasons?.includes(season) || false}
                  onCheckedChange={(checked) => {
                    const current = profile.travel?.preferences?.timing?.preferredSeasons || [];
                    const updated = checked
                      ? [...current, season]
                      : current.filter((s: string) => s !== season);
                    setProfile((prev: any) => ({
                      ...prev,
                      travel: {
                        ...prev.travel,
                        preferences: {
                          ...prev.travel?.preferences,
                          timing: {
                            ...prev.travel?.preferences?.timing,
                            preferredSeasons: updated
                          }
                        }
                      }
                    }));
                  }}
                />
                <Label htmlFor={`season-${season}`} className="capitalize cursor-pointer">
                  {season}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Budget Preferences */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Budget Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Accommodation</Label>
              <Select
                value={profile.travel?.preferences?.budget?.accommodation || 'mid-range'}
                onValueChange={(value) => setProfile((prev: any) => ({
                  ...prev,
                  travel: {
                    ...prev.travel,
                    preferences: {
                      ...prev.travel?.preferences,
                      budget: {
                        ...prev.travel?.preferences?.budget,
                        accommodation: value
                      }
                    }
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="mid-range">Mid-Range</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Transportation</Label>
              <Select
                value={profile.travel?.preferences?.budget?.transportation || 'economy'}
                onValueChange={(value) => setProfile((prev: any) => ({
                  ...prev,
                  travel: {
                    ...prev.travel,
                    preferences: {
                      ...prev.travel?.preferences,
                      budget: {
                        ...prev.travel?.preferences?.budget,
                        transportation: value
                      }
                    }
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Activities</Label>
              <Select
                value={profile.travel?.preferences?.budget?.activities || 'moderate'}
                onValueChange={(value) => setProfile((prev: any) => ({
                  ...prev,
                  travel: {
                    ...prev.travel,
                    preferences: {
                      ...prev.travel?.preferences,
                      budget: {
                        ...prev.travel?.preferences?.budget,
                        activities: value
                      }
                    }
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="extensive">Extensive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Accessibility */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <Label htmlFor="accessibility" className="font-medium">Special Accessibility Needs</Label>
            <p className="text-xs text-muted-foreground">Filter destinations by accessibility requirements</p>
          </div>
          <Switch
            id="accessibility"
            checked={profile.travel?.mobility?.impairments?.hasMobilityIssues || false}
            onCheckedChange={(checked) => setProfile((prev: any) => ({
              ...prev,
              travel: {
                ...prev.travel,
                mobility: {
                  ...prev.travel?.mobility,
                  impairments: {
                    ...prev.travel?.mobility?.impairments,
                    hasMobilityIssues: checked
                  }
                }
              }
            }))}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Personal Section Component
const PersonalSection: React.FC<any> = ({ profile, setProfile }) => {
  const activities = ['hiking', 'swimming', 'reading', 'photography', 'cooking', 'sports', 'gaming', 'yoga', 'cycling', 'tennis'];
  const dietaryPrefs = ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'pescatarian', 'none'];
  const amenities = ['wifi', 'kitchen', 'pool', 'gym', 'workspace', 'parking', 'pet-friendly'];

  return (
    <div className="space-y-4">
      {/* Hobbies & Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Hobbies & Interests
          </CardTitle>
          <CardDescription>
            Find destinations with activities you love
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Favorite Activities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {activities.map(activity => (
                <div key={activity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`activity-${activity}`}
                    checked={profile.personal?.hobbies?.activities?.includes(activity) || false}
                    onCheckedChange={(checked) => {
                      const current = profile.personal?.hobbies?.activities || [];
                      const updated = checked
                        ? [...current, activity]
                        : current.filter((a: string) => a !== activity);
                      setProfile((prev: any) => ({
                        ...prev,
                        personal: {
                          ...prev.personal,
                          hobbies: {
                            ...prev.personal?.hobbies,
                            activities: updated
                          }
                        }
                      }));
                    }}
                  />
                  <Label htmlFor={`activity-${activity}`} className="capitalize cursor-pointer text-sm">
                    {activity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dietary Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Food & Dining Preferences
          </CardTitle>
          <CardDescription>
            Get restaurant recommendations that match your diet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Dietary Preferences</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dietaryPrefs.map(pref => (
                <div key={pref} className="flex items-center space-x-2">
                  <Checkbox
                    id={`diet-${pref}`}
                    checked={profile.personal?.dietary?.preferences?.includes(pref) || false}
                    onCheckedChange={(checked) => {
                      const current = profile.personal?.dietary?.preferences || [];
                      const updated = checked
                        ? [...current, pref]
                        : current.filter((p: string) => p !== pref);
                      setProfile((prev: any) => ({
                        ...prev,
                        personal: {
                          ...prev.personal,
                          dietary: {
                            ...prev.personal?.dietary,
                            preferences: updated
                          }
                        }
                      }));
                    }}
                  />
                  <Label htmlFor={`diet-${pref}`} className="capitalize cursor-pointer text-sm">
                    {pref}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accommodation Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Accommodation Preferences
          </CardTitle>
          <CardDescription>
            Find places with the amenities you need
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Essential Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenities.map(amenity => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={profile.personal?.accommodation?.amenities?.includes(amenity) || false}
                    onCheckedChange={(checked) => {
                      const current = profile.personal?.accommodation?.amenities || [];
                      const updated = checked
                        ? [...current, amenity]
                        : current.filter((a: string) => a !== amenity);
                      setProfile((prev: any) => ({
                        ...prev,
                        personal: {
                          ...prev.personal,
                          accommodation: {
                            ...prev.personal?.accommodation,
                            amenities: updated
                          }
                        }
                      }));
                    }}
                  />
                  <Label htmlFor={`amenity-${amenity}`} className="capitalize cursor-pointer text-sm">
                    {amenity.replace('-', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// AI Consent Section Component
const AIConsentSection: React.FC<any> = ({ profile, setProfile }) => {
  return (
    <div className="space-y-4">
      {/* GDPR Notice */}
      <Alert className="bg-primary/5 border-primary/20">
        <Lock className="h-4 w-4" />
        <AlertTitle>Your Privacy Matters</AlertTitle>
        <AlertDescription>
          We're committed to GDPR compliance. You have full control over your data. All AI features require explicit consent and can be disabled anytime.
        </AlertDescription>
      </Alert>

      {/* AI Service Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI-Powered Services
          </CardTitle>
          <CardDescription>
            Enable AI features for personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="taxOpt" className="font-medium">Tax Optimization</Label>
                <p className="text-xs text-muted-foreground">AI-powered tax savings recommendations</p>
              </div>
              <Switch
                id="taxOpt"
                checked={profile.aiConsent?.permissions?.taxOptimization || false}
                onCheckedChange={(checked) => setProfile((prev: any) => ({
                  ...prev,
                  aiConsent: {
                    ...prev.aiConsent,
                    permissions: {
                      ...prev.aiConsent?.permissions,
                      taxOptimization: checked
                    }
                  }
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="travelPlan" className="font-medium">Travel Planning</Label>
                <p className="text-xs text-muted-foreground">Personalized destination recommendations</p>
              </div>
              <Switch
                id="travelPlan"
                checked={profile.aiConsent?.permissions?.travelPlanning || false}
                onCheckedChange={(checked) => setProfile((prev: any) => ({
                  ...prev,
                  aiConsent: {
                    ...prev.aiConsent,
                    permissions: {
                      ...prev.aiConsent?.permissions,
                      travelPlanning: checked
                    }
                  }
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="accommodation" className="font-medium">Accommodation Matching</Label>
                <p className="text-xs text-muted-foreground">Smart accommodation suggestions</p>
              </div>
              <Switch
                id="accommodation"
                checked={profile.aiConsent?.permissions?.accommodationMatching || false}
                onCheckedChange={(checked) => setProfile((prev: any) => ({
                  ...prev,
                  aiConsent: {
                    ...prev.aiConsent,
                    permissions: {
                      ...prev.aiConsent?.permissions,
                      accommodationMatching: checked
                    }
                  }
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="insurance" className="font-medium">Insurance Recommendations</Label>
                <p className="text-xs text-muted-foreground">Personalized insurance options</p>
              </div>
              <Switch
                id="insurance"
                checked={profile.aiConsent?.permissions?.insuranceRecommendations || false}
                onCheckedChange={(checked) => setProfile((prev: any) => ({
                  ...prev,
                  aiConsent: {
                    ...prev.aiConsent,
                    permissions: {
                      ...prev.aiConsent?.permissions,
                      insuranceRecommendations: checked
                    }
                  }
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="offers" className="font-medium">Promotional Offers</Label>
                <p className="text-xs text-muted-foreground">Receive personalized deals and discounts</p>
              </div>
              <Switch
                id="offers"
                checked={profile.aiConsent?.permissions?.promotionalOffers || false}
                onCheckedChange={(checked) => setProfile((prev: any) => ({
                  ...prev,
                  aiConsent: {
                    ...prev.aiConsent,
                    permissions: {
                      ...prev.aiConsent?.permissions,
                      promotionalOffers: checked
                    }
                  }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sharing Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data Sharing & Analytics
          </CardTitle>
          <CardDescription>
            Control how your data is used for analytics and research
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="analytics" className="font-medium">Anonymized Analytics</Label>
                <p className="text-xs text-muted-foreground">Help us improve the app (no personal data)</p>
              </div>
              <Switch
                id="analytics"
                checked={profile.aiConsent?.dataSharing?.anonymizedAnalytics || false}
                onCheckedChange={(checked) => setProfile((prev: any) => ({
                  ...prev,
                  aiConsent: {
                    ...prev.aiConsent,
                    dataSharing: {
                      ...prev.aiConsent?.dataSharing,
                      anonymizedAnalytics: checked
                    }
                  }
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="partners" className="font-medium">Partner Recommendations</Label>
                <p className="text-xs text-muted-foreground">Share data with trusted partners for better deals</p>
              </div>
              <Switch
                id="partners"
                checked={profile.aiConsent?.dataSharing?.partnerRecommendations || false}
                onCheckedChange={(checked) => setProfile((prev: any) => ({
                  ...prev,
                  aiConsent: {
                    ...prev.aiConsent,
                    dataSharing: {
                      ...prev.aiConsent?.dataSharing,
                      partnerRecommendations: checked
                    }
                  }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Your Data Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Under GDPR, you have the right to:
          </p>
          <ul className="text-sm space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
              <span>Access all your data at any time</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
              <span>Request corrections to inaccurate data</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
              <span>Delete your data and account completely</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
              <span>Export your data in a portable format</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
              <span>Withdraw consent at any time</span>
            </li>
          </ul>
          <Button variant="outline" className="w-full mt-4">
            View Full Privacy Policy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveUserProfileComponent;
