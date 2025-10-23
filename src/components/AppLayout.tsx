import React, { useState, useEffect } from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import QuickActions from './QuickActions';
import UpgradeBanner from './UpgradeBanner';
import UpgradeModal from './UpgradeModal';
import CountryTracker from './CountryTracker';
import EnhancedNewsSection from './EnhancedNewsSection';
import TaxResidencyTracker from './TaxResidencyTracker';
import TaxResidencyHub from './TaxResidencyHub';
import VisaTrackingManager from './VisaTrackingManager';
import { DocumentTracker } from './DocumentTracker';
import VaccinationTracker from './VaccinationTracker';
import { SmartAlerts } from './SmartAlerts';
import TravelServices from './TravelServices';
import AirportLoungeAccess from './AirportLoungeAccess';
import GlobalCityServices from './GlobalCityServices';
import Settings from './Settings';
import EnhancedProfileForm from './EnhancedProfileForm';
import { SecureDocumentVault } from './SecureDocumentVault';
import { CookieConsent } from './GDPRCompliance';
import AITravelAssistant from './AITravelAssistant';
import AITravelDoctor from './AITravelDoctor';
import { AITravelLawyer } from './AITravelLawyer';
import { AITravelPlanner } from './AITravelPlanner';
import FloatingActionButton from './FloatingActionButton';
import DashboardQuickStats from './DashboardQuickStats';
import { EnhancedDashboard } from './EnhancedDashboard';
import { ESimServices } from './ESimServices';
import { EnhancedCurrencyConverter } from './EnhancedCurrencyConverter';
import EmbassyDirectory from './EmbassyDirectory';
import EmergencyCardNumbers from './EmergencyCardNumbers';
import EmergencyContacts from './EmergencyContacts';
import DigitalBanks from './DigitalBanks';
import MoneyTransfers from './MoneyTransfers';
import DigitalMoney from './DigitalMoney';
import SimpleCurrencyConverter from './SimpleCurrencyConverter';
import RoadsideAssistance from './RoadsideAssistance';
import PetServices from './PetServices';
import TaxWealthyHelp from './TaxWealthyHelp';
import VPNEmailServices from './VPNEmailServices';
import TravelInsurance from './TravelInsurance';
import PublicTransport from './PublicTransport';
import TaxiServices from './TaxiServices';
import CarRentLease from './CarRentLease';
import Students from './Students';
import LocalNomads from './LocalNomads';
import ExploreLocalLife from './ExploreLocalLife';
import SuperOffers from './SuperOffers';
import LocationTrackingServices from './LocationTrackingServices';
import MedicalServices from './MedicalServices';
import TravelLegalServices from './TravelLegalServices';
import { VisaAssistanceServices } from './VisaAssistanceServices';
import MyAwards from './MyAwards';
import ErrorBoundary from './ErrorBoundary';
import WiFiHotspotFinder from './WiFiHotspotFinder';
import TravelWeatherDashboard from './TravelWeatherDashboard';
import LanguageLearning from './LanguageLearning';
import DeliveryServices from './DeliveryServices';
import LocalServices from './LocalServices';
import { Country, LocationData } from '@/types/country';
import { Subscription } from '@/types/subscription';

interface AppLayoutProps {
  countries: Country[];
  onAddCountry: (country: Country) => void;
  onRemoveCountry: (countryCode: string) => void;
  onUpdateCountrySettings: (countryId: string, settings: {
    countingMode: 'days' | 'nights';
    partialDayRule: 'full' | 'half' | 'exclude';
    countArrivalDay: boolean;
    countDepartureDay: boolean;
  }) => void;
  onUpdateCountryLimit: (countryId: string, newLimit: number) => void;
  onResetCountry: (countryId: string) => void;
  onToggleCountDays: (countryId: string) => void;
  subscription: Subscription;
  detectedLocation: LocationData | null;
  userProfile: any;
  onUpgrade?: (tier: string) => void;
  onProfileComplete?: (data: any) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  countries,
  onAddCountry,
  onRemoveCountry,
  onUpdateCountrySettings,
  onUpdateCountryLimit,
  onResetCountry,
  onToggleCountDays,
  subscription,
  detectedLocation,
  userProfile,
  onUpgrade,
  onProfileComplete
}) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [upgradeBannerDismissed, setUpgradeBannerDismissed] = useState(() => {
    return localStorage.getItem('upgradeBannerDismissed') === 'true';
  });

  // Return to dashboard when home event is triggered (e.g., clicking logo)
  useEffect(() => {
    const goHome = () => {
      setActiveSection('dashboard');
      setSidebarOpen(false);
    };
    window.addEventListener('smartnomad:home', goHome);
    return () => window.removeEventListener('smartnomad:home', goHome);
  }, []);

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
                onProfileFormClick={() => setShowProfileForm(true)}
                onDismiss={handleDismissBanner}
              />
            )}
            
            {/* Enhanced Dashboard with all features */}
            <EnhancedDashboard 
              countries={countries}
              userProfile={userProfile}
              onSectionChange={(section) => setActiveSection(section)}
            />
          </div>
        );
      
      case 'tax':
        return (
          <TaxResidencyTracker 
            countries={countries}
            onAddCountry={onAddCountry}
            onRemoveCountry={onRemoveCountry}
            onUpdateCountrySettings={onUpdateCountrySettings}
            onUpdateCountryLimit={onUpdateCountryLimit}
            onResetCountry={onResetCountry}
            onToggleCountDays={onToggleCountDays}
            currentLocation={detectedLocation}
          />
        );
      
      case 'tax-residency':
        return (
          <TaxResidencyHub 
            countries={countries}
            onAddCountry={onAddCountry}
            onRemoveCountry={onRemoveCountry}
            onUpdateCountrySettings={onUpdateCountrySettings}
            onUpdateCountryLimit={onUpdateCountryLimit}
            onResetCountry={onResetCountry}
            onToggleCountDays={onToggleCountDays}
            currentLocation={detectedLocation}
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
      
      case 'car-rent-lease':
        return <CarRentLease />;
      
      case 'delivery-services':
        return <DeliveryServices currentLocation={detectedLocation} />;
      
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
      
      case 'super-offers':
        return (
          <SuperOffers 
            currentLocation={detectedLocation}
            subscription={subscription}
            onUpgradeClick={() => setShowUpgradeModal(true)}
            onProfileFormClick={() => setShowProfileForm(true)}
          />
        );
      
      case 'location-tracking':
        return <LocationTrackingServices />;
      
      case 'services':
        return <TravelServices currentLocation={detectedLocation} />;
      
      case 'airport-lounges':
        return <AirportLoungeAccess currentLocation={detectedLocation} />;
      
      case 'global-city-services':
        return <GlobalCityServices />;
      
      case 'my-travel-awards':
        return <MyAwards />;
      
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
      
      case 'currency-converter':
        return <SimpleCurrencyConverter />;
      
      case 'roadside':
        return <RoadsideAssistance currentLocation={detectedLocation} />;
      
      case 'students':
        return <Students currentLocation={detectedLocation} />;
      
      case 'local-nomads':
        return <LocalNomads currentLocation={detectedLocation} />;
      
      case 'explore-local':
        return (
          <ErrorBoundary>
            <ExploreLocalLife currentLocation={detectedLocation} />
          </ErrorBoundary>
        );
      
      case 'ai-doctor':
        return <AITravelDoctor currentLocation={detectedLocation} subscription={subscription} onUpgradeClick={() => setShowUpgradeModal(true)} />;
      
      case 'ai-lawyer':
        return <AITravelLawyer currentLocation={detectedLocation} subscription={subscription} onUpgradeClick={() => setShowUpgradeModal(true)} />;
      
      case 'ai-planner':
        return <AITravelPlanner currentLocation={detectedLocation} />;
      
      case 'medical-services':
        return (
          <MedicalServices
            currentLocation={detectedLocation}
            subscription={subscription}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        );
      
      case 'travel-lawyers':
        return (
          <TravelLegalServices 
            currentLocation={detectedLocation}
            subscription={subscription}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        );
      
      case 'visa-assistance':
        return (
          <VisaAssistanceServices 
            currentLocation={detectedLocation}
            subscription={subscription}
          />
        );
      
      case 'wifi-finder':
        return (
          <WiFiHotspotFinder
            subscription={subscription}
            currentLocation={detectedLocation}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        );
      
      case 'weather':
        return <TravelWeatherDashboard />;
      
      case 'language-learning':
        return (
          <ErrorBoundary>
            <LanguageLearning currentLocation={detectedLocation} />
          </ErrorBoundary>
        );
      
      case 'local-services':
        return (
          <ErrorBoundary>
            <LocalServices />
          </ErrorBoundary>
        );
      
      case 'settings':
        return (
          <Settings 
            subscription={subscription} 
            onUpgradeClick={() => setShowUpgradeModal(true)}
            onProfileComplete={onProfileComplete}
          />
        );
      
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
        onNavigateToSettings={() => {
          setActiveSection('settings');
          setSidebarOpen(false);
        }}
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

      {/* Enhanced Profile Form */}
      {showProfileForm && onProfileComplete && (
        <EnhancedProfileForm 
          onComplete={(data) => {
            onProfileComplete(data);
            setShowProfileForm(false);
          }}
          onSkip={() => setShowProfileForm(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;