/**
 * Intent-Based Tool Discovery Engine
 * Maps natural language user intents to features using semantic keyword matching,
 * synonym expansion, and contextual scoring. Inspired by Composio's tool router.
 */

import { FEATURE_REGISTRY, FeatureItem, CATEGORY_LABELS } from '@/data/featureRegistry';

// Semantic intent map: maps user intents/phrases to feature IDs with confidence
interface IntentMapping {
  keywords: string[];
  synonyms: string[];
  contextTriggers: string[]; // phrases that strongly indicate this intent
  featureId: string;
  category: string;
}

// Comprehensive intent mappings for all features
const INTENT_MAPPINGS: IntentMapping[] = [
  // TAX & COMPLIANCE
  {
    featureId: 'tax-residency',
    category: 'tax',
    keywords: ['tax', 'days', 'country', 'track', 'residency', 'counting', '183', 'threshold'],
    synonyms: ['how many days', 'time spent', 'stay duration', 'residence'],
    contextTriggers: ['how many days in', 'am I tax resident', 'days remaining', 'overstay risk'],
  },
  {
    featureId: 'visas',
    category: 'tax',
    keywords: ['visa', 'permit', 'entry', 'authorization', 'immigration', 'border'],
    synonyms: ['travel permit', 'entry clearance', 'work permit', 'digital nomad visa'],
    contextTriggers: ['do I need a visa', 'visa application', 'visa expiring', 'extend my visa'],
  },
  {
    featureId: 'etias',
    category: 'tax',
    keywords: ['etias', 'europe', 'eu', 'schengen', 'authorization'],
    synonyms: ['european travel', 'eu entry', 'schengen zone'],
    contextTriggers: ['travel to europe', 'etias application', 'schengen days'],
  },
  {
    featureId: 'vaccination-hub',
    category: 'tax',
    keywords: ['vaccine', 'vaccination', 'medicine', 'health', 'immunization', 'yellow fever'],
    synonyms: ['jab', 'shot', 'immunisation', 'health requirement'],
    contextTriggers: ['do I need vaccines', 'health requirements for', 'malaria pills'],
  },
  {
    featureId: 'vault',
    category: 'tax',
    keywords: ['document', 'passport', 'scan', 'store', 'vault', 'certificate'],
    synonyms: ['papers', 'ID', 'identification', 'credentials'],
    contextTriggers: ['store my passport', 'save document', 'keep a copy', 'document safe'],
  },
  {
    featureId: 'tax-wealthy',
    category: 'tax',
    keywords: ['wealth', 'tax planning', 'optimization', 'advisor', 'offshore', 'structure'],
    synonyms: ['tax help', 'tax advice', 'financial planning', 'wealth management'],
    contextTriggers: ['minimize taxes', 'tax efficient', 'wealth strategy', 'tax advisor'],
  },

  // FINANCE
  {
    featureId: 'payment-options',
    category: 'finance',
    keywords: ['pay', 'payment', 'wallet', 'card', 'checkout', 'purchase'],
    synonyms: ['buy', 'transaction', 'billing', 'charge'],
    contextTriggers: ['add payment method', 'pay for', 'my wallet', 'payment settings'],
  },
  {
    featureId: 'currency-converter',
    category: 'finance',
    keywords: ['currency', 'exchange', 'convert', 'rate', 'forex'],
    synonyms: ['money exchange', 'conversion rate', 'how much is'],
    contextTriggers: ['convert dollars to', 'exchange rate for', 'how much is 100'],
  },
  {
    featureId: 'money-transfers',
    category: 'finance',
    keywords: ['transfer', 'send money', 'remit', 'wire'],
    synonyms: ['remittance', 'send funds', 'wire transfer', 'money order'],
    contextTriggers: ['send money to', 'transfer to my account', 'cheapest way to send'],
  },
  {
    featureId: 'crypto-cash',
    category: 'finance',
    keywords: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'digital currency'],
    synonyms: ['cryptocurrency', 'btc', 'eth', 'defi', 'web3'],
    contextTriggers: ['buy crypto', 'sell bitcoin', 'crypto exchange', 'digital assets'],
  },
  {
    featureId: 'digital-banks',
    category: 'finance',
    keywords: ['bank', 'account', 'banking', 'neobank'],
    synonyms: ['bank account', 'online bank', 'fintech bank'],
    contextTriggers: ['open a bank account', 'which bank', 'best digital bank'],
  },
  {
    featureId: 'emergency-cards',
    category: 'finance',
    keywords: ['lost card', 'stolen card', 'block card', 'freeze', 'emergency card'],
    synonyms: ['card stolen', 'card lost', 'replacement card'],
    contextTriggers: ['lost my card', 'card was stolen', 'block my credit card', 'freeze card'],
  },

  // TRAVEL
  {
    featureId: 'public-transport',
    category: 'travel',
    keywords: ['bus', 'metro', 'train', 'subway', 'tram', 'public transport'],
    synonyms: ['transit', 'commute', 'tube', 'underground'],
    contextTriggers: ['how to get to', 'public transport in', 'metro map', 'bus schedule'],
  },
  {
    featureId: 'taxis',
    category: 'travel',
    keywords: ['taxi', 'uber', 'grab', 'bolt', 'ride', 'cab'],
    synonyms: ['rideshare', 'ride-hailing', 'car service'],
    contextTriggers: ['book a taxi', 'get a ride', 'uber in', 'taxi app'],
  },
  {
    featureId: 'car-rent-lease',
    category: 'travel',
    keywords: ['rent car', 'car rental', 'lease', 'hire car'],
    synonyms: ['vehicle rental', 'rent a vehicle', 'car hire'],
    contextTriggers: ['rent a car in', 'cheapest car rental', 'lease a car'],
  },
  {
    featureId: 'air-charter',
    category: 'travel',
    keywords: ['private jet', 'charter', 'private flight', 'jet'],
    synonyms: ['charter flight', 'private plane', 'air charter'],
    contextTriggers: ['book a private jet', 'charter a flight', 'fly private'],
  },
  {
    featureId: 'esim',
    category: 'travel',
    keywords: ['esim', 'data', 'sim card', 'mobile data', 'roaming'],
    synonyms: ['phone data', 'internet abroad', 'cell data'],
    contextTriggers: ['get an esim', 'mobile data in', 'avoid roaming', 'cheapest data'],
  },
  {
    featureId: 'travel-insurance',
    category: 'travel',
    keywords: ['insurance', 'cover', 'medical cover', 'travel insurance'],
    synonyms: ['coverage', 'protection', 'policy'],
    contextTriggers: ['do I need insurance', 'best travel insurance', 'medical coverage'],
  },
  {
    featureId: 'wifi-finder',
    category: 'travel',
    keywords: ['wifi', 'internet', 'hotspot', 'connection'],
    synonyms: ['wi-fi', 'wireless', 'free wifi'],
    contextTriggers: ['find wifi', 'wifi near me', 'best wifi cafe'],
  },

  // LOCAL LIVING
  {
    featureId: 'weather-service',
    category: 'local',
    keywords: ['weather', 'temperature', 'rain', 'forecast', 'climate'],
    synonyms: ['weather forecast', 'is it raining', 'how hot'],
    contextTriggers: ['weather in', 'will it rain', 'temperature today', 'pack for weather'],
  },
  {
    featureId: 'wellness',
    category: 'local',
    keywords: ['gym', 'yoga', 'spa', 'fitness', 'workout', 'meditation'],
    synonyms: ['exercise', 'health club', 'wellbeing'],
    contextTriggers: ['find a gym', 'yoga classes', 'spa near me', 'where to workout'],
  },
  {
    featureId: 'language-learning',
    category: 'local',
    keywords: ['language', 'learn', 'translate', 'speak', 'lesson'],
    synonyms: ['tongue', 'translation', 'tutor', 'class'],
    contextTriggers: ['learn spanish', 'how to say', 'language school', 'translate this'],
  },
  {
    featureId: 'explore-local',
    category: 'local',
    keywords: ['event', 'activity', 'festival', 'concert', 'show', 'exhibition'],
    synonyms: ['things to do', 'happening', 'entertainment'],
    contextTriggers: ['what to do in', 'events this week', 'things happening', 'local activities'],
  },
  {
    featureId: 'family-services',
    category: 'local',
    keywords: ['nanny', 'babysitter', 'childcare', 'school', 'kids'],
    synonyms: ['au pair', 'daycare', 'child care', 'preschool'],
    contextTriggers: ['find a nanny', 'childcare in', 'schools for kids', 'babysitter near'],
  },
  {
    featureId: 'pet-services',
    category: 'local',
    keywords: ['pet', 'dog', 'cat', 'vet', 'animal'],
    synonyms: ['pet care', 'veterinarian', 'pet sitter'],
    contextTriggers: ['travel with my dog', 'vet in', 'pet friendly', 'pet passport'],
  },
  {
    featureId: 'moving-services',
    category: 'local',
    keywords: ['move', 'moving', 'relocate', 'relocation', 'shipping'],
    synonyms: ['packing', 'movers', 'furniture transport'],
    contextTriggers: ['moving to', 'ship my stuff', 'relocating', 'moving company'],
  },
  {
    featureId: 'marketplace',
    category: 'local',
    keywords: ['buy', 'sell', 'marketplace', 'secondhand', 'used'],
    synonyms: ['trade', 'swap', 'listing', 'classifieds'],
    contextTriggers: ['buy from nomads', 'sell my laptop', 'second hand', 'marketplace deals'],
  },
  {
    featureId: 'social-chat',
    category: 'local',
    keywords: ['social', 'meet', 'connect', 'friends', 'dating', 'network'],
    synonyms: ['socialize', 'meetup', 'community', 'hangout'],
    contextTriggers: ['meet other nomads', 'make friends', 'social events', 'connect with people'],
  },
  {
    featureId: 'news',
    category: 'local',
    keywords: ['news', 'headlines', 'updates', 'current events'],
    synonyms: ['latest news', 'breaking', 'what happened'],
    contextTriggers: ['news about', 'what happened in', 'latest updates'],
  },

  // SAFETY
  {
    featureId: 'threats',
    category: 'safety',
    keywords: ['threat', 'danger', 'risk', 'security', 'alert', 'warning'],
    synonyms: ['unsafe', 'risky', 'security risk', 'threat level'],
    contextTriggers: ['is it safe in', 'security alerts', 'danger level', 'travel warning'],
  },
  {
    featureId: 'emergency',
    category: 'safety',
    keywords: ['emergency', 'help', 'sos', 'police', 'ambulance', 'fire'],
    synonyms: ['urgent', 'crisis', '911', '112', 'rescue'],
    contextTriggers: ['emergency number', 'call police', 'I need help', 'emergency contact'],
  },
  {
    featureId: 'embassy',
    category: 'safety',
    keywords: ['embassy', 'consulate', 'diplomatic', 'consul'],
    synonyms: ['consular', 'mission', 'representation'],
    contextTriggers: ['find embassy', 'consulate in', 'lost passport abroad', 'embassy phone'],
  },
  {
    featureId: 'cyber-helpline',
    category: 'safety',
    keywords: ['cyber', 'hack', 'scam', 'phishing', 'fraud', 'malware'],
    synonyms: ['hacked', 'cybercrime', 'identity theft', 'data breach'],
    contextTriggers: ['been hacked', 'got scammed', 'phishing email', 'cyber attack'],
  },

  // PREMIUM
  {
    featureId: 'ai-doctor',
    category: 'premium',
    keywords: ['doctor', 'medical', 'health', 'symptom', 'sick', 'pain', 'illness'],
    synonyms: ['physician', 'clinic', 'hospital', 'diagnosis'],
    contextTriggers: ['I feel sick', 'medical advice', 'find a doctor', 'health issue'],
  },
  {
    featureId: 'ai-lawyer',
    category: 'premium',
    keywords: ['lawyer', 'legal', 'law', 'rights', 'contract', 'dispute'],
    synonyms: ['attorney', 'solicitor', 'legal advice', 'counsel'],
    contextTriggers: ['legal question', 'my rights', 'contract review', 'legal issue'],
  },
  {
    featureId: 'ai-planner',
    category: 'premium',
    keywords: ['plan', 'itinerary', 'trip', 'route', 'schedule', 'travel plan'],
    synonyms: ['journey planner', 'trip organizer', 'travel schedule'],
    contextTriggers: ['plan a trip', 'create itinerary', 'where should I go', 'trip to'],
  },
  {
    featureId: 'airport-lounges',
    category: 'premium',
    keywords: ['lounge', 'airport', 'priority', 'vip', 'first class'],
    synonyms: ['airport lounge', 'business lounge', 'priority pass'],
    contextTriggers: ['airport lounge in', 'lounge access', 'vip lounge', 'priority pass'],
  },
  {
    featureId: 'business-centers',
    category: 'premium',
    keywords: ['coworking', 'office', 'workspace', 'desk', 'meeting room'],
    synonyms: ['co-working', 'shared office', 'hot desk', 'work space'],
    contextTriggers: ['find coworking', 'office space in', 'meeting room', 'work from'],
  },
  {
    featureId: 'private-clubs',
    category: 'premium',
    keywords: ['club', 'exclusive', 'member', 'elite', 'private'],
    synonyms: ['members club', 'gentlemen club', 'private member'],
    contextTriggers: ['exclusive club', 'private membership', 'elite access'],
  },
];

export interface DiscoveredFeature {
  feature: FeatureItem;
  score: number;
  matchType: 'exact' | 'keyword' | 'synonym' | 'context' | 'fuzzy';
  matchedTerms: string[];
}

/**
 * Discovers relevant features based on user intent text.
 * Returns scored and sorted list of matching features.
 */
export function discoverFeaturesByIntent(
  userText: string,
  limit: number = 5
): DiscoveredFeature[] {
  const normalized = userText.toLowerCase().trim();
  const words = normalized.split(/\s+/);
  const results: Map<string, DiscoveredFeature> = new Map();

  for (const mapping of INTENT_MAPPINGS) {
    const feature = FEATURE_REGISTRY.find(f => f.id === mapping.featureId);
    if (!feature) continue;

    let score = 0;
    let matchType: DiscoveredFeature['matchType'] = 'fuzzy';
    const matchedTerms: string[] = [];

    // 1. Context triggers (highest weight — full phrase match)
    for (const trigger of mapping.contextTriggers) {
      if (normalized.includes(trigger.toLowerCase())) {
        score += 0.9;
        matchType = 'context';
        matchedTerms.push(trigger);
      }
    }

    // 2. Exact keyword matches
    for (const keyword of mapping.keywords) {
      if (words.includes(keyword.toLowerCase())) {
        score += 0.6;
        if (matchType !== 'context') matchType = 'keyword';
        matchedTerms.push(keyword);
      } else if (normalized.includes(keyword.toLowerCase())) {
        score += 0.4;
        if (matchType !== 'context') matchType = 'keyword';
        matchedTerms.push(keyword);
      }
    }

    // 3. Synonym matches
    for (const synonym of mapping.synonyms) {
      if (normalized.includes(synonym.toLowerCase())) {
        score += 0.5;
        if (matchType !== 'context' && matchType !== 'keyword') matchType = 'synonym';
        matchedTerms.push(synonym);
      }
    }

    // 4. Fuzzy partial matches (individual word overlap)
    for (const keyword of [...mapping.keywords, ...mapping.synonyms]) {
      for (const word of words) {
        if (word.length >= 4 && keyword.toLowerCase().startsWith(word)) {
          score += 0.2;
          if (matchType === 'fuzzy') matchedTerms.push(word);
        }
      }
    }

    // Cap score at 1.0
    score = Math.min(score, 1.0);

    if (score > 0.15) {
      const existing = results.get(mapping.featureId);
      if (!existing || existing.score < score) {
        results.set(mapping.featureId, { feature, score, matchType, matchedTerms });
      }
    }
  }

  return Array.from(results.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Returns a concise tool-routing prompt for the AI system prompt.
 * Tells the AI which features are available and how to reference them.
 */
export function getToolRoutingPrompt(): string {
  const grouped: Record<string, string[]> = {};
  for (const feature of FEATURE_REGISTRY) {
    const cat = CATEGORY_LABELS[feature.category] || feature.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(`${feature.id}: ${feature.label} — ${feature.description}`);
  }

  let prompt = `\n**🧭 TOOL ROUTING — Available Features**\nWhen users ask about topics below, reference the specific feature by ID so the app can auto-navigate.\n`;
  for (const [cat, features] of Object.entries(grouped)) {
    prompt += `\n**${cat}:**\n`;
    for (const f of features) {
      prompt += `- ${f}\n`;
    }
  }
  prompt += `\nTo suggest a feature, include: [NAVIGATE:feature_id] in your response.\n`;
  return prompt;
}

/**
 * Parses AI response for navigation suggestions.
 * Returns feature IDs the AI wants the user to navigate to.
 */
export function parseNavigationSuggestions(aiResponse: string): string[] {
  const regex = /\[NAVIGATE:(\w[\w-]*)\]/g;
  const ids: string[] = [];
  let match;
  while ((match = regex.exec(aiResponse)) !== null) {
    const feature = FEATURE_REGISTRY.find(f => f.id === match[1]);
    if (feature) ids.push(match[1]);
  }
  return ids;
}

/**
 * Auto-discovers which features are relevant given a conversation context.
 * Used by the Concierge to proactively suggest features.
 */
export function getProactiveSuggestions(
  currentCountry?: string,
  recentTopics: string[] = [],
  userPreferences: string[] = []
): DiscoveredFeature[] {
  const contextParts = [
    currentCountry ? `traveling in ${currentCountry}` : '',
    ...recentTopics,
    ...userPreferences,
  ].filter(Boolean);

  if (contextParts.length === 0) return [];

  const combined = contextParts.join(' ');
  return discoverFeaturesByIntent(combined, 3);
}
