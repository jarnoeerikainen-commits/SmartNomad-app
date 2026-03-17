import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useLocation as useLocationCtx } from '@/contexts/LocationContext';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import {
  Plane, Search, MapPin, Clock, Users, DollarSign, Zap, Shield,
  Wifi, Coffee, PawPrint, Timer, ArrowRight, ChevronRight, Star,
  TrendingDown, Filter, Globe, Building2, CheckCircle2, AlertTriangle,
  Sparkles, Award, CreditCard, Fuel, ArrowUpDown
} from 'lucide-react';
import {
  AIRPORTS, Airport, CharterFlight, generateDemoFlights,
  getNearbyAirports, getJetSearchAIContext
} from '@/data/airCharterData';
import { MEGHAN_AWARD_CARDS, JOHN_AWARD_CARDS, calculateAwardValue } from '@/data/awardProgramsData';

const CATEGORY_LABELS: Record<string, string> = {
  light: 'Light Jet', midsize: 'Midsize', 'super-mid': 'Super Midsize', heavy: 'Heavy Jet', 'ultra-long': 'Ultra Long Range'
};
const CATEGORY_COLORS: Record<string, string> = {
  light: 'bg-blue-500/10 text-blue-500', midsize: 'bg-emerald-500/10 text-emerald-500',
  'super-mid': 'bg-purple-500/10 text-purple-500', heavy: 'bg-amber-500/10 text-amber-500',
  'ultra-long': 'bg-rose-500/10 text-rose-500'
};
const PROVIDER_COLORS: Record<string, string> = {
  'Jettly': 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  'XO / Vista': 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  'Amalfi Jets': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'Flapper': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};
const TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  'empty-leg': { label: 'Empty Leg', color: 'bg-green-500/10 text-green-600', icon: '🟢' },
  'shared-seat': { label: 'Shared Seat', color: 'bg-blue-500/10 text-blue-600', icon: '🔵' },
  'full-charter': { label: 'Full Charter', color: 'bg-amber-500/10 text-amber-600', icon: '🟡' },
};

const AirCharterService = () => {
  const { toast } = useToast();
  const locationCtx = useLocationCtx();
  const { activePersona, activePersonaId } = useDemoPersona();
  const [activeTab, setActiveTab] = useState('search');
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price');
  const [selectedFlight, setSelectedFlight] = useState<CharterFlight | null>(null);
  const [homeAirport, setHomeAirport] = useState<Airport | null>(null);
  const [nearbyAirports, setNearbyAirports] = useState<Airport[]>([]);

  // Determine home airport from location or persona
  useEffect(() => {
    let lat = 51.47, lng = -0.46; // default London
    if (activePersonaId === 'meghan') { lat = 51.47; lng = -0.46; } // London
    else if (activePersonaId === 'john') { lat = 1.36; lng = 103.99; } // Singapore
    else if (locationCtx?.location?.latitude && locationCtx?.location?.longitude) {
      lat = locationCtx.location.latitude; lng = locationCtx.location.longitude;
    }

    const nearby = getNearbyAirports(lat, lng, 50);
    setNearbyAirports(nearby);
    if (nearby.length > 0) setHomeAirport(nearby[0]);
  }, [activePersonaId, locationCtx]);

  // Generate flights from home airport (persona-aware)
  const flights = useMemo(() => {
    if (!homeAirport) return [];
    return generateDemoFlights(homeAirport.code, activePersonaId || undefined);
  }, [homeAirport, activePersonaId]);

  // Store jet context for concierge (persona-aware)
  useEffect(() => {
    if (flights.length && homeAirport) {
      const ctx = getJetSearchAIContext(flights, homeAirport.code, activePersonaId || undefined);
      localStorage.setItem('jetSearchAIContext', ctx);
    }
  }, [flights, homeAirport, activePersonaId]);

  // Award wallet info for current persona
  const awardInfo = useMemo(() => {
    if (activePersonaId === 'meghan') {
      const cards = MEGHAN_AWARD_CARDS;
      return { cards, value: calculateAwardValue(cards), name: 'Meghan' };
    }
    if (activePersonaId === 'john') {
      const cards = JOHN_AWARD_CARDS;
      return { cards, value: calculateAwardValue(cards), name: 'John' };
    }
    return null;
  }, [activePersonaId]);

  // Filter & sort
  const filteredFlights = useMemo(() => {
    let result = [...flights];
    if (searchFrom) {
      const q = searchFrom.toLowerCase();
      result = result.filter(f => f.from.city.toLowerCase().includes(q) || f.from.code.toLowerCase().includes(q) || f.from.name.toLowerCase().includes(q));
    }
    if (searchTo) {
      const q = searchTo.toLowerCase();
      result = result.filter(f => f.to.city.toLowerCase().includes(q) || f.to.code.toLowerCase().includes(q) || f.to.name.toLowerCase().includes(q));
    }
    if (typeFilter !== 'all') result = result.filter(f => f.type === typeFilter);
    if (categoryFilter !== 'all') result = result.filter(f => f.aircraftCategory === categoryFilter);
    if (providerFilter !== 'all') result = result.filter(f => f.provider === providerFilter);

    switch (sortBy) {
      case 'price': result.sort((a, b) => a.pricePerSeat - b.pricePerSeat); break;
      case 'date': result.sort((a, b) => a.departureDate.localeCompare(b.departureDate)); break;
      case 'savings': result.sort((a, b) => b.savingsPercent - a.savingsPercent); break;
      case 'duration': result.sort((a, b) => a.flightDuration.localeCompare(b.flightDuration)); break;
    }
    return result;
  }, [flights, searchFrom, searchTo, typeFilter, categoryFilter, providerFilter, sortBy]);

  const stats = useMemo(() => ({
    total: flights.length,
    emptyLegs: flights.filter(f => f.type === 'empty-leg').length,
    sharedSeats: flights.filter(f => f.type === 'shared-seat').length,
    charters: flights.filter(f => f.type === 'full-charter').length,
    avgSavings: Math.round(flights.reduce((s, f) => s + f.savingsPercent, 0) / (flights.length || 1)),
    cheapestSeat: flights.length ? Math.min(...flights.map(f => f.pricePerSeat)) : 0,
  }), [flights]);

  const handleBookFlight = (flight: CharterFlight) => {
    toast({
      title: "🛩️ Booking Request Sent",
      description: `Your request for ${flight.aircraft} (${flight.from.code} → ${flight.to.code}) has been sent to ${flight.provider}. A charter specialist will contact you within 15 minutes.`,
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* ═══ HERO HEADER ═══ */}
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-50" />
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Plane className="h-7 w-7 text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">Air Charter Service</CardTitle>
                <p className="text-sm text-white/60 mt-1">Private Jets • Empty Legs • Shared Seats — Powered by AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">Jettly — 23K+ Aircraft</Badge>
              <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs">XO / Vista</Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">Amalfi Jets</Badge>
              <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/30 text-xs">Flapper</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 pb-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
            <div className="bg-white/5 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold text-amber-400">{stats.total}</p>
              <p className="text-xs text-white/50">Available Flights</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold text-green-400">{stats.emptyLegs}</p>
              <p className="text-xs text-white/50">Empty Legs</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold text-blue-400">{stats.sharedSeats}</p>
              <p className="text-xs text-white/50">Shared Seats</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold text-purple-400">{stats.avgSavings}%</p>
              <p className="text-xs text-white/50">Avg Savings</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center backdrop-blur-sm col-span-2 md:col-span-1">
              <p className="text-2xl font-bold text-emerald-400">€{stats.cheapestSeat.toLocaleString()}</p>
              <p className="text-xs text-white/50">Cheapest Seat</p>
            </div>
          </div>

          {/* Home Airport Selector */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-white/70">Departure:</span>
              <Select value={homeAirport?.code || ''} onValueChange={(v) => setHomeAirport(AIRPORTS.find(a => a.code === v) || null)}>
                <SelectTrigger className="bg-transparent border-0 text-white font-semibold h-auto p-0 w-auto min-w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {nearbyAirports.length > 0 && (
                    <>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">📍 Nearby (within 50km)</div>
                      {nearbyAirports.map(a => (
                        <SelectItem key={a.code} value={a.code}>
                          <span className="flex items-center gap-2">
                            {a.type === 'business' ? <Building2 className="h-3 w-3 text-amber-500" /> : <Plane className="h-3 w-3" />}
                            {a.code} — {a.name} {a.fbo ? `(FBO: ${a.fbo})` : ''}
                          </span>
                        </SelectItem>
                      ))}
                      <Separator className="my-1" />
                    </>
                  )}
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">🌍 All Airports</div>
                  {AIRPORTS.map(a => (
                    <SelectItem key={a.code} value={a.code}>
                      {a.code} — {a.city}, {a.country} {a.type === 'business' ? '(Private)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {activePersona && (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                <Award className="h-3 w-3 mr-1" />
                {awardInfo?.name}'s Portfolio: ${Math.round(awardInfo?.value || 0).toLocaleString()} in rewards
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ═══ AWARD WALLET QUICK VIEW ═══ */}
      {awardInfo && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Award className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-sm">Award Wallet Integration — Optimizing {awardInfo.name}'s Travel</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {awardInfo.cards.filter(c => c.category === 'airline').slice(0, 5).map(c => (
                <Badge key={c.id} variant="outline" className="text-xs bg-background">
                  {c.programName.split(' ').slice(0, 2).join(' ')}: {(c.pointsBalance / 1000).toFixed(0)}K {c.pointsCurrency}
                </Badge>
              ))}
              <Badge variant="outline" className="text-xs bg-background text-amber-600">
                <CreditCard className="h-3 w-3 mr-1" />
                +{awardInfo.cards.filter(c => c.category === 'credit-card').reduce((s, c) => s + c.pointsBalance, 0).toLocaleString()} transferable pts
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 AI tip: Use airline miles for positioning flights, then take a private jet for the main leg. Compare cost per minute saved.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ═══ MAIN TABS ═══ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="search" className="flex items-center gap-1.5">
            <Search className="h-4 w-4" /> Search Flights
          </TabsTrigger>
          <TabsTrigger value="deals" className="flex items-center gap-1.5">
            <Zap className="h-4 w-4" /> Hot Deals
          </TabsTrigger>
          <TabsTrigger value="airports" className="flex items-center gap-1.5">
            <Globe className="h-4 w-4" /> Airport Directory
          </TabsTrigger>
        </TabsList>

        {/* ═══ SEARCH TAB ═══ */}
        <TabsContent value="search" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">From (city or IATA)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={homeAirport ? `${homeAirport.city} (${homeAirport.code})` : 'Any origin'} value={searchFrom} onChange={e => setSearchFrom(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">To (city or IATA)</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Any destination" value={searchTo} onChange={e => setSearchTo(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="empty-leg">Empty Legs</SelectItem>
                      <SelectItem value="shared-seat">Shared Seats</SelectItem>
                      <SelectItem value="full-charter">Full Charter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Sort</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Lowest Price</SelectItem>
                      <SelectItem value="savings">Best Savings</SelectItem>
                      <SelectItem value="date">Soonest</SelectItem>
                      <SelectItem value="duration">Shortest Flight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Category & Provider chips */}
              <div className="flex gap-2 flex-wrap mt-3">
                <Badge variant={categoryFilter === 'all' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setCategoryFilter('all')}>All Aircraft</Badge>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <Badge key={k} variant={categoryFilter === k ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setCategoryFilter(k)}>{v}</Badge>
                ))}
                <Separator orientation="vertical" className="h-6 mx-1" />
                {['Jettly', 'XO / Vista', 'Amalfi Jets', 'Flapper'].map(p => (
                  <Badge key={p} variant={providerFilter === p ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setProviderFilter(prev => prev === p ? 'all' : p)}>{p}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filteredFlights.length} flights found</p>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredFlights.map(flight => (
                <FlightCard key={flight.id} flight={flight} onSelect={setSelectedFlight} onBook={handleBookFlight} awardInfo={awardInfo} />
              ))}
              {filteredFlights.length === 0 && (
                <Card className="p-8 text-center">
                  <Plane className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No flights match your search. Try adjusting filters.</p>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ═══ HOT DEALS TAB ═══ */}
        <TabsContent value="deals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Empty Legs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-green-500">🟢</span> Best Empty Legs
                  <Badge variant="secondary" className="text-xs">Up to {Math.max(0, ...flights.filter(f => f.type === 'empty-leg').map(f => f.savingsPercent))}% off</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {flights.filter(f => f.type === 'empty-leg').sort((a, b) => b.savingsPercent - a.savingsPercent).slice(0, 5).map(f => (
                  <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-green-500/5 hover:bg-green-500/10 cursor-pointer transition-colors" onClick={() => setSelectedFlight(f)}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{f.from.code}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-sm font-bold">{f.to.code}</span>
                      <span className="text-xs text-muted-foreground">{f.aircraft}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {f.savingsPercent > 0 ? <Badge className="bg-green-500/20 text-green-600 text-xs">-{f.savingsPercent}%</Badge> : <Badge className="bg-purple-500/20 text-purple-600 text-xs">Premium</Badge>}
                      <span className="font-bold text-sm">€{f.pricePerSeat.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shared Seat Deals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-blue-500">🔵</span> Shared Seat Deals
                  <Badge variant="secondary" className="text-xs">XO / Vista</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {flights.filter(f => f.type === 'shared-seat').sort((a, b) => a.pricePerSeat - b.pricePerSeat).slice(0, 5).map(f => (
                  <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 cursor-pointer transition-colors" onClick={() => setSelectedFlight(f)}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{f.from.code}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-sm font-bold">{f.to.code}</span>
                      <span className="text-xs text-muted-foreground">{f.seatsAvailable} seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">€{f.pricePerSeat.toLocaleString()}/seat</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Fixed Rate */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-500" /> Fixed-Rate Guarantee
                  <Badge className="bg-amber-500/20 text-amber-600 text-xs">Amalfi Jets</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {flights.filter(f => f.fixedRate).sort((a, b) => a.fullCharterPrice - b.fullCharterPrice).slice(0, 5).map(f => (
                  <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer transition-colors" onClick={() => setSelectedFlight(f)}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{f.from.code}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-sm font-bold">{f.to.code}</span>
                      <span className="text-xs text-muted-foreground">{f.aircraft}</span>
                    </div>
                    <span className="font-bold text-sm">€{f.fullCharterPrice.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Time Savings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Timer className="h-5 w-5 text-purple-500" /> Time Savings Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/5">
                    <div>
                      <p className="font-semibold text-sm">Private FBO Terminal</p>
                      <p className="text-xs text-muted-foreground">Arrive → Board → Takeoff</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-600 text-lg font-bold">~12 min</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-semibold text-sm">Commercial Business Class</p>
                      <p className="text-xs text-muted-foreground">Check-in → Security → Gate → Board</p>
                    </div>
                    <Badge variant="outline" className="text-lg font-bold">~105 min</Badge>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                    <p className="text-2xl font-bold text-green-600">93 minutes saved</p>
                    <p className="text-xs text-muted-foreground">per flight × 2 (round trip) = 3+ hours saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ═══ AIRPORTS TAB ═══ */}
        <TabsContent value="airports" className="space-y-4">
          <AirportDirectory />
        </TabsContent>
      </Tabs>

      {/* ═══ FLIGHT DETAIL MODAL ═══ */}
      {selectedFlight && (
        <FlightDetailModal flight={selectedFlight} onClose={() => setSelectedFlight(null)} onBook={handleBookFlight} awardInfo={awardInfo} />
      )}
    </div>
  );
};

// ═══ FLIGHT CARD COMPONENT ═══
const FlightCard = ({ flight, onSelect, onBook, awardInfo }: {
  flight: CharterFlight;
  onSelect: (f: CharterFlight) => void;
  onBook: (f: CharterFlight) => void;
  awardInfo: any;
}) => {
  const typeInfo = TYPE_LABELS[flight.type];

  return (
    <Card className="hover:shadow-md transition-all cursor-pointer group" onClick={() => onSelect(flight)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Route & Aircraft */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className={`${typeInfo.color} text-xs`}>{typeInfo.icon} {typeInfo.label}</Badge>
              <Badge className={`${PROVIDER_COLORS[flight.provider]} text-xs border`}>{flight.provider}</Badge>
              <Badge className={`${CATEGORY_COLORS[flight.aircraftCategory]} text-xs`}>{flight.aircraft}</Badge>
              {flight.fixedRate && <Badge className="bg-amber-500/20 text-amber-600 text-xs">Fixed Rate</Badge>}
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="text-center">
                <p className="text-lg font-bold font-mono">{flight.from.code}</p>
                <p className="text-[10px] text-muted-foreground truncate max-w-[80px]">{flight.from.city}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <p className="text-[10px] text-muted-foreground">{flight.flightDuration}</p>
                <div className="w-full flex items-center gap-1">
                  <div className="h-px flex-1 bg-border" />
                  <Plane className="h-3 w-3 text-muted-foreground rotate-45" />
                  <div className="h-px flex-1 bg-border" />
                </div>
                <p className="text-[10px] text-muted-foreground">{flight.departureDate}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold font-mono">{flight.to.code}</p>
                <p className="text-[10px] text-muted-foreground truncate max-w-[80px]">{flight.to.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {flight.departureTime} – {flight.arrivalTime}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {flight.seatsAvailable}/{flight.totalSeats} seats</span>
              {flight.wifiOnboard && <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> WiFi</span>}
              {flight.cateringIncluded && <span className="flex items-center gap-1"><Coffee className="h-3 w-3" /> Catering</span>}
              {flight.petFriendly && <span className="flex items-center gap-1"><PawPrint className="h-3 w-3" /> Pets OK</span>}
              <span className="flex items-center gap-1 text-green-600"><Timer className="h-3 w-3" /> {flight.waitTimeMinutes}min board</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end mb-1">
              {flight.savingsPercent > 0 ? (
                <>
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <Badge className="bg-green-500/20 text-green-600 text-xs">Save {flight.savingsPercent}% vs Biz</Badge>
                </>
              ) : (
                <Badge className="bg-purple-500/20 text-purple-600 text-xs">Premium +{Math.abs(flight.savingsPercent)}%</Badge>
              )}
            </div>
            <p className="text-xl font-bold">€{flight.pricePerSeat.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground line-through">€{flight.originalRetailPrice.toLocaleString()} commercial</p>
            <p className="text-[10px] text-muted-foreground">per seat</p>
            {flight.expiresIn && <p className="text-[10px] text-amber-500 mt-1">⏰ Expires: {flight.expiresIn}</p>}
            <Button size="sm" className="mt-2 w-full" onClick={(e) => { e.stopPropagation(); onBook(flight); }}>
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ═══ FLIGHT DETAIL MODAL ═══
const FlightDetailModal = ({ flight, onClose, onBook, awardInfo }: {
  flight: CharterFlight;
  onClose: () => void;
  onBook: (f: CharterFlight) => void;
  awardInfo: any;
}) => {
  const typeInfo = TYPE_LABELS[flight.type];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            {flight.from.code} → {flight.to.code}
            <Badge className={`${typeInfo.color} text-xs ml-auto`}>{typeInfo.label}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Route Visual */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono">{flight.from.code}</p>
              <p className="text-sm text-muted-foreground">{flight.from.city}</p>
              <p className="text-xs text-muted-foreground">{flight.from.name}</p>
              {flight.from.fbo && <Badge variant="outline" className="text-[10px] mt-1">FBO: {flight.from.fbo}</Badge>}
            </div>
            <div className="flex flex-col items-center px-4">
              <p className="text-xs font-semibold">{flight.flightDuration}</p>
              <div className="flex items-center gap-1 my-1">
                <div className="w-8 h-px bg-border" />
                <Plane className="h-4 w-4 text-primary" />
                <div className="w-8 h-px bg-border" />
              </div>
              <p className="text-xs text-muted-foreground">{flight.aircraft}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono">{flight.to.code}</p>
              <p className="text-sm text-muted-foreground">{flight.to.city}</p>
              <p className="text-xs text-muted-foreground">{flight.to.name}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Date & Time</p>
              <p className="font-semibold text-sm">{flight.departureDate}</p>
              <p className="text-xs">{flight.departureTime} → {flight.arrivalTime}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Provider</p>
              <p className="font-semibold text-sm">{flight.provider}</p>
              {flight.fixedRate && <Badge className="bg-amber-500/20 text-amber-600 text-[10px]">Fixed Rate ™</Badge>}
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Seats Available</p>
              <p className="font-semibold text-sm">{flight.seatsAvailable} of {flight.totalSeats}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Aircraft Category</p>
              <p className="font-semibold text-sm">{CATEGORY_LABELS[flight.aircraftCategory]}</p>
            </div>
          </div>

          {/* Time Comparison */}
          <Card className="border-green-500/20">
            <CardContent className="p-3">
              <p className="text-xs font-semibold text-green-600 mb-2">⏱ Time Savings</p>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-bold text-green-600">{flight.waitTimeMinutes} min</p>
                  <p className="text-xs text-muted-foreground">Private FBO</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{flight.commercialAlternativeWait - flight.waitTimeMinutes} min saved</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{flight.commercialAlternativeWait} min</p>
                  <p className="text-xs text-muted-foreground">Commercial Terminal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Amenities</p>
            <div className="flex gap-1.5 flex-wrap">
              {flight.amenities.map(a => <Badge key={a} variant="outline" className="text-xs">{a}</Badge>)}
              {flight.wifiOnboard && <Badge variant="outline" className="text-xs"><Wifi className="h-3 w-3 mr-1" /> Wi-Fi</Badge>}
              {flight.cateringIncluded && <Badge variant="outline" className="text-xs"><Coffee className="h-3 w-3 mr-1" /> Catering</Badge>}
              {flight.petFriendly && <Badge variant="outline" className="text-xs"><PawPrint className="h-3 w-3 mr-1" /> Pet Friendly</Badge>}
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-muted-foreground">Per Seat</p>
                <p className="text-2xl font-bold">€{flight.pricePerSeat.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground line-through">€{flight.originalRetailPrice.toLocaleString()} commercial biz class</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Full Charter</p>
                <p className="text-xl font-bold">€{flight.fullCharterPrice.toLocaleString()}</p>
                {flight.savingsPercent > 0 ? (
                  <Badge className="bg-green-500/20 text-green-600">Save {flight.savingsPercent}%</Badge>
                ) : (
                  <Badge className="bg-purple-500/20 text-purple-600">Premium experience</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Award Points Strategy */}
          {awardInfo && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="p-3">
                <p className="text-xs font-semibold text-amber-600 mb-1 flex items-center gap-1"><Award className="h-3 w-3" /> Award Wallet Strategy</p>
                <p className="text-xs text-muted-foreground">
                  💡 {awardInfo.name} could use airline miles for a positioning flight to {flight.from.city}, 
                  then take this private jet to {flight.to.city} — saving both money and 
                  {flight.commercialAlternativeWait - flight.waitTimeMinutes} minutes of airport wait time.
                </p>
              </CardContent>
            </Card>
          )}

          <Button className="w-full" size="lg" onClick={() => onBook(flight)}>
            <Plane className="h-4 w-4 mr-2" /> Request Booking — {flight.provider}
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            A dedicated charter specialist will confirm availability within 15 minutes. No payment until confirmed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ═══ AIRPORT DIRECTORY ═══
const AirportDirectory = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const regions = useMemo(() => {
    const map: Record<string, Airport[]> = {};
    const regionMap: Record<string, string> = {
      UK: 'Europe', France: 'Europe', Germany: 'Europe', Switzerland: 'Europe', Italy: 'Europe',
      Spain: 'Europe', Netherlands: 'Europe', Belgium: 'Europe', Luxembourg: 'Europe', Austria: 'Europe',
      Denmark: 'Europe', Norway: 'Europe', Sweden: 'Europe', Finland: 'Europe', Iceland: 'Europe',
      Portugal: 'Europe', Greece: 'Europe', Cyprus: 'Europe', Turkey: 'Europe', Poland: 'Europe',
      'Czech Republic': 'Europe', Slovakia: 'Europe', Hungary: 'Europe', Romania: 'Europe',
      Bulgaria: 'Europe', Croatia: 'Europe', Slovenia: 'Europe', Serbia: 'Europe', Albania: 'Europe',
      Estonia: 'Europe', Latvia: 'Europe', Lithuania: 'Europe', Monaco: 'Europe', Malta: 'Europe',
      Ireland: 'Europe',
      UAE: 'Middle East', Qatar: 'Middle East', 'Saudi Arabia': 'Middle East', Israel: 'Middle East',
      Bahrain: 'Middle East', Oman: 'Middle East', Kuwait: 'Middle East', Jordan: 'Middle East', Lebanon: 'Middle East',
      Singapore: 'Asia Pacific', China: 'Asia Pacific', Japan: 'Asia Pacific', 'South Korea': 'Asia Pacific',
      Taiwan: 'Asia Pacific', Mongolia: 'Asia Pacific',
      Thailand: 'Asia Pacific', Malaysia: 'Asia Pacific', Indonesia: 'Asia Pacific', Philippines: 'Asia Pacific',
      Vietnam: 'Asia Pacific', Cambodia: 'Asia Pacific', Laos: 'Asia Pacific', Myanmar: 'Asia Pacific', Brunei: 'Asia Pacific',
      India: 'Asia Pacific', 'Sri Lanka': 'Asia Pacific', Bangladesh: 'Asia Pacific', Nepal: 'Asia Pacific',
      Pakistan: 'Asia Pacific', Maldives: 'Asia Pacific',
      USA: 'North America', Canada: 'North America', Mexico: 'North America',
      Brazil: 'South America', Argentina: 'South America', Colombia: 'South America', Chile: 'South America',
      Peru: 'South America', Ecuador: 'South America', Venezuela: 'South America', Uruguay: 'South America',
      Paraguay: 'South America', Bolivia: 'South America', Panama: 'South America', 'Costa Rica': 'South America',
      'Dominican Republic': 'Caribbean', Bahamas: 'Caribbean', 'Sint Maarten': 'Caribbean', Jamaica: 'Caribbean',
      Barbados: 'Caribbean', Trinidad: 'Caribbean', Aruba: 'Caribbean', 'Curaçao': 'Caribbean',
      'Cayman Islands': 'Caribbean', 'Puerto Rico': 'Caribbean', 'British Virgin Islands': 'Caribbean',
      'US Virgin Islands': 'Caribbean', Guadeloupe: 'Caribbean', Martinique: 'Caribbean', Cuba: 'Caribbean',
      'South Africa': 'Africa', Kenya: 'Africa', Egypt: 'Africa', Morocco: 'Africa', Tunisia: 'Africa',
      Algeria: 'Africa', Nigeria: 'Africa', Ghana: 'Africa', Ethiopia: 'Africa', Tanzania: 'Africa',
      Uganda: 'Africa', Rwanda: 'Africa', Senegal: 'Africa', 'Ivory Coast': 'Africa',
      Mauritius: 'Africa', Seychelles: 'Africa', Madagascar: 'Africa', Mozambique: 'Africa',
      Zambia: 'Africa', Zimbabwe: 'Africa', Namibia: 'Africa', Botswana: 'Africa',
      Australia: 'Oceania', 'New Zealand': 'Oceania', Fiji: 'Oceania', 'French Polynesia': 'Oceania', 'New Caledonia': 'Oceania',
      Kazakhstan: 'Central Asia', Uzbekistan: 'Central Asia', Azerbaijan: 'Central Asia',
      Georgia: 'Central Asia', Armenia: 'Central Asia', Kyrgyzstan: 'Central Asia',
      Tajikistan: 'Central Asia', Turkmenistan: 'Central Asia',
    };

    let filtered = [...AIRPORTS];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(a => a.city.toLowerCase().includes(q) || a.code.toLowerCase().includes(q) || a.country.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
    }
    if (typeFilter !== 'all') filtered = filtered.filter(a => a.type === typeFilter);

    filtered.forEach(a => {
      const region = regionMap[a.country] || 'Other';
      if (!map[region]) map[region] = [];
      map[region].push(a);
    });
    return map;
  }, [search, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search airports by city, code, or country..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({AIRPORTS.length})</SelectItem>
            <SelectItem value="major">Major ({AIRPORTS.filter(a => a.type === 'major').length})</SelectItem>
            <SelectItem value="business">Private/FBO ({AIRPORTS.filter(a => a.type === 'business').length})</SelectItem>
            <SelectItem value="regional">Regional ({AIRPORTS.filter(a => a.type === 'regional').length})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[500px]">
        {Object.entries(regions).sort().map(([region, airports]) => (
          <div key={region} className="mb-4">
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2 border-b mb-2">
              <h3 className="font-bold text-sm">{region} <span className="text-muted-foreground font-normal">({airports.length} airports)</span></h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {airports.map(a => (
                <div key={a.code} className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    {a.type === 'business' ? <Building2 className="h-4 w-4 text-amber-500" /> : <Plane className="h-4 w-4 text-muted-foreground" />}
                    <div>
                      <p className="text-sm font-semibold">{a.code} — {a.city}</p>
                      <p className="text-[10px] text-muted-foreground">{a.name}, {a.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {a.fbo && <Badge variant="outline" className="text-[10px]">FBO: {a.fbo}</Badge>}
                    <Badge variant={a.type === 'business' ? 'default' : 'secondary'} className="text-[10px] ml-1">
                      {a.type === 'business' ? 'Private' : 'Commercial'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default AirCharterService;
