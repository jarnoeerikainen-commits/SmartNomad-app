import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Globe2, MapPin, ExternalLink } from 'lucide-react';
import { ALL_COUNTRIES, REGION_INFO, getTaxSystemLabel, getTaxSystemColor } from '@/data/countries';
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
  { name: 'Middle East', value: 'ME', emoji: '🕌' },
  { name: 'Asia', value: 'AS', emoji: '🌏' },
  { name: 'Americas', value: 'AM', emoji: '🌎' },
  { name: 'Africa', value: 'AF', emoji: '🌍' },
  { name: 'Oceania', value: 'OC', emoji: '🏝️' },
  { name: 'No Tax', value: 'NOTAX', emoji: '💰' },
  { name: 'Digital Nomad', value: 'DNV', emoji: '💻' },
  { name: 'Golden Visa', value: 'GV', emoji: '🏆' },
];

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  existingCountries,
  maxCountries = 50,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const availableCountries = useMemo(() => {
    const existingCodes = existingCountries.map(c => c.code);
    return ALL_COUNTRIES.filter(country => !existingCodes.includes(country.code));
  }, [existingCountries]);

  const filteredCountries = useMemo(() => {
    let filtered = availableCountries;

    if (selectedRegion === 'NOTAX') {
      filtered = filtered.filter(c => c.taxSystem === 'no_income_tax');
    } else if (selectedRegion === 'DNV') {
      filtered = filtered.filter(c => c.digitalNomadVisa);
    } else if (selectedRegion === 'GV') {
      filtered = filtered.filter(c => c.goldenVisa || c.citizenshipByInvestment);
    } else if (selectedRegion !== 'all') {
      filtered = filtered.filter(country => country.region === selectedRegion);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(country =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        country.currency.toLowerCase().includes(query) ||
        country.taxAuthorityName.toLowerCase().includes(query)
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

  const getRegionCount = (value: string) => {
    if (value === 'NOTAX') return availableCountries.filter(c => c.taxSystem === 'no_income_tax').length;
    if (value === 'DNV') return availableCountries.filter(c => c.digitalNomadVisa).length;
    if (value === 'GV') return availableCountries.filter(c => c.goldenVisa || c.citizenshipByInvestment).length;
    return availableCountries.filter(c => c.region === value).length;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div>
            <DialogTitle className="text-3xl font-bold flex items-center gap-3 mb-2">
              <Globe2 className="h-8 w-8 text-primary" />
              Select Country to Track
            </DialogTitle>
            <p className="text-base text-muted-foreground">
              {availableCountries.length} countries with verified tax data • {availableSlots} slots remaining
            </p>
          </div>
        </DialogHeader>

        {/* Region & Smart Filters */}
        <div className="px-6 py-3 bg-muted/30 border-b">
          <div className="flex gap-1.5 flex-wrap">
            {REGIONS.map(region => (
              <Button
                key={region.value}
                variant={selectedRegion === region.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region.value)}
                className="text-xs h-8"
              >
                {region.emoji && <span className="mr-1">{region.emoji}</span>}
                {region.name}
                {region.value !== 'all' && (
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1 h-4">
                    {getRegionCount(region.value)}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        <Command className="border-none">
          <div className="border-b bg-background">
            <div className="relative px-6 py-3">
              <Search className="absolute left-10 top-6 h-4 w-4 text-muted-foreground" />
              <CommandInput
                placeholder="Search country, code, currency..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="pl-10 h-10 text-sm"
              />
            </div>
          </div>
          <CommandList>
            <ScrollArea className="h-[400px]">
              <CommandEmpty className="py-12 text-center">
                <MapPin className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="font-medium">No countries found</p>
                <p className="text-sm text-muted-foreground">Try a different search or filter</p>
              </CommandEmpty>
              <CommandGroup className="p-2">
                {filteredCountries.map((country) => {
                  const regionInfo = REGION_INFO[country.region];
                  const taxColor = getTaxSystemColor(country.taxSystem);
                  return (
                    <CommandItem
                      key={country.code}
                      onSelect={() => handleSelect(country)}
                      className="cursor-pointer py-3 px-3 hover:bg-accent rounded-lg mb-1 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl flex-shrink-0">{country.flag}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{country.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span className="font-mono">{country.code}</span>
                              <span>•</span>
                              <span>{regionInfo?.name}</span>
                              <span>•</span>
                              <span className="font-medium">{country.currency}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <Badge variant="outline" className={`text-[10px] px-1.5 h-4 ${taxColor}`}>
                                {getTaxSystemLabel(country.taxSystem)}
                              </Badge>
                              {country.incomeTaxRange.max > 0 ? (
                                <span className="text-[10px] text-muted-foreground">
                                  {country.incomeTaxRange.min}–{country.incomeTaxRange.max}% income
                                </span>
                              ) : (
                                <span className="text-[10px] text-emerald-600 font-medium">0% income tax</span>
                              )}
                              <span className="text-[10px] text-muted-foreground">• {country.taxResidencyDays}d residency</span>
                              {country.digitalNomadVisa && <Badge variant="secondary" className="text-[10px] px-1 h-4">💻 DN</Badge>}
                              {country.goldenVisa && <Badge variant="secondary" className="text-[10px] px-1 h-4">🏆 GV</Badge>}
                              {country.citizenshipByInvestment && <Badge variant="secondary" className="text-[10px] px-1 h-4">🛂 CBI</Badge>}
                              {country.schengenMember && <Badge variant="secondary" className="text-[10px] px-1 h-4">🇪🇺</Badge>}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-shrink-0 h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(country);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>

        <div className="px-6 py-3 border-t bg-muted/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {filteredCountries.length} of {availableCountries.length} countries
            </span>
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
