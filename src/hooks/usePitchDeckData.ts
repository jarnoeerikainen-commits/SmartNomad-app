import { useState, useEffect } from 'react';
import { PitchDeckData } from '@/types/pitchDeck';

const STORAGE_KEY = 'supernomad-pitch-deck-data';

const defaultData: PitchDeckData = {
  cover: {
    company: 'SuperNomad',
    tagline: 'Your Complete Travel Intelligence Platform',
    logo: '/supernomad-logo-v2.png',
    contact: {
      email: 'invest@supernomad.app',
      website: 'www.supernomad.app',
    },
  },
  problem: {
    title: 'Digital Nomads Face Overwhelming Complexity',
    points: [
      'Visa tracking across multiple countries is manual and error-prone',
      'Tax residency rules are complex and constantly changing',
      'Information is scattered across dozens of websites and apps',
      'Missing a deadline can result in overstays, fines, or tax penalties',
      'No single source of truth for compliance and travel planning',
    ],
    stats: [
      { label: 'Digital Nomads Globally', value: '35M+' },
      { label: 'Growing Annually', value: '23%' },
      { label: 'Average Countries/Year', value: '4-6' },
    ],
  },
  solution: {
    title: 'One Platform. Complete Intelligence. Zero Stress.',
    description: 'SuperNomad consolidates visa tracking, tax residency, travel planning, and location-based services into a single, AI-powered platform.',
    benefits: [
      'Automated visa tracking with smart alerts',
      'Tax residency calculator for multiple jurisdictions',
      'AI travel assistant for personalized recommendations',
      'Real-time travel day tracking and compliance',
      'Emergency services and local resources worldwide',
    ],
  },
  market: {
    tam: 52000000000,
    sam: 8400000000,
    som: 420000000,
    cagr: 16.5,
    year: 2024,
  },
  product: {
    features: [
      { title: 'Visa Tracking', description: 'Automated tracking of visa-free days across 195+ countries', icon: 'Passport' },
      { title: 'Tax Residency', description: 'Multi-jurisdiction tax calculator with real-time updates', icon: 'Calculator' },
      { title: 'AI Travel Assistant', description: 'Personalized recommendations powered by Lovable AI', icon: 'Bot' },
      { title: 'Travel Day Guardian', description: 'Automatic day counting with threshold alerts', icon: 'Calendar' },
      { title: 'Emergency Services', description: 'SOS, medical, legal services in 150+ countries', icon: 'AlertCircle' },
      { title: 'Global Services', description: 'Banking, eSIM, co-working, and local resources', icon: 'Globe' },
    ],
  },
  businessModel: {
    streams: [
      { name: 'Freemium Subscriptions', description: 'Pro and Business tier monthly subscriptions', percentage: 65 },
      { name: 'Affiliate Commissions', description: 'eSIM, insurance, banking, co-working partnerships', percentage: 25 },
      { name: 'Premium Services', description: 'Tax advisory, legal consultations, concierge', percentage: 10 },
    ],
    pricing: {
      free: ['Basic visa tracking', '3 countries max', 'Community access'],
      pro: {
        price: 12,
        features: ['Unlimited countries', 'Tax calculator', 'AI assistant', 'Priority support'],
      },
      business: {
        price: 49,
        features: ['Team management', 'API access', 'Custom reports', 'Dedicated account manager'],
      },
    },
  },
  traction: {
    users: 2500,
    growth: 45,
    mrr: 8500,
    engagement: '4.2 sessions/week',
    retention: 78,
  },
  competition: {
    competitors: [
      {
        name: 'Nomad List',
        strengths: ['Large community', 'City rankings'],
        weaknesses: ['No visa tracking', 'No tax tools', 'Static data'],
      },
      {
        name: 'TripIt',
        strengths: ['Trip organization', 'Calendar integration'],
        weaknesses: ['No compliance tracking', 'No tax features', 'Consumer focus'],
      },
      {
        name: 'Pebbles',
        strengths: ['Basic visa tracking'],
        weaknesses: ['Limited features', 'No AI', 'No services marketplace'],
      },
    ],
    advantages: [
      'Only platform combining visa + tax + AI + services',
      'Real-time compliance tracking vs. static information',
      'AI-powered personalization vs. generic recommendations',
      'Built for digital nomads, not tourists',
    ],
  },
  goToMarket: {
    channels: [
      { name: 'Content Marketing', description: 'SEO-optimized guides on visa and tax topics', cost: '$2K/month' },
      { name: 'Community Building', description: 'Digital nomad groups, forums, Discord', cost: '$1K/month' },
      { name: 'Influencer Partnerships', description: 'Travel YouTubers and bloggers', cost: '$3K/month' },
      { name: 'Paid Acquisition', description: 'Google, Facebook, Reddit ads', cost: '$5K/month' },
    ],
    timeline: [
      { quarter: 'Q2 2024', milestone: 'Launch freemium model, reach 5K users' },
      { quarter: 'Q3 2024', milestone: 'Add 10 service integrations, $25K MRR' },
      { quarter: 'Q4 2024', milestone: 'Expand to 15K users, $50K MRR' },
      { quarter: 'Q1 2025', milestone: 'Series A raise, team expansion' },
    ],
  },
  financials: {
    assumptions: {
      userGrowthRate: 35,
      conversionRate: 8,
      arpu: 18,
      cpa: 25,
      infrastructureCosts: 5000,
      teamSize: 5,
    },
    projections: [
      { year: 2024, users: 10000, revenue: 216000, costs: 180000, profit: 36000 },
      { year: 2025, users: 35000, revenue: 756000, costs: 420000, profit: 336000 },
      { year: 2026, users: 95000, revenue: 2052000, costs: 840000, profit: 1212000 },
    ],
  },
  team: {
    members: [
      {
        name: 'Founder & CEO',
        role: 'Product & Strategy',
        bio: '15 years building SaaS products, 8 years as digital nomad',
      },
      {
        name: 'CTO',
        role: 'Engineering',
        bio: 'Ex-Google, built compliance systems at scale',
      },
      {
        name: 'Head of Growth',
        role: 'Marketing & Sales',
        bio: 'Grew 2 startups to $10M ARR, nomad community leader',
      },
    ],
  },
  ask: {
    amount: 500000,
    valuation: 1500000,
    equity: 25,
    useOfFunds: [
      { category: 'Product Development', amount: 200000, percentage: 40 },
      { category: 'Marketing & Growth', amount: 150000, percentage: 30 },
      { category: 'Team Expansion', amount: 100000, percentage: 20 },
      { category: 'Operations & Legal', amount: 50000, percentage: 10 },
    ],
    milestones: [
      { timeline: '6 months', goal: 'Reach 25K users, $50K MRR' },
      { timeline: '12 months', goal: 'Hit $120K MRR, profitability' },
      { timeline: '18 months', goal: 'Series A ($3M at $12M valuation)' },
    ],
    exitStrategy: [
      'Strategic acquisition by travel platforms (Booking.com, Airbnb)',
      'HR tech companies (Remote.com, Deel) seeking compliance tools',
      'Financial services (Wise, Revolut) expanding nomad offerings',
      'Potential acquirers already in our partnership pipeline',
    ],
  },
};

export const usePitchDeckData = () => {
  const [data, setData] = useState<PitchDeckData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (section: keyof PitchDeckData, updates: any) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
  };

  const resetData = () => {
    setData(defaultData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { data, updateData, resetData };
};
