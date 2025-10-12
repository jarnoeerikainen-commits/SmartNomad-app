import React, { useState, useEffect } from 'react';
import { Phone, AlertCircle, MapPin, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface EmergencyNumber {
  country: string;
  countryCode: string;
  flag: string;
  police: string;
  ambulance: string;
  fire: string;
  general?: string;
}

// Comprehensive list of emergency numbers from official sources
const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { country: 'United States', countryCode: 'US', flag: '🇺🇸', police: '911', ambulance: '911', fire: '911', general: '911' },
  { country: 'Canada', countryCode: 'CA', flag: '🇨🇦', police: '911', ambulance: '911', fire: '911', general: '911' },
  { country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', police: '999', ambulance: '999', fire: '999', general: '112' },
  { country: 'Germany', countryCode: 'DE', flag: '🇩🇪', police: '110', ambulance: '112', fire: '112', general: '112' },
  { country: 'France', countryCode: 'FR', flag: '🇫🇷', police: '17', ambulance: '15', fire: '18', general: '112' },
  { country: 'Spain', countryCode: 'ES', flag: '🇪🇸', police: '091', ambulance: '061', fire: '080', general: '112' },
  { country: 'Italy', countryCode: 'IT', flag: '🇮🇹', police: '113', ambulance: '118', fire: '115', general: '112' },
  { country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Belgium', countryCode: 'BE', flag: '🇧🇪', police: '101', ambulance: '100', fire: '100', general: '112' },
  { country: 'Switzerland', countryCode: 'CH', flag: '🇨🇭', police: '117', ambulance: '144', fire: '118', general: '112' },
  { country: 'Austria', countryCode: 'AT', flag: '🇦🇹', police: '133', ambulance: '144', fire: '122', general: '112' },
  { country: 'Portugal', countryCode: 'PT', flag: '🇵🇹', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Greece', countryCode: 'GR', flag: '🇬🇷', police: '100', ambulance: '166', fire: '199', general: '112' },
  { country: 'Poland', countryCode: 'PL', flag: '🇵🇱', police: '997', ambulance: '999', fire: '998', general: '112' },
  { country: 'Czech Republic', countryCode: 'CZ', flag: '🇨🇿', police: '158', ambulance: '155', fire: '150', general: '112' },
  { country: 'Ireland', countryCode: 'IE', flag: '🇮🇪', police: '999', ambulance: '999', fire: '999', general: '112' },
  { country: 'Denmark', countryCode: 'DK', flag: '🇩🇰', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Sweden', countryCode: 'SE', flag: '🇸🇪', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Norway', countryCode: 'NO', flag: '🇳🇴', police: '112', ambulance: '113', fire: '110', general: '112' },
  { country: 'Finland', countryCode: 'FI', flag: '🇫🇮', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Australia', countryCode: 'AU', flag: '🇦🇺', police: '000', ambulance: '000', fire: '000', general: '000' },
  { country: 'New Zealand', countryCode: 'NZ', flag: '🇳🇿', police: '111', ambulance: '111', fire: '111', general: '111' },
  { country: 'Japan', countryCode: 'JP', flag: '🇯🇵', police: '110', ambulance: '119', fire: '119' },
  { country: 'South Korea', countryCode: 'KR', flag: '🇰🇷', police: '112', ambulance: '119', fire: '119', general: '112' },
  { country: 'China', countryCode: 'CN', flag: '🇨🇳', police: '110', ambulance: '120', fire: '119' },
  { country: 'India', countryCode: 'IN', flag: '🇮🇳', police: '100', ambulance: '102', fire: '101', general: '112' },
  { country: 'Thailand', countryCode: 'TH', flag: '🇹🇭', police: '191', ambulance: '1669', fire: '199' },
  { country: 'Singapore', countryCode: 'SG', flag: '🇸🇬', police: '999', ambulance: '995', fire: '995', general: '999' },
  { country: 'Malaysia', countryCode: 'MY', flag: '🇲🇾', police: '999', ambulance: '999', fire: '994', general: '999' },
  { country: 'Indonesia', countryCode: 'ID', flag: '🇮🇩', police: '110', ambulance: '118', fire: '113' },
  { country: 'Philippines', countryCode: 'PH', flag: '🇵🇭', police: '117', ambulance: '911', fire: '911', general: '911' },
  { country: 'Vietnam', countryCode: 'VN', flag: '🇻🇳', police: '113', ambulance: '115', fire: '114' },
  { country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', police: '999', ambulance: '998', fire: '997', general: '112' },
  { country: 'Saudi Arabia', countryCode: 'SA', flag: '🇸🇦', police: '999', ambulance: '997', fire: '998' },
  { country: 'Turkey', countryCode: 'TR', flag: '🇹🇷', police: '155', ambulance: '112', fire: '110', general: '112' },
  { country: 'Israel', countryCode: 'IL', flag: '🇮🇱', police: '100', ambulance: '101', fire: '102' },
  { country: 'South Africa', countryCode: 'ZA', flag: '🇿🇦', police: '10111', ambulance: '10177', fire: '10111' },
  { country: 'Egypt', countryCode: 'EG', flag: '🇪🇬', police: '122', ambulance: '123', fire: '180' },
  { country: 'Kenya', countryCode: 'KE', flag: '🇰🇪', police: '999', ambulance: '999', fire: '999', general: '112' },
  { country: 'Nigeria', countryCode: 'NG', flag: '🇳🇬', police: '199', ambulance: '199', fire: '199', general: '112' },
  { country: 'Morocco', countryCode: 'MA', flag: '🇲🇦', police: '19', ambulance: '15', fire: '15' },
  { country: 'Mexico', countryCode: 'MX', flag: '🇲🇽', police: '911', ambulance: '911', fire: '911', general: '911' },
  { country: 'Brazil', countryCode: 'BR', flag: '🇧🇷', police: '190', ambulance: '192', fire: '193' },
  { country: 'Argentina', countryCode: 'AR', flag: '🇦🇷', police: '911', ambulance: '107', fire: '100', general: '911' },
  { country: 'Chile', countryCode: 'CL', flag: '🇨🇱', police: '133', ambulance: '131', fire: '132' },
  { country: 'Colombia', countryCode: 'CO', flag: '🇨🇴', police: '112', ambulance: '125', fire: '119', general: '123' },
  { country: 'Peru', countryCode: 'PE', flag: '🇵🇪', police: '105', ambulance: '116', fire: '116' },
  { country: 'Russia', countryCode: 'RU', flag: '🇷🇺', police: '102', ambulance: '103', fire: '101', general: '112' },
  { country: 'Ukraine', countryCode: 'UA', flag: '🇺🇦', police: '102', ambulance: '103', fire: '101', general: '112' },
  { country: 'Croatia', countryCode: 'HR', flag: '🇭🇷', police: '192', ambulance: '194', fire: '193', general: '112' },
  { country: 'Romania', countryCode: 'RO', flag: '🇷🇴', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Hungary', countryCode: 'HU', flag: '🇭🇺', police: '107', ambulance: '104', fire: '105', general: '112' },
  { country: 'Iceland', countryCode: 'IS', flag: '🇮🇸', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Luxembourg', countryCode: 'LU', flag: '🇱🇺', police: '113', ambulance: '112', fire: '112', general: '112' },
  { country: 'Malta', countryCode: 'MT', flag: '🇲🇹', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Cyprus', countryCode: 'CY', flag: '🇨🇾', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Estonia', countryCode: 'EE', flag: '🇪🇪', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Latvia', countryCode: 'LV', flag: '🇱🇻', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Lithuania', countryCode: 'LT', flag: '🇱🇹', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Slovenia', countryCode: 'SI', flag: '🇸🇮', police: '113', ambulance: '112', fire: '112', general: '112' },
  { country: 'Slovakia', countryCode: 'SK', flag: '🇸🇰', police: '158', ambulance: '155', fire: '150', general: '112' },
  { country: 'Bulgaria', countryCode: 'BG', flag: '🇧🇬', police: '166', ambulance: '150', fire: '160', general: '112' },
  { country: 'Hong Kong', countryCode: 'HK', flag: '🇭🇰', police: '999', ambulance: '999', fire: '999', general: '999' },
  { country: 'Taiwan', countryCode: 'TW', flag: '🇹🇼', police: '110', ambulance: '119', fire: '119' },
  { country: 'Pakistan', countryCode: 'PK', flag: '🇵🇰', police: '15', ambulance: '115', fire: '16' },
  { country: 'Bangladesh', countryCode: 'BD', flag: '🇧🇩', police: '999', ambulance: '999', fire: '999', general: '999' },
  { country: 'Sri Lanka', countryCode: 'LK', flag: '🇱🇰', police: '119', ambulance: '110', fire: '110', general: '118' },
  { country: 'Qatar', countryCode: 'QA', flag: '🇶🇦', police: '999', ambulance: '999', fire: '999', general: '999' },
  { country: 'Kuwait', countryCode: 'KW', flag: '🇰🇼', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'Bahrain', countryCode: 'BH', flag: '🇧🇭', police: '999', ambulance: '999', fire: '999', general: '112' },
  { country: 'Oman', countryCode: 'OM', flag: '🇴🇲', police: '9999', ambulance: '9999', fire: '9999', general: '9999' },
];

const EmergencyContacts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);
  const [filteredNumbers, setFilteredNumbers] = useState<EmergencyNumber[]>(EMERGENCY_NUMBERS);
  const { toast } = useToast();

  useEffect(() => {
    detectCurrentCountry();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      const sorted = [...EMERGENCY_NUMBERS].sort((a, b) => {
        if (currentCountry) {
          if (a.countryCode === currentCountry) return -1;
          if (b.countryCode === currentCountry) return 1;
        }
        return a.country.localeCompare(b.country);
      });
      setFilteredNumbers(sorted);
    } else {
      const filtered = EMERGENCY_NUMBERS.filter(item =>
        item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNumbers(filtered);
    }
  }, [searchQuery, currentCountry]);

  const detectCurrentCountry = async () => {
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
              );
              const data = await response.json();
              const countryCode = data.address?.country_code?.toUpperCase();
              if (countryCode) {
                setCurrentCountry(countryCode);
              }
            } catch (error) {
              console.error('Error detecting country:', error);
            }
          },
          (error) => {
            console.log('Geolocation error:', error);
          }
        );
      }
    } catch (error) {
      console.error('Error accessing geolocation:', error);
    }
  };

  const handleCall = (number: string, service: string, country: string) => {
    toast({
      title: 'Emergency Number',
      description: `${service} in ${country}: ${number}`,
    });
  };

  const copyNumber = (number: string, service: string) => {
    navigator.clipboard.writeText(number);
    toast({
      title: 'Copied!',
      description: `${service} number copied to clipboard`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Emergency Numbers</h1>
        <p className="text-muted-foreground">
          Official police and ambulance numbers from government sources worldwide
        </p>
      </div>

      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg">Critical Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            • Always call emergency services immediately in life-threatening situations
          </p>
          <p className="text-sm">
            • These numbers connect to official government emergency services
          </p>
          <p className="text-sm">
            • European Union countries use 112 as universal emergency number
          </p>
          <p className="text-sm">
            • Save offline copies of critical numbers before traveling
          </p>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by country name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {currentCountry && (
        <Card className="gradient-trust border-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <CardTitle className="text-lg">Your Current Location</CardTitle>
            </div>
            <CardDescription>
              Auto-detected emergency numbers for your area
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNumbers.map((item) => (
          <Card
            key={item.countryCode}
            className={`transition-all hover:shadow-lg ${
              item.countryCode === currentCountry ? 'border-primary bg-accent' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{item.flag}</span>
                  <div>
                    <CardTitle className="text-lg">{item.country}</CardTitle>
                    <CardDescription className="text-xs">{item.countryCode}</CardDescription>
                  </div>
                </div>
                {item.countryCode === currentCountry && (
                  <Badge className="gradient-trust">Current</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.general && (
                <div className="rounded-lg border bg-destructive/10 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">General Emergency</p>
                      <p className="text-2xl font-bold text-destructive">{item.general}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCall(item.general!, 'Emergency', item.country)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg border p-2">
                <div>
                  <p className="text-xs text-muted-foreground">Police</p>
                  <p className="text-lg font-bold">{item.police}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyNumber(item.police, 'Police')}
                >
                  Copy
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-2">
                <div>
                  <p className="text-xs text-muted-foreground">Ambulance</p>
                  <p className="text-lg font-bold">{item.ambulance}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyNumber(item.ambulance, 'Ambulance')}
                >
                  Copy
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-2">
                <div>
                  <p className="text-xs text-muted-foreground">Fire</p>
                  <p className="text-lg font-bold">{item.fire}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyNumber(item.fire, 'Fire')}
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNumbers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg text-muted-foreground">No countries found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmergencyContacts;
