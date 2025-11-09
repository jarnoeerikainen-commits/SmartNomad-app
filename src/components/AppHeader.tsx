import React, { useState, useEffect } from 'react';
import { Globe, Menu, Settings, User, Bell, Zap, CreditCard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import superNomadLogo from '@/assets/supernomad-logo-v2.png';
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
import { Subscription } from '@/types/subscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { TimeZoneHeader } from './TimeZoneHeader';
import { Country } from '@/types/country';
import { AlertCircle } from 'lucide-react';

interface AppHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  subscription?: Subscription;
  onUpgradeClick?: () => void;
  countries?: Country[];
  onNavigateToSettings?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  onMenuClick, 
  showMenuButton = false, 
  subscription,
  onUpgradeClick,
  countries = [],
  onNavigateToSettings
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSmartAlerts, setShowSmartAlerts] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);

  const handleHomeClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('supernomad:home'));
    }
  };

  // Calculate critical alerts
  const criticalAlerts = countries.filter(c => {
    const daysUsed = c.daysSpent || 0;
    const daysLimit = c.dayLimit || 0;
    const usagePercentage = daysLimit > 0 ? (daysUsed / daysLimit) * 100 : 0;
    return usagePercentage >= 90;
  }).length;

  return (
    <header className="sticky top-0 z-[70] w-full border-b bg-card/80 backdrop-blur-md shadow-soft">
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
          
          <Link 
            to="/" 
            className="flex items-center gap-3 cursor-pointer group transition-all hover:opacity-80"
            title="Back to Dashboard"
            onClick={handleHomeClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleHomeClick(); }}
            role="link"
            tabIndex={0}
          >
            <img 
              src={superNomadLogo} 
              alt="SuperNomad Logo" 
              className="h-10 w-10 rounded-xl shadow-medium transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all group-hover:from-accent group-hover:to-primary">
                SuperNomad
              </h1>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Your Digital Assistant for Global Living
              </p>
            </div>
          </Link>
        </div>

        {/* Center - Time Zones */}
        <TimeZoneHeader />

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Plan Badge */}
          {subscription && subscription.tier !== 'free' && (
            <Badge 
              variant="secondary" 
              className="hidden md:flex items-center gap-1 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 text-primary font-semibold px-2 py-1"
            >
              <Zap className="h-3 w-3" />
              <span className="capitalize text-xs">{subscription.tier.replace('-', ' ')}</span>
            </Badge>
          )}
          
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
          {subscription?.tier === 'free' && onUpgradeClick && (
            <Button 
              variant="default"
              size="sm" 
              className="gradient-success shadow-medium hover:shadow-lg transition-all hidden md:flex"
              onClick={onUpgradeClick}
            >
                <Zap className="h-4 w-4 mr-1" />
                <span className="font-semibold">{t('common.upgrade')}</span>
            </Button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{t('common.profile')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg z-[80]">
              <DropdownMenuItem onClick={onNavigateToSettings} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>{t('header.profile_settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onNavigateToSettings} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('header.app_settings')}</span>
              </DropdownMenuItem>
              {subscription && onUpgradeClick && (
                <DropdownMenuItem onClick={onUpgradeClick}>
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
    </header>
  );
};

export default AppHeader;