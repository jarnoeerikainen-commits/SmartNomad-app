import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  Globe, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  BarChart3,
  Scale,
  MapPin,
  Calendar,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TaxResidencyVisualDashboard from './TaxResidencyVisualDashboard';
import TaxResidencyReports from './TaxResidencyReports';
import CountryTracker from './CountryTracker';
import USTaxTracker from './USTaxTracker';
import { CanadaTaxProvinceTracker } from './CanadaTaxProvinceTracker';
import { SchengenCalculator } from './SchengenCalculator';
import { SubstantialPresenceTest } from './SubstantialPresenceTest';
import { ScenarioPlanner } from './ScenarioPlanner';
import { ThresholdAlerts } from './ThresholdAlerts';
import { YearComparisonView } from './YearComparisonView';
import { TrackingSettings } from './TrackingSettings';
import { Country, LocationData } from '@/types/country';
import { CountrySelector } from './CountrySelector';
import { ALL_COUNTRIES } from '@/data/countries';

interface TaxResidencyHubProps {
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
  currentLocation: LocationData | null;
}

// Default tracking settings
const DEFAULT_TRACKING_SETTINGS = {
  countingMode: 'days' as 'days' | 'nights',
  partialDayRule: 'full' as 'full' | 'half' | 'exclude',
  countArrivalDay: true,
  countDepartureDay: true
};

const TaxResidencyHub: React.FC<TaxResidencyHubProps> = ({
  countries,
  onAddCountry,
  onRemoveCountry,
  onUpdateCountrySettings,
  onUpdateCountryLimit,
  onResetCountry,
  onToggleCountDays,
  currentLocation
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trackingSettings, setTrackingSettings] = useState(DEFAULT_TRACKING_SETTINGS);
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  const { toast } = useToast();

  const handleCountrySelect = (countryCode: string, countryName: string, countryFlag: string) => {
    // Find the country in ALL_COUNTRIES to get the tax residency days
    const countryInfo = ALL_COUNTRIES.find(c => c.code === countryCode);
    
    const newCountry: Country = {
      id: `${countryCode}-${Date.now()}`,
      code: countryCode,
      name: countryName,
      flag: countryFlag,
      dayLimit: countryInfo?.taxResidencyDays || 183,
      daysSpent: 0,
      reason: 'Tax Residency Tracking',
      lastUpdate: new Date().toISOString(),
      countTravelDays: true,
      yearlyDaysSpent: 0,
      lastEntry: null,
      totalEntries: 0,
      followEmbassyNews: false,
      countingMode: 'days',
      partialDayRule: 'full',
      countDepartureDay: true,
      countArrivalDay: true
    };
    
    onAddCountry(newCountry);
    setIsCountrySelectorOpen(false);
    toast({
      title: "Country Added",
      description: `${countryName} has been added to your tax residency tracking.`,
    });
  };

  // Calculate summary stats
  const totalCountries = countries.filter(c => c.countTravelDays).length;
  const totalDaysTracked = countries.reduce((sum, c) => sum + c.daysSpent, 0);
  const countriesAtRisk = countries.filter(c => 
    c.countTravelDays && c.daysSpent > c.dayLimit * 0.8
  ).length;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <Card className="gradient-trust border-none text-primary-foreground">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Scale className="h-8 w-8" />
                Tax Residency Hub
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 text-base">
                Professional-grade tax residency management for digital nomads
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Premium Feature
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <MapPin className="h-5 w-5 text-primary-foreground/70" />
                <span className="text-2xl font-bold">{totalCountries}</span>
              </div>
              <p className="text-sm text-primary-foreground/80">Countries Tracked</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-5 w-5 text-primary-foreground/70" />
                <span className="text-2xl font-bold">{totalDaysTracked}</span>
              </div>
              <p className="text-sm text-primary-foreground/80">Total Days Tracked</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-5 w-5 text-primary-foreground/70" />
                <span className="text-2xl font-bold">{countriesAtRisk}</span>
              </div>
              <p className="text-sm text-primary-foreground/80">At Risk Countries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-2 h-auto">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="tracker" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Day Tracker</span>
          </TabsTrigger>
          <TabsTrigger value="calculators" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculators</span>
          </TabsTrigger>
          <TabsTrigger value="scenario" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Scenarios</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Compare</span>
          </TabsTrigger>
        </TabsList>

        {/* Day Counting Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <TrackingSettings
            countingMode={trackingSettings.countingMode}
            onCountingModeChange={(mode) => setTrackingSettings({ ...trackingSettings, countingMode: mode })}
            partialDayRule={trackingSettings.partialDayRule}
            onPartialDayRuleChange={(rule) => setTrackingSettings({ ...trackingSettings, partialDayRule: rule })}
            countDepartureDay={trackingSettings.countDepartureDay}
            onCountDepartureDayChange={(value) => setTrackingSettings({ ...trackingSettings, countDepartureDay: value })}
            countArrivalDay={trackingSettings.countArrivalDay}
            onCountArrivalDayChange={(value) => setTrackingSettings({ ...trackingSettings, countArrivalDay: value })}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>How Your Settings Affect Calculations</CardTitle>
              <CardDescription>
                Understanding how different counting methods impact tax residency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Current Configuration:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Counting Method: <strong>{trackingSettings.countingMode === 'days' ? 'Days' : 'Nights'}</strong></li>
                  <li>• Partial Days: <strong>{
                    trackingSettings.partialDayRule === 'full' ? 'Count as full day' :
                    trackingSettings.partialDayRule === 'half' ? 'Count as half day' :
                    'Exclude partial days'
                  }</strong></li>
                  <li>• Arrival Day: <strong>{trackingSettings.countArrivalDay ? 'Counted' : 'Not counted'}</strong></li>
                  <li>• Departure Day: <strong>{trackingSettings.countDepartureDay ? 'Counted' : 'Not counted'}</strong></li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Example Scenario:</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  You arrive in Country A on Jan 15th at 11 PM and depart on Jan 17th at 2 AM.
                </p>
                <div className="text-sm">
                  <strong>With current settings, this counts as:</strong>
                  <div className="mt-2 p-3 bg-primary/10 rounded">
                    {(() => {
                      let days = 1; // Full day (Jan 16)
                      if (trackingSettings.countArrivalDay) {
                        days += trackingSettings.partialDayRule === 'full' ? 1 : trackingSettings.partialDayRule === 'half' ? 0.5 : 0;
                      }
                      if (trackingSettings.countDepartureDay) {
                        days += trackingSettings.partialDayRule === 'full' ? 1 : trackingSettings.partialDayRule === 'half' ? 0.5 : 0;
                      }
                      return `${days} ${trackingSettings.countingMode}`;
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Add Country CTA */}
          {countries.length === 0 && (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="rounded-full bg-primary/10 p-6">
                  <MapPin className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-semibold">Start Tracking Your Tax Residency</h3>
                  <p className="text-muted-foreground max-w-md">
                    Add countries to begin monitoring your days spent and stay compliant with international tax obligations.
                  </p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => setIsCountrySelectorOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Your First Country
                </Button>
              </CardContent>
            </Card>
          )}

          {countries.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Tax Residency Overview</h3>
                  <p className="text-sm text-muted-foreground">Monitor your status across all tracked countries</p>
                </div>
                <Button 
                  onClick={() => setIsCountrySelectorOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Country
                </Button>
              </div>

              <TaxResidencyVisualDashboard 
                countries={countries.filter(c => c.countTravelDays)} 
              />
            </>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Overview</CardTitle>
              <CardDescription>
                Track your tax residency status across multiple jurisdictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The Tax Residency Hub provides comprehensive tools to manage your tax obligations
                  as a digital nomad. Track days spent in multiple countries, calculate substantial
                  presence tests, and get proactive alerts about compliance thresholds.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-accent/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Advanced Calculators
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      US Substantial Presence Test, Canada Provincial Tax Calculator, 
                      and Schengen 90/180 rule calculator
                    </p>
                  </div>
                  <div className="p-4 bg-accent/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Proactive Alerts
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Get warned when approaching tax residency thresholds with 
                      30-day advance notices
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Day Tracker Tab */}
        <TabsContent value="tracker" className="space-y-6">
          <CountryTracker
            countries={countries}
            onAddCountry={onAddCountry}
            onRemoveCountry={onRemoveCountry}
          />
        </TabsContent>

        {/* Calculators Tab */}
        <TabsContent value="calculators" className="space-y-6">
          <Tabs defaultValue="us" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4">
              <TabsTrigger value="us">US Tax</TabsTrigger>
              <TabsTrigger value="canada">Canada Tax</TabsTrigger>
              <TabsTrigger value="schengen">Schengen</TabsTrigger>
              <TabsTrigger value="substantial">Substantial Presence</TabsTrigger>
            </TabsList>

            <TabsContent value="us">
              <USTaxTracker countries={countries} />
            </TabsContent>

            <TabsContent value="canada">
              <CanadaTaxProvinceTracker countries={countries} />
            </TabsContent>

            <TabsContent value="schengen">
              <SchengenCalculator />
            </TabsContent>

            <TabsContent value="substantial">
              <SubstantialPresenceTest />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Scenario Planning Tab */}
        <TabsContent value="scenario" className="space-y-6">
          <ScenarioPlanner countries={countries} />
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <ThresholdAlerts countries={countries.filter(c => c.countTravelDays)} />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <TaxResidencyReports countries={countries} />
        </TabsContent>

        {/* Year Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <YearComparisonView countries={countries} />
        </TabsContent>
      </Tabs>

      {/* Country Selector Modal */}
      <CountrySelector
        isOpen={isCountrySelectorOpen}
        onClose={() => setIsCountrySelectorOpen(false)}
        onSelect={handleCountrySelect}
        existingCountries={countries}
        maxCountries={50}
      />
    </div>
  );
};

export default TaxResidencyHub;
