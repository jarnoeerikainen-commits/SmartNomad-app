import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface YearData {
  year: number;
  days: number;
}

export const SubstantialPresenceTest: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const [yearData, setYearData] = useState<YearData[]>([
    { year: currentYear, days: 0 },
    { year: currentYear - 1, days: 0 },
    { year: currentYear - 2, days: 0 }
  ]);

  const updateDays = (yearIndex: number, days: number) => {
    const newData = [...yearData];
    newData[yearIndex].days = Math.max(0, Math.min(366, days));
    setYearData(newData);
  };

  // Calculate Substantial Presence Test
  // Formula: Current year + (1/3 × Year 1) + (1/6 × Year 2)
  const calculateSubstantialPresence = () => {
    const currentYearDays = yearData[0].days;
    const year1Days = yearData[1].days;
    const year2Days = yearData[2].days;

    const totalDays = currentYearDays + (year1Days / 3) + (year2Days / 6);
    
    return {
      totalDays: Math.round(totalDays),
      currentYearDays,
      year1Contribution: Math.round(year1Days / 3),
      year2Contribution: Math.round(year2Days / 6),
      passesTest: currentYearDays >= 31 && totalDays >= 183
    };
  };

  const result = calculateSubstantialPresence();

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          USA Substantial Presence Test
        </CardTitle>
        <CardDescription>
          Determine US tax residency status using the 3-year calculation formula
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Information Alert */}
        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm">
            <strong>How it works:</strong> You're a US tax resident if you spent at least 31 days in the current year 
            AND the 3-year total (using the formula below) equals 183 days or more.
          </AlertDescription>
        </Alert>

        {/* Year Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {yearData.map((data, index) => (
            <div key={data.year} className="space-y-2">
              <Label className="flex items-center gap-2">
                <span className="text-lg font-semibold">{data.year}</span>
                {index === 0 && <Badge>Current Year</Badge>}
              </Label>
              <Input
                type="number"
                min="0"
                max="366"
                value={data.days}
                onChange={(e) => updateDays(index, parseInt(e.target.value) || 0)}
                className="text-lg font-medium"
                placeholder="0"
              />
              <div className="text-xs text-muted-foreground">
                {index === 0 && 'Full weight (×1)'}
                {index === 1 && 'One-third weight (×1/3)'}
                {index === 2 && 'One-sixth weight (×1/6)'}
              </div>
            </div>
          ))}
        </div>

        {/* Calculation Breakdown */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Calculation Breakdown
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>{currentYear} days:</span>
              <span className="font-mono font-bold">{result.currentYearDays} × 1 = {result.currentYearDays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{currentYear - 1} days:</span>
              <span className="font-mono font-bold">{yearData[1].days} × 1/3 = {result.year1Contribution}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{currentYear - 2} days:</span>
              <span className="font-mono font-bold">{yearData[2].days} × 1/6 = {result.year2Contribution}</span>
            </div>
            <div className="border-t pt-2 flex justify-between items-center font-semibold text-base">
              <span>Total Weighted Days:</span>
              <span className="font-mono text-xl text-primary">{result.totalDays}</span>
            </div>
          </div>
        </div>

        {/* Result Display */}
        <div className={`rounded-lg p-6 border-2 ${
          result.passesTest 
            ? 'bg-red-50 dark:bg-red-950/20 border-red-300' 
            : 'bg-green-50 dark:bg-green-950/20 border-green-300'
        }`}>
          <div className="flex items-start gap-3">
            {result.passesTest ? (
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
            )}
            <div className="flex-1">
              <h3 className={`text-lg font-bold mb-2 ${
                result.passesTest ? 'text-red-900 dark:text-red-100' : 'text-green-900 dark:text-green-100'
              }`}>
                {result.passesTest ? 'US Tax Resident' : 'Not a US Tax Resident'}
              </h3>
              <div className="space-y-2 text-sm">
                {result.passesTest ? (
                  <>
                    <p className="text-red-800 dark:text-red-200">
                      ✓ Current year days ≥ 31: <strong>{result.currentYearDays >= 31 ? 'Yes' : 'No'}</strong>
                    </p>
                    <p className="text-red-800 dark:text-red-200">
                      ✓ 3-year total ≥ 183: <strong>{result.totalDays} days</strong>
                    </p>
                    <p className="mt-3 text-red-900 dark:text-red-100 font-medium">
                      You meet the Substantial Presence Test and may be required to file US taxes as a resident.
                    </p>
                  </>
                ) : (
                  <>
                    {result.currentYearDays < 31 && (
                      <p className="text-green-800 dark:text-green-200">
                        ✗ Current year days &lt; 31: <strong>{result.currentYearDays} days</strong>
                      </p>
                    )}
                    {result.totalDays < 183 && (
                      <p className="text-green-800 dark:text-green-200">
                        ✗ 3-year total &lt; 183: <strong>{result.totalDays} days</strong>
                      </p>
                    )}
                    <p className="mt-3 text-green-900 dark:text-green-100 font-medium">
                      You do not meet the Substantial Presence Test for this period.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs space-y-1">
            <p><strong>Important:</strong> This calculator is for general guidance only.</p>
            <p>• Days include both arrival and departure days</p>
            <p>• Certain exceptions may apply (students, teachers, medical conditions, etc.)</p>
            <p>• Consult with a qualified tax professional for your specific situation</p>
            <p>• Visit IRS.gov for official guidance on the Substantial Presence Test</p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};