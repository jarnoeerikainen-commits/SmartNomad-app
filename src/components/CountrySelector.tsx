import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Globe2, MapPin } from 'lucide-react';
import { ALL_COUNTRIES } from '@/data/countries';
import { Country } from '@/types/country';

interface CountrySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (countryCode: string, countryName: string, countryFlag: string) => void;
  existingCountries: Country[];
  maxCountries?: number;
}

const REGIONS = [
  { name: 'All', value: 'all' },
  { name: 'Europe', value: 'EU', emoji: '🇪🇺' },
  { name: 'Asia', value: 'AS', emoji: '🌏' },
  { name: 'Americas', value: 'AM', emoji: '🌎' },
  { name: 'Africa', value: 'AF', emoji: '🌍' },
  { name: 'Oceania', value: 'OC', emoji: '🌊' },
];

// Region mapping for countries
const COUNTRY_REGIONS: Record<string, string> = {
  // Europe
  'AT': 'EU', 'BE': 'EU', 'BG': 'EU', 'HR': 'EU', 'CY': 'EU', 'CZ': 'EU', 'DK': 'EU', 'EE': 'EU',
  'FI': 'EU', 'FR': 'EU', 'DE': 'EU', 'GR': 'EU', 'HU': 'EU', 'IE': 'EU', 'IT': 'EU', 'LV': 'EU',
  'LT': 'EU', 'LU': 'EU', 'MT': 'EU', 'NL': 'EU', 'PL': 'EU', 'PT': 'EU', 'RO': 'EU', 'SK': 'EU',
  'SI': 'EU', 'ES': 'EU', 'SE': 'EU', 'GB': 'EU', 'NO': 'EU', 'CH': 'EU', 'IS': 'EU', 'AL': 'EU',
  'BA': 'EU', 'BY': 'EU', 'ME': 'EU', 'MK': 'EU', 'RS': 'EU', 'UA': 'EU', 'MD': 'EU', 'RU': 'EU',
  
  // Asia
  'CN': 'AS', 'JP': 'AS', 'KR': 'AS', 'IN': 'AS', 'ID': 'AS', 'TH': 'AS', 'MY': 'AS', 'SG': 'AS',
  'PH': 'AS', 'VN': 'AS', 'BD': 'AS', 'PK': 'AS', 'KZ': 'AS', 'UZ': 'AS', 'AF': 'AS', 'IQ': 'AS',
  'IR': 'AS', 'SA': 'AS', 'AE': 'AS', 'IL': 'AS', 'JO': 'AS', 'LB': 'AS', 'SY': 'AS', 'TR': 'AS',
  'MM': 'AS', 'KH': 'AS', 'LA': 'AS', 'NP': 'AS', 'LK': 'AS', 'MN': 'AS', 'KW': 'AS', 'OM': 'AS',
  'QA': 'AS', 'BH': 'AS', 'GE': 'AS', 'AM': 'AS', 'AZ': 'AS', 'HK': 'AS', 'TW': 'AS', 'MO': 'AS',
  
  // Americas
  'US': 'AM', 'CA': 'AM', 'MX': 'AM', 'BR': 'AM', 'AR': 'AM', 'CL': 'AM', 'CO': 'AM', 'PE': 'AM',
  'VE': 'AM', 'EC': 'AM', 'BO': 'AM', 'PY': 'AM', 'UY': 'AM', 'CR': 'AM', 'PA': 'AM', 'GT': 'AM',
  'CU': 'AM', 'DO': 'AM', 'HN': 'AM', 'NI': 'AM', 'SV': 'AM', 'JM': 'AM', 'TT': 'AM', 'BS': 'AM',
  'BB': 'AM', 'GY': 'AM', 'SR': 'AM', 'BZ': 'AM', 'HT': 'AM', 'PR': 'AM',
  
  // Africa
  'ZA': 'AF', 'EG': 'AF', 'NG': 'AF', 'KE': 'AF', 'ET': 'AF', 'GH': 'AF', 'TZ': 'AF', 'UG': 'AF',
  'MA': 'AF', 'DZ': 'AF', 'SD': 'AF', 'AO': 'AF', 'MZ': 'AF', 'CI': 'AF', 'CM': 'AF', 'NE': 'AF',
  'BF': 'AF', 'ML': 'AF', 'MW': 'AF', 'ZM': 'AF', 'SN': 'AF', 'SO': 'AF', 'TD': 'AF', 'ZW': 'AF',
  'GN': 'AF', 'RW': 'AF', 'BJ': 'AF', 'TN': 'AF', 'BI': 'AF', 'SS': 'AF', 'LY': 'AF', 'TG': 'AF',
  
  // Oceania
  'AU': 'OC', 'NZ': 'OC', 'PG': 'OC', 'FJ': 'OC', 'SB': 'OC', 'NC': 'OC', 'PF': 'OC', 'WS': 'OC',
  'GU': 'OC', 'KI': 'OC', 'FM': 'OC', 'TO': 'OC', 'PW': 'OC', 'MH': 'OC', 'VU': 'OC', 'NR': 'OC',
};

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  existingCountries,
  maxCountries = 10,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Filter available countries
  const availableCountries = useMemo(() => {
    const existingCodes = existingCountries.map(c => c.code);
    return ALL_COUNTRIES.filter(country => !existingCodes.includes(country.code));
  }, [existingCountries]);

  // Apply filters
  const filteredCountries = useMemo(() => {
    let filtered = availableCountries;

    // Region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(country => COUNTRY_REGIONS[country.code] === selectedRegion);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(country =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [availableCountries, selectedRegion, searchQuery]);

  const handleSelect = (country: typeof ALL_COUNTRIES[0]) => {
    onSelect(country.code, country.name, country.flag);
    setSearchQuery('');
    setSelectedRegion('all');
    onClose();
  };

  const availableSlots = maxCountries - existingCountries.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Globe2 className="h-6 w-6 text-primary" />
                Select Country
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {availableCountries.length} countries available • {availableSlots} slots remaining
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Region Filters */}
        <div className="px-6 pb-4">
          <div className="flex gap-2 flex-wrap">
            {REGIONS.map(region => (
              <Button
                key={region.value}
                variant={selectedRegion === region.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region.value)}
                className="text-xs"
              >
                {region.emoji && <span className="mr-1">{region.emoji}</span>}
                {region.name}
                {region.value !== 'all' && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {availableCountries.filter(c => COUNTRY_REGIONS[c.code] === region.value).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Command */}
        <Command className="border-t">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
            <CommandInput
              placeholder="Type country name or code (e.g., Portugal or PT)..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="pl-10"
            />
          </div>
          
          <CommandList>
            <ScrollArea className="h-[400px]">
              <CommandEmpty className="py-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No countries found</p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              
              <CommandGroup>
                {filteredCountries.map((country) => {
                  const region = COUNTRY_REGIONS[country.code];
                  const regionName = REGIONS.find(r => r.value === region)?.name || 'Other';
                  
                  return (
                    <CommandItem
                      key={country.code}
                      onSelect={() => handleSelect(country)}
                      className="cursor-pointer py-3 px-4 hover:bg-accent"
                    >
                      <div className="flex items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl flex-shrink-0">{country.flag}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{country.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <span>{country.code}</span>
                              <span>•</span>
                              <span>{regionName}</span>
                              <span>•</span>
                              <span>Tax: {country.taxResidencyDays} days</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0 text-xs">
                          Add
                        </Badge>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {filteredCountries.length} of {availableCountries.length} countries</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
