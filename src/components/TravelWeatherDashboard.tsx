import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CloudRain, Plus, MapPin, Settings, RefreshCw, Sun, CloudSnow, Cloud } from 'lucide-react';
import WeatherLocationCard from './WeatherLocationCard';
import SevereWeatherAlert from './SevereWeatherAlert';
import WeatherPreferencesModal from './WeatherPreferencesModal';
import { useToast } from '@/hooks/use-toast';

interface WeatherLocation {
  id: string;
  city: string;
  country: string;
  isAutoDetected: boolean;
  lastUpdated: Date;
}

interface WeatherData {
  locationId: string;
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    visibility: number;
    uvIndex: number;
    cloudCover: number;
  };
  forecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitation: number;
    windSpeed: number;
  }>;
  alerts?: Array<{
    type: string;
    severity: 'warning' | 'watch' | 'advisory';
    headline: string;
    description: string;
    expires: Date;
  }>;
}

const TravelWeatherDashboard: React.FC = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<WeatherLocation[]>([]);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    units: 'celsius' as 'celsius' | 'fahrenheit',
    notifications: true,
    autoUpdate: true,
  });

  // Mock weather data generator
  const generateMockWeather = (city: string, country: string): WeatherData => {
    const conditions = [
      { name: 'Sunny', icon: 'sun', temp: 28 },
      { name: 'Partly Cloudy', icon: 'cloud-sun', temp: 24 },
      { name: 'Cloudy', icon: 'cloud', temp: 20 },
      { name: 'Light Rain', icon: 'cloud-drizzle', temp: 18 },
      { name: 'Rain', icon: 'cloud-rain', temp: 16 },
      { name: 'Thunderstorm', icon: 'cloud-lightning', temp: 22 },
      { name: 'Snow', icon: 'cloud-snow', temp: -2 },
      { name: 'Fog', icon: 'cloud-fog', temp: 12 },
    ];

    const currentCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const baseTemp = currentCondition.temp + (Math.random() * 10 - 5);

    const forecast = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        day: i === 0 ? 'Today' : days[date.getDay()],
        high: Math.round(baseTemp + Math.random() * 8 + 2),
        low: Math.round(baseTemp - Math.random() * 5),
        condition: condition.name,
        icon: condition.icon,
        precipitation: Math.round(Math.random() * 80),
        windSpeed: Math.round(Math.random() * 25 + 5),
      });
    }

    // Generate random severe weather alerts (20% chance)
    const alerts = Math.random() > 0.8 ? [{
      type: 'severe-weather',
      severity: ['warning', 'watch', 'advisory'][Math.floor(Math.random() * 3)] as 'warning' | 'watch' | 'advisory',
      headline: ['Heavy Rain Warning', 'Wind Advisory', 'Heat Advisory', 'Storm Watch'][Math.floor(Math.random() * 4)],
      description: 'Severe weather conditions expected in the area. Please stay informed and take necessary precautions.',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }] : [];

    return {
      locationId: `${city}-${country}`,
      current: {
        temp: Math.round(baseTemp),
        feelsLike: Math.round(baseTemp + (Math.random() * 4 - 2)),
        condition: currentCondition.name,
        icon: currentCondition.icon,
        humidity: Math.round(Math.random() * 40 + 40),
        windSpeed: Math.round(Math.random() * 25 + 5),
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        pressure: Math.round(Math.random() * 40 + 990),
        visibility: Math.round(Math.random() * 15 + 5),
        uvIndex: Math.round(Math.random() * 11),
        cloudCover: Math.round(Math.random() * 100),
      },
      forecast,
      alerts,
    };
  };

  // Initialize with auto-detected location
  useEffect(() => {
    const initializeWeather = () => {
      setIsLoading(true);
      
      // Simulate geolocation
      setTimeout(() => {
        const autoLocation: WeatherLocation = {
          id: 'auto-1',
          city: 'Lisbon',
          country: 'Portugal',
          isAutoDetected: true,
          lastUpdated: new Date(),
        };
        
        setLocations([autoLocation]);
        setWeatherData({
          [autoLocation.id]: generateMockWeather(autoLocation.city, autoLocation.country),
        });
        setIsLoading(false);
        
        toast({
          title: 'Location Detected',
          description: `Weather loaded for ${autoLocation.city}, ${autoLocation.country}`,
        });
      }, 1000);
    };

    initializeWeather();
  }, []);

  const handleAddLocation = () => {
    if (locations.length >= 5) {
      toast({
        title: 'Location Limit Reached',
        description: 'You can track up to 5 locations. Remove one to add another.',
        variant: 'destructive',
      });
      return;
    }

    // Popular nomad destinations for demo
    const cities = [
      { city: 'Bangkok', country: 'Thailand' },
      { city: 'Barcelona', country: 'Spain' },
      { city: 'Bali', country: 'Indonesia' },
      { city: 'Mexico City', country: 'Mexico' },
      { city: 'Dubai', country: 'UAE' },
      { city: 'Tokyo', country: 'Japan' },
      { city: 'Berlin', country: 'Germany' },
      { city: 'Cape Town', country: 'South Africa' },
    ];

    const availableCities = cities.filter(
      c => !locations.some(l => l.city === c.city)
    );

    if (availableCities.length === 0) {
      toast({
        title: 'No More Cities',
        description: 'All available cities are already tracked.',
      });
      return;
    }

    const newCity = availableCities[Math.floor(Math.random() * availableCities.length)];
    const newLocation: WeatherLocation = {
      id: `loc-${Date.now()}`,
      city: newCity.city,
      country: newCity.country,
      isAutoDetected: false,
      lastUpdated: new Date(),
    };

    setLocations([...locations, newLocation]);
    setWeatherData({
      ...weatherData,
      [newLocation.id]: generateMockWeather(newLocation.city, newLocation.country),
    });

    toast({
      title: 'Location Added',
      description: `Now tracking weather for ${newCity.city}, ${newCity.country}`,
    });
  };

  const handleRemoveLocation = (locationId: string) => {
    setLocations(locations.filter(l => l.id !== locationId));
    const newWeatherData = { ...weatherData };
    delete newWeatherData[locationId];
    setWeatherData(newWeatherData);

    toast({
      title: 'Location Removed',
      description: 'Location removed from tracking',
    });
  };

  const handleRefreshAll = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newWeatherData: Record<string, WeatherData> = {};
      locations.forEach(location => {
        newWeatherData[location.id] = generateMockWeather(location.city, location.country);
      });
      setWeatherData(newWeatherData);
      setIsLoading(false);
      
      toast({
        title: 'Weather Updated',
        description: 'All locations refreshed successfully',
      });
    }, 1000);
  };

  const handleSavePreferences = (newPreferences: typeof preferences) => {
    setPreferences(newPreferences);
    toast({
      title: 'Preferences Saved',
      description: 'Your weather preferences have been updated',
    });
  };

  // Get all active alerts
  const allAlerts = Object.values(weatherData)
    .flatMap(data => data.alerts || [])
    .filter(alert => alert.expires > new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-none shadow-medium bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <CloudRain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">Travel Weather</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Track weather across your travel destinations
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefreshAll}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowPreferences(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleAddLocation}
                className="gradient-primary"
                disabled={locations.length >= 5}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Severe Weather Alerts */}
      {allAlerts.length > 0 && (
        <div className="space-y-3">
          {allAlerts.map((alert, index) => (
            <SevereWeatherAlert
              key={index}
              alert={alert}
              onDismiss={() => {
                toast({
                  title: 'Alert Dismissed',
                  description: 'You can view dismissed alerts in history',
                });
              }}
            />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Locations Tracked</p>
                <p className="text-3xl font-bold text-primary">{locations.length}/5</p>
              </div>
              <MapPin className="h-10 w-10 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-3xl font-bold text-destructive">{allAlerts.length}</p>
              </div>
              <CloudSnow className="h-10 w-10 text-destructive/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-lg font-semibold">
                  {locations[0]?.lastUpdated
                    ? new Date(locations[0].lastUpdated).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Never'}
                </p>
              </div>
              <Sun className="h-10 w-10 text-warning/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weather Cards */}
      {isLoading && locations.length === 0 ? (
        <Card className="shadow-medium">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <RefreshCw className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium">Loading weather data...</p>
              <p className="text-sm text-muted-foreground">
                Detecting your location and fetching weather information
              </p>
            </div>
          </CardContent>
        </Card>
      ) : locations.length === 0 ? (
        <Card className="shadow-medium">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <Cloud className="h-16 w-16 text-muted-foreground" />
              <p className="text-lg font-medium">No Locations Added</p>
              <p className="text-sm text-muted-foreground max-w-md">
                Add your travel destinations to track weather conditions and receive alerts
              </p>
              <Button onClick={handleAddLocation} className="gradient-primary mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Location
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {locations.map(location => (
            <WeatherLocationCard
              key={location.id}
              location={location}
              weatherData={weatherData[location.id]}
              preferences={preferences}
              onRemove={() => handleRemoveLocation(location.id)}
              onRefresh={() => {
                setWeatherData({
                  ...weatherData,
                  [location.id]: generateMockWeather(location.city, location.country),
                });
                toast({
                  title: 'Weather Updated',
                  description: `Refreshed ${location.city}`,
                });
              }}
            />
          ))}
        </div>
      )}

      {/* Preferences Modal */}
      <WeatherPreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        preferences={preferences}
        onSave={handleSavePreferences}
      />
    </div>
  );
};

export default TravelWeatherDashboard;