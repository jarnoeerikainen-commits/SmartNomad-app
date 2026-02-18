import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, ExternalLink, Star, CheckCircle, DollarSign, Plane, Heart,
  Briefcase, GraduationCap, Users, Globe, AlertCircle, TrendingUp,
  Clock, Search, Award, Zap
} from 'lucide-react';

interface InsuranceProvider {
  name: string;
  category: 'basic' | 'premium' | 'student' | 'business' | 'family' | 'annual';
  description: string;
  coverage: string[];
  highlights: string[];
  pricing: { daily?: string; weekly?: string; monthly?: string; annual?: string };
  rating: number;
  url: string;
  recommended?: boolean;
  maxTripDuration?: string;
  regions: string[];
}

const SITUATION_PRESETS = [
  { id: 'nomad', label: '🏝️ Digital Nomad', desc: 'Long-term, subscription-based', categories: ['annual', 'premium'] },
  { id: 'adventure', label: '🧗 Adventure Travel', desc: 'Activities & sports covered', categories: ['premium'] },
  { id: 'family', label: '👨‍👩‍👧‍👦 Family Trip', desc: 'Kids covered, cancellation', categories: ['family'] },
  { id: 'student', label: '🎓 Study Abroad', desc: 'Budget-friendly, long stays', categories: ['student'] },
  { id: 'business', label: '💼 Business Travel', desc: 'Equipment, political evac', categories: ['business'] },
  { id: 'budget', label: '💰 Budget Traveler', desc: 'Cheapest solid coverage', categories: ['basic'] },
];

const providers: InsuranceProvider[] = [
  {
    name: 'World Nomads', category: 'premium',
    description: 'Designed for adventurous travelers with comprehensive coverage for 150+ activities.',
    coverage: ['Emergency medical up to $10M', 'Trip cancellation & interruption', 'Lost/stolen luggage & equipment', 'Adventure sports & activities', 'Emergency evacuation', '24/7 emergency assistance'],
    highlights: ['Covers 150+ adventure activities', 'Buy & extend while traveling', 'Claims online from anywhere', 'No age limit for coverage'],
    pricing: { weekly: 'From $50/week', monthly: 'From $180/month', annual: 'From $600/year' },
    rating: 4.8, url: 'https://www.worldnomads.com', recommended: true,
    maxTripDuration: 'Up to 1 year', regions: ['Worldwide', 'Including USA'],
  },
  {
    name: 'SafetyWing', category: 'annual',
    description: 'Subscription-based global health insurance for remote workers and digital nomads.',
    coverage: ['Overall medical coverage $250k', 'Medical expenses outside home', 'Emergency medical evacuation', 'Travel delays', 'Lost checked luggage', 'Natural disaster coverage'],
    highlights: ['Subscribe monthly, cancel anytime', 'Auto-renewal for long-term travel', 'Covers in 180+ countries', 'Includes home country visits (limited)'],
    pricing: { monthly: 'From $45.08/4 weeks', annual: 'From $588/year' },
    rating: 4.7, url: 'https://safetywing.com', recommended: true,
    maxTripDuration: 'Unlimited (subscription)', regions: ['Worldwide', 'Limited USA coverage'],
  },
  {
    name: 'Allianz Travel Insurance', category: 'basic',
    description: 'Trusted global brand with multiple plan tiers and quick online purchase.',
    coverage: ['Emergency medical up to $50k-$100k', 'Trip cancellation up to trip cost', 'Baggage loss/delay coverage', 'Emergency transportation', '24/7 hotline assistance', 'Pre-existing condition coverage available'],
    highlights: ['Trusted global brand', 'Multiple plan tiers', 'Quick online purchase', 'Mobile app for claims'],
    pricing: { daily: 'From $9/day', weekly: 'From $40/week', annual: 'From $200/year' },
    rating: 4.5, url: 'https://www.allianztravelinsurance.com',
    maxTripDuration: 'Up to 180 days', regions: ['Worldwide'],
  },
  {
    name: 'IMG Global', category: 'business',
    description: 'Specialized insurance for business travelers and expatriates with corporate solutions.',
    coverage: ['Medical coverage up to $8M', 'Business equipment protection', 'Political evacuation', 'Kidnap & ransom coverage', 'Trip interruption for business', 'Emergency reunion expenses'],
    highlights: ['Corporate group policies', 'Executive protection options', 'Worldwide medical network', 'Dedicated account management'],
    pricing: { monthly: 'From $150/month', annual: 'From $1,200/year' },
    rating: 4.6, url: 'https://www.imglobal.com',
    maxTripDuration: 'Up to 364 days', regions: ['Worldwide', 'Including USA'],
  },
  {
    name: 'ISO Student Travel Insurance', category: 'student',
    description: 'Affordable coverage specifically designed for international students and study abroad.',
    coverage: ['Medical coverage up to $500k', 'Mental health coverage', 'Study interruption benefit', 'Lost passport assistance', 'Sports & activities coverage', 'Emergency evacuation'],
    highlights: ['Budget-friendly for students', 'Covers entire study period', 'Mental health included', 'No deductible options'],
    pricing: { monthly: 'From $35/month', annual: 'From $300/year' },
    rating: 4.4, url: 'https://www.isoa.org',
    maxTripDuration: 'Up to 4 years', regions: ['Worldwide'],
  },
  {
    name: 'Travelex Insurance', category: 'family',
    description: 'Family-focused plans with free kids coverage and comprehensive trip protection.',
    coverage: ['Emergency medical up to $50k-$100k', 'Family trip cancellation', 'Kids covered at no extra cost', 'Pre-existing conditions covered', 'Rental car damage', 'Missed connection coverage'],
    highlights: ['Children under 17 free', 'Family-friendly benefits', 'Cancel for any reason option', 'Trip delay coverage'],
    pricing: { weekly: 'From $100/week (family)', monthly: 'From $350/month (family)', annual: 'From $800/year (family)' },
    rating: 4.5, url: 'https://www.travelexinsurance.com',
    maxTripDuration: 'Up to 180 days', regions: ['Worldwide'],
  },
  {
    name: 'GeoBlue', category: 'premium',
    description: 'Premium international health insurance with direct billing and concierge services.',
    coverage: ['Medical coverage up to $2M-$8M', 'Direct billing worldwide', 'Evacuation & repatriation', 'Mental health coverage', 'Maternity coverage', 'Prescription medication'],
    highlights: ['Global provider network', 'No claim forms for network providers', 'Concierge medical services', 'Telehealth included'],
    pricing: { monthly: 'From $120/month', annual: 'From $1,200/year' },
    rating: 4.7, url: 'https://www.geobluetravelinsurance.com',
    maxTripDuration: 'Up to 364 days', regions: ['Worldwide', 'Including USA'],
  },
  {
    name: 'Cigna Global', category: 'business',
    description: 'Comprehensive global health insurance for international assignments and expats.',
    coverage: ['Medical up to unlimited', 'Outpatient & inpatient care', 'Dental & vision care', 'Emergency evacuation', 'Wellness programs', 'Cancer & chronic care'],
    highlights: ['Premium healthcare network', 'Corporate wellness programs', 'Multi-country coverage', 'Dedicated customer service'],
    pricing: { monthly: 'From $200/month', annual: 'From $2,000/year' },
    rating: 4.6, url: 'https://www.cignaglobal.com',
    maxTripDuration: 'Unlimited', regions: ['Worldwide'],
  },
  {
    name: 'Seven Corners', category: 'annual',
    description: 'Flexible multi-trip annual plans for frequent international travelers.',
    coverage: ['Medical coverage up to $1M', 'Multiple trips per year', 'Trip cancellation/interruption', 'Emergency evacuation', 'Baggage protection', 'Adventure sports coverage'],
    highlights: ['Unlimited trips per year', 'Covers trips up to 90 days', 'Competitive pricing', 'Quick online quotes'],
    pricing: { annual: 'From $400/year' },
    rating: 4.5, url: 'https://www.sevencorners.com',
    maxTripDuration: 'Multiple trips up to 90 days each', regions: ['Worldwide'],
  },
  {
    name: 'HTH Worldwide', category: 'premium',
    description: 'Specialized in international medical insurance with terrorism and COVID coverage.',
    coverage: ['Medical coverage up to $2M', 'Emergency evacuation & repatriation', 'Trip interruption', 'Terrorism coverage', 'Adventure sports included', 'COVID-19 coverage'],
    highlights: ['A+ rated insurer', 'Global assistance team', 'No destination restrictions', 'Flexible plan options'],
    pricing: { monthly: 'From $100/month', annual: 'From $900/year' },
    rating: 4.6, url: 'https://www.hthtravelinsurance.com',
    maxTripDuration: 'Up to 364 days', regions: ['Worldwide'],
  },
];

const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ReactNode> = {
    basic: <Shield className="h-3.5 w-3.5" />,
    premium: <TrendingUp className="h-3.5 w-3.5" />,
    student: <GraduationCap className="h-3.5 w-3.5" />,
    business: <Briefcase className="h-3.5 w-3.5" />,
    family: <Users className="h-3.5 w-3.5" />,
    annual: <Clock className="h-3.5 w-3.5" />,
  };
  return icons[category] || <Shield className="h-3.5 w-3.5" />;
};

const TravelInsurance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const filteredProviders = useMemo(() => {
    let filtered = providers;

    if (activePreset) {
      const preset = SITUATION_PRESETS.find(p => p.id === activePreset);
      if (preset) {
        filtered = filtered.filter(p => preset.categories.includes(p.category));
      }
    }

    if (activeTab !== 'all') {
      filtered = filtered.filter(p => p.category === activeTab);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.coverage.some(c => c.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [activeTab, searchQuery, activePreset]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl gradient-trust">
          <Shield className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Travel Insurance</h1>
          <p className="text-muted-foreground">Comprehensive coverage from top providers worldwide</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Providers</p><p className="text-2xl font-bold">{providers.length}</p></div><Shield className="h-6 w-6 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Recommended</p><p className="text-2xl font-bold">{providers.filter(p => p.recommended).length}</p></div><Star className="h-6 w-6 text-yellow-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Starting From</p><p className="text-2xl font-bold">$9/day</p></div><DollarSign className="h-6 w-6 text-green-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Coverage</p><p className="text-2xl font-bold">Global</p></div><Globe className="h-6 w-6 text-blue-500" /></div></CardContent></Card>
      </div>

      {/* Situation Presets */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Quick Pick — Who are you?</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {SITUATION_PRESETS.map(preset => (
            <Button
              key={preset.id}
              variant={activePreset === preset.id ? 'default' : 'outline'}
              size="sm"
              className="h-auto py-2 px-3 flex flex-col items-start text-left"
              onClick={() => { setActivePreset(activePreset === preset.id ? null : preset.id); setActiveTab('all'); }}
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
              <Input placeholder="Search providers, coverage types..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setActivePreset(null); }}>
              <TabsList className="flex-wrap">
                <TabsTrigger value="all" className="gap-1"><Shield className="h-3 w-3" />All</TabsTrigger>
                <TabsTrigger value="basic" className="gap-1">Basic</TabsTrigger>
                <TabsTrigger value="premium" className="gap-1">Premium</TabsTrigger>
                <TabsTrigger value="student" className="gap-1">Student</TabsTrigger>
                <TabsTrigger value="business" className="gap-1">Business</TabsTrigger>
                <TabsTrigger value="family" className="gap-1">Family</TabsTrigger>
                <TabsTrigger value="annual" className="gap-1">Annual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">Showing {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}</p>

      {/* Provider Cards */}
      <div className="space-y-4">
        {filteredProviders.map(provider => (
          <Card key={provider.name} className={`transition-all hover:shadow-lg ${provider.recommended ? 'border-primary/40 border-2' : ''}`}>
            <CardContent className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-xl">{provider.name}</h4>
                    {provider.recommended && <Badge variant="default" className="gap-1 text-xs"><Award className="w-3 h-3" />Recommended</Badge>}
                    <Badge variant="outline" className="capitalize gap-1 text-xs">
                      {getCategoryIcon(provider.category)}
                      {provider.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
                <Button asChild className="shrink-0">
                  <a href={provider.url} target="_blank" rel="noopener noreferrer">Get Quote <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></a>
                </Button>
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-y border-border">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Duration</div>
                    <div className="font-semibold text-sm">{provider.maxTripDuration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Regions</div>
                    <div className="font-semibold text-sm">{provider.regions.join(', ')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-[10px] text-muted-foreground">Best Price</div>
                    <div className="font-semibold text-sm">{provider.pricing.daily || provider.pricing.weekly || provider.pricing.monthly || provider.pricing.annual}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                  ))}
                  <span className="text-sm font-semibold ml-1">{provider.rating}</span>
                </div>
              </div>

              {/* Coverage + Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1"><Heart className="h-3 w-3 text-destructive" />Coverage Includes</h5>
                  <div className="space-y-1">
                    {provider.coverage.map(item => (
                      <div key={item} className="flex items-start gap-1.5 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" />Highlights</h5>
                  <div className="space-y-1">
                    {provider.highlights.map(h => (
                      <div key={h} className="flex items-center gap-1.5 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                  {/* Pricing pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {provider.pricing.daily && <div className="bg-green-500/10 px-3 py-1.5 rounded-lg"><p className="text-[10px] text-muted-foreground">Daily</p><p className="text-xs font-bold text-green-600">{provider.pricing.daily}</p></div>}
                    {provider.pricing.weekly && <div className="bg-blue-500/10 px-3 py-1.5 rounded-lg"><p className="text-[10px] text-muted-foreground">Weekly</p><p className="text-xs font-bold text-blue-600">{provider.pricing.weekly}</p></div>}
                    {provider.pricing.monthly && <div className="bg-yellow-500/10 px-3 py-1.5 rounded-lg"><p className="text-[10px] text-muted-foreground">Monthly</p><p className="text-xs font-bold text-yellow-600">{provider.pricing.monthly}</p></div>}
                    {provider.pricing.annual && <div className="bg-primary/10 px-3 py-1.5 rounded-lg"><p className="text-[10px] text-muted-foreground">Annual</p><p className="text-xs font-bold text-primary">{provider.pricing.annual}</p></div>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No providers match your criteria.</p></CardContent></Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2"><AlertCircle className="h-5 w-5" />Travel Insurance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><Plane className="w-3.5 h-3.5 text-primary" />Buy Before You Travel</h5>
              <p className="text-xs text-muted-foreground">Purchase as soon as you book for maximum coverage including trip cancellation benefits.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-destructive" />Check Medical Coverage</h5>
              <p className="text-xs text-muted-foreground">Ensure adequate emergency medical and evacuation coverage for your destination.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-500" />Read the Fine Print</h5>
              <p className="text-xs text-muted-foreground">Understand exclusions, deductibles, and what documentation is required for claims.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-blue-500" />Consider Annual Plans</h5>
              <p className="text-xs text-muted-foreground">If you travel 3+ times/year, annual multi-trip policies are usually more cost-effective.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelInsurance;
