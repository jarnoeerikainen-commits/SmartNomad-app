import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, ExternalLink, Star, Globe, Zap, Shield, Search, 
  Wifi, MapPin, DollarSign, Users, Plane, CheckCircle, Clock,
  TrendingUp, Award
} from 'lucide-react';

interface ESimProvider {
  name: string;
  description: string;
  features: string[];
  rating: number;
  countries: string;
  startingPrice: string;
  url: string;
  popular: boolean;
  category: 'global' | 'regional' | 'unlimited' | 'budget';
  bestFor: string[];
  dataOptions: string[];
  activationTime: string;
  support: string;
  hotspotAllowed: boolean;
}

const ESIM_PROVIDERS: ESimProvider[] = [
  {
    name: 'Airalo',
    description: "World's first eSIM store with the widest coverage and most affordable plans",
    features: ['Instant activation', '24/7 support', 'No contracts', 'Top-up available', 'Referral rewards'],
    rating: 4.8,
    countries: '200+ countries',
    startingPrice: '$4.50',
    url: 'https://www.airalo.com',
    popular: true,
    category: 'global',
    bestFor: ['Budget travelers', 'Short trips', 'Multi-country'],
    dataOptions: ['1GB - 20GB', 'Regional plans', '7-30 day validity'],
    activationTime: 'Instant',
    support: '24/7 Chat & Email',
    hotspotAllowed: true,
  },
  {
    name: 'Holafly',
    description: 'Unlimited data eSIMs — no throttling, no data caps, perfect for heavy users',
    features: ['Unlimited data', 'Keep WhatsApp number', 'Easy QR activation', 'No throttling', 'Shared plans'],
    rating: 4.7,
    countries: '180+ countries',
    startingPrice: '$6.00',
    url: 'https://www.holafly.com',
    popular: true,
    category: 'unlimited',
    bestFor: ['Heavy data users', 'Remote workers', 'Streaming'],
    dataOptions: ['Unlimited only', '5-90 day validity', 'No data caps'],
    activationTime: 'Instant',
    support: '24/7 Chat',
    hotspotAllowed: false,
  },
  {
    name: 'Nomad',
    description: 'Flexible data plans with excellent regional bundles for digital nomads',
    features: ['Flexible plans', 'Global coverage', 'Simple setup', 'Data sharing', 'Auto top-up'],
    rating: 4.6,
    countries: '165+ countries',
    startingPrice: '$5.00',
    url: 'https://www.getnomad.app',
    popular: true,
    category: 'global',
    bestFor: ['Digital nomads', 'Long-term travelers', 'Flexible needs'],
    dataOptions: ['1GB - 10GB', 'Regional bundles', '7-30 day validity'],
    activationTime: 'Instant',
    support: 'Email & In-app',
    hotspotAllowed: true,
  },
  {
    name: 'aloSIM',
    description: 'Pay-as-you-go eSIM with no expiry on purchased data — use it whenever',
    features: ['No expiry data', 'Pay-as-you-go', 'Simple app', '170+ destinations', 'Data rollover'],
    rating: 4.5,
    countries: '170+ countries',
    startingPrice: '$4.50',
    url: 'https://www.alosim.com',
    popular: false,
    category: 'budget',
    bestFor: ['Occasional travelers', 'Data savers', 'No-rush users'],
    dataOptions: ['1GB - 50GB', 'No expiry', 'Top-up anytime'],
    activationTime: 'Instant',
    support: 'Email & Chat',
    hotspotAllowed: true,
  },
  {
    name: 'Ubigi',
    description: 'Trusted eSIM partner of major device manufacturers with seamless integration',
    features: ['OEM partnerships', 'Auto-connect', 'Multi-device', 'Business plans', 'API access'],
    rating: 4.4,
    countries: '190+ countries',
    startingPrice: '$3.00',
    url: 'https://www.ubigi.com',
    popular: false,
    category: 'global',
    bestFor: ['Business travelers', 'Multi-device users', 'Tech-savvy'],
    dataOptions: ['500MB - 50GB', 'Day/week/month plans', 'Data pass system'],
    activationTime: 'Instant',
    support: '24/7 Support',
    hotspotAllowed: true,
  },
  {
    name: 'Maya Mobile',
    description: 'Regional specialist with exceptional coverage across Asia, Europe & Americas',
    features: ['Regional expertise', 'Local speeds', 'No throttling', 'Simple pricing', 'Group plans'],
    rating: 4.5,
    countries: '120+ countries',
    startingPrice: '$5.50',
    url: 'https://www.mayamobile.com',
    popular: false,
    category: 'regional',
    bestFor: ['Regional travel', 'Asia specialists', 'Europe trips'],
    dataOptions: ['1GB - 20GB', 'Regional bundles', '7-30 day validity'],
    activationTime: 'Instant',
    support: 'Email & Chat',
    hotspotAllowed: true,
  },
  {
    name: 'Yesim',
    description: 'Swiss-quality eSIM with built-in VPN and phone number options',
    features: ['Built-in VPN', 'Virtual phone number', 'Swiss privacy', 'eSIM + VPN combo', 'Business tools'],
    rating: 4.4,
    countries: '150+ countries',
    startingPrice: '$5.00',
    url: 'https://www.yesim.app',
    popular: false,
    category: 'global',
    bestFor: ['Privacy-conscious', 'Need phone number', 'Business travelers'],
    dataOptions: ['1GB - 50GB', 'Unlimited options', 'Monthly subscriptions'],
    activationTime: 'Instant',
    support: '24/7 Chat',
    hotspotAllowed: true,
  },
  {
    name: 'Gigsky',
    description: 'Enterprise-grade eSIM solutions with Apple partnership and global LTE coverage',
    features: ['Apple partner', 'Enterprise solutions', 'Global LTE', 'Multi-line support', 'Fleet management'],
    rating: 4.3,
    countries: '190+ countries',
    startingPrice: '$8.00',
    url: 'https://www.gigsky.com',
    popular: false,
    category: 'global',
    bestFor: ['Enterprise', 'Apple users', 'Premium coverage'],
    dataOptions: ['300MB - 15GB', 'Day passes', '1-30 day validity'],
    activationTime: 'Instant',
    support: 'Email & Phone',
    hotspotAllowed: true,
  },
];

const SITUATION_PRESETS = [
  { id: 'nomad', label: '🏝️ Digital Nomad', desc: 'Long-term, heavy data, flexible plans', filter: ['unlimited', 'global'] },
  { id: 'business', label: '💼 Business Trip', desc: 'Reliable, fast activation, support', filter: ['global'] },
  { id: 'backpacker', label: '🎒 Backpacker', desc: 'Budget-friendly, multi-country', filter: ['budget', 'regional'] },
  { id: 'family', label: '👨‍👩‍👧‍👦 Family Travel', desc: 'Hotspot sharing, enough data for all', filter: ['unlimited', 'global'] },
];

export const ESimServices: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const filteredProviders = useMemo(() => {
    let providers = ESIM_PROVIDERS;

    if (activePreset) {
      const preset = SITUATION_PRESETS.find(p => p.id === activePreset);
      if (preset) {
        providers = providers.filter(p => preset.filter.includes(p.category));
      }
    }

    if (activeCategory !== 'all') {
      providers = providers.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      providers = providers.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.bestFor.some(b => b.toLowerCase().includes(q))
      );
    }

    return providers;
  }, [searchQuery, activeCategory, activePreset]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">eSIM Travel Solutions</h1>
          <p className="text-muted-foreground">Stay connected worldwide — no physical SIM needed</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Providers</p>
                <p className="text-2xl font-bold">{ESIM_PROVIDERS.length}</p>
              </div>
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">From</p>
                <p className="text-2xl font-bold">$3.00</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Coverage</p>
                <p className="text-2xl font-bold">200+</p>
              </div>
              <Globe className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Activation</p>
                <p className="text-2xl font-bold">Instant</p>
              </div>
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Situation Presets */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Quick Pick — What's your travel style?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SITUATION_PRESETS.map(preset => (
            <Button
              key={preset.id}
              variant={activePreset === preset.id ? 'default' : 'outline'}
              size="sm"
              className="h-auto py-2 px-3 flex flex-col items-start text-left"
              onClick={() => setActivePreset(activePreset === preset.id ? null : preset.id)}
            >
              <span className="font-semibold text-xs">{preset.label}</span>
              <span className="text-[10px] opacity-70">{preset.desc}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search providers, features..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={activeCategory} onValueChange={v => { setActiveCategory(v); setActivePreset(null); }}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="global">Global</TabsTrigger>
                <TabsTrigger value="unlimited">Unlimited</TabsTrigger>
                <TabsTrigger value="regional">Regional</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}
      </p>

      {/* Provider Cards */}
      <div className="space-y-4">
        {filteredProviders.map((provider) => (
          <Card key={provider.name} className={`transition-all hover:shadow-lg ${provider.popular ? 'border-primary/40 border-2' : ''}`}>
            <CardContent className="p-5 space-y-4">
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-xl">{provider.name}</h4>
                    {provider.popular && (
                      <Badge variant="default" className="gap-1 text-xs">
                        <Award className="w-3 h-3" /> Top Pick
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs capitalize">{provider.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
                <Button onClick={() => window.open(provider.url, '_blank', 'noopener,noreferrer')} className="gap-1.5 shrink-0">
                  Visit <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-y border-border">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Coverage</div>
                    <div className="font-semibold text-sm">{provider.countries}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">From</div>
                    <div className="font-semibold text-sm">{provider.startingPrice}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Activation</div>
                    <div className="font-semibold text-sm">{provider.activationTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Hotspot</div>
                    <div className="font-semibold text-sm">{provider.hotspotAllowed ? '✅ Yes' : '❌ No'}</div>
                  </div>
                </div>
              </div>

              {/* Features + Best For */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-semibold text-muted-foreground mb-1.5">Features</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {provider.features.map(f => (
                      <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-muted-foreground mb-1.5">Best For</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {provider.bestFor.map(b => (
                      <Badge key={b} variant="outline" className="text-xs">{b}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data options + Rating */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{provider.dataOptions.join(' · ')}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                  ))}
                  <span className="text-sm font-semibold ml-1">{provider.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No providers match your criteria. Try adjusting filters.</p></CardContent></Card>
      )}

      {/* How to Activate */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-5">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> How to Activate Your eSIM
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Check Compatibility', desc: 'Verify your phone supports eSIM (iPhone XS+, Pixel 3+, Samsung S20+)' },
              { step: '2', title: 'Choose & Purchase', desc: 'Pick a provider and data plan for your destination' },
              { step: '3', title: 'Scan QR Code', desc: 'Open camera, scan the QR code from the provider' },
              { step: '4', title: 'Connect & Go', desc: 'Activate the eSIM and enjoy instant connectivity' },
            ].map(item => (
              <div key={item.step} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" /> eSIM Pro Tips for Travelers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-500" /> Install Before You Fly</h5>
              <p className="text-xs text-muted-foreground">Download and install your eSIM while on WiFi before departure. Activate data when you land.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-blue-500" /> Use Regional Plans</h5>
              <p className="text-xs text-muted-foreground">Traveling across Europe or Asia? Regional plans are often cheaper than country-specific ones.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-green-500" /> Keep Your Main Number</h5>
              <p className="text-xs text-muted-foreground">Your eSIM runs alongside your primary SIM. Keep your WhatsApp and calls on your main number.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Compare Before Buying</h5>
              <p className="text-xs text-muted-foreground">Prices vary significantly. Compare cost per GB across providers for your specific destination.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
