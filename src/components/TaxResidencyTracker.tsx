import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, MapPin, Flag, Globe, Check, ChevronsUpDown, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import USTaxStateTracker from './USTaxStateTracker';
import USTaxTracker from './USTaxTracker';
import { CanadaTaxProvinceTracker } from './CanadaTaxProvinceTracker';
import CountryTracker from './CountryTracker';
import TaxResidencyVisualDashboard from './TaxResidencyVisualDashboard';
import { SubstantialPresenceTest } from './SubstantialPresenceTest';
import { ScenarioPlanner } from './ScenarioPlanner';
import { ThresholdAlerts } from './ThresholdAlerts';
import { YearComparisonView } from './YearComparisonView';
import { CountryManagementGrid } from './CountryManagementGrid';
import { Country } from '@/types/country';
import { useLanguage } from '@/contexts/LanguageContext';
import { ALL_COUNTRIES } from '@/data/countries';

interface TaxResidencyTrackerProps {
  countries: Country[];
  onAddCountry: (country: Country) => void;
  onRemoveCountry: (countryCode: string) => void;
  onUpdateCountrySettings: (countryId: string, settings: {
    countingMode: 'days' | 'nights';
    partialDayRule: 'full' | 'half' | 'exclude';
    countArrivalDay: boolean;
    countDepartureDay: boolean;
  }) => void;
  onUpdateCountryLimit: (countryId: string, newLimit: number) => void;
  onResetCountry: (countryId: string) => void;
  onToggleCountDays: (countryId: string) => void;
}

const TaxResidencyTracker: React.FC<TaxResidencyTrackerProps> = ({ 
  countries, 
  onAddCountry, 
  onRemoveCountry, 
  onUpdateCountrySettings,
  onUpdateCountryLimit,
  onResetCountry,
  onToggleCountDays
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('global');
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  // Prepare all jurisdiction options
  const jurisdictionOptions = [
    { value: 'global', label: t('tax.global_overview') || 'Global Overview', flag: '🌍', group: 'special' },
    { value: 'overview', label: 'Tax Overview', flag: '📊', group: 'special' },
    { value: 'us', label: t('tax.united_states') || 'United States', flag: '🇺🇸', group: 'special' },
    { value: 'ca', label: t('tax.canada') || 'Canada', flag: '🇨🇦', group: 'special' },
    ...ALL_COUNTRIES.map(country => ({
      value: country.code.toLowerCase(),
      label: country.name,
      flag: country.flag,
      group: 'countries'
    }))
  ].sort((a, b) => {
    // Keep special items at top
    if (a.group === 'special' && b.group === 'special') return 0;
    if (a.group === 'special') return -1;
    if (b.group === 'special') return 1;
    // Sort countries alphabetically
    return a.label.localeCompare(b.label);
  });

  const selectedOption = jurisdictionOptions.find(opt => opt.value === selectedCountry);

  return (
    <div className="space-y-6">
      {/* Visual Dashboard - Featured at the top */}
      <TaxResidencyVisualDashboard countries={countries} />
      
      {/* Main Tax Residency Overview Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="w-6 h-6" />
            Tax Residency & Compliance Center
          </CardTitle>
          <p className="text-muted-foreground">
            Manage your countries, track tax residency days, and stay compliant with international tax regulations
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t('tax.select_jurisdiction')}</span>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[320px] justify-between"
                >
                  {selectedOption ? (
                    <div className="flex items-center gap-2">
                      <span>{selectedOption.flag}</span>
                      <span>{selectedOption.label}</span>
                    </div>
                  ) : (
                    t('tax.select_jurisdiction')
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0 bg-background border shadow-lg z-50">
                <Command>
                  <CommandInput placeholder="Search country..." className="h-9" />
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup heading="Quick Access">
                      {jurisdictionOptions
                        .filter(opt => opt.group === 'special')
                        .map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              setSelectedCountry(currentValue);
                              setOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span>{option.flag}</span>
                              <span>{option.label}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedCountry === option.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandGroup heading="All Countries">
                      {jurisdictionOptions
                        .filter(opt => opt.group === 'countries')
                        .map((option) => (
                          <CommandItem
                            key={option.value}
                            value={`${option.label} ${option.value}`}
                            onSelect={() => {
                              setSelectedCountry(option.value);
                              setOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span>{option.flag}</span>
                              <span>{option.label}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedCountry === option.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Tabs value={selectedCountry} onValueChange={setSelectedCountry}>
            <TabsList className="grid w-full grid-cols-7 h-auto flex-wrap">
              <TabsTrigger value="global" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Countries</span>
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="scenario" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Planner</span>
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
              </TabsTrigger>
              <TabsTrigger value="us" className="flex items-center gap-2">
                <span>🇺🇸</span>
                <span className="hidden sm:inline">USA</span>
              </TabsTrigger>
              <TabsTrigger value="ca" className="flex items-center gap-2">
                <span>🇨🇦</span>
                <span className="hidden sm:inline">Canada</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="mt-6">
              <CountryTracker
                countries={countries}
                onAddCountry={onAddCountry}
                onRemoveCountry={onRemoveCountry}
              />
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <TaxResidencyVisualDashboard countries={countries} />
                <CountryManagementGrid
                  countries={countries}
                  onRemove={onRemoveCountry}
                  onUpdateLimit={onUpdateCountryLimit}
                  onReset={onResetCountry}
                  onToggleCountDays={onToggleCountDays}
                  onUpdateSettings={onUpdateCountrySettings}
                />
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="mt-6">
              <ThresholdAlerts countries={countries} />
            </TabsContent>

            <TabsContent value="scenario" className="mt-6">
              <ScenarioPlanner countries={countries} />
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <YearComparisonView countries={countries} />
            </TabsContent>

            <TabsContent value="us" className="mt-6 space-y-6">
              <SubstantialPresenceTest />
              <USTaxTracker countries={countries} />
              <USTaxStateTracker />
            </TabsContent>

            <TabsContent value="ca" className="mt-6">
              <CanadaTaxProvinceTracker countries={countries} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxResidencyTracker;