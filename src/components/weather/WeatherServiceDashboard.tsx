import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CloudRain, MapPin, Sun, RefreshCw, Settings, Plus, Thermometer,
  Wind, Droplets, Eye, CloudSnow, Cloud, CloudSun, CloudDrizzle,
  CloudLightning, CloudFog, Navigation, Umbrella, Gauge, AlertTriangle,
  Plane, Activity, Search as SearchIcon, Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/contexts/LocationContext';
import { TOP_WEATHER_CITIES, WeatherCity } from '@/data/weatherCities';
import SportWeatherCards from './SportWeatherCards';
import TravelWeatherReport from './TravelWeatherReport';
import WeatherQuickSearch from './WeatherQuickSearch';
import WeatherPreferencesModal from '@/components/WeatherPreferencesModal';
import WeatherCitySelector from '@/components/WeatherCitySelector';
import SevereWeatherAlert from '@/components/SevereWeatherAlert';

// Types
interface WeatherLocation {
  id: string;
  city: string;
  country: string;
  emoji: string;
  lat: number;
  lon: number;
  isAutoDetected: boolean;
  lastUpdated: Date;
}

interface CurrentWeather {
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
}

interface ForecastDay {
  date: string;
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
  windSpeed: number;
}

interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
  alerts?: Array<{
    type: string;
    severity: 'warning' | 'watch' | 'advisory';
    headline: string;
    description: string;
    expires: Date;
  }>;
}

// Mock generator
const generateMockWeather = (lat: number): WeatherData => {
  const isEquatorial = Math.abs(lat) < 23;
  const isNorthern = lat > 0;
  const month = new Date().getMonth();
  const isSummer = isNorthern ? (month >= 4 && month <= 9) : (month <= 2 || month >= 10);

  const baseTemp = isEquatorial ? 28 : isSummer ? 22 : 8;
  const conditions = [
    { name: 'Sunny', icon: 'sun', tempMod: 4 },
    { name: 'Partly Cloudy', icon: 'cloud-sun', tempMod: 2 },
    { name: 'Cloudy', icon: 'cloud', tempMod: -1 },
    { name: 'Light Rain', icon: 'cloud-drizzle', tempMod: -3 },
    { name: 'Rain', icon: 'cloud-rain', tempMod: -4 },
    { name: 'Thunderstorm', icon: 'cloud-lightning', tempMod: -2 },
  ];

  if (!isSummer && !isEquatorial) {
    conditions.push({ name: 'Snow', icon: 'cloud-snow', tempMod: -10 });
    conditions.push({ name: 'Fog', icon: 'cloud-fog', tempMod: -5 });
  }

  const curr = conditions[Math.floor(Math.random() * conditions.length)];
  const temp = Math.round(baseTemp + curr.tempMod + (Math.random() * 6 - 3));

  const forecast: ForecastDay[] = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const c = conditions[Math.floor(Math.random() * conditions.length)];
    const high = Math.round(baseTemp + c.tempMod + Math.random() * 5 + 2);
    forecast.push({
      date: d.toISOString().split('T')[0],
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
      high,
      low: Math.round(high - 4 - Math.random() * 4),
      condition: c.name,
      icon: c.icon,
      precipitation: c.name.includes('Rain') || c.name.includes('Snow') ? Math.round(40 + Math.random() * 50) : Math.round(Math.random() * 20),
      windSpeed: Math.round(5 + Math.random() * 20),
    });
  }

  // Random alerts (25% chance)
  const alerts = Math.random() > 0.75 ? [{
    type: 'severe-weather',
    severity: (['warning', 'watch', 'advisory'] as const)[Math.floor(Math.random() * 3)],
    headline: ['Heavy Rain Warning', 'Wind Advisory', 'Heat Advisory', 'Storm Watch', 'Snow Warning'][Math.floor(Math.random() * 5)],
    description: 'Severe weather conditions expected. Take necessary precautions for outdoor activities.',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }] : [];

  return {
    current: {
      temp,
      feelsLike: Math.round(temp + (Math.random() * 4 - 2)),
      condition: curr.name,
      icon: curr.icon,
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 25),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      pressure: Math.round(990 + Math.random() * 40),
      visibility: Math.round(5 + Math.random() * 15),
      uvIndex: Math.round(isSummer ? 4 + Math.random() * 7 : 1 + Math.random() * 4),
      cloudCover: Math.round(Math.random() * 100),
    },
    forecast,
    alerts,
  };
};

const WeatherServiceDashboard: React.FC = () => {
  const { toast } = useToast();
  const { location: locationData } = useLocation();
  const [locations, setLocations] = useState<WeatherLocation[]>([]);
  const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [preferences, setPreferences] = useState({
    units: 'celsius' as 'celsius' | 'fahrenheit',
    notifications: true,
    autoUpdate: true,
  });

  // Load user sports from localStorage profile
  const userSports = useMemo(() => {
    try {
      const profile = localStorage.getItem('supernomad-profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        return parsed?.personal?.sports?.active || [];
      }
    } catch { /* ignore */ }
    return ['running', 'cycling', 'hiking', 'swimming']; // defaults for demo
  }, []);

  // Initialize with current location
  useEffect(() => {
    setIsLoading(true);
    const currentCity = locationData?.city || 'Lisbon';
    const currentCountry = locationData?.country || 'Portugal';
    const match = TOP_WEATHER_CITIES.find(
      c => c.city.toLowerCase() === currentCity.toLowerCase()
    ) || TOP_WEATHER_CITIES.find(c => c.city === 'Lisbon')!;

    const autoLoc: WeatherLocation = {
      id: 'current',
      city: match.city,
      country: match.country,
      emoji: match.emoji,
      lat: match.lat,
      lon: match.lon,
      isAutoDetected: true,
      lastUpdated: new Date(),
    };

    // Load saved locations
    const saved = localStorage.getItem('weather-locations');
    const savedLocs: WeatherLocation[] = saved ? JSON.parse(saved) : [];
    const allLocs = [autoLoc, ...savedLocs.filter(s => s.id !== 'current')];

    setLocations(allLocs);

    const wMap: Record<string, WeatherData> = {};
    allLocs.forEach(loc => {
      wMap[loc.id] = generateMockWeather(loc.lat);
    });
    setWeatherMap(wMap);
    setIsLoading(false);
  }, [locationData]);

  const addCity = (city: WeatherCity) => {
    if (locations.length >= 8) {
      toast({ title: 'Limit Reached', description: 'Max 8 locations', variant: 'destructive' });
      return;
    }
    const newLoc: WeatherLocation = {
      id: `loc-${Date.now()}`,
      city: city.city,
      country: city.country,
      emoji: city.emoji,
      lat: city.lat,
      lon: city.lon,
      isAutoDetected: false,
      lastUpdated: new Date(),
    };
    const updated = [...locations, newLoc];
    setLocations(updated);
    setWeatherMap({ ...weatherMap, [newLoc.id]: generateMockWeather(city.lat) });
    localStorage.setItem('weather-locations', JSON.stringify(updated.filter(l => !l.isAutoDetected)));
    toast({ title: 'Added', description: `Tracking ${city.city}` });
  };

  const removeCity = (id: string) => {
    const updated = locations.filter(l => l.id !== id);
    setLocations(updated);
    const wm = { ...weatherMap };
    delete wm[id];
    setWeatherMap(wm);
    localStorage.setItem('weather-locations', JSON.stringify(updated.filter(l => !l.isAutoDetected)));
  };

  const refreshAll = () => {
    setIsLoading(true);
    setTimeout(() => {
      const wMap: Record<string, WeatherData> = {};
      locations.forEach(loc => {
        wMap[loc.id] = generateMockWeather(loc.lat);
      });
      setWeatherMap(wMap);
      setIsLoading(false);
      toast({ title: 'Refreshed', description: 'All weather data updated' });
    }, 800);
  };

  const convertTemp = (c: number) => preferences.units === 'fahrenheit' ? Math.round(c * 9 / 5 + 32) : c;
  const tempUnit = preferences.units === 'celsius' ? '°C' : '°F';

  const getIcon = (icon: string, size = 'h-10 w-10') => {
    const map: Record<string, React.ReactNode> = {
      'sun': <Sun className={`${size} text-amber-500`} />,
      'cloud-sun': <CloudSun className={`${size} text-primary`} />,
      'cloud': <Cloud className={`${size} text-muted-foreground`} />,
      'cloud-drizzle': <CloudDrizzle className={`${size} text-primary`} />,
      'cloud-rain': <CloudRain className={`${size} text-primary`} />,
      'cloud-lightning': <CloudLightning className={`${size} text-destructive`} />,
      'cloud-snow': <CloudSnow className={`${size} text-sky-400`} />,
      'cloud-fog': <CloudFog className={`${size} text-muted-foreground`} />,
    };
    return map[icon] || map['cloud'];
  };

  // All active alerts
  const allAlerts = Object.values(weatherMap).flatMap(d => d.alerts || []).filter(a => a.expires > new Date());
  const currentLoc = locations.find(l => l.isAutoDetected);
  const currentWeather = currentLoc ? weatherMap[currentLoc.id] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-none shadow-medium bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <CloudRain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">Weather Service</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Live weather • Travel forecasts • Sport conditions
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="icon" onClick={refreshAll} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setShowPreferences(true)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button onClick={() => setShowCitySelector(true)} disabled={locations.length >= 8}>
                <Plus className="h-4 w-4 mr-2" /> Add City
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Search */}
      <WeatherQuickSearch
        onSelectCity={addCity}
        currentCity={currentLoc?.city}
      />

      {/* Severe Alerts */}
      {allAlerts.length > 0 && (
        <div className="space-y-3">
          {allAlerts.map((alert, i) => (
            <SevereWeatherAlert key={i} alert={alert} onDismiss={() => toast({ title: 'Dismissed' })} />
          ))}
        </div>
      )}

      {/* Current Location Hero */}
      {currentLoc && currentWeather && (
        <Card className="shadow-large overflow-hidden">
          <div className="relative p-6 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <Badge variant="secondary" className="text-xs">📍 Your Location</Badge>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{currentLoc.emoji} {currentLoc.city}, {currentLoc.country}</h2>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-bold">{convertTemp(currentWeather.current.temp)}</span>
                  <span className="text-2xl text-muted-foreground">{tempUnit}</span>
                </div>
                <p className="text-lg mt-1">{currentWeather.current.condition}</p>
                <p className="text-sm text-muted-foreground">
                  Feels like {convertTemp(currentWeather.current.feelsLike)}{tempUnit}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                {getIcon(currentWeather.current.icon, 'h-16 w-16')}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-background/60">
                <Droplets className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                  <p className="text-sm font-semibold">{currentWeather.current.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-background/60">
                <Wind className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Wind</p>
                  <p className="text-sm font-semibold">{currentWeather.current.windSpeed} km/h {currentWeather.current.windDirection}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-background/60">
                <Eye className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Visibility</p>
                  <p className="text-sm font-semibold">{currentWeather.current.visibility} km</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-background/60">
                <Sun className="h-4 w-4 text-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">UV Index</p>
                  <p className="text-sm font-semibold">{currentWeather.current.uvIndex}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="current">
            <Sun className="h-4 w-4 mr-1 hidden sm:block" /> Forecast
          </TabsTrigger>
          <TabsTrigger value="sports">
            <Activity className="h-4 w-4 mr-1 hidden sm:block" /> Sports
          </TabsTrigger>
          <TabsTrigger value="travel">
            <Plane className="h-4 w-4 mr-1 hidden sm:block" /> Travel
          </TabsTrigger>
          <TabsTrigger value="cities">
            <MapPin className="h-4 w-4 mr-1 hidden sm:block" /> Cities
          </TabsTrigger>
        </TabsList>

        {/* Forecast Tab */}
        <TabsContent value="current" className="space-y-4">
          {currentWeather && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  7-Day Forecast — {currentLoc?.city}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentWeather.forecast.map((day, i) => (
                    <div key={day.date} className={`flex items-center justify-between p-3 rounded-lg ${i === 0 ? 'bg-primary/10' : 'bg-muted/30'}`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getIcon(day.icon, 'h-6 w-6')}
                        <div>
                          <p className="font-medium text-sm">{day.day}</p>
                          <p className="text-xs text-muted-foreground">{day.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Umbrella className="h-3 w-3" /> {day.precipitation}%
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Wind className="h-3 w-3" /> {day.windSpeed}
                        </div>
                        <div>
                          <span className="text-sm font-semibold">{convertTemp(day.high)}{tempUnit}</span>
                          <span className="text-sm text-muted-foreground ml-1">{convertTemp(day.low)}{tempUnit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sports Tab */}
        <TabsContent value="sports" className="space-y-4">
          {currentWeather && (
            <SportWeatherCards
              userSports={userSports}
              weather={currentWeather.current}
              forecast={currentWeather.forecast}
            />
          )}

          {userSports.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">No sports in your profile</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your sports in Profile → Personal Preferences to get weather recommendations
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Travel Tab */}
        <TabsContent value="travel" className="space-y-4">
          <TravelWeatherReport userSports={userSports} />
        </TabsContent>

        {/* Cities Tab */}
        <TabsContent value="cities" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {locations.map(loc => {
              const data = weatherMap[loc.id];
              if (!data) return null;
              return (
                <Card key={loc.id} className="shadow-medium hover:shadow-large transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{loc.emoji}</span>
                        <div>
                          <h3 className="font-bold">{loc.city}</h3>
                          <p className="text-xs text-muted-foreground">{loc.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {loc.isAutoDetected && <Badge variant="secondary" className="text-xs">📍</Badge>}
                        {!loc.isAutoDetected && (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeCity(loc.id)}>
                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{convertTemp(data.current.temp)}</span>
                        <span className="text-lg text-muted-foreground">{tempUnit}</span>
                      </div>
                      {getIcon(data.current.icon, 'h-10 w-10')}
                    </div>
                    <p className="text-sm mt-1">{data.current.condition}</p>

                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-muted-foreground">
                      <span>💧 {data.current.humidity}%</span>
                      <span>💨 {data.current.windSpeed}km/h</span>
                      <span>☀️ UV {data.current.uvIndex}</span>
                    </div>

                    {/* Mini forecast */}
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {data.forecast.slice(0, 5).map(d => (
                        <div key={d.date} className="text-center min-w-[3rem]">
                          <p className="text-xs text-muted-foreground">{d.day.slice(0, 3)}</p>
                          {getIcon(d.icon, 'h-4 w-4 mx-auto')}
                          <p className="text-xs font-medium">{convertTemp(d.high)}°</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button variant="outline" className="w-full" onClick={() => setShowCitySelector(true)} disabled={locations.length >= 8}>
            <Plus className="h-4 w-4 mr-2" /> Add Another City
          </Button>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <WeatherPreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        preferences={preferences}
        onSave={p => { setPreferences(p); toast({ title: 'Preferences saved' }); }}
      />
      <WeatherCitySelector
        isOpen={showCitySelector}
        onClose={() => setShowCitySelector(false)}
        onSelectCity={addCity}
        excludedCities={locations.map(l => l.city)}
        maxSelections={8}
      />
    </div>
  );
};

export default WeatherServiceDashboard;
