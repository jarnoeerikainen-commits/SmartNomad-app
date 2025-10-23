import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, MapPin, Clock, TrendingUp, TrendingDown, Minus, Bell, Settings, Radio } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThreatIntelligenceService } from '@/services/ThreatIntelligenceService';
import { ThreatIncident, ThreatSeverity } from '@/types/threat';

const ThreatDashboard: React.FC = () => {
  const [activeThreats, setActiveThreats] = useState<ThreatIncident[]>([]);
  const [isInDanger, setIsInDanger] = useState(false);
  const [statistics, setStatistics] = useState(ThreatIntelligenceService.getStatistics());
  const [watchlist, setWatchlist] = useState(ThreatIntelligenceService.getWatchlist());

  useEffect(() => {
    loadData();
    
    // Simulate real-time updates
    const interval = setInterval(loadData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const threats = ThreatIntelligenceService.getActiveThreats();
    setActiveThreats(threats);
    setIsInDanger(ThreatIntelligenceService.isUserInDangerZone());
    setStatistics(ThreatIntelligenceService.getStatistics());
    setWatchlist(ThreatIntelligenceService.getWatchlist());
  };

  const getSeverityColor = (severity: ThreatSeverity): string => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      case 'info':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getTrendIcon = () => {
    if (statistics.trend === 'improving') return <TrendingDown className="h-4 w-4 text-green-500" />;
    if (statistics.trend === 'deteriorating') return <TrendingUp className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header with Live Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Threat Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time global threat monitoring powered by Intelligence Fusion
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Radio className={`h-4 w-4 ${isInDanger ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
            <span className="text-sm font-medium">Live</span>
          </div>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {isInDanger && (
        <Alert variant="destructive" className="animate-pulse border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Critical Threats Detected Near You!</AlertTitle>
          <AlertDescription className="text-base">
            {ThreatIntelligenceService.getCriticalThreats().length} active high-priority threats within 25km. 
            Review immediate actions below and stay safe.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{statistics.critical}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{statistics.high}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Medium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{statistics.medium}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Near You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{statistics.activeNearby}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className="text-lg font-semibold capitalize">{statistics.trend}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Threats</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="map">Threat Map</TabsTrigger>
        </TabsList>

        {/* Active Threats Tab */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Active Threats Near You
              </CardTitle>
              <CardDescription>
                Showing {activeThreats.length} active threats globally
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {activeThreats.map((threat) => {
                    const severityInfo = ThreatIntelligenceService.getSeverityInfo(threat.severity);
                    const categoryInfo = ThreatIntelligenceService.getCategoryInfo(threat.type);
                    
                    return (
                      <Card key={threat.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={getSeverityColor(threat.severity) as any}>
                                  {severityInfo.icon} {severityInfo.label}
                                </Badge>
                                <Badge variant="outline">
                                  {categoryInfo.icon} {categoryInfo.label}
                                </Badge>
                                <Badge variant="outline" className="ml-auto">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {threat.distanceFromUser.toFixed(1)} km away
                                </Badge>
                              </div>
                              <CardTitle className="text-xl">{threat.title}</CardTitle>
                              <CardDescription className="mt-1 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {ThreatIntelligenceService.getTimeAgo(threat.timestamp)}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm">{threat.description}</p>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Location</span>
                            </div>
                            <p className="text-sm text-muted-foreground pl-6">
                              {threat.location.address}, {threat.location.city}, {threat.location.country}
                            </p>
                            <p className="text-xs text-muted-foreground pl-6 mt-1">
                              Affected radius: {threat.location.radius} km
                            </p>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Recommended Actions
                            </h4>
                            <ul className="space-y-1 pl-6">
                              {threat.recommendedActions.map((action, idx) => (
                                <li key={idx} className="text-sm list-disc text-muted-foreground">
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-xs text-muted-foreground">
                              Confidence: {threat.confidence}% | Sources: {threat.sources.join(', ')}
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Watchlist Tab */}
        <TabsContent value="watchlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Your Watchlist ({watchlist.length} Locations)
              </CardTitle>
              <CardDescription>
                Monitor security status in locations you care about
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {watchlist.map((location) => {
                  const statusColor = 
                    location.currentStatus === 'safe' ? 'text-green-500' :
                    location.currentStatus === 'caution' ? 'text-yellow-500' :
                    'text-red-500';
                  
                  const statusBg = 
                    location.currentStatus === 'safe' ? 'bg-green-500/10 border-green-500/20' :
                    location.currentStatus === 'caution' ? 'bg-yellow-500/10 border-yellow-500/20' :
                    'bg-red-500/10 border-red-500/20';

                  return (
                    <Card key={location.id} className={statusBg}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{location.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Monitoring radius: {location.radius} km
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${statusColor} capitalize`}>
                              {location.currentStatus}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {location.activeThreats} active {location.activeThreats === 1 ? 'threat' : 'threats'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Add New Location
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Threat Map Tab */}
        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Global Threat Map
              </CardTitle>
              <CardDescription>
                Interactive visualization of global security threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-[500px] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Interactive threat map coming soon</p>
                  <p className="text-xs text-muted-foreground">Diamond Plan Feature</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Map Controls</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• Real-time incident markers</p>
                    <p>• Heat map visualization</p>
                    <p>• Historical pattern analysis</p>
                    <p>• Safe route suggestions</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Legend</h4>
                  <div className="space-y-1 text-xs">
                    <p>🔴 Critical - Immediate danger</p>
                    <p>🟠 High - Serious threat</p>
                    <p>🟡 Medium - Moderate risk</p>
                    <p>🟢 Low - Minor concern</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Contact Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Emergency Protocols
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="destructive" className="h-auto py-4 flex-col gap-2">
              <Shield className="h-6 w-6" />
              <span>Emergency Services</span>
              <span className="text-xs">Call 112/911</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <MapPin className="h-6 w-6" />
              <span>Nearest Embassy</span>
              <span className="text-xs">Find Location</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Bell className="h-6 w-6" />
              <span>Alert Contacts</span>
              <span className="text-xs">Send SOS</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatDashboard;
