import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { SecurityFilters as SecurityFiltersType } from '@/types/securityServices';
import { CITIES, COUNTRIES, SERVICE_TYPES, REGIONS } from '@/data/securityServicesData';
import { Filter, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface SecurityFiltersProps {
  filters: SecurityFiltersType;
  onFilterChange: (key: keyof SecurityFiltersType, value: any) => void;
  onClearFilters: () => void;
}

const SecurityFilters: React.FC<SecurityFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const getServiceTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['location', 'service', 'pricing']} className="space-y-2">
        {/* Search */}
        <div className="space-y-2 pb-4">
          <Label>Search</Label>
          <Input
            placeholder="Search by name or service..."
            value={filters.query || ''}
            onChange={(e) => onFilterChange('query', e.target.value)}
          />
        </div>

        {/* Location Filters */}
        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <div className="space-y-2">
              <Label>Region</Label>
              <Select
                value={filters.region || 'all'}
                onValueChange={(value) => onFilterChange('region', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {Object.keys(REGIONS).map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>City</Label>
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

            <div className="space-y-2">
              <Label>Country</Label>
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
          </AccordionContent>
        </AccordionItem>

        {/* Service Type */}
        <AccordionItem value="service">
          <AccordionTrigger>Service Type</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <Select
              value={filters.serviceType || 'all'}
              onValueChange={(value) => onFilterChange('serviceType', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {SERVICE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getServiceTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Label>Coverage</Label>
              <Select
                value={filters.coverage || 'all'}
                onValueChange={(value) => onFilterChange('coverage', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Coverage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Coverage</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Pricing */}
        <AccordionItem value="pricing">
          <AccordionTrigger>Pricing & Rating</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Max Daily Rate</Label>
                <span className="text-sm text-muted-foreground">
                  ${filters.maxDailyRate?.toLocaleString() || '10,000+'}
                </span>
              </div>
              <Slider
                value={[filters.maxDailyRate || 10000]}
                onValueChange={([value]) => onFilterChange('maxDailyRate', value)}
                min={500}
                max={10000}
                step={500}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Minimum Rating</Label>
                <span className="text-sm text-muted-foreground">
                  {filters.minRating || '0.0'}+
                </span>
              </div>
              <Slider
                value={[filters.minRating || 0]}
                onValueChange={([value]) => onFilterChange('minRating', value)}
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Requirements */}
        <AccordionItem value="requirements">
          <AccordionTrigger>Requirements</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="expat"
                checked={filters.requiresExpatSpecialist || false}
                onCheckedChange={(checked) => onFilterChange('requiresExpatSpecialist', checked)}
              />
              <label
                htmlFor="expat"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Expat Specialist
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="response"
                checked={filters.requires24Response || false}
                onCheckedChange={(checked) => onFilterChange('requires24Response', checked)}
              />
              <label
                htmlFor="response"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                24/7 Emergency Response
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default SecurityFilters;
