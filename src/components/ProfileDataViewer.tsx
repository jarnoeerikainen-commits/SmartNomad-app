import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, Mail, Phone, Globe, MapPin, Briefcase, 
  Heart, Languages, Shield, Gift, Edit
} from 'lucide-react';

interface ProfileDataViewerProps {
  onEdit: () => void;
}

const ProfileDataViewer: React.FC<ProfileDataViewerProps> = ({ onEdit }) => {
  const [profileData, setProfileData] = React.useState<any>(null);

  React.useEffect(() => {
    const savedProfile = localStorage.getItem('enhancedProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  }, []);

  if (!profileData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Profile Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete your profile to get 3 months of Premium free and unlock personalized features
          </p>
          <Button onClick={onEdit} className="gradient-primary">
            <Gift className="mr-2 h-4 w-4" />
            Complete Profile & Get Premium
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { 
    firstName, 
    email, 
    phone, 
    nationality, 
    currentLocation, 
    occupation,
    travelFrequency,
    travelPurpose,
    preferredLanguages,
    consents,
    completedAt
  } = profileData;

  const languageNames: Record<string, string> = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-trust border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Last updated: {new Date(completedAt).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">First Name</p>
              <p className="font-medium">{firstName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email
              </p>
              <p className="font-medium">{email}</p>
            </div>
            {phone && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Phone
                </p>
                <p className="font-medium">{phone}</p>
              </div>
            )}
            {nationality && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Nationality
                </p>
                <p className="font-medium">{nationality}</p>
              </div>
            )}
            {currentLocation && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Current Location
                </p>
                <p className="font-medium">{currentLocation}</p>
              </div>
            )}
            {occupation && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> Occupation
                </p>
                <p className="font-medium">{occupation}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Travel Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Travel Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {travelFrequency && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Travel Frequency</p>
              <Badge variant="secondary">{travelFrequency}</Badge>
            </div>
          )}
          
          {travelPurpose && travelPurpose.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Travel Purposes</p>
              <div className="flex flex-wrap gap-2">
                {travelPurpose.map((purpose: string) => (
                  <Badge key={purpose} variant="outline">{purpose}</Badge>
                ))}
              </div>
            </div>
          )}

          {preferredLanguages && preferredLanguages.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <Languages className="h-4 w-4" /> Preferred Languages
              </p>
              <div className="flex flex-wrap gap-2">
                {preferredLanguages.map((lang: string) => (
                  <Badge key={lang} variant="secondary">
                    {languageNames[lang] || lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm">Data Processing Consent</span>
            <Badge variant={consents?.dataProcessing ? "default" : "secondary"}>
              {consents?.dataProcessing ? "Granted" : "Not Granted"}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm">Marketing Communications</span>
            <Badge variant={consents?.marketing ? "default" : "secondary"}>
              {consents?.marketing ? "Opted In" : "Opted Out"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Value Reminder */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Gift className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Thank you for sharing your information!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your data helps us provide personalized travel alerts, relevant visa guidance, 
                and local insights in your preferred languages.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDataViewer;
