import React from 'react';
import { ClubType, DressCode } from '@/types/eliteClub';
import { CITIES, COUNTRIES, REGIONS, ALL_AMENITIES } from '@/data/eliteClubsData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X, Filter } from 'lucide-react';

interface ClubFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

const CLUB_TYPES = Object.values(ClubType);
const DRESS_CODES: DressCode[] = ['Business Formal', 'Smart Casual', 'Formal', 'Resort', 'Casual Elegant'];

const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: 100000 },
  { label: 'Under $2,000', min: 0, max: 2000 },
  { label: '$2,000 - $5,000', min: 2000, max: 5000 },
  { label: '$5,000 - $10,000', min: 5000, max: 10000 },
  { label: '$10,000 - $20,000', min: 10000, max: 20000 },
  { label: 'Over $20,000', min: 20000, max: 100000 },
];

export const ClubFilters: React.FC<ClubFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount} active</Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="grid gap-3">
      <div>
        <Label className="text-sm mb-2 block">City</Label>
        <Select
          value={filters.city || 'all'}
          onValueChange={(value) => onFilterChange('city', value === 'all' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm mb-2 block">Country</Label>
        <Select
          value={filters.country || 'all'}
          onValueChange={(value) => onFilterChange('country', value === 'all' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm mb-2 block">Region</Label>
        <Select
          value={filters.region || 'all'}
          onValueChange={(value) => onFilterChange('region', value === 'all' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {REGIONS.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm mb-2 block">Annual Dues Range</Label>
        <Select
          value={
            filters.priceRange
              ? `${filters.priceRange.min}-${filters.priceRange.max}`
              : 'all'
          }
          onValueChange={(value) => {
            if (value === 'all') {
              onFilterChange('priceRange', undefined);
              return;
            }
            const [min, max] = value.split('-').map(Number);
            onFilterChange('priceRange', { min, max });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Price</SelectItem>
            {PRICE_RANGES.slice(1).map((range) => (
              <SelectItem
                key={range.label}
                value={`${range.min}-${range.max}`}
              >
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      </div>

      {/* Advanced Filters */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="club-types">
          <AccordionTrigger className="text-sm">Club Types</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {CLUB_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.type?.includes(type) || false}
                    onCheckedChange={(checked) => {
                      const currentTypes = filters.type || [];
                      const newTypes = checked
                        ? [...currentTypes, type]
                        : currentTypes.filter((t: ClubType) => t !== type);
                      onFilterChange('type', newTypes.length > 0 ? newTypes : undefined);
                    }}
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dress-code">
          <AccordionTrigger className="text-sm">Dress Code</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {DRESS_CODES.map((code) => (
                <div key={code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dress-${code}`}
                    checked={filters.dressCode?.includes(code) || false}
                    onCheckedChange={(checked) => {
                      const currentCodes = filters.dressCode || [];
                      const newCodes = checked
                        ? [...currentCodes, code]
                        : currentCodes.filter((c: DressCode) => c !== code);
                      onFilterChange('dressCode', newCodes.length > 0 ? newCodes : undefined);
                    }}
                  />
                  <Label
                    htmlFor={`dress-${code}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {code}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="waitlist">
          <AccordionTrigger className="text-sm">
            Maximum Waitlist
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span>Up to {filters.waitlist || 24} months</span>
                {filters.waitlist && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFilterChange('waitlist', undefined)}
                    className="h-6 px-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <Slider
                value={[filters.waitlist || 24]}
                onValueChange={([value]) => onFilterChange('waitlist', value)}
                min={0}
                max={24}
                step={3}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="amenities">
          <AccordionTrigger className="text-sm">Amenities</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2 max-h-60 overflow-y-auto">
              {ALL_AMENITIES.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={filters.amenities?.includes(amenity) || false}
                    onCheckedChange={(checked) => {
                      const currentAmenities = filters.amenities || [];
                      const newAmenities = checked
                        ? [...currentAmenities, amenity]
                        : currentAmenities.filter((a: string) => a !== amenity);
                      onFilterChange(
                        'amenities',
                        newAmenities.length > 0 ? newAmenities : undefined
                      );
                    }}
                  />
                  <Label
                    htmlFor={`amenity-${amenity}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
