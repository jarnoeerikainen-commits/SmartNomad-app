import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus, X, AlertTriangle, Info, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface USState {
  id: string;
  code: string;
  name: string;
  dayLimit: number;
  daysSpent: number;
  taxType: 'none' | 'domicile' | 'day_count' | 'hybrid';
  rules: string[];
  safeHarborDays?: number;
  lastUpdate: string | null;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface StateRule {
  code: string;
  name: string;
  dayLimit: number;
  taxType: 'none' | 'domicile' | 'day_count' | 'hybrid';
  rules: string[];
  safeHarborDays?: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

const US_STATE_TAX_RULES: StateRule[] = [
  {
    code: 'AL',
    name: 'Alabama',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled in Alabama',
      'Domicile-based taxation on worldwide income',
      'No specific day count rule for residency'
    ],
    riskLevel: 'low',
    description: 'Alabama taxes residents based on domicile only. Moving abroad breaks tax residency if you establish domicile elsewhere.'
  },
  {
    code: 'AK',
    name: 'Alaska',
    dayLimit: 0,
    taxType: 'none',
    rules: [
      'No state income tax',
      'No residency requirements for taxation',
      'Safe harbor for all US expatriates'
    ],
    riskLevel: 'low',
    description: 'Alaska has no state income tax, making it an ideal state of last residence before moving abroad.'
  },
  {
    code: 'AZ',
    name: 'Arizona',
    dayLimit: 270,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Arizona OR',
      'Present in Arizona for more than 9 months (270 days)',
      'Safe harbor: Under 270 days with foreign domicile'
    ],
    safeHarborDays: 269,
    riskLevel: 'medium',
    description: 'Arizona uses both domicile and 9-month rule. Expatriates should limit stays to under 270 days annually.'
  },
  {
    code: 'AR',
    name: 'Arkansas',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Arkansas OR',
      'Present for more than 6 months (183 days)',
      'Safe harbor: Under 183 days with foreign domicile'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Arkansas applies 6-month rule. Expatriates should limit stays to under 183 days annually.'
  },
  {
    code: 'CA',
    name: 'California',
    dayLimit: 270,
    taxType: 'hybrid',
    rules: [
      'Resident if present for other than temporary/transitory purpose',
      'Presumption of residency after 9 months (270 days)',
      'Closest connection test applies',
      'Very aggressive tax enforcement',
      'No safe harbor - facts and circumstances test'
    ],
    safeHarborDays: 269,
    riskLevel: 'critical',
    description: 'California is extremely aggressive in asserting tax residency. Uses totality of circumstances test with 9-month presumption.'
  },
  {
    code: 'CO',
    name: 'Colorado',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Colorado OR',
      'Maintains permanent abode + present over 6 months (183 days)',
      'Safe harbor: Under 183 days without permanent abode'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Colorado requires both permanent abode AND 183+ days for statutory residency.'
  },
  {
    code: 'CT',
    name: 'Connecticut',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Connecticut OR',
      'Maintains permanent place of abode + present 183+ days',
      'Safe harbor: Under 183 days without permanent abode'
    ],
    safeHarborDays: 182,
    riskLevel: 'high',
    description: 'Connecticut aggressively pursues high earners. Requires both permanent abode AND 183+ days.'
  },
  {
    code: 'DE',
    name: 'Delaware',
    dayLimit: 183,
    taxType: 'day_count',
    rules: [
      'Resident if domiciled in Delaware OR',
      'Present in Delaware for 183+ days',
      'Safe harbor: Under 183 days'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Delaware uses standard 183-day rule for non-domiciliaries.'
  },
  {
    code: 'FL',
    name: 'Florida',
    dayLimit: 0,
    taxType: 'none',
    rules: [
      'No state income tax',
      'No residency requirements for taxation',
      'Safe harbor for all US expatriates',
      'Popular state for expatriate domicile'
    ],
    riskLevel: 'low',
    description: 'Florida has no state income tax, making it the most popular state of last residence before moving abroad.'
  },
  {
    code: 'GA',
    name: 'Georgia',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled in Georgia',
      'Domicile-based taxation',
      'No specific day count rule'
    ],
    riskLevel: 'low',
    description: 'Georgia taxes residents based on domicile. Clean break possible by establishing foreign domicile.'
  },
  {
    code: 'HI',
    name: 'Hawaii',
    dayLimit: 200,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Hawaii OR',
      'Present for more than 200 days',
      'Safe harbor: Under 200 days with foreign domicile'
    ],
    safeHarborDays: 199,
    riskLevel: 'medium',
    description: 'Hawaii uses 200-day rule instead of standard 183 days.'
  },
  {
    code: 'ID',
    name: 'Idaho',
    dayLimit: 270,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Idaho OR',
      'Present for more than 270 days',
      'Safe harbor: Under 270 days'
    ],
    safeHarborDays: 269,
    riskLevel: 'medium',
    description: 'Idaho uses 270-day rule (9 months) for statutory residency.'
  },
  {
    code: 'IL',
    name: 'Illinois',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled in Illinois',
      'Domicile-based taxation',
      'No day count rule for residency'
    ],
    riskLevel: 'low',
    description: 'Illinois bases residency solely on domicile.'
  },
  {
    code: 'IN',
    name: 'Indiana',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if maintains legal residence in Indiana',
      'Domicile-based taxation',
      'No day count rule'
    ],
    riskLevel: 'low',
    description: 'Indiana taxes based on legal residence/domicile.'
  },
  {
    code: 'IA',
    name: 'Iowa',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled in Iowa OR maintains permanent abode',
      'Domicile-focused approach',
      'No specific day count threshold'
    ],
    riskLevel: 'low',
    description: 'Iowa focuses on domicile and permanent abode rather than day counting.'
  },
  {
    code: 'KS',
    name: 'Kansas',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled in Kansas',
      'Domicile-based taxation',
      'No day count rule'
    ],
    riskLevel: 'low',
    description: 'Kansas uses domicile-based residency determination.'
  },
  {
    code: 'KY',
    name: 'Kentucky',
    dayLimit: 183,
    taxType: 'day_count',
    rules: [
      'Resident if domiciled in Kentucky OR',
      'Lives in Kentucky for more than 183 days',
      'Safe harbor: Under 183 days'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Kentucky applies standard 183-day rule.'
  },
  {
    code: 'LA',
    name: 'Louisiana',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled or has permanent residence in Louisiana',
      'Domicile-based approach',
      'No day count rule'
    ],
    riskLevel: 'low',
    description: 'Louisiana focuses on domicile and permanent residence.'
  },
  {
    code: 'ME',
    name: 'Maine',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Maine OR',
      'Has permanent residence + present 183+ days',
      'Safe harbor: Under 183 days without permanent residence'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Maine requires both permanent residence AND 183+ days for statutory residency.'
  },
  {
    code: 'MD',
    name: 'Maryland',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Maryland OR',
      'Maintains place of abode 6+ months + present 183+ days',
      'Aggressive enforcement',
      'Safe harbor: Under 183 days'
    ],
    safeHarborDays: 182,
    riskLevel: 'high',
    description: 'Maryland aggressively enforces residency rules, especially for high earners.'
  },
  {
    code: 'MA',
    name: 'Massachusetts',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Massachusetts OR',
      'Maintains permanent abode + present 183+ days',
      'Safe harbor: Under 183 days without permanent abode'
    ],
    safeHarborDays: 182,
    riskLevel: 'high',
    description: 'Massachusetts has aggressive residency enforcement with both tests.'
  },
  {
    code: 'MI',
    name: 'Michigan',
    dayLimit: 183,
    taxType: 'day_count',
    rules: [
      'Resident if domiciled in Michigan OR',
      'Lives in Michigan 183+ days',
      'Safe harbor: Under 183 days'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Michigan applies standard 183-day rule.'
  },
  {
    code: 'MN',
    name: 'Minnesota',
    dayLimit: 183,
    taxType: 'day_count',
    rules: [
      'Resident if domiciled in Minnesota OR',
      'Spends 183+ days in Minnesota',
      'Safe harbor: Under 183 days'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Minnesota uses standard 183-day test.'
  },
  {
    code: 'MS',
    name: 'Mississippi',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if maintains home in Mississippi',
      'Exercise rights of citizenship in Mississippi',
      'Domicile-based approach'
    ],
    riskLevel: 'low',
    description: 'Mississippi focuses on maintaining a home and exercising citizenship rights.'
  },
  {
    code: 'MO',
    name: 'Missouri',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Missouri OR',
      'Maintains permanent residence + present 183+ days',
      'Safe harbor: Under 183 days'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Missouri requires both permanent residence AND 183+ days.'
  },
  {
    code: 'MT',
    name: 'Montana',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled or maintains permanent abode in Montana',
      'Domicile-based approach',
      'No specific day count rule'
    ],
    riskLevel: 'low',
    description: 'Montana focuses on domicile and permanent abode.'
  },
  {
    code: 'NE',
    name: 'Nebraska',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Nebraska OR',
      'Maintains permanent abode + present 183+ days',
      'Safe harbor: Under 183 days'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Nebraska requires both permanent abode AND 183+ days.'
  },
  {
    code: 'NV',
    name: 'Nevada',
    dayLimit: 0,
    taxType: 'none',
    rules: [
      'No state income tax',
      'No residency requirements for taxation',
      'Safe harbor for all US expatriates'
    ],
    riskLevel: 'low',
    description: 'Nevada has no state income tax, popular among high earners.'
  },
  {
    code: 'NH',
    name: 'New Hampshire',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Limited income tax (interest/dividends only)',
      'Resident if maintains home + spends more time in NH',
      'Safe for most expatriates'
    ],
    riskLevel: 'low',
    description: 'New Hampshire only taxes interest and dividend income.'
  },
  {
    code: 'NJ',
    name: 'New Jersey',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if establishes domicile in New Jersey',
      'Aggressive audit state',
      'Complex residency determination',
      'High enforcement risk'
    ],
    safeHarborDays: 182,
    riskLevel: 'critical',
    description: 'New Jersey is extremely aggressive in auditing former residents who moved to low-tax states.'
  },
  {
    code: 'NM',
    name: 'New Mexico',
    dayLimit: 185,
    taxType: 'day_count',
    rules: [
      'Resident if domiciled in New Mexico OR',
      'Physically present 185+ days',
      'Safe harbor: Under 185 days'
    ],
    safeHarborDays: 184,
    riskLevel: 'medium',
    description: 'New Mexico uses 185-day rule instead of standard 183.'
  },
  {
    code: 'NY',
    name: 'New York',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in New York OR',
      'Maintains permanent abode + present 184+ days',
      'Extremely aggressive enforcement',
      'Detailed day counting required',
      'Mobile phone records scrutinized'
    ],
    safeHarborDays: 182,
    riskLevel: 'critical',
    description: 'New York is the most aggressive state for expatriate audits. Requires meticulous day tracking and documentation.'
  },
  {
    code: 'NC',
    name: 'North Carolina',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled in North Carolina',
      'Domicile-based taxation',
      'No day count rule'
    ],
    riskLevel: 'low',
    description: 'North Carolina uses domicile-based residency.'
  },
  {
    code: 'ND',
    name: 'North Dakota',
    dayLimit: 210,
    taxType: 'hybrid',
    rules: [
      'Resident if lives in North Dakota full time OR',
      'Maintains home + present 7+ months (210 days)',
      'Safe harbor: Under 210 days'
    ],
    safeHarborDays: 209,
    riskLevel: 'medium',
    description: 'North Dakota uses 7-month (210-day) rule.'
  },
  {
    code: 'OH',
    name: 'Ohio',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled in Ohio',
      'Domicile-based taxation',
      'No day count rule'
    ],
    riskLevel: 'low',
    description: 'Ohio bases residency on domicile only.'
  },
  {
    code: 'OK',
    name: 'Oklahoma',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled in Oklahoma',
      'Domicile-based taxation',
      'No day count rule'
    ],
    riskLevel: 'low',
    description: 'Oklahoma uses domicile-based residency.'
  },
  {
    code: 'OR',
    name: 'Oregon',
    dayLimit: 200,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Oregon OR',
      'Maintains permanent abode + present 200+ days',
      'Safe harbor: Under 200 days'
    ],
    safeHarborDays: 199,
    riskLevel: 'medium',
    description: 'Oregon uses 200-day rule like Hawaii.'
  },
  {
    code: 'PA',
    name: 'Pennsylvania',
    dayLimit: 180,
    taxType: 'day_count',
    rules: [
      'Resident if domiciled in Pennsylvania OR',
      'Spends 181+ days in Pennsylvania',
      'Safe harbor: Under 181 days'
    ],
    safeHarborDays: 180,
    riskLevel: 'medium',
    description: 'Pennsylvania uses 181-day rule (slightly under 183).'
  },
  {
    code: 'RI',
    name: 'Rhode Island',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Rhode Island OR',
      'Maintains permanent abode + present 183+ days',
      'Safe harbor: Under 183 days'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Rhode Island uses standard 183-day rule with permanent abode requirement.'
  },
  {
    code: 'SC',
    name: 'South Carolina',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled in South Carolina',
      'Intention to maintain SC as permanent home',
      'Domicile-based approach'
    ],
    riskLevel: 'low',
    description: 'South Carolina focuses on domicile and intention.'
  },
  {
    code: 'SD',
    name: 'South Dakota',
    dayLimit: 0,
    taxType: 'none',
    rules: [
      'No state income tax',
      'No residency requirements for taxation',
      'Safe harbor for all US expatriates'
    ],
    riskLevel: 'low',
    description: 'South Dakota has no state income tax and is popular for establishing residency.'
  },
  {
    code: 'TN',
    name: 'Tennessee',
    dayLimit: 0,
    taxType: 'none',
    rules: [
      'No state income tax',
      'No residency requirements for taxation',
      'Safe harbor for all US expatriates'
    ],
    riskLevel: 'low',
    description: 'Tennessee has no state income tax.'
  },
  {
    code: 'TX',
    name: 'Texas',
    dayLimit: 0,
    taxType: 'none',
    rules: [
      'No state income tax',
      'No residency requirements for taxation',
      'Safe harbor for all US expatriates',
      'Popular expatriate domicile'
    ],
    riskLevel: 'low',
    description: 'Texas has no state income tax and is very popular among expatriates.'
  },
  {
    code: 'UT',
    name: 'Utah',
    dayLimit: 183,
    taxType: 'day_count',
    rules: [
      'Resident if maintains place of abode + present 183+ days',
      'Safe harbor: Under 183 days'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Utah uses standard 183-day rule.'
  },
  {
    code: 'VT',
    name: 'Vermont',
    dayLimit: 183,
    taxType: 'hybrid',
    rules: [
      'Resident if domiciled in Vermont OR',
      'Maintains permanent home + present 183+ days',
      'Safe harbor: Under 183 days'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Vermont requires both permanent home AND 183+ days.'
  },
  {
    code: 'VA',
    name: 'Virginia',
    dayLimit: 183,
    taxType: 'day_count',
    rules: [
      'Resident if lives in Virginia OR',
      'Maintains place of abode + present 183+ days',
      'Safe harbor: Under 183 days'
    ],
    safeHarborDays: 182,
    riskLevel: 'medium',
    description: 'Virginia applies standard 183-day rule.'
  },
  {
    code: 'WA',
    name: 'Washington',
    dayLimit: 0,
    taxType: 'none',
    rules: [
      'No state income tax',
      'No residency requirements for taxation',
      'Safe harbor for all US expatriates'
    ],
    riskLevel: 'low',
    description: 'Washington has no state income tax.'
  },
  {
    code: 'WV',
    name: 'West Virginia',
    dayLimit: 30,
    taxType: 'hybrid',
    rules: [
      'Resident if spends 30+ days with intent for permanent residence OR',
      'PA/VA domiciliary present 183+ days',
      'Unique 30-day rule with intent test'
    ],
    safeHarborDays: 29,
    riskLevel: 'high',
    description: 'West Virginia has unique 30-day rule if you intend to make it permanent residence.'
  },
  {
    code: 'WI',
    name: 'Wisconsin',
    dayLimit: 365,
    taxType: 'domicile',
    rules: [
      'Resident if domiciled in Wisconsin',
      'Domicile-based taxation',
      'No day count rule'
    ],
    riskLevel: 'low',
    description: 'Wisconsin uses domicile-based residency determination.'
  },
  {
    code: 'WY',
    name: 'Wyoming',
    dayLimit: 0,
    taxType: 'none',
    rules: [
      'No state income tax',
      'No residency requirements for taxation',
      'Safe harbor for all US expatriates'
    ],
    riskLevel: 'low',
    description: 'Wyoming has no state income tax and is popular for establishing residency.'
  }
];

const USTaxStateTracker: React.FC = () => {
  const [trackedStates, setTrackedStates] = useState<USState[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [showAddState, setShowAddState] = useState(false);
  const { toast } = useToast();

  // Load saved states from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('trackedUSStates');
    if (saved) {
      setTrackedStates(JSON.parse(saved));
    }
  }, []);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('trackedUSStates', JSON.stringify(trackedStates));
  }, [trackedStates]);

  const addState = () => {
    if (!selectedState) return;
    
    const stateRule = US_STATE_TAX_RULES.find(s => s.code === selectedState);
    if (!stateRule) return;

    const newState: USState = {
      id: `state-${stateRule.code}-${Date.now()}`,
      code: stateRule.code,
      name: stateRule.name,
      dayLimit: stateRule.safeHarborDays || stateRule.dayLimit,
      daysSpent: 0,
      taxType: stateRule.taxType,
      rules: stateRule.rules,
      safeHarborDays: stateRule.safeHarborDays,
      lastUpdate: null,
      riskLevel: stateRule.riskLevel
    };

    setTrackedStates(prev => [...prev, newState]);
    setSelectedState('');
    setShowAddState(false);
    
    toast({
      title: "State Added",
      description: `Now tracking ${stateRule.name} tax compliance`,
    });
  };

  const removeState = (stateCode: string) => {
    setTrackedStates(prev => prev.filter(s => s.code !== stateCode));
    toast({
      title: "State Removed",
      description: "State removed from tracking",
    });
  };

  const updateDaysSpent = (stateCode: string, days: number) => {
    setTrackedStates(prev => 
      prev.map(state => 
        state.code === stateCode 
          ? { ...state, daysSpent: days, lastUpdate: new Date().toISOString() }
          : state
      )
    );
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (percentage: number, riskLevel: string) => {
    if (riskLevel === 'critical' && percentage > 50) return 'bg-red-500';
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const availableStates = US_STATE_TAX_RULES.filter(
    rule => !trackedStates.find(state => state.code === rule.code)
  );

  const noTaxStates = US_STATE_TAX_RULES.filter(rule => rule.taxType === 'none');
  const highRiskStates = US_STATE_TAX_RULES.filter(rule => rule.riskLevel === 'critical' || rule.riskLevel === 'high');

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <DollarSign className="w-5 h-5" />
          US State Tax Compliance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="tracker" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tracker">Your States</TabsTrigger>
            <TabsTrigger value="safe">No Tax States</TabsTrigger>
            <TabsTrigger value="risky">High Risk</TabsTrigger>
            <TabsTrigger value="all">All States</TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-4">
            {/* Tracked States */}
            <div className="space-y-4">
              {trackedStates.length === 0 ? (
                <div className="text-center py-8 text-blue-600">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <p className="text-sm">No states tracked yet</p>
                  <p className="text-xs text-blue-500">Add states to monitor tax compliance</p>
                </div>
              ) : (
                trackedStates.map((state) => {
                  const percentage = state.dayLimit > 0 ? (state.daysSpent / state.dayLimit) * 100 : 0;
                  const daysLeft = Math.max(0, state.dayLimit - state.daysSpent);
                  
                  return (
                    <Card key={state.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">🏛️</div>
                          <div>
                            <div className="font-semibold">{state.name}</div>
                            <div className="flex items-center gap-2">
                              <Badge className={getRiskColor(state.riskLevel)}>
                                {state.riskLevel.toUpperCase()} RISK
                              </Badge>
                              <Badge variant="outline">{state.taxType.replace('_', ' ')}</Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeState(state.code)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {state.taxType !== 'none' && (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Days Spent</span>
                              <Input
                                type="number"
                                value={state.daysSpent}
                                onChange={(e) => updateDaysSpent(state.code, parseInt(e.target.value) || 0)}
                                className="w-20 h-6 text-xs"
                                min="0"
                                max={state.dayLimit}
                              />
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span>Safe Harbor Limit</span>
                              <span className="font-medium">{state.dayLimit} days</span>
                            </div>
                            
                            <Progress 
                              value={percentage} 
                              className="h-3"
                            />
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(percentage, state.riskLevel)}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                            
                            <div className="flex justify-between text-sm">
                              <span className={`font-medium ${
                                daysLeft <= 10 ? 'text-red-600' :
                                daysLeft <= 30 ? 'text-orange-600' :
                                'text-green-600'
                              }`}>
                                {daysLeft} days left
                              </span>
                              <span className="text-muted-foreground">
                                {percentage.toFixed(1)}% used
                              </span>
                            </div>
                          </div>
                          
                          {percentage > 80 && (
                            <Alert className="border-red-200 bg-red-50">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-red-700">
                                Warning: Approaching tax residency threshold! Consider reducing time in {state.name}.
                              </AlertDescription>
                            </Alert>
                          )}
                        </>
                      )}
                      
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Tax Rules:</p>
                        {state.rules.map((rule, idx) => (
                          <p key={idx} className="text-xs text-gray-600">• {rule}</p>
                        ))}
                      </div>
                    </Card>
                  );
                })
              )}
              
              {/* Add State Button */}
              {!showAddState ? (
                <Button
                  onClick={() => setShowAddState(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add State
                </Button>
              ) : (
                <div className="space-y-3">
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state to track..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStates.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          <div className="flex items-center justify-between w-full">
                            <span>{state.name}</span>
                            <Badge className={`ml-2 ${getRiskColor(state.riskLevel)}`}>
                              {state.riskLevel}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2">
                    <Button onClick={addState} disabled={!selectedState} className="flex-1">
                      Add State
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddState(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="safe" className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-green-700">
                These states have no income tax, making them safe for US expatriates to maintain as domicile.
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-3">
              {noTaxStates.map((state) => (
                <Card key={state.code} className="p-3 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏛️</div>
                    <div>
                      <div className="font-semibold">{state.name}</div>
                      <p className="text-sm text-gray-600">{state.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="risky" className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-700">
                These states are known for aggressive tax enforcement and should be avoided or carefully managed by expatriates.
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-3">
              {highRiskStates.map((state) => (
                <Card key={state.code} className="p-3 border-red-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🏛️</div>
                      <div>
                        <div className="font-semibold">{state.name}</div>
                        <Badge className={getRiskColor(state.riskLevel)}>
                          {state.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{state.description}</p>
                    <div className="space-y-1">
                      {state.rules.map((rule, idx) => (
                        <p key={idx} className="text-xs text-gray-600">• {rule}</p>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-2 max-h-96 overflow-y-auto">
              {US_STATE_TAX_RULES.map((state) => (
                <Card key={state.code} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">🏛️</div>
                      <div>
                        <div className="font-medium">{state.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(state.riskLevel)}>
                            {state.riskLevel}
                          </Badge>
                          {state.safeHarborDays && (
                            <Badge variant="outline">
                              {state.safeHarborDays} day limit
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default USTaxStateTracker;