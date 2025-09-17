import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Thermometer, 
  Eye, 
  Droplets,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

const WEATHER_CONDITIONS = {
  'sunny': { icon: Sun, color: 'text-yellow-500' },
  'cloudy': { icon: Cloud, color: 'text-gray-500' },
  'rainy': { icon: CloudRain, color: 'text-blue-500' },
  'snowy': { icon: CloudSnow, color: 'text-blue-200' },
  'partly-cloudy': { icon: Cloud, color: 'text-gray-400' }
};

export const WeatherIntegration: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Mock weather data
  const mockWeatherData: WeatherData = {
    location: 'London',
    country: 'United Kingdom',
    temperature: 18,
    condition: 'partly-cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 4,
    forecast: [
      { day: 'Today', high: 20, low: 15, condition: 'partly-cloudy' },
      { day: 'Tomorrow', high: 22, low: 16, condition: 'sunny' },
      { day: 'Wednesday', high: 19, low: 14, condition: 'rainy' },
      { day: 'Thursday', high: 18, low: 13, condition: 'cloudy' },
      { day: 'Friday', high: 21, low: 15, condition: 'sunny' }
    ]
  };

  const fetchWeather = async (location?: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real app, would fetch from weather API
    const data = {
      ...mockWeatherData,
      location: location || mockWeatherData.location,
      temperature: Math.round(Math.random() * 15 + 10), // Random temp 10-25°C
    };
    
    setWeatherData(data);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const handleSearch = () => {
    if (searchLocation.trim()) {
      fetchWeather(searchLocation);
      setSearchLocation('');
    }
  };

  const getCurrentLocationWeather = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // In real app, would use coordinates to fetch weather
          fetchWeather('Current Location');
        },
        () => {
          fetchWeather(); // Fallback to default location
        }
      );
    } else {
      fetchWeather();
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getConditionIcon = (condition: string) => {
    const conditionData = WEATHER_CONDITIONS[condition as keyof typeof WEATHER_CONDITIONS] || WEATHER_CONDITIONS.cloudy;
    const IconComponent = conditionData.icon;
    return <IconComponent className={`w-5 h-5 ${conditionData.color}`} />;
  };

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'text-green-500';
    if (uvIndex <= 5) return 'text-yellow-500';
    if (uvIndex <= 7) return 'text-orange-500';
    if (uvIndex <= 10) return 'text-red-500';
    return 'text-purple-500';
  };

  const getUVIndexDescription = (uvIndex: number) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="w-5 h-5" />
          Weather Forecast
        </CardTitle>
        <CardDescription>
          Current weather and forecast for your destination
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="location-search">Search Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location-search"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Enter city name..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={!searchLocation.trim()}>
                  Search
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <Button
                variant="outline"
                onClick={getCurrentLocationWeather}
                disabled={isLoading}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Current Location
              </Button>
            </div>
          </div>

          {weatherData && (
            <>
              {/* Current Weather */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{weatherData.location}</h3>
                      <p className="text-sm text-muted-foreground">{weatherData.country}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchWeather(weatherData.location)}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      {getConditionIcon(weatherData.condition)}
                      <span className="text-3xl font-bold">{weatherData.temperature}°C</span>
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {weatherData.condition.replace('-', ' ')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">{weatherData.humidity}%</div>
                        <div className="text-xs text-muted-foreground">Humidity</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">{weatherData.windSpeed} km/h</div>
                        <div className="text-xs text-muted-foreground">Wind</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">{weatherData.visibility} km</div>
                        <div className="text-xs text-muted-foreground">Visibility</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className={`w-4 h-4 ${getUVIndexColor(weatherData.uvIndex)}`} />
                      <div>
                        <div className="text-sm font-medium">{weatherData.uvIndex}</div>
                        <div className="text-xs text-muted-foreground">
                          {getUVIndexDescription(weatherData.uvIndex)} UV
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Forecast */}
              <div>
                <h3 className="text-lg font-semibold mb-3">5-Day Forecast</h3>
                <div className="grid gap-2">
                  {weatherData.forecast.map((day, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="font-medium min-w-20">{day.day}</div>
                            {getConditionIcon(day.condition)}
                            <div className="text-sm text-muted-foreground capitalize">
                              {day.condition.replace('-', ' ')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{day.high}°</span>
                            <span className="text-muted-foreground">{day.low}°</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Last updated: {lastUpdated?.toLocaleString()}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};