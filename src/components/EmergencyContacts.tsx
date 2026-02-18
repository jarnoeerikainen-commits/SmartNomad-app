import React, { useState, useEffect, useMemo } from 'react';
import { Phone, AlertCircle, MapPin, Search, X, Copy, Check } from 'lucide-react';
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
  region: string;
}

const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  // Europe
  { country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', police: '999', ambulance: '999', fire: '999', general: '112', region: 'Europe' },
  { country: 'Germany', countryCode: 'DE', flag: '🇩🇪', police: '110', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'France', countryCode: 'FR', flag: '🇫🇷', police: '17', ambulance: '15', fire: '18', general: '112', region: 'Europe' },
  { country: 'Spain', countryCode: 'ES', flag: '🇪🇸', police: '091', ambulance: '061', fire: '080', general: '112', region: 'Europe' },
  { country: 'Italy', countryCode: 'IT', flag: '🇮🇹', police: '113', ambulance: '118', fire: '115', general: '112', region: 'Europe' },
  { country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Belgium', countryCode: 'BE', flag: '🇧🇪', police: '101', ambulance: '100', fire: '100', general: '112', region: 'Europe' },
  { country: 'Switzerland', countryCode: 'CH', flag: '🇨🇭', police: '117', ambulance: '144', fire: '118', general: '112', region: 'Europe' },
  { country: 'Austria', countryCode: 'AT', flag: '🇦🇹', police: '133', ambulance: '144', fire: '122', general: '112', region: 'Europe' },
  { country: 'Portugal', countryCode: 'PT', flag: '🇵🇹', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Greece', countryCode: 'GR', flag: '🇬🇷', police: '100', ambulance: '166', fire: '199', general: '112', region: 'Europe' },
  { country: 'Poland', countryCode: 'PL', flag: '🇵🇱', police: '997', ambulance: '999', fire: '998', general: '112', region: 'Europe' },
  { country: 'Czech Republic', countryCode: 'CZ', flag: '🇨🇿', police: '158', ambulance: '155', fire: '150', general: '112', region: 'Europe' },
  { country: 'Ireland', countryCode: 'IE', flag: '🇮🇪', police: '999', ambulance: '999', fire: '999', general: '112', region: 'Europe' },
  { country: 'Denmark', countryCode: 'DK', flag: '🇩🇰', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Sweden', countryCode: 'SE', flag: '🇸🇪', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Norway', countryCode: 'NO', flag: '🇳🇴', police: '112', ambulance: '113', fire: '110', general: '112', region: 'Europe' },
  { country: 'Finland', countryCode: 'FI', flag: '🇫🇮', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Croatia', countryCode: 'HR', flag: '🇭🇷', police: '192', ambulance: '194', fire: '193', general: '112', region: 'Europe' },
  { country: 'Romania', countryCode: 'RO', flag: '🇷🇴', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Hungary', countryCode: 'HU', flag: '🇭🇺', police: '107', ambulance: '104', fire: '105', general: '112', region: 'Europe' },
  { country: 'Iceland', countryCode: 'IS', flag: '🇮🇸', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Luxembourg', countryCode: 'LU', flag: '🇱🇺', police: '113', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Malta', countryCode: 'MT', flag: '🇲🇹', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Cyprus', countryCode: 'CY', flag: '🇨🇾', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Estonia', countryCode: 'EE', flag: '🇪🇪', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Latvia', countryCode: 'LV', flag: '🇱🇻', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Lithuania', countryCode: 'LT', flag: '🇱🇹', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Slovenia', countryCode: 'SI', flag: '🇸🇮', police: '113', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Slovakia', countryCode: 'SK', flag: '🇸🇰', police: '158', ambulance: '155', fire: '150', general: '112', region: 'Europe' },
  { country: 'Bulgaria', countryCode: 'BG', flag: '🇧🇬', police: '166', ambulance: '150', fire: '160', general: '112', region: 'Europe' },
  { country: 'Russia', countryCode: 'RU', flag: '🇷🇺', police: '102', ambulance: '103', fire: '101', general: '112', region: 'Europe' },
  { country: 'Ukraine', countryCode: 'UA', flag: '🇺🇦', police: '102', ambulance: '103', fire: '101', general: '112', region: 'Europe' },
  { country: 'Turkey', countryCode: 'TR', flag: '🇹🇷', police: '155', ambulance: '112', fire: '110', general: '112', region: 'Europe' },

  // North America
  { country: 'United States', countryCode: 'US', flag: '🇺🇸', police: '911', ambulance: '911', fire: '911', general: '911', region: 'North America' },
  { country: 'Canada', countryCode: 'CA', flag: '🇨🇦', police: '911', ambulance: '911', fire: '911', general: '911', region: 'North America' },
  { country: 'Mexico', countryCode: 'MX', flag: '🇲🇽', police: '911', ambulance: '911', fire: '911', general: '911', region: 'North America' },

  // Asia Pacific
  { country: 'Australia', countryCode: 'AU', flag: '🇦🇺', police: '000', ambulance: '000', fire: '000', general: '000', region: 'Asia Pacific' },
  { country: 'New Zealand', countryCode: 'NZ', flag: '🇳🇿', police: '111', ambulance: '111', fire: '111', general: '111', region: 'Asia Pacific' },
  { country: 'Japan', countryCode: 'JP', flag: '🇯🇵', police: '110', ambulance: '119', fire: '119', region: 'Asia Pacific' },
  { country: 'South Korea', countryCode: 'KR', flag: '🇰🇷', police: '112', ambulance: '119', fire: '119', general: '112', region: 'Asia Pacific' },
  { country: 'China', countryCode: 'CN', flag: '🇨🇳', police: '110', ambulance: '120', fire: '119', region: 'Asia Pacific' },
  { country: 'India', countryCode: 'IN', flag: '🇮🇳', police: '100', ambulance: '102', fire: '101', general: '112', region: 'Asia Pacific' },
  { country: 'Thailand', countryCode: 'TH', flag: '🇹🇭', police: '191', ambulance: '1669', fire: '199', region: 'Asia Pacific' },
  { country: 'Singapore', countryCode: 'SG', flag: '🇸🇬', police: '999', ambulance: '995', fire: '995', general: '999', region: 'Asia Pacific' },
  { country: 'Malaysia', countryCode: 'MY', flag: '🇲🇾', police: '999', ambulance: '999', fire: '994', general: '999', region: 'Asia Pacific' },
  { country: 'Indonesia', countryCode: 'ID', flag: '🇮🇩', police: '110', ambulance: '118', fire: '113', region: 'Asia Pacific' },
  { country: 'Philippines', countryCode: 'PH', flag: '🇵🇭', police: '117', ambulance: '911', fire: '911', general: '911', region: 'Asia Pacific' },
  { country: 'Vietnam', countryCode: 'VN', flag: '🇻🇳', police: '113', ambulance: '115', fire: '114', region: 'Asia Pacific' },
  { country: 'Taiwan', countryCode: 'TW', flag: '🇹🇼', police: '110', ambulance: '119', fire: '119', region: 'Asia Pacific' },
  { country: 'Hong Kong', countryCode: 'HK', flag: '🇭🇰', police: '999', ambulance: '999', fire: '999', general: '999', region: 'Asia Pacific' },
  { country: 'Pakistan', countryCode: 'PK', flag: '🇵🇰', police: '15', ambulance: '115', fire: '16', region: 'Asia Pacific' },
  { country: 'Bangladesh', countryCode: 'BD', flag: '🇧🇩', police: '999', ambulance: '999', fire: '999', general: '999', region: 'Asia Pacific' },
  { country: 'Sri Lanka', countryCode: 'LK', flag: '🇱🇰', police: '119', ambulance: '110', fire: '110', general: '118', region: 'Asia Pacific' },
  { country: 'Cambodia', countryCode: 'KH', flag: '🇰🇭', police: '117', ambulance: '119', fire: '118', region: 'Asia Pacific' },
  { country: 'Myanmar', countryCode: 'MM', flag: '🇲🇲', police: '199', ambulance: '192', fire: '191', region: 'Asia Pacific' },

  // Middle East
  { country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', police: '999', ambulance: '998', fire: '997', general: '112', region: 'Middle East' },
  { country: 'Saudi Arabia', countryCode: 'SA', flag: '🇸🇦', police: '999', ambulance: '997', fire: '998', region: 'Middle East' },
  { country: 'Qatar', countryCode: 'QA', flag: '🇶🇦', police: '999', ambulance: '999', fire: '999', general: '999', region: 'Middle East' },
  { country: 'Kuwait', countryCode: 'KW', flag: '🇰🇼', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Middle East' },
  { country: 'Bahrain', countryCode: 'BH', flag: '🇧🇭', police: '999', ambulance: '999', fire: '999', general: '112', region: 'Middle East' },
  { country: 'Oman', countryCode: 'OM', flag: '🇴🇲', police: '9999', ambulance: '9999', fire: '9999', general: '9999', region: 'Middle East' },
  { country: 'Israel', countryCode: 'IL', flag: '🇮🇱', police: '100', ambulance: '101', fire: '102', region: 'Middle East' },
  { country: 'Jordan', countryCode: 'JO', flag: '🇯🇴', police: '911', ambulance: '911', fire: '911', general: '911', region: 'Middle East' },

  // Africa
  { country: 'South Africa', countryCode: 'ZA', flag: '🇿🇦', police: '10111', ambulance: '10177', fire: '10111', region: 'Africa' },
  { country: 'Egypt', countryCode: 'EG', flag: '🇪🇬', police: '122', ambulance: '123', fire: '180', region: 'Africa' },
  { country: 'Kenya', countryCode: 'KE', flag: '🇰🇪', police: '999', ambulance: '999', fire: '999', general: '112', region: 'Africa' },
  { country: 'Nigeria', countryCode: 'NG', flag: '🇳🇬', police: '199', ambulance: '199', fire: '199', general: '112', region: 'Africa' },
  { country: 'Morocco', countryCode: 'MA', flag: '🇲🇦', police: '19', ambulance: '15', fire: '15', region: 'Africa' },
  { country: 'Tanzania', countryCode: 'TZ', flag: '🇹🇿', police: '114', ambulance: '114', fire: '114', region: 'Africa' },
  { country: 'Ghana', countryCode: 'GH', flag: '🇬🇭', police: '191', ambulance: '193', fire: '192', region: 'Africa' },
  { country: 'Ethiopia', countryCode: 'ET', flag: '🇪🇹', police: '991', ambulance: '907', fire: '939', region: 'Africa' },

  // South America
  { country: 'Brazil', countryCode: 'BR', flag: '🇧🇷', police: '190', ambulance: '192', fire: '193', region: 'South America' },
  { country: 'Argentina', countryCode: 'AR', flag: '🇦🇷', police: '911', ambulance: '107', fire: '100', general: '911', region: 'South America' },
  { country: 'Chile', countryCode: 'CL', flag: '🇨🇱', police: '133', ambulance: '131', fire: '132', region: 'South America' },
  { country: 'Colombia', countryCode: 'CO', flag: '🇨🇴', police: '112', ambulance: '125', fire: '119', general: '123', region: 'South America' },
  { country: 'Peru', countryCode: 'PE', flag: '🇵🇪', police: '105', ambulance: '116', fire: '116', region: 'South America' },
  { country: 'Ecuador', countryCode: 'EC', flag: '🇪🇨', police: '911', ambulance: '911', fire: '911', general: '911', region: 'South America' },
  { country: 'Uruguay', countryCode: 'UY', flag: '🇺🇾', police: '911', ambulance: '105', fire: '104', general: '911', region: 'South America' },
  { country: 'Costa Rica', countryCode: 'CR', flag: '🇨🇷', police: '911', ambulance: '911', fire: '911', general: '911', region: 'South America' },
  { country: 'Panama', countryCode: 'PA', flag: '🇵🇦', police: '104', ambulance: '911', fire: '103', general: '911', region: 'South America' },
];

const REGIONS = [...new Set(EMERGENCY_NUMBERS.map(n => n.region))];

const EmergencyContacts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const data = await res.json();
          setCurrentCountry(data.address?.country_code?.toUpperCase() || null);
        } catch { /* silent */ }
      }, () => {});
    }
  }, []);

  const filtered = useMemo(() => {
    let items = EMERGENCY_NUMBERS;
    if (activeRegion) items = items.filter(n => n.region === activeRegion);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(n => n.country.toLowerCase().includes(q) || n.countryCode.toLowerCase().includes(q));
    }
    return items.sort((a, b) => {
      if (currentCountry) {
        if (a.countryCode === currentCountry) return -1;
        if (b.countryCode === currentCountry) return 1;
      }
      return a.country.localeCompare(b.country);
    });
  }, [searchQuery, currentCountry, activeRegion]);

  const copyNumber = (number: string, id: string) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    toast({ title: 'Copied!', description: `${number} copied to clipboard` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Emergency Numbers</h1>
        <p className="text-muted-foreground">{EMERGENCY_NUMBERS.length} countries — official police, ambulance & fire numbers</p>
      </div>

      <Card className="border-destructive bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <span>In life-threatening emergencies, dial local emergency services first. EU: <strong>112</strong> | US/CA/MX: <strong>911</strong></span>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search country..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-10" />
        {searchQuery && <Button variant="ghost" size="sm" className="absolute right-1 top-1" onClick={() => setSearchQuery('')}><X className="h-4 w-4" /></Button>}
      </div>

      {/* Region chips */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={activeRegion === null ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActiveRegion(null)}>
          All ({EMERGENCY_NUMBERS.length})
        </Badge>
        {REGIONS.map(r => (
          <Badge key={r} variant={activeRegion === r ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActiveRegion(activeRegion === r ? null : r)}>
            {r} ({EMERGENCY_NUMBERS.filter(n => n.region === r).length})
          </Badge>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">Showing {filtered.length} countries</p>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => (
          <Card key={item.countryCode} className={`transition-all hover:shadow-md ${item.countryCode === currentCountry ? 'border-primary ring-1 ring-primary/20' : ''}`}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.flag}</span>
                  <div>
                    <p className="font-semibold text-sm">{item.country}</p>
                    <p className="text-xs text-muted-foreground">{item.region}</p>
                  </div>
                </div>
                {item.countryCode === currentCountry && <Badge variant="default" className="text-xs">📍 You</Badge>}
              </div>

              {item.general && (
                <div className="rounded-md bg-destructive/10 p-2 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground">GENERAL EMERGENCY</p>
                    <p className="text-xl font-bold text-destructive font-mono">{item.general}</p>
                  </div>
                  <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => copyNumber(item.general!, `${item.countryCode}-gen`)}>
                    {copiedId === `${item.countryCode}-gen` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Police', num: item.police, key: 'pol' },
                  { label: 'Ambulance', num: item.ambulance, key: 'amb' },
                  { label: 'Fire', num: item.fire, key: 'fir' },
                ].map(s => (
                  <div key={s.key} className="rounded-md border p-1.5 cursor-pointer hover:bg-accent transition-colors" onClick={() => copyNumber(s.num, `${item.countryCode}-${s.key}`)}>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    <p className="text-sm font-bold font-mono">{s.num}</p>
                    {copiedId === `${item.countryCode}-${s.key}` && <p className="text-[9px] text-primary">Copied!</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card><CardContent className="py-12 text-center"><AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No countries found</p></CardContent></Card>
      )}
    </div>
  );
};

export default EmergencyContacts;
