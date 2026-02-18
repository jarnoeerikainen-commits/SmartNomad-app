
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { MapPin, Plus, X, Search, Building2, AlertTriangle, CheckCircle, Clock, TrendingUp, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Country } from '@/types/country';
import { useLanguage } from '@/contexts/LanguageContext';
import { CountrySelector } from './CountrySelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountryTrackerProps {
  countries: Country[];
  onAddCountry: (country: Country) => void;
  onRemoveCountry: (countryCode: string) => void;
}

// Risk level helper
const getRiskInfo = (country: Country) => {
  const pct = country.dayLimit > 0 ? (country.daysSpent / country.dayLimit) * 100 : 0;
  if (pct >= 100) return { level: 'danger' as const, label: 'Over Limit', color: 'text-destructive' };
  if (pct >= 80) return { level: 'warning' as const, label: 'At Risk', color: 'text-amber-600' };
  if (pct >= 50) return { level: 'caution' as const, label: 'Monitor', color: 'text-amber-500' };
  return { level: 'safe' as const, label: 'Safe', color: 'text-emerald-600' };
};

// Country card component with progress visualization
const TrackedCountryCard: React.FC<{
  country: Country;
  onRemove: (code: string) => void;
}> = ({ country, onRemove }) => {
  const risk = getRiskInfo(country);
  const pct = country.dayLimit > 0 ? Math.min((country.daysSpent / country.dayLimit) * 100, 100) : 0;
  const remaining = Math.max(country.dayLimit - country.daysSpent, 0);

  return (
    <Card className={`transition-all hover:shadow-md ${
      risk.level === 'danger' ? 'ring-2 ring-destructive/30' :
      risk.level === 'warning' ? 'ring-2 ring-amber-300/50' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{country.flag}</span>
            <div>
              <h4 className="font-semibold text-foreground">{country.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-xs">{country.reason}</Badge>
                {country.followEmbassyNews && (
                  <Badge variant="secondary" className="text-xs gap-0.5">
                    <Building2 className="w-2.5 h-2.5" />
                    Embassy
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onRemove(country.code)}
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {country.daysSpent} / {country.dayLimit} days
            </span>
            <span className={`font-medium flex items-center gap-1 ${risk.color}`}>
              {risk.level === 'danger' && <AlertTriangle className="w-3.5 h-3.5" />}
              {risk.level === 'warning' && <AlertTriangle className="w-3.5 h-3.5" />}
              {risk.level === 'safe' && <CheckCircle className="w-3.5 h-3.5" />}
              {risk.label}
            </span>
          </div>
          <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                pct >= 100 ? 'bg-destructive' :
                pct >= 80 ? 'bg-amber-500' :
                pct >= 50 ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{remaining > 0 ? `${remaining} days remaining` : 'Limit reached'}</span>
            <span>{Math.round(pct)}%</span>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{country.totalEntries} entries</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{country.yearlyDaysSpent} this year</span>
          </div>
          {country.lastEntry && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Last: {new Date(country.lastEntry).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CountryTracker: React.FC<CountryTrackerProps> = ({ 
  countries, 
  onAddCountry, 
  onRemoveCountry 
}) => {
  const { t } = useLanguage();
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [followEmbassyNews, setFollowEmbassyNews] = useState(true);
  const [selectedReason, setSelectedReason] = useState('Tourist visa limit');
  const [dayLimit, setDayLimit] = useState('90');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'days'>('risk');
  const { toast } = useToast();

  // Auto-update day limit when tracking reason changes
  React.useEffect(() => {
    if (selectedReason === 'Tax residence tracking') setDayLimit('183');
    else if (selectedReason === 'Schengen area limit') setDayLimit('90');
    else if (selectedReason === 'Tourist visa limit') setDayLimit('90');
    else if (selectedReason === 'Work permit limit') setDayLimit('365');
  }, [selectedReason]);

  const TRACKING_REASONS = [
    'Tourist visa limit',
    'Tax residence tracking',
    'Work permit limit',
    'Schengen area limit',
    'Business travel limit',
    'Student visa limit',
    'Digital nomad visa',
    'Custom tracking'
  ];

  // Filter and sort countries
  const filteredCountries = useMemo(() => {
    let result = [...countries];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.reason.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'risk':
        result.sort((a, b) => {
          const pctA = a.dayLimit > 0 ? a.daysSpent / a.dayLimit : 0;
          const pctB = b.dayLimit > 0 ? b.daysSpent / b.dayLimit : 0;
          return pctB - pctA;
        });
        break;
      case 'days':
        result.sort((a, b) => b.daysSpent - a.daysSpent);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [countries, searchQuery, sortBy]);

  const handleSelectCountry = (countryCode: string, countryName: string, countryFlag: string) => {
    let defaultDayLimit = parseInt(dayLimit) || 90;
    if (selectedReason === 'Tax residence tracking') defaultDayLimit = 183;
    else if (selectedReason === 'Schengen area limit') defaultDayLimit = 90;
    else if (selectedReason === 'Work permit limit') defaultDayLimit = 365;

    const fullCountry: Country = {
      id: `country-${countryCode}-${Date.now()}`,
      code: countryCode,
      name: countryName,
      flag: countryFlag,
      dayLimit: defaultDayLimit,
      daysSpent: 0,
      reason: selectedReason,
      lastUpdate: null,
      countTravelDays: true,
      yearlyDaysSpent: 0,
      lastEntry: null,
      totalEntries: 0,
      followEmbassyNews: followEmbassyNews,
      countingMode: 'days',
      partialDayRule: 'full',
      countArrivalDay: true,
      countDepartureDay: true,
    };
    
    onAddCountry(fullCountry);
    toast({
      title: "Country Added",
      description: `${countryName} added with ${defaultDayLimit}-day limit for ${selectedReason}`,
    });
  };

  // Summary stats
  const summaryStats = useMemo(() => {
    const atRisk = countries.filter(c => c.daysSpent >= c.dayLimit * 0.8).length;
    const totalDays = countries.reduce((s, c) => s + c.daysSpent, 0);
    return { atRisk, totalDays };
  }, [countries]);

  return (
    <>
      <CountrySelector
        isOpen={showCountrySelector}
        onClose={() => setShowCountrySelector(false)}
        onSelect={handleSelectCountry}
        existingCountries={countries}
        maxCountries={50}
      />
      
      <div className="space-y-4">
        {/* Header with search and filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Tracked Countries
                <Badge variant="secondary">{countries.length}</Badge>
              </CardTitle>
              {summaryStats.atRisk > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {summaryStats.atRisk} at risk
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Search and sort bar */}
            {countries.length > 0 && (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="w-3.5 h-3.5 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="risk">By Risk</SelectItem>
                    <SelectItem value="days">By Days</SelectItem>
                    <SelectItem value="name">By Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Country cards grid */}
            {filteredCountries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredCountries.map((country) => (
                  <TrackedCountryCard
                    key={country.id}
                    country={country}
                    onRemove={onRemoveCountry}
                  />
                ))}
              </div>
            ) : countries.length === 0 ? (
              <div className="text-center py-12">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Start tracking your countries</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                  Add countries you visit to track visa days, tax residency thresholds, and stay compliant.
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No countries match "{searchQuery}"</p>
              </div>
            )}

            {/* Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t">
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Tracking Reason</Label>
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRACKING_REASONS.map(reason => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Day Limit</Label>
                <Input
                  type="number"
                  value={dayLimit}
                  onChange={(e) => setDayLimit(e.target.value)}
                  placeholder="90"
                  min="1"
                  max="365"
                  className="h-9"
                />
              </div>
            </div>

            {/* Embassy toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <Label htmlFor="embassy-news" className="text-sm cursor-pointer">
                  Follow Embassy News
                </Label>
              </div>
              <Switch
                id="embassy-news"
                checked={followEmbassyNews}
                onCheckedChange={setFollowEmbassyNews}
              />
            </div>

            {/* Add button */}
            <Button
              onClick={() => setShowCountrySelector(true)}
              className="w-full"
              size="lg"
              disabled={countries.length >= 50}
            >
              <Plus className="w-4 h-4 mr-2" />
              {countries.length >= 50 ? 'Maximum Countries Reached (50)' : 'Add Country to Track'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CountryTracker;
