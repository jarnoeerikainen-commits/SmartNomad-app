import { useMemo, useState } from 'react';
import { securityServices, REGIONS } from '@/data/securityServicesData';
import { SecurityService, SecurityFilters, SecurityType } from '@/types/securityServices';

export const useSecuritySearch = () => {
  const [filters, setFilters] = useState<SecurityFilters>({});

  const filteredServices = useMemo(() => {
    return securityServices.filter((service: SecurityService) => {
      // Text search
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesDescription = service.description.toLowerCase().includes(query);
        const matchesServices = service.services.some(s => s.toLowerCase().includes(query));
        if (!matchesName && !matchesDescription && !matchesServices) return false;
      }

      // City filter
      if (filters.city && !service.cities.includes(filters.city) && !service.cities.includes('Global Coverage')) {
        return false;
      }

      // Country filter
      if (filters.country && !service.countries.includes(filters.country) && !service.countries.includes('Global Coverage')) {
        return false;
      }

      // Region filter
      if (filters.region) {
        const regionCountries = REGIONS[filters.region as keyof typeof REGIONS] || [];
        const hasRegionCountry = service.countries.some(c => regionCountries.includes(c) || c === 'Global Coverage');
        if (!hasRegionCountry) return false;
      }

      // Service type filter
      if (filters.serviceType && !service.type.includes(filters.serviceType)) {
        return false;
      }

      // Coverage filter
      if (filters.coverage && service.coverage !== filters.coverage) {
        return false;
      }

      // Max daily rate filter
      if (filters.maxDailyRate && service.pricing.daily > filters.maxDailyRate) {
        return false;
      }

      // Min rating filter
      if (filters.minRating && service.rating.overall < filters.minRating) {
        return false;
      }

      // Expat specialist filter
      if (filters.requiresExpatSpecialist && !service.verification.expatSpecialist) {
        return false;
      }

      // 24/7 response filter
      if (filters.requires24Response && !service.responseTime.toLowerCase().includes('24/7')) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const updateFilter = (key: keyof SecurityFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  // Group services by city
  const servicesByCity = useMemo(() => {
    const grouped: Record<string, SecurityService[]> = {};
    
    filteredServices.forEach(service => {
      service.cities.forEach(city => {
        if (!grouped[city]) {
          grouped[city] = [];
        }
        grouped[city].push(service);
      });
    });

    return Object.entries(grouped)
      .sort(([cityA], [cityB]) => {
        if (cityA === 'Global Coverage') return -1;
        if (cityB === 'Global Coverage') return 1;
        return cityA.localeCompare(cityB);
      });
  }, [filteredServices]);

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredServices,
    servicesByCity,
    totalServices: securityServices.length,
    filteredCount: filteredServices.length
  };
};
