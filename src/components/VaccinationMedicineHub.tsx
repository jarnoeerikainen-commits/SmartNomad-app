import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Syringe, Search, ExternalLink, MapPin, AlertTriangle, CheckCircle,
  Bell, Shield, Globe, Building2, Plus, Trash2, Calendar, Info,
  Pill, Heart, Clock, DollarSign, ChevronDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LocationData } from '@/types/country';
import {
  VACCINATIONS, VACCINATION_CLINICS, COUNTRY_REQUIREMENTS,
  CATEGORY_LABELS, CATEGORY_COLORS,
  VaccinationInfo, CountryVaccinationRequirement
} from '@/data/vaccinationData';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// --- Sub-components ---

interface UserVaccination {
  id: string;
  vaccineId: string;
  name: string;
  dateReceived: string;
  expiryDate: string;
  notes?: string;
}

const MyVaccinations: React.FC<{
  records: UserVaccination[];
  onAdd: (v: UserVaccination) => void;
  onRemove: (id: string) => void;
  currentLocation?: LocationData | null;
  trackedCountries?: Array<{ name: string; code: string }>;
}> = ({ records, onAdd, onRemove, currentLocation, trackedCountries = [] }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [dateReceived, setDateReceived] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const getStatus = (expiry: string) => {
    const exp = new Date(expiry);
    const now = new Date();
    const soon = new Date(now.getTime() + 30 * 86400000);
    if (exp <= now) return 'expired';
    if (exp <= soon) return 'expiring';
    return 'valid';
  };

  const handleAdd = () => {
    const info = VACCINATIONS.find(v => v.id === selectedVaccine);
    if (!info || !dateReceived) return;
    const received = new Date(dateReceived);
    const years = info.durationYears === 0 ? 1 : info.durationYears === 99 ? 50 : info.durationYears;
    const expiry = new Date(received.getTime() + years * 365.25 * 86400000);
    onAdd({
      id: Date.now().toString(),
      vaccineId: info.id,
      name: info.name,
      dateReceived,
      expiryDate: expiry.toISOString().split('T')[0],
      notes,
    });
    setIsAddOpen(false);
    setSelectedVaccine('');
    setDateReceived('');
    setNotes('');
    toast({ title: '💉 Vaccination Added', description: `${info.name} recorded.` });
  };

  // Recommended vaccines based on user's countries
  const recommended = useMemo(() => {
    const countries = [
      ...(currentLocation ? [currentLocation.country] : []),
      ...trackedCountries.map(c => c.name)
    ];
    if (!countries.length) return [];
    const reqs = COUNTRY_REQUIREMENTS.filter(cr => countries.some(c => cr.country === c));
    const needed = new Set<string>();
    reqs.forEach(r => { r.required.forEach(v => needed.add(v)); r.recommended.forEach(v => needed.add(v)); });
    const existing = new Set(records.map(r => r.name));
    return VACCINATIONS.filter(v => needed.has(v.name) && !existing.has(v.name));
  }, [currentLocation, trackedCountries, records]);

  const quickAdd = (vaccine: VaccinationInfo) => {
    const today = new Date();
    const years = vaccine.durationYears === 0 ? 1 : vaccine.durationYears === 99 ? 50 : vaccine.durationYears;
    const expiry = new Date(today.getTime() + years * 365.25 * 86400000);
    onAdd({
      id: Date.now().toString(),
      vaccineId: vaccine.id,
      name: vaccine.name,
      dateReceived: today.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      notes: 'Quick added — update date if needed',
    });
    toast({ title: '💉 Vaccination Added', description: `${vaccine.name} recorded.` });
  };

  return (
    <div className="space-y-4">
      {/* Recommendations */}
      {recommended.length > 0 && (
        <Card className="border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.05)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-[hsl(var(--warning-dark))]">
              <AlertTriangle className="w-4 h-4" />
              Recommended for Your Destinations ({recommended.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recommended.slice(0, 6).map(v => (
              <div key={v.id} className="flex items-center justify-between p-2 bg-card rounded-lg border">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Badge className={CATEGORY_COLORS[v.category]} variant="outline">{v.name}</Badge>
                  <span className="text-xs text-muted-foreground truncate">{v.costRange}</span>
                </div>
                <Button onClick={() => quickAdd(v)} size="sm" variant="outline" className="text-xs shrink-0">
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* User's Records */}
      {records.length > 0 ? (
        <div className="space-y-2">
          {records.map(r => {
            const status = getStatus(r.expiryDate);
            return (
              <div key={r.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {status === 'expired' && <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />}
                  {status === 'expiring' && <Bell className="w-4 h-4 text-[hsl(var(--warning))] shrink-0" />}
                  {status === 'valid' && <CheckCircle className="w-4 h-4 text-[hsl(var(--success))] shrink-0" />}
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">Expires: {new Date(r.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={status === 'expired' ? 'destructive' : status === 'expiring' ? 'secondary' : 'default'}
                    className={status === 'valid' ? 'bg-[hsl(var(--success))] text-white' : ''}>
                    {status === 'expired' ? 'Expired' : status === 'expiring' ? 'Expiring' : 'Valid'}
                  </Badge>
                  <Button onClick={() => onRemove(r.id)} variant="ghost" size="sm"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Syringe className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No vaccinations tracked yet</p>
          <p className="text-xs">Add your vaccination records to get travel alerts</p>
        </div>
      )}

      <Button onClick={() => setIsAddOpen(true)} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Vaccination Record
      </Button>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Vaccination</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Vaccination</Label>
              <Select value={selectedVaccine} onValueChange={setSelectedVaccine}>
                <SelectTrigger><SelectValue placeholder="Select vaccination..." /></SelectTrigger>
                <SelectContent>
                  {VACCINATIONS.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.name} ({v.costRange})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date Received</Label>
              <Input type="date" value={dateReceived} onChange={e => setDateReceived(e.target.value)} />
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Clinic, batch number..." />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!selectedVaccine || !dateReceived} className="flex-1">Add</Button>
              <Button onClick={() => setIsAddOpen(false)} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const VaccineDirectory: React.FC<{ search: string }> = ({ search }) => {
  const filtered = VACCINATIONS.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.description.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = Object.entries(
    filtered.reduce<Record<string, typeof filtered>>((acc, v) => {
      (acc[v.category] ??= []).push(v);
      return acc;
    }, {})
  );

  return (
    <div className="space-y-4">
      {grouped.map(([cat, vaccines]) => (
        <div key={cat}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">{CATEGORY_LABELS[cat]}</h3>
          <div className="space-y-2">
            {vaccines.map(v => (
              <Collapsible key={v.id}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:bg-accent/30 transition-colors">
                    <CardContent className="p-3 flex items-center gap-3">
                      <Syringe className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{v.name}</span>
                          <Badge className={CATEGORY_COLORS[v.category]} variant="outline">{v.category}</Badge>
                          {v.whoRecommended && <Badge variant="secondary" className="text-xs">WHO</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{v.description}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-4 p-3 border-l-2 border-primary/20 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Duration: {v.durationYears === 99 ? 'Lifetime' : v.durationYears === 0 ? 'Per trip' : `${v.durationYears} years`}</div>
                      <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Cost: {v.costRange}</div>
                    </div>
                    <p className="text-xs"><strong>Side effects:</strong> {v.sideEffects}</p>
                    {v.requiredCountries.length > 0 && (
                      <p className="text-xs"><strong>Required in:</strong> {v.requiredCountries.join(', ')}</p>
                    )}
                    <p className="text-xs"><strong>Recommended regions:</strong> {v.recommendedRegions.join(', ')}</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      ))}
      {grouped.length === 0 && (
        <p className="text-center text-muted-foreground py-6">No vaccinations match your search.</p>
      )}
    </div>
  );
};

const ClinicFinder: React.FC<{ search: string }> = ({ search }) => {
  const filtered = VACCINATION_CLINICS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.countries.some(co => co.toLowerCase().includes(search.toLowerCase())) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {filtered.map(clinic => (
        <Card key={clinic.name} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <h4 className="font-semibold text-sm">{clinic.name}</h4>
                  <Badge variant="outline" className="text-xs capitalize">{clinic.type}</Badge>
                  {clinic.yellowFeverCertified && <Badge className="bg-[hsl(var(--warning))] text-foreground text-xs">Yellow Fever</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{clinic.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" /> {clinic.countries.join(', ')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {clinic.services.map(s => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <a href={clinic.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" /> Visit
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-6">No clinics match your search.</p>
      )}
    </div>
  );
};

const CountryRequirements: React.FC<{ search: string }> = ({ search }) => {
  const filtered = COUNTRY_REQUIREMENTS.filter(c =>
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {filtered.map(cr => (
        <Collapsible key={cr.code}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent/30 transition-colors">
              <CardContent className="p-3 flex items-center gap-3">
                <span className="text-xl">{String.fromCodePoint(...[...cr.code.toUpperCase()].map(c => 0x1F1E6 - 65 + c.charCodeAt(0)))}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{cr.country}</span>
                    {cr.yellowFeverCertificate && <Badge variant="destructive" className="text-xs">Yellow Fever Required</Badge>}
                    {cr.malariaRisk && <Badge className="bg-[hsl(var(--warning))] text-foreground text-xs">Malaria Risk</Badge>}
                    {cr.required.length === 0 && !cr.malariaRisk && <Badge variant="secondary" className="text-xs">Low Risk</Badge>}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-4 p-3 border-l-2 border-primary/20 space-y-2 text-sm">
              {cr.required.length > 0 && (
                <div>
                  <p className="font-semibold text-xs text-destructive mb-1">Required:</p>
                  <div className="flex flex-wrap gap-1">
                    {cr.required.map(v => <Badge key={v} variant="destructive" className="text-xs">{v}</Badge>)}
                  </div>
                </div>
              )}
              <div>
                <p className="font-semibold text-xs text-muted-foreground mb-1">Recommended:</p>
                <div className="flex flex-wrap gap-1">
                  {cr.recommended.map(v => <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>)}
                </div>
              </div>
              <p className="text-xs"><strong>COVID-19:</strong> {cr.covidEntry}</p>
              <p className="text-xs text-muted-foreground">{cr.notes}</p>
              <Button asChild variant="outline" size="sm">
                <a href={cr.governmentHealthPortal} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-3 h-3 mr-1" /> Official Health Portal
                </a>
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-6">No countries match your search.</p>
      )}
    </div>
  );
};

// --- Main Component ---

interface VaccinationMedicineHubProps {
  currentLocation?: LocationData | null;
  trackedCountries?: Array<{ name: string; code: string }>;
}

const VaccinationMedicineHub: React.FC<VaccinationMedicineHubProps> = ({
  currentLocation,
  trackedCountries = []
}) => {
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState<UserVaccination[]>(() => {
    try { return JSON.parse(localStorage.getItem('vaccination-records') || '[]'); } catch { return []; }
  });

  const saveRecords = (updated: UserVaccination[]) => {
    setRecords(updated);
    localStorage.setItem('vaccination-records', JSON.stringify(updated));
  };

  const stats = useMemo(() => ({
    total: records.length,
    valid: records.filter(r => new Date(r.expiryDate) > new Date()).length,
    expiring: records.filter(r => {
      const exp = new Date(r.expiryDate);
      const now = new Date();
      return exp > now && exp <= new Date(now.getTime() + 30 * 86400000);
    }).length,
    expired: records.filter(r => new Date(r.expiryDate) <= new Date()).length,
  }), [records]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Syringe className="w-6 h-6 text-primary" />
          Vaccination & Medicine Hub
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Global vaccination requirements, certified clinics & your personal health records
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-3 text-center">
          <Syringe className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Recorded</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <CheckCircle className="w-5 h-5 mx-auto mb-1 text-[hsl(var(--success))]" />
          <p className="text-xl font-bold text-[hsl(var(--success))]">{stats.valid}</p>
          <p className="text-xs text-muted-foreground">Valid</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <Bell className="w-5 h-5 mx-auto mb-1 text-[hsl(var(--warning))]" />
          <p className="text-xl font-bold text-[hsl(var(--warning))]">{stats.expiring}</p>
          <p className="text-xs text-muted-foreground">Expiring</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-destructive" />
          <p className="text-xl font-bold text-destructive">{stats.expired}</p>
          <p className="text-xs text-muted-foreground">Expired</p>
        </CardContent></Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search vaccinations, clinics, countries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-records" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="my-records" className="text-xs sm:text-sm">My Records</TabsTrigger>
          <TabsTrigger value="vaccines" className="text-xs sm:text-sm">All Vaccines</TabsTrigger>
          <TabsTrigger value="clinics" className="text-xs sm:text-sm">Clinics</TabsTrigger>
          <TabsTrigger value="countries" className="text-xs sm:text-sm">By Country</TabsTrigger>
        </TabsList>

        <TabsContent value="my-records" className="mt-4">
          <MyVaccinations
            records={records}
            onAdd={v => saveRecords([...records, v])}
            onRemove={id => saveRecords(records.filter(r => r.id !== id))}
            currentLocation={currentLocation}
            trackedCountries={trackedCountries}
          />
        </TabsContent>

        <TabsContent value="vaccines" className="mt-4">
          <VaccineDirectory search={search} />
        </TabsContent>

        <TabsContent value="clinics" className="mt-4">
          <ClinicFinder search={search} />
        </TabsContent>

        <TabsContent value="countries" className="mt-4">
          <CountryRequirements search={search} />
        </TabsContent>
      </Tabs>

      {/* WHO Reference */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <p className="font-semibold">Sources & References</p>
            <p className="text-muted-foreground">
              Data sourced from WHO International Travel & Health, CDC Travelers' Health, NaTHNaC, and national health ministries.
              Always consult a travel medicine professional 4-6 weeks before departure.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button asChild variant="outline" size="sm">
                <a href="https://www.who.int/travel-advice" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" /> WHO Travel
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="https://wwwnc.cdc.gov/travel" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" /> CDC Travel
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="https://travelhealthpro.org.uk" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" /> NaTHNaC
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VaccinationMedicineHub;
