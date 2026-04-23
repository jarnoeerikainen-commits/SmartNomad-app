import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, MapPin, FileText, CreditCard, Shield, Settings, HelpCircle,
  Newspaper, Calculator, Plane, Heart, AlertTriangle, Car,
  TrendingUp, ChevronDown, DollarSign, Mail, Globe, Coins, Bus,
  GraduationCap, Users, Tag, Stethoscope, Scale, Award, Wifi,
  CloudRain, BookOpen, Truck, Building2, Crown, Globe2, Building,
  Siren, ShieldCheck, ShieldAlert, Baby, Calendar, Cat, MessageSquare,
  Flag, Store, Dumbbell, BarChart3, Wrench, Locate, Fingerprint, Plug, Sparkles, Receipt,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';
import { Subscription } from '@/types/subscription';
import { useFeaturePreferences } from '@/hooks/useFeaturePreferences';
import { SYSTEM_FEATURES } from '@/data/featureRegistry';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose?: () => void;
  subscription?: Subscription;
  onUpgradeClick?: () => void;
}

// All sidebar navigation is defined in menuGroupsRaw below

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isOpen,
  onClose,
  subscription,
  onUpgradeClick
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isVisible } = useFeaturePreferences();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['premium', 'travel', 'local']);
  const ageGroup = typeof window !== 'undefined' ? localStorage.getItem('ageGroup') || 'adult' : 'adult';
  const isTeenRestricted = ageGroup === 'teen';
  
  // Check for danger zone (imported from ThreatIntelligenceService)
  const [isInDangerZone, setIsInDangerZone] = React.useState(false);
  
  React.useEffect(() => {
    // Simulate threat checking - in real app this would call the service
    const checkThreats = () => {
      // Mock: Set to true to show blinking red badge
      setIsInDangerZone(true);
    };
    
    checkThreats();
    const interval = setInterval(checkThreats, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const menuGroupsRaw = [
    {
      id: 'main',
      label: t('sidebar.quick_actions'),
      items: [
        { id: 'admin', label: 'Back Office', icon: Briefcase, badge: 'STAFF', variant: 'default' as const },
        { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
        { id: 'customize', label: 'Customize App', icon: BarChart3 },
        { id: 'integrations', label: 'Integrations Hub', icon: Plug, badge: 'NEW', variant: 'secondary' as const },
        { id: 'corporate', label: 'Corporate Travel', icon: Briefcase, badge: 'B2B', variant: 'default' as const },
        { id: 'lifestyle-hub', label: 'Lifestyle Intelligence', icon: Sparkles, badge: 'AI', variant: 'secondary' as const },
        { id: 'upgrade', label: t('sidebar.upgrade_plan'), icon: TrendingUp, badge: 'PRO', variant: 'secondary' as const },
        { id: 'snomad-id', label: 'Snomad ID', icon: Fingerprint, badge: 'VAULT', variant: 'secondary' as const },
        { id: 'sovereign-access', label: 'Sovereign Access', icon: ShieldCheck, badge: 'NEW', variant: 'secondary' as const },
        { id: 'travel-inbox', label: 'Travel Inbox', icon: Mail, badge: 'NEW', variant: 'secondary' as const },
      ]
    },
    {
      id: 'safety',
      label: 'Safety & Emergency',
      items: [
        { id: 'threats', label: t('sidebar.threats'), icon: Shield, badge: isInDangerZone ? 'ALERT' : 'SAFE', variant: isInDangerZone ? 'destructive' as const : 'secondary' as const },
        { id: 'guardian', label: t('sidebar.guardian'), icon: ShieldCheck, badge: 'NEW', variant: 'secondary' as const },
        { id: 'emergency', label: t('sidebar.emergency'), icon: AlertTriangle, badge: 'SOS', variant: 'destructive' as const },
        { id: 'embassy', label: t('sidebar.embassy'), icon: Flag, badge: 'OFFICIAL', variant: 'secondary' as const },
        { id: 'sos-services', label: t('sidebar.sos'), icon: Siren, badge: '24/7', variant: 'destructive' as const },
        { id: 'private-protection', label: t('sidebar.protection'), icon: Shield, badge: 'ELITE', variant: 'secondary' as const },
        { id: 'cyber-helpline', label: t('sidebar.cyber'), icon: ShieldAlert, badge: 'NEW', variant: 'destructive' as const },
      ]
    },
    {
      id: 'tax',
      label: t('sidebar.tax_compliance'),
      items: [
        { id: 'expenses', label: 'Tax & Expense Hub', icon: Receipt, badge: 'NEW', variant: 'default' as const },
        { id: 'tax', label: t('sidebar.tax_dashboard'), icon: Calculator },
        { id: 'gps-monitor', label: 'GPS Day Monitor', icon: Locate, badge: 'GPS', variant: 'default' as const },
        { id: 'tax-residency', label: t('sidebar.country_tracker'), icon: MapPin, badge: 'Core', variant: 'default' as const },
        { id: 'visas', label: t('sidebar.visa_manager'), icon: Plane },
        { id: 'visa-immigration', label: 'Visa / Immigration', icon: Globe, badge: 'NEW', variant: 'secondary' as const },
        { id: 'visa-assistance', label: 'Visa Assistance', icon: Globe2 },
        { id: 'vaccination-hub', label: 'Vaccinations & Medicines', icon: Heart, badge: 'WHO', variant: 'secondary' as const },
        { id: 'etias', label: 'ETIAS 2026', icon: Shield, badge: 'EU', variant: 'secondary' as const },
        { id: 'ees', label: 'EES Border Center', icon: Shield, badge: 'LIVE', variant: 'default' as const },
        { id: 'vault', label: t('sidebar.document_vault'), icon: Shield },
        { id: 'gov-apps', label: 'Government Apps', icon: Building },
        { id: 'tax-wealthy', label: 'Tax & Wealth Help', icon: DollarSign },
      ]
    },
    {
      id: 'finance',
      label: 'Finance & Payments',
      items: [
        { id: 'payment-options', label: t('sidebar.payment_options'), icon: CreditCard, badge: 'AI', variant: 'secondary' as const },
        { id: 'award-cards', label: t('sidebar.award_cards'), icon: Award, badge: 'NEW', variant: 'secondary' as const },
        { id: 'digital-banks', label: 'Digital Banks', icon: Building2 },
        { id: 'money-transfers', label: 'Money Transfers', icon: DollarSign },
        { id: 'crypto-cash', label: 'Crypto & Digital Money', icon: Coins },
        { id: 'currency-converter', label: 'Currency Converter', icon: Globe2 },
        { id: 'emergency-cards', label: 'Emergency Cards', icon: CreditCard, badge: 'SOS', variant: 'destructive' as const },
      ]
    },
    {
      id: 'travel',
      label: t('sidebar.travel_essentials'),
      items: [
        { id: 'public-transport', label: t('sidebar.transportation'), icon: Bus },
        { id: 'taxis', label: 'Taxi & Rideshare', icon: Car },
        { id: 'car-rent-lease', label: 'Car Rental', icon: Car },
        { id: 'air-charter', label: 'Air Charter Service', icon: Plane, badge: 'AI', variant: 'secondary' as const },
        { id: 'esim', label: t('sidebar.esim_vpn'), icon: Wifi },
        { id: 'vpn-email', label: 'VPN & Email', icon: Mail },
        { id: 'travel-insurance', label: t('sidebar.travel_insurance'), icon: Shield },
        { id: 'roadside', label: 'Roadside Assistance', icon: Wrench },
        { id: 'wifi-finder', label: 'WiFi Finder', icon: Wifi },
      ]
    },
    {
      id: 'local',
      label: t('sidebar.local_living'),
      items: [
        { id: 'global-city-services', label: t('sidebar.city_services'), icon: Building2 },
        { id: 'weather-service', label: 'Weather Service', icon: CloudRain, badge: 'LIVE', variant: 'secondary' as const },
        { id: 'wellness', label: 'Wellness & Fitness', icon: Dumbbell, badge: 'NEW', variant: 'secondary' as const },
        { id: 'language-learning', label: t('sidebar.language_learning'), icon: BookOpen },
        { id: 'local-nomads', label: t('sidebar.local_nomads'), icon: Users },
        { id: 'explore-local', label: t('sidebar.local_events'), icon: Calendar, badge: 'LIVE', variant: 'secondary' as const },
        { id: 'family-services', label: t('sidebar.family_services'), icon: Baby, badge: 'TRUSTED', variant: 'secondary' as const },
        { id: 'pet-services', label: t('sidebar.pet_services'), icon: Cat },
        { id: 'moving-services', label: t('sidebar.moving_services'), icon: Truck, badge: 'AI', variant: 'secondary' as const },
        { id: 'delivery-services', label: 'Delivery Services', icon: Truck },
        { id: 'marketplace', label: t('sidebar.marketplace'), icon: Store, badge: 'AI', variant: 'secondary' as const },
        { id: 'social-chat', label: t('sidebar.social_vibe'), icon: Users, badge: 'AI', variant: 'secondary' as const },
        { id: 'nomad-chat', label: t('sidebar.nomad_pulse'), icon: MessageSquare, badge: 'AI', variant: 'secondary' as const },
        { id: 'news', label: t('sidebar.news_updates'), icon: Newspaper },
        { id: 'local-services', label: 'Local Services', icon: MapPin },
        { id: 'local-news', label: 'Local News', icon: Newspaper },
        { id: 'students', label: 'Student Services', icon: GraduationCap },
        { id: 'super-offers', label: 'Super Offers', icon: Tag, badge: 'HOT', variant: 'secondary' as const },
        { id: 'my-travel-awards', label: 'My Travel Awards', icon: Award },
      ]
    },
    {
      id: 'premium',
      label: t('sidebar.premium_services'),
      items: [
        { id: 'ai-doctor', label: t('sidebar.ai_doctor'), icon: Stethoscope, badge: 'AI' },
        { id: 'ai-lawyer', label: t('sidebar.ai_lawyer'), icon: Scale, badge: 'AI' },
        { id: 'ai-planner', label: t('sidebar.ai_planner'), icon: Plane, badge: 'AI' },
        { id: 'tax-advisors', label: t('sidebar.tax_advisors'), icon: Calculator, badge: 'VIP', variant: 'secondary' as const },
        { id: 'medical-services', label: 'Medical Services', icon: Stethoscope },
        { id: 'travel-lawyers', label: 'Travel Legal Services', icon: Scale },
        { id: 'business-centers', label: t('sidebar.business_centers'), icon: Building2, badge: 'NEW', variant: 'secondary' as const },
        { id: 'remote-offices', label: 'Remote Work Offices', icon: Building },
        { id: 'airport-lounges', label: t('sidebar.lounges'), icon: Crown, badge: 'VIP', variant: 'secondary' as const },
        { id: 'private-clubs', label: t('sidebar.clubs'), icon: Crown, badge: 'ELITE', variant: 'secondary' as const },
        { id: 'location-tracking', label: 'Location Tracking', icon: Locate },
      ]
    },
  ];

  // Hide finance & social groups for teens (16-17)
  const teenHiddenGroups = ['finance'];
  const teenHiddenItems = ['social-chat', 'nomad-chat', 'marketplace'];

  const menuGroups = menuGroupsRaw.map(group => {
    if (group.id === 'main') return group; // System group, always show
    if (isTeenRestricted && teenHiddenGroups.includes(group.id)) return { ...group, items: [] };
    let items = group.items.filter(item => SYSTEM_FEATURES.includes(item.id) || isVisible(item.id));
    if (isTeenRestricted) items = items.filter(item => !teenHiddenItems.includes(item.id));
    return { ...group, items };
  }).filter(group => group.id === 'main' || group.items.length > 0);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-black/50 md:hidden cursor-pointer" 
          onClick={() => onClose?.()}
          aria-hidden="true"
        />
      )}
      
      <aside className={`
        fixed left-0 top-16 z-[60] h-[calc(100dvh-4rem-4rem)] w-[280px] max-w-[85vw] transform border-r bg-card shadow-large transition-transform duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:top-0 md:z-auto md:h-[calc(100dvh-4rem)] md:w-64 md:max-w-64 md:translate-x-0
      `}>
        <div className="flex h-full flex-col">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuGroups.map((group) => {
              if (group.id === 'main') {
                return (
                  <div key={group.id} className="space-y-1 mb-4">
                    {group.items.map((item) => {
                      // Handle upgrade button specially
                      if (item.id === 'upgrade' && onUpgradeClick) {
                        return (
                          <Button
                            key={item.id}
                            variant="default"
                            className="w-full justify-start gap-3 border-0 text-foreground font-semibold shadow-medium hover:shadow-lg hover:scale-[1.02] transition-all"
                            style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-glow-gold)' }}
                            onClick={() => {
                              onUpgradeClick();
                              onClose?.();
                            }}
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && (
                              <Badge variant={item.variant || 'secondary'} className="ml-auto text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        );
                      }

                      // Handle Back Office (route navigation)
                      if (item.id === 'admin') {
                        return (
                          <Button
                            key={item.id}
                            variant="default"
                            className="w-full justify-start gap-3 border-0 text-[hsl(220_22%_10%)] font-semibold shadow-medium hover:shadow-lg hover:scale-[1.02] transition-all"
                            style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-glow-gold)' }}
                            onClick={() => {
                              navigate('/admin');
                              onClose?.();
                            }}
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-auto text-xs bg-[hsl(220_22%_10%)] text-[hsl(var(--gold))]">
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        );
                      }

                      return (
                        <Button
                          key={item.id}
                          variant={activeSection === item.id ? 'default' : 'ghost'}
                          className={`w-full justify-start gap-3 ${
                            activeSection === item.id 
                              ? 'gradient-trust text-primary-foreground shadow-medium' 
                              : 'hover:bg-accent/50'
                          }`}
                          onClick={() => {
                            onSectionChange(item.id);
                            onClose?.();
                          }}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <Badge variant={item.variant || 'secondary'} className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                );
              }

              return (
                <Collapsible
                  key={group.id}
                  open={expandedGroups.includes(group.id)}
                  onOpenChange={() => toggleGroup(group.id)}
                  className="space-y-1"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 hover:bg-accent/50 font-medium text-xs text-muted-foreground"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                        expandedGroups.includes(group.id) ? 'rotate-0' : '-rotate-90'
                      }`} />
                      {group.label}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 ml-2">
                    {group.items.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? 'default' : 'ghost'}
                        size="sm"
                        className={`w-full justify-start gap-3 ${
                          activeSection === item.id 
                            ? 'gradient-trust text-primary-foreground shadow-medium' 
                            : 'hover:bg-accent/50'
                        }`}
                        onClick={() => {
                          onSectionChange(item.id);
                          onClose?.();
                        }}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1 text-left text-sm">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant={item.variant || 'secondary'} 
                            className="ml-auto text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}

            <Separator className="my-4" />

            {/* Upgrade Button for Free Users */}
            {subscription?.tier === 'free' && onUpgradeClick && (
              <>
                <Button
                  onClick={() => {
                    onUpgradeClick();
                    onClose?.();
                  }}
                  className="w-full border-0 text-foreground font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all mb-4"
                  style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-glow-gold)' }}
                  size="lg"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  {t('sidebar.upgrade_premium')}
                </Button>
                <Separator className="my-4" />
              </>
            )}

          {/* Settings, Customize & Help */}
          <div className="space-y-1">
            <Button
              variant={activeSection === 'settings' ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 hover:bg-accent/50"
              onClick={() => {
                onSectionChange('settings');
                onClose?.();
              }}
            >
              <Settings className="h-5 w-5" />
              <span>{t('nav.settings')}</span>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-accent/50"
              onClick={() => {
                onSectionChange('help');
                onClose?.();
              }}
            >
              <HelpCircle className="h-5 w-5" />
              <span>{t('nav.help')}</span>
            </Button>
          </div>
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            {subscription && (
              <div className="mb-3 p-2 bg-[hsl(var(--gold)/0.1)] rounded-lg text-center">
                <p className="text-xs font-semibold text-[hsl(var(--gold-dark))] capitalize">
                  {subscription.tier} {t('sidebar.plan_label')}
                </p>
                {subscription.tier === 'free' && onUpgradeClick && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      onUpgradeClick();
                      onClose?.();
                    }}
                    className="h-auto p-0 text-xs text-[hsl(var(--gold-dark))] hover:text-[hsl(var(--gold))]"
                  >
                    {t('sidebar.upgrade_now')}
                  </Button>
                )}
              </div>
            )}
            <div className="text-center text-xs text-muted-foreground">
              <p>{t('nav.footer_version')}</p>
              <p className="mt-1">{t('nav.footer_tagline')}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;