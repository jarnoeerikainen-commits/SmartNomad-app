import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Bell,
  Car,
  Globe,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  type: 'passport' | 'license';
  country: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority?: string;
  licenseClass?: string; // For driving licenses
  notes?: string;
}

const COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
  'Canada', 'Australia', 'New Zealand', 'Japan', 'South Korea', 'Singapore', 'China',
  'India', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'Sweden', 'Norway', 'Denmark',
  'Finland', 'Switzerland', 'Austria', 'Belgium', 'Ireland', 'Portugal', 'Greece',
  'Poland', 'Czech Republic', 'Hungary', 'Croatia', 'Slovenia', 'Estonia', 'Latvia',
  'Lithuania', 'Luxembourg', 'Malta', 'Cyprus', 'Bulgaria', 'Romania', 'Slovakia'
];

const LICENSE_CLASSES = [
  'Class A (Commercial)', 'Class B (Commercial)', 'Class C (Regular)', 'Class D (Motorcycle)',
  'Class M (Motorcycle)', 'CDL A', 'CDL B', 'CDL C', 'International Driving Permit',
  'EU License', 'Motorcycle Only', 'Restricted', 'Provisional', 'Full License'
];

export const DocumentTracker: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<'passport' | 'license'>('passport');
  const [documentForm, setDocumentForm] = useState({
    country: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
    licenseClass: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedDocuments = localStorage.getItem('trackedDocuments');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('trackedDocuments', JSON.stringify(documents));
    checkExpiringDocuments();
  }, [documents]);

  const checkExpiringDocuments = () => {
    const today = new Date();
    const sixMonthsFromNow = new Date(today.getTime() + (180 * 24 * 60 * 60 * 1000));
    
    documents.forEach(document => {
      const expiryDate = new Date(document.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (expiryDate <= sixMonthsFromNow && expiryDate > today) {
        toast({
          title: `📄 ${document.type === 'passport' ? 'Passport' : 'License'} Expiring Soon`,
          description: `${document.country} ${document.type} expires in ${daysUntilExpiry} days`,
          variant: "destructive"
        });
      } else if (expiryDate <= today) {
        toast({
          title: `📄 ${document.type === 'passport' ? 'Passport' : 'License'} Expired`,
          description: `${document.country} ${document.type} expired on ${expiryDate.toLocaleDateString()}`,
          variant: "destructive"
        });
      }
    });
  };

  const addDocument = () => {
    if (!documentForm.country || !documentForm.issueDate || !documentForm.expiryDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newDocument: Document = {
      id: Date.now().toString(),
      type: selectedDocumentType,
      ...documentForm
    };

    setDocuments(prev => [...prev, newDocument]);
    setIsAddModalOpen(false);
    setDocumentForm({
      country: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
      licenseClass: '',
      notes: ''
    });

    toast({
      title: "Document Added",
      description: `${selectedDocumentType === 'passport' ? 'Passport' : 'Driving License'} has been added to your records.`,
    });
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Document Removed",
      description: "Document has been removed from your records.",
    });
  };

  const getDocumentStatus = (document: Document) => {
    const expiryDate = new Date(document.expiryDate);
    const today = new Date();
    const sixMonthsFromNow = new Date(today.getTime() + (180 * 24 * 60 * 60 * 1000));

    if (expiryDate <= today) return 'expired';
    if (expiryDate <= sixMonthsFromNow) return 'expiring';
    return 'valid';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'expiring': return <Bell className="w-4 h-4 text-orange-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'expired': return <Badge variant="destructive">Expired</Badge>;
      case 'expiring': return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Expiring Soon</Badge>;
      default: return <Badge className="bg-green-100 text-green-700">Valid</Badge>;
    }
  };

  const passports = documents.filter(d => d.type === 'passport');
  const licenses = documents.filter(d => d.type === 'license');

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <FileText className="w-5 h-5" />
          Document Tracker
        </CardTitle>
        <p className="text-sm text-blue-600">
          Track your passports and driving licenses with expiry monitoring
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="passports" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="passports" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Passports ({passports.length})
            </TabsTrigger>
            <TabsTrigger value="licenses" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Licenses ({licenses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="passports" className="space-y-3 mt-4">
            {passports.length > 0 ? (
              <div className="space-y-3">
                {passports.map(passport => {
                  const status = getDocumentStatus(passport);
                  return (
                    <div key={passport.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{passport.country} Passport</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Expires: {new Date(passport.expiryDate).toLocaleDateString()}
                          </p>
                          {passport.notes && (
                            <p className="text-xs text-gray-600">{passport.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(status)}
                        <Button
                          onClick={() => removeDocument(passport.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-6 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No passports tracked yet</p>
              </div>
            )}
            
            <Button 
              onClick={() => {
                setSelectedDocumentType('passport');
                setIsAddModalOpen(true);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Passport
            </Button>
          </TabsContent>

          <TabsContent value="licenses" className="space-y-3 mt-4">
            {licenses.length > 0 ? (
              <div className="space-y-3">
                {licenses.map(license => {
                  const status = getDocumentStatus(license);
                  return (
                    <div key={license.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{license.country} License</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Expires: {new Date(license.expiryDate).toLocaleDateString()}
                          </p>
                          {license.licenseClass && (
                            <p className="text-xs text-blue-600">{license.licenseClass}</p>
                          )}
                          {license.notes && (
                            <p className="text-xs text-gray-600">{license.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(status)}
                        <Button
                          onClick={() => removeDocument(license.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-6 text-gray-500">
                <Car className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No licenses tracked yet</p>
              </div>
            )}
            
            <Button 
              onClick={() => {
                setSelectedDocumentType('license');
                setIsAddModalOpen(true);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add License
            </Button>
          </TabsContent>
        </Tabs>

        {/* Add Document Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Add {selectedDocumentType === 'passport' ? 'Passport' : 'Driving License'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Country/State *</Label>
                <Select 
                  value={documentForm.country} 
                  onValueChange={(value) => setDocumentForm(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country/state..." />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDocumentType === 'license' && (
                <div>
                  <Label>License Class</Label>
                  <Select 
                    value={documentForm.licenseClass} 
                    onValueChange={(value) => setDocumentForm(prev => ({ ...prev, licenseClass: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select license class..." />
                    </SelectTrigger>
                    <SelectContent>
                      {LICENSE_CLASSES.map(licenseClass => (
                        <SelectItem key={licenseClass} value={licenseClass}>{licenseClass}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label>Issue Date *</Label>
                <Input
                  type="date"
                  value={documentForm.issueDate}
                  onChange={(e) => setDocumentForm(prev => ({ ...prev, issueDate: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Expiry Date *</Label>
                <Input
                  type="date"
                  value={documentForm.expiryDate}
                  onChange={(e) => setDocumentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Issuing Authority</Label>
                <Input
                  value={documentForm.issuingAuthority}
                  onChange={(e) => setDocumentForm(prev => ({ ...prev, issuingAuthority: e.target.value }))}
                  placeholder={selectedDocumentType === 'passport' ? 'e.g. US Department of State' : 'e.g. DMV, DVLA'}
                />
              </div>
              
              <div>
                <Label>Notes</Label>
                <Input
                  value={documentForm.notes}
                  onChange={(e) => setDocumentForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={addDocument}
                  className="flex-1"
                >
                  Add {selectedDocumentType === 'passport' ? 'Passport' : 'License'}
                </Button>
                <Button
                  onClick={() => setIsAddModalOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};