import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import BottomNavigation from './BottomNavigation';
import HomeSection from './sections/HomeSection';
import QuickActions from './QuickActions';
import UpgradeBanner from './UpgradeBanner';
import UpgradeModal from './UpgradeModal';
import FloatingActionButton from './FloatingActionButton';
import ErrorBoundary from './ErrorBoundary';
import { CookieConsent } from './GDPRCompliance';
import DashboardBottomStats from './dashboard/DashboardBottomStats';
import SocialMatchNotifications from './SocialMatchNotifications';
import { Country, LocationData } from '@/types/country';
import { Subscription } from '@/types/subscription';
import { Skeleton } from './ui/skeleton';
import { VoiceControlProvider } from '@/contexts/VoiceControlContext';
import MFAGate from '@/components/auth/MFAGate';
import CalendarReminderBoot from '@/components/calendar/CalendarReminderBoot';

// Lazy-loaded section components — only downloaded when the user navigates to them
const TrackingSection = lazy(() => import('./sections/TrackingSection'));
const EmergencySection = lazy(() => import('./sections/EmergencySection'));
const AISection = lazy(() => import('./sections/AISection'));
const ProfileSection = lazy(() => import('./sections/ProfileSection'));
const SuperNomadGuardian = lazy(() => import('./SuperNomadGuardian').then(m => ({ default: m.SuperNomadGuardian })));
const ThreatDashboard = lazy(() => import('./ThreatIntelligence/ThreatDashboard'));
const CountryTracker = lazy(() => import('./CountryTracker'));
const EnhancedNewsSection = lazy(() => import('./EnhancedNewsSection'));
const TaxResidencyTracker = lazy(() => import('./TaxResidencyTracker'));
const TaxResidencyHub = lazy(() => import('./TaxResidencyHub'));
const ExpenseHub = lazy(() => import('./expenses/ExpenseHub').then(m => ({ default: m.ExpenseHub })));
const VisaTrackingManager = lazy(() => import('./VisaTrackingManager'));
const DocumentTracker = lazy(() => import('./DocumentTracker').then(m => ({ default: m.DocumentTracker })));
const VaccinationTracker = lazy(() => import('./VaccinationTracker'));
const SmartAlerts = lazy(() => import('./SmartAlerts').then(m => ({ default: m.SmartAlerts })));
const TravelServices = lazy(() => import('./TravelServices'));
const RemoteOffices = lazy(() => import('./RemoteWorkOffices/OfficeFinder'));
const BusinessCentersPage = lazy(() => import('./BusinessCenters/BusinessCentersPage').then(m => ({ default: m.BusinessCentersPage })));
const AirportLoungeAccess = lazy(() => import('./AirportLoungeAccess'));
const GlobalCityServices = lazy(() => import('./GlobalCityServices'));
const Settings = lazy(() => import('./Settings'));
const EnhancedProfileForm = lazy(() => import('./EnhancedProfileForm'));
const SecureDocumentVault = lazy(() => import('./SecureDocumentVault').then(m => ({ default: m.SecureDocumentVault })));
const AITravelAssistant = lazy(() => import('./AITravelAssistant'));
const AITravelDoctor = lazy(() => import('./AITravelDoctor').then(m => ({ default: m.AITravelDoctor })));
const AITravelLawyer = lazy(() => import('./AITravelLawyer').then(m => ({ default: m.AITravelLawyer })));
const AITravelPlanner = lazy(() => import('./AITravelPlanner'));
const AirCharterService = lazy(() => import('./AirCharterService'));
const TaxAdvisors = lazy(() => import('./TaxAdvisors').then(m => ({ default: m.TaxAdvisors })));
const ESimServices = lazy(() => import('./ESimServices').then(m => ({ default: m.ESimServices })));
const EnhancedCurrencyConverter = lazy(() => import('./EnhancedCurrencyConverter').then(m => ({ default: m.EnhancedCurrencyConverter })));
const EmbassyDirectory = lazy(() => import('./EmbassyDirectory'));
const EmergencyCardNumbers = lazy(() => import('./EmergencyCardNumbers'));
const EmergencyContacts = lazy(() => import('./EmergencyContacts'));
const SOSServices = lazy(() => import('./SOSServices'));
const SecurityDirectory = lazy(() => import('./SecurityServices/SecurityDirectory'));
const DigitalBanks = lazy(() => import('./DigitalBanks'));
const MoneyTransfers = lazy(() => import('./MoneyTransfers'));
const DigitalMoney = lazy(() => import('./DigitalMoney'));
const SimpleCurrencyConverter = lazy(() => import('./SimpleCurrencyConverter'));
const RoadsideAssistance = lazy(() => import('./RoadsideAssistance'));
const PetServices = lazy(() => import('./PetServices'));
const TaxWealthyHelp = lazy(() => import('./TaxWealthyHelp'));
const VPNEmailServices = lazy(() => import('./VPNEmailServices'));
const TravelInsurance = lazy(() => import('./TravelInsurance'));
const PublicTransport = lazy(() => import('./PublicTransport'));
const TaxiServices = lazy(() => import('./TaxiServices'));
const CarRentLease = lazy(() => import('./CarRentLease'));
const Students = lazy(() => import('./Students'));
const LocalNomads = lazy(() => import('./LocalNomads'));
const ExploreLocalLife = lazy(() => import('./ExploreLocalLife'));
const SuperOffers = lazy(() => import('./SuperOffers'));
const LocationTrackingServices = lazy(() => import('./LocationTrackingServices'));
const MedicalServices = lazy(() => import('./MedicalServices'));
const TravelLegalServices = lazy(() => import('./TravelLegalServices'));
const VisaAssistanceServices = lazy(() => import('./VisaAssistanceServices').then(m => ({ default: m.VisaAssistanceServices })));
const MyAwards = lazy(() => import('./MyAwards'));
const WiFiHotspotFinder = lazy(() => import('./WiFiHotspotFinder'));
const TravelWeatherDashboard = lazy(() => import('./TravelWeatherDashboard'));
const LanguageLearning = lazy(() => import('./LanguageLearning'));
const DeliveryServices = lazy(() => import('./DeliveryServices'));
const LocalServices = lazy(() => import('./LocalServices'));
const LocalNews = lazy(() => import('./LocalNews'));
const GovernmentApps = lazy(() => import('./GovernmentApps').then(m => ({ default: m.GovernmentApps })));
const CyberHelplineDashboard = lazy(() => import('./CyberHelpline/CyberHelplineDashboard'));
const ClubsDirectory = lazy(() => import('./EliteClubs/ClubsDirectory').then(m => ({ default: m.ClubsDirectory })));
const NannyDirectory = lazy(() => import('./FamilyServices/NannyDirectory').then(m => ({ default: m.NannyDirectory })));
const NomadChatDashboard = lazy(() => import('./CommunityChat/NomadChatDashboard').then(m => ({ default: m.NomadChatDashboard })));
const MarketplaceDashboard = lazy(() => import('./Marketplace/MarketplaceDashboard'));
const PaymentOptionsDashboard = lazy(() => import('./PaymentOptions/PaymentOptionsDashboard'));
const AwardCardsDashboard = lazy(() => import('./AwardCards/AwardCardsDashboard'));
const MovingServicesDashboard = lazy(() => import('./MovingServices/MovingServicesDashboard').then(m => ({ default: m.MovingServicesDashboard })));
const SocialDashboard = lazy(() => import('./SocialChat/SocialDashboard').then(m => ({ default: m.SocialDashboard })));
const HelpSupportCenter = lazy(() => import('./HelpSupportCenter'));
const ProjectInfoDashboard = lazy(() => import('./ProjectInfoDashboard'));
const WellnessDashboard = lazy(() => import('./Wellness/WellnessDashboard'));
const ETIASCenter = lazy(() => import('./ETIASCenter'));
const EESCenter = lazy(() => import('./EESCenter'));
const VisaImmigrationHub = lazy(() => import('./VisaImmigrationHub'));
const VaccinationMedicineHub = lazy(() => import('./VaccinationMedicineHub'));
const WeatherServiceDashboard = lazy(() => import('./weather/WeatherServiceDashboard'));
const FeatureCustomizer = lazy(() => import('./FeatureCustomizer'));
const SnomadIdVault = lazy(() => import('./SnomadIdVault'));
const ConnectorsDashboard = lazy(() => import('./ConnectorsDashboard'));
const CorporateDashboard = lazy(() => import('@/pages/CorporateDashboard'));
const LifestyleHub = lazy(() => import('./Lifestyle/LifestyleHub'));
const VisaAutoMatcher = lazy(() => import('./VisaAutoMatcher'));
const JetLagProtocol = lazy(() => import('./JetLagProtocol'));
const VentureTravelist = lazy(() => import('./VentureTravelist'));
const TaxLawVerifier = lazy(() => import('./TaxLawVerifier'));
const DocumentAutoFill = lazy(() => import('./DocumentAutoFill'));
const TrustPassDashboard = lazy(() => import('./TrustPassDashboard'));
const GPSDayMonitor = lazy(() => import('./GPSDayMonitor'));
const SovereignAccessCenter = lazy(() => import('./permissions/SovereignAccessCenter'));
const TravelInboxImport = lazy(() => import('./permissions/TravelInboxImport'));

// Loading fallback for lazy sections
const SectionLoader = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-32 w-full" />
  </div>
);

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
  onIncrementCountryDay?: (countryId: string) => void;
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
  onIncrementCountryDay,
  subscription,
  detectedLocation,
  userProfile,
  onUpgrade,
  onProfileComplete
}) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [bottomNavTab, setBottomNavTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [upgradeBannerDismissed, setUpgradeBannerDismissed] = useState(() => {
    return localStorage.getItem('upgradeBannerDismissed') === 'true';
  });

  // Voice control navigation callbacks
  const handleVoiceNavigate = useCallback((section: string) => {
    setActiveSection(section);
    setBottomNavTab('home');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleVoiceTabChange = useCallback((tab: string) => {
    setBottomNavTab(tab);
    setActiveSection('dashboard');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Return to dashboard when home event is triggered
  useEffect(() => {
    const goHome = () => {
      setBottomNavTab('home');
      setActiveSection('dashboard');
      setSidebarOpen(false);
    };
    const openSupport = () => {
      setBottomNavTab('home');
      setActiveSection('help');
      setSidebarOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('supernomad:home', goHome);
    window.addEventListener('supernomad:open-support', openSupport as EventListener);
    const handleNavigate = (e: Event) => {
      const detail = (e as CustomEvent<{ section?: string }>).detail;
      if (detail?.section) {
        setActiveSection(detail.section);
        setBottomNavTab('home');
        setSidebarOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('supernomad:navigate', handleNavigate as EventListener);
    return () => {
      window.removeEventListener('supernomad:home', goHome);
      window.removeEventListener('supernomad:open-support', openSupport as EventListener);
      window.removeEventListener('supernomad:navigate', handleNavigate as EventListener);
    };
  }, []);

  const handleDismissBanner = useCallback(() => {
    setUpgradeBannerDismissed(true);
    localStorage.setItem('upgradeBannerDismissed', 'true');
  }, []);

  const openUpgradeModal = useCallback(() => setShowUpgradeModal(true), []);
  const openProfileForm = useCallback(() => setShowProfileForm(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    setBottomNavTab('home');
  }, []);

  const handleBottomNavChange = useCallback((tab: string) => {
    setBottomNavTab(tab);
    setActiveSection('dashboard');
    setSidebarOpen(false);
  }, []);

  const renderBottomNavContent = () => {
    switch (bottomNavTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <HomeSection 
              countries={countries}
              subscription={subscription}
              onNavigate={(section) => setActiveSection(section)}
            />
            {!upgradeBannerDismissed && (
              <UpgradeBanner 
                subscription={subscription}
                onUpgradeClick={openUpgradeModal}
                onProfileFormClick={openProfileForm}
                onDismiss={handleDismissBanner}
              />
            )}
          </div>
        );
      
      case 'tracking':
        return (
          <Suspense fallback={<SectionLoader />}>
            <TrackingSection
              countries={countries}
              onAddCountry={onAddCountry}
              onRemoveCountry={onRemoveCountry}
              onUpdateCountrySettings={onUpdateCountrySettings}
              onUpdateCountryLimit={onUpdateCountryLimit}
              onResetCountry={onResetCountry}
              onToggleCountDays={onToggleCountDays}
              subscription={subscription}
              onUpgradeClick={openUpgradeModal}
            />
          </Suspense>
        );
      
      case 'emergency':
        return (
          <Suspense fallback={<SectionLoader />}>
            <EmergencySection />
          </Suspense>
        );
      
      case 'ai':
        return (
          <Suspense fallback={<SectionLoader />}>
            <AISection 
              subscription={subscription}
              onUpgradeClick={openUpgradeModal}
            />
          </Suspense>
        );
      
      case 'profile':
        return (
          <Suspense fallback={<SectionLoader />}>
            <ProfileSection
              subscription={subscription}
              onUpgradeClick={openUpgradeModal}
            />
          </Suspense>
        );
      
      default:
        return null;
    }
  };

  const renderActiveSection = () => {
    // For mobile, always show bottom nav content
    if (bottomNavTab !== 'home' || activeSection === 'dashboard') {
      return renderBottomNavContent();
    }

    // All sidebar sections are wrapped in Suspense
    return (
      <Suspense fallback={<SectionLoader />}>
        {renderSidebarSection()}
      </Suspense>
    );
  };

  const renderSidebarSection = () => {
    switch (activeSection) {
      case 'guardian': return <SuperNomadGuardian />;
      case 'threats': return <ThreatDashboard />;
      case 'dashboard': return renderBottomNavContent();
      case 'expenses': return <ExpenseHub />;
      case 'tax':
        return (
          <TaxResidencyTracker 
            countries={countries} onAddCountry={onAddCountry} onRemoveCountry={onRemoveCountry}
            onUpdateCountrySettings={onUpdateCountrySettings} onUpdateCountryLimit={onUpdateCountryLimit}
            onResetCountry={onResetCountry} onToggleCountDays={onToggleCountDays} currentLocation={detectedLocation}
          />
        );
      case 'tax-residency':
        return (
          <TaxResidencyHub 
            countries={countries} onAddCountry={onAddCountry} onRemoveCountry={onRemoveCountry}
            onUpdateCountrySettings={onUpdateCountrySettings} onUpdateCountryLimit={onUpdateCountryLimit}
            onResetCountry={onResetCountry} onToggleCountDays={onToggleCountDays} currentLocation={detectedLocation}
          />
        );
      case 'gov-apps': return <GovernmentApps />;
      case 'tax-wealthy': return <TaxWealthyHelp currentLocation={detectedLocation} />;
      case 'visas': return <VisaTrackingManager subscription={subscription} countries={countries} />;
      case 'payment-options': return <PaymentOptionsDashboard />;
      case 'award-cards': return <AwardCardsDashboard />;
      case 'public-transport': return <PublicTransport currentLocation={detectedLocation} />;
      case 'taxis': return <TaxiServices currentLocation={detectedLocation} />;
      case 'car-rent-lease': return <CarRentLease />;
      case 'delivery-services': return <DeliveryServices currentLocation={detectedLocation} />;
      case 'documents':
      case 'vault':
        return (
          <div className="space-y-6">
            <DocumentTracker />
            <SecureDocumentVault />
          </div>
        );
      case 'vpn-email': return <VPNEmailServices />;
      case 'travel-insurance': return <TravelInsurance />;
      case 'health':
        return <VaccinationMedicineHub currentLocation={detectedLocation} trackedCountries={countries} />;
      case 'vaccination-hub':
        return <VaccinationMedicineHub currentLocation={detectedLocation} trackedCountries={countries} />;
      case 'pet-services': return <PetServices currentLocation={detectedLocation} />;
      case 'marketplace': return <MarketplaceDashboard />;
      case 'explore-local-life':
      case 'explore-local':
        return (
          <ErrorBoundary>
            <ExploreLocalLife currentLocation={detectedLocation} />
          </ErrorBoundary>
        );
      case 'moving-services': return <MovingServicesDashboard />;
      case 'social-chat': return <SocialDashboard />;
      case 'nomad-chat': return <NomadChatDashboard />;
      case 'news': return <EnhancedNewsSection />;
      case 'alerts': return <SmartAlerts />;
      case 'super-offers':
        return (
          <SuperOffers currentLocation={detectedLocation} subscription={subscription}
            onUpgradeClick={openUpgradeModal} onProfileFormClick={openProfileForm}
          />
        );
      case 'location-tracking': return <LocationTrackingServices />;
      case 'services': return <TravelServices currentLocation={detectedLocation} />;
      case 'remote-offices': return <RemoteOffices />;
      case 'business-centers': return <BusinessCentersPage />;
      case 'airport-lounges': return <AirportLoungeAccess currentLocation={detectedLocation} />;
      case 'private-clubs': return <ClubsDirectory />;
      case 'family-services': return <NannyDirectory />;
      case 'global-city-services': return <GlobalCityServices />;
      case 'my-travel-awards': return <MyAwards />;
      case 'esim': return <ESimServices />;
      case 'embassy': return <EmbassyDirectory />;
      case 'currency': return <EnhancedCurrencyConverter />;
      case 'emergency-cards': return <EmergencyCardNumbers />;
      case 'sos-services': return <SOSServices />;
      case 'private-protection': return <SecurityDirectory />;
      case 'cyber-helpline': return <CyberHelplineDashboard />;
      case 'emergency': return <EmergencyContacts />;
      case 'digital-banks': return <DigitalBanks />;
      case 'money-transfers': return <MoneyTransfers currentLocation={detectedLocation} />;
      case 'crypto-cash': return <DigitalMoney currentLocation={detectedLocation} />;
      case 'currency-converter': return <SimpleCurrencyConverter />;
      case 'roadside': return <RoadsideAssistance currentLocation={detectedLocation} />;
      case 'students': return <Students currentLocation={detectedLocation} />;
      case 'local-nomads': return <LocalNomads currentLocation={detectedLocation} />;
      case 'ai-doctor': return <AITravelDoctor currentLocation={detectedLocation} />;
      case 'ai-lawyer':
        return <AITravelLawyer currentLocation={detectedLocation} subscription={subscription} onUpgradeClick={openUpgradeModal} />;
      case 'ai-planner': return <AITravelPlanner />;
      case 'air-charter': return <AirCharterService />;
      case 'medical-services':
        return <MedicalServices currentLocation={detectedLocation} subscription={subscription} onUpgradeClick={openUpgradeModal} />;
      case 'travel-lawyers':
        return <TravelLegalServices currentLocation={detectedLocation} subscription={subscription} onUpgradeClick={openUpgradeModal} />;
      case 'tax-advisors': return <TaxAdvisors />;
      case 'visa-assistance':
        return <VisaAssistanceServices currentLocation={detectedLocation} subscription={subscription} />;
      case 'wifi-finder':
        return <WiFiHotspotFinder subscription={subscription} currentLocation={detectedLocation} onUpgradeClick={openUpgradeModal} />;
      case 'weather': return <TravelWeatherDashboard />;
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
      case 'local-news':
        return (
          <ErrorBoundary>
            <LocalNews />
          </ErrorBoundary>
        );
      case 'settings':
        return <Settings subscription={subscription} onUpgradeClick={openUpgradeModal} onProfileComplete={onProfileComplete} />;
      case 'help': return <HelpSupportCenter />;
      case 'wellness': return <WellnessDashboard />;
      case 'etias': return <ETIASCenter />;
      case 'ees': return <EESCenter countries={countries} />;
      case 'visa-immigration': return <VisaImmigrationHub />;
      case 'weather-service': return <WeatherServiceDashboard />;
      case 'snomad-id': return <MFAGate flag="require_mfa_for_sensitive" area="your Snomad ID identity vault"><SnomadIdVault /></MFAGate>;
      case 'customize': return <FeatureCustomizer />;
      case 'integrations': return <ConnectorsDashboard />;
      case 'corporate': return <CorporateDashboard />;
      case 'lifestyle-hub': return <LifestyleHub />;
      case 'visa-matcher': return <VisaAutoMatcher countries={countries} />;
      case 'jet-lag': return <JetLagProtocol />;
      case 'venture-invest': return <VentureTravelist />;
      case 'tax-law-verifier': return <TaxLawVerifier />;
      case 'document-auto-fill': return <DocumentAutoFill />;
      case 'trust-pass': return <TrustPassDashboard />;
      case 'sovereign-access': return <SovereignAccessCenter />;
      case 'travel-inbox': return <TravelInboxImport />;
      case 'gps-monitor':
        return (
          <GPSDayMonitor
            countries={countries}
            onAddCountry={onAddCountry}
            onUpdateCountryLimit={onUpdateCountryLimit}
            onIncrementDay={onIncrementCountryDay}
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
    <VoiceControlProvider onNavigate={handleVoiceNavigate} onTabChange={handleVoiceTabChange}>
    <div className="min-h-screen bg-background">
      <AppHeader 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton={true}
        subscription={subscription}
        onUpgradeClick={openUpgradeModal}
        countries={countries}
        onNavigateToSettings={() => {
          setActiveSection('settings');
          closeSidebar();
        }}
        onNavigateToTax={() => {
          setActiveSection('tax-residency');
          setBottomNavTab('tracking');
          closeSidebar();
        }}
      />
      
      <div className="flex">
        <AppSidebar 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          subscription={subscription}
          onUpgradeClick={openUpgradeModal}
        />
        
          <main className="flex-1 overflow-x-hidden overflow-y-auto" onClick={() => { if (sidebarOpen) setSidebarOpen(false); }}>
            <div className="container mx-auto p-3 sm:p-6 max-w-7xl pb-36 md:pb-6">
              <div className="animate-fade-in">
                {renderActiveSection()}
              </div>
            </div>
          </main>
      </div>
      
      {/* Social Match Push Notifications (Demo) */}
      <SocialMatchNotifications />

      {/* GDPR Cookie Consent */}
      <CookieConsent />
      
      {/* Bottom Stats Bar */}
      {bottomNavTab === 'home' && (
        <DashboardBottomStats 
          countries={countries}
          onOpenTracking={() => {
            setBottomNavTab('tracking');
            setActiveSection('tax');
          }}
        />
      )}
      
      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation 
        activeTab={bottomNavTab}
        onTabChange={handleBottomNavChange}
      />
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onAction={(action) => {
          if (action === 'add-country') {
            setBottomNavTab('tracking');
            setActiveSection('tax');
          }
          if (action === 'add-visa') {
            setBottomNavTab('tracking');
            setActiveSection('visas');
          }
          if (action === 'add-document') setActiveSection('documents');
        }}
      />
      
      {/* AI Travel Assistant */}
      <Suspense fallback={null}>
        <AITravelAssistant 
          currentLocation={detectedLocation ? { 
            country: detectedLocation.country, 
            city: detectedLocation.city 
          } : undefined}
          citizenship={userProfile?.citizenship}
        />
      </Suspense>

      {/* Calendar reminder engine — boots the minute-tick scheduler and
          wires chat/voice/toast bridges. Pure logic, no UI. */}
      <CalendarReminderBoot />

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
        <Suspense fallback={<SectionLoader />}>
          <EnhancedProfileForm 
            onComplete={(data) => {
              onProfileComplete(data);
              setShowProfileForm(false);
            }}
            onSkip={() => setShowProfileForm(false)}
          />
        </Suspense>
      )}
    </div>
    </VoiceControlProvider>
  );
};

export default AppLayout;
