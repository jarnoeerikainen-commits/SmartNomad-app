import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, Plus, Trash2, TrendingUp, AlertTriangle, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Country } from '@/types/country';

interface PlannedTrip {
  id: string;
  countryCode: string;
  countryName: string;
  days: number;
}

interface ScenarioPlannerProps {
  countries: Country[];
}

export const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({ countries }) => {
  const [plannedTrips, setPlannedTrips] = useState<PlannedTrip[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [plannedDays, setPlannedDays] = useState<number>(0);

  const addTrip = () => {
    if (!selectedCountry || plannedDays <= 0) return;

    const country = countries.find(c => c.code === selectedCountry);
    if (!country) return;

    const newTrip: PlannedTrip = {
      id: Date.now().toString(),
      countryCode: country.code,
      countryName: country.name,
      days: plannedDays
    };

    setPlannedTrips([...plannedTrips, newTrip]);
    setPlannedDays(0);
  };

  const removeTrip = (id: string) => {
    setPlannedTrips(plannedTrips.filter(t => t.id !== id));
  };

  const calculateScenario = () => {
    const results = countries.map(country => {
      const currentDays = country.yearlyDaysSpent || country.daysSpent;
      const plannedInCountry = plannedTrips
        .filter(t => t.countryCode === country.code)
        .reduce((sum, t) => sum + t.days, 0);
      
      const projectedTotal = currentDays + plannedInCountry;
      const threshold = 183;
      const daysOver = projectedTotal - threshold;
      
      return {
        country,
        currentDays,
        plannedDays: plannedInCountry,
        projectedTotal,
        threshold,
        daysOver,
        status: projectedTotal >= threshold ? 'danger' : projectedTotal >= 150 ? 'warning' : 'safe'
      };
    }).filter(r => r.currentDays > 0 || r.plannedDays > 0);

    return results;
  };

  const scenarios = calculateScenario();

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-600" />
          Scenario Planner
        </CardTitle>
        <CardDescription>
          Plan future trips and see the impact on your tax residency status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Add Trip Form */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Planned Trip
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Select Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose country..." />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Days to Stay</Label>
              <Input
                type="number"
                min="1"
                max="365"
                value={plannedDays || ''}
                onChange={(e) => setPlannedDays(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={addTrip} 
                className="w-full"
                disabled={!selectedCountry || plannedDays <= 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Trip
              </Button>
            </div>
          </div>

          {/* Planned Trips List */}
          {plannedTrips.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <h5 className="text-sm font-medium text-muted-foreground">Planned Trips:</h5>
              {plannedTrips.map(trip => (
                <div key={trip.id} className="flex items-center justify-between bg-background rounded p-2">
                  <span className="text-sm">
                    <strong>{trip.countryName}</strong> - {trip.days} days
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTrip(trip.id)}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scenario Results */}
        {scenarios.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Projected Impact
            </h4>
            
            <div className="space-y-3">
              {scenarios.map(scenario => (
                <Card 
                  key={scenario.country.code} 
                  className={`border-2 ${
                    scenario.status === 'danger' 
                      ? 'border-red-300 bg-red-50/50 dark:bg-red-950/10' 
                      : scenario.status === 'warning'
                      ? 'border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/10'
                      : 'border-green-300 bg-green-50/50 dark:bg-green-950/10'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{scenario.country.flag}</span>
                        <div>
                          <h5 className="font-semibold">{scenario.country.name}</h5>
                          <p className="text-xs text-muted-foreground">
                            {scenario.country.reason}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          scenario.status === 'danger' ? 'destructive' : 
                          scenario.status === 'warning' ? 'default' : 
                          'secondary'
                        }
                      >
                        {scenario.status === 'danger' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {scenario.status === 'safe' && <Check className="w-3 h-3 mr-1" />}
                        {scenario.status === 'danger' ? 'Tax Resident' : 
                         scenario.status === 'warning' ? 'Approaching Limit' : 
                         'Within Limit'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-background/60 rounded p-2">
                        <div className="text-xs text-muted-foreground">Current</div>
                        <div className="text-lg font-bold">{scenario.currentDays}</div>
                        <div className="text-xs">days</div>
                      </div>
                      <div className="bg-background/60 rounded p-2">
                        <div className="text-xs text-muted-foreground">Planned</div>
                        <div className="text-lg font-bold text-blue-600">+{scenario.plannedDays}</div>
                        <div className="text-xs">days</div>
                      </div>
                      <div className="bg-background/60 rounded p-2">
                        <div className="text-xs text-muted-foreground">Projected</div>
                        <div className={`text-lg font-bold ${
                          scenario.status === 'danger' ? 'text-red-600' :
                          scenario.status === 'warning' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {scenario.projectedTotal}
                        </div>
                        <div className="text-xs">days</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress to {scenario.threshold} days</span>
                        <span className="font-medium">
                          {scenario.daysOver > 0 
                            ? `${scenario.daysOver} over` 
                            : `${scenario.threshold - scenario.projectedTotal} remaining`}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            scenario.status === 'danger' ? 'bg-red-500' :
                            scenario.status === 'warning' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((scenario.projectedTotal / scenario.threshold) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Warning Message */}
                    {scenario.status === 'danger' && (
                      <Alert className="mt-3 bg-red-100 dark:bg-red-950/20 border-red-300">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-xs">
                          <strong>Warning:</strong> This scenario would make you a tax resident. 
                          Consider reducing your stay by at least {scenario.daysOver + 1} days.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              Add planned trips above to see how they would affect your tax residency status in each country.
            </AlertDescription>
          </Alert>
        )}

        {/* Tips */}
        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-xs space-y-1">
            <p><strong>Pro Tips:</strong></p>
            <p>• Plan multiple trips to see combined impact</p>
            <p>• Stay at least 33 days under the 183-day threshold as a safety buffer</p>
            <p>• Remember that partial days often count as full days</p>
            <p>• Consider visa-free limits in addition to tax residency rules</p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};