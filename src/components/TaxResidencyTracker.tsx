import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, MapPin, Flag, Globe } from 'lucide-react';
import USTaxStateTracker from './USTaxStateTracker';
import USTaxTracker from './USTaxTracker';
import { CanadaTaxProvinceTracker } from './CanadaTaxProvinceTracker';
import CountryTracker from './CountryTracker';
import { Country } from '@/types/country';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaxResidencyTrackerProps {
  countries: Country[];
  onAddCountry: (country: Country) => void;
  onRemoveCountry: (countryCode: string) => void;
}

const TaxResidencyTracker: React.FC<TaxResidencyTrackerProps> = ({ countries, onAddCountry, onRemoveCountry }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('global');
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Main Tax Residency Overview Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="w-6 h-6" />
            Tax Residency & Compliance Center
          </CardTitle>
          <p className="text-muted-foreground">
            Manage your countries, track tax residency days, and stay compliant with international tax regulations
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t('tax.select_jurisdiction')}</span>
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder={t('tax.select_jurisdiction')} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-background border shadow-lg z-50">
                <SelectItem value="global">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{t('tax.global_overview')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="us">
                  <div className="flex items-center gap-2">
                    <span>🇺🇸</span>
                    <span>{t('tax.united_states')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="ca">
                  <div className="flex items-center gap-2">
                    <span>🇨🇦</span>
                    <span>{t('tax.canada')}</span>
                  </div>
                </SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code.toLowerCase()}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{t(`countries.${country.name.toLowerCase().replace(/\s+/g, '_')}`) || country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={selectedCountry} onValueChange={setSelectedCountry}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="global" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Country Manager
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Tax Overview
              </TabsTrigger>
              <TabsTrigger value="us" className="flex items-center gap-2">
                <span>🇺🇸</span>
                United States
              </TabsTrigger>
              <TabsTrigger value="ca" className="flex items-center gap-2">
                <span>🇨🇦</span>
                Canada
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="mt-6">
              <CountryTracker
                countries={countries}
                onAddCountry={onAddCountry}
                onRemoveCountry={onRemoveCountry}
              />
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {countries.map((country) => {
                    const taxDays = country.yearlyDaysSpent || 0;
                    const isNearThreshold = taxDays >= 150; // 183 day threshold approaching
                    const isOverThreshold = taxDays >= 183;
                    
                    return (
                      <Card key={country.code} className={`p-4 ${isOverThreshold ? 'border-red-200 bg-red-50' : isNearThreshold ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <span className="font-medium">{country.name}</span>
                          </div>
                          {isOverThreshold && <Flag className="w-4 h-4 text-red-500" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Days Spent</span>
                            <span className={isOverThreshold ? 'text-red-600 font-medium' : ''}>{taxDays}/183</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${isOverThreshold ? 'bg-red-500' : isNearThreshold ? 'bg-green-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min((taxDays / 183) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {isOverThreshold ? 'Tax Resident' : `${Math.max(0, 183 - taxDays)} days remaining`}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                
                {countries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No countries tracked yet. Add countries in the Country Manager tab.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="us" className="mt-6 space-y-6">
              <USTaxTracker countries={countries} />
              <USTaxStateTracker />
            </TabsContent>

            <TabsContent value="ca" className="mt-6">
              <CanadaTaxProvinceTracker countries={countries} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxResidencyTracker;