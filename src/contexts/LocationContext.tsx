import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { LocationData } from '@/types/country';
import { useToast } from '@/hooks/use-toast';

interface VPNStatus {
  detected: boolean;
  gpsLocation?: LocationData;
  ipLocation?: LocationData;
  dismissed: boolean;
}

interface LocationContextType {
  location: LocationData | null;
  isTracking: boolean;
  isLoading: boolean;
  vpnStatus: VPNStatus;
  error: string | null;
  refreshLocation: () => Promise<void>;
  dismissVPNWarning: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCATION_CACHE_KEY = 'supernomad_last_location';
const LOCATION_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function fetchIPLocation(): Promise<LocationData | null> {
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en');
    const data = await res.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      country: data.countryName || 'Unknown',
      country_code: data.countryCode || 'XX',
      city: data.city || data.locality || 'Unknown',
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

function getGPSLocation(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
          );
          const data = await res.json();
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            country: data.countryName || 'Unknown',
            country_code: data.countryCode || 'XX',
            city: data.city || data.locality || 'Unknown',
            timestamp: Date.now(),
          });
        } catch {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            country: 'Unknown',
            country_code: 'XX',
            city: 'Unknown',
            timestamp: Date.now(),
          });
        }
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

function countriesMismatch(a?: LocationData | null, b?: LocationData | null): boolean {
  if (!a || !b) return false;
  if (a.country_code === 'XX' || b.country_code === 'XX') return false;
  return a.country_code !== b.country_code;
}

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(() => {
    try {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vpnStatus, setVpnStatus] = useState<VPNStatus>({ detected: false, dismissed: false });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toast } = useToast();

  const resolveLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Run both GPS and IP lookup in parallel
    const [gps, ip] = await Promise.all([getGPSLocation(), fetchIPLocation()]);

    // Prefer GPS, fall back to IP
    const best = gps || ip;

    if (best) {
      setLocation(best);
      localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(best));
    } else {
      setError('Could not determine your location');
    }

    // VPN detection: GPS country ≠ IP country
    if (countriesMismatch(gps, ip)) {
      setVpnStatus((prev) => ({
        detected: true,
        gpsLocation: gps!,
        ipLocation: ip!,
        dismissed: prev.dismissed,
      }));
    } else {
      setVpnStatus((prev) => ({ ...prev, detected: false }));
    }

    setIsLoading(false);
    setIsTracking(true);
  }, []);

  const dismissVPNWarning = useCallback(() => {
    setVpnStatus((prev) => ({ ...prev, dismissed: true }));
  }, []);

  // Initial load + interval
  useEffect(() => {
    resolveLocation();
    intervalRef.current = setInterval(resolveLocation, LOCATION_REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resolveLocation]);

  // Show VPN toast when first detected
  useEffect(() => {
    if (vpnStatus.detected && !vpnStatus.dismissed) {
      toast({
        title: '🛡️ VPN Detected',
        description: `Your GPS says ${vpnStatus.gpsLocation?.country} but your IP says ${vpnStatus.ipLocation?.country}. For accurate travel tracking, consider disabling your VPN temporarily.`,
        variant: 'destructive',
        duration: 12000,
      });
    }
  }, [vpnStatus.detected, vpnStatus.dismissed]);

  return (
    <LocationContext.Provider
      value={{
        location,
        isTracking,
        isLoading,
        vpnStatus,
        error,
        refreshLocation: resolveLocation,
        dismissVPNWarning,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
};
