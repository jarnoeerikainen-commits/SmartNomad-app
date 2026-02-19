import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MapPin, Briefcase, MessageCircle, Bike, Coffee, Utensils, Theater, Trophy, Calendar } from 'lucide-react';
import { useSocialChat } from '@/hooks/useSocialChat';
import { AIMatchSuggestion } from '@/types/socialChat';

interface SmartScenario {
  icon: React.ReactNode;
  title: string;
  description: string;
  matchName: string;
  matchAvatar: string;
  matchCity: string;
  activity: string;
  when: string;
  tag: string;
}

const SMART_SCENARIOS: SmartScenario[] = [
  {
    icon: <Bike className="h-5 w-5 text-primary" />,
    title: '🚴 Saturday Ride Buddy Found!',
    description: 'You planned biking this Saturday — John is also looking for a cycling partner near you!',
    matchName: 'John Harris',
    matchAvatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    matchCity: 'Your area',
    activity: 'Mountain biking, 25km trail',
    when: 'Saturday, Feb 21 • 9:00 AM',
    tag: 'Activity Match'
  },
  {
    icon: <Coffee className="h-5 w-5 text-primary" />,
    title: '☕ Your Match is in Milano Too!',
    description: 'Lena Schmidt will be in Milano the same dates as you. Perfect for a coffee or dinner meetup!',
    matchName: 'Lena Schmidt',
    matchAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    matchCity: 'Milano, Italy',
    activity: 'Coffee at Marchesi 1824 or dinner at Langosteria',
    when: 'March 22–26 • You both overlap',
    tag: 'Travel Overlap'
  },
  {
    icon: <Theater className="h-5 w-5 text-primary" />,
    title: '🎭 La Scala Has Your Show!',
    description: 'Based on your love of theater — "La Traviata" at Teatro alla Scala, Milano. Limited tickets available!',
    matchName: 'Sophie Laurent',
    matchAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    matchCity: 'Milano, Italy',
    activity: 'La Traviata — Teatro alla Scala',
    when: 'March 23 • 8:00 PM',
    tag: 'Event Discovery'
  },
  {
    icon: <Trophy className="h-5 w-5 text-primary" />,
    title: '⚽ AC Milan vs Inter — Derby!',
    description: 'You mentioned sports — the Milan Derby is happening while you\'re in town. 3 other nomads are going!',
    matchName: 'Carlos Mendez',
    matchAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    matchCity: 'Milano, Italy',
    activity: 'Serie A: AC Milan vs Inter at San Siro',
    when: 'March 24 • 8:45 PM',
    tag: 'Sports Event'
  },
  {
    icon: <Utensils className="h-5 w-5 text-primary" />,
    title: '🍽️ Michelin Star Experience',
    description: 'AI found a 2-Michelin star restaurant matching your fine dining interest — reservation for 2 available!',
    matchName: 'James Rodriguez',
    matchAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    matchCity: 'Milano, Italy',
    activity: 'Enrico Bartolini al Mudec ⭐⭐ Michelin',
    when: 'March 25 • 7:30 PM',
    tag: 'Fine Dining'
  }
];

export const AIMatchingSuggestions = () => {
  const { getAIMatches, profiles } = useSocialChat();
  const [matches, setMatches] = useState<AIMatchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    const currentUser = profiles[0];
    const suggestions = await getAIMatches({
      travelerType: currentUser.travelerType,
      professional: currentUser.professional,
      mobility: currentUser.mobility,
      socialPreferences: currentUser.socialPreferences
    });
    setMatches(suggestions);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-muted-foreground animate-pulse mb-4" />
          <p className="text-muted-foreground">Finding your perfect matches...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Smart Scenarios — Contextual AI Suggestions */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Smart Suggestions — Just For You</CardTitle>
          </div>
          <CardDescription>
            AI found friends, activities & events based on your plans and interests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {SMART_SCENARIOS.map((scenario, idx) => (
            <div key={idx} className="flex gap-3 p-4 rounded-lg border bg-background hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 mt-1">{scenario.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-semibold text-sm">{scenario.title}</h4>
                  <Badge variant="secondary" className="text-xs">{scenario.tag}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{scenario.description}</p>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={scenario.matchAvatar}
                    alt={scenario.matchName}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(scenario.matchName)}&background=random&size=150`;
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">{scenario.matchName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {scenario.matchCity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {scenario.when}
                  </span>
                </div>
                <p className="text-xs font-medium text-primary mt-1">{scenario.activity}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="default" className="text-xs h-7">
                    <MessageCircle className="h-3 w-3 mr-1" /> Connect
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Classic AI Matches */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI-Powered Profile Matches</CardTitle>
          </div>
          <CardDescription>
            {matches.length} intelligent connection suggestions based on your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={loadMatches} variant="outline" className="mb-4">
            <Sparkles className="mr-2 h-4 w-4" />
            Refresh Matches
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {matches.map((match) => (
          <Card key={match.profile.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <img
                  src={match.profile.basicInfo.avatar}
                  alt={match.profile.basicInfo.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.profile.basicInfo.name)}&background=random&size=150`;
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <CardTitle className="text-lg">
                      {match.profile.basicInfo.name}
                    </CardTitle>
                    <Badge variant="default" className="bg-primary">
                      {match.matchScore}% Match
                    </Badge>
                  </div>
                  <CardDescription>
                    {match.profile.basicInfo.tagline}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {match.profile.mobility.currentLocation.city},{' '}
                  {match.profile.mobility.currentLocation.country}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>
                  {match.profile.professional.industry} • {match.profile.professional.company}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Why you'll connect:</h4>
                <div className="space-y-1">
                  {match.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <Sparkles className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {match.commonInterests.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Common interests:</h4>
                  <div className="flex flex-wrap gap-1">
                    {match.commonInterests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-2">Conversation starters:</h4>
                <div className="space-y-1">
                  {match.conversationStarters.slice(0, 2).map((starter, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground italic">
                      "{starter}"
                    </p>
                  ))}
                </div>
              </div>

              <Button className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Conversation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
