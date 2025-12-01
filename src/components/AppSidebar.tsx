import React, { useState } from 'react';
import {
  Home, 
  MapPin, 
  FileText, 
  CreditCard, 
  Shield, 
  Settings, 
  HelpCircle,
  Newspaper,
  Calculator,
  Plane,
  Heart,
  AlertTriangle,
  Landmark,
  Car,
  PawPrint,
  TrendingUp,
  ChevronDown,
  DollarSign,
  Mail,
  Globe,
  Coins,
  Bus,
  Gift,
  GraduationCap,
  Users,
  Sparkles,
  Tag,
  Stethoscope,
  Scale,
  Award,
  Wifi,
  CloudRain,
  BookOpen,
  Truck,
  Shirt,
  Building2,
  Crown,
  Globe2,
  Building,
  Siren,
  ShieldCheck,
  ShieldAlert,
  Baby,
  Calendar,
  Cat,
  MessageSquare,
  Flag,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';
import { Subscription } from '@/types/subscription';

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

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'emergency', label: 'Emergency Numbers', icon: AlertTriangle, badge: 'SOS', variant: 'destructive' },
  { id: 'tax', label: 'Tax & Compliance', icon: Calculator },
  { id: 'visas', label: 'Visa Manager', icon: Plane },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'health', label: 'Health & Vaccines', icon: Heart },
  { id: 'emergency-cards', label: 'Credit Cards', icon: CreditCard, badge: 'SOS', variant: 'destructive' },
  { id: 'news', label: 'Travel News', icon: Newspaper, badge: 'NEW' },
  { id: 'alerts', label: 'Smart Alerts', icon: AlertTriangle, badge: '3', variant: 'destructive' },
  { id: 'services', label: 'Travel Services', icon: Shield },
];

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isOpen,
  onClose,
  subscription,
  onUpgradeClick
}) => {
  const { t } = useLanguage();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['safety', 'travel', 'services']);
  
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

  const menuGroups = [
    {
      id: 'main',
      label: 'Quick Actions',
      items: [
        { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
        { id: 'upgrade', label: 'Upgrade Plan', icon: TrendingUp, badge: 'PRO', variant: 'secondary' as const },
      ]
    },
    {
      id: 'safety',
      label: 'Safety First',
      items: [
        { id: 'guardian', label: 'SuperNomad Guardian', icon: ShieldCheck, badge: 'NEW', variant: 'secondary' as const },
        { id: 'threats', label: 'Threat Intelligence', icon: Shield, badge: isInDangerZone ? 'ALERT' : 'SAFE', variant: isInDangerZone ? 'destructive' as const : 'secondary' as const },
        { id: 'emergency', label: 'Emergency Contacts', icon: AlertTriangle, badge: 'SOS', variant: 'destructive' as const },
        { id: 'embassy', label: 'Embassy Directory', icon: Flag, badge: 'OFFICIAL', variant: 'secondary' as const },
        { id: 'sos-services', label: 'SOS Services', icon: Siren, badge: '24/7', variant: 'destructive' as const },
        { id: 'private-protection', label: 'Private Protection', icon: Shield, badge: 'ELITE', variant: 'secondary' as const },
        { id: 'cyber-helpline', label: 'Cyber Security', icon: ShieldAlert, badge: 'NEW', variant: 'destructive' as const },
      ]
    },
    {
      id: 'tax',
      label: 'Tax & Compliance',
      items: [
        { id: 'tax', label: 'Tax Residency Dashboard', icon: Calculator },
        { id: 'tax-residency', label: 'Country Tracker', icon: MapPin, badge: 'Core', variant: 'default' as const },
        { id: 'visas', label: 'Visa Manager', icon: Plane },
        { id: 'vault', label: 'Document Vault', icon: Shield },
      ]
    },
    {
      id: 'travel',
      label: 'Travel Essentials',
      items: [
        { id: 'public-transport', label: 'Transportation', icon: Bus },
        { id: 'esim', label: 'eSIM & VPN', icon: Wifi },
        { id: 'travel-insurance', label: 'Travel Insurance', icon: Shield },
      ]
    },
    {
      id: 'local',
      label: 'Local Living',
      items: [
        { id: 'global-city-services', label: 'City Services', icon: Building2 },
        { id: 'language-learning', label: 'Language Learning', icon: BookOpen },
        { id: 'local-nomads', label: 'Local Nomads', icon: Users },
        { id: 'explore-local', label: 'Local Events & Markets', icon: Calendar, badge: 'LIVE', variant: 'secondary' as const },
        { id: 'family-services', label: 'Nanny & Family Services', icon: Baby, badge: 'TRUSTED', variant: 'secondary' as const },
        { id: 'pet-services', label: 'Pet Services', icon: Cat },
        { id: 'moving-services', label: 'Moving Services', icon: Truck, badge: 'AI', variant: 'secondary' as const },
        { id: 'marketplace', label: 'Expat Marketplace', icon: Store, badge: 'AI', variant: 'secondary' as const },
        { id: 'social-chat', label: 'SuperNomad Vibe', icon: Users, badge: 'AI', variant: 'secondary' as const },
        { id: 'nomad-chat', label: 'SuperNomad Pulse', icon: MessageSquare, badge: 'AI', variant: 'secondary' as const },
        { id: 'news', label: 'News & Updates', icon: Newspaper },
      ]
    },
    {
      id: 'premium',
      label: 'Premium Services',
      items: [
        { id: 'ai-doctor', label: 'AI Health Advisor', icon: Stethoscope, badge: 'AI' },
        { id: 'ai-lawyer', label: 'AI Legal Advisor', icon: Scale, badge: 'AI' },
        { id: 'ai-planner', label: 'AI Travel Planner', icon: Plane, badge: 'AI' },
        { id: 'tax-advisors', label: 'Tax Advisors', icon: Calculator, badge: 'VIP', variant: 'secondary' as const },
        { id: 'business-centers', label: 'Business Centers', icon: Building2, badge: 'NEW', variant: 'secondary' as const },
        { id: 'airport-lounges', label: 'VIP Lounges', icon: Crown, badge: 'VIP', variant: 'secondary' as const },
        { id: 'private-clubs', label: 'Private Clubs', icon: Crown, badge: 'ELITE', variant: 'secondary' as const },
      ]
    },
  ];
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform border-r bg-card shadow-large transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:top-0 md:h-screen md:translate-x-0
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
                            className="w-full justify-start gap-3 gradient-success shadow-medium hover:shadow-lg"
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
                        } ${item.id === 'threats' && item.badge === 'ALERT' ? 'animate-pulse' : ''}`}
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
                  className="w-full gradient-success shadow-lg hover:shadow-xl transition-all mb-4"
                  size="lg"
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Upgrade to Premium
                </Button>
                <Separator className="my-4" />
              </>
            )}

          {/* Settings & Help */}
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
              <div className="mb-3 p-2 bg-primary/10 rounded-lg text-center">
                <p className="text-xs font-semibold text-primary capitalize">
                  {subscription.tier} Plan
                </p>
                {subscription.tier === 'free' && onUpgradeClick && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      onUpgradeClick();
                      onClose?.();
                    }}
                    className="h-auto p-0 text-xs text-primary"
                  >
                    Upgrade Now →
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