import { useState, useEffect } from 'react';
import { PitchDeckData } from '@/types/pitchDeck';

const STORAGE_KEY = 'supernomad-pitch-deck-data';

const defaultData: PitchDeckData = {
  cover: {
    company: 'SmartNomad',
    tagline: 'The World\'s First 13-Language Global Travel Intelligence Platform',
    logo: '/supernomad-logo-v2.png',
    contact: {
      email: 'invest@smartnomad.app',
      website: 'www.smartnomad.app',
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
    tam: 10000000000,
    sam: 2000000000,
    som: 261000000,
    cagr: 23,
    year: 2026,
  },
  product: {
    features: [
      { title: '13-Language Coverage', description: 'Global reach: English, Mandarin, Hindi, Spanish, French, Arabic, Russian, Portuguese, German, Japanese, Korean, Italian, Turkish', icon: 'Globe' },
      { title: 'Visa Tracking', description: 'Automated tracking of visa-free days across 195+ countries with 183-day rule compliance', icon: 'Passport' },
      { title: 'Tax Residency AI', description: 'Multi-jurisdiction tax calculator with real-time updates and GDPR compliance', icon: 'Calculator' },
      { title: '4 AI Assistants', description: 'Travel Planner, Doctor, Lawyer, and General Assistant - all AI-powered', icon: 'Bot' },
      { title: 'Travel Day Guardian', description: 'Automatic day counting with smart threshold alerts and compliance tracking', icon: 'Calendar' },
      { title: 'All-in-One Platform', description: 'Banking, eSIM, insurance, co-working, emergency services in one integrated app', icon: 'Sparkles' },
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
        name: 'NomadList (~$5M)',
        strengths: ['Large community', 'City rankings'],
        weaknesses: ['No visa tracking', 'No tax tools', 'English only', 'No AI'],
      },
      {
        name: 'SafetyWing ($50M+)',
        strengths: ['Insurance focus', 'Brand recognition'],
        weaknesses: ['Single service', 'No compliance', 'No tax features'],
      },
      {
        name: 'TaxScouts (£15M)',
        strengths: ['Tax expertise'],
        weaknesses: ['UK-only', 'No travel features', 'No automation'],
      },
    ],
    advantages: [
      'ONLY all-in-one solution (visa + tax + AI + services)',
      '13-language coverage vs. competitors\' 1-3 languages',
      '4 specialized AI assistants vs. none',
      'Tax residency automation (unique in market)',
      'Full GDPR compliance framework from day one',
      'Working product with 58,000 lines of production code',
    ],
  },
  goToMarket: {
    channels: [
      { name: 'Multi-Language SEO', description: '13-language content for "183 day rule", "tax residency" in all markets', cost: '$15K/month' },
      { name: 'Regional Partnerships', description: 'Travel companies, fintech apps, remote work platforms', cost: '$10K/month' },
      { name: 'Community Building', description: 'Digital nomad groups globally, multi-language forums', cost: '$5K/month' },
      { name: 'Paid Acquisition', description: 'Google, Facebook, WeChat, Line ads by region', cost: '$20K/month' },
    ],
    timeline: [
      { quarter: 'Q2 2026', milestone: 'Public launch - 3 languages, 500K users, $5M ARR' },
      { quarter: 'Q4 2026', milestone: '8 languages live, 2M users, $50M ARR run rate' },
      { quarter: 'Q2 2027', milestone: 'All 13 languages, 5M users, $150M ARR' },
      { quarter: 'Q4 2027', milestone: '10M users, $261M ARR, Series A at $2B+ valuation' },
    ],
  },
  financials: {
    assumptions: {
      userGrowthRate: 150,
      conversionRate: 1.5,
      arpu: 79,
      cpa: 5,
      infrastructureCosts: 24000000,
      teamSize: 200,
    },
    projections: [
      { year: 2026, users: 500000, revenue: 5000000, costs: 8000000, profit: -3000000 },
      { year: 2027, users: 5000000, revenue: 150000000, costs: 70000000, profit: 80000000 },
      { year: 2028, users: 10000000, revenue: 261850000, costs: 104000000, profit: 157850000 },
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
    amount: 650000,
    valuation: 1100000,
    equity: 37,
    useOfFunds: [
      { category: 'User Acquisition', amount: 300000, percentage: 46 },
      { category: 'Mobile App Launch', amount: 200000, percentage: 31 },
      { category: 'Team Expansion', amount: 100000, percentage: 15 },
      { category: 'Contingency & Legal', amount: 50000, percentage: 8 },
    ],
    milestones: [
      { timeline: 'Q2 2026', goal: 'Public launch, 500K users, $5M ARR' },
      { timeline: 'Q4 2026', goal: '2M users, $50M ARR run rate' },
      { timeline: 'Q2 2027', goal: '5M users, $150M ARR, profitability' },
      { timeline: 'Q4 2027', goal: 'Series A ($20M at $2B+ valuation)' },
    ],
    exitStrategy: [
      'Strategic acquisition by travel platforms (Booking.com valued at $100B+, Airbnb at $80B+)',
      'HR tech unicorns (Remote.com, Deel) seeking compliance tools',
      'Financial services (Wise $9B, Revolut $33B) expanding nomad offerings',
      'Data value at 5M users: $184M (hidden asset multiplier)',
      'Multiple acquirers already in partnership pipeline',
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
