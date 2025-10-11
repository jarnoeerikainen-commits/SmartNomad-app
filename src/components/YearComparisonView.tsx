import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Country } from '@/types/country';

interface YearData {
  year: number;
  countries: {
    code: string;
    name: string;
    flag: string;
    daysSpent: number;
    trips: number;
  }[];
  totalDays: number;
  totalTrips: number;
  totalCountries: number;
}

interface YearComparisonViewProps {
  countries: Country[];
  historicalData?: YearData[];
}

export const YearComparisonView: React.FC<YearComparisonViewProps> = ({ 
  countries,
  historicalData = []
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYears, setSelectedYears] = useState<[number, number]>([currentYear - 1, currentYear]);

  // Generate mock historical data if not provided
  const getYearData = (year: number): YearData => {
    const existingData = historicalData.find(d => d.year === year);
    if (existingData) return existingData;

    // Generate current year data from countries
    if (year === currentYear) {
      return {
        year,
        countries: countries.map(c => ({
          code: c.code,
          name: c.name,
          flag: c.flag,
          daysSpent: c.yearlyDaysSpent || c.daysSpent,
          trips: c.totalEntries || 0
        })),
        totalDays: countries.reduce((sum, c) => sum + (c.yearlyDaysSpent || c.daysSpent), 0),
        totalTrips: countries.reduce((sum, c) => sum + (c.totalEntries || 0), 0),
        totalCountries: countries.length
      };
    }

    // Mock data for previous years
    return {
      year,
      countries: countries.map(c => ({
        code: c.code,
        name: c.name,
        flag: c.flag,
        daysSpent: Math.floor(c.daysSpent * (0.7 + Math.random() * 0.6)),
        trips: Math.max(1, Math.floor((c.totalEntries || 1) * (0.5 + Math.random() * 1)))
      })),
      totalDays: 0,
      totalTrips: 0,
      totalCountries: countries.length
    };
  };

  const year1Data = getYearData(selectedYears[0]);
  const year2Data = getYearData(selectedYears[1]);

  year1Data.totalDays = year1Data.countries.reduce((sum, c) => sum + c.daysSpent, 0);
  year1Data.totalTrips = year1Data.countries.reduce((sum, c) => sum + c.trips, 0);
  year2Data.totalDays = year2Data.countries.reduce((sum, c) => sum + c.daysSpent, 0);
  year2Data.totalTrips = year2Data.countries.reduce((sum, c) => sum + c.trips, 0);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getTrendIcon = (change: number) => {
    if (change > 5) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < -5) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const availableYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year-over-Year Comparison</CardTitle>
        <CardDescription>
          Compare your travel patterns across different years
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Year Selector */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Compare Year</label>
            <select
              value={selectedYears[0]}
              onChange={(e) => setSelectedYears([parseInt(e.target.value), selectedYears[1]])}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">With Year</label>
            <select
              value={selectedYears[1]}
              onChange={(e) => setSelectedYears([selectedYears[0], parseInt(e.target.value)])}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="text-sm text-muted-foreground">Total Travel Days</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{year2Data.totalDays}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(calculateChange(year2Data.totalDays, year1Data.totalDays))}
                <span className="text-sm font-medium">
                  {Math.abs(calculateChange(year2Data.totalDays, year1Data.totalDays)).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {year1Data.year}: {year1Data.totalDays} days
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="text-sm text-muted-foreground">Total Trips</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{year2Data.totalTrips}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(calculateChange(year2Data.totalTrips, year1Data.totalTrips))}
                <span className="text-sm font-medium">
                  {Math.abs(calculateChange(year2Data.totalTrips, year1Data.totalTrips)).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {year1Data.year}: {year1Data.totalTrips} trips
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="text-sm text-muted-foreground">Countries Visited</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{year2Data.totalCountries}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(calculateChange(year2Data.totalCountries, year1Data.totalCountries))}
                <span className="text-sm font-medium">
                  {Math.abs(calculateChange(year2Data.totalCountries, year1Data.totalCountries)).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {year1Data.year}: {year1Data.totalCountries} countries
            </div>
          </div>
        </div>

        {/* Country-by-Country Comparison */}
        <div className="space-y-2 border-t pt-4">
          <h3 className="font-semibold mb-3">Country Breakdown</h3>
          <div className="space-y-2">
            {year2Data.countries.map(country2 => {
              const country1 = year1Data.countries.find(c => c.code === country2.code);
              const daysChange = country1 ? calculateChange(country2.daysSpent, country1.daysSpent) : 0;

              return (
                <div key={country2.code} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country2.flag}</span>
                    <div>
                      <div className="font-medium">{country2.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {country2.trips} trips
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{country2.daysSpent} days</span>
                      {country1 && (
                        <Badge variant={daysChange > 0 ? 'default' : daysChange < 0 ? 'secondary' : 'outline'}>
                          {daysChange > 0 ? '+' : ''}{daysChange.toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                    {country1 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {year1Data.year}: {country1.daysSpent} days
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
