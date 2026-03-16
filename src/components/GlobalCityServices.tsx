import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Globe2, MapPin, Star, Users, Search, ArrowLeft, ChevronRight,
  Sparkles, CheckCircle2, Clock, Shield, ExternalLink, Phone,
  Home, Wifi, Heart, Plane, Briefcase, Package, Truck, Scale, Wallet,
  RefreshCw, AlertCircle, ChevronDown, ChevronUp, DollarSign, Languages, ShieldCheck
} from 'lucide-react';
import { GLOBAL_CITIES, CITY_SERVICES, getCityById, getServicesForCity, getCitiesByTier } from '@/data/globalCities';
import { GlobalCity, CityService } from '@/types/cityServices';
import CityServicesAIService, { AIServiceCategory, AIServiceProvider } from '@/services/CityServicesAIService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Region Grouping ───
const REGIONS: Record<string, string[]> = {
  'North America': ['USA', 'CAN'],
  'Europe': ['GBR', 'FRA', 'DEU', 'NLD', 'ESP', 'CHE', 'SWE', 'DNK', 'AUT', 'IRL', 'ITA', 'BEL', 'FIN', 'NOR', 'POL', 'GRC', 'PRT'],
  'Asia Pacific': ['JPN', 'IND', 'CHN', 'SGP', 'KOR', 'HKG', 'TWN', 'MYS'],
  'Middle East': ['ARE', 'QAT', 'SAU', 'ISR'],
  'Oceania': ['AUS'],
};

const getRegion = (countryCode: string): string => {
  for (const [region, codes] of Object.entries(REGIONS)) {
    if (codes.includes(countryCode)) return region;
  }
  return 'Other';
};

const SERVICE_ICONS: Record<string, any> = {
  accommodation: Home, internet: Wifi, healthcare: Heart,
  transportation: Plane, professional: Briefcase, logistics: Package,
  delivery: Truck, legal: Scale, financial: Wallet, community: Users,
};

const SERVICE_LABELS: Record<string, string> = {
  accommodation: 'Co-Living', internet: 'Premium WiFi', healthcare: 'Healthcare',
  transportation: 'Transport & Lounges', professional: 'Co-Working', logistics: 'Laundry & Cleaning',
  delivery: 'Food Delivery', legal: 'Immigration & Legal', financial: 'Banking', community: 'Nomad Network',
};

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30',
  partial: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  planned: 'bg-muted text-muted-foreground border-border',
  not_available: 'bg-destructive/10 text-destructive border-destructive/30',
};

// ─── AI Provider Card ───
const ProviderCard = ({ provider }: { provider: AIServiceProvider }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-4 hover:shadow-md transition-all border-border/50">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="font-semibold text-sm truncate">{provider.name}</h5>
              {provider.verified && <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{provider.description}</p>
          </div>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-bold">{provider.rating}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {provider.priceRange && (
            <Badge variant="secondary" className="text-xs gap-1"><DollarSign className="h-3 w-3" />{provider.priceRange}</Badge>
          )}
          {provider.languages && provider.languages.length > 0 && (
            <Badge variant="outline" className="text-xs gap-1"><Languages className="h-3 w-3" />{provider.languages.slice(0, 2).join(', ')}</Badge>
          )}
        </div>
        {expanded && (
          <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{provider.address}</span>
            </div>
            {provider.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <a href={`tel:${provider.phone}`} className="text-primary hover:underline">{provider.phone}</a>
              </div>
            )}
            {provider.hours && (
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{provider.hours}</span>
              </div>
            )}
            {provider.highlights && provider.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {provider.highlights.map((h, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px]">{h}</Badge>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 pt-1">
          <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
            {expanded ? 'Less' : 'Details'}
          </Button>
          {provider.website && (
            <Button variant="outline" size="sm" className="text-xs h-7 px-2 ml-auto" onClick={() => window.open(provider.website, '_blank')}>
              <Globe2 className="h-3 w-3 mr-1" />Website<ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// ─── City Detail View ───
const CityDetailView = ({ city, onBack }: { city: GlobalCity; onBack: () => void }) => {
  const services = getServicesForCity(city.id);
  const available = services.filter(s => s.availabilityStatus === 'available').length;
  const [aiData, setAiData] = useState<AIServiceCategory[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check cache on mount
  useState(() => {
    const cached = CityServicesAIService.getCached(city.cityName);
    if (cached) setAiData(cached.categories);
  });

  const fetchAI = async () => {
    setLoading(true); setError(null);
    try {
      const result = await CityServicesAIService.fetchCityServices(city.cityName, city.countryName);
      setAiData(result.categories);
      toast.success(`Found ${result.categories.reduce((s, c) => s + c.providers.length, 0)} verified providers in ${city.cityName}`);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshAI = () => {
    CityServicesAIService.clearCache(city.cityName);
    fetchAI();
  };

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      <Card className="p-8 bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-1">{city.cityName}</h2>
            <p className="text-lg text-muted-foreground">{city.countryName}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{city.timezone}</span>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" />{(city.metroPopulation / 1000000).toFixed(1)}M</span>
              <span>{city.currencyCode} · {city.primaryLanguage}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">{city.coverageScore}</div>
            <div className="text-sm text-muted-foreground mt-1">Coverage Score</div>
            <Progress value={city.coverageScore} className="w-32 mt-2" />
          </div>
        </div>
      </Card>

      {/* ── All 10 Service Categories ── */}
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          All Services — {available}/10 Available
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(service => {
            const Icon = SERVICE_ICONS[service.serviceCategory] || CheckCircle2;
            const label = SERVICE_LABELS[service.serviceCategory] || service.serviceType;
            return (
              <Card key={service.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{label}</h4>
                      <Badge className={STATUS_STYLES[service.availabilityStatus]}>
                        {service.availabilityStatus === 'available' ? '✓ Available' :
                         service.availabilityStatus === 'partial' ? '◐ Partial' : '○ Planned'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{service.coverageNotes}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {service.userRating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {service.userRating}
                        </span>
                      )}
                      {service.providerCount > 0 && (
                        <span>{service.providerCount} providers</span>
                      )}
                      {service.responseTimeMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />~{service.responseTimeMinutes}min
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── AI Real Provider Research ── */}
      {!aiData && !loading && (
        <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Discover Real Verified Providers</h3>
          <p className="text-muted-foreground mb-5 max-w-lg mx-auto text-sm">
            AI researches real businesses in {city.cityName} — verified websites, phone numbers, addresses. All rated 4+ stars.
          </p>
          <Button size="lg" onClick={fetchAI} className="gap-2">
            <Sparkles className="h-5 w-5" /> Research {city.cityName} Providers
          </Button>
        </Card>
      )}

      {loading && (
        <Card className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <div>
              <h3 className="text-lg font-semibold">AI is researching providers...</h3>
              <p className="text-sm text-muted-foreground">Finding verified 4+ star businesses</p>
            </div>
          </div>
          <Progress value={undefined} className="animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-6 border-destructive/50">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <div><h4 className="font-semibold">Failed to load</h4><p className="text-sm text-muted-foreground">{error}</p></div>
            <Button variant="outline" className="ml-auto" onClick={fetchAI}>Retry</Button>
          </div>
        </Card>
      )}

      {aiData && aiData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {aiData.reduce((s, c) => s + c.providers.length, 0)} Verified Providers
            </h3>
            <Button variant="ghost" size="sm" onClick={refreshAI} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
          {aiData.map((cat, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h4 className="font-semibold text-lg">{cat.name}</h4>
                </div>
                <Badge variant="secondary">{cat.providers.length} providers</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.providers.map((p, j) => <ProviderCard key={j} provider={p} />)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───
const GlobalCityServices = () => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('tier1');

  const tier1Count = getCitiesByTier('tier1').length;
  const tier2Count = getCitiesByTier('tier2').length;
  const tier3Count = getCitiesByTier('tier3').length;

  // If a city is selected, show detail
  if (selectedCityId) {
    const city = getCityById(selectedCityId);
    if (city) return <div className="p-4 md:p-6"><CityDetailView city={city} onBack={() => setSelectedCityId(null)} /></div>;
  }

  const filteredCities = GLOBAL_CITIES.filter(c => {
    const matchSearch = !searchQuery || c.cityName.toLowerCase().includes(searchQuery.toLowerCase()) || c.countryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTier = !selectedTier || c.tier === selectedTier;
    return matchSearch && matchTier;
  });

  // Group by region
  const grouped = filteredCities.reduce<Record<string, GlobalCity[]>>((acc, city) => {
    const region = getRegion(city.countryCode);
    if (!acc[region]) acc[region] = [];
    acc[region].push(city);
    return acc;
  }, {});

  const regionOrder = ['North America', 'Europe', 'Asia Pacific', 'Middle East', 'Oceania', 'Other'];
  const sortedRegions = regionOrder.filter(r => grouped[r]?.length > 0);

  const getTierColor = (tier: string) => {
    if (tier === 'tier1') return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50';
    if (tier === 'tier2') return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/50';
    return 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/50';
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero */}
      <div className="text-center space-y-4 mb-4">
        <div className="flex items-center justify-center gap-2">
          <Globe2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Global City Services</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Premium service coverage across {GLOBAL_CITIES.length} cities — all verified 4+ star providers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-6">
          <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow border-green-500/30" onClick={() => setSelectedTier('tier1')}>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-1">{tier1Count}</div>
            <div className="text-sm text-muted-foreground">Full Coverage Cities</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">All 10 services available</div>
          </Card>
          <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow border-blue-500/30" onClick={() => setSelectedTier('tier2')}>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">{tier2Count}</div>
            <div className="text-sm text-muted-foreground">Growing Networks</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">7-9 services available</div>
          </Card>
          <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow border-orange-500/30" onClick={() => setSelectedTier('tier3')}>
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1">{tier3Count}</div>
            <div className="text-sm text-muted-foreground">Basic Coverage</div>
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">5+ services available</div>
          </Card>
        </div>
      </div>

      {/* Search + Tier Tabs */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cities or countries..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: '', label: `All (${GLOBAL_CITIES.length})` },
              { key: 'tier1', label: `Full (${tier1Count})` },
              { key: 'tier2', label: `Growing (${tier2Count})` },
              { key: 'tier3', label: `Basic (${tier3Count})` },
            ].map(t => (
              <Button
                key={t.key}
                variant={selectedTier === t.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTier(t.key)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* City Grid grouped by Region */}
      <ScrollArea className="h-[700px] rounded-lg">
        <div className="space-y-8 pr-4">
          {sortedRegions.map(region => (
            <div key={region}>
              <div className="flex items-center gap-2 mb-4 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                <h2 className="text-xl font-bold">{region}</h2>
                <Badge variant="secondary">{grouped[region].length} cities</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[region]
                  .sort((a, b) => b.coverageScore - a.coverageScore)
                  .map(city => {
                    const cityServices = getServicesForCity(city.id);
                    const avail = cityServices.filter(s => s.availabilityStatus === 'available').length;
                    return (
                      <Card
                        key={city.id}
                        className="p-5 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
                        onClick={() => setSelectedCityId(city.id)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{city.cityName}</h3>
                              <p className="text-sm text-muted-foreground">{city.countryName}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge className={getTierColor(city.tier)}>
                              {city.tier === 'tier1' ? 'Full' : city.tier === 'tier2' ? 'Growing' : 'Basic'}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span className="font-bold">{city.coverageScore}</span>
                              <span className="text-muted-foreground">/100</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />{(city.metroPopulation / 1000000).toFixed(1)}M
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />{avail}/10 services
                            </span>
                          </div>

                          <Progress value={avail * 10} className="h-1.5" />
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}

          {filteredCities.length === 0 && (
            <Card className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No cities found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default GlobalCityServices;
