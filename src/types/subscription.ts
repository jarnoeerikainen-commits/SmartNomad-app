
export interface Subscription {
  tier: 'free' | 'premium-lite' | 'premium' | 'diamond';
  isActive: boolean;
  expiryDate: string | null;
  features: string[];
  aiRequestsRemaining?: number;
  aiRequestsLimit?: number; // Lite: 100, Premium: 500, Diamond: 2000
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  description: string;
  userLimit?: string;
  yearlyPrice?: number; // For plans that offer yearly discounts
}

export interface PassportInfo {
  id: string;
  passportNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingCountry: string;
  holderName: string;
}
