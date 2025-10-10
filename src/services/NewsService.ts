
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  country: string;
  category: 'laws' | 'taxes' | 'war' | 'weather_alerts' | 'strikes' | 'aviation' | 'business' | 'visa' | 'travel' | 'general';
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

  async getCountryNews(countryCodes: string[], languages: string[] = ['en'], categories: string[] = []): Promise<NewsItem[]> {
    const cacheKey = `${countryCodes.join(',')}-${languages.join(',')}-${categories.join(',')}`;
    
    // Return cached data if available and recent (within 10 minutes)
    if (this.newsCache.has(cacheKey)) {
      return this.newsCache.get(cacheKey)!;
    }

    try {
      // Simulate fetching from multiple sources: government sites, international news, local papers
      const mockNews: NewsItem[] = await this.fetchFromMultipleSources(countryCodes);
      
      // Filter by categories if specified
      let filteredNews = mockNews;
      if (categories.length > 0) {
        filteredNews = mockNews.filter(news => categories.includes(news.category));
      }
      
      // Filter and prioritize by impact and breaking status
      const relevantNews = filteredNews
        .filter(news => countryCodes.includes(news.country) || news.country === 'GLOBAL')
        .sort((a, b) => {
          // Prioritize breaking news and high impact
          if (a.isBreaking && !b.isBreaking) return -1;
          if (!a.isBreaking && b.isBreaking) return 1;
          if (a.impact === 'high' && b.impact !== 'high') return -1;
          if (a.impact !== 'high' && b.impact === 'high') return 1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        })
        .slice(0, 5); // Limit to 5 news daily

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
      // Laws
      {
        id: 'law-1',
        title: 'New Immigration Law Changes Visa Processing Times in Germany',
        summary: 'German parliament passes new immigration legislation affecting processing times for skilled worker visas and student permits.',
        source: 'German Federal Ministry',
        country: 'DE',
        category: 'laws',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 1800000).toISOString(),
        url: 'https://www.bamf.de/EN/Themen/Integration/integration_node.html',
        isBreaking: true
      },
      {
        id: 'law-2',
        title: 'Thailand Updates Foreigner Business Ownership Laws',
        summary: 'New regulations limit foreign ownership in certain business sectors, affecting digital nomads and expat entrepreneurs.',
        source: 'Thailand Ministry of Commerce',
        country: 'TH',
        category: 'laws',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 3600000).toISOString(),
        url: 'https://www.mfa.go.th/en',
        isBreaking: false
      },
      
      // Taxes
      {
        id: 'tax-1',
        title: 'Portugal Introduces New Tax Incentives for Digital Nomads',
        summary: 'Portugal announces D7 visa holders can benefit from reduced tax rates on foreign income for first five years.',
        source: 'Portuguese Tax Authority',
        country: 'PT',
        category: 'taxes',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 7200000).toISOString(),
        url: 'https://www.portaldascomunidades.mne.gov.pt/en/',
        isBreaking: true
      },
      {
        id: 'tax-2',
        title: 'UAE Introduces Corporate Tax for Foreign Companies',
        summary: 'UAE implements 9% corporate tax rate for multinational companies, affecting digital nomad business structures.',
        source: 'UAE Federal Tax Authority',
        country: 'AE',
        category: 'taxes',
        impact: 'medium',
        publishedAt: new Date(now.getTime() - 10800000).toISOString(),
        url: 'https://u.ae/en/information-and-services/finance-and-investment/taxation',
        isBreaking: false
      },
      
      // War/Conflicts
      {
        id: 'war-1',
        title: 'Travel Advisory: Eastern Europe Border Tensions',
        summary: 'Increased military activity near Ukraine-Belarus border affects travel routes and visa processing in neighboring countries.',
        source: 'International Crisis Group',
        country: 'GLOBAL',
        category: 'war',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 14400000).toISOString(),
        url: 'https://www.crisisgroup.org/',
        isBreaking: true
      },
      
      // Weather Alerts
      {
        id: 'weather-1',
        title: 'Severe Typhoon Warning Affects Philippines Travel',
        summary: 'Category 4 typhoon approaching Manila region. All flights cancelled, evacuation orders in coastal areas.',
        source: 'Philippine Weather Bureau',
        country: 'PH',
        category: 'weather_alerts',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 1800000).toISOString(),
        url: 'https://www.pagasa.dost.gov.ph/',
        isBreaking: true
      },
      {
        id: 'weather-2',
        title: 'Heat Wave Alert Issued for Southern Europe',
        summary: 'Extreme temperatures forecasted for Spain, Portugal, and southern France. Health advisories for tourists.',
        source: 'European Weather Service',
        country: 'GLOBAL',
        category: 'weather_alerts',
        impact: 'medium',
        publishedAt: new Date(now.getTime() - 7200000).toISOString(),
        url: 'https://www.ecmwf.int/',
        isBreaking: false
      },
      // Strikes
      {
        id: 'strike-1',
        title: 'Major Airport Strike Disrupts European Travel',
        summary: 'Air traffic controllers in France, Germany, and Italy announce coordinated 48-hour strike affecting international flights.',
        source: 'European Transport Workers Union',
        country: 'GLOBAL',
        category: 'strikes',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 3600000).toISOString(),
        url: 'https://www.etf-europe.org/',
        isBreaking: true
      },
      {
        id: 'strike-2',
        title: 'Rail Workers Strike Affects UK Travel Network',
        summary: 'National rail strike planned for next week will impact train services between major UK cities and airports.',
        source: 'UK Rail Workers Union',
        country: 'GB',
        category: 'strikes',
        impact: 'medium',
        publishedAt: new Date(now.getTime() - 10800000).toISOString(),
        url: 'https://www.rmt.org.uk/',
        isBreaking: false
      },
      
      // Aviation
      {
        id: 'aviation-1',
        title: 'New Flight Routes Connect Southeast Asia Hubs',
        summary: 'Budget airlines launch new direct routes between Bangkok, Ho Chi Minh City, and Manila, reducing travel costs for nomads.',
        source: 'Aviation Weekly Asia',
        country: 'GLOBAL',
        category: 'aviation',
        impact: 'medium',
        publishedAt: new Date(now.getTime() - 14400000).toISOString(),
        url: 'https://www.reuters.com/business/aerospace-defense/',
        isBreaking: false
      },
      {
        id: 'aviation-2',
        title: 'Airport Capacity Restrictions Affect Major Hubs',
        summary: 'London Heathrow and Frankfurt airports implement passenger caps due to staff shortages, causing flight delays.',
        source: 'Airport Industry News',
        country: 'GLOBAL',
        category: 'aviation',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 18000000).toISOString(),
        url: 'https://www.bbc.com/news/topics/c207p54m4lvt',
        isBreaking: false
      },
      
      // Business
      {
        id: 'business-1',
        title: 'Remote Work Visa Programs Drive Economic Growth',
        summary: 'Study shows digital nomad visa programs in Estonia, Portugal, and Barbados generate significant economic benefits.',
        source: 'Global Business Journal',
        country: 'GLOBAL',
        category: 'business',
        impact: 'medium',
        publishedAt: new Date(now.getTime() - 21600000).toISOString(),
        url: 'https://www.bbc.com/worklife/digital-nomads',
        isBreaking: false
      },
      {
        id: 'business-2',
        title: 'Cryptocurrency Regulations Impact Digital Nomad Banking',
        summary: 'New crypto regulations in EU countries affect digital nomads using cryptocurrency for international transactions.',
        source: 'Financial Times',
        country: 'GLOBAL',
        category: 'business',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 25200000).toISOString(),
        url: 'https://www.ft.com/',
        isBreaking: false
      },
      
      // Additional high-impact news
      {
        id: 'global-1',
        title: 'International Tax Treaty Changes Affect Remote Workers',
        summary: 'New international tax agreements between 15 countries will impact how remote workers are taxed starting 2024.',
        source: 'OECD Tax Policy',
        country: 'GLOBAL',
        category: 'taxes',
        impact: 'high',
        publishedAt: new Date(now.getTime() - 25200000).toISOString(),
        url: 'https://www.oecd.org/tax/',
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
        url: 'https://ec.europa.eu/home-affairs/index_en',
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
    
  }
}

export default NewsService;
export type { NewsItem, NewsAlert };
