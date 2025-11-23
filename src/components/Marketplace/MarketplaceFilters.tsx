import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MarketplaceFilters as Filters, ItemCategory, ItemCondition, Urgency } from '@/types/marketplace';
import { CATEGORY_INFO, CONDITION_INFO } from '@/types/marketplace';

interface MarketplaceFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const handleConditionToggle = (condition: ItemCondition) => {
    const current = filters.condition || [];
    const updated = current.includes(condition)
      ? current.filter(c => c !== condition)
      : [...current, condition];
    onFilterChange({ condition: updated });
  };

  const handleUrgencyToggle = (urgency: Urgency) => {
    const current = filters.urgency || [];
    const updated = current.includes(urgency)
      ? current.filter(u => u !== urgency)
      : [...current, urgency];
    onFilterChange({ urgency: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select 
          value={filters.category || ''} 
          onValueChange={(val) => onFilterChange({ category: val as ItemCategory || undefined })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All categories</SelectItem>
            {Object.entries(CATEGORY_INFO).map(([key, info]) => (
              <SelectItem key={key} value={key}>
                {info.emoji} {info.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Price Range (EUR)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ minPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label>Condition</Label>
        <div className="space-y-2">
          {Object.entries(CONDITION_INFO).map(([key, info]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${key}`}
                checked={filters.condition?.includes(key as ItemCondition)}
                onCheckedChange={() => handleConditionToggle(key as ItemCondition)}
              />
              <label
                htmlFor={`condition-${key}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {info.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Urgency */}
      <div className="space-y-2">
        <Label>Urgency</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgency-flexible"
              checked={filters.urgency?.includes('flexible')}
              onCheckedChange={() => handleUrgencyToggle('flexible')}
            />
            <label htmlFor="urgency-flexible" className="text-sm cursor-pointer">
              Flexible
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgency-moderate"
              checked={filters.urgency?.includes('moderate')}
              onCheckedChange={() => handleUrgencyToggle('moderate')}
            />
            <label htmlFor="urgency-moderate" className="text-sm cursor-pointer">
              Moderate
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgency-urgent"
              checked={filters.urgency?.includes('urgent')}
              onCheckedChange={() => handleUrgencyToggle('urgent')}
            />
            <label htmlFor="urgency-urgent" className="text-sm cursor-pointer">
              🔥 Urgent
            </label>
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select 
          value={filters.sortBy || 'recent'} 
          onValueChange={(val) => onFilterChange({ sortBy: val as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="ai-match">🤖 AI Recommended</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
