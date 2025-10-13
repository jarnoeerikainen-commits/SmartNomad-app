
export interface Subscription {
  tier: 'free' | 'student' | 'personal' | 'business-individual' | 'family' | 'business' | 'enterprise';
  isActive: boolean;
  expiryDate: string | null;
  features: string[];
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
