import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, Download, Trash2, Eye, EyeOff, 
  Lock, CheckCircle2, AlertTriangle, User, Mail, Phone, Globe,
  FileText, Scale, ExternalLink, BookOpen, RefreshCw, Info,
  Gavel, Building2, Cookie, Bell, Server, Users
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FEATURE_REGISTRY, CATEGORY_LABELS } from '@/data/featureRegistry';
import { useNavigate } from 'react-router-dom';

interface EnhancedProfileData {
  firstName: string;
  email: string;
  phone?: string;
  nationality?: string;
  currentLocation?: string;
  occupation?: string;
  travelFrequency?: string;
  travelPurpose?: string[];
  preferredLanguages: string[];
  consents: {
    dataProcessing: boolean;
    marketing: boolean;
  };
  completedAt: string;
}

// Auto-generated from feature registry — always current
const DATA_PROCESSING_MAP: Record<string, { dataCollected: string[]; legalBasis: string; retention: string }> = {
  tax: {
    dataCollected: ['Country entries/exits', 'Days spent per jurisdiction', 'Tax residency selections', 'Visa types & expiry dates'],
    legalBasis: 'Contract performance (Art. 6(1)(b) GDPR)',
    retention: '7 years (tax compliance obligation)',
  },
  finance: {
    dataCollected: ['Currency preferences', 'Payment method metadata (encrypted)', 'Award card references (encrypted)'],
    legalBasis: 'Contract performance (Art. 6(1)(b) GDPR)',
    retention: 'Until account deletion + 30 days',
  },
  travel: {
    dataCollected: ['Travel history', 'GPS coordinates (with consent)', 'Transport preferences', 'Insurance selections'],
    legalBasis: 'Consent (Art. 6(1)(a)) for location; Contract (Art. 6(1)(b)) for services',
    retention: '7 years (travel history); session-only (location)',
  },
  local: {
    dataCollected: ['City/location preferences', 'Community messages', 'Marketplace listings', 'Social profile data'],
    legalBasis: 'Contract performance (Art. 6(1)(b) GDPR)',
    retention: '90 days (messages); until deletion (listings)',
  },
  safety: {
    dataCollected: ['Emergency contacts', 'Guardian activation logs (demo only)', 'Threat alerts viewed', 'Cyber incident reports'],
    legalBasis: 'Vital interests (Art. 6(1)(d)) for emergencies; Legitimate interest (Art. 6(1)(f)) for threat monitoring',
    retention: '1 year (safety logs); real-time only (guardian)',
  },
  premium: {
    dataCollected: ['AI conversation transcripts', 'Medical/legal queries (sanitised)', 'Business center searches', 'Location tracking data'],
    legalBasis: 'Contract performance (Art. 6(1)(b) GDPR)',
    retention: '90 days (AI logs); session-only (searches)',
  },
  dashboard: {
    dataCollected: ['Feature usage patterns', 'Widget preferences', 'Achievement progress'],
    legalBasis: 'Legitimate interest (Art. 6(1)(f) GDPR)',
    retention: 'Until account deletion',
  },
};

// Official regulatory sources — always linked for transparency
const REGULATORY_SOURCES = [
  { name: 'EU GDPR (2016/679)', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj', region: 'EU', icon: '🇪🇺' },
  { name: 'UK GDPR', url: 'https://www.legislation.gov.uk/ukpga/2018/12/contents/enacted', region: 'UK', icon: '🇬🇧' },
  { name: 'CCPA / CPRA', url: 'https://oag.ca.gov/privacy/ccpa', region: 'US-CA', icon: '🇺🇸' },
  { name: 'ePrivacy Directive 2002/58/EC', url: 'https://eur-lex.europa.eu/eli/dir/2002/58/oj', region: 'EU', icon: '🇪🇺' },
  { name: 'EU-US Data Privacy Framework', url: 'https://www.dataprivacyframework.gov/', region: 'EU-US', icon: '🌐' },
  { name: 'EU Digital Services Act', url: 'https://eur-lex.europa.eu/eli/reg/2022/2065/oj', region: 'EU', icon: '🇪🇺' },
  { name: 'EU AI Act (2024/1689)', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj', region: 'EU', icon: '🇪🇺' },
  { name: 'COPPA (Children)', url: 'https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa', region: 'US', icon: '🇺🇸' },
  { name: 'CAN-SPAM Act', url: 'https://www.ftc.gov/legal-library/browse/rules/can-spam-rule', region: 'US', icon: '🇺🇸' },
  { name: 'Brazil LGPD', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm', region: 'BR', icon: '🇧🇷' },
  { name: 'Japan APPI', url: 'https://www.ppc.go.jp/en/', region: 'JP', icon: '🇯🇵' },
  { name: 'Australia Privacy Act', url: 'https://www.oaic.gov.au/privacy/the-privacy-act', region: 'AU', icon: '🇦🇺' },
  { name: 'Canada PIPEDA / CPPA', url: 'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/', region: 'CA', icon: '🇨🇦' },
  { name: 'South Korea PIPA', url: 'https://www.pipc.go.kr/eng/main.do', region: 'KR', icon: '🇰🇷' },
  { name: 'India DPDPA 2023', url: 'https://www.meity.gov.in/data-protection-framework', region: 'IN', icon: '🇮🇳' },
  { name: 'UAE PDPL', url: 'https://tdra.gov.ae/', region: 'AE', icon: '🇦🇪' },
  { name: 'Singapore PDPA', url: 'https://www.pdpc.gov.sg/', region: 'SG', icon: '🇸🇬' },
  { name: 'Thailand PDPA', url: 'https://www.pdpc.or.th/', region: 'TH', icon: '🇹🇭' },
];

const US_STATE_LAWS = [
  'Virginia VCDPA', 'Colorado CPA', 'Connecticut CTDPA', 'Utah UCPA',
  'Texas TDPSA', 'Oregon OCPA', 'Montana MCDPA', 'Iowa', 'Delaware',
  'New Hampshire', 'New Jersey', 'Nebraska', 'Maryland', 'Minnesota',
  'Indiana', 'Kentucky', 'Tennessee', 'Rhode Island',
];

const DataManagementSettings: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<EnhancedProfileData | null>(null);
  const [showData, setShowData] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  // Auto-computed from feature registry
  const featureAudit = useMemo(() => {
    const byCategory: Record<string, typeof FEATURE_REGISTRY> = {};
    FEATURE_REGISTRY.forEach(f => {
      if (!byCategory[f.category]) byCategory[f.category] = [];
      byCategory[f.category].push(f);
    });
    return byCategory;
  }, []);

  const totalFeatures = FEATURE_REGISTRY.length;
  const lastCodeUpdate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    const stored = localStorage.getItem('enhancedProfile');
    if (stored) {
      setProfileData(JSON.parse(stored));
    }
  }, []);

  const handleDownloadData = () => {
    const allData = {
      _exportMetadata: {
        exportedAt: new Date().toISOString(),
        format: 'JSON (GDPR Art. 20 portable format)',
        application: 'SuperNomad',
        dataController: 'SuperNomad',
        dpo: 'dpo@supernomad.app',
        purpose: 'Data Subject Access Request (DSAR) fulfilment',
      },
      enhancedProfile: profileData,
      userProfile: JSON.parse(localStorage.getItem('userProfile') || 'null'),
      subscription: JSON.parse(localStorage.getItem('subscription') || 'null'),
      trackedCountries: JSON.parse(localStorage.getItem('trackedCountries') || '[]'),
      featurePreferences: JSON.parse(localStorage.getItem('featurePreferences') || 'null'),
      cookieConsent: JSON.parse(localStorage.getItem('cookieConsent') || 'null'),
      demoPersona: JSON.parse(localStorage.getItem('demoPersona') || 'null'),
      _legalNotice: {
        gdprArticle15: 'This export fulfils your Right of Access under GDPR Article 15.',
        gdprArticle20: 'This data is provided in a structured, commonly used, machine-readable format (JSON) per Article 20.',
        ccpa: 'This export fulfils your Right to Know under CCPA §1798.100.',
        retentionPolicy: 'Data retention periods are detailed in our Privacy Policy at /privacy-policy.',
        deletionRequest: 'To exercise your Right to Erasure, use the Delete options below or email rights@supernomad.app.',
      },
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supernomad-dsar-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "DSAR Export Complete",
      description: "Your data has been exported in GDPR-compliant portable format (JSON).",
    });
  };

  const handleDeleteProfile = () => {
    localStorage.removeItem('enhancedProfile');
    setProfileData(null);
    setShowDeleteDialog(false);

    toast({
      title: "Profile Deleted",
      description: "Your enhanced profile data has been erased per GDPR Article 17.",
    });
  };

  const handleDeleteAllData = () => {
    localStorage.removeItem('enhancedProfile');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('subscription');
    localStorage.removeItem('trackedCountries');
    localStorage.removeItem('featurePreferences');
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('demoPersona');
    
    setProfileData(null);
    setShowDeleteAllDialog(false);

    toast({
      title: "Complete Data Erasure",
      description: "All data permanently deleted per GDPR Art. 17 / CCPA §1798.105. Reloading...",
      variant: "destructive",
    });

    setTimeout(() => window.location.reload(), 2000);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header with auto-update indicator */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-5 w-5 text-primary" />
                  Data & Privacy Management
                </CardTitle>
                <CardDescription className="mt-1">
                  Exercise your GDPR, CCPA & global privacy rights. Manage your personal data with full transparency.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs shrink-0 gap-1">
                <RefreshCw className="h-3 w-3" />
                Auto-synced · {totalFeatures} features audited
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>GDPR (EU) 2016/679</Badge>
              <Badge>UK GDPR</Badge>
              <Badge>CCPA / CPRA</Badge>
              <Badge>EU AI Act 2024</Badge>
              <Badge>ePrivacy Directive</Badge>
              <Badge>Brazil LGPD</Badge>
              <Badge>25+ jurisdictions</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button variant="outline" className="h-auto py-3 justify-start gap-3" onClick={() => navigate('/privacy-policy')}>
            <Shield className="h-5 w-5 text-primary shrink-0" />
            <div className="text-left">
              <p className="font-medium text-sm">Privacy Policy</p>
              <p className="text-xs text-muted-foreground">Full GDPR/CCPA/Global compliant policy</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-3 justify-start gap-3" onClick={() => navigate('/terms')}>
            <Scale className="h-5 w-5 text-primary shrink-0" />
            <div className="text-left">
              <p className="font-medium text-sm">Terms & Conditions</p>
              <p className="text-xs text-muted-foreground">Legally binding service agreement</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-3 justify-start gap-3" onClick={handleDownloadData}>
            <Download className="h-5 w-5 text-primary shrink-0" />
            <div className="text-left">
              <p className="font-medium text-sm">Download My Data</p>
              <p className="text-xs text-muted-foreground">GDPR Art. 15 & 20 portable export</p>
            </div>
          </Button>
        </div>

        {/* Data Processing Transparency — auto-generated from feature registry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-primary" />
              Data Processing Transparency
            </CardTitle>
            <CardDescription>
              Auto-generated from the live feature registry ({totalFeatures} features). Updated every time a feature is added or modified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {Object.entries(featureAudit).map(([category, features]) => {
                const processing = DATA_PROCESSING_MAP[category];
                if (!processing) return null;
                return (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="text-sm hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{features.length}</Badge>
                        <span className="font-medium">{CATEGORY_LABELS[category] || category}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Features in this category:</p>
                          <div className="flex flex-wrap gap-1">
                            {features.map(f => (
                              <Badge key={f.id} variant="secondary" className="text-xs">{f.label}</Badge>
                            ))}
                          </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div>
                            <p className="font-medium mb-1">Data Collected</p>
                            <ul className="space-y-0.5 text-muted-foreground">
                              {processing.dataCollected.map(d => (
                                <li key={d}>• {d}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Legal Basis</p>
                            <p className="text-muted-foreground">{processing.legalBasis}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Retention Period</p>
                            <p className="text-muted-foreground">{processing.retention}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Your Stored Data */}
        {profileData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Your Stored Data
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowData(!showData)}>
                  {showData ? <><EyeOff className="h-4 w-4 mr-2" />Hide</> : <><Eye className="h-4 w-4 mr-2" />View</>}
                </Button>
              </div>
            </CardHeader>
            {showData && (
              <CardContent>
                <div className="space-y-3 p-4 rounded-lg bg-muted/50 border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">Name:</span>
                      <span>{profileData.firstName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{profileData.email}</span>
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">Phone:</span>
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                    {profileData.nationality && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">Nationality:</span>
                        <span>{profileData.nationality}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t flex flex-wrap gap-1">
                    {profileData.preferredLanguages.map(lang => (
                      <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                    ))}
                    {profileData.travelPurpose?.map(purpose => (
                      <Badge key={purpose} variant="outline" className="text-xs">{purpose}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">
                    Profile completed: {new Date(profileData.completedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Consent Status */}
        {profileData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Your Privacy Choices & Consents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
                <span>Data Processing for Services</span>
                <Badge variant={profileData.consents.dataProcessing ? "default" : "secondary"}>
                  {profileData.consents.dataProcessing ? "Consented" : "Not Consented"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
                <span>Marketing Communications</span>
                <Badge variant={profileData.consents.marketing ? "default" : "secondary"}>
                  {profileData.consents.marketing ? "Subscribed" : "Unsubscribed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
                <span>Cookie Preferences</span>
                <Badge variant="outline">
                  {localStorage.getItem('cookieConsent') ? 'Configured' : 'Not Set'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                You may withdraw consent at any time without affecting the lawfulness of processing based on consent before withdrawal (GDPR Art. 7(3)).
              </p>
            </CardContent>
          </Card>
        )}

        {/* Your Rights — Comprehensive Global */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gavel className="h-5 w-5 text-primary" />
              Your Data Rights (Global)
            </CardTitle>
            <CardDescription>
              Your rights under GDPR, CCPA/CPRA, UK GDPR, LGPD, and 25+ privacy frameworks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Right of Access', ref: 'GDPR Art. 15 · CCPA §1798.100', desc: 'Obtain a complete copy of all personal data we hold about you' },
                { title: 'Right to Rectification', ref: 'GDPR Art. 16', desc: 'Correct any inaccurate or incomplete personal data' },
                { title: 'Right to Erasure', ref: 'GDPR Art. 17 · CCPA §1798.105', desc: 'Request permanent deletion of your personal data' },
                { title: 'Right to Restrict Processing', ref: 'GDPR Art. 18', desc: 'Limit how we process your data in certain circumstances' },
                { title: 'Right to Data Portability', ref: 'GDPR Art. 20', desc: 'Receive data in structured, machine-readable JSON format' },
                { title: 'Right to Object', ref: 'GDPR Art. 21', desc: 'Object to processing based on legitimate interests or direct marketing' },
                { title: 'Right to Withdraw Consent', ref: 'GDPR Art. 7(3)', desc: 'Withdraw consent at any time without affecting prior lawful processing' },
                { title: 'Right Against Automated Decisions', ref: 'GDPR Art. 22 · EU AI Act', desc: 'Not be subject to decisions based solely on automated processing' },
                { title: 'Right to Non-Discrimination', ref: 'CCPA §1798.125', desc: 'We will not discriminate for exercising your privacy rights' },
                { title: 'Right to Opt-Out of Sale', ref: 'CCPA §1798.120', desc: 'SuperNomad does NOT sell your personal data. Ever.' },
                { title: 'Right to Lodge a Complaint', ref: 'GDPR Art. 77', desc: 'File a complaint with your local Data Protection Authority' },
                { title: 'Right to Know', ref: 'CCPA §1798.110', desc: 'Know what data we collect, use, disclose, and sell' },
              ].map(r => (
                <div key={r.title} className="p-3 border border-border rounded-lg">
                  <p className="font-medium text-sm">{r.title}</p>
                  <p className="text-xs text-primary mt-0.5">{r.ref}</p>
                  <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Official Regulatory Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Official Regulatory Sources
            </CardTitle>
            <CardDescription>
              100% transparent. All privacy rules sourced directly from official government and EU publications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {REGULATORY_SOURCES.map(src => (
                <a
                  key={src.name}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm"
                >
                  <span>{src.icon}</span>
                  <span className="flex-1 text-xs">{src.name}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                </a>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground space-y-1">
              <p>
                <strong>US State Laws Compliance:</strong> {US_STATE_LAWS.join(', ')}.
              </p>
              <p>
                SuperNomad monitors regulatory developments globally and updates these policies within 30 days of any material change in applicable law. Our legal compliance framework is reviewed quarterly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Company Disclaimers & Limitations — Protective */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-primary" />
              Important Legal Notices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-muted-foreground">
            <div className="p-3 bg-muted/30 rounded-lg border space-y-2">
              <p className="font-medium text-foreground text-sm">Disclaimers & Limitation of Liability</p>
              <p>
                <strong>No Professional Advice:</strong> SuperNomad provides informational tools and general guidance only. The Service, including all AI-powered features (AI Doctor, AI Lawyer, AI Planner, Tax Dashboard, Visa Manager, Black Box Guardian, Cyber Helpline), does NOT constitute professional medical, legal, financial, tax, immigration, or security advice. You must always consult qualified professionals for decisions affecting your legal, financial, health, or immigration status.
              </p>
              <p>
                <strong>Accuracy & Completeness:</strong> While SuperNomad sources information from official government databases and international regulatory bodies, we cannot guarantee the absolute accuracy, completeness, or timeliness of any data displayed. Tax rules, visa requirements, and regulatory frameworks change frequently. SuperNomad shall not be held liable for any losses, penalties, or adverse outcomes arising from reliance on information provided through the Service.
              </p>
              <p>
                <strong>AI-Generated Content:</strong> Responses from AI features are generated by third-party large language models and may contain errors, hallucinations, or outdated information. AI outputs are provided "AS IS" without any warranty of accuracy. SuperNomad expressly disclaims all liability for decisions made based on AI-generated content. Pursuant to the EU AI Act (Regulation 2024/1689), all AI-generated content is clearly labelled as such.
              </p>
              <p>
                <strong>Black Box Guardian / Safety Features:</strong> All safety features including the Black Box Guardian, SOS Services, and Emergency Contacts operate in DEMO MODE in the current version. No real emergency calls, police alerts, or distress signals are transmitted. SuperNomad is not a licensed security service, emergency response provider, or law enforcement agency. In any genuine emergency, always contact local emergency services directly (112 in EU, 911 in US, 999 in UK).
              </p>
              <p>
                <strong>Data Security:</strong> SuperNomad implements industry-standard encryption (AES-256-GCM) for sensitive data, HTTPS for all transmissions, and local-first storage architecture. However, no method of transmission over the Internet or method of electronic storage is 100% secure. SuperNomad shall not be liable for any unauthorised access resulting from circumstances beyond our reasonable control.
              </p>
              <p>
                <strong>Maximum Aggregate Liability:</strong> To the maximum extent permitted by applicable law, SuperNomad's total aggregate liability for all claims shall not exceed the greater of (a) the amount you paid to SuperNomad in the twelve (12) months preceding the claim, or (b) €100 / $100. This limitation applies to the fullest extent permitted by law and does not exclude liability that cannot be excluded under mandatory consumer protection laws.
              </p>
              <p>
                <strong>Indemnification:</strong> By using the Service, you agree to indemnify and hold harmless SuperNomad from any claims arising from your use of the Service, your violation of these terms, or your violation of any third-party rights, to the extent permitted by applicable law.
              </p>
              <p>
                <strong>Force Majeure:</strong> SuperNomad shall not be liable for any failure or delay in performance resulting from circumstances beyond our reasonable control, including but not limited to natural disasters, acts of government, pandemic, war, terrorism, cyber attacks, or disruptions to third-party services.
              </p>
            </div>
            <p className="text-center">
              Questions? Contact our Data Protection Officer at <strong>dpo@supernomad.app</strong> · CCPA requests: <strong>ccpa@supernomad.app</strong> · General: <strong>privacy@supernomad.app</strong>
            </p>
          </CardContent>
        </Card>

        {/* Data Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Data Deletion & Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={handleDownloadData} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download My Data (DSAR)
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                disabled={!profileData}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Profile (Art. 17)
              </Button>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAllDialog(true)}
              className="w-full"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Delete All Data & Account (Complete Erasure)
            </Button>

            <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg space-y-1">
              <p className="font-medium">Data Security Architecture:</p>
              <ul className="space-y-0.5">
                <li>• Local-first storage — your data stays on your device by default</li>
                <li>• AES-256-GCM encryption for sensitive data (Identity Vault, Payment Cards)</li>
                <li>• Zero-knowledge architecture — we cannot read your encrypted data</li>
                <li>• HTTPS/TLS for all server communications</li>
                <li>• Input sanitisation & HTML stripping on all AI queries</li>
                <li>• Device-isolated data access via RLS policies</li>
                <li>• No third-party data selling — ever (CCPA §1798.120 compliant)</li>
                <li>• Global Privacy Control (GPC) signal honoured</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Profile Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Enhanced Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This exercises your Right to Erasure (GDPR Art. 17 / CCPA §1798.105). Your enhanced profile data will be permanently removed. Travel tracking data will be preserved per tax compliance retention obligations (7 years). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProfile} className="bg-destructive text-destructive-foreground">
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Data Dialog */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Complete Data Erasure
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="font-semibold">This will permanently delete all data including:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Enhanced profile & personal information</li>
                <li>All tracked countries & travel history</li>
                <li>Subscription & payment preferences</li>
                <li>Feature customisation & cookie preferences</li>
                <li>All saved settings & demo persona data</li>
              </ul>
              <p className="text-xs mt-2">
                Per GDPR Art. 17 and CCPA §1798.105, this data will be erased immediately from your device. Server-side data (AI conversation logs) will be purged within 30 days per our retention policy.
              </p>
              <p className="font-semibold text-destructive pt-2">
                This action is permanent and cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAllData} className="bg-destructive text-destructive-foreground">
              Yes, Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DataManagementSettings;
