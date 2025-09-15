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
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  { id: 'tracking', label: 'Travel Tracking', icon: MapPin, badge: '5' },
  { id: 'tax', label: 'Tax Residency', icon: Calculator },
  { id: 'visas', label: 'Visa Manager', icon: Plane },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'health', label: 'Health & Vaccines', icon: Heart },
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
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-3 ${
                    activeSection === item.id 
                      ? 'gradient-trust text-white shadow-medium' 
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
                <span>Settings</span>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-accent/50"
                onClick={() => onSectionChange('help')}
              >
                <HelpCircle className="h-5 w-5" />
                <span>Help & Support</span>
              </Button>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="text-center text-xs text-muted-foreground">
              <p>TravelTracker v2.0</p>
              <p className="mt-1">Stay compliant worldwide</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;