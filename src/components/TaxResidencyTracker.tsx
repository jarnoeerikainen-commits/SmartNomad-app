import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, MapPin, Flag } from 'lucide-react';
import USTaxStateTracker from './USTaxStateTracker';
import { CanadaTaxProvinceTracker } from './CanadaTaxProvinceTracker';
import { Country } from '@/types/country';

interface TaxResidencyTrackerProps {
  countries: Country[];
}

const TaxResidencyTracker: React.FC<TaxResidencyTrackerProps> = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('us');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calculator className="w-6 h-6" />
          Tax Residency Tracker
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Select your tax jurisdiction:</span>
          </div>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">
                <div className="flex items-center gap-2">
                  <span>🇺🇸</span>
                  <span>United States</span>
                </div>
              </SelectItem>
              <SelectItem value="ca">
                <div className="flex items-center gap-2">
                  <span>🇨🇦</span>
                  <span>Canada</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCountry} onValueChange={setSelectedCountry}>
          <TabsContent value="us" className="mt-0">
            <USTaxStateTracker />
          </TabsContent>
          <TabsContent value="ca" className="mt-0">
            <CanadaTaxProvinceTracker countries={countries} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxResidencyTracker;