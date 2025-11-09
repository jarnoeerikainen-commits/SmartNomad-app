import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Gift, User, Mail, Phone, Globe, MapPin, Briefcase, 
  Heart, Shield, CheckCircle2, X, Sparkles 
} from 'lucide-react';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number required").max(20).optional().or(z.literal('')),
  nationality: z.string().trim().min(2).max(100).optional().or(z.literal('')),
  currentLocation: z.string().trim().max(100).optional().or(z.literal('')),
  occupation: z.string().trim().max(100).optional().or(z.literal('')),
  travelFrequency: z.string().optional(),
  travelPurpose: z.array(z.string()).optional(),
  preferredLanguages: z.array(z.string()).min(1),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EnhancedProfileFormProps {
  onComplete: (data: ProfileFormData) => void;
  onSkip: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
];

const TRAVEL_PURPOSES = [
  'Business',
  'Tourism',
  'Education',
  'Remote Work',
  'Family Visit',
  'Medical',
];

const EnhancedProfileForm: React.FC<EnhancedProfileFormProps> = ({ onComplete, onSkip }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<ProfileFormData>>({
    firstName: '',
    email: '',
    phone: '',
    nationality: '',
    currentLocation: '',
    occupation: '',
    travelFrequency: '',
    travelPurpose: [],
    preferredLanguages: ['en'],
  });
  const [consents, setConsents] = useState({
    dataProcessing: false,
    marketing: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    try {
      // Validate form data
      const validated = profileSchema.parse(formData);

      if (!consents.dataProcessing) {
        toast({
          title: "Consent Required",
          description: "Please consent to data processing to continue.",
          variant: "destructive",
        });
        return;
      }

      // Save to localStorage
      localStorage.setItem('enhancedProfile', JSON.stringify({
        ...validated,
        consents,
        completedAt: new Date().toISOString(),
      }));

      onComplete(validated);

      toast({
        title: "🎉 Premium Unlocked!",
        description: "You've received 3 months of Premium for free!",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast({
          title: "Validation Error",
          description: "Please check the required fields.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLanguageToggle = (code: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages?.includes(code)
        ? prev.preferredLanguages.filter(l => l !== code)
        : [...(prev.preferredLanguages || []), code],
    }));
  };

  const handlePurposeToggle = (purpose: string) => {
    setFormData(prev => ({
      ...prev,
      travelPurpose: prev.travelPurpose?.includes(purpose)
        ? prev.travelPurpose.filter(p => p !== purpose)
        : [...(prev.travelPurpose || []), purpose],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4">
      <Card className="w-full max-w-2xl my-8 shadow-large animate-scale-in">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="absolute right-4 top-4 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Get 3 Months Premium Free!</CardTitle>
              <CardDescription className="text-base">
                Share your preferences for a personalized experience
              </CardDescription>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Why share your information?</p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    Personalized travel alerts for your destinations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    Relevant visa & tax guidance for your nationality
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    Local insights in your preferred languages
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    Priority support and exclusive travel resources
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Essential Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Your first name"
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Travel Profile */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Travel Profile <Badge variant="secondary" className="ml-2">Optional</Badge>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationality" className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  Nationality
                </Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                  placeholder="e.g., United States"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentLocation">Current Location</Label>
                <Input
                  id="currentLocation"
                  value={formData.currentLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentLocation: e.target.value }))}
                  placeholder="e.g., Bangkok, Thailand"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="flex items-center gap-2">
                  <Briefcase className="h-3 w-3" />
                  Occupation
                </Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  placeholder="e.g., Software Engineer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>How often do you travel?</Label>
              <div className="flex flex-wrap gap-2">
                {['Rarely', 'Few times a year', 'Monthly', 'Weekly'].map(freq => (
                  <Button
                    key={freq}
                    type="button"
                    variant={formData.travelFrequency === freq ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, travelFrequency: freq }))}
                  >
                    {freq}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Heart className="h-3 w-3" />
                Travel Purpose (select all that apply)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TRAVEL_PURPOSES.map(purpose => (
                  <div key={purpose} className="flex items-center space-x-2">
                    <Checkbox
                      id={purpose}
                      checked={formData.travelPurpose?.includes(purpose)}
                      onCheckedChange={() => handlePurposeToggle(purpose)}
                    />
                    <Label htmlFor={purpose} className="text-sm cursor-pointer">
                      {purpose}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <Label>
              Preferred Languages <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {LANGUAGES.map(lang => (
                <div key={lang.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={lang.code}
                    checked={formData.preferredLanguages?.includes(lang.code)}
                    onCheckedChange={() => handleLanguageToggle(lang.code)}
                  />
                  <Label htmlFor={lang.code} className="text-sm cursor-pointer">
                    {lang.name}
                  </Label>
                </div>
              ))}
            </div>
            {errors.preferredLanguages && (
              <p className="text-sm text-destructive">{errors.preferredLanguages}</p>
            )}
          </div>

          {/* GDPR Consents */}
          <div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy & Consent
            </h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="dataProcessing"
                  checked={consents.dataProcessing}
                  onCheckedChange={(checked) => 
                    setConsents(prev => ({ ...prev, dataProcessing: checked as boolean }))
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="dataProcessing" className="text-sm cursor-pointer">
                    I consent to SuperNomad processing my data to provide personalized travel services
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your data is encrypted and never shared with third parties. You can delete it anytime.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketing"
                  checked={consents.marketing}
                  onCheckedChange={(checked) => 
                    setConsents(prev => ({ ...prev, marketing: checked as boolean }))
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="marketing" className="text-sm cursor-pointer">
                    I'd like to receive helpful travel tips and product updates (optional)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1"
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 gradient-primary"
            >
              <Gift className="mr-2 h-4 w-4" />
              Get 3 Months Premium Free
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            This form is completely voluntary. You can update or delete your information anytime in Settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedProfileForm;