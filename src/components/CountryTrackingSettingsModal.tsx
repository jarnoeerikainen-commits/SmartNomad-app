import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings2, Sun, Moon, Info, CheckCircle } from 'lucide-react';
import { Country } from '@/types/country';

interface CountryTrackingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: Country;
  onSave: (settings: {
    countingMode: 'days' | 'nights';
    partialDayRule: 'full' | 'half' | 'exclude';
    countArrivalDay: boolean;
    countDepartureDay: boolean;
  }) => void;
}

export const CountryTrackingSettingsModal: React.FC<CountryTrackingSettingsModalProps> = ({
  isOpen,
  onClose,
  country,
  onSave,
}) => {
  const [countingMode, setCountingMode] = useState<'days' | 'nights'>(
    country.countingMode || 'days'
  );
  const [partialDayRule, setPartialDayRule] = useState<'full' | 'half' | 'exclude'>(
    country.partialDayRule || 'full'
  );
  const [countArrivalDay, setCountArrivalDay] = useState(
    country.countArrivalDay !== undefined ? country.countArrivalDay : true
  );
  const [countDepartureDay, setCountDepartureDay] = useState(
    country.countDepartureDay !== undefined ? country.countDepartureDay : true
  );

  const handleSave = () => {
    onSave({
      countingMode,
      partialDayRule,
      countArrivalDay,
      countDepartureDay,
    });
    onClose();
  };

  const handleReset = () => {
    setCountingMode('days');
    setPartialDayRule('full');
    setCountArrivalDay(true);
    setCountDepartureDay(true);
  };

  // Get country-specific recommendations
  const getCountryRecommendation = () => {
    const countryCode = country.code.toUpperCase();
    
    if (countryCode === 'US') {
      return {
        title: 'US Substantial Presence Test',
        description: 'The IRS counts both arrival and departure days. Use days method with full day counting.',
        recommended: { countingMode: 'days' as const, partialDayRule: 'full' as const, countArrivalDay: true, countDepartureDay: true },
      };
    } else if (['DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'CH'].includes(countryCode)) {
      return {
        title: 'European Tax Residence',
        description: 'Most EU countries use midnight-to-midnight rule. Arrival day typically counts if you spend the night.',
        recommended: { countingMode: 'nights' as const, partialDayRule: 'exclude' as const, countArrivalDay: false, countDepartureDay: false },
      };
    } else if (countryCode === 'GB') {
      return {
        title: 'UK Statutory Residence Test',
        description: 'UK uses midnight rule. A day counts if you are present at midnight.',
        recommended: { countingMode: 'nights' as const, partialDayRule: 'exclude' as const, countArrivalDay: false, countDepartureDay: false },
      };
    } else if (countryCode === 'CA') {
      return {
        title: 'Canada Residence Rules',
        description: 'CRA counts days physically present, typically full days including arrival/departure.',
        recommended: { countingMode: 'days' as const, partialDayRule: 'full' as const, countArrivalDay: true, countDepartureDay: true },
      };
    } else if (countryCode === 'AU') {
      return {
        title: 'Australia Residence Test',
        description: 'ATO uses physical presence test. Part of a day generally counts as a full day.',
        recommended: { countingMode: 'days' as const, partialDayRule: 'full' as const, countArrivalDay: true, countDepartureDay: true },
      };
    }
    
    return null;
  };

  const recommendation = getCountryRecommendation();

  const applyRecommendation = () => {
    if (recommendation) {
      setCountingMode(recommendation.recommended.countingMode);
      setPartialDayRule(recommendation.recommended.partialDayRule);
      setCountArrivalDay(recommendation.recommended.countArrivalDay);
      setCountDepartureDay(recommendation.recommended.countDepartureDay);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Day Counting Rules for {country.flag} {country.name}
          </DialogTitle>
          <DialogDescription>
            Configure how days are calculated for tax and visa compliance. These settings affect how your time is counted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Country-specific recommendation */}
          {recommendation && (
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold text-blue-900">{recommendation.title}</p>
                  <p className="text-sm text-blue-800">{recommendation.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={applyRecommendation}
                    className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply Recommended Settings
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Counting Method */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Counting Method</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Choose between counting days or nights
              </p>
            </div>

            <RadioGroup value={countingMode} onValueChange={(value) => setCountingMode(value as 'days' | 'nights')}>
              <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="days" id="days-mode" className="mt-1" />
                <Label htmlFor="days-mode" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-orange-500" />
                    <span className="font-medium text-base">Days Method (Calendar Days)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Counts any calendar day you're present in the country. Most common for US tax purposes, visa limits, and general travel tracking.
                  </p>
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <div>✓ Used by: US (Substantial Presence Test), Canada, Australia</div>
                    <div>✓ Best for: Tourist visas, work permits, general tracking</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="nights" id="nights-mode" className="mt-1" />
                <Label htmlFor="nights-mode" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-base">Nights Method (Midnight Rule)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Only counts days where you're present at midnight. Common in European tax systems.
                  </p>
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <div>✓ Used by: UK, Germany, France, most EU countries</div>
                    <div>✓ Best for: European tax residence, Schengen stays</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Partial Day Rules */}
          <div className="space-y-4 border-t pt-6">
            <div>
              <Label className="text-base font-semibold">Partial Day Calculation</Label>
              <p className="text-sm text-muted-foreground mt-1">
                How to count arrival and departure days
              </p>
            </div>

            <RadioGroup value={partialDayRule} onValueChange={(value) => setPartialDayRule(value as any)}>
              <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="full" id="full-rule" className="mt-1" />
                <Label htmlFor="full-rule" className="flex-1 cursor-pointer">
                  <span className="font-medium">Count as Full Day</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Any part of a day counts as a full day. Conservative approach that prevents accidental overstay.
                  </p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="half" id="half-rule" className="mt-1" />
                <Label htmlFor="half-rule" className="flex-1 cursor-pointer">
                  <span className="font-medium">Count as Half Day (0.5)</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Arrival/departure days count as 0.5 days each. Some jurisdictions allow this for international travel.
                  </p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="exclude" id="exclude-rule" className="mt-1" />
                <Label htmlFor="exclude-rule" className="flex-1 cursor-pointer">
                  <span className="font-medium">Exclude Partial Days</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Only count full 24-hour periods. Arrival and departure days don't count. Common with midnight rules.
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Specific Day Toggles */}
          <div className="space-y-4 border-t pt-6">
            <Label className="text-base font-semibold">Specific Day Rules</Label>

            <div className="space-y-3">
              <div className="flex items-start justify-between p-4 rounded-lg border">
                <div className="flex-1 pr-4">
                  <div className="font-medium">Count Arrival Day</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Include the day you enter the country. Generally recommended for conservative tracking.
                  </p>
                </div>
                <Switch
                  checked={countArrivalDay}
                  onCheckedChange={setCountArrivalDay}
                />
              </div>

              <div className="flex items-start justify-between p-4 rounded-lg border">
                <div className="flex-1 pr-4">
                  <div className="font-medium">Count Departure Day</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Include the day you leave the country. Required for some jurisdictions like the US.
                  </p>
                </div>
                <Switch
                  checked={countDepartureDay}
                  onCheckedChange={setCountDepartureDay}
                />
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Important:</strong> These settings directly impact your day calculations. Different countries have different rules:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>US: Counts both arrival and departure days (any part of day = full day)</li>
                <li>UK/EU: Generally uses midnight rule (presence at midnight = 1 day)</li>
                <li>Schengen: Calendar days for 90/180 rule</li>
              </ul>
              <p className="mt-2 font-semibold">Always verify the specific requirements for your situation with official sources.</p>
            </AlertDescription>
          </Alert>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            Reset to Defaults
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
