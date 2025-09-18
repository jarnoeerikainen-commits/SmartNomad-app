import React, { useState, useEffect } from 'react';
import { Globe, Menu, Settings, User, Bell, Zap, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LanguageSelector } from './LanguageSelector';
import { SmartAlerts } from './SmartAlerts';
import { DataManagement } from './GDPRCompliance';
import PricingCard from './PricingCard';
import { Subscription } from '@/types/subscription';

interface AppHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  subscription?: Subscription;
  onUpgrade?: (tier: string) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  onMenuClick, 
  showMenuButton = false, 
  subscription,
  onUpgrade 
}) => {
  const [showSmartAlerts, setShowSmartAlerts] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Listen for plan upgrade events to close modals
  useEffect(() => {
    const handlePlanUpgraded = () => {
      setShowUpgrade(false);
      setShowSmartAlerts(false);
      setShowDataManagement(false);
    };

    window.addEventListener('planUpgraded', handlePlanUpgraded);
    return () => window.removeEventListener('planUpgraded', handlePlanUpgraded);
  }, []);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md shadow-soft">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side - Menu and Logo */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-medium">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TravelTracker
              </h1>
              <p className="text-xs text-muted-foreground">
                Your global travel companion
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <LanguageSelector />
          
          {/* Smart Alerts */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            onClick={() => setShowSmartAlerts(true)}
          >
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>App Settings</span>
              </DropdownMenuItem>
              {subscription && (
                <DropdownMenuItem onClick={() => setShowUpgrade(true)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Upgrade Plan</span>
                  {subscription.tier === 'free' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Free
                    </Badge>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setShowDataManagement(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Privacy & Data</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showSmartAlerts} onOpenChange={setShowSmartAlerts}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <SmartAlerts />
        </DialogContent>
      </Dialog>

      <Dialog open={showDataManagement} onOpenChange={setShowDataManagement}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DataManagement />
        </DialogContent>
      </Dialog>

      {subscription && onUpgrade && (
        <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <PricingCard subscription={subscription} onUpgrade={onUpgrade} />
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
};

export default AppHeader;