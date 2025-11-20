import { FamilyServiceFilters, ServiceType } from '@/types/familyServices';
import { CITIES, COUNTRIES, LANGUAGES, SERVICE_TYPES } from '@/data/familyServicesData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, SlidersHorizontal } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ServiceFiltersProps {
  filters: FamilyServiceFilters;
  onFilterChange: (key: keyof FamilyServiceFilters, value: any) => void;
  onClearFilters: () => void;
}

export const ServiceFilters = ({ filters, onFilterChange, onClearFilters }: ServiceFiltersProps) => {
  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== null).length;

  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['location', 'service', 'pricing']} className="w-full">
        {/* Location Filters */}
        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-3">
            <div className="space-y-2">
              <Label>City</Label>
              <Select
                value={filters.city || 'all'}
                onValueChange={(value) => onFilterChange('city', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
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

            <div className="space-y-2">
              <Label>Country</Label>
              <Select
                value={filters.country || 'all'}
                onValueChange={(value) => onFilterChange('country', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
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

            <div className="space-y-2">
              <Label>Region</Label>
              <Select
                value={filters.region || 'all'}
                onValueChange={(value) => onFilterChange('region', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                  <SelectItem value="Middle East">Middle East</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Service Type */}
        <AccordionItem value="service">
          <AccordionTrigger>Service Type</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-3">
            <div className="space-y-2">
              <Label>Type of Service</Label>
              <Select
                value={filters.serviceType || 'all'}
                onValueChange={(value) => onFilterChange('serviceType', value === 'all' ? undefined : value as ServiceType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Pricing */}
        <AccordionItem value="pricing">
          <AccordionTrigger>Pricing</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-3">
            <div className="space-y-2">
              <Label>Maximum Monthly Rate: ${filters.maxMonthlyPrice || 5000}</Label>
              <Slider
                value={[filters.maxMonthlyPrice || 5000]}
                onValueChange={([value]) => onFilterChange('maxMonthlyPrice', value)}
                max={5000}
                min={1000}
                step={250}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$1,000</span>
                <span>$5,000</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Verification & Requirements */}
        <AccordionItem value="verification">
          <AccordionTrigger>Verification & Requirements</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-3">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="backgroundCheck"
                  checked={filters.verificationRequired || false}
                  onCheckedChange={(checked) => 
                    onFilterChange('verificationRequired', checked === true)
                  }
                />
                <label
                  htmlFor="backgroundCheck"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Background Checked
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="expatExp"
                  checked={filters.expatExperience || false}
                  onCheckedChange={(checked) => 
                    onFilterChange('expatExperience', checked === true)
                  }
                />
                <label
                  htmlFor="expatExp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Expat Experience Required
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergency"
                  checked={filters.emergencyTrained || false}
                  onCheckedChange={(checked) => 
                    onFilterChange('emergencyTrained', checked === true)
                  }
                />
                <label
                  htmlFor="emergency"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Emergency Trained
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger>Minimum Rating</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-3">
            <Select
              value={filters.minRating?.toString() || 'all'}
              onValueChange={(value) => 
                onFilterChange('minRating', value === 'all' ? undefined : parseFloat(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4.0">4.0+ Stars</SelectItem>
                <SelectItem value="3.5">3.5+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
