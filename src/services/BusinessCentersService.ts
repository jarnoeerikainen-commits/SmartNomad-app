import { BusinessCenter, BusinessCenterFilters, ServiceType } from '@/types/businessCenter';
import { BUSINESS_CENTERS, BUSINESS_CENTER_CITIES } from '@/data/businessCentersData';

class BusinessCentersService {
  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  // Get all cities
  getCities() {
    return BUSINESS_CENTER_CITIES;
  }

  // Get cities by country
  getCitiesByCountry(countryCode: string) {
    return BUSINESS_CENTER_CITIES.filter(city => city.countryCode === countryCode);
  }

  // Get unique countries
  getCountries() {
    const uniqueCountries = new Map<string, { name: string; code: string }>();
    BUSINESS_CENTER_CITIES.forEach(city => {
      if (!uniqueCountries.has(city.countryCode)) {
        uniqueCountries.set(city.countryCode, {
          name: city.country,
          code: city.countryCode,
        });
      }
    });
    return Array.from(uniqueCountries.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  // Find nearest city to user location
  findNearestCity(userLat: number, userLng: number) {
    let nearestCity = BUSINESS_CENTER_CITIES[0];
    let minDistance = this.calculateDistance(
      userLat,
      userLng,
      nearestCity.coordinates.lat,
      nearestCity.coordinates.lng
    );

    BUSINESS_CENTER_CITIES.forEach(city => {
      const distance = this.calculateDistance(
        userLat,
        userLng,
        city.coordinates.lat,
        city.coordinates.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    });

    return nearestCity;
  }

  // Search and filter business centers
  searchBusinessCenters(filters: BusinessCenterFilters): BusinessCenter[] {
    let results = [...BUSINESS_CENTERS];

    // Filter by city
    if (filters.cityId) {
      results = results.filter(center => center.cityId === filters.cityId);
    }

    // Filter by country
    if (filters.countryCode && !filters.cityId) {
      results = results.filter(center => center.countryCode === filters.countryCode);
    }

    // Filter by services
    if (filters.services && filters.services.length > 0) {
      results = results.filter(center =>
        filters.services!.every(service => center.services.includes(service))
      );
    }

    // Filter by minimum rating
    if (filters.minRating) {
      results = results.filter(center => center.rating >= filters.minRating!);
    }

    // Add distance to user location if provided
    const centersWithDistance = results.map(center => ({
      ...center,
      distance: filters.userLocation
        ? this.calculateDistance(
            filters.userLocation.lat,
            filters.userLocation.lng,
            center.coordinates.lat,
            center.coordinates.lng
          )
        : undefined,
    }));

    // Sort results
    if (filters.sortBy === 'proximity' && filters.userLocation) {
      centersWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (filters.sortBy === 'rating') {
      centersWithDistance.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'reviews') {
      centersWithDistance.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return centersWithDistance;
  }

  // Get business centers for a specific city
  getBusinessCentersByCity(cityId: string): BusinessCenter[] {
    return BUSINESS_CENTERS.filter(center => center.cityId === cityId);
  }

  // Get all unique services available
  getAvailableServices(): ServiceType[] {
    const services = new Set<ServiceType>();
    BUSINESS_CENTERS.forEach(center => {
      center.services.forEach(service => services.add(service));
    });
    return Array.from(services);
  }
}

export default new BusinessCentersService();
