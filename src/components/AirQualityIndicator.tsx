import React, { useState, useEffect, useCallback } from 'react';
import { Wind } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AQIData {
  aqi: number;
  city: string;
  timestamp: number;
}

const AQI_CACHE_KEY = 'supernomad_aqi_cache';
const AQI_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

function getAQILevel(aqi: number): { label: string; color: string; bg: string } {
  if (aqi <= 50) return { label: 'Good', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-500' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-500' };
  if (aqi <= 150) return { label: 'Unhealthy*', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-600' };
  return { label: 'Hazardous', color: 'text-rose-800 dark:text-rose-400', bg: 'bg-rose-700' };
}

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
      // Use IQAir public widget endpoint (no API key needed)
      const res = await fetch(
        `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=demo`
      );
      const json = await res.json();
      if (json.status === 'ok' && json.data?.aqi) {
        const data: AQIData = {
          aqi: typeof json.data.aqi === 'number' ? json.data.aqi : parseInt(json.data.aqi, 10),
          city,
          timestamp: Date.now(),
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

    // Fetch immediately if no cache or different city
    if (!aqiData || aqiData.city !== location.city || Date.now() - aqiData.timestamp > AQI_REFRESH_INTERVAL) {
      fetchAQI(location.city);
    }

    const interval = setInterval(() => fetchAQI(location.city), AQI_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [location?.city, fetchAQI]);

  if (!aqiData) return null;

  const level = getAQILevel(aqiData.aqi);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5 cursor-default select-none">
          <Wind className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-bold tabular-nums">{aqiData.aqi}</span>
          <span className={`hidden sm:inline text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full text-white ${level.bg}`}>
            {level.label}
          </span>
          <span className={`sm:hidden h-2 w-2 rounded-full ${level.bg}`} />
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        <p className="font-semibold">Air Quality — {aqiData.city}</p>
        <p>AQI: {aqiData.aqi} ({level.label})</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AirQualityIndicator;
