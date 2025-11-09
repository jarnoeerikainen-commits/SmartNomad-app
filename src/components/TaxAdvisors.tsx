import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  Globe, 
  FileText, 
  Phone, 
  Mail, 
  ExternalLink,
  CheckCircle2,
  TrendingDown,
  Shield,
  Users
} from "lucide-react";

interface TaxAdvisor {
  name: string;
  specialty: string[];
  description: string;
  countries: string[];
  phone?: string;
  email?: string;
  website: string;
  verified: boolean;
  features: string[];
}

const taxAdvisors: TaxAdvisor[] = [
  {
    name: "Bright!Tax",
    specialty: ["US Expat Tax", "FATCA Compliance", "FBAR Filing"],
    description: "Leading US expat tax specialists serving Americans living abroad. IRS Circular 230 compliant with 50+ country expertise.",
    countries: ["United States", "Global Coverage"],
    phone: "+1-212-465-2528",
    email: "info@brighttax.com",
    website: "https://brighttax.com",
    verified: true,
    features: ["Free consultation", "FATCA experts", "Streamlined filing", "Audit support"]
  },
  {
    name: "Greenback Expat Tax Services",
    specialty: ["US Citizens Abroad", "Tax Treaty Navigation", "State Tax"],
    description: "Specialized US tax preparation for expats. Flat-rate pricing with comprehensive coverage for all US tax obligations abroad.",
    countries: ["United States", "Worldwide"],
    phone: "+1-866-525-5636",
    email: "support@greenbacktaxservices.com",
    website: "https://www.greenbacktaxservices.com",
    verified: true,
    features: ["Flat-rate pricing", "Married filing", "Investment income", "Self-employed"]
  },
  {
    name: "Henley & Partners Tax Advisory",
    specialty: ["Residence Planning", "Investment Migration", "Multi-Jurisdiction"],
    description: "Global leaders in residence and citizenship planning. Government-approved agents for 12+ investment programs.",
    countries: ["Portugal", "Malta", "UAE", "Caribbean", "EU"],
    phone: "+44-20-7823-1270",
    email: "contact@henleyglobal.com",
    website: "https://www.henleyglobal.com",
    verified: true,
    features: ["Investment programs", "NHR Portugal", "Malta citizenship", "UAE setup"]
  },
  {
    name: "AGS Global Tax",
    specialty: ["Portugal NHR", "Spanish Beckham Law", "EU Taxation"],
    description: "European tax specialists focusing on advantageous tax regimes. ACT certified for Portugal NHR applications.",
    countries: ["Portugal", "Spain", "Italy", "France"],
    phone: "+351-21-751-8600",
    email: "info@agsglobal.com",
    website: "https://www.agsglobal.com",
    verified: true,
    features: ["NHR experts", "Beckham Law", "EU residency", "Property tax"]
  },
  {
    name: "International Tax Advisors",
    specialty: ["UAE Tax Setup", "0% Jurisdictions", "Territorial Tax"],
    description: "Specialists in zero-tax and territorial tax jurisdictions. Expert guidance for UAE, Georgia, and Panama structures.",
    countries: ["UAE", "Georgia", "Panama", "Singapore"],
    phone: "+971-4-447-9827",
    email: "contact@internationaltax.ae",
    website: "https://www.internationaltax.ae",
    verified: true,
    features: ["UAE freezone", "Georgia residency", "Territorial systems", "Asset protection"]
  },
  {
    name: "Deloitte Global Mobility Services",
    specialty: ["Corporate Expat", "High Net Worth", "Compliance"],
    description: "Big 4 expertise for complex international tax situations. Comprehensive global mobility and tax planning.",
    countries: ["Global - 150+ countries"],
    phone: "+44-20-7007-0707",
    email: "globalmobility@deloitte.com",
    website: "https://www2.deloitte.com/global/en/services/tax/global-mobility-services.html",
    verified: true,
    features: ["Corporate tax", "Equity compensation", "Social security", "Immigration"]
  },
  {
    name: "Nomad Capitalist",
    specialty: ["Tax Optimization", "Flag Theory", "Second Citizenship"],
    description: "Holistic approach to legal tax reduction through residency and citizenship planning. Premium advisory for high earners.",
    countries: ["Global Strategy"],
    email: "contact@nomadcapitalist.com",
    website: "https://nomadcapitalist.com",
    verified: true,
    features: ["Personalized plans", "Flag theory", "Banking setup", "Investment migration"]
  },
  {
    name: "Taxback International",
    specialty: ["Working Holiday", "Temporary Workers", "Tax Refunds"],
    description: "Specialists in tax refunds for temporary workers and working holiday makers in multiple countries.",
    countries: ["Australia", "UK", "Ireland", "Canada", "USA"],
    phone: "+353-1-865-0400",
    email: "info@taxback.com",
    website: "https://www.taxback.com",
    verified: true,
    features: ["Tax refunds", "Working visas", "Fast processing", "Online filing"]
  }
];

const categories = [
  {
    title: "US Expat Tax",
    icon: Calculator,
    description: "Specialized services for US citizens living abroad",
    advisors: ["Bright!Tax", "Greenback Expat Tax Services"]
  },
  {
    title: "EU Tax Optimization",
    icon: Globe,
    description: "NHR, Beckham Law, and EU residency planning",
    advisors: ["AGS Global Tax", "Henley & Partners Tax Advisory"]
  },
  {
    title: "Zero-Tax Jurisdictions",
    icon: TrendingDown,
    description: "UAE, Georgia, and territorial tax systems",
    advisors: ["International Tax Advisors", "Nomad Capitalist"]
  },
  {
    title: "Corporate & HNW",
    icon: Shield,
    description: "Complex structures and high net worth planning",
    advisors: ["Deloitte Global Mobility Services", "Henley & Partners Tax Advisory"]
  }
];

export const TaxAdvisors = () => {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12 border">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-sm">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verified Partners
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Global Tax Advisors
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            Navigate international tax complexity with confidence. Connect with verified specialists 
            who understand nomadic lifestyles, cross-border income, and legal optimization strategies.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Government Accredited</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Expat Specialists</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>150+ Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.title} className="p-6 hover:shadow-lg transition-all hover:border-primary/50">
            <category.icon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">{category.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
            <div className="text-xs text-muted-foreground">
              {category.advisors.length} specialists
            </div>
          </Card>
        ))}
      </div>

      {/* Advisors Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Verified Tax Advisors</h2>
          <Badge variant="outline" className="text-sm">
            {taxAdvisors.length} Partners
          </Badge>
        </div>

        <div className="grid gap-6">
          {taxAdvisors.map((advisor) => (
            <Card key={advisor.name} className="p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Main Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{advisor.name}</h3>
                        {advisor.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{advisor.description}</p>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {advisor.specialty.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="grid sm:grid-cols-2 gap-2">
                    {advisor.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Countries */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span>{advisor.countries.join(" • ")}</span>
                  </div>
                </div>

                {/* Right Column - Contact */}
                <div className="lg:w-64 space-y-3">
                  <div className="space-y-2">
                    {advisor.phone && (
                      <a 
                        href={`tel:${advisor.phone}`}
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        <span>{advisor.phone}</span>
                      </a>
                    )}
                    {advisor.email && (
                      <a 
                        href={`mailto:${advisor.email}`}
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors break-all"
                      >
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span>{advisor.email}</span>
                      </a>
                    )}
                  </div>

                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => window.open(advisor.website, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <Card className="p-6 bg-muted/50 border-l-4 border-l-primary">
        <div className="flex gap-4">
          <FileText className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">Important Tax Advisory Notice</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Tax laws vary by jurisdiction and change frequently. The advisors listed are independent 
              professionals not directly affiliated with SuperNomad. Always verify credentials and 
              consult multiple sources before making tax decisions.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Verify advisor credentials with local regulatory bodies</li>
              <li>Request written fee schedules before engaging services</li>
              <li>Cross-reference advice with official government sources</li>
              <li>Consider obtaining second opinions for complex situations</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};