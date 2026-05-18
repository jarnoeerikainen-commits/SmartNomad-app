import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ChefHat, Star, MapPin, Phone, Globe, CalendarClock, AlertCircle,
  Sparkles, RefreshCw, Search, Trophy, Award, Crown,
} from 'lucide-react';
import { FINE_DINING_CITIES, FineDiningCity, TOP_100_COUNT } from '@/data/fineDiningCities';
import FineDiningService, { FineDiningCityData, FineDiningRestaurant } from '@/services/FineDiningService';
import { useToast } from '@/hooks/use-toast';

type RegionFilter = 'all' | FineDiningCity['region'];

const StarChip: React.FC<{ stars: FineDiningRestaurant['michelinStars'] }> = ({ stars }) => {
  if (stars === 'bib') {
    return <Badge variant="secondary" className="gap-1"><Award className="h-3 w-3" /> Bib Gourmand</Badge>;
  }
  if (!stars || stars === 0) return null;
  return (
    <Badge variant="default" className="gap-1 bg-amber-500 hover:bg-amber-500 text-white">
      {Array.from({ length: stars }).map((_, i) => <Star key={i} className="h-3 w-3 fill-white" />)}
      <span className="ml-1">Michelin</span>
    </Badge>
  );
};

const LeadTimeBadge: React.FC<{ weeks: number; hard: boolean }> = ({ weeks, hard }) => {
  const color = hard
    ? 'bg-destructive/15 text-destructive border-destructive/30'
    : weeks >= 8
      ? 'bg-amber-500/15 text-amber-700 border-amber-500/30'
      : 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30';
  const label = hard
    ? `Book ${weeks}+ wk ahead — lottery/months`
    : weeks >= 8
      ? `Book ${weeks} weeks ahead`
      : `${weeks} week${weeks === 1 ? '' : 's'} ahead`;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${color}`}>
      <CalendarClock className="h-3 w-3" /> {label}
    </span>
  );
};

const RestaurantCard: React.FC<{ r: FineDiningRestaurant }> = ({ r }) => {
  const reservationUrl = r.bookingUrl || r.website;
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="font-semibold text-base leading-tight truncate">{r.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {r.cuisine}{r.chef ? ` · Chef ${r.chef}` : ''} · {r.priceRange}
            </p>
          </div>
          <StarChip stars={r.michelinStars} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {typeof r.worlds50BestRank === 'number' && (
            <Badge variant="outline" className="gap-1 text-xs"><Trophy className="h-3 w-3" /> #{r.worlds50BestRank} World's 50 Best</Badge>
          )}
          {typeof r.laListeScore === 'number' && (
            <Badge variant="outline" className="gap-1 text-xs">La Liste {r.laListeScore.toFixed(1)}</Badge>
          )}
          {typeof r.gaultMillauToques === 'number' && (
            <Badge variant="outline" className="gap-1 text-xs">{r.gaultMillauToques} toques · G&M</Badge>
          )}
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          {r.address && (
            <div className="flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span className="line-clamp-2">{r.address}</span>
            </div>
          )}
          {r.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <a href={`tel:${r.phone.replace(/\s+/g, '')}`} className="hover:text-foreground">{r.phone}</a>
            </div>
          )}
        </div>

        {r.signatureDishes && r.signatureDishes.length > 0 && (
          <p className="text-xs italic text-muted-foreground line-clamp-2">
            Signature: {r.signatureDishes.slice(0, 3).join(' · ')}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <LeadTimeBadge weeks={r.leadTimeWeeks} hard={r.hardToBook} />
          {reservationUrl && (
            <Button asChild size="sm" variant="default">
              <a href={reservationUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="h-3.5 w-3.5 mr-1" /> Reserve
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const FineDiningHub: React.FC = () => {
  const { toast } = useToast();
  const [region, setRegion] = useState<RegionFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string>('paris');
  const [data, setData] = useState<FineDiningCityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minStars, setMinStars] = useState<'0' | '1' | '2' | '3'>('1');

  const filteredCities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FINE_DINING_CITIES.filter(c => {
      if (region !== 'all' && c.region !== region) return false;
      if (q && !c.city.toLowerCase().includes(q) && !c.country.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => b.michelinStarsTotal - a.michelinStarsTotal);
  }, [region, search]);

  const selectedCity = useMemo(
    () => FINE_DINING_CITIES.find(c => c.id === selectedCityId) || FINE_DINING_CITIES[0],
    [selectedCityId],
  );

  const loadCity = async (city: FineDiningCity, force = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await FineDiningService.fetchCity({
        cityId: city.id,
        city: city.city,
        country: city.country,
        countryCode: city.countryCode,
        minStars: Number(minStars) as 0 | 1 | 2 | 3,
        force,
      });
      setData(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load restaurants';
      setError(msg);
      toast({ title: 'Could not load fine dining', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // try cache instantly
    const cached = FineDiningService.getCached(selectedCity.id);
    if (cached) {
      setData(cached);
      return;
    }
    loadCity(selectedCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity.id]);

  const handleRefresh = () => loadCity(selectedCity, true);

  const restaurants = data?.restaurants ?? [];
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const score = (r: FineDiningRestaurant) => {
      const stars = typeof r.michelinStars === 'number' ? r.michelinStars : 0;
      const w50 = r.worlds50BestRank ? 51 - r.worlds50BestRank : 0;
      return stars * 100 + w50 + (r.laListeScore || 0) / 10;
    };
    return score(b) - score(a);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 font-display">
            <ChefHat className="h-8 w-8 text-primary" />
            Fine Dining Concierge
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Live Michelin · World's 50 Best · La Liste · Gault & Millau — across the top {TOP_100_COUNT} dining cities on earth.
            Lead-time aware: we tell you when to book so you actually get the table.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1"><Crown className="h-3 w-3" /> VIP grade</Badge>
          <Badge variant="outline">{TOP_100_COUNT} cities</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cities sidebar */}
        <Card className="lg:col-span-4 xl:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top {TOP_100_COUNT} dining cities</CardTitle>
            <div className="space-y-2 pt-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search city or country..."
                  className="pl-8 h-9"
                />
              </div>
              <Tabs value={region} onValueChange={(v) => setRegion(v as RegionFilter)}>
                <TabsList className="grid grid-cols-3 w-full h-8">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="Europe" className="text-xs">Europe</TabsTrigger>
                  <TabsTrigger value="Asia" className="text-xs">Asia</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-3 w-full h-8 mt-1">
                  <TabsTrigger value="Americas" className="text-xs">Americas</TabsTrigger>
                  <TabsTrigger value="MEA" className="text-xs">MEA</TabsTrigger>
                  <TabsTrigger value="Oceania" className="text-xs">Oceania</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[520px] pr-2">
              <div className="space-y-1">
                {filteredCities.map(city => {
                  const active = city.id === selectedCity.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCityId(city.id)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                        active
                          ? 'bg-primary/10 border-primary/40'
                          : 'border-transparent hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{city.city}</p>
                          <p className="text-xs text-muted-foreground truncate">{city.country}</p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          {city.michelinStarsTotal > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600">
                              <Star className="h-3 w-3 fill-amber-500" />
                              {city.michelinStarsTotal}
                            </span>
                          )}
                          {city.threeStarCount > 0 && (
                            <span className="text-[10px] text-muted-foreground">{city.threeStarCount}× ⭐⭐⭐</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
                {filteredCities.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No cities match</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main panel */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {selectedCity.city}, {selectedCity.country}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{selectedCity.michelinStarsTotal} Michelin stars</Badge>
                    {selectedCity.threeStarCount > 0 && (
                      <Badge variant="outline">{selectedCity.threeStarCount}× three-star</Badge>
                    )}
                    {selectedCity.worlds50Best ? (
                      <Badge variant="outline">{selectedCity.worlds50Best} on World's 50 Best</Badge>
                    ) : null}
                    <Badge variant="secondary">Tier: {selectedCity.tier}</Badge>
                    <Badge variant="outline">Typical lead time: {selectedCity.leadTimeWeeks} weeks</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={minStars} onValueChange={(v) => setMinStars(v as typeof minStars)}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All awarded</SelectItem>
                      <SelectItem value="1">1+ star</SelectItem>
                      <SelectItem value="2">2+ stars</SelectItem>
                      <SelectItem value="3">3 stars only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={handleRefresh} disabled={loading}>
                    <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {selectedCity.leadTimeWeeks >= 12 && (
                <Alert className="mb-4 border-amber-500/40 bg-amber-500/5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-sm">
                    <strong>Concierge tip:</strong> Top tables in {selectedCity.city} typically need
                    {' '}{selectedCity.leadTimeWeeks}+ weeks of advance notice. Ask SuperNomad
                    Concierge to start reservation flows the moment your trip dates are set.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-lg" />
                  ))}
                </div>
              )}

              {!loading && sortedRestaurants.length === 0 && !error && (
                <div className="text-center py-12">
                  <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No starred restaurants found for this city in the current guide editions.
                  </p>
                </div>
              )}

              {!loading && sortedRestaurants.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sortedRestaurants.map((r, idx) => (
                    <RestaurantCard key={`${r.name}-${idx}`} r={r} />
                  ))}
                </div>
              )}

              {data?.notes && (
                <p className="text-xs text-muted-foreground mt-4 italic">
                  {data.notes}
                </p>
              )}

              {data?.fetchedAt && (
                <p className="text-[10px] text-muted-foreground mt-3 text-right">
                  Sources: Michelin Guide · World's 50 Best · La Liste · Gault & Millau · researched {data.fetchedAt}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FineDiningHub;
