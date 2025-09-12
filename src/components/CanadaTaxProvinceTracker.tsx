import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, AlertTriangle, Clock, Info, Calculator, FileText } from 'lucide-react';
import { Country } from '@/types/country';

interface CanadaTaxProvinceTrackerProps {
  countries: Country[];
}

interface ProvinceTaxInfo {
  code: string;
  name: string;
  flag: string;
  category: 'low_tax' | 'medium_tax' | 'high_tax';
  taxRates: {
    personal: { min: number; max: number };
    corporate: number;
  };
  residencyDetermination: string;
  keyRules: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  specialNotes: string[];
  taxCredits: string[];
  filingDeadline: string;
  healthPremium: boolean;
  socialBenefits: string[];
}

const CANADA_PROVINCES: ProvinceTaxInfo[] = [
  // No Provincial Tax / Low Tax Territories
  {
    code: 'NU',
    name: 'Nunavut',
    flag: '🏔️',
    category: 'low_tax',
    taxRates: { personal: { min: 4.0, max: 11.5 }, corporate: 12.0 },
    residencyDetermination: 'Resident on December 31st',
    keyRules: [
      'Lowest personal tax rates in Canada',
      'Northern residents deduction available',
      'Simple residency determination'
    ],
    riskLevel: 'Low',
    specialNotes: [
      'Northern living allowance benefits',
      'Cost of living tax credits',
      'Isolation allowance eligible'
    ],
    taxCredits: ['Northern Residents Deduction', 'Cost of Living Tax Credit'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['Nunavut Child Benefit', 'Senior Citizens Benefit']
  },
  {
    code: 'NT',
    name: 'Northwest Territories',
    flag: '🏔️',
    category: 'low_tax',
    taxRates: { personal: { min: 5.9, max: 13.05 }, corporate: 11.5 },
    residencyDetermination: 'Resident on December 31st',
    keyRules: [
      'Low tax rates with northern benefits',
      'Remote area benefits available',
      'December 31 residency rule'
    ],
    riskLevel: 'Low',
    specialNotes: [
      'Northern living allowance',
      'Remote work tax benefits',
      'Heating cost supplements'
    ],
    taxCredits: ['Northern Residents Deduction', 'NWT Child Benefit'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['NWT Child Benefit', 'Senior Citizen Supplementary Benefit']
  },
  {
    code: 'YT',
    name: 'Yukon',
    flag: '🏔️',
    category: 'low_tax',
    taxRates: { personal: { min: 6.4, max: 15.0 }, corporate: 12.0 },
    residencyDetermination: 'Resident on December 31st',
    keyRules: [
      'Competitive tax rates',
      'Northern resident benefits',
      'December 31 determination'
    ],
    riskLevel: 'Low',
    specialNotes: [
      'Mining tax benefits available',
      'Rural living deductions',
      'Fuel cost supplements'
    ],
    taxCredits: ['Northern Residents Deduction', 'Yukon Child Benefit'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['Yukon Child Benefit', 'Pioneer Utility Grant']
  },

  // Medium Tax Provinces
  {
    code: 'AB',
    name: 'Alberta',
    flag: '🛢️',
    category: 'medium_tax',
    taxRates: { personal: { min: 10.0, max: 15.0 }, corporate: 11.67 },
    residencyDetermination: 'Resident on December 31st, primary residence location',
    keyRules: [
      'Flat 10% provincial tax rate',
      'No provincial sales tax',
      'December 31 residency determination'
    ],
    riskLevel: 'Medium',
    specialNotes: [
      'Alberta Health Care Insurance Plan required',
      'No provincial sales tax benefit',
      'Oil and gas industry tax benefits'
    ],
    taxCredits: ['Alberta Family Employment Tax Credit', 'Alberta Child Benefit'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['Alberta Child Benefit', 'Alberta Senior Benefit']
  },
  {
    code: 'SK',
    name: 'Saskatchewan',
    flag: '🌾',
    category: 'medium_tax',
    taxRates: { personal: { min: 10.5, max: 14.5 }, corporate: 12.0 },
    residencyDetermination: 'Resident on December 31st, principal residence',
    keyRules: [
      'Progressive tax rates',
      'Agriculture tax benefits',
      'December 31 residency rule'
    ],
    riskLevel: 'Medium',
    specialNotes: [
      'Saskatchewan Health Services required',
      'Potash and mining benefits',
      'Rural property tax considerations'
    ],
    taxCredits: ['Saskatchewan Low-Income Tax Credit', 'Graduate Retention Program'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['Saskatchewan Income Support', 'Graduate Retention Program']
  },
  {
    code: 'MB',
    name: 'Manitoba',
    flag: '🦌',
    category: 'medium_tax',
    taxRates: { personal: { min: 10.8, max: 17.4 }, corporate: 12.0 },
    residencyDetermination: 'Resident on December 31st, ordinarily resident',
    keyRules: [
      'Progressive tax structure',
      'Health and education levies',
      'December 31 determination'
    ],
    riskLevel: 'Medium',
    specialNotes: [
      'Manitoba Health required',
      'Education property tax credits',
      'Northern communities benefits'
    ],
    taxCredits: ['Manitoba Family Tax Benefit', 'Primary Caregiver Tax Credit'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['Manitoba Child Benefit', 'Rent Assist Program']
  },

  // High Tax Provinces
  {
    code: 'BC',
    name: 'British Columbia',
    flag: '🌲',
    category: 'high_tax',
    taxRates: { personal: { min: 5.06, max: 20.5 }, corporate: 12.0 },
    residencyDetermination: 'Resident on December 31st, factual residence test',
    keyRules: [
      'High top marginal rates',
      'MSP premiums eliminated 2020',
      'Speculation and vacancy tax'
    ],
    riskLevel: 'High',
    specialNotes: [
      'Foreign buyer tax on property',
      'Carbon tax implications',
      'High income surtax above $150,000'
    ],
    taxCredits: ['BC Family Benefit', 'Climate Action Tax Credit'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['BC Family Benefit', 'Rental Assistance Program']
  },
  {
    code: 'ON',
    name: 'Ontario',
    flag: '🏢',
    category: 'high_tax',
    taxRates: { personal: { min: 5.05, max: 13.16 }, corporate: 11.5 },
    residencyDetermination: 'Resident on December 31st, ordinarily resident test',
    keyRules: [
      'OHIP eligibility tied to residency',
      'High-income surtax applies',
      'December 31 determination crucial'
    ],
    riskLevel: 'High',
    specialNotes: [
      'OHIP requires 153 days minimum',
      'Toronto area has additional land transfer tax',
      'Employer Health Tax implications'
    ],
    taxCredits: ['Ontario Trillium Benefit', 'Ontario Child Benefit'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['Ontario Child Benefit', 'Ontario Drug Benefit']
  },
  {
    code: 'QC',
    name: 'Quebec',
    flag: '⚜️',
    category: 'high_tax',
    taxRates: { personal: { min: 14.0, max: 25.75 }, corporate: 11.5 },
    residencyDetermination: 'Resident on December 31st, Revenu Québec separate filing',
    keyRules: [
      'Separate Quebec tax return required',
      'Highest provincial tax rates',
      'French language requirements for business'
    ],
    riskLevel: 'High',
    specialNotes: [
      'Must file separate Revenu Québec return',
      'Quebec Pension Plan instead of CPP',
      'Parental insurance plan contributions'
    ],
    taxCredits: ['Solidarity Tax Credit', 'Quebec Child Assistance'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['Quebec Child Assistance', 'Parental Insurance Plan']
  },
  {
    code: 'NB',
    name: 'New Brunswick',
    flag: '🦞',
    category: 'medium_tax',
    taxRates: { personal: { min: 9.68, max: 16.52 }, corporate: 14.0 },
    residencyDetermination: 'Resident on December 31st, principal residence',
    keyRules: [
      'Moderate tax rates',
      'Maritime benefits available',
      'December 31 residency test'
    ],
    riskLevel: 'Medium',
    specialNotes: [
      'Medicare enrollment required',
      'Property tax relief programs',
      'Atlantic immigration benefits'
    ],
    taxCredits: ['NB Working Income Supplement', 'NB Child Tax Benefit'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['NB Child Tax Benefit', 'Seniors Benefit']
  },
  {
    code: 'PE',
    name: 'Prince Edward Island',
    flag: '🥔',
    category: 'medium_tax',
    taxRates: { personal: { min: 9.8, max: 16.7 }, corporate: 16.0 },
    residencyDetermination: 'Resident on December 31st, ordinary residence',
    keyRules: [
      'Small population benefits',
      'Maritime tax advantages',
      'December 31 determination'
    ],
    riskLevel: 'Medium',
    specialNotes: [
      'Health PEI enrollment required',
      'Island-specific tax credits',
      'Tourism industry benefits'
    ],
    taxCredits: ['PEI Working Income Tax Benefit', 'PEI Sales Tax Credit'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['PEI Family Benefit', 'Seniors Drug Cost Assistance']
  },
  {
    code: 'NS',
    name: 'Nova Scotia',
    flag: '⚓',
    category: 'high_tax',
    taxRates: { personal: { min: 8.79, max: 21.0 }, corporate: 14.0 },
    residencyDetermination: 'Resident on December 31st, ordinary residence test',
    keyRules: [
      'High top marginal rate',
      'Maritime advantages',
      'December 31 residency crucial'
    ],
    riskLevel: 'High',
    specialNotes: [
      'MSI enrollment required',
      'Halifax regional municipality taxes',
      'Ocean industries tax benefits'
    ],
    taxCredits: ['NS Affordable Living Tax Credit', 'NS Child Benefit'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['NS Child Benefit', 'Pharmacare Program']
  },
  {
    code: 'NL',
    name: 'Newfoundland and Labrador',
    flag: '🐟',
    category: 'high_tax',
    taxRates: { personal: { min: 8.7, max: 18.3 }, corporate: 15.0 },
    residencyDetermination: 'Resident on December 31st, factual residence',
    keyRules: [
      'High provincial tax rates',
      'Oil industry benefits',
      'Remote area considerations'
    ],
    riskLevel: 'High',
    specialNotes: [
      'MCP enrollment required',
      'Oil and gas sector benefits',
      'Northern Labrador benefits'
    ],
    taxCredits: ['NL Low Income Tax Reduction', 'NL Child Benefit'],
    filingDeadline: 'April 30',
    healthPremium: false,
    socialBenefits: ['NL Child Benefit', 'Income Support Program']
  }
];

export const CanadaTaxProvinceTracker: React.FC<CanadaTaxProvinceTrackerProps> = ({ countries }) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [canadaDays, setCanadaDays] = useState(0);
  const [provincialDays, setProvincialDays] = useState(0);

  const calculateCanadianTaxMetrics = () => {
    const canadaCountry = countries.find(c => c.name.toLowerCase().includes('canada'));
    if (!canadaCountry) {
      setCanadaDays(0);
      setProvincialDays(0);
      return;
    }

    let totalDays = 0;
    let provinceDays = 0;

    // Use the existing country data structure - assuming days are tracked in daysSpent or similar
    if (canadaCountry.daysSpent) {
      totalDays = canadaCountry.daysSpent;
      provinceDays = canadaCountry.daysSpent;
    }

    // If there are date ranges in stays (would need to be added to Country interface)
    // For now, we'll use daysSpent as a fallback
    setCanadaDays(totalDays);
    setProvincialDays(provinceDays);
  };

  useEffect(() => {
    calculateCanadianTaxMetrics();
  }, [countries, currentYear, selectedProvince]);

  const getDeemedResidencyStatus = () => {
    const progress = Math.min((canadaDays / 183) * 100, 100);
    const remaining = Math.max(183 - canadaDays, 0);
    
    if (canadaDays >= 183) {
      return { progress, remaining, status: 'deemed_resident' as const };
    }
    return { progress, remaining, status: 'non_resident' as const };
  };

  const getProvincialTaxStatus = () => {
    if (!selectedProvince) return null;
    
    const province = CANADA_PROVINCES.find(p => p.code === selectedProvince);
    if (!province) return null;

    // December 31st rule - simplified assumption
    const hasDecember31Presence = canadaDays > 0;
    
    return {
      province,
      isResident: hasDecember31Presence,
      days: provincialDays
    };
  };

  const deemedStatus = getDeemedResidencyStatus();
  const provincialStatus = getProvincialTaxStatus();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'low_tax': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium_tax': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high_tax': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Canada Provincial Tax Compliance Tracker
          </CardTitle>
          <CardDescription>
            Track your tax residency status across Canadian provinces and territories. Based on 2025 CRA rules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tax Year</label>
              <Select value={currentYear.toString()} onValueChange={(value) => setCurrentYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Province/Territory</label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger>
                  <SelectValue placeholder="Select province/territory" />
                </SelectTrigger>
                <SelectContent>
                  {CANADA_PROVINCES.map(province => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.flag} {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Federal Deemed Residency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Days in Canada ({currentYear})</span>
                    <span className="font-semibold">{canadaDays}/183</span>
                  </div>
                  <Progress value={deemedStatus.progress} className="h-2" />
                  <Badge variant={deemedStatus.status === 'deemed_resident' ? 'destructive' : 'secondary'}>
                    {deemedStatus.status === 'deemed_resident' ? '⚠️ Deemed Resident' : '✅ Non-Resident'}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {deemedStatus.status === 'deemed_resident' 
                      ? 'You are considered a deemed resident. Must pay federal tax + surtax on worldwide income.'
                      : `${deemedStatus.remaining} days remaining before deemed residency.`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {provincialStatus && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {provincialStatus.province.flag} {provincialStatus.province.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge className={getCategoryColor(provincialStatus.province.category)}>
                      {provincialStatus.province.category.replace('_', ' ').toUpperCase()} RISK
                    </Badge>
                    <div className="text-sm space-y-1">
                      <p><strong>Tax Rates:</strong> {provincialStatus.province.taxRates.personal.min}% - {provincialStatus.province.taxRates.personal.max}%</p>
                      <p><strong>Corporate:</strong> {provincialStatus.province.taxRates.corporate}%</p>
                      <p><strong>Filing Deadline:</strong> {provincialStatus.province.filingDeadline}</p>
                    </div>
                    <Badge variant={provincialStatus.isResident ? 'destructive' : 'secondary'}>
                      {provincialStatus.isResident ? 'Provincial Resident' : 'Non-Resident'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Tabs defaultValue="provinces" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="provinces">All Provinces</TabsTrigger>
              <TabsTrigger value="rules">Tax Rules</TabsTrigger>
              <TabsTrigger value="planning">Planning Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="provinces">
              <div className="grid gap-4">
                {['low_tax', 'medium_tax', 'high_tax'].map(category => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-3 capitalize">
                      {category.replace('_', ' ')} Provinces & Territories
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {CANADA_PROVINCES.filter(p => p.category === category).map(province => (
                        <Card key={province.code} className="relative">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center justify-between">
                              <span>{province.flag} {province.name}</span>
                              <div className={`w-3 h-3 rounded-full ${getRiskColor(province.riskLevel)}`} />
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs space-y-2">
                            <p><strong>Personal Tax:</strong> {province.taxRates.personal.min}%-{province.taxRates.personal.max}%</p>
                            <p><strong>Corporate:</strong> {province.taxRates.corporate}%</p>
                            <p><strong>Risk Level:</strong> {province.riskLevel}</p>
                            <div className="pt-2">
                              <p className="text-muted-foreground">{province.residencyDetermination}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rules">
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Federal 183-Day Rule:</strong> If you stay in Canada for 183 days or more in a tax year, 
                    you become a deemed resident and must pay tax on worldwide income.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Provincial Tax Residency:</strong> Determined by where you lived on December 31st of the tax year. 
                    Each province has different tax rates and credits.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Quebec Special Rules:</strong> Quebec requires separate tax filing with Revenu Québec 
                    in addition to federal filing. Highest provincial tax rates in Canada.
                  </AlertDescription>
                </Alert>

                {selectedProvince && provincialStatus && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {provincialStatus.province.flag} {provincialStatus.province.name} - Detailed Rules
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Key Rules:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {provincialStatus.province.keyRules.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Special Notes:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {provincialStatus.province.specialNotes.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Available Tax Credits:</h4>
                        <div className="flex flex-wrap gap-2">
                          {provincialStatus.province.taxCredits.map((credit, index) => (
                            <Badge key={index} variant="outline">{credit}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="planning">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Planning Strategies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">For Non-Residents:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Stay under 183 days to avoid deemed residency</li>
                        <li>Maintain primary ties in another country</li>
                        <li>Consider tax treaty benefits</li>
                        <li>Plan December 31st location carefully</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">For Residents:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Maximize provincial tax credits available</li>
                        <li>Consider RRSP contributions</li>
                        <li>Plan capital gains realization timing</li>
                        <li>Understand health care eligibility</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Province Selection Factors:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Compare total tax burden (provincial + federal)</li>
                        <li>Health care coverage requirements</li>
                        <li>Available tax credits and benefits</li>
                        <li>Cost of living considerations</li>
                        <li>Business incorporation advantages</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};