import React, { useState, useEffect } from 'react';
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
  Building2, Gavel, Book, ShieldAlert, CreditCard, Clock, Info
} from 'lucide-react';
import { toast } from "sonner";
import { Subscription } from "@/types/subscription";

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

interface LegalInsurance {
  id: string;
  name: string;
  provider: string;
  coverage: string[];
  price: string;
  recommended: boolean;
}

interface Attorney {
  name: string;
  specialization: string;
  languages: string[];
  country: string;
  city: string;
  contact: string;
  rating: number;
  verified: boolean;
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

  // Update location when prop changes
  useEffect(() => {
    if (currentLocation) {
      setUserInfo(prev => ({
        ...prev,
        currentCountry: currentLocation.country,
        currentCity: currentLocation.city
      }));
    }
  }, [currentLocation]);

  // Pre-loaded legal categories
  const legalCategories = [
    {
      id: 'immigration',
      name: 'Immigration & Visa Law',
      icon: Globe,
      color: 'text-blue-500',
      subcategories: [
        'Visa Requirements & Extensions',
        'Digital Nomad Visas',
        'Residence Permits',
        'Border Control Issues',
        'Deportation Defense',
        'Travel Ban Appeals',
        'Passport Issues'
      ]
    },
    {
      id: 'tax',
      name: 'International Tax Law',
      icon: CreditCard,
      color: 'text-green-500',
      subcategories: [
        'Tax Residency Status',
        '183-Day Rule Compliance',
        'Double Taxation Treaties',
        'Remote Work Taxation',
        'Business Tax Obligations',
        'Social Security Agreements',
        'Tax Filing Requirements'
      ]
    },
    {
      id: 'business',
      name: 'Business & Corporate Law',
      icon: Briefcase,
      color: 'text-purple-500',
      subcategories: [
        'Company Registration',
        'E-Residency Programs',
        'Remote Work Contracts',
        'Freelance Agreements',
        'Intellectual Property',
        'Banking Compliance',
        'Business Licenses'
      ]
    },
    {
      id: 'criminal',
      name: 'Criminal & Civil Law',
      icon: Gavel,
      color: 'text-red-500',
      subcategories: [
        'Arrest Procedures',
        'Legal Representation',
        'Bail & Bond',
        'Contract Disputes',
        'Consumer Protection',
        'Rental Agreements',
        'Insurance Claims'
      ]
    },
    {
      id: 'emergency',
      name: 'Emergency Legal Services',
      icon: ShieldAlert,
      color: 'text-orange-500',
      subcategories: [
        'Passport Loss/Theft',
        'Emergency Evacuation',
        'Medical Legal Issues',
        'Accident Representation',
        'Embassy Contacts',
        'Emergency Documentation',
        'Crisis Management'
      ]
    }
  ];

  // Pre-loaded legal insurance options
  const legalInsuranceOptions: LegalInsurance[] = [
    {
      id: 'basic',
      name: 'Basic Legal Protection',
      provider: 'Included in Premium',
      coverage: [
        'Document Review Services',
        '30-minute Attorney Consultations',
        'Legal Form Libraries',
        'Compliance Monitoring',
        'Emergency Legal Contacts'
      ],
      price: 'Included',
      recommended: false
    },
    {
      id: 'professional',
      name: 'Professional Legal Insurance',
      provider: 'Allianz Legal Shield',
      coverage: [
        'Full Contract Drafting/Review',
        'Unlimited Attorney Consultations',
        'Dispute Resolution Support',
        'Audit Defense Assistance',
        'Immigration Legal Support',
        'Up to $50,000 Coverage'
      ],
      price: '$199/year',
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Legal Shield',
      provider: 'AXA Corporate Legal',
      coverage: [
        'Dedicated Legal Team Access',
        'Business Compliance Management',
        'International Expansion Support',
        'M&A Guidance',
        'Unlimited Coverage',
        '24/7 Emergency Legal Support'
      ],
      price: '$499/year',
      recommended: false
    }
  ];

  // Pre-loaded emergency contacts by region
  const emergencyLegalContacts = {
    'Europe': {
      emergency: '112',
      consular: '+32 2 811 4300 (US Embassy Brussels - EU Hotline)',
      legalAid: 'European Legal Aid Board'
    },
    'Asia': {
      emergency: '110/119',
      consular: '+65 6476 9100 (US Embassy Singapore - Regional)',
      legalAid: 'Asian Legal Resource Centre'
    },
    'Americas': {
      emergency: '911',
      consular: '+1 202 501 4444 (US State Dept)',
      legalAid: 'Inter-American Legal Aid Foundation'
    },
    'Africa': {
      emergency: '112/999',
      consular: '+27 12 431 4000 (US Embassy Pretoria - Regional)',
      legalAid: 'African Legal Aid'
    },
    'Oceania': {
      emergency: '000',
      consular: '+61 2 6214 5600 (US Embassy Canberra)',
      legalAid: 'Pacific Legal Aid'
    }
  };

  // Pre-loaded attorney directory
  const verifiedAttorneys: Attorney[] = [
    {
      name: 'Dr. Maria Santos',
      specialization: 'Immigration & Visa Law',
      languages: ['English', 'Spanish', 'Portuguese'],
      country: 'Spain',
      city: 'Barcelona',
      contact: '+34 93 123 4567',
      rating: 4.9,
      verified: true
    },
    {
      name: 'James Chen, Esq.',
      specialization: 'International Tax Law',
      languages: ['English', 'Mandarin', 'Cantonese'],
      country: 'Singapore',
      city: 'Singapore',
      contact: '+65 6123 4567',
      rating: 4.8,
      verified: true
    },
    {
      name: 'Sophie Dubois',
      specialization: 'Business & Corporate Law',
      languages: ['English', 'French', 'German'],
      country: 'France',
      city: 'Paris',
      contact: '+33 1 23 45 67 89',
      rating: 4.9,
      verified: true
    },
    {
      name: 'Ahmed Al-Rahman',
      specialization: 'Criminal & Civil Law',
      languages: ['English', 'Arabic'],
      country: 'UAE',
      city: 'Dubai',
      contact: '+971 4 123 4567',
      rating: 4.7,
      verified: true
    },
    {
      name: 'Lisa Mueller, LLM',
      specialization: 'Immigration & Business Law',
      languages: ['English', 'German', 'Dutch'],
      country: 'Germany',
      city: 'Berlin',
      contact: '+49 30 1234 5678',
      rating: 4.9,
      verified: true
    }
  ];

  // Document templates
  const documentTemplates = [
    { name: 'Freelance Contract Template', category: 'Business', format: 'PDF/DOCX' },
    { name: 'Rental Agreement (International)', category: 'Civil', format: 'PDF/DOCX' },
    { name: 'Power of Attorney', category: 'General', format: 'PDF' },
    { name: 'Visa Appeal Letter Template', category: 'Immigration', format: 'DOCX' },
    { name: 'Tax Residency Declaration', category: 'Tax', format: 'PDF' },
    { name: 'Business Registration Checklist', category: 'Business', format: 'PDF' },
    { name: 'Emergency Legal Contacts Form', category: 'Emergency', format: 'PDF' }
  ];

  // Country-specific legal information
  const countryLegalInfo = {
    'Spain': {
      visaRules: 'Digital Nomad Visa available (1-5 years)',
      taxRate: '24% income tax for non-residents',
      businessSetup: 'SL (Limited Company) €3,000 minimum capital',
      legalSystem: 'Civil Law',
      emergencyNumber: '112'
    },
    'Portugal': {
      visaRules: 'D7 Passive Income Visa, Digital Nomad Visa',
      taxRate: 'NHR regime: 20% flat tax for 10 years',
      businessSetup: 'LDA minimum €1 capital',
      legalSystem: 'Civil Law',
      emergencyNumber: '112'
    },
    'Thailand': {
      visaRules: 'Digital Nomad Visa (DTV) 5-year multiple entry',
      taxRate: 'Territorial tax system (foreign income not taxed)',
      businessSetup: 'BOI registration for foreign business',
      legalSystem: 'Civil Law',
      emergencyNumber: '191'
    },
    'UAE': {
      visaRules: 'Digital Nomad Visa, Golden Visa available',
      taxRate: '0% personal income tax',
      businessSetup: 'Free Zone Company setup in 2-3 days',
      legalSystem: 'Civil Law with Sharia influence',
      emergencyNumber: '999'
    },
    'USA': {
      visaRules: 'No digital nomad visa, B1/B2 for business visitors',
      taxRate: 'Worldwide taxation for citizens/residents',
      businessSetup: 'LLC or C-Corp, varies by state',
      legalSystem: 'Common Law',
      emergencyNumber: '911'
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setUserInfo(prev => ({ ...prev, issueType: categoryId }));
  };

  const handleSubmitIssue = () => {
    if (!userInfo.name || !userInfo.citizenship || !userInfo.issueType || !userInfo.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newIssue: LegalIssue = {
      category: userInfo.issueType,
      subcategory: 'General',
      description: userInfo.description,
      urgency: 'medium'
    };

    setLegalIssues([...legalIssues, newIssue]);
    toast.success("Legal issue documented. We'll provide guidance shortly.");
    
    // Show attorney directory after issue submission
    setShowAttorneys(true);
  };

  const downloadTemplate = (templateName: string) => {
    toast.success(`Downloading ${templateName}...`);
  };

  const contactAttorney = (attorney: Attorney) => {
    toast.success(`Connecting you with ${attorney.name}...`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Scale className="w-8 h-8 text-primary" />
            AI Travel Lawyer
          </h1>
          <p className="text-muted-foreground mt-2">
            Global Legal Protection & Guidance for Digital Nomads
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Shield className="w-4 h-4 mr-2" />
          {subscription.tier === 'free' ? 'Limited Access' : 'Full Legal Access'}
        </Badge>
      </div>

      {/* Legal Disclaimer */}
      <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <AlertDescription className="text-sm">
          <strong>LEGAL DISCLAIMER:</strong> This service provides legal information, not legal advice. 
          Always consult with a licensed attorney for specific legal matters. This platform does not create 
          an attorney-client relationship.
        </AlertDescription>
      </Alert>

      {/* Premium Upgrade Banner */}
      {subscription.tier === 'free' && (
        <Alert className="border-primary bg-primary/5">
          <Shield className="w-5 h-5 text-primary" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Upgrade to Premium for Full Legal Protection:</strong>
                <p className="text-sm mt-1">Get unlimited attorney consultations, document review, and legal insurance options.</p>
              </div>
              <Button onClick={onUpgradeClick} size="sm">
                Upgrade Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Current Location & Emergency Info */}
      {currentLocation && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Current Location: {currentLocation.city}, {currentLocation.country}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Legal System Information:</h4>
                {countryLegalInfo[currentLocation.country as keyof typeof countryLegalInfo] ? (
                  <div className="space-y-2 text-sm">
                    <p><strong>Legal System:</strong> {countryLegalInfo[currentLocation.country as keyof typeof countryLegalInfo].legalSystem}</p>
                    <p><strong>Emergency:</strong> {countryLegalInfo[currentLocation.country as keyof typeof countryLegalInfo].emergencyNumber}</p>
                    <p><strong>Visa Rules:</strong> {countryLegalInfo[currentLocation.country as keyof typeof countryLegalInfo].visaRules}</p>
                    <p><strong>Tax Rate:</strong> {countryLegalInfo[currentLocation.country as keyof typeof countryLegalInfo].taxRate}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Loading legal information for this jurisdiction...</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Emergency Legal Contacts:</h4>
                <div className="space-y-2 text-sm">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency: 112
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Building2 className="w-4 h-4 mr-2" />
                    Local Embassy
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Legal Aid Services
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="issue" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="issue">Legal Issue</TabsTrigger>
          <TabsTrigger value="categories">Legal Areas</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="attorneys">Attorneys</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Legal Issue Submission Tab */}
        <TabsContent value="issue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Legal Issue</CardTitle>
              <CardDescription>
                Provide details about your legal concern. We'll provide guidance and connect you with appropriate resources.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizenship">Citizenship *</Label>
                  <Input
                    id="citizenship"
                    value={userInfo.citizenship}
                    onChange={(e) => setUserInfo({ ...userInfo, citizenship: e.target.value })}
                    placeholder="United States"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentCountry">Current Country</Label>
                  <Input
                    id="currentCountry"
                    value={userInfo.currentCountry}
                    onChange={(e) => setUserInfo({ ...userInfo, currentCountry: e.target.value })}
                    placeholder="Spain"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentCity">Current City</Label>
                  <Input
                    id="currentCity"
                    value={userInfo.currentCity}
                    onChange={(e) => setUserInfo({ ...userInfo, currentCity: e.target.value })}
                    placeholder="Barcelona"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueType">Legal Issue Category *</Label>
                <select
                  id="issueType"
                  className="w-full border rounded-md p-2"
                  value={userInfo.issueType}
                  onChange={(e) => setUserInfo({ ...userInfo, issueType: e.target.value })}
                >
                  <option value="">Select a category...</option>
                  {legalCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={userInfo.description}
                  onChange={(e) => setUserInfo({ ...userInfo, description: e.target.value })}
                  placeholder="Please describe your legal issue in detail. Include relevant dates, documents, and any actions you've already taken..."
                  rows={6}
                />
              </div>

              <Button onClick={handleSubmitIssue} className="w-full" size="lg">
                <FileText className="w-4 h-4 mr-2" />
                Submit Legal Issue
              </Button>
            </CardContent>
          </Card>

          {/* Submitted Issues */}
          {legalIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Legal Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {legalIssues.map((issue, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="mb-2">{issue.category}</Badge>
                          <p className="text-sm">{issue.description}</p>
                        </div>
                        <Badge variant={
                          issue.urgency === 'critical' ? 'destructive' :
                          issue.urgency === 'high' ? 'default' :
                          'secondary'
                        }>
                          {issue.urgency}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Legal Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {legalCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className={`w-6 h-6 ${category.color}`} />
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <ul className="space-y-2">
                        {category.subcategories.map((sub, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Legal Insurance Tab */}
        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Legal Insurance Protection Plans
              </CardTitle>
              <CardDescription>
                Comprehensive legal protection for international travelers and digital nomads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {legalInsuranceOptions.map((insurance) => (
                  <Card key={insurance.id} className={insurance.recommended ? 'border-primary border-2' : ''}>
                    {insurance.recommended && (
                      <div className="bg-primary text-primary-foreground text-center py-2 rounded-t-lg">
                        <Badge variant="secondary">RECOMMENDED</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{insurance.name}</CardTitle>
                      <CardDescription>{insurance.provider}</CardDescription>
                      <div className="text-3xl font-bold text-primary mt-2">{insurance.price}</div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {insurance.coverage.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full mt-6" variant={insurance.recommended ? 'default' : 'outline'}>
                        {insurance.id === 'basic' ? 'Included' : 'Get Coverage'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attorneys Directory Tab */}
        <TabsContent value="attorneys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Verified Attorney Network
              </CardTitle>
              <CardDescription>
                Bar-certified attorneys specializing in international law and digital nomad issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verifiedAttorneys.map((attorney, idx) => (
                  <Card key={idx} className="border-l-4 border-l-primary">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg">{attorney.name}</h3>
                            {attorney.verified && (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{attorney.specialization}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {attorney.city}, {attorney.country}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {attorney.languages.join(', ')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {attorney.contact}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-yellow-500">★</span>
                            <span className="font-semibold">{attorney.rating}</span>
                            <span className="text-sm text-muted-foreground">/5.0</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" onClick={() => contactAttorney(attorney)}>
                            <Phone className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents & Templates Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Legal Document Templates
              </CardTitle>
              <CardDescription>
                Pre-vetted legal templates for common international situations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documentTemplates.map((template, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <Book className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">{template.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                          <Badge variant="secondary" className="text-xs">{template.format}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => downloadTemplate(template.name)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Legal Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-orange-500" />
                Emergency Legal Procedures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>If Arrested Abroad:</strong>
                  <ol className="list-decimal ml-4 mt-2 space-y-1">
                    <li>Request to contact your embassy/consulate immediately</li>
                    <li>Do not sign any documents you don't understand</li>
                    <li>Ask for an interpreter if needed</li>
                    <li>Request a list of local attorneys</li>
                    <li>Document everything that happens</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>Lost/Stolen Passport:</strong>
                  <ol className="list-decimal ml-4 mt-2 space-y-1">
                    <li>File police report within 24 hours</li>
                    <li>Contact nearest embassy/consulate</li>
                    <li>Prepare: ID, passport photos, travel itinerary</li>
                    <li>Apply for emergency travel document</li>
                    <li>Report to issuing authority</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Action Bar */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">Need Immediate Legal Help?</h3>
              <p className="text-sm text-muted-foreground">Connect with a verified attorney in minutes</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Emergency Contact
              </Button>
              <Button size="lg">
                <Users className="w-4 h-4 mr-2" />
                Find Attorney Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
