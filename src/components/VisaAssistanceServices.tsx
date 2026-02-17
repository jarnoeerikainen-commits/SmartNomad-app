import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Globe, 
  MapPin, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Search,
  Building,
  AlertCircle,
  Smartphone,
  Bot,
  Star
} from "lucide-react";

interface VisaAssistanceServicesProps {
  currentLocation?: LocationData | null;
  subscription?: Subscription;
}

import { Subscription } from "@/types/subscription";
import { LocationData } from "@/types/country";

interface VisaService {
  name: string;
  description: string;
  focus: string;
  coverage: string;
  processingTime: string;
  pricing: string;
  features: string[];
  website: string;
  appLinks: {
    ios?: string;
    android?: string;
  };
  availability: string;
  rating: number;
  verified: boolean;
}

const visaServices: VisaService[] = [
  {
    name: "iVisa",
    description: "Fast online visa processing for 190+ countries",
    focus: "Tourist & Business Visas",
    coverage: "190+ countries worldwide",
    processingTime: "Rush service available (24-72 hrs)",
    pricing: "Service fee from $25 + visa fees",
    features: [
      "Photo & form validation",
      "24/7 customer support",
      "Mobile app access",
      "Document checklist",
      "Status tracking",
      "Money-back guarantee"
    ],
    website: "https://www.ivisa.com",
    appLinks: {
      ios: "https://apps.apple.com/app/ivisa/id1450318251",
      android: "https://play.google.com/store/apps/details?id=com.ivisa"
    },
    availability: "24/7 Online",
    rating: 4.7,
    verified: true
  },
  {
    name: "VisaHQ",
    description: "Professional visa service with embassy relationships",
    focus: "All Visa Types",
    coverage: "170+ countries",
    processingTime: "Standard to rush options",
    pricing: "Service fee from $29 + visa fees",
    features: [
      "Personalized service",
      "Embassy submission",
      "Document preparation",
      "Passport return tracking",
      "Business visa expertise",
      "Legalization services"
    ],
    website: "https://www.visahq.com",
    appLinks: {},
    availability: "Business hours + online 24/7",
    rating: 4.6,
    verified: true
  },
  {
    name: "CIBTvisas",
    description: "Corporate-focused visa & passport services",
    focus: "Business & Corporate Travel",
    coverage: "Global coverage",
    processingTime: "Same-day to standard",
    pricing: "Service fee from $35 + visa fees",
    features: [
      "Corporate accounts",
      "Bulk processing",
      "Travel document management",
      "Immigration consulting",
      "Same-day service available",
      "Dedicated account managers"
    ],
    website: "https://www.cibtvisas.com",
    appLinks: {},
    availability: "24/7 online + office hours",
    rating: 4.5,
    verified: true
  },
  {
    name: "VisaConnect",
    description: "AI-powered visa requirement checker",
    focus: "Digital Visa Solutions",
    coverage: "195+ countries",
    processingTime: "Digital processing 1-5 days",
    pricing: "Free checker, services from $20",
    features: [
      "AI visa eligibility checker",
      "Real-time requirement updates",
      "Document templates",
      "Application tracking",
      "Email notifications",
      "Multi-language support"
    ],
    website: "https://www.visaconnect.com",
    appLinks: {
      ios: "https://apps.apple.com/app/visaconnect",
      android: "https://play.google.com/store/apps/details?id=com.visaconnect"
    },
    availability: "24/7 Online",
    rating: 4.4,
    verified: true
  },
  {
    name: "Travel Visa Pro",
    description: "Expedited visa services with concierge support",
    focus: "Expedited Processing",
    coverage: "150+ countries",
    processingTime: "Rush service 24-48 hrs",
    pricing: "Service fee from $99 + visa fees",
    features: [
      "VIP concierge service",
      "Hand-delivery to embassy",
      "Document review",
      "Application completion",
      "Rush processing",
      "Live chat support"
    ],
    website: "https://www.traveldocs.com",
    appLinks: {},
    availability: "24/7 Support",
    rating: 4.8,
    verified: true
  },
  {
    name: "Atlys",
    description: "Modern digital visa application platform",
    focus: "Digital-First Visas",
    coverage: "50+ countries (growing)",
    processingTime: "2-7 days average",
    pricing: "Service fee from $15 + visa fees",
    features: [
      "Simple mobile-first interface",
      "Photo capture & validation",
      "Real-time status updates",
      "Digital visa delivery",
      "Auto-fill technology",
      "Young, tech-focused company"
    ],
    website: "https://www.atlys.com",
    appLinks: {
      ios: "https://apps.apple.com/app/atlys",
      android: "https://play.google.com/store/apps/details?id=com.atlys"
    },
    availability: "24/7 Online",
    rating: 4.6,
    verified: true
  },
  {
    name: "Visa First",
    description: "UK-based visa & passport specialists",
    focus: "UK & EU Travelers",
    coverage: "Worldwide from UK/EU",
    processingTime: "Standard to express",
    pricing: "Service fee from £30 + visa fees",
    features: [
      "UK office locations",
      "Document certification",
      "Apostille services",
      "Travel insurance integration",
      "Expert consultation",
      "Courier services included"
    ],
    website: "https://www.visafirst.com",
    appLinks: {},
    availability: "UK business hours + online",
    rating: 4.5,
    verified: true
  },
  {
    name: "MyVisaSource",
    description: "Comprehensive visa & immigration services",
    focus: "Immigration & Work Visas",
    coverage: "Global",
    processingTime: "Varies by visa type",
    pricing: "Custom quotes from $50",
    features: [
      "Immigration attorney network",
      "Work visa specialists",
      "Family visa services",
      "Permanent residency assistance",
      "Compliance tracking",
      "Multi-country applications"
    ],
    website: "https://www.myvisasource.com",
    appLinks: {},
    availability: "Business hours + email 24/7",
    rating: 4.3,
    verified: true
  }
];

export const VisaAssistanceServices = ({ currentLocation, subscription }: VisaAssistanceServicesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<VisaService | null>(null);
  const isPremium = subscription?.tier === 'premium';
  const currentLocationString = currentLocation?.city || currentLocation?.country || "";

  const filteredServices = visaServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Visa Assistance Services</h1>
          <Badge variant="secondary" className="ml-2">NEW</Badge>
        </div>
        <p className="text-muted-foreground">
          Professional visa services, local offices, and expert guidance for your travel documentation needs
        </p>
      </div>

      {isPremium && (
        <Alert className="border-primary/50 bg-primary/5">
          <Bot className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong className="text-primary">Premium AI Assistant:</strong> Get instant visa requirement checks, 
            document guidance, and personalized recommendations before contacting services.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">
            <Globe className="h-4 w-4 mr-2" />
            Visa Services
          </TabsTrigger>
          <TabsTrigger value="local">
            <MapPin className="h-4 w-4 mr-2" />
            Local Offices
          </TabsTrigger>
          <TabsTrigger value="embassies">
            <Building className="h-4 w-4 mr-2" />
            Embassies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search visa services by name, focus, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {filteredServices.map((service) => (
              <Card key={service.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        {service.verified && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {service.focus}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      ⭐ {service.rating}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <span className="font-medium">Coverage:</span>
                      <span className="text-muted-foreground">{service.coverage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">Processing:</span>
                      <span className="text-muted-foreground">{service.processingTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-medium">Pricing:</span>
                      <span className="text-muted-foreground">{service.pricing}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">Available:</span>
                      <span className="text-muted-foreground">{service.availability}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Features:</p>
                    <ul className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(service.website, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit Website
                    </Button>
                    {service.appLinks.ios && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(service.appLinks.ios, '_blank')}
                      >
                        <Smartphone className="h-4 w-4 mr-1" />
                        iOS
                      </Button>
                    )}
                    {service.appLinks.android && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(service.appLinks.android, '_blank')}
                      >
                        <Smartphone className="h-4 w-4 mr-1" />
                        Android
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No visa services found matching "{searchQuery}"
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="local" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Local Visa Offices</CardTitle>
              <CardDescription>
                Search for visa application centers and immigration offices near you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Location</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder={currentLocationString || "Enter city or country..."} 
                    defaultValue={currentLocationString}
                  />
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertDescription>
                  <strong>Popular Visa Application Centers:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• VFS Global - Present in 140+ countries worldwide</li>
                    <li>• TLScontact - Major visa application centers in Europe, Africa, Asia</li>
                    <li>• BLS International - Visa & consular services globally</li>
                    <li>• CAPAGO - Visa application services in Asia-Pacific</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">VFS Global</CardTitle>
                    <CardDescription>World's largest visa outsourcing company</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open('https://www.vfsglobal.com/en/individuals/index.html', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Find VFS Center
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">TLScontact</CardTitle>
                    <CardDescription>European visa processing specialist</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open('https://www.tlscontact.com', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Find TLS Center
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">BLS International</CardTitle>
                    <CardDescription>Visa & consular services provider</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open('https://www.blsinternational.com', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Find BLS Center
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">CAPAGO</CardTitle>
                    <CardDescription>Asia-Pacific visa services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open('https://www.capago.com', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Find CAPAGO Center
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embassies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Embassy & Consulate Directory</CardTitle>
              <CardDescription>
                Find embassies and consulates for visa inquiries and applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Building className="h-4 w-4" />
                <AlertDescription>
                  Contact embassies directly for official visa information, requirements, and application procedures.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Your Passport Country</label>
                <Input placeholder="Enter your passport country..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Destination Country</label>
                <Input placeholder="Enter destination country..." />
              </div>

              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Find Embassy Information
              </Button>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Quick Links:</p>
                <div className="grid gap-2 md:grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://www.embassy-worldwide.com', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Embassy Worldwide
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://www.embassypages.com', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Embassy Pages
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://www.gov.uk/world/embassies', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    UK Gov Embassies
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://www.usembassy.gov', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    US Embassies
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <CardTitle>Important Visa Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Always verify visa requirements directly with official embassy websites</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Apply for visas well in advance - processing times vary greatly</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Keep photocopies of all submitted documents for your records</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Check passport validity - many countries require 6 months validity</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Service fees are separate from official government visa fees</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
