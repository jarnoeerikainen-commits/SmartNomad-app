import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/contexts/LocationContext';
import { WellnessCategory, WELLNESS_CATEGORY_INFO } from '@/types/wellness';
import { WELLNESS_CITIES, WELLNESS_REGIONS, SAMPLE_PROVIDERS, getDistance } from '@/data/wellnessData';
import { WellnessProviderCard } from './WellnessProviderCard';
import {
  Search, MapPin, Dumbbell, Sparkles, Heart, Crown,
  Flame, Activity, Hand, Zap, Filter, Star, Globe, LocateFixed, X
} from 'lucide-react';

const CATEGORY_ICONS: Record<WellnessCategory, React.ComponentType<{ className?: string }>> = {
  'gym': Dumbbell,
  'spa': Sparkles,
  'yoga': Heart,
  'private-gym': Crown,
  'sauna': Flame,
  'sports-testing': Activity,
  'massage': Hand,
  'performance': Zap,
};

const WellnessDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WellnessCategory | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'reviews'>('distance');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { location } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Sort cities by distance from user
  const sortedCities = useMemo(() => {
    if (!location) return WELLNESS_CITIES;
    return [...WELLNESS_CITIES].sort((a, b) => {
      const distA = getDistance(location.latitude, location.longitude, a.latitude, a.longitude);
      const distB = getDistance(location.latitude, location.longitude, b.latitude, b.longitude);
      return distA - distB;
    });
  }, [location]);

  // Nearest city
  const nearestCity = sortedCities[0];

  // Auto-select nearest city on load
  useEffect(() => {
    if (location && nearestCity && selectedCity === 'all') {
      setSelectedCity(nearestCity.id);
      toast({
        title: '📍 Location Detected',
        description: `Showing wellness near ${nearestCity.name}, ${nearestCity.country}`,
      });
    }
  }, [location, nearestCity]);

  // Filter cities by region
  const filteredCities = useMemo(() => {
    if (selectedRegion === 'all') return sortedCities;
    return sortedCities.filter(c => c.region === selectedRegion);
  }, [sortedCities, selectedRegion]);

  // Filter providers
  const filteredProviders = useMemo(() => {
    let providers = [...SAMPLE_PROVIDERS];

    // City filter
    if (selectedCity !== 'all') {
      const city = WELLNESS_CITIES.find(c => c.id === selectedCity);
      if (city) {
        providers = providers.filter(p => p.city === city.name);
      }
    }

    // Category filter
    if (selectedCategory !== 'all') {
      providers = providers.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      providers = providers.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.highlights.some(h => h.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'rating') {
      providers.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      providers.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    // Hintsa always featured at top when showing performance category
    if (selectedCategory === 'performance' || selectedCategory === 'all') {
      const hintsa = providers.filter(p => p.isHintsa);
      const others = providers.filter(p => !p.isHintsa);
      providers = [...hintsa, ...others];
    }

    return providers;
  }, [selectedCity, selectedCategory, searchQuery, sortBy]);

  const handleMyLocation = () => {
    if (location && nearestCity) {
      setSelectedCity(nearestCity.id);
      setSelectedRegion('all');
      toast({
        title: '📍 Location Updated',
        description: `Showing wellness near ${nearestCity.name}`,
      });
    } else {
      toast({
        title: 'Location Unavailable',
        description: 'Enable location access for auto-detection.',
        variant: 'destructive',
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRegion('all');
    setSelectedCity('all');
    setSortBy('distance');
  };

  const activeFilters = [selectedCategory !== 'all', selectedRegion !== 'all', selectedCity !== 'all', searchQuery.trim() !== ''].filter(Boolean).length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-8 w-96" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-16" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Dumbbell className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Wellness & Fitness</h1>
            <p className="text-sm text-muted-foreground">100 cities · 4★+ rated · Gyms, Spas, Yoga, Saunas & more</p>
          </div>
        </div>
      </div>

      {/* Hintsa Performance Featured Banner */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-background to-accent/5 overflow-hidden">
        <CardContent className="py-4 px-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">Hintsa Performance</h3>
                  <Badge variant="default" className="text-[10px]">PARTNER</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Elite coaching for F1 drivers & executives · Science-backed wellbeing</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => window.open('https://www.hintsa.com', '_blank')}>
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className="cursor-pointer transition-all hover:shadow-sm px-3 py-1.5"
          onClick={() => setSelectedCategory('all')}
        >
          <Globe className="w-3.5 h-3.5 mr-1" />
          All Categories
        </Badge>
        {(Object.keys(WELLNESS_CATEGORY_INFO) as WellnessCategory[]).map(cat => {
          const info = WELLNESS_CATEGORY_INFO[cat];
          const Icon = CATEGORY_ICONS[cat];
          return (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:shadow-sm px-3 py-1.5"
              onClick={() => setSelectedCategory(cat)}
            >
              <Icon className="w-3.5 h-3.5 mr-1" />
              {info.label}
            </Badge>
          );
        })}
      </div>

      {/* Search & Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-4 pb-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search gyms, spas, yoga studios..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleMyLocation} className="shrink-0">
              <LocateFixed className="w-4 h-4 mr-1" />
              My Location
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={selectedRegion} onValueChange={v => { setSelectedRegion(v); setSelectedCity('all'); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {WELLNESS_REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">All Cities</SelectItem>
                {filteredCities.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}, {c.countryCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Nearest</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
              </SelectContent>
            </Select>

            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-3.5 h-3.5 mr-1" /> Clear ({activeFilters})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found <span className="font-semibold text-foreground">{filteredProviders.length}</span> provider{filteredProviders.length !== 1 ? 's' : ''}
          {selectedCity !== 'all' && ` in ${WELLNESS_CITIES.find(c => c.id === selectedCity)?.name || ''}`}
        </p>
      </div>

      {filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProviders.map(provider => (
            <WellnessProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Dumbbell className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Providers Found</h3>
            <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters or selecting a different city.</p>
            <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
          </CardContent>
        </Card>
      )}

      {/* Quality Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-5 px-5">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Quality Guarantee</h3>
              <ul className="text-sm text-muted-foreground space-y-0.5">
                <li>• All providers rated 4.0+ stars with verified reviews</li>
                <li>• Real addresses, contact info and operating hours</li>
                <li>• Hintsa Performance partnership for elite coaching</li>
                <li>• Synced with AI Concierge for personalized recommendations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellnessDashboard;
