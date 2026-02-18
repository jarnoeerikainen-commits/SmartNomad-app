import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calculator, Plane, FileText, AlertTriangle, Shield, Clock, TrendingUp } from 'lucide-react';
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

// Smart overview card component
const OverviewStat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  variant?: 'default' | 'warning' | 'danger' | 'success';
}> = ({ icon, label, value, sublabel, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-card border',
    warning: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
    danger: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
    success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
  };

  return (
    <div className={`rounded-xl p-4 ${variantClasses[variant]} transition-all hover:shadow-md`}>
      <div className="flex items-center gap-3">
        <div className="shrink-0 opacity-70">{icon}</div>
        <div className="min-w-0">
          <div className="text-2xl font-bold leading-none">{value}</div>
          <div className="text-xs text-muted-foreground mt-1 truncate">{label}</div>
          {sublabel && <div className="text-xs text-muted-foreground/70 mt-0.5">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
};

// Urgency alert component
const UrgencyAlert: React.FC<{ items: Array<{ text: string; type: 'warning' | 'danger' }> }> = ({ items }) => {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      {items.slice(0, 3).map((item, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
            item.type === 'danger'
              ? 'bg-destructive/10 text-destructive border border-destructive/20'
              : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
};

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

  // Compute smart overview stats
  const stats = useMemo(() => {
    const tracked = countries.filter(c => c.countTravelDays);
    const totalDays = countries.reduce((sum, c) => sum + c.daysSpent, 0);
    const atRisk = tracked.filter(c => c.daysSpent > c.dayLimit * 0.8);
    const overLimit = tracked.filter(c => c.daysSpent >= c.dayLimit);

    // Load document & visa data from localStorage
    let expiringDocs = 0;
    let activeVisas = 0;
    try {
      const docs = JSON.parse(localStorage.getItem('trackedDocuments') || '[]');
      const today = new Date();
      const sixMonths = new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000);
      expiringDocs = docs.filter((d: any) => {
        const exp = new Date(d.expiryDate);
        return exp <= sixMonths && exp > today;
      }).length;
    } catch {}
    try {
      const visas = JSON.parse(localStorage.getItem('visaTrackings') || '[]');
      activeVisas = visas.filter((v: any) => v.isActive).length;
    } catch {}

    return { tracked: tracked.length, totalDays, atRisk, overLimit, expiringDocs, activeVisas };
  }, [countries]);

  // Build urgency alerts
  const urgencyItems = useMemo(() => {
    const items: Array<{ text: string; type: 'warning' | 'danger' }> = [];

    stats.overLimit.forEach(c => {
      items.push({ text: `${c.flag} ${c.name}: Exceeded ${c.dayLimit}-day limit (${c.daysSpent} days)`, type: 'danger' });
    });
    stats.atRisk.filter(c => c.daysSpent < c.dayLimit).forEach(c => {
      const remaining = c.dayLimit - c.daysSpent;
      items.push({ text: `${c.flag} ${c.name}: Only ${remaining} days remaining of ${c.dayLimit}`, type: 'warning' });
    });
    if (stats.expiringDocs > 0) {
      items.push({ text: `${stats.expiringDocs} document(s) expiring within 6 months`, type: 'warning' });
    }
    return items;
  }, [stats]);

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tracking Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Tax residency, visas & documents — all in one place</p>
        </div>
        {stats.atRisk.length > 0 && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {stats.atRisk.length} Alert{stats.atRisk.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Smart Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <OverviewStat
          icon={<MapPin className="h-5 w-5" />}
          label="Countries Tracked"
          value={stats.tracked}
          sublabel={`${stats.totalDays} total days`}
          variant={stats.tracked > 0 ? 'success' : 'default'}
        />
        <OverviewStat
          icon={<Shield className="h-5 w-5" />}
          label="Tax Risk"
          value={stats.overLimit.length > 0 ? stats.overLimit.length : stats.atRisk.length > 0 ? stats.atRisk.length : '✓'}
          sublabel={stats.overLimit.length > 0 ? 'Over limit' : stats.atRisk.length > 0 ? 'Approaching' : 'All clear'}
          variant={stats.overLimit.length > 0 ? 'danger' : stats.atRisk.length > 0 ? 'warning' : 'success'}
        />
        <OverviewStat
          icon={<Plane className="h-5 w-5" />}
          label="Active Visas"
          value={stats.activeVisas}
          sublabel="Being tracked"
        />
        <OverviewStat
          icon={<FileText className="h-5 w-5" />}
          label="Documents"
          value={stats.expiringDocs > 0 ? `${stats.expiringDocs} ⚠️` : '✓'}
          sublabel={stats.expiringDocs > 0 ? 'Expiring soon' : 'All current'}
          variant={stats.expiringDocs > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Urgency Alerts */}
      <UrgencyAlert items={urgencyItems} />

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
