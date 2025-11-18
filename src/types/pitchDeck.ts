export interface CoverData {
  company: string;
  tagline: string;
  logo: string;
  contact: {
    email: string;
    website: string;
  };
}

export interface ProblemData {
  title: string;
  points: string[];
  stats: { label: string; value: string }[];
}

export interface SolutionData {
  title: string;
  description: string;
  benefits: string[];
}

export interface MarketData {
  tam: number;
  sam: number;
  som: number;
  cagr: number;
  year: number;
}

export interface ProductFeature {
  title: string;
  description: string;
  icon: string;
}

export interface ProductData {
  features: ProductFeature[];
}

export interface RevenueStream {
  name: string;
  description: string;
  percentage: number;
}

export interface BusinessModelData {
  streams: RevenueStream[];
  pricing: {
    free: string[];
    pro: { price: number; features: string[] };
    business: { price: number; features: string[] };
  };
}

export interface TractionData {
  users: number;
  growth: number;
  mrr: number;
  engagement: string;
  retention: number;
}

export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
}

export interface CompetitionData {
  competitors: Competitor[];
  advantages: string[];
}

export interface GoToMarketData {
  channels: { name: string; description: string; cost: string }[];
  timeline: { quarter: string; milestone: string }[];
}

export interface FinancialAssumptions {
  userGrowthRate: number;
  conversionRate: number;
  arpu: number;
  cpa: number;
  infrastructureCosts: number;
  teamSize: number;
}

export interface YearlyProjection {
  year: number;
  users: number;
  revenue: number;
  costs: number;
  profit: number;
}

export interface FinancialsData {
  assumptions: FinancialAssumptions;
  projections: YearlyProjection[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  linkedin?: string;
}

export interface TeamData {
  members: TeamMember[];
}

export interface UseOfFunds {
  category: string;
  amount: number;
  percentage: number;
}

export interface Milestone {
  timeline: string;
  goal: string;
}

export interface AskData {
  amount: number;
  valuation: number;
  equity: number;
  useOfFunds: UseOfFunds[];
  milestones: Milestone[];
  exitStrategy: string[];
}

export interface PitchDeckData {
  cover: CoverData;
  problem: ProblemData;
  solution: SolutionData;
  market: MarketData;
  product: ProductData;
  businessModel: BusinessModelData;
  traction: TractionData;
  competition: CompetitionData;
  goToMarket: GoToMarketData;
  financials: FinancialsData;
  team: TeamData;
  ask: AskData;
}
