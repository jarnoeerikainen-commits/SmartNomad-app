import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Moon, Sun, Clock, Info } from 'lucide-react';

interface TrackingSettingsProps {
  countingMode: 'days' | 'nights';
  onCountingModeChange: (mode: 'days' | 'nights') => void;
  partialDayRule: 'full' | 'half' | 'exclude';
  onPartialDayRuleChange: (rule: 'full' | 'half' | 'exclude') => void;
  countDepartureDay: boolean;
  onCountDepartureDayChange: (value: boolean) => void;
  countArrivalDay: boolean;
  onCountArrivalDayChange: (value: boolean) => void;
}

export const TrackingSettings: React.FC<TrackingSettingsProps> = ({
  countingMode,
  onCountingModeChange,
  partialDayRule,
  onPartialDayRuleChange,
  countDepartureDay,
  onCountDepartureDayChange,
  countArrivalDay,
  onCountArrivalDayChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Day Counting Settings
        </CardTitle>
        <CardDescription>
          Customize how days are calculated for tax and visa compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Days vs Nights Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Counting Method</Label>
              <p className="text-sm text-muted-foreground">
                Choose between counting days or nights
              </p>
            </div>
          </div>

          <RadioGroup value={countingMode} onValueChange={(value) => onCountingModeChange(value as 'days' | 'nights')}>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="days" id="days" />
              <Label htmlFor="days" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span className="font-medium">Days Method</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Count calendar days (most common for tax purposes)
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="nights" id="nights" />
              <Label htmlFor="nights" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span className="font-medium">Nights Method</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Count nights spent (common for some visa rules)
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Partial Day Rules */}
        <div className="space-y-4 border-t pt-4">
          <div>
            <Label className="text-base font-semibold">Partial Day Calculation</Label>
            <p className="text-sm text-muted-foreground mt-1">
              How to count days when you arrive or depart
            </p>
          </div>

          <RadioGroup value={partialDayRule} onValueChange={(value) => onPartialDayRuleChange(value as any)}>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="full" id="full" />
              <Label htmlFor="full" className="flex-1 cursor-pointer">
                <span className="font-medium">Count as Full Day</span>
                <p className="text-sm text-muted-foreground">
                  Any part of a day counts as a full day
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="half" id="half" />
              <Label htmlFor="half" className="flex-1 cursor-pointer">
                <span className="font-medium">Count as Half Day</span>
                <p className="text-sm text-muted-foreground">
                  Arrival/departure days count as 0.5 days each
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="exclude" id="exclude" />
              <Label htmlFor="exclude" className="flex-1 cursor-pointer">
                <span className="font-medium">Exclude Partial Days</span>
                <p className="text-sm text-muted-foreground">
                  Only count full 24-hour periods
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Specific Day Toggles */}
        <div className="space-y-4 border-t pt-4">
          <Label className="text-base font-semibold">Specific Day Rules</Label>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex-1">
              <div className="font-medium">Count Arrival Day</div>
              <p className="text-sm text-muted-foreground">
                Include the day you arrive in the country
              </p>
            </div>
            <Switch
              checked={countArrivalDay}
              onCheckedChange={onCountArrivalDayChange}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex-1">
              <div className="font-medium">Count Departure Day</div>
              <p className="text-sm text-muted-foreground">
                Include the day you leave the country
              </p>
            </div>
            <Switch
              checked={countDepartureDay}
              onCheckedChange={onCountDepartureDayChange}
            />
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Important:</strong> Different countries have different rules for counting days. 
            For example, the US Substantial Presence Test counts both arrival and departure days, 
            while some European countries use the midnight-to-midnight rule. Always verify the 
            specific requirements for your situation.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
