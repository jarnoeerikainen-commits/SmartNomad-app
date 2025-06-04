
import { LocationData } from '@/types/country';

class LocationService {
  private static instance: LocationService;
  private watchId: number | null = null;
  private currentPosition: GeolocationPosition | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    try {
      // Test if we can get position
      await this.getCurrentPosition();
      return true;
    } catch (error) {
      console.error('Location permission denied:', error);
      return false;
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = position;
          resolve(position);
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  async getCurrentLocation(): Promise<LocationData> {
    try {
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding to get country information
      const locationData = await this.reverseGeocode(latitude, longitude);
      
      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  private async reverseGeocode(lat: number, lon: number): Promise<LocationData> {
    try {
      // Using a free geocoding service (in production, you might want to use a more reliable service)
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
      // Fallback data
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

  startLocationTracking(callback: (location: LocationData) => void): void {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported');
    }

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationData = await this.reverseGeocode(latitude, longitude);
          callback(locationData);
        } catch (error) {
          console.error('Error in location tracking:', error);
        }
      },
      (error) => {
        console.error('Location tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  }

  stopLocationTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}

export default LocationService.getInstance();
