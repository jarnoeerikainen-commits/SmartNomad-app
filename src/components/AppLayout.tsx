import React, { useState } from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import QuickActions from './QuickActions';
import UpgradeBanner from './UpgradeBanner';
import UpgradeModal from './UpgradeModal';
import CountryTracker from './CountryTracker';
import EnhancedNewsSection from './EnhancedNewsSection';
import TaxResidencyTracker from './TaxResidencyTracker';
import VisaTrackingManager from './VisaTrackingManager';
import { DocumentTracker } from './DocumentTracker';
import VaccinationTracker from './VaccinationTracker';
import { SmartAlerts } from './SmartAlerts';
import TravelServices from './TravelServices';
import Settings from './Settings';
import { SecureDocumentVault } from './SecureDocumentVault';
import { CookieConsent } from './GDPRCompliance';
import AITravelAssistant from './AITravelAssistant';
import FloatingActionButton from './FloatingActionButton';
import DashboardQuickStats from './DashboardQuickStats';
import { ESimServices } from './ESimServices';
import { EnhancedCurrencyConverter } from './EnhancedCurrencyConverter';
import EmbassyDirectory from './EmbassyDirectory';
import EmergencyCardNumbers from './EmergencyCardNumbers';
import EmergencyContacts from './EmergencyContacts';
import DigitalBanks from './DigitalBanks';
import MoneyTransfers from './MoneyTransfers';
import DigitalMoney from './DigitalMoney';
import RoadsideAssistance from './RoadsideAssistance';
import PetServices from './PetServices';
import TaxWealthyHelp from './TaxWealthyHelp';
import VPNEmailServices from './VPNEmailServices';
import TravelInsurance from './TravelInsurance';
import PublicTransport from './PublicTransport';
import TaxiServices from './TaxiServices';
import Students from './Students';
import LocalNomads from './LocalNomads';
import ExploreLocalLife from './ExploreLocalLife';
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeBannerDismissed, setUpgradeBannerDismissed] = useState(() => {
    return localStorage.getItem('upgradeBannerDismissed') === 'true';
  });

  const handleDismissBanner = () => {
    setUpgradeBannerDismissed(true);
    localStorage.setItem('upgradeBannerDismissed', 'true');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Upgrade Banner for Free Users */}
            {!upgradeBannerDismissed && (
              <UpgradeBanner 
                subscription={subscription}
                onUpgradeClick={() => setShowUpgradeModal(true)}
                onDismiss={handleDismissBanner}
              />
            )}
            
            {/* Quick Stats */}
            <DashboardQuickStats countries={countries} />
            
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
      
      case 'tax-wealthy':
        return <TaxWealthyHelp currentLocation={detectedLocation} />;
      
      case 'visas':
        return <VisaTrackingManager subscription={subscription} countries={countries} />;
      
      case 'public-transport':
        return <PublicTransport currentLocation={detectedLocation} />;
      
      case 'taxis':
        return <TaxiServices currentLocation={detectedLocation} />;
      
      case 'documents':
        return (
          <div className="space-y-6">
            <DocumentTracker />
            <SecureDocumentVault />
          </div>
        );
      
      case 'vpn-email':
        return <VPNEmailServices />;
      
      case 'travel-insurance':
        return <TravelInsurance />;
      
      case 'health':
        return (
          <VaccinationTracker 
            currentLocation={detectedLocation} 
            trackedCountries={countries}
          />
        );
      
      case 'pet-services':
        return <PetServices currentLocation={detectedLocation} />;
      
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
      
      case 'emergency-cards':
        return <EmergencyCardNumbers />;
      
      case 'emergency':
        return <EmergencyContacts />;
      
      case 'digital-banks':
        return <DigitalBanks />;
      
      case 'money-transfers':
        return <MoneyTransfers currentLocation={detectedLocation} />;
      
      case 'crypto-cash':
        return <DigitalMoney currentLocation={detectedLocation} />;
      
      case 'roadside':
        return <RoadsideAssistance currentLocation={detectedLocation} />;
      
      case 'students':
        return <Students currentLocation={detectedLocation} />;
      
      case 'local-nomads':
        return <LocalNomads currentLocation={detectedLocation} />;
      
      case 'explore-local':
        return <ExploreLocalLife currentLocation={detectedLocation} />;
      
      case 'settings':
        return <Settings subscription={subscription} onUpgradeClick={() => setShowUpgradeModal(true)} />;
      
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
        onUpgradeClick={() => setShowUpgradeModal(true)}
        countries={countries}
      />
      
      <div className="flex">
        <AppSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          subscription={subscription}
          onUpgradeClick={() => setShowUpgradeModal(true)}
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
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onAction={(action) => {
          if (action === 'add-country') setActiveSection('tax');
          if (action === 'add-visa') setActiveSection('visas');
          if (action === 'add-document') setActiveSection('documents');
        }}
      />
      
      {/* AI Travel Assistant */}
      <AITravelAssistant 
        userProfile={userProfile}
        trackedCountries={countries}
        subscription={subscription}
      />

      {/* Upgrade Modal */}
      {onUpgrade && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          subscription={subscription}
          onUpgrade={onUpgrade}
        />
      )}
    </div>
  );
};

export default AppLayout;