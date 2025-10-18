import { useState, useMemo } from "react";
import { ALL_COUNTRIES } from "@/data/countries";
import { getCitiesForCountry, getCountriesWithCities, CityData } from "@/data/cities";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartSearchMenuProps {
  selectedCountry: string | null;
  selectedCity: string | null;
  onCountryChange: (countryCode: string, countryName: string) => void;
  onCityChange: (cityName: string) => void;
  placeholder?: string;
}

export function SmartSearchMenu({
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
  placeholder = "Select location...",
}: SmartSearchMenuProps) {
  const [openCountry, setOpenCountry] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  // Get countries with active cities only
  const activeCountryCodes = useMemo(() => getCountriesWithCities(), []);

  // Alphabetically sorted countries with active cities
  const sortedCountries = useMemo(() => {
    return ALL_COUNTRIES
      .filter((country) => activeCountryCodes.includes(country.code))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activeCountryCodes]);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return sortedCountries;
    return sortedCountries.filter((country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [sortedCountries, countrySearch]);

  // Get cities for selected country (alphabetically sorted)
  const availableCities = useMemo(() => {
    if (!selectedCountry) return [];
    const cities = getCitiesForCountry(selectedCountry);
    return cities.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCountry]);

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    if (!citySearch) return availableCities;
    return availableCities.filter((city) =>
      city.name.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [availableCities, citySearch]);

  const selectedCountryName = ALL_COUNTRIES.find((c) => c.code === selectedCountry)?.name;

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      {/* Country Selection */}
      <Popover open={openCountry} onOpenChange={setOpenCountry}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCountry}
            className="flex-1 justify-between"
          >
            <div className="flex items-center gap-2">
              {selectedCountry ? (
                <>
                  <span className="text-2xl">{ALL_COUNTRIES.find((c) => c.code === selectedCountry)?.flag}</span>
                  <span>{selectedCountryName}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Select country</span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 bg-background" align="start">
          <Command>
            <CommandInput 
              placeholder="Search countries..." 
              value={countrySearch}
              onValueChange={setCountrySearch}
            />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {filteredCountries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.code}
                    onSelect={() => {
                      onCountryChange(country.code, country.name);
                      onCityChange(""); // Reset city when country changes
                      setOpenCountry(false);
                      setCountrySearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCountry === country.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="mr-2 text-xl">{country.flag}</span>
                    {country.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* City Selection */}
      <Popover open={openCity} onOpenChange={setOpenCity}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCity}
            disabled={!selectedCountry}
            className="flex-1 justify-between"
          >
            <div className="flex items-center gap-2">
              {selectedCity ? (
                <>
                  <MapPin className="h-4 w-4" />
                  <span>{selectedCity}</span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  {selectedCountry ? "Select city" : "Select country first"}
                </span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 bg-background" align="start">
          <Command>
            <CommandInput 
              placeholder="Search cities..." 
              value={citySearch}
              onValueChange={setCitySearch}
            />
            <CommandList>
              <CommandEmpty>
                {availableCities.length === 0 
                  ? "No cities available for this country yet."
                  : "No city found."}
              </CommandEmpty>
              <CommandGroup>
                {filteredCities.map((city) => (
                  <CommandItem
                    key={city.name}
                    value={city.name}
                    onSelect={() => {
                      onCityChange(city.name);
                      setOpenCity(false);
                      setCitySearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCity === city.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center justify-between w-full">
                      <span>{city.name}</span>
                      {city.active_services && (
                        <span className="text-xs text-muted-foreground">
                          {city.active_services} services
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
