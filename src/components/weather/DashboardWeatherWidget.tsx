import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sun, Cloud, CloudRain, CloudSnow, CloudSun, MapPin, ChevronRight, AlertTriangle } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { TOP_WEATHER_CITIES } from '@/data/weatherCities';

interface DashboardWeatherWidgetProps {
  onNavigate: (section: string) => void;
}

const DashboardWeatherWidget: React.FC<DashboardWeatherWidgetProps> = ({ onNavigate }) => {
  const { location: locationData } = useLocation();
  const [weather, setWeather] = useState<{
    temp: number; condition: string; icon: string; humidity: number; windSpeed: number;
    high: number; low: number; alerts: number;
  } | null>(null);

  const currentCity = locationData?.city || 'Unknown';
  const currentLat = locationData?.latitude;

  useEffect(() => {
    // Mock weather for current location
    const match = TOP_WEATHER_CITIES.find(c => c.city.toLowerCase() === currentCity.toLowerCase());
    const lat = match?.lat || 38;
    const isEquatorial = Math.abs(lat) < 23;
    const month = new Date().getMonth();
    const isSummer = lat > 0 ? (month >= 4 && month <= 9) : (month <= 2 || month >= 10);
    const base = isEquatorial ? 28 : isSummer ? 24 : 10;

    const conditions = [
      { name: 'Sunny', icon: 'sun' },
      { name: 'Partly Cloudy', icon: 'cloud-sun' },
      { name: 'Cloudy', icon: 'cloud' },
      { name: 'Light Rain', icon: 'cloud-rain' },
    ];
    const c = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.round(base + Math.random() * 6 - 3);

    setWeather({
      temp,
      condition: c.name,
      icon: c.icon,
      humidity: Math.round(40 + Math.random() * 35),
      windSpeed: Math.round(5 + Math.random() * 15),
      high: temp + Math.round(Math.random() * 4 + 1),
      low: temp - Math.round(Math.random() * 4 + 1),
      alerts: Math.random() > 0.8 ? 1 : 0,
    });
  }, [currentCity]);

  if (!weather) return null;

  const getIcon = () => {
    switch (weather.icon) {
      case 'sun': return <Sun className="h-8 w-8 text-warning" />;
      case 'cloud-sun': return <CloudSun className="h-8 w-8 text-primary" />;
      case 'cloud-rain': return <CloudRain className="h-8 w-8 text-primary" />;
      case 'cloud-snow': return <CloudSnow className="h-8 w-8 text-secondary" />;
      default: return <Cloud className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const emoji = TOP_WEATHER_CITIES.find(c => c.city.toLowerCase() === currentCity.toLowerCase())?.emoji || '🌍';

  return (
    <Card
      className="shadow-medium hover:shadow-large transition-all cursor-pointer group"
      onClick={() => onNavigate('weather-service')}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{emoji} {currentCity}</span>
          </div>
          <div className="flex items-center gap-1">
            {weather.alerts > 0 && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" /> Alert
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{weather.temp}</span>
              <span className="text-lg text-muted-foreground">°C</span>
            </div>
            <p className="text-sm text-muted-foreground">{weather.condition}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              H:{weather.high}° L:{weather.low}°
            </p>
          </div>
          {getIcon()}
        </div>

        <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
          <span>💧 {weather.humidity}%</span>
          <span>💨 {weather.windSpeed} km/h</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardWeatherWidget;
