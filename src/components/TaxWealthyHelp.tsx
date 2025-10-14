import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Globe, 
  FileText, 
  ExternalLink, 
  Search,
  Star,
  MapPin,
  Shield,
  TrendingUp,
  Stamp
} from 'lucide-react';
import { LocationData } from '@/types/country';

interface TaxWealthyHelpProps {
  currentLocation?: LocationData | null;
}

interface TaxAdvisor {
  name: string;
  type: string;
  specialties: string[];
  countries: string[];
  rating: number;
  website: string;
  description: string;
}

interface PassportService {
  name: string;
  type: string;
  programs: string[];
  countries: string[];
  investmentRange: string;
  website: string;
  description: string;
  processingTime: string;
}

const TaxWealthyHelp: React.FC<TaxWealthyHelpProps> = ({ currentLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const taxAdvisors: TaxAdvisor[] = [
    {
      name: "Deloitte International Tax",
      type: "Big Four",
      specialties: ["Tax Residency Planning", "HNWI Services", "Corporate Tax", "Estate Planning"],
      countries: ["UAE", "Singapore", "Portugal", "Monaco", "Switzerland"],
      rating: 4.8,
      website: "https://www2.deloitte.com/global/en/services/tax.html",
      description: "Global tax advisory for international tax optimization and residency planning"
    },
    {
      name: "PwC Private Client Services",
      type: "Big Four",
      specialties: ["Wealth Management", "Tax Planning", "Residency Advisory", "Trust Services"],
      countries: ["Singapore", "Hong Kong", "Switzerland", "Luxembourg", "UAE"],
      rating: 4.7,
      website: "https://www.pwc.com/gx/en/services/tax/private-client-services.html",
      description: "Comprehensive tax and wealth planning for high-net-worth individuals"
    },
    {
      name: "KPMG Global Mobility Services",
      type: "Big Four",
      specialties: ["International Tax", "Immigration", "Expat Tax", "Social Security"],
      countries: ["All Major Jurisdictions"],
      rating: 4.7,
      website: "https://home.kpmg/xx/en/home/services/tax/global-mobility-services.html",
      description: "Expert guidance on cross-border tax and mobility issues"
    },
    {
      name: "EY International Tax",
      type: "Big Four",
      specialties: ["Tax Planning", "Residency Change", "Wealth Transfer", "Compliance"],
      countries: ["Global Coverage"],
      rating: 4.6,
      website: "https://www.ey.com/en_gl/tax",
      description: "Strategic tax planning for individuals relocating internationally"
    },
    {
      name: "Henley & Partners",
      type: "Specialist",
      specialties: ["Residence Planning", "Citizenship Planning", "Tax Advisory", "Relocation"],
      countries: ["Portugal", "Malta", "Caribbean", "UAE", "Monaco"],
      rating: 4.9,
      website: "https://www.henleyglobal.com",
      description: "Leading international residence and citizenship planning firm"
    },
    {
      name: "Nomad Capitalist",
      type: "Specialist",
      specialties: ["Tax Optimization", "Flag Theory", "Offshore Strategy", "Second Residency"],
      countries: ["Tax-Free & Low-Tax Jurisdictions"],
      rating: 4.5,
      website: "https://nomadcapitalist.com",
      description: "Holistic offshore tax and lifestyle optimization strategies"
    }
  ];

  const passportServices: PassportService[] = [
    {
      name: "Henley & Partners",
      type: "Citizenship by Investment",
      programs: ["Caribbean CBI", "Malta", "Portugal Golden Visa", "Greece Golden Visa"],
      countries: ["Antigua & Barbuda", "St. Kitts & Nevis", "Dominica", "Malta", "Portugal", "Greece"],
      investmentRange: "$100,000 - €500,000",
      website: "https://www.henleyglobal.com/citizenship",
      description: "World's leading citizenship by investment advisory firm",
      processingTime: "3-6 months"
    },
    {
      name: "Arton Capital",
      type: "Global Citizenship Planning",
      programs: ["Grenada CBI", "St. Lucia CBI", "Turkey CBI", "Vanuatu CBI"],
      countries: ["Grenada", "St. Lucia", "Turkey", "Vanuatu"],
      investmentRange: "$100,000 - $400,000",
      website: "https://artoncapital.com",
      description: "Authorized agents for multiple citizenship by investment programs",
      processingTime: "2-6 months"
    },
    {
      name: "CS Global Partners",
      type: "Citizenship by Investment",
      programs: ["St. Kitts & Nevis", "Antigua & Barbuda", "Grenada", "Dominica"],
      countries: ["Caribbean Nations"],
      investmentRange: "$100,000 - $200,000",
      website: "https://www.csglobalpartners.com",
      description: "Exclusive marketing agents for Caribbean citizenship programs",
      processingTime: "3-4 months"
    },
    {
      name: "Latitude Residency & Citizenship",
      type: "Residency & Citizenship",
      programs: ["Portugal Golden Visa", "Spain Golden Visa", "Greece Golden Visa", "Malta Programs"],
      countries: ["EU Countries"],
      investmentRange: "€250,000 - €500,000",
      website: "https://latitudeworld.com",
      description: "European residency and citizenship programs specialist",
      processingTime: "6-12 months"
    },
    {
      name: "Savory & Partners",
      type: "Second Passport",
      programs: ["All Caribbean CBI", "Vanuatu", "Turkey", "Malta"],
      countries: ["Global Coverage"],
      investmentRange: "$100,000 - €1,000,000",
      website: "https://www.savoryandpartners.com",
      description: "Comprehensive second citizenship and residency solutions",
      processingTime: "2-8 months"
    }
  ];

  const taxFriendlyCountries = [
    {
      country: "United Arab Emirates",
      taxRate: "0%",
      benefits: ["No personal income tax", "No capital gains tax", "No wealth tax", "Business-friendly"],
      residency: "Golden Visa available",
      flag: "🇦🇪"
    },
    {
      country: "Monaco",
      taxRate: "0%",
      benefits: ["No income tax for residents", "No capital gains tax", "High net worth community"],
      residency: "Residency for wealthy individuals",
      flag: "🇲🇨"
    },
    {
      country: "Singapore",
      taxRate: "0-22%",
      benefits: ["Territorial tax system", "No capital gains tax", "No estate duty", "Low corporate tax"],
      residency: "Multiple visa schemes available",
      flag: "🇸🇬"
    },
    {
      country: "Portugal",
      taxRate: "0-48%",
      benefits: ["NHR regime (10 years tax benefits)", "Foreign income tax-free", "Golden Visa program"],
      residency: "Golden Visa from €250,000",
      flag: "🇵🇹"
    },
    {
      country: "Switzerland",
      taxRate: "Varies",
      benefits: ["Lump-sum taxation available", "Privacy protection", "Political stability"],
      residency: "Lump-sum tax regime for HNWIs",
      flag: "🇨🇭"
    },
    {
      country: "Malta",
      taxRate: "15-35%",
      benefits: ["Remittance-based taxation", "Non-dom status", "EU membership"],
      residency: "Multiple residence programs",
      flag: "🇲🇹"
    }
  ];

  const filteredAdvisors = taxAdvisors.filter(advisor =>
    advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    advisor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
    advisor.countries.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPassportServices = passportServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.countries.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
    service.programs.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tax & Wealth Planning</h1>
        <p className="text-muted-foreground">
          Professional tax advisory and second citizenship services for international lifestyle planning
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by country, specialty, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="advisors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="advisors">Tax Advisors</TabsTrigger>
          <TabsTrigger value="passports">Second Passports</TabsTrigger>
          <TabsTrigger value="countries">Tax-Friendly Countries</TabsTrigger>
        </TabsList>

        {/* Tax Advisors Tab */}
        <TabsContent value="advisors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                International Tax Advisors
              </CardTitle>
              <CardDescription>
                Leading tax advisory firms for international tax planning and residency optimization
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredAdvisors.map((advisor) => (
              <Card key={advisor.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{advisor.name}</CardTitle>
                      <Badge variant="outline" className="mb-2">{advisor.type}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{advisor.rating}</span>
                    </div>
                  </div>
                  <CardDescription>{advisor.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {advisor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Key Countries:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {advisor.countries.join(', ')}
                    </p>
                  </div>

                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => window.open(advisor.website, '_blank')}
                  >
                    Visit Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Second Passports Tab */}
        <TabsContent value="passports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stamp className="h-5 w-5" />
                Second Citizenship & Passport Services
              </CardTitle>
              <CardDescription>
                Official government-approved citizenship by investment programs
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredPassportServices.map((service) => (
              <Card key={service.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{service.name}</CardTitle>
                      <Badge variant="outline" className="mb-2">{service.type}</Badge>
                    </div>
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Programs:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.programs.map((program) => (
                        <Badge key={program} variant="secondary">
                          {program}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">Investment Range:</p>
                      <p className="text-muted-foreground">{service.investmentRange}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Processing Time:</p>
                      <p className="text-muted-foreground">{service.processingTime}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Available Countries:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {service.countries.join(', ')}
                    </p>
                  </div>

                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => window.open(service.website, '_blank')}
                  >
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tax-Friendly Countries Tab */}
        <TabsContent value="countries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tax-Friendly Countries
              </CardTitle>
              <CardDescription>
                Popular destinations for tax optimization and international living
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {taxFriendlyCountries.map((item) => (
              <Card key={item.country} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-3xl">{item.flag}</span>
                    {item.country}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-lg">
                      {item.taxRate}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Income Tax</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Key Benefits:</p>
                    <ul className="space-y-1">
                      {item.benefits.map((benefit) => (
                        <li key={benefit} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-1">Residency Options:</p>
                    <p className="text-sm text-muted-foreground">{item.residency}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Important Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            This information is for educational purposes only and does not constitute professional tax or legal advice. 
            Tax laws vary by jurisdiction and change frequently.
          </p>
          <p>
            Always consult with qualified tax professionals and legal advisors before making any tax residency or 
            citizenship decisions. Ensure all services are properly licensed and comply with relevant regulations.
          </p>
          <p className="font-medium text-foreground">
            SmartNomad is not affiliated with any listed service providers and does not receive compensation for referrals.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxWealthyHelp;
