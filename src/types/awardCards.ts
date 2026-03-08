export type AwardCategory = 'airline' | 'hotel' | 'credit-card' | 'booking' | 'car-rental' | 'cruise' | 'rail' | 'coalition' | 'retail';

export type CardStatus = 'active' | 'expiring-soon' | 'expired' | 'inactive';

export interface AwardProgram {
  id: string;
  name: string;
  category: AwardCategory;
  alliance?: string; // Oneworld, Star Alliance, SkyTeam
  description: string;
  url: string;
  tiers: string[];
  transferPartners?: string[];
  pointsCurrency: string;
  valuePerPoint?: number; // cents per point
}

export interface UserAwardCard {
  id: string;
  programId: string;
  programName: string;
  category: AwardCategory;
  memberNumber?: string;
  currentTier?: string;
  pointsBalance: number;
  pointsCurrency: string;
  expiryDate?: string;
  status: CardStatus;
  addedAt: string;
  lastUpdated: string;
  notes?: string;
  cardImage?: string; // base64 or URL
}

export interface AwardCardSummary {
  totalPrograms: number;
  totalPoints: number;
  estimatedValue: number; // USD
  expiringWithin90Days: number;
  byCategory: Record<AwardCategory, number>;
}
