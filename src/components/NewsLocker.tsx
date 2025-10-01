
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper, X, ExternalLink, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewsService, { NewsItem } from '@/services/NewsService';
import { Country } from '@/types/country';

interface NewsLockerProps {
  countries: Country[];
  userProfile?: {
    languages: string[];
  };
}

const NewsLocker: React.FC<NewsLockerProps> = ({ countries, userProfile }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const newsService = NewsService.getInstance();

  useEffect(() => {
    if (countries.length > 0) {
      loadNews();
      // Auto-refresh every 15 minutes
      const interval = setInterval(loadNews, 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [countries, userProfile]);

  const loadNews = async () => {
    if (countries.length === 0) return;

    setIsLoading(true);
    try {
      const countryCodes = countries.map(c => c.code);
      const languages = userProfile?.languages || ['en'];
      
      // Get top 5 most important news
      const newsData = await newsService.getCountryNews(countryCodes, languages);
      const importantNews = newsData
        .filter(item => item.impact === 'high' || item.isBreaking)
        .slice(0, 5);
      
      setNews(importantNews);

      // Show critical visa/tax alerts
      const criticalNews = importantNews.filter(item => 
        (item.category === 'visa' || item.category === 'taxes') && 
        (item.impact === 'high' || item.isBreaking)
      );

      criticalNews.forEach(item => {
        toast({
          title: `🚨 ${item.category.toUpperCase()} Alert`,
          description: `${item.title} - ${item.country}`,
          variant: "destructive",
          duration: 8000
        });
      });

    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'visa': return 'bg-red-100 text-red-800 border-red-300';
      case 'taxes': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'travel': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!isVisible || countries.length === 0) {
    return null;
  }

  return (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isExpanded ? 'w-96' : 'w-16'
      }`}
      style={{ maxHeight: 'calc(100vh - 2rem)' }}
    >
      {!isExpanded ? (
        // Collapsed state - red news indicator
        <div 
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-3 shadow-large cursor-pointer animate-pulse"
          onClick={() => setIsExpanded(true)}
        >
          <div className="relative">
            <Newspaper className="w-6 h-6" />
            {news.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-card text-destructive rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-medium">
                {news.length}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Expanded state - full news display
        <Card className="bg-card shadow-2xl border-destructive/50 max-h-full overflow-hidden">
          <CardHeader className="bg-red-50 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-red-800 text-lg">
                <Newspaper className="w-5 h-5" />
                Breaking News
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                )}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8 p-0 hover:bg-red-100"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsVisible(false)}
                  className="h-8 w-8 p-0 hover:bg-red-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {news.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Newspaper className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No breaking news at the moment</p>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {news.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-lg border-l-4 ${
                      item.category === 'visa' ? 'border-l-red-500 bg-red-50' :
                      item.category === 'taxes' ? 'border-l-orange-500 bg-orange-50' :
                      'border-l-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {item.isBreaking && (
                            <Badge className="bg-destructive text-destructive-foreground text-xs animate-pulse">
                              BREAKING
                            </Badge>
                          )}
                          <Badge className={`text-xs border ${getCategoryColor(item.category)}`}>
                            {item.category.toUpperCase()}
                          </Badge>
                          {(item.category === 'visa' || item.category === 'taxes') && (
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                        <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {item.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="font-medium">{item.country}</span>
                          <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(item.url, '_blank')}
                        className="ml-2 h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewsLocker;
