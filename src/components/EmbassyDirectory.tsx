import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExternalLink, Phone, Globe, MapPin, Search, X, Copy, Check, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmbassyService, { Embassy } from '@/services/EmbassyService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/contexts/LocationContext';

const EmbassyDirectory: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const embassyService = EmbassyService.getInstance();
  const embassies = embassyService.getAvailableEmbassies();
  const regions = embassyService.getRegions();

  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [selectedEmbassy, setSelectedEmbassy] = useState<Embassy | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Get passport country from profile, and current location
  let locationCountryCode: string | null = null;
  try {
    const loc = useLocation();
    locationCountryCode = loc.location?.country_code?.toUpperCase() || null;
  } catch {
    // no provider
  }

  // Passport country from profile (demo or real)
  const passportCountryCode = useMemo(() => {
    try {
      const enhanced = localStorage.getItem('enhancedProfile');
      if (enhanced) {
        const parsed = JSON.parse(enhanced);
        const passports: string[] = parsed?.core?.legal?.passportCountries || [];
        if (passports.length > 0) {
          // Map nationality name to country code
          const nationalityMap: Record<string, string> = {
            'British': 'GB', 'American': 'US', 'Canadian': 'CA', 'Australian': 'AU',
            'German': 'DE', 'French': 'FR', 'Italian': 'IT', 'Spanish': 'ES',
            'Dutch': 'NL', 'Swiss': 'CH', 'Japanese': 'JP', 'Korean': 'KR',
            'Chinese': 'CN', 'Indian': 'IN', 'Brazilian': 'BR', 'Mexican': 'MX',
            'Swedish': 'SE', 'Norwegian': 'NO', 'Danish': 'DK', 'Finnish': 'FI',
            'Irish': 'IE', 'Polish': 'PL', 'Czech': 'CZ', 'Greek': 'GR',
            'Portuguese': 'PT', 'Austrian': 'AT', 'Belgian': 'BE', 'Singaporean': 'SG',
            'Thai': 'TH', 'Malaysian': 'MY', 'Filipino': 'PH', 'Indonesian': 'ID',
            'Vietnamese': 'VN', 'Turkish': 'TR', 'Egyptian': 'EG', 'Nigerian': 'NG',
            'Kenyan': 'KE', 'South African': 'ZA', 'Moroccan': 'MA', 'Emirati': 'AE',
            'Saudi': 'SA', 'Qatari': 'QA', 'Israeli': 'IL', 'Jordanian': 'JO',
            'Argentine': 'AR', 'Chilean': 'CL', 'Colombian': 'CO', 'Peruvian': 'PE',
            'New Zealander': 'NZ', 'Romanian': 'RO', 'Hungarian': 'HU', 'Bulgarian': 'BG',
          };
          const first = passports[0];
          // Check if it's already a country code (2 letters)
          if (first.length === 2) return first.toUpperCase();
          return nationalityMap[first] || null;
        }
      }
    } catch { /* silent */ }
    return null;
  }, []);

  // In demo mode, passport country = location country (simulated)
  const effectivePassportCode = passportCountryCode || locationCountryCode;

  const filtered = useMemo(() => {
    let items = embassyService.getEmbassiesSorted(effectivePassportCode, locationCountryCode);
    if (activeRegion) items = items.filter(e => e.region === activeRegion);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(e =>
        e.country.toLowerCase().includes(q) ||
        e.countryCode.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q)
      );
    }
    return items;
  }, [embassies, search, activeRegion, effectivePassportCode, locationCountryCode]);

  const getCountryFlag = (countryCode: string) => {
    try {
      return String.fromCodePoint(...countryCode.toUpperCase().split('').map((char) => 127397 + char.charCodeAt(0)));
    } catch {
      return '🏳️';
    }
  };

  const copyContact = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: 'Copied!', description: `${text} copied to clipboard` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Find passport embassy for hero card
  const passportEmbassy = effectivePassportCode ? embassyService.getEmbassyByCountry(effectivePassportCode) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t('embassy.title')}</h2>
        <p className="text-muted-foreground">
          Official embassies & consulates for {embassies.length} countries worldwide
        </p>
      </div>

      {/* Passport country hero */}
      {passportEmbassy && (
        <Card className="border-primary bg-primary/5 shadow-md">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Your Embassy (Passport Country)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getCountryFlag(passportEmbassy.countryCode)}</span>
              <div className="flex-1">
                <p className="text-lg font-bold">{passportEmbassy.country}</p>
                <p className="text-xs text-muted-foreground">{passportEmbassy.name}</p>
              </div>
              <Badge variant="default">🛂 Passport</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button size="sm" className="justify-start" onClick={() => window.open(passportEmbassy.website, '_blank')}>
                <Globe className="h-3.5 w-3.5 mr-1.5" />Website<ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              <Button size="sm" variant="outline" className="justify-start" onClick={() => window.open(passportEmbassy.travelAdvisoryUrl, '_blank')}>
                <MapPin className="h-3.5 w-3.5 mr-1.5" />Travel Advisory<ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              <Button size="sm" variant="destructive" className="justify-start font-mono" onClick={() => window.open(`tel:${passportEmbassy.emergencyContact}`)}>
                <Phone className="h-3.5 w-3.5 mr-1.5" />{passportEmbassy.emergencyContact}
              </Button>
            </div>
            {passportEmbassy.registrationUrl && (
              <Button size="sm" variant="secondary" className="w-full justify-start" onClick={() => window.open(passportEmbassy.registrationUrl, '_blank')}>
                <Shield className="h-3.5 w-3.5 mr-1.5" />Register with Embassy (Recommended)<ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by country name or code..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-10" />
        {search && <Button variant="ghost" size="sm" className="absolute right-1 top-1" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
      </div>

      {/* Region chips */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={activeRegion === null ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActiveRegion(null)}>
          All ({embassies.length})
        </Badge>
        {regions.map(r => {
          const count = embassies.filter(e => e.region === r).length;
          return (
            <Badge key={r} variant={activeRegion === r ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActiveRegion(activeRegion === r ? null : r)}>
              {r} ({count})
            </Badge>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">Showing {filtered.length} of {embassies.length} countries</p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((embassy) => {
          const isPassport = embassy.countryCode === effectivePassportCode;
          const isLocation = embassy.countryCode === locationCountryCode;
          return (
            <Card
              key={embassy.id}
              className={`hover:shadow-lg transition-all cursor-pointer group ${isPassport ? 'border-primary ring-1 ring-primary/20' : isLocation ? 'border-accent ring-1 ring-accent/20' : ''}`}
              onClick={() => setSelectedEmbassy(embassy)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCountryFlag(embassy.countryCode)}</span>
                    <div>
                      <CardTitle className="text-base">{embassy.country}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{embassy.name}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {isPassport && <Badge variant="default" className="text-xs">🛂 Passport</Badge>}
                    {isLocation && !isPassport && <Badge variant="secondary" className="text-xs">📍 Here</Badge>}
                    <Badge variant="outline" className="text-xs">{embassy.region}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono text-xs">{embassy.emergencyContact}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto" onClick={e => { e.stopPropagation(); copyContact(embassy.emergencyContact, embassy.id); }}>
                    {copiedId === embassy.id ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {embassy.languages.map(lang => (
                    <Badge key={lang} variant="secondary" className="text-xs">{lang.toUpperCase()}</Badge>
                  ))}
                  {embassy.registrationUrl && <Badge variant="outline" className="text-xs">Registration</Badge>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card><CardContent className="flex flex-col items-center py-12"><Globe className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-muted-foreground">No embassies found</p></CardContent></Card>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedEmbassy} onOpenChange={() => setSelectedEmbassy(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedEmbassy && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{getCountryFlag(selectedEmbassy.countryCode)}</span>
                  <div>
                    <div>{selectedEmbassy.country}</div>
                    <p className="text-sm font-normal text-muted-foreground">{selectedEmbassy.name}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <Button className="w-full justify-start" onClick={() => window.open(selectedEmbassy.website, '_blank')}>
                  <Globe className="h-4 w-4 mr-2" />Official Website<ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => window.open(selectedEmbassy.travelAdvisoryUrl, '_blank')}>
                  <MapPin className="h-4 w-4 mr-2" />Travel Advisory<ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
                {selectedEmbassy.registrationUrl && (
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.open(selectedEmbassy.registrationUrl, '_blank')}>
                    <Shield className="h-4 w-4 mr-2" />Citizen Registration<ExternalLink className="h-3 w-3 ml-auto" />
                  </Button>
                )}
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-muted-foreground mb-1">Emergency Hotline</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold font-mono">{selectedEmbassy.emergencyContact}</p>
                    <Button size="sm" variant="destructive" onClick={() => window.open(`tel:${selectedEmbassy.emergencyContact}`)}>
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedEmbassy.languages.map(lang => <Badge key={lang} variant="secondary">{lang.toUpperCase()}</Badge>)}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmbassyDirectory;
