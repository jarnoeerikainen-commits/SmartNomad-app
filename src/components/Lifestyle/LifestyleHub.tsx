import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  getProviders,
  getSnapshot,
  connectProvider,
  disconnectProvider,
  syncProvider,
  type LifestyleProvider,
  type LifestyleSnapshot,
} from '@/services/LifestyleConnectorsService';
import {
  Music, Moon, Activity, Dumbbell, Heart, RefreshCw, Sparkles, Shield, ExternalLink, Zap,
} from 'lucide-react';

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  music: Music,
  sleep: Moon,
  fitness: Activity,
  sports: Dumbbell,
  recovery: Heart,
};

const ProviderCard: React.FC<{
  provider: LifestyleProvider;
  onToggle: (id: LifestyleProvider['id'], connect: boolean) => void;
  onSync: (id: LifestyleProvider['id']) => void;
}> = ({ provider, onToggle, onSync }) => {
  const Icon = CATEGORY_ICON[provider.category] || Activity;
  const isConnected = provider.status === 'connected';
  const lastSync = provider.lastSyncedAt
    ? new Date(provider.lastSyncedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    : null;

  return (
    <Card className={`transition-all duration-200 ${isConnected ? 'border-primary/40 bg-gradient-to-br from-primary/5 to-transparent' : 'hover:border-muted-foreground/30'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${isConnected ? 'bg-primary/10' : 'bg-muted'}`}>
              <span className="text-2xl" aria-hidden>{provider.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm">{provider.name}</h4>
                <Badge variant={isConnected ? 'default' : 'outline'} className="text-[10px] px-1.5 py-0">
                  {isConnected ? 'Connected' : 'Not connected'}
                </Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                  <Icon className="w-2.5 h-2.5" />
                  {provider.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{provider.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {provider.capabilities.slice(0, 3).map(c => (
                  <span key={c} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                    {c.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
              {isConnected && lastSync && (
                <p className="text-[10px] text-muted-foreground mt-2">Synced {lastSync}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Switch checked={isConnected} onCheckedChange={(v) => onToggle(provider.id, v)} />
            {isConnected && (
              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => onSync(provider.id)} aria-label={`Sync ${provider.name}`}>
                <RefreshCw className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InsightsPanel: React.FC<{ snap: LifestyleSnapshot }> = ({ snap }) => {
  if (!snap.music && !snap.sleep && !snap.fitness && !snap.sports && !snap.recovery) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <Sparkles className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Connect a provider to unlock personalised AI recommendations — partners, gear, tournaments, venues and deals matched to your real level and taste.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {snap.music && (
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Music className="w-4 h-4 text-primary" /> Music taste</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1.5">
            <p><strong>Top artists:</strong> {snap.music.topArtists.slice(0, 3).map(a => a.name).join(', ')}</p>
            <p><strong>Genres:</strong> {snap.music.topGenres.slice(0, 4).join(', ')}</p>
            <p><strong>Vibe:</strong> {snap.music.tasteVector} · {snap.music.averageBPM} BPM avg · {snap.music.moodProfile.join(' / ')}</p>
          </CardContent>
        </Card>
      )}

      {snap.sleep && (
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Moon className="w-4 h-4 text-primary" /> Sleep & recovery</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1.5">
            <p><strong>Avg sleep:</strong> {snap.sleep.avgSleepHours}h · score {snap.sleep.avgSleepScore}/100</p>
            <p><strong>HRV:</strong> {snap.sleep.avgHRV}ms · resting HR {snap.sleep.avgRestingHR}</p>
            <p><strong>Pattern:</strong> {snap.sleep.bedtimePattern} · trend {snap.sleep.trend}</p>
          </CardContent>
        </Card>
      )}

      {snap.fitness && (
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Fitness</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1.5">
            <p><strong>VO2max:</strong> {snap.fitness.vo2max} · {snap.fitness.weeklyActivities} sessions/wk</p>
            <p><strong>Weekly:</strong> {snap.fitness.weeklyDistanceKm} km · {snap.fitness.weeklyCalories} kcal</p>
            <p><strong>Sports:</strong> {snap.fitness.primarySports.map(s => `${s.sport} (${s.level})`).join(', ')}</p>
          </CardContent>
        </Card>
      )}

      {snap.sports && (
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Dumbbell className="w-4 h-4 text-primary" /> Skills & levels</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1.5">
            {snap.sports.golf && <p><strong>Golf:</strong> handicap {snap.sports.golf.handicap} · {snap.sports.golf.rounds90d} rounds (90d)</p>}
            {snap.sports.tennis && <p><strong>Tennis:</strong> UTR {snap.sports.tennis.utr} · {snap.sports.tennis.surface}</p>}
            {snap.sports.padel && <p><strong>Padel:</strong> level {snap.sports.padel.level} · {snap.sports.padel.matches90d} matches</p>}
            {snap.sports.cycling && <p><strong>Cycling FTP:</strong> {snap.sports.cycling.ftpWatts}W · longest {snap.sports.cycling.longestRideKm} km</p>}
            {snap.sports.running && <p><strong>Running 5k PB:</strong> {snap.sports.running.fivekPb}</p>}
            {snap.sports.skiing && <p><strong>Skiing:</strong> {snap.sports.skiing.level} · {snap.sports.skiing.daysLastSeason} days last season</p>}
          </CardContent>
        </Card>
      )}

      {snap.recovery && (
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Heart className="w-4 h-4 text-primary" /> Today's readiness</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1.5">
            <p><strong>Recovery:</strong> {snap.recovery.recoveryScore}/100 · strain {snap.recovery.strainScore}</p>
            <p><strong>Load:</strong> {snap.recovery.trainingLoad}</p>
            <p><strong>Recommendation:</strong> {snap.recovery.readinessForToday}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const LifestyleHub: React.FC = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<LifestyleProvider[]>(() => getProviders());
  const [snap, setSnap] = useState<LifestyleSnapshot>(() => getSnapshot());

  const refresh = () => {
    setProviders(getProviders());
    setSnap(getSnapshot());
  };

  useEffect(() => { refresh(); }, []);

  const handleToggle = (id: LifestyleProvider['id'], connect: boolean) => {
    if (connect) {
      const r = connectProvider(id);
      if (r) toast({ title: `${r.icon} ${r.name} connected`, description: 'Demo data synced. Concierge AI will now personalise to your level.' });
    } else {
      const r = disconnectProvider(id);
      if (r) toast({ title: `${r.name} disconnected`, description: 'Local data removed.' });
    }
    refresh();
  };

  const handleSync = (id: LifestyleProvider['id']) => {
    const r = syncProvider(id);
    if (r) toast({ title: `${r.name} re-synced`, description: 'Latest snapshot pulled.' });
    refresh();
  };

  const summary = useMemo(() => ({
    connected: providers.filter(p => p.status === 'connected').length,
    total: providers.length,
  }), [providers]);

  const grouped = useMemo(() => {
    const map = new Map<string, LifestyleProvider[]>();
    providers.forEach(p => {
      const arr = map.get(p.category) || [];
      arr.push(p);
      map.set(p.category, arr);
    });
    return [...map.entries()];
  }, [providers]);

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Lifestyle Intelligence
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Connect Spotify, Oura, Garmin, Strava and WHOOP. The Concierge will use your music taste, sleep, fitness level and skills to recommend partners, gear, tournaments, venues and deals at your level — always one step ahead.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Zap className="w-3 h-3" />
          {summary.connected} / {summary.total} active
        </Badge>
      </div>

      {/* Live insights */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Live insights powering your Concierge</h3>
        <InsightsPanel snap={snap} />
      </div>

      <Separator />

      {/* Providers grouped by category */}
      {grouped.map(([category, items]) => {
        const Icon = CATEGORY_ICON[category] || Activity;
        return (
          <div key={category}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2 capitalize">
              <Icon className="w-4 h-4" />
              {category}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map(p => (
                <ProviderCard key={p.id} provider={p} onToggle={handleToggle} onSync={handleSync} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <Card className="bg-muted/30">
        <CardContent className="p-3 space-y-1">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            Demo mode — data is simulated and stored locally. In the live version, OAuth tokens are managed via Lovable Connectors and credentials never touch our servers.
          </p>
          <p className="text-[10px] text-muted-foreground text-center">
            Production swap-in: each provider already ships its OAuth metadata (scopes, auth URL, docs link). Replace <code>getSimulated*</code> with a real <code>fetch()</code> per provider.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifestyleHub;
