import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SPORT_WEATHER_PROFILES, evaluateSportWeather, SportWeatherProfile } from '@/data/sportWeatherData';

interface SportWeatherCardsProps {
  userSports: string[];
  weather: {
    temp: number;
    windSpeed: number;
    humidity: number;
    uvIndex: number;
    condition: string;
  };
  forecast?: Array<{ precipitation: number; windSpeed: number }>;
}

const ratingColors: Record<string, string> = {
  perfect: 'bg-primary/10 text-primary border-primary/30',
  good: 'bg-secondary/10 text-secondary-foreground border-secondary/30',
  fair: 'bg-accent/20 text-accent-foreground border-accent/30',
  poor: 'bg-destructive/10 text-destructive border-destructive/20',
  unsafe: 'bg-destructive/15 text-destructive border-destructive/30',
};

const ratingLabels: Record<string, string> = {
  perfect: '✅ Perfect',
  good: '👍 Good',
  fair: '⚠️ Fair',
  poor: '❌ Poor',
  unsafe: '🚫 Unsafe',
};

const SportWeatherCards: React.FC<SportWeatherCardsProps> = ({ userSports, weather, forecast }) => {
  const matchedProfiles = SPORT_WEATHER_PROFILES.filter(sp =>
    userSports.some(us => us.toLowerCase() === sp.sport.toLowerCase())
  );

  if (matchedProfiles.length === 0) return null;

  const avgPrecipitation = forecast && forecast.length > 0
    ? Math.round(forecast.reduce((s, f) => s + f.precipitation, 0) / forecast.length)
    : 30;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        🏅 Your Sports Weather
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {matchedProfiles.map(sport => {
          const result = evaluateSportWeather(sport, {
            ...weather,
            precipitation: avgPrecipitation,
            visibility: 10,
          });

          return (
            <Card key={sport.sport} className={`border ${ratingColors[result.rating]} transition-all hover:shadow-medium`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{sport.emoji}</span>
                    <span className="font-semibold text-sm">{sport.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs font-bold">
                    {ratingLabels[result.rating]}
                  </Badge>
                </div>

                {/* Score bar */}
                <div className="w-full h-2 rounded-full bg-muted mb-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${result.score}%`,
                      background: result.score >= 70
                        ? 'hsl(var(--primary))'
                        : result.score >= 40
                          ? 'hsl(var(--warning, 38 92% 50%))'
                          : 'hsl(var(--destructive))',
                    }}
                  />
                </div>

                <div className="space-y-1">
                  {result.reasons.slice(0, 2).map((reason, i) => (
                    <p key={i} className="text-xs text-muted-foreground">{reason}</p>
                  ))}
                </div>

                {/* Best time */}
                <div className="mt-2 flex gap-1 flex-wrap">
                  {sport.bestTimeOfDay.map(t => (
                    <Badge key={t} variant="secondary" className="text-xs capitalize">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SportWeatherCards;
