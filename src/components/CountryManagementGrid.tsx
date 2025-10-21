import React from 'react';
import CountryCard from './CountryCard';
import { Country } from '@/types/country';

interface CountryManagementGridProps {
  countries: Country[];
  currentLocation?: { country_code: string } | null;
  onRemove: (id: string) => void;
  onUpdateLimit: (id: string, newLimit: number) => void;
  onReset: (id: string) => void;
  onToggleCountDays: (id: string) => void;
  onUpdateSettings: (id: string, settings: {
    countingMode: 'days' | 'nights';
    partialDayRule: 'full' | 'half' | 'exclude';
    countArrivalDay: boolean;
    countDepartureDay: boolean;
  }) => void;
}

export const CountryManagementGrid: React.FC<CountryManagementGridProps> = ({
  countries,
  currentLocation,
  onRemove,
  onUpdateLimit,
  onReset,
  onToggleCountDays,
  onUpdateSettings
}) => {
  if (countries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No countries tracked yet</p>
        <p className="text-sm mt-2">Add a country to start tracking your travel days</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {countries.map((country) => (
        <CountryCard
          key={country.id}
          country={country}
          isCurrentLocation={currentLocation?.country_code === country.code}
          onRemove={onRemove}
          onUpdateLimit={onUpdateLimit}
          onReset={onReset}
          onToggleCountDays={onToggleCountDays}
          onUpdateSettings={onUpdateSettings}
        />
      ))}
    </div>
  );
};
