import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, Download, Eye, CheckCircle2, AlertTriangle, 
  Plane, Building2, Shield, CreditCard, Globe, 
  Stamp, FileCheck, Printer, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';

// ─── Document Templates ────────────────────────────────────
interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'readonly';
  options?: string[];
  autoFillKey?: string;
  required?: boolean;
  value?: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  category: 'visa' | 'tax' | 'embassy' | 'customs' | 'insurance' | 'business';
  country?: string;
  icon: string;
  description: string;
  fields: DocumentField[];
  officialUrl?: string;
  processingTime?: string;
}

const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'schengen-visa',
    name: 'Schengen Visa Application',
    category: 'visa',
    country: 'EU/Schengen',
    icon: '🇪🇺',
    description: 'Standard Schengen visa application form for stays up to 90 days',
    processingTime: '15 calendar days',
    officialUrl: 'https://ec.europa.eu/home-affairs/policies/schengen-borders-and-visa/visa-policy_en',
    fields: [
      { id: 'surname', label: 'Surname (Family name)', type: 'text', autoFillKey: 'lastName', required: true },
      { id: 'firstName', label: 'First name(s)', type: 'text', autoFillKey: 'firstName', required: true },
      { id: 'dob', label: 'Date of birth', type: 'date', autoFillKey: 'dateOfBirth', required: true },
      { id: 'nationality', label: 'Current nationality', type: 'text', autoFillKey: 'nationality', required: true },
      { id: 'passportNo', label: 'Passport number', type: 'text', autoFillKey: 'passportNumber', required: true },
      { id: 'passportIssued', label: 'Passport date of issue', type: 'date', autoFillKey: 'passportIssueDate' },
      { id: 'passportExpiry', label: 'Passport valid until', type: 'date', autoFillKey: 'passportExpiry', required: true },
      { id: 'purpose', label: 'Purpose of journey', type: 'select', options: ['Tourism', 'Business', 'Visiting family/friends', 'Cultural', 'Sports', 'Official visit', 'Medical', 'Study', 'Transit', 'Other'], required: true },
      { id: 'entryDate', label: 'Intended date of arrival', type: 'date', required: true },
      { id: 'exitDate', label: 'Intended date of departure', type: 'date', required: true },
      { id: 'memberState', label: 'Member State of main destination', type: 'text', required: true },
      { id: 'accommodation', label: 'Address in Schengen area', type: 'text' },
      { id: 'email', label: 'Email address', type: 'text', autoFillKey: 'email' },
      { id: 'phone', label: 'Telephone number', type: 'text', autoFillKey: 'phone' },
    ],
  },
  {
    id: 'us-esta',
    name: 'US ESTA Application',
    category: 'visa',
    country: 'United States',
    icon: '🇺🇸',
    description: 'Electronic System for Travel Authorization for Visa Waiver Program countries',
    processingTime: '72 hours',
    officialUrl: 'https://esta.cbp.dhs.gov/',
    fields: [
      { id: 'surname', label: 'Family name', type: 'text', autoFillKey: 'lastName', required: true },
      { id: 'firstName', label: 'First (given) name', type: 'text', autoFillKey: 'firstName', required: true },
      { id: 'dob', label: 'Date of birth', type: 'date', autoFillKey: 'dateOfBirth', required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true },
      { id: 'citizenship', label: 'Country of citizenship', type: 'text', autoFillKey: 'nationality', required: true },
      { id: 'passportNo', label: 'Passport number', type: 'text', autoFillKey: 'passportNumber', required: true },
      { id: 'passportCountry', label: 'Country of issuance', type: 'text', autoFillKey: 'passportCountry', required: true },
      { id: 'passportExpiry', label: 'Passport expiration date', type: 'date', autoFillKey: 'passportExpiry', required: true },
      { id: 'email', label: 'Email', type: 'text', autoFillKey: 'email', required: true },
      { id: 'phone', label: 'Phone number', type: 'text', autoFillKey: 'phone' },
      { id: 'employer', label: 'Employer or school', type: 'text', autoFillKey: 'employer' },
      { id: 'usAddress', label: 'Address while in the US', type: 'text' },
      { id: 'emergencyContact', label: 'Emergency contact name', type: 'text' },
      { id: 'emergencyPhone', label: 'Emergency contact phone', type: 'text' },
    ],
  },
  {
    id: 'etias-eu',
    name: 'EU ETIAS Application',
    category: 'visa',
    country: 'EU/Schengen',
    icon: '🇪🇺',
    description: 'European Travel Information and Authorisation System (mandatory from 2026)',
    processingTime: '96 hours (usually minutes)',
    officialUrl: 'https://travel-europe.europa.eu/etias_en',
    fields: [
      { id: 'surname', label: 'Surname', type: 'text', autoFillKey: 'lastName', required: true },
      { id: 'firstName', label: 'First name(s)', type: 'text', autoFillKey: 'firstName', required: true },
      { id: 'dob', label: 'Date of birth', type: 'date', autoFillKey: 'dateOfBirth', required: true },
      { id: 'nationality', label: 'Nationality', type: 'text', autoFillKey: 'nationality', required: true },
      { id: 'passportNo', label: 'Travel document number', type: 'text', autoFillKey: 'passportNumber', required: true },
      { id: 'passportExpiry', label: 'Document expiry date', type: 'date', autoFillKey: 'passportExpiry', required: true },
      { id: 'email', label: 'Email', type: 'text', autoFillKey: 'email', required: true },
      { id: 'address', label: 'Home address', type: 'text', autoFillKey: 'address' },
      { id: 'firstMemberState', label: 'First EU country of entry', type: 'text', required: true },
    ],
  },
  {
    id: 'india-evisa',
    name: 'India e-Visa Application',
    category: 'visa',
    country: 'India',
    icon: '🇮🇳',
    description: 'Electronic visa for tourism, business, medical, and conference visits',
    processingTime: '72 hours',
    officialUrl: 'https://indianvisaonline.gov.in/',
    fields: [
      { id: 'surname', label: 'Surname', type: 'text', autoFillKey: 'lastName', required: true },
      { id: 'firstName', label: 'Given name', type: 'text', autoFillKey: 'firstName', required: true },
      { id: 'dob', label: 'Date of birth', type: 'date', autoFillKey: 'dateOfBirth', required: true },
      { id: 'nationality', label: 'Nationality', type: 'text', autoFillKey: 'nationality', required: true },
      { id: 'passportNo', label: 'Passport number', type: 'text', autoFillKey: 'passportNumber', required: true },
      { id: 'passportExpiry', label: 'Passport expiry date', type: 'date', autoFillKey: 'passportExpiry', required: true },
      { id: 'visaType', label: 'Visa type', type: 'select', options: ['e-Tourist', 'e-Business', 'e-Medical', 'e-Conference'], required: true },
      { id: 'portOfArrival', label: 'Expected port of arrival', type: 'select', options: ['Delhi (DEL)', 'Mumbai (BOM)', 'Bengaluru (BLR)', 'Chennai (MAA)', 'Kolkata (CCU)', 'Hyderabad (HYD)', 'Kochi (COK)', 'Goa (GOI)', 'Navi Mumbai (NMIAL)'], required: true },
      { id: 'email', label: 'Email', type: 'text', autoFillKey: 'email', required: true },
      { id: 'phone', label: 'Phone', type: 'text', autoFillKey: 'phone' },
      { id: 'referenceInIndia', label: 'Reference name in India', type: 'text' },
    ],
  },
  {
    id: 'customs-declaration',
    name: 'Customs Declaration Form',
    category: 'customs',
    icon: '🛃',
    description: 'Universal customs declaration — auto-populated for most countries',
    fields: [
      { id: 'fullName', label: 'Full name as on passport', type: 'text', autoFillKey: 'fullName', required: true },
      { id: 'dob', label: 'Date of birth', type: 'date', autoFillKey: 'dateOfBirth', required: true },
      { id: 'nationality', label: 'Country of citizenship', type: 'text', autoFillKey: 'nationality', required: true },
      { id: 'passportNo', label: 'Passport number', type: 'text', autoFillKey: 'passportNumber', required: true },
      { id: 'flightNo', label: 'Flight number', type: 'text' },
      { id: 'residenceCountry', label: 'Country of residence', type: 'text', autoFillKey: 'residence' },
      { id: 'purposeOfVisit', label: 'Purpose of visit', type: 'select', options: ['Business', 'Pleasure', 'Both'], required: true },
      { id: 'declarationAmount', label: 'Total value of goods (USD)', type: 'text', value: '0' },
      { id: 'accompaniedItems', label: 'Items to declare', type: 'text', value: 'None' },
    ],
  },
  {
    id: 'tax-residency-cert',
    name: 'Tax Residency Certificate Request',
    category: 'tax',
    icon: '📋',
    description: 'Request form for certificate of tax residence — needed for DTA claims',
    fields: [
      { id: 'fullName', label: 'Full legal name', type: 'text', autoFillKey: 'fullName', required: true },
      { id: 'taxId', label: 'Tax Identification Number (TIN)', type: 'text', autoFillKey: 'taxId', required: true },
      { id: 'residenceCountry', label: 'Country of tax residence', type: 'text', autoFillKey: 'residence', required: true },
      { id: 'address', label: 'Residential address', type: 'text', autoFillKey: 'address', required: true },
      { id: 'taxYear', label: 'Tax year', type: 'text', value: '2025-2026' },
      { id: 'purpose', label: 'Purpose of certificate', type: 'select', options: ['Double Tax Agreement', 'Bank account opening', 'Investment verification', 'Other'], required: true },
      { id: 'requestingCountry', label: 'Treaty country', type: 'text' },
    ],
  },
  {
    id: 'w8ben',
    name: 'US W-8BEN Form',
    category: 'tax',
    country: 'United States',
    icon: '🇺🇸',
    description: 'Certificate of foreign status — for non-US persons receiving US-source income',
    officialUrl: 'https://www.irs.gov/forms-pubs/about-form-w-8-ben',
    fields: [
      { id: 'fullName', label: 'Name of beneficial owner', type: 'text', autoFillKey: 'fullName', required: true },
      { id: 'citizenship', label: 'Country of citizenship', type: 'text', autoFillKey: 'nationality', required: true },
      { id: 'address', label: 'Permanent residence address', type: 'text', autoFillKey: 'address', required: true },
      { id: 'dob', label: 'Date of birth', type: 'date', autoFillKey: 'dateOfBirth', required: true },
      { id: 'foreignTin', label: 'Foreign TIN', type: 'text', autoFillKey: 'taxId' },
      { id: 'treatyCountry', label: 'Treaty country (for reduced rate)', type: 'text', autoFillKey: 'residence' },
      { id: 'treatyArticle', label: 'Article number', type: 'text' },
      { id: 'withholdingRate', label: 'Rate of withholding (%)', type: 'text' },
      { id: 'incomeType', label: 'Type of income', type: 'select', options: ['Dividends', 'Interest', 'Royalties', 'Services', 'Other'] },
    ],
  },
];

// ─── Auto-fill mapping from demo persona ──────────────────
function getAutoFillData(persona: any): Record<string, string> {
  if (!persona) return {};
  const p = persona.profile || {};
  const t = persona.travel || {};
  return {
    firstName: p.firstName || '',
    lastName: p.lastName || '',
    fullName: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
    dateOfBirth: p.dateOfBirth || '1985-03-15',
    nationality: p.nationality || p.citizenship || '',
    passportNumber: p.passportNumber || 'AB1234567',
    passportExpiry: p.passportExpiry || '2030-06-15',
    passportIssueDate: p.passportIssueDate || '2020-06-15',
    passportCountry: p.nationality || '',
    email: p.email || 'user@supernomad.com',
    phone: p.phone || '+1-555-0100',
    address: p.address || t.currentLocation?.city || '',
    residence: t.currentLocation?.country || '',
    employer: p.employer || p.company || 'Self-employed',
    taxId: p.taxId || '***-**-****',
  };
}

// ─── Component ────────────────────────────────────────────
const DocumentAutoFill: React.FC = () => {
  const { activePersona } = useDemoPersona();
  const [activeCategory, setActiveCategory] = useState<string>('visa');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [autoFilled, setAutoFilled] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const autoFillData = getAutoFillData(activePersona);

  const categories = [
    { id: 'visa', label: 'Visa & Travel', icon: <Plane className="h-4 w-4" /> },
    { id: 'tax', label: 'Tax Forms', icon: <Building2 className="h-4 w-4" /> },
    { id: 'customs', label: 'Customs', icon: <Shield className="h-4 w-4" /> },
    { id: 'embassy', label: 'Embassy', icon: <Globe className="h-4 w-4" /> },
    { id: 'insurance', label: 'Insurance', icon: <Shield className="h-4 w-4" /> },
    { id: 'business', label: 'Business', icon: <CreditCard className="h-4 w-4" /> },
  ];

  const filteredTemplates = DOCUMENT_TEMPLATES.filter(t => t.category === activeCategory);

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setAutoFilled(false);
    setPreviewMode(false);
    // Pre-fill any default values
    const defaults: Record<string, string> = {};
    template.fields.forEach(f => { if (f.value) defaults[f.id] = f.value; });
    setFieldValues(defaults);
  };

  const handleAutoFill = () => {
    if (!selectedTemplate) return;
    const filled: Record<string, string> = { ...fieldValues };
    let count = 0;
    selectedTemplate.fields.forEach(f => {
      if (f.autoFillKey && autoFillData[f.autoFillKey]) {
        filled[f.id] = autoFillData[f.autoFillKey];
        count++;
      }
    });
    setFieldValues(filled);
    setAutoFilled(true);
    toast.success(`Auto-filled ${count} fields from your profile`);
  };

  const handleDownload = () => {
    if (!selectedTemplate) return;
    // Generate a text-based form output
    let content = `${selectedTemplate.name}\n${'='.repeat(selectedTemplate.name.length)}\n\n`;
    content += `Generated by SuperNomad — ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n`;
    selectedTemplate.fields.forEach(f => {
      content += `${f.label}: ${fieldValues[f.id] || '_______________'}\n`;
    });
    if (selectedTemplate.officialUrl) {
      content += `\nOfficial portal: ${selectedTemplate.officialUrl}\n`;
    }
    content += `\nDISCLAIMER: This is a pre-filled draft. Submit via the official government portal.\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Document downloaded — submit via official portal');
  };

  const completionPercent = selectedTemplate
    ? Math.round(
        (selectedTemplate.fields.filter(f => fieldValues[f.id]).length / selectedTemplate.fields.length) * 100
      )
    : 0;

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Header */}
      <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-full">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Document Auto-Fill</CardTitle>
              <CardDescription>AI-powered form completion for visa, tax, and travel documents</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="border-amber-500/30 bg-amber-500/5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-xs">
              Documents are pre-filled from your profile. Always verify and submit via official government portals.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6">
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-1 text-xs">
              {cat.icon}
              <span className="hidden sm:inline">{cat.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat.id} value={cat.id} className="mt-4">
            {!selectedTemplate ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredTemplates.map(template => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm">{template.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {template.country && (
                              <Badge variant="outline" className="text-[10px]">{template.country}</Badge>
                            )}
                            {template.processingTime && (
                              <Badge variant="secondary" className="text-[10px]">⏱️ {template.processingTime}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredTemplates.length === 0 && (
                  <Card className="col-span-2 p-8 text-center">
                    <p className="text-muted-foreground text-sm">Templates for this category coming soon</p>
                  </Card>
                )}
              </div>
            ) : (
              /* Form View */
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedTemplate.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{selectedTemplate.name}</CardTitle>
                        <CardDescription>{selectedTemplate.description}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                      ← Back
                    </Button>
                  </div>
                  {/* Progress */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">{completionPercent}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleAutoFill} variant="default" size="sm" className="gap-1">
                      <RefreshCw className="h-3 w-3" />
                      {autoFilled ? 'Re-fill from Profile' : 'Auto-Fill from Profile'}
                    </Button>
                    <Button onClick={() => setPreviewMode(!previewMode)} variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      {previewMode ? 'Edit Mode' : 'Preview'}
                    </Button>
                    <Button onClick={handleDownload} variant="outline" size="sm" className="gap-1">
                      <Download className="h-3 w-3" />
                      Download Draft
                    </Button>
                    {selectedTemplate.officialUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => window.open(selectedTemplate.officialUrl, '_blank')}
                      >
                        <Stamp className="h-3 w-3" />
                        Official Portal
                      </Button>
                    )}
                  </div>

                  {autoFilled && (
                    <Alert className="border-green-500/30 bg-green-500/5">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-xs">
                        Fields auto-filled from your SuperNomad profile. Review and edit as needed.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Fields */}
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {selectedTemplate.fields.map(field => (
                        <div key={field.id}>
                          <Label className="text-xs flex items-center gap-1">
                            {field.label}
                            {field.required && <span className="text-destructive">*</span>}
                            {field.autoFillKey && fieldValues[field.id] && (
                              <Badge variant="secondary" className="text-[9px] h-4 ml-1">auto-filled</Badge>
                            )}
                          </Label>
                          {previewMode ? (
                            <p className="text-sm mt-1 px-3 py-2 bg-muted rounded-md">
                              {fieldValues[field.id] || <span className="text-muted-foreground italic">Not filled</span>}
                            </p>
                          ) : field.type === 'select' ? (
                            <Select
                              value={fieldValues[field.id] || ''}
                              onValueChange={val => setFieldValues(prev => ({ ...prev, [field.id]: val }))}
                            >
                              <SelectTrigger className="h-9 text-sm mt-1">
                                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map(opt => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type={field.type === 'date' ? 'date' : 'text'}
                              value={fieldValues[field.id] || ''}
                              onChange={e => setFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                              className="h-9 text-sm mt-1"
                              readOnly={field.type === 'readonly'}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DocumentAutoFill;
