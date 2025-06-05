
import { Geolocation } from '@capacitor/geolocation';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import { LocationData } from '@/types/country';

interface VPNDetectionResult {
  isVPNActive: boolean;
  realLocation?: LocationData;
  vpnDuration: number;
}

class EnhancedLocationService {
  private static instance: EnhancedLocationService;
  private backgroundWatchId: string | null = null;
  private hourlyIntervalId: number | null = null;
  private vpnDetectionStartTime: number | null = null;
  private lastKnownRealLocation: LocationData | null = null;
  private isTrackingBackground = false;

  static getInstance(): EnhancedLocationService {
    if (!EnhancedLocationService.instance) {
      EnhancedLocationService.instance = new EnhancedLocationService();
    }
    return EnhancedLocationService.instance;
  }

  async requestBackgroundPermissions(): Promise<boolean> {
    try {
      const permissions = await Geolocation.requestPermissions({
        permissions: ['location', 'coarseLocation']
      });
      
      if (permissions.location === 'granted' || permissions.coarseLocation === 'granted') {
        console.log('Location permissions granted');
        return true;
      } else {
        console.log('Location permissions denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async detectVPN(): Promise<VPNDetectionResult> {
    try {
      // Get network info - with fallback for web
      let networkStatus = null;
      try {
        networkStatus = await Network.getStatus();
      } catch (error) {
        console.log('Network API not available in web environment');
      }
      
      // Get device info - with fallback for web
      let deviceInfo = null;
      try {
        deviceInfo = await Device.getInfo();
      } catch (error) {
        console.log('Device API not available in web environment');
      }
      
      // Get current location
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      // Simple VPN detection methods
      const isVPNActive = await this.checkForVPNIndicators(position, networkStatus);
      
      if (isVPNActive) {
        const vpnDuration = this.vpnDetectionStartTime 
          ? Date.now() - this.vpnDetectionStartTime 
          : 0;

        return {
          isVPNActive: true,
          vpnDuration,
          realLocation: this.lastKnownRealLocation || undefined
        };
      } else {
        // Reset VPN timer if no VPN detected
        this.vpnDetectionStartTime = null;
        
        const locationData = await this.reverseGeocode(
          position.coords.latitude, 
          position.coords.longitude
        );
        
        this.lastKnownRealLocation = locationData;
        
        return {
          isVPNActive: false,
          realLocation: locationData,
          vpnDuration: 0
        };
      }
    } catch (error) {
      console.error('VPN detection failed:', error);
      return {
        isVPNActive: false,
        vpnDuration: 0
      };
    }
  }

  private async checkForVPNIndicators(position: any, networkStatus: any): Promise<boolean> {
    try {
      // Method 1: Check if location jumps dramatically
      if (this.lastKnownRealLocation) {
        const distance = this.calculateDistance(
          this.lastKnownRealLocation.latitude,
          this.lastKnownRealLocation.longitude,
          position.coords.latitude,
          position.coords.longitude
        );
        
        // If location jumped more than 1000km in short time, likely VPN
        if (distance > 1000) {
          if (!this.vpnDetectionStartTime) {
            this.vpnDetectionStartTime = Date.now();
          }
          return true;
        }
      }

      // Method 2: Check timezone vs GPS location
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locationData = await this.reverseGeocode(
        position.coords.latitude, 
        position.coords.longitude
      );
      
      // Basic timezone mismatch check (this is simplified)
      const isTimezoneMismatch = await this.checkTimezoneMismatch(timeZone, locationData.country);
      
      if (isTimezoneMismatch) {
        if (!this.vpnDetectionStartTime) {
          this.vpnDetectionStartTime = Date.now();
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('VPN indicator check failed:', error);
      return false;
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private async checkTimezoneMismatch(deviceTimezone: string, countryName: string): Promise<boolean> {
    // Simplified timezone check - in production, you'd use a proper timezone database
    const commonTimezones: { [key: string]: string[] } = {
      'United States': ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'],
      'Germany': ['Europe/Berlin'],
      'France': ['Europe/Paris'],
      'United Kingdom': ['Europe/London'],
      'Japan': ['Asia/Tokyo'],
      'Australia': ['Australia/Sydney', 'Australia/Melbourne'],
      // Add more as needed
    };

    const expectedTimezones = commonTimezones[countryName];
    if (expectedTimezones) {
      return !expectedTimezones.includes(deviceTimezone);
    }
    
    return false; // If we don't have timezone data, assume no mismatch
  }

  async startBackgroundTracking(callback: (location: LocationData, vpnInfo?: VPNDetectionResult) => void): Promise<void> {
    if (this.isTrackingBackground) {
      console.log('Background tracking already active');
      return;
    }

    try {
      // Request permissions first
      const hasPermissions = await this.requestBackgroundPermissions();
      if (!hasPermissions) {
        throw new Error('Background location permissions not granted');
      }

      // Start background location watching
      this.backgroundWatchId = await Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 300000 // 5 minutes
      }, async (position) => {
        if (position) {
          try {
            const locationData = await this.reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            );

            // Check for VPN
            const vpnInfo = await this.detectVPN();
            
            callback(locationData, vpnInfo);
          } catch (error) {
            console.error('Error processing background location:', error);
          }
        }
      });

      // Set up hourly checks
      this.hourlyIntervalId = window.setInterval(async () => {
        try {
          const vpnInfo = await this.detectVPN();
          if (vpnInfo.realLocation) {
            callback(vpnInfo.realLocation, vpnInfo);
          }
        } catch (error) {
          console.error('Hourly location check failed:', error);
        }
      }, 60 * 60 * 1000); // Every hour

      this.isTrackingBackground = true;
      console.log('Background tracking started');
    } catch (error) {
      console.error('Failed to start background tracking:', error);
      throw error;
    }
  }

  async stopBackgroundTracking(): Promise<void> {
    if (this.backgroundWatchId) {
      await Geolocation.clearWatch({ id: this.backgroundWatchId });
      this.backgroundWatchId = null;
    }

    if (this.hourlyIntervalId) {
      clearInterval(this.hourlyIntervalId);
      this.hourlyIntervalId = null;
    }

    this.isTrackingBackground = false;
    console.log('Background tracking stopped');
  }

  async getCurrentLocationWithCellData(): Promise<LocationData> {
    try {
      // Try to get high accuracy location with network assistance
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000 // 1 minute
      });

      const locationData = await this.reverseGeocode(
        position.coords.latitude,
        position.coords.longitude
      );

      // Check for VPN
      const vpnInfo = await this.detectVPN();
      if (vpnInfo.isVPNActive && vpnInfo.realLocation) {
        return vpnInfo.realLocation;
      }

      return locationData;
    } catch (error) {
      console.error('Error getting current location with cell data:', error);
      throw error;
    }
  }

  private async reverseGeocode(lat: number, lon: number): Promise<LocationData> {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      return {
        latitude: lat,
        longitude: lon,
        country: data.countryName || 'Unknown',
        country_code: data.countryCode || 'XX',
        city: data.city || data.locality || 'Unknown',
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return {
        latitude: lat,
        longitude: lon,
        country: 'Unknown Location',
        country_code: 'XX',
        city: 'Unknown',
        timestamp: Date.now()
      };
    }
  }

  isBackgroundTrackingActive(): boolean {
    return this.isTrackingBackground;
  }
}

export default EnhancedLocationService.getInstance();
