import {
  Calculator, MapPin, Plane, Shield, FileText, Heart, CreditCard,
  Newspaper, AlertTriangle, Bus, Wifi, Award, Building2, CloudRain,
  Dumbbell, BookOpen, Users, Calendar, Baby, Cat, Truck, Store,
  MessageSquare, ShieldCheck, Siren, ShieldAlert, Stethoscope, Scale,
  Crown, Flag, Globe2, Building, Sparkles, BarChart3, Home, Car,
  Gift, GraduationCap, DollarSign, Coins, Globe, Mail, Wrench,
  Locate, Tag, Phone, Moon, TrendingUp
} from 'lucide-react';

export type TrustLevel = 'info' | 'advisory' | 'actionable' | 'high_stakes';

export interface FeatureItem {
  id: string;
  label: string;
  icon: any;
  category: 'tax' | 'travel' | 'local' | 'premium' | 'safety' | 'finance' | 'dashboard';
  badge?: string;
  badgeVariant?: 'default' | 'destructive' | 'outline' | 'secondary';
  description: string;
  defaultVisible: boolean;
  defaultPinned: boolean;
  /** System features can never be hidden (dashboard, settings, help) */
  system?: boolean;
  /** Trust level determines confirmation and undo behavior for AI actions */
  trustLevel?: TrustLevel;
}

// System items that are ALWAYS visible and cannot be customized
export const SYSTEM_FEATURES = ['dashboard', 'settings', 'help', 'upgrade'];

export const FEATURE_REGISTRY: FeatureItem[] = [
  // DASHBOARD WIDGETS (front page sections)
  { id: 'dash-threat', label: 'Threat Intelligence Widget', icon: Shield, category: 'dashboard', description: 'Security alerts on home screen', defaultVisible: true, defaultPinned: false },
  { id: 'dash-welcome', label: 'Welcome & Hero Cards', icon: Home, category: 'dashboard', description: 'Welcome header with quick navigation', defaultVisible: true, defaultPinned: false },
  { id: 'dash-stats', label: 'Quick Stats Bar', icon: BarChart3, category: 'dashboard', description: 'Country & day tracking stats', defaultVisible: true, defaultPinned: false },
  { id: 'dash-weather', label: 'Weather Widget', icon: CloudRain, category: 'dashboard', description: 'Weather overview on home screen', defaultVisible: true, defaultPinned: false },
  { id: 'dash-gamification', label: 'Gamification & Achievements', icon: Award, category: 'dashboard', description: 'XP, levels & milestones', defaultVisible: true, defaultPinned: false },
  { id: 'dash-activity', label: 'Recent Activity Feed', icon: Calendar, category: 'dashboard', description: 'Latest tracking activity', defaultVisible: true, defaultPinned: false },
  { id: 'dash-actions', label: 'Smart Actions', icon: Sparkles, category: 'dashboard', description: 'AI-suggested quick actions', defaultVisible: true, defaultPinned: false },
  { id: 'dash-discovery', label: 'Feature Discovery', icon: Gift, category: 'dashboard', description: 'Discover new features & tips', defaultVisible: true, defaultPinned: false },

  // TAX & COMPLIANCE
  { id: 'tax', label: 'Tax Dashboard', icon: Calculator, category: 'tax', description: 'Tax residency overview & compliance', defaultVisible: true, defaultPinned: false, trustLevel: 'advisory' },
  { id: 'tax-residency', label: 'Country Tracker', icon: MapPin, category: 'tax', badge: 'Core', description: 'Track days in each country', defaultVisible: true, defaultPinned: false, trustLevel: 'advisory' },
  { id: 'visas', label: 'Visa Manager', icon: Plane, category: 'tax', description: 'Manage visas & applications', defaultVisible: true, defaultPinned: false, trustLevel: 'advisory' },
  { id: 'visa-immigration', label: 'Visa / Immigration', icon: Plane, category: 'tax', badge: 'NEW', badgeVariant: 'secondary', description: 'Visa services, government portals & passport offices', defaultVisible: true, defaultPinned: false, trustLevel: 'advisory' },
  { id: 'visa-assistance', label: 'Visa Assistance', icon: Globe, category: 'tax', description: 'Visa application assistance services', defaultVisible: true, defaultPinned: false, trustLevel: 'advisory' },
  { id: 'etias', label: 'ETIAS 2026', icon: Shield, category: 'tax', badge: 'EU', badgeVariant: 'secondary', description: 'EU travel authorization system', defaultVisible: true, defaultPinned: false, trustLevel: 'info' },
  { id: 'visa-matcher', label: 'Visa Auto-Matcher', icon: Plane, category: 'tax', badge: 'AI', badgeVariant: 'secondary', description: 'AI-matched digital nomad visas based on your travel patterns', defaultVisible: true, defaultPinned: false, trustLevel: 'advisory' },
  { id: 'vaccination-hub', label: 'Vaccinations & Medicines', icon: Heart, category: 'tax', badge: 'WHO', badgeVariant: 'secondary', description: 'Global vaccination requirements, clinics & health records', defaultVisible: true, defaultPinned: false, trustLevel: 'advisory' },
  { id: 'vault', label: 'Document Vault', icon: Shield, category: 'tax', description: 'Secure document storage', defaultVisible: true, defaultPinned: false, trustLevel: 'actionable' },
  { id: 'gov-apps', label: 'Government Apps', icon: Building, category: 'tax', description: 'Official government applications', defaultVisible: true, defaultPinned: false, trustLevel: 'info' },
  { id: 'tax-wealthy', label: 'Tax & Wealth Help', icon: DollarSign, category: 'tax', description: 'Wealth management & tax optimization', defaultVisible: true, defaultPinned: false, trustLevel: 'advisory' },

  // FINANCE
  { id: 'payment-options', label: 'Payment & AI Wallet', icon: CreditCard, category: 'finance', badge: 'AI', badgeVariant: 'secondary', description: 'Payment methods & Agentic Commerce', defaultVisible: true, defaultPinned: false, trustLevel: 'high_stakes' },
  { id: 'award-cards', label: 'Award Cards', icon: Award, category: 'finance', badge: 'NEW', badgeVariant: 'secondary', description: 'Travel reward programs', defaultVisible: true, defaultPinned: false, trustLevel: 'actionable' },
  { id: 'digital-banks', label: 'Digital Banks', icon: Building2, category: 'finance', description: 'Online banking services', defaultVisible: true, defaultPinned: false, trustLevel: 'actionable' },
  { id: 'money-transfers', label: 'Money Transfers', icon: DollarSign, category: 'finance', description: 'Send money worldwide', defaultVisible: true, defaultPinned: false, trustLevel: 'high_stakes' },
  { id: 'crypto-cash', label: 'Crypto & Digital Money', icon: Coins, category: 'finance', description: 'Cryptocurrency services', defaultVisible: true, defaultPinned: false, trustLevel: 'high_stakes' },
  { id: 'currency-converter', label: 'Currency Converter', icon: Globe2, category: 'finance', description: 'Real-time exchange rates', defaultVisible: true, defaultPinned: false, trustLevel: 'info' },
  { id: 'emergency-cards', label: 'Emergency Cards', icon: CreditCard, category: 'finance', badge: 'SOS', badgeVariant: 'destructive', description: 'Emergency card numbers & replacement', defaultVisible: true, defaultPinned: false, trustLevel: 'actionable' },

  // TRAVEL ESSENTIALS
  { id: 'public-transport', label: 'Transportation', icon: Bus, category: 'travel', description: 'Public transport info', defaultVisible: true, defaultPinned: false },
  { id: 'taxis', label: 'Taxi & Rideshare', icon: Car, category: 'travel', description: 'Taxi & ride-hailing services', defaultVisible: true, defaultPinned: false },
  { id: 'car-rent-lease', label: 'Car Rental', icon: Car, category: 'travel', description: 'Car rental & leasing', defaultVisible: true, defaultPinned: false },
  { id: 'air-charter', label: 'Air Charter Service', icon: Plane, category: 'travel', badge: 'AI', badgeVariant: 'secondary', description: 'Private jet charter', defaultVisible: true, defaultPinned: false },
  { id: 'esim', label: 'eSIM & VPN', icon: Wifi, category: 'travel', description: 'Mobile data & privacy', defaultVisible: true, defaultPinned: false },
  { id: 'vpn-email', label: 'VPN & Email', icon: Mail, category: 'travel', description: 'VPN & secure email services', defaultVisible: true, defaultPinned: false },
  { id: 'travel-insurance', label: 'Travel Insurance', icon: Shield, category: 'travel', description: 'Insurance comparison', defaultVisible: true, defaultPinned: false },
  { id: 'roadside', label: 'Roadside Assistance', icon: Wrench, category: 'travel', description: 'Emergency roadside help', defaultVisible: true, defaultPinned: false },
  { id: 'wifi-finder', label: 'WiFi Finder', icon: Wifi, category: 'travel', description: 'Find WiFi hotspots', defaultVisible: true, defaultPinned: false },

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
  { id: 'delivery-services', label: 'Delivery Services', icon: Truck, category: 'local', description: 'Local delivery services', defaultVisible: true, defaultPinned: false },
  { id: 'marketplace', label: 'Marketplace', icon: Store, category: 'local', badge: 'AI', badgeVariant: 'secondary', description: 'Buy & sell with nomads', defaultVisible: true, defaultPinned: false },
  { id: 'social-chat', label: 'Social Vibe', icon: Users, category: 'local', badge: 'AI', badgeVariant: 'secondary', description: 'Social networking', defaultVisible: true, defaultPinned: false },
  { id: 'nomad-chat', label: 'Nomad Pulse', icon: MessageSquare, category: 'local', badge: 'AI', badgeVariant: 'secondary', description: 'Community chat', defaultVisible: true, defaultPinned: false },
  { id: 'news', label: 'News & Updates', icon: Newspaper, category: 'local', description: 'Travel news', defaultVisible: true, defaultPinned: false },
  { id: 'local-services', label: 'Local Services', icon: MapPin, category: 'local', description: 'Find local service providers', defaultVisible: true, defaultPinned: false },
  { id: 'local-news', label: 'Local News', icon: Newspaper, category: 'local', description: 'News from your location', defaultVisible: true, defaultPinned: false },
  { id: 'students', label: 'Student Services', icon: GraduationCap, category: 'local', description: 'Student resources abroad', defaultVisible: true, defaultPinned: false },
  { id: 'super-offers', label: 'Super Offers', icon: Tag, category: 'local', badge: 'HOT', badgeVariant: 'secondary', description: 'Exclusive deals & offers', defaultVisible: true, defaultPinned: false },
  { id: 'my-travel-awards', label: 'My Travel Awards', icon: Award, category: 'local', description: 'Travel achievements', defaultVisible: true, defaultPinned: false },

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
  { id: 'medical-services', label: 'Medical Services', icon: Stethoscope, category: 'premium', description: 'Find doctors & clinics', defaultVisible: true, defaultPinned: false },
  { id: 'travel-lawyers', label: 'Travel Legal Services', icon: Scale, category: 'premium', description: 'Legal services for travelers', defaultVisible: true, defaultPinned: false },
  { id: 'business-centers', label: 'Business Centers', icon: Building2, category: 'premium', badge: 'NEW', badgeVariant: 'secondary', description: 'Coworking & offices', defaultVisible: true, defaultPinned: false },
  { id: 'remote-offices', label: 'Remote Work Offices', icon: Building, category: 'premium', description: 'Remote work spaces', defaultVisible: true, defaultPinned: false },
  { id: 'airport-lounges', label: 'Airport Lounges', icon: Crown, category: 'premium', badge: 'VIP', badgeVariant: 'secondary', description: 'Lounge access worldwide', defaultVisible: true, defaultPinned: false },
  { id: 'private-clubs', label: 'Elite Clubs', icon: Crown, category: 'premium', badge: 'ELITE', badgeVariant: 'secondary', description: 'Private members clubs', defaultVisible: true, defaultPinned: false },
  { id: 'location-tracking', label: 'Location Tracking', icon: Locate, category: 'premium', description: 'GPS & location services', defaultVisible: true, defaultPinned: false },
  { id: 'integrations', label: 'Integrations Hub', icon: Globe2, category: 'premium', description: 'Manage third-party service connections', defaultVisible: true, defaultPinned: false, trustLevel: 'actionable' },
  { id: 'jet-lag', label: 'Jet Lag Protocol', icon: Moon, category: 'travel', badge: 'BIO', badgeVariant: 'secondary', description: 'Circadian recovery protocol for timezone shifts', defaultVisible: true, defaultPinned: false, trustLevel: 'info' },
  { id: 'venture-invest', label: 'Venture Travelist', icon: TrendingUp, category: 'premium', badge: 'NEW', badgeVariant: 'secondary', description: 'Investment intelligence for global nomads', defaultVisible: true, defaultPinned: false, trustLevel: 'advisory' },
  { id: 'tax-law-verifier', label: 'Tax Law Verifier', icon: Shield, category: 'tax', badge: 'AUTO', badgeVariant: 'default', description: 'Daily automated verification of tax residency laws from government sources', defaultVisible: true, defaultPinned: false, trustLevel: 'high_stakes' },
  { id: 'document-auto-fill', label: 'Document Auto-Fill', icon: FileText, category: 'tax', badge: 'AI', badgeVariant: 'secondary', description: 'Auto-fill visa, tax, and travel forms from your profile', defaultVisible: true, defaultPinned: false, trustLevel: 'actionable' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  dashboard: 'Home Screen Widgets',
  tax: 'Tax & Compliance',
  finance: 'Finance & Payments',
  travel: 'Travel Essentials',
  local: 'Local Living',
  premium: 'Premium Services',
  safety: 'Safety & Emergency',
};

export const CATEGORY_ORDER = ['dashboard', 'safety', 'tax', 'finance', 'travel', 'local', 'premium'];

export function getFeatureById(id: string): FeatureItem | undefined {
  return FEATURE_REGISTRY.find(f => f.id === id);
}

/**
 * Get the trust level for a feature. Defaults to 'info' if not specified.
 * Future features automatically get 'info' unless explicitly tagged.
 */
export function getFeatureTrustLevel(id: string): TrustLevel {
  const feature = getFeatureById(id);
  return feature?.trustLevel || 'info';
}
