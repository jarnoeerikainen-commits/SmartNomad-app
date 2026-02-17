
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Newspaper, ExternalLink, RefreshCw, Bell, Globe, Filter, Calendar, Settings,
  Clock, Zap, TrendingUp, Shield, MapPin, Search, ChevronDown, ChevronUp,
  AlertTriangle, Star, BookOpen, Radio, Megaphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewsService, { NewsItem } from '@/services/NewsService';
import { ALL_COUNTRIES } from '@/data/countries';

interface EnhancedNewsSectionProps {
  className?: string;
}

const COUNTRIES = ALL_COUNTRIES.map(c => ({
  code: c.code, name: c.name, flag: c.flag
})).sort((a, b) => a.name.localeCompare(b.name));

const NEWS_CATEGORIES = [
  { id: 'visa', label: 'Visa & Immigration', icon: '🛂', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' },
  { id: 'laws', label: 'Laws & Regulations', icon: '⚖️', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'taxes', label: 'Taxes & Finance', icon: '💰', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { id: 'war', label: 'Conflicts & Security', icon: '⚠️', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  { id: 'weather_alerts', label: 'Weather Alerts', icon: '🌩️', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 'strikes', label: 'Strikes & Disruptions', icon: '✊', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  { id: 'aviation', label: 'Aviation & Flights', icon: '✈️', color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300' },
  { id: 'business', label: 'Business & Economy', icon: '📊', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { id: 'travel', label: 'Travel Updates', icon: '🧳', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' },
  { id: 'general', label: 'General News', icon: '📰', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300' },
];

type DeliveryRhythm = 'realtime' | 'daily' | 'bidaily' | 'custom' | 'weekly' | 'biweekly' | 'monthly';
type SourceType = 'all' | 'local' | 'global' | 'government';
type ReportStyle = 'headlines' | 'summaries' | 'detailed';

interface NewsPreferences {
  rhythm: DeliveryRhythm;
  customDays: number;
  sourceType: SourceType;
  reportStyle: ReportStyle;
  articlesPerUpdate: number;
  breakingOnly: boolean;
  highImpactOnly: boolean;
  enableNotifications: boolean;
  enableDigest: boolean;
  digestTime: 'morning' | 'afternoon' | 'evening';
}

const DEFAULT_PREFS: NewsPreferences = {
  rhythm: 'daily',
  customDays: 3,
  sourceType: 'all',
  reportStyle: 'summaries',
  articlesPerUpdate: 5,
  breakingOnly: false,
  highImpactOnly: false,
  enableNotifications: true,
  enableDigest: true,
  digestTime: 'morning',
};

const RHYTHM_OPTIONS: { value: DeliveryRhythm; label: string; desc: string; icon: React.ReactNode }[] = [
  { value: 'realtime', label: 'Real-time', desc: 'Instant alerts as news breaks', icon: <Zap className="w-4 h-4" /> },
  { value: 'daily', label: 'Daily', desc: 'Once per day digest', icon: <Clock className="w-4 h-4" /> },
  { value: 'bidaily', label: 'Twice Daily', desc: 'Morning & evening updates', icon: <RefreshCw className="w-4 h-4" /> },
  { value: 'custom', label: 'Custom Interval', desc: 'Choose your own days', icon: <Calendar className="w-4 h-4" /> },
  { value: 'weekly', label: 'Weekly Report', desc: 'Comprehensive weekly roundup', icon: <BookOpen className="w-4 h-4" /> },
  { value: 'biweekly', label: 'Bi-weekly', desc: 'Every two weeks summary', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'monthly', label: 'Monthly Report', desc: 'In-depth monthly analysis', icon: <Star className="w-4 h-4" /> },
];

const SOURCE_OPTIONS: { value: SourceType; label: string; desc: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Sources', desc: 'Local + global + government', icon: <Globe className="w-4 h-4" /> },
  { value: 'local', label: 'Local Only', desc: 'City newspapers & local media', icon: <MapPin className="w-4 h-4" /> },
  { value: 'global', label: 'Global Only', desc: 'Reuters, BBC, AP, CNN', icon: <Radio className="w-4 h-4" /> },
  { value: 'government', label: 'Government', desc: 'Official government sources', icon: <Shield className="w-4 h-4" /> },
];

const EnhancedNewsSection: React.FC<EnhancedNewsSectionProps> = ({ className }) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'GB', 'DE']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(NEWS_CATEGORIES.map(c => c.id));
  const [prefs, setPrefs] = useState<NewsPreferences>(DEFAULT_PREFS);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [showAllCountries, setShowAllCountries] = useState(false);
  const { toast } = useToast();

  const newsService = NewsService.getInstance();

  const loadNews = useCallback(async () => {
    if (selectedCountries.length === 0) { setNews([]); return; }
    setIsLoading(true);
    try {
      const newsData = await newsService.getCountryNews(selectedCountries, ['en'], selectedCategories);
      let filtered = newsData;
      if (prefs.breakingOnly) filtered = filtered.filter(n => n.isBreaking);
      if (prefs.highImpactOnly) filtered = filtered.filter(n => n.impact === 'high');
      setNews(filtered.slice(0, prefs.articlesPerUpdate));
      setLastRefresh(new Date());
    } catch {
      toast({ title: "Failed to load news", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountries, selectedCategories, prefs, newsService, toast]);

  useEffect(() => { loadNews(); }, [loadNews]);

  const handleCountryToggle = (code: string) => {
    setSelectedCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : prev.length < 15 ? [...prev, code] : prev
    );
  };

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const selectAllCategories = () => setSelectedCategories(NEWS_CATEGORIES.map(c => c.id));
  const clearAllCategories = () => setSelectedCategories([]);

  const getCategoryMeta = (category: string) => NEWS_CATEGORIES.find(c => c.id === category);
  const getCountryFlag = (code: string) => COUNTRIES.find(c => c.code === code)?.flag || '🌍';

  const filteredCountries = countrySearch
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
    : COUNTRIES;

  const displayedCountries = showAllCountries ? filteredCountries : filteredCountries.slice(0, 20);

  const getRhythmLabel = () => {
    const r = RHYTHM_OPTIONS.find(o => o.value === prefs.rhythm);
    if (prefs.rhythm === 'custom') return `Every ${prefs.customDays} days`;
    return r?.label || 'Daily';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent p-6 md:p-8 text-primary-foreground shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary-foreground/20 rounded-xl backdrop-blur-sm">
              <Newspaper className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Daily News Center</h1>
              <p className="opacity-90 mt-1">Your personalized nomad intelligence hub</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0 px-3 py-1">
              <Clock className="mr-1.5 h-3.5 w-3.5" />{getRhythmLabel()}
            </Badge>
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0 px-3 py-1">
              <Globe className="mr-1.5 h-3.5 w-3.5" />{selectedCountries.length} countries
            </Badge>
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0 px-3 py-1">
              <Filter className="mr-1.5 h-3.5 w-3.5" />{selectedCategories.length} categories
            </Badge>
            {lastRefresh && (
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0 px-3 py-1">
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Badge>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary-foreground/5 rounded-full blur-3xl -ml-30 -mb-30" />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="feed" className="gap-1.5">
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">Feed</span>
          </TabsTrigger>
          <TabsTrigger value="rhythm" className="gap-1.5">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Rhythm</span>
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-1.5">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Sources</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-1.5">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Topics</span>
          </TabsTrigger>
        </TabsList>

        {/* ─── FEED TAB ─── */}
        <TabsContent value="feed" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Latest Updates</h2>
              {news.length > 0 && (
                <Badge className="bg-primary/10 text-primary border-primary/20">{news.length} articles</Badge>
              )}
            </div>
            <Button size="sm" variant="outline" onClick={loadNews} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={prefs.breakingOnly ? 'default' : 'outline'}
              onClick={() => setPrefs(p => ({ ...p, breakingOnly: !p.breakingOnly }))}>
              <Zap className="w-3.5 h-3.5 mr-1" />Breaking Only
            </Button>
            <Button size="sm" variant={prefs.highImpactOnly ? 'default' : 'outline'}
              onClick={() => setPrefs(p => ({ ...p, highImpactOnly: !p.highImpactOnly }))}>
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />High Impact
            </Button>
          </div>

          {/* Selected Countries Chips */}
          {selectedCountries.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedCountries.map(code => {
                const c = COUNTRIES.find(x => x.code === code);
                return (
                  <Badge key={code} variant="outline" className="text-xs cursor-pointer hover:bg-destructive/10"
                    onClick={() => handleCountryToggle(code)}>
                    {c?.flag} {c?.name} ×
                  </Badge>
                );
              })}
            </div>
          )}

          {/* News List */}
          {selectedCountries.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="text-center py-12">
                <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground">No countries selected</p>
                <p className="text-sm text-muted-foreground mt-1">Go to Sources tab to pick countries</p>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <Card key={i}><CardContent className="p-4 animate-pulse">
                  <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent></Card>
              ))}
            </div>
          ) : news.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="text-center py-12">
                <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground">No news matches your filters</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting categories or filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {news.map(item => {
                const cat = getCategoryMeta(item.category);
                return (
                  <Card key={item.id} className="hover:shadow-lg transition-all duration-200 group">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            {item.isBreaking && (
                              <Badge className="bg-destructive text-destructive-foreground text-xs animate-pulse">⚡ BREAKING</Badge>
                            )}
                            <Badge className={`text-xs ${cat?.color || 'bg-muted text-muted-foreground'}`}>
                              {cat?.icon} {item.category.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant={item.impact === 'high' ? 'destructive' : item.impact === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                              {item.impact.toUpperCase()}
                            </Badge>
                            <span className="text-base">{getCountryFlag(item.country)}</span>
                          </div>
                          <h3 className="font-semibold text-foreground mb-1.5 leading-snug group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{item.summary}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="font-medium">{item.source}</span>
                            <span>{new Date(item.publishedAt).toLocaleDateString()} · {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => window.open(item.url, '_blank')}
                          className="shrink-0 text-muted-foreground hover:text-primary">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ─── RHYTHM TAB ─── */}
        <TabsContent value="rhythm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />Delivery Rhythm</CardTitle>
              <CardDescription>How often do you want to receive news updates?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={prefs.rhythm} onValueChange={(v) => setPrefs(p => ({ ...p, rhythm: v as DeliveryRhythm }))}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {RHYTHM_OPTIONS.map(opt => (
                    <label key={opt.value}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        prefs.rhythm === opt.value
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/30 hover:bg-muted/50'
                      }`}>
                      <RadioGroupItem value={opt.value} className="mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-primary">{opt.icon}</span>
                          <span className="font-semibold text-foreground">{opt.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>

              {prefs.rhythm === 'custom' && (
                <div className="p-4 rounded-xl bg-muted/50 border space-y-3">
                  <Label className="font-medium">Every {prefs.customDays} day{prefs.customDays > 1 ? 's' : ''}</Label>
                  <Slider
                    value={[prefs.customDays]}
                    onValueChange={([v]) => setPrefs(p => ({ ...p, customDays: v }))}
                    min={1} max={14} step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Every day</span><span>Every 14 days</span>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><Megaphone className="w-4 h-4 text-primary" />Digest Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Email Digest</Label>
                    <p className="text-sm text-muted-foreground">Receive a summary email</p>
                  </div>
                  <Switch checked={prefs.enableDigest} onCheckedChange={v => setPrefs(p => ({ ...p, enableDigest: v }))} />
                </div>
                {prefs.enableDigest && (
                  <RadioGroup value={prefs.digestTime} onValueChange={v => setPrefs(p => ({ ...p, digestTime: v as any }))}>
                    <div className="flex gap-3">
                      {(['morning', 'afternoon', 'evening'] as const).map(t => (
                        <label key={t} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                          prefs.digestTime === t ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                        }`}>
                          <RadioGroupItem value={t} />
                          <span className="text-sm font-medium capitalize">{t}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Breaking news & critical alerts</p>
                  </div>
                  <Switch checked={prefs.enableNotifications} onCheckedChange={v => setPrefs(p => ({ ...p, enableNotifications: v }))} />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" />Report Style</h3>
                <RadioGroup value={prefs.reportStyle} onValueChange={v => setPrefs(p => ({ ...p, reportStyle: v as ReportStyle }))}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'headlines', label: 'Headlines', desc: 'Quick one-liners' },
                      { value: 'summaries', label: 'Summaries', desc: '2-3 sentence overviews' },
                      { value: 'detailed', label: 'Detailed', desc: 'Full analysis & context' },
                    ].map(opt => (
                      <label key={opt.value} className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all ${
                        prefs.reportStyle === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}>
                        <RadioGroupItem value={opt.value} className="sr-only" />
                        <p className="font-semibold text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="font-medium">Articles per update: {prefs.articlesPerUpdate}</Label>
                <Slider
                  value={[prefs.articlesPerUpdate]}
                  onValueChange={([v]) => setPrefs(p => ({ ...p, articlesPerUpdate: v }))}
                  min={1} max={20} step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 article</span><span>20 articles</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── SOURCES TAB ─── */}
        <TabsContent value="sources" className="space-y-4">
          {/* Source Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Radio className="w-5 h-5 text-primary" />Source Type</CardTitle>
              <CardDescription>Choose where your news comes from</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={prefs.sourceType} onValueChange={v => setPrefs(p => ({ ...p, sourceType: v as SourceType }))}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SOURCE_OPTIONS.map(opt => (
                    <label key={opt.value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      prefs.sourceType === opt.value ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/30'
                    }`}>
                      <RadioGroupItem value={opt.value} className="mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-primary">{opt.icon}</span>
                          <span className="font-semibold text-foreground">{opt.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Country Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" />Countries</CardTitle>
                  <CardDescription>{selectedCountries.length} of 15 max selected</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedCountries([])}>Clear</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search countries..." value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)} className="pl-9" />
              </div>

              {selectedCountries.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {selectedCountries.map(code => {
                    const c = COUNTRIES.find(x => x.code === code);
                    return (
                      <Badge key={code} className="bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() => handleCountryToggle(code)}>
                        {c?.flag} {c?.name} ×
                      </Badge>
                    );
                  })}
                </div>
              )}

              <ScrollArea className="h-64">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {displayedCountries.map(country => (
                    <label key={country.code} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <Checkbox checked={selectedCountries.includes(country.code)}
                        onCheckedChange={() => handleCountryToggle(country.code)}
                        disabled={!selectedCountries.includes(country.code) && selectedCountries.length >= 15} />
                      <span className="text-lg">{country.flag}</span>
                      <span className="text-sm font-medium text-foreground">{country.name}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>

              {!showAllCountries && filteredCountries.length > 20 && (
                <Button variant="ghost" className="w-full" onClick={() => setShowAllCountries(true)}>
                  <ChevronDown className="w-4 h-4 mr-1.5" />Show all {filteredCountries.length} countries
                </Button>
              )}
              {showAllCountries && (
                <Button variant="ghost" className="w-full" onClick={() => setShowAllCountries(false)}>
                  <ChevronUp className="w-4 h-4 mr-1.5" />Show less
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── CATEGORIES TAB ─── */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5 text-primary" />News Topics</CardTitle>
                  <CardDescription>Select the topics you care about</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={selectAllCategories}>All</Button>
                  <Button size="sm" variant="outline" onClick={clearAllCategories}>None</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {NEWS_CATEGORIES.map(cat => (
                  <label key={cat.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCategories.includes(cat.id)
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    }`}>
                    <Checkbox checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={() => handleCategoryToggle(cat.id)} />
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium text-foreground">{cat.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedNewsSection;
