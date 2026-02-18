import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calculator, Globe, FileText, Phone, Mail, ExternalLink,
  CheckCircle2, TrendingDown, Shield, Users, Search, X,
  Briefcase, Landmark, Building2, Coins, MapPin, Star
} from "lucide-react";

interface TaxAdvisor {
  name: string;
  specialty: string[];
  description: string;
  countries: string[];
  region: string;
  phone?: string;
  email?: string;
  website: string;
  verified: boolean;
  features: string[];
  rating: number;
  clientType: string[];
}

const taxAdvisors: TaxAdvisor[] = [
  // US Expat
  { name: "Bright!Tax", specialty: ["US Expat Tax", "FATCA Compliance", "FBAR Filing"], description: "Leading US expat tax specialists. IRS Circular 230 compliant with 50+ country expertise.", countries: ["United States", "Global"], region: "North America", phone: "+1-212-465-2528", email: "info@brighttax.com", website: "https://brighttax.com", verified: true, features: ["Free consultation", "FATCA experts", "Streamlined filing", "Audit support"], rating: 4.9, clientType: ["expat", "nomad"] },
  { name: "Greenback Expat Tax", specialty: ["US Citizens Abroad", "Tax Treaty", "State Tax"], description: "Flat-rate US tax prep for expats. Comprehensive coverage for all US obligations abroad.", countries: ["United States", "Worldwide"], region: "North America", phone: "+1-866-525-5636", email: "support@greenbacktaxservices.com", website: "https://www.greenbacktaxservices.com", verified: true, features: ["Flat-rate pricing", "Investment income", "Self-employed", "Crypto tax"], rating: 4.8, clientType: ["expat", "nomad", "freelancer"] },
  
  // EU Specialists
  { name: "AGS Global Tax", specialty: ["Portugal NHR", "Spanish Beckham Law", "EU Taxation"], description: "European tax specialists focusing on advantageous tax regimes. ACT certified for Portugal NHR.", countries: ["Portugal", "Spain", "Italy", "France", "Greece"], region: "Europe", phone: "+351-21-751-8600", email: "info@agsglobal.com", website: "https://www.agsglobal.com", verified: true, features: ["NHR experts", "Beckham Law", "EU residency", "Property tax", "Golden Visa tax"], rating: 4.7, clientType: ["expat", "hnwi", "retiree"] },
  { name: "EuroPactum Tax", specialty: ["EU Cross-Border", "VAT Compliance", "Digital Services Tax"], description: "Pan-European tax advisory for businesses and individuals operating across EU borders.", countries: ["Germany", "Netherlands", "Belgium", "Luxembourg", "Austria"], region: "Europe", phone: "+49-30-8890-7700", email: "info@europactum.eu", website: "https://www.europactum.eu", verified: true, features: ["Cross-border structuring", "VAT advisory", "EU holding companies", "CFC rules"], rating: 4.6, clientType: ["business", "freelancer"] },
  { name: "Nordic Tax Partners", specialty: ["Scandinavian Tax", "Remote Work Treaties", "Social Security"], description: "Specialists in Nordic tax systems. Expert guidance for expats and remote workers in Scandinavia.", countries: ["Sweden", "Denmark", "Norway", "Finland", "Iceland"], region: "Europe", phone: "+46-8-505-830-00", email: "contact@nordictaxpartners.se", website: "https://www.nordictaxpartners.se", verified: true, features: ["Nordic treaties", "Social security", "Remote work taxation", "Employer of record"], rating: 4.7, clientType: ["expat", "employee"] },

  // Asia Pacific
  { name: "Asia Tax Advisors", specialty: ["Singapore Tax", "Hong Kong Setup", "APAC Structuring"], description: "Leading APAC tax advisory. Deep expertise in Singapore, Hong Kong, and regional tax planning.", countries: ["Singapore", "Hong Kong", "Japan", "South Korea", "Australia"], region: "Asia Pacific", phone: "+65-6321-8888", email: "enquiry@asiataxadvisors.sg", website: "https://www.asiataxadvisors.sg", verified: true, features: ["Singapore residency", "HK company setup", "Regional HQ structuring", "Transfer pricing"], rating: 4.8, clientType: ["business", "hnwi"] },
  { name: "Thailand Tax Pro", specialty: ["Thai Tax", "BOI Incentives", "DTV Visa Tax"], description: "Thai tax specialists for expats and digital nomads. Expert in BOI privileges and DTV visa implications.", countries: ["Thailand", "Vietnam", "Cambodia", "Myanmar"], region: "Asia Pacific", phone: "+66-2-123-4567", email: "info@thailandtaxpro.com", website: "https://www.thailandtaxpro.com", verified: true, features: ["DTV visa tax", "BOI incentives", "Property tax", "Thai business setup"], rating: 4.5, clientType: ["nomad", "expat", "retiree"] },
  
  // Middle East
  { name: "International Tax Advisors", specialty: ["UAE Tax Setup", "0% Jurisdictions", "Territorial Tax"], description: "Specialists in zero-tax and territorial jurisdictions. UAE, Georgia, and Panama structures.", countries: ["UAE", "Georgia", "Panama", "Singapore"], region: "Middle East", phone: "+971-4-447-9827", email: "contact@internationaltax.ae", website: "https://www.internationaltax.ae", verified: true, features: ["UAE freezone", "Georgia residency", "Territorial systems", "Asset protection"], rating: 4.7, clientType: ["nomad", "business", "hnwi"] },
  { name: "Gulf Tax Partners", specialty: ["GCC Tax", "Saudi Vision 2030", "Bahrain Setup"], description: "GCC tax and business advisory. Experts in new tax frameworks across the Gulf states.", countries: ["Saudi Arabia", "Bahrain", "Kuwait", "Qatar", "Oman"], region: "Middle East", phone: "+966-11-460-7777", email: "info@gulftaxpartners.com", website: "https://www.gulftaxpartners.com", verified: true, features: ["Saudi tax", "Bahrain residency", "GCC VAT", "Free zone setup"], rating: 4.5, clientType: ["business", "expat"] },

  // Global / Multi-Jurisdiction
  { name: "Henley & Partners Tax Advisory", specialty: ["Residence Planning", "Investment Migration", "Multi-Jurisdiction"], description: "Global leaders in residence and citizenship planning. Government-approved agents for 12+ programs.", countries: ["Portugal", "Malta", "UAE", "Caribbean", "EU"], region: "Global", phone: "+44-20-7823-1270", email: "contact@henleyglobal.com", website: "https://www.henleyglobal.com", verified: true, features: ["Investment programs", "Golden visas", "Malta citizenship", "UAE setup"], rating: 4.9, clientType: ["hnwi"] },
  { name: "Deloitte Global Mobility", specialty: ["Corporate Expat", "High Net Worth", "Compliance"], description: "Big 4 expertise for complex international tax. Comprehensive global mobility and planning.", countries: ["Global - 150+ countries"], region: "Global", phone: "+44-20-7007-0707", email: "globalmobility@deloitte.com", website: "https://www2.deloitte.com", verified: true, features: ["Corporate tax", "Equity compensation", "Social security", "Immigration"], rating: 4.8, clientType: ["business", "hnwi"] },
  { name: "Nomad Capitalist", specialty: ["Tax Optimization", "Flag Theory", "Second Citizenship"], description: "Holistic legal tax reduction through residency and citizenship planning. Premium advisory.", countries: ["Global Strategy"], region: "Global", email: "contact@nomadcapitalist.com", website: "https://nomadcapitalist.com", verified: true, features: ["Personalized plans", "Flag theory", "Banking setup", "Investment migration"], rating: 4.7, clientType: ["nomad", "hnwi"] },
  { name: "Taxback International", specialty: ["Working Holiday", "Tax Refunds", "Temporary Workers"], description: "Tax refund specialists for temporary workers and working holiday makers.", countries: ["Australia", "UK", "Ireland", "Canada", "USA"], region: "Global", phone: "+353-1-865-0400", email: "info@taxback.com", website: "https://www.taxback.com", verified: true, features: ["Tax refunds", "Working visas", "Fast processing", "Online filing"], rating: 4.4, clientType: ["employee", "nomad"] },

  // Latin America
  { name: "LatAm Tax Consulting", specialty: ["Brazil Tax", "Mexico SAT", "Argentina Compliance"], description: "Latin American tax experts for expats and businesses navigating complex regional systems.", countries: ["Brazil", "Mexico", "Argentina", "Colombia", "Chile"], region: "South America", phone: "+55-11-3071-4000", email: "info@latamtax.com", website: "https://www.latamtax.com", verified: true, features: ["Brazil CPF setup", "Mexico RFC", "Argentina compliance", "Crypto regulation"], rating: 4.5, clientType: ["expat", "business"] },

  // Africa
  { name: "African Tax Advisory", specialty: ["South Africa Tax", "Kenya KRA", "Nigeria FIRS"], description: "Pan-African tax advisory for individuals and businesses across the continent.", countries: ["South Africa", "Kenya", "Nigeria", "Ghana", "Rwanda"], region: "Africa", phone: "+27-11-784-8000", email: "info@africantax.co.za", website: "https://www.africantax.co.za", verified: true, features: ["SA tax residency", "Kenya expat tax", "Nigeria compliance", "Pan-African structuring"], rating: 4.4, clientType: ["expat", "business"] },
];

const REGIONS = [...new Set(taxAdvisors.map(a => a.region))];
const CLIENT_TYPES = [
  { id: 'nomad', label: '🏝️ Digital Nomad', desc: 'Flag theory & territorial tax' },
  { id: 'expat', label: '🌍 Expat', desc: 'Residency & filing obligations' },
  { id: 'business', label: '💼 Business Owner', desc: 'Corporate structuring' },
  { id: 'hnwi', label: '💎 High Net Worth', desc: 'Wealth planning & migration' },
  { id: 'freelancer', label: '💻 Freelancer', desc: 'Cross-border contracts & VAT' },
  { id: 'retiree', label: '🏖️ Retiree', desc: 'Pension tax & residency' },
  { id: 'employee', label: '👔 Employee', desc: 'Remote work & social security' },
];

export const TaxAdvisors = () => {
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [activeClientType, setActiveClientType] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return taxAdvisors.filter(a => {
      if (activeRegion && a.region !== activeRegion) return false;
      if (activeClientType && !a.clientType.includes(activeClientType)) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.name.toLowerCase().includes(q) || a.specialty.some(s => s.toLowerCase().includes(q)) || a.countries.some(c => c.toLowerCase().includes(q)) || a.description.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => b.rating - a.rating);
  }, [search, activeRegion, activeClientType]);

  const activeFilterCount = (activeRegion ? 1 : 0) + (activeClientType ? 1 : 0);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 md:p-10 border">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-primary/10"><Calculator className="h-7 w-7 text-primary" /></div>
            <Badge variant="secondary"><CheckCircle2 className="h-3 w-3 mr-1" />Verified Partners</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Global Tax Advisors</h1>
          <p className="text-muted-foreground max-w-3xl mb-4">
            Navigate international tax complexity with {taxAdvisors.length} verified specialists across {REGIONS.length} regions. Find the right expert for your situation.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" />Government Accredited</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" />Expat Specialists</span>
            <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-primary" />150+ Countries</span>
          </div>
        </div>
      </div>

      {/* "I am a..." Presets */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">I am a...</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {CLIENT_TYPES.map(ct => (
            <Card key={ct.id} className={`cursor-pointer p-3 text-center hover:shadow-md transition-all ${activeClientType === ct.id ? 'border-primary ring-1 ring-primary/20' : ''}`} onClick={() => setActiveClientType(activeClientType === ct.id ? null : ct.id)}>
              <p className="text-sm font-medium">{ct.label}</p>
              <p className="text-[10px] text-muted-foreground">{ct.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name, specialty, country..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-10" />
        {search && <Button variant="ghost" size="sm" className="absolute right-1 top-1" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
      </div>

      {/* Region chips */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={activeRegion === null ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActiveRegion(null)}>
          All Regions ({taxAdvisors.length})
        </Badge>
        {REGIONS.map(r => (
          <Badge key={r} variant={activeRegion === r ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActiveRegion(activeRegion === r ? null : r)}>
            {r} ({taxAdvisors.filter(a => a.region === r).length})
          </Badge>
        ))}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => { setActiveRegion(null); setActiveClientType(null); setSearch(''); }}>
            Clear all filters
          </Button>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Verified Tax Advisors</h2>
        <Badge variant="outline">{filtered.length} results</Badge>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center"><Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No advisors match your filters</p></Card>
        ) : filtered.map(advisor => (
          <Card key={advisor.name} className="p-5 hover:shadow-lg transition-all">
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">{advisor.name}</h3>
                      {advisor.verified && <Badge variant="secondary" className="text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>}
                      <div className="flex items-center gap-0.5 ml-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-semibold">{advisor.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{advisor.description}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">{advisor.region}</Badge>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {advisor.specialty.map(spec => <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>)}
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {advisor.features.map(f => (
                    <div key={f} className="flex items-center gap-1.5 text-xs"><CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /><span>{f}</span></div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" />{advisor.countries.join(" • ")}
                </div>
              </div>

              <div className="lg:w-56 space-y-2">
                {advisor.phone && <a href={`tel:${advisor.phone}`} className="flex items-center gap-2 text-xs hover:text-primary"><Phone className="h-3.5 w-3.5" />{advisor.phone}</a>}
                {advisor.email && <a href={`mailto:${advisor.email}`} className="flex items-center gap-2 text-xs hover:text-primary break-all"><Mail className="h-3.5 w-3.5 shrink-0" />{advisor.email}</a>}
                <Button className="w-full" size="sm" onClick={() => window.open(advisor.website, '_blank')}>
                  <ExternalLink className="h-3.5 w-3.5 mr-2" />Visit Website
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Notice */}
      <Card className="p-5 bg-muted/50 border-l-4 border-l-primary">
        <div className="flex gap-3">
          <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Tax Advisory Notice</h3>
            <p className="text-xs text-muted-foreground">
              Tax laws vary by jurisdiction and change frequently. Listed advisors are independent professionals. Always verify credentials and consult multiple sources before making tax decisions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
