import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { snomadVaultService } from '@/services/SnomadVaultService';
import {
  Shield, Brain, Globe, MapPin, Network, RefreshCw, Lock,
  Plus, Calendar, Fingerprint, Activity, TrendingUp, Loader2,
  ChevronRight, AlertTriangle, Heart, Calculator, Eye
} from 'lucide-react';

const SnomadIdVault: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Vault state
  const [stats, setStats] = useState({
    preferenceCount: 0,
    completenessScore: 0,
    travelEntries: 0,
    graphEdges: 0,
    lastSynced: null as string | null,
  });
  const [travelHistory, setTravelHistory] = useState<any[]>([]);
  const [graphEdges, setGraphEdges] = useState<any[]>([]);
  const [identity, setIdentity] = useState<any>(null);

  // Add travel form
  const [newTravel, setNewTravel] = useState({
    countryCode: '', countryName: '', city: '',
    entryDate: '', exitDate: '', purpose: 'leisure',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [vaultStats, history, edges, id] = await Promise.all([
        snomadVaultService.getVaultStats(),
        snomadVaultService.getTravelHistory(20),
        snomadVaultService.getKnowledgeGraphEdges(undefined, 30),
        snomadVaultService.getIdentity(),
      ]);
      setStats(vaultStats);
      setTravelHistory(history);
      setGraphEdges(edges);
      setIdentity(id);
    } catch (e) {
      console.warn('Load vault data failed:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSync = async () => {
    setSyncing(true);
    const success = await snomadVaultService.syncLocalProfileToVault();
    if (success) {
      toast({ title: '🔐 Vault Synced', description: 'Your profile data is now encrypted in the Snomad ID vault.' });
      await loadData();
    } else {
      toast({ title: 'Sync Failed', description: 'Could not sync profile data.', variant: 'destructive' });
    }
    setSyncing(false);
  };

  const handleAddTravel = async () => {
    if (!newTravel.countryCode || !newTravel.countryName || !newTravel.entryDate) {
      toast({ title: 'Missing Fields', description: 'Country code, name, and entry date are required.', variant: 'destructive' });
      return;
    }
    const success = await snomadVaultService.addTravelEntry({
      countryCode: newTravel.countryCode.toUpperCase(),
      countryName: newTravel.countryName,
      city: newTravel.city || undefined,
      entryDate: newTravel.entryDate,
      exitDate: newTravel.exitDate || undefined,
      purpose: newTravel.purpose,
    });
    if (success) {
      toast({ title: '✈️ Travel Entry Added', description: `${newTravel.countryName} logged + knowledge graph updated.` });
      setNewTravel({ countryCode: '', countryName: '', city: '', entryDate: '', exitDate: '', purpose: 'leisure' });
      await loadData();
    }
  };

  const getRelationshipColor = (rel: string) => {
    switch (rel) {
      case 'triggers': return 'bg-accent/20 text-accent-foreground border-accent/30';
      case 'requires': return 'bg-primary/20 text-primary border-primary/30';
      case 'conflicts-with': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'enhances': return 'bg-secondary text-secondary-foreground border-secondary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tax-rule': case 'tax-alert': return <Calculator className="w-3.5 h-3.5" />;
      case 'threat-alert': case 'security-alert': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'visa-requirement': return <Globe className="w-3.5 h-3.5" />;
      case 'health-alert': return <Heart className="w-3.5 h-3.5" />;
      case 'travel': return <MapPin className="w-3.5 h-3.5" />;
      default: return <Network className="w-3.5 h-3.5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Fingerprint className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Snomad ID</h1>
                <p className="text-sm text-muted-foreground">Vectorized Knowledge Graph • Identity Vault</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 max-w-lg">
              Your encrypted identity vault. Every preference, document, and travel record forms a
              knowledge graph that powers mind-reading AI recommendations.
            </p>
          </div>
          <Button onClick={handleSync} disabled={syncing} variant="outline" className="gap-2">
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Sync Profile
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <StatCard icon={<Brain className="w-5 h-5" />} label="Preferences" value={stats.preferenceCount} />
          <StatCard icon={<Globe className="w-5 h-5" />} label="Travel Entries" value={stats.travelEntries} />
          <StatCard icon={<Network className="w-5 h-5" />} label="Graph Edges" value={stats.graphEdges} />
          <div className="bg-card/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-muted-foreground">Vault Score</span>
            </div>
            <div className="text-xl font-bold text-foreground">{Math.round(stats.completenessScore * 100)}%</div>
            <Progress value={stats.completenessScore * 100} className="h-1.5 mt-1" />
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="overview" className="gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Overview
          </TabsTrigger>
          <TabsTrigger value="identity" className="gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Identity
          </TabsTrigger>
          <TabsTrigger value="travel" className="gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Travel
          </TabsTrigger>
          <TabsTrigger value="graph" className="gap-1.5">
            <Network className="w-3.5 h-3.5" /> Graph
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Knowledge Graph Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {graphEdges.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No graph edges yet. Add travel entries or sync your profile to generate connections.
                </p>
              ) : (
                <div className="space-y-2">
                  {graphEdges.slice(0, 10).map((edge: any) => (
                    <div key={edge.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/30">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        {getTypeIcon(edge.source_type)}
                        <span className="text-xs font-medium">{edge.source_type}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="outline" className={`text-[10px] ${getRelationshipColor(edge.relationship)}`}>
                        {edge.relationship}
                      </Badge>
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(edge.target_type)}
                        <span className="text-xs font-medium text-foreground">{edge.target_type}</span>
                      </div>
                      <span className="ml-auto text-[10px] text-muted-foreground">
                        w: {edge.weight?.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Identity Tab */}
        <TabsContent value="identity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                Encrypted Identity Vault
                <Badge variant="outline" className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  AES-256-GCM
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {identity ? (
                <div className="space-y-3">
                  {identity.passports && (
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <span className="text-xs text-muted-foreground">Passports</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(Array.isArray(identity.passports) ? identity.passports : [identity.passports]).map((p: any, i: number) => (
                          <Badge key={i} variant="secondary">{typeof p === 'string' ? p : p.country || p}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {identity.medicalId && (
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <span className="text-xs text-muted-foreground">Medical ID</span>
                      <p className="text-sm text-foreground mt-1">●●●●●●●● (encrypted)</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Shield className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No identity data stored yet.</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={handleSync}>
                    Sync from Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Travel Tab */}
        <TabsContent value="travel" className="space-y-4">
          {/* Add Travel Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Log Travel Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Input placeholder="Country Code (e.g. FR)" value={newTravel.countryCode}
                  onChange={e => setNewTravel(p => ({ ...p, countryCode: e.target.value }))} />
                <Input placeholder="Country Name" value={newTravel.countryName}
                  onChange={e => setNewTravel(p => ({ ...p, countryName: e.target.value }))} />
                <Input placeholder="City (optional)" value={newTravel.city}
                  onChange={e => setNewTravel(p => ({ ...p, city: e.target.value }))} />
                <Input type="date" value={newTravel.entryDate}
                  onChange={e => setNewTravel(p => ({ ...p, entryDate: e.target.value }))} />
                <Input type="date" value={newTravel.exitDate}
                  onChange={e => setNewTravel(p => ({ ...p, exitDate: e.target.value }))} />
                <Select value={newTravel.purpose} onValueChange={v => setNewTravel(p => ({ ...p, purpose: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leisure">Leisure</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="digital-nomad">Digital Nomad</SelectItem>
                    <SelectItem value="transit">Transit</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="mt-3 w-full" onClick={handleAddTravel}>
                <Plus className="w-4 h-4 mr-2" /> Add Entry & Update Knowledge Graph
              </Button>
            </CardContent>
          </Card>

          {/* Travel History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Travel History
                <Badge variant="secondary" className="ml-2">{travelHistory.length} entries</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[400px]">
                {travelHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No travel history recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {travelHistory.map((trip: any) => (
                      <div key={trip.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                          {getFlagEmoji(trip.country_code)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{trip.country_name}</span>
                            {trip.city && <span className="text-xs text-muted-foreground">• {trip.city}</span>}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{trip.entry_date}</span>
                            {trip.exit_date && <span>→ {trip.exit_date}</span>}
                            <Badge variant="outline" className="text-[9px] h-4">{trip.purpose}</Badge>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[9px]">{trip.source}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Graph Tab */}
        <TabsContent value="graph" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                Knowledge Graph Connections
                <Badge variant="secondary" className="ml-2">{graphEdges.length} edges</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[500px]">
                {graphEdges.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Knowledge graph is empty. Add travel entries to generate cross-feature connections.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {graphEdges.map((edge: any) => (
                      <div key={edge.id} className="p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1.5 bg-card/50 rounded px-2 py-1">
                            {getTypeIcon(edge.source_type)}
                            <span className="text-xs font-medium">{edge.source_type}</span>
                          </div>
                          <Badge variant="outline" className={`text-[10px] ${getRelationshipColor(edge.relationship)}`}>
                            {edge.relationship}
                          </Badge>
                          <div className="flex items-center gap-1.5 bg-card/50 rounded px-2 py-1">
                            {getTypeIcon(edge.target_type)}
                            <span className="text-xs font-medium">{edge.target_type}</span>
                          </div>
                          <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                            weight: {edge.weight?.toFixed(2)}
                          </span>
                        </div>
                        {edge.metadata && Object.keys(edge.metadata).length > 0 && (
                          <div className="text-[11px] text-muted-foreground bg-background/50 rounded p-2 mt-1">
                            {edge.metadata.reason || edge.metadata.country || JSON.stringify(edge.metadata).slice(0, 100)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper components
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <div className="bg-card/50 rounded-lg p-3 border border-border/50">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-primary">{icon}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <div className="text-xl font-bold text-foreground">{value}</div>
  </div>
);

function getFlagEmoji(countryCode: string): string {
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌍';
  }
}

export default SnomadIdVault;
