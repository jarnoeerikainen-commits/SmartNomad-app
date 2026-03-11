import React, { useState, useEffect, useCallback } from 'react';
import { Wind, Droplets, CloudRain, Flame, Atom, FlaskConical } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';

interface PollutantData {
  pm25?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
  so2?: number;
  co?: number;
}

interface AQIData {
  aqi: number;
  city: string;
  timestamp: number;
  pollutants: PollutantData;
  dominantPollutant?: string;
}

const AQI_CACHE_KEY = 'supernomad_aqi_cache_v2';
const AQI_REFRESH_INTERVAL = 10 * 60 * 1000;

function getAQILevel(aqi: number): { label: string; color: string; bg: string; textColor: string } {
  if (aqi <= 50) return { label: 'Good', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400' };
  if (aqi <= 150) return { label: 'Sensitive Groups', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-600', textColor: 'text-purple-600 dark:text-purple-400' };
  return { label: 'Hazardous', color: 'text-rose-800 dark:text-rose-400', bg: 'bg-rose-700', textColor: 'text-rose-600 dark:text-rose-400' };
}

function getPollutantLevel(value: number, max: number): string {
  const pct = (value / max) * 100;
  if (pct <= 33) return 'bg-green-500';
  if (pct <= 66) return 'bg-yellow-500';
  if (pct <= 85) return 'bg-orange-500';
  return 'bg-red-500';
}

const pollutantInfo = [
  { key: 'pm25' as const, label: 'PM2.5', unit: 'µg/m³', max: 250, icon: Droplets, desc: 'Fine particles' },
  { key: 'pm10' as const, label: 'PM10', unit: 'µg/m³', max: 430, icon: CloudRain, desc: 'Coarse particles' },
  { key: 'o3' as const, label: 'O₃', unit: 'ppb', max: 200, icon: Atom, desc: 'Ozone' },
  { key: 'no2' as const, label: 'NO₂', unit: 'ppb', max: 360, icon: Flame, desc: 'Nitrogen dioxide' },
  { key: 'so2' as const, label: 'SO₂', unit: 'ppb', max: 604, icon: FlaskConical, desc: 'Sulfur dioxide' },
  { key: 'co' as const, label: 'CO', unit: 'ppm', max: 50, icon: Wind, desc: 'Carbon monoxide' },
];

const AirQualityIndicator: React.FC = () => {
  const { location } = useLocation();
  const [aqiData, setAqiData] = useState<AQIData | null>(() => {
    try {
      const cached = localStorage.getItem(AQI_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as AQIData;
        if (Date.now() - parsed.timestamp < AQI_REFRESH_INTERVAL) return parsed;
      }
    } catch {}
    return null;
  });

  const fetchAQI = useCallback(async (city: string) => {
    try {
      const res = await fetch(
        `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=demo`
      );
      const json = await res.json();
      if (json.status === 'ok' && json.data?.aqi) {
        const iaqi = json.data.iaqi || {};
        const data: AQIData = {
          aqi: typeof json.data.aqi === 'number' ? json.data.aqi : parseInt(json.data.aqi, 10),
          city,
          timestamp: Date.now(),
          dominantPollutant: json.data.dominentpol || undefined,
          pollutants: {
            pm25: iaqi.pm25?.v,
            pm10: iaqi.pm10?.v,
            o3: iaqi.o3?.v,
            no2: iaqi.no2?.v,
            so2: iaqi.so2?.v,
            co: iaqi.co?.v,
          },
        };
        setAqiData(data);
        localStorage.setItem(AQI_CACHE_KEY, JSON.stringify(data));
      }
    } catch (err) {
      console.error('AQI fetch error:', err);
    }
  }, []);

  useEffect(() => {
    if (!location?.city || location.city === 'Unknown') return;
    if (!aqiData || aqiData.city !== location.city || Date.now() - aqiData.timestamp > AQI_REFRESH_INTERVAL) {
      fetchAQI(location.city);
    }
    const interval = setInterval(() => fetchAQI(location.city), AQI_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [location?.city, fetchAQI]);

  if (!aqiData) return null;

  const level = getAQILevel(aqiData.aqi);
  const availablePollutants = pollutantInfo.filter(p => aqiData.pollutants[p.key] != null);

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-1.5 cursor-default select-none">
          <Wind className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-bold tabular-nums">{aqiData.aqi}</span>
          <span className={`hidden sm:inline text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full text-white ${level.bg}`}>
            {level.label}
          </span>
          <span className={`sm:hidden h-2 w-2 rounded-full ${level.bg}`} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="center" className="w-80 p-0 overflow-hidden">
        {/* Header */}
        <div className={`px-4 py-3 ${level.bg} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium opacity-90">Air Quality Index</p>
              <p className="text-2xl font-bold">{aqiData.aqi}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{level.label}</p>
              <p className="text-xs opacity-90">{aqiData.city}</p>
            </div>
          </div>
        </div>

        {/* Pollutants */}
        <div className="p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pollutant Breakdown</p>
          {availablePollutants.length > 0 ? (
            <div className="space-y-2.5">
              {availablePollutants.map(({ key, label, unit, max, icon: Icon, desc }) => {
                const value = aqiData.pollutants[key]!;
                const pct = Math.min((value / max) * 100, 100);
                const barColor = getPollutantLevel(value, max);
                const isDominant = aqiData.dominantPollutant === key.replace('pm25', 'pm25').replace('pm10', 'pm10');
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{label}</span>
                        <span className="text-muted-foreground">{desc}</span>
                        {isDominant && (
                          <span className="text-[9px] bg-destructive/10 text-destructive px-1 py-0.5 rounded font-semibold">DOM</span>
                        )}
                      </div>
                      <span className="font-mono font-semibold tabular-nums">{value} <span className="text-muted-foreground font-normal">{unit}</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Detailed pollutant data not available for this station.</p>
          )}

          {/* Footer */}
          <div className="pt-2 border-t flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Source: WAQI / IQAir</span>
            <span>Updated {Math.round((Date.now() - aqiData.timestamp) / 60000)}m ago</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default AirQualityIndicator;
