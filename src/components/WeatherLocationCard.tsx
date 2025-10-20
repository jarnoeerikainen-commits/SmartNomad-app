import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sun, 
  RefreshCw, 
  Trash2,
  CloudRain,
  CloudSnow,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  CloudSun,
  Navigation,
  Umbrella,
} from 'lucide-react';

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
}

interface Preferences {
  units: 'celsius' | 'fahrenheit';
  notifications: boolean;
  autoUpdate: boolean;
}

interface WeatherLocationCardProps {
  location: WeatherLocation;
  weatherData: WeatherData;
  preferences: Preferences;
  onRemove: () => void;
  onRefresh: () => void;
}

const WeatherLocationCard: React.FC<WeatherLocationCardProps> = ({
  location,
  weatherData,
  preferences,
  onRemove,
  onRefresh,
}) => {
  if (!weatherData) return null;

  const convertTemp = (celsius: number) => {
    if (preferences.units === 'fahrenheit') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return celsius;
  };

  const getWeatherIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'sun': <Sun className="h-12 w-12 text-warning" />,
      'cloud-sun': <CloudSun className="h-12 w-12 text-primary" />,
      'cloud': <Cloud className="h-12 w-12 text-muted-foreground" />,
      'cloud-drizzle': <CloudDrizzle className="h-12 w-12 text-primary" />,
      'cloud-rain': <CloudRain className="h-12 w-12 text-primary" />,
      'cloud-lightning': <CloudLightning className="h-12 w-12 text-destructive" />,
      'cloud-snow': <CloudSnow className="h-12 w-12 text-secondary" />,
      'cloud-fog': <CloudFog className="h-12 w-12 text-muted-foreground" />,
    };
    return iconMap[iconName] || iconMap['cloud'];
  };

  const getSmallWeatherIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'sun': <Sun className="h-6 w-6 text-warning" />,
      'cloud-sun': <CloudSun className="h-6 w-6 text-primary" />,
      'cloud': <Cloud className="h-6 w-6 text-muted-foreground" />,
      'cloud-drizzle': <CloudDrizzle className="h-6 w-6 text-primary" />,
      'cloud-rain': <CloudRain className="h-6 w-6 text-primary" />,
      'cloud-lightning': <CloudLightning className="h-6 w-6 text-destructive" />,
      'cloud-snow': <CloudSnow className="h-6 w-6 text-secondary" />,
      'cloud-fog': <CloudFog className="h-6 w-6 text-muted-foreground" />,
    };
    return iconMap[iconName] || iconMap['cloud'];
  };

  const getUVIndexColor = (uv: number) => {
    if (uv <= 2) return 'bg-success';
    if (uv <= 5) return 'bg-warning';
    if (uv <= 7) return 'bg-destructive';
    return 'bg-destructive';
  };

  const tempUnit = preferences.units === 'celsius' ? '°C' : '°F';

  return (
    <Card className="shadow-medium hover:shadow-large transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-xl font-bold">{location.city}</h3>
              <p className="text-sm text-muted-foreground">{location.country}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {location.isAutoDetected && (
              <Badge variant="secondary" className="text-xs">
                Current
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            {!location.isAutoDetected && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Weather */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">
                {convertTemp(weatherData.current.temp)}
              </span>
              <span className="text-2xl text-muted-foreground">{tempUnit}</span>
            </div>
            <p className="text-lg font-medium mt-1">{weatherData.current.condition}</p>
            <p className="text-sm text-muted-foreground">
              Feels like {convertTemp(weatherData.current.feelsLike)}{tempUnit}
            </p>
          </div>
          <div className="flex flex-col items-center">
            {getWeatherIcon(weatherData.current.icon)}
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Droplets className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-sm font-semibold">{weatherData.current.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Wind className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-sm font-semibold">
                {weatherData.current.windSpeed} km/h {weatherData.current.windDirection}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Gauge className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="text-sm font-semibold">{weatherData.current.pressure} mb</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Eye className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-sm font-semibold">{weatherData.current.visibility} km</p>
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">UV Index</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{weatherData.current.uvIndex}</span>
            <div className={`h-6 w-16 rounded-full ${getUVIndexColor(weatherData.current.uvIndex)}`} />
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            5-Day Forecast
          </h4>
          <div className="space-y-2">
            {weatherData.forecast.map((day, index) => (
              <div
                key={day.date}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? 'bg-primary/10' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {getSmallWeatherIcon(day.icon)}
                  <div>
                    <p className="font-medium">{day.day}</p>
                    <p className="text-xs text-muted-foreground">{day.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Umbrella className="h-3 w-3" />
                    {day.precipitation}%
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {convertTemp(day.high)}{tempUnit}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {convertTemp(day.low)}{tempUnit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-xs text-muted-foreground pt-2 border-t">
          Last updated: {new Date(location.lastUpdated).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherLocationCard;