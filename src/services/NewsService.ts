
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  country: string;
  category: 'visa' | 'tax' | 'travel' | 'general';
  impact: 'high' | 'medium' | 'low';
  publishedAt: string;
  url: string;
  isBreaking: boolean;
}

interface NewsAlert {
  id: string;
  title: string;
  message: string;
  countries: string[];
  type: 'visa_change' | 'tax_change' | 'travel_warning';
  severity: 'critical' | 'important' | 'info';
  timestamp: string;
}

class NewsService {
  private static instance: NewsService;
  private newsCache: Map<string, NewsItem[]> = new Map();
  private alertsCache: NewsAlert[] = [];

  static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  async getCountryNews(countryCodes: string[], languages: string[] = ['en']): Promise<NewsItem[]> {
    const cacheKey = `${countryCodes.join(',')}-${languages.join(',')}`;
    
    if (this.newsCache.has(cacheKey)) {
      return this.newsCache.get(cacheKey)!;
    }

    try {
      // Simulate AI-powered news collection
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'EU Digital Nomad Visa Changes Coming 2024',
          summary: 'New regulations for digital nomad visas across EU countries will take effect next year, affecting stay durations and tax obligations.',
          source: 'EU Immigration Portal',
          country: 'EU',
          category: 'visa',
          impact: 'high',
          publishedAt: new Date().toISOString(),
          url: 'https://example.com/news/1',
          isBreaking: true
        },
        {
          id: '2',
          title: 'Thailand Tax Residency Rules Updated',
          summary: 'Thailand introduces new 180-day tax residency rule for foreign income, affecting long-term visitors.',
          source: 'Thailand Revenue Department',
          country: 'TH',
          category: 'tax',
          impact: 'high',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          url: 'https://example.com/news/2',
          isBreaking: false
        },
        {
          id: '3',
          title: 'Singapore Travel Requirements Relaxed',
          summary: 'Singapore reduces vaccination requirements for tourists and business travelers.',
          source: 'Singapore Tourism Board',
          country: 'SG',
          category: 'travel',
          impact: 'medium',
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          url: 'https://example.com/news/3',
          isBreaking: false
        }
      ];

      // Filter news based on tracked countries
      const relevantNews = mockNews.filter(news => 
        countryCodes.includes(news.country) || news.country === 'EU'
      );

      this.newsCache.set(cacheKey, relevantNews);
      return relevantNews;
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return [];
    }
  }

  async getAlerts(countryCodes: string[]): Promise<NewsAlert[]> {
    try {
      const mockAlerts: NewsAlert[] = [
        {
          id: 'alert-1',
          title: 'Urgent: New Visa Requirements',
          message: 'Starting January 2024, new biometric requirements for visa applications in selected countries.',
          countries: ['DE', 'FR', 'IT'],
          type: 'visa_change',
          severity: 'critical',
          timestamp: new Date().toISOString()
        },
        {
          id: 'alert-2',
          title: 'Tax Treaty Changes',
          message: 'Updated tax treaties between US and several European countries may affect your tax obligations.',
          countries: ['US', 'DE', 'NL'],
          type: 'tax_change',
          severity: 'important',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      return mockAlerts.filter(alert => 
        alert.countries.some(country => countryCodes.includes(country))
      );
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      return [];
    }
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    // Implementation for marking alerts as read
    console.log(`Alert ${alertId} marked as read`);
  }
}

export default NewsService;
export type { NewsItem, NewsAlert };
