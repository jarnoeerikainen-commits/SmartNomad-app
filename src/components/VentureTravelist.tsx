import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, Building2, Globe, DollarSign, Search, 
  MapPin, Star, ArrowUpRight, Shield, Sparkles, Crown
} from 'lucide-react';

interface CityInvestment {
  city: string;
  country: string;
  flag: string;
  realEstateYield: number;
  goldenVisaThreshold: number | null;
  goldenVisaCurrency: string;
  startupHubRating: number; // 1-10
  taxBenefit: string;
  highlights: string[];
  propertyPricePerSqm: number;
  nomadVisaAvailable: boolean;
  trend: 'rising' | 'stable' | 'cooling';
  riskLevel: 'low' | 'medium' | 'high';
}

const INVESTMENT_DATA: CityInvestment[] = [
  {
    city: 'Lisbon', country: 'Portugal', flag: '🇵🇹',
    realEstateYield: 5.8, goldenVisaThreshold: 500000, goldenVisaCurrency: '€',
    startupHubRating: 8, taxBenefit: 'NHR regime: 20% flat tax for 10 years',
    highlights: ['Web Summit HQ', 'Strong rental demand', 'EU residency path'],
    propertyPricePerSqm: 4200, nomadVisaAvailable: true, trend: 'rising', riskLevel: 'low',
  },
  {
    city: 'Dubai', country: 'UAE', flag: '🇦🇪',
    realEstateYield: 7.2, goldenVisaThreshold: 2000000, goldenVisaCurrency: 'AED',
    startupHubRating: 9, taxBenefit: '0% income tax, 0% capital gains',
    highlights: ['Free zone companies', 'Expo City legacy', 'Crypto-friendly'],
    propertyPricePerSqm: 3800, nomadVisaAvailable: true, trend: 'rising', riskLevel: 'medium',
  },
  {
    city: 'Singapore', country: 'Singapore', flag: '🇸🇬',
    realEstateYield: 3.5, goldenVisaThreshold: null, goldenVisaCurrency: 'SGD',
    startupHubRating: 10, taxBenefit: 'Max 22% income tax, no capital gains tax',
    highlights: ['Asia HQ hub', 'Strong IP protection', 'Family office incentives'],
    propertyPricePerSqm: 18500, nomadVisaAvailable: false, trend: 'stable', riskLevel: 'low',
  },
  {
    city: 'Bangkok', country: 'Thailand', flag: '🇹🇭',
    realEstateYield: 6.1, goldenVisaThreshold: null, goldenVisaCurrency: 'THB',
    startupHubRating: 7, taxBenefit: 'LTR visa: 17% flat tax for qualified professionals',
    highlights: ['Low cost of living', 'Growing tech scene', 'Condo market boom'],
    propertyPricePerSqm: 2100, nomadVisaAvailable: true, trend: 'rising', riskLevel: 'medium',
  },
  {
    city: 'Barcelona', country: 'Spain', flag: '🇪🇸',
    realEstateYield: 4.9, goldenVisaThreshold: 500000, goldenVisaCurrency: '€',
    startupHubRating: 8, taxBenefit: 'Beckham Law: 24% flat tax for 6 years',
    highlights: ['Mediterranean lifestyle', 'Strong startup ecosystem', 'EU access'],
    propertyPricePerSqm: 4800, nomadVisaAvailable: true, trend: 'stable', riskLevel: 'low',
  },
  {
    city: 'Bali', country: 'Indonesia', flag: '🇮🇩',
    realEstateYield: 8.5, goldenVisaThreshold: 350000, goldenVisaCurrency: '$',
    startupHubRating: 5, taxBenefit: 'New Golden Visa: 5-10 year residency',
    highlights: ['Highest yields in Asia', 'Digital nomad hub', 'New 2nd Home Visa'],
    propertyPricePerSqm: 1800, nomadVisaAvailable: true, trend: 'rising', riskLevel: 'high',
  },
  {
    city: 'Miami', country: 'United States', flag: '🇺🇸',
    realEstateYield: 5.4, goldenVisaThreshold: null, goldenVisaCurrency: '$',
    startupHubRating: 8, taxBenefit: '0% state income tax (Florida)',
    highlights: ['LatAm gateway', 'Crypto capital', 'No state tax'],
    propertyPricePerSqm: 6200, nomadVisaAvailable: false, trend: 'stable', riskLevel: 'low',
  },
  {
    city: 'Tbilisi', country: 'Georgia', flag: '🇬🇪',
    realEstateYield: 9.2, goldenVisaThreshold: null, goldenVisaCurrency: 'GEL',
    startupHubRating: 6, taxBenefit: '1% revenue tax for small businesses',
    highlights: ['Lowest entry cost', 'Freelancer paradise', 'Easy residency'],
    propertyPricePerSqm: 950, nomadVisaAvailable: true, trend: 'rising', riskLevel: 'medium',
  },
  {
    city: 'Athens', country: 'Greece', flag: '🇬🇷',
    realEstateYield: 5.6, goldenVisaThreshold: 250000, goldenVisaCurrency: '€',
    startupHubRating: 6, taxBenefit: '7% flat tax on foreign income for retirees',
    highlights: ['Cheapest EU Golden Visa', 'Strong Airbnb market', 'Growing tech'],
    propertyPricePerSqm: 2800, nomadVisaAvailable: true, trend: 'rising', riskLevel: 'medium',
  },
  {
    city: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾',
    realEstateYield: 5.0, goldenVisaThreshold: null, goldenVisaCurrency: 'MYR',
    startupHubRating: 7, taxBenefit: 'MM2H: foreign income not taxed',
    highlights: ['Low cost luxury', 'International schools', 'Healthcare hub'],
    propertyPricePerSqm: 2400, nomadVisaAvailable: true, trend: 'stable', riskLevel: 'low',
  },
  {
    city: 'Tallinn', country: 'Estonia', flag: '🇪🇪',
    realEstateYield: 4.8, goldenVisaThreshold: null, goldenVisaCurrency: '€',
    startupHubRating: 9, taxBenefit: 'e-Residency: 0% corp tax on reinvested profits',
    highlights: ['Most digital government', 'e-Residency', 'EU startup hub'],
    propertyPricePerSqm: 3200, nomadVisaAvailable: true, trend: 'stable', riskLevel: 'low',
  },
  {
    city: 'Medellín', country: 'Colombia', flag: '🇨🇴',
    realEstateYield: 7.8, goldenVisaThreshold: null, goldenVisaCurrency: '$',
    startupHubRating: 6, taxBenefit: 'Territorial tax: foreign income not taxed',
    highlights: ['Spring climate year-round', 'Growing nomad scene', 'Low cost'],
    propertyPricePerSqm: 1200, nomadVisaAvailable: true, trend: 'rising', riskLevel: 'high',
  },
  {
    city: 'Mumbai', country: 'India', flag: '🇮🇳',
    realEstateYield: 4.2, goldenVisaThreshold: null, goldenVisaCurrency: '₹',
    startupHubRating: 9, taxBenefit: '120-day NRI safe harbor (Income Tax Bill 2025)',
    highlights: ['240K+ millionaire households', 'Navi Mumbai Int\'l Airport (2025)', 'UPI One World payments', 'GIFT City IFSC hub'],
    propertyPricePerSqm: 7500, nomadVisaAvailable: false, trend: 'rising', riskLevel: 'medium',
  },
  {
    city: 'Bengaluru', country: 'India', flag: '🇮🇳',
    realEstateYield: 5.1, goldenVisaThreshold: null, goldenVisaCurrency: '₹',
    startupHubRating: 10, taxBenefit: 'Startup India: 3-year tax holiday for DPIIT startups',
    highlights: ['Asia\'s Silicon Valley', '#3 global startup hub', 'Premium co-living boom', 'Whitefield tech corridor'],
    propertyPricePerSqm: 3200, nomadVisaAvailable: false, trend: 'rising', riskLevel: 'low',
  },
];

const TREND_ICONS = {
  rising: { icon: '📈', color: 'text-green-600', label: 'Rising' },
  stable: { icon: '📊', color: 'text-blue-600', label: 'Stable' },
  cooling: { icon: '📉', color: 'text-orange-600', label: 'Cooling' },
};

const RISK_COLORS = {
  low: 'bg-green-500/10 text-green-700 border-green-500/30',
  medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
  high: 'bg-red-500/10 text-red-700 border-red-500/30',
};

const VentureTravelist: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'yield' | 'price' | 'startup'>('yield');

  const filtered = INVESTMENT_DATA
    .filter(c => 
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'yield') return b.realEstateYield - a.realEstateYield;
      if (sortBy === 'price') return a.propertyPricePerSqm - b.propertyPricePerSqm;
      return b.startupHubRating - a.startupHubRating;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Venture Travelist</h1>
            <p className="text-muted-foreground">Investment intelligence for global nomads</p>
          </div>
          <Badge className="ml-auto" variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" /> AI-Curated
          </Badge>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search cities or countries..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['yield', 'price', 'startup'] as const).map(s => (
            <Button key={s} size="sm" variant={sortBy === s ? 'default' : 'outline'} onClick={() => setSortBy(s)}>
              {s === 'yield' ? '% Yield' : s === 'price' ? '$ Price' : '🚀 Startup'}
            </Button>
          ))}
        </div>
      </div>

      {/* Top Insight Banner */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 text-sm">
            <Crown className="h-4 w-4 text-primary" />
            <span className="font-medium">Top Pick:</span>
            <span className="text-muted-foreground">
              Tbilisi offers 9.2% yields at €950/sqm — the highest return-to-entry-cost ratio for 2025.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* City Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(city => (
          <Card key={city.city} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{city.flag}</span>
                  <div>
                    <CardTitle className="text-lg">{city.city}</CardTitle>
                    <p className="text-xs text-muted-foreground">{city.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={RISK_COLORS[city.riskLevel]}>
                    <Shield className="h-3 w-3 mr-1" /> {city.riskLevel} risk
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-primary">{city.realEstateYield}%</div>
                  <div className="text-[10px] text-muted-foreground">Rental Yield</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="text-lg font-bold">€{city.propertyPricePerSqm.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground">Per sqm</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="text-lg font-bold">{city.startupHubRating}/10</div>
                  <div className="text-[10px] text-muted-foreground">Startup Score</div>
                </div>
              </div>

              {/* Golden Visa */}
              {city.goldenVisaThreshold && (
                <div className="flex items-center gap-2 text-sm bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                  <Globe className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-700 font-medium">
                    Golden Visa from {city.goldenVisaCurrency}{city.goldenVisaThreshold.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Tax Benefit */}
              <div className="flex items-start gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{city.taxBenefit}</span>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1.5">
                {city.highlights.map(h => (
                  <Badge key={h} variant="secondary" className="text-[10px]">{h}</Badge>
                ))}
                {city.nomadVisaAvailable && (
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                    🏝️ Nomad Visa
                  </Badge>
                )}
              </div>

              {/* Trend */}
              <div className="flex items-center justify-between pt-1 border-t">
                <div className="flex items-center gap-1 text-xs">
                  <span>{TREND_ICONS[city.trend].icon}</span>
                  <span className={TREND_ICONS[city.trend].color}>{TREND_ICONS[city.trend].label}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <ArrowUpRight className="h-3 w-3" /> Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>No cities match your search</p>
        </div>
      )}
    </div>
  );
};

export default VentureTravelist;
