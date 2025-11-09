/**
 * SuperNomad Trust AI - Filtering & Ranking Service
 * Ensures only verified, high-quality services, offers, and events are displayed
 */

export interface TrustItem {
  service_name: string;
  rating: number;
  verified: boolean;
  category: string;
  source: string;
  trust_score: number;
  reviews: number;
  summary: string;
  badges: TrustBadge[];
  description?: string;
  price?: string;
  url?: string;
  features?: string[];
  discount?: string;
  location?: string;
  [key: string]: any;
}

export type TrustBadge = 'Top Rated' | 'Verified Local' | 'Traveler Favorite' | 'Nomad Favorite' | 'Local Gem' | 'Sustainable' | 'Ethical';

export interface TrustFilterOptions {
  minRating?: number;
  requireVerified?: boolean;
  preferLocal?: boolean;
  includeRecent?: boolean;
}

const TRUSTED_SOURCES = [
  'Google',
  'TripAdvisor',
  'Booking.com',
  'Eventbrite',
  'SuperNomad',
  'Yelp',
  'Airbnb',
  'GetYourGuide',
  'SafetyWing',
  'World Nomads',
  'Airalo',
  'Holafly'
];

export class TrustFilterService {
  /**
   * Filter items by trust criteria
   * Only items with rating >= 4.0 and verified status pass
   */
  static filter(items: TrustItem[], options: TrustFilterOptions = {}): TrustItem[] {
    const {
      minRating = 4.0,
      requireVerified = true,
      preferLocal = true,
      includeRecent = true
    } = options;

    return items.filter(item => {
      // Must have verified reviews
      if (requireVerified && !item.verified) return false;

      // Must meet minimum rating threshold
      if (item.rating < minRating) return false;

      // Source must be trusted
      if (!this.isSourceTrusted(item.source)) return false;

      // Must have at least some reviews (no fake listings)
      if (item.reviews < 1) return false;

      return true;
    });
  }

  /**
   * Rank items by quality and trust score
   */
  static rank(items: TrustItem[]): TrustItem[] {
    return items.sort((a, b) => {
      // Calculate composite ranking score
      const scoreA = this.calculateRankingScore(a);
      const scoreB = this.calculateRankingScore(b);
      return scoreB - scoreA;
    });
  }

  /**
   * Calculate comprehensive ranking score
   */
  private static calculateRankingScore(item: TrustItem): number {
    let score = 0;

    // Rating weight (0-50 points)
    score += (item.rating / 5.0) * 50;

    // Review count weight (0-20 points)
    const reviewScore = Math.min(item.reviews / 50, 1) * 20;
    score += reviewScore;

    // Trust score weight (0-20 points)
    score += (item.trust_score / 100) * 20;

    // Badge bonuses (0-10 points)
    if (item.badges.includes('Top Rated')) score += 5;
    if (item.badges.includes('Nomad Favorite')) score += 4;
    if (item.badges.includes('Verified Local')) score += 3;
    if (item.badges.includes('Sustainable') || item.badges.includes('Ethical')) score += 2;

    return score;
  }

  /**
   * Assign trust badges based on criteria
   */
  static assignBadges(item: TrustItem): TrustBadge[] {
    const badges: TrustBadge[] = [];

    // Top Rated: 4.6-5.0★ with 50+ reviews
    if (item.rating >= 4.6 && item.reviews >= 50) {
      badges.push('Top Rated');
    }

    // Nomad Favorite: 4.7★+ with 50+ reviews
    if (item.rating >= 4.7 && item.reviews >= 50) {
      badges.push('Nomad Favorite');
    }

    // Verified Local: 4.0-4.5★ from local providers
    if (item.rating >= 4.0 && item.rating < 4.6 && this.isLocalProvider(item)) {
      badges.push('Verified Local');
    }

    // Local Gem: High rating local provider
    if (item.rating >= 4.5 && this.isLocalProvider(item)) {
      badges.push('Local Gem');
    }

    // Traveler Favorite: Alternative name for Nomad Favorite
    if (item.rating >= 4.7 && item.reviews >= 30) {
      badges.push('Traveler Favorite');
    }

    // Sustainable/Ethical (would be marked in data)
    if (item.category?.includes('sustainable') || item.category?.includes('ethical')) {
      badges.push('Sustainable');
    }

    return badges;
  }

  /**
   * Calculate trust score (0-100)
   */
  static calculateTrustScore(item: Partial<TrustItem>): number {
    let score = 0;

    // Rating contribution (40 points max)
    if (item.rating) {
      score += (item.rating / 5.0) * 40;
    }

    // Review count contribution (30 points max)
    if (item.reviews) {
      score += Math.min((item.reviews / 100) * 30, 30);
    }

    // Verification status (20 points max)
    if (item.verified) {
      score += 20;
    }

    // Source trust (10 points max)
    if (item.source && this.isSourceTrusted(item.source)) {
      score += 10;
    }

    return Math.min(Math.round(score), 100);
  }

  /**
   * Check if source is trusted
   */
  static isSourceTrusted(source: string): boolean {
    return TRUSTED_SOURCES.some(trusted => 
      source.toLowerCase().includes(trusted.toLowerCase())
    );
  }

  /**
   * Check if provider is local (not a global chain)
   */
  private static isLocalProvider(item: TrustItem): boolean {
    const globalChains = [
      'marriott', 'hilton', 'hyatt', 'ibis', 'novotel',
      'mcdonalds', 'starbucks', 'subway', 'kfc',
      'uber', 'lyft', 'hertz', 'avis'
    ];

    const name = item.service_name.toLowerCase();
    return !globalChains.some(chain => name.includes(chain));
  }

  /**
   * Remove duplicates based on service name and location
   */
  static removeDuplicates(items: TrustItem[]): TrustItem[] {
    const seen = new Map<string, TrustItem>();

    items.forEach(item => {
      const key = `${item.service_name}-${item.location || item.category}`.toLowerCase();
      const existing = seen.get(key);

      if (!existing || item.trust_score > existing.trust_score) {
        seen.set(key, item);
      }
    });

    return Array.from(seen.values());
  }

  /**
   * Format summary with friendly tone and emojis
   */
  static formatSummary(item: TrustItem): string {
    const emoji = this.getCategoryEmoji(item.category);
    const qualityWord = item.rating >= 4.7 ? 'amazing' : item.rating >= 4.5 ? 'excellent' : 'great';
    
    let summary = `${emoji} ${item.summary || item.description || ''}`;
    
    if (item.reviews > 50) {
      summary += ` Loved by ${item.reviews}+ travelers!`;
    }

    return summary.trim();
  }

  /**
   * Get friendly emoji for category
   */
  static getCategoryEmoji(category: string): string {
    const emojiMap: Record<string, string> = {
      'food': '🍽️',
      'restaurant': '🍴',
      'cafe': '☕',
      'hotel': '🏨',
      'insurance': '🛡️',
      'transport': '🚗',
      'taxi': '🚕',
      'coworking': '💻',
      'tour': '🗺️',
      'activity': '🎯',
      'cultural': '🎭',
      'nightlife': '🌙',
      'wellness': '🧘',
      'sports': '⚽',
      'market': '🛒',
      'shopping': '🛍️',
      'tech': '💡',
      'business': '💼',
      'default': '✨'
    };

    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (category.toLowerCase().includes(key)) {
        return emoji;
      }
    }

    return emojiMap.default;
  }

  /**
   * Process and prepare items for display
   * Main entry point for the Trust AI
   */
  static processForDisplay(
    rawItems: Partial<TrustItem>[],
    options: TrustFilterOptions = {}
  ): TrustItem[] {
    // Convert to full TrustItem format
    const items: TrustItem[] = rawItems.map(item => ({
      service_name: item.service_name || 'Unknown',
      rating: item.rating || 0,
      verified: item.verified || false,
      category: item.category || 'general',
      source: item.source || 'Unknown',
      trust_score: item.trust_score || this.calculateTrustScore(item),
      reviews: item.reviews || 0,
      summary: item.summary || item.description || '',
      badges: item.badges || [],
      ...item
    }));

    // Step 1: Filter by trust criteria
    const filtered = this.filter(items, options);

    // Step 2: Remove duplicates
    const unique = this.removeDuplicates(filtered);

    // Step 3: Assign badges
    const withBadges = unique.map(item => ({
      ...item,
      badges: this.assignBadges(item),
      summary: this.formatSummary(item)
    }));

    // Step 4: Rank by quality
    const ranked = this.rank(withBadges);

    return ranked;
  }
}
