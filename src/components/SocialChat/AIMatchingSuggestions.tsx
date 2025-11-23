import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MapPin, Briefcase, MessageCircle } from 'lucide-react';
import { useSocialChat } from '@/hooks/useSocialChat';
import { AIMatchSuggestion } from '@/types/socialChat';

export const AIMatchingSuggestions = () => {
  const { getAIMatches, profiles } = useSocialChat();
  const [matches, setMatches] = useState<AIMatchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    // Using first profile as demo current user
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI-Powered Matches</CardTitle>
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
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <CardTitle className="text-lg">
                      {match.profile.basicInfo.name}
                    </CardTitle>
                    <Badge variant="default" className="bg-green-500">
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
              {/* Location */}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {match.profile.mobility.currentLocation.city},{' '}
                  {match.profile.mobility.currentLocation.country}
                </span>
              </div>

              {/* Professional */}
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>
                  {match.profile.professional.industry} • {match.profile.professional.company}
                </span>
              </div>

              {/* Match Reasons */}
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

              {/* Common Interests */}
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

              {/* Conversation Starters */}
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

              {/* Action Button */}
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
