
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Country } from '@/types/country';

interface AddCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (country: Omit<Country, 'id' | 'daysSpent' | 'lastUpdate'>) => void;
  existingCountries: Country[];
}

const POPULAR_COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
];

const COMMON_REASONS = [
  'Tourist visa limit',
  'Tax residence rules',
  'Work permit limit',
  'Schengen area limit',
  'Business travel limit',
  'Student visa limit',
  'Custom tracking'
];

const PRESET_LIMITS = {
  'Tourist visa limit': 90,
  'Schengen area limit': 90,
  'Tax residence rules': 183,
  'Work permit limit': 365,
  'Business travel limit': 30,
  'Student visa limit': 365,
  'Custom tracking': 30
};

const AddCountryModal: React.FC<AddCountryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingCountries
}) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [customCountryName, setCustomCountryName] = useState('');
  const [customCountryFlag, setCustomCountryFlag] = useState('');
  const [dayLimit, setDayLimit] = useState('90');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const availableCountries = POPULAR_COUNTRIES.filter(
    country => !existingCountries.some(existing => existing.code === country.code)
  );

  const handleReasonChange = (value: string) => {
    setReason(value);
    if (value !== 'Custom tracking' && PRESET_LIMITS[value as keyof typeof PRESET_LIMITS]) {
      setDayLimit(PRESET_LIMITS[value as keyof typeof PRESET_LIMITS].toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let countryData;
    if (selectedCountry) {
      const country = POPULAR_COUNTRIES.find(c => c.code === selectedCountry);
      if (!country) return;
      
      countryData = {
        code: country.code,
        name: country.name,
        flag: country.flag,
      };
    } else {
      if (!customCountryName.trim()) return;
      
      countryData = {
        code: customCountryName.toUpperCase().replace(/\s+/g, '_'),
        name: customCountryName.trim(),
        flag: customCountryFlag || '🌍',
      };
    }

    const finalReason = reason === 'Custom tracking' ? customReason : reason;
    
    onAdd({
      ...countryData,
      dayLimit: parseInt(dayLimit) || 30,
      reason: finalReason || 'General tracking'
    });

    // Reset form
    setSelectedCountry('');
    setCustomCountryName('');
    setCustomCountryFlag('');
    setDayLimit('90');
    setReason('');
    setCustomReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Country to Track</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Select Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a country..." />
              </SelectTrigger>
              <SelectContent>
                {availableCountries.map(country => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!selectedCountry && (
            <>
              <div className="text-center text-sm text-muted-foreground">or</div>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <Label htmlFor="flag">Flag</Label>
                  <Input
                    id="flag"
                    value={customCountryFlag}
                    onChange={(e) => setCustomCountryFlag(e.target.value)}
                    placeholder="🌍"
                    maxLength={2}
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor="customCountry">Custom Country</Label>
                  <Input
                    id="customCountry"
                    value={customCountryName}
                    onChange={(e) => setCustomCountryName(e.target.value)}
                    placeholder="Enter country name..."
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Tracking Reason</Label>
            <Select value={reason} onValueChange={handleReasonChange}>
              <SelectTrigger>
                <SelectValue placeholder="Why are you tracking this?" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_REASONS.map(reasonOption => (
                  <SelectItem key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason === 'Custom tracking' && (
            <div className="space-y-2">
              <Label htmlFor="customReason">Custom Reason</Label>
              <Input
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter your reason..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dayLimit">Day Limit</Label>
            <Input
              id="dayLimit"
              type="number"
              min="1"
              value={dayLimit}
              onChange={(e) => setDayLimit(e.target.value)}
              placeholder="Number of days allowed"
            />
            <p className="text-xs text-muted-foreground">
              Maximum days allowed in this country for your tracking period
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gradient-success text-white hover:opacity-90"
              disabled={!selectedCountry && !customCountryName.trim()}
            >
              Add Country
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCountryModal;
