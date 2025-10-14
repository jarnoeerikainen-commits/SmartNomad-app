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
  Stamp,
  FileCheck,
  AlertCircle
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

interface ExitProcedure {
  country: string;
  flag: string;
  forms: {
    name: string;
    description: string;
    url: string;
  }[];
  steps: string[];
  timeline: string;
  taxImplications: string[];
  officialResources: {
    name: string;
    url: string;
  }[];
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

  const exitProcedures: ExitProcedure[] = [
    {
      country: "United States",
      flag: "🇺🇸",
      forms: [
        {
          name: "Form 8854",
          description: "Initial and Annual Expatriation Statement - Required for covered expatriates",
          url: "https://www.irs.gov/forms-pubs/about-form-8854"
        },
        {
          name: "DS-4083",
          description: "Certificate of Loss of Nationality - State Department form",
          url: "https://travel.state.gov/content/travel/en/legal/travel-legal-considerations/us-citizenship/Renunciation-US-Nationality-Abroad.html"
        },
        {
          name: "Form 1040-NR",
          description: "Nonresident tax return for year of exit",
          url: "https://www.irs.gov/forms-pubs/about-form-1040-nr"
        }
      ],
      steps: [
        "Determine if you're a 'covered expatriate' (net worth > $2M or avg tax > threshold)",
        "File all prior year tax returns and pay outstanding taxes",
        "Complete Form 8854 and attach to final tax return",
        "Pay exit tax if applicable (mark-to-market taxation on worldwide assets)",
        "Notify Social Security Administration if receiving benefits",
        "Update financial institutions about non-resident status"
      ],
      timeline: "6-12 months minimum for proper planning",
      taxImplications: [
        "Exit tax on unrealized capital gains if covered expatriate",
        "30% withholding on future US-source income",
        "Need to file Form 8854 annually for 10 years if expatriating",
        "Gift and estate tax implications for US property"
      ],
      officialResources: [
        { name: "IRS Expatriation Tax", url: "https://www.irs.gov/individuals/international-taxpayers/expatriation-tax" },
        { name: "State Department - Renunciation", url: "https://travel.state.gov/content/travel/en/legal/travel-legal-considerations/us-citizenship/Renunciation-US-Nationality-Abroad.html" }
      ]
    },
    {
      country: "United Kingdom",
      flag: "🇬🇧",
      forms: [
        {
          name: "P85 Form",
          description: "Leaving the UK - getting your tax right",
          url: "https://www.gov.uk/government/publications/income-tax-leaving-the-uk-getting-your-tax-right-p85"
        },
        {
          name: "Form R43",
          description: "Claim for repayment of tax deducted from savings and investments",
          url: "https://www.gov.uk/government/publications/income-tax-claim-for-repayment-of-tax-deducted-from-savings-and-investments-r43"
        }
      ],
      steps: [
        "Determine your UK residence status using Statutory Residence Test",
        "Complete P85 form when leaving the UK",
        "Notify HMRC of your departure and new address",
        "Close or update UK bank accounts for non-resident status",
        "Arrange tax on UK income after departure (rental, pensions, etc.)",
        "Keep records for UK property if retained"
      ],
      timeline: "30 days after leaving to notify HMRC",
      taxImplications: [
        "Non-resident CGT on UK property sales",
        "Continued UK tax on UK-source income",
        "Split year treatment possible for year of departure",
        "Withholding tax on certain UK income"
      ],
      officialResources: [
        { name: "HMRC - Leaving the UK", url: "https://www.gov.uk/tax-right-retire-abroad-return-to-uk" },
        { name: "Statutory Residence Test", url: "https://www.gov.uk/government/publications/rdr3-statutory-residence-test-srt" }
      ]
    },
    {
      country: "Canada",
      flag: "🇨🇦",
      forms: [
        {
          name: "Form NR73",
          description: "Determination of Residency Status (Leaving Canada)",
          url: "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/nr73.html"
        },
        {
          name: "Form T1161",
          description: "List of Properties by an Emigrant of Canada",
          url: "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t1161.html"
        },
        {
          name: "Form NR4",
          description: "Non-resident tax withholding (for future income)",
          url: "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/nr4.html"
        }
      ],
      steps: [
        "Determine your emigration date (when residential ties are severed)",
        "Complete Form NR73 to determine residency status",
        "List all property on Form T1161 at time of departure",
        "Report deemed disposition of property (departure tax)",
        "Elect to defer tax on certain property if eligible",
        "File final Canadian tax return as resident",
        "Close or convert TFSA, RRSP accounts appropriately"
      ],
      timeline: "File NR73 before or with first non-resident return",
      taxImplications: [
        "Deemed disposition (departure tax) on most assets except Canadian real property, RRSPs",
        "Can elect to post security and defer tax payment",
        "25% withholding on RRSP withdrawals as non-resident",
        "Continue to file returns if Canadian-source income"
      ],
      officialResources: [
        { name: "CRA - Leaving Canada", url: "https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/leaving-canada-emigrants.html" },
        { name: "CRA - Departure Tax", url: "https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/leaving-canada-emigrants.html#dprtrtx" }
      ]
    },
    {
      country: "Germany",
      flag: "🇩🇪",
      forms: [
        {
          name: "Abmeldung",
          description: "Deregistration form at local registration office (Bürgeramt)",
          url: "https://www.berlin.de/labo/buergerdienste/dienstleistung/120686/"
        },
        {
          name: "Fragebogen zur steuerlichen Erfassung",
          description: "Tax assessment questionnaire for final return",
          url: "https://www.formulare-bfinv.de/"
        }
      ],
      steps: [
        "Complete Abmeldung at Bürgeramt before or within 2 weeks of departure",
        "Receive Abmeldebestätigung (deregistration certificate)",
        "Notify Finanzamt (tax office) of departure",
        "File final German tax return (Steuererklärung)",
        "Close or convert German bank accounts",
        "Cancel health insurance and notify pension authority",
        "Determine if extended limited tax liability applies"
      ],
      timeline: "Abmeldung within 2 weeks of departure",
      taxImplications: [
        "Extended limited tax liability for 10 years if moving to low-tax country",
        "Tax on German-source income continues",
        "No exit tax on unrealized gains",
        "Final tax assessment for year of departure"
      ],
      officialResources: [
        { name: "Bundesfinanzministerium", url: "https://www.bundesfinanzministerium.de/" },
        { name: "Finanzamt Finder", url: "https://www.bzst.de/DE/Service/Behoerdenwegweiser/Finanzamtsuche/finanzamtsuche_node.html" }
      ]
    },
    {
      country: "France",
      flag: "🇫🇷",
      forms: [
        {
          name: "Declaration 2042",
          description: "Final income tax return",
          url: "https://www.impots.gouv.fr/formulaire/2042/declaration-des-revenus"
        },
        {
          name: "Form 2074",
          description: "Declaration of capital gains if selling French property",
          url: "https://www.impots.gouv.fr/formulaire/2074/plus-values-sur-les-biens-meubles"
        }
      ],
      steps: [
        "Notify tax office (Centre des Impôts) of departure",
        "Establish non-resident status (no principal home in France)",
        "File Form 2042 for income until departure date",
        "Declare worldwide income for period of residence",
        "Update address with all French institutions",
        "Consider social charges (CSG/CRDS) on French assets"
      ],
      timeline: "Declare within normal tax filing deadlines",
      taxImplications: [
        "Exit tax on unrealized gains if holding substantial shares (>€800k) and moving outside EU",
        "Social charges continue on French-source income",
        "30% withholding on French property rental income",
        "Tax treaty benefits may apply"
      ],
      officialResources: [
        { name: "Service-Public - Expatriation", url: "https://www.service-public.fr/particuliers/vosdroits/F62" },
        { name: "Impots.gouv - Non-residents", url: "https://www.impots.gouv.fr/international/non-residents" }
      ]
    },
    {
      country: "Australia",
      flag: "🇦🇺",
      forms: [
        {
          name: "Leaving Australia Form",
          description: "Notify ATO of departure",
          url: "https://www.ato.gov.au/individuals-and-families/international-tax/going-overseas"
        },
        {
          name: "Tax Return (Individual)",
          description: "Final tax return before departure",
          url: "https://www.ato.gov.au/individuals-and-families/your-tax-return"
        }
      ],
      steps: [
        "Determine residency cessation date",
        "Notify ATO online or via letter",
        "File tax return for period of residency",
        "Consider CGT implications on assets",
        "Close or maintain Australian bank accounts",
        "Update Centrelink if receiving benefits",
        "Check superannuation access rules"
      ],
      timeline: "Notify ATO as soon as possible",
      taxImplications: [
        "CGT event on departure for certain assets",
        "Can choose to disregard CGT event and defer",
        "Foreign resident withholding on future Australian income",
        "Superannuation preservation rules apply"
      ],
      officialResources: [
        { name: "ATO - Going Overseas", url: "https://www.ato.gov.au/individuals-and-families/international-tax/going-overseas" },
        { name: "ATO - Residency Tests", url: "https://www.ato.gov.au/individuals-and-families/international-tax/work-out-your-tax-residency" }
      ]
    },
    {
      country: "Netherlands",
      flag: "🇳🇱",
      forms: [
        {
          name: "Emigration Form M",
          description: "Notification to municipality (gemeente)",
          url: "https://www.government.nl/topics/immigration-to-the-netherlands/question-and-answer/how-do-i-deregister-from-the-municipality-when-i-emigrate"
        },
        {
          name: "Annual Tax Return (IB)",
          description: "Final income tax return",
          url: "https://www.belastingdienst.nl/"
        }
      ],
      steps: [
        "Deregister from BRP (Basisregistratie Personen) at municipality",
        "Notify tax office (Belastingdienst) of departure",
        "File final income tax return",
        "Arrange payment of outstanding taxes",
        "Cancel health insurance (zorgeverzekering)",
        "Close or maintain Dutch bank accounts"
      ],
      timeline: "Deregister before or upon departure",
      taxImplications: [
        "Exit tax on unrealized gains in substantial shareholdings",
        "Final levy on assets (vermogensrendementsheffing)",
        "Tax treaty benefits may reduce withholding",
        "30% ruling ends upon departure"
      ],
      officialResources: [
        { name: "Government.nl - Emigration", url: "https://www.government.nl/topics/immigration-to-the-netherlands/question-and-answer/how-do-i-deregister-from-the-municipality-when-i-emigrate" },
        { name: "Belastingdienst", url: "https://www.belastingdienst.nl/wps/wcm/connect/en/individuals/individuals" }
      ]
    },
    {
      country: "Spain",
      flag: "🇪🇸",
      forms: [
        {
          name: "Modelo 030",
          description: "Census declaration - notify tax office of departure",
          url: "https://sede.agenciatributaria.gob.es/"
        },
        {
          name: "Modelo 100",
          description: "Final income tax return (IRPF)",
          url: "https://sede.agenciatributaria.gob.es/"
        },
        {
          name: "Baja Padrón",
          description: "Deregistration from municipal registry",
          url: "https://www.sede.administracion.gob.es/"
        }
      ],
      steps: [
        "Complete Baja Padrón at local town hall (Ayuntamiento)",
        "File Modelo 030 with tax office (Agencia Tributaria)",
        "Submit final IRPF return (Modelo 100)",
        "Notify Social Security (Seguridad Social) if registered",
        "Cancel health card and update address",
        "Consider wealth tax implications on Spanish assets"
      ],
      timeline: "File forms within standard deadlines",
      taxImplications: [
        "Exit tax on shares if holding > €4M and moving outside EU",
        "Continue paying tax on Spanish property and rental income",
        "Non-resident property owners pay 19-24% tax on imputed income",
        "Wealth tax applies to Spanish assets over threshold"
      ],
      officialResources: [
        { name: "Agencia Tributaria", url: "https://sede.agenciatributaria.gob.es/" },
        { name: "Ministry of Inclusion - Emigration", url: "https://www.inclusion.gob.es/web/migraciones/inicio" }
      ]
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

  const filteredExitProcedures = exitProcedures.filter(procedure =>
    procedure.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    procedure.forms.some(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="advisors">Tax Advisors</TabsTrigger>
          <TabsTrigger value="exit">Exit Procedures</TabsTrigger>
          <TabsTrigger value="passports">Second Passports</TabsTrigger>
          <TabsTrigger value="countries">Tax-Friendly</TabsTrigger>
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

        {/* Exit Procedures Tab */}
        <TabsContent value="exit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Country Exit & Tax Residency Procedures
              </CardTitle>
              <CardDescription>
                Official government forms and procedures for permanent departure and tax residency changes
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {filteredExitProcedures.map((procedure) => (
              <Card key={procedure.country} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <span className="text-4xl">{procedure.flag}</span>
                    {procedure.country}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    Timeline: {procedure.timeline}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Required Forms */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Required Forms
                    </h4>
                    <div className="space-y-3">
                      {procedure.forms.map((form) => (
                        <div key={form.name} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm mb-1">{form.name}</p>
                              <p className="text-sm text-muted-foreground">{form.description}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(form.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                    <h4 className="font-semibold mb-3">Exit Procedure Steps</h4>
                    <ol className="space-y-2">
                      {procedure.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                          <Badge variant="outline" className="mt-0.5 shrink-0">
                            {index + 1}
                          </Badge>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Tax Implications */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Tax Implications
                    </h4>
                    <ul className="space-y-2">
                      {procedure.taxImplications.map((implication, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          {implication}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Official Resources */}
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      Official Government Resources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {procedure.officialResources.map((resource) => (
                        <Button
                          key={resource.name}
                          variant="secondary"
                          size="sm"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          {resource.name}
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      ))}
                    </div>
                  </div>
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
