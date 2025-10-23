import { LocalNewsArticle, NewsCity, UserNewsPreferences } from "@/types/localNews";
import { newsCities } from "@/data/localNewsCities";

class LocalNewsService {
  private static instance: LocalNewsService;
  private newsCache: Map<string, { data: LocalNewsArticle[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  private constructor() {}

  static getInstance(): LocalNewsService {
    if (!LocalNewsService.instance) {
      LocalNewsService.instance = new LocalNewsService();
    }
    return LocalNewsService.instance;
  }

  async getCityNews(
    cityId: string,
    preferences: UserNewsPreferences
  ): Promise<LocalNewsArticle[]> {
    const cacheKey = `${cityId}-${JSON.stringify(preferences)}`;
    const cached = this.newsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Simulate API call with mock data
    const news = await this.fetchCityNews(cityId, preferences);
    this.newsCache.set(cacheKey, { data: news, timestamp: Date.now() });

    return news;
  }

  async getMultipleCitiesNews(
    cityIds: string[],
    preferences: UserNewsPreferences
  ): Promise<LocalNewsArticle[]> {
    const allNews = await Promise.all(
      cityIds.map(cityId => this.getCityNews(cityId, preferences))
    );

    // Combine and sort by relevance and recency
    return allNews
      .flat()
      .sort((a, b) => {
        const scoreA = this.calculateArticleScore(a, preferences);
        const scoreB = this.calculateArticleScore(b, preferences);
        return scoreB - scoreA;
      })
      .slice(0, preferences.deliveryFrequency);
  }

  private async fetchCityNews(
    cityId: string,
    preferences: UserNewsPreferences
  ): Promise<LocalNewsArticle[]> {
    const city = newsCities.find(c => c.id === cityId);
    if (!city) return [];

    // Generate mock news articles based on city and preferences
    return this.generateMockNews(city, preferences);
  }

  private generateMockNews(
    city: NewsCity,
    preferences: UserNewsPreferences
  ): LocalNewsArticle[] {
    const categories = Object.entries(preferences.interests)
      .filter(([_, score]) => score > 0.3)
      .map(([category]) => category);

    const mockArticles: LocalNewsArticle[] = [];
    const now = new Date();

    // Safety alert if enabled
    if (preferences.contentTypes.safetyAlerts) {
      mockArticles.push({
        id: `${city.id}-safety-1`,
        cityId: city.id,
        title: `${city.cityName} Safety Update: All Clear for Downtown Area`,
        summary: "Local authorities report improved safety conditions in central districts. Regular patrols continue.",
        contentUrl: `https://news.example.com/${city.id}/safety-1`,
        sourceName: city.newsSources.english[0] || city.newsSources.local[0],
        sourceUrl: `https://news.example.com/${city.id}`,
        publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        categories: ['safety'],
        sentimentScore: 0.7,
        relevanceScore: 0.95,
        language: preferences.languagePreference === 'local' ? city.primaryLanguage : 'en',
        locationSpecificity: 'city',
        safetyRelated: true,
        eventRelated: false,
        imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800'
      });
    }

    // Cultural events
    if (preferences.contentTypes.culturalEvents && categories.includes('culture')) {
      mockArticles.push({
        id: `${city.id}-culture-1`,
        cityId: city.id,
        title: `Weekend Festival Guide: Best Events in ${city.cityName}`,
        summary: "From art exhibitions to live music, discover the top cultural events happening this weekend.",
        contentUrl: `https://news.example.com/${city.id}/culture-1`,
        sourceName: city.newsSources.english[1] || city.newsSources.local[1],
        sourceUrl: `https://news.example.com/${city.id}`,
        publishedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
        categories: ['culture', 'events'],
        sentimentScore: 0.8,
        relevanceScore: 0.85,
        language: 'en',
        locationSpecificity: 'city',
        safetyRelated: false,
        eventRelated: true,
        imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'
      });
    }

    // Technology news
    if (categories.includes('technology')) {
      mockArticles.push({
        id: `${city.id}-tech-1`,
        cityId: city.id,
        title: `${city.cityName} Tech Scene: New Co-working Spaces Open Downtown`,
        summary: "Three new tech-focused co-working spaces launched this week, offering state-of-the-art facilities for digital nomads.",
        contentUrl: `https://news.example.com/${city.id}/tech-1`,
        sourceName: city.newsSources.international[0] || city.newsSources.local[0],
        sourceUrl: `https://news.example.com/${city.id}`,
        publishedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
        categories: ['technology', 'business'],
        sentimentScore: 0.6,
        relevanceScore: 0.8,
        language: 'en',
        locationSpecificity: 'city',
        safetyRelated: false,
        eventRelated: false,
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
      });
    }

    // Business news
    if (preferences.contentTypes.businessNews && categories.includes('business')) {
      mockArticles.push({
        id: `${city.id}-business-1`,
        cityId: city.id,
        title: `Economic Outlook: ${city.cityName} Attracts More International Investment`,
        summary: "Recent data shows a 15% increase in foreign direct investment, driven by tech sector growth.",
        contentUrl: `https://news.example.com/${city.id}/business-1`,
        sourceName: city.newsSources.international[1] || city.newsSources.local[1],
        sourceUrl: `https://news.example.com/${city.id}`,
        publishedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
        categories: ['business', 'politics'],
        sentimentScore: 0.5,
        relevanceScore: 0.7,
        language: 'en',
        locationSpecificity: 'national',
        safetyRelated: false,
        eventRelated: false,
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
      });
    }

    // Transportation
    if (categories.includes('transportation')) {
      mockArticles.push({
        id: `${city.id}-transport-1`,
        cityId: city.id,
        title: `Public Transport Update: New Metro Line Opening Next Month`,
        summary: "The expanded metro network will connect major districts, reducing commute times by up to 30%.",
        contentUrl: `https://news.example.com/${city.id}/transport-1`,
        sourceName: city.newsSources.local[0],
        sourceUrl: `https://news.example.com/${city.id}`,
        publishedAt: new Date(now.getTime() - 16 * 60 * 60 * 1000), // 16 hours ago
        categories: ['transportation'],
        sentimentScore: 0.7,
        relevanceScore: 0.75,
        language: preferences.languagePreference === 'english' ? 'en' : city.primaryLanguage,
        locationSpecificity: 'city',
        safetyRelated: false,
        eventRelated: false,
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'
      });
    }

    // Food & dining
    if (categories.includes('food')) {
      mockArticles.push({
        id: `${city.id}-food-1`,
        cityId: city.id,
        title: `Best New Restaurants: ${city.cityName}'s Hottest Dining Spots This Month`,
        summary: "From Michelin-starred fine dining to hidden local gems, explore the newest additions to the food scene.",
        contentUrl: `https://news.example.com/${city.id}/food-1`,
        sourceName: city.newsSources.english[0] || city.newsSources.local[0],
        sourceUrl: `https://news.example.com/${city.id}`,
        publishedAt: new Date(now.getTime() - 20 * 60 * 60 * 1000), // 20 hours ago
        categories: ['food', 'culture'],
        sentimentScore: 0.9,
        relevanceScore: 0.65,
        language: 'en',
        locationSpecificity: 'city',
        safetyRelated: false,
        eventRelated: false,
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'
      });
    }

    // Health update
    if (categories.includes('health')) {
      mockArticles.push({
        id: `${city.id}-health-1`,
        cityId: city.id,
        title: `Health Services Expanded: New Medical Facilities for Expats`,
        summary: "International-standard healthcare services now available with English-speaking staff and global insurance acceptance.",
        contentUrl: `https://news.example.com/${city.id}/health-1`,
        sourceName: city.newsSources.international[0] || city.newsSources.local[0],
        sourceUrl: `https://news.example.com/${city.id}`,
        publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        categories: ['health'],
        sentimentScore: 0.8,
        relevanceScore: 0.8,
        language: 'en',
        locationSpecificity: 'city',
        safetyRelated: false,
        eventRelated: false,
        imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800'
      });
    }

    // Filter by sentiment preference
    return mockArticles.filter(article => {
      if (preferences.sentimentFilter === 'all') return true;
      if (preferences.sentimentFilter === 'positive') return article.sentimentScore > 0.3;
      return true; // balanced
    });
  }

  private calculateArticleScore(
    article: LocalNewsArticle,
    preferences: UserNewsPreferences
  ): number {
    // Location relevance (30%)
    const locationScore = article.locationSpecificity === 'city' ? 1.0 : 0.7;

    // Interest match (40%)
    const interestScore = article.categories.reduce((score, category) => {
      return score + (preferences.interests[category as keyof typeof preferences.interests] || 0);
    }, 0) / article.categories.length;

    // Recency (20%)
    const hoursSincePublished = (Date.now() - article.publishedAt.getTime()) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 1 - (hoursSincePublished / 48)); // Decay over 48 hours

    // Source quality (10%)
    const sourceQuality = article.relevanceScore;

    return (
      locationScore * 0.3 +
      interestScore * 0.4 +
      recencyScore * 0.2 +
      sourceQuality * 0.1
    );
  }

  async getSafetyAlerts(cityIds: string[]): Promise<LocalNewsArticle[]> {
    const allAlerts: LocalNewsArticle[] = [];

    for (const cityId of cityIds) {
      const city = newsCities.find(c => c.id === cityId);
      if (!city || !city.safetyAlerts) continue;

      // Mock safety alerts
      if (Math.random() > 0.7) { // 30% chance of alert
        allAlerts.push({
          id: `${cityId}-alert-${Date.now()}`,
          cityId: cityId,
          title: `⚠️ Safety Alert: ${city.cityName}`,
          summary: "Minor protest activity reported in downtown area. Avoid main square until 6 PM.",
          contentUrl: `https://news.example.com/${cityId}/alert`,
          sourceName: "Local Authorities",
          sourceUrl: `https://news.example.com/${cityId}`,
          publishedAt: new Date(),
          categories: ['safety'],
          sentimentScore: -0.3,
          relevanceScore: 1.0,
          language: 'en',
          locationSpecificity: 'city',
          safetyRelated: true,
          eventRelated: false
        });
      }
    }

    return allAlerts;
  }
}

export default LocalNewsService;
