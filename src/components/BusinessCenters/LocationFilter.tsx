import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { MapPin, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import BusinessCentersService from '@/services/BusinessCentersService';

interface LocationFilterProps {
  selectedCountryCode: string;
  selectedCityId: string;
  onCountryChange: (countryCode: string) => void;
  onCityChange: (cityId: string) => void;
  onMyLocation: () => void;
}

export const LocationFilter = ({
  selectedCountryCode,
  selectedCityId,
  onCountryChange,
  onCityChange,
  onMyLocation,
}: LocationFilterProps) => {
  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const countries = useMemo(() => BusinessCentersService.getCountries(), []);
  
  const cities = useMemo(() => {
    if (!selectedCountryCode) return [];
    return BusinessCentersService.getCitiesByCountry(selectedCountryCode);
  }, [selectedCountryCode]);

  const selectedCountry = countries.find(c => c.code === selectedCountryCode);
  const selectedCity = cities.find(c => c.id === selectedCityId);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    return countries.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countries, countrySearch]);

  const filteredCities = useMemo(() => {
    if (!citySearch) return cities;
    return cities.filter(city =>
      city.name.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [cities, citySearch]);

  return (
    <div className="flex flex-wrap gap-3">
      {/* My Location Button */}
      <Button
        variant="outline"
        size="default"
        onClick={onMyLocation}
        className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <MapPin className="w-4 h-4" />
        Near Me
      </Button>

      {/* Country Selector */}
      <Popover open={countryOpen} onOpenChange={setCountryOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={countryOpen}
            className="w-[200px] justify-between"
          >
            {selectedCountry ? selectedCountry.name : 'Select country...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search country..." 
              value={countrySearch}
              onValueChange={setCountrySearch}
            />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {filteredCountries.map(country => (
                  <CommandItem
                    key={country.code}
                    value={country.name}
                    onSelect={() => {
                      onCountryChange(country.code);
                      onCityChange(''); // Reset city when country changes
                      setCountryOpen(false);
                      setCountrySearch('');
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedCountryCode === country.code ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {country.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* City Selector */}
      <Popover open={cityOpen} onOpenChange={setCityOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={cityOpen}
            className="w-[200px] justify-between"
            disabled={!selectedCountryCode}
          >
            {selectedCity ? selectedCity.name : 'Select city...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search city..." 
              value={citySearch}
              onValueChange={setCitySearch}
            />
            <CommandList>
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                {filteredCities.map(city => (
                  <CommandItem
                    key={city.id}
                    value={city.name}
                    onSelect={() => {
                      onCityChange(city.id);
                      setCityOpen(false);
                      setCitySearch('');
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedCityId === city.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {city.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Clear Filter Button */}
      {(selectedCountryCode || selectedCityId) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onCountryChange('');
            onCityChange('');
          }}
          className="text-muted-foreground"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};
