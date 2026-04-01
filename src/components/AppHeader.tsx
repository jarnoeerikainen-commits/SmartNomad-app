import React, { useState, useEffect } from 'react';
import { Globe, Menu, Settings, User, Bell, Zap, CreditCard, Crown, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LanguageSelector } from './LanguageSelector';
import { VoiceControlButton } from './VoiceControlButton';
import { SmartAlerts } from './SmartAlerts';
import { DataManagement } from './GDPRCompliance';
import { Subscription } from '@/types/subscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { DemoPersonaSelector } from './DemoPersonaSelector';
import AirQualityIndicator from './AirQualityIndicator';
import { Country } from '@/types/country';
import { AlertCircle } from 'lucide-react';
interface AppHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  subscription?: Subscription;
  onUpgradeClick?: () => void;
  countries?: Country[];
  onNavigateToSettings?: () => void;
  onNavigateToTax?: () => void;
}
const AppHeader: React.FC<AppHeaderProps> = ({
  onMenuClick,
  showMenuButton = false,
  subscription,
  onUpgradeClick,
  countries = [],
  onNavigateToSettings,
  onNavigateToTax
}) => {
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();
  const [showSmartAlerts, setShowSmartAlerts] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const handleHomeClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      window.dispatchEvent(new CustomEvent('supernomad:home'));
    }
  };

  // Calculate critical alerts
  const criticalAlerts = countries.filter(c => {
    const daysUsed = c.daysSpent || 0;
    const daysLimit = c.dayLimit || 0;
    const usagePercentage = daysLimit > 0 ? daysUsed / daysLimit * 100 : 0;
    return usagePercentage >= 90;
  }).length;
  return <header className="sticky top-0 z-[70] w-full border-b bg-card/80 backdrop-blur-md shadow-soft">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side - Menu and Logo */}
        <div className="flex items-center gap-4">
          {showMenuButton && <Button variant="ghost" size="sm" onClick={onMenuClick} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>}
          
          <Link to="/" className="flex items-center gap-3 cursor-pointer group transition-all hover:opacity-80" title="Back to Dashboard" onClick={handleHomeClick} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') handleHomeClick();
        }} role="link" tabIndex={0}>
            <img alt={`${t('app.title')} Logo`} className="h-10 w-10 rounded-xl shadow-medium transition-transform group-hover:scale-105 object-cover" src="/lovable-uploads/supernomad-logo.jpg" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold font-display tracking-tight">
                <span className="text-foreground">Super</span>
                <span style={{ background: 'linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold-light)), hsl(var(--gold-dark)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="drop-shadow-sm">Nomad</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold group-hover:text-foreground transition-colors">
                {t('app.tagline')}
              </p>
            </div>
          </Link>
        </div>

        {/* Center - AQI + Demo Personas */}
        <div className="flex items-center gap-1 sm:gap-3 min-w-0 overflow-x-auto scrollbar-hide">
          <div className="hidden sm:block shrink-0">
            <AirQualityIndicator />
          </div>
          <div className="h-5 w-px bg-border hidden sm:block shrink-0" />
          <DemoPersonaSelector />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Plan Badge */}
          {subscription && subscription.tier !== 'free' && <Badge variant="secondary" className="hidden md:flex items-center gap-1 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 text-primary font-semibold px-2 py-1">
              <Zap className="h-3 w-3" />
              <span className="capitalize text-xs">{subscription.tier.replace('-', ' ')}</span>
            </Badge>}
          
          {/* Voice Control - hidden on small mobile */}
          <div className="hidden sm:block">
            <VoiceControlButton />
          </div>
          
          {/* Language Selector */}
          <LanguageSelector />
          
          {/* Critical Alerts Indicator - Only show if there are alerts */}
          {criticalAlerts > 0 && <Button variant="ghost" size="sm" className="relative" onClick={() => setShowSmartAlerts(true)}>
              <AlertCircle className={`h-5 w-5 ${criticalAlerts > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
              {criticalAlerts > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  {criticalAlerts}
                </Badge>}
            </Button>}
          
          {/* Upgrade Button for Free Users */}
          {subscription?.tier === 'free' && onUpgradeClick && <Button variant="default" size="sm" className="hidden md:flex items-center gap-1.5 border-0 text-foreground font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all hover:scale-[1.03]" style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-glow-gold)' }} onClick={onUpgradeClick}>
                <Crown className="h-4 w-4" />
                <span>PRO</span>
            </Button>}

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
              {subscription && onUpgradeClick && <DropdownMenuItem onClick={onUpgradeClick}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>{t('header.upgrade_plan')}</span>
                  {subscription.tier === 'free' && <Badge variant="secondary" className="ml-auto text-xs">
                      {t('common.free')}
                    </Badge>}
                </DropdownMenuItem>}
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
    </header>;
};
export default AppHeader;