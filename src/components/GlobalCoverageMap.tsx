import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star, Users } from 'lucide-react';
import { GLOBAL_CITIES, getCitiesByTier } from '@/data/globalCities';
import { GlobalCity } from '@/types/cityServices';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GlobalCoverageMapProps {
  onCitySelect: (cityId: string) => void;
}

const GlobalCoverageMap = ({ onCitySelect }: GlobalCoverageMapProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const filteredCities = GLOBAL_CITIES.filter(city => {
    const matchesSearch = city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         city.countryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = !selectedTier || city.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'tier1':
        return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50';
      case 'tier2':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/50';
      case 'tier3':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/50';
      default:
        return 'bg-muted';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'tier1':
        return 'Full Coverage';
      case 'tier2':
        return 'Partial Coverage';
      case 'tier3':
        return 'Basic Coverage';
      default:
        return tier;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cities or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTier === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTier(null)}
            >
              All Cities ({GLOBAL_CITIES.length})
            </Button>
            <Button
              variant={selectedTier === 'tier1' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTier('tier1')}
              className={selectedTier === 'tier1' ? '' : 'border-green-500/50'}
            >
              Tier 1 ({getCitiesByTier('tier1').length})
            </Button>
            <Button
              variant={selectedTier === 'tier2' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTier('tier2')}
              className={selectedTier === 'tier2' ? '' : 'border-blue-500/50'}
            >
              Tier 2 ({getCitiesByTier('tier2').length})
            </Button>
            <Button
              variant={selectedTier === 'tier3' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTier('tier3')}
              className={selectedTier === 'tier3' ? '' : 'border-orange-500/50'}
            >
              Tier 3 ({getCitiesByTier('tier3').length})
            </Button>
          </div>
        </div>
      </Card>

      {/* City Grid */}
      <ScrollArea className="h-[600px] rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCities.map((city) => (
            <Card
              key={city.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => onCitySelect(city.id)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                      {city.cityName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{city.countryName}</p>
                  </div>
                  <MapPin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getTierColor(city.tier)}>
                    {getTierLabel(city.tier)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{city.coverageScore}</span>
                    <span className="text-muted-foreground">/100</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{(city.metroPopulation / 1000000).toFixed(1)}M population</span>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Currency:</span>
                    <span className="font-medium">{city.currencyCode}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Language:</span>
                    <span className="font-medium">{city.primaryLanguage}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {filteredCities.length === 0 && (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No cities found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </Card>
      )}
    </div>
  );
};

export default GlobalCoverageMap;
