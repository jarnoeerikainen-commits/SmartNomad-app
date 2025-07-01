
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

  // News sources configuration
  private newsSources = {
    government: [
      'Immigration Dept', 'Tax Authority', 'Foreign Ministry', 'Tourism Board'
    ],
    international: [
      'Reuters', 'BBC News', 'CNN International', 'Associated Press'
    ],
    local: [
      'Local Times', 'National Herald', 'Daily Tribune', 'City Express'
    ]
  };

  static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  async getCountryNews(countryCodes: string[], languages: string[] = ['en']): Promise<NewsItem[]> {
    const cacheKey = `${countryCodes.join(',')}-${languages.join(',')}`;
    
    // Return cached data if available and recent (within 10 minutes)
    if (this.newsCache.has(cacheKey)) {
      return this.newsCache.get(cacheKey)!;
    }

    try {
      // Simulate fetching from multiple sources: government sites, international news, local papers
      const mockNews: NewsItem[] = await this.fetchFromMultipleSources(countryCodes);
      
      // Filter and prioritize by impact and breaking status
      const relevantNews = mockNews
        .filter(news => countryCodes.includes(news.country) || news.country === 'GLOBAL')
        .sort((a, b) => {
          // Prioritize breaking news and high impact
          if (a.isBreaking && !b.isBreaking) return -1;
          if (!a.isBreaking && b.isBreaking) return 1;
          if (a.impact === 'high' && b.impact !== 'high') return -1;
          if (a.impact !== 'high' && b.impact === 'high') return 1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });

      this.newsCache.set(cacheKey, relevantNews);
      
      // Clear cache after 10 minutes
      setTimeout(() => {
        this.newsCache.delete(cacheKey);
      }, 10 * 60 * 1000);

      return relevantNews;
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return [];
    }
  }

  private async fetchFromMultipleSources(countryCodes: string[]): Promise<NewsItem[]> {
    const now = new Date();
    const mockNews: NewsItem[] = [
      // Government/Official sources
      {
        id: 'gov-1',
        title: 'New Digital Nomad Visa Requirements - 90-Day Rule Changes',
        summary: 'Updated visa requirements for digital nomads across EU countries. New 90-day counting mechanism affects long-term stays.',
        source: 'EU Immigration Portal',
        country: 'DE',
        category: 'visa',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 3600000).toISOString(),
        url: 'https://ec.europa.eu/immigration',
        isBreaking: true
      },
      {
        id: 'gov-2',
        title: 'Thailand Tax Residency - 180 Day Rule Implementation',
        summary: 'Thailand implements new tax residency rules affecting foreign income taxation for stays exceeding 180 days.',
        source: 'Thailand Revenue Department',
        country: 'TH',
        category: 'tax',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 7200000).toISOString(),
        url: 'https://rd.go.th',
        isBreaking: false
      },
      
      // International news sources
      {
        id: 'intl-1',
        title: 'UK Post-Brexit Travel Changes for Digital Nomads',
        summary: 'Reuters reports on new UK travel requirements affecting digital nomads and remote workers from EU countries.',
        source: 'Reuters',
        country: 'GB',
        category: 'travel',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 10800000).toISOString(),
        url: 'https://reuters.com/travel-news',
        isBreaking: false
      },
      {
        id: 'intl-2',
        title: 'Singapore Eases Entry Requirements for Tech Workers',
        summary: 'BBC reports Singapore introduces new streamlined visa process for technology professionals and remote workers.',
        source: 'BBC News',
        country: 'SG',
        category: 'visa',
        impact: 'medium',
        publishedAt: new Date(now.getTime() - 14400000).toISOString(),
        url: 'https://bbc.com/singapore-visa',
        isBreaking: false
      },
      
      // Local newspaper sources
      {
        id: 'local-1',
        title: 'Portugal Golden Visa Program Changes Announced',
        summary: 'Local Portuguese media reports significant changes to Golden Visa investment requirements and processing times.',
        source: 'Jornal de Notícias',
        country: 'PT',
        category: 'visa',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 18000000).toISOString(),
        url: 'https://jn.pt/golden-visa',
        isBreaking: true
      },
      {
        id: 'local-2',
        title: 'Mexico Temporary Resident Visa Updates',
        summary: 'Mexican Immigration announces updated income requirements for temporary resident visas affecting nomads.',
        source: 'El Universal',
        country: 'MX',
        category: 'visa',
        impact: 'medium',
        publishedAt: new Date(now.getTime() - 21600000).toISOString(),
        url: 'https://eluniversal.com.mx/visa-news',
        isBreaking: false
      },
      
      // Additional high-impact news
      {
        id: 'global-1',
        title: 'International Tax Treaty Changes Affect Remote Workers',
        summary: 'New international tax agreements between 15 countries will impact how remote workers are taxed starting 2024.',
        source: 'OECD Tax Policy',
        country: 'GLOBAL',
        category: 'tax',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 25200000).toISOString(),
        url: 'https://oecd.org/tax-treaties',
        isBreaking: true
      },
      {
        id: 'travel-1',
        title: 'Schengen Area Travel Restrictions Lifted',
        summary: 'European Commission announces lifting of remaining COVID-related travel restrictions across Schengen area.',
        source: 'European Commission',
        country: 'GLOBAL',
        category: 'travel',
        impact: 'medium',
        publishedAt: new Date(now.getTime() - 28800000).toISOString(),
        url: 'https://ec.europa.eu/travel',
        isBreaking: false
      }
    ];

    return mockNews;
  }

  async getAlerts(countryCodes: string[]): Promise<NewsAlert[]> {
    try {
      const mockAlerts: NewsAlert[] = [
        {
          id: 'alert-visa-1',
          title: '🚨 Critical: Visa Requirements Changed',
          message: 'Urgent changes to biometric requirements for visa applications in Germany, France, and Italy effective immediately.',
          countries: ['DE', 'FR', 'IT'],
          type: 'visa_change',
          severity: 'critical',
          timestamp: new Date().toISOString()
        },
        {
          id: 'alert-tax-1',
          title: '⚠️ Tax Treaty Update Alert',
          message: 'Updated tax treaties between US and European countries may affect your tax obligations. Review your status.',
          countries: ['US', 'DE', 'NL', 'GB'],
          type: 'tax_change',
          severity: 'important',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'alert-travel-1',
          title: 'Travel Advisory: New Entry Requirements',
          message: 'Thailand introduces new health insurance requirements for tourists and long-term visitors.',
          countries: ['TH'],
          type: 'travel_warning',
          severity: 'important',
          timestamp: new Date(Date.now() - 7200000).toISOString()
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
    console.log(`Alert ${alertId} marked as read`);
  }
}

export default NewsService;
export type { NewsItem, NewsAlert };
