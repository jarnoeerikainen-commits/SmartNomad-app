import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Newspaper, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  Bell, 
  Globe,
  Filter,
  Calendar,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewsService, { NewsItem } from '@/services/NewsService';

interface EnhancedNewsSectionProps {
  className?: string;
}

// Import all countries from centralized data file
import { ALL_COUNTRIES } from '@/data/countries';

// Map to the format needed for news filtering
const COUNTRIES = ALL_COUNTRIES.map(c => ({
  code: c.code,
  name: c.name,
  flag: c.flag
})).sort((a, b) => a.name.localeCompare(b.name));

const NEWS_CATEGORIES = [
  { id: 'laws', label: 'Laws & Regulations', icon: '⚖️', color: 'bg-blue-100 text-blue-800' },
  { id: 'taxes', label: 'Taxes', icon: '💰', color: 'bg-green-100 text-green-800' },
  { id: 'war', label: 'War & Conflicts', icon: '⚠️', color: 'bg-red-100 text-red-800' },
  { id: 'weather_alerts', label: 'Weather Alerts', icon: '🌩️', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'strikes', label: 'Strikes & Disruptions', icon: '✊', color: 'bg-orange-100 text-orange-800' },
  { id: 'aviation', label: 'Aviation', icon: '✈️', color: 'bg-purple-100 text-purple-800' },
  { id: 'business', label: 'Business & Economy', icon: '📊', color: 'bg-indigo-100 text-indigo-800' }
];

const EnhancedNewsSection: React.FC<EnhancedNewsSectionProps> = ({ className }) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'GB', 'DE']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['laws', 'taxes']);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const newsService = NewsService.getInstance();

  const loadNewsCallback = React.useCallback(async () => {
    if (selectedCountries.length === 0) {
      setNews([]);
      return;
    }

    setIsLoading(true);
    try {
      const newsData = await newsService.getCountryNews(
        selectedCountries, 
        ['en'], 
        selectedCategories
      );
      setNews(newsData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load news:', error);
      toast({
        title: "News Loading Failed",
        description: "Unable to fetch latest news updates.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountries, selectedCategories, newsService, toast]);

  useEffect(() => {
    loadNewsCallback();
    // Auto-refresh every hour
    const interval = setInterval(loadNewsCallback, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadNewsCallback]);

  const loadNews = loadNewsCallback;

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountries(prev => 
      prev.includes(countryCode) 
        ? prev.filter(c => c !== countryCode)
        : [...prev, countryCode]
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryColor = (category: string) => {
    const cat = NEWS_CATEGORIES.find(c => c.id === category);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const cat = NEWS_CATEGORIES.find(c => c.id === category);
    return cat?.icon || '📰';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCountryFlag = (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    return country?.flag || '🌍';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="border-primary/30 gradient-hero">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl text-card-foreground">
              <div className="p-2 bg-primary rounded-lg shadow-medium">
                <Newspaper className="w-6 h-6 text-primary-foreground" />
              </div>
              Daily News Center
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-accent/30 bg-card/50 text-card-foreground hover:bg-card/80"
              >
                <Settings className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={loadNews}
                disabled={isLoading}
                className="border-blue-300 text-blue-600 hover:bg-blue-100"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <p className="text-blue-600 mt-2">
            Get 5 daily news updates from your selected countries and categories
          </p>
          {lastRefresh && (
            <p className="text-sm text-blue-500">
              <Calendar className="w-4 h-4 inline mr-1" />
              Last updated: {lastRefresh.toLocaleString()}
            </p>
          )}
        </CardHeader>

        {/* Filters Section */}
        {showFilters && (
          <CardContent className="border-t bg-card/80">
            <div className="space-y-6">
              {/* Country Selection */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Select Countries ({selectedCountries.length}/10 max)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {COUNTRIES.map(country => (
                    <label key={country.code} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 cursor-pointer">
                      <Checkbox 
                        checked={selectedCountries.includes(country.code)}
                        onCheckedChange={() => handleCountryChange(country.code)}
                        disabled={!selectedCountries.includes(country.code) && selectedCountries.length >= 10}
                      />
                      <span className="text-lg">{country.flag}</span>
                      <span className="text-sm font-medium text-gray-700">{country.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  News Categories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {NEWS_CATEGORIES.map(category => (
                    <label key={category.id} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-blue-50 cursor-pointer border border-gray-200">
                      <Checkbox 
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                      />
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Selected Filters Display */}
      {(selectedCountries.length > 0 || selectedCategories.length > 0) && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              {selectedCountries.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Selected Countries:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountries.map(code => {
                      const country = COUNTRIES.find(c => c.code === code);
                      return (
                        <Badge key={code} variant="secondary" className="text-xs">
                          {country?.flag} {country?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
              {selectedCategories.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Selected Categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map(categoryId => {
                      const category = NEWS_CATEGORIES.find(c => c.id === categoryId);
                      return (
                        <Badge key={categoryId} variant="secondary" className="text-xs">
                          {category?.icon} {category?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* News Feed */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-primary" />
            Latest News Updates
            {news.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">{news.length}/5 today</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedCountries.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select countries to see news updates</p>
              <p className="text-sm text-gray-500">Choose up to 10 countries for personalized news</p>
            </div>
          ) : news.length === 0 && !isLoading ? (
            <div className="text-center py-8">
              <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No news available for selected filters</p>
              <p className="text-sm text-gray-500">Try adjusting your country or category selection</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-4 p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            news.map(item => (
              <div key={item.id} className="p-4 bg-card rounded-lg border hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.isBreaking && (
                        <Badge className="bg-destructive text-destructive-foreground text-xs animate-pulse">
                          ⚡ BREAKING
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                        {getCategoryIcon(item.category)} {item.category.toUpperCase().replace('_', ' ')}
                      </Badge>
                      <Badge className={`text-xs ${getImpactColor(item.impact)}`}>
                        {item.impact.toUpperCase()} IMPACT
                      </Badge>
                      <span className="text-lg">{getCountryFlag(item.country)}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg leading-tight">{item.title}</h3>
                    <p className="text-gray-600 mb-3 leading-relaxed">{item.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium">{item.source}</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()} • {new Date(item.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(item.url, '_blank')}
                    className="ml-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedNewsSection;