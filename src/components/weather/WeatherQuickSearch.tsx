import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Globe, Loader2 } from 'lucide-react';
import { TOP_WEATHER_CITIES, WeatherCity } from '@/data/weatherCities';

interface WeatherQuickSearchProps {
  onSelectCity: (city: WeatherCity) => void;
  currentCity?: string;
}

// Country-to-emoji mapping for dynamic results
const COUNTRY_EMOJI: Record<string, string> = {
  'Finland': '🇫🇮', 'United States': '🇺🇸', 'United Kingdom': '🇬🇧', 'Germany': '🇩🇪',
  'France': '🇫🇷', 'Spain': '🇪🇸', 'Italy': '🇮🇹', 'Japan': '🇯🇵', 'China': '🇨🇳',
  'India': '🇮🇳', 'Brazil': '🇧🇷', 'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Mexico': '🇲🇽',
  'South Korea': '🇰🇷', 'Netherlands': '🇳🇱', 'Sweden': '🇸🇪', 'Norway': '🇳🇴',
  'Denmark': '🇩🇰', 'Portugal': '🇵🇹', 'Switzerland': '🇨🇭', 'Austria': '🇦🇹',
  'Belgium': '🇧🇪', 'Ireland': '🇮🇪', 'Poland': '🇵🇱', 'Czech Republic': '🇨🇿',
  'Greece': '🇬🇷', 'Turkey': '🇹🇷', 'Thailand': '🇹🇭', 'Indonesia': '🇮🇩',
  'Malaysia': '🇲🇾', 'Singapore': '🇸🇬', 'Philippines': '🇵🇭', 'Vietnam': '🇻🇳',
  'Argentina': '🇦🇷', 'Colombia': '🇨🇴', 'Chile': '🇨🇱', 'Peru': '🇵🇪',
  'Egypt': '🇪🇬', 'South Africa': '🇿🇦', 'Kenya': '🇰🇪', 'Nigeria': '🇳🇬',
  'Morocco': '🇲🇦', 'New Zealand': '🇳🇿', 'Russia': '🇷🇺', 'Ukraine': '🇺🇦',
  'Romania': '🇷🇴', 'Hungary': '🇭🇺', 'Bulgaria': '🇧🇬', 'Croatia': '🇭🇷',
  'Iceland': '🇮🇸', 'Estonia': '🇪🇪', 'Latvia': '🇱🇻', 'Lithuania': '🇱🇹',
  'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮', 'Serbia': '🇷🇸', 'UAE': '🇦🇪',
  'Qatar': '🇶🇦', 'Saudi Arabia': '🇸🇦', 'Israel': '🇮🇱', 'Taiwan': '🇹🇼',
  'Hong Kong': '🇭🇰', 'Sri Lanka': '🇱🇰', 'Nepal': '🇳🇵', 'Pakistan': '🇵🇰',
  'Bangladesh': '🇧🇩', 'Myanmar': '🇲🇲', 'Cambodia': '🇰🇭', 'Laos': '🇱🇦',
  'Ecuador': '🇪🇨', 'Bolivia': '🇧🇴', 'Uruguay': '🇺🇾', 'Paraguay': '🇵🇾',
  'Costa Rica': '🇨🇷', 'Panama': '🇵🇦', 'Cuba': '🇨🇺', 'Jamaica': '🇯🇲',
  'Tunisia': '🇹🇳', 'Ghana': '🇬🇭', 'Ethiopia': '🇪🇹', 'Tanzania': '🇹🇿',
};

const CONTINENT_MAP: Record<string, string> = {
  'EU': 'Europe', 'AS': 'Asia', 'NA': 'North America', 'SA': 'South America',
  'AF': 'Africa', 'OC': 'Oceania', 'AN': 'Antarctica',
};

function getRegionFromContinent(continentCode: string): string {
  return CONTINENT_MAP[continentCode] || 'Other';
}

const WeatherQuickSearch: React.FC<WeatherQuickSearchProps> = ({ onSelectCity, currentCity }) => {
  const [query, setQuery] = useState('');
  const [apiResults, setApiResults] = useState<WeatherCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Local results from static data (instant)
  const localResults = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return TOP_WEATHER_CITIES.filter(
      c =>
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  // Search via geocoding API for cities not in static list
  const searchGlobal = useCallback(async (q: string) => {
    if (q.length < 3) {
      setApiResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=10&language=en&format=json`
      );
      const data = await res.json();
      if (data.results) {
        const mapped: WeatherCity[] = data.results
          .filter((r: any) => r.name && r.country)
          .map((r: any) => ({
            city: r.name,
            country: r.country,
            region: getRegionFromContinent(r.country_code ? getContinent(r.latitude, r.longitude, r.country_code) : 'Other'),
            lat: r.latitude,
            lon: r.longitude,
            emoji: COUNTRY_EMOJI[r.country] || '🌍',
          }));
        // Filter out cities already in local results
        const localCityNames = new Set(localResults.map(c => `${c.city}-${c.country}`.toLowerCase()));
        setApiResults(mapped.filter(c => !localCityNames.has(`${c.city}-${c.country}`.toLowerCase())).slice(0, 6));
      } else {
        setApiResults([]);
      }
    } catch {
      setApiResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [localResults]);

  // Debounced API search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length >= 3) {
      debounceRef.current = setTimeout(() => searchGlobal(query), 400);
    } else {
      setApiResults([]);
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, searchGlobal]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allResults = [...localResults, ...apiResults];
  const hasResults = allResults.length > 0 || isSearching;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          placeholder="Search any city, country, or continent..."
          className="pl-10 h-12 text-base"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {showDropdown && query.length >= 2 && hasResults && (
        <div className="absolute z-30 w-full mt-1 bg-popover border rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {/* Local results */}
          {localResults.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/30 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Top Cities
              </div>
              {localResults.map(city => (
                <CityRow
                  key={`local-${city.city}-${city.country}`}
                  city={city}
                  currentCity={currentCity}
                  onSelect={() => {
                    onSelectCity(city);
                    setQuery('');
                    setShowDropdown(false);
                  }}
                />
              ))}
            </>
          )}

          {/* API results */}
          {apiResults.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/30 flex items-center gap-1">
                <Globe className="h-3 w-3" /> Global Results
              </div>
              {apiResults.map(city => (
                <CityRow
                  key={`api-${city.city}-${city.country}-${city.lat}`}
                  city={city}
                  currentCity={currentCity}
                  onSelect={() => {
                    onSelectCity(city);
                    setQuery('');
                    setShowDropdown(false);
                  }}
                />
              ))}
            </>
          )}

          {/* Loading state */}
          {isSearching && allResults.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 mx-auto mb-2 animate-spin" />
              Searching worldwide...
            </div>
          )}

          {/* No results */}
          {!isSearching && query.length >= 3 && allResults.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No cities found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper row component
const CityRow: React.FC<{
  city: WeatherCity;
  currentCity?: string;
  onSelect: () => void;
}> = ({ city, currentCity, onSelect }) => (
  <button
    className="w-full text-left px-4 py-3 hover:bg-accent/50 flex items-center justify-between transition-colors"
    onClick={onSelect}
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
);

// Simple continent guesser based on lat/lon and country code
function getContinent(lat: number, lon: number, countryCode: string): string {
  const euroCountries = new Set(['FI','SE','NO','DK','DE','FR','ES','IT','PT','NL','BE','AT','CH','CZ','PL','HU','RO','BG','HR','SK','SI','RS','BA','ME','AL','MK','GR','IE','GB','IS','EE','LV','LT','UA','BY','MD','LU','MT','CY','LI','AD','MC','SM','VA']);
  const naCountries = new Set(['US','CA','MX','GT','BZ','SV','HN','NI','CR','PA','CU','JM','HT','DO','TT','BS','BB','AG','DM','GD','KN','LC','VC']);
  const saCountries = new Set(['BR','AR','CL','CO','PE','EC','VE','BO','PY','UY','GY','SR']);
  const afCountries = new Set(['EG','ZA','NG','KE','GH','TZ','ET','MA','TN','DZ','SN','CI','CM','UG','MZ']);
  const ocCountries = new Set(['AU','NZ','FJ','PG','WS','TO','VU','SB']);

  if (euroCountries.has(countryCode)) return 'EU';
  if (naCountries.has(countryCode)) return 'NA';
  if (saCountries.has(countryCode)) return 'SA';
  if (afCountries.has(countryCode)) return 'AF';
  if (ocCountries.has(countryCode)) return 'OC';
  return 'AS';
}

export default WeatherQuickSearch;
