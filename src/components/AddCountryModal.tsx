
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Country } from '@/types/country';

interface AddCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (country: Omit<Country, 'id' | 'daysSpent' | 'lastUpdate' | 'countTravelDays' | 'yearlyDaysSpent' | 'lastEntry' | 'totalEntries'>) => void;
  existingCountries: Country[];
}

const POPULAR_COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', taxResidenceDays: 183 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', taxResidenceDays: 183 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', taxResidenceDays: 183 },
  { code: 'FR', name: 'France', flag: '🇫🇷', taxResidenceDays: 183 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', taxResidenceDays: 183 },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', taxResidenceDays: 183 },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', taxResidenceDays: 183 },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', taxResidenceDays: 90 },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', taxResidenceDays: 183 },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', taxResidenceDays: 183 },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', taxResidenceDays: 183 },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', taxResidenceDays: 183 },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', taxResidenceDays: 183 },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', taxResidenceDays: 183 },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', taxResidenceDays: 183 },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', taxResidenceDays: 183 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', taxResidenceDays: 183 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', taxResidenceDays: 183 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', taxResidenceDays: 183 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', taxResidenceDays: 183 },
  { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', taxResidenceDays: 183 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', taxResidenceDays: 180 },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', taxResidenceDays: 182 },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', taxResidenceDays: 180 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', taxResidenceDays: 183 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', taxResidenceDays: 183 },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', taxResidenceDays: 183 },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', taxResidenceDays: 183 },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', taxResidenceDays: 183 },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', taxResidenceDays: 183 },
];

const VISA_TYPES = [
  {
    type: 'Schengen Area',
    description: 'EU Schengen zone (90 days per 180-day period)',
    defaultDays: 90,
    icon: '🇪🇺'
  },
  {
    type: 'Tourist Visa',
    description: 'Tourist/visitor visa limits',
    defaultDays: 90,
    icon: '🏖️'
  },
  {
    type: 'Student Visa',
    description: 'Academic study periods',
    defaultDays: 365,
    icon: '🎓'
  },
  {
    type: 'Business Visa',
    description: 'Business travel and meetings',
    defaultDays: 30,
    icon: '💼'
  },
  {
    type: 'Work Permit',
    description: 'Employment authorization',
    defaultDays: 365,
    icon: '🏢'
  },
  {
    type: 'Tax Residence',
    description: 'Tax residency thresholds',
    defaultDays: 183,
    icon: '📊'
  },
  {
    type: 'Digital Nomad',
    description: 'Remote work visa',
    defaultDays: 180,
    icon: '💻'
  },
  {
    type: 'Transit Visa',
    description: 'Airport/country transit',
    defaultDays: 5,
    icon: '✈️'
  },
  {
    type: 'Custom Tracking',
    description: 'Your own tracking reason',
    defaultDays: 90,
    icon: '⚙️'
  }
];

const COMMON_DAY_LIMITS = [
  { days: 5, label: '5 days', description: 'Transit visa' },
  { days: 30, label: '30 days', description: 'Short business/tourist' },
  { days: 60, label: '60 days', description: 'Extended tourist' },
  { days: 90, label: '90 days', description: 'Standard tourist/Schengen' },
  { days: 120, label: '120 days', description: 'Long tourist stay' },
  { days: 180, label: '180 days', description: 'Digital nomad/extended' },
  { days: 183, label: '183 days', description: 'Tax residence threshold' },
  { days: 365, label: '365 days', description: 'Full year (study/work)' }
];

const VISA_DAY_OPTIONS = [30, 60, 90, 120, 180];

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
  const [limitType, setLimitType] = useState<'preset' | 'custom'>('preset');

  const availableCountries = POPULAR_COUNTRIES.filter(
    country => !existingCountries.some(existing => existing.code === country.code)
  );

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    const country = POPULAR_COUNTRIES.find(c => c.code === value);
    if (country && reason === 'Tax residence tracking') {
      setDayLimit(country.taxResidenceDays.toString());
    }
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
    
    // Auto-set day limits based on visa type
    const visaType = VISA_TYPES.find(v => v.type === value);
    if (visaType) {
      if (value === 'Tax Residence' && selectedCountry) {
        const country = POPULAR_COUNTRIES.find(c => c.code === selectedCountry);
        if (country) {
          setDayLimit(country.taxResidenceDays.toString());
        }
      } else if (value === 'Schengen Area') {
        setDayLimit('90');
      } else {
        setDayLimit(visaType.defaultDays.toString());
      }
    }
  };

  const handlePresetDayLimit = (days: number) => {
    setDayLimit(days.toString());
    setLimitType('preset');
  };

  const handleCustomDayLimit = (value: string) => {
    setDayLimit(value);
    setLimitType('custom');
  };

  const getTaxResidenceInfo = (countryCode: string) => {
    const country = POPULAR_COUNTRIES.find(c => c.code === countryCode);
    if (!country) return null;
    
    return {
      days: country.taxResidenceDays,
      note: country.taxResidenceDays === 90 ? 
        'Switzerland: 90 days for foreign nationals without permits' :
        country.taxResidenceDays === 180 ?
        'Special rule: 180 days for tax residence' :
        country.taxResidenceDays === 182 ?
        'Malaysia: 182 days rule' :
        'Standard 183-day rule applies'
    };
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
    setLimitType('preset');
  };

  const selectedCountryInfo = selectedCountry ? getTaxResidenceInfo(selectedCountry) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Country to Track</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Select Country</Label>
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
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

          {selectedCountryInfo && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">Tax Residence Rule</p>
              <p className="text-sm text-blue-700">
                {selectedCountryInfo.days} days - {selectedCountryInfo.note}
              </p>
            </div>
          )}

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
            <Label htmlFor="reason">Visa/Tracking Type</Label>
            <Select value={reason} onValueChange={handleReasonChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose visa or tracking type..." />
              </SelectTrigger>
              <SelectContent>
                {VISA_TYPES.map(visaType => (
                  <SelectItem key={visaType.type} value={visaType.type}>
                    <div className="flex items-center gap-2">
                      <span>{visaType.icon}</span>
                      <div>
                        <div className="font-medium">{visaType.type}</div>
                        <div className="text-xs text-muted-foreground">{visaType.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason === 'Custom Tracking' && (
            <div className="space-y-2">
              <Label htmlFor="customReason">Custom Reason</Label>
              <Input
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter your custom tracking reason..."
              />
            </div>
          )}

          <div className="space-y-3">
            <Label>Day Limit Options</Label>
            
            {/* Common Day Limits */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Choose from common visa limits:</p>
              <div className="grid grid-cols-2 gap-2">
                {COMMON_DAY_LIMITS.map(limit => (
                  <Button
                    key={limit.days}
                    type="button"
                    variant={dayLimit === limit.days.toString() && limitType === 'preset' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePresetDayLimit(limit.days)}
                    className="text-left h-auto p-2"
                  >
                    <div>
                      <div className="font-semibold">{limit.label}</div>
                      <div className="text-xs text-muted-foreground">{limit.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Manual Input */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Or enter custom days:</p>
              <Input
                type="number"
                min="1"
                max="365"
                value={dayLimit}
                onChange={(e) => handleCustomDayLimit(e.target.value)}
                placeholder="Enter custom day limit"
                className={limitType === 'custom' ? 'border-primary' : ''}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Maximum days allowed in this country for your selected visa/tracking type
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
