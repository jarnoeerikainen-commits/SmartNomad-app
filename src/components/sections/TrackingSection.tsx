import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calculator, Plane, FileText } from 'lucide-react';
import CountryTracker from '../CountryTracker';
import TaxResidencyHub from '../TaxResidencyHub';
import VisaTrackingManager from '../VisaTrackingManager';
import { DocumentTracker } from '../DocumentTracker';
import { Country } from '@/types/country';
import { Subscription } from '@/types/subscription';

interface TrackingSectionProps {
  countries: Country[];
  onAddCountry: (country: Country) => void;
  onRemoveCountry: (countryCode: string) => void;
  onUpdateCountrySettings: any;
  onUpdateCountryLimit: any;
  onResetCountry: any;
  onToggleCountDays: any;
  subscription: Subscription;
  onUpgradeClick: () => void;
}

const TrackingSection: React.FC<TrackingSectionProps> = ({
  countries,
  onAddCountry,
  onRemoveCountry,
  onUpdateCountrySettings,
  onUpdateCountryLimit,
  onResetCountry,
  onToggleCountDays,
  subscription,
  onUpgradeClick
}) => {
  const [activeTab, setActiveTab] = useState('countries');

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Tracking Dashboard</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="countries" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Countries</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Tax</span>
          </TabsTrigger>
          <TabsTrigger value="visas" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            <span className="hidden sm:inline">Visas</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Docs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="countries" className="mt-6 animate-fade-in">
          <CountryTracker
            countries={countries}
            onAddCountry={onAddCountry}
            onRemoveCountry={onRemoveCountry}
          />
        </TabsContent>

        <TabsContent value="tax" className="mt-6 animate-fade-in">
          <TaxResidencyHub 
            countries={countries}
            onAddCountry={onAddCountry}
            onRemoveCountry={onRemoveCountry}
            onUpdateCountrySettings={onUpdateCountrySettings}
            onUpdateCountryLimit={onUpdateCountryLimit}
            onResetCountry={onResetCountry}
            onToggleCountDays={onToggleCountDays}
            currentLocation={null}
          />
        </TabsContent>

        <TabsContent value="visas" className="mt-6 animate-fade-in">
          <VisaTrackingManager
            countries={countries}
            subscription={subscription}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-6 animate-fade-in">
          <DocumentTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrackingSection;
