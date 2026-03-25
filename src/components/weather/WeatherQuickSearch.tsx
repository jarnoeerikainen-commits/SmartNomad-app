import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Cloud, Sun, CloudRain, CloudSnow, Thermometer } from 'lucide-react';
import { TOP_WEATHER_CITIES, WeatherCity } from '@/data/weatherCities';

interface WeatherQuickSearchProps {
  onSelectCity: (city: WeatherCity) => void;
  currentCity?: string;
}

const WeatherQuickSearch: React.FC<WeatherQuickSearchProps> = ({ onSelectCity, currentCity }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return TOP_WEATHER_CITIES.filter(
      c => c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search any city worldwide..."
          className="pl-10 h-12 text-base"
        />
      </div>

      {results.length > 0 && (
        <div className="absolute z-30 w-full mt-1 bg-popover border rounded-xl shadow-large max-h-64 overflow-y-auto">
          {results.map(city => (
            <button
              key={`${city.city}-${city.country}`}
              className="w-full text-left px-4 py-3 hover:bg-accent/50 flex items-center justify-between transition-colors"
              onClick={() => {
                onSelectCity(city);
                setQuery('');
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{city.emoji}</span>
                <div>
                  <p className="font-medium text-sm">{city.city}</p>
                  <p className="text-xs text-muted-foreground">{city.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{city.region}</Badge>
                {city.city === currentCity && (
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    You
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherQuickSearch;
