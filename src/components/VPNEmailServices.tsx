import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, Shield, Lock, ExternalLink, Star, Globe, Zap,
  CheckCircle, DollarSign, Search, Eye, Server, Fingerprint,
  Award
} from 'lucide-react';

interface Service {
  name: string;
  category: 'email' | 'vpn';
  description: string;
  features: string[];
  pricing: { free?: string; paid: string };
  rating: number;
  url: string;
  recommended?: boolean;
  jurisdiction: string;
  bestFor: string[];
  noLogs: boolean;
  openSource: boolean;
}

const SITUATION_PRESETS = [
  { id: 'nomad', label: '🏝️ Digital Nomad', desc: 'Full privacy stack', categories: ['vpn', 'email'] as const },
  { id: 'privacy', label: '🔒 Max Privacy', desc: 'Open-source, no-logs only', categories: ['vpn', 'email'] as const, filterFn: (s: Service) => s.noLogs && s.openSource },
  { id: 'budget', label: '💰 Free Options', desc: 'Best free tiers available', categories: ['vpn', 'email'] as const, filterFn: (s: Service) => !!s.pricing.free },
  { id: 'business', label: '💼 Business', desc: 'Corporate features & support', categories: ['vpn', 'email'] as const },
];

const services: Service[] = [
  {
    name: 'Proton Mail', category: 'email',
    description: 'Swiss-based encrypted email with end-to-end encryption and zero-access architecture.',
    features: ['End-to-end encryption', 'Zero-access encryption', 'Anonymous sign-up', 'Swiss privacy laws', 'Custom domain support', 'Calendar & Drive included'],
    pricing: { free: 'Up to 1GB storage', paid: 'From $4.99/month' },
    rating: 4.8, url: 'https://proton.me/mail', recommended: true,
    jurisdiction: '🇨🇭 Switzerland', bestFor: ['Privacy-first users', 'Professionals'], noLogs: true, openSource: true,
  },
  {
    name: 'Tuta Mail', category: 'email',
    description: 'German-based secure email with automatic encryption and built-in calendar.',
    features: ['Automatic encryption', 'Encrypted calendar', 'Anonymous registration', 'GDPR compliant', 'Open source', 'Custom domains'],
    pricing: { free: 'Up to 1GB storage', paid: 'From $3/month' },
    rating: 4.6, url: 'https://tuta.com',
    jurisdiction: '🇩🇪 Germany', bestFor: ['Budget-conscious', 'EU privacy'], noLogs: true, openSource: true,
  },
  {
    name: 'StartMail', category: 'email',
    description: 'Privacy-focused email with unlimited disposable aliases and PGP encryption.',
    features: ['Unlimited aliases', 'PGP encryption', 'No tracking', 'Dutch privacy laws', '10GB storage', 'IMAP support'],
    pricing: { paid: 'From $5.95/month' },
    rating: 4.5, url: 'https://www.startmail.com',
    jurisdiction: '🇳🇱 Netherlands', bestFor: ['Alias power users', 'Anti-tracking'], noLogs: true, openSource: false,
  },
  {
    name: 'Mailfence', category: 'email',
    description: 'Belgian secure email suite with calendar, documents, and contact management.',
    features: ['End-to-end encryption', 'Digital signatures', 'Calendar & documents', 'No ads', 'GDPR compliant', 'Groups & contacts'],
    pricing: { free: 'Up to 500MB', paid: 'From $2.50/month' },
    rating: 4.4, url: 'https://mailfence.com',
    jurisdiction: '🇧🇪 Belgium', bestFor: ['All-in-one suite', 'Teams'], noLogs: true, openSource: false,
  },
  {
    name: 'Skiff Mail', category: 'email',
    description: 'Privacy-first workspace with email, pages, drive & calendar — end-to-end encrypted.',
    features: ['E2E encrypted workspace', 'Custom domains', 'Crypto wallet login', 'Pages & Drive', 'Calendar', 'No tracking'],
    pricing: { free: '10GB storage', paid: 'From $3/month' },
    rating: 4.3, url: 'https://skiff.com',
    jurisdiction: '🇺🇸 USA (encrypted)', bestFor: ['Web3 users', 'Workspace needs'], noLogs: true, openSource: true,
  },
  // VPNs
  {
    name: 'ProtonVPN', category: 'vpn',
    description: 'High-speed Swiss VPN with strong encryption and no-logs policy, from the Proton team.',
    features: ['No-logs policy', 'Swiss privacy', 'Kill switch', 'DNS leak protection', 'Split tunneling', 'Secure Core servers'],
    pricing: { free: '3 countries, 1 device', paid: 'From $4.99/month' },
    rating: 4.7, url: 'https://protonvpn.com', recommended: true,
    jurisdiction: '🇨🇭 Switzerland', bestFor: ['Privacy maximalists', 'Free tier users'], noLogs: true, openSource: true,
  },
  {
    name: 'NordVPN', category: 'vpn',
    description: 'Leading VPN with 6000+ servers, threat protection, and meshnet for secure connections.',
    features: ['6000+ servers', 'Double VPN', 'Threat Protection', 'Meshnet feature', '6 devices', 'Onion over VPN'],
    pricing: { paid: 'From $3.39/month' },
    rating: 4.7, url: 'https://nordvpn.com', recommended: true,
    jurisdiction: '🇵🇦 Panama', bestFor: ['Speed priority', 'Streaming'], noLogs: true, openSource: false,
  },
  {
    name: 'ExpressVPN', category: 'vpn',
    description: 'Ultra-fast VPN with servers in 94 countries, proprietary Lightway protocol.',
    features: ['Ultra-fast Lightway', '94 countries', 'Split tunneling', 'No activity logs', '5 devices', 'Router app'],
    pricing: { paid: 'From $6.67/month' },
    rating: 4.6, url: 'https://expressvpn.com',
    jurisdiction: '🇻🇬 British Virgin Islands', bestFor: ['Speed & reliability', 'China/UAE'], noLogs: true, openSource: false,
  },
  {
    name: 'Mullvad VPN', category: 'vpn',
    description: 'Ultimate privacy VPN — no email needed, anonymous accounts, flat pricing.',
    features: ['Anonymous accounts', 'No logs', 'WireGuard protocol', 'Multihop', 'Cash payments accepted', 'No email required'],
    pricing: { paid: '€5/month flat rate' },
    rating: 4.5, url: 'https://mullvad.net',
    jurisdiction: '🇸🇪 Sweden', bestFor: ['Anonymous usage', 'Maximum privacy'], noLogs: true, openSource: true,
  },
  {
    name: 'Surfshark', category: 'vpn',
    description: 'Unlimited devices VPN with CleanWeb ad blocker and excellent value pricing.',
    features: ['Unlimited devices', 'CleanWeb ad blocker', 'MultiHop', 'Camouflage mode', 'GPS spoofing', 'NoBorders mode'],
    pricing: { paid: 'From $2.49/month' },
    rating: 4.5, url: 'https://surfshark.com',
    jurisdiction: '🇳🇱 Netherlands', bestFor: ['Families', 'Budget VPN', 'Many devices'], noLogs: true, openSource: false,
  },
  {
    name: 'Windscribe', category: 'vpn',
    description: 'Generous free plan VPN with built-in ad blocker and firewall protection.',
    features: ['Built-in ad blocker', 'Firewall', 'R.O.B.E.R.T.', 'Port forwarding', 'Static IPs', 'Browser extensions'],
    pricing: { free: '10GB/month', paid: 'From $5.75/month' },
    rating: 4.4, url: 'https://windscribe.com',
    jurisdiction: '🇨🇦 Canada', bestFor: ['Free tier users', 'Ad blocking'], noLogs: true, openSource: false,
  },
];

const VPNEmailServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    let filtered = services;

    if (activePreset) {
      const preset = SITUATION_PRESETS.find(p => p.id === activePreset);
      if (preset?.filterFn) {
        filtered = filtered.filter(preset.filterFn);
      }
    }

    if (activeTab !== 'all') {
      filtered = filtered.filter(s => s.category === activeTab);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.jurisdiction.toLowerCase().includes(q) ||
        s.bestFor.some(b => b.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [activeTab, searchQuery, activePreset]);

  const emailCount = services.filter(s => s.category === 'email').length;
  const vpnCount = services.filter(s => s.category === 'vpn').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">VPN & Secure Email</h1>
          <p className="text-muted-foreground">Protect your privacy with encrypted services worldwide</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Email Services</p><p className="text-2xl font-bold">{emailCount}</p></div><Mail className="h-6 w-6 text-blue-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">VPN Services</p><p className="text-2xl font-bold">{vpnCount}</p></div><Globe className="h-6 w-6 text-purple-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Open Source</p><p className="text-2xl font-bold">{services.filter(s => s.openSource).length}</p></div><Fingerprint className="h-6 w-6 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Free Tiers</p><p className="text-2xl font-bold">{services.filter(s => s.pricing.free).length}</p></div><DollarSign className="h-6 w-6 text-yellow-500" /></div></CardContent></Card>
      </div>

      {/* Situation Presets */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Quick Pick — Your use case</h3>
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
              <Input placeholder="Search services, jurisdictions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setActivePreset(null); }}>
              <TabsList>
                <TabsTrigger value="all" className="gap-1"><Shield className="h-3.5 w-3.5" />All</TabsTrigger>
                <TabsTrigger value="email" className="gap-1"><Mail className="h-3.5 w-3.5" />Email</TabsTrigger>
                <TabsTrigger value="vpn" className="gap-1"><Globe className="h-3.5 w-3.5" />VPN</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">Showing {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}</p>

      {/* Service Cards */}
      <div className="space-y-4">
        {filteredServices.map(service => (
          <Card key={service.name} className={`transition-all hover:shadow-lg ${service.recommended ? 'border-primary/40 border-2' : ''}`}>
            <CardContent className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-xl">{service.name}</h4>
                    {service.recommended && <Badge variant="default" className="gap-1 text-xs"><Award className="w-3 h-3" />Recommended</Badge>}
                    <Badge variant="outline" className="text-xs gap-1">
                      {service.category === 'email' ? <Mail className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                      {service.category.toUpperCase()}
                    </Badge>
                    {service.openSource && <Badge variant="secondary" className="text-xs">Open Source</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
                <Button asChild size="sm" className="shrink-0">
                  <a href={service.url} target="_blank" rel="noopener noreferrer">Visit <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></a>
                </Button>
              </div>

              {/* Key Info Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-y border-border">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Jurisdiction</div>
                    <div className="font-semibold text-sm">{service.jurisdiction}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">No-Logs</div>
                    <div className="font-semibold text-sm">{service.noLogs ? '✅ Verified' : '❌ No'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">{service.pricing.free ? 'Free Tier' : 'Paid'}</div>
                    <div className="font-semibold text-sm">{service.pricing.free || service.pricing.paid}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(service.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                  ))}
                  <span className="text-sm font-semibold ml-1">{service.rating}</span>
                </div>
              </div>

              {/* Features + Best For */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-semibold text-muted-foreground mb-1.5">Key Features</h5>
                  <div className="grid grid-cols-2 gap-1.5">
                    {service.features.map(f => (
                      <div key={f} className="flex items-center gap-1.5 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-muted-foreground mb-1.5">Best For</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {service.bestFor.map(b => (
                      <Badge key={b} variant="outline" className="text-xs">{b}</Badge>
                    ))}
                  </div>
                  {service.pricing.paid && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <DollarSign className="w-3 h-3 inline" /> Paid: <span className="font-medium">{service.pricing.paid}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No services match your criteria.</p></CardContent></Card>
      )}

      {/* Privacy Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2"><Lock className="h-5 w-5" />Privacy Tips for Digital Nomads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-500" />Always Use VPN on Public WiFi</h5>
              <p className="text-xs text-muted-foreground">Cafes, airports, hotels — always encrypt your connection on shared networks.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-500" />Use Encrypted Email</h5>
              <p className="text-xs text-muted-foreground">Switch to E2E encrypted email for sensitive communications — tax docs, contracts, personal info.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-500" />Enable 2FA Everywhere</h5>
              <p className="text-xs text-muted-foreground">Use TOTP authenticator apps (not SMS) for all important accounts.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-purple-500" />Choose Privacy-Friendly Jurisdictions</h5>
              <p className="text-xs text-muted-foreground">Prefer services based in Switzerland, Iceland, Netherlands, or Panama for stronger legal protection.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VPNEmailServices;
