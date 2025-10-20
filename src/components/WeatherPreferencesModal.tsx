import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Thermometer, Bell, RefreshCw, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Preferences {
  units: 'celsius' | 'fahrenheit';
  notifications: boolean;
  autoUpdate: boolean;
}

interface WeatherPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: Preferences;
  onSave: (preferences: Preferences) => void;
}

const WeatherPreferencesModal: React.FC<WeatherPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave,
}) => {
  const [localPreferences, setLocalPreferences] = useState<Preferences>(preferences);

  const handleSave = () => {
    onSave(localPreferences);
    onClose();
  };

  const handleReset = () => {
    setLocalPreferences({
      units: 'celsius',
      notifications: true,
      autoUpdate: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Thermometer className="h-6 w-6 text-primary" />
            Weather Preferences
          </DialogTitle>
          <DialogDescription>
            Customize your weather tracking experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Temperature Units */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-primary" />
              Temperature Units
            </Label>
            <RadioGroup
              value={localPreferences.units}
              onValueChange={(value) =>
                setLocalPreferences({
                  ...localPreferences,
                  units: value as 'celsius' | 'fahrenheit',
                })
              }
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="celsius" id="celsius" />
                <Label
                  htmlFor="celsius"
                  className="flex-1 cursor-pointer font-normal"
                >
                  <div>
                    <p className="font-medium">Celsius (°C)</p>
                    <p className="text-sm text-muted-foreground">
                      Metric system - Used globally
                    </p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                <Label
                  htmlFor="fahrenheit"
                  className="flex-1 cursor-pointer font-normal"
                >
                  <div>
                    <p className="font-medium">Fahrenheit (°F)</p>
                    <p className="text-sm text-muted-foreground">
                      Imperial system - Used in US
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Notifications
            </Label>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="font-medium cursor-pointer">
                  Weather Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for severe weather warnings
                </p>
              </div>
              <Switch
                id="notifications"
                checked={localPreferences.notifications}
                onCheckedChange={(checked) =>
                  setLocalPreferences({
                    ...localPreferences,
                    notifications: checked,
                  })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Auto Update */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              Auto Update
            </Label>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="autoUpdate" className="font-medium cursor-pointer">
                  Automatic Refresh
                </Label>
                <p className="text-sm text-muted-foreground">
                  Update weather data every 30 minutes
                </p>
              </div>
              <Switch
                id="autoUpdate"
                checked={localPreferences.autoUpdate}
                onCheckedChange={(checked) =>
                  setLocalPreferences({
                    ...localPreferences,
                    autoUpdate: checked,
                  })
                }
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Weather data is updated
              automatically based on your preferences. Manual refresh is always available.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button onClick={handleSave} className="gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WeatherPreferencesModal;