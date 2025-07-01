
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, X, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Country } from '@/types/country';

interface CountryTrackerProps {
  countries: Country[];
  onAddCountry: (country: Country) => void;
  onRemoveCountry: (countryCode: string) => void;
}

// Mock country data - in a real app this would come from an API
const AVAILABLE_COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' }
];

const CountryTracker: React.FC<CountryTrackerProps> = ({ 
  countries, 
  onAddCountry, 
  onRemoveCountry 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCountry, setShowAddCountry] = useState(false);
  const { toast } = useToast();

  const filteredCountries = AVAILABLE_COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !countries.find(c => c.code === country.code)
  );

  const handleAddCountry = (country: Country) => {
    onAddCountry(country);
    setSearchTerm('');
    setShowAddCountry(false);
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <MapPin className="w-5 h-5" />
          Tracked Countries ({countries.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tracked Countries List */}
        <div className="space-y-2">
          {countries.length === 0 ? (
            <div className="text-center py-4 text-green-600">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-sm">No countries tracked yet</p>
              <p className="text-xs text-green-500">Add countries to get travel updates</p>
            </div>
          ) : (
            countries.map((country) => (
              <div key={country.code} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <p className="font-medium text-gray-900">{country.name}</p>
                    <p className="text-xs text-gray-500">{country.code}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveCountry(country.code)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Add Country Section */}
        {!showAddCountry ? (
          <Button
            onClick={() => setShowAddCountry(true)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Country
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {searchTerm && (
              <div className="max-h-40 overflow-y-auto space-y-1">
                {filteredCountries.length === 0 ? (
                  <p className="text-sm text-gray-500 p-2">No countries found</p>
                ) : (
                  filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      onClick={() => handleAddCountry(country)}
                      className="flex items-center gap-3 p-2 hover:bg-green-100 rounded cursor-pointer"
                    >
                      <span className="text-xl">{country.flag}</span>
                      <div>
                        <p className="text-sm font-medium">{country.name}</p>
                        <p className="text-xs text-gray-500">{country.code}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={() => {
                setShowAddCountry(false);
                setSearchTerm('');
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CountryTracker;
