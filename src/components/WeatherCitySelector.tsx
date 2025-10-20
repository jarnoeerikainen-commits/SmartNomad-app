import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Search } from 'lucide-react';
import { TOP_WEATHER_CITIES, WeatherCity } from '@/data/weatherCities';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WeatherCitySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: WeatherCity) => void;
  excludedCities: string[];
  maxSelections?: number;
}

const WeatherCitySelector: React.FC<WeatherCitySelectorProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  excludedCities,
  maxSelections = 5,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Get unique regions
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(
      new Set(TOP_WEATHER_CITIES.map((city) => city.region))
    ).sort();
    return ['all', ...uniqueRegions];
  }, []);

  // Filter cities based on search and region
  const filteredCities = useMemo(() => {
    let cities = TOP_WEATHER_CITIES;

    // Filter by region
    if (selectedRegion !== 'all') {
      cities = cities.filter((city) => city.region === selectedRegion);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      cities = cities.filter(
        (city) =>
          city.city.toLowerCase().includes(query) ||
          city.country.toLowerCase().includes(query) ||
          city.region.toLowerCase().includes(query)
      );
    }

    // Exclude already selected cities
    cities = cities.filter((city) => !excludedCities.includes(city.city));

    return cities;
  }, [searchQuery, selectedRegion, excludedCities]);

  // Group cities by region for display
  const groupedCities = useMemo(() => {
    const groups: Record<string, WeatherCity[]> = {};
    filteredCities.forEach((city) => {
      if (!groups[city.region]) {
        groups[city.region] = [];
      }
      groups[city.region].push(city);
    });
    return groups;
  }, [filteredCities]);

  const handleSelectCity = (city: WeatherCity) => {
    onSelectCity(city);
    setSearchQuery('');
    onClose();
  };

  const availableSlots = maxSelections - excludedCities.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Add City to Track
          </DialogTitle>
          <DialogDescription>
            Choose from 100 top cities worldwide. {availableSlots > 0 ? (
              <span className="text-primary font-medium">
                {availableSlots} slot{availableSlots !== 1 ? 's' : ''} available
              </span>
            ) : (
              <span className="text-destructive font-medium">
                Maximum cities reached
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          {/* Region Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion(region)}
                className={
                  selectedRegion === region
                    ? 'gradient-primary shrink-0'
                    : 'shrink-0'
                }
              >
                {region === 'all' ? 'All Regions' : region}
              </Button>
            ))}
          </div>
        </div>

        <Command className="rounded-none border-t border-b bg-transparent">
          <div className="px-3">
            <CommandInput
              placeholder="Search cities or countries..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-12"
            />
          </div>
          <CommandList className="max-h-[400px]">
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No cities found matching "{searchQuery}"
                </p>
              </div>
            </CommandEmpty>

            <ScrollArea className="h-[400px]">
              {Object.entries(groupedCities).map(([region, cities]) => (
                <CommandGroup
                  key={region}
                  heading={region}
                  className="[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-primary [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-3"
                >
                  {cities.map((city) => (
                    <CommandItem
                      key={`${city.city}-${city.country}`}
                      value={`${city.city} ${city.country}`}
                      onSelect={() => handleSelectCity(city)}
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{city.emoji}</span>
                        <div className="flex-1">
                          <p className="font-medium">{city.city}</p>
                          <p className="text-sm text-muted-foreground">
                            {city.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {city.region}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCity(city);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </ScrollArea>
          </CommandList>
        </Command>

        <div className="px-6 py-4 bg-muted/30 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>
                Showing {filteredCities.length} of {TOP_WEATHER_CITIES.length - excludedCities.length} cities
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeatherCitySelector;