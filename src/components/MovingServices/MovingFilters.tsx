import { MovingFilters as FiltersType } from '@/types/movingServices';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface MovingFiltersProps {
  filters: FiltersType;
  onApplyFilters: (filters: FiltersType) => void;
  onClearFilters: () => void;
}

export function MovingFilters({ filters, onApplyFilters, onClearFilters }: MovingFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FiltersType>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const availableServices = [
    'Packing',
    'Unpacking',
    'Insurance',
    'Storage',
    'Vehicle transport',
    'Pet relocation',
    'Furniture assembly'
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="minRating">Minimum Rating</Label>
            <Select
              value={localFilters.minRating?.toString()}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, minRating: parseFloat(value) }))}
            >
              <SelectTrigger id="minRating">
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any rating</SelectItem>
                <SelectItem value="4.0">4.0+ stars</SelectItem>
                <SelectItem value="4.5">4.5+ stars</SelectItem>
                <SelectItem value="4.7">4.7+ stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="maxBudget">Maximum Budget (USD)</Label>
            <Input
              id="maxBudget"
              type="number"
              placeholder="e.g., 5000"
              value={localFilters.maxBudget || ''}
              onChange={(e) => setLocalFilters(prev => ({ 
                ...prev, 
                maxBudget: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
            />
          </div>

          <div>
            <Label htmlFor="urgency">Move Urgency</Label>
            <Select
              value={localFilters.urgency}
              onValueChange={(value: any) => setLocalFilters(prev => ({ ...prev, urgency: value }))}
            >
              <SelectTrigger id="urgency">
                <SelectValue placeholder="Any urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Flexible</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label className="mb-3 block">Required Services</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableServices.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={localFilters.services?.includes(service)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setLocalFilters(prev => ({
                        ...prev,
                        services: [...(prev.services || []), service]
                      }));
                    } else {
                      setLocalFilters(prev => ({
                        ...prev,
                        services: prev.services?.filter(s => s !== service)
                      }));
                    }
                  }}
                />
                <label htmlFor={service} className="text-sm cursor-pointer">
                  {service}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClearFilters}>
            Clear All
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
