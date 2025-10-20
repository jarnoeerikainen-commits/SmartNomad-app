import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Wifi, 
  MapPin, 
  Search, 
  Shield, 
  Zap, 
  Star, 
  Copy, 
  ExternalLink, 
  Plus,
  TrendingUp,
  Award,
  Lock,
  Unlock,
  Signal,
  Download,
  Globe,
  Coins,
  Users,
  BarChart3,
  Leaf
} from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { LocationData } from '@/types/country';
import { useToast } from '@/hooks/use-toast';

interface WiFiHotspotFinderProps {
  subscription: Subscription;
  currentLocation: LocationData | null;
  onUpgradeClick: () => void;
}

interface WiFiHotspot {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isSecure: boolean;
  speed: number; // Mbps
  rating: number;
  reviews: number;
  distance: number; // km
  isVerified: boolean;
  lastUpdated: string;
  password?: string;
  rewardTokens?: number;
}

const WiFiHotspotFinder: React.FC<WiFiHotspotFinderProps> = ({
  subscription,
  currentLocation,
  onUpgradeClick
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [hotspots, setHotspots] = useState<WiFiHotspot[]>([]);
  const [loading, setLoading] = useState(false);
  const [userContributions, setUserContributions] = useState(0);
  const [wifiTokens, setWifiTokens] = useState(0);

  const isPremium = subscription.tier === 'premium' || subscription.tier === 'diamond';

  // Mock hotspot data - in production, this would come from WiFi Map API
  const mockHotspots: WiFiHotspot[] = [
    {
      id: '1',
      name: 'Starbucks Downtown',
      location: 'Coffee Shop',
      address: '123 Main Street',
      city: currentLocation?.city || 'Bangkok',
      country: currentLocation?.country || 'Thailand',
      latitude: 13.7563,
      longitude: 100.5018,
      isSecure: false,
      speed: 45,
      rating: 4.5,
      reviews: 234,
      distance: 0.3,
      isVerified: true,
      lastUpdated: '2 hours ago',
      password: 'Welcome2024',
      rewardTokens: 50
    },
    {
      id: '2',
      name: 'Central Library',
      location: 'Public Library',
      address: '456 Knowledge Ave',
      city: currentLocation?.city || 'Bangkok',
      country: currentLocation?.country || 'Thailand',
      latitude: 13.7563,
      longitude: 100.5018,
      isSecure: true,
      speed: 100,
      rating: 4.8,
      reviews: 567,
      distance: 0.8,
      isVerified: true,
      lastUpdated: '1 day ago',
      rewardTokens: 75
    },
    {
      id: '3',
      name: 'Co-Working Hub',
      location: 'Coworking Space',
      address: '789 Startup Lane',
      city: currentLocation?.city || 'Bangkok',
      country: currentLocation?.country || 'Thailand',
      latitude: 13.7563,
      longitude: 100.5018,
      isSecure: true,
      speed: 200,
      rating: 4.9,
      reviews: 892,
      distance: 1.2,
      isVerified: true,
      lastUpdated: '3 hours ago',
      password: 'Cowork2024!',
      rewardTokens: 100
    }
  ];

  useEffect(() => {
    // Load user contributions from localStorage
    const savedContributions = localStorage.getItem('wifiContributions');
    const savedTokens = localStorage.getItem('wifiTokens');
    if (savedContributions) setUserContributions(parseInt(savedContributions));
    if (savedTokens) setWifiTokens(parseInt(savedTokens));

    // Auto-load hotspots based on current location
    if (currentLocation) {
      setSelectedCity(currentLocation.city);
      searchHotspots(currentLocation.city);
    }
  }, [currentLocation]);

  const searchHotspots = (query: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setHotspots(mockHotspots);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Enter a location',
        description: 'Please enter a city or location to search for WiFi hotspots.',
        variant: 'destructive'
      });
      return;
    }
    searchHotspots(searchQuery);
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setSearchQuery(currentLocation.city);
      setSelectedCity(currentLocation.city);
      searchHotspots(currentLocation.city);
      toast({
        title: 'Location detected',
        description: `Searching for WiFi hotspots in ${currentLocation.city}`
      });
    } else {
      toast({
        title: 'Location unavailable',
        description: 'Please enable location services or enter a city manually.',
        variant: 'destructive'
      });
    }
  };

  const handleCopyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    toast({
      title: 'Password copied!',
      description: 'WiFi password has been copied to clipboard.'
    });
  };

  const handleVerifyHotspot = (hotspotId: string) => {
    if (!isPremium) {
      onUpgradeClick();
      return;
    }

    const newContributions = userContributions + 1;
    const newTokens = wifiTokens + 50;
    
    setUserContributions(newContributions);
    setWifiTokens(newTokens);
    
    localStorage.setItem('wifiContributions', newContributions.toString());
    localStorage.setItem('wifiTokens', newTokens.toString());

    toast({
      title: '🎉 Hotspot verified!',
      description: 'You earned 50 $WIFI tokens for verifying this hotspot.'
    });
  };

  const handleAddHotspot = () => {
    if (!isPremium) {
      onUpgradeClick();
      return;
    }

    const newContributions = userContributions + 1;
    const newTokens = wifiTokens + 100;
    
    setUserContributions(newContributions);
    setWifiTokens(newTokens);
    
    localStorage.setItem('wifiContributions', newContributions.toString());
    localStorage.setItem('wifiTokens', newTokens.toString());

    toast({
      title: '🎉 Hotspot added!',
      description: 'You earned 100 $WIFI tokens for adding a new hotspot to the community.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wifi className="h-8 w-8 text-primary" />
              WiFi Hotspot Finder
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover reliable WiFi hotspots worldwide with WiFi Map
            </p>
          </div>
          {isPremium && (
            <Badge className="bg-gradient-premium text-white">
              <Award className="h-4 w-4 mr-1" />
              Premium Access
            </Badge>
          )}
        </div>

        {/* User Stats */}
        {isPremium && (
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold">{wifiTokens}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">$WIFI Tokens</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-2xl font-bold">{userContributions}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Contributions</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-5 w-5 text-orange-500" />
                    <span className="text-2xl font-bold">4.8</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Your Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Leaf className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold">12kg</span>
                  </div>
                  <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* eSIM Promo */}
      <Alert className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-orange-500/20">
        <Globe className="h-5 w-5 text-orange-500" />
        <AlertDescription className="ml-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <strong>Special Offer:</strong> Get 10% OFF your first eSIM purchase with code{' '}
              <Badge variant="secondary" className="font-mono">
                TRAVELSMART
              </Badge>
              {' '}• Works in 90+ countries
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-sunset hover:opacity-90"
              onClick={() => window.open('https://www.wifimap.io/esim', '_blank')}
            >
              Buy eSIM
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="map">
            <MapPin className="h-4 w-4 mr-2" />
            Map
          </TabsTrigger>
          <TabsTrigger value="list">
            <Wifi className="h-4 w-4 mr-2" />
            Hotspots
          </TabsTrigger>
          <TabsTrigger value="community">
            <Users className="h-4 w-4 mr-2" />
            Community
          </TabsTrigger>
          <TabsTrigger value="analytics" disabled={!isPremium}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
            {!isPremium && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
        </TabsList>

        {/* Map View */}
        <TabsContent value="map" className="space-y-4">
          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Enter city or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleUseCurrentLocation}
                  disabled={loading}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Use My Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Map Embed */}
          <Card className="overflow-hidden">
            <div className="relative w-full h-[500px] bg-muted">
              <iframe
                src="https://www.wifimap.io/embed"
                className="absolute inset-0 w-full h-full border-0"
                title="WiFi Map Hotspots"
                loading="lazy"
              />
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-white/90 text-foreground shadow-lg">
                  <Signal className="h-3 w-3 mr-1" />
                  180M+ Hotspots
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quick Tips */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-500" />
                Offline Mode Available
              </CardTitle>
              <CardDescription>
                Download maps and hotspot data for offline access when traveling without internet.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="animate-pulse">Loading hotspots...</div>
              </CardContent>
            </Card>
          ) : hotspots.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Wifi className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No hotspots found. Try searching for a different location.
                </p>
              </CardContent>
            </Card>
          ) : (
            hotspots.map((hotspot) => (
              <Card key={hotspot.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{hotspot.name}</CardTitle>
                        {hotspot.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {hotspot.location}
                        </span>
                        <span className="flex items-center gap-1">
                          {hotspot.isSecure ? (
                            <Lock className="h-3 w-3 text-green-500" />
                          ) : (
                            <Unlock className="h-3 w-3 text-orange-500" />
                          )}
                          {hotspot.isSecure ? 'Secure' : 'Open'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Signal className="h-3 w-3" />
                          {hotspot.speed} Mbps
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{hotspot.rating}</span>
                      <span className="text-muted-foreground text-sm">
                        ({hotspot.reviews})
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Address */}
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p>{hotspot.address}</p>
                        <p className="text-muted-foreground">
                          {hotspot.city}, {hotspot.country}
                        </p>
                      </div>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Distance</span>
                      <span className="font-medium">{hotspot.distance} km away</span>
                    </div>

                    {/* Speed Test */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          Speed Test
                        </span>
                        <span className="font-medium">{hotspot.speed} Mbps</span>
                      </div>
                      <Progress value={(hotspot.speed / 200) * 100} className="h-2" />
                    </div>

                    {/* Password */}
                    {hotspot.password && (
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">WiFi Password</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyPassword(hotspot.password!)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <code className="block text-sm font-mono bg-background px-3 py-2 rounded">
                          {hotspot.password}
                        </code>
                      </div>
                    )}

                    {/* Actions */}
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span>Earn {hotspot.rewardTokens} $WIFI tokens</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyHotspot(hotspot.id)}
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => window.open(`https://maps.google.com/?q=${hotspot.latitude},${hotspot.longitude}`, '_blank')}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Navigate
                        </Button>
                      </div>
                    </div>

                    {/* Last Updated */}
                    <p className="text-xs text-muted-foreground text-right">
                      Updated {hotspot.lastUpdated}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Community Contributions
              </CardTitle>
              <CardDescription>
                Help fellow nomads by adding and verifying WiFi hotspots. Earn $WIFI tokens for every contribution!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Hotspot */}
              <Button 
                className="w-full bg-gradient-sunset hover:opacity-90" 
                size="lg"
                onClick={handleAddHotspot}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Hotspot
                <Badge className="ml-2 bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                  +100 $WIFI
                </Badge>
              </Button>

              <Separator />

              {/* Token System */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  $WIFI Token Rewards
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Add New Hotspot</p>
                      <p className="text-sm text-muted-foreground">Submit a new WiFi location</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-500">+100 $WIFI</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Verify Hotspot</p>
                      <p className="text-sm text-muted-foreground">Confirm existing location</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-500">+50 $WIFI</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Update Speed Test</p>
                      <p className="text-sm text-muted-foreground">Share speed test results</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-500">+25 $WIFI</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Trade Tokens */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Trade Your Tokens
                </h3>
                <p className="text-sm text-muted-foreground">
                  $WIFI tokens can be traded on major exchanges including OKX, KuCoin, and more.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('https://weconnectu.io', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Exchange
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-500" />
                Top Contributors This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'NomadExplorer', contributions: 847, tokens: 42350 },
                  { rank: 2, name: 'WiFiHunter', contributions: 623, tokens: 31150 },
                  { rank: 3, name: 'DigitalTraveler', contributions: 501, tokens: 25050 }
                ].map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={user.rank === 1 ? 'default' : 'secondary'}
                        className={
                          user.rank === 1
                            ? 'bg-gradient-premium text-white'
                            : ''
                        }
                      >
                        #{user.rank}
                      </Badge>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.contributions} contributions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold flex items-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        {user.tokens.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {!isPremium ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
                <p className="text-muted-foreground mb-6">
                  Upgrade to Premium ($79/year) to unlock advanced analytics, carbon tracking, and auto-connect features.
                </p>
                <Button onClick={onUpgradeClick} className="bg-gradient-premium hover:opacity-90">
                  <Award className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Connection Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Your WiFi Usage Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold">234</p>
                      <p className="text-sm text-muted-foreground">Hotspots Used</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold">18</p>
                      <p className="text-sm text-muted-foreground">Countries</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold">45</p>
                      <p className="text-sm text-muted-foreground">Cities</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Carbon Tracking */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-500" />
                      Carbon Impact Tracking
                    </h3>
                    <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">CO₂ Saved This Year</span>
                        <span className="text-2xl font-bold text-green-600">12.5 kg</span>
                      </div>
                      <Progress value={62} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        By using WiFi hotspots instead of mobile data roaming
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Auto-Connect */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      Auto-Connect to Secure Hotspots
                    </h3>
                    <Alert className="bg-blue-500/10 border-blue-500/20">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <AlertDescription className="ml-2">
                        Premium feature enabled: Automatically connect to verified secure hotspots when available.
                      </AlertDescription>
                    </Alert>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Auto-connect enabled</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Bottom Info */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Powered by WiFi Map • 180M+ users • 2M+ reviews worldwide
            </p>
            <Button
              variant="link"
              onClick={() => window.open('https://www.wifimap.io/', '_blank')}
            >
              Learn more about WiFi Map
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WiFiHotspotFinder;
