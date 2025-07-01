
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';
import { LocationData } from '@/types/country';

interface VPNDetectionInfo {
  isVPNActive: boolean;
  vpnDuration: number;
  realLocation?: LocationData;
}

class EnhancedLocationService {
  private trackingInterval: NodeJS.Timeout | null = null;
  private onLocationUpdate: ((location: LocationData, vpnInfo?: VPNDetectionInfo) => void) | null = null;

  async requestBackgroundPermissions(): Promise<boolean> {
    try {
      // Check if we're running on web
      const deviceInfo = await Device.getInfo();
      if (deviceInfo.platform === 'web') {
        // For web, use standard geolocation API
        return new Promise((resolve) => {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              () => resolve(true),
              () => resolve(false),
              { timeout: 10000 }
            );
          } else {
            resolve(false);
          }
        });
      }

      // For mobile platforms, use Capacitor
      const permissions = await Geolocation.requestPermissions();
      return permissions.location === 'granted';
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async startBackgroundTracking(callback: (location: LocationData, vpnInfo?: VPNDetectionInfo) => void): Promise<void> {
    this.onLocationUpdate = callback;
    
    try {
      const deviceInfo = await Device.getInfo();
      
      if (deviceInfo.platform === 'web') {
        // For web, use standard geolocation with periodic updates
        this.trackingInterval = setInterval(async () => {
          try {
            const position = await this.getCurrentLocationWeb();
            if (position && this.onLocationUpdate) {
              this.onLocationUpdate(position);
            }
          } catch (error) {
            console.error('Location tracking error:', error);
          }
        }, 60000); // Update every minute
      } else {
        // For mobile, use Capacitor geolocation
        this.trackingInterval = setInterval(async () => {
          try {
            const position = await Geolocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 10000
            });
            
            const locationData = await this.reverseGeocode(position.coords.latitude, position.coords.longitude);
            if (locationData && this.onLocationUpdate) {
              this.onLocationUpdate(locationData);
            }
          } catch (error) {
            console.error('Location tracking error:', error);
          }
        }, 60000);
      }
    } catch (error) {
      console.error('Failed to start background tracking:', error);
      throw error;
    }
  }

  private async getCurrentLocationWeb(): Promise<LocationData | null> {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const locationData = await this.reverseGeocode(position.coords.latitude, position.coords.longitude);
            resolve(locationData);
          },
          (error) => {
            console.error('Geolocation error:', error);
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        resolve(null);
      }
    });
  }

  private async reverseGeocode(lat: number, lon: number): Promise<LocationData | null> {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
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
      return null;
    }
  }

  stopBackgroundTracking(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    this.onLocationUpdate = null;
  }

  async detectVPN(): Promise<VPNDetectionInfo> {
    // Basic VPN detection (simplified for web)
    return {
      isVPNActive: false,
      vpnDuration: 0
    };
  }
}

export default new EnhancedLocationService();
