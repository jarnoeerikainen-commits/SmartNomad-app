import React, { useState, useEffect, useMemo } from 'react';
import { Shield, AlertTriangle, MapPin, Clock, TrendingUp, TrendingDown, Minus, Bell, Radio, Search, X, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThreatIntelligenceService } from '@/services/ThreatIntelligenceService';
import { ThreatIncident, ThreatSeverity, ThreatCategory } from '@/types/threat';

const CATEGORY_CHIPS: { id: ThreatCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'terrorism', label: 'Terrorism', icon: '💣' },
  { id: 'civil_unrest', label: 'Civil Unrest', icon: '⚠️' },
  { id: 'natural_disaster', label: 'Natural Disaster', icon: '🌪️' },
  { id: 'cyber_attack', label: 'Cyber', icon: '💻' },
  { id: 'crime', label: 'Crime', icon: '🚨' },
  { id: 'health_emergency', label: 'Health', icon: '🏥' },
  { id: 'severe_weather', label: 'Weather', icon: '⛈️' },
  { id: 'transport_disruption', label: 'Transport', icon: '🚇' },
];

const SEVERITY_CHIPS: { id: ThreatSeverity | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: '' },
  { id: 'critical', label: 'Critical', color: 'bg-red-500/10 text-red-500 border-red-500/30' },
  { id: 'high', label: 'High', color: 'bg-orange-500/10 text-orange-500 border-orange-500/30' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
  { id: 'low', label: 'Low', color: 'bg-green-500/10 text-green-500 border-green-500/30' },
];

const ThreatDashboard: React.FC = () => {
  const [allThreats, setAllThreats] = useState<ThreatIncident[]>([]);
  const [isInDanger, setIsInDanger] = useState(false);
  const [statistics, setStatistics] = useState(ThreatIntelligenceService.getStatistics());
  const [watchlist, setWatchlist] = useState(ThreatIntelligenceService.getWatchlist());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ThreatCategory | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<ThreatSeverity | 'all'>('all');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setAllThreats(ThreatIntelligenceService.getActiveThreats());
    setIsInDanger(ThreatIntelligenceService.isUserInDangerZone());
    setStatistics(ThreatIntelligenceService.getStatistics());
    setWatchlist(ThreatIntelligenceService.getWatchlist());
  };

  const filteredThreats = useMemo(() => {
    return allThreats.filter(t => {
      if (categoryFilter !== 'all' && t.type !== categoryFilter) return false;
      if (severityFilter !== 'all' && t.severity !== severityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.location.city.toLowerCase().includes(q) || t.location.country.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allThreats, search, categoryFilter, severityFilter]);

  const getSeverityVariant = (severity: ThreatSeverity) => {
    if (severity === 'critical' || severity === 'high') return 'destructive' as const;
    return 'secondary' as const;
  };

  const getTrendIcon = () => {
    if (statistics.trend === 'improving') return <TrendingDown className="h-4 w-4 text-green-500" />;
    if (statistics.trend === 'deteriorating') return <TrendingUp className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8" />Threat Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">Real-time global threat monitoring — {allThreats.length} active incidents</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Radio className={`h-4 w-4 ${isInDanger ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Critical Alert */}
      {isInDanger && (
        <Alert variant="destructive" className="animate-pulse border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Critical Threats Detected Near You!</AlertTitle>
          <AlertDescription>{ThreatIntelligenceService.getCriticalThreats().length} active high-priority threats within 25km.</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Critical', value: statistics.critical, color: 'text-red-500', bg: 'from-red-500/10 to-red-500/5 border-red-500/20' },
          { label: 'High', value: statistics.high, color: 'text-orange-500', bg: 'from-orange-500/10 to-orange-500/5 border-orange-500/20' },
          { label: 'Medium', value: statistics.medium, color: 'text-yellow-500', bg: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20' },
          { label: 'Near You', value: statistics.activeNearby, color: 'text-primary', bg: 'from-primary/10 to-primary/5 border-primary/20' },
        ].map(s => (
          <Card key={s.label} className={`bg-gradient-to-br ${s.bg}`}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Trend</p>
            <div className="flex items-center gap-2 mt-1">{getTrendIcon()}<span className="text-sm font-semibold capitalize">{statistics.trend}</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Threats ({filteredThreats.length})</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist ({watchlist.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search threats by city, country, or keyword..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-10" />
              {search && <Button variant="ghost" size="sm" className="absolute right-1 top-1" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_CHIPS.map(c => (
                <Badge key={c.id} variant={categoryFilter === c.id ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => setCategoryFilter(c.id)}>
                  {c.icon} {c.label}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SEVERITY_CHIPS.map(s => (
                <Badge key={s.id} variant={severityFilter === s.id ? 'default' : 'outline'} className={`cursor-pointer text-xs ${severityFilter === s.id ? '' : s.color}`} onClick={() => setSeverityFilter(s.id)}>
                  {s.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Threats List */}
          <ScrollArea className="h-[500px] pr-2">
            <div className="space-y-3">
              {filteredThreats.length === 0 ? (
                <Card><CardContent className="py-12 text-center"><Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No threats matching your filters</p></CardContent></Card>
              ) : filteredThreats.map(threat => {
                const severityInfo = ThreatIntelligenceService.getSeverityInfo(threat.severity);
                const categoryInfo = ThreatIntelligenceService.getCategoryInfo(threat.type);
                return (
                  <Card key={threat.id} className="overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <Badge variant={getSeverityVariant(threat.severity)} className="text-xs">{severityInfo.icon} {severityInfo.label}</Badge>
                            <Badge variant="outline" className="text-xs">{categoryInfo.icon} {categoryInfo.label}</Badge>
                          </div>
                          <h3 className="font-semibold text-sm">{threat.title}</h3>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0"><MapPin className="h-3 w-3 mr-1" />{threat.distanceFromUser > 0 ? `${threat.distanceFromUser.toFixed(0)} km` : 'Global'}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{threat.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{threat.location.city}, {threat.location.country}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ThreatIntelligenceService.getTimeAgo(threat.timestamp)}</span>
                        <span>Confidence: {threat.confidence}%</span>
                      </div>
                      <div className="bg-muted/50 rounded-md p-2">
                        <p className="text-xs font-medium mb-1 flex items-center gap-1"><Shield className="h-3 w-3" /> Actions:</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5 pl-4 list-disc">
                          {threat.recommendedActions.slice(0, 3).map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-3">
          {watchlist.map(loc => {
            const statusColor = loc.currentStatus === 'safe' ? 'text-green-500' : loc.currentStatus === 'caution' ? 'text-yellow-500' : 'text-red-500';
            const statusBg = loc.currentStatus === 'safe' ? 'bg-green-500/10 border-green-500/20' : loc.currentStatus === 'caution' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20';
            return (
              <Card key={loc.id} className={statusBg}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{loc.name}</h3>
                      <p className="text-xs text-muted-foreground">Radius: {loc.radius} km</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${statusColor} capitalize`}>{loc.currentStatus}</div>
                      <div className="text-xs text-muted-foreground">{loc.activeThreats} active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <Button variant="outline" className="w-full"><MapPin className="h-4 w-4 mr-2" />Add Location</Button>
        </TabsContent>
      </Tabs>

      {/* Emergency Protocols */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <Button variant="destructive" className="h-auto py-3 flex-col gap-1 text-xs"><Shield className="h-5 w-5" /><span>Emergency</span><span className="opacity-70">112/911</span></Button>
            <Button variant="outline" className="h-auto py-3 flex-col gap-1 text-xs"><MapPin className="h-5 w-5" /><span>Embassy</span><span className="opacity-70">Find</span></Button>
            <Button variant="outline" className="h-auto py-3 flex-col gap-1 text-xs"><Bell className="h-5 w-5" /><span>Alert</span><span className="opacity-70">Send SOS</span></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatDashboard;
