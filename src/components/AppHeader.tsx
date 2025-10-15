import React, { useState, useEffect } from 'react';
import { Globe, Menu, Settings, User, Bell, Zap, CreditCard } from 'lucide-react';
import smartNomadLogo from '@/assets/smartnomad-logo-v2.png';
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
import UpgradeModal from './UpgradeModal';
import { Subscription } from '@/types/subscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { TimeZoneHeader } from './TimeZoneHeader';
import { Country } from '@/types/country';
import { AlertCircle } from 'lucide-react';

interface AppHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  subscription?: Subscription;
  onUpgrade?: (tier: string) => void;
  countries?: Country[];
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  onMenuClick, 
  showMenuButton = false, 
  subscription,
  onUpgrade,
  countries = []
}) => {
  const { t } = useLanguage();
  const [showSmartAlerts, setShowSmartAlerts] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Calculate critical alerts
  const criticalAlerts = countries.filter(c => {
    const daysUsed = c.daysSpent || 0;
    const daysLimit = c.dayLimit || 0;
    const usagePercentage = daysLimit > 0 ? (daysUsed / daysLimit) * 100 : 0;
    return usagePercentage >= 90;
  }).length;

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
            <img 
              src={smartNomadLogo} 
              alt="SmartNomad Logo" 
              className="h-10 w-10 rounded-xl shadow-medium"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SmartNomad
              </h1>
              <p className="text-xs text-muted-foreground">
                Your Digital Assistant for Global Living
              </p>
            </div>
          </div>
        </div>

        {/* Center - Time Zones */}
        <TimeZoneHeader />

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <LanguageSelector />
          
          {/* Critical Alerts Indicator - Only show if there are alerts */}
          {criticalAlerts > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={() => setShowSmartAlerts(true)}
            >
              <AlertCircle className={`h-5 w-5 ${criticalAlerts > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
              {criticalAlerts > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {criticalAlerts}
                </Badge>
              )}
            </Button>
          )}
          
          {/* Upgrade Button for Free Users */}
          {subscription?.tier === 'free' && onUpgrade && (
            <Button 
              variant="default"
              size="sm" 
              className="gradient-success shadow-medium hover:shadow-lg transition-all hidden md:flex"
              onClick={() => setShowUpgrade(true)}
            >
              <Zap className="h-4 w-4 mr-1" />
              <span className="font-semibold">Upgrade</span>
            </Button>
          )}

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
                <span>{t('header.profile_settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('header.app_settings')}</span>
              </DropdownMenuItem>
              {subscription && (
                <DropdownMenuItem onClick={() => setShowUpgrade(true)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>{t('header.upgrade_plan')}</span>
                  {subscription.tier === 'free' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {t('common.free')}
                    </Badge>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setShowDataManagement(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('header.privacy_data')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                {t('header.sign_out')}
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
        <UpgradeModal
          isOpen={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          subscription={subscription}
          onUpgrade={onUpgrade}
        />
      )}
    </header>
  );
};

export default AppHeader;