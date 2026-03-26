// Agentic Commerce — x402, Stripe Issuing, Visa TAP, Mastercard Cloud

export interface AgenticTransaction {
  id: string;
  timestamp: string;
  protocol: 'x402' | 'stripe-issuing' | 'visa-tap' | 'mastercard-cloud';
  description: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'authorized' | 'declined' | 'refunded';
  merchant?: string;
  category: 'micro-payment' | 'booking' | 'dining' | 'transport' | 'subscription' | 'data-query' | 'api-call';
  aiInitiated: boolean;
  userApproved: boolean;
  virtualCardLast4?: string;
  cryptoNetwork?: string;
  trustScore?: number; // 0-100 Visa TAP trust rating
}

export interface SpendingGuardrail {
  id: string;
  name: string;
  description: string;
  maxPerTransaction: number;
  maxDaily: number;
  maxWeekly: number;
  currency: string;
  allowedCategories: string[];
  blockedCategories: string[];
  requireApproval: boolean;
  approvalThreshold: number; // amount above which user must approve
  isActive: boolean;
}

export interface VirtualCard {
  id: string;
  last4: string;
  network: 'visa' | 'mastercard';
  type: 'single-use' | 'recurring' | 'merchant-locked';
  status: 'active' | 'used' | 'expired' | 'cancelled';
  amount: number;
  currency: string;
  merchant?: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
  createdBy: 'ai-agent' | 'user';
}

export interface AgenticWalletConfig {
  x402Enabled: boolean;
  stripeIssuingEnabled: boolean;
  visaTapEnabled: boolean;
  mastercardCloudEnabled: boolean;
  autoPayEnabled: boolean;
  maxAutoPayAmount: number;
  preferredCryptoNetwork: 'base' | 'solana' | 'ethereum';
  usdcBalance: number;
}

// Demo data
export const DEMO_WALLET_CONFIG: AgenticWalletConfig = {
  x402Enabled: true,
  stripeIssuingEnabled: true,
  visaTapEnabled: true,
  mastercardCloudEnabled: true,
  autoPayEnabled: true,
  maxAutoPayAmount: 100,
  preferredCryptoNetwork: 'base',
  usdcBalance: 2450.00,
};

export const DEMO_GUARDRAILS: SpendingGuardrail[] = [
  {
    id: 'gr-1',
    name: 'Travel Bookings',
    description: 'Hotels, flights, car rentals — AI can book up to $500 without asking',
    maxPerTransaction: 2000,
    maxDaily: 5000,
    maxWeekly: 15000,
    currency: 'USD',
    allowedCategories: ['booking', 'transport'],
    blockedCategories: [],
    requireApproval: true,
    approvalThreshold: 500,
    isActive: true,
  },
  {
    id: 'gr-2',
    name: 'Dining & Lifestyle',
    description: 'Restaurants, lounges, experiences — auto-approve under $150',
    maxPerTransaction: 500,
    maxDaily: 800,
    maxWeekly: 3000,
    currency: 'USD',
    allowedCategories: ['dining'],
    blockedCategories: [],
    requireApproval: true,
    approvalThreshold: 150,
    isActive: true,
  },
  {
    id: 'gr-3',
    name: 'Micro-Payments (x402)',
    description: 'API calls, data queries, AI-to-AI exchanges — fully autonomous',
    maxPerTransaction: 1,
    maxDaily: 25,
    maxWeekly: 100,
    currency: 'USD',
    allowedCategories: ['micro-payment', 'data-query', 'api-call'],
    blockedCategories: [],
    requireApproval: false,
    approvalThreshold: 1,
    isActive: true,
  },
  {
    id: 'gr-4',
    name: 'Subscriptions',
    description: 'SaaS tools, coworking, insurance — auto-approve under $100/mo',
    maxPerTransaction: 200,
    maxDaily: 500,
    maxWeekly: 1000,
    currency: 'USD',
    allowedCategories: ['subscription'],
    blockedCategories: [],
    requireApproval: true,
    approvalThreshold: 100,
    isActive: true,
  },
];

export const DEMO_VIRTUAL_CARDS: VirtualCard[] = [
  {
    id: 'vc-1',
    last4: '9201',
    network: 'visa',
    type: 'single-use',
    status: 'used',
    amount: 420,
    currency: 'USD',
    merchant: 'AirBnB Tokyo',
    createdAt: '2026-03-25T14:30:00Z',
    expiresAt: '2026-03-26T14:30:00Z',
    usedAt: '2026-03-25T14:32:00Z',
    createdBy: 'ai-agent',
  },
  {
    id: 'vc-2',
    last4: '4817',
    network: 'mastercard',
    type: 'merchant-locked',
    status: 'active',
    amount: 300,
    currency: 'USD',
    merchant: 'SevenRooms',
    createdAt: '2026-03-26T09:00:00Z',
    expiresAt: '2026-03-27T09:00:00Z',
    createdBy: 'ai-agent',
  },
  {
    id: 'vc-3',
    last4: '3356',
    network: 'visa',
    type: 'recurring',
    status: 'active',
    amount: 85,
    currency: 'USD',
    merchant: 'Coworking Hub Bali',
    createdAt: '2026-03-01T00:00:00Z',
    expiresAt: '2026-04-01T00:00:00Z',
    createdBy: 'user',
  },
  {
    id: 'vc-4',
    last4: '7742',
    network: 'visa',
    type: 'single-use',
    status: 'expired',
    amount: 14.99,
    currency: 'USD',
    merchant: 'Spotify',
    createdAt: '2026-03-20T10:00:00Z',
    expiresAt: '2026-03-21T10:00:00Z',
    usedAt: '2026-03-20T10:01:00Z',
    createdBy: 'ai-agent',
  },
];

export const DEMO_AGENTIC_TRANSACTIONS: AgenticTransaction[] = [
  {
    id: 'atx-1',
    timestamp: '2026-03-26T10:15:00Z',
    protocol: 'x402',
    description: 'VIP Availability check — Sukiyabashi Jiro, Tokyo',
    amount: 0.05,
    currency: 'USDC',
    status: 'completed',
    merchant: 'SevenRooms API',
    category: 'data-query',
    aiInitiated: true,
    userApproved: false,
    cryptoNetwork: 'Base',
  },
  {
    id: 'atx-2',
    timestamp: '2026-03-26T10:16:00Z',
    protocol: 'stripe-issuing',
    description: 'Dinner reservation — Sukiyabashi Jiro',
    amount: 300,
    currency: 'USD',
    status: 'authorized',
    merchant: 'SevenRooms',
    category: 'dining',
    aiInitiated: true,
    userApproved: true,
    virtualCardLast4: '4817',
    trustScore: 97,
  },
  {
    id: 'atx-3',
    timestamp: '2026-03-25T14:30:00Z',
    protocol: 'visa-tap',
    description: 'AirBnB Shibuya — 3 nights',
    amount: 420,
    currency: 'USD',
    status: 'completed',
    merchant: 'AirBnB',
    category: 'booking',
    aiInitiated: true,
    userApproved: true,
    virtualCardLast4: '9201',
    trustScore: 99,
  },
  {
    id: 'atx-4',
    timestamp: '2026-03-25T08:00:00Z',
    protocol: 'x402',
    description: 'Premium weather data — 7-day Tokyo forecast',
    amount: 0.02,
    currency: 'USDC',
    status: 'completed',
    merchant: 'WeatherPro API',
    category: 'api-call',
    aiInitiated: true,
    userApproved: false,
    cryptoNetwork: 'Base',
  },
  {
    id: 'atx-5',
    timestamp: '2026-03-24T16:45:00Z',
    protocol: 'mastercard-cloud',
    description: 'Private airport transfer — NRT to Shibuya',
    amount: 95,
    currency: 'USD',
    status: 'completed',
    merchant: 'Blacklane',
    category: 'transport',
    aiInitiated: true,
    userApproved: true,
    virtualCardLast4: '3356',
    trustScore: 95,
  },
  {
    id: 'atx-6',
    timestamp: '2026-03-24T09:00:00Z',
    protocol: 'x402',
    description: 'Hidden gem restaurant data — Shinjuku district',
    amount: 0.08,
    currency: 'USDC',
    status: 'completed',
    merchant: 'LocalGuide API',
    category: 'data-query',
    aiInitiated: true,
    userApproved: false,
    cryptoNetwork: 'Solana',
  },
  {
    id: 'atx-7',
    timestamp: '2026-03-23T20:00:00Z',
    protocol: 'stripe-issuing',
    description: 'Coworking day pass — WeWork Roppongi',
    amount: 45,
    currency: 'USD',
    status: 'completed',
    merchant: 'WeWork',
    category: 'subscription',
    aiInitiated: false,
    userApproved: true,
    virtualCardLast4: '7742',
  },
  {
    id: 'atx-8',
    timestamp: '2026-03-23T12:00:00Z',
    protocol: 'x402',
    description: 'Real-time flight price scan — TYO→BKK',
    amount: 0.03,
    currency: 'USDC',
    status: 'completed',
    merchant: 'FlightAPI',
    category: 'api-call',
    aiInitiated: true,
    userApproved: false,
    cryptoNetwork: 'Base',
  },
  {
    id: 'atx-9',
    timestamp: '2026-03-22T18:30:00Z',
    protocol: 'visa-tap',
    description: 'Omakase dinner — Sushi Saito',
    amount: 250,
    currency: 'USD',
    status: 'completed',
    merchant: 'Sushi Saito',
    category: 'dining',
    aiInitiated: true,
    userApproved: true,
    trustScore: 98,
  },
  {
    id: 'atx-10',
    timestamp: '2026-03-22T10:00:00Z',
    protocol: 'mastercard-cloud',
    description: 'JR Rail Pass — 7 days',
    amount: 320,
    currency: 'USD',
    status: 'completed',
    merchant: 'JR East',
    category: 'transport',
    aiInitiated: true,
    userApproved: true,
    trustScore: 96,
  },
];

export const PROTOCOL_INFO = {
  'x402': {
    name: 'x402 Protocol',
    icon: '⚡',
    color: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/30',
    borderClass: 'border-amber-200 dark:border-amber-800',
    description: 'Machine-to-machine microtransactions via HTTP 402. Powered by Coinbase CDP on Base/Solana.',
    bestFor: 'API calls, data queries, AI-to-AI exchanges ($0.01–$1.00)',
    provider: 'Coinbase Developer Platform',
    settlement: 'USDC on Base or Solana',
  },
  'stripe-issuing': {
    name: 'Stripe Issuing',
    icon: '💳',
    color: 'text-violet-600 dark:text-violet-400',
    bgClass: 'bg-violet-50 dark:bg-violet-950/30',
    borderClass: 'border-violet-200 dark:border-violet-800',
    description: 'Generate single-use virtual Visa/Mastercard numbers for secure AI-led bookings.',
    bestFor: 'Hotel, flight, car rental bookings with exact-amount cards',
    provider: 'Stripe Machine Payment Protocol (MPP)',
    settlement: 'Traditional card networks',
  },
  'visa-tap': {
    name: 'Visa Trust Agent Protocol',
    icon: '🛡️',
    color: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
    borderClass: 'border-blue-200 dark:border-blue-800',
    description: 'Cryptographic proof of authorization. Banks recognize AI as a "Trusted Agent" — zero fraud declines.',
    bestFor: 'Global merchant acceptance, physical venues, high-value bookings',
    provider: 'Visa MPP SDK',
    settlement: 'Visa network with TAP verification',
  },
  'mastercard-cloud': {
    name: 'Mastercard Merchant Cloud',
    icon: '🔶',
    color: 'text-orange-600 dark:text-orange-400',
    bgClass: 'bg-orange-50 dark:bg-orange-950/30',
    borderClass: 'border-orange-200 dark:border-orange-800',
    description: 'Predictive Spending Controls — program cards with category-level rules based on user profile.',
    bestFor: 'Restaurants, lounges, car rentals — category-aware authorization',
    provider: 'Mastercard Merchant Cloud API',
    settlement: 'Mastercard network with predictive controls',
  },
} as const;
