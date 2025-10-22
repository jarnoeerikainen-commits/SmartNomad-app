import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Star, Target, Zap, Globe } from 'lucide-react';
import { Country } from '@/types/country';

interface DashboardGamificationProps {
  countries: Country[];
}

export const DashboardGamification: React.FC<DashboardGamificationProps> = ({ countries }) => {
  const totalDays = countries.reduce((sum, c) => sum + (c.daysSpent || 0), 0);
  const totalCountries = countries.length;
  
  // Calculate level based on activity
  const level = Math.min(20, Math.floor(totalDays / 10) + Math.floor(totalCountries / 2));
  const nextLevelDays = (level + 1) * 10;
  const progressToNextLevel = Math.min(100, (totalDays / nextLevelDays) * 100);

  // Achievements logic
  const achievements = [
    {
      id: 'first_country',
      name: 'First Steps',
      description: 'Added your first country',
      icon: Globe,
      unlocked: totalCountries >= 1,
      color: 'text-blue-500'
    },
    {
      id: 'tax_master',
      name: 'Tax Master',
      description: 'Tracked 90+ days in a country',
      icon: Trophy,
      unlocked: countries.some(c => (c.daysSpent || 0) >= 90),
      color: 'text-yellow-500'
    },
    {
      id: 'globe_trotter',
      name: 'Globe Trotter',
      description: 'Visited 5+ countries',
      icon: Star,
      unlocked: totalCountries >= 5,
      color: 'text-purple-500'
    },
    {
      id: 'nomad_pro',
      name: 'Nomad Pro',
      description: 'Tracked 180+ days',
      icon: Award,
      unlocked: totalDays >= 180,
      color: 'text-green-500'
    },
    {
      id: 'streak_master',
      name: 'Consistent Tracker',
      description: '7-day tracking streak',
      icon: Zap,
      unlocked: false, // Would need streak tracking
      color: 'text-orange-500'
    },
    {
      id: 'world_explorer',
      name: 'World Explorer',
      description: 'Visited 10+ countries',
      icon: Target,
      unlocked: totalCountries >= 10,
      color: 'text-pink-500'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  return (
    <Card className="shadow-medium hover:shadow-large transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Your Nomad Journey
          </CardTitle>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            Level {level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level {level + 1}</span>
            <span className="font-semibold text-primary">{Math.round(progressToNextLevel)}%</span>
          </div>
          <Progress value={progressToNextLevel} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {nextLevelDays - totalDays} more days to reach Level {level + 1}
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Recent Achievements</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {unlockedAchievements.slice(0, 3).map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="group relative p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="p-2 rounded-full bg-primary/20">
                      <Icon className={`h-6 w-6 ${achievement.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Achievement */}
        {nextAchievement && (
          <div className="p-4 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <nextAchievement.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Almost there!</p>
                <p className="text-xs text-muted-foreground">{nextAchievement.description}</p>
              </div>
              <Badge variant="outline" className="text-xs">Locked</Badge>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{unlockedAchievements.length}</p>
            <p className="text-xs text-muted-foreground">Achievements</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary">{totalCountries}</p>
            <p className="text-xs text-muted-foreground">Countries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{totalDays}</p>
            <p className="text-xs text-muted-foreground">Days Tracked</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
