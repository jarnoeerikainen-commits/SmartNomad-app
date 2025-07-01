
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Newspaper, AlertTriangle, ExternalLink, RefreshCw, Bell, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewsService, { NewsItem, NewsAlert } from '@/services/NewsService';
import EmbassyService, { TravelAdvisory } from '@/services/EmbassyService';
import { Country } from '@/types/country';

interface NewsDashboardProps {
  countries: Country[];
  userProfile?: {
    languages: string[];
    followedEmbassies: string[];
  };
}

const NewsDashboard: React.FC<NewsDashboardProps> = ({ countries, userProfile }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [alerts, setAlerts] = useState<NewsAlert[]>([]);
  const [advisories, setAdvisories] = useState<TravelAdvisory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const { toast } = useToast();

  const newsService = NewsService.getInstance();
  const embassyService = EmbassyService.getInstance();

  useEffect(() => {
    loadNewsAndAlerts();
    // Set up auto-refresh every 30 minutes
    const interval = setInterval(loadNewsAndAlerts, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [countries, userProfile]);

  const loadNewsAndAlerts = async () => {
    if (countries.length === 0) return;

    setIsLoading(true);
    try {
      const countryCodes = countries.map(c => c.code);
      const languages = userProfile?.languages || ['en'];
      const embassyIds = userProfile?.followedEmbassies || [];

      // Load news, alerts, and travel advisories in parallel
      const [newsData, alertsData, advisoriesData] = await Promise.all([
        newsService.getCountryNews(countryCodes, languages),
        newsService.getAlerts(countryCodes),
        embassyIds.length > 0 
          ? embassyService.getTravelAdvisories(embassyIds, countries.map(c => c.name))
          : Promise.resolve([])
      ]);

      setNews(newsData.slice(0, 5)); // Top 5 most important news
      setAlerts(alertsData);
      setAdvisories(advisoriesData);
      setLastRefresh(new Date());

      // Show critical alerts as toasts
      alertsData.forEach(alert => {
        if (alert.severity === 'critical') {
          toast({
            title: alert.title,
            description: alert.message,
            variant: "destructive"
          });
        }
      });

    } catch (error) {
      console.error('Failed to load news and alerts:', error);
      toast({
        title: "News Loading Failed",
        description: "Unable to fetch latest news and alerts.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadNewsAndAlerts();
  };

  const handleAlertDismiss = async (alertId: string) => {
    await newsService.markAlertAsRead(alertId);
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'visa': return 'bg-blue-100 text-blue-800';
      case 'tax': return 'bg-green-100 text-green-800';
      case 'travel': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdvisoryColor = (level: string) => {
    switch (level) {
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (countries.length === 0) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-6 text-center">
          <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Add countries to track to see relevant news and alerts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(alert => (
            <Alert key={alert.id} className={`border-2 ${
              alert.severity === 'critical' ? 'border-red-300 bg-red-50' :
              alert.severity === 'important' ? 'border-orange-300 bg-orange-50' :
              'border-blue-300 bg-blue-50'
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-500">
                    Countries: {alert.countries.join(', ')} • {new Date(alert.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAlertDismiss(alert.id)}
                  className="ml-2"
                >
                  ×
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Travel Advisories */}
      {advisories.length > 0 && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-indigo-800 text-lg">
              <Globe className="w-5 h-5" />
              Embassy Travel Advisories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {advisories.map(advisory => (
              <div
                key={advisory.id}
                className={`p-3 rounded-lg border ${getAdvisoryColor(advisory.level)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{advisory.country}</h4>
                  <Badge variant="outline" className={`text-xs ${getAdvisoryColor(advisory.level)}`}>
                    {advisory.level.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm font-medium mb-1">{advisory.title}</p>
                <p className="text-xs">{advisory.summary}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {advisory.source} • Updated: {new Date(advisory.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main News Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Newspaper className="w-5 h-5" />
              Travel News & Updates
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastRefresh && (
                <p className="text-xs text-blue-600">
                  Updated: {lastRefresh.toLocaleTimeString()}
                </p>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="border-blue-300 text-blue-600 hover:bg-blue-100"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {news.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-blue-600">No recent news for your tracked countries</p>
              <p className="text-sm text-blue-500">We'll notify you when important updates are available</p>
            </div>
          ) : (
            news.map(item => (
              <div key={item.id} className="p-4 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.isBreaking && (
                        <Badge className="bg-red-500 text-white text-xs">BREAKING</Badge>
                      )}
                      <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                        {item.category.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs ${getImpactColor(item.impact)}`}>
                        {item.impact.toUpperCase()} IMPACT
                      </Badge>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.source} • {item.country}</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(item.url, '_blank')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
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

export default NewsDashboard;
