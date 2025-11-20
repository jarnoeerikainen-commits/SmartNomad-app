import { useState, useMemo } from 'react';
import { EliteClub, ClubFilters, ClubType } from '@/types/eliteClub';
import { ELITE_CLUBS } from '@/data/eliteClubsData';

export const useClubsSearch = () => {
  const [filters, setFilters] = useState<ClubFilters>({});

  const filteredClubs = useMemo(() => {
    return ELITE_CLUBS.filter(club => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          club.name.toLowerCase().includes(query) ||
          club.description.toLowerCase().includes(query) ||
          club.city.toLowerCase().includes(query) ||
          club.amenities.some(a => a.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // City filter
      if (filters.city && club.city !== filters.city) return false;

      // Country filter
      if (filters.country && club.country !== filters.country) return false;

      // Region filter
      if (filters.region && club.region !== filters.region) return false;

      // Type filter
      if (filters.type && filters.type.length > 0) {
        const hasMatchingType = filters.type.some(filterType => 
          club.type.includes(filterType)
        );
        if (!hasMatchingType) return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const annualFee = club.membership.price.annual;
        if (annualFee < filters.priceRange.min || annualFee > filters.priceRange.max) {
          return false;
        }
      }

      // Waitlist filter (max months)
      if (filters.waitlist !== undefined) {
        if (club.membership.waitlist > filters.waitlist) return false;
      }

      // Dress code filter
      if (filters.dressCode && filters.dressCode.length > 0) {
        if (!filters.dressCode.includes(club.dressCode)) return false;
      }

      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          club.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  }, [filters]);

  const updateFilter = (key: keyof ClubFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.city) count++;
    if (filters.country) count++;
    if (filters.region) count++;
    if (filters.type && filters.type.length > 0) count++;
    if (filters.priceRange) count++;
    if (filters.waitlist !== undefined) count++;
    if (filters.dressCode && filters.dressCode.length > 0) count++;
    if (filters.amenities && filters.amenities.length > 0) count++;
    return count;
  }, [filters]);

  return {
    filteredClubs,
    filters,
    updateFilter,
    clearFilters,
    activeFilterCount
  };
};
