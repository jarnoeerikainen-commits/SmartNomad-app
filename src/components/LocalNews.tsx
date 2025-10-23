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
import { Separator } from "@/components/ui/separator";
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
  Shield,
  Filter,
  X,
  CheckCircle2,
  Star,
  Navigation,
  Sparkles,
  Clock,
  ThumbsUp,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import LocalNewsService from "@/services/LocalNewsService";
import { newsCities, searchCities, getCitiesByTier } from "@/data/localNewsCities";
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
  const [selectedTier, setSelectedTier] = useState<"all" | 1 | 2 | 3>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [autoDetecting, setAutoDetecting] = useState(false);

  const newsService = LocalNewsService.getInstance();

  // Auto-detect city with geolocation
  useEffect(() => {
    autoDetectLocation();
  }, []);

  const autoDetectLocation = async () => {
    setAutoDetecting(true);
    try {
      // Try to get user's location
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Find closest city
            const closestCity = findClosestCity(latitude, longitude);
            if (closestCity) {
              setCurrentCity(closestCity);
              setPreferences(prev => ({ ...prev, currentCityId: closestCity.id }));
              toast.success(`📍 Auto-detected: ${closestCity.cityName}`);
            }
            setAutoDetecting(false);
          },
          (error) => {
            console.error("Geolocation error:", error);
            // Fallback to Bangkok
            const fallback = newsCities.find(c => c.id === "bkk");
            if (fallback) {
              setCurrentCity(fallback);
              setPreferences(prev => ({ ...prev, currentCityId: fallback.id }));
            }
            setAutoDetecting(false);
          }
        );
      } else {
        // Fallback to Bangkok
        const fallback = newsCities.find(c => c.id === "bkk");
        if (fallback) {
          setCurrentCity(fallback);
          setPreferences(prev => ({ ...prev, currentCityId: fallback.id }));
        }
        setAutoDetecting(false);
      }
    } catch (error) {
      console.error("Location detection failed:", error);
      setAutoDetecting(false);
    }
  };

  const findClosestCity = (lat: number, lon: number): NewsCity | null => {
    let closestCity: NewsCity | null = null;
    let minDistance = Infinity;

    newsCities.forEach(city => {
      const distance = calculateDistance(lat, lon, city.latitude, city.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    });

    return closestCity;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

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
      toast.success("✅ News updated successfully");
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
      let results = searchCities(query);
      if (selectedTier !== "all") {
        results = results.filter(c => c.tier === selectedTier);
      }
      setSearchResults(results.slice(0, 20));
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
      toast.success(`✨ Now following ${city.cityName}`);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSetCurrentCity = (city: NewsCity) => {
    setCurrentCity(city);
    setPreferences(prev => ({ ...prev, currentCityId: city.id }));
    toast.success(`📍 Current location set to ${city.cityName}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.5) return "text-green-600 dark:text-green-400";
    if (score < -0.2) return "text-red-600 dark:text-red-400";
    return "text-yellow-600 dark:text-yellow-400";
  };

  const getSentimentBadge = (score: number) => {
    if (score > 0.5) return { label: "Positive", variant: "default" as const };
    if (score < -0.2) return { label: "Negative", variant: "destructive" as const };
    return { label: "Neutral", variant: "secondary" as const };
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

  const getTierBadge = (tier: 1 | 2 | 3) => {
    const badges = {
      1: { label: "Global Hub", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
      2: { label: "Nomad Hotspot", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
      3: { label: "Emerging", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" }
    };
    return badges[tier];
  };

  const getCoverageBadge = (level: string) => {
    const badges: Record<string, { icon: string, color: string }> = {
      excellent: { icon: "⭐⭐⭐", color: "text-yellow-600" },
      good: { icon: "⭐⭐", color: "text-yellow-500" },
      basic: { icon: "⭐", color: "text-yellow-400" }
    };
    return badges[level] || badges.basic;
  };

  const tier1Cities = getCitiesByTier(1);
  const tier2Cities = getCitiesByTier(2);
  const tier3Cities = getCitiesByTier(3);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Globe2 className="h-12 w-12" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Local News Intelligence
              </h1>
              <p className="text-lg md:text-xl opacity-90 mt-2">
                Stay informed across 100 cities worldwide • Personalized for nomads
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Badge variant="secondary" className="text-base px-4 py-2 bg-white/20 hover:bg-white/30">
              <Navigation className="mr-2 h-4 w-4" />
              100 Cities
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2 bg-white/20 hover:bg-white/30">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2 bg-white/20 hover:bg-white/30">
              <Shield className="mr-2 h-4 w-4" />
              Safety Alerts
            </Badge>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48" />
      </div>

      {/* Safety Alerts */}
      {safetyAlerts.length > 0 && (
        <Card className="border-red-500 dark:border-red-900 bg-red-50 dark:bg-red-950/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
                <span className="text-xl">Active Safety Alerts</span>
              </CardTitle>
              <Badge variant="destructive" className="text-lg px-3 py-1">
                {safetyAlerts.length} Alert{safetyAlerts.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safetyAlerts.map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <Shield className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg">{alert.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{alert.summary}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{format(alert.publishedAt, "PPp")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/50">
          <TabsTrigger value="feed" className="text-base">
            <Newspaper className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">News Feed</span>
            <span className="sm:hidden">Feed</span>
          </TabsTrigger>
          <TabsTrigger value="locations" className="text-base">
            <MapPin className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Manage Cities</span>
            <span className="sm:hidden">Cities</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-base">
            <Settings className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Preferences</span>
            <span className="sm:hidden">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* News Feed Tab */}
        <TabsContent value="feed" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl">Your Personalized Feed</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {news.length} articles • Last updated: {format(lastRefresh, "p")}
                  </CardDescription>
                  {currentCity && (
                    <Badge variant="outline" className="mt-3 text-base px-3 py-1">
                      <MapPin className="mr-2 h-4 w-4" />
                      {currentCity.cityName}, {currentCity.countryName}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="lg">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                  <Button onClick={loadNews} disabled={isLoading} size="lg">
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Quick Filters */}
              {showFilters && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={preferences.sentimentFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreferences(prev => ({ ...prev, sentimentFilter: 'all' }))}
                    >
                      All News
                    </Button>
                    <Button
                      variant={preferences.sentimentFilter === 'positive' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreferences(prev => ({ ...prev, sentimentFilter: 'positive' }))}
                    >
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      Positive Only
                    </Button>
                    <Button
                      variant={preferences.sentimentFilter === 'balanced' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreferences(prev => ({ ...prev, sentimentFilter: 'balanced' }))}
                    >
                      Balanced
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-16">
                  <Globe2 className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
                  <p className="text-xl font-medium mb-2">No news available</p>
                  <p className="text-muted-foreground mb-6">
                    Select a city to start receiving personalized news updates
                  </p>
                  <Button onClick={() => (document.querySelector('[value="locations"]') as HTMLElement)?.click()} size="lg">
                    <MapPin className="mr-2 h-4 w-4" />
                    Choose Your City
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[700px] pr-4">
                  <div className="space-y-6">
                    {news.map(article => {
                      const sentiment = getSentimentBadge(article.sentimentScore);
                      return (
                        <Card key={article.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                              {article.imageUrl && (
                                <img
                                  src={article.imageUrl}
                                  alt={article.title}
                                  className="w-full md:w-48 h-48 object-cover rounded-xl flex-shrink-0 shadow-md"
                                />
                              )}
                              <div className="flex-1 space-y-3 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-bold text-xl leading-tight hover:text-primary transition-colors">
                                    {article.title}
                                  </h3>
                                  {article.safetyRelated && (
                                    <Badge variant="destructive" className="flex-shrink-0">
                                      <Shield className="mr-1 h-3 w-3" />
                                      Safety
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-muted-foreground line-clamp-2 text-base">
                                  {article.summary}
                                </p>

                                <div className="flex items-center flex-wrap gap-2">
                                  {article.categories.map(cat => (
                                    <Badge key={cat} variant="secondary" className="text-sm">
                                      {getCategoryIcon(cat)} {cat}
                                    </Badge>
                                  ))}
                                  <Badge variant={sentiment.variant} className="text-sm">
                                    {sentiment.label}
                                  </Badge>
                                </div>

                                <Separator />

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <span className="font-medium">{article.sourceName}</span>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{format(article.publishedAt, "PPp")}</span>
                                    </div>
                                  </div>
                                  <Button variant="default" size="sm" asChild>
                                    <a href={article.contentUrl} target="_blank" rel="noopener noreferrer">
                                      <Zap className="mr-1 h-3 w-3" />
                                      Read Article
                                      <ExternalLink className="ml-1 h-3 w-3" />
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          {/* Current City */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Current Location</CardTitle>
                <Button onClick={autoDetectLocation} disabled={autoDetecting} variant="outline">
                  {autoDetecting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Navigation className="mr-2 h-4 w-4" />
                      Auto-Detect
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {currentCity ? (
                <div className="p-6 bg-gradient-to-br from-primary/10 to-purple-100/50 dark:from-primary/20 dark:to-purple-900/20 rounded-xl border-2 border-primary/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="text-3xl font-bold">{currentCity.cityName}</h3>
                          <p className="text-lg text-muted-foreground">{currentCity.countryName}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge className={getTierBadge(currentCity.tier).color}>
                          {getTierBadge(currentCity.tier).label}
                        </Badge>
                        <Badge variant="outline">
                          📰 {currentCity.newsSources.local.length + currentCity.newsSources.english.length} sources
                        </Badge>
                        <Badge variant="outline">
                          {getCoverageBadge(currentCity.englishCoverageLevel).icon} {currentCity.englishCoverageLevel} coverage
                        </Badge>
                      </div>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No current location set</p>
                  <Button onClick={autoDetectLocation} size="lg">
                    <Navigation className="mr-2 h-4 w-4" />
                    Auto-Detect Location
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Followed Cities */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <CardTitle className="text-2xl">
                Followed Cities ({followedCities.length})
              </CardTitle>
              <CardDescription className="text-base">
                Track news from your upcoming destinations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {followedCities.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {followedCities.map(city => (
                    <Card key={city.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-lg truncate">{city.cityName}</p>
                            <p className="text-sm text-muted-foreground">{city.countryName}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {getCoverageBadge(city.englishCoverageLevel).icon}
                              </Badge>
                              <Badge className={`text-xs ${getTierBadge(city.tier).color}`}>
                                Tier {city.tier}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetCurrentCity(city)}
                            >
                              <MapPin className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFollowCity(city)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No cities followed yet</p>
                  <p className="text-muted-foreground">
                    Search below to add cities to your watchlist
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* City Search */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
              <CardTitle className="text-2xl">Explore 100 Cities</CardTitle>
              <CardDescription className="text-base">
                Search from our curated list of top digital nomad destinations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search cities (e.g., Bangkok, Lisbon, Tokyo)..."
                  value={searchQuery}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  className="pl-11 h-12 text-base"
                />
              </div>

              {/* Tier Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTier === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTier("all");
                    if (searchQuery) handleCitySearch(searchQuery);
                  }}
                >
                  All Cities (100)
                </Button>
                <Button
                  variant={selectedTier === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTier(1);
                    if (searchQuery) handleCitySearch(searchQuery);
                  }}
                >
                  <Star className="mr-1 h-3 w-3" />
                  Global Hubs ({tier1Cities.length})
                </Button>
                <Button
                  variant={selectedTier === 2 ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTier(2);
                    if (searchQuery) handleCitySearch(searchQuery);
                  }}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Nomad Hotspots ({tier2Cities.length})
                </Button>
                <Button
                  variant={selectedTier === 3 ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTier(3);
                    if (searchQuery) handleCitySearch(searchQuery);
                  }}
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Emerging ({tier3Cities.length})
                </Button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <Card className="border-2">
                  <CardContent className="p-2">
                    <ScrollArea className="h-96">
                      <div className="space-y-1">
                        {searchResults.map(city => {
                          const isFollowed = followedCities.find(c => c.id === city.id);
                          const isCurrent = currentCity?.id === city.id;
                          return (
                            <div
                              key={city.id}
                              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{city.cityName}, {city.countryName}</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {getCoverageBadge(city.englishCoverageLevel).icon}
                                  </Badge>
                                  <Badge className={`text-xs ${getTierBadge(city.tier).color}`}>
                                    {getTierBadge(city.tier).label}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {!isCurrent && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSetCurrentCity(city)}
                                    title="Set as current location"
                                  >
                                    <MapPin className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant={isFollowed ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleFollowCity(city)}
                                >
                                  {isFollowed ? <CheckCircle2 className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <CardTitle className="text-2xl">News Preferences</CardTitle>
              <CardDescription className="text-base">
                Customize your feed to match your interests and reading habits
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Delivery Frequency */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Articles per Day</Label>
                  <Badge variant="outline" className="text-lg px-3 py-1">{preferences.deliveryFrequency}</Badge>
                </div>
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
                  {preferences.deliveryFrequency <= 2 ? "📱 Light - Key updates only" :
                   preferences.deliveryFrequency <= 5 ? "⚖️ Moderate - Balanced overview" :
                   "📚 Comprehensive - Full local immersion"}
                </p>
              </div>

              <Separator />

              {/* Content Types */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Content Types</Label>
                <div className="grid gap-4">
                  {Object.entries(preferences.contentTypes).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <Label htmlFor={key} className="capitalize text-base cursor-pointer">
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

              <Separator />

              {/* Language Preference */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Language Preference</Label>
                <Select
                  value={preferences.languagePreference}
                  onValueChange={(value: any) =>
                    setPreferences(prev => ({ ...prev, languagePreference: value }))
                  }
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-[100]">
                    <SelectItem value="english" className="text-base">🇬🇧 English only</SelectItem>
                    <SelectItem value="mixed" className="text-base">🌐 Mixed (English + Local)</SelectItem>
                    <SelectItem value="local" className="text-base">🗣️ Local language</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Sentiment Filter */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Sentiment Filter</Label>
                <Select
                  value={preferences.sentimentFilter}
                  onValueChange={(value: any) =>
                    setPreferences(prev => ({ ...prev, sentimentFilter: value }))
                  }
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-[100]">
                    <SelectItem value="positive" className="text-base">😊 Positive news only</SelectItem>
                    <SelectItem value="balanced" className="text-base">⚖️ Balanced</SelectItem>
                    <SelectItem value="all" className="text-base">📰 All news</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Button onClick={loadNews} className="w-full h-12 text-base" size="lg">
                <RefreshCw className="mr-2 h-5 w-5" />
                Apply Preferences & Refresh
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalNews;
