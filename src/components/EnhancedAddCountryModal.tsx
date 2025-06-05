
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Phone, DollarSign, Shield, Clock } from 'lucide-react';
import { Country } from '@/types/country';
import CountryInfoService from '@/services/CountryInfoService';

interface EnhancedAddCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (country: Omit<Country, 'id' | 'daysSpent' | 'lastUpdate' | 'countTravelDays' | 'yearlyDaysSpent' | 'lastEntry' | 'totalEntries'>) => void;
  existingCountries: Country[];
}

const COMMON_REASONS = [
  'Tourist visa limit',
  'Tax residence tracking',
  'Work permit limit',
  'Schengen area limit',
  'Business travel limit',
  'Student visa limit',
  'Digital nomad visa',
  'Custom tracking'
];

const EnhancedAddCountryModal: React.FC<EnhancedAddCountryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingCountries
}) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [dayLimit, setDayLimit] = useState('');
  const [showCountryInfo, setShowCountryInfo] = useState(false);

  const availableCountries = CountryInfoService.getAllCountries().filter(
    country => !existingCountries.some(existing => existing.code === country.code)
  );

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setShowCountryInfo(true);
    
    // Auto-update day limit based on country and reason
    if (reason) {
      const recommendedLimit = CountryInfoService.getVisaFreeStays(value, reason);
      setDayLimit(recommendedLimit.toString());
    }
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
    
    // Auto-update day limit based on country and reason
    if (selectedCountry) {
      const recommendedLimit = CountryInfoService.getVisaFreeStays(selectedCountry, value);
      setDayLimit(recommendedLimit.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const country = CountryInfoService.getCountryDetails(selectedCountry);
    if (!country) return;

    const finalReason = reason === 'Custom tracking' ? customReason : reason;
    
    onAdd({
      code: country.code,
      name: country.name,
      flag: country.flag,
      dayLimit: parseInt(dayLimit) || 90,
      reason: finalReason || 'General tracking'
    });

    // Reset form
    setSelectedCountry('');
    setReason('');
    setCustomReason('');
    setDayLimit('');
    setShowCountryInfo(false);
  };

  const selectedCountryDetails = selectedCountry ? CountryInfoService.getCountryDetails(selectedCountry) : null;
  const recommendedInfo = selectedCountry && reason ? CountryInfoService.getRecommendedInfo(selectedCountry, reason) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Country with Smart Recommendations</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="reason">Tracking Reason</Label>
              <Select value={reason} onValueChange={handleReasonChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Why track this country?" />
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

          {recommendedInfo && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800">Smart Recommendations</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Recommended Day Limit:</span>
                    </div>
                    <Badge className="bg-blue-600 text-white">{recommendedInfo.dayLimit} days</Badge>
                  </div>

                  {recommendedInfo.currency && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Currency:</span>
                      </div>
                      <span>{recommendedInfo.currency.code} ({recommendedInfo.currency.symbol})</span>
                    </div>
                  )}

                  {recommendedInfo.emergencyNumbers && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Emergency:</span>
                      </div>
                      <span>Police: {recommendedInfo.emergencyNumbers.police}</span>
                    </div>
                  )}

                  {recommendedInfo.healthInsuranceRequired && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Requirements:</span>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        Health Insurance Required
                      </Badge>
                    </div>
                  )}
                </div>

                {recommendedInfo.commonVisaTypes && (
                  <div className="mt-3">
                    <p className="font-medium text-blue-800 mb-2">Common Visa Types:</p>
                    <div className="flex flex-wrap gap-1">
                      {recommendedInfo.commonVisaTypes.slice(0, 3).map((visa, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {visa}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="dayLimit">Day Limit</Label>
            <Input
              id="dayLimit"
              type="number"
              min="1"
              value={dayLimit}
              onChange={(e) => setDayLimit(e.target.value)}
              placeholder="Days allowed per period"
              required
            />
            <p className="text-xs text-muted-foreground">
              {recommendedInfo ? 'Auto-filled based on country regulations' : 'Enter custom day limit'}
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
              disabled={!selectedCountry || !reason}
            >
              Add Country
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAddCountryModal;
