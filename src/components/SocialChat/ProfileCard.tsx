import { SocialProfile } from '@/types/socialChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Shield,
  Globe
} from 'lucide-react';
import { format } from 'date-fns';

interface ProfileCardProps {
  profile: SocialProfile;
  onStartChat: (profileId: string) => void;
}

export const ProfileCard = ({ profile, onStartChat }: ProfileCardProps) => {
  const statusColor = {
    online: 'bg-success',
    away: 'bg-warning',
    offline: 'bg-muted-foreground'
  }[profile.status];

  const travelerTypeLabel = {
    digital_nomad: 'Digital Nomad',
    business_traveler: 'Business Traveler',
    student: 'Student',
    expat: 'Expat',
    aviation: 'Aviation',
    tourist: 'Tourist',
    conference_attendee: 'Conference Attendee',
    trade_show_visitor: 'Trade Show Visitor'
  }[profile.travelerType];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="relative">
            <img
              src={profile.basicInfo.avatar}
              alt={profile.basicInfo.name}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.basicInfo.name)}&background=random&size=150`;
              }}
            />
            <div className={`absolute bottom-0 right-0 w-4 h-4 ${statusColor} rounded-full border-2 border-background`} />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center gap-2">
              {profile.basicInfo.name}
              {profile.verification.level === 'premium' && (
                <Shield className="h-4 w-4 text-primary" />
              )}
            </CardTitle>
            <CardDescription className="text-sm">
              {profile.basicInfo.tagline}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Traveler Type & Trust Score */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{travelerTypeLabel}</Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>{profile.verification.trustScore}%</span>
          </div>
        </div>

        {/* Current Location */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>
            {profile.mobility.currentLocation.city}, {profile.mobility.currentLocation.country}
          </span>
        </div>

        {/* Professional Info */}
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">
            {profile.professional.industry} • {profile.professional.company}
          </span>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span>{profile.basicInfo.languages.join(', ')}</span>
        </div>

        {/* Next Destination */}
        {profile.mobility.nextDestinations.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Next: {profile.mobility.nextDestinations[0].city} on{' '}
              {format(new Date(profile.mobility.nextDestinations[0].arrivalDate), 'MMM d')}
            </span>
          </div>
        )}

        {/* Interests */}
        <div className="flex flex-wrap gap-1">
          {profile.professional.interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="outline" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>

        {/* Verification Badges */}
        <div className="flex flex-wrap gap-1">
          {profile.verification.badges.slice(0, 2).map((badge) => (
            <Badge key={badge} variant="secondary" className="text-xs">
              {badge}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <Button
          className="w-full"
          onClick={() => onStartChat(profile.id)}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Start Chat
        </Button>
      </CardContent>
    </Card>
  );
};
