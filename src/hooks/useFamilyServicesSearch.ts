import { useState, useMemo } from 'react';
import { FamilyService, FamilyServiceFilters, ServiceType } from '@/types/familyServices';
import { FAMILY_SERVICES } from '@/data/familyServicesData';

export const useFamilyServicesSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FamilyServiceFilters>({});

  const filteredServices = useMemo(() => {
    let results = FAMILY_SERVICES;

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        service =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.cities.some(city => city.toLowerCase().includes(query)) ||
          service.countries.some(country => country.toLowerCase().includes(query))
      );
    }

    // City filter
    if (filters.city) {
      results = results.filter(service => 
        service.cities.includes(filters.city!) || service.cities.includes('Global Coverage')
      );
    }

    // Country filter
    if (filters.country) {
      results = results.filter(service => 
        service.countries.includes(filters.country!) || service.countries.includes('Global')
      );
    }

    // Region filter
    if (filters.region) {
      results = results.filter(service =>
        service.countries.some(country => 
          filters.region === 'Global' ? country === 'Global' : 
          // Match countries to regions
          (filters.region === 'North America' && ['United States', 'Canada'].includes(country)) ||
          (filters.region === 'Europe' && ['United Kingdom', 'France', 'Belgium', 'Germany', 'Spain', 'Italy'].includes(country)) ||
          (filters.region === 'Asia Pacific' && ['Singapore', 'Hong Kong', 'Japan', 'Australia'].includes(country)) ||
          (filters.region === 'Middle East' && ['United Arab Emirates', 'Qatar', 'Saudi Arabia'].includes(country))
        )
      );
    }

    // Service type filter
    if (filters.serviceType) {
      results = results.filter(service => 
        service.type.includes(filters.serviceType as ServiceType)
      );
    }

    // Price filter
    if (filters.maxMonthlyPrice) {
      results = results.filter(service => service.pricing.monthly <= filters.maxMonthlyPrice!);
    }

    // Language filter
    if (filters.languages && filters.languages.length > 0) {
      results = results.filter(service =>
        filters.languages!.some(lang => service.languages.includes(lang))
      );
    }

    // Verification filters
    if (filters.verificationRequired) {
      results = results.filter(service => 
        service.verification.backgroundChecks && 
        service.verification.referenceChecked
      );
    }

    if (filters.expatExperience) {
      results = results.filter(service => service.verification.expatExperience);
    }

    if (filters.emergencyTrained) {
      results = results.filter(service => service.verification.emergencyTrained);
    }

    // Rating filter
    if (filters.minRating) {
      results = results.filter(service => service.rating.overall >= filters.minRating!);
    }

    return results;
  }, [searchQuery, filters]);

  const updateFilter = (key: keyof FamilyServiceFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilters,
    filteredServices,
    totalServices: FAMILY_SERVICES.length
  };
};
