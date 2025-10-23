import { CITIES, OFFICE_PROVIDERS } from '@/data/remoteOfficesData';
import { City, OfficeProvider, OfficeFilters } from '@/types/remoteOffices';

class RemoteOfficesService {
  private static instance: RemoteOfficesService;

  static getInstance(): RemoteOfficesService {
    if (!RemoteOfficesService.instance) {
      RemoteOfficesService.instance = new RemoteOfficesService();
    }
    return RemoteOfficesService.instance;
  }

  getAllCities(): City[] {
    return CITIES;
  }

  getCityById(cityId: string): City | undefined {
    return CITIES.find(city => city.id === cityId);
  }

  searchCities(query: string): City[] {
    const lowerQuery = query.toLowerCase();
    return CITIES.filter(city =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
    );
  }

  findNearestCity(lat: number, lng: number): City | null {
    if (CITIES.length === 0) return null;

    let nearest = CITIES[0];
    let minDistance = this.calculateDistance(lat, lng, nearest.coordinates.lat, nearest.coordinates.lng);

    for (const city of CITIES) {
      const distance = this.calculateDistance(lat, lng, city.coordinates.lat, city.coordinates.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = city;
      }
    }

    return nearest;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getProvidersByCity(cityId: string, filters?: OfficeFilters): OfficeProvider[] {
    let providers = OFFICE_PROVIDERS.filter(provider =>
      provider.cities.includes(cityId)
    );

    if (filters) {
      if (filters.minRating) {
        providers = providers.filter(p => p.rating >= filters.minRating!);
      }

      if (filters.bookingType) {
        providers = providers.filter(p =>
          p.bookingTypes.includes(filters.bookingType!)
        );
      }

      if (filters.maxPrice && filters.bookingType) {
        providers = providers.filter(p => {
          const price = p.priceRange[filters.bookingType!];
          return price !== undefined && price <= filters.maxPrice!;
        });
      }

      if (filters.amenities && filters.amenities.length > 0) {
        providers = providers.filter(p =>
          filters.amenities!.every(amenity => p.amenities.includes(amenity))
        );
      }
    }

    return providers.sort((a, b) => b.rating - a.rating);
  }

  getAllProviders(filters?: OfficeFilters): OfficeProvider[] {
    let providers = [...OFFICE_PROVIDERS];

    if (filters) {
      if (filters.minRating) {
        providers = providers.filter(p => p.rating >= filters.minRating!);
      }

      if (filters.bookingType) {
        providers = providers.filter(p =>
          p.bookingTypes.includes(filters.bookingType!)
        );
      }

      if (filters.amenities && filters.amenities.length > 0) {
        providers = providers.filter(p =>
          filters.amenities!.every(amenity => p.amenities.includes(amenity))
        );
      }
    }

    return providers.sort((a, b) => b.rating - a.rating);
  }

  getPopularCities(limit: number = 10): City[] {
    const cityPopularity = new Map<string, number>();

    OFFICE_PROVIDERS.forEach(provider => {
      provider.cities.forEach(cityId => {
        cityPopularity.set(cityId, (cityPopularity.get(cityId) || 0) + 1);
      });
    });

    const sortedCities = Array.from(cityPopularity.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([cityId]) => this.getCityById(cityId))
      .filter((city): city is City => city !== undefined);

    return sortedCities;
  }
}

export default RemoteOfficesService.getInstance();
