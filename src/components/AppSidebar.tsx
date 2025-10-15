import React from 'react';
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
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

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
  onClose 
}) => {
  const { t } = useLanguage();
  
  const sidebarItemsTranslated = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'emergency', label: 'Emergency Numbers', icon: AlertTriangle, badge: 'SOS', variant: 'destructive' as const },
    { id: 'tax', label: t('nav.tax'), icon: Calculator },
    { id: 'tax-wealthy', label: 'Tax & Wealth Management', icon: TrendingUp },
    { id: 'visas', label: t('nav.visas'), icon: Plane },
    { id: 'documents', label: t('nav.documents'), icon: FileText },
    { id: 'health', label: t('nav.health'), icon: Heart },
    { id: 'pet-services', label: 'Pet Services', icon: PawPrint },
    { id: 'emergency-cards', label: 'Credit Cards', icon: CreditCard, badge: 'SOS', variant: 'destructive' as const },
    { id: 'digital-banks', label: 'Digital Banks', icon: Landmark },
    { id: 'money-transfers', label: 'Money Transfers', icon: CreditCard },
    { id: 'crypto-cash', label: 'Crypto to Cash', icon: MapPin },
    { id: 'roadside', label: 'Roadside Assistance', icon: Car },
    { id: 'news', label: t('nav.news'), icon: Newspaper, badge: 'NEW' },
    { id: 'alerts', label: t('nav.alerts'), icon: AlertTriangle, badge: '3', variant: 'destructive' as const },
    { id: 'services', label: t('nav.services'), icon: Shield },
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
          <nav className="flex-1 space-y-2 p-4">
            <div className="space-y-1">
              {sidebarItemsTranslated.map((item) => (
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
                    <Badge 
                      variant={item.variant || 'secondary'} 
                      className="ml-auto text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Settings & Help */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-accent/50"
                onClick={() => onSectionChange('settings')}
              >
                <Settings className="h-5 w-5" />
                <span>{t('nav.settings')}</span>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-accent/50"
                onClick={() => onSectionChange('help')}
              >
                <HelpCircle className="h-5 w-5" />
                <span>{t('nav.help')}</span>
              </Button>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
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