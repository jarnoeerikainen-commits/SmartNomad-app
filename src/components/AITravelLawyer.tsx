import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Scale, MapPin, AlertTriangle, FileText, Shield, Briefcase, 
  Users, Globe, Phone, Mail, Download, ExternalLink, CheckCircle2,
  Building2, Gavel, Book, ShieldAlert, CreditCard, Clock, Info, Search, X, Star
} from 'lucide-react';
import { toast } from "sonner";
import { Subscription } from "@/types/subscription";
import { LegalAIChat } from "./LegalAIChat";

interface AITravelLawyerProps {
  currentLocation?: { country: string; city: string };
  subscription: Subscription;
  onUpgradeClick?: () => void;
}

interface LegalIssue {
  category: string;
  subcategory: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

interface Attorney {
  name: string;
  specialization: string;
  languages: string[];
  country: string;
  city: string;
  contact: string;
  email?: string;
  rating: number;
  verified: boolean;
  region: string;
}

export const AITravelLawyer: React.FC<AITravelLawyerProps> = ({
  currentLocation,
  subscription,
  onUpgradeClick
}) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    citizenship: '',
    currentCountry: currentLocation?.country || '',
    currentCity: currentLocation?.city || '',
    issueType: '',
    description: ''
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [legalIssues, setLegalIssues] = useState<LegalIssue[]>([]);
  const [showAttorneys, setShowAttorneys] = useState(false);
  const [attorneySearch, setAttorneySearch] = useState('');
  const [attorneyRegion, setAttorneyRegion] = useState<string | null>(null);

  useEffect(() => {
    if (currentLocation) {
      setUserInfo(prev => ({ ...prev, currentCountry: currentLocation.country, currentCity: currentLocation.city }));
    }
  }, [currentLocation]);

  const legalCategories = [
    { id: 'immigration', name: 'Immigration & Visa Law', icon: Globe, color: 'text-blue-500', subcategories: ['Visa Requirements & Extensions', 'Digital Nomad Visas', 'Residence Permits', 'Border Control Issues', 'Deportation Defense', 'Travel Ban Appeals', 'Passport Issues'] },
    { id: 'tax', name: 'International Tax Law', icon: CreditCard, color: 'text-green-500', subcategories: ['Tax Residency Status', '183-Day Rule', 'Double Taxation Treaties', 'Remote Work Taxation', 'Business Tax', 'Social Security', 'Tax Filing'] },
    { id: 'business', name: 'Business & Corporate Law', icon: Briefcase, color: 'text-purple-500', subcategories: ['Company Registration', 'E-Residency Programs', 'Remote Work Contracts', 'Freelance Agreements', 'IP Protection', 'Banking Compliance', 'Licenses'] },
    { id: 'criminal', name: 'Criminal & Civil Law', icon: Gavel, color: 'text-red-500', subcategories: ['Arrest Procedures', 'Legal Representation', 'Bail & Bond', 'Contract Disputes', 'Consumer Protection', 'Rental Agreements', 'Insurance Claims'] },
    { id: 'emergency', name: 'Emergency Legal Services', icon: ShieldAlert, color: 'text-orange-500', subcategories: ['Passport Loss/Theft', 'Emergency Evacuation', 'Medical Legal', 'Accident Representation', 'Embassy Contacts', 'Crisis Management'] },
    { id: 'family', name: 'Family & Estate Law', icon: Users, color: 'text-cyan-500', subcategories: ['International Wills', 'Cross-border Divorce', 'Child Custody', 'Adoption Abroad', 'Power of Attorney', 'Inheritance Tax'] },
  ];

  const legalInsuranceOptions = [
    { id: 'basic', name: 'Basic Legal Protection', provider: 'Included in Premium', coverage: ['Document Review', '30-min Consultations', 'Legal Form Libraries', 'Compliance Monitoring', 'Emergency Contacts'], price: 'Included', recommended: false },
    { id: 'professional', name: 'Professional Legal Insurance', provider: 'Allianz Legal Shield', coverage: ['Full Contract Review', 'Unlimited Consultations', 'Dispute Resolution', 'Audit Defense', 'Immigration Support', 'Up to $50,000 Coverage'], price: '$199/year', recommended: true },
    { id: 'enterprise', name: 'Enterprise Legal Shield', provider: 'AXA Corporate Legal', coverage: ['Dedicated Legal Team', 'Business Compliance', 'International Expansion', 'M&A Guidance', 'Unlimited Coverage', '24/7 Support'], price: '$499/year', recommended: false },
  ];

  const verifiedAttorneys: Attorney[] = [
    // Europe
    { name: 'Dr. Maria Santos', specialization: 'Immigration & Visa Law', languages: ['English', 'Spanish', 'Portuguese'], country: 'Spain', city: 'Barcelona', contact: '+34 93 123 4567', email: 'msantos@lawfirm.es', rating: 4.9, verified: true, region: 'Europe' },
    { name: 'Sophie Dubois', specialization: 'Business & Corporate Law', languages: ['English', 'French', 'German'], country: 'France', city: 'Paris', contact: '+33 1 23 45 67 89', email: 'sdubois@cabinet.fr', rating: 4.9, verified: true, region: 'Europe' },
    { name: 'Lisa Mueller, LLM', specialization: 'Immigration & Business Law', languages: ['English', 'German', 'Dutch'], country: 'Germany', city: 'Berlin', contact: '+49 30 1234 5678', email: 'lmueller@kanzlei.de', rating: 4.9, verified: true, region: 'Europe' },
    { name: 'Marco Rossi', specialization: 'Tax & Residency Law', languages: ['English', 'Italian'], country: 'Italy', city: 'Milan', contact: '+39 02 1234 5678', email: 'mrossi@studio.it', rating: 4.7, verified: true, region: 'Europe' },
    { name: 'Ana Ferreira', specialization: 'NHR & Golden Visa', languages: ['English', 'Portuguese', 'Spanish'], country: 'Portugal', city: 'Lisbon', contact: '+351 21 123 4567', email: 'aferreira@advogados.pt', rating: 4.8, verified: true, region: 'Europe' },
    { name: 'Henrik Johansson', specialization: 'Nordic Business Law', languages: ['English', 'Swedish', 'Norwegian'], country: 'Sweden', city: 'Stockholm', contact: '+46 8 123 4567', email: 'hjohansson@law.se', rating: 4.6, verified: true, region: 'Europe' },
    
    // Asia Pacific
    { name: 'James Chen, Esq.', specialization: 'International Tax Law', languages: ['English', 'Mandarin', 'Cantonese'], country: 'Singapore', city: 'Singapore', contact: '+65 6123 4567', email: 'jchen@lawfirm.sg', rating: 4.8, verified: true, region: 'Asia Pacific' },
    { name: 'Yuki Tanaka', specialization: 'Business & Immigration', languages: ['English', 'Japanese'], country: 'Japan', city: 'Tokyo', contact: '+81 3 1234 5678', email: 'ytanaka@law.jp', rating: 4.7, verified: true, region: 'Asia Pacific' },
    { name: 'Priya Sharma', specialization: 'Corporate & Tax Law', languages: ['English', 'Hindi', 'Punjabi'], country: 'India', city: 'Mumbai', contact: '+91 22 1234 5678', email: 'psharma@law.in', rating: 4.6, verified: true, region: 'Asia Pacific' },
    { name: 'Somchai Patel', specialization: 'Thai Business & Visa Law', languages: ['English', 'Thai'], country: 'Thailand', city: 'Bangkok', contact: '+66 2 123 4567', email: 'spatel@lawfirm.th', rating: 4.7, verified: true, region: 'Asia Pacific' },
    
    // Middle East
    { name: 'Ahmed Al-Rahman', specialization: 'Criminal & Civil Law', languages: ['English', 'Arabic'], country: 'UAE', city: 'Dubai', contact: '+971 4 123 4567', email: 'aalrahman@law.ae', rating: 4.7, verified: true, region: 'Middle East' },
    { name: 'Fatima Al-Qasimi', specialization: 'Corporate & Free Zone Law', languages: ['English', 'Arabic', 'French'], country: 'UAE', city: 'Abu Dhabi', contact: '+971 2 123 4567', email: 'falqasimi@law.ae', rating: 4.8, verified: true, region: 'Middle East' },
    
    // Americas
    { name: 'Carlos Mendez, JD', specialization: 'Immigration & Business', languages: ['English', 'Spanish'], country: 'Mexico', city: 'Mexico City', contact: '+52 55 1234 5678', email: 'cmendez@bufete.mx', rating: 4.6, verified: true, region: 'Americas' },
    { name: 'Patricia Silva', specialization: 'International Tax & Business', languages: ['English', 'Portuguese', 'Spanish'], country: 'Brazil', city: 'São Paulo', contact: '+55 11 1234 5678', email: 'psilva@escritorio.br', rating: 4.7, verified: true, region: 'Americas' },
    { name: 'Robert Williams, Esq.', specialization: 'US Expat & International Law', languages: ['English', 'French'], country: 'United States', city: 'New York', contact: '+1 212 123 4567', email: 'rwilliams@firm.com', rating: 4.9, verified: true, region: 'Americas' },
  ];

  const ATTORNEY_REGIONS = [...new Set(verifiedAttorneys.map(a => a.region))];

  const filteredAttorneys = useMemo(() => {
    return verifiedAttorneys.filter(a => {
      if (attorneyRegion && a.region !== attorneyRegion) return false;
      if (attorneySearch) {
        const q = attorneySearch.toLowerCase();
        return a.name.toLowerCase().includes(q) || a.specialization.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.country.toLowerCase().includes(q) || a.languages.some(l => l.toLowerCase().includes(q));
      }
      return true;
    });
  }, [attorneySearch, attorneyRegion]);

  const countryLegalInfo: Record<string, { visaRules: string; taxRate: string; businessSetup: string; legalSystem: string; emergencyNumber: string }> = {
    'Spain': { visaRules: 'Digital Nomad Visa (1-5 years)', taxRate: '24% non-resident', businessSetup: 'SL €3,000 min capital', legalSystem: 'Civil Law', emergencyNumber: '112' },
    'Portugal': { visaRules: 'D7 / Digital Nomad Visa', taxRate: 'NHR 20% flat 10yr', businessSetup: 'LDA €1 min capital', legalSystem: 'Civil Law', emergencyNumber: '112' },
    'Thailand': { visaRules: 'DTV 5-year multiple entry', taxRate: 'Territorial (foreign untaxed)', businessSetup: 'BOI registration', legalSystem: 'Civil Law', emergencyNumber: '191' },
    'UAE': { visaRules: 'Digital Nomad / Golden Visa', taxRate: '0% personal income', businessSetup: 'Free Zone 2-3 days', legalSystem: 'Civil + Sharia', emergencyNumber: '999' },
    'USA': { visaRules: 'No nomad visa, B1/B2', taxRate: 'Worldwide taxation', businessSetup: 'LLC or C-Corp by state', legalSystem: 'Common Law', emergencyNumber: '911' },
    'Germany': { visaRules: 'Freelance visa available', taxRate: '14-45% progressive', businessSetup: 'GmbH €25,000 capital', legalSystem: 'Civil Law', emergencyNumber: '112' },
    'Singapore': { visaRules: 'EntrePass / EP / ONE Pass', taxRate: '0-22% progressive', businessSetup: 'Pte Ltd SGD 1 capital', legalSystem: 'Common Law', emergencyNumber: '999' },
    'Japan': { visaRules: 'Business Manager visa', taxRate: '5-45% progressive', businessSetup: 'KK ¥1 min capital', legalSystem: 'Civil Law', emergencyNumber: '110' },
    'France': { visaRules: 'Talent Passport visa', taxRate: '0-45% progressive', businessSetup: 'SAS/SARL €1 min', legalSystem: 'Civil Law', emergencyNumber: '112' },
    'Italy': { visaRules: 'Digital Nomad Visa (2024)', taxRate: '7% flat south Italy', businessSetup: 'SRL €1 min capital', legalSystem: 'Civil Law', emergencyNumber: '112' },
    'Mexico': { visaRules: 'Temporary Resident visa', taxRate: '1.92-35% progressive', businessSetup: 'SA de CV', legalSystem: 'Civil Law', emergencyNumber: '911' },
    'Brazil': { visaRules: 'Digital Nomad Visa (1yr)', taxRate: '7.5-27.5% progressive', businessSetup: 'LTDA BRL 1', legalSystem: 'Civil Law', emergencyNumber: '190' },
  };

  const documentTemplates = [
    { name: 'Freelance Contract Template', category: 'Business', format: 'PDF/DOCX' },
    { name: 'International Rental Agreement', category: 'Civil', format: 'PDF/DOCX' },
    { name: 'Power of Attorney', category: 'General', format: 'PDF' },
    { name: 'Visa Appeal Letter Template', category: 'Immigration', format: 'DOCX' },
    { name: 'Tax Residency Declaration', category: 'Tax', format: 'PDF' },
    { name: 'Business Registration Checklist', category: 'Business', format: 'PDF' },
    { name: 'Emergency Legal Contacts Form', category: 'Emergency', format: 'PDF' },
    { name: 'International Will Template', category: 'Family', format: 'PDF/DOCX' },
    { name: 'NDA Template (Multi-Jurisdiction)', category: 'Business', format: 'DOCX' },
    { name: 'Remote Work Agreement', category: 'Business', format: 'DOCX' },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setUserInfo(prev => ({ ...prev, issueType: categoryId }));
  };

  const handleSubmitIssue = () => {
    if (!userInfo.name || !userInfo.citizenship || !userInfo.issueType || !userInfo.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLegalIssues([...legalIssues, { category: userInfo.issueType, subcategory: 'General', description: userInfo.description, urgency: 'medium' }]);
    toast.success("Legal issue documented. We'll provide guidance shortly.");
    setShowAttorneys(true);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Scale className="w-8 h-8 text-primary" />AI Travel Lawyer</h1>
          <p className="text-muted-foreground mt-1">Global legal protection — {verifiedAttorneys.length} attorneys in {ATTORNEY_REGIONS.length} regions, {Object.keys(countryLegalInfo).length} country guides</p>
        </div>
        <Badge variant="outline" className="px-3 py-1.5"><Shield className="w-4 h-4 mr-1.5" />{subscription.tier === 'free' ? 'Limited' : 'Full Access'}</Badge>
      </div>

      <Alert className="border-orange-500/50 bg-orange-500/5">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        <AlertDescription className="text-xs">
          <strong>DISCLAIMER:</strong> This provides legal information, not advice. Always consult a licensed attorney for specific matters.
        </AlertDescription>
      </Alert>

      {subscription.tier === 'free' && (
        <Alert className="border-primary bg-primary/5">
          <Shield className="w-4 h-4 text-primary" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm"><strong>Upgrade to Premium</strong> for unlimited consultations & document review.</span>
            <Button onClick={onUpgradeClick} size="sm" className="ml-3 shrink-0">Upgrade</Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Country Legal Info */}
      {currentLocation && countryLegalInfo[currentLocation.country] && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-semibold">{currentLocation.city}, {currentLocation.country}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              {Object.entries(countryLegalInfo[currentLocation.country]).map(([k, v]) => (
                <div key={k} className="p-2 rounded-md bg-muted/50">
                  <p className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="font-medium mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="categories">Legal Areas</TabsTrigger>
          <TabsTrigger value="attorneys">Attorneys ({verifiedAttorneys.length})</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <LegalAIChat currentLocation={currentLocation} citizenship={userInfo.citizenship} />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {legalCategories.map(cat => {
              const Icon = cat.icon;
              return (
                <Card key={cat.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleCategorySelect(cat.id)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base"><Icon className={`w-5 h-5 ${cat.color}`} />{cat.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {cat.subcategories.map((sub, idx) => (
                        <li key={idx} className="text-xs flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-primary shrink-0" />{sub}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Country Legal Guides */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="w-5 h-5 text-primary" />Country Legal Guides ({Object.keys(countryLegalInfo).length})</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(countryLegalInfo).map(([country, info]) => (
                  <Card key={country} className="p-3">
                    <p className="font-semibold text-sm mb-2">{country}</p>
                    <div className="space-y-1 text-xs">
                      <p><span className="text-muted-foreground">Visa:</span> {info.visaRules}</p>
                      <p><span className="text-muted-foreground">Tax:</span> {info.taxRate}</p>
                      <p><span className="text-muted-foreground">System:</span> {info.legalSystem}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attorneys" className="space-y-4">
          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, specialization, city, language..." value={attorneySearch} onChange={e => setAttorneySearch(e.target.value)} className="pl-10 pr-10" />
              {attorneySearch && <Button variant="ghost" size="sm" className="absolute right-1 top-1" onClick={() => setAttorneySearch('')}><X className="h-4 w-4" /></Button>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={attorneyRegion === null ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setAttorneyRegion(null)}>All ({verifiedAttorneys.length})</Badge>
              {ATTORNEY_REGIONS.map(r => (
                <Badge key={r} variant={attorneyRegion === r ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setAttorneyRegion(attorneyRegion === r ? null : r)}>
                  {r} ({verifiedAttorneys.filter(a => a.region === r).length})
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">Showing {filteredAttorneys.length} attorneys</p>

          <div className="space-y-3">
            {filteredAttorneys.map((attorney, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold">{attorney.name}</h3>
                      {attorney.verified && <Badge variant="secondary" className="text-xs"><CheckCircle2 className="w-3 h-3 mr-0.5" />Verified</Badge>}
                      <div className="flex items-center gap-0.5"><Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" /><span className="text-sm font-semibold">{attorney.rating}</span></div>
                    </div>
                    <p className="text-sm text-muted-foreground">{attorney.specialization}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{attorney.city}, {attorney.country}</span>
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{attorney.languages.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <Button size="sm" onClick={() => toast.success(`Connecting with ${attorney.name}...`)}><Phone className="w-3.5 h-3.5 mr-1.5" />Call</Button>
                    {attorney.email && <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${attorney.email}`)}><Mail className="w-3.5 h-3.5 mr-1.5" />Email</Button>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {legalInsuranceOptions.map(ins => (
              <Card key={ins.id} className={ins.recommended ? 'border-primary border-2' : ''}>
                {ins.recommended && <div className="bg-primary text-primary-foreground text-center py-1.5 rounded-t-lg text-xs font-semibold">RECOMMENDED</div>}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{ins.name}</CardTitle>
                  <CardDescription>{ins.provider}</CardDescription>
                  <div className="text-2xl font-bold text-primary mt-1">{ins.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {ins.coverage.map((item, i) => <li key={i} className="flex items-start gap-1.5 text-sm"><CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />{item}</li>)}
                  </ul>
                  <Button className="w-full mt-4" variant={ins.recommended ? 'default' : 'outline'}>{ins.id === 'basic' ? 'Included' : 'Get Coverage'}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="w-5 h-5 text-primary" />Legal Templates ({documentTemplates.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {documentTemplates.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <Book className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <div className="flex gap-1.5 mt-0.5"><Badge variant="outline" className="text-[10px]">{t.category}</Badge><Badge variant="secondary" className="text-[10px]">{t.format}</Badge></div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Downloading ${t.name}...`)}><Download className="w-3.5 h-3.5 mr-1.5" />Download</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldAlert className="w-5 h-5 text-orange-500" />Emergency Procedures</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>If Arrested Abroad:</strong>
                  <ol className="list-decimal ml-4 mt-1 space-y-0.5 text-sm">
                    <li>Request embassy/consulate contact immediately</li>
                    <li>Do not sign documents you don't understand</li>
                    <li>Ask for an interpreter</li>
                    <li>Request a list of local attorneys</li>
                    <li>Document everything</li>
                  </ol>
                </AlertDescription>
              </Alert>
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>Lost/Stolen Passport:</strong>
                  <ol className="list-decimal ml-4 mt-1 space-y-0.5 text-sm">
                    <li>File police report within 24 hours</li>
                    <li>Contact nearest embassy/consulate</li>
                    <li>Prepare: ID, photos, travel itinerary</li>
                    <li>Apply for emergency travel document</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div><h3 className="font-bold">Need Immediate Legal Help?</h3><p className="text-sm text-muted-foreground">Connect with a verified attorney in minutes</p></div>
          <div className="flex gap-2">
            <Button variant="outline"><Phone className="w-4 h-4 mr-2" />Emergency</Button>
            <Button><Users className="w-4 h-4 mr-2" />Find Attorney</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
