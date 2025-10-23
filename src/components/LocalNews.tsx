import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  Newspaper,
  Settings,
  Search,
  Bell,
  AlertTriangle,
  Calendar,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Globe2,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import LocalNewsService from "@/services/LocalNewsService";
import { newsCities, searchCities } from "@/data/localNewsCities";
import { LocalNewsArticle, UserNewsPreferences, DEFAULT_PREFERENCES, NewsCity } from "@/types/localNews";
import { format } from "date-fns";

const LocalNews = () => {
  const [currentCity, setCurrentCity] = useState<NewsCity | null>(null);
  const [followedCities, setFollowedCities] = useState<NewsCity[]>([]);
  const [preferences, setPreferences] = useState<UserNewsPreferences>(DEFAULT_PREFERENCES);
  const [news, setNews] = useState<LocalNewsArticle[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState<LocalNewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NewsCity[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const newsService = LocalNewsService.getInstance();

  // Auto-detect city (simulated)
  useEffect(() => {
    const autoDetectedCity = newsCities.find(c => c.id === "bkk"); // Default to Bangkok
    if (autoDetectedCity) {
      setCurrentCity(autoDetectedCity);
      setPreferences(prev => ({ ...prev, currentCityId: autoDetectedCity.id }));
    }
  }, []);

  // Load news when city or preferences change
  useEffect(() => {
    if (currentCity || followedCities.length > 0) {
      loadNews();
    }
  }, [currentCity, followedCities, preferences]);

  const loadNews = async () => {
    if (!currentCity && followedCities.length === 0) return;

    setIsLoading(true);
    try {
      const cityIds = [
        ...(currentCity ? [currentCity.id] : []),
        ...followedCities.map(c => c.id)
      ];

      const articles = await newsService.getMultipleCitiesNews(cityIds, preferences);
      setNews(articles);

      if (preferences.contentTypes.safetyAlerts) {
        const alerts = await newsService.getSafetyAlerts(cityIds);
        setSafetyAlerts(alerts);
      }

      setLastRefresh(new Date());
      toast.success("News updated successfully");
    } catch (error) {
      console.error("Failed to load news:", error);
      toast.error("Failed to load news. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = searchCities(query);
      setSearchResults(results.slice(0, 10));
    } else {
      setSearchResults([]);
    }
  };

  const handleFollowCity = (city: NewsCity) => {
    if (followedCities.find(c => c.id === city.id)) {
      setFollowedCities(followedCities.filter(c => c.id !== city.id));
      toast.info(`Unfollowed ${city.cityName}`);
    } else {
      setFollowedCities([...followedCities, city]);
      toast.success(`Now following ${city.cityName}`);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.5) return "text-green-600 dark:text-green-400";
    if (score < -0.2) return "text-red-600 dark:text-red-400";
    return "text-yellow-600 dark:text-yellow-400";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      safety: "🛡️",
      culture: "🎭",
      technology: "💻",
      business: "💼",
      events: "🎉",
      transportation: "🚇",
      food: "🍽️",
      health: "🏥",
      politics: "🏛️",
      education: "📚"
    };
    return icons[category] || "📰";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Local News Intelligence
          </h1>
          <p className="text-muted-foreground mt-2">
            Stay informed with personalized news from your current and upcoming destinations
          </p>
        </div>
        <Button onClick={loadNews} disabled={isLoading} size="lg">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Safety Alerts */}
      {safetyAlerts.length > 0 && (
        <Card className="border-red-500 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Active Safety Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {safetyAlerts.map(alert => (
                <div key={alert.id} className="flex items-start gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <Shield className="h-4 w-4 text-red-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.summary}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(alert.publishedAt, "PPp")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed">
            <Newspaper className="mr-2 h-4 w-4" />
            News Feed
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="mr-2 h-4 w-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* News Feed Tab */}
        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personalized Feed</CardTitle>
                  <CardDescription>
                    {news.length} articles • Last updated: {format(lastRefresh, "p")}
                  </CardDescription>
                </div>
                {currentCity && (
                  <Badge variant="outline" className="text-lg">
                    📍 {currentCity.cityName}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-12">
                  <Globe2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No news available</p>
                  <p className="text-muted-foreground">
                    Select a city to start receiving personalized news updates
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {news.map(article => (
                      <Card key={article.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            {article.imageUrl && (
                              <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-lg leading-tight">
                                  {article.title}
                                </h3>
                                {article.safetyRelated && (
                                  <Badge variant="destructive" className="flex-shrink-0">
                                    <Shield className="mr-1 h-3 w-3" />
                                    Safety
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {article.summary}
                              </p>

                              <div className="flex items-center gap-2 flex-wrap">
                                {article.categories.map(cat => (
                                  <Badge key={cat} variant="secondary" className="text-xs">
                                    {getCategoryIcon(cat)} {cat}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                  <span>{article.sourceName}</span>
                                  <span>•</span>
                                  <span>{format(article.publishedAt, "PPp")}</span>
                                  <span>•</span>
                                  <span className={getSentimentColor(article.sentimentScore)}>
                                    {article.sentimentScore > 0.5 ? "Positive" : 
                                     article.sentimentScore < -0.2 ? "Negative" : "Neutral"}
                                  </span>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={article.contentUrl} target="_blank" rel="noopener noreferrer">
                                    Read More <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Locations</CardTitle>
              <CardDescription>
                Follow cities to receive news from your upcoming destinations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current City */}
              {currentCity && (
                <div>
                  <Label className="text-lg font-semibold mb-3 block">Current City</Label>
                  <Card className="bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-2xl font-bold">{currentCity.cityName}, {currentCity.countryName}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>📰 {currentCity.newsSources.local.length + currentCity.newsSources.english.length} sources</span>
                            <span>•</span>
                            <span>
                              Coverage: {currentCity.englishCoverageLevel === 'excellent' ? '⭐⭐⭐' : 
                                        currentCity.englishCoverageLevel === 'good' ? '⭐⭐' : '⭐'}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          <MapPin className="mr-2 h-4 w-4" />
                          Auto-detected
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Followed Cities */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">
                  Followed Cities ({followedCities.length})
                </Label>
                {followedCities.length > 0 ? (
                  <div className="grid gap-3">
                    {followedCities.map(city => (
                      <Card key={city.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{city.cityName}, {city.countryName}</p>
                              <p className="text-sm text-muted-foreground">
                                {city.newsSources.english.length} English sources
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFollowCity(city)}
                            >
                              Unfollow
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No cities followed yet. Search below to add cities.
                  </p>
                )}
              </div>

              {/* City Search */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">Add City</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for a city..."
                    value={searchQuery}
                    onChange={(e) => handleCitySearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchResults.length > 0 && (
                  <Card className="mt-2">
                    <CardContent className="p-2">
                      <ScrollArea className="h-64">
                        <div className="space-y-1">
                          {searchResults.map(city => (
                            <Button
                              key={city.id}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => handleFollowCity(city)}
                            >
                              <div className="text-left">
                                <p className="font-medium">{city.cityName}, {city.countryName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Tier {city.tier} • {city.englishCoverageLevel} English coverage
                                </p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>News Preferences</CardTitle>
              <CardDescription>
                Customize your news feed to match your interests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Delivery Frequency */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Articles per Day: {preferences.deliveryFrequency}
                </Label>
                <Slider
                  value={[preferences.deliveryFrequency]}
                  onValueChange={([value]) => 
                    setPreferences(prev => ({ ...prev, deliveryFrequency: value }))
                  }
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  {preferences.deliveryFrequency <= 2 ? "Light - Key updates only" :
                   preferences.deliveryFrequency <= 5 ? "Moderate - Balanced overview" :
                   "Comprehensive - Full local immersion"}
                </p>
              </div>

              {/* Content Types */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Content Types</Label>
                <div className="space-y-3">
                  {Object.entries(preferences.contentTypes).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setPreferences(prev => ({
                            ...prev,
                            contentTypes: { ...prev.contentTypes, [key]: checked }
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Language Preference */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Language Preference</Label>
                <Select
                  value={preferences.languagePreference}
                  onValueChange={(value: any) =>
                    setPreferences(prev => ({ ...prev, languagePreference: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English only</SelectItem>
                    <SelectItem value="mixed">Mixed (English + Local)</SelectItem>
                    <SelectItem value="local">Local language</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sentiment Filter */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Sentiment Filter</Label>
                <Select
                  value={preferences.sentimentFilter}
                  onValueChange={(value: any) =>
                    setPreferences(prev => ({ ...prev, sentimentFilter: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Positive news only</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="all">All news</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={loadNews} className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Apply Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalNews;
