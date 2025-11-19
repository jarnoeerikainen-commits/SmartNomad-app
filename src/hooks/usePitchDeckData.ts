import { useState, useEffect } from 'react';
import { PitchDeckData } from '@/types/pitchDeck';

const STORAGE_KEY = 'supernomad-pitch-deck-data';

const defaultData: PitchDeckData = {
  cover: {
    company: 'SmartNomad',
    tagline: 'The Operating System for Global Citizens',
    logo: '/supernomad-logo-v2.png',
    contact: {
      email: 'invest@smartnomad.com',
      website: 'www.smartnomad.com',
    },
  },
  problem: {
    title: 'The Global Mobility Crisis',
    points: [
      'TAX NIGHTMARE: 183-day rule tracking across 195 countries, $15B in annual compliance penalties',
      'VISA FRAGMENTATION: 50+ digital nomad visa programs, complex renewals, impossible to track policy changes',
      'SECURITY VULNERABILITY: 68% of nomads experience cybercrime abroad, no centralized threat intelligence',
      'INFRASTRUCTURE GAPS: 10+ apps needed for basic operations, no integrated platform, fragmented local services',
    ],
    stats: [
      { label: 'Digital Nomads Face Chaos', value: '35M' },
      { label: 'Annual Compliance Penalties', value: '$15B' },
      { label: 'Hours/Year on Admin', value: '200+' },
    ],
  },
  solution: {
    title: 'The All-in-One Global Citizen OS',
    description: 'SmartNomad is the first complete operating system for global citizens, combining compliance automation, AI intelligence, and a curated service marketplace into one platform.',
    benefits: [
      'CORE COMPLIANCE ENGINE: Real-time tax residency tracking, automated visa management, military-grade document vault',
      'INTELLIGENCE LAYER: 4 specialized AI models, threat intelligence feed, location-based security alerts',
      'SERVICE MARKETPLACE: 100+ integrated providers, commission-based model, quality-vetted partners',
      'TECH SUPERIORITY: React 18 + TypeScript, 150+ components, cross-platform mobile, GDPR compliant',
    ],
  },
  market: {
    tam: 110000000000,
    sam: 110000000000,
    som: 15000000000,
    cagr: 35,
    year: 2025,
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
      { name: 'Premium Subscriptions', description: 'Explorer $9.99/mo, Nomad Pro $29.99/mo, Enterprise $99/employee/mo', percentage: 40 },
      { name: 'Marketplace Commissions', description: 'Travel (3-15%), Financial (1-2%), Insurance (15-20%), eSIM (10-15%)', percentage: 35 },
      { name: 'Enterprise Solutions', description: 'White-label platforms, API access, Data insights contracts', percentage: 20 },
      { name: 'Affiliate & Advertising', description: 'Premium placements, sponsored content, lead generation', percentage: 5 },
    ],
    pricing: {
      free: ['Basic visa tracking', '3 countries max', 'Community access'],
      pro: {
        price: 9.90,
        features: ['Unlimited countries', 'AI assistants', 'Tax compliance', 'Threat intelligence', 'Priority support'],
      },
      business: {
        price: 99,
        features: ['Enterprise features', 'API access', 'White-label options', 'Custom reports', 'Dedicated account manager'],
      },
    },
  },
  traction: {
    users: 150000,
    growth: 25,
    mrr: 0,
    engagement: '85% beta satisfaction',
    retention: 85,
  },
  competition: {
    competitors: [
      {
        name: 'TripIt',
        strengths: ['Itinerary management', 'Travel organization'],
        weaknesses: ['No compliance features', 'No tax tools', 'No AI intelligence', 'Travel-only focus'],
      },
      {
        name: 'NomadList (~$5M)',
        strengths: ['Community platform', 'City rankings', 'Social features'],
        weaknesses: ['No automation', 'Manual processes', 'No enterprise features', 'Community-only'],
      },
      {
        name: 'Remote.com',
        strengths: ['Payroll solutions', 'HR tools'],
        weaknesses: ['Payroll-only', 'No travel features', 'No compliance tracking', 'No AI'],
      },
      {
        name: 'QuickBooks',
        strengths: ['Accounting platform', 'Financial tools'],
        weaknesses: ['Accounting-only', 'No global mobility', 'No tax residency', 'No travel features'],
      },
    ],
    advantages: [
      'TECHNOLOGY LEADERSHIP: Only platform with real-time global compliance, AI-first architecture, 13-language coverage',
      'DATA NETWORK EFFECTS: More users = better compliance predictions, more service providers = better coverage',
      'SWITCHING COSTS: 5+ years of travel history & compliance data, deeply embedded workflows',
      'STRATEGIC POSITIONING: First-mover in $110B global citizen infrastructure, platform approach vs point solutions',
      'PROPRIETARY COMPLIANCE ENGINE: Multi-jurisdiction tax calculations, automated visa processing, predictive alerts',
      'Only complete Global Citizen OS in market',
    ],
  },
  goToMarket: {
    channels: [
      { name: 'Content Marketing (40%)', description: 'SEO dominance for "digital nomad tax", multi-language educational content, YouTube channel', cost: '$1.6M/year' },
      { name: 'Partnership Ecosystem (35%)', description: 'Co-working integrations, remote company partnerships, government digital nomad programs', cost: '$1.4M/year' },
      { name: 'Viral & Community (25%)', description: 'Referral program with rewards, community events & meetups, social proof testimonials', cost: '$1M/year' },
      { name: 'Enterprise Sales Motion', description: 'Land-and-expand with remote-first companies, government contracts, white-label solutions', cost: '$2M/year' },
    ],
    timeline: [
      { quarter: 'Q2 2025', milestone: 'Launch, 500K users, $5M ARR run rate' },
      { quarter: 'Q3 2025', milestone: '2M users, $30M ARR, 50 enterprise customers' },
      { quarter: 'Q1 2026', milestone: '5M users, $75M ARR, profitability' },
      { quarter: 'Q3 2026', milestone: '10M users, $150M ARR, Series B preparation' },
    ],
  },
  financials: {
    assumptions: {
      userGrowthRate: 200,
      conversionRate: 2.5,
      arpu: 45,
      cpa: 7.5,
      infrastructureCosts: 12000000,
      teamSize: 65,
    },
    projections: [
      { year: 2025, users: 500000, revenue: 5000000, costs: 12000000, profit: -7000000 },
      { year: 2026, users: 2000000, revenue: 30000000, costs: 25000000, profit: 5000000 },
      { year: 2027, users: 10000000, revenue: 150000000, costs: 60000000, profit: 90000000 },
    ],
  },
  team: {
    members: [
      {
        name: 'Jane Doe',
        role: 'CEO',
        bio: 'Former Product Lead at TravelTech Unicorn ($2B exit). 5+ years as digital nomad across 45 countries. Built products for 10M+ users.',
      },
      {
        name: 'John Smith',
        role: 'CTO',
        bio: 'Ex-Google AI/ML Engineering Lead. Scaled infrastructure for 50M+ users. 15+ patents in real-time data systems.',
      },
      {
        name: 'Alex Chen',
        role: 'CPO',
        bio: 'Founded & sold Remote Work SaaS ($15M acquisition). Deep domain expertise in future of work. 3 successful exits.',
      },
    ],
  },
  ask: {
    amount: 15000000,
    valuation: 75000000,
    equity: 20,
    useOfFunds: [
      { category: 'Engineering & Product', amount: 8000000, percentage: 53 },
      { category: 'Growth & Marketing', amount: 4000000, percentage: 27 },
      { category: 'Enterprise Sales', amount: 2000000, percentage: 13 },
      { category: 'Operations', amount: 1000000, percentage: 7 },
    ],
    milestones: [
      { timeline: 'Month 6', goal: 'Launch, 500K users, $5M ARR run rate' },
      { timeline: 'Month 12', goal: '2M users, $30M ARR, 50 enterprise customers' },
      { timeline: 'Month 18', goal: '5M users, $75M ARR, profitability' },
      { timeline: 'Month 24', goal: '10M users, $150M ARR, Series B preparation' },
    ],
    exitStrategy: [
      'VISION 2030: Platform for 100M+ global citizens, $1B+ ARR with 60%+ margins',
      'Strategic acquisition by travel platforms (Booking.com $100B+, Airbnb $80B+)',
      'HR tech unicorns (Remote.com, Deel) seeking compliance infrastructure',
      'Financial services (Wise $9B, Revolut $33B) expanding into global mobility',
      'Public company potential or $10B+ acquisition target',
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
