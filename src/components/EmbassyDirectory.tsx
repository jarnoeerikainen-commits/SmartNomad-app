import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExternalLink, Phone, Globe, MapPin, Search, X, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmbassyService, { Embassy } from '@/services/EmbassyService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

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

  const filtered = useMemo(() => {
    return embassies.filter(e => {
      if (activeRegion && e.region !== activeRegion) return false;
      if (search) {
        const q = search.toLowerCase();
        return e.country.toLowerCase().includes(q) || e.countryCode.toLowerCase().includes(q) || e.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [embassies, search, activeRegion]);

  const getCountryFlag = (countryCode: string) => {
    return String.fromCodePoint(...countryCode.toUpperCase().split('').map((char) => 127397 + char.charCodeAt(0)));
  };

  const copyContact = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: 'Copied!', description: `${text} copied to clipboard` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t('embassy.title')}</h2>
        <p className="text-muted-foreground">
          Official government travel resources for {embassies.length} countries worldwide
        </p>
      </div>

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

      {/* Results count */}
      <p className="text-sm text-muted-foreground">Showing {filtered.length} of {embassies.length} countries</p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((embassy) => (
          <Card key={embassy.id} className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelectedEmbassy(embassy)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getCountryFlag(embassy.countryCode)}</span>
                  <div>
                    <CardTitle className="text-base">{embassy.country}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{embassy.name}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">{embassy.region}</Badge>
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
        ))}
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
                    <Phone className="h-4 w-4 mr-2" />Citizen Registration<ExternalLink className="h-3 w-3 ml-auto" />
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
