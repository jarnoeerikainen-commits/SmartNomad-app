import {
  Calculator, MapPin, Plane, Shield, FileText, Heart, CreditCard,
  Newspaper, AlertTriangle, Bus, Wifi, Award, Building2, CloudRain,
  Dumbbell, BookOpen, Users, Calendar, Baby, Cat, Truck, Store,
  MessageSquare, ShieldCheck, Siren, ShieldAlert, Stethoscope, Scale,
  Crown, Flag, Globe2, Building, Sparkles, BarChart3, Home
} from 'lucide-react';

export interface FeatureItem {
  id: string;
  label: string;
  icon: any;
  category: 'tax' | 'travel' | 'local' | 'premium' | 'safety';
  badge?: string;
  badgeVariant?: 'default' | 'destructive' | 'outline' | 'secondary';
  description: string;
  defaultVisible: boolean;
  defaultPinned: boolean;
  /** System features can never be hidden (dashboard, settings, help) */
  system?: boolean;
}

// System items that are ALWAYS visible and cannot be customized
export const SYSTEM_FEATURES = ['dashboard', 'settings', 'help', 'upgrade'];

export const FEATURE_REGISTRY: FeatureItem[] = [
  // TAX & COMPLIANCE
  { id: 'tax', label: 'Tax Dashboard', icon: Calculator, category: 'tax', description: 'Tax residency overview & compliance', defaultVisible: true, defaultPinned: false },
  { id: 'tax-residency', label: 'Country Tracker', icon: MapPin, category: 'tax', badge: 'Core', description: 'Track days in each country', defaultVisible: true, defaultPinned: false },
  { id: 'visas', label: 'Visa Manager', icon: Plane, category: 'tax', description: 'Manage visas & applications', defaultVisible: true, defaultPinned: false },
  { id: 'visa-immigration', label: 'Visa / Immigration', icon: Plane, category: 'tax', badge: 'NEW', badgeVariant: 'secondary', description: 'Visa services, government portals & passport offices', defaultVisible: true, defaultPinned: false },
  { id: 'etias', label: 'ETIAS 2026', icon: Shield, category: 'tax', badge: 'EU', badgeVariant: 'secondary', description: 'EU travel authorization system', defaultVisible: true, defaultPinned: false },
  { id: 'payment-options', label: 'Payment Options', icon: CreditCard, category: 'tax', badge: 'NEW', badgeVariant: 'secondary', description: 'Manage payment methods', defaultVisible: true, defaultPinned: false },
  { id: 'award-cards', label: 'Award Cards', icon: Award, category: 'tax', badge: 'NEW', badgeVariant: 'secondary', description: 'Travel reward programs', defaultVisible: true, defaultPinned: false },
  { id: 'vault', label: 'Document Vault', icon: Shield, category: 'tax', description: 'Secure document storage', defaultVisible: true, defaultPinned: false },

  // TRAVEL ESSENTIALS
  { id: 'public-transport', label: 'Transportation', icon: Bus, category: 'travel', description: 'Public transport info', defaultVisible: true, defaultPinned: false },
  { id: 'air-charter', label: 'Air Charter Service', icon: Plane, category: 'travel', badge: 'AI', badgeVariant: 'secondary', description: 'Private jet charter', defaultVisible: true, defaultPinned: false },
  { id: 'esim', label: 'eSIM & VPN', icon: Wifi, category: 'travel', description: 'Mobile data & privacy', defaultVisible: true, defaultPinned: false },
  { id: 'travel-insurance', label: 'Travel Insurance', icon: Shield, category: 'travel', description: 'Insurance comparison', defaultVisible: true, defaultPinned: false },

  // LOCAL LIVING
  { id: 'global-city-services', label: 'City Services', icon: Building2, category: 'local', description: 'Services by city', defaultVisible: true, defaultPinned: false },
  { id: 'weather-service', label: 'Weather Service', icon: CloudRain, category: 'local', badge: 'LIVE', badgeVariant: 'secondary', description: 'Weather & sport forecasts', defaultVisible: true, defaultPinned: true },
  { id: 'wellness', label: 'Wellness & Fitness', icon: Dumbbell, category: 'local', badge: 'NEW', badgeVariant: 'secondary', description: 'Gyms, yoga, spas', defaultVisible: true, defaultPinned: false },
  { id: 'language-learning', label: 'Language Learning', icon: BookOpen, category: 'local', description: 'Learn local languages', defaultVisible: true, defaultPinned: false },
  { id: 'local-nomads', label: 'Local Nomads', icon: Users, category: 'local', description: 'Meet nearby nomads', defaultVisible: true, defaultPinned: false },
  { id: 'explore-local', label: 'Local Events', icon: Calendar, category: 'local', badge: 'LIVE', badgeVariant: 'secondary', description: 'Events & activities', defaultVisible: true, defaultPinned: false },
  { id: 'family-services', label: 'Family Services', icon: Baby, category: 'local', badge: 'TRUSTED', badgeVariant: 'secondary', description: 'Nanny & childcare', defaultVisible: true, defaultPinned: false },
  { id: 'pet-services', label: 'Pet Services', icon: Cat, category: 'local', description: 'Pet care abroad', defaultVisible: true, defaultPinned: false },
  { id: 'moving-services', label: 'Moving Services', icon: Truck, category: 'local', badge: 'AI', badgeVariant: 'secondary', description: 'International moving', defaultVisible: true, defaultPinned: false },
  { id: 'marketplace', label: 'Marketplace', icon: Store, category: 'local', badge: 'AI', badgeVariant: 'secondary', description: 'Buy & sell with nomads', defaultVisible: true, defaultPinned: false },
  { id: 'social-chat', label: 'Social Vibe', icon: Users, category: 'local', badge: 'AI', badgeVariant: 'secondary', description: 'Social networking', defaultVisible: true, defaultPinned: false },
  { id: 'nomad-chat', label: 'Nomad Pulse', icon: MessageSquare, category: 'local', badge: 'AI', badgeVariant: 'secondary', description: 'Community chat', defaultVisible: true, defaultPinned: false },
  { id: 'news', label: 'News & Updates', icon: Newspaper, category: 'local', description: 'Travel news', defaultVisible: true, defaultPinned: false },

  // PREMIUM / SAFETY
  { id: 'threats', label: 'Threat Intelligence', icon: Shield, category: 'safety', description: 'Security threat monitoring', defaultVisible: true, defaultPinned: false },
  { id: 'guardian', label: 'SuperNomad Guardian', icon: ShieldCheck, category: 'safety', badge: 'NEW', badgeVariant: 'secondary', description: 'Personal safety AI', defaultVisible: true, defaultPinned: false },
  { id: 'emergency', label: 'Emergency Contacts', icon: AlertTriangle, category: 'safety', badge: 'SOS', badgeVariant: 'destructive', description: 'Emergency numbers worldwide', defaultVisible: true, defaultPinned: false },
  { id: 'embassy', label: 'Embassy Directory', icon: Flag, category: 'safety', badge: 'OFFICIAL', badgeVariant: 'secondary', description: 'Find embassies & consulates', defaultVisible: true, defaultPinned: false },
  { id: 'sos-services', label: 'SOS Services', icon: Siren, category: 'safety', badge: '24/7', badgeVariant: 'destructive', description: '24/7 emergency response', defaultVisible: true, defaultPinned: false },
  { id: 'private-protection', label: 'Private Protection', icon: Shield, category: 'safety', badge: 'ELITE', badgeVariant: 'secondary', description: 'Personal security services', defaultVisible: true, defaultPinned: false },
  { id: 'cyber-helpline', label: 'Cyber Helpline', icon: ShieldAlert, category: 'safety', badge: 'NEW', badgeVariant: 'destructive', description: 'Cybersecurity assistance', defaultVisible: true, defaultPinned: false },
  { id: 'ai-doctor', label: 'AI Doctor', icon: Stethoscope, category: 'premium', badge: 'AI', description: 'Medical advice AI', defaultVisible: true, defaultPinned: false },
  { id: 'ai-lawyer', label: 'AI Lawyer', icon: Scale, category: 'premium', badge: 'AI', description: 'Legal advice AI', defaultVisible: true, defaultPinned: false },
  { id: 'ai-planner', label: 'AI Travel Planner', icon: Plane, category: 'premium', badge: 'AI', description: 'Plan trips with AI', defaultVisible: true, defaultPinned: false },
  { id: 'tax-advisors', label: 'Tax Advisors', icon: Calculator, category: 'premium', badge: 'VIP', badgeVariant: 'secondary', description: 'Expert tax consultation', defaultVisible: true, defaultPinned: false },
  { id: 'business-centers', label: 'Business Centers', icon: Building2, category: 'premium', badge: 'NEW', badgeVariant: 'secondary', description: 'Coworking & offices', defaultVisible: true, defaultPinned: false },
  { id: 'airport-lounges', label: 'Airport Lounges', icon: Crown, category: 'premium', badge: 'VIP', badgeVariant: 'secondary', description: 'Lounge access worldwide', defaultVisible: true, defaultPinned: false },
  { id: 'private-clubs', label: 'Elite Clubs', icon: Crown, category: 'premium', badge: 'ELITE', badgeVariant: 'secondary', description: 'Private members clubs', defaultVisible: true, defaultPinned: false },
];

export const CATEGORY_LABELS: Record<string, string> = {
  tax: 'Tax & Compliance',
  travel: 'Travel Essentials',
  local: 'Local Living',
  premium: 'Premium Services',
  safety: 'Safety & Emergency',
};

export const CATEGORY_ORDER = ['safety', 'tax', 'travel', 'local', 'premium'];

export function getFeatureById(id: string): FeatureItem | undefined {
  return FEATURE_REGISTRY.find(f => f.id === id);
}
