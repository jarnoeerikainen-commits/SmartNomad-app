import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plane, AlertTriangle, Sun, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react';
import { TOP_WEATHER_CITIES, WeatherCity } from '@/data/weatherCities';

interface TravelWeatherReportProps {
  userSports?: string[];
}

interface TravelForecast {
  city: WeatherCity;
  startDate: string;
  endDate: string;
  dailyForecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
    windSpeed: number;
    humidity: number;
    uvIndex: number;
  }>;
  alerts: string[];
  overallRating: 'excellent' | 'good' | 'fair' | 'poor';
  packingTips: string[];
}

const TravelWeatherReport: React.FC<TravelWeatherReportProps> = ({ userSports = [] }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState<TravelForecast | null>(null);
  const [suggestions, setSuggestions] = useState<WeatherCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<WeatherCity | null>(null);

  const handleSearch = (query: string) => {
    setDestination(query);
    setSelectedCity(null);
    if (query.length >= 2) {
      const q = query.toLowerCase();
      const matches = TOP_WEATHER_CITIES.filter(
        c => c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
      ).slice(0, 6);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const selectCity = (city: WeatherCity) => {
    setSelectedCity(city);
    setDestination(city.city + ', ' + city.country);
    setSuggestions([]);
  };

  const generateReport = () => {
    if (!selectedCity || !startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Generate realistic mock data based on latitude
    const isNorthern = selectedCity.lat > 0;
    const month = start.getMonth();
    const isSummer = isNorthern ? (month >= 4 && month <= 9) : (month <= 2 || month >= 10);
    const baseTempRange = isSummer ? [18, 32] : [2, 15];
    const isEquatorial = Math.abs(selectedCity.lat) < 23;
    if (isEquatorial) { baseTempRange[0] = 22; baseTempRange[1] = 34; }

    const conditions = isSummer
      ? ['Sunny', 'Partly Cloudy', 'Sunny', 'Partly Cloudy', 'Light Rain', 'Sunny']
      : ['Cloudy', 'Light Rain', 'Rain', 'Partly Cloudy', 'Cloudy', 'Snow'];

    const dailyForecast = [];
    const alerts: string[] = [];
    let totalPrecip = 0;
    let maxWind = 0;
    let minTemp = 100;
    let maxTemp = -100;

    for (let i = 0; i < Math.min(days, 14); i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const high = Math.round(baseTempRange[0] + Math.random() * (baseTempRange[1] - baseTempRange[0]));
      const low = Math.round(high - 5 - Math.random() * 5);
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const precipitation = condition.includes('Rain') ? Math.round(40 + Math.random() * 50) : Math.round(Math.random() * 20);
      const windSpeed = Math.round(5 + Math.random() * 25);
      const humidity = Math.round(40 + Math.random() * 40);
      const uvIndex = isSummer ? Math.round(4 + Math.random() * 7) : Math.round(1 + Math.random() * 4);

      totalPrecip += precipitation;
      maxWind = Math.max(maxWind, windSpeed);
      minTemp = Math.min(minTemp, low);
      maxTemp = Math.max(maxTemp, high);

      dailyForecast.push({
        date: date.toISOString().split('T')[0],
        day: i === 0 ? 'Arrival' : i === days - 1 ? 'Departure' : dayNames[date.getDay()],
        high, low, condition, precipitation, windSpeed, humidity, uvIndex,
      });
    }

    // Generate alerts
    if (maxTemp > 35) alerts.push('🔥 Extreme heat expected! Stay hydrated and avoid midday sun.');
    if (minTemp < 0) alerts.push('❄️ Freezing temperatures expected! Pack warm layers.');
    if (maxWind > 40) alerts.push('💨 Strong winds expected on some days.');
    if (totalPrecip / dailyForecast.length > 50) alerts.push('🌧️ High chance of rain during your trip. Pack waterproof gear.');
    if (dailyForecast.some(d => d.condition === 'Snow')) alerts.push('🌨️ Snowfall expected. Check road conditions.');

    // Sport-specific alerts
    const outdoorSports = userSports.filter(s => s !== 'gym' && s !== 'crossfit');
    if (outdoorSports.length > 0 && totalPrecip / dailyForecast.length > 40) {
      alerts.push(`🏅 Rain may affect your ${outdoorSports.slice(0, 2).join(' & ')} plans. Consider indoor alternatives.`);
    }

    // Packing tips
    const packingTips: string[] = [];
    if (maxTemp > 28) packingTips.push('Lightweight, breathable clothing');
    if (minTemp < 10) packingTips.push('Warm jacket and layers');
    if (totalPrecip / dailyForecast.length > 30) packingTips.push('Rain jacket & umbrella');
    if (dailyForecast.some(d => d.uvIndex > 6)) packingTips.push('Sunscreen SPF 50+, sunglasses');
    if (maxWind > 25) packingTips.push('Windproof outer layer');
    if (outdoorSports.length > 0) packingTips.push('Sport-specific gear for your activities');

    const avgPrecip = totalPrecip / dailyForecast.length;
    let overallRating: TravelForecast['overallRating'];
    if (avgPrecip < 20 && maxTemp < 33 && minTemp > 5) overallRating = 'excellent';
    else if (avgPrecip < 40 && maxTemp < 37) overallRating = 'good';
    else if (avgPrecip < 60) overallRating = 'fair';
    else overallRating = 'poor';

    setReport({
      city: selectedCity,
      startDate, endDate,
      dailyForecast, alerts, overallRating, packingTips,
    });
  };

  const ratingColors = {
    excellent: 'text-emerald-600 bg-emerald-500/10',
    good: 'text-primary bg-primary/10',
    fair: 'text-amber-600 bg-amber-500/10',
    poor: 'text-destructive bg-destructive/10',
  };

  const conditionIcon = (condition: string) => {
    if (condition.includes('Sun') || condition.includes('Clear')) return <Sun className="h-4 w-4 text-amber-500" />;
    if (condition.includes('Rain') || condition.includes('Drizzle')) return <CloudRain className="h-4 w-4 text-primary" />;
    if (condition.includes('Snow')) return <CloudSnow className="h-4 w-4 text-sky-400" />;
    if (condition.includes('Wind')) return <Wind className="h-4 w-4 text-muted-foreground" />;
    return <Sun className="h-4 w-4 text-amber-400" />;
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5 text-primary" />
          Travel Weather Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Input
              value={destination}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search destination..."
            />
            {suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-popover border rounded-lg shadow-large max-h-48 overflow-y-auto">
                {suggestions.map(city => (
                  <button
                    key={`${city.city}-${city.country}`}
                    className="w-full text-left px-3 py-2 hover:bg-accent/50 flex items-center gap-2 text-sm"
                    onClick={() => selectCity(city)}
                  >
                    <span>{city.emoji}</span>
                    <span className="font-medium">{city.city}</span>
                    <span className="text-muted-foreground">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>

        <Button
          onClick={generateReport}
          disabled={!selectedCity || !startDate || !endDate}
          className="w-full sm:w-auto"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Generate Weather Report
        </Button>

        {/* Report */}
        {report && (
          <div className="space-y-4 pt-4 border-t">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-bold">{report.city.emoji} {report.city.city}, {report.city.country}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(report.startDate).toLocaleDateString()} — {new Date(report.endDate).toLocaleDateString()}
                </p>
              </div>
              <Badge className={`text-sm px-3 py-1 ${ratingColors[report.overallRating]}`}>
                Weather: {report.overallRating.charAt(0).toUpperCase() + report.overallRating.slice(1)}
              </Badge>
            </div>

            {/* Alerts */}
            {report.alerts.length > 0 && (
              <div className="space-y-2">
                {report.alerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{alert}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Daily forecast */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Daily Forecast</h4>
              <div className="space-y-1">
                {report.dailyForecast.map((day, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg text-sm ${i === 0 ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      {conditionIcon(day.condition)}
                      <div>
                        <span className="font-medium">{day.day}</span>
                        <span className="text-muted-foreground ml-2 text-xs">{day.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">{day.condition}</span>
                      <span className="text-xs text-muted-foreground">💧{day.precipitation}%</span>
                      <span className="text-xs text-muted-foreground">💨{day.windSpeed}km/h</span>
                      <div>
                        <span className="font-semibold">{day.high}°</span>
                        <span className="text-muted-foreground ml-1">{day.low}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packing tips */}
            {report.packingTips.length > 0 && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-sm mb-2">🧳 Packing Recommendations</h4>
                <div className="flex flex-wrap gap-2">
                  {report.packingTips.map((tip, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{tip}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TravelWeatherReport;
