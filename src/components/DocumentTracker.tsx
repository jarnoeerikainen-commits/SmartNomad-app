import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, Plus, AlertTriangle, CheckCircle, Bell, Car, Globe, X, Check, ChevronsUpDown,
  Shield, Heart, Briefcase, CreditCard, Home, Search, Clock, GraduationCap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ALL_COUNTRIES } from '@/data/countries';
import { cn } from '@/lib/utils';

type DocumentType = 'passport' | 'license' | 'id_card' | 'residence_permit' | 'health_insurance' | 'travel_insurance' | 'work_permit' | 'visa_document' | 'tax_id' | 'student_card';

interface Document {
  id: string;
  type: DocumentType;
  country: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority?: string;
  licenseClass?: string;
  documentNumber?: string;
  notes?: string;
}

const DOC_TYPES: Array<{
  id: DocumentType;
  label: string;
  icon: React.ReactNode;
  description: string;
}> = [
  { id: 'passport', label: 'Passport', icon: <Globe className="w-4 h-4" />, description: 'National passport' },
  { id: 'license', label: 'Driving License', icon: <Car className="w-4 h-4" />, description: 'Driving license / IDP' },
  { id: 'id_card', label: 'National ID Card', icon: <CreditCard className="w-4 h-4" />, description: 'Government-issued ID' },
  { id: 'residence_permit', label: 'Residence Permit', icon: <Home className="w-4 h-4" />, description: 'Residence / stay permit' },
  { id: 'health_insurance', label: 'Health Insurance', icon: <Heart className="w-4 h-4" />, description: 'Health coverage card' },
  { id: 'travel_insurance', label: 'Travel Insurance', icon: <Shield className="w-4 h-4" />, description: 'Travel insurance policy' },
  { id: 'work_permit', label: 'Work Permit', icon: <Briefcase className="w-4 h-4" />, description: 'Work authorization' },
  { id: 'visa_document', label: 'Visa Sticker/Doc', icon: <FileText className="w-4 h-4" />, description: 'Physical visa document' },
  { id: 'tax_id', label: 'Tax ID / TIN', icon: <FileText className="w-4 h-4" />, description: 'Tax identification number' },
  { id: 'student_card', label: 'Student Card', icon: <GraduationCap className="w-4 h-4" />, description: 'Student ID / ISIC' },
];

const COUNTRIES = ALL_COUNTRIES.map(c => ({
  value: c.name,
  label: `${c.flag} ${c.name}`
})).sort((a, b) => a.value.localeCompare(b.value));

const LICENSE_CLASSES = [
  'Class A (Commercial)', 'Class B (Commercial)', 'Class C (Regular)', 'Class D (Motorcycle)',
  'Class M (Motorcycle)', 'CDL A', 'CDL B', 'CDL C', 'International Driving Permit',
  'EU License', 'Motorcycle Only', 'Restricted', 'Provisional', 'Full License'
];

const getDocStatus = (expiryDate: string) => {
  const exp = new Date(expiryDate);
  const today = new Date();
  const daysLeft = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const threeMonths = 90;
  const sixMonths = 180;

  if (daysLeft <= 0) return { status: 'expired' as const, label: 'Expired', daysLeft };
  if (daysLeft <= threeMonths) return { status: 'critical' as const, label: `${daysLeft}d left`, daysLeft };
  if (daysLeft <= sixMonths) return { status: 'expiring' as const, label: `${daysLeft}d left`, daysLeft };
  return { status: 'valid' as const, label: 'Valid', daysLeft };
};

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'expired': return <AlertTriangle className="w-4 h-4 text-destructive" />;
    case 'critical': return <AlertTriangle className="w-4 h-4 text-destructive" />;
    case 'expiring': return <Bell className="w-4 h-4 text-amber-500" />;
    default: return <CheckCircle className="w-4 h-4 text-emerald-500" />;
  }
};

// Document card component
const DocumentCard: React.FC<{ doc: Document; onRemove: (id: string) => void }> = ({ doc, onRemove }) => {
  const statusInfo = getDocStatus(doc.expiryDate);
  const docType = DOC_TYPES.find(d => d.id === doc.type);
  const pct = statusInfo.daysLeft > 0 ? Math.max(0, Math.min(100, (1 - statusInfo.daysLeft / 365) * 100)) : 100;

  return (
    <Card className={`transition-all hover:shadow-md ${
      statusInfo.status === 'expired' ? 'ring-2 ring-destructive/30 opacity-80' :
      statusInfo.status === 'critical' ? 'ring-2 ring-destructive/20' :
      statusInfo.status === 'expiring' ? 'ring-1 ring-amber-300/50' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              {docType?.icon || <FileText className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="font-semibold text-sm">{doc.country} {docType?.label}</h4>
              {doc.documentNumber && (
                <p className="text-xs text-muted-foreground">#{doc.documentNumber}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon status={statusInfo.status} />
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onRemove(doc.id)}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Status bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              Issued: {new Date(doc.issueDate).toLocaleDateString()}
            </span>
            <span className={`font-medium ${
              statusInfo.status === 'expired' || statusInfo.status === 'critical' ? 'text-destructive' :
              statusInfo.status === 'expiring' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {statusInfo.status === 'expired' ? 'Expired' :
               `Expires: ${new Date(doc.expiryDate).toLocaleDateString()}`}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                statusInfo.status === 'expired' || statusInfo.status === 'critical' ? 'bg-destructive' :
                statusInfo.status === 'expiring' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${100 - pct}%` }}
            />
          </div>
        </div>

        {/* Extra info */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {doc.licenseClass && <Badge variant="outline" className="text-xs">{doc.licenseClass}</Badge>}
          {doc.issuingAuthority && <Badge variant="outline" className="text-xs">{doc.issuingAuthority}</Badge>}
          {doc.notes && <span className="text-xs text-muted-foreground">{doc.notes}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export const DocumentTracker: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>('passport');
  const [countrySearchOpen, setCountrySearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [documentForm, setDocumentForm] = useState({
    country: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
    licenseClass: '',
    documentNumber: '',
    notes: ''
  });
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem('trackedDocuments');
    if (saved) setDocuments(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('trackedDocuments', JSON.stringify(documents));
  }, [documents]);

  // Filtered and sorted documents
  const filteredDocs = useMemo(() => {
    let result = [...documents];

    if (filterType !== 'all') {
      result = result.filter(d => d.type === filterType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.country.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.documentNumber?.toLowerCase().includes(q) ||
        d.notes?.toLowerCase().includes(q)
      );
    }

    // Sort: expired first, then by expiry date ascending
    result.sort((a, b) => {
      const statusA = getDocStatus(a.expiryDate);
      const statusB = getDocStatus(b.expiryDate);
      return statusA.daysLeft - statusB.daysLeft;
    });

    return result;
  }, [documents, filterType, searchQuery]);

  // Summary stats
  const stats = useMemo(() => {
    const expired = documents.filter(d => getDocStatus(d.expiryDate).status === 'expired').length;
    const expiringSoon = documents.filter(d => ['critical', 'expiring'].includes(getDocStatus(d.expiryDate).status)).length;
    const valid = documents.filter(d => getDocStatus(d.expiryDate).status === 'valid').length;
    return { expired, expiringSoon, valid, total: documents.length };
  }, [documents]);

  const addDocument = () => {
    if (!documentForm.country || !documentForm.issueDate || !documentForm.expiryDate) {
      toast({ title: "Missing information", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const newDocument: Document = {
      id: Date.now().toString(),
      type: selectedDocumentType,
      ...documentForm
    };

    setDocuments(prev => [...prev, newDocument]);
    setIsAddModalOpen(false);
    setDocumentForm({ country: '', issueDate: '', expiryDate: '', issuingAuthority: '', licenseClass: '', documentNumber: '', notes: '' });
    toast({ title: "Document Added", description: `${DOC_TYPES.find(d => d.id === selectedDocumentType)?.label} has been added.` });
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast({ title: "Document Removed" });
  };

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </Card>
        <Card className={`p-3 ${stats.expired > 0 ? 'ring-1 ring-destructive/30' : ''}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <div>
              <div className="text-xl font-bold">{stats.expired}</div>
              <div className="text-xs text-muted-foreground">Expired</div>
            </div>
          </div>
        </Card>
        <Card className={`p-3 ${stats.expiringSoon > 0 ? 'ring-1 ring-amber-300/50' : ''}`}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <div>
              <div className="text-xl font-bold">{stats.expiringSoon}</div>
              <div className="text-xs text-muted-foreground">Expiring</div>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="text-xl font-bold">{stats.valid}</div>
              <div className="text-xs text-muted-foreground">Valid</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and filter */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {DOC_TYPES.map(dt => (
                  <SelectItem key={dt.id} value={dt.id}>{dt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Document cards */}
          {filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDocs.map(doc => (
                <DocumentCard key={doc.id} doc={doc} onRemove={removeDocument} />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Add your passports, IDs, permits, insurance cards and other important travel documents.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No documents match your search</p>
            </div>
          )}

          {/* Add document button - now shows type selector first */}
          <Button onClick={() => setIsAddModalOpen(true)} className="w-full" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Document
          </Button>
        </CardContent>
      </Card>

      {/* Add Document Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Document type selector */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Document Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {DOC_TYPES.map(dt => (
                  <button
                    key={dt.id}
                    onClick={() => setSelectedDocumentType(dt.id)}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-lg border text-left text-sm transition-all",
                      selectedDocumentType === dt.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {dt.icon}
                    <span className="font-medium">{dt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Country selector */}
            <div>
              <Label>Country / State *</Label>
              <Popover open={countrySearchOpen} onOpenChange={setCountrySearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {documentForm.country
                      ? COUNTRIES.find(c => c.value === documentForm.country)?.label
                      : "Select country..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {COUNTRIES.map(c => (
                          <CommandItem
                            key={c.value}
                            value={c.value}
                            onSelect={(v) => { setDocumentForm(prev => ({ ...prev, country: v })); setCountrySearchOpen(false); }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", documentForm.country === c.value ? "opacity-100" : "opacity-0")} />
                            {c.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Document number */}
            <div>
              <Label>Document Number</Label>
              <Input
                value={documentForm.documentNumber}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, documentNumber: e.target.value }))}
                placeholder="e.g. AB1234567"
              />
            </div>

            {/* License class - only for driving license */}
            {selectedDocumentType === 'license' && (
              <div>
                <Label>License Class</Label>
                <Select value={documentForm.licenseClass} onValueChange={(v) => setDocumentForm(prev => ({ ...prev, licenseClass: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select class..." /></SelectTrigger>
                  <SelectContent>
                    {LICENSE_CLASSES.map(lc => (
                      <SelectItem key={lc} value={lc}>{lc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Issue Date *</Label>
                <Input type="date" value={documentForm.issueDate} onChange={(e) => setDocumentForm(prev => ({ ...prev, issueDate: e.target.value }))} />
              </div>
              <div>
                <Label>Expiry Date *</Label>
                <Input type="date" value={documentForm.expiryDate} onChange={(e) => setDocumentForm(prev => ({ ...prev, expiryDate: e.target.value }))} />
              </div>
            </div>
            
            {/* Authority */}
            <div>
              <Label>Issuing Authority</Label>
              <Input
                value={documentForm.issuingAuthority}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, issuingAuthority: e.target.value }))}
                placeholder="e.g. US Dept. of State"
              />
            </div>
            
            {/* Notes */}
            <div>
              <Label>Notes</Label>
              <Input
                value={documentForm.notes}
                onChange={(e) => setDocumentForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes..."
              />
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button onClick={addDocument} className="flex-1">
                Add {DOC_TYPES.find(d => d.id === selectedDocumentType)?.label}
              </Button>
              <Button onClick={() => setIsAddModalOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
