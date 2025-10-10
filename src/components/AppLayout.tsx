import React, { useState } from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';
import CountryTracker from './CountryTracker';
import EnhancedNewsSection from './EnhancedNewsSection';
import TaxResidencyTracker from './TaxResidencyTracker';
import VisaTrackingManager from './VisaTrackingManager';
import { DocumentTracker } from './DocumentTracker';
import VaccinationTracker from './VaccinationTracker';
import { SmartAlerts } from './SmartAlerts';
import TravelServices from './TravelServices';
import UserProfile from './UserProfile';
import { SecureDocumentVault } from './SecureDocumentVault';
import { CookieConsent } from './GDPRCompliance';
import AITravelAssistant from './AITravelAssistant';
import { ESimServices } from './ESimServices';
import { EnhancedCurrencyConverter } from './EnhancedCurrencyConverter';
import EmbassyDirectory from './EmbassyDirectory';
import { Country, LocationData } from '@/types/country';
import { Subscription } from '@/types/subscription';

interface AppLayoutProps {
  countries: Country[];
  onAddCountry: (country: Country) => void;
  onRemoveCountry: (countryCode: string) => void;
  subscription: Subscription;
  detectedLocation: LocationData | null;
  userProfile: any;
  onUpgrade?: (tier: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  countries,
  onAddCountry,
  onRemoveCountry,
  subscription,
  detectedLocation,
  userProfile,
  onUpgrade
}) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats countries={countries} />
            <QuickActions 
              onAddCountry={() => setActiveSection('tax')} 
              onSectionChange={setActiveSection}
            />
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CountryTracker
                  countries={countries}
                  onAddCountry={onAddCountry}
                  onRemoveCountry={onRemoveCountry}
                />
              </div>
              <div className="space-y-6">
                <EnhancedNewsSection />
              </div>
            </div>
          </div>
        );
      
      case 'tax':
        return (
          <TaxResidencyTracker 
            countries={countries}
            onAddCountry={onAddCountry}
            onRemoveCountry={onRemoveCountry}
          />
        );
      
      case 'visas':
        return <VisaTrackingManager subscription={subscription} countries={countries} />;
      
      case 'documents':
        return (
          <div className="space-y-6">
            <DocumentTracker />
            <SecureDocumentVault />
          </div>
        );
      
      case 'health':
        return (
          <VaccinationTracker 
            currentLocation={detectedLocation} 
            trackedCountries={countries}
          />
        );
      
      case 'news':
        return <EnhancedNewsSection />;
      
      case 'alerts':
        return <SmartAlerts />;
      
      case 'services':
        return <TravelServices currentLocation={detectedLocation} />;
      
      case 'esim':
        return <ESimServices />;
      
      case 'embassy':
        return <EmbassyDirectory />;
      
      case 'currency':
        return <EnhancedCurrencyConverter />;
      
      case 'settings':
        return <UserProfile subscription={subscription} onUpgrade={onUpgrade} />;
      
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Section under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton={true}
        subscription={subscription}
        onUpgrade={onUpgrade}
      />
      
      <div className="flex">
        <AppSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-hidden">
          <div className="container mx-auto p-6 max-w-7xl">
            <div className="animate-fade-in">
              {renderActiveSection()}
            </div>
          </div>
        </main>
      </div>
      
      {/* GDPR Cookie Consent */}
      <CookieConsent />
      
      {/* AI Travel Assistant */}
      <AITravelAssistant 
        userProfile={userProfile}
        trackedCountries={countries}
        subscription={subscription}
      />
    </div>
  );
};

export default AppLayout;