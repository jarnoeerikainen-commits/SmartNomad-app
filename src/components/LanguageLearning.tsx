import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Globe, 
  Target, 
  Trophy, 
  TrendingUp, 
  Star,
  Zap,
  Users,
  Video,
  Brain,
  MessageCircle,
  Check,
  ExternalLink,
  Flame,
  Award,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Play,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LocationData } from '@/types/country';

interface LanguageLearningProps {
  currentLocation: LocationData | null;
}

interface LanguagePlatform {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  users: string;
  languages: number;
  price: string;
  priceDetails: string;
  rating: number;
  features: string[];
  bestFor: string[];
  strengths: string[];
  integrationLevel: 'high' | 'medium' | 'low';
  affiliateLink: string;
  color: string;
}

const LanguageLearning: React.FC<LanguageLearningProps> = ({ currentLocation }) => {
  const { t } = useLanguage();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const platforms: LanguagePlatform[] = [
    {
      id: 'duolingo',
      name: 'Duolingo',
      logo: '🦉',
      tagline: 'Learn a language for free. Forever.',
      users: '500M+ downloads',
      languages: 100,
      price: 'Free',
      priceDetails: 'or $12.99/mo for Super',
      rating: 4.7,
      features: [
        'Gamified bite-sized lessons',
        'Daily streak tracking',
        'Leaderboards & competitions',
        'Speech recognition',
        'Personalized learning path',
        'Scientific approach'
      ],
      bestFor: ['Beginners', 'Casual learners', 'Gamification lovers', 'Budget-conscious'],
      strengths: ['World\'s best gamification', 'Highly addictive', 'Strong brand', '100+ languages'],
      integrationLevel: 'medium',
      affiliateLink: 'https://www.duolingo.com',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'babbel',
      name: 'Babbel',
      logo: '🎓',
      tagline: 'Language learning for real life',
      users: '10M+ subscribers',
      languages: 14,
      price: '$13.95/mo',
      priceDetails: 'or $83.40/year',
      rating: 4.6,
      features: [
        'Conversational focus',
        'Real-life situations',
        'Speech recognition',
        'Cultural context',
        'Professional & travel focus',
        '15-minute daily lessons'
      ],
      bestFor: ['Professionals', 'Travelers', 'Serious learners', 'Time-constrained'],
      strengths: ['Practical skills', '73% retention rate', 'Proven efficacy', 'Travel-ready'],
      integrationLevel: 'high',
      affiliateLink: 'https://www.babbel.com',
      color: 'from-red-500 to-rose-600'
    },
    {
      id: 'memrise',
      name: 'Memrise',
      logo: '🎬',
      tagline: 'Learn with locals',
      users: '50M+ users',
      languages: 200,
      price: '$8.99/mo',
      priceDetails: 'or $59.99/year',
      rating: 4.5,
      features: [
        'Native speaker videos',
        'Spaced repetition',
        'User-generated content',
        'Real-world language',
        'Community-driven',
        'Immersive learning'
      ],
      bestFor: ['Visual learners', 'Culture enthusiasts', 'Advanced learners', 'Community lovers'],
      strengths: ['Authentic content', 'Native speakers', 'Video-based', '200+ languages'],
      integrationLevel: 'high',
      affiliateLink: 'https://www.memrise.com',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  const destinationLanguages = [
    {
      country: 'Spain',
      language: 'Spanish',
      essential: ['Hola', 'Gracias', '¿Cuánto cuesta?', 'La cuenta, por favor'],
      difficulty: 'Easy',
      timeToBasic: '3 months',
      recommendedPlatform: 'babbel',
      flag: '🇪🇸'
    },
    {
      country: 'Japan',
      language: 'Japanese',
      essential: ['こんにちは (Konnichiwa)', 'ありがとう (Arigatou)', 'すみません (Sumimasen)', 'いくらですか (Ikura desu ka)'],
      difficulty: 'Hard',
      timeToBasic: '12 months',
      recommendedPlatform: 'memrise',
      flag: '🇯🇵'
    },
    {
      country: 'France',
      language: 'French',
      essential: ['Bonjour', 'Merci', 'Combien ça coûte?', 'L\'addition, s\'il vous plaît'],
      difficulty: 'Medium',
      timeToBasic: '6 months',
      recommendedPlatform: 'babbel',
      flag: '🇫🇷'
    },
    {
      country: 'Germany',
      language: 'German',
      essential: ['Guten Tag', 'Danke', 'Wie viel kostet das?', 'Die Rechnung, bitte'],
      difficulty: 'Medium',
      timeToBasic: '6 months',
      recommendedPlatform: 'duolingo',
      flag: '🇩🇪'
    },
    {
      country: 'Thailand',
      language: 'Thai',
      essential: ['สวัสดี (Sawasdee)', 'ขอบคุณ (Khop khun)', 'เท่าไหร่ (Thao rai)', 'เช็คบิล (Check bin)'],
      difficulty: 'Medium',
      timeToBasic: '8 months',
      recommendedPlatform: 'memrise',
      flag: '🇹🇭'
    },
    {
      country: 'Italy',
      language: 'Italian',
      essential: ['Ciao', 'Grazie', 'Quanto costa?', 'Il conto, per favore'],
      difficulty: 'Easy',
      timeToBasic: '4 months',
      recommendedPlatform: 'babbel',
      flag: '🇮🇹'
    }
  ];

  const viralFeatures = [
    {
      icon: Globe,
      title: 'Global Citizen Score',
      description: 'Track your language diversity across countries',
      badge: '73% Global Citizen',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Destination Readiness',
      description: 'See how prepared you are for your next trip',
      badge: '85% Ready for Japan',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Flame,
      title: 'Unified Streak',
      description: 'Combined learning streak across all platforms',
      badge: '365-day streak',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Award,
      title: 'Language Passport',
      description: 'Visual map of languages you speak in visited countries',
      badge: '7 Countries',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const learningPathRecommendations = [
    {
      destination: 'Portugal',
      daysUntilTrip: 45,
      currentLevel: 'Beginner',
      recommendedApp: 'Babbel',
      dailyMinutes: 15,
      expectedLevel: 'Basic Conversational',
      essentialPhrases: 22,
      culturalTips: 8
    },
    {
      destination: 'Mexico',
      daysUntilTrip: 60,
      currentLevel: 'Intermediate',
      recommendedApp: 'Duolingo',
      dailyMinutes: 20,
      expectedLevel: 'Conversational',
      essentialPhrases: 45,
      culturalTips: 12
    }
  ];

  const PlatformCard = ({ platform }: { platform: LanguagePlatform }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-5xl">{platform.logo}</div>
            <div>
              <CardTitle className="text-2xl">{platform.name}</CardTitle>
              <CardDescription className="text-sm mt-1">{platform.tagline}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {platform.rating}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-xs text-muted-foreground">Users</div>
            <div className="font-semibold text-sm">{platform.users}</div>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-xs text-muted-foreground">Languages</div>
            <div className="font-semibold text-sm">{platform.languages}+</div>
          </div>
        </div>

        {/* Pricing */}
        <div className={`bg-gradient-to-r ${platform.color} p-4 rounded-lg text-white`}>
          <div className="text-2xl font-bold">{platform.price}</div>
          <div className="text-sm opacity-90">{platform.priceDetails}</div>
        </div>

        {/* Features */}
        <div>
          <div className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Key Features
          </div>
          <div className="space-y-1.5">
            {platform.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Best For */}
        <div>
          <div className="text-sm font-semibold mb-2">Best For</div>
          <div className="flex flex-wrap gap-1.5">
            {platform.bestFor.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div>
          <div className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Core Strengths
          </div>
          <div className="space-y-1.5">
            {platform.strengths.map((strength, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Level */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">Integration Level</span>
          <Badge variant={platform.integrationLevel === 'high' ? 'default' : 'secondary'}>
            {platform.integrationLevel.toUpperCase()}
          </Badge>
        </div>

        {/* CTA */}
        <Button 
          className="w-full gap-2" 
          size="lg"
          onClick={() => window.open(platform.affiliateLink, '_blank')}
        >
          Start Learning
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <BookOpen className="h-10 w-10 text-primary" />
          Language Learning Academy
        </h1>
        <p className="text-muted-foreground text-lg">
          Master languages for your travels • Connect with 3 top platforms • AI-powered destination preparation
        </p>
      </div>

      {/* Viral Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {viralFeatures.map((feature, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
              <Badge variant="secondary" className="font-mono">
                {feature.badge}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="platforms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platforms" className="gap-2">
            <Star className="h-4 w-4" />
            Platforms
          </TabsTrigger>
          <TabsTrigger value="destination" className="gap-2">
            <MapPin className="h-4 w-4" />
            Destination Learning
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Your Progress
          </TabsTrigger>
          <TabsTrigger value="community" className="gap-2">
            <Users className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        {/* Platform Comparison */}
        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Top 3 Language Learning Platforms
              </CardTitle>
              <CardDescription>
                Compare features, pricing, and find the perfect fit for your learning style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => (
                  <PlatformCard key={platform.id} platform={platform} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">Duolingo</th>
                      <th className="text-center py-3 px-4">Babbel</th>
                      <th className="text-center py-3 px-4">Memrise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Gamification</td>
                      <td className="text-center py-3 px-4">⭐⭐⭐⭐⭐</td>
                      <td className="text-center py-3 px-4">⭐⭐⭐</td>
                      <td className="text-center py-3 px-4">⭐⭐⭐⭐</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Conversational Focus</td>
                      <td className="text-center py-3 px-4">⭐⭐⭐</td>
                      <td className="text-center py-3 px-4">⭐⭐⭐⭐⭐</td>
                      <td className="text-center py-3 px-4">⭐⭐⭐⭐</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Native Speaker Content</td>
                      <td className="text-center py-3 px-4">⭐⭐</td>
                      <td className="text-center py-3 px-4">⭐⭐⭐⭐</td>
                      <td className="text-center py-3 px-4">⭐⭐⭐⭐⭐</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Number of Languages</td>
                      <td className="text-center py-3 px-4">100+</td>
                      <td className="text-center py-3 px-4">14</td>
                      <td className="text-center py-3 px-4">200+</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Best for Travel</td>
                      <td className="text-center py-3 px-4">⭐⭐⭐</td>
                      <td className="text-center py-3 px-4">⭐⭐⭐⭐⭐</td>
                      <td className="text-center py-3 px-4">⭐⭐⭐⭐</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Free Option</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">⚠️ Limited</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Destination-Based Learning */}
        <TabsContent value="destination" className="space-y-6">
          {/* Learning Path Recommendations */}
          {learningPathRecommendations.length > 0 && (
            <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Your Upcoming Trips
                </CardTitle>
                <CardDescription>AI-powered learning paths for your destinations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningPathRecommendations.map((rec, idx) => (
                  <div key={idx} className="bg-card p-6 rounded-lg border-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{rec.destination}</h3>
                        <p className="text-sm text-muted-foreground">{rec.daysUntilTrip} days until trip</p>
                      </div>
                      <Badge variant="default" className="text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {rec.dailyMinutes} min/day
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Current Level</span>
                        <span className="font-medium">{rec.currentLevel}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Expected Level</span>
                        <span className="font-medium text-green-600">{rec.expectedLevel}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress to goal</span>
                          <span className="font-medium">67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-muted p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{rec.essentialPhrases}</div>
                        <div className="text-xs text-muted-foreground">Essential Phrases</div>
                      </div>
                      <div className="bg-muted p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{rec.culturalTips}</div>
                        <div className="text-xs text-muted-foreground">Cultural Tips</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Recommended: </span>
                        <span className="font-semibold">{rec.recommendedApp}</span>
                      </div>
                      <Button size="sm">
                        Start Learning
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Popular Destinations */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Nomad Destinations</CardTitle>
              <CardDescription>Essential language prep for top travel spots</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {destinationLanguages.map((dest, idx) => (
                    <Card key={idx} className="hover:shadow-md transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl">{dest.flag}</div>
                            <div>
                              <h3 className="text-lg font-bold">{dest.country}</h3>
                              <p className="text-sm text-muted-foreground">{dest.language}</p>
                            </div>
                          </div>
                          <Badge variant={
                            dest.difficulty === 'Easy' ? 'default' : 
                            dest.difficulty === 'Medium' ? 'secondary' : 
                            'destructive'
                          }>
                            {dest.difficulty}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Time to basic: </span>
                            <span className="font-medium">{dest.timeToBasic}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Best app: </span>
                            <span className="font-medium capitalize">{dest.recommendedPlatform}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm font-semibold mb-2">Essential Phrases:</div>
                          <div className="space-y-1.5">
                            {dest.essential.map((phrase, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                                <Play className="h-3 w-3 text-primary flex-shrink-0" />
                                <span>{phrase}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button variant="outline" className="w-full">
                          View Full Course
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Dashboard */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Your Language Journey
              </CardTitle>
              <CardDescription>Connect your language learning accounts to see unified progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Connection Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {platforms.map((platform) => (
                  <Card key={platform.id} className="border-2">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="text-4xl">{platform.logo}</div>
                        <div>
                          <div className="font-semibold">{platform.name}</div>
                          <Badge variant="outline" className="mt-1">Not Connected</Badge>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          Connect Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Stats Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-3xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Languages Learning</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <div className="text-3xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-3xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-3xl font-bold">0%</div>
                    <div className="text-sm text-muted-foreground">Global Citizen</div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-muted p-6 rounded-lg text-center">
                <Brain className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Connect Your First Platform</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Link your language learning accounts to track progress, earn achievements, and get personalized recommendations
                </p>
                <Button>
                  Get Started
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Features */}
        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Language Learning Community
              </CardTitle>
              <CardDescription>Connect with fellow nomads learning languages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Community Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2">
                  <CardContent className="p-6">
                    <MessageCircle className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Language Exchange</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Practice with native speakers in your destination countries
                    </p>
                    <Button variant="outline" className="w-full">Find Partners</Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6">
                    <Video className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Virtual Events</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join language practice sessions and cultural workshops
                    </p>
                    <Button variant="outline" className="w-full">View Schedule</Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6">
                    <Trophy className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Challenges</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Compete in 30-day language learning challenges
                    </p>
                    <Button variant="outline" className="w-full">Join Challenge</Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6">
                    <Award className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Success Stories</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get inspired by nomads who mastered new languages
                    </p>
                    <Button variant="outline" className="w-full">Read Stories</Button>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Leaderboard Preview */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Weekly Leaderboard
                </h3>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <div key={rank} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          rank === 1 ? 'bg-yellow-500 text-white' :
                          rank === 2 ? 'bg-gray-400 text-white' :
                          rank === 3 ? 'bg-orange-600 text-white' :
                          'bg-muted-foreground/20'
                        }`}>
                          {rank}
                        </div>
                        <div>
                          <div className="font-medium">Anonymous Nomad</div>
                          <div className="text-xs text-muted-foreground">3 languages</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{Math.floor(Math.random() * 500) + 100}pts</div>
                        <div className="text-xs text-muted-foreground">This week</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LanguageLearning;