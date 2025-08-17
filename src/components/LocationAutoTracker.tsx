import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Play, 
  Pause, 
  Settings, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnhancedLocationService from '@/services/EnhancedLocationService';
import { LocationData } from '@/types/country';

interface LocationEntry {
  id: string;
  country: string;
  city: string;
  timestamp: number;
  duration: number;
  isCurrentLocation: boolean;
}

export const LocationAutoTracker: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationEntry[]>([]);
  const [autoTrackingEnabled, setAutoTrackingEnabled] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const granted = await EnhancedLocationService.requestBackgroundPermissions();
    setPermissionGranted(granted);
    
    if (!granted) {
      toast({
        title: "Location permission required",
        description: "Please grant location access to enable automatic tracking",
        variant: "destructive",
      });
    }
  };

  const handleLocationUpdate = (location: LocationData) => {
    setCurrentLocation(location);
    
    // Add to history if it's a new location
    const lastEntry = locationHistory[0];
    if (!lastEntry || lastEntry.country !== location.country) {
      const newEntry: LocationEntry = {
        id: Date.now().toString(),
        country: location.country,
        city: location.city,
        timestamp: location.timestamp,
        duration: 0,
        isCurrentLocation: true
      };

      setLocationHistory(prev => {
        const updated = prev.map(entry => ({ ...entry, isCurrentLocation: false }));
        return [newEntry, ...updated.slice(0, 9)]; // Keep last 10 entries
      });

      toast({
        title: "Location detected",
        description: `Now in ${location.city}, ${location.country}`,
      });
    }
  };

  const startTracking = async () => {
    if (!permissionGranted) {
      const granted = await EnhancedLocationService.requestBackgroundPermissions();
      if (!granted) return;
      setPermissionGranted(true);
    }

    try {
      await EnhancedLocationService.startBackgroundTracking(handleLocationUpdate);
      setIsTracking(true);
      setAutoTrackingEnabled(true);
      
      toast({
        title: "Tracking started",
        description: "Location tracking is now active",
      });
    } catch (error) {
      toast({
        title: "Failed to start tracking",
        description: "Please check your location settings",
        variant: "destructive",
      });
    }
  };

  const stopTracking = () => {
    EnhancedLocationService.stopBackgroundTracking();
    setIsTracking(false);
    setAutoTrackingEnabled(false);
    
    toast({
      title: "Tracking stopped",
      description: "Location tracking has been disabled",
    });
  };

  const formatDuration = (timestamp: number) => {
    const now = Date.now();
    const duration = now - timestamp;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return 'Less than 1 hour ago';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Automatic Location Tracking
        </CardTitle>
        <CardDescription>
          Automatically track your location for visa and tax compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Tracking Controls */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <div>
                <div className="font-medium">
                  {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isTracking 
                    ? 'Your location is being tracked automatically' 
                    : 'Click start to begin location tracking'
                  }
                </div>
              </div>
            </div>
            <Button
              onClick={isTracking ? stopTracking : startTracking}
              variant={isTracking ? "destructive" : "default"}
              disabled={!permissionGranted}
            >
              {isTracking ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Tracking
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Tracking
                </>
              )}
            </Button>
          </div>

          {/* Current Location */}
          {currentLocation && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div>
                    <div className="font-semibold">Current Location</div>
                    <div className="text-sm text-muted-foreground">
                      {currentLocation.city}, {currentLocation.country}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last updated: {new Date(currentLocation.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location History */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Locations
            </h3>
            
            {locationHistory.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No location history yet</p>
                <p className="text-sm">Start tracking to see your travel history</p>
              </div>
            ) : (
              <div className="space-y-2">
                {locationHistory.map((entry, index) => (
                  <Card key={entry.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${entry.isCurrentLocation ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <div>
                            <div className="font-medium">{entry.country}</div>
                            <div className="text-sm text-muted-foreground">{entry.city}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {formatDuration(entry.timestamp)}
                          </div>
                          {entry.isCurrentLocation && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Tracking Settings
            </h4>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-tracking">Automatic Tracking</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically track location changes
                </p>
              </div>
              <Switch
                id="auto-tracking"
                checked={autoTrackingEnabled}
                onCheckedChange={setAutoTrackingEnabled}
                disabled={!permissionGranted}
              />
            </div>
          </div>

          {/* Permission Warning */}
          {!permissionGranted && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Location permission is required for automatic tracking. 
                Please grant location access in your browser settings and refresh the page.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};