
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, DollarSign, FileText, Calendar, Info } from 'lucide-react';
import { Country } from '@/types/country';
import { useToast } from '@/hooks/use-toast';

interface USTaxTrackerProps {
  countries: Country[];
}

interface TaxRule {
  name: string;
  description: string;
  dayLimit: number;
  period: string;
  penalty: string;
}

const USTaxTracker: React.FC<USTaxTrackerProps> = ({ countries }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [totalForeignDays, setTotalForeignDays] = useState(0);
  const [substantialPresenceTest, setSubstantialPresenceTest] = useState(0);
  const { toast } = useToast();

  const US_TAX_RULES: TaxRule[] = [
    {
      name: "Physical Presence Test (330 Days)",
      description: "Must be present in foreign countries for at least 330 full days during any 12-month period",
      dayLimit: 330,
      period: "12 months",
      penalty: "Lose Foreign Earned Income Exclusion ($120,000+ for 2024)"
    },
    {
      name: "Bona Fide Residence Test",
      description: "Must be a bona fide resident of a foreign country for an uninterrupted period that includes an entire tax year",
      dayLimit: 365,
      period: "Full tax year",
      penalty: "Lose Foreign Earned Income Exclusion"
    },
    {
      name: "Substantial Presence Test",
      description: "Present in US for 183+ days using 3-year weighted formula: Current year (100%) + Prior year (33%) + Year before (17%)",
      dayLimit: 183,
      period: "3-year weighted",
      penalty: "Considered US tax resident"
    },
    {
      name: "FBAR Filing Requirement",
      description: "Must file FBAR if foreign financial accounts exceed $10,000 at any time during the year",
      dayLimit: 1,
      period: "Any time",
      penalty: "Up to $12,921 per account"
    },
    {
      name: "FATCA Form 8938",
      description: "Must file if foreign financial assets exceed threshold ($50,000-$600,000 depending on filing status)",
      dayLimit: 1,
      period: "Year-end",
      penalty: "Up to $60,000 plus 40% of understatement"
    }
  ];

  useEffect(() => {
    calculateTaxMetrics();
  }, [countries, currentYear]);

  const calculateTaxMetrics = () => {
    const currentYearStart = new Date(currentYear, 0, 1);
    const currentYearEnd = new Date(currentYear, 11, 31);
    
    // Calculate total foreign days (excluding US)
    const foreignDays = countries
      .filter(country => country.code !== 'US')
      .reduce((total, country) => total + country.yearlyDaysSpent, 0);
    
    setTotalForeignDays(foreignDays);

    // Calculate substantial presence test for US residents
    const usCountry = countries.find(c => c.code === 'US');
    if (usCountry) {
      const currentYearDays = usCountry.yearlyDaysSpent;
      // For demo purposes, we'll use current year only
      // In a real app, you'd need historical data for accurate 3-year calculation
      const substantialPresence = currentYearDays * 1.0; // Simplified calculation
      setSubstantialPresenceTest(substantialPresence);
      
      if (substantialPresence >= 183) {
        toast({
          title: "🏛️ US Tax Resident Status",
          description: "You may be considered a US tax resident. Consult a tax professional.",
          variant: "destructive"
        });
      }
    }
  };

  const getPhysicalPresenceStatus = () => {
    const progress = (totalForeignDays / 330) * 100;
    const remaining = Math.max(0, 330 - totalForeignDays);
    
    return {
      progress: Math.min(progress, 100),
      remaining,
      status: totalForeignDays >= 330 ? 'qualified' : 'not_qualified'
    };
  };

  const getSubstantialPresenceStatus = () => {
    const progress = (substantialPresenceTest / 183) * 100;
    const remaining = Math.max(0, 183 - substantialPresenceTest);
    
    return {
      progress: Math.min(progress, 100),
      remaining,
      status: substantialPresenceTest >= 183 ? 'us_resident' : 'non_resident'
    };
  };

  const physicalPresence = getPhysicalPresenceStatus();
  const substantialPresence = getSubstantialPresenceStatus();

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <DollarSign className="w-5 h-5" />
          US Tax Compliance Tracker
        </CardTitle>
        <p className="text-sm text-blue-600">
          Monitor US tax requirements and compliance status for {currentYear}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">Tax Year:</span>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="px-2 py-1 border rounded text-sm"
          >
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Physical Presence Test */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-blue-800">Physical Presence Test (FEIE)</h4>
            <Badge variant={physicalPresence.status === 'qualified' ? 'default' : 'secondary'}>
              {physicalPresence.status === 'qualified' ? 'Qualified' : 'Not Qualified'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Progress value={physicalPresence.progress} className="h-3" />
            <div className="flex justify-between text-sm text-blue-700">
              <span>{totalForeignDays} days abroad</span>
              <span>{physicalPresence.remaining} days needed</span>
            </div>
          </div>
          
          <div className="p-3 bg-blue-100 rounded-lg text-sm">
            <p className="text-blue-800">
              {physicalPresence.status === 'qualified' 
                ? '✅ You qualify for Foreign Earned Income Exclusion ($120,000 for 2024)'
                : `⚠️ Need ${physicalPresence.remaining} more days abroad in any 12-month period`
              }
            </p>
          </div>
        </div>

        {/* Substantial Presence Test */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-blue-800">Substantial Presence Test</h4>
            <Badge variant={substantialPresence.status === 'us_resident' ? 'destructive' : 'default'}>
              {substantialPresence.status === 'us_resident' ? 'US Tax Resident' : 'Non-Resident'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Progress value={substantialPresence.progress} className="h-3" />
            <div className="flex justify-between text-sm text-blue-700">
              <span>{Math.round(substantialPresenceTest)} weighted days in US</span>
              <span>{substantialPresence.remaining} days buffer</span>
            </div>
          </div>
          
          <div className="p-3 bg-blue-100 rounded-lg text-sm">
            <p className="text-blue-800">
              {substantialPresence.status === 'us_resident'
                ? '⚠️ You may be considered a US tax resident - consult a tax professional'
                : '✅ You maintain non-resident status for tax purposes'
              }
            </p>
          </div>
        </div>

        {/* Tax Rules Summary */}
        <div className="space-y-3">
          <h4 className="font-medium text-blue-800 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Key US Tax Rules
          </h4>
          
          <div className="space-y-2">
            {US_TAX_RULES.map((rule, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-sm text-blue-800">{rule.name}</h5>
                  <Badge variant="outline" className="text-xs">{rule.period}</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{rule.description}</p>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-orange-700">{rule.penalty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-yellow-600" />
            <h4 className="font-medium text-yellow-800">Important Reminders</h4>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• File Form 1040 by April 15th (or June 15th if abroad)</li>
            <li>• File FBAR (FinCEN 114) by April 15th if foreign accounts exceed $10,000</li>
            <li>• File Form 8938 if foreign assets exceed thresholds</li>
            <li>• Consider quarterly estimated taxes if earning foreign income</li>
            <li>• Consult a tax professional for complex situations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default USTaxTracker;
